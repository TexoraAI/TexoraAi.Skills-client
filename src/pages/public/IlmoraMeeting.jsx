// import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import { createPortal } from "react-dom";
// import { useNavigate, useParams } from "react-router-dom";
// import { Room, RoomEvent, Track, createLocalTracks } from "livekit-client";
// import texoraLogo from "@/assets/texora-logo.webp";
// import {
//   Mic,
//   MicOff,
//   Video,
//   VideoOff,
//   MonitorUp,
//   MonitorOff,
//   MonitorPlay,
//   PhoneOff,
//   MessageSquare,
//   Users,
//   Send,
//   X,
//   Timer,
//   Disc2,
//   PictureInPicture2,
//   Hand,
//   Settings,
//   Captions,
//   MoreVertical,
//   SignalHigh,
//   SmilePlus,
//   Crown,
//   Check,
//   Clock,
//   ShieldAlert,
//   ShieldCheck,
//   Loader2,
//   AlertTriangle,
//   Copy,
//   ExternalLink,
//   Sun,
//   Moon,
//   UserPlus,
//   UserMinus,
//   Maximize2,
//   Minimize2,
// } from "lucide-react";

// // FIX: there is no meetingService.js — everything lives as named exports
// // in liveSessionService.js, matching the real MeetingController routes.
// import {
//   getMeetingByJoinCode,
//   joinMeetingAsHost,
//   requestToJoin,
//   getJoinRequestStatus,
//   getGuestToken,
//   listPendingJoinRequests,
//   admitJoinRequest,
//   denyJoinRequest,
//   admitAllJoinRequests,
//   endMeeting,
//    requestMeetingSummary,
// } from "@/services/liveSessionService";

// /* ════════════════════════════════════════════════════════════════
//    IlmoraMeeting.jsx
//    ────────────────────────────────────────────────────────────────
//    THE single, universal meeting room. Every shared meeting link —
//    /ilmorameet/:joinCode — renders this exact page. Nothing here is
//    hardcoded to one meeting: everything (title, host, LiveKit token,
//    role) is resolved at runtime from the joinCode in the URL.

//    Flow:
//      1. Look up the joinCode against the backend (GET /join/{joinCode}).
//      2. If the caller IS the host (backend decides via JWT -> isHost),
//         skip straight to the meeting — no name prompt, no lobby.
//      3. Otherwise show a pre-join screen (camera/mic preview + name),
//         then send a join request (POST /{id}/join-requests) and sit
//         in a lobby, polling (GET /{id}/join-requests/{requestId}) until
//         the host admits or denies, exactly like Google Meet.
//      4. Once admitted, fetch the actual LiveKit token via
//         GET /{id}/token/guest/{requestId} — the status poll itself
//         never carries a token, only a status string.
//      5. Once a LiveKit token is available (host or admitted guest),
//         connect and render the full Meet-style room.

//    IMPORTANT: host/lobby/control endpoints on the backend are keyed by
//    the meeting's numeric `id`, NOT the joinCode. Only `validate/{code}`
//    and `join/{code}` are keyed by joinCode. This file resolves `id`
//    once from the initial lookup and uses it for everything else.
//    ════════════════════════════════════════════════════════════════ */

// const REACTIONS = ["👍", "❤️", "😂", "😮", "👏", "🎉"];
// const getTime = () =>
//   new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
// const LOBBY_POLL_MS = 3000;
// const WAITING_ROOM_POLL_MS = 4000;
// const MEETING_STATUS_POLL_MS = 15000;

// /* ─── screen-share platform support detection ─────────────────────
//    Real-world constraints this file now accounts for:
//      • iOS Safari / iPadOS Safari (all versions in wide use) does not
//        expose getDisplayMedia at all — screen sharing is simply not
//        possible from the browser on iPhone/iPad. We detect this and
//        disable the button instead of letting it throw at click time.
//      • Desktop Chrome/Edge/Firefox/Safari (Mac), and Android Chrome,
//        all support getDisplayMedia but differ in what they let you
//        pick (window vs. tab vs. entire screen) and whether audio
//        capture is possible — we never assume audio capture works.
//      • Must be a secure context (HTTPS) — getDisplayMedia is undefined
//        on plain HTTP, which otherwise looks identical to "unsupported".
//    ──────────────────────────────────────────────────────────────── */
// function detectScreenShareSupport() {
//   if (typeof navigator === "undefined" || typeof window === "undefined") {
//     return { supported: false, reason: "unavailable" };
//   }
//   const ua = navigator.userAgent || "";
//   const isIOS =
//     /iPad|iPhone|iPod/.test(ua) ||
//     (ua.includes("Macintosh") && navigator.maxTouchPoints > 1); // iPadOS reports as Mac
//   const isSafari =
//     /^((?!chrome|android|crios|fxios).)*safari/i.test(ua) || isIOS;
//   const hasApi =
//     !!navigator.mediaDevices && !!navigator.mediaDevices.getDisplayMedia;
//   const isSecure =
//     window.isSecureContext !== undefined ? window.isSecureContext : true;

//   if (!isSecure) {
//     return {
//       supported: false,
//       reason: "insecure",
//       message:
//         "Screen sharing needs a secure (HTTPS) connection. Please load this meeting over HTTPS.",
//     };
//   }
//   // iOS/iPadOS Safari (and any iOS browser, since they all use WebKit and
//   // inherit the same limitation) cannot capture the screen from the web.
//   if (isIOS) {
//     return {
//       supported: false,
//       reason: "ios",
//       message:
//         "Screen sharing isn't supported by Safari on iPhone/iPad yet. You can still present using a Mac, Windows, Linux, or Android device.",
//     };
//   }
//   if (!hasApi) {
//     return {
//       supported: false,
//       reason: "no-api",
//       message:
//         isSafari
//           ? "This version of Safari doesn't support screen sharing. Please update Safari or use Chrome/Edge/Firefox."
//           : "Screen sharing isn't supported in this browser. Please use an up-to-date Chrome, Edge, Firefox, or Safari.",
//     };
//   }
//   return { supported: true };
// }

// /* ─── small utility hooks (self-contained, no external context) ──── */

// function useElapsedTimer(startedAtMs) {
//   const [, tick] = useState(0);
//   useEffect(() => {
//     if (!startedAtMs) return undefined;
//     const id = setInterval(() => tick((n) => n + 1), 1000);
//     return () => clearInterval(id);
//   }, [startedAtMs]);
//   if (!startedAtMs) return "00:00:00";
//   const secs = Math.max(0, Math.floor((Date.now() - startedAtMs) / 1000));
//   const hh = String(Math.floor(secs / 3600)).padStart(2, "0");
//   const mm = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
//   const ss = String(secs % 60).padStart(2, "0");
//   return `${hh}:${mm}:${ss}`;
// }

// function useResponsiveDevice() {
//   const [w, setW] = useState(
//     typeof window !== "undefined" ? window.innerWidth : 1366,
//   );
//   useEffect(() => {
//     let raf = null;
//     const onResize = () => {
//       if (raf) cancelAnimationFrame(raf);
//       raf = requestAnimationFrame(() => setW(window.innerWidth));
//     };
//     window.addEventListener("resize", onResize);
//     window.addEventListener("orientationchange", onResize);
//     return () => {
//       window.removeEventListener("resize", onResize);
//       window.removeEventListener("orientationchange", onResize);
//       if (raf) cancelAnimationFrame(raf);
//     };
//   }, []);
//   if (w <= 767) return "phone";
//   if (w <= 1023) return "tablet";
//   if (w <= 1365) return "laptop";
//   return "desktop";
// }

// function useDismiss(active, onDismiss, refs = []) {
//   useEffect(() => {
//     if (!active) return undefined;
//     const handlePointer = (e) => {
//       const insideAny = refs.some(
//         (r) => r.current && r.current.contains(e.target),
//       );
//       if (!insideAny) onDismiss();
//     };
//     const handleKey = (e) => {
//       if (e.key === "Escape") onDismiss();
//     };
//     document.addEventListener("mousedown", handlePointer, true);
//     document.addEventListener("touchstart", handlePointer, true);
//     document.addEventListener("keydown", handleKey, true);
//     return () => {
//       document.removeEventListener("mousedown", handlePointer, true);
//       document.removeEventListener("touchstart", handlePointer, true);
//       document.removeEventListener("keydown", handleKey, true);
//     };
//   }, [active, onDismiss, refs]);
// }

// function useInView(ref) {
//   const [inView, setInView] = useState(true);
//   useEffect(() => {
//     const el = ref.current;
//     if (!el || typeof IntersectionObserver === "undefined") return undefined;
//     const root = el.closest("[data-scroll-root]") || null;
//     const io = new IntersectionObserver(
//       ([entry]) => setInView(entry.isIntersecting),
//       { root, threshold: 0.01, rootMargin: "200px" },
//     );
//     io.observe(el);
//     return () => io.disconnect();
//   }, [ref]);
//   return inView;
// }

// /* Builds the flat participant list (with tracks) from the raw LiveKit
//    Room, the same shape LiveRoom.jsx's context normally provides — but
//    derived locally here since this page owns the Room itself. */
// function buildParticipantList(room, raisedHands, speakingSet) {
//   if (!room) return [];
//   const list = [];
//   const addOne = (participant, isLocal) => {
//     const videoPubs = Array.from(
//       participant.videoTrackPublications?.values?.() || [],
//     );
//     const audioPubs = Array.from(
//       participant.audioTrackPublications?.values?.() || [],
//     );
//     const camPub = videoPubs.find((p) => p.source === Track.Source.Camera);
//     const screenPub = videoPubs.find(
//       (p) => p.source === Track.Source.ScreenShare,
//     );
//     const micPub = audioPubs.find((p) => p.source === Track.Source.Microphone);
//     const identity = isLocal ? participant.identity : participant.identity;
//     list.push({
//       identity,
//       name: isLocal
//         ? "You"
//         : participant.name || participant.identity || "Guest",
//       isLocal,
//       isHost: !!participant.metadata && safeParse(participant.metadata)?.isHost,
//       cameraTrack: camPub?.track || null,
//       cameraMuted: !camPub || !!camPub.isMuted || !camPub.track,
//       screenTrack: screenPub?.track || null,
//       micTrack: !isLocal ? micPub?.track || null : null,
//       micMuted: micPub ? !!micPub.isMuted : true,
//       isSpeaking: speakingSet?.has(identity) || false,
//     });
//   };
//   addOne(room.localParticipant, true);
//   room.remoteParticipants.forEach((p) => addOne(p, false));
//   // FIX (bug 5): whoever is actively speaking should surface first so
//   // people notice who's talking, instead of staying buried in the grid.
//   list.sort((a, b) => {
//     if (a.isSpeaking !== b.isSpeaking) return a.isSpeaking ? -1 : 1;
//     return 0;
//   });
//   return list;
// }

// function safeParse(json) {
//   try {
//     return JSON.parse(json);
//   } catch (_) {
//     return null;
//   }
// }

// /* ─── media element wrappers ─────────────────────────────────────── */

// function VideoTrackEl({ track, mirrored, fit = "cover", hidden, videoRef }) {
//   const internalRef = useRef(null);
//   useEffect(() => {
//     const el = internalRef.current;
//     if (!track || !el) return undefined;
//     track.attach(el);
//     return () => {
//       try {
//         track.detach(el);
//       } catch (_) {}
//     };
//   }, [track]);
//   return (
//     <video
//       ref={(node) => {
//         internalRef.current = node;
//         if (videoRef) videoRef.current = node;
//       }}
//       autoPlay
//       playsInline
//       muted
//       style={
//         hidden
//           ? {
//               position: "absolute",
//               left: -9999,
//               top: -9999,
//               width: 2,
//               height: 2,
//               opacity: 0,
//               pointerEvents: "none",
//             }
//           : {
//               width: "100%",
//               height: "100%",
//               objectFit: fit,
//               transform: mirrored ? "scaleX(-1)" : "none",
//               display: "block",
//               background: "#000",
//             }
//       }
//     />
//   );
// }

// function AudioTrackEl({ track }) {
//   const ref = useRef(null);
//   useEffect(() => {
//     const el = ref.current;
//     if (!track || !el) return undefined;
//     track.attach(el);
//     el.play?.().catch(() => {});
//     return () => {
//       try {
//         track.detach(el);
//       } catch (_) {}
//     };
//   }, [track]);
//   return <audio ref={ref} autoPlay data-remote-audio="1" />;
// }

// /* ─── PiP floating panel ─────────────────────────────────────────── */
// function PiPPanel({
//   track,
//   isScreen,
//   label,
//   timer,
//   micOn,
//   onToggleMic,
//   onReturn,
// }) {
//   return (
//     <div
//       style={{
//         width: "100%",
//         height: "100%",
//         position: "relative",
//         background: "#000",
//         display: "flex",
//         flexDirection: "column",
//         fontFamily: "system-ui, sans-serif",
//       }}
//     >
//       <div style={{ flex: 1, minHeight: 0, position: "relative" }}>
//         {track ? (
//           <VideoTrackEl track={track} fit={isScreen ? "contain" : "cover"} />
//         ) : (
//           <div
//             style={{
//               width: "100%",
//               height: "100%",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               color: "#94a3b8",
//               fontSize: 13,
//             }}
//           >
//             Meeting in progress…
//           </div>
//         )}
//         <div
//           style={{
//             position: "absolute",
//             top: 6,
//             left: 8,
//             fontSize: 11,
//             color: "#fff",
//             background: "rgba(0,0,0,.55)",
//             padding: "3px 8px",
//             borderRadius: 6,
//           }}
//         >
//           {timer}
//         </div>
//         <div
//           style={{
//             position: "absolute",
//             bottom: 6,
//             left: 8,
//             fontSize: 10,
//             color: "#fff",
//             background: "rgba(0,0,0,.55)",
//             padding: "2px 7px",
//             borderRadius: 6,
//           }}
//         >
//           {label}
//         </div>
//       </div>
//       <div
//         style={{
//           flexShrink: 0,
//           display: "flex",
//           gap: 6,
//           padding: 6,
//           background: "#0d1117",
//         }}
//       >
//         <button
//           onClick={onToggleMic}
//           style={{
//             flex: 1,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             gap: 6,
//             padding: "6px 8px",
//             borderRadius: 8,
//             border: "none",
//             background: micOn ? "rgba(255,255,255,.12)" : "#7f1d1d",
//             color: micOn ? "#e2e8f0" : "#fca5a5",
//             fontSize: 11,
//             fontWeight: 600,
//             cursor: "pointer",
//           }}
//         >
//           {micOn ? <Mic size={13} /> : <MicOff size={13} />}
//           {micOn ? "Mute" : "Unmute"}
//         </button>
//         <button
//           onClick={onReturn}
//           style={{
//             flex: 1,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             gap: 6,
//             padding: "6px 8px",
//             borderRadius: 8,
//             border: "none",
//             background: "rgba(34,211,238,.18)",
//             color: "#67e8f9",
//             fontSize: 11,
//             fontWeight: 700,
//             cursor: "pointer",
//           }}
//         >
//           Return to meeting
//         </button>
//       </div>
//     </div>
//   );
// }

// /* ─── reaction badge ─────────────────────────────────────────────── */
// function ReactionBadge({ emoji, style }) {
//   if (!emoji) return null;

//   return (
//     <div
//       style={style}
//       className="im-reaction-badge"
//       aria-hidden="true"
//     >
//       {emoji}
//     </div>
//   );
// }
// /* ─── reaction floaters ──────────────────────────────────────────── */
// function EmojiFloaters({ floaters, S }) {
//   return (
//     <div style={S.floaterLayer} aria-hidden="true">
//       {floaters.map((f, i) => (
//         <div
//           key={f.id}
//           style={{
//             ...S.floater,
//             left: `${10 + ((i * 13) % 74)}%`,
//             animationDelay: `${(i % 4) * 0.08}s`,
//           }}
//         >
//           <span style={S.floaterEmoji}>{f.emoji}</span>
//           <span style={S.floaterName}>{f.name}</span>
//         </div>
//       ))}
//     </div>
//   );
// }

// /* ─── video tiles: strip / grid / stage ─────────────────────────── */
// function StripTile({ p, active, raised, reaction, S }) {
//   const wrapRef = useRef(null);
//   const inView = useInView(wrapRef);
//   const isScreen = !!p.screenTrack;
//   const track = isScreen ? p.screenTrack : p.cameraTrack;
//   const hasVideo = !!track && (isScreen || (!p.cameraMuted && inView));
//   const initial = (p.name || "?").trim().charAt(0).toUpperCase() || "?";
//   return (
//     <div
//       ref={wrapRef}
//       className={`im-strip-tile${active ? " im-strip-tile-active" : ""}${p.isSpeaking ? " im-speaking" : ""}`}
//       style={S.stripTile}
//     >
//       {hasVideo ? (
//         <VideoTrackEl
//           track={track}
//           mirrored={!isScreen && p.isLocal}
//           fit={isScreen ? "contain" : "cover"}
//         />
//       ) : (
//         <div style={S.stripAvatarWrap}>
//           <div
//             style={{
//               ...S.stripAvatar,
//               background: p.isLocal
//                 ? "linear-gradient(135deg,#0ea5e9,#6366f1)"
//                 : "linear-gradient(135deg,#8b5cf6,#ec4899)",
//             }}
//           >
//             {initial}
//           </div>
//         </div>
//       )}
//       {!p.isLocal && p.micTrack && <AudioTrackEl track={p.micTrack} />}
//       {(raised || p.isHost) && (
//         <div style={S.stripBadgeTopLeft}>
//           {raised ? (
//             <Hand size={11} color="#1a1a1a" />
//           ) : (
//             <Crown size={11} color="#1a1a1a" />
//           )}
//         </div>
//       )}
//       <div style={S.stripMicDot}>
//         {p.isSpeaking && !p.micMuted ? (
//           <span className="im-wave">
//             <span />
//             <span />
//             <span />
//           </span>
//         ) : p.micMuted ? (
//           <MicOff size={10} />
//         ) : (
//           <Mic size={10} />
//         )}
//       </div>
//       <div style={S.stripName}>{p.isLocal ? "You" : p.name}</div>
//       <ReactionBadge emoji={reaction} style={S.stripReactionBadge} />
//     </div>
//   );
// }

// // FIX (bug 5): "+N others" is now a real button — clicking it opens the
// // People panel so every hidden participant is reachable, not just a dead label.
// function StripOverflow({ count, S, onClick }) {
//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       style={{ ...S.stripTile, ...S.stripOverflow, cursor: "pointer" }}
//       className="im-strip-tile"
//     >
//       <span
//         style={{ fontSize: 13, fontWeight: 700, color: "var(--im-text-soft)" }}
//       >
//         +{count}
//       </span>
//       <span style={{ fontSize: 9, color: "var(--im-text-mute)", marginTop: 2 }}>
//         others · tap to view
//       </span>
//     </button>
//   );
// }

// function StageTile({ p, raised, reaction, S, onMaximize }) {
//   if (!p) {
//     return (
//       <div style={S.stageOuter}>
//         <div style={S.stage}>
//           <div style={S.stageEmpty}>Waiting for others to join…</div>
//         </div>
//       </div>
//     );
//   }
//   const isScreen = !!p.screenTrack;
//   const track = isScreen ? p.screenTrack : p.cameraTrack;
//   const hasVideo = !!track && (isScreen || !p.cameraMuted);
//   const initial = (p.name || "?").trim().charAt(0).toUpperCase() || "?";
//   const speaking = !isScreen && !!p.isSpeaking;
//   const canZoom = isScreen && hasVideo && !!onMaximize;
//   return (
//     <div style={S.stageOuter}>
//       <div
//         style={S.stage}
//         className={`im-stage${speaking ? " im-speaking" : ""}`}
//         onDoubleClick={canZoom ? onMaximize : undefined}
//       >
//         {hasVideo ? (
//           <VideoTrackEl
//             track={track}
//             mirrored={!isScreen && p.isLocal}
//             fit={isScreen ? "contain" : "cover"}
//           />
//         ) : (
//           <div style={S.stageAvatarWrap}>
//             <div style={S.stageAvatar}>{initial}</div>
//           </div>
//         )}
//         {!p.isLocal && p.micTrack && <AudioTrackEl track={p.micTrack} />}
//         {isScreen && !p.isLocal && (
//           <div style={S.screenLabel}>
//             <MonitorPlay size={13} />
//             {`${p.name} is presenting`}
//           </div>
//         )}
//         {canZoom && (
//           <button
//             type="button"
//             style={S.stageZoomBtn}
//             onClick={onMaximize}
//             title="View full screen"
//             aria-label="View screen share full screen"
//           >
//             <Maximize2 size={15} />
//           </button>
//         )}
//         <div style={S.stageNameTag}>
//           {p.isSpeaking && !p.micMuted ? (
//             <span className="im-wave">
//               <span />
//               <span />
//               <span />
//             </span>
//           ) : p.micMuted ? (
//             <MicOff size={13} />
//           ) : (
//             <Mic size={13} />
//           )}
//           <span>{p.isLocal ? "You" : p.name}</span>
//         </div>
//         {p.isHost && <span style={S.stageHostTag}>Host</span>}
//         {raised && (
//           <div style={S.stageHandBadge}>
//             <Hand size={14} color="#1a1a1a" />
//             <span>Hand raised</span>
//           </div>
//         )}
//         <ReactionBadge emoji={reaction} style={S.stageReactionBadge} />
//       </div>
//     </div>
//   );
// }

// function gridColumns(n) {
//   if (n <= 1) return 1;
//   if (n === 2) return 2;
//   if (n <= 4) return 2;
//   if (n <= 9) return 3;
//   return Math.min(Math.ceil(Math.sqrt(n)), 5);
// }

// function GridTile({ p, raised, reaction, S }) {
//   const wrapRef = useRef(null);
//   const inView = useInView(wrapRef);

//   // FIX (screen-share visibility bug): grid tiles never checked for
//   // an active screen-share track — only camera. If grid layout is
//   // active while someone is presenting, their share silently dropped.
//   const isScreen = !!p.screenTrack;
//   const track = isScreen ? p.screenTrack : p.cameraTrack;
//   const hasVideo = !!track && (isScreen || (!p.cameraMuted && inView));

//   const initial = (p.name || "?").trim().charAt(0).toUpperCase() || "?";
//   return (
//     <div ref={wrapRef} style={S.gridCellOuter}>
//       <div
//         style={S.gridTile}
//         className={`im-grid-tile${p.isSpeaking ? " im-speaking" : ""}`}
//       >
//         {hasVideo ? (
//   <VideoTrackEl
//     track={track}
//     mirrored={!isScreen && p.isLocal}
//     fit={isScreen ? "contain" : "cover"}
//   />
// ) : (
          
//           <div style={S.stageAvatarWrap}>
//             <div
//               style={{
//                 ...S.gridAvatar,
//                 background: p.isLocal
//                   ? "linear-gradient(135deg,#0ea5e9,#6366f1)"
//                   : "linear-gradient(135deg,#8b5cf6,#ec4899)",
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
//           <span>{p.isLocal ? "You" : p.name}</span>
//         </div>
//         {p.isHost && <span style={S.gridHostTag}>Host</span>}
//         {raised && (
//           <div style={S.gridHandBadge}>
//             <Hand size={12} color="#1a1a1a" />
//           </div>
//         )}
//         <ReactionBadge emoji={reaction} style={S.gridReactionBadge} />
//       </div>
//     </div>
//   );
// }

// function ParticipantGrid({ participants, raisedHands, handRaised, reactions, S }) {
//   const cols = gridColumns(participants.length);
//   const style = {
//     ...S.gridWrap,
//     gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
//     "--cols-tablet": Math.min(cols, 3),
//     "--cols-phone": Math.min(cols, 2),
//     "--cols-small": 1,
//   };
//   return (
//     <div style={style} className="im-grid">
//       {participants.map((p) => (
//         <GridTile
//           key={p.identity}
//           p={p}
//           raised={p.isLocal ? handRaised : !!raisedHands[p.identity]}
//           reaction={reactions[p.identity]}
//           S={S}
//         />
//       ))}
//     </div>
//   );
// }

// /* FIX (mobile UI): full-width stacked tile used ONLY on phone-width
//    screens, one participant per row, matching the target mobile design
//    (avatar centered, name pill bottom-left, mic/host badge top-left,
//    overflow menu top-right, small local self-camera thumbnail bottom-
//    right when the local user's camera is on). Desktop/tablet/laptop
//    layouts (grid / stage+filmstrip) are completely untouched. */
// function MobileStackedTile({ p, raised, reaction, active, S, onOpenPeople }) {
//   const wrapRef = useRef(null);
//   const inView = useInView(wrapRef);
//   const isScreen = !!p.screenTrack;
//   const track = isScreen ? p.screenTrack : p.cameraTrack;
//   const hasVideo = !!track && (isScreen || (!p.cameraMuted && inView));
//   const initial = (p.name || "?").trim().charAt(0).toUpperCase() || "?";
//   return (
//     <div
//       ref={wrapRef}
//       style={{
//         ...S.mobileTile,
//         ...(active ? S.mobileTileActive : null),
//       }}
//       className={`im-mobile-tile${p.isSpeaking ? " im-speaking" : ""}`}
//     >
//       {!p.isLocal && p.micTrack && <AudioTrackEl track={p.micTrack} />}

//       {/* centered content: full camera OR avatar bubble */}
//       {hasVideo ? (
//         <VideoTrackEl
//           track={track}
//           mirrored={!isScreen && p.isLocal}
//           fit={isScreen ? "contain" : "cover"}
//         />
//       ) : (
//         <div style={S.mobileTileAvatarWrap}>
//           <div
//             style={{
//               ...S.mobileTileAvatar,
//               background: p.isLocal
//                 ? "linear-gradient(135deg,#0ea5e9,#6366f1)"
//                 : "linear-gradient(135deg,#8b5cf6,#ec4899)",
//             }}
//           >
//             {initial}
//           </div>
//         </div>
//       )}

//       {/* top-left: mic-muted pill, or host crown / raised-hand badge */}
//       <div style={S.mobileTileTopLeft}>
//         {p.micMuted ? (
//           <span style={S.mobileTileIconPill}>
//             <MicOff size={13} />
//           </span>
//         ) : null}
//         {raised && (
//           <span style={{ ...S.mobileTileIconPill, background: "#fbbf24" }}>
//             <Hand size={13} color="#1a1a1a" />
//           </span>
//         )}
//         {p.isHost && !raised && (
//           <span style={{ ...S.mobileTileIconPill, background: "#fbbf24" }}>
//             <Crown size={13} color="#1a1a1a" />
//           </span>
//         )}
//       </div>

//       {/* top-right: overflow menu, opens the People panel */}
//       <button
//         type="button"
//         style={S.mobileTileMenuBtn}
//         onClick={onOpenPeople}
//         aria-label="More options"
//       >
//         <MoreVertical size={16} />
//       </button>

//       {/* bottom-left: name pill */}
//       <div style={S.mobileTileName}>{p.isLocal ? "You" : p.name}</div>
//       <ReactionBadge emoji={reaction} style={S.mobileTileReactionBadge} />
//     </div>
//   );
// }

// const PersonRow = ({ name, isHost, self, handRaised, S }) => (
//   <div style={S.pRow}>
//     <div
//       style={{
//         ...S.pAv,
//         background: self
//           ? "linear-gradient(135deg,#0ea5e9,#6366f1)"
//           : "linear-gradient(135deg,#8b5cf6,#ec4899)",
//       }}
//     >
//       {(name || "?")[0]}
//     </div>
//     <span style={S.pName}>{name}</span>
//     {handRaised && <Hand size={13} color="#fbbf24" />}
//     {isHost && <span style={S.hostTag}>Host</span>}
//     {self && <span style={S.youTag}>You</span>}
//   </div>
// );


// const Btn = ({
//   icon,
//   label,
//   active,
//   danger,
//   leave,
//   badge,
//   onClick,
//   btnRef,
//   pressed,
//   ariaHasPopup,
//   ariaExpanded,
//   disabled,
//   title,
//   S,
// }) => {
//   const [hov, setHov] = useState(false);
//   // FIX (bug 3): the idle/hover state used to be hardcoded white-based rgba
//   // with a fixed light-gray icon color, which was tuned for dark theme only
//   // and became nearly invisible against the white panel in light theme.
//   // Now it follows the same --im-ghost-bg / --im-text-soft variables the
//   // rest of the room UI already uses, so icons stay visible in both themes.
//   const bg = leave
//     ? hov
//       ? "#dc2626"
//       : "#ef4444"
//     : danger
//       ? hov
//         ? "#991b1b"
//         : "#7f1d1d"
//       : active
//         ? hov
//           ? "rgba(109,94,247,.34)"
//           : "rgba(109,94,247,.20)"
//         : hov
//           ? "var(--im-ghost-bg)"
//           : "var(--im-ghost-bg-soft)";
//   const col = leave
//     ? "#fff"
//     : danger
//       ? "#fca5a5"
//       : active
//         ? "#c4b8ff"
//         : "var(--im-text-soft)";
//   return (
//     <div style={{ position: "relative", flexShrink: 0 }}>
//           <button
//         ref={btnRef}
//         className="im-ctrl-btn"
//         onClick={onClick}
//         disabled={disabled}
//         title={title}
//         onMouseEnter={() => setHov(true)}
//         onMouseLeave={() => setHov(false)}
//         aria-label={label}
//         aria-pressed={typeof pressed === "boolean" ? pressed : undefined}
//         aria-haspopup={ariaHasPopup}
//         aria-expanded={ariaExpanded}
//         style={{
//           opacity: disabled ? 0.6 : 1,
//           cursor: disabled ? "not-allowed" : "pointer",
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           gap: 4,
//           background: bg,
//           color: col,
//           border: danger
//             ? "1px solid rgba(239,68,68,.3)"
//             : active
//               ? "1px solid rgba(109,94,247,.45)"
//               : "1px solid var(--im-border-soft)",
//           borderRadius: 14,
//           padding: "10px 16px",
          
//           fontSize: 10,
//           fontWeight: 600,
//           fontFamily: "inherit",
//           letterSpacing: 0.2,
//           flexShrink: 0,
//           boxShadow: active
//             ? "0 0 0 1px rgba(109,94,247,.25), 0 6px 16px -4px rgba(109,94,247,.35)"
//             : "none",
//         }}
//       >
//         {icon}
//         <span className="im-btn-label">{label}</span>
//       </button>
//       {!!badge && <span style={S.ctrlBadge}>{badge}</span>}
//     </div>
//   );
// };


// function PreJoinScreen({ meetingInfo, joinCode, onSubmit, submitting, error }) {
//   const [name, setName] = useState(() => {
//     try {
//       const u = JSON.parse(localStorage.getItem("lms_user") || "{}");
//       return u?.name || "";
//     } catch {
//       return "";
//     }
//   });
//   const [email, setEmail] = useState(() => {
//     try {
//       const u = JSON.parse(localStorage.getItem("lms_user") || "{}");
//       return u?.email || "";
//     } catch {
//       return "";
//     }
//   });
//   const [micOn, setMicOn] = useState(true);
//   const [camOn, setCamOn] = useState(true);
//   const [previewTrack, setPreviewTrack] = useState(null);
//   const [previewError, setPreviewError] = useState(null);

//   const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

//   useEffect(() => {
//     let localTracks = [];
//     let cancelled = false;
//     (async () => {
//       try {
//         localTracks = await createLocalTracks({ audio: true, video: true });
//         if (cancelled) {
//           localTracks.forEach((t) => t.stop());
//           return;
//         }
//         const cam = localTracks.find((t) => t.kind === Track.Kind.Video);
//         if (cam) setPreviewTrack(cam);
//       } catch (err) {
//         setPreviewError(
//           "Camera/microphone permission was blocked. You can still join with audio/video off.",
//         );
//       }
//     })();
//     return () => {
//       cancelled = true;
//       localTracks.forEach((t) => {
//         try {
//           t.stop();
//         } catch (_) {}
//       });
//     };
//   }, []);

//   const videoRef = useRef(null);
//   useEffect(() => {
//     const el = videoRef.current;
//     if (!el || !previewTrack) return undefined;
//     if (camOn) previewTrack.attach(el);
//     else previewTrack.detach(el);
//     return () => {
//       try {
//         previewTrack.detach(el);
//       } catch (_) {}
//     };
//   }, [previewTrack, camOn]);

//   const handleSubmit = () => {
//     if (!emailValid || submitting) return;
//     onSubmit({
//       name: name.trim() || "Guest",
//       email: email.trim(),
//       micOn,
//       camOn,
//     });
//   };

//   return (
//     <div style={PJ.root}>
//       <div style={PJ.blobTopRight} />
//       <div style={PJ.blobBottomLeft} />

//       <div style={PJ.page}>
//         <div style={PJ.header}>
//           <div style={PJ.brandRow}>
//             <img src={texoraLogo} alt="Texora AI" style={PJ.brandLogo} />
//           </div>
//           <h1 style={PJ.pageTitle}>
//             Welcome to <span style={PJ.pageTitleAccent}>Workspace</span>
//           </h1>
//           <p style={PJ.pageSubtitle}>Join your meeting or start a new session</p>
//         </div>

//         <div style={PJ.card}>
//           <div style={PJ.leftCol}>
//             <div style={PJ.previewBox}>
//               {camOn && previewTrack ? (
//                 <video
//                   ref={videoRef}
//                   autoPlay
//                   muted
//                   playsInline
//                   style={{
//                     width: "100%",
//                     height: "100%",
//                     objectFit: "cover",
//                     transform: "scaleX(-1)",
//                   }}
//                 />
//               ) : (
//                 <div style={PJ.previewAvatarWrap}>
//                   <div style={PJ.previewAvatar}>
//                     {(name || "G").trim().charAt(0).toUpperCase()}
//                   </div>
//                 </div>
//               )}

//               <img src={texoraLogo} alt="" style={PJ.previewWatermark} />

//               <div style={PJ.previewCtrls}>
//                 <button
//                   style={PJ.previewPillBtn}
//                   onClick={() => setMicOn((v) => !v)}
//                   title={micOn ? "Mute" : "Unmute"}
//                 >
//                   {micOn ? <Mic size={16} /> : <MicOff size={16} />}
//                   <span>{micOn ? "Mic On" : "Mic Off"}</span>
//                 </button>
//                 <span style={PJ.previewCtrlsDivider} />
//                 <button
//                   style={PJ.previewPillBtn}
//                   onClick={() => setCamOn((v) => !v)}
//                   title={camOn ? "Stop camera" : "Start camera"}
//                 >
//                   {camOn ? <Video size={16} /> : <VideoOff size={16} />}
//                   <span>{camOn ? "Camera On" : "Camera Off"}</span>
//                 </button>
//               </div>
//             </div>

