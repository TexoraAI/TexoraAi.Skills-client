// import { useEffect, useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { joinCall } from "@/services/liveSessionService";
// import { Client } from "@stomp/stompjs";

// // ✅ Single source of truth for WebSocket URL
// const wsUrl = (import.meta.env.VITE_WS_BASE_URL || "ws://localhost:9000") + "/live-chat";

// const getTrainerEmail = () => {
//   try {
//     const lmsUser = localStorage.getItem("lms_user");
//     if (lmsUser) {
//       const parsed = JSON.parse(lmsUser);
//       if (parsed.email) return parsed.email;
//     }
//   } catch {}
//   return null;
// };

// const TrainerJoinCall = () => {
//   const [room, setRoom] = useState(null);
//   const [connected, setConnected] = useState(false);
//   const [trainerEmail, setTrainerEmail] = useState(null);
//   const [isDark, setIsDark] = useState(
//     () => document.documentElement.classList.contains("dark") ||
//           window.matchMedia("(prefers-color-scheme: dark)").matches
//   );
//   const navigate = useNavigate();
//   const stompClientRef = useRef(null);

//   useEffect(() => {
//     const observer = new MutationObserver(() => {
//       setIsDark(document.documentElement.classList.contains("dark"));
//     });
//     observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
//     return () => observer.disconnect();
//   }, []);

//   useEffect(() => {
//     const email = getTrainerEmail();
//     if (!email) return;
//     setTrainerEmail(email);

//     // ✅ Use the top-level wsUrl — no re-declaration, no API_BASE_URL confusion
//     const client = new Client({
//       brokerURL: wsUrl,
//       reconnectDelay: 5000,
//       onConnect: () => {
//         setConnected(true);
//         client.subscribe(`/topic/calls/${email}`, (msg) => {
//           setRoom(msg.body);
//         });
//       },
//       onDisconnect: () => setConnected(false),
//       onStompError: (frame) => console.error("STOMP error:", frame),
//     });

//     client.activate();
//     stompClientRef.current = client;
//     return () => client.deactivate();
//   }, []);

//   const handleJoin = async () => {
//     try {
//       if (!room) return alert("No incoming call");
//       const res = await joinCall(room);
//       const { token } = res.data;
//       if (!token) return alert("Invalid token from server");
//       sessionStorage.setItem("call_state", JSON.stringify({ room, token }));
//       navigate("/trainer/call-room", { state: { room, token } });
//     } catch (err) {
//       console.error("Join failed:", err);
//       alert("Failed to join call.");
//     }
//   };

//   const t = isDark ? dark : light;

//   return (
//     <div style={t.page}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Instrument+Sans:wght@300;400;500&display=swap');

//         @keyframes pulse-ring {
//           0%   { transform: scale(0.95); opacity: 0.7; }
//           70%  { transform: scale(1.35); opacity: 0; }
//           100% { transform: scale(0.95); opacity: 0; }
//         }
//         @keyframes pulse-ring-2 {
//           0%   { transform: scale(0.95); opacity: 0.5; }
//           70%  { transform: scale(1.6);  opacity: 0; }
//           100% { transform: scale(0.95); opacity: 0; }
//         }
//         @keyframes float-in {
//           from { opacity: 0; transform: translateY(32px) scale(0.97); }
//           to   { opacity: 1; transform: translateY(0) scale(1); }
//         }
//         @keyframes status-dot {
//           0%, 100% { opacity: 1; }
//           50%       { opacity: 0.3; }
//         }
//       `}</style>

//       <div style={t.orb1} />
//       <div style={t.orb2} />

//       <div style={t.card}>
//         {/* Header strip */}
//         <div style={t.headerStrip}>
//           <div style={t.logoMark}>
//             <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
//               <rect width="18" height="18" rx="5" fill={isDark ? "#6366f1" : "#4f46e5"}/>
//               <path d="M5 9h8M9 5v8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
//             </svg>
//           </div>
//           <span style={t.headerTitle}>TRAINER CONSOLE</span>
//           <div style={t.statusPill}>
//             <span style={{
//               ...t.statusDot,
//               animation: connected ? "status-dot 2s ease-in-out infinite" : "none",
//               background: connected ? "#22c55e" : "#ef4444"
//             }} />
//             <span style={t.statusText}>{connected ? "LIVE" : "OFFLINE"}</span>
//           </div>
//         </div>

