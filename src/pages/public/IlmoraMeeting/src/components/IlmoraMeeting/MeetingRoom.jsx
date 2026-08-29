// import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import { createPortal } from "react-dom";
// import { Room, RoomEvent, Track, createLocalTracks } from "livekit-client";
// import texoraLogo from "@/assets/texora-logo.webp";
// import {
//   AlertTriangle,
//   Captions,
//   Check,
//   Clock,
//   Copy,
//   Disc2,
//   ExternalLink,
//   Hand,
//   MessageSquare,
//   Mic,
//   MicOff,
//   Minimize2,
//   MonitorOff,
//   MonitorPlay,
//   MonitorUp,
//   Moon,
//   MoreVertical,
//   PhoneOff,
//   Send,
//   Settings,
//   SignalHigh,
//   SmilePlus,
//   Sun,
//   Timer,
//   User,
//   UserMinus,
//   UserPlus,
//   Users,
//   Video,
//   VideoOff,
//   X,
// } from "lucide-react";
// import {
//   admitAllJoinRequests,
//   admitJoinRequest,
//   denyJoinRequest,
//   endMeeting,
//   getMeetingByJoinCode,
//   listPendingJoinRequests,
//   requestMeetingSummary,
// } from "@/services/liveSessionService";
// import { Btn } from "./components/Btn";
// import { EmojiFloaters } from "./components/EmojiFloaters";
// import { MobileMoreSheet } from "./components/MobileMoreSheet";
// import { ParticipantGrid } from "./components/ParticipantGrid";
// import { PersonRow } from "./components/PersonRow";
// import { PiPPanel } from "./components/PiPPanel";
// import { StageTile } from "./components/StageTile";
// import { StripOverflow } from "./components/StripOverflow";
// import { StripTile } from "./components/StripTile";
// import { VideoTrackEl } from "./components/VideoTrackEl";
// import { WaitingRoomPanel } from "./components/WaitingRoomPanel";
// import { MEETING_STATUS_POLL_MS, REACTIONS, WAITING_ROOM_POLL_MS, getTime } from "./constants";
// import { useDismiss } from "./hooks/useDismiss";
// import { useElapsedTimer } from "./hooks/useElapsedTimer";
// import { useResponsiveDevice } from "./hooks/useResponsiveDevice";
// import { IM_STYLES } from "./styles/meetingStyles";
// import { buildParticipantList } from "./utils/participants";
// import { detectScreenShareSupport, detectSpeechRecognitionSupport } from "./utils/platformSupport";

// /* ═════════════════════════════════════════════════════════════════
//    MEETING ROOM — the actual LiveKit-connected Google-Meet-style room.
//    Owns the Room instance directly; renders identically for host and
//    guests except for host-only affordances (waiting room, recording,
//    End meeting for everyone vs. Leave).
// ═════════════════════════════════════════════════════════════════ */
// export function MeetingRoom({
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

//   // Match Google Meet: no side panel open by default — the grid uses
//   // the full width until the user taps Chat/People themselves.
//   const [sidebarOpen, setSidebarOpen] = useState(false);
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
//   const [liveCaptions, setLiveCaptions] = useState([]);
//   const recognitionRef = useRef(null);
//   const [captionSupport] = useState(() => detectSpeechRecognitionSupport());
//   const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
//   const [mobileGridView, setMobileGridView] = useState(true);

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
//           } else if (msg.type === "caption" && msg.text) {
//             const speakerName =
//               participant?.name || participant?.identity || "Someone";
//             setLiveCaptions((prev) => {
//               const next = prev.filter(
//                 (c) => c.identity !== participant?.identity,
//               );
//               next.push({
//                 identity: participant?.identity,
//                 name: speakerName,
//                 text: msg.text,
//                 ts: Date.now(),
//               });
//               return next.slice(-3);
//             });
//           }
//         } catch (_) {}
//       };

//       room.on(RoomEvent.TrackSubscribed, rebuild);
//       room.on(RoomEvent.TrackUnsubscribed, rebuild);
//       room.on(RoomEvent.TrackMuted, rebuild);
//       room.on(RoomEvent.TrackUnmuted, rebuild);
//       room.on(RoomEvent.LocalTrackPublished, rebuild);
//       room.on(RoomEvent.LocalTrackUnpublished, rebuild);

//       // FIX: publish-level events — refresh before subscribe round-trip.
//       room.on(RoomEvent.TrackPublished, rebuild);
//       room.on(RoomEvent.TrackUnpublished, rebuild);
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
//   /* ── live captions (client-side Web Speech API) ─────────────────────
//      No transcription backend exists yet, so each browser recognizes
//      only its OWN mic locally and broadcasts the text over the same
//      data channel already used for chat/reactions. Chrome/Edge only. */
//   useEffect(() => {
//     if (!connected || !captionSupport.supported) {
//       if (recognitionRef.current) {
//         try {
//           recognitionRef.current.stop();
//         } catch (_) {}
//         recognitionRef.current = null;
//       }
//       return undefined;
//     }

//     const SR = captionSupport.SR;
//     const recognition = new SR();
//     recognition.continuous = true;
//     recognition.interimResults = true;
//     recognition.lang = "en-US";

