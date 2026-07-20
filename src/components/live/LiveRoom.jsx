// import { useEffect, useRef, useState, useCallback, useMemo } from "react";
// import { createPortal } from "react-dom";
// import { Room, RoomEvent, Track, createLocalTracks } from "livekit-client";
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
//   ChevronRight,
//   ChevronLeft,
//   Send,
//   X,
//   Radio,
//   Timer,
//   Disc2,
//   Wifi,
//   WifiOff,
//   AlertTriangle,
//   PictureInPicture2,
//   Hand,
//   Settings,
//   Captions,
//   MoreVertical,
//   SignalHigh,
// } from "lucide-react";
// import {
//   getSessionById,
//   participantJoin,
//   participantLeave,
// } from "@/services/liveSessionService";

// const getTime = () =>
//   new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

// // ── Timer: derives elapsed time from a persisted wall-clock `startedAt`
// // timestamp instead of an in-memory counter that always began at 0. On
// // refresh/back/reconnect, the caller passes the ORIGINAL join timestamp
// // back in, so the timer picks up exactly where it left off. (UNCHANGED)
// const useLiveTimer = (running, startedAt) => {
//   const [secs, setSecs] = useState(() =>
//     startedAt ? Math.max(0, Math.floor((Date.now() - startedAt) / 1000)) : 0,
//   );

//   useEffect(() => {
//     if (!running) return;
//     const anchor = startedAt || Date.now();
//     const tick = () => setSecs(Math.max(0, Math.floor((Date.now() - anchor) / 1000)));
//     tick();
//     const id = setInterval(tick, 1000);
//     return () => clearInterval(id);
//   }, [running, startedAt]);

//   const hh = String(Math.floor(secs / 3600)).padStart(2, "0");
//   const mm = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
//   const ss = String(secs % 60).padStart(2, "0");
//   return `${hh}:${mm}:${ss}`;
// };

// // ────────────────────────────────────────────────────────────────
// // Track rendering primitives (UNCHANGED). Each track gets its OWN
// // persistent DOM node via track.attach(el) instead of one shared
// // container whose innerHTML kept getting wiped.
// // ────────────────────────────────────────────────────────────────
// function VideoTrackEl({ track, mirrored, fit = "cover", hidden, videoRef }) {
//   const internalRef = useRef(null);
//   useEffect(() => {
//     const el = internalRef.current;
//     if (!track || !el) return;
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
//     if (!track || !el) return;
//     track.attach(el);
//     return () => {
//       try {
//         track.detach(el);
//       } catch (_) {}
//     };
//   }, [track]);
//   return <audio ref={ref} autoPlay />;
// }

// // PiP window content (UNCHANGED logic, restyled slightly to match dark theme)
// function PiPPanel({ track, isScreen, label, timer, micOn, onToggleMic, onReturn }) {
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

// // Cheap viewport awareness so many tiles don't all decode video at once (UNCHANGED)
// function useInView(ref) {
//   const [inView, setInView] = useState(true);
//   useEffect(() => {
//     const el = ref.current;
//     if (!el || typeof IntersectionObserver === "undefined") return;
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

// // ────────────────────────────────────────────────────────────────
// // Small strip tile — used under the main stage (Image 4 style)
// // ────────────────────────────────────────────────────────────────
// function StripTile({ p, active }) {
//   const wrapRef = useRef(null);
//   const inView = useInView(wrapRef);
//   const hasVideo = !!p.cameraTrack && !p.cameraMuted && inView;
//   const initial = (p.name || "?").trim().charAt(0).toUpperCase() || "?";

//   return (
//     <div
//       ref={wrapRef}
//       className={`lr-strip-tile${active ? " lr-strip-tile-active" : ""}`}
//       style={S.stripTile}
//     >
//       {hasVideo ? (
//         <VideoTrackEl track={p.cameraTrack} mirrored={p.isLocal} fit="cover" />
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

//       <div style={S.stripMicDot}>
//         {p.micMuted ? <MicOff size={10} /> : <Mic size={10} />}
//       </div>
//       <div style={S.stripName}>{p.isLocal ? "You" : p.name}</div>
//     </div>
//   );
// }

// // Overflow bubble ("+N others") — purely presentational, mirrors Image 4
// function StripOverflow({ count }) {
//   return (
//     <div style={{ ...S.stripTile, ...S.stripOverflow }} className="lr-strip-tile">
//       <span style={{ fontSize: 13, fontWeight: 700, color: "#cbd5e1" }}>
//         +{count}
//       </span>
//       <span style={{ fontSize: 9, color: "#64748b", marginTop: 2 }}>others</span>
//     </div>
//   );
// }

// // ────────────────────────────────────────────────────────────────
// // Main "stage" tile — whoever is featured (screen share > host/trainer
// // > first remote > local). Large, rounded, name tag bottom-left.
// // ────────────────────────────────────────────────────────────────
// function StageTile({ p }) {
//   if (!p) {
//     return (
//       <div style={S.stage}>
//         <div style={S.stageEmpty}>Waiting for participants…</div>
//       </div>
//     );
//   }

//   const isScreen = !!p.screenTrack;
//   const track = isScreen ? p.screenTrack : p.cameraTrack;
//   const hasVideo = !!track && (isScreen || !p.cameraMuted);
//   const initial = (p.name || "?").trim().charAt(0).toUpperCase() || "?";

//   return (
//     <div style={S.stage} className="lr-stage">
//       {hasVideo ? (
//         <VideoTrackEl track={track} mirrored={!isScreen && p.isLocal} fit={isScreen ? "contain" : "cover"} />
//       ) : (
//         <div style={S.stageAvatarWrap}>
//           <div style={S.stageAvatar}>{initial}</div>
//         </div>
//       )}

//       {!p.isLocal && p.micTrack && <AudioTrackEl track={p.micTrack} />}

//       {isScreen && (
//         <div style={S.screenLabel}>
//           <MonitorPlay size={13} />
//           {p.isLocal ? "You are presenting" : `${p.name} is presenting`}
//         </div>
//       )}

//       <div style={S.stageNameTag}>
//         {p.micMuted ? <MicOff size={13} /> : <Mic size={13} />}
//         <span>{p.isLocal ? "You" : p.name}</span>
//       </div>

//       {p.isHost && !p.isLocal && <span style={S.stageHostTag}>Host</span>}
//     </div>
//   );
// }

// const LiveRoom = ({
//   token,
//   roomName,
//   sessionId,
//   joinedAt, // persisted wall-clock join time (ms) — keeps the timer
//   // correct across refresh/back/reconnect instead of restarting at 00:00
//   onSessionEnded,
//   onLeave,
// }) => {
//   const roomRef = useRef(null);
//   const localVideoTrackRef = useRef(null);
//   const localAudioTrackRef = useRef(null);
//   const chatEndRef = useRef(null);
//   const autoEndPollRef = useRef(null);

//   const [connected, setConnected] = useState(false);
//   const [micOn, setMicOn] = useState(true);
//   const [camOn, setCamOn] = useState(true);
//   const [screenOn, setScreenOn] = useState(false);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [sidebarTab, setSidebarTab] = useState("chat");
//   const [trainerOnline, setTrainerOnline] = useState(false);
//   const [participants, setParticipants] = useState([]); // single source of truth for tiles + people list
//   const [msgInput, setMsgInput] = useState("");
//   const [sessionEndedWarning, setSessionEndedWarning] = useState(false);
//   const [mediaError, setMediaError] = useState(null);

//   // ── UI-only additions to match the target design's control bar.
//   // These do not call any API, LiveKit method, or socket event — they
//   // are purely local, presentational toggles (hand raise indicator,
//   // settings/captions placeholders, and the REC badge visibility).
//   const [handRaised, setHandRaised] = useState(false);
//   const [settingsOpen, setSettingsOpen] = useState(false);
//   const [captionsOn, setCaptionsOn] = useState(false);
//   const [recordingBadge, setRecordingBadge] = useState(true);
//   const [menuOpen, setMenuOpen] = useState(false);

//   const [messages, setMessages] = useState(() => [
//     {
//       id: 1,
//       name: "System",
//       text: "Session started. Welcome!",
//       time: getTime(),
//       self: false,
//       system: true,
//     },
//   ]);

//   const timer = useLiveTimer(connected, joinedAt);

//   const pushSystemMsg = useCallback((text) => {
//     setMessages((prev) => [
//       ...prev,
//       {
//         id: Date.now(),
//         name: "System",
//         text,
//         time: getTime(),
//         self: false,
//         system: true,
//       },
//     ]);
//   }, []);

//   // Builds ONE participant list (local + remote), each with its own
//   // camera/mic/screen-share track references. Drives the stage, the
//   // strip, and the People sidebar tab. (UNCHANGED)
//   const syncParticipants = useCallback(() => {
//     const room = roomRef.current;
//     if (!room) return;

//     const list = [];

//     const lp = room.localParticipant;
//     const localEntry = {
//       identity: "you",
//       name: "You",
//       isLocal: true,
//       isHost: false,
//       cameraTrack: null,
//       cameraMuted: true,
//       micTrack: null,
//       micMuted: true,
//       screenTrack: null,
//     };
//     lp.trackPublications.forEach((pub) => {
//       if (!pub.track) return;
//       if (pub.source === Track.Source.Camera) {
//         localEntry.cameraTrack = pub.track;
//         localEntry.cameraMuted = pub.isMuted;
//       } else if (pub.source === Track.Source.Microphone) {
//         localEntry.micTrack = pub.track;
//         localEntry.micMuted = pub.isMuted;
//       } else if (pub.source === Track.Source.ScreenShare) {
//         localEntry.screenTrack = pub.track;
//       }
//     });
//     list.push(localEntry);

//     room.remoteParticipants.forEach((p) => {
//       const entry = {
//         identity: p.identity,
//         name: p.name || p.identity,
//         isLocal: false,
//         isHost: true, // kept from original behavior (role isn't provided by the API)
//         cameraTrack: null,
//         cameraMuted: true,
//         micTrack: null,
//         micMuted: true,
//         screenTrack: null,
//       };
//       p.trackPublications.forEach((pub) => {
//         if (!pub.isSubscribed || !pub.track) return;
//         if (pub.source === Track.Source.Camera) {
//           entry.cameraTrack = pub.track;
//           entry.cameraMuted = pub.isMuted;
//         } else if (pub.source === Track.Source.Microphone) {
//           entry.micTrack = pub.track;
//           entry.micMuted = pub.isMuted;
//         } else if (pub.source === Track.Source.ScreenShare) {
//           entry.screenTrack = pub.track;
//         }
//       });
//       list.push(entry);
//     });

//     setParticipants(list);
//   }, []);

//   useEffect(() => {
//     const serverUrl =
//       (typeof import.meta !== "undefined" &&
//         import.meta.env?.VITE_LIVEKIT_URL) ||
//       "ws://localhost:7880";

//     const start = async () => {
//       const room = new Room({ adaptiveStream: true, dynacast: true });
//       roomRef.current = room;

//       const onChange = () => syncParticipants();