//             <div style={PJ.secureBanner}>
//               <span style={PJ.secureIconWrap}>
//                 <ShieldCheck size={18} color="#f97316" />
//               </span>
//               <div>
//                 <p style={PJ.secureTitle}>
//                   Your meeting is secure and end-to-end encrypted
//                 </p>
//                 <p style={PJ.secureSubtitle}>
//                   We protect your privacy and keep your data safe.
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div style={PJ.infoCol}>
//             <h2 style={PJ.title}>
//   {meetingInfo?.title || "Ilmorameet"}
// </h2>
//             <p style={PJ.subtitle}>
//               Hosted by{" "}
//               <strong>{meetingInfo?.creatorName || "the meeting host"}</strong>
//             </p>
//             <p style={PJ.code}>
//               Meeting code: <span>{joinCode}</span>
//               {joinCode && (
//                 <button
//                   type="button"
//                   style={PJ.copyBtn}
//                   title="Copy meeting code"
//                   onClick={() => {
//                     try {
//                       navigator.clipboard?.writeText(joinCode);
//                     } catch (_) {}
//                   }}
//                 >
//                   <Copy size={13} />
//                 </button>
//               )}
//             </p>

//             <div style={PJ.sectionHeading}>
//   <h3 style={PJ.sectionHeadingText}>Join the Meeting</h3>
//   <div style={PJ.sectionHeadingDash}>
//     <span style={PJ.dashOrange} />
//   </div>
// </div>

//             <label style={PJ.label}>Your name</label>
//             <input
//               style={PJ.input}
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               placeholder="Enter your name"
//               maxLength={40}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter") handleSubmit();
//               }}
//             />

//             <label style={PJ.label}>Your email</label>
//             <input
//               style={PJ.input}
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="you@example.com"
//               type="email"
//               maxLength={100}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter") handleSubmit();
//               }}
//             />
//             {email.length > 0 && !emailValid && (
//               <p style={PJ.errText}>Enter a valid email address</p>
//             )}

//             {previewError && (
//               <p style={PJ.warnText}>
//                 <AlertTriangle size={13} /> {previewError}
//               </p>
//             )}
//             {error && <p style={PJ.errText}>{error}</p>}

//             <button
//               style={{
//                 ...PJ.joinBtn,
//                 opacity: submitting || !emailValid ? 0.7 : 1,
//               }}
//               disabled={submitting || !emailValid}
//               onClick={handleSubmit}
//             >
//               {submitting ? <Loader2 size={16} className="im-spin" /> : null}
//               {submitting ? "Requesting to join…" : "Ask to Join"}
//             </button>
//             <p style={PJ.hint}>
//               <Clock size={12} />
//               Someone in the meeting will let you in soon.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
// /* ═════════════════════════════════════════════════════════════════
//    LOBBY SCREEN — guest waiting for host to admit
// ═════════════════════════════════════════════════════════════════ */
// function LobbyScreen({ meetingInfo, onCancel }) {
//   return (
//     <div style={PJ.root}>
//       <div style={LB.card}>
//         <div style={LB.pulseWrap}>
//           <div style={LB.pulseDot} />
//           <Clock size={30} color="#93c5fd" />
//         </div>
//         <h2 style={LB.title}>Asking to join…</h2>
//         <p style={LB.subtitle}>
//           You'll join <strong>{meetingInfo?.title || "this meeting"}</strong> as
//           soon as the host lets you in.
//         </p>
//         <button style={LB.cancelBtn} onClick={onCancel}>
//           Cancel
//         </button>
//       </div>
//     </div>
//   );
// }

// function DeniedScreen({ onRetry }) {
//   return (
//     <div style={PJ.root}>
//       <div style={LB.card}>
//         <ShieldAlert size={38} color="#f87171" />
//         <h2 style={LB.title}>Your request was declined</h2>
//         <p style={LB.subtitle}>The host didn't let you into this meeting.</p>
//         <button style={LB.cancelBtn} onClick={onRetry}>
//           Try again
//         </button>
//       </div>
//     </div>
//   );
// }

// function StatusScreen({ icon, title, subtitle }) {
//   return (
//     <div style={PJ.root}>
//       <div style={LB.card}>
//         {icon}
//         <h2 style={LB.title}>{title}</h2>
//         {subtitle && <p style={LB.subtitle}>{subtitle}</p>}
//       </div>
//     </div>
//   );
// }

// /* ═════════════════════════════════════════════════════════════════
//    WAITING ROOM PANEL — host-only: admit/deny pending guests
// ═════════════════════════════════════════════════════════════════ */
// function WaitingRoomPanel({ waiting, onAdmit, onDeny, onAdmitAll, S }) {
//   if (!waiting.length) {
//     return <p style={S.emptyPpl}>No one is waiting to join.</p>;
//   }
//   return (
//     <div
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         gap: 8,
//         padding: "0 2px",
//       }}
//     >
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           padding: "0 4px",
//         }}
//       >
//         <span style={{ fontSize: 12, fontWeight: 700, color: "#fbbf24" }}>
//           {waiting.length} waiting to join
//         </span>
//         <button
//           onClick={onAdmitAll}
//           style={{
//             background: "rgba(109,94,247,.18)",
//             border: "1px solid rgba(109,94,247,.35)",
//             color: "#c4b8ff",
//             borderRadius: 8,
//             padding: "5px 10px",
//             fontSize: 11,
//             fontWeight: 700,
//             cursor: "pointer",
//           }}
//         >
//           Admit all
//         </button>
//       </div>
//       {waiting.map((w) => (
//         <div key={w.requestId} style={S.pRow}>
//           <div
//             style={{
//               ...S.pAv,
//               background: "linear-gradient(135deg,#f59e0b,#ea7c0e)",
//             }}
//           >
//             {(w.name || "?")[0]}
//           </div>
//           <span style={S.pName}>{w.name}</span>
//           <button
//             onClick={() => onDeny(w.requestId)}
//             title="Deny"
//             style={{
//               background: "rgba(239,68,68,.14)",
//               border: "1px solid rgba(239,68,68,.3)",
//               color: "#fca5a5",
//               borderRadius: 8,
//               width: 30,
//               height: 30,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               cursor: "pointer",
//             }}
//           >
//             <X size={14} />
//           </button>
//           <button
//             onClick={() => onAdmit(w.requestId)}
//             title="Admit"
//             style={{
//               background: "rgba(34,197,94,.16)",
//               border: "1px solid rgba(34,197,94,.35)",
//               color: "#86efac",
//               borderRadius: 8,
//               width: 30,
//               height: 30,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               cursor: "pointer",
//             }}
//           >
//             <Check size={14} />
//           </button>
//         </div>
//       ))}
//     </div>
//   );
// }

// /* ═════════════════════════════════════════════════════════════════
//    MAIN COMPONENT
// ═════════════════════════════════════════════════════════════════ */
// export default function IlmoraMeeting() {
//   const { joinCode } = useParams();
//   const navigate = useNavigate();

//   // phase: 'loading' | 'error' | 'prejoin' | 'lobby' | 'denied' | 'ended' | 'in-meeting'
//   const [phase, setPhase] = useState("loading");
//   const [loadError, setLoadError] = useState(null);
//   const [meetingInfo, setMeetingInfo] = useState(null); // MeetingResponseDTO — has .id, .meetingStatus, .creatorName, .isHost
//   const [joinRequestId, setJoinRequestId] = useState(null);
//   const [guestIdentity, setGuestIdentity] = useState(null); // FIX: this is the bearer credential — must be captured and threaded through
//   const [guestName, setGuestName] = useState(null);
//   const [connectPayload, setConnectPayload] = useState(null); // { token, room, isHost }
//   const [submitting, setSubmitting] = useState(false);
//   const [submitError, setSubmitError] = useState(null);
//   const [initialAV, setInitialAV] = useState({ micOn: true, camOn: true });

//   const lobbyPollRef = useRef(null);

//   /* ── 1. resolve the meeting from the joinCode ──────────────────── */
//   const loadMeeting = useCallback(async () => {
//     setPhase("loading");
//     setLoadError(null);
//     try {
//       const res = await getMeetingByJoinCode(joinCode);
//       const info = res?.data;
//       if (!info) throw new Error("Meeting not found");
//       setMeetingInfo(info);

//       // FIX: DTO field is meetingStatus, not status
//       if (info.meetingStatus === "ENDED") {
//         setPhase("ended");
//         return;
//       }

//       if (info.isHost) {
//         // Host: fetch a token directly, no lobby.
//         // FIX: token endpoint is keyed by numeric id, not joinCode.
//         const hostRes = await joinMeetingAsHost(info.id);
//         setConnectPayload({ ...hostRes.data, isHost: true });
//         setPhase("in-meeting");
//       } else {
//         setPhase("prejoin");
//       }
//     } catch (err) {
//       console.error("Failed to resolve meeting:", err);
//       setLoadError(
//         err?.response?.status === 404
//           ? "This meeting link is invalid or has expired."
//           : "We couldn't load this meeting. Please check your connection and try again.",
//       );
//       setPhase("error");
//     }
//   }, [joinCode]);

//   useEffect(() => {
//     loadMeeting();
//   }, [loadMeeting]);

//   /* ── 2. guest: submit "ask to join" ────────────────────────────── */
//   const handlePreJoinSubmit = useCallback(
//     async ({ name, email, micOn, camOn }) => {
//       if (!meetingInfo?.id) return;
//       setSubmitting(true);
//       setSubmitError(null);
//       try {
//         const res = await requestToJoin(meetingInfo.id, name, email);
//         const data = res?.data;
//         setJoinRequestId(data?.requestId);
//         setGuestIdentity(data?.guestIdentity);
//         setGuestName(name);
//         setInitialAV({ micOn, camOn });
//         setPhase("lobby");
//       } catch (err) {
//         console.error("Join request failed:", err);
//         setSubmitError(
//           err?.response?.data?.error ||
//             err?.response?.data?.message ||
//             "Couldn't send your request. Please try again.",
//         );
//       } finally {
//         setSubmitting(false);
//       }
//     },
//     [meetingInfo],
//   );

//   /* ── 3. guest: poll lobby status until admitted/denied ─────────── */
//   useEffect(() => {
//     if (
//       phase !== "lobby" ||
//       !joinRequestId ||
//       !guestIdentity ||
//       !meetingInfo?.id
//     )
//       return undefined;

//     const poll = async () => {
//       try {
//         // FIX: guestIdentity is a required query param on the backend —
//         // omitting it means every poll 400s.
//         const res = await getJoinRequestStatus(
//           meetingInfo.id,
//           joinRequestId,
//           guestIdentity,
//         );
//         const status = res?.data?.status;

//         if (status === "ADMITTED") {
//           clearInterval(lobbyPollRef.current);
//           // FIX: the status poll never returns a token — it must be
//           // fetched separately once ADMITTED.
//           const tokenRes = await getGuestToken(
//             meetingInfo.id,
//             joinRequestId,
//             guestIdentity,
//             guestName,
//           );
//           setConnectPayload({ ...tokenRes.data, isHost: false });
//           setPhase("in-meeting");
//         } else if (status === "DENIED") {
//           clearInterval(lobbyPollRef.current);
//           setPhase("denied");
//         }
//         // NOTE: no "CANCELLED" status exists on the backend
//         // (JoinRequestStatus is PENDING | ADMITTED | DENIED only),
//         // so that branch has been removed.
//       } catch (_) {
//         // transient network hiccup — keep polling
//       }
//     };
//     poll();
//     lobbyPollRef.current = setInterval(poll, LOBBY_POLL_MS);
//     return () => clearInterval(lobbyPollRef.current);
//   }, [phase, joinRequestId, guestIdentity, guestName, meetingInfo]);

//   const handleCancelLobby = useCallback(() => {
//     // FIX: there is no cancel/withdraw endpoint on the backend yet
//     // (TODO: add one if you want the host to stop seeing a stale
//     // pending request). For now we just stop polling client-side —
//     // the request stays PENDING server-side until the meeting ends
//     // or the host denies/admits it.
//     if (lobbyPollRef.current) clearInterval(lobbyPollRef.current);
//     setJoinRequestId(null);
//     setGuestIdentity(null);
//     setPhase("prejoin");
//   }, []);

//   const handleMeetingEndedRemotely = useCallback(() => {
//     setPhase("ended");
//   }, []);

//   const handleLeftMeeting = useCallback(() => {
//     navigate("/", { replace: true });
//   }, [navigate]);

//   /* ── render by phase ─────────────────────────────────────────────── */
//   if (phase === "loading") {
//     return (
//       <StatusScreen
//         icon={<Loader2 size={34} color="#93c5fd" className="im-spin" />}
//         title="Loading meeting…"
//       />
//     );
//   }
//   if (phase === "error") {
//     return (
//       <StatusScreen
//         icon={<AlertTriangle size={36} color="#f87171" />}
//         title="Can't open this meeting"
//         subtitle={loadError}
//       />
//     );
//   }
//   if (phase === "ended") {
//     return (
//       <StatusScreen
//         icon={<PhoneOff size={34} color="#94a3b8" />}
//         title="This meeting has ended"
//         subtitle="Thanks for joining. You can close this tab."
//       />
//     );
//   }
//   if (phase === "prejoin") {
//     return (
//       <PreJoinScreen
//         meetingInfo={meetingInfo}
//         joinCode={joinCode}
//         onSubmit={handlePreJoinSubmit}
//         submitting={submitting}
//         error={submitError}
//       />
//     );
//   }
//   if (phase === "lobby") {
//     return (
//       <LobbyScreen meetingInfo={meetingInfo} onCancel={handleCancelLobby} />
//     );
//   }
//   if (phase === "denied") {
//     return <DeniedScreen onRetry={() => setPhase("prejoin")} />;
//   }

//   return (
//     <MeetingRoom
//       joinCode={joinCode}
//       meetingId={meetingInfo?.id}
//       meetingInfo={meetingInfo}
//       connectPayload={connectPayload}
//       initialAV={initialAV}
//       onEndedRemotely={handleMeetingEndedRemotely}
//       onLeft={handleLeftMeeting}
//     />
//   );
// }

// /* ═════════════════════════════════════════════════════════════════
//    MEETING ROOM — the actual LiveKit-connected Google-Meet-style room.
//    Owns the Room instance directly; renders identically for host and
//    guests except for host-only affordances (waiting room, recording,
//    End meeting for everyone vs. Leave).
// ═════════════════════════════════════════════════════════════════ */
// function MeetingRoom({
//   joinCode,
//   meetingId,
//   meetingInfo,
//   connectPayload,
//   initialAV,
//   onEndedRemotely,
//   onLeft,
// }) {
//   const roomRef = useRef(null);
//   const localCamRef = useRef(null);
//   const localMicRef = useRef(null);
//   const camReadyPromiseRef = useRef(null);
//   const chatEndRef = useRef(null);
//   const waitingPollRef = useRef(null);
//   const statusPollRef = useRef(null);
//   const pipFallbackVideoRef = useRef(null);
//   const menuBtnRef = useRef(null);
//   const menuPanelRef = useRef(null);
//   const speakingSetRef = useRef(new Set());
//   const sidebarRef = useRef(null);
//   const screenSharePickerActiveRef = useRef(false);
//   const reactionBtnRef = useRef(null);
//   const reactionPanelRef = useRef(null);

//   const [connected, setConnected] = useState(false);
//   const [micOn, setMicOn] = useState(initialAV?.micOn ?? true);
//   const [camOn, setCamOn] = useState(initialAV?.camOn ?? true);
//   const [screenOn, setScreenOn] = useState(false);
//   const [participants, setParticipants] = useState([]);
//   const [messages, setMessages] = useState(() => [
//     {
//       id: 0,
//       system: true,
//       text: "You're connected. Say hello!",
//       time: getTime(),
//     },
//   ]);
//   const [msgInput, setMsgInput] = useState("");
//   const [raisedHands, setRaisedHands] = useState({});
//   const [floaters, setFloaters] = useState([]);
//   const [reactions, setReactions] = useState({}); // identity -> emoji, tile-anchored (same pattern as raisedHands)
//   const reactionTimeoutsRef = useRef({});
//   const [joinedAt, setJoinedAt] = useState(null);
//   const [mediaError, setMediaError] = useState(null);
//   const [pinnedId, setPinnedId] = useState(null);
//   // FIX (bug 2): every viewer can independently zoom the active screen share
//   // to full screen, exactly like Google Meet's fullscreen-on-presentation.
//   const [screenZoomed, setScreenZoomed] = useState(false);

//   // FIX (Screen Share Compatibility): support is detected once on mount —
//   // it depends only on the browser/OS, not on anything that changes during
//   // the call — and drives whether the Present button is enabled at all.
//   const [screenShareSupport] = useState(() => detectScreenShareSupport());

//   const [sidebarOpen, setSidebarOpen] = useState(() =>
//     typeof window === "undefined" ? true : window.innerWidth > 1023,
//   );
//   const [sidebarTab, setSidebarTab] = useState("chat"); // chat | people | waiting
//   // FIX (bug 4): the sidebar can now be dragged wider/narrower instead of
//   // only toggled open/closed.
//   const [sidebarWidth, setSidebarWidth] = useState(340);
//   const [isResizing, setIsResizing] = useState(false);
//   // FIX (bug 6): light/dark theme, persisted locally.
//   const [theme, setTheme] = useState(() => {
//     try {
//       return localStorage.getItem("im_theme") || "dark";
//     } catch (_) {
//       return "dark";
//     }
//   });
//   useEffect(() => {
//     try {
//       localStorage.setItem("im_theme", theme);
//     } catch (_) {}
//     if (typeof document !== "undefined") {
//       document.documentElement.setAttribute("data-theme", theme);
//     }
//     return () => {
//       if (typeof document !== "undefined") {
//         document.documentElement.removeAttribute("data-theme");
//       }
//     };
//   }, [theme]);
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [reactionPickerOpen, setReactionPickerOpen] = useState(false);
//   const [settingsOpen, setSettingsOpen] = useState(false);
//   const [captionsOn, setCaptionsOn] = useState(false);
//   const [recording, setRecording] = useState(false);
//   const [recToggling, setRecToggling] = useState(false);
//   const [pipWindow, setPipWindow] = useState(null);
//   const [copyToast, setCopyToast] = useState(false);
//   const [endedToast, setEndedToast] = useState(false);
//   const [reactionPos, setReactionPos] = useState(null);

//   const [waiting, setWaiting] = useState([]);

//   const isHost = !!connectPayload?.isHost;
//   const device = useResponsiveDevice();
//   const isCompactDevice = device === "phone";
//   const timer = useElapsedTimer(joinedAt);
//   const handRaised = !!raisedHands.you;
//   const shareLink =
//     typeof window !== "undefined"
//       ? `${window.location.origin}/ilmorameet/${joinCode}`
//       : "";

//   const rebuild = useCallback(() => {
//     setParticipants(
//       buildParticipantList(
//         roomRef.current,
//         raisedHands,
//         speakingSetRef.current,
//       ),
//     );
//   }, [raisedHands]);

//   // FIX (bug 3): join/left events are notices, NOT chat messages — they now
//   // live in their own toast queue instead of polluting the chat feed.
//   const [notices, setNotices] = useState([]);
//   const pushNotice = useCallback((text, type = "info") => {
//     const id = Date.now() + Math.random();
//     setNotices((prev) => [...prev, { id, text, type }]);
//     setTimeout(() => {
//       setNotices((prev) => prev.filter((n) => n.id !== id));
//     }, 4500);
//   }, []);

//   const spawnFloater = useCallback((emoji, name) => {
//     const id = Date.now() + Math.random();
//     setFloaters((prev) => [...prev, { id, emoji, name }]);
//     setTimeout(
//       () => setFloaters((prev) => prev.filter((f) => f.id !== id)),
//       2600,
//     );
//   }, []);

//   // FIX (bug 3 / emoji reactions): shows the emoji on the sender's own
//   // tile/avatar, exactly like raisedHands is keyed by identity — every
//   // participant sees the reaction on the correct user's tile.
//   const showReaction = useCallback((identity, emoji) => {
//     if (!identity) return;
//     setReactions((prev) => ({ ...prev, [identity]: emoji }));
//     if (reactionTimeoutsRef.current[identity]) {
//       clearTimeout(reactionTimeoutsRef.current[identity]);
//     }
//     reactionTimeoutsRef.current[identity] = setTimeout(() => {
//       setReactions((prev) => {
//         const next = { ...prev };
//         delete next[identity];
//         return next;
//       });
//     }, 3000);
//   }, []);

//   /* ── connect to LiveKit once we have a token ─────────────────────── */
//   useEffect(() => {
//     if (!connectPayload?.token) return undefined;
//     const serverUrl = import.meta.env.VITE_LIVEKIT_URL || "ws://localhost:7880";
//     let cancelled = false;

//     const start = async () => {
//       const room = new Room({ adaptiveStream: true, dynacast: true });
//       roomRef.current = room;

//       const onData = (payload, participant) => {
//         try {
//           const decoded = new TextDecoder().decode(payload);
//           const msg = JSON.parse(decoded);
//           if (msg.type === "chat" && msg.text) {
//             setMessages((prev) => [
//               ...prev,
//               {
//                 id: Date.now() + Math.random(),
//                 name: participant?.name || participant?.identity || "Guest",
//                 senderIdentity: participant?.identity || null,
//                 text: msg.text,
//                 time: getTime(),
//                 self: false,
//               },
//             ]);
//           } else if (msg.type === "reaction" && msg.emoji) {
//             showReaction(participant?.identity, msg.emoji);
//           } else if (msg.type === "hand") {
//             setRaisedHands((prev) => ({
//               ...prev,
//               [participant?.identity]: !!msg.raised,
//             }));
//           }
//         } catch (_) {}
//       };

//       room.on(RoomEvent.TrackSubscribed, rebuild);
// room.on(RoomEvent.TrackUnsubscribed, rebuild);
// room.on(RoomEvent.TrackMuted, rebuild);
// room.on(RoomEvent.TrackUnmuted, rebuild);
// room.on(RoomEvent.LocalTrackPublished, rebuild);
// room.on(RoomEvent.LocalTrackUnpublished, rebuild);

// // FIX: publish-level events — refresh before subscribe round-trip.
// room.on(RoomEvent.TrackPublished, rebuild);
// room.on(RoomEvent.TrackUnpublished, rebuild);
//       room.on(RoomEvent.ParticipantConnected, (p) => {
//         rebuild();
//         pushNotice(`${p.name || p.identity} joined the meeting`, "join");
//       });
//       room.on(RoomEvent.ParticipantDisconnected, (p) => {
//         rebuild();
//         pushNotice(`${p.name || p.identity} left the meeting`, "leave");
//         setRaisedHands((prev) => {
//           const next = { ...prev };
//           delete next[p.identity];
//           return next;
//         });
//       });
//       room.on(RoomEvent.ActiveSpeakersChanged, (speakers) => {
//         speakingSetRef.current = new Set(
//           (speakers || []).map((s) => s.identity),
//         );
//         rebuild();
//       });
//       room.on(RoomEvent.DataReceived, onData);
//       room.on(RoomEvent.Disconnected, () => setConnected(false));

//       try {
//         await room.connect(serverUrl, connectPayload.token);
//         if (cancelled) {
//           room.disconnect();
//           return;
//         }
//         setConnected(true);
//         const backendStarted =
//           meetingInfo?.startedAt ||
//           meetingInfo?.actualStartTime ||
//           meetingInfo?.startTime;
//         let startedAtMs = backendStarted
//           ? new Date(backendStarted).getTime()
//           : null;
//         const storageKey = `im_meeting_started_${meetingId || joinCode}`;
//         if (!startedAtMs) {
//           try {
//             const cached = localStorage.getItem(storageKey);
//             if (cached) startedAtMs = Number(cached);
//           } catch (_) {}
//         }
//         if (!startedAtMs || Number.isNaN(startedAtMs)) {
//           startedAtMs = Date.now();
//           try {
//             localStorage.setItem(storageKey, String(startedAtMs));
//           } catch (_) {}
//         }
//         setJoinedAt(startedAtMs);
//         rebuild();
//       } catch (err) {
//         console.error("LiveKit connect failed:", err);
//         return;
//       }

//       try {
//         const tracks = await createLocalTracks({
//           audio: {
//             echoCancellation: true,
//             noiseSuppression: true,
//             autoGainControl: true,
//           },
//           video: { resolution: { width: 1280, height: 720 } },
//         });

//         camReadyPromiseRef.current = (async () => {
//           const camTrack = tracks.find((t) => t.kind === Track.Kind.Video);
//           if (camTrack) {
//             await room.localParticipant.publishTrack(camTrack);
//             localCamRef.current = camTrack;
//             if (initialAV && initialAV.camOn === false) await camTrack.mute();
//           }
//         })();

//         for (const track of tracks) {
//           if (track.kind === Track.Kind.Audio) {
//             await room.localParticipant.publishTrack(track);
//             localMicRef.current = track;
//             if (initialAV && initialAV.micOn === false) await track.mute();
//           }
//         }
//         await camReadyPromiseRef.current;

//         if (!localMicRef.current) setMicOn(false);
//         if (!localCamRef.current) setCamOn(false);
//         if (!localMicRef.current || !localCamRef.current) {
//           setMediaError(
//             !localMicRef.current && !localCamRef.current
//               ? "Camera and microphone access was blocked by your browser. Allow access in your browser's site settings, then refresh."
//               : !localMicRef.current
//                 ? "Microphone access was blocked by your browser. Allow access in your browser's site settings and try the mic button again."
//                 : "Camera access was blocked by your browser. Allow access in your browser's site settings and try the camera button again.",
//           );
//         }
//       } catch (err) {
//         console.error("createLocalTracks failed:", err);
//         setMicOn(false);
//         setCamOn(false);
//         setMediaError(
//           "Couldn't access your camera/microphone. Check your browser's site permissions, then refresh the page.",
//         );
//       }
//       rebuild();
//     };

//     start();

//     return () => {
//       cancelled = true;
//       try {
//         roomRef.current?.disconnect();
//       } catch (_) {}
//       roomRef.current = null;
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [connectPayload?.token]);

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, sidebarTab, sidebarOpen]);

//   /* ── host: poll the waiting room ──────────────────────────────────── */
//   useEffect(() => {
//     if (!isHost || !meetingId) return undefined;
//     const poll = async () => {
//       try {
//         const res = await listPendingJoinRequests(meetingId);
//         const items = (res?.data || []).map((r) => ({
//           requestId: r.requestId,
//           name: r.guestName,
//         }));
//         setWaiting(items);
//       } catch (_) {}
//     };
//     poll();
//     waitingPollRef.current = setInterval(poll, WAITING_ROOM_POLL_MS);
//     return () => clearInterval(waitingPollRef.current);
//   }, [isHost, meetingId]);

//   /* ── everyone: poll meeting status so guests learn the host ended it ── */
//   useEffect(() => {
//     statusPollRef.current = setInterval(async () => {
//       try {
//         const res = await getMeetingByJoinCode(joinCode);
//         if (res?.data?.meetingStatus === "ENDED") {
//           clearInterval(statusPollRef.current);
//           setEndedToast(true);
//           setTimeout(() => onEndedRemotely(), 2500);
//         }
//       } catch (_) {}
//     }, MEETING_STATUS_POLL_MS);
//     return () => clearInterval(statusPollRef.current);
//   }, [joinCode, onEndedRemotely]);

//   /* ── controls ─────────────────────────────────────────────────────── */
//   const toggleMic = useCallback(async () => {
//     const room = roomRef.current;
//     if (!room) return;
//     try {
//       if (!localMicRef.current) {
//         const [audioTrack] = await createLocalTracks({
//           audio: {
//             echoCancellation: true,
//             noiseSuppression: true,
//             autoGainControl: true,
//           },
//         });
//         await room.localParticipant.publishTrack(audioTrack);
//         localMicRef.current = audioTrack;
//         setMicOn(true);
//         setMediaError(null);
//         rebuild();
//         return;
//       }
//       const track = localMicRef.current;
//       if (micOn) await track.mute();
//       else await track.unmute();
//       setMicOn((v) => !v);
//       rebuild();
//     } catch (err) {
//       console.error("Mic toggle failed:", err);
//       setMediaError(
//         "Couldn't access your microphone. Check your browser's site permissions and try again.",
//       );
//     }
//   }, [micOn, rebuild]);

//   const toggleCam = useCallback(async () => {
//     const room = roomRef.current;
//     if (!room) return;
//     if (camReadyPromiseRef.current) await camReadyPromiseRef.current;
//     try {
//       if (!localCamRef.current) {
//         const [videoTrack] = await createLocalTracks({
//           video: { resolution: { width: 1280, height: 720 } },
//         });
//         await room.localParticipant.publishTrack(videoTrack);
//         localCamRef.current = videoTrack;
//         setCamOn(true);
//         setMediaError(null);
//         rebuild();
//         return;
//       }
//       const track = localCamRef.current;
//       if (camOn) await track.mute();
//       else await track.unmute();
//       setCamOn((v) => !v);
//       rebuild();
//     } catch (err) {
//       console.error("Camera toggle failed:", err);
//       setMediaError(
//         "Couldn't access your camera. Check your browser's site permissions and try again.",
//       );
//     }
//   }, [camOn, rebuild]);

//   // FIX (Bug 1 — Screen Share Compatibility):
//   //   • Feature-detects before ever calling getDisplayMedia (iOS Safari,
//   //     insecure origins, and legacy browsers never attempt the call and
//   //     never hit LiveKit's internal error path — they get one clear,
//   //     actionable message instead).
//   //   • Distinguishes "user cancelled the picker" (NotAllowedError with no
//   //     prior permission prompt / AbortError) from a genuine permission
//   //     block, and from a device/browser that doesn't support the feature
//   //     at all, so the on-screen message is accurate for each platform.
//   //   • Passes broadly-supported ScreenShareCaptureOptions only
//   //     (video resolution + contentHint) — omits options like
//   //     `selfBrowserSurface`/`systemAudio` that only exist in Chromium,
//   //     since passing unsupported keys can throw a TypeError in Safari/
//   //     Firefox before the picker even opens.
//   //   • Always calls setScreenShareEnabled(false) in the same try/catch
//   //     shape on both start and stop, and always clears local state even
//   //     if the underlying LiveKit call throws, so the Present button can
//   //     never get stuck in a stale "on" state on any platform.
//   const toggleScreen = useCallback(async () => {
//     const room = roomRef.current;
//     if (!room) return;

//     if (screenOn) {
//       try {
//         await room.localParticipant.setScreenShareEnabled(false);
//       } catch (err) {
//         console.warn("Stop screen share failed:", err);
//       } finally {
//         setScreenOn(false);
//         rebuild();
//       }
//       return;
//     }

//     if (!screenShareSupport.supported) {
//       setMediaError(
//         screenShareSupport.message ||
//           "Screen sharing isn't available on this device or browser.",
//       );
//       return;
//     }

//     screenSharePickerActiveRef.current = true;
//     try {
//       const pub = await room.localParticipant.setScreenShareEnabled(true, {
//         audio: false,
//         resolution: { width: 1920, height: 1080 },
//         contentHint: "detail",
//       });
//       if (!pub) return;
//       setScreenOn(true);
//       setMediaError(null);
//       rebuild();
//       pub.track?.mediaStreamTrack?.addEventListener(
//         "ended",
//         () => {
//           // Fires when the user stops sharing from the browser/OS's own
//           // "Stop sharing" bar/indicator (Windows, macOS, Chrome, Edge) —
//           // keep our button state in sync with that native control.
//           room.localParticipant.setScreenShareEnabled(false).catch(() => {});
//           setScreenOn(false);
//           rebuild();
//         },
//         { once: true },
//       );
//     } catch (err) {
//       setScreenOn(false);
//       const name = err?.name || "";
//       if (name === "NotAllowedError" || name === "PermissionDeniedError") {
//         setMediaError(
//           "Screen sharing was blocked or the picker was cancelled. Click Present again and choose a screen, window, or tab to share.",
//         );
//       } else if (name === "NotFoundError") {
//         setMediaError(
//           "No shareable screen was found. If you're on a virtual machine or remote desktop, screen sharing may be restricted there.",
//         );
//       } else if (name === "NotReadableError") {
//         setMediaError(
//           "Your screen couldn't be captured — another app may be blocking screen recording. Check your OS privacy settings and try again.",
//         );
//       } else if (name === "AbortError") {
//         // User closed the picker — not an error worth surfacing.
//       } else {
//         console.warn("Screen share failed:", err);
//         setMediaError(
//           "Couldn't start screen sharing on this device. Try Chrome, Edge, or Firefox, or a Mac/Windows/Linux/Android device.",
//         );
//       }
//       rebuild();
//     } finally {
//       screenSharePickerActiveRef.current = false;
//     }
//   }, [screenOn, screenShareSupport, rebuild]);

//   const toggleHandRaise = useCallback(() => {
//     const next = !handRaised;
//     setRaisedHands((prev) => ({ ...prev, you: next }));
//     try {
//       const payload = new TextEncoder().encode(
//         JSON.stringify({ type: "hand", raised: next }),
//       );
//       roomRef.current?.localParticipant?.publishData(payload, {
//         reliable: true,
//       });
//     } catch (_) {}
//   }, [handRaised]);

//   const sendReaction = useCallback(
//     (emoji) => {
//       const localIdentity = roomRef.current?.localParticipant?.identity;
//       showReaction(localIdentity, emoji);
//       try {
//         const payload = new TextEncoder().encode(
//           JSON.stringify({ type: "reaction", emoji }),
//         );
//         roomRef.current?.localParticipant?.publishData(payload, {
//           reliable: false,
//         });
//       } catch (_) {}
//       setReactionPickerOpen(false);
//     },
//     [showReaction],
//   );

//   const sendMsg = useCallback(() => {
//     const text = msgInput.trim();
//     if (!text) return;
//     setMessages((prev) => [
//       ...prev,
//       {
//         id: Date.now(),
//         name: "You",
//         senderIdentity: roomRef.current?.localParticipant?.identity || null,
//         text,
//         time: getTime(),
//         self: true,
//       },
//     ]);
//     setMsgInput("");
//     try {
//       const payload = new TextEncoder().encode(
//         JSON.stringify({ type: "chat", text }),
//       );
//       roomRef.current?.localParticipant?.publishData(payload, {
//         reliable: true,
//       });
//     } catch (_) {}
//   }, [msgInput]);

//   const openTab = useCallback(
//     (tab) => {
//       if (sidebarOpen && sidebarTab === tab) setSidebarOpen(false);
//       else {
//         setSidebarTab(tab);
//         setSidebarOpen(true);
//       }
//     },
//     [sidebarOpen, sidebarTab],
//   );

//   /* ── recording (host only) ───────────────────────────────────────── */
//   const toggleRecording = useCallback(() => {
//     if (!isHost || recToggling) return;
//     setRecToggling(true);
//     setTimeout(() => {
//       setRecording((v) => !v);
//       setRecToggling(false);
//     }, 300);
//   }, [isHost, recToggling]);

//   /* ── waiting room actions (host only) ────────────────────────────── */
//   const handleAdmit = useCallback(
//     async (requestId) => {
//       if (!meetingId) return;
//       try {
//         await admitJoinRequest(meetingId, requestId);
//         setWaiting((prev) => prev.filter((w) => w.requestId !== requestId));
//       } catch (_) {}
//     },
//     [meetingId],
//   );
//   const handleDeny = useCallback(
//     async (requestId) => {
//       if (!meetingId) return;
//       try {
//         await denyJoinRequest(meetingId, requestId);
//         setWaiting((prev) => prev.filter((w) => w.requestId !== requestId));
//       } catch (_) {}
//     },
//     [meetingId],
//   );
//   const handleAdmitAll = useCallback(async () => {
//     if (!meetingId) return;
//     try {
//       await admitAllJoinRequests(meetingId);
//       setWaiting([]);
//     } catch (_) {}
//   }, [meetingId]);

//   /* ── leave / end ──────────────────────────────────────────────────── */
//   const handleLeave = useCallback(() => {
//     try {
//       roomRef.current?.disconnect();
//     } catch (_) {}
//     onLeft();
//   }, [onLeft]);

//  const endingRef = useRef(false);
//   const [isEnding, setIsEnding] = useState(false);
//   const handleEndForAll = useCallback(async () => {
//     if (!meetingId || endingRef.current) return;
//     endingRef.current = true;
//     setIsEnding(true);
//     try {
//       await endMeeting(meetingId);
//       try {
//         await requestMeetingSummary(meetingId, messages);
//       } catch (_) {}
//     } catch (_) {}
//     try {
//       roomRef.current?.disconnect();
//     } catch (_) {}
//     onLeft();
//   }, [meetingId, onLeft, messages]);

//   const copyLink = useCallback(() => {
//     navigator.clipboard
//       ?.writeText(shareLink)
//       .then(() => {
//         setCopyToast(true);
//         setTimeout(() => setCopyToast(false), 2000);
//       })
//       .catch(() => {});
//   }, [shareLink]);

//   /* ── sidebar drag-to-resize (bug 4) ──────────────────────────────── */
//   const startResize = useCallback(
//     (e) => {
//       e.preventDefault();
//       setIsResizing(true);
//       const startX = e.touches ? e.touches[0].clientX : e.clientX;
//       const startWidth = sidebarWidth;
//       const onMove = (moveEvt) => {
//         const clientX = moveEvt.touches
//           ? moveEvt.touches[0].clientX
//           : moveEvt.clientX;
//         const delta = startX - clientX; // dragging left grows the sidebar
//         const next = Math.min(640, Math.max(280, startWidth + delta));
//         setSidebarWidth(next);
//       };
//       const onUp = () => {
//         setIsResizing(false);
//         window.removeEventListener("mousemove", onMove);
//         window.removeEventListener("mouseup", onUp);
//         window.removeEventListener("touchmove", onMove);
//         window.removeEventListener("touchend", onUp);
//       };
//       window.addEventListener("mousemove", onMove);
//       window.addEventListener("mouseup", onUp);
//       window.addEventListener("touchmove", onMove, { passive: false });
//       window.addEventListener("touchend", onUp);
//     },
//     [sidebarWidth],
//   );

//   /* ── PiP ──────────────────────────────────────────────────────────── */
//   const screenSharer = useMemo(
//     () => participants.find((p) => !!p.screenTrack),
//     [participants],
//   );
//   const featured = useMemo(() => {
//     if (screenSharer) return screenSharer;
//     return (
//       participants.find((p) => p.isHost) ||
//       participants.find((p) => !p.isLocal) ||
//       participants[0] ||
//       null
//     );
//   }, [participants, screenSharer]);
//   const stripParticipants = useMemo(
//     () => participants.filter((p) => p.identity !== featured?.identity),
//     [participants, featured],
//   );
//   const MAX_STRIP_VISIBLE = 6;
//   const visibleStrip = stripParticipants.slice(0, MAX_STRIP_VISIBLE);
//   const overflowCount = Math.max(
//     0,
//     stripParticipants.length - MAX_STRIP_VISIBLE,
//   );
//   const gridMode = !screenSharer && participants.length > 1;

//   const pipTrack =
//     screenSharer?.screenTrack ||
//     participants.find((p) => p.isLocal)?.cameraTrack ||
//     participants.find((p) => !p.isLocal && p.cameraTrack)?.cameraTrack ||
//     null;
//   const pipIsScreen = !!screenSharer?.screenTrack;
//   const pipLabel = screenSharer
//     ? screenSharer.isLocal
//       ? "You are presenting"
//       : `${screenSharer.name} is presenting`
//     : "Live meeting";
//   const pipSupported =
//     typeof window !== "undefined" && "documentPictureInPicture" in window;

//   const closePiP = useCallback(() => {
//     setPipWindow((win) => {
//       if (win && !win.closed) win.close();
//       return null;
//     });
//     if (document.pictureInPictureElement)
//       document.exitPictureInPicture().catch(() => {});
//   }, []);

//   const openPiP = useCallback(async () => {
//     if (pipWindow) return;
//     if (pipSupported) {
//       try {
//         const win = await window.documentPictureInPicture.requestWindow({
//           width: 340,
//           height: 220,
//         });
//         [...document.styleSheets].forEach((sheet) => {
//           try {
//             const css = [...sheet.cssRules].map((r) => r.cssText).join("");
//             const style = win.document.createElement("style");
//             style.textContent = css;
//             win.document.head.appendChild(style);
//           } catch (_) {
//             if (sheet.href) {
//               const link = win.document.createElement("link");
//               link.rel = "stylesheet";
//               link.href = sheet.href;
//               win.document.head.appendChild(link);
//             }
//           }
//         });
//         win.document.body.style.margin = "0";
//         win.document.body.style.background = "#000";
//         win.document.body.style.overflow = "hidden";
//         win.addEventListener("pagehide", () => setPipWindow(null), {
//           once: true,
//         });
//         setPipWindow(win);
//         return;
//       } catch (err) {
//         console.warn("Document PiP unavailable, falling back:", err);
//       }
//     }
//     const el = pipFallbackVideoRef.current;
//     if (el?.requestPictureInPicture) {
//       try {
//         await el.requestPictureInPicture();
//       } catch (_) {}
//     }
//   }, [pipSupported, pipWindow]);

//   const togglePiP = useCallback(() => {
//     if (pipWindow || document.pictureInPictureElement) closePiP();
//     else openPiP();
//   }, [pipWindow, openPiP, closePiP]);

//   useEffect(() => {
//     if (!connected) return undefined;
//     const onVisibility = () => {
//       if (screenSharePickerActiveRef.current) return;
//       if (document.hidden) openPiP();
//       else closePiP();
//     };
//     document.addEventListener("visibilitychange", onVisibility);
//     return () => document.removeEventListener("visibilitychange", onVisibility);
//   }, [connected, openPiP, closePiP]);

//   useEffect(() => () => closePiP(), []); // eslint-disable-line react-hooks/exhaustive-deps

//   useEffect(() => {
//     if (!screenSharer) setScreenZoomed(false);
//   }, [screenSharer]);
//   useEffect(() => {
//     if (!screenZoomed) return undefined;
//     const onKey = (e) => {
//       if (e.key === "Escape") setScreenZoomed(false);
//     };
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [screenZoomed]);

//   const closeMenu = useCallback(() => setMenuOpen(false), []);
//   const closeReactionPicker = useCallback(
//     () => setReactionPickerOpen(false),
//     [],
//   );
//   useDismiss(menuOpen, closeMenu, [menuBtnRef, menuPanelRef]);
//   useDismiss(reactionPickerOpen, closeReactionPicker, [
//     reactionBtnRef,
//     reactionPanelRef,
//   ]);

//   const S = IM_STYLES;

//   return (
//     <div style={S.root} className="im-root" data-theme={theme}>
//       <VideoTrackEl
//         videoRef={pipFallbackVideoRef}
//         track={pipTrack}
//         fit={pipIsScreen ? "contain" : "cover"}
//         hidden
//       />

//       {pipWindow &&
//         createPortal(
//           <PiPPanel
//             track={pipTrack}
//             isScreen={pipIsScreen}
//             label={pipLabel}
//             timer={timer}
//             micOn={micOn}
//             onToggleMic={toggleMic}
//             onReturn={() => {
//               window.focus();
//               closePiP();
//             }}
//           />,
//           pipWindow.document.body,
//         )}

//       {screenZoomed &&
//         screenSharer &&
//         createPortal(
//           <div style={S.zoomOverlay} role="dialog" aria-label="Screen share full screen">
//             <VideoTrackEl track={screenSharer.screenTrack} fit="contain" />
//             <div style={S.zoomOverlayBar}>
//               <span style={S.zoomOverlayLabel}>
//                 <MonitorPlay size={14} />
//                 {screenSharer.isLocal
//                   ? "You are presenting"
//                   : `${screenSharer.name} is presenting`}
//               </span>
//               <button
//                 type="button"
//                 style={S.zoomExitBtn}
//                 onClick={() => setScreenZoomed(false)}
//                 aria-label="Exit full screen"
//               >
//                 <Minimize2 size={15} />
//                 Exit full screen
//               </button>
//             </div>
//           </div>,
//           document.body,
//         )}

//       {reactionPickerOpen &&
//         reactionPos &&
//         createPortal(
//           <div
//             ref={reactionPanelRef}
//             style={{
//               ...S.reactionPicker,
//               position: "fixed",
//               left: reactionPos.left,
//               top: reactionPos.top,
//               bottom: "auto",
//               transform: "translate(-50%, -100%)",
//               zIndex: 10000,
//             }}
//             role="menu"
//           >
//             {REACTIONS.map((emoji) => (
//               <button
//                 key={emoji}
//                 role="menuitem"
//                 style={S.reactionPickerBtn}
//                 onClick={() => sendReaction(emoji)}
//               >
//                 {emoji}
//               </button>
//             ))}
//           </div>,
//           document.body,
//         )}

//       {endedToast && (
//         <div style={S.toast} role="alert">
//           <span style={{ fontSize: 18 }}>⏱️</span>
//           <div>
//             <div style={{ fontWeight: 700, fontSize: 13 }}>
//               Meeting ended by host
//             </div>
//             <div style={{ fontSize: 11, opacity: 0.85 }}>
//               Redirecting you out…
//             </div>
//           </div>
//         </div>
//       )}
//       {copyToast && (
//         <div
//           style={{
//             ...S.toast,
//             background: "linear-gradient(135deg,#16a34a,#22c55e)",
//           }}
//         >
//           <Copy size={16} />
//           <div style={{ fontWeight: 700, fontSize: 13 }}>Link copied</div>
//         </div>
//       )}

//       {notices.length > 0 && (
//         <div className="im-toast-stack" aria-live="polite">
//           {notices.map((n) => (
//             <div
//               key={n.id}
//               style={{
//                 ...S.noticePill,
//                 ...(n.type === "join"
//                   ? S.noticePillJoin
//                   : n.type === "leave"
//                     ? S.noticePillLeave
//                     : null),
//               }}
//             >
//               {n.type === "join" ? (
//                 <UserPlus size={14} color="#34d399" />
//               ) : n.type === "leave" ? (
//                 <UserMinus size={14} color="#f87171" />
//               ) : (
//                 <Users size={13} />
//               )}
//               <span>{n.text}</span>
//             </div>
//           ))}
//         </div>
//       )}

//       {mediaError && (
//         <div style={S.mediaErrorBar} role="alert">
//           <AlertTriangle size={14} />
//           <span>{mediaError}</span>
//           <button
//             style={S.mediaErrorClose}
//             onClick={() => setMediaError(null)}
//             aria-label="Dismiss"
//           >
//             <X size={13} />
//           </button>
//         </div>
//       )}

//       {/* ── top bar ── */}
//       <div style={S.topBar} className="im-topbar">
//         <div style={S.topLeft} className="im-topleft">
//           <img src={texoraLogo} alt="Texora AI" style={S.logoImg} />
//           <div style={S.liveBadge}>
//             <span style={S.liveDot} />
//             LIVE
//           </div>
//           <span style={S.sessionName} className="im-sessionname">
//             {meetingInfo?.title || "Ilmorameet"}
//           </span>
//           <div style={S.timerBadge}>
//             <Timer size={13} />
//             {timer}
//           </div>
//           {recording && (
//             <div style={S.recBadge}>
//               <Disc2 size={11} />
//               REC
//             </div>
//           )}
//         </div>
//         <div style={S.topRight} className="im-topright">
//           <button
//             style={S.iconGhostBtn}
//             onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
//             title={
//               theme === "dark"
//                 ? "Switch to light theme"
//                 : "Switch to dark theme"
//             }
//             aria-label="Toggle theme"
//           >
//             {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
//           </button>
//           <button
//             style={S.iconGhostBtn}
//             onClick={copyLink}
//             title="Copy meeting link"
//             aria-label="Copy meeting link"
//           >
//             <ExternalLink size={15} />
//           </button>
//           <div style={S.peopleCountBadge}>
//             <Users size={14} />
//             {participants.length || 1}
//           </div>
//           <div
//             style={{ ...S.connBadge, ...(connected ? S.connOn : S.connOff) }}
//           >
//             <SignalHigh size={14} />
//           </div>
//           {/* FIX (mobile screen-share bug): on phone-width screens, show a
//               compact status pill instead of relying only on the control-bar
//               button — makes the "not available on this device" state visible
//               even before opening the control bar, matching the reference UI. */}
//           {isCompactDevice && (
//             <div
//               style={{
//                 ...S.screenStatusPill,
//                 ...(screenOn
//                   ? S.screenStatusPillOn
//                   : !screenShareSupport.supported
//                     ? S.screenStatusPillBlocked
//                     : null),
//               }}
//               title={
//                 screenOn
//                   ? "You're presenting"
//                   : !screenShareSupport.supported
//                     ? screenShareSupport.message
//                     : "Screen sharing available"
//               }
//             >
//               {screenOn ? (
//                 <MonitorPlay size={14} />
//               ) : (
//                 <MonitorOff size={14} />
//               )}
//             </div>
//           )}
//           {isHost ? (
//             <button
//               style={{ ...S.endSessionBtn, opacity: isEnding ? 0.6 : 1 }}
//               onClick={handleEndForAll}
//               disabled={isEnding}
//             >
//               <PhoneOff size={14} />
//               <span className="im-btn-label-inline">
//                 {isEnding ? "Ending…" : "End meeting"}
//               </span>
//             </button>
//           ) : (
//             <button
//               style={{ ...S.endSessionBtn, background: "#334155" }}
//               onClick={handleLeave}
//             >
//               <PhoneOff size={14} />
//               <span className="im-btn-label-inline">Leave</span>
//             </button>
//           )}
//           <div style={{ position: "relative" }}>
//             <button
//               ref={menuBtnRef}
//               style={S.iconGhostBtn}
//               onClick={() => setMenuOpen((v) => !v)}
//               aria-haspopup="menu"
//               aria-expanded={menuOpen}
//             >
//               <MoreVertical size={16} />
//             </button>
//             {menuOpen && (
//               <div ref={menuPanelRef} style={S.dropMenu} role="menu">
//                 <button
//                   role="menuitem"
//                   style={S.dropMenuItem}
//                   onClick={() => {
//                     setSettingsOpen(true);
//                     setMenuOpen(false);
//                   }}
//                 >
//                   <Settings size={13} />
//                   Settings
//                 </button>
//                 {isHost && (
//                   <button
//                     role="menuitem"
//                     style={S.dropMenuItem}
//                     onClick={() => {
//                       toggleRecording();
//                       setMenuOpen(false);
//                     }}
//                   >
//                     <Disc2 size={13} />
//                     {recording ? "Stop recording" : "Start recording"}
//                   </button>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {screenOn && (
//         <div style={S.presentingBar}>
//           <MonitorPlay size={14} />
//           <span>You're presenting to everyone</span>
//           <button style={S.presentingStopBtn} onClick={toggleScreen}>
//             Stop sharing
//           </button>
//         </div>
//       )}

//       {/* ── main area ── */}
//       <div style={S.mainArea} className="im-mainarea">
//         <div style={S.stageColumn} className="im-stagecolumn">
//           {isCompactDevice ? (
//             /* FIX (mobile UI): phone gets a single full-width stacked
//                column — one card per participant — instead of the
//                desktop grid or stage+filmstrip. Desktop/tablet/laptop
//                below are completely unchanged. */
//             <div style={S.mobileStackWrap} className="im-mobile-stack">
//               {participants.map((p) => (
//                 <MobileStackedTile
//                   key={p.identity}
//                   p={p}
//                   active={p.isLocal}
//                   raised={p.isLocal ? handRaised : !!raisedHands[p.identity]}
//                   reaction={reactions[p.identity]}
//                   S={S}
//                   onOpenPeople={() => openTab("people")}
//                 />
//               ))}
//               {captionsOn && (
//                 <div style={S.captionsBar}>
//                   <Captions size={13} />
//                   <span>Live captions are enabled for this meeting.</span>
//                 </div>
//               )}
//             </div>
//           ) : gridMode ? (
//             <>
//               <ParticipantGrid
//                 participants={participants}
//                 raisedHands={raisedHands}
//                 handRaised={handRaised}
//                 reactions={reactions}
//                 S={S}
//               />
//               {captionsOn && (
//                 <div style={S.captionsBar}>
//                   <Captions size={13} />
//                   <span>Live captions are enabled for this meeting.</span>
//                 </div>
//               )}
//             </>
//           ) : (
//             <>
//               <StageTile
//                 p={featured}
//                 raised={
//                   featured
//                     ? featured.isLocal
//                       ? handRaised
//                       : !!raisedHands[featured.identity]
//                     : false
//                 }
//                 reaction={featured ? reactions[featured.identity] : null}
//                 S={S}
//                 onMaximize={
//                   featured?.screenTrack
//                     ? () => setScreenZoomed(true)
//                     : undefined
//                 }
//               />
//               {captionsOn && (
//                 <div style={S.captionsBar}>
//                   <Captions size={13} />
//                   <span>Live captions are enabled for this meeting.</span>
//                 </div>
//               )}
//               {(visibleStrip.length > 0 || overflowCount > 0) && (
//                 <div
//                   data-scroll-root
//                   className="im-filmstrip"
//                   style={S.filmstrip}
//                 >
//                   {visibleStrip.map((p) => (
//                     <StripTile
//                       key={p.identity}
//                       p={p}
//                       active={p.isLocal}
//                       raised={
//                         p.isLocal ? handRaised : !!raisedHands[p.identity]
//                       }
//                       reaction={reactions[p.identity]}
//                       S={S}
//                     />
//                   ))}
//                   {overflowCount > 0 && (
//                     <StripOverflow
//                       count={overflowCount}
//                       S={S}
//                       onClick={() => openTab("people")}
//                     />
//                   )}
//                 </div>
//               )}
//             </>
//           )}
//           <EmojiFloaters floaters={floaters} S={S} />
//         </div>

//         {sidebarOpen && (
//           <div
//             role="separator"
//             aria-orientation="vertical"
//             aria-label="Resize sidebar"
//             style={S.handle}
//             className={`im-handle im-resize-handle${isResizing ? " im-resizing" : ""}`}
//             onMouseDown={startResize}
//             onTouchStart={startResize}
//           />
//         )}

//         {sidebarOpen && (
//           <div
//             style={S.sidebarBackdrop}
//             className="im-sidebar-backdrop"
//             onClick={() => setSidebarOpen(false)}
//           />
//         )}

//         {sidebarOpen && (
//           <div
//             ref={sidebarRef}
//             style={{ ...S.sidebar, width: sidebarWidth }}
//             className="im-sidebar"
//           >
//             <div style={S.tabRow}>
//               <button
//                 style={{ ...S.tab, ...(sidebarTab === "chat" ? S.tabOn : {}) }}
//                 onClick={() => setSidebarTab("chat")}
//               >
//                 <MessageSquare size={15} /> Chat
//               </button>
//               <button
//                 style={{
//                   ...S.tab,
//                   ...(sidebarTab === "people" ? S.tabOn : {}),
//                 }}
//                 onClick={() => setSidebarTab("people")}
//               >
//                 <Users size={15} /> People
//                 <span style={S.cnt}>{participants.length || 1}</span>
//               </button>
//               {isHost && (
//                 <button
//                   style={{
//                     ...S.tab,
//                     ...(sidebarTab === "waiting" ? S.tabOn : {}),
//                   }}
//                   onClick={() => setSidebarTab("waiting")}
//                 >
//                   <Clock size={15} /> Waiting
//                   {waiting.length > 0 && (
//                     <span
//                       style={{
//                         ...S.cnt,
//                         background: "rgba(251,191,36,.22)",
//                         color: "#fbbf24",
//                       }}
//                     >
//                       {waiting.length}
//                     </span>
//                   )}
//                 </button>
//               )}
//               <button style={S.closeBtn} onClick={() => setSidebarOpen(false)}>
//                 <X size={16} />
//               </button>
//             </div>

//             {sidebarTab === "chat" && (
//               <div style={S.chatWrap}>
//                 <div style={S.msgList}>
//                   {messages.map((m) =>
//                     m.system ? (
//                       <div key={m.id} style={S.msgRow}>
//                         <div style={S.sysBubble}>{m.text}</div>
//                       </div>
//                     ) : (
//                       <div
//                         key={m.id}
//                         style={{ ...S.msgCol, ...(m.self ? S.msgColSelf : {}) }}
//                       >
//                         <span
//                           style={{
//                             ...S.bHeader,
//                             ...(m.self ? S.bHeaderSelf : {}),
//                           }}
//                         >
//                           {m.self ? "You" : m.name}
//                           <span style={S.bHeaderTime}>{m.time}</span>
//                         </span>
//                         <div
//                           style={{
//                             ...S.bubble,
//                             ...(m.self ? S.bSelf : S.bOther),
//                           }}
//                         >
//                           <span style={S.bText}>{m.text}</span>
//                         </div>
//                       </div>
//                     ),
//                   )}
//                   <div ref={chatEndRef} />
//                 </div>
//                 <div style={S.inputRow}>
//                   <input
//                     style={S.chatInput}
//                     placeholder="Type a message…"
//                     value={msgInput}
//                     onChange={(e) => setMsgInput(e.target.value)}
//                     onKeyDown={(e) => {
//                       if (e.key === "Enter" && !e.shiftKey) {
//                         e.preventDefault();
//                         sendMsg();
//                       }
//                     }}
//                   />
//                   <button style={S.sendBtn} onClick={sendMsg}>
//                     <Send size={16} />
//                   </button>
//                 </div>
//               </div>
//             )}

//             {sidebarTab === "people" && (
//               <div style={S.peopleList}>
//                 {participants.map((p) => (
//                   <PersonRow
//                     key={p.identity}
//                     name={p.isLocal ? "You (Me)" : p.name}
//                     isHost={p.isHost}
//                     self={p.isLocal}
//                     handRaised={
//                       p.isLocal ? handRaised : !!raisedHands[p.identity]
//                     }
//                     S={S}
//                   />
//                 ))}
//                 {participants.length <= 1 && (
//                   <p style={S.emptyPpl}>No one else has joined yet</p>
//                 )}
//               </div>
//             )}

