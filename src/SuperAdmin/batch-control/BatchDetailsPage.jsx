// // pages/BatchDetailsPage.jsx
// // Route: /superadmin/batches/:batchId
// import React, { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useSaas } from "../context/SaasContext";
// import { useTheme } from "../context/ThemeContext";
// import { STATUS_CONFIG } from "../constants/permissions";
// import BreadcrumbNavigation from "../components/BreadcrumbNavigation";

// // ─────────────────────────────────────────────
// // HELPERS
// // ─────────────────────────────────────────────
// function initials(name = "") {
//   return name.split(" ").map((w) => w[0] || "").join("").slice(0, 2).toUpperCase();
// }
// function formatDate(dateStr) {
//   if (!dateStr) return "—";
//   try { return new Date(dateStr).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }); }
//   catch { return dateStr; }
// }
// const AVATAR_COLORS = [
//   ["#6366f1","#818cf8"],["#8b5cf6","#a78bfa"],["#ec4899","#f472b6"],
//   ["#14b8a6","#2dd4bf"],["#f59e0b","#fbbf24"],["#10b981","#34d399"],
//   ["#3b82f6","#60a5fa"],["#ef4444","#f87171"],
// ];
// const avatarColor = (name = "") => AVATAR_COLORS[(name.charCodeAt(0) || 0) % AVATAR_COLORS.length];

// const Badge = ({ cfg }) => {
//   const c = cfg || STATUS_CONFIG.inactive;
//   return (
//     <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 999, background: c.bg, color: c.color }}>
//       <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.dot, flexShrink: 0 }} />
//       {c.label}
//     </span>
//   );
// };

// const StatMini = ({ value, label, color, dark }) => (
//   <div style={{ textAlign: "center", padding: "14px 18px", borderRadius: 10, background: dark ? "rgba(255,255,255,0.04)" : "#f8fafc", flex: 1, minWidth: 0 }}>
//     <div style={{ fontSize: 26, fontWeight: 800, color: color || (dark ? "#f1f5f9" : "#0f172a"), lineHeight: 1 }}>{value}</div>
//     <div style={{ fontSize: 11, color: dark ? "#64748b" : "#94a3b8", marginTop: 3 }}>{label}</div>
//   </div>
// );

// const TabBtn = ({ label, active, count, onClick, dark }) => (
//   <button onClick={onClick} style={{
//     padding: "7px 14px", borderRadius: 7, fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer",
//     background: active ? "#3b82f6" : (dark ? "rgba(255,255,255,0.05)" : "#f1f5f9"),
//     color: active ? "#fff" : (dark ? "#94a3b8" : "#64748b"), transition: "all 0.15s",
//     display: "flex", alignItems: "center", gap: 6,
//   }}>
//     {label}
//     {count !== undefined && (
//       <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 99, background: active ? "rgba(255,255,255,0.25)" : (dark ? "rgba(255,255,255,0.10)" : "#e5e7eb") }}>
//         {count}
//       </span>
//     )}
//   </button>
// );

// // ─────────────────────────────────────────────
// // MAIN PAGE
// // ─────────────────────────────────────────────
// const BatchDetailsPage = () => {
//   const { batchId } = useParams();
//   const navigate    = useNavigate();
//   const { dark }    = useTheme();

//   const {
//     organizations,
//     trainers:  allTrainers,
//     batches:   allBatches,
//     students:  allStudents,
//     getBatchDetails,
//   } = useSaas();

//   const [activeTab, setActiveTab] = useState("students");

//   // Resolve
//   const batch   = allBatches.find((b) => b.id === batchId);
//   const trainer = batch ? allTrainers.find((t) => t.id === batch.trainerId) : null;
//   const org     = batch ? organizations.find((o) => o.id === batch.organizationId) : null;

//   // Relational filtering — only students in this batch
//   const batchStudents = allStudents.filter((s) => s.batchId === batchId);

//   // tokens
//   const cardBg  = dark ? "rgba(255,255,255,0.03)" : "#ffffff";
//   const cardBdr = dark ? "rgba(255,255,255,0.08)" : "#e5e7eb";
//   const thBg    = dark ? "rgba(255,255,255,0.04)" : "#f8fafc";
//   const thColor = dark ? "#64748b" : "#94a3b8";
//   const txtMain = dark ? "#f1f5f9" : "#0f172a";
//   const txtSub  = dark ? "#64748b" : "#94a3b8";
//   const divClr  = dark ? "rgba(255,255,255,0.06)" : "#f1f5f9";

//   if (!batch) {
//     return (
//       <div style={{ padding: 40, textAlign: "center", color: txtSub }}>
//         <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
//         <div style={{ fontSize: 16, fontWeight: 700, color: txtMain }}>Batch Not Found</div>
//         <button onClick={() => navigate(-1)} style={{ marginTop: 20, padding: "10px 20px", borderRadius: 8, background: "#3b82f6", color: "#fff", border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>
//           Go Back
//         </button>
//       </div>
//     );
//   }

