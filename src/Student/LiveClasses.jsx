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

// export default LiveClasses;old shareef




















// import React, { useState, useEffect } from "react";
// import { getStudentClassroom } from "@/services/batchService";
// import {
//   getLiveSessionsByBatch,
//   joinLiveSession,
//   deleteLiveSession,
// } from "@/services/liveSessionService";
// import LiveRoom from "@/components/live/LiveRoom";
// import {
//   Radio, Users, Calendar, Clock, Wifi,
//   Trash2, Play, ChevronRight, Signal,
//   Zap, X, AlertTriangle,
// } from "lucide-react";

// /* ─── Delete Confirmation Modal ─── */
// const DeleteModal = ({ session, onConfirm, onCancel, deleting }) => (
//   <div style={{
//     position: "fixed", inset: 0, zIndex: 99999,
//     background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)",
//     display: "flex", alignItems: "center", justifyContent: "center",
//     padding: "20px",
//   }}>
//     <div style={{
//       background: "linear-gradient(145deg,#0f172a,#1e293b)",
//       border: "1px solid rgba(239,68,68,0.3)",
//       borderRadius: 20, padding: "32px 28px", maxWidth: 400, width: "100%",
//       boxShadow: "0 25px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)",
//     }}>
//       {/* Icon */}
//       <div style={{
//         width: 56, height: 56, borderRadius: "50%", marginBottom: 20,
//         background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)",
//         display: "flex", alignItems: "center", justifyContent: "center",
//       }}>
//         <AlertTriangle size={24} color="#ef4444" />
//       </div>

//       <h3 style={{ fontSize: 18, fontWeight: 700, color: "#f1f5f9", margin: "0 0 8px" }}>
//         Delete Session
//       </h3>
//       <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 6px", lineHeight: 1.6 }}>
//         Are you sure you want to delete
//       </p>
//       <p style={{
//         fontSize: 14, fontWeight: 700, color: "#e2e8f0",
//         margin: "0 0 24px", padding: "10px 14px", borderRadius: 10,
//         background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
//       }}>
//         "{session.title}"
//       </p>
//       <p style={{ fontSize: 12, color: "#475569", margin: "0 0 28px" }}>
//         This action cannot be undone.
//       </p>

//       <div style={{ display: "flex", gap: 10 }}>
//         <button
//           onClick={onCancel}
//           disabled={deleting}
//           style={{
//             flex: 1, padding: "11px 0", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)",
//             background: "rgba(255,255,255,0.05)", color: "#94a3b8",
//             fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
//             transition: "all .15s",
//           }}
//         >
//           Cancel
//         </button>
//         <button
//           onClick={onConfirm}
//           disabled={deleting}
//           style={{
//             flex: 1, padding: "11px 0", borderRadius: 12, border: "none",
//             background: deleting ? "rgba(239,68,68,0.4)" : "linear-gradient(135deg,#dc2626,#ef4444)",
//             color: "#fff", fontSize: 13, fontWeight: 700, cursor: deleting ? "not-allowed" : "pointer",
//             fontFamily: "inherit", display: "flex", alignItems: "center",
//             justifyContent: "center", gap: 8, transition: "all .15s",
//           }}
//         >
//           {deleting ? (
//             <>
//               <svg width="14" height="14" viewBox="0 0 16 16" fill="none"
//                 style={{ animation: "lc-spin 0.8s linear infinite" }}>
//                 <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
//                 <path d="M8 2a6 6 0 016 6" stroke="white" strokeWidth="2" strokeLinecap="round" />
//               </svg>
//               Deleting…
//             </>
//           ) : (
//             <><Trash2 size={14} /> Delete</>
//           )}
//         </button>
//       </div>
//     </div>
//   </div>
// );

// /* ─── Session Card ─── */
// const SessionCard = ({ s, isSelected, onSelect, onDelete }) => {
//   const isLive = s.isLive || s.status === "LIVE";
//   const [hovered, setHovered] = useState(false);

//   return (
//     <div
//       onMouseEnter={() => setHovered(true)}
//       onMouseLeave={() => setHovered(false)}
//       style={{
//         position: "relative", borderRadius: 16, cursor: "pointer",
//         border: isSelected
//           ? isLive ? "1.5px solid rgba(239,68,68,0.6)" : "1.5px solid rgba(59,130,246,0.6)"
//           : hovered ? "1.5px solid rgba(255,255,255,0.12)" : "1.5px solid rgba(255,255,255,0.06)",
//         background: isSelected
//           ? isLive
//             ? "linear-gradient(135deg,rgba(239,68,68,0.08),rgba(239,68,68,0.04))"
//             : "linear-gradient(135deg,rgba(59,130,246,0.1),rgba(59,130,246,0.04))"
//           : hovered
//             ? "rgba(255,255,255,0.04)"
//             : "rgba(255,255,255,0.02)",
//         boxShadow: isSelected
//           ? isLive
//             ? "0 0 0 4px rgba(239,68,68,0.08), 0 4px 20px rgba(0,0,0,0.3)"
//             : "0 0 0 4px rgba(59,130,246,0.08), 0 4px 20px rgba(0,0,0,0.3)"
//           : "none",
//         transition: "all 0.2s ease",
//         overflow: "hidden",
//       }}
//       onClick={() => onSelect(s)}
//     >
//       {/* Live glow strip */}
//       {isLive && (
//         <div style={{
//           position: "absolute", top: 0, left: 0, right: 0, height: 2,
//           background: "linear-gradient(90deg,transparent,#ef4444,transparent)",
//           animation: "lc-glow 2s ease-in-out infinite",
//         }} />
//       )}

//       <div style={{
//         display: "flex", alignItems: "center", gap: 14,
//         padding: "16px 18px",
//       }}>
//         {/* Icon */}
//         <div style={{
//           width: 44, height: 44, borderRadius: 13, flexShrink: 0,
//           display: "flex", alignItems: "center", justifyContent: "center",
//           background: isLive
//             ? "linear-gradient(135deg,rgba(239,68,68,0.2),rgba(239,68,68,0.1))"
//             : "linear-gradient(135deg,rgba(99,102,241,0.2),rgba(99,102,241,0.1))",
//           border: isLive
//             ? "1px solid rgba(239,68,68,0.25)"
//             : "1px solid rgba(99,102,241,0.2)",
//         }}>
//           <Radio
//             size={18}
//             color={isLive ? "#f87171" : "#818cf8"}
//             style={isLive ? { animation: "lc-pulse 1.5s ease-in-out infinite" } : {}}
//           />
//         </div>

//         {/* Info */}
//         <div style={{ flex: 1, minWidth: 0 }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5, flexWrap: "wrap" }}>
//             <span style={{
//               fontSize: 14, fontWeight: 700,
//               color: isSelected
//                 ? isLive ? "#fca5a5" : "#93c5fd"
//                 : "#e2e8f0",
//               whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
//               maxWidth: 220,
//             }}>
//               {s.title}
//             </span>

//             {isLive && (
//               <span style={{
//                 display: "flex", alignItems: "center", gap: 5,
//                 padding: "2px 8px", borderRadius: 6,
//                 background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)",
//                 fontSize: 9, fontWeight: 800, letterSpacing: 1.5, color: "#f87171",
//               }}>
//                 <span style={{
//                   width: 5, height: 5, borderRadius: "50%", background: "#ef4444",
//                   animation: "lc-blink 1s infinite",
//                 }} />
//                 LIVE
//               </span>
//             )}

//             {!isLive && (
//               <span style={{
//                 padding: "2px 8px", borderRadius: 6,
//                 background: "rgba(100,116,139,0.15)", border: "1px solid rgba(100,116,139,0.2)",
//                 fontSize: 9, fontWeight: 700, letterSpacing: 1, color: "#64748b",
//               }}>
//                 UPCOMING
//               </span>
//             )}
//           </div>

//           <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
//             {s.date && (
//               <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#475569" }}>
//                 <Calendar size={10} color="#475569" /> {s.date}
//               </span>
//             )}
//             {s.time && (
//               <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#475569" }}>
//                 <Clock size={10} color="#475569" /> {s.time}
//               </span>
//             )}
//             {s.viewers != null && (
//               <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#475569" }}>
//                 <Users size={10} color="#475569" /> {s.viewers} watching
//               </span>
//             )}
//           </div>
//         </div>

//         {/* Right side: delete + arrow */}
//         <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
//           {/* DELETE BUTTON */}
//           <button
//             onClick={(e) => { e.stopPropagation(); onDelete(s); }}
//             title="Delete session"
//             style={{
//               width: 34, height: 34, borderRadius: 10,
//               display: "flex", alignItems: "center", justifyContent: "center",
//               background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
//               color: "#f87171", cursor: "pointer", transition: "all .15s",
//               opacity: hovered || isSelected ? 1 : 0.4,
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.background = "rgba(239,68,68,0.2)";
//               e.currentTarget.style.borderColor = "rgba(239,68,68,0.5)";
//               e.currentTarget.style.transform = "scale(1.08)";
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.background = "rgba(239,68,68,0.08)";
//               e.currentTarget.style.borderColor = "rgba(239,68,68,0.2)";
//               e.currentTarget.style.transform = "scale(1)";
//             }}
//           >
//             <Trash2 size={14} />
//           </button>

//           {/* Arrow / checkmark */}
//           <div style={{
//             width: 30, height: 30, borderRadius: 9,
//             display: "flex", alignItems: "center", justifyContent: "center",
//             background: isSelected
//               ? isLive ? "rgba(239,68,68,0.2)" : "rgba(59,130,246,0.2)"
//               : "rgba(255,255,255,0.04)",
//             border: isSelected
//               ? isLive ? "1px solid rgba(239,68,68,0.4)" : "1px solid rgba(59,130,246,0.4)"
//               : "1px solid rgba(255,255,255,0.08)",
//             transition: "all .2s",
//           }}>
//             {isSelected ? (
//               <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
//                 <path d="M1 4.5L4 7.5L10 1.5" stroke={isLive ? "#f87171" : "#60a5fa"}
//                   strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//               </svg>
//             ) : (
//               <ChevronRight size={14} color="#475569" />
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ═══════════════════════════════════════════════════════════
//    MAIN COMPONENT
// ═══════════════════════════════════════════════════════════ */
// const LiveClasses = () => {
//   const [sessions,       setSessions]       = useState([]);
//   const [selected,       setSelected]       = useState(null);
//   const [token,          setToken]          = useState(null);
//   const [room,           setRoom]           = useState(null);
//   const [joining,        setJoining]        = useState(false);
//   const [deleteTarget,   setDeleteTarget]   = useState(null);
//   const [deleting,       setDeleting]       = useState(false);

//   /* load */
//   useEffect(() => {
//     const loadLive = async () => {
//       try {
//         const response  = await getStudentClassroom();
//         const batchId   = response.data?.batchId;
//         if (!batchId) return;
//         const res = await getLiveSessionsByBatch(batchId);
//         setSessions(res.data || []);
//       } catch (err) {
//         console.error("Live fetch failed", err);
//       }
//     };
//     loadLive();
//   }, []);

//   /* join */
//   const handleJoin = async () => {
//     if (!selected) return;
//     setJoining(true);
//     try {
//       const res = await joinLiveSession(selected.id, 1);
//       setToken(res.data.token);
//       setRoom(res.data.room);
//     } catch (err) {
//       console.error("Join failed", err);
//     } finally {
//       setJoining(false);
//     }
//   };

//   /* delete */
//   const handleDeleteConfirm = async () => {
//     if (!deleteTarget) return;
//     setDeleting(true);
//     try {
//       await deleteLiveSession(deleteTarget.id);
//       setSessions((prev) => prev.filter((s) => s.id !== deleteTarget.id));
//       if (selected?.id === deleteTarget.id) setSelected(null);
//       setDeleteTarget(null);
//     } catch (err) {
//       console.error("Delete failed", err);
//     } finally {
//       setDeleting(false);
//     }
//   };

//   /* if joined → live room */
//   if (token) return <LiveRoom token={token} roomName={room} />;

//   const liveCount     = sessions.filter((s) => s.isLive || s.status === "LIVE").length;
//   const upcomingCount = sessions.filter((s) => !s.isLive && s.status !== "LIVE").length;
//   const selectedIsLive = selected && (selected.isLive || selected.status === "LIVE");

//   /* ── RENDER ── */
//   return (
//     <div style={{
//       minHeight: "100vh",
//       background: "linear-gradient(135deg,#060b18 0%,#0d1527 50%,#07101f 100%)",
//       padding: "32px 24px",
//       fontFamily: "'DM Sans','Segoe UI',sans-serif",
//     }}>

//       {/* Delete Modal */}
//       {deleteTarget && (
//         <DeleteModal
//           session={deleteTarget}
//           onConfirm={handleDeleteConfirm}
//           onCancel={() => setDeleteTarget(null)}
//           deleting={deleting}
//         />
//       )}

//       <div style={{ maxWidth: 780, margin: "0 auto" }}>

//         {/* ── HEADER ── */}
//         <div style={{ marginBottom: 32 }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
//             <div style={{
//               width: 42, height: 42, borderRadius: 13,
//               background: "linear-gradient(135deg,#1d4ed8,#7c3aed)",
//               display: "flex", alignItems: "center", justifyContent: "center",
//               boxShadow: "0 4px 20px rgba(59,130,246,0.35)",
//             }}>
//               <Signal size={18} color="white" />
//             </div>
//             <div>
//               <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2.5, color: "#475569",
//                 textTransform: "uppercase", margin: 0 }}>
//                 Broadcast Hub
//               </p>
//               <h1 style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9", margin: 0 }}>
//                 Live Classes
//               </h1>
//             </div>
//           </div>
//           <p style={{ fontSize: 13, color: "#475569", margin: 0 }}>
//             Join your trainer's live sessions in real-time
//           </p>
//         </div>

//         {/* ── STAT CARDS ── */}
//         <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 24 }}>
//           {[
//             {
//               icon: <Radio size={16} />,
//               value: sessions.length,
//               label: "Total",
//               color: "#3b82f6",
//               bg: "rgba(59,130,246,0.1)",
//               border: "rgba(59,130,246,0.2)",
//             },
//             {
//               icon: <Zap size={16} />,
//               value: liveCount,
//               label: "Live Now",
//               color: "#ef4444",
//               bg: "rgba(239,68,68,0.1)",
//               border: "rgba(239,68,68,0.25)",
//             },
//             {
//               icon: <Clock size={16} />,
//               value: upcomingCount,
//               label: "Upcoming",
//               color: "#0ea5e9",
//               bg: "rgba(14,165,233,0.1)",
//               border: "rgba(14,165,233,0.2)",
//             },
//           ].map((c, i) => (
//             <div key={i} style={{
//               borderRadius: 16, padding: "18px 20px",
//               background: c.bg, border: `1px solid ${c.border}`,
//               display: "flex", flexDirection: "column", gap: 4,
//             }}>
//               <span style={{ color: c.color, opacity: 0.8 }}>{c.icon}</span>
//               <span style={{ fontSize: 28, fontWeight: 800, color: "#f1f5f9", lineHeight: 1 }}>
//                 {c.value}
//               </span>
//               <span style={{
//                 fontSize: 10, fontWeight: 700, letterSpacing: 1.5,
//                 color: c.color, textTransform: "uppercase", opacity: 0.75,
//               }}>
//                 {c.label}
//               </span>
//             </div>
//           ))}
//         </div>

//         {/* ── MAIN CARD ── */}
//         <div style={{
//           borderRadius: 24,
//           border: "1px solid rgba(255,255,255,0.07)",
//           background: "rgba(255,255,255,0.02)",
//           backdropFilter: "blur(20px)",
//           overflow: "hidden",
//           boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
//         }}>
//           {/* Card Header */}
//           <div style={{
//             padding: "18px 22px",
//             background: "linear-gradient(135deg,rgba(29,78,216,0.3),rgba(124,58,237,0.2))",
//             borderBottom: "1px solid rgba(255,255,255,0.07)",
//             display: "flex", alignItems: "center", justifyContent: "space-between",
//           }}>
//             <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//               <div style={{
//                 width: 36, height: 36, borderRadius: 11,
//                 background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)",
//                 border: "1px solid rgba(255,255,255,0.15)",
//                 display: "flex", alignItems: "center", justifyContent: "center",
//               }}>
//                 <Radio size={16} color="white" />
//               </div>
//               <div>
//                 <p style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9", margin: 0 }}>
//                   Available Sessions
//                 </p>
//                 <p style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", margin: 0 }}>
//                   {sessions.length > 0
//                     ? `${sessions.length} session${sessions.length !== 1 ? "s" : ""}${liveCount > 0 ? ` · ${liveCount} live now` : ""}`
//                     : "Loading sessions…"}
//                 </p>
//               </div>
//             </div>

//             {liveCount > 0 && (
//               <div style={{
//                 display: "flex", alignItems: "center", gap: 6,
//                 padding: "5px 12px", borderRadius: 10,
//                 background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)",
//                 fontSize: 11, fontWeight: 700, color: "#fca5a5",
//               }}>
//                 <span style={{
//                   width: 6, height: 6, borderRadius: "50%", background: "#ef4444",
//                   animation: "lc-blink 1s infinite",
//                 }} />
//                 {liveCount} Live
//               </div>
//             )}
//           </div>

//           {/* Session list */}
//           <div style={{ padding: "16px" }}>
//             {sessions.length === 0 ? (
//               <div style={{
//                 display: "flex", flexDirection: "column", alignItems: "center",
//                 justifyContent: "center", padding: "60px 20px", gap: 12,
//               }}>
//                 <div style={{
//                   width: 64, height: 64, borderRadius: "50%",
//                   background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
//                   display: "flex", alignItems: "center", justifyContent: "center",
//                 }}>
//                   <Wifi size={26} color="#334155" />
//                 </div>
//                 <p style={{ fontSize: 14, fontWeight: 600, color: "#475569", margin: 0 }}>
//                   No live sessions available
//                 </p>
//                 <p style={{ fontSize: 12, color: "#334155", margin: 0 }}>
//                   Check back later or refresh the page
//                 </p>
//               </div>
//             ) : (
//               <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
//                 {sessions.map((s) => (
//                   <SessionCard
//                     key={s.id}
//                     s={s}
//                     isSelected={selected?.id === s.id}
//                     onSelect={setSelected}
//                     onDelete={setDeleteTarget}
//                   />
//                 ))}
//               </div>
//             )}

//             {/* JOIN BUTTON */}
//             {selected && (
//               <div style={{ marginTop: 16 }}>
//                 <button
//                   onClick={handleJoin}
//                   disabled={joining}
//                   style={{
//                     width: "100%", padding: "15px 24px", borderRadius: 14, border: "none",
//                     background: joining
//                       ? "rgba(239,68,68,0.4)"
//                       : selectedIsLive
//                         ? "linear-gradient(135deg,#dc2626,#ef4444,#f97316)"
//                         : "linear-gradient(135deg,#1d4ed8,#4f46e5,#7c3aed)",
//                     color: "#fff", fontSize: 14, fontWeight: 700,
//                     cursor: joining ? "not-allowed" : "pointer",
//                     fontFamily: "inherit", letterSpacing: 0.3,
//                     display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
//                     boxShadow: joining ? "none"
//                       : selectedIsLive
//                         ? "0 6px 28px rgba(239,68,68,0.35)"
//                         : "0 6px 28px rgba(59,130,246,0.35)",
//                     transition: "all .2s",
//                   }}
//                   onMouseEnter={(e) => { if (!joining) e.currentTarget.style.transform = "translateY(-1px)"; }}
//                   onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
//                 >
//                   {joining ? (
//                     <>
//                       <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
//                         style={{ animation: "lc-spin 0.8s linear infinite" }}>
//                         <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
//                         <path d="M8 2a6 6 0 016 6" stroke="white" strokeWidth="2" strokeLinecap="round" />
//                       </svg>
//                       Joining…
//                     </>
//                   ) : (
//                     <>
//                       {selectedIsLive ? (
//                         <span style={{
//                           width: 8, height: 8, borderRadius: "50%", background: "#fff",
//                           animation: "lc-blink 1s infinite",
//                         }} />
//                       ) : (
//                         <Play size={16} fill="white" />
//                       )}
//                       {selectedIsLive ? "Join Live Session" : "Watch Session"} — {selected.title}
//                       <ChevronRight size={16} />
//                     </>
//                   )}
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <style>{`
//         @keyframes lc-blink  { 0%,100%{opacity:1} 50%{opacity:0.25} }
//         @keyframes lc-spin   { to{transform:rotate(360deg)} }
//         @keyframes lc-pulse  { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.15)} }
//         @keyframes lc-glow   { 0%,100%{opacity:0.4} 50%{opacity:1} }
//       `}</style>
//     </div>
//   );
// };

// export default LiveClasses;  theme problme














import React, { useState, useEffect } from "react";
import { getStudentClassroom } from "@/services/batchService";
import {
  getLiveSessionsByBatch,
  joinLiveSession,
  deleteLiveSession,
} from "@/services/liveSessionService";
import LiveRoom from "@/components/live/LiveRoom";
import {
  Radio, Users, Calendar, Clock, Wifi,
  Trash2, Play, ChevronRight, Signal,
  Zap, X, AlertTriangle,
} from "lucide-react";

/* ─── Delete Confirmation Modal ─── */
const DeleteModal = ({ session, onConfirm, onCancel, deleting }) => (
  <div className="lc-modal-overlay">
    <div className="lc-modal-box">
      <div className="lc-modal-icon">
        <AlertTriangle size={24} color="#ef4444" />
      </div>

      <h3 className="lc-modal-title">Delete Session</h3>
      <p className="lc-modal-sub">Are you sure you want to delete</p>
      <p className="lc-modal-session-name">"{session.title}"</p>
      <p className="lc-modal-warn">This action cannot be undone.</p>

      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={onCancel}
          disabled={deleting}
          className="lc-modal-cancel-btn"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={deleting}
          className="lc-modal-delete-btn"
          style={{
            background: deleting
              ? "rgba(239,68,68,0.4)"
              : "linear-gradient(135deg,#dc2626,#ef4444)",
            cursor: deleting ? "not-allowed" : "pointer",
          }}
        >
          {deleting ? (
            <>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"
                style={{ animation: "lc-spin 0.8s linear infinite" }}>
                <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                <path d="M8 2a6 6 0 016 6" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Deleting…
            </>
          ) : (
            <><Trash2 size={14} /> Delete</>
          )}
        </button>
      </div>
    </div>
  </div>
);

/* ─── Session Card ─── */
const SessionCard = ({ s, isSelected, onSelect, onDelete }) => {
  const isLive = s.isLive || s.status === "LIVE";
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`lc-session-card ${isSelected ? (isLive ? "lc-session-selected-live" : "lc-session-selected") : ""} ${hovered ? "lc-session-hovered" : ""}`}
      onClick={() => onSelect(s)}
    >
      {isLive && <div className="lc-live-strip" />}

      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px" }}>
        {/* Icon */}
        <div className={`lc-session-icon ${isLive ? "lc-session-icon-live" : "lc-session-icon-upcoming"}`}>
          <Radio
            size={18}
            color={isLive ? "#f87171" : "#818cf8"}
            style={isLive ? { animation: "lc-pulse 1.5s ease-in-out infinite" } : {}}
          />
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5, flexWrap: "wrap" }}>
            <span className={`lc-session-title ${isSelected ? (isLive ? "lc-session-title-live" : "lc-session-title-selected") : ""}`}>
              {s.title}
            </span>

            {isLive && (
              <span className="lc-live-badge">
                <span className="lc-live-dot" />
                LIVE
              </span>
            )}

            {!isLive && (
              <span className="lc-upcoming-badge">UPCOMING</span>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
            {s.date && (
              <span className="lc-meta">
                <Calendar size={10} color="#475569" /> {s.date}
              </span>
            )}
            {s.time && (
              <span className="lc-meta">
                <Clock size={10} color="#475569" /> {s.time}
              </span>
            )}
            {s.viewers != null && (
              <span className="lc-meta">
                <Users size={10} color="#475569" /> {s.viewers} watching
              </span>
            )}
          </div>
        </div>

        {/* Right side: delete + arrow */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(s); }}
            title="Delete session"
            className="lc-delete-btn"
            style={{ opacity: hovered || isSelected ? 1 : 0.4 }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(239,68,68,0.2)";
              e.currentTarget.style.borderColor = "rgba(239,68,68,0.5)";
              e.currentTarget.style.transform = "scale(1.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(239,68,68,0.08)";
              e.currentTarget.style.borderColor = "rgba(239,68,68,0.2)";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <Trash2 size={14} />
          </button>

          <div className={`lc-arrow-box ${isSelected ? (isLive ? "lc-arrow-live" : "lc-arrow-selected") : ""}`}>
            {isSelected ? (
              <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                <path d="M1 4.5L4 7.5L10 1.5" stroke={isLive ? "#f87171" : "#60a5fa"}
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <ChevronRight size={14} color="#475569" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════ */
const LiveClasses = () => {
  const [sessions,     setSessions]     = useState([]);
  const [selected,     setSelected]     = useState(null);
  const [token,        setToken]        = useState(null);
  const [room,         setRoom]         = useState(null);
  const [joining,      setJoining]      = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting,     setDeleting]     = useState(false);

  /* load */
  useEffect(() => {
    const loadLive = async () => {
      try {
        const response = await getStudentClassroom();
        const batchId  = response.data?.batchId;
        if (!batchId) return;
        const res = await getLiveSessionsByBatch(batchId);
        setSessions(res.data || []);
      } catch (err) {
        console.error("Live fetch failed", err);
      }
    };
    loadLive();
  }, []);

  /* join */
  const handleJoin = async () => {
    if (!selected) return;
    setJoining(true);
    try {
      const res = await joinLiveSession(selected.id, 1);
      setToken(res.data.token);
      setRoom(res.data.room);
    } catch (err) {
      console.error("Join failed", err);
    } finally {
      setJoining(false);
    }
  };

  /* delete */
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteLiveSession(deleteTarget.id);
      setSessions((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      if (selected?.id === deleteTarget.id) setSelected(null);
      setDeleteTarget(null);
    } catch (err) {
      console.error("Delete failed", err);
    } finally {
      setDeleting(false);
    }
  };

  /* if joined → live room */
  if (token) return <LiveRoom token={token} roomName={room} />;

  const liveCount      = sessions.filter((s) => s.isLive || s.status === "LIVE").length;
  const upcomingCount  = sessions.filter((s) => !s.isLive && s.status !== "LIVE").length;
  const selectedIsLive = selected && (selected.isLive || selected.status === "LIVE");

  const statCards = [
    { icon: <Radio size={16} />, value: sessions.length, label: "Total",    color: "#3b82f6", cls: "lc-stat-blue"  },
    { icon: <Zap   size={16} />, value: liveCount,       label: "Live Now", color: "#ef4444", cls: "lc-stat-red"   },
    { icon: <Clock size={16} />, value: upcomingCount,   label: "Upcoming", color: "#0ea5e9", cls: "lc-stat-cyan"  },
  ];

  return (
    <div className="lc-root">

      {/* Delete Modal */}
      {deleteTarget && (
        <DeleteModal
          session={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
          deleting={deleting}
        />
      )}

      <div className="lc-inner">

        {/* ── HEADER ── */}
        <div className="lc-header">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div className="lc-header-icon">
              <Signal size={18} color="white" />
            </div>
            <div>
              <p className="lc-eyebrow">Broadcast Hub</p>
              <h1 className="lc-title">Live Classes</h1>
            </div>
          </div>
          <p className="lc-subtitle">Join your trainer's live sessions in real-time</p>
        </div>

        {/* ── STAT CARDS ── */}
        <div className="lc-stats-grid">
          {statCards.map((c, i) => (
            <div key={i} className={`lc-stat-card ${c.cls}`}>
              <span style={{ color: c.color, opacity: 0.8 }}>{c.icon}</span>
              <span className="lc-stat-value">{c.value}</span>
              <span className="lc-stat-label" style={{ color: c.color }}>{c.label}</span>
            </div>
          ))}
        </div>

        {/* ── MAIN CARD ── */}
        <div className="lc-main-card">

          {/* Card Header */}
          <div className="lc-card-header">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div className="lc-card-header-icon">
                <Radio size={16} color="white" />
              </div>
              <div>
                <p className="lc-card-header-title">Available Sessions</p>
                <p className="lc-card-header-sub">
                  {sessions.length > 0
                    ? `${sessions.length} session${sessions.length !== 1 ? "s" : ""}${liveCount > 0 ? ` · ${liveCount} live now` : ""}`
                    : "Loading sessions…"}
                </p>
              </div>
            </div>

            {liveCount > 0 && (
              <div className="lc-live-count-badge">
                <span className="lc-live-dot" />
                {liveCount} Live
              </div>
            )}
          </div>

          {/* Session list */}
          <div className="lc-session-list">
            {sessions.length === 0 ? (
              <div className="lc-empty">
                <div className="lc-empty-icon">
                  <Wifi size={26} color="#334155" />
                </div>
                <p className="lc-empty-title">No live sessions available</p>
                <p className="lc-empty-sub">Check back later or refresh the page</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {sessions.map((s) => (
                  <SessionCard
                    key={s.id}
                    s={s}
                    isSelected={selected?.id === s.id}
                    onSelect={setSelected}
                    onDelete={setDeleteTarget}
                  />
                ))}
              </div>
            )}

            {/* JOIN BUTTON */}
            {selected && (
              <div style={{ marginTop: 16 }}>
                <button
                  onClick={handleJoin}
                  disabled={joining}
                  className="lc-join-btn"
                  style={{
                    background: joining
                      ? "rgba(239,68,68,0.4)"
                      : selectedIsLive
                        ? "linear-gradient(135deg,#dc2626,#ef4444,#f97316)"
                        : "linear-gradient(135deg,#1d4ed8,#4f46e5,#7c3aed)",
                    cursor: joining ? "not-allowed" : "pointer",
                    boxShadow: joining ? "none"
                      : selectedIsLive
                        ? "0 6px 28px rgba(239,68,68,0.35)"
                        : "0 6px 28px rgba(59,130,246,0.35)",
                  }}
                  onMouseEnter={(e) => { if (!joining) e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  {joining ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                        style={{ animation: "lc-spin 0.8s linear infinite" }}>
                        <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                        <path d="M8 2a6 6 0 016 6" stroke="white" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      Joining…
                    </>
                  ) : (
                    <>
                      {selectedIsLive ? (
                        <span className="lc-join-dot" />
                      ) : (
                        <Play size={16} fill="white" />
                      )}
                      {selectedIsLive ? "Join Live Session" : "Watch Session"} — {selected.title}
                      <ChevronRight size={16} />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── ALL STYLES ── */}
      <style>{`

        /* ══════════════════════════════════════
           BASE (dark — matches your original)
        ══════════════════════════════════════ */
        .lc-root {
          min-height: 100vh;
          padding: 32px 24px;
          font-family: 'DM Sans','Segoe UI',sans-serif;
          background: linear-gradient(135deg,#060b18 0%,#0d1527 50%,#07101f 100%);
          color: #e2e8f0;
        }
        .lc-inner { max-width: 780px; margin: 0 auto; }

        /* Header */
        .lc-header       { margin-bottom: 32px; }
        .lc-header-icon  {
          width:42px; height:42px; border-radius:13px; flex-shrink:0;
          background: linear-gradient(135deg,#1d4ed8,#7c3aed);
          display:flex; align-items:center; justify-content:center;
          box-shadow: 0 4px 20px rgba(59,130,246,0.35);
        }
        .lc-eyebrow {
          font-size:10px; font-weight:800; letter-spacing:2.5px;
          color:#475569; text-transform:uppercase; margin:0;
        }
        .lc-title    { font-size:22px; font-weight:800; color:#f1f5f9; margin:0; }
        .lc-subtitle { font-size:13px; color:#475569; margin:0; }

        /* Stat grid */
        .lc-stats-grid {
          display:grid; grid-template-columns:repeat(3,1fr);
          gap:12px; margin-bottom:24px;
        }
        .lc-stat-card {
          border-radius:16px; padding:18px 20px;
          display:flex; flex-direction:column; gap:4px;
        }
        .lc-stat-blue { background:rgba(59,130,246,0.1);  border:1px solid rgba(59,130,246,0.2);  }
        .lc-stat-red  { background:rgba(239,68,68,0.1);   border:1px solid rgba(239,68,68,0.25);  }
        .lc-stat-cyan { background:rgba(14,165,233,0.1);  border:1px solid rgba(14,165,233,0.2);  }
        .lc-stat-value {
          font-size:28px; font-weight:800; color:#f1f5f9; line-height:1;
        }
        .lc-stat-label {
          font-size:10px; font-weight:700; letter-spacing:1.5px;
          text-transform:uppercase; opacity:0.75;
        }

        /* Main card */
        .lc-main-card {
          border-radius:24px;
          border:1px solid rgba(255,255,255,0.07);
          background:rgba(255,255,255,0.02);
          backdrop-filter:blur(20px);
          overflow:hidden;
          box-shadow:0 20px 60px rgba(0,0,0,0.5);
        }
        .lc-card-header {
          padding:18px 22px;
          background:linear-gradient(135deg,rgba(29,78,216,0.3),rgba(124,58,237,0.2));
          border-bottom:1px solid rgba(255,255,255,0.07);
          display:flex; align-items:center; justify-content:space-between;
        }
        .lc-card-header-icon {
          width:36px; height:36px; border-radius:11px; flex-shrink:0;
          background:rgba(255,255,255,0.12); backdrop-filter:blur(8px);
          border:1px solid rgba(255,255,255,0.15);
          display:flex; align-items:center; justify-content:center;
        }
        .lc-card-header-title { font-size:13px; font-weight:700; color:#f1f5f9; margin:0; }
        .lc-card-header-sub   { font-size:11px; color:rgba(255,255,255,0.45); margin:0; }
        .lc-live-count-badge  {
          display:flex; align-items:center; gap:6px;
          padding:5px 12px; border-radius:10px;
          background:rgba(239,68,68,0.15); border:1px solid rgba(239,68,68,0.3);
          font-size:11px; font-weight:700; color:#fca5a5;
        }

        /* Session list */
        .lc-session-list { padding:16px; }

        /* Session card */
        .lc-session-card {
          position:relative; border-radius:16px; cursor:pointer;
          border:1.5px solid rgba(255,255,255,0.06);
          background:rgba(255,255,255,0.02);
          transition:all 0.2s ease; overflow:hidden;
        }
        .lc-session-hovered {
          border-color:rgba(255,255,255,0.12) !important;
          background:rgba(255,255,255,0.04) !important;
        }
        .lc-session-selected {
          border-color:rgba(59,130,246,0.6) !important;
          background:linear-gradient(135deg,rgba(59,130,246,0.1),rgba(59,130,246,0.04)) !important;
          box-shadow:0 0 0 4px rgba(59,130,246,0.08), 0 4px 20px rgba(0,0,0,0.3) !important;
        }
        .lc-session-selected-live {
          border-color:rgba(239,68,68,0.6) !important;
          background:linear-gradient(135deg,rgba(239,68,68,0.08),rgba(239,68,68,0.04)) !important;
          box-shadow:0 0 0 4px rgba(239,68,68,0.08), 0 4px 20px rgba(0,0,0,0.3) !important;
        }
        .lc-live-strip {
          position:absolute; top:0; left:0; right:0; height:2px;
          background:linear-gradient(90deg,transparent,#ef4444,transparent);
          animation:lc-glow 2s ease-in-out infinite;
        }
        .lc-session-icon {
          width:44px; height:44px; border-radius:13px; flex-shrink:0;
          display:flex; align-items:center; justify-content:center;
        }
        .lc-session-icon-live {
          background:linear-gradient(135deg,rgba(239,68,68,0.2),rgba(239,68,68,0.1));
          border:1px solid rgba(239,68,68,0.25);
        }
        .lc-session-icon-upcoming {
          background:linear-gradient(135deg,rgba(99,102,241,0.2),rgba(99,102,241,0.1));
          border:1px solid rgba(99,102,241,0.2);
        }
        .lc-session-title {
          font-size:14px; font-weight:700; color:#e2e8f0;
          white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:220px;
        }
        .lc-session-title-live     { color:#fca5a5 !important; }
        .lc-session-title-selected { color:#93c5fd !important; }

        /* Badges */
        .lc-live-badge {
          display:flex; align-items:center; gap:5px;
          padding:2px 8px; border-radius:6px;
          background:rgba(239,68,68,0.15); border:1px solid rgba(239,68,68,0.3);
          font-size:9px; font-weight:800; letter-spacing:1.5px; color:#f87171;
        }
        .lc-live-dot {
          width:5px; height:5px; border-radius:50%; background:#ef4444;
          display:inline-block; animation:lc-blink 1s infinite;
        }
        .lc-upcoming-badge {
          padding:2px 8px; border-radius:6px;
          background:rgba(100,116,139,0.15); border:1px solid rgba(100,116,139,0.2);
          font-size:9px; font-weight:700; letter-spacing:1px; color:#64748b;
        }
        .lc-meta {
          display:flex; align-items:center; gap:4px;
          font-size:11px; color:#475569;
        }

        /* Delete btn */
        .lc-delete-btn {
          width:34px; height:34px; border-radius:10px;
          display:flex; align-items:center; justify-content:center;
          background:rgba(239,68,68,0.08); border:1px solid rgba(239,68,68,0.2);
          color:#f87171; cursor:pointer; transition:all .15s;
        }

        /* Arrow box */
        .lc-arrow-box {
          width:30px; height:30px; border-radius:9px;
          display:flex; align-items:center; justify-content:center;
          background:rgba(255,255,255,0.04);
          border:1px solid rgba(255,255,255,0.08);
          transition:all .2s;
        }
        .lc-arrow-selected { background:rgba(59,130,246,0.2) !important; border-color:rgba(59,130,246,0.4) !important; }
        .lc-arrow-live     { background:rgba(239,68,68,0.2)  !important; border-color:rgba(239,68,68,0.4)  !important; }

        /* Empty state */
        .lc-empty {
          display:flex; flex-direction:column; align-items:center;
          justify-content:center; padding:60px 20px; gap:12px;
        }
        .lc-empty-icon {
          width:64px; height:64px; border-radius:50%;
          background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08);
          display:flex; align-items:center; justify-content:center;
        }
        .lc-empty-title { font-size:14px; font-weight:600; color:#475569; margin:0; }
        .lc-empty-sub   { font-size:12px; color:#334155; margin:0; }

        /* Join button */
        .lc-join-btn {
          width:100%; padding:15px 24px; border-radius:14px; border:none;
          color:#fff; font-size:14px; font-weight:700;
          font-family:inherit; letter-spacing:0.3px;
          display:flex; align-items:center; justify-content:center; gap:10px;
          transition:all .2s;
        }
        .lc-join-dot {
          width:8px; height:8px; border-radius:50%; background:#fff;
          animation:lc-blink 1s infinite;
        }

        /* Modal */
        .lc-modal-overlay {
          position:fixed; inset:0; z-index:99999;
          background:rgba(0,0,0,0.75); backdrop-filter:blur(6px);
          display:flex; align-items:center; justify-content:center; padding:20px;
        }
        .lc-modal-box {
          background:linear-gradient(145deg,#0f172a,#1e293b);
          border:1px solid rgba(239,68,68,0.3);
          border-radius:20px; padding:32px 28px; max-width:400px; width:100%;
          box-shadow:0 25px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05);
        }
        .lc-modal-icon {
          width:56px; height:56px; border-radius:50%; margin-bottom:20px;
          background:rgba(239,68,68,0.12); border:1px solid rgba(239,68,68,0.3);
          display:flex; align-items:center; justify-content:center;
        }
        .lc-modal-title        { font-size:18px; font-weight:700; color:#f1f5f9; margin:0 0 8px; }
        .lc-modal-sub          { font-size:13px; color:#64748b; margin:0 0 6px; line-height:1.6; }
        .lc-modal-session-name {
          font-size:14px; font-weight:700; color:#e2e8f0;
          margin:0 0 24px; padding:10px 14px; border-radius:10px;
          background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08);
        }
        .lc-modal-warn { font-size:12px; color:#475569; margin:0 0 28px; }
        .lc-modal-cancel-btn {
          flex:1; padding:11px 0; border-radius:12px;
          border:1px solid rgba(255,255,255,0.1);
          background:rgba(255,255,255,0.05); color:#94a3b8;
          font-size:13px; font-weight:600; cursor:pointer; font-family:inherit;
          transition:all .15s;
        }
        .lc-modal-delete-btn {
          flex:1; padding:11px 0; border-radius:12px; border:none;
          color:#fff; font-size:13px; font-weight:700; font-family:inherit;
          display:flex; align-items:center; justify-content:center;
          gap:8px; transition:all .15s;
        }

        /* ══════════════════════════════════════
           LIGHT THEME OVERRIDES
           Targets both body.light and
           [data-theme="light"] for compatibility
        ══════════════════════════════════════ */
        body.light .lc-root,
        [data-theme="light"] .lc-root {
          background: linear-gradient(135deg,#f0f4ff 0%,#e8eeff 50%,#f0f4ff 100%);
          color: #0f172a;
        }

        body.light .lc-title,
        [data-theme="light"] .lc-title { color: #0f172a; }

        body.light .lc-eyebrow,
        [data-theme="light"] .lc-eyebrow { color: #94a3b8; }

        body.light .lc-subtitle,
        [data-theme="light"] .lc-subtitle { color: #64748b; }

        body.light .lc-stat-value,
        [data-theme="light"] .lc-stat-value { color: #0f172a; }

        body.light .lc-stat-blue,
        [data-theme="light"] .lc-stat-blue {
          background: rgba(59,130,246,0.08);
          border-color: rgba(59,130,246,0.25);
        }
        body.light .lc-stat-red,
        [data-theme="light"] .lc-stat-red {
          background: rgba(239,68,68,0.08);
          border-color: rgba(239,68,68,0.25);
        }
        body.light .lc-stat-cyan,
        [data-theme="light"] .lc-stat-cyan {
          background: rgba(14,165,233,0.08);
          border-color: rgba(14,165,233,0.25);
        }

        body.light .lc-main-card,
        [data-theme="light"] .lc-main-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 32px rgba(0,0,0,0.08);
        }

        body.light .lc-card-header,
        [data-theme="light"] .lc-card-header {
          background: linear-gradient(135deg,rgba(29,78,216,0.06),rgba(124,58,237,0.04));
          border-bottom: 1px solid #e2e8f0;
        }

        body.light .lc-card-header-icon,
        [data-theme="light"] .lc-card-header-icon {
          background: rgba(29,78,216,0.1);
          border: 1px solid rgba(29,78,216,0.2);
        }

        body.light .lc-card-header-title,
        [data-theme="light"] .lc-card-header-title { color: #0f172a; }

        body.light .lc-card-header-sub,
        [data-theme="light"] .lc-card-header-sub { color: #64748b; }

        body.light .lc-session-card,
        [data-theme="light"] .lc-session-card {
          background: #f8fafc;
          border-color: #e2e8f0;
        }
        body.light .lc-session-hovered,
        [data-theme="light"] .lc-session-hovered {
          background: #f1f5f9 !important;
          border-color: #cbd5e1 !important;
        }

        body.light .lc-session-title,
        [data-theme="light"] .lc-session-title { color: #1e293b; }

        body.light .lc-meta,
        [data-theme="light"] .lc-meta { color: #64748b; }

        body.light .lc-upcoming-badge,
        [data-theme="light"] .lc-upcoming-badge {
          background: rgba(100,116,139,0.1);
          border-color: rgba(100,116,139,0.25);
          color: #475569;
        }

        body.light .lc-arrow-box,
        [data-theme="light"] .lc-arrow-box {
          background: #f1f5f9;
          border-color: #e2e8f0;
        }

        body.light .lc-empty-icon,
        [data-theme="light"] .lc-empty-icon {
          background: #f1f5f9;
          border-color: #e2e8f0;
        }
        body.light .lc-empty-title,
        [data-theme="light"] .lc-empty-title { color: #64748b; }
        body.light .lc-empty-sub,
        [data-theme="light"] .lc-empty-sub   { color: #94a3b8; }

        body.light .lc-modal-box,
        [data-theme="light"] .lc-modal-box {
          background: linear-gradient(145deg,#ffffff,#f8fafc);
          border-color: rgba(239,68,68,0.3);
          box-shadow: 0 25px 60px rgba(0,0,0,0.15);
        }
        body.light .lc-modal-title,
        [data-theme="light"] .lc-modal-title { color: #0f172a; }
        body.light .lc-modal-sub,
        [data-theme="light"] .lc-modal-sub   { color: #64748b; }
        body.light .lc-modal-session-name,
        [data-theme="light"] .lc-modal-session-name {
          color: #1e293b;
          background: rgba(0,0,0,0.03);
          border-color: #e2e8f0;
        }
        body.light .lc-modal-warn,
        [data-theme="light"] .lc-modal-warn { color: #64748b; }
        body.light .lc-modal-cancel-btn,
        [data-theme="light"] .lc-modal-cancel-btn {
          background: #f1f5f9;
          border-color: #e2e8f0;
          color: #475569;
        }

        /* ══════════════════════════════════════
           ANIMATIONS
        ══════════════════════════════════════ */
        @keyframes lc-blink  { 0%,100%{opacity:1} 50%{opacity:0.25} }
        @keyframes lc-spin   { to{transform:rotate(360deg)} }
        @keyframes lc-pulse  { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.15)} }
        @keyframes lc-glow   { 0%,100%{opacity:0.4} 50%{opacity:1} }
      `}</style>
    </div>
  );
};

export default LiveClasses;