//     recognition.onresult = (event) => {
//       let text = "";
//       for (let i = event.resultIndex; i < event.results.length; i++) {
//         text += event.results[i][0].transcript;
//       }
//       text = text.trim();
//       if (!text) return;

//       const localIdentity = roomRef.current?.localParticipant?.identity;
//       setLiveCaptions((prev) => {
//         const next = prev.filter((c) => c.identity !== localIdentity);
//         next.push({
//           identity: localIdentity,
//           name: "You",
//           text,
//           ts: Date.now(),
//         });
//         return next.slice(-3);
//       });

//       try {
//         const payload = new TextEncoder().encode(
//           JSON.stringify({ type: "caption", text }),
//         );
//         roomRef.current?.localParticipant?.publishData(payload, {
//           reliable: false,
//         });
//       } catch (_) {}
//     };

//     recognition.onerror = (e) => {
//       if (e?.error === "not-allowed" || e?.error === "service-not-allowed") {
//         setMediaError(
//           "Captions need microphone permission. Allow mic access in your browser's site settings and try again.",
//         );
//       }
//     };
//     recognition.onend = () => {
//       try {
//         recognition.start();
//       } catch (_) {}
//     };

//     try {
//       recognition.start();
//     } catch (_) {}
//     recognitionRef.current = recognition;

//     return () => {
//       try {
//         recognition.stop();
//       } catch (_) {}
//       recognitionRef.current = null;
//     };
//   }, [connected, captionSupport]);

//   useEffect(() => {
//     if (!liveCaptions.length) return undefined;
//     const id = setInterval(() => {
//       setLiveCaptions((prev) => prev.filter((c) => Date.now() - c.ts < 5000));
//     }, 1000);
//     return () => clearInterval(id);
//   }, [liveCaptions.length]);

//   /* ── everyone: poll meeting status so guests learn the host ended it ── */
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
//       const nextEnabled = !micOn;
//       const pub = await room.localParticipant.setMicrophoneEnabled(
//         nextEnabled,
//         {
//           echoCancellation: true,
//           noiseSuppression: true,
//           autoGainControl: true,
//         },
//       );
//       localMicRef.current = pub?.track || null;
//       setMicOn(nextEnabled);
//       setMediaError(null);
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
//         // FIX (camera-while-presenting bug): omitting `audio` here let
//         // createLocalTracks grab a second microphone track too, and the
//         // blind [videoTrack] destructure could pick that mic track
//         // instead of the camera track — so turning the camera back on
//         // while screen sharing silently failed (or duplicated the mic).
//         // Request video only, and select it explicitly by kind.
//         const tracks = await createLocalTracks({
//           audio: false,
//           video: { resolution: { width: 1280, height: 720 } },
//         });
//         const videoTrack = tracks.find((t) => t.kind === Track.Kind.Video);
//         if (!videoTrack) throw new Error("No camera track returned");
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

//   const endingRef = useRef(false);
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
//   // FIX (grid-everywhere UI): both mobile and desktop reference screenshots
//   // show the uniform participant grid at all times when there's more than
//   // one participant — no stage+filmstrip speaker layout at all. A screen
//   // share still forces speaker view so the presenter's content is legible.
//   const gridMode = !screenSharer && participants.length > 1;
//   const effectiveGridMode = screenSharer ? false : gridMode;

