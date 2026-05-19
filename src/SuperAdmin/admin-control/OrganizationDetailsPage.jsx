// // pages/OrganizationDetailsPage.jsx
// // SuperAdmin → Organization detail with admins, trainers, batches, students
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

// const PLAN_CONFIG = {
//   free:       { label: "Free",       dot: "#94a3b8", bg: "rgba(148,163,184,0.12)", color: "#64748b" },
//   starter:    { label: "Starter",    dot: "#14b8a6", bg: "rgba(20,184,166,0.12)",  color: "#0d9488" },
//   pro:        { label: "Pro",        dot: "#8b5cf6", bg: "rgba(139,92,246,0.12)",  color: "#7c3aed" },
//   enterprise: { label: "Enterprise", dot: "#f59e0b", bg: "rgba(245,158,11,0.12)",  color: "#d97706" },
// };

// // ─────────────────────────────────────────────
// // SHARED COMPONENTS
// // ─────────────────────────────────────────────
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
//   <div style={{ textAlign: "center", padding: "14px 18px", borderRadius: 10, background: dark ? "rgba(255,255,255,0.04)" : "#f8fafc" }}>
//     <div style={{ fontSize: 26, fontWeight: 800, color: color || (dark ? "#f1f5f9" : "#0f172a"), lineHeight: 1 }}>{value}</div>
//     <div style={{ fontSize: 11, color: dark ? "#64748b" : "#94a3b8", marginTop: 3 }}>{label}</div>
//   </div>
// );

// // ─────────────────────────────────────────────
// // TAB BUTTON
// // ─────────────────────────────────────────────
// const TabBtn = ({ label, active, count, onClick, dark }) => (
//   <button onClick={onClick} style={{
//     padding: "7px 14px", borderRadius: 7, fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer",
//     background: active ? "#6366f1" : (dark ? "rgba(255,255,255,0.05)" : "#f1f5f9"),
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
// // PERSON ROW (used in admin/trainer/student lists)
// // ─────────────────────────────────────────────
// const PersonRow = ({ person, subtitle, badge, rightLabel, rightSub, onViewDetails, dark, divClr, txtMain, txtSub }) => {
//   const [a, b] = avatarColor(person.name || "");
//   return (
//     <tr style={{ borderBottom: `1px solid ${divClr}`, transition: "background 0.1s" }}
//       onMouseEnter={(e) => { e.currentTarget.style.background = dark ? "rgba(255,255,255,0.03)" : "#f8fafc"; }}
//       onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
//       <td style={{ padding: "11px 16px" }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//           <div style={{ width: 34, height: 34, borderRadius: "50%", flexShrink: 0, background: `linear-gradient(135deg,${a},${b})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 700 }}>
//             {initials(person.name || "")}
//           </div>
//           <div>
//             <div style={{ fontSize: 13, fontWeight: 600, color: txtMain }}>{person.name || "—"}</div>
//             <div style={{ fontSize: 11, color: txtSub }}>{subtitle || person.email || "—"}</div>
//           </div>
//         </div>
//       </td>
//       <td style={{ padding: "11px 16px" }}>{badge}</td>
//       <td style={{ padding: "11px 16px" }}>
//         {rightLabel && <div style={{ fontSize: 13, fontWeight: 700, color: txtMain }}>{rightLabel}</div>}
//         {rightSub && <div style={{ fontSize: 11, color: txtSub }}>{rightSub}</div>}
//       </td>
//       <td style={{ padding: "11px 16px", fontSize: 11, color: txtSub }}>{formatDate(person.joinedAt || person.createdAt)}</td>
//       <td style={{ padding: "11px 16px" }}>
//         <button onClick={onViewDetails} style={{
//           display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 6,
//           fontSize: 11, fontWeight: 600, background: dark ? "rgba(99,102,241,0.12)" : "#ede9fe",
//           color: dark ? "#a78bfa" : "#6d28d9", border: "none", cursor: "pointer", transition: "all 0.15s",
//         }}>
//           <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
//           View Details
//         </button>
//       </td>
//     </tr>
//   );
// };

