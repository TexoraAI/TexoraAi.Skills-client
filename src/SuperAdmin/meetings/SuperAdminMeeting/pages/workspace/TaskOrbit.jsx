import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PlusCircle,
  Building2,
  ArrowRight,
  Copy,
  X,
  Link2,
  Repeat,
  ShieldCheck,
} from "lucide-react";
import PageHead from "../../components/PageHead";
import { useToast } from "../../components/Toast";
// ⚠️ SAME service the old production SuperAdminMeetings.jsx used for the
// "Task Orbit meeting" button. It lives in src/services/ — from this file
// that is five levels up. If your folder tree differs, adjust the "../" count.
import {
  getMyMeetings,
  createPermanentMeeting,
} from "../../../../../services/liveSessionService";

// Logged-in user's display name — same approach as the old file.
const currentUserName = (() => {
  try {
    const user = JSON.parse(localStorage.getItem("lms_user"));
    return user?.name || user?.email || "You";
  } catch {
    return "You";
  }
})();

// The shareable link a participant opens to land in the room. It mirrors the
// in-app navigate target below (`/workspace/<code>`). ⚠️ If your real join URL
// looks different (custom domain / different route), change ONLY this line.
function buildMeetingLink(joinCode) {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return `${origin}/workspace/${joinCode}`;
}

export default function TaskOrbit() {
  const navigate = useNavigate();
  const showToast = useToast();

  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState("");
  const [creating, setCreating] = useState(false);

  // "Your room is ready" share popup (same Google-Meet-style pattern as the
  // Instant Meeting page), shown right after the permanent room is created.
  const [created, setCreated] = useState(null); // { joinCode, title, link } | null

  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    getMyMeetings()
      .then((res) => {
        const rows = (res.data || [])
          // Task Orbit rooms are permanent (always-on) rooms — they stay
          // ACTIVE and never move to SCHEDULED/ENDED. ⚠️ If your backend tags
          // permanent meetings with a dedicated field (e.g.
          // m.meetingType === "PERMANENT"), refine this one filter to that.
          .filter((m) => m.meetingStatus === "ACTIVE")
          .slice(0, 6);
        setRooms(rows);
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

  const handleCreate = async () => {
    if (creating) return;
    const name = title.trim();
    // ── Validation: a meeting name is required before we create anything. ──
    if (!name) {
      setTitleError("Please enter a meeting name first.");
      return;
    }
    setTitleError("");
    setCreating(true);
    try {
      const res = await createPermanentMeeting({
        title: name,
        creatorName: currentUserName,
      });
      const joinCode = res.data.joinCode;
      // The room now EXISTS on the backend. Show the share popup first (instead
      // of jumping straight in) so the link can be copied. Skipping the popup
      // does NOT undo the room — it stays open.
      setCreated({ joinCode, title: name, link: buildMeetingLink(joinCode) });
      // Reflect it immediately at the top of the room list too.
      setRooms((cur) =>
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
      console.error("Failed to create Task Orbit meeting", err);
      showToast(
        err?.response?.data?.error || "Couldn't create the meeting. Try again.",
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="ws-content">
      <PageHead
        title="Task Orbit Meeting"
        subtitle="Create a permanent room your team can return to anytime."
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
            <Building2 size={22} />
          </div>
          <h2>Create a Task Orbit Meeting</h2>
          <p>
            Spin up a permanent room your team can return to anytime. No
            scheduling, no expiry — one link, reused forever.
          </p>

          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (titleError) setTitleError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            placeholder="Meeting name (e.g. Ops war room)"
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
            onClick={handleCreate}
            disabled={creating}
          >
            <PlusCircle size={16} />{" "}
            {creating ? "Creating…" : "Create Task Orbit Meeting"}
          </button>
        </div>

        <div className="section-card">
          <div className="section-card-head">
            <h2>What's a Task Orbit room?</h2>
          </div>
          <p className="muted" style={{ marginTop: 0 }}>
            A permanent meeting room that always stays open. Create it once,
            share the link, and reuse the same room whenever you need it.
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              marginTop: 4,
            }}
          >
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <Link2
                size={16}
                color="var(--brand)"
                style={{ marginTop: 2, flexShrink: 0 }}
              />
              <div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>
                  One permanent link
                </div>
                <div className="muted">Share it once — it never expires.</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <Repeat
                size={16}
                color="var(--brand)"
                style={{ marginTop: 2, flexShrink: 0 }}
              />
              <div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>
                  Reuse anytime
                </div>
                <div className="muted">
                  Jump back into the same room whenever you need it.
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <ShieldCheck
                size={16}
                color="var(--brand)"
                style={{ marginTop: 2, flexShrink: 0 }}
              />
              <div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>
                  Verified entry
                </div>
                <div className="muted">
                  Only invited or admitted people can join.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="section-card">
        <div className="section-card-head">
          <h2>Your Task Orbit Rooms</h2>
        </div>
        {rooms.length === 0 ? (
          <p className="muted" style={{ margin: 0 }}>
            No Task Orbit rooms yet.
          </p>
        ) : (
          rooms.map((m) => (
            <div className="list-row" key={m.id}>
              <div className="list-row-main">
                <div className="title">{m.title || "Untitled room"}</div>
                <div className="meta">Code: {m.joinCode}</div>
              </div>
              <span className="badge live">Open</span>
              <button
                className="btn-ghost btn-sm"
                onClick={() => copyLink(buildMeetingLink(m.joinCode))}
              >
                <Copy size={13} /> Copy link
              </button>
              <button
                className="btn-ghost btn-sm"
                onClick={() => navigate(`/workspace/${m.joinCode}`)}
              >
                Open <ArrowRight size={13} />
              </button>
            </div>
          ))
        )}
      </section>

      {/* ── "Your room is ready" popup (Google-Meet style) ──────────────────
          Appears right after the room is created. The room already exists at
          this point, so closing / skipping this never loses it — the link is
          always still available from the room list above. */}
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
              <h3 style={{ margin: 0, fontSize: 16 }}>
                Your Task Orbit room is ready
              </h3>
              <button
                className="btn-ghost btn-sm"
                onClick={() => setCreated(null)}
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>
            <p className="muted" style={{ margin: "0 0 12px", fontSize: 13 }}>
              This is the permanent link for “{created.title}”. Share it once —
              anyone with it can join the room anytime.
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
                Open room <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
