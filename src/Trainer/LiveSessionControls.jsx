// import { useEffect, useRef, useState, useCallback } from "react";
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
//   FaPhoneSlash,
//   FaTimes,
//   FaDotCircle,
//   FaUsers,
//   FaPaperPlane,
//   FaMicrophone,
//   FaMicrophoneSlash,
//   FaVideo,
//   FaVideoSlash,
//   FaDesktop,
// } from "react-icons/fa";

// /* ─────────────────────────────────────────────────────────────
//    HELPERS
// ───────────────────────────────────────────────────────────── */
// const getTime = () =>
//   new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

// const attachTrack = (track, container) => {
//   if (!container || !track) return;
//   const el = track.attach();
//   if (track.kind === Track.Kind.Video) {
//     Object.assign(el.style, {
//       width: "100%",
//       height: "100%",
//       objectFit: "cover",
//       display: "block",
//     });
//   }
//   container.appendChild(el);
// };

// /* ─── Live Timer ─── */
// const useLiveTimer = (running) => {
//   const [secs, setSecs] = useState(0);
//   useEffect(() => {
//     if (!running) return;
//     const id = setInterval(() => setSecs((s) => s + 1), 1000);
//     return () => clearInterval(id);
//   }, [running]);
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
//   const remoteGridRef = useRef(null);
//   const localPreviewRef = useRef(null);
//   const localVideoTrackRef = useRef(null);
//   const localAudioTrackRef = useRef(null);
//   const screenTrackRef = useRef(null);
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

//   const timer = useLiveTimer(connected);

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

//   // const toggleRecording = useCallback(async () => {
//   //   if (!id) return;
//   //   // ✅ Synchronous ref check — closes the gap that React state (async,
//   //   // batched) leaves open on a very fast double-click.
//   //   if (recTogglingRef.current) return;
//   //   recTogglingRef.current = true;

//   //   setRecError(null);
//   //   setRecToggling(true);
//   //   try {
//   //     if (recording) {
//   //       await stopRecordingLive(id);
//   //       setRecording(false);
//   //     } else {
//   //       await startRecordingLive(id);
//   //       setRecording(true);
//   //     }
//   //   } catch (err) {
//   //     console.error(err);
//   //     setRecError(err?.response?.data?.error || "Failed to toggle recording.");
//   //   } finally {
//   //     setRecToggling(false);
//   //     recTogglingRef.current = false;
//   //   }
//   // }, [id, recording]);
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

//   // useEffect(() => {
//   //   if (!id) return;
//   //   const serverUrl = import.meta.env.VITE_LIVEKIT_URL || "ws://localhost:7880";

//   //   const start = async () => {
//   //     let token;
//   //     let room_name;

//   //     try {
//   //       const saved = sessionStorage.getItem("call_state");
//   //       const saved_parsed = saved ? JSON.parse(saved) : null;

//   //       if (saved_parsed?.token) {
//   //         token = saved_parsed.token;
//   //         room_name = saved_parsed.room;
//   //       } else {
//   //         const res = await startLiveSessionWithToken(id);
//   //         token = res?.data?.token;
//   //         room_name = res?.data?.room;
//   //         setSessionTitle(res?.data?.title || `Session ${id}`);
//   //       }

//   //       if (!token) {
//   //         console.error("No token returned");
//   //         return;
//   //       }
//   //     } catch (err) {
//   //       console.error("startLiveSessionWithToken failed:", err);
//   //       return;
//   //     }

//   //     const room = new Room({ adaptiveStream: true, dynacast: true });
//   //     roomRef.current = room;

//   //     try {
//   //       await room.connect(serverUrl, token);
//   //       sessionStorage.removeItem("call_state");
//   //       setConnected(true);
//   //       refreshParticipants();

//   //       // ✅ NEW: Fetch DB participants immediately on connect, then poll every 5s
//   //       fetchDbParticipants();
//   //       participantPollRef.current = setInterval(fetchDbParticipants, 5000);

//   //       // Auto-end poll every 20s
//   //       const token_for_poll =
//   //         localStorage.getItem("token") ||
//   //         localStorage.getItem("lms_token") ||
//   //         localStorage.getItem("accessToken") ||
//   //         (() => {
//   //           try {
//   //             return JSON.parse(localStorage.getItem("lms_user") || "{}")
//   //               ?.token;
//   //           } catch {
//   //             return null;
//   //           }
//   //         })();

//   //       autoEndPollRef.current = setInterval(async () => {
//   //         try {
//   //           const res = await fetch(
//   //             `${import.meta.env.VITE_API_BASE_URL || "http://localhost:9000"}/api/live-sessions/${id}`,
//   //             {
//   //               headers: token_for_poll
//   //                 ? { Authorization: `Bearer ${token_for_poll}` }
//   //                 : {},
//   //             },
//   //           );
//   //           if (!res.ok) return;
//   //           const data = await res.json();
//   //           if (data.status === "ENDED") {
//   //             clearInterval(autoEndPollRef.current);
//   //             setAutoEndWarning(true);
//   //             setTimeout(() => {
//   //               roomRef.current?.disconnect();
//   //               navigate("/trainer/live");
//   //             }, 3000);
//   //           }
//   //         } catch (_) {
//   //           // silently ignore network errors during poll
//   //         }
//   //       }, 20000);
//   //     } catch (err) {
//   //       console.error("LiveKit connect failed:", err);
//   //       return;
//   //     }

//   //     try {
//   //       const tracks = await createLocalTracks({ audio: true, video: true });
//   //       for (const track of tracks) {
//   //         await room.localParticipant.publishTrack(track);
//   //         if (track.kind === Track.Kind.Video) {
//   //           localVideoTrackRef.current = track;
//   //           if (localPreviewRef.current) {
//   //             const el = track.attach();
//   //             Object.assign(el.style, {
//   //               width: "100%",
//   //               height: "100%",
//   //               objectFit: "cover",
//   //               display: "block",
//   //               transform: "scaleX(-1)",
//   //             });
//   //             localPreviewRef.current.innerHTML = "";
//   //             localPreviewRef.current.appendChild(el);
//   //           }
//   //         }
//   //         if (track.kind === Track.Kind.Audio)
//   //           localAudioTrackRef.current = track;
//   //       }
//   //     } catch (err) {
//   //       console.error("createLocalTracks failed:", err);
//   //     }

//   //     room.remoteParticipants.forEach((participant) => {
//   //       participant.trackPublications.forEach((pub) => {
//   //         if (pub.isSubscribed && pub.track)
//   //           attachTrack(pub.track, remoteGridRef.current);
//   //       });
//   //     });

//   //     room.on(RoomEvent.TrackSubscribed, (track) =>
//   //       attachTrack(track, remoteGridRef.current),
//   //     );
//   //     room.on(RoomEvent.TrackUnsubscribed, (track) =>
//   //       track.detach().forEach((el) => el.remove()),
//   //     );
//   //     room.on(RoomEvent.ParticipantConnected, (p) => {
//   //       refreshParticipants();
//   //       // ✅ NEW: also refresh DB list when someone joins via WebRTC
//   //       fetchDbParticipants();
//   //       pushSystem(`${p.name || p.identity} joined`);
//   //     });
//   //     room.on(RoomEvent.ParticipantDisconnected, (p) => {
//   //       refreshParticipants();
//   //       pushSystem(`${p.name || p.identity} left`);
//   //     });
//   //     room.on(RoomEvent.DataReceived, (payload, participant) => {
//   //       try {
//   //         const decoded = new TextDecoder().decode(payload);
//   //         const msg = JSON.parse(decoded);
//   //         if (msg.text)
//   //           setMessages((prev) => [
//   //             ...prev,
//   //             {
//   //               id: Date.now(),
//   //               user: participant?.name || participant?.identity || "Student",
//   //               text: msg.text,
//   //               time: getTime(),
//   //               self: false,
//   //             },
//   //           ]);
//   //       } catch (_) {}
//   //     });
//   //     room.on(RoomEvent.Disconnected, () => setConnected(false));
//   //   };

//   //   start();

//   //   return () => {
//   //     if (autoEndPollRef.current) clearInterval(autoEndPollRef.current);
//   //     // ✅ NEW: clear participant poll on unmount
//   //     if (participantPollRef.current) clearInterval(participantPollRef.current);
//   //     roomRef.current?.disconnect();
//   //   };
//   // }, [id]);

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

//       try {
//         const saved = sessionStorage.getItem("call_state");
//         const saved_parsed = saved ? JSON.parse(saved) : null;

//         if (saved_parsed?.token) {
//           token = saved_parsed.token;
//           room_name = saved_parsed.room;
//         } else {
//           const res = await startLiveSessionWithToken(id);
//           token = res?.data?.token;
//           room_name = res?.data?.room;
//           setSessionTitle(res?.data?.title || `Session ${id}`);
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

//       const room = new Room({ adaptiveStream: true, dynacast: true });
//       roomRef.current = room;

//       try {
//         await room.connect(serverUrl, token);
//         sessionStorage.removeItem("call_state");
//         setConnected(true);
//         refreshParticipants();

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

//       try {
//         const tracks = await createLocalTracks({ audio: true, video: true });
//         for (const track of tracks) {
//           await room.localParticipant.publishTrack(track);
//           if (track.kind === Track.Kind.Video) {
//             localVideoTrackRef.current = track;
//             if (localPreviewRef.current) {
//               const el = track.attach();
//               Object.assign(el.style, {
//                 width: "100%",
//                 height: "100%",
//                 objectFit: "cover",
//                 display: "block",
//                 transform: "scaleX(-1)",
//               });
//               localPreviewRef.current.innerHTML = "";
//               localPreviewRef.current.appendChild(el);
//             }
//           }
//           if (track.kind === Track.Kind.Audio)
//             localAudioTrackRef.current = track;
//         }
//       } catch (err) {
//         console.error("createLocalTracks failed:", err);
//       }

