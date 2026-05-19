// // pages/TrainerControlPage.jsx
// import React, { useState } from "react";
// import { useUserManagement } from "../context/UserManagementContext";
// import { ROLES, USER_STATUS } from "../constants/permissions";
// import { useTheme } from "../context/ThemeContext";
// import UserTable from "../common/UserTable";
// import UserPanel from "../common/UserPanel";
// import ConfirmDialog from "../common/ConfirmDialog";
// import PageHeader from "../common/PageHeader";

// const TrainerControlPage = () => {
//   const { trainers, updateUserStatus, createUser, updateUser, deleteUser, approveUser } =
//     useUserManagement();
//   const { dark } = useTheme();

//   const [panel,   setPanel]   = useState({ open: false, data: null });
//   const [confirm, setConfirm] = useState({ open: false, action: null, user: null });

//   // ── Computed ──────────────────────────────────────────────────────────────
//   const pendingTrainers = trainers.filter((t) => t.status === USER_STATUS.PENDING);
//   const avgRating = trainers.length
//     ? (trainers.reduce((a, t) => a + parseFloat(t.rating || 0), 0) / trainers.length).toFixed(1)
//     : "0.0";

//   // ── Actions ───────────────────────────────────────────────────────────────
//   const handleAction = (action, user) => {
//     if (action === "edit")     setPanel({ open: true, data: user });
//     else if (action === "delete")   setConfirm({ open: true, action: "delete",  user });
//     else if (action === "suspend")  setConfirm({ open: true, action: "suspend", user });
//     else if (action === "activate"   || action === "unsuspend")
//       updateUserStatus(user.id, USER_STATUS.ACTIVE,   user.role);
//     else if (action === "deactivate")
//       updateUserStatus(user.id, USER_STATUS.INACTIVE, user.role);
//   };

//   // ── Theme ─────────────────────────────────────────────────────────────────
//   const cardBg    = dark ? "bg-white/[0.03] border-white/[0.08]" : "bg-gray-50 border-gray-200";
//   const labelText = dark ? "text-slate-400"                       : "text-gray-500";
//   const tableBg   = dark ? "bg-white/[0.02] border-white/[0.08]" : "bg-white border-gray-200";

//   // ── Extra columns ─────────────────────────────────────────────────────────
//   const extraColumns = [
//     {
//       key: "specialization",
//       label: "Specialization",
//       render: (u) => (
//         <span className={`text-xs px-2 py-1 rounded-full font-medium ${
//           dark
//             ? "bg-violet-500/10 text-violet-400"
//             : "bg-violet-100 text-violet-600"
//         }`}>
//           {u.specialization || "General"}
//         </span>
//       ),
//     },
//     {
//       key: "totalStudents",
//       label: "Students",
//       render: (u) => (
//         <span className={`font-semibold text-sm ${dark ? "text-white" : "text-gray-800"}`}>
//           {u.totalStudents ?? 0}
//         </span>
//       ),
//     },
//     {
//       key: "rating",
//       label: "Rating",
//       render: (u) => (
//         <span className="flex items-center gap-1 text-amber-400 font-semibold text-sm">
//           ⭐ {u.rating ?? "N/A"}
//         </span>
//       ),
//     },
//   ];

//   return (
//     <>
//       <div>
//         <PageHeader
//           title={
//             <span style={{ color: dark ? "#f1f5f9" : "#0f172a" }}>
//               Trainer Management
//             </span>
//           }
//           subtitle="Approve, monitor, and manage all trainers"
//           badge={trainers.length}
//           actions={
//             <button
//               onClick={() => setPanel({ open: true, data: null })}
//               className="
//                 flex items-center gap-2 px-4 py-2 rounded-lg
//                 bg-violet-500 hover:bg-violet-600 text-white text-sm font-semibold
//                 transition-colors duration-150
//               "
//             >
//               <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
//                 <path d="M12 5v14M5 12h14" />
//               </svg>
//               Add Trainer
//             </button>
//           }
//         />

