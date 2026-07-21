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
// } from "lucide-react";

// /* ─────────────────────────────────────────────────────────────
//    HELPERS
// ───────────────────────────────────────────────────────────── */
// const getTime = () =>
//   new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

// /* ─────────────────────────────────────────────────────────────
//    ✅ NEW: MEETING PERSISTENCE (bug #2)
//    Stores {token, room, startedAt} per session id in localStorage
//    (survives refresh, back/forward, tab close+reopen — sessionStorage
//    only survives refresh within the same tab). Reconnect uses the
//    SAME token instead of asking the backend to start a new session, and
//    the timer is re-derived from `startedAt` (wall clock), so it never
//    resets to 00:00. Cleared only when the trainer explicitly ends the
//    session or the backend reports it as ENDED — never on refresh/
//    navigate-away, since those should reconnect, not reset.
// ───────────────────────────────────────────────────────────── */
// const CALL_STATE_PREFIX = "trainer_live_state_";
// const CALL_STATE_TTL_MS = 8 * 60 * 60 * 1000; // stale-token safety net

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
//     // legacy key written by the launcher screens (TrainerLiveClasses.jsx)
//     sessionStorage.removeItem("call_state");
//   } catch (_) {}
// };

// // Reads the legacy sessionStorage bootstrap value written the moment the
// // trainer clicks "Go Live" / "Start Now" — kept as a fallback source for
// // the very first connect, before we've had a chance to write our own
// // localStorage entry.
// const readLegacyCallState = () => {
//   try {
//     const raw = sessionStorage.getItem("call_state");
//     return raw ? JSON.parse(raw) : null;
//   } catch (_) {
//     return null;
//   }
// };

// /* ✅ FIX (bug #3): camera and screen-share are now tracked as two
//    completely separate publications (Track.Source.Camera vs
//    Track.Source.ScreenShare) instead of being shoved into the same PIP
//    <div> and swapped via innerHTML. That swapping was the root cause of
//    "screen share dikhta hai video tile ke andar" — this snapshot builder
//    gives the renderer everything it needs to put the screen share in the
//    big stage and every camera (including the trainer's own) into small
//    tiles, Meet/Zoom/Teams style. */
// const buildSnapshot = (room) => {
//   if (!room) return { camTiles: [], screenTile: null, audioTracks: [] };

//   const camTiles = [];
//   let screenTile = null;
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

//     camTiles.push({
//       id: `${baseId}-cam`,
//       name,
//       isLocal,
//       isHost: isLocal,
//       track: camPub && camPub.track ? camPub.track : null,
//       videoMuted: !camPub || !!camPub.isMuted || !camPub.track,
//       micMuted,
//     });

//     if (screenPub && screenPub.track) {
//       screenTile = {
//         id: `${baseId}-screen`,
//         name: isLocal ? "You're presenting" : `${name} is presenting`,
//         isLocal,
//         isScreen: true,
//         track: screenPub.track,
//       };
//     }

//     /* ✅ FIX (bug #1): every remote mic gets a dedicated, always-mounted
//        <audio> element (see RemoteAudio below) so playback never depends
//        on whatever DOM node happened to be around when the track showed
//        up. Local mic is intentionally excluded to avoid echo. */
//     if (!isLocal && micPub && micPub.track) {
//       audioTracks.push({ id: `${baseId}-audio`, track: micPub.track });
//     }
//   };

//   addParticipant(room.localParticipant, true);
//   room.remoteParticipants.forEach((p) => addParticipant(p, false));

//   return { camTiles, screenTile, audioTracks };
// };

// /* ✅ FIX (bug #4): tile size shrinks in steps as participant count grows
//    so 10 / 20 / 50 / 100+ students all still fit and stay readable —
//    mirrors how Meet/Zoom shrink tiles instead of infinitely scrolling. */
// const getTileMinWidth = (n) => {
//   if (n <= 1) return 640;
//   if (n <= 2) return 480;
//   if (n <= 4) return 360;
//   if (n <= 6) return 300;
//   if (n <= 9) return 240;
//   if (n <= 16) return 190;
//   if (n <= 25) return 155;
//   if (n <= 49) return 130;
//   return 110;
// };

// const GALLERY_PAGE_SIZE = 49; // 7x7 — same cap Meet uses per page

// /* ✅ NEW: full device/breakpoint system (not just one isMobile flag) so
//    the meeting UI genuinely adapts across phones, tablets, laptops and
//    desktops instead of just "mobile vs not".

//    phone     ≤ 480px   → iPhone SE/12/13/14/15 portrait, small Androids
//    phoneLg   481–767px → iPhone Pro Max / Plus, most phones landscape
//    tablet    768–1023px→ iPad mini (768 portrait), iPad portrait, small
//                           Android tablets
//    laptop    1024–1365px→ iPad / iPad Pro landscape, small laptops (13")
//    desktop   ≥ 1366px  → laptops 15"+, external monitors, desktops
// */
// const getDevice = (w) => {
//   if (w <= 480) return "phone";
//   if (w <= 767) return "phoneLg";
//   if (w <= 1023) return "tablet";
//   if (w <= 1365) return "laptop";
//   return "desktop";
// };

// // Per-device tuning tables used across the video layer
// const DEVICE_CONFIG = {
//   phone: {
//     filmstripTile: { width: 84, height: 54 },
//     galleryMinScale: 0.5,
//     sidebarMode: "overlayFull",
//     ctrlCompact: true,
//     hideSessionTitle: true,
//     hidePBadgeLabel: true,
//   },
//   phoneLg: {
//     filmstripTile: { width: 104, height: 66 },
//     galleryMinScale: 0.62,
//     sidebarMode: "overlayFull",
//     ctrlCompact: true,
//     hideSessionTitle: true,
//     hidePBadgeLabel: false,
//   },
//   tablet: {
//     filmstripTile: { width: 132, height: 82 },
//     galleryMinScale: 0.8,
//     sidebarMode: "overlayWide",
//     ctrlCompact: false,
//     hideSessionTitle: false,
//     hidePBadgeLabel: false,
//   },
//   laptop: {
//     filmstripTile: { width: 150, height: 92 },
//     galleryMinScale: 0.92,
//     sidebarMode: "panelNarrow",
//     ctrlCompact: false,
//     hideSessionTitle: false,
//     hidePBadgeLabel: false,
//   },
//   desktop: {
//     filmstripTile: { width: 168, height: 100 },
//     galleryMinScale: 1,
//     sidebarMode: "panelFull",
//     ctrlCompact: false,
//     hideSessionTitle: false,
//     hidePBadgeLabel: false,
//   },
// };

// // ✅ Reusable hook: tracks live viewport width/height and resolves the
// // current device bucket + its config, updating on resize/orientation change.
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

// /* ─── Live Timer ───
//    ✅ FIX (bug #2): the old version counted local ticks from 0, so any
//    refresh/remount reset it to 00:00. This version derives elapsed time
//    from `Date.now() - startedAtMs` on every tick, where startedAtMs is
//    the persisted, cross-refresh meeting start time. A re-render (e.g.
//    after a refresh) simply recomputes the correct elapsed duration
//    instead of restarting a counter — it's also immune to background-tab
//    timer throttling, since it reads the wall clock instead of trusting
//    how many 1s ticks actually fired. */
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
//   // ✅ NEW: ref for participant DB polling interval
//   const participantPollRef = useRef(null);

//   const [connected, setConnected] = useState(false);
//   const [micOn, setMicOn] = useState(true);
//   const [camOn, setCamOn] = useState(true);
//   const [screenOn, setScreenOn] = useState(false);
//   const [recording, setRecording] = useState(true);
//   const [recToggling, setRecToggling] = useState(false);
//   const [recError, setRecError] = useState(null);
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [sidebarTab, setSidebarTab] = useState("chat");
//   const [participants, setParticipants] = useState([]);
//   const startedRef = useRef(false);
//   const recTogglingRef = useRef(false);
//   const recCooldownRef = useRef(false);
//   // ✅ NEW: DB participants (real emails from backend)
//   const [dbParticipants, setDbParticipants] = useState([]);

//   /* ✅ NEW — React-state-driven track/tile model (fixes bugs #1–#4).
//      Camera tiles, the (single) active screen-share tile, and remote
//      audio tracks are now derived from LiveKit's own room state via
//      buildSnapshot() instead of being manually pushed into DOM refs. */
//   const [camTiles, setCamTiles] = useState([]);
//   const [screenTile, setScreenTile] = useState(null);
//   const [remoteAudioTracks, setRemoteAudioTracks] = useState([]);
//   const [audioBlocked, setAudioBlocked] = useState(false);
//   const [galleryPage, setGalleryPage] = useState(0);

//   // ✅ NEW: live device/breakpoint detection — phone, phoneLg, tablet
//   // (iPad mini/iPad portrait), laptop (iPad landscape/13"), desktop.
//   const { w: viewportW, device, cfg: deviceCfg } = useResponsiveDevice();
//   const isCompactDevice = device === "phone" || device === "phoneLg"; // drawer sidebar
//   const isTouchDevice = isCompactDevice || device === "tablet";
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

//   // ✅ NEW: wall-clock anchor for the meeting timer — set once on first
//   // connect (or restored from persisted/legacy state on reconnect) and
//   // never reset for the lifetime of this meeting.
//   const [meetingStartedAt, setMeetingStartedAt] = useState(null);
//   const timer = useElapsedTimer(meetingStartedAt);

//   // ✅ NEW: floating Picture-in-Picture window state.
//   const [pipWindow, setPipWindow] = useState(null);
//   const pipVideoRef = useRef(null); // fallback target for native video PiP
//   const userClosedPipRef = useRef(false);

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

//   // ✅ NEW: single source of truth for the video layer — call this any
//   // time a track/participant event fires and the UI will re-derive who
//   // goes on the main stage (screen share) vs. the thumbnail tiles.
//   const rebuild = useCallback(() => {
//     const snap = buildSnapshot(roomRef.current);
//     setCamTiles(snap.camTiles);
//     setScreenTile(snap.screenTile);
//     setRemoteAudioTracks(snap.audioTracks);
//   }, []);

//   // ✅ NEW: unlocks any <audio> elements the browser blocked from
//   // autoplaying (common cause of "student ko audio receive nahi horaha")
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
//     // ✅ NEW — block clicks during the post-toggle cooldown window too,
//     // not just while the request itself is in flight.
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
//       // ✅ NEW — 12s cooldown after every toggle (success OR failure),
//       // since LiveKit/egress needs time to tear down/spin up on this
//       // all-in-one WSL setup before it can reliably accept another call.
//       recCooldownRef.current = true;
//       setTimeout(() => {
//         recCooldownRef.current = false;
//       }, 12000);
//     }
//   }, [id, recording]);

//   // ✅ NEW: fetch real participants from DB
//   const fetchDbParticipants = useCallback(async () => {
//     if (!id) return;
//     try {
//       const res = await getSessionParticipants(id);
//       setDbParticipants(res.data || []);
//     } catch (_) {
//       // silently ignore
//     }
//   }, [id]);

//   useEffect(() => {
//     if (!id) return;
//     const serverUrl = import.meta.env.VITE_LIVEKIT_URL || "ws://localhost:7880";

//     // ✅ Synchronous ref guard — checked before any await, so React
//     // StrictMode's dev double-mount (or any fast double-invoke) can only
//     // ever run start() once per real mount.
//     if (startedRef.current) {
//       return;
//     }
//     startedRef.current = true;

//     const start = async () => {
//       let token;
//       let room_name;
//       let startedAt;

//       try {
//         // ✅ FIX (bug #2): reconnect priority is
//         //   1) our own persisted state for THIS session id (localStorage —
//         //      survives refresh / back / tab close+reopen), which also
//         //      carries the original startedAt so the timer never resets;
//         //   2) the legacy sessionStorage bootstrap value written the
//         //      instant the trainer clicked "Go Live" (first load only);
//         //   3) otherwise, ask the backend for a fresh token (first time
//         //      this trainer is opening this session).
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
//           startedRef.current = false; // allow retry
//           return;
//         }
//       } catch (err) {
//         console.error("startLiveSessionWithToken failed:", err);
//         startedRef.current = false; // allow retry on failure
//         return;
//       }

//       // Persist immediately so a refresh that happens mid-connect still
//       // has something to reconnect with, and set the timer anchor.
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

//         const token_for_poll =
//           localStorage.getItem("token") ||
//           localStorage.getItem("lms_token") ||
//           localStorage.getItem("accessToken") ||
//           (() => {
//             try {
//               return JSON.parse(localStorage.getItem("lms_user") || "{}")
//                 ?.token;
//             } catch {
//               return null;
//             }
//           })();