//             {sidebarTab === "waiting" && isHost && (
//               <div style={{ ...S.peopleList, paddingTop: 12 }}>
//                 <WaitingRoomPanel
//                   waiting={waiting}
//                   onAdmit={handleAdmit}
//                   onDeny={handleDeny}
//                   onAdmitAll={handleAdmitAll}
//                   S={S}
//                 />
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {settingsOpen && (
//         <div style={S.settingsOverlay} onClick={() => setSettingsOpen(false)}>
//           <div style={S.settingsPanel} onClick={(e) => e.stopPropagation()}>
//             <div style={S.settingsHead}>
//               <span style={{ fontWeight: 700, fontSize: 14 }}>Settings</span>
//               <button style={S.closeBtn} onClick={() => setSettingsOpen(false)}>
//                 <X size={16} />
//               </button>
//             </div>
//             <div style={S.settingsBody}>
//               <div style={S.settingsRow}>
//                 <span>Theme</span>
//                 <div style={S.themeSwitch}>
//                   <button
//                     style={{
//                       ...S.themeSwitchBtn,
//                       ...(theme === "dark" ? S.themeSwitchBtnOn : {}),
//                     }}
//                     onClick={() => setTheme("dark")}
//                     aria-pressed={theme === "dark"}
//                   >
//                     <Moon size={13} /> Dark
//                   </button>
//                   <button
//                     style={{
//                       ...S.themeSwitchBtn,
//                       ...(theme === "light" ? S.themeSwitchBtnOn : {}),
//                     }}
//                     onClick={() => setTheme("light")}
//                     aria-pressed={theme === "light"}
//                   >
//                     <Sun size={13} /> Light
//                   </button>
//                 </div>
//               </div>
//               <div style={S.settingsRow}>
//                 <span>Live captions</span>
//                 <button
//                   style={{
//                     ...S.settingsToggle,
//                     ...(captionsOn ? S.settingsToggleOn : {}),
//                   }}
//                   onClick={() => setCaptionsOn((v) => !v)}
//                 >
//                   {captionsOn ? "On" : "Off"}
//                 </button>
//               </div>
//               <div style={S.settingsRow}>
//                 <span>Meeting link</span>
//                 <button style={S.settingsToggle} onClick={copyLink}>
//                   Copy
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── control bar ── */}
//       <div
//         style={S.ctrlBar}
//         className="im-ctrlbar"
//         role="toolbar"
//         aria-label="Meeting controls"
//       >
//         <Btn
//           icon={micOn ? <Mic size={18} /> : <MicOff size={18} />}
//           label="Mic"
//           danger={!micOn}
//           onClick={toggleMic}
//           pressed={micOn}
//           S={S}
//         />
//         <Btn
//           icon={camOn ? <Video size={18} /> : <VideoOff size={18} />}
//           label="Camera"
//           danger={!camOn}
//           onClick={toggleCam}
//           pressed={camOn}
//           S={S}
//         />
//         <Btn
//           icon={screenOn ? <MonitorOff size={18} /> : <MonitorUp size={18} />}
//           label="Present"
//           active={screenOn}
//           disabled={!screenOn && !screenShareSupport.supported}
//           title={
//             !screenOn && !screenShareSupport.supported
//               ? screenShareSupport.message
//               : undefined
//           }
//           onClick={toggleScreen}
//           pressed={screenOn}
//           S={S}
//         />
//         <Btn
//           icon={<Hand size={18} />}
//           label="Raise Hand"
//           active={handRaised}
//           onClick={toggleHandRaise}
//           pressed={handRaised}
//           S={S}
//         />
//         <div style={{ position: "relative" }}>
//           <Btn
//             btnRef={reactionBtnRef}
//             icon={<SmilePlus size={18} />}
//             label="React"
//             active={reactionPickerOpen}
//             onClick={() => {
//               const rect = reactionBtnRef.current?.getBoundingClientRect();
//               if (rect) {
//                 setReactionPos({
//                   left: rect.left + rect.width / 2,
//                   top: rect.top - 10,
//                 });
//               }
//               setReactionPickerOpen((v) => !v);
//             }}
//             ariaHasPopup="true"
//             ariaExpanded={reactionPickerOpen}
//             S={S}
//           />
//         </div>
//         <Btn
//           icon={<MessageSquare size={18} />}
//           label="Chat"
//           active={sidebarOpen && sidebarTab === "chat"}
//           onClick={() => openTab("chat")}
//           S={S}
//         />
//         <Btn
//           icon={<Users size={18} />}
//           label="People"
//           badge={participants.length || 1}
//           active={sidebarOpen && sidebarTab === "people"}
//           onClick={() => openTab("people")}
//           S={S}
//         />
//         {isHost && (
//           <Btn
//             icon={<Clock size={18} />}
//             label="Waiting"
//             badge={waiting.length || undefined}
//             active={sidebarOpen && sidebarTab === "waiting"}
//             onClick={() => openTab("waiting")}
//             S={S}
//           />
//         )}
//         <Btn
//           icon={<Settings size={18} />}
//           label="Settings"
//           active={settingsOpen}
//           onClick={() => setSettingsOpen((v) => !v)}
//           S={S}
//         />
//         {isHost && (
//           <Btn
//             icon={<Disc2 size={18} />}
//             label={recToggling ? "Wait…" : "Record"}
//             active={recording}
//             onClick={toggleRecording}
//             pressed={recording}
//             S={S}
//           />
//         )}
//         <Btn
//           icon={<PictureInPicture2 size={18} />}
//           label="PiP"
//           active={!!pipWindow}
//           onClick={togglePiP}
//           pressed={!!pipWindow}
//           S={S}
//         />
//         <Btn
//           icon={<PhoneOff size={18} />}
//           label={isHost ? (isEnding ? "Ending…" : "End") : "Leave"}
//           leave
//           disabled={isHost && isEnding}
//           onClick={isHost ? handleEndForAll : handleLeave}
//           S={S}
//         />
//       </div>

//       <style>{`
//         [data-theme="dark"] {
//           --im-page:#050608; --im-panel:#0b0d12; --im-panel-elevated:#161b26;
//           --im-tile-bg:#12141a; --im-input-bg:#161922;
//           --im-surface3:#1c1f28;
//           --im-border:rgba(255,255,255,.08); --im-border-soft:rgba(255,255,255,.06);
//           --im-ghost-bg:rgba(255,255,255,.06); --im-ghost-bg-soft:rgba(255,255,255,.03);
//           --im-text:#f8fafc; --im-text-soft:#cbd5e1; --im-text-mute:#64748b; --im-text-mute2:#94a3b8;
//           --im-scrollbar: rgba(255,255,255,.2);
//         }
//         [data-theme="light"] {
//           --im-page:#eef1f6; --im-panel:#ffffff; --im-panel-elevated:#ffffff;
//           --im-tile-bg:#e4e8f0; --im-input-bg:#f1f3f8;
//           --im-surface3:#eef0f5;
//           --im-border:rgba(15,23,42,.12); --im-border-soft:rgba(15,23,42,.08);
//           --im-ghost-bg:rgba(15,23,42,.05); --im-ghost-bg-soft:rgba(15,23,42,.035);
//           --im-text:#0f172a; --im-text-soft:#334155; --im-text-mute:#94a3b8; --im-text-mute2:#64748b;
//           --im-scrollbar: rgba(15,23,42,.22);
//         }
//         .im-root[data-theme="light"] .im-stage,
//         .im-root[data-theme="light"] .im-grid-tile,
//         .im-root[data-theme="light"] .im-strip-tile { box-shadow: 0 4px 18px rgba(15,23,42,.10); }
//         .im-root[data-theme="light"] input::placeholder { color: #94a3b8; }

//         @keyframes soundWave { 0%,100%{ height:3px } 50%{ height:11px } }
//         .im-wave { display:flex; align-items:flex-end; gap:2px; height:12px; }
//         .im-wave span { width:2.5px; border-radius:2px; background:#34d399; display:block; animation: soundWave .7s ease-in-out infinite; }
//         .im-wave span:nth-child(2) { animation-delay:.12s }
//         .im-wave span:nth-child(3) { animation-delay:.24s }

//         .im-resize-handle { cursor: col-resize; }
//         .im-resize-handle:hover, .im-resize-handle.im-resizing { background: rgba(109,94,247,.35) !important; }
//         .im-toast-stack { position: fixed; top: 70px; right: 16px; z-index: 9998; display:flex; flex-direction:column; gap:8px; pointer-events:none; max-width: calc(100vw - 32px); }
//         @media (max-width: 640px) {
//           .im-toast-stack { left: 16px; right: 16px; align-items: center; }
//         }

//         @keyframes livePulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(1.5)} }
//         @keyframes recBlink  { 0%,100%{opacity:1} 50%{opacity:.2} }
//         @keyframes slideIn   { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
//         @keyframes slideUp   { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
//         @keyframes fadeIn    { from{opacity:0} to{opacity:1} }
//         @keyframes toastIn   { from{opacity:0;transform:translateX(-50%) translateY(-12px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
//         @keyframes fadeScaleIn { from{opacity:0;transform:scale(0.96)} to{opacity:1;transform:scale(1)} }
//         @keyframes floatUp { 0%{opacity:0;transform:translateY(0) scale(0.6)} 15%{opacity:1;transform:translateY(-20px) scale(1)} 100%{opacity:0;transform:translateY(-160px) scale(1.1)} }
//         @keyframes speakGlow { 0%,100%{ box-shadow: 0 0 0 2px rgba(52,211,153,.55), 0 0 22px 2px rgba(52,211,153,.28); } 50%{ box-shadow: 0 0 0 2px rgba(52,211,153,.85), 0 0 32px 6px rgba(52,211,153,.4); } }
//         @keyframes imspin { to { transform: rotate(360deg); } }
//         .im-spin { animation: imspin 1s linear infinite; }

//         .im-root, .im-root * { box-sizing: border-box; }
//         .im-root { max-width: 100vw; }
//         .im-strip-tile, .im-stage, .im-grid-tile { transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease; }
//         .im-strip-tile:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0,0,0,.35); }
//         .im-strip-tile-active { border: 2px solid #6d5ef7 !important; }
//         .im-speaking { animation: speakGlow 1.6s ease-in-out infinite; border-color: rgba(52,211,153,.6) !important; }
//         .im-ctrl-btn { transition: all .16s ease; min-width: 48px; min-height: 48px; }
//         .im-ctrl-btn:active { transform: scale(.94); }
//         .im-sidebar { animation: slideIn .22s ease; }
//         .im-stage { animation: fadeScaleIn .25s ease; }
//         .im-reaction-badge { animation: fadeScaleIn .2s ease; }
//         .im-sidebar-backdrop { display: none; }
//         .im-btn-label { display: inline; }
//         .im-btn-label-inline { display: inline; }

//         .im-root button:focus { outline: none; }
//         .im-root button:focus-visible, .im-root input:focus-visible { outline: 2px solid #8b7dfb; outline-offset: 2px; border-radius: 6px; }

//         .im-filmstrip { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,.18) transparent; }
//         .im-ctrlbar { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,.22) transparent; }
//         .im-mobile-stack { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,.18) transparent; overflow-y: auto; }

//         @media (max-width: 1439px) { .im-sidebar { width: 320px !important; } }
//         @media (max-width: 1199px) { .im-sidebar { width: 300px !important; } .im-ctrl-btn { padding: 9px 14px !important; } }
//         @media (max-width: 1023px) {
//           .im-mainarea { position: relative; }
//           .im-grid { grid-template-columns: repeat(var(--cols-tablet, 3), minmax(0, 1fr)) !important; }
//           .im-sidebar { position: absolute !important; top:0; right:0; bottom:0; width: min(320px, 88vw) !important; z-index: 40; box-shadow: -12px 0 32px rgba(0,0,0,.45); animation: slideIn .22s ease; }
//           .im-sidebar-backdrop { display: block; position: absolute; inset: 0; background: rgba(0,0,0,.35); z-index: 30; animation: fadeIn .18s ease; }
//           .im-handle { display: none !important; }
//         }
//         @media (max-width: 767px) {
//           .im-sidebar { width: 100% !important; max-width: 100% !important; }
//           .im-sessionname { display: none; }
//           .im-stage { border-radius: 12px !important; }
//           .im-grid { grid-template-columns: repeat(var(--cols-phone, 2), minmax(0, 1fr)) !important; }
//         }
//         @media (max-width: 899px) {
//           .im-topbar { padding: 8px 12px !important; }
//           .im-ctrlbar { padding: 10px 14px !important; }
//           .im-ctrl-btn { padding: 8px 12px !important; }
//           .im-stagecolumn { padding: 10px !important; gap: 8px !important; }
//         }
//         @media (max-width: 599px) {
//           .im-topbar { flex-wrap: wrap; row-gap: 6px; }
//           .im-topright { order: 3; width: 100%; justify-content: flex-start; }
//           .im-ctrlbar {
//             padding: 8px 6px !important;
//             gap: 6px !important;
//             row-gap: 8px !important;
//             overflow-x: visible !important;
//             flex-wrap: wrap !important;
//             justify-content: center !important;
//           }
//           .im-btn-label, .im-btn-label-inline { display: none !important; }
//           .im-ctrl-btn { padding: 10px !important; border-radius: 12px !important; }
//         }
//         @media (max-width: 430px) {
//           .im-ctrlbar {
//             gap: 5px !important;
//             row-gap: 8px !important;
//           }
//           .im-ctrl-btn { padding: 9px !important; min-width: 42px; min-height: 42px; }
//         }
//         @media (prefers-reduced-motion: reduce) {
//           .im-root * { animation-duration: .001ms !important; animation-iteration-count: 1 !important; transition-duration: .001ms !important; }
//         }
//       `}</style>
//     </div>
//   );
// }

// /* ═════════════════════════════════════════════════════════════════
//    PRE-JOIN / LOBBY STYLES
// ═════════════════════════════════════════════════════════════════ */
// const PJ = {
//   root: {
//     position: "fixed",
//     inset: 0,
//     background: "#fdf3e8",
//     overflowY: "auto",
//     overflowX: "hidden",
//     fontFamily: "'Inter','Segoe UI',sans-serif",
//     zIndex: 9999,
//   },
//   blobTopRight: {
//     position: "fixed",
//     top: -80,
//     right: -60,
//     width: 260,
//     height: 260,
//     borderRadius: "50%",
//     background:
//       "radial-gradient(circle, rgba(251,146,60,.16) 0%, rgba(251,146,60,0) 70%)",
//     pointerEvents: "none",
//   },
//   blobBottomLeft: {
//     position: "fixed",
//     bottom: -100,
//     left: -80,
//     width: 300,
//     height: 300,
//     borderRadius: "50%",
//     background:
//       "radial-gradient(circle, rgba(251,146,60,.14) 0%, rgba(251,146,60,0) 70%)",
//     pointerEvents: "none",
//   },
//   page: {
//     position: "relative",
//     maxWidth: 1180,
//     margin: "0 auto",
//     padding: "36px 24px 56px",
//   },
//   header: {
//     textAlign: "center",
//     marginBottom: 34,
//   },
//   brandRow: {
//     display: "flex",
//     justifyContent: "center",
//     marginBottom: 18,
//   },
//   brandLogo: { height: 30, width: "auto", objectFit: "contain" },
//   pageTitle: {
//     fontSize: 34,
//     fontWeight: 800,
//     color: "#0f172a",
//     margin: "0 0 8px",
//     letterSpacing: -0.5,
//   },
//   pageTitleAccent: { color: "#f97316" },
//   pageSubtitle: { fontSize: 15, color: "#64748b", margin: 0 },

//   card: {
//     display: "flex",
//     gap: 28,
//     maxWidth: 1080,
//     width: "100%",
//     margin: "0 auto",
//     flexWrap: "wrap",
//     alignItems: "flex-start",
//     justifyContent: "center",
//   },
//   leftCol: {
//     display: "flex",
//     flexDirection: "column",
//     gap: 16,
//     width: 460,
//     maxWidth: "100%",
//   },
//   previewBox: {
//     position: "relative",
//     width: "100%",
//     aspectRatio: "16/10",
//     background: "#e9edf3",
//     borderRadius: 20,
//     overflow: "hidden",
//     border: "1px solid rgba(15,23,42,.06)",
//     boxShadow: "0 16px 40px rgba(15,23,42,.08)",
//   },
//   previewAvatarWrap: {
//     position: "absolute",
//     inset: 0,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     background: "#eef1f5",
//   },
//   previewAvatar: {
//     width: 96,
//     height: 96,
//     borderRadius: "50%",
//     background: "linear-gradient(135deg,#fb923c,#f97316)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontSize: 34,
//     fontWeight: 800,
//     color: "#fff",
//   },
//   previewWatermark: {
//     position: "absolute",
//     top: 14,
//     right: 16,
//     height: 22,
//     width: "auto",
//     opacity: 0.92,
//   },
//   previewCtrls: {
//     position: "absolute",
//     bottom: 14,
//     left: "50%",
//     transform: "translateX(-50%)",
//     display: "flex",
//     alignItems: "center",
//     gap: 14,
//     background: "rgba(15,17,23,.62)",
//     backdropFilter: "blur(6px)",
//     borderRadius: 999,
//     padding: "9px 20px",
//   },
//   previewCtrlsDivider: {
//     width: 1,
//     height: 16,
//     background: "rgba(255,255,255,.25)",
//   },
//   previewPillBtn: {
//     display: "flex",
//     alignItems: "center",
//     gap: 7,
//     border: "none",
//     background: "transparent",
//     color: "#f1f5f9",
//     fontSize: 13,
//     fontWeight: 600,
//     fontFamily: "inherit",
//     cursor: "pointer",
//     padding: 0,
//   },
//   secureBanner: {
//     display: "flex",
//     alignItems: "flex-start",
//     gap: 12,
//     background: "#fffdfb",
//     border: "1px solid rgba(15,23,42,.06)",
//     borderRadius: 16,
//     padding: "14px 16px",
//     boxShadow: "0 10px 24px rgba(15,23,42,.05)",
//   },
//   secureIconWrap: {
//     width: 34,
//     height: 34,
//     borderRadius: "50%",
//     background: "rgba(249,115,22,.12)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     flexShrink: 0,
//   },
//   secureTitle: {
//     fontSize: 13.5,
//     fontWeight: 700,
//     color: "#0f172a",
//     margin: "2px 0 3px",
//   },
//   secureSubtitle: { fontSize: 12.5, color: "#94a3b8", margin: 0 },

//   infoCol: {
//   width: 380,
//   maxWidth: "100%",
//   color: "#0f172a",
//   background: "#fffdfb",
//   border: "1px solid rgba(15,23,42,.06)",
//   borderRadius: 20,
//   padding: "26px 26px 22px",
//   boxShadow: "0 16px 40px rgba(15,23,42,.08)",
//   overflow: "hidden",
//   boxSizing: "border-box",
// },
//   title: {
//   fontSize: 20,
//   fontWeight: 800,
//   margin: "0 0 8px",
//   textAlign: "center",
//   wordBreak: "break-word",
//   overflowWrap: "anywhere",
// },
//   subtitle: {
//     fontSize: 13,
//     color: "#64748b",
//     margin: "0 0 4px",
//     textAlign: "center",
//   },
//   code: {
//     fontSize: 12.5,
//     color: "#64748b",
//     margin: "0 0 18px",
//     textAlign: "center",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 8,
//   },
//   copyBtn: {
//     display: "inline-flex",
//     alignItems: "center",
//     justifyContent: "center",
//     border: "none",
//     background: "rgba(15,23,42,.06)",
//     color: "#64748b",
//     borderRadius: 6,
//     width: 22,
//     height: 22,
//     cursor: "pointer",
//   },
//   sectionHeading: {
//   textAlign: "center",
//   marginBottom: 18,
//   paddingBottom: 12,
//   borderBottom: "1px solid rgba(15,23,42,.08)",
// },
// sectionHeadingText: {
//   fontSize: 15,
//   fontWeight: 800,
//   color: "#0f172a",
//   margin: "0 0 8px",
// },
// sectionHeadingDash: {
//   display: "flex",
//   justifyContent: "center",
//   gap: 6,
// },
// dashOrange: {
//   width: 36,
//   height: 3,
//   borderRadius: 2,
//   background: "#f97316",
//   display: "inline-block",
// },
//   label: {
//     fontSize: 12,
//     fontWeight: 700,
//     color: "#334155",
//     marginBottom: 6,
//     display: "block",
//   },
//   input: {
//     width: "100%",
//     background: "#fbfaf8",
//     border: "1px solid rgba(15,23,42,.12)",
//     borderRadius: 12,
//     padding: "11px 14px",
//     color: "#0f172a",
//     fontSize: 14,
//     marginBottom: 14,
//     outline: "none",
//     fontFamily: "inherit",
//   },
//   warnText: {
//     display: "flex",
//     alignItems: "center",
//     gap: 6,
//     fontSize: 11,
//     color: "#b45309",
//     marginBottom: 10,
//   },
//   errText: { fontSize: 12, color: "#dc2626", marginBottom: 10 },
//   joinBtn: {
//     width: "100%",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 8,
//     background: "linear-gradient(135deg,#fb923c,#f97316)",
//     color: "#fff",
//     border: "none",
//     borderRadius: 14,
//     padding: "13px 0",
//     fontSize: 14,
//     fontWeight: 700,
//     cursor: "pointer",
//     boxShadow: "0 10px 24px rgba(249,115,22,.35)",
//   },
//   hint: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 6,
//     fontSize: 11.5,
//     color: "#94a3b8",
//     marginTop: 12,
//     textAlign: "center",
//   },
// };

// const LB = {
//   card: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     gap: 12,
//     textAlign: "center",
//     maxWidth: 380,
//     color: "#e2e8f0",
//     fontFamily: "'Inter','Segoe UI',sans-serif",
//   },
//   pulseWrap: {
//     position: "relative",
//     width: 60,
//     height: 60,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   pulseDot: {
//     position: "absolute",
//     inset: 0,
//     borderRadius: "50%",
//     background: "rgba(147,197,253,.14)",
//     animation: "livePulse 1.6s ease-in-out infinite",
//   },
//   title: { fontSize: 18, fontWeight: 800, margin: 0, color: "#fff" },
//   subtitle: { fontSize: 13, color: "#94a3b8", margin: 0 },
//   cancelBtn: {
//     marginTop: 10,
//     background: "rgba(255,255,255,.06)",
//     border: "1px solid rgba(255,255,255,.1)",
//     color: "#cbd5e1",
//     borderRadius: 12,
//     padding: "9px 20px",
//     fontSize: 13,
//     fontWeight: 700,
//     cursor: "pointer",
//   },
// };

// /* ═════════════════════════════════════════════════════════════════
//    MEETING ROOM STYLES (mirrors LiveRoom.jsx's design language)
// ═════════════════════════════════════════════════════════════════ */
// const IM_STYLES = {
//   root: {
//     display: "flex",
//     flexDirection: "column",
//     height: "100vh",
//     width: "100%",
//     background: "var(--im-page)",
//     fontFamily: "'Inter','Segoe UI',sans-serif",
//     color: "var(--im-text-soft)",
//     overflow: "hidden",
//   },
//   toast: {
//     position: "fixed",
//     top: 16,
//     left: "50%",
//     transform: "translateX(-50%)",
//     zIndex: 99999,
//     display: "flex",
//     alignItems: "center",
//     gap: 12,
//     padding: "14px 24px",
//     borderRadius: 14,
//     background: "linear-gradient(135deg,#dc2626,#f43f5e)",
//     color: "#fff",
//     boxShadow: "0 8px 32px rgba(244,63,94,.5)",
//     animation: "toastIn .35s ease",
//     minWidth: 280,
//   },
//   noticePill: {
//     display: "flex",
//     alignItems: "center",
//     gap: 8,
//     padding: "9px 14px",
//     borderRadius: 10,
//     background: "var(--im-panel-elevated)",
//     border: "1px solid var(--im-border)",
//     borderLeft: "3px solid var(--im-border)",
//     color: "var(--im-text-soft)",
//     fontSize: 12,
//     fontWeight: 600,
//     boxShadow: "0 8px 24px rgba(0,0,0,.35)",
//     animation: "toastIn .3s ease",
//     pointerEvents: "none",
//     maxWidth: 280,
//   },
//   noticePillJoin: { borderLeft: "3px solid #34d399" },
//   noticePillLeave: { borderLeft: "3px solid #f87171" },

//   topBar: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: "12px 20px",
//     background: "var(--im-panel)",
//     borderBottom: "1px solid var(--im-border-soft)",
//     flexShrink: 0,
//     flexWrap: "wrap",
//     gap: 8,
//   },
//   topLeft: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" },
//   topRight: {
//     display: "flex",
//     alignItems: "center",
//     gap: 10,
//     flexWrap: "wrap",
//   },
//   liveBadge: {
//     display: "flex",
//     alignItems: "center",
//     gap: 6,
//     background: "rgba(239,68,68,.14)",
//     border: "1px solid rgba(239,68,68,.28)",
//     borderRadius: 8,
//     padding: "5px 10px",
//     fontSize: 11,
//     fontWeight: 800,
//     letterSpacing: 1.2,
//     color: "#ef4444",
//   },
//   liveDot: {
//     width: 7,
//     height: 7,
//     borderRadius: "50%",
//     background: "#ef4444",
//     animation: "livePulse 1.2s ease-in-out infinite",
//     display: "inline-block",
//   },
//   recBadge: {
//     display: "flex",
//     alignItems: "center",
//     gap: 5,
//     background: "rgba(127,29,29,.35)",
//     border: "1px solid rgba(248,113,113,.25)",
//     borderRadius: 8,
//     padding: "5px 10px",
//     fontSize: 11,
//     fontWeight: 700,
//     color: "#fca5a5",
//     animation: "recBlink 2s infinite",
//   },
//   timerBadge: {
//     display: "flex",
//     alignItems: "center",
//     gap: 6,
//     fontSize: 12,
//     fontWeight: 600,
//     color: "var(--im-text-soft)",
//     background: "var(--im-ghost-bg)",
//     borderRadius: 8,
//     padding: "5px 10px",
//     fontVariantNumeric: "tabular-nums",
//   },
//   sessionName: {
//     fontSize: 15,
//     fontWeight: 700,
//     color: "var(--im-text)",
//     marginLeft: 2,
//   },
//   logoImg: {
//   height: 30,
//   width: "auto",
//   maxWidth: 130,
//   objectFit: "contain",
//   flexShrink: 0,
//   display: "block",
// },
//   peopleCountBadge: {
//     display: "flex",
//     alignItems: "center",
//     gap: 6,
//     fontSize: 12,
//     fontWeight: 600,
//     color: "var(--im-text-soft)",
//     background: "var(--im-ghost-bg)",
//     borderRadius: 8,
//     padding: "6px 10px",
//   },
//   connBadge: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     borderRadius: 8,
//     padding: "6px 9px",
//   },
//   connOn: {
//     background: "rgba(34,197,94,.12)",
//     border: "1px solid rgba(34,197,94,.28)",
//     color: "#22c55e",
//   },
//   connOff: {
//     background: "rgba(100,116,139,.1)",
//     border: "1px solid rgba(100,116,139,.2)",
//     color: "var(--im-text-mute2)",
//   },
//   // FIX (mobile screen-share bug): compact top-bar status pill, shown
//   // only on phone, so the screen-share availability state is visible
//   // at a glance (matches the reference mobile UI's icon in the row).
//   screenStatusPill: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     borderRadius: 8,
//     padding: "6px 9px",
//     background: "var(--im-ghost-bg)",
//     border: "1px solid var(--im-border)",
//     color: "var(--im-text-mute2)",
//   },
//   screenStatusPillOn: {
//     background: "rgba(37,99,235,.16)",
//     border: "1px solid rgba(96,165,250,.32)",
//     color: "#93c5fd",
//   },
//   screenStatusPillBlocked: {
//     background: "rgba(239,68,68,.14)",
//     border: "1px solid rgba(239,68,68,.4)",
//     color: "#f87171",
//   },
//   endSessionBtn: {
//     display: "flex",
//     alignItems: "center",
//     gap: 6,
//     background: "#ef4444",
//     color: "#fff",
//     border: "none",
//     borderRadius: 10,
//     padding: "9px 16px",
//     fontSize: 12,
//     fontWeight: 700,
//     cursor: "pointer",
//     boxShadow: "0 4px 14px rgba(239,68,68,.35)",
//   },
//   iconGhostBtn: {
//     background: "var(--im-ghost-bg)",
//     border: "1px solid var(--im-border)",
//     borderRadius: 9,
//     padding: 8,
//     color: "var(--im-text-mute2)",
//     cursor: "pointer",
//     display: "flex",
//   },
//   dropMenu: {
//     position: "absolute",
//     top: "calc(100% + 8px)",
//     right: 0,
//     background: "var(--im-panel-elevated)",
//     border: "1px solid var(--im-border)",
//     borderRadius: 12,
//     padding: 6,
//     minWidth: 190,
//     boxShadow: "0 12px 32px rgba(0,0,0,.5)",
//     zIndex: 50,
//     display: "flex",
//     flexDirection: "column",
//     gap: 2,
//   },
//   dropMenuItem: {
//     display: "flex",
//     alignItems: "center",
//     gap: 8,
//     background: "none",
//     border: "none",
//     color: "var(--im-text-soft)",
//     fontSize: 12,
//     fontWeight: 600,
//     padding: "8px 10px",
//     borderRadius: 8,
//     cursor: "pointer",
//     textAlign: "left",
//   },

//   reactionPicker: {
//     position: "absolute",
//     bottom: "calc(100% + 10px)",
//     left: "50%",
//     transform: "translateX(-50%)",
//     display: "flex",
//     gap: 4,
//     padding: "8px 10px",
//     background: "var(--im-panel-elevated)",
//     border: "1px solid var(--im-border)",
//     borderRadius: 999,
//     boxShadow: "0 12px 32px rgba(0,0,0,.5)",
//     zIndex: 50,
//     animation: "slideUp .16s ease",
//   },
//   reactionPickerBtn: {
//     width: 36,
//     height: 36,
//     border: "none",
//     background: "transparent",
//     fontSize: 19,
//     cursor: "pointer",
//     borderRadius: "50%",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   ctrlBadge: {
//     position: "absolute",
//     top: -4,
//     right: -4,
//     background: "#6d5ef7",
//     color: "#fff",
//     fontSize: 9,
//     fontWeight: 800,
//     borderRadius: 8,
//     padding: "1px 5px",
//     border: "2px solid var(--im-panel)",
//     lineHeight: 1.3,
//   },

//   mainArea: {
//     flex: 1,
//     display: "flex",
//     overflow: "hidden",
//     position: "relative",
//     minWidth: 0,
//   },
//   stageColumn: {
//     flex: 1,
//     display: "flex",
//     flexDirection: "column",
//     gap: 14,
//     padding: 18,
//     overflow: "hidden",
//     minWidth: 0,
//     position: "relative",
//     maxWidth: 1800,
//     width: "100%",
//     margin: "0 auto",
//   },
//   stageOuter: {
//     flex: 1,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     minHeight: 0,
//     minWidth: 0,
//     overflow: "hidden",
//   },
//   stage: {
//     position: "relative",
//     background: "var(--im-tile-bg)",
//     borderRadius: 22,
//     overflow: "hidden",
//     border: "1px solid var(--im-border)",
//     boxShadow: "0 16px 44px rgba(0,0,0,.38)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     aspectRatio: "16/9",
//     height: "100%",
//     width: "auto",
//     maxWidth: "100%",
//     maxHeight: "100%",
//   },
//   stageEmpty: { color: "var(--im-text-mute)", fontSize: 13, fontWeight: 500 },
//   stageAvatarWrap: {
//     position: "absolute",
//     inset: 0,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     background: "var(--im-tile-bg)",
//   },
//   stageAvatar: {
//     width: 108,
//     height: 108,
//     borderRadius: "50%",
//     background: "linear-gradient(135deg,#6d5ef7,#8b5cf6)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontSize: 40,
//     fontWeight: 800,
//     color: "#fff",
//     boxShadow: "0 10px 40px rgba(109,94,247,.35)",
//   },
//   stageNameTag: {
//     position: "absolute",
//     bottom: 16,
//     left: 16,
//     display: "flex",
//     alignItems: "center",
//     gap: 7,
//     fontSize: 13,
//     fontWeight: 600,
//     color: "#fff",
//     background: "rgba(10,12,18,.72)",
//     borderRadius: 9,
//     padding: "6px 12px",
//   },
//   stageHostTag: {
//     position: "absolute",
//     top: 16,
//     right: 16,
//     fontSize: 12,
//     fontWeight: 700,
//     color: "#93c5fd",
//     background: "rgba(37,99,235,.22)",
//     border: "1px solid rgba(96,165,250,.25)",
//     borderRadius: 8,
//     padding: "4px 12px",
//   },
//   stageHandBadge: {
//     position: "absolute",
//     top: 60,
//     left: 16,
//     display: "flex",
//     alignItems: "center",
//     gap: 6,
//     fontSize: 11,
//     fontWeight: 700,
//     color: "#1a1a1a",
//     background: "#fbbf24",
//     borderRadius: 8,
//     padding: "5px 10px",
//     boxShadow: "0 4px 14px rgba(251,191,36,.4)",
//     animation: "recBlink 1.4s infinite",
//   },
//   stageReactionBadge: {
//     position: "absolute",
//     bottom: 16,
//     right: 16,
//     fontSize: 30,
//     lineHeight: 1,
//     filter: "drop-shadow(0 4px 10px rgba(0,0,0,.4))",
//     pointerEvents: "none",
//   },
//   screenLabel: {
//     position: "absolute",
//     top: 16,
//     left: 16,
//     display: "flex",
//     alignItems: "center",
//     gap: 6,
//     fontSize: 12,
//     fontWeight: 700,
//     color: "#fff",
//     background: "rgba(10,12,18,.72)",
//     borderRadius: 8,
//     padding: "5px 10px",
//   },
//   stageZoomBtn: {
//     position: "absolute",
//     top: 16,
//     right: 16,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     width: 34,
//     height: 34,
//     borderRadius: 9,
//     border: "1px solid rgba(255,255,255,.18)",
//     background: "rgba(10,12,18,.72)",
//     color: "#fff",
//     cursor: "pointer",
//   },
//   zoomOverlay: {
//     position: "fixed",
//     inset: 0,
//     zIndex: 9990,
//     background: "#000",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     animation: "fadeIn .18s ease",
//   },
//   zoomOverlayBar: {
//     position: "fixed",
//     top: 16,
//     left: "50%",
//     transform: "translateX(-50%)",
//     display: "flex",
//     alignItems: "center",
//     gap: 12,
//     background: "rgba(10,12,18,.78)",
//     border: "1px solid rgba(255,255,255,.14)",
//     borderRadius: 12,
//     padding: "8px 10px 8px 16px",
//   },
//   zoomOverlayLabel: {
//     display: "flex",
//     alignItems: "center",
//     gap: 7,
//     fontSize: 13,
//     fontWeight: 600,
//     color: "#e2e8f0",
//     whiteSpace: "nowrap",
//   },
//   zoomExitBtn: {
//     display: "flex",
//     alignItems: "center",
//     gap: 6,
//     background: "rgba(255,255,255,.1)",
//     border: "1px solid rgba(255,255,255,.18)",
//     color: "#fff",
//     borderRadius: 8,
//     padding: "7px 12px",
//     fontSize: 12,
//     fontWeight: 700,
//     cursor: "pointer",
//     whiteSpace: "nowrap",
//   },
//   captionsBar: {
//     display: "flex",
//     alignItems: "center",
//     gap: 8,
//     background: "rgba(10,12,18,.72)",
//     borderRadius: 10,
//     padding: "8px 14px",
//     fontSize: 12,
//     color: "var(--im-text-soft)",
//     flexShrink: 0,
//   },
//   presentingBar: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 10,
//     padding: "8px 16px",
//     background: "rgba(37,99,235,.16)",
//     borderBottom: "1px solid rgba(96,165,250,.25)",
//     color: "#93c5fd",
//     fontSize: 12,
//     fontWeight: 600,
//     flexShrink: 0,
//     flexWrap: "wrap",
//   },
//   presentingStopBtn: {
//     background: "#2563eb",
//     color: "#fff",
//     border: "none",
//     borderRadius: 8,
//     padding: "4px 12px",
//     fontSize: 11,
//     fontWeight: 700,
//     cursor: "pointer",
//   },
//   mediaErrorBar: {
//     display: "flex",
//     alignItems: "center",
//     gap: 10,
//     padding: "8px 16px",
//     background: "rgba(245,158,11,.16)",
//     borderBottom: "1px solid rgba(251,191,36,.3)",
//     color: "#fbbf24",
//     fontSize: 12,
//     fontWeight: 600,
//     flexShrink: 0,
//     flexWrap: "wrap",
//   },
//   mediaErrorClose: {
//     background: "none",
//     border: "none",
//     color: "#fbbf24",
//     cursor: "pointer",
//     display: "flex",
//     marginLeft: "auto",
//     padding: 2,
//   },
//   floaterLayer: {
//     position: "absolute",
//     inset: 0,
//     pointerEvents: "none",
//     overflow: "hidden",
//     zIndex: 40,
//   },
//   floater: {
//     position: "absolute",
//     bottom: 70,
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     gap: 2,
//     animation: "floatUp 2.4s ease-out forwards",
//   },
//   floaterEmoji: {
//     fontSize: 34,
//     filter: "drop-shadow(0 4px 10px rgba(0,0,0,.35))",
//   },
//   floaterName: {
//     fontSize: 10,
//     fontWeight: 700,
//     color: "#fff",
//     background: "rgba(0,0,0,.55)",
//     padding: "2px 7px",
//     borderRadius: 8,
//     whiteSpace: "nowrap",
//   },

//   filmstrip: {
//     flexShrink: 0,
//     display: "flex",
//     gap: 16,
//     padding: "2px 2px 6px",
//     overflowX: "auto",
//   },
//   stripTile: {
//     position: "relative",
//     flex: "0 0 auto",
//     width: "clamp(112px, 15vw, 220px)",
//     aspectRatio: "16/12.6",
//     background: "var(--im-tile-bg)",
//     borderRadius: 16,
//     overflow: "hidden",
//     border: "1px solid var(--im-border)",
//     boxShadow: "0 4px 14px rgba(0,0,0,.22)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   stripOverflow: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     background: "var(--im-ghost-bg)",
//     border: "1px solid var(--im-border)",
//     fontFamily: "inherit",
//     padding: 0,
//   },
//   stripAvatarWrap: {
//     position: "absolute",
//     inset: 0,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   stripAvatar: {
//     width: "40%",
//     aspectRatio: "1/1",
//     minWidth: 34,
//     maxWidth: 56,
//     borderRadius: "50%",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontSize: 17,
//     fontWeight: 800,
//     color: "#fff",
//   },
//   stripBadgeTopLeft: {
//     position: "absolute",
//     top: 8,
//     left: 8,
//     width: 20,
//     height: 20,
//     borderRadius: "50%",
//     background: "#fbbf24",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   stripMicDot: {
//     position: "absolute",
//     top: 8,
//     right: 8,
//     width: 20,
//     height: 20,
//     borderRadius: "50%",
//     background: "rgba(10,12,18,.72)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     color: "#fff",
//   },
//   stripName: {
//     position: "absolute",
//     bottom: 7,
//     left: 8,
//     fontSize: 11,
//     fontWeight: 600,
//     color: "#fff",
//     background: "rgba(10,12,18,.68)",
//     borderRadius: 6,
//     padding: "2px 8px",
//     maxWidth: "calc(100% - 14px)",
//     overflow: "hidden",
//     textOverflow: "ellipsis",
//     whiteSpace: "nowrap",
//   },
//   stripReactionBadge: {
//     position: "absolute",
//     bottom: 6,
//     right: 8,
//     fontSize: 18,
//     lineHeight: 1,
//     filter: "drop-shadow(0 2px 6px rgba(0,0,0,.4))",
//     pointerEvents: "none",
//   },

//   /* FIX (mobile UI): full-width stacked participant list, one card per
//      row, used only when isCompactDevice (phone) is true. */
//   mobileStackWrap: {
//     flex: 1,
//     display: "flex",
//     flexDirection: "column",
//     gap: 14,
//     overflowY: "auto",
//     paddingBottom: 4,
//   },
//   mobileTile: {
//   position: "relative",
//   width: "100%",
//   aspectRatio: "16/9",     // ✅ fixed, deterministic height
//   flexShrink: 0,
//   background: "var(--im-tile-bg)",
//   borderRadius: 20,
//   overflow: "hidden",
//   border: "1px solid var(--im-border)",
//   boxShadow: "0 8px 24px rgba(0,0,0,.3)",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
// },
//   mobileTileActive: {
//     border: "2px solid #6d5ef7",
//   },
//   mobileTileAvatarWrap: {
//     position: "absolute",
//     inset: 0,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   mobileTileAvatar: {
//     width: 96,
//     height: 96,
//     borderRadius: "50%",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontSize: 34,
//     fontWeight: 800,
//     color: "#fff",
//   },
//   mobileTileTopLeft: {
//     position: "absolute",
//     top: 10,
//     left: 10,
//     display: "flex",
//     gap: 6,
//   },
//   mobileTileIconPill: {
//     width: 26,
//     height: 26,
//     borderRadius: "50%",
//     background: "rgba(10,12,18,.72)",
//     color: "#fff",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   mobileTileMenuBtn: {
//     position: "absolute",
//     top: 10,
//     right: 10,
//     width: 30,
//     height: 30,
//     borderRadius: "50%",
//     background: "rgba(10,12,18,.55)",
//     border: "none",
//     color: "#fff",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     cursor: "pointer",
//   },
//   mobileTileName: {
//     position: "absolute",
//     bottom: 10,
//     left: 10,
//     fontSize: 12,
//     fontWeight: 600,
//     color: "#fff",
//     background: "rgba(10,12,18,.68)",
//     borderRadius: 8,
//     padding: "4px 10px",
//     maxWidth: "calc(100% - 20px)",
//     overflow: "hidden",
//     textOverflow: "ellipsis",
//     whiteSpace: "nowrap",
//   },
//   mobileTileReactionBadge: {
//     position: "absolute",
//     bottom: 10,
//     right: 46,
//     fontSize: 26,
//     lineHeight: 1,
//     filter: "drop-shadow(0 3px 8px rgba(0,0,0,.4))",
//     pointerEvents: "none",
//   },

//   /* FIX (Bug 2 — UI redesign to match Google Meet, image 3):
//      Previously this used `gridAutoRows: "1fr"` inside a flex:1 container,
//      which forces every tile to stretch and fill 100% of the available
//      vertical space regardless of aspect ratio — that's exactly why the
//      tiles in the bug screenshots looked like tall, edge-to-edge stretched
//      rectangles instead of proportioned Meet-style cards.
//      Now: tiles keep a fixed, video-like aspect ratio (see gridTile below),
//      rows size to their content ("auto") instead of stretching, and the
//      whole grid is centered within the available space with breathing
//      room around it — matching Meet's centered, card-like tile layout. */
//   gridWrap: {
//     flex: 1,
//     display: "grid",
//     gridAutoRows: "min-content",
//     gap: 14,
//     minHeight: 0,
//     minWidth: 0,
//     overflow: "auto",
//     alignContent: "center",
//     justifyContent: "center",
//     padding: "4px 2px",
//   },
//   gridCellOuter: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     minHeight: 0,
//     minWidth: 0,
//   },
//   gridTile: {
//     position: "relative",
//     background: "var(--im-tile-bg)",
//     borderRadius: 18,
//     overflow: "hidden",
//     border: "1px solid var(--im-border)",
//     boxShadow: "0 8px 24px rgba(0,0,0,.3)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     aspectRatio: "4/3",
//     width: "100%",
//     maxWidth: "min(46vw, 420px)",
//     maxHeight: "min(56vh, 420px)",
//   },
//   gridAvatar: {
//     width: "26%",
//     aspectRatio: "1/1",
//     minWidth: 40,
//     maxWidth: 96,
//     borderRadius: "50%",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontSize: "clamp(16px,3vw,32px)",
//     fontWeight: 800,
//     color: "#fff",
//   },
//   gridNameTag: {
//     position: "absolute",
//     bottom: 10,
//     left: 10,
//     display: "flex",
//     alignItems: "center",
//     gap: 6,
//     fontSize: 12,
//     fontWeight: 600,
//     color: "#fff",
//     background: "rgba(10,12,18,.72)",
//     borderRadius: 8,
//     padding: "4px 9px",
//     maxWidth: "calc(100% - 20px)",
//     overflow: "hidden",
//   },
//   gridHostTag: {
//     position: "absolute",
//     top: 10,
//     right: 10,
//     fontSize: 10,
//     fontWeight: 700,
//     color: "#93c5fd",
//     background: "rgba(37,99,235,.22)",
//     border: "1px solid rgba(96,165,250,.25)",
//     borderRadius: 6,
//     padding: "3px 8px",
//   },
//   gridHandBadge: {
//     position: "absolute",
//     top: 10,
//     left: 10,
//     width: 24,
//     height: 24,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     background: "#fbbf24",
//     borderRadius: "50%",
//   },
//   gridReactionBadge: {
//     position: "absolute",
//     bottom: 10,
//     right: 10,
//     fontSize: 22,
//     lineHeight: 1,
//     filter: "drop-shadow(0 3px 8px rgba(0,0,0,.4))",
//     pointerEvents: "none",
//   },

//   handle: {
//     width: 6,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     background: "var(--im-border)",
//     border: "none",
//     cursor: "col-resize",
//     flexShrink: 0,
//     padding: 0,
//     touchAction: "none",
//   },
//   sidebar: {
//     width: 340,
//     maxWidth: "100%",
//     background: "var(--im-panel)",
//     borderLeft: "1px solid var(--im-border-soft)",
//     display: "flex",
//     flexDirection: "column",
//     flexShrink: 0,
//     minWidth: 0,
//   },
//   sidebarBackdrop: { display: "none" },
//   tabRow: {
//     display: "flex",
//     alignItems: "center",
//     gap: 6,
//     padding: "12px 14px",
//     borderBottom: "1px solid var(--im-border-soft)",
//     flexShrink: 0,
//     flexWrap: "wrap",
//   },
//   tab: {
//     flex: 1,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 6,
//     padding: "9px 0 11px",
//     border: "none",
//     borderBottom: "2px solid transparent",
//     background: "transparent",
//     color: "var(--im-text-mute)",
//     cursor: "pointer",
//     fontSize: 13,
//     fontFamily: "inherit",
//     fontWeight: 700,
//   },
//   tabOn: { color: "#6d8bf7", borderBottom: "2px solid #6d8bf7" },
//   cnt: {
//     fontSize: 11,
//     background: "rgba(109,94,247,.2)",
//     color: "#b7aefc",
//     borderRadius: 10,
//     padding: "1px 7px",
//     marginLeft: 3,
//   },
//   closeBtn: {
//     background: "none",
//     border: "none",
//     color: "var(--im-text-mute)",
//     cursor: "pointer",
//     display: "flex",
//     marginLeft: "auto",
//     padding: 4,
//   },

//   chatWrap: {
//     flex: 1,
//     display: "flex",
//     flexDirection: "column",
//     overflow: "hidden",
//     minHeight: 0,
//   },
//   msgList: {
//     flex: 1,
//     overflowY: "auto",
//     padding: "16px 16px",
//     display: "flex",
//     flexDirection: "column",
//     gap: 14,
//     minHeight: 0,
//   },
//   msgRow: {
//     display: "flex",
//     alignItems: "flex-end",
//     gap: 7,
//     justifyContent: "center",
//   },
//   msgCol: {
//     display: "flex",
//     flexDirection: "column",
//     gap: 4,
//     maxWidth: "82%",
//     alignSelf: "flex-start",
//   },
//   msgColSelf: { alignSelf: "flex-end", alignItems: "flex-end" },
//   bHeader: {
//     display: "flex",
//     alignItems: "baseline",
//     gap: 8,
//     fontSize: 12,
//     fontWeight: 700,
//     color: "#7ba9f7",
//     padding: "0 2px",
//   },
//   bHeaderSelf: { color: "#b7aefc" },
//   bHeaderTime: { fontSize: 11, fontWeight: 500, color: "var(--im-text-mute)" },
//   sysBubble: {
//     fontSize: 12,
//     color: "var(--im-text-mute2)",
//     background: "var(--im-ghost-bg)",
//     borderRadius: 8,
//     padding: "6px 14px",
//     fontWeight: 500,
//   },
//   bubble: {
//     maxWidth: "100%",
//     borderRadius: 16,
//     padding: "9px 14px",
//     display: "flex",
//     flexDirection: "column",
//     gap: 2,
//     wordBreak: "break-word",
//   },
//   bSelf: {
//     background: "linear-gradient(135deg,#6d5ef7,#8b5cf6)",
//     borderBottomRightRadius: 4,
//   },
//   bOther: { background: "var(--im-surface3)", borderBottomLeftRadius: 4 },
//   bText: { fontSize: 14, color: "var(--im-text)", lineHeight: 1.45 },
//   inputRow: {
//     display: "flex",
//     gap: 8,
//     padding: "12px 14px",
//     borderTop: "1px solid var(--im-border-soft)",
//     flexShrink: 0,
//   },
//   chatInput: {
//     flex: 1,
//     minWidth: 0,
//     background: "var(--im-input-bg)",
//     border: "1px solid var(--im-border)",
//     borderRadius: 999,
//     padding: "10px 16px",
//     color: "var(--im-text-soft)",
//     fontSize: 13,
//     fontFamily: "inherit",
//     outline: "none",
//   },
//   sendBtn: {
//     background: "linear-gradient(135deg,#6d5ef7,#8b5cf6)",
//     border: "none",
//     borderRadius: "50%",
//     width: 40,
//     height: 40,
//     color: "#fff",
//     cursor: "pointer",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     flexShrink: 0,
//   },

//   peopleList: {
//     flex: 1,
//     overflowY: "auto",
//     padding: "10px 12px",
//     display: "flex",
//     flexDirection: "column",
//     gap: 4,
//     minHeight: 0,
//   },
//   emptyPpl: {
//     fontSize: 12,
//     color: "var(--im-text-mute)",
//     textAlign: "center",
//     marginTop: 20,
//   },
//   pRow: {
//     display: "flex",
//     alignItems: "center",
//     gap: 10,
//     padding: "8px 10px",
//     borderRadius: 10,
//     background: "var(--im-ghost-bg-soft)",
//   },
//   pAv: {
//     width: 32,
//     height: 32,
//     borderRadius: "50%",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontSize: 14,
//     fontWeight: 700,
//     flexShrink: 0,
//     color: "#fff",
//   },
//   pName: {
//     flex: 1,
//     fontSize: 13,
//     color: "var(--im-text-soft)",
//     minWidth: 0,
//     overflow: "hidden",
//     textOverflow: "ellipsis",
//     whiteSpace: "nowrap",
//   },
//   hostTag: {
//     fontSize: 10,
//     background: "rgba(59,130,246,.15)",
//     color: "#60a5fa",
//     padding: "2px 8px",
//     borderRadius: 6,
//     fontWeight: 600,
//     flexShrink: 0,
//   },
//   youTag: {
//     fontSize: 10,
//     background: "rgba(52,211,153,.12)",
//     color: "#6ee7b7",
//     padding: "2px 8px",
//     borderRadius: 6,
//     fontWeight: 600,
//     flexShrink: 0,
//   },

//   settingsOverlay: {
//     position: "fixed",
//     inset: 0,
//     background: "rgba(0,0,0,.5)",
//     zIndex: 1000,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 16,
//   },
//   settingsPanel: {
//     width: 320,
//     maxWidth: "100%",
//     background: "var(--im-panel-elevated)",
//     border: "1px solid var(--im-border)",
//     borderRadius: 16,
//     overflow: "hidden",
//     boxShadow: "0 20px 60px rgba(0,0,0,.6)",
//   },
//   settingsHead: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: "14px 16px",
//     borderBottom: "1px solid var(--im-border-soft)",
//   },
//   settingsBody: {
//     padding: 16,
//     display: "flex",
//     flexDirection: "column",
//     gap: 12,
//   },
//   settingsRow: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     fontSize: 13,
//     color: "var(--im-text-soft)",
//   },
//   settingsToggle: {
//     border: "1px solid var(--im-border)",
//     background: "var(--im-ghost-bg)",
//     color: "var(--im-text-mute2)",
//     borderRadius: 20,
//     padding: "5px 14px",
//     fontSize: 11,
//     fontWeight: 700,
//     cursor: "pointer",
//   },
//   settingsToggleOn: {
//     background: "rgba(109,94,247,.22)",
//     borderColor: "rgba(109,94,247,.4)",
//     color: "#b7aefc",
//   },
//   themeSwitch: {
//     display: "flex",
//     gap: 4,
//     background: "var(--im-ghost-bg)",
//     border: "1px solid var(--im-border)",
//     borderRadius: 20,
//     padding: 3,
//   },
//   themeSwitchBtn: {
//     display: "flex",
//     alignItems: "center",
//     gap: 5,
//     border: "none",
//     background: "transparent",
//     color: "var(--im-text-mute2)",
//     borderRadius: 16,
//     padding: "5px 11px",
//     fontSize: 11,
//     fontWeight: 700,
//     cursor: "pointer",
//     fontFamily: "inherit",
//   },
//   themeSwitchBtnOn: {
//     background: "rgba(109,94,247,.22)",
//     color: "#b7aefc",
//   },

//   ctrlBar: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 8,
//     padding: "14px 20px",
//     background: "var(--im-panel)",
//     borderTop: "1px solid var(--im-border-soft)",
//     flexShrink: 0,
//     overflowX: "auto",
//     flexWrap: "nowrap",
//   },
// };






















































































import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useParams } from "react-router-dom";
import { Room, RoomEvent, Track, createLocalTracks } from "livekit-client";
import texoraLogo from "@/assets/texora-logo.webp";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MonitorUp,
  MonitorOff,
  MonitorPlay,
  PhoneOff,
  MessageSquare,
  Users,
  Send,
  X,
  Timer,
  Disc2,
  PictureInPicture2,
  Hand,
  Settings,
  Captions,
  MoreVertical,
  SignalHigh,
  SmilePlus,
  Crown,
  Check,
  Clock,
  ShieldAlert,
  ShieldCheck,
  Loader2,
  AlertTriangle,
  Copy,
  ExternalLink,
  Sun,
  Moon,
  UserPlus,
  UserMinus,
  Maximize2,
  Minimize2,
  LayoutGrid,
  User,
} from "lucide-react";