//   const statusCfg = STATUS_CONFIG[batch.status] || STATUS_CONFIG.inactive;
//   const avgProg   = batchStudents.length
//     ? Math.round(batchStudents.reduce((acc, s) => acc + (s.progress || 0), 0) / batchStudents.length)
//     : 0;
//   const progColor = avgProg >= 75 ? "#10b981" : avgProg >= 40 ? "#f59e0b" : "#ef4444";

//   // Build breadcrumb
//   const breadcrumbItems = org && trainer
//     ? [
//         { label: "Organizations", href: "/superadmin/organizations" },
//         { label: org.name, href: `/superadmin/organizations/${org.id}` },
//         { label: trainer.name, href: `/superadmin/trainers/${trainer.id}` },
//         { label: batch.name },
//       ]
//     : org
//     ? [
//         { label: "Organizations", href: "/superadmin/organizations" },
//         { label: org.name, href: `/superadmin/organizations/${org.id}` },
//         { label: batch.name },
//       ]
//     : [{ label: batch.name }];

//   const tabs = [
//     { key: "info",      label: "Batch Info" },
//     { key: "trainer",   label: "Trainer Info" },
//     { key: "students",  label: "Students",    count: batchStudents.length },
//     { key: "attendance", label: "Attendance" },
//     { key: "progress",  label: "Course Progress" },
//   ];

//   return (
//     <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
//       {/* Breadcrumb */}
//       <BreadcrumbNavigation items={breadcrumbItems} />

//       {/* Batch Header */}
//       <div style={{ background: `linear-gradient(135deg, #1d4ed8, #3b82f6)`, borderRadius: 14, padding: "24px 28px" }}>
//         <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
//           <div>
//             <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
//               <h1 style={{ fontSize: 22, fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "-0.02em" }}>{batch.name}</h1>
//               <span style={{ fontSize: 11, padding: "3px 9px", borderRadius: 99, background: "rgba(255,255,255,0.20)", color: "#fff", fontWeight: 600 }}>
//                 {statusCfg.label}
//               </span>
//             </div>
//             <div style={{ display: "flex", gap: 20, marginTop: 8, flexWrap: "wrap" }}>
//               {batch.course && <span style={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>📚 {batch.course}</span>}
//               {org && <span style={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>🏢 {org.name}</span>}
//               {trainer && <span style={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>👨‍🏫 {trainer.name}</span>}
//             </div>
//             <div style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", marginTop: 4 }}>
//               Created {formatDate(batch.createdAt)}
//               {batch.startDate && ` · Started ${formatDate(batch.startDate)}`}
//               {batch.endDate && ` · Ends ${formatDate(batch.endDate)}`}
//             </div>
//           </div>

//           {/* Avg progress ring */}
//           <div style={{ textAlign: "center" }}>
//             <div style={{ fontSize: 36, fontWeight: 800, color: "#fff", lineHeight: 1 }}>{avgProg}%</div>
//             <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>Avg Progress</div>
//           </div>
//         </div>

//         {/* Stats */}
//         <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
//           {[
//             { value: batchStudents.length, label: "Students" },
//             { value: batchStudents.filter(s=>s.status==="active").length, label: "Active" },
//             { value: `${avgProg}%`, label: "Avg Progress" },
//             { value: batch.maxStudents || "∞", label: "Capacity" },
//           ].map((s) => (
//             <div key={s.label} style={{ flex: 1, textAlign: "center", padding: "12px 14px", borderRadius: 10, background: "rgba(255,255,255,0.15)" }}>
//               <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", lineHeight: 1 }}>{s.value}</div>
//               <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginTop: 3 }}>{s.label}</div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Tabs */}
//       <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
//         {tabs.map((tab) => (
//           <TabBtn key={tab.key} label={tab.label} count={tab.count} active={activeTab === tab.key} onClick={() => setActiveTab(tab.key)} dark={dark} />
//         ))}
//       </div>

//       {/* Tab Content */}
//       <div style={{ background: cardBg, border: `1px solid ${cardBdr}`, borderRadius: 12, overflow: "hidden" }}>

