import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useParams } from "react-router-dom";
import { Room, RoomEvent, Track, createLocalTracks } from "livekit-client";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MonitorUp,
  MonitorOff,
  MonitorPlay,
  PhoneOff,
  MessageSquare,
  Users,
  ChevronRight,
  ChevronLeft,
  Send,
  X,
  Timer,
  Disc2,
  PictureInPicture2,
  Hand,
  Settings,
  Captions,
  MoreVertical,
  SignalHigh,
  SmilePlus,
  Crown,
  Check,
  Clock,
  ShieldAlert,
  Loader2,
  AlertTriangle,
  Copy,
  ExternalLink,
} from "lucide-react";

// FIX: there is no meetingService.js — everything lives as named exports
// in liveSessionService.js, matching the real MeetingController routes.
import {
  getMeetingByJoinCode,
  joinMeetingAsHost,
  requestToJoin,
  getJoinRequestStatus,
  getGuestToken,
  listPendingJoinRequests,
  admitJoinRequest,
  denyJoinRequest,
  admitAllJoinRequests,
  endMeeting,
} from "@/services/liveSessionService";

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

const REACTIONS = ["👍", "❤️", "😂", "😮", "👏", "🎉"];
const getTime = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
const LOBBY_POLL_MS = 3000;
const WAITING_ROOM_POLL_MS = 4000;
const MEETING_STATUS_POLL_MS = 15000;

/* ─── small utility hooks (self-contained, no external context) ──── */

function useElapsedTimer(startedAtMs) {
  const [, tick] = useState(0);
  useEffect(() => {
    if (!startedAtMs) return undefined;
    const id = setInterval(() => tick((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, [startedAtMs]);
  if (!startedAtMs) return "00:00:00";
  const secs = Math.max(0, Math.floor((Date.now() - startedAtMs) / 1000));
  const hh = String(Math.floor(secs / 3600)).padStart(2, "0");
  const mm = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

function useResponsiveDevice() {
  const [w, setW] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1366,
  );
  useEffect(() => {
    let raf = null;
    const onResize = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setW(window.innerWidth));
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  if (w <= 767) return "phone";
  if (w <= 1023) return "tablet";
  if (w <= 1365) return "laptop";
  return "desktop";
}

function useDismiss(active, onDismiss, refs = []) {
  useEffect(() => {
    if (!active) return undefined;
    const handlePointer = (e) => {
      const insideAny = refs.some(
        (r) => r.current && r.current.contains(e.target),
      );
      if (!insideAny) onDismiss();
    };
    const handleKey = (e) => {
      if (e.key === "Escape") onDismiss();
    };
    document.addEventListener("mousedown", handlePointer, true);
    document.addEventListener("touchstart", handlePointer, true);
    document.addEventListener("keydown", handleKey, true);
    return () => {
      document.removeEventListener("mousedown", handlePointer, true);
      document.removeEventListener("touchstart", handlePointer, true);
      document.removeEventListener("keydown", handleKey, true);
    };
  }, [active, onDismiss, refs]);
}

function useInView(ref) {
  const [inView, setInView] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return undefined;
    const root = el.closest("[data-scroll-root]") || null;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { root, threshold: 0.01, rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return inView;
}

/* Builds the flat participant list (with tracks) from the raw LiveKit
   Room, the same shape LiveRoom.jsx's context normally provides — but
   derived locally here since this page owns the Room itself. */
function buildParticipantList(room, raisedHands, speakingSet) {
  if (!room) return [];
  const list = [];
  const addOne = (participant, isLocal) => {
    const videoPubs = Array.from(
      participant.videoTrackPublications?.values?.() || [],
    );
    const audioPubs = Array.from(
      participant.audioTrackPublications?.values?.() || [],
    );
    const camPub = videoPubs.find((p) => p.source === Track.Source.Camera);
    const screenPub = videoPubs.find(
      (p) => p.source === Track.Source.ScreenShare,
    );
    const micPub = audioPubs.find((p) => p.source === Track.Source.Microphone);
    const identity = isLocal ? participant.identity : participant.identity;
    list.push({
      identity,
      name: isLocal
        ? "You"
        : participant.name || participant.identity || "Guest",
      isLocal,
      isHost: !!participant.metadata && safeParse(participant.metadata)?.isHost,
      cameraTrack: camPub?.track || null,
      cameraMuted: !camPub || !!camPub.isMuted || !camPub.track,
      screenTrack: screenPub?.track || null,
      micTrack: !isLocal ? micPub?.track || null : null,
      micMuted: micPub ? !!micPub.isMuted : true,
      isSpeaking: speakingSet?.has(identity) || false,
    });
  };
  addOne(room.localParticipant, true);
  room.remoteParticipants.forEach((p) => addOne(p, false));
  return list;
}

function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch (_) {
    return null;
  }
}

/* ─── media element wrappers ─────────────────────────────────────── */

function VideoTrackEl({ track, mirrored, fit = "cover", hidden, videoRef }) {
  const internalRef = useRef(null);
  useEffect(() => {
    const el = internalRef.current;
    if (!track || !el) return undefined;
    track.attach(el);
    return () => {
      try {
        track.detach(el);
      } catch (_) {}
    };
  }, [track]);
  return (
    <video
      ref={(node) => {
        internalRef.current = node;
        if (videoRef) videoRef.current = node;
      }}
      autoPlay
      playsInline
      muted
      style={
        hidden
          ? {
              position: "absolute",
              left: -9999,
              top: -9999,
              width: 2,
              height: 2,
              opacity: 0,
              pointerEvents: "none",
            }
          : {
              width: "100%",
              height: "100%",
              objectFit: fit,
              transform: mirrored ? "scaleX(-1)" : "none",
              display: "block",
              background: "#000",
            }
      }
    />
  );
}

function AudioTrackEl({ track }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!track || !el) return undefined;
    track.attach(el);
    el.play?.().catch(() => {});
    return () => {
      try {
        track.detach(el);
      } catch (_) {}
    };
  }, [track]);
  return <audio ref={ref} autoPlay data-remote-audio="1" />;
}

/* ─── PiP floating panel ─────────────────────────────────────────── */
function PiPPanel({
  track,
  isScreen,
  label,
  timer,
  micOn,
  onToggleMic,
  onReturn,
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        background: "#000",
        display: "flex",
        flexDirection: "column",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div style={{ flex: 1, minHeight: 0, position: "relative" }}>
        {track ? (
          <VideoTrackEl track={track} fit={isScreen ? "contain" : "cover"} />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#94a3b8",
              fontSize: 13,
            }}
          >
            Meeting in progress…
          </div>
        )}
        <div
          style={{
            position: "absolute",
            top: 6,
            left: 8,
            fontSize: 11,
            color: "#fff",
            background: "rgba(0,0,0,.55)",
            padding: "3px 8px",
            borderRadius: 6,
          }}
        >
          {timer}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 6,
            left: 8,
            fontSize: 10,
            color: "#fff",
            background: "rgba(0,0,0,.55)",
            padding: "2px 7px",
            borderRadius: 6,
          }}
        >
          {label}
        </div>
      </div>
      <div
        style={{
          flexShrink: 0,
          display: "flex",
          gap: 6,
          padding: 6,
          background: "#0d1117",
        }}
      >
        <button
          onClick={onToggleMic}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            padding: "6px 8px",
            borderRadius: 8,
            border: "none",
            background: micOn ? "rgba(255,255,255,.12)" : "#7f1d1d",
            color: micOn ? "#e2e8f0" : "#fca5a5",
            fontSize: 11,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {micOn ? <Mic size={13} /> : <MicOff size={13} />}
          {micOn ? "Mute" : "Unmute"}
        </button>
        <button
          onClick={onReturn}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            padding: "6px 8px",
            borderRadius: 8,
            border: "none",
            background: "rgba(34,211,238,.18)",
            color: "#67e8f9",
            fontSize: 11,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Return to meeting
        </button>
      </div>
    </div>
  );
}

