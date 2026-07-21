// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { joinLiveSession } from "@/services/liveSessionService";
// import LiveRoom from "@/components/live/LiveRoom";
// import { useLiveMeeting } from "@/context/LiveMeetingContext";
// import {
//   Radio,
//   Calendar,
//   Clock,
//   CheckCircle2,
//   Users,
//   Play,
// } from "lucide-react";

// const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

// /* ════════════════════════════════════════════════════════════════
//    LiveClasses — dashboard-style page matching the reference design
//    (stat cards → Live Now hero card → Today's Schedule → Recent
//    Classes). All fetch/join/resume logic is IDENTICAL to the
//    original file — only the visual layer changed.
//    ════════════════════════════════════════════════════════════════ */

// const styles = `
//   @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

//   .lc2-root { font-family: 'Inter', sans-serif; padding: 28px; background: #f8f9fc; min-height: 100vh; box-sizing: border-box; }
//   .lc2-inner { max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; gap: 24px; }

//   .lc2-title { font-size: 26px; font-weight: 800; color: #16182b; margin: 0; }
//   .lc2-subtitle { font-size: 14px; color: #8a8fa3; margin: 4px 0 0; }

//   .lc2-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
//   .lc2-stat {
//     background: #fff; border-radius: 16px; padding: 18px;
//     box-shadow: 0 1px 3px rgba(16,24,64,0.06);
//     display: flex; flex-direction: column; gap: 10px;
//   }
//   .lc2-stat-icon {
//     width: 36px; height: 36px; border-radius: 10px;
//     display: flex; align-items: center; justify-content: center;
//   }
//   .lc2-stat-val { font-size: 22px; font-weight: 800; color: #16182b; line-height: 1; }
//   .lc2-stat-lbl { font-size: 12px; color: #8a8fa3; font-weight: 600; }
//   .lc2-stat-sub { font-size: 11px; color: #a7abbd; }

//   .lc2-section-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
//   .lc2-section-title { font-size: 16px; font-weight: 700; color: #16182b; display: flex; align-items: center; gap: 8px; }
//   .lc2-live-dot { display: inline-flex; align-items: center; gap: 5px; color: #ef4444; font-size: 11px; font-weight: 800; }
//   .lc2-blink { width: 6px; height: 6px; border-radius: 50%; background: #ef4444; animation: lc2blink 1s infinite; }
//   @keyframes lc2blink { 0%,100%{opacity:1} 50%{opacity:.25} }
//   .lc2-viewall { font-size: 13px; font-weight: 600; color: #6d5ef7; cursor: pointer; background: none; border: none; }

//   .lc2-livecard {
//     background: #fff; border-radius: 18px; padding: 16px;
//     display: flex; align-items: center; gap: 16px;
//     box-shadow: 0 1px 3px rgba(16,24,64,0.06);
//   }
//   .lc2-livecard-thumb {
//     width: 88px; height: 64px; border-radius: 14px; flex-shrink: 0;
//     background: linear-gradient(135deg,#c4b5fd,#f9a8d4,#93c5fd);
//     display: flex; align-items: center; justify-content: center;
//     color: #fff;
//   }
//   .lc2-livecard-info { flex: 1; min-width: 0; }
//   .lc2-livecard-title { font-size: 15px; font-weight: 700; color: #16182b; margin: 0 0 6px; }
//   .lc2-livecard-meta { display: flex; align-items: center; gap: 14px; font-size: 12px; color: #a7abbd; flex-wrap: wrap; }
//   .lc2-livecard-meta span { display: flex; align-items: center; gap: 4px; }
//   .lc2-jointbtn {
//     background: #6d5ef7; color: #fff; border: none; border-radius: 12px;
//     padding: 12px 22px; font-size: 13px; font-weight: 700; cursor: pointer;
//     white-space: nowrap; transition: opacity .15s, transform .15s;
//   }
//   .lc2-jointbtn:hover { opacity: .92; transform: translateY(-1px); }
//   .lc2-jointbtn:disabled { opacity: .5; cursor: not-allowed; }
//   .lc2-resumebtn {
//     background: #22c55e; color: #fff; border: none; border-radius: 12px;
//     padding: 12px 22px; font-size: 13px; font-weight: 700; cursor: pointer;
//     white-space: nowrap; transition: opacity .15s, transform .15s;
//   }
//   .lc2-resumebtn:hover { opacity: .92; transform: translateY(-1px); }

//   .lc2-schedrow {
//     background: #fff; border-radius: 16px; padding: 14px 16px;
//     display: flex; align-items: center; gap: 16px;
//     box-shadow: 0 1px 3px rgba(16,24,64,0.06);
//   }
//   .lc2-schedtime { font-size: 12px; font-weight: 700; color: #16182b; width: 68px; flex-shrink: 0; }
//   .lc2-schedicon {
//     width: 40px; height: 40px; border-radius: 12px; flex-shrink: 0;
//     background: #fef2e8; color: #f59e0b;
//     display: flex; align-items: center; justify-content: center;
//   }
//   .lc2-schedinfo { flex: 1; min-width: 0; }
//   .lc2-schedtitle { font-size: 14px; font-weight: 700; color: #16182b; margin: 0 0 3px; }
//   .lc2-schedby { font-size: 12px; color: #8a8fa3; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
//   .lc2-joinbtn-sm {
//     background: #fff; color: #6d5ef7; border: 1px solid #e3defb; border-radius: 10px;
//     padding: 8px 16px; font-size: 12px; font-weight: 700; cursor: pointer; flex-shrink: 0;
//   }

//   .lc2-empty { text-align: center; padding: 30px; color: #a7abbd; font-size: 13px; background: #fff; border-radius: 16px; }
//   .lc2-empty-icon { opacity: .35; margin-bottom: 8px; }

//   @media (max-width: 640px) {
//     .lc2-stats { grid-template-columns: repeat(2, 1fr); }
//     .lc2-livecard { flex-wrap: wrap; }
//     .lc2-jointbtn, .lc2-resumebtn { width: 100%; }
//     .lc2-schedrow { flex-wrap: wrap; }
//   }
// `;

// if (!document.getElementById("lc2-styles")) {
//   const tag = document.createElement("style");
//   tag.id = "lc2-styles";
//   tag.textContent = styles;
//   document.head.appendChild(tag);
// }

// const LiveClasses = () => {
//   const [sessions, setSessions] = useState([]);
//   const [joining, setJoining] = useState(false);
//   const [joiningId, setJoiningId] = useState(null);

//   // Meeting connection/state lives in the shared context so it survives
//   // sidebar navigation instead of being torn down when this page unmounts.
//   const { activeMeeting, minimized, setMinimized, joinMeeting } =
//     useLiveMeeting();