// FIX: there is no meetingService.js — everything lives as named exports
// in liveSessionService.js, matching the real MeetingController routes.
import {
  getMeetingByJoinCode,
  joinMeetingAsHost,
  requestToJoin,
  getJoinRequestStatus,
  getGuestToken,
  listPendingJoinRequests,
  admitJoinRequest,
  denyJoinRequest,
  admitAllJoinRequests,
  endMeeting,
  requestMeetingSummary,
} from "@/services/liveSessionService";

/* ════════════════════════════════════════════════════════════════
   IlmoraMeeting.jsx
   ────────────────────────────────────────────────────────────────
   THE single, universal meeting room. Every shared meeting link —
   /ilmorameet/:joinCode — renders this exact page. Nothing here is
   hardcoded to one meeting: everything (title, host, LiveKit token,
   role) is resolved at runtime from the joinCode in the URL.

   Flow:
     1. Look up the joinCode against the backend (GET /join/{joinCode}).
     2. If the caller IS the host (backend decides via JWT -> isHost),
        skip straight to the meeting — no name prompt, no lobby.
     3. Otherwise show a pre-join screen (camera/mic preview + name),
        then send a join request (POST /{id}/join-requests) and sit
        in a lobby, polling (GET /{id}/join-requests/{requestId}) until
        the host admits or denies, exactly like Google Meet.
     4. Once admitted, fetch the actual LiveKit token via
        GET /{id}/token/guest/{requestId} — the status poll itself
        never carries a token, only a status string.
     5. Once a LiveKit token is available (host or admitted guest),
        connect and render the full Meet-style room.

   IMPORTANT: host/lobby/control endpoints on the backend are keyed by
   the meeting's numeric `id`, NOT the joinCode. Only `validate/{code}`
   and `join/{code}` are keyed by joinCode. This file resolves `id`
   once from the initial lookup and uses it for everything else.
   ════════════════════════════════════════════════════════════════ */

const REACTIONS = ["👍", "❤️", "😂", "😮", "👏", "🎉"];
const getTime = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
const LOBBY_POLL_MS = 3000;
const WAITING_ROOM_POLL_MS = 4000;
const MEETING_STATUS_POLL_MS = 15000;

/* ─── screen-share platform support detection ─────────────────────
   Real-world constraints this file now accounts for:
     • iOS Safari / iPadOS Safari (all versions in wide use) does not
       expose getDisplayMedia at all — screen sharing is simply not
       possible from the browser on iPhone/iPad. We detect this and
       disable the button instead of letting it throw at click time.
     • Desktop Chrome/Edge/Firefox/Safari (Mac), and Android Chrome,
       all support getDisplayMedia but differ in what they let you
       pick (window vs. tab vs. entire screen) and whether audio
       capture is possible — we never assume audio capture works.
     • Must be a secure context (HTTPS) — getDisplayMedia is undefined
       on plain HTTP, which otherwise looks identical to "unsupported".
   ──────────────────────────────────────────────────────────────── */
function detectSpeechRecognitionSupport() {
  if (typeof window === "undefined") return { supported: false };
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  return SR ? { supported: true, SR } : { supported: false };
}

function detectScreenShareSupport() {
  if (typeof navigator === "undefined" || typeof window === "undefined") {
    return { supported: false, reason: "unavailable" };
  }
  const ua = navigator.userAgent || "";
  const isIOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (ua.includes("Macintosh") && navigator.maxTouchPoints > 1); // iPadOS reports as Mac
  const isSafari =
    /^((?!chrome|android|crios|fxios).)*safari/i.test(ua) || isIOS;
  const hasApi =
    !!navigator.mediaDevices && !!navigator.mediaDevices.getDisplayMedia;
  const isSecure =
    window.isSecureContext !== undefined ? window.isSecureContext : true;

  if (!isSecure) {
    return {
      supported: false,
      reason: "insecure",
      message:
        "Screen sharing needs a secure (HTTPS) connection. Please load this meeting over HTTPS.",
    };
  }
  // iOS/iPadOS Safari (and any iOS browser, since they all use WebKit and
  // inherit the same limitation) cannot capture the screen from the web.
  if (isIOS) {
    return {
      supported: false,
      reason: "ios",
      message:
        "Screen sharing isn't supported by Safari on iPhone/iPad yet. You can still present using a Mac, Windows, Linux, or Android device.",
    };
  }
  if (!hasApi) {
    return {
      supported: false,
      reason: "no-api",
      message: isSafari
        ? "This version of Safari doesn't support screen sharing. Please update Safari or use Chrome/Edge/Firefox."
        : "Screen sharing isn't supported in this browser. Please use an up-to-date Chrome, Edge, Firefox, or Safari.",
    };
  }
  return { supported: true };
}

/* ─── small utility hooks (self-contained, no external context) ──── */

function useElapsedTimer(startedAtMs) {
  const [, tick] = useState(0);
  useEffect(() => {
    if (!startedAtMs) return undefined;
    const id = setInterval(() => tick((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, [startedAtMs]);
  if (!startedAtMs) return "00:00:00";
  const secs = Math.max(0, Math.floor((Date.now() - startedAtMs) / 1000));
  const hh = String(Math.floor(secs / 3600)).padStart(2, "0");
  const mm = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

function useResponsiveDevice() {
  const [w, setW] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1366,
  );
  useEffect(() => {
    let raf = null;
    const onResize = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setW(window.innerWidth));
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  if (w <= 767) return "phone";
  if (w <= 1023) return "tablet";
  if (w <= 1365) return "laptop";
  return "desktop";
}

function useDismiss(active, onDismiss, refs = []) {
  useEffect(() => {
    if (!active) return undefined;
    const handlePointer = (e) => {
      const insideAny = refs.some(
        (r) => r.current && r.current.contains(e.target),
      );
      if (!insideAny) onDismiss();
    };
    const handleKey = (e) => {
      if (e.key === "Escape") onDismiss();
    };
    document.addEventListener("mousedown", handlePointer, true);
    document.addEventListener("touchstart", handlePointer, true);
    document.addEventListener("keydown", handleKey, true);
    return () => {
      document.removeEventListener("mousedown", handlePointer, true);
      document.removeEventListener("touchstart", handlePointer, true);
      document.removeEventListener("keydown", handleKey, true);
    };
  }, [active, onDismiss, refs]);
}

function useInView(ref) {
  const [inView, setInView] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return undefined;
    const root = el.closest("[data-scroll-root]") || null;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { root, threshold: 0.01, rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return inView;
}

/* Builds the flat participant list (with tracks) from the raw LiveKit
   Room, the same shape LiveRoom.jsx's context normally provides — but
   derived locally here since this page owns the Room itself. */
function buildParticipantList(room, raisedHands, speakingSet) {
  if (!room) return [];
  const list = [];
  const addOne = (participant, isLocal) => {
    const videoPubs = Array.from(
      participant.videoTrackPublications?.values?.() || [],
    );
    const audioPubs = Array.from(
      participant.audioTrackPublications?.values?.() || [],
    );
    const camPub = videoPubs.find((p) => p.source === Track.Source.Camera);
    const screenPub = videoPubs.find(
      (p) => p.source === Track.Source.ScreenShare,
    );
    const micPub = audioPubs.find((p) => p.source === Track.Source.Microphone);
    const identity = isLocal ? participant.identity : participant.identity;

    list.push({
      identity,
      name: participant.name || participant.identity || "Guest",
      isLocal,
      isHost: !!participant.metadata && safeParse(participant.metadata)?.isHost,
      avatarSeed: safeParse(participant.metadata)?.avatarSeed || null,
      cameraTrack: camPub?.track || null,
      cameraMuted: !camPub || !!camPub.isMuted || !camPub.track,
      screenTrack: screenPub?.track || null,
      micTrack: !isLocal ? micPub?.track || null : null,
      micMuted: micPub ? !!micPub.isMuted : true,
      isSpeaking: speakingSet?.has(identity) || false,
    });
  };

  addOne(room.localParticipant, true);
  room.remoteParticipants.forEach((p) => addOne(p, false));
  // Layout must stay stable — tiles never reorder based on who's
  // speaking. Active speaker is indicated only visually (im-speaking
  // glow class on the tile), never by moving its position.
  return list;
}

function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch (_) {
    return null;
  }
}

/* ─── deterministic abstract avatar (not a photo, not just a letter) ─
   Seeded off the person's stable name/identity so the same person
   always gets the same look across tiles/panels in a session.
   Google Meet uses flat, solid avatar colors (no gradients) — this
   palette mirrors that: one solid fill per person, chosen from a
   small rotating set of Meet-like hues. */
// Each entry is [tileBackdrop, avatarCircle] — a dark, muted backdrop so
// the tile recedes, paired with a brighter, more saturated version of the
// same hue so the avatar circle actually pops forward off it.
const AVATAR_PALETTES = [
  ["#17301f", "#34a853"],
  ["#122a4a", "#4285f4"],
  ["#3a1f14", "#e8703a"],
  ["#2a2f38", "#8a97ab"],
  ["#2a1f38", "#9d6fd1"],
  ["#123030", "#20b2aa"],
  ["#3a2e0f", "#d1a53a"],
  ["#3a1818", "#c0554f"],
  ["#141f18", "#3f8f5f"],
  ["#1e1a38", "#7266c9"],
];

function hashSeed(str) {
  let h = 0;
  const s = String(str || "?");
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function getAvatarStyle(seed) {
  const h = hashSeed(seed);
  return AVATAR_PALETTES[h % AVATAR_PALETTES.length][0];
}

function getAvatarCircleStyle(seed) {
  const h = hashSeed(seed);
  return AVATAR_PALETTES[h % AVATAR_PALETTES.length][1];
}

/* ─── media element wrappers ─────────────────────────────────────── */

function VideoTrackEl({ track, mirrored, fit = "cover", hidden, videoRef }) {
  const internalRef = useRef(null);
  useEffect(() => {
    const el = internalRef.current;
    if (!track || !el) return undefined;
    track.attach(el);
    return () => {
      try {
        track.detach(el);
      } catch (_) {}
    };
  }, [track]);
  return (
    <video
      ref={(node) => {
        internalRef.current = node;
        if (videoRef) videoRef.current = node;
      }}
      autoPlay
      playsInline
      muted
      style={
        hidden
          ? {
              position: "absolute",
              left: -9999,
              top: -9999,
              width: 2,
              height: 2,
              opacity: 0,
              pointerEvents: "none",
            }
          : {
              width: "100%",
              height: "100%",
              objectFit: fit,
              transform: mirrored ? "scaleX(-1)" : "none",
              display: "block",
              background: "#000",
            }
      }
    />
  );
}

function AudioTrackEl({ track }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!track || !el) return undefined;
    track.attach(el);
    el.play?.().catch(() => {});
    return () => {
      try {
        track.detach(el);
      } catch (_) {}
    };
  }, [track]);
  return <audio ref={ref} autoPlay data-remote-audio="1" />;
}

/* ─── PiP floating panel ─────────────────────────────────────────── */
function PiPPanel({
  track,
  isScreen,
  label,
  timer,
  micOn,
  onToggleMic,
  onReturn,
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        background: "#000",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Google Sans','Roboto',system-ui,sans-serif",
      }}
    >
      <div style={{ flex: 1, minHeight: 0, position: "relative" }}>
        {track ? (
          <VideoTrackEl track={track} fit={isScreen ? "contain" : "cover"} />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#9aa0a6",
              fontSize: 13,
            }}
          >
            Meeting in progress…
          </div>
        )}
        <div
          style={{
            position: "absolute",
            top: 6,
            left: 8,
            fontSize: 11,
            color: "#fff",
            background: "rgba(0,0,0,.55)",
            padding: "3px 8px",
            borderRadius: 6,
          }}
        >
          {timer}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 6,
            left: 8,
            fontSize: 10,
            color: "#fff",
            background: "rgba(0,0,0,.55)",
            padding: "2px 7px",
            borderRadius: 6,
          }}
        >
          {label}
        </div>
      </div>
      <div
        style={{
          flexShrink: 0,
          display: "flex",
          gap: 6,
          padding: 6,
          background: "#202124",
        }}
      >
        <button
          onClick={onToggleMic}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            padding: "6px 8px",
            borderRadius: 8,
            border: "none",
            background: micOn ? "rgba(255,255,255,.12)" : "#5c2b29",
            color: micOn ? "#e8eaed" : "#f6aea9",
            fontSize: 11,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {micOn ? <Mic size={13} /> : <MicOff size={13} />}
          {micOn ? "Mute" : "Unmute"}
        </button>
        <button
          onClick={onReturn}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            padding: "6px 8px",
            borderRadius: 8,
            border: "none",
            background: "rgba(138,180,248,.18)",
            color: "#8ab4f8",
            fontSize: 11,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Return to meeting
        </button>
      </div>
    </div>
  );
}

