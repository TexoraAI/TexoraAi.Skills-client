import { Mic, MicOff, Video, VideoOff, Hand, ScreenShare } from "lucide-react";
import "./VideoCard.css";

/**
 * Premium video tile.
 * Top-left    → name + Host badge (trainer only)
 * Top-right   → mic status indicator
 * Bottom-left → name overlay pill
 * Bottom-right→ camera status indicator
 * Floating    → hand-raised / screen-sharing badges, Meet-style
 */
export default function VideoCard({ participant, className = "" }) {
  const { name, isHost, isLocal, micOn, camOn, handRaised, presenting, color } = participant;

  return (
    <div className={`vc-card ${isLocal ? "vc-card--local" : ""} ${className}`}>
      <div className="vc-media" style={{ background: color }}>
        {!camOn && (
          <div className="vc-avatarFallback">
            <span>{(name?.[0] || "?").toUpperCase()}</span>
          </div>
        )}
      </div>

      {/* dim scrim so overlays stay legible on any footage */}
      <div className="vc-scrim" />

      <div className="vc-topLeft">
        <span className="vc-nameTag">{name}</span>
        {isHost && <span className="vc-hostBadge">Host</span>}
      </div>

      <div className="vc-topRight">
        {micOn ? (
          <span className="vc-micLive" title="Speaking">
            <span className="bar" />
            <span className="bar" />
            <span className="bar" />
          </span>
        ) : (
          <span className="vc-badge vc-badge--danger" title="Muted">
            <MicOff size={13} strokeWidth={2.4} />
          </span>
        )}
      </div>

      {presenting && (
        <span className="vc-floatBadge vc-floatBadge--presenting" title="Presenting">
          <ScreenShare size={12} strokeWidth={2.4} />
          Presenting
        </span>
      )}

      {handRaised && (
        <span className="vc-floatBadge vc-floatBadge--hand" title="Hand raised">
          <Hand size={13} strokeWidth={2.4} className="vc-handIcon" />
        </span>
      )}

      <div className="vc-bottomLeft">
        <span className="vc-nameOverlay">{name}</span>
      </div>

      <div className="vc-bottomRight">
        <span className={`vc-badge ${camOn ? "vc-badge--muted" : "vc-badge--danger"}`}>
          {camOn ? <Video size={13} strokeWidth={2.4} /> : <VideoOff size={13} strokeWidth={2.4} />}
        </span>
      </div>
    </div>
  );
}