//         {/* ── Pending Approvals Banner ── */}
//         {pendingTrainers.length > 0 && (
//           <div className={`
//             mb-6 rounded-xl border px-5 py-4
//             flex items-center justify-between gap-4
//             ${dark
//               ? "border-amber-500/20 bg-amber-500/[0.05]"
//               : "border-amber-300 bg-amber-50"
//             }
//           `}>
//             <div className="flex items-center gap-3">
//               <span className="text-2xl">⏳</span>
//               <div>
//                 <p className={`font-semibold text-sm ${dark ? "text-white" : "text-gray-800"}`}>
//                   {pendingTrainers.length} trainer{pendingTrainers.length > 1 ? "s" : ""} awaiting approval
//                 </p>
//                 <p className={`text-xs mt-0.5 ${dark ? "text-slate-400" : "text-gray-500"}`}>
//                   Review applications to grant platform access
//                 </p>
//               </div>
//             </div>
//             <div className="flex gap-2 flex-shrink-0">
//               {pendingTrainers.slice(0, 2).map((t) => (
//                 <button
//                   key={t.id}
//                   onClick={() => approveUser(t.id)}
//                   className="
//                     px-3 py-1.5 text-xs font-semibold rounded-lg
//                     bg-emerald-500 hover:bg-emerald-600 text-white
//                     transition-colors duration-150
//                   "
//                 >
//                   Approve {t.name.split(" ")[0]}
//                 </button>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* ── Stats ── */}
//         <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
//           {[
//             { label: "Total Trainers",   value: trainers.length,                                              color: "text-violet-500" },
//             { label: "Active",           value: trainers.filter((t) => t.status === USER_STATUS.ACTIVE).length, color: "text-emerald-500" },
//             { label: "Pending Approval", value: pendingTrainers.length,                                       color: "text-amber-500" },
//             { label: "Avg Rating",       value: avgRating,                                                    color: "text-blue-400" },
//           ].map((s) => (
//             <div key={s.label} className={`rounded-xl border px-4 py-3 ${cardBg}`}>
//               <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
//               <div className={`text-xs font-medium mt-0.5 ${labelText}`}>{s.label}</div>
//             </div>
//           ))}
//         </div>

//         {/* ── Table ── */}
//         <div className={`rounded-xl border p-4 ${tableBg}`}>
//           <UserTable
//             users={trainers}
//             onAction={handleAction}
//             extraColumns={extraColumns}
//           />
//         </div>
//       </div>

//       {/* ── CRM Slide Panel ── */}
//       <UserPanel
//         open={panel.open}
//         onClose={() => setPanel({ open: false, data: null })}
//         onSubmit={(data) => {
//           panel.data
//             ? updateUser({ ...panel.data, ...data })
//             : createUser({ ...data, role: ROLES.TRAINER });
//           setPanel({ open: false, data: null });
//         }}
//         initialData={panel.data}
//         defaultRole={ROLES.TRAINER}
//       />

//       {/* ── Confirm Dialog ── */}
//       <ConfirmDialog
//         open={confirm.open}
//         title={confirm.action === "delete" ? "Remove Trainer?" : "Suspend Trainer?"}
//         message={`${confirm.action === "delete" ? "Permanently remove" : "Suspend"} ${confirm.user?.name}?`}
//         confirmLabel={confirm.action === "delete" ? "Remove" : "Suspend"}
//         variant={confirm.action === "delete" ? "danger" : "warning"}
//         onConfirm={() => {
//           if (confirm.action === "delete")  deleteUser(confirm.user.id, ROLES.TRAINER);
//           if (confirm.action === "suspend") updateUserStatus(confirm.user.id, USER_STATUS.SUSPENDED, ROLES.TRAINER);
//           setConfirm({ open: false });
//         }}
//         onCancel={() => setConfirm({ open: false })}
//       />
//     </>
//   );
// };

// export default TrainerControlPage;



















// pages/TrainerControlPage.jsx
import React, { useState, useEffect } from "react";
import { useUserManagement } from "../context/UserManagementContext";
import { ROLES, USER_STATUS } from "../constants/permissions";
import { useTheme } from "../context/ThemeContext";
import ConfirmDialog from "../common/ConfirmDialog";

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
function genPassword(len = 12) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%";
  return Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