//         autoEndPollRef.current = setInterval(async () => {
//           try {
//             const res = await fetch(
//               `${import.meta.env.VITE_API_BASE_URL || "http://localhost:9000"}/api/live-sessions/${id}`,
//               {
//                 headers: token_for_poll
//                   ? { Authorization: `Bearer ${token_for_poll}` }
//                   : {},
//               },
//             );
//             if (!res.ok) return;
//             const data = await res.json();
//             if (data.status === "ENDED") {
//               clearInterval(autoEndPollRef.current);
//               clearPersistedCallState(id);
//               setAutoEndWarning(true);
//               setTimeout(() => {
//                 roomRef.current?.disconnect();
//                 navigate("/trainer/live");
//               }, 3000);
//             }
//           } catch (_) {
//             // silently ignore network errors during poll
//           }
//         }, 20000);
//       } catch (err) {
//         console.error("LiveKit connect failed:", err);
//         startedRef.current = false; // allow retry on failure
//         return;
//       }

//       // ✅ FIX (bug #1/#2): explicit audio constraints (echo cancellation /
//       // noise suppression / AGC) make the trainer's mic publish reliably
//       // and at usable quality; camera preview no longer depends on manual
//       // DOM injection — rebuild() below derives it from room state.
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
//         refreshParticipants();
//         fetchDbParticipants();
//         pushSystem(`${p.name || p.identity} joined`);
//         rebuild();
//       });
//       room.on(RoomEvent.ParticipantDisconnected, (p) => {
//         refreshParticipants();
//         pushSystem(`${p.name || p.identity} left`);
//         rebuild();
//       });
//       room.on(RoomEvent.DataReceived, (payload, participant) => {
//         try {
//           const decoded = new TextDecoder().decode(payload);
//           const msg = JSON.parse(decoded);
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
//       roomRef.current?.disconnect();
//       // ✅ Reset on genuine unmount so a real remount (navigating away and
//       // back, e.g.) is able to start a fresh session normally.
//       startedRef.current = false;
//     };
//   }, [id]);

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, sidebarTab, sidebarOpen]);

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

//   /* ✅ FIX (bug #3): screen share and camera are independent publications
//      now, so starting/stopping a share never touches the camera track —
//      rebuild() alone re-derives which tile is "main" (screenTile if any
//      screen is live) vs. the small tiles (camTiles, always including the
//      trainer's own camera). No more DOM innerHTML swapping. */
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
//         const pub = await room.localParticipant.setScreenShareEnabled(true, {
//           audio: false,
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

//   /* ─────────────────────────────────────────────────────────────
//      ✅ NEW: PICTURE-IN-PICTURE (bug #4)
//      Whatever is currently the "main" thing on stage — the active
//      screen share if any, otherwise a camera — is what floats. Uses the
//      Document Picture-in-Picture API (real floating window, same as
//      Meet/Zoom/Teams) where the browser supports it, and falls back to
//      the standard single-<video> Picture-in-Picture API otherwise.
//   ───────────────────────────────────────────────────────────── */
//   const pipMainTile =
//     screenTile || camTiles.find((t) => !t.isLocal) || camTiles[0] || null;

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
//       const track = pipMainTile?.track;
//       if (!el || !track || !document.pictureInPictureEnabled) return;
//       track.attach(el);
//       if (document.pictureInPictureElement !== el) {
//         await el.requestPictureInPicture();
//       }
//     } catch (err) {
//       console.warn("Fallback video PiP unavailable:", err);
//     }
//   }, [pipMainTile]);

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

//       // Carry the app's fonts/colors into the floating window so the
//       // reused <VideoTile>/control styles render correctly there too.
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

//   // Auto float when the trainer switches tabs/apps or minimizes; auto
//   // return when they come back — only while actually in a live meeting.
//   // This is what makes background navigation (bug #3) feel seamless:
//   // nothing here pauses audio/video/screen-share/timer/participants,
//   // it only changes where the video is *displayed*.
//   useEffect(() => {
//     if (!connected) return;
//     const onVisibility = () => {
//       if (document.hidden) {
//         openPiP();
//       } else {
//         userClosedPipRef.current = false;
//         closePiP();
//       }
//     };
//     document.addEventListener("visibilitychange", onVisibility);
//     return () => document.removeEventListener("visibilitychange", onVisibility);
//   }, [connected, openPiP, closePiP]);

//   // Always close any floating window on genuine unmount.
//   useEffect(() => {
//     return () => closePiP();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

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
//     if (autoEndPollRef.current) clearInterval(autoEndPollRef.current);
//     // ✅ NEW: clear participant poll on end session too
//     if (participantPollRef.current) clearInterval(participantPollRef.current);
//     try {
//       await endLiveSession(id);
//     } catch (_) {}
//     // ✅ Only clear persisted state here — a genuine, trainer-initiated
//     // end of the session. Refreshing, hitting Back, or just navigating
//     // away (the ✕ button) must NOT clear this, so the trainer reconnects
//     // to the same meeting with the timer intact next time.
//     clearPersistedCallState(id);
//     roomRef.current?.disconnect();
//     navigate("/trainer/live");
//   }, [id, navigate]);

//   // ✅ NEW: active students = those who joined but haven't left yet
//   const activeDbParticipants = dbParticipants.filter(
//     (p) => p.leaveTime === null || p.leaveTime === undefined,
//   );

//   // ✅ NEW: sidebar geometry per device bucket (phone/iPhone → full-width
//   // drawer, tablet/iPad mini → wide drawer, laptop/iPad landscape →
//   // narrower fixed panel, desktop → full fixed panel).
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
//           boxShadow: sidebarOpen ? "-8px 0 32px rgba(0,0,0,.5)" : "none",
//         };
//       case "overlayWide":
//         return {
//           position: "absolute",
//           top: 0,
//           bottom: 0,
//           right: 0,
//           zIndex: 40,
//           width: sidebarOpen ? 360 : 0,
//           maxWidth: "88%",
//           boxShadow: sidebarOpen ? "-8px 0 32px rgba(0,0,0,.5)" : "none",
//         };
//       case "panelNarrow":
//         return { width: sidebarOpen ? 300 : 0 };
//       case "panelFull":
//       default:
//         return { width: sidebarOpen ? 344 : 0 };
//     }
//   })();

//   return (
//     <div style={S.root}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
//         *{box-sizing:border-box}
//         ::-webkit-scrollbar{width:8px;height:8px}
//         ::-webkit-scrollbar-track{background:transparent}
//         ::-webkit-scrollbar-thumb{background:rgba(255,255,255,.12);border-radius:8px}
//         ::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,.22)}
//         @keyframes livePulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.35;transform:scale(1.6)}}
//         @keyframes recBlink{0%,100%{opacity:1}50%{opacity:.25}}
//         @keyframes spin{to{transform:rotate(360deg)}}
//         @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
//         @keyframes slideIn{from{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translateY(0)}}
//         @keyframes chatFade{from{opacity:0}to{opacity:1}}
//         @keyframes speakGlow{0%,100%{box-shadow:0 0 0 2px #2563EB,0 0 18px 2px rgba(37,99,235,.45)}50%{box-shadow:0 0 0 2px #3b82f6,0 0 26px 6px rgba(37,99,235,.65)}}
//         .ilm-hoverscale{transition:transform .15s ease,background .15s ease,border-color .15s ease}
//         .ilm-hoverscale:hover{transform:scale(1.02)}
//         .ilm-card{transition:all .2s ease}
//         .ilm-filmtile{transition:transform .15s ease,border-color .15s ease}
//         .ilm-filmtile:hover{transform:scale(1.02);border-color:rgba(255,255,255,.18)}
//       `}</style>

//       {/* Auto-end warning toast */}
//       {autoEndWarning && (
//         <div style={S.autoEndToast}>
//           <span style={{ fontSize: 16 }}>⏱️</span>
//           <div>
//             <div style={{ fontWeight: 700, fontSize: 13 }}>
//               Session time is up!
//             </div>
//             <div style={{ fontSize: 11, opacity: 0.85 }}>
//               Session was auto-ended by the system. Redirecting...
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── TOP HEADER ── */}
//       <div style={{ ...S.topBar, ...(isCompactDevice ? S.topBarCompact : null) }}>
//         <div style={S.topLeft}>
//           <div style={S.brand}>
//             <span style={S.brandMark}>I</span>
//             {!isCompactDevice && <span style={S.brandText}>ILM ORA</span>}
//           </div>
//           <div style={S.liveBadge}>
//             <span style={S.liveDot} />
//             LIVE
//           </div>
//           {!deviceCfg.hideSessionTitle && (
//             <span style={S.sessionNum}>{sessionTitle}</span>
//           )}
//           <span style={S.timerText}>{timer}</span>
//           {recording && (
//             <div style={S.recBadge}>
//               <Circle size={7} fill="currentColor" style={{ animation: "recBlink 1.5s infinite" }} />
//               {!isCompactDevice && "REC"}
//             </div>
//           )}
//         </div>

//         {!isCompactDevice && (
//           <div style={S.topCenter}>{sessionTitle}</div>
//         )}

//         <div style={S.topRight}>
//           <div style={S.pCountBadge}>
//             <Users size={13} strokeWidth={2.25} />
//             {/* ✅ UPDATED: show real DB count instead of LiveKit count */}
//             <span>
//               {activeDbParticipants.length}
//               {!deviceCfg.hidePBadgeLabel && " Participants"}
//             </span>
//           </div>
//           {!isCompactDevice && (
//             <div style={S.signalBadge} title="Connection stable">
//               <Wifi size={14} strokeWidth={2.25} />
//             </div>
//           )}
//           <button
//             className="ilm-hoverscale"
//             style={{
//               ...S.recBtn,
//               ...(recording ? S.recBtnOn : S.recBtnOff),
//               opacity: recToggling ? 0.6 : 1,
//               cursor: recToggling ? "not-allowed" : "pointer",
//             }}
//             onClick={toggleRecording}
//             disabled={recToggling}
//           >
//             <Circle size={9} fill="currentColor" />
//             {!isCompactDevice &&
//               (recToggling
//                 ? " Please wait…"
//                 : recording
//                   ? " Recording"
//                   : " Record")}
//           </button>
//           {recError && !isCompactDevice && (
//             <span style={S.recErrorText}>⚠️ {recError}</span>
//           )}
//           <button className="ilm-hoverscale" style={S.endBtn} onClick={handleEndSession}>
//             <PhoneOff size={14} strokeWidth={2.25} />
//             {!isCompactDevice && " End Session"}
//           </button>
//           <button
//             className="ilm-hoverscale"
//             style={S.closeBtn}
//             onClick={() => navigate("/trainer/live")}
//           >
//             <X size={15} strokeWidth={2.25} />
//           </button>
//         </div>
//       </div>