//   const pipTrack =
//     screenSharer?.screenTrack ||
//     participants.find((p) => p.isLocal)?.cameraTrack ||
//     participants.find((p) => !p.isLocal && p.cameraTrack)?.cameraTrack ||
//     null;
//   const pipIsScreen = !!screenSharer?.screenTrack;
//   const pipLabel = screenSharer
//     ? `${screenSharer.name}${screenSharer.isLocal ? " (You)" : ""} is presenting`
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
//           <div
//             style={S.zoomOverlay}
//             role="dialog"
//             aria-label="Screen share full screen"
//           >
//             <VideoTrackEl track={screenSharer.screenTrack} fit="contain" />
//             <div style={S.zoomOverlayBar}>
//               <span style={S.zoomOverlayLabel}>
//                 <MonitorPlay size={14} />
//                 {`${screenSharer.name}${screenSharer.isLocal ? " (You)" : ""} is presenting`}
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
//             background: "#1e8e3e",
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
//                 <UserPlus size={14} color="#81c995" />
//               ) : n.type === "leave" ? (
//                 <UserMinus size={14} color="#f28b82" />
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
//               {screenOn ? <MonitorPlay size={14} /> : <MonitorOff size={14} />}
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
//               style={{ ...S.endSessionBtn, background: "#5f6368" }}
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
//           {effectiveGridMode ? (
//             <>
//               <ParticipantGrid
//                 participants={participants}
//                 raisedHands={raisedHands}
//                 handRaised={handRaised}
//                 reactions={reactions}
//                 S={S}
//                 device={device}
//               />
//               {captionsOn && (
//                 <div style={S.captionsBar}>
//                   {liveCaptions.length > 0 ? (
//                     liveCaptions.map((c) => (
//                       <div key={c.identity} style={S.captionLine}>
//                         <span style={S.captionSpeakerName}>{c.name}:</span>
//                         <span>{c.text}</span>
//                       </div>
//                     ))
//                   ) : (
//                     <div style={S.captionLine}>
//                       <Captions size={14} />
//                       {captionSupport.supported
//                         ? "Captions will appear here when someone speaks…"
//                         : "Captions aren't supported in this browser — try Chrome or Edge."}
//                     </div>
//                   )}
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
//                 presenterCam={
//                   screenSharer
//                     ? {
//                         track: screenSharer.cameraTrack,
//                         cameraMuted: screenSharer.cameraMuted,
//                         isLocal: screenSharer.isLocal,
//                         name: screenSharer.name,
//                       }
//                     : null
//                 }
//               />
//               {captionsOn && (
//                 <div style={S.captionsBar}>
//                   <Captions size={13} />
//                   {liveCaptions.length > 0 ? (
//                     <span>
//                       {liveCaptions
//                         .map((c) => `${c.name}: ${c.text}`)
//                         .join("   •   ")}
//                     </span>
//                   ) : (
//                     <span>
//                       {captionSupport.supported
//                         ? "Listening for speech…"
//                         : "Captions aren't supported in this browser — try Chrome or Edge."}
//                     </span>
//                   )}
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
//                         background: "rgba(253,214,99,.22)",
//                         color: "#fdd663",
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
//                     name={p.name}
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
//         {isCompactDevice ? (
//           <>
//             <Btn
//               icon={camOn ? <Video size={18} /> : <VideoOff size={18} />}
//               label="Camera"
//               danger={!camOn}
//               onClick={toggleCam}
//               pressed={camOn}
//               S={S}
//             />
//             <Btn
//               icon={micOn ? <Mic size={18} /> : <MicOff size={18} />}
//               label="Mic"
//               danger={!micOn}
//               onClick={toggleMic}
//               pressed={micOn}
//               S={S}
//             />
//             <div style={{ position: "relative" }}>
//               <Btn
//                 btnRef={reactionBtnRef}
//                 icon={<SmilePlus size={18} />}
//                 label="React"
//                 active={reactionPickerOpen}
//                 onClick={() => {
//                   const rect = reactionBtnRef.current?.getBoundingClientRect();
//                   if (rect) {
//                     setReactionPos({
//                       left: rect.left + rect.width / 2,
//                       top: rect.top - 10,
//                     });
//                   }
//                   setReactionPickerOpen((v) => !v);
//                 }}
//                 ariaHasPopup="true"
//                 ariaExpanded={reactionPickerOpen}
//                 S={S}
//               />
//             </div>
//             <Btn
//               icon={<Hand size={18} />}
//               label="Raise Hand"
//               active={handRaised}
//               onClick={toggleHandRaise}
//               pressed={handRaised}
//               S={S}
//             />
//             <Btn
//               icon={<MoreVertical size={18} />}
//               label="More"
//               active={mobileSheetOpen}
//               onClick={() => setMobileSheetOpen(true)}
//               ariaHasPopup="true"
//               ariaExpanded={mobileSheetOpen}
//               S={S}
//             />
//             <Btn
//               icon={<PhoneOff size={18} />}
//               label={isHost ? (isEnding ? "Ending…" : "End") : "Leave"}
//               leave
//               disabled={isHost && isEnding}
//               onClick={isHost ? handleEndForAll : handleLeave}
//               S={S}
//             />
//           </>
//         ) : (
//           <>
//             <Btn
//               icon={micOn ? <Mic size={18} /> : <MicOff size={18} />}
//               label="Mic"
//               danger={!micOn}
//               onClick={toggleMic}
//               pressed={micOn}
//               S={S}
//             />
//             <Btn
//               icon={camOn ? <Video size={18} /> : <VideoOff size={18} />}
//               label="Camera"
//               danger={!camOn}
//               onClick={toggleCam}
//               pressed={camOn}
//               S={S}
//             />
//             <Btn
//               icon={
//                 screenOn ? <MonitorOff size={18} /> : <MonitorUp size={18} />
//               }
//               label="Present"
//               active={screenOn}
//               disabled={!screenOn && !screenShareSupport.supported}
//               title={
//                 !screenOn && !screenShareSupport.supported
//                   ? screenShareSupport.message
//                   : undefined
//               }
//               onClick={toggleScreen}
//               pressed={screenOn}
//               S={S}
//             />
//             <Btn
//               icon={<Hand size={18} />}
//               label="Raise Hand"
//               active={handRaised}
//               onClick={toggleHandRaise}
//               pressed={handRaised}
//               S={S}
//             />
//             <div style={{ position: "relative" }}>
//               <Btn
//                 btnRef={reactionBtnRef}
//                 icon={<SmilePlus size={18} />}
//                 label="React"
//                 active={reactionPickerOpen}
//                 onClick={() => {
//                   const rect = reactionBtnRef.current?.getBoundingClientRect();
//                   if (rect) {
//                     setReactionPos({
//                       left: rect.left + rect.width / 2,
//                       top: rect.top - 10,
//                     });
//                   }
//                   setReactionPickerOpen((v) => !v);
//                 }}
//                 ariaHasPopup="true"
//                 ariaExpanded={reactionPickerOpen}
//                 S={S}
//               />
//             </div>
//             <Btn
//               icon={<MessageSquare size={18} />}
//               label="Chat"
//               active={sidebarOpen && sidebarTab === "chat"}
//               onClick={() => openTab("chat")}
//               S={S}
//             />
//             <Btn
//               icon={<Users size={18} />}
//               label="People"
//               badge={participants.length || 1}
//               active={sidebarOpen && sidebarTab === "people"}
//               onClick={() => openTab("people")}
//               S={S}
//             />
//             <Btn
//               icon={<Settings size={18} />}
//               label="Settings"
//               active={settingsOpen}
//               onClick={() => setSettingsOpen((v) => !v)}
//               S={S}
//             />
//             <Btn
//               icon={<PhoneOff size={18} />}
//               label={isHost ? (isEnding ? "Ending…" : "End") : "Leave"}
//               leave
//               disabled={isHost && isEnding}
//               onClick={isHost ? handleEndForAll : handleLeave}
//               S={S}
//             />
//           </>
//         )}
//       </div>

//       {isCompactDevice && (
//         <MobileMoreSheet
//           open={mobileSheetOpen}
//           onClose={() => setMobileSheetOpen(false)}
//           handRaised={handRaised}
//           onToggleHand={toggleHandRaise}
//           screenOn={screenOn}
//           screenShareSupport={screenShareSupport}
//           onToggleScreen={() => {
//             toggleScreen();
//             setMobileSheetOpen(false);
//           }}
//           captionsOn={captionsOn}
//           onToggleCaptions={() => setCaptionsOn((v) => !v)}
//           pipOn={!!pipWindow}
//           onTogglePip={() => {
//             togglePiP();
//             setMobileSheetOpen(false);
//           }}
//           onOpenPeople={() => {
//             openTab("people");
//             setMobileSheetOpen(false);
//           }}
//           onOpenChat={() => {
//             openTab("chat");
//             setMobileSheetOpen(false);
//           }}
//           isHost={isHost}
//           waitingCount={waiting.length}
//           onOpenWaiting={() => {
//             openTab("waiting");
//             setMobileSheetOpen(false);
//           }}
//           recording={recording}
//           onToggleRecording={toggleRecording}
//           onOpenSettings={() => {
//             setSettingsOpen(true);
//             setMobileSheetOpen(false);
//           }}
//           gridView={mobileGridView}
//           onToggleLayout={() => {
//             setMobileGridView((v) => !v);
//             setMobileSheetOpen(false);
//           }}
//           onLeave={() => {
//             setMobileSheetOpen(false);
//             if (isHost) handleEndForAll();
//             else handleLeave();
//           }}
//           isEnding={isEnding}
//           S={S}
//         />
//       )}

//       <style>{`
//         [data-theme="dark"] {
//           --im-page:#202124; --im-panel:#202124; --im-panel-elevated:#292a2d;
//           --im-tile-bg:#3c4043; --im-input-bg:#3c4043;
//           --im-surface3:#3c4043;
//           --im-border:rgba(255,255,255,.08); --im-border-soft:rgba(255,255,255,.06);
//           --im-ghost-bg:rgba(255,255,255,.08); --im-ghost-bg-soft:rgba(255,255,255,.04);
//           --im-text:#e8eaed; --im-text-soft:#e8eaed; --im-text-mute:#9aa0a6; --im-text-mute2:#9aa0a6;
//           --im-scrollbar: rgba(255,255,255,.2);
//         }
//         [data-theme="light"] {
//           --im-page:#f1f3f4; --im-panel:#ffffff; --im-panel-elevated:#ffffff;
//           --im-tile-bg:#e8eaed; --im-input-bg:#f1f3f4;
//           --im-surface3:#f1f3f4;
//           --im-border:rgba(32,33,36,.12); --im-border-soft:rgba(32,33,36,.08);
//           --im-ghost-bg:rgba(32,33,36,.05); --im-ghost-bg-soft:rgba(32,33,36,.035);
//           --im-text:#202124; --im-text-soft:#3c4043; --im-text-mute:#5f6368; --im-text-mute2:#5f6368;
//           --im-scrollbar: rgba(32,33,36,.22);
//         }
//         .im-root[data-theme="light"] .im-stage,
//         .im-root[data-theme="light"] .im-grid-tile,
//         .im-root[data-theme="light"] .im-strip-tile { box-shadow: 0 1px 4px rgba(32,33,36,.16); }
//         .im-root[data-theme="light"] input::placeholder { color: #9aa0a6; }

//         @keyframes soundWave { 0%,100%{ height:3px } 50%{ height:11px } }
//         .im-wave { display:flex; align-items:flex-end; gap:2px; height:12px; }
//         .im-wave span { width:2.5px; border-radius:2px; background:#81c995; display:block; animation: soundWave .7s ease-in-out infinite; }
//         .im-wave span:nth-child(2) { animation-delay:.12s }
//         .im-wave span:nth-child(3) { animation-delay:.24s }

//         .im-resize-handle { cursor: col-resize; }
//         .im-resize-handle:hover, .im-resize-handle.im-resizing { background: rgba(138,180,248,.35) !important; }
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
//         @keyframes speakGlow { 0%,100%{ box-shadow: 0 0 0 2px rgba(129,201,149,.55), 0 0 18px 1px rgba(129,201,149,.22); } 50%{ box-shadow: 0 0 0 2px rgba(129,201,149,.85), 0 0 24px 3px rgba(129,201,149,.3); } }
//         @keyframes imspin { to { transform: rotate(360deg); } }
//         .im-spin { animation: imspin 1s linear infinite; }

//         .im-root, .im-root * { box-sizing: border-box; }
//         .im-root { max-width: 100vw; }
//         .im-strip-tile, .im-stage, .im-grid-tile { transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease; }
//         .im-strip-tile:hover { transform: translateY(-2px); box-shadow: 0 4px 10px rgba(0,0,0,.3); }
//         .im-strip-tile-active { border: 2px solid #8ab4f8 !important; }
//         .im-speaking { animation: speakGlow 1.6s ease-in-out infinite; border-color: rgba(129,201,149,.6) !important; }
//         .im-ctrl-btn { transition: all .16s ease; min-width: 48px; min-height: 48px; }
//         .im-ctrl-btn:active { transform: scale(.94); }
//         .im-sidebar { animation: slideIn .22s ease; }
//         .im-stage { animation: fadeScaleIn .25s ease; }
//         .im-reaction-badge { animation: fadeScaleIn .2s ease; }
//         .im-sidebar-backdrop { display: none; }
//         .im-btn-label { display: inline; }
//         .im-btn-label-inline { display: inline; }

//         .im-root button:focus { outline: none; }
//         .im-root button:focus-visible, .im-root input:focus-visible { outline: 2px solid #8ab4f8; outline-offset: 2px; border-radius: 6px; }

//         .im-filmstrip { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,.18) transparent; }
//         .im-ctrlbar { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,.22) transparent; }
//         .im-mobile-stack { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,.18) transparent; overflow-y: auto; }

//         @media (max-width: 1439px) { .im-sidebar { width: 320px !important; } }
//         @media (max-width: 1199px) { .im-sidebar { width: 300px !important; } .im-ctrl-btn { padding: 9px 14px !important; } }
//         @media (max-width: 1023px) {
//           .im-mainarea { position: relative; }
//           .im-grid { grid-template-columns: repeat(var(--cols-tablet, 3), minmax(0, 1fr)) !important; }
//           .im-sidebar { position: absolute !important; top:0; right:0; bottom:0; width: min(320px, 88vw) !important; z-index: 40; box-shadow: -8px 0 24px rgba(0,0,0,.4); animation: slideIn .22s ease; }
//           .im-sidebar-backdrop { display: block; position: absolute; inset: 0; background: rgba(0,0,0,.35); z-index: 30; animation: fadeIn .18s ease; }
//           .im-handle { display: none !important; }
//         }
//         @media (max-width: 767px) {
//           .im-sidebar { width: 100% !important; max-width: 100% !important; }
//           .im-sessionname { display: none; }
//           .im-stage { border-radius: 12px !important; }
//           /* FIX (mobile UI): --cols-phone was never set anywhere, so this
//              rule's !important fallback of 3 silently overrode the 2-column
//              layout ParticipantGrid.jsx already computes for phone — that's
//              what was forcing 3 skinny columns and stretching every card
//              tall. Also stop forcing rows to equally fill 100% of the stage
//              height (grid-auto-rows: 1fr) — instead size each row from the
//              tile's own aspect ratio so cards stay balanced like Image 3,
//              with leftover space simply sitting empty below the grid. */
//           .im-grid {
//             grid-template-columns: repeat(var(--cols-phone, 2), minmax(0, 1fr)) !important;
//             grid-auto-rows: unset !important;
//             align-content: start !important;
//             gap: 10px !important;
//           }
//           .im-grid > div:not(.im-grid-others-cell) { aspect-ratio: 3 / 4; }
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

