//       room.remoteParticipants.forEach((participant) => {
//         participant.trackPublications.forEach((pub) => {
//           if (pub.isSubscribed && pub.track)
//             attachTrack(pub.track, remoteGridRef.current);
//         });
//       });

//       room.on(RoomEvent.TrackSubscribed, (track) =>
//         attachTrack(track, remoteGridRef.current),
//       );
//       room.on(RoomEvent.TrackUnsubscribed, (track) =>
//         track.detach().forEach((el) => el.remove()),
//       );
//       room.on(RoomEvent.ParticipantConnected, (p) => {
//         refreshParticipants();
//         fetchDbParticipants();
//         pushSystem(`${p.name || p.identity} joined`);
//       });
//       room.on(RoomEvent.ParticipantDisconnected, (p) => {
//         refreshParticipants();
//         pushSystem(`${p.name || p.identity} left`);
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
//   }, [micOn]);

//   const toggleCam = useCallback(async () => {
//     const track = localVideoTrackRef.current;
//     if (!track) return;
//     if (camOn) {
//       await track.mute();
//       if (localPreviewRef.current)
//         localPreviewRef.current.style.visibility = "hidden";
//     } else {
//       await track.unmute();
//       if (localPreviewRef.current)
//         localPreviewRef.current.style.visibility = "visible";
//     }
//     setCamOn((v) => !v);
//   }, [camOn]);

//   const restoreCamPip = useCallback(() => {
//     if (localVideoTrackRef.current && camOn && localPreviewRef.current) {
//       const el = localVideoTrackRef.current.attach();
//       Object.assign(el.style, {
//         width: "100%",
//         height: "100%",
//         objectFit: "cover",
//         display: "block",
//         transform: "scaleX(-1)",
//       });
//       localPreviewRef.current.innerHTML = "";
//       localPreviewRef.current.appendChild(el);
//       localPreviewRef.current.style.visibility = "visible";
//     }
//   }, [camOn]);

//   const toggleScreen = useCallback(async () => {
//     const room = roomRef.current;
//     if (!room) return;
//     if (screenOn) {
//       try {
//         await room.localParticipant.setScreenShareEnabled(false);
//       } catch (_) {}
//       screenTrackRef.current = null;
//       setScreenOn(false);
//       restoreCamPip();
//     } else {
//       try {
//         const pub = await room.localParticipant.setScreenShareEnabled(true);
//         if (!pub) return;
//         const screenTrack = pub.track ?? pub.videoTrack ?? null;
//         screenTrackRef.current = screenTrack;
//         if (screenTrack && localPreviewRef.current) {
//           const el = screenTrack.attach();
//           Object.assign(el.style, {
//             width: "100%",
//             height: "100%",
//             objectFit: "contain",
//             display: "block",
//           });
//           localPreviewRef.current.innerHTML = "";
//           localPreviewRef.current.appendChild(el);
//           localPreviewRef.current.style.visibility = "visible";
//         }
//         setScreenOn(true);
//         const mediaTrack =
//           screenTrack?.mediaStreamTrack ?? pub.track?.mediaStreamTrack ?? null;
//         if (mediaTrack) {
//           mediaTrack.addEventListener(
//             "ended",
//             () => {
//               room.localParticipant
//                 .setScreenShareEnabled(false)
//                 .catch(() => {});
//               screenTrackRef.current = null;
//               setScreenOn(false);
//               restoreCamPip();
//             },
//             { once: true },
//           );
//         }
//       } catch (err) {
//         if (err?.name !== "NotAllowedError")
//           console.warn("Screen share failed:", err);
//       }
//     }
//   }, [screenOn, restoreCamPip]);

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
//     roomRef.current?.disconnect();
//     navigate("/trainer/live");
//   }, [id, navigate]);

//   // ✅ NEW: active students = those who joined but haven't left yet
//   const activeDbParticipants = dbParticipants.filter(
//     (p) => p.leaveTime === null || p.leaveTime === undefined,
//   );

//   return (
//     <div style={S.root}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
//         @keyframes livePulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(1.5)}}
//         @keyframes recBlink{0%,100%{opacity:1}50%{opacity:.2}}
//         @keyframes spin{to{transform:rotate(360deg)}}
//         @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
//         @keyframes slideIn{from{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translateY(0)}}
//       `}</style>

//       {/* Auto-end warning toast */}
//       {autoEndWarning && (
//         <div style={S.autoEndToast}>
//           <span style={{ fontSize: 16 }}>⏱️</span>
//           <div>
//             <div style={{ fontWeight: 700, fontSize: 13 }}>
//               Session time is up!
//             </div>
//             <div style={{ fontSize: 11, opacity: 0.8 }}>
//               Session was auto-ended by the system. Redirecting...
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── TOP BAR ── */}
//       <div style={S.topBar}>
//         <div style={S.topLeft}>
//           <div style={S.liveBadge}>
//             <span style={S.liveDot} />
//             LIVE
//           </div>
//           <span style={S.timerText}>{timer}</span>
//           <span style={S.sessionTitle}>{sessionTitle}</span>
//           {recording && (
//             <div style={S.recBadge}>
//               <FaDotCircle
//                 size={8}
//                 style={{ animation: "recBlink 1.5s infinite" }}
//               />{" "}
//               REC
//             </div>
//           )}
//         </div>

//         <div style={S.topRight}>
//           <div style={S.pCountBadge}>
//             <FaUsers size={11} />
//             {/* ✅ UPDATED: show real DB count instead of LiveKit count */}
//             <span>{activeDbParticipants.length} Participants</span>
//           </div>
//           {/* <button
//             style={{ ...S.recBtn, ...(recording ? S.recBtnOn : S.recBtnOff) }}
//             onClick={() => setRecording((r) => !r)}
//           >
//             <FaDotCircle size={10} /> {recording ? "Recording" : "Record"}
//           </button> */}
//           <button
//             style={{
//               ...S.recBtn,
//               ...(recording ? S.recBtnOn : S.recBtnOff),
//               opacity: recToggling ? 0.6 : 1,
//               cursor: recToggling ? "not-allowed" : "pointer",
//             }}
//             onClick={toggleRecording}
//             disabled={recToggling}
//           >
//             <FaDotCircle size={10} />{" "}
//             {recToggling ? "Please wait…" : recording ? "Recording" : "Record"}
//           </button>
//           {recError && (
//             <span
//               style={{
//                 fontSize: 10,
//                 color: "#f87171",
//                 marginLeft: 4,
//                 fontFamily: "'Poppins',sans-serif",
//               }}
//             >
//               ⚠️ {recError}
//             </span>
//           )}
//           <button style={S.endBtn} onClick={handleEndSession}>
//             <FaPhoneSlash size={12} /> End Session
//           </button>
//           <button style={S.closeBtn} onClick={() => navigate("/trainer/live")}>
//             <FaTimes size={14} />
//           </button>
//         </div>
//       </div>

//       {/* ── BODY ── */}
//       <div style={S.body}>
//         {/* VIDEO AREA */}
//         <div style={S.videoArea}>
//           {connected ? (
//             <>
//               <div ref={remoteGridRef} style={S.remoteGrid} />
//               <div style={S.pip}>
//                 <div
//                   ref={localPreviewRef}
//                   style={{
//                     width: "100%",
//                     height: "100%",
//                     visibility: camOn || screenOn ? "visible" : "hidden",
//                   }}
//                 />
//                 {!camOn && !screenOn && (
//                   <div style={S.pipOff}>
//                     <FaVideoSlash size={18} color="#64748b" />
//                     <span style={S.pipOffTxt}>Cam Off</span>
//                   </div>
//                 )}
//                 <span style={S.pipLabel}>
//                   You (Trainer){screenOn ? " · Sharing" : ""}
//                 </span>
//               </div>
//               <div style={S.ctrlBar}>
//                 <CtrlBtn
//                   icon={micOn ? <FaMicrophone /> : <FaMicrophoneSlash />}
//                   label={micOn ? "Mute" : "Unmute"}
//                   danger={!micOn}
//                   onClick={toggleMic}
//                 />
//                 <CtrlBtn
//                   icon={camOn ? <FaVideo /> : <FaVideoSlash />}
//                   label={camOn ? "Stop Cam" : "Start Cam"}
//                   danger={!camOn}
//                   onClick={toggleCam}
//                 />
//                 <CtrlBtn
//                   icon={<FaDesktop />}
//                   label={screenOn ? "Stop Share" : "Share Screen"}
//                   active={screenOn}
//                   onClick={toggleScreen}
//                 />
//                 <CtrlBtn
//                   icon={<span style={{ fontSize: 16 }}>💬</span>}
//                   label="Chat"
//                   active={sidebarOpen && sidebarTab === "chat"}
//                   onClick={() => {
//                     if (sidebarOpen && sidebarTab === "chat")
//                       setSidebarOpen(false);
//                     else {
//                       setSidebarTab("chat");
//                       setSidebarOpen(true);
//                     }
//                   }}
//                 />
//                 <CtrlBtn
//                   icon={<FaUsers />}
//                   label="People"
//                   active={sidebarOpen && sidebarTab === "participants"}
//                   onClick={() => {
//                     if (sidebarOpen && sidebarTab === "participants")
//                       setSidebarOpen(false);
//                     else {
//                       setSidebarTab("participants");
//                       setSidebarOpen(true);
//                     }
//                   }}
//                 />
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
//             {sidebarOpen ? (
//               <>
//                 <Chevron dir="right" />
//                 <div style={S.handleLine} />
//                 <Chevron dir="left" />
//               </>
//             ) : (
//               <>
//                 <Chevron dir="left" />
//                 <div style={S.handleLine} />
//                 <Chevron dir="right" />
//               </>
//             )}
//           </div>
//         </div>

