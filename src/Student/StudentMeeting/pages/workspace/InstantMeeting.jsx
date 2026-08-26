import React, { useState } from "react";
import { PlayCircle, LogIn, Video, ArrowRight } from "lucide-react";
import PageHead from "../../components/PageHead";
import { instantMeetings } from "../../data/mockData";
import { useToast } from "../../components/Toast";
import { useWorkspaceModal } from "../../components/modals/ModalProvider";

export default function InstantMeeting() {
  const [joinId, setJoinId] = useState("");
  const showToast = useToast();
  const { openMeetingSetup, openJoinMeeting } = useWorkspaceModal();

  const handleStart = () => openMeetingSetup();

  const handleJoin = () => {
    openJoinMeeting({
      initialValue: joinId,
      onJoined: () => setJoinId(""),
    });
  };

  return (
    <div className="ws-content">
      <PageHead title="Instant Meeting" subtitle="Start or join an ongoing meeting with your team." />

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
          <p>Start a quick meeting and invite others to join instantly. No scheduling needed.</p>
          <button className="btn-primary" onClick={handleStart}>
            <PlayCircle size={16} /> Start Instant Meeting
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
              onChange={(e) => setJoinId(e.target.value)}
            />
            <button className="btn-primary" onClick={handleJoin}>
              <LogIn size={15} /> Join Meeting
            </button>
          </div>
        </div>
      </div>

      <section className="section-card">
        <div className="section-card-head">
          <h2>Recent Instant Meetings</h2>
          <button className="section-link" onClick={() => showToast("Opening all instant meetings")}>
            View all <ArrowRight size={13} />
          </button>
        </div>
        {instantMeetings.map((m) => (
          <div className="list-row" key={m.id}>
            <div className="list-row-main">
              <div className="title">{m.title}</div>
              <div className="meta">Meeting ID: {m.meetingId}</div>
            </div>
            <span className="badge">{m.when}</span>
            <span className="badge muted">Duration: {m.duration}</span>
          </div>
        ))}
      </section>
    </div>
  );
}
