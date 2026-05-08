// import { useState, useEffect } from "react";
// import {
//   getMyTrainerFeedbackByBatch,
//   getMyTrainerSummary,
//   updateFeedbackStatus,
// } from "../services/chatService";
// import { getTrainerBatches } from "../services/batchService";
// import {
//   MessageSquare, Star, TrendingUp, Users, ChevronDown,
//   X, CheckCircle, Archive, BarChart2, Smile, Activity,
//   Filter, Eye, GraduationCap, Brain, Zap, ClipboardList,
// } from "lucide-react";

// /* ═══════════════════════════════════════════════
//    THEME TOKEN MAP (mirrors DashboardPage)
// ═══════════════════════════════════════════════ */
// const T = {
//   dark: {
//     pageBg: "#0a0a0a", cardBg: "#111111", cardBgHov: "#161616",
//     border: "rgba(255,255,255,0.06)", borderHov: "rgba(255,255,255,0.14)",
//     text: "#ffffff", textSub: "rgba(255,255,255,0.3)", textMuted: "rgba(255,255,255,0.2)",
//     textLabel: "rgba(255,255,255,0.22)",
//     pillBg: "rgba(255,255,255,0.04)", pillBorder: "rgba(255,255,255,0.07)", pillText: "rgba(255,255,255,0.25)",
//     emptyBorder: "rgba(255,255,255,0.07)", emptyBg: "rgba(255,255,255,0.02)", emptyIcon: "rgba(255,255,255,0.12)",
//     barBg: "rgba(255,255,255,0.05)",
//     actBg: "rgba(255,255,255,0.04)", actBorder: "rgba(255,255,255,0.07)",
//     recentItemBg: "rgba(255,255,255,0.03)", recentItemBorder: "rgba(255,255,255,0.05)",
//     recentItemBgHov: "rgba(255,255,255,0.06)",
//     shadow: "0 4px 20px rgba(0,0,0,0.4)", shadowHov: "0 20px 60px rgba(0,0,0,0.6)",
//     overlayBg: "rgba(0,0,0,0.75)",
//     starEmpty: "rgba(255,255,255,0.1)",
//   },
//   light: {
//     pageBg: "#f1f5f9", cardBg: "#ffffff", cardBgHov: "#f8fafc",
//     border: "#e2e8f0", borderHov: "#cbd5e1",
//     text: "#0f172a", textSub: "#64748b", textMuted: "#94a3b8", textLabel: "#94a3b8",
//     pillBg: "#f1f5f9", pillBorder: "#e2e8f0", pillText: "#94a3b8",
//     emptyBorder: "#e2e8f0", emptyBg: "#f8fafc", emptyIcon: "#cbd5e1",
//     barBg: "#f1f5f9",
//     actBg: "#f8fafc", actBorder: "#e2e8f0",
//     recentItemBg: "#f8fafc", recentItemBorder: "#e2e8f0",
//     recentItemBgHov: "#f1f5f9",
//     shadow: "0 1px 8px rgba(0,0,0,0.07)", shadowHov: "0 8px 32px rgba(0,0,0,0.10)",
//     overlayBg: "rgba(0,0,0,0.45)",
//     starEmpty: "#e2e8f0",
//   },
// };

// const MOCK = [
//   { id: 1, mood: "🤩", moodLabel: "AMAZING", student: "Anonymous", clarity: 5, doubt: 4, energy: 5, depth: 4, tags: ["Just right", "Great demos"], comment: "Best session so far! Loved the Spring Boot deep dive.", status: "SUBMITTED", date: "Apr 15" },
//   { id: 2, mood: "😊", moodLabel: "GOOD", student: "Priya M.", clarity: 4, doubt: 4, energy: 4, depth: 3, tags: ["Just right", "More examples needed"], comment: "", status: "REVIEWED", date: "Apr 15" },
//   { id: 3, mood: "😐", moodLabel: "FINE", student: "Anonymous", clarity: 3, doubt: 2, energy: 3, depth: 3, tags: ["Too fast"], comment: "Needs to slow down during JPA mapping.", status: "SUBMITTED", date: "Apr 14" },
//   { id: 4, mood: "😞", moodLabel: "POOR", student: "Anonymous", clarity: 2, doubt: 1, energy: 2, depth: 2, tags: ["Hard to follow", "Too fast"], comment: "Couldn't understand the Kafka consumer part at all.", status: "SUBMITTED", date: "Apr 14" },
//   { id: 5, mood: "🤩", moodLabel: "AMAZING", student: "Ravi K.", clarity: 5, doubt: 5, energy: 5, depth: 5, tags: ["Just right", "Great demos"], comment: "Absolutely loved it. Keep it up!", status: "REVIEWED", date: "Apr 13" },
//   { id: 6, mood: "😊", moodLabel: "GOOD", student: "Anonymous", clarity: 4, doubt: 3, energy: 4, depth: 4, tags: ["Notes & resources"], comment: "Please share slides after class.", status: "SUBMITTED", date: "Apr 13" },
// ];

// const isDarkFn = () =>
//   typeof document !== "undefined" &&
//   (document.documentElement.classList.contains("dark") ||
//    document.documentElement.getAttribute("data-theme") === "dark" ||
//    window.matchMedia("(prefers-color-scheme: dark)").matches);

// function avg(f) {
//   return ((f.clarity + f.doubt + f.energy + f.depth) / 4).toFixed(1);
// }

// /* ── Count-up hook ── */
// function useCountUp(target, duration = 1000) {
//   const [val, setVal] = useState(0);
//   useEffect(() => {
//     if (!target || isNaN(target)) { setVal(target); return; }
//     let start = null;
//     const num = parseFloat(target);
//     const step = (ts) => {
//       if (!start) start = ts;
//       const p = Math.min((ts - start) / duration, 1);
//       setVal(Number((p * num).toFixed(1)));
//       if (p < 1) requestAnimationFrame(step);
//     };
//     requestAnimationFrame(step);
//   }, [target]);
//   return val;
// }

// /* ── Star Display ── */
// function StarDisplay({ val, size = 14, t }) {
//   return (
//     <div style={{ display: "flex", gap: 3 }}>
//       {[1, 2, 3, 4, 5].map(i => (
//         <svg key={i} width={size} height={size} viewBox="0 0 24 24"
//           fill={i <= val ? "#f59e0b" : "none"}
//           stroke={i <= val ? "#f59e0b" : t?.starEmpty || "#e2e8f0"}
//           strokeWidth="1.5">
//           <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
//         </svg>
//       ))}
//     </div>
//   );
// }

// /* ── Stat Card ── */
// function StatCard({ label, value, sub, fill, color, icon: Icon, index, t }) {
//   const [hov, setHov] = useState(false);
//   return (
//     <div
//       onMouseEnter={() => setHov(true)}
//       onMouseLeave={() => setHov(false)}
//       style={{
//         background: hov ? t.cardBgHov : t.cardBg,
//         border: `1px solid ${hov ? t.borderHov : t.border}`,
//         borderRadius: 20, padding: "22px 22px 20px",
//         display: "flex", flexDirection: "column", gap: 14,
//         cursor: "default", transition: "all 0.25s ease",
//         position: "relative", overflow: "hidden",
//         boxShadow: hov ? `${t.shadowHov}, 0 0 40px ${color}12` : t.shadow,
//         animationDelay: `${index * 80}ms`,
//       }}
//     >
//       {/* Glow blob */}
//       <div style={{ position: "absolute", top: -20, right: -20, width: 90, height: 90, borderRadius: "50%", background: color, filter: "blur(40px)", opacity: hov ? 0.15 : 0.04, transition: "opacity 0.4s", pointerEvents: "none" }} />
//       {/* Top accent bar */}
//       <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, borderRadius: "20px 20px 0 0", background: color, opacity: 0.75 }} />

//       <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 4 }}>
//         <div style={{ width: 42, height: 42, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", background: `${color}18`, border: `1px solid ${color}30` }}>
//           <Icon size={19} color={color} strokeWidth={2} />
//         </div>
//         <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 14, opacity: hov ? 0.7 : 0.3, transition: "opacity 0.2s" }}>
//           <span style={{ width: 3, height: 8, borderRadius: 2, background: color, display: "block" }} />
//           <span style={{ width: 3, height: 14, borderRadius: 2, background: color, display: "block" }} />
//           <span style={{ width: 3, height: 6, borderRadius: 2, background: color, display: "block" }} />
//         </div>
//       </div>
//       <div>
//         <p style={{ fontSize: 40, fontWeight: 800, lineHeight: 1, fontFamily: "'Poppins',sans-serif", color: t.text, margin: 0 }}>{value}</p>
//         <p style={{ fontSize: 10, marginTop: 6, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: t.textMuted, fontFamily: "'Poppins',sans-serif", margin: "6px 0 0" }}>{label}</p>
//       </div>
//       <div style={{ height: 2, background: t.barBg, borderRadius: 99, overflow: "hidden" }}>
//         <div style={{ height: "100%", borderRadius: 99, background: color, width: hov ? fill : "20%", transition: "width 0.65s ease", opacity: 0.85 }} />
//       </div>
//       <p style={{ fontSize: 11, color: t.textMuted, fontFamily: "'Poppins',sans-serif", margin: 0 }}>{sub}</p>
//     </div>
//   );
// }