// ─────────────────────────────────────────────
// AVATAR COLORS
// ─────────────────────────────────────────────
const AVATAR_COLORS = [
  ["#6366f1","#818cf8"], ["#8b5cf6","#a78bfa"], ["#ec4899","#f472b6"],
  ["#14b8a6","#2dd4bf"], ["#f59e0b","#fbbf24"], ["#10b981","#34d399"],
  ["#3b82f6","#60a5fa"], ["#ef4444","#f87171"],
];
function avatarColor(name = "") {
  const idx = (name.charCodeAt(0) || 0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

// ─────────────────────────────────────────────
// BADGE CONFIGS
// ─────────────────────────────────────────────
const STATUS_CONFIG = {
  active:    { label: "Active",    dot: "#10b981", bg: "rgba(16,185,129,0.12)",  color: "#059669" },
  inactive:  { label: "Inactive",  dot: "#94a3b8", bg: "rgba(148,163,184,0.12)", color: "#64748b" },
  suspended: { label: "Suspended", dot: "#ef4444", bg: "rgba(239,68,68,0.12)",   color: "#dc2626" },
  pending:   { label: "Pending",   dot: "#f59e0b", bg: "rgba(245,158,11,0.12)",  color: "#d97706" },
};

// ─────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────
const Badge = ({ cfg }) => {
  const c = cfg || STATUS_CONFIG.inactive;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      fontSize: 11, fontWeight: 600,
      padding: "3px 9px", borderRadius: 999,
      background: c.bg, color: c.color,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.dot, flexShrink: 0 }} />
      {c.label}
    </span>
  );
};

const StatCard = ({ value, title, sub, grad, onClick, active }) => (
  <button
    onClick={onClick}
    style={{
      flex: 1, minWidth: 0, textAlign: "left",
      background: grad, borderRadius: 12, padding: "18px 22px",
      border: active ? "2px solid rgba(255,255,255,0.6)" : "2px solid transparent",
      cursor: "pointer", position: "relative", overflow: "hidden",
      transition: "transform 0.18s, box-shadow 0.18s",
      boxShadow: active ? "0 8px 24px rgba(0,0,0,0.18)" : "0 2px 8px rgba(0,0,0,0.10)",
    }}
    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 28px rgba(0,0,0,0.18)"; }}
    onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = active ? "0 8px 24px rgba(0,0,0,0.18)" : "0 2px 8px rgba(0,0,0,0.10)"; }}
  >
    <div style={{ position: "absolute", right: -20, top: -20, width: 90, height: 90, borderRadius: "50%", background: "rgba(255,255,255,0.12)" }} />
    <div style={{ position: "absolute", right: 20, bottom: -30, width: 60, height: 60, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
    <div style={{ fontSize: 30, fontWeight: 800, color: "#fff", lineHeight: 1, position: "relative" }}>{value}</div>
    <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.9)", marginTop: 4, position: "relative" }}>{title}</div>
    {sub && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", marginTop: 2, position: "relative" }}>{sub}</div>}
  </button>
);

const IconBtn = ({ title, onClick, children, hoverColor = "#6366f1", hoverBg = "rgba(99,102,241,0.10)" }) => {
  const [hov, setHov] = useState(false);
  return (
    <button title={title} onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        width: 28, height: 28, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
        background: hov ? hoverBg : "transparent", border: "none", cursor: "pointer",
        color: hov ? hoverColor : "#94a3b8", transition: "all 0.15s", flexShrink: 0,
      }}
    >
      {children}
    </button>
  );
};

// ─────────────────────────────────────────────
// INPUT STYLE
// ─────────────────────────────────────────────
const inputStyle = (dark) => ({
  width: "100%", boxSizing: "border-box",
  padding: "8px 11px", borderRadius: 7, fontSize: 13,
  border: dark ? "1px solid rgba(255,255,255,0.12)" : "1px solid #d1d5db",
  background: dark ? "rgba(255,255,255,0.04)" : "#fff",
  color: dark ? "#f1f5f9" : "#0f172a",
  outline: "none",
});

// ─────────────────────────────────────────────
// ADD TRAINER PANEL
// ─────────────────────────────────────────────
const AddTrainerPanel = ({ open, onClose, onSubmit, dark }) => {
  const empty = { firstName: "", lastName: "", email: "", password: genPassword(), specialization: "" };
  const [form, setForm] = useState(empty);
  const [showPwd, setShowPwd] = useState(false);
  const [copied, setCopied] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (open) setForm({ ...empty, password: genPassword() }); }, [open]);

  const copy = async (key, val) => {
    await navigator.clipboard.writeText(val).catch(() => {});
    setCopied((c) => ({ ...c, [key]: true }));
    setTimeout(() => setCopied((c) => ({ ...c, [key]: false })), 1500);
  };
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.firstName.trim() || !form.email.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    onSubmit({
      name: `${form.firstName.trim()} ${form.lastName.trim()}`.trim(),
      email: form.email,
      specialization: form.specialization,
      role: ROLES.TRAINER,
      status: USER_STATUS.ACTIVE,
      totalStudents: 0,
      rating: null,
      joinedAt: new Date().toISOString(),
    });
    setLoading(false);
    onClose();
  };

  const descColor = dark ? "#64748b" : "#9ca3af";
  const panelBg   = dark ? "#0f1117" : "#fff";
  const panelBdr  = dark ? "1px solid rgba(255,255,255,0.10)" : "1px solid #e5e7eb";
  const labelCls  = { fontSize: 11, fontWeight: 600, color: dark ? "#94a3b8" : "#6b7280", marginBottom: 5, display: "block" };

  if (!open) return null;
  return (
    <div style={{
      width: 280, flexShrink: 0, background: panelBg, border: panelBdr,
      borderRadius: 12, padding: "18px 18px 20px",
      display: "flex", flexDirection: "column", gap: 14, alignSelf: "flex-start",
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: dark ? "#f1f5f9" : "#0f172a" }}>Add Trainer</div>
          <div style={{ fontSize: 11, color: descColor, marginTop: 2 }}>Register a new trainer</div>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: dark ? "#64748b" : "#9ca3af", display: "flex" }}>
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>

      {/* Name row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <div>
          <label style={labelCls}>First name</label>
          <input style={inputStyle(dark)} placeholder="Arjun" value={form.firstName} onChange={set("firstName")} />
        </div>
        <div>
          <label style={labelCls}>Last name</label>
          <input style={inputStyle(dark)} placeholder="Mehta" value={form.lastName} onChange={set("lastName")} />
        </div>
      </div>

      {/* Email */}
      <div>
        <label style={labelCls}>Email address</label>
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <input style={{ ...inputStyle(dark), paddingRight: 52 }} type="email" placeholder="arjun@example.com" value={form.email} onChange={set("email")} />
          <button onClick={() => copy("email", form.email)} style={{ position: "absolute", right: 6, fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 4, cursor: "pointer", background: dark ? "rgba(139,92,246,0.18)" : "#ede9fe", color: dark ? "#a78bfa" : "#7c3aed", border: "none" }}>
            {copied.email ? "✓" : "Copy"}
          </button>
        </div>
      </div>

      {/* Password */}
      <div>
        <label style={labelCls}>Password</label>
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <input style={{ ...inputStyle(dark), paddingRight: 82, letterSpacing: showPwd ? "normal" : "2px" }} type={showPwd ? "text" : "password"} value={form.password} onChange={set("password")} />
          <div style={{ position: "absolute", right: 6, display: "flex", gap: 4 }}>
            <button onClick={() => setShowPwd((v) => !v)} style={{ background: "none", border: "none", cursor: "pointer", color: dark ? "#64748b" : "#9ca3af", display: "flex" }}>
              {showPwd
                ? <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                : <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              }
            </button>
            <button onClick={() => copy("pwd", form.password)} style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 4, cursor: "pointer", background: dark ? "rgba(139,92,246,0.18)" : "#ede9fe", color: dark ? "#a78bfa" : "#7c3aed", border: "none" }}>
              {copied.pwd ? "✓" : "Copy"}
            </button>
          </div>
        </div>
        <button onClick={() => setForm((f) => ({ ...f, password: genPassword() }))} style={{ fontSize: 10, color: dark ? "#8b5cf6" : "#7c3aed", background: "none", border: "none", cursor: "pointer", marginTop: 4, padding: 0 }}>
          ↺ Generate new password
        </button>
      </div>

      {/* Specialization */}
      <div>
        <label style={labelCls}>Specialization (optional)</label>
        <input style={inputStyle(dark)} placeholder="e.g. React, Data Science" value={form.specialization} onChange={set("specialization")} />
        <div style={{ fontSize: 11, color: descColor, marginTop: 5 }}>Trainer's area of expertise on the platform.</div>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading || !form.firstName.trim() || !form.email.trim()}
        style={{
          width: "100%", padding: "10px 0", borderRadius: 8,
          background: loading ? "#4b5563" : "linear-gradient(135deg, #7c3aed, #8b5cf6)",
          color: "#fff", fontWeight: 700, fontSize: 13, border: "none",
          cursor: loading ? "not-allowed" : "pointer", marginTop: 2,
        }}
      >
        {loading ? "Adding…" : "Add Trainer"}
      </button>
    </div>
  );
};

// ─────────────────────────────────────────────
// EDIT PANEL
// ─────────────────────────────────────────────
const EditPanel = ({ user, dark, onClose, onSave }) => {
  const [form, setForm] = useState({ name: "", email: "", role: "trainer", status: "active", ...(user || {}) });
  useEffect(() => { if (user) setForm({ ...user }); }, [user]);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const descColor = dark ? "#64748b" : "#9ca3af";
  const panelBg   = dark ? "#0f1117" : "#fff";
  const labelCls  = { fontSize: 11, fontWeight: 600, color: dark ? "#94a3b8" : "#6b7280", marginBottom: 5, display: "block" };

  if (!user) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "flex-end" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ width: 320, height: "100%", background: panelBg, borderLeft: dark ? "1px solid rgba(255,255,255,0.10)" : "1px solid #e5e7eb", padding: "24px 22px", display: "flex", flexDirection: "column", gap: 16, overflowY: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: dark ? "#f1f5f9" : "#0f172a" }}>Edit Trainer</div>
            <div style={{ fontSize: 11, color: descColor, marginTop: 2 }}>Update trainer details</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: dark ? "#64748b" : "#9ca3af", display: "flex" }}>
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        {/* Avatar */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {(() => { const [a, b] = avatarColor(form.name); return (
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: `linear-gradient(135deg,${a},${b})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14, fontWeight: 700, flexShrink: 0 }}>
              {initials(form.name)}
            </div>
          ); })()}
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: dark ? "#f1f5f9" : "#0f172a" }}>{form.name}</div>
            <div style={{ fontSize: 11, color: descColor }}>{form.email}</div>
          </div>
        </div>
        <div style={{ borderTop: dark ? "1px solid rgba(255,255,255,0.07)" : "1px solid #f1f5f9" }} />
        <div><label style={labelCls}>Full Name</label><input style={inputStyle(dark)} value={form.name} onChange={set("name")} /></div>
        <div><label style={labelCls}>Email</label><input style={inputStyle(dark)} type="email" value={form.email} onChange={set("email")} /></div>
        <div>
          <label style={labelCls}>Status</label>
          <select style={{ ...inputStyle(dark), appearance: "none", cursor: "pointer" }} value={form.status} onChange={set("status")}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
            <option value="pending">Pending</option>
          </select>
        </div>
        <div><label style={labelCls}>Specialization</label><input style={inputStyle(dark)} value={form.specialization || ""} onChange={set("specialization")} placeholder="e.g. React, Node.js" /></div>
        <div><label style={labelCls}>Rating</label><input style={inputStyle(dark)} type="number" min={0} max={5} step={0.1} value={form.rating || ""} onChange={set("rating")} placeholder="0.0 – 5.0" /></div>
        <button onClick={() => { onSave(form); onClose(); }} style={{ width: "100%", padding: "10px 0", borderRadius: 8, marginTop: 4, background: "linear-gradient(135deg, #7c3aed, #8b5cf6)", color: "#fff", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer" }}>
          Save Changes
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// RATING STARS
// ─────────────────────────────────────────────
const RatingDisplay = ({ value, dark }) => {
  const rating = parseFloat(value) || 0;
  const color = rating >= 4 ? "#10b981" : rating >= 2.5 ? "#f59e0b" : "#ef4444";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
      <span style={{ fontSize: 13 }}>⭐</span>
      <span style={{ fontSize: 12, fontWeight: 700, color: value ? color : (dark ? "#475569" : "#cbd5e1") }}>
        {value ? parseFloat(value).toFixed(1) : "N/A"}
      </span>
    </div>
  );
};

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────
const TrainerControlPage = () => {
  const { trainers = [], updateUserStatus, createUser, updateUser, deleteUser, approveUser } = useUserManagement();
  const { dark } = useTheme();

  const [showAdd,  setShowAdd]  = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [confirm,  setConfirm]  = useState({ open: false, action: null, user: null });
  const [search,   setSearch]   = useState("");
  const [filter,   setFilter]   = useState("all");

  // tokens
  const cardBg  = dark ? "rgba(255,255,255,0.03)" : "#ffffff";
  const cardBdr = dark ? "rgba(255,255,255,0.08)" : "#e5e7eb";
  const thBg    = dark ? "rgba(255,255,255,0.04)" : "#f8fafc";
  const thColor = dark ? "#64748b"                : "#94a3b8";
  const rowHov  = dark ? "rgba(255,255,255,0.03)" : "#f8fafc";
  const txtMain = dark ? "#f1f5f9" : "#0f172a";
  const txtSub  = dark ? "#64748b" : "#94a3b8";
  const divClr  = dark ? "rgba(255,255,255,0.06)" : "#f1f5f9";

  // stats
  const total         = trainers.length;
  const active        = trainers.filter((t) => t.status === USER_STATUS.ACTIVE).length;
  const pending       = trainers.filter((t) => t.status === USER_STATUS.PENDING).length;
  const pendingTrainers = trainers.filter((t) => t.status === USER_STATUS.PENDING);
  const avgRating     = total
    ? (trainers.reduce((a, t) => a + parseFloat(t.rating || 0), 0) / total).toFixed(1)
    : "0.0";

  const statCards = [
    { value: total,     title: "Total Trainers",   sub: "All registered",      grad: "linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)", filterKey: "all"      },
    { value: active,    title: "Active",            sub: `${pending} pending`,  grad: "linear-gradient(135deg, #059669 0%, #10b981 100%)", filterKey: "active"   },
    { value: avgRating, title: "Avg Rating",        sub: "Across all trainers", grad: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)", filterKey: "all"      },
    { value: pending,   title: "Pending Approval",  sub: "Awaiting review",     grad: "linear-gradient(135deg, #d97706 0%, #f59e0b 100%)", filterKey: "pending"  },
  ];

  const tabs = [
    { key: "all",      label: "All",      count: total },
    { key: "active",   label: "Active",   count: active },
    { key: "pending",  label: "Pending",  count: pending },
    { key: "inactive", label: "Inactive", count: trainers.filter((t) => t.status === USER_STATUS.INACTIVE).length },
    { key: "suspended",label: "Suspended",count: trainers.filter((t) => t.status === USER_STATUS.SUSPENDED).length },
  ];

  const filtered = trainers.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch = !q || (u.name || "").toLowerCase().includes(q) || (u.email || "").toLowerCase().includes(q);
    const matchFilter =
      filter === "all"       ? true :
      filter === "active"    ? u.status === USER_STATUS.ACTIVE :
      filter === "pending"   ? u.status === USER_STATUS.PENDING :
      filter === "inactive"  ? u.status === USER_STATUS.INACTIVE :
      filter === "suspended" ? u.status === USER_STATUS.SUSPENDED :
      true;
    return matchSearch && matchFilter;
  });

  const handleAction = (action, user) => {
    if (action === "edit")                             setEditUser(user);
    else if (action === "delete")                      setConfirm({ open: true, action: "delete",  user });
    else if (action === "suspend")                     setConfirm({ open: true, action: "suspend", user });
    else if (action === "activate" || action === "unsuspend") updateUserStatus(user.id, USER_STATUS.ACTIVE,   user.role);
    else if (action === "deactivate")                  updateUserStatus(user.id, USER_STATUS.INACTIVE, user.role);
  };

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Header */}
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: txtMain, margin: 0, letterSpacing: "-0.02em" }}>
            Trainer Management
          </h1>
          <p style={{ fontSize: 12, color: txtSub, marginTop: 3 }}>
            {total} trainers · Approve, monitor, and manage all trainers
          </p>
        </div>

        {/* Stat Cards */}
        <div style={{ display: "flex", gap: 12 }}>
          {statCards.map((c, i) => (
            <StatCard key={i} value={c.value} title={c.title} sub={c.sub} grad={c.grad}
              active={filter === c.filterKey && c.filterKey !== "all"}
              onClick={() => setFilter(c.filterKey)} />
          ))}
        </div>

        {/* Pending Approvals Banner */}
        {pendingTrainers.length > 0 && (
          <div style={{
            borderRadius: 12, padding: "14px 18px",
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap",
            border: dark ? "1px solid rgba(245,158,11,0.20)" : "1px solid #fcd34d",
            background: dark ? "rgba(245,158,11,0.05)" : "#fffbeb",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 20 }}>⏳</span>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: dark ? "#f1f5f9" : "#0f172a", margin: 0 }}>
                  {pendingTrainers.length} trainer{pendingTrainers.length > 1 ? "s" : ""} awaiting approval
                </p>
                <p style={{ fontSize: 11, color: txtSub, margin: "2px 0 0" }}>
                  Review applications to grant platform access
                </p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              {pendingTrainers.slice(0, 2).map((t) => (
                <button key={t.id} onClick={() => approveUser(t.id)} style={{
                  padding: "6px 12px", fontSize: 12, fontWeight: 600, borderRadius: 8,
                  background: "#10b981", color: "#fff", border: "none", cursor: "pointer",
                }}>
                  Approve {t.name.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={() => setShowAdd((v) => !v)}
            style={{
              display: "flex", alignItems: "center", gap: 6, padding: "8px 14px",
              borderRadius: 8, fontSize: 13, fontWeight: 600,
              background: showAdd ? "#6d28d9" : "#7c3aed",
              color: "#fff", border: "none", cursor: "pointer", transition: "background 0.15s",
            }}
          >
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M12 5v14M5 12h14"/></svg>
            {showAdd ? "Cancel" : "Add Trainer"}
          </button>
          <button
            onClick={() => window.location.reload()}
            style={{
              display: "flex", alignItems: "center", gap: 6, padding: "8px 14px",
              borderRadius: 8, fontSize: 13, fontWeight: 600,
              background: dark ? "rgba(255,255,255,0.06)" : "#f1f5f9",
              color: dark ? "#94a3b8" : "#64748b",
              border: dark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #e5e7eb",
              cursor: "pointer",
            }}
          >
            <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>
            Refresh
          </button>
        </div>

        {/* Content: [Add Panel] + [Table] */}
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>

          {/* Add Panel */}
          {showAdd && (
            <AddTrainerPanel open={showAdd} dark={dark}
              onClose={() => setShowAdd(false)}
              onSubmit={(data) => { createUser(data); setShowAdd(false); }}
            />
          )}

          {/* Table card */}
          <div style={{ flex: 1, minWidth: 0, background: cardBg, border: `1px solid ${cardBdr}`, borderRadius: 12, overflow: "hidden" }}>

            {/* Search + tabs */}
            <div style={{ padding: "12px 16px", borderBottom: `1px solid ${divClr}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ position: "absolute", left: 10, color: txtSub }}>
                  <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>
                <input placeholder="Search trainers..." value={search} onChange={(e) => setSearch(e.target.value)}
                  style={{ paddingLeft: 32, paddingRight: 12, paddingTop: 7, paddingBottom: 7, borderRadius: 7, fontSize: 12, border: dark ? "1px solid rgba(255,255,255,0.10)" : "1px solid #e5e7eb", background: dark ? "rgba(255,255,255,0.04)" : "#f8fafc", color: dark ? "#f1f5f9" : "#0f172a", outline: "none", width: 190 }} />
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {tabs.map((tab) => {
                  const isActive = filter === tab.key;
                  return (
                    <button key={tab.key} onClick={() => setFilter(tab.key)} style={{ padding: "5px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer", background: isActive ? "#7c3aed" : (dark ? "rgba(255,255,255,0.05)" : "#f1f5f9"), color: isActive ? "#fff" : (dark ? "#94a3b8" : "#64748b"), transition: "all 0.15s" }}>
                      {tab.label} <span style={{ opacity: 0.7 }}>{tab.count}</span>
                    </button>
                  );
                })}
              </div>
              <span style={{ fontSize: 11, color: txtSub, marginLeft: "auto" }}>{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
            </div>

            {/* Table */}
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: thBg }}>
                    {["TRAINER", "STATUS", "SPECIALIZATION", "STUDENTS", "RATING", "JOINED", "ACTIONS"].map((h) => (
                      <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: thColor, borderBottom: `1px solid ${divClr}`, whiteSpace: "nowrap" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={7} style={{ textAlign: "center", padding: "48px 0", color: txtSub, fontSize: 13 }}>No trainers found</td></tr>
                  ) : filtered.map((user, idx) => {
                    const [a, b] = avatarColor(user.name);
                    const statusCfg = STATUS_CONFIG[user.status] || STATUS_CONFIG.inactive;
                    return (
                      <tr key={user.id || idx} style={{ borderBottom: `1px solid ${divClr}`, transition: "background 0.1s" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = rowHov; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>

                        {/* Trainer */}
                        <td style={{ padding: "12px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 34, height: 34, borderRadius: "50%", flexShrink: 0, background: `linear-gradient(135deg,${a},${b})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 700 }}>
                              {initials(user.name)}
                            </div>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 600, color: txtMain }}>{user.name || "—"}</div>
                              <div style={{ fontSize: 11, color: txtSub }}>{user.email || "—"}</div>
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td style={{ padding: "12px 16px" }}><Badge cfg={statusCfg} /></td>

                        {/* Specialization */}
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{
                            fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 999,
                            background: dark ? "rgba(139,92,246,0.12)" : "#ede9fe",
                            color: dark ? "#a78bfa" : "#7c3aed",
                          }}>
                            {user.specialization || "General"}
                          </span>
                        </td>

                        {/* Students */}
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: txtMain }}>{user.totalStudents ?? 0}</span>
                        </td>

                        {/* Rating */}
                        <td style={{ padding: "12px 16px" }}>
                          <RatingDisplay value={user.rating} dark={dark} />
                        </td>

                        {/* Joined */}
                        <td style={{ padding: "12px 16px", fontSize: 12, color: txtSub, whiteSpace: "nowrap" }}>
                          {formatDate(user.joinedAt || user.createdAt)}
                        </td>

                        {/* Actions */}
                        <td style={{ padding: "12px 16px" }}>
                          <div style={{ display: "flex", gap: 2 }}>
                            <IconBtn title="Edit" onClick={() => handleAction("edit", user)}>
                              <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                            </IconBtn>
                            <IconBtn title="Copy email" onClick={() => navigator.clipboard.writeText(user.email || "").catch(() => {})}>
                              <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                            </IconBtn>
                            {user.status === USER_STATUS.PENDING && (
                              <IconBtn title="Approve" onClick={() => approveUser(user.id)} hoverColor="#10b981" hoverBg="rgba(16,185,129,0.10)">
                                <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="20 6 9 17 4 12"/></svg>
                              </IconBtn>
                            )}
                            <IconBtn
                              title={user.status === USER_STATUS.ACTIVE ? "Suspend" : "Activate"}
                              onClick={() => handleAction(user.status === USER_STATUS.ACTIVE ? "suspend" : "activate", user)}
                              hoverColor={user.status === USER_STATUS.ACTIVE ? "#f59e0b" : "#10b981"}
                              hoverBg={user.status === USER_STATUS.ACTIVE ? "rgba(245,158,11,0.10)" : "rgba(16,185,129,0.10)"}
                            >
                              {user.status === USER_STATUS.ACTIVE
                                ? <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                                : <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="20 6 9 17 4 12"/></svg>
                              }
                            </IconBtn>
                            <IconBtn title="Remove" onClick={() => handleAction("delete", user)} hoverColor="#ef4444" hoverBg="rgba(239,68,68,0.10)">
                              <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
                            </IconBtn>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Panel */}
      {editUser && (
        <EditPanel
          user={editUser}
          dark={dark}
          onClose={() => setEditUser(null)}
          onSave={(data) => { updateUser({ ...editUser, ...data }); setEditUser(null); }}
        />
      )}

      {/* Confirm */}
      <ConfirmDialog
        open={confirm.open}
        title={confirm.action === "delete" ? "Remove Trainer?" : "Suspend Trainer?"}
        message={`${confirm.action === "delete" ? "Permanently remove" : "Suspend"} ${confirm.user?.name}?`}
        confirmLabel={confirm.action === "delete" ? "Remove" : "Suspend"}
        variant={confirm.action === "delete" ? "danger" : "warning"}
        onConfirm={() => {
          if (confirm.action === "delete")  deleteUser(confirm.user.id, ROLES.TRAINER);
          if (confirm.action === "suspend") updateUserStatus(confirm.user.id, USER_STATUS.SUSPENDED, ROLES.TRAINER);
          setConfirm({ open: false });
        }}
        onCancel={() => setConfirm({ open: false })}
      />
    </>
  );
};

export default TrainerControlPage;