// // ─────────────────────────────────────────────
// // BATCH ROW
// // ─────────────────────────────────────────────
// const BatchRow = ({ batch, trainer, onViewDetails, dark, divClr, txtMain, txtSub }) => {
//   const statusCfg = STATUS_CONFIG[batch.status] || STATUS_CONFIG.inactive;
//   return (
//     <tr style={{ borderBottom: `1px solid ${divClr}`, transition: "background 0.1s" }}
//       onMouseEnter={(e) => { e.currentTarget.style.background = dark ? "rgba(255,255,255,0.03)" : "#f8fafc"; }}
//       onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
//       <td style={{ padding: "11px 16px" }}>
//         <div style={{ fontSize: 13, fontWeight: 600, color: txtMain }}>{batch.name}</div>
//         <div style={{ fontSize: 11, color: txtSub }}>{batch.course || "No course assigned"}</div>
//       </td>
//       <td style={{ padding: "11px 16px" }}><Badge cfg={statusCfg} /></td>
//       <td style={{ padding: "11px 16px", fontSize: 12, color: txtMain }}>{trainer?.name || "—"}</td>
//       <td style={{ padding: "11px 16px", fontSize: 13, fontWeight: 700, color: txtMain }}>{(batch.studentIds || []).length}</td>
//       <td style={{ padding: "11px 16px", fontSize: 11, color: txtSub }}>{formatDate(batch.createdAt)}</td>
//       <td style={{ padding: "11px 16px" }}>
//         <button onClick={onViewDetails} style={{
//           display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 6,
//           fontSize: 11, fontWeight: 600, background: dark ? "rgba(99,102,241,0.12)" : "#ede9fe",
//           color: dark ? "#a78bfa" : "#6d28d9", border: "none", cursor: "pointer", transition: "all 0.15s",
//         }}>
//           <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
//           View Details
//         </button>
//       </td>
//     </tr>
//   );
// };

// // ─────────────────────────────────────────────
// // MAIN PAGE
// // ─────────────────────────────────────────────
// const OrganizationDetailsPage = () => {
//   const { orgId } = useParams();
//   const navigate  = useNavigate();
//   const { dark }  = useTheme();

//   // Raw state from context
//   const {
//     organizations,
//     orgAdmins: allOrgAdmins,
//     trainers:  allTrainers,
//     batches:   allBatches,
//     students:  allStudents,
//     getOrgStats,
//   } = useSaas();

//   const [activeTab, setActiveTab] = useState("admins");

//   // Find this org
//   const org = organizations.find((o) => o.id === orgId);

//   // Relational filtering
//   const orgAdmins  = allOrgAdmins.filter((a) => a.organizationId === orgId);
//   const trainers   = allTrainers.filter((t) => t.organizationId === orgId);
//   const batches    = allBatches.filter((b) => b.organizationId === orgId);
//   const students   = allStudents.filter((s) => s.organizationId === orgId);
//   const stats      = org ? getOrgStats(orgId) : {};

//   // tokens
//   const cardBg  = dark ? "rgba(255,255,255,0.03)" : "#ffffff";
//   const cardBdr = dark ? "rgba(255,255,255,0.08)" : "#e5e7eb";
//   const thBg    = dark ? "rgba(255,255,255,0.04)" : "#f8fafc";
//   const thColor = dark ? "#64748b" : "#94a3b8";
//   const txtMain = dark ? "#f1f5f9" : "#0f172a";
//   const txtSub  = dark ? "#64748b" : "#94a3b8";
//   const divClr  = dark ? "rgba(255,255,255,0.06)" : "#f1f5f9";

//   if (!org) {
//     return (
//       <div style={{ padding: 40, textAlign: "center", color: txtSub }}>
//         <div style={{ fontSize: 48, marginBottom: 12 }}>🏢</div>
//         <div style={{ fontSize: 16, fontWeight: 700, color: txtMain }}>Organization Not Found</div>
//         <div style={{ fontSize: 13, marginTop: 6 }}>The organization you're looking for doesn't exist.</div>
//         <button onClick={() => navigate("/superadmin/organizations")} style={{ marginTop: 20, padding: "10px 20px", borderRadius: 8, background: "#6366f1", color: "#fff", border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>
//           Back to Organizations
//         </button>
//       </div>
//     );
//   }

//   const [a, b] = avatarColor(org.name);
//   const statusCfg = STATUS_CONFIG[org.status] || STATUS_CONFIG.inactive;
//   const planCfg   = PLAN_CONFIG[org.plan]     || PLAN_CONFIG.starter;

//   const tabs = [
//     { key: "admins",   label: "Admins",   count: orgAdmins.length },
//     { key: "trainers", label: "Trainers", count: trainers.length },
//     { key: "batches",  label: "Batches",  count: batches.length },
//     { key: "students", label: "Students", count: students.length },
//   ];

//   return (
//     <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
//       {/* Breadcrumb */}
//       <BreadcrumbNavigation
//         items={[
//           { label: "Organizations", href: "/superadmin/organizations" },
//           { label: org.name },
//         ]}
//       />

//       {/* Org Header Card */}
//       <div style={{ background: cardBg, border: `1px solid ${cardBdr}`, borderRadius: 14, padding: "24px 28px" }}>
//         <div style={{ display: "flex", alignItems: "flex-start", gap: 18, flexWrap: "wrap" }}>
//           {/* Avatar */}
//           <div style={{ width: 64, height: 64, borderRadius: 14, background: `linear-gradient(135deg,${a},${b})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 22, fontWeight: 800, flexShrink: 0 }}>
//             {initials(org.name)}
//           </div>