//   useEffect(() => {
//     const loadLive = async () => {
//       try {
//         const token = localStorage.getItem("lms_token");
//         const res = await axios.get(`${API}/live-sessions/public/upcoming`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setSessions(res.data || []);
//       } catch (err) {
//         console.error("Live fetch failed", err);
//       }
//     };
//     loadLive();
//   }, []);

//   const handleJoin = async (session) => {
//     if (!session) return;

//     // If EXTERNAL session — open meeting link directly, no LiveKit
//     // connection to manage at all.
//     if (session.meetingType === "EXTERNAL" && session.externalMeetingUrl) {
//       window.open(session.externalMeetingUrl, "_blank");
//       return;
//     }

//     try {
//       setJoining(true);
//       setJoiningId(session.id);

//       // Identity comes from the JWT server-side — no localStorage lookup needed.
//       const res = await joinLiveSession(session.id);

//       // Hands the token/room off to the context, which owns the actual
//       // LiveKit Room connection at a level above the router so it never
//       // gets disconnected by in-app navigation.
//       await joinMeeting({
//         role: "student",
//         sessionId: session.id,
//         roomName: res.data.room,
//         token: res.data.token,
//         title: session.title,
//       });
//     } catch (err) {
//       console.error("Join failed", err);
//     } finally {
//       setJoining(false);
//       setJoiningId(null);
//     }
//   };

//   // Jump back into a meeting that's already running in the floating
//   // widget — no new join, just un-minimize.
//   const handleResume = () => {
//     setMinimized(false);
//   };

//   const liveSessions = sessions.filter((s) => s.isLive || s.status === "LIVE");
//   const upcomingSessions = sessions.filter(
//     (s) => !s.isLive && s.status !== "LIVE",
//   );

//   const todayStr = new Date().toDateString();
//   const todayCount = sessions.filter((s) => {
//     if (!s.scheduledDate) return false;
//     const d = new Date(s.scheduledDate);
//     return !isNaN(d) && d.toDateString() === todayStr;
//   }).length;

  
//   if (activeMeeting?.role === "student" && !minimized) {
//     return (
//       <LiveRoom
//         sessionId={activeMeeting.sessionId}
//         onSessionEnded={() => {}}
//         onLeave={() => {}}
//       />
//     );
//   }

//   const statCards = [
//     {
//       icon: <Radio size={17} />,
//       value: liveSessions.length,
//       label: "Live Now",
//       sub: liveSessions.length ? "Join now" : "None right now",
//       bg: "#fdeaea",
//       fg: "#ef4444",
//     },
//     {
//       icon: <Calendar size={17} />,
//       value: todayCount,
//       label: "Today",
//       sub: "Scheduled",
//       bg: "#eaeeff",
//       fg: "#6d5ef7",
//     },
//     {
//       icon: <Clock size={17} />,
//       value: upcomingSessions.length,
//       label: "Upcoming",
//       sub: "This week",
//       bg: "#fef2e2",
//       fg: "#f59e0b",
//     },
//     {
//       icon: <CheckCircle2 size={17} />,
//       value: 0,
//       label: "Completed",
//       sub: "Sessions",
//       bg: "#e7f9ef",
//       fg: "#22c55e",
//     },
//   ];

//   return (
//     <div className="lc2-root">
//       <div className="lc2-inner">
//         {/* ── Header ── */}
//         <div>
//           <h1 className="lc2-title">Live Classes</h1>
//           <p className="lc2-subtitle">
//             Join live sessions, interact in real-time and learn better together.
//           </p>
//         </div>

//         {/* ── Stat cards ── */}
//         <div className="lc2-stats">
//           {statCards.map((s, i) => (
//             <div key={i} className="lc2-stat">
//               <div className="lc2-stat-icon" style={{ background: s.bg, color: s.fg }}>
//                 {s.icon}
//               </div>
//               <div className="lc2-stat-val">{s.value}</div>
//               <div className="lc2-stat-lbl">{s.label}</div>
//               <div className="lc2-stat-sub">{s.sub}</div>
//             </div>
//           ))}
//         </div>

//         {/* ── Live Now ── */}
//         <div>
//           <div className="lc2-section-head">
//             <span className="lc2-section-title">Live Now</span>
//             {liveSessions.length > 0 && (
//               <span className="lc2-live-dot">
//                 <span className="lc2-blink" /> LIVE
//               </span>
//             )}
//           </div>

//           {liveSessions.length > 0 ? (
//             <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
//               {liveSessions.map((s) => {
//                 const isThisActive =
//                   activeMeeting?.role === "student" &&
//                   activeMeeting.sessionId === s.id;
//                 const isJoiningThis = joining && joiningId === s.id;

//                 return (
//                   <div key={s.id} className="lc2-livecard">
//                     <div className="lc2-livecard-thumb">
//                       <Play size={22} fill="#fff" />
//                     </div>
//                     <div className="lc2-livecard-info">
//                       <p className="lc2-livecard-title">{s.title}</p>
//                       <div className="lc2-livecard-meta">
//                         {s.scheduledTime && (
//                           <span><Clock size={12} /> {s.scheduledTime}</span>
//                         )}
//                         {s.viewerCount != null && (
//                           <span><Users size={12} /> {s.viewerCount} watching</span>
//                         )}
//                       </div>
//                     </div>
//                     {isThisActive && minimized ? (
//                       <button className="lc2-resumebtn" onClick={handleResume}>
//                         Resume
//                       </button>
//                     ) : (
//                       <button
//                         className="lc2-jointbtn"
//                         disabled={joining}
//                         onClick={() => handleJoin(s)}
//                       >
//                         {isJoiningThis ? "Joining…" : "Join Now"}
//                       </button>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           ) : (
//             <div className="lc2-empty">
//               <div className="lc2-empty-icon"><Radio size={30} /></div>
//               No live session right now.
//             </div>
//           )}
//         </div>

//         {/* ── Today's Schedule ── */}
//         <div>
//           <div className="lc2-section-head">
//             <span className="lc2-section-title">Today's Schedule</span>
//           </div>

//           {upcomingSessions.length > 0 ? (
//             <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
//               {upcomingSessions.map((s) => (
//                 <div key={s.id} className="lc2-schedrow">
//                   <div className="lc2-schedtime">{s.scheduledTime || "—"}</div>
//                   <div className="lc2-schedicon">
//                     <Calendar size={18} />
//                   </div>
//                   <div className="lc2-schedinfo">
//                     <p className="lc2-schedtitle">{s.title}</p>
//                     <div className="lc2-schedby">
//                       {s.scheduledDate && (
//                         <span><Calendar size={11} style={{ marginRight: 3 }} />{s.scheduledDate}</span>
//                       )}
//                       {s.viewerCount != null && (
//                         <span><Users size={11} style={{ marginRight: 3 }} />{s.viewerCount} watching</span>
//                       )}
//                     </div>
//                   </div>
//                   <button className="lc2-joinbtn-sm" onClick={() => handleJoin(s)}>
//                     Join
//                   </button>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="lc2-empty">No sessions scheduled.</div>
//           )}
//         </div>

