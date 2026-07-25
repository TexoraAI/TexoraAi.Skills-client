import { useState } from "react";
import { Search, MoreVertical, Mic, MicOff, Video, VideoOff, Hand, ScreenShare } from "lucide-react";
import LiveParticipantMenu from "./LiveParticipantMenu.jsx";
import "./LiveParticipantsPanel.css";

export default function LiveParticipantsPanel({ participants, isTrainer, onAction }) {
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState(null);

  const filtered = participants.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="pp-panel">
      <div className="pp-head">
        <span className="pp-title">Participants ({participants.length})</span>
      </div>

      <div className="pp-search">
        <Search size={14} color="#6B7280" />
        <input
          placeholder="Search participants"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="pp-list hide-scrollbar">
        {filtered.map((p) => (
          <div key={p.identity} className="pp-row">
            <div className="pp-avatar" style={{ background: p.color }}>
              {(p.name?.[0] || "?").toUpperCase()}
            </div>
            <div className="pp-nameWrap">
              <span className="pp-name">{p.name}</span>
              {p.isHost && <span className="pp-hostTag">Host</span>}
            </div>

            {p.handRaised && (
              <span className="pp-icon pp-icon--hand" title="Hand raised">
                <Hand size={12} strokeWidth={2.6} />
              </span>
            )}
            {p.presenting && (
              <ScreenShare size={13} color="#93C5FD" title="Presenting" />
            )}
            {p.micOn ? <Mic size={13} color="#8b90a0" /> : <MicOff size={13} color="#f87171" />}
            {p.camOn ? <Video size={13} color="#8b90a0" /> : <VideoOff size={13} color="#f87171" />}

            {isTrainer && !p.isLocal && (
              <div className="pp-menuWrap">
                <button
                  className="pp-menuBtn"
                  onClick={() => setOpenId((cur) => (cur === p.identity ? null : p.identity))}
                >
                  <MoreVertical size={14} />
                </button>
                {openId === p.identity && (
                  <LiveParticipantMenu
                    participant={p}
                    onClose={() => setOpenId(null)}
                    onAction={(participant, item) => {
                      onAction(participant, item);
                      setOpenId(null);
                    }}
                  />
                )}
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="pp-empty">No matching participants</div>
        )}
      </div>
    </div>
  );
}