//           {/* Info */}
//           <div style={{ flex: 1, minWidth: 0 }}>
//             <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
//               <h1 style={{ fontSize: 22, fontWeight: 800, color: txtMain, margin: 0, letterSpacing: "-0.02em" }}>{org.name}</h1>
//               <Badge cfg={statusCfg} />
//               <Badge cfg={planCfg} />
//             </div>
//             <div style={{ display: "flex", gap: 20, marginTop: 8, flexWrap: "wrap" }}>
//               {org.domain && <span style={{ fontSize: 12, color: txtSub }}>🌐 {org.domain}</span>}
//               {org.industry && <span style={{ fontSize: 12, color: txtSub }}>🏭 {org.industry}</span>}
//               {org.location && <span style={{ fontSize: 12, color: txtSub }}>📍 {org.location}</span>}
//               {org.contactEmail && <span style={{ fontSize: 12, color: txtSub }}>✉️ {org.contactEmail}</span>}
//             </div>
//             <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
//               <span style={{ fontSize: 11, color: txtSub }}>Created {formatDate(org.createdAt)}</span>
//               {org.planExpiry && <span style={{ fontSize: 11, color: txtSub }}>Expires {formatDate(org.planExpiry)}</span>}
//             </div>
//           </div>
//         </div>

//         {/* Stats Row */}
//         <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 10, marginTop: 20 }}>
//           <StatMini value={stats.totalAdmins}   label="Admins"      color="#6366f1" dark={dark} />
//           <StatMini value={stats.totalTrainers} label="Trainers"    color="#8b5cf6" dark={dark} />
//           <StatMini value={stats.totalBatches}  label="Batches"     color="#3b82f6" dark={dark} />
//           <StatMini value={stats.totalStudents} label="Students"    color="#14b8a6" dark={dark} />
//           <StatMini value={stats.activeStudents} label="Active Stu." color="#10b981" dark={dark} />
//           <StatMini value={stats.activeBatches} label="Active Bat." color="#f59e0b" dark={dark} />
//         </div>
//       </div>

//       {/* Tab Navigation */}
//       <div style={{ display: "flex", gap: 8 }}>
//         {tabs.map((tab) => (
//           <TabBtn key={tab.key} label={tab.label} count={tab.count} active={activeTab === tab.key} onClick={() => setActiveTab(tab.key)} dark={dark} />
//         ))}
//       </div>

//       {/* Tab Content */}
//       <div style={{ background: cardBg, border: `1px solid ${cardBdr}`, borderRadius: 12, overflow: "hidden" }}>

//         {/* ── ADMINS TAB ── */}
//         {activeTab === "admins" && (
//           <>
//             <div style={{ padding: "14px 18px", borderBottom: `1px solid ${divClr}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//               <div style={{ fontSize: 14, fontWeight: 700, color: txtMain }}>Organization Admins</div>
//               <div style={{ fontSize: 12, color: txtSub }}>{orgAdmins.length} total</div>
//             </div>
//             <div style={{ overflowX: "auto" }}>
//               <table style={{ width: "100%", borderCollapse: "collapse" }}>
//                 <thead>
//                   <tr style={{ background: thBg }}>
//                     {["ADMIN", "STATUS", "TRAINERS", "JOINED", "ACTION"].map((h) => (
//                       <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: thColor, borderBottom: `1px solid ${divClr}` }}>{h}</th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {orgAdmins.length === 0 ? (
//                     <tr><td colSpan={5} style={{ textAlign: "center", padding: "40px 0", color: txtSub, fontSize: 13 }}>No admins for this organization</td></tr>
//                   ) : orgAdmins.map((admin) => {
//                     const adminTrainers = trainers.filter((t) => t.adminId === admin.id);
//                     return (
//                       <PersonRow key={admin.id} person={admin}
//                         badge={<Badge cfg={STATUS_CONFIG[admin.status] || STATUS_CONFIG.inactive} />}
//                         rightLabel={`${adminTrainers.length} trainers`}
//                         rightSub={admin.permissions ? "Custom perms" : "Default perms"}
//                         onViewDetails={() => navigate(`/superadmin/organizations/${orgId}/admins/${admin.id}`)}
//                         dark={dark} divClr={divClr} txtMain={txtMain} txtSub={txtSub}
//                       />
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           </>
//         )}

