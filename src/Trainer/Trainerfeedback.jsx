
// import { useState, useEffect } from "react";
// import {
//   getMyTrainerFeedbackByBatch,
//   getMyTrainerSummary,
//   updateFeedbackStatus,
// } from "../services/chatService";
// import { getTrainerBatches } from "../services/batchService";

// const MOCK = [
//   {
//     id: 1,
//     mood: "🤩",
//     moodLabel: "Amazing",
//     student: "Anonymous",
//     clarity: 5,
//     doubt: 4,
//     energy: 5,
//     depth: 4,
//     tags: ["Just right", "Great demos"],
//     comment: "Best session so far! Loved the Spring Boot deep dive.",
//     status: "SUBMITTED",
//     date: "Apr 15",
//   },
//   {
//     id: 2,
//     mood: "😊",
//     moodLabel: "Good",
//     student: "Priya M.",
//     clarity: 4,
//     doubt: 4,
//     energy: 4,
//     depth: 3,
//     tags: ["Just right", "More examples needed"],
//     comment: "",
//     status: "REVIEWED",
//     date: "Apr 15",
//   },
//   {
//     id: 3,
//     mood: "😐",
//     moodLabel: "Fine",
//     student: "Anonymous",
//     clarity: 3,
//     doubt: 2,
//     energy: 3,
//     depth: 3,
//     tags: ["Too fast"],
//     comment: "Needs to slow down during JPA mapping.",
//     status: "SUBMITTED",
//     date: "Apr 14",
//   },
//   {
//     id: 4,
//     mood: "😞",
//     moodLabel: "Poor",
//     student: "Anonymous",
//     clarity: 2,
//     doubt: 1,
//     energy: 2,
//     depth: 2,
//     tags: ["Hard to follow", "Too fast"],
//     comment: "Couldn't understand the Kafka consumer part at all.",
//     status: "SUBMITTED",
//     date: "Apr 14",
//   },
//   {
//     id: 5,
//     mood: "🤩",
//     moodLabel: "Amazing",
//     student: "Ravi K.",
//     clarity: 5,
//     doubt: 5,
//     energy: 5,
//     depth: 5,
//     tags: ["Just right", "Great demos"],
//     comment: "Absolutely loved it. Keep it up!",
//     status: "REVIEWED",
//     date: "Apr 13",
//   },
//   {
//     id: 6,
//     mood: "😊",
//     moodLabel: "Good",
//     student: "Anonymous",
//     clarity: 4,
//     doubt: 3,
//     energy: 4,
//     depth: 4,
//     tags: ["Notes & resources"],
//     comment: "Please share slides after class.",
//     status: "SUBMITTED",
//     date: "Apr 13",
//   },
// ];

// const styles = `
//   .tf-root { font-family: Arial, sans-serif; min-height: 100vh; background: #060a14; color: #e2e8f0; }
//   .tf-bg {
//     position: fixed; inset: 0; pointer-events: none; z-index: 0;
//     background:
//       radial-gradient(ellipse 70% 50% at 5% 5%, rgba(99,102,241,0.12) 0%, transparent 55%),
//       radial-gradient(ellipse 50% 40% at 95% 90%, rgba(168,85,247,0.1) 0%, transparent 55%);
//   }
//   .tf-main { position: relative; z-index: 1; padding: 2.5rem 3rem; max-width: 1400px; margin: 0 auto; }
//   .tf-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 2.5rem; }
//   .tf-header-left h1 { font-size: 1.6rem; font-weight: 800; color: #f8fafc; margin-bottom: 4px; font-family: Arial, sans-serif; }
//   .tf-header-left p { font-size: 13px; color: #475569; font-family: Arial, sans-serif; }
//   .tf-batch-select {
//     display: flex; align-items: center; gap: 10px;
//     background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
//     border-radius: 12px; padding: 10px 16px;
//   }
//   .tf-batch-select select {
//     background: transparent; border: none; color: #e2e8f0;
//     font-family: Arial, sans-serif; font-size: 13px; cursor: pointer; outline: none;
//   }
//   .tf-stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 2rem; }
//   .tf-stat-card {
//     background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
//     border-radius: 18px; padding: 22px 20px; position: relative; overflow: hidden;
//   }
//   .tf-stat-card::before {
//     content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
//     border-radius: 18px 18px 0 0;
//   }
//   .tf-stat-label { font-size: 10px; font-weight: 700; color: #334155; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 10px; font-family: Arial, sans-serif; }
//   .tf-stat-value { font-size: 2.2rem; font-weight: 800; color: #f8fafc; font-family: Arial, sans-serif; margin-bottom: 4px; }
//   .tf-stat-sub { font-size: 12px; color: #475569; font-family: Arial, sans-serif; }
//   .tf-stat-bar { height: 4px; border-radius: 2px; background: rgba(255,255,255,0.06); margin-top: 14px; overflow: hidden; }
//   .tf-stat-fill { height: 100%; border-radius: 2px; }
//   .tf-mid-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 2rem; }
//   .tf-panel {
//     background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
//     border-radius: 18px; padding: 22px;
//   }
//   .tf-panel-title { font-size: 14px; font-weight: 700; color: #e2e8f0; margin-bottom: 20px; font-family: Arial, sans-serif; }
//   .tf-rating-row { display: flex; align-items: center; gap: 14px; margin-bottom: 14px; }
//   .tf-rating-label { font-size: 12px; color: #64748b; min-width: 160px; font-family: Arial, sans-serif; }
//   .tf-rating-track { flex: 1; height: 8px; border-radius: 4px; background: rgba(255,255,255,0.05); overflow: hidden; }
//   .tf-rating-fill { height: 100%; border-radius: 4px; }
//   .tf-rating-val { font-size: 13px; font-family: Arial, sans-serif; color: #e2e8f0; font-weight: 700; min-width: 24px; text-align: right; }
//   .tf-mood-row { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
//   .tf-mood-emoji { font-size: 22px; width: 30px; text-align: center; }
//   .tf-mood-track { flex: 1; height: 10px; border-radius: 5px; background: rgba(255,255,255,0.05); overflow: hidden; }
//   .tf-mood-fill { height: 100%; border-radius: 5px; }
//   .tf-mood-count { font-size: 13px; color: #64748b; font-family: Arial, sans-serif; min-width: 20px; text-align: right; font-weight: 700; }
//   .tf-table-wrap {
//     background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
//     border-radius: 18px; overflow: hidden;
//   }
//   .tf-table-header { padding: 18px 24px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.07); }
//   .tf-table-title { font-size: 15px; font-weight: 700; color: #f8fafc; font-family: Arial, sans-serif; }
//   .tf-filter-btns { display: flex; gap: 8px; }
//   .tf-filter-btn {
//     padding: 6px 16px; border-radius: 999px; font-size: 12px; font-weight: 600;
//     cursor: pointer; font-family: Arial, sans-serif; transition: all 0.2s;
//   }
//   .tf-table { width: 100%; border-collapse: collapse; }
//   .tf-th {
//     padding: 12px 24px; font-size: 10px; font-weight: 700; color: #334155;
//     text-transform: uppercase; letter-spacing: 0.07em; text-align: left;
//     border-bottom: 1px solid rgba(255,255,255,0.05);
//     font-family: Arial, sans-serif;
//   }
//   .tf-td { padding: 14px 24px; border-bottom: 1px solid rgba(255,255,255,0.04); transition: background 0.15s; }
//   .tf-td-text { font-size: 13px; color: #e2e8f0; font-family: Arial, sans-serif; }
//   .tf-td-sub { font-size: 12px; color: #475569; font-family: Arial, sans-serif; }
//   .tf-status-badge { padding: 4px 12px; border-radius: 999px; font-size: 11px; font-weight: 700; font-family: Arial, sans-serif; }
//   .tf-view-btn {
//     padding: 6px 16px; border-radius: 999px; font-size: 12px; font-weight: 600;
//     border: 1.5px solid rgba(255,255,255,0.1); background: transparent; color: #64748b;
//     cursor: pointer; font-family: Arial, sans-serif; transition: all 0.2s;
//   }
//   .tf-view-btn:hover { border-color: rgba(99,102,241,0.4); color: #a5b4fc; }
//   .tf-empty { padding: 3rem; text-align: center; color: #334155; font-size: 13px; font-family: Arial, sans-serif; }
//   .tf-loading { display: flex; align-items: center; justify-content: center; height: 200px; color: #475569; font-family: Arial, sans-serif; font-size: 14px; }
//   /* Modal */
//   .tf-modal-overlay {
//     position: fixed; inset: 0; z-index: 100;
//     display: flex; align-items: center; justify-content: center;
//     background: rgba(0,0,0,0.85); backdrop-filter: blur(14px);
//   }
//   .tf-modal {
//     background: #0d1526; border: 1px solid rgba(99,102,241,0.2);
//     border-radius: 24px; padding: 32px; max-width: 560px; width: 92%;
//     max-height: 88vh; overflow-y: auto;
//   }
//   .tf-modal-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
//   .tf-modal-title { font-size: 1.2rem; font-weight: 800; color: #f8fafc; font-family: Arial, sans-serif; }
//   .tf-modal-close {
//     width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.05);
//     border: 1px solid rgba(255,255,255,0.1); color: #64748b; cursor: pointer; font-size: 16px;
//     display: flex; align-items: center; justify-content: center;
//   }
//   .tf-modal-meta { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; }
//   .tf-meta-chip {
//     padding: 5px 14px; border-radius: 999px; font-size: 11px;
//     border: 1px solid rgba(255,255,255,0.08); color: #64748b;
//     font-family: Arial, sans-serif; font-weight: 600;
//   }
//   .tf-modal-section-title {
//     font-size: 10px; font-weight: 700; color: #334155; text-transform: uppercase;
//     letter-spacing: 0.08em; margin-bottom: 14px; font-family: Arial, sans-serif;
//   }
//   .tf-modal-rating-row {
//     display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;
//   }
//   .tf-modal-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; }
//   .tf-modal-tag {
//     padding: 6px 14px; border-radius: 999px; font-size: 12px; font-weight: 600;
//     background: rgba(99,102,241,0.12); color: #a5b4fc;
//     border: 1px solid rgba(99,102,241,0.25); font-family: Arial, sans-serif;
//   }
//   .tf-modal-comment {
//     background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
//     border-radius: 14px; padding: 16px; font-size: 13px; color: #94a3b8;
//     line-height: 1.7; font-style: italic; margin-bottom: 24px; font-family: Arial, sans-serif;
//   }
//   .tf-modal-actions { display: flex; gap: 10px; }
//   .tf-modal-btn {
//     flex: 1; padding: 13px; border-radius: 12px; font-size: 13px; font-weight: 700;
//     cursor: pointer; font-family: Arial, sans-serif; transition: all 0.2s;
//   }
// `;

// function avg(f) {
//   return ((f.clarity + f.doubt + f.energy + f.depth) / 4).toFixed(1);
// }

// function StarDisplay({ val, size = 14 }) {
//   return (
//     <div style={{ display: "flex", gap: 3 }}>
//       {[1, 2, 3, 4, 5].map((i) => (
//         <svg
//           key={i}
//           width={size}
//           height={size}
//           viewBox="0 0 24 24"
//           fill={i <= val ? "#f59e0b" : "none"}
//           stroke={i <= val ? "#f59e0b" : "#1e3a5f"}
//           strokeWidth="1.5"
//         >
//           <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
//         </svg>
//       ))}
//     </div>
//   );
// }

// export default function TrainerFeedback() {
//   const [batches, setBatches] = useState([]);
//   const [selectedBatchId, setSelectedBatchId] = useState(null);
//   const [feedbackList, setFeedbackList] = useState(MOCK);
//   const [filter, setFilter] = useState("all");
//   const [selected, setSelected] = useState(null);
//   const [loadingFeedback, setLoadingFeedback] = useState(false);

//   useEffect(() => {
//     getTrainerBatches()
//       .then((data) => {
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
//       .then((r) => {
//         const moodMap = {
//           AMAZING: "🤩",
//           GOOD: "😊",
//           FINE: "😐",
//           OKAY: "😕",
//           POOR: "😞",
//         };
//         setFeedbackList(
//           r.data.map((f) => {
//             const moodKey = (f.moodRating || "").toUpperCase().trim();
//             return {
//               id: f.id,
//               moodLabel: moodKey,
//               mood: moodMap[moodKey] || "😐",
//               student: f.studentEmail || "Anonymous",
//               clarity: f.trainerClarityRating || 0,
//               doubt: f.trainerDoubtClearingRating || 0,
//               energy: f.trainerEnergyRating || 0,
//               depth: f.trainerTechnicalDepthRating || 0,
//               tags: f.contentTags || [],
//               comment: f.comment || "",
//               status: f.status,
//               date: new Date(f.createdAt).toLocaleDateString(),
//             };
//           }),
//         );
//       })
//       .catch(() => {
//         setFeedbackList(MOCK);
//       })
//       .finally(() => setLoadingFeedback(false));
//   }, [selectedBatchId]);

//   const filtered = feedbackList.filter((f) => {
//     if (filter === "positive") return f.clarity >= 4 && f.doubt >= 4;
//     if (filter === "negative") return f.clarity <= 3 || f.doubt <= 2;
//     return true;
//   });

//   async function handleMarkReviewed(f) {
//     try {
//       await updateFeedbackStatus(f.id, "REVIEWED");
//     } catch {}
//     setFeedbackList((prev) =>
//       prev.map((x) => (x.id === f.id ? { ...x, status: "REVIEWED" } : x)),
//     );
//     setSelected(null);
//   }

//   const moodCounts = [5, 4, 3, 2, 1].map((v) => ({
//     icon: ["🤩", "😊", "😐", "😕", "😞"][5 - v],
//     count: feedbackList.filter(
//       (f) =>
//         (({ AMAZING: 5, GOOD: 4, FINE: 3, OKAY: 2, POOR: 1 })[f.moodLabel] ||
//           0) === v,
//     ).length,
//     max: feedbackList.length || 1,
//   }));

//   const moodBarColors = [
//     "linear-gradient(90deg,#6366f1,#a78bfa)",
//     "linear-gradient(90deg,#22c55e,#4ade80)",
//     "#eab308",
//     "#f97316",
//     "#ef4444",
//   ];

//   const statAvg = feedbackList.length
//     ? (
//         feedbackList.reduce((s, f) => s + parseFloat(avg(f)), 0) /
//         feedbackList.length
//       ).toFixed(1)
//     : "—";
//   const anonymousCount = feedbackList.filter(
//     (f) => f.student === "Anonymous",
//   ).length;
//   const anonPct = feedbackList.length
//     ? Math.round((anonymousCount / feedbackList.length) * 100)
//     : 0;
//   const clarityAvg = feedbackList.length
//     ? (
//         feedbackList.reduce((s, f) => s + f.clarity, 0) / feedbackList.length
//       ).toFixed(1)
//     : 0;
//   const doubtAvg = feedbackList.length
//     ? (
//         feedbackList.reduce((s, f) => s + f.doubt, 0) / feedbackList.length
//       ).toFixed(1)
//     : 0;
//   const energyAvg = feedbackList.length
//     ? (
//         feedbackList.reduce((s, f) => s + f.energy, 0) / feedbackList.length
//       ).toFixed(1)
//     : 0;
//   const depthAvg = feedbackList.length
//     ? (
//         feedbackList.reduce((s, f) => s + f.depth, 0) / feedbackList.length
//       ).toFixed(1)
//     : 0;

//   const stats = [
//     {
//       label: "Total Feedback",
//       value: feedbackList.length,
//       sub: "+6 this week",
//       fill: "80%",
//       color: "#6366f1",
//       accent: "#6366f1",
//     },
//     {
//       label: "Overall Rating",
//       value: statAvg,
//       sub: "Out of 5.0",
//       fill: `${(parseFloat(statAvg) / 5) * 100}%`,
//       color: "#22c55e",
//       accent: "#22c55e",
//     },
//     {
//       label: "Avg Mood Score",
//       value: "3.9",
//       sub: "🤩 38% Amazing",
//       fill: "78%",
//       color: "#f59e0b",
//       accent: "#f59e0b",
//     },
//     {
//       label: "Anonymous Rate",
//       value: `${anonPct}%`,
//       sub: `${anonymousCount} anonymous`,
//       fill: `${anonPct}%`,
//       color: "#8b5cf6",
//       accent: "#8b5cf6",
//     },
//   ];

//   const ratingRows = [
//     {
//       label: "Clarity of explanation",
//       val: parseFloat(clarityAvg),
//       color: "#22c55e",
//     },
//     { label: "Doubt clearing", val: parseFloat(doubtAvg), color: "#6366f1" },
//     {
//       label: "Energy & engagement",
//       val: parseFloat(energyAvg),
//       color: "#f59e0b",
//     },
//     { label: "Technical depth", val: parseFloat(depthAvg), color: "#8b5cf6" },
//   ];

//   return (
//     <div className="tf-root">
//       <style>{styles}</style>
//       <div className="tf-bg" />
//       <div className="tf-main">
//         {/* HEADER */}
//         <div className="tf-header">
//           <div className="tf-header-left">
//             <h1>Feedback Dashboard</h1>
//             <p>Aggregated student feedback for your sessions</p>
//           </div>
//           <div className="tf-batch-select">
//             <span>📦</span>
//             <select
//               value={selectedBatchId ?? ""}
//               onChange={(e) => setSelectedBatchId(Number(e.target.value))}
//             >
//               {batches.length === 0 && (
//                 <option value="">No batches assigned</option>
//               )}
//               {batches.map((b) => (
//                 <option key={b.id} value={b.id}>
//                   {b.name || `Batch #${b.id}`}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {loadingFeedback ? (
//           <div className="tf-loading">Loading feedback…</div>
//         ) : (
//           <>
//             {/* STATS */}
//             <div className="tf-stats-grid">
//               {stats.map((s, i) => (
//                 <div
//                   key={i}
//                   className="tf-stat-card"
//                   style={{ "--accent": s.accent }}
//                 >
//                   <div
//                     style={{
//                       position: "absolute",
//                       top: 0,
//                       left: 0,
//                       right: 0,
//                       height: 3,
//                       borderRadius: "18px 18px 0 0",
//                       background: s.color,
//                       opacity: 0.8,
//                     }}
//                   />
//                   <p className="tf-stat-label">{s.label}</p>
//                   <p className="tf-stat-value">{s.value}</p>
//                   <p className="tf-stat-sub">{s.sub}</p>
//                   <div className="tf-stat-bar">
//                     <div
//                       className="tf-stat-fill"
//                       style={{ width: s.fill, background: s.color }}
//                     />
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* MID PANELS */}
//             <div className="tf-mid-grid">
//               <div className="tf-panel">
//                 <p className="tf-panel-title">Rating Breakdown</p>
//                 {ratingRows.map((r) => (
//                   <div key={r.label} className="tf-rating-row">
//                     <span className="tf-rating-label">{r.label}</span>
//                     <div className="tf-rating-track">
//                       <div
//                         className="tf-rating-fill"
//                         style={{
//                           width: `${(r.val / 5) * 100}%`,
//                           background: r.color,
//                         }}
//                       />
//                     </div>
//                     <span className="tf-rating-val">{r.val}</span>
//                   </div>
//                 ))}
//               </div>
//               <div className="tf-panel">
//                 <p className="tf-panel-title">Mood Distribution</p>
//                 {moodCounts.map((m, i) => (
//                   <div key={i} className="tf-mood-row">
//                     <span className="tf-mood-emoji">{m.icon}</span>
//                     <div className="tf-mood-track">
//                       <div
//                         className="tf-mood-fill"
//                         style={{
//                           width: `${(m.count / m.max) * 100}%`,
//                           background: moodBarColors[i],
//                         }}
//                       />
//                     </div>
//                     <span className="tf-mood-count">{m.count}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* TABLE */}
//             <div className="tf-table-wrap">
//               <div className="tf-table-header">
//                 <span className="tf-table-title">Recent Feedback</span>
//                 <div className="tf-filter-btns">
//                   {[
//                     ["all", "All"],
//                     ["positive", "Positive"],
//                     ["negative", "Needs Attention"],
//                   ].map(([v, l]) => (
//                     <button
//                       key={v}
//                       className="tf-filter-btn"
//                       onClick={() => setFilter(v)}
//                       style={{
//                         border:
//                           filter === v
//                             ? "1.5px solid rgba(99,102,241,0.4)"
//                             : "1.5px solid rgba(255,255,255,0.08)",
//                         background:
//                           filter === v
//                             ? "rgba(99,102,241,0.15)"
//                             : "transparent",
//                         color: filter === v ? "#a5b4fc" : "#475569",
//                       }}
//                     >
//                       {l}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//               <table className="tf-table">
//                 <thead>
//                   <tr>
//                     {[
//                       "Mood",
//                       "Student",
//                       "Trainer Rating",
//                       "Status",
//                       "Date",
//                       "",
//                     ].map((h) => (
//                       <th key={h} className="tf-th">
//                         {h}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filtered.map((f) => (
//                     <tr
//                       key={f.id}
//                       onMouseEnter={(e) =>
//                         e.currentTarget
//                           .querySelectorAll("td")
//                           .forEach(
//                             (td) =>
//                               (td.style.background = "rgba(255,255,255,0.03)"),
//                           )
//                       }
//                       onMouseLeave={(e) =>
//                         e.currentTarget
//                           .querySelectorAll("td")
//                           .forEach(
//                             (td) => (td.style.background = "transparent"),
//                           )
//                       }
//                     >
//                       <td className="tf-td" style={{ fontSize: 22 }}>
//                         {f.mood}
//                       </td>
//                       <td className="tf-td">
//                         <span className="tf-td-text">{f.student}</span>
//                       </td>
//                       <td className="tf-td">
//                         <StarDisplay
//                           val={Math.round(parseFloat(avg(f)))}
//                           size={14}
//                         />
//                       </td>
//                       <td className="tf-td">
//                         <span
//                           className="tf-status-badge"
//                           style={{
//                             background:
//                               f.status === "REVIEWED"
//                                 ? "rgba(34,197,94,0.12)"
//                                 : "rgba(99,102,241,0.12)",
//                             color:
//                               f.status === "REVIEWED" ? "#4ade80" : "#a5b4fc",
//                           }}
//                         >
//                           {f.status === "REVIEWED" ? "Reviewed" : "New"}
//                         </span>
//                       </td>
//                       <td className="tf-td">
//                         <span className="tf-td-sub">{f.date}</span>
//                       </td>
//                       <td className="tf-td">
//                         <button
//                           className="tf-view-btn"
//                           onClick={() => setSelected(f)}
//                         >
//                           View →
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//               {filtered.length === 0 && (
//                 <div className="tf-empty">
//                   No feedback found for the selected filter.
//                 </div>
//               )}
//             </div>
//           </>
//         )}
//       </div>

//       {/* DETAIL MODAL */}
//       {selected && (
//         <div className="tf-modal-overlay" onClick={() => setSelected(null)}>
//           <div className="tf-modal" onClick={(e) => e.stopPropagation()}>
//             <div className="tf-modal-head">
//               <span className="tf-modal-title">
//                 Feedback from {selected.student}
//               </span>
//               <button
//                 className="tf-modal-close"
//                 onClick={() => setSelected(null)}
//               >
//                 ✕
//               </button>
//             </div>
//             <div className="tf-modal-meta">
//               {[
//                 `${selected.mood} ${selected.moodLabel}`,
//                 `📅 ${selected.date}`,
//                 ...(selected.student === "Anonymous" ? ["🔒 Anonymous"] : []),
//               ].map((t) => (
//                 <span key={t} className="tf-meta-chip">
//                   {t}
//                 </span>
//               ))}
//             </div>

//             <p className="tf-modal-section-title">Trainer Ratings</p>
//             {[
//               ["Clarity of explanation", selected.clarity],
//               ["Doubt clearing", selected.doubt],
//               ["Energy & engagement", selected.energy],
//               ["Technical depth", selected.depth],
//             ].map(([l, v]) => (
//               <div key={l} className="tf-modal-rating-row">
//                 <span
//                   style={{
//                     fontSize: 13,
//                     color: "#64748b",
//                     fontFamily: "Arial, sans-serif",
//                   }}
//                 >
//                   {l}
//                 </span>
//                 <StarDisplay val={v} size={18} />
//               </div>
//             ))}

//             {selected.tags.length > 0 && (
//               <>
//                 <p className="tf-modal-section-title" style={{ marginTop: 20 }}>
//                   Content Tags
//                 </p>
//                 <div className="tf-modal-tags">
//                   {selected.tags.map((t) => (
//                     <span key={t} className="tf-modal-tag">
//                       {t}
//                     </span>
//                   ))}
//                 </div>
//               </>
//             )}

//             {selected.comment && (
//               <>
//                 <p className="tf-modal-section-title">Comment</p>
//                 <div className="tf-modal-comment">"{selected.comment}"</div>
//               </>
//             )}

//             <div className="tf-modal-actions">
//               <button
//                 className="tf-modal-btn"
//                 onClick={() => handleMarkReviewed(selected)}
//                 style={{
//                   background: "rgba(34,197,94,0.1)",
//                   border: "1.5px solid rgba(34,197,94,0.3)",
//                   color: "#4ade80",
//                 }}
//               >
//                 ✓ Mark as Reviewed
//               </button>
//               <button
//                 className="tf-modal-btn"
//                 onClick={() => setSelected(null)}
//                 style={{
//                   background: "transparent",
//                   border: "1.5px solid rgba(255,255,255,0.1)",
//                   color: "#64748b",
//                 }}
//               >
//                 Archive
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
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

/* ═══════════════════════════════════════════════
   THEME TOKEN MAP (mirrors DashboardPage)
═══════════════════════════════════════════════ */
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

/* ── Count-up hook ── */
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

/* ── Star Display ── */
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

/* ── Stat Card ── */
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
        animationDelay: `${index * 80}ms`,
      }}
    >
      {/* Glow blob */}
      <div style={{ position: "absolute", top: -20, right: -20, width: 90, height: 90, borderRadius: "50%", background: color, filter: "blur(40px)", opacity: hov ? 0.15 : 0.04, transition: "opacity 0.4s", pointerEvents: "none" }} />
      {/* Top accent bar */}
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
        <p style={{ fontSize: 40, fontWeight: 800, lineHeight: 1, fontFamily: "'Poppins',sans-serif", color: t.text, margin: 0 }}>{value}</p>
        <p style={{ fontSize: 10, marginTop: 6, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: t.textMuted, fontFamily: "'Poppins',sans-serif", margin: "6px 0 0" }}>{label}</p>
      </div>
      <div style={{ height: 2, background: t.barBg, borderRadius: 99, overflow: "hidden" }}>
        <div style={{ height: "100%", borderRadius: 99, background: color, width: hov ? fill : "20%", transition: "width 0.65s ease", opacity: 0.85 }} />
      </div>
      <p style={{ fontSize: 11, color: t.textMuted, fontFamily: "'Poppins',sans-serif", margin: 0 }}>{sub}</p>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════════════════════ */
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

  /* Computed */
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
      `}</style>

      <div style={{ fontFamily: "'Poppins',sans-serif", minHeight: "100vh", background: t.pageBg, color: t.text, transition: "background 0.3s, color 0.3s" }}>
        <div style={{ maxWidth: 1300, margin: "0 auto", padding: "28px 28px 60px" }}>

          {/* ═══ HERO ═══ */}
          <div className="tf-fade" style={{ ...card, padding: "26px 30px", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>

              {/* Left */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.22)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <ClipboardList size={16} color="#7c3aed" />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div className="tf-d1" style={{ width: 6, height: 6, borderRadius: "50%", background: "#7c3aed" }} />
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: t.textSub }}>Trainer Portal</span>
                  </div>
                </div>
                <h1 style={{ fontSize: "clamp(1.3rem,2.5vw,1.9rem)", fontWeight: 900, color: t.text, margin: "0 0 5px", letterSpacing: "-0.02em" }}>Feedback Dashboard</h1>
                <p style={{ fontSize: 12, color: t.textSub, margin: 0, fontWeight: 500 }}>Aggregated student feedback for your sessions</p>
              </div>

              {/* Right */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                {/* Stats pill */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, background: t.actBg, border: `1px solid ${t.actBorder}`, borderRadius: 12, padding: "8px 16px", fontSize: 11, fontWeight: 600, fontFamily: "'Poppins',sans-serif", color: t.textSub }}>
                  <span>{feedbackList.length} responses</span>
                  <span style={{ width: 1, height: 14, background: t.actBorder }} />
                  <span>{feedbackList.filter(f => f.status === "REVIEWED").length} reviewed</span>
                  <span style={{ width: 1, height: 14, background: t.actBorder }} />
                  <span style={{ color: "#34d399", fontWeight: 700 }}>⭐ {statAvg}/5</span>
                </div>

                {/* Activity bars */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, background: t.actBg, border: `1px solid ${t.actBorder}`, borderRadius: 10, padding: "8px 12px" }}>
                  <Activity size={12} color={t.textMuted} />
                  <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 14 }}>
                    <span className="tf-d1" style={{ width: 3, height: 10, borderRadius: 2, background: t.textMuted, display: "block", opacity: 0.5 }} />
                    <span className="tf-d2" style={{ width: 3, height: 14, borderRadius: 2, background: t.textMuted, display: "block", opacity: 0.5 }} />
                    <span className="tf-d3" style={{ width: 3, height: 7, borderRadius: 2, background: t.textMuted, display: "block", opacity: 0.5 }} />
                  </div>
                </div>

                {/* Batch selector */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, background: t.actBg, border: `1px solid ${t.actBorder}`, borderRadius: 12, padding: "8px 14px", cursor: "pointer" }}>
                  <GraduationCap size={14} color="#7c3aed" />
                  <select
                    className="tf-select"
                    value={selectedBatchId ?? ""}
                    onChange={e => setSelectedBatchId(Number(e.target.value))}
                    style={{ background: "transparent", border: "none", color: t.text, fontFamily: "'Poppins',sans-serif", fontSize: 12, fontWeight: 600, cursor: "pointer", outline: "none" }}
                  >
                    {batches.length === 0 && <option value="">No batches assigned</option>}
                    {batches.map(b => <option key={b.id} value={b.id}>{b.name || `Batch #${b.id}`}</option>)}
                  </select>
                  <ChevronDown size={12} color={t.textMuted} />
                </div>

                {/* Live badge */}
                <div className="tf-live" style={{ display: "flex", alignItems: "center", gap: 7, background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.28)", borderRadius: 999, padding: "7px 16px", color: "#7c3aed", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#7c3aed", display: "inline-block" }} />LIVE
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
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14, marginBottom: 20 }}>
                {stats.map((s, i) => <StatCard key={i} {...s} index={i} t={t} />)}
              </div>

              {/* ═══ MID PANELS ═══ */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>

                {/* Rating Breakdown */}
                <div style={{ ...card, padding: "22px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(52,211,153,0.10)", border: "1px solid rgba(52,211,153,0.20)", display: "flex", alignItems: "center", justifyContent: "center" }}>
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
                <div style={{ ...card, padding: "22px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(251,191,36,0.10)", border: "1px solid rgba(251,191,36,0.20)", display: "flex", alignItems: "center", justifyContent: "center" }}>
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
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", borderBottom: `1px solid ${t.border}`, flexWrap: "wrap", gap: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(124,58,237,0.10)", border: "1px solid rgba(124,58,237,0.20)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <MessageSquare size={15} color="#7c3aed" />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: t.text }}>Recent Feedback</span>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 999, background: "rgba(124,58,237,0.10)", color: "#7c3aed", border: "1px solid rgba(124,58,237,0.20)" }}>
                      {filtered.length} entries
                    </span>
                  </div>
                  {/* Filter buttons */}
                  <div style={{ display: "flex", gap: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginRight: 4 }}>
                      <Filter size={12} color={t.textMuted} />
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: t.textLabel }}>Filter</span>
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
                        }}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Table */}
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        {["Mood", "Student", "Trainer Rating", "Tags", "Status", "Date", ""].map(h => (
                          <th key={h} style={{ padding: "12px 20px", fontSize: 9, fontWeight: 700, color: t.textLabel, textTransform: "uppercase", letterSpacing: "0.08em", textAlign: "left", borderBottom: `1px solid ${t.border}`, fontFamily: "'Poppins',sans-serif", whiteSpace: "nowrap" }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map(f => (
                        <tr key={f.id} className="tf-table-row" style={{ cursor: "pointer" }}>
                          <td style={{ padding: "14px 20px", borderBottom: `1px solid ${t.border}`, fontSize: 22, transition: "background 0.15s" }}>{f.mood}</td>
                          <td style={{ padding: "14px 20px", borderBottom: `1px solid ${t.border}`, transition: "background 0.15s" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <div style={{ width: 30, height: 30, borderRadius: 9, background: f.student === "Anonymous" ? t.actBg : "rgba(124,58,237,0.10)", border: `1px solid ${f.student === "Anonymous" ? t.actBorder : "rgba(124,58,237,0.20)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <span style={{ fontSize: 11, fontWeight: 700, color: f.student === "Anonymous" ? t.textMuted : "#7c3aed" }}>{f.student === "Anonymous" ? "🔒" : f.student.charAt(0).toUpperCase()}</span>
                              </div>
                              <span style={{ fontSize: 12, fontWeight: 600, color: t.text, fontFamily: "'Poppins',sans-serif" }}>{f.student}</span>
                            </div>
                          </td>
                          <td style={{ padding: "14px 20px", borderBottom: `1px solid ${t.border}`, transition: "background 0.15s" }}>
                            <StarDisplay val={Math.round(parseFloat(avg(f)))} size={14} t={t} />
                          </td>
                          <td style={{ padding: "14px 20px", borderBottom: `1px solid ${t.border}`, transition: "background 0.15s" }}>
                            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                              {f.tags.slice(0, 2).map(tag => (
                                <span key={tag} style={{ fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 999, background: "rgba(124,58,237,0.10)", color: "#7c3aed", border: "1px solid rgba(124,58,237,0.20)", fontFamily: "'Poppins',sans-serif", whiteSpace: "nowrap" }}>{tag}</span>
                              ))}
                              {f.tags.length > 2 && <span style={{ fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 999, background: t.actBg, color: t.textMuted, border: `1px solid ${t.actBorder}`, fontFamily: "'Poppins',sans-serif" }}>+{f.tags.length - 2}</span>}
                            </div>
                          </td>
                          <td style={{ padding: "14px 20px", borderBottom: `1px solid ${t.border}`, transition: "background 0.15s" }}>
                            <span style={{
                              fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 999,
                              background: f.status === "REVIEWED" ? "rgba(52,211,153,0.10)" : "rgba(124,58,237,0.10)",
                              color: f.status === "REVIEWED" ? "#34d399" : "#7c3aed",
                              border: `1px solid ${f.status === "REVIEWED" ? "rgba(52,211,153,0.20)" : "rgba(124,58,237,0.20)"}`,
                              fontFamily: "'Poppins',sans-serif",
                            }}>
                              {f.status === "REVIEWED" ? "✓ Reviewed" : "● New"}
                            </span>
                          </td>
                          <td style={{ padding: "14px 20px", borderBottom: `1px solid ${t.border}`, transition: "background 0.15s" }}>
                            <span style={{ fontSize: 11, color: t.textMuted, fontFamily: "'Poppins',sans-serif", fontWeight: 500 }}>{f.date}</span>
                          </td>
                          <td style={{ padding: "14px 20px", borderBottom: `1px solid ${t.border}`, transition: "background 0.15s" }}>
                            <button
                              className="tf-view-btn"
                              onClick={() => setSelected(f)}
                              style={{
                                display: "flex", alignItems: "center", gap: 5,
                                padding: "6px 14px", borderRadius: 10, fontSize: 11, fontWeight: 600,
                                border: `1px solid ${t.actBorder}`, background: "transparent",
                                color: t.textMuted, cursor: "pointer", fontFamily: "'Poppins',sans-serif",
                                transition: "all 0.2s",
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
          style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", background: t.overlayBg, backdropFilter: "blur(8px)" }}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="tf-modal-overlay-inner"
            style={{ width: "90%", maxWidth: 540, borderRadius: 24, padding: "28px", background: t.cardBg, border: `1px solid ${t.border}`, boxShadow: t.shadowHov, maxHeight: "88vh", overflowY: "auto", animation: "tfFadeUp 0.35s cubic-bezier(0.34,1.56,0.64,1)" }}
          >
            {/* Modal Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(124,58,237,0.10)", border: "1px solid rgba(124,58,237,0.20)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 18 }}>{selected.mood}</span>
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 800, color: t.text, margin: 0, fontFamily: "'Poppins',sans-serif" }}>Feedback from {selected.student}</p>
                  <p style={{ fontSize: 10, color: t.textMuted, margin: 0, fontFamily: "'Poppins',sans-serif" }}>{selected.date}</p>
                </div>
              </div>
              <button
                className="tf-close-btn"
                onClick={() => setSelected(null)}
                style={{ width: 34, height: 34, borderRadius: 10, background: t.actBg, border: `1px solid ${t.actBorder}`, color: t.textMuted, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" }}
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
                <div style={{ width: 28, height: 28, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: `${color}18`, border: `1px solid ${color}30`, flexShrink: 0 }}>
                  <Icon size={12} color={color} />
                </div>
                <span style={{ fontSize: 11, color: t.textSub, flex: 1, fontFamily: "'Poppins',sans-serif", fontWeight: 500 }}>{label}</span>
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
            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              <button
                onClick={() => handleMarkReviewed(selected)}
                style={{ flex: 1, padding: "12px", borderRadius: 12, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Poppins',sans-serif", border: "1px solid rgba(52,211,153,0.30)", background: "rgba(52,211,153,0.08)", color: "#34d399", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "all 0.2s" }}
              >
                <CheckCircle size={14} /> Mark as Reviewed
              </button>
              <button
                onClick={() => setSelected(null)}
                style={{ flex: 1, padding: "12px", borderRadius: 12, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Poppins',sans-serif", border: `1px solid ${t.actBorder}`, background: "transparent", color: t.textMuted, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "all 0.2s" }}
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