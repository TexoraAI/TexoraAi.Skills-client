import { useRef } from "react";
import {
  Crown,
  Hand,
  MicOff,
  MoreVertical,
} from "lucide-react";
import { AudioTrackEl } from "./AudioTrackEl";
import { ReactionBadge } from "./ReactionBadge";
import { VideoTrackEl } from "./VideoTrackEl";
import { useInView } from "../hooks/useInView";
import { getAvatarStyle } from "../utils/avatar";

/* FIX (mobile UI): full-width stacked tile used ONLY on phone-width
   screens, one participant per row, matching the target mobile design
   (avatar centered, name pill bottom-left, mic/host badge top-left,
   overflow menu top-right, small local self-camera thumbnail bottom-
   right when the local user's camera is on). Desktop/tablet/laptop
   layouts (grid / stage+filmstrip) are completely untouched. */
export function MobileStackedTile({ p, raised, reaction, active, S, onOpenPeople }) {
  const wrapRef = useRef(null);
  const inView = useInView(wrapRef);
  const isScreen = !!p.screenTrack;
  const track = isScreen ? p.screenTrack : p.cameraTrack;
  const hasVideo = !!track && (isScreen || (!p.cameraMuted && inView));
  const initial = (p.name || "?").trim().charAt(0).toUpperCase() || "?";
  return (
    <div
      ref={wrapRef}
      style={{
        ...S.mobileTile,
        ...(active ? S.mobileTileActive : null),
      }}
      className={`im-mobile-tile${p.isSpeaking ? " im-speaking" : ""}`}
    >
      {!p.isLocal && p.micTrack && <AudioTrackEl track={p.micTrack} />}

      {/* centered content: full camera OR avatar bubble */}
      {hasVideo ? (
        <VideoTrackEl
          track={track}
          mirrored={!isScreen && p.isLocal}
          fit={isScreen ? "contain" : "cover"}
        />
      ) : (
        <div style={S.mobileTileAvatarWrap}>
          <div
            style={{
              ...S.mobileTileAvatar,
              background: getAvatarStyle(
                p.isLocal ? "you" : p.avatarSeed || p.identity || p.name,
              ),
            }}
          >
            {initial}
          </div>
        </div>
      )}

      {/* top-left: mic-muted pill, or host crown / raised-hand badge */}
      <div style={S.mobileTileTopLeft}>
        {p.micMuted ? (
          <span style={S.mobileTileIconPill}>
            <MicOff size={13} />
          </span>
        ) : null}
        {raised && (
          <span style={{ ...S.mobileTileIconPill, background: "#fdd663" }}>
            <Hand size={13} color="#202124" />
          </span>
        )}
        {p.isHost && !raised && (
          <span style={{ ...S.mobileTileIconPill, background: "#fdd663" }}>
            <Crown size={13} color="#202124" />
          </span>
        )}
      </div>

      {/* top-right: overflow menu, opens the People panel */}
      <button
        type="button"
        style={S.mobileTileMenuBtn}
        onClick={onOpenPeople}
        aria-label="More options"
      >
        <MoreVertical size={16} />
      </button>

      {/* bottom-left: name pill */}
      <div style={S.mobileTileName}>
        {p.name}
        {p.isLocal ? " (You)" : ""}
      </div>
      <ReactionBadge emoji={reaction} style={S.mobileTileReactionBadge} />
    </div>
  );
}