//         {/* ── BATCH INFO ── */}
//         {activeTab === "info" && (
//           <div style={{ padding: 24 }}>
//             <div style={{ fontSize: 14, fontWeight: 700, color: txtMain, marginBottom: 16 }}>Batch Information</div>
//             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
//               {[
//                 { label: "Batch Name",    value: batch.name },
//                 { label: "Course",        value: batch.course || "—" },
//                 { label: "Status",        value: statusCfg.label },
//                 { label: "Organization",  value: org?.name || "—" },
//                 { label: "Trainer",       value: trainer?.name || "Unassigned" },
//                 { label: "Max Students",  value: batch.maxStudents || "Unlimited" },
//                 { label: "Created",       value: formatDate(batch.createdAt) },
//                 { label: "Start Date",    value: formatDate(batch.startDate) },
//                 { label: "End Date",      value: formatDate(batch.endDate) },
//                 { label: "Timing",        value: batch.timing || "—" },
//                 { label: "Days",          value: batch.days || "—" },
//                 { label: "Mode",          value: batch.mode || "Online" },
//               ].map((row) => (
//                 <div key={row.label} style={{ padding: "12px 16px", borderRadius: 10, background: dark ? "rgba(255,255,255,0.04)" : "#f8fafc", border: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "#e5e7eb"}` }}>
//                   <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: txtSub, textTransform: "uppercase", marginBottom: 4 }}>{row.label}</div>
//                   <div style={{ fontSize: 13, fontWeight: 600, color: txtMain }}>{row.value}</div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* ── TRAINER INFO ── */}
//         {activeTab === "trainer" && (
//           <div style={{ padding: 24 }}>
//             <div style={{ fontSize: 14, fontWeight: 700, color: txtMain, marginBottom: 16 }}>Assigned Trainer</div>
//             {!trainer ? (
//               <div style={{ textAlign: "center", padding: "40px 0", color: txtSub, fontSize: 13 }}>No trainer assigned to this batch</div>
//             ) : (
//               <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
//                 {/* Trainer card */}
//                 {(() => { const [ta, tb] = avatarColor(trainer.name); return (
//                   <div style={{ width: 240, padding: "20px", borderRadius: 12, background: dark ? "rgba(255,255,255,0.04)" : "#f8fafc", border: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "#e5e7eb"}`, textAlign: "center" }}>
//                     <div style={{ width: 56, height: 56, borderRadius: "50%", background: `linear-gradient(135deg,${ta},${tb})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 18, fontWeight: 800, margin: "0 auto 12px" }}>
//                       {initials(trainer.name)}
//                     </div>
//                     <div style={{ fontSize: 15, fontWeight: 700, color: txtMain }}>{trainer.name}</div>
//                     <div style={{ fontSize: 12, color: txtSub, marginTop: 3 }}>{trainer.email}</div>
//                     {trainer.specialization && (
//                       <div style={{ marginTop: 8, display: "inline-block", fontSize: 11, padding: "3px 9px", borderRadius: 99, background: dark ? "rgba(139,92,246,0.12)" : "#ede9fe", color: dark ? "#a78bfa" : "#7c3aed", fontWeight: 600 }}>
//                         {trainer.specialization}
//                       </div>
//                     )}
//                     {trainer.rating && (
//                       <div style={{ marginTop: 8, fontSize: 14, fontWeight: 700, color: "#f59e0b" }}>⭐ {parseFloat(trainer.rating).toFixed(1)}</div>
//                     )}
//                     <button
//                       onClick={() => navigate(`/superadmin/trainers/${trainer.id}`)}
//                       style={{ marginTop: 14, width: "100%", padding: "8px 0", borderRadius: 8, background: "#7c3aed", color: "#fff", fontWeight: 600, fontSize: 12, border: "none", cursor: "pointer" }}
//                     >
//                       View Trainer Profile
//                     </button>
//                   </div>
//                 ); })()}

//                 {/* Trainer stats */}
//                 <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
//                   {[
//                     { label: "Total Students",   value: trainer.totalStudents || 0,  color: "#14b8a6" },
//                     { label: "Status",           value: statusCfg.label,             color: "#10b981" },
//                     { label: "Joined",           value: formatDate(trainer.joinedAt), color: "#6366f1" },
//                     { label: "Rating",           value: trainer.rating ? `${parseFloat(trainer.rating).toFixed(1)} / 5` : "—", color: "#f59e0b" },
//                   ].map((item) => (
//                     <div key={item.label} style={{ padding: "14px 16px", borderRadius: 10, background: dark ? "rgba(255,255,255,0.04)" : "#f8fafc", border: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "#e5e7eb"}` }}>
//                       <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: txtSub, textTransform: "uppercase", marginBottom: 4 }}>{item.label}</div>
//                       <div style={{ fontSize: 14, fontWeight: 700, color: item.color }}>{item.value}</div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         )}