//         {/* SIDEBAR */}
//         <div style={{ ...S.sidebar, width: sidebarOpen ? 340 : 0 }}>
//           {sidebarOpen && (
//             <>
//               <div style={S.tabRow}>
//                 <TabBtn
//                   active={sidebarTab === "chat"}
//                   label="💬 Chat"
//                   onClick={() => setSidebarTab("chat")}
//                 />
//                 <TabBtn
//                   active={sidebarTab === "participants"}
//                   label="👥 People"
//                   onClick={() => setSidebarTab("participants")}
//                 />
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
//                       placeholder="Message students…"
//                     />
//                     <button style={S.sendBtn} onClick={sendMessage}>
//                       <FaPaperPlane size={13} />
//                     </button>
//                   </div>
//                 </>
//               )}

//               {sidebarTab === "participants" && (
//                 <div style={S.peopleList}>
//                   {/* ✅ UPDATED: Trainer row always at top */}
//                   <div style={S.pRow}>
//                     <div
//                       style={{
//                         ...S.pAv,
//                         background: "linear-gradient(135deg,#0ea5e9,#6366f1)",
//                       }}
//                     >
//                       T
//                     </div>
//                     <span style={S.pName}>You (Trainer)</span>
//                     <span style={S.hostTag}>Host</span>
//                     <span style={S.youTag}>You</span>
//                   </div>

//                   {/* ✅ NEW: Real students from DB with email + join time */}
//                   {activeDbParticipants.map((p) => (
//                     <div key={p.id} style={S.pRow}>
//                       <div
//                         style={{
//                           ...S.pAv,
//                           background: "linear-gradient(135deg,#8b5cf6,#ec4899)",
//                         }}
//                       >
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
//                         <div
//                           style={{
//                             fontSize: 10,
//                             color: "#475569",
//                             fontFamily: "'Poppins',sans-serif",
//                           }}
//                         >
//                           Joined{" "}
//                           {p.joinTime
//                             ? new Date(p.joinTime).toLocaleTimeString([], {
//                                 hour: "2-digit",
//                                 minute: "2-digit",
//                               })
//                             : "—"}
//                         </div>
//                       </div>
//                       <span
//                         style={{
//                           fontSize: 9,
//                           background: "rgba(52,211,153,.12)",
//                           color: "#6ee7b7",
//                           padding: "2px 8px",
//                           borderRadius: 6,
//                           fontWeight: 700,
//                           fontFamily: "'Poppins',sans-serif",
//                           letterSpacing: "0.06em",
//                         }}
//                       >
//                         LIVE
//                       </span>
//                     </div>
//                   ))}

//                   {activeDbParticipants.length === 0 && (
//                     <div style={S.emptyPeople}>
//                       <FaUsers size={28} style={{ opacity: 0.3 }} />
//                       <p
//                         style={{
//                           fontSize: 12,
//                           color: "#475569",
//                           marginTop: 8,
//                           fontFamily: "'Poppins',sans-serif",
//                         }}
//                       >
//                         No students joined yet
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ─────────────────────────────────────────────────────────────
//    SUB-COMPONENTS
// ───────────────────────────────────────────────────────────── */
// const Chevron = ({ dir }) => (
//   <svg width="5" height="10" viewBox="0 0 6 12" fill="none">
//     {dir === "right" ? (
//       <path
//         d="M1 1L6 6L1 11"
//         stroke="#64748b"
//         strokeWidth="1.5"
//         strokeLinecap="round"
//       />
//     ) : (
//       <path
//         d="M5 1L0 6L5 11"
//         stroke="#64748b"
//         strokeWidth="1.5"
//         strokeLinecap="round"
//       />
//     )}
//   </svg>
// );

// const TabBtn = ({ active, label, onClick }) => (
//   <button
//     onClick={onClick}
//     style={{
//       flex: 1,
//       padding: "11px 0",
//       border: "none",
//       background: "transparent",
//       borderBottom: active ? "2px solid #22d3ee" : "2px solid transparent",
//       color: active ? "#22d3ee" : "#475569",
//       fontFamily: "'Poppins',sans-serif",
//       fontSize: 12,
//       fontWeight: 700,
//       cursor: "pointer",
//       transition: "all .15s",
//       ...(active ? { background: "rgba(34,211,238,0.06)" } : {}),
//     }}
//   >
//     {label}
//   </button>
// );

// const PersonRow = ({ name, isHost, self }) => (
//   <div style={S.pRow}>
//     <div
//       style={{
//         ...S.pAv,
//         background: self
//           ? "linear-gradient(135deg,#0ea5e9,#6366f1)"
//           : "linear-gradient(135deg,#8b5cf6,#ec4899)",
//       }}
//     >
//       {(name || "?")[0].toUpperCase()}
//     </div>
//     <span style={S.pName}>{name}</span>
//     {isHost && <span style={S.hostTag}>Host</span>}
//     {self && <span style={S.youTag}>You</span>}
//   </div>
// );

// const CtrlBtn = ({ icon, label, active, danger, onClick }) => {
//   const [hov, setHov] = useState(false);
//   const bg = danger
//     ? hov
//       ? "#991b1b"
//       : "#7f1d1d"
//     : active
//       ? hov
//         ? "rgba(34,211,238,.3)"
//         : "rgba(34,211,238,.16)"
//       : hov
//         ? "rgba(255,255,255,.14)"
//         : "rgba(255,255,255,.07)";
//   const col = danger ? "#fca5a5" : active ? "#67e8f9" : "#cbd5e1";
//   return (
//     <button
//       onClick={onClick}
//       onMouseEnter={() => setHov(true)}
//       onMouseLeave={() => setHov(false)}
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         gap: 5,
//         background: bg,
//         color: col,
//         border: danger
//           ? "1px solid rgba(239,68,68,.3)"
//           : active
//             ? "1px solid rgba(34,211,238,.3)"
//             : "1px solid transparent",
//         borderRadius: 14,
//         padding: "10px 20px",
//         cursor: "pointer",
//         fontSize: 11,
//         fontWeight: 600,
//         fontFamily: "'Poppins',sans-serif",
//         letterSpacing: 0.3,
//         transition: "all .18s",
//         minWidth: 68,
//       }}
//     >
//       <span style={{ fontSize: 18 }}>{icon}</span>
//       <span>{label}</span>
//     </button>
//   );
// };

