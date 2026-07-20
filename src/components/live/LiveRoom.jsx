
// import { useEffect, useRef, useState, useCallback } from "react";
// import { Room, RoomEvent, Track, createLocalTracks } from "livekit-client";
// import {
//   Mic,
//   MicOff,
//   Video,
//   VideoOff,
//   MonitorUp,
//   MonitorOff,
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
// } from "lucide-react";
// import {
//   getSessionById,
//   participantJoin,
//   participantLeave,
// } from "@/services/liveSessionService";

// const getTime = () =>
//   new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

// // ✅ CHANGED — clears old video before attaching new one + handles screen share objectFit
// const attachTrack = (track, container) => {
//   if (!container || !track) return;
//   const el = track.attach();
//   if (track.kind === Track.Kind.Video) {
//     Object.assign(el.style, {
//       width: "100%",
//       height: "100%",
//       objectFit:
//         track.source === Track.Source.ScreenShare ? "contain" : "cover",
//       display: "block",
//       position: "absolute",
//       inset: "0",
//     });
//     container.innerHTML = ""; // ✅ clear old track before adding new
//   }
//   container.appendChild(el);
// };

// const useLiveTimer = (running) => {
//   const [secs, setSecs] = useState(0);
//   useEffect(() => {
//     if (!running) {
//       setSecs(0);
//       return;
//     }
//     const id = setInterval(() => setSecs((s) => s + 1), 1000);
//     return () => clearInterval(id);
//   }, [running]);
//   const hh = String(Math.floor(secs / 3600)).padStart(2, "0");
//   const mm = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
//   const ss = String(secs % 60).padStart(2, "0");
//   return `${hh}:${mm}:${ss}`;
// };

// const LiveRoom = ({ token, roomName, sessionId, onSessionEnded, onLeave }) => {
//   const roomRef = useRef(null);
//   const remoteRef = useRef(null);
//   const localRef = useRef(null);
//   const localVideoTrackRef = useRef(null);
//   const localAudioTrackRef = useRef(null);
//   const screenTrackRef = useRef(null);
//   const chatEndRef = useRef(null);
//   const autoEndPollRef = useRef(null);

//   const [connected, setConnected] = useState(false);
//   const [micOn, setMicOn] = useState(true);
//   const [camOn, setCamOn] = useState(true);
//   const [screenOn, setScreenOn] = useState(false);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [sidebarTab, setSidebarTab] = useState("chat");
//   const [trainerOnline, setTrainerOnline] = useState(false);
//   const [participants, setParticipants] = useState([]);
//   const [msgInput, setMsgInput] = useState("");
//   const [sessionEndedWarning, setSessionEndedWarning] = useState(false);

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

//   const timer = useLiveTimer(connected);

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

//   const updateParticipants = useCallback(() => {
//     if (!roomRef.current) return;
//     const list = [];
//     roomRef.current.remoteParticipants.forEach((p) => {
//       list.push({ id: p.identity, name: p.name || p.identity, isHost: true });
//     });
//     setParticipants([{ id: "you", name: "You (Me)", self: true }, ...list]);
//   }, []);

//   useEffect(() => {
//     const serverUrl =
//       (typeof import.meta !== "undefined" &&
//         import.meta.env?.VITE_LIVEKIT_URL) ||
//       "ws://localhost:7880";

//     const start = async () => {
//       const room = new Room({ adaptiveStream: true, dynacast: true });
//       roomRef.current = room;

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

//         const tracks = await createLocalTracks({ audio: true, video: true });
//         for (const track of tracks) {
//           await room.localParticipant.publishTrack(track);
//           if (track.kind === Track.Kind.Video) {
//             localVideoTrackRef.current = track;
//             if (localRef.current) {
//               const el = track.attach();
//               Object.assign(el.style, {
//                 width: "100%",
//                 height: "100%",
//                 objectFit: "cover",
//                 display: "block",
//                 transform: "scaleX(-1)",
//               });
//               localRef.current.innerHTML = "";
//               localRef.current.appendChild(el);
//             }
//           }
//           if (track.kind === Track.Kind.Audio) {
//             localAudioTrackRef.current = track;
//           }
//         }

//         // attach already-existing remote tracks
//         room.remoteParticipants.forEach((participant) => {
//           participant.trackPublications.forEach((pub) => {
//             if (pub.isSubscribed && pub.track) {
//               attachTrack(pub.track, remoteRef.current);
//             }
//           });
//           setTrainerOnline(true);
//         });
//         updateParticipants();

//         // ✅ CHANGED — clears remote area first, then attaches
//         // handles both camera and screen share tracks from trainer
//         room.on(
//           RoomEvent.TrackSubscribed,
//           (track, publication, participant) => {
//             if (remoteRef.current) {
//               remoteRef.current.innerHTML = ""; // clear old track
//             }
//             attachTrack(track, remoteRef.current);
//             setTrainerOnline(true);
//             updateParticipants();
//           },
//         );

//         // ✅ CHANGED — when screen share stops, restore camera track
//         room.on(
//           RoomEvent.TrackUnsubscribed,
//           (track, publication, participant) => {
//             track.detach().forEach((el) => el.remove());

//             if (track.source === Track.Source.ScreenShare) {
//               // screen share ended — restore trainer camera
//               if (remoteRef.current) remoteRef.current.innerHTML = "";
//               participant.trackPublications.forEach((pub) => {
//                 if (
//                   pub.isSubscribed &&
//                   pub.track &&
//                   pub.track.source !== Track.Source.ScreenShare
//                 ) {
//                   attachTrack(pub.track, remoteRef.current);
//                 }
//               });
//             }
//           },
//         );

//         room.on(RoomEvent.ParticipantConnected, (p) => {
//           setTrainerOnline(true);
//           updateParticipants();
//           pushSystemMsg(`${p.name || p.identity} joined`);
//         });

//         room.on(RoomEvent.ParticipantDisconnected, (p) => {
//           updateParticipants();
//           pushSystemMsg(`${p.name || p.identity} left`);
//         });

//         room.on(RoomEvent.Disconnected, () => {
//           setConnected(false);
//           setTrainerOnline(false);
//         });

//         room.on(RoomEvent.DataReceived, (payload, participant) => {
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
//   }, [micOn]);

//   const toggleCam = useCallback(async () => {
//     const track = localVideoTrackRef.current;
//     if (!track) return;
//     if (camOn) {
//       await track.mute();
//       if (localRef.current) localRef.current.style.visibility = "hidden";
//     } else {
//       await track.unmute();
//       if (localRef.current) localRef.current.style.visibility = "visible";
//     }
//     setCamOn((v) => !v);
//   }, [camOn]);

//   const toggleScreen = useCallback(async () => {
//     const room = roomRef.current;
//     if (!room) return;

//     if (screenOn) {
//       try {
//         await room.localParticipant.setScreenShareEnabled(false);
//       } catch (e) {
//         console.warn("stop screen share:", e);
//       }
//       screenTrackRef.current = null;
//       setScreenOn(false);
//       if (localVideoTrackRef.current && camOn && localRef.current) {
//         const el = localVideoTrackRef.current.attach();
//         Object.assign(el.style, {
//           width: "100%",
//           height: "100%",
//           objectFit: "cover",
//           display: "block",
//           transform: "scaleX(-1)",
//         });
//         localRef.current.innerHTML = "";
//         localRef.current.appendChild(el);
//         localRef.current.style.visibility = "visible";
//       }
//     } else {
//       try {
//         const pub = await room.localParticipant.setScreenShareEnabled(true);
//         if (!pub) return;
//         const screenTrack = pub.track;
//         screenTrackRef.current = screenTrack;
//         if (screenTrack && localRef.current) {
//           const el = screenTrack.attach();
//           Object.assign(el.style, {
//             width: "100%",
//             height: "100%",
//             objectFit: "contain",
//             display: "block",
//           });
//           localRef.current.innerHTML = "";
//           localRef.current.appendChild(el);
//           localRef.current.style.visibility = "visible";
//         }
//         setScreenOn(true);
//         const mediaTrack = screenTrack?.mediaStreamTrack;
//         if (mediaTrack) {
//           mediaTrack.addEventListener("ended", () => {
//             room.localParticipant.setScreenShareEnabled(false).catch(() => {});
//             screenTrackRef.current = null;
//             setScreenOn(false);
//             if (localVideoTrackRef.current && camOn && localRef.current) {
//               const el2 = localVideoTrackRef.current.attach();
//               Object.assign(el2.style, {
//                 width: "100%",
//                 height: "100%",
//                 objectFit: "cover",
//                 display: "block",
//                 transform: "scaleX(-1)",
//               });
//               localRef.current.innerHTML = "";
//               localRef.current.appendChild(el2);
//             }
//           });
//         }
//       } catch (err) {
//         console.warn("Screen share failed/cancelled:", err);
//       }
//     }
//   }, [screenOn, camOn]);

//   const handleLeave = useCallback(() => {
//     if (autoEndPollRef.current) clearInterval(autoEndPollRef.current);
//     if (sessionId) {
//       participantLeave(sessionId).catch(() => {});
//     }
//     roomRef.current?.disconnect();
//     localVideoTrackRef.current?.stop();
//     localAudioTrackRef.current?.stop();
//     screenTrackRef.current?.stop();
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

//   return (
//     <div style={S.root}>
//       {sessionEndedWarning && (
//         <div style={S.autoEndToast}>
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

//       {/* TOP BAR */}
//       <div style={S.topBar}>
//         <div style={S.topLeft}>
//           <div style={S.liveBadge}>
//             <span style={S.liveDot} />
//             LIVE
//           </div>
//           <div style={S.recBadge}>
//             <Disc2 size={11} />
//             REC
//           </div>
//           <div style={S.timerBadge}>
//             <Timer size={12} />
//             {timer}
//           </div>
//           <span style={S.sessionName}>{roomName || "Live Session"}</span>
//         </div>
//         <div style={S.topRight}>
//           <div
//             style={{ ...S.connBadge, ...(connected ? S.connOn : S.connOff) }}
//           >
//             {connected ? <Wifi size={12} /> : <WifiOff size={12} />}
//             {connected ? "Connected" : "Connecting…"}
//           </div>
//           <div style={S.trainerBadge}>
//             <Radio
//               size={12}
//               style={{ color: trainerOnline ? "#34d399" : "#64748b" }}
//             />
//             <span style={{ color: trainerOnline ? "#34d399" : "#64748b" }}>
//               {trainerOnline ? "Trainer Online" : "Waiting for Trainer"}
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* MAIN AREA */}
//       <div style={S.mainArea}>
//         {/* Stage */}
//         <div style={S.stage}>
//           {/* ✅ position relative so absolute remote tracks show correctly */}
//           <div
//             ref={remoteRef}
//             style={{ position: "absolute", inset: 0, overflow: "hidden" }}
//           />

//           {!trainerOnline && (
//             <div style={S.stagePH}>
//               <div style={S.avatarRing}>
//                 <div style={S.avatarInner}>T</div>
//               </div>
//               <p style={S.phText}>Waiting for trainer's stream…</p>
//               <p style={S.phSub}>Session will begin shortly</p>
//             </div>
//           )}

//           {/* Student PIP */}
//           <div style={S.pip}>
//             <div
//               ref={localRef}
//               style={{
//                 width: "100%",
//                 height: "100%",
//                 visibility: camOn || screenOn ? "visible" : "hidden",
//               }}
//             />
//             {!camOn && !screenOn && (
//               <div style={S.pipOff}>
//                 <VideoOff size={18} color="#64748b" />
//                 <span style={S.pipOffTxt}>Cam Off</span>
//               </div>
//             )}
//             <span style={S.pipLabel}>You{screenOn ? " · Sharing" : ""}</span>
//           </div>
//         </div>

//         {/* Handle */}
//         <div
//           style={S.handle}
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
//           <div style={S.sidebar}>
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
//                 <PersonRow name="You (Me)" self />
//                 {participants
//                   .filter((p) => !p.self)
//                   .map((p) => (
//                     <PersonRow key={p.id} name={p.name} isHost={p.isHost} />
//                   ))}
//                 {participants.filter((p) => !p.self).length === 0 && (
//                   <p style={S.emptyPpl}>No other participants yet</p>
//                 )}
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* CONTROL BAR */}
//       <div style={S.ctrlBar}>
//         <div style={S.ctrlGrp}>
//           <Btn
//             icon={micOn ? <Mic size={18} /> : <MicOff size={18} />}
//             label={micOn ? "Mute" : "Unmute"}
//             danger={!micOn}
//             onClick={toggleMic}
//           />
//           <Btn
//             icon={camOn ? <Video size={18} /> : <VideoOff size={18} />}
//             label={camOn ? "Stop Cam" : "Start Cam"}
//             danger={!camOn}
//             onClick={toggleCam}
//           />
//           <Btn
//             icon={screenOn ? <MonitorOff size={18} /> : <MonitorUp size={18} />}
//             label={screenOn ? "Stop Share" : "Share Screen"}
//             active={screenOn}
//             onClick={toggleScreen}
//           />
//         </div>
//         <div style={S.ctrlGrp}>
//           <Btn
//             icon={<MessageSquare size={18} />}
//             label="Chat"
//             active={sidebarOpen && sidebarTab === "chat"}
//             onClick={() => openTab("chat")}
//           />
//           <Btn
//             icon={<Users size={18} />}
//             label="People"
//             active={sidebarOpen && sidebarTab === "people"}
//             onClick={() => openTab("people")}
//           />
//         </div>
//         <div style={S.ctrlGrp}>
//           <Btn
//             icon={<PhoneOff size={18} />}
//             label="Leave"
//             leave
//             onClick={handleLeave}
//           />
//         </div>
//       </div>

