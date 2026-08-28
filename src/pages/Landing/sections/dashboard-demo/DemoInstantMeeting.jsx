import { useState } from "react";
import { Zap, Video, Copy, Users, Clock } from "lucide-react";
import DemoPageHead from "./DemoPageHead";
import { instantMeetingRecents } from "./demoData";

export default function DemoInstantMeeting({ onToast }) {
  const [joinCode, setJoinCode] = useState("");
  const personalLink = "meet.ilmora.ai/inst-7f2k9";

  return (
    <div className="ws-content">
      <DemoPageHead
        eyebrow="Meet now"
        title="Instant Meeting"
        subtitle="Start a meeting immediately or join one with a code."
      />

      <div className="im-grid">
        <div className="im-hero">
          <h2>Start an instant meeting</h2>
          <p>
            Spin up a live room right now — no scheduling needed. Anyone with
            the link can join instantly.
          </p>
          <button
            className="btn-primary"
            onClick={() =>
              onToast("Demo mode — this launches a live room in the real product")
            }
          >
            <Video size={16} /> Start Instant Meeting
          </button>
        </div>

        <section className="section-card">
          <div className="section-card-head">
            <h2>Join a meeting</h2>
          </div>
          <div className="im-join-row">
            <input
              placeholder="Enter meeting code or link"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
            />
            <button
              className="btn-primary"
              onClick={() =>
                onToast(joinCode ? `Joining "${joinCode}" (demo)` : "Enter a meeting code first")
              }
            >
              Join
            </button>
          </div>
          <div className="list-row" style={{ marginTop: 12 }}>
            <div className="list-row-main">
              <div className="title">Your personal room</div>
              <div className="meta">{personalLink}</div>
            </div>
            <button
              className="icon-btn"
              title="Copy link"
              onClick={() => onToast("Meeting link copied (demo)")}
            >
              <Copy size={14} />
            </button>
          </div>
        </section>
      </div>

      <section className="section-card" style={{ marginTop: 20 }}>
        <div className="section-card-head">
          <h2>Recent Instant Meetings</h2>
        </div>
        {instantMeetingRecents.length === 0 ? (
          <div className="empty-state">
            <Zap size={26} />
            <h3>No instant meetings yet</h3>
            <p>Meetings you start instantly will show up here.</p>
          </div>
        ) : (
          instantMeetingRecents.map((m) => (
            <div className="list-row" key={m.id}>
              <div className="list-row-main">
                <div className="title">{m.title}</div>
                <div className="meta">
                  <Clock size={11} style={{ verticalAlign: "-2px", marginRight: 4 }} />
                  {m.when} · {m.duration} ·{" "}
                  <Users size={11} style={{ verticalAlign: "-2px", marginRight: 2 }} />
                  {m.participants} joined
                </div>
              </div>
              <button
                className="btn-ghost btn-sm"
                onClick={() => onToast("Starting a new call with the same participants (demo)")}
              >
                Meet again
              </button>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