/* ─── reaction floaters ──────────────────────────────────────────── */
function EmojiFloaters({ floaters, S }) {
  return (
    <div style={S.floaterLayer} aria-hidden="true">
      {floaters.map((f, i) => (
        <div
          key={f.id}
          style={{
            ...S.floater,
            left: `${10 + ((i * 13) % 74)}%`,
            animationDelay: `${(i % 4) * 0.08}s`,
          }}
        >
          <span style={S.floaterEmoji}>{f.emoji}</span>
          <span style={S.floaterName}>{f.name}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── video tiles: strip / grid / stage ─────────────────────────── */
function StripTile({ p, active, raised, S }) {
  const wrapRef = useRef(null);
  const inView = useInView(wrapRef);
  const hasVideo = !!p.cameraTrack && !p.cameraMuted && inView;
  const initial = (p.name || "?").trim().charAt(0).toUpperCase() || "?";
  return (
    <div
      ref={wrapRef}
      className={`im-strip-tile${active ? " im-strip-tile-active" : ""}${p.isSpeaking ? " im-speaking" : ""}`}
      style={S.stripTile}
    >
      {hasVideo ? (
        <VideoTrackEl track={p.cameraTrack} mirrored={p.isLocal} fit="cover" />
      ) : (
        <div style={S.stripAvatarWrap}>
          <div
            style={{
              ...S.stripAvatar,
              background: p.isLocal
                ? "linear-gradient(135deg,#0ea5e9,#6366f1)"
                : "linear-gradient(135deg,#8b5cf6,#ec4899)",
            }}
          >
            {initial}
          </div>
        </div>
      )}
      {!p.isLocal && p.micTrack && <AudioTrackEl track={p.micTrack} />}
      {(raised || p.isHost) && (
        <div style={S.stripBadgeTopLeft}>
          {raised ? (
            <Hand size={11} color="#1a1a1a" />
          ) : (
            <Crown size={11} color="#1a1a1a" />
          )}
        </div>
      )}
      <div style={S.stripMicDot}>
        {p.micMuted ? <MicOff size={10} /> : <Mic size={10} />}
      </div>
      <div style={S.stripName}>{p.isLocal ? "You" : p.name}</div>
    </div>
  );
}

function StripOverflow({ count, S }) {
  return (
    <div
      style={{ ...S.stripTile, ...S.stripOverflow }}
      className="im-strip-tile"
    >
      <span style={{ fontSize: 13, fontWeight: 700, color: "#cbd5e1" }}>
        +{count}
      </span>
      <span style={{ fontSize: 9, color: "#64748b", marginTop: 2 }}>
        others
      </span>
    </div>
  );
}

function StageTile({ p, raised, S }) {
  if (!p) {
    return (
      <div style={S.stageOuter}>
        <div style={S.stage}>
          <div style={S.stageEmpty}>Waiting for others to join…</div>
        </div>
      </div>
    );
  }
  const isScreen = !!p.screenTrack;
  const track = isScreen ? p.screenTrack : p.cameraTrack;
  const hasVideo = !!track && (isScreen || !p.cameraMuted);
  const initial = (p.name || "?").trim().charAt(0).toUpperCase() || "?";
  const speaking = !isScreen && !!p.isSpeaking;
  return (
    <div style={S.stageOuter}>
      <div
        style={S.stage}
        className={`im-stage${speaking ? " im-speaking" : ""}`}
      >
        {hasVideo ? (
          <VideoTrackEl
            track={track}
            mirrored={!isScreen && p.isLocal}
            fit={isScreen ? "contain" : "cover"}
          />
        ) : (
          <div style={S.stageAvatarWrap}>
            <div style={S.stageAvatar}>{initial}</div>
          </div>
        )}
        {!p.isLocal && p.micTrack && <AudioTrackEl track={p.micTrack} />}
        {isScreen && (
          <div style={S.screenLabel}>
            <MonitorPlay size={13} />
            {p.isLocal ? "You are presenting" : `${p.name} is presenting`}
          </div>
        )}
        <div style={S.stageNameTag}>
          {p.micMuted ? <MicOff size={13} /> : <Mic size={13} />}
          <span>{p.isLocal ? "You" : p.name}</span>
        </div>
        {p.isHost && <span style={S.stageHostTag}>Host</span>}
        {raised && (
          <div style={S.stageHandBadge}>
            <Hand size={14} color="#1a1a1a" />
            <span>Hand raised</span>
          </div>
        )}
      </div>
    </div>
  );
}

function gridColumns(n) {
  if (n <= 1) return 1;
  if (n === 2) return 2;
  if (n <= 4) return 2;
  if (n <= 9) return 3;
  return Math.min(Math.ceil(Math.sqrt(n)), 5);
}

function GridTile({ p, raised, S }) {
  const wrapRef = useRef(null);
  const inView = useInView(wrapRef);
  const hasVideo = !!p.cameraTrack && !p.cameraMuted && inView;
  const initial = (p.name || "?").trim().charAt(0).toUpperCase() || "?";
  return (
    <div ref={wrapRef} style={S.gridCellOuter}>
      <div
        style={S.gridTile}
        className={`im-grid-tile${p.isSpeaking ? " im-speaking" : ""}`}
      >
        {hasVideo ? (
          <VideoTrackEl
            track={p.cameraTrack}
            mirrored={p.isLocal}
            fit="cover"
          />
        ) : (
          <div style={S.stageAvatarWrap}>
            <div
              style={{
                ...S.gridAvatar,
                background: p.isLocal
                  ? "linear-gradient(135deg,#0ea5e9,#6366f1)"
                  : "linear-gradient(135deg,#8b5cf6,#ec4899)",
              }}
            >
              {initial}
            </div>
          </div>
        )}
        {!p.isLocal && p.micTrack && <AudioTrackEl track={p.micTrack} />}
        <div style={S.gridNameTag}>
          {p.micMuted ? <MicOff size={12} /> : <Mic size={12} />}
          <span>{p.isLocal ? "You" : p.name}</span>
        </div>
        {p.isHost && <span style={S.gridHostTag}>Host</span>}
        {raised && (
          <div style={S.gridHandBadge}>
            <Hand size={12} color="#1a1a1a" />
          </div>
        )}
      </div>
    </div>
  );
}

function ParticipantGrid({ participants, raisedHands, handRaised, S }) {
  const cols = gridColumns(participants.length);
  const style = {
    ...S.gridWrap,
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    "--cols-tablet": Math.min(cols, 3),
    "--cols-phone": Math.min(cols, 2),
    "--cols-small": 1,
  };
  return (
    <div style={style} className="im-grid">
      {participants.map((p) => (
        <GridTile
          key={p.identity}
          p={p}
          raised={p.isLocal ? handRaised : !!raisedHands[p.identity]}
          S={S}
        />
      ))}
    </div>
  );
}

const PersonRow = ({ name, isHost, self, handRaised, S }) => (
  <div style={S.pRow}>
    <div
      style={{
        ...S.pAv,
        background: self
          ? "linear-gradient(135deg,#0ea5e9,#6366f1)"
          : "linear-gradient(135deg,#8b5cf6,#ec4899)",
      }}
    >
      {(name || "?")[0]}
    </div>
    <span style={S.pName}>{name}</span>
    {handRaised && <Hand size={13} color="#fbbf24" />}
    {isHost && <span style={S.hostTag}>Host</span>}
    {self && <span style={S.youTag}>You</span>}
  </div>
);
const LETTER_COLORS = [
  "#f43f5e",
  "#f59e0b",
  "#22c55e",
  "#0ea5e9",
  "#6366f1",
  "#a855f7",
  "#ec4899",
  "#14b8a6",
  "#eab308",
  "#ef4444",
];

function ColorfulTitle({ text, style, className }) {
  return (
    <span style={style} className={className}>
      {text
        .toUpperCase()
        .split("")
        .map((ch, i) => (
          <span
            key={i}
            style={{ color: LETTER_COLORS[i % LETTER_COLORS.length] }}
          >
            {ch === " " ? "\u00A0" : ch}
          </span>
        ))}
    </span>
  );
}

const Btn = ({
  icon,
  label,
  active,
  danger,
  leave,
  badge,
  onClick,
  btnRef,
  pressed,
  ariaHasPopup,
  ariaExpanded,
  S,
}) => {
  const [hov, setHov] = useState(false);
  const bg = leave
    ? hov
      ? "#dc2626"
      : "#ef4444"
    : danger
      ? hov
        ? "#991b1b"
        : "#7f1d1d"
      : active
        ? hov
          ? "rgba(109,94,247,.34)"
          : "rgba(109,94,247,.20)"
        : hov
          ? "rgba(255,255,255,.10)"
          : "rgba(255,255,255,.05)";
  const col = leave
    ? "#fff"
    : danger
      ? "#fca5a5"
      : active
        ? "#c4b8ff"
        : "#cbd5e1";
  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      <button
        ref={btnRef}
        className="im-ctrl-btn"
        onClick={onClick}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        aria-label={label}
        aria-pressed={typeof pressed === "boolean" ? pressed : undefined}
        aria-haspopup={ariaHasPopup}
        aria-expanded={ariaExpanded}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          background: bg,
          color: col,
          border: danger
            ? "1px solid rgba(239,68,68,.3)"
            : active
              ? "1px solid rgba(109,94,247,.45)"
              : "1px solid rgba(255,255,255,.06)",
          borderRadius: 14,
          padding: "10px 16px",
          cursor: "pointer",
          fontSize: 10,
          fontWeight: 600,
          fontFamily: "inherit",
          letterSpacing: 0.2,
          flexShrink: 0,
          boxShadow: active
            ? "0 0 0 1px rgba(109,94,247,.25), 0 6px 16px -4px rgba(109,94,247,.35)"
            : "none",
        }}
      >
        {icon}
        <span className="im-btn-label">{label}</span>
      </button>
      {!!badge && <span style={S.ctrlBadge}>{badge}</span>}
    </div>
  );
};

/* ═════════════════════════════════════════════════════════════════
   PRE-JOIN SCREEN — camera/mic preview + name (guests only; the host
   never sees this, they're dropped straight into the meeting).
═════════════════════════════════════════════════════════════════ */
// function PreJoinScreen({ meetingInfo, joinCode, onSubmit, submitting, error }) {
//   const [name, setName] = useState(() => {
//     try {
//       const u = JSON.parse(localStorage.getItem("lms_user") || "{}");
//       return u?.name || "";
//     } catch {
//       return "";
//     }
//   });
//   const [micOn, setMicOn] = useState(true);
//   const [camOn, setCamOn] = useState(true);
//   const [previewTrack, setPreviewTrack] = useState(null);
//   const [previewError, setPreviewError] = useState(null);

//   useEffect(() => {
//     let localTracks = [];
//     let cancelled = false;
//     (async () => {
//       try {
//         localTracks = await createLocalTracks({ audio: true, video: true });
//         if (cancelled) {
//           localTracks.forEach((t) => t.stop());
//           return;
//         }
//         const cam = localTracks.find((t) => t.kind === Track.Kind.Video);
//         if (cam) setPreviewTrack(cam);
//       } catch (err) {
//         setPreviewError(
//           "Camera/microphone permission was blocked. You can still join with audio/video off.",
//         );
//       }
//     })();
//     return () => {
//       cancelled = true;
//       localTracks.forEach((t) => {
//         try {
//           t.stop();
//         } catch (_) {}
//       });
//     };
//   }, []);

//   const videoRef = useRef(null);
//   useEffect(() => {
//     const el = videoRef.current;
//     if (!el || !previewTrack) return undefined;
//     if (camOn) previewTrack.attach(el);
//     else previewTrack.detach(el);
//     return () => {
//       try {
//         previewTrack.detach(el);
//       } catch (_) {}
//     };
//   }, [previewTrack, camOn]);

//   const handleSubmit = () => {
//     onSubmit({ name: name.trim() || "Guest", micOn, camOn });
//   };

//   return (
//     <div style={PJ.root}>
//       <div style={PJ.card}>
//         <div style={PJ.previewBox}>
//           {camOn && previewTrack ? (
//             <video
//               ref={videoRef}
//               autoPlay
//               muted
//               playsInline
//               style={{
//                 width: "100%",
//                 height: "100%",
//                 objectFit: "cover",
//                 transform: "scaleX(-1)",
//               }}
//             />
//           ) : (
//             <div style={PJ.previewAvatarWrap}>
//               <div style={PJ.previewAvatar}>
//                 {(name || "G").trim().charAt(0).toUpperCase()}
//               </div>
//             </div>
//           )}
//           <div style={PJ.previewCtrls}>
//             <button
//               style={{ ...PJ.previewBtn, ...(micOn ? {} : PJ.previewBtnOff) }}
//               onClick={() => setMicOn((v) => !v)}
//               title={micOn ? "Mute" : "Unmute"}
//             >
//               {micOn ? <Mic size={18} /> : <MicOff size={18} />}
//             </button>
//             <button
//               style={{ ...PJ.previewBtn, ...(camOn ? {} : PJ.previewBtnOff) }}
//               onClick={() => setCamOn((v) => !v)}
//               title={camOn ? "Stop camera" : "Start camera"}
//             >
//               {camOn ? <Video size={18} /> : <VideoOff size={18} />}
//             </button>
//           </div>
//         </div>

//         <div style={PJ.infoCol}>
//           <h1 style={PJ.title}>{meetingInfo?.title || "Ilmora Meeting"}</h1>
//           {/* FIX: DTO field is creatorName, not hostName */}
//           <p style={PJ.subtitle}>
//             Hosted by{" "}
//             <strong>{meetingInfo?.creatorName || "the meeting host"}</strong>
//           </p>
//           <p style={PJ.code}>
//             Meeting code: <span>{joinCode}</span>
//           </p>

//           <label style={PJ.label}>Your name</label>
//           <input
//             style={PJ.input}
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             placeholder="Enter your name"
//             maxLength={40}
//             onKeyDown={(e) => {
//               if (e.key === "Enter") handleSubmit();
//             }}
//           />

//           {previewError && (
//             <p style={PJ.warnText}>
//               <AlertTriangle size={13} /> {previewError}
//             </p>
//           )}
//           {error && <p style={PJ.errText}>{error}</p>}

//           <button
//             style={{ ...PJ.joinBtn, opacity: submitting ? 0.7 : 1 }}
//             disabled={submitting}
//             onClick={handleSubmit}
//           >
//             {submitting ? <Loader2 size={16} className="im-spin" /> : null}
//             {submitting ? "Requesting to join…" : "Ask to join"}
//           </button>
//           <p style={PJ.hint}>Someone in the meeting will let you in soon.</p>
//         </div>
//       </div>
//     </div>
//   );
// }
function PreJoinScreen({ meetingInfo, joinCode, onSubmit, submitting, error }) {
  const [name, setName] = useState(() => {
    try {
      const u = JSON.parse(localStorage.getItem("lms_user") || "{}");
      return u?.name || "";
    } catch {
      return "";
    }
  });
  const [email, setEmail] = useState(() => {
    try {
      const u = JSON.parse(localStorage.getItem("lms_user") || "{}");
      return u?.email || "";
    } catch {
      return "";
    }
  });
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [previewTrack, setPreviewTrack] = useState(null);
  const [previewError, setPreviewError] = useState(null);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  useEffect(() => {
    let localTracks = [];
    let cancelled = false;
    (async () => {
      try {
        localTracks = await createLocalTracks({ audio: true, video: true });
        if (cancelled) {
          localTracks.forEach((t) => t.stop());
          return;
        }
        const cam = localTracks.find((t) => t.kind === Track.Kind.Video);
        if (cam) setPreviewTrack(cam);
      } catch (err) {
        setPreviewError(
          "Camera/microphone permission was blocked. You can still join with audio/video off.",
        );
      }
    })();
    return () => {
      cancelled = true;
      localTracks.forEach((t) => {
        try {
          t.stop();
        } catch (_) {}
      });
    };
  }, []);

  const videoRef = useRef(null);
  useEffect(() => {
    const el = videoRef.current;
    if (!el || !previewTrack) return undefined;
    if (camOn) previewTrack.attach(el);
    else previewTrack.detach(el);
    return () => {
      try {
        previewTrack.detach(el);
      } catch (_) {}
    };
  }, [previewTrack, camOn]);

  const handleSubmit = () => {
    if (!emailValid || submitting) return;
    onSubmit({
      name: name.trim() || "Guest",
      email: email.trim(),
      micOn,
      camOn,
    });
  };

  return (
    <div style={PJ.root}>
      <div style={PJ.card}>
        <div style={PJ.previewBox}>
          {camOn && previewTrack ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: "scaleX(-1)",
              }}
            />
          ) : (
            <div style={PJ.previewAvatarWrap}>
              <div style={PJ.previewAvatar}>
                {(name || "G").trim().charAt(0).toUpperCase()}
              </div>
            </div>
          )}
          <div style={PJ.previewCtrls}>
            <button
              style={{ ...PJ.previewBtn, ...(micOn ? {} : PJ.previewBtnOff) }}
              onClick={() => setMicOn((v) => !v)}
              title={micOn ? "Mute" : "Unmute"}
            >
              {micOn ? <Mic size={18} /> : <MicOff size={18} />}
            </button>
            <button
              style={{ ...PJ.previewBtn, ...(camOn ? {} : PJ.previewBtnOff) }}
              onClick={() => setCamOn((v) => !v)}
              title={camOn ? "Stop camera" : "Start camera"}
            >
              {camOn ? <Video size={18} /> : <VideoOff size={18} />}
            </button>
          </div>
        </div>

        <div style={PJ.infoCol}>
          {/* <h1 style={PJ.title}>{meetingInfo?.title || "Ilmora Meeting"}</h1> */}
          <h1 style={PJ.title}>
            <ColorfulTitle text={meetingInfo?.title || "Ilmorameet"} />
          </h1>
          <p style={PJ.subtitle}>
            Hosted by{" "}
            <strong>{meetingInfo?.creatorName || "the meeting host"}</strong>
          </p>
          <p style={PJ.code}>
            Meeting code: <span>{joinCode}</span>
          </p>

          <label style={PJ.label}>Your name</label>
          <input
            style={PJ.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            maxLength={40}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
          />

          <label style={PJ.label}>Your email</label>
          <input
            style={PJ.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            type="email"
            maxLength={100}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
          />
          {email.length > 0 && !emailValid && (
            <p style={PJ.errText}>Enter a valid email address</p>
          )}

          {previewError && (
            <p style={PJ.warnText}>
              <AlertTriangle size={13} /> {previewError}
            </p>
          )}
          {error && <p style={PJ.errText}>{error}</p>}

          <button
            style={{
              ...PJ.joinBtn,
              opacity: submitting || !emailValid ? 0.7 : 1,
            }}
            disabled={submitting || !emailValid}
            onClick={handleSubmit}
          >
            {submitting ? <Loader2 size={16} className="im-spin" /> : null}
            {submitting ? "Requesting to join…" : "Ask to join"}
          </button>
          <p style={PJ.hint}>Someone in the meeting will let you in soon.</p>
        </div>
      </div>
    </div>
  );
}
/* ═════════════════════════════════════════════════════════════════
   LOBBY SCREEN — guest waiting for host to admit
═════════════════════════════════════════════════════════════════ */
function LobbyScreen({ meetingInfo, onCancel }) {
  return (
    <div style={PJ.root}>
      <div style={LB.card}>
        <div style={LB.pulseWrap}>
          <div style={LB.pulseDot} />
          <Clock size={30} color="#93c5fd" />
        </div>
        <h2 style={LB.title}>Asking to join…</h2>
        <p style={LB.subtitle}>
          You'll join <strong>{meetingInfo?.title || "this meeting"}</strong> as
          soon as the host lets you in.
        </p>
        <button style={LB.cancelBtn} onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}

function DeniedScreen({ onRetry }) {
  return (
    <div style={PJ.root}>
      <div style={LB.card}>
        <ShieldAlert size={38} color="#f87171" />
        <h2 style={LB.title}>Your request was declined</h2>
        <p style={LB.subtitle}>The host didn't let you into this meeting.</p>
        <button style={LB.cancelBtn} onClick={onRetry}>
          Try again
        </button>
      </div>
    </div>
  );
}

function StatusScreen({ icon, title, subtitle }) {
  return (
    <div style={PJ.root}>
      <div style={LB.card}>
        {icon}
        <h2 style={LB.title}>{title}</h2>
        {subtitle && <p style={LB.subtitle}>{subtitle}</p>}
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════
   WAITING ROOM PANEL — host-only: admit/deny pending guests
═════════════════════════════════════════════════════════════════ */
function WaitingRoomPanel({ waiting, onAdmit, onDeny, onAdmitAll, S }) {
  if (!waiting.length) {
    return <p style={S.emptyPpl}>No one is waiting to join.</p>;
  }
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        padding: "0 2px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 4px",
        }}
      >
        <span style={{ fontSize: 12, fontWeight: 700, color: "#fbbf24" }}>
          {waiting.length} waiting to join
        </span>
        <button
          onClick={onAdmitAll}
          style={{
            background: "rgba(109,94,247,.18)",
            border: "1px solid rgba(109,94,247,.35)",
            color: "#c4b8ff",
            borderRadius: 8,
            padding: "5px 10px",
            fontSize: 11,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Admit all
        </button>
      </div>
      {waiting.map((w) => (
        <div key={w.requestId} style={S.pRow}>
          <div
            style={{
              ...S.pAv,
              background: "linear-gradient(135deg,#f59e0b,#ea7c0e)",
            }}
          >
            {(w.name || "?")[0]}
          </div>
          <span style={S.pName}>{w.name}</span>
          <button
            onClick={() => onDeny(w.requestId)}
            title="Deny"
            style={{
              background: "rgba(239,68,68,.14)",
              border: "1px solid rgba(239,68,68,.3)",
              color: "#fca5a5",
              borderRadius: 8,
              width: 30,
              height: 30,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <X size={14} />
          </button>
          <button
            onClick={() => onAdmit(w.requestId)}
            title="Admit"
            style={{
              background: "rgba(34,197,94,.16)",
              border: "1px solid rgba(34,197,94,.35)",
              color: "#86efac",
              borderRadius: 8,
              width: 30,
              height: 30,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <Check size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}

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
  //   const handlePreJoinSubmit = useCallback(
  //     async ({ name }) => {
  //       if (!meetingInfo?.id) return;
  //       setSubmitting(true);
  //       setSubmitError(null);
  //       try {
  //         // FIX: backend reads a flat { guestName } body keyed by numeric id,
  //         // not { name } keyed by joinCode.
  //         const res = await requestToJoin(meetingInfo.id, name);
  //         const data = res?.data; // MeetingJoinRequestDTO: {requestId, guestIdentity, guestName, status}
  //         setJoinRequestId(data?.requestId);
  //         setGuestIdentity(data?.guestIdentity); // FIX: must be captured — it's the guest's only credential
  //         setGuestName(name);
  //         setPhase("lobby");
  //       } catch (err) {
  //         console.error("Join request failed:", err);
  //         setSubmitError(
  //           err?.response?.data?.error ||
  //             err?.response?.data?.message ||
  //             "Couldn't send your request. Please try again.",
  //         );
  //       } finally {
  //         setSubmitting(false);
  //       }
  //     },
  //     [meetingInfo],
  //   );
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
        setPhase("lobby");
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
        icon={<Loader2 size={34} color="#93c5fd" className="im-spin" />}
        title="Loading meeting…"
      />
    );
  }
  if (phase === "error") {
    return (
      <StatusScreen
        icon={<AlertTriangle size={36} color="#f87171" />}
        title="Can't open this meeting"
        subtitle={loadError}
      />
    );
  }
  if (phase === "ended") {
    return (
      <StatusScreen
        icon={<PhoneOff size={34} color="#94a3b8" />}
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

  //   return (
  //     <MeetingRoom
  //       joinCode={joinCode}
  //       meetingId={meetingInfo?.id}
  //       meetingInfo={meetingInfo}
  //       connectPayload={connectPayload}
  //       onEndedRemotely={handleMeetingEndedRemotely}
  //       onLeft={handleLeftMeeting}
  //     />
  //   );
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

/* ═════════════════════════════════════════════════════════════════
   MEETING ROOM — the actual LiveKit-connected Google-Meet-style room.
   Owns the Room instance directly; renders identically for host and
   guests except for host-only affordances (waiting room, recording,
   End meeting for everyone vs. Leave).
═════════════════════════════════════════════════════════════════ */
// function MeetingRoom({
//   joinCode,
//   meetingId,
//   meetingInfo,
//   connectPayload,
//   onEndedRemotely,
//   onLeft,
// }) {
function MeetingRoom({
  joinCode,
  meetingId,
  meetingInfo,
  connectPayload,
  initialAV,
  onEndedRemotely,
  onLeft,
}) {
  const roomRef = useRef(null);
  const localCamRef = useRef(null);
  const localMicRef = useRef(null);
  const chatEndRef = useRef(null);
  const waitingPollRef = useRef(null);
  const statusPollRef = useRef(null);
  const pipFallbackVideoRef = useRef(null);
  const menuBtnRef = useRef(null);
  const menuPanelRef = useRef(null);
  const reactionBtnRef = useRef(null);
  const reactionPanelRef = useRef(null);

  const [connected, setConnected] = useState(false);
  //   const [micOn, setMicOn] = useState(true);
  //   const [camOn, setCamOn] = useState(true);
  const [micOn, setMicOn] = useState(initialAV?.micOn ?? true);
  const [camOn, setCamOn] = useState(initialAV?.camOn ?? true);
  const [screenOn, setScreenOn] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState(() => [
    {
      id: 0,
      system: true,
      text: "You're connected. Say hello!",
      time: getTime(),
    },
  ]);
  const [msgInput, setMsgInput] = useState("");
  const [raisedHands, setRaisedHands] = useState({});
  const [floaters, setFloaters] = useState([]);
  const [joinedAt, setJoinedAt] = useState(null);

  const [sidebarOpen, setSidebarOpen] = useState(() =>
    typeof window === "undefined" ? true : window.innerWidth > 1023,
  );
  const [sidebarTab, setSidebarTab] = useState("chat"); // chat | people | waiting
  const [menuOpen, setMenuOpen] = useState(false);
  const [reactionPickerOpen, setReactionPickerOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [captionsOn, setCaptionsOn] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recToggling, setRecToggling] = useState(false);
  const [pipWindow, setPipWindow] = useState(null);
  const [copyToast, setCopyToast] = useState(false);
  const [endedToast, setEndedToast] = useState(false);
  const [reactionPos, setReactionPos] = useState(null);

  const [waiting, setWaiting] = useState([]);

  const isHost = !!connectPayload?.isHost;
  const device = useResponsiveDevice();
  const isCompactDevice = device === "phone";
  const timer = useElapsedTimer(joinedAt);
  const handRaised = !!raisedHands.you;
  const shareLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/ilmorameet/${joinCode}`
      : "";

  const rebuild = useCallback(() => {
    setParticipants(buildParticipantList(roomRef.current));
  }, []);

  const pushSystem = useCallback((text) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), system: true, text, time: getTime() },
    ]);
  }, []);

  const spawnFloater = useCallback((emoji, name) => {
    const id = Date.now() + Math.random();
    setFloaters((prev) => [...prev, { id, emoji, name }]);
    setTimeout(
      () => setFloaters((prev) => prev.filter((f) => f.id !== id)),
      2600,
    );
  }, []);

  /* ── connect to LiveKit once we have a token ─────────────────────── */
  useEffect(() => {
    if (!connectPayload?.token) return undefined;
    const serverUrl = import.meta.env.VITE_LIVEKIT_URL || "ws://localhost:7880";
    let cancelled = false;

    const start = async () => {
      const room = new Room({ adaptiveStream: true, dynacast: true });
      roomRef.current = room;

      const onData = (payload, participant) => {
        try {
          const decoded = new TextDecoder().decode(payload);
          const msg = JSON.parse(decoded);
          if (msg.type === "chat" && msg.text) {
            setMessages((prev) => [
              ...prev,
              {
                id: Date.now() + Math.random(),
                name: participant?.name || participant?.identity || "Guest",
                text: msg.text,
                time: getTime(),
                self: false,
              },
            ]);
          } else if (msg.type === "reaction" && msg.emoji) {
            spawnFloater(
              msg.emoji,
              participant?.name || participant?.identity || "Someone",
            );
          } else if (msg.type === "hand") {
            setRaisedHands((prev) => ({
              ...prev,
              [participant?.identity]: !!msg.raised,
            }));
          }
        } catch (_) {}
      };

      room.on(RoomEvent.TrackSubscribed, rebuild);
      room.on(RoomEvent.TrackUnsubscribed, rebuild);
      room.on(RoomEvent.TrackMuted, rebuild);
      room.on(RoomEvent.TrackUnmuted, rebuild);
      room.on(RoomEvent.LocalTrackPublished, rebuild);
      room.on(RoomEvent.LocalTrackUnpublished, rebuild);
      room.on(RoomEvent.ParticipantConnected, (p) => {
        rebuild();
        pushSystem(`${p.name || p.identity} joined`);
      });
      room.on(RoomEvent.ParticipantDisconnected, (p) => {
        rebuild();
        pushSystem(`${p.name || p.identity} left`);
        setRaisedHands((prev) => {
          const next = { ...prev };
          delete next[p.identity];
          return next;
        });
      });
      room.on(RoomEvent.ActiveSpeakersChanged, () => rebuild());
      room.on(RoomEvent.DataReceived, onData);
      room.on(RoomEvent.Disconnected, () => setConnected(false));

      try {
        await room.connect(serverUrl, connectPayload.token);
        if (cancelled) {
          room.disconnect();
          return;
        }
        setConnected(true);
        setJoinedAt(Date.now());
        rebuild();
      } catch (err) {
        console.error("LiveKit connect failed:", err);
        return;
      }

      //   try {
      //     const tracks = await createLocalTracks({
      //       audio: {
      //         echoCancellation: true,
      //         noiseSuppression: true,
      //         autoGainControl: true,
      //       },
      //       video: { resolution: { width: 1280, height: 720 } },
      //     });
      //     for (const track of tracks) {
      //       await room.localParticipant.publishTrack(track);
      //       if (track.kind === Track.Kind.Video) localCamRef.current = track;
      //       if (track.kind === Track.Kind.Audio) localMicRef.current = track;
      //     }
      //   } catch (err) {
      //     console.error("createLocalTracks failed:", err);
      //   }
      try {
        const tracks = await createLocalTracks({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
          video: { resolution: { width: 1280, height: 720 } },
        });
        for (const track of tracks) {
          await room.localParticipant.publishTrack(track);
          if (track.kind === Track.Kind.Video) {
            localCamRef.current = track;
            if (initialAV && initialAV.camOn === false) await track.mute();
          }
          if (track.kind === Track.Kind.Audio) {
            localMicRef.current = track;
            if (initialAV && initialAV.micOn === false) await track.mute();
          }
        }
      } catch (err) {
        console.error("createLocalTracks failed:", err);
      }
      rebuild();
    };

    start();

    return () => {
      cancelled = true;
      try {
        roomRef.current?.disconnect();
      } catch (_) {}
      roomRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectPayload?.token]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sidebarTab, sidebarOpen]);

  /* ── host: poll the waiting room ──────────────────────────────────── */
  useEffect(() => {
    if (!isHost || !meetingId) return undefined;
    const poll = async () => {
      try {
        const res = await listPendingJoinRequests(meetingId);
        // FIX: response items are MeetingJoinRequestDTO -> { requestId, guestName, ... }.
        // WaitingRoomPanel renders `w.name`, so map guestName -> name here.
        const items = (res?.data || []).map((r) => ({
          requestId: r.requestId,
          name: r.guestName,
        }));
        setWaiting(items);
      } catch (_) {}
    };
    poll();
    waitingPollRef.current = setInterval(poll, WAITING_ROOM_POLL_MS);
    return () => clearInterval(waitingPollRef.current);
  }, [isHost, meetingId]);

  /* ── everyone: poll meeting status so guests learn the host ended it ── */
  useEffect(() => {
    statusPollRef.current = setInterval(async () => {
      try {
        const res = await getMeetingByJoinCode(joinCode);
        // FIX: DTO field is meetingStatus, not status
        if (res?.data?.meetingStatus === "ENDED") {
          clearInterval(statusPollRef.current);
          setEndedToast(true);
          setTimeout(() => onEndedRemotely(), 2500);
        }
      } catch (_) {}
    }, MEETING_STATUS_POLL_MS);
    return () => clearInterval(statusPollRef.current);
  }, [joinCode, onEndedRemotely]);

  /* ── controls ─────────────────────────────────────────────────────── */
  const toggleMic = useCallback(async () => {
    const track = localMicRef.current;
    if (!track) return;
    if (micOn) await track.mute();
    else await track.unmute();
    setMicOn((v) => !v);
    rebuild();
  }, [micOn, rebuild]);

  const toggleCam = useCallback(async () => {
    const track = localCamRef.current;
    if (!track) return;
    if (camOn) await track.mute();
    else await track.unmute();
    setCamOn((v) => !v);
    rebuild();
  }, [camOn, rebuild]);

  const toggleScreen = useCallback(async () => {
    const room = roomRef.current;
    if (!room) return;
    if (screenOn) {
      try {
        await room.localParticipant.setScreenShareEnabled(false);
      } catch (_) {}
      setScreenOn(false);
      rebuild();
    } else {
      try {
        const pub = await room.localParticipant.setScreenShareEnabled(true, {
          audio: false,
        });
        if (!pub) return;
        setScreenOn(true);
        rebuild();
        pub.track?.mediaStreamTrack?.addEventListener(
          "ended",
          () => {
            room.localParticipant.setScreenShareEnabled(false).catch(() => {});
            setScreenOn(false);
            rebuild();
          },
          { once: true },
        );
      } catch (err) {
        if (err?.name !== "NotAllowedError")
          console.warn("Screen share failed:", err);
      }
    }
  }, [screenOn, rebuild]);

  const toggleHandRaise = useCallback(() => {
    const next = !handRaised;
    setRaisedHands((prev) => ({ ...prev, you: next }));
    try {
      const payload = new TextEncoder().encode(
        JSON.stringify({ type: "hand", raised: next }),
      );
      roomRef.current?.localParticipant?.publishData(payload, {
        reliable: true,
      });
    } catch (_) {}
  }, [handRaised]);

  const sendReaction = useCallback(
    (emoji) => {
      spawnFloater(emoji, "You");
      try {
        const payload = new TextEncoder().encode(
          JSON.stringify({ type: "reaction", emoji }),
        );
        roomRef.current?.localParticipant?.publishData(payload, {
          reliable: false,
        });
      } catch (_) {}
      setReactionPickerOpen(false);
    },
    [spawnFloater],
  );

  const sendMsg = useCallback(() => {
    const text = msgInput.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), name: "You", text, time: getTime(), self: true },
    ]);
    setMsgInput("");
    try {
      const payload = new TextEncoder().encode(
        JSON.stringify({ type: "chat", text }),
      );
      roomRef.current?.localParticipant?.publishData(payload, {
        reliable: true,
      });
    } catch (_) {}
  }, [msgInput]);

  const openTab = useCallback(
    (tab) => {
      if (sidebarOpen && sidebarTab === tab) setSidebarOpen(false);
      else {
        setSidebarTab(tab);
        setSidebarOpen(true);
      }
    },
    [sidebarOpen, sidebarTab],
  );

  /* ── recording (host only) ───────────────────────────────────────── */
  // FIX: there is no recording endpoint on MeetingController/MeetingService
  // yet (recording only exists for the old Live Session module). This
  // toggle now only flips local UI state so the button doesn't crash on
  // a missing function — wire this up to a real backend endpoint once
  // one exists (e.g. POST /api/meetings/{id}/recording/start|stop).
  const toggleRecording = useCallback(() => {
    if (!isHost || recToggling) return;
    setRecToggling(true);
    setTimeout(() => {
      setRecording((v) => !v);
      setRecToggling(false);
    }, 300);
  }, [isHost, recToggling]);

  /* ── waiting room actions (host only) ────────────────────────────── */
  const handleAdmit = useCallback(
    async (requestId) => {
      if (!meetingId) return;
      try {
        await admitJoinRequest(meetingId, requestId);
        setWaiting((prev) => prev.filter((w) => w.requestId !== requestId));
      } catch (_) {}
    },
    [meetingId],
  );
  const handleDeny = useCallback(
    async (requestId) => {
      if (!meetingId) return;
      try {
        await denyJoinRequest(meetingId, requestId);
        setWaiting((prev) => prev.filter((w) => w.requestId !== requestId));
      } catch (_) {}
    },
    [meetingId],
  );
  const handleAdmitAll = useCallback(async () => {
    if (!meetingId) return;
    try {
      await admitAllJoinRequests(meetingId);
      setWaiting([]);
    } catch (_) {}
  }, [meetingId]);

  /* ── leave / end ──────────────────────────────────────────────────── */
  // FIX: no leaveMeetingApi exists on the backend — a guest leaving is
  // purely a client-side LiveKit disconnect, nothing to report server-side.
  const handleLeave = useCallback(() => {
    try {
      roomRef.current?.disconnect();
    } catch (_) {}
    onLeft();
  }, [onLeft]);

  const handleEndForAll = useCallback(async () => {
    if (!meetingId) return;
    try {
      await endMeeting(meetingId); // FIX: numeric id, not joinCode
    } catch (_) {}
    try {
      roomRef.current?.disconnect();
    } catch (_) {}
    onLeft();
  }, [meetingId, onLeft]);

  const copyLink = useCallback(() => {
    navigator.clipboard
      ?.writeText(shareLink)
      .then(() => {
        setCopyToast(true);
        setTimeout(() => setCopyToast(false), 2000);
      })
      .catch(() => {});
  }, [shareLink]);

  /* ── PiP ──────────────────────────────────────────────────────────── */
  const screenSharer = useMemo(
    () => participants.find((p) => !!p.screenTrack),
    [participants],
  );
  const featured = useMemo(() => {
    if (screenSharer) return screenSharer;
    return (
      participants.find((p) => p.isHost) ||
      participants.find((p) => !p.isLocal) ||
      participants[0] ||
      null
    );
  }, [participants, screenSharer]);
  const stripParticipants = useMemo(
    () => participants.filter((p) => p.identity !== featured?.identity),
    [participants, featured],
  );
  const MAX_STRIP_VISIBLE = 6;
  const visibleStrip = stripParticipants.slice(0, MAX_STRIP_VISIBLE);
  const overflowCount = Math.max(
    0,
    stripParticipants.length - MAX_STRIP_VISIBLE,
  );
  const gridMode = !screenSharer && participants.length > 1;

  const pipTrack =
    screenSharer?.screenTrack ||
    participants.find((p) => p.isLocal)?.cameraTrack ||
    participants.find((p) => !p.isLocal && p.cameraTrack)?.cameraTrack ||
    null;
  const pipIsScreen = !!screenSharer?.screenTrack;
  const pipLabel = screenSharer
    ? screenSharer.isLocal
      ? "You are presenting"
      : `${screenSharer.name} is presenting`
    : "Live meeting";
  const pipSupported =
    typeof window !== "undefined" && "documentPictureInPicture" in window;

  const closePiP = useCallback(() => {
    setPipWindow((win) => {
      if (win && !win.closed) win.close();
      return null;
    });
    if (document.pictureInPictureElement)
      document.exitPictureInPicture().catch(() => {});
  }, []);

  const openPiP = useCallback(async () => {
    if (pipWindow) return;
    if (pipSupported) {
      try {
        const win = await window.documentPictureInPicture.requestWindow({
          width: 340,
          height: 220,
        });
        [...document.styleSheets].forEach((sheet) => {
          try {
            const css = [...sheet.cssRules].map((r) => r.cssText).join("");
            const style = win.document.createElement("style");
            style.textContent = css;
            win.document.head.appendChild(style);
          } catch (_) {
            if (sheet.href) {
              const link = win.document.createElement("link");
              link.rel = "stylesheet";
              link.href = sheet.href;
              win.document.head.appendChild(link);
            }
          }
        });
        win.document.body.style.margin = "0";
        win.document.body.style.background = "#000";
        win.document.body.style.overflow = "hidden";
        win.addEventListener("pagehide", () => setPipWindow(null), {
          once: true,
        });
        setPipWindow(win);
        return;
      } catch (err) {
        console.warn("Document PiP unavailable, falling back:", err);
      }
    }
    const el = pipFallbackVideoRef.current;
    if (el?.requestPictureInPicture) {
      try {
        await el.requestPictureInPicture();
      } catch (_) {}
    }
  }, [pipSupported, pipWindow]);

  const togglePiP = useCallback(() => {
    if (pipWindow || document.pictureInPictureElement) closePiP();
    else openPiP();
  }, [pipWindow, openPiP, closePiP]);

  useEffect(() => {
    if (!connected) return undefined;
    const onVisibility = () => {
      if (document.hidden) openPiP();
      else closePiP();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [connected, openPiP, closePiP]);

  useEffect(() => () => closePiP(), []); // eslint-disable-line react-hooks/exhaustive-deps

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const closeReactionPicker = useCallback(
    () => setReactionPickerOpen(false),
    [],
  );
  useDismiss(menuOpen, closeMenu, [menuBtnRef, menuPanelRef]);
  useDismiss(reactionPickerOpen, closeReactionPicker, [
    reactionBtnRef,
    reactionPanelRef,
  ]);

  const S = IM_STYLES;

  return (
    <div style={S.root} className="im-root">
      <VideoTrackEl
        videoRef={pipFallbackVideoRef}
        track={pipTrack}
        fit={pipIsScreen ? "contain" : "cover"}
        hidden
      />

      {pipWindow &&
        createPortal(
          <PiPPanel
            track={pipTrack}
            isScreen={pipIsScreen}
            label={pipLabel}
            timer={timer}
            micOn={micOn}
            onToggleMic={toggleMic}
            onReturn={() => {
              window.focus();
              closePiP();
            }}
          />,
          pipWindow.document.body,
        )}

      {reactionPickerOpen &&
        reactionPos &&
        createPortal(
          <div
            ref={reactionPanelRef}
            style={{
              ...S.reactionPicker,
              position: "fixed",
              left: reactionPos.left,
              top: reactionPos.top,
              bottom: "auto",
              transform: "translate(-50%, -100%)",
              zIndex: 10000,
            }}
            role="menu"
          >
            {REACTIONS.map((emoji) => (
              <button
                key={emoji}
                role="menuitem"
                style={S.reactionPickerBtn}
                onClick={() => sendReaction(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>,
          document.body,
        )}

      {endedToast && (
        <div style={S.toast} role="alert">
          <span style={{ fontSize: 18 }}>⏱️</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13 }}>
              Meeting ended by host
            </div>
            <div style={{ fontSize: 11, opacity: 0.85 }}>
              Redirecting you out…
            </div>
          </div>
        </div>
      )}
      {copyToast && (
        <div
          style={{
            ...S.toast,
            background: "linear-gradient(135deg,#16a34a,#22c55e)",
          }}
        >
          <Copy size={16} />
          <div style={{ fontWeight: 700, fontSize: 13 }}>Link copied</div>
        </div>
      )}

      {/* ── top bar ── */}
      <div style={S.topBar} className="im-topbar">
        <div style={S.topLeft} className="im-topleft">
          <div style={S.liveBadge}>
            <span style={S.liveDot} />
            LIVE
          </div>
          {/* <span style={S.sessionName} className="im-sessionname">
            {meetingInfo?.title || "Ilmora Meeting"}
          </span> */}
          <ColorfulTitle
            text={meetingInfo?.title || "Ilmorameet"}
            style={S.sessionName}
            className="im-sessionname"
          />
          <div style={S.timerBadge}>
            <Timer size={13} />
            {timer}
          </div>
          {recording && (
            <div style={S.recBadge}>
              <Disc2 size={11} />
              REC
            </div>
          )}
        </div>
        <div style={S.topRight} className="im-topright">
          <button
            style={S.iconGhostBtn}
            onClick={copyLink}
            title="Copy meeting link"
            aria-label="Copy meeting link"
          >
            <ExternalLink size={15} />
          </button>
          <div style={S.peopleCountBadge}>
            <Users size={14} />
            {participants.length || 1}
          </div>
          <div
            style={{ ...S.connBadge, ...(connected ? S.connOn : S.connOff) }}
          >
            <SignalHigh size={14} />
          </div>
          {isHost ? (
            <button style={S.endSessionBtn} onClick={handleEndForAll}>
              <PhoneOff size={14} />
              <span className="im-btn-label-inline">End meeting</span>
            </button>
          ) : (
            <button
              style={{ ...S.endSessionBtn, background: "#334155" }}
              onClick={handleLeave}
            >
              <PhoneOff size={14} />
              <span className="im-btn-label-inline">Leave</span>
            </button>
          )}
          <div style={{ position: "relative" }}>
            <button
              ref={menuBtnRef}
              style={S.iconGhostBtn}
              onClick={() => setMenuOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
            >
              <MoreVertical size={16} />
            </button>
            {menuOpen && (
              <div ref={menuPanelRef} style={S.dropMenu} role="menu">
                <button
                  role="menuitem"
                  style={S.dropMenuItem}
                  onClick={() => {
                    setSettingsOpen(true);
                    setMenuOpen(false);
                  }}
                >
                  <Settings size={13} />
                  Settings
                </button>
                {isHost && (
                  <button
                    role="menuitem"
                    style={S.dropMenuItem}
                    onClick={() => {
                      toggleRecording();
                      setMenuOpen(false);
                    }}
                  >
                    <Disc2 size={13} />
                    {recording ? "Stop recording" : "Start recording"}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── main area ── */}
      <div style={S.mainArea} className="im-mainarea">
        <div style={S.stageColumn} className="im-stagecolumn">
          {gridMode ? (
            <>
              <ParticipantGrid
                participants={participants}
                raisedHands={raisedHands}
                handRaised={handRaised}
                S={S}
              />
              {captionsOn && (
                <div style={S.captionsBar}>
                  <Captions size={13} />
                  <span>Live captions are enabled for this meeting.</span>
                </div>
              )}
            </>
          ) : (
            <>
              <StageTile
                p={featured}
                raised={
                  featured
                    ? featured.isLocal
                      ? handRaised
                      : !!raisedHands[featured.identity]
                    : false
                }
                S={S}
              />
              {captionsOn && (
                <div style={S.captionsBar}>
                  <Captions size={13} />
                  <span>Live captions are enabled for this meeting.</span>
                </div>
              )}
              {(visibleStrip.length > 0 || overflowCount > 0) && (
                <div
                  data-scroll-root
                  className="im-filmstrip"
                  style={S.filmstrip}
                >
                  {visibleStrip.map((p) => (
                    <StripTile
                      key={p.identity}
                      p={p}
                      active={p.isLocal}
                      raised={
                        p.isLocal ? handRaised : !!raisedHands[p.identity]
                      }
                      S={S}
                    />
                  ))}
                  {overflowCount > 0 && (
                    <StripOverflow count={overflowCount} S={S} />
                  )}
                </div>
              )}
            </>
          )}
          <EmojiFloaters floaters={floaters} S={S} />
        </div>

        <button
          type="button"
          style={S.handle}
          className="im-handle"
          onClick={() => setSidebarOpen((v) => !v)}
          aria-expanded={sidebarOpen}
        >
          {sidebarOpen ? (
            <ChevronRight size={15} color="#64748b" />
          ) : (
            <ChevronLeft size={15} color="#64748b" />
          )}
        </button>

        {sidebarOpen && (
          <div
            style={S.sidebarBackdrop}
            className="im-sidebar-backdrop"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {sidebarOpen && (
          <div style={S.sidebar} className="im-sidebar">
            <div style={S.tabRow}>
              <button
                style={{ ...S.tab, ...(sidebarTab === "chat" ? S.tabOn : {}) }}
                onClick={() => setSidebarTab("chat")}
              >
                <MessageSquare size={15} /> Chat
              </button>
              <button
                style={{
                  ...S.tab,
                  ...(sidebarTab === "people" ? S.tabOn : {}),
                }}
                onClick={() => setSidebarTab("people")}
              >
                <Users size={15} /> People
                <span style={S.cnt}>{participants.length || 1}</span>
              </button>
              {isHost && (
                <button
                  style={{
                    ...S.tab,
                    ...(sidebarTab === "waiting" ? S.tabOn : {}),
                  }}
                  onClick={() => setSidebarTab("waiting")}
                >
                  <Clock size={15} /> Waiting
                  {waiting.length > 0 && (
                    <span
                      style={{
                        ...S.cnt,
                        background: "rgba(251,191,36,.22)",
                        color: "#fbbf24",
                      }}
                    >
                      {waiting.length}
                    </span>
                  )}
                </button>
              )}
              <button style={S.closeBtn} onClick={() => setSidebarOpen(false)}>
                <X size={16} />
              </button>
            </div>

            {sidebarTab === "chat" && (
              <div style={S.chatWrap}>
                <div style={S.msgList}>
                  {messages.map((m) =>
                    m.system ? (
                      <div key={m.id} style={S.msgRow}>
                        <div style={S.sysBubble}>{m.text}</div>
                      </div>
                    ) : (
                      <div
                        key={m.id}
                        style={{ ...S.msgCol, ...(m.self ? S.msgColSelf : {}) }}
                      >
                        <span
                          style={{
                            ...S.bHeader,
                            ...(m.self ? S.bHeaderSelf : {}),
                          }}
                        >
                          {m.self ? "You" : m.name}
                          <span style={S.bHeaderTime}>{m.time}</span>
                        </span>
                        <div
                          style={{
                            ...S.bubble,
                            ...(m.self ? S.bSelf : S.bOther),
                          }}
                        >
                          <span style={S.bText}>{m.text}</span>
                        </div>
                      </div>
                    ),
                  )}
                  <div ref={chatEndRef} />
                </div>
                <div style={S.inputRow}>
                  <input
                    style={S.chatInput}
                    placeholder="Type a message…"
                    value={msgInput}
                    onChange={(e) => setMsgInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMsg();
                      }
                    }}
                  />
                  <button style={S.sendBtn} onClick={sendMsg}>
                    <Send size={16} />
                  </button>
                </div>
              </div>
            )}

            {sidebarTab === "people" && (
              <div style={S.peopleList}>
                {participants.map((p) => (
                  <PersonRow
                    key={p.identity}
                    name={p.isLocal ? "You (Me)" : p.name}
                    isHost={p.isHost}
                    self={p.isLocal}
                    handRaised={
                      p.isLocal ? handRaised : !!raisedHands[p.identity]
                    }
                    S={S}
                  />
                ))}
                {participants.length <= 1 && (
                  <p style={S.emptyPpl}>No one else has joined yet</p>
                )}
              </div>
            )}

            {sidebarTab === "waiting" && isHost && (
              <div style={{ ...S.peopleList, paddingTop: 12 }}>
                <WaitingRoomPanel
                  waiting={waiting}
                  onAdmit={handleAdmit}
                  onDeny={handleDeny}
                  onAdmitAll={handleAdmitAll}
                  S={S}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {settingsOpen && (
        <div style={S.settingsOverlay} onClick={() => setSettingsOpen(false)}>
          <div style={S.settingsPanel} onClick={(e) => e.stopPropagation()}>
            <div style={S.settingsHead}>
              <span style={{ fontWeight: 700, fontSize: 14 }}>Settings</span>
              <button style={S.closeBtn} onClick={() => setSettingsOpen(false)}>
                <X size={16} />
              </button>
            </div>
            <div style={S.settingsBody}>
              <div style={S.settingsRow}>
                <span>Live captions</span>
                <button
                  style={{
                    ...S.settingsToggle,
                    ...(captionsOn ? S.settingsToggleOn : {}),
                  }}
                  onClick={() => setCaptionsOn((v) => !v)}
                >
                  {captionsOn ? "On" : "Off"}
                </button>
              </div>
              <div style={S.settingsRow}>
                <span>Meeting link</span>
                <button style={S.settingsToggle} onClick={copyLink}>
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── control bar ── */}
      <div
        style={S.ctrlBar}
        className="im-ctrlbar"
        role="toolbar"
        aria-label="Meeting controls"
      >
        <Btn
          icon={micOn ? <Mic size={18} /> : <MicOff size={18} />}
          label="Mic"
          danger={!micOn}
          onClick={toggleMic}
          pressed={micOn}
          S={S}
        />
        <Btn
          icon={camOn ? <Video size={18} /> : <VideoOff size={18} />}
          label="Camera"
          danger={!camOn}
          onClick={toggleCam}
          pressed={camOn}
          S={S}
        />
        <Btn
          icon={screenOn ? <MonitorOff size={18} /> : <MonitorUp size={18} />}
          label="Present"
          active={screenOn}
          onClick={toggleScreen}
          pressed={screenOn}
          S={S}
        />
        <Btn
          icon={<Hand size={18} />}
          label="Raise Hand"
          active={handRaised}
          onClick={toggleHandRaise}
          pressed={handRaised}
          S={S}
        />
        {/* <div style={{ position: "relative" }}>
          <Btn
            btnRef={reactionBtnRef}
            icon={<SmilePlus size={18} />}
            label="React"
            active={reactionPickerOpen}
            onClick={() => setReactionPickerOpen((v) => !v)}
            ariaHasPopup="true"
            ariaExpanded={reactionPickerOpen}
            S={S}
          />
          {reactionPickerOpen && (
            <div ref={reactionPanelRef} style={S.reactionPicker} role="menu">
              {REACTIONS.map((emoji) => (
                <button
                  key={emoji}
                  role="menuitem"
                  style={S.reactionPickerBtn}
                  onClick={() => sendReaction(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div> */}
        <div style={{ position: "relative" }}>
          <Btn
            btnRef={reactionBtnRef}
            icon={<SmilePlus size={18} />}
            label="React"
            active={reactionPickerOpen}
            onClick={() => {
              const rect = reactionBtnRef.current?.getBoundingClientRect();
              if (rect) {
                setReactionPos({
                  left: rect.left + rect.width / 2,
                  top: rect.top - 10,
                });
              }
              setReactionPickerOpen((v) => !v);
            }}
            ariaHasPopup="true"
            ariaExpanded={reactionPickerOpen}
            S={S}
          />
        </div>
        <Btn
          icon={<MessageSquare size={18} />}
          label="Chat"
          active={sidebarOpen && sidebarTab === "chat"}
          onClick={() => openTab("chat")}
          S={S}
        />
        <Btn
          icon={<Users size={18} />}
          label="People"
          badge={participants.length || 1}
          active={sidebarOpen && sidebarTab === "people"}
          onClick={() => openTab("people")}
          S={S}
        />
        {isHost && (
          <Btn
            icon={<Clock size={18} />}
            label="Waiting"
            badge={waiting.length || undefined}
            active={sidebarOpen && sidebarTab === "waiting"}
            onClick={() => openTab("waiting")}
            S={S}
          />
        )}
        <Btn
          icon={<Settings size={18} />}
          label="Settings"
          active={settingsOpen}
          onClick={() => setSettingsOpen((v) => !v)}
          S={S}
        />
        {isHost && (
          <Btn
            icon={<Disc2 size={18} />}
            label={recToggling ? "Wait…" : "Record"}
            active={recording}
            onClick={toggleRecording}
            pressed={recording}
            S={S}
          />
        )}
        <Btn
          icon={<PictureInPicture2 size={18} />}
          label="PiP"
          active={!!pipWindow}
          onClick={togglePiP}
          pressed={!!pipWindow}
          S={S}
        />
        <Btn
          icon={<PhoneOff size={18} />}
          label={isHost ? "End" : "Leave"}
          leave
          onClick={isHost ? handleEndForAll : handleLeave}
          S={S}
        />
      </div>

      <style>{`
        @keyframes livePulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(1.5)} }
        @keyframes recBlink  { 0%,100%{opacity:1} 50%{opacity:.2} }
        @keyframes slideIn   { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
        @keyframes slideUp   { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn    { from{opacity:0} to{opacity:1} }
        @keyframes toastIn   { from{opacity:0;transform:translateX(-50%) translateY(-12px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
        @keyframes fadeScaleIn { from{opacity:0;transform:scale(0.96)} to{opacity:1;transform:scale(1)} }
        @keyframes floatUp { 0%{opacity:0;transform:translateY(0) scale(0.6)} 15%{opacity:1;transform:translateY(-20px) scale(1)} 100%{opacity:0;transform:translateY(-160px) scale(1.1)} }
        @keyframes speakGlow { 0%,100%{ box-shadow: 0 0 0 2px rgba(52,211,153,.55), 0 0 22px 2px rgba(52,211,153,.28); } 50%{ box-shadow: 0 0 0 2px rgba(52,211,153,.85), 0 0 32px 6px rgba(52,211,153,.4); } }
        @keyframes imspin { to { transform: rotate(360deg); } }
        .im-spin { animation: imspin 1s linear infinite; }

        .im-root, .im-root * { box-sizing: border-box; }
        .im-root { max-width: 100vw; }
        .im-strip-tile, .im-stage, .im-grid-tile { transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease; }
        .im-strip-tile:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0,0,0,.35); }
        .im-strip-tile-active { border: 2px solid #6d5ef7 !important; }
        .im-speaking { animation: speakGlow 1.6s ease-in-out infinite; border-color: rgba(52,211,153,.6) !important; }
        .im-ctrl-btn { transition: all .16s ease; min-width: 48px; min-height: 48px; }
        .im-ctrl-btn:active { transform: scale(.94); }
        .im-sidebar { animation: slideIn .22s ease; }
        .im-stage { animation: fadeScaleIn .25s ease; }
        .im-sidebar-backdrop { display: none; }
        .im-btn-label { display: inline; }
        .im-btn-label-inline { display: inline; }

        .im-root button:focus { outline: none; }
        .im-root button:focus-visible, .im-root input:focus-visible { outline: 2px solid #8b7dfb; outline-offset: 2px; border-radius: 6px; }

        .im-filmstrip { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,.18) transparent; }
        .im-ctrlbar { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,.22) transparent; }

        @media (max-width: 1439px) { .im-sidebar { width: 320px !important; } }
        @media (max-width: 1199px) { .im-sidebar { width: 300px !important; } .im-ctrl-btn { padding: 9px 14px !important; } }
        @media (max-width: 1023px) {
          .im-mainarea { position: relative; }
          .im-grid { grid-template-columns: repeat(var(--cols-tablet, 3), 1fr) !important; }
          .im-sidebar { position: absolute !important; top:0; right:0; bottom:0; width: min(320px, 88vw) !important; z-index: 40; box-shadow: -12px 0 32px rgba(0,0,0,.45); animation: slideIn .22s ease; }
          .im-sidebar-backdrop { display: block; position: absolute; inset: 0; background: rgba(0,0,0,.35); z-index: 30; animation: fadeIn .18s ease; }
          .im-handle { display: none !important; }
        }
        @media (max-width: 767px) {
          .im-sidebar { width: 100% !important; max-width: 100% !important; }
          .im-sessionname { display: none; }
          .im-stage { border-radius: 12px !important; }
          .im-grid { grid-template-columns: repeat(var(--cols-phone, 2), 1fr) !important; }
        }
        @media (max-width: 899px) {
          .im-topbar { padding: 8px 12px !important; }
          .im-ctrlbar { padding: 10px 14px !important; }
          .im-ctrl-btn { padding: 8px 12px !important; }
          .im-stagecolumn { padding: 10px !important; gap: 8px !important; }
        }
        @media (max-width: 599px) {
          .im-topbar { flex-wrap: wrap; row-gap: 6px; }
          .im-topright { order: 3; width: 100%; justify-content: flex-start; }
          .im-ctrlbar { padding: 8px 6px !important; gap: 3px !important; overflow-x: auto; }
          .im-btn-label, .im-btn-label-inline { display: none !important; }
          .im-ctrl-btn { padding: 10px !important; border-radius: 12px !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .im-root * { animation-duration: .001ms !important; animation-iteration-count: 1 !important; transition-duration: .001ms !important; }
        }
      `}</style>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════
   PRE-JOIN / LOBBY STYLES
═════════════════════════════════════════════════════════════════ */
const PJ = {
  root: {
    position: "fixed",
    inset: 0,
    background: "#0b0d12",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    fontFamily: "'Inter','Segoe UI',sans-serif",
    zIndex: 9999,
  },
  card: {
    display: "flex",
    gap: 32,
    maxWidth: 880,
    width: "100%",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
  },
  previewBox: {
    position: "relative",
    width: 380,
    maxWidth: "100%",
    aspectRatio: "16/10",
    background: "#14161d",
    borderRadius: 20,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,.08)",
    boxShadow: "0 20px 50px rgba(0,0,0,.4)",
  },
  previewAvatarWrap: {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  previewAvatar: {
    width: 96,
    height: 96,
    borderRadius: "50%",
    background: "linear-gradient(135deg,#6d5ef7,#8b5cf6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 34,
    fontWeight: 800,
    color: "#fff",
  },
  previewCtrls: {
    position: "absolute",
    bottom: 14,
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    gap: 10,
  },
  previewBtn: {
    width: 44,
    height: 44,
    borderRadius: "50%",
    border: "1px solid rgba(255,255,255,.12)",
    background: "rgba(255,255,255,.1)",
    color: "#e2e8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  previewBtnOff: {
    background: "#7f1d1d",
    color: "#fca5a5",
    borderColor: "rgba(239,68,68,.4)",
  },
  infoCol: { width: 340, maxWidth: "100%", color: "#e2e8f0" },
  title: { fontSize: 22, fontWeight: 800, margin: "0 0 6px", color: "#fff" },
  subtitle: { fontSize: 13, color: "#94a3b8", margin: "0 0 4px" },
  code: { fontSize: 12, color: "#64748b", margin: "0 0 18px" },
  label: {
    fontSize: 12,
    fontWeight: 600,
    color: "#cbd5e1",
    marginBottom: 6,
    display: "block",
  },
  input: {
    width: "100%",
    background: "#161922",
    border: "1px solid rgba(255,255,255,.1)",
    borderRadius: 12,
    padding: "11px 14px",
    color: "#fff",
    fontSize: 14,
    marginBottom: 14,
    outline: "none",
    fontFamily: "inherit",
  },
  warnText: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 11,
    color: "#fbbf24",
    marginBottom: 10,
  },
  errText: { fontSize: 12, color: "#f87171", marginBottom: 10 },
  joinBtn: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    background: "linear-gradient(135deg,#6d5ef7,#8b5cf6)",
    color: "#fff",
    border: "none",
    borderRadius: 14,
    padding: "13px 0",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
  },
  hint: { fontSize: 11, color: "#64748b", marginTop: 10, textAlign: "center" },
};

const LB = {
  card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
    textAlign: "center",
    maxWidth: 380,
    color: "#e2e8f0",
    fontFamily: "'Inter','Segoe UI',sans-serif",
  },
  pulseWrap: {
    position: "relative",
    width: 60,
    height: 60,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  pulseDot: {
    position: "absolute",
    inset: 0,
    borderRadius: "50%",
    background: "rgba(147,197,253,.14)",
    animation: "livePulse 1.6s ease-in-out infinite",
  },
  title: { fontSize: 18, fontWeight: 800, margin: 0, color: "#fff" },
  subtitle: { fontSize: 13, color: "#94a3b8", margin: 0 },
  cancelBtn: {
    marginTop: 10,
    background: "rgba(255,255,255,.06)",
    border: "1px solid rgba(255,255,255,.1)",
    color: "#cbd5e1",
    borderRadius: 12,
    padding: "9px 20px",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
  },
};

/* ═════════════════════════════════════════════════════════════════
   MEETING ROOM STYLES (mirrors LiveRoom.jsx's design language)
═════════════════════════════════════════════════════════════════ */
const IM_STYLES = {
  root: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    width: "100%",
    background: "#050608",
    fontFamily: "'Inter','Segoe UI',sans-serif",
    color: "#e2e8f0",
    overflow: "hidden",
  },
  toast: {
    position: "fixed",
    top: 16,
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 99999,
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "14px 24px",
    borderRadius: 14,
    background: "linear-gradient(135deg,#dc2626,#f43f5e)",
    color: "#fff",
    boxShadow: "0 8px 32px rgba(244,63,94,.5)",
    animation: "toastIn .35s ease",
    minWidth: 280,
  },

  topBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 20px",
    background: "#0b0d12",
    borderBottom: "1px solid rgba(255,255,255,.06)",
    flexShrink: 0,
    flexWrap: "wrap",
    gap: 8,
  },
  topLeft: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" },
  topRight: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  },
  liveBadge: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "rgba(239,68,68,.14)",
    border: "1px solid rgba(239,68,68,.28)",
    borderRadius: 8,
    padding: "5px 10px",
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: 1.2,
    color: "#ef4444",
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "#ef4444",
    animation: "livePulse 1.2s ease-in-out infinite",
    display: "inline-block",
  },
  recBadge: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    background: "rgba(127,29,29,.35)",
    border: "1px solid rgba(248,113,113,.25)",
    borderRadius: 8,
    padding: "5px 10px",
    fontSize: 11,
    fontWeight: 700,
    color: "#fca5a5",
    animation: "recBlink 2s infinite",
  },
  timerBadge: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    fontWeight: 600,
    color: "#cbd5e1",
    background: "rgba(255,255,255,.06)",
    borderRadius: 8,
    padding: "5px 10px",
    fontVariantNumeric: "tabular-nums",
  },
  sessionName: {
    fontSize: 15,
    fontWeight: 700,
    color: "#f8fafc",
    marginLeft: 2,
  },
  peopleCountBadge: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    fontWeight: 600,
    color: "#cbd5e1",
    background: "rgba(255,255,255,.06)",
    borderRadius: 8,
    padding: "6px 10px",
  },
  connBadge: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    padding: "6px 9px",
  },
  connOn: {
    background: "rgba(34,197,94,.12)",
    border: "1px solid rgba(34,197,94,.28)",
    color: "#22c55e",
  },
  connOff: {
    background: "rgba(100,116,139,.1)",
    border: "1px solid rgba(100,116,139,.2)",
    color: "#94a3b8",
  },
  endSessionBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "9px 16px",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 4px 14px rgba(239,68,68,.35)",
  },
  iconGhostBtn: {
    background: "rgba(255,255,255,.06)",
    border: "1px solid rgba(255,255,255,.08)",
    borderRadius: 9,
    padding: 8,
    color: "#94a3b8",
    cursor: "pointer",
    display: "flex",
  },
  dropMenu: {
    position: "absolute",
    top: "calc(100% + 8px)",
    right: 0,
    background: "#161b26",
    border: "1px solid rgba(255,255,255,.08)",
    borderRadius: 12,
    padding: 6,
    minWidth: 190,
    boxShadow: "0 12px 32px rgba(0,0,0,.5)",
    zIndex: 50,
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  dropMenuItem: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "none",
    border: "none",
    color: "#cbd5e1",
    fontSize: 12,
    fontWeight: 600,
    padding: "8px 10px",
    borderRadius: 8,
    cursor: "pointer",
    textAlign: "left",
  },

  reactionPicker: {
    position: "absolute",
    bottom: "calc(100% + 10px)",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    gap: 4,
    padding: "8px 10px",
    background: "#161b26",
    border: "1px solid rgba(255,255,255,.08)",
    borderRadius: 999,
    boxShadow: "0 12px 32px rgba(0,0,0,.5)",
    zIndex: 50,
    animation: "slideUp .16s ease",
  },
  reactionPickerBtn: {
    width: 36,
    height: 36,
    border: "none",
    background: "transparent",
    fontSize: 19,
    cursor: "pointer",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  ctrlBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    background: "#6d5ef7",
    color: "#fff",
    fontSize: 9,
    fontWeight: 800,
    borderRadius: 8,
    padding: "1px 5px",
    border: "2px solid #050608",
    lineHeight: 1.3,
  },

  mainArea: {
    flex: 1,
    display: "flex",
    overflow: "hidden",
    position: "relative",
    minWidth: 0,
  },
  stageColumn: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 14,
    padding: 18,
    overflow: "hidden",
    minWidth: 0,
    position: "relative",
    maxWidth: 1800,
    width: "100%",
    margin: "0 auto",
  },
  stageOuter: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 0,
    minWidth: 0,
    overflow: "hidden",
  },
  stage: {
    position: "relative",
    background: "#12141a",
    borderRadius: 22,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,.08)",
    boxShadow: "0 16px 44px rgba(0,0,0,.38)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    aspectRatio: "16/9",
    height: "100%",
    width: "auto",
    maxWidth: "100%",
    maxHeight: "100%",
  },
  stageEmpty: { color: "#475569", fontSize: 13, fontWeight: 500 },
  stageAvatarWrap: {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#14161d",
  },
  stageAvatar: {
    width: 108,
    height: 108,
    borderRadius: "50%",
    background: "linear-gradient(135deg,#6d5ef7,#8b5cf6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 40,
    fontWeight: 800,
    color: "#fff",
    boxShadow: "0 10px 40px rgba(109,94,247,.35)",
  },
  stageNameTag: {
    position: "absolute",
    bottom: 16,
    left: 16,
    display: "flex",
    alignItems: "center",
    gap: 7,
    fontSize: 13,
    fontWeight: 600,
    color: "#fff",
    background: "rgba(10,12,18,.72)",
    borderRadius: 9,
    padding: "6px 12px",
  },
  stageHostTag: {
    position: "absolute",
    top: 16,
    right: 16,
    fontSize: 12,
    fontWeight: 700,
    color: "#93c5fd",
    background: "rgba(37,99,235,.22)",
    border: "1px solid rgba(96,165,250,.25)",
    borderRadius: 8,
    padding: "4px 12px",
  },
  stageHandBadge: {
    position: "absolute",
    top: 60,
    left: 16,
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 11,
    fontWeight: 700,
    color: "#1a1a1a",
    background: "#fbbf24",
    borderRadius: 8,
    padding: "5px 10px",
    boxShadow: "0 4px 14px rgba(251,191,36,.4)",
    animation: "recBlink 1.4s infinite",
  },
  screenLabel: {
    position: "absolute",
    top: 16,
    left: 16,
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    fontWeight: 700,
    color: "#fff",
    background: "rgba(10,12,18,.72)",
    borderRadius: 8,
    padding: "5px 10px",
  },
  captionsBar: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "rgba(10,12,18,.72)",
    borderRadius: 10,
    padding: "8px 14px",
    fontSize: 12,
    color: "#e2e8f0",
    flexShrink: 0,
  },
  floaterLayer: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    overflow: "hidden",
    zIndex: 40,
  },
  floater: {
    position: "absolute",
    bottom: 70,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
    animation: "floatUp 2.4s ease-out forwards",
  },
  floaterEmoji: {
    fontSize: 34,
    filter: "drop-shadow(0 4px 10px rgba(0,0,0,.35))",
  },
  floaterName: {
    fontSize: 10,
    fontWeight: 700,
    color: "#fff",
    background: "rgba(0,0,0,.55)",
    padding: "2px 7px",
    borderRadius: 8,
    whiteSpace: "nowrap",
  },

  filmstrip: {
    flexShrink: 0,
    display: "flex",
    gap: 16,
    padding: "2px 2px 6px",
    overflowX: "auto",
  },
  stripTile: {
    position: "relative",
    flex: "0 0 auto",
    width: "clamp(112px, 15vw, 220px)",
    aspectRatio: "16/12.6",
    background: "#14161d",
    borderRadius: 16,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,.08)",
    boxShadow: "0 4px 14px rgba(0,0,0,.22)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  stripOverflow: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,255,255,.04)",
  },
  stripAvatarWrap: {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  stripAvatar: {
    width: "40%",
    aspectRatio: "1/1",
    minWidth: 34,
    maxWidth: 56,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 17,
    fontWeight: 800,
    color: "#fff",
  },
  stripBadgeTopLeft: {
    position: "absolute",
    top: 8,
    left: 8,
    width: 20,
    height: 20,
    borderRadius: "50%",
    background: "#fbbf24",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  stripMicDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: "50%",
    background: "rgba(10,12,18,.72)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
  },
  stripName: {
    position: "absolute",
    bottom: 7,
    left: 8,
    fontSize: 11,
    fontWeight: 600,
    color: "#fff",
    background: "rgba(10,12,18,.68)",
    borderRadius: 6,
    padding: "2px 8px",
    maxWidth: "calc(100% - 14px)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  gridWrap: {
    flex: 1,
    display: "grid",
    gridAutoRows: "minmax(0,1fr)",
    gap: 14,
    minHeight: 0,
    minWidth: 0,
    overflow: "auto",
    alignContent: "center",
  },
  gridCellOuter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 0,
    minWidth: 0,
    overflow: "hidden",
  },
  gridTile: {
    position: "relative",
    background: "#12141a",
    borderRadius: 18,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,.08)",
    boxShadow: "0 8px 24px rgba(0,0,0,.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    aspectRatio: "16/9",
    height: "100%",
    width: "auto",
    maxWidth: "100%",
    maxHeight: "100%",
  },
  gridAvatar: {
    width: "26%",
    aspectRatio: "1/1",
    minWidth: 40,
    maxWidth: 96,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "clamp(16px,3vw,32px)",
    fontWeight: 800,
    color: "#fff",
  },
  gridNameTag: {
    position: "absolute",
    bottom: 10,
    left: 10,
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    fontWeight: 600,
    color: "#fff",
    background: "rgba(10,12,18,.72)",
    borderRadius: 8,
    padding: "4px 9px",
    maxWidth: "calc(100% - 20px)",
    overflow: "hidden",
  },
  gridHostTag: {
    position: "absolute",
    top: 10,
    right: 10,
    fontSize: 10,
    fontWeight: 700,
    color: "#93c5fd",
    background: "rgba(37,99,235,.22)",
    border: "1px solid rgba(96,165,250,.25)",
    borderRadius: 6,
    padding: "3px 8px",
  },
  gridHandBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    width: 24,
    height: 24,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#fbbf24",
    borderRadius: "50%",
  },

  handle: {
    width: 22,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#0b0d12",
    border: "none",
    borderLeft: "1px solid rgba(255,255,255,.05)",
    cursor: "pointer",
    flexShrink: 0,
    padding: 0,
  },
  sidebar: {
    width: 340,
    background: "#0b0d12",
    borderLeft: "1px solid rgba(255,255,255,.06)",
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
    minWidth: 0,
  },
  sidebarBackdrop: { display: "none" },
  tabRow: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "12px 14px",
    borderBottom: "1px solid rgba(255,255,255,.06)",
    flexShrink: 0,
    flexWrap: "wrap",
  },
  tab: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: "9px 0 11px",
    border: "none",
    borderBottom: "2px solid transparent",
    background: "transparent",
    color: "#64748b",
    cursor: "pointer",
    fontSize: 13,
    fontFamily: "inherit",
    fontWeight: 700,
  },
  tabOn: { color: "#6d8bf7", borderBottom: "2px solid #6d8bf7" },
  cnt: {
    fontSize: 11,
    background: "rgba(109,94,247,.2)",
    color: "#b7aefc",
    borderRadius: 10,
    padding: "1px 7px",
    marginLeft: 3,
  },
  closeBtn: {
    background: "none",
    border: "none",
    color: "#334155",
    cursor: "pointer",
    display: "flex",
    marginLeft: "auto",
    padding: 4,
  },

  chatWrap: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    minHeight: 0,
  },
  msgList: {
    flex: 1,
    overflowY: "auto",
    padding: "16px 16px",
    display: "flex",
    flexDirection: "column",
    gap: 14,
    minHeight: 0,
  },
  msgRow: {
    display: "flex",
    alignItems: "flex-end",
    gap: 7,
    justifyContent: "center",
  },
  msgCol: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    maxWidth: "82%",
    alignSelf: "flex-start",
  },
  msgColSelf: { alignSelf: "flex-end", alignItems: "flex-end" },
  bHeader: {
    display: "flex",
    alignItems: "baseline",
    gap: 8,
    fontSize: 12,
    fontWeight: 700,
    color: "#7ba9f7",
    padding: "0 2px",
  },
  bHeaderSelf: { color: "#b7aefc" },
  bHeaderTime: { fontSize: 11, fontWeight: 500, color: "#475569" },
  sysBubble: {
    fontSize: 12,
    color: "#8b93a5",
    background: "rgba(255,255,255,.05)",
    borderRadius: 8,
    padding: "6px 14px",
    fontWeight: 500,
  },
  bubble: {
    maxWidth: "100%",
    borderRadius: 16,
    padding: "9px 14px",
    display: "flex",
    flexDirection: "column",
    gap: 2,
    wordBreak: "break-word",
  },
  bSelf: {
    background: "linear-gradient(135deg,#6d5ef7,#8b5cf6)",
    borderBottomRightRadius: 4,
  },
  bOther: { background: "#1c1f28", borderBottomLeftRadius: 4 },
  bText: { fontSize: 14, color: "#f1f5f9", lineHeight: 1.45 },
  inputRow: {
    display: "flex",
    gap: 8,
    padding: "12px 14px",
    borderTop: "1px solid rgba(255,255,255,.06)",
    flexShrink: 0,
  },
  chatInput: {
    flex: 1,
    minWidth: 0,
    background: "#161922",
    border: "1px solid rgba(255,255,255,.08)",
    borderRadius: 999,
    padding: "10px 16px",
    color: "#e2e8f0",
    fontSize: 13,
    fontFamily: "inherit",
    outline: "none",
  },
  sendBtn: {
    background: "linear-gradient(135deg,#6d5ef7,#8b5cf6)",
    border: "none",
    borderRadius: "50%",
    width: 40,
    height: 40,
    color: "#fff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  peopleList: {
    flex: 1,
    overflowY: "auto",
    padding: "10px 12px",
    display: "flex",
    flexDirection: "column",
    gap: 4,
    minHeight: 0,
  },
  emptyPpl: {
    fontSize: 12,
    color: "#334155",
    textAlign: "center",
    marginTop: 20,
  },
  pRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "8px 10px",
    borderRadius: 10,
    background: "rgba(255,255,255,.03)",
  },
  pAv: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 14,
    fontWeight: 700,
    flexShrink: 0,
    color: "#fff",
  },
  pName: {
    flex: 1,
    fontSize: 13,
    color: "#cbd5e1",
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  hostTag: {
    fontSize: 10,
    background: "rgba(59,130,246,.15)",
    color: "#60a5fa",
    padding: "2px 8px",
    borderRadius: 6,
    fontWeight: 600,
    flexShrink: 0,
  },
  youTag: {
    fontSize: 10,
    background: "rgba(52,211,153,.12)",
    color: "#6ee7b7",
    padding: "2px 8px",
    borderRadius: 6,
    fontWeight: 600,
    flexShrink: 0,
  },

  settingsOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,.5)",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  settingsPanel: {
    width: 320,
    maxWidth: "100%",
    background: "#111726",
    border: "1px solid rgba(255,255,255,.08)",
    borderRadius: 16,
    overflow: "hidden",
    boxShadow: "0 20px 60px rgba(0,0,0,.6)",
  },
  settingsHead: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 16px",
    borderBottom: "1px solid rgba(255,255,255,.06)",
  },
  settingsBody: {
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  settingsRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: 13,
    color: "#cbd5e1",
  },
  settingsToggle: {
    border: "1px solid rgba(255,255,255,.1)",
    background: "rgba(255,255,255,.05)",
    color: "#94a3b8",
    borderRadius: 20,
    padding: "5px 14px",
    fontSize: 11,
    fontWeight: 700,
    cursor: "pointer",
  },
  settingsToggleOn: {
    background: "rgba(109,94,247,.22)",
    borderColor: "rgba(109,94,247,.4)",
    color: "#b7aefc",
  },

  ctrlBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "14px 20px",
    background: "#0b0d12",
    borderTop: "1px solid rgba(255,255,255,.06)",
    flexShrink: 0,
    overflowX: "auto",
    flexWrap: "nowrap",
  },
};
