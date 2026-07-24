// import { useEffect, useRef, useState, useCallback } from "react";
// import { createPortal } from "react-dom";
// import { useNavigate, useParams } from "react-router-dom";
// import { Room, RoomEvent, Track, createLocalTracks } from "livekit-client";
// import {
//   startLiveSessionWithToken,
//   endLiveSession,
//   getSessionParticipants,
//   startRecordingLive,
//   stopRecordingLive,
// } from "@/services/liveSessionService";
// import {
//   PhoneOff,
//   X,
//   Circle,
//   Users,
//   Send,
//   Mic,
//   MicOff,
//   Video,
//   VideoOff,
//   ScreenShare,
//   MessageSquare,
//   PictureInPicture2,
//   Wifi,
//   ChevronLeft,
//   ChevronRight,
//   ChevronDown,
//   LayoutGrid,
//   Maximize2,
//   Minimize2,
//   MoreVertical,
//   Settings,
//   Search,
//   Pin,
//   Crown,
//   Lock,
//   Unlock,
//   ClipboardCheck,
//   Radio,
//   ScreenShareOff,
//   Trash2,
//   Hand,
//   MessageSquareOff,
//   UserCheck,
//   UserX,
//   ZoomIn,
//   ZoomOut,
//   ExternalLink,
//   Maximize,
//   MonitorX,
// } from "lucide-react";

// /* ─────────────────────────────────────────────────────────────
//    HELPERS (unchanged business logic)
// ───────────────────────────────────────────────────────────── */
// const getTime = () =>
//   new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

// const CALL_STATE_PREFIX = "trainer_live_state_";
// const CALL_STATE_TTL_MS = 8 * 60 * 60 * 1000;

// const loadPersistedCallState = (sessionId) => {
//   try {
//     const raw = localStorage.getItem(`${CALL_STATE_PREFIX}${sessionId}`);
//     if (!raw) return null;
//     const parsed = JSON.parse(raw);
//     if (!parsed?.token || !parsed?.startedAt) return null;
//     if (Date.now() - parsed.startedAt > CALL_STATE_TTL_MS) {
//       localStorage.removeItem(`${CALL_STATE_PREFIX}${sessionId}`);
//       return null;
//     }
//     return parsed;
//   } catch (_) {
//     return null;
//   }
// };

// const savePersistedCallState = (sessionId, state) => {
//   try {
//     localStorage.setItem(
//       `${CALL_STATE_PREFIX}${sessionId}`,
//       JSON.stringify(state),
//     );
//   } catch (_) {}
// };

// const clearPersistedCallState = (sessionId) => {
//   try {
//     localStorage.removeItem(`${CALL_STATE_PREFIX}${sessionId}`);
//   } catch (_) {}
//   try {
//     sessionStorage.removeItem("call_state");
//   } catch (_) {}
// };

// const readLegacyCallState = () => {
//   try {
//     const raw = sessionStorage.getItem("call_state");
//     return raw ? JSON.parse(raw) : null;
//   } catch (_) {
//     return null;
//   }
// };

// const buildSnapshot = (room, pendingIdentities) => {
//   if (!room) return { camTiles: [], screenTiles: [], audioTracks: [] };
//   const pending = pendingIdentities || new Set();

//   const camTiles = [];
//   // FIX (Part 2 — Student Screen Share tab): this used to be a single
//   // `screenTile` variable that each participant's data silently
//   // overwrote in turn, so if the trainer and a student (or two
//   // students) were sharing at once, whichever was processed last
//   // "won" and every other active share just disappeared with no way
//   // to see or switch to it. Now every active share is collected here;
//   // the component picks which one is currently focused on the main
//   // stage (see `focusedScreenIdentity` below) instead of this function
//   // silently deciding for it.
//   const screenTiles = [];
//   const audioTracks = [];

//   const addParticipant = (participant, isLocal) => {
//     const videoPubs = Array.from(
//       participant.videoTrackPublications?.values?.() || [],
//     );
//     const audioPubs = Array.from(
//       participant.audioTrackPublications?.values?.() || [],
//     );

//     const micPub = audioPubs.find((p) => p.source === Track.Source.Microphone);
//     const micMuted = micPub ? !!micPub.isMuted : true;

//     const camPub = videoPubs.find((p) => p.source === Track.Source.Camera);
//     const screenPub = videoPubs.find(
//       (p) => p.source === Track.Source.ScreenShare,
//     );

//     const name = isLocal
//       ? "You (Trainer)"
//       : participant.name || participant.identity || "Student";
//     const baseId = isLocal ? "local" : participant.identity;
//     // identity: the raw LiveKit identity for this participant ("you" for the
//     // trainer, matching the key the student-side context uses for its own
//     // hand-raise state). Used only to look up raisedHands/reaction data —
//     // does not change any tile-building behavior above.
//     const identity = isLocal ? "you" : participant.identity;

//     camTiles.push({
//       id: `${baseId}-cam`,
//       name,
//       isLocal,
//       isHost: isLocal,
//       identity,
//       track: camPub && camPub.track ? camPub.track : null,
//       videoMuted: !camPub || !!camPub.isMuted || !camPub.track,
//       micMuted,
//     });

//     if (screenPub && screenPub.track) {
//       screenTiles.push({
//         id: `${baseId}-screen`,
//         name: isLocal ? "You're presenting" : `${name} is presenting`,
//         isLocal,
//         isScreen: true,
//         identity,
//         track: screenPub.track,
//       });
//     }

//     if (!isLocal && micPub && micPub.track) {
//       audioTracks.push({ id: `${baseId}-audio`, track: micPub.track });
//     }
//   };

//   addParticipant(room.localParticipant, true);
//   room.remoteParticipants.forEach((p) => {
//     if (pending.has(p.identity)) return; // awaiting trainer approval
//     addParticipant(p, false);
//   });

//   return { camTiles, screenTiles, audioTracks };
// };

// const getDevice = (w) => {
//   if (w <= 480) return "phone";
//   if (w <= 767) return "phoneLg";
//   if (w <= 1023) return "tablet";
//   if (w <= 1365) return "laptop";
//   return "desktop";
// };

// const DEVICE_CONFIG = {
//   phone: {
//     filmstripTile: { width: 76, height: 76 },
//     sidebarMode: "overlayFull",
//     ctrlCompact: true,
//     hideClassName: true,
//     hideHeaderExtras: true,
//   },
//   phoneLg: {
//     filmstripTile: { width: 92, height: 92 },
//     sidebarMode: "overlayFull",
//     ctrlCompact: true,
//     hideClassName: true,
//     hideHeaderExtras: true,
//   },
//   tablet: {
//     filmstripTile: { width: 112, height: 112 },
//     sidebarMode: "overlayWide",
//     ctrlCompact: false,
//     hideClassName: false,
//     hideHeaderExtras: false,
//   },
//   laptop: {
//     filmstripTile: { width: 118, height: 118 },
//     sidebarMode: "panelNarrow",
//     ctrlCompact: false,
//     hideClassName: false,
//     hideHeaderExtras: false,
//   },
//   desktop: {
//     filmstripTile: { width: 128, height: 128 },
//     sidebarMode: "panelFull",
//     ctrlCompact: false,
//     hideClassName: false,
//     hideHeaderExtras: false,
//   },
// };

// const useResponsiveDevice = () => {
//   const [size, setSize] = useState(() => ({
//     w: typeof window !== "undefined" ? window.innerWidth : 1366,
//     h: typeof window !== "undefined" ? window.innerHeight : 768,
//   }));

//   useEffect(() => {
//     let raf = null;
//     const onResize = () => {
//       if (raf) cancelAnimationFrame(raf);
//       raf = requestAnimationFrame(() =>
//         setSize({ w: window.innerWidth, h: window.innerHeight }),
//       );
//     };
//     window.addEventListener("resize", onResize);
//     window.addEventListener("orientationchange", onResize);
//     return () => {
//       window.removeEventListener("resize", onResize);
//       window.removeEventListener("orientationchange", onResize);
//       if (raf) cancelAnimationFrame(raf);
//     };
//   }, []);

//   const device = getDevice(size.w);
//   return { ...size, device, cfg: DEVICE_CONFIG[device] };
// };

// const useElapsedTimer = (startedAtMs) => {
//   const [, tick] = useState(0);
//   useEffect(() => {
//     if (!startedAtMs) return;
//     const id = setInterval(() => tick((n) => n + 1), 1000);
//     return () => clearInterval(id);
//   }, [startedAtMs]);

//   if (!startedAtMs) return "00:00:00";
//   const secs = Math.max(0, Math.floor((Date.now() - startedAtMs) / 1000));
//   const hh = String(Math.floor(secs / 3600)).padStart(2, "0");
//   const mm = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
//   const ss = String(secs % 60).padStart(2, "0");
//   return `${hh}:${mm}:${ss}`;
// };

// // Dismiss a popover on outside click / Escape — used for the "More" menu
// // and each participant row's context menu so they behave like the
// // reference design's dropdowns.
// function useDismiss(active, onDismiss, refs = []) {
//   useEffect(() => {
//     if (!active) return undefined;
//     const handlePointer = (e) => {
//       const insideAny = refs.some((r) => r.current && r.current.contains(e.target));
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

// /* ═════════════════════════════════════════════════════════════
//    MAIN COMPONENT
// ═════════════════════════════════════════════════════════════ */
// const LiveSessionControls = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();

//   const roomRef = useRef(null);
//   const localVideoTrackRef = useRef(null);
//   const localAudioTrackRef = useRef(null);
//   const chatEndRef = useRef(null);
//   const autoEndPollRef = useRef(null);
//   const participantPollRef = useRef(null);

//   const hardStopTimeoutRef = useRef(null);
//   const performAutoEndRef = useRef(null);
//   const autoEndingRef = useRef(false);

//   const [connected, setConnected] = useState(false);
//   const [micOn, setMicOn] = useState(true);
//   const [camOn, setCamOn] = useState(true);
//   const [screenOn, setScreenOn] = useState(false);
//   const [recording, setRecording] = useState(true);
//   const [recToggling, setRecToggling] = useState(false);
//   const [recError, setRecError] = useState(null);
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [participants, setParticipants] = useState([]);
//   const startedRef = useRef(false);
//   const recTogglingRef = useRef(false);
//   const recCooldownRef = useRef(false);
//   const [dbParticipants, setDbParticipants] = useState([]);

//   const [camTiles, setCamTiles] = useState([]);
//   const [screenTiles, setScreenTiles] = useState([]);
//   // Which student's share (by identity) the trainer has pinned to the
//   // main stage when more than one is active at once. Null = default to
//   // the trainer's own share if live, else whichever share came first.
//   const [focusedScreenIdentity, setFocusedScreenIdentity] = useState(null);
//   const [remoteAudioTracks, setRemoteAudioTracks] = useState([]);
//   const [audioBlocked, setAudioBlocked] = useState(false);

//   // ── Real-time student actions (hand raise / reactions), mirrored from
//   // LiveMeetingContext's student-side shape: raisedHands is keyed by
//   // participant identity, floaters is a flat list of live emoji floats
//   // each tagged with the identity that sent it so a tile can filter to
//   // "its own" floaters. Populated from RoomEvent.DataReceived below —
//   // this is new state only, no existing state/logic is touched.
//   const [raisedHands, setRaisedHands] = useState({});
//   const [floaters, setFloaters] = useState([]);
//   const floaterIdRef = useRef(0);

//   const { w: viewportW, device, cfg: deviceCfg } = useResponsiveDevice();
//   const isCompactDevice = device === "phone" || device === "phoneLg";
//   const [messages, setMessages] = useState(() => [
//     {
//       id: 0,
//       user: "System",
//       text: "Session started. Welcome!",
//       time: getTime(),
//       system: true,
//     },
//   ]);
//   const [input, setInput] = useState("");
//   const [sessionTitle, setSessionTitle] = useState(`Session ${id}`);
//   const [autoEndWarning, setAutoEndWarning] = useState(false);
//   const [autoEndMessage, setAutoEndMessage] = useState(
//     "Session duration has completed. The meeting has ended automatically.",
//   );

//   const [meetingStartedAt, setMeetingStartedAt] = useState(null);
//   const timer = useElapsedTimer(meetingStartedAt);

//   const [pipWindow, setPipWindow] = useState(null);
//   const pipVideoRef = useRef(null);
//   const userClosedPipRef = useRef(false);

//   /* ── NEW: presentation-only UI state (view/visual toggles).
//      None of these call any service/API — they only change what is
//      rendered, exactly like the reference screenshot's chrome. ── */
//   const [chatOpen, setChatOpen] = useState(true);
//   const [participantSearch, setParticipantSearch] = useState("");
//   const [openParticipantMenuId, setOpenParticipantMenuId] = useState(null);
//   const [moreMenuOpen, setMoreMenuOpen] = useState(false);
//   const [viewMenuOpen, setViewMenuOpen] = useState(false);
//   const [spotlightOn, setSpotlightOn] = useState(true);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [settingsQuickOpen, setSettingsQuickOpen] = useState(false);
//   const [pendingRequests, setPendingRequests] = useState([]); // [{identity, name, time}]
//   const pendingIdentitiesRef = useRef(new Set());
//   const [attendanceOpen, setAttendanceOpen] = useState(false);
//   const [sidebarWidth, setSidebarWidth] = useState(320);
//   const [sidebarResizing, setSidebarResizing] = useState(false);
//   const [sidebarResizeHover, setSidebarResizeHover] = useState(false);
//   const sidebarResizeRef = useRef({ startX: 0, startWidth: 320 });
//   const rootRef = useRef(null);
//   const moreMenuBtnRef = useRef(null);
//   const moreMenuPanelRef = useRef(null);
//   const viewMenuBtnRef = useRef(null);
//   const viewMenuPanelRef = useRef(null);
//   const filmstripRef = useRef(null);

//   // Trainer-controls panel — purely visual toggles for actions that have
//   // no corresponding backend endpoint yet. They flip a badge/icon state
//   // and drop a note in chat so the trainer gets feedback, but they never
//   // touch LiveKit, the room, or any service call.
//   const [trainerFlags, setTrainerFlags] = useState({
//     allMuted: false,
//     camerasDisabled: false,
//     handsLowered: false,
//     chatDisabled: false,
//     locked: false,
//     micRequestsAllowed: true,
//     screenShareBlocked: false,
//   });

//   const pushSystem = useCallback((text) => {
//     setMessages((prev) => [
//       ...prev,
//       { id: Date.now(), user: "System", text, time: getTime(), system: true },
//     ]);
//   }, []);

//   const refreshParticipants = useCallback(() => {
//     const room = roomRef.current;
//     if (!room) return;
//     const list = [
//       {
//         id: room.localParticipant.identity,
//         name: room.localParticipant.name || "You (Trainer)",
//         self: true,
//         isHost: true,
//       },
//     ];
//     room.remoteParticipants.forEach((p) =>
//       list.push({
//         id: p.identity,
//         name: p.name || p.identity,
//         self: false,
//         isHost: false,
//       }),
//     );
//     setParticipants(list);
//   }, []);

//   const rebuild = useCallback(() => {
//     const snap = buildSnapshot(roomRef.current, pendingIdentitiesRef.current);
//     setCamTiles(snap.camTiles);
//     setScreenTiles(snap.screenTiles);
//     setRemoteAudioTracks(snap.audioTracks);
//   }, []);

//   const enableAllAudio = useCallback(() => {
//     document
//       .querySelectorAll('audio[data-remote-audio="1"]')
//       .forEach((el) => {
//         el.muted = false;
//         el.play().catch(() => {});
//       });
//     setAudioBlocked(false);
//   }, []);

//   const toggleRecording = useCallback(async () => {
//     if (!id) return;
//     if (recTogglingRef.current) return;
//     if (recCooldownRef.current) {
//       setRecError("Please wait a few seconds before toggling recording again.");
//       return;
//     }
//     recTogglingRef.current = true;

//     setRecError(null);
//     setRecToggling(true);
//     try {
//       if (recording) {
//         await stopRecordingLive(id);
//         setRecording(false);
//       } else {
//         await startRecordingLive(id);
//         setRecording(true);
//       }
//     } catch (err) {
//       console.error(err);
//       setRecError(err?.response?.data?.error || "Failed to toggle recording.");
//     } finally {
//       setRecToggling(false);
//       recTogglingRef.current = false;
//       recCooldownRef.current = true;
//       setTimeout(() => {
//         recCooldownRef.current = false;
//       }, 12000);
//     }
//   }, [id, recording]);

//   const fetchDbParticipants = useCallback(async () => {
//     if (!id) return;
//     try {
//       const res = await getSessionParticipants(id);
//       setDbParticipants(res.data || []);
//     } catch (_) {
//       // silently ignore
//     }
//   }, [id]);

//   const getFreshAuthToken = useCallback(() => {
//     return (
//       localStorage.getItem("token") ||
//       localStorage.getItem("lms_token") ||
//       localStorage.getItem("accessToken") ||
//       (() => {
//         try {
//           return JSON.parse(localStorage.getItem("lms_user") || "{}")?.token;
//         } catch {
//           return null;
//         }
//       })()
//     );
//   }, []);

//   useEffect(() => {
//     if (!id) return;
//     const serverUrl = import.meta.env.VITE_LIVEKIT_URL || "ws://localhost:7880";

//     if (startedRef.current) {
//       return;
//     }
//     startedRef.current = true;

//     const start = async () => {
//       let token;
//       let room_name;
//       let startedAt;

//       try {
//         const persisted = loadPersistedCallState(id);
//         const legacy = readLegacyCallState();

//         if (persisted?.token) {
//           token = persisted.token;
//           room_name = persisted.room;
//           startedAt = persisted.startedAt;
//         } else if (legacy?.token) {
//           token = legacy.token;
//           room_name = legacy.room;
//           startedAt = legacy.startedAt || Date.now();
//         } else {
//           const res = await startLiveSessionWithToken(id);
//           token = res?.data?.token;
//           room_name = res?.data?.room;
//           setSessionTitle(res?.data?.title || `Session ${id}`);
//           startedAt = Date.now();
//         }

//         if (!token) {
//           console.error("No token returned");
//           startedRef.current = false;
//           return;
//         }
//       } catch (err) {
//         console.error("startLiveSessionWithToken failed:", err);
//         startedRef.current = false;
//         return;
//       }

//       setMeetingStartedAt(startedAt);
//       savePersistedCallState(id, { token, room: room_name, startedAt });
//       try {
//         sessionStorage.removeItem("call_state");
//       } catch (_) {}

//       const room = new Room({ adaptiveStream: true, dynacast: true });
//       roomRef.current = room;

//       try {
//         await room.connect(serverUrl, token);
//         setConnected(true);
//         refreshParticipants();
//         rebuild();

//         fetchDbParticipants();
//         participantPollRef.current = setInterval(fetchDbParticipants, 5000);

//         let hardStopArmed = false;

//         const armHardStopTimer = (durationMinutes) => {
//           if (hardStopArmed || !durationMinutes) return;
//           hardStopArmed = true;
//           const endsAt = startedAt + Number(durationMinutes) * 60 * 1000;
//           const msLeft = endsAt - Date.now();
//           hardStopTimeoutRef.current = setTimeout(
//             () => {
//               performAutoEndRef.current?.(
//                 "Session duration has completed. The meeting has ended automatically.",
//               );
//             },
//             Math.max(0, msLeft),
//           );
//         };

//         const checkSessionStatus = async () => {
//           try {
//             const freshToken = getFreshAuthToken();
//             const res = await fetch(
//               `${import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api"}/live-sessions/${id}`,
//               {
//                 headers: freshToken
//                   ? { Authorization: `Bearer ${freshToken}` }
//                   : {},
//               },
//             );
//             if (!res.ok) {
//               return;
//             }
//             const data = await res.json();

//             if (!hardStopArmed && data.duration) {
//               armHardStopTimer(data.duration);
//             }

//             if (data.status === "ENDED") {
//               performAutoEndRef.current?.(
//                 "Session duration has completed. The meeting has ended automatically.",
//               );
//             }
//           } catch (_) {
//             // network hiccup — next tick / hard-stop timer still cover us
//           }
//         };

//         checkSessionStatus();
//         autoEndPollRef.current = setInterval(checkSessionStatus, 15000);
//       } catch (err) {
//         console.error("LiveKit connect failed:", err);
//         startedRef.current = false;
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
//         for (const track of tracks) {
//           await room.localParticipant.publishTrack(track);
//           if (track.kind === Track.Kind.Video) localVideoTrackRef.current = track;
//           if (track.kind === Track.Kind.Audio) localAudioTrackRef.current = track;
//         }
//       } catch (err) {
//         console.error("createLocalTracks failed:", err);
//       }

//       rebuild();

//       room.on(RoomEvent.TrackSubscribed, () => rebuild());
//       room.on(RoomEvent.TrackUnsubscribed, () => rebuild());
//       room.on(RoomEvent.TrackMuted, () => rebuild());
//       room.on(RoomEvent.TrackUnmuted, () => rebuild());
//       room.on(RoomEvent.LocalTrackPublished, () => rebuild());
//       room.on(RoomEvent.LocalTrackUnpublished, () => rebuild());
//       room.on(RoomEvent.ParticipantConnected, (p) => {
//         pendingIdentitiesRef.current.add(p.identity);
//         setPendingRequests((prev) =>
//           prev.some((r) => r.identity === p.identity)
//             ? prev
//             : [...prev, { identity: p.identity, name: p.name || p.identity, time: getTime() }],
//         );
//         refreshParticipants();
//         fetchDbParticipants();
//         pushSystem(`${p.name || p.identity} is requesting to join — awaiting your approval.`);
//         rebuild();
//       });
//       room.on(RoomEvent.ParticipantDisconnected, (p) => {
//         pendingIdentitiesRef.current.delete(p.identity);
//         setPendingRequests((prev) => prev.filter((r) => r.identity !== p.identity));
//         refreshParticipants();
//         pushSystem(`${p.name || p.identity} left`);
//         setRaisedHands((prev) => {
//           if (!(p.identity in prev)) return prev;
//           const next = { ...prev };
//           delete next[p.identity];
//           return next;
//         });
//         rebuild();
//       });
//       room.on(RoomEvent.DataReceived, (payload, participant) => {
//         try {
//           const decoded = new TextDecoder().decode(payload);
//           const msg = JSON.parse(decoded);

//           // Same data-channel contract LiveMeetingContext already listens
//           // for on the student side: { type: "reaction", emoji } and
//           // { type: "raiseHand", raised }. Keyed by the sender's identity
//           // so the trainer knows exactly which student/tile it belongs to.
//           if (msg.type === "reaction") {
//             const identity = participant?.identity;
//             const fId = ++floaterIdRef.current;
//             setFloaters((prev) => [
//               ...prev,
//               {
//                 id: fId,
//                 identity,
//                 emoji: msg.emoji,
//                 name: participant?.name || identity || "Someone",
//               },
//             ]);
//             setTimeout(() => {
//               setFloaters((prev) => prev.filter((f) => f.id !== fId));
//             }, 2500);
//             return;
//           }

//           if (msg.type === "raiseHand") {
//             const identity = participant?.identity;
//             if (identity) {
//               setRaisedHands((prev) => ({ ...prev, [identity]: !!msg.raised }));
//               pushSystem(
//                 `${participant?.name || identity} ${msg.raised ? "raised" : "lowered"} their hand`,
//               );
//             }
//             return;
//           }

//           if (msg.text)
//             setMessages((prev) => [
//               ...prev,
//               {
//                 id: Date.now(),
//                 user: participant?.name || participant?.identity || "Student",
//                 text: msg.text,
//                 time: getTime(),
//                 self: false,
//               },
//             ]);
//         } catch (_) {}
//       });
//       room.on(RoomEvent.Disconnected, () => setConnected(false));
//     };

//     start();

//     return () => {
//       if (autoEndPollRef.current) clearInterval(autoEndPollRef.current);
//       if (participantPollRef.current) clearInterval(participantPollRef.current);
//       if (hardStopTimeoutRef.current) clearTimeout(hardStopTimeoutRef.current);
//       roomRef.current?.disconnect();
//       startedRef.current = false;
//     };
//   }, [id]);

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, chatOpen]);

//   const toggleMic = useCallback(async () => {
//     const track = localAudioTrackRef.current;
//     if (!track) return;
//     if (micOn) await track.mute();
//     else await track.unmute();
//     setMicOn((v) => !v);
//     rebuild();
//   }, [micOn, rebuild]);

//   const toggleCam = useCallback(async () => {
//     const track = localVideoTrackRef.current;
//     if (!track) return;
//     if (camOn) await track.mute();
//     else await track.unmute();
//     setCamOn((v) => !v);
//     rebuild();
//   }, [camOn, rebuild]);

//   const toggleScreen = useCallback(async () => {
//     const room = roomRef.current;
//     if (!room) return;
//     if (screenOn) {
//       try {
//         await room.localParticipant.setScreenShareEnabled(false);
//       } catch (_) {}
//       setScreenOn(false);
//       rebuild();
//     } else {
//       try {
//         // FIX (recursive "hall of mirrors" screen share): without these
//         // options, the browser's picker lets the trainer select the very
//         // tab/window this meeting is running in, producing an infinite
//         // self-capture loop. selfBrowserSurface: "exclude" removes the
//         // current tab from the picker entirely in Chromium browsers.
//         const pub = await room.localParticipant.setScreenShareEnabled(true, {
//           audio: false,
//           selfBrowserSurface: "exclude",
//           surfaceSwitching: "include",
//           systemAudio: "exclude",
//         });
//         if (!pub) return;
//         setScreenOn(true);
//         rebuild();
//         const mediaTrack = pub.track?.mediaStreamTrack ?? null;
//         if (mediaTrack) {
//           mediaTrack.addEventListener(
//             "ended",
//             () => {
//               room.localParticipant
//                 .setScreenShareEnabled(false)
//                 .catch(() => {});
//               setScreenOn(false);
//               rebuild();
//             },
//             { once: true },
//           );
//         }
//       } catch (err) {
//         if (err?.name !== "NotAllowedError")
//           console.warn("Screen share failed:", err);
//       }
//     }
//   }, [screenOn, rebuild]);

//   // Which of possibly-several simultaneous shares is on the main stage.
//   // Default preference: the trainer's own share (if live) so starting to
//   // present always takes you to your own screen; otherwise whichever
//   // share the trainer explicitly focused via the Screen Sharing panel;
//   // otherwise just the first active share. This replaces the old
//   // singular `screenTile` value everywhere below.
//   const screenTile =
//     screenTiles.find((t) => t.isLocal) ||
//     screenTiles.find((t) => t.identity === focusedScreenIdentity) ||
//     screenTiles[0] ||
//     null;

//   // Main stage = local trainer tile (or the active screen share); every
//   // other tile goes into the filmstrip — this is the same tile data as
//   // before, just displayed as one persistent "speaker view" instead of
//   // switching between a gallery grid and a spotlight layout.
//   const mainTile =
//     screenTile || camTiles.find((t) => t.isLocal) || camTiles[0] || null;
//   const filmstripTiles = camTiles.filter((t) => t.id !== mainTile?.id);

//   // FIX (trainer can't see everyone): the "View" menu already offered a
//   // "Tile view" option (setSpotlightOn(false)), but nothing ever read
//   // spotlightOn to change what rendered — the stage always showed one
//   // big mainTile plus a filmstrip capped at MAX_VISIBLE_FILMSTRIP_TILES,
//   // so with more than ~7 participants the trainer physically could not
//   // see everyone at once, no matter which view was selected. Tile view
//   // is now real: a responsive Meet-style grid of every camTile. Screen
//   // share still always takes over the stage (matching Meet/Zoom/Teams,
//   // where a presentation forces speaker-style layout regardless of the
//   // viewer's chosen gallery/tile preference).
//   const useGridView = !spotlightOn && screenTiles.length === 0;
//   const gridTileCount = camTiles.length;
//   const computeGridColumns = (count) => {
//     if (count <= 1) return 1;
//     if (count <= 4) return 2;
//     if (count <= 6) return 3;
//     if (count <= 9) return 3;
//     if (count <= 16) return 4;
//     return 5;
//   };
//   const gridColumns = isCompactDevice
//     ? Math.min(2, computeGridColumns(gridTileCount))
//     : computeGridColumns(gridTileCount);