// /* ════════════════════════════════════════════════════════════════
//    MAIN COMPONENT
// ════════════════════════════════════════════════════════════════ */
// export default function TrainerFeedback() {
//   const [dark, setDark] = useState(isDarkFn);
//   const t = dark ? T.dark : T.light;

//   useEffect(() => {
//     const obs = new MutationObserver(() => setDark(isDarkFn()));
//     obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
//     return () => obs.disconnect();
//   }, []);

//   const [batches, setBatches] = useState([]);
//   const [selectedBatchId, setSelectedBatchId] = useState(null);
//   const [feedbackList, setFeedbackList] = useState(MOCK);
//   const [filter, setFilter] = useState("all");
//   const [selected, setSelected] = useState(null);
//   const [loadingFeedback, setLoadingFeedback] = useState(false);

//   useEffect(() => {
//     getTrainerBatches()
//       .then(data => {
//         const list = Array.isArray(data) ? data : [];
//         setBatches(list);
//         if (list.length > 0) setSelectedBatchId(list[0].id);
//       })
//       .catch(() => {});
//   }, []);

//   useEffect(() => {
//     if (!selectedBatchId) return;
//     setLoadingFeedback(true);
//     getMyTrainerFeedbackByBatch(selectedBatchId)
//       .then(r => {
//         const moodMap = { AMAZING: "🤩", GOOD: "😊", FINE: "😐", OKAY: "😕", POOR: "😞" };
//         setFeedbackList(r.data.map(f => {
//           const moodKey = (f.moodRating || "").toUpperCase().trim();
//           return {
//             id: f.id, moodLabel: moodKey, mood: moodMap[moodKey] || "😐",
//             student: f.studentEmail || "Anonymous",
//             clarity: f.trainerClarityRating || 0, doubt: f.trainerDoubtClearingRating || 0,
//             energy: f.trainerEnergyRating || 0, depth: f.trainerTechnicalDepthRating || 0,
//             tags: f.contentTags || [], comment: f.comment || "",
//             status: f.status, date: new Date(f.createdAt).toLocaleDateString(),
//           };
//         }));
//       })
//       .catch(() => setFeedbackList(MOCK))
//       .finally(() => setLoadingFeedback(false));
//   }, [selectedBatchId]);

//   const filtered = feedbackList.filter(f => {
//     if (filter === "positive") return f.clarity >= 4 && f.doubt >= 4;
//     if (filter === "negative") return f.clarity <= 3 || f.doubt <= 2;
//     return true;
//   });

//   async function handleMarkReviewed(f) {
//     try { await updateFeedbackStatus(f.id, "REVIEWED"); } catch {}
//     setFeedbackList(prev => prev.map(x => x.id === f.id ? { ...x, status: "REVIEWED" } : x));
//     setSelected(null);
//   }

//   /* Computed */
//   const statAvg = feedbackList.length
//     ? (feedbackList.reduce((s, f) => s + parseFloat(avg(f)), 0) / feedbackList.length).toFixed(1) : "—";
//   const anonymousCount = feedbackList.filter(f => f.student === "Anonymous").length;
//   const anonPct = feedbackList.length ? Math.round((anonymousCount / feedbackList.length) * 100) : 0;
//   const clarityAvg = feedbackList.length ? (feedbackList.reduce((s, f) => s + f.clarity, 0) / feedbackList.length).toFixed(1) : 0;
//   const doubtAvg = feedbackList.length ? (feedbackList.reduce((s, f) => s + f.doubt, 0) / feedbackList.length).toFixed(1) : 0;
//   const energyAvg = feedbackList.length ? (feedbackList.reduce((s, f) => s + f.energy, 0) / feedbackList.length).toFixed(1) : 0;
//   const depthAvg = feedbackList.length ? (feedbackList.reduce((s, f) => s + f.depth, 0) / feedbackList.length).toFixed(1) : 0;

//   const moodCounts = [
//     { icon: "🤩", label: "Amazing", key: "AMAZING", color: "#a78bfa" },
//     { icon: "😊", label: "Good", key: "GOOD", color: "#34d399" },
//     { icon: "😐", label: "Fine", key: "FINE", color: "#fbbf24" },
//     { icon: "😕", label: "Okay", key: "OKAY", color: "#fb923c" },
//     { icon: "😞", label: "Poor", key: "POOR", color: "#f87171" },
//   ].map(m => ({ ...m, count: feedbackList.filter(f => f.moodLabel === m.key).length, max: feedbackList.length || 1 }));

//   const ratingRows = [
//     { label: "Clarity of explanation", val: parseFloat(clarityAvg), color: "#34d399", icon: Brain },
//     { label: "Doubt clearing", val: parseFloat(doubtAvg), color: "#22d3ee", icon: MessageSquare },
//     { label: "Energy & engagement", val: parseFloat(energyAvg), color: "#fbbf24", icon: Zap },
//     { label: "Technical depth", val: parseFloat(depthAvg), color: "#a78bfa", icon: BarChart2 },
//   ];

//   const stats = [
//     { label: "Total Feedback", value: feedbackList.length, sub: `${filtered.length} visible`, fill: "80%", color: "#22d3ee", icon: MessageSquare },
//     { label: "Overall Rating", value: statAvg, sub: "Out of 5.0", fill: `${(parseFloat(statAvg) / 5) * 100}%`, color: "#34d399", icon: Star },
//     { label: "Avg Mood Score", value: "3.9", sub: "🤩 38% Amazing", fill: "78%", color: "#fbbf24", icon: Smile },
//     { label: "Anonymous Rate", value: `${anonPct}%`, sub: `${anonymousCount} anonymous`, fill: `${anonPct}%`, color: "#a78bfa", icon: Users },
//   ];

//   const card = { background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 20, boxShadow: t.shadow };

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
//         @keyframes tfFadeUp { from { opacity:0; transform:translateY(14px) } to { opacity:1; transform:translateY(0) } }
//         @keyframes tfPulseRing { 0%{box-shadow:0 0 0 0 rgba(124,58,237,0.5)} 70%{box-shadow:0 0 0 8px rgba(124,58,237,0)} 100%{box-shadow:0 0 0 0 rgba(124,58,237,0)} }
//         @keyframes tfPulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
//         @keyframes tfBlink { 0%,100%{opacity:1} 50%{opacity:0.15} }
//         .tf-fade { animation: tfFadeUp 0.45s ease both; }
//         .tf-live { animation: tfPulseRing 2.2s ease-out infinite; }
//         .tf-d1 { animation: tfBlink 1.6s ease infinite; }
//         .tf-d2 { animation: tfBlink 1.6s 0.3s ease infinite; }
//         .tf-d3 { animation: tfBlink 1.6s 0.6s ease infinite; }
//         .tf-table-row:hover td { background: ${t.recentItemBgHov}; }
//         .tf-view-btn:hover { border-color: rgba(124,58,237,0.4) !important; color: #a78bfa !important; transform: translateY(-1px); }
//         .tf-filter-btn { transition: all 0.2s; }
//         .tf-close-btn:hover { background: ${t.borderHov} !important; }
//         .tf-select:focus { outline: none; }
//         .tf-rating-bar-track { transition: width 0.7s ease; }
//         .tf-modal-overlay-inner::-webkit-scrollbar { width: 4px; }
//         .tf-modal-overlay-inner::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
//       `}</style>

//       <div style={{ fontFamily: "'Poppins',sans-serif", minHeight: "100vh", background: t.pageBg, color: t.text, transition: "background 0.3s, color 0.3s" }}>
//         <div style={{ maxWidth: 1300, margin: "0 auto", padding: "28px 28px 60px" }}>

//           {/* ═══ HERO ═══ */}
//           <div className="tf-fade" style={{ ...card, padding: "26px 30px", marginBottom: 20 }}>
//             <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>

//               {/* Left */}
//               <div>
//                 <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
//                   <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.22)", display: "flex", alignItems: "center", justifyContent: "center" }}>
//                     <ClipboardList size={16} color="#7c3aed" />
//                   </div>
//                   <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
//                     <div className="tf-d1" style={{ width: 6, height: 6, borderRadius: "50%", background: "#7c3aed" }} />
//                     <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: t.textSub }}>Trainer Portal</span>
//                   </div>
//                 </div>
//                 <h1 style={{ fontSize: "clamp(1.3rem,2.5vw,1.9rem)", fontWeight: 900, color: t.text, margin: "0 0 5px", letterSpacing: "-0.02em" }}>Feedback Dashboard</h1>
//                 <p style={{ fontSize: 12, color: t.textSub, margin: 0, fontWeight: 500 }}>Aggregated student feedback for your sessions</p>
//               </div>

//               {/* Right */}
//               <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
//                 {/* Stats pill */}
//                 <div style={{ display: "flex", alignItems: "center", gap: 12, background: t.actBg, border: `1px solid ${t.actBorder}`, borderRadius: 12, padding: "8px 16px", fontSize: 11, fontWeight: 600, fontFamily: "'Poppins',sans-serif", color: t.textSub }}>
//                   <span>{feedbackList.length} responses</span>
//                   <span style={{ width: 1, height: 14, background: t.actBorder }} />
//                   <span>{feedbackList.filter(f => f.status === "REVIEWED").length} reviewed</span>
//                   <span style={{ width: 1, height: 14, background: t.actBorder }} />
//                   <span style={{ color: "#34d399", fontWeight: 700 }}>⭐ {statAvg}/5</span>
//                 </div>

//                 {/* Activity bars */}
//                 <div style={{ display: "flex", alignItems: "center", gap: 8, background: t.actBg, border: `1px solid ${t.actBorder}`, borderRadius: 10, padding: "8px 12px" }}>
//                   <Activity size={12} color={t.textMuted} />
//                   <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 14 }}>
//                     <span className="tf-d1" style={{ width: 3, height: 10, borderRadius: 2, background: t.textMuted, display: "block", opacity: 0.5 }} />
//                     <span className="tf-d2" style={{ width: 3, height: 14, borderRadius: 2, background: t.textMuted, display: "block", opacity: 0.5 }} />
//                     <span className="tf-d3" style={{ width: 3, height: 7, borderRadius: 2, background: t.textMuted, display: "block", opacity: 0.5 }} />
//                   </div>
//                 </div>

//                 {/* Batch selector */}
//                 <div style={{ display: "flex", alignItems: "center", gap: 8, background: t.actBg, border: `1px solid ${t.actBorder}`, borderRadius: 12, padding: "8px 14px", cursor: "pointer" }}>
//                   <GraduationCap size={14} color="#7c3aed" />
//                   <select
//                     className="tf-select"
//                     value={selectedBatchId ?? ""}
//                     onChange={e => setSelectedBatchId(Number(e.target.value))}
//                     style={{ background: "transparent", border: "none", color: t.text, fontFamily: "'Poppins',sans-serif", fontSize: 12, fontWeight: 600, cursor: "pointer", outline: "none" }}
//                   >
//                     {batches.length === 0 && <option value="">No batches assigned</option>}
//                     {batches.map(b => <option key={b.id} value={b.id}>{b.name || `Batch #${b.id}`}</option>)}
//                   </select>
//                   <ChevronDown size={12} color={t.textMuted} />
//                 </div>

//                 {/* Live badge */}
//                 <div className="tf-live" style={{ display: "flex", alignItems: "center", gap: 7, background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.28)", borderRadius: 999, padding: "7px 16px", color: "#7c3aed", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em" }}>
//                   <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#7c3aed", display: "inline-block" }} />LIVE
//                 </div>
//               </div>
//             </div>
//           </div>

//           {loadingFeedback ? (
//             <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 260, gap: 16 }}>
//               <div style={{ fontSize: 36, animation: "tfPulse 2s infinite" }}>⏳</div>
//               <p style={{ fontSize: 13, color: t.textMuted, fontFamily: "'Poppins',sans-serif" }}>Loading feedback…</p>
//             </div>
//           ) : (
//             <>
//               {/* ═══ STAT CARDS ═══ */}
//               <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14, marginBottom: 20 }}>
//                 {stats.map((s, i) => <StatCard key={i} {...s} index={i} t={t} />)}
//               </div>

//               {/* ═══ MID PANELS ═══ */}
//               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>

//                 {/* Rating Breakdown */}
//                 <div style={{ ...card, padding: "22px" }}>
//                   <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
//                     <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(52,211,153,0.10)", border: "1px solid rgba(52,211,153,0.20)", display: "flex", alignItems: "center", justifyContent: "center" }}>
//                       <BarChart2 size={15} color="#34d399" />
//                     </div>
//                     <span style={{ fontSize: 13, fontWeight: 700, color: t.text }}>Rating Breakdown</span>
//                   </div>
//                   {ratingRows.map((r, i) => {
//                     const Icon = r.icon;
//                     return (
//                       <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, padding: "10px 12px", borderRadius: 12, background: t.actBg, border: `1px solid ${t.actBorder}` }}>
//                         <div style={{ width: 30, height: 30, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", background: `${r.color}18`, border: `1px solid ${r.color}30`, flexShrink: 0 }}>
//                           <Icon size={13} color={r.color} />
//                         </div>
//                         <div style={{ flex: 1, minWidth: 0 }}>
//                           <p style={{ fontSize: 10, color: t.textMuted, margin: "0 0 5px", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.label}</p>
//                           <div style={{ height: 5, background: t.barBg, borderRadius: 99, overflow: "hidden" }}>
//                             <div className="tf-rating-bar-track" style={{ height: "100%", borderRadius: 99, background: r.color, width: `${(r.val / 5) * 100}%` }} />
//                           </div>
//                         </div>
//                         <div style={{ width: 36, height: 28, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: `${r.color}18`, border: `1px solid ${r.color}30`, flexShrink: 0 }}>
//                           <span style={{ fontSize: 11, fontWeight: 800, color: r.color }}>{r.val}</span>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>