//         {/* Main content */}
//         {room ? (
//           /* ── INCOMING CALL STATE ── */
//           <div style={t.callContainer}>
//             <div style={t.avatarWrap}>
//               <div style={{ ...t.pulseRing, animation: "pulse-ring 2s ease-out infinite" }} />
//               <div style={{ ...t.pulseRing, animation: "pulse-ring-2 2s ease-out infinite 0.4s" }} />
//               <div style={t.avatarOuter}>
//                 <div style={t.avatarInner}>
//                   <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
//                     <circle cx="22" cy="17" r="9" fill="rgba(255,255,255,0.9)" />
//                     <ellipse cx="22" cy="38" rx="15" ry="9" fill="rgba(255,255,255,0.9)" />
//                   </svg>
//                 </div>
//               </div>
//             </div>

//             <div style={t.callInfo}>
//               <p style={t.callLabel}>INCOMING CALL</p>
//               <h2 style={t.callTitle}>Student</h2>
//               <p style={t.callRoom}>Room · {room}</p>
//             </div>

//             <div style={t.actionRow}>
//               <button
//                 style={t.declineBtn}
//                 onClick={() => setRoom(null)}
//                 onMouseEnter={e => e.currentTarget.style.transform = "scale(1.06)"}
//                 onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
//               >
//                 <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
//                   <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
//                 </svg>
//                 <span style={t.btnSubLabel}>Decline</span>
//               </button>

//               <button
//                 style={t.acceptBtn}
//                 onClick={handleJoin}
//                 onMouseEnter={e => e.currentTarget.style.transform = "scale(1.06)"}
//                 onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
//               >
//                 <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//                   <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.1 1.18 2 2 0 012.08 0h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 16.92z"/>
//                 </svg>
//                 <span style={t.btnSubLabel}>Accept</span>
//               </button>
//             </div>
//           </div>
//         ) : (
//           /* ── WAITING STATE ── */
//           <div style={t.waitingContainer}>
//             <div style={t.radarWrap}>
//               <div style={t.radarOuter}>
//                 <div style={t.radarMiddle}>
//                   <div style={t.radarInner}>
//                     <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={isDark ? "#a5b4fc" : "#6366f1"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                       <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.1 1.18 2 2 0 012.08 0h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 16.92z"/>
//                     </svg>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div style={t.waitingTextBlock}>
//               <h3 style={t.waitingTitle}>Waiting for calls</h3>
//               <p style={t.waitingSubtitle}>
//                 {connected
//                   ? `Listening as ${trainerEmail ?? "trainer"}`
//                   : trainerEmail
//                     ? "Connecting to server…"
//                     : "Email not found in storage"}
//               </p>
//             </div>

//             <div style={t.dotRow}>
//               {[0,1,2,3,4].map(i => (
//                 <div key={i} style={{
//                   ...t.dot,
//                   animationDelay: `${i * 0.18}s`,
//                   animation: "status-dot 1.4s ease-in-out infinite",
//                   background: connected
//                     ? (isDark ? "#6366f1" : "#4f46e5")
//                     : (isDark ? "#374151" : "#d1d5db")
//                 }} />
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Footer */}
//         <div style={t.footer}>
//           <span style={t.footerText}>
//             {room ? "Respond within 30s · call will auto-dismiss" : "Auto-rings when student dials in"}
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ─── DARK THEME ──────────────────────────────────────────────────── */
// const dark = {
//   page: {
//     minHeight: "100vh",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     background: "#080b14",
//     fontFamily: "'Instrument Sans', sans-serif",
//     position: "relative",
//     overflow: "hidden",
//   },
//   orb1: {
//     position: "fixed",
//     width: 600,
//     height: 600,
//     borderRadius: "50%",
//     background: "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 65%)",
//     top: "-200px",
//     right: "-150px",
//     pointerEvents: "none",
//   },
//   orb2: {
//     position: "fixed",
//     width: 500,
//     height: 500,
//     borderRadius: "50%",
//     background: "radial-gradient(circle, rgba(34,197,94,0.1) 0%, transparent 65%)",
//     bottom: "-180px",
//     left: "-100px",
//     pointerEvents: "none",
//   },
//   card: {
//     position: "relative",
//     zIndex: 10,
//     width: 420,
//     background: "rgba(15,20,35,0.85)",
//     backdropFilter: "blur(32px)",
//     WebkitBackdropFilter: "blur(32px)",
//     border: "1px solid rgba(255,255,255,0.07)",
//     borderRadius: 28,
//     overflow: "hidden",
//     boxShadow: "0 40px 100px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
//     animation: "float-in 0.5s cubic-bezier(0.22,1,0.36,1) both",
//   },
//   headerStrip: {
//     display: "flex",
//     alignItems: "center",
//     gap: 10,
//     padding: "18px 24px",
//     borderBottom: "1px solid rgba(255,255,255,0.05)",
//     background: "rgba(255,255,255,0.02)",
//   },
//   logoMark: { display: "flex", alignItems: "center" },
//   headerTitle: {
//     flex: 1,
//     fontFamily: "'Syne', sans-serif",
//     fontWeight: 700,
//     fontSize: 11,
//     letterSpacing: "0.2em",
//     color: "rgba(255,255,255,0.4)",
//   },
//   statusPill: {
//     display: "flex",
//     alignItems: "center",
//     gap: 6,
//     background: "rgba(255,255,255,0.05)",
//     border: "1px solid rgba(255,255,255,0.08)",
//     borderRadius: 20,
//     padding: "4px 10px",
//   },
//   statusDot: { width: 6, height: 6, borderRadius: "50%", display: "inline-block" },
//   statusText: {
//     fontFamily: "'Syne', sans-serif",
//     fontSize: 10,
//     fontWeight: 700,
//     letterSpacing: "0.15em",
//     color: "rgba(255,255,255,0.5)",
//   },
//   waitingContainer: {
//     padding: "48px 40px 40px",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     gap: 28,
//   },
//   radarWrap: { position: "relative" },
//   radarOuter: {
//     width: 120,
//     height: 120,
//     borderRadius: "50%",
//     border: "1.5px solid rgba(99,102,241,0.2)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     animation: "status-dot 3s ease-in-out infinite",
//   },
//   radarMiddle: {
//     width: 88,
//     height: 88,
//     borderRadius: "50%",
//     border: "1.5px solid rgba(99,102,241,0.3)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   radarInner: {
//     width: 60,
//     height: 60,
//     borderRadius: "50%",
//     background: "rgba(99,102,241,0.12)",
//     border: "1.5px solid rgba(99,102,241,0.45)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   waitingTextBlock: { textAlign: "center" },
//   waitingTitle: {
//     fontFamily: "'Syne', sans-serif",
//     fontSize: 26,
//     fontWeight: 700,
//     color: "rgba(255,255,255,0.9)",
//     margin: "0 0 8px",
//     letterSpacing: "-0.03em",
//   },
//   waitingSubtitle: { fontSize: 13, color: "rgba(255,255,255,0.35)", margin: 0, fontWeight: 300 },
//   dotRow: { display: "flex", gap: 8, alignItems: "center" },
//   dot: { width: 5, height: 5, borderRadius: "50%" },
//   callContainer: {
//     padding: "44px 40px 40px",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     gap: 32,
//   },
//   avatarWrap: {
//     position: "relative",
//     width: 120,
//     height: 120,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   pulseRing: {
//     position: "absolute",
//     inset: 0,
//     borderRadius: "50%",
//     border: "2px solid rgba(99,102,241,0.6)",
//   },
//   avatarOuter: {
//     width: 90,
//     height: 90,
//     borderRadius: "50%",
//     background: "linear-gradient(135deg, #312e81 0%, #6366f1 100%)",
//     padding: 3,
//     zIndex: 2,
//   },
//   avatarInner: {
//     width: "100%",
//     height: "100%",
//     borderRadius: "50%",
//     background: "linear-gradient(135deg, #4338ca 0%, #818cf8 100%)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   callInfo: { textAlign: "center" },
//   callLabel: {
//     fontFamily: "'Syne', sans-serif",
//     fontSize: 10,
//     fontWeight: 700,
//     letterSpacing: "0.22em",
//     color: "rgba(255,255,255,0.3)",
//     margin: "0 0 8px",
//     animation: "status-dot 2s ease-in-out infinite",
//   },
//   callTitle: {
//     fontFamily: "'Syne', sans-serif",
//     fontSize: 32,
//     fontWeight: 800,
//     color: "#fff",
//     margin: "0 0 6px",
//     letterSpacing: "-0.04em",
//   },
//   callRoom: { fontSize: 12, color: "rgba(255,255,255,0.3)", margin: 0, fontWeight: 300 },
//   actionRow: { display: "flex", gap: 24 },
//   declineBtn: {
//     width: 72,
//     height: 72,
//     borderRadius: "50%",
//     background: "linear-gradient(135deg, #7f1d1d, #ef4444)",
//     border: "none",
//     cursor: "pointer",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 4,
//     boxShadow: "0 8px 32px rgba(239,68,68,0.4)",
//     transition: "transform 0.2s ease",
//   },
//   acceptBtn: {
//     width: 72,
//     height: 72,
//     borderRadius: "50%",
//     background: "linear-gradient(135deg, #14532d, #22c55e)",
//     border: "none",
//     cursor: "pointer",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 4,
//     boxShadow: "0 8px 32px rgba(34,197,94,0.45)",
//     transition: "transform 0.2s ease",
//   },
//   btnSubLabel: {
//     fontSize: 9,
//     fontWeight: 600,
//     color: "rgba(255,255,255,0.7)",
//     letterSpacing: "0.1em",
//     fontFamily: "'Syne', sans-serif",
//   },
//   footer: {
//     padding: "14px 24px",
//     borderTop: "1px solid rgba(255,255,255,0.04)",
//     textAlign: "center",
//   },
//   footerText: { fontSize: 11, color: "rgba(255,255,255,0.2)", fontWeight: 300, letterSpacing: "0.02em" },
// };