//   // Meet caps the visible filmstrip and folds the rest into a "+N" tile
//   // instead of shrinking every tile as more students join. Purely a
//   // display cap on top of the existing filmstripTiles list above — the
//   // selection logic itself isn't touched.
//   //
//   // FIX: a raised hand must never be the thing that gets pushed into the
//   // "+N" overflow tile — the trainer can't see (or lower) a hand they
//   // can't see. So before slicing to the cap, raised-hand tiles are
//   // stably sorted to the front (same "raised-hand-first" rule already
//   // used for the Participants list below). Everyone else keeps their
//   // existing relative order.
//   const MAX_VISIBLE_FILMSTRIP_TILES = 6;
//   const filmstripTilesByPriority = [...filmstripTiles].sort((a, b) => {
//     const aRaised = raisedHands[a.identity] ? 1 : 0;
//     const bRaised = raisedHands[b.identity] ? 1 : 0;
//     return bRaised - aRaised;
//   });
//   const visibleFilmstripTiles = filmstripTilesByPriority.slice(0, MAX_VISIBLE_FILMSTRIP_TILES);
//   const filmstripOverflowCount = Math.max(0, filmstripTiles.length - MAX_VISIBLE_FILMSTRIP_TILES);

//   const closePiP = useCallback(() => {
//     setPipWindow((win) => {
//       if (win) {
//         try {
//           win.close();
//         } catch (_) {}
//       }
//       return null;
//     });
//     const v = pipVideoRef.current;
//     if (v && document.pictureInPictureElement === v) {
//       document.exitPictureInPicture().catch(() => {});
//     }
//   }, []);

//   const openFallbackVideoPiP = useCallback(async () => {
//     try {
//       const el = pipVideoRef.current;
//       const track = mainTile?.track;
//       if (!el || !track || !document.pictureInPictureEnabled) return;
//       track.attach(el);
//       if (document.pictureInPictureElement !== el) {
//         await el.requestPictureInPicture();
//       }
//     } catch (err) {
//       console.warn("Fallback video PiP unavailable:", err);
//     }
//   }, [mainTile]);

//   const openPiP = useCallback(async () => {
//     if (pipWindow || userClosedPipRef.current) return;
//     if (!("documentPictureInPicture" in window)) {
//       openFallbackVideoPiP();
//       return;
//     }
//     try {
//       const pip = await window.documentPictureInPicture.requestWindow({
//         width: 360,
//         height: 260,
//       });

//       [...document.styleSheets].forEach((styleSheet) => {
//         try {
//           const rules = [...styleSheet.cssRules]
//             .map((r) => r.cssText)
//             .join("");
//           const style = pip.document.createElement("style");
//           style.textContent = rules;
//           pip.document.head.appendChild(style);
//         } catch (_) {
//           if (styleSheet.href) {
//             const link = pip.document.createElement("link");
//             link.rel = "stylesheet";
//             link.href = styleSheet.href;
//             pip.document.head.appendChild(link);
//           }
//         }
//       });
//       pip.document.body.style.margin = "0";
//       pip.document.body.style.background = "#0B0D11";
//       pip.document.body.style.overflow = "hidden";

//       pip.addEventListener("pagehide", () => setPipWindow(null));

//       setPipWindow(pip);
//     } catch (err) {
//       console.warn("Document PiP failed, using fallback:", err);
//       openFallbackVideoPiP();
//     }
//   }, [pipWindow, openFallbackVideoPiP]);

//   const returnToMeeting = useCallback(() => {
//     userClosedPipRef.current = true;
//     closePiP();
//     window.focus();
//     setTimeout(() => {
//       userClosedPipRef.current = false;
//     }, 500);
//   }, [closePiP]);

//   useEffect(() => {
//     performAutoEndRef.current = async (message) => {
//       if (autoEndingRef.current) return;
//       autoEndingRef.current = true;

//       if (autoEndPollRef.current) {
//         clearInterval(autoEndPollRef.current);
//         autoEndPollRef.current = null;
//       }
//       if (participantPollRef.current) {
//         clearInterval(participantPollRef.current);
//         participantPollRef.current = null;
//       }
//       if (hardStopTimeoutRef.current) {
//         clearTimeout(hardStopTimeoutRef.current);
//         hardStopTimeoutRef.current = null;
//       }

//       setAutoEndMessage(
//         message ||
//           "Session duration has completed. The meeting has ended automatically.",
//       );
//       setAutoEndWarning(true);

//       if (recording && id) {
//         try {
//           await stopRecordingLive(id);
//         } catch (_) {}
//       }

//       try {
//         if (roomRef.current?.localParticipant?.isScreenShareEnabled) {
//           await roomRef.current.localParticipant.setScreenShareEnabled(false);
//         }
//       } catch (_) {}

//       try {
//         localAudioTrackRef.current?.stop?.();
//       } catch (_) {}
//       try {
//         localVideoTrackRef.current?.stop?.();
//       } catch (_) {}

//       try {
//         closePiP();
//       } catch (_) {}

//       clearPersistedCallState(id);

//       setTimeout(() => {
//         try {
//           roomRef.current?.removeAllListeners?.();
//         } catch (_) {}
//         try {
//           roomRef.current?.disconnect();
//         } catch (_) {}
//         navigate("/trainer/live");
//       }, 3000);
//     };
//   });

//   const sendMessage = useCallback(() => {
//     const text = input.trim();
//     if (!text) return;
//     setMessages((prev) => [
//       ...prev,
//       {
//         id: Date.now(),
//         user: "You (Trainer)",
//         text,
//         time: getTime(),
//         self: true,
//       },
//     ]);
//     setInput("");
//     try {
//       const payload = new TextEncoder().encode(
//         JSON.stringify({ text, name: "Trainer" }),
//       );
//       roomRef.current?.localParticipant?.publishData(payload, {
//         reliable: true,
//       });
//     } catch (e) {
//       console.warn("data send failed:", e);
//     }
//   }, [input]);

//   const handleEndSession = useCallback(async () => {
//     autoEndingRef.current = true;
//     if (autoEndPollRef.current) clearInterval(autoEndPollRef.current);
//     if (participantPollRef.current) clearInterval(participantPollRef.current);
//     if (hardStopTimeoutRef.current) clearTimeout(hardStopTimeoutRef.current);
//     try {
//       await endLiveSession(id);
//     } catch (_) {}
//     clearPersistedCallState(id);
//     roomRef.current?.disconnect();
//     navigate("/trainer/live");
//   }, [id, navigate]);

//   const activeDbParticipants = dbParticipants.filter(
//     (p) => p.leaveTime === null || p.leaveTime === undefined,
//   );

//   const filteredDbParticipants = activeDbParticipants.filter((p) =>
//     (p.studentEmail || "").toLowerCase().includes(participantSearch.toLowerCase()),
//   );

//   // ── Matches a DB participant row (activeDbParticipants) to its live
//   // LiveKit camTile, so the Participants panel can show real mic/cam/
//   // hand-raise/presenting state instead of the previous hardcoded icons.
//   // The DB row and the LiveKit room don't share one guaranteed common id
//   // field, so this tries every plausible match (identity/userId/studentId
//   // first, then a case-insensitive email/name check) and just returns
//   // null — falling back to the previous "unknown" look — if nothing
//   // lines up. Doesn't touch camTiles/buildSnapshot's own logic.
//   //
//   // ⚠️ VERIFY: this is only as good as the LiveKit token's `identity`
//   // field actually matching one of studentEmail/studentId/userId/id.
//   // Confirm on the backend (wherever the student join token is minted,
//   // e.g. next to startLiveSessionWithToken) which value is passed as
//   // `identity` — if it's some other internal id, add it to the
//   // `candidates` list below.
//   const identityMismatchWarnedRef = useRef(false);
//   const findLiveTileForDbParticipant = useCallback(
//     (p) => {
//       if (!p) return null;
//       const candidates = [p.identity, p.userId, p.studentId, p.id]
//         .filter(Boolean)
//         .map(String);
//       let tile = camTiles.find(
//         (t) => !t.isLocal && candidates.includes(String(t.identity)),
//       );
//       if (!tile && p.studentEmail) {
//         const emailLc = String(p.studentEmail).toLowerCase();
//         tile = camTiles.find(
//           (t) =>
//             !t.isLocal &&
//             (String(t.name).toLowerCase() === emailLc ||
//               String(t.identity).toLowerCase() === emailLc),
//         );
//       }
//       return tile || null;
//     },
//     [camTiles],
//   );

//   // ══════════════════════════════════════════════════════════════
//   // BUG FIX 3 — "Participants Panel Not Showing Students"
//   // ══════════════════════════════════════════════════════════════
//   // Previously the Participants panel rendered ONLY from
//   // `dbParticipants` — a list fetched from the backend and refreshed by
//   // polling every 5s (`fetchDbParticipants`). If that endpoint was slow,
//   // stale, or simply didn't include a student yet (or the student's DB
//   // row used a different id shape than expected), the panel showed just
//   // "You (Trainer)" even though the student was already visibly
//   // connected — e.g. already appearing as a tile in the video
//   // filmstrip. The filmstrip is driven by `camTiles`, which is rebuilt
//   // instantly on every LiveKit RoomEvent (`rebuild()` — join, leave,
//   // mute, track published/unpublished), so it is the true, real-time
//   // source of who is actually in the call.
//   //
//   // The Participants list now reads directly from that same live
//   // `camTiles` snapshot instead of the slow/possibly-incomplete DB
//   // list, so a connected student appears the instant they join (and
//   // disappears the instant they leave) — matching the video tiles. The
//   // DB record is now only used to *enrich* a live tile with its email/
//   // join-time when a match can be found (via the existing
//   // `findLiveTileForDbParticipant` matching rules) — it is no longer
//   // the source of truth for *whether* someone is shown.
//   const liveRemoteParticipants = camTiles.filter((t) => !t.isLocal);
//   const totalLiveParticipants = liveRemoteParticipants.length + 1;

//   const findDbParticipantForLiveTile = useCallback(
//     (tile) => {
//       if (!tile) return null;
//       return (
//         activeDbParticipants.find(
//           (p) => findLiveTileForDbParticipant(p)?.identity === tile.identity,
//         ) || null
//       );
//     },
//     [activeDbParticipants, findLiveTileForDbParticipant],
//   );

//   const filteredLiveParticipants = liveRemoteParticipants.filter((t) => {
//     const dbMatch = findDbParticipantForLiveTile(t);
//     const label = (dbMatch?.studentEmail || t.name || t.identity || "").toLowerCase();
//     return label.includes(participantSearch.toLowerCase());
//   });

//   // Raised-hand-first ordering for the Participants list, matching
//   // Meet/Zoom trainer-panel behavior — a stable sort so participants
//   // without a raised hand keep their existing relative order.
//   const sortedLiveParticipants = [...filteredLiveParticipants].sort((a, b) => {
//     const aRaised = raisedHands[a.identity] ? 1 : 0;
//     const bRaised = raisedHands[b.identity] ? 1 : 0;
//     return bRaised - aRaised;
//   });

//   const closeMoreMenu = useCallback(() => setMoreMenuOpen(false), []);
//   const closeViewMenu = useCallback(() => setViewMenuOpen(false), []);
//   useDismiss(moreMenuOpen, closeMoreMenu, [moreMenuBtnRef, moreMenuPanelRef]);
//   useDismiss(viewMenuOpen, closeViewMenu, [viewMenuBtnRef, viewMenuPanelRef]);

//   /* ── Presentation-only handlers: toggle a visual flag, drop a system
//      chat note, and (if it's something we can genuinely do — mic/cam/
//      screen-share/recording, which already have real handlers above)
//      nothing further is needed since those buttons call the real
//      handlers directly. Anything without a backend endpoint yet is a
//      labelled placeholder, as requested. ── */
//   // Broadcasts a trainer command to every participant over the LiveKit
//   // data channel (same mechanism the chat uses). A matching listener on
//   // the student-side component (RoomEvent.DataReceived, type ===
//   // "trainer_command") is what turns this into real enforcement — this
//   // file only owns the trainer side of that contract.
//   const broadcastTrainerCommand = useCallback((command, value, extra) => {
//     try {
//       const payload = new TextEncoder().encode(
//         JSON.stringify({ type: "trainer_command", command, value, ...(extra || {}) }),
//       );
//       roomRef.current?.localParticipant?.publishData(payload, { reliable: true });
//     } catch (e) {
//       console.warn("trainer command broadcast failed:", e);
//     }
//   }, []);

//   // Targeted "stop this one student's screen share" — Part 2/3 of the
//   // spec. Unlike the other Trainer Controls buttons (which broadcast to
//   // everyone), this sends { command: "stopScreenShare", identity } and
//   // the matching student-side listener (LiveMeetingContext.jsx) only
//   // acts on it when the identity matches their own.
//   const stopStudentScreenShare = useCallback(
//     (identity, name) => {
//       broadcastTrainerCommand("stopScreenShare", true, { identity });
//       pushSystem(`Stopped ${name || "a student"}'s screen share.`);
//       setFocusedScreenIdentity((cur) => (cur === identity ? null : cur));
//     },
//     [broadcastTrainerCommand, pushSystem],
//   );

//   const toggleTrainerFlag = useCallback((key, onLabel, offLabel) => {
//     setTrainerFlags((prev) => {
//       const next = { ...prev, [key]: !prev[key] };
//       pushSystem(next[key] ? onLabel : offLabel);
//       broadcastTrainerCommand(key, next[key]);
//       return next;
//     });
//   }, [pushSystem, broadcastTrainerCommand]);

//   const notifyComingSoon = useCallback((label) => {
//     pushSystem(`${label} — coming soon.`);
//   }, [pushSystem]);

//   // ── Join-request queue: Allow lets the participant's tiles/audio into
//   // the room; Deny removes them from the queue. True removal from the
//   // LiveKit room itself needs a server-side RoomServiceClient call
//   // (there's no client-side "kick" API) — wire denyJoinRequest up to a
//   // backend endpoint (e.g. removeParticipantFromSession) to fully kick.
//   const approveJoinRequest = useCallback((identity) => {
//     setPendingRequests((prev) => {
//       const req = prev.find((r) => r.identity === identity);
//       if (req) pushSystem(`${req.name} was allowed into the session.`);
//       return prev.filter((r) => r.identity !== identity);
//     });
//     pendingIdentitiesRef.current.delete(identity);
//     rebuild();
//     refreshParticipants();
//   }, [pushSystem, rebuild, refreshParticipants]);

//   const denyJoinRequest = useCallback((identity) => {
//     setPendingRequests((prev) => {
//       const req = prev.find((r) => r.identity === identity);
//       if (req) pushSystem(`${req.name}'s request to join was denied.`);
//       return prev.filter((r) => r.identity !== identity);
//     });
//   }, [pushSystem]);

//   const handleSidebarResizeStart = useCallback((e) => {
//     e.preventDefault();
//     setSidebarResizing(true);
//     sidebarResizeRef.current = { startX: e.clientX, startWidth: sidebarWidth };
//     const onMove = (ev) => {
//       const delta = sidebarResizeRef.current.startX - ev.clientX; // sidebar is right-anchored
//       const next = Math.min(520, Math.max(260, sidebarResizeRef.current.startWidth + delta));
//       setSidebarWidth(next);
//     };
//     const onUp = () => {
//       setSidebarResizing(false);
//       window.removeEventListener("mousemove", onMove);
//       window.removeEventListener("mouseup", onUp);
//     };
//     window.addEventListener("mousemove", onMove);
//     window.addEventListener("mouseup", onUp);
//   }, [sidebarWidth]);

//   // FIX (Fullscreen glitch): previously this set `isFullscreen` state
//   // manually right after calling requestFullscreen()/exitFullscreen(),
//   // which can desync from the real browser state (e.g. if the request
//   // is denied, blocked, or the promise rejects). The fullscreenchange
//   // listener below is now the single source of truth; this handler only
//   // *requests* the change and never sets isFullscreen itself.
//   const toggleFullscreen = useCallback(() => {
//     const el = rootRef.current;
//     const isCurrentlyFullscreen = !!(
//       document.fullscreenElement || document.webkitFullscreenElement
//     );
//     if (!isCurrentlyFullscreen) {
//       const request = el?.requestFullscreen || el?.webkitRequestFullscreen;
//       const result = request?.call(el);
//       if (result?.catch) result.catch((err) => console.warn("Fullscreen request failed:", err));
//     } else {
//       const exit = document.exitFullscreen || document.webkitExitFullscreen;
//       const result = exit?.call(document);
//       if (result?.catch) result.catch(() => {});
//     }
//   }, []);

//   useEffect(() => {
//     const onFsChange = () =>
//       setIsFullscreen(!!(document.fullscreenElement || document.webkitFullscreenElement));
//     document.addEventListener("fullscreenchange", onFsChange);
//     document.addEventListener("webkitfullscreenchange", onFsChange);
//     return () => {
//       document.removeEventListener("fullscreenchange", onFsChange);
//       document.removeEventListener("webkitfullscreenchange", onFsChange);
//     };
//   }, []);

//   // ── Part 2: floating controls over the shared screen (zoom in/out/
//   // reset, open in a new window, fullscreen scoped to just the stage
//   // rather than the whole widget). stageZoom is a simple CSS scale
//   // factor clamped to a sane range; stageVideoWrapRef points at the
//   // actual video-wrap DOM node so "expand" fullscreens only that tile.
//   const [stageZoom, setStageZoom] = useState(1);
//   const stageVideoWrapRef = useRef(null);
//   const zoomIn = useCallback(() => setStageZoom((z) => Math.min(2.5, +(z + 0.25).toFixed(2))), []);
//   const zoomOut = useCallback(() => setStageZoom((z) => Math.max(1, +(z - 0.25).toFixed(2))), []);
//   const resetZoom = useCallback(() => setStageZoom(1), []);
//   // Reset zoom automatically whenever the focused share changes, so a
//   // zoomed-in view doesn't carry over to a different student's screen.
//   useEffect(() => {
//     setStageZoom(1);
//   }, [mainTile?.id]);

//   const expandStageTile = useCallback(() => {
//     const el = stageVideoWrapRef.current;
//     if (!el) return;
//     if (!document.fullscreenElement) {
//       el.requestFullscreen?.().catch(() => {});
//     } else {
//       document.exitFullscreen?.().catch(() => {});
//     }
//   }, []);

//   const popOutStageTile = useCallback((tile) => {
//     if (!tile?.track) return;
//     try {
//       const stream = new MediaStream([tile.track.mediaStreamTrack]);
//       const w = window.open("", "_blank", "width=960,height=600");
//       if (!w) return;
//       w.document.title = tile.name || "Shared screen";
//       w.document.body.style.cssText = "margin:0;background:#000;overflow:hidden;";
//       const video = w.document.createElement("video");
//       video.autoplay = true;
//       video.playsInline = true;
//       video.muted = true;
//       video.style.cssText = "width:100vw;height:100vh;object-fit:contain;background:#000;display:block;";
//       video.srcObject = stream;
//       w.document.body.appendChild(video);
//     } catch (e) {
//       console.warn("pop-out window failed:", e);
//     }
//   }, []);

//   const scrollFilmstrip = useCallback((dir) => {
//     const el = filmstripRef.current;
//     if (!el) return;
//     el.scrollBy({ left: dir * 240, behavior: "smooth" });
//   }, []);

//   const sidebarLayoutStyle = (() => {
//     switch (deviceCfg.sidebarMode) {
//       case "overlayFull":
//         return {
//           position: "absolute",
//           top: 0,
//           bottom: 0,
//           right: 0,
//           zIndex: 40,
//           width: sidebarOpen ? "100%" : 0,
//         };
//       case "overlayWide":
//         return {
//           position: "absolute",
//           top: 0,
//           bottom: 0,
//           right: 0,
//           zIndex: 40,
//           width: sidebarOpen ? 340 : 0,
//           maxWidth: "90%",
//         };
//       case "panelNarrow":
//       case "panelFull":
//       default:
//         return {
//           width: sidebarOpen ? sidebarWidth : 0,
//           transition: sidebarResizing ? "none" : "width .25s ease",
//         };
//     }
//   })();

//   return (
//     <div style={S.root} className="ilm-root" ref={rootRef}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
//         *{box-sizing:border-box}
//         ::-webkit-scrollbar{width:8px;height:8px}
//         ::-webkit-scrollbar-track{background:transparent}
//         ::-webkit-scrollbar-thumb{background:rgba(255,255,255,.14);border-radius:8px}
//         ::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,.24)}
//         @keyframes livePulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.35;transform:scale(1.6)}}
//         @keyframes recBlink{0%,100%{opacity:1}50%{opacity:.25}}
//         @keyframes spin{to{transform:rotate(360deg)}}
//         @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
//         @keyframes slideIn{from{opacity:0;transform:translateY(-16px)}to{opacity:1;transform:translateY(0)}}
//         @keyframes panelIn{from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:translateX(0)}}
//         @keyframes chatFade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
//         @keyframes menuIn{from{opacity:0;transform:translateY(-6px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}
//         @keyframes floatUp{0%{opacity:0;transform:translateY(0) scale(.6)}15%{opacity:1;transform:translateY(-10px) scale(1)}100%{opacity:0;transform:translateY(-120px) scale(1.05)}}
//         @keyframes presentIn{from{opacity:0;transform:scale(.97)}to{opacity:1;transform:scale(1)}}
//         .ilm-present-in{animation:presentIn .22s ease}
//         /* ── BUG FIX 2: Fullscreen Screen-Share Controls Missing ──
//            Previously opacity started at 0 and relied entirely on
//            ".ilm-card:hover" to reveal the zoom/pop-out/fullscreen
//            cluster. In native browser Fullscreen (F11-style, both via
//            the header's Maximize button and via expandStageTile) the
//            cursor doesn't always register a fresh :hover the instant
//            fullscreen is entered, so the controls could appear to
//            "vanish" entirely with no way to bring them back except
//            jiggling the mouse exactly over the tile. They now default
//            to a dim-but-visible state (so they're never fully gone),
//            brighten to full opacity on hover/focus in every mode, and
//            an explicit ".ilm-force-visible" class (applied whenever
//            isFullscreen is true — see show_widget usage below) pins
//            them to full opacity for the whole time fullscreen is on. */
//         .ilm-present-controls{opacity:.72;transition:opacity .15s ease;pointer-events:auto}
//         .ilm-card:hover .ilm-present-controls,.ilm-present-controls:hover,.ilm-present-controls:focus-within{opacity:1}
//         .ilm-present-controls.ilm-force-visible{opacity:1 !important}
//         .ilm-hoverscale{transition:transform .15s ease,background .15s ease,border-color .15s ease}
//         .ilm-hoverscale:hover{transform:scale(1.03)}
//         .ilm-card{transition:all .2s ease}
//         .ilm-filmtile{transition:transform .15s ease,border-color .15s ease}
//         .ilm-filmtile:hover{transform:translateY(-2px) scale(1.02);border-color:rgba(255,255,255,.22)}
//         .ilm-tcbtn{transition:transform .14s ease, filter .14s ease}
//         .ilm-tcbtn:hover{transform:translateY(-2px);filter:brightness(1.12)}
//         .ilm-prow:hover{background:rgba(255,255,255,.055) !important}
//         .ilm-root button{font-family:'Inter',sans-serif}
//       `}</style>

//       {autoEndWarning && (
//         <div style={S.autoEndToast}>
//           <span style={{ fontSize: 16 }}>⏱️</span>
//           <div>
//             <div style={{ fontWeight: 700, fontSize: 13 }}>Session Ended</div>
//             <div style={{ fontSize: 11, opacity: 0.85 }}>{autoEndMessage}</div>
//           </div>
//         </div>
//       )}

//       {/* ══════════════ TOP HEADER ══════════════ */}
//       <div style={{ ...S.topBar, ...(isCompactDevice ? S.topBarCompact : null) }}>
//         <div style={S.topLeft}>
//           <div style={S.liveBadge}>
//             <span style={S.liveDot} />
//             LIVE
//           </div>
//           <div style={S.timerPill}>{timer}</div>
//           <button
//             className="ilm-hoverscale"
//             style={{
//               ...S.recPill,
//               opacity: recToggling ? 0.6 : 1,
//               cursor: recToggling ? "not-allowed" : "pointer",
//               color: recording ? "#f87171" : "#8b90a0",
//             }}
//             onClick={toggleRecording}
//             disabled={recToggling}
//             title={recording ? "Stop recording" : "Start recording"}
//           >
//             <Circle size={8} fill="currentColor" style={recording ? { animation: "recBlink 1.4s infinite" } : null} />
//             {!isCompactDevice && (recToggling ? "…" : recording ? "REC" : "Record")}
//           </button>
//           {!deviceCfg.hideHeaderExtras && (
//             <div style={S.pillDark}>
//               <Users size={13} strokeWidth={2.25} />
//               Participants
//               <span style={S.pillDivider} />
//               <Video size={13} strokeWidth={2.25} />
//               {totalLiveParticipants}
//             </div>
//           )}
//           {!deviceCfg.hideClassName && (
//             <span style={S.classLabel}>
//               Class: <span style={S.classLink}>{sessionTitle}</span>
//             </span>
//           )}
//         </div>

//         <div style={S.topRight}>
//           {!deviceCfg.hideHeaderExtras && (
//             <div style={S.signalPill} title="Connection stable">
//               <Wifi size={13} strokeWidth={2.25} />
//               98%
//             </div>
//           )}
//           {!isCompactDevice && (
//             <div style={{ position: "relative" }}>
//               <button
//                 ref={viewMenuBtnRef}
//                 className="ilm-hoverscale"
//                 style={S.iconTextBtn}
//                 onClick={() => setViewMenuOpen((v) => !v)}
//               >
//                 <LayoutGrid size={14} strokeWidth={2.25} />
//                 View
//                 <ChevronDown size={12} />
//               </button>
//               {viewMenuOpen && (
//                 <div ref={viewMenuPanelRef} style={S.smallMenu}>
//                   <button
//                     style={S.smallMenuItem}
//                     onClick={() => {
//                       setSpotlightOn(true);
//                       setViewMenuOpen(false);
//                     }}
//                   >
//                     <Pin size={13} /> Spotlight view
//                   </button>
//                   <button
//                     style={S.smallMenuItem}
//                     onClick={() => {
//                       setSpotlightOn(false);
//                       setViewMenuOpen(false);
//                     }}
//                   >
//                     <LayoutGrid size={13} /> Tile view
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}
//           {!isCompactDevice && (
//             <button
//               className="ilm-hoverscale"
//               style={S.iconBtn}
//               onClick={toggleFullscreen}
//               title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
//             >
//               {isFullscreen ? (
//                 <Minimize2 size={15} strokeWidth={2.25} />
//               ) : (
//                 <Maximize2 size={15} strokeWidth={2.25} />
//               )}
//             </button>
//           )}
//           {!isCompactDevice && (
//             <button
//               className="ilm-hoverscale"
//               style={S.iconBtn}
//               onClick={() => {
//                 setSettingsQuickOpen((v) => !v);
//                 notifyComingSoon("Settings");
//               }}
//               title="Settings"
//             >
//               <Settings size={15} strokeWidth={2.25} />
//             </button>
//           )}
//           <div style={{ position: "relative" }}>
//             <button
//               ref={moreMenuBtnRef}
//               className="ilm-hoverscale"
//               style={S.iconBtn}
//               onClick={() => setMoreMenuOpen((v) => !v)}
//               title="More"
//             >
//               <MoreVertical size={15} strokeWidth={2.25} />
//             </button>
//             {moreMenuOpen && (
//               <div ref={moreMenuPanelRef} style={{ ...S.smallMenu, right: 0, left: "auto" }}>
//                 <button
//                   style={S.smallMenuItem}
//                   onClick={() => {
//                     pipWindow ? returnToMeeting() : openPiP();
//                     setMoreMenuOpen(false);
//                   }}
//                 >
//                   <PictureInPicture2 size={13} /> {pipWindow ? "Return from pop-out" : "Pop out (PiP)"}
//                 </button>
//                 <button
//                   style={S.smallMenuItem}
//                   onClick={() => {
//                     enableAllAudio();
//                     setMoreMenuOpen(false);
//                   }}
//                 >
//                   <Wifi size={13} /> Re-enable audio
//                 </button>
//               </div>
//             )}
//           </div>
//           <button className="ilm-hoverscale" style={S.endBtn} onClick={handleEndSession}>
//             <PhoneOff size={14} strokeWidth={2.25} />
//             {!isCompactDevice && "End Class"}
//           </button>
//         </div>
//       </div>