//       <style>{`
//         @keyframes livePulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(1.5)} }
//         @keyframes recBlink  { 0%,100%{opacity:1} 50%{opacity:.2} }
//         @keyframes slideIn   { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
//         @keyframes toastIn   { from{opacity:0;transform:translateX(-50%) translateY(-12px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
//       `}</style>
//     </div>
//   );
// };

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
//       {name[0]}
//     </div>
//     <span style={S.pName}>{name}</span>
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
//             ? "1px solid rgba(99,102,241,.35)"
//             : "1px solid transparent",
//         borderRadius: 14,
//         padding: "10px 20px",
//         cursor: "pointer",
//         fontSize: 11,
//         fontWeight: 600,
//         fontFamily: "inherit",
//         letterSpacing: 0.3,
//         transition: "all .18s",
//       }}
//     >
//       {icon}
//       <span>{label}</span>
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
//   topBar: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: "10px 20px",
//     background: "#0d1117",
//     borderBottom: "1px solid rgba(255,255,255,.06)",
//     flexShrink: 0,
//   },
//   topLeft: { display: "flex", alignItems: "center", gap: 10 },
//   topRight: { display: "flex", alignItems: "center", gap: 10 },
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
//     marginLeft: 4,
//   },
//   connBadge: {
//     display: "flex",
//     alignItems: "center",
//     gap: 5,
//     fontSize: 11,
//     fontWeight: 600,
//     borderRadius: 8,
//     padding: "3px 10px",
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
//   trainerBadge: {
//     display: "flex",
//     alignItems: "center",
//     gap: 5,
//     fontSize: 11,
//     fontWeight: 600,
//     background: "rgba(255,255,255,.04)",
//     borderRadius: 8,
//     padding: "3px 10px",
//   },
//   mainArea: { flex: 1, display: "flex", overflow: "hidden" },
//   stage: {
//     flex: 1,
//     position: "relative",
//     background: "#05070d",
//     overflow: "hidden",
//   },
//   remoteVideo: { position: "absolute", inset: 0 },
//   stagePH: {
//     position: "absolute",
//     inset: 0,
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 14,
//     zIndex: 1,
//   },
//   avatarRing: {
//     width: 96,
//     height: 96,
//     borderRadius: "50%",
//     background: "linear-gradient(135deg,#3b82f6,#8b5cf6)",
//     padding: 3,
//   },
//   avatarInner: {
//     width: "100%",
//     height: "100%",
//     borderRadius: "50%",
//     background: "#0d1117",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontSize: 36,
//     fontWeight: 800,
//     color: "#fff",
//   },
//   phText: { margin: 0, fontSize: 16, fontWeight: 600, color: "#94a3b8" },
//   phSub: { margin: 0, fontSize: 12, color: "#334155" },
//   pip: {
//     position: "absolute",
//     bottom: 20,
//     right: 20,
//     width: 176,
//     height: 118,
//     borderRadius: 14,
//     overflow: "hidden",
//     border: "2px solid rgba(255,255,255,.13)",
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
//   pipOffTxt: { fontSize: 10, color: "#475569" },
//   pipLabel: {
//     position: "absolute",
//     bottom: 6,
//     left: 8,
//     fontSize: 10,
//     color: "#fff",
//     background: "rgba(0,0,0,.6)",
//     padding: "1px 7px",
//     borderRadius: 5,
//     pointerEvents: "none",
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
//     animation: "slideIn .2s ease",
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
//   ctrlBar: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: "12px 24px",
//     background: "#0d1117",
//     borderTop: "1px solid rgba(255,255,255,.06)",
//     flexShrink: 0,
//   },
//   ctrlGrp: { display: "flex", alignItems: "center", gap: 6 },
// };

// export default LiveRoom;












































import { useEffect, useRef, useState, useCallback, useMemo } from "react";
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
} from "lucide-react";
import {
  getSessionById,
  participantJoin,
  participantLeave,
} from "@/services/liveSessionService";

const getTime = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const useLiveTimer = (running) => {
  const [secs, setSecs] = useState(0);
  useEffect(() => {
    if (!running) {
      setSecs(0);
      return;
    }
    const id = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);
  const hh = String(Math.floor(secs / 3600)).padStart(2, "0");
  const mm = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
};

// ────────────────────────────────────────────────────────────────
// ✅ NEW — track rendering primitives.
// Each track gets its OWN persistent DOM node via track.attach(el)
// instead of one shared container whose innerHTML kept getting wiped.
// This alone fixes: audio disappearing, screen share landing inside
// the camera tile, and the "own camera not visible" issue.
// ────────────────────────────────────────────────────────────────
function VideoTrackEl({ track, mirrored, fit = "cover" }) {
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
  return (
    <video
      ref={ref}
      autoPlay
      playsInline
      muted
      style={{
        width: "100%",
        height: "100%",
        objectFit: fit,
        transform: mirrored ? "scaleX(-1)" : "none",
        display: "block",
        background: "#000",
      }}
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

// ✅ NEW — cheap viewport awareness so 50–100+ tiles don't all decode
// video at once. Off-screen tiles fall back to an avatar placeholder.
// Combined with Room({ adaptiveStream: true }) this keeps large
// meetings smooth.
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
// ✅ NEW — a single camera tile (used in both grid view and filmstrip)
// ────────────────────────────────────────────────────────────────
function ParticipantTile({ p, variant = "grid" }) {
  const wrapRef = useRef(null);
  const inView = useInView(wrapRef);
  const hasVideo = !!p.cameraTrack && !p.cameraMuted && inView;
  const initial = (p.name || "?").trim().charAt(0).toUpperCase() || "?";

  return (
    <div
      ref={wrapRef}
      className="lr-tile"
      style={{ ...S.tile, ...(variant === "strip" ? S.tileStrip : {}) }}
    >
      {hasVideo ? (
        <VideoTrackEl track={p.cameraTrack} mirrored={p.isLocal} fit="cover" />
      ) : (
        <div style={S.tileAvatarWrap}>
          <div
            style={{
              ...S.tileAvatar,
              background: p.isLocal
                ? "linear-gradient(135deg,#0ea5e9,#6366f1)"
                : "linear-gradient(135deg,#8b5cf6,#ec4899)",
            }}
          >
            {initial}
          </div>
        </div>
      )}

      {/* remote audio always renders regardless of video visibility */}
      {!p.isLocal && p.micTrack && <AudioTrackEl track={p.micTrack} />}

      <div style={S.tileNameTag} className="lr-tile-nametag">
        {p.micMuted ? <MicOff size={11} /> : <Mic size={11} />}
        <span>{p.isLocal ? "You" : p.name}</span>
      </div>

      {p.isHost && !p.isLocal && <span style={S.tileHostTag}>Host</span>}
    </div>
  );
}

function ScreenStage({ p }) {
  return (
    <div style={S.screenStage}>
      <VideoTrackEl track={p.screenTrack} fit="contain" />
      <div style={S.screenLabel}>
        <MonitorPlay size={13} />
        {p.isLocal ? "You are presenting" : `${p.name} is presenting`}
      </div>
    </div>
  );
}

// ✅ NEW — responsive auto-fit grid (Meet "Tile view").
// Column count/tile size adapt to participant count AND container
// width via CSS auto-fit, so it holds up from 1 to 100+ participants
// and across desktop/tablet/mobile without extra logic.
function TileGrid({ participants }) {
  const n = participants.length || 1;
  const minWidth =
    n <= 1 ? 640 : n <= 4 ? 360 : n <= 9 ? 260 : n <= 16 ? 210 : n <= 30 ? 170 : n <= 60 ? 140 : 120;
  // ✅ NEW — `min(Npx, 42vw)` caps each tile's minimum at ~42% of the
  // viewport, so on a narrow phone (iPhone SE, etc.) the grid still
  // fits 2 columns instead of forcing a desktop-sized tile off-screen.
  // On wide screens vw is irrelevant and the px value wins as before.
  return (
    <div
      data-scroll-root
      className="lr-grid"
      style={{
        ...S.grid,
        gridTemplateColumns: `repeat(auto-fit, minmax(min(${minWidth}px, 42vw), 1fr))`,
      }}
    >
      {participants.map((p) => (
        <ParticipantTile key={p.identity} p={p} />
      ))}
    </div>
  );
}

// ✅ NEW — Meet-style filmstrip shown under the screen-share stage
function FilmStrip({ participants }) {
  return (
    <div data-scroll-root className="lr-filmstrip" style={S.filmstrip}>
      {participants.map((p) => (
        <ParticipantTile key={p.identity} p={p} variant="strip" />
      ))}
    </div>
  );
}

const LiveRoom = ({ token, roomName, sessionId, onSessionEnded, onLeave }) => {
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
  const [participants, setParticipants] = useState([]); // ✅ single source of truth for tiles + people list
  const [msgInput, setMsgInput] = useState("");
  const [sessionEndedWarning, setSessionEndedWarning] = useState(false);
  const [mediaError, setMediaError] = useState(null);

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

  const timer = useLiveTimer(connected);

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

  // ✅ NEW — builds ONE participant list (local + remote), each with its
  // own camera/mic/screen-share track references. Drives the grid,
  // the screen-share stage, the filmstrip, and the People sidebar tab.
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

  // ✅ FIXED — screen share now publishes as its own track/source and is
  // never written into the camera tile's container. The stage picks it
  // up automatically via `screenSharer` below, for local OR remote.
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

  // ✅ any participant (local or remote) currently sharing their screen
  // becomes the big "stage" — exactly like Meet/Zoom/Teams.
  const screenSharer = useMemo(
    () => participants.find((p) => !!p.screenTrack),
    [participants],
  );

  return (
    <div style={S.root} className="lr-root">
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

      {/* TOP BAR */}
      <div style={S.topBar} className="lr-topbar">
        <div style={S.topLeft} className="lr-topleft">
          <div style={S.liveBadge}>
            <span style={S.liveDot} />
            LIVE
          </div>
          <div style={S.recBadge}>
            <Disc2 size={11} />
            REC
          </div>
          <div style={S.timerBadge}>
            <Timer size={12} />
            {timer}
          </div>
          <span style={S.sessionName} className="lr-sessionname">{roomName || "Live Session"}</span>
        </div>
        <div style={S.topRight} className="lr-topright">
          <div
            style={{ ...S.connBadge, ...(connected ? S.connOn : S.connOff) }}
          >
            {connected ? <Wifi size={12} /> : <WifiOff size={12} />}
            {connected ? "Connected" : "Connecting…"}
          </div>
          <div style={S.trainerBadge}>
            <Radio
              size={12}
              style={{ color: trainerOnline ? "#34d399" : "#64748b" }}
            />
            <span style={{ color: trainerOnline ? "#34d399" : "#64748b" }}>
              {trainerOnline ? "Trainer Online" : "Waiting for Trainer"}
            </span>
          </div>
        </div>
      </div>

      {/* MAIN AREA */}
      <div style={S.mainArea}>
        {/* Stage — screen share (if any) + filmstrip, otherwise Meet-style tile grid */}
        <div style={S.stage} className="lr-stage">
          {screenSharer ? (
            <>
              <ScreenStage p={screenSharer} />
              <FilmStrip participants={participants} />
            </>
          ) : (
            <TileGrid participants={participants} />
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
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      style={{ ...S.msgRow, ...(m.self ? S.msgSelf : {}) }}
                    >
                      {!m.self && !m.system && (
                        <div style={S.av}>{m.name[0]}</div>
                      )}
                      {m.system ? (
                        <div style={S.sysBubble}>{m.text}</div>
                      ) : (
                        <div
                          style={{
                            ...S.bubble,
                            ...(m.self ? S.bSelf : S.bOther),
                          }}
                        >
                          {!m.self && <span style={S.bName}>{m.name}</span>}
                          <span style={S.bText}>{m.text}</span>
                          <span style={S.bTime}>{m.time}</span>
                        </div>
                      )}
                    </div>
                  ))}
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

      {/* CONTROL BAR */}
      <div style={S.ctrlBar} className="lr-ctrlbar">
        <div style={S.ctrlGrp}>
          <Btn
            icon={micOn ? <Mic size={18} /> : <MicOff size={18} />}
            label={micOn ? "Mute" : "Unmute"}
            danger={!micOn}
            onClick={toggleMic}
          />
          <Btn
            icon={camOn ? <Video size={18} /> : <VideoOff size={18} />}
            label={camOn ? "Stop Cam" : "Start Cam"}
            danger={!camOn}
            onClick={toggleCam}
          />
          <Btn
            icon={screenOn ? <MonitorOff size={18} /> : <MonitorUp size={18} />}
            label={screenOn ? "Stop Share" : "Share Screen"}
            active={screenOn}
            onClick={toggleScreen}
          />
        </div>
        <div style={S.ctrlGrp}>
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
        </div>
        <div style={S.ctrlGrp}>
          <Btn
            icon={<PhoneOff size={18} />}
            label="Leave"
            leave
            onClick={handleLeave}
          />
        </div>
      </div>

      <style>{`
        @keyframes livePulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(1.5)} }
        @keyframes recBlink  { 0%,100%{opacity:1} 50%{opacity:.2} }
        @keyframes slideIn   { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
        @keyframes toastIn   { from{opacity:0;transform:translateX(-50%) translateY(-12px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }

        /* ══════════════════════════════════════════════════════════
           ✅ NEW — full responsive system
           Breakpoints mapped to real device classes rather than
           arbitrary numbers, largest → smallest:
             ≥1440   Desktop / large monitor
             1200–1439  Laptop
             1024–1199  Small laptop / iPad Pro landscape
             900–1023   iPad (portrait) / Android tablet
             768–899    iPad mini (portrait)
             600–767    Large phones landscape / small tablets
             431–599    Large phones portrait (iPhone Pro Max, Plus)
             376–430    Standard phones (iPhone 12/13/14/15, most Android)
             ≤375       Small phones (iPhone SE)
           ══════════════════════════════════════════════════════════ */

        .lr-btn-label { display: inline; }

        /* ── Laptop (≤1439px): slightly tighter chrome ───────────── */
        @media (max-width: 1439px) {
          .lr-sidebar { width: 300px !important; }
        }

        /* ── Small laptop / iPad Pro landscape (≤1199px) ─────────── */
        @media (max-width: 1199px) {
          .lr-sidebar { width: 280px !important; }
          .lr-ctrl-btn { padding: 9px 16px !important; }
        }

        /* ── iPad / tablet portrait (≤1023px): sidebar overlays stage
           instead of squeezing the video grid ──────────────────── */
        @media (max-width: 1023px) {
          .lr-sidebar {
            position: fixed !important;
            inset: 0 !important;
            top: 54px !important;
            width: 100% !important;
            z-index: 500 !important;
            animation: slideIn .18s ease;
          }
          .lr-handle { display: none !important; }
        }

        /* ── iPad mini portrait (≤899px) ─────────────────────────── */
        @media (max-width: 899px) {
          .lr-topbar { padding: 8px 12px !important; }
          .lr-ctrlbar { padding: 10px 14px !important; }
          .lr-ctrl-btn { padding: 8px 14px !important; }
          .lr-grid { padding: 10px !important; gap: 8px !important; }
        }

        /* ── Large phones landscape / small tablets (≤767px) ─────── */
        @media (max-width: 767px) {
          .lr-sessionname { display: none; }
          .lr-tile { border-radius: 10px !important; }
        }

        /* ── Large phones portrait: iPhone Pro Max/Plus (≤599px) ─── */
        @media (max-width: 599px) {
          .lr-topbar { flex-wrap: wrap; row-gap: 6px; }
          .lr-topright { order: 3; width: 100%; justify-content: flex-start; }
          .lr-ctrlbar { padding: 8px 10px !important; gap: 4px; }
          .lr-btn-label { display: none !important; }
          .lr-ctrl-btn { padding: 10px !important; border-radius: 12px !important; }
          .lr-tile { border-radius: 8px !important; }
          .lr-grid { padding: 8px !important; gap: 6px !important; }
        }

        /* ── Standard phones: iPhone 12/13/14/15 etc. (≤430px) ───── */
        @media (max-width: 430px) {
          .lr-grid { padding: 6px !important; gap: 6px !important; }
          .lr-filmstrip { padding: 6px 8px !important; gap: 6px !important; }
          .lr-tile-nametag { font-size: 10px !important; }
        }

        /* ── Small phones: iPhone SE etc. (≤375px) ───────────────── */
        @media (max-width: 375px) {
          .lr-ctrl-btn { padding: 8px !important; }
          .lr-topbar { padding: 6px 8px !important; }
        }

        @media (max-width: 420px) {
          .lr-toast { min-width: unset !important; width: 92vw !important; padding: 10px 14px !important; }
        }

        /* ── Phone in landscape during a call: shrink vertical chrome
           so the video grid gets the room ──────────────────────── */
        @media (max-height: 480px) and (orientation: landscape) {
          .lr-topbar { padding: 4px 10px !important; }
          .lr-ctrlbar { padding: 6px 12px !important; }
          .lr-ctrl-btn { padding: 6px 12px !important; gap: 2px !important; }
        }
      `}</style>
    </div>
  );
};

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
      {name[0]}
    </div>
    <span style={S.pName}>{name}</span>
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
        gap: 5,
        background: bg,
        color: col,
        border: danger
          ? "1px solid rgba(239,68,68,.3)"
          : active
            ? "1px solid rgba(99,102,241,.35)"
            : "1px solid transparent",
        borderRadius: 14,
        padding: "10px 20px",
        cursor: "pointer",
        fontSize: 11,
        fontWeight: 600,
        fontFamily: "inherit",
        letterSpacing: 0.3,
        transition: "all .18s",
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
    marginLeft: 4,
  },
  connBadge: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    fontSize: 11,
    fontWeight: 600,
    borderRadius: 8,
    padding: "3px 10px",
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
  trainerBadge: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    fontSize: 11,
    fontWeight: 600,
    background: "rgba(255,255,255,.04)",
    borderRadius: 8,
    padding: "3px 10px",
  },
  mainArea: { flex: 1, display: "flex", overflow: "hidden" },
  stage: {
    flex: 1,
    position: "relative",
    background: "#05070d",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },

  // ✅ NEW — Meet-style tile grid
  grid: {
    flex: 1,
    display: "grid",
    gridAutoRows: "1fr",
    gap: 10,
    padding: 14,
    overflowY: "auto",
    alignContent: "center",
  },
  tile: {
    position: "relative",
    background: "#202124",
    borderRadius: 14,
    overflow: "hidden",
    aspectRatio: "16 / 9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid rgba(255,255,255,.05)",
  },
  tileStrip: {
    flex: "0 0 auto",
    width: "clamp(96px, 26vw, 168px)",
    aspectRatio: "16 / 9",
  },
  tileAvatarWrap: {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  tileAvatar: {
    width: "34%",
    aspectRatio: "1 / 1",
    minWidth: 40,
    maxWidth: 88,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 22,
    fontWeight: 800,
    color: "#fff",
  },
  tileNameTag: {
    position: "absolute",
    bottom: 8,
    left: 8,
    display: "flex",
    alignItems: "center",
    gap: 5,
    fontSize: 11,
    fontWeight: 600,
    color: "#fff",
    background: "rgba(0,0,0,.55)",
    borderRadius: 7,
    padding: "3px 8px",
    maxWidth: "calc(100% - 16px)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  tileHostTag: {
    position: "absolute",
    top: 8,
    right: 8,
    fontSize: 10,
    fontWeight: 700,
    color: "#60a5fa",
    background: "rgba(59,130,246,.18)",
    borderRadius: 6,
    padding: "2px 7px",
  },

  // ✅ NEW — screen-share stage + filmstrip
  screenStage: {
    flex: 1,
    position: "relative",
    background: "#000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 0,
  },
  screenLabel: {
    position: "absolute",
    top: 12,
    left: 12,
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
  filmstrip: {
    flexShrink: 0,
    display: "flex",
    gap: 8,
    padding: "10px 12px",
    overflowX: "auto",
    background: "rgba(0,0,0,.35)",
    borderTop: "1px solid rgba(255,255,255,.06)",
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
    animation: "slideIn .2s ease",
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
    padding: "7px 0",
    borderRadius: 10,
    border: "none",
    background: "transparent",
    color: "#475569",
    cursor: "pointer",
    fontSize: 13,
    fontFamily: "inherit",
    fontWeight: 600,
    transition: "all .15s",
  },
  tabOn: { background: "rgba(99,102,241,.15)", color: "#818cf8" },
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
    maxWidth: "78%",
    borderRadius: 14,
    padding: "7px 11px",
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  bSelf: {
    background: "linear-gradient(135deg,#3b82f6,#8b5cf6)",
    borderBottomRightRadius: 2,
  },
  bOther: { background: "#1e293b", borderBottomLeftRadius: 2 },
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
  ctrlBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 24px",
    background: "#0d1117",
    borderTop: "1px solid rgba(255,255,255,.06)",
    flexShrink: 0,
  },
  ctrlGrp: { display: "flex", alignItems: "center", gap: 6 },
};

export default LiveRoom;
