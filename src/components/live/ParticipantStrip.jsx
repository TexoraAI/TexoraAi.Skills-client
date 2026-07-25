import { MicOff } from "lucide-react";
import "./ParticipantStrip.css";

export default function ParticipantStrip({ participants, moreCount, onOpenParticipants }) {
  return (
    <div className="ps-row">
      {participants.map((p) => (
        <div key={p.identity} className="ps-chip">
          <div className="ps-avatar" style={{ background: p.color }}>
            {!p.micOn && (
              <span className="ps-muteBadge">
                <MicOff size={11} strokeWidth={2.6} />
              </span>
            )}
            <span>{p.initial}</span>
          </div>
          <span className="ps-name">{p.name}</span>
        </div>
      ))}

      {moreCount > 0 && (
        <button className="ps-more ripple-btn" onClick={onOpenParticipants}>
          <span className="ps-moreCount">+{moreCount}</span>
          <span className="ps-moreLabel">More participants</span>
        </button>
      )}
    </div>
  );
}
