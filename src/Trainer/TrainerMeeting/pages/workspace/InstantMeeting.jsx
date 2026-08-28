import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlayCircle, LogIn, Video, ArrowRight, Copy, X } from "lucide-react";
import PageHead from "../../components/PageHead";
import { useToast } from "../../components/Toast";
// ⚠️ SAME services the old production TrainerMeetings.jsx (mirrors SuperAdminMeetings.jsx) used.
// These live in src/services/ — from this file (src/Trainer/
// TrainerMeeting/pages/workspace/InstantMeeting.jsx) that is five levels
// up. If your folder tree differs, adjust the number of "../" only.
import {
  getMyMeetings,
  createInstantMeeting,
  validateMeetingJoinCode,
} from "../../../../services/liveSessionService";

// Logged-in user's display name — same approach as the old file.
const currentUserName = (() => {
  try {
    const user = JSON.parse(localStorage.getItem("lms_user"));
    return user?.name || user?.email || "You";
  } catch {
    return "You";
  }
})();

function formatWhen(value) {
  if (!value) return "";
  const d = new Date(value);
  return isNaN(d.getTime()) ? "" : d.toLocaleString();
}

// The shareable link a participant opens to land in the meeting. It mirrors the
// in-app navigate target below (`/workspace/<code>`). ⚠️ If your real join URL
// looks different (custom domain / different route), change ONLY this line.
function buildMeetingLink(joinCode) {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return `${origin}/workspace/${joinCode}`;
}