//       {recError && (
//         <div style={S.recErrorBar}>⚠️ {recError}</div>
//       )}

//       {/* ══════════════ BODY ══════════════ */}
//       <div style={S.body}>
//         <div style={S.videoArea}>
//           {connected ? (
//             <>
//               {useGridView ? (
//                 // Google Meet–style "Tile view": every participant gets an
//                 // equal tile in a responsive grid, so the trainer can always
//                 // see the whole class at once instead of a capped filmstrip.
//                 <div style={{ ...S.gridWrap, ...(isCompactDevice ? S.gridWrapCompact : null) }}>
//                   <div
//                     style={{
//                       ...S.videoGrid,
//                       gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
//                     }}
//                   >
//                     {camTiles.map((t) => (
//                       <div key={t.id} className="ilm-card" style={S.gridTile}>
//                         <VideoTile
//                           tile={t}
//                           device={device}
//                           handRaised={!!raisedHands[t.identity]}
//                           tileFloaters={floaters.filter((f) => f.identity === t.identity)}
//                         />
//                         {t.isLocal && (
//                           <div style={S.gridHostChip}>
//                             You (Trainer) <span style={S.hostChipBadge}>Host</span>
//                           </div>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                   <button
//                     className="ilm-hoverscale"
//                     style={{ ...S.spotlightBtn, top: 14, right: 14 }}
//                     onClick={() => setSpotlightOn(true)}
//                   >
//                     <Pin size={12} strokeWidth={2.4} />
//                     Switch to Spotlight
//                   </button>
//                 </div>
//               ) : (
//                 <div style={{ ...S.stageWrap, ...(isCompactDevice ? S.stageWrapCompact : null) }}>
//                   {mainTile?.isScreen ? (
//                     /* ── Part 1/2: Google Meet-style presentation layout.
//                        Large rounded hero stage for the shared screen +
//                        a narrow right-side column of camera tiles,
//                        instead of the old flat box with everyone crammed
//                        into a bottom strip. spotlightOn now genuinely
//                        changes the column width (Part 2 "Spotlight Mode")
//                        instead of just toggling a label. */
//                     <div
//                       style={{
//                         ...S.presentRow,
//                         ...(isCompactDevice ? S.presentRowCompact : null),
//                       }}
//                     >
//                       <div
//                         style={S.presentStage}
//                         className="ilm-card ilm-present-in"
//                         key={mainTile.id /* re-trigger the fade/scale-in on presenter switch */}
//                         ref={stageVideoWrapRef}
//                       >
//                         <VideoTile
//                           tile={mainTile}
//                           device={device}
//                           large
//                           zoom={stageZoom}
//                           handRaised={!!raisedHands[mainTile?.identity]}
//                           tileFloaters={floaters.filter((f) => f.identity === mainTile?.identity)}
//                         />

//                         {/* Subtle top-left presenting label, Meet-style
//                             (not the old bold centered chip). */}
//                         <div style={S.presentingLabel}>
//                           <ScreenShare size={11} strokeWidth={2.4} />
//                           {mainTile.isLocal ? "You are presenting" : mainTile.name}
//                         </div>

//                         <button
//                           className="ilm-hoverscale"
//                           style={{ ...S.spotlightBtn, ...(spotlightOn ? S.spotlightBtnOn : null) }}
//                           onClick={() => setSpotlightOn((v) => !v)}
//                           title={spotlightOn ? "Show a balanced layout" : "Enlarge the shared screen"}
//                         >
//                           <Pin size={12} strokeWidth={2.4} />
//                           Spotlight {spotlightOn ? "On" : "Off"}
//                         </button>

//                         {/* Floating controls over the shared screen —
//                             zoom in/out/reset, open in a new window,
//                             fullscreen scoped to just this stage.
//                             BUG FIX 2: always rendered with a visible
//                             base opacity (see .ilm-present-controls CSS
//                             above) and forced to full opacity via
//                             "ilm-force-visible" for as long as the
//                             trainer is in fullscreen, instead of relying
//                             purely on hover — which is what made these
//                             appear to disappear in fullscreen mode. */}
//                         <div
//                           style={S.presentControls}
//                           className={`ilm-present-controls${isFullscreen ? " ilm-force-visible" : ""}`}
//                         >
//                           <button
//                             className="ilm-hoverscale"
//                             style={S.presentCtrlBtn}
//                             onClick={zoomOut}
//                             disabled={stageZoom <= 1}
//                             title="Zoom out"
//                           >
//                             <ZoomOut size={15} strokeWidth={2.2} />
//                           </button>
//                           <button
//                             className="ilm-hoverscale"
//                             style={S.presentCtrlZoomLabel}
//                             onClick={resetZoom}
//                             title="Reset zoom"
//                           >
//                             {Math.round(stageZoom * 100)}%
//                           </button>
//                           <button
//                             className="ilm-hoverscale"
//                             style={S.presentCtrlBtn}
//                             onClick={zoomIn}
//                             disabled={stageZoom >= 2.5}
//                             title="Zoom in"
//                           >
//                             <ZoomIn size={15} strokeWidth={2.2} />
//                           </button>
//                           <span style={S.presentCtrlDivider} />
//                           <button
//                             className="ilm-hoverscale"
//                             style={S.presentCtrlBtn}
//                             onClick={() => popOutStageTile(mainTile)}
//                             title="Open in new window"
//                           >
//                             <ExternalLink size={15} strokeWidth={2.2} />
//                           </button>
//                           <button
//                             className="ilm-hoverscale"
//                             style={S.presentCtrlBtn}
//                             onClick={expandStageTile}
//                             title="Full screen"
//                           >
//                             <Maximize size={15} strokeWidth={2.2} />
//                           </button>
//                         </div>
//                       </div>

//                       {/* Right-side participant column — Meet docks
//                           camera tiles beside the shared content, not
//                           under it. Reuses the same
//                           visibleFilmstripTiles/filmstripOverflowCount
//                           (raised-hand prioritized, same cap) the
//                           bottom filmstrip uses in the non-share case
//                           below — no new tile-selection logic. Spotlight
//                           On shrinks this column to a slim edge strip,
//                           matching Meet's "focus on the presentation"
//                           behavior; Spotlight Off keeps it at a normal,
//                           readable width. */}
//                       {filmstripTiles.length > 0 && (
//                         <div
//                           style={{
//                             ...S.presentSidebar,
//                             width: spotlightOn ? 96 : isCompactDevice ? 84 : 208,
//                           }}
//                           className="ilm-scroll-y"
//                         >
//                           {visibleFilmstripTiles.map((t) => (
//                             <div
//                               key={t.id}
//                               className="ilm-filmtile"
//                               style={S.presentSidebarTile}
//                               onClick={() => t.identity && setFocusedScreenIdentity(t.identity)}
//                             >
//                               <VideoTile
//                                 tile={t}
//                                 device={device}
//                                 small
//                                 hideNameTag={spotlightOn}
//                                 handRaised={!!raisedHands[t.identity]}
//                                 tileFloaters={floaters.filter((f) => f.identity === t.identity)}
//                               />
//                             </div>
//                           ))}
//                           {filmstripOverflowCount > 0 && (
//                             <div
//                               className="ilm-filmtile"
//                               style={{ ...S.presentSidebarTile, ...S.filmstripOverflowTile }}
//                               title={`${filmstripOverflowCount} more participant${filmstripOverflowCount === 1 ? "" : "s"}`}
//                             >
//                               +{filmstripOverflowCount}
//                             </div>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   ) : (
//                     <>
//                       {/* BUG FIX 1: Trainer Self Video UI Flat.
//                           `mainStageOuter` centers the stage in the
//                           available space (flex + align/justify center)
//                           instead of letting the tile stretch edge to
//                           edge. `S.mainStage` now uses aspect-ratio
//                           16/9 with max-width/max-height:100%, so the
//                           browser computes a properly proportioned,
//                           letterbox-free floating card (video is
//                           object-fit: cover, so it fills that card with
//                           no black bars) — this is the same sizing
//                           approach Google Meet uses for its own-camera
//                           hero tile, matching the Image 2 reference. */}
//                       <div style={S.mainStageOuter}>
//                         <div style={S.mainStage} className="ilm-card">
//                           <VideoTile
//                             tile={mainTile}
//                             device={device}
//                             large
//                             handRaised={!!raisedHands[mainTile?.identity]}
//                             tileFloaters={floaters.filter((f) => f.identity === mainTile?.identity)}
//                           />
//                           {mainTile?.isLocal && (
//                             <div style={S.hostChip}>
//                               You (Trainer) <span style={S.hostChipBadge}>Host</span>
//                             </div>
//                           )}
//                           <button
//                             className="ilm-hoverscale"
//                             style={{ ...S.spotlightBtn, ...(spotlightOn ? S.spotlightBtnOn : null) }}
//                             onClick={() => setSpotlightOn((v) => !v)}
//                           >
//                             <Pin size={12} strokeWidth={2.4} />
//                             Spotlight {spotlightOn ? "On" : "Off"}
//                           </button>
//                         </div>
//                       </div>

//                       {(filmstripTiles.length > 0) && (
//                         <div style={S.filmstripRow}>
//                           <button className="ilm-hoverscale" style={S.filmArrow} onClick={() => scrollFilmstrip(-1)}>
//                             <ChevronLeft size={14} />
//                           </button>
//                           <div
//                             ref={filmstripRef}
//                             style={{ ...S.filmstrip, ...(isCompactDevice ? S.filmstripCompact : null) }}
//                           >
//                             {visibleFilmstripTiles.map((t) => (
//                               <div
//                                 key={t.id}
//                                 className="ilm-filmtile"
//                                 style={{
//                                   ...S.filmstripTile,
//                                   width: deviceCfg.filmstripTile.width,
//                                   height: deviceCfg.filmstripTile.height,
//                                 }}
//                               >
//                                 <VideoTile
//                                   tile={t}
//                                   device={device}
//                                   small
//                                   handRaised={!!raisedHands[t.identity]}
//                                   tileFloaters={floaters.filter((f) => f.identity === t.identity)}
//                                 />
//                               </div>
//                             ))}
//                             {filmstripOverflowCount > 0 && (
//                               <div
//                                 className="ilm-filmtile"
//                                 style={{
//                                   ...S.filmstripTile,
//                                   ...S.filmstripOverflowTile,
//                                   width: deviceCfg.filmstripTile.width,
//                                   height: deviceCfg.filmstripTile.height,
//                                 }}
//                                 title={`${filmstripOverflowCount} more participant${filmstripOverflowCount === 1 ? "" : "s"}`}
//                                 onClick={() => setSpotlightOn(false)}
//                               >
//                                 +{filmstripOverflowCount}
//                               </div>
//                             )}
//                           </div>
//                           <button className="ilm-hoverscale" style={S.filmArrow} onClick={() => scrollFilmstrip(1)}>
//                             <ChevronRight size={14} />
//                           </button>
//                         </div>
//                       )}
//                     </>
//                   )}
//                 </div>
//               )}

//               <div style={S.audioLayer} aria-hidden="true">
//                 {remoteAudioTracks.map((a) => (
//                   <RemoteAudio key={a.id} track={a.track} onBlocked={() => setAudioBlocked(true)} />
//                 ))}
//               </div>

//               {audioBlocked && (
//                 <button className="ilm-hoverscale" style={S.enableAudioBtn} onClick={enableAllAudio}>
//                   🔊 Click to enable audio
//                 </button>
//               )}

//               {/* ── Floating Live Chat card (overlaid on the stage) ── */}
//               {chatOpen && (
//                 <div style={{ ...S.floatingChat, ...(isCompactDevice ? S.floatingChatCompact : null) }}>
//                   <div style={S.chatHead}>
//                     <span style={S.chatHeadTitle}>Live Chat</span>
//                     <span style={S.chatOnline}>{totalLiveParticipants} online</span>
//                     <button style={S.chatCloseBtn} onClick={() => setChatOpen(false)}>
//                       <X size={14} strokeWidth={2.25} />
//                     </button>
//                   </div>
//                   <div style={S.msgList}>
//                     {messages.map((m) => (
//                       <div key={m.id} style={m.system ? S.sysRow : { ...S.msgBlock, ...(m.self ? { alignItems: "flex-end" } : null) }}>
//                         {m.system ? (
//                           <div style={S.sysBubble}>{m.text}</div>
//                         ) : (
//                           <>
//                             <span style={S.msgUser}>
//                               {m.user} <span style={S.msgTime}>{m.time}</span>
//                             </span>
//                             <div style={{ ...S.msgBubble, ...(m.self ? S.bubbleSelf : S.bubbleOther) }}>
//                               {m.text}
//                             </div>
//                           </>
//                         )}
//                       </div>
//                     ))}
//                     <div ref={chatEndRef} />
//                   </div>
//                   <div style={S.inputRow}>
//                     <input
//                       style={S.chatInput}
//                       value={input}
//                       onChange={(e) => setInput(e.target.value)}
//                       onKeyDown={(e) => {
//                         if (e.key === "Enter" && !e.shiftKey) {
//                           e.preventDefault();
//                           sendMessage();
//                         }
//                       }}
//                       placeholder="Type a message…"
//                     />
//                     <button className="ilm-hoverscale" style={S.sendBtn} onClick={sendMessage}>
//                       <Send size={15} strokeWidth={2.25} />
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </>
//           ) : (
//             <div style={S.loadingBox}>
//               <div style={S.spinner} />
//               <p style={S.loadingText}>Starting live session…</p>
//             </div>
//           )}
//         </div>

//         {sidebarOpen && (deviceCfg.sidebarMode === "panelNarrow" || deviceCfg.sidebarMode === "panelFull") && (
//           // FIX: this handle used to be a 6px-wide hit area around a bare
//           // 1px line with no visible affordance until you were already
//           // hovering it — easy to miss and hard to grab (see the reported
//           // "can't find the resize handle" screenshot). It now always shows
//           // a small rounded grip pill, like the drag handles in Meet/Zoom/
//           // Teams side-panel dividers, so it's discoverable at a glance
//           // instead of only appearing once the mouse happens to land on it.
//           <div
//             onMouseDown={handleSidebarResizeStart}
//             onMouseEnter={() => setSidebarResizeHover(true)}
//             onMouseLeave={() => setSidebarResizeHover(false)}
//             title="Drag to resize"
//             style={{
//               flexShrink: 0,
//               width: 10,
//               marginLeft: -5,
//               marginRight: -5,
//               cursor: "col-resize",
//               zIndex: 6,
//               background: "transparent",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             <div
//               style={{
//                 width: sidebarResizing || sidebarResizeHover ? 4 : 3,
//                 height: 56,
//                 borderRadius: 999,
//                 background: sidebarResizing
//                   ? "#3b82f6"
//                   : sidebarResizeHover
//                     ? "rgba(255,255,255,.55)"
//                     : "rgba(255,255,255,.18)",
//                 boxShadow: sidebarResizing ? "0 0 0 4px rgba(59,130,246,.18)" : "none",
//                 transition: "background .15s, width .15s, box-shadow .15s",
//               }}
//             />
//           </div>
//         )}


//         {/* ══════════════ RIGHT SIDEBAR: Trainer Controls + Participants ══════════════ */}
//         <div style={{ ...S.sidebar, ...sidebarLayoutStyle }}>
//           {sidebarOpen && (
//             <div style={{ ...S.sidebarInner, animation: "panelIn .2s ease" }}>
//               <div style={S.panelBlock}>
//                 <div style={S.panelHead}>
//                   <span style={S.panelTitle}>Trainer Controls</span>
//                   <button style={S.sidebarCloseBtn} onClick={() => setSidebarOpen(false)}>
//                     <X size={14} strokeWidth={2.25} />
//                   </button>
//                 </div>
//                 <div style={S.tcGrid}>
//                   <TCBtn
//                     icon={<MicOff size={16} />}
//                     label="Mute All"
//                     tone="red"
//                     onClick={() => {
//                       setTrainerFlags((p) => ({ ...p, allMuted: true }));
//                       pushSystem("All participants muted.");
//                       broadcastTrainerCommand("allMuted", true);
//                     }}
//                   />
//                   <TCBtn
//                     icon={<Mic size={16} />}
//                     label="Unmute All"
//                     tone="green"
//                     onClick={() => {
//                       setTrainerFlags((p) => ({ ...p, allMuted: false }));
//                       pushSystem("Requested all participants to unmute.");
//                       broadcastTrainerCommand("allMuted", false);
//                       broadcastTrainerCommand("requestUnmuteAll", true);
//                     }}
//                   />
//                   {/* FIX (Camera Enable/Disable not working): kept as two
//                       separate buttons per requirement. Each explicitly
//                       sets/broadcasts its own target state instead of
//                       flipping a shared flag, and both now broadcast the
//                       SAME command ("camerasDisabled") so the student-side
//                       listener (LiveMeetingContext.jsx) — which previously
//                       didn't exist at all — can reliably lock/unlock the
//                       camera track in both directions. */}
//                   <TCBtn
//                     icon={<VideoOff size={16} />}
//                     label="Disable Cameras"
//                     tone="red"
//                     onClick={() => {
//                       setTrainerFlags((p) => ({ ...p, camerasDisabled: true }));
//                       pushSystem("All cameras disabled.");
//                       broadcastTrainerCommand("camerasDisabled", true);
//                     }}
//                   />
//                   <TCBtn
//                     icon={<Video size={16} />}
//                     label="Enable Cameras"
//                     tone="green"
//                     onClick={() => {
//                       setTrainerFlags((p) => ({ ...p, camerasDisabled: false }));
//                       pushSystem("Requested all participants to enable cameras.");
//                       broadcastTrainerCommand("camerasDisabled", false);
//                     }}
//                   />
//                   <TCBtn
//                     icon={<Hand size={16} />}
//                     label="Lower All Hands"
//                     tone="amber"
//                     onClick={() => {
//                       toggleTrainerFlag("handsLowered", "All raised hands lowered.", "");
//                       // Clear the real per-participant hand-raise state the
//                       // trainer tracks locally, so every hand badge (tile +
//                       // Participants list) disappears immediately. The
//                       // broadcastTrainerCommand call inside
//                       // toggleTrainerFlag above already notifies students;
//                       // this just makes the trainer's own view authoritative
//                       // right away instead of waiting on echoes back.
//                       setRaisedHands({});
//                     }}
//                   />
//                   <TCBtn
//                     icon={<MessageSquareOff size={16} />}
//                     label="Disable Chat"
//                     tone="red"
//                     onClick={() => {
//                       setTrainerFlags((p) => ({ ...p, chatDisabled: true }));
//                       pushSystem("Chat disabled for participants.");
//                       broadcastTrainerCommand("chatDisabled", true);
//                     }}
//                   />
//                   <TCBtn
//                     icon={<MessageSquare size={16} />}
//                     label="Enable Chat"
//                     tone="green"
//                     onClick={() => {
//                       setTrainerFlags((p) => ({ ...p, chatDisabled: false }));
//                       pushSystem("Chat enabled for participants.");
//                       broadcastTrainerCommand("chatDisabled", false);
//                     }}
//                   />
//                   <TCBtn
//                     icon={trainerFlags.locked ? <Lock size={16} /> : <Unlock size={16} />}
//                     label="Lock Meeting"
//                     tone="purple"
//                     onClick={() => toggleTrainerFlag("locked", "Meeting locked — no new participants can join.", "Meeting unlocked.")}
//                   />
//                   <TCBtn
//                     icon={<ClipboardCheck size={16} />}
//                     label="Attendance"
//                     tone="blue"
//                     onClick={() => setAttendanceOpen(true)}
//                   />
//                   <TCBtn
//                     icon={<Radio size={16} />}
//                     label="Allow Mic Requests"
//                     tone="green"
//                     onClick={() => toggleTrainerFlag("micRequestsAllowed", "Mic requests are now allowed.", "Mic requests are now blocked.")}
//                   />
//                   {/* FIX (Unblock Screen Share missing/not working): kept
//                       as two separate buttons per requirement. Each
//                       explicitly sets/broadcasts screenShareBlocked to its
//                       own target value rather than toggling the shared
//                       flag, so clicking either button always lands on the
//                       intended state regardless of click order. The
//                       student-side listener for "screenShareBlocked" in
//                       LiveMeetingContext.jsx already correctly handles both
//                       true and false — no student-side change needed. */}
//                   <TCBtn
//                     icon={<ScreenShareOff size={16} />}
//                     label="Block Screen Share"
//                     tone="red"
//                     onClick={() => {
//                       setTrainerFlags((p) => ({ ...p, screenShareBlocked: true }));
//                       pushSystem("Screen sharing blocked for participants.");
//                       broadcastTrainerCommand("screenShareBlocked", true);
//                     }}
//                   />
//                   <TCBtn
//                     icon={<ScreenShare size={16} />}
//                     label="Unblock Screen Share"
//                     tone="green"
//                     onClick={() => {
//                       setTrainerFlags((p) => ({ ...p, screenShareBlocked: false }));
//                       pushSystem("Screen sharing allowed for participants.");
//                       broadcastTrainerCommand("screenShareBlocked", false);
//                     }}
//                   />
//                 </div>
//               </div>

//               {/* ── Part 2: Student Screen Share panel — lists every
//                   active share (trainer's own + any student's) so the
//                   trainer can see who's presenting and switch the main
//                   stage focus between simultaneous shares, or stop a
//                   specific student's share outright. Only rendered once
//                   there's something to show. */}
//               {screenTiles.length > 0 && (
//                 <div style={{ ...S.panelBlock, borderColor: "rgba(59,130,246,.3)" }}>
//                   <div style={S.panelHead}>
//                     <span style={S.panelTitle}>Screen Sharing ({screenTiles.length})</span>
//                   </div>
//                   <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: 12 }}>
//                     {screenTiles.map((t) => {
//                       const isFocused = t.id === mainTile?.id;
//                       return (
//                         <div
//                           key={t.id}
//                           style={{
//                             display: "flex",
//                             alignItems: "center",
//                             gap: 8,
//                             padding: "8px 10px",
//                             borderRadius: 10,
//                             background: isFocused ? "rgba(59,130,246,.12)" : "rgba(255,255,255,.03)",
//                             border: isFocused ? "1px solid rgba(96,165,250,.35)" : "1px solid rgba(255,255,255,.06)",
//                           }}
//                         >
//                           <ScreenShare size={15} color={isFocused ? "#93c5fd" : "#9ca3af"} />
//                           <div style={{ flex: 1, minWidth: 0 }}>
//                             <div style={{ ...S.pName, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
//                               {t.isLocal ? "You" : t.name.replace(" is presenting", "")}
//                             </div>
//                             <div style={S.pJoinedText}>{isFocused ? "On stage now" : "Tap to focus"}</div>
//                           </div>
//                           {!isFocused && (
//                             <button
//                               className="ilm-hoverscale"
//                               onClick={() => setFocusedScreenIdentity(t.identity)}
//                               title="Show on main stage"
//                               style={{
//                                 display: "flex", alignItems: "center", justifyContent: "center",
//                                 width: 30, height: 30, borderRadius: 8, cursor: "pointer",
//                                 border: "1px solid rgba(96,165,250,.35)", background: "rgba(59,130,246,.12)", color: "#93c5fd",
//                               }}
//                             >
//                               <Pin size={14} />
//                             </button>
//                           )}
//                           {!t.isLocal && (
//                             <button
//                               className="ilm-hoverscale"
//                               onClick={() => stopStudentScreenShare(t.identity, t.name.replace(" is presenting", ""))}
//                               title="Stop this share"
//                               style={{
//                                 display: "flex", alignItems: "center", justifyContent: "center",
//                                 width: 30, height: 30, borderRadius: 8, cursor: "pointer",
//                                 border: "1px solid rgba(239,68,68,.4)", background: "rgba(239,68,68,.14)", color: "#f87171",
//                               }}
//                             >
//                               <MonitorX size={14} />
//                             </button>
//                           )}
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>
//               )}

//               {pendingRequests.length > 0 && (
//                 <div style={{ ...S.panelBlock, borderColor: "rgba(245,158,11,.35)" }}>
//                   <div style={S.panelHead}>
//                     <span style={S.panelTitle}>Join Requests ({pendingRequests.length})</span>
//                   </div>
//                   <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: 12 }}>
//                     {pendingRequests.map((r) => (
//                       <div
//                         key={r.identity}
//                         style={{
//                           display: "flex",
//                           alignItems: "center",
//                           gap: 8,
//                           padding: "8px 10px",
//                           borderRadius: 10,
//                           background: "rgba(245,158,11,.08)",
//                           border: "1px solid rgba(245,158,11,.25)",
//                         }}
//                       >
//                         <div style={{ ...S.pAv, background: "linear-gradient(135deg,#f59e0b,#f97316)" }}>
//                           {(r.name?.[0] || "?").toUpperCase()}
//                         </div>
//                         <div style={{ flex: 1, minWidth: 0 }}>
//                           <div style={{ ...S.pName, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
//                             {r.name}
//                           </div>
//                           <div style={S.pJoinedText}>Wants to join · {r.time}</div>
//                         </div>
//                         <button
//                           onClick={() => approveJoinRequest(r.identity)}
//                           title="Allow"
//                           style={{
//                             display: "flex", alignItems: "center", justifyContent: "center",
//                             width: 30, height: 30, borderRadius: 8, cursor: "pointer",
//                             border: "1px solid rgba(34,197,94,.4)", background: "rgba(34,197,94,.14)", color: "#4ade80",
//                           }}
//                         >
//                           <UserCheck size={15} />
//                         </button>
//                         <button
//                           onClick={() => denyJoinRequest(r.identity)}
//                           title="Deny"
//                           style={{
//                             display: "flex", alignItems: "center", justifyContent: "center",
//                             width: 30, height: 30, borderRadius: 8, cursor: "pointer",
//                             border: "1px solid rgba(239,68,68,.4)", background: "rgba(239,68,68,.14)", color: "#f87171",
//                           }}
//                         >
//                           <UserX size={15} />
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               <div style={{ ...S.panelBlock, flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
//                 <div style={S.panelHead}>
//                   <span style={S.panelTitle}>Participants ({totalLiveParticipants})</span>
//                 </div>
//                 <div style={S.searchRow}>
//                   <Search size={14} color="#6B7280" />
//                   <input
//                     style={S.searchInput}
//                     placeholder="Search participants"
//                     value={participantSearch}
//                     onChange={(e) => setParticipantSearch(e.target.value)}
//                   />
//                 </div>
//                 <div style={S.peopleList}>
//                   <div style={S.pRow} className="ilm-prow">
//                     <div style={{ ...S.pAv, background: "linear-gradient(135deg,#2563EB,#60a5fa)" }}>T</div>
//                     <span style={S.pName}>You (Trainer)</span>
//                     <span style={S.hostTag}>Host</span>
//                     {micOn ? <Mic size={13} color="#8b90a0" /> : <MicOff size={13} color="#f87171" />}
//                     {camOn ? <Video size={13} color="#8b90a0" /> : <VideoOff size={13} color="#f87171" />}
//                   </div>

//                   {/* BUG FIX 3: this list now comes from `sortedLiveParticipants`
//                       (built from the live LiveKit `camTiles`), not the
//                       slower/possibly-incomplete `dbParticipants` polling
//                       list — so a connected student appears here the
//                       instant they join, exactly like they already do in
//                       the video filmstrip. */}
//                   {sortedLiveParticipants.map((t) => {
//                     const dbMatch = findDbParticipantForLiveTile(t);
//                     const isHandRaised = !!raisedHands[t.identity];
//                     const isPresenting = screenTiles.some((st) => st.identity === t.identity);
//                     const displayLabel = dbMatch?.studentEmail || t.name || t.identity;
//                     return (
//                     <div key={t.id} style={{ ...S.pRow, position: "relative" }} className="ilm-prow">
//                       <div style={{ ...S.pAv, background: "linear-gradient(135deg,#8b5cf6,#ec4899)" }}>
//                         {(displayLabel?.[0] || "S").toUpperCase()}
//                       </div>
//                       <div style={{ flex: 1, minWidth: 0 }}>
//                         <div style={{ ...S.pName, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
//                           {displayLabel}
//                         </div>
//                         <div style={S.pJoinedText}>
//                           {dbMatch?.joinTime
//                             ? `Joined ${new Date(dbMatch.joinTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
//                             : "In session"}
//                         </div>
//                       </div>
//                       {isHandRaised && (
//                         <span style={S.pHandBadge} title="Hand raised">
//                           <Hand size={12} strokeWidth={2.5} />
//                         </span>
//                       )}
//                       {isPresenting && (
//                         <ScreenShare size={13} color="#93c5fd" title="Presenting" />
//                       )}
//                       {t.micMuted ? (
//                         <MicOff size={13} color="#f87171" />
//                       ) : (
//                         <Mic size={13} color="#8b90a0" />
//                       )}
//                       {t.videoMuted ? (
//                         <VideoOff size={13} color="#f87171" />
//                       ) : (
//                         <Video size={13} color="#8b90a0" />
//                       )}
//                       <button
//                         style={S.pMenuBtn}
//                         onClick={() => setOpenParticipantMenuId((cur) => (cur === t.id ? null : t.id))}
//                       >
//                         <MoreVertical size={14} />
//                       </button>

//                       {openParticipantMenuId === t.id && (
//                         <ParticipantMenu
//                           onClose={() => setOpenParticipantMenuId(null)}
//                           onAction={(label) => {
//                             pushSystem(`${label}: ${displayLabel}`);
//                             setOpenParticipantMenuId(null);
//                           }}
//                         />
//                       )}
//                     </div>
//                     );
//                   })}

//                   {sortedLiveParticipants.length === 0 && (
//                     <div style={S.emptyPeople}>
//                       <Users size={26} strokeWidth={1.75} style={{ opacity: 0.3 }} />
//                       <p style={S.emptyPeopleText}>
//                         {participantSearch ? "No matching participants" : "No students joined yet"}
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {attendanceOpen &&
//         createPortal(
//           <div
//             style={{
//               position: "fixed", inset: 0, zIndex: 2000,
//               background: "rgba(0,0,0,.55)",
//               display: "flex", alignItems: "center", justifyContent: "center",
//             }}
//             onClick={() => setAttendanceOpen(false)}
//           >
//             <div
//               onClick={(e) => e.stopPropagation()}
//               style={{
//                 width: 380, maxHeight: "70vh", overflowY: "auto",
//                 background: "#111318", border: "1px solid rgba(255,255,255,.08)",
//                 borderRadius: 16, padding: 0,
//               }}
//             >
//               <div style={S.panelHead}>
//                 <span style={S.panelTitle}>Attendance ({activeDbParticipants.length + 1})</span>
//                 <button style={S.sidebarCloseBtn} onClick={() => setAttendanceOpen(false)}>
//                   <X size={14} strokeWidth={2.25} />
//                 </button>
//               </div>
//               <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: 12 }}>
//                 <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px" }}>
//                   <div style={{ ...S.pAv, background: "linear-gradient(135deg,#2563EB,#60a5fa)" }}>T</div>
//                   <div style={{ flex: 1 }}>
//                     <div style={{ ...S.pName, fontWeight: 600 }}>You (Trainer)</div>
//                     <div style={S.pJoinedText}>Host · present since start</div>
//                   </div>
//                 </div>
//                 {activeDbParticipants.map((p) => (
//                   <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px" }}>
//                     <div style={{ ...S.pAv, background: "linear-gradient(135deg,#8b5cf6,#ec4899)" }}>
//                       {(p.studentEmail?.[0] || "S").toUpperCase()}
//                     </div>
//                     <div style={{ flex: 1, minWidth: 0 }}>
//                       <div style={{ ...S.pName, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
//                         {p.studentEmail}
//                       </div>
//                       <div style={S.pJoinedText}>
//                         Joined {p.joinTime ? new Date(p.joinTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//                 {activeDbParticipants.length === 0 && (
//                   <div style={S.emptyPeople}>
//                     <Users size={26} strokeWidth={1.75} style={{ opacity: 0.3 }} />
//                     <p style={S.emptyPeopleText}>No students joined yet</p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>,
//           document.body,
//         )}

//       {/* ══════════════ BOTTOM TOOLBAR ══════════════ */}
//       <div style={{ ...S.ctrlBar, ...(deviceCfg.ctrlCompact ? S.ctrlBarCompact : null) }}>
//         <div style={S.dockLeft}>
//           <CtrlBtn icon={micOn ? <Mic size={18} strokeWidth={2.1} /> : <MicOff size={18} strokeWidth={2.1} />} label="Mic" danger={!micOn} onClick={toggleMic} compact={deviceCfg.ctrlCompact} />
//           <CtrlBtn icon={camOn ? <Video size={18} strokeWidth={2.1} /> : <VideoOff size={18} strokeWidth={2.1} />} label="Camera" danger={!camOn} onClick={toggleCam} compact={deviceCfg.ctrlCompact} />
//           <CtrlBtn icon={<ScreenShare size={18} strokeWidth={2.1} />} label="Screen Share" active={screenOn} onClick={toggleScreen} compact={deviceCfg.ctrlCompact} />
//           <CtrlBtn
//             icon={<MessageSquare size={18} strokeWidth={2.1} />}
//             label="Chat"
//             badge={messages.filter((m) => !m.system).length || null}
//             active={chatOpen}
//             onClick={() => setChatOpen((v) => !v)}
//             compact={deviceCfg.ctrlCompact}
//           />
//           <CtrlBtn
//             icon={<Users size={18} strokeWidth={2.1} />}
//             label="Participants"
//             badge={totalLiveParticipants}
//             active={sidebarOpen}
//             onClick={() => setSidebarOpen((v) => !v)}
//             compact={deviceCfg.ctrlCompact}
//           />
//           <CtrlBtn
//             icon={<Crown size={18} strokeWidth={2.1} />}
//             label="Trainer"
//             active={sidebarOpen}
//             gold
//             onClick={() => setSidebarOpen((v) => !v)}
//             compact={deviceCfg.ctrlCompact}
//           />
//         </div>
//         <button className="ilm-hoverscale" style={S.leaveBtn} onClick={handleEndSession}>
//           <PhoneOff size={16} strokeWidth={2.25} />
//           {!isCompactDevice && "Leave"}
//         </button>
//       </div>

//       <video ref={pipVideoRef} muted playsInline style={{ position: "fixed", width: 1, height: 1, opacity: 0, pointerEvents: "none" }} />

//       {pipWindow &&
//         createPortal(
//           <PipPanel
//             tile={mainTile}
//             timer={timer}
//             micOn={micOn}
//             camOn={camOn}
//             onToggleMic={toggleMic}
//             onToggleCam={toggleCam}
//             onReturn={returnToMeeting}
//           />,
//           pipWindow.document.body,
//         )}
//     </div>
//   );
// };

// /* ─────────────────────────────────────────────────────────────
//    SUB-COMPONENTS
// ───────────────────────────────────────────────────────────── */

// const AVATAR_SIZE_BY_DEVICE = { phone: 52, phoneLg: 60, tablet: 76, laptop: 92, desktop: 108 };
// const AVATAR_FONT_BY_DEVICE = { phone: 17, phoneLg: 19, tablet: 24, laptop: 30, desktop: 36 };

// const VideoTile = ({ tile, small, large, device = "desktop", handRaised, tileFloaters, zoom, hideNameTag }) => {
//   const videoRef = useRef(null);

//   useEffect(() => {
//     const el = videoRef.current;
//     if (!el || !tile?.track) return;
//     tile.track.attach(el);
//     return () => {
//       try {
//         tile.track.detach(el);
//       } catch (_) {}
//     };
//   }, [tile?.track]);

//   const showVideo = !!tile?.track && !tile.videoMuted;
//   const initials = (tile?.name || "?").trim().charAt(0).toUpperCase();
//   const zoomScale = !small && zoom && zoom !== 1 ? zoom : null;

//   return (
//     <div style={small ? S.filmstripVideoWrap : S.stageVideoWrap}>
//       {showVideo ? (
//         <video
//           ref={videoRef}
//           autoPlay
//           playsInline
//           muted
//           style={{
//             width: "100%",
//             height: "100%",
//             objectFit: tile.isScreen ? "contain" : "cover",
//             background: "#000",
//             transform: [
//               tile.isLocal && !tile.isScreen ? "scaleX(-1)" : "",
//               zoomScale ? `scale(${zoomScale})` : "",
//             ]
//               .filter(Boolean)
//               .join(" ") || "none",
//             transformOrigin: "center center",
//             transition: "transform .2s ease",
//             display: "block",
//           }}
//         />
//       ) : (
//         <div style={S.avatarWrap}>
//           <div
//             style={{
//               ...S.avatarCircle,
//               width: small ? 36 : AVATAR_SIZE_BY_DEVICE[device] ?? 96,
//               height: small ? 36 : AVATAR_SIZE_BY_DEVICE[device] ?? 96,
//               fontSize: small ? 14 : AVATAR_FONT_BY_DEVICE[device] ?? 32,
//             }}
//           >
//             {initials}
//           </div>
//         </div>
//       )}
//       {small && !hideNameTag && (
//         <span style={S.tileNameTagSm}>
//           {tile?.micMuted && !tile?.isScreen && <MicOff size={9} strokeWidth={2.4} style={{ marginRight: 4 }} />}
//           {tile?.name}
//         </span>
//       )}
//       {handRaised && !tile?.isScreen && (
//         <span style={small ? S.tileHandBadgeSm : S.tileHandBadge} title="Hand raised">
//           <Hand size={small ? 11 : 14} strokeWidth={2.5} />
//         </span>
//       )}
//       {!!tileFloaters?.length && (
//         <div style={S.tileFloaterLayer} aria-hidden="true">
//           {tileFloaters.map((f) => (
//             <span
//               key={f.id}
//               style={{
//                 ...S.tileFloaterEmoji,
//                 left: `${20 + ((f.id * 37) % 60)}%`,
//                 fontSize: small ? 16 : 28,
//               }}
//             >
//               {f.emoji}
//             </span>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// const pipCtrlBtnStyle = (danger) => ({
//   width: 34,
//   height: 34,
//   borderRadius: 12,
//   border: "none",
//   background: danger ? "rgba(239,68,68,.18)" : "rgba(255,255,255,.08)",
//   color: danger ? "#fca5a5" : "#e5e7eb",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   cursor: "pointer",
// });

// const PipPanel = ({ tile, timer, micOn, camOn, onToggleMic, onToggleCam, onReturn }) => (
//   <div style={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column", background: "#0B0D11", fontFamily: "'Inter',sans-serif" }}>
//     <div style={{ flex: 1, position: "relative", minHeight: 0 }}>
//       {tile ? (
//         <VideoTile tile={tile} device="phone" />
//       ) : (
//         <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b", fontSize: 12 }}>
//           No active video
//         </div>
//       )}
//       <div style={{ position: "absolute", top: 8, left: 8, display: "flex", alignItems: "center", gap: 6, background: "rgba(0,0,0,.55)", padding: "3px 9px", borderRadius: 999, fontSize: 10, fontWeight: 700, color: "#fff" }}>
//         <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#EF4444" }} />
//         LIVE · {timer}
//       </div>
//     </div>
//     <div style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: 10, background: "#171A21", borderTop: "1px solid rgba(255,255,255,.06)" }}>
//       <button onClick={onToggleMic} style={pipCtrlBtnStyle(!micOn)}>{micOn ? <Mic size={15} /> : <MicOff size={15} />}</button>
//       <button onClick={onToggleCam} style={pipCtrlBtnStyle(!camOn)}>{camOn ? <Video size={15} /> : <VideoOff size={15} />}</button>
//       <button onClick={onReturn} style={{ ...pipCtrlBtnStyle(false), width: "auto", padding: "0 14px", fontSize: 11, fontWeight: 700 }}>
//         Return to meeting
//       </button>
//     </div>
//   </div>
// );

// const RemoteAudio = ({ track, onBlocked }) => {
//   const ref = useRef(null);

//   useEffect(() => {
//     const el = ref.current;
//     if (!el || !track) return;
//     track.attach(el);
//     el.autoplay = true;
//     el.playsInline = true;
//     const playPromise = el.play();
//     if (playPromise && typeof playPromise.catch === "function") {
//       playPromise.catch(() => onBlocked && onBlocked());
//     }
//     return () => {
//       try {
//         track.detach(el);
//       } catch (_) {}
//     };
//   }, [track, onBlocked]);

//   return <audio ref={ref} data-remote-audio="1" style={S.hiddenAudio} />;
// };

// const TC_TONES = {
//   red: { bg: "rgba(239,68,68,.12)", border: "rgba(239,68,68,.28)", color: "#f87171" },
//   green: { bg: "rgba(34,197,94,.12)", border: "rgba(34,197,94,.28)", color: "#4ade80" },
//   amber: { bg: "rgba(251,191,36,.12)", border: "rgba(251,191,36,.28)", color: "#fbbf24" },
//   purple: { bg: "rgba(139,92,246,.14)", border: "rgba(139,92,246,.3)", color: "#a78bfa" },
//   blue: { bg: "rgba(37,99,235,.14)", border: "rgba(37,99,235,.3)", color: "#60a5fa" },
// };

// const TCBtn = ({ icon, label, tone = "blue", onClick }) => {
//   const t = TC_TONES[tone] || TC_TONES.blue;
//   return (
//     <button
//       className="ilm-tcbtn"
//       onClick={onClick}
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "center",
//         gap: 6,
//         padding: "12px 6px",
//         borderRadius: 14,
//         background: t.bg,
//         border: `1px solid ${t.border}`,
//         color: t.color,
//         cursor: "pointer",
//         fontSize: 10.5,
//         fontWeight: 700,
//         textAlign: "center",
//         lineHeight: 1.2,
//         fontFamily: "'Inter',sans-serif",
//       }}
//     >
//       {icon}
//       <span>{label}</span>
//     </button>
//   );
// };

// const ParticipantMenu = ({ onClose, onAction }) => {
//   const ref = useRef(null);
//   useEffect(() => {
//     const handler = (e) => {
//       if (ref.current && !ref.current.contains(e.target)) onClose();
//     };
//     document.addEventListener("mousedown", handler, true);
//     return () => document.removeEventListener("mousedown", handler, true);
//   }, [onClose]);

//   const items = [
//     { label: "Mute", icon: <MicOff size={13} /> },
//     { label: "Unmute", icon: <Mic size={13} /> },
//     { label: "Disable Camera", icon: <VideoOff size={13} /> },
//     { label: "Enable Camera", icon: <Video size={13} /> },
//     { label: "Spotlight", icon: <Pin size={13} /> },
//     { label: "Remove Participant", icon: <Trash2 size={13} />, danger: true },
//   ];

//   return (
//     <div ref={ref} style={S.participantMenu}>
//       {items.map((it) => (
//         <button
//           key={it.label}
//           style={{ ...S.participantMenuItem, ...(it.danger ? { color: "#f87171" } : null) }}
//           onClick={() => onAction(it.label)}
//         >
//           {it.icon}
//           {it.label}
//         </button>
//       ))}
//     </div>
//   );
// };

// const CtrlBtn = ({ icon, label, active, danger, gold, badge, onClick, compact }) => {
//   const [hov, setHov] = useState(false);
//   const bg = danger
//     ? hov ? "rgba(239,68,68,.28)" : "rgba(239,68,68,.16)"
//     : gold && active
//       ? hov ? "rgba(251,191,36,.32)" : "rgba(251,191,36,.2)"
//       : active
//         ? hov ? "rgba(37,99,235,.32)" : "rgba(37,99,235,.2)"
//         : hov ? "rgba(255,255,255,.12)" : "rgba(255,255,255,.05)";
//   const col = danger ? "#fca5a5" : gold && active ? "#fbbf24" : active ? "#93c5fd" : "#E5E7EB";
//   return (
//     <div style={{ position: "relative" }}>
//       <button
//         onClick={onClick}
//         onMouseEnter={() => setHov(true)}
//         onMouseLeave={() => setHov(false)}
//         title={label}
//         style={{
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           justifyContent: "center",
//           gap: 3,
//           background: bg,
//           color: col,
//           border: gold && active ? "1px solid rgba(251,191,36,.4)" : "1px solid transparent",
//           borderRadius: 12,
//           padding: compact ? "8px 10px" : "8px 16px",
//           cursor: "pointer",
//           transition: "all .15s ease",
//           flexShrink: 0,
//           minWidth: compact ? 48 : 64,
//         }}
//       >
//         {icon}
//         {!compact && <span style={{ fontSize: 10, fontWeight: 600 }}>{label}</span>}
//       </button>
//       {!!badge && <span style={S.ctrlBadge}>{badge}</span>}
//     </div>
//   );
// };

// /* ─────────────────────────────────────────────────────────────
//    DESIGN TOKENS + STYLES
// ───────────────────────────────────────────────────────────── */
// const S = {
//   root: {
//     position: "fixed",
//     inset: 0,
//     zIndex: 9999,
//     display: "flex",
//     flexDirection: "column",
//     background: "#0B0D11",
//     color: "#FFFFFF",
//     fontFamily: "'Inter','Segoe UI',sans-serif",
//     overflow: "hidden",
//   },
//   autoEndToast: {
//     position: "fixed",
//     top: 64,
//     left: "50%",
//     transform: "translateX(-50%)",
//     zIndex: 99999,
//     display: "flex",
//     alignItems: "center",
//     gap: 12,
//     padding: "14px 24px",
//     borderRadius: 16,
//     background: "linear-gradient(135deg,#dc2626,#EF4444)",
//     color: "#fff",
//     boxShadow: "0 12px 36px rgba(239,68,68,0.4)",
//     animation: "slideIn 0.35s ease",
//     minWidth: 300,
//   },
//   topBar: {
//     flexShrink: 0,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: "10px 20px",
//     background: "#0F1116",
//     borderBottom: "1px solid rgba(255,255,255,.06)",
//     zIndex: 10,
//     gap: 12,
//     flexWrap: "wrap",
//   },
//   topBarCompact: { padding: "8px 10px", gap: 6 },
//   topLeft: { display: "flex", alignItems: "center", gap: 8, minWidth: 0, flexWrap: "wrap" },
//   topRight: { display: "flex", alignItems: "center", gap: 6, flexShrink: 0 },
//   recErrorBar: {
//     flexShrink: 0,
//     fontSize: 11,
//     color: "#fca5a5",
//     background: "rgba(239,68,68,.1)",
//     borderBottom: "1px solid rgba(239,68,68,.2)",
//     padding: "5px 20px",
//   },
//   liveBadge: {
//     display: "flex",
//     alignItems: "center",
//     gap: 5,
//     padding: "6px 12px",
//     borderRadius: 8,
//     background: "#EF4444",
//     fontSize: 11,
//     fontWeight: 800,
//     letterSpacing: "0.06em",
//     color: "#fff",
//   },
//   liveDot: { width: 6, height: 6, borderRadius: "50%", background: "#fff", animation: "livePulse 1.2s ease-in-out infinite", display: "inline-block" },
//   timerPill: {
//     fontFamily: "monospace",
//     fontSize: 13,
//     fontWeight: 600,
//     color: "#E5E7EB",
//     background: "#171A21",
//     border: "1px solid rgba(255,255,255,.06)",
//     borderRadius: 8,
//     padding: "6px 10px",
//     letterSpacing: 0.4,
//   },
//   recPill: {
//     display: "flex",
//     alignItems: "center",
//     gap: 6,
//     background: "#171A21",
//     border: "1px solid rgba(255,255,255,.06)",
//     borderRadius: 8,
//     padding: "6px 12px",
//     fontSize: 11,
//     fontWeight: 700,
//     letterSpacing: "0.04em",
//   },
//   pillDark: {
//     display: "flex",
//     alignItems: "center",
//     gap: 7,
//     background: "#171A21",
//     border: "1px solid rgba(255,255,255,.06)",
//     borderRadius: 8,
//     padding: "6px 12px",
//     fontSize: 12,
//     fontWeight: 600,
//     color: "#cbd0da",
//   },
//   pillDivider: { width: 1, height: 12, background: "rgba(255,255,255,.14)" },
//   classLabel: { fontSize: 12.5, fontWeight: 500, color: "#8b90a0" },
//   classLink: { color: "#60a5fa", fontWeight: 700 },
//   signalPill: {
//     display: "flex",
//     alignItems: "center",
//     gap: 6,
//     fontSize: 12,
//     fontWeight: 700,
//     color: "#4ade80",
//     background: "#171A21",
//     border: "1px solid rgba(255,255,255,.06)",
//     borderRadius: 8,
//     padding: "6px 10px",
//   },
//   iconTextBtn: {
//     display: "flex",
//     alignItems: "center",
//     gap: 6,
//     background: "#171A21",
//     border: "1px solid rgba(255,255,255,.06)",
//     borderRadius: 8,
//     padding: "7px 12px",
//     color: "#cbd0da",
//     fontSize: 12,
//     fontWeight: 600,
//     cursor: "pointer",
//   },
//   iconBtn: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     width: 32,
//     height: 32,
//     borderRadius: 8,
//     border: "1px solid rgba(255,255,255,.06)",
//     background: "#171A21",
//     color: "#B4B9C7",
//     cursor: "pointer",
//   },
//   smallMenu: {
//     position: "absolute",
//     top: "calc(100% + 8px)",
//     left: 0,
//     background: "#171A21",
//     border: "1px solid rgba(255,255,255,.08)",
//     borderRadius: 12,
//     padding: 6,
//     minWidth: 200,
//     boxShadow: "0 16px 40px rgba(0,0,0,.5)",
//     zIndex: 60,
//     display: "flex",
//     flexDirection: "column",
//     gap: 2,
//     animation: "menuIn .14s ease",
//   },
//   smallMenuItem: {
//     display: "flex",
//     alignItems: "center",
//     gap: 8,
//     background: "none",
//     border: "none",
//     color: "#cbd0da",
//     fontSize: 12.5,
//     fontWeight: 600,
//     padding: "9px 10px",
//     borderRadius: 8,
//     cursor: "pointer",
//     textAlign: "left",
//   },
//   endBtn: {
//     display: "flex",
//     alignItems: "center",
//     gap: 7,
//     padding: "8px 16px",
//     borderRadius: 8,
//     border: "none",
//     background: "#EF4444",
//     color: "#fff",
//     fontSize: 12.5,
//     fontWeight: 700,
//     cursor: "pointer",
//     boxShadow: "0 4px 14px rgba(239,68,68,.3)",
//   },
//   body: { flex: 1, display: "flex", overflow: "hidden", minHeight: 0, position: "relative" },
//   videoArea: { flex: 1, position: "relative", overflow: "hidden", minWidth: 0, background: "#0B0D11" },
//   stageWrap: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", gap: 14, padding: "20px" },
//   stageWrapCompact: { padding: "8px", gap: 8 },
//   gridWrap: { position: "absolute", inset: 0, padding: "16px", overflowY: "auto" },
//   gridWrapCompact: { padding: "8px" },
//   videoGrid: {
//     display: "grid",
//     gap: 12,
//     gridAutoRows: "minmax(140px, 1fr)",
//     height: "100%",
//     alignContent: "center",
//   },
//   gridTile: {
//     position: "relative",
//     borderRadius: 16,
//     overflow: "hidden",
//     background: "#050608",
//     border: "1px solid rgba(255,255,255,.08)",
//     boxShadow: "0 12px 30px rgba(0,0,0,.35)",
//     aspectRatio: "16 / 10",
//   },
//   gridHostChip: {
//     position: "absolute",
//     top: 10,
//     left: 10,
//     display: "flex",
//     alignItems: "center",
//     gap: 6,
//     background: "rgba(11,13,17,.68)",
//     backdropFilter: "blur(6px)",
//     color: "#fff",
//     fontSize: 11,
//     fontWeight: 600,
//     padding: "4px 9px",
//     borderRadius: 7,
//   },
//   // ── BUG FIX 1: Trainer Self Video UI Flat ──
//   // `mainStageOuter` centers the (now aspect-ratio-constrained)
//   // `mainStage` card within the available video area instead of
//   // letting it stretch edge-to-edge with no proportion, which is what
//   // made the self-view read as a flat, un-styled rectangle.
//   mainStageOuter: {
//     flex: 1,
//     minHeight: 0,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     overflow: "hidden",
//   },
//   mainStage: {
//     position: "relative",
//     width: "100%",
//     maxWidth: "100%",
//     maxHeight: "100%",
//     aspectRatio: "16 / 9",
//     borderRadius: 20,
//     overflow: "hidden",
//     background: "#050608",
//     border: "1px solid rgba(255,255,255,.09)",
//     boxShadow: "0 28px 64px rgba(0,0,0,.5), 0 0 0 1px rgba(255,255,255,.03)",
//   },
//   stageVideoWrap: { width: "100%", height: "100%", position: "relative", background: "#000", borderRadius: 18, overflow: "hidden" },
//   hostChip: {
//     position: "absolute",
//     top: 14,
//     left: 14,
//     display: "flex",
//     alignItems: "center",
//     gap: 8,
//     background: "rgba(11,13,17,.68)",
//     backdropFilter: "blur(6px)",
//     color: "#fff",
//     fontSize: 12.5,
//     fontWeight: 600,
//     padding: "6px 12px",
//     borderRadius: 8,
//   },
//   hostChipBadge: {
//     fontSize: 10,
//     fontWeight: 800,
//     color: "#93c5fd",
//     background: "rgba(37,99,235,.22)",
//     border: "1px solid rgba(96,165,250,.25)",
//     borderRadius: 6,
//     padding: "2px 8px",
//   },
//   spotlightBtn: {
//     position: "absolute",
//     top: 14,
//     right: 14,
//     display: "flex",
//     alignItems: "center",
//     gap: 6,
//     background: "rgba(11,13,17,.58)",
//     backdropFilter: "blur(10px)",
//     border: "1px solid rgba(255,255,255,.12)",
//     color: "#cbd0da",
//     fontSize: 11.5,
//     fontWeight: 700,
//     padding: "7px 13px",
//     borderRadius: 999,
//     cursor: "pointer",
//     boxShadow: "0 6px 18px rgba(0,0,0,.3)",
//   },
//   spotlightBtnOn: { color: "#93c5fd", border: "1px solid rgba(96,165,250,.4)", background: "rgba(37,99,235,.22)" },
//   presentingChip: {
//     position: "absolute",
//     top: 14,
//     left: "50%",
//     transform: "translateX(-50%)",
//     display: "flex",
//     alignItems: "center",
//     gap: 7,
//     background: "rgba(11,13,17,.72)",
//     backdropFilter: "blur(6px)",
//     border: "1px solid rgba(255,255,255,.1)",
//     color: "#fff",
//     fontSize: 12,
//     fontWeight: 700,
//     padding: "6px 14px",
//     borderRadius: 999,
//   },
//   // ── Part 1: Google Meet-style presentation layout. presentRow holds
//   // the big hero stage + narrow right-side participant column
//   // side-by-side, replacing the old single mainStage+bottom-filmstrip
//   // box whenever someone is actively screen-sharing.
//   presentRow: { flex: 1, minHeight: 0, display: "flex", flexDirection: "row", gap: 12 },
//   presentRowCompact: { gap: 8 },
//   presentStage: {
//     flex: 1,
//     minWidth: 0,
//     minHeight: 0,
//     borderRadius: 18,
//     overflow: "hidden",
//     background: "#050608",
//     position: "relative",
//     border: "1px solid rgba(255,255,255,.08)",
//     boxShadow: "0 24px 56px rgba(0,0,0,.45), 0 0 0 1px rgba(255,255,255,.02)",
//   },
//   // Subtle top-left "You are presenting" / "{name} is presenting" pill —
//   // Meet keeps this small and unobtrusive, unlike the old bold
//   // center-top presentingChip (still defined above for anything else
//   // that references it).
//   presentingLabel: {
//     position: "absolute",
//     top: 12,
//     left: 12,
//     display: "flex",
//     alignItems: "center",
//     gap: 6,
//     background: "rgba(11,13,17,.55)",
//     backdropFilter: "blur(8px)",
//     border: "1px solid rgba(255,255,255,.08)",
//     color: "#e5e7eb",
//     fontSize: 11.5,
//     fontWeight: 600,
//     padding: "5px 10px",
//     borderRadius: 999,
//     zIndex: 6,
//   },
//   // Floating zoom/pop-out/fullscreen cluster over the shared screen.
//   // BUG FIX 2: no longer opacity:0 by default (see the CSS rule for
//   // .ilm-present-controls in the <style> block) — kept visible at a
//   // dim baseline at all times, full opacity on hover/focus, and pinned
//   // to full opacity via .ilm-force-visible for the whole time the
//   // trainer is in fullscreen.
//   presentControls: {
//     position: "absolute",
//     bottom: 14,
//     right: 14,
//     display: "flex",
//     alignItems: "center",
//     gap: 4,
//     background: "rgba(11,13,17,.62)",
//     backdropFilter: "blur(10px)",
//     border: "1px solid rgba(255,255,255,.1)",
//     borderRadius: 999,
//     padding: 4,
//     zIndex: 30,
//   },
//   presentCtrlBtn: {
//     width: 30,
//     height: 30,
//     borderRadius: "50%",
//     border: "none",
//     background: "transparent",
//     color: "#e5e7eb",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     cursor: "pointer",
//   },
//   presentCtrlZoomLabel: {
//     minWidth: 40,
//     height: 30,
//     padding: "0 4px",
//     borderRadius: 999,
//     border: "none",
//     background: "transparent",
//     color: "#9ca3af",
//     fontSize: 11,
//     fontWeight: 700,
//     cursor: "pointer",
//   },
//   presentCtrlDivider: { width: 1, height: 18, background: "rgba(255,255,255,.14)", margin: "0 2px" },
//   presentSidebar: {
//     flexShrink: 0,
//     display: "flex",
//     flexDirection: "column",
//     gap: 10,
//     overflowY: "auto",
//     overflowX: "hidden",
//     paddingRight: 2,
//     transition: "width .2s ease",
//   },
//   presentSidebarTile: {
//     flexShrink: 0,
//     width: "100%",
//     aspectRatio: "16 / 10",
//     borderRadius: 12,
//     overflow: "hidden",
//     background: "#171A21",
//     border: "1px solid rgba(255,255,255,.08)",
//     boxShadow: "0 8px 20px rgba(0,0,0,.35)",
//     position: "relative",
//     cursor: "pointer",
//   },
//   tileHandBadge: {
//     position: "absolute",
//     top: 14,
//     left: 14,
//     width: 30,
//     height: 30,
//     borderRadius: "50%",
//     background: "#fbbf24",
//     color: "#1a1a1a",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     boxShadow: "0 4px 14px rgba(251,191,36,.45)",
//     animation: "recBlink 1.4s infinite",
//     zIndex: 5,
//   },
//   tileHandBadgeSm: {
//     position: "absolute",
//     top: 6,
//     left: 6,
//     display: "flex",
//     alignItems: "center",
//     gap: 3,
//     fontSize: 9,
//     fontWeight: 700,
//     color: "#1a1a1a",
//     background: "#fbbf24",
//     borderRadius: 999,
//     padding: "3px 5px",
//     boxShadow: "0 2px 8px rgba(251,191,36,.45)",
//     animation: "recBlink 1.4s infinite",
//     zIndex: 5,
//   },
//   tileFloaterLayer: { position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 4 },
//   tileFloaterEmoji: { position: "absolute", bottom: 8, animation: "floatUp 2.2s ease-out forwards" },
//   filmstripRow: { flexShrink: 0, display: "flex", alignItems: "center", gap: 8 },
//   filmArrow: {
//     flexShrink: 0,
//     width: 30,
//     height: 30,
//     borderRadius: "50%",
//     border: "1px solid rgba(255,255,255,.08)",
//     background: "#171A21",
//     color: "#E5E7EB",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     cursor: "pointer",
//   },
//   filmstrip: { flex: 1, display: "flex", gap: 10, overflowX: "auto", overflowY: "hidden", padding: "2px 2px 4px", scrollbarWidth: "thin" },
//   filmstripCompact: { gap: 6 },
//   filmstripTile: {
//     flexShrink: 0,
//     width: 128,
//     height: 128,
//     borderRadius: 12,
//     overflow: "hidden",
//     background: "#171A21",
//     border: "1px solid rgba(255,255,255,.08)",
//     boxShadow: "0 8px 20px rgba(0,0,0,.35)",
//     position: "relative",
//   },
//   filmstripOverflowTile: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     background: "rgba(255,255,255,.06)",
//     color: "#cbd0da",
//     fontSize: 14,
//     fontWeight: 700,
//   },
//   filmstripVideoWrap: { width: "100%", height: "100%", position: "relative", background: "#171A21", borderRadius: 12, overflow: "hidden" },
//   audioLayer: { position: "absolute", width: 0, height: 0, overflow: "hidden" },
//   hiddenAudio: { position: "absolute", width: 1, height: 1, opacity: 0, pointerEvents: "none" },
//   enableAudioBtn: {
//     position: "absolute",
//     top: 16,
//     left: "50%",
//     transform: "translateX(-50%)",
//     zIndex: 30,
//     display: "flex",
//     alignItems: "center",
//     gap: 8,
//     padding: "9px 18px",
//     borderRadius: 999,
//     border: "1px solid rgba(37,99,235,.35)",
//     background: "rgba(11,13,17,.92)",
//     color: "#93c5fd",
//     fontSize: 12,
//     fontWeight: 700,
//     cursor: "pointer",
//     boxShadow: "0 12px 32px rgba(0,0,0,.5)",
//   },
//   avatarWrap: { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "#171A21" },
//   avatarCircle: {
//     borderRadius: "50%",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontWeight: 800,
//     color: "#fff",
//     background: "linear-gradient(135deg,#2563EB,#60a5fa)",
//   },
//   tileNameTagSm: {
//     position: "absolute",
//     bottom: 6,
//     left: 6,
//     fontSize: 9.5,
//     color: "#fff",
//     background: "rgba(11,13,17,.68)",
//     backdropFilter: "blur(4px)",
//     padding: "2px 7px",
//     borderRadius: 6,
//     pointerEvents: "none",
//     fontWeight: 600,
//     display: "flex",
//     alignItems: "center",
//     maxWidth: "calc(100% - 12px)",
//     overflow: "hidden",
//     textOverflow: "ellipsis",
//     whiteSpace: "nowrap",
//   },
//   floatingChat: {
//     position: "absolute",
//     bottom: 16,
//     right: 16,
//     width: 320,
//     maxHeight: 420,
//     background: "rgba(15,17,22,.92)",
//     backdropFilter: "blur(14px)",
//     border: "1px solid rgba(255,255,255,.08)",
//     borderRadius: 16,
//     boxShadow: "0 20px 48px rgba(0,0,0,.5)",
//     display: "flex",
//     flexDirection: "column",
//     zIndex: 25,
//     animation: "chatFade .2s ease",
//   },
//   floatingChatCompact: { left: 8, right: 8, width: "auto", bottom: 8, maxHeight: "50vh" },
//   chatHead: {
//     flexShrink: 0,
//     display: "flex",
//     alignItems: "center",
//     gap: 8,
//     padding: "12px 14px",
//     borderBottom: "1px solid rgba(255,255,255,.06)",
//   },
//   chatHeadTitle: { fontSize: 13.5, fontWeight: 700, color: "#fff" },
//   chatOnline: { marginLeft: "auto", fontSize: 11, color: "#4ade80", fontWeight: 600 },
//   chatCloseBtn: { background: "none", border: "none", color: "#8b90a0", cursor: "pointer", display: "flex", padding: 2 },
//   msgList: { flex: 1, overflowY: "auto", padding: "12px 14px", display: "flex", flexDirection: "column", gap: 12, minHeight: 80, maxHeight: 260 },
//   sysRow: { display: "flex", justifyContent: "center" },
//   sysBubble: {
//     fontSize: 10.5,
//     color: "#8b90a0",
//     background: "#171A21",
//     border: "1px solid rgba(255,255,255,.06)",
//     borderRadius: 10,
//     padding: "5px 12px",
//     fontWeight: 500,
//     textAlign: "center",
//   },
//   msgBlock: { display: "flex", flexDirection: "column", gap: 3 },
//   msgUser: { fontSize: 10, color: "#6B7280", fontWeight: 600 },
//   msgTime: { color: "#4b5261", fontWeight: 500, marginLeft: 4 },
//   msgBubble: { maxWidth: "90%", padding: "8px 12px", borderRadius: 14, fontSize: 12.5, color: "#FFFFFF", lineHeight: 1.45, fontWeight: 400 },
//   bubbleSelf: { background: "#2563EB", alignSelf: "flex-end", borderBottomRightRadius: 4 },
//   bubbleOther: { background: "#171A21", border: "1px solid rgba(255,255,255,.06)", borderBottomLeftRadius: 4 },
//   inputRow: { flexShrink: 0, display: "flex", gap: 8, padding: "10px 12px", borderTop: "1px solid rgba(255,255,255,.06)" },
//   chatInput: {
//     flex: 1,
//     background: "#171A21",
//     border: "1px solid rgba(255,255,255,.08)",
//     borderRadius: 999,
//     padding: "9px 14px",
//     color: "#FFFFFF",
//     fontSize: 12.5,
//     outline: "none",
//   },
//   sendBtn: {
//     flexShrink: 0,
//     background: "#2563EB",
//     border: "none",
//     borderRadius: 999,
//     width: 36,
//     height: 36,
//     color: "#fff",
//     cursor: "pointer",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   loadingBox: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 },
//   spinner: { width: 40, height: 40, border: "3px solid rgba(37,99,235,.2)", borderTop: "3px solid #2563EB", borderRadius: "50%", animation: "spin .8s linear infinite" },
//   loadingText: { fontSize: 13, color: "#B4B9C7", fontWeight: 600 },
//   sidebar: {
//     flexShrink: 0,
//     background: "#0F1116",
//     borderLeft: "1px solid rgba(255,255,255,.06)",
//     display: "flex",
//     flexDirection: "column",
//     overflow: "hidden",
//     transition: "width .25s ease",
//   },
//   sidebarInner: { flex: 1, display: "flex", flexDirection: "column", minHeight: 0, overflowY: "auto", gap: 10, padding: 12 },
//   panelBlock: {
//     flexShrink: 0,
//     background: "#111318",
//     border: "1px solid rgba(255,255,255,.06)",
//     borderRadius: 16,
//     display: "flex",
//     flexDirection: "column",
//     overflow: "hidden",
//   },
//   panelHead: {
//     flexShrink: 0,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: "12px 14px",
//     borderBottom: "1px solid rgba(255,255,255,.06)",
//   },
//   panelTitle: { fontSize: 13.5, fontWeight: 700, color: "#fff" },
//   sidebarCloseBtn: { display: "flex", alignItems: "center", justifyContent: "center", width: 26, height: 26, borderRadius: 8, border: "none", background: "transparent", color: "#B4B9C7", cursor: "pointer" },
//   tcGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, padding: 12 },
//   searchRow: {
//     flexShrink: 0,
//     display: "flex",
//     alignItems: "center",
//     gap: 8,
//     margin: "10px 12px",
//     background: "#171A21",
//     border: "1px solid rgba(255,255,255,.06)",
//     borderRadius: 10,
//     padding: "8px 10px",
//   },
//   searchInput: { flex: 1, background: "transparent", border: "none", outline: "none", color: "#e5e7eb", fontSize: 12.5 },
//   peopleList: { flex: 1, overflowY: "auto", padding: "0 10px 10px", display: "flex", flexDirection: "column", gap: 6, minHeight: 0 },
//   emptyPeople: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, paddingTop: 24, paddingBottom: 24 },
//   emptyPeopleText: { fontSize: 12, color: "#6B7280", marginTop: 8 },
//   pRow: { display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 12, background: "#171A21", border: "1px solid rgba(255,255,255,.06)" },
//   pAv: { width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, flexShrink: 0, color: "#fff" },
//   pName: { flex: 1, fontSize: 12.5, color: "#E5E7EB", fontWeight: 500 },
//   pJoinedText: { fontSize: 10, color: "#6B7280", marginTop: 1 },
//   hostTag: { fontSize: 9.5, background: "rgba(37,99,235,.15)", color: "#93c5fd", padding: "3px 9px", borderRadius: 999, fontWeight: 700, letterSpacing: "0.04em" },
//   pHandBadge: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     width: 20,
//     height: 20,
//     borderRadius: "50%",
//     background: "#fbbf24",
//     color: "#1a1a1a",
//     boxShadow: "0 2px 8px rgba(251,191,36,.45)",
//     animation: "recBlink 1.4s infinite",
//     flexShrink: 0,
//   },
//   pMenuBtn: { background: "none", border: "none", color: "#8b90a0", cursor: "pointer", display: "flex", padding: 2, flexShrink: 0 },
//   participantMenu: {
//     position: "absolute",
//     top: "calc(100% + 4px)",
//     right: 4,
//     background: "#171A21",
//     border: "1px solid rgba(255,255,255,.08)",
//     borderRadius: 12,
//     padding: 6,
//     minWidth: 190,
//     boxShadow: "0 16px 40px rgba(0,0,0,.5)",
//     zIndex: 70,
//     display: "flex",
//     flexDirection: "column",
//     gap: 1,
//     animation: "menuIn .14s ease",
//   },
//   participantMenuItem: {
//     display: "flex",
//     alignItems: "center",
//     gap: 8,
//     background: "none",
//     border: "none",
//     color: "#cbd0da",
//     fontSize: 12,
//     fontWeight: 600,
//     padding: "8px 10px",
//     borderRadius: 8,
//     cursor: "pointer",
//     textAlign: "left",
//   },
//   ctrlBar: {
//     flexShrink: 0,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     gap: 10,
//     padding: "10px 20px",
//     background: "#0F1116",
//     borderTop: "1px solid rgba(255,255,255,.06)",
//     overflowX: "auto",
//   },
//   ctrlBarCompact: { padding: "8px 10px" },
//   dockLeft: { display: "flex", alignItems: "center", gap: 6, flexWrap: "nowrap", overflowX: "auto" },
//   ctrlBadge: {
//     position: "absolute",
//     top: -4,
//     right: -4,
//     background: "#2563EB",
//     color: "#fff",
//     fontSize: 9,
//     fontWeight: 800,
//     borderRadius: 8,
//     padding: "1px 5px",
//     border: "2px solid #0F1116",
//     lineHeight: 1.3,
//   },
//   leaveBtn: {
//     flexShrink: 0,
//     display: "flex",
//     alignItems: "center",
//     gap: 7,
//     padding: "10px 18px",
//     borderRadius: 12,
//     border: "none",
//     background: "#EF4444",
//     color: "#fff",
//     fontSize: 12.5,
//     fontWeight: 700,
//     cursor: "pointer",
//     boxShadow: "0 6px 18px rgba(239,68,68,.35)",
//   },
// };

// export default LiveSessionControls;













































import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useParams } from "react-router-dom";
import { Room, RoomEvent, Track, createLocalTracks } from "livekit-client";
import {
  startLiveSessionWithToken,
  endLiveSession,
  getSessionParticipants,
  startRecordingLive,
  stopRecordingLive,
} from "@/services/liveSessionService";
import {
  PhoneOff,
  X,
  Circle,
  Users,
  Send,
  Mic,
  MicOff,
  Video,
  VideoOff,
  ScreenShare,
  MessageSquare,
  PictureInPicture2,
  Wifi,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  LayoutGrid,
  Maximize2,
  Minimize2,
  MoreVertical,
  Settings,
  Search,
  Pin,
  Crown,
  Lock,
  Unlock,
  ClipboardCheck,
  Radio,
  ScreenShareOff,
  Trash2,
  Hand,
  MessageSquareOff,
  UserCheck,
  UserX,
  ZoomIn,
  ZoomOut,
  ExternalLink,
  Maximize,
  MonitorX,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   HELPERS (unchanged business logic)
───────────────────────────────────────────────────────────── */
const getTime = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const CALL_STATE_PREFIX = "trainer_live_state_";
const CALL_STATE_TTL_MS = 8 * 60 * 60 * 1000;

const loadPersistedCallState = (sessionId) => {
  try {
    const raw = localStorage.getItem(`${CALL_STATE_PREFIX}${sessionId}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.token || !parsed?.startedAt) return null;
    if (Date.now() - parsed.startedAt > CALL_STATE_TTL_MS) {
      localStorage.removeItem(`${CALL_STATE_PREFIX}${sessionId}`);
      return null;
    }
    return parsed;
  } catch (_) {
    return null;
  }
};

const savePersistedCallState = (sessionId, state) => {
  try {
    localStorage.setItem(
      `${CALL_STATE_PREFIX}${sessionId}`,
      JSON.stringify(state),
    );
  } catch (_) {}
};

const clearPersistedCallState = (sessionId) => {
  try {
    localStorage.removeItem(`${CALL_STATE_PREFIX}${sessionId}`);
  } catch (_) {}
  try {
    sessionStorage.removeItem("call_state");
  } catch (_) {}
};

const readLegacyCallState = () => {
  try {
    const raw = sessionStorage.getItem("call_state");
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
};

const buildSnapshot = (room, pendingIdentities) => {
  if (!room) return { camTiles: [], screenTiles: [], audioTracks: [] };
  const pending = pendingIdentities || new Set();

  const camTiles = [];
  const screenTiles = [];
  const audioTracks = [];

  const addParticipant = (participant, isLocal) => {
    const videoPubs = Array.from(
      participant.videoTrackPublications?.values?.() || [],
    );
    const audioPubs = Array.from(
      participant.audioTrackPublications?.values?.() || [],
    );

    const micPub = audioPubs.find((p) => p.source === Track.Source.Microphone);
    const micMuted = micPub ? !!micPub.isMuted : true;

    const camPub = videoPubs.find((p) => p.source === Track.Source.Camera);
    const screenPub = videoPubs.find(
      (p) => p.source === Track.Source.ScreenShare,
    );

    const name = isLocal
      ? "You (Trainer)"
      : participant.name || participant.identity || "Student";
    const baseId = isLocal ? "local" : participant.identity;
    const identity = isLocal ? "you" : participant.identity;

    camTiles.push({
      id: `${baseId}-cam`,
      name,
      isLocal,
      isHost: isLocal,
      identity,
      track: camPub && camPub.track ? camPub.track : null,
      videoMuted: !camPub || !!camPub.isMuted || !camPub.track,
      micMuted,
    });

    if (screenPub && screenPub.track) {
      screenTiles.push({
        id: `${baseId}-screen`,
        name: isLocal ? "You're presenting" : `${name} is presenting`,
        isLocal,
        isScreen: true,
        identity,
        track: screenPub.track,
      });
    }

    if (!isLocal && micPub && micPub.track) {
      audioTracks.push({ id: `${baseId}-audio`, track: micPub.track });
    }
  };

  addParticipant(room.localParticipant, true);
  room.remoteParticipants.forEach((p) => {
    if (pending.has(p.identity)) return; // awaiting trainer approval
    addParticipant(p, false);
  });

  return { camTiles, screenTiles, audioTracks };
};

const getDevice = (w) => {
  if (w <= 480) return "phone";
  if (w <= 767) return "phoneLg";
  if (w <= 1023) return "tablet";
  if (w <= 1365) return "laptop";
  return "desktop";
};

const DEVICE_CONFIG = {
  phone: {
    filmstripTile: { width: 76, height: 76 },
    sidebarMode: "overlayFull",
    ctrlCompact: true,
    hideClassName: true,
    hideHeaderExtras: true,
  },
  phoneLg: {
    filmstripTile: { width: 92, height: 92 },
    sidebarMode: "overlayFull",
    ctrlCompact: true,
    hideClassName: true,
    hideHeaderExtras: true,
  },
  tablet: {
    filmstripTile: { width: 112, height: 112 },
    sidebarMode: "overlayWide",
    ctrlCompact: false,
    hideClassName: false,
    hideHeaderExtras: false,
  },
  laptop: {
    filmstripTile: { width: 118, height: 118 },
    sidebarMode: "panelNarrow",
    ctrlCompact: false,
    hideClassName: false,
    hideHeaderExtras: false,
  },
  desktop: {
    filmstripTile: { width: 128, height: 128 },
    sidebarMode: "panelFull",
    ctrlCompact: false,
    hideClassName: false,
    hideHeaderExtras: false,
  },
};

const useResponsiveDevice = () => {
  const [size, setSize] = useState(() => ({
    w: typeof window !== "undefined" ? window.innerWidth : 1366,
    h: typeof window !== "undefined" ? window.innerHeight : 768,
  }));

  useEffect(() => {
    let raf = null;
    const onResize = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() =>
        setSize({ w: window.innerWidth, h: window.innerHeight }),
      );
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const device = getDevice(size.w);
  return { ...size, device, cfg: DEVICE_CONFIG[device] };
};

const useElapsedTimer = (startedAtMs) => {
  const [, tick] = useState(0);
  useEffect(() => {
    if (!startedAtMs) return;
    const id = setInterval(() => tick((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, [startedAtMs]);

  if (!startedAtMs) return "00:00:00";
  const secs = Math.max(0, Math.floor((Date.now() - startedAtMs) / 1000));
  const hh = String(Math.floor(secs / 3600)).padStart(2, "0");
  const mm = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
};

// Dismiss a popover on outside click / Escape — used for the "More" menu
// and each participant row's context menu so they behave like the
// reference design's dropdowns.
function useDismiss(active, onDismiss, refs = []) {
  useEffect(() => {
    if (!active) return undefined;
    const handlePointer = (e) => {
      const insideAny = refs.some((r) => r.current && r.current.contains(e.target));
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

/* ═════════════════════════════════════════════════════════════
   MAIN COMPONENT
═════════════════════════════════════════════════════════════ */
const LiveSessionControls = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const roomRef = useRef(null);
  const localVideoTrackRef = useRef(null);
  const localAudioTrackRef = useRef(null);
  const chatEndRef = useRef(null);
  const autoEndPollRef = useRef(null);
  const participantPollRef = useRef(null);

  const hardStopTimeoutRef = useRef(null);
  const performAutoEndRef = useRef(null);
  const autoEndingRef = useRef(false);

  const [connected, setConnected] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [screenOn, setScreenOn] = useState(false);
  const [recording, setRecording] = useState(true);
  const [recToggling, setRecToggling] = useState(false);
  const [recError, setRecError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [participants, setParticipants] = useState([]);
  const startedRef = useRef(false);
  const recTogglingRef = useRef(false);
  const recCooldownRef = useRef(false);
  const [dbParticipants, setDbParticipants] = useState([]);

  const [camTiles, setCamTiles] = useState([]);
  const [screenTiles, setScreenTiles] = useState([]);
  const [focusedScreenIdentity, setFocusedScreenIdentity] = useState(null);
  const [remoteAudioTracks, setRemoteAudioTracks] = useState([]);
  const [audioBlocked, setAudioBlocked] = useState(false);

  const [raisedHands, setRaisedHands] = useState({});
  const [floaters, setFloaters] = useState([]);
  const floaterIdRef = useRef(0);

  const { w: viewportW, device, cfg: deviceCfg } = useResponsiveDevice();
  const isCompactDevice = device === "phone" || device === "phoneLg";
  const [messages, setMessages] = useState(() => [
    {
      id: 0,
      user: "System",
      text: "Session started. Welcome!",
      time: getTime(),
      system: true,
    },
  ]);
  const [input, setInput] = useState("");
  const [sessionTitle, setSessionTitle] = useState(`Session ${id}`);
  const [autoEndWarning, setAutoEndWarning] = useState(false);
  const [autoEndMessage, setAutoEndMessage] = useState(
    "Session duration has completed. The meeting has ended automatically.",
  );

  const [meetingStartedAt, setMeetingStartedAt] = useState(null);
  const timer = useElapsedTimer(meetingStartedAt);

  const [pipWindow, setPipWindow] = useState(null);
  const pipVideoRef = useRef(null);
  const userClosedPipRef = useRef(false);

  const [chatOpen, setChatOpen] = useState(true);
  const [participantSearch, setParticipantSearch] = useState("");
  const [openParticipantMenuId, setOpenParticipantMenuId] = useState(null);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [viewMenuOpen, setViewMenuOpen] = useState(false);
  const [spotlightOn, setSpotlightOn] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [settingsQuickOpen, setSettingsQuickOpen] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]); // [{identity, name, time}]
  const pendingIdentitiesRef = useRef(new Set());
  const [attendanceOpen, setAttendanceOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const [sidebarResizing, setSidebarResizing] = useState(false);
  const [sidebarResizeHover, setSidebarResizeHover] = useState(false);
  const sidebarResizeRef = useRef({ startX: 0, startWidth: 320 });
  const rootRef = useRef(null);
  const moreMenuBtnRef = useRef(null);
  const moreMenuPanelRef = useRef(null);
  const viewMenuBtnRef = useRef(null);
  const viewMenuPanelRef = useRef(null);
  const filmstripRef = useRef(null);

  const [trainerFlags, setTrainerFlags] = useState({
    allMuted: false,
    camerasDisabled: false,
    handsLowered: false,
    chatDisabled: false,
    locked: false,
    micRequestsAllowed: true,
    screenShareBlocked: false,
  });

  const pushSystem = useCallback((text) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), user: "System", text, time: getTime(), system: true },
    ]);
  }, []);

  const refreshParticipants = useCallback(() => {
    const room = roomRef.current;
    if (!room) return;
    const list = [
      {
        id: room.localParticipant.identity,
        name: room.localParticipant.name || "You (Trainer)",
        self: true,
        isHost: true,
      },
    ];
    room.remoteParticipants.forEach((p) =>
      list.push({
        id: p.identity,
        name: p.name || p.identity,
        self: false,
        isHost: false,
      }),
    );
    setParticipants(list);
  }, []);

  const rebuild = useCallback(() => {
    const snap = buildSnapshot(roomRef.current, pendingIdentitiesRef.current);
    setCamTiles(snap.camTiles);
    setScreenTiles(snap.screenTiles);
    setRemoteAudioTracks(snap.audioTracks);
  }, []);

  const enableAllAudio = useCallback(() => {
    document
      .querySelectorAll('audio[data-remote-audio="1"]')
      .forEach((el) => {
        el.muted = false;
        el.play().catch(() => {});
      });
    setAudioBlocked(false);
  }, []);

  const toggleRecording = useCallback(async () => {
    if (!id) return;
    if (recTogglingRef.current) return;
    if (recCooldownRef.current) {
      setRecError("Please wait a few seconds before toggling recording again.");
      return;
    }
    recTogglingRef.current = true;

    setRecError(null);
    setRecToggling(true);
    try {
      if (recording) {
        await stopRecordingLive(id);
        setRecording(false);
      } else {
        await startRecordingLive(id);
        setRecording(true);
      }
    } catch (err) {
      console.error(err);
      setRecError(err?.response?.data?.error || "Failed to toggle recording.");
    } finally {
      setRecToggling(false);
      recTogglingRef.current = false;
      recCooldownRef.current = true;
      setTimeout(() => {
        recCooldownRef.current = false;
      }, 12000);
    }
  }, [id, recording]);

  const fetchDbParticipants = useCallback(async () => {
    if (!id) return;
    try {
      const res = await getSessionParticipants(id);
      setDbParticipants(res.data || []);
    } catch (_) {
      // silently ignore
    }
  }, [id]);

  const getFreshAuthToken = useCallback(() => {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("lms_token") ||
      localStorage.getItem("accessToken") ||
      (() => {
        try {
          return JSON.parse(localStorage.getItem("lms_user") || "{}")?.token;
        } catch {
          return null;
        }
      })()
    );
  }, []);

  useEffect(() => {
    if (!id) return;
    const serverUrl = import.meta.env.VITE_LIVEKIT_URL || "ws://localhost:7880";

    if (startedRef.current) {
      return;
    }
    startedRef.current = true;

    const start = async () => {
      let token;
      let room_name;
      let startedAt;

      try {
        const persisted = loadPersistedCallState(id);
        const legacy = readLegacyCallState();

        if (persisted?.token) {
          token = persisted.token;
          room_name = persisted.room;
          startedAt = persisted.startedAt;
        } else if (legacy?.token) {
          token = legacy.token;
          room_name = legacy.room;
          startedAt = legacy.startedAt || Date.now();
        } else {
          const res = await startLiveSessionWithToken(id);
          token = res?.data?.token;
          room_name = res?.data?.room;
          setSessionTitle(res?.data?.title || `Session ${id}`);
          startedAt = Date.now();
        }

        if (!token) {
          console.error("No token returned");
          startedRef.current = false;
          return;
        }
      } catch (err) {
        console.error("startLiveSessionWithToken failed:", err);
        startedRef.current = false;
        return;
      }

      setMeetingStartedAt(startedAt);
      savePersistedCallState(id, { token, room: room_name, startedAt });
      try {
        sessionStorage.removeItem("call_state");
      } catch (_) {}

      const room = new Room({ adaptiveStream: true, dynacast: true });
      roomRef.current = room;

      try {
        await room.connect(serverUrl, token);
        setConnected(true);
        refreshParticipants();
        rebuild();

        fetchDbParticipants();
        participantPollRef.current = setInterval(fetchDbParticipants, 5000);

        let hardStopArmed = false;

        const armHardStopTimer = (durationMinutes) => {
          if (hardStopArmed || !durationMinutes) return;
          hardStopArmed = true;
          const endsAt = startedAt + Number(durationMinutes) * 60 * 1000;
          const msLeft = endsAt - Date.now();
          hardStopTimeoutRef.current = setTimeout(
            () => {
              performAutoEndRef.current?.(
                "Session duration has completed. The meeting has ended automatically.",
              );
            },
            Math.max(0, msLeft),
          );
        };

        const checkSessionStatus = async () => {
          try {
            const freshToken = getFreshAuthToken();
            const res = await fetch(
              `${import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api"}/live-sessions/${id}`,
              {
                headers: freshToken
                  ? { Authorization: `Bearer ${freshToken}` }
                  : {},
              },
            );
            if (!res.ok) {
              return;
            }
            const data = await res.json();

            if (!hardStopArmed && data.duration) {
              armHardStopTimer(data.duration);
            }

            if (data.status === "ENDED") {
              performAutoEndRef.current?.(
                "Session duration has completed. The meeting has ended automatically.",
              );
            }
          } catch (_) {
            // network hiccup — next tick / hard-stop timer still cover us
          }
        };

        checkSessionStatus();
        autoEndPollRef.current = setInterval(checkSessionStatus, 15000);
      } catch (err) {
        console.error("LiveKit connect failed:", err);
        startedRef.current = false;
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
        for (const track of tracks) {
          await room.localParticipant.publishTrack(track);
          if (track.kind === Track.Kind.Video) localVideoTrackRef.current = track;
          if (track.kind === Track.Kind.Audio) localAudioTrackRef.current = track;
        }
      } catch (err) {
        console.error("createLocalTracks failed:", err);
      }

      rebuild();

      room.on(RoomEvent.TrackSubscribed, () => rebuild());
      room.on(RoomEvent.TrackUnsubscribed, () => rebuild());
      room.on(RoomEvent.TrackMuted, () => rebuild());
      room.on(RoomEvent.TrackUnmuted, () => rebuild());
      room.on(RoomEvent.LocalTrackPublished, () => rebuild());
      room.on(RoomEvent.LocalTrackUnpublished, () => rebuild());
      room.on(RoomEvent.ParticipantConnected, (p) => {
        pendingIdentitiesRef.current.add(p.identity);
        setPendingRequests((prev) =>
          prev.some((r) => r.identity === p.identity)
            ? prev
            : [...prev, { identity: p.identity, name: p.name || p.identity, time: getTime() }],
        );
        refreshParticipants();
        fetchDbParticipants();
        pushSystem(`${p.name || p.identity} is requesting to join — awaiting your approval.`);
        rebuild();
      });
      room.on(RoomEvent.ParticipantDisconnected, (p) => {
        pendingIdentitiesRef.current.delete(p.identity);
        setPendingRequests((prev) => prev.filter((r) => r.identity !== p.identity));
        refreshParticipants();
        pushSystem(`${p.name || p.identity} left`);
        setRaisedHands((prev) => {
          if (!(p.identity in prev)) return prev;
          const next = { ...prev };
          delete next[p.identity];
          return next;
        });
        rebuild();
      });
      room.on(RoomEvent.DataReceived, (payload, participant) => {
        try {
          const decoded = new TextDecoder().decode(payload);
          const msg = JSON.parse(decoded);

          if (msg.type === "reaction") {
            const identity = participant?.identity;
            const fId = ++floaterIdRef.current;
            setFloaters((prev) => [
              ...prev,
              {
                id: fId,
                identity,
                emoji: msg.emoji,
                name: participant?.name || identity || "Someone",
              },
            ]);
            setTimeout(() => {
              setFloaters((prev) => prev.filter((f) => f.id !== fId));
            }, 2500);
            return;
          }

          if (msg.type === "raiseHand") {
            const identity = participant?.identity;
            if (identity) {
              setRaisedHands((prev) => ({ ...prev, [identity]: !!msg.raised }));
              pushSystem(
                `${participant?.name || identity} ${msg.raised ? "raised" : "lowered"} their hand`,
              );
            }
            return;
          }

          if (msg.text)
            setMessages((prev) => [
              ...prev,
              {
                id: Date.now(),
                user: participant?.name || participant?.identity || "Student",
                text: msg.text,
                time: getTime(),
                self: false,
              },
            ]);
        } catch (_) {}
      });
      room.on(RoomEvent.Disconnected, () => setConnected(false));
    };

    start();

    return () => {
      if (autoEndPollRef.current) clearInterval(autoEndPollRef.current);
      if (participantPollRef.current) clearInterval(participantPollRef.current);
      if (hardStopTimeoutRef.current) clearTimeout(hardStopTimeoutRef.current);
      roomRef.current?.disconnect();
      startedRef.current = false;
    };
  }, [id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatOpen]);

  const toggleMic = useCallback(async () => {
    const track = localAudioTrackRef.current;
    if (!track) return;
    if (micOn) await track.mute();
    else await track.unmute();
    setMicOn((v) => !v);
    rebuild();
  }, [micOn, rebuild]);

  const toggleCam = useCallback(async () => {
    const track = localVideoTrackRef.current;
    if (!track) return;
    if (camOn) await track.mute();
    else await track.unmute();
    setCamOn((v) => !v);
    rebuild();
  }, [camOn, rebuild]);

  const toggleScreen = useCallback(async () => {
    const room = roomRef.current;
    if (!room) return;
    if (screenOn) {
      try {
        await room.localParticipant.setScreenShareEnabled(false);
      } catch (_) {}
      setScreenOn(false);
      rebuild();
    } else {
      try {
        const pub = await room.localParticipant.setScreenShareEnabled(true, {
          audio: false,
          selfBrowserSurface: "exclude",
          surfaceSwitching: "include",
          systemAudio: "exclude",
        });
        if (!pub) return;
        setScreenOn(true);
        rebuild();
        const mediaTrack = pub.track?.mediaStreamTrack ?? null;
        if (mediaTrack) {
          mediaTrack.addEventListener(
            "ended",
            () => {
              room.localParticipant
                .setScreenShareEnabled(false)
                .catch(() => {});
              setScreenOn(false);
              rebuild();
            },
            { once: true },
          );
        }
      } catch (err) {
        if (err?.name !== "NotAllowedError")
          console.warn("Screen share failed:", err);
      }
    }
  }, [screenOn, rebuild]);

  const screenTile =
    screenTiles.find((t) => t.isLocal) ||
    screenTiles.find((t) => t.identity === focusedScreenIdentity) ||
    screenTiles[0] ||
    null;

  const mainTile =
    screenTile || camTiles.find((t) => t.isLocal) || camTiles[0] || null;
  const filmstripTiles = camTiles.filter((t) => t.id !== mainTile?.id);

  const useGridView = !spotlightOn && screenTiles.length === 0;
  const gridTileCount = camTiles.length;
  const computeGridColumns = (count) => {
    if (count <= 1) return 1;
    if (count <= 4) return 2;
    if (count <= 6) return 3;
    if (count <= 9) return 3;
    if (count <= 16) return 4;
    return 5;
  };
  const gridColumns = isCompactDevice
    ? Math.min(2, computeGridColumns(gridTileCount))
    : computeGridColumns(gridTileCount);

  const MAX_VISIBLE_FILMSTRIP_TILES = 6;
  const filmstripTilesByPriority = [...filmstripTiles].sort((a, b) => {
    const aRaised = raisedHands[a.identity] ? 1 : 0;
    const bRaised = raisedHands[b.identity] ? 1 : 0;
    return bRaised - aRaised;
  });
  const visibleFilmstripTiles = filmstripTilesByPriority.slice(0, MAX_VISIBLE_FILMSTRIP_TILES);
  const filmstripOverflowCount = Math.max(0, filmstripTiles.length - MAX_VISIBLE_FILMSTRIP_TILES);

  const closePiP = useCallback(() => {
    setPipWindow((win) => {
      if (win) {
        try {
          win.close();
        } catch (_) {}
      }
      return null;
    });
    const v = pipVideoRef.current;
    if (v && document.pictureInPictureElement === v) {
      document.exitPictureInPicture().catch(() => {});
    }
  }, []);

  const openFallbackVideoPiP = useCallback(async () => {
    try {
      const el = pipVideoRef.current;
      const track = mainTile?.track;
      if (!el || !track || !document.pictureInPictureEnabled) return;
      track.attach(el);
      if (document.pictureInPictureElement !== el) {
        await el.requestPictureInPicture();
      }
    } catch (err) {
      console.warn("Fallback video PiP unavailable:", err);
    }
  }, [mainTile]);

  const openPiP = useCallback(async () => {
    if (pipWindow || userClosedPipRef.current) return;
    if (!("documentPictureInPicture" in window)) {
      openFallbackVideoPiP();
      return;
    }
    try {
      const pip = await window.documentPictureInPicture.requestWindow({
        width: 360,
        height: 260,
      });

      [...document.styleSheets].forEach((styleSheet) => {
        try {
          const rules = [...styleSheet.cssRules]
            .map((r) => r.cssText)
            .join("");
          const style = pip.document.createElement("style");
          style.textContent = rules;
          pip.document.head.appendChild(style);
        } catch (_) {
          if (styleSheet.href) {
            const link = pip.document.createElement("link");
            link.rel = "stylesheet";
            link.href = styleSheet.href;
            pip.document.head.appendChild(link);
          }
        }
      });
      pip.document.body.style.margin = "0";
      pip.document.body.style.background = "#0B0D11";
      pip.document.body.style.overflow = "hidden";

      pip.addEventListener("pagehide", () => setPipWindow(null));

      setPipWindow(pip);
    } catch (err) {
      console.warn("Document PiP failed, using fallback:", err);
      openFallbackVideoPiP();
    }
  }, [pipWindow, openFallbackVideoPiP]);

  const returnToMeeting = useCallback(() => {
    userClosedPipRef.current = true;
    closePiP();
    window.focus();
    setTimeout(() => {
      userClosedPipRef.current = false;
    }, 500);
  }, [closePiP]);

  useEffect(() => {
    performAutoEndRef.current = async (message) => {
      if (autoEndingRef.current) return;
      autoEndingRef.current = true;

      if (autoEndPollRef.current) {
        clearInterval(autoEndPollRef.current);
        autoEndPollRef.current = null;
      }
      if (participantPollRef.current) {
        clearInterval(participantPollRef.current);
        participantPollRef.current = null;
      }
      if (hardStopTimeoutRef.current) {
        clearTimeout(hardStopTimeoutRef.current);
        hardStopTimeoutRef.current = null;
      }

      setAutoEndMessage(
        message ||
          "Session duration has completed. The meeting has ended automatically.",
      );
      setAutoEndWarning(true);

      if (recording && id) {
        try {
          await stopRecordingLive(id);
        } catch (_) {}
      }

      try {
        if (roomRef.current?.localParticipant?.isScreenShareEnabled) {
          await roomRef.current.localParticipant.setScreenShareEnabled(false);
        }
      } catch (_) {}

      try {
        localAudioTrackRef.current?.stop?.();
      } catch (_) {}
      try {
        localVideoTrackRef.current?.stop?.();
      } catch (_) {}

      try {
        closePiP();
      } catch (_) {}

      clearPersistedCallState(id);

      setTimeout(() => {
        try {
          roomRef.current?.removeAllListeners?.();
        } catch (_) {}
        try {
          roomRef.current?.disconnect();
        } catch (_) {}
        navigate("/trainer/live");
      }, 3000);
    };
  });

  const sendMessage = useCallback(() => {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        user: "You (Trainer)",
        text,
        time: getTime(),
        self: true,
      },
    ]);
    setInput("");
    try {
      const payload = new TextEncoder().encode(
        JSON.stringify({ text, name: "Trainer" }),
      );
      roomRef.current?.localParticipant?.publishData(payload, {
        reliable: true,
      });
    } catch (e) {
      console.warn("data send failed:", e);
    }
  }, [input]);

  const handleEndSession = useCallback(async () => {
    autoEndingRef.current = true;
    if (autoEndPollRef.current) clearInterval(autoEndPollRef.current);
    if (participantPollRef.current) clearInterval(participantPollRef.current);
    if (hardStopTimeoutRef.current) clearTimeout(hardStopTimeoutRef.current);
    try {
      await endLiveSession(id);
    } catch (_) {}
    clearPersistedCallState(id);
    roomRef.current?.disconnect();
    navigate("/trainer/live");
  }, [id, navigate]);

  const activeDbParticipants = dbParticipants.filter(
    (p) => p.leaveTime === null || p.leaveTime === undefined,
  );

  const filteredDbParticipants = activeDbParticipants.filter((p) =>
    (p.studentEmail || "").toLowerCase().includes(participantSearch.toLowerCase()),
  );

  const identityMismatchWarnedRef = useRef(false);
  const findLiveTileForDbParticipant = useCallback(
    (p) => {
      if (!p) return null;
      const candidates = [p.identity, p.userId, p.studentId, p.id]
        .filter(Boolean)
        .map(String);
      let tile = camTiles.find(
        (t) => !t.isLocal && candidates.includes(String(t.identity)),
      );
      if (!tile && p.studentEmail) {
        const emailLc = String(p.studentEmail).toLowerCase();
        tile = camTiles.find(
          (t) =>
            !t.isLocal &&
            (String(t.name).toLowerCase() === emailLc ||
              String(t.identity).toLowerCase() === emailLc),
        );
      }
      return tile || null;
    },
    [camTiles],
  );

  const liveRemoteParticipants = camTiles.filter((t) => !t.isLocal);
  const totalLiveParticipants = liveRemoteParticipants.length + 1;

  const findDbParticipantForLiveTile = useCallback(
    (tile) => {
      if (!tile) return null;
      return (
        activeDbParticipants.find(
          (p) => findLiveTileForDbParticipant(p)?.identity === tile.identity,
        ) || null
      );
    },
    [activeDbParticipants, findLiveTileForDbParticipant],
  );

  const filteredLiveParticipants = liveRemoteParticipants.filter((t) => {
    const dbMatch = findDbParticipantForLiveTile(t);
    const label = (dbMatch?.studentEmail || t.name || t.identity || "").toLowerCase();
    return label.includes(participantSearch.toLowerCase());
  });

  const sortedLiveParticipants = [...filteredLiveParticipants].sort((a, b) => {
    const aRaised = raisedHands[a.identity] ? 1 : 0;
    const bRaised = raisedHands[b.identity] ? 1 : 0;
    return bRaised - aRaised;
  });

  const closeMoreMenu = useCallback(() => setMoreMenuOpen(false), []);
  const closeViewMenu = useCallback(() => setViewMenuOpen(false), []);
  useDismiss(moreMenuOpen, closeMoreMenu, [moreMenuBtnRef, moreMenuPanelRef]);
  useDismiss(viewMenuOpen, closeViewMenu, [viewMenuBtnRef, viewMenuPanelRef]);

  const broadcastTrainerCommand = useCallback((command, value, extra) => {
    try {
      const payload = new TextEncoder().encode(
        JSON.stringify({ type: "trainer_command", command, value, ...(extra || {}) }),
      );
      roomRef.current?.localParticipant?.publishData(payload, { reliable: true });
    } catch (e) {
      console.warn("trainer command broadcast failed:", e);
    }
  }, []);

  const stopStudentScreenShare = useCallback(
    (identity, name) => {
      broadcastTrainerCommand("stopScreenShare", true, { identity });
      pushSystem(`Stopped ${name || "a student"}'s screen share.`);
      setFocusedScreenIdentity((cur) => (cur === identity ? null : cur));
    },
    [broadcastTrainerCommand, pushSystem],
  );

  const toggleTrainerFlag = useCallback((key, onLabel, offLabel) => {
    setTrainerFlags((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      pushSystem(next[key] ? onLabel : offLabel);
      broadcastTrainerCommand(key, next[key]);
      return next;
    });
  }, [pushSystem, broadcastTrainerCommand]);

  const notifyComingSoon = useCallback((label) => {
    pushSystem(`${label} — coming soon.`);
  }, [pushSystem]);

  const approveJoinRequest = useCallback((identity) => {
    setPendingRequests((prev) => {
      const req = prev.find((r) => r.identity === identity);
      if (req) pushSystem(`${req.name} was allowed into the session.`);
      return prev.filter((r) => r.identity !== identity);
    });
    pendingIdentitiesRef.current.delete(identity);
    rebuild();
    refreshParticipants();
  }, [pushSystem, rebuild, refreshParticipants]);

  const denyJoinRequest = useCallback((identity) => {
    setPendingRequests((prev) => {
      const req = prev.find((r) => r.identity === identity);
      if (req) pushSystem(`${req.name}'s request to join was denied.`);
      return prev.filter((r) => r.identity !== identity);
    });
  }, [pushSystem]);

  const handleSidebarResizeStart = useCallback((e) => {
    e.preventDefault();
    setSidebarResizing(true);
    sidebarResizeRef.current = { startX: e.clientX, startWidth: sidebarWidth };
    const onMove = (ev) => {
      const delta = sidebarResizeRef.current.startX - ev.clientX; // sidebar is right-anchored
      const next = Math.min(520, Math.max(260, sidebarResizeRef.current.startWidth + delta));
      setSidebarWidth(next);
    };
    const onUp = () => {
      setSidebarResizing(false);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, [sidebarWidth]);

  const toggleFullscreen = useCallback(() => {
    const el = rootRef.current;
    const isCurrentlyFullscreen = !!(
      document.fullscreenElement || document.webkitFullscreenElement
    );
    if (!isCurrentlyFullscreen) {
      const request = el?.requestFullscreen || el?.webkitRequestFullscreen;
      const result = request?.call(el);
      if (result?.catch) result.catch((err) => console.warn("Fullscreen request failed:", err));
    } else {
      const exit = document.exitFullscreen || document.webkitExitFullscreen;
      const result = exit?.call(document);
      if (result?.catch) result.catch(() => {});
    }
  }, []);

  useEffect(() => {
    const onFsChange = () =>
      setIsFullscreen(!!(document.fullscreenElement || document.webkitFullscreenElement));
    document.addEventListener("fullscreenchange", onFsChange);
    document.addEventListener("webkitfullscreenchange", onFsChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFsChange);
      document.removeEventListener("webkitfullscreenchange", onFsChange);
    };
  }, []);

  const [stageZoom, setStageZoom] = useState(1);
  const stageVideoWrapRef = useRef(null);
  const zoomIn = useCallback(() => setStageZoom((z) => Math.min(2.5, +(z + 0.25).toFixed(2))), []);
  const zoomOut = useCallback(() => setStageZoom((z) => Math.max(1, +(z - 0.25).toFixed(2))), []);
  const resetZoom = useCallback(() => setStageZoom(1), []);
  useEffect(() => {
    setStageZoom(1);
  }, [mainTile?.id]);

  const expandStageTile = useCallback(() => {
    const el = stageVideoWrapRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }, []);

  const popOutStageTile = useCallback((tile) => {
    if (!tile?.track) return;
    try {
      const stream = new MediaStream([tile.track.mediaStreamTrack]);
      const w = window.open("", "_blank", "width=960,height=600");
      if (!w) return;
      w.document.title = tile.name || "Shared screen";
      w.document.body.style.cssText = "margin:0;background:#000;overflow:hidden;";
      const video = w.document.createElement("video");
      video.autoplay = true;
      video.playsInline = true;
      video.muted = true;
      video.style.cssText = "width:100vw;height:100vh;object-fit:contain;background:#000;display:block;";
      video.srcObject = stream;
      w.document.body.appendChild(video);
    } catch (e) {
      console.warn("pop-out window failed:", e);
    }
  }, []);

  const scrollFilmstrip = useCallback((dir) => {
    const el = filmstripRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 240, behavior: "smooth" });
  }, []);

  const sidebarLayoutStyle = (() => {
    switch (deviceCfg.sidebarMode) {
      case "overlayFull":
        return {
          position: "absolute",
          top: 0,
          bottom: 0,
          right: 0,
          zIndex: 40,
          width: sidebarOpen ? "100%" : 0,
        };
      case "overlayWide":
        return {
          position: "absolute",
          top: 0,
          bottom: 0,
          right: 0,
          zIndex: 40,
          width: sidebarOpen ? 340 : 0,
          maxWidth: "90%",
        };
      case "panelNarrow":
      case "panelFull":
      default:
        return {
          width: sidebarOpen ? sidebarWidth : 0,
          transition: sidebarResizing ? "none" : "width .25s ease",
        };
    }
  })();

  return (
    <div style={S.root} className="ilm-root" ref={rootRef}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:8px;height:8px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,.14);border-radius:8px}
        ::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,.24)}
        @keyframes livePulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.35;transform:scale(1.6)}}
        @keyframes recBlink{0%,100%{opacity:1}50%{opacity:.25}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideIn{from{opacity:0;transform:translateY(-16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes panelIn{from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:translateX(0)}}
        @keyframes chatFade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes menuIn{from{opacity:0;transform:translateY(-6px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes floatUp{0%{opacity:0;transform:translateY(0) scale(.6)}15%{opacity:1;transform:translateY(-10px) scale(1)}100%{opacity:0;transform:translateY(-120px) scale(1.05)}}
        @keyframes presentIn{from{opacity:0;transform:scale(.97)}to{opacity:1;transform:scale(1)}}
        .ilm-present-in{animation:presentIn .22s ease}
        .ilm-present-controls{opacity:.72;transition:opacity .15s ease;pointer-events:auto}
        .ilm-card:hover .ilm-present-controls,.ilm-present-controls:hover,.ilm-present-controls:focus-within{opacity:1}
        .ilm-present-controls.ilm-force-visible{opacity:1 !important}
        .ilm-hoverscale{transition:transform .15s ease,background .15s ease,border-color .15s ease}
        .ilm-hoverscale:hover{transform:scale(1.03)}
        .ilm-card{transition:all .2s ease}
        .ilm-filmtile{transition:transform .15s ease,border-color .15s ease}
        .ilm-filmtile:hover{transform:translateY(-2px) scale(1.02);border-color:rgba(255,255,255,.22)}
        .ilm-tcbtn{transition:transform .14s ease, filter .14s ease}
        .ilm-tcbtn:hover{transform:translateY(-2px);filter:brightness(1.12)}
        .ilm-prow:hover{background:rgba(255,255,255,.055) !important}
        .ilm-root button{font-family:'Inter',sans-serif}
      `}</style>

      {autoEndWarning && (
        <div style={S.autoEndToast}>
          <span style={{ fontSize: 16 }}>⏱️</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13 }}>Session Ended</div>
            <div style={{ fontSize: 11, opacity: 0.85 }}>{autoEndMessage}</div>
          </div>
        </div>
      )}

      {/* ══════════════ TOP HEADER ══════════════ */}
      <div style={{ ...S.topBar, ...(isCompactDevice ? S.topBarCompact : null) }}>
        <div style={S.topLeft}>
          <div style={S.liveBadge}>
            <span style={S.liveDot} />
            LIVE
          </div>
          <div style={S.timerPill}>{timer}</div>
          <button
            className="ilm-hoverscale"
            style={{
              ...S.recPill,
              opacity: recToggling ? 0.6 : 1,
              cursor: recToggling ? "not-allowed" : "pointer",
              color: recording ? "#f87171" : "#8b90a0",
            }}
            onClick={toggleRecording}
            disabled={recToggling}
            title={recording ? "Stop recording" : "Start recording"}
          >
            <Circle size={8} fill="currentColor" style={recording ? { animation: "recBlink 1.4s infinite" } : null} />
            {!isCompactDevice && (recToggling ? "…" : recording ? "REC" : "Record")}
          </button>
          {!deviceCfg.hideHeaderExtras && (
            <div style={S.pillDark}>
              <Users size={13} strokeWidth={2.25} />
              Participants
              <span style={S.pillDivider} />
              <Video size={13} strokeWidth={2.25} />
              {totalLiveParticipants}
            </div>
          )}
          {!deviceCfg.hideClassName && (
            <span style={S.classLabel}>
              Class: <span style={S.classLink}>{sessionTitle}</span>
            </span>
          )}
        </div>

        <div style={S.topRight}>
          {!deviceCfg.hideHeaderExtras && (
            <div style={S.signalPill} title="Connection stable">
              <Wifi size={13} strokeWidth={2.25} />
              98%
            </div>
          )}
          {!isCompactDevice && (
            <div style={{ position: "relative" }}>
              <button
                ref={viewMenuBtnRef}
                className="ilm-hoverscale"
                style={S.iconTextBtn}
                onClick={() => setViewMenuOpen((v) => !v)}
              >
                <LayoutGrid size={14} strokeWidth={2.25} />
                View
                <ChevronDown size={12} />
              </button>
              {viewMenuOpen && (
                <div ref={viewMenuPanelRef} style={S.smallMenu}>
                  <button
                    style={S.smallMenuItem}
                    onClick={() => {
                      setSpotlightOn(true);
                      setViewMenuOpen(false);
                    }}
                  >
                    <Pin size={13} /> Spotlight view
                  </button>
                  <button
                    style={S.smallMenuItem}
                    onClick={() => {
                      setSpotlightOn(false);
                      setViewMenuOpen(false);
                    }}
                  >
                    <LayoutGrid size={13} /> Tile view
                  </button>
                </div>
              )}
            </div>
          )}
          {!isCompactDevice && (
            <button
              className="ilm-hoverscale"
              style={S.iconBtn}
              onClick={toggleFullscreen}
              title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? (
                <Minimize2 size={15} strokeWidth={2.25} />
              ) : (
                <Maximize2 size={15} strokeWidth={2.25} />
              )}
            </button>
          )}
          {!isCompactDevice && (
            <button
              className="ilm-hoverscale"
              style={S.iconBtn}
              onClick={() => {
                setSettingsQuickOpen((v) => !v);
                notifyComingSoon("Settings");
              }}
              title="Settings"
            >
              <Settings size={15} strokeWidth={2.25} />
            </button>
          )}
          <div style={{ position: "relative" }}>
            <button
              ref={moreMenuBtnRef}
              className="ilm-hoverscale"
              style={S.iconBtn}
              onClick={() => setMoreMenuOpen((v) => !v)}
              title="More"
            >
              <MoreVertical size={15} strokeWidth={2.25} />
            </button>
            {moreMenuOpen && (
              <div ref={moreMenuPanelRef} style={{ ...S.smallMenu, right: 0, left: "auto" }}>
                <button
                  style={S.smallMenuItem}
                  onClick={() => {
                    pipWindow ? returnToMeeting() : openPiP();
                    setMoreMenuOpen(false);
                  }}
                >
                  <PictureInPicture2 size={13} /> {pipWindow ? "Return from pop-out" : "Pop out (PiP)"}
                </button>
                <button
                  style={S.smallMenuItem}
                  onClick={() => {
                    enableAllAudio();
                    setMoreMenuOpen(false);
                  }}
                >
                  <Wifi size={13} /> Re-enable audio
                </button>
              </div>
            )}
          </div>
          <button className="ilm-hoverscale" style={S.endBtn} onClick={handleEndSession}>
            <PhoneOff size={14} strokeWidth={2.25} />
            {!isCompactDevice && "End Class"}
          </button>
        </div>
      </div>

      {recError && (
        <div style={S.recErrorBar}>⚠️ {recError}</div>
      )}

      {/* ══════════════ BODY ══════════════ */}
      <div style={S.body}>
        <div style={S.videoArea}>
          {connected ? (
            <>
              {useGridView ? (
                <div style={{ ...S.gridWrap, ...(isCompactDevice ? S.gridWrapCompact : null) }}>
                  <div
                    style={{
                      ...S.videoGrid,
                      gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
                    }}
                  >
                    {camTiles.map((t) => (
                      <div key={t.id} className="ilm-card" style={S.gridTile}>
                        <VideoTile
                          tile={t}
                          device={device}
                          handRaised={!!raisedHands[t.identity]}
                          tileFloaters={floaters.filter((f) => f.identity === t.identity)}
                        />
                        {t.isLocal && (
                          <div style={S.gridHostChip}>
                            You (Trainer) <span style={S.hostChipBadge}>Host</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    className="ilm-hoverscale"
                    style={{ ...S.spotlightBtn, top: 14, right: 14 }}
                    onClick={() => setSpotlightOn(true)}
                  >
                    <Pin size={12} strokeWidth={2.4} />
                    Switch to Spotlight
                  </button>
                </div>
              ) : (
                <div style={{ ...S.stageWrap, ...(isCompactDevice ? S.stageWrapCompact : null) }}>
                  {mainTile?.isScreen ? (
                    <div
                      style={{
                        ...S.presentRow,
                        ...(isCompactDevice ? S.presentRowCompact : null),
                      }}
                    >
                      <div
                        style={S.presentStage}
                        className="ilm-card ilm-present-in"
                        key={mainTile.id /* re-trigger the fade/scale-in on presenter switch */}
                        ref={stageVideoWrapRef}
                      >
                        <VideoTile
                          tile={mainTile}
                          device={device}
                          large
                          zoom={stageZoom}
                          handRaised={!!raisedHands[mainTile?.identity]}
                          tileFloaters={floaters.filter((f) => f.identity === mainTile?.identity)}
                        />

                        <div style={S.presentingLabel}>
                          <ScreenShare size={11} strokeWidth={2.4} />
                          {mainTile.isLocal ? "You are presenting" : mainTile.name}
                        </div>

                        <button
                          className="ilm-hoverscale"
                          style={{ ...S.spotlightBtn, ...(spotlightOn ? S.spotlightBtnOn : null) }}
                          onClick={() => setSpotlightOn((v) => !v)}
                          title={spotlightOn ? "Show a balanced layout" : "Enlarge the shared screen"}
                        >
                          <Pin size={12} strokeWidth={2.4} />
                          Spotlight {spotlightOn ? "On" : "Off"}
                        </button>

                        <div
                          style={S.presentControls}
                          className={`ilm-present-controls${isFullscreen ? " ilm-force-visible" : ""}`}
                        >
                          <button
                            className="ilm-hoverscale"
                            style={S.presentCtrlBtn}
                            onClick={zoomOut}
                            disabled={stageZoom <= 1}
                            title="Zoom out"
                          >
                            <ZoomOut size={15} strokeWidth={2.2} />
                          </button>
                          <button
                            className="ilm-hoverscale"
                            style={S.presentCtrlZoomLabel}
                            onClick={resetZoom}
                            title="Reset zoom"
                          >
                            {Math.round(stageZoom * 100)}%
                          </button>
                          <button
                            className="ilm-hoverscale"
                            style={S.presentCtrlBtn}
                            onClick={zoomIn}
                            disabled={stageZoom >= 2.5}
                            title="Zoom in"
                          >
                            <ZoomIn size={15} strokeWidth={2.2} />
                          </button>
                          <span style={S.presentCtrlDivider} />
                          <button
                            className="ilm-hoverscale"
                            style={S.presentCtrlBtn}
                            onClick={() => popOutStageTile(mainTile)}
                            title="Open in new window"
                          >
                            <ExternalLink size={15} strokeWidth={2.2} />
                          </button>
                          <button
                            className="ilm-hoverscale"
                            style={S.presentCtrlBtn}
                            onClick={expandStageTile}
                            title="Full screen"
                          >
                            <Maximize size={15} strokeWidth={2.2} />
                          </button>
                        </div>
                      </div>

                      {filmstripTiles.length > 0 && (
                        <div
                          style={{
                            ...S.presentSidebar,
                            width: spotlightOn ? 96 : isCompactDevice ? 84 : 208,
                          }}
                          className="ilm-scroll-y"
                        >
                          {visibleFilmstripTiles.map((t) => (
                            <div
                              key={t.id}
                              className="ilm-filmtile"
                              style={S.presentSidebarTile}
                              onClick={() => t.identity && setFocusedScreenIdentity(t.identity)}
                            >
                              <VideoTile
                                tile={t}
                                device={device}
                                small
                                hideNameTag={spotlightOn}
                                handRaised={!!raisedHands[t.identity]}
                                tileFloaters={floaters.filter((f) => f.identity === t.identity)}
                              />
                            </div>
                          ))}
                          {filmstripOverflowCount > 0 && (
                            <div
                              className="ilm-filmtile"
                              style={{ ...S.presentSidebarTile, ...S.filmstripOverflowTile }}
                              title={`${filmstripOverflowCount} more participant${filmstripOverflowCount === 1 ? "" : "s"}`}
                            >
                              +{filmstripOverflowCount}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      {/* ── Task 1: Trainer main video stage — Google Meet /
                          Zoom style card. `mainStageOuter` centers and
                          pads the stage inside the available area;
                          `mainStage` is a capped-width, deeply-rounded,
                          bordered, shadowed 16:9 card instead of an
                          edge-to-edge flat rectangle. VideoTile inside
                          still uses object-fit: cover for the camera
                          feed and centers the avatar when the camera is
                          off — no logic changed, styling only. */}
                      <div style={S.mainStageOuter}>
                        <div style={S.mainStage} className="ilm-card">
                          <VideoTile
                            tile={mainTile}
                            device={device}
                            large
                            handRaised={!!raisedHands[mainTile?.identity]}
                            tileFloaters={floaters.filter((f) => f.identity === mainTile?.identity)}
                          />
                          {mainTile?.isLocal && (
                            <div style={S.hostChip}>
                              You (Trainer) <span style={S.hostChipBadge}>Host</span>
                            </div>
                          )}
                          <button
                            className="ilm-hoverscale"
                            style={{ ...S.spotlightBtn, ...(spotlightOn ? S.spotlightBtnOn : null) }}
                            onClick={() => setSpotlightOn((v) => !v)}
                          >
                            <Pin size={12} strokeWidth={2.4} />
                            Spotlight {spotlightOn ? "On" : "Off"}
                          </button>
                        </div>
                      </div>

                      {(filmstripTiles.length > 0) && (
                        <div style={S.filmstripRow}>
                          <button className="ilm-hoverscale" style={S.filmArrow} onClick={() => scrollFilmstrip(-1)}>
                            <ChevronLeft size={14} />
                          </button>
                          <div
                            ref={filmstripRef}
                            style={{ ...S.filmstrip, ...(isCompactDevice ? S.filmstripCompact : null) }}
                          >
                            {visibleFilmstripTiles.map((t) => (
                              <div
                                key={t.id}
                                className="ilm-filmtile"
                                style={{
                                  ...S.filmstripTile,
                                  width: deviceCfg.filmstripTile.width,
                                  height: deviceCfg.filmstripTile.height,
                                }}
                              >
                                <VideoTile
                                  tile={t}
                                  device={device}
                                  small
                                  handRaised={!!raisedHands[t.identity]}
                                  tileFloaters={floaters.filter((f) => f.identity === t.identity)}
                                />
                              </div>
                            ))}
                            {filmstripOverflowCount > 0 && (
                              <div
                                className="ilm-filmtile"
                                style={{
                                  ...S.filmstripTile,
                                  ...S.filmstripOverflowTile,
                                  width: deviceCfg.filmstripTile.width,
                                  height: deviceCfg.filmstripTile.height,
                                }}
                                title={`${filmstripOverflowCount} more participant${filmstripOverflowCount === 1 ? "" : "s"}`}
                                onClick={() => setSpotlightOn(false)}
                              >
                                +{filmstripOverflowCount}
                              </div>
                            )}
                          </div>
                          <button className="ilm-hoverscale" style={S.filmArrow} onClick={() => scrollFilmstrip(1)}>
                            <ChevronRight size={14} />
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              <div style={S.audioLayer} aria-hidden="true">
                {remoteAudioTracks.map((a) => (
                  <RemoteAudio key={a.id} track={a.track} onBlocked={() => setAudioBlocked(true)} />
                ))}
              </div>

              {audioBlocked && (
                <button className="ilm-hoverscale" style={S.enableAudioBtn} onClick={enableAllAudio}>
                  🔊 Click to enable audio
                </button>
              )}

              {chatOpen && (
                <div style={{ ...S.floatingChat, ...(isCompactDevice ? S.floatingChatCompact : null) }}>
                  <div style={S.chatHead}>
                    <span style={S.chatHeadTitle}>Live Chat</span>
                    <span style={S.chatOnline}>{totalLiveParticipants} online</span>
                    <button style={S.chatCloseBtn} onClick={() => setChatOpen(false)}>
                      <X size={14} strokeWidth={2.25} />
                    </button>
                  </div>
                  <div style={S.msgList}>
                    {messages.map((m) => (
                      <div key={m.id} style={m.system ? S.sysRow : { ...S.msgBlock, ...(m.self ? { alignItems: "flex-end" } : null) }}>
                        {m.system ? (
                          <div style={S.sysBubble}>{m.text}</div>
                        ) : (
                          <>
                            <span style={S.msgUser}>
                              {m.user} <span style={S.msgTime}>{m.time}</span>
                            </span>
                            <div style={{ ...S.msgBubble, ...(m.self ? S.bubbleSelf : S.bubbleOther) }}>
                              {m.text}
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>
                  <div style={S.inputRow}>
                    <input
                      style={S.chatInput}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      placeholder="Type a message…"
                    />
                    <button className="ilm-hoverscale" style={S.sendBtn} onClick={sendMessage}>
                      <Send size={15} strokeWidth={2.25} />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div style={S.loadingBox}>
              <div style={S.spinner} />
              <p style={S.loadingText}>Starting live session…</p>
            </div>
          )}
        </div>

        {sidebarOpen && (deviceCfg.sidebarMode === "panelNarrow" || deviceCfg.sidebarMode === "panelFull") && (
          <div
            onMouseDown={handleSidebarResizeStart}
            onMouseEnter={() => setSidebarResizeHover(true)}
            onMouseLeave={() => setSidebarResizeHover(false)}
            title="Drag to resize"
            style={{
              flexShrink: 0,
              width: 10,
              marginLeft: -5,
              marginRight: -5,
              cursor: "col-resize",
              zIndex: 6,
              background: "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: sidebarResizing || sidebarResizeHover ? 4 : 3,
                height: 56,
                borderRadius: 999,
                background: sidebarResizing
                  ? "#3b82f6"
                  : sidebarResizeHover
                    ? "rgba(255,255,255,.55)"
                    : "rgba(255,255,255,.18)",
                boxShadow: sidebarResizing ? "0 0 0 4px rgba(59,130,246,.18)" : "none",
                transition: "background .15s, width .15s, box-shadow .15s",
              }}
            />
          </div>
        )}


        {/* ══════════════ RIGHT SIDEBAR: Trainer Controls + Participants ══════════════ */}
        <div style={{ ...S.sidebar, ...sidebarLayoutStyle }}>
          {sidebarOpen && (
            <div style={{ ...S.sidebarInner, animation: "panelIn .2s ease" }}>
              <div style={S.panelBlock}>
                <div style={S.panelHead}>
                  <span style={S.panelTitle}>Trainer Controls</span>
                  <button style={S.sidebarCloseBtn} onClick={() => setSidebarOpen(false)}>
                    <X size={14} strokeWidth={2.25} />
                  </button>
                </div>
                <div style={S.tcGrid}>
                  <TCBtn
                    icon={<MicOff size={16} />}
                    label="Mute All"
                    tone="red"
                    onClick={() => {
                      setTrainerFlags((p) => ({ ...p, allMuted: true }));
                      pushSystem("All participants muted.");
                      broadcastTrainerCommand("allMuted", true);
                    }}
                  />
                  <TCBtn
                    icon={<Mic size={16} />}
                    label="Unmute All"
                    tone="green"
                    onClick={() => {
                      setTrainerFlags((p) => ({ ...p, allMuted: false }));
                      pushSystem("Requested all participants to unmute.");
                      broadcastTrainerCommand("allMuted", false);
                      broadcastTrainerCommand("requestUnmuteAll", true);
                    }}
                  />
                  {/* Camera Enable/Disable — Task 2. Kept as two separate
                      buttons, each explicitly sets/broadcasts its own
                      target state (never a toggle), so click order never
                      matters and both directions are always reliable. */}
                  <TCBtn
                    icon={<VideoOff size={16} />}
                    label="Disable Cameras"
                    tone="red"
                    onClick={() => {
                      setTrainerFlags((p) => ({ ...p, camerasDisabled: true }));
                      pushSystem("All cameras disabled.");
                      broadcastTrainerCommand("camerasDisabled", true);
                    }}
                  />
                  <TCBtn
                    icon={<Video size={16} />}
                    label="Enable Cameras"
                    tone="green"
                    onClick={() => {
                      setTrainerFlags((p) => ({ ...p, camerasDisabled: false }));
                      pushSystem("Requested all participants to enable cameras.");
                      broadcastTrainerCommand("camerasDisabled", false);
                    }}
                  />
                  <TCBtn
                    icon={<Hand size={16} />}
                    label="Lower All Hands"
                    tone="amber"
                    onClick={() => {
                      toggleTrainerFlag("handsLowered", "All raised hands lowered.", "");
                      setRaisedHands({});
                    }}
                  />
                  <TCBtn
                    icon={<MessageSquareOff size={16} />}
                    label="Disable Chat"
                    tone="red"
                    onClick={() => {
                      setTrainerFlags((p) => ({ ...p, chatDisabled: true }));
                      pushSystem("Chat disabled for participants.");
                      broadcastTrainerCommand("chatDisabled", true);
                    }}
                  />
                  <TCBtn
                    icon={<MessageSquare size={16} />}
                    label="Enable Chat"
                    tone="green"
                    onClick={() => {
                      setTrainerFlags((p) => ({ ...p, chatDisabled: false }));
                      pushSystem("Chat enabled for participants.");
                      broadcastTrainerCommand("chatDisabled", false);
                    }}
                  />
                  <TCBtn
                    icon={trainerFlags.locked ? <Lock size={16} /> : <Unlock size={16} />}
                    label="Lock Meeting"
                    tone="purple"
                    onClick={() => toggleTrainerFlag("locked", "Meeting locked — no new participants can join.", "Meeting unlocked.")}
                  />
                  <TCBtn
                    icon={<ClipboardCheck size={16} />}
                    label="Attendance"
                    tone="blue"
                    onClick={() => setAttendanceOpen(true)}
                  />
                  <TCBtn
                    icon={<Radio size={16} />}
                    label="Allow Mic Requests"
                    tone="green"
                    onClick={() => toggleTrainerFlag("micRequestsAllowed", "Mic requests are now allowed.", "Mic requests are now blocked.")}
                  />
                  <TCBtn
                    icon={<ScreenShareOff size={16} />}
                    label="Block Screen Share"
                    tone="red"
                    onClick={() => {
                      setTrainerFlags((p) => ({ ...p, screenShareBlocked: true }));
                      pushSystem("Screen sharing blocked for participants.");
                      broadcastTrainerCommand("screenShareBlocked", true);
                    }}
                  />
                  <TCBtn
                    icon={<ScreenShare size={16} />}
                    label="Unblock Screen Share"
                    tone="green"
                    onClick={() => {
                      setTrainerFlags((p) => ({ ...p, screenShareBlocked: false }));
                      pushSystem("Screen sharing allowed for participants.");
                      broadcastTrainerCommand("screenShareBlocked", false);
                    }}
                  />
                </div>
              </div>

              {screenTiles.length > 0 && (
                <div style={{ ...S.panelBlock, borderColor: "rgba(59,130,246,.3)" }}>
                  <div style={S.panelHead}>
                    <span style={S.panelTitle}>Screen Sharing ({screenTiles.length})</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: 12 }}>
                    {screenTiles.map((t) => {
                      const isFocused = t.id === mainTile?.id;
                      return (
                        <div
                          key={t.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "8px 10px",
                            borderRadius: 10,
                            background: isFocused ? "rgba(59,130,246,.12)" : "rgba(255,255,255,.03)",
                            border: isFocused ? "1px solid rgba(96,165,250,.35)" : "1px solid rgba(255,255,255,.06)",
                          }}
                        >
                          <ScreenShare size={15} color={isFocused ? "#93c5fd" : "#9ca3af"} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ ...S.pName, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {t.isLocal ? "You" : t.name.replace(" is presenting", "")}
                            </div>
                            <div style={S.pJoinedText}>{isFocused ? "On stage now" : "Tap to focus"}</div>
                          </div>
                          {!isFocused && (
                            <button
                              className="ilm-hoverscale"
                              onClick={() => setFocusedScreenIdentity(t.identity)}
                              title="Show on main stage"
                              style={{
                                display: "flex", alignItems: "center", justifyContent: "center",
                                width: 30, height: 30, borderRadius: 8, cursor: "pointer",
                                border: "1px solid rgba(96,165,250,.35)", background: "rgba(59,130,246,.12)", color: "#93c5fd",
                              }}
                            >
                              <Pin size={14} />
                            </button>
                          )}
                          {!t.isLocal && (
                            <button
                              className="ilm-hoverscale"
                              onClick={() => stopStudentScreenShare(t.identity, t.name.replace(" is presenting", ""))}
                              title="Stop this share"
                              style={{
                                display: "flex", alignItems: "center", justifyContent: "center",
                                width: 30, height: 30, borderRadius: 8, cursor: "pointer",
                                border: "1px solid rgba(239,68,68,.4)", background: "rgba(239,68,68,.14)", color: "#f87171",
                              }}
                            >
                              <MonitorX size={14} />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {pendingRequests.length > 0 && (
                <div style={{ ...S.panelBlock, borderColor: "rgba(245,158,11,.35)" }}>
                  <div style={S.panelHead}>
                    <span style={S.panelTitle}>Join Requests ({pendingRequests.length})</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: 12 }}>
                    {pendingRequests.map((r) => (
                      <div
                        key={r.identity}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "8px 10px",
                          borderRadius: 10,
                          background: "rgba(245,158,11,.08)",
                          border: "1px solid rgba(245,158,11,.25)",
                        }}
                      >
                        <div style={{ ...S.pAv, background: "linear-gradient(135deg,#f59e0b,#f97316)" }}>
                          {(r.name?.[0] || "?").toUpperCase()}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ ...S.pName, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {r.name}
                          </div>
                          <div style={S.pJoinedText}>Wants to join · {r.time}</div>
                        </div>
                        <button
                          onClick={() => approveJoinRequest(r.identity)}
                          title="Allow"
                          style={{
                            display: "flex", alignItems: "center", justifyContent: "center",
                            width: 30, height: 30, borderRadius: 8, cursor: "pointer",
                            border: "1px solid rgba(34,197,94,.4)", background: "rgba(34,197,94,.14)", color: "#4ade80",
                          }}
                        >
                          <UserCheck size={15} />
                        </button>
                        <button
                          onClick={() => denyJoinRequest(r.identity)}
                          title="Deny"
                          style={{
                            display: "flex", alignItems: "center", justifyContent: "center",
                            width: 30, height: 30, borderRadius: 8, cursor: "pointer",
                            border: "1px solid rgba(239,68,68,.4)", background: "rgba(239,68,68,.14)", color: "#f87171",
                          }}
                        >
                          <UserX size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ ...S.panelBlock, flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
                <div style={S.panelHead}>
                  <span style={S.panelTitle}>Participants ({totalLiveParticipants})</span>
                </div>
                <div style={S.searchRow}>
                  <Search size={14} color="#6B7280" />
                  <input
                    style={S.searchInput}
                    placeholder="Search participants"
                    value={participantSearch}
                    onChange={(e) => setParticipantSearch(e.target.value)}
                  />
                </div>
                <div style={S.peopleList}>
                  <div style={S.pRow} className="ilm-prow">
                    <div style={{ ...S.pAv, background: "linear-gradient(135deg,#2563EB,#60a5fa)" }}>T</div>
                    <span style={S.pName}>You (Trainer)</span>
                    <span style={S.hostTag}>Host</span>
                    {micOn ? <Mic size={13} color="#8b90a0" /> : <MicOff size={13} color="#f87171" />}
                    {camOn ? <Video size={13} color="#8b90a0" /> : <VideoOff size={13} color="#f87171" />}
                  </div>

                  {sortedLiveParticipants.map((t) => {
                    const dbMatch = findDbParticipantForLiveTile(t);
                    const isHandRaised = !!raisedHands[t.identity];
                    const isPresenting = screenTiles.some((st) => st.identity === t.identity);
                    const displayLabel = dbMatch?.studentEmail || t.name || t.identity;
                    return (
                    <div key={t.id} style={{ ...S.pRow, position: "relative" }} className="ilm-prow">
                      <div style={{ ...S.pAv, background: "linear-gradient(135deg,#8b5cf6,#ec4899)" }}>
                        {(displayLabel?.[0] || "S").toUpperCase()}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ ...S.pName, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {displayLabel}
                        </div>
                        <div style={S.pJoinedText}>
                          {dbMatch?.joinTime
                            ? `Joined ${new Date(dbMatch.joinTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                            : "In session"}
                        </div>
                      </div>
                      {isHandRaised && (
                        <span style={S.pHandBadge} title="Hand raised">
                          <Hand size={12} strokeWidth={2.5} />
                        </span>
                      )}
                      {isPresenting && (
                        <ScreenShare size={13} color="#93c5fd" title="Presenting" />
                      )}
                      {t.micMuted ? (
                        <MicOff size={13} color="#f87171" />
                      ) : (
                        <Mic size={13} color="#8b90a0" />
                      )}
                      {t.videoMuted ? (
                        <VideoOff size={13} color="#f87171" />
                      ) : (
                        <Video size={13} color="#8b90a0" />
                      )}
                      <button
                        style={S.pMenuBtn}
                        onClick={() => setOpenParticipantMenuId((cur) => (cur === t.id ? null : t.id))}
                      >
                        <MoreVertical size={14} />
                      </button>

                      {openParticipantMenuId === t.id && (
                        <ParticipantMenu
                          onClose={() => setOpenParticipantMenuId(null)}
                          onAction={(label) => {
                            pushSystem(`${label}: ${displayLabel}`);
                            setOpenParticipantMenuId(null);
                          }}
                        />
                      )}
                    </div>
                    );
                  })}

                  {sortedLiveParticipants.length === 0 && (
                    <div style={S.emptyPeople}>
                      <Users size={26} strokeWidth={1.75} style={{ opacity: 0.3 }} />
                      <p style={S.emptyPeopleText}>
                        {participantSearch ? "No matching participants" : "No students joined yet"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {attendanceOpen &&
        createPortal(
          <div
            style={{
              position: "fixed", inset: 0, zIndex: 2000,
              background: "rgba(0,0,0,.55)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
            onClick={() => setAttendanceOpen(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                width: 380, maxHeight: "70vh", overflowY: "auto",
                background: "#111318", border: "1px solid rgba(255,255,255,.08)",
                borderRadius: 16, padding: 0,
              }}
            >
              <div style={S.panelHead}>
                <span style={S.panelTitle}>Attendance ({activeDbParticipants.length + 1})</span>
                <button style={S.sidebarCloseBtn} onClick={() => setAttendanceOpen(false)}>
                  <X size={14} strokeWidth={2.25} />
                </button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px" }}>
                  <div style={{ ...S.pAv, background: "linear-gradient(135deg,#2563EB,#60a5fa)" }}>T</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ ...S.pName, fontWeight: 600 }}>You (Trainer)</div>
                    <div style={S.pJoinedText}>Host · present since start</div>
                  </div>
                </div>
                {activeDbParticipants.map((p) => (
                  <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px" }}>
                    <div style={{ ...S.pAv, background: "linear-gradient(135deg,#8b5cf6,#ec4899)" }}>
                      {(p.studentEmail?.[0] || "S").toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ ...S.pName, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {p.studentEmail}
                      </div>
                      <div style={S.pJoinedText}>
                        Joined {p.joinTime ? new Date(p.joinTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}
                      </div>
                    </div>
                  </div>
                ))}
                {activeDbParticipants.length === 0 && (
                  <div style={S.emptyPeople}>
                    <Users size={26} strokeWidth={1.75} style={{ opacity: 0.3 }} />
                    <p style={S.emptyPeopleText}>No students joined yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* ══════════════ BOTTOM TOOLBAR ══════════════ */}
      <div style={{ ...S.ctrlBar, ...(deviceCfg.ctrlCompact ? S.ctrlBarCompact : null) }}>
        <div style={S.dockLeft}>
          <CtrlBtn icon={micOn ? <Mic size={18} strokeWidth={2.1} /> : <MicOff size={18} strokeWidth={2.1} />} label="Mic" danger={!micOn} onClick={toggleMic} compact={deviceCfg.ctrlCompact} />
          <CtrlBtn icon={camOn ? <Video size={18} strokeWidth={2.1} /> : <VideoOff size={18} strokeWidth={2.1} />} label="Camera" danger={!camOn} onClick={toggleCam} compact={deviceCfg.ctrlCompact} />
          <CtrlBtn icon={<ScreenShare size={18} strokeWidth={2.1} />} label="Screen Share" active={screenOn} onClick={toggleScreen} compact={deviceCfg.ctrlCompact} />
          <CtrlBtn
            icon={<MessageSquare size={18} strokeWidth={2.1} />}
            label="Chat"
            badge={messages.filter((m) => !m.system).length || null}
            active={chatOpen}
            onClick={() => setChatOpen((v) => !v)}
            compact={deviceCfg.ctrlCompact}
          />
          <CtrlBtn
            icon={<Users size={18} strokeWidth={2.1} />}
            label="Participants"
            badge={totalLiveParticipants}
            active={sidebarOpen}
            onClick={() => setSidebarOpen((v) => !v)}
            compact={deviceCfg.ctrlCompact}
          />
          <CtrlBtn
            icon={<Crown size={18} strokeWidth={2.1} />}
            label="Trainer"
            active={sidebarOpen}
            gold
            onClick={() => setSidebarOpen((v) => !v)}
            compact={deviceCfg.ctrlCompact}
          />
        </div>
        <button className="ilm-hoverscale" style={S.leaveBtn} onClick={handleEndSession}>
          <PhoneOff size={16} strokeWidth={2.25} />
          {!isCompactDevice && "Leave"}
        </button>
      </div>

      <video ref={pipVideoRef} muted playsInline style={{ position: "fixed", width: 1, height: 1, opacity: 0, pointerEvents: "none" }} />

      {pipWindow &&
        createPortal(
          <PipPanel
            tile={mainTile}
            timer={timer}
            micOn={micOn}
            camOn={camOn}
            onToggleMic={toggleMic}
            onToggleCam={toggleCam}
            onReturn={returnToMeeting}
          />,
          pipWindow.document.body,
        )}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────────────────────────── */

const AVATAR_SIZE_BY_DEVICE = { phone: 56, phoneLg: 64, tablet: 84, laptop: 104, desktop: 124 };
const AVATAR_FONT_BY_DEVICE = { phone: 18, phoneLg: 20, tablet: 26, laptop: 34, desktop: 42 };

const VideoTile = ({ tile, small, large, device = "desktop", handRaised, tileFloaters, zoom, hideNameTag }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !tile?.track) return;
    tile.track.attach(el);
    return () => {
      try {
        tile.track.detach(el);
      } catch (_) {}
    };
  }, [tile?.track]);

  const showVideo = !!tile?.track && !tile.videoMuted;
  const initials = (tile?.name || "?").trim().charAt(0).toUpperCase();
  const zoomScale = !small && zoom && zoom !== 1 ? zoom : null;

  return (
    <div style={small ? S.filmstripVideoWrap : S.stageVideoWrap}>
      {showVideo ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            width: "100%",
            height: "100%",
            objectFit: tile.isScreen ? "contain" : "cover",
            background: "#000",
            transform: [
              tile.isLocal && !tile.isScreen ? "scaleX(-1)" : "",
              zoomScale ? `scale(${zoomScale})` : "",
            ]
              .filter(Boolean)
              .join(" ") || "none",
            transformOrigin: "center center",
            transition: "transform .2s ease",
            display: "block",
          }}
        />
      ) : (
        <div style={S.avatarWrap}>
          <div
            style={{
              ...S.avatarCircle,
              width: small ? 36 : AVATAR_SIZE_BY_DEVICE[device] ?? 96,
              height: small ? 36 : AVATAR_SIZE_BY_DEVICE[device] ?? 96,
              fontSize: small ? 14 : AVATAR_FONT_BY_DEVICE[device] ?? 32,
            }}
          >
            {initials}
          </div>
        </div>
      )}
      {small && !hideNameTag && (
        <span style={S.tileNameTagSm}>
          {tile?.micMuted && !tile?.isScreen && <MicOff size={9} strokeWidth={2.4} style={{ marginRight: 4 }} />}
          {tile?.name}
        </span>
      )}
      {handRaised && !tile?.isScreen && (
        <span style={small ? S.tileHandBadgeSm : S.tileHandBadge} title="Hand raised">
          <Hand size={small ? 11 : 14} strokeWidth={2.5} />
        </span>
      )}
      {!!tileFloaters?.length && (
        <div style={S.tileFloaterLayer} aria-hidden="true">
          {tileFloaters.map((f) => (
            <span
              key={f.id}
              style={{
                ...S.tileFloaterEmoji,
                left: `${20 + ((f.id * 37) % 60)}%`,
                fontSize: small ? 16 : 28,
              }}
            >
              {f.emoji}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

const pipCtrlBtnStyle = (danger) => ({
  width: 34,
  height: 34,
  borderRadius: 12,
  border: "none",
  background: danger ? "rgba(239,68,68,.18)" : "rgba(255,255,255,.08)",
  color: danger ? "#fca5a5" : "#e5e7eb",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
});

const PipPanel = ({ tile, timer, micOn, camOn, onToggleMic, onToggleCam, onReturn }) => (
  <div style={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column", background: "#0B0D11", fontFamily: "'Inter',sans-serif" }}>
    <div style={{ flex: 1, position: "relative", minHeight: 0 }}>
      {tile ? (
        <VideoTile tile={tile} device="phone" />
      ) : (
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b", fontSize: 12 }}>
          No active video
        </div>
      )}
      <div style={{ position: "absolute", top: 8, left: 8, display: "flex", alignItems: "center", gap: 6, background: "rgba(0,0,0,.55)", padding: "3px 9px", borderRadius: 999, fontSize: 10, fontWeight: 700, color: "#fff" }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#EF4444" }} />
        LIVE · {timer}
      </div>
    </div>
    <div style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: 10, background: "#171A21", borderTop: "1px solid rgba(255,255,255,.06)" }}>
      <button onClick={onToggleMic} style={pipCtrlBtnStyle(!micOn)}>{micOn ? <Mic size={15} /> : <MicOff size={15} />}</button>
      <button onClick={onToggleCam} style={pipCtrlBtnStyle(!camOn)}>{camOn ? <Video size={15} /> : <VideoOff size={15} />}</button>
      <button onClick={onReturn} style={{ ...pipCtrlBtnStyle(false), width: "auto", padding: "0 14px", fontSize: 11, fontWeight: 700 }}>
        Return to meeting
      </button>
    </div>
  </div>
);

const RemoteAudio = ({ track, onBlocked }) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !track) return;
    track.attach(el);
    el.autoplay = true;
    el.playsInline = true;
    const playPromise = el.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => onBlocked && onBlocked());
    }
    return () => {
      try {
        track.detach(el);
      } catch (_) {}
    };
  }, [track, onBlocked]);

  return <audio ref={ref} data-remote-audio="1" style={S.hiddenAudio} />;
};

const TC_TONES = {
  red: { bg: "rgba(239,68,68,.12)", border: "rgba(239,68,68,.28)", color: "#f87171" },
  green: { bg: "rgba(34,197,94,.12)", border: "rgba(34,197,94,.28)", color: "#4ade80" },
  amber: { bg: "rgba(251,191,36,.12)", border: "rgba(251,191,36,.28)", color: "#fbbf24" },
  purple: { bg: "rgba(139,92,246,.14)", border: "rgba(139,92,246,.3)", color: "#a78bfa" },
  blue: { bg: "rgba(37,99,235,.14)", border: "rgba(37,99,235,.3)", color: "#60a5fa" },
};

const TCBtn = ({ icon, label, tone = "blue", onClick }) => {
  const t = TC_TONES[tone] || TC_TONES.blue;
  return (
    <button
      className="ilm-tcbtn"
      onClick={onClick}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        padding: "12px 6px",
        borderRadius: 14,
        background: t.bg,
        border: `1px solid ${t.border}`,
        color: t.color,
        cursor: "pointer",
        fontSize: 10.5,
        fontWeight: 700,
        textAlign: "center",
        lineHeight: 1.2,
        fontFamily: "'Inter',sans-serif",
      }}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

const ParticipantMenu = ({ onClose, onAction }) => {
  const ref = useRef(null);
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handler, true);
    return () => document.removeEventListener("mousedown", handler, true);
  }, [onClose]);

  const items = [
    { label: "Mute", icon: <MicOff size={13} /> },
    { label: "Unmute", icon: <Mic size={13} /> },
    { label: "Disable Camera", icon: <VideoOff size={13} /> },
    { label: "Enable Camera", icon: <Video size={13} /> },
    { label: "Spotlight", icon: <Pin size={13} /> },
    { label: "Remove Participant", icon: <Trash2 size={13} />, danger: true },
  ];

  return (
    <div ref={ref} style={S.participantMenu}>
      {items.map((it) => (
        <button
          key={it.label}
          style={{ ...S.participantMenuItem, ...(it.danger ? { color: "#f87171" } : null) }}
          onClick={() => onAction(it.label)}
        >
          {it.icon}
          {it.label}
        </button>
      ))}
    </div>
  );
};

const CtrlBtn = ({ icon, label, active, danger, gold, badge, onClick, compact }) => {
  const [hov, setHov] = useState(false);
  const bg = danger
    ? hov ? "rgba(239,68,68,.28)" : "rgba(239,68,68,.16)"
    : gold && active
      ? hov ? "rgba(251,191,36,.32)" : "rgba(251,191,36,.2)"
      : active
        ? hov ? "rgba(37,99,235,.32)" : "rgba(37,99,235,.2)"
        : hov ? "rgba(255,255,255,.12)" : "rgba(255,255,255,.05)";
  const col = danger ? "#fca5a5" : gold && active ? "#fbbf24" : active ? "#93c5fd" : "#E5E7EB";
  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={onClick}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        title={label}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 3,
          background: bg,
          color: col,
          border: gold && active ? "1px solid rgba(251,191,36,.4)" : "1px solid transparent",
          borderRadius: 12,
          padding: compact ? "8px 10px" : "8px 16px",
          cursor: "pointer",
          transition: "all .15s ease",
          flexShrink: 0,
          minWidth: compact ? 48 : 64,
        }}
      >
        {icon}
        {!compact && <span style={{ fontSize: 10, fontWeight: 600 }}>{label}</span>}
      </button>
      {!!badge && <span style={S.ctrlBadge}>{badge}</span>}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   DESIGN TOKENS + STYLES
───────────────────────────────────────────────────────────── */
const S = {
  root: {
    position: "fixed",
    inset: 0,
    zIndex: 9999,
    display: "flex",
    flexDirection: "column",
    background: "#0B0D11",
    color: "#FFFFFF",
    fontFamily: "'Inter','Segoe UI',sans-serif",
    overflow: "hidden",
  },
  autoEndToast: {
    position: "fixed",
    top: 64,
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 99999,
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "14px 24px",
    borderRadius: 16,
    background: "linear-gradient(135deg,#dc2626,#EF4444)",
    color: "#fff",
    boxShadow: "0 12px 36px rgba(239,68,68,0.4)",
    animation: "slideIn 0.35s ease",
    minWidth: 300,
  },
  topBar: {
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 20px",
    background: "#0F1116",
    borderBottom: "1px solid rgba(255,255,255,.06)",
    zIndex: 10,
    gap: 12,
    flexWrap: "wrap",
  },
  topBarCompact: { padding: "8px 10px", gap: 6 },
  topLeft: { display: "flex", alignItems: "center", gap: 8, minWidth: 0, flexWrap: "wrap" },
  topRight: { display: "flex", alignItems: "center", gap: 6, flexShrink: 0 },
  recErrorBar: {
    flexShrink: 0,
    fontSize: 11,
    color: "#fca5a5",
    background: "rgba(239,68,68,.1)",
    borderBottom: "1px solid rgba(239,68,68,.2)",
    padding: "5px 20px",
  },
  liveBadge: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    padding: "6px 12px",
    borderRadius: 8,
    background: "#EF4444",
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: "0.06em",
    color: "#fff",
  },
  liveDot: { width: 6, height: 6, borderRadius: "50%", background: "#fff", animation: "livePulse 1.2s ease-in-out infinite", display: "inline-block" },
  timerPill: {
    fontFamily: "monospace",
    fontSize: 13,
    fontWeight: 600,
    color: "#E5E7EB",
    background: "#171A21",
    border: "1px solid rgba(255,255,255,.06)",
    borderRadius: 8,
    padding: "6px 10px",
    letterSpacing: 0.4,
  },
  recPill: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "#171A21",
    border: "1px solid rgba(255,255,255,.06)",
    borderRadius: 8,
    padding: "6px 12px",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.04em",
  },
  pillDark: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    background: "#171A21",
    border: "1px solid rgba(255,255,255,.06)",
    borderRadius: 8,
    padding: "6px 12px",
    fontSize: 12,
    fontWeight: 600,
    color: "#cbd0da",
  },
  pillDivider: { width: 1, height: 12, background: "rgba(255,255,255,.14)" },
  classLabel: { fontSize: 12.5, fontWeight: 500, color: "#8b90a0" },
  classLink: { color: "#60a5fa", fontWeight: 700 },
  signalPill: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    fontWeight: 700,
    color: "#4ade80",
    background: "#171A21",
    border: "1px solid rgba(255,255,255,.06)",
    borderRadius: 8,
    padding: "6px 10px",
  },
  iconTextBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "#171A21",
    border: "1px solid rgba(255,255,255,.06)",
    borderRadius: 8,
    padding: "7px 12px",
    color: "#cbd0da",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
  },
  iconBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 32,
    height: 32,
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,.06)",
    background: "#171A21",
    color: "#B4B9C7",
    cursor: "pointer",
  },
  smallMenu: {
    position: "absolute",
    top: "calc(100% + 8px)",
    left: 0,
    background: "#171A21",
    border: "1px solid rgba(255,255,255,.08)",
    borderRadius: 12,
    padding: 6,
    minWidth: 200,
    boxShadow: "0 16px 40px rgba(0,0,0,.5)",
    zIndex: 60,
    display: "flex",
    flexDirection: "column",
    gap: 2,
    animation: "menuIn .14s ease",
  },
  smallMenuItem: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "none",
    border: "none",
    color: "#cbd0da",
    fontSize: 12.5,
    fontWeight: 600,
    padding: "9px 10px",
    borderRadius: 8,
    cursor: "pointer",
    textAlign: "left",
  },
  endBtn: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    padding: "8px 16px",
    borderRadius: 8,
    border: "none",
    background: "#EF4444",
    color: "#fff",
    fontSize: 12.5,
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 4px 14px rgba(239,68,68,.3)",
  },
  body: { flex: 1, display: "flex", overflow: "hidden", minHeight: 0, position: "relative" },
  videoArea: { flex: 1, position: "relative", overflow: "hidden", minWidth: 0, background: "#0B0D11" },
  stageWrap: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", gap: 14, padding: "20px" },
  stageWrapCompact: { padding: "8px", gap: 8 },
  gridWrap: { position: "absolute", inset: 0, padding: "16px", overflowY: "auto" },
  gridWrapCompact: { padding: "8px" },
  videoGrid: {
    display: "grid",
    gap: 12,
    gridAutoRows: "minmax(140px, 1fr)",
    height: "100%",
    alignContent: "center",
  },
  gridTile: {
    position: "relative",
    borderRadius: 16,
    overflow: "hidden",
    background: "#050608",
    border: "1px solid rgba(255,255,255,.08)",
    boxShadow: "0 12px 30px rgba(0,0,0,.35)",
    aspectRatio: "16 / 10",
  },
  gridHostChip: {
    position: "absolute",
    top: 10,
    left: 10,
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "rgba(11,13,17,.68)",
    backdropFilter: "blur(6px)",
    color: "#fff",
    fontSize: 11,
    fontWeight: 600,
    padding: "4px 9px",
    borderRadius: 7,
  },
  /* ── Task 1: Trainer Main Video Stage — Google Meet / Zoom style ──
     `mainStageOuter` is the flex-centered "room" the card sits inside,
     with real breathing room on every side instead of the card
     stretching edge-to-edge. `mainStage` is a capped-width (so it
     reads as a framed card on wide screens, not a full-bleed panel),
     16:9, deeply-rounded, clearly-bordered, drop-shadowed tile — the
     same visual language as the reference student tiles in Image 2.
     Nothing here touches LiveKit/track/state logic — style only. */
  mainStageOuter: {
    flex: 1,
    minHeight: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    padding: "10px 6px",
  },
  mainStage: {
    position: "relative",
    width: "100%",
    maxWidth: 1040,
    maxHeight: "100%",
    aspectRatio: "16 / 9",
    borderRadius: 24,
    overflow: "hidden",
    background: "linear-gradient(180deg,#161922,#0c0e13)",
    border: "1px solid rgba(255,255,255,.14)",
    boxShadow:
      "0 30px 70px rgba(0,0,0,.55), 0 0 0 1px rgba(255,255,255,.05), inset 0 0 0 1px rgba(255,255,255,.03)",
  },
  stageVideoWrap: { width: "100%", height: "100%", position: "relative", background: "#000", borderRadius: 22, overflow: "hidden" },
  hostChip: {
    position: "absolute",
    top: 14,
    left: 14,
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "rgba(11,13,17,.68)",
    backdropFilter: "blur(6px)",
    color: "#fff",
    fontSize: 12.5,
    fontWeight: 600,
    padding: "6px 12px",
    borderRadius: 8,
  },
  hostChipBadge: {
    fontSize: 10,
    fontWeight: 800,
    color: "#93c5fd",
    background: "rgba(37,99,235,.22)",
    border: "1px solid rgba(96,165,250,.25)",
    borderRadius: 6,
    padding: "2px 8px",
  },
  spotlightBtn: {
    position: "absolute",
    top: 14,
    right: 14,
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "rgba(11,13,17,.58)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,.12)",
    color: "#cbd0da",
    fontSize: 11.5,
    fontWeight: 700,
    padding: "7px 13px",
    borderRadius: 999,
    cursor: "pointer",
    boxShadow: "0 6px 18px rgba(0,0,0,.3)",
  },
  spotlightBtnOn: { color: "#93c5fd", border: "1px solid rgba(96,165,250,.4)", background: "rgba(37,99,235,.22)" },
  presentingChip: {
    position: "absolute",
    top: 14,
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    alignItems: "center",
    gap: 7,
    background: "rgba(11,13,17,.72)",
    backdropFilter: "blur(6px)",
    border: "1px solid rgba(255,255,255,.1)",
    color: "#fff",
    fontSize: 12,
    fontWeight: 700,
    padding: "6px 14px",
    borderRadius: 999,
  },
  presentRow: { flex: 1, minHeight: 0, display: "flex", flexDirection: "row", gap: 12 },
  presentRowCompact: { gap: 8 },
  presentStage: {
    flex: 1,
    minWidth: 0,
    minHeight: 0,
    borderRadius: 18,
    overflow: "hidden",
    background: "#050608",
    position: "relative",
    border: "1px solid rgba(255,255,255,.08)",
    boxShadow: "0 24px 56px rgba(0,0,0,.45), 0 0 0 1px rgba(255,255,255,.02)",
  },
  presentingLabel: {
    position: "absolute",
    top: 12,
    left: 12,
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "rgba(11,13,17,.55)",
    backdropFilter: "blur(8px)",
    border: "1px solid rgba(255,255,255,.08)",
    color: "#e5e7eb",
    fontSize: 11.5,
    fontWeight: 600,
    padding: "5px 10px",
    borderRadius: 999,
    zIndex: 6,
  },
  presentControls: {
    position: "absolute",
    bottom: 14,
    right: 14,
    display: "flex",
    alignItems: "center",
    gap: 4,
    background: "rgba(11,13,17,.62)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,.1)",
    borderRadius: 999,
    padding: 4,
    zIndex: 30,
  },
  presentCtrlBtn: {
    width: 30,
    height: 30,
    borderRadius: "50%",
    border: "none",
    background: "transparent",
    color: "#e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  presentCtrlZoomLabel: {
    minWidth: 40,
    height: 30,
    padding: "0 4px",
    borderRadius: 999,
    border: "none",
    background: "transparent",
    color: "#9ca3af",
    fontSize: 11,
    fontWeight: 700,
    cursor: "pointer",
  },
  presentCtrlDivider: { width: 1, height: 18, background: "rgba(255,255,255,.14)", margin: "0 2px" },
  presentSidebar: {
    flexShrink: 0,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    overflowY: "auto",
    overflowX: "hidden",
    paddingRight: 2,
    transition: "width .2s ease",
  },
  presentSidebarTile: {
    flexShrink: 0,
    width: "100%",
    aspectRatio: "16 / 10",
    borderRadius: 12,
    overflow: "hidden",
    background: "#171A21",
    border: "1px solid rgba(255,255,255,.08)",
    boxShadow: "0 8px 20px rgba(0,0,0,.35)",
    position: "relative",
    cursor: "pointer",
  },
  tileHandBadge: {
    position: "absolute",
    top: 14,
    left: 14,
    width: 30,
    height: 30,
    borderRadius: "50%",
    background: "#fbbf24",
    color: "#1a1a1a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 14px rgba(251,191,36,.45)",
    animation: "recBlink 1.4s infinite",
    zIndex: 5,
  },
  tileHandBadgeSm: {
    position: "absolute",
    top: 6,
    left: 6,
    display: "flex",
    alignItems: "center",
    gap: 3,
    fontSize: 9,
    fontWeight: 700,
    color: "#1a1a1a",
    background: "#fbbf24",
    borderRadius: 999,
    padding: "3px 5px",
    boxShadow: "0 2px 8px rgba(251,191,36,.45)",
    animation: "recBlink 1.4s infinite",
    zIndex: 5,
  },
  tileFloaterLayer: { position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 4 },
  tileFloaterEmoji: { position: "absolute", bottom: 8, animation: "floatUp 2.2s ease-out forwards" },
  filmstripRow: { flexShrink: 0, display: "flex", alignItems: "center", gap: 8 },
  filmArrow: {
    flexShrink: 0,
    width: 30,
    height: 30,
    borderRadius: "50%",
    border: "1px solid rgba(255,255,255,.08)",
    background: "#171A21",
    color: "#E5E7EB",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  filmstrip: { flex: 1, display: "flex", gap: 10, overflowX: "auto", overflowY: "hidden", padding: "2px 2px 4px", scrollbarWidth: "thin" },
  filmstripCompact: { gap: 6 },
  filmstripTile: {
    flexShrink: 0,
    width: 128,
    height: 128,
    borderRadius: 12,
    overflow: "hidden",
    background: "#171A21",
    border: "1px solid rgba(255,255,255,.08)",
    boxShadow: "0 8px 20px rgba(0,0,0,.35)",
    position: "relative",
  },
  filmstripOverflowTile: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,255,255,.06)",
    color: "#cbd0da",
    fontSize: 14,
    fontWeight: 700,
  },
  filmstripVideoWrap: { width: "100%", height: "100%", position: "relative", background: "#171A21", borderRadius: 12, overflow: "hidden" },
  audioLayer: { position: "absolute", width: 0, height: 0, overflow: "hidden" },
  hiddenAudio: { position: "absolute", width: 1, height: 1, opacity: 0, pointerEvents: "none" },
  enableAudioBtn: {
    position: "absolute",
    top: 16,
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 30,
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "9px 18px",
    borderRadius: 999,
    border: "1px solid rgba(37,99,235,.35)",
    background: "rgba(11,13,17,.92)",
    color: "#93c5fd",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 12px 32px rgba(0,0,0,.5)",
  },
  avatarWrap: { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(180deg,#181b23,#101319)" },
  avatarCircle: {
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    color: "#fff",
    background: "linear-gradient(135deg,#2563EB,#60a5fa)",
    boxShadow: "0 12px 30px rgba(37,99,235,.35)",
  },
  tileNameTagSm: {
    position: "absolute",
    bottom: 6,
    left: 6,
    fontSize: 9.5,
    color: "#fff",
    background: "rgba(11,13,17,.68)",
    backdropFilter: "blur(4px)",
    padding: "2px 7px",
    borderRadius: 6,
    pointerEvents: "none",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    maxWidth: "calc(100% - 12px)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  floatingChat: {
    position: "absolute",
    bottom: 16,
    right: 16,
    width: 320,
    maxHeight: 420,
    background: "rgba(15,17,22,.92)",
    backdropFilter: "blur(14px)",
    border: "1px solid rgba(255,255,255,.08)",
    borderRadius: 16,
    boxShadow: "0 20px 48px rgba(0,0,0,.5)",
    display: "flex",
    flexDirection: "column",
    zIndex: 25,
    animation: "chatFade .2s ease",
  },
  floatingChatCompact: { left: 8, right: 8, width: "auto", bottom: 8, maxHeight: "50vh" },
  chatHead: {
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "12px 14px",
    borderBottom: "1px solid rgba(255,255,255,.06)",
  },
  chatHeadTitle: { fontSize: 13.5, fontWeight: 700, color: "#fff" },
  chatOnline: { marginLeft: "auto", fontSize: 11, color: "#4ade80", fontWeight: 600 },
  chatCloseBtn: { background: "none", border: "none", color: "#8b90a0", cursor: "pointer", display: "flex", padding: 2 },
  msgList: { flex: 1, overflowY: "auto", padding: "12px 14px", display: "flex", flexDirection: "column", gap: 12, minHeight: 80, maxHeight: 260 },
  sysRow: { display: "flex", justifyContent: "center" },
  sysBubble: {
    fontSize: 10.5,
    color: "#8b90a0",
    background: "#171A21",
    border: "1px solid rgba(255,255,255,.06)",
    borderRadius: 10,
    padding: "5px 12px",
    fontWeight: 500,
    textAlign: "center",
  },
  msgBlock: { display: "flex", flexDirection: "column", gap: 3 },
  msgUser: { fontSize: 10, color: "#6B7280", fontWeight: 600 },
  msgTime: { color: "#4b5261", fontWeight: 500, marginLeft: 4 },
  msgBubble: { maxWidth: "90%", padding: "8px 12px", borderRadius: 14, fontSize: 12.5, color: "#FFFFFF", lineHeight: 1.45, fontWeight: 400 },
  bubbleSelf: { background: "#2563EB", alignSelf: "flex-end", borderBottomRightRadius: 4 },
  bubbleOther: { background: "#171A21", border: "1px solid rgba(255,255,255,.06)", borderBottomLeftRadius: 4 },
  inputRow: { flexShrink: 0, display: "flex", gap: 8, padding: "10px 12px", borderTop: "1px solid rgba(255,255,255,.06)" },
  chatInput: {
    flex: 1,
    background: "#171A21",
    border: "1px solid rgba(255,255,255,.08)",
    borderRadius: 999,
    padding: "9px 14px",
    color: "#FFFFFF",
    fontSize: 12.5,
    outline: "none",
  },
  sendBtn: {
    flexShrink: 0,
    background: "#2563EB",
    border: "none",
    borderRadius: 999,
    width: 36,
    height: 36,
    color: "#fff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingBox: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 },
  spinner: { width: 40, height: 40, border: "3px solid rgba(37,99,235,.2)", borderTop: "3px solid #2563EB", borderRadius: "50%", animation: "spin .8s linear infinite" },
  loadingText: { fontSize: 13, color: "#B4B9C7", fontWeight: 600 },
  sidebar: {
    flexShrink: 0,
    background: "#0F1116",
    borderLeft: "1px solid rgba(255,255,255,.06)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    transition: "width .25s ease",
  },
  sidebarInner: { flex: 1, display: "flex", flexDirection: "column", minHeight: 0, overflowY: "auto", gap: 10, padding: 12 },
  panelBlock: {
    flexShrink: 0,
    background: "#111318",
    border: "1px solid rgba(255,255,255,.06)",
    borderRadius: 16,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  panelHead: {
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 14px",
    borderBottom: "1px solid rgba(255,255,255,.06)",
  },
  panelTitle: { fontSize: 13.5, fontWeight: 700, color: "#fff" },
  sidebarCloseBtn: { display: "flex", alignItems: "center", justifyContent: "center", width: 26, height: 26, borderRadius: 8, border: "none", background: "transparent", color: "#B4B9C7", cursor: "pointer" },
  tcGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, padding: 12 },
  searchRow: {
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    gap: 8,
    margin: "10px 12px",
    background: "#171A21",
    border: "1px solid rgba(255,255,255,.06)",
    borderRadius: 10,
    padding: "8px 10px",
  },
  searchInput: { flex: 1, background: "transparent", border: "none", outline: "none", color: "#e5e7eb", fontSize: 12.5 },
  peopleList: { flex: 1, overflowY: "auto", padding: "0 10px 10px", display: "flex", flexDirection: "column", gap: 6, minHeight: 0 },
  emptyPeople: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, paddingTop: 24, paddingBottom: 24 },
  emptyPeopleText: { fontSize: 12, color: "#6B7280", marginTop: 8 },
  pRow: { display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 12, background: "#171A21", border: "1px solid rgba(255,255,255,.06)" },
  pAv: { width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, flexShrink: 0, color: "#fff" },
  pName: { flex: 1, fontSize: 12.5, color: "#E5E7EB", fontWeight: 500 },
  pJoinedText: { fontSize: 10, color: "#6B7280", marginTop: 1 },
  hostTag: { fontSize: 9.5, background: "rgba(37,99,235,.15)", color: "#93c5fd", padding: "3px 9px", borderRadius: 999, fontWeight: 700, letterSpacing: "0.04em" },
  pHandBadge: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 20,
    height: 20,
    borderRadius: "50%",
    background: "#fbbf24",
    color: "#1a1a1a",
    boxShadow: "0 2px 8px rgba(251,191,36,.45)",
    animation: "recBlink 1.4s infinite",
    flexShrink: 0,
  },
  pMenuBtn: { background: "none", border: "none", color: "#8b90a0", cursor: "pointer", display: "flex", padding: 2, flexShrink: 0 },
  participantMenu: {
    position: "absolute",
    top: "calc(100% + 4px)",
    right: 4,
    background: "#171A21",
    border: "1px solid rgba(255,255,255,.08)",
    borderRadius: 12,
    padding: 6,
    minWidth: 190,
    boxShadow: "0 16px 40px rgba(0,0,0,.5)",
    zIndex: 70,
    display: "flex",
    flexDirection: "column",
    gap: 1,
    animation: "menuIn .14s ease",
  },
  participantMenuItem: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "none",
    border: "none",
    color: "#cbd0da",
    fontSize: 12,
    fontWeight: 600,
    padding: "8px 10px",
    borderRadius: 8,
    cursor: "pointer",
    textAlign: "left",
  },
  ctrlBar: {
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    padding: "10px 20px",
    background: "#0F1116",
    borderTop: "1px solid rgba(255,255,255,.06)",
    overflowX: "auto",
  },
  ctrlBarCompact: { padding: "8px 10px" },
  dockLeft: { display: "flex", alignItems: "center", gap: 6, flexWrap: "nowrap", overflowX: "auto" },
  ctrlBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    background: "#2563EB",
    color: "#fff",
    fontSize: 9,
    fontWeight: 800,
    borderRadius: 8,
    padding: "1px 5px",
    border: "2px solid #0F1116",
    lineHeight: 1.3,
  },
  leaveBtn: {
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    gap: 7,
    padding: "10px 18px",
    borderRadius: 12,
    border: "none",
    background: "#EF4444",
    color: "#fff",
    fontSize: 12.5,
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 6px 18px rgba(239,68,68,.35)",
  },
};

export default LiveSessionControls;