//         {/* ── TRAINERS TAB ── */}
//         {activeTab === "trainers" && (
//           <>
//             <div style={{ padding: "14px 18px", borderBottom: `1px solid ${divClr}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//               <div style={{ fontSize: 14, fontWeight: 700, color: txtMain }}>Trainers</div>
//               <div style={{ fontSize: 12, color: txtSub }}>{trainers.length} total</div>
//             </div>
//             <div style={{ overflowX: "auto" }}>
//               <table style={{ width: "100%", borderCollapse: "collapse" }}>
//                 <thead>
//                   <tr style={{ background: thBg }}>
//                     {["TRAINER", "STATUS", "BATCHES / STUDENTS", "JOINED", "ACTION"].map((h) => (
//                       <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: thColor, borderBottom: `1px solid ${divClr}` }}>{h}</th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {trainers.length === 0 ? (
//                     <tr><td colSpan={5} style={{ textAlign: "center", padding: "40px 0", color: txtSub, fontSize: 13 }}>No trainers for this organization</td></tr>
//                   ) : trainers.map((trainer) => {
//                     const trainerBatches  = batches.filter((b) => b.trainerId === trainer.id);
//                     const trainerStudents = students.filter((s) => s.trainerId === trainer.id);
//                     return (
//                       <PersonRow key={trainer.id} person={trainer}
//                         subtitle={trainer.specialization || trainer.email}
//                         badge={<Badge cfg={STATUS_CONFIG[trainer.status] || STATUS_CONFIG.inactive} />}
//                         rightLabel={`${trainerBatches.length} batches`}
//                         rightSub={`${trainerStudents.length} students`}
//                         onViewDetails={() => navigate(`/superadmin/trainers/${trainer.id}`)}
//                         dark={dark} divClr={divClr} txtMain={txtMain} txtSub={txtSub}
//                       />
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           </>
//         )}

//         {/* ── BATCHES TAB ── */}
//         {activeTab === "batches" && (
//           <>
//             <div style={{ padding: "14px 18px", borderBottom: `1px solid ${divClr}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//               <div style={{ fontSize: 14, fontWeight: 700, color: txtMain }}>Batches</div>
//               <div style={{ fontSize: 12, color: txtSub }}>{batches.length} total</div>
//             </div>
//             <div style={{ overflowX: "auto" }}>
//               <table style={{ width: "100%", borderCollapse: "collapse" }}>
//                 <thead>
//                   <tr style={{ background: thBg }}>
//                     {["BATCH", "STATUS", "TRAINER", "STUDENTS", "CREATED", "ACTION"].map((h) => (
//                       <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: thColor, borderBottom: `1px solid ${divClr}` }}>{h}</th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {batches.length === 0 ? (
//                     <tr><td colSpan={6} style={{ textAlign: "center", padding: "40px 0", color: txtSub, fontSize: 13 }}>No batches for this organization</td></tr>
//                   ) : batches.map((batch) => {
//                     const trainer = trainers.find((t) => t.id === batch.trainerId);
//                     return (
//                       <BatchRow key={batch.id} batch={batch} trainer={trainer}
//                         onViewDetails={() => navigate(`/superadmin/batches/${batch.id}`)}
//                         dark={dark} divClr={divClr} txtMain={txtMain} txtSub={txtSub}
//                       />
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           </>
//         )}

//         {/* ── STUDENTS TAB ── */}
//         {activeTab === "students" && (
//           <>
//             <div style={{ padding: "14px 18px", borderBottom: `1px solid ${divClr}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//               <div style={{ fontSize: 14, fontWeight: 700, color: txtMain }}>Students</div>
//               <div style={{ fontSize: 12, color: txtSub }}>{students.length} total</div>
//             </div>
//             <div style={{ overflowX: "auto" }}>
//               <table style={{ width: "100%", borderCollapse: "collapse" }}>
//                 <thead>
//                   <tr style={{ background: thBg }}>
//                     {["STUDENT", "STATUS", "BATCH / TRAINER", "JOINED", "ACTION"].map((h) => (
//                       <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: thColor, borderBottom: `1px solid ${divClr}` }}>{h}</th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {students.length === 0 ? (
//                     <tr><td colSpan={5} style={{ textAlign: "center", padding: "40px 0", color: txtSub, fontSize: 13 }}>No students for this organization</td></tr>
//                   ) : students.map((student) => {
//                     const batch   = batches.find((b) => b.id === student.batchId);
//                     const trainer = trainers.find((t) => t.id === student.trainerId);
//                     return (
//                       <PersonRow key={student.id} person={student}
//                         badge={<Badge cfg={STATUS_CONFIG[student.status] || STATUS_CONFIG.inactive} />}
//                         rightLabel={batch?.name || "No batch"}
//                         rightSub={trainer?.name || "No trainer"}
//                         onViewDetails={() => navigate(`/superadmin/students/${student.id}`)}
//                         dark={dark} divClr={divClr} txtMain={txtMain} txtSub={txtSub}
//                       />
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default OrganizationDetailsPage;






























// pages/OrganizationDetailsPage.jsx
// SuperAdmin → Organization detail with admins, trainers, batches, students
// Route: /superadmin/organizations/:orgId
//        /superadmin/organizations/:orgId/admins
//        /superadmin/organizations/:orgId/trainers
//        /superadmin/organizations/:orgId/batches
//        /superadmin/organizations/:orgId/students
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
  return name
    .split(" ")
    .map((w) => w[0] || "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
function formatDate(dateStr) {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}
const AVATAR_COLORS = [
  ["#6366f1", "#818cf8"],
  ["#8b5cf6", "#a78bfa"],
  ["#ec4899", "#f472b6"],
  ["#14b8a6", "#2dd4bf"],
  ["#f59e0b", "#fbbf24"],
  ["#10b981", "#34d399"],
  ["#3b82f6", "#60a5fa"],
  ["#ef4444", "#f87171"],
];
const avatarColor = (name = "") =>
  AVATAR_COLORS[(name.charCodeAt(0) || 0) % AVATAR_COLORS.length];

const PLAN_CONFIG = {
  free:       { label: "Free",       dot: "#94a3b8", bg: "rgba(148,163,184,0.12)", color: "#64748b" },
  starter:    { label: "Starter",    dot: "#14b8a6", bg: "rgba(20,184,166,0.12)",  color: "#0d9488" },
  pro:        { label: "Pro",        dot: "#8b5cf6", bg: "rgba(139,92,246,0.12)",  color: "#7c3aed" },
  enterprise: { label: "Enterprise", dot: "#f59e0b", bg: "rgba(245,158,11,0.12)",  color: "#d97706" },
};

// ─────────────────────────────────────────────
// SHARED COMPONENTS
// ─────────────────────────────────────────────
const Badge = ({ cfg }) => {
  const c = cfg || STATUS_CONFIG.inactive;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontSize: 11,
        fontWeight: 600,
        padding: "3px 9px",
        borderRadius: 999,
        background: c.bg,
        color: c.color,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: c.dot,
          flexShrink: 0,
        }}
      />
      {c.label}
    </span>
  );
};

const StatMini = ({ value, label, color, dark }) => (
  <div
    style={{
      textAlign: "center",
      padding: "14px 18px",
      borderRadius: 10,
      background: dark ? "rgba(255,255,255,0.04)" : "#f8fafc",
    }}
  >
    <div
      style={{
        fontSize: 26,
        fontWeight: 800,
        color: color || (dark ? "#f1f5f9" : "#0f172a"),
        lineHeight: 1,
      }}
    >
      {value}
    </div>
    <div
      style={{ fontSize: 11, color: dark ? "#64748b" : "#94a3b8", marginTop: 3 }}
    >
      {label}
    </div>
  </div>
);

// ─────────────────────────────────────────────
// TAB BUTTON
// ─────────────────────────────────────────────
const TabBtn = ({ label, active, count, onClick, dark }) => (
  <button
    onClick={onClick}
    style={{
      padding: "7px 14px",
      borderRadius: 7,
      fontSize: 12,
      fontWeight: 600,
      border: "none",
      cursor: "pointer",
      background: active
        ? "#6366f1"
        : dark
        ? "rgba(255,255,255,0.05)"
        : "#f1f5f9",
      color: active ? "#fff" : dark ? "#94a3b8" : "#64748b",
      transition: "all 0.15s",
      display: "flex",
      alignItems: "center",
      gap: 6,
    }}
  >
    {label}
    {count !== undefined && (
      <span
        style={{
          fontSize: 10,
          fontWeight: 700,
          padding: "1px 6px",
          borderRadius: 99,
          background: active
            ? "rgba(255,255,255,0.25)"
            : dark
            ? "rgba(255,255,255,0.10)"
            : "#e5e7eb",
        }}
      >
        {count}
      </span>
    )}
  </button>
);