export default function InstantMeeting() {
  const navigate = useNavigate();
  const showToast = useToast();

  // Start-meeting: just a session name, exactly like the old instant flow.
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState("");
  const [starting, setStarting] = useState(false);

  // Google-Meet-style "your meeting is ready" popup shown right after creating,
  // so the link can be copied/shared before actually entering the room.
  const [created, setCreated] = useState(null); // { joinCode, title, link } | null

  // Join-by-code: inline validate + navigate (no popup), like the old page.
  const [joinId, setJoinId] = useState("");
  const [joinError, setJoinError] = useState("");

  const [recent, setRecent] = useState([]);

  // Recent instant meetings from the real backend. "Instant" = everything the
  // creator started on the spot, i.e. not a SCHEDULED meeting.
  useEffect(() => {
    getMyMeetings()
      .then((res) => {
        const rows = (res.data || [])
          .filter((m) => m.meetingStatus !== "SCHEDULED")
          .slice(0, 6);
        setRecent(rows);
      })
      .catch((err) => console.error("Failed to load meetings", err));
  }, []);

  // Copy a link to the clipboard, with a fallback for older / non-secure browsers.
  const copyLink = async (link) => {
    try {
      await navigator.clipboard.writeText(link);
      showToast("Meeting link copied");
    } catch {
      const ta = document.createElement("textarea");
      ta.value = link;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        showToast("Meeting link copied");
      } catch {
        showToast("Couldn't copy — please copy it manually");
      }
      document.body.removeChild(ta);
    }
  };

  const handleStart = async () => {
    if (starting) return;
    const name = title.trim();
    // ── Validation: a session name is required before we create anything. ──
    if (!name) {
      setTitleError("Please enter a session name first.");
      return;
    }
    setTitleError("");
    setStarting(true);
    try {
      const res = await createInstantMeeting({
        title: name,
        creatorName: currentUserName,
      });
      const joinCode = res.data.joinCode;
      // The meeting now EXISTS on the backend. We deliberately do NOT navigate
      // away yet — first show the share popup so the link can be copied (Google
      // Meet style). Skipping the popup does NOT undo the meeting; it stays.
      setCreated({ joinCode, title: name, link: buildMeetingLink(joinCode) });
      // Reflect it immediately at the top of the Recent list too.
      setRecent((cur) =>
        [
          {
            id: res.data.id ?? joinCode,
            joinCode,
            title: res.data.title ?? name,
            meetingStatus: res.data.meetingStatus ?? "ACTIVE",
          },
          ...cur.filter((m) => m.joinCode !== joinCode),
        ].slice(0, 6),
      );
      setTitle("");
    } catch (err) {
      console.error("Failed to start instant meeting", err);
      showToast(
        err?.response?.data?.error || "Couldn't start the meeting. Try again.",
      );
    } finally {
      setStarting(false);
    }
  };

  const handleJoin = async () => {
    const code = joinId.trim();
    if (!code) {
      setJoinError("Enter a meeting code first.");
      return;
    }
    try {
      const res = await validateMeetingJoinCode(code);
      if (res.data.valid) {
        setJoinError("");
        navigate(`/workspace/${code}`);
      } else {
        setJoinError(res.data.message || "Invalid code");
      }
    } catch (err) {
      setJoinError("Invalid code");
    }
  };

  return (
    <div className="ws-content">
      <PageHead
        title="Instant Meeting"
        subtitle="Start or join an ongoing meeting with your team."
      />

      <div className="im-grid">
        <div className="im-hero">
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              background: "rgba(255,255,255,.16)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Video size={22} />
          </div>
          <h2>Start an Instant Meeting</h2>
          <p>
            Start a quick meeting and invite others to join instantly. No
            scheduling needed.
          </p>

          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (titleError) setTitleError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleStart()}
            placeholder="Session name (e.g. Java doubts session)"
            autoFocus
            style={{
              width: "100%",
              boxSizing: "border-box",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,.35)",
              background: "rgba(255,255,255,.16)",
              color: "#fff",
              padding: "10px 12px",
              fontSize: 13.5,
              outline: "none",
            }}
          />
          {titleError && (
            <p style={{ color: "#fecaca", fontSize: 12, margin: "6px 0 0" }}>
              {titleError}
            </p>
          )}

          <button
            className="btn-primary"
            onClick={handleStart}
            disabled={starting}
          >
            <PlayCircle size={16} />{" "}
            {starting ? "Starting…" : "Start Instant Meeting"}
          </button>
        </div>

        <div className="section-card">
          <div className="section-card-head">
            <h2>Join a Meeting</h2>
          </div>
          <p className="muted" style={{ marginTop: 0 }}>
            Enter meeting id or link to join an ongoing meeting.
          </p>
          <div className="im-join-row">
            <input
              placeholder="Enter meeting ID or link"
              value={joinId}
              onChange={(e) => {
                setJoinId(e.target.value);
                setJoinError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleJoin()}
            />
            <button className="btn-primary" onClick={handleJoin}>
              <LogIn size={15} /> Join Meeting
            </button>
          </div>
          {joinError && (
            <p style={{ color: "#dc2626", fontSize: 12, margin: "8px 0 0" }}>
              {joinError}
            </p>
          )}
        </div>
      </div>

      <section className="section-card">
        <div className="section-card-head">
          <h2>Recent Instant Meetings</h2>
        </div>
        {recent.length === 0 ? (
          <p className="muted" style={{ margin: 0 }}>
            No instant meetings yet.
          </p>
        ) : (
          recent.map((m) => {
            const isLive = m.meetingStatus === "ACTIVE";
            const isEnded = m.meetingStatus === "ENDED";
            const when =
              m.meetingStatus === "ENDED"
                ? formatWhen(m.endedAt)
                  ? `Ended ${formatWhen(m.endedAt)}`
                  : "Ended"
                : isLive
                  ? "Live now"
                  : m.meetingStatus;
            return (
              <div className="list-row" key={m.id}>
                <div className="list-row-main">
                  <div className="title">{m.title || "Untitled session"}</div>
                  <div className="meta">Code: {m.joinCode}</div>
                </div>
                <span className={`badge ${isLive ? "live" : "muted"}`}>
                  {when}
                </span>
                {/* Only offer the link while the room is still usable — once a
                    meeting has ENDED the link is dead, so no Copy button. */}
                {!isEnded && (
                  <button
                    className="btn-ghost btn-sm"
                    onClick={() => copyLink(buildMeetingLink(m.joinCode))}
                  >
                    <Copy size={13} /> Copy link
                  </button>
                )}
                {isLive && (
                  <button
                    className="btn-ghost btn-sm"
                    onClick={() => navigate(`/workspace/${m.joinCode}`)}
                  >
                    Join <ArrowRight size={13} />
                  </button>
                )}
              </div>
            );
          })
        )}
      </section>

      {/* ── "Your meeting is ready" popup (Google-Meet style) ───────────────
          Appears right after the meeting is created. The meeting already
          exists at this point, so closing / skipping this never loses it —
          the link is always still available from the Recent list below. */}
      {created && (
        <div
          onClick={() => setCreated(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: 16,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 460,
              background: "#fff",
              borderRadius: 16,
              padding: "22px 22px 18px",
              boxShadow: "0 20px 60px rgba(0,0,0,.25)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 6,
              }}
            >
              <h3 style={{ margin: 0, fontSize: 16 }}>Your meeting is ready</h3>
              <button
                className="btn-ghost btn-sm"
                onClick={() => setCreated(null)}
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>
            <p className="muted" style={{ margin: "0 0 12px", fontSize: 13 }}>
              Share this link with anyone you want in “{created.title}”. They
              can join straight from it.
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                readOnly
                value={created.link}
                onFocus={(e) => e.target.select()}
                style={{
                  flex: 1,
                  minWidth: 0,
                  borderRadius: 10,
                  border: "1px solid #e2e8f0",
                  padding: "10px 12px",
                  fontSize: 13,
                  background: "#f8fafc",
                  color: "#0f172a",
                }}
              />
              <button
                className="btn-primary"
                onClick={() => copyLink(created.link)}
              >
                <Copy size={15} /> Copy
              </button>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 8,
                marginTop: 16,
              }}
            >
              <button className="btn-ghost" onClick={() => setCreated(null)}>
                Skip
              </button>
              <button
                className="btn-primary"
                onClick={() => {
                  const code = created.joinCode;
                  setCreated(null);
                  navigate(`/workspace/${code}`);
                }}
              >
                Join now <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
