// import { useRef } from "react";
// import {
//   Hand,
//   Mic,
//   MicOff,
// } from "lucide-react";
// import { AudioTrackEl } from "./AudioTrackEl";
// import { ReactionBadge } from "./ReactionBadge";
// import { VideoTrackEl } from "./VideoTrackEl";
// import { useInView } from "../hooks/useInView";
// import { getAvatarCircleStyle, getAvatarStyle } from "../utils/avatar";

// export function GridTile({ p, raised, reaction, S, basisPercent }) {
//   const wrapRef = useRef(null);
//   const inView = useInView(wrapRef);

//   // FIX (screen-share visibility bug): grid tiles never checked for
//   // an active screen-share track — only camera. If grid layout is
//   // active while someone is presenting, their share silently dropped.
//   const isScreen = !!p.screenTrack;
//   const track = isScreen ? p.screenTrack : p.cameraTrack;
//   const hasVideo = !!track && (isScreen || (!p.cameraMuted && inView));
//   const tileColor = getAvatarStyle(
//     p.isLocal ? "you" : p.avatarSeed || p.identity || p.name,
//   );

//   const initial = (p.name || "?").trim().charAt(0).toUpperCase() || "?";
//   return (
//     <div
//       ref={wrapRef}
//       style={{
//         ...S.gridCellOuter,
//         flex: `0 0 ${basisPercent}%`,
//         maxWidth: `${basisPercent}%`,
//       }}
//     >
//       <div
//         style={{ ...S.gridTile, background: tileColor }}
//         className={`im-grid-tile${p.isSpeaking ? " im-speaking" : ""}`}
//       >
//         {hasVideo ? (
//           <VideoTrackEl
//             track={track}
//             mirrored={!isScreen && p.isLocal}
//             fit={isScreen ? "contain" : "cover"}
//           />
//         ) : (
//           <div style={S.stageAvatarWrap}>
//             <div
//               style={{
//                 ...S.gridAvatar,
//                 background: getAvatarCircleStyle(
//                   p.isLocal ? "you" : p.avatarSeed || p.identity || p.name,
//                 ),
//               }}
//             >
//               {initial}
//             </div>
//           </div>
//         )}
//         {!p.isLocal && p.micTrack && <AudioTrackEl track={p.micTrack} />}
//         <div style={S.gridNameTag}>
//           {p.isSpeaking && !p.micMuted ? (
//             <span className="im-wave">
//               <span />
//               <span />
//               <span />
//             </span>
//           ) : p.micMuted ? (
//             <MicOff size={12} />
//           ) : (
//             <Mic size={12} />
//           )}
//           <span style={S.nameEllipsis}>
//             {p.name}
//             {p.isLocal ? " (You)" : ""}
//           </span>
//         </div>
//         {p.isHost && <span style={S.gridHostTag}>Host</span>}
//         {raised && (
//           <div style={S.gridHandBadge}>
//             <Hand size={12} color="#202124" />
//           </div>
//         )}
//         <ReactionBadge emoji={reaction} style={S.gridReactionBadge} />
//       </div>
//     </div>
//   );
// }






























import { useRef } from "react";
import {
  Hand,
  Mic,
  MicOff,
} from "lucide-react";
import { AudioTrackEl } from "./AudioTrackEl";
import { ReactionBadge } from "./ReactionBadge";
import { VideoTrackEl } from "./VideoTrackEl";
import { useInView } from "../hooks/useInView";
import { getAvatarCircleStyle, getAvatarStyle } from "../utils/avatar";

export function GridTile({ p, raised, reaction, S }) {
  const wrapRef = useRef(null);
  const inView = useInView(wrapRef);

  // FIX (screen-share visibility bug): grid tiles never checked for
  // an active screen-share track — only camera. If grid layout is
  // active while someone is presenting, their share silently dropped.
  const isScreen = !!p.screenTrack;
  const track = isScreen ? p.screenTrack : p.cameraTrack;
  const hasVideo = !!track && (isScreen || (!p.cameraMuted && inView));
  const tileColor = getAvatarStyle(
    p.isLocal ? "you" : p.avatarSeed || p.identity || p.name,
  );

  const initial = (p.name || "?").trim().charAt(0).toUpperCase() || "?";
  return (
    // Sized purely by the parent CSS Grid cell (grid-template-columns +
    // grid-auto-rows: 1fr in gridWrap) — no flex-basis/% math here anymore.
    // That's what keeps every tile the same size once someone's camera
    // turns on: a video's intrinsic dimensions can no longer stretch the
    // row, because the grid track height is fixed independent of content.
    <div ref={wrapRef} style={S.gridCellOuter}>
      <div
        style={{ ...S.gridTile, background: tileColor }}
        className={`im-grid-tile${p.isSpeaking ? " im-speaking" : ""}`}
      >
        {/* Absolutely-positioned + clipped so the video/canvas element
            inside VideoTrackEl is hard-contained to the tile bounds no
            matter what intrinsic size it reports. */}
        <div style={S.gridMediaLayer}>
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
                  ...S.gridAvatar,
                  background: getAvatarCircleStyle(
                    p.isLocal ? "you" : p.avatarSeed || p.identity || p.name,
                  ),
                }}
              >
                {initial}
              </div>
            </div>
          )}
        </div>
        {!p.isLocal && p.micTrack && <AudioTrackEl track={p.micTrack} />}
        <div style={S.gridNameTag}>
          {p.isSpeaking && !p.micMuted ? (
            <span className="im-wave">
              <span />
              <span />
              <span />
            </span>
          ) : p.micMuted ? (
            <MicOff size={12} />
          ) : (
            <Mic size={12} />
          )}
          <span style={S.nameEllipsis}>
            {p.name}
            {p.isLocal ? " (You)" : ""}
          </span>
        </div>
        {p.isHost && <span style={S.gridHostTag}>Host</span>}
        {raised && (
          <div style={S.gridHandBadge}>
            <Hand size={12} color="#202124" />
          </div>
        )}
        <ReactionBadge emoji={reaction} style={S.gridReactionBadge} />
      </div>
    </div>
  );
}