//       room
//         .on(RoomEvent.TrackSubscribed, onChange)
//         .on(RoomEvent.TrackUnsubscribed, onChange)
//         .on(RoomEvent.TrackMuted, onChange)
//         .on(RoomEvent.TrackUnmuted, onChange)
//         .on(RoomEvent.LocalTrackPublished, onChange)
//         .on(RoomEvent.LocalTrackUnpublished, onChange)
//         .on(RoomEvent.ParticipantConnected, (p) => {
//           setTrainerOnline(true);
//           onChange();
//           pushSystemMsg(`${p.name || p.identity} joined`);
//         })
//         .on(RoomEvent.ParticipantDisconnected, (p) => {
//           onChange();
//           pushSystemMsg(`${p.name || p.identity} left`);
//         })
//         .on(RoomEvent.Disconnected, () => {
//           setConnected(false);
//           setTrainerOnline(false);
//         })
//         .on(RoomEvent.DataReceived, (payload, participant) => {
//           try {
//             const decoded = new TextDecoder().decode(payload);
//             const msg = JSON.parse(decoded);
//             if (msg.text) {
//               setMessages((prev) => [
//                 ...prev,
//                 {
//                   id: Date.now(),
//                   name: participant?.name || participant?.identity || "Trainer",
//                   text: msg.text,
//                   time: getTime(),
//                   self: false,
//                 },
//               ]);
//             }
//           } catch (_) {}
//         });

//       try {
//         await room.connect(serverUrl, token);
//         setConnected(true);

//         if (sessionId) {
//           try {
//             const user = JSON.parse(localStorage.getItem("lms_user") || "{}");
//             const batchId = user?.batchId || 1;
//             const trainerEmail = user?.trainerEmail || "";
//             await participantJoin(sessionId, batchId, trainerEmail);
//           } catch (e) {
//             console.warn("participantJoin DB call failed:", e);
//           }
//         }

//         if (sessionId) {
//           autoEndPollRef.current = setInterval(async () => {
//             try {
//               const res = await getSessionById(sessionId);
//               if (res?.data?.status === "ENDED") {
//                 clearInterval(autoEndPollRef.current);
//                 setSessionEndedWarning(true);
//                 setTimeout(() => {
//                   roomRef.current?.disconnect();
//                   if (typeof onSessionEnded === "function") onSessionEnded();
//                 }, 3000);
//               }
//             } catch (_) {}
//           }, 20000);
//         }

//         try {
//           const tracks = await createLocalTracks({ audio: true, video: true });
//           for (const track of tracks) {
//             await room.localParticipant.publishTrack(track);
//             if (track.kind === Track.Kind.Video) localVideoTrackRef.current = track;
//             if (track.kind === Track.Kind.Audio) localAudioTrackRef.current = track;
//           }
//         } catch (mediaErr) {
//           console.error("getUserMedia failed:", mediaErr);
//           setMediaError(
//             "Couldn't access your camera/microphone. Check browser permissions and reload the page.",
//           );
//         }

//         if (room.remoteParticipants.size > 0) setTrainerOnline(true);
//         syncParticipants();
//       } catch (err) {
//         console.error("LiveKit error:", err);
//         setConnected(false);
//       }
//     };

//     start();

//     return () => {
//       if (autoEndPollRef.current) clearInterval(autoEndPollRef.current);
//       if (sessionId) {
//         participantLeave(sessionId).catch(() => {});
//       }
//       roomRef.current?.disconnect();
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [token]);

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, sidebarTab, sidebarOpen]);

//   const toggleMic = useCallback(async () => {
//     const track = localAudioTrackRef.current;
//     if (!track) return;
//     if (micOn) await track.mute();
//     else await track.unmute();
//     setMicOn((v) => !v);
//     syncParticipants();
//   }, [micOn, syncParticipants]);

//   const toggleCam = useCallback(async () => {
//     const track = localVideoTrackRef.current;
//     if (!track) return;
//     if (camOn) await track.mute();
//     else await track.unmute();
//     setCamOn((v) => !v);
//     syncParticipants();
//   }, [camOn, syncParticipants]);

//   // Screen share publishes as its own track/source (UNCHANGED). The
//   // stage picks it up automatically via `screenSharer` below.
//   const toggleScreen = useCallback(async () => {
//     const room = roomRef.current;
//     if (!room) return;
//     try {
//       if (screenOn) {
//         await room.localParticipant.setScreenShareEnabled(false);
//         setScreenOn(false);
//       } else {
//         const pub = await room.localParticipant.setScreenShareEnabled(true);
//         if (!pub) return;
//         setScreenOn(true);
//         const mediaTrack = pub.track?.mediaStreamTrack;
//         if (mediaTrack) {
//           mediaTrack.addEventListener("ended", () => {
//             room.localParticipant.setScreenShareEnabled(false).catch(() => {});
//             setScreenOn(false);
//             syncParticipants();
//           });
//         }
//       }
//     } catch (err) {
//       console.warn("Screen share toggle failed/cancelled:", err);
//     } finally {
//       syncParticipants();
//     }
//   }, [screenOn, syncParticipants]);

//   const handleLeave = useCallback(() => {
//     if (autoEndPollRef.current) clearInterval(autoEndPollRef.current);
//     if (sessionId) {
//       participantLeave(sessionId).catch(() => {});
//     }
//     roomRef.current?.disconnect();
//     localVideoTrackRef.current?.stop();
//     localAudioTrackRef.current?.stop();
//     if (typeof onLeave === "function") onLeave();
//   }, [onLeave, sessionId]);

//   const sendMsg = useCallback(() => {
//     const text = msgInput.trim();
//     if (!text) return;
//     setMessages((prev) => [
//       ...prev,
//       { id: Date.now(), name: "You", text, time: getTime(), self: true },
//     ]);
//     setMsgInput("");
//     try {
//       const payload = new TextEncoder().encode(JSON.stringify({ text }));
//       roomRef.current?.localParticipant?.publishData(payload, {
//         reliable: true,
//       });
//     } catch (e) {
//       console.warn("data send failed:", e);
//     }
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

//   // Any participant (local or remote) currently sharing their screen
//   // becomes the big "stage" — same as before.
//   const screenSharer = useMemo(
//     () => participants.find((p) => !!p.screenTrack),
//     [participants],
//   );

//   // ── Derived UI grouping only (no data/logic change): who is shown
//   // large on the stage vs. who sits in the strip underneath, matching
//   // Image 4 (big trainer video, small tiles below).
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
//   const overflowCount = Math.max(0, stripParticipants.length - MAX_STRIP_VISIBLE);

//   // ── Picture-in-Picture (UNCHANGED logic)
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

//   const [pipWindow, setPipWindow] = useState(null);
//   const pipFallbackVideoRef = useRef(null);
//   const pipSupported =
//     typeof window !== "undefined" && "documentPictureInPicture" in window;

//   const closePiP = useCallback(() => {
//     setPipWindow((win) => {
//       if (win && !win.closed) win.close();
//       return null;
//     });
//     if (document.pictureInPictureElement) {
//       document.exitPictureInPicture().catch(() => {});
//     }
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
//     if (el && el.requestPictureInPicture) {
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
//     if (!connected) return;
//     const onVisibility = () => {
//       if (document.hidden) openPiP();
//       else closePiP();
//     };
//     document.addEventListener("visibilitychange", onVisibility);
//     return () => document.removeEventListener("visibilitychange", onVisibility);
//   }, [connected, openPiP, closePiP]);

//   useEffect(() => {
//     return () => closePiP();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   return (
//     <div style={S.root} className="lr-root">
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

//       {sessionEndedWarning && (
//         <div style={S.autoEndToast} className="lr-toast">
//           <span style={{ fontSize: 18 }}>⏱️</span>
//           <div>
//             <div style={{ fontWeight: 700, fontSize: 13 }}>
//               Session ended by trainer
//             </div>
//             <div style={{ fontSize: 11, opacity: 0.85 }}>
//               Redirecting you out in 3 seconds…
//             </div>
//           </div>
//         </div>
//       )}

//       {mediaError && (
//         <div className="lr-toast" style={{ ...S.autoEndToast, background: "linear-gradient(135deg,#b45309,#f59e0b)" }}>
//           <AlertTriangle size={18} />
//           <div>
//             <div style={{ fontWeight: 700, fontSize: 13 }}>Camera/Mic issue</div>
//             <div style={{ fontSize: 11, opacity: 0.9 }}>{mediaError}</div>
//           </div>
//         </div>
//       )}

//       {/* ── TOP NAV (Image 4) ───────────────────────────────────── */}
//       <div style={S.topBar} className="lr-topbar">
//         <div style={S.topLeft} className="lr-topleft">
//           <div style={S.logo}>
//             <div style={S.logoMark}>
//               <Radio size={14} />
//             </div>
//             <span style={S.logoText}>ILM ORA</span>
//           </div>
//           <div style={S.liveBadge}>
//             <span style={S.liveDot} />
//             LIVE
//           </div>
//           <span style={S.sessionName} className="lr-sessionname">
//             {roomName || "Live Session"}
//           </span>
//           <div style={S.timerBadge}>
//             <Timer size={12} />
//             {timer}
//           </div>
//           {recordingBadge && (
//             <div style={S.recBadge}>
//               <Disc2 size={11} />
//               REC
//             </div>
//           )}
//         </div>
//         <div style={S.topRight} className="lr-topright">
//           <div style={S.peopleCountBadge}>
//             <Users size={13} />
//             {participants.length || 1}
//           </div>
//           <div
//             style={{ ...S.connBadge, ...(connected ? S.connOn : S.connOff) }}
//           >
//             <SignalHigh size={13} />
//           </div>
//           <button style={S.endSessionBtn} onClick={handleLeave}>
//             <PhoneOff size={14} />
//             <span className="lr-btn-label">End Session</span>
//           </button>
//           <div style={{ position: "relative" }}>
//             <button
//               style={S.iconGhostBtn}
//               onClick={() => setMenuOpen((v) => !v)}
//               title="More options"
//             >
//               <MoreVertical size={16} />
//             </button>
//             {menuOpen && (
//               <div style={S.dropMenu}>
//                 <button
//                   style={S.dropMenuItem}
//                   onClick={() => {
//                     setRecordingBadge((v) => !v);
//                     setMenuOpen(false);
//                   }}
//                 >
//                   <Disc2 size={13} />
//                   {recordingBadge ? "Hide REC badge" : "Show REC badge"}
//                 </button>
//                 <button
//                   style={S.dropMenuItem}
//                   onClick={() => {
//                     setSettingsOpen(true);
//                     setMenuOpen(false);
//                   }}
//                 >
//                   <Settings size={13} />
//                   Settings
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* ── MAIN AREA ───────────────────────────────────────────── */}
//       <div style={S.mainArea}>
//         <div style={S.stageColumn} className="lr-stagecolumn">
//           <StageTile p={featured} />

//           {captionsOn && (
//             <div style={S.captionsBar}>
//               <Captions size={13} />
//               <span>Live captions are enabled for this session.</span>
//             </div>
//           )}

//           {(visibleStrip.length > 0 || overflowCount > 0) && (
//             <div data-scroll-root className="lr-filmstrip" style={S.filmstrip}>
//               {visibleStrip.map((p) => (
//                 <StripTile key={p.identity} p={p} active={p.isLocal} />
//               ))}
//               {overflowCount > 0 && <StripOverflow count={overflowCount} />}
//             </div>
//           )}
//         </div>

//         {/* Handle */}
//         <div
//           style={S.handle}
//           className="lr-handle"
//           onClick={() => setSidebarOpen((v) => !v)}
//           title={sidebarOpen ? "Collapse" : "Expand"}
//         >
//           {sidebarOpen ? (
//             <ChevronRight size={15} color="#64748b" />
//           ) : (
//             <ChevronLeft size={15} color="#64748b" />
//           )}
//         </div>

