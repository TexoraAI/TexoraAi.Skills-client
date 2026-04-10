// import React, { useState, useEffect } from "react";
// import { getStudentClassroom } from "@/services/batchService";
// import {
//   getLiveSessionsByBatch,
//   joinLiveSession,
// } from "@/services/liveSessionService";
// import LiveRoom from "@/components/live/LiveRoom";
// import {
//   ChevronDown, ChevronUp, Radio, Users,
//   Calendar, Clock, Wifi, TrendingUp,
// } from "lucide-react";

// const LiveClasses = () => {
//   const [sessions, setSessions]   = useState([]);
//   const [selected, setSelected]   = useState(null);
//   const [token, setToken]         = useState(null);
//   const [room, setRoom]           = useState(null);
//   const [collapsed, setCollapsed] = useState(false);
//   const [joining, setJoining]     = useState(false);

//   /* ================= LOAD LIVE SESSIONS ================= */
//   useEffect(() => {
//     const loadLive = async () => {
//       try {
//         const response  = await getStudentClassroom();
//         const classroom = response.data;
//         console.log("CLASSROOM:", classroom);

//         const batchId = classroom.batchId;
//         console.log("BATCH ID:", batchId);

//         if (!batchId) { console.warn("No batch assigned"); return; }

//         const res = await getLiveSessionsByBatch(batchId);
//         console.log("LIVE SESSIONS:", res.data);
//         setSessions(res.data || []);
//       } catch (err) {
//         console.error("Live fetch failed", err);
//       }
//     };
//     loadLive();
//   }, []);

//   /* ================= JOIN LIVE SESSION ================= */
//   const handleJoin = async () => {
//     try {
//       if (!selected) return;
//       setJoining(true);
//       const studentId = 1; // ⚠️ later from JWT
//       const res = await joinLiveSession(selected.id, studentId);
//       console.log("JOIN RESPONSE:", res.data);
//       setToken(res.data.token);
//       setRoom(res.data.room);
//     } catch (err) {
//       console.error("Join failed", err);
//     } finally {
//       setJoining(false);
//     }
//   };

//   /* ================= IF JOINED → LIVE ROOM ================= */
//   if (token) {
//     return <LiveRoom token={token} roomName={room} />;
//   }

//   /* ================= DERIVED STATS ================= */
//   const liveCount     = sessions.filter((s) => s.isLive || s.status === "LIVE").length;
//   const upcomingCount = sessions.filter((s) => !s.isLive && s.status !== "LIVE").length;

//   /* ============================================================
//      RENDER
//   ============================================================ */
//   return (
//     <div className="min-h-screen bg-slate-100 dark:bg-[#0f1b38] px-6 py-7">

//       {/* ===== PAGE TITLE ===== */}
//       <div className="max-w-5xl mx-auto mb-6">
//         <div className="flex items-center gap-2 mb-1">
//           <div className="p-2 rounded-lg"
//             style={{ background: "linear-gradient(135deg,#1e3a8a,#1d4ed8)" }}>
//             <Radio className="h-4 w-4 text-white" />
//           </div>
//           <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
//             Live & Recorded
//           </span>
//         </div>
//         <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Live Classes</h1>
//         <p className="text-sm text-slate-500 dark:text-slate-400">
//           Join your trainer's live sessions in real-time
//         </p>
//       </div>

//       {/* ===== STAT CARDS ===== */}
//       <div className="max-w-5xl mx-auto grid grid-cols-3 gap-4 mb-6">
//         {[
//           { icon: <Radio size={18} />,       value: sessions.length, label: "Total Sessions", style: "linear-gradient(135deg,#1e3a8a,#2563eb)" },
//           { icon: <TrendingUp size={18} />,  value: liveCount,       label: "Live Now",       style: "linear-gradient(135deg,#991b1b,#ef4444)" },
//           { icon: <Clock size={18} />,       value: upcomingCount,   label: "Upcoming",       style: "linear-gradient(135deg,#0369a1,#0ea5e9)" },
//         ].map((s, i) => (
//           <div key={i} className="rounded-xl px-5 py-4 flex flex-col gap-1 text-white shadow-md"
//             style={{ background: s.style }}>
//             <span className="text-white/70">{s.icon}</span>
//             <span className="text-2xl font-extrabold">{s.value}</span>
//             <span className="text-xs text-white/65 uppercase tracking-widest font-semibold">{s.label}</span>
//           </div>
//         ))}
//       </div>

//       {/* ===== MAIN PANEL ===== */}
//       <div className="max-w-5xl mx-auto rounded-2xl border border-slate-200 dark:border-white/10
//                       bg-white dark:bg-[#162040] shadow-sm overflow-hidden">

//         {/* Panel header with collapse toggle */}
//         <div
//           className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-white/10"
//           style={{ background: "linear-gradient(135deg,#1e3a8a,#1d4ed8)" }}
//         >
//           <div className="flex items-center gap-3">
//             <div className="p-2 rounded-xl bg-white/20 backdrop-blur">
//               <Radio className="w-4 h-4 text-white" />
//             </div>
//             <div>
//               <p className="text-sm font-bold text-white">Live Classes</p>
//               <p className="text-[11px] text-white/65">
//                 {sessions.length > 0
//                   ? `${sessions.length} session${sessions.length !== 1 ? "s" : ""} available${liveCount > 0 ? ` · ${liveCount} live now` : ""}`
//                   : "Loading sessions..."}
//               </p>
//             </div>
//           </div>

//           {/* CRM-style collapse button */}
//           <button
//             onClick={() => setCollapsed((c) => !c)}
//             className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold
//                        bg-white/15 hover:bg-white/25 text-white border border-white/20
//                        transition select-none"
//           >
//             {collapsed
//               ? <><ChevronDown className="w-3.5 h-3.5" /> Show</>
//               : <><ChevronUp className="w-3.5 h-3.5" /> Hide</>
//             }
//           </button>
//         </div>

//         {/* ===== COLLAPSIBLE CONTENT ===== */}
//         {!collapsed && (
//           <div className="p-4">

//             {/* Empty state */}
//             {sessions.length === 0 && (
//               <div className="flex flex-col items-center justify-center py-14 gap-3 opacity-50">
//                 <Wifi className="w-10 h-10 text-slate-300 dark:text-slate-600" />
//                 <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
//                   No live sessions available
//                 </p>
//                 <p className="text-xs text-slate-400">Check back later or refresh the page</p>
//               </div>
//             )}

//             {/* Session list */}
//             <div className="space-y-2 mb-4">
//               {sessions.map((s) => {
//                 const isLive     = s.isLive || s.status === "LIVE";
//                 const isSelected = selected?.id === s.id;

//                 return (
//                   <div
//                     key={s.id}
//                     onClick={() => setSelected(s)}
//                     className={`relative flex items-center gap-4 px-4 py-3.5 rounded-xl cursor-pointer
//                                 border transition-all duration-200 overflow-hidden
//                       ${isSelected
//                         ? isLive
//                           ? "border-red-400 dark:border-red-500/60 bg-red-50 dark:bg-red-900/15 shadow-md"
//                           : "border-blue-400 dark:border-blue-500/60 bg-blue-50 dark:bg-blue-900/15 shadow-md"
//                         : isLive
//                           ? "border-red-200 dark:border-red-900/40 bg-red-50/50 dark:bg-red-900/10 hover:border-red-300 dark:hover:border-red-700/50"
//                           : "border-slate-100 dark:border-white/8 bg-slate-50 dark:bg-white/3 hover:border-blue-200 dark:hover:border-blue-700/40 hover:bg-blue-50/30 dark:hover:bg-white/5"
//                       }`}
//                   >
//                     {/* Left accent bar */}
//                     <div
//                       className="absolute left-0 top-0 bottom-0 w-1 rounded-r"
//                       style={{
//                         background: isSelected
//                           ? isLive ? "linear-gradient(180deg,#ef4444,#f97316)" : "linear-gradient(180deg,#1d4ed8,#7c3aed)"
//                           : isLive ? "#fecaca" : "#e2e8f0",
//                       }}
//                     />

//                     {/* Icon */}
//                     <div
//                       className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
//                       style={{
//                         background: isLive
//                           ? "linear-gradient(135deg,#fee2e2,#fecaca)"
//                           : "linear-gradient(135deg,#ede9fe,#ddd6fe)",
//                         boxShadow: isLive && isSelected ? "0 0 0 3px rgba(239,68,68,0.2)" : undefined,
//                       }}
//                     >
//                       <Radio
//                         size={16}
//                         color={isLive ? "#ef4444" : "#7c3aed"}
//                         style={isLive ? { animation: "lc-pulse 1.5s ease-in-out infinite" } : {}}
//                       />
//                     </div>

//                     {/* Info */}
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center gap-2 flex-wrap">
//                         <span className={`text-sm font-bold truncate
//                           ${isSelected
//                             ? isLive ? "text-red-700 dark:text-red-400" : "text-blue-700 dark:text-blue-400"
//                             : "text-slate-800 dark:text-slate-100"
//                           }`}>
//                           {s.title}
//                         </span>

//                         {isLive && (
//                           <span className="flex items-center gap-1 px-2 py-0.5 rounded-md
//                                            bg-red-100 dark:bg-red-900/40
//                                            text-red-600 dark:text-red-400
//                                            text-[10px] font-extrabold tracking-widest uppercase">
//                             <span className="w-1.5 h-1.5 rounded-full bg-red-500"
//                               style={{ animation: "lc-blink 1s infinite" }} />
//                             LIVE
//                           </span>
//                         )}
//                       </div>

//                       <div className="flex items-center gap-3 mt-1 flex-wrap">
//                         {s.date && (
//                           <span className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
//                             <Calendar size={10} /> {s.date}
//                           </span>
//                         )}
//                         {s.time && (
//                           <span className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
//                             <Clock size={10} /> {s.time}
//                           </span>
//                         )}
//                         {s.viewers != null && (
//                           <span className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
//                             <Users size={10} /> {s.viewers} watching
//                           </span>
//                         )}
//                       </div>
//                     </div>

//                     {/* Selection checkmark */}
//                     {isSelected && (
//                       <div
//                         className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
//                         style={{ background: isLive ? "#ef4444" : "#1d4ed8" }}
//                       >
//                         <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
//                           <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
//                         </svg>
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>

//             {/* ===== JOIN BUTTON ===== */}
//             {selected && (
//               <button
//                 onClick={handleJoin}
//                 disabled={joining}
//                 className="w-full flex items-center justify-center gap-2.5
//                            px-4 py-3.5 rounded-xl text-sm font-bold text-white
//                            shadow-lg transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
//                 style={{ background: "linear-gradient(135deg,#ef4444,#f97316)" }}
//               >
//                 {joining ? (
//                   <>
//                     <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
//                       style={{ animation: "lc-spin 0.8s linear infinite" }}>
//                       <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
//                       <path d="M8 2a6 6 0 016 6" stroke="white" strokeWidth="2" strokeLinecap="round" />
//                     </svg>
//                     Joining...
//                   </>
//                 ) : (
//                   <>
//                     <span className="w-2 h-2 rounded-full bg-white"
//                       style={{ animation: "lc-blink 1s infinite" }} />
//                     Join Live Session — {selected.title}
//                   </>
//                 )}
//               </button>
//             )}
//           </div>
//         )}
//       </div>

//       {/* ===== KEYFRAMES ===== */}
//       <style>{`
//         @keyframes lc-blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
//         @keyframes lc-spin  { to{transform:rotate(360deg)} }
//         @keyframes lc-pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
//       `}</style>
//     </div>
//   );
// };

// export default LiveClasses;






























import React, { useState, useEffect } from "react";
import { getStudentClassroom } from "@/services/batchService";
import { getLiveSessionsByBatch, joinLiveSession } from "@/services/liveSessionService";
import LiveRoom from "@/components/live/LiveRoom";
import { ChevronDown, ChevronUp, Radio, Users, Calendar, Clock, Wifi, TrendingUp } from "lucide-react";

/* ─── Styles ─────────────────────────────────────────────────────── */
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
    --lc-radius:    20px;
  }

  .lc-dark {
    --lc-bg:        #0a0a0a;
    --lc-card:      #111111;
    --lc-text:      #ffffff;
    --lc-muted:     #94a3b8;
    --lc-border:    rgba(255,255,255,0.06);
    --lc-shadow:    0 4px 24px rgba(0,0,0,0.40);
    --lc-shadow-lg: 0 8px 40px rgba(0,0,0,0.60);
  }

  .lc-root {
    font-family: 'Poppins', sans-serif;
    min-height: 100vh;
    background: var(--lc-bg);
    color: var(--lc-text);
    padding: 24px;
    box-sizing: border-box;
    transition: background 0.3s;
  }

  .lc-inner { max-width: 1100px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }

  /* ── Header ── */
  .lc-header {
    background: var(--lc-card);
    border: 1px solid var(--lc-border);
    border-radius: var(--lc-radius);
    padding: 28px 32px;
    box-shadow: var(--lc-shadow);
    display: flex; align-items: center;
    justify-content: space-between; gap: 20px; flex-wrap: wrap;
  }

  .lc-header-left { display: flex; align-items: center; gap: 16px; }

  .lc-header-icon {
    width: 52px; height: 52px; border-radius: 14px;
    background: rgba(248,113,113,0.10);
    border: 1px solid rgba(248,113,113,0.18);
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

  /* ── Stats ── */
  .lc-stats { display: flex; gap: 12px; flex-wrap: wrap; }

  .lc-stat {
    display: flex; align-items: center; gap: 10px;
    padding: 12px 18px; border-radius: 14px;
    background: var(--lc-bg); border: 1px solid var(--lc-border);
    box-shadow: var(--lc-shadow);
  }

  .lc-stat-icon {
    width: 36px; height: 36px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  .lc-stat-val { font-size: 18px; font-weight: 800; line-height: 1; margin-bottom: 2px; }
  .lc-stat-lbl { font-size: 10px; font-weight: 600; color: var(--lc-muted); text-transform: uppercase; letter-spacing: 0.06em; }

  /* ── Panel card ── */
  .lc-panel {
    background: var(--lc-card);
    border: 1px solid var(--lc-border);
    border-radius: var(--lc-radius);
    box-shadow: var(--lc-shadow);
    overflow: hidden;
  }

  .lc-panel-head {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 24px;
    background: rgba(248,113,113,0.06);
    border-bottom: 1px solid var(--lc-border);
  }

  .lc-panel-head-left { display: flex; align-items: center; gap: 12px; }

  .lc-panel-icon {
    width: 38px; height: 38px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    background: rgba(248,113,113,0.12);
    border: 1px solid rgba(248,113,113,0.18);
    color: var(--lc-danger); flex-shrink: 0;
  }

  .lc-panel-title { font-size: 14px; font-weight: 700; color: var(--lc-text); margin: 0 0 2px; }
  .lc-panel-sub   { font-size: 11px; color: var(--lc-muted); margin: 0; }

  .lc-collapse-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 7px 14px; border-radius: 10px; border: 1px solid var(--lc-border);
    background: var(--lc-bg); color: var(--lc-muted);
    font-family: 'Poppins', sans-serif;
    font-size: 11px; font-weight: 700;
    cursor: pointer; transition: border-color 0.2s, color 0.2s;
  }

  .lc-collapse-btn:hover { border-color: rgba(248,113,113,0.30); color: var(--lc-danger); }

  /* ── Body ── */
  .lc-body { padding: 20px; display: flex; flex-direction: column; gap: 12px; }

  /* ── Empty ── */
  .lc-empty {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; padding: 48px 20px; gap: 10px;
    color: var(--lc-muted); font-size: 13px; font-weight: 500; text-align: center;
  }

  .lc-empty-icon { opacity: 0.35; margin-bottom: 4px; }
  .lc-empty-sub  { font-size: 12px; color: var(--lc-muted); margin: 0; }

  /* ── Session item ── */
  .lc-session {
    display: flex; align-items: center; gap: 14px;
    padding: 14px 16px; border-radius: 14px;
    border-left: 3px solid transparent;
    border-top: 1px solid var(--lc-border);
    border-right: 1px solid var(--lc-border);
    border-bottom: 1px solid var(--lc-border);
    cursor: pointer; transition: all 0.18s;
    background: var(--lc-bg);
    position: relative; overflow: hidden;
  }

  .lc-session:hover { border-color: rgba(34,211,238,0.25); background: rgba(34,211,238,0.03); }

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
    width: 40px; height: 40px; border-radius: 11px;
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

  /* ── Join button ── */
  .lc-join-btn {
    display: flex; align-items: center; justify-content: center; gap: 10px;
    width: 100%; padding: 14px 24px; border-radius: 14px; border: none;
    background: var(--lc-danger); color: #fff;
    font-family: 'Poppins', sans-serif;
    font-size: 14px; font-weight: 700;
    cursor: pointer;
    box-shadow: 0 4px 20px rgba(248,113,113,0.30);
    transition: opacity 0.2s, transform 0.2s;
  }

  .lc-join-btn:hover { opacity: 0.87; transform: translateY(-1px); }
  .lc-join-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  .lc-join-dot { width: 8px; height: 8px; border-radius: 50%; background: white; animation: lc-blink 1s infinite; }

  @keyframes lc-spin { to { transform: rotate(360deg); } }
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
  const [sessions, setSessions]   = useState([]);
  const [selected, setSelected]   = useState(null);
  const [token, setToken]         = useState(null);
  const [room, setRoom]           = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [joining, setJoining]     = useState(false);
  const [dark, setDark]           = useState(isDark);

  useEffect(() => {
    const loadLive = async () => {
      try {
        const response  = await getStudentClassroom();
        const classroom = response.data;
        const batchId   = classroom.batchId;
        if (!batchId) { console.warn("No batch assigned"); return; }
        const res = await getLiveSessionsByBatch(batchId);
        setSessions(res.data || []);
      } catch (err) { console.error("Live fetch failed", err); }
    };
    loadLive();
  }, []);

  useEffect(() => {
    const obs = new MutationObserver(() => setDark(isDark()));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    obs.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  const handleJoin = async () => {
    try {
      if (!selected) return;
      setJoining(true);
      const studentId = 1;
      const res = await joinLiveSession(selected.id, studentId);
      setToken(res.data.token);
      setRoom(res.data.room);
    } catch (err) { console.error("Join failed", err); }
    finally { setJoining(false); }
  };

  if (token) return <LiveRoom token={token} roomName={room} />;

  const liveCount     = sessions.filter((s) => s.isLive || s.status === "LIVE").length;
  const upcomingCount = sessions.filter((s) => !s.isLive && s.status !== "LIVE").length;

  const statCards = [
    { icon: <Radio size={16} />,      value: sessions.length, label: "Total",    accent: "var(--lc-accent1)", bg: "rgba(34,211,238,0.10)" },
    { icon: <TrendingUp size={16} />, value: liveCount,       label: "Live Now", accent: "var(--lc-danger)",  bg: "rgba(248,113,113,0.10)" },
    { icon: <Clock size={16} />,      value: upcomingCount,   label: "Upcoming", accent: "var(--lc-accent2)", bg: "rgba(251,146,60,0.10)" },
  ];

  return (
    <div className={`lc-root${dark ? " lc-dark" : ""}`}>
      <div className="lc-inner">

        {/* ── Header ── */}
        <div className="lc-header">
          <div className="lc-header-left">
            <div className="lc-header-icon"><Radio size={24} /></div>
            <div>
              <div className="lc-badge"><Radio size={10} /> Live & Recorded</div>
              <h1 className="lc-h1">Live Classes</h1>
              <p className="lc-subtitle">Join your trainer's live sessions in real-time</p>
            </div>
          </div>

          <div className="lc-stats">
            {statCards.map((s, i) => (
              <div key={i} className="lc-stat">
                <div className="lc-stat-icon" style={{ background: s.bg, color: s.accent }}>{s.icon}</div>
                <div>
                  <div className="lc-stat-val" style={{ color: s.accent }}>{s.value}</div>
                  <div className="lc-stat-lbl">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Panel ── */}
        <div className="lc-panel">
          <div className="lc-panel-head">
            <div className="lc-panel-head-left">
              <div className="lc-panel-icon"><Radio size={18} /></div>
              <div>
                <p className="lc-panel-title">Live Classes</p>
                <p className="lc-panel-sub">
                  {sessions.length > 0
                    ? `${sessions.length} session${sessions.length !== 1 ? "s" : ""} available${liveCount > 0 ? ` · ${liveCount} live now` : ""}`
                    : "Loading sessions..."}
                </p>
              </div>
            </div>

            <button className="lc-collapse-btn" onClick={() => setCollapsed(c => !c)}>
              {collapsed
                ? <><ChevronDown size={13} /> Show</>
                : <><ChevronUp size={13} /> Hide</>
              }
            </button>
          </div>

          {!collapsed && (
            <div className="lc-body">
              {sessions.length === 0 && (
                <div className="lc-empty">
                  <div className="lc-empty-icon"><Wifi size={40} /></div>
                  No live sessions available
                  <p className="lc-empty-sub">Check back later or refresh the page</p>
                </div>
              )}

              {sessions.map((s) => {
                const isLive     = s.isLive || s.status === "LIVE";
                const isSelected = selected?.id === s.id;
                let cls = "lc-session";
                if (isLive && isSelected) cls += " selected-live";
                else if (isSelected)      cls += " selected-normal";
                else if (isLive)          cls += " is-live";

                return (
                  <div key={s.id} className={cls} onClick={() => setSelected(s)}>
                    <div
                      className="lc-session-icon"
                      style={{
                        background: isLive ? "rgba(248,113,113,0.12)" : "rgba(34,211,238,0.10)",
                        color: isLive ? "var(--lc-danger)" : "var(--lc-accent1)",
                        border: `1px solid ${isLive ? "rgba(248,113,113,0.18)" : "rgba(34,211,238,0.15)"}`,
                      }}
                    >
                      <Radio size={17} style={isLive ? { animation: "lc-blink 1.5s infinite" } : {}} />
                    </div>

                    <div className="lc-session-info">
                      <div className="lc-session-title-row">
                        <span
                          className="lc-session-title"
                          style={isSelected ? { color: isLive ? "var(--lc-danger)" : "var(--lc-accent1)" } : {}}
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
                        {s.date && <span className="lc-session-meta-item"><Calendar size={11} />{s.date}</span>}
                        {s.time && <span className="lc-session-meta-item"><Clock size={11} />{s.time}</span>}
                        {s.viewers != null && <span className="lc-session-meta-item"><Users size={11} />{s.viewers} watching</span>}
                      </div>
                    </div>

                    {isSelected && (
                      <div
                        className="lc-check"
                        style={{ background: isLive ? "var(--lc-danger)" : "var(--lc-accent1)" }}
                      >
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    )}
                  </div>
                );
              })}

              {selected && (
                <button className="lc-join-btn" onClick={handleJoin} disabled={joining}>
                  {joining ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ animation: "lc-spin 0.8s linear infinite" }}>
                        <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                        <path d="M8 2a6 6 0 016 6" stroke="white" strokeWidth="2" strokeLinecap="round" />
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
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default LiveClasses;