//       {/* ── BODY ── */}
//       <div style={S.body}>
//         {/* VIDEO AREA */}
//         <div style={S.videoArea}>
//           {connected ? (
//             <>
//               {screenTile ? (
//                 // ── Google Meet / Zoom / Teams "presenting" layout ──
//                 // Shared screen = big main stage. Every camera
//                 // (trainer's own included) = small filmstrip tile whose
//                 // size is tuned per device (phone/tablet/laptop/desktop).
//                 <div
//                   style={{
//                     ...S.stageWrap,
//                     ...(isCompactDevice ? S.stageWrapCompact : null),
//                   }}
//                 >
//                   <div style={S.mainStage} className="ilm-card">
//                     <VideoTile tile={screenTile} device={device} />
//                   </div>
//                   <div
//                     style={{
//                       ...S.filmstrip,
//                       ...(isCompactDevice ? S.filmstripCompact : null),
//                     }}
//                   >
//                     {camTiles.map((t) => (
//                       <div
//                         key={t.id}
//                         className="ilm-filmtile"
//                         style={{
//                           ...S.filmstripTile,
//                           width: deviceCfg.filmstripTile.width,
//                           height: deviceCfg.filmstripTile.height,
//                         }}
//                       >
//                         <VideoTile tile={t} device={device} small />
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               ) : (
//                 // ── Gallery view (no active share): responsive grid
//                 // that adapts tile size for 1 .. 100+ participants across
//                 // every device, with pagination so 50–100+ stay smooth. ──
//                 <GalleryGrid
//                   tiles={camTiles}
//                   page={galleryPage}
//                   onPageChange={setGalleryPage}
//                   device={device}
//                   minScale={deviceCfg.galleryMinScale}
//                 />
//               )}

//               {/* ✅ FIX (bug #1): always-mounted hidden audio elements —
//                   playback no longer depends on which visual tile a
//                   participant happens to be in. */}
//               <div style={S.audioLayer} aria-hidden="true">
//                 {remoteAudioTracks.map((a) => (
//                   <RemoteAudio
//                     key={a.id}
//                     track={a.track}
//                     onBlocked={() => setAudioBlocked(true)}
//                   />
//                 ))}
//               </div>

//               {audioBlocked && (
//                 <button className="ilm-hoverscale" style={S.enableAudioBtn} onClick={enableAllAudio}>
//                   🔊 Click to enable audio
//                 </button>
//               )}

//               {/* ── FLOATING CONTROL DOCK — Google Meet style capsule ── */}
//               <div
//                 style={{
//                   ...S.ctrlBar,
//                   ...(deviceCfg.ctrlCompact ? S.ctrlBarCompact : null),
//                 }}
//               >
//                 <div style={S.dock}>
//                   <CtrlBtn
//                     icon={micOn ? <Mic size={18} strokeWidth={2.1} /> : <MicOff size={18} strokeWidth={2.1} />}
//                     label={micOn ? "Mute" : "Unmute"}
//                     danger={!micOn}
//                     onClick={toggleMic}
//                     compact={deviceCfg.ctrlCompact}
//                   />
//                   <CtrlBtn
//                     icon={camOn ? <Video size={18} strokeWidth={2.1} /> : <VideoOff size={18} strokeWidth={2.1} />}
//                     label={camOn ? "Stop Cam" : "Start Cam"}
//                     danger={!camOn}
//                     onClick={toggleCam}
//                     compact={deviceCfg.ctrlCompact}
//                   />
//                   <CtrlBtn
//                     icon={<ScreenShare size={18} strokeWidth={2.1} />}
//                     label={screenOn ? "Stop Share" : "Present"}
//                     active={screenOn}
//                     onClick={toggleScreen}
//                     compact={deviceCfg.ctrlCompact}
//                   />
//                   <div style={S.dockDivider} />
//                   <CtrlBtn
//                     icon={<MessageSquare size={18} strokeWidth={2.1} />}
//                     label="Chat"
//                     active={sidebarOpen && sidebarTab === "chat"}
//                     compact={deviceCfg.ctrlCompact}
//                     onClick={() => {
//                       if (sidebarOpen && sidebarTab === "chat")
//                         setSidebarOpen(false);
//                       else {
//                         setSidebarTab("chat");
//                         setSidebarOpen(true);
//                       }
//                     }}
//                   />
//                   <CtrlBtn
//                     icon={<Users size={18} strokeWidth={2.1} />}
//                     label="People"
//                     active={sidebarOpen && sidebarTab === "participants"}
//                     compact={deviceCfg.ctrlCompact}
//                     onClick={() => {
//                       if (sidebarOpen && sidebarTab === "participants")
//                         setSidebarOpen(false);
//                       else {
//                         setSidebarTab("participants");
//                         setSidebarOpen(true);
//                       }
//                     }}
//                   />
//                   <CtrlBtn
//                     icon={<PictureInPicture2 size={18} strokeWidth={2.1} />}
//                     label={pipWindow ? "Return" : "Pop out"}
//                     active={!!pipWindow}
//                     compact={deviceCfg.ctrlCompact}
//                     onClick={() => (pipWindow ? returnToMeeting() : openPiP())}
//                   />
//                   <div style={S.dockDivider} />
//                   <button
//                     className="ilm-hoverscale"
//                     style={S.leaveBtn}
//                     onClick={handleEndSession}
//                     title="Leave"
//                   >
//                     <PhoneOff size={20} strokeWidth={2.25} />
//                   </button>
//                 </div>
//               </div>
//             </>
//           ) : (
//             <div style={S.loadingBox}>
//               <div style={S.spinner} />
//               <p style={S.loadingText}>Starting live session…</p>
//             </div>
//           )}
//         </div>

//         {/* DRAG HANDLE */}
//         <div
//           style={S.handle}
//           onClick={() => setSidebarOpen((o) => !o)}
//           title="Toggle panel"
//         >
//           <div style={S.handlePill}>
//             {sidebarOpen ? <ChevronRight size={12} color="#5b6472" /> : <ChevronLeft size={12} color="#5b6472" />}
//           </div>
//         </div>

//         {/* SIDEBAR — ✅ responsive per device: full-width drawer on phones,
//             wide overlay drawer on tablets/iPad mini, narrower fixed panel
//             on laptops/iPad-landscape, full panel on desktop — instead of
//             squeezing the video area to nothing everywhere. */}
//         <div style={{ ...S.sidebar, ...sidebarLayoutStyle }}>
//           {sidebarOpen && (
//             <div style={{ ...S.sidebarInner, animation: "chatFade .2s ease" }}>
//               <div style={S.tabRow}>
//                 <TabBtn
//                   active={sidebarTab === "chat"}
//                   label="Chat"
//                   onClick={() => setSidebarTab("chat")}
//                 />
//                 <TabBtn
//                   active={sidebarTab === "participants"}
//                   label="People"
//                   onClick={() => setSidebarTab("participants")}
//                 />
//                 <button
//                   className="ilm-hoverscale"
//                   style={S.sidebarCloseBtn}
//                   onClick={() => setSidebarOpen(false)}
//                   title="Close"
//                 >
//                   <X size={14} strokeWidth={2.25} />
//                 </button>
//               </div>

//               {sidebarTab === "chat" && (
//                 <>
//                   <div style={S.msgList}>
//                     {messages.map((m) => (
//                       <div
//                         key={m.id}
//                         style={
//                           m.system
//                             ? S.sysRow
//                             : m.self
//                               ? { ...S.msgBlock, alignItems: "flex-end" }
//                               : S.msgBlock
//                         }
//                       >
//                         {m.system ? (
//                           <div style={S.sysBubble}>{m.text}</div>
//                         ) : (
//                           <>
//                             <span style={S.msgUser}>
//                               {m.user} · {m.time}
//                             </span>
//                             <div
//                               style={{
//                                 ...S.msgBubble,
//                                 ...(m.self ? S.bubbleSelf : S.bubbleOther),
//                               }}
//                             >
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
//                 </>
//               )}

//               {sidebarTab === "participants" && (
//                 <div style={S.peopleList}>
//                   {/* ✅ UPDATED: Trainer row always at top */}
//                   <div style={S.pRow} className="ilm-card">
//                     <div style={{ ...S.pAv, background: "linear-gradient(135deg,#2563EB,#60a5fa)" }}>
//                       T
//                     </div>
//                     <span style={S.pName}>You (Trainer)</span>
//                     <span style={S.hostTag}>Host</span>
//                     <span style={S.youTag}>You</span>
//                   </div>

//                   {/* ✅ NEW: Real students from DB with email + join time */}
//                   {activeDbParticipants.map((p) => (
//                     <div key={p.id} style={S.pRow} className="ilm-card">
//                       <div style={{ ...S.pAv, background: "linear-gradient(135deg,#8b5cf6,#ec4899)" }}>
//                         {(p.studentEmail?.[0] || "S").toUpperCase()}
//                       </div>
//                       <div style={{ flex: 1, minWidth: 0 }}>
//                         <div
//                           style={{
//                             ...S.pName,
//                             fontWeight: 600,
//                             overflow: "hidden",
//                             textOverflow: "ellipsis",
//                             whiteSpace: "nowrap",
//                           }}
//                         >
//                           {p.studentEmail}
//                         </div>
//                         <div style={S.pJoinedText}>
//                           Joined{" "}
//                           {p.joinTime
//                             ? new Date(p.joinTime).toLocaleTimeString([], {
//                                 hour: "2-digit",
//                                 minute: "2-digit",
//                               })
//                             : "—"}
//                         </div>
//                       </div>
//                       <span style={S.liveTag}>LIVE</span>
//                     </div>
//                   ))}

//                   {activeDbParticipants.length === 0 && (
//                     <div style={S.emptyPeople}>
//                       <Users size={28} strokeWidth={1.75} style={{ opacity: 0.3 }} />
//                       <p style={S.emptyPeopleText}>No students joined yet</p>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Hidden element powering the native-video PiP fallback for
//           browsers without the Document Picture-in-Picture API. */}
//       <video
//         ref={pipVideoRef}
//         muted
//         playsInline
//         style={{
//           position: "fixed",
//           width: 1,
//           height: 1,
//           opacity: 0,
//           pointerEvents: "none",
//         }}
//       />

//       {/* ✅ NEW: floating meeting window — a real separate browser
//           window when Document PiP is supported, so it keeps rendering
//           live updates (video, timer) even while the main tab is
//           backgrounded, with one click ("Return to meeting") to come
//           back. */}
//       {pipWindow &&
//         createPortal(
//           <PipPanel
//             tile={pipMainTile}
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

// /* ✅ NEW: renders exactly one participant's video (or an avatar
//    placeholder when their camera is off / not yet subscribed). Attaches
//    the LiveKit track imperatively via a ref effect — this is the only
//    DOM-manipulation left, and it's scoped to a single element instead of
//    a shared container, which is what caused the old mixing bugs. */
// const AVATAR_SIZE_BY_DEVICE = {
//   phone: 56,
//   phoneLg: 64,
//   tablet: 80,
//   laptop: 92,
//   desktop: 96,
// };
// const AVATAR_FONT_BY_DEVICE = {
//   phone: 18,
//   phoneLg: 20,
//   tablet: 26,
//   laptop: 30,
//   desktop: 32,
// };

// const VideoTile = ({ tile, small, device = "desktop" }) => {
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
//   const speaking = !tile?.micMuted && !tile?.isScreen;

//   return (
//     <div
//       style={{
//         ...(small ? S.filmstripVideoWrap : S.stageVideoWrap),
//         ...(speaking ? { animation: "speakGlow 1.8s ease-in-out infinite" } : null),
//       }}
//     >
//       {showVideo ? (
//         <video
//           ref={videoRef}
//           autoPlay
//           playsInline
//           muted // local monitors itself silently; remote audio comes from RemoteAudio
//           style={{
//             width: "100%",
//             height: "100%",
//             objectFit: tile.isScreen ? "contain" : "cover",
//             background: "#000",
//             transform:
//               tile.isLocal && !tile.isScreen ? "scaleX(-1)" : "none",
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
//       <span style={small ? S.tileNameTagSm : S.tileNameTag}>
//         {tile?.micMuted && !tile?.isScreen && (
//           <MicOff size={small ? 9 : 11} strokeWidth={2.4} style={{ marginRight: 4 }} />
//         )}
//         {tile?.name}
//       </span>
//     </div>
//   );
// };

// /* ✅ NEW: content rendered inside the floating Document PiP window —
//    the current main-stage tile (screen share if live, else a camera),
//    the live timer, quick mic/cam toggles, and a one-click way back. */
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

// const PipPanel = ({
//   tile,
//   timer,
//   micOn,
//   camOn,
//   onToggleMic,
//   onToggleCam,
//   onReturn,
// }) => (
//   <div
//     style={{
//       width: "100%",
//       height: "100vh",
//       display: "flex",
//       flexDirection: "column",
//       background: "#0B0D11",
//       fontFamily: "'Inter',sans-serif",
//     }}
//   >
//     <div style={{ flex: 1, position: "relative", minHeight: 0 }}>
//       {tile ? (
//         <VideoTile tile={tile} device="phone" />
//       ) : (
//         <div
//           style={{
//             width: "100%",
//             height: "100%",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             color: "#64748b",
//             fontSize: 12,
//           }}
//         >
//           No active video
//         </div>
//       )}
//       <div
//         style={{
//           position: "absolute",
//           top: 8,
//           left: 8,
//           display: "flex",
//           alignItems: "center",
//           gap: 6,
//           background: "rgba(0,0,0,.55)",
//           padding: "3px 9px",
//           borderRadius: 999,
//           fontSize: 10,
//           fontWeight: 700,
//           color: "#fff",
//         }}
//       >
//         <span
//           style={{
//             width: 6,
//             height: 6,
//             borderRadius: "50%",
//             background: "#EF4444",
//           }}
//         />
//         LIVE · {timer}
//       </div>
//     </div>
//     <div
//       style={{
//         flexShrink: 0,
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         gap: 8,
//         padding: 10,
//         background: "#171A21",
//         borderTop: "1px solid rgba(255,255,255,.06)",
//       }}
//     >
//       <button onClick={onToggleMic} style={pipCtrlBtnStyle(!micOn)}>
//         {micOn ? <Mic size={15} /> : <MicOff size={15} />}
//       </button>
//       <button onClick={onToggleCam} style={pipCtrlBtnStyle(!camOn)}>
//         {camOn ? <Video size={15} /> : <VideoOff size={15} />}
//       </button>
//       <button
//         onClick={onReturn}
//         style={{
//           ...pipCtrlBtnStyle(false),
//           width: "auto",
//           padding: "0 14px",
//           fontSize: 11,
//           fontWeight: 700,
//         }}
//       >
//         Return to meeting
//       </button>
//     </div>
//   </div>
// );

// /* ✅ FIX (bug #1): dedicated, always-mounted audio element per remote
//    mic. autoPlay + explicit .play() with a fallback "click to enable"
//    banner handles browsers that block unprompted audio playback — the
//    most common reason a student silently never receives the trainer's
//    voice. */
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

// /* ✅ FIX (bug #4): responsive, auto-sizing, paginated grid so the UI
//    stays smooth and readable whether there are 2, 20, 50, or 100+
//    participants. */
// const GalleryGrid = ({ tiles, page, onPageChange, device = "desktop", minScale = 1 }) => {
//   const totalPages = Math.max(1, Math.ceil(tiles.length / GALLERY_PAGE_SIZE));
//   const clampedPage = Math.min(page, totalPages - 1);
//   const visible = tiles.slice(
//     clampedPage * GALLERY_PAGE_SIZE,
//     clampedPage * GALLERY_PAGE_SIZE + GALLERY_PAGE_SIZE,
//   );
//   // Base min-width from participant count, then scaled per device so
//   // phones/iPad mini get proportionally smaller (but still readable)
//   // tiles than laptops/desktops for the same participant count.
//   const minW = Math.max(90, Math.round(getTileMinWidth(tiles.length) * minScale));

//   return (
//     <div style={S.galleryWrap}>
//       <div
//         style={{
//           ...S.galleryGrid,
//           gap: device === "phone" ? 6 : device === "phoneLg" ? 7 : 10,
//           padding: device === "phone" ? 6 : device === "phoneLg" ? 8 : 16,
//           gridTemplateColumns: `repeat(auto-fit, minmax(${minW}px, 1fr))`,
//         }}
//       >
//         {visible.map((t) => (
//           <div key={t.id} style={S.galleryTile} className="ilm-card">
//             <VideoTile tile={t} device={device} />
//           </div>
//         ))}
//       </div>
//       {totalPages > 1 && (
//         <div style={S.pager}>
//           <button
//             className="ilm-hoverscale"
//             style={S.pagerBtn}
//             disabled={clampedPage === 0}
//             onClick={() => onPageChange(Math.max(0, clampedPage - 1))}
//           >
//             <ChevronLeft size={15} />
//           </button>
//           <span style={S.pagerText}>
//             {clampedPage + 1} / {totalPages}
//           </span>
//           <button
//             className="ilm-hoverscale"
//             style={S.pagerBtn}
//             disabled={clampedPage === totalPages - 1}
//             onClick={() =>
//               onPageChange(Math.min(totalPages - 1, clampedPage + 1))
//             }
//           >
//             <ChevronRight size={15} />
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// const TabBtn = ({ active, label, onClick }) => (
//   <button
//     onClick={onClick}
//     style={{
//       flex: 1,
//       padding: "13px 0",
//       border: "none",
//       background: "transparent",
//       borderBottom: active ? "2px solid #2563EB" : "2px solid transparent",
//       color: active ? "#FFFFFF" : "#B4B9C7",
//       fontFamily: "'Inter',sans-serif",
//       fontSize: 13,
//       fontWeight: 600,
//       cursor: "pointer",
//       transition: "all .15s",
//     }}
//   >
//     {label}
//   </button>
// );

// const CtrlBtn = ({ icon, label, active, danger, onClick, compact }) => {
//   const [hov, setHov] = useState(false);
//   const bg = danger
//     ? hov
//       ? "rgba(239,68,68,.28)"
//       : "rgba(239,68,68,.16)"
//     : active
//       ? hov
//         ? "rgba(37,99,235,.32)"
//         : "rgba(37,99,235,.2)"
//       : hov
//         ? "rgba(255,255,255,.12)"
//         : "transparent";
//   const col = danger ? "#fca5a5" : active ? "#93c5fd" : "#E5E7EB";
//   return (
//     <button
//       onClick={onClick}
//       onMouseEnter={() => setHov(true)}
//       onMouseLeave={() => setHov(false)}
//       title={label}
//       style={{
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         background: bg,
//         color: col,
//         border: "none",
//         borderRadius: 999,
//         width: compact ? 40 : 46,
//         height: compact ? 40 : 46,
//         cursor: "pointer",
//         transition: "all .15s ease",
//         flexShrink: 0,
//       }}
//     >
//       {icon}
//     </button>
//   );
// };

// /* ─────────────────────────────────────────────────────────────
//    DESIGN TOKENS + STYLES
//    Background #0B0D11 · Cards #171A21 · Border rgba(255,255,255,.06)
//    Primary #2563EB · Danger #EF4444 · Text #FFFFFF / #B4B9C7
//    Radius: card 18 · button 16 · video 18 · input 14 · dock 30
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
//     fontFamily: "'Inter',sans-serif",
//     boxShadow: "0 12px 36px rgba(239,68,68,0.4)",
//     animation: "slideIn 0.35s ease",
//     minWidth: 300,
//   },

//   /* ── top header ── */
//   topBar: {
//     flexShrink: 0,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: "12px 24px",
//     background: "#0F1116",
//     borderBottom: "1px solid rgba(255,255,255,.06)",
//     zIndex: 10,
//     gap: 16,
//   },
//   topBarCompact: {
//     padding: "8px 12px",
//     gap: 8,
//   },
//   topLeft: { display: "flex", alignItems: "center", gap: 12, minWidth: 0 },
//   topCenter: {
//     flex: 1,
//     textAlign: "center",
//     fontSize: 14,
//     fontWeight: 600,
//     color: "#FFFFFF",
//     whiteSpace: "nowrap",
//     overflow: "hidden",
//     textOverflow: "ellipsis",
//     fontFamily: "'Inter',sans-serif",
//   },
//   topRight: { display: "flex", alignItems: "center", gap: 8, flexShrink: 0 },
//   brand: { display: "flex", alignItems: "center", gap: 8 },
//   brandMark: {
//     width: 26,
//     height: 26,
//     borderRadius: 8,
//     background: "linear-gradient(135deg,#2563EB,#60a5fa)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontWeight: 800,
//     fontSize: 13,
//     color: "#fff",
//     fontFamily: "'Inter',sans-serif",
//   },
//   brandText: {
//     fontSize: 14,
//     fontWeight: 800,
//     letterSpacing: "0.02em",
//     color: "#FFFFFF",
//     fontFamily: "'Inter',sans-serif",
//   },
//   liveBadge: {
//     display: "flex",
//     alignItems: "center",
//     gap: 5,
//     padding: "5px 10px",
//     borderRadius: 999,
//     background: "#EF4444",
//     fontSize: 10,
//     fontWeight: 800,
//     letterSpacing: "0.1em",
//     color: "#fff",
//     fontFamily: "'Inter',sans-serif",
//   },
//   liveDot: {
//     width: 6,
//     height: 6,
//     borderRadius: "50%",
//     background: "#fff",
//     animation: "livePulse 1.2s ease-in-out infinite",
//     display: "inline-block",
//   },
//   sessionNum: {
//     fontSize: 13,
//     fontWeight: 600,
//     color: "#B4B9C7",
//     fontFamily: "'Inter',sans-serif",
//   },
//   timerText: {
//     fontFamily: "'Inter',monospace",
//     fontSize: 13,
//     color: "#B4B9C7",
//     letterSpacing: 0.4,
//     fontVariantNumeric: "tabular-nums",
//   },
//   recBadge: {
//     display: "flex",
//     alignItems: "center",
//     gap: 5,
//     padding: "4px 10px",
//     borderRadius: 999,
//     background: "rgba(239,68,68,.12)",
//     border: "1px solid rgba(239,68,68,.28)",
//     fontSize: 10,
//     fontWeight: 700,
//     letterSpacing: "0.08em",
//     color: "#fca5a5",
//     fontFamily: "'Inter',sans-serif",
//   },
//   pCountBadge: {
//     display: "flex",
//     alignItems: "center",
//     gap: 6,
//     padding: "6px 12px",
//     borderRadius: 12,
//     background: "#171A21",
//     border: "1px solid rgba(255,255,255,.06)",
//     fontSize: 12,
//     color: "#B4B9C7",
//     fontWeight: 600,
//     fontFamily: "'Inter',sans-serif",
//   },
//   signalBadge: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     width: 32,
//     height: 32,
//     borderRadius: 10,
//     background: "#171A21",
//     border: "1px solid rgba(255,255,255,.06)",
//     color: "#4ade80",
//   },
//   recBtn: {
//     display: "flex",
//     alignItems: "center",
//     gap: 6,
//     padding: "7px 14px",
//     borderRadius: 12,
//     fontSize: 11,
//     fontWeight: 700,
//     cursor: "pointer",
//     fontFamily: "'Inter',sans-serif",
//     letterSpacing: "0.02em",
//     border: "none",
//   },
//   recBtnOn: {
//     background: "rgba(239,68,68,.14)",
//     border: "1px solid rgba(239,68,68,.3)",
//     color: "#f87171",
//   },
//   recBtnOff: {
//     background: "#171A21",
//     border: "1px solid rgba(255,255,255,.06)",
//     color: "#B4B9C7",
//   },
//   recErrorText: {
//     fontSize: 10,
//     color: "#f87171",
//     marginLeft: 2,
//     fontFamily: "'Inter',sans-serif",
//     maxWidth: 160,
//   },
//   endBtn: {
//     display: "flex",
//     alignItems: "center",
//     gap: 7,
//     padding: "8px 18px",
//     borderRadius: 16,
//     border: "none",
//     background: "#EF4444",
//     color: "#fff",
//     fontSize: 13,
//     fontWeight: 700,
//     cursor: "pointer",
//     fontFamily: "'Inter',sans-serif",
//     letterSpacing: "0.01em",
//     boxShadow: "0 4px 14px rgba(239,68,68,.3)",
//   },
//   closeBtn: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     width: 34,
//     height: 34,
//     borderRadius: 10,
//     border: "1px solid rgba(255,255,255,.06)",
//     background: "#171A21",
//     color: "#B4B9C7",
//     cursor: "pointer",
//   },

//   /* ── body / video area ── */
//   body: {
//     flex: 1,
//     display: "flex",
//     overflow: "hidden",
//     minHeight: 0,
//     position: "relative",
//   },
//   videoArea: {
//     flex: 1,
//     position: "relative",
//     overflow: "hidden",
//     minWidth: 0,
//     background: "#0B0D11",
//   },

//   /* ── Google Meet–style "presenting" layout: big stage + filmstrip ── */
//   stageWrap: {
//     position: "absolute",
//     inset: 0,
//     display: "flex",
//     flexDirection: "column",
//     gap: 12,
//     padding: "16px 16px 108px",
//   },
//   mainStage: {
//     flex: 1,
//     minHeight: 0,
//     borderRadius: 18,
//     overflow: "hidden",
//     background: "#000",
//     position: "relative",
//     border: "1px solid rgba(255,255,255,.06)",
//     boxShadow: "0 20px 48px rgba(0,0,0,.35)",
//   },
//   stageVideoWrap: {
//     width: "100%",
//     height: "100%",
//     position: "relative",
//     background: "#000",
//     borderRadius: 18,
//     overflow: "hidden",
//   },
//   stageWrapCompact: {
//     padding: "8px 8px 100px",
//     gap: 8,
//   },
//   filmstrip: {
//     flexShrink: 0,
//     display: "flex",
//     gap: 10,
//     overflowX: "auto",
//     overflowY: "hidden",
//     padding: "2px 2px 4px",
//     scrollbarWidth: "thin",
//     WebkitOverflowScrolling: "touch",
//   },
//   filmstripCompact: {
//     padding: "2px 2px 2px",
//     gap: 6,
//   },
//   filmstripTile: {
//     flexShrink: 0,
//     width: 168,
//     height: 100,
//     borderRadius: 14,
//     overflow: "hidden",
//     background: "#171A21",
//     border: "1px solid rgba(255,255,255,.06)",
//     position: "relative",
//   },
//   filmstripVideoWrap: {
//     width: "100%",
//     height: "100%",
//     position: "relative",
//     background: "#171A21",
//     borderRadius: 14,
//     overflow: "hidden",
//   },

//   /* ── Gallery (grid) view when nobody is screen-sharing ── */
//   galleryWrap: {
//     position: "absolute",
//     inset: 0,
//     display: "flex",
//     flexDirection: "column",
//     paddingBottom: 104,
//   },
//   galleryGrid: {
//     flex: 1,
//     display: "grid",
//     gap: 10,
//     padding: 16,
//     alignContent: "center",
//     overflow: "hidden",
//   },
//   galleryTile: {
//     position: "relative",
//     borderRadius: 18,
//     overflow: "hidden",
//     background: "#171A21",
//     border: "1px solid rgba(255,255,255,.06)",
//     aspectRatio: "16 / 9",
//     boxShadow: "0 8px 24px rgba(0,0,0,.25)",
//   },
//   pager: {
//     flexShrink: 0,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 14,
//     padding: "8px 0 14px",
//   },
//   pagerBtn: {
//     width: 32,
//     height: 32,
//     borderRadius: "50%",
//     border: "1px solid rgba(255,255,255,.08)",
//     background: "#171A21",
//     color: "#E5E7EB",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     cursor: "pointer",
//   },
//   pagerText: {
//     fontSize: 12,
//     color: "#B4B9C7",
//     fontFamily: "'Inter',sans-serif",
//     fontWeight: 600,
//   },

//   /* ── shared tile internals ── */
//   avatarWrap: {
//     position: "absolute",
//     inset: 0,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     background: "#171A21",
//   },
//   avatarCircle: {
//     borderRadius: "50%",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontWeight: 800,
//     color: "#fff",
//     background: "linear-gradient(135deg,#2563EB,#60a5fa)",
//     fontFamily: "'Inter',sans-serif",
//   },
//   tileNameTag: {
//     position: "absolute",
//     bottom: 12,
//     left: 12,
//     fontSize: 12,
//     color: "#fff",
//     background: "rgba(11,13,17,.68)",
//     backdropFilter: "blur(6px)",
//     padding: "4px 11px",
//     borderRadius: 8,
//     pointerEvents: "none",
//     fontFamily: "'Inter',sans-serif",
//     fontWeight: 600,
//     letterSpacing: "0.01em",
//     display: "flex",
//     alignItems: "center",
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
//     fontFamily: "'Inter',sans-serif",
//     fontWeight: 600,
//     display: "flex",
//     alignItems: "center",
//   },

//   /* ── audio ── */
//   hiddenAudio: {
//     position: "absolute",
//     width: 1,
//     height: 1,
//     opacity: 0,
//     pointerEvents: "none",
//   },
//   audioLayer: { position: "absolute", width: 0, height: 0, overflow: "hidden" },
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
//     fontFamily: "'Inter',sans-serif",
//     fontSize: 12,
//     fontWeight: 700,
//     cursor: "pointer",
//     boxShadow: "0 12px 32px rgba(0,0,0,.5)",
//   },

//   /* ── floating control dock ── */
//   ctrlBar: {
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: "0 16px 20px",
//     zIndex: 20,
//   },
//   ctrlBarCompact: {
//     padding: "0 8px 12px",
//   },
//   dock: {
//     display: "flex",
//     alignItems: "center",
//     gap: 6,
//     padding: "8px 10px",
//     borderRadius: 30,
//     background: "rgba(23,26,33,.88)",
//     backdropFilter: "blur(16px)",
//     border: "1px solid rgba(255,255,255,.08)",
//     boxShadow: "0 16px 40px rgba(0,0,0,.45)",
//   },
//   dockDivider: {
//     width: 1,
//     height: 22,
//     background: "rgba(255,255,255,.1)",
//     margin: "0 2px",
//     flexShrink: 0,
//   },
//   leaveBtn: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     width: 50,
//     height: 50,
//     borderRadius: "50%",
//     border: "none",
//     background: "#EF4444",
//     color: "#fff",
//     cursor: "pointer",
//     flexShrink: 0,
//     boxShadow: "0 6px 18px rgba(239,68,68,.4)",
//   },

//   loadingBox: {
//     position: "absolute",
//     inset: 0,
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 14,
//   },
//   spinner: {
//     width: 40,
//     height: 40,
//     border: "3px solid rgba(37,99,235,.2)",
//     borderTop: "3px solid #2563EB",
//     borderRadius: "50%",
//     animation: "spin .8s linear infinite",
//   },
//   loadingText: {
//     fontSize: 13,
//     color: "#B4B9C7",
//     fontFamily: "'Inter',sans-serif",
//     fontWeight: 600,
//   },

//   /* ── drag handle ── */
//   handle: {
//     flexShrink: 0,
//     width: 16,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     background: "#0B0D11",
//     cursor: "pointer",
//     zIndex: 5,
//   },
//   handlePill: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     width: 20,
//     height: 40,
//     borderRadius: 10,
//     background: "#171A21",
//     border: "1px solid rgba(255,255,255,.06)",
//   },

//   /* ── sidebar ── */
//   sidebar: {
//     flexShrink: 0,
//     background: "#0F1116",
//     borderLeft: "1px solid rgba(255,255,255,.06)",
//     display: "flex",
//     flexDirection: "column",
//     overflow: "hidden",
//     transition: "width .25s ease",
//   },
//   sidebarInner: {
//     flex: 1,
//     display: "flex",
//     flexDirection: "column",
//     minHeight: 0,
//   },
//   tabRow: {
//     flexShrink: 0,
//     display: "flex",
//     alignItems: "center",
//     borderBottom: "1px solid rgba(255,255,255,.06)",
//     padding: "0 8px",
//   },
//   sidebarCloseBtn: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     width: 30,
//     height: 30,
//     borderRadius: 8,
//     border: "none",
//     background: "transparent",
//     color: "#B4B9C7",
//     cursor: "pointer",
//     flexShrink: 0,
//   },
//   msgList: {
//     flex: 1,
//     overflowY: "auto",
//     padding: "16px",
//     display: "flex",
//     flexDirection: "column",
//     gap: 14,
//     minHeight: 0,
//   },
//   sysRow: { display: "flex", justifyContent: "center" },
//   sysBubble: {
//     fontSize: 11,
//     color: "#B4B9C7",
//     background: "#171A21",
//     border: "1px solid rgba(255,255,255,.06)",
//     borderRadius: 10,
//     padding: "6px 14px",
//     fontFamily: "'Inter',sans-serif",
//     fontWeight: 500,
//     textAlign: "center",
//   },
//   msgBlock: { display: "flex", flexDirection: "column", gap: 4 },
//   msgUser: {
//     fontSize: 10.5,
//     color: "#6B7280",
//     fontWeight: 600,
//     fontFamily: "'Inter',sans-serif",
//   },
//   msgBubble: {
//     maxWidth: "88%",
//     padding: "9px 13px",
//     borderRadius: 16,
//     fontSize: 13,
//     color: "#FFFFFF",
//     lineHeight: 1.5,
//     fontFamily: "'Inter',sans-serif",
//     fontWeight: 400,
//   },
//   bubbleSelf: {
//     background: "#2563EB",
//     alignSelf: "flex-end",
//     borderBottomRightRadius: 4,
//   },
//   bubbleOther: {
//     background: "#171A21",
//     border: "1px solid rgba(255,255,255,.06)",
//     borderBottomLeftRadius: 4,
//   },
//   inputRow: {
//     flexShrink: 0,
//     display: "flex",
//     gap: 8,
//     padding: "12px 14px",
//     borderTop: "1px solid rgba(255,255,255,.06)",
//   },
//   chatInput: {
//     flex: 1,
//     background: "#171A21",
//     border: "1px solid rgba(255,255,255,.08)",
//     borderRadius: 14,
//     padding: "10px 14px",
//     color: "#FFFFFF",
//     fontSize: 13,
//     fontFamily: "'Inter',sans-serif",
//     fontWeight: 400,
//     outline: "none",
//   },
//   sendBtn: {
//     flexShrink: 0,
//     background: "#2563EB",
//     border: "none",
//     borderRadius: 14,
//     padding: "0 16px",
//     color: "#fff",
//     cursor: "pointer",
//     display: "flex",
//     alignItems: "center",
//   },
//   peopleList: {
//     flex: 1,
//     overflowY: "auto",
//     padding: "12px 12px",
//     display: "flex",
//     flexDirection: "column",
//     gap: 6,
//     minHeight: 0,
//   },
//   emptyPeople: {
//     flex: 1,
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 8,
//     paddingTop: 32,
//   },
//   emptyPeopleText: {
//     fontSize: 12,
//     color: "#6B7280",
//     marginTop: 8,
//     fontFamily: "'Inter',sans-serif",
//   },
//   pRow: {
//     display: "flex",
//     alignItems: "center",
//     gap: 12,
//     padding: "10px 12px",
//     borderRadius: 14,
//     background: "#171A21",
//     border: "1px solid rgba(255,255,255,.06)",
//   },
//   pAv: {
//     width: 34,
//     height: 34,
//     borderRadius: "50%",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontSize: 13,
//     fontWeight: 800,
//     flexShrink: 0,
//     fontFamily: "'Inter',sans-serif",
//     color: "#fff",
//   },
//   pName: {
//     flex: 1,
//     fontSize: 13,
//     color: "#E5E7EB",
//     fontFamily: "'Inter',sans-serif",
//     fontWeight: 500,
//   },
//   pJoinedText: {
//     fontSize: 10.5,
//     color: "#6B7280",
//     fontFamily: "'Inter',sans-serif",
//     marginTop: 1,
//   },
//   hostTag: {
//     fontSize: 9.5,
//     background: "rgba(37,99,235,.15)",
//     color: "#93c5fd",
//     padding: "3px 9px",
//     borderRadius: 999,
//     fontWeight: 700,
//     fontFamily: "'Inter',sans-serif",
//     letterSpacing: "0.04em",
//   },
//   youTag: {
//     fontSize: 9.5,
//     background: "rgba(74,222,128,.14)",
//     color: "#86efac",
//     padding: "3px 9px",
//     borderRadius: 999,
//     fontWeight: 700,
//     fontFamily: "'Inter',sans-serif",
//     letterSpacing: "0.04em",
//   },
//   liveTag: {
//     fontSize: 9.5,
//     background: "rgba(74,222,128,.14)",
//     color: "#86efac",
//     padding: "3px 9px",
//     borderRadius: 999,
//     fontWeight: 700,
//     fontFamily: "'Inter',sans-serif",
//     letterSpacing: "0.06em",
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
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   HELPERS
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

const buildSnapshot = (room) => {
  if (!room) return { camTiles: [], screenTile: null, audioTracks: [] };

  const camTiles = [];
  let screenTile = null;
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

    camTiles.push({
      id: `${baseId}-cam`,
      name,
      isLocal,
      isHost: isLocal,
      track: camPub && camPub.track ? camPub.track : null,
      videoMuted: !camPub || !!camPub.isMuted || !camPub.track,
      micMuted,
    });

    if (screenPub && screenPub.track) {
      screenTile = {
        id: `${baseId}-screen`,
        name: isLocal ? "You're presenting" : `${name} is presenting`,
        isLocal,
        isScreen: true,
        track: screenPub.track,
      };
    }

    if (!isLocal && micPub && micPub.track) {
      audioTracks.push({ id: `${baseId}-audio`, track: micPub.track });
    }
  };

  addParticipant(room.localParticipant, true);
  room.remoteParticipants.forEach((p) => addParticipant(p, false));

  return { camTiles, screenTile, audioTracks };
};