//         {/* Sidebar */}
//         {sidebarOpen && (
//           <div style={S.sidebar} className="lr-sidebar">
//             <div style={S.tabRow}>
//               <button
//                 style={{ ...S.tab, ...(sidebarTab === "chat" ? S.tabOn : {}) }}
//                 onClick={() => setSidebarTab("chat")}
//               >
//                 <MessageSquare size={13} /> Chat
//               </button>
//               <button
//                 style={{
//                   ...S.tab,
//                   ...(sidebarTab === "people" ? S.tabOn : {}),
//                 }}
//                 onClick={() => setSidebarTab("people")}
//               >
//                 <Users size={13} /> People
//                 <span style={S.cnt}>{participants.length || 1}</span>
//               </button>
//               <button style={S.closeBtn} onClick={() => setSidebarOpen(false)}>
//                 <X size={14} />
//               </button>
//             </div>

//             {sidebarTab === "chat" && (
//               <div style={S.chatWrap}>
//                 <div style={S.msgList}>
//                   {messages.map((m) => (
//                     <div
//                       key={m.id}
//                       style={{ ...S.msgRow, ...(m.self ? S.msgSelf : {}) }}
//                     >
//                       {!m.self && !m.system && (
//                         <div style={S.av}>{m.name[0]}</div>
//                       )}
//                       {m.system ? (
//                         <div style={S.sysBubble}>{m.text}</div>
//                       ) : (
//                         <div
//                           style={{
//                             ...S.bubble,
//                             ...(m.self ? S.bSelf : S.bOther),
//                           }}
//                         >
//                           {!m.self && <span style={S.bName}>{m.name}</span>}
//                           <span style={S.bText}>{m.text}</span>
//                           <span style={S.bTime}>{m.time}</span>
//                         </div>
//                       )}
//                     </div>
//                   ))}
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
//                     <Send size={14} />
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
//                     handRaised={p.isLocal && handRaised}
//                   />
//                 ))}
//                 {participants.length <= 1 && (
//                   <p style={S.emptyPpl}>No other participants yet</p>
//                 )}
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* ── SETTINGS PANEL (UI-only placeholder, matches Image 4's
//            "Settings" control — no device/session logic wired) ──── */}
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
//                 <span>Show REC badge</span>
//                 <button
//                   style={{
//                     ...S.settingsToggle,
//                     ...(recordingBadge ? S.settingsToggleOn : {}),
//                   }}
//                   onClick={() => setRecordingBadge((v) => !v)}
//                 >
//                   {recordingBadge ? "On" : "Off"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── CONTROL BAR (Image 4) ──────────────────────────────── */}
//       <div style={S.ctrlBar} className="lr-ctrlbar">
//         <Btn
//           icon={micOn ? <Mic size={18} /> : <MicOff size={18} />}
//           label="Mic"
//           danger={!micOn}
//           onClick={toggleMic}
//         />
//         <Btn
//           icon={camOn ? <Video size={18} /> : <VideoOff size={18} />}
//           label="Camera"
//           danger={!camOn}
//           onClick={toggleCam}
//         />
//         <Btn
//           icon={screenOn ? <MonitorOff size={18} /> : <MonitorUp size={18} />}
//           label="Present"
//           active={screenOn}
//           onClick={toggleScreen}
//         />
//         <Btn
//           icon={<Hand size={18} />}
//           label="Raise Hand"
//           active={handRaised}
//           onClick={() => setHandRaised((v) => !v)}
//         />
//         <Btn
//           icon={<MessageSquare size={18} />}
//           label="Chat"
//           active={sidebarOpen && sidebarTab === "chat"}
//           onClick={() => openTab("chat")}
//         />
//         <Btn
//           icon={<Users size={18} />}
//           label="People"
//           active={sidebarOpen && sidebarTab === "people"}
//           onClick={() => openTab("people")}
//         />
//         <Btn
//           icon={<Settings size={18} />}
//           label="Settings"
//           active={settingsOpen}
//           onClick={() => setSettingsOpen((v) => !v)}
//         />
//         <Btn
//           icon={<Captions size={18} />}
//           label="Captions"
//           active={captionsOn}
//           onClick={() => setCaptionsOn((v) => !v)}
//         />
//         <Btn
//           icon={<Disc2 size={18} />}
//           label="Record"
//           active={recordingBadge}
//           onClick={() => setRecordingBadge((v) => !v)}
//         />
//         <Btn
//           icon={<PictureInPicture2 size={18} />}
//           label="PiP"
//           active={!!pipWindow}
//           onClick={togglePiP}
//         />
//         <Btn
//           icon={<PhoneOff size={18} />}
//           label="Leave"
//           leave
//           onClick={handleLeave}
//         />
//       </div>

//       <style>{`
//         @keyframes livePulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(1.5)} }
//         @keyframes recBlink  { 0%,100%{opacity:1} 50%{opacity:.2} }
//         @keyframes slideIn   { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
//         @keyframes toastIn   { from{opacity:0;transform:translateX(-50%) translateY(-12px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
//         @keyframes fadeScaleIn { from{opacity:0;transform:scale(0.96)} to{opacity:1;transform:scale(1)} }

//         .lr-tile, .lr-strip-tile, .lr-stage { transition: transform 0.18s ease, box-shadow 0.18s ease; }
//         .lr-strip-tile:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0,0,0,0.35); }
//         .lr-strip-tile-active { border: 2px solid #818cf8 !important; }
//         .lr-ctrl-btn { transition: all 0.16s ease; }
//         .lr-ctrl-btn:active { transform: scale(0.94); }
//         .lr-sidebar { animation: slideIn .2s ease; }
//         .lr-stage { animation: fadeScaleIn .25s ease; }

//         /* ══════════════════════════════════════════════════════════
//            Responsive system — desktop → laptop → iPad Pro → iPad →
//            iPad mini → tablet → iPhone Pro Max → iPhone → iPhone SE
//            ══════════════════════════════════════════════════════════ */

//         .lr-btn-label { display: inline; }

//         @media (max-width: 1439px) {
//           .lr-sidebar { width: 300px !important; }
//         }

//         @media (max-width: 1199px) {
//           .lr-sidebar { width: 280px !important; }
//           .lr-ctrl-btn { padding: 9px 14px !important; }
//         }

//         @media (max-width: 1023px) {
//           .lr-sidebar {
//             position: fixed !important;
//             inset: 0 !important;
//             top: 54px !important;
//             width: 100% !important;
//             z-index: 500 !important;
//           }
//           .lr-handle { display: none !important; }
//         }

//         @media (max-width: 899px) {
//           .lr-topbar { padding: 8px 12px !important; }
//           .lr-ctrlbar { padding: 10px 14px !important; }
//           .lr-ctrl-btn { padding: 8px 12px !important; }
//           .lr-stagecolumn { padding: 10px !important; gap: 8px !important; }
//         }

//         @media (max-width: 767px) {
//           .lr-sessionname { display: none; }
//           .lr-stage { border-radius: 12px !important; }
//         }

//         @media (max-width: 599px) {
//           .lr-topbar { flex-wrap: wrap; row-gap: 6px; }
//           .lr-topright { order: 3; width: 100%; justify-content: flex-start; }
//           .lr-ctrlbar { padding: 8px 6px !important; gap: 3px !important; overflow-x: auto; }
//           .lr-btn-label { display: none !important; }
//           .lr-ctrl-btn { padding: 10px !important; border-radius: 12px !important; }
//         }

//         @media (max-width: 430px) {
//           .lr-stagecolumn { padding: 6px !important; gap: 6px !important; }
//           .lr-filmstrip { padding: 6px 8px !important; gap: 6px !important; }
//         }

//         @media (max-width: 375px) {
//           .lr-ctrl-btn { padding: 8px !important; }
//           .lr-topbar { padding: 6px 8px !important; }
//         }

//         @media (max-width: 420px) {
//           .lr-toast { min-width: unset !important; width: 92vw !important; padding: 10px 14px !important; }
//         }

//         @media (max-height: 480px) and (orientation: landscape) {
//           .lr-topbar { padding: 4px 10px !important; }
//           .lr-ctrlbar { padding: 6px 12px !important; }
//           .lr-ctrl-btn { padding: 6px 10px !important; gap: 2px !important; }
//         }
//       `}</style>
//     </div>
//   );
// };

// const PersonRow = ({ name, isHost, self, handRaised }) => (
//   <div style={S.pRow}>
//     <div
//       style={{
//         ...S.pAv,
//         background: self
//           ? "linear-gradient(135deg,#0ea5e9,#6366f1)"
//           : "linear-gradient(135deg,#8b5cf6,#ec4899)",
//       }}
//     >
//       {name[0]}
//     </div>
//     <span style={S.pName}>{name}</span>
//     {handRaised && <Hand size={13} color="#fbbf24" />}
//     {isHost && <span style={S.hostTag}>Host</span>}
//     {self && <span style={S.youTag}>You</span>}
//   </div>
// );

// const Btn = ({ icon, label, active, danger, leave, onClick }) => {
//   const [hov, setHov] = useState(false);
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
//           ? "rgba(99,102,241,.38)"
//           : "rgba(99,102,241,.22)"
//         : hov
//           ? "rgba(255,255,255,.14)"
//           : "rgba(255,255,255,.07)";
//   const col = leave
//     ? "#fff"
//     : danger
//       ? "#fca5a5"
//       : active
//         ? "#a5b4fc"
//         : "#cbd5e1";
//   return (
//     <button
//       className="lr-ctrl-btn"
//       onClick={onClick}
//       onMouseEnter={() => setHov(true)}
//       onMouseLeave={() => setHov(false)}
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         gap: 4,
//         background: bg,
//         color: col,
//         border: danger
//           ? "1px solid rgba(239,68,68,.3)"
//           : active
//             ? "1px solid rgba(99,102,241,.35)"
//             : "1px solid transparent",
//         borderRadius: 14,
//         padding: "10px 16px",
//         cursor: "pointer",
//         fontSize: 10,
//         fontWeight: 600,
//         fontFamily: "inherit",
//         letterSpacing: 0.2,
//         flexShrink: 0,
//       }}
//     >
//       {icon}
//       <span className="lr-btn-label">{label}</span>
//     </button>
//   );
// };

// const S = {
//   root: {
//     display: "flex",
//     flexDirection: "column",
//     height: "100vh",
//     background: "#07090f",
//     fontFamily: "'DM Sans','Segoe UI',sans-serif",
//     color: "#e2e8f0",
//     overflow: "hidden",
//   },
//   autoEndToast: {
//     position: "fixed",
//     top: 60,
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
//     fontFamily: "'DM Sans','Segoe UI',sans-serif",
//     boxShadow: "0 8px 32px rgba(244,63,94,0.5)",
//     animation: "toastIn 0.35s ease",
//     minWidth: 300,
//   },

//   /* TOP NAV */
//   topBar: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: "10px 20px",
//     background: "#0d1117",
//     borderBottom: "1px solid rgba(255,255,255,.06)",
//     flexShrink: 0,
//     flexWrap: "wrap",
//     gap: 8,
//   },
//   topLeft: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" },
//   topRight: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" },
//   logo: { display: "flex", alignItems: "center", gap: 8, paddingRight: 6, borderRight: "1px solid rgba(255,255,255,.08)", marginRight: 2 },
//   logoMark: {
//     width: 24,
//     height: 24,
//     borderRadius: 7,
//     background: "linear-gradient(135deg,#f97316,#ef4444)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     color: "#fff",
//   },
//   logoText: { fontSize: 13, fontWeight: 800, letterSpacing: 0.5, color: "#f1f5f9" },
//   liveBadge: {
//     display: "flex",
//     alignItems: "center",
//     gap: 5,
//     background: "rgba(239,68,68,.14)",
//     border: "1px solid rgba(239,68,68,.28)",
//     borderRadius: 8,
//     padding: "3px 9px",
//     fontSize: 10,
//     fontWeight: 800,
//     letterSpacing: 1.5,
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
//     gap: 4,
//     background: "rgba(248,113,113,.09)",
//     border: "1px solid rgba(248,113,113,.18)",
//     borderRadius: 8,
//     padding: "3px 8px",
//     fontSize: 10,
//     fontWeight: 700,
//     letterSpacing: 1,
//     color: "#fca5a5",
//     animation: "recBlink 2s infinite",
//   },
//   timerBadge: {
//     display: "flex",
//     alignItems: "center",
//     gap: 5,
//     fontSize: 12,
//     fontWeight: 600,
//     color: "#94a3b8",
//     background: "rgba(255,255,255,.05)",
//     borderRadius: 8,
//     padding: "3px 10px",
//     fontVariantNumeric: "tabular-nums",
//   },
//   sessionName: {
//     fontSize: 14,
//     fontWeight: 600,
//     color: "#f1f5f9",
//     marginLeft: 2,
//   },
//   peopleCountBadge: {
//     display: "flex",
//     alignItems: "center",
//     gap: 5,
//     fontSize: 12,
//     fontWeight: 600,
//     color: "#cbd5e1",
//     background: "rgba(255,255,255,.05)",
//     borderRadius: 8,
//     padding: "4px 10px",
//   },
//   connBadge: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     borderRadius: 8,
//     padding: "5px 8px",
//   },
//   connOn: {
//     background: "rgba(52,211,153,.1)",
//     border: "1px solid rgba(52,211,153,.24)",
//     color: "#34d399",
//   },
//   connOff: {
//     background: "rgba(100,116,139,.1)",
//     border: "1px solid rgba(100,116,139,.2)",
//     color: "#94a3b8",
//   },
//   endSessionBtn: {
//     display: "flex",
//     alignItems: "center",
//     gap: 6,
//     background: "#ef4444",
//     color: "#fff",
//     border: "none",
//     borderRadius: 10,
//     padding: "8px 16px",
//     fontSize: 12,
//     fontWeight: 700,
//     cursor: "pointer",
//     boxShadow: "0 4px 14px rgba(239,68,68,.35)",
//   },
//   iconGhostBtn: {
//     background: "rgba(255,255,255,.06)",
//     border: "1px solid rgba(255,255,255,.08)",
//     borderRadius: 9,
//     padding: 7,
//     color: "#94a3b8",
//     cursor: "pointer",
//     display: "flex",
//   },
//   dropMenu: {
//     position: "absolute",
//     top: "calc(100% + 8px)",
//     right: 0,
//     background: "#161b26",
//     border: "1px solid rgba(255,255,255,.08)",
//     borderRadius: 12,
//     padding: 6,
//     minWidth: 180,
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
//     color: "#cbd5e1",
//     fontSize: 12,
//     fontWeight: 600,
//     padding: "8px 10px",
//     borderRadius: 8,
//     cursor: "pointer",
//     textAlign: "left",
//   },

//   /* MAIN */
//   mainArea: { flex: 1, display: "flex", overflow: "hidden" },
//   stageColumn: {
//     flex: 1,
//     display: "flex",
//     flexDirection: "column",
//     gap: 12,
//     padding: 16,
//     overflow: "hidden",
//     minWidth: 0,
//   },

//   /* STAGE */
//   stage: {
//     flex: 1,
//     position: "relative",
//     background: "#161a20",
//     borderRadius: 18,
//     overflow: "hidden",
//     border: "1px solid rgba(255,255,255,.06)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     minHeight: 0,
//   },
//   stageEmpty: { color: "#475569", fontSize: 13, fontWeight: 500 },
//   stageAvatarWrap: { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "#1b1f28" },
//   stageAvatar: {
//     width: 96,
//     height: 96,
//     borderRadius: "50%",
//     background: "linear-gradient(135deg,#3b82f6,#8b5cf6)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontSize: 34,
//     fontWeight: 800,
//     color: "#fff",
//   },
//   stageNameTag: {
//     position: "absolute",
//     bottom: 14,
//     left: 14,
//     display: "flex",
//     alignItems: "center",
//     gap: 7,
//     fontSize: 13,
//     fontWeight: 600,
//     color: "#fff",
//     background: "rgba(0,0,0,.55)",
//     borderRadius: 9,
//     padding: "5px 12px",
//   },
//   stageHostTag: {
//     position: "absolute",
//     top: 14,
//     right: 14,
//     fontSize: 11,
//     fontWeight: 700,
//     color: "#60a5fa",
//     background: "rgba(59,130,246,.18)",
//     borderRadius: 7,
//     padding: "3px 9px",
//   },
//   screenLabel: {
//     position: "absolute",
//     top: 14,
//     left: 14,
//     display: "flex",
//     alignItems: "center",
//     gap: 6,
//     fontSize: 12,
//     fontWeight: 700,
//     color: "#fff",
//     background: "rgba(0,0,0,.55)",
//     borderRadius: 8,
//     padding: "5px 10px",
//   },

//   captionsBar: {
//     display: "flex",
//     alignItems: "center",
//     gap: 8,
//     background: "rgba(0,0,0,.55)",
//     borderRadius: 10,
//     padding: "8px 14px",
//     fontSize: 12,
//     color: "#e2e8f0",
//     flexShrink: 0,
//   },

//   /* FILMSTRIP */
//   filmstrip: {
//     flexShrink: 0,
//     display: "flex",
//     gap: 10,
//     padding: "2px 2px 4px",
//     overflowX: "auto",
//   },
//   stripTile: {
//     position: "relative",
//     flex: "0 0 auto",
//     width: "clamp(84px, 12vw, 140px)",
//     aspectRatio: "16 / 9",
//     background: "#1b1f28",
//     borderRadius: 12,
//     overflow: "hidden",
//     border: "1px solid rgba(255,255,255,.06)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     cursor: "default",
//   },
//   stripOverflow: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     background: "rgba(255,255,255,.04)",
//   },
//   stripAvatarWrap: { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" },
//   stripAvatar: {
//     width: "42%",
//     aspectRatio: "1 / 1",
//     minWidth: 28,
//     maxWidth: 46,
//     borderRadius: "50%",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontSize: 15,
//     fontWeight: 800,
//     color: "#fff",
//   },
//   stripMicDot: {
//     position: "absolute",
//     top: 6,
//     right: 6,
//     width: 18,
//     height: 18,
//     borderRadius: "50%",
//     background: "rgba(0,0,0,.55)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     color: "#fff",
//   },
//   stripName: {
//     position: "absolute",
//     bottom: 5,
//     left: 6,
//     fontSize: 10,
//     fontWeight: 600,
//     color: "#fff",
//     background: "rgba(0,0,0,.5)",
//     borderRadius: 5,
//     padding: "1px 6px",
//     maxWidth: "calc(100% - 12px)",
//     overflow: "hidden",
//     textOverflow: "ellipsis",
//     whiteSpace: "nowrap",
//   },

//   handle: {
//     width: 22,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     background: "#0d1117",
//     borderLeft: "1px solid rgba(255,255,255,.05)",
//     cursor: "pointer",
//     flexShrink: 0,
//   },
//   sidebar: {
//     width: 320,
//     background: "#0d1117",
//     borderLeft: "1px solid rgba(255,255,255,.06)",
//     display: "flex",
//     flexDirection: "column",
//     flexShrink: 0,
//   },
//   tabRow: {
//     display: "flex",
//     alignItems: "center",
//     gap: 6,
//     padding: "10px 12px",
//     borderBottom: "1px solid rgba(255,255,255,.06)",
//     flexShrink: 0,
//   },
//   tab: {
//     flex: 1,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 5,
//     padding: "7px 0",
//     borderRadius: 10,
//     border: "none",
//     background: "transparent",
//     color: "#475569",
//     cursor: "pointer",
//     fontSize: 13,
//     fontFamily: "inherit",
//     fontWeight: 600,
//     transition: "all .15s",
//   },
//   tabOn: { background: "rgba(99,102,241,.15)", color: "#818cf8" },
//   cnt: {
//     fontSize: 10,
//     background: "rgba(99,102,241,.2)",
//     color: "#a5b4fc",
//     borderRadius: 10,
//     padding: "1px 6px",
//     marginLeft: 3,
//   },
//   closeBtn: {
//     background: "none",
//     border: "none",
//     color: "#334155",
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
//   },
//   msgList: {
//     flex: 1,
//     overflowY: "auto",
//     padding: "12px 14px",
//     display: "flex",
//     flexDirection: "column",
//     gap: 10,
//   },
//   msgRow: { display: "flex", alignItems: "flex-end", gap: 7 },
//   msgSelf: { flexDirection: "row-reverse" },
//   av: {
//     width: 28,
//     height: 28,
//     borderRadius: "50%",
//     background: "linear-gradient(135deg,#3b82f6,#8b5cf6)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontSize: 12,
//     fontWeight: 700,
//     flexShrink: 0,
//   },
//   sysBubble: {
//     fontSize: 11,
//     color: "#475569",
//     background: "rgba(255,255,255,.04)",
//     borderRadius: 8,
//     padding: "4px 10px",
//     fontStyle: "italic",
//     margin: "0 auto",
//   },
//   bubble: {
//     maxWidth: "78%",
//     borderRadius: 14,
//     padding: "7px 11px",
//     display: "flex",
//     flexDirection: "column",
//     gap: 2,
//   },
//   bSelf: {
//     background: "linear-gradient(135deg,#3b82f6,#8b5cf6)",
//     borderBottomRightRadius: 2,
//   },
//   bOther: { background: "#1e293b", borderBottomLeftRadius: 2 },
//   bName: { fontSize: 10, color: "#94a3b8", fontWeight: 600 },
//   bText: { fontSize: 13, color: "#f1f5f9", lineHeight: 1.45 },
//   bTime: {
//     fontSize: 10,
//     color: "rgba(255,255,255,.3)",
//     alignSelf: "flex-end",
//   },
//   inputRow: {
//     display: "flex",
//     gap: 7,
//     padding: "10px 12px",
//     borderTop: "1px solid rgba(255,255,255,.06)",
//     flexShrink: 0,
//   },
//   chatInput: {
//     flex: 1,
//     background: "#1e293b",
//     border: "1px solid rgba(255,255,255,.08)",
//     borderRadius: 10,
//     padding: "8px 12px",
//     color: "#e2e8f0",
//     fontSize: 13,
//     fontFamily: "inherit",
//     outline: "none",
//   },
//   sendBtn: {
//     background: "linear-gradient(135deg,#3b82f6,#8b5cf6)",
//     border: "none",
//     borderRadius: 10,
//     padding: "0 14px",
//     color: "#fff",
//     cursor: "pointer",
//     display: "flex",
//     alignItems: "center",
//     flexShrink: 0,
//   },
//   peopleList: {
//     flex: 1,
//     overflowY: "auto",
//     padding: "10px 12px",
//     display: "flex",
//     flexDirection: "column",
//     gap: 4,
//   },
//   emptyPpl: {
//     fontSize: 12,
//     color: "#334155",
//     textAlign: "center",
//     marginTop: 20,
//   },
//   pRow: {
//     display: "flex",
//     alignItems: "center",
//     gap: 10,
//     padding: "8px 10px",
//     borderRadius: 10,
//     background: "rgba(255,255,255,.03)",
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
//   },
//   pName: { flex: 1, fontSize: 13, color: "#cbd5e1" },
//   hostTag: {
//     fontSize: 10,
//     background: "rgba(59,130,246,.15)",
//     color: "#60a5fa",
//     padding: "2px 8px",
//     borderRadius: 6,
//     fontWeight: 600,
//   },
//   youTag: {
//     fontSize: 10,
//     background: "rgba(52,211,153,.12)",
//     color: "#6ee7b7",
//     padding: "2px 8px",
//     borderRadius: 6,
//     fontWeight: 600,
//   },

//   /* SETTINGS PANEL */
//   settingsOverlay: {
//     position: "fixed",
//     inset: 0,
//     background: "rgba(0,0,0,.5)",
//     zIndex: 1000,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   settingsPanel: {
//     width: 320,
//     background: "#111726",
//     border: "1px solid rgba(255,255,255,.08)",
//     borderRadius: 16,
//     overflow: "hidden",
//     boxShadow: "0 20px 60px rgba(0,0,0,.6)",
//   },
//   settingsHead: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: "14px 16px",
//     borderBottom: "1px solid rgba(255,255,255,.06)",
//   },
//   settingsBody: { padding: 16, display: "flex", flexDirection: "column", gap: 12 },
//   settingsRow: { display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 13, color: "#cbd5e1" },
//   settingsToggle: {
//     border: "1px solid rgba(255,255,255,.1)",
//     background: "rgba(255,255,255,.05)",
//     color: "#94a3b8",
//     borderRadius: 20,
//     padding: "5px 14px",
//     fontSize: 11,
//     fontWeight: 700,
//     cursor: "pointer",
//   },
//   settingsToggleOn: {
//     background: "rgba(99,102,241,.22)",
//     borderColor: "rgba(99,102,241,.4)",
//     color: "#a5b4fc",
//   },

//   /* CONTROL BAR */
//   ctrlBar: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 6,
//     padding: "12px 20px",
//     background: "#0d1117",
//     borderTop: "1px solid rgba(255,255,255,.06)",
//     flexShrink: 0,
//     overflowX: "auto",
//   },
// };

// export default LiveRoom;





































import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { Room, RoomEvent, Track, createLocalTracks } from "livekit-client";
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
  ChevronRight,
  ChevronLeft,
  Send,
  X,
  Radio,
  Timer,
  Disc2,
  Wifi,
  WifiOff,
  AlertTriangle,
  PictureInPicture2,
  Hand,
  Settings,
  Captions,
  MoreVertical,
  SignalHigh,
} from "lucide-react";
import {
  getSessionById,
  participantJoin,
  participantLeave,
} from "@/services/liveSessionService";

const getTime = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

// ── Timer: derives elapsed time from a persisted wall-clock `startedAt`
// timestamp instead of an in-memory counter that always began at 0. On
// refresh/back/reconnect, the caller passes the ORIGINAL join timestamp
// back in, so the timer picks up exactly where it left off. (UNCHANGED)
const useLiveTimer = (running, startedAt) => {
  const [secs, setSecs] = useState(() =>
    startedAt ? Math.max(0, Math.floor((Date.now() - startedAt) / 1000)) : 0,
  );

  useEffect(() => {
    if (!running) return;
    const anchor = startedAt || Date.now();
    const tick = () => setSecs(Math.max(0, Math.floor((Date.now() - anchor) / 1000)));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [running, startedAt]);

  const hh = String(Math.floor(secs / 3600)).padStart(2, "0");
  const mm = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
};

// ────────────────────────────────────────────────────────────────
// Track rendering primitives (UNCHANGED). Each track gets its OWN
// persistent DOM node via track.attach(el) instead of one shared
// container whose innerHTML kept getting wiped.
// ────────────────────────────────────────────────────────────────
function VideoTrackEl({ track, mirrored, fit = "cover", hidden, videoRef }) {
  const internalRef = useRef(null);
  useEffect(() => {
    const el = internalRef.current;
    if (!track || !el) return;
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
    if (!track || !el) return;
    track.attach(el);
    return () => {
      try {
        track.detach(el);
      } catch (_) {}
    };
  }, [track]);
  return <audio ref={ref} autoPlay />;
}

// PiP window content (UNCHANGED logic, restyled slightly to match dark theme)
function PiPPanel({ track, isScreen, label, timer, micOn, onToggleMic, onReturn }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        background: "#000",
        display: "flex",
        flexDirection: "column",
        fontFamily: "system-ui, sans-serif",
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
              color: "#94a3b8",
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
          background: "#0d1117",
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
            background: micOn ? "rgba(255,255,255,.12)" : "#7f1d1d",
            color: micOn ? "#e2e8f0" : "#fca5a5",
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
            background: "rgba(34,211,238,.18)",
            color: "#67e8f9",
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

// Cheap viewport awareness so many tiles don't all decode video at once (UNCHANGED)
function useInView(ref) {
  const [inView, setInView] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
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

// ────────────────────────────────────────────────────────────────
// Small strip tile — used under the main stage (Image 4 style)
// ────────────────────────────────────────────────────────────────
function StripTile({ p, active }) {
  const wrapRef = useRef(null);
  const inView = useInView(wrapRef);
  const hasVideo = !!p.cameraTrack && !p.cameraMuted && inView;
  const initial = (p.name || "?").trim().charAt(0).toUpperCase() || "?";

  return (
    <div
      ref={wrapRef}
      className={`lr-strip-tile${active ? " lr-strip-tile-active" : ""}`}
      style={S.stripTile}
    >
      {hasVideo ? (
        <VideoTrackEl track={p.cameraTrack} mirrored={p.isLocal} fit="cover" />
      ) : (
        <div style={S.stripAvatarWrap}>
          <div
            style={{
              ...S.stripAvatar,
              background: p.isLocal
                ? "linear-gradient(135deg,#0ea5e9,#6366f1)"
                : "linear-gradient(135deg,#8b5cf6,#ec4899)",
            }}
          >
            {initial}
          </div>
        </div>
      )}

      {!p.isLocal && p.micTrack && <AudioTrackEl track={p.micTrack} />}

      <div style={S.stripMicDot}>
        {p.micMuted ? <MicOff size={10} /> : <Mic size={10} />}
      </div>
      <div style={S.stripName}>{p.isLocal ? "You" : p.name}</div>
    </div>
  );
}

// Overflow bubble ("+N others") — purely presentational, mirrors Image 4
function StripOverflow({ count }) {
  return (
    <div style={{ ...S.stripTile, ...S.stripOverflow }} className="lr-strip-tile">
      <span style={{ fontSize: 13, fontWeight: 700, color: "#cbd5e1" }}>
        +{count}
      </span>
      <span style={{ fontSize: 9, color: "#64748b", marginTop: 2 }}>others</span>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// Main "stage" tile — whoever is featured (screen share > host/trainer
// > first remote > local). Large, rounded, name tag bottom-left.
// ────────────────────────────────────────────────────────────────
function StageTile({ p }) {
  if (!p) {
    return (
      <div style={S.stage}>
        <div style={S.stageEmpty}>Waiting for participants…</div>
      </div>
    );
  }

  const isScreen = !!p.screenTrack;
  const track = isScreen ? p.screenTrack : p.cameraTrack;
  const hasVideo = !!track && (isScreen || !p.cameraMuted);
  const initial = (p.name || "?").trim().charAt(0).toUpperCase() || "?";

  return (
    <div style={S.stage} className="lr-stage">
      {hasVideo ? (
        <VideoTrackEl track={track} mirrored={!isScreen && p.isLocal} fit={isScreen ? "contain" : "cover"} />
      ) : (
        <div style={S.stageAvatarWrap}>
          <div style={S.stageAvatar}>{initial}</div>
        </div>
      )}

      {!p.isLocal && p.micTrack && <AudioTrackEl track={p.micTrack} />}

      {isScreen && (
        <div style={S.screenLabel}>
          <MonitorPlay size={13} />
          {p.isLocal ? "You are presenting" : `${p.name} is presenting`}
        </div>
      )}

      <div style={S.stageNameTag}>
        {p.micMuted ? <MicOff size={13} /> : <Mic size={13} />}
        <span>{p.isLocal ? "You" : p.name}</span>
      </div>

      {p.isHost && !p.isLocal && <span style={S.stageHostTag}>Host</span>}
    </div>
  );
}

const LiveRoom = ({
  token,
  roomName,
  sessionId,
  joinedAt, // persisted wall-clock join time (ms) — keeps the timer
  // correct across refresh/back/reconnect instead of restarting at 00:00
  onSessionEnded,
  onLeave,
}) => {
  const roomRef = useRef(null);
  const localVideoTrackRef = useRef(null);
  const localAudioTrackRef = useRef(null);
  const chatEndRef = useRef(null);
  const autoEndPollRef = useRef(null);

  const [connected, setConnected] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [screenOn, setScreenOn] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarTab, setSidebarTab] = useState("chat");
  const [trainerOnline, setTrainerOnline] = useState(false);
  const [participants, setParticipants] = useState([]); // single source of truth for tiles + people list
  const [msgInput, setMsgInput] = useState("");
  const [sessionEndedWarning, setSessionEndedWarning] = useState(false);
  const [mediaError, setMediaError] = useState(null);

  // ── UI-only additions to match the target design's control bar.
  // These do not call any API, LiveKit method, or socket event — they
  // are purely local, presentational toggles (hand raise indicator,
  // settings/captions placeholders, and the REC badge visibility).
  const [handRaised, setHandRaised] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [captionsOn, setCaptionsOn] = useState(false);
  const [recordingBadge, setRecordingBadge] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const [messages, setMessages] = useState(() => [
    {
      id: 1,
      name: "System",
      text: "Session started. Welcome!",
      time: getTime(),
      self: false,
      system: true,
    },
  ]);

  const timer = useLiveTimer(connected, joinedAt);

  const pushSystemMsg = useCallback((text) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: "System",
        text,
        time: getTime(),
        self: false,
        system: true,
      },
    ]);
  }, []);

  // Builds ONE participant list (local + remote), each with its own
  // camera/mic/screen-share track references. Drives the stage, the
  // strip, and the People sidebar tab. (UNCHANGED)
  const syncParticipants = useCallback(() => {
    const room = roomRef.current;
    if (!room) return;

    const list = [];

    const lp = room.localParticipant;
    const localEntry = {
      identity: "you",
      name: "You",
      isLocal: true,
      isHost: false,
      cameraTrack: null,
      cameraMuted: true,
      micTrack: null,
      micMuted: true,
      screenTrack: null,
    };
    lp.trackPublications.forEach((pub) => {
      if (!pub.track) return;
      if (pub.source === Track.Source.Camera) {
        localEntry.cameraTrack = pub.track;
        localEntry.cameraMuted = pub.isMuted;
      } else if (pub.source === Track.Source.Microphone) {
        localEntry.micTrack = pub.track;
        localEntry.micMuted = pub.isMuted;
      } else if (pub.source === Track.Source.ScreenShare) {
        localEntry.screenTrack = pub.track;
      }
    });
    list.push(localEntry);

    room.remoteParticipants.forEach((p) => {
      const entry = {
        identity: p.identity,
        name: p.name || p.identity,
        isLocal: false,
        isHost: true, // kept from original behavior (role isn't provided by the API)
        cameraTrack: null,
        cameraMuted: true,
        micTrack: null,
        micMuted: true,
        screenTrack: null,
      };
      p.trackPublications.forEach((pub) => {
        if (!pub.isSubscribed || !pub.track) return;
        if (pub.source === Track.Source.Camera) {
          entry.cameraTrack = pub.track;
          entry.cameraMuted = pub.isMuted;
        } else if (pub.source === Track.Source.Microphone) {
          entry.micTrack = pub.track;
          entry.micMuted = pub.isMuted;
        } else if (pub.source === Track.Source.ScreenShare) {
          entry.screenTrack = pub.track;
        }
      });
      list.push(entry);
    });

    setParticipants(list);
  }, []);

  useEffect(() => {
    const serverUrl =
      (typeof import.meta !== "undefined" &&
        import.meta.env?.VITE_LIVEKIT_URL) ||
      "ws://localhost:7880";

    const start = async () => {
      const room = new Room({ adaptiveStream: true, dynacast: true });
      roomRef.current = room;

      const onChange = () => syncParticipants();

      room
        .on(RoomEvent.TrackSubscribed, onChange)
        .on(RoomEvent.TrackUnsubscribed, onChange)
        .on(RoomEvent.TrackMuted, onChange)
        .on(RoomEvent.TrackUnmuted, onChange)
        .on(RoomEvent.LocalTrackPublished, onChange)
        .on(RoomEvent.LocalTrackUnpublished, onChange)
        .on(RoomEvent.ParticipantConnected, (p) => {
          setTrainerOnline(true);
          onChange();
          pushSystemMsg(`${p.name || p.identity} joined`);
        })
        .on(RoomEvent.ParticipantDisconnected, (p) => {
          onChange();
          pushSystemMsg(`${p.name || p.identity} left`);
        })
        .on(RoomEvent.Disconnected, () => {
          setConnected(false);
          setTrainerOnline(false);
        })
        .on(RoomEvent.DataReceived, (payload, participant) => {
          try {
            const decoded = new TextDecoder().decode(payload);
            const msg = JSON.parse(decoded);
            if (msg.text) {
              setMessages((prev) => [
                ...prev,
                {
                  id: Date.now(),
                  name: participant?.name || participant?.identity || "Trainer",
                  text: msg.text,
                  time: getTime(),
                  self: false,
                },
              ]);
            }
          } catch (_) {}
        });

      try {
        await room.connect(serverUrl, token);
        setConnected(true);

        if (sessionId) {
          try {
            const user = JSON.parse(localStorage.getItem("lms_user") || "{}");
            const batchId = user?.batchId || 1;
            const trainerEmail = user?.trainerEmail || "";
            await participantJoin(sessionId, batchId, trainerEmail);
          } catch (e) {
            console.warn("participantJoin DB call failed:", e);
          }
        }

        if (sessionId) {
          autoEndPollRef.current = setInterval(async () => {
            try {
              const res = await getSessionById(sessionId);
              if (res?.data?.status === "ENDED") {
                clearInterval(autoEndPollRef.current);
                setSessionEndedWarning(true);
                setTimeout(() => {
                  roomRef.current?.disconnect();
                  if (typeof onSessionEnded === "function") onSessionEnded();
                }, 3000);
              }
            } catch (_) {}
          }, 20000);
        }

        try {
          const tracks = await createLocalTracks({ audio: true, video: true });
          for (const track of tracks) {
            await room.localParticipant.publishTrack(track);
            if (track.kind === Track.Kind.Video) localVideoTrackRef.current = track;
            if (track.kind === Track.Kind.Audio) localAudioTrackRef.current = track;
          }
        } catch (mediaErr) {
          console.error("getUserMedia failed:", mediaErr);
          setMediaError(
            "Couldn't access your camera/microphone. Check browser permissions and reload the page.",
          );
        }

        if (room.remoteParticipants.size > 0) setTrainerOnline(true);
        syncParticipants();
      } catch (err) {
        console.error("LiveKit error:", err);
        setConnected(false);
      }
    };

    start();

    return () => {
      if (autoEndPollRef.current) clearInterval(autoEndPollRef.current);
      if (sessionId) {
        participantLeave(sessionId).catch(() => {});
      }
      roomRef.current?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sidebarTab, sidebarOpen]);

  const toggleMic = useCallback(async () => {
    const track = localAudioTrackRef.current;
    if (!track) return;
    if (micOn) await track.mute();
    else await track.unmute();
    setMicOn((v) => !v);
    syncParticipants();
  }, [micOn, syncParticipants]);

  const toggleCam = useCallback(async () => {
    const track = localVideoTrackRef.current;
    if (!track) return;
    if (camOn) await track.mute();
    else await track.unmute();
    setCamOn((v) => !v);
    syncParticipants();
  }, [camOn, syncParticipants]);

  // Screen share publishes as its own track/source (UNCHANGED). The
  // stage picks it up automatically via `screenSharer` below.
  const toggleScreen = useCallback(async () => {
    const room = roomRef.current;
    if (!room) return;
    try {
      if (screenOn) {
        await room.localParticipant.setScreenShareEnabled(false);
        setScreenOn(false);
      } else {
        const pub = await room.localParticipant.setScreenShareEnabled(true);
        if (!pub) return;
        setScreenOn(true);
        const mediaTrack = pub.track?.mediaStreamTrack;
        if (mediaTrack) {
          mediaTrack.addEventListener("ended", () => {
            room.localParticipant.setScreenShareEnabled(false).catch(() => {});
            setScreenOn(false);
            syncParticipants();
          });
        }
      }
    } catch (err) {
      console.warn("Screen share toggle failed/cancelled:", err);
    } finally {
      syncParticipants();
    }
  }, [screenOn, syncParticipants]);

  const handleLeave = useCallback(() => {
    if (autoEndPollRef.current) clearInterval(autoEndPollRef.current);
    if (sessionId) {
      participantLeave(sessionId).catch(() => {});
    }
    roomRef.current?.disconnect();
    localVideoTrackRef.current?.stop();
    localAudioTrackRef.current?.stop();
    if (typeof onLeave === "function") onLeave();
  }, [onLeave, sessionId]);

  const sendMsg = useCallback(() => {
    const text = msgInput.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), name: "You", text, time: getTime(), self: true },
    ]);
    setMsgInput("");
    try {
      const payload = new TextEncoder().encode(JSON.stringify({ text }));
      roomRef.current?.localParticipant?.publishData(payload, {
        reliable: true,
      });
    } catch (e) {
      console.warn("data send failed:", e);
    }
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

  // Any participant (local or remote) currently sharing their screen
  // becomes the big "stage" — same as before.
  const screenSharer = useMemo(
    () => participants.find((p) => !!p.screenTrack),
    [participants],
  );

  // ── Derived UI grouping only (no data/logic change): who is shown
  // large on the stage vs. who sits in the strip underneath, matching
  // Image 4 (big trainer video, small tiles below).
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
  const overflowCount = Math.max(0, stripParticipants.length - MAX_STRIP_VISIBLE);

  // ── Picture-in-Picture (UNCHANGED logic)
  const pipTrack =
    screenSharer?.screenTrack ||
    participants.find((p) => p.isLocal)?.cameraTrack ||
    participants.find((p) => !p.isLocal && p.cameraTrack)?.cameraTrack ||
    null;
  const pipIsScreen = !!screenSharer?.screenTrack;
  const pipLabel = screenSharer
    ? screenSharer.isLocal
      ? "You are presenting"
      : `${screenSharer.name} is presenting`
    : "Live meeting";

  const [pipWindow, setPipWindow] = useState(null);
  const pipFallbackVideoRef = useRef(null);
  const pipSupported =
    typeof window !== "undefined" && "documentPictureInPicture" in window;

  const closePiP = useCallback(() => {
    setPipWindow((win) => {
      if (win && !win.closed) win.close();
      return null;
    });
    if (document.pictureInPictureElement) {
      document.exitPictureInPicture().catch(() => {});
    }
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
    if (el && el.requestPictureInPicture) {
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
    if (!connected) return;
    const onVisibility = () => {
      if (document.hidden) openPiP();
      else closePiP();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [connected, openPiP, closePiP]);

  useEffect(() => {
    return () => closePiP();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={S.root} className="lr-root">
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

      {sessionEndedWarning && (
        <div style={S.autoEndToast} className="lr-toast">
          <span style={{ fontSize: 18 }}>⏱️</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13 }}>
              Session ended by trainer
            </div>
            <div style={{ fontSize: 11, opacity: 0.85 }}>
              Redirecting you out in 3 seconds…
            </div>
          </div>
        </div>
      )}

      {mediaError && (
        <div className="lr-toast" style={{ ...S.autoEndToast, background: "linear-gradient(135deg,#b45309,#f59e0b)" }}>
          <AlertTriangle size={18} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 13 }}>Camera/Mic issue</div>
            <div style={{ fontSize: 11, opacity: 0.9 }}>{mediaError}</div>
          </div>
        </div>
      )}

      {/* ── TOP NAV (Image 4) ───────────────────────────────────── */}
      <div style={S.topBar} className="lr-topbar">
        <div style={S.topLeft} className="lr-topleft">
          <div style={S.logo}>
            <div style={S.logoMark}>
              <Radio size={14} />
            </div>
            <span style={S.logoText}>ILM ORA</span>
          </div>
          <div style={S.liveBadge}>
            <span style={S.liveDot} />
            LIVE
          </div>
          <span style={S.sessionName} className="lr-sessionname">
            {roomName || "Live Session"}
          </span>
          <div style={S.timerBadge}>
            <Timer size={12} />
            {timer}
          </div>
          {recordingBadge && (
            <div style={S.recBadge}>
              <Disc2 size={11} />
              REC
            </div>
          )}
        </div>
        <div style={S.topRight} className="lr-topright">
          <div style={S.peopleCountBadge}>
            <Users size={13} />
            {participants.length || 1}
          </div>
          <div
            style={{ ...S.connBadge, ...(connected ? S.connOn : S.connOff) }}
          >
            <SignalHigh size={13} />
          </div>
          <button style={S.endSessionBtn} onClick={handleLeave}>
            <PhoneOff size={14} />
            <span className="lr-btn-label">End Session</span>
          </button>
          <div style={{ position: "relative" }}>
            <button
              style={S.iconGhostBtn}
              onClick={() => setMenuOpen((v) => !v)}
              title="More options"
            >
              <MoreVertical size={16} />
            </button>
            {menuOpen && (
              <div style={S.dropMenu}>
                <button
                  style={S.dropMenuItem}
                  onClick={() => {
                    setRecordingBadge((v) => !v);
                    setMenuOpen(false);
                  }}
                >
                  <Disc2 size={13} />
                  {recordingBadge ? "Hide REC badge" : "Show REC badge"}
                </button>
                <button
                  style={S.dropMenuItem}
                  onClick={() => {
                    setSettingsOpen(true);
                    setMenuOpen(false);
                  }}
                >
                  <Settings size={13} />
                  Settings
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── MAIN AREA ───────────────────────────────────────────── */}
      <div style={S.mainArea}>
        <div style={S.stageColumn} className="lr-stagecolumn">
          <StageTile p={featured} />

          {captionsOn && (
            <div style={S.captionsBar}>
              <Captions size={13} />
              <span>Live captions are enabled for this session.</span>
            </div>
          )}

          {(visibleStrip.length > 0 || overflowCount > 0) && (
            <div data-scroll-root className="lr-filmstrip" style={S.filmstrip}>
              {visibleStrip.map((p) => (
                <StripTile key={p.identity} p={p} active={p.isLocal} />
              ))}
              {overflowCount > 0 && <StripOverflow count={overflowCount} />}
            </div>
          )}
        </div>

        {/* Handle */}
        <div
          style={S.handle}
          className="lr-handle"
          onClick={() => setSidebarOpen((v) => !v)}
          title={sidebarOpen ? "Collapse" : "Expand"}
        >
          {sidebarOpen ? (
            <ChevronRight size={15} color="#64748b" />
          ) : (
            <ChevronLeft size={15} color="#64748b" />
          )}
        </div>

        {/* Sidebar */}
        {sidebarOpen && (
          <div style={S.sidebar} className="lr-sidebar">
            <div style={S.tabRow}>
              <button
                style={{ ...S.tab, ...(sidebarTab === "chat" ? S.tabOn : {}) }}
                onClick={() => setSidebarTab("chat")}
              >
                <MessageSquare size={13} /> Chat
              </button>
              <button
                style={{
                  ...S.tab,
                  ...(sidebarTab === "people" ? S.tabOn : {}),
                }}
                onClick={() => setSidebarTab("people")}
              >
                <Users size={13} /> People
                <span style={S.cnt}>{participants.length || 1}</span>
              </button>
              <button style={S.closeBtn} onClick={() => setSidebarOpen(false)}>
                <X size={14} />
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
                    <Send size={14} />
                  </button>
                </div>
              </div>
            )}

            {sidebarTab === "people" && (
              <div style={S.peopleList}>
                {participants.map((p) => (
                  <PersonRow
                    key={p.identity}
                    name={p.isLocal ? "You (Me)" : p.name}
                    isHost={p.isHost}
                    self={p.isLocal}
                    handRaised={p.isLocal && handRaised}
                  />
                ))}
                {participants.length <= 1 && (
                  <p style={S.emptyPpl}>No other participants yet</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── SETTINGS PANEL (UI-only placeholder, matches Image 4's
           "Settings" control — no device/session logic wired) ──── */}
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
                <span>Show REC badge</span>
                <button
                  style={{
                    ...S.settingsToggle,
                    ...(recordingBadge ? S.settingsToggleOn : {}),
                  }}
                  onClick={() => setRecordingBadge((v) => !v)}
                >
                  {recordingBadge ? "On" : "Off"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── CONTROL BAR (Image 4) ──────────────────────────────── */}
      <div style={S.ctrlBar} className="lr-ctrlbar">
        <Btn
          icon={micOn ? <Mic size={18} /> : <MicOff size={18} />}
          label="Mic"
          danger={!micOn}
          onClick={toggleMic}
        />
        <Btn
          icon={camOn ? <Video size={18} /> : <VideoOff size={18} />}
          label="Camera"
          danger={!camOn}
          onClick={toggleCam}
        />
        <Btn
          icon={screenOn ? <MonitorOff size={18} /> : <MonitorUp size={18} />}
          label="Present"
          active={screenOn}
          onClick={toggleScreen}
        />
        <Btn
          icon={<Hand size={18} />}
          label="Raise Hand"
          active={handRaised}
          onClick={() => setHandRaised((v) => !v)}
        />
        <Btn
          icon={<MessageSquare size={18} />}
          label="Chat"
          active={sidebarOpen && sidebarTab === "chat"}
          onClick={() => openTab("chat")}
        />
        <Btn
          icon={<Users size={18} />}
          label="People"
          active={sidebarOpen && sidebarTab === "people"}
          onClick={() => openTab("people")}
        />
        <Btn
          icon={<Settings size={18} />}
          label="Settings"
          active={settingsOpen}
          onClick={() => setSettingsOpen((v) => !v)}
        />
        <Btn
          icon={<Captions size={18} />}
          label="Captions"
          active={captionsOn}
          onClick={() => setCaptionsOn((v) => !v)}
        />
        <Btn
          icon={<Disc2 size={18} />}
          label="Record"
          active={recordingBadge}
          onClick={() => setRecordingBadge((v) => !v)}
        />
        <Btn
          icon={<PictureInPicture2 size={18} />}
          label="PiP"
          active={!!pipWindow}
          onClick={togglePiP}
        />
        <Btn
          icon={<PhoneOff size={18} />}
          label="Leave"
          leave
          onClick={handleLeave}
        />
      </div>

      <style>{`
        @keyframes livePulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(1.5)} }
        @keyframes recBlink  { 0%,100%{opacity:1} 50%{opacity:.2} }
        @keyframes slideIn   { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
        @keyframes toastIn   { from{opacity:0;transform:translateX(-50%) translateY(-12px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
        @keyframes fadeScaleIn { from{opacity:0;transform:scale(0.96)} to{opacity:1;transform:scale(1)} }

        .lr-tile, .lr-strip-tile, .lr-stage { transition: transform 0.18s ease, box-shadow 0.18s ease; }
        .lr-strip-tile:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0,0,0,0.35); }
        .lr-strip-tile-active { border: 2px solid #818cf8 !important; }
        .lr-ctrl-btn { transition: all 0.16s ease; }
        .lr-ctrl-btn:active { transform: scale(0.94); }
        .lr-sidebar { animation: slideIn .2s ease; }
        .lr-stage { animation: fadeScaleIn .25s ease; }

        /* ══════════════════════════════════════════════════════════
           Responsive system — desktop → laptop → iPad Pro → iPad →
           iPad mini → tablet → iPhone Pro Max → iPhone → iPhone SE
           ══════════════════════════════════════════════════════════ */

        .lr-btn-label { display: inline; }

        @media (max-width: 1439px) {
          .lr-sidebar { width: 300px !important; }
        }

        @media (max-width: 1199px) {
          .lr-sidebar { width: 280px !important; }
          .lr-ctrl-btn { padding: 9px 14px !important; }
        }

        @media (max-width: 1023px) {
          .lr-sidebar {
            position: fixed !important;
            inset: 0 !important;
            top: 54px !important;
            width: 100% !important;
            z-index: 500 !important;
          }
          .lr-handle { display: none !important; }
        }

        @media (max-width: 899px) {
          .lr-topbar { padding: 8px 12px !important; }
          .lr-ctrlbar { padding: 10px 14px !important; }
          .lr-ctrl-btn { padding: 8px 12px !important; }
          .lr-stagecolumn { padding: 10px !important; gap: 8px !important; }
        }

        @media (max-width: 767px) {
          .lr-sessionname { display: none; }
          .lr-stage { border-radius: 12px !important; }
        }

        @media (max-width: 599px) {
          .lr-topbar { flex-wrap: wrap; row-gap: 6px; }
          .lr-topright { order: 3; width: 100%; justify-content: flex-start; }
          .lr-ctrlbar { padding: 8px 6px !important; gap: 3px !important; overflow-x: auto; }
          .lr-btn-label { display: none !important; }
          .lr-ctrl-btn { padding: 10px !important; border-radius: 12px !important; }
        }

        @media (max-width: 430px) {
          .lr-stagecolumn { padding: 6px !important; gap: 6px !important; }
          .lr-filmstrip { padding: 6px 8px !important; gap: 6px !important; }
        }

        @media (max-width: 375px) {
          .lr-ctrl-btn { padding: 8px !important; }
          .lr-topbar { padding: 6px 8px !important; }
        }

        @media (max-width: 420px) {
          .lr-toast { min-width: unset !important; width: 92vw !important; padding: 10px 14px !important; }
        }

        @media (max-height: 480px) and (orientation: landscape) {
          .lr-topbar { padding: 4px 10px !important; }
          .lr-ctrlbar { padding: 6px 12px !important; }
          .lr-ctrl-btn { padding: 6px 10px !important; gap: 2px !important; }
        }
      `}</style>
    </div>
  );
};

const PersonRow = ({ name, isHost, self, handRaised }) => (
  <div style={S.pRow}>
    <div
      style={{
        ...S.pAv,
        background: self
          ? "linear-gradient(135deg,#0ea5e9,#6366f1)"
          : "linear-gradient(135deg,#8b5cf6,#ec4899)",
      }}
    >
      {name[0]}
    </div>
    <span style={S.pName}>{name}</span>
    {handRaised && <Hand size={13} color="#fbbf24" />}
    {isHost && <span style={S.hostTag}>Host</span>}
    {self && <span style={S.youTag}>You</span>}
  </div>
);

const Btn = ({ icon, label, active, danger, leave, onClick }) => {
  const [hov, setHov] = useState(false);
  const bg = leave
    ? hov
      ? "#dc2626"
      : "#ef4444"
    : danger
      ? hov
        ? "#991b1b"
        : "#7f1d1d"
      : active
        ? hov
          ? "rgba(99,102,241,.38)"
          : "rgba(99,102,241,.22)"
        : hov
          ? "rgba(255,255,255,.14)"
          : "rgba(255,255,255,.07)";
  const col = leave
    ? "#fff"
    : danger
      ? "#fca5a5"
      : active
        ? "#a5b4fc"
        : "#cbd5e1";
  return (
    <button
      className="lr-ctrl-btn"
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        background: bg,
        color: col,
        border: danger
          ? "1px solid rgba(239,68,68,.3)"
          : active
            ? "1px solid rgba(99,102,241,.35)"
            : "1px solid transparent",
        borderRadius: 14,
        padding: "10px 16px",
        cursor: "pointer",
        fontSize: 10,
        fontWeight: 600,
        fontFamily: "inherit",
        letterSpacing: 0.2,
        flexShrink: 0,
      }}
    >
      {icon}
      <span className="lr-btn-label">{label}</span>
    </button>
  );
};

const S = {
  root: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    background: "#07090f",
    fontFamily: "'DM Sans','Segoe UI',sans-serif",
    color: "#e2e8f0",
    overflow: "hidden",
  },
  autoEndToast: {
    position: "fixed",
    top: 60,
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 99999,
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "14px 24px",
    borderRadius: 14,
    background: "linear-gradient(135deg,#dc2626,#f43f5e)",
    color: "#fff",
    fontFamily: "'DM Sans','Segoe UI',sans-serif",
    boxShadow: "0 8px 32px rgba(244,63,94,0.5)",
    animation: "toastIn 0.35s ease",
    minWidth: 300,
  },

  /* TOP NAV */
  topBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 20px",
    background: "#0d1117",
    borderBottom: "1px solid rgba(255,255,255,.06)",
    flexShrink: 0,
    flexWrap: "wrap",
    gap: 8,
  },
  topLeft: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" },
  topRight: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" },
  logo: { display: "flex", alignItems: "center", gap: 8, paddingRight: 6, borderRight: "1px solid rgba(255,255,255,.08)", marginRight: 2 },
  logoMark: {
    width: 24,
    height: 24,
    borderRadius: 7,
    background: "linear-gradient(135deg,#f97316,#ef4444)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
  },
  logoText: { fontSize: 13, fontWeight: 800, letterSpacing: 0.5, color: "#f1f5f9" },
  liveBadge: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    background: "rgba(239,68,68,.14)",
    border: "1px solid rgba(239,68,68,.28)",
    borderRadius: 8,
    padding: "3px 9px",
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: 1.5,
    color: "#ef4444",
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "#ef4444",
    animation: "livePulse 1.2s ease-in-out infinite",
    display: "inline-block",
  },
  recBadge: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    background: "rgba(248,113,113,.09)",
    border: "1px solid rgba(248,113,113,.18)",
    borderRadius: 8,
    padding: "3px 8px",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 1,
    color: "#fca5a5",
    animation: "recBlink 2s infinite",
  },
  timerBadge: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    fontSize: 12,
    fontWeight: 600,
    color: "#94a3b8",
    background: "rgba(255,255,255,.05)",
    borderRadius: 8,
    padding: "3px 10px",
    fontVariantNumeric: "tabular-nums",
  },
  sessionName: {
    fontSize: 14,
    fontWeight: 600,
    color: "#f1f5f9",
    marginLeft: 2,
  },
  peopleCountBadge: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    fontSize: 12,
    fontWeight: 600,
    color: "#cbd5e1",
    background: "rgba(255,255,255,.05)",
    borderRadius: 8,
    padding: "4px 10px",
  },
  connBadge: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    padding: "5px 8px",
  },
  connOn: {
    background: "rgba(52,211,153,.1)",
    border: "1px solid rgba(52,211,153,.24)",
    color: "#34d399",
  },
  connOff: {
    background: "rgba(100,116,139,.1)",
    border: "1px solid rgba(100,116,139,.2)",
    color: "#94a3b8",
  },
  endSessionBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "8px 16px",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 4px 14px rgba(239,68,68,.35)",
  },
  iconGhostBtn: {
    background: "rgba(255,255,255,.06)",
    border: "1px solid rgba(255,255,255,.08)",
    borderRadius: 9,
    padding: 7,
    color: "#94a3b8",
    cursor: "pointer",
    display: "flex",
  },
  dropMenu: {
    position: "absolute",
    top: "calc(100% + 8px)",
    right: 0,
    background: "#161b26",
    border: "1px solid rgba(255,255,255,.08)",
    borderRadius: 12,
    padding: 6,
    minWidth: 180,
    boxShadow: "0 12px 32px rgba(0,0,0,.5)",
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
    color: "#cbd5e1",
    fontSize: 12,
    fontWeight: 600,
    padding: "8px 10px",
    borderRadius: 8,
    cursor: "pointer",
    textAlign: "left",
  },

  /* MAIN */
  mainArea: { flex: 1, display: "flex", overflow: "hidden" },
  stageColumn: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 12,
    padding: 16,
    overflow: "hidden",
    minWidth: 0,
  },

  /* STAGE */
  stage: {
    flex: 1,
    position: "relative",
    background: "#161a20",
    borderRadius: 18,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,.06)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 0,
  },
  stageEmpty: { color: "#475569", fontSize: 13, fontWeight: 500 },
  stageAvatarWrap: { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "#1b1f28" },
  stageAvatar: {
    width: 96,
    height: 96,
    borderRadius: "50%",
    background: "linear-gradient(135deg,#3b82f6,#8b5cf6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 34,
    fontWeight: 800,
    color: "#fff",
  },
  stageNameTag: {
    position: "absolute",
    bottom: 14,
    left: 14,
    display: "flex",
    alignItems: "center",
    gap: 7,
    fontSize: 13,
    fontWeight: 600,
    color: "#fff",
    background: "rgba(0,0,0,.55)",
    borderRadius: 9,
    padding: "5px 12px",
  },
  stageHostTag: {
    position: "absolute",
    top: 14,
    right: 14,
    fontSize: 11,
    fontWeight: 700,
    color: "#60a5fa",
    background: "rgba(59,130,246,.18)",
    borderRadius: 7,
    padding: "3px 9px",
  },
  screenLabel: {
    position: "absolute",
    top: 14,
    left: 14,
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    fontWeight: 700,
    color: "#fff",
    background: "rgba(0,0,0,.55)",
    borderRadius: 8,
    padding: "5px 10px",
  },

  captionsBar: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "rgba(0,0,0,.55)",
    borderRadius: 10,
    padding: "8px 14px",
    fontSize: 12,
    color: "#e2e8f0",
    flexShrink: 0,
  },

  /* FILMSTRIP */
  filmstrip: {
    flexShrink: 0,
    display: "flex",
    gap: 10,
    padding: "2px 2px 4px",
    overflowX: "auto",
  },
  stripTile: {
    position: "relative",
    flex: "0 0 auto",
    width: "clamp(84px, 12vw, 140px)",
    aspectRatio: "16 / 9",
    background: "#1b1f28",
    borderRadius: 12,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,.06)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "default",
  },
  stripOverflow: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,255,255,.04)",
  },
  stripAvatarWrap: { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" },
  stripAvatar: {
    width: "42%",
    aspectRatio: "1 / 1",
    minWidth: 28,
    maxWidth: 46,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 15,
    fontWeight: 800,
    color: "#fff",
  },
  stripMicDot: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: "50%",
    background: "rgba(0,0,0,.55)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
  },
  stripName: {
    position: "absolute",
    bottom: 5,
    left: 6,
    fontSize: 10,
    fontWeight: 600,
    color: "#fff",
    background: "rgba(0,0,0,.5)",
    borderRadius: 5,
    padding: "1px 6px",
    maxWidth: "calc(100% - 12px)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  handle: {
    width: 22,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#0d1117",
    borderLeft: "1px solid rgba(255,255,255,.05)",
    cursor: "pointer",
    flexShrink: 0,
  },
  sidebar: {
    width: 320,
    background: "#0d1117",
    borderLeft: "1px solid rgba(255,255,255,.06)",
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
  },
  tabRow: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "10px 12px",
    borderBottom: "1px solid rgba(255,255,255,.06)",
    flexShrink: 0,
  },
  tab: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    padding: "8px 0 9px",
    borderRadius: 0,
    border: "none",
    borderBottom: "2px solid transparent",
    background: "transparent",
    color: "#64748b",
    cursor: "pointer",
    fontSize: 13,
    fontFamily: "inherit",
    fontWeight: 600,
    transition: "all .15s",
  },
  tabOn: { color: "#60a5fa", borderBottom: "2px solid #60a5fa" },
  cnt: {
    fontSize: 10,
    background: "rgba(99,102,241,.2)",
    color: "#a5b4fc",
    borderRadius: 10,
    padding: "1px 6px",
    marginLeft: 3,
  },
  closeBtn: {
    background: "none",
    border: "none",
    color: "#334155",
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
  },
  msgList: {
    flex: 1,
    overflowY: "auto",
    padding: "12px 14px",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  msgRow: { display: "flex", alignItems: "flex-end", gap: 7 },
  msgSelf: { flexDirection: "row-reverse" },
  msgCol: {
    display: "flex",
    flexDirection: "column",
    gap: 3,
    maxWidth: "88%",
    alignSelf: "flex-start",
  },
  msgColSelf: { alignSelf: "flex-end", alignItems: "flex-end" },
  bHeader: {
    display: "flex",
    alignItems: "baseline",
    gap: 7,
    fontSize: 11,
    fontWeight: 700,
    color: "#93c5fd",
    padding: "0 2px",
  },
  bHeaderSelf: { color: "#a5b4fc" },
  bHeaderTime: { fontSize: 10, fontWeight: 500, color: "#475569" },
  av: {
    width: 28,
    height: 28,
    borderRadius: "50%",
    background: "linear-gradient(135deg,#3b82f6,#8b5cf6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: 700,
    flexShrink: 0,
  },
  sysBubble: {
    fontSize: 11,
    color: "#475569",
    background: "rgba(255,255,255,.04)",
    borderRadius: 8,
    padding: "4px 10px",
    fontStyle: "italic",
    margin: "0 auto",
  },
  bubble: {
    maxWidth: "100%",
    borderRadius: 14,
    padding: "8px 12px",
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  bSelf: {
    background: "linear-gradient(135deg,#3b82f6,#8b5cf6)",
    borderTopRightRadius: 3,
  },
  bOther: { background: "#1e293b", borderTopLeftRadius: 3 },
  bName: { fontSize: 10, color: "#94a3b8", fontWeight: 600 },
  bText: { fontSize: 13, color: "#f1f5f9", lineHeight: 1.45 },
  bTime: {
    fontSize: 10,
    color: "rgba(255,255,255,.3)",
    alignSelf: "flex-end",
  },
  inputRow: {
    display: "flex",
    gap: 7,
    padding: "10px 12px",
    borderTop: "1px solid rgba(255,255,255,.06)",
    flexShrink: 0,
  },
  chatInput: {
    flex: 1,
    background: "#1e293b",
    border: "1px solid rgba(255,255,255,.08)",
    borderRadius: 10,
    padding: "8px 12px",
    color: "#e2e8f0",
    fontSize: 13,
    fontFamily: "inherit",
    outline: "none",
  },
  sendBtn: {
    background: "linear-gradient(135deg,#3b82f6,#8b5cf6)",
    border: "none",
    borderRadius: 10,
    padding: "0 14px",
    color: "#fff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    flexShrink: 0,
  },
  peopleList: {
    flex: 1,
    overflowY: "auto",
    padding: "10px 12px",
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  emptyPpl: {
    fontSize: 12,
    color: "#334155",
    textAlign: "center",
    marginTop: 20,
  },
  pRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "8px 10px",
    borderRadius: 10,
    background: "rgba(255,255,255,.03)",
  },
  pAv: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 14,
    fontWeight: 700,
    flexShrink: 0,
  },
  pName: { flex: 1, fontSize: 13, color: "#cbd5e1" },
  hostTag: {
    fontSize: 10,
    background: "rgba(59,130,246,.15)",
    color: "#60a5fa",
    padding: "2px 8px",
    borderRadius: 6,
    fontWeight: 600,
  },
  youTag: {
    fontSize: 10,
    background: "rgba(52,211,153,.12)",
    color: "#6ee7b7",
    padding: "2px 8px",
    borderRadius: 6,
    fontWeight: 600,
  },

  /* SETTINGS PANEL */
  settingsOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,.5)",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  settingsPanel: {
    width: 320,
    background: "#111726",
    border: "1px solid rgba(255,255,255,.08)",
    borderRadius: 16,
    overflow: "hidden",
    boxShadow: "0 20px 60px rgba(0,0,0,.6)",
  },
  settingsHead: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 16px",
    borderBottom: "1px solid rgba(255,255,255,.06)",
  },
  settingsBody: { padding: 16, display: "flex", flexDirection: "column", gap: 12 },
  settingsRow: { display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 13, color: "#cbd5e1" },
  settingsToggle: {
    border: "1px solid rgba(255,255,255,.1)",
    background: "rgba(255,255,255,.05)",
    color: "#94a3b8",
    borderRadius: 20,
    padding: "5px 14px",
    fontSize: 11,
    fontWeight: 700,
    cursor: "pointer",
  },
  settingsToggleOn: {
    background: "rgba(99,102,241,.22)",
    borderColor: "rgba(99,102,241,.4)",
    color: "#a5b4fc",
  },

  /* CONTROL BAR */
  ctrlBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: "12px 20px",
    background: "#0d1117",
    borderTop: "1px solid rgba(255,255,255,.06)",
    flexShrink: 0,
    overflowX: "auto",
  },
};

export default LiveRoom;