// /* ─────────────────────────────────────────────────────────────
//    STYLES
// ───────────────────────────────────────────────────────────── */
// const S = {
//   root: {
//     position: "fixed",
//     inset: 0,
//     zIndex: 9999,
//     display: "flex",
//     flexDirection: "column",
//     background: "#07090f",
//     color: "#e2e8f0",
//     fontFamily: "'Poppins','DM Sans','Segoe UI',sans-serif",
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
//     fontFamily: "'Poppins',sans-serif",
//     boxShadow: "0 8px 32px rgba(244,63,94,0.5)",
//     animation: "slideIn 0.4s ease",
//     minWidth: 300,
//   },
//   topBar: {
//     flexShrink: 0,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: "8px 20px",
//     background: "#0d1117",
//     borderBottom: "1px solid rgba(255,255,255,.07)",
//     zIndex: 10,
//   },
//   topLeft: { display: "flex", alignItems: "center", gap: 10 },
//   topRight: { display: "flex", alignItems: "center", gap: 8 },
//   liveBadge: {
//     display: "flex",
//     alignItems: "center",
//     gap: 5,
//     padding: "4px 10px",
//     borderRadius: 999,
//     background: "rgba(244,63,94,.12)",
//     border: "1px solid rgba(244,63,94,.28)",
//     fontSize: 9,
//     fontWeight: 800,
//     letterSpacing: "0.15em",
//     color: "#f43f5e",
//     fontFamily: "'Poppins',sans-serif",
//   },
//   liveDot: {
//     width: 7,
//     height: 7,
//     borderRadius: "50%",
//     background: "#f43f5e",
//     animation: "livePulse 1.2s ease-in-out infinite",
//     display: "inline-block",
//   },
//   timerText: {
//     fontFamily: "monospace",
//     fontSize: 13,
//     color: "#94a3b8",
//     letterSpacing: 0.5,
//   },
//   sessionTitle: {
//     fontSize: 13,
//     fontWeight: 700,
//     color: "#f1f5f9",
//     fontFamily: "'Poppins',sans-serif",
//   },
//   recBadge: {
//     display: "flex",
//     alignItems: "center",
//     gap: 5,
//     padding: "3px 9px",
//     borderRadius: 999,
//     background: "rgba(244,63,94,.1)",
//     border: "1px solid rgba(244,63,94,.2)",
//     fontSize: 9,
//     fontWeight: 700,
//     letterSpacing: "0.1em",
//     color: "#fca5a5",
//     fontFamily: "'Poppins',sans-serif",
//   },
//   pCountBadge: {
//     display: "flex",
//     alignItems: "center",
//     gap: 6,
//     padding: "5px 12px",
//     borderRadius: 10,
//     background: "rgba(255,255,255,.05)",
//     border: "1px solid rgba(255,255,255,.09)",
//     fontSize: 11,
//     color: "#94a3b8",
//     fontFamily: "'Poppins',sans-serif",
//   },
//   recBtn: {
//     display: "flex",
//     alignItems: "center",
//     gap: 5,
//     padding: "5px 12px",
//     borderRadius: 10,
//     fontSize: 10,
//     fontWeight: 700,
//     cursor: "pointer",
//     fontFamily: "'Poppins',sans-serif",
//     letterSpacing: "0.05em",
//     transition: "all .15s",
//   },
//   recBtnOn: {
//     background: "rgba(244,63,94,.15)",
//     border: "1px solid rgba(244,63,94,.3)",
//     color: "#f87171",
//   },
//   recBtnOff: {
//     background: "rgba(255,255,255,.05)",
//     border: "1px solid rgba(255,255,255,.09)",
//     color: "#94a3b8",
//   },
//   endBtn: {
//     display: "flex",
//     alignItems: "center",
//     gap: 6,
//     padding: "7px 16px",
//     borderRadius: 10,
//     border: "none",
//     background: "linear-gradient(135deg,#dc2626,#f43f5e)",
//     color: "#fff",
//     fontSize: 12,
//     fontWeight: 700,
//     cursor: "pointer",
//     fontFamily: "'Poppins',sans-serif",
//     letterSpacing: "0.03em",
//   },
//   closeBtn: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     width: 32,
//     height: 32,
//     borderRadius: 9,
//     border: "1px solid rgba(255,255,255,.09)",
//     background: "rgba(255,255,255,.04)",
//     color: "#64748b",
//     cursor: "pointer",
//     transition: "all .15s",
//   },
//   body: { flex: 1, display: "flex", overflow: "hidden", minHeight: 0 },
//   videoArea: {
//     flex: 1,
//     position: "relative",
//     overflow: "hidden",
//     minWidth: 0,
//     background: "#05070d",
//   },
//   remoteGrid: {
//     position: "absolute",
//     inset: 0,
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
//     gap: 4,
//     padding: 4,
//     alignContent: "center",
//     paddingBottom: 80,
//   },
//   pip: {
//     position: "absolute",
//     bottom: 90,
//     right: 16,
//     width: 176,
//     height: 118,
//     borderRadius: 14,
//     overflow: "hidden",
//     border: "2px solid rgba(255,255,255,.12)",
//     background: "#0d1117",
//     boxShadow: "0 8px 32px rgba(0,0,0,.7)",
//     zIndex: 10,
//   },
//   pipOff: {
//     position: "absolute",
//     inset: 0,
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 5,
//     background: "#0f172a",
//   },
//   pipOffTxt: {
//     fontSize: 10,
//     color: "#475569",
//     fontFamily: "'Poppins',sans-serif",
//   },
//   pipLabel: {
//     position: "absolute",
//     bottom: 6,
//     left: 8,
//     fontSize: 9,
//     color: "#fff",
//     background: "rgba(0,0,0,.6)",
//     padding: "2px 8px",
//     borderRadius: 6,
//     pointerEvents: "none",
//     fontFamily: "'Poppins',sans-serif",
//     fontWeight: 600,
//     letterSpacing: "0.04em",
//   },
//   ctrlBar: {
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 8,
//     padding: "10px 24px",
//     background: "rgba(13,17,23,.92)",
//     backdropFilter: "blur(12px)",
//     borderTop: "1px solid rgba(255,255,255,.07)",
//     zIndex: 20,
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
//     border: "3px solid rgba(34,211,238,.2)",
//     borderTop: "3px solid #22d3ee",
//     borderRadius: "50%",
//     animation: "spin .8s linear infinite",
//   },
//   loadingText: {
//     fontSize: 12,
//     color: "#475569",
//     fontFamily: "'Poppins',sans-serif",
//     fontWeight: 600,
//   },
//   handle: {
//     flexShrink: 0,
//     width: 14,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     background: "#0d1117",
//     borderLeft: "1px solid rgba(255,255,255,.05)",
//     borderRight: "1px solid rgba(255,255,255,.05)",
//     cursor: "pointer",
//     zIndex: 5,
//     transition: "background .2s",
//   },
//   handlePill: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     gap: 3,
//     padding: "10px 3px",
//     borderRadius: 8,
//     background: "#1e293b",
//     border: "1px solid rgba(255,255,255,.1)",
//   },
//   handleLine: { width: 1, height: 12, background: "rgba(255,255,255,.15)" },
//   sidebar: {
//     flexShrink: 0,
//     background: "#0d1117",
//     borderLeft: "1px solid rgba(255,255,255,.07)",
//     display: "flex",
//     flexDirection: "column",
//     overflow: "hidden",
//     transition: "width .25s ease",
//   },
//   tabRow: {
//     flexShrink: 0,
//     display: "flex",
//     borderBottom: "1px solid rgba(255,255,255,.07)",
//   },
//   msgList: {
//     flex: 1,
//     overflowY: "auto",
//     padding: "12px 14px",
//     display: "flex",
//     flexDirection: "column",
//     gap: 10,
//     minHeight: 0,
//   },
//   sysRow: { display: "flex", justifyContent: "center" },
//   sysBubble: {
//     fontSize: 10,
//     color: "#475569",
//     fontStyle: "italic",
//     background: "rgba(255,255,255,.04)",
//     borderRadius: 8,
//     padding: "3px 10px",
//     fontFamily: "'Poppins',sans-serif",
//   },
//   msgBlock: { display: "flex", flexDirection: "column", gap: 2 },
//   msgUser: {
//     fontSize: 9,
//     color: "#64748b",
//     fontWeight: 700,
//     fontFamily: "'Poppins',sans-serif",
//     letterSpacing: "0.04em",
//   },
//   msgBubble: {
//     maxWidth: "88%",
//     padding: "7px 11px",
//     borderRadius: 12,
//     fontSize: 12,
//     color: "#f1f5f9",
//     lineHeight: 1.45,
//     fontFamily: "'Poppins',sans-serif",
//   },
//   bubbleSelf: {
//     background: "linear-gradient(135deg,#0e7490,#22d3ee)",
//     alignSelf: "flex-end",
//     borderBottomRightRadius: 2,
//   },
//   bubbleOther: { background: "#1e293b", borderBottomLeftRadius: 2 },
//   inputRow: {
//     flexShrink: 0,
//     display: "flex",
//     gap: 8,
//     padding: "10px 12px",
//     borderTop: "1px solid rgba(255,255,255,.07)",
//   },
//   chatInput: {
//     flex: 1,
//     background: "#1e293b",
//     border: "1px solid rgba(255,255,255,.08)",
//     borderRadius: 10,
//     padding: "8px 12px",
//     color: "#e2e8f0",
//     fontSize: 12,
//     fontFamily: "'Poppins',sans-serif",
//     fontWeight: 500,
//     outline: "none",
//   },
//   sendBtn: {
//     flexShrink: 0,
//     background: "linear-gradient(135deg,#0e7490,#22d3ee)",
//     border: "none",
//     borderRadius: 10,
//     padding: "0 14px",
//     color: "#0f172a",
//     cursor: "pointer",
//     display: "flex",
//     alignItems: "center",
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
//   emptyPeople: {
//     flex: 1,
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 8,
//     paddingTop: 32,
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
//     fontSize: 13,
//     fontWeight: 800,
//     flexShrink: 0,
//     fontFamily: "'Poppins',sans-serif",
//   },
//   pName: {
//     flex: 1,
//     fontSize: 12,
//     color: "#cbd5e1",
//     fontFamily: "'Poppins',sans-serif",
//     fontWeight: 500,
//   },
//   hostTag: {
//     fontSize: 9,
//     background: "rgba(34,211,238,.12)",
//     color: "#67e8f9",
//     padding: "2px 8px",
//     borderRadius: 6,
//     fontWeight: 700,
//     fontFamily: "'Poppins',sans-serif",
//     letterSpacing: "0.06em",
//   },
//   youTag: {
//     fontSize: 9,
//     background: "rgba(52,211,153,.12)",
//     color: "#6ee7b7",
//     padding: "2px 8px",
//     borderRadius: 6,
//     fontWeight: 700,
//     fontFamily: "'Poppins',sans-serif",
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
  FaPhoneSlash,
  FaTimes,
  FaDotCircle,
  FaUsers,
  FaPaperPlane,
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
  FaDesktop,
} from "react-icons/fa";

/* ─────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────── */
const getTime = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

/* ─────────────────────────────────────────────────────────────
   ✅ NEW: MEETING PERSISTENCE (bug #2)
   Stores {token, room, startedAt} per session id in localStorage
   (survives refresh, back/forward, tab close+reopen — sessionStorage
   only survives refresh within the same tab). Reconnect uses the
   SAME token instead of asking the backend to start a new session, and
   the timer is re-derived from `startedAt` (wall clock), so it never
   resets to 00:00. Cleared only when the trainer explicitly ends the
   session or the backend reports it as ENDED — never on refresh/
   navigate-away, since those should reconnect, not reset.
───────────────────────────────────────────────────────────── */
const CALL_STATE_PREFIX = "trainer_live_state_";
const CALL_STATE_TTL_MS = 8 * 60 * 60 * 1000; // stale-token safety net

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
    // legacy key written by the launcher screens (TrainerLiveClasses.jsx)
    sessionStorage.removeItem("call_state");
  } catch (_) {}
};

// Reads the legacy sessionStorage bootstrap value written the moment the
// trainer clicks "Go Live" / "Start Now" — kept as a fallback source for
// the very first connect, before we've had a chance to write our own
// localStorage entry.
const readLegacyCallState = () => {
  try {
    const raw = sessionStorage.getItem("call_state");
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
};

/* ✅ FIX (bug #3): camera and screen-share are now tracked as two
   completely separate publications (Track.Source.Camera vs
   Track.Source.ScreenShare) instead of being shoved into the same PIP
   <div> and swapped via innerHTML. That swapping was the root cause of
   "screen share dikhta hai video tile ke andar" — this snapshot builder
   gives the renderer everything it needs to put the screen share in the
   big stage and every camera (including the trainer's own) into small
   tiles, Meet/Zoom/Teams style. */
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

    /* ✅ FIX (bug #1): every remote mic gets a dedicated, always-mounted
       <audio> element (see RemoteAudio below) so playback never depends
       on whatever DOM node happened to be around when the track showed
       up. Local mic is intentionally excluded to avoid echo. */
    if (!isLocal && micPub && micPub.track) {
      audioTracks.push({ id: `${baseId}-audio`, track: micPub.track });
    }
  };

  addParticipant(room.localParticipant, true);
  room.remoteParticipants.forEach((p) => addParticipant(p, false));

  return { camTiles, screenTile, audioTracks };
};