//         {/* ── STUDENTS ── */}
//         {activeTab === "students" && (
//           <>
//             <div style={{ padding: "14px 18px", borderBottom: `1px solid ${divClr}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//               <div style={{ fontSize: 14, fontWeight: 700, color: txtMain }}>Enrolled Students</div>
//               <div style={{ fontSize: 12, color: txtSub }}>{batchStudents.length} enrolled</div>
//             </div>
//             <div style={{ overflowX: "auto" }}>
//               <table style={{ width: "100%", borderCollapse: "collapse" }}>
//                 <thead>
//                   <tr style={{ background: thBg }}>
//                     {["STUDENT", "STATUS", "PROGRESS", "COURSES", "JOINED", "ACTION"].map(h => (
//                       <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: thColor, borderBottom: `1px solid ${divClr}` }}>{h}</th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {batchStudents.length === 0 ? (
//                     <tr><td colSpan={6} style={{ textAlign: "center", padding: "40px 0", color: txtSub, fontSize: 13 }}>No students enrolled in this batch</td></tr>
//                   ) : batchStudents.map((student) => {
//                     const [sa, sb] = avatarColor(student.name);
//                     const prog     = student.progress || 0;
//                     const pColor   = prog >= 75 ? "#10b981" : prog >= 40 ? "#f59e0b" : "#ef4444";
//                     return (
//                       <tr key={student.id} style={{ borderBottom: `1px solid ${divClr}`, transition: "background 0.1s" }}
//                         onMouseEnter={(e) => { e.currentTarget.style.background = dark ? "rgba(255,255,255,0.03)" : "#f8fafc"; }}
//                         onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
//                         <td style={{ padding: "11px 16px" }}>
//                           <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//                             <div style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg,${sa},${sb})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
//                               {initials(student.name)}
//                             </div>
//                             <div>
//                               <div style={{ fontSize: 13, fontWeight: 600, color: txtMain }}>{student.name}</div>
//                               <div style={{ fontSize: 11, color: txtSub }}>{student.email}</div>
//                             </div>
//                           </div>
//                         </td>
//                         <td style={{ padding: "11px 16px" }}><Badge cfg={STATUS_CONFIG[student.status] || STATUS_CONFIG.inactive} /></td>
//                         <td style={{ padding: "11px 16px" }}>
//                           <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
//                             <div style={{ width: 70, height: 5, borderRadius: 99, background: dark ? "rgba(255,255,255,0.08)" : "#e5e7eb", overflow: "hidden" }}>
//                               <div style={{ width: `${prog}%`, height: "100%", background: pColor, borderRadius: 99 }} />
//                             </div>
//                             <span style={{ fontSize: 11, fontWeight: 600, color: pColor }}>{prog}%</span>
//                           </div>
//                         </td>
//                         <td style={{ padding: "11px 16px", fontSize: 13, fontWeight: 700, color: txtMain }}>{student.enrolledCourses || 0}</td>
//                         <td style={{ padding: "11px 16px", fontSize: 11, color: txtSub }}>{formatDate(student.joinedAt)}</td>
//                         <td style={{ padding: "11px 16px" }}>
//                           <button onClick={() => navigate(`/superadmin/students/${student.id}`)} style={{
//                             display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 6,
//                             fontSize: 11, fontWeight: 600, background: dark ? "rgba(59,130,246,0.12)" : "#dbeafe",
//                             color: dark ? "#60a5fa" : "#1d4ed8", border: "none", cursor: "pointer",
//                           }}>
//                             <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
//                             View
//                           </button>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           </>
//         )}

//         {/* ── ATTENDANCE ── */}
//         {activeTab === "attendance" && (
//           <div style={{ padding: 24 }}>
//             <div style={{ fontSize: 14, fontWeight: 700, color: txtMain, marginBottom: 16 }}>Batch Attendance</div>
//             <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
//               {batchStudents.map((student) => {
//                 const [sa, sb] = avatarColor(student.name);
//                 const att      = Math.floor(Math.random() * 25 + 70); // mock
//                 const attColor = att >= 90 ? "#10b981" : att >= 75 ? "#f59e0b" : "#ef4444";
//                 return (
//                   <div key={student.id} style={{ padding: "14px", borderRadius: 10, background: dark ? "rgba(255,255,255,0.04)" : "#f8fafc", border: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "#e5e7eb"}`, textAlign: "center" }}>
//                     <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg,${sa},${sb})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 700, margin: "0 auto 8px" }}>
//                       {initials(student.name)}
//                     </div>
//                     <div style={{ fontSize: 12, fontWeight: 600, color: txtMain, marginBottom: 4 }}>{student.name.split(" ")[0]}</div>
//                     <div style={{ fontSize: 20, fontWeight: 800, color: attColor }}>{att}%</div>
//                     <div style={{ marginTop: 6, height: 4, borderRadius: 99, background: dark ? "rgba(255,255,255,0.08)" : "#e5e7eb", overflow: "hidden" }}>
//                       <div style={{ width: `${att}%`, height: "100%", background: attColor, borderRadius: 99 }} />
//                     </div>
//                   </div>
//                 );
//               })}
//               {batchStudents.length === 0 && (
//                 <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "40px 0", color: txtSub, fontSize: 13 }}>No students enrolled</div>
//               )}
//             </div>
//           </div>
//         )}

//         {/* ── COURSE PROGRESS ── */}
//         {activeTab === "progress" && (
//           <div style={{ padding: 24 }}>
//             <div style={{ fontSize: 14, fontWeight: 700, color: txtMain, marginBottom: 16 }}>Course Progress</div>

//             {/* Overall */}
//             <div style={{ padding: "18px 20px", borderRadius: 12, background: `linear-gradient(135deg,#1d4ed8,#3b82f6)`, marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//               <div>
//                 <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>Overall Batch Progress</div>
//                 <div style={{ fontSize: 32, fontWeight: 800, color: "#fff", marginTop: 4, lineHeight: 1 }}>{avgProg}%</div>
//               </div>
//               <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
//                 <span style={{ fontSize: 24, fontWeight: 800, color: "#fff" }}>{avgProg}%</span>
//               </div>
//             </div>

//             {/* Per student */}
//             <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
//               {batchStudents.sort((a,b)=>(b.progress||0)-(a.progress||0)).map((student) => {
//                 const prog   = student.progress || 0;
//                 const pColor = prog >= 75 ? "#10b981" : prog >= 40 ? "#f59e0b" : "#ef4444";
//                 const [sa, sb] = avatarColor(student.name);
//                 return (
//                   <div key={student.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 10, background: dark ? "rgba(255,255,255,0.03)" : "#f8fafc" }}>
//                     <div style={{ width: 30, height: 30, borderRadius: "50%", background: `linear-gradient(135deg,${sa},${sb})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
//                       {initials(student.name)}
//                     </div>
//                     <div style={{ fontSize: 12, fontWeight: 600, color: txtMain, width: 120, flexShrink: 0 }}>{student.name}</div>
//                     <div style={{ flex: 1, height: 6, borderRadius: 99, background: dark ? "rgba(255,255,255,0.08)" : "#e5e7eb", overflow: "hidden" }}>
//                       <div style={{ width: `${prog}%`, height: "100%", background: pColor, borderRadius: 99, transition: "width 0.5s" }} />
//                     </div>
//                     <span style={{ fontSize: 12, fontWeight: 700, color: pColor, width: 40, textAlign: "right", flexShrink: 0 }}>{prog}%</span>
//                   </div>
//                 );
//               })}
//               {batchStudents.length === 0 && (
//                 <div style={{ textAlign: "center", padding: "40px 0", color: txtSub, fontSize: 13 }}>No students enrolled</div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default BatchDetailsPage;




























// src/SuperAdmin/admin-control/BatchDetailsPage.jsx
// Route: /superadmin/batches/:batchId
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSaas } from "../context/SaasContext";
import { useTheme } from "../context/ThemeContext";
import { STATUS_CONFIG } from "../constants/permissions";
import BreadcrumbNavigation from "../components/layout/navigation/BreadcrumbNavigation";

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function initials(name = "") {
  return name.split(" ").map((w) => w[0] || "").join("").slice(0, 2).toUpperCase();
}
function formatDate(dateStr) {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit", month: "short", year: "numeric",
    });
  } catch { return dateStr; }
}
const AVATAR_COLORS = [
  ["#6366f1","#818cf8"],["#8b5cf6","#a78bfa"],["#ec4899","#f472b6"],
  ["#14b8a6","#2dd4bf"],["#f59e0b","#fbbf24"],["#10b981","#34d399"],
  ["#3b82f6","#60a5fa"],["#ef4444","#f87171"],
];
const avatarColor = (name = "") =>
  AVATAR_COLORS[(name.charCodeAt(0) || 0) % AVATAR_COLORS.length];

// ─────────────────────────────────────────────
// SHARED UI
// ─────────────────────────────────────────────
const Badge = ({ cfg }) => {
  const c = cfg || STATUS_CONFIG.inactive;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 999, background: c.bg, color: c.color }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.dot, flexShrink: 0 }} />
      {c.label}
    </span>
  );
};

const StatMini = ({ value, label, color, dark }) => (
  <div style={{ textAlign: "center", padding: "14px 18px", borderRadius: 10, background: dark ? "rgba(255,255,255,0.04)" : "#f8fafc", flex: 1, minWidth: 0 }}>
    <div style={{ fontSize: 26, fontWeight: 800, color: color || (dark ? "#f1f5f9" : "#0f172a"), lineHeight: 1 }}>{value}</div>
    <div style={{ fontSize: 11, color: dark ? "#64748b" : "#94a3b8", marginTop: 3 }}>{label}</div>
  </div>
);

const TabBtn = ({ label, active, count, onClick, dark }) => (
  <button onClick={onClick} style={{
    padding: "7px 14px", borderRadius: 7, fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer",
    background: active ? "#6366f1" : (dark ? "rgba(255,255,255,0.05)" : "#f1f5f9"),
    color: active ? "#fff" : (dark ? "#94a3b8" : "#64748b"), transition: "all 0.15s",
    display: "flex", alignItems: "center", gap: 6,
  }}>
    {label}
    {count !== undefined && (
      <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 99, background: active ? "rgba(255,255,255,0.25)" : (dark ? "rgba(255,255,255,0.10)" : "#e5e7eb") }}>
        {count}
      </span>
    )}
  </button>
);

const ViewDetailsBtn = ({ onClick, dark }) => (
  <button onClick={onClick} style={{
    display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 6,
    fontSize: 11, fontWeight: 600, background: dark ? "rgba(99,102,241,0.12)" : "#ede9fe",
    color: dark ? "#a78bfa" : "#6d28d9", border: "none", cursor: "pointer",
  }}>
    <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
    View Details
  </button>
);

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────
const BatchDetailsPage = () => {
  const { batchId } = useParams();
  const navigate    = useNavigate();
  const { dark }    = useTheme();

  const {
    organizations,
    trainers:  allTrainers,
    batches:   allBatches,
    students:  allStudents,
  } = useSaas();

  const [activeTab, setActiveTab] = useState("students");
  const [search, setSearch]       = useState("");

  // Resolve batch
  const batch   = allBatches.find((b) => b.id === batchId);
  const trainer = batch ? allTrainers.find((t) => t.id === batch.trainerId) : null;
  const org     = batch ? organizations.find((o) => o.id === batch.organizationId) : null;

  // Students in this batch
  const batchStudents = allStudents.filter((s) => s.batchId === batchId);
  const filtered      = batchStudents.filter((s) => {
    const q = search.toLowerCase();
    return !q || s.name?.toLowerCase().includes(q) || s.email?.toLowerCase().includes(q);
  });

  // Stats
  const totalStudents  = batchStudents.length;
  const activeStudents = batchStudents.filter((s) => s.status === "active").length;
  const avgProgress    = totalStudents
    ? Math.round(batchStudents.reduce((a, s) => a + (s.progress || 0), 0) / totalStudents)
    : 0;
  const completed      = batchStudents.filter((s) => (s.progress || 0) >= 100).length;

  // tokens
  const cardBg  = dark ? "rgba(255,255,255,0.03)" : "#ffffff";
  const cardBdr = dark ? "rgba(255,255,255,0.08)" : "#e5e7eb";
  const thBg    = dark ? "rgba(255,255,255,0.04)" : "#f8fafc";
  const thColor = dark ? "#64748b" : "#94a3b8";
  const txtMain = dark ? "#f1f5f9" : "#0f172a";
  const txtSub  = dark ? "#64748b" : "#94a3b8";
  const divClr  = dark ? "rgba(255,255,255,0.06)" : "#f1f5f9";

  if (!batch) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: txtSub }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: txtMain }}>Batch Not Found</div>
        <div style={{ fontSize: 13, marginTop: 6 }}>The batch you're looking for doesn't exist.</div>
        <button
          onClick={() => navigate(-1)}
          style={{ marginTop: 20, padding: "10px 20px", borderRadius: 8, background: "#6366f1", color: "#fff", border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13 }}
        >
          Go Back
        </button>
      </div>
    );
  }

  const statusCfg = STATUS_CONFIG[batch.status] || STATUS_CONFIG.inactive;

  // Breadcrumb
  const breadcrumbItems = [
    { label: "Organizations", href: "/superadmin/organizations" },
    org  && { label: org.name,     href: `/superadmin/organizations/${org.id}` },
    trainer && { label: trainer.name, href: `/superadmin/trainers/${trainer.id}` },
    { label: batch.name },
  ].filter(Boolean);

  const tabs = [
    { key: "students",    label: "Students",    count: totalStudents },
    { key: "overview",    label: "Overview" },
    { key: "attendance",  label: "Attendance" },
    { key: "performance", label: "Performance" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Breadcrumb */}
      <BreadcrumbNavigation items={breadcrumbItems} />

      {/* Batch Header Card */}
      <div style={{ background: cardBg, border: `1px solid ${cardBdr}`, borderRadius: 14, padding: "24px 28px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 18, flexWrap: "wrap" }}>
          {/* Icon */}
          <div style={{ width: 64, height: 64, borderRadius: 14, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>
            📦
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: txtMain, margin: 0, letterSpacing: "-0.02em" }}>
                {batch.name}
              </h1>
              <Badge cfg={statusCfg} />
            </div>
            <div style={{ display: "flex", gap: 20, marginTop: 8, flexWrap: "wrap" }}>
              {batch.course  && <span style={{ fontSize: 12, color: txtSub }}>📚 {batch.course}</span>}
              {trainer       && <span style={{ fontSize: 12, color: txtSub }}>👨‍🏫 {trainer.name}</span>}
              {org           && <span style={{ fontSize: 12, color: txtSub }}>🏢 {org.name}</span>}
            </div>
            <div style={{ fontSize: 11, color: txtSub, marginTop: 4 }}>
              Created {formatDate(batch.createdAt)}
              {batch.startDate && ` · Started ${formatDate(batch.startDate)}`}
              {batch.endDate   && ` · Ends ${formatDate(batch.endDate)}`}
            </div>
          </div>

          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, background: dark ? "rgba(255,255,255,0.06)" : "#f1f5f9", color: txtSub, border: "none", cursor: "pointer" }}
          >
            <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Back
          </button>
        </div>

        {/* Stats Row */}
        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <StatMini value={totalStudents}  label="Total Students"  color="#6366f1" dark={dark} />
          <StatMini value={activeStudents} label="Active Students" color="#10b981" dark={dark} />
          <StatMini value={`${avgProgress}%`} label="Avg Progress" color="#f59e0b" dark={dark} />
          <StatMini value={completed}      label="Completed"       color="#14b8a6" dark={dark} />
        </div>
      </div>

      {/* Trainer Info Card */}
      {trainer && (
        <div style={{ background: cardBg, border: `1px solid ${cardBdr}`, borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}>
          {(() => { const [a, b] = avatarColor(trainer.name); return (
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: `linear-gradient(135deg,${a},${b})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14, fontWeight: 700, flexShrink: 0 }}>
              {initials(trainer.name)}
            </div>
          ); })()}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: txtMain }}>Assigned Trainer</div>
            <div style={{ fontSize: 12, color: txtSub }}>{trainer.name} · {trainer.email}</div>
            {trainer.specialization && <div style={{ fontSize: 11, color: txtSub }}>{trainer.specialization}</div>}
          </div>
          <button
            onClick={() => navigate(`/superadmin/trainers/${trainer.id}`)}
            style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, background: dark ? "rgba(139,92,246,0.12)" : "#ede9fe", color: dark ? "#a78bfa" : "#7c3aed", border: "none", cursor: "pointer" }}
          >
            View Trainer
          </button>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {tabs.map((tab) => (
          <TabBtn key={tab.key} label={tab.label} count={tab.count} active={activeTab === tab.key} onClick={() => setActiveTab(tab.key)} dark={dark} />
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ background: cardBg, border: `1px solid ${cardBdr}`, borderRadius: 12, overflow: "hidden" }}>

        {/* ── STUDENTS TAB ── */}
        {activeTab === "students" && (
          <>
            <div style={{ padding: "14px 18px", borderBottom: `1px solid ${divClr}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: txtMain }}>Students in this Batch</div>
              {/* Search */}
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ position: "absolute", left: 9, color: txtSub }}>
                  <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>
                <input
                  placeholder="Search students..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ paddingLeft: 28, paddingRight: 10, paddingTop: 6, paddingBottom: 6, borderRadius: 7, fontSize: 12, border: dark ? "1px solid rgba(255,255,255,0.10)" : "1px solid #e5e7eb", background: dark ? "rgba(255,255,255,0.04)" : "#f8fafc", color: dark ? "#f1f5f9" : "#0f172a", outline: "none", width: 180 }}
                />
              </div>
              <div style={{ fontSize: 12, color: txtSub }}>{filtered.length} students</div>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: thBg }}>
                    {["STUDENT", "STATUS", "PROGRESS", "ATTENDANCE", "JOINED", "ACTION"].map((h) => (
                      <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: thColor, borderBottom: `1px solid ${divClr}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", padding: "40px 0", color: txtSub, fontSize: 13 }}>
                        {search ? "No students match your search" : "No students in this batch"}
                      </td>
                    </tr>
                  ) : filtered.map((student) => {
                    const [sa, sb]  = avatarColor(student.name || "");
                    const prog      = student.progress || 0;
                    const progColor = prog >= 75 ? "#10b981" : prog >= 40 ? "#f59e0b" : "#ef4444";
                    const attendance = student.attendance || Math.floor(Math.random() * 20 + 75);
                    const attColor  = attendance >= 90 ? "#10b981" : attendance >= 75 ? "#f59e0b" : "#ef4444";
                    return (
                      <tr key={student.id}
                        style={{ borderBottom: `1px solid ${divClr}`, transition: "background 0.1s" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = dark ? "rgba(255,255,255,0.03)" : "#f8fafc"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                      >
                        {/* Student */}
                        <td style={{ padding: "11px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg,${sa},${sb})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                              {initials(student.name || "")}
                            </div>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 600, color: txtMain }}>{student.name || "—"}</div>
                              <div style={{ fontSize: 11, color: txtSub }}>{student.email || "—"}</div>
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td style={{ padding: "11px 16px" }}>
                          <Badge cfg={STATUS_CONFIG[student.status] || STATUS_CONFIG.inactive} />
                        </td>

                        {/* Progress */}
                        <td style={{ padding: "11px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                            <div style={{ width: 70, height: 5, borderRadius: 99, background: dark ? "rgba(255,255,255,0.08)" : "#e5e7eb", overflow: "hidden" }}>
                              <div style={{ width: `${prog}%`, height: "100%", background: progColor, borderRadius: 99 }} />
                            </div>
                            <span style={{ fontSize: 11, fontWeight: 700, color: progColor }}>{prog}%</span>
                          </div>
                        </td>

                        {/* Attendance */}
                        <td style={{ padding: "11px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                            <div style={{ width: 50, height: 5, borderRadius: 99, background: dark ? "rgba(255,255,255,0.08)" : "#e5e7eb", overflow: "hidden" }}>
                              <div style={{ width: `${attendance}%`, height: "100%", background: attColor, borderRadius: 99 }} />
                            </div>
                            <span style={{ fontSize: 11, fontWeight: 700, color: attColor }}>{attendance}%</span>
                          </div>
                        </td>

                        {/* Joined */}
                        <td style={{ padding: "11px 16px", fontSize: 11, color: txtSub }}>
                          {formatDate(student.joinedAt || student.createdAt)}
                        </td>

                        {/* Action */}
                        <td style={{ padding: "11px 16px" }}>
                          <ViewDetailsBtn onClick={() => navigate(`/superadmin/students/${student.id}`)} dark={dark} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ── OVERVIEW TAB ── */}
        {activeTab === "overview" && (
          <div style={{ padding: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: txtMain, marginBottom: 16 }}>Batch Overview</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { label: "Batch Name",    value: batch.name },
                { label: "Course",        value: batch.course || "Not assigned" },
                { label: "Status",        value: statusCfg.label },
                { label: "Trainer",       value: trainer?.name || "Not assigned" },
                { label: "Organization",  value: org?.name || "—" },
                { label: "Total Students",value: totalStudents },
                { label: "Active Students",value: activeStudents },
                { label: "Avg Progress",  value: `${avgProgress}%` },
                { label: "Completed",     value: completed },
                { label: "Created",       value: formatDate(batch.createdAt) },
                { label: "Start Date",    value: formatDate(batch.startDate) },
                { label: "End Date",      value: formatDate(batch.endDate) },
              ].map((row) => (
                <div key={row.label} style={{ padding: "12px 16px", borderRadius: 10, background: dark ? "rgba(255,255,255,0.04)" : "#f8fafc", border: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "#e5e7eb"}` }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: txtSub, textTransform: "uppercase", marginBottom: 4 }}>{row.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: txtMain }}>{row.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ATTENDANCE TAB ── */}
        {activeTab === "attendance" && (
          <div style={{ padding: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: txtMain, marginBottom: 16 }}>Attendance Overview</div>
            {batchStudents.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 0", color: txtSub, fontSize: 13 }}>No students to show attendance for</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {batchStudents.map((student) => {
                  const attendance = student.attendance || Math.floor(Math.random() * 20 + 75);
                  const attColor   = attendance >= 90 ? "#10b981" : attendance >= 75 ? "#f59e0b" : "#ef4444";
                  const [sa, sb]   = avatarColor(student.name || "");
                  return (
                    <div key={student.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", borderRadius: 10, background: dark ? "rgba(255,255,255,0.04)" : "#f8fafc", border: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "#e5e7eb"}` }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg,${sa},${sb})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                        {initials(student.name || "")}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: txtMain }}>{student.name}</div>
                        <div style={{ fontSize: 11, color: txtSub }}>{student.email}</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 100, height: 6, borderRadius: 99, background: dark ? "rgba(255,255,255,0.08)" : "#e5e7eb", overflow: "hidden" }}>
                          <div style={{ width: `${attendance}%`, height: "100%", background: attColor, borderRadius: 99 }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: attColor, minWidth: 36 }}>{attendance}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── PERFORMANCE TAB ── */}
        {activeTab === "performance" && (
          <div style={{ padding: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: txtMain, marginBottom: 16 }}>Performance Metrics</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
              {[
                { label: "Total Students",    value: totalStudents,  color: "#6366f1", icon: "👨‍🎓" },
                { label: "Active Students",   value: activeStudents, color: "#10b981", icon: "✅" },
                { label: "Avg Progress",      value: `${avgProgress}%`, color: "#f59e0b", icon: "📈" },
                { label: "Completed Course",  value: completed,      color: "#14b8a6", icon: "🏆" },
                { label: "Completion Rate",   value: totalStudents ? `${Math.round(completed / totalStudents * 100)}%` : "0%", color: "#3b82f6", icon: "🎯" },
                { label: "Struggling (<40%)", value: batchStudents.filter(s => (s.progress || 0) < 40).length, color: "#ef4444", icon: "⚠️" },
              ].map((item) => (
                <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", borderRadius: 12, background: dark ? "rgba(255,255,255,0.04)" : "#f8fafc", border: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "#e5e7eb"}` }}>
                  <span style={{ fontSize: 24 }}>{item.icon}</span>
                  <div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: item.color }}>{item.value}</div>
                    <div style={{ fontSize: 11, color: txtSub, marginTop: 2 }}>{item.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Progress distribution */}
            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: txtMain, marginBottom: 12 }}>Progress Distribution</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { label: "Excellent (75–100%)", count: batchStudents.filter(s => (s.progress||0) >= 75).length, color: "#10b981" },
                  { label: "Good (40–74%)",       count: batchStudents.filter(s => (s.progress||0) >= 40 && (s.progress||0) < 75).length, color: "#f59e0b" },
                  { label: "Struggling (<40%)",   count: batchStudents.filter(s => (s.progress||0) < 40).length, color: "#ef4444" },
                ].map((row) => (
                  <div key={row.label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ fontSize: 12, color: txtSub, minWidth: 160 }}>{row.label}</div>
                    <div style={{ flex: 1, height: 8, borderRadius: 99, background: dark ? "rgba(255,255,255,0.08)" : "#e5e7eb", overflow: "hidden" }}>
                      <div style={{ width: totalStudents ? `${(row.count / totalStudents) * 100}%` : "0%", height: "100%", background: row.color, borderRadius: 99 }} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: row.color, minWidth: 24 }}>{row.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BatchDetailsPage;