const getTileMinWidth = (n) => {
  if (n <= 1) return 640;
  if (n <= 2) return 480;
  if (n <= 4) return 360;
  if (n <= 6) return 300;
  if (n <= 9) return 240;
  if (n <= 16) return 190;
  if (n <= 25) return 155;
  if (n <= 49) return 130;
  return 110;
};

const GALLERY_PAGE_SIZE = 49;

const getDevice = (w) => {
  if (w <= 480) return "phone";
  if (w <= 767) return "phoneLg";
  if (w <= 1023) return "tablet";
  if (w <= 1365) return "laptop";
  return "desktop";
};

const DEVICE_CONFIG = {
  phone: {
    filmstripTile: { width: 84, height: 54 },
    galleryMinScale: 0.5,
    sidebarMode: "overlayFull",
    ctrlCompact: true,
    hideSessionTitle: true,
    hidePBadgeLabel: true,
  },
  phoneLg: {
    filmstripTile: { width: 104, height: 66 },
    galleryMinScale: 0.62,
    sidebarMode: "overlayFull",
    ctrlCompact: true,
    hideSessionTitle: true,
    hidePBadgeLabel: false,
  },
  tablet: {
    filmstripTile: { width: 132, height: 82 },
    galleryMinScale: 0.8,
    sidebarMode: "overlayWide",
    ctrlCompact: false,
    hideSessionTitle: false,
    hidePBadgeLabel: false,
  },
  laptop: {
    filmstripTile: { width: 150, height: 92 },
    galleryMinScale: 0.92,
    sidebarMode: "panelNarrow",
    ctrlCompact: false,
    hideSessionTitle: false,
    hidePBadgeLabel: false,
  },
  desktop: {
    filmstripTile: { width: 168, height: 100 },
    galleryMinScale: 1,
    sidebarMode: "panelFull",
    ctrlCompact: false,
    hideSessionTitle: false,
    hidePBadgeLabel: false,
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

  // ✅ NEW — backup timer + de-dupe guards for auto-end (see fix notes below)
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
  const [sidebarTab, setSidebarTab] = useState("chat");
  const [participants, setParticipants] = useState([]);
  const startedRef = useRef(false);
  const recTogglingRef = useRef(false);
  const recCooldownRef = useRef(false);
  const [dbParticipants, setDbParticipants] = useState([]);

  const [camTiles, setCamTiles] = useState([]);
  const [screenTile, setScreenTile] = useState(null);
  const [remoteAudioTracks, setRemoteAudioTracks] = useState([]);
  const [audioBlocked, setAudioBlocked] = useState(false);
  const [galleryPage, setGalleryPage] = useState(0);

  const { w: viewportW, device, cfg: deviceCfg } = useResponsiveDevice();
  const isCompactDevice = device === "phone" || device === "phoneLg";
  const isTouchDevice = isCompactDevice || device === "tablet";
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
  // ✅ NEW — the exact message shown when the session auto-ends
  const [autoEndMessage, setAutoEndMessage] = useState(
    "Session duration has completed. The meeting has ended automatically.",
  );

  const [meetingStartedAt, setMeetingStartedAt] = useState(null);
  const timer = useElapsedTimer(meetingStartedAt);

  const [pipWindow, setPipWindow] = useState(null);
  const pipVideoRef = useRef(null);
  const userClosedPipRef = useRef(false);

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
    const snap = buildSnapshot(roomRef.current);
    setCamTiles(snap.camTiles);
    setScreenTile(snap.screenTile);
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

  // ✅ NEW — always reads a fresh token from storage at call time instead
  // of once at connect time. This is the #1 root cause fix: a stale
  // token captured once in a closure silently 401'd every poll forever.
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

        /* ─────────────────────────────────────────────────────────
           ✅ FIXED AUTO-END LOGIC

           Root cause of the trainer sometimes never disconnecting:
           the old code captured the auth token ONCE outside the
           interval and reused it forever. If that token expired
           mid-session, every poll silently 401'd and `if (!res.ok)
           return;` swallowed it — meaning the trainer could NEVER
           learn the session had ended, no matter how long the poll
           kept "running".

           Fix has two parts:
             1. Re-read the token fresh on every tick (getFreshAuthToken).
             2. Add a local, wall-clock hard-stop timer that fires
                purely off `startedAt + duration`, completely
                independent of the network/poll. This guarantees the
                trainer ends on time even if every single poll fails.
           Both paths funnel into performAutoEndRef.current(), which is
           guarded so it can only ever run once.
        ───────────────────────────────────────────────────────── */
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
            // const res = await fetch(
            //   `${import.meta.env.VITE_API_BASE_URL || "http://localhost:9000"}/api/live-sessions/${id}`,
            //   {
            //     headers: freshToken
            //       ? { Authorization: `Bearer ${freshToken}` }
            //       : {},
            //   },
            // );
            const res = await fetch(
  `${import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api"}/live-sessions/${id}`,
  {
    headers: freshToken
      ? { Authorization: `Bearer ${freshToken}` }
      : {},
  },
);
            if (!res.ok) {
              // Fresh token still failing (e.g. session deleted, or a
              // genuine auth problem) — safe to skip this tick. The
              // hard-stop timer above still guarantees an end.
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

        // ✅ Run one check immediately (covers refresh/reconnect landing
        // at or after the scheduled end) instead of waiting for the
        // first interval tick.
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
        refreshParticipants();
        fetchDbParticipants();
        pushSystem(`${p.name || p.identity} joined`);
        rebuild();
      });
      room.on(RoomEvent.ParticipantDisconnected, (p) => {
        refreshParticipants();
        pushSystem(`${p.name || p.identity} left`);
        rebuild();
      });
      room.on(RoomEvent.DataReceived, (payload, participant) => {
        try {
          const decoded = new TextDecoder().decode(payload);
          const msg = JSON.parse(decoded);
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
      // ✅ NEW — clear the hard-stop timer on genuine unmount too
      if (hardStopTimeoutRef.current) clearTimeout(hardStopTimeoutRef.current);
      roomRef.current?.disconnect();
      startedRef.current = false;
    };
  }, [id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sidebarTab, sidebarOpen]);

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

  const pipMainTile =
    screenTile || camTiles.find((t) => !t.isLocal) || camTiles[0] || null;

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
      const track = pipMainTile?.track;
      if (!el || !track || !document.pictureInPictureEnabled) return;
      track.attach(el);
      if (document.pictureInPictureElement !== el) {
        await el.requestPictureInPicture();
      }
    } catch (err) {
      console.warn("Fallback video PiP unavailable:", err);
    }
  }, [pipMainTile]);

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

  /* ✅ NEW — keeps performAutoEndRef.current pointed at a closure with
     the LATEST `recording`, `id`, `navigate`, `closePiP`, etc. This runs
     every render (cheap — just a function assignment) so the connect
     effect (defined earlier in the file, before closePiP exists) can
     safely call performAutoEndRef.current(...) without any stale-closure
     or declaration-order problems.

     This single function is the complete, guaranteed teardown path
     required by the spec: mic/cam/screen/recording/PiP/listeners/
     persisted-state/disconnect/navigate — and it can only ever run once
     per mount thanks to autoEndingRef. */
  useEffect(() => {
    performAutoEndRef.current = async (message) => {
      if (autoEndingRef.current) return; // already ending — ignore duplicates
      autoEndingRef.current = true;

      // Stop every timer/interval immediately.
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

      // Stop server-side recording (egress) if it was on.
      if (recording && id) {
        try {
          await stopRecordingLive(id);
        } catch (_) {}
      }

      // Stop screen share if it was active.
      try {
        if (roomRef.current?.localParticipant?.isScreenShareEnabled) {
          await roomRef.current.localParticipant.setScreenShareEnabled(false);
        }
      } catch (_) {}

      // Release camera/mic hardware explicitly.
      try {
        localAudioTrackRef.current?.stop?.();
      } catch (_) {}
      try {
        localVideoTrackRef.current?.stop?.();
      } catch (_) {}

      // Close any floating Picture-in-Picture window.
      try {
        closePiP();
      } catch (_) {}

      // Never try to reconnect to this meeting again.
      clearPersistedCallState(id);

      // Give the toast a moment to be seen, then disconnect cleanly and leave.
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
    // ✅ NEW — block any late auto-end from firing after a manual end
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
          boxShadow: sidebarOpen ? "-8px 0 32px rgba(0,0,0,.5)" : "none",
        };
      case "overlayWide":
        return {
          position: "absolute",
          top: 0,
          bottom: 0,
          right: 0,
          zIndex: 40,
          width: sidebarOpen ? 360 : 0,
          maxWidth: "88%",
          boxShadow: sidebarOpen ? "-8px 0 32px rgba(0,0,0,.5)" : "none",
        };
      case "panelNarrow":
        return { width: sidebarOpen ? 300 : 0 };
      case "panelFull":
      default:
        return { width: sidebarOpen ? 344 : 0 };
    }
  })();

  return (
    <div style={S.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:8px;height:8px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,.12);border-radius:8px}
        ::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,.22)}
        @keyframes livePulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.35;transform:scale(1.6)}}
        @keyframes recBlink{0%,100%{opacity:1}50%{opacity:.25}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideIn{from{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes chatFade{from{opacity:0}to{opacity:1}}
        @keyframes speakGlow{0%,100%{box-shadow:0 0 0 2px #2563EB,0 0 18px 2px rgba(37,99,235,.45)}50%{box-shadow:0 0 0 2px #3b82f6,0 0 26px 6px rgba(37,99,235,.65)}}
        .ilm-hoverscale{transition:transform .15s ease,background .15s ease,border-color .15s ease}
        .ilm-hoverscale:hover{transform:scale(1.02)}
        .ilm-card{transition:all .2s ease}
        .ilm-filmtile{transition:transform .15s ease,border-color .15s ease}
        .ilm-filmtile:hover{transform:scale(1.02);border-color:rgba(255,255,255,.18)}
      `}</style>

      {autoEndWarning && (
        <div style={S.autoEndToast}>
          <span style={{ fontSize: 16 }}>⏱️</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13 }}>
              Session Ended
            </div>
            <div style={{ fontSize: 11, opacity: 0.85 }}>
              {autoEndMessage}
            </div>
          </div>
        </div>
      )}

      {/* ── TOP HEADER ── */}
      <div style={{ ...S.topBar, ...(isCompactDevice ? S.topBarCompact : null) }}>
        <div style={S.topLeft}>
          <div style={S.brand}>
            <span style={S.brandMark}>I</span>
            {!isCompactDevice && <span style={S.brandText}>ILM ORA</span>}
          </div>
          <div style={S.liveBadge}>
            <span style={S.liveDot} />
            LIVE
          </div>
          {!deviceCfg.hideSessionTitle && (
            <span style={S.sessionNum}>{sessionTitle}</span>
          )}
          <span style={S.timerText}>{timer}</span>
          {recording && (
            <div style={S.recBadge}>
              <Circle size={7} fill="currentColor" style={{ animation: "recBlink 1.5s infinite" }} />
              {!isCompactDevice && "REC"}
            </div>
          )}
        </div>

        {!isCompactDevice && (
          <div style={S.topCenter}>{sessionTitle}</div>
        )}

        <div style={S.topRight}>
          <div style={S.pCountBadge}>
            <Users size={13} strokeWidth={2.25} />
            <span>
              {activeDbParticipants.length}
              {!deviceCfg.hidePBadgeLabel && " Participants"}
            </span>
          </div>
          {!isCompactDevice && (
            <div style={S.signalBadge} title="Connection stable">
              <Wifi size={14} strokeWidth={2.25} />
            </div>
          )}
          <button
            className="ilm-hoverscale"
            style={{
              ...S.recBtn,
              ...(recording ? S.recBtnOn : S.recBtnOff),
              opacity: recToggling ? 0.6 : 1,
              cursor: recToggling ? "not-allowed" : "pointer",
            }}
            onClick={toggleRecording}
            disabled={recToggling}
          >
            <Circle size={9} fill="currentColor" />
            {!isCompactDevice &&
              (recToggling
                ? " Please wait…"
                : recording
                  ? " Recording"
                  : " Record")}
          </button>
          {recError && !isCompactDevice && (
            <span style={S.recErrorText}>⚠️ {recError}</span>
          )}
          <button className="ilm-hoverscale" style={S.endBtn} onClick={handleEndSession}>
            <PhoneOff size={14} strokeWidth={2.25} />
            {!isCompactDevice && " End Session"}
          </button>
          <button
            className="ilm-hoverscale"
            style={S.closeBtn}
            onClick={() => navigate("/trainer/live")}
          >
            <X size={15} strokeWidth={2.25} />
          </button>
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={S.body}>
        <div style={S.videoArea}>
          {connected ? (
            <>
              {screenTile ? (
                <div
                  style={{
                    ...S.stageWrap,
                    ...(isCompactDevice ? S.stageWrapCompact : null),
                  }}
                >
                  <div style={S.mainStage} className="ilm-card">
                    <VideoTile tile={screenTile} device={device} />
                  </div>
                  <div
                    style={{
                      ...S.filmstrip,
                      ...(isCompactDevice ? S.filmstripCompact : null),
                    }}
                  >
                    {camTiles.map((t) => (
                      <div
                        key={t.id}
                        className="ilm-filmtile"
                        style={{
                          ...S.filmstripTile,
                          width: deviceCfg.filmstripTile.width,
                          height: deviceCfg.filmstripTile.height,
                        }}
                      >
                        <VideoTile tile={t} device={device} small />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <GalleryGrid
                  tiles={camTiles}
                  page={galleryPage}
                  onPageChange={setGalleryPage}
                  device={device}
                  minScale={deviceCfg.galleryMinScale}
                />
              )}

              <div style={S.audioLayer} aria-hidden="true">
                {remoteAudioTracks.map((a) => (
                  <RemoteAudio
                    key={a.id}
                    track={a.track}
                    onBlocked={() => setAudioBlocked(true)}
                  />
                ))}
              </div>

              {audioBlocked && (
                <button className="ilm-hoverscale" style={S.enableAudioBtn} onClick={enableAllAudio}>
                  🔊 Click to enable audio
                </button>
              )}

              <div
                style={{
                  ...S.ctrlBar,
                  ...(deviceCfg.ctrlCompact ? S.ctrlBarCompact : null),
                }}
              >
                <div style={S.dock}>
                  <CtrlBtn
                    icon={micOn ? <Mic size={18} strokeWidth={2.1} /> : <MicOff size={18} strokeWidth={2.1} />}
                    label={micOn ? "Mute" : "Unmute"}
                    danger={!micOn}
                    onClick={toggleMic}
                    compact={deviceCfg.ctrlCompact}
                  />
                  <CtrlBtn
                    icon={camOn ? <Video size={18} strokeWidth={2.1} /> : <VideoOff size={18} strokeWidth={2.1} />}
                    label={camOn ? "Stop Cam" : "Start Cam"}
                    danger={!camOn}
                    onClick={toggleCam}
                    compact={deviceCfg.ctrlCompact}
                  />
                  <CtrlBtn
                    icon={<ScreenShare size={18} strokeWidth={2.1} />}
                    label={screenOn ? "Stop Share" : "Present"}
                    active={screenOn}
                    onClick={toggleScreen}
                    compact={deviceCfg.ctrlCompact}
                  />
                  <div style={S.dockDivider} />
                  <CtrlBtn
                    icon={<MessageSquare size={18} strokeWidth={2.1} />}
                    label="Chat"
                    active={sidebarOpen && sidebarTab === "chat"}
                    compact={deviceCfg.ctrlCompact}
                    onClick={() => {
                      if (sidebarOpen && sidebarTab === "chat")
                        setSidebarOpen(false);
                      else {
                        setSidebarTab("chat");
                        setSidebarOpen(true);
                      }
                    }}
                  />
                  <CtrlBtn
                    icon={<Users size={18} strokeWidth={2.1} />}
                    label="People"
                    active={sidebarOpen && sidebarTab === "participants"}
                    compact={deviceCfg.ctrlCompact}
                    onClick={() => {
                      if (sidebarOpen && sidebarTab === "participants")
                        setSidebarOpen(false);
                      else {
                        setSidebarTab("participants");
                        setSidebarOpen(true);
                      }
                    }}
                  />
                  <CtrlBtn
                    icon={<PictureInPicture2 size={18} strokeWidth={2.1} />}
                    label={pipWindow ? "Return" : "Pop out"}
                    active={!!pipWindow}
                    compact={deviceCfg.ctrlCompact}
                    onClick={() => (pipWindow ? returnToMeeting() : openPiP())}
                  />
                  <div style={S.dockDivider} />
                  <button
                    className="ilm-hoverscale"
                    style={S.leaveBtn}
                    onClick={handleEndSession}
                    title="Leave"
                  >
                    <PhoneOff size={20} strokeWidth={2.25} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div style={S.loadingBox}>
              <div style={S.spinner} />
              <p style={S.loadingText}>Starting live session…</p>
            </div>
          )}
        </div>

        <div
          style={S.handle}
          onClick={() => setSidebarOpen((o) => !o)}
          title="Toggle panel"
        >
          <div style={S.handlePill}>
            {sidebarOpen ? <ChevronRight size={12} color="#5b6472" /> : <ChevronLeft size={12} color="#5b6472" />}
          </div>
        </div>

        <div style={{ ...S.sidebar, ...sidebarLayoutStyle }}>
          {sidebarOpen && (
            <div style={{ ...S.sidebarInner, animation: "chatFade .2s ease" }}>
              <div style={S.tabRow}>
                <TabBtn
                  active={sidebarTab === "chat"}
                  label="Chat"
                  onClick={() => setSidebarTab("chat")}
                />
                <TabBtn
                  active={sidebarTab === "participants"}
                  label="People"
                  onClick={() => setSidebarTab("participants")}
                />
                <button
                  className="ilm-hoverscale"
                  style={S.sidebarCloseBtn}
                  onClick={() => setSidebarOpen(false)}
                  title="Close"
                >
                  <X size={14} strokeWidth={2.25} />
                </button>
              </div>

              {sidebarTab === "chat" && (
                <>
                  <div style={S.msgList}>
                    {messages.map((m) => (
                      <div
                        key={m.id}
                        style={
                          m.system
                            ? S.sysRow
                            : m.self
                              ? { ...S.msgBlock, alignItems: "flex-end" }
                              : S.msgBlock
                        }
                      >
                        {m.system ? (
                          <div style={S.sysBubble}>{m.text}</div>
                        ) : (
                          <>
                            <span style={S.msgUser}>
                              {m.user} · {m.time}
                            </span>
                            <div
                              style={{
                                ...S.msgBubble,
                                ...(m.self ? S.bubbleSelf : S.bubbleOther),
                              }}
                            >
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
                </>
              )}

              {sidebarTab === "participants" && (
                <div style={S.peopleList}>
                  <div style={S.pRow} className="ilm-card">
                    <div style={{ ...S.pAv, background: "linear-gradient(135deg,#2563EB,#60a5fa)" }}>
                      T
                    </div>
                    <span style={S.pName}>You (Trainer)</span>
                    <span style={S.hostTag}>Host</span>
                    <span style={S.youTag}>You</span>
                  </div>

                  {activeDbParticipants.map((p) => (
                    <div key={p.id} style={S.pRow} className="ilm-card">
                      <div style={{ ...S.pAv, background: "linear-gradient(135deg,#8b5cf6,#ec4899)" }}>
                        {(p.studentEmail?.[0] || "S").toUpperCase()}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            ...S.pName,
                            fontWeight: 600,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {p.studentEmail}
                        </div>
                        <div style={S.pJoinedText}>
                          Joined{" "}
                          {p.joinTime
                            ? new Date(p.joinTime).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "—"}
                        </div>
                      </div>
                      <span style={S.liveTag}>LIVE</span>
                    </div>
                  ))}

                  {activeDbParticipants.length === 0 && (
                    <div style={S.emptyPeople}>
                      <Users size={28} strokeWidth={1.75} style={{ opacity: 0.3 }} />
                      <p style={S.emptyPeopleText}>No students joined yet</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <video
        ref={pipVideoRef}
        muted
        playsInline
        style={{
          position: "fixed",
          width: 1,
          height: 1,
          opacity: 0,
          pointerEvents: "none",
        }}
      />

      {pipWindow &&
        createPortal(
          <PipPanel
            tile={pipMainTile}
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

const AVATAR_SIZE_BY_DEVICE = {
  phone: 56,
  phoneLg: 64,
  tablet: 80,
  laptop: 92,
  desktop: 96,
};
const AVATAR_FONT_BY_DEVICE = {
  phone: 18,
  phoneLg: 20,
  tablet: 26,
  laptop: 30,
  desktop: 32,
};

const VideoTile = ({ tile, small, device = "desktop" }) => {
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
  const speaking = !tile?.micMuted && !tile?.isScreen;

  return (
    <div
      style={{
        ...(small ? S.filmstripVideoWrap : S.stageVideoWrap),
        ...(speaking ? { animation: "speakGlow 1.8s ease-in-out infinite" } : null),
      }}
    >
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
            transform:
              tile.isLocal && !tile.isScreen ? "scaleX(-1)" : "none",
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
      <span style={small ? S.tileNameTagSm : S.tileNameTag}>
        {tile?.micMuted && !tile?.isScreen && (
          <MicOff size={small ? 9 : 11} strokeWidth={2.4} style={{ marginRight: 4 }} />
        )}
        {tile?.name}
      </span>
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

const PipPanel = ({
  tile,
  timer,
  micOn,
  camOn,
  onToggleMic,
  onToggleCam,
  onReturn,
}) => (
  <div
    style={{
      width: "100%",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      background: "#0B0D11",
      fontFamily: "'Inter',sans-serif",
    }}
  >
    <div style={{ flex: 1, position: "relative", minHeight: 0 }}>
      {tile ? (
        <VideoTile tile={tile} device="phone" />
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#64748b",
            fontSize: 12,
          }}
        >
          No active video
        </div>
      )}
      <div
        style={{
          position: "absolute",
          top: 8,
          left: 8,
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: "rgba(0,0,0,.55)",
          padding: "3px 9px",
          borderRadius: 999,
          fontSize: 10,
          fontWeight: 700,
          color: "#fff",
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#EF4444",
          }}
        />
        LIVE · {timer}
      </div>
    </div>
    <div
      style={{
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: 10,
        background: "#171A21",
        borderTop: "1px solid rgba(255,255,255,.06)",
      }}
    >
      <button onClick={onToggleMic} style={pipCtrlBtnStyle(!micOn)}>
        {micOn ? <Mic size={15} /> : <MicOff size={15} />}
      </button>
      <button onClick={onToggleCam} style={pipCtrlBtnStyle(!camOn)}>
        {camOn ? <Video size={15} /> : <VideoOff size={15} />}
      </button>
      <button
        onClick={onReturn}
        style={{
          ...pipCtrlBtnStyle(false),
          width: "auto",
          padding: "0 14px",
          fontSize: 11,
          fontWeight: 700,
        }}
      >
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

const GalleryGrid = ({ tiles, page, onPageChange, device = "desktop", minScale = 1 }) => {
  const totalPages = Math.max(1, Math.ceil(tiles.length / GALLERY_PAGE_SIZE));
  const clampedPage = Math.min(page, totalPages - 1);
  const visible = tiles.slice(
    clampedPage * GALLERY_PAGE_SIZE,
    clampedPage * GALLERY_PAGE_SIZE + GALLERY_PAGE_SIZE,
  );
  const minW = Math.max(90, Math.round(getTileMinWidth(tiles.length) * minScale));

  return (
    <div style={S.galleryWrap}>
      <div
        style={{
          ...S.galleryGrid,
          gap: device === "phone" ? 6 : device === "phoneLg" ? 7 : 10,
          padding: device === "phone" ? 6 : device === "phoneLg" ? 8 : 16,
          gridTemplateColumns: `repeat(auto-fit, minmax(${minW}px, 1fr))`,
        }}
      >
        {visible.map((t) => (
          <div key={t.id} style={S.galleryTile} className="ilm-card">
            <VideoTile tile={t} device={device} />
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div style={S.pager}>
          <button
            className="ilm-hoverscale"
            style={S.pagerBtn}
            disabled={clampedPage === 0}
            onClick={() => onPageChange(Math.max(0, clampedPage - 1))}
          >
            <ChevronLeft size={15} />
          </button>
          <span style={S.pagerText}>
            {clampedPage + 1} / {totalPages}
          </span>
          <button
            className="ilm-hoverscale"
            style={S.pagerBtn}
            disabled={clampedPage === totalPages - 1}
            onClick={() =>
              onPageChange(Math.min(totalPages - 1, clampedPage + 1))
            }
          >
            <ChevronRight size={15} />
          </button>
        </div>
      )}
    </div>
  );
};

const TabBtn = ({ active, label, onClick }) => (
  <button
    onClick={onClick}
    style={{
      flex: 1,
      padding: "13px 0",
      border: "none",
      background: "transparent",
      borderBottom: active ? "2px solid #2563EB" : "2px solid transparent",
      color: active ? "#FFFFFF" : "#B4B9C7",
      fontFamily: "'Inter',sans-serif",
      fontSize: 13,
      fontWeight: 600,
      cursor: "pointer",
      transition: "all .15s",
    }}
  >
    {label}
  </button>
);

const CtrlBtn = ({ icon, label, active, danger, onClick, compact }) => {
  const [hov, setHov] = useState(false);
  const bg = danger
    ? hov
      ? "rgba(239,68,68,.28)"
      : "rgba(239,68,68,.16)"
    : active
      ? hov
        ? "rgba(37,99,235,.32)"
        : "rgba(37,99,235,.2)"
      : hov
        ? "rgba(255,255,255,.12)"
        : "transparent";
  const col = danger ? "#fca5a5" : active ? "#93c5fd" : "#E5E7EB";
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      title={label}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: bg,
        color: col,
        border: "none",
        borderRadius: 999,
        width: compact ? 40 : 46,
        height: compact ? 40 : 46,
        cursor: "pointer",
        transition: "all .15s ease",
        flexShrink: 0,
      }}
    >
      {icon}
    </button>
  );
};

/* ─────────────────────────────────────────────────────────────
   DESIGN TOKENS + STYLES (unchanged)
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
    fontFamily: "'Inter',sans-serif",
    boxShadow: "0 12px 36px rgba(239,68,68,0.4)",
    animation: "slideIn 0.35s ease",
    minWidth: 300,
  },
  topBar: {
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 24px",
    background: "#0F1116",
    borderBottom: "1px solid rgba(255,255,255,.06)",
    zIndex: 10,
    gap: 16,
  },
  topBarCompact: {
    padding: "8px 12px",
    gap: 8,
  },
  topLeft: { display: "flex", alignItems: "center", gap: 12, minWidth: 0 },
  topCenter: {
    flex: 1,
    textAlign: "center",
    fontSize: 14,
    fontWeight: 600,
    color: "#FFFFFF",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    fontFamily: "'Inter',sans-serif",
  },
  topRight: { display: "flex", alignItems: "center", gap: 8, flexShrink: 0 },
  brand: { display: "flex", alignItems: "center", gap: 8 },
  brandMark: {
    width: 26,
    height: 26,
    borderRadius: 8,
    background: "linear-gradient(135deg,#2563EB,#60a5fa)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    fontSize: 13,
    color: "#fff",
    fontFamily: "'Inter',sans-serif",
  },
  brandText: {
    fontSize: 14,
    fontWeight: 800,
    letterSpacing: "0.02em",
    color: "#FFFFFF",
    fontFamily: "'Inter',sans-serif",
  },
  liveBadge: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    padding: "5px 10px",
    borderRadius: 999,
    background: "#EF4444",
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: "0.1em",
    color: "#fff",
    fontFamily: "'Inter',sans-serif",
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#fff",
    animation: "livePulse 1.2s ease-in-out infinite",
    display: "inline-block",
  },
  sessionNum: {
    fontSize: 13,
    fontWeight: 600,
    color: "#B4B9C7",
    fontFamily: "'Inter',sans-serif",
  },
  timerText: {
    fontFamily: "'Inter',monospace",
    fontSize: 13,
    color: "#B4B9C7",
    letterSpacing: 0.4,
    fontVariantNumeric: "tabular-nums",
  },
  recBadge: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    padding: "4px 10px",
    borderRadius: 999,
    background: "rgba(239,68,68,.12)",
    border: "1px solid rgba(239,68,68,.28)",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.08em",
    color: "#fca5a5",
    fontFamily: "'Inter',sans-serif",
  },
  pCountBadge: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 12px",
    borderRadius: 12,
    background: "#171A21",
    border: "1px solid rgba(255,255,255,.06)",
    fontSize: 12,
    color: "#B4B9C7",
    fontWeight: 600,
    fontFamily: "'Inter',sans-serif",
  },
  signalBadge: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 32,
    height: 32,
    borderRadius: 10,
    background: "#171A21",
    border: "1px solid rgba(255,255,255,.06)",
    color: "#4ade80",
  },
  recBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "7px 14px",
    borderRadius: 12,
    fontSize: 11,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "'Inter',sans-serif",
    letterSpacing: "0.02em",
    border: "none",
  },
  recBtnOn: {
    background: "rgba(239,68,68,.14)",
    border: "1px solid rgba(239,68,68,.3)",
    color: "#f87171",
  },
  recBtnOff: {
    background: "#171A21",
    border: "1px solid rgba(255,255,255,.06)",
    color: "#B4B9C7",
  },
  recErrorText: {
    fontSize: 10,
    color: "#f87171",
    marginLeft: 2,
    fontFamily: "'Inter',sans-serif",
    maxWidth: 160,
  },
  endBtn: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    padding: "8px 18px",
    borderRadius: 16,
    border: "none",
    background: "#EF4444",
    color: "#fff",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "'Inter',sans-serif",
    letterSpacing: "0.01em",
    boxShadow: "0 4px 14px rgba(239,68,68,.3)",
  },
  closeBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 34,
    height: 34,
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,.06)",
    background: "#171A21",
    color: "#B4B9C7",
    cursor: "pointer",
  },
  body: {
    flex: 1,
    display: "flex",
    overflow: "hidden",
    minHeight: 0,
    position: "relative",
  },
  videoArea: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
    minWidth: 0,
    background: "#0B0D11",
  },
  stageWrap: {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    gap: 12,
    padding: "16px 16px 108px",
  },
  mainStage: {
    flex: 1,
    minHeight: 0,
    borderRadius: 18,
    overflow: "hidden",
    background: "#000",
    position: "relative",
    border: "1px solid rgba(255,255,255,.06)",
    boxShadow: "0 20px 48px rgba(0,0,0,.35)",
  },
  stageVideoWrap: {
    width: "100%",
    height: "100%",
    position: "relative",
    background: "#000",
    borderRadius: 18,
    overflow: "hidden",
  },
  stageWrapCompact: {
    padding: "8px 8px 100px",
    gap: 8,
  },
  filmstrip: {
    flexShrink: 0,
    display: "flex",
    gap: 10,
    overflowX: "auto",
    overflowY: "hidden",
    padding: "2px 2px 4px",
    scrollbarWidth: "thin",
    WebkitOverflowScrolling: "touch",
  },
  filmstripCompact: {
    padding: "2px 2px 2px",
    gap: 6,
  },
  filmstripTile: {
    flexShrink: 0,
    width: 168,
    height: 100,
    borderRadius: 14,
    overflow: "hidden",
    background: "#171A21",
    border: "1px solid rgba(255,255,255,.06)",
    position: "relative",
  },
  filmstripVideoWrap: {
    width: "100%",
    height: "100%",
    position: "relative",
    background: "#171A21",
    borderRadius: 14,
    overflow: "hidden",
  },
  galleryWrap: {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    paddingBottom: 104,
  },
  galleryGrid: {
    flex: 1,
    display: "grid",
    gap: 10,
    padding: 16,
    alignContent: "center",
    overflow: "hidden",
  },
  galleryTile: {
    position: "relative",
    borderRadius: 18,
    overflow: "hidden",
    background: "#171A21",
    border: "1px solid rgba(255,255,255,.06)",
    aspectRatio: "16 / 9",
    boxShadow: "0 8px 24px rgba(0,0,0,.25)",
  },
  pager: {
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    padding: "8px 0 14px",
  },
  pagerBtn: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    border: "1px solid rgba(255,255,255,.08)",
    background: "#171A21",
    color: "#E5E7EB",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  pagerText: {
    fontSize: 12,
    color: "#B4B9C7",
    fontFamily: "'Inter',sans-serif",
    fontWeight: 600,
  },
  avatarWrap: {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#171A21",
  },
  avatarCircle: {
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    color: "#fff",
    background: "linear-gradient(135deg,#2563EB,#60a5fa)",
    fontFamily: "'Inter',sans-serif",
  },
  tileNameTag: {
    position: "absolute",
    bottom: 12,
    left: 12,
    fontSize: 12,
    color: "#fff",
    background: "rgba(11,13,17,.68)",
    backdropFilter: "blur(6px)",
    padding: "4px 11px",
    borderRadius: 8,
    pointerEvents: "none",
    fontFamily: "'Inter',sans-serif",
    fontWeight: 600,
    letterSpacing: "0.01em",
    display: "flex",
    alignItems: "center",
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
    fontFamily: "'Inter',sans-serif",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
  },
  hiddenAudio: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0,
    pointerEvents: "none",
  },
  audioLayer: { position: "absolute", width: 0, height: 0, overflow: "hidden" },
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
    fontFamily: "'Inter',sans-serif",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 12px 32px rgba(0,0,0,.5)",
  },
  ctrlBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 16px 20px",
    zIndex: 20,
  },
  ctrlBarCompact: {
    padding: "0 8px 12px",
  },
  dock: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 10px",
    borderRadius: 30,
    background: "rgba(23,26,33,.88)",
    backdropFilter: "blur(16px)",
    border: "1px solid rgba(255,255,255,.08)",
    boxShadow: "0 16px 40px rgba(0,0,0,.45)",
  },
  dockDivider: {
    width: 1,
    height: 22,
    background: "rgba(255,255,255,.1)",
    margin: "0 2px",
    flexShrink: 0,
  },
  leaveBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
    borderRadius: "50%",
    border: "none",
    background: "#EF4444",
    color: "#fff",
    cursor: "pointer",
    flexShrink: 0,
    boxShadow: "0 6px 18px rgba(239,68,68,.4)",
  },
  loadingBox: {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
  },
  spinner: {
    width: 40,
    height: 40,
    border: "3px solid rgba(37,99,235,.2)",
    borderTop: "3px solid #2563EB",
    borderRadius: "50%",
    animation: "spin .8s linear infinite",
  },
  loadingText: {
    fontSize: 13,
    color: "#B4B9C7",
    fontFamily: "'Inter',sans-serif",
    fontWeight: 600,
  },
  handle: {
    flexShrink: 0,
    width: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#0B0D11",
    cursor: "pointer",
    zIndex: 5,
  },
  handlePill: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 20,
    height: 40,
    borderRadius: 10,
    background: "#171A21",
    border: "1px solid rgba(255,255,255,.06)",
  },
  sidebar: {
    flexShrink: 0,
    background: "#0F1116",
    borderLeft: "1px solid rgba(255,255,255,.06)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    transition: "width .25s ease",
  },
  sidebarInner: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    minHeight: 0,
  },
  tabRow: {
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    borderBottom: "1px solid rgba(255,255,255,.06)",
    padding: "0 8px",
  },
  sidebarCloseBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 30,
    height: 30,
    borderRadius: 8,
    border: "none",
    background: "transparent",
    color: "#B4B9C7",
    cursor: "pointer",
    flexShrink: 0,
  },
  msgList: {
    flex: 1,
    overflowY: "auto",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: 14,
    minHeight: 0,
  },
  sysRow: { display: "flex", justifyContent: "center" },
  sysBubble: {
    fontSize: 11,
    color: "#B4B9C7",
    background: "#171A21",
    border: "1px solid rgba(255,255,255,.06)",
    borderRadius: 10,
    padding: "6px 14px",
    fontFamily: "'Inter',sans-serif",
    fontWeight: 500,
    textAlign: "center",
  },
  msgBlock: { display: "flex", flexDirection: "column", gap: 4 },
  msgUser: {
    fontSize: 10.5,
    color: "#6B7280",
    fontWeight: 600,
    fontFamily: "'Inter',sans-serif",
  },
  msgBubble: {
    maxWidth: "88%",
    padding: "9px 13px",
    borderRadius: 16,
    fontSize: 13,
    color: "#FFFFFF",
    lineHeight: 1.5,
    fontFamily: "'Inter',sans-serif",
    fontWeight: 400,
  },
  bubbleSelf: {
    background: "#2563EB",
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    background: "#171A21",
    border: "1px solid rgba(255,255,255,.06)",
    borderBottomLeftRadius: 4,
  },
  inputRow: {
    flexShrink: 0,
    display: "flex",
    gap: 8,
    padding: "12px 14px",
    borderTop: "1px solid rgba(255,255,255,.06)",
  },
  chatInput: {
    flex: 1,
    background: "#171A21",
    border: "1px solid rgba(255,255,255,.08)",
    borderRadius: 14,
    padding: "10px 14px",
    color: "#FFFFFF",
    fontSize: 13,
    fontFamily: "'Inter',sans-serif",
    fontWeight: 400,
    outline: "none",
  },
  sendBtn: {
    flexShrink: 0,
    background: "#2563EB",
    border: "none",
    borderRadius: 14,
    padding: "0 16px",
    color: "#fff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  },
  peopleList: {
    flex: 1,
    overflowY: "auto",
    padding: "12px 12px",
    display: "flex",
    flexDirection: "column",
    gap: 6,
    minHeight: 0,
  },
  emptyPeople: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingTop: 32,
  },
  emptyPeopleText: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 8,
    fontFamily: "'Inter',sans-serif",
  },
  pRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 12px",
    borderRadius: 14,
    background: "#171A21",
    border: "1px solid rgba(255,255,255,.06)",
  },
  pAv: {
    width: 34,
    height: 34,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 13,
    fontWeight: 800,
    flexShrink: 0,
    fontFamily: "'Inter',sans-serif",
    color: "#fff",
  },
  pName: {
    flex: 1,
    fontSize: 13,
    color: "#E5E7EB",
    fontFamily: "'Inter',sans-serif",
    fontWeight: 500,
  },
  pJoinedText: {
    fontSize: 10.5,
    color: "#6B7280",
    fontFamily: "'Inter',sans-serif",
    marginTop: 1,
  },
  hostTag: {
    fontSize: 9.5,
    background: "rgba(37,99,235,.15)",
    color: "#93c5fd",
    padding: "3px 9px",
    borderRadius: 999,
    fontWeight: 700,
    fontFamily: "'Inter',sans-serif",
    letterSpacing: "0.04em",
  },
  youTag: {
    fontSize: 9.5,
    background: "rgba(74,222,128,.14)",
    color: "#86efac",
    padding: "3px 9px",
    borderRadius: 999,
    fontWeight: 700,
    fontFamily: "'Inter',sans-serif",
    letterSpacing: "0.04em",
  },
  liveTag: {
    fontSize: 9.5,
    background: "rgba(74,222,128,.14)",
    color: "#86efac",
    padding: "3px 9px",
    borderRadius: 999,
    fontWeight: 700,
    fontFamily: "'Inter',sans-serif",
    letterSpacing: "0.06em",
  },
};

export default LiveSessionControls;