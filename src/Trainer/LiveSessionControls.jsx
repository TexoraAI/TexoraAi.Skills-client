// /**
//  * LiveSessionControls.jsx  — TRAINER SIDE
//  *
//  * FIXES vs old version:
//  *  ✅ Single LiveKit Room (raw SDK) — no duplicate LiveKitRoom wrappers
//  *  ✅ People list — shows all remote participants in real time
//  *  ✅ Chat — DataChannel send/receive working bidirectionally
//  *  ✅ Screen share — published to room, students receive it
//  *  ✅ No UI cutting — position:fixed, inset:0, zIndex:9999
//  *  ✅ LIVE timer, REC badge, participant count wired
//  */

// import { useEffect, useRef, useState, useCallback } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { Room, RoomEvent, Track, createLocalTracks } from "livekit-client";

// import { startLiveSession, endLiveSession } from "@/services/liveSessionService";

// import {
//   FaPhoneSlash, FaTimes, FaDotCircle, FaUsers,
//   FaPaperPlane, FaMicrophone, FaMicrophoneSlash,
//   FaVideo, FaVideoSlash, FaDesktop,
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
//       width: "100%", height: "100%",
//       objectFit: "cover", display: "block",
//     });
//   }
//   container.appendChild(el);
// };

// /* ─────────────────────────────────────────────────────────────
//    LIVE TIMER
// ───────────────────────────────────────────────────────────── */
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
//   const { id }   = useParams();

//   /* ── Refs ── */
//   const roomRef            = useRef(null);
//   const remoteGridRef      = useRef(null);   // container for all remote video tiles
//   const localPreviewRef    = useRef(null);   // trainer's own cam PIP
//   const localVideoTrackRef = useRef(null);
//   const localAudioTrackRef = useRef(null);
//   const screenTrackRef     = useRef(null);
//   const chatEndRef         = useRef(null);

//   /* ── State ── */
//   const [connected,    setConnected]    = useState(false);
//   const [micOn,        setMicOn]        = useState(true);
//   const [camOn,        setCamOn]        = useState(true);
//   const [screenOn,     setScreenOn]     = useState(false);
//   const [recording,    setRecording]    = useState(true);
//   const [sidebarOpen,  setSidebarOpen]  = useState(true);
//   const [sidebarTab,   setSidebarTab]   = useState("chat");
//   const [participants, setParticipants] = useState([]);
//   const [messages,     setMessages]     = useState(() => [
//     { id: 0, user: "System", text: "Session started. Welcome!", time: getTime(), system: true },
//   ]);
//   const [input,        setInput]        = useState("");
//   const [sessionTitle, setSessionTitle] = useState(`Session ${id}`);

//   const timer = useLiveTimer(connected);

//   /* ── stable helpers ── */
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
//         id:     room.localParticipant.identity,
//         name:   room.localParticipant.name || "You (Trainer)",
//         self:   true,
//         isHost: true,
//       },
//     ];
//     room.remoteParticipants.forEach((p) => {
//       list.push({ id: p.identity, name: p.name || p.identity, self: false, isHost: false });
//     });
//     setParticipants(list);
//   }, []);

//   /* ══════════════════════════════════════════════════════════
//      START SESSION + CONNECT TO LIVEKIT
//   ══════════════════════════════════════════════════════════ */
//   useEffect(() => {
//     if (!id) return;
//     const serverUrl = import.meta.env.VITE_LIVEKIT_URL || "ws://localhost:7880";

//     const start = async () => {
//       /* 1. get token from backend */
//       let token;
//       try {
//         const res  = await startLiveSession(id);
//         token = res?.data?.token || res?.data?.data?.token || res?.data?.body?.token;
//         setSessionTitle(res?.data?.title || `Session ${id}`);
//         if (!token) { console.error("No token returned"); return; }
//       } catch (err) {
//         console.error("startLiveSession failed:", err);
//         return;
//       }

//       /* 2. create room */
//       const room = new Room({ adaptiveStream: true, dynacast: true });
//       roomRef.current = room;

//       /* 3. connect */
//       try {
//         await room.connect(serverUrl, token);
//         setConnected(true);
//         refreshParticipants();
//       } catch (err) {
//         console.error("LiveKit connect failed:", err);
//         return;
//       }

//       /* 4. publish local cam + mic */
//       try {
//         const tracks = await createLocalTracks({ audio: true, video: true });
//         for (const track of tracks) {
//           await room.localParticipant.publishTrack(track);
//           if (track.kind === Track.Kind.Video) {
//             localVideoTrackRef.current = track;
//             if (localPreviewRef.current) {
//               const el = track.attach();
//               Object.assign(el.style, {
//                 width: "100%", height: "100%",
//                 objectFit: "cover", display: "block",
//                 transform: "scaleX(-1)",
//               });
//               localPreviewRef.current.innerHTML = "";
//               localPreviewRef.current.appendChild(el);
//             }
//           }
//           if (track.kind === Track.Kind.Audio) {
//             localAudioTrackRef.current = track;
//           }
//         }
//       } catch (err) {
//         console.error("createLocalTracks failed:", err);
//       }

//       /* 5. attach already-present remote tracks */
//       room.remoteParticipants.forEach((participant) => {
//         participant.trackPublications.forEach((pub) => {
//           if (pub.isSubscribed && pub.track) {
//             attachTrack(pub.track, remoteGridRef.current);
//           }
//         });
//       });

//       /* 6. room events */
//       room.on(RoomEvent.TrackSubscribed, (track) => {
//         attachTrack(track, remoteGridRef.current);
//       });

//       room.on(RoomEvent.TrackUnsubscribed, (track) => {
//         track.detach().forEach((el) => el.remove());
//       });

//       room.on(RoomEvent.ParticipantConnected, (p) => {
//         refreshParticipants();
//         pushSystem(`${p.name || p.identity} joined`);
//       });

//       room.on(RoomEvent.ParticipantDisconnected, (p) => {
//         refreshParticipants();
//         pushSystem(`${p.name || p.identity} left`);
//       });

