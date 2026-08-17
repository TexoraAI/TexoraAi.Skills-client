/* ════════════════════════════════════════════════════════════════
   IlmoraMeeting.jsx
   ────────────────────────────────────────────────────────────────
   THE single, universal meeting room. Every shared meeting link —
   /ilmorameet/:joinCode — renders this exact page. Nothing here is
   hardcoded to one meeting: everything (title, host, LiveKit token,
   role) is resolved at runtime from the joinCode in the URL.

   Flow:
     1. Look up the joinCode against the backend (GET /join/{joinCode}).
     2. If the caller IS the host (backend decides via JWT -> isHost),
        skip straight to the meeting — no name prompt, no lobby.
     3. Otherwise show a pre-join screen (camera/mic preview + name),
        then send a join request (POST /{id}/join-requests) and sit
        in a lobby, polling (GET /{id}/join-requests/{requestId}) until
        the host admits or denies, exactly like Google Meet.
     4. Once admitted, fetch the actual LiveKit token via
        GET /{id}/token/guest/{requestId} — the status poll itself
        never carries a token, only a status string.
     5. Once a LiveKit token is available (host or admitted guest),
        connect and render the full Meet-style room.

   IMPORTANT: host/lobby/control endpoints on the backend are keyed by
   the meeting's numeric `id`, NOT the joinCode. Only `validate/{code}`
   and `join/{code}` are keyed by joinCode. This file resolves `id`
   once from the initial lookup and uses it for everything else.
   ════════════════════════════════════════════════════════════════ */

import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AlertTriangle,
  Loader2,
  PhoneOff,
} from "lucide-react";
import {
  getGuestToken,
  getJoinRequestStatus,
  getMeetingByJoinCode,
  joinMeetingAsHost,
  requestToJoin,
} from "@/services/liveSessionService";
import { MeetingRoom } from "./MeetingRoom";
import { DeniedScreen } from "./components/DeniedScreen";
import { LobbyScreen } from "./components/LobbyScreen";
import { PreJoinScreen } from "./components/PreJoinScreen";
import { StatusScreen } from "./components/StatusScreen";
import { LOBBY_POLL_MS } from "./constants";

/* ═════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═════════════════════════════════════════════════════════════════ */
export default function IlmoraMeeting() {
  const { joinCode } = useParams();
  const navigate = useNavigate();

  // phase: 'loading' | 'error' | 'prejoin' | 'lobby' | 'denied' | 'ended' | 'in-meeting'
  const [phase, setPhase] = useState("loading");
  const [loadError, setLoadError] = useState(null);
  const [meetingInfo, setMeetingInfo] = useState(null); // MeetingResponseDTO — has .id, .meetingStatus, .creatorName, .isHost
  const [joinRequestId, setJoinRequestId] = useState(null);
  const [guestIdentity, setGuestIdentity] = useState(null); // FIX: this is the bearer credential — must be captured and threaded through
  const [guestName, setGuestName] = useState(null);
  const [connectPayload, setConnectPayload] = useState(null); // { token, room, isHost }
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [initialAV, setInitialAV] = useState({ micOn: true, camOn: true });

  const lobbyPollRef = useRef(null);

  /* ── 1. resolve the meeting from the joinCode ──────────────────── */
  const loadMeeting = useCallback(async () => {
    setPhase("loading");
    setLoadError(null);
    try {
      const res = await getMeetingByJoinCode(joinCode);
      const info = res?.data;
      if (!info) throw new Error("Meeting not found");
      setMeetingInfo(info);

      // FIX: DTO field is meetingStatus, not status
      if (info.meetingStatus === "ENDED") {
        setPhase("ended");
        return;
      }

      if (info.isHost) {
        // Host: fetch a token directly, no lobby.
        // FIX: token endpoint is keyed by numeric id, not joinCode.
        const hostRes = await joinMeetingAsHost(info.id);
        setConnectPayload({ ...hostRes.data, isHost: true });
        setPhase("in-meeting");
      } else {
        setPhase("prejoin");
      }
    } catch (err) {
      console.error("Failed to resolve meeting:", err);
      setLoadError(
        err?.response?.status === 404
          ? "This meeting link is invalid or has expired."
          : "We couldn't load this meeting. Please check your connection and try again.",
      );
      setPhase("error");
    }
  }, [joinCode]);

  useEffect(() => {
    loadMeeting();
  }, [loadMeeting]);

  /* ── 2. guest: submit "ask to join" ────────────────────────────── */
  const handlePreJoinSubmit = useCallback(
    async ({ name, email, micOn, camOn }) => {
      if (!meetingInfo?.id) return;
      setSubmitting(true);
      setSubmitError(null);

      try {
        const res = await requestToJoin(meetingInfo.id, name, email);
        const data = res?.data;
        setJoinRequestId(data?.requestId);
        setGuestIdentity(data?.guestIdentity);
        setGuestName(name);
        setInitialAV({ micOn, camOn });

        // FIX (returning participant): backend may auto-admit a
        // recognized guest instead of leaving them PENDING — skip the
        // lobby entirely and fetch the token right away, same as a
        // normal admit.
        if (data?.status === "ADMITTED") {
          const tokenRes = await getGuestToken(
            meetingInfo.id,
            data.requestId,
            data.guestIdentity,
            name,
          );
          setConnectPayload({ ...tokenRes.data, isHost: false });
          setPhase("in-meeting");
        } else {
          setPhase("lobby");
        }
      } catch (err) {
        console.error("Join request failed:", err);
        setSubmitError(
          err?.response?.data?.error ||
            err?.response?.data?.message ||
            "Couldn't send your request. Please try again.",
        );
      } finally {
        setSubmitting(false);
      }
    },
    [meetingInfo],
  );

  /* ── 3. guest: poll lobby status until admitted/denied ─────────── */
  useEffect(() => {
    if (
      phase !== "lobby" ||
      !joinRequestId ||
      !guestIdentity ||
      !meetingInfo?.id
    )
      return undefined;

    const poll = async () => {
      try {
        // FIX: guestIdentity is a required query param on the backend —
        // omitting it means every poll 400s.
        const res = await getJoinRequestStatus(
          meetingInfo.id,
          joinRequestId,
          guestIdentity,
        );
        const status = res?.data?.status;

        if (status === "ADMITTED") {
          clearInterval(lobbyPollRef.current);
          // FIX: the status poll never returns a token — it must be
          // fetched separately once ADMITTED.
          const tokenRes = await getGuestToken(
            meetingInfo.id,
            joinRequestId,
            guestIdentity,
            guestName,
          );
          setConnectPayload({ ...tokenRes.data, isHost: false });
          setPhase("in-meeting");
        } else if (status === "DENIED") {
          clearInterval(lobbyPollRef.current);
          setPhase("denied");
        }
        // NOTE: no "CANCELLED" status exists on the backend
        // (JoinRequestStatus is PENDING | ADMITTED | DENIED only),
        // so that branch has been removed.
      } catch (_) {
        // transient network hiccup — keep polling
      }
    };
    poll();
    lobbyPollRef.current = setInterval(poll, LOBBY_POLL_MS);
    return () => clearInterval(lobbyPollRef.current);
  }, [phase, joinRequestId, guestIdentity, guestName, meetingInfo]);

  const handleCancelLobby = useCallback(() => {
    // FIX: there is no cancel/withdraw endpoint on the backend yet
    // (TODO: add one if you want the host to stop seeing a stale
    // pending request). For now we just stop polling client-side —
    // the request stays PENDING server-side until the meeting ends
    // or the host denies/admits it.
    if (lobbyPollRef.current) clearInterval(lobbyPollRef.current);
    setJoinRequestId(null);
    setGuestIdentity(null);
    setPhase("prejoin");
  }, []);

  const handleMeetingEndedRemotely = useCallback(() => {
    setPhase("ended");
  }, []);

  const handleLeftMeeting = useCallback(() => {
    navigate("/", { replace: true });
  }, [navigate]);

  /* ── render by phase ─────────────────────────────────────────────── */
  if (phase === "loading") {
    return (
      <StatusScreen
        icon={<Loader2 size={34} color="#8ab4f8" className="im-spin" />}
        title="Loading meeting…"
      />
    );
  }
  if (phase === "error") {
    return (
      <StatusScreen
        icon={<AlertTriangle size={36} color="#f28b82" />}
        title="Can't open this meeting"
        subtitle={loadError}
      />
    );
  }
  if (phase === "ended") {
    return (
      <StatusScreen
        icon={<PhoneOff size={34} color="#9aa0a6" />}
        title="This meeting has ended"
        subtitle="Thanks for joining. You can close this tab."
      />
    );
  }
  if (phase === "prejoin") {
    return (
      <PreJoinScreen
        meetingInfo={meetingInfo}
        joinCode={joinCode}
        onSubmit={handlePreJoinSubmit}
        submitting={submitting}
        error={submitError}
      />
    );
  }
  if (phase === "lobby") {
    return (
      <LobbyScreen meetingInfo={meetingInfo} onCancel={handleCancelLobby} />
    );
  }
  if (phase === "denied") {
    return <DeniedScreen onRetry={() => setPhase("prejoin")} />;
  }

  return (
    <MeetingRoom
      joinCode={joinCode}
      meetingId={meetingInfo?.id}
      meetingInfo={meetingInfo}
      connectPayload={connectPayload}
      initialAV={initialAV}
      onEndedRemotely={handleMeetingEndedRemotely}
      onLeft={handleLeftMeeting}
    />
  );
}