import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Room, RoomEvent, Track, createLocalTracks } from "livekit-client";
import texoraLogo from "@/assets/texora-logo.webp";
import {
  AlertTriangle,
  Captions,
  Check,
  Clock,
  Copy,
  Disc2,
  ExternalLink,
  Hand,
  MessageSquare,
  Mic,
  MicOff,
  Minimize2,
  MonitorOff,
  MonitorPlay,
  MonitorUp,
  Moon,
  MoreVertical,
  PhoneOff,
  Send,
  Settings,
  SignalHigh,
  SmilePlus,
  Sun,
  Timer,
  User,
  UserMinus,
  UserPlus,
  Users,
  Video,
  VideoOff,
  X,
} from "lucide-react";
import {
  admitAllJoinRequests,
  admitJoinRequest,
  denyJoinRequest,
  endMeeting,
  getMeetingByJoinCode,
  listPendingJoinRequests,
  requestMeetingSummary,
} from "@/services/liveSessionService";
import { Btn } from "./components/Btn";
import { EmojiFloaters } from "./components/EmojiFloaters";
import { MobileMoreSheet } from "./components/MobileMoreSheet";
import { ParticipantGrid } from "./components/ParticipantGrid";
import { PersonRow } from "./components/PersonRow";
import { PiPPanel } from "./components/PiPPanel";
import { StageTile } from "./components/StageTile";
import { StripOverflow } from "./components/StripOverflow";
import { StripTile } from "./components/StripTile";
import { VideoTrackEl } from "./components/VideoTrackEl";
import { WaitingRoomPanel } from "./components/WaitingRoomPanel";
import {
  JOIN_CHIME_BATCH_MS,
  MEETING_STATUS_POLL_MS,
  RAISE_HAND_CHIME_BATCH_MS,
  REACTIONS,
  WAITING_ROOM_POLL_MS,
  getTime,
} from "./constants";
import { useDismiss } from "./hooks/useDismiss";
import { useElapsedTimer } from "./hooks/useElapsedTimer";
import { useResponsiveDevice } from "./hooks/useResponsiveDevice";
import { IM_STYLES } from "./styles/meetingStyles";
import {
  playAdmitChime,
  playDenyChime,
  playJoinChime,
  playJoinRequestChime,
  playMessageChime,
  playRaiseHandChime,
  primeNotificationAudio,
} from "./utils/notificationSound";
import { buildParticipantList } from "./utils/participants";
import { detectScreenShareSupport, detectSpeechRecognitionSupport } from "./utils/platformSupport";

/* ═════════════════════════════════════════════════════════════════
   MEETING ROOM — the actual LiveKit-connected Google-Meet-style room.
   Owns the Room instance directly; renders identically for host and
   guests except for host-only affordances (waiting room, recording,
   End meeting for everyone vs. Leave).
═════════════════════════════════════════════════════════════════ */
export function MeetingRoom({
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

  // Phase 1 — notification/tune bookkeeping. All plain refs so they never
  // trigger re-renders and never get reset by unrelated state updates.
  const initialSyncDoneRef = useRef(false); // becomes true once the initial room state (participants already in the call) has been loaded
  const knownIdentitiesRef = useRef(new Set()); // identities we've already accounted for — guards against duplicate ParticipantConnected fires (resyncs/reconnects)
  const joinChimeCoolingRef = useRef(false); // true while a just-played join chime is still "covering" its batch window
  const joinChimeCooldownTimerRef = useRef(null); // clears joinChimeCoolingRef once the batch window elapses
  const seenMessageIdsRef = useRef(new Set()); // messageId/eventId dedup so re-renders/redeliveries never replay the chime
  const notifiedWaitingIdsRef = useRef(new Set()); // join-request ids we've already notified about
  const firstWaitingPollRef = useRef(true); // first poll just establishes a baseline, it never fires notifications
  const waitingBatchTimerRef = useRef(null); // clears requestChimeCoolingRef once the batch window elapses
  const requestChimeCoolingRef = useRef(false); // true while a just-played request chime is still "covering" its batch window

  // Phase 2 — Raise Hand notification/tune bookkeeping. Plain refs, same
  // rationale as the Phase 1 ones above: they must never trigger a
  // re-render and must never be reset by an unrelated state update, since
  // they're read/written from inside the DataReceived handler which only
  // fires on the actual raise-hand event itself.
  const raisedHandStateRef = useRef({}); // identity -> boolean, read synchronously here (mirrors raisedHands state) so we can tell a genuine lower->raise transition apart from a redundant "raised: true" redelivery without depending on a possibly-stale closure over React state
  const raiseHandChimeCoolingRef = useRef(false); // true while a just-played Raise Hand chime is still "covering" its batch window
  const raiseHandChimeCooldownTimerRef = useRef(null); // clears raiseHandChimeCoolingRef once the batch window elapses

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

  // Warm up the notification AudioContext as early as possible — by the
  // time a real join/message/request happens, playback has zero startup
  // latency instead of paying that cost on the very first chime.
  useEffect(() => {
    primeNotificationAudio();
  }, []);
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
            // Dedupe by the sender's msgId/eventId — never replay the
            // chime (or the message) for the same event because of a
            // redelivery, and never trigger from React re-renders since
            // this handler only runs on an actual DataReceived event.
            const msgId =
              msg.msgId ||
              `${participant?.identity || "remote"}-${Date.now()}-${Math.random()}`;
            if (seenMessageIdsRef.current.has(msgId)) return;
            seenMessageIdsRef.current.add(msgId);

            setMessages((prev) => [
              ...prev,
              {
                id: msgId,
                name: participant?.name || participant?.identity || "Guest",
                senderIdentity: participant?.identity || null,
                text: msg.text,
                time: getTime(),
                self: false,
              },
            ]);
            playMessageChime();
          } else if (msg.type === "reaction" && msg.emoji) {
            showReaction(participant?.identity, msg.emoji);
          } else if (msg.type === "hand") {
            // The People-list/tile state updates immediately, for every
            // event, exactly like the join-notice path above — audio
            // batching below never affects participant state.
            const identity = participant?.identity;
            const nextRaised = !!msg.raised;
            const wasRaised = !!raisedHandStateRef.current[identity];
            raisedHandStateRef.current = {
              ...raisedHandStateRef.current,
              [identity]: nextRaised,
            };
            setRaisedHands((prev) => ({ ...prev, [identity]: nextRaised }));

            // Only a genuine "was not raised -> now raised" transition is
            // an actual Raise Hand event. This guards against:
            //  - Lower Hand (nextRaised === false) ever playing the chime.
            //  - A duplicate/redelivered "raised: true" event (resyncs,
            //    reconnects, redundant DataReceived firing) playing a
            //    second chime for the same still-raised hand.
            if (nextRaised && !wasRaised) {
              // Batch the AUDIO only: the FIRST raise of a burst plays its
              // chime immediately — no delay — and briefly "covers" a short
              // window so 2-4 hands raised together still produce exactly
              // ONE loud chime instead of overlapping sounds. Hands raised
              // with a real gap between them each get their own instant
              // chime, same pattern as the Phase 1 join chime above.
              if (!raiseHandChimeCoolingRef.current) {
                raiseHandChimeCoolingRef.current = true;
                playRaiseHandChime();
                raiseHandChimeCooldownTimerRef.current = setTimeout(() => {
                  raiseHandChimeCoolingRef.current = false;
                  raiseHandChimeCooldownTimerRef.current = null;
                }, RAISE_HAND_CHIME_BATCH_MS);
              }
            }
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
        // The People list always updates immediately, for every event —
        // audio batching below never affects participant state.
        rebuild();
        pushNotice(`${p.name || p.identity} joined the meeting`, "join");

        // Guard against the same identity firing ParticipantConnected
        // more than once (LiveKit resyncs/reconnects can redeliver this)
        // — one actual join must never produce more than one chime.
        if (knownIdentitiesRef.current.has(p.identity)) return;
        knownIdentitiesRef.current.add(p.identity);

        // Participants who were already in the room before WE connected
        // arrive via this same event during initial sync — they didn't
        // just join, so they never get a chime (or count toward a batch).
        if (!initialSyncDoneRef.current) return;

        // Batch the AUDIO only: the FIRST join of a burst plays its chime
        // immediately — no delay — and briefly "covers" a short window so
        // 2-4 people joining together still produce exactly ONE chime.
        // Joins separated by a real gap each get their own instant chime.
        if (!joinChimeCoolingRef.current) {
          joinChimeCoolingRef.current = true;
          playJoinChime();
          joinChimeCooldownTimerRef.current = setTimeout(() => {
            joinChimeCoolingRef.current = false;
            joinChimeCooldownTimerRef.current = null;
          }, JOIN_CHIME_BATCH_MS);
        }
      });
      room.on(RoomEvent.ParticipantDisconnected, (p) => {
        rebuild();
        pushNotice(`${p.name || p.identity} left the meeting`, "leave");
        knownIdentitiesRef.current.delete(p.identity);
        setRaisedHands((prev) => {
          const next = { ...prev };
          delete next[p.identity];
          return next;
        });
        // Also forget their last-known Raise Hand state — otherwise, if
        // they left with their hand still raised and later rejoin and
        // raise it again, that would look like a redundant "already
        // raised" redelivery and would wrongly be swallowed instead of
        // chiming as the genuine new Raise Hand event it is.
        if (raisedHandStateRef.current[p.identity] !== undefined) {
          const nextState = { ...raisedHandStateRef.current };
          delete nextState[p.identity];
          raisedHandStateRef.current = nextState;
        }
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
        // Anyone already in room.remoteParticipants at this point arrived
        // via ParticipantConnected as part of initial sync, not a live
        // join — mark them known now so a late-arriving sync event for
        // them (if any) is a no-op, then flip the flag so every
        // ParticipantConnected event from here on is a real, chime-worthy
        // join.
        room.remoteParticipants.forEach((p) =>
          knownIdentitiesRef.current.add(p.identity),
        );
        initialSyncDoneRef.current = true;
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
      if (joinChimeCooldownTimerRef.current) {
        clearTimeout(joinChimeCooldownTimerRef.current);
        joinChimeCooldownTimerRef.current = null;
      }
      joinChimeCoolingRef.current = false;
      initialSyncDoneRef.current = false;
      knownIdentitiesRef.current = new Set();
      if (raiseHandChimeCooldownTimerRef.current) {
        clearTimeout(raiseHandChimeCooldownTimerRef.current);
        raiseHandChimeCooldownTimerRef.current = null;
      }
      raiseHandChimeCoolingRef.current = false;
      raisedHandStateRef.current = {};
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
    // Fresh baseline every time this effect (re)starts.
    firstWaitingPollRef.current = true;
    notifiedWaitingIdsRef.current = new Set();

    const poll = async () => {
      try {
        const res = await listPendingJoinRequests(meetingId);
        const items = (res?.data || []).map((r) => ({
          requestId: r.requestId,
          name: r.guestName,
        }));

        if (firstWaitingPollRef.current) {
          // Requests already pending before we started watching (e.g.
          // the host refreshed mid-meeting) are a baseline, not "new" —
          // never notify/chime for those.
          items.forEach((w) => notifiedWaitingIdsRef.current.add(w.requestId));
          firstWaitingPollRef.current = false;
        } else {
          const newOnes = items.filter(
            (w) => !notifiedWaitingIdsRef.current.has(w.requestId),
          );
          if (newOnes.length > 0) {
            newOnes.forEach((w) => {
              notifiedWaitingIdsRef.current.add(w.requestId);
              pushNotice(`${w.name || "Someone"} wants to join`, "request");
            });
            // Same leading-edge batching pattern as live joins: the first
            // new request plays its chime immediately, and any others
            // landing in the same short window are covered by it instead
            // of each queuing their own delayed chime.
            if (!requestChimeCoolingRef.current) {
              requestChimeCoolingRef.current = true;
              playJoinRequestChime();
              waitingBatchTimerRef.current = setTimeout(() => {
                requestChimeCoolingRef.current = false;
                waitingBatchTimerRef.current = null;
              }, JOIN_CHIME_BATCH_MS);
            }
          }
        }

        // Drop ids for requests that are no longer pending (admitted/
        // denied from elsewhere) so this set never grows unbounded.
        const stillPending = new Set(items.map((w) => w.requestId));
        notifiedWaitingIdsRef.current.forEach((id) => {
          if (!stillPending.has(id)) notifiedWaitingIdsRef.current.delete(id);
        });

        setWaiting(items);
      } catch (_) {}
    };
    poll();
    waitingPollRef.current = setInterval(poll, WAITING_ROOM_POLL_MS);
    return () => {
      clearInterval(waitingPollRef.current);
      if (waitingBatchTimerRef.current) {
        clearTimeout(waitingBatchTimerRef.current);
        waitingBatchTimerRef.current = null;
      }
      requestChimeCoolingRef.current = false;
    };
  }, [isHost, meetingId, pushNotice]);
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
    const localIdentity = roomRef.current?.localParticipant?.identity || null;
    const msgId = `${localIdentity || "local"}-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`;
    // If our own reliable message ever echoes back to us, seenMessageIdsRef
    // already knows about it — no duplicate bubble, no duplicate chime.
    seenMessageIdsRef.current.add(msgId);
    setMessages((prev) => [
      ...prev,
      {
        id: msgId,
        name: "You",
        senderIdentity: localIdentity,
        text,
        time: getTime(),
        self: true,
      },
    ]);
    setMsgInput("");
    try {
      const payload = new TextEncoder().encode(
        JSON.stringify({ type: "chat", text, msgId }),
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
      const guest = waiting.find((w) => w.requestId === requestId);
      try {
        await admitJoinRequest(meetingId, requestId);
        setWaiting((prev) => prev.filter((w) => w.requestId !== requestId));
        notifiedWaitingIdsRef.current.delete(requestId);
        pushNotice(`Admitted ${guest?.name || "guest"}`, "admit");
        playAdmitChime();
      } catch (_) {}
    },
    [meetingId, waiting, pushNotice],
  );
  const handleDeny = useCallback(
    async (requestId) => {
      if (!meetingId) return;
      const guest = waiting.find((w) => w.requestId === requestId);
      try {
        await denyJoinRequest(meetingId, requestId);
        setWaiting((prev) => prev.filter((w) => w.requestId !== requestId));
        notifiedWaitingIdsRef.current.delete(requestId);
        pushNotice(`Denied ${guest?.name || "guest"}`, "deny");
        playDenyChime();
      } catch (_) {}
    },
    [meetingId, waiting, pushNotice],
  );
  const handleAdmitAll = useCallback(async () => {
    if (!meetingId) return;
    try {
      await admitAllJoinRequests(meetingId);
      waiting.forEach((w) => notifiedWaitingIdsRef.current.delete(w.requestId));
      setWaiting([]);
      pushNotice("Admitted everyone waiting", "admit");
      playAdmitChime();
    } catch (_) {}
  }, [meetingId, waiting, pushNotice]);

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
              ) : n.type === "request" ? (
                <UserPlus size={14} color="#fdd663" />
              ) : n.type === "admit" ? (
                <Check size={14} color="#81c995" />
              ) : n.type === "deny" ? (
                <X size={14} color="#f28b82" />
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
          /* FIX (mobile UI): --cols-phone was never set anywhere, so this
             rule's !important fallback of 3 silently overrode the 2-column
             layout ParticipantGrid.jsx already computes for phone — that's
             what was forcing 3 skinny columns and stretching every card
             tall. Also stop forcing rows to equally fill 100% of the stage
             height (grid-auto-rows: 1fr) — instead size each row from the
             tile's own aspect ratio so cards stay balanced like Image 3,
             with leftover space simply sitting empty below the grid. */
          .im-grid {
            grid-template-columns: repeat(var(--cols-phone, 2), minmax(0, 1fr)) !important;
            grid-auto-rows: unset !important;
            align-content: start !important;
            gap: 10px !important;
          }
          .im-grid > div:not(.im-grid-others-cell) { aspect-ratio: 3 / 4; }
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