//       /* 7. receive chat messages via DataChannel */
//       room.on(RoomEvent.DataReceived, (payload, participant) => {
//         try {
//           const decoded = new TextDecoder().decode(payload);
//           const msg     = JSON.parse(decoded);
//           if (msg.text) {
//             setMessages((prev) => [
//               ...prev,
//               {
//                 id:   Date.now(),
//                 user: participant?.name || participant?.identity || "Student",
//                 text: msg.text,
//                 time: getTime(),
//                 self: false,
//               },
//             ]);
//           }
//         } catch (_) {}
//       });

//       room.on(RoomEvent.Disconnected, () => setConnected(false));
//     };

//     start();
//     return () => { roomRef.current?.disconnect(); };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [id]);

//   /* auto-scroll chat */
//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, sidebarTab, sidebarOpen]);

//   /* ══════════════════════════════════════════════════════════
//      CONTROLS
//   ══════════════════════════════════════════════════════════ */

//   /* MIC */
//   const toggleMic = useCallback(async () => {
//     const track = localAudioTrackRef.current;
//     if (!track) return;
//     if (micOn) await track.mute();
//     else        await track.unmute();
//     setMicOn((v) => !v);
//   }, [micOn]);

//   /* CAM */
//   const toggleCam = useCallback(async () => {
//     const track = localVideoTrackRef.current;
//     if (!track) return;
//     if (camOn) {
//       await track.mute();
//       if (localPreviewRef.current) localPreviewRef.current.style.visibility = "hidden";
//     } else {
//       await track.unmute();
//       if (localPreviewRef.current) localPreviewRef.current.style.visibility = "visible";
//     }
//     setCamOn((v) => !v);
//   }, [camOn]);

//   /* ── helper: restore cam into PIP after screen share stops ── */
//   const restoreCamPip = useCallback(() => {
//     if (localVideoTrackRef.current && camOn && localPreviewRef.current) {
//       const el = localVideoTrackRef.current.attach();
//       Object.assign(el.style, {
//         width: "100%", height: "100%",
//         objectFit: "cover", display: "block",
//         transform: "scaleX(-1)",
//       });
//       localPreviewRef.current.innerHTML = "";
//       localPreviewRef.current.appendChild(el);
//       localPreviewRef.current.style.visibility = "visible";
//     }
//   }, [camOn]);

//   /* SCREEN SHARE */
//   const toggleScreen = useCallback(async () => {
//     const room = roomRef.current;
//     if (!room) return;

//     if (screenOn) {
//       /* ── STOP ── */
//       try { await room.localParticipant.setScreenShareEnabled(false); } catch (_) {}
//       screenTrackRef.current = null;
//       setScreenOn(false);
//       restoreCamPip();

//     } else {
//       /* ── START ── */
//       try {
//         const pub = await room.localParticipant.setScreenShareEnabled(true);
//         if (!pub) return; // user cancelled browser picker

//         /*
//           pub is a LocalTrackPublication.
//           pub.track is the LocalTrack (may be null for a brief moment,
//           so also check pub.videoTrack as fallback).
//         */
//         const screenTrack = pub.track ?? pub.videoTrack ?? null;
//         screenTrackRef.current = screenTrack;

//         /* ── Show screen preview in PIP (trainer sees own share) ── */
//         if (screenTrack && localPreviewRef.current) {
//           const el = screenTrack.attach();
//           Object.assign(el.style, {
//             width: "100%", height: "100%",
//             objectFit: "contain", display: "block",
//           });
//           localPreviewRef.current.innerHTML = "";
//           localPreviewRef.current.appendChild(el);
//           localPreviewRef.current.style.visibility = "visible";
//         }

//         setScreenOn(true);

//         /*
//           Watch for the browser's native "Stop sharing" button —
//           it fires 'ended' on the underlying MediaStreamTrack.
//         */
//         const mediaTrack =
//           screenTrack?.mediaStreamTrack ??
//           pub.track?.mediaStreamTrack ??
//           null;

//         if (mediaTrack) {
//           const onEnded = () => {
//             room.localParticipant.setScreenShareEnabled(false).catch(() => {});
//             screenTrackRef.current = null;
//             setScreenOn(false);
//             restoreCamPip();
//           };
//           mediaTrack.addEventListener("ended", onEnded, { once: true });
//         }

//       } catch (err) {
//         /* user cancelled or permission denied — not an error worth logging loudly */
//         if (err?.name !== "NotAllowedError") {
//           console.warn("Screen share failed:", err);
//         }
//       }
//     }
//   }, [screenOn, restoreCamPip]);

//   /* CHAT SEND */
//   const sendMessage = useCallback(() => {
//     const text = input.trim();
//     if (!text) return;

//     /* optimistic */
//     setMessages((prev) => [
//       ...prev,
//       { id: Date.now(), user: "You (Trainer)", text, time: getTime(), self: true },
//     ]);
//     setInput("");

//     /* broadcast via DataChannel */
//     try {
//       const payload = new TextEncoder().encode(JSON.stringify({ text, name: "Trainer" }));
//       roomRef.current?.localParticipant?.publishData(payload, { reliable: true });
//     } catch (e) { console.warn("data send failed:", e); }
//   }, [input]);

//   /* END SESSION */
//   const handleEndSession = useCallback(async () => {
//     try { await endLiveSession(id); } catch (_) {}
//     roomRef.current?.disconnect();
//     navigate("/trainer/live");
//   }, [id, navigate]);

//   /* ══════════════════════════════════════════════════════════
//      RENDER
//   ══════════════════════════════════════════════════════════ */
//   return (
//     <div style={S.root}>

//       {/* ── TOP BAR ── */}
//       <div style={S.topBar}>
//         <div style={S.topLeft}>
//           <div style={S.liveBadge}><span style={S.liveDot} />LIVE</div>
//           <span style={S.timerText}>{timer}</span>
//           <span style={S.sessionTitle}>{sessionTitle}</span>
//           {recording && (
//             <div style={S.recBadge}>
//               <FaDotCircle size={8} style={{ animation: "recBlink 1.5s infinite" }} /> REC
//             </div>
//           )}
//         </div>