/* ─── reaction badge ─────────────────────────────────────────────── */
function ReactionBadge({ emoji, style }) {
  if (!emoji) return null;

  return (
    <div style={style} className="im-reaction-badge" aria-hidden="true">
      {emoji}
    </div>
  );
}
/* ─── reaction floaters ──────────────────────────────────────────── */
function EmojiFloaters({ floaters, S }) {
  return (
    <div style={S.floaterLayer} aria-hidden="true">
      {floaters.map((f, i) => (
        <div
          key={f.id}
          style={{
            ...S.floater,
            left: `${10 + ((i * 13) % 74)}%`,
            animationDelay: `${(i % 4) * 0.08}s`,
          }}
        >
          <span style={S.floaterEmoji}>{f.emoji}</span>
          <span style={S.floaterName}>{f.name}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── video tiles: strip / grid / stage ─────────────────────────── */
function StripTile({ p, active, raised, reaction, S }) {
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

// FIX (bug 5): "+N others" is now a real button — clicking it opens the
// People panel so every hidden participant is reachable, not just a dead label.
function StripOverflow({ count, S, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ ...S.stripTile, ...S.stripOverflow, cursor: "pointer" }}
      className="im-strip-tile"
    >
      <span
        style={{ fontSize: 13, fontWeight: 700, color: "var(--im-text-soft)" }}
      >
        +{count}
      </span>
      <span style={{ fontSize: 9, color: "var(--im-text-mute)", marginTop: 2 }}>
        others · tap to view
      </span>
    </button>
  );
}

function StageTile({ p, raised, reaction, S, onMaximize, presenterCam }) {
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

function gridColumns(n, maxCols = 5) {
  if (n <= 1) return 1;
  const idealCols = Math.ceil(Math.sqrt(n));
  return Math.min(idealCols, maxCols);
}

function GridTile({ p, raised, reaction, S, basisPercent }) {
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
    <div
      ref={wrapRef}
      style={{
        ...S.gridCellOuter,
        flex: `0 0 ${basisPercent}%`,
        maxWidth: `${basisPercent}%`,
      }}
    >
      <div
        style={{ ...S.gridTile, background: tileColor }}
        className={`im-grid-tile${p.isSpeaking ? " im-speaking" : ""}`}
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

function ParticipantGrid({
  participants,
  raisedHands,
  handRaised,
  reactions,
  S,
  device,
}) {
  const maxCols = device === "phone" ? 3 : device === "tablet" ? 3 : 5;
  const cols = gridColumns(participants.length, maxCols);
  return (
    <div style={S.gridWrap} className="im-grid">
      {participants.map((p) => (
        <GridTile
          key={p.identity}
          p={p}
          raised={p.isLocal ? handRaised : !!raisedHands[p.identity]}
          reaction={reactions[p.identity]}
          S={S}
          basisPercent={100 / cols}
        />
      ))}
    </div>
  );
}

/* FIX (mobile UI): full-width stacked tile used ONLY on phone-width
   screens, one participant per row, matching the target mobile design
   (avatar centered, name pill bottom-left, mic/host badge top-left,
   overflow menu top-right, small local self-camera thumbnail bottom-
   right when the local user's camera is on). Desktop/tablet/laptop
   layouts (grid / stage+filmstrip) are completely untouched. */
function MobileStackedTile({ p, raised, reaction, active, S, onOpenPeople }) {
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

const PersonRow = ({ name, isHost, self, handRaised, S }) => (
  <div style={S.pRow}>
    <div
      style={{
        ...S.pAv,
        background: getAvatarStyle(self ? "you" : name),
      }}
    >
      {(name || "?")[0]}
    </div>
    <span style={S.pName}>{name}</span>
    {handRaised && <Hand size={13} color="#fdd663" />}
    {isHost && <span style={S.hostTag}>Host</span>}
    {self && <span style={S.youTag}>You</span>}
  </div>
);

const Btn = ({
  icon,
  label,
  active,
  danger,
  leave,
  badge,
  onClick,
  btnRef,
  pressed,
  ariaHasPopup,
  ariaExpanded,
  disabled,
  title,
  S,
}) => {
  const [hov, setHov] = useState(false);
  // FIX (bug 3): the idle/hover state used to be hardcoded white-based rgba
  // with a fixed light-gray icon color, which was tuned for dark theme only
  // and became nearly invisible against the white panel in light theme.
  // Now it follows the same --im-ghost-bg / --im-text-soft variables the
  // rest of the room UI already uses, so icons stay visible in both themes.
  const bg = leave
    ? hov
      ? "#c5221f"
      : "#ea4335"
    : danger
      ? hov
        ? "#8c2b27"
        : "#5c2b29"
      : active
        ? hov
          ? "rgba(138,180,248,.30)"
          : "rgba(138,180,248,.18)"
        : hov
          ? "var(--im-ghost-bg)"
          : "var(--im-ghost-bg-soft)";
  const col = leave
    ? "#fff"
    : danger
      ? "#f6aea9"
      : active
        ? "#8ab4f8"
        : "var(--im-text-soft)";
  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      <button
        ref={btnRef}
        className="im-ctrl-btn"
        onClick={onClick}
        disabled={disabled}
        title={title}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        aria-label={label}
        aria-pressed={typeof pressed === "boolean" ? pressed : undefined}
        aria-haspopup={ariaHasPopup}
        aria-expanded={ariaExpanded}
        style={{
          opacity: disabled ? 0.6 : 1,
          cursor: disabled ? "not-allowed" : "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          background: bg,
          color: col,
          border: danger
            ? "1px solid rgba(242,139,130,.3)"
            : active
              ? "1px solid rgba(138,180,248,.45)"
              : "1px solid var(--im-border-soft)",
          borderRadius: 14,
          padding: "10px 16px",

          fontSize: 10,
          fontWeight: 600,
          fontFamily: "inherit",
          letterSpacing: 0.2,
          flexShrink: 0,
          boxShadow: "none",
        }}
      >
        {icon}
        <span className="im-btn-label">{label}</span>
      </button>
      {!!badge && <span style={S.ctrlBadge}>{badge}</span>}
    </div>
  );
};

function PreJoinScreen({ meetingInfo, joinCode, onSubmit, submitting, error }) {
  const [name, setName] = useState(() => {
    try {
      const u = JSON.parse(localStorage.getItem("lms_user") || "{}");
      return u?.name || "";
    } catch {
      return "";
    }
  });
  const [email, setEmail] = useState(() => {
    try {
      const u = JSON.parse(localStorage.getItem("lms_user") || "{}");
      return u?.email || "";
    } catch {
      return "";
    }
  });
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [previewTrack, setPreviewTrack] = useState(null);
  const [previewError, setPreviewError] = useState(null);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  useEffect(() => {
    let localTracks = [];
    let cancelled = false;
    (async () => {
      try {
        localTracks = await createLocalTracks({ audio: true, video: true });
        if (cancelled) {
          localTracks.forEach((t) => t.stop());
          return;
        }
        const cam = localTracks.find((t) => t.kind === Track.Kind.Video);
        if (cam) setPreviewTrack(cam);
      } catch (err) {
        setPreviewError(
          "Camera/microphone permission was blocked. You can still join with audio/video off.",
        );
      }
    })();
    return () => {
      cancelled = true;
      localTracks.forEach((t) => {
        try {
          t.stop();
        } catch (_) {}
      });
    };
  }, []);

  const videoRef = useRef(null);
  useEffect(() => {
    const el = videoRef.current;
    if (!el || !previewTrack) return undefined;
    if (camOn) previewTrack.attach(el);
    else previewTrack.detach(el);
    return () => {
      try {
        previewTrack.detach(el);
      } catch (_) {}
    };
  }, [previewTrack, camOn]);

  const handleSubmit = () => {
    if (!emailValid || submitting) return;
    onSubmit({
      name: name.trim() || "Guest",
      email: email.trim(),
      micOn,
      camOn,
    });
  };

  return (
    <div style={PJ.root}>
      <div style={PJ.page}>
        <div style={PJ.header}>
          <div style={PJ.brandRow}>
            <img src={texoraLogo} alt="Texora AI" style={PJ.brandLogo} />
          </div>
          <h1 style={PJ.pageTitle}>
            Welcome to <span style={PJ.pageTitleAccent}>Workspace</span>
          </h1>
          <p style={PJ.pageSubtitle}>
            Join your meeting or start a new session
          </p>
        </div>

        <div style={PJ.card}>
          <div style={PJ.leftCol}>
            <div style={PJ.previewBox}>
              {camOn && previewTrack ? (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transform: "scaleX(-1)",
                  }}
                />
              ) : (
                <div style={PJ.previewAvatarWrap}>
                  <div
                    style={{
                      ...PJ.previewAvatar,
                      background: getAvatarStyle(name || email || "guest"),
                    }}
                  >
                    {(name || "G").trim().charAt(0).toUpperCase()}
                  </div>
                </div>
              )}

              <img src={texoraLogo} alt="" style={PJ.previewWatermark} />

              <div style={PJ.previewCtrls}>
                <button
                  style={PJ.previewPillBtn}
                  onClick={() => setMicOn((v) => !v)}
                  title={micOn ? "Mute" : "Unmute"}
                >
                  {micOn ? <Mic size={16} /> : <MicOff size={16} />}
                  <span>{micOn ? "Mic On" : "Mic Off"}</span>
                </button>
                <span style={PJ.previewCtrlsDivider} />
                <button
                  style={PJ.previewPillBtn}
                  onClick={() => setCamOn((v) => !v)}
                  title={camOn ? "Stop camera" : "Start camera"}
                >
                  {camOn ? <Video size={16} /> : <VideoOff size={16} />}
                  <span>{camOn ? "Camera On" : "Camera Off"}</span>
                </button>
              </div>
            </div>

            <div style={PJ.secureBanner}>
              <span style={PJ.secureIconWrap}>
                <ShieldCheck size={18} color="#1a73e8" />
              </span>
              <div>
                <p style={PJ.secureTitle}>
                  Your meeting is secure and end-to-end encrypted
                </p>
                <p style={PJ.secureSubtitle}>
                  We protect your privacy and keep your data safe.
                </p>
              </div>
            </div>
          </div>

          <div style={PJ.infoCol}>
            <h2 style={PJ.title}>{meetingInfo?.title || "Ilmorameet"}</h2>
            <p style={PJ.subtitle}>
              Hosted by{" "}
              <strong>{meetingInfo?.creatorName || "the meeting host"}</strong>
            </p>
            <p style={PJ.code}>
              Meeting code: <span>{joinCode}</span>
              {joinCode && (
                <button
                  type="button"
                  style={PJ.copyBtn}
                  title="Copy meeting code"
                  onClick={() => {
                    try {
                      navigator.clipboard?.writeText(joinCode);
                    } catch (_) {}
                  }}
                >
                  <Copy size={13} />
                </button>
              )}
            </p>

            <div style={PJ.sectionHeading}>
              <h3 style={PJ.sectionHeadingText}>Join the Meeting</h3>
              <div style={PJ.sectionHeadingDash}>
                <span style={PJ.dashOrange} />
              </div>
            </div>

            <label style={PJ.label}>Your name</label>
            <input
              style={PJ.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              maxLength={40}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
              }}
            />

            <label style={PJ.label}>Your email</label>
            <input
              style={PJ.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              type="email"
              maxLength={100}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
              }}
            />
            {email.length > 0 && !emailValid && (
              <p style={PJ.errText}>Enter a valid email address</p>
            )}

            {previewError && (
              <p style={PJ.warnText}>
                <AlertTriangle size={13} /> {previewError}
              </p>
            )}
            {error && <p style={PJ.errText}>{error}</p>}

            <button
              style={{
                ...PJ.joinBtn,
                opacity: submitting || !emailValid ? 0.7 : 1,
              }}
              disabled={submitting || !emailValid}
              onClick={handleSubmit}
            >
              {submitting ? <Loader2 size={16} className="im-spin" /> : null}
              {submitting ? "Requesting to join…" : "Ask to Join"}
            </button>
            <p style={PJ.hint}>
              <Clock size={12} />
              Someone in the meeting will let you in soon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
function MobileMoreSheet({
  open,
  onClose,
  handRaised,
  onToggleHand,
  screenOn,
  screenShareSupport,
  onToggleScreen,
  captionsOn,
  onToggleCaptions,
  pipOn,
  onTogglePip,
  onOpenPeople,
  onOpenChat,
  isHost,
  waitingCount,
  onOpenWaiting,
  recording,
  onToggleRecording,
  onOpenSettings,
  gridView,
  onToggleLayout,
  onLeave,
  isEnding,
  S,
}) {
  if (!open) return null;
  return createPortal(
    <>
      <div style={S.mobileSheetBackdrop} onClick={onClose} />
      <div style={S.mobileSheet} role="dialog" aria-label="More options">
        <div style={S.mobileSheetHandle} />

        <button
          style={{
            ...S.mobileSheetPillWide,
            ...(handRaised ? S.mobileSheetPillActive : null),
          }}
          onClick={onToggleHand}
        >
          <Hand size={17} />
          {handRaised ? "Lower hand" : "Raise hand"}
        </button>

        <div style={S.mobileSheetIconRow}>
          <button
            style={{
              ...S.mobileSheetIconBtn,
              ...(screenOn ? S.mobileSheetIconBtnActive : null),
              opacity: !screenOn && !screenShareSupport.supported ? 0.5 : 1,
            }}
            onClick={onToggleScreen}
            disabled={!screenOn && !screenShareSupport.supported}
            title={
              !screenOn && !screenShareSupport.supported
                ? screenShareSupport.message
                : undefined
            }
          >
            {screenOn ? <MonitorOff size={19} /> : <MonitorUp size={19} />}
            <span>
              {!screenShareSupport.supported ? "Unsupported" : "Present"}
            </span>
          </button>
          <button
            style={{
              ...S.mobileSheetIconBtn,
              ...(captionsOn ? S.mobileSheetIconBtnActive : null),
            }}
            onClick={onToggleCaptions}
          >
            <Captions size={19} />
            <span>Captions</span>
          </button>
          <button
            style={{
              ...S.mobileSheetIconBtn,
              ...(pipOn ? S.mobileSheetIconBtnActive : null),
            }}
            onClick={onTogglePip}
          >
            <PictureInPicture2 size={19} />
            <span>Pop out</span>
          </button>
          <button style={S.mobileSheetIconBtn} onClick={onToggleLayout}>
            {gridView ? <User size={19} /> : <LayoutGrid size={19} />}
            <span>{gridView ? "Speaker" : "Grid"}</span>
          </button>
        </div>

        <div style={S.mobileSheetRow2}>
          <button style={S.mobileSheetPillHalf} onClick={onOpenPeople}>
            <Users size={16} />
            People
          </button>
          <button style={S.mobileSheetPillHalf} onClick={onOpenChat}>
            <MessageSquare size={16} />
            Chat
          </button>
        </div>

        {isHost && (
          <div style={S.mobileSheetRow2}>
            <button style={S.mobileSheetPillHalf} onClick={onOpenWaiting}>
              <Clock size={16} />
              Waiting{waitingCount > 0 ? ` (${waitingCount})` : ""}
            </button>
            <button
              style={{
                ...S.mobileSheetPillHalf,
                ...(recording ? S.mobileSheetPillActive : null),
              }}
              onClick={onToggleRecording}
            >
              <Disc2 size={16} />
              {recording ? "Stop rec" : "Record"}
            </button>
          </div>
        )}

        <button style={S.mobileSheetPillWide} onClick={onOpenSettings}>
          <Settings size={16} />
          Settings
        </button>

        <button
          style={{ ...S.mobileSheetPillWide, ...S.mobileSheetLeaveBtn }}
          onClick={onLeave}
          disabled={isHost && isEnding}
        >
          <PhoneOff size={16} />
          {isHost ? (isEnding ? "Ending…" : "End meeting") : "Leave meeting"}
        </button>
      </div>
    </>,
    document.body,
  );
}
/* ═════════════════════════════════════════════════════════════════
   LOBBY SCREEN — guest waiting for host to admit
═════════════════════════════════════════════════════════════════ */
function LobbyScreen({ meetingInfo, onCancel }) {
  return (
    <div style={PJ.root}>
      <div style={LB.card}>
        <div style={LB.pulseWrap}>
          <div style={LB.pulseDot} />
          <Clock size={30} color="#8ab4f8" />
        </div>
        <h2 style={LB.title}>Asking to join…</h2>
        <p style={LB.subtitle}>
          You'll join <strong>{meetingInfo?.title || "this meeting"}</strong> as
          soon as the host lets you in.
        </p>
        <button style={LB.cancelBtn} onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}

function DeniedScreen({ onRetry }) {
  return (
    <div style={PJ.root}>
      <div style={LB.card}>
        <ShieldAlert size={38} color="#f28b82" />
        <h2 style={LB.title}>Your request was declined</h2>
        <p style={LB.subtitle}>The host didn't let you into this meeting.</p>
        <button style={LB.cancelBtn} onClick={onRetry}>
          Try again
        </button>
      </div>
    </div>
  );
}

function StatusScreen({ icon, title, subtitle }) {
  return (
    <div style={PJ.root}>
      <div style={LB.card}>
        {icon}
        <h2 style={LB.title}>{title}</h2>
        {subtitle && <p style={LB.subtitle}>{subtitle}</p>}
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════
   WAITING ROOM PANEL — host-only: admit/deny pending guests
═════════════════════════════════════════════════════════════════ */
function WaitingRoomPanel({ waiting, onAdmit, onDeny, onAdmitAll, S }) {
  if (!waiting.length) {
    return <p style={S.emptyPpl}>No one is waiting to join.</p>;
  }
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        padding: "0 2px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 4px",
        }}
      >
        <span style={{ fontSize: 12, fontWeight: 700, color: "#fdd663" }}>
          {waiting.length} waiting to join
        </span>
        <button
          onClick={onAdmitAll}
          style={{
            background: "rgba(138,180,248,.18)",
            border: "1px solid rgba(138,180,248,.35)",
            color: "#8ab4f8",
            borderRadius: 8,
            padding: "5px 10px",
            fontSize: 11,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Admit all
        </button>
      </div>
      {waiting.map((w) => (
        <div key={w.requestId} style={S.pRow}>
          <div
            style={{
              ...S.pAv,
              background: "#e37400",
            }}
          >
            {(w.name || "?")[0]}
          </div>
          <span style={S.pName}>{w.name}</span>
          <button
            onClick={() => onDeny(w.requestId)}
            title="Deny"
            style={{
              background: "rgba(242,139,130,.14)",
              border: "1px solid rgba(242,139,130,.3)",
              color: "#f28b82",
              borderRadius: 8,
              width: 30,
              height: 30,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <X size={14} />
          </button>
          <button
            onClick={() => onAdmit(w.requestId)}
            title="Admit"
            style={{
              background: "rgba(129,201,149,.16)",
              border: "1px solid rgba(129,201,149,.35)",
              color: "#81c995",
              borderRadius: 8,
              width: 30,
              height: 30,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <Check size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═════════════════════════════════════════════════════════════════ */
export default function IlmoraMeeting() {
  const { joinCode } = useParams();
  const navigate = useNavigate();

  // phase: 'loading' | 'error' | 'prejoin' | 'lobby' | 'denied' | 'ended' | 'in-meeting'
  const [phase, setPhase] = useState("loading");
  const [loadError, setLoadError] = useState(null);
  const [meetingInfo, setMeetingInfo] = useState(null); // MeetingResponseDTO — has .id, .meetingStatus, .creatorName, .isHost
  const [joinRequestId, setJoinRequestId] = useState(null);
  const [guestIdentity, setGuestIdentity] = useState(null); // FIX: this is the bearer credential — must be captured and threaded through
  const [guestName, setGuestName] = useState(null);
  const [connectPayload, setConnectPayload] = useState(null); // { token, room, isHost }
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [initialAV, setInitialAV] = useState({ micOn: true, camOn: true });

  const lobbyPollRef = useRef(null);

  /* ── 1. resolve the meeting from the joinCode ──────────────────── */
  const loadMeeting = useCallback(async () => {
    setPhase("loading");
    setLoadError(null);
    try {
      const res = await getMeetingByJoinCode(joinCode);
      const info = res?.data;
      if (!info) throw new Error("Meeting not found");
      setMeetingInfo(info);

      // FIX: DTO field is meetingStatus, not status
      if (info.meetingStatus === "ENDED") {
        setPhase("ended");
        return;
      }

      if (info.isHost) {
        // Host: fetch a token directly, no lobby.
        // FIX: token endpoint is keyed by numeric id, not joinCode.
        const hostRes = await joinMeetingAsHost(info.id);
        setConnectPayload({ ...hostRes.data, isHost: true });
        setPhase("in-meeting");
      } else {
        setPhase("prejoin");
      }
    } catch (err) {
      console.error("Failed to resolve meeting:", err);
      setLoadError(
        err?.response?.status === 404
          ? "This meeting link is invalid or has expired."
          : "We couldn't load this meeting. Please check your connection and try again.",
      );
      setPhase("error");
    }
  }, [joinCode]);

  useEffect(() => {
    loadMeeting();
  }, [loadMeeting]);

  /* ── 2. guest: submit "ask to join" ────────────────────────────── */
  const handlePreJoinSubmit = useCallback(
    async ({ name, email, micOn, camOn }) => {
      if (!meetingInfo?.id) return;
      setSubmitting(true);
      setSubmitError(null);

      try {
        const res = await requestToJoin(meetingInfo.id, name, email);
        const data = res?.data;
        setJoinRequestId(data?.requestId);
        setGuestIdentity(data?.guestIdentity);
        setGuestName(name);
        setInitialAV({ micOn, camOn });

        // FIX (returning participant): backend may auto-admit a
        // recognized guest instead of leaving them PENDING — skip the
        // lobby entirely and fetch the token right away, same as a
        // normal admit.
        if (data?.status === "ADMITTED") {
          const tokenRes = await getGuestToken(
            meetingInfo.id,
            data.requestId,
            data.guestIdentity,
            name,
          );
          setConnectPayload({ ...tokenRes.data, isHost: false });
          setPhase("in-meeting");
        } else {
          setPhase("lobby");
        }
      } catch (err) {
        console.error("Join request failed:", err);
        setSubmitError(
          err?.response?.data?.error ||
            err?.response?.data?.message ||
            "Couldn't send your request. Please try again.",
        );
      } finally {
        setSubmitting(false);
      }
    },
    [meetingInfo],
  );

  /* ── 3. guest: poll lobby status until admitted/denied ─────────── */
  useEffect(() => {
    if (
      phase !== "lobby" ||
      !joinRequestId ||
      !guestIdentity ||
      !meetingInfo?.id
    )
      return undefined;

    const poll = async () => {
      try {
        // FIX: guestIdentity is a required query param on the backend —
        // omitting it means every poll 400s.
        const res = await getJoinRequestStatus(
          meetingInfo.id,
          joinRequestId,
          guestIdentity,
        );
        const status = res?.data?.status;

        if (status === "ADMITTED") {
          clearInterval(lobbyPollRef.current);
          // FIX: the status poll never returns a token — it must be
          // fetched separately once ADMITTED.
          const tokenRes = await getGuestToken(
            meetingInfo.id,
            joinRequestId,
            guestIdentity,
            guestName,
          );
          setConnectPayload({ ...tokenRes.data, isHost: false });
          setPhase("in-meeting");
        } else if (status === "DENIED") {
          clearInterval(lobbyPollRef.current);
          setPhase("denied");
        }
        // NOTE: no "CANCELLED" status exists on the backend
        // (JoinRequestStatus is PENDING | ADMITTED | DENIED only),
        // so that branch has been removed.
      } catch (_) {
        // transient network hiccup — keep polling
      }
    };
    poll();
    lobbyPollRef.current = setInterval(poll, LOBBY_POLL_MS);
    return () => clearInterval(lobbyPollRef.current);
  }, [phase, joinRequestId, guestIdentity, guestName, meetingInfo]);

  const handleCancelLobby = useCallback(() => {
    // FIX: there is no cancel/withdraw endpoint on the backend yet
    // (TODO: add one if you want the host to stop seeing a stale
    // pending request). For now we just stop polling client-side —
    // the request stays PENDING server-side until the meeting ends
    // or the host denies/admits it.
    if (lobbyPollRef.current) clearInterval(lobbyPollRef.current);
    setJoinRequestId(null);
    setGuestIdentity(null);
    setPhase("prejoin");
  }, []);

  const handleMeetingEndedRemotely = useCallback(() => {
    setPhase("ended");
  }, []);

  const handleLeftMeeting = useCallback(() => {
    navigate("/", { replace: true });
  }, [navigate]);

  /* ── render by phase ─────────────────────────────────────────────── */
  if (phase === "loading") {
    return (
      <StatusScreen
        icon={<Loader2 size={34} color="#8ab4f8" className="im-spin" />}
        title="Loading meeting…"
      />
    );
  }
  if (phase === "error") {
    return (
      <StatusScreen
        icon={<AlertTriangle size={36} color="#f28b82" />}
        title="Can't open this meeting"
        subtitle={loadError}
      />
    );
  }
  if (phase === "ended") {
    return (
      <StatusScreen
        icon={<PhoneOff size={34} color="#9aa0a6" />}
        title="This meeting has ended"
        subtitle="Thanks for joining. You can close this tab."
      />
    );
  }
  if (phase === "prejoin") {
    return (
      <PreJoinScreen
        meetingInfo={meetingInfo}
        joinCode={joinCode}
        onSubmit={handlePreJoinSubmit}
        submitting={submitting}
        error={submitError}
      />
    );
  }
  if (phase === "lobby") {
    return (
      <LobbyScreen meetingInfo={meetingInfo} onCancel={handleCancelLobby} />
    );
  }
  if (phase === "denied") {
    return <DeniedScreen onRetry={() => setPhase("prejoin")} />;
  }

  return (
    <MeetingRoom
      joinCode={joinCode}
      meetingId={meetingInfo?.id}
      meetingInfo={meetingInfo}
      connectPayload={connectPayload}
      initialAV={initialAV}
      onEndedRemotely={handleMeetingEndedRemotely}
      onLeft={handleLeftMeeting}
    />
  );
}

/* ═════════════════════════════════════════════════════════════════
   MEETING ROOM — the actual LiveKit-connected Google-Meet-style room.
   Owns the Room instance directly; renders identically for host and
   guests except for host-only affordances (waiting room, recording,
   End meeting for everyone vs. Leave).
═════════════════════════════════════════════════════════════════ */
function MeetingRoom({
  joinCode,
  meetingId,
  meetingInfo,
  connectPayload,
  initialAV,
  onEndedRemotely,
  onLeft,
}) {
  const roomRef = useRef(null);
  const localCamRef = useRef(null);
  const localMicRef = useRef(null);
  const camReadyPromiseRef = useRef(null);
  const chatEndRef = useRef(null);
  const waitingPollRef = useRef(null);
  const statusPollRef = useRef(null);
  const pipFallbackVideoRef = useRef(null);
  const menuBtnRef = useRef(null);
  const menuPanelRef = useRef(null);
  const speakingSetRef = useRef(new Set());
  const sidebarRef = useRef(null);
  const screenSharePickerActiveRef = useRef(false);
  const reactionBtnRef = useRef(null);
  const reactionPanelRef = useRef(null);

  const [connected, setConnected] = useState(false);
  const [micOn, setMicOn] = useState(initialAV?.micOn ?? true);
  const [camOn, setCamOn] = useState(initialAV?.camOn ?? true);
  const [screenOn, setScreenOn] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState(() => [
    {
      id: 0,
      system: true,
      text: "You're connected. Say hello!",
      time: getTime(),
    },
  ]);
  const [msgInput, setMsgInput] = useState("");
  const [raisedHands, setRaisedHands] = useState({});
  const [floaters, setFloaters] = useState([]);
  const [reactions, setReactions] = useState({}); // identity -> emoji, tile-anchored (same pattern as raisedHands)
  const reactionTimeoutsRef = useRef({});
  const [joinedAt, setJoinedAt] = useState(null);
  const [mediaError, setMediaError] = useState(null);
  const [pinnedId, setPinnedId] = useState(null);
  // FIX (bug 2): every viewer can independently zoom the active screen share
  // to full screen, exactly like Google Meet's fullscreen-on-presentation.
  const [screenZoomed, setScreenZoomed] = useState(false);

  // FIX (Screen Share Compatibility): support is detected once on mount —
  // it depends only on the browser/OS, not on anything that changes during
  // the call — and drives whether the Present button is enabled at all.
  const [screenShareSupport] = useState(() => detectScreenShareSupport());

  // Match Google Meet: no side panel open by default — the grid uses
  // the full width until the user taps Chat/People themselves.
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarTab, setSidebarTab] = useState("chat"); // chat | people | waiting
  // FIX (bug 4): the sidebar can now be dragged wider/narrower instead of
  // only toggled open/closed.
  const [sidebarWidth, setSidebarWidth] = useState(340);
  const [isResizing, setIsResizing] = useState(false);
  // FIX (bug 6): light/dark theme, persisted locally.
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("im_theme") || "dark";
    } catch (_) {
      return "dark";
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem("im_theme", theme);
    } catch (_) {}
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", theme);
    }
    return () => {
      if (typeof document !== "undefined") {
        document.documentElement.removeAttribute("data-theme");
      }
    };
  }, [theme]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [reactionPickerOpen, setReactionPickerOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [captionsOn, setCaptionsOn] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recToggling, setRecToggling] = useState(false);
  const [pipWindow, setPipWindow] = useState(null);
  const [copyToast, setCopyToast] = useState(false);
  const [endedToast, setEndedToast] = useState(false);
  const [reactionPos, setReactionPos] = useState(null);

  const [waiting, setWaiting] = useState([]);
  const [liveCaptions, setLiveCaptions] = useState([]);
  const recognitionRef = useRef(null);
  const [captionSupport] = useState(() => detectSpeechRecognitionSupport());
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [mobileGridView, setMobileGridView] = useState(true);

  const isHost = !!connectPayload?.isHost;
  const device = useResponsiveDevice();
  const isCompactDevice = device === "phone";
  const timer = useElapsedTimer(joinedAt);
  const handRaised = !!raisedHands.you;
  const shareLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/ilmorameet/${joinCode}`
      : "";

  const rebuild = useCallback(() => {
    setParticipants(
      buildParticipantList(
        roomRef.current,
        raisedHands,
        speakingSetRef.current,
      ),
    );
  }, [raisedHands]);

  // FIX (bug 3): join/left events are notices, NOT chat messages — they now
  // live in their own toast queue instead of polluting the chat feed.
  const [notices, setNotices] = useState([]);
  const pushNotice = useCallback((text, type = "info") => {
    const id = Date.now() + Math.random();
    setNotices((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setNotices((prev) => prev.filter((n) => n.id !== id));
    }, 4500);
  }, []);

  const spawnFloater = useCallback((emoji, name) => {
    const id = Date.now() + Math.random();
    setFloaters((prev) => [...prev, { id, emoji, name }]);
    setTimeout(
      () => setFloaters((prev) => prev.filter((f) => f.id !== id)),
      2600,
    );
  }, []);

  // FIX (bug 3 / emoji reactions): shows the emoji on the sender's own
  // tile/avatar, exactly like raisedHands is keyed by identity — every
  // participant sees the reaction on the correct user's tile.
  const showReaction = useCallback((identity, emoji) => {
    if (!identity) return;
    setReactions((prev) => ({ ...prev, [identity]: emoji }));
    if (reactionTimeoutsRef.current[identity]) {
      clearTimeout(reactionTimeoutsRef.current[identity]);
    }
    reactionTimeoutsRef.current[identity] = setTimeout(() => {
      setReactions((prev) => {
        const next = { ...prev };
        delete next[identity];
        return next;
      });
    }, 3000);
  }, []);

  /* ── connect to LiveKit once we have a token ─────────────────────── */
  useEffect(() => {
    if (!connectPayload?.token) return undefined;
    const serverUrl = import.meta.env.VITE_LIVEKIT_URL || "ws://localhost:7880";
    let cancelled = false;

    const start = async () => {
      const room = new Room({ adaptiveStream: true, dynacast: true });
      roomRef.current = room;

      const onData = (payload, participant) => {
        try {
          const decoded = new TextDecoder().decode(payload);
          const msg = JSON.parse(decoded);
          if (msg.type === "chat" && msg.text) {
            setMessages((prev) => [
              ...prev,
              {
                id: Date.now() + Math.random(),
                name: participant?.name || participant?.identity || "Guest",
                senderIdentity: participant?.identity || null,
                text: msg.text,
                time: getTime(),
                self: false,
              },
            ]);
          } else if (msg.type === "reaction" && msg.emoji) {
            showReaction(participant?.identity, msg.emoji);
          } else if (msg.type === "hand") {
            setRaisedHands((prev) => ({
              ...prev,
              [participant?.identity]: !!msg.raised,
            }));
          } else if (msg.type === "caption" && msg.text) {
            const speakerName =
              participant?.name || participant?.identity || "Someone";
            setLiveCaptions((prev) => {
              const next = prev.filter(
                (c) => c.identity !== participant?.identity,
              );
              next.push({
                identity: participant?.identity,
                name: speakerName,
                text: msg.text,
                ts: Date.now(),
              });
              return next.slice(-3);
            });
          }
        } catch (_) {}
      };

      room.on(RoomEvent.TrackSubscribed, rebuild);
      room.on(RoomEvent.TrackUnsubscribed, rebuild);
      room.on(RoomEvent.TrackMuted, rebuild);
      room.on(RoomEvent.TrackUnmuted, rebuild);
      room.on(RoomEvent.LocalTrackPublished, rebuild);
      room.on(RoomEvent.LocalTrackUnpublished, rebuild);

      // FIX: publish-level events — refresh before subscribe round-trip.
      room.on(RoomEvent.TrackPublished, rebuild);
      room.on(RoomEvent.TrackUnpublished, rebuild);
      room.on(RoomEvent.ParticipantConnected, (p) => {
        rebuild();
        pushNotice(`${p.name || p.identity} joined the meeting`, "join");
      });
      room.on(RoomEvent.ParticipantDisconnected, (p) => {
        rebuild();
        pushNotice(`${p.name || p.identity} left the meeting`, "leave");
        setRaisedHands((prev) => {
          const next = { ...prev };
          delete next[p.identity];
          return next;
        });
      });
      room.on(RoomEvent.ActiveSpeakersChanged, (speakers) => {
        speakingSetRef.current = new Set(
          (speakers || []).map((s) => s.identity),
        );
        rebuild();
      });
      room.on(RoomEvent.DataReceived, onData);
      room.on(RoomEvent.Disconnected, () => setConnected(false));

      try {
        await room.connect(serverUrl, connectPayload.token);
        if (cancelled) {
          room.disconnect();
          return;
        }
        setConnected(true);
        const backendStarted =
          meetingInfo?.startedAt ||
          meetingInfo?.actualStartTime ||
          meetingInfo?.startTime;
        let startedAtMs = backendStarted
          ? new Date(backendStarted).getTime()
          : null;
        const storageKey = `im_meeting_started_${meetingId || joinCode}`;
        if (!startedAtMs) {
          try {
            const cached = localStorage.getItem(storageKey);
            if (cached) startedAtMs = Number(cached);
          } catch (_) {}
        }
        if (!startedAtMs || Number.isNaN(startedAtMs)) {
          startedAtMs = Date.now();
          try {
            localStorage.setItem(storageKey, String(startedAtMs));
          } catch (_) {}
        }
        setJoinedAt(startedAtMs);
        rebuild();
      } catch (err) {
        console.error("LiveKit connect failed:", err);
        return;
      }

      try {
        const tracks = await createLocalTracks({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
          video: { resolution: { width: 1280, height: 720 } },
        });

        camReadyPromiseRef.current = (async () => {
          const camTrack = tracks.find((t) => t.kind === Track.Kind.Video);
          if (camTrack) {
            await room.localParticipant.publishTrack(camTrack);
            localCamRef.current = camTrack;
            if (initialAV && initialAV.camOn === false) await camTrack.mute();
          }
        })();

        for (const track of tracks) {
          if (track.kind === Track.Kind.Audio) {
            await room.localParticipant.publishTrack(track);
            localMicRef.current = track;
            if (initialAV && initialAV.micOn === false) await track.mute();
          }
        }
        await camReadyPromiseRef.current;

        if (!localMicRef.current) setMicOn(false);
        if (!localCamRef.current) setCamOn(false);
        if (!localMicRef.current || !localCamRef.current) {
          setMediaError(
            !localMicRef.current && !localCamRef.current
              ? "Camera and microphone access was blocked by your browser. Allow access in your browser's site settings, then refresh."
              : !localMicRef.current
                ? "Microphone access was blocked by your browser. Allow access in your browser's site settings and try the mic button again."
                : "Camera access was blocked by your browser. Allow access in your browser's site settings and try the camera button again.",
          );
        }
      } catch (err) {
        console.error("createLocalTracks failed:", err);
        setMicOn(false);
        setCamOn(false);
        setMediaError(
          "Couldn't access your camera/microphone. Check your browser's site permissions, then refresh the page.",
        );
      }
      rebuild();
    };

    start();

    return () => {
      cancelled = true;
      try {
        roomRef.current?.disconnect();
      } catch (_) {}
      roomRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectPayload?.token]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sidebarTab, sidebarOpen]);

  /* ── host: poll the waiting room ──────────────────────────────────── */
  useEffect(() => {
    if (!isHost || !meetingId) return undefined;
    const poll = async () => {
      try {
        const res = await listPendingJoinRequests(meetingId);
        const items = (res?.data || []).map((r) => ({
          requestId: r.requestId,
          name: r.guestName,
        }));
        setWaiting(items);
      } catch (_) {}
    };
    poll();
    waitingPollRef.current = setInterval(poll, WAITING_ROOM_POLL_MS);
    return () => clearInterval(waitingPollRef.current);
  }, [isHost, meetingId]);
  /* ── live captions (client-side Web Speech API) ─────────────────────
     No transcription backend exists yet, so each browser recognizes
     only its OWN mic locally and broadcasts the text over the same
     data channel already used for chat/reactions. Chrome/Edge only. */
  useEffect(() => {
    if (!connected || !captionSupport.supported) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (_) {}
        recognitionRef.current = null;
      }
      return undefined;
    }

    const SR = captionSupport.SR;
    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let text = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }
      text = text.trim();
      if (!text) return;

      const localIdentity = roomRef.current?.localParticipant?.identity;
      setLiveCaptions((prev) => {
        const next = prev.filter((c) => c.identity !== localIdentity);
        next.push({
          identity: localIdentity,
          name: "You",
          text,
          ts: Date.now(),
        });
        return next.slice(-3);
      });

      try {
        const payload = new TextEncoder().encode(
          JSON.stringify({ type: "caption", text }),
        );
        roomRef.current?.localParticipant?.publishData(payload, {
          reliable: false,
        });
      } catch (_) {}
    };

    recognition.onerror = (e) => {
      if (e?.error === "not-allowed" || e?.error === "service-not-allowed") {
        setMediaError(
          "Captions need microphone permission. Allow mic access in your browser's site settings and try again.",
        );
      }
    };
    recognition.onend = () => {
      try {
        recognition.start();
      } catch (_) {}
    };

    try {
      recognition.start();
    } catch (_) {}
    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
      } catch (_) {}
      recognitionRef.current = null;
    };
  }, [connected, captionSupport]);

  useEffect(() => {
    if (!liveCaptions.length) return undefined;
    const id = setInterval(() => {
      setLiveCaptions((prev) => prev.filter((c) => Date.now() - c.ts < 5000));
    }, 1000);
    return () => clearInterval(id);
  }, [liveCaptions.length]);

  /* ── everyone: poll meeting status so guests learn the host ended it ── */
  /* ── everyone: poll meeting status so guests learn the host ended it ── */
  useEffect(() => {
    statusPollRef.current = setInterval(async () => {
      try {
        const res = await getMeetingByJoinCode(joinCode);
        if (res?.data?.meetingStatus === "ENDED") {
          clearInterval(statusPollRef.current);
          setEndedToast(true);
          setTimeout(() => onEndedRemotely(), 2500);
        }
      } catch (_) {}
    }, MEETING_STATUS_POLL_MS);
    return () => clearInterval(statusPollRef.current);
  }, [joinCode, onEndedRemotely]);

  /* ── controls ─────────────────────────────────────────────────────── */
  const toggleMic = useCallback(async () => {
    const room = roomRef.current;
    if (!room) return;
    try {
      const nextEnabled = !micOn;
      const pub = await room.localParticipant.setMicrophoneEnabled(
        nextEnabled,
        {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      );
      localMicRef.current = pub?.track || null;
      setMicOn(nextEnabled);
      setMediaError(null);
      rebuild();
    } catch (err) {
      console.error("Mic toggle failed:", err);
      setMediaError(
        "Couldn't access your microphone. Check your browser's site permissions and try again.",
      );
    }
  }, [micOn, rebuild]);

  const toggleCam = useCallback(async () => {
    const room = roomRef.current;
    if (!room) return;
    if (camReadyPromiseRef.current) await camReadyPromiseRef.current;
    try {
      if (!localCamRef.current) {
        // FIX (camera-while-presenting bug): omitting `audio` here let
        // createLocalTracks grab a second microphone track too, and the
        // blind [videoTrack] destructure could pick that mic track
        // instead of the camera track — so turning the camera back on
        // while screen sharing silently failed (or duplicated the mic).
        // Request video only, and select it explicitly by kind.
        const tracks = await createLocalTracks({
          audio: false,
          video: { resolution: { width: 1280, height: 720 } },
        });
        const videoTrack = tracks.find((t) => t.kind === Track.Kind.Video);
        if (!videoTrack) throw new Error("No camera track returned");
        await room.localParticipant.publishTrack(videoTrack);
        localCamRef.current = videoTrack;
        setCamOn(true);
        setMediaError(null);
        rebuild();
        return;
      }
      const track = localCamRef.current;
      if (camOn) await track.mute();
      else await track.unmute();
      setCamOn((v) => !v);
      rebuild();
    } catch (err) {
      console.error("Camera toggle failed:", err);
      setMediaError(
        "Couldn't access your camera. Check your browser's site permissions and try again.",
      );
    }
  }, [camOn, rebuild]);

  const toggleScreen = useCallback(async () => {
    const room = roomRef.current;
    if (!room) return;

    if (screenOn) {
      try {
        await room.localParticipant.setScreenShareEnabled(false);
      } catch (err) {
        console.warn("Stop screen share failed:", err);
      } finally {
        setScreenOn(false);
        rebuild();
      }
      return;
    }

    if (!screenShareSupport.supported) {
      setMediaError(
        screenShareSupport.message ||
          "Screen sharing isn't available on this device or browser.",
      );
      return;
    }

    screenSharePickerActiveRef.current = true;
    try {
      const pub = await room.localParticipant.setScreenShareEnabled(true, {
        audio: false,
        resolution: { width: 1920, height: 1080 },
        contentHint: "detail",
      });
      if (!pub) return;
      setScreenOn(true);
      setMediaError(null);
      rebuild();
      pub.track?.mediaStreamTrack?.addEventListener(
        "ended",
        () => {
          // Fires when the user stops sharing from the browser/OS's own
          // "Stop sharing" bar/indicator (Windows, macOS, Chrome, Edge) —
          // keep our button state in sync with that native control.
          room.localParticipant.setScreenShareEnabled(false).catch(() => {});
          setScreenOn(false);
          rebuild();
        },
        { once: true },
      );
    } catch (err) {
      setScreenOn(false);
      const name = err?.name || "";
      if (name === "NotAllowedError" || name === "PermissionDeniedError") {
        setMediaError(
          "Screen sharing was blocked or the picker was cancelled. Click Present again and choose a screen, window, or tab to share.",
        );
      } else if (name === "NotFoundError") {
        setMediaError(
          "No shareable screen was found. If you're on a virtual machine or remote desktop, screen sharing may be restricted there.",
        );
      } else if (name === "NotReadableError") {
        setMediaError(
          "Your screen couldn't be captured — another app may be blocking screen recording. Check your OS privacy settings and try again.",
        );
      } else if (name === "AbortError") {
        // User closed the picker — not an error worth surfacing.
      } else {
        console.warn("Screen share failed:", err);
        setMediaError(
          "Couldn't start screen sharing on this device. Try Chrome, Edge, or Firefox, or a Mac/Windows/Linux/Android device.",
        );
      }
      rebuild();
    } finally {
      screenSharePickerActiveRef.current = false;
    }
  }, [screenOn, screenShareSupport, rebuild]);

  const toggleHandRaise = useCallback(() => {
    const next = !handRaised;
    setRaisedHands((prev) => ({ ...prev, you: next }));
    try {
      const payload = new TextEncoder().encode(
        JSON.stringify({ type: "hand", raised: next }),
      );
      roomRef.current?.localParticipant?.publishData(payload, {
        reliable: true,
      });
    } catch (_) {}
  }, [handRaised]);

  const sendReaction = useCallback(
    (emoji) => {
      const localIdentity = roomRef.current?.localParticipant?.identity;
      showReaction(localIdentity, emoji);
      try {
        const payload = new TextEncoder().encode(
          JSON.stringify({ type: "reaction", emoji }),
        );
        roomRef.current?.localParticipant?.publishData(payload, {
          reliable: false,
        });
      } catch (_) {}
      setReactionPickerOpen(false);
    },
    [showReaction],
  );

  const sendMsg = useCallback(() => {
    const text = msgInput.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: "You",
        senderIdentity: roomRef.current?.localParticipant?.identity || null,
        text,
        time: getTime(),
        self: true,
      },
    ]);
    setMsgInput("");
    try {
      const payload = new TextEncoder().encode(
        JSON.stringify({ type: "chat", text }),
      );
      roomRef.current?.localParticipant?.publishData(payload, {
        reliable: true,
      });
    } catch (_) {}
  }, [msgInput]);

  const openTab = useCallback(
    (tab) => {
      if (sidebarOpen && sidebarTab === tab) setSidebarOpen(false);
      else {
        setSidebarTab(tab);
        setSidebarOpen(true);
      }
    },
    [sidebarOpen, sidebarTab],
  );

  /* ── recording (host only) ───────────────────────────────────────── */
  const toggleRecording = useCallback(() => {
    if (!isHost || recToggling) return;
    setRecToggling(true);
    setTimeout(() => {
      setRecording((v) => !v);
      setRecToggling(false);
    }, 300);
  }, [isHost, recToggling]);

  /* ── waiting room actions (host only) ────────────────────────────── */
  const handleAdmit = useCallback(
    async (requestId) => {
      if (!meetingId) return;
      try {
        await admitJoinRequest(meetingId, requestId);
        setWaiting((prev) => prev.filter((w) => w.requestId !== requestId));
      } catch (_) {}
    },
    [meetingId],
  );
  const handleDeny = useCallback(
    async (requestId) => {
      if (!meetingId) return;
      try {
        await denyJoinRequest(meetingId, requestId);
        setWaiting((prev) => prev.filter((w) => w.requestId !== requestId));
      } catch (_) {}
    },
    [meetingId],
  );
  const handleAdmitAll = useCallback(async () => {
    if (!meetingId) return;
    try {
      await admitAllJoinRequests(meetingId);
      setWaiting([]);
    } catch (_) {}
  }, [meetingId]);

  /* ── leave / end ──────────────────────────────────────────────────── */
  const handleLeave = useCallback(() => {
    try {
      roomRef.current?.disconnect();
    } catch (_) {}
    onLeft();
  }, [onLeft]);

  const endingRef = useRef(false);
  const [isEnding, setIsEnding] = useState(false);
  const handleEndForAll = useCallback(async () => {
    if (!meetingId || endingRef.current) return;
    endingRef.current = true;
    setIsEnding(true);
    try {
      await endMeeting(meetingId);
      try {
        await requestMeetingSummary(meetingId, messages);
      } catch (_) {}
    } catch (_) {}
    try {
      roomRef.current?.disconnect();
    } catch (_) {}
    onLeft();
  }, [meetingId, onLeft, messages]);

  const copyLink = useCallback(() => {
    navigator.clipboard
      ?.writeText(shareLink)
      .then(() => {
        setCopyToast(true);
        setTimeout(() => setCopyToast(false), 2000);
      })
      .catch(() => {});
  }, [shareLink]);

  /* ── sidebar drag-to-resize (bug 4) ──────────────────────────────── */
  const startResize = useCallback(
    (e) => {
      e.preventDefault();
      setIsResizing(true);
      const startX = e.touches ? e.touches[0].clientX : e.clientX;
      const startWidth = sidebarWidth;
      const onMove = (moveEvt) => {
        const clientX = moveEvt.touches
          ? moveEvt.touches[0].clientX
          : moveEvt.clientX;
        const delta = startX - clientX; // dragging left grows the sidebar
        const next = Math.min(640, Math.max(280, startWidth + delta));
        setSidebarWidth(next);
      };
      const onUp = () => {
        setIsResizing(false);
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
        window.removeEventListener("touchmove", onMove);
        window.removeEventListener("touchend", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
      window.addEventListener("touchmove", onMove, { passive: false });
      window.addEventListener("touchend", onUp);
    },
    [sidebarWidth],
  );

  /* ── PiP ──────────────────────────────────────────────────────────── */
  const screenSharer = useMemo(
    () => participants.find((p) => !!p.screenTrack),
    [participants],
  );
  const featured = useMemo(() => {
    if (screenSharer) return screenSharer;
    return (
      participants.find((p) => p.isHost) ||
      participants.find((p) => !p.isLocal) ||
      participants[0] ||
      null
    );
  }, [participants, screenSharer]);
  const stripParticipants = useMemo(
    () => participants.filter((p) => p.identity !== featured?.identity),
    [participants, featured],
  );
  const MAX_STRIP_VISIBLE = 6;
  const visibleStrip = stripParticipants.slice(0, MAX_STRIP_VISIBLE);
  const overflowCount = Math.max(
    0,
    stripParticipants.length - MAX_STRIP_VISIBLE,
  );
  // FIX (grid-everywhere UI): both mobile and desktop reference screenshots
  // show the uniform participant grid at all times when there's more than
  // one participant — no stage+filmstrip speaker layout at all. A screen
  // share still forces speaker view so the presenter's content is legible.
  const gridMode = !screenSharer && participants.length > 1;
  const effectiveGridMode = screenSharer ? false : gridMode;

  const pipTrack =
    screenSharer?.screenTrack ||
    participants.find((p) => p.isLocal)?.cameraTrack ||
    participants.find((p) => !p.isLocal && p.cameraTrack)?.cameraTrack ||
    null;
  const pipIsScreen = !!screenSharer?.screenTrack;
  const pipLabel = screenSharer
    ? `${screenSharer.name}${screenSharer.isLocal ? " (You)" : ""} is presenting`
    : "Live meeting";
  const pipSupported =
    typeof window !== "undefined" && "documentPictureInPicture" in window;

  const closePiP = useCallback(() => {
    setPipWindow((win) => {
      if (win && !win.closed) win.close();
      return null;
    });
    if (document.pictureInPictureElement)
      document.exitPictureInPicture().catch(() => {});
  }, []);

  const openPiP = useCallback(async () => {
    if (pipWindow) return;
    if (pipSupported) {
      try {
        const win = await window.documentPictureInPicture.requestWindow({
          width: 340,
          height: 220,
        });
        [...document.styleSheets].forEach((sheet) => {
          try {
            const css = [...sheet.cssRules].map((r) => r.cssText).join("");
            const style = win.document.createElement("style");
            style.textContent = css;
            win.document.head.appendChild(style);
          } catch (_) {
            if (sheet.href) {
              const link = win.document.createElement("link");
              link.rel = "stylesheet";
              link.href = sheet.href;
              win.document.head.appendChild(link);
            }
          }
        });
        win.document.body.style.margin = "0";
        win.document.body.style.background = "#000";
        win.document.body.style.overflow = "hidden";
        win.addEventListener("pagehide", () => setPipWindow(null), {
          once: true,
        });
        setPipWindow(win);
        return;
      } catch (err) {
        console.warn("Document PiP unavailable, falling back:", err);
      }
    }
    const el = pipFallbackVideoRef.current;
    if (el?.requestPictureInPicture) {
      try {
        await el.requestPictureInPicture();
      } catch (_) {}
    }
  }, [pipSupported, pipWindow]);

  const togglePiP = useCallback(() => {
    if (pipWindow || document.pictureInPictureElement) closePiP();
    else openPiP();
  }, [pipWindow, openPiP, closePiP]);

  useEffect(() => {
    if (!connected) return undefined;
    const onVisibility = () => {
      if (screenSharePickerActiveRef.current) return;
      if (document.hidden) openPiP();
      else closePiP();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [connected, openPiP, closePiP]);

  useEffect(() => () => closePiP(), []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!screenSharer) setScreenZoomed(false);
  }, [screenSharer]);
  useEffect(() => {
    if (!screenZoomed) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setScreenZoomed(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [screenZoomed]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const closeReactionPicker = useCallback(
    () => setReactionPickerOpen(false),
    [],
  );
  useDismiss(menuOpen, closeMenu, [menuBtnRef, menuPanelRef]);
  useDismiss(reactionPickerOpen, closeReactionPicker, [
    reactionBtnRef,
    reactionPanelRef,
  ]);

  const S = IM_STYLES;

  return (
    <div style={S.root} className="im-root" data-theme={theme}>
      <VideoTrackEl
        videoRef={pipFallbackVideoRef}
        track={pipTrack}
        fit={pipIsScreen ? "contain" : "cover"}
        hidden
      />

      {pipWindow &&
        createPortal(
          <PiPPanel
            track={pipTrack}
            isScreen={pipIsScreen}
            label={pipLabel}
            timer={timer}
            micOn={micOn}
            onToggleMic={toggleMic}
            onReturn={() => {
              window.focus();
              closePiP();
            }}
          />,
          pipWindow.document.body,
        )}

      {screenZoomed &&
        screenSharer &&
        createPortal(
          <div
            style={S.zoomOverlay}
            role="dialog"
            aria-label="Screen share full screen"
          >
            <VideoTrackEl track={screenSharer.screenTrack} fit="contain" />
            <div style={S.zoomOverlayBar}>
              <span style={S.zoomOverlayLabel}>
                <MonitorPlay size={14} />
                {`${screenSharer.name}${screenSharer.isLocal ? " (You)" : ""} is presenting`}
              </span>
              <button
                type="button"
                style={S.zoomExitBtn}
                onClick={() => setScreenZoomed(false)}
                aria-label="Exit full screen"
              >
                <Minimize2 size={15} />
                Exit full screen
              </button>
            </div>
          </div>,
          document.body,
        )}

      {reactionPickerOpen &&
        reactionPos &&
        createPortal(
          <div
            ref={reactionPanelRef}
            style={{
              ...S.reactionPicker,
              position: "fixed",
              left: reactionPos.left,
              top: reactionPos.top,
              bottom: "auto",
              transform: "translate(-50%, -100%)",
              zIndex: 10000,
            }}
            role="menu"
          >
            {REACTIONS.map((emoji) => (
              <button
                key={emoji}
                role="menuitem"
                style={S.reactionPickerBtn}
                onClick={() => sendReaction(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>,
          document.body,
        )}

      {endedToast && (
        <div style={S.toast} role="alert">
          <span style={{ fontSize: 18 }}>⏱️</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13 }}>
              Meeting ended by host
            </div>
            <div style={{ fontSize: 11, opacity: 0.85 }}>
              Redirecting you out…
            </div>
          </div>
        </div>
      )}
      {copyToast && (
        <div
          style={{
            ...S.toast,
            background: "#1e8e3e",
          }}
        >
          <Copy size={16} />
          <div style={{ fontWeight: 700, fontSize: 13 }}>Link copied</div>
        </div>
      )}

      {notices.length > 0 && (
        <div className="im-toast-stack" aria-live="polite">
          {notices.map((n) => (
            <div
              key={n.id}
              style={{
                ...S.noticePill,
                ...(n.type === "join"
                  ? S.noticePillJoin
                  : n.type === "leave"
                    ? S.noticePillLeave
                    : null),
              }}
            >
              {n.type === "join" ? (
                <UserPlus size={14} color="#81c995" />
              ) : n.type === "leave" ? (
                <UserMinus size={14} color="#f28b82" />
              ) : (
                <Users size={13} />
              )}
              <span>{n.text}</span>
            </div>
          ))}
        </div>
      )}

      {mediaError && (
        <div style={S.mediaErrorBar} role="alert">
          <AlertTriangle size={14} />
          <span>{mediaError}</span>
          <button
            style={S.mediaErrorClose}
            onClick={() => setMediaError(null)}
            aria-label="Dismiss"
          >
            <X size={13} />
          </button>
        </div>
      )}

      {/* ── top bar ── */}
      <div style={S.topBar} className="im-topbar">
        <div style={S.topLeft} className="im-topleft">
          <img src={texoraLogo} alt="Texora AI" style={S.logoImg} />
          <div style={S.liveBadge}>
            <span style={S.liveDot} />
            LIVE
          </div>
          <span style={S.sessionName} className="im-sessionname">
            {meetingInfo?.title || "Ilmorameet"}
          </span>
          <div style={S.timerBadge}>
            <Timer size={13} />
            {timer}
          </div>
          {recording && (
            <div style={S.recBadge}>
              <Disc2 size={11} />
              REC
            </div>
          )}
        </div>
        <div style={S.topRight} className="im-topright">
          <button
            style={S.iconGhostBtn}
            onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
            title={
              theme === "dark"
                ? "Switch to light theme"
                : "Switch to dark theme"
            }
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <button
            style={S.iconGhostBtn}
            onClick={copyLink}
            title="Copy meeting link"
            aria-label="Copy meeting link"
          >
            <ExternalLink size={15} />
          </button>
          <div style={S.peopleCountBadge}>
            <Users size={14} />
            {participants.length || 1}
          </div>
          <div
            style={{ ...S.connBadge, ...(connected ? S.connOn : S.connOff) }}
          >
            <SignalHigh size={14} />
          </div>
          {/* FIX (mobile screen-share bug): on phone-width screens, show a
              compact status pill instead of relying only on the control-bar
              button — makes the "not available on this device" state visible
              even before opening the control bar, matching the reference UI. */}
          {isCompactDevice && (
            <div
              style={{
                ...S.screenStatusPill,
                ...(screenOn
                  ? S.screenStatusPillOn
                  : !screenShareSupport.supported
                    ? S.screenStatusPillBlocked
                    : null),
              }}
              title={
                screenOn
                  ? "You're presenting"
                  : !screenShareSupport.supported
                    ? screenShareSupport.message
                    : "Screen sharing available"
              }
            >
              {screenOn ? <MonitorPlay size={14} /> : <MonitorOff size={14} />}
            </div>
          )}
          {isHost ? (
            <button
              style={{ ...S.endSessionBtn, opacity: isEnding ? 0.6 : 1 }}
              onClick={handleEndForAll}
              disabled={isEnding}
            >
              <PhoneOff size={14} />
              <span className="im-btn-label-inline">
                {isEnding ? "Ending…" : "End meeting"}
              </span>
            </button>
          ) : (
            <button
              style={{ ...S.endSessionBtn, background: "#5f6368" }}
              onClick={handleLeave}
            >
              <PhoneOff size={14} />
              <span className="im-btn-label-inline">Leave</span>
            </button>
          )}
          <div style={{ position: "relative" }}>
            <button
              ref={menuBtnRef}
              style={S.iconGhostBtn}
              onClick={() => setMenuOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
            >
              <MoreVertical size={16} />
            </button>
            {menuOpen && (
              <div ref={menuPanelRef} style={S.dropMenu} role="menu">
                <button
                  role="menuitem"
                  style={S.dropMenuItem}
                  onClick={() => {
                    setSettingsOpen(true);
                    setMenuOpen(false);
                  }}
                >
                  <Settings size={13} />
                  Settings
                </button>
                {isHost && (
                  <button
                    role="menuitem"
                    style={S.dropMenuItem}
                    onClick={() => {
                      toggleRecording();
                      setMenuOpen(false);
                    }}
                  >
                    <Disc2 size={13} />
                    {recording ? "Stop recording" : "Start recording"}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {screenOn && (
        <div style={S.presentingBar}>
          <MonitorPlay size={14} />
          <span>You're presenting to everyone</span>
          <button style={S.presentingStopBtn} onClick={toggleScreen}>
            Stop sharing
          </button>
        </div>
      )}

      {/* ── main area ── */}
      <div style={S.mainArea} className="im-mainarea">
        <div style={S.stageColumn} className="im-stagecolumn">
          {effectiveGridMode ? (
            <>
              <ParticipantGrid
                participants={participants}
                raisedHands={raisedHands}
                handRaised={handRaised}
                reactions={reactions}
                S={S}
                device={device}
              />
              {captionsOn && (
                <div style={S.captionsBar}>
                  {liveCaptions.length > 0 ? (
                    liveCaptions.map((c) => (
                      <div key={c.identity} style={S.captionLine}>
                        <span style={S.captionSpeakerName}>{c.name}:</span>
                        <span>{c.text}</span>
                      </div>
                    ))
                  ) : (
                    <div style={S.captionLine}>
                      <Captions size={14} />
                      {captionSupport.supported
                        ? "Captions will appear here when someone speaks…"
                        : "Captions aren't supported in this browser — try Chrome or Edge."}
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <>
              <StageTile
                p={featured}
                raised={
                  featured
                    ? featured.isLocal
                      ? handRaised
                      : !!raisedHands[featured.identity]
                    : false
                }
                reaction={featured ? reactions[featured.identity] : null}
                S={S}
                onMaximize={
                  featured?.screenTrack
                    ? () => setScreenZoomed(true)
                    : undefined
                }
                presenterCam={
                  screenSharer
                    ? {
                        track: screenSharer.cameraTrack,
                        cameraMuted: screenSharer.cameraMuted,
                        isLocal: screenSharer.isLocal,
                        name: screenSharer.name,
                      }
                    : null
                }
              />
              {captionsOn && (
                <div style={S.captionsBar}>
                  <Captions size={13} />
                  {liveCaptions.length > 0 ? (
                    <span>
                      {liveCaptions
                        .map((c) => `${c.name}: ${c.text}`)
                        .join("   •   ")}
                    </span>
                  ) : (
                    <span>
                      {captionSupport.supported
                        ? "Listening for speech…"
                        : "Captions aren't supported in this browser — try Chrome or Edge."}
                    </span>
                  )}
                </div>
              )}
              {(visibleStrip.length > 0 || overflowCount > 0) && (
                <div
                  data-scroll-root
                  className="im-filmstrip"
                  style={S.filmstrip}
                >
                  {visibleStrip.map((p) => (
                    <StripTile
                      key={p.identity}
                      p={p}
                      active={p.isLocal}
                      raised={
                        p.isLocal ? handRaised : !!raisedHands[p.identity]
                      }
                      reaction={reactions[p.identity]}
                      S={S}
                    />
                  ))}
                  {overflowCount > 0 && (
                    <StripOverflow
                      count={overflowCount}
                      S={S}
                      onClick={() => openTab("people")}
                    />
                  )}
                </div>
              )}
            </>
          )}
          <EmojiFloaters floaters={floaters} S={S} />
        </div>

        {sidebarOpen && (
          <div
            style={S.sidebarBackdrop}
            className="im-sidebar-backdrop"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {sidebarOpen && (
          <div
            ref={sidebarRef}
            style={{ ...S.sidebar, width: sidebarWidth }}
            className="im-sidebar"
          >
            <div style={S.tabRow}>
              <button
                style={{ ...S.tab, ...(sidebarTab === "chat" ? S.tabOn : {}) }}
                onClick={() => setSidebarTab("chat")}
              >
                <MessageSquare size={15} /> Chat
              </button>
              <button
                style={{
                  ...S.tab,
                  ...(sidebarTab === "people" ? S.tabOn : {}),
                }}
                onClick={() => setSidebarTab("people")}
              >
                <Users size={15} /> People
                <span style={S.cnt}>{participants.length || 1}</span>
              </button>
              {isHost && (
                <button
                  style={{
                    ...S.tab,
                    ...(sidebarTab === "waiting" ? S.tabOn : {}),
                  }}
                  onClick={() => setSidebarTab("waiting")}
                >
                  <Clock size={15} /> Waiting
                  {waiting.length > 0 && (
                    <span
                      style={{
                        ...S.cnt,
                        background: "rgba(253,214,99,.22)",
                        color: "#fdd663",
                      }}
                    >
                      {waiting.length}
                    </span>
                  )}
                </button>
              )}
              <button style={S.closeBtn} onClick={() => setSidebarOpen(false)}>
                <X size={16} />
              </button>
            </div>

            {sidebarTab === "chat" && (
              <div style={S.chatWrap}>
                <div style={S.msgList}>
                  {messages.map((m) =>
                    m.system ? (
                      <div key={m.id} style={S.msgRow}>
                        <div style={S.sysBubble}>{m.text}</div>
                      </div>
                    ) : (
                      <div
                        key={m.id}
                        style={{ ...S.msgCol, ...(m.self ? S.msgColSelf : {}) }}
                      >
                        <span
                          style={{
                            ...S.bHeader,
                            ...(m.self ? S.bHeaderSelf : {}),
                          }}
                        >
                          {m.self ? "You" : m.name}
                          <span style={S.bHeaderTime}>{m.time}</span>
                        </span>
                        <div
                          style={{
                            ...S.bubble,
                            ...(m.self ? S.bSelf : S.bOther),
                          }}
                        >
                          <span style={S.bText}>{m.text}</span>
                        </div>
                      </div>
                    ),
                  )}
                  <div ref={chatEndRef} />
                </div>
                <div style={S.inputRow}>
                  <input
                    style={S.chatInput}
                    placeholder="Type a message…"
                    value={msgInput}
                    onChange={(e) => setMsgInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMsg();
                      }
                    }}
                  />
                  <button style={S.sendBtn} onClick={sendMsg}>
                    <Send size={16} />
                  </button>
                </div>
              </div>
            )}

            {sidebarTab === "people" && (
              <div style={S.peopleList}>
                {participants.map((p) => (
                  <PersonRow
                    key={p.identity}
                    name={p.name}
                    isHost={p.isHost}
                    self={p.isLocal}
                    handRaised={
                      p.isLocal ? handRaised : !!raisedHands[p.identity]
                    }
                    S={S}
                  />
                ))}
                {participants.length <= 1 && (
                  <p style={S.emptyPpl}>No one else has joined yet</p>
                )}
              </div>
            )}

            {sidebarTab === "waiting" && isHost && (
              <div style={{ ...S.peopleList, paddingTop: 12 }}>
                <WaitingRoomPanel
                  waiting={waiting}
                  onAdmit={handleAdmit}
                  onDeny={handleDeny}
                  onAdmitAll={handleAdmitAll}
                  S={S}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {settingsOpen && (
        <div style={S.settingsOverlay} onClick={() => setSettingsOpen(false)}>
          <div style={S.settingsPanel} onClick={(e) => e.stopPropagation()}>
            <div style={S.settingsHead}>
              <span style={{ fontWeight: 700, fontSize: 14 }}>Settings</span>
              <button style={S.closeBtn} onClick={() => setSettingsOpen(false)}>
                <X size={16} />
              </button>
            </div>
            <div style={S.settingsBody}>
              <div style={S.settingsRow}>
                <span>Theme</span>
                <div style={S.themeSwitch}>
                  <button
                    style={{
                      ...S.themeSwitchBtn,
                      ...(theme === "dark" ? S.themeSwitchBtnOn : {}),
                    }}
                    onClick={() => setTheme("dark")}
                    aria-pressed={theme === "dark"}
                  >
                    <Moon size={13} /> Dark
                  </button>
                  <button
                    style={{
                      ...S.themeSwitchBtn,
                      ...(theme === "light" ? S.themeSwitchBtnOn : {}),
                    }}
                    onClick={() => setTheme("light")}
                    aria-pressed={theme === "light"}
                  >
                    <Sun size={13} /> Light
                  </button>
                </div>
              </div>
              <div style={S.settingsRow}>
                <span>Live captions</span>
                <button
                  style={{
                    ...S.settingsToggle,
                    ...(captionsOn ? S.settingsToggleOn : {}),
                  }}
                  onClick={() => setCaptionsOn((v) => !v)}
                >
                  {captionsOn ? "On" : "Off"}
                </button>
              </div>
              <div style={S.settingsRow}>
                <span>Meeting link</span>
                <button style={S.settingsToggle} onClick={copyLink}>
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── control bar ── */}
      <div
        style={S.ctrlBar}
        className="im-ctrlbar"
        role="toolbar"
        aria-label="Meeting controls"
      >
        {isCompactDevice ? (
          <>
            <Btn
              icon={camOn ? <Video size={18} /> : <VideoOff size={18} />}
              label="Camera"
              danger={!camOn}
              onClick={toggleCam}
              pressed={camOn}
              S={S}
            />
            <Btn
              icon={micOn ? <Mic size={18} /> : <MicOff size={18} />}
              label="Mic"
              danger={!micOn}
              onClick={toggleMic}
              pressed={micOn}
              S={S}
            />
            <div style={{ position: "relative" }}>
              <Btn
                btnRef={reactionBtnRef}
                icon={<SmilePlus size={18} />}
                label="React"
                active={reactionPickerOpen}
                onClick={() => {
                  const rect = reactionBtnRef.current?.getBoundingClientRect();
                  if (rect) {
                    setReactionPos({
                      left: rect.left + rect.width / 2,
                      top: rect.top - 10,
                    });
                  }
                  setReactionPickerOpen((v) => !v);
                }}
                ariaHasPopup="true"
                ariaExpanded={reactionPickerOpen}
                S={S}
              />
            </div>
            <Btn
              icon={<Hand size={18} />}
              label="Raise Hand"
              active={handRaised}
              onClick={toggleHandRaise}
              pressed={handRaised}
              S={S}
            />
            <Btn
              icon={<MoreVertical size={18} />}
              label="More"
              active={mobileSheetOpen}
              onClick={() => setMobileSheetOpen(true)}
              ariaHasPopup="true"
              ariaExpanded={mobileSheetOpen}
              S={S}
            />
            <Btn
              icon={<PhoneOff size={18} />}
              label={isHost ? (isEnding ? "Ending…" : "End") : "Leave"}
              leave
              disabled={isHost && isEnding}
              onClick={isHost ? handleEndForAll : handleLeave}
              S={S}
            />
          </>
        ) : (
          <>
            <Btn
              icon={micOn ? <Mic size={18} /> : <MicOff size={18} />}
              label="Mic"
              danger={!micOn}
              onClick={toggleMic}
              pressed={micOn}
              S={S}
            />
            <Btn
              icon={camOn ? <Video size={18} /> : <VideoOff size={18} />}
              label="Camera"
              danger={!camOn}
              onClick={toggleCam}
              pressed={camOn}
              S={S}
            />
            <Btn
              icon={
                screenOn ? <MonitorOff size={18} /> : <MonitorUp size={18} />
              }
              label="Present"
              active={screenOn}
              disabled={!screenOn && !screenShareSupport.supported}
              title={
                !screenOn && !screenShareSupport.supported
                  ? screenShareSupport.message
                  : undefined
              }
              onClick={toggleScreen}
              pressed={screenOn}
              S={S}
            />
            <Btn
              icon={<Hand size={18} />}
              label="Raise Hand"
              active={handRaised}
              onClick={toggleHandRaise}
              pressed={handRaised}
              S={S}
            />
            <div style={{ position: "relative" }}>
              <Btn
                btnRef={reactionBtnRef}
                icon={<SmilePlus size={18} />}
                label="React"
                active={reactionPickerOpen}
                onClick={() => {
                  const rect = reactionBtnRef.current?.getBoundingClientRect();
                  if (rect) {
                    setReactionPos({
                      left: rect.left + rect.width / 2,
                      top: rect.top - 10,
                    });
                  }
                  setReactionPickerOpen((v) => !v);
                }}
                ariaHasPopup="true"
                ariaExpanded={reactionPickerOpen}
                S={S}
              />
            </div>
            <Btn
              icon={<MessageSquare size={18} />}
              label="Chat"
              active={sidebarOpen && sidebarTab === "chat"}
              onClick={() => openTab("chat")}
              S={S}
            />
            <Btn
              icon={<Users size={18} />}
              label="People"
              badge={participants.length || 1}
              active={sidebarOpen && sidebarTab === "people"}
              onClick={() => openTab("people")}
              S={S}
            />
            <Btn
              icon={<Settings size={18} />}
              label="Settings"
              active={settingsOpen}
              onClick={() => setSettingsOpen((v) => !v)}
              S={S}
            />
            <Btn
              icon={<PhoneOff size={18} />}
              label={isHost ? (isEnding ? "Ending…" : "End") : "Leave"}
              leave
              disabled={isHost && isEnding}
              onClick={isHost ? handleEndForAll : handleLeave}
              S={S}
            />
          </>
        )}
      </div>

      {isCompactDevice && (
        <MobileMoreSheet
          open={mobileSheetOpen}
          onClose={() => setMobileSheetOpen(false)}
          handRaised={handRaised}
          onToggleHand={toggleHandRaise}
          screenOn={screenOn}
          screenShareSupport={screenShareSupport}
          onToggleScreen={() => {
            toggleScreen();
            setMobileSheetOpen(false);
          }}
          captionsOn={captionsOn}
          onToggleCaptions={() => setCaptionsOn((v) => !v)}
          pipOn={!!pipWindow}
          onTogglePip={() => {
            togglePiP();
            setMobileSheetOpen(false);
          }}
          onOpenPeople={() => {
            openTab("people");
            setMobileSheetOpen(false);
          }}
          onOpenChat={() => {
            openTab("chat");
            setMobileSheetOpen(false);
          }}
          isHost={isHost}
          waitingCount={waiting.length}
          onOpenWaiting={() => {
            openTab("waiting");
            setMobileSheetOpen(false);
          }}
          recording={recording}
          onToggleRecording={toggleRecording}
          onOpenSettings={() => {
            setSettingsOpen(true);
            setMobileSheetOpen(false);
          }}
          gridView={mobileGridView}
          onToggleLayout={() => {
            setMobileGridView((v) => !v);
            setMobileSheetOpen(false);
          }}
          onLeave={() => {
            setMobileSheetOpen(false);
            if (isHost) handleEndForAll();
            else handleLeave();
          }}
          isEnding={isEnding}
          S={S}
        />
      )}

      <style>{`
        [data-theme="dark"] {
          --im-page:#202124; --im-panel:#202124; --im-panel-elevated:#292a2d;
          --im-tile-bg:#3c4043; --im-input-bg:#3c4043;
          --im-surface3:#3c4043;
          --im-border:rgba(255,255,255,.08); --im-border-soft:rgba(255,255,255,.06);
          --im-ghost-bg:rgba(255,255,255,.08); --im-ghost-bg-soft:rgba(255,255,255,.04);
          --im-text:#e8eaed; --im-text-soft:#e8eaed; --im-text-mute:#9aa0a6; --im-text-mute2:#9aa0a6;
          --im-scrollbar: rgba(255,255,255,.2);
        }
        [data-theme="light"] {
          --im-page:#f1f3f4; --im-panel:#ffffff; --im-panel-elevated:#ffffff;
          --im-tile-bg:#e8eaed; --im-input-bg:#f1f3f4;
          --im-surface3:#f1f3f4;
          --im-border:rgba(32,33,36,.12); --im-border-soft:rgba(32,33,36,.08);
          --im-ghost-bg:rgba(32,33,36,.05); --im-ghost-bg-soft:rgba(32,33,36,.035);
          --im-text:#202124; --im-text-soft:#3c4043; --im-text-mute:#5f6368; --im-text-mute2:#5f6368;
          --im-scrollbar: rgba(32,33,36,.22);
        }
        .im-root[data-theme="light"] .im-stage,
        .im-root[data-theme="light"] .im-grid-tile,
        .im-root[data-theme="light"] .im-strip-tile { box-shadow: 0 1px 4px rgba(32,33,36,.16); }
        .im-root[data-theme="light"] input::placeholder { color: #9aa0a6; }

        @keyframes soundWave { 0%,100%{ height:3px } 50%{ height:11px } }
        .im-wave { display:flex; align-items:flex-end; gap:2px; height:12px; }
        .im-wave span { width:2.5px; border-radius:2px; background:#81c995; display:block; animation: soundWave .7s ease-in-out infinite; }
        .im-wave span:nth-child(2) { animation-delay:.12s }
        .im-wave span:nth-child(3) { animation-delay:.24s }

        .im-resize-handle { cursor: col-resize; }
        .im-resize-handle:hover, .im-resize-handle.im-resizing { background: rgba(138,180,248,.35) !important; }
        .im-toast-stack { position: fixed; top: 70px; right: 16px; z-index: 9998; display:flex; flex-direction:column; gap:8px; pointer-events:none; max-width: calc(100vw - 32px); }
        @media (max-width: 640px) {
          .im-toast-stack { left: 16px; right: 16px; align-items: center; }
        }

        @keyframes livePulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(1.5)} }
        @keyframes recBlink  { 0%,100%{opacity:1} 50%{opacity:.2} }
        @keyframes slideIn   { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
        @keyframes slideUp   { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn    { from{opacity:0} to{opacity:1} }
        @keyframes toastIn   { from{opacity:0;transform:translateX(-50%) translateY(-12px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
        @keyframes fadeScaleIn { from{opacity:0;transform:scale(0.96)} to{opacity:1;transform:scale(1)} }
        @keyframes floatUp { 0%{opacity:0;transform:translateY(0) scale(0.6)} 15%{opacity:1;transform:translateY(-20px) scale(1)} 100%{opacity:0;transform:translateY(-160px) scale(1.1)} }
        @keyframes speakGlow { 0%,100%{ box-shadow: 0 0 0 2px rgba(129,201,149,.55), 0 0 18px 1px rgba(129,201,149,.22); } 50%{ box-shadow: 0 0 0 2px rgba(129,201,149,.85), 0 0 24px 3px rgba(129,201,149,.3); } }
        @keyframes imspin { to { transform: rotate(360deg); } }
        .im-spin { animation: imspin 1s linear infinite; }

        .im-root, .im-root * { box-sizing: border-box; }
        .im-root { max-width: 100vw; }
        .im-strip-tile, .im-stage, .im-grid-tile { transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease; }
        .im-strip-tile:hover { transform: translateY(-2px); box-shadow: 0 4px 10px rgba(0,0,0,.3); }
        .im-strip-tile-active { border: 2px solid #8ab4f8 !important; }
        .im-speaking { animation: speakGlow 1.6s ease-in-out infinite; border-color: rgba(129,201,149,.6) !important; }
        .im-ctrl-btn { transition: all .16s ease; min-width: 48px; min-height: 48px; }
        .im-ctrl-btn:active { transform: scale(.94); }
        .im-sidebar { animation: slideIn .22s ease; }
        .im-stage { animation: fadeScaleIn .25s ease; }
        .im-reaction-badge { animation: fadeScaleIn .2s ease; }
        .im-sidebar-backdrop { display: none; }
        .im-btn-label { display: inline; }
        .im-btn-label-inline { display: inline; }

        .im-root button:focus { outline: none; }
        .im-root button:focus-visible, .im-root input:focus-visible { outline: 2px solid #8ab4f8; outline-offset: 2px; border-radius: 6px; }

        .im-filmstrip { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,.18) transparent; }
        .im-ctrlbar { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,.22) transparent; }
        .im-mobile-stack { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,.18) transparent; overflow-y: auto; }

        @media (max-width: 1439px) { .im-sidebar { width: 320px !important; } }
        @media (max-width: 1199px) { .im-sidebar { width: 300px !important; } .im-ctrl-btn { padding: 9px 14px !important; } }
        @media (max-width: 1023px) {
          .im-mainarea { position: relative; }
          .im-grid { grid-template-columns: repeat(var(--cols-tablet, 3), minmax(0, 1fr)) !important; }
          .im-sidebar { position: absolute !important; top:0; right:0; bottom:0; width: min(320px, 88vw) !important; z-index: 40; box-shadow: -8px 0 24px rgba(0,0,0,.4); animation: slideIn .22s ease; }
          .im-sidebar-backdrop { display: block; position: absolute; inset: 0; background: rgba(0,0,0,.35); z-index: 30; animation: fadeIn .18s ease; }
          .im-handle { display: none !important; }
        }
        @media (max-width: 767px) {
          .im-sidebar { width: 100% !important; max-width: 100% !important; }
          .im-sessionname { display: none; }
          .im-stage { border-radius: 12px !important; }
          .im-grid { grid-template-columns: repeat(var(--cols-phone, 3), minmax(0, 1fr)) !important; }
        }
        @media (max-width: 899px) {
          .im-topbar { padding: 8px 12px !important; }
          .im-ctrlbar { padding: 10px 14px !important; }
          .im-ctrl-btn { padding: 8px 12px !important; }
          .im-stagecolumn { padding: 10px !important; gap: 8px !important; }
        }
        @media (max-width: 599px) {
          .im-topbar { flex-wrap: wrap; row-gap: 6px; }
          .im-topright { order: 3; width: 100%; justify-content: flex-start; }
          .im-ctrlbar {
            padding: 8px 6px !important;
            gap: 6px !important;
            row-gap: 8px !important;
            overflow-x: visible !important;
            flex-wrap: wrap !important;
            justify-content: center !important;
          }
          .im-btn-label, .im-btn-label-inline { display: none !important; }
          .im-ctrl-btn { padding: 10px !important; border-radius: 12px !important; }
        }
        @media (max-width: 430px) {
          .im-ctrlbar {
            gap: 5px !important;
            row-gap: 8px !important;
          }
          .im-ctrl-btn { padding: 9px !important; min-width: 42px; min-height: 42px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .im-root * { animation-duration: .001ms !important; animation-iteration-count: 1 !important; transition-duration: .001ms !important; }
        }
      `}</style>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════
   PRE-JOIN / LOBBY STYLES — Google Meet light UI: white/gray surfaces,
   blue accent (#1a73e8), no orange/peach tones.
═════════════════════════════════════════════════════════════════ */
const PJ = {
  root: {
    position: "fixed",
    inset: 0,
    background: "#f1f3f4",
    overflowY: "auto",
    overflowX: "hidden",
    fontFamily: "'Google Sans','Roboto','Segoe UI',sans-serif",
    zIndex: 9999,
  },
  page: {
    position: "relative",
    maxWidth: 1180,
    margin: "0 auto",
    padding: "36px 24px 56px",
  },
  header: {
    textAlign: "center",
    marginBottom: 34,
  },
  brandRow: {
    display: "flex",
    justifyContent: "center",
    marginBottom: 18,
  },
  brandLogo: { height: 30, width: "auto", objectFit: "contain" },
  pageTitle: {
    fontSize: 34,
    fontWeight: 500,
    color: "#202124",
    margin: "0 0 8px",
    letterSpacing: -0.5,
  },
  pageTitleAccent: { color: "#1a73e8" },
  pageSubtitle: { fontSize: 15, color: "#5f6368", margin: 0 },

  card: {
    display: "flex",
    gap: 28,
    maxWidth: 1080,
    width: "100%",
    margin: "0 auto",
    flexWrap: "wrap",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  leftCol: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    width: 460,
    maxWidth: "100%",
  },
  previewBox: {
    position: "relative",
    width: "100%",
    aspectRatio: "16/10",
    background: "#3c4043",
    borderRadius: 12,
    overflow: "hidden",
    border: "1px solid rgba(32,33,36,.08)",
    boxShadow: "0 1px 4px rgba(32,33,36,.16)",
  },
  previewAvatarWrap: {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#3c4043",
  },
  previewAvatar: {
    width: 96,
    height: 96,
    borderRadius: "50%",
    background: "#1a73e8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 34,
    fontWeight: 500,
    color: "#fff",
  },
  previewWatermark: {
    position: "absolute",
    top: 14,
    right: 16,
    height: 22,
    width: "auto",
    opacity: 0.92,
  },
  previewCtrls: {
    position: "absolute",
    bottom: 14,
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    alignItems: "center",
    gap: 14,
    background: "rgba(32,33,36,.72)",
    backdropFilter: "blur(6px)",
    borderRadius: 999,
    padding: "9px 20px",
  },
  previewCtrlsDivider: {
    width: 1,
    height: 16,
    background: "rgba(255,255,255,.25)",
  },
  previewPillBtn: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    border: "none",
    background: "transparent",
    color: "#f1f3f4",
    fontSize: 13,
    fontWeight: 500,
    fontFamily: "inherit",
    cursor: "pointer",
    padding: 0,
  },
  secureBanner: {
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    background: "#ffffff",
    border: "1px solid rgba(32,33,36,.08)",
    borderRadius: 12,
    padding: "14px 16px",
    boxShadow: "0 1px 3px rgba(32,33,36,.08)",
  },
  secureIconWrap: {
    width: 34,
    height: 34,
    borderRadius: "50%",
    background: "rgba(26,115,232,.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  secureTitle: {
    fontSize: 13.5,
    fontWeight: 500,
    color: "#202124",
    margin: "2px 0 3px",
  },
  secureSubtitle: { fontSize: 12.5, color: "#5f6368", margin: 0 },

  infoCol: {
    width: 380,
    maxWidth: "100%",
    color: "#202124",
    background: "#ffffff",
    border: "1px solid rgba(32,33,36,.08)",
    borderRadius: 12,
    padding: "26px 26px 22px",
    boxShadow: "0 1px 4px rgba(32,33,36,.12)",
    overflow: "hidden",
    boxSizing: "border-box",
  },
  title: {
    fontSize: 20,
    fontWeight: 500,
    margin: "0 0 8px",
    textAlign: "center",
    wordBreak: "break-word",
    overflowWrap: "anywhere",
  },
  subtitle: {
    fontSize: 13,
    color: "#5f6368",
    margin: "0 0 4px",
    textAlign: "center",
  },
  code: {
    fontSize: 12.5,
    color: "#5f6368",
    margin: "0 0 18px",
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  copyBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    background: "rgba(32,33,36,.06)",
    color: "#5f6368",
    borderRadius: 6,
    width: 22,
    height: 22,
    cursor: "pointer",
  },
  sectionHeading: {
    textAlign: "center",
    marginBottom: 18,
    paddingBottom: 12,
    borderBottom: "1px solid rgba(32,33,36,.08)",
  },
  sectionHeadingText: {
    fontSize: 15,
    fontWeight: 500,
    color: "#202124",
    margin: "0 0 8px",
  },
  sectionHeadingDash: {
    display: "flex",
    justifyContent: "center",
    gap: 6,
  },
  dashOrange: {
    width: 36,
    height: 3,
    borderRadius: 2,
    background: "#1a73e8",
    display: "inline-block",
  },
  label: {
    fontSize: 12,
    fontWeight: 500,
    color: "#3c4043",
    marginBottom: 6,
    display: "block",
  },
  input: {
    width: "100%",
    background: "#ffffff",
    border: "1px solid rgba(32,33,36,.16)",
    borderRadius: 8,
    padding: "11px 14px",
    color: "#202124",
    fontSize: 14,
    marginBottom: 14,
    outline: "none",
    fontFamily: "inherit",
  },
  warnText: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 11,
    color: "#b06000",
    marginBottom: 10,
  },
  errText: { fontSize: 12, color: "#d93025", marginBottom: 10 },
  joinBtn: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    background: "#1a73e8",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "13px 0",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    boxShadow: "0 1px 2px rgba(26,115,232,.3)",
  },
  hint: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    fontSize: 11.5,
    color: "#5f6368",
    marginTop: 12,
    textAlign: "center",
  },
};

const LB = {
  card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
    textAlign: "center",
    maxWidth: 380,
    color: "#3c4043",
    fontFamily: "'Google Sans','Roboto','Segoe UI',sans-serif",
  },
  pulseWrap: {
    position: "relative",
    width: 60,
    height: 60,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  pulseDot: {
    position: "absolute",
    inset: 0,
    borderRadius: "50%",
    background: "rgba(26,115,232,.12)",
    animation: "livePulse 1.6s ease-in-out infinite",
  },
  title: { fontSize: 18, fontWeight: 500, margin: 0, color: "#202124" },
  subtitle: { fontSize: 13, color: "#5f6368", margin: 0 },
  cancelBtn: {
    marginTop: 10,
    background: "#ffffff",
    border: "1px solid rgba(32,33,36,.16)",
    color: "#3c4043",
    borderRadius: 8,
    padding: "9px 20px",
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
  },
};

/* ═════════════════════════════════════════════════════════════════
   MEETING ROOM STYLES — Google Meet visual language: flat charcoal
   surfaces, uniform 12px tile radius, blue (#1a73e8/#8ab4f8) accent,
   red (#ea4335) only on the leave/end control.
═════════════════════════════════════════════════════════════════ */
const IM_STYLES = {
  root: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    width: "100%",
    background: "var(--im-page)",
    fontFamily: "'Google Sans','Roboto','Segoe UI',sans-serif",
    color: "var(--im-text-soft)",
    overflow: "hidden",
  },
  toast: {
    position: "fixed",
    top: 16,
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 99999,
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "14px 24px",
    borderRadius: 8,
    background: "#d93025",
    color: "#fff",
    boxShadow: "0 2px 10px rgba(217,48,37,.4)",
    animation: "toastIn .35s ease",
    minWidth: 280,
  },
  noticePill: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "9px 14px",
    borderRadius: 8,
    background: "var(--im-panel-elevated)",
    border: "1px solid var(--im-border)",
    borderLeft: "3px solid var(--im-border)",
    color: "var(--im-text-soft)",
    fontSize: 12,
    fontWeight: 500,
    boxShadow: "0 2px 8px rgba(0,0,0,.3)",
    animation: "toastIn .3s ease",
    pointerEvents: "none",
    maxWidth: 280,
  },
  noticePillJoin: { borderLeft: "3px solid #81c995" },
  noticePillLeave: { borderLeft: "3px solid #f28b82" },

  topBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 20px",
    background: "var(--im-panel)",
    borderBottom: "1px solid var(--im-border-soft)",
    flexShrink: 0,
    flexWrap: "wrap",
    gap: 8,
  },
  topLeft: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" },
  topRight: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  },
  liveBadge: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "rgba(242,139,130,.14)",
    border: "1px solid rgba(242,139,130,.28)",
    borderRadius: 8,
    padding: "5px 10px",
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: 1.2,
    color: "#ea4335",
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "#ea4335",
    animation: "livePulse 1.2s ease-in-out infinite",
    display: "inline-block",
  },
  recBadge: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    background: "rgba(92,43,41,.35)",
    border: "1px solid rgba(242,139,130,.25)",
    borderRadius: 8,
    padding: "5px 10px",
    fontSize: 11,
    fontWeight: 500,
    color: "#f6aea9",
    animation: "recBlink 2s infinite",
  },
  timerBadge: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    fontWeight: 500,
    color: "var(--im-text-soft)",
    background: "var(--im-ghost-bg)",
    borderRadius: 8,
    padding: "5px 10px",
    fontVariantNumeric: "tabular-nums",
  },
  sessionName: {
    fontSize: 15,
    fontWeight: 500,
    color: "var(--im-text)",
    marginLeft: 2,
  },
  logoImg: {
    height: 30,
    width: "auto",
    maxWidth: 130,
    objectFit: "contain",
    flexShrink: 0,
    display: "block",
  },
  peopleCountBadge: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    fontWeight: 500,
    color: "var(--im-text-soft)",
    background: "var(--im-ghost-bg)",
    borderRadius: 8,
    padding: "6px 10px",
  },
  connBadge: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    padding: "6px 9px",
  },
  connOn: {
    background: "rgba(129,201,149,.12)",
    border: "1px solid rgba(129,201,149,.28)",
    color: "#81c995",
  },
  connOff: {
    background: "rgba(154,160,166,.1)",
    border: "1px solid rgba(154,160,166,.2)",
    color: "var(--im-text-mute2)",
  },
  // FIX (mobile screen-share bug): compact top-bar status pill, shown
  // only on phone, so the screen-share availability state is visible
  // at a glance (matches the reference mobile UI's icon in the row).
  screenStatusPill: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    padding: "6px 9px",
    background: "var(--im-ghost-bg)",
    border: "1px solid var(--im-border)",
    color: "var(--im-text-mute2)",
  },
  screenStatusPillOn: {
    background: "rgba(138,180,248,.16)",
    border: "1px solid rgba(138,180,248,.32)",
    color: "#8ab4f8",
  },
  screenStatusPillBlocked: {
    background: "rgba(242,139,130,.14)",
    border: "1px solid rgba(242,139,130,.4)",
    color: "#f28b82",
  },
  endSessionBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "#ea4335",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "9px 16px",
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
    boxShadow: "none",
  },
  iconGhostBtn: {
    background: "var(--im-ghost-bg)",
    border: "1px solid var(--im-border)",
    borderRadius: 8,
    padding: 8,
    color: "var(--im-text-mute2)",
    cursor: "pointer",
    display: "flex",
  },
  dropMenu: {
    position: "absolute",
    top: "calc(100% + 8px)",
    right: 0,
    background: "var(--im-panel-elevated)",
    border: "1px solid var(--im-border)",
    borderRadius: 8,
    padding: 6,
    minWidth: 190,
    boxShadow: "0 2px 10px rgba(0,0,0,.4)",
    zIndex: 50,
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  dropMenuItem: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "none",
    border: "none",
    color: "var(--im-text-soft)",
    fontSize: 12,
    fontWeight: 500,
    padding: "8px 10px",
    borderRadius: 8,
    cursor: "pointer",
    textAlign: "left",
  },

  reactionPicker: {
    position: "absolute",
    bottom: "calc(100% + 10px)",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    gap: 4,
    padding: "8px 10px",
    background: "var(--im-panel-elevated)",
    border: "1px solid var(--im-border)",
    borderRadius: 999,
    boxShadow: "0 2px 10px rgba(0,0,0,.4)",
    zIndex: 50,
    animation: "slideUp .16s ease",
  },
  reactionPickerBtn: {
    width: 36,
    height: 36,
    border: "none",
    background: "transparent",
    fontSize: 19,
    cursor: "pointer",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  ctrlBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    background: "#1a73e8",
    color: "#fff",
    fontSize: 9,
    fontWeight: 500,
    borderRadius: 8,
    padding: "1px 5px",
    border: "2px solid var(--im-panel)",
    lineHeight: 1.3,
  },

  mainArea: {
    flex: 1,
    display: "flex",
    overflow: "hidden",
    position: "relative",
    minWidth: 0,
  },
  stageColumn: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 14,
    padding: 6,
    overflow: "hidden",
    minWidth: 0,
    position: "relative",
    maxWidth: 1800,
    width: "100%",
    margin: "0 auto",
  },
  stageOuter: {
    flex: "1 1 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 0,
    minWidth: 0,
    maxHeight: "calc(100% - 132px)",
    overflow: "hidden",
  },
  stage: {
    position: "relative",
    background: "var(--im-tile-bg)",
    borderRadius: 12,
    overflow: "hidden",
    border: "1px solid var(--im-border)",
    boxShadow: "0 1px 4px rgba(0,0,0,.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    aspectRatio: "16/9",
    height: "100%",
    width: "auto",
    maxWidth: "100%",
    maxHeight: "100%",
  },
  stageEmpty: { color: "var(--im-text-mute)", fontSize: 13, fontWeight: 500 },
  stageAvatarWrap: {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "transparent",
  },
  stageAvatar: {
    width: 108,
    height: 108,
    borderRadius: "50%",
    background: "#1a73e8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 40,
    fontWeight: 500,
    color: "#fff",
  },
  stageNameTag: {
    position: "absolute",
    bottom: 16,
    left: 16,
    display: "flex",
    alignItems: "center",
    gap: 7,
    fontSize: 13,
    fontWeight: 500,
    color: "#fff",
    background: "rgba(32,33,36,.72)",
    borderRadius: 8,
    padding: "6px 12px",
    maxWidth: "calc(100% - 96px)",
  },
  nameEllipsis: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    minWidth: 0,
    maxWidth: "100%",
    display: "inline-block",
  },
  stageHostTag: {
    position: "absolute",
    top: 16,
    right: 16,
    fontSize: 12,
    fontWeight: 500,
    color: "#8ab4f8",
    background: "rgba(138,180,248,.18)",
    border: "1px solid rgba(138,180,248,.25)",
    borderRadius: 8,
    padding: "4px 12px",
  },
  stageHandBadge: {
    position: "absolute",
    top: 60,
    left: 16,
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 11,
    fontWeight: 500,
    color: "#202124",
    background: "#fdd663",
    borderRadius: 8,
    padding: "5px 10px",
    boxShadow: "none",
    animation: "recBlink 1.4s infinite",
  },
  stageReactionBadge: {
    position: "absolute",
    bottom: 16,
    right: 16,
    fontSize: 30,
    lineHeight: 1,
    filter: "drop-shadow(0 2px 6px rgba(0,0,0,.3))",
    pointerEvents: "none",
  },
  screenLabel: {
    position: "absolute",
    top: 16,
    left: 16,
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    fontWeight: 500,
    color: "#fff",
    background: "rgba(32,33,36,.72)",
    borderRadius: 8,
    padding: "5px 10px",
  },
  stageZoomBtn: {
    position: "absolute",
    top: 16,
    right: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 34,
    height: 34,
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,.18)",
    background: "rgba(32,33,36,.72)",
    color: "#fff",
    cursor: "pointer",
  },
  presenterCamBubble: {
    position: "absolute",
    bottom: 16,
    right: 16,
    width: 118,
    aspectRatio: "4/3",
    borderRadius: 8,
    overflow: "hidden",
    border: "2px solid rgba(255,255,255,.25)",
    boxShadow: "0 2px 8px rgba(0,0,0,.4)",
    zIndex: 5,
  },
  presenterCamName: {
    position: "absolute",
    bottom: 4,
    left: 6,
    fontSize: 10,
    fontWeight: 500,
    color: "#fff",
    background: "rgba(32,33,36,.68)",
    borderRadius: 6,
    padding: "1px 6px",
  },
  zoomOverlay: {
    position: "fixed",
    inset: 0,
    zIndex: 9990,
    background: "#000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    animation: "fadeIn .18s ease",
  },
  zoomOverlayBar: {
    position: "fixed",
    top: 16,
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    alignItems: "center",
    gap: 12,
    background: "rgba(32,33,36,.78)",
    border: "1px solid rgba(255,255,255,.14)",
    borderRadius: 8,
    padding: "8px 10px 8px 16px",
  },
  zoomOverlayLabel: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    fontSize: 13,
    fontWeight: 500,
    color: "#e8eaed",
    whiteSpace: "nowrap",
  },
  zoomExitBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "rgba(255,255,255,.1)",
    border: "1px solid rgba(255,255,255,.18)",
    color: "#fff",
    borderRadius: 8,
    padding: "7px 12px",
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  captionsBar: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(32,33,36,.85)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    borderRadius: 8,
    padding: "12px 22px",
    fontSize: 15,
    lineHeight: 1.45,
    color: "#f8f9fa",
    flexShrink: 0,
    maxWidth: "88%",
    margin: "0 auto",
    textAlign: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,.3)",
  },
  captionLine: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    flexWrap: "wrap",
  },
  captionSpeakerName: {
    fontWeight: 500,
    color: "#fdd663",
  },
  presentingBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: "8px 16px",
    background: "rgba(138,180,248,.14)",
    borderBottom: "1px solid rgba(138,180,248,.25)",
    color: "#8ab4f8",
    fontSize: 12,
    fontWeight: 500,
    flexShrink: 0,
    flexWrap: "wrap",
  },
  presentingStopBtn: {
    background: "#1a73e8",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "4px 12px",
    fontSize: 11,
    fontWeight: 500,
    cursor: "pointer",
  },
  mediaErrorBar: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "8px 16px",
    background: "rgba(253,214,99,.16)",
    borderBottom: "1px solid rgba(253,214,99,.3)",
    color: "#fdd663",
    fontSize: 12,
    fontWeight: 500,
    flexShrink: 0,
    flexWrap: "wrap",
  },
  mediaErrorClose: {
    background: "none",
    border: "none",
    color: "#fdd663",
    cursor: "pointer",
    display: "flex",
    marginLeft: "auto",
    padding: 2,
  },
  floaterLayer: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    overflow: "hidden",
    zIndex: 40,
  },
  floater: {
    position: "absolute",
    bottom: 70,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
    animation: "floatUp 2.4s ease-out forwards",
  },
  floaterEmoji: {
    fontSize: 34,
    filter: "drop-shadow(0 2px 6px rgba(0,0,0,.3))",
  },
  floaterName: {
    fontSize: 10,
    fontWeight: 500,
    color: "#fff",
    background: "rgba(32,33,36,.55)",
    padding: "2px 7px",
    borderRadius: 8,
    whiteSpace: "nowrap",
  },

  filmstrip: {
    flexShrink: 0,
    flexGrow: 0,
    height: 112,
    display: "flex",
    gap: 8,
    padding: "2px 2px 6px",
    overflowX: "auto",
    overflowY: "hidden",
  },
  stripTile: {
    position: "relative",
    flex: "0 0 auto",
    width: "clamp(112px, 15vw, 220px)",
    height: "100%",
    background: "var(--im-tile-bg)",
    borderRadius: 12,
    overflow: "hidden",
    border: "1px solid var(--im-border)",
    boxShadow: "0 1px 3px rgba(0,0,0,.25)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  stripOverflow: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "var(--im-ghost-bg)",
    border: "1px solid var(--im-border)",
    fontFamily: "inherit",
    padding: 0,
  },
  stripAvatarWrap: {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  stripAvatar: {
    width: "40%",
    aspectRatio: "1/1",
    minWidth: 34,
    maxWidth: 56,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 17,
    fontWeight: 500,
    color: "#fff",
  },
  stripBadgeTopLeft: {
    position: "absolute",
    top: 8,
    left: 8,
    width: 20,
    height: 20,
    borderRadius: "50%",
    background: "#fdd663",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  stripMicDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: "50%",
    background: "rgba(32,33,36,.72)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
  },
  stripName: {
    position: "absolute",
    bottom: 7,
    left: 8,
    fontSize: 11,
    fontWeight: 500,
    color: "#fff",
    background: "rgba(32,33,36,.68)",
    borderRadius: 6,
    padding: "2px 8px",
    maxWidth: "calc(100% - 14px)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  stripReactionBadge: {
    position: "absolute",
    bottom: 6,
    right: 8,
    fontSize: 18,
    lineHeight: 1,
    filter: "drop-shadow(0 1px 4px rgba(0,0,0,.3))",
    pointerEvents: "none",
  },

  /* FIX (mobile UI): full-width stacked participant list, one card per
     row, used only when isCompactDevice (phone) is true. */
  mobileStackWrap: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 14,
    overflowY: "auto",
    paddingBottom: 4,
  },
  mobileTile: {
    position: "relative",
    width: "100%",
    aspectRatio: "16/9", // fixed, deterministic height — same across every tile
    flexShrink: 0,
    background: "var(--im-tile-bg)",
    borderRadius: 12,
    overflow: "hidden",
    border: "1px solid var(--im-border)",
    boxShadow: "0 1px 4px rgba(0,0,0,.25)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  mobileTileActive: {
    border: "2px solid #8ab4f8",
  },
  mobileTileAvatarWrap: {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  mobileTileAvatar: {
    width: 96,
    height: 96,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 34,
    fontWeight: 500,
    color: "#fff",
  },
  mobileTileTopLeft: {
    position: "absolute",
    top: 10,
    left: 10,
    display: "flex",
    gap: 6,
  },
  mobileTileIconPill: {
    width: 26,
    height: 26,
    borderRadius: "50%",
    background: "rgba(32,33,36,.72)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  mobileTileMenuBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: "50%",
    background: "rgba(32,33,36,.55)",
    border: "none",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  mobileTileName: {
    position: "absolute",
    bottom: 10,
    left: 10,
    fontSize: 12,
    fontWeight: 500,
    color: "#fff",
    background: "rgba(32,33,36,.68)",
    borderRadius: 8,
    padding: "4px 10px",
    maxWidth: "calc(100% - 20px)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  mobileTileReactionBadge: {
    position: "absolute",
    bottom: 10,
    right: 46,
    fontSize: 26,
    lineHeight: 1,
    filter: "drop-shadow(0 2px 6px rgba(0,0,0,.3))",
    pointerEvents: "none",
  },

  /* Grid tiles: fixed, video-like aspect ratio, same size, centered —
     matches Meet's uniform card grid rather than stretched rows. */
  gridWrap: {
    flex: 1,
    display: "flex",
    flexWrap: "wrap",
    alignContent: "stretch",
    alignItems: "stretch",
    justifyContent: "center",
    gap: 3,
    minHeight: 0,
    minWidth: 0,
    height: "100%",
    width: "100%",
    padding: 0,
  },
  gridCellOuter: {
    display: "flex",
    minHeight: 0,
    minWidth: 0,
  },
  gridTile: {
    position: "relative",
    background: "var(--im-tile-bg)",
    borderRadius: 4,
    overflow: "hidden",
    border: "none",
    boxShadow: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  gridAvatar: {
    width: "26%",
    aspectRatio: "1/1",
    minWidth: 40,
    maxWidth: 96,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "clamp(16px,3vw,32px)",
    fontWeight: 500,
    color: "#fff",
  },
  gridNameTag: {
    position: "absolute",
    bottom: 10,
    left: 10,
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    fontWeight: 500,
    color: "#fff",
    background: "rgba(32,33,36,.72)",
    borderRadius: 8,
    padding: "4px 9px",
    maxWidth: "calc(100% - 20px)",
    overflow: "hidden",
  },
  gridHostTag: {
    position: "absolute",
    top: 10,
    right: 10,
    fontSize: 10,
    fontWeight: 500,
    color: "#8ab4f8",
    background: "rgba(138,180,248,.18)",
    border: "1px solid rgba(138,180,248,.25)",
    borderRadius: 6,
    padding: "3px 8px",
  },
  gridHandBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    width: 24,
    height: 24,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#fdd663",
    borderRadius: "50%",
  },
  gridReactionBadge: {
    position: "absolute",
    bottom: 10,
    right: 10,
    fontSize: 22,
    lineHeight: 1,
    filter: "drop-shadow(0 2px 6px rgba(0,0,0,.3))",
    pointerEvents: "none",
  },

  handle: {
    width: 6,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "var(--im-border)",
    border: "none",
    cursor: "col-resize",
    flexShrink: 0,
    padding: 0,
    touchAction: "none",
  },
  sidebar: {
    width: 340,
    maxWidth: "100%",
    background: "var(--im-panel)",
    borderLeft: "1px solid var(--im-border-soft)",
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
    minWidth: 0,
  },
  sidebarBackdrop: { display: "none" },
  tabRow: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "12px 14px",
    borderBottom: "1px solid var(--im-border-soft)",
    flexShrink: 0,
    flexWrap: "wrap",
  },
  tab: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: "9px 0 11px",
    border: "none",
    borderBottom: "2px solid transparent",
    background: "transparent",
    color: "var(--im-text-mute)",
    cursor: "pointer",
    fontSize: 13,
    fontFamily: "inherit",
    fontWeight: 500,
  },
  tabOn: { color: "#8ab4f8", borderBottom: "2px solid #8ab4f8" },
  cnt: {
    fontSize: 11,
    background: "rgba(138,180,248,.2)",
    color: "#8ab4f8",
    borderRadius: 10,
    padding: "1px 7px",
    marginLeft: 3,
  },
  closeBtn: {
    background: "none",
    border: "none",
    color: "var(--im-text-mute)",
    cursor: "pointer",
    display: "flex",
    marginLeft: "auto",
    padding: 4,
  },

  chatWrap: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    minHeight: 0,
  },
  msgList: {
    flex: 1,
    overflowY: "auto",
    padding: "16px 16px",
    display: "flex",
    flexDirection: "column",
    gap: 14,
    minHeight: 0,
  },
  msgRow: {
    display: "flex",
    alignItems: "flex-end",
    gap: 7,
    justifyContent: "center",
  },
  msgCol: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    maxWidth: "82%",
    alignSelf: "flex-start",
  },
  msgColSelf: { alignSelf: "flex-end", alignItems: "flex-end" },
  bHeader: {
    display: "flex",
    alignItems: "baseline",
    gap: 8,
    fontSize: 12,
    fontWeight: 500,
    color: "#8ab4f8",
    padding: "0 2px",
  },
  bHeaderSelf: { color: "#8ab4f8" },
  bHeaderTime: { fontSize: 11, fontWeight: 400, color: "var(--im-text-mute)" },
  sysBubble: {
    fontSize: 12,
    color: "var(--im-text-mute2)",
    background: "var(--im-ghost-bg)",
    borderRadius: 8,
    padding: "6px 14px",
    fontWeight: 500,
  },
  bubble: {
    maxWidth: "100%",
    borderRadius: 12,
    padding: "9px 14px",
    display: "flex",
    flexDirection: "column",
    gap: 2,
    wordBreak: "break-word",
  },
  bSelf: {
    background: "#1a73e8",
    borderBottomRightRadius: 4,
  },
  bOther: { background: "var(--im-surface3)", borderBottomLeftRadius: 4 },
  bText: { fontSize: 14, color: "var(--im-text)", lineHeight: 1.45 },
  inputRow: {
    display: "flex",
    gap: 8,
    padding: "12px 14px",
    borderTop: "1px solid var(--im-border-soft)",
    flexShrink: 0,
  },
  chatInput: {
    flex: 1,
    minWidth: 0,
    background: "var(--im-input-bg)",
    border: "1px solid var(--im-border)",
    borderRadius: 999,
    padding: "10px 16px",
    color: "var(--im-text-soft)",
    fontSize: 13,
    fontFamily: "inherit",
    outline: "none",
  },
  sendBtn: {
    background: "#1a73e8",
    border: "none",
    borderRadius: "50%",
    width: 40,
    height: 40,
    color: "#fff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  peopleList: {
    flex: 1,
    overflowY: "auto",
    padding: "10px 12px",
    display: "flex",
    flexDirection: "column",
    gap: 4,
    minHeight: 0,
  },
  emptyPpl: {
    fontSize: 12,
    color: "var(--im-text-mute)",
    textAlign: "center",
    marginTop: 20,
  },
  pRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "8px 10px",
    borderRadius: 8,
    background: "var(--im-ghost-bg-soft)",
  },
  pAv: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 14,
    fontWeight: 500,
    flexShrink: 0,
    color: "#fff",
  },
  pName: {
    flex: 1,
    fontSize: 13,
    color: "var(--im-text-soft)",
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  hostTag: {
    fontSize: 10,
    background: "rgba(138,180,248,.15)",
    color: "#8ab4f8",
    padding: "2px 8px",
    borderRadius: 6,
    fontWeight: 500,
    flexShrink: 0,
  },
  youTag: {
    fontSize: 10,
    background: "rgba(129,201,149,.12)",
    color: "#81c995",
    padding: "2px 8px",
    borderRadius: 6,
    fontWeight: 500,
    flexShrink: 0,
  },

  settingsOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,.5)",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  settingsPanel: {
    width: 320,
    maxWidth: "100%",
    background: "var(--im-panel-elevated)",
    border: "1px solid var(--im-border)",
    borderRadius: 12,
    overflow: "hidden",
    boxShadow: "0 4px 20px rgba(0,0,0,.5)",
  },
  settingsHead: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 16px",
    borderBottom: "1px solid var(--im-border-soft)",
  },
  settingsBody: {
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  settingsRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: 13,
    color: "var(--im-text-soft)",
  },
  settingsToggle: {
    border: "1px solid var(--im-border)",
    background: "var(--im-ghost-bg)",
    color: "var(--im-text-mute2)",
    borderRadius: 20,
    padding: "5px 14px",
    fontSize: 11,
    fontWeight: 500,
    cursor: "pointer",
  },
  settingsToggleOn: {
    background: "rgba(138,180,248,.22)",
    borderColor: "rgba(138,180,248,.4)",
    color: "#8ab4f8",
  },
  mobileSheetBackdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,.45)",
    zIndex: 9997,
    animation: "fadeIn .18s ease",
  },
  mobileSheet: {
    position: "fixed",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9998,
    background: "var(--im-panel-elevated)",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: "10px 16px calc(env(safe-area-inset-bottom, 0px) + 18px)",
    display: "flex",
    flexDirection: "column",
    gap: 10,
    boxShadow: "0 -4px 20px rgba(0,0,0,.4)",
    animation: "slideUp .22s ease",
    maxHeight: "80vh",
    overflowY: "auto",
  },
  mobileSheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 4,
    background: "var(--im-border)",
    alignSelf: "center",
    marginBottom: 4,
  },
  mobileSheetPillWide: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: "100%",
    border: "1px solid var(--im-border)",
    background: "var(--im-ghost-bg)",
    color: "var(--im-text-soft)",
    borderRadius: 999,
    padding: "13px 0",
    fontSize: 14,
    fontWeight: 500,
    fontFamily: "inherit",
    cursor: "pointer",
  },
  mobileSheetPillActive: {
    background: "rgba(138,180,248,.22)",
    borderColor: "rgba(138,180,248,.4)",
    color: "#8ab4f8",
  },
  mobileSheetLeaveBtn: {
    background: "#ea4335",
    borderColor: "#ea4335",
    color: "#fff",
  },
  mobileSheetIconRow: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 8,
  },
  mobileSheetIconBtn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 5,
    border: "1px solid var(--im-border)",
    background: "var(--im-ghost-bg-soft)",
    color: "var(--im-text-soft)",
    borderRadius: 12,
    padding: "12px 4px",
    fontSize: 10,
    fontWeight: 500,
    fontFamily: "inherit",
    cursor: "pointer",
  },
  mobileSheetIconBtnActive: {
    background: "rgba(138,180,248,.22)",
    borderColor: "rgba(138,180,248,.4)",
    color: "#8ab4f8",
  },
  mobileSheetRow2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 8,
  },
  mobileSheetPillHalf: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    border: "1px solid var(--im-border)",
    background: "var(--im-ghost-bg)",
    color: "var(--im-text-soft)",
    borderRadius: 999,
    padding: "11px 0",
    fontSize: 12.5,
    fontWeight: 500,
    fontFamily: "inherit",
    cursor: "pointer",
  },
  themeSwitch: {
    display: "flex",
    gap: 4,
    background: "var(--im-ghost-bg)",
    border: "1px solid var(--im-border)",
    borderRadius: 20,
    padding: 3,
  },
  themeSwitchBtn: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    border: "none",
    background: "transparent",
    color: "var(--im-text-mute2)",
    borderRadius: 16,
    padding: "5px 11px",
    fontSize: 11,
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  themeSwitchBtnOn: {
    background: "rgba(138,180,248,.22)",
    color: "#8ab4f8",
  },

  ctrlBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "14px 20px",
    background: "var(--im-panel)",
    borderTop: "1px solid var(--im-border-soft)",
    flexShrink: 0,
    overflowX: "auto",
    flexWrap: "nowrap",
  },
};

