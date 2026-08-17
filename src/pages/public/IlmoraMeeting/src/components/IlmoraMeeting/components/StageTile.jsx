import {
  Hand,
  Maximize2,
  Mic,
  MicOff,
  MonitorPlay,
} from "lucide-react";
import { AudioTrackEl } from "./AudioTrackEl";
import { ReactionBadge } from "./ReactionBadge";
import { VideoTrackEl } from "./VideoTrackEl";
import { getAvatarCircleStyle, getAvatarStyle } from "../utils/avatar";

export function StageTile({ p, raised, reaction, S, onMaximize, presenterCam }) {
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
  const canZoom = isScreen && hasVideo && !!onMaximize;
  const tileColor = getAvatarStyle(
    p.isLocal ? "you" : p.avatarSeed || p.identity || p.name,
  );
  return (
    <div style={S.stageOuter}>
      <div
        style={{
          ...S.stage,
          background: isScreen ? S.stage.background : tileColor,
        }}
        className={`im-stage${speaking ? " im-speaking" : ""}`}
        onDoubleClick={canZoom ? onMaximize : undefined}
      >
        {hasVideo ? (
          <VideoTrackEl
            track={track}
            mirrored={!isScreen && p.isLocal}
            fit={isScreen ? "contain" : "cover"}
          />
        ) : (
          <div style={S.stageAvatarWrap}>
            <div
              style={{
                ...S.stageAvatar,
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

        {isScreen && !p.isLocal && (
          <div style={S.screenLabel}>
            <MonitorPlay size={13} />
            {`${p.name} is presenting`}
          </div>
        )}
        {isScreen && presenterCam?.track && !presenterCam.cameraMuted && (
          <div style={S.presenterCamBubble}>
            <VideoTrackEl
              track={presenterCam.track}
              mirrored={presenterCam.isLocal}
              fit="cover"
            />
            <span style={S.presenterCamName}>
              {presenterCam.name}
              {presenterCam.isLocal ? " (You)" : ""}
            </span>
          </div>
        )}
        {canZoom && (
          <button
            type="button"
            style={S.stageZoomBtn}
            onClick={onMaximize}
            title="View full screen"
            aria-label="View screen share full screen"
          >
            <Maximize2 size={15} />
          </button>
        )}
        <div style={S.stageNameTag}>
          {p.isSpeaking && !p.micMuted ? (
            <span className="im-wave">
              <span />
              <span />
              <span />
            </span>
          ) : p.micMuted ? (
            <MicOff size={13} />
          ) : (
            <Mic size={13} />
          )}
          <span style={S.nameEllipsis}>
            {p.name}
            {p.isLocal ? " (You)" : ""}
          </span>
        </div>
        {p.isHost && <span style={S.stageHostTag}>Host</span>}
        {raised && (
          <div style={S.stageHandBadge}>
            <Hand size={14} color="#202124" />
            <span>Hand raised</span>
          </div>
        )}
        <ReactionBadge emoji={reaction} style={S.stageReactionBadge} />
      </div>
    </div>
  );
}