// /* ─── LIGHT THEME ─────────────────────────────────────────────────── */
// const light = {
//   page: {
//     minHeight: "100vh",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     background: "#f1f4f9",
//     fontFamily: "'Instrument Sans', sans-serif",
//     position: "relative",
//     overflow: "hidden",
//   },
//   orb1: {
//     position: "fixed",
//     width: 700,
//     height: 700,
//     borderRadius: "50%",
//     background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 65%)",
//     top: "-260px",
//     right: "-200px",
//     pointerEvents: "none",
//   },
//   orb2: {
//     position: "fixed",
//     width: 500,
//     height: 500,
//     borderRadius: "50%",
//     background: "radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 65%)",
//     bottom: "-200px",
//     left: "-100px",
//     pointerEvents: "none",
//   },
//   card: {
//     position: "relative",
//     zIndex: 10,
//     width: 420,
//     background: "rgba(255,255,255,0.92)",
//     backdropFilter: "blur(32px)",
//     WebkitBackdropFilter: "blur(32px)",
//     border: "1px solid rgba(0,0,0,0.06)",
//     borderRadius: 28,
//     overflow: "hidden",
//     boxShadow: "0 24px 64px rgba(0,0,0,0.09), 0 2px 8px rgba(0,0,0,0.04)",
//     animation: "float-in 0.5s cubic-bezier(0.22,1,0.36,1) both",
//   },
//   headerStrip: {
//     display: "flex",
//     alignItems: "center",
//     gap: 10,
//     padding: "18px 24px",
//     borderBottom: "1px solid rgba(0,0,0,0.05)",
//     background: "rgba(0,0,0,0.01)",
//   },
//   logoMark: { display: "flex", alignItems: "center" },
//   headerTitle: {
//     flex: 1,
//     fontFamily: "'Syne', sans-serif",
//     fontWeight: 700,
//     fontSize: 11,
//     letterSpacing: "0.2em",
//     color: "rgba(0,0,0,0.35)",
//   },
//   statusPill: {
//     display: "flex",
//     alignItems: "center",
//     gap: 6,
//     background: "rgba(0,0,0,0.04)",
//     border: "1px solid rgba(0,0,0,0.07)",
//     borderRadius: 20,
//     padding: "4px 10px",
//   },
//   statusDot: { width: 6, height: 6, borderRadius: "50%", display: "inline-block" },
//   statusText: {
//     fontFamily: "'Syne', sans-serif",
//     fontSize: 10,
//     fontWeight: 700,
//     letterSpacing: "0.15em",
//     color: "rgba(0,0,0,0.4)",
//   },
//   waitingContainer: {
//     padding: "48px 40px 40px",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     gap: 28,
//   },
//   radarWrap: { position: "relative" },
//   radarOuter: {
//     width: 120,
//     height: 120,
//     borderRadius: "50%",
//     border: "1.5px solid rgba(79,70,229,0.15)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     animation: "status-dot 3s ease-in-out infinite",
//   },
//   radarMiddle: {
//     width: 88,
//     height: 88,
//     borderRadius: "50%",
//     border: "1.5px solid rgba(79,70,229,0.25)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   radarInner: {
//     width: 60,
//     height: 60,
//     borderRadius: "50%",
//     background: "rgba(79,70,229,0.07)",
//     border: "1.5px solid rgba(79,70,229,0.35)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   waitingTextBlock: { textAlign: "center" },
//   waitingTitle: {
//     fontFamily: "'Syne', sans-serif",
//     fontSize: 26,
//     fontWeight: 700,
//     color: "#1e1b4b",
//     margin: "0 0 8px",
//     letterSpacing: "-0.03em",
//   },
//   waitingSubtitle: { fontSize: 13, color: "rgba(0,0,0,0.38)", margin: 0, fontWeight: 300 },
//   dotRow: { display: "flex", gap: 8, alignItems: "center" },
//   dot: { width: 5, height: 5, borderRadius: "50%" },
//   callContainer: {
//     padding: "44px 40px 40px",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     gap: 32,
//   },
//   avatarWrap: {
//     position: "relative",
//     width: 120,
//     height: 120,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   pulseRing: {
//     position: "absolute",
//     inset: 0,
//     borderRadius: "50%",
//     border: "2px solid rgba(79,70,229,0.5)",
//   },
//   avatarOuter: {
//     width: 90,
//     height: 90,
//     borderRadius: "50%",
//     background: "linear-gradient(135deg, #c7d2fe 0%, #6366f1 100%)",
//     padding: 3,
//     zIndex: 2,
//   },
//   avatarInner: {
//     width: "100%",
//     height: "100%",
//     borderRadius: "50%",
//     background: "linear-gradient(135deg, #4338ca 0%, #818cf8 100%)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   callInfo: { textAlign: "center" },
//   callLabel: {
//     fontFamily: "'Syne', sans-serif",
//     fontSize: 10,
//     fontWeight: 700,
//     letterSpacing: "0.22em",
//     color: "rgba(0,0,0,0.3)",
//     margin: "0 0 8px",
//     animation: "status-dot 2s ease-in-out infinite",
//   },
//   callTitle: {
//     fontFamily: "'Syne', sans-serif",
//     fontSize: 32,
//     fontWeight: 800,
//     color: "#1e1b4b",
//     margin: "0 0 6px",
//     letterSpacing: "-0.04em",
//   },
//   callRoom: { fontSize: 12, color: "rgba(0,0,0,0.3)", margin: 0, fontWeight: 300 },
//   actionRow: { display: "flex", gap: 24 },
//   declineBtn: {
//     width: 72,
//     height: 72,
//     borderRadius: "50%",
//     background: "linear-gradient(135deg, #fee2e2, #ef4444)",
//     border: "none",
//     cursor: "pointer",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 4,
//     boxShadow: "0 8px 28px rgba(239,68,68,0.3)",
//     transition: "transform 0.2s ease",
//   },
//   acceptBtn: {
//     width: 72,
//     height: 72,
//     borderRadius: "50%",
//     background: "linear-gradient(135deg, #dcfce7, #22c55e)",
//     border: "none",
//     cursor: "pointer",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 4,
//     boxShadow: "0 8px 28px rgba(34,197,94,0.35)",
//     transition: "transform 0.2s ease",
//   },
//   btnSubLabel: {
//     fontSize: 9,
//     fontWeight: 600,
//     color: "rgba(255,255,255,0.85)",
//     letterSpacing: "0.1em",
//     fontFamily: "'Syne', sans-serif",
//   },
//   footer: {
//     padding: "14px 24px",
//     borderTop: "1px solid rgba(0,0,0,0.04)",
//     textAlign: "center",
//   },
//   footerText: { fontSize: 11, color: "rgba(0,0,0,0.25)", fontWeight: 300, letterSpacing: "0.02em" },
// };

// export default TrainerJoinCall;










import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { joinCall } from "@/services/liveSessionService";
import { Client } from "@stomp/stompjs";
import { Sparkles, Activity } from "lucide-react";

const wsUrl = (import.meta.env.VITE_WS_BASE_URL || "ws://localhost:9000") + "/live-chat";

const getTrainerEmail = () => {
  try {
    const lmsUser = localStorage.getItem("lms_user");
    if (lmsUser) { const parsed = JSON.parse(lmsUser); if (parsed.email) return parsed.email; }
  } catch {}
  return null;
};

/* ─── theme tokens ─── */
const T = {
  dark: {
    pageBg: "#0a0a0a", cardBg: "#111111", heroBg: "#141414",
    border: "rgba(255,255,255,0.06)", borderHero: "rgba(255,255,255,0.07)",
    text: "#ffffff", textSub: "rgba(255,255,255,0.3)", textMuted: "rgba(255,255,255,0.2)",
    pillBg: "rgba(255,255,255,0.04)", pillBorder: "rgba(255,255,255,0.07)", pillText: "rgba(255,255,255,0.25)",
    actBg: "rgba(255,255,255,0.04)", actBorder: "rgba(255,255,255,0.07)", actBar: "rgba(255,255,255,0.5)",
    actIcon: "rgba(255,255,255,0.3)", shadow: "0 4px 20px rgba(0,0,0,0.4)", gridLine: "rgba(255,255,255,0.5)",
    barBg: "rgba(255,255,255,0.05)", liveColor: "#34d399", liveText: "#34d399",
    emptyBorder: "rgba(255,255,255,0.07)", emptyBg: "rgba(255,255,255,0.02)", emptyIcon: "rgba(255,255,255,0.12)",
  },
  light: {
    pageBg: "#f1f5f9", cardBg: "#ffffff", heroBg: "#ffffff",
    border: "#e2e8f0", borderHero: "#e2e8f0",
    text: "#0f172a", textSub: "#64748b", textMuted: "#94a3b8",
    pillBg: "#f1f5f9", pillBorder: "#e2e8f0", pillText: "#94a3b8",
    actBg: "#f8fafc", actBorder: "#e2e8f0", actBar: "#94a3b8",
    actIcon: "#94a3b8", shadow: "0 1px 8px rgba(0,0,0,0.07)", gridLine: "rgba(0,0,0,0.12)",
    barBg: "#f1f5f9", liveColor: "#16a34a", liveText: "#16a34a",
    emptyBorder: "#e2e8f0", emptyBg: "#f8fafc", emptyIcon: "#cbd5e1",
  },
};

const TrainerJoinCall = () => {
  const [room, setRoom] = useState(null);
  const [connected, setConnected] = useState(false);
  const [trainerEmail, setTrainerEmail] = useState(null);
  const [isDark, setIsDark] = useState(
    () => typeof document !== "undefined" && (document.documentElement.classList.contains("dark") || document.documentElement.getAttribute("data-theme") === "dark")
  );
  const navigate = useNavigate();
  const stompClientRef = useRef(null);

  useEffect(() => {
    const obs = new MutationObserver(() => setIsDark(document.documentElement.classList.contains("dark") || document.documentElement.getAttribute("data-theme") === "dark"));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
    return () => obs.disconnect();
  }, []);

  const t = isDark ? T.dark : T.light;

  useEffect(() => {
    const email = getTrainerEmail();
    if (!email) return;
    setTrainerEmail(email);
    const client = new Client({
      brokerURL: wsUrl, reconnectDelay: 5000,
      onConnect: () => { setConnected(true); client.subscribe(`/topic/calls/${email}`, (msg) => setRoom(msg.body)); },
      onDisconnect: () => setConnected(false),
      onStompError: (frame) => console.error("STOMP error:", frame),
    });
    client.activate();
    stompClientRef.current = client;
    return () => client.deactivate();
  }, []);

  const handleJoin = async () => {
    try {
      if (!room) return alert("No incoming call");
      const res = await joinCall(room);
      const { token } = res.data;
      if (!token) return alert("Invalid token from server");
      sessionStorage.setItem("call_state", JSON.stringify({ room, token }));
      navigate("/trainer/call-room", { state: { room, token } });
    } catch (err) {
      console.error("Join failed:", err);
      alert("Failed to join call.");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        .dfade{animation:fadeUp 0.45s ease both}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.15}}
        .d1{animation:blink 1.6s ease infinite}
        .d2{animation:blink 1.6s 0.3s ease infinite}
        .d3{animation:blink 1.6s 0.6s ease infinite}
        @keyframes pulse-ring{0%{box-shadow:0 0 0 0 rgba(52,211,153,0.5)}70%{box-shadow:0 0 0 8px rgba(52,211,153,0)}100%{box-shadow:0 0 0 0 rgba(52,211,153,0)}}
        .livebadge{animation:pulse-ring 2.2s ease-out infinite}
        @keyframes liveDot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(1.5)}}
        @keyframes radarPulse{0%,100%{opacity:0.5;transform:scale(1)}50%{opacity:1;transform:scale(1.02)}}
        @keyframes callPulse{0%{box-shadow:0 0 0 0 rgba(99,102,241,0.5)}70%{box-shadow:0 0 0 18px rgba(99,102,241,0)}100%{box-shadow:0 0 0 0 rgba(99,102,241,0)}}
        @keyframes callPulse2{0%{box-shadow:0 0 0 0 rgba(99,102,241,0.3)}70%{box-shadow:0 0 0 32px rgba(99,102,241,0)}100%{box-shadow:0 0 0 0 rgba(99,102,241,0)}}
      `}</style>

      <div style={{ minHeight: "100vh", background: t.pageBg, color: t.text, fontFamily: "'Poppins',sans-serif", transition: "background 0.3s,color 0.3s" }}>
        <div style={{ position: "relative", zIndex: 1, padding: 24, maxWidth: 1300, margin: "0 auto", paddingBottom: 52 }}>

          {/* ═══ HERO ═══ */}
          <div className="dfade" style={{ borderRadius: 24, padding: "30px 36px", background: t.heroBg, border: `1px solid ${t.borderHero}`, position: "relative", overflow: "hidden", marginBottom: 20, boxShadow: t.shadow }}>
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: isDark ? 0.04 : 0.025, backgroundImage: `linear-gradient(${t.gridLine} 1px,transparent 1px),linear-gradient(90deg,${t.gridLine} 1px,transparent 1px)`, backgroundSize: "40px 40px" }} />
            <div style={{ position: "absolute", top: "-30%", left: "40%", width: 300, height: 200, background: "radial-gradient(ellipse,rgba(99,102,241,0.06),transparent 70%)", pointerEvents: "none" }} />

            <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
                  <Sparkles size={11} color={t.textSub} />
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: t.textSub, fontFamily: "'Poppins',sans-serif" }}>Trainer Console</span>
                </div>
                <h1 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 900, fontSize: "clamp(1.6rem,3vw,2.4rem)", color: t.text, margin: 0, lineHeight: 1.1, letterSpacing: "-0.02em" }}>Join Call</h1>
                <p style={{ fontSize: 12, color: t.textSub, marginTop: 7, fontWeight: 500, fontFamily: "'Poppins',sans-serif" }}>
                  {connected ? `Listening as ${trainerEmail ?? "trainer"}` : trainerEmail ? "Connecting to server…" : "Email not found in storage"}
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, background: t.actBg, border: `1px solid ${t.actBorder}`, borderRadius: 12, padding: "8px 16px", fontSize: 11, fontWeight: 600, fontFamily: "'Poppins',sans-serif" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 5, color: connected ? t.liveText : t.textMuted, fontWeight: 700 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: connected ? t.liveColor : t.textMuted, display: "inline-block", animation: connected ? "liveDot 1.2s ease-in-out infinite" : "none" }} />
                    {connected ? "Connected" : "Offline"}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, background: t.actBg, border: `1px solid ${t.actBorder}`, borderRadius: 10, padding: "8px 14px" }}>
                  <Activity size={12} color={t.actIcon} />
                  <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 14 }}>
                    <span className="d1" style={{ width: 3, height: 10, borderRadius: 2, background: t.actBar, display: "block" }} />
                    <span className="d2" style={{ width: 3, height: 14, borderRadius: 2, background: t.actBar, display: "block" }} />
                    <span className="d3" style={{ width: 3, height: 7, borderRadius: 2, background: t.actBar, display: "block" }} />
                  </div>
                </div>
                <div className="livebadge" style={{ display: "flex", alignItems: "center", gap: 7, background: isDark ? "rgba(52,211,153,0.08)" : "rgba(22,163,74,0.08)", border: isDark ? "1px solid rgba(52,211,153,0.3)" : "1px solid rgba(22,163,74,0.3)", borderRadius: 999, padding: "8px 18px", color: t.liveText, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", fontFamily: "'Poppins',sans-serif" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: t.liveColor, display: "inline-block" }} />
                  LIVE
                </div>
              </div>
            </div>
          </div>

          {/* ═══ CALL PANEL ═══ */}
          <div className="dfade" style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 20, padding: "48px 24px", boxShadow: t.shadow, display: "flex", flexDirection: "column", alignItems: "center", gap: 32 }}>

            {room ? (
              /* INCOMING CALL */
              <>
                {/* Avatar with pulse rings */}
                <div style={{ position: "relative", width: 120, height: 120, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid rgba(99,102,241,0.5)", animation: "callPulse 2s ease-out infinite" }} />
                  <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid rgba(99,102,241,0.3)", animation: "callPulse2 2s ease-out infinite 0.4s" }} />
                  <div style={{ width: 90, height: 90, borderRadius: "50%", background: "linear-gradient(135deg,#312e81,#6366f1)", padding: 3, zIndex: 2 }}>
                    <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "linear-gradient(135deg,#4338ca,#818cf8)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="40" height="40" viewBox="0 0 44 44" fill="none"><circle cx="22" cy="17" r="9" fill="rgba(255,255,255,0.9)" /><ellipse cx="22" cy="38" rx="15" ry="9" fill="rgba(255,255,255,0.9)" /></svg>
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: t.textMuted, fontFamily: "'Poppins',sans-serif", margin: "0 0 8px", animation: "liveDot 2s ease-in-out infinite" }}>INCOMING CALL</p>
                  <h2 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 32, fontWeight: 900, color: t.text, margin: "0 0 6px", letterSpacing: "-0.04em" }}>Student</h2>
                  <p style={{ fontSize: 12, color: t.textMuted, margin: 0, fontFamily: "'Poppins',sans-serif" }}>Room · {room}</p>
                </div>

                <div style={{ display: "flex", gap: 24 }}>
                  <CallActionBtn type="decline" onClick={() => setRoom(null)} />
                  <CallActionBtn type="accept" onClick={handleJoin} />
                </div>

                <p style={{ fontSize: 11, color: t.textMuted, fontFamily: "'Poppins',sans-serif", fontWeight: 500 }}>Respond within 30s · call will auto-dismiss</p>
              </>
            ) : (
              /* WAITING STATE */
              <>
                {/* Radar rings */}
                <div style={{ position: "relative" }}>
                  <div style={{ width: 120, height: 120, borderRadius: "50%", border: `1.5px solid ${isDark ? "rgba(99,102,241,0.2)" : "rgba(79,70,229,0.15)"}`, display: "flex", alignItems: "center", justifyContent: "center", animation: "radarPulse 3s ease-in-out infinite" }}>
                    <div style={{ width: 88, height: 88, borderRadius: "50%", border: `1.5px solid ${isDark ? "rgba(99,102,241,0.3)" : "rgba(79,70,229,0.25)"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ width: 60, height: 60, borderRadius: "50%", background: isDark ? "rgba(99,102,241,0.12)" : "rgba(79,70,229,0.07)", border: `1.5px solid ${isDark ? "rgba(99,102,241,0.45)" : "rgba(79,70,229,0.35)"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={isDark ? "#a5b4fc" : "#6366f1"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.1 1.18 2 2 0 012.08 0h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 16.92z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: "center" }}>
                  <h3 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 26, fontWeight: 900, color: t.text, margin: "0 0 8px", letterSpacing: "-0.03em" }}>Waiting for calls</h3>
                  <p style={{ fontSize: 12, color: t.textMuted, margin: 0, fontFamily: "'Poppins',sans-serif", fontWeight: 500 }}>
                    {connected ? `Listening as ${trainerEmail ?? "trainer"}` : trainerEmail ? "Connecting to server…" : "Email not found in storage"}
                  </p>
                </div>

                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: connected ? (isDark ? "#6366f1" : "#4f46e5") : (isDark ? "#374151" : "#d1d5db"), animation: "liveDot 1.4s ease-in-out infinite", animationDelay: `${i * 0.18}s` }} />
                  ))}
                </div>

                <p style={{ fontSize: 11, color: t.textMuted, fontFamily: "'Poppins',sans-serif", fontWeight: 500 }}>Auto-rings when student dials in</p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

function CallActionBtn({ type, onClick }) {
  const [hov, setHov] = useState(false);
  const isDecline = type === "decline";
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      width: 72, height: 72, borderRadius: "50%", border: "none", cursor: "pointer",
      background: isDecline ? (hov ? "#991b1b" : "linear-gradient(135deg,#7f1d1d,#ef4444)") : (hov ? "#14532d" : "linear-gradient(135deg,#14532d,#22c55e)"),
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4,
      boxShadow: isDecline ? "0 8px 32px rgba(239,68,68,0.4)" : "0 8px 32px rgba(34,197,94,0.45)",
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
      transform: hov ? "scale(1.06)" : "scale(1)",
    }}>
      {isDecline ? (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
      ) : (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.1 1.18 2 2 0 012.08 0h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 16.92z"/></svg>
      )}
      <span style={{ fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.7)", letterSpacing: "0.1em", fontFamily: "'Poppins',sans-serif" }}>{isDecline ? "Decline" : "Accept"}</span>
    </button>
  );
}

export default TrainerJoinCall;