//         {/* ── Recent Classes ── */}
//         <div>
//           <div className="lc2-section-head">
//             <span className="lc2-section-title">Your Recent Classes</span>
//           </div>
//           <div className="lc2-empty">
//             Your recent class progress will show up here once available.
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LiveClasses;


















































// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { joinLiveSession } from "@/services/liveSessionService";
// import LiveRoom from "@/components/live/LiveRoom";
// import { useLiveMeeting } from "@/context/LiveMeetingContext";
// import {
//   Radio,
//   Calendar,
//   Clock,
//   CheckCircle2,
//   Users,
//   Play,
// } from "lucide-react";

// const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

// /* ════════════════════════════════════════════════════════════════
//    LiveClasses — dashboard-style page matching the reference design.
//    Fully responsive (mobile → 4K), light/dark theme aware, and fills
//    the available width instead of sitting in a fixed, centered
//    column. All fetch/join/resume logic is IDENTICAL to the original
//    file — only the visual layer changed.
//    ════════════════════════════════════════════════════════════════ */

// const styles = `
//   @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

//   .lc2-root {
//     font-family: 'Inter', sans-serif;
//     width: 100%;
//     min-height: 100%;
//     box-sizing: border-box;
//     background: #f8f9fc;
//     padding: 28px clamp(16px, 3vw, 40px);
//     transition: background .2s ease;
//   }
//   .dark .lc2-root { background: #0d0e18; }

//   .lc2-inner {
//     width: 100%;
//     max-width: 1600px;
//     margin: 0 auto;
//     display: flex;
//     flex-direction: column;
//     gap: 24px;
//   }

//   .lc2-title { font-size: clamp(20px, 2.2vw, 26px); font-weight: 800; color: #16182b; margin: 0; }
//   .dark .lc2-title { color: #f3f4fb; }
//   .lc2-subtitle { font-size: 14px; color: #8a8fa3; margin: 4px 0 0; }
//   .dark .lc2-subtitle { color: #8489a3; }

//   /* ── Stat cards: gradient style ── */
//   .lc2-stats {
//     display: grid;
//     grid-template-columns: repeat(4, 1fr);
//     gap: 14px;
//   }
//   .lc2-stat {
//     position: relative;
//     overflow: hidden;
//     border-radius: 16px;
//     padding: 18px;
//     display: flex;
//     flex-direction: column;
//     gap: 10px;
//     color: #fff;
//     box-shadow: 0 6px 16px -6px rgba(16,24,64,0.25);
//   }
//   .lc2-stat::after {
//     content: "";
//     position: absolute;
//     top: -30%;
//     right: -20%;
//     width: 90px;
//     height: 90px;
//     border-radius: 50%;
//     background: rgba(255,255,255,0.12);
//   }
//   .lc2-stat-icon {
//     width: 34px; height: 34px; border-radius: 10px;
//     display: flex; align-items: center; justify-content: center;
//     background: rgba(255,255,255,0.22);
//     position: relative; z-index: 1;
//   }
//   .lc2-stat-val { font-size: clamp(20px, 2vw, 24px); font-weight: 800; line-height: 1; position: relative; z-index: 1; }
//   .lc2-stat-lbl { font-size: 12px; font-weight: 700; opacity: 0.95; position: relative; z-index: 1; }
//   .lc2-stat-sub { font-size: 11px; opacity: 0.8; position: relative; z-index: 1; }

//   .lc2-stat-blue   { background: linear-gradient(135deg, #3b82f6, #2563eb); }
//   .lc2-stat-green  { background: linear-gradient(135deg, #22c55e, #16a34a); }
//   .lc2-stat-orange { background: linear-gradient(135deg, #f59e0b, #ea7c0e); }
//   .lc2-stat-purple { background: linear-gradient(135deg, #a855f7, #8b5cf6); }

//   .lc2-section-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
//   .lc2-section-title { font-size: 16px; font-weight: 700; color: #16182b; display: flex; align-items: center; gap: 8px; }
//   .dark .lc2-section-title { color: #f3f4fb; }
//   .lc2-live-dot { display: inline-flex; align-items: center; gap: 5px; color: #ef4444; font-size: 11px; font-weight: 800; }
//   .lc2-blink { width: 6px; height: 6px; border-radius: 50%; background: #ef4444; animation: lc2blink 1s infinite; }
//   @keyframes lc2blink { 0%,100%{opacity:1} 50%{opacity:.25} }
//   .lc2-viewall { font-size: 13px; font-weight: 600; color: #6d5ef7; cursor: pointer; background: none; border: none; }
//   .dark .lc2-viewall { color: #a08bff; }

//   .lc2-livecard {
//     background: #fff; border-radius: 18px; padding: 16px;
//     display: flex; align-items: center; gap: 16px;
//     box-shadow: 0 1px 3px rgba(16,24,64,0.06);
//   }
//   .dark .lc2-livecard { background: #171928; box-shadow: 0 1px 3px rgba(0,0,0,0.4); }
//   .lc2-livecard-thumb {
//     width: 88px; height: 64px; border-radius: 14px; flex-shrink: 0;
//     background: linear-gradient(135deg,#c4b5fd,#f9a8d4,#93c5fd);
//     display: flex; align-items: center; justify-content: center;
//     color: #fff;
//   }
//   .lc2-livecard-info { flex: 1; min-width: 0; }
//   .lc2-livecard-title { font-size: 15px; font-weight: 700; color: #16182b; margin: 0 0 6px; }
//   .dark .lc2-livecard-title { color: #f3f4fb; }
//   .lc2-livecard-meta { display: flex; align-items: center; gap: 14px; font-size: 12px; color: #a7abbd; flex-wrap: wrap; }
//   .lc2-livecard-meta span { display: flex; align-items: center; gap: 4px; }
//   .lc2-jointbtn {
//     background: #6d5ef7; color: #fff; border: none; border-radius: 12px;
//     padding: 12px 22px; font-size: 13px; font-weight: 700; cursor: pointer;
//     white-space: nowrap; transition: opacity .15s, transform .15s;
//   }
//   .lc2-jointbtn:hover { opacity: .92; transform: translateY(-1px); }
//   .lc2-jointbtn:disabled { opacity: .5; cursor: not-allowed; }
//   .lc2-resumebtn {
//     background: #22c55e; color: #fff; border: none; border-radius: 12px;
//     padding: 12px 22px; font-size: 13px; font-weight: 700; cursor: pointer;
//     white-space: nowrap; transition: opacity .15s, transform .15s;
//   }
//   .lc2-resumebtn:hover { opacity: .92; transform: translateY(-1px); }

