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
//   .dark .lc2-root { background: #0a0a0a; }

//   .lc2-inner {
//     width: 100%;
//     max-width: 1600px;
//     margin: 0 auto;
//     display: flex;
//     flex-direction: column;
//     gap: 24px;
//   }

//   .lc2-title { font-size: clamp(20px, 2.2vw, 26px); font-weight: 800; color: #16182b; margin: 0; }
//   .dark .lc2-title { color: #ffffff; }
//   .lc2-subtitle { font-size: 14px; color: #8a8fa3; margin: 4px 0 0; }
//   .dark .lc2-subtitle { color: #94a3b8; }

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

//   /* Dark theme: match the dashboard's dark-card stat style
//      (dark surface + tinted icon badge) instead of the bright
//      gradient fill used in light mode. */
//   .dark .lc2-stat {
//     background: #111111;
//     border: 1px solid rgba(255,255,255,0.06);
//     color: inherit;
//     box-shadow: 0 4px 24px rgba(0,0,0,0.40);
//   }
//   .dark .lc2-stat::after { display: none; }
//   .dark .lc2-stat-val { color: #ffffff; }
//   .dark .lc2-stat-lbl { color: #94a3b8; text-transform: uppercase; letter-spacing: 0.4px; opacity: 1; }
//   .dark .lc2-stat-sub {
//     color: #94a3b8;
//     opacity: 1;
//     padding-top: 8px;
//     margin-top: 2px;
//     border-top: 2px solid var(--lc2-accent, #3b82f6);
//   }

//   .dark .lc2-stat-blue   { --lc2-accent: #3b82f6; }
//   .dark .lc2-stat-green  { --lc2-accent: #22c55e; }
//   .dark .lc2-stat-orange { --lc2-accent: #f59e0b; }
//   .dark .lc2-stat-purple { --lc2-accent: #a855f7; }

//   .dark .lc2-stat-blue .lc2-stat-icon   { background: rgba(59,130,246,0.15); color: #3b82f6; }
//   .dark .lc2-stat-green .lc2-stat-icon  { background: rgba(34,197,94,0.15); color: #22c55e; }
//   .dark .lc2-stat-orange .lc2-stat-icon { background: rgba(245,158,11,0.15); color: #f59e0b; }
//   .dark .lc2-stat-purple .lc2-stat-icon { background: rgba(168,85,247,0.15); color: #a855f7; }

//   .lc2-section-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
//   .lc2-section-title { font-size: 16px; font-weight: 700; color: #16182b; display: flex; align-items: center; gap: 8px; }
//   .dark .lc2-section-title { color: #ffffff; }
//   .lc2-live-dot { display: inline-flex; align-items: center; gap: 5px; color: #ef4444; font-size: 11px; font-weight: 800; }
//   .lc2-blink { width: 6px; height: 6px; border-radius: 50%; background: #ef4444; animation: lc2blink 1s infinite; }
//   @keyframes lc2blink { 0%,100%{opacity:1} 50%{opacity:.25} }
//   .lc2-viewall { font-size: 13px; font-weight: 600; color: #6d5ef7; cursor: pointer; background: none; border: none; }
//   .dark .lc2-viewall { color: #a78bfa; }

//   .lc2-livecard {
//     background: #fff; border-radius: 18px; padding: 16px;
//     display: flex; align-items: center; gap: 16px;
//     box-shadow: 0 1px 3px rgba(16,24,64,0.06);
//   }
//   .dark .lc2-livecard { background: #111111; border: 1px solid rgba(255,255,255,0.06); box-shadow: 0 4px 24px rgba(0,0,0,0.40); }
//   .lc2-livecard-thumb {
//     width: 88px; height: 64px; border-radius: 14px; flex-shrink: 0;
//     background: linear-gradient(135deg,#c4b5fd,#f9a8d4,#93c5fd);
//     display: flex; align-items: center; justify-content: center;
//     color: #fff;
//   }
//   .lc2-livecard-info { flex: 1; min-width: 0; }
//   .lc2-livecard-title { font-size: 15px; font-weight: 700; color: #16182b; margin: 0 0 6px; }
//   .dark .lc2-livecard-title { color: #ffffff; }
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
//   .dark .lc2-schedrow { background: #111111; border: 1px solid rgba(255,255,255,0.06); box-shadow: 0 4px 24px rgba(0,0,0,0.40); }
//   .lc2-schedtime { font-size: 12px; font-weight: 700; color: #16182b; width: 56px; flex-shrink: 0; }
//   .dark .lc2-schedtime { color: #ffffff; }
//   .lc2-schedicon {
//     width: 40px; height: 40px; border-radius: 12px; flex-shrink: 0;
//     background: #fef2e8; color: #f59e0b;
//     display: flex; align-items: center; justify-content: center;
//   }
//   .dark .lc2-schedicon { background: rgba(167,139,250,0.10); border: 1px solid rgba(167,139,250,0.18); color: #a78bfa; }
//   .lc2-schedinfo { flex: 1; min-width: 0; }
//   .lc2-schedtitle { font-size: 14px; font-weight: 700; color: #16182b; margin: 0 0 3px; }
//   .dark .lc2-schedtitle { color: #ffffff; }
//   .lc2-schedby { font-size: 12px; color: #8a8fa3; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
//   .dark .lc2-schedby { color: #94a3b8; }
//   .lc2-joinbtn-sm {
//     background: #fff; color: #6d5ef7; border: 1px solid #e3defb; border-radius: 10px;
//     padding: 8px 16px; font-size: 12px; font-weight: 700; cursor: pointer; flex-shrink: 0;
//   }
//   .dark .lc2-joinbtn-sm { background: rgba(167,139,250,0.08); border-color: rgba(167,139,250,0.18); color: #a78bfa; }

//   .lc2-recentcard {
//     background: #fff; border-radius: 16px; padding: 14px 16px;
//     display: flex; align-items: center; gap: 14px;
//     box-shadow: 0 1px 3px rgba(16,24,64,0.06);
//   }
//   .dark .lc2-recentcard { background: #111111; border: 1px solid rgba(255,255,255,0.06); box-shadow: 0 4px 24px rgba(0,0,0,0.40); }
//   .lc2-recenticon {
//     width: 40px; height: 40px; border-radius: 12px; flex-shrink: 0;
//     display: flex; align-items: center; justify-content: center;
//   }
//   .lc2-recentinfo { flex: 1; min-width: 0; }
//   .lc2-recenttitle { font-size: 14px; font-weight: 700; color: #16182b; margin: 0 0 6px; }
//   .dark .lc2-recenttitle { color: #ffffff; }
//   .lc2-recentby { font-size: 12px; color: #8a8fa3; margin: 0 0 8px; }
//   .dark .lc2-recentby { color: #94a3b8; }
//   .lc2-progresstrack { height: 5px; border-radius: 4px; background: #f1f1f6; overflow: hidden; }
//   .dark .lc2-progresstrack { background: rgba(255,255,255,0.08); }
//   .lc2-progressfill { height: 100%; border-radius: 4px; background: #6d5ef7; }
//   .lc2-continuebtn {
//     background: #fff; color: #6d5ef7; border: 1px solid #e3defb; border-radius: 10px;
//     padding: 8px 16px; font-size: 12px; font-weight: 700; cursor: pointer; flex-shrink: 0;
//   }
//   .dark .lc2-continuebtn { background: rgba(167,139,250,0.08); border-color: rgba(167,139,250,0.18); color: #a78bfa; }

//   .lc2-empty {
//     text-align: center; padding: 30px; color: #a7abbd; font-size: 13px;
//     background: #fff; border-radius: 16px;
//   }
//   .dark .lc2-empty { background: #111111; border: 1px solid rgba(255,255,255,0.06); color: #94a3b8; }
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
  Sparkles,
} from "lucide-react";

// ── Golden Reference design system — same tokens, StatCard, and
// PageContainer shell as every other refactored page. This page used
// to ship its own complete visual identity: Inter instead of Poppins,
// its own brand purple (#6d5ef7) instead of the shared #7c3aed, a
// light-mode-only gradient stat tile with a *separate* dark-mode
// re-skin bolted on via `.dark` selectors, and ~250 lines of injected
// CSS for cards/badges/buttons that the rest of the app already has
// tokens for. All of that is gone. Only the one thing with no shared
// equivalent — the schedule/recent two-column responsive split — stays
// as a small scoped style block, since inline styles can't express a
// breakpoint.
import { T, StatCard, PageContainer, FONT_FAMILY, FONT_WEIGHT, FONT_SIZE, LETTER_SPACING, LINE_HEIGHT } from "@/design-system";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

const twoColGridStyle = `
  .lc-two-col { display: grid; grid-template-columns: 1fr; gap: 24px; }
  @media (min-width: 1200px) {
    .lc-two-col { grid-template-columns: 1.3fr 1fr; align-items: start; }
  }
`;
if (typeof document !== "undefined" && !document.getElementById("lc-two-col-style")) {
  const tag = document.createElement("style");
  tag.id = "lc-two-col-style";
  tag.textContent = twoColGridStyle;
  document.head.appendChild(tag);
}

const isDarkFn = () =>
  document.documentElement.classList.contains("dark") ||
  document.body.classList.contains("dark") ||
  window.matchMedia("(prefers-color-scheme: dark)").matches;

const LiveClasses = () => {
  const [sessions, setSessions] = useState([]);
  const [joining, setJoining] = useState(false);
  const [joiningId, setJoiningId] = useState(null);

  // Meeting connection/state lives in the shared context so it survives
  // sidebar navigation instead of being torn down when this page unmounts.
  const { activeMeeting, minimized, setMinimized, joinMeeting } =
    useLiveMeeting();

  // Same dark-mode detection pattern as the Dashboard golden reference
  const [isDark, setIsDark] = useState(isDarkFn);
  useEffect(() => {
    const o = new MutationObserver(() => setIsDark(isDarkFn()));
    o.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    o.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => o.disconnect();
  }, []);
  const t = isDark ? T.dark : T.light;

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

  // Same `stat` shape the Dashboard/AssignmentDetail/Assessments/
  // Attendance pages hand to <StatCard/> — colorKeys already lined up
  // 1:1 with this page's original blue/green/orange/purple stat tiles.
  const stats = [
    { label: "Live Now", numericValue: liveSessions.length, change: liveSessions.length ? "Join now" : "None right now", trend: liveSessions.length ? "up" : "down", icon: Radio, colorKey: "blue" },
    { label: "Today", numericValue: todayCount, change: "Scheduled", trend: "up", icon: Calendar, colorKey: "green" },
    { label: "Upcoming", numericValue: upcomingSessions.length, change: "This week", trend: "up", icon: Clock, colorKey: "orange" },
    { label: "Completed", numericValue: 0, change: "Sessions", trend: "up", icon: CheckCircle2, colorKey: "purple" },
  ];

  const card = { background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 18, boxShadow: t.shadow };
  const emptyState = (label) => (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      gap: 8, padding: "30px 20px", textAlign: "center", ...card,
    }}>
      <p style={{ fontSize: 13, color: t.textMuted, margin: 0, fontFamily: FONT_FAMILY }}>{label}</p>
    </div>
  );

  return (
    <PageContainer mode={isDark ? "dark" : "light"} pageBg={t.pageBg} textColor={t.text}>

      {/* ═══ HERO — same borderless pattern as the rest of the app ═══ */}
      <div className="dfade" style={{ padding: "8px 0 24px", background: "transparent", border: "none", borderBottom: `1px solid ${t.borderHero}`, marginBottom: 20, boxShadow: "none" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
          <Sparkles size={11} color={t.textSub} />
          <span style={{ fontSize: FONT_SIZE.eyebrow, fontWeight: FONT_WEIGHT.bold, letterSpacing: LETTER_SPACING.eyebrowWide, textTransform: "uppercase", color: t.textSub, fontFamily: FONT_FAMILY }}>
            Live Sessions
          </span>
        </div>
        <h1 style={{
          fontFamily: FONT_FAMILY, fontWeight: FONT_WEIGHT.heroTitle, fontSize: FONT_SIZE.heroTitle,
          color: "#3B82F6", margin: "0 0 6px", lineHeight: LINE_HEIGHT.heroTitle, letterSpacing: LETTER_SPACING.heroTitle,
        }}>
          Live Classes
        </h1>
        <p style={{ fontSize: FONT_SIZE.bodySmall, color: t.textSub, margin: 0, fontWeight: FONT_WEIGHT.medium, fontFamily: FONT_FAMILY }}>
          Join live sessions, interact in real-time and learn better together.
        </p>
      </div>

      {/* ═══ STAT CARDS — shared <StatCard/>, same stat-grid layout ═══ */}
      <div className="stat-grid" style={{ marginBottom: 20 }}>
        {stats.map((s, i) => <StatCard key={i} stat={s} index={i} loading={false} />)}
      </div>

      {/* ═══ LIVE NOW ═══ */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ fontSize: 16, fontWeight: FONT_WEIGHT.bold, color: t.text, display: "flex", alignItems: "center", gap: 8, fontFamily: FONT_FAMILY }}>
            Live Now
          </span>
          {liveSessions.length > 0 && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: t.overdueText, fontSize: 11, fontWeight: FONT_WEIGHT.extrabold, fontFamily: FONT_FAMILY }}>
              <span className="d1" style={{ width: 6, height: 6, borderRadius: "50%", background: t.overdueText, display: "inline-block" }} />
              LIVE
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
                <div key={s.id} style={{ ...card, padding: 16, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                  <div style={{
                    width: 88, height: 64, borderRadius: 14, flexShrink: 0,
                    background: "linear-gradient(135deg,#c4b5fd,#f9a8d4,#93c5fd)",
                    display: "flex", alignItems: "center", justifyContent: "center", color: "#fff",
                  }}>
                    <Play size={22} fill="#fff" />
                  </div>
                  <div style={{ flex: 1, minWidth: 180 }}>
                    <p style={{ fontSize: 15, fontWeight: FONT_WEIGHT.bold, color: t.text, margin: "0 0 6px", fontFamily: FONT_FAMILY }}>{s.title}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: FONT_SIZE.bodySmall, color: t.textMuted, flexWrap: "wrap", fontFamily: FONT_FAMILY }}>
                      {s.scheduledTime && (
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={12} /> {s.scheduledTime}</span>
                      )}
                      {s.viewerCount != null && (
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Users size={12} /> {s.viewerCount} watching</span>
                      )}
                    </div>
                  </div>
                  {isThisActive && minimized ? (
                    <button
                      onClick={handleResume}
                      style={{ background: "linear-gradient(135deg,#34d399,#059669)", color: "#fff", border: "none", borderRadius: 12, padding: "12px 22px", fontSize: 13, fontWeight: FONT_WEIGHT.bold, cursor: "pointer", whiteSpace: "nowrap", fontFamily: FONT_FAMILY }}
                    >
                      Resume
                    </button>
                  ) : (
                    <button
                      disabled={joining}
                      onClick={() => handleJoin(s)}
                      style={{
                        background: "linear-gradient(135deg,#7c3aed,#a855f7)", color: "#fff", border: "none", borderRadius: 12,
                        padding: "12px 22px", fontSize: 13, fontWeight: FONT_WEIGHT.bold, cursor: joining ? "not-allowed" : "pointer",
                        whiteSpace: "nowrap", opacity: joining ? 0.5 : 1, fontFamily: FONT_FAMILY,
                      }}
                    >
                      {isJoiningThis ? "Joining…" : "Join Now"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ) : emptyState(<><Radio size={30} color={t.emptyIcon} style={{ display: "block", margin: "0 auto 8px" }} />No live session right now.</>)}
      </div>

      {/* ═══ Today's Schedule + Recent Classes ═══ */}
      <div className="lc-two-col">
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontSize: 16, fontWeight: FONT_WEIGHT.bold, color: t.text, fontFamily: FONT_FAMILY }}>Today's Schedule</span>
            {upcomingSessions.length > 0 && (
              <button style={{ fontSize: 13, fontWeight: FONT_WEIGHT.semibold, color: "#7c3aed", cursor: "pointer", background: "none", border: "none", fontFamily: FONT_FAMILY }}>
                View all
              </button>
            )}
          </div>

          {upcomingSessions.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {upcomingSessions.map((s) => (
                <div key={s.id} style={{ ...card, borderRadius: 16, padding: "14px 16px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                  <div style={{ fontSize: FONT_SIZE.bodySmall, fontWeight: FONT_WEIGHT.bold, color: t.text, width: 56, flexShrink: 0, fontFamily: FONT_FAMILY }}>
                    {s.scheduledTime || "—"}
                  </div>
                  <div style={{
                    width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                    background: "rgba(251,146,60,0.10)", border: "1px solid rgba(251,146,60,0.18)", color: "#fb923c",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Calendar size={18} />
                  </div>
                  <div style={{ flex: 1, minWidth: 150 }}>
                    <p style={{ fontSize: 14, fontWeight: FONT_WEIGHT.bold, color: t.text, margin: "0 0 3px", fontFamily: FONT_FAMILY }}>{s.title}</p>
                    <div style={{ fontSize: FONT_SIZE.bodySmall, color: t.textMuted, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", fontFamily: FONT_FAMILY }}>
                      {s.scheduledDate && (
                        <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Calendar size={11} />{s.scheduledDate}</span>
                      )}
                      {s.viewerCount != null && (
                        <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Users size={11} />{s.viewerCount} watching</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleJoin(s)}
                    style={{
                      background: "transparent", color: "#7c3aed", border: "1px solid rgba(124,58,237,0.35)", borderRadius: 10,
                      padding: "8px 16px", fontSize: FONT_SIZE.bodySmall, fontWeight: FONT_WEIGHT.bold, cursor: "pointer", flexShrink: 0, fontFamily: FONT_FAMILY,
                    }}
                  >
                    Join
                  </button>
                </div>
              ))}
            </div>
          ) : emptyState("No sessions scheduled.")}
        </div>

        {/* ── Recent Classes ── */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontSize: 16, fontWeight: FONT_WEIGHT.bold, color: t.text, fontFamily: FONT_FAMILY }}>Your Recent Classes</span>
          </div>
          {emptyState("Your recent class progress will show up here once available.")}
        </div>
      </div>
    </PageContainer>
  );
};

export default LiveClasses;