import { useRef } from "react";
import {
  Crown,
  Hand,
  Mic,
  MicOff,
} from "lucide-react";
import { AudioTrackEl } from "./AudioTrackEl";
import { ReactionBadge } from "./ReactionBadge";
import { VideoTrackEl } from "./VideoTrackEl";
import { useInView } from "../hooks/useInView";
import { getAvatarCircleStyle, getAvatarStyle } from "../utils/avatar";

/* ─── video tiles: strip / grid / stage ─────────────────────────── */
export function StripTile({ p, active, raised, reaction, S }) {
  const wrapRef = useRef(null);
  const inView = useInView(wrapRef);
  const isScreen = !!p.screenTrack;
  const track = isScreen ? p.screenTrack : p.cameraTrack;
  const hasVideo = !!track && (isScreen || (!p.cameraMuted && inView));
  const initial = (p.name || "?").trim().charAt(0).toUpperCase() || "?";
  const tileColor = getAvatarStyle(
    p.isLocal ? "you" : p.avatarSeed || p.identity || p.name,
  );
  return (
    <div
      ref={wrapRef}
      className={`im-strip-tile${active ? " im-strip-tile-active" : ""}${p.isSpeaking ? " im-speaking" : ""}`}
      style={{ ...S.stripTile, background: tileColor }}
    >
      {hasVideo ? (
        <VideoTrackEl
          track={track}
          mirrored={!isScreen && p.isLocal}
          fit={isScreen ? "contain" : "cover"}
        />
      ) : (
        <div style={S.stripAvatarWrap}>
          <div
            style={{
              ...S.stripAvatar,
              background: getAvatarCircleStyle(
                p.isLocal ? "you" : p.avatarSeed || p.identity || p.name,
              ),
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
            <Hand size={11} color="#202124" />
          ) : (
            <Crown size={11} color="#202124" />
          )}
        </div>
      )}
      <div style={S.stripMicDot}>
        {p.isSpeaking && !p.micMuted ? (
          <span className="im-wave">
            <span />
            <span />
            <span />
          </span>
        ) : p.micMuted ? (
          <MicOff size={10} />
        ) : (
          <Mic size={10} />
        )}
      </div>
      <div style={S.stripName}>
        {p.name}
        {p.isLocal ? " (You)" : ""}
      </div>
      <ReactionBadge emoji={reaction} style={S.stripReactionBadge} />
    </div>
  );
}