/* ✅ FIX (bug #4): tile size shrinks in steps as participant count grows
   so 10 / 20 / 50 / 100+ students all still fit and stay readable —
   mirrors how Meet/Zoom shrink tiles instead of infinitely scrolling. */
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

const GALLERY_PAGE_SIZE = 49; // 7x7 — same cap Meet uses per page

/* ✅ NEW: full device/breakpoint system (not just one isMobile flag) so
   the meeting UI genuinely adapts across phones, tablets, laptops and
   desktops instead of just "mobile vs not".

   phone     ≤ 480px   → iPhone SE/12/13/14/15 portrait, small Androids
   phoneLg   481–767px → iPhone Pro Max / Plus, most phones landscape
   tablet    768–1023px→ iPad mini (768 portrait), iPad portrait, small
                          Android tablets
   laptop    1024–1365px→ iPad / iPad Pro landscape, small laptops (13")
   desktop   ≥ 1366px  → laptops 15"+, external monitors, desktops
*/
const getDevice = (w) => {
  if (w <= 480) return "phone";
  if (w <= 767) return "phoneLg";
  if (w <= 1023) return "tablet";
  if (w <= 1365) return "laptop";
  return "desktop";
};

// Per-device tuning tables used across the video layer
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

// ✅ Reusable hook: tracks live viewport width/height and resolves the
// current device bucket + its config, updating on resize/orientation change.
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

/* ─── Live Timer ───
   ✅ FIX (bug #2): the old version counted local ticks from 0, so any
   refresh/remount reset it to 00:00. This version derives elapsed time
   from `Date.now() - startedAtMs` on every tick, where startedAtMs is
   the persisted, cross-refresh meeting start time. A re-render (e.g.
   after a refresh) simply recomputes the correct elapsed duration
   instead of restarting a counter — it's also immune to background-tab
   timer throttling, since it reads the wall clock instead of trusting
   how many 1s ticks actually fired. */
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
  // ✅ NEW: ref for participant DB polling interval
  const participantPollRef = useRef(null);

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
  // ✅ NEW: DB participants (real emails from backend)
  const [dbParticipants, setDbParticipants] = useState([]);

  /* ✅ NEW — React-state-driven track/tile model (fixes bugs #1–#4).
     Camera tiles, the (single) active screen-share tile, and remote
     audio tracks are now derived from LiveKit's own room state via
     buildSnapshot() instead of being manually pushed into DOM refs. */
  const [camTiles, setCamTiles] = useState([]);
  const [screenTile, setScreenTile] = useState(null);
  const [remoteAudioTracks, setRemoteAudioTracks] = useState([]);
  const [audioBlocked, setAudioBlocked] = useState(false);
  const [galleryPage, setGalleryPage] = useState(0);

  // ✅ NEW: live device/breakpoint detection — phone, phoneLg, tablet
  // (iPad mini/iPad portrait), laptop (iPad landscape/13"), desktop.
  const { w: viewportW, device, cfg: deviceCfg } = useResponsiveDevice();
  const isCompactDevice = device === "phone" || device === "phoneLg"; // drawer sidebar
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

  // ✅ NEW: wall-clock anchor for the meeting timer — set once on first
  // connect (or restored from persisted/legacy state on reconnect) and
  // never reset for the lifetime of this meeting.
  const [meetingStartedAt, setMeetingStartedAt] = useState(null);
  const timer = useElapsedTimer(meetingStartedAt);

  // ✅ NEW: floating Picture-in-Picture window state.
  const [pipWindow, setPipWindow] = useState(null);
  const pipVideoRef = useRef(null); // fallback target for native video PiP
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

  // ✅ NEW: single source of truth for the video layer — call this any
  // time a track/participant event fires and the UI will re-derive who
  // goes on the main stage (screen share) vs. the thumbnail tiles.
  const rebuild = useCallback(() => {
    const snap = buildSnapshot(roomRef.current);
    setCamTiles(snap.camTiles);
    setScreenTile(snap.screenTile);
    setRemoteAudioTracks(snap.audioTracks);
  }, []);

  // ✅ NEW: unlocks any <audio> elements the browser blocked from
  // autoplaying (common cause of "student ko audio receive nahi horaha")
  const enableAllAudio = useCallback(() => {
    document
      .querySelectorAll('audio[data-remote-audio="1"]')
      .forEach((el) => {
        el.muted = false;
        el.play().catch(() => {});
      });
    setAudioBlocked(false);
  }, []);

  // const toggleRecording = useCallback(async () => {
  //   if (!id) return;
  //   // ✅ Synchronous ref check — closes the gap that React state (async,
  //   // batched) leaves open on a very fast double-click.
  //   if (recTogglingRef.current) return;
  //   recTogglingRef.current = true;

  //   setRecError(null);
  //   setRecToggling(true);
  //   try {
  //     if (recording) {
  //       await stopRecordingLive(id);
  //       setRecording(false);
  //     } else {
  //       await startRecordingLive(id);
  //       setRecording(true);
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     setRecError(err?.response?.data?.error || "Failed to toggle recording.");
  //   } finally {
  //     setRecToggling(false);
  //     recTogglingRef.current = false;
  //   }
  // }, [id, recording]);
  const toggleRecording = useCallback(async () => {
    if (!id) return;
    if (recTogglingRef.current) return;
    // ✅ NEW — block clicks during the post-toggle cooldown window too,
    // not just while the request itself is in flight.
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
      // ✅ NEW — 12s cooldown after every toggle (success OR failure),
      // since LiveKit/egress needs time to tear down/spin up on this
      // all-in-one WSL setup before it can reliably accept another call.
      recCooldownRef.current = true;
      setTimeout(() => {
        recCooldownRef.current = false;
      }, 12000);
    }
  }, [id, recording]);

  // ✅ NEW: fetch real participants from DB
  const fetchDbParticipants = useCallback(async () => {
    if (!id) return;
    try {
      const res = await getSessionParticipants(id);
      setDbParticipants(res.data || []);
    } catch (_) {
      // silently ignore
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const serverUrl = import.meta.env.VITE_LIVEKIT_URL || "ws://localhost:7880";

    // ✅ Synchronous ref guard — checked before any await, so React
    // StrictMode's dev double-mount (or any fast double-invoke) can only
    // ever run start() once per real mount.
    if (startedRef.current) {
      return;
    }
    startedRef.current = true;

    const start = async () => {
      let token;
      let room_name;
      let startedAt;

      try {
        // ✅ FIX (bug #2): reconnect priority is
        //   1) our own persisted state for THIS session id (localStorage —
        //      survives refresh / back / tab close+reopen), which also
        //      carries the original startedAt so the timer never resets;
        //   2) the legacy sessionStorage bootstrap value written the
        //      instant the trainer clicked "Go Live" (first load only);
        //   3) otherwise, ask the backend for a fresh token (first time
        //      this trainer is opening this session).
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
          startedRef.current = false; // allow retry
          return;
        }
      } catch (err) {
        console.error("startLiveSessionWithToken failed:", err);
        startedRef.current = false; // allow retry on failure
        return;
      }

      // Persist immediately so a refresh that happens mid-connect still
      // has something to reconnect with, and set the timer anchor.
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

        const token_for_poll =
          localStorage.getItem("token") ||
          localStorage.getItem("lms_token") ||
          localStorage.getItem("accessToken") ||
          (() => {
            try {
              return JSON.parse(localStorage.getItem("lms_user") || "{}")
                ?.token;
            } catch {
              return null;
            }
          })();

        autoEndPollRef.current = setInterval(async () => {
          try {
            const res = await fetch(
              `${import.meta.env.VITE_API_BASE_URL || "http://localhost:9000"}/api/live-sessions/${id}`,
              {
                headers: token_for_poll
                  ? { Authorization: `Bearer ${token_for_poll}` }
                  : {},
              },
            );
            if (!res.ok) return;
            const data = await res.json();
            if (data.status === "ENDED") {
              clearInterval(autoEndPollRef.current);
              clearPersistedCallState(id);
              setAutoEndWarning(true);
              setTimeout(() => {
                roomRef.current?.disconnect();
                navigate("/trainer/live");
              }, 3000);
            }
          } catch (_) {
            // silently ignore network errors during poll
          }
        }, 20000);
      } catch (err) {
        console.error("LiveKit connect failed:", err);
        startedRef.current = false; // allow retry on failure
        return;
      }

      // ✅ FIX (bug #1/#2): explicit audio constraints (echo cancellation /
      // noise suppression / AGC) make the trainer's mic publish reliably
      // and at usable quality; camera preview no longer depends on manual
      // DOM injection — rebuild() below derives it from room state.
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
      roomRef.current?.disconnect();
      // ✅ Reset on genuine unmount so a real remount (navigating away and
      // back, e.g.) is able to start a fresh session normally.
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

  /* ✅ FIX (bug #3): screen share and camera are independent publications
     now, so starting/stopping a share never touches the camera track —
     rebuild() alone re-derives which tile is "main" (screenTile if any
     screen is live) vs. the small tiles (camTiles, always including the
     trainer's own camera). No more DOM innerHTML swapping. */
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

  /* ─────────────────────────────────────────────────────────────
     ✅ NEW: PICTURE-IN-PICTURE (bug #4)
     Whatever is currently the "main" thing on stage — the active
     screen share if any, otherwise a camera — is what floats. Uses the
     Document Picture-in-Picture API (real floating window, same as
     Meet/Zoom/Teams) where the browser supports it, and falls back to
     the standard single-<video> Picture-in-Picture API otherwise.
  ───────────────────────────────────────────────────────────── */
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

      // Carry the app's fonts/colors into the floating window so the
      // reused <VideoTile>/control styles render correctly there too.
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
      pip.document.body.style.background = "#0d1117";
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

  // Auto float when the trainer switches tabs/apps or minimizes; auto
  // return when they come back — only while actually in a live meeting.
  // This is what makes background navigation (bug #3) feel seamless:
  // nothing here pauses audio/video/screen-share/timer/participants,
  // it only changes where the video is *displayed*.
  useEffect(() => {
    if (!connected) return;
    const onVisibility = () => {
      if (document.hidden) {
        openPiP();
      } else {
        userClosedPipRef.current = false;
        closePiP();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [connected, openPiP, closePiP]);

  // Always close any floating window on genuine unmount.
  useEffect(() => {
    return () => closePiP();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    if (autoEndPollRef.current) clearInterval(autoEndPollRef.current);
    // ✅ NEW: clear participant poll on end session too
    if (participantPollRef.current) clearInterval(participantPollRef.current);
    try {
      await endLiveSession(id);
    } catch (_) {}
    // ✅ Only clear persisted state here — a genuine, trainer-initiated
    // end of the session. Refreshing, hitting Back, or just navigating
    // away (the ✕ button) must NOT clear this, so the trainer reconnects
    // to the same meeting with the timer intact next time.
    clearPersistedCallState(id);
    roomRef.current?.disconnect();
    navigate("/trainer/live");
  }, [id, navigate]);

  // ✅ NEW: active students = those who joined but haven't left yet
  const activeDbParticipants = dbParticipants.filter(
    (p) => p.leaveTime === null || p.leaveTime === undefined,
  );

  // ✅ NEW: sidebar geometry per device bucket (phone/iPhone → full-width
  // drawer, tablet/iPad mini → wide drawer, laptop/iPad landscape →
  // narrower fixed panel, desktop → full fixed panel).
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
          boxShadow: sidebarOpen ? "-8px 0 24px rgba(0,0,0,.5)" : "none",
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
          boxShadow: sidebarOpen ? "-8px 0 24px rgba(0,0,0,.5)" : "none",
        };
      case "panelNarrow":
        return { width: sidebarOpen ? 296 : 0 };
      case "panelFull":
      default:
        return { width: sidebarOpen ? 340 : 0 };
    }
  })();

  return (
    <div style={S.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        @keyframes livePulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(1.5)}}
        @keyframes recBlink{0%,100%{opacity:1}50%{opacity:.2}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideIn{from{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      {/* Auto-end warning toast */}
      {autoEndWarning && (
        <div style={S.autoEndToast}>
          <span style={{ fontSize: 16 }}>⏱️</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13 }}>
              Session time is up!
            </div>
            <div style={{ fontSize: 11, opacity: 0.8 }}>
              Session was auto-ended by the system. Redirecting...
            </div>
          </div>
        </div>
      )}

      {/* ── TOP BAR — ✅ responsive: trims to essentials on phones ── */}
      <div style={{ ...S.topBar, ...(isCompactDevice ? S.topBarCompact : null) }}>
        <div style={S.topLeft}>
          <div style={S.liveBadge}>
            <span style={S.liveDot} />
            LIVE
          </div>
          <span style={S.timerText}>{timer}</span>
          {!deviceCfg.hideSessionTitle && (
            <span style={S.sessionTitle}>{sessionTitle}</span>
          )}
          {recording && (
            <div style={S.recBadge}>
              <FaDotCircle
                size={8}
                style={{ animation: "recBlink 1.5s infinite" }}
              />{" "}
              {!isCompactDevice && "REC"}
            </div>
          )}
        </div>

        <div style={S.topRight}>
          <div style={S.pCountBadge}>
            <FaUsers size={11} />
            {/* ✅ UPDATED: show real DB count instead of LiveKit count */}
            <span>
              {activeDbParticipants.length}
              {!deviceCfg.hidePBadgeLabel && " Participants"}
            </span>
          </div>
          <button
            style={{
              ...S.recBtn,
              ...(recording ? S.recBtnOn : S.recBtnOff),
              opacity: recToggling ? 0.6 : 1,
              cursor: recToggling ? "not-allowed" : "pointer",
            }}
            onClick={toggleRecording}
            disabled={recToggling}
          >
            <FaDotCircle size={10} />
            {!isCompactDevice &&
              (recToggling
                ? " Please wait…"
                : recording
                  ? " Recording"
                  : " Record")}
          </button>
          {recError && !isCompactDevice && (
            <span
              style={{
                fontSize: 10,
                color: "#f87171",
                marginLeft: 4,
                fontFamily: "'Poppins',sans-serif",
              }}
            >
              ⚠️ {recError}
            </span>
          )}
          <button style={S.endBtn} onClick={handleEndSession}>
            <FaPhoneSlash size={12} />
            {!isCompactDevice && " End Session"}
          </button>
          <button style={S.closeBtn} onClick={() => navigate("/trainer/live")}>
            <FaTimes size={14} />
          </button>
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={S.body}>
        {/* VIDEO AREA */}
        <div style={S.videoArea}>
          {connected ? (
            <>
              {screenTile ? (
                // ── Google Meet / Zoom / Teams "presenting" layout ──
                // Shared screen = big main stage. Every camera
                // (trainer's own included) = small filmstrip tile whose
                // size is tuned per device (phone/tablet/laptop/desktop).
                <div
                  style={{
                    ...S.stageWrap,
                    ...(isCompactDevice ? S.stageWrapCompact : null),
                  }}
                >
                  <div style={S.mainStage}>
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
                // ── Gallery view (no active share): responsive grid
                // that adapts tile size for 1 .. 100+ participants across
                // every device, with pagination so 50–100+ stay smooth. ──
                <GalleryGrid
                  tiles={camTiles}
                  page={galleryPage}
                  onPageChange={setGalleryPage}
                  device={device}
                  minScale={deviceCfg.galleryMinScale}
                />
              )}

              {/* ✅ FIX (bug #1): always-mounted hidden audio elements —
                  playback no longer depends on which visual tile a
                  participant happens to be in. */}
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
                <button style={S.enableAudioBtn} onClick={enableAllAudio}>
                  🔊 Click to enable audio
                </button>
              )}

              <div
                style={{
                  ...S.ctrlBar,
                  ...(deviceCfg.ctrlCompact ? S.ctrlBarCompact : null),
                }}
              >
                <CtrlBtn
                  icon={micOn ? <FaMicrophone /> : <FaMicrophoneSlash />}
                  label={micOn ? "Mute" : "Unmute"}
                  danger={!micOn}
                  onClick={toggleMic}
                  compact={deviceCfg.ctrlCompact}
                />
                <CtrlBtn
                  icon={camOn ? <FaVideo /> : <FaVideoSlash />}
                  label={camOn ? "Stop Cam" : "Start Cam"}
                  danger={!camOn}
                  onClick={toggleCam}
                  compact={deviceCfg.ctrlCompact}
                />
                <CtrlBtn
                  icon={<FaDesktop />}
                  label={screenOn ? "Stop Share" : "Share Screen"}
                  active={screenOn}
                  onClick={toggleScreen}
                  compact={deviceCfg.ctrlCompact}
                />
                <CtrlBtn
                  icon={<span style={{ fontSize: 16 }}>💬</span>}
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
                  icon={<span style={{ fontSize: 15 }}>🗔</span>}
                  label={pipWindow ? "Return" : "Pop out"}
                  active={!!pipWindow}
                  compact={deviceCfg.ctrlCompact}
                  onClick={() => (pipWindow ? returnToMeeting() : openPiP())}
                />
                <CtrlBtn
                  icon={<FaUsers />}
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
              </div>
            </>
          ) : (
            <div style={S.loadingBox}>
              <div style={S.spinner} />
              <p style={S.loadingText}>Starting live session…</p>
            </div>
          )}
        </div>

        {/* DRAG HANDLE */}
        <div
          style={S.handle}
          onClick={() => setSidebarOpen((o) => !o)}
          title="Toggle panel"
        >
          <div style={S.handlePill}>
            {sidebarOpen ? (
              <>
                <Chevron dir="right" />
                <div style={S.handleLine} />
                <Chevron dir="left" />
              </>
            ) : (
              <>
                <Chevron dir="left" />
                <div style={S.handleLine} />
                <Chevron dir="right" />
              </>
            )}
          </div>
        </div>

        {/* SIDEBAR — ✅ responsive per device: full-width drawer on phones,
            wide overlay drawer on tablets/iPad mini, narrower fixed panel
            on laptops/iPad-landscape, full panel on desktop — instead of
            squeezing the video area to nothing everywhere. */}
        <div style={{ ...S.sidebar, ...sidebarLayoutStyle }}>
          {sidebarOpen && (
            <>
              <div style={S.tabRow}>
                <TabBtn
                  active={sidebarTab === "chat"}
                  label="💬 Chat"
                  onClick={() => setSidebarTab("chat")}
                />
                <TabBtn
                  active={sidebarTab === "participants"}
                  label="👥 People"
                  onClick={() => setSidebarTab("participants")}
                />
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
                      placeholder="Message students…"
                    />
                    <button style={S.sendBtn} onClick={sendMessage}>
                      <FaPaperPlane size={13} />
                    </button>
                  </div>
                </>
              )}

              {sidebarTab === "participants" && (
                <div style={S.peopleList}>
                  {/* ✅ UPDATED: Trainer row always at top */}
                  <div style={S.pRow}>
                    <div
                      style={{
                        ...S.pAv,
                        background: "linear-gradient(135deg,#0ea5e9,#6366f1)",
                      }}
                    >
                      T
                    </div>
                    <span style={S.pName}>You (Trainer)</span>
                    <span style={S.hostTag}>Host</span>
                    <span style={S.youTag}>You</span>
                  </div>

                  {/* ✅ NEW: Real students from DB with email + join time */}
                  {activeDbParticipants.map((p) => (
                    <div key={p.id} style={S.pRow}>
                      <div
                        style={{
                          ...S.pAv,
                          background: "linear-gradient(135deg,#8b5cf6,#ec4899)",
                        }}
                      >
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
                        <div
                          style={{
                            fontSize: 10,
                            color: "#475569",
                            fontFamily: "'Poppins',sans-serif",
                          }}
                        >
                          Joined{" "}
                          {p.joinTime
                            ? new Date(p.joinTime).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "—"}
                        </div>
                      </div>
                      <span
                        style={{
                          fontSize: 9,
                          background: "rgba(52,211,153,.12)",
                          color: "#6ee7b7",
                          padding: "2px 8px",
                          borderRadius: 6,
                          fontWeight: 700,
                          fontFamily: "'Poppins',sans-serif",
                          letterSpacing: "0.06em",
                        }}
                      >
                        LIVE
                      </span>
                    </div>
                  ))}

                  {activeDbParticipants.length === 0 && (
                    <div style={S.emptyPeople}>
                      <FaUsers size={28} style={{ opacity: 0.3 }} />
                      <p
                        style={{
                          fontSize: 12,
                          color: "#475569",
                          marginTop: 8,
                          fontFamily: "'Poppins',sans-serif",
                        }}
                      >
                        No students joined yet
                      </p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Hidden element powering the native-video PiP fallback for
          browsers without the Document Picture-in-Picture API. */}
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

      {/* ✅ NEW: floating meeting window — a real separate browser
          window when Document PiP is supported, so it keeps rendering
          live updates (video, timer) even while the main tab is
          backgrounded, with one click ("Return to meeting") to come
          back. */}
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

/* ✅ NEW: renders exactly one participant's video (or an avatar
   placeholder when their camera is off / not yet subscribed). Attaches
   the LiveKit track imperatively via a ref effect — this is the only
   DOM-manipulation left, and it's scoped to a single element instead of
   a shared container, which is what caused the old mixing bugs. */
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

  return (
    <div style={small ? S.filmstripVideoWrap : S.stageVideoWrap}>
      {showVideo ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted // local monitors itself silently; remote audio comes from RemoteAudio
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
          <FaMicrophoneSlash size={small ? 8 : 10} style={{ marginRight: 4 }} />
        )}
        {tile?.name}
      </span>
    </div>
  );
};

/* ✅ NEW: content rendered inside the floating Document PiP window —
   the current main-stage tile (screen share if live, else a camera),
   the live timer, quick mic/cam toggles, and a one-click way back. */
const pipCtrlBtnStyle = (danger) => ({
  width: 32,
  height: 32,
  borderRadius: 10,
  border: "none",
  background: danger ? "#7f1d1d" : "rgba(255,255,255,.1)",
  color: danger ? "#fca5a5" : "#e2e8f0",
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
      background: "#0d1117",
      fontFamily: "'Poppins',sans-serif",
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
            background: "#ef4444",
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
        padding: 8,
        background: "#111826",
      }}
    >
      <button onClick={onToggleMic} style={pipCtrlBtnStyle(!micOn)}>
        {micOn ? <FaMicrophone size={13} /> : <FaMicrophoneSlash size={13} />}
      </button>
      <button onClick={onToggleCam} style={pipCtrlBtnStyle(!camOn)}>
        {camOn ? <FaVideo size={13} /> : <FaVideoSlash size={13} />}
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

/* ✅ FIX (bug #1): dedicated, always-mounted audio element per remote
   mic. autoPlay + explicit .play() with a fallback "click to enable"
   banner handles browsers that block unprompted audio playback — the
   most common reason a student silently never receives the trainer's
   voice. */
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

/* ✅ FIX (bug #4): responsive, auto-sizing, paginated grid so the UI
   stays smooth and readable whether there are 2, 20, 50, or 100+
   participants. */
const GalleryGrid = ({ tiles, page, onPageChange, device = "desktop", minScale = 1 }) => {
  const totalPages = Math.max(1, Math.ceil(tiles.length / GALLERY_PAGE_SIZE));
  const clampedPage = Math.min(page, totalPages - 1);
  const visible = tiles.slice(
    clampedPage * GALLERY_PAGE_SIZE,
    clampedPage * GALLERY_PAGE_SIZE + GALLERY_PAGE_SIZE,
  );
  // Base min-width from participant count, then scaled per device so
  // phones/iPad mini get proportionally smaller (but still readable)
  // tiles than laptops/desktops for the same participant count.
  const minW = Math.max(90, Math.round(getTileMinWidth(tiles.length) * minScale));

  return (
    <div style={S.galleryWrap}>
      <div
        style={{
          ...S.galleryGrid,
          gap: device === "phone" ? 4 : device === "phoneLg" ? 5 : 6,
          padding: device === "phone" ? 4 : device === "phoneLg" ? 6 : 8,
          gridTemplateColumns: `repeat(auto-fit, minmax(${minW}px, 1fr))`,
        }}
      >
        {visible.map((t) => (
          <div key={t.id} style={S.galleryTile}>
            <VideoTile tile={t} device={device} />
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div style={S.pager}>
          <button
            style={S.pagerBtn}
            disabled={clampedPage === 0}
            onClick={() => onPageChange(Math.max(0, clampedPage - 1))}
          >
            ‹
          </button>
          <span style={S.pagerText}>
            {clampedPage + 1} / {totalPages}
          </span>
          <button
            style={S.pagerBtn}
            disabled={clampedPage === totalPages - 1}
            onClick={() =>
              onPageChange(Math.min(totalPages - 1, clampedPage + 1))
            }
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
};

const Chevron = ({ dir }) => (
  <svg width="5" height="10" viewBox="0 0 6 12" fill="none">
    {dir === "right" ? (
      <path
        d="M1 1L6 6L1 11"
        stroke="#64748b"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    ) : (
      <path
        d="M5 1L0 6L5 11"
        stroke="#64748b"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    )}
  </svg>
);

const TabBtn = ({ active, label, onClick }) => (
  <button
    onClick={onClick}
    style={{
      flex: 1,
      padding: "11px 0",
      border: "none",
      background: "transparent",
      borderBottom: active ? "2px solid #22d3ee" : "2px solid transparent",
      color: active ? "#22d3ee" : "#475569",
      fontFamily: "'Poppins',sans-serif",
      fontSize: 12,
      fontWeight: 700,
      cursor: "pointer",
      transition: "all .15s",
      ...(active ? { background: "rgba(34,211,238,0.06)" } : {}),
    }}
  >
    {label}
  </button>
);

const PersonRow = ({ name, isHost, self }) => (
  <div style={S.pRow}>
    <div
      style={{
        ...S.pAv,
        background: self
          ? "linear-gradient(135deg,#0ea5e9,#6366f1)"
          : "linear-gradient(135deg,#8b5cf6,#ec4899)",
      }}
    >
      {(name || "?")[0].toUpperCase()}
    </div>
    <span style={S.pName}>{name}</span>
    {isHost && <span style={S.hostTag}>Host</span>}
    {self && <span style={S.youTag}>You</span>}
  </div>
);

const CtrlBtn = ({ icon, label, active, danger, onClick, compact }) => {
  const [hov, setHov] = useState(false);
  const bg = danger
    ? hov
      ? "#991b1b"
      : "#7f1d1d"
    : active
      ? hov
        ? "rgba(34,211,238,.3)"
        : "rgba(34,211,238,.16)"
      : hov
        ? "rgba(255,255,255,.14)"
        : "rgba(255,255,255,.07)";
  const col = danger ? "#fca5a5" : active ? "#67e8f9" : "#cbd5e1";
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      title={label}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: compact ? 0 : 5,
        background: bg,
        color: col,
        border: danger
          ? "1px solid rgba(239,68,68,.3)"
          : active
            ? "1px solid rgba(34,211,238,.3)"
            : "1px solid transparent",
        borderRadius: compact ? 12 : 14,
        padding: compact ? "9px 12px" : "10px 20px",
        cursor: "pointer",
        fontSize: 11,
        fontWeight: 600,
        fontFamily: "'Poppins',sans-serif",
        letterSpacing: 0.3,
        transition: "all .18s",
        minWidth: compact ? 44 : 68,
      }}
    >
      <span style={{ fontSize: compact ? 17 : 18 }}>{icon}</span>
      {!compact && <span>{label}</span>}
    </button>
  );
};

/* ─────────────────────────────────────────────────────────────
   STYLES
───────────────────────────────────────────────────────────── */
const S = {
  root: {
    position: "fixed",
    inset: 0,
    zIndex: 9999,
    display: "flex",
    flexDirection: "column",
    background: "#07090f",
    color: "#e2e8f0",
    fontFamily: "'Poppins','DM Sans','Segoe UI',sans-serif",
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
    fontFamily: "'Poppins',sans-serif",
    boxShadow: "0 8px 32px rgba(244,63,94,0.5)",
    animation: "slideIn 0.4s ease",
    minWidth: 300,
  },
  topBar: {
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "8px 20px",
    background: "#0d1117",
    borderBottom: "1px solid rgba(255,255,255,.07)",
    zIndex: 10,
  },
  topBarCompact: {
    padding: "6px 10px",
    flexWrap: "nowrap",
  },
  topLeft: { display: "flex", alignItems: "center", gap: 10, minWidth: 0 },
  topRight: { display: "flex", alignItems: "center", gap: 8 },
  liveBadge: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    padding: "4px 10px",
    borderRadius: 999,
    background: "rgba(244,63,94,.12)",
    border: "1px solid rgba(244,63,94,.28)",
    fontSize: 9,
    fontWeight: 800,
    letterSpacing: "0.15em",
    color: "#f43f5e",
    fontFamily: "'Poppins',sans-serif",
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "#f43f5e",
    animation: "livePulse 1.2s ease-in-out infinite",
    display: "inline-block",
  },
  timerText: {
    fontFamily: "monospace",
    fontSize: 13,
    color: "#94a3b8",
    letterSpacing: 0.5,
  },
  sessionTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: "#f1f5f9",
    fontFamily: "'Poppins',sans-serif",
  },
  recBadge: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    padding: "3px 9px",
    borderRadius: 999,
    background: "rgba(244,63,94,.1)",
    border: "1px solid rgba(244,63,94,.2)",
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: "0.1em",
    color: "#fca5a5",
    fontFamily: "'Poppins',sans-serif",
  },
  pCountBadge: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "5px 12px",
    borderRadius: 10,
    background: "rgba(255,255,255,.05)",
    border: "1px solid rgba(255,255,255,.09)",
    fontSize: 11,
    color: "#94a3b8",
    fontFamily: "'Poppins',sans-serif",
  },
  recBtn: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    padding: "5px 12px",
    borderRadius: 10,
    fontSize: 10,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "'Poppins',sans-serif",
    letterSpacing: "0.05em",
    transition: "all .15s",
  },
  recBtnOn: {
    background: "rgba(244,63,94,.15)",
    border: "1px solid rgba(244,63,94,.3)",
    color: "#f87171",
  },
  recBtnOff: {
    background: "rgba(255,255,255,.05)",
    border: "1px solid rgba(255,255,255,.09)",
    color: "#94a3b8",
  },
  endBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "7px 16px",
    borderRadius: 10,
    border: "none",
    background: "linear-gradient(135deg,#dc2626,#f43f5e)",
    color: "#fff",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "'Poppins',sans-serif",
    letterSpacing: "0.03em",
  },
  closeBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 32,
    height: 32,
    borderRadius: 9,
    border: "1px solid rgba(255,255,255,.09)",
    background: "rgba(255,255,255,.04)",
    color: "#64748b",
    cursor: "pointer",
    transition: "all .15s",
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
    background: "#05070d",
  },
  /* ── Google Meet–style "presenting" layout: big stage + filmstrip ── */
  stageWrap: {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    paddingBottom: 84,
    gap: 6,
    padding: "6px 6px 84px",
  },
  mainStage: {
    flex: 1,
    minHeight: 0,
    borderRadius: 12,
    overflow: "hidden",
    background: "#000",
    position: "relative",
  },
  stageVideoWrap: {
    width: "100%",
    height: "100%",
    position: "relative",
    background: "#000",
  },
  stageWrapCompact: {
    padding: "4px 4px 84px",
    gap: 4,
  },
  filmstrip: {
    flexShrink: 0,
    display: "flex",
    gap: 8,
    overflowX: "auto",
    overflowY: "hidden",
    padding: "2px 2px 6px",
    scrollbarWidth: "thin",
    WebkitOverflowScrolling: "touch",
  },
  filmstripCompact: {
    padding: "2px 2px 4px",
    gap: 5,
  },
  filmstripTile: {
    flexShrink: 0,
    width: 168,
    height: 100,
    borderRadius: 10,
    overflow: "hidden",
    background: "#0d1117",
    border: "1px solid rgba(255,255,255,.08)",
    position: "relative",
  },
  filmstripVideoWrap: {
    width: "100%",
    height: "100%",
    position: "relative",
    background: "#0d1117",
  },

  /* ── Gallery (grid) view when nobody is screen-sharing ── */
  galleryWrap: {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    paddingBottom: 80,
  },
  galleryGrid: {
    flex: 1,
    display: "grid",
    gap: 6,
    padding: 8,
    alignContent: "center",
    overflow: "hidden",
  },
  galleryTile: {
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
    background: "#0d1117",
    border: "1px solid rgba(255,255,255,.06)",
    aspectRatio: "16 / 9",
  },
  pager: {
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: "6px 0 12px",
  },
  pagerBtn: {
    width: 30,
    height: 30,
    borderRadius: "50%",
    border: "1px solid rgba(255,255,255,.12)",
    background: "rgba(255,255,255,.06)",
    color: "#e2e8f0",
    fontSize: 16,
    cursor: "pointer",
  },
  pagerText: {
    fontSize: 11,
    color: "#94a3b8",
    fontFamily: "'Poppins',sans-serif",
    fontWeight: 600,
  },

  /* ── shared tile internals ── */
  avatarWrap: {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#0f172a",
  },
  avatarCircle: {
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    color: "#fff",
    background: "linear-gradient(135deg,#0ea5e9,#6366f1)",
    fontFamily: "'Poppins',sans-serif",
  },
  tileNameTag: {
    position: "absolute",
    bottom: 8,
    left: 10,
    fontSize: 11,
    color: "#fff",
    background: "rgba(0,0,0,.55)",
    padding: "3px 10px",
    borderRadius: 6,
    pointerEvents: "none",
    fontFamily: "'Poppins',sans-serif",
    fontWeight: 600,
    letterSpacing: "0.02em",
    display: "flex",
    alignItems: "center",
  },
  tileNameTagSm: {
    position: "absolute",
    bottom: 4,
    left: 6,
    fontSize: 9,
    color: "#fff",
    background: "rgba(0,0,0,.55)",
    padding: "2px 6px",
    borderRadius: 5,
    pointerEvents: "none",
    fontFamily: "'Poppins',sans-serif",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
  },

  /* ── audio ── */
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
    top: 14,
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 30,
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 16px",
    borderRadius: 999,
    border: "1px solid rgba(34,211,238,.35)",
    background: "rgba(15,23,42,.92)",
    color: "#67e8f9",
    fontFamily: "'Poppins',sans-serif",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 8px 24px rgba(0,0,0,.5)",
  },

  ctrlBarCompact: {
    gap: 6,
    padding: "8px 8px",
  },
  ctrlBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "10px 24px",
    background: "rgba(13,17,23,.92)",
    backdropFilter: "blur(12px)",
    borderTop: "1px solid rgba(255,255,255,.07)",
    zIndex: 20,
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
    border: "3px solid rgba(34,211,238,.2)",
    borderTop: "3px solid #22d3ee",
    borderRadius: "50%",
    animation: "spin .8s linear infinite",
  },
  loadingText: {
    fontSize: 12,
    color: "#475569",
    fontFamily: "'Poppins',sans-serif",
    fontWeight: 600,
  },
  handle: {
    flexShrink: 0,
    width: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#0d1117",
    borderLeft: "1px solid rgba(255,255,255,.05)",
    borderRight: "1px solid rgba(255,255,255,.05)",
    cursor: "pointer",
    zIndex: 5,
    transition: "background .2s",
  },
  handlePill: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 3,
    padding: "10px 3px",
    borderRadius: 8,
    background: "#1e293b",
    border: "1px solid rgba(255,255,255,.1)",
  },
  handleLine: { width: 1, height: 12, background: "rgba(255,255,255,.15)" },
  sidebar: {
    flexShrink: 0,
    background: "#0d1117",
    borderLeft: "1px solid rgba(255,255,255,.07)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    transition: "width .25s ease",
  },
  tabRow: {
    flexShrink: 0,
    display: "flex",
    borderBottom: "1px solid rgba(255,255,255,.07)",
  },
  msgList: {
    flex: 1,
    overflowY: "auto",
    padding: "12px 14px",
    display: "flex",
    flexDirection: "column",
    gap: 10,
    minHeight: 0,
  },
  sysRow: { display: "flex", justifyContent: "center" },
  sysBubble: {
    fontSize: 10,
    color: "#475569",
    fontStyle: "italic",
    background: "rgba(255,255,255,.04)",
    borderRadius: 8,
    padding: "3px 10px",
    fontFamily: "'Poppins',sans-serif",
  },
  msgBlock: { display: "flex", flexDirection: "column", gap: 2 },
  msgUser: {
    fontSize: 9,
    color: "#64748b",
    fontWeight: 700,
    fontFamily: "'Poppins',sans-serif",
    letterSpacing: "0.04em",
  },
  msgBubble: {
    maxWidth: "88%",
    padding: "7px 11px",
    borderRadius: 12,
    fontSize: 12,
    color: "#f1f5f9",
    lineHeight: 1.45,
    fontFamily: "'Poppins',sans-serif",
  },
  bubbleSelf: {
    background: "linear-gradient(135deg,#0e7490,#22d3ee)",
    alignSelf: "flex-end",
    borderBottomRightRadius: 2,
  },
  bubbleOther: { background: "#1e293b", borderBottomLeftRadius: 2 },
  inputRow: {
    flexShrink: 0,
    display: "flex",
    gap: 8,
    padding: "10px 12px",
    borderTop: "1px solid rgba(255,255,255,.07)",
  },
  chatInput: {
    flex: 1,
    background: "#1e293b",
    border: "1px solid rgba(255,255,255,.08)",
    borderRadius: 10,
    padding: "8px 12px",
    color: "#e2e8f0",
    fontSize: 12,
    fontFamily: "'Poppins',sans-serif",
    fontWeight: 500,
    outline: "none",
  },
  sendBtn: {
    flexShrink: 0,
    background: "linear-gradient(135deg,#0e7490,#22d3ee)",
    border: "none",
    borderRadius: 10,
    padding: "0 14px",
    color: "#0f172a",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
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
  emptyPeople: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingTop: 32,
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
    fontSize: 13,
    fontWeight: 800,
    flexShrink: 0,
    fontFamily: "'Poppins',sans-serif",
  },
  pName: {
    flex: 1,
    fontSize: 12,
    color: "#cbd5e1",
    fontFamily: "'Poppins',sans-serif",
    fontWeight: 500,
  },
  hostTag: {
    fontSize: 9,
    background: "rgba(34,211,238,.12)",
    color: "#67e8f9",
    padding: "2px 8px",
    borderRadius: 6,
    fontWeight: 700,
    fontFamily: "'Poppins',sans-serif",
    letterSpacing: "0.06em",
  },
  youTag: {
    fontSize: 9,
    background: "rgba(52,211,153,.12)",
    color: "#6ee7b7",
    padding: "2px 8px",
    borderRadius: 6,
    fontWeight: 700,
    fontFamily: "'Poppins',sans-serif",
    letterSpacing: "0.06em",
  },
};

export default LiveSessionControls;