//   /* ── Bottom section: side-by-side on wide screens ── */
//   .lc2-bottom-grid {
//     display: grid;
//     grid-template-columns: 1fr;
//     gap: 24px;
//   }

//   .lc2-schedrow {
//     background: #fff; border-radius: 16px; padding: 14px 16px;
//     display: flex; align-items: center; gap: 16px;
//     box-shadow: 0 1px 3px rgba(16,24,64,0.06);
//   }
//   .dark .lc2-schedrow { background: #171928; box-shadow: 0 1px 3px rgba(0,0,0,0.4); }
//   .lc2-schedtime { font-size: 12px; font-weight: 700; color: #16182b; width: 56px; flex-shrink: 0; }
//   .dark .lc2-schedtime { color: #f3f4fb; }
//   .lc2-schedicon {
//     width: 40px; height: 40px; border-radius: 12px; flex-shrink: 0;
//     background: #fef2e8; color: #f59e0b;
//     display: flex; align-items: center; justify-content: center;
//   }
//   .dark .lc2-schedicon { background: rgba(245,158,11,0.15); }
//   .lc2-schedinfo { flex: 1; min-width: 0; }
//   .lc2-schedtitle { font-size: 14px; font-weight: 700; color: #16182b; margin: 0 0 3px; }
//   .dark .lc2-schedtitle { color: #f3f4fb; }
//   .lc2-schedby { font-size: 12px; color: #8a8fa3; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
//   .lc2-joinbtn-sm {
//     background: #fff; color: #6d5ef7; border: 1px solid #e3defb; border-radius: 10px;
//     padding: 8px 16px; font-size: 12px; font-weight: 700; cursor: pointer; flex-shrink: 0;
//   }
//   .dark .lc2-joinbtn-sm { background: #1f2133; border-color: #322f57; color: #a08bff; }

//   .lc2-recentcard {
//     background: #fff; border-radius: 16px; padding: 14px 16px;
//     display: flex; align-items: center; gap: 14px;
//     box-shadow: 0 1px 3px rgba(16,24,64,0.06);
//   }
//   .dark .lc2-recentcard { background: #171928; box-shadow: 0 1px 3px rgba(0,0,0,0.4); }
//   .lc2-recenticon {
//     width: 40px; height: 40px; border-radius: 12px; flex-shrink: 0;
//     display: flex; align-items: center; justify-content: center;
//   }
//   .lc2-recentinfo { flex: 1; min-width: 0; }
//   .lc2-recenttitle { font-size: 14px; font-weight: 700; color: #16182b; margin: 0 0 6px; }
//   .dark .lc2-recenttitle { color: #f3f4fb; }
//   .lc2-recentby { font-size: 12px; color: #8a8fa3; margin: 0 0 8px; }
//   .lc2-progresstrack { height: 5px; border-radius: 4px; background: #f1f1f6; overflow: hidden; }
//   .dark .lc2-progresstrack { background: #262943; }
//   .lc2-progressfill { height: 100%; border-radius: 4px; background: #6d5ef7; }
//   .lc2-continuebtn {
//     background: #fff; color: #6d5ef7; border: 1px solid #e3defb; border-radius: 10px;
//     padding: 8px 16px; font-size: 12px; font-weight: 700; cursor: pointer; flex-shrink: 0;
//   }
//   .dark .lc2-continuebtn { background: #1f2133; border-color: #322f57; color: #a08bff; }

//   .lc2-empty {
//     text-align: center; padding: 30px; color: #a7abbd; font-size: 13px;
//     background: #fff; border-radius: 16px;
//   }
//   .dark .lc2-empty { background: #171928; color: #6b7094; }
//   .lc2-empty-icon { opacity: .35; margin-bottom: 8px; }

//   /* ══ Breakpoints ══ */

//   /* Wide desktop / laptop: schedule + recent side-by-side */
//   @media (min-width: 1200px) {
//     .lc2-bottom-grid { grid-template-columns: 1.3fr 1fr; align-items: start; }
//   }

//   /* Tablets (iPad / iPad mini / generic tablet) */
//   @media (max-width: 1023px) {
//     .lc2-stats { grid-template-columns: repeat(4, 1fr); gap: 10px; }
//     .lc2-stat { padding: 14px; }
//   }

//   /* Small tablets / large phones: 2x2 stat grid */
//   @media (max-width: 700px) {
//     .lc2-root { padding: 20px 16px; }
//     .lc2-stats { grid-template-columns: repeat(2, 1fr); gap: 10px; }
//     .lc2-livecard { flex-wrap: wrap; }
//     .lc2-jointbtn, .lc2-resumebtn { width: 100%; }
//     .lc2-schedrow, .lc2-recentcard { flex-wrap: wrap; }
//     .lc2-joinbtn-sm, .lc2-continuebtn { width: 100%; }
//   }

//   /* Phones (iPhone SE / Pixel / iPhone Pro Max) */
//   @media (max-width: 430px) {
//     .lc2-root { padding: 16px 12px; }
//     .lc2-stat { padding: 12px; gap: 8px; }
//     .lc2-stat-icon { width: 30px; height: 30px; }
//     .lc2-livecard-thumb { width: 72px; height: 56px; }
//   }
// `;

// if (!document.getElementById("lc2-styles")) {
//   const tag = document.createElement("style");
//   tag.id = "lc2-styles";
//   tag.textContent = styles;
//   document.head.appendChild(tag);
// }

// const RECENT_ICON_STYLES = [
//   { bg: "#eaeeff", fg: "#6d5ef7" },
//   { bg: "#fdeaf3", fg: "#ec4899" },
//   { bg: "#e7f9ef", fg: "#22c55e" },
// ];

// const LiveClasses = () => {
//   const [sessions, setSessions] = useState([]);
//   const [joining, setJoining] = useState(false);
//   const [joiningId, setJoiningId] = useState(null);

//   // Meeting connection/state lives in the shared context so it survives
//   // sidebar navigation instead of being torn down when this page unmounts.
//   const { activeMeeting, minimized, setMinimized, joinMeeting } =
//     useLiveMeeting();

//   useEffect(() => {
//     const loadLive = async () => {
//       try {
//         const token = localStorage.getItem("lms_token");
//         const res = await axios.get(`${API}/live-sessions/public/upcoming`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setSessions(res.data || []);
//       } catch (err) {
//         console.error("Live fetch failed", err);
//       }
//     };
//     loadLive();
//   }, []);

//   const handleJoin = async (session) => {
//     if (!session) return;

//     // If EXTERNAL session — open meeting link directly, no LiveKit
//     // connection to manage at all.
//     if (session.meetingType === "EXTERNAL" && session.externalMeetingUrl) {
//       window.open(session.externalMeetingUrl, "_blank");
//       return;
//     }

//     try {
//       setJoining(true);
//       setJoiningId(session.id);

//       // Identity comes from the JWT server-side — no localStorage lookup needed.
//       const res = await joinLiveSession(session.id);

//       // Hands the token/room off to the context, which owns the actual
//       // LiveKit Room connection at a level above the router so it never
//       // gets disconnected by in-app navigation.
//       await joinMeeting({
//         role: "student",
//         sessionId: session.id,
//         roomName: res.data.room,
//         token: res.data.token,
//         title: session.title,
//       });
//     } catch (err) {
//       console.error("Join failed", err);
//     } finally {
//       setJoining(false);
//       setJoiningId(null);
//     }
//   };

//   // Jump back into a meeting that's already running in the floating
//   // widget — no new join, just un-minimize.
//   const handleResume = () => {
//     setMinimized(false);
//   };

//   const liveSessions = sessions.filter((s) => s.isLive || s.status === "LIVE");
//   const upcomingSessions = sessions.filter(
//     (s) => !s.isLive && s.status !== "LIVE",
//   );

//   const todayStr = new Date().toDateString();
//   const todayCount = sessions.filter((s) => {
//     if (!s.scheduledDate) return false;
//     const d = new Date(s.scheduledDate);
//     return !isNaN(d) && d.toDateString() === todayStr;
//   }).length;

//   if (activeMeeting?.role === "student" && !minimized) {
//     return (
//       <LiveRoom
//         sessionId={activeMeeting.sessionId}
//         onSessionEnded={() => {}}
//         onLeave={() => {}}
//       />
//     );
//   }

//   const statCards = [
//     {
//       icon: <Radio size={17} />,
//       value: liveSessions.length,
//       label: "Live Now",
//       sub: liveSessions.length ? "Join now" : "None right now",
//       colorClass: "lc2-stat-blue",
//     },
//     {
//       icon: <Calendar size={17} />,
//       value: todayCount,
//       label: "Today",
//       sub: "Scheduled",
//       colorClass: "lc2-stat-green",
//     },
//     {
//       icon: <Clock size={17} />,
//       value: upcomingSessions.length,
//       label: "Upcoming",
//       sub: "This week",
//       colorClass: "lc2-stat-orange",
//     },
//     {
//       icon: <CheckCircle2 size={17} />,
//       value: 0,
//       label: "Completed",
//       sub: "Sessions",
//       colorClass: "lc2-stat-purple",
//     },
//   ];

//   return (
//     <div className="lc2-root">
//       <div className="lc2-inner">
//         {/* ── Header ── */}
//         <div>
//           <h1 className="lc2-title">Live Classes</h1>
//           <p className="lc2-subtitle">
//             Join live sessions, interact in real-time and learn better together.
//           </p>
//         </div>

//         {/* ── Stat cards ── */}
//         <div className="lc2-stats">
//           {statCards.map((s, i) => (
//             <div key={i} className={`lc2-stat ${s.colorClass}`}>
//               <div className="lc2-stat-icon">{s.icon}</div>
//               <div className="lc2-stat-val">{s.value}</div>
//               <div className="lc2-stat-lbl">{s.label}</div>
//               <div className="lc2-stat-sub">{s.sub}</div>
//             </div>
//           ))}
//         </div>

//         {/* ── Live Now ── */}
//         <div>
//           <div className="lc2-section-head">
//             <span className="lc2-section-title">Live Now</span>
//             {liveSessions.length > 0 && (
//               <span className="lc2-live-dot">
//                 <span className="lc2-blink" /> LIVE
//               </span>
//             )}
//           </div>

//           {liveSessions.length > 0 ? (
//             <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
//               {liveSessions.map((s) => {
//                 const isThisActive =
//                   activeMeeting?.role === "student" &&
//                   activeMeeting.sessionId === s.id;
//                 const isJoiningThis = joining && joiningId === s.id;

//                 return (
//                   <div key={s.id} className="lc2-livecard">
//                     <div className="lc2-livecard-thumb">
//                       <Play size={22} fill="#fff" />
//                     </div>
//                     <div className="lc2-livecard-info">
//                       <p className="lc2-livecard-title">{s.title}</p>
//                       <div className="lc2-livecard-meta">
//                         {s.scheduledTime && (
//                           <span><Clock size={12} /> {s.scheduledTime}</span>
//                         )}
//                         {s.viewerCount != null && (
//                           <span><Users size={12} /> {s.viewerCount} watching</span>
//                         )}
//                       </div>
//                     </div>
//                     {isThisActive && minimized ? (
//                       <button className="lc2-resumebtn" onClick={handleResume}>
//                         Resume
//                       </button>
//                     ) : (
//                       <button
//                         className="lc2-jointbtn"
//                         disabled={joining}
//                         onClick={() => handleJoin(s)}
//                       >
//                         {isJoiningThis ? "Joining…" : "Join Now"}
//                       </button>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           ) : (
//             <div className="lc2-empty">
//               <div className="lc2-empty-icon"><Radio size={30} /></div>
//               No live session right now.
//             </div>
//           )}
//         </div>

//         {/* ── Today's Schedule + Recent Classes (side-by-side on wide screens) ── */}
//         <div className="lc2-bottom-grid">
//           <div>
//             <div className="lc2-section-head">
//               <span className="lc2-section-title">Today's Schedule</span>
//               {upcomingSessions.length > 0 && (
//                 <button className="lc2-viewall">View all</button>
//               )}
//             </div>

//             {upcomingSessions.length > 0 ? (
//               <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
//                 {upcomingSessions.map((s) => (
//                   <div key={s.id} className="lc2-schedrow">
//                     <div className="lc2-schedtime">{s.scheduledTime || "—"}</div>
//                     <div className="lc2-schedicon">
//                       <Calendar size={18} />
//                     </div>
//                     <div className="lc2-schedinfo">
//                       <p className="lc2-schedtitle">{s.title}</p>
//                       <div className="lc2-schedby">
//                         {s.scheduledDate && (
//                           <span><Calendar size={11} style={{ marginRight: 3 }} />{s.scheduledDate}</span>
//                         )}
//                         {s.viewerCount != null && (
//                           <span><Users size={11} style={{ marginRight: 3 }} />{s.viewerCount} watching</span>
//                         )}
//                       </div>
//                     </div>
//                     <button className="lc2-joinbtn-sm" onClick={() => handleJoin(s)}>
//                       Join
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="lc2-empty">No sessions scheduled.</div>
//             )}
//           </div>

