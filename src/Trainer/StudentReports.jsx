// import { useState, useEffect } from "react";
// import {
//   Users,
//   Search,
//   BookOpen,
//   Video,
//   FileText,
//   ClipboardList,
//   BarChart3,
//   TrendingUp,
//   ChevronRight,
// } from "lucide-react";
// import { progressService } from "../services/progressService";
// import { getTrainerBatches } from "../services/batchService";

// /* ─── Theme tokens (identical to Dashboard) ─────────────────────────────── */
// const T = {
//   dark: {
//     pageBg: "#0a0a0a",
//     cardBg: "#111111",
//     cardBgHov: "#161616",
//     heroBg: "#141414",
//     border: "rgba(255,255,255,0.06)",
//     borderHov: "rgba(255,255,255,0.14)",
//     borderHero: "rgba(255,255,255,0.07)",
//     text: "#ffffff",
//     textSub: "rgba(255,255,255,0.3)",
//     textMuted: "rgba(255,255,255,0.2)",
//     textLabel: "rgba(255,255,255,0.22)",
//     pillBg: "rgba(255,255,255,0.04)",
//     pillBorder: "rgba(255,255,255,0.07)",
//     pillText: "rgba(255,255,255,0.25)",
//     iconBg: "rgba(255,255,255,0.05)",
//     iconBorder: "rgba(255,255,255,0.08)",
//     barBg: "rgba(255,255,255,0.05)",
//     actBg: "rgba(255,255,255,0.04)",
//     actBorder: "rgba(255,255,255,0.07)",
//     navBtnBg: "rgba(255,255,255,0.04)",
//     navBtnBorder: "rgba(255,255,255,0.08)",
//     navBtnColor: "#888",
//     shadow: "0 4px 20px rgba(0,0,0,0.4)",
//     shadowHov: "0 20px 60px rgba(0,0,0,0.6)",
//     recentItemBg: "rgba(255,255,255,0.03)",
//     recentItemBorder: "rgba(255,255,255,0.05)",
//     recentItemBgHov: "rgba(255,255,255,0.06)",
//     emptyBorder: "rgba(255,255,255,0.07)",
//     emptyBg: "rgba(255,255,255,0.02)",
//     emptyIcon: "rgba(255,255,255,0.12)",
//     inputBg: "rgba(255,255,255,0.04)",
//     inputBorder: "rgba(255,255,255,0.08)",
//     scrollbar: "rgba(255,255,255,0.08)",
//     activeRowBg: "rgba(34,211,238,0.06)",
//     activeRowBorder: "rgba(34,211,238,0.2)",
//     tableTh: "rgba(255,255,255,0.2)",
//     tableThBg: "rgba(0,0,0,0.2)",
//     gridLine: "rgba(255,255,255,0.5)",
//   },
//   light: {
//     pageBg: "#f1f5f9",
//     cardBg: "#ffffff",
//     cardBgHov: "#f8fafc",
//     heroBg: "#ffffff",
//     border: "#e2e8f0",
//     borderHov: "#cbd5e1",
//     borderHero: "#e2e8f0",
//     text: "#0f172a",
//     textSub: "#64748b",
//     textMuted: "#94a3b8",
//     textLabel: "#94a3b8",
//     pillBg: "#f1f5f9",
//     pillBorder: "#e2e8f0",
//     pillText: "#94a3b8",
//     iconBg: "#f8fafc",
//     iconBorder: "#e2e8f0",
//     barBg: "#f1f5f9",
//     actBg: "#f8fafc",
//     actBorder: "#e2e8f0",
//     navBtnBg: "#f8fafc",
//     navBtnBorder: "#e2e8f0",
//     navBtnColor: "#64748b",
//     shadow: "0 1px 8px rgba(0,0,0,0.07)",
//     shadowHov: "0 8px 32px rgba(0,0,0,0.10)",
//     recentItemBg: "#f8fafc",
//     recentItemBorder: "#e2e8f0",
//     recentItemBgHov: "#f1f5f9",
//     emptyBorder: "#e2e8f0",
//     emptyBg: "#f8fafc",
//     emptyIcon: "#cbd5e1",
//     inputBg: "#f8fafc",
//     inputBorder: "#e2e8f0",
//     scrollbar: "#e2e8f0",
//     activeRowBg: "rgba(8,145,178,0.05)",
//     activeRowBorder: "rgba(8,145,178,0.2)",
//     tableTh: "#94a3b8",
//     tableThBg: "#f8fafc",
//     gridLine: "rgba(0,0,0,0.12)",
//   },
// };

// /* ─── Accent colors per metric ───────────────────────────────────────────── */
// const METRIC_COLORS = {
//   video: "#f43f5e",
//   file: "#2dd4bf",
//   quiz: "#a78bfa",
//   assignment: "#f59e0b",
//   course: "#22d3ee",
//   overall: "#34d399",
// };

// const AV_PALETTES = [
//   { bg: "linear-gradient(135deg,#34d399,#059669)", text: "#fff" },
//   { bg: "linear-gradient(135deg,#a78bfa,#7c3aed)", text: "#fff" },
//   { bg: "linear-gradient(135deg,#fb923c,#dc2626)", text: "#fff" },
//   { bg: "linear-gradient(135deg,#38bdf8,#0369a1)", text: "#fff" },
//   { bg: "linear-gradient(135deg,#fbbf24,#d97706)", text: "#1c1917" },
// ];

// function fmt(v) {
//   return typeof v === "number" ? Math.round(v) : 0;
// }
// function initials(email = "") {
//   const name = email.split("@")[0];
//   const parts = name.split(/[._-]/);
//   return parts.length > 1
//     ? (parts[0][0] + parts[1][0]).toUpperCase()
//     : name.slice(0, 2).toUpperCase();
// }
// function progColor(v) {
//   return v >= 75 ? METRIC_COLORS.overall : v >= 50 ? METRIC_COLORS.assignment : "#ef4444";
// }

// /* ─── Arc Meter (semi-circle) ────────────────────────────────────────────── */
// function ArcMeter({ value, color, size = 80 }) {
//   const r = 34, cx = 44, cy = 46;
//   const circ = Math.PI * r;
//   const progress = (value / 100) * circ;
//   return (
//     <svg viewBox="0 0 88 52" style={{ width: size, height: size * 0.6 }}>
//       <path
//         d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
//         fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" strokeLinecap="round"
//       />
//       <path
//         d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
//         fill="none" stroke={color} strokeWidth="5" strokeLinecap="round"
//         strokeDasharray={`${progress} ${circ}`}
//         style={{ filter: `drop-shadow(0 0 6px ${color}80)`, transition: "stroke-dasharray 1s ease" }}
//       />
//       <text x={cx} y={cy - 3} textAnchor="middle" fontSize="12" fontWeight="700"
//         fill={color} fontFamily="'Poppins',sans-serif">
//         {fmt(value)}%
//       </text>
//     </svg>
//   );
// }

// /* ─── Radar Chart ────────────────────────────────────────────────────────── */
// function RadarChart({ data, t }) {
//   const axes = [
//     { label: "Videos", val: data.videoWatchPercentage ?? 0 },
//     { label: "Files", val: data.fileDownloadPercentage ?? 0 },
//     { label: "Quizzes", val: data.quizCompletionPercentage ?? 0 },
//     { label: "Assignments", val: data.assignmentCompletionPercentage ?? 0 },
//     { label: "Course", val: data.courseProgressPercentage ?? 0 },
//   ];
//   const N = axes.length, cx = 130, cy = 120, r = 82;
//   const ang = (i) => (Math.PI * 2 * i) / N - Math.PI / 2;
//   const pt = (i, pct) => {
//     const a = ang(i), d = (pct / 100) * r;
//     return [cx + d * Math.cos(a), cy + d * Math.sin(a)];
//   };
//   const poly = axes.map((a, i) => pt(i, a.val).join(",")).join(" ");
//   const radarFill = t === T.dark ? "rgba(34,211,238,0.12)" : "rgba(8,145,178,0.1)";
//   const radarStroke = t === T.dark ? "#22d3ee" : "#0891b2";
//   const ringStroke = t === T.dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
//   const labelColor = t === T.dark ? "rgba(255,255,255,0.4)" : "#94a3b8";
//   return (
//     <svg viewBox="0 0 260 240" style={{ width: "100%", maxWidth: 220 }}>
//       {[20, 40, 60, 80, 100].map((ring) => (
//         <polygon key={ring} points={axes.map((_, i) => pt(i, ring).join(",")).join(" ")}
//           fill="none" stroke={ringStroke} strokeWidth="1" />
//       ))}
//       {axes.map((_, i) => {
//         const [x2, y2] = pt(i, 100);
//         return <line key={i} x1={cx} y1={cy} x2={x2} y2={y2} stroke={ringStroke} strokeWidth="1" />;
//       })}
//       <polygon points={poly} fill={radarFill} stroke={radarStroke} strokeWidth="1.5" />
//       {axes.map((a, i) => {
//         const [x, y] = pt(i, a.val);
//         return <circle key={i} cx={x} cy={y} r={3} fill={radarStroke} style={{ filter: `drop-shadow(0 0 4px ${radarStroke})` }} />;
//       })}
//       {axes.map((a, i) => {
//         const [x, y] = pt(i, 115);
//         return (
//           <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle"
//             fontSize="10" fill={labelColor} fontFamily="'Poppins',sans-serif">
//             {a.label}
//           </text>
//         );
//       })}
//     </svg>
//   );
// }

// /* ─── Donut Ring (same as Dashboard) ────────────────────────────────────── */
// function DonutRing({ value, color, size = 72, strokeW = 6 }) {
//   const r = (size - strokeW * 2) / 2;
//   const circ = 2 * Math.PI * r;
//   const progress = (value / 100) * circ;
//   const cx = size / 2, cy = size / 2;
//   return (
//     <svg width={size} height={size} style={{ transform: "rotate(-90deg)", filter: `drop-shadow(0 0 8px ${color}60)` }}>
//       <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeW} />
//       <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={strokeW}
//         strokeLinecap="round" strokeDasharray={`${progress} ${circ}`}
//         style={{ transition: "stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1)" }} />
//     </svg>
//   );
// }

// /* ─── Main Component ─────────────────────────────────────────────────────── */
// export default function StudentReports() {
//   const [isDark, setIsDark] = useState(
//     () => typeof document !== "undefined" &&
//       (document.documentElement.classList.contains("dark") ||
//         document.documentElement.getAttribute("data-theme") === "dark")
//   );
//   useEffect(() => {
//     const obs = new MutationObserver(() => {
//       setIsDark(
//         document.documentElement.classList.contains("dark") ||
//         document.documentElement.getAttribute("data-theme") === "dark"
//       );
//     });
//     obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
//     return () => obs.disconnect();
//   }, []);
//   const t = isDark ? T.dark : T.light;

//   const [batches, setBatches] = useState([]);
//   const [batchesLoading, setBatchesLoading] = useState(true);
//   const [selectedBatchId, setSelectedBatchId] = useState(null);
//   const [students, setStudents] = useState([]);
//   const [studentsLoading, setStudentsLoading] = useState(false);
//   const [studentsError, setStudentsError] = useState(null);
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [studentDetail, setStudentDetail] = useState(null);
//   const [detailLoading, setDetailLoading] = useState(false);
//   const [search, setSearch] = useState("");
//   const [searchFocused, setSearchFocused] = useState(false);

//   useEffect(() => {
//     getTrainerBatches()
//       .then((data) => {
//         const list = data || [];
//         setBatches(list);
//         if (list.length > 0) setSelectedBatchId(list[0].id);
//         setBatchesLoading(false);
//       })
//       .catch(() => setBatchesLoading(false));
//   }, []);

//   useEffect(() => {
//     if (!selectedBatchId) return;
//     setStudentsLoading(true);
//     setStudentsError(null);
//     setStudents([]);
//     setSelectedStudent(null);
//     setStudentDetail(null);
//     progressService.getBatchProgressReport(selectedBatchId)
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
//     progressService.getStudentProgressInBatch(
//       selectedStudent.batchId || selectedBatchId,
//       selectedStudent.studentEmail
//     ).then((res) => {
//       setStudentDetail(res.data);
//       setDetailLoading(false);
//     }).catch(() => {
//       setStudentDetail(selectedStudent);
//       setDetailLoading(false);
//     });
//   }, [selectedStudent]);

//   const filtered = students.filter((s) =>
//     s.studentEmail.toLowerCase().includes(search.toLowerCase())
//   );

//   const detail = studentDetail || selectedStudent;

//   const card = {
//     background: t.cardBg,
//     border: `1px solid ${t.border}`,
//     borderRadius: 20,
//     boxShadow: t.shadow,
//     overflow: "hidden",
//     position: "relative",
//   };

//   const topLineGreen = {
//     position: "absolute", top: 0, left: 0, right: 0, height: 1,
//     background: "linear-gradient(90deg,transparent,rgba(34,211,238,0.35),transparent)",
//   };

//   if (batchesLoading) return (
//     <>
//       <style>{styles(t)}</style>
//       <div style={{ minHeight: "100vh", background: t.pageBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
//         <Loader t={t} text="Loading..." />
//       </div>
//     </>
//   );

//   return (
//     <>
//       <style>{styles(t)}</style>
//       <div style={{ minHeight: "100vh", background: t.pageBg, color: t.text, fontFamily: "'Poppins',sans-serif", padding: 24 }}>
//         <div style={{ maxWidth: 1300, margin: "0 auto", paddingBottom: 52 }}>

//           {/* ═══ HERO HEADER ═══ */}
//           <div className="sr-fade" style={{
//             borderRadius: 24, padding: "28px 32px",
//             background: t.heroBg, border: `1px solid ${t.borderHero}`,
//             position: "relative", overflow: "hidden", marginBottom: 20, boxShadow: t.shadow,
//           }}>
//             <div style={{
//               position: "absolute", inset: 0, pointerEvents: "none", opacity: isDark ? 0.04 : 0.025,
//               backgroundImage: `linear-gradient(${t.gridLine} 1px,transparent 1px),linear-gradient(90deg,${t.gridLine} 1px,transparent 1px)`,
//               backgroundSize: "40px 40px",
//             }} />
//             <div style={{
//               position: "absolute", top: "-30%", right: "10%",
//               width: 260, height: 180,
//               background: "radial-gradient(ellipse,rgba(34,211,238,0.07),transparent 70%)",
//               pointerEvents: "none",
//             }} />
//             <div style={{ position: "relative", display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
//               <div>
//                 <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
//                   <BarChart3 size={11} color={t.textSub} />
//                   <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: t.textSub }}>
//                     Analytics
//                   </span>
//                 </div>
//                 <h1 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 900, fontSize: "clamp(1.4rem,2.5vw,2rem)", color: t.text, margin: 0, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
//                   Student Reports
//                 </h1>
//                 <p style={{ fontSize: 12, color: t.textSub, marginTop: 7, fontWeight: 500 }}>
//                   Track individual learner progress across all metrics
//                 </p>
//               </div>
//               {/* Batch selector */}
//               <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
//                 {batches.map((b) => {
//                   const active = selectedBatchId === b.id;
//                   return (
//                     <button key={b.id} onClick={() => setSelectedBatchId(b.id)}
//                       style={{
//                         display: "flex", alignItems: "center", gap: 6,
//                         padding: "8px 18px", borderRadius: 10, fontSize: 12, fontWeight: 600,
//                         cursor: "pointer", fontFamily: "'Poppins',sans-serif", transition: "all .2s",
//                         border: `1px solid ${active ? "rgba(34,211,238,0.4)" : t.border}`,
//                         background: active ? "rgba(34,211,238,0.1)" : t.pillBg,
//                         color: active ? "#22d3ee" : t.textMuted,
//                         boxShadow: active ? "0 0 16px rgba(34,211,238,0.15)" : "none",
//                       }}>
//                       <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor" }} />
//                       Batch {b.id}
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>

//           {/* ═══ MAIN GRID ═══ */}
//           <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 16, alignItems: "start" }}
//             className="sr-main-grid">

//             {/* LEFT: Student list */}
//             <div style={{ ...card }}>
//               <div style={topLineGreen} />

//               {/* Panel header */}
//               <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px 12px", borderBottom: `1px solid ${t.border}` }}>
//                 <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//                   <div style={{ width: 32, height: 32, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.2)" }}>
//                     <Users size={15} color="#22d3ee" />
//                   </div>
//                   <span style={{ fontWeight: 700, fontSize: 13, color: t.text }}>Students</span>
//                 </div>
//                 <span style={{
//                   fontSize: 11, fontWeight: 700,
//                   background: "rgba(34,211,238,0.1)", color: "#22d3ee",
//                   border: "1px solid rgba(34,211,238,0.2)",
//                   borderRadius: 999, padding: "2px 10px",
//                 }}>
//                   {filtered.length}
//                 </span>
//               </div>

//               {/* Search */}
//               <div style={{
//                 display: "flex", alignItems: "center", gap: 8,
//                 padding: "10px 16px", borderBottom: `1px solid ${t.border}`,
//                 background: searchFocused ? t.actBg : "transparent", transition: "background .2s",
//               }}>
//                 <Search size={13} color={t.textMuted} />
//                 <input
//                   style={{
//                     flex: 1, background: "none", border: "none", outline: "none",
//                     fontSize: 12, color: t.text, fontFamily: "'Poppins',sans-serif",
//                   }}
//                   placeholder="Search by email…"
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                   onFocus={() => setSearchFocused(true)}
//                   onBlur={() => setSearchFocused(false)}
//                 />
//               </div>

//               {/* Student list */}
//               <div style={{ maxHeight: 580, overflowY: "auto" }} className="sr-scroll">
//                 {studentsLoading && (
//                   <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
//                     {[1, 2, 3, 4].map((i) => (
//                       <div key={i} style={{ height: 64, borderRadius: 12, background: t.barBg, animation: "srpulse 1.4s ease-in-out infinite" }} />
//                     ))}
//                   </div>
//                 )}
//                 {studentsError && (
//                   <div style={{ padding: 20, textAlign: "center", fontSize: 12, color: "#ef4444" }}>{studentsError}</div>
//                 )}
//                 {!studentsLoading && filtered.length === 0 && (
//                   <div style={{ padding: "3rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
//                     <div style={{ width: 48, height: 48, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", border: `1.5px dashed ${t.emptyBorder}`, background: t.emptyBg }}>
//                       <Users size={20} color={t.emptyIcon} />
//                     </div>
//                     <p style={{ fontSize: 11, color: t.textMuted, margin: 0, fontWeight: 500 }}>No students found</p>
//                   </div>
//                 )}
//                 <div style={{ padding: 10 }}>
//                   {filtered.map((s, i) => {
//                     const pal = AV_PALETTES[i % 5];
//                     const isActive = selectedStudent?.studentEmail === s.studentEmail;
//                     const oc = progColor(s.overallProgressPercentage);
//                     return (
//                       <StudentCard
//                         key={s.studentEmail}
//                         s={s} pal={pal} isActive={isActive} t={t} oc={oc}
//                         onClick={() => setSelectedStudent(s)}
//                       />
//                     );
//                   })}
//                 </div>
//               </div>
//             </div>

//             {/* RIGHT: Detail panel */}
//             <div style={{ ...card, minHeight: 500 }}>
//               <div style={{ ...topLineGreen, background: "linear-gradient(90deg,transparent,rgba(167,139,250,0.35),transparent)" }} />

//               {!selectedStudent && (
//                 <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 500, gap: 16 }}>
//                   <div style={{ width: 80, height: 80, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: t.emptyBg, border: `1.5px dashed ${t.emptyBorder}` }}>
//                     <Users size={32} color={t.emptyIcon} />
//                   </div>
//                   <p style={{ fontSize: 13, color: t.textMuted, fontWeight: 500, textAlign: "center", lineHeight: 1.6 }}>
//                     Select a student to view<br />their detailed progress
//                   </p>
//                 </div>
//               )}

//               {selectedStudent && detailLoading && (
//                 <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 400 }}>
//                   <Loader t={t} text="Loading report…" />
//                 </div>
//               )}

//               {selectedStudent && !detailLoading && detail && (
//                 <DetailPanel detail={detail} selectedBatchId={selectedBatchId} t={t} isDark={isDark} />
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// /* ─── Student Card ───────────────────────────────────────────────────────── */
// function StudentCard({ s, pal, isActive, t, oc, onClick }) {
//   const [hov, setHov] = useState(false);
//   return (
//     <div
//       onClick={onClick}
//       onMouseEnter={() => setHov(true)}
//       onMouseLeave={() => setHov(false)}
//       style={{
//         display: "flex", alignItems: "center", gap: 10,
//         padding: "11px 12px", borderRadius: 14, cursor: "pointer",
//         marginBottom: 6, transition: "all .2s",
//         border: `1px solid ${isActive ? "rgba(34,211,238,0.25)" : hov ? t.borderHov : "transparent"}`,
//         background: isActive ? t.activeRowBg : hov ? t.recentItemBgHov : "transparent",
//         boxShadow: isActive ? "0 4px 16px rgba(34,211,238,0.08)" : "none",
//       }}>
//       <div style={{ width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0, background: pal.bg, color: pal.text }}>
//         {initials(s.studentEmail)}
//       </div>
//       <div style={{ flex: 1, minWidth: 0 }}>
//         <p style={{ fontSize: 12, fontWeight: 600, color: t.text, margin: "0 0 5px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
//           {s.studentEmail}
//         </p>
//         <div style={{ display: "flex", gap: 4 }}>
//           {[
//             { val: s.videoWatchPercentage, color: METRIC_COLORS.video },
//             { val: s.quizCompletionPercentage, color: METRIC_COLORS.quiz },
//             { val: s.assignmentCompletionPercentage, color: METRIC_COLORS.assignment },
//           ].map((m, mi) => (
//             <div key={mi} style={{ flex: 1, height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
//               <div style={{ height: 3, width: `${Math.min(m.val || 0, 100)}%`, background: m.color, borderRadius: 2, transition: "width .6s ease" }} />
//             </div>
//           ))}
//         </div>
//       </div>
//       <span style={{
//         fontSize: 11, fontWeight: 700,
//         border: `1px solid ${oc}44`, borderRadius: 999, padding: "3px 10px",
//         color: oc, flexShrink: 0,
//         boxShadow: isActive ? `0 0 10px ${oc}40` : "none",
//       }}>
//         {fmt(s.overallProgressPercentage)}%
//       </span>
//       {isActive && <ChevronRight size={14} color="#22d3ee" style={{ flexShrink: 0 }} />}
//     </div>
//   );
// }

// /* ─── Detail Panel ───────────────────────────────────────────────────────── */
// function DetailPanel({ detail, selectedBatchId, t, isDark }) {
//   const oc = progColor(detail.overallProgressPercentage);
//   const metrics = [
//     { label: "Videos", val: detail.videoWatchPercentage, color: METRIC_COLORS.video, icon: Video, sub: `${detail.videosWatched ?? 0}/${detail.totalVideos ?? 0}` },
//     { label: "Files", val: detail.fileDownloadPercentage, color: METRIC_COLORS.file, icon: FileText, sub: `${detail.filesDownloaded ?? 0}/${detail.totalFiles ?? 0}` },
//     { label: "Quizzes", val: detail.quizCompletionPercentage, color: METRIC_COLORS.quiz, icon: BookOpen, sub: `${detail.quizzesCompleted ?? 0}/${detail.totalQuizzes ?? 0}` },
//     { label: "Assignments", val: detail.assignmentCompletionPercentage, color: METRIC_COLORS.assignment, icon: ClipboardList, sub: `${detail.assignmentsCompleted ?? 0}/${detail.totalAssignments ?? 0}` },
//     { label: "Course", val: detail.courseProgressPercentage, color: METRIC_COLORS.course, icon: TrendingUp, sub: `${detail.courseContentCompleted ?? 0}/${detail.totalCourseContent ?? 0}` },
//   ];
//   return (
//     <div style={{ padding: 24 }}>
//       {/* Banner */}
//       <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22, paddingBottom: 18, borderBottom: `1px solid ${t.border}`, flexWrap: "wrap" }}>
//         <div style={{ width: 50, height: 50, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 700, background: AV_PALETTES[0].bg, color: AV_PALETTES[0].text, flexShrink: 0 }}>
//           {initials(detail.studentEmail)}
//         </div>
//         <div style={{ flex: 1 }}>
//           <h2 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 16, fontWeight: 700, margin: "0 0 4px", color: t.text }}>
//             {detail.studentEmail}
//           </h2>
//           <span style={{ fontSize: 11, background: t.pillBg, border: `1px solid ${t.pillBorder}`, padding: "2px 10px", borderRadius: 999, color: t.textMuted }}>
//             Batch {detail.batchId || selectedBatchId}
//           </span>
//         </div>
//         {/* Overall donut */}
//         <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, marginLeft: "auto" }}>
//           <div style={{ position: "relative", width: 72, height: 72 }}>
//             <DonutRing value={detail.overallProgressPercentage || 0} color={oc} size={72} strokeW={6} />
//             <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontSize: 13, fontWeight: 700, color: oc, fontFamily: "'Poppins',sans-serif" }}>
//               {fmt(detail.overallProgressPercentage)}%
//             </div>
//           </div>
//           <span style={{ fontSize: 9, color: t.textMuted, letterSpacing: "0.1em", textTransform: "uppercase" }}>overall</span>
//         </div>
//       </div>

//       {/* Arc meters grid */}
//       <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8, marginBottom: 20 }} className="sr-arcs-grid">
//         {metrics.map((m) => {
//           const Icon = m.icon;
//           return (
//             <MetricCard key={m.label} m={m} t={t} />
//           );
//         })}
//       </div>

//       {/* Bottom: breakdown + radar */}
//       <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 16, alignItems: "start" }} className="sr-bottom-grid">
//         {/* Progress breakdown */}
//         <div style={{ background: t.recentItemBg, border: `1px solid ${t.border}`, borderRadius: 16, padding: 18 }}>
//           <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: t.textLabel, margin: "0 0 14px" }}>
//             Progress Breakdown
//           </p>
//           {metrics.map((m) => (
//             <ProgressRow key={m.label} label={m.label} val={m.val} color={m.color} t={t} />
//           ))}
//         </div>
//         {/* Radar */}
//         <div style={{ background: t.recentItemBg, border: `1px solid ${t.border}`, borderRadius: 16, padding: 18, display: "flex", flexDirection: "column", alignItems: "center" }}>
//           <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: t.textLabel, margin: "0 0 10px", alignSelf: "flex-start" }}>
//             Skill Radar
//           </p>
//           <RadarChart data={detail} t={isDark ? T.dark : T.light} />
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ─── Metric Card ────────────────────────────────────────────────────────── */
// function MetricCard({ m, t }) {
//   const [hov, setHov] = useState(false);
//   const Icon = m.icon;
//   return (
//     <div
//       onMouseEnter={() => setHov(true)}
//       onMouseLeave={() => setHov(false)}
//       style={{
//         background: hov ? t.recentItemBgHov : t.recentItemBg,
//         border: `1px solid ${hov ? t.borderHov : t.border}`,
//         borderRadius: 14, padding: "12px 8px 10px", textAlign: "center",
//         transition: "all .2s", transform: hov ? "translateY(-2px)" : "none",
//       }}>
//       <ArcMeter value={m.val || 0} color={m.color} size={80} />
//       <p style={{ fontSize: 10, fontWeight: 700, color: t.textMuted, margin: "4px 0 2px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
//         {m.label}
//       </p>
//       <p style={{ fontSize: 10, color: t.textLabel, margin: 0 }}>{m.sub}</p>
//     </div>
//   );
// }

// /* ─── Progress Row ───────────────────────────────────────────────────────── */
// function ProgressRow({ label, val, color, t }) {
//   return (
//     <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 11 }}>
//       <span style={{ fontSize: 11, color: t.textSub, width: 105, flexShrink: 0 }}>{label}</span>
//       <div style={{ flex: 1, height: 5, background: t.barBg, borderRadius: 4, overflow: "hidden" }}>
//         <div style={{ height: 5, width: `${Math.min(val || 0, 100)}%`, background: color, borderRadius: 4, boxShadow: `0 0 6px ${color}80`, transition: "width .8s cubic-bezier(0.4,0,0.2,1)" }} />
//       </div>
//       <span style={{ fontSize: 12, fontWeight: 700, color, width: 40, textAlign: "right" }}>{fmt(val)}%</span>
//     </div>
//   );
// }

// /* ─── Loader ─────────────────────────────────────────────────────────────── */
// function Loader({ t, text }) {
//   return (
//     <div style={{ display: "flex", alignItems: "center", gap: 12, color: t.textMuted, fontSize: 13 }}>
//       <div style={{ width: 20, height: 20, borderRadius: "50%", border: "2px solid rgba(34,211,238,0.15)", borderTopColor: "#22d3ee", animation: "srspin .8s linear infinite" }} />
//       <span>{text}</span>
//     </div>
//   );
// }

// /* ─── Styles ─────────────────────────────────────────────────────────────── */
// function styles(t) {
//   return `
//     @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
//     @keyframes sr-fade{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
//     .sr-fade{animation:sr-fade .4s ease both}
//     @keyframes srspin{to{transform:rotate(360deg)}}
//     @keyframes srpulse{0%,100%{opacity:1}50%{opacity:.4}}
//     * { box-sizing: border-box; }
//     input::placeholder { color: ${t.textMuted}; font-family: 'Poppins', sans-serif; }
//     .sr-scroll::-webkit-scrollbar { width: 3px; }
//     .sr-scroll::-webkit-scrollbar-track { background: transparent; }
//     .sr-scroll::-webkit-scrollbar-thumb { background: ${t.scrollbar}; border-radius: 3px; }
//     @media(max-width:900px){ .sr-main-grid{ grid-template-columns: 1fr !important; } }
//     @media(max-width:700px){ .sr-arcs-grid{ grid-template-columns: repeat(3,1fr) !important; } }
//     @media(max-width:600px){ .sr-bottom-grid{ grid-template-columns: 1fr !important; } }
//   `;
// }
















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

/* ─── Donut Ring ─────────────────────────────────────────────────────────── */
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
      <div style={{ minHeight: "100vh", background: t.pageBg, color: t.text, fontFamily: "'Poppins',sans-serif", padding: "clamp(12px,3vw,24px)" }}>
        <div style={{ maxWidth: 1300, margin: "0 auto", paddingBottom: 52 }}>

          {/* ═══ HERO HEADER ═══ */}
          <div className="sr-fade" style={{
            borderRadius: 24,
            padding: "clamp(16px,3vw,28px) clamp(16px,4vw,32px)",
            background: t.heroBg,
            border: `1px solid ${t.borderHero}`,
            position: "relative",
            overflow: "hidden",
            marginBottom: 20,
            boxShadow: t.shadow,
          }}>
            {/* grid bg */}
            <div style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              opacity: isDark ? 0.04 : 0.025,
              backgroundImage: `linear-gradient(${t.gridLine} 1px,transparent 1px),linear-gradient(90deg,${t.gridLine} 1px,transparent 1px)`,
              backgroundSize: "40px 40px",
            }} />
            {/* glow */}
            <div style={{
              position: "absolute", top: "-30%", right: "10%",
              width: 260, height: 180,
              background: "radial-gradient(ellipse,rgba(34,211,238,0.07),transparent 70%)",
              pointerEvents: "none",
            }} />

            <div style={{
              position: "relative",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 16,
            }}>
              {/* ── Left: Title block ── */}
              <div style={{ minWidth: 0 }}>
                {/* Label row */}
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
                  <BarChart3 size={11} color={t.textSub} />
                  <span style={{
                    fontSize: 9, fontWeight: 700,
                    letterSpacing: "0.22em", textTransform: "uppercase",
                    color: t.textSub,
                  }}>
                    Analytics
                  </span>
                </div>

                {/* ── Hero Title: "Student" plain + "Reports" gradient ── */}
                <h1 style={{
                  fontFamily: "'Poppins',sans-serif",
                  fontWeight: 900,
                  fontSize: "clamp(1.3rem,3vw,2rem)",
                  margin: "0 0 5px",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.15,
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "baseline",
                  gap: "0 8px",
                }}>
                  {/* theme-aware plain text */}
                  <span style={{ color: t.text }}>
                    Student
                  </span>
                  {/* blue gradient — same as Feedback Dashboard */}
                  <span style={{
                    background: "linear-gradient(135deg,#7c83ff,#60a5fa)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}>
                    Reports
                  </span>
                </h1>

                <p style={{
                  fontSize: "clamp(11px,1.8vw,12px)",
                  color: t.textSub,
                  marginTop: 0,
                  fontWeight: 500,
                }}>
                  Track individual learner progress across all metrics
                </p>
              </div>

              {/* ── Right: Batch selector ── */}
              <div style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                alignItems: "center",
              }}>
                {batches.map((b) => {
                  const active = selectedBatchId === b.id;
                  return (
                    <button key={b.id} onClick={() => setSelectedBatchId(b.id)}
                      style={{
                        display: "flex", alignItems: "center", gap: 6,
                        padding: "8px 18px", borderRadius: 10,
                        fontSize: "clamp(11px,1.5vw,12px)",
                        fontWeight: 600,
                        cursor: "pointer", fontFamily: "'Poppins',sans-serif",
                        transition: "all .2s",
                        border: `1px solid ${active ? "rgba(34,211,238,0.4)" : t.border}`,
                        background: active ? "rgba(34,211,238,0.1)" : t.pillBg,
                        color: active ? "#22d3ee" : t.textMuted,
                        boxShadow: active ? "0 0 16px rgba(34,211,238,0.15)" : "none",
                      }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor", flexShrink: 0 }} />
                      Batch {b.id}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ═══ MAIN GRID ═══ */}
          <div
            style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 16, alignItems: "start" }}
            className="sr-main-grid"
          >

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
    <div style={{ padding: "clamp(14px,3vw,24px)" }}>
      {/* Banner */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22, paddingBottom: 18, borderBottom: `1px solid ${t.border}`, flexWrap: "wrap" }}>
        <div style={{ width: 50, height: 50, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 700, background: AV_PALETTES[0].bg, color: AV_PALETTES[0].text, flexShrink: 0 }}>
          {initials(detail.studentEmail)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{ fontFamily: "'Poppins',sans-serif", fontSize: "clamp(13px,2vw,16px)", fontWeight: 700, margin: "0 0 4px", color: t.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
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

    /* ── Main grid: side-by-side on desktop, stacked on mobile ── */
    .sr-main-grid { grid-template-columns: 340px 1fr !important; }
    @media(max-width:900px){
      .sr-main-grid { grid-template-columns: 1fr !important; }
    }

    /* ── Arc meters: 5 cols → 3 → 2 ── */
    .sr-arcs-grid { grid-template-columns: repeat(5,1fr) !important; }
    @media(max-width:700px){
      .sr-arcs-grid { grid-template-columns: repeat(3,1fr) !important; }
    }
    @media(max-width:420px){
      .sr-arcs-grid { grid-template-columns: repeat(2,1fr) !important; }
    }

    /* ── Bottom grid: breakdown + radar → stack on small ── */
    .sr-bottom-grid { grid-template-columns: 1fr auto !important; }
    @media(max-width:600px){
      .sr-bottom-grid { grid-template-columns: 1fr !important; }
    }

    /* ── Batch buttons wrap nicely on phones ── */
    @media(max-width:480px){
      .sr-hero-right { width: 100%; }
    }
  `;
}