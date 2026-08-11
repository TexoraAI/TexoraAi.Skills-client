// import { useEffect, useState } from "react";
// import attendanceService from "../services/attendanceService";
// import {
//   Users,
//   Layers,
//   ChevronDown,
//   ChevronRight,
//   CalendarCheck,
//   UserCheck,
//   AlertCircle,
//   Download,
//   Filter,
// } from "lucide-react";

// const isDark = () =>
//   document.documentElement.classList.contains("dark") ||
//   document.body.classList.contains("dark") ||
//   window.matchMedia("(prefers-color-scheme: dark)").matches;

// const STAT_COLORS = {
//   batches: "linear-gradient(135deg,#0e7490,#22d3ee)",
//   sessions: "linear-gradient(135deg,#312e81,#a78bfa)",
//   students: "linear-gradient(135deg,#064e3b,#34d399)",
// };

// function StatusDot({ status }) {
//   const c =
//     status === "PRESENT"
//       ? "#10b981"
//       : status === "ABSENT"
//         ? "#f43f5e"
//         : "#f59e0b";
//   return (
//     <span
//       style={{
//         display: "inline-block",
//         width: 8,
//         height: 8,
//         borderRadius: "50%",
//         background: c,
//         marginRight: 6,
//       }}
//     />
//   );
// }
// const selectStyle = (theme) => ({
//   padding: "8px 10px",
//   borderRadius: 8,
//   border: `1px solid ${theme.bd}`,
//   background: theme.card,
//   color: theme.text,
//   fontSize: 12,
// });

// const inputStyle = (theme) => ({
//   padding: "8px 10px",
//   borderRadius: 8,
//   border: `1px solid ${theme.bd}`,
//   background: theme.card,
//   color: theme.text,
//   fontSize: 12,
// });

// const btnStyle = (color) => ({
//   padding: "8px 14px",
//   borderRadius: 8,
//   border: "none",
//   background: color,
//   color: "#fff",
//   fontSize: 12,
//   fontWeight: 600,
//   cursor: "pointer",
//   display: "inline-flex",
//   alignItems: "center",
// });

// const pill = (theme) => ({
//   padding: "4px 10px",
//   borderRadius: 8,
//   background: theme.rowHover,
//   border: `1px solid ${theme.bd}`,
//   color: theme.text,
// });

// const thStyle = { padding: "6px 10px", fontWeight: 600 };
// const tdStyle = { padding: "6px 10px" };

// export default function AdminAttendance() {
//   const [dark, setDark] = useState(isDark);
//   const [overview, setOverview] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [expandedBatchId, setExpandedBatchId] = useState(null);
//   const [detail, setDetail] = useState(null);
//   const [detailLoading, setDetailLoading] = useState(false);

//   // ---- History / Filters / Excel (NEW) ----
//   const [filterType, setFilterType] = useState("THIS_MONTH");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [filterBatchId, setFilterBatchId] = useState("");
//   const [filterTrainerEmail, setFilterTrainerEmail] = useState("");
//   const [filterStudentEmail, setFilterStudentEmail] = useState("");
//   const [reportType, setReportType] = useState("STUDENT"); // STUDENT | SESSION
//   const [history, setHistory] = useState(null);
//   const [historyLoading, setHistoryLoading] = useState(false);
//   const [historyError, setHistoryError] = useState(null);
//   const [downloading, setDownloading] = useState(false);

//   useEffect(() => {
//     const o = new MutationObserver(() => setDark(isDark()));
//     o.observe(document.documentElement, {
//       attributes: true,
//       attributeFilter: ["class"],
//     });
//     o.observe(document.body, { attributes: true, attributeFilter: ["class"] });
//     return () => o.disconnect();
//   }, []);

//   useEffect(() => {
//     setLoading(true);
//     attendanceService
//       .getAdminAttendanceOverview()
//       .then((r) => setOverview(r.data || []))
//       .catch(() => setError("Failed to load attendance overview."))
//       .finally(() => setLoading(false));
//   }, []);

//   const toggleBatch = async (batchId) => {
//     if (expandedBatchId === batchId) {
//       setExpandedBatchId(null);
//       setDetail(null);
//       return;
//     }
//     setExpandedBatchId(batchId);
//     setDetail(null);
//     setDetailLoading(true);
//     try {
//       const r = await attendanceService.getAdminBatchAttendance(batchId);
//       setDetail(r.data);
//     } catch {
//       setDetail({ trainerAttendance: [], studentAttendance: {} });
//     } finally {
//       setDetailLoading(false);
//     }
//   };
//   const buildFilterParams = () => ({
//     filterType,
//     startDate: filterType === "CUSTOM" ? startDate : undefined,
//     endDate: filterType === "CUSTOM" ? endDate : undefined,
//     batchId: filterBatchId || undefined,
//     trainerEmail: filterTrainerEmail || undefined,
//     studentEmail: filterStudentEmail || undefined,
//   });

//   const fetchHistory = async () => {
//     if (filterType === "CUSTOM" && (!startDate || !endDate)) {
//       setHistoryError("Select both start and end date for a custom range.");
//       return;
//     }
//     setHistoryLoading(true);
//     setHistoryError(null);
//     try {
//       const r = await attendanceService.getAdminHistory(buildFilterParams());
//       setHistory(r.data);
//     } catch {
//       setHistoryError("Failed to load attendance history.");
//     } finally {
//       setHistoryLoading(false);
//     }
//   };

//   const handleDownload = async () => {
//     if (filterType === "CUSTOM" && (!startDate || !endDate)) {
//       setHistoryError("Select both start and end date for a custom range.");
//       return;
//     }
//     setDownloading(true);
//     try {
//       const r = await attendanceService.downloadAdminReport({
//         ...buildFilterParams(),
//         type: reportType,
//       });
//       const url = window.URL.createObjectURL(new Blob([r.data]));
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", "admin-attendance-report.xlsx");
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(url);
//     } catch {
//       setHistoryError("Failed to download report.");
//     } finally {
//       setDownloading(false);
//     }
//   };

//   const totalSessions = overview.reduce(
//     (s, b) => s + (b.sessionsMarked || 0),
//     0,
//   );
//   const totalStudents = overview.reduce((s, b) => s + (b.studentCount || 0), 0);

//   const theme = {
//     bg: dark ? "#0a0a0a" : "#f1f5f9",
//     card: dark ? "#111111" : "#ffffff",
//     text: dark ? "#ffffff" : "#0f172a",
//     mu: dark ? "#94a3b8" : "#64748b",
//     bd: dark ? "rgba(255,255,255,0.06)" : "#e2e8f0",
//     rowHover: dark ? "rgba(34,211,238,0.04)" : "rgba(34,211,238,0.025)",
//   };

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background: theme.bg,
//         color: theme.text,
//         fontFamily: "'Poppins',sans-serif",
//         padding: 24,
//         boxSizing: "border-box",
//       }}
//     >
//       <div
//         style={{
//           maxWidth: 1300,
//           margin: "0 auto",
//           display: "flex",
//           flexDirection: "column",
//           gap: 20,
//         }}
//       >
//         {/* HEADER */}
//         <div
//           style={{
//             background: theme.card,
//             border: `1px solid ${theme.bd}`,
//             borderRadius: 20,
//             padding: "28px 32px",
//             boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
//             display: "flex",
//             alignItems: "center",
//             gap: 16,
//           }}
//         >
//           <div
//             style={{
//               width: 52,
//               height: 52,
//               borderRadius: 14,
//               background: "rgba(34,211,238,.10)",
//               border: "1px solid rgba(34,211,238,.18)",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               color: "#22d3ee",
//               flexShrink: 0,
//             }}
//           >
//             <CalendarCheck size={24} />
//           </div>
//           <div>
//             <h1
//               style={{
//                 fontWeight: 700,
//                 fontSize: "clamp(1.3rem,3vw,1.6rem)",
//                 margin: "0 0 2px",
//               }}
//             >
//               Organization{" "}
//               <span
//                 style={{
//                   background: "linear-gradient(135deg,#a78bfa,#22d3ee)",
//                   WebkitBackgroundClip: "text",
//                   WebkitTextFillColor: "transparent",
//                   backgroundClip: "text",
//                 }}
//               >
//                 Attendance
//               </span>
//             </h1>
//             <p style={{ fontSize: 12, color: theme.mu, margin: 0 }}>
//               Trainer and student attendance for batches in your organization.
//             </p>
//           </div>
//         </div>

//         {/* STATS */}
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))",
//             gap: 16,
//           }}
//         >
//           {[
//             {
//               label: "Batches",
//               value: overview.length,
//               icon: <Layers size={18} />,
//               bg: STAT_COLORS.batches,
//             },
//             {
//               label: "Sessions Marked",
//               value: totalSessions,
//               icon: <CalendarCheck size={18} />,
//               bg: STAT_COLORS.sessions,
//             },
//             {
//               label: "Students Tracked",
//               value: totalStudents,
//               icon: <Users size={18} />,
//               bg: STAT_COLORS.students,
//             },
//           ].map((s) => (
//             <div
//               key={s.label}
//               style={{
//                 background: s.bg,
//                 borderRadius: 20,
//                 padding: "20px 22px",
//                 color: "#fff",
//                 position: "relative",
//                 overflow: "hidden",
//                 boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
//               }}
//             >
//               <div
//                 style={{
//                   width: 32,
//                   height: 32,
//                   borderRadius: 10,
//                   background: "rgba(255,255,255,.18)",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   marginBottom: 10,
//                 }}
//               >
//                 {s.icon}
//               </div>
//               <div
//                 style={{
//                   fontSize: 28,
//                   fontWeight: 800,
//                   lineHeight: 1,
//                   marginBottom: 4,
//                 }}
//               >
//                 {s.value}
//               </div>
//               <div
//                 style={{
//                   fontSize: 10,
//                   fontWeight: 700,
//                   textTransform: "uppercase",
//                   letterSpacing: ".12em",
//                   opacity: 0.65,
//                 }}
//               >
//                 {s.label}
//               </div>
//             </div>
//           ))}
//         </div>
//         {/* HISTORY / FILTERS / EXCEL DOWNLOAD (NEW) */}
//         <div
//           style={{
//             background: theme.card,
//             border: `1px solid ${theme.bd}`,
//             borderRadius: 20,
//             boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
//             padding: "20px 22px",
//             display: "flex",
//             flexDirection: "column",
//             gap: 16,
//           }}
//         >
//           <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//             <div
//               style={{
//                 width: 34,
//                 height: 34,
//                 borderRadius: 10,
//                 background: "rgba(167,139,250,.10)",
//                 color: "#a78bfa",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//               }}
//             >
//               <Filter size={15} />
//             </div>
//             <span style={{ fontSize: 13, fontWeight: 700 }}>
//               Attendance History & Reports
//             </span>
//           </div>

//           {/* FILTER ROW */}
//           <div
//             style={{
//               display: "flex",
//               flexWrap: "wrap",
//               gap: 10,
//               alignItems: "center",
//             }}
//           >
//             <select
//               value={filterType}
//               onChange={(e) => setFilterType(e.target.value)}
//               style={selectStyle(theme)}
//             >
//               <option value="TODAY">Today</option>
//               <option value="YESTERDAY">Yesterday</option>
//               <option value="LAST_7_DAYS">Last 7 Days</option>
//               <option value="LAST_14_DAYS">Last 14 Days</option>
//               <option value="LAST_30_DAYS">Last 30 Days</option>
//               <option value="THIS_WEEK">This Week</option>
//               <option value="THIS_MONTH">This Month</option>
//               <option value="CUSTOM">Custom Range</option>
//             </select>

//             {filterType === "CUSTOM" && (
//               <>
//                 <input
//                   type="date"
//                   value={startDate}
//                   onChange={(e) => setStartDate(e.target.value)}
//                   style={inputStyle(theme)}
//                 />
//                 <input
//                   type="date"
//                   value={endDate}
//                   onChange={(e) => setEndDate(e.target.value)}
//                   style={inputStyle(theme)}
//                 />
//               </>
//             )}

//             <input
//               type="text"
//               placeholder="Batch ID"
//               value={filterBatchId}
//               onChange={(e) => setFilterBatchId(e.target.value)}
//               style={{ ...inputStyle(theme), width: 90 }}
//             />
//             <input
//               type="text"
//               placeholder="Trainer email"
//               value={filterTrainerEmail}
//               onChange={(e) => setFilterTrainerEmail(e.target.value)}
//               style={{ ...inputStyle(theme), width: 160 }}
//             />
//             <input
//               type="text"
//               placeholder="Student email"
//               value={filterStudentEmail}
//               onChange={(e) => setFilterStudentEmail(e.target.value)}
//               style={{ ...inputStyle(theme), width: 160 }}
//             />

//             <select
//               value={reportType}
//               onChange={(e) => setReportType(e.target.value)}
//               style={selectStyle(theme)}
//             >
//               <option value="STUDENT">Student Report</option>
//               <option value="SESSION">Trainer Session Report</option>
//             </select>

//             <button onClick={fetchHistory} style={btnStyle("#22d3ee")}>
//               {historyLoading ? "Loading…" : "Search"}
//             </button>
//             <button
//               onClick={handleDownload}
//               disabled={downloading}
//               style={btnStyle("#a78bfa")}
//             >
//               <Download size={13} style={{ marginRight: 5 }} />
//               {downloading ? "Downloading…" : "Download Excel"}
//             </button>
//           </div>

//           {historyError && (
//             <div style={{ color: "#f87171", fontSize: 12 }}>{historyError}</div>
//           )}

//           {/* ANALYTICS SUMMARY */}
//           {history?.analytics && (
//             <div
//               style={{
//                 display: "flex",
//                 flexWrap: "wrap",
//                 gap: 12,
//                 fontSize: 12,
//               }}
//             >
//               <span style={pill(theme)}>
//                 Total: {history.analytics.totalSessions}
//               </span>
//               <span style={pill(theme)}>
//                 Present: {history.analytics.presentCount}
//               </span>
//               <span style={pill(theme)}>
//                 Absent: {history.analytics.absentCount}
//               </span>
//               <span style={pill(theme)}>
//                 Late: {history.analytics.lateCount}
//               </span>
//               <span style={pill(theme)}>
//                 %: {history.analytics.attendancePercentage.toFixed(1)}%
//               </span>
//             </div>
//           )}

//           {/* RECORDS TABLE */}
//           {history?.records && history.records.length > 0 && (
//             <div style={{ overflowX: "auto" }}>
//               <table
//                 style={{
//                   width: "100%",
//                   borderCollapse: "collapse",
//                   fontSize: 12,
//                 }}
//               >
//                 <thead>
//                   <tr style={{ textAlign: "left", color: theme.mu }}>
//                     <th style={thStyle}>Batch</th>
//                     <th style={thStyle}>Student</th>
//                     <th style={thStyle}>Trainer</th>
//                     <th style={thStyle}>Date</th>
//                     <th style={thStyle}>Status</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {history.records.map((r, i) => (
//                     <tr key={i} style={{ borderTop: `1px solid ${theme.bd}` }}>
//                       <td style={tdStyle}>{r.batchId}</td>
//                       <td style={tdStyle}>{r.studentEmail}</td>
//                       <td style={tdStyle}>{r.trainerEmail}</td>
//                       <td style={tdStyle}>{r.attendanceDate}</td>
//                       <td style={tdStyle}>
//                         <StatusDot status={r.status} />
//                         {r.status}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//         {/* BATCH LIST */}
//         <div
//           style={{
//             background: theme.card,
//             border: `1px solid ${theme.bd}`,
//             borderRadius: 20,
//             boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
//             overflow: "hidden",
//           }}
//         >
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: 10,
//               padding: "16px 22px",
//               borderBottom: `1px solid ${theme.bd}`,
//             }}
//           >
//             <div
//               style={{
//                 width: 34,
//                 height: 34,
//                 borderRadius: 10,
//                 background: "rgba(34,211,238,.10)",
//                 color: "#22d3ee",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//               }}
//             >
//               <Layers size={15} />
//             </div>
//             <span style={{ fontSize: 13, fontWeight: 700 }}>Batches</span>
//             <span style={{ fontSize: 11, color: theme.mu }}>
//               ({overview.length})
//             </span>
//           </div>

//           {loading ? (
//             <div
//               style={{
//                 padding: "40px 20px",
//                 textAlign: "center",
//                 color: theme.mu,
//                 fontSize: 13,
//               }}
//             >
//               Loading…
//             </div>
//           ) : error ? (
//             <div
//               style={{
//                 padding: "40px 20px",
//                 textAlign: "center",
//                 color: "#f87171",
//                 fontSize: 13,
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems: "center",
//                 gap: 8,
//               }}
//             >
//               <AlertCircle size={20} />
//               {error}
//             </div>
//           ) : overview.length === 0 ? (
//             <div
//               style={{
//                 padding: "60px 20px",
//                 textAlign: "center",
//                 color: theme.mu,
//                 fontSize: 13,
//               }}
//             >
//               No batches found for your organization.
//             </div>
//           ) : (
//             overview.map((b) => {
//               const isOpen = expandedBatchId === b.batchId;
//               return (
//                 <div
//                   key={b.batchId}
//                   style={{ borderBottom: `1px solid ${theme.bd}` }}
//                 >
//                   <div
//                     onClick={() => toggleBatch(b.batchId)}
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: 12,
//                       padding: "14px 22px",
//                       cursor: "pointer",
//                       transition: "background .15s",
//                     }}
//                     onMouseEnter={(e) =>
//                       (e.currentTarget.style.background = theme.rowHover)
//                     }
//                     onMouseLeave={(e) =>
//                       (e.currentTarget.style.background = "transparent")
//                     }
//                   >
//                     {isOpen ? (
//                       <ChevronDown size={15} color={theme.mu} />
//                     ) : (
//                       <ChevronRight size={15} color={theme.mu} />
//                     )}
//                     <div
//                       style={{
//                         width: 34,
//                         height: 34,
//                         borderRadius: 9,
//                         background: "rgba(167,139,250,.10)",
//                         color: "#a78bfa",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         flexShrink: 0,
//                       }}
//                     >
//                       <Layers size={15} />
//                     </div>
//                     <div style={{ flex: 1, minWidth: 0 }}>
//                       <p style={{ fontSize: 13, fontWeight: 700, margin: 0 }}>
//                         Batch #{b.batchId}
//                       </p>
//                       <p
//                         style={{
//                           fontSize: 11,
//                           color: theme.mu,
//                           margin: "2px 0 0",
//                         }}
//                       >
//                         {b.trainerEmail || "Unassigned"}
//                       </p>
//                     </div>
//                     <span
//                       style={{ fontSize: 11, color: theme.mu, flexShrink: 0 }}
//                     >
//                       {b.studentCount} students
//                     </span>
//                     <span
//                       style={{ fontSize: 11, color: theme.mu, flexShrink: 0 }}
//                     >
//                       {b.sessionsMarked} sessions
//                     </span>
//                   </div>

//                   {isOpen && (
//                     <div
//                       style={{
//                         padding: "0 22px 20px",
//                         display: "flex",
//                         flexDirection: "column",
//                         gap: 16,
//                       }}
//                     >
//                       {detailLoading ? (
//                         <div
//                           style={{
//                             padding: "20px 0",
//                             textAlign: "center",
//                             color: theme.mu,
//                             fontSize: 12,
//                           }}
//                         >
//                           Loading detail…
//                         </div>
//                       ) : (
//                         <>
//                           {/* TRAINER SESSION ATTENDANCE */}
//                           <div
//                             style={{
//                               background: dark
//                                 ? "rgba(255,255,255,0.02)"
//                                 : "#f8fafc",
//                               border: `1px solid ${theme.bd}`,
//                               borderRadius: 14,
//                               padding: 16,
//                             }}
//                           >
//                             <div
//                               style={{
//                                 display: "flex",
//                                 alignItems: "center",
//                                 gap: 8,
//                                 marginBottom: 10,
//                               }}
//                             >
//                               <UserCheck size={14} color="#22d3ee" />
//                               <span style={{ fontSize: 12, fontWeight: 700 }}>
//                                 Trainer Session Attendance
//                               </span>
//                             </div>
//                             {(detail?.trainerAttendance || []).length === 0 ? (
//                               <p
//                                 style={{
//                                   fontSize: 12,
//                                   color: theme.mu,
//                                   margin: 0,
//                                 }}
//                               >
//                                 No sessions marked yet.
//                               </p>
//                             ) : (
//                               <div
//                                 style={{
//                                   display: "flex",
//                                   flexDirection: "column",
//                                   gap: 6,
//                                 }}
//                               >
//                                 {detail.trainerAttendance.map((row) => (
//                                   <div
//                                     key={row.id}
//                                     style={{
//                                       display: "flex",
//                                       alignItems: "center",
//                                       fontSize: 12,
//                                     }}
//                                   >
//                                     <StatusDot status={row.status} />
//                                     <span
//                                       style={{
//                                         color: theme.text,
//                                         fontWeight: 600,
//                                         marginRight: 8,
//                                       }}
//                                     >
//                                       {row.sessionDate}
//                                     </span>
//                                     <span style={{ color: theme.mu }}>
//                                       {row.status}
//                                     </span>
//                                   </div>
//                                 ))}
//                               </div>
//                             )}
//                           </div>

//                           {/* STUDENT ATTENDANCE */}
//                           <div
//                             style={{
//                               background: dark
//                                 ? "rgba(255,255,255,0.02)"
//                                 : "#f8fafc",
//                               border: `1px solid ${theme.bd}`,
//                               borderRadius: 14,
//                               padding: 16,
//                             }}
//                           >
//                             <div
//                               style={{
//                                 display: "flex",
//                                 alignItems: "center",
//                                 gap: 8,
//                                 marginBottom: 10,
//                               }}
//                             >
//                               <Users size={14} color="#a78bfa" />
//                               <span style={{ fontSize: 12, fontWeight: 700 }}>
//                                 Student Attendance
//                               </span>
//                             </div>
//                             {Object.keys(detail?.studentAttendance || {})
//                               .length === 0 ? (
//                               <p
//                                 style={{
//                                   fontSize: 12,
//                                   color: theme.mu,
//                                   margin: 0,
//                                 }}
//                               >
//                                 No student attendance recorded yet.
//                               </p>
//                             ) : (
//                               <div
//                                 style={{
//                                   display: "flex",
//                                   flexDirection: "column",
//                                   gap: 12,
//                                 }}
//                               >
//                                 {Object.entries(detail.studentAttendance).map(
//                                   ([email, rows]) => (
//                                     <div key={email}>
//                                       <p
//                                         style={{
//                                           fontSize: 12,
//                                           fontWeight: 600,
//                                           margin: "0 0 4px",
//                                         }}
//                                       >
//                                         {email}
//                                       </p>
//                                       <div
//                                         style={{
//                                           display: "flex",
//                                           flexWrap: "wrap",
//                                           gap: 6,
//                                         }}
//                                       >
//                                         {rows.map((r, i) => (
//                                           <span
//                                             key={i}
//                                             style={{
//                                               fontSize: 11,
//                                               padding: "3px 9px",
//                                               borderRadius: 8,
//                                               background: dark
//                                                 ? "rgba(255,255,255,0.04)"
//                                                 : "#ffffff",
//                                               border: `1px solid ${theme.bd}`,
//                                               color: theme.mu,
//                                             }}
//                                           >
//                                             <StatusDot status={r.status} />
//                                             {r.attendanceDate}
//                                           </span>
//                                         ))}
//                                       </div>
//                                     </div>
//                                   ),
//                                 )}
//                               </div>
//                             )}
//                           </div>
//                         </>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               );
//             })
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
























































import { useEffect, useState } from "react";
import attendanceService from "../services/attendanceService";
import {
  Users,
  Layers,
  ChevronDown,
  ChevronRight,
  CalendarCheck,
  UserCheck,
  AlertCircle,
  Download,
  Filter,
} from "lucide-react";

// ─── Global Design System — single source of truth for colors, type,
// spacing, radius, StatCard, PageContainer and Hero. This page must not
// redeclare tokens or components that already live there (see
// AdminDashboard.jsx, the Golden Reference, which this page now visually
// matches).
import {
  T,
  FONT_FAMILY,
  FONT_WEIGHT,
  FONT_SIZE,
  LINE_HEIGHT,
  LETTER_SPACING,
  RADIUS,
  CARD_PADDING,
  ACCENT_PURPLE,
  PageContainer,
  Hero,
  StatCard,
} from "@/design-system";

/* ─────────────────────────────────────────────────────────────────────────
   Page-local layout helpers only — no color/spacing/radius values are
   invented here, everything is sourced from the theme token object (t)
   or the shared FONT_FAMILY / FONT_WEIGHT / RADIUS / CARD_PADDING tokens,
   exactly the same way AdminDashboard.jsx's SectionCard / SectionHeader /
   IconBadge are page-local but token-driven.
───────────────────────────────────────────────────────────────────────── */

const isDark = () =>
  document.documentElement.classList.contains("dark") ||
  document.body.classList.contains("dark") ||
  window.matchMedia("(prefers-color-scheme: dark)").matches;

function IconBadge({ icon: Icon, color, size = 34, iconSize = 15 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: RADIUS.chip,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `${color}18`,
        border: `1px solid ${color}30`,
        flexShrink: 0,
      }}
    >
      <Icon size={iconSize} color={color} />
    </div>
  );
}

function SectionCard({ t, children, style }) {
  return (
    <div
      style={{
        background: t.cardBg,
        border: `1px solid ${t.border}`,
        borderRadius: RADIUS.standardCard,
        padding: CARD_PADDING.standardCard,
        boxShadow: t.shadow,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function SectionHeader({ t, icon: Icon, color, title, sub, right }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
        flexWrap: "wrap",
        gap: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <IconBadge icon={Icon} color={color} />
        <div>
          <div
            style={{
              fontFamily: FONT_FAMILY,
              fontWeight: FONT_WEIGHT.bold,
              fontSize: 13,
              color: t.text,
            }}
          >
            {title}
          </div>
          {sub && (
            <div
              style={{
                fontSize: 11,
                color: t.textMuted,
                fontFamily: FONT_FAMILY,
                marginTop: 2,
              }}
            >
              {sub}
            </div>
          )}
        </div>
      </div>
      {right}
    </div>
  );
}

function EmptyBlock({ t, icon: Icon, title }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        gap: 12,
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 14,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: `1.5px dashed ${t.emptyBorder}`,
          background: t.emptyBg,
        }}
      >
        <Icon size={20} color={t.emptyIcon} />
      </div>
      <p
        style={{
          fontSize: 13,
          color: t.textMuted,
          fontWeight: FONT_WEIGHT.bold,
          fontFamily: FONT_FAMILY,
          margin: 0,
        }}
      >
        {title}
      </p>
    </div>
  );
}

function StatusDot({ status }) {
  const c =
    status === "PRESENT"
      ? "#10b981"
      : status === "ABSENT"
        ? "#f43f5e"
        : "#f59e0b";
  return (
    <span
      style={{
        display: "inline-block",
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: c,
        marginRight: 6,
        flexShrink: 0,
      }}
    />
  );
}

const selectStyle = (t) => ({
  padding: "8px 12px",
  borderRadius: RADIUS.chip,
  border: `1px solid ${t.border}`,
  background: t.pillBg,
  color: t.text,
  fontSize: 12,
  fontFamily: FONT_FAMILY,
  outline: "none",
});

const inputStyle = (t) => ({
  padding: "8px 12px",
  borderRadius: RADIUS.chip,
  border: `1px solid ${t.border}`,
  background: t.pillBg,
  color: t.text,
  fontSize: 12,
  fontFamily: FONT_FAMILY,
  outline: "none",
});

const btnStyle = (bg, color = "#fff") => ({
  padding: "9px 16px",
  borderRadius: RADIUS.button,
  border: "none",
  background: bg,
  color,
  fontSize: 12,
  fontWeight: FONT_WEIGHT.bold,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  fontFamily: FONT_FAMILY,
});

const pillStyle = (t) => ({
  padding: "5px 12px",
  borderRadius: RADIUS.pill,
  background: t.pillBg,
  border: `1px solid ${t.pillBorder}`,
  color: t.text,
  fontFamily: FONT_FAMILY,
});

const thStyle = (t) => ({
  padding: "8px 12px",
  fontWeight: FONT_WEIGHT.bold,
  fontFamily: FONT_FAMILY,
  color: t.textMuted,
  fontSize: 11,
  textTransform: "uppercase",
  letterSpacing: LETTER_SPACING.eyebrow,
});
const tdStyle = { padding: "8px 12px", fontFamily: FONT_FAMILY };

export default function AdminAttendance() {
  const [dark, setDark] = useState(isDark);
  const [overview, setOverview] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedBatchId, setExpandedBatchId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // ---- History / Filters / Excel (NEW) ----
  const [filterType, setFilterType] = useState("THIS_MONTH");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterBatchId, setFilterBatchId] = useState("");
  const [filterTrainerEmail, setFilterTrainerEmail] = useState("");
  const [filterStudentEmail, setFilterStudentEmail] = useState("");
  const [reportType, setReportType] = useState("STUDENT"); // STUDENT | SESSION
  const [history, setHistory] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const o = new MutationObserver(() => setDark(isDark()));
    o.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    o.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => o.disconnect();
  }, []);

  useEffect(() => {
    setLoading(true);
    attendanceService
      .getAdminAttendanceOverview()
      .then((r) => setOverview(r.data || []))
      .catch(() => setError("Failed to load attendance overview."))
      .finally(() => setLoading(false));
  }, []);

  const toggleBatch = async (batchId) => {
    if (expandedBatchId === batchId) {
      setExpandedBatchId(null);
      setDetail(null);
      return;
    }
    setExpandedBatchId(batchId);
    setDetail(null);
    setDetailLoading(true);
    try {
      const r = await attendanceService.getAdminBatchAttendance(batchId);
      setDetail(r.data);
    } catch {
      setDetail({ trainerAttendance: [], studentAttendance: {} });
    } finally {
      setDetailLoading(false);
    }
  };
  const buildFilterParams = () => ({
    filterType,
    startDate: filterType === "CUSTOM" ? startDate : undefined,
    endDate: filterType === "CUSTOM" ? endDate : undefined,
    batchId: filterBatchId || undefined,
    trainerEmail: filterTrainerEmail || undefined,
    studentEmail: filterStudentEmail || undefined,
  });

  const fetchHistory = async () => {
    if (filterType === "CUSTOM" && (!startDate || !endDate)) {
      setHistoryError("Select both start and end date for a custom range.");
      return;
    }
    setHistoryLoading(true);
    setHistoryError(null);
    try {
      const r = await attendanceService.getAdminHistory(buildFilterParams());
      setHistory(r.data);
    } catch {
      setHistoryError("Failed to load attendance history.");
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleDownload = async () => {
    if (filterType === "CUSTOM" && (!startDate || !endDate)) {
      setHistoryError("Select both start and end date for a custom range.");
      return;
    }
    setDownloading(true);
    try {
      const r = await attendanceService.downloadAdminReport({
        ...buildFilterParams(),
        type: reportType,
      });
      const url = window.URL.createObjectURL(new Blob([r.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "admin-attendance-report.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      setHistoryError("Failed to download report.");
    } finally {
      setDownloading(false);
    }
  };

  const totalSessions = overview.reduce(
    (s, b) => s + (b.sessionsMarked || 0),
    0,
  );
  const totalStudents = overview.reduce((s, b) => s + (b.studentCount || 0), 0);

  const t = dark ? T.dark : T.light;

  // ── stat cards — rendered through the shared design-system <StatCard>,
  // colorKey drawn from the same blue/green/amber/red/purple set the
  // Admin Dashboard uses, so this page inherits identical stat-card
  // visuals instead of the page's old bespoke gradient tiles.
  const stats = [
    { label: "Batches", numericValue: overview.length, icon: Layers, colorKey: "blue", change: "Tracked in your organization" },
    { label: "Sessions Marked", numericValue: totalSessions, icon: CalendarCheck, colorKey: "purple", change: "Attendance sessions logged" },
    { label: "Students Tracked", numericValue: totalStudents, icon: Users, colorKey: "green", change: "Across all active batches" },
  ];

  return (
    <PageContainer mode={dark ? "dark" : "light"} pageBg={t.pageBg} textColor={t.text}>
      <style>{`
        @media (max-width:560px){
          .attendance-hero-badges{width:100%;}
          .attendance-filter-row > *{width:100% !important;}
        }
        @media (max-width:820px){
          .attendance-batch-row{flex-wrap:wrap;}
        }
      `}</style>

      {/* ═══ HERO — shared <Hero> component, matches Admin Dashboard exactly ═══ */}
      <Hero borderHero={t.borderHero}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: ACCENT_PURPLE.base }} />
            <span
              style={{
                fontSize: FONT_SIZE.eyebrow,
                fontWeight: FONT_WEIGHT.bold,
                letterSpacing: LETTER_SPACING.eyebrowWide,
                textTransform: "uppercase",
                color: t.textSub,
                fontFamily: FONT_FAMILY,
              }}
            >
              Attendance Overview
            </span>
          </div>
          <h1
            style={{
              fontFamily: FONT_FAMILY,
              fontWeight: FONT_WEIGHT.heroTitle,
              fontSize: FONT_SIZE.heroTitle,
              color: ACCENT_PURPLE.base,
              margin: "0 0 6px",
              lineHeight: LINE_HEIGHT.heroTitle,
              letterSpacing: LETTER_SPACING.heroTitle,
            }}
          >
            Organization Attendance
          </h1>
          <p style={{ fontSize: FONT_SIZE.bodySmall, color: t.textSub, margin: 0, fontWeight: FONT_WEIGHT.medium, fontFamily: FONT_FAMILY }}>
            Trainer and student attendance for batches in your organization
          </p>
        </div>

        <div className="hero-badges attendance-hero-badges">
          {!loading && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                background: t.actBg,
                border: `1px solid ${t.actBorder}`,
                borderRadius: RADIUS.chip,
                padding: "8px 16px",
                fontSize: 11,
                fontWeight: FONT_WEIGHT.semibold,
                fontFamily: FONT_FAMILY,
                color: t.textSub,
                flexWrap: "wrap",
              }}
            >
              <span>{overview.length} batches</span>
              <span style={{ width: 1, height: 14, background: t.actBorder }} />
              <span>{totalSessions} sessions</span>
              <span style={{ width: 1, height: 14, background: t.actBorder }} />
              <span>{totalStudents} students</span>
            </div>
          )}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              background: "rgba(124,58,237,0.08)",
              border: "1px solid rgba(124,58,237,0.3)",
              borderRadius: RADIUS.pill,
              padding: "8px 18px",
              color: ACCENT_PURPLE.base,
              fontSize: 11,
              fontWeight: FONT_WEIGHT.bold,
              letterSpacing: LETTER_SPACING.eyebrowWide,
              fontFamily: FONT_FAMILY,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: ACCENT_PURPLE.base, display: "inline-block" }} />
            LIVE
          </div>
        </div>
      </Hero>

      {/* ═══ 3 STAT CARDS — shared <StatCard>, via the shared .stat-grid class ═══ */}
      <div className="stat-grid" style={{ marginBottom: 20 }}>
        {stats.map((s, i) => (
          <StatCard key={i} stat={s} index={i} loading={loading} mode={dark ? "dark" : "light"} />
        ))}
      </div>

      {/* ═══ HISTORY / FILTERS / EXCEL DOWNLOAD ═══ */}
      <SectionCard t={t} style={{ marginBottom: 20 }}>
        <SectionHeader
          t={t}
          icon={Filter}
          color={ACCENT_PURPLE.base}
          title="Attendance History & Reports"
          right={<span style={pillStyle(t)}>{reportType === "STUDENT" ? "Student report" : "Session report"}</span>}
        />

        {/* FILTER ROW */}
        <div className="attendance-filter-row" style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} style={selectStyle(t)}>
            <option value="TODAY">Today</option>
            <option value="YESTERDAY">Yesterday</option>
            <option value="LAST_7_DAYS">Last 7 Days</option>
            <option value="LAST_14_DAYS">Last 14 Days</option>
            <option value="LAST_30_DAYS">Last 30 Days</option>
            <option value="THIS_WEEK">This Week</option>
            <option value="THIS_MONTH">This Month</option>
            <option value="CUSTOM">Custom Range</option>
          </select>

          {filterType === "CUSTOM" && (
            <>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={inputStyle(t)} />
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={inputStyle(t)} />
            </>
          )}

          <input
            type="text"
            placeholder="Batch ID"
            value={filterBatchId}
            onChange={(e) => setFilterBatchId(e.target.value)}
            style={{ ...inputStyle(t), width: 100 }}
          />
          <input
            type="text"
            placeholder="Trainer email"
            value={filterTrainerEmail}
            onChange={(e) => setFilterTrainerEmail(e.target.value)}
            style={{ ...inputStyle(t), width: 170 }}
          />
          <input
            type="text"
            placeholder="Student email"
            value={filterStudentEmail}
            onChange={(e) => setFilterStudentEmail(e.target.value)}
            style={{ ...inputStyle(t), width: 170 }}
          />

          <select value={reportType} onChange={(e) => setReportType(e.target.value)} style={selectStyle(t)}>
            <option value="STUDENT">Student Report</option>
            <option value="SESSION">Trainer Session Report</option>
          </select>

          <button onClick={fetchHistory} style={btnStyle("#22d3ee")}>
            {historyLoading ? "Loading…" : "Search"}
          </button>
          <button onClick={handleDownload} disabled={downloading} style={btnStyle(ACCENT_PURPLE.base)}>
            <Download size={13} style={{ marginRight: 5 }} />
            {downloading ? "Downloading…" : "Download Excel"}
          </button>
        </div>

        {historyError && (
          <div style={{ color: t.overdueText, fontSize: 12, fontFamily: FONT_FAMILY, marginTop: 14 }}>{historyError}</div>
        )}

        {/* ANALYTICS SUMMARY */}
        {history?.analytics && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, fontSize: 12, marginTop: 16 }}>
            <span style={pillStyle(t)}>Total: {history.analytics.totalSessions}</span>
            <span style={pillStyle(t)}>Present: {history.analytics.presentCount}</span>
            <span style={pillStyle(t)}>Absent: {history.analytics.absentCount}</span>
            <span style={pillStyle(t)}>Late: {history.analytics.lateCount}</span>
            <span style={pillStyle(t)}>%: {history.analytics.attendancePercentage.toFixed(1)}%</span>
          </div>
        )}

        {/* RECORDS TABLE */}
        {history?.records && history.records.length > 0 && (
          <div style={{ overflowX: "auto", marginTop: 16 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, minWidth: 560 }}>
              <thead>
                <tr style={{ textAlign: "left" }}>
                  <th style={thStyle(t)}>Batch</th>
                  <th style={thStyle(t)}>Student</th>
                  <th style={thStyle(t)}>Trainer</th>
                  <th style={thStyle(t)}>Date</th>
                  <th style={thStyle(t)}>Status</th>
                </tr>
              </thead>
              <tbody>
                {history.records.map((r, i) => (
                  <tr key={i} style={{ borderTop: `1px solid ${t.border}` }}>
                    <td style={{ ...tdStyle, color: t.text }}>{r.batchId}</td>
                    <td style={{ ...tdStyle, color: t.text }}>{r.studentEmail}</td>
                    <td style={{ ...tdStyle, color: t.text }}>{r.trainerEmail}</td>
                    <td style={{ ...tdStyle, color: t.text }}>{r.attendanceDate}</td>
                    <td style={{ ...tdStyle, color: t.text, display: "flex", alignItems: "center" }}>
                      <StatusDot status={r.status} />
                      {r.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      {/* ═══ BATCH LIST ═══ */}
      <SectionCard t={t} style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: CARD_PADDING.standardCard, paddingBottom: 16 }}>
          <SectionHeader t={t} icon={Layers} color="#22d3ee" title="Batches" sub={`${overview.length} total`} />
        </div>

        {loading ? (
          <div style={{ padding: "40px 20px", textAlign: "center", color: t.textMuted, fontSize: 13, fontFamily: FONT_FAMILY }}>
            Loading…
          </div>
        ) : error ? (
          <div
            style={{
              padding: "40px 20px",
              textAlign: "center",
              color: t.overdueText,
              fontSize: 13,
              fontFamily: FONT_FAMILY,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <AlertCircle size={20} />
            {error}
          </div>
        ) : overview.length === 0 ? (
          <EmptyBlock t={t} icon={Layers} title="No batches found for your organization" />
        ) : (
          overview.map((b) => {
            const isOpen = expandedBatchId === b.batchId;
            return (
              <div key={b.batchId} style={{ borderTop: `1px solid ${t.border}` }}>
                <div
                  className="attendance-batch-row"
                  onClick={() => toggleBatch(b.batchId)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "14px 22px",
                    cursor: "pointer",
                    transition: "background .15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = t.recentItemBgHov)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  {isOpen ? (
                    <ChevronDown size={15} color={t.textMuted} />
                  ) : (
                    <ChevronRight size={15} color={t.textMuted} />
                  )}
                  <IconBadge icon={Layers} color="#a78bfa" size={34} iconSize={15} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: FONT_WEIGHT.bold, margin: 0, color: t.text, fontFamily: FONT_FAMILY }}>
                      Batch #{b.batchId}
                    </p>
                    <p style={{ fontSize: 11, color: t.textMuted, margin: "2px 0 0", fontFamily: FONT_FAMILY }}>
                      {b.trainerEmail || "Unassigned"}
                    </p>
                  </div>
                  <span style={{ fontSize: 11, color: t.textMuted, flexShrink: 0, fontFamily: FONT_FAMILY }}>
                    {b.studentCount} students
                  </span>
                  <span style={{ fontSize: 11, color: t.textMuted, flexShrink: 0, fontFamily: FONT_FAMILY }}>
                    {b.sessionsMarked} sessions
                  </span>
                </div>

                {isOpen && (
                  <div style={{ padding: "0 22px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
                    {detailLoading ? (
                      <div style={{ padding: "20px 0", textAlign: "center", color: t.textMuted, fontSize: 12, fontFamily: FONT_FAMILY }}>
                        Loading detail…
                      </div>
                    ) : (
                      <>
                        {/* TRAINER SESSION ATTENDANCE */}
                        <div style={{ background: t.recentItemBg, border: `1px solid ${t.recentItemBorder}`, borderRadius: RADIUS.chip, padding: 16 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                            <UserCheck size={14} color="#22d3ee" />
                            <span style={{ fontSize: 12, fontWeight: FONT_WEIGHT.bold, color: t.text, fontFamily: FONT_FAMILY }}>
                              Trainer Session Attendance
                            </span>
                          </div>
                          {(detail?.trainerAttendance || []).length === 0 ? (
                            <p style={{ fontSize: 12, color: t.textMuted, margin: 0, fontFamily: FONT_FAMILY }}>No sessions marked yet.</p>
                          ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                              {detail.trainerAttendance.map((row) => (
                                <div key={row.id} style={{ display: "flex", alignItems: "center", fontSize: 12, fontFamily: FONT_FAMILY }}>
                                  <StatusDot status={row.status} />
                                  <span style={{ color: t.text, fontWeight: FONT_WEIGHT.semibold, marginRight: 8 }}>{row.sessionDate}</span>
                                  <span style={{ color: t.textMuted }}>{row.status}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* STUDENT ATTENDANCE */}
                        <div style={{ background: t.recentItemBg, border: `1px solid ${t.recentItemBorder}`, borderRadius: RADIUS.chip, padding: 16 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                            <Users size={14} color="#a78bfa" />
                            <span style={{ fontSize: 12, fontWeight: FONT_WEIGHT.bold, color: t.text, fontFamily: FONT_FAMILY }}>
                              Student Attendance
                            </span>
                          </div>
                          {Object.keys(detail?.studentAttendance || {}).length === 0 ? (
                            <p style={{ fontSize: 12, color: t.textMuted, margin: 0, fontFamily: FONT_FAMILY }}>
                              No student attendance recorded yet.
                            </p>
                          ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                              {Object.entries(detail.studentAttendance).map(([email, rows]) => (
                                <div key={email}>
                                  <p style={{ fontSize: 12, fontWeight: FONT_WEIGHT.semibold, margin: "0 0 4px", color: t.text, fontFamily: FONT_FAMILY }}>
                                    {email}
                                  </p>
                                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                    {rows.map((r, i) => (
                                      <span
                                        key={i}
                                        style={{
                                          fontSize: 11,
                                          padding: "3px 9px",
                                          borderRadius: RADIUS.pill,
                                          background: t.cardBg,
                                          border: `1px solid ${t.border}`,
                                          color: t.textMuted,
                                          fontFamily: FONT_FAMILY,
                                          display: "inline-flex",
                                          alignItems: "center",
                                        }}
                                      >
                                        <StatusDot status={r.status} />
                                        {r.attendanceDate}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </SectionCard>
    </PageContainer>
  );
}