//           {/* ── Recent Classes ── */}
//           <div>
//             <div className="lc2-section-head">
//               <span className="lc2-section-title">Your Recent Classes</span>
//             </div>
//             <div className="lc2-empty">
//               Your recent class progress will show up here once available.
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LiveClasses;




















































import React, { useState, useEffect } from "react";
import axios from "axios";
import { joinLiveSession } from "@/services/liveSessionService";
import LiveRoom from "@/components/live/LiveRoom";
import { useLiveMeeting } from "@/context/LiveMeetingContext";
import {
  Radio,
  Calendar,
  Clock,
  CheckCircle2,
  Users,
  Play,
} from "lucide-react";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

/* ════════════════════════════════════════════════════════════════
   LiveClasses — dashboard-style page matching the reference design.
   Fully responsive (mobile → 4K), light/dark theme aware, and fills
   the available width instead of sitting in a fixed, centered
   column. All fetch/join/resume logic is IDENTICAL to the original
   file — only the visual layer changed.
   ════════════════════════════════════════════════════════════════ */

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  .lc2-root {
    font-family: 'Inter', sans-serif;
    width: 100%;
    min-height: 100%;
    box-sizing: border-box;
    background: #f8f9fc;
    padding: 28px clamp(16px, 3vw, 40px);
    transition: background .2s ease;
  }
  .dark .lc2-root { background: #0d0e18; }

  .lc2-inner {
    width: 100%;
    max-width: 1600px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .lc2-title { font-size: clamp(20px, 2.2vw, 26px); font-weight: 800; color: #16182b; margin: 0; }
  .dark .lc2-title { color: #f3f4fb; }
  .lc2-subtitle { font-size: 14px; color: #8a8fa3; margin: 4px 0 0; }
  .dark .lc2-subtitle { color: #8489a3; }

  /* ── Stat cards: gradient style ── */
  .lc2-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
  }
  .lc2-stat {
    position: relative;
    overflow: hidden;
    border-radius: 16px;
    padding: 18px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    color: #fff;
    box-shadow: 0 6px 16px -6px rgba(16,24,64,0.25);
  }
  .lc2-stat::after {
    content: "";
    position: absolute;
    top: -30%;
    right: -20%;
    width: 90px;
    height: 90px;
    border-radius: 50%;
    background: rgba(255,255,255,0.12);
  }
  .lc2-stat-icon {
    width: 34px; height: 34px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    background: rgba(255,255,255,0.22);
    position: relative; z-index: 1;
  }
  .lc2-stat-val { font-size: clamp(20px, 2vw, 24px); font-weight: 800; line-height: 1; position: relative; z-index: 1; }
  .lc2-stat-lbl { font-size: 12px; font-weight: 700; opacity: 0.95; position: relative; z-index: 1; }
  .lc2-stat-sub { font-size: 11px; opacity: 0.8; position: relative; z-index: 1; }

  .lc2-stat-blue   { background: linear-gradient(135deg, #3b82f6, #2563eb); }
  .lc2-stat-green  { background: linear-gradient(135deg, #22c55e, #16a34a); }
  .lc2-stat-orange { background: linear-gradient(135deg, #f59e0b, #ea7c0e); }
  .lc2-stat-purple { background: linear-gradient(135deg, #a855f7, #8b5cf6); }

  /* Dark theme: match the dashboard's dark-card stat style
     (dark surface + tinted icon badge) instead of the bright
     gradient fill used in light mode. */
  .dark .lc2-stat {
    background: #171928;
    color: inherit;
    box-shadow: 0 1px 3px rgba(0,0,0,0.4);
  }
  .dark .lc2-stat::after { display: none; }
  .dark .lc2-stat-val { color: #f3f4fb; }
  .dark .lc2-stat-lbl { color: #9295ab; text-transform: uppercase; letter-spacing: 0.4px; opacity: 1; }
  .dark .lc2-stat-sub {
    color: #6b7094;
    opacity: 1;
    padding-top: 8px;
    margin-top: 2px;
    border-top: 2px solid var(--lc2-accent, #3b82f6);
  }

  .dark .lc2-stat-blue   { --lc2-accent: #3b82f6; }
  .dark .lc2-stat-green  { --lc2-accent: #22c55e; }
  .dark .lc2-stat-orange { --lc2-accent: #f59e0b; }
  .dark .lc2-stat-purple { --lc2-accent: #a855f7; }

  .dark .lc2-stat-blue .lc2-stat-icon   { background: rgba(59,130,246,0.15); color: #3b82f6; }
  .dark .lc2-stat-green .lc2-stat-icon  { background: rgba(34,197,94,0.15); color: #22c55e; }
  .dark .lc2-stat-orange .lc2-stat-icon { background: rgba(245,158,11,0.15); color: #f59e0b; }
  .dark .lc2-stat-purple .lc2-stat-icon { background: rgba(168,85,247,0.15); color: #a855f7; }

  .lc2-section-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
  .lc2-section-title { font-size: 16px; font-weight: 700; color: #16182b; display: flex; align-items: center; gap: 8px; }
  .dark .lc2-section-title { color: #f3f4fb; }
  .lc2-live-dot { display: inline-flex; align-items: center; gap: 5px; color: #ef4444; font-size: 11px; font-weight: 800; }
  .lc2-blink { width: 6px; height: 6px; border-radius: 50%; background: #ef4444; animation: lc2blink 1s infinite; }
  @keyframes lc2blink { 0%,100%{opacity:1} 50%{opacity:.25} }
  .lc2-viewall { font-size: 13px; font-weight: 600; color: #6d5ef7; cursor: pointer; background: none; border: none; }
  .dark .lc2-viewall { color: #a08bff; }

  .lc2-livecard {
    background: #fff; border-radius: 18px; padding: 16px;
    display: flex; align-items: center; gap: 16px;
    box-shadow: 0 1px 3px rgba(16,24,64,0.06);
  }
  .dark .lc2-livecard { background: #171928; box-shadow: 0 1px 3px rgba(0,0,0,0.4); }
  .lc2-livecard-thumb {
    width: 88px; height: 64px; border-radius: 14px; flex-shrink: 0;
    background: linear-gradient(135deg,#c4b5fd,#f9a8d4,#93c5fd);
    display: flex; align-items: center; justify-content: center;
    color: #fff;
  }
  .lc2-livecard-info { flex: 1; min-width: 0; }
  .lc2-livecard-title { font-size: 15px; font-weight: 700; color: #16182b; margin: 0 0 6px; }
  .dark .lc2-livecard-title { color: #f3f4fb; }
  .lc2-livecard-meta { display: flex; align-items: center; gap: 14px; font-size: 12px; color: #a7abbd; flex-wrap: wrap; }
  .lc2-livecard-meta span { display: flex; align-items: center; gap: 4px; }
  .lc2-jointbtn {
    background: #6d5ef7; color: #fff; border: none; border-radius: 12px;
    padding: 12px 22px; font-size: 13px; font-weight: 700; cursor: pointer;
    white-space: nowrap; transition: opacity .15s, transform .15s;
  }
  .lc2-jointbtn:hover { opacity: .92; transform: translateY(-1px); }
  .lc2-jointbtn:disabled { opacity: .5; cursor: not-allowed; }
  .lc2-resumebtn {
    background: #22c55e; color: #fff; border: none; border-radius: 12px;
    padding: 12px 22px; font-size: 13px; font-weight: 700; cursor: pointer;
    white-space: nowrap; transition: opacity .15s, transform .15s;
  }
  .lc2-resumebtn:hover { opacity: .92; transform: translateY(-1px); }

  /* ── Bottom section: side-by-side on wide screens ── */
  .lc2-bottom-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .lc2-schedrow {
    background: #fff; border-radius: 16px; padding: 14px 16px;
    display: flex; align-items: center; gap: 16px;
    box-shadow: 0 1px 3px rgba(16,24,64,0.06);
  }
  .dark .lc2-schedrow { background: #171928; box-shadow: 0 1px 3px rgba(0,0,0,0.4); }
  .lc2-schedtime { font-size: 12px; font-weight: 700; color: #16182b; width: 56px; flex-shrink: 0; }
  .dark .lc2-schedtime { color: #f3f4fb; }
  .lc2-schedicon {
    width: 40px; height: 40px; border-radius: 12px; flex-shrink: 0;
    background: #fef2e8; color: #f59e0b;
    display: flex; align-items: center; justify-content: center;
  }
  .dark .lc2-schedicon { background: rgba(245,158,11,0.15); }
  .lc2-schedinfo { flex: 1; min-width: 0; }
  .lc2-schedtitle { font-size: 14px; font-weight: 700; color: #16182b; margin: 0 0 3px; }
  .dark .lc2-schedtitle { color: #f3f4fb; }
  .lc2-schedby { font-size: 12px; color: #8a8fa3; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .lc2-joinbtn-sm {
    background: #fff; color: #6d5ef7; border: 1px solid #e3defb; border-radius: 10px;
    padding: 8px 16px; font-size: 12px; font-weight: 700; cursor: pointer; flex-shrink: 0;
  }
  .dark .lc2-joinbtn-sm { background: #1f2133; border-color: #322f57; color: #a08bff; }

  .lc2-recentcard {
    background: #fff; border-radius: 16px; padding: 14px 16px;
    display: flex; align-items: center; gap: 14px;
    box-shadow: 0 1px 3px rgba(16,24,64,0.06);
  }
  .dark .lc2-recentcard { background: #171928; box-shadow: 0 1px 3px rgba(0,0,0,0.4); }
  .lc2-recenticon {
    width: 40px; height: 40px; border-radius: 12px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
  }
  .lc2-recentinfo { flex: 1; min-width: 0; }
  .lc2-recenttitle { font-size: 14px; font-weight: 700; color: #16182b; margin: 0 0 6px; }
  .dark .lc2-recenttitle { color: #f3f4fb; }
  .lc2-recentby { font-size: 12px; color: #8a8fa3; margin: 0 0 8px; }
  .lc2-progresstrack { height: 5px; border-radius: 4px; background: #f1f1f6; overflow: hidden; }
  .dark .lc2-progresstrack { background: #262943; }
  .lc2-progressfill { height: 100%; border-radius: 4px; background: #6d5ef7; }
  .lc2-continuebtn {
    background: #fff; color: #6d5ef7; border: 1px solid #e3defb; border-radius: 10px;
    padding: 8px 16px; font-size: 12px; font-weight: 700; cursor: pointer; flex-shrink: 0;
  }
  .dark .lc2-continuebtn { background: #1f2133; border-color: #322f57; color: #a08bff; }

  .lc2-empty {
    text-align: center; padding: 30px; color: #a7abbd; font-size: 13px;
    background: #fff; border-radius: 16px;
  }
  .dark .lc2-empty { background: #171928; color: #6b7094; }
  .lc2-empty-icon { opacity: .35; margin-bottom: 8px; }

  /* ══ Breakpoints ══ */

  /* Wide desktop / laptop: schedule + recent side-by-side */
  @media (min-width: 1200px) {
    .lc2-bottom-grid { grid-template-columns: 1.3fr 1fr; align-items: start; }
  }

  /* Tablets (iPad / iPad mini / generic tablet) */
  @media (max-width: 1023px) {
    .lc2-stats { grid-template-columns: repeat(4, 1fr); gap: 10px; }
    .lc2-stat { padding: 14px; }
  }

  /* Small tablets / large phones: 2x2 stat grid */
  @media (max-width: 700px) {
    .lc2-root { padding: 20px 16px; }
    .lc2-stats { grid-template-columns: repeat(2, 1fr); gap: 10px; }
    .lc2-livecard { flex-wrap: wrap; }
    .lc2-jointbtn, .lc2-resumebtn { width: 100%; }
    .lc2-schedrow, .lc2-recentcard { flex-wrap: wrap; }
    .lc2-joinbtn-sm, .lc2-continuebtn { width: 100%; }
  }

  /* Phones (iPhone SE / Pixel / iPhone Pro Max) */
  @media (max-width: 430px) {
    .lc2-root { padding: 16px 12px; }
    .lc2-stat { padding: 12px; gap: 8px; }
    .lc2-stat-icon { width: 30px; height: 30px; }
    .lc2-livecard-thumb { width: 72px; height: 56px; }
  }
`;

if (!document.getElementById("lc2-styles")) {
  const tag = document.createElement("style");
  tag.id = "lc2-styles";
  tag.textContent = styles;
  document.head.appendChild(tag);
}

const RECENT_ICON_STYLES = [
  { bg: "#eaeeff", fg: "#6d5ef7" },
  { bg: "#fdeaf3", fg: "#ec4899" },
  { bg: "#e7f9ef", fg: "#22c55e" },
];

const LiveClasses = () => {
  const [sessions, setSessions] = useState([]);
  const [joining, setJoining] = useState(false);
  const [joiningId, setJoiningId] = useState(null);

  // Meeting connection/state lives in the shared context so it survives
  // sidebar navigation instead of being torn down when this page unmounts.
  const { activeMeeting, minimized, setMinimized, joinMeeting } =
    useLiveMeeting();

  useEffect(() => {
    const loadLive = async () => {
      try {
        const token = localStorage.getItem("lms_token");
        const res = await axios.get(`${API}/live-sessions/public/upcoming`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSessions(res.data || []);
      } catch (err) {
        console.error("Live fetch failed", err);
      }
    };
    loadLive();
  }, []);

  const handleJoin = async (session) => {
    if (!session) return;

    // If EXTERNAL session — open meeting link directly, no LiveKit
    // connection to manage at all.
    if (session.meetingType === "EXTERNAL" && session.externalMeetingUrl) {
      window.open(session.externalMeetingUrl, "_blank");
      return;
    }

    try {
      setJoining(true);
      setJoiningId(session.id);

      // Identity comes from the JWT server-side — no localStorage lookup needed.
      const res = await joinLiveSession(session.id);

      // Hands the token/room off to the context, which owns the actual
      // LiveKit Room connection at a level above the router so it never
      // gets disconnected by in-app navigation.
      await joinMeeting({
        role: "student",
        sessionId: session.id,
        roomName: res.data.room,
        token: res.data.token,
        title: session.title,
      });
    } catch (err) {
      console.error("Join failed", err);
    } finally {
      setJoining(false);
      setJoiningId(null);
    }
  };

  // Jump back into a meeting that's already running in the floating
  // widget — no new join, just un-minimize.
  const handleResume = () => {
    setMinimized(false);
  };

  const liveSessions = sessions.filter((s) => s.isLive || s.status === "LIVE");
  const upcomingSessions = sessions.filter(
    (s) => !s.isLive && s.status !== "LIVE",
  );

  const todayStr = new Date().toDateString();
  const todayCount = sessions.filter((s) => {
    if (!s.scheduledDate) return false;
    const d = new Date(s.scheduledDate);
    return !isNaN(d) && d.toDateString() === todayStr;
  }).length;

  if (activeMeeting?.role === "student" && !minimized) {
    return (
      <LiveRoom
        sessionId={activeMeeting.sessionId}
        onSessionEnded={() => {}}
        onLeave={() => {}}
      />
    );
  }

  const statCards = [
    {
      icon: <Radio size={17} />,
      value: liveSessions.length,
      label: "Live Now",
      sub: liveSessions.length ? "Join now" : "None right now",
      colorClass: "lc2-stat-blue",
    },
    {
      icon: <Calendar size={17} />,
      value: todayCount,
      label: "Today",
      sub: "Scheduled",
      colorClass: "lc2-stat-green",
    },
    {
      icon: <Clock size={17} />,
      value: upcomingSessions.length,
      label: "Upcoming",
      sub: "This week",
      colorClass: "lc2-stat-orange",
    },
    {
      icon: <CheckCircle2 size={17} />,
      value: 0,
      label: "Completed",
      sub: "Sessions",
      colorClass: "lc2-stat-purple",
    },
  ];

  return (
    <div className="lc2-root">
      <div className="lc2-inner">
        {/* ── Header ── */}
        <div>
          <h1 className="lc2-title">Live Classes</h1>
          <p className="lc2-subtitle">
            Join live sessions, interact in real-time and learn better together.
          </p>
        </div>

        {/* ── Stat cards ── */}
        <div className="lc2-stats">
          {statCards.map((s, i) => (
            <div key={i} className={`lc2-stat ${s.colorClass}`}>
              <div className="lc2-stat-icon">{s.icon}</div>
              <div className="lc2-stat-val">{s.value}</div>
              <div className="lc2-stat-lbl">{s.label}</div>
              <div className="lc2-stat-sub">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* ── Live Now ── */}
        <div>
          <div className="lc2-section-head">
            <span className="lc2-section-title">Live Now</span>
            {liveSessions.length > 0 && (
              <span className="lc2-live-dot">
                <span className="lc2-blink" /> LIVE
              </span>
            )}
          </div>

          {liveSessions.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {liveSessions.map((s) => {
                const isThisActive =
                  activeMeeting?.role === "student" &&
                  activeMeeting.sessionId === s.id;
                const isJoiningThis = joining && joiningId === s.id;

                return (
                  <div key={s.id} className="lc2-livecard">
                    <div className="lc2-livecard-thumb">
                      <Play size={22} fill="#fff" />
                    </div>
                    <div className="lc2-livecard-info">
                      <p className="lc2-livecard-title">{s.title}</p>
                      <div className="lc2-livecard-meta">
                        {s.scheduledTime && (
                          <span><Clock size={12} /> {s.scheduledTime}</span>
                        )}
                        {s.viewerCount != null && (
                          <span><Users size={12} /> {s.viewerCount} watching</span>
                        )}
                      </div>
                    </div>
                    {isThisActive && minimized ? (
                      <button className="lc2-resumebtn" onClick={handleResume}>
                        Resume
                      </button>
                    ) : (
                      <button
                        className="lc2-jointbtn"
                        disabled={joining}
                        onClick={() => handleJoin(s)}
                      >
                        {isJoiningThis ? "Joining…" : "Join Now"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="lc2-empty">
              <div className="lc2-empty-icon"><Radio size={30} /></div>
              No live session right now.
            </div>
          )}
        </div>

        {/* ── Today's Schedule + Recent Classes (side-by-side on wide screens) ── */}
        <div className="lc2-bottom-grid">
          <div>
            <div className="lc2-section-head">
              <span className="lc2-section-title">Today's Schedule</span>
              {upcomingSessions.length > 0 && (
                <button className="lc2-viewall">View all</button>
              )}
            </div>

            {upcomingSessions.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {upcomingSessions.map((s) => (
                  <div key={s.id} className="lc2-schedrow">
                    <div className="lc2-schedtime">{s.scheduledTime || "—"}</div>
                    <div className="lc2-schedicon">
                      <Calendar size={18} />
                    </div>
                    <div className="lc2-schedinfo">
                      <p className="lc2-schedtitle">{s.title}</p>
                      <div className="lc2-schedby">
                        {s.scheduledDate && (
                          <span><Calendar size={11} style={{ marginRight: 3 }} />{s.scheduledDate}</span>
                        )}
                        {s.viewerCount != null && (
                          <span><Users size={11} style={{ marginRight: 3 }} />{s.viewerCount} watching</span>
                        )}
                      </div>
                    </div>
                    <button className="lc2-joinbtn-sm" onClick={() => handleJoin(s)}>
                      Join
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="lc2-empty">No sessions scheduled.</div>
            )}
          </div>

          {/* ── Recent Classes ── */}
          <div>
            <div className="lc2-section-head">
              <span className="lc2-section-title">Your Recent Classes</span>
            </div>
            <div className="lc2-empty">
              Your recent class progress will show up here once available.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveClasses;