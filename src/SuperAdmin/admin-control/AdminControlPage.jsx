// // pages/AdminControlPage.jsx

// import React, { useState } from "react";
// import { useUserManagement } from "../context/UserManagementContext";
// import { ROLES, USER_STATUS } from "../constants/permissions";
// import { useTheme } from "../context/ThemeContext";
// import UserTable from "../common/UserTable";
// import UserPanel from "../common/UserPanel";
// import ConfirmDialog from "../common/ConfirmDialog";
// import PageHeader from "../common/PageHeader";

// const AdminControlPage = () => {
//   const { admins, updateUserStatus, createUser, updateUser, deleteUser } =
//     useUserManagement();
//   const { dark } = useTheme();

//   const [panel,   setPanel]   = useState({ open: false, data: null });
//   const [confirm, setConfirm] = useState({ open: false, action: null, user: null });

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
//       key: "department",
//       label: "Department",
//       render: (u) => (
//         <span className={`text-xs px-2 py-1 rounded-full font-medium ${
//           dark
//             ? "bg-indigo-500/10 text-indigo-400"
//             : "bg-indigo-100 text-indigo-600"
//         }`}>
//           {u.department || "General"}
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
//               Organisation Management
//             </span>
//           }
//           subtitle="Manage platform admins and their access levels"
//           badge={admins.length}
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
//               Add Organisation
//             </button>
//           }
//         />

//         {/* ── Stats ── */}
//         <div className="grid grid-cols-3 gap-3 mb-6">
//           {[
//             { label: "Total Admins", value: admins.length,                                                color: "text-indigo-500" },
//             { label: "Active",       value: admins.filter((a) => a.status === USER_STATUS.ACTIVE).length,   color: "text-emerald-500" },
//             { label: "Inactive",     value: admins.filter((a) => a.status === USER_STATUS.INACTIVE).length, color: dark ? "text-slate-400" : "text-gray-500" },
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
//             users={admins}
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
//             : createUser({ ...data, role: ROLES.ADMIN });
//           setPanel({ open: false, data: null });
//         }}
//         initialData={panel.data}
//         defaultRole={ROLES.ADMIN}
//       />

//       {/* ── Confirm Dialog ── */}
//       <ConfirmDialog
//         open={confirm.open}
//         title={confirm.action === "delete" ? "Remove Admin?" : "Suspend Admin?"}
//         message={`${confirm.action === "delete" ? "Remove" : "Suspend"} ${confirm.user?.name}? They will lose platform access.`}
//         confirmLabel={confirm.action === "delete" ? "Remove" : "Suspend"}
//         variant="danger"
//         onConfirm={() => {
//           if (confirm.action === "delete")  deleteUser(confirm.user.id, ROLES.ADMIN);
//           if (confirm.action === "suspend") updateUserStatus(confirm.user.id, USER_STATUS.SUSPENDED, ROLES.ADMIN);
//           setConfirm({ open: false });
//         }}
//         onCancel={() => setConfirm({ open: false })}
//       />
//     </>
//   );
// };

// export default AdminControlPage;
































// pages/AdminControlPage.jsx
import React, { useState, useEffect, useRef } from "react";
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
// ROLE CONFIG
// ─────────────────────────────────────────────
const ROLE_CONFIG = {
  admin:   { label: "Admin",   dot: "#6366f1", bg: "rgba(99,102,241,0.12)",  color: "#6366f1" },
  trainer: { label: "Trainer", dot: "#f59e0b", bg: "rgba(245,158,11,0.12)",  color: "#d97706" },
  student: { label: "Student", dot: "#14b8a6", bg: "rgba(20,184,166,0.12)",  color: "#0d9488" },
  manager: { label: "Manager", dot: "#f59e0b", bg: "rgba(245,158,11,0.12)",  color: "#d97706" },
};

const STATUS_CONFIG = {
  active:    { label: "Active",    dot: "#10b981", bg: "rgba(16,185,129,0.12)", color: "#059669" },
  inactive:  { label: "Inactive",  dot: "#94a3b8", bg: "rgba(148,163,184,0.12)",color: "#64748b" },
  suspended: { label: "Suspended", dot: "#ef4444", bg: "rgba(239,68,68,0.12)",  color: "#dc2626" },
  pending:   { label: "Pending",   dot: "#f59e0b", bg: "rgba(245,158,11,0.12)", color: "#d97706" },
};

// ─────────────────────────────────────────────
// BADGE
// ─────────────────────────────────────────────
const Badge = ({ cfg, label }) => {
  const c = cfg || STATUS_CONFIG.inactive;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      fontSize: 11, fontWeight: 600,
      padding: "3px 9px", borderRadius: 999,
      background: c.bg, color: c.color,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.dot, flexShrink: 0 }} />
      {label || c.label}
    </span>
  );
};

// ─────────────────────────────────────────────
// STAT CARD  (gradient like reference)
// ─────────────────────────────────────────────
const StatCard = ({ value, title, sub, grad, onClick, active }) => (
  <button
    onClick={onClick}
    style={{
      flex: 1, minWidth: 0, textAlign: "left",
      background: grad,
      borderRadius: 12, padding: "18px 22px",
      border: active ? "2px solid rgba(255,255,255,0.6)" : "2px solid transparent",
      cursor: "pointer", position: "relative", overflow: "hidden",
      transition: "transform 0.18s, box-shadow 0.18s",
      boxShadow: active ? "0 8px 24px rgba(0,0,0,0.18)" : "0 2px 8px rgba(0,0,0,0.10)",
    }}
    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 28px rgba(0,0,0,0.18)"; }}
    onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = active ? "0 8px 24px rgba(0,0,0,0.18)" : "0 2px 8px rgba(0,0,0,0.10)"; }}
  >
    {/* decorative circle */}
    <div style={{
      position: "absolute", right: -20, top: -20,
      width: 90, height: 90, borderRadius: "50%",
      background: "rgba(255,255,255,0.12)",
    }} />
    <div style={{
      position: "absolute", right: 20, bottom: -30,
      width: 60, height: 60, borderRadius: "50%",
      background: "rgba(255,255,255,0.08)",
    }} />
    <div style={{ fontSize: 30, fontWeight: 800, color: "#fff", lineHeight: 1, position: "relative" }}>
      {value}
    </div>
    <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.9)", marginTop: 4, position: "relative" }}>
      {title}
    </div>
    {sub && (
      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", marginTop: 2, position: "relative" }}>
        {sub}
      </div>
    )}
  </button>
);

// ─────────────────────────────────────────────
// ICON BUTTON
// ─────────────────────────────────────────────
const IconBtn = ({ title, onClick, children, color = "#94a3b8", hoverColor = "#6366f1", hoverBg = "rgba(99,102,241,0.10)" }) => {
  const [hov, setHov] = useState(false);
  return (
    <button
      title={title}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 28, height: 28, borderRadius: 6,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: hov ? hoverBg : "transparent",
        border: "none", cursor: "pointer",
        color: hov ? hoverColor : color,
        transition: "all 0.15s",
        flexShrink: 0,
      }}
    >
      {children}
    </button>
  );
};

// ─────────────────────────────────────────────
// ADD PANEL  (left side, like reference)
// ─────────────────────────────────────────────
const inputStyle = (dark) => ({
  width: "100%", boxSizing: "border-box",
  padding: "8px 11px", borderRadius: 7, fontSize: 13,
  border: dark ? "1px solid rgba(255,255,255,0.12)" : "1px solid #d1d5db",
  background: dark ? "rgba(255,255,255,0.04)" : "#fff",
  color: dark ? "#f1f5f9" : "#0f172a",
  outline: "none",
});

const AddMemberPanel = ({ open, onClose, onSubmit, dark }) => {
  const empty = { firstName: "", lastName: "", email: "", password: genPassword(), role: "admin" };
  const [form, setForm] = useState(empty);
  const [showPwd, setShowPwd] = useState(false);
  const [copied, setCopied] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) setForm({ ...empty, password: genPassword() });
  }, [open]);

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
      role: form.role,
      status: USER_STATUS.ACTIVE,
      joinedAt: new Date().toISOString(),
    });
    setLoading(false);
    onClose();
  };

  const ROLE_OPTS = [
    { value: "admin",   label: "Admin — Full platform access",    desc: "Can access all features, settings, billing, and support." },
    { value: "trainer", label: "Trainer — Course management",      desc: "Can manage courses, students, and training sessions." },
    { value: "student", label: "Student — Learning access",        desc: "Can access and enroll in available courses." },
  ];
  const selectedRole = ROLE_OPTS.find((r) => r.value === form.role) || ROLE_OPTS[0];

  const panelBg   = dark ? "#0f1117" : "#fff";
  const panelBdr  = dark ? "1px solid rgba(255,255,255,0.10)" : "1px solid #e5e7eb";
  const labelCls  = { fontSize: 11, fontWeight: 600, color: dark ? "#94a3b8" : "#6b7280", marginBottom: 5, display: "block" };
  const descColor = dark ? "#64748b" : "#9ca3af";

  if (!open) return null;

  return (
    <div style={{
      width: 280, flexShrink: 0,
      background: panelBg,
      border: panelBdr,
      borderRadius: 12,
      padding: "18px 18px 20px",
      display: "flex", flexDirection: "column", gap: 14,
      alignSelf: "flex-start",
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: dark ? "#f1f5f9" : "#0f172a" }}>
            Add Team Member
          </div>
          <div style={{ fontSize: 11, color: descColor, marginTop: 2 }}>
            Fill in the details to create an account
          </div>
        </div>
        <button onClick={onClose} style={{
          background: "none", border: "none", cursor: "pointer",
          color: dark ? "#64748b" : "#9ca3af", padding: 2,
          borderRadius: 4, display: "flex",
        }}>
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      {/* First + Last name */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <div>
          <label style={labelCls}>First name</label>
          <input
            style={inputStyle(dark)}
            placeholder="John"
            value={form.firstName}
            onChange={set("firstName")}
          />
        </div>
        <div>
          <label style={labelCls}>Last name</label>
          <input
            style={inputStyle(dark)}
            placeholder="Doe"
            value={form.lastName}
            onChange={set("lastName")}
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label style={labelCls}>Email address</label>
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <input
            style={{ ...inputStyle(dark), paddingRight: 52 }}
            type="email"
            placeholder="john@example.com"
            value={form.email}
            onChange={set("email")}
          />
          <button
            onClick={() => copy("email", form.email)}
            style={{
              position: "absolute", right: 6, fontSize: 10, fontWeight: 600,
              padding: "2px 7px", borderRadius: 4, cursor: "pointer",
              background: dark ? "rgba(99,102,241,0.18)" : "#ede9fe",
              color: dark ? "#a78bfa" : "#6d28d9",
              border: "none",
            }}
          >
            {copied.email ? "✓" : "Copy"}
          </button>
        </div>
      </div>

      {/* Password */}
      <div>
        <label style={labelCls}>Password</label>
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <input
            style={{ ...inputStyle(dark), paddingRight: 82, letterSpacing: showPwd ? "normal" : "2px" }}
            type={showPwd ? "text" : "password"}
            value={form.password}
            onChange={set("password")}
          />
          <div style={{ position: "absolute", right: 6, display: "flex", gap: 4 }}>
            <button
              onClick={() => setShowPwd((v) => !v)}
              style={{ background: "none", border: "none", cursor: "pointer", color: dark ? "#64748b" : "#9ca3af", display: "flex" }}
            >
              {showPwd ? (
                <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                  <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              ) : (
                <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              )}
            </button>
            <button
              onClick={() => copy("pwd", form.password)}
              style={{
                fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 4, cursor: "pointer",
                background: dark ? "rgba(99,102,241,0.18)" : "#ede9fe",
                color: dark ? "#a78bfa" : "#6d28d9", border: "none",
              }}
            >
              {copied.pwd ? "✓" : "Copy"}
            </button>
          </div>
        </div>
        <button
          onClick={() => setForm((f) => ({ ...f, password: genPassword() }))}
          style={{
            fontSize: 10, color: dark ? "#6366f1" : "#7c3aed",
            background: "none", border: "none", cursor: "pointer",
            marginTop: 4, padding: 0,
          }}
        >
          ↺ Generate new password
        </button>
      </div>

      {/* Role */}
      <div>
        <label style={labelCls}>Role</label>
        <div style={{ position: "relative" }}>
          <select
            value={form.role}
            onChange={set("role")}
            style={{
              ...inputStyle(dark),
              appearance: "none", paddingRight: 28, cursor: "pointer",
            }}
          >
            {ROLE_OPTS.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
          <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
            style={{ position: "absolute", right: 9, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: dark ? "#64748b" : "#9ca3af" }}>
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </div>
        <div style={{ fontSize: 11, color: descColor, marginTop: 5, lineHeight: 1.4 }}>
          {selectedRole.desc}
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading || !form.firstName.trim() || !form.email.trim()}
        style={{
          width: "100%", padding: "10px 0", borderRadius: 8,
          background: loading ? "#4b5563" : "#111827",
          color: "#fff", fontWeight: 700, fontSize: 13,
          border: "none", cursor: loading ? "not-allowed" : "pointer",
          transition: "background 0.15s",
          marginTop: 2,
        }}
        onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "#1f2937"; }}
        onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = "#111827"; }}
      >
        {loading ? "Creating…" : "Create member"}
      </button>
    </div>
  );
};

// ─────────────────────────────────────────────
// EDIT PANEL (right side slide-in)
// ─────────────────────────────────────────────
const EditPanel = ({ user, dark, onClose, onSave }) => {
  const [form, setForm] = useState({ name: "", email: "", role: "admin", status: "active", ...(user || {}) });
  useEffect(() => { if (user) setForm({ ...user }); }, [user]);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const descColor = dark ? "#64748b" : "#9ca3af";
  const panelBg   = dark ? "#0f1117" : "#fff";
  const panelBdr  = dark ? "1px solid rgba(255,255,255,0.10)" : "1px solid #e5e7eb";
  const labelCls  = { fontSize: 11, fontWeight: 600, color: dark ? "#94a3b8" : "#6b7280", marginBottom: 5, display: "block" };

  if (!user) return null;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "rgba(0,0,0,0.4)",
      display: "flex", alignItems: "center", justifyContent: "flex-end",
    }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        width: 320, height: "100%",
        background: panelBg,
        border: panelBdr,
        borderLeft: dark ? "1px solid rgba(255,255,255,0.10)" : "1px solid #e5e7eb",
        padding: "24px 22px",
        display: "flex", flexDirection: "column", gap: 16, overflowY: "auto",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: dark ? "#f1f5f9" : "#0f172a" }}>Edit Member</div>
            <div style={{ fontSize: 11, color: descColor, marginTop: 2 }}>Update member details</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: dark ? "#64748b" : "#9ca3af", display: "flex" }}>
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Avatar */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {(() => { const [a,b] = avatarColor(form.name); return (
            <div style={{
              width: 44, height: 44, borderRadius: "50%",
              background: `linear-gradient(135deg, ${a}, ${b})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: 14, fontWeight: 700, flexShrink: 0,
            }}>
              {initials(form.name)}
            </div>
          ); })()}
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: dark ? "#f1f5f9" : "#0f172a" }}>{form.name}</div>
            <div style={{ fontSize: 11, color: descColor }}>{form.email}</div>
          </div>
        </div>

        <div style={{ borderTop: dark ? "1px solid rgba(255,255,255,0.07)" : "1px solid #f1f5f9" }} />

        {/* Fields */}
        <div><label style={labelCls}>Full Name</label><input style={inputStyle(dark)} value={form.name} onChange={set("name")} /></div>
        <div><label style={labelCls}>Email</label><input style={inputStyle(dark)} type="email" value={form.email} onChange={set("email")} /></div>
        <div>
          <label style={labelCls}>Role</label>
          <select style={{ ...inputStyle(dark), appearance: "none", cursor: "pointer" }} value={form.role} onChange={set("role")}>
            <option value="admin">Admin</option>
            <option value="trainer">Trainer</option>
            <option value="student">Student</option>
          </select>
        </div>
        <div>
          <label style={labelCls}>Status</label>
          <select style={{ ...inputStyle(dark), appearance: "none", cursor: "pointer" }} value={form.status} onChange={set("status")}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <button
          onClick={() => { onSave(form); onClose(); }}
          style={{
            width: "100%", padding: "10px 0", borderRadius: 8, marginTop: 4,
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            color: "#fff", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer",
          }}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────
const AdminControlPage = () => {
  const { admins = [], updateUserStatus, createUser, updateUser, deleteUser } = useUserManagement();
  const { dark } = useTheme();

  const [showAdd,   setShowAdd]   = useState(false);
  const [editUser,  setEditUser]  = useState(null);
  const [confirm,   setConfirm]   = useState({ open: false, action: null, user: null });
  const [search,    setSearch]    = useState("");
  const [filter,    setFilter]    = useState("all");   // all | admin | trainer | active | inactive

  // ── theme tokens ─────────────────────────────────────────────
  const pageBg   = "transparent";
  const cardBg   = dark ? "rgba(255,255,255,0.03)" : "#ffffff";
  const cardBdr  = dark ? "rgba(255,255,255,0.08)" : "#e5e7eb";
  const thBg     = dark ? "rgba(255,255,255,0.04)" : "#f8fafc";
  const thColor  = dark ? "#64748b"                : "#94a3b8";
  const rowHov   = dark ? "rgba(255,255,255,0.03)" : "#f8fafc";
  const txtMain  = dark ? "#f1f5f9" : "#0f172a";
  const txtSub   = dark ? "#64748b" : "#94a3b8";
  const divColor = dark ? "rgba(255,255,255,0.06)" : "#f1f5f9";

  // ── stats ────────────────────────────────────────────────────
  const total    = admins.length;
  const active   = admins.filter((a) => a.status === USER_STATUS.ACTIVE).length;
  const inactive = admins.filter((a) => a.status === USER_STATUS.INACTIVE).length;
  const suspended= admins.filter((a) => a.status === USER_STATUS.SUSPENDED).length;

  // ── filter + search ─────────────────────────────────────────
  const filtered = admins.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch = !q || (u.name || "").toLowerCase().includes(q) || (u.email || "").toLowerCase().includes(q);
    const matchFilter =
      filter === "all"      ? true :
      filter === "active"   ? u.status === USER_STATUS.ACTIVE :
      filter === "inactive" ? u.status === USER_STATUS.INACTIVE :
      filter === "admin"    ? (u.role === ROLES.ADMIN || u.role === "admin") :
      filter === "trainer"  ? (u.role === ROLES.TRAINER || u.role === "trainer") :
      true;
    return matchSearch && matchFilter;
  });

  const tabs = [
    { key: "all",      label: "All",      count: total },
    { key: "admin",    label: "Admins",   count: admins.filter((a) => a.role === ROLES.ADMIN || a.role === "admin").length },
    { key: "trainer",  label: "Trainers", count: admins.filter((a) => a.role === ROLES.TRAINER || a.role === "trainer").length },
    { key: "active",   label: "Active",   count: active },
    { key: "inactive", label: "Inactive", count: inactive },
  ];

  const statCards = [
    { value: total,     title: "Total Members",  sub: "All team members",   grad: "linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)", filter: "all"      },
    { value: active,    title: "Active",          sub: `${inactive} inactive`, grad: "linear-gradient(135deg, #059669 0%, #10b981 100%)", filter: "active"   },
    { value: admins.filter((a) => a.role === ROLES.ADMIN || a.role === "admin").length,
                        title: "Admins",           sub: "Full access",          grad: "linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)", filter: "admin"    },
    { value: suspended, title: "Suspended",        sub: "Limited/no access",    grad: "linear-gradient(135deg, #d97706 0%, #f59e0b 100%)", filter: "inactive" },
  ];

  // action handlers
  const handleAction = (action, user) => {
    if (action === "edit")      setEditUser(user);
    else if (action === "delete")   setConfirm({ open: true, action: "delete",  user });
    else if (action === "suspend")  setConfirm({ open: true, action: "suspend", user });
    else if (action === "activate") updateUserStatus(user.id, USER_STATUS.ACTIVE, user.role);
  };

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

        {/* ── Page Title ── */}
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: txtMain, margin: 0, letterSpacing: "-0.02em" }}>
            Organisation Management
          </h1>
          <p style={{ fontSize: 12, color: txtSub, marginTop: 3 }}>
            {total} members · Manage access and roles
          </p>
        </div>

        {/* ── Stat Cards ── */}
        <div style={{ display: "flex", gap: 12 }}>
          {statCards.map((c) => (
            <StatCard
              key={c.filter}
              {...c}
              active={filter === c.filter}
              onClick={() => setFilter(c.filter)}
            />
          ))}
        </div>

        {/* ── Action bar ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={() => setShowAdd((v) => !v)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "8px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600,
              background: showAdd
                ? (dark ? "#4f46e5" : "#4f46e5")
                : (dark ? "#6366f1" : "#6366f1"),
              color: "#fff", border: "none", cursor: "pointer",
              transition: "background 0.15s",
            }}
          >
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path d="M12 5v14M5 12h14"/>
            </svg>
            {showAdd ? "Cancel" : "Add Member"}
          </button>

          <button
            onClick={() => window.location.reload()}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "8px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600,
              background: dark ? "rgba(255,255,255,0.06)" : "#f1f5f9",
              color: dark ? "#94a3b8" : "#64748b",
              border: dark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #e5e7eb",
              cursor: "pointer",
            }}
          >
            <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <polyline points="23 4 23 10 17 10"/>
              <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/>
            </svg>
            Refresh
          </button>
        </div>

        {/* ── Main content: [Add panel] + [Table] ── */}
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>

          {/* Add panel */}
          {showAdd && (
            <AddMemberPanel
              open={showAdd}
              dark={dark}
              onClose={() => setShowAdd(false)}
              onSubmit={(data) => {
                createUser({ ...data, role: ROLES.ADMIN });
                setShowAdd(false);
              }}
            />
          )}

          {/* Table card */}
          <div style={{
            flex: 1, minWidth: 0,
            background: cardBg,
            border: `1px solid ${cardBdr}`,
            borderRadius: 12, overflow: "hidden",
          }}>
            {/* Search + tabs */}
            <div style={{
              padding: "12px 16px",
              borderBottom: `1px solid ${divColor}`,
              display: "flex", alignItems: "center", justifyContent: "space-between",
              flexWrap: "wrap", gap: 10,
            }}>
              {/* Search */}
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                  style={{ position: "absolute", left: 10, color: txtSub }}>
                  <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>
                <input
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    paddingLeft: 32, paddingRight: 12, paddingTop: 7, paddingBottom: 7,
                    borderRadius: 7, fontSize: 12,
                    border: dark ? "1px solid rgba(255,255,255,0.10)" : "1px solid #e5e7eb",
                    background: dark ? "rgba(255,255,255,0.04)" : "#f8fafc",
                    color: dark ? "#f1f5f9" : "#0f172a",
                    outline: "none", width: 180,
                  }}
                />
              </div>

              {/* Filter tabs */}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {tabs.map((tab) => {
                  const isActive = filter === tab.key;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setFilter(tab.key)}
                      style={{
                        padding: "5px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600,
                        border: "none", cursor: "pointer",
                        background: isActive
                          ? (dark ? "#6366f1" : "#6366f1")
                          : (dark ? "rgba(255,255,255,0.05)" : "#f1f5f9"),
                        color: isActive ? "#fff" : (dark ? "#94a3b8" : "#64748b"),
                        transition: "all 0.15s",
                      }}
                    >
                      {tab.label} <span style={{ opacity: 0.7 }}>{tab.count}</span>
                    </button>
                  );
                })}
              </div>

              <span style={{ fontSize: 11, color: txtSub, marginLeft: "auto" }}>
                {filtered.length} result{filtered.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Table */}
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: thBg }}>
                    {["MEMBER", "ROLE", "STATUS", "JOINED", "ACTIONS"].map((h) => (
                      <th key={h} style={{
                        padding: "10px 16px", textAlign: "left",
                        fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
                        color: thColor, borderBottom: `1px solid ${divColor}`,
                        whiteSpace: "nowrap",
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: "center", padding: "48px 0", color: txtSub, fontSize: 13 }}>
                        No members found
                      </td>
                    </tr>
                  ) : (
                    filtered.map((user, idx) => {
                      const [a, b] = avatarColor(user.name);
                      const roleCfg   = ROLE_CONFIG[user.role]   || ROLE_CONFIG.admin;
                      const statusCfg = STATUS_CONFIG[user.status] || STATUS_CONFIG.inactive;
                      return (
                        <tr
                          key={user.id || idx}
                          style={{ borderBottom: `1px solid ${divColor}`, transition: "background 0.1s" }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = rowHov; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                        >
                          {/* Member */}
                          <td style={{ padding: "12px 16px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <div style={{
                                width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
                                background: `linear-gradient(135deg, ${a}, ${b})`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                color: "#fff", fontSize: 12, fontWeight: 700,
                              }}>
                                {initials(user.name)}
                              </div>
                              <div>
                                <div style={{ fontSize: 13, fontWeight: 600, color: txtMain }}>
                                  {user.name || "—"}
                                </div>
                                <div style={{ fontSize: 11, color: txtSub }}>
                                  {user.email || "—"}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Role */}
                          <td style={{ padding: "12px 16px" }}>
                            <Badge cfg={roleCfg} label={roleCfg.label} />
                          </td>

                          {/* Status */}
                          <td style={{ padding: "12px 16px" }}>
                            <Badge cfg={statusCfg} label={statusCfg.label} />
                          </td>

                          {/* Joined */}
                          <td style={{ padding: "12px 16px", fontSize: 12, color: txtSub, whiteSpace: "nowrap" }}>
                            {formatDate(user.joinedAt || user.createdAt)}
                          </td>

                          {/* Actions */}
                          <td style={{ padding: "12px 16px" }}>
                            <div style={{ display: "flex", gap: 2 }}>
                              {/* Edit */}
                              <IconBtn title="Edit" onClick={() => handleAction("edit", user)}>
                                <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                </svg>
                              </IconBtn>

                              {/* Copy email */}
                              <IconBtn title="Copy email" onClick={() => navigator.clipboard.writeText(user.email || "").catch(() => {})}>
                                <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                  <rect x="9" y="9" width="13" height="13" rx="2"/>
                                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                                </svg>
                              </IconBtn>

                              {/* Toggle suspend/activate */}
                              <IconBtn
                                title={user.status === USER_STATUS.ACTIVE ? "Suspend" : "Activate"}
                                onClick={() => handleAction(user.status === USER_STATUS.ACTIVE ? "suspend" : "activate", user)}
                                hoverColor={user.status === USER_STATUS.ACTIVE ? "#f59e0b" : "#10b981"}
                                hoverBg={user.status === USER_STATUS.ACTIVE ? "rgba(245,158,11,0.10)" : "rgba(16,185,129,0.10)"}
                              >
                                {user.status === USER_STATUS.ACTIVE ? (
                                  <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                    <circle cx="12" cy="12" r="10"/>
                                    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
                                  </svg>
                                ) : (
                                  <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                    <polyline points="20 6 9 17 4 12"/>
                                  </svg>
                                )}
                              </IconBtn>

                              {/* Delete */}
                              <IconBtn
                                title="Remove member"
                                onClick={() => handleAction("delete", user)}
                                hoverColor="#ef4444"
                                hoverBg="rgba(239,68,68,0.10)"
                              >
                                <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                  <polyline points="3 6 5 6 21 6"/>
                                  <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                                  <path d="M10 11v6M14 11v6"/>
                                  <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                                </svg>
                              </IconBtn>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Edit panel */}
      {editUser && (
        <EditPanel
          user={editUser}
          dark={dark}
          onClose={() => setEditUser(null)}
          onSave={(data) => { updateUser(data); setEditUser(null); }}
        />
      )}

      {/* Confirm dialog */}
      <ConfirmDialog
        open={confirm.open}
        title={confirm.action === "delete" ? "Remove Member?" : "Suspend Member?"}
        message={`${confirm.action === "delete" ? "Remove" : "Suspend"} ${confirm.user?.name}? They will lose platform access.`}
        confirmLabel={confirm.action === "delete" ? "Remove" : "Suspend"}
        variant="danger"
        onConfirm={() => {
          if (confirm.action === "delete")  deleteUser(confirm.user.id, ROLES.ADMIN);
          if (confirm.action === "suspend") updateUserStatus(confirm.user.id, USER_STATUS.SUSPENDED, ROLES.ADMIN);
          setConfirm({ open: false });
        }}
        onCancel={() => setConfirm({ open: false })}
      />
    </>
  );
};

export default AdminControlPage;