//         <div style={S.topRight}>
//           <div style={S.pCountBadge}>
//             <FaUsers size={11} />
//             <span>{participants.length} Participants</span>
//           </div>

//           <button
//             style={{ ...S.recBtn, ...(recording ? S.recBtnOn : S.recBtnOff) }}
//             onClick={() => setRecording((r) => !r)}
//             title={recording ? "Stop Recording" : "Start Recording"}
//           >
//             <FaDotCircle size={10} />
//             {recording ? "Recording" : "Record"}
//           </button>

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
//               {/* Remote participants grid */}
//               <div ref={remoteGridRef} style={S.remoteGrid} />

//               {/* Trainer PIP (bottom-right) */}
//               <div style={S.pip}>
//                 <div
//                   ref={localPreviewRef}
//                   style={{
//                     width: "100%", height: "100%",
//                     visibility: camOn || screenOn ? "visible" : "hidden",
//                   }}
//                 />
//                 {!camOn && !screenOn && (
//                   <div style={S.pipOff}>
//                     <FaVideoSlash size={18} color="#64748b" />
//                     <span style={S.pipOffTxt}>Cam Off</span>
//                   </div>
//                 )}
//                 <span style={S.pipLabel}>You (Trainer){screenOn ? " · Sharing" : ""}</span>
//               </div>

//               {/* CONTROL BAR */}
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
//                     if (sidebarOpen && sidebarTab === "chat") setSidebarOpen(false);
//                     else { setSidebarTab("chat"); setSidebarOpen(true); }
//                   }}
//                 />
//                 <CtrlBtn
//                   icon={<FaUsers />}
//                   label="People"
//                   active={sidebarOpen && sidebarTab === "participants"}
//                   onClick={() => {
//                     if (sidebarOpen && sidebarTab === "participants") setSidebarOpen(false);
//                     else { setSidebarTab("participants"); setSidebarOpen(true); }
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
//             {sidebarOpen
//               ? <><Chevron dir="right" /><div style={S.handleLine} /><Chevron dir="left" /></>
//               : <><Chevron dir="left"  /><div style={S.handleLine} /><Chevron dir="right" /></>
//             }
//           </div>
//         </div>

//         {/* SIDEBAR */}
//         <div style={{ ...S.sidebar, width: sidebarOpen ? 340 : 0 }}>
//           {sidebarOpen && (
//             <>
//               {/* Tabs */}
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

//               {/* ── CHAT TAB ── */}
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
//                             <span style={S.msgUser}>{m.user} · {m.time}</span>
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
//                       placeholder="Message students…"
//                     />
//                     <button style={S.sendBtn} onClick={sendMessage}>
//                       <FaPaperPlane size={13} />
//                     </button>
//                   </div>
//                 </>
//               )}

//               {/* ── PEOPLE TAB ── */}
//               {sidebarTab === "participants" && (
//                 <div style={S.peopleList}>
//                   {participants.length === 0 && (
//                     <div style={S.emptyPeople}>
//                       <FaUsers size={28} style={{ opacity: 0.3 }} />
//                       <p style={{ fontSize: 12, color: "#475569", marginTop: 8 }}>
//                         No participants yet
//                       </p>
//                     </div>
//                   )}
//                   {participants.map((p) => (
//                     <PersonRow
//                       key={p.id}
//                       name={p.name}
//                       isHost={p.isHost}
//                       self={p.self}
//                     />
//                   ))}
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </div>

//       <style>{`
//         @keyframes livePulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(1.5)} }
//         @keyframes recBlink  { 0%,100%{opacity:1} 50%{opacity:.2} }
//         @keyframes spin      { to{transform:rotate(360deg)} }
//       `}</style>
//     </div>
//   );
// };

// /* ─────────────────────────────────────────────────────────────
//    SUB-COMPONENTS
// ───────────────────────────────────────────────────────────── */
// const Chevron = ({ dir }) => (
//   <svg width="5" height="10" viewBox="0 0 6 12" fill="none">
//     {dir === "right"
//       ? <path d="M1 1L6 6L1 11" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" />
//       : <path d="M5 1L0 6L5 11" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" />
//     }
//   </svg>
// );

// const TabBtn = ({ active, label, onClick }) => (
//   <button
//     onClick={onClick}
//     style={{
//       flex: 1, padding: "11px 0", border: "none", background: "transparent",
//       borderBottom: active ? "2px solid #3b82f6" : "2px solid transparent",
//       color: active ? "#60a5fa" : "#475569",
//       fontFamily: "inherit", fontSize: 13, fontWeight: 600,
//       cursor: "pointer", transition: "all .15s",
//       ...(active ? { background: "rgba(59,130,246,.08)" } : {}),
//     }}
//   >
//     {label}
//   </button>
// );

// const PersonRow = ({ name, isHost, self }) => (
//   <div style={S.pRow}>
//     <div style={{
//       ...S.pAv,
//       background: self
//         ? "linear-gradient(135deg,#0ea5e9,#6366f1)"
//         : "linear-gradient(135deg,#8b5cf6,#ec4899)",
//     }}>
//       {(name || "?")[0].toUpperCase()}
//     </div>
//     <span style={S.pName}>{name}</span>
//     {isHost && <span style={S.hostTag}>Host</span>}
//     {self   && <span style={S.youTag}>You</span>}
//   </div>
// );