// ─────────────────────────────────────────────
// PERSON ROW
// ─────────────────────────────────────────────
const PersonRow = ({
  person,
  subtitle,
  badge,
  rightLabel,
  rightSub,
  onViewDetails,
  dark,
  divClr,
  txtMain,
  txtSub,
}) => {
  const [a, b] = avatarColor(person.name || "");
  return (
    <tr
      style={{ borderBottom: `1px solid ${divClr}`, transition: "background 0.1s" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = dark
          ? "rgba(255,255,255,0.03)"
          : "#f8fafc";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
      }}
    >
      <td style={{ padding: "11px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              flexShrink: 0,
              background: `linear-gradient(135deg,${a},${b})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            {initials(person.name || "")}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: txtMain }}>
              {person.name || "—"}
            </div>
            <div style={{ fontSize: 11, color: txtSub }}>
              {subtitle || person.email || "—"}
            </div>
          </div>
        </div>
      </td>
      <td style={{ padding: "11px 16px" }}>{badge}</td>
      <td style={{ padding: "11px 16px" }}>
        {rightLabel && (
          <div style={{ fontSize: 13, fontWeight: 700, color: txtMain }}>
            {rightLabel}
          </div>
        )}
        {rightSub && (
          <div style={{ fontSize: 11, color: txtSub }}>{rightSub}</div>
        )}
      </td>
      <td style={{ padding: "11px 16px", fontSize: 11, color: txtSub }}>
        {formatDate(person.joinedAt || person.createdAt)}
      </td>
      <td style={{ padding: "11px 16px" }}>
        <button
          onClick={onViewDetails}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "5px 10px",
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 600,
            background: dark ? "rgba(99,102,241,0.12)" : "#ede9fe",
            color: dark ? "#a78bfa" : "#6d28d9",
            border: "none",
            cursor: "pointer",
            transition: "all 0.15s",
          }}
        >
          <svg
            width={11}
            height={11}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          View Details
        </button>
      </td>
    </tr>
  );
};

// ─────────────────────────────────────────────
// BATCH ROW
// ─────────────────────────────────────────────
const BatchRow = ({
  batch,
  trainer,
  onViewDetails,
  dark,
  divClr,
  txtMain,
  txtSub,
}) => {
  const statusCfg = STATUS_CONFIG[batch.status] || STATUS_CONFIG.inactive;
  return (
    <tr
      style={{ borderBottom: `1px solid ${divClr}`, transition: "background 0.1s" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = dark
          ? "rgba(255,255,255,0.03)"
          : "#f8fafc";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
      }}
    >
      <td style={{ padding: "11px 16px" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: txtMain }}>
          {batch.name}
        </div>
        <div style={{ fontSize: 11, color: txtSub }}>
          {batch.course || "No course assigned"}
        </div>
      </td>
      <td style={{ padding: "11px 16px" }}>
        <Badge cfg={statusCfg} />
      </td>
      <td style={{ padding: "11px 16px", fontSize: 12, color: txtMain }}>
        {trainer?.name || "—"}
      </td>
      <td style={{ padding: "11px 16px", fontSize: 13, fontWeight: 700, color: txtMain }}>
        {(batch.studentIds || []).length}
      </td>
      <td style={{ padding: "11px 16px", fontSize: 11, color: txtSub }}>
        {formatDate(batch.createdAt)}
      </td>
      <td style={{ padding: "11px 16px" }}>
        <button
          onClick={onViewDetails}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "5px 10px",
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 600,
            background: dark ? "rgba(99,102,241,0.12)" : "#ede9fe",
            color: dark ? "#a78bfa" : "#6d28d9",
            border: "none",
            cursor: "pointer",
            transition: "all 0.15s",
          }}
        >
          <svg
            width={11}
            height={11}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          View Details
        </button>
      </td>
    </tr>
  );
};

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────
// defaultTab prop is set by org-scoped shortcut routes:
//   /organizations/:orgId/admins   → defaultTab="admins"
//   /organizations/:orgId/trainers → defaultTab="trainers"
//   /organizations/:orgId/batches  → defaultTab="batches"
//   /organizations/:orgId/students → defaultTab="students"
// When navigating directly to /organizations/:orgId, defaultTab is undefined
// and the component falls back to "admins".
const OrganizationDetailsPage = ({ defaultTab }) => {
  const { orgId } = useParams();
  const navigate  = useNavigate();
  const { dark }  = useTheme();

  const {
    organizations,
    orgAdmins: allOrgAdmins,
    trainers:  allTrainers,
    batches:   allBatches,
    students:  allStudents,
    getOrgStats,
  } = useSaas();

  // defaultTab prop controls which tab opens when the route is a shortcut URL.
  // Falls back to "admins" when visiting /organizations/:orgId directly.
  const [activeTab, setActiveTab] = useState(defaultTab || "admins");

  // Find this org
  const org = organizations.find((o) => o.id === orgId);

  // Relational filtering — only this org's data
  const orgAdmins = allOrgAdmins.filter((a) => a.organizationId === orgId);
  const trainers  = allTrainers.filter((t) => t.organizationId === orgId);
  const batches   = allBatches.filter((b)  => b.organizationId === orgId);
  const students  = allStudents.filter((s) => s.organizationId === orgId);
  const stats     = org ? getOrgStats(orgId) : {};

  // Design tokens
  const cardBg  = dark ? "rgba(255,255,255,0.03)" : "#ffffff";
  const cardBdr = dark ? "rgba(255,255,255,0.08)" : "#e5e7eb";
  const thBg    = dark ? "rgba(255,255,255,0.04)" : "#f8fafc";
  const thColor = dark ? "#64748b" : "#94a3b8";
  const txtMain = dark ? "#f1f5f9" : "#0f172a";
  const txtSub  = dark ? "#64748b" : "#94a3b8";
  const divClr  = dark ? "rgba(255,255,255,0.06)" : "#f1f5f9";

  if (!org) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: txtSub }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🏢</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: txtMain }}>
          Organization Not Found
        </div>
        <div style={{ fontSize: 13, marginTop: 6 }}>
          The organization you're looking for doesn't exist.
        </div>
        <button
          onClick={() => navigate("/superadmin/organizations")}
          style={{
            marginTop: 20,
            padding: "10px 20px",
            borderRadius: 8,
            background: "#6366f1",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: 13,
          }}
        >
          Back to Organizations
        </button>
      </div>
    );
  }

  const [a, b]    = avatarColor(org.name);
  const statusCfg = STATUS_CONFIG[org.status] || STATUS_CONFIG.inactive;
  const planCfg   = PLAN_CONFIG[org.plan]     || PLAN_CONFIG.starter;

  const tabs = [
    { key: "admins",   label: "Admins",   count: orgAdmins.length },
    { key: "trainers", label: "Trainers", count: trainers.length  },
    { key: "batches",  label: "Batches",  count: batches.length   },
    { key: "students", label: "Students", count: students.length  },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Breadcrumb */}
      <BreadcrumbNavigation
        items={[
          { label: "Organizations", href: "/superadmin/organizations" },
          { label: org.name },
        ]}
      />

      {/* Org Header Card */}
      <div
        style={{
          background: cardBg,
          border: `1px solid ${cardBdr}`,
          borderRadius: 14,
          padding: "24px 28px",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 18, flexWrap: "wrap" }}>
          {/* Avatar */}
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 14,
              background: `linear-gradient(135deg,${a},${b})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 22,
              fontWeight: 800,
              flexShrink: 0,
            }}
          >
            {initials(org.name)}
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}
            >
              <h1
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: txtMain,
                  margin: 0,
                  letterSpacing: "-0.02em",
                }}
              >
                {org.name}
              </h1>
              <Badge cfg={statusCfg} />
              <Badge cfg={planCfg} />
            </div>
            <div style={{ display: "flex", gap: 20, marginTop: 8, flexWrap: "wrap" }}>
              {org.domain       && <span style={{ fontSize: 12, color: txtSub }}>🌐 {org.domain}</span>}
              {org.industry     && <span style={{ fontSize: 12, color: txtSub }}>🏭 {org.industry}</span>}
              {org.location     && <span style={{ fontSize: 12, color: txtSub }}>📍 {org.location}</span>}
              {org.contactEmail && <span style={{ fontSize: 12, color: txtSub }}>✉️ {org.contactEmail}</span>}
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
              <span style={{ fontSize: 11, color: txtSub }}>
                Created {formatDate(org.createdAt)}
              </span>
              {org.planExpiry && (
                <span style={{ fontSize: 11, color: txtSub }}>
                  Expires {formatDate(org.planExpiry)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: 10,
            marginTop: 20,
          }}
        >
          <StatMini value={stats.totalAdmins}    label="Admins"      color="#6366f1" dark={dark} />
          <StatMini value={stats.totalTrainers}  label="Trainers"    color="#8b5cf6" dark={dark} />
          <StatMini value={stats.totalBatches}   label="Batches"     color="#3b82f6" dark={dark} />
          <StatMini value={stats.totalStudents}  label="Students"    color="#14b8a6" dark={dark} />
          <StatMini value={stats.activeStudents} label="Active Stu." color="#10b981" dark={dark} />
          <StatMini value={stats.activeBatches}  label="Active Bat." color="#f59e0b" dark={dark} />
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: "flex", gap: 8 }}>
        {tabs.map((tab) => (
          <TabBtn
            key={tab.key}
            label={tab.label}
            count={tab.count}
            active={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
            dark={dark}
          />
        ))}
      </div>

      {/* Tab Content */}
      <div
        style={{
          background: cardBg,
          border: `1px solid ${cardBdr}`,
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        {/* ── ADMINS TAB ── */}
        {activeTab === "admins" && (
          <>
            <div
              style={{
                padding: "14px 18px",
                borderBottom: `1px solid ${divClr}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 700, color: txtMain }}>
                Organization Admins
              </div>
              <div style={{ fontSize: 12, color: txtSub }}>{orgAdmins.length} total</div>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: thBg }}>
                    {["ADMIN", "STATUS", "TRAINERS", "JOINED", "ACTION"].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "10px 16px",
                          textAlign: "left",
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: "0.08em",
                          color: thColor,
                          borderBottom: `1px solid ${divClr}`,
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orgAdmins.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        style={{
                          textAlign: "center",
                          padding: "40px 0",
                          color: txtSub,
                          fontSize: 13,
                        }}
                      >
                        No admins for this organization
                      </td>
                    </tr>
                  ) : (
                    orgAdmins.map((admin) => {
                      const adminTrainers = trainers.filter(
                        (t) => t.adminId === admin.id
                      );
                      return (
                        <PersonRow
                          key={admin.id}
                          person={admin}
                          badge={
                            <Badge
                              cfg={
                                STATUS_CONFIG[admin.status] ||
                                STATUS_CONFIG.inactive
                              }
                            />
                          }
                          rightLabel={`${adminTrainers.length} trainers`}
                          rightSub={
                            admin.permissions
                              ? "Custom perms"
                              : "Default perms"
                          }
                          onViewDetails={() =>
                            navigate(
                              `/superadmin/organizations/${orgId}/admins/${admin.id}`
                            )
                          }
                          dark={dark}
                          divClr={divClr}
                          txtMain={txtMain}
                          txtSub={txtSub}
                        />
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ── TRAINERS TAB ── */}
        {activeTab === "trainers" && (
          <>
            <div
              style={{
                padding: "14px 18px",
                borderBottom: `1px solid ${divClr}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 700, color: txtMain }}>
                Trainers
              </div>
              <div style={{ fontSize: 12, color: txtSub }}>{trainers.length} total</div>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: thBg }}>
                    {["TRAINER", "STATUS", "BATCHES / STUDENTS", "JOINED", "ACTION"].map(
                      (h) => (
                        <th
                          key={h}
                          style={{
                            padding: "10px 16px",
                            textAlign: "left",
                            fontSize: 10,
                            fontWeight: 700,
                            letterSpacing: "0.08em",
                            color: thColor,
                            borderBottom: `1px solid ${divClr}`,
                          }}
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {trainers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        style={{
                          textAlign: "center",
                          padding: "40px 0",
                          color: txtSub,
                          fontSize: 13,
                        }}
                      >
                        No trainers for this organization
                      </td>
                    </tr>
                  ) : (
                    trainers.map((trainer) => {
                      const trainerBatches  = batches.filter(
                        (b) => b.trainerId === trainer.id
                      );
                      const trainerStudents = students.filter(
                        (s) => s.trainerId === trainer.id
                      );
                      return (
                        <PersonRow
                          key={trainer.id}
                          person={trainer}
                          subtitle={trainer.specialization || trainer.email}
                          badge={
                            <Badge
                              cfg={
                                STATUS_CONFIG[trainer.status] ||
                                STATUS_CONFIG.inactive
                              }
                            />
                          }
                          rightLabel={`${trainerBatches.length} batches`}
                          rightSub={`${trainerStudents.length} students`}
                          onViewDetails={() =>
                            navigate(`/superadmin/trainers/${trainer.id}`)
                          }
                          dark={dark}
                          divClr={divClr}
                          txtMain={txtMain}
                          txtSub={txtSub}
                        />
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ── BATCHES TAB ── */}
        {activeTab === "batches" && (
          <>
            <div
              style={{
                padding: "14px 18px",
                borderBottom: `1px solid ${divClr}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 700, color: txtMain }}>
                Batches
              </div>
              <div style={{ fontSize: 12, color: txtSub }}>{batches.length} total</div>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: thBg }}>
                    {["BATCH", "STATUS", "TRAINER", "STUDENTS", "CREATED", "ACTION"].map(
                      (h) => (
                        <th
                          key={h}
                          style={{
                            padding: "10px 16px",
                            textAlign: "left",
                            fontSize: 10,
                            fontWeight: 700,
                            letterSpacing: "0.08em",
                            color: thColor,
                            borderBottom: `1px solid ${divClr}`,
                          }}
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {batches.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        style={{
                          textAlign: "center",
                          padding: "40px 0",
                          color: txtSub,
                          fontSize: 13,
                        }}
                      >
                        No batches for this organization
                      </td>
                    </tr>
                  ) : (
                    batches.map((batch) => {
                      const trainer = trainers.find(
                        (t) => t.id === batch.trainerId
                      );
                      return (
                        <BatchRow
                          key={batch.id}
                          batch={batch}
                          trainer={trainer}
                          onViewDetails={() =>
                            navigate(`/superadmin/batches/${batch.id}`)
                          }
                          dark={dark}
                          divClr={divClr}
                          txtMain={txtMain}
                          txtSub={txtSub}
                        />
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ── STUDENTS TAB ── */}
        {activeTab === "students" && (
          <>
            <div
              style={{
                padding: "14px 18px",
                borderBottom: `1px solid ${divClr}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 700, color: txtMain }}>
                Students
              </div>
              <div style={{ fontSize: 12, color: txtSub }}>{students.length} total</div>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: thBg }}>
                    {["STUDENT", "STATUS", "BATCH / TRAINER", "JOINED", "ACTION"].map(
                      (h) => (
                        <th
                          key={h}
                          style={{
                            padding: "10px 16px",
                            textAlign: "left",
                            fontSize: 10,
                            fontWeight: 700,
                            letterSpacing: "0.08em",
                            color: thColor,
                            borderBottom: `1px solid ${divClr}`,
                          }}
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {students.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        style={{
                          textAlign: "center",
                          padding: "40px 0",
                          color: txtSub,
                          fontSize: 13,
                        }}
                      >
                        No students for this organization
                      </td>
                    </tr>
                  ) : (
                    students.map((student) => {
                      const batch   = batches.find((b) => b.id === student.batchId);
                      const trainer = trainers.find((t) => t.id === student.trainerId);
                      return (
                        <PersonRow
                          key={student.id}
                          person={student}
                          badge={
                            <Badge
                              cfg={
                                STATUS_CONFIG[student.status] ||
                                STATUS_CONFIG.inactive
                              }
                            />
                          }
                          rightLabel={batch?.name   || "No batch"}
                          rightSub={trainer?.name   || "No trainer"}
                          onViewDetails={() =>
                            navigate(`/superadmin/students/${student.id}`)
                          }
                          dark={dark}
                          divClr={divClr}
                          txtMain={txtMain}
                          txtSub={txtSub}
                        />
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrganizationDetailsPage;