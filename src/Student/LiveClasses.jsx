// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { joinLiveSession } from "@/services/liveSessionService";
// import LiveRoom from "@/components/live/LiveRoom";
// import { useLiveMeeting } from "@/context/LiveMeetingContext";
// import {
//   ChevronDown,
//   ChevronUp,
//   Radio,
//   Users,
//   Calendar,
//   Clock,
//   Wifi,
//   TrendingUp,
// } from "lucide-react";

// const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

// /* ─── Styles ─────────────────────────────────────────────────────── */
// const styles = `
//   @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

//   :root {
//     --lc-bg:        #f1f5f9;
//     --lc-card:      #ffffff;
//     --lc-text:      #0f172a;
//     --lc-muted:     #64748b;
//     --lc-border:    #e2e8f0;
//     --lc-accent1:   #22d3ee;
//     --lc-accent2:   #fb923c;
//     --lc-accent3:   #34d399;
//     --lc-accent4:   #a78bfa;
//     --lc-danger:    #f87171;
//     --lc-shadow:    0 4px 24px rgba(0,0,0,0.06);
//     --lc-shadow-lg: 0 8px 40px rgba(0,0,0,0.10);
//     --lc-radius:    20px;
//   }

//   .lc-dark {
//     --lc-bg:        #0a0a0a;
//     --lc-card:      #111111;
//     --lc-text:      #ffffff;
//     --lc-muted:     #94a3b8;
//     --lc-border:    rgba(255,255,255,0.06);
//     --lc-shadow:    0 4px 24px rgba(0,0,0,0.40);
//     --lc-shadow-lg: 0 8px 40px rgba(0,0,0,0.60);
//   }

//   .lc-root {
//     font-family: 'Poppins', sans-serif;
//     min-height: 100vh;
//     background: var(--lc-bg);
//     color: var(--lc-text);
//     padding: 24px;
//     box-sizing: border-box;
//     transition: background 0.3s;
//   }

//   .lc-inner { max-width: 1100px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }

//   .lc-header {
//     background: var(--lc-card);
//     border: 1px solid var(--lc-border);
//     border-radius: var(--lc-radius);
//     padding: 28px 32px;
//     box-shadow: var(--lc-shadow);
//     display: flex; align-items: center;
//     justify-content: space-between; gap: 20px; flex-wrap: wrap;
//   }

//   .lc-header-left { display: flex; align-items: center; gap: 16px; }

//   .lc-header-icon {
//     width: 52px; height: 52px; border-radius: 14px;
//     background: rgba(248,113,113,0.10);
//     border: 1px solid rgba(248,113,113,0.18);
//     display: flex; align-items: center; justify-content: center;
//     color: var(--lc-danger); flex-shrink: 0;
//   }

//   .lc-badge {
//     display: inline-flex; align-items: center; gap: 6px;
//     padding: 4px 11px; border-radius: 50px;
//     border: 1px solid var(--lc-border);
//     background: rgba(248,113,113,0.08);
//     color: var(--lc-danger);
//     font-size: 10px; font-weight: 700;
//     letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 6px;
//   }

//   .lc-h1 { font-size: 24px; font-weight: 800; color: var(--lc-text); margin: 0 0 2px; }
//   .lc-subtitle { font-size: 13px; color: var(--lc-muted); margin: 0; }

//   .lc-stats { display: flex; gap: 12px; flex-wrap: wrap; }

//   .lc-stat {
//     display: flex; align-items: center; gap: 10px;
//     padding: 12px 18px; border-radius: 14px;
//     background: var(--lc-bg); border: 1px solid var(--lc-border);
//     box-shadow: var(--lc-shadow);
//   }

//   .lc-stat-icon {
//     width: 36px; height: 36px; border-radius: 10px;
//     display: flex; align-items: center; justify-content: center;
//     flex-shrink: 0;
//   }

//   .lc-stat-val { font-size: 18px; font-weight: 800; line-height: 1; margin-bottom: 2px; }
//   .lc-stat-lbl { font-size: 10px; font-weight: 600; color: var(--lc-muted); text-transform: uppercase; letter-spacing: 0.06em; }

//   .lc-panel {
//     background: var(--lc-card);
//     border: 1px solid var(--lc-border);
//     border-radius: var(--lc-radius);
//     box-shadow: var(--lc-shadow);
//     overflow: hidden;
//   }

//   .lc-panel-head {
//     display: flex; align-items: center; justify-content: space-between;
//     padding: 16px 24px;
//     background: rgba(248,113,113,0.06);
//     border-bottom: 1px solid var(--lc-border);
//   }

//   .lc-panel-head-left { display: flex; align-items: center; gap: 12px; }

//   .lc-panel-icon {
//     width: 38px; height: 38px; border-radius: 10px;
//     display: flex; align-items: center; justify-content: center;
//     background: rgba(248,113,113,0.12);
//     border: 1px solid rgba(248,113,113,0.18);
//     color: var(--lc-danger); flex-shrink: 0;
//   }

//   .lc-panel-title { font-size: 14px; font-weight: 700; color: var(--lc-text); margin: 0 0 2px; }
//   .lc-panel-sub   { font-size: 11px; color: var(--lc-muted); margin: 0; }

//   .lc-collapse-btn {
//     display: inline-flex; align-items: center; gap: 6px;
//     padding: 7px 14px; border-radius: 10px; border: 1px solid var(--lc-border);
//     background: var(--lc-bg); color: var(--lc-muted);
//     font-family: 'Poppins', sans-serif;
//     font-size: 11px; font-weight: 700;
//     cursor: pointer; transition: border-color 0.2s, color 0.2s;
//     white-space: nowrap;
//   }

//   .lc-collapse-btn:hover { border-color: rgba(248,113,113,0.30); color: var(--lc-danger); }

//   .lc-body { padding: 20px; display: flex; flex-direction: column; gap: 12px; }

//   .lc-empty {
//     display: flex; flex-direction: column; align-items: center;
//     justify-content: center; padding: 48px 20px; gap: 10px;
//     color: var(--lc-muted); font-size: 13px; font-weight: 500; text-align: center;
//   }

//   .lc-empty-icon { opacity: 0.35; margin-bottom: 4px; }
//   .lc-empty-sub  { font-size: 12px; color: var(--lc-muted); margin: 0; }

//   .lc-session {
//     display: flex; align-items: center; gap: 14px;
//     padding: 14px 16px; border-radius: 14px;
//     border-left: 3px solid transparent;
//     border-top: 1px solid var(--lc-border);
//     border-right: 1px solid var(--lc-border);
//     border-bottom: 1px solid var(--lc-border);
//     cursor: pointer; transition: all 0.18s;
//     background: var(--lc-bg);
//     position: relative; overflow: hidden;
//   }

//   .lc-session:hover { border-color: rgba(34,211,238,0.25); background: rgba(34,211,238,0.03); }

//   .lc-session.selected-normal {
//     border-left-color: var(--lc-accent1);
//     background: rgba(34,211,238,0.05);
//     border-top-color: rgba(34,211,238,0.20);
//     border-right-color: rgba(34,211,238,0.20);
//     border-bottom-color: rgba(34,211,238,0.20);
//   }

//   .lc-session.is-live {
//     border-left-color: var(--lc-danger);
//     background: rgba(248,113,113,0.04);
//     border-top-color: rgba(248,113,113,0.12);
//     border-right-color: rgba(248,113,113,0.12);
//     border-bottom-color: rgba(248,113,113,0.12);
//   }

//   .lc-session.selected-live {
//     border-color: rgba(248,113,113,0.35);
//     background: rgba(248,113,113,0.07);
//   }

//   .lc-session-icon {
//     width: 40px; height: 40px; border-radius: 11px;
//     display: flex; align-items: center; justify-content: center;
//     flex-shrink: 0;
//   }

//   .lc-session-info { flex: 1; min-width: 0; }

//   .lc-session-title-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 4px; }

//   .lc-session-title { font-size: 13px; font-weight: 700; color: var(--lc-text); margin: 0; }

//   .lc-live-badge {
//     display: inline-flex; align-items: center; gap: 5px;
//     padding: 3px 8px; border-radius: 6px;
//     background: rgba(248,113,113,0.12);
//     border: 1px solid rgba(248,113,113,0.18);
//     color: var(--lc-danger);
//     font-size: 10px; font-weight: 800; letter-spacing: 0.06em;
//   }

//   .lc-blink { width: 5px; height: 5px; border-radius: 50%; background: var(--lc-danger); animation: lc-blink 1s infinite; }
//   @keyframes lc-blink { 0%,100%{opacity:1} 50%{opacity:0.25} }

//   .lc-session-meta { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }

//   .lc-session-meta-item {
//     display: flex; align-items: center; gap: 4px;
//     font-size: 11px; color: var(--lc-muted);
//   }

//   .lc-check {
//     width: 20px; height: 20px; border-radius: 50%;
//     display: flex; align-items: center; justify-content: center;
//     flex-shrink: 0;
//   }

//   .lc-join-btn {
//     display: flex; align-items: center; justify-content: center; gap: 10px;
//     width: 100%; padding: 14px 24px; border-radius: 14px; border: none;
//     background: var(--lc-danger); color: #fff;
//     font-family: 'Poppins', sans-serif;
//     font-size: 14px; font-weight: 700;
//     cursor: pointer;
//     box-shadow: 0 4px 20px rgba(248,113,113,0.30);
//     transition: opacity 0.2s, transform 0.2s;
//   }

//   .lc-join-btn:hover { opacity: 0.87; transform: translateY(-1px); }
//   .lc-join-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

//   .lc-join-dot { width: 8px; height: 8px; border-radius: 50%; background: white; animation: lc-blink 1s infinite; }

//   /* ✅ NEW — shown on the session list when this student already has an
//      active meeting running in the floating widget elsewhere, so they
//      can jump back in without re-joining (which would create a second
//      LiveKit connection under the same identity and kick themselves out). */
//   .lc-resume-btn {
//     display: flex; align-items: center; justify-content: center; gap: 10px;
//     width: 100%; padding: 14px 24px; border-radius: 14px; border: none;
//     background: var(--lc-accent3); color: #062e21;
//     font-family: 'Poppins', sans-serif;
//     font-size: 14px; font-weight: 700;
//     cursor: pointer;
//     box-shadow: 0 4px 20px rgba(52,211,153,0.30);
//     transition: opacity 0.2s, transform 0.2s;
//   }
//   .lc-resume-btn:hover { opacity: 0.87; transform: translateY(-1px); }

//   @keyframes lc-spin { to { transform: rotate(360deg); } }

//   /* ─── RESPONSIVE ────────────────────────────────────────────────── */

//   /* Tablet: 481px – 768px */
//   @media (max-width: 768px) {
//     .lc-root { padding: 16px; }

//     .lc-header {
//       padding: 20px 20px;
//       flex-direction: column;
//       align-items: flex-start;
//       gap: 16px;
//     }

//     .lc-header-left { gap: 12px; }

//     .lc-header-icon { width: 44px; height: 44px; border-radius: 12px; }

//     .lc-stats {
//       width: 100%;
//       display: grid;
//       grid-template-columns: repeat(3, 1fr);
//       gap: 10px;
//     }

//     .lc-stat {
//       padding: 10px 12px;
//       border-radius: 12px;
//       flex-direction: column;
//       align-items: flex-start;
//       gap: 6px;
//     }

//     .lc-stat-icon { width: 30px; height: 30px; border-radius: 8px; }
//     .lc-stat-val { font-size: 16px; }

//     .lc-panel-head { padding: 14px 16px; flex-wrap: wrap; gap: 10px; }

//     .lc-body { padding: 14px; gap: 10px; }

//     .lc-session { padding: 12px 12px; gap: 10px; }

//     .lc-session-icon { width: 36px; height: 36px; border-radius: 9px; }

//     .lc-session-title { font-size: 12px; }

//     .lc-join-btn { padding: 13px 20px; font-size: 13px; }
//   }

//   /* Phone: up to 480px */
//   @media (max-width: 480px) {
//     .lc-root { padding: 12px; }

//     .lc-inner { gap: 14px; }

//     .lc-header {
//       padding: 16px;
//       border-radius: 16px;
//       gap: 14px;
//     }

//     .lc-header-left { gap: 10px; }

//     .lc-header-icon { width: 40px; height: 40px; border-radius: 10px; }

//     .lc-badge { font-size: 9px; padding: 3px 8px; }

//     .lc-subtitle { font-size: 11px; }

//     .lc-stats {
//       grid-template-columns: repeat(3, 1fr);
//       gap: 8px;
//     }

//     .lc-stat {
//       padding: 8px 10px;
//       flex-direction: column;
//       align-items: flex-start;
//       gap: 4px;
//       border-radius: 10px;
//     }

//     .lc-stat-icon { width: 26px; height: 26px; border-radius: 7px; }
//     .lc-stat-val { font-size: 14px; }
//     .lc-stat-lbl { font-size: 9px; }

//     .lc-panel { border-radius: 16px; }

//     .lc-panel-head { padding: 12px 14px; gap: 8px; }

//     .lc-panel-icon { width: 32px; height: 32px; border-radius: 8px; }

//     .lc-panel-title { font-size: 13px; }
//     .lc-panel-sub { font-size: 10px; }

//     .lc-collapse-btn { padding: 6px 10px; font-size: 10px; }

//     .lc-body { padding: 10px; gap: 8px; }

//     .lc-session { padding: 10px 10px; gap: 8px; border-radius: 12px; }

//     .lc-session-icon { width: 32px; height: 32px; border-radius: 8px; }

//     .lc-session-title { font-size: 12px; }

//     .lc-session-meta { gap: 8px; }
//     .lc-session-meta-item { font-size: 10px; }

//     .lc-live-badge { font-size: 9px; padding: 2px 6px; }

//     .lc-check { width: 18px; height: 18px; }

//     .lc-join-btn { padding: 12px 16px; font-size: 12px; border-radius: 12px; gap: 8px; }

//     .lc-empty { padding: 32px 16px; font-size: 12px; }
//   }
// `;

// if (!document.getElementById("lc-styles")) {
//   const tag = document.createElement("style");
//   tag.id = "lc-styles";
//   tag.textContent = styles;
//   document.head.appendChild(tag);
// }

// const isDark = () =>
//   document.documentElement.classList.contains("dark") ||
//   document.body.classList.contains("dark") ||
//   window.matchMedia("(prefers-color-scheme: dark)").matches;

// const LiveClasses = () => {
//   const [sessions, setSessions] = useState([]);
//   const [selected, setSelected] = useState(null);
//   const [collapsed, setCollapsed] = useState(false);
//   const [joining, setJoining] = useState(false);
//   const [dark, setDark] = useState(isDark);

//   // ✅ Meeting connection/state now lives in the shared context so it
//   // survives sidebar navigation instead of being torn down when this
//   // page component unmounts. No more local token/room/joinedAt state,
//   // no more sessionStorage persistence dance — the context is the
//   // single source of truth for "is there an active meeting right now".
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

//   useEffect(() => {
//     const obs = new MutationObserver(() => setDark(isDark()));
//     obs.observe(document.documentElement, {
//       attributes: true,
//       attributeFilter: ["class"],
//     });
//     obs.observe(document.body, {
//       attributes: true,
//       attributeFilter: ["class"],
//     });
//     return () => obs.disconnect();
//   }, []);

//   const handleJoin = async () => {
//     if (!selected) return;

//     // ✅ If EXTERNAL session — open meeting link directly, no LiveKit
//     // connection to manage at all.
//     if (selected.meetingType === "EXTERNAL" && selected.externalMeetingUrl) {
//       window.open(selected.externalMeetingUrl, "_blank");
//       return;
//     }

//     try {
//       setJoining(true);

//       // ✅ FIX — real, unique student id instead of the hardcoded `1`
//       // that gave every student the same LiveKit identity. LiveKit
//       // disconnects any existing connection sharing an identity when a
//       // new one connects, which is exactly why the previous student's
//       // meeting was getting kicked out whenever another student joined.
//       const user = JSON.parse(localStorage.getItem("lms_user") || "{}");
//       const studentId = user?.id || user?.studentId;
//       if (!studentId) {
//         console.error("No student id found in lms_user — cannot join with a unique identity.");
//         return;
//       }

//       const res = await joinLiveSession(selected.id, studentId);

//       // ✅ Hands the token/room off to the context, which owns the
//       // actual LiveKit Room connection at a level above the router so
//       // it never gets disconnected by in-app navigation.
//       await joinMeeting({
//         role: "student",
//         sessionId: selected.id,
//         roomName: res.data.room,
//         token: res.data.token,
//         title: selected.title,
//       });
//     } catch (err) {
//       console.error("Join failed", err);
//     } finally {
//       setJoining(false);
//     }
//   };

//   // ✅ Jump back into a meeting that's already running in the floating
//   // widget (e.g. student navigated here from another dashboard page
//   // while the meeting was minimized) — no new join, just un-minimize.
//   const handleResume = () => {
//     setMinimized(false);
//   };

//   const liveCount = sessions.filter(
//     (s) => s.isLive || s.status === "LIVE",
//   ).length;
//   const upcomingCount = sessions.filter(
//     (s) => !s.isLive && s.status !== "LIVE",
//   ).length;

//   const statCards = [
//     {
//       icon: <Radio size={16} />,
//       value: sessions.length,
//       label: "Total",
//       accent: "var(--lc-accent1)",
//       bg: "rgba(34,211,238,0.10)",
//     },
//     {
//       icon: <TrendingUp size={16} />,
//       value: liveCount,
//       label: "Live Now",
//       accent: "var(--lc-danger)",
//       bg: "rgba(248,113,113,0.10)",
//     },
//     {
//       icon: <Clock size={16} />,
//       value: upcomingCount,
//       label: "Upcoming",
//       accent: "var(--lc-accent2)",
//       bg: "rgba(251,146,60,0.10)",
//     },
//   ];

//   // ✅ This student already has an active meeting running (owned by the
//   // context / floating widget). If it's for THIS same session and it's
//   // currently minimized, show "Resume" instead of trying to join again.
//   const hasActiveMeetingForSelected =
//     activeMeeting?.role === "student" &&
//     selected &&
//     activeMeeting.sessionId === selected.id;

//   // ✅ Full-screen meeting view — only render LiveRoom when the active
//   // meeting belongs to this student flow AND it isn't minimized (i.e.
//   // we're actually on this page and not floating elsewhere).
//   if (activeMeeting?.role === "student" && !minimized) {
//     return (
//       <LiveRoom
//         sessionId={activeMeeting.sessionId}
//         roomName={activeMeeting.roomName}
//         joinedAt={activeMeeting.joinedAt}
//         onSessionEnded={() => {}}
//         onLeave={() => {}}
//       />
//     );
//   }

//   return (
//     <div className={`lc-root${dark ? " lc-dark" : ""}`}>
//       <div className="lc-inner">
//         {/* ── Header ── */}
//         <div className="lc-header">
//           <div className="lc-header-left">
//             <div className="lc-header-icon">
//               <Radio size={24} />
//             </div>
//             <div>
//               <div className="lc-badge">
//                 <Radio size={10} /> Live & Recorded
//               </div>
//               <h1
//                 style={{
//                   fontFamily: "'Poppins',sans-serif",
//                   fontWeight: 700,
//                   fontSize: "clamp(1.5rem,3vw,2.2rem)",
//                   color: "#3B82F6",
//                   margin: "0 0 6px",
//                   lineHeight: 1.1,
//                   letterSpacing: "-0.02em",
//                 }}
//               >
//                 Live Classes
//               </h1>
//               <p className="lc-subtitle">
//                 Join your trainer's live sessions in real-time
//               </p>
//             </div>
//           </div>

//           <div className="lc-stats">
//             {statCards.map((s, i) => (
//               <div key={i} className="lc-stat">
//                 <div
//                   className="lc-stat-icon"
//                   style={{ background: s.bg, color: s.accent }}
//                 >
//                   {s.icon}
//                 </div>
//                 <div>
//                   <div className="lc-stat-val" style={{ color: s.accent }}>
//                     {s.value}
//                   </div>
//                   <div className="lc-stat-lbl">{s.label}</div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* ── Active-meeting-elsewhere banner ── */}
//         {activeMeeting?.role === "student" && minimized && (
//           <div
//             className="lc-panel"
//             style={{
//               padding: "14px 20px",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//               gap: 12,
//               flexWrap: "wrap",
//               border: "1px solid rgba(52,211,153,0.35)",
//               background: dark ? "rgba(52,211,153,0.06)" : "rgba(52,211,153,0.06)",
//             }}
//           >
//             <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//               <span
//                 style={{
//                   width: 8,
//                   height: 8,
//                   borderRadius: "50%",
//                   background: "#34d399",
//                   display: "inline-block",
//                   animation: "lc-blink 1.2s infinite",
//                 }}
//               />
//               <span
//                 style={{
//                   fontSize: 13,
//                   fontWeight: 700,
//                   fontFamily: "'Poppins',sans-serif",
//                 }}
//               >
//                 You have a live meeting running — {activeMeeting.title || "Untitled Session"}
//               </span>
//             </div>
//             <button className="lc-resume-btn" style={{ width: "auto" }} onClick={handleResume}>
//               Resume Meeting
//             </button>
//           </div>
//         )}

//         {/* ── Panel ── */}
//         <div className="lc-panel">
//           <div className="lc-panel-head">
//             <div className="lc-panel-head-left">
//               <div className="lc-panel-icon">
//                 <Radio size={18} />
//               </div>
//               <div>
//                 <p className="lc-panel-title">Live Classes</p>
//                 <p className="lc-panel-sub">
//                   {sessions.length > 0
//                     ? `${sessions.length} session${sessions.length !== 1 ? "s" : ""} available${liveCount > 0 ? ` · ${liveCount} live now` : ""}`
//                     : "Loading sessions..."}
//                 </p>
//               </div>
//             </div>

//             <button
//               className="lc-collapse-btn"
//               onClick={() => setCollapsed((c) => !c)}
//             >
//               {collapsed ? (
//                 <>
//                   <ChevronDown size={13} /> Show
//                 </>
//               ) : (
//                 <>
//                   <ChevronUp size={13} /> Hide
//                 </>
//               )}
//             </button>
//           </div>

//           {!collapsed && (
//             <div className="lc-body">
//               {sessions.length === 0 && (
//                 <div className="lc-empty">
//                   <div className="lc-empty-icon">
//                     <Wifi size={40} />
//                   </div>
//                   No live sessions available
//                   <p className="lc-empty-sub">
//                     Check back later or refresh the page
//                   </p>
//                 </div>
//               )}

//               {sessions.map((s) => {
//                 const isLive = s.isLive || s.status === "LIVE";
//                 const isSelected = selected?.id === s.id;
//                 let cls = "lc-session";
//                 if (isLive && isSelected) cls += " selected-live";
//                 else if (isSelected) cls += " selected-normal";
//                 else if (isLive) cls += " is-live";

//                 return (
//                   <div
//                     key={s.id}
//                     className={cls}
//                     onClick={() => setSelected(s)}
//                   >
//                     <div
//                       className="lc-session-icon"
//                       style={{
//                         background: isLive
//                           ? "rgba(248,113,113,0.12)"
//                           : "rgba(34,211,238,0.10)",
//                         color: isLive
//                           ? "var(--lc-danger)"
//                           : "var(--lc-accent1)",
//                         border: `1px solid ${isLive ? "rgba(248,113,113,0.18)" : "rgba(34,211,238,0.15)"}`,
//                       }}
//                     >
//                       <Radio
//                         size={17}
//                         style={
//                           isLive ? { animation: "lc-blink 1.5s infinite" } : {}
//                         }
//                       />
//                     </div>

//                     <div className="lc-session-info">
//                       <div className="lc-session-title-row">
//                         <span
//                           className="lc-session-title"
//                           style={
//                             isSelected
//                               ? {
//                                   color: isLive
//                                     ? "var(--lc-danger)"
//                                     : "var(--lc-accent1)",
//                                 }
//                               : {}
//                           }
//                         >
//                           {s.title}
//                         </span>
//                         {isLive && (
//                           <span className="lc-live-badge">
//                             <span className="lc-blink" />
//                             LIVE
//                           </span>
//                         )}
//                       </div>
//                       <div className="lc-session-meta">
//                         {s.scheduledDate && (
//                           <span className="lc-session-meta-item">
//                             <Calendar size={11} />
//                             {s.scheduledDate}
//                           </span>
//                         )}
//                         {s.scheduledTime && (
//                           <span className="lc-session-meta-item">
//                             <Clock size={11} />
//                             {s.scheduledTime}
//                           </span>
//                         )}
//                         {s.viewerCount != null && (
//                           <span className="lc-session-meta-item">
//                             <Users size={11} />
//                             {s.viewerCount} watching
//                           </span>
//                         )}
//                       </div>
//                     </div>

//                     {isSelected && (
//                       <div
//                         className="lc-check"
//                         style={{
//                           background: isLive
//                             ? "var(--lc-danger)"
//                             : "var(--lc-accent1)",
//                         }}
//                       >
//                         <svg
//                           width="10"
//                           height="8"
//                           viewBox="0 0 10 8"
//                           fill="none"
//                         >
//                           <path
//                             d="M1 4L3.5 6.5L9 1"
//                             stroke="white"
//                             strokeWidth="1.8"
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                           />
//                         </svg>
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}

//               {selected && (
//                 <>
//                   {hasActiveMeetingForSelected ? (
//                     <button className="lc-resume-btn" onClick={handleResume}>
//                       <span className="lc-join-dot" style={{ background: "#062e21" }} />
//                       Resume Live Session — {selected.title}
//                     </button>
//                   ) : (
//                     <button
//                       className="lc-join-btn"
//                       onClick={handleJoin}
//                       disabled={joining}
//                     >
//                       {joining ? (
//                         <>
//                           <svg
//                             width="16"
//                             height="16"
//                             viewBox="0 0 16 16"
//                             fill="none"
//                             style={{ animation: "lc-spin 0.8s linear infinite" }}
//                           >
//                             <circle
//                               cx="8"
//                               cy="8"
//                               r="6"
//                               stroke="rgba(255,255,255,0.3)"
//                               strokeWidth="2"
//                             />
//                             <path
//                               d="M8 2a6 6 0 016 6"
//                               stroke="white"
//                               strokeWidth="2"
//                               strokeLinecap="round"
//                             />
//                           </svg>
//                           Joining...
//                         </>
//                       ) : (
//                         <>
//                           <span className="lc-join-dot" />
//                           Join Live Session — {selected.title}
//                         </>
//                       )}
//                     </button>
//                   )}
//                 </>
//               )}
//             </div>
//           )}
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
  ChevronDown,
  ChevronUp,
  Radio,
  Users,
  Calendar,
  Clock,
  Wifi,
  TrendingUp,
} from "lucide-react";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

/* ─── Styles ─────────────────────────────────────────────────────── */
/* NOTE: All logic/handlers below are untouched from the original file.
   Only visual tokens (radius, shadow, spacing, hover states, colors)
   were tuned to match the target design (Image 3). */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

  :root {
    --lc-bg:        #f1f5f9;
    --lc-card:      #ffffff;
    --lc-text:      #0f172a;
    --lc-muted:     #64748b;
    --lc-border:    #e2e8f0;
    --lc-accent1:   #22d3ee;
    --lc-accent2:   #fb923c;
    --lc-accent3:   #34d399;
    --lc-accent4:   #a78bfa;
    --lc-danger:    #f87171;
    --lc-shadow:    0 4px 24px rgba(0,0,0,0.06);
    --lc-shadow-lg: 0 8px 40px rgba(0,0,0,0.10);
    --lc-radius:    22px;
  }

  .lc-dark {
    --lc-bg:        #0a0a0a;
    --lc-card:      #111111;
    --lc-text:      #ffffff;
    --lc-muted:     #94a3b8;
    --lc-border:    rgba(255,255,255,0.07);
    --lc-shadow:    0 4px 24px rgba(0,0,0,0.40);
    --lc-shadow-lg: 0 8px 40px rgba(0,0,0,0.60);
  }

  .lc-root {
    font-family: 'Poppins', sans-serif;
    min-height: 100vh;
    background: var(--lc-bg);
    color: var(--lc-text);
    padding: 28px;
    box-sizing: border-box;
    transition: background 0.3s;
  }

  .lc-inner { max-width: 1120px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }

  .lc-header {
    background: var(--lc-card);
    border: 1px solid var(--lc-border);
    border-radius: var(--lc-radius);
    padding: 26px 32px;
    box-shadow: var(--lc-shadow);
    display: flex; align-items: center;
    justify-content: space-between; gap: 20px; flex-wrap: wrap;
  }

  .lc-header-left { display: flex; align-items: center; gap: 16px; }

  .lc-header-icon {
    width: 54px; height: 54px; border-radius: 16px;
    background: linear-gradient(135deg, rgba(248,113,113,0.16), rgba(251,146,60,0.10));
    border: 1px solid rgba(248,113,113,0.20);
    display: flex; align-items: center; justify-content: center;
    color: var(--lc-danger); flex-shrink: 0;
  }

  .lc-badge {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 4px 11px; border-radius: 50px;
    border: 1px solid var(--lc-border);
    background: rgba(248,113,113,0.08);
    color: var(--lc-danger);
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 6px;
  }

  .lc-h1 { font-size: 24px; font-weight: 800; color: var(--lc-text); margin: 0 0 2px; }
  .lc-subtitle { font-size: 13px; color: var(--lc-muted); margin: 0; }

  .lc-stats { display: flex; gap: 12px; flex-wrap: wrap; }

  .lc-stat {
    display: flex; align-items: center; gap: 10px;
    padding: 12px 18px; border-radius: 16px;
    background: var(--lc-bg); border: 1px solid var(--lc-border);
    box-shadow: var(--lc-shadow);
    transition: transform 0.18s ease;
  }
  .lc-stat:hover { transform: translateY(-2px); }

  .lc-stat-icon {
    width: 36px; height: 36px; border-radius: 11px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  .lc-stat-val { font-size: 18px; font-weight: 800; line-height: 1; margin-bottom: 2px; }
  .lc-stat-lbl { font-size: 10px; font-weight: 600; color: var(--lc-muted); text-transform: uppercase; letter-spacing: 0.06em; }

  .lc-panel {
    background: var(--lc-card);
    border: 1px solid var(--lc-border);
    border-radius: var(--lc-radius);
    box-shadow: var(--lc-shadow);
    overflow: hidden;
  }

  .lc-panel-head {
    display: flex; align-items: center; justify-content: space-between;
    padding: 18px 24px;
    background: rgba(248,113,113,0.06);
    border-bottom: 1px solid var(--lc-border);
  }

  .lc-panel-head-left { display: flex; align-items: center; gap: 12px; }

  .lc-panel-icon {
    width: 40px; height: 40px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    background: rgba(248,113,113,0.12);
    border: 1px solid rgba(248,113,113,0.18);
    color: var(--lc-danger); flex-shrink: 0;
  }

  .lc-panel-title { font-size: 14px; font-weight: 700; color: var(--lc-text); margin: 0 0 2px; }
  .lc-panel-sub   { font-size: 11px; color: var(--lc-muted); margin: 0; }

  .lc-collapse-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 14px; border-radius: 11px; border: 1px solid var(--lc-border);
    background: var(--lc-bg); color: var(--lc-muted);
    font-family: 'Poppins', sans-serif;
    font-size: 11px; font-weight: 700;
    cursor: pointer; transition: border-color 0.2s, color 0.2s, transform 0.15s;
    white-space: nowrap;
  }

  .lc-collapse-btn:hover { border-color: rgba(248,113,113,0.30); color: var(--lc-danger); transform: translateY(-1px); }

  .lc-body { padding: 20px; display: flex; flex-direction: column; gap: 12px; }

  .lc-empty {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; padding: 48px 20px; gap: 10px;
    color: var(--lc-muted); font-size: 13px; font-weight: 500; text-align: center;
  }

  .lc-empty-icon { opacity: 0.35; margin-bottom: 4px; }
  .lc-empty-sub  { font-size: 12px; color: var(--lc-muted); margin: 0; }

  .lc-session {
    display: flex; align-items: center; gap: 14px;
    padding: 15px 16px; border-radius: 16px;
    border-left: 3px solid transparent;
    border-top: 1px solid var(--lc-border);
    border-right: 1px solid var(--lc-border);
    border-bottom: 1px solid var(--lc-border);
    cursor: pointer; transition: all 0.18s;
    background: var(--lc-bg);
    position: relative; overflow: hidden;
  }

  .lc-session:hover { border-color: rgba(34,211,238,0.25); background: rgba(34,211,238,0.03); transform: translateY(-1px); }

  .lc-session.selected-normal {
    border-left-color: var(--lc-accent1);
    background: rgba(34,211,238,0.05);
    border-top-color: rgba(34,211,238,0.20);
    border-right-color: rgba(34,211,238,0.20);
    border-bottom-color: rgba(34,211,238,0.20);
  }

  .lc-session.is-live {
    border-left-color: var(--lc-danger);
    background: rgba(248,113,113,0.04);
    border-top-color: rgba(248,113,113,0.12);
    border-right-color: rgba(248,113,113,0.12);
    border-bottom-color: rgba(248,113,113,0.12);
  }

  .lc-session.selected-live {
    border-color: rgba(248,113,113,0.35);
    background: rgba(248,113,113,0.07);
  }

  .lc-session-icon {
    width: 42px; height: 42px; border-radius: 13px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  .lc-session-info { flex: 1; min-width: 0; }

  .lc-session-title-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 4px; }

  .lc-session-title { font-size: 13px; font-weight: 700; color: var(--lc-text); margin: 0; }

  .lc-live-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 3px 8px; border-radius: 6px;
    background: rgba(248,113,113,0.12);
    border: 1px solid rgba(248,113,113,0.18);
    color: var(--lc-danger);
    font-size: 10px; font-weight: 800; letter-spacing: 0.06em;
  }

  .lc-blink { width: 5px; height: 5px; border-radius: 50%; background: var(--lc-danger); animation: lc-blink 1s infinite; }
  @keyframes lc-blink { 0%,100%{opacity:1} 50%{opacity:0.25} }

  .lc-session-meta { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }

  .lc-session-meta-item {
    display: flex; align-items: center; gap: 4px;
    font-size: 11px; color: var(--lc-muted);
  }

  .lc-check {
    width: 20px; height: 20px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  .lc-join-btn {
    display: flex; align-items: center; justify-content: center; gap: 10px;
    width: 100%; padding: 15px 24px; border-radius: 16px; border: none;
    background: var(--lc-danger); color: #fff;
    font-family: 'Poppins', sans-serif;
    font-size: 14px; font-weight: 700;
    cursor: pointer;
    box-shadow: 0 6px 22px rgba(248,113,113,0.32);
    transition: opacity 0.2s, transform 0.2s;
  }

  .lc-join-btn:hover { opacity: 0.9; transform: translateY(-2px); }
  .lc-join-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  .lc-join-dot { width: 8px; height: 8px; border-radius: 50%; background: white; animation: lc-blink 1s infinite; }

  /* ✅ shown on the session list when this student already has an
     active meeting running in the floating widget elsewhere, so they
     can jump back in without re-joining (which would create a second
     LiveKit connection under the same identity and kick themselves out). */
  .lc-resume-btn {
    display: flex; align-items: center; justify-content: center; gap: 10px;
    width: 100%; padding: 15px 24px; border-radius: 16px; border: none;
    background: var(--lc-accent3); color: #062e21;
    font-family: 'Poppins', sans-serif;
    font-size: 14px; font-weight: 700;
    cursor: pointer;
    box-shadow: 0 6px 22px rgba(52,211,153,0.30);
    transition: opacity 0.2s, transform 0.2s;
  }
  .lc-resume-btn:hover { opacity: 0.9; transform: translateY(-2px); }

  @keyframes lc-spin { to { transform: rotate(360deg); } }

  /* ─── RESPONSIVE ────────────────────────────────────────────────── */

  /* Tablet: 481px – 768px */
  @media (max-width: 768px) {
    .lc-root { padding: 16px; }

    .lc-header {
      padding: 20px 20px;
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }

    .lc-header-left { gap: 12px; }

    .lc-header-icon { width: 44px; height: 44px; border-radius: 12px; }

    .lc-stats {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
    }

    .lc-stat {
      padding: 10px 12px;
      border-radius: 12px;
      flex-direction: column;
      align-items: flex-start;
      gap: 6px;
    }

    .lc-stat-icon { width: 30px; height: 30px; border-radius: 8px; }
    .lc-stat-val { font-size: 16px; }

    .lc-panel-head { padding: 14px 16px; flex-wrap: wrap; gap: 10px; }

    .lc-body { padding: 14px; gap: 10px; }

    .lc-session { padding: 12px 12px; gap: 10px; }

    .lc-session-icon { width: 36px; height: 36px; border-radius: 9px; }

    .lc-session-title { font-size: 12px; }

    .lc-join-btn { padding: 13px 20px; font-size: 13px; }
  }

  /* Phone: up to 480px */
  @media (max-width: 480px) {
    .lc-root { padding: 12px; }

    .lc-inner { gap: 14px; }

    .lc-header {
      padding: 16px;
      border-radius: 16px;
      gap: 14px;
    }

    .lc-header-left { gap: 10px; }

    .lc-header-icon { width: 40px; height: 40px; border-radius: 10px; }

    .lc-badge { font-size: 9px; padding: 3px 8px; }

    .lc-subtitle { font-size: 11px; }

    .lc-stats {
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
    }

    .lc-stat {
      padding: 8px 10px;
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
      border-radius: 10px;
    }

    .lc-stat-icon { width: 26px; height: 26px; border-radius: 7px; }
    .lc-stat-val { font-size: 14px; }
    .lc-stat-lbl { font-size: 9px; }

    .lc-panel { border-radius: 16px; }

    .lc-panel-head { padding: 12px 14px; gap: 8px; }

    .lc-panel-icon { width: 32px; height: 32px; border-radius: 8px; }

    .lc-panel-title { font-size: 13px; }
    .lc-panel-sub { font-size: 10px; }

    .lc-collapse-btn { padding: 6px 10px; font-size: 10px; }

    .lc-body { padding: 10px; gap: 8px; }

    .lc-session { padding: 10px 10px; gap: 8px; border-radius: 12px; }

    .lc-session-icon { width: 32px; height: 32px; border-radius: 8px; }

    .lc-session-title { font-size: 12px; }

    .lc-session-meta { gap: 8px; }
    .lc-session-meta-item { font-size: 10px; }

    .lc-live-badge { font-size: 9px; padding: 2px 6px; }

    .lc-check { width: 18px; height: 18px; }

    .lc-join-btn { padding: 12px 16px; font-size: 12px; border-radius: 12px; gap: 8px; }

    .lc-empty { padding: 32px 16px; font-size: 12px; }
  }
`;

if (!document.getElementById("lc-styles")) {
  const tag = document.createElement("style");
  tag.id = "lc-styles";
  tag.textContent = styles;
  document.head.appendChild(tag);
}

const isDark = () =>
  document.documentElement.classList.contains("dark") ||
  document.body.classList.contains("dark") ||
  window.matchMedia("(prefers-color-scheme: dark)").matches;

const LiveClasses = () => {
  const [sessions, setSessions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [joining, setJoining] = useState(false);
  const [dark, setDark] = useState(isDark);

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

  useEffect(() => {
    const obs = new MutationObserver(() => setDark(isDark()));
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    obs.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => obs.disconnect();
  }, []);

  const handleJoin = async () => {
    if (!selected) return;

    // If EXTERNAL session — open meeting link directly, no LiveKit
    // connection to manage at all.
    if (selected.meetingType === "EXTERNAL" && selected.externalMeetingUrl) {
      window.open(selected.externalMeetingUrl, "_blank");
      return;
    }

    try {
      setJoining(true);

      // Real, unique student id (instead of a hardcoded id) so LiveKit
      // does not disconnect any existing connection under the same identity.
      const user = JSON.parse(localStorage.getItem("lms_user") || "{}");
      const studentId = user?.id || user?.studentId;
      if (!studentId) {
        console.error("No student id found in lms_user — cannot join with a unique identity.");
        return;
      }

      const res = await joinLiveSession(selected.id, studentId);

      // Hands the token/room off to the context, which owns the actual
      // LiveKit Room connection at a level above the router so it never
      // gets disconnected by in-app navigation.
      await joinMeeting({
        role: "student",
        sessionId: selected.id,
        roomName: res.data.room,
        token: res.data.token,
        title: selected.title,
      });
    } catch (err) {
      console.error("Join failed", err);
    } finally {
      setJoining(false);
    }
  };

  // Jump back into a meeting that's already running in the floating
  // widget — no new join, just un-minimize.
  const handleResume = () => {
    setMinimized(false);
  };

  const liveCount = sessions.filter(
    (s) => s.isLive || s.status === "LIVE",
  ).length;
  const upcomingCount = sessions.filter(
    (s) => !s.isLive && s.status !== "LIVE",
  ).length;

  const statCards = [
    {
      icon: <Radio size={16} />,
      value: sessions.length,
      label: "Total",
      accent: "var(--lc-accent1)",
      bg: "rgba(34,211,238,0.10)",
    },
    {
      icon: <TrendingUp size={16} />,
      value: liveCount,
      label: "Live Now",
      accent: "var(--lc-danger)",
      bg: "rgba(248,113,113,0.10)",
    },
    {
      icon: <Clock size={16} />,
      value: upcomingCount,
      label: "Upcoming",
      accent: "var(--lc-accent2)",
      bg: "rgba(251,146,60,0.10)",
    },
  ];

  // This student already has an active meeting running (owned by the
  // context / floating widget). If it's for THIS same session and it's
  // currently minimized, show "Resume" instead of trying to join again.
  const hasActiveMeetingForSelected =
    activeMeeting?.role === "student" &&
    selected &&
    activeMeeting.sessionId === selected.id;

  // Full-screen meeting view — only render LiveRoom when the active
  // meeting belongs to this student flow AND it isn't minimized.
  if (activeMeeting?.role === "student" && !minimized) {
    return (
      <LiveRoom
        sessionId={activeMeeting.sessionId}
        roomName={activeMeeting.roomName}
        joinedAt={activeMeeting.joinedAt}
        onSessionEnded={() => {}}
        onLeave={() => {}}
      />
    );
  }

  return (
    <div className={`lc-root${dark ? " lc-dark" : ""}`}>
      <div className="lc-inner">
        {/* ── Header ── */}
        <div className="lc-header">
          <div className="lc-header-left">
            <div className="lc-header-icon">
              <Radio size={24} />
            </div>
            <div>
              <div className="lc-badge">
                <Radio size={10} /> Live & Recorded
              </div>
              <h1
                style={{
                  fontFamily: "'Poppins',sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(1.5rem,3vw,2.2rem)",
                  color: "#3B82F6",
                  margin: "0 0 6px",
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                }}
              >
                Live Classes
              </h1>
              <p className="lc-subtitle">
                Join your trainer's live sessions in real-time
              </p>
            </div>
          </div>

          <div className="lc-stats">
            {statCards.map((s, i) => (
              <div key={i} className="lc-stat">
                <div
                  className="lc-stat-icon"
                  style={{ background: s.bg, color: s.accent }}
                >
                  {s.icon}
                </div>
                <div>
                  <div className="lc-stat-val" style={{ color: s.accent }}>
                    {s.value}
                  </div>
                  <div className="lc-stat-lbl">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Active-meeting-elsewhere banner ── */}
        {activeMeeting?.role === "student" && minimized && (
          <div
            className="lc-panel"
            style={{
              padding: "14px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
              border: "1px solid rgba(52,211,153,0.35)",
              background: dark ? "rgba(52,211,153,0.06)" : "rgba(52,211,153,0.06)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#34d399",
                  display: "inline-block",
                  animation: "lc-blink 1.2s infinite",
                }}
              />
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  fontFamily: "'Poppins',sans-serif",
                }}
              >
                You have a live meeting running — {activeMeeting.title || "Untitled Session"}
              </span>
            </div>
            <button className="lc-resume-btn" style={{ width: "auto" }} onClick={handleResume}>
              Resume Meeting
            </button>
          </div>
        )}

        {/* ── Panel ── */}
        <div className="lc-panel">
          <div className="lc-panel-head">
            <div className="lc-panel-head-left">
              <div className="lc-panel-icon">
                <Radio size={18} />
              </div>
              <div>
                <p className="lc-panel-title">Live Classes</p>
                <p className="lc-panel-sub">
                  {sessions.length > 0
                    ? `${sessions.length} session${sessions.length !== 1 ? "s" : ""} available${liveCount > 0 ? ` · ${liveCount} live now` : ""}`
                    : "Loading sessions..."}
                </p>
              </div>
            </div>

            <button
              className="lc-collapse-btn"
              onClick={() => setCollapsed((c) => !c)}
            >
              {collapsed ? (
                <>
                  <ChevronDown size={13} /> Show
                </>
              ) : (
                <>
                  <ChevronUp size={13} /> Hide
                </>
              )}
            </button>
          </div>

          {!collapsed && (
            <div className="lc-body">
              {sessions.length === 0 && (
                <div className="lc-empty">
                  <div className="lc-empty-icon">
                    <Wifi size={40} />
                  </div>
                  No live sessions available
                  <p className="lc-empty-sub">
                    Check back later or refresh the page
                  </p>
                </div>
              )}

              {sessions.map((s) => {
                const isLive = s.isLive || s.status === "LIVE";
                const isSelected = selected?.id === s.id;
                let cls = "lc-session";
                if (isLive && isSelected) cls += " selected-live";
                else if (isSelected) cls += " selected-normal";
                else if (isLive) cls += " is-live";

                return (
                  <div
                    key={s.id}
                    className={cls}
                    onClick={() => setSelected(s)}
                  >
                    <div
                      className="lc-session-icon"
                      style={{
                        background: isLive
                          ? "rgba(248,113,113,0.12)"
                          : "rgba(34,211,238,0.10)",
                        color: isLive
                          ? "var(--lc-danger)"
                          : "var(--lc-accent1)",
                        border: `1px solid ${isLive ? "rgba(248,113,113,0.18)" : "rgba(34,211,238,0.15)"}`,
                      }}
                    >
                      <Radio
                        size={17}
                        style={
                          isLive ? { animation: "lc-blink 1.5s infinite" } : {}
                        }
                      />
                    </div>

                    <div className="lc-session-info">
                      <div className="lc-session-title-row">
                        <span
                          className="lc-session-title"
                          style={
                            isSelected
                              ? {
                                  color: isLive
                                    ? "var(--lc-danger)"
                                    : "var(--lc-accent1)",
                                }
                              : {}
                          }
                        >
                          {s.title}
                        </span>
                        {isLive && (
                          <span className="lc-live-badge">
                            <span className="lc-blink" />
                            LIVE
                          </span>
                        )}
                      </div>
                      <div className="lc-session-meta">
                        {s.scheduledDate && (
                          <span className="lc-session-meta-item">
                            <Calendar size={11} />
                            {s.scheduledDate}
                          </span>
                        )}
                        {s.scheduledTime && (
                          <span className="lc-session-meta-item">
                            <Clock size={11} />
                            {s.scheduledTime}
                          </span>
                        )}
                        {s.viewerCount != null && (
                          <span className="lc-session-meta-item">
                            <Users size={11} />
                            {s.viewerCount} watching
                          </span>
                        )}
                      </div>
                    </div>

                    {isSelected && (
                      <div
                        className="lc-check"
                        style={{
                          background: isLive
                            ? "var(--lc-danger)"
                            : "var(--lc-accent1)",
                        }}
                      >
                        <svg
                          width="10"
                          height="8"
                          viewBox="0 0 10 8"
                          fill="none"
                        >
                          <path
                            d="M1 4L3.5 6.5L9 1"
                            stroke="white"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                );
              })}

              {selected && (
                <>
                  {hasActiveMeetingForSelected ? (
                    <button className="lc-resume-btn" onClick={handleResume}>
                      <span className="lc-join-dot" style={{ background: "#062e21" }} />
                      Resume Live Session — {selected.title}
                    </button>
                  ) : (
                    <button
                      className="lc-join-btn"
                      onClick={handleJoin}
                      disabled={joining}
                    >
                      {joining ? (
                        <>
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            style={{ animation: "lc-spin 0.8s linear infinite" }}
                          >
                            <circle
                              cx="8"
                              cy="8"
                              r="6"
                              stroke="rgba(255,255,255,0.3)"
                              strokeWidth="2"
                            />
                            <path
                              d="M8 2a6 6 0 016 6"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                          Joining...
                        </>
                      ) : (
                        <>
                          <span className="lc-join-dot" />
                          Join Live Session — {selected.title}
                        </>
                      )}
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveClasses;