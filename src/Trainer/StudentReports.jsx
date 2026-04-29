// import { useState, useEffect, useRef } from "react";
// import { progressService } from "../services/progressService";
// import { getTrainerBatches } from "../services/batchService";

// function fmt(v) {
//   return typeof v === "number" ? Math.round(v) : 0;
// }
// function progColor(v) {
//   return v >= 75 ? "#00FFB2" : v >= 50 ? "#FFB800" : "#FF4D6D";
// }
// function progGlow(v) {
//   return v >= 75
//     ? "0 0 20px rgba(0,255,178,0.5)"
//     : v >= 50
//       ? "0 0 20px rgba(255,184,0,0.5)"
//       : "0 0 20px rgba(255,77,109,0.5)";
// }
// function initials(email = "") {
//   const name = email.split("@")[0];
//   const parts = name.split(/[._-]/);
//   return parts.length > 1
//     ? (parts[0][0] + parts[1][0]).toUpperCase()
//     : name.slice(0, 2).toUpperCase();
// }

// const AV_COLORS = [
//   { bg: "linear-gradient(135deg,#00FFB2,#00C87A)", text: "#003D24" },
//   { bg: "linear-gradient(135deg,#A78BFA,#7C3AED)", text: "#EDE9FE" },
//   { bg: "linear-gradient(135deg,#FB923C,#DC2626)", text: "#FFF7ED" },
//   { bg: "linear-gradient(135deg,#38BDF8,#0369A1)", text: "#E0F2FE" },
//   { bg: "linear-gradient(135deg,#FBBF24,#D97706)", text: "#1C1917" },
// ];

// function RadarChart({ data }) {
//   const axes = [
//     { label: "Videos", val: data.videoWatchPercentage ?? 0 },
//     { label: "Files", val: data.fileDownloadPercentage ?? 0 },
//     { label: "Quizzes", val: data.quizCompletionPercentage ?? 0 },
//     { label: "Assignments", val: data.assignmentCompletionPercentage ?? 0 },
//     { label: "Course", val: data.courseProgressPercentage ?? 0 },
//   ];
//   const N = axes.length;
//   const cx = 140,
//     cy = 130,
//     r = 90;
//   const ang = (i) => (Math.PI * 2 * i) / N - Math.PI / 2;
//   const pt = (i, pct) => {
//     const a = ang(i);
//     const d = (pct / 100) * r;
//     return [cx + d * Math.cos(a), cy + d * Math.sin(a)];
//   };
//   const rings = [20, 40, 60, 80, 100];
//   const poly = axes.map((a, i) => pt(i, a.val).join(",")).join(" ");
//   return (
//     <svg
//       viewBox="0 0 280 260"
//       style={{
//         width: "100%",
//         maxWidth: 280,
//         filter: "drop-shadow(0 0 12px rgba(0,255,178,0.2))",
//       }}
//     >
//       <defs>
//         <radialGradient id="rfill" cx="50%" cy="50%" r="50%">
//           <stop offset="0%" stopColor="#00FFB2" stopOpacity="0.3" />
//           <stop offset="100%" stopColor="#00FFB2" stopOpacity="0.05" />
//         </radialGradient>
//       </defs>
//       {rings.map((ring) => (
//         <polygon
//           key={ring}
//           points={axes.map((_, i) => pt(i, ring).join(",")).join(" ")}
//           fill="none"
//           stroke="rgba(255,255,255,0.07)"
//           strokeWidth="1"
//         />
//       ))}
//       {axes.map((_, i) => {
//         const [x2, y2] = pt(i, 100);
//         return (
//           <line
//             key={i}
//             x1={cx}
//             y1={cy}
//             x2={x2}
//             y2={y2}
//             stroke="rgba(255,255,255,0.07)"
//             strokeWidth="1"
//           />
//         );
//       })}
//       <polygon
//         points={poly}
//         fill="url(#rfill)"
//         stroke="#00FFB2"
//         strokeWidth="2"
//       />
//       {axes.map((a, i) => {
//         const [x, y] = pt(i, a.val);
//         return (
//           <circle
//             key={i}
//             cx={x}
//             cy={y}
//             r={4}
//             fill="#00FFB2"
//             style={{ filter: "drop-shadow(0 0 6px #00FFB2)" }}
//           />
//         );
//       })}
//       {axes.map((a, i) => {
//         const [x, y] = pt(i, 118);
//         return (
//           <text
//             key={i}
//             x={x}
//             y={y}
//             textAnchor="middle"
//             dominantBaseline="middle"
//             fontSize="10"
//             fill="rgba(255,255,255,0.6)"
//             fontFamily="'Space Grotesk',sans-serif"
//           >
//             {a.label}
//           </text>
//         );
//       })}
//     </svg>
//   );
// }

// function ArcMeter({ value, color, size = 100 }) {
//   const r = 38,
//     cx = 50,
//     cy = 52;
//   const circ = Math.PI * r;
//   const progress = (value / 100) * circ;
//   return (
//     <svg viewBox="0 0 100 60" style={{ width: size, height: size * 0.6 }}>
//       <path
//         d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
//         fill="none"
//         stroke="rgba(255,255,255,0.08)"
//         strokeWidth="6"
//         strokeLinecap="round"
//       />
//       <path
//         d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
//         fill="none"
//         stroke={color}
//         strokeWidth="6"
//         strokeLinecap="round"
//         strokeDasharray={`${progress} ${circ}`}
//         style={{
//           filter: `drop-shadow(0 0 8px ${color})`,
//           transition: "stroke-dasharray 1s ease",
//         }}
//       />
//       <text
//         x={cx}
//         y={cy - 4}
//         textAnchor="middle"
//         fontSize="14"
//         fontWeight="700"
//         fill={color}
//         fontFamily="'Space Grotesk',sans-serif"
//       >
//         {fmt(value)}%
//       </text>
//     </svg>
//   );
// }

// export default function StudentReports() {
//   const [batches, setBatches] = useState([]);
//   const [batchesLoading, setBatchesLoading] = useState(true);
//   const [batchesError, setBatchesError] = useState(null);
//   const [selectedBatchId, setSelectedBatchId] = useState(null);
//   const [students, setStudents] = useState([]);
//   const [studentsLoading, setStudentsLoading] = useState(false);
//   const [studentsError, setStudentsError] = useState(null);
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [studentDetail, setStudentDetail] = useState(null);
//   const [detailLoading, setDetailLoading] = useState(false);
//   const [search, setSearch] = useState("");

//   useEffect(() => {
//     getTrainerBatches()
//       .then((data) => {
//         const list = data || [];
//         setBatches(list);
//         if (list.length > 0) setSelectedBatchId(list[0].id);
//         setBatchesLoading(false);
//       })
//       .catch((err) => {
//         setBatchesError(err.message);
//         setBatchesLoading(false);
//       });
//   }, []);

//   useEffect(() => {
//     if (!selectedBatchId) return;
//     setStudentsLoading(true);
//     setStudentsError(null);
//     setStudents([]);
//     setSelectedStudent(null);
//     setStudentDetail(null);
//     progressService
//       .getBatchProgressReport(selectedBatchId)
//       .then((res) => {
//         setStudents(res.data?.studentReports || []);
//         setStudentsLoading(false);
//       })
//       .catch((err) => {
//         setStudentsError(err.response?.data?.message || err.message);
//         setStudentsLoading(false);
//       });
//   }, [selectedBatchId]);

//   useEffect(() => {
//     if (!selectedStudent) return;
//     setDetailLoading(true);
//     progressService
//       .getStudentProgressInBatch(
//         selectedStudent.batchId || selectedBatchId,
//         selectedStudent.studentEmail,
//       )
//       .then((res) => {
//         setStudentDetail(res.data);
//         setDetailLoading(false);
//       })
//       .catch(() => {
//         setStudentDetail(selectedStudent);
//         setDetailLoading(false);
//       });
//   }, [selectedStudent]);

//   const filtered = students.filter((s) =>
//     s.studentEmail.toLowerCase().includes(search.toLowerCase()),
//   );

//   if (batchesLoading)
//     return (
//       <>
//         <style>{css}</style>
//         <div className="sr-wrap">
//           <div className="sr-loader">
//             <div className="sr-spinner" />
//             <span>Loading...</span>
//           </div>
//         </div>
//       </>
//     );

//   const detail = studentDetail || selectedStudent;

//   return (
//     <>
//       <style>{css}</style>
//       <div className="sr-wrap">
//         {/* Header */}
//         <div className="sr-header">
//           <div className="sr-header-left">
//             <div className="sr-title-badge">ANALYTICS</div>
//             <h1 className="sr-title">Student Reports</h1>
//             <p className="sr-subtitle">
//               Track individual learner progress across all metrics
//             </p>
//           </div>
//           <div className="sr-batch-row">
//             {batches.map((b) => (
//               <button
//                 key={b.id}
//                 className={`sr-batch-btn${selectedBatchId === b.id ? " active" : ""}`}
//                 onClick={() => setSelectedBatchId(b.id)}
//               >
//                 <span className="sr-batch-dot" />
//                 Batch {b.id}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Main grid - two columns */}
//         <div className="sr-grid">
//           {/* LEFT: Student list */}
//           <div className="sr-panel sr-panel-left">
//             <div className="sr-panel-header">
//               <span className="sr-panel-title">Students</span>
//               <span className="sr-count-badge">{filtered.length}</span>
//             </div>
//             <div className="sr-search-wrap">
//               <svg
//                 width="14"
//                 height="14"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="rgba(255,255,255,0.4)"
//                 strokeWidth="2"
//               >
//                 <circle cx="11" cy="11" r="8" />
//                 <path d="m21 21-4.35-4.35" />
//               </svg>
//               <input
//                 className="sr-search"
//                 placeholder="Search email…"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//               />
//             </div>
//             {studentsLoading && (
//               <div className="sr-loading-rows">
//                 {[1, 2, 3].map((i) => (
//                   <div key={i} className="sr-skel" />
//                 ))}
//               </div>
//             )}
//             {studentsError && <div className="sr-err">{studentsError}</div>}
//             <div className="sr-student-list">
//               {filtered.map((s, i) => {
//                 const col = AV_COLORS[i % 5];
//                 const isActive =
//                   selectedStudent?.studentEmail === s.studentEmail;
//                 return (
//                   <div
//                     key={s.studentEmail}
//                     className={`sr-student-card${isActive ? " active" : ""}`}
//                     onClick={() => setSelectedStudent(s)}
//                   >
//                     <div
//                       className="sr-av"
//                       style={{ background: col.bg, color: col.text }}
//                     >
//                       {initials(s.studentEmail)}
//                     </div>
//                     <div className="sr-student-info">
//                       <p className="sr-student-email">{s.studentEmail}</p>
//                       <div className="sr-mini-bars">
//                         {[
//                           { val: s.videoWatchPercentage, color: "#00FFB2" },
//                           { val: s.quizCompletionPercentage, color: "#A78BFA" },
//                           {
//                             val: s.assignmentCompletionPercentage,
//                             color: "#FB923C",
//                           },
//                         ].map((m, mi) => (
//                           <div key={mi} className="sr-mini-track">
//                             <div
//                               className="sr-mini-fill"
//                               style={{
//                                 width: `${Math.min(m.val || 0, 100)}%`,
//                                 background: m.color,
//                               }}
//                             />
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                     <div
//                       className="sr-overall-pill"
//                       style={{
//                         color: progColor(s.overallProgressPercentage),
//                         borderColor:
//                           progColor(s.overallProgressPercentage) + "44",
//                         boxShadow: progGlow(s.overallProgressPercentage),
//                       }}
//                     >
//                       {fmt(s.overallProgressPercentage)}%
//                     </div>
//                     {isActive && <div className="sr-active-arrow">›</div>}
//                   </div>
//                 );
//               })}
//               {!studentsLoading && filtered.length === 0 && (
//                 <div className="sr-empty">No students found</div>
//               )}
//             </div>
//           </div>

//           {/* RIGHT: Detail */}
//           <div className="sr-panel sr-panel-right">
//             {!selectedStudent && (
//               <div className="sr-placeholder">
//                 <div className="sr-placeholder-icon">
//                   <svg
//                     width="48"
//                     height="48"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="rgba(0,255,178,0.3)"
//                     strokeWidth="1.5"
//                   >
//                     <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
//                     <circle cx="9" cy="7" r="4" />
//                     <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
//                     <path d="M16 3.13a4 4 0 0 1 0 7.75" />
//                   </svg>
//                 </div>
//                 <p className="sr-placeholder-text">
//                   Select a student to view detailed progress
//                 </p>
//               </div>
//             )}

//             {selectedStudent && detailLoading && (
//               <div className="sr-loader">
//                 <div className="sr-spinner" />
//                 <span>Loading report…</span>
//               </div>
//             )}

//             {selectedStudent && !detailLoading && detail && (
//               <div className="sr-detail-content">
//                 {/* Student banner */}
//                 <div className="sr-detail-banner">
//                   <div
//                     className="sr-detail-avatar"
//                     style={{
//                       background: AV_COLORS[0].bg,
//                       color: AV_COLORS[0].text,
//                     }}
//                   >
//                     {initials(detail.studentEmail)}
//                   </div>
//                   <div>
//                     <h2 className="sr-detail-name">{detail.studentEmail}</h2>
//                     <p className="sr-detail-batch">
//                       Batch <strong>{detail.batchId || selectedBatchId}</strong>
//                     </p>
//                   </div>
//                   <div
//                     className="sr-detail-overall"
//                     style={{
//                       color: progColor(detail.overallProgressPercentage),
//                       borderColor:
//                         progColor(detail.overallProgressPercentage) + "55",
//                       boxShadow: progGlow(detail.overallProgressPercentage),
//                     }}
//                   >
//                     <span className="sr-detail-overall-num">
//                       {fmt(detail.overallProgressPercentage)}%
//                     </span>
//                     <span className="sr-detail-overall-lbl">overall</span>
//                   </div>
//                 </div>

//                 {/* Arc meters */}
//                 <div className="sr-arcs">
//                   {[
//                     {
//                       label: "Videos",
//                       val: detail.videoWatchPercentage,
//                       color: "#00FFB2",
//                       sub: `${detail.videosWatched ?? 0}/${detail.totalVideos ?? 0}`,
//                     },
//                     {
//                       label: "Files",
//                       val: detail.fileDownloadPercentage,
//                       color: "#38BDF8",
//                       sub: `${detail.filesDownloaded ?? 0}/${detail.totalFiles ?? 0}`,
//                     },
//                     {
//                       label: "Quizzes",
//                       val: detail.quizCompletionPercentage,
//                       color: "#A78BFA",
//                       sub: `${detail.quizzesCompleted ?? 0}/${detail.totalQuizzes ?? 0}`,
//                     },
//                     {
//                       label: "Assignments",
//                       val: detail.assignmentCompletionPercentage,
//                       color: "#FB923C",
//                       sub: `${detail.assignmentsCompleted ?? 0}/${detail.totalAssignments ?? 0}`,
//                     },
//                     {
//                       label: "Course",
//                       val: detail.courseProgressPercentage,
//                       color: "#FBBF24",
//                       sub: `${detail.courseContentCompleted ?? 0}/${detail.totalCourseContent ?? 0}`,
//                     },
//                   ].map((m) => (
//                     <div key={m.label} className="sr-arc-card">
//                       <ArcMeter value={m.val || 0} color={m.color} size={90} />
//                       <p className="sr-arc-label">{m.label}</p>
//                       <p className="sr-arc-sub">{m.sub}</p>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Breakdown + Radar */}
//                 <div className="sr-bottom-grid">
//                   <div className="sr-breakdown-card">
//                     <p className="sr-card-title">Progress Breakdown</p>
//                     {[
//                       {
//                         label: "Video watch",
//                         val: detail.videoWatchPercentage,
//                         color: "#00FFB2",
//                       },
//                       {
//                         label: "File download",
//                         val: detail.fileDownloadPercentage,
//                         color: "#38BDF8",
//                       },
//                       {
//                         label: "Quiz completion",
//                         val: detail.quizCompletionPercentage,
//                         color: "#A78BFA",
//                       },
//                       {
//                         label: "Assignments",
//                         val: detail.assignmentCompletionPercentage,
//                         color: "#FB923C",
//                       },
//                       {
//                         label: "Course content",
//                         val: detail.courseProgressPercentage,
//                         color: "#FBBF24",
//                       },
//                     ].map((m) => (
//                       <div key={m.label} className="sr-brow">
//                         <span className="sr-brow-lbl">{m.label}</span>
//                         <div className="sr-brow-track">
//                           <div
//                             className="sr-brow-fill"
//                             style={{
//                               width: `${Math.min(m.val || 0, 100)}%`,
//                               background: m.color,
//                               boxShadow: `0 0 8px ${m.color}`,
//                             }}
//                           />
//                         </div>
//                         <span
//                           className="sr-brow-pct"
//                           style={{ color: m.color }}
//                         >
//                           {fmt(m.val)}%
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                   <div className="sr-radar-card">
//                     <p className="sr-card-title">Skill Radar</p>
//                     <RadarChart data={detail} />
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// const css = `
// @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Outfit:wght@300;400;600;700&display=swap');

// .sr-wrap {
//   font-family: 'Space Grotesk', sans-serif;
//   background: #080C14;
//   min-height: 100vh;
//   padding: 2rem 1.5rem;
//   color: #fff;
//   background-image: radial-gradient(ellipse at 20% 10%, rgba(0,255,178,0.06) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(124,58,237,0.06) 0%, transparent 50%);
// }

// .sr-header {
//   display: flex;
//   align-items: flex-start;
//   justify-content: space-between;
//   flex-wrap: wrap;
//   gap: 16px;
//   margin-bottom: 2rem;
// }
// .sr-title-badge {
//   font-size: 10px;
//   font-weight: 600;
//   letter-spacing: 0.2em;
//   color: #00FFB2;
//   background: rgba(0,255,178,0.1);
//   border: 1px solid rgba(0,255,178,0.2);
//   padding: 3px 10px;
//   border-radius: 20px;
//   display: inline-block;
//   margin-bottom: 8px;
// }
// .sr-title {
//   font-family: 'Outfit', sans-serif;
//   font-size: 26px;
//   font-weight: 700;
//   margin: 0 0 4px;
//   background: linear-gradient(135deg, #fff 40%, rgba(255,255,255,0.5));
//   -webkit-background-clip: text;
//   -webkit-text-fill-color: transparent;
// }
// .sr-subtitle { font-size: 13px; color: rgba(255,255,255,0.4); margin: 0; }

// .sr-batch-row {
//   display: flex;
//   gap: 8px;
//   flex-wrap: wrap;
//   align-items: center;
// }
// .sr-batch-btn {
//   display: flex;
//   align-items: center;
//   gap: 6px;
//   padding: 8px 18px;
//   border-radius: 50px;
//   font-size: 13px;
//   font-weight: 500;
//   cursor: pointer;
//   border: 1px solid rgba(255,255,255,0.1);
//   background: rgba(255,255,255,0.04);
//   color: rgba(255,255,255,0.5);
//   font-family: 'Space Grotesk', sans-serif;
//   transition: all 0.2s;
// }
// .sr-batch-btn:hover { border-color: rgba(0,255,178,0.4); color: #00FFB2; }
// .sr-batch-btn.active {
//   background: rgba(0,255,178,0.12);
//   border-color: #00FFB2;
//   color: #00FFB2;
//   box-shadow: 0 0 20px rgba(0,255,178,0.15);
// }
// .sr-batch-dot {
//   width: 6px; height: 6px;
//   border-radius: 50%;
//   background: currentColor;
// }

// .sr-grid {
//   display: grid;
//   grid-template-columns: 340px 1fr;
//   gap: 16px;
//   align-items: start;
// }
// @media(max-width:900px){ .sr-grid{ grid-template-columns:1fr; } }

// .sr-panel {
//   background: rgba(255,255,255,0.03);
//   border: 1px solid rgba(255,255,255,0.07);
//   border-radius: 20px;
//   overflow: hidden;
//   backdrop-filter: blur(20px);
//   position: relative;
// }
// .sr-panel::before {
//   content:'';
//   position:absolute;
//   top:0;left:0;right:0;
//   height:1px;
//   background: linear-gradient(90deg, transparent, rgba(0,255,178,0.3), transparent);
// }

// .sr-panel-header {
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   padding: 18px 20px 12px;
//   border-bottom: 1px solid rgba(255,255,255,0.06);
// }
// .sr-panel-title { font-size: 13px; font-weight: 600; letter-spacing: 0.05em; color: rgba(255,255,255,0.7); text-transform: uppercase; }
// .sr-count-badge { font-size: 11px; background: rgba(0,255,178,0.15); color: #00FFB2; border-radius: 20px; padding: 2px 10px; font-weight: 600; }

// .sr-search-wrap {
//   display: flex;
//   align-items: center;
//   gap: 8px;
//   padding: 10px 16px;
//   border-bottom: 1px solid rgba(255,255,255,0.05);
// }
// .sr-search {
//   flex: 1;
//   background: none;
//   border: none;
//   outline: none;
//   font-size: 13px;
//   color: #fff;
//   font-family: 'Space Grotesk', sans-serif;
// }
// .sr-search::placeholder { color: rgba(255,255,255,0.25); }

// .sr-student-list { padding: 10px; max-height: 580px; overflow-y: auto; }
// .sr-student-list::-webkit-scrollbar { width: 3px; }
// .sr-student-list::-webkit-scrollbar-track { background: transparent; }
// .sr-student-list::-webkit-scrollbar-thumb { background: rgba(0,255,178,0.2); border-radius: 3px; }

// .sr-student-card {
//   display: flex;
//   align-items: center;
//   gap: 10px;
//   padding: 12px;
//   border-radius: 14px;
//   cursor: pointer;
//   transition: all 0.2s;
//   border: 1px solid transparent;
//   margin-bottom: 6px;
//   position: relative;
// }
// .sr-student-card:hover { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.08); }
// .sr-student-card.active { background: rgba(0,255,178,0.06); border-color: rgba(0,255,178,0.2); box-shadow: 0 4px 20px rgba(0,255,178,0.08); }

// .sr-av {
//   width: 36px; height: 36px;
//   border-radius: 50%;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   font-size: 12px;
//   font-weight: 700;
//   flex-shrink: 0;
// }
// .sr-student-info { flex: 1; min-width: 0; }
// .sr-student-email { font-size: 12px; font-weight: 500; color: rgba(255,255,255,0.85); margin: 0 0 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

// .sr-mini-bars { display: flex; gap: 4px; }
// .sr-mini-track { flex: 1; height: 3px; background: rgba(255,255,255,0.08); border-radius: 2px; overflow: hidden; }
// .sr-mini-fill { height: 3px; border-radius: 2px; transition: width 0.6s ease; }

// .sr-overall-pill {
//   font-size: 12px;
//   font-weight: 700;
//   border: 1px solid;
//   border-radius: 20px;
//   padding: 3px 10px;
//   flex-shrink: 0;
// }
// .sr-active-arrow { font-size: 18px; color: #00FFB2; flex-shrink: 0; }

// .sr-empty { text-align: center; padding: 3rem; color: rgba(255,255,255,0.2); font-size: 13px; }

// /* RIGHT PANEL */
// .sr-panel-right { min-height: 500px; }

// .sr-placeholder {
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
//   height: 500px;
//   gap: 16px;
// }
// .sr-placeholder-icon {
//   width: 80px; height: 80px;
//   border-radius: 50%;
//   background: rgba(0,255,178,0.05);
//   border: 1px solid rgba(0,255,178,0.1);
//   display: flex;
//   align-items: center;
//   justify-content: center;
// }
// .sr-placeholder-text { font-size: 13px; color: rgba(255,255,255,0.25); text-align: center; }

// .sr-detail-content { padding: 24px; }

// .sr-detail-banner {
//   display: flex;
//   align-items: center;
//   gap: 14px;
//   margin-bottom: 24px;
//   flex-wrap: wrap;
// }
// .sr-detail-avatar {
//   width: 52px; height: 52px;
//   border-radius: 50%;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   font-size: 18px;
//   font-weight: 700;
//   flex-shrink: 0;
// }
// .sr-detail-name {
//   font-family: 'Outfit', sans-serif;
//   font-size: 18px;
//   font-weight: 600;
//   margin: 0 0 3px;
//   color: #fff;
// }
// .sr-detail-batch { font-size: 12px; color: rgba(255,255,255,0.4); margin: 0; }
// .sr-detail-batch strong { color: rgba(255,255,255,0.7); }
// .sr-detail-overall {
//   margin-left: auto;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   border: 2px solid;
//   border-radius: 16px;
//   padding: 12px 20px;
//   backdrop-filter: blur(10px);
// }
// .sr-detail-overall-num { font-family: 'Outfit', sans-serif; font-size: 28px; font-weight: 700; line-height: 1; }
// .sr-detail-overall-lbl { font-size: 10px; color: rgba(255,255,255,0.4); margin-top: 3px; letter-spacing: 0.1em; text-transform: uppercase; }

// .sr-arcs {
//   display: grid;
//   grid-template-columns: repeat(5, 1fr);
//   gap: 8px;
//   margin-bottom: 20px;
// }
// @media(max-width:700px){ .sr-arcs{ grid-template-columns:repeat(3,1fr); } }

// .sr-arc-card {
//   background: rgba(255,255,255,0.03);
//   border: 1px solid rgba(255,255,255,0.07);
//   border-radius: 16px;
//   padding: 12px 8px 10px;
//   text-align: center;
//   transition: transform 0.2s, border-color 0.2s;
// }
// .sr-arc-card:hover { transform: translateY(-2px); border-color: rgba(255,255,255,0.15); }
// .sr-arc-label { font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.6); margin: 4px 0 2px; text-transform: uppercase; letter-spacing: 0.05em; }
// .sr-arc-sub { font-size: 10px; color: rgba(255,255,255,0.3); margin: 0; }

// .sr-bottom-grid {
//   display: grid;
//   grid-template-columns: 1fr 1fr;
//   gap: 16px;
// }
// @media(max-width:700px){ .sr-bottom-grid{ grid-template-columns:1fr; } }

// .sr-breakdown-card, .sr-radar-card {
//   background: rgba(255,255,255,0.03);
//   border: 1px solid rgba(255,255,255,0.07);
//   border-radius: 16px;
//   padding: 18px;
// }
// .sr-card-title {
//   font-size: 10px;
//   font-weight: 600;
//   letter-spacing: 0.12em;
//   text-transform: uppercase;
//   color: rgba(255,255,255,0.4);
//   margin: 0 0 16px;
// }

// .sr-brow { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
// .sr-brow:last-child { margin-bottom: 0; }
// .sr-brow-lbl { font-size: 12px; color: rgba(255,255,255,0.5); width: 105px; flex-shrink: 0; }
// .sr-brow-track { flex: 1; height: 6px; background: rgba(255,255,255,0.07); border-radius: 4px; overflow: hidden; }
// .sr-brow-fill { height: 6px; border-radius: 4px; transition: width 0.8s cubic-bezier(0.4,0,0.2,1); }
// .sr-brow-pct { font-size: 12px; font-weight: 700; width: 40px; text-align: right; }

// .sr-radar-card { display: flex; flex-direction: column; align-items: center; }

// .sr-loader {
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   gap: 12px;
//   height: 300px;
//   color: rgba(255,255,255,0.3);
//   font-size: 13px;
// }
// .sr-spinner {
//   width: 20px; height: 20px;
//   border: 2px solid rgba(0,255,178,0.15);
//   border-top-color: #00FFB2;
//   border-radius: 50%;
//   animation: spin 0.8s linear infinite;
// }
// @keyframes spin { to { transform: rotate(360deg); } }

// .sr-loading-rows { padding: 10px; }
// .sr-skel {
//   height: 60px;
//   background: rgba(255,255,255,0.04);
//   border-radius: 12px;
//   margin-bottom: 8px;
//   animation: skpulse 1.4s ease-in-out infinite;
// }
// @keyframes skpulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
// .sr-err { color: #FF4D6D; font-size: 13px; padding: 20px; text-align: center; }
// `;
























import { useState, useEffect } from "react";
import {
  Users,
  Search,
  BookOpen,
  Video,
  FileText,
  ClipboardList,
  BarChart3,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import { progressService } from "../services/progressService";
import { getTrainerBatches } from "../services/batchService";

/* ─── Theme tokens (identical to Dashboard) ─────────────────────────────── */
const T = {
  dark: {
    pageBg: "#0a0a0a",
    cardBg: "#111111",
    cardBgHov: "#161616",
    heroBg: "#141414",
    border: "rgba(255,255,255,0.06)",
    borderHov: "rgba(255,255,255,0.14)",
    borderHero: "rgba(255,255,255,0.07)",
    text: "#ffffff",
    textSub: "rgba(255,255,255,0.3)",
    textMuted: "rgba(255,255,255,0.2)",
    textLabel: "rgba(255,255,255,0.22)",
    pillBg: "rgba(255,255,255,0.04)",
    pillBorder: "rgba(255,255,255,0.07)",
    pillText: "rgba(255,255,255,0.25)",
    iconBg: "rgba(255,255,255,0.05)",
    iconBorder: "rgba(255,255,255,0.08)",
    barBg: "rgba(255,255,255,0.05)",
    actBg: "rgba(255,255,255,0.04)",
    actBorder: "rgba(255,255,255,0.07)",
    navBtnBg: "rgba(255,255,255,0.04)",
    navBtnBorder: "rgba(255,255,255,0.08)",
    navBtnColor: "#888",
    shadow: "0 4px 20px rgba(0,0,0,0.4)",
    shadowHov: "0 20px 60px rgba(0,0,0,0.6)",
    recentItemBg: "rgba(255,255,255,0.03)",
    recentItemBorder: "rgba(255,255,255,0.05)",
    recentItemBgHov: "rgba(255,255,255,0.06)",
    emptyBorder: "rgba(255,255,255,0.07)",
    emptyBg: "rgba(255,255,255,0.02)",
    emptyIcon: "rgba(255,255,255,0.12)",
    inputBg: "rgba(255,255,255,0.04)",
    inputBorder: "rgba(255,255,255,0.08)",
    scrollbar: "rgba(255,255,255,0.08)",
    activeRowBg: "rgba(34,211,238,0.06)",
    activeRowBorder: "rgba(34,211,238,0.2)",
    tableTh: "rgba(255,255,255,0.2)",
    tableThBg: "rgba(0,0,0,0.2)",
    gridLine: "rgba(255,255,255,0.5)",
  },
  light: {
    pageBg: "#f1f5f9",
    cardBg: "#ffffff",
    cardBgHov: "#f8fafc",
    heroBg: "#ffffff",
    border: "#e2e8f0",
    borderHov: "#cbd5e1",
    borderHero: "#e2e8f0",
    text: "#0f172a",
    textSub: "#64748b",
    textMuted: "#94a3b8",
    textLabel: "#94a3b8",
    pillBg: "#f1f5f9",
    pillBorder: "#e2e8f0",
    pillText: "#94a3b8",
    iconBg: "#f8fafc",
    iconBorder: "#e2e8f0",
    barBg: "#f1f5f9",
    actBg: "#f8fafc",
    actBorder: "#e2e8f0",
    navBtnBg: "#f8fafc",
    navBtnBorder: "#e2e8f0",
    navBtnColor: "#64748b",
    shadow: "0 1px 8px rgba(0,0,0,0.07)",
    shadowHov: "0 8px 32px rgba(0,0,0,0.10)",
    recentItemBg: "#f8fafc",
    recentItemBorder: "#e2e8f0",
    recentItemBgHov: "#f1f5f9",
    emptyBorder: "#e2e8f0",
    emptyBg: "#f8fafc",
    emptyIcon: "#cbd5e1",
    inputBg: "#f8fafc",
    inputBorder: "#e2e8f0",
    scrollbar: "#e2e8f0",
    activeRowBg: "rgba(8,145,178,0.05)",
    activeRowBorder: "rgba(8,145,178,0.2)",
    tableTh: "#94a3b8",
    tableThBg: "#f8fafc",
    gridLine: "rgba(0,0,0,0.12)",
  },
};

/* ─── Accent colors per metric ───────────────────────────────────────────── */
const METRIC_COLORS = {
  video: "#f43f5e",
  file: "#2dd4bf",
  quiz: "#a78bfa",
  assignment: "#f59e0b",
  course: "#22d3ee",
  overall: "#34d399",
};

const AV_PALETTES = [
  { bg: "linear-gradient(135deg,#34d399,#059669)", text: "#fff" },
  { bg: "linear-gradient(135deg,#a78bfa,#7c3aed)", text: "#fff" },
  { bg: "linear-gradient(135deg,#fb923c,#dc2626)", text: "#fff" },
  { bg: "linear-gradient(135deg,#38bdf8,#0369a1)", text: "#fff" },
  { bg: "linear-gradient(135deg,#fbbf24,#d97706)", text: "#1c1917" },
];

function fmt(v) {
  return typeof v === "number" ? Math.round(v) : 0;
}
function initials(email = "") {
  const name = email.split("@")[0];
  const parts = name.split(/[._-]/);
  return parts.length > 1
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
}
function progColor(v) {
  return v >= 75 ? METRIC_COLORS.overall : v >= 50 ? METRIC_COLORS.assignment : "#ef4444";
}

/* ─── Arc Meter (semi-circle) ────────────────────────────────────────────── */
function ArcMeter({ value, color, size = 80 }) {
  const r = 34, cx = 44, cy = 46;
  const circ = Math.PI * r;
  const progress = (value / 100) * circ;
  return (
    <svg viewBox="0 0 88 52" style={{ width: size, height: size * 0.6 }}>
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" strokeLinecap="round"
      />
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none" stroke={color} strokeWidth="5" strokeLinecap="round"
        strokeDasharray={`${progress} ${circ}`}
        style={{ filter: `drop-shadow(0 0 6px ${color}80)`, transition: "stroke-dasharray 1s ease" }}
      />
      <text x={cx} y={cy - 3} textAnchor="middle" fontSize="12" fontWeight="700"
        fill={color} fontFamily="'Poppins',sans-serif">
        {fmt(value)}%
      </text>
    </svg>
  );
}

/* ─── Radar Chart ────────────────────────────────────────────────────────── */
function RadarChart({ data, t }) {
  const axes = [
    { label: "Videos", val: data.videoWatchPercentage ?? 0 },
    { label: "Files", val: data.fileDownloadPercentage ?? 0 },
    { label: "Quizzes", val: data.quizCompletionPercentage ?? 0 },
    { label: "Assignments", val: data.assignmentCompletionPercentage ?? 0 },
    { label: "Course", val: data.courseProgressPercentage ?? 0 },
  ];
  const N = axes.length, cx = 130, cy = 120, r = 82;
  const ang = (i) => (Math.PI * 2 * i) / N - Math.PI / 2;
  const pt = (i, pct) => {
    const a = ang(i), d = (pct / 100) * r;
    return [cx + d * Math.cos(a), cy + d * Math.sin(a)];
  };
  const poly = axes.map((a, i) => pt(i, a.val).join(",")).join(" ");
  const radarFill = t === T.dark ? "rgba(34,211,238,0.12)" : "rgba(8,145,178,0.1)";
  const radarStroke = t === T.dark ? "#22d3ee" : "#0891b2";
  const ringStroke = t === T.dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const labelColor = t === T.dark ? "rgba(255,255,255,0.4)" : "#94a3b8";
  return (
    <svg viewBox="0 0 260 240" style={{ width: "100%", maxWidth: 220 }}>
      {[20, 40, 60, 80, 100].map((ring) => (
        <polygon key={ring} points={axes.map((_, i) => pt(i, ring).join(",")).join(" ")}
          fill="none" stroke={ringStroke} strokeWidth="1" />
      ))}
      {axes.map((_, i) => {
        const [x2, y2] = pt(i, 100);
        return <line key={i} x1={cx} y1={cy} x2={x2} y2={y2} stroke={ringStroke} strokeWidth="1" />;
      })}
      <polygon points={poly} fill={radarFill} stroke={radarStroke} strokeWidth="1.5" />
      {axes.map((a, i) => {
        const [x, y] = pt(i, a.val);
        return <circle key={i} cx={x} cy={y} r={3} fill={radarStroke} style={{ filter: `drop-shadow(0 0 4px ${radarStroke})` }} />;
      })}
      {axes.map((a, i) => {
        const [x, y] = pt(i, 115);
        return (
          <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle"
            fontSize="10" fill={labelColor} fontFamily="'Poppins',sans-serif">
            {a.label}
          </text>
        );
      })}
    </svg>
  );
}

/* ─── Donut Ring (same as Dashboard) ────────────────────────────────────── */
function DonutRing({ value, color, size = 72, strokeW = 6 }) {
  const r = (size - strokeW * 2) / 2;
  const circ = 2 * Math.PI * r;
  const progress = (value / 100) * circ;
  const cx = size / 2, cy = size / 2;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)", filter: `drop-shadow(0 0 8px ${color}60)` }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeW} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={strokeW}
        strokeLinecap="round" strokeDasharray={`${progress} ${circ}`}
        style={{ transition: "stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1)" }} />
    </svg>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────── */
export default function StudentReports() {
  const [isDark, setIsDark] = useState(
    () => typeof document !== "undefined" &&
      (document.documentElement.classList.contains("dark") ||
        document.documentElement.getAttribute("data-theme") === "dark")
  );
  useEffect(() => {
    const obs = new MutationObserver(() => {
      setIsDark(
        document.documentElement.classList.contains("dark") ||
        document.documentElement.getAttribute("data-theme") === "dark"
      );
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
    return () => obs.disconnect();
  }, []);
  const t = isDark ? T.dark : T.light;

  const [batches, setBatches] = useState([]);
  const [batchesLoading, setBatchesLoading] = useState(true);
  const [selectedBatchId, setSelectedBatchId] = useState(null);
  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentsError, setStudentsError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentDetail, setStudentDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    getTrainerBatches()
      .then((data) => {
        const list = data || [];
        setBatches(list);
        if (list.length > 0) setSelectedBatchId(list[0].id);
        setBatchesLoading(false);
      })
      .catch(() => setBatchesLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedBatchId) return;
    setStudentsLoading(true);
    setStudentsError(null);
    setStudents([]);
    setSelectedStudent(null);
    setStudentDetail(null);
    progressService.getBatchProgressReport(selectedBatchId)
      .then((res) => {
        setStudents(res.data?.studentReports || []);
        setStudentsLoading(false);
      })
      .catch((err) => {
        setStudentsError(err.response?.data?.message || err.message);
        setStudentsLoading(false);
      });
  }, [selectedBatchId]);

  useEffect(() => {
    if (!selectedStudent) return;
    setDetailLoading(true);
    progressService.getStudentProgressInBatch(
      selectedStudent.batchId || selectedBatchId,
      selectedStudent.studentEmail
    ).then((res) => {
      setStudentDetail(res.data);
      setDetailLoading(false);
    }).catch(() => {
      setStudentDetail(selectedStudent);
      setDetailLoading(false);
    });
  }, [selectedStudent]);

  const filtered = students.filter((s) =>
    s.studentEmail.toLowerCase().includes(search.toLowerCase())
  );

  const detail = studentDetail || selectedStudent;

  const card = {
    background: t.cardBg,
    border: `1px solid ${t.border}`,
    borderRadius: 20,
    boxShadow: t.shadow,
    overflow: "hidden",
    position: "relative",
  };

  const topLineGreen = {
    position: "absolute", top: 0, left: 0, right: 0, height: 1,
    background: "linear-gradient(90deg,transparent,rgba(34,211,238,0.35),transparent)",
  };

  if (batchesLoading) return (
    <>
      <style>{styles(t)}</style>
      <div style={{ minHeight: "100vh", background: t.pageBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader t={t} text="Loading..." />
      </div>
    </>
  );

  return (
    <>
      <style>{styles(t)}</style>
      <div style={{ minHeight: "100vh", background: t.pageBg, color: t.text, fontFamily: "'Poppins',sans-serif", padding: 24 }}>
        <div style={{ maxWidth: 1300, margin: "0 auto", paddingBottom: 52 }}>

          {/* ═══ HERO HEADER ═══ */}
          <div className="sr-fade" style={{
            borderRadius: 24, padding: "28px 32px",
            background: t.heroBg, border: `1px solid ${t.borderHero}`,
            position: "relative", overflow: "hidden", marginBottom: 20, boxShadow: t.shadow,
          }}>
            <div style={{
              position: "absolute", inset: 0, pointerEvents: "none", opacity: isDark ? 0.04 : 0.025,
              backgroundImage: `linear-gradient(${t.gridLine} 1px,transparent 1px),linear-gradient(90deg,${t.gridLine} 1px,transparent 1px)`,
              backgroundSize: "40px 40px",
            }} />
            <div style={{
              position: "absolute", top: "-30%", right: "10%",
              width: 260, height: 180,
              background: "radial-gradient(ellipse,rgba(34,211,238,0.07),transparent 70%)",
              pointerEvents: "none",
            }} />
            <div style={{ position: "relative", display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
                  <BarChart3 size={11} color={t.textSub} />
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: t.textSub }}>
                    Analytics
                  </span>
                </div>
                <h1 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 900, fontSize: "clamp(1.4rem,2.5vw,2rem)", color: t.text, margin: 0, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
                  Student Reports
                </h1>
                <p style={{ fontSize: 12, color: t.textSub, marginTop: 7, fontWeight: 500 }}>
                  Track individual learner progress across all metrics
                </p>
              </div>
              {/* Batch selector */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                {batches.map((b) => {
                  const active = selectedBatchId === b.id;
                  return (
                    <button key={b.id} onClick={() => setSelectedBatchId(b.id)}
                      style={{
                        display: "flex", alignItems: "center", gap: 6,
                        padding: "8px 18px", borderRadius: 10, fontSize: 12, fontWeight: 600,
                        cursor: "pointer", fontFamily: "'Poppins',sans-serif", transition: "all .2s",
                        border: `1px solid ${active ? "rgba(34,211,238,0.4)" : t.border}`,
                        background: active ? "rgba(34,211,238,0.1)" : t.pillBg,
                        color: active ? "#22d3ee" : t.textMuted,
                        boxShadow: active ? "0 0 16px rgba(34,211,238,0.15)" : "none",
                      }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor" }} />
                      Batch {b.id}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ═══ MAIN GRID ═══ */}
          <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 16, alignItems: "start" }}
            className="sr-main-grid">

            {/* LEFT: Student list */}
            <div style={{ ...card }}>
              <div style={topLineGreen} />

              {/* Panel header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px 12px", borderBottom: `1px solid ${t.border}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.2)" }}>
                    <Users size={15} color="#22d3ee" />
                  </div>
                  <span style={{ fontWeight: 700, fontSize: 13, color: t.text }}>Students</span>
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 700,
                  background: "rgba(34,211,238,0.1)", color: "#22d3ee",
                  border: "1px solid rgba(34,211,238,0.2)",
                  borderRadius: 999, padding: "2px 10px",
                }}>
                  {filtered.length}
                </span>
              </div>

              {/* Search */}
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "10px 16px", borderBottom: `1px solid ${t.border}`,
                background: searchFocused ? t.actBg : "transparent", transition: "background .2s",
              }}>
                <Search size={13} color={t.textMuted} />
                <input
                  style={{
                    flex: 1, background: "none", border: "none", outline: "none",
                    fontSize: 12, color: t.text, fontFamily: "'Poppins',sans-serif",
                  }}
                  placeholder="Search by email…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                />
              </div>

              {/* Student list */}
              <div style={{ maxHeight: 580, overflowY: "auto" }} className="sr-scroll">
                {studentsLoading && (
                  <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} style={{ height: 64, borderRadius: 12, background: t.barBg, animation: "srpulse 1.4s ease-in-out infinite" }} />
                    ))}
                  </div>
                )}
                {studentsError && (
                  <div style={{ padding: 20, textAlign: "center", fontSize: 12, color: "#ef4444" }}>{studentsError}</div>
                )}
                {!studentsLoading && filtered.length === 0 && (
                  <div style={{ padding: "3rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", border: `1.5px dashed ${t.emptyBorder}`, background: t.emptyBg }}>
                      <Users size={20} color={t.emptyIcon} />
                    </div>
                    <p style={{ fontSize: 11, color: t.textMuted, margin: 0, fontWeight: 500 }}>No students found</p>
                  </div>
                )}
                <div style={{ padding: 10 }}>
                  {filtered.map((s, i) => {
                    const pal = AV_PALETTES[i % 5];
                    const isActive = selectedStudent?.studentEmail === s.studentEmail;
                    const oc = progColor(s.overallProgressPercentage);
                    return (
                      <StudentCard
                        key={s.studentEmail}
                        s={s} pal={pal} isActive={isActive} t={t} oc={oc}
                        onClick={() => setSelectedStudent(s)}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {/* RIGHT: Detail panel */}
            <div style={{ ...card, minHeight: 500 }}>
              <div style={{ ...topLineGreen, background: "linear-gradient(90deg,transparent,rgba(167,139,250,0.35),transparent)" }} />

              {!selectedStudent && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 500, gap: 16 }}>
                  <div style={{ width: 80, height: 80, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: t.emptyBg, border: `1.5px dashed ${t.emptyBorder}` }}>
                    <Users size={32} color={t.emptyIcon} />
                  </div>
                  <p style={{ fontSize: 13, color: t.textMuted, fontWeight: 500, textAlign: "center", lineHeight: 1.6 }}>
                    Select a student to view<br />their detailed progress
                  </p>
                </div>
              )}

              {selectedStudent && detailLoading && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 400 }}>
                  <Loader t={t} text="Loading report…" />
                </div>
              )}

              {selectedStudent && !detailLoading && detail && (
                <DetailPanel detail={detail} selectedBatchId={selectedBatchId} t={t} isDark={isDark} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── Student Card ───────────────────────────────────────────────────────── */
function StudentCard({ s, pal, isActive, t, oc, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "11px 12px", borderRadius: 14, cursor: "pointer",
        marginBottom: 6, transition: "all .2s",
        border: `1px solid ${isActive ? "rgba(34,211,238,0.25)" : hov ? t.borderHov : "transparent"}`,
        background: isActive ? t.activeRowBg : hov ? t.recentItemBgHov : "transparent",
        boxShadow: isActive ? "0 4px 16px rgba(34,211,238,0.08)" : "none",
      }}>
      <div style={{ width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0, background: pal.bg, color: pal.text }}>
        {initials(s.studentEmail)}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: t.text, margin: "0 0 5px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {s.studentEmail}
        </p>
        <div style={{ display: "flex", gap: 4 }}>
          {[
            { val: s.videoWatchPercentage, color: METRIC_COLORS.video },
            { val: s.quizCompletionPercentage, color: METRIC_COLORS.quiz },
            { val: s.assignmentCompletionPercentage, color: METRIC_COLORS.assignment },
          ].map((m, mi) => (
            <div key={mi} style={{ flex: 1, height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
              <div style={{ height: 3, width: `${Math.min(m.val || 0, 100)}%`, background: m.color, borderRadius: 2, transition: "width .6s ease" }} />
            </div>
          ))}
        </div>
      </div>
      <span style={{
        fontSize: 11, fontWeight: 700,
        border: `1px solid ${oc}44`, borderRadius: 999, padding: "3px 10px",
        color: oc, flexShrink: 0,
        boxShadow: isActive ? `0 0 10px ${oc}40` : "none",
      }}>
        {fmt(s.overallProgressPercentage)}%
      </span>
      {isActive && <ChevronRight size={14} color="#22d3ee" style={{ flexShrink: 0 }} />}
    </div>
  );
}

/* ─── Detail Panel ───────────────────────────────────────────────────────── */
function DetailPanel({ detail, selectedBatchId, t, isDark }) {
  const oc = progColor(detail.overallProgressPercentage);
  const metrics = [
    { label: "Videos", val: detail.videoWatchPercentage, color: METRIC_COLORS.video, icon: Video, sub: `${detail.videosWatched ?? 0}/${detail.totalVideos ?? 0}` },
    { label: "Files", val: detail.fileDownloadPercentage, color: METRIC_COLORS.file, icon: FileText, sub: `${detail.filesDownloaded ?? 0}/${detail.totalFiles ?? 0}` },
    { label: "Quizzes", val: detail.quizCompletionPercentage, color: METRIC_COLORS.quiz, icon: BookOpen, sub: `${detail.quizzesCompleted ?? 0}/${detail.totalQuizzes ?? 0}` },
    { label: "Assignments", val: detail.assignmentCompletionPercentage, color: METRIC_COLORS.assignment, icon: ClipboardList, sub: `${detail.assignmentsCompleted ?? 0}/${detail.totalAssignments ?? 0}` },
    { label: "Course", val: detail.courseProgressPercentage, color: METRIC_COLORS.course, icon: TrendingUp, sub: `${detail.courseContentCompleted ?? 0}/${detail.totalCourseContent ?? 0}` },
  ];
  return (
    <div style={{ padding: 24 }}>
      {/* Banner */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22, paddingBottom: 18, borderBottom: `1px solid ${t.border}`, flexWrap: "wrap" }}>
        <div style={{ width: 50, height: 50, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 700, background: AV_PALETTES[0].bg, color: AV_PALETTES[0].text, flexShrink: 0 }}>
          {initials(detail.studentEmail)}
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 16, fontWeight: 700, margin: "0 0 4px", color: t.text }}>
            {detail.studentEmail}
          </h2>
          <span style={{ fontSize: 11, background: t.pillBg, border: `1px solid ${t.pillBorder}`, padding: "2px 10px", borderRadius: 999, color: t.textMuted }}>
            Batch {detail.batchId || selectedBatchId}
          </span>
        </div>
        {/* Overall donut */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, marginLeft: "auto" }}>
          <div style={{ position: "relative", width: 72, height: 72 }}>
            <DonutRing value={detail.overallProgressPercentage || 0} color={oc} size={72} strokeW={6} />
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontSize: 13, fontWeight: 700, color: oc, fontFamily: "'Poppins',sans-serif" }}>
              {fmt(detail.overallProgressPercentage)}%
            </div>
          </div>
          <span style={{ fontSize: 9, color: t.textMuted, letterSpacing: "0.1em", textTransform: "uppercase" }}>overall</span>
        </div>
      </div>

      {/* Arc meters grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8, marginBottom: 20 }} className="sr-arcs-grid">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <MetricCard key={m.label} m={m} t={t} />
          );
        })}
      </div>

      {/* Bottom: breakdown + radar */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 16, alignItems: "start" }} className="sr-bottom-grid">
        {/* Progress breakdown */}
        <div style={{ background: t.recentItemBg, border: `1px solid ${t.border}`, borderRadius: 16, padding: 18 }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: t.textLabel, margin: "0 0 14px" }}>
            Progress Breakdown
          </p>
          {metrics.map((m) => (
            <ProgressRow key={m.label} label={m.label} val={m.val} color={m.color} t={t} />
          ))}
        </div>
        {/* Radar */}
        <div style={{ background: t.recentItemBg, border: `1px solid ${t.border}`, borderRadius: 16, padding: 18, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: t.textLabel, margin: "0 0 10px", alignSelf: "flex-start" }}>
            Skill Radar
          </p>
          <RadarChart data={detail} t={isDark ? T.dark : T.light} />
        </div>
      </div>
    </div>
  );
}

/* ─── Metric Card ────────────────────────────────────────────────────────── */
function MetricCard({ m, t }) {
  const [hov, setHov] = useState(false);
  const Icon = m.icon;
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? t.recentItemBgHov : t.recentItemBg,
        border: `1px solid ${hov ? t.borderHov : t.border}`,
        borderRadius: 14, padding: "12px 8px 10px", textAlign: "center",
        transition: "all .2s", transform: hov ? "translateY(-2px)" : "none",
      }}>
      <ArcMeter value={m.val || 0} color={m.color} size={80} />
      <p style={{ fontSize: 10, fontWeight: 700, color: t.textMuted, margin: "4px 0 2px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {m.label}
      </p>
      <p style={{ fontSize: 10, color: t.textLabel, margin: 0 }}>{m.sub}</p>
    </div>
  );
}

/* ─── Progress Row ───────────────────────────────────────────────────────── */
function ProgressRow({ label, val, color, t }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 11 }}>
      <span style={{ fontSize: 11, color: t.textSub, width: 105, flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, height: 5, background: t.barBg, borderRadius: 4, overflow: "hidden" }}>
        <div style={{ height: 5, width: `${Math.min(val || 0, 100)}%`, background: color, borderRadius: 4, boxShadow: `0 0 6px ${color}80`, transition: "width .8s cubic-bezier(0.4,0,0.2,1)" }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color, width: 40, textAlign: "right" }}>{fmt(val)}%</span>
    </div>
  );
}

/* ─── Loader ─────────────────────────────────────────────────────────────── */
function Loader({ t, text }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, color: t.textMuted, fontSize: 13 }}>
      <div style={{ width: 20, height: 20, borderRadius: "50%", border: "2px solid rgba(34,211,238,0.15)", borderTopColor: "#22d3ee", animation: "srspin .8s linear infinite" }} />
      <span>{text}</span>
    </div>
  );
}

/* ─── Styles ─────────────────────────────────────────────────────────────── */
function styles(t) {
  return `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
    @keyframes sr-fade{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
    .sr-fade{animation:sr-fade .4s ease both}
    @keyframes srspin{to{transform:rotate(360deg)}}
    @keyframes srpulse{0%,100%{opacity:1}50%{opacity:.4}}
    * { box-sizing: border-box; }
    input::placeholder { color: ${t.textMuted}; font-family: 'Poppins', sans-serif; }
    .sr-scroll::-webkit-scrollbar { width: 3px; }
    .sr-scroll::-webkit-scrollbar-track { background: transparent; }
    .sr-scroll::-webkit-scrollbar-thumb { background: ${t.scrollbar}; border-radius: 3px; }
    @media(max-width:900px){ .sr-main-grid{ grid-template-columns: 1fr !important; } }
    @media(max-width:700px){ .sr-arcs-grid{ grid-template-columns: repeat(3,1fr) !important; } }
    @media(max-width:600px){ .sr-bottom-grid{ grid-template-columns: 1fr !important; } }
  `;
}