// const CtrlBtn = ({ icon, label, active, danger, onClick }) => {
//   const [hov, setHov] = useState(false);
//   const bg  = danger ? (hov ? "#991b1b" : "#7f1d1d")
//             : active ? (hov ? "rgba(59,130,246,.38)" : "rgba(59,130,246,.22)")
//                      : (hov ? "rgba(255,255,255,.14)" : "rgba(255,255,255,.07)");
//   const col = danger ? "#fca5a5"
//             : active ? "#93c5fd"
//                      : "#cbd5e1";
//   return (
//     <button
//       onClick={onClick}
//       onMouseEnter={() => setHov(true)}
//       onMouseLeave={() => setHov(false)}
//       style={{
//         display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
//         background: bg, color: col,
//         border: danger ? "1px solid rgba(239,68,68,.3)"
//               : active ? "1px solid rgba(59,130,246,.35)"
//                        : "1px solid transparent",
//         borderRadius: 14, padding: "10px 20px",
//         cursor: "pointer", fontSize: 11, fontWeight: 600,
//         fontFamily: "inherit", letterSpacing: 0.3, transition: "all .18s",
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
//     position: "fixed", inset: 0, zIndex: 9999,
//     display: "flex", flexDirection: "column",
//     background: "#07090f", color: "#e2e8f0",
//     fontFamily: "'DM Sans','Segoe UI',sans-serif",
//     overflow: "hidden",
//   },

//   /* TOP BAR */
//   topBar: {
//     flexShrink: 0,
//     display: "flex", alignItems: "center", justifyContent: "space-between",
//     padding: "8px 18px",
//     background: "#0d1117", borderBottom: "1px solid rgba(255,255,255,.07)",
//     zIndex: 10,
//   },
//   topLeft:  { display: "flex", alignItems: "center", gap: 10 },
//   topRight: { display: "flex", alignItems: "center", gap: 8  },

//   liveBadge: {
//     display: "flex", alignItems: "center", gap: 5,
//     padding: "3px 9px", borderRadius: 8,
//     background: "rgba(239,68,68,.14)", border: "1px solid rgba(239,68,68,.28)",
//     fontSize: 10, fontWeight: 800, letterSpacing: 1.5, color: "#ef4444",
//   },
//   liveDot: {
//     width: 7, height: 7, borderRadius: "50%", background: "#ef4444",
//     animation: "livePulse 1.2s ease-in-out infinite", display: "inline-block",
//   },
//   timerText:    { fontFamily: "monospace", fontSize: 13, color: "#94a3b8", letterSpacing: 0.5 },
//   sessionTitle: { fontSize: 14, fontWeight: 600, color: "#f1f5f9" },
//   recBadge: {
//     display: "flex", alignItems: "center", gap: 5,
//     padding: "3px 8px", borderRadius: 8,
//     background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.2)",
//     fontSize: 10, fontWeight: 700, letterSpacing: 1, color: "#fca5a5",
//   },
//   pCountBadge: {
//     display: "flex", alignItems: "center", gap: 6,
//     padding: "5px 12px", borderRadius: 10,
//     background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.09)",
//     fontSize: 12, color: "#94a3b8",
//   },
//   recBtn: {
//     display: "flex", alignItems: "center", gap: 5,
//     padding: "5px 12px", borderRadius: 10,
//     fontSize: 11, fontWeight: 700, cursor: "pointer",
//     fontFamily: "inherit", letterSpacing: 0.3, border: "1px solid transparent",
//     transition: "all .15s",
//   },
//   recBtnOn:  { background: "rgba(239,68,68,.15)", border: "1px solid rgba(239,68,68,.3)", color: "#f87171" },
//   recBtnOff: { background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.09)", color: "#94a3b8" },
//   endBtn: {
//     display: "flex", alignItems: "center", gap: 6,
//     padding: "7px 16px", borderRadius: 10, border: "none",
//     background: "linear-gradient(135deg,#dc2626,#ef4444)",
//     color: "#fff", fontSize: 13, fontWeight: 700,
//     cursor: "pointer", fontFamily: "inherit", letterSpacing: 0.2,
//   },
//   closeBtn: {
//     display: "flex", alignItems: "center", justifyContent: "center",
//     width: 32, height: 32, borderRadius: 8, border: "1px solid rgba(255,255,255,.09)",
//     background: "rgba(255,255,255,.04)", color: "#64748b",
//     cursor: "pointer", transition: "all .15s",
//   },

//   /* BODY */
//   body:      { flex: 1, display: "flex", overflow: "hidden", minHeight: 0 },

//   /* VIDEO */
//   videoArea: { flex: 1, position: "relative", overflow: "hidden", minWidth: 0, background: "#05070d" },

//   /* Remote participants — simple CSS grid that auto-fills tiles */
//   remoteGrid: {
//     position: "absolute", inset: 0,
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
//     gap: 4, padding: 4,
//     alignContent: "center",
//     paddingBottom: 80,   /* leave room for control bar */
//   },

//   /* Trainer PIP */
//   pip: {
//     position: "absolute", bottom: 90, right: 16,
//     width: 176, height: 118, borderRadius: 14,
//     overflow: "hidden", border: "2px solid rgba(255,255,255,.13)",
//     background: "#0d1117", boxShadow: "0 8px 32px rgba(0,0,0,.7)", zIndex: 10,
//   },
//   pipOff: {
//     position: "absolute", inset: 0,
//     display: "flex", flexDirection: "column",
//     alignItems: "center", justifyContent: "center", gap: 5, background: "#0f172a",
//   },
//   pipOffTxt: { fontSize: 10, color: "#475569" },
//   pipLabel: {
//     position: "absolute", bottom: 6, left: 8,
//     fontSize: 10, color: "#fff",
//     background: "rgba(0,0,0,.6)", padding: "1px 7px", borderRadius: 5,
//     pointerEvents: "none",
//   },

//   /* Control bar — overlaid at bottom of video area */
//   ctrlBar: {
//     position: "absolute", bottom: 0, left: 0, right: 0,
//     display: "flex", alignItems: "center", justifyContent: "center",
//     gap: 8, padding: "10px 24px",
//     background: "rgba(13,17,23,.92)",
//     backdropFilter: "blur(12px)",
//     borderTop: "1px solid rgba(255,255,255,.07)",
//     zIndex: 20,
//   },

//   loadingBox: {
//     position: "absolute", inset: 0,
//     display: "flex", flexDirection: "column",
//     alignItems: "center", justifyContent: "center", gap: 14,
//   },
//   spinner: {
//     width: 40, height: 40,
//     border: "4px solid rgba(59,130,246,.2)", borderTop: "4px solid #3b82f6",
//     borderRadius: "50%", animation: "spin .8s linear infinite",
//   },
//   loadingText: { fontSize: 13, color: "#475569" },

//   /* HANDLE */
//   handle: {
//     flexShrink: 0, width: 14,
//     display: "flex", alignItems: "center", justifyContent: "center",
//     background: "#0d1117", borderLeft: "1px solid rgba(255,255,255,.05)",
//     borderRight: "1px solid rgba(255,255,255,.05)",
//     cursor: "pointer", zIndex: 5, transition: "background .2s",
//   },
//   handlePill: {
//     display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
//     padding: "10px 3px", borderRadius: 8,
//     background: "#1e293b", border: "1px solid rgba(255,255,255,.1)",
//   },
//   handleLine: { width: 1, height: 12, background: "rgba(255,255,255,.15)" },

//   /* SIDEBAR */
//   sidebar: {
//     flexShrink: 0,
//     background: "#0d1117", borderLeft: "1px solid rgba(255,255,255,.07)",
//     display: "flex", flexDirection: "column",
//     overflow: "hidden", transition: "width .25s ease",
//   },
//   tabRow: {
//     flexShrink: 0,
//     display: "flex", borderBottom: "1px solid rgba(255,255,255,.07)",
//   },

//   /* CHAT */
//   msgList: {
//     flex: 1, overflowY: "auto",
//     padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10,
//     minHeight: 0,
//   },
//   sysRow:    { display: "flex", justifyContent: "center" },
//   sysBubble: {
//     fontSize: 11, color: "#475569", fontStyle: "italic",
//     background: "rgba(255,255,255,.04)", borderRadius: 8, padding: "3px 10px",
//   },
//   msgBlock:  { display: "flex", flexDirection: "column", gap: 2 },
//   msgUser:   { fontSize: 10, color: "#64748b", fontWeight: 600 },
//   msgBubble: {
//     maxWidth: "88%", padding: "7px 11px", borderRadius: 12,
//     fontSize: 13, color: "#f1f5f9", lineHeight: 1.45,
//   },
//   bubbleSelf:  { background: "linear-gradient(135deg,#1d4ed8,#3b82f6)", alignSelf: "flex-end", borderBottomRightRadius: 2 },
//   bubbleOther: { background: "#1e293b", borderBottomLeftRadius: 2 },
//   inputRow: {
//     flexShrink: 0,
//     display: "flex", gap: 8, padding: "10px 12px",
//     borderTop: "1px solid rgba(255,255,255,.07)",
//   },
//   chatInput: {
//     flex: 1, background: "#1e293b", border: "1px solid rgba(255,255,255,.08)",
//     borderRadius: 10, padding: "8px 12px", color: "#e2e8f0",
//     fontSize: 13, fontFamily: "inherit", outline: "none",
//   },
//   sendBtn: {
//     flexShrink: 0,
//     background: "linear-gradient(135deg,#1d4ed8,#2563eb)", border: "none",
//     borderRadius: 10, padding: "0 14px", color: "#fff",
//     cursor: "pointer", display: "flex", alignItems: "center",
//   },

//   /* PEOPLE */
//   peopleList: {
//     flex: 1, overflowY: "auto",
//     padding: "10px 12px", display: "flex", flexDirection: "column", gap: 4,
//     minHeight: 0,
//   },
//   emptyPeople: {
//     flex: 1, display: "flex", flexDirection: "column",
//     alignItems: "center", justifyContent: "center", gap: 8,
//   },
//   pRow: {
//     display: "flex", alignItems: "center", gap: 10,
//     padding: "8px 10px", borderRadius: 10,
//     background: "rgba(255,255,255,.03)",
//   },
//   pAv: {
//     width: 32, height: 32, borderRadius: "50%",
//     display: "flex", alignItems: "center", justifyContent: "center",
//     fontSize: 14, fontWeight: 700, flexShrink: 0,
//   },
//   pName:   { flex: 1, fontSize: 13, color: "#cbd5e1" },
//   hostTag: { fontSize: 10, background: "rgba(59,130,246,.15)", color: "#60a5fa", padding: "2px 8px", borderRadius: 6, fontWeight: 600 },
//   youTag:  { fontSize: 10, background: "rgba(52,211,153,.12)", color: "#6ee7b7", padding: "2px 8px", borderRadius: 6, fontWeight: 600 },
// };

// export default LiveSessionControls;















































/**
 * LiveSessionControls.jsx  — TRAINER SIDE  (full rewrite)
 *
 * KEY INSIGHT: The student side works perfectly because it uses <VideoConference />
 * which handles screen share, camera grid, and all tracks automatically.
 * The trainer side was using raw DOM manipulation which broke screen share.
 *
 * SOLUTION: Use the same <VideoConference /> for the video area (trainer side),
 * but keep the custom top bar (LIVE badge, timer, REC, End Session) and
 * custom sidebar (Chat + People) from the original design.
 *
 * HOW IT WORKS:
 *  - <LiveKitRoom> wraps everything so all hooks share one connection
 *  - <VideoConference /> handles: camera grid, screen share, mic/cam/share controls
 *  - <InnerSidebar> (inside LiveKitRoom) handles: chat via DataChannel, people list
 *  - Top bar uses useParticipants() + useLiveTimer for live counts/timer
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
  useParticipants,
  useDataChannel,
  useLocalParticipant,
} from "@livekit/components-react";
import "@livekit/components-styles";

import { startLiveSession, endLiveSession } from "@/services/liveSessionService";

import {
  FaPhoneSlash, FaTimes, FaDotCircle,
  FaUsers, FaPaperPlane,
} from "react-icons/fa";

/* ─────────────────────────────────────────────────────────────
   LIVE TIMER
───────────────────────────────────────────────────────────── */
const useLiveTimer = () => {
  const [secs, setSecs] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);
  const h = String(Math.floor(secs / 3600)).padStart(2, "0");
  const m = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
  const s = String(secs % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
};

const getTime = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

/* ─────────────────────────────────────────────────────────────
   TOP BAR INFO — must be inside LiveKitRoom to use hooks
───────────────────────────────────────────────────────────── */
const TopBarInfo = ({ sessionTitle, recording, setRecording, onEnd, onClose }) => {
  const participants = useParticipants();
  const timer = useLiveTimer();

  return (
    <div style={S.topBar}>
      <div style={S.topLeft}>
        <div style={S.liveBadge}><span style={S.liveDot} />LIVE</div>
        <span style={S.timerText}>{timer}</span>
        <span style={S.sessionTitle}>{sessionTitle}</span>
        {recording && (
          <div style={S.recBadge}>
            <FaDotCircle size={8} style={{ animation: "recBlink 1.5s infinite" }} /> REC
          </div>
        )}
      </div>

      <div style={S.topRight}>
        <div style={S.pCountBadge}>
          <FaUsers size={11} />
          <span>{participants.length + 1} Participants</span>
        </div>

        <button
          style={{ ...S.recBtn, ...(recording ? S.recBtnOn : S.recBtnOff) }}
          onClick={() => setRecording((r) => !r)}
        >
          <FaDotCircle size={10} />
          {recording ? "Recording" : "Record"}
        </button>

        <button style={S.endBtn} onClick={onEnd}>
          <FaPhoneSlash size={12} /> End Session
        </button>

        <button style={S.closeBtn} onClick={onClose}>
          <FaTimes size={14} />
        </button>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   SIDEBAR — must be inside LiveKitRoom to use hooks
───────────────────────────────────────────────────────────── */
const InnerSidebar = ({ sidebarTab, setSidebarTab }) => {
  const participants = useParticipants();
  const { localParticipant } = useLocalParticipant();

  /* ── Chat via DataChannel ── */
  const [messages, setMessages] = useState(() => [
    { id: 0, user: "System", text: "Session started. Welcome!", time: getTime(), system: true },
  ]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  const onMessage = useCallback((msg) => {
    try {
      const data = JSON.parse(new TextDecoder().decode(msg.payload));
      if (data.text) {
        setMessages((prev) => [
          ...prev,
          {
            id:   Date.now(),
            user: data.name || msg.from?.identity || "Student",
            text: data.text,
            time: getTime(),
          },
        ]);
      }
    } catch (_) {}
  }, []);

  const { send } = useDataChannel("chat", onMessage);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sidebarTab]);

  const sendMessage = useCallback(() => {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), user: "You (Trainer)", text, time: getTime(), self: true },
    ]);
    try {
      const payload = new TextEncoder().encode(
        JSON.stringify({ text, name: localParticipant?.name || "Trainer" })
      );
      send(payload, { reliable: true });
    } catch (e) { console.warn("send failed:", e); }
    setInput("");
  }, [input, send, localParticipant]);

  return (
    <div style={S.sidebar}>
      {/* Tabs */}
      <div style={S.tabRow}>
        <TabBtn active={sidebarTab === "chat"}   label="💬 Chat"   onClick={() => setSidebarTab("chat")} />
        <TabBtn active={sidebarTab === "people"} label="👥 People" onClick={() => setSidebarTab("people")} />
      </div>

      {/* ── CHAT ── */}
      {sidebarTab === "chat" && (
        <>
          <div style={S.msgList}>
            {messages.map((m) => (
              <div
                key={m.id}
                style={
                  m.system ? S.sysRow
                  : m.self  ? { ...S.msgBlock, alignItems: "flex-end" }
                  : S.msgBlock
                }
              >
                {m.system ? (
                  <div style={S.sysBubble}>{m.text}</div>
                ) : (
                  <>
                    <span style={S.msgUser}>{m.user} · {m.time}</span>
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
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
              }}
              placeholder="Message students…"
            />
            <button style={S.sendBtn} onClick={sendMessage}>
              <FaPaperPlane size={13} />
            </button>
          </div>
        </>
      )}

      {/* ── PEOPLE ── */}
      {sidebarTab === "people" && (
        <div style={S.peopleList}>
          {/* Trainer (local) */}
          <PersonRow
            name={localParticipant?.name || localParticipant?.identity || "You (Trainer)"}
            isHost
            self
          />
          {/* Remote participants */}
          {participants
            .filter((p) => p.identity !== localParticipant?.identity)
            .map((p) => (
              <PersonRow key={p.identity} name={p.name || p.identity} />
            ))
          }
          {participants.filter((p) => p.identity !== localParticipant?.identity).length === 0 && (
            <div style={S.emptyPeople}>
              <FaUsers size={28} style={{ opacity: 0.3 }} />
              <p style={{ fontSize: 12, color: "#475569", marginTop: 8 }}>No participants yet</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ═════════════════════════════════════════════════════════════
   MAIN COMPONENT
═════════════════════════════════════════════════════════════ */
const LiveSessionControls = () => {
  const navigate = useNavigate();
  const { id }   = useParams();

  const [token,        setToken]        = useState(null);
  const [sessionTitle, setSessionTitle] = useState(`Session ${id}`);
  const [recording,    setRecording]    = useState(true);
  const [sidebarOpen,  setSidebarOpen]  = useState(true);
  const [sidebarTab,   setSidebarTab]   = useState("chat");

  const serverUrl = import.meta.env.VITE_LIVEKIT_URL || "ws://localhost:7880";

  /* Start session & get token */
  useEffect(() => {
    if (!id) return;
    const start = async () => {
      try {
        const res = await startLiveSession(id);
        const tok = res?.data?.token || res?.data?.data?.token || res?.data?.body?.token;
        if (tok) setToken(tok);
        setSessionTitle(res?.data?.title || `Session ${id}`);
      } catch (err) {
        console.error("startLiveSession failed:", err);
      }
    };
    start();
  }, [id]);

  const handleEnd = useCallback(async () => {
    try { await endLiveSession(id); } catch (_) {}
    navigate("/trainer/live");
  }, [id, navigate]);

  /* ── Loading state (before token arrives) ── */
  if (!token) {
    return (
      <div style={S.root}>
        <div style={S.loadingBox}>
          <div style={S.spinner} />
          <p style={S.loadingText}>Starting live session…</p>
        </div>
        <style>{ANIMATIONS}</style>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════════ */
  return (
    <div style={S.root}>
      {/*
        Single <LiveKitRoom> wraps EVERYTHING:
          - TopBarInfo  (uses useParticipants)
          - VideoConference (handles all video/screen share)
          - InnerSidebar (uses useDataChannel + useParticipants)
        This ensures all hooks share the SAME room connection.
      */}
      <LiveKitRoom
        token={token}
        serverUrl={serverUrl}
        connect={true}
        video={true}
        audio={true}
        style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minHeight: 0 }}
      >
        {/* TOP BAR */}
        <TopBarInfo
          sessionTitle={sessionTitle}
          recording={recording}
          setRecording={setRecording}
          onEnd={handleEnd}
          onClose={() => navigate("/trainer/live")}
        />

        {/* BODY */}
        <div style={S.body}>

          {/*
            VIDEO AREA — VideoConference does everything:
            ✅ Shows trainer camera
            ✅ Shows all student cameras
            ✅ When trainer clicks "Share Screen" in control bar → students see it
            ✅ When student shares screen → trainer sees it (same as student side)
            ✅ Control bar: mic, cam, screen share, leave
          */}
          <div style={S.videoArea}>
            <VideoConference />
          </div>

          {/* HANDLE */}
          <div
            style={S.handle}
            onClick={() => setSidebarOpen((o) => !o)}
            title="Toggle panel"
          >
            <div style={S.handlePill}>
              {sidebarOpen
                ? <><Chevron dir="right" /><div style={S.handleLine} /><Chevron dir="left" /></>
                : <><Chevron dir="left"  /><div style={S.handleLine} /><Chevron dir="right" /></>
              }
            </div>
          </div>

          {/* SIDEBAR — custom chat + people panel */}
          {sidebarOpen && (
            <InnerSidebar
              sidebarTab={sidebarTab}
              setSidebarTab={setSidebarTab}
            />
          )}
        </div>

        <RoomAudioRenderer />
      </LiveKitRoom>

      <style>{ANIMATIONS}</style>
      <style>{LK_OVERRIDES}</style>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────────────────────────── */
const Chevron = ({ dir }) => (
  <svg width="5" height="10" viewBox="0 0 6 12" fill="none">
    {dir === "right"
      ? <path d="M1 1L6 6L1 11" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" />
      : <path d="M5 1L0 6L5 11" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" />
    }
  </svg>
);

const TabBtn = ({ active, label, onClick }) => (
  <button
    onClick={onClick}
    style={{
      flex: 1, padding: "11px 0", border: "none", background: "transparent",
      borderBottom: active ? "2px solid #3b82f6" : "2px solid transparent",
      color: active ? "#60a5fa" : "#475569",
      fontFamily: "inherit", fontSize: 13, fontWeight: 600,
      cursor: "pointer", transition: "all .15s",
      ...(active ? { background: "rgba(59,130,246,.08)" } : {}),
    }}
  >
    {label}
  </button>
);

const PersonRow = ({ name, isHost, self }) => (
  <div style={S.pRow}>
    <div style={{
      ...S.pAv,
      background: self
        ? "linear-gradient(135deg,#0ea5e9,#6366f1)"
        : "linear-gradient(135deg,#8b5cf6,#ec4899)",
    }}>
      {(name || "?")[0].toUpperCase()}
    </div>
    <span style={S.pName}>{name}</span>
    {isHost && <span style={S.hostTag}>Host</span>}
    {self   && <span style={S.youTag}>You</span>}
  </div>
);

/* ─────────────────────────────────────────────────────────────
   CSS
───────────────────────────────────────────────────────────── */
const ANIMATIONS = `
  @keyframes livePulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(1.5)} }
  @keyframes recBlink  { 0%,100%{opacity:1} 50%{opacity:.2} }
  @keyframes spin      { to{transform:rotate(360deg)} }
`;

const LK_OVERRIDES = `
  .lk-room-container,
  [data-lk-theme="default"] {
    height: 100% !important;
    width: 100% !important;
    min-height: 0 !important;
    background: #07090f !important;
  }
  .lk-control-bar      { flex-shrink: 0 !important; z-index: 50 !important; }
  .lk-focus-layout,
  .lk-grid-layout      { flex: 1 !important; min-height: 0 !important; }
  .lk-participant-tile { min-height: 0 !important; }
  .lk-screen-share-view {
    width: 100% !important;
    height: 100% !important;
    object-fit: contain !important;
  }
`;

/* ─────────────────────────────────────────────────────────────
   STYLES
───────────────────────────────────────────────────────────── */
const S = {
  root: {
    position: "fixed", inset: 0, zIndex: 9999,
    display: "flex", flexDirection: "column",
    background: "#07090f", color: "#e2e8f0",
    fontFamily: "'DM Sans','Segoe UI',sans-serif",
    overflow: "hidden",
  },

  /* TOP BAR */
  topBar: {
    flexShrink: 0,
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "8px 18px",
    background: "#0d1117", borderBottom: "1px solid rgba(255,255,255,.07)",
    zIndex: 10,
  },
  topLeft:  { display: "flex", alignItems: "center", gap: 10 },
  topRight: { display: "flex", alignItems: "center", gap: 8  },
  liveBadge: {
    display: "flex", alignItems: "center", gap: 5,
    padding: "3px 9px", borderRadius: 8,
    background: "rgba(239,68,68,.14)", border: "1px solid rgba(239,68,68,.28)",
    fontSize: 10, fontWeight: 800, letterSpacing: 1.5, color: "#ef4444",
  },
  liveDot: {
    width: 7, height: 7, borderRadius: "50%", background: "#ef4444",
    animation: "livePulse 1.2s ease-in-out infinite", display: "inline-block",
  },
  timerText:    { fontFamily: "monospace", fontSize: 13, color: "#94a3b8", letterSpacing: 0.5 },
  sessionTitle: { fontSize: 14, fontWeight: 600, color: "#f1f5f9" },
  recBadge: {
    display: "flex", alignItems: "center", gap: 5,
    padding: "3px 8px", borderRadius: 8,
    background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.2)",
    fontSize: 10, fontWeight: 700, letterSpacing: 1, color: "#fca5a5",
  },
  pCountBadge: {
    display: "flex", alignItems: "center", gap: 6,
    padding: "5px 12px", borderRadius: 10,
    background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.09)",
    fontSize: 12, color: "#94a3b8",
  },
  recBtn: {
    display: "flex", alignItems: "center", gap: 5,
    padding: "5px 12px", borderRadius: 10,
    fontSize: 11, fontWeight: 700, cursor: "pointer",
    fontFamily: "inherit", letterSpacing: 0.3, border: "1px solid transparent",
    transition: "all .15s",
  },
  recBtnOn:  { background: "rgba(239,68,68,.15)", border: "1px solid rgba(239,68,68,.3)", color: "#f87171" },
  recBtnOff: { background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.09)", color: "#94a3b8" },
  endBtn: {
    display: "flex", alignItems: "center", gap: 6,
    padding: "7px 16px", borderRadius: 10, border: "none",
    background: "linear-gradient(135deg,#dc2626,#ef4444)",
    color: "#fff", fontSize: 13, fontWeight: 700,
    cursor: "pointer", fontFamily: "inherit", letterSpacing: 0.2,
  },
  closeBtn: {
    display: "flex", alignItems: "center", justifyContent: "center",
    width: 32, height: 32, borderRadius: 8, border: "1px solid rgba(255,255,255,.09)",
    background: "rgba(255,255,255,.04)", color: "#64748b",
    cursor: "pointer", transition: "all .15s",
  },

  /* BODY */
  body: { flex: 1, display: "flex", overflow: "hidden", minHeight: 0 },

  /* VIDEO */
  videoArea: {
    flex: 1, display: "flex", flexDirection: "column",
    overflow: "hidden", minWidth: 0, minHeight: 0,
    background: "#07090f",
  },

  /* HANDLE */
  handle: {
    flexShrink: 0, width: 14,
    display: "flex", alignItems: "center", justifyContent: "center",
    background: "#0d1117", borderLeft: "1px solid rgba(255,255,255,.05)",
    borderRight: "1px solid rgba(255,255,255,.05)",
    cursor: "pointer", zIndex: 5,
  },
  handlePill: {
    display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
    padding: "10px 3px", borderRadius: 8,
    background: "#1e293b", border: "1px solid rgba(255,255,255,.1)",
  },
  handleLine: { width: 1, height: 12, background: "rgba(255,255,255,.15)" },

  /* SIDEBAR */
  sidebar: {
    width: 340, flexShrink: 0,
    background: "#0d1117", borderLeft: "1px solid rgba(255,255,255,.07)",
    display: "flex", flexDirection: "column",
    overflow: "hidden",
  },
  tabRow: {
    flexShrink: 0,
    display: "flex", borderBottom: "1px solid rgba(255,255,255,.07)",
  },

  /* CHAT */
  msgList: {
    flex: 1, overflowY: "auto",
    padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10,
    minHeight: 0,
  },
  sysRow:    { display: "flex", justifyContent: "center" },
  sysBubble: {
    fontSize: 11, color: "#475569", fontStyle: "italic",
    background: "rgba(255,255,255,.04)", borderRadius: 8, padding: "3px 10px",
  },
  msgBlock:  { display: "flex", flexDirection: "column", gap: 2 },
  msgUser:   { fontSize: 10, color: "#64748b", fontWeight: 600 },
  msgBubble: {
    maxWidth: "88%", padding: "7px 11px", borderRadius: 12,
    fontSize: 13, color: "#f1f5f9", lineHeight: 1.45,
  },
  bubbleSelf:  { background: "linear-gradient(135deg,#1d4ed8,#3b82f6)", alignSelf: "flex-end", borderBottomRightRadius: 2 },
  bubbleOther: { background: "#1e293b", borderBottomLeftRadius: 2 },
  inputRow: {
    flexShrink: 0,
    display: "flex", gap: 8, padding: "10px 12px",
    borderTop: "1px solid rgba(255,255,255,.07)",
  },
  chatInput: {
    flex: 1, background: "#1e293b", border: "1px solid rgba(255,255,255,.08)",
    borderRadius: 10, padding: "8px 12px", color: "#e2e8f0",
    fontSize: 13, fontFamily: "inherit", outline: "none",
  },
  sendBtn: {
    flexShrink: 0,
    background: "linear-gradient(135deg,#1d4ed8,#2563eb)", border: "none",
    borderRadius: 10, padding: "0 14px", color: "#fff",
    cursor: "pointer", display: "flex", alignItems: "center",
  },

  /* PEOPLE */
  peopleList: {
    flex: 1, overflowY: "auto",
    padding: "10px 12px", display: "flex", flexDirection: "column", gap: 4,
    minHeight: 0,
  },
  emptyPeople: {
    flex: 1, display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center", gap: 8,
  },
  pRow: {
    display: "flex", alignItems: "center", gap: 10,
    padding: "8px 10px", borderRadius: 10,
    background: "rgba(255,255,255,.03)",
  },
  pAv: {
    width: 32, height: 32, borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 14, fontWeight: 700, flexShrink: 0,
  },
  pName:   { flex: 1, fontSize: 13, color: "#cbd5e1" },
  hostTag: { fontSize: 10, background: "rgba(59,130,246,.15)", color: "#60a5fa", padding: "2px 8px", borderRadius: 6, fontWeight: 600 },
  youTag:  { fontSize: 10, background: "rgba(52,211,153,.12)", color: "#6ee7b7", padding: "2px 8px", borderRadius: 6, fontWeight: 600 },

  /* LOADING */
  loadingBox: {
    flex: 1, display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center", gap: 14,
  },
  spinner: {
    width: 40, height: 40,
    border: "4px solid rgba(59,130,246,.2)", borderTop: "4px solid #3b82f6",
    borderRadius: "50%", animation: "spin .8s linear infinite",
  },
  loadingText: { fontSize: 13, color: "#475569" },
};

export default LiveSessionControls;