//                 {/* Mood Distribution */}
//                 <div style={{ ...card, padding: "22px" }}>
//                   <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
//                     <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(251,191,36,0.10)", border: "1px solid rgba(251,191,36,0.20)", display: "flex", alignItems: "center", justifyContent: "center" }}>
//                       <Smile size={15} color="#fbbf24" />
//                     </div>
//                     <span style={{ fontSize: 13, fontWeight: 700, color: t.text }}>Mood Distribution</span>
//                   </div>
//                   {moodCounts.map((m, i) => (
//                     <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, padding: "8px 12px", borderRadius: 12, background: t.actBg, border: `1px solid ${t.actBorder}` }}>
//                       <span style={{ fontSize: 20, width: 28, textAlign: "center", flexShrink: 0 }}>{m.icon}</span>
//                       <div style={{ flex: 1, minWidth: 0 }}>
//                         <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
//                           <span style={{ fontSize: 10, color: t.textMuted, fontWeight: 600 }}>{m.label}</span>
//                         </div>
//                         <div style={{ height: 5, background: t.barBg, borderRadius: 99, overflow: "hidden" }}>
//                           <div className="tf-rating-bar-track" style={{ height: "100%", borderRadius: 99, background: m.color, width: `${(m.count / m.max) * 100}%` }} />
//                         </div>
//                       </div>
//                       <div style={{ width: 28, height: 28, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: `${m.color}18`, border: `1px solid ${m.color}30`, flexShrink: 0 }}>
//                         <span style={{ fontSize: 11, fontWeight: 800, color: m.color }}>{m.count}</span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* ═══ FEEDBACK TABLE ═══ */}
//               <div style={{ ...card, overflow: "hidden" }}>
//                 {/* Table Header */}
//                 <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", borderBottom: `1px solid ${t.border}`, flexWrap: "wrap", gap: 12 }}>
//                   <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//                     <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(124,58,237,0.10)", border: "1px solid rgba(124,58,237,0.20)", display: "flex", alignItems: "center", justifyContent: "center" }}>
//                       <MessageSquare size={15} color="#7c3aed" />
//                     </div>
//                     <span style={{ fontSize: 13, fontWeight: 700, color: t.text }}>Recent Feedback</span>
//                     <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 999, background: "rgba(124,58,237,0.10)", color: "#7c3aed", border: "1px solid rgba(124,58,237,0.20)" }}>
//                       {filtered.length} entries
//                     </span>
//                   </div>
//                   {/* Filter buttons */}
//                   <div style={{ display: "flex", gap: 6 }}>
//                     <div style={{ display: "flex", alignItems: "center", gap: 6, marginRight: 4 }}>
//                       <Filter size={12} color={t.textMuted} />
//                       <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: t.textLabel }}>Filter</span>
//                     </div>
//                     {[["all", "All"], ["positive", "Positive"], ["negative", "Needs Attention"]].map(([v, l]) => (
//                       <button
//                         key={v}
//                         className="tf-filter-btn"
//                         onClick={() => setFilter(v)}
//                         style={{
//                           padding: "6px 14px", borderRadius: 10, fontSize: 11, fontWeight: 600, cursor: "pointer",
//                           fontFamily: "'Poppins',sans-serif", border: `1px solid ${filter === v ? "rgba(124,58,237,0.40)" : t.actBorder}`,
//                           background: filter === v ? "rgba(124,58,237,0.10)" : "transparent",
//                           color: filter === v ? "#7c3aed" : t.textMuted,
//                         }}
//                       >
//                         {l}
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Table */}
//                 <div style={{ overflowX: "auto" }}>
//                   <table style={{ width: "100%", borderCollapse: "collapse" }}>
//                     <thead>
//                       <tr>
//                         {["Mood", "Student", "Trainer Rating", "Tags", "Status", "Date", ""].map(h => (
//                           <th key={h} style={{ padding: "12px 20px", fontSize: 9, fontWeight: 700, color: t.textLabel, textTransform: "uppercase", letterSpacing: "0.08em", textAlign: "left", borderBottom: `1px solid ${t.border}`, fontFamily: "'Poppins',sans-serif", whiteSpace: "nowrap" }}>
//                             {h}
//                           </th>
//                         ))}
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {filtered.map(f => (
//                         <tr key={f.id} className="tf-table-row" style={{ cursor: "pointer" }}>
//                           <td style={{ padding: "14px 20px", borderBottom: `1px solid ${t.border}`, fontSize: 22, transition: "background 0.15s" }}>{f.mood}</td>
//                           <td style={{ padding: "14px 20px", borderBottom: `1px solid ${t.border}`, transition: "background 0.15s" }}>
//                             <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//                               <div style={{ width: 30, height: 30, borderRadius: 9, background: f.student === "Anonymous" ? t.actBg : "rgba(124,58,237,0.10)", border: `1px solid ${f.student === "Anonymous" ? t.actBorder : "rgba(124,58,237,0.20)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
//                                 <span style={{ fontSize: 11, fontWeight: 700, color: f.student === "Anonymous" ? t.textMuted : "#7c3aed" }}>{f.student === "Anonymous" ? "🔒" : f.student.charAt(0).toUpperCase()}</span>
//                               </div>
//                               <span style={{ fontSize: 12, fontWeight: 600, color: t.text, fontFamily: "'Poppins',sans-serif" }}>{f.student}</span>
//                             </div>
//                           </td>
//                           <td style={{ padding: "14px 20px", borderBottom: `1px solid ${t.border}`, transition: "background 0.15s" }}>
//                             <StarDisplay val={Math.round(parseFloat(avg(f)))} size={14} t={t} />
//                           </td>
//                           <td style={{ padding: "14px 20px", borderBottom: `1px solid ${t.border}`, transition: "background 0.15s" }}>
//                             <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
//                               {f.tags.slice(0, 2).map(tag => (
//                                 <span key={tag} style={{ fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 999, background: "rgba(124,58,237,0.10)", color: "#7c3aed", border: "1px solid rgba(124,58,237,0.20)", fontFamily: "'Poppins',sans-serif", whiteSpace: "nowrap" }}>{tag}</span>
//                               ))}
//                               {f.tags.length > 2 && <span style={{ fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 999, background: t.actBg, color: t.textMuted, border: `1px solid ${t.actBorder}`, fontFamily: "'Poppins',sans-serif" }}>+{f.tags.length - 2}</span>}
//                             </div>
//                           </td>
//                           <td style={{ padding: "14px 20px", borderBottom: `1px solid ${t.border}`, transition: "background 0.15s" }}>
//                             <span style={{
//                               fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 999,
//                               background: f.status === "REVIEWED" ? "rgba(52,211,153,0.10)" : "rgba(124,58,237,0.10)",
//                               color: f.status === "REVIEWED" ? "#34d399" : "#7c3aed",
//                               border: `1px solid ${f.status === "REVIEWED" ? "rgba(52,211,153,0.20)" : "rgba(124,58,237,0.20)"}`,
//                               fontFamily: "'Poppins',sans-serif",
//                             }}>
//                               {f.status === "REVIEWED" ? "✓ Reviewed" : "● New"}
//                             </span>
//                           </td>
//                           <td style={{ padding: "14px 20px", borderBottom: `1px solid ${t.border}`, transition: "background 0.15s" }}>
//                             <span style={{ fontSize: 11, color: t.textMuted, fontFamily: "'Poppins',sans-serif", fontWeight: 500 }}>{f.date}</span>
//                           </td>
//                           <td style={{ padding: "14px 20px", borderBottom: `1px solid ${t.border}`, transition: "background 0.15s" }}>
//                             <button
//                               className="tf-view-btn"
//                               onClick={() => setSelected(f)}
//                               style={{
//                                 display: "flex", alignItems: "center", gap: 5,
//                                 padding: "6px 14px", borderRadius: 10, fontSize: 11, fontWeight: 600,
//                                 border: `1px solid ${t.actBorder}`, background: "transparent",
//                                 color: t.textMuted, cursor: "pointer", fontFamily: "'Poppins',sans-serif",
//                                 transition: "all 0.2s",
//                               }}
//                             >
//                               <Eye size={12} /> View
//                             </button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                   {filtered.length === 0 && (
//                     <div style={{ padding: "48px 24px", textAlign: "center" }}>
//                       <div style={{ width: 52, height: 52, borderRadius: 14, border: `1.5px dashed ${t.emptyBorder}`, background: t.emptyBg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
//                         <MessageSquare size={22} color={t.emptyIcon} />
//                       </div>
//                       <p style={{ fontSize: 12, color: t.textMuted, fontFamily: "'Poppins',sans-serif", margin: 0 }}>No feedback found for the selected filter.</p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
//       </div>

//       {/* ═══ DETAIL MODAL ═══ */}
//       {selected && (
//         <div
//           onClick={() => setSelected(null)}
//           style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", background: t.overlayBg, backdropFilter: "blur(8px)" }}
//         >
//           <div
//             onClick={e => e.stopPropagation()}
//             className="tf-modal-overlay-inner"
//             style={{ width: "90%", maxWidth: 540, borderRadius: 24, padding: "28px", background: t.cardBg, border: `1px solid ${t.border}`, boxShadow: t.shadowHov, maxHeight: "88vh", overflowY: "auto", animation: "tfFadeUp 0.35s cubic-bezier(0.34,1.56,0.64,1)" }}
//           >
//             {/* Modal Header */}
//             <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
//               <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//                 <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(124,58,237,0.10)", border: "1px solid rgba(124,58,237,0.20)", display: "flex", alignItems: "center", justifyContent: "center" }}>
//                   <span style={{ fontSize: 18 }}>{selected.mood}</span>
//                 </div>
//                 <div>
//                   <p style={{ fontSize: 14, fontWeight: 800, color: t.text, margin: 0, fontFamily: "'Poppins',sans-serif" }}>Feedback from {selected.student}</p>
//                   <p style={{ fontSize: 10, color: t.textMuted, margin: 0, fontFamily: "'Poppins',sans-serif" }}>{selected.date}</p>
//                 </div>
//               </div>
//               <button
//                 className="tf-close-btn"
//                 onClick={() => setSelected(null)}
//                 style={{ width: 34, height: 34, borderRadius: 10, background: t.actBg, border: `1px solid ${t.actBorder}`, color: t.textMuted, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" }}
//               >
//                 <X size={15} />
//               </button>
//             </div>

//             {/* Meta chips */}
//             <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 22 }}>
//               {[
//                 `${selected.mood} ${selected.moodLabel}`,
//                 `📅 ${selected.date}`,
//                 ...(selected.student === "Anonymous" ? ["🔒 Anonymous"] : []),
//                 `⭐ ${avg(selected)}/5`,
//               ].map(chip => (
//                 <span key={chip} style={{ padding: "5px 12px", borderRadius: 999, fontSize: 10, fontWeight: 600, background: t.actBg, border: `1px solid ${t.actBorder}`, color: t.textSub, fontFamily: "'Poppins',sans-serif" }}>{chip}</span>
//               ))}
//             </div>

//             {/* Ratings */}
//             <p style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: t.textLabel, margin: "0 0 12px" }}>Trainer Ratings</p>
//             {[
//               ["Clarity of explanation", selected.clarity, "#34d399", Brain],
//               ["Doubt clearing", selected.doubt, "#22d3ee", MessageSquare],
//               ["Energy & engagement", selected.energy, "#fbbf24", Zap],
//               ["Technical depth", selected.depth, "#a78bfa", BarChart2],
//             ].map(([label, val, color, Icon]) => (
//               <div key={label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, padding: "10px 12px", borderRadius: 12, background: t.actBg, border: `1px solid ${t.actBorder}` }}>
//                 <div style={{ width: 28, height: 28, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: `${color}18`, border: `1px solid ${color}30`, flexShrink: 0 }}>
//                   <Icon size={12} color={color} />
//                 </div>
//                 <span style={{ fontSize: 11, color: t.textSub, flex: 1, fontFamily: "'Poppins',sans-serif", fontWeight: 500 }}>{label}</span>
//                 <StarDisplay val={val} size={16} t={t} />
//                 <span style={{ fontSize: 11, fontWeight: 800, color: t.text, fontFamily: "'Poppins',sans-serif", minWidth: 20, textAlign: "right" }}>{val}</span>
//               </div>
//             ))}

//             {/* Tags */}
//             {selected.tags.length > 0 && (
//               <>
//                 <p style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: t.textLabel, margin: "18px 0 10px" }}>Content Tags</p>
//                 <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18 }}>
//                   {selected.tags.map(tag => (
//                     <span key={tag} style={{ padding: "6px 14px", borderRadius: 999, fontSize: 11, fontWeight: 600, background: "rgba(124,58,237,0.10)", color: "#7c3aed", border: "1px solid rgba(124,58,237,0.22)", fontFamily: "'Poppins',sans-serif" }}>{tag}</span>
//                   ))}
//                 </div>
//               </>
//             )}

//             {/* Comment */}
//             {selected.comment && (
//               <>
//                 <p style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: t.textLabel, margin: "0 0 10px" }}>Comment</p>
//                 <div style={{ padding: "14px 16px", borderRadius: 14, background: t.actBg, border: `1px solid ${t.actBorder}`, fontSize: 12, color: t.textSub, lineHeight: 1.7, fontStyle: "italic", marginBottom: 20, fontFamily: "'Poppins',sans-serif" }}>
//                   "{selected.comment}"
//                 </div>
//               </>
//             )}

//             {/* Actions */}
//             <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
//               <button
//                 onClick={() => handleMarkReviewed(selected)}
//                 style={{ flex: 1, padding: "12px", borderRadius: 12, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Poppins',sans-serif", border: "1px solid rgba(52,211,153,0.30)", background: "rgba(52,211,153,0.08)", color: "#34d399", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "all 0.2s" }}
//               >
//                 <CheckCircle size={14} /> Mark as Reviewed
//               </button>
//               <button
//                 onClick={() => setSelected(null)}
//                 style={{ flex: 1, padding: "12px", borderRadius: 12, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Poppins',sans-serif", border: `1px solid ${t.actBorder}`, background: "transparent", color: t.textMuted, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "all 0.2s" }}
//               >
//                 <Archive size={14} /> Archive
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }





















import { useState, useEffect } from "react";
import {
  getMyTrainerFeedbackByBatch,
  getMyTrainerSummary,
  updateFeedbackStatus,
} from "../services/chatService";
import { getTrainerBatches } from "../services/batchService";
import {
  MessageSquare, Star, TrendingUp, Users, ChevronDown,
  X, CheckCircle, Archive, BarChart2, Smile, Activity,
  Filter, Eye, GraduationCap, Brain, Zap, ClipboardList,
} from "lucide-react";

const T = {
  dark: {
    pageBg: "#0a0a0a", cardBg: "#111111", cardBgHov: "#161616",
    border: "rgba(255,255,255,0.06)", borderHov: "rgba(255,255,255,0.14)",
    text: "#ffffff", textSub: "rgba(255,255,255,0.3)", textMuted: "rgba(255,255,255,0.2)",
    textLabel: "rgba(255,255,255,0.22)",
    pillBg: "rgba(255,255,255,0.04)", pillBorder: "rgba(255,255,255,0.07)", pillText: "rgba(255,255,255,0.25)",
    emptyBorder: "rgba(255,255,255,0.07)", emptyBg: "rgba(255,255,255,0.02)", emptyIcon: "rgba(255,255,255,0.12)",
    barBg: "rgba(255,255,255,0.05)",
    actBg: "rgba(255,255,255,0.04)", actBorder: "rgba(255,255,255,0.07)",
    recentItemBg: "rgba(255,255,255,0.03)", recentItemBorder: "rgba(255,255,255,0.05)",
    recentItemBgHov: "rgba(255,255,255,0.06)",
    shadow: "0 4px 20px rgba(0,0,0,0.4)", shadowHov: "0 20px 60px rgba(0,0,0,0.6)",
    overlayBg: "rgba(0,0,0,0.75)",
    starEmpty: "rgba(255,255,255,0.1)",
  },
  light: {
    pageBg: "#f1f5f9", cardBg: "#ffffff", cardBgHov: "#f8fafc",
    border: "#e2e8f0", borderHov: "#cbd5e1",
    text: "#0f172a", textSub: "#64748b", textMuted: "#94a3b8", textLabel: "#94a3b8",
    pillBg: "#f1f5f9", pillBorder: "#e2e8f0", pillText: "#94a3b8",
    emptyBorder: "#e2e8f0", emptyBg: "#f8fafc", emptyIcon: "#cbd5e1",
    barBg: "#f1f5f9",
    actBg: "#f8fafc", actBorder: "#e2e8f0",
    recentItemBg: "#f8fafc", recentItemBorder: "#e2e8f0",
    recentItemBgHov: "#f1f5f9",
    shadow: "0 1px 8px rgba(0,0,0,0.07)", shadowHov: "0 8px 32px rgba(0,0,0,0.10)",
    overlayBg: "rgba(0,0,0,0.45)",
    starEmpty: "#e2e8f0",
  },
};

const MOCK = [
  { id: 1, mood: "🤩", moodLabel: "AMAZING", student: "Anonymous", clarity: 5, doubt: 4, energy: 5, depth: 4, tags: ["Just right", "Great demos"], comment: "Best session so far! Loved the Spring Boot deep dive.", status: "SUBMITTED", date: "Apr 15" },
  { id: 2, mood: "😊", moodLabel: "GOOD", student: "Priya M.", clarity: 4, doubt: 4, energy: 4, depth: 3, tags: ["Just right", "More examples needed"], comment: "", status: "REVIEWED", date: "Apr 15" },
  { id: 3, mood: "😐", moodLabel: "FINE", student: "Anonymous", clarity: 3, doubt: 2, energy: 3, depth: 3, tags: ["Too fast"], comment: "Needs to slow down during JPA mapping.", status: "SUBMITTED", date: "Apr 14" },
  { id: 4, mood: "😞", moodLabel: "POOR", student: "Anonymous", clarity: 2, doubt: 1, energy: 2, depth: 2, tags: ["Hard to follow", "Too fast"], comment: "Couldn't understand the Kafka consumer part at all.", status: "SUBMITTED", date: "Apr 14" },
  { id: 5, mood: "🤩", moodLabel: "AMAZING", student: "Ravi K.", clarity: 5, doubt: 5, energy: 5, depth: 5, tags: ["Just right", "Great demos"], comment: "Absolutely loved it. Keep it up!", status: "REVIEWED", date: "Apr 13" },
  { id: 6, mood: "😊", moodLabel: "GOOD", student: "Anonymous", clarity: 4, doubt: 3, energy: 4, depth: 4, tags: ["Notes & resources"], comment: "Please share slides after class.", status: "SUBMITTED", date: "Apr 13" },
];

const isDarkFn = () =>
  typeof document !== "undefined" &&
  (document.documentElement.classList.contains("dark") ||
   document.documentElement.getAttribute("data-theme") === "dark" ||
   window.matchMedia("(prefers-color-scheme: dark)").matches);

function avg(f) {
  return ((f.clarity + f.doubt + f.energy + f.depth) / 4).toFixed(1);
}

function useCountUp(target, duration = 1000) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!target || isNaN(target)) { setVal(target); return; }
    let start = null;
    const num = parseFloat(target);
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(Number((p * num).toFixed(1)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target]);
  return val;
}

function StarDisplay({ val, size = 14, t }) {
  return (
    <div style={{ display: "flex", gap: 3 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24"
          fill={i <= val ? "#f59e0b" : "none"}
          stroke={i <= val ? "#f59e0b" : t?.starEmpty || "#e2e8f0"}
          strokeWidth="1.5">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
    </div>
  );
}

function StatCard({ label, value, sub, fill, color, icon: Icon, index, t }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? t.cardBgHov : t.cardBg,
        border: `1px solid ${hov ? t.borderHov : t.border}`,
        borderRadius: 20, padding: "22px 22px 20px",
        display: "flex", flexDirection: "column", gap: 14,
        cursor: "default", transition: "all 0.25s ease",
        position: "relative", overflow: "hidden",
        boxShadow: hov ? `${t.shadowHov}, 0 0 40px ${color}12` : t.shadow,
      }}
    >
      <div style={{ position: "absolute", top: -20, right: -20, width: 90, height: 90, borderRadius: "50%", background: color, filter: "blur(40px)", opacity: hov ? 0.15 : 0.04, transition: "opacity 0.4s", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, borderRadius: "20px 20px 0 0", background: color, opacity: 0.75 }} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 4 }}>
        <div style={{ width: 42, height: 42, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", background: `${color}18`, border: `1px solid ${color}30` }}>
          <Icon size={19} color={color} strokeWidth={2} />
        </div>
        <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 14, opacity: hov ? 0.7 : 0.3, transition: "opacity 0.2s" }}>
          <span style={{ width: 3, height: 8, borderRadius: 2, background: color, display: "block" }} />
          <span style={{ width: 3, height: 14, borderRadius: 2, background: color, display: "block" }} />
          <span style={{ width: 3, height: 6, borderRadius: 2, background: color, display: "block" }} />
        </div>
      </div>
      <div>
        <p style={{ fontSize: "clamp(28px,5vw,40px)", fontWeight: 800, lineHeight: 1, fontFamily: "'Poppins',sans-serif", color: t.text, margin: 0 }}>{value}</p>
        <p style={{ fontSize: 10, marginTop: 6, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: t.textMuted, fontFamily: "'Poppins',sans-serif", margin: "6px 0 0" }}>{label}</p>
      </div>
      <div style={{ height: 2, background: t.barBg, borderRadius: 99, overflow: "hidden" }}>
        <div style={{ height: "100%", borderRadius: 99, background: color, width: hov ? fill : "20%", transition: "width 0.65s ease", opacity: 0.85 }} />
      </div>
      <p style={{ fontSize: 11, color: t.textMuted, fontFamily: "'Poppins',sans-serif", margin: 0 }}>{sub}</p>
    </div>
  );
}

export default function TrainerFeedback() {
  const [dark, setDark] = useState(isDarkFn);
  const t = dark ? T.dark : T.light;

  useEffect(() => {
    const obs = new MutationObserver(() => setDark(isDarkFn()));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
    return () => obs.disconnect();
  }, []);

  const [batches, setBatches] = useState([]);
  const [selectedBatchId, setSelectedBatchId] = useState(null);
  const [feedbackList, setFeedbackList] = useState(MOCK);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  useEffect(() => {
    getTrainerBatches()
      .then(data => {
        const list = Array.isArray(data) ? data : [];
        setBatches(list);
        if (list.length > 0) setSelectedBatchId(list[0].id);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedBatchId) return;
    setLoadingFeedback(true);
    getMyTrainerFeedbackByBatch(selectedBatchId)
      .then(r => {
        const moodMap = { AMAZING: "🤩", GOOD: "😊", FINE: "😐", OKAY: "😕", POOR: "😞" };
        setFeedbackList(r.data.map(f => {
          const moodKey = (f.moodRating || "").toUpperCase().trim();
          return {
            id: f.id, moodLabel: moodKey, mood: moodMap[moodKey] || "😐",
            student: f.studentEmail || "Anonymous",
            clarity: f.trainerClarityRating || 0, doubt: f.trainerDoubtClearingRating || 0,
            energy: f.trainerEnergyRating || 0, depth: f.trainerTechnicalDepthRating || 0,
            tags: f.contentTags || [], comment: f.comment || "",
            status: f.status, date: new Date(f.createdAt).toLocaleDateString(),
          };
        }));
      })
      .catch(() => setFeedbackList(MOCK))
      .finally(() => setLoadingFeedback(false));
  }, [selectedBatchId]);

  const filtered = feedbackList.filter(f => {
    if (filter === "positive") return f.clarity >= 4 && f.doubt >= 4;
    if (filter === "negative") return f.clarity <= 3 || f.doubt <= 2;
    return true;
  });

  async function handleMarkReviewed(f) {
    try { await updateFeedbackStatus(f.id, "REVIEWED"); } catch {}
    setFeedbackList(prev => prev.map(x => x.id === f.id ? { ...x, status: "REVIEWED" } : x));
    setSelected(null);
  }

  const statAvg = feedbackList.length
    ? (feedbackList.reduce((s, f) => s + parseFloat(avg(f)), 0) / feedbackList.length).toFixed(1) : "—";
  const anonymousCount = feedbackList.filter(f => f.student === "Anonymous").length;
  const anonPct = feedbackList.length ? Math.round((anonymousCount / feedbackList.length) * 100) : 0;
  const clarityAvg = feedbackList.length ? (feedbackList.reduce((s, f) => s + f.clarity, 0) / feedbackList.length).toFixed(1) : 0;
  const doubtAvg = feedbackList.length ? (feedbackList.reduce((s, f) => s + f.doubt, 0) / feedbackList.length).toFixed(1) : 0;
  const energyAvg = feedbackList.length ? (feedbackList.reduce((s, f) => s + f.energy, 0) / feedbackList.length).toFixed(1) : 0;
  const depthAvg = feedbackList.length ? (feedbackList.reduce((s, f) => s + f.depth, 0) / feedbackList.length).toFixed(1) : 0;

  const moodCounts = [
    { icon: "🤩", label: "Amazing", key: "AMAZING", color: "#a78bfa" },
    { icon: "😊", label: "Good", key: "GOOD", color: "#34d399" },
    { icon: "😐", label: "Fine", key: "FINE", color: "#fbbf24" },
    { icon: "😕", label: "Okay", key: "OKAY", color: "#fb923c" },
    { icon: "😞", label: "Poor", key: "POOR", color: "#f87171" },
  ].map(m => ({ ...m, count: feedbackList.filter(f => f.moodLabel === m.key).length, max: feedbackList.length || 1 }));

  const ratingRows = [
    { label: "Clarity of explanation", val: parseFloat(clarityAvg), color: "#34d399", icon: Brain },
    { label: "Doubt clearing", val: parseFloat(doubtAvg), color: "#22d3ee", icon: MessageSquare },
    { label: "Energy & engagement", val: parseFloat(energyAvg), color: "#fbbf24", icon: Zap },
    { label: "Technical depth", val: parseFloat(depthAvg), color: "#a78bfa", icon: BarChart2 },
  ];

  const stats = [
    { label: "Total Feedback", value: feedbackList.length, sub: `${filtered.length} visible`, fill: "80%", color: "#22d3ee", icon: MessageSquare },
    { label: "Overall Rating", value: statAvg, sub: "Out of 5.0", fill: `${(parseFloat(statAvg) / 5) * 100}%`, color: "#34d399", icon: Star },
    { label: "Avg Mood Score", value: "3.9", sub: "🤩 38% Amazing", fill: "78%", color: "#fbbf24", icon: Smile },
    { label: "Anonymous Rate", value: `${anonPct}%`, sub: `${anonymousCount} anonymous`, fill: `${anonPct}%`, color: "#a78bfa", icon: Users },
  ];

  const card = { background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 20, boxShadow: t.shadow };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        @keyframes tfFadeUp { from { opacity:0; transform:translateY(14px) } to { opacity:1; transform:translateY(0) } }
        @keyframes tfPulseRing { 0%{box-shadow:0 0 0 0 rgba(124,58,237,0.5)} 70%{box-shadow:0 0 0 8px rgba(124,58,237,0)} 100%{box-shadow:0 0 0 0 rgba(124,58,237,0)} }
        @keyframes tfPulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes tfBlink { 0%,100%{opacity:1} 50%{opacity:0.15} }
        .tf-fade { animation: tfFadeUp 0.45s ease both; }
        .tf-live { animation: tfPulseRing 2.2s ease-out infinite; }
        .tf-d1 { animation: tfBlink 1.6s ease infinite; }
        .tf-d2 { animation: tfBlink 1.6s 0.3s ease infinite; }
        .tf-d3 { animation: tfBlink 1.6s 0.6s ease infinite; }
        .tf-table-row:hover td { background: ${t.recentItemBgHov}; }
        .tf-view-btn:hover { border-color: rgba(124,58,237,0.4) !important; color: #a78bfa !important; transform: translateY(-1px); }
        .tf-filter-btn { transition: all 0.2s; }
        .tf-close-btn:hover { background: ${t.borderHov} !important; }
        .tf-select:focus { outline: none; }
        .tf-rating-bar-track { transition: width 0.7s ease; }
        .tf-modal-overlay-inner::-webkit-scrollbar { width: 4px; }
        .tf-modal-overlay-inner::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

        /* ── RESPONSIVE ── */
        .tf-hero-row {
          display: flex; align-items: center;
          justify-content: space-between;
          flex-wrap: wrap; gap: 16px;
        }
        .tf-hero-right {
          display: flex; align-items: center;
          gap: 10px; flex-wrap: wrap;
        }
        .tf-mid-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px; margin-bottom: 20px;
        }
        .tf-stat-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 14px; margin-bottom: 20px;
        }
        .tf-table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
        .tf-table-head-row th { white-space: nowrap; }
        .tf-tag-pill { white-space: nowrap; }
        .tf-stats-pill { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .tf-stats-pill-sep { width: 1px; height: 14px; background: ${t.actBorder}; }

        @media (max-width: 900px) {
          .tf-mid-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .tf-hero-right { width: 100%; }
          .tf-stats-pill { gap: 8px; font-size: 10px !important; }
          .tf-table-header-wrap {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
          .tf-filter-row { flex-wrap: wrap; gap: 6px; }
          .tf-batch-selector { width: 100%; }
        }
        @media (max-width: 420px) {
          .tf-live { display: none; }
          .tf-activity-bars { display: none; }
        }
      `}</style>

      <div style={{ fontFamily: "'Poppins',sans-serif", minHeight: "100vh", background: t.pageBg, color: t.text, transition: "background 0.3s, color 0.3s" }}>
        <div style={{ maxWidth: 1300, margin: "0 auto", padding: "clamp(14px,3vw,28px) clamp(12px,3vw,28px) 60px" }}>

          {/* ═══ HERO ═══ */}
          <div className="tf-fade" style={{ ...card, padding: "clamp(16px,3vw,26px) clamp(16px,4vw,30px)", marginBottom: 20 }}>
            <div className="tf-hero-row">

              {/* Left */}
              <div style={{ minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 34, height: 34, flexShrink: 0, borderRadius: 10, background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.22)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <ClipboardList size={16} color="#7c3aed" />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div className="tf-d1" style={{ width: 6, height: 6, borderRadius: "50%", background: "#7c3aed", flexShrink: 0 }} />
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: t.textSub }}>Trainer Portal</span>
                  </div>
                </div>

                {/* ── UPDATED HERO TITLE ── */}
                <h1
                style={{
                fontSize: "clamp(1.3rem,3vw,1.9rem)",
                fontWeight: 700,
                margin: "0 0 5px",
                letterSpacing: "-0.02em",
              lineHeight: 1.15,
              }}
              >
              {/* Dark Text */}
              <span
  style={{
    color: t.text,
  }}
>
  Feedback
</span>{" "}
            

             {/* Blue Gradient Text */}
             <span
             style={{
             background: "linear-gradient(135deg,#7c83ff,#60a5fa)",
             WebkitBackgroundClip: "text",
             WebkitTextFillColor: "transparent",
             backgroundClip: "text",
             }}
             >
            Dashboard
            </span>
</h1>

<p
  style={{
    fontSize: "clamp(11px,1.8vw,12px)",
    color: t.textSub,
    margin: 0,
    fontWeight: 500,
  }}
>
  Aggregated student feedback for your sessions
</p>
              </div>

              {/* Right */}
              <div className="tf-hero-right">
                {/* Stats pill */}
                <div className="tf-stats-pill" style={{ background: t.actBg, border: `1px solid ${t.actBorder}`, borderRadius: 12, padding: "8px 16px", fontSize: 11, fontWeight: 600, fontFamily: "'Poppins',sans-serif", color: t.textSub }}>
                  <span>{feedbackList.length} responses</span>
                  <span className="tf-stats-pill-sep" />
                  <span>{feedbackList.filter(f => f.status === "REVIEWED").length} reviewed</span>
                  <span className="tf-stats-pill-sep" />
                  <span style={{ color: "#34d399", fontWeight: 700 }}>⭐ {statAvg}/5</span>
                </div>

                {/* Activity bars */}
                <div className="tf-activity-bars" style={{ display: "flex", alignItems: "center", gap: 8, background: t.actBg, border: `1px solid ${t.actBorder}`, borderRadius: 10, padding: "8px 12px" }}>
                  <Activity size={12} color={t.textMuted} />
                  <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 14 }}>
                    <span className="tf-d1" style={{ width: 3, height: 10, borderRadius: 2, background: t.textMuted, display: "block", opacity: 0.5 }} />
                    <span className="tf-d2" style={{ width: 3, height: 14, borderRadius: 2, background: t.textMuted, display: "block", opacity: 0.5 }} />
                    <span className="tf-d3" style={{ width: 3, height: 7, borderRadius: 2, background: t.textMuted, display: "block", opacity: 0.5 }} />
                  </div>
                </div>

                {/* Batch selector */}
                <div className="tf-batch-selector" style={{ display: "flex", alignItems: "center", gap: 8, background: t.actBg, border: `1px solid ${t.actBorder}`, borderRadius: 12, padding: "8px 14px", cursor: "pointer" }}>
                  <GraduationCap size={14} color="#7c3aed" style={{ flexShrink: 0 }} />
                  <select
                    className="tf-select"
                    value={selectedBatchId ?? ""}
                    onChange={e => setSelectedBatchId(Number(e.target.value))}
                    style={{ background: "transparent", border: "none", color: t.text, fontFamily: "'Poppins',sans-serif", fontSize: 12, fontWeight: 600, cursor: "pointer", outline: "none", minWidth: 0, flex: 1 }}
                  >
                    {batches.length === 0 && <option value="">No batches assigned</option>}
                    {batches.map(b => <option key={b.id} value={b.id}>{b.name || `Batch #${b.id}`}</option>)}
                  </select>
                  <ChevronDown size={12} color={t.textMuted} style={{ flexShrink: 0 }} />
                </div>

                {/* Live badge */}
                <div className="tf-live" style={{ display: "flex", alignItems: "center", gap: 7, background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.28)", borderRadius: 999, padding: "7px 16px", color: "#7c3aed", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", whiteSpace: "nowrap" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#7c3aed", display: "inline-block", flexShrink: 0 }} />LIVE
                </div>
              </div>
            </div>
          </div>

          {loadingFeedback ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 260, gap: 16 }}>
              <div style={{ fontSize: 36, animation: "tfPulse 2s infinite" }}>⏳</div>
              <p style={{ fontSize: 13, color: t.textMuted, fontFamily: "'Poppins',sans-serif" }}>Loading feedback…</p>
            </div>
          ) : (
            <>
              {/* ═══ STAT CARDS ═══ */}
              <div className="tf-stat-grid">
                {stats.map((s, i) => <StatCard key={i} {...s} index={i} t={t} />)}
              </div>

              {/* ═══ MID PANELS ═══ */}
              <div className="tf-mid-grid">

                {/* Rating Breakdown */}
                <div style={{ ...card, padding: "clamp(14px,2.5vw,22px)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                    <div style={{ width: 34, height: 34, flexShrink: 0, borderRadius: 10, background: "rgba(52,211,153,0.10)", border: "1px solid rgba(52,211,153,0.20)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <BarChart2 size={15} color="#34d399" />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: t.text }}>Rating Breakdown</span>
                  </div>
                  {ratingRows.map((r, i) => {
                    const Icon = r.icon;
                    return (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, padding: "10px 12px", borderRadius: 12, background: t.actBg, border: `1px solid ${t.actBorder}` }}>
                        <div style={{ width: 30, height: 30, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", background: `${r.color}18`, border: `1px solid ${r.color}30`, flexShrink: 0 }}>
                          <Icon size={13} color={r.color} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 10, color: t.textMuted, margin: "0 0 5px", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.label}</p>
                          <div style={{ height: 5, background: t.barBg, borderRadius: 99, overflow: "hidden" }}>
                            <div className="tf-rating-bar-track" style={{ height: "100%", borderRadius: 99, background: r.color, width: `${(r.val / 5) * 100}%` }} />
                          </div>
                        </div>
                        <div style={{ width: 36, height: 28, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: `${r.color}18`, border: `1px solid ${r.color}30`, flexShrink: 0 }}>
                          <span style={{ fontSize: 11, fontWeight: 800, color: r.color }}>{r.val}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Mood Distribution */}
                <div style={{ ...card, padding: "clamp(14px,2.5vw,22px)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                    <div style={{ width: 34, height: 34, flexShrink: 0, borderRadius: 10, background: "rgba(251,191,36,0.10)", border: "1px solid rgba(251,191,36,0.20)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Smile size={15} color="#fbbf24" />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: t.text }}>Mood Distribution</span>
                  </div>
                  {moodCounts.map((m, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, padding: "8px 12px", borderRadius: 12, background: t.actBg, border: `1px solid ${t.actBorder}` }}>
                      <span style={{ fontSize: 20, width: 28, textAlign: "center", flexShrink: 0 }}>{m.icon}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                          <span style={{ fontSize: 10, color: t.textMuted, fontWeight: 600 }}>{m.label}</span>
                        </div>
                        <div style={{ height: 5, background: t.barBg, borderRadius: 99, overflow: "hidden" }}>
                          <div className="tf-rating-bar-track" style={{ height: "100%", borderRadius: 99, background: m.color, width: `${(m.count / m.max) * 100}%` }} />
                        </div>
                      </div>
                      <div style={{ width: 28, height: 28, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: `${m.color}18`, border: `1px solid ${m.color}30`, flexShrink: 0 }}>
                        <span style={{ fontSize: 11, fontWeight: 800, color: m.color }}>{m.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ═══ FEEDBACK TABLE ═══ */}
              <div style={{ ...card, overflow: "hidden" }}>
                {/* Table Header */}
                <div className="tf-table-header-wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "clamp(12px,2vw,18px) clamp(14px,3vw,24px)", borderBottom: `1px solid ${t.border}`, flexWrap: "wrap", gap: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 34, height: 34, flexShrink: 0, borderRadius: 10, background: "rgba(124,58,237,0.10)", border: "1px solid rgba(124,58,237,0.20)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <MessageSquare size={15} color="#7c3aed" />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: t.text }}>Recent Feedback</span>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 999, background: "rgba(124,58,237,0.10)", color: "#7c3aed", border: "1px solid rgba(124,58,237,0.20)", whiteSpace: "nowrap" }}>
                      {filtered.length} entries
                    </span>
                  </div>
                  {/* Filter buttons */}
                  <div className="tf-filter-row" style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginRight: 4 }}>
                      <Filter size={12} color={t.textMuted} />
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: t.textLabel, whiteSpace: "nowrap" }}>Filter</span>
                    </div>
                    {[["all", "All"], ["positive", "Positive"], ["negative", "Needs Attention"]].map(([v, l]) => (
                      <button
                        key={v}
                        className="tf-filter-btn"
                        onClick={() => setFilter(v)}
                        style={{
                          padding: "6px 14px", borderRadius: 10, fontSize: 11, fontWeight: 600, cursor: "pointer",
                          fontFamily: "'Poppins',sans-serif", border: `1px solid ${filter === v ? "rgba(124,58,237,0.40)" : t.actBorder}`,
                          background: filter === v ? "rgba(124,58,237,0.10)" : "transparent",
                          color: filter === v ? "#7c3aed" : t.textMuted,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Table */}
                <div className="tf-table-wrap">
                  <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
                    <thead>
                      <tr className="tf-table-head-row">
                        {["Mood", "Student", "Trainer Rating", "Tags", "Status", "Date", ""].map(h => (
                          <th key={h} style={{ padding: "12px clamp(10px,2vw,20px)", fontSize: 9, fontWeight: 700, color: t.textLabel, textTransform: "uppercase", letterSpacing: "0.08em", textAlign: "left", borderBottom: `1px solid ${t.border}`, fontFamily: "'Poppins',sans-serif", whiteSpace: "nowrap" }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map(f => (
                        <tr key={f.id} className="tf-table-row" style={{ cursor: "pointer" }}>
                          <td style={{ padding: "14px clamp(10px,2vw,20px)", borderBottom: `1px solid ${t.border}`, fontSize: 22, transition: "background 0.15s" }}>{f.mood}</td>
                          <td style={{ padding: "14px clamp(10px,2vw,20px)", borderBottom: `1px solid ${t.border}`, transition: "background 0.15s" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <div style={{ width: 30, height: 30, flexShrink: 0, borderRadius: 9, background: f.student === "Anonymous" ? t.actBg : "rgba(124,58,237,0.10)", border: `1px solid ${f.student === "Anonymous" ? t.actBorder : "rgba(124,58,237,0.20)"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <span style={{ fontSize: 11, fontWeight: 700, color: f.student === "Anonymous" ? t.textMuted : "#7c3aed" }}>{f.student === "Anonymous" ? "🔒" : f.student.charAt(0).toUpperCase()}</span>
                              </div>
                              <span style={{ fontSize: 12, fontWeight: 600, color: t.text, fontFamily: "'Poppins',sans-serif", whiteSpace: "nowrap" }}>{f.student}</span>
                            </div>
                          </td>
                          <td style={{ padding: "14px clamp(10px,2vw,20px)", borderBottom: `1px solid ${t.border}`, transition: "background 0.15s" }}>
                            <StarDisplay val={Math.round(parseFloat(avg(f)))} size={14} t={t} />
                          </td>
                          <td style={{ padding: "14px clamp(10px,2vw,20px)", borderBottom: `1px solid ${t.border}`, transition: "background 0.15s" }}>
                            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                              {f.tags.slice(0, 2).map(tag => (
                                <span key={tag} className="tf-tag-pill" style={{ fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 999, background: "rgba(124,58,237,0.10)", color: "#7c3aed", border: "1px solid rgba(124,58,237,0.20)", fontFamily: "'Poppins',sans-serif" }}>{tag}</span>
                              ))}
                              {f.tags.length > 2 && <span style={{ fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 999, background: t.actBg, color: t.textMuted, border: `1px solid ${t.actBorder}`, fontFamily: "'Poppins',sans-serif" }}>+{f.tags.length - 2}</span>}
                            </div>
                          </td>
                          <td style={{ padding: "14px clamp(10px,2vw,20px)", borderBottom: `1px solid ${t.border}`, transition: "background 0.15s" }}>
                            <span style={{
                              fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 999,
                              background: f.status === "REVIEWED" ? "rgba(52,211,153,0.10)" : "rgba(124,58,237,0.10)",
                              color: f.status === "REVIEWED" ? "#34d399" : "#7c3aed",
                              border: `1px solid ${f.status === "REVIEWED" ? "rgba(52,211,153,0.20)" : "rgba(124,58,237,0.20)"}`,
                              fontFamily: "'Poppins',sans-serif", whiteSpace: "nowrap",
                            }}>
                              {f.status === "REVIEWED" ? "✓ Reviewed" : "● New"}
                            </span>
                          </td>
                          <td style={{ padding: "14px clamp(10px,2vw,20px)", borderBottom: `1px solid ${t.border}`, transition: "background 0.15s" }}>
                            <span style={{ fontSize: 11, color: t.textMuted, fontFamily: "'Poppins',sans-serif", fontWeight: 500, whiteSpace: "nowrap" }}>{f.date}</span>
                          </td>
                          <td style={{ padding: "14px clamp(10px,2vw,20px)", borderBottom: `1px solid ${t.border}`, transition: "background 0.15s" }}>
                            <button
                              className="tf-view-btn"
                              onClick={() => setSelected(f)}
                              style={{
                                display: "flex", alignItems: "center", gap: 5,
                                padding: "6px 14px", borderRadius: 10, fontSize: 11, fontWeight: 600,
                                border: `1px solid ${t.actBorder}`, background: "transparent",
                                color: t.textMuted, cursor: "pointer", fontFamily: "'Poppins',sans-serif",
                                transition: "all 0.2s", whiteSpace: "nowrap",
                              }}
                            >
                              <Eye size={12} /> View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filtered.length === 0 && (
                    <div style={{ padding: "48px 24px", textAlign: "center" }}>
                      <div style={{ width: 52, height: 52, borderRadius: 14, border: `1.5px dashed ${t.emptyBorder}`, background: t.emptyBg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                        <MessageSquare size={22} color={t.emptyIcon} />
                      </div>
                      <p style={{ fontSize: 12, color: t.textMuted, fontFamily: "'Poppins',sans-serif", margin: 0 }}>No feedback found for the selected filter.</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ═══ DETAIL MODAL ═══ */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", background: t.overlayBg, backdropFilter: "blur(8px)", padding: "16px" }}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="tf-modal-overlay-inner"
            style={{ width: "100%", maxWidth: 540, borderRadius: 24, padding: "clamp(18px,4vw,28px)", background: t.cardBg, border: `1px solid ${t.border}`, boxShadow: t.shadowHov, maxHeight: "90vh", overflowY: "auto", animation: "tfFadeUp 0.35s cubic-bezier(0.34,1.56,0.64,1)" }}
          >
            {/* Modal Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                <div style={{ width: 40, height: 40, flexShrink: 0, borderRadius: 12, background: "rgba(124,58,237,0.10)", border: "1px solid rgba(124,58,237,0.20)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 18 }}>{selected.mood}</span>
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 800, color: t.text, margin: 0, fontFamily: "'Poppins',sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Feedback from {selected.student}</p>
                  <p style={{ fontSize: 10, color: t.textMuted, margin: 0, fontFamily: "'Poppins',sans-serif" }}>{selected.date}</p>
                </div>
              </div>
              <button
                className="tf-close-btn"
                onClick={() => setSelected(null)}
                style={{ width: 34, height: 34, flexShrink: 0, borderRadius: 10, background: t.actBg, border: `1px solid ${t.actBorder}`, color: t.textMuted, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" }}
              >
                <X size={15} />
              </button>
            </div>

            {/* Meta chips */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 22 }}>
              {[
                `${selected.mood} ${selected.moodLabel}`,
                `📅 ${selected.date}`,
                ...(selected.student === "Anonymous" ? ["🔒 Anonymous"] : []),
                `⭐ ${avg(selected)}/5`,
              ].map(chip => (
                <span key={chip} style={{ padding: "5px 12px", borderRadius: 999, fontSize: 10, fontWeight: 600, background: t.actBg, border: `1px solid ${t.actBorder}`, color: t.textSub, fontFamily: "'Poppins',sans-serif" }}>{chip}</span>
              ))}
            </div>

            {/* Ratings */}
            <p style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: t.textLabel, margin: "0 0 12px" }}>Trainer Ratings</p>
            {[
              ["Clarity of explanation", selected.clarity, "#34d399", Brain],
              ["Doubt clearing", selected.doubt, "#22d3ee", MessageSquare],
              ["Energy & engagement", selected.energy, "#fbbf24", Zap],
              ["Technical depth", selected.depth, "#a78bfa", BarChart2],
            ].map(([label, val, color, Icon]) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, padding: "10px 12px", borderRadius: 12, background: t.actBg, border: `1px solid ${t.actBorder}` }}>
                <div style={{ width: 28, height: 28, flexShrink: 0, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: `${color}18`, border: `1px solid ${color}30` }}>
                  <Icon size={12} color={color} />
                </div>
                <span style={{ fontSize: 11, color: t.textSub, flex: 1, fontFamily: "'Poppins',sans-serif", fontWeight: 500, minWidth: 0 }}>{label}</span>
                <StarDisplay val={val} size={16} t={t} />
                <span style={{ fontSize: 11, fontWeight: 800, color: t.text, fontFamily: "'Poppins',sans-serif", minWidth: 20, textAlign: "right" }}>{val}</span>
              </div>
            ))}

            {/* Tags */}
            {selected.tags.length > 0 && (
              <>
                <p style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: t.textLabel, margin: "18px 0 10px" }}>Content Tags</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18 }}>
                  {selected.tags.map(tag => (
                    <span key={tag} style={{ padding: "6px 14px", borderRadius: 999, fontSize: 11, fontWeight: 600, background: "rgba(124,58,237,0.10)", color: "#7c3aed", border: "1px solid rgba(124,58,237,0.22)", fontFamily: "'Poppins',sans-serif" }}>{tag}</span>
                  ))}
                </div>
              </>
            )}

            {/* Comment */}
            {selected.comment && (
              <>
                <p style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: t.textLabel, margin: "0 0 10px" }}>Comment</p>
                <div style={{ padding: "14px 16px", borderRadius: 14, background: t.actBg, border: `1px solid ${t.actBorder}`, fontSize: 12, color: t.textSub, lineHeight: 1.7, fontStyle: "italic", marginBottom: 20, fontFamily: "'Poppins',sans-serif" }}>
                  "{selected.comment}"
                </div>
              </>
            )}

            {/* Actions */}
            <div style={{ display: "flex", gap: 10, marginTop: 4, flexWrap: "wrap" }}>
              <button
                onClick={() => handleMarkReviewed(selected)}
                style={{ flex: 1, minWidth: 140, padding: "12px", borderRadius: 12, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Poppins',sans-serif", border: "1px solid rgba(52,211,153,0.30)", background: "rgba(52,211,153,0.08)", color: "#34d399", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "all 0.2s" }}
              >
                <CheckCircle size={14} /> Mark as Reviewed
              </button>
              <button
                onClick={() => setSelected(null)}
                style={{ flex: 1, minWidth: 140, padding: "12px", borderRadius: 12, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Poppins',sans-serif", border: `1px solid ${t.actBorder}`, background: "transparent", color: t.textMuted, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "all 0.2s" }}
              >
                <Archive size={14} /> Archive
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}