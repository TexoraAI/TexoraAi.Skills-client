
// // OrganizationPage.jsx
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// // ── Helpers (assumed to exist elsewhere or define here) ──
// const formatDate = (d) => d ? new Date(d).toLocaleDateString() : "—";

// const Badge = ({ cfg }) => {
//   if (!cfg) return null;
//   return (
//     <span style={{
//       padding: "2px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700,
//       background: cfg.bg, color: cfg.color
//     }}>
//       {cfg.label}
//     </span>
//   );
// };

// const STATUS_CONFIG = {
//   active:   { label: "Active",   bg: "#dcfce7", color: "#16a34a" },
//   inactive: { label: "Inactive", bg: "#fee2e2", color: "#dc2626" },
//   trial:    { label: "Trial",    bg: "#fef9c3", color: "#ca8a04" },
// };

// const PLAN_CONFIG = {
//   free:       { label: "Free",       bg: "#f1f5f9", color: "#64748b" },
//   pro:        { label: "Pro",        bg: "#ede9fe", color: "#7c3aed" },
//   enterprise: { label: "Enterprise", bg: "#dbeafe", color: "#1d4ed8" },
// };

// // ─────────────────────────────────────────────
// // STAT NAV CARD — must be defined BEFORE OrgDetailsPanel
// // ─────────────────────────────────────────────
// const StatNavCard = ({ label, val, color, icon, bg, hoverBg, dark, txtSub, onClick }) => {
//   const [hov, setHov] = useState(false);

//   return (
//     <button
//       onClick={onClick}
//       onMouseEnter={() => setHov(true)}
//       onMouseLeave={() => setHov(false)}
//       style={{
//         background:    hov ? hoverBg : bg,
//         borderRadius:  10,
//         padding:       "12px 14px",
//         textAlign:     "center",
//         border:        hov
//           ? `1px solid ${color}55`
//           : dark ? "1px solid rgba(255,255,255,0.06)" : "1px solid #e5e7eb",
//         cursor:        "pointer",
//         transform:     hov ? "scale(1.04)" : "scale(1)",
//         transition:    "all 0.18s ease",
//         display:       "flex",
//         flexDirection: "column",
//         alignItems:    "center",
//         gap:           4,
//         boxShadow:     hov ? `0 4px 16px ${color}33` : "none",
//       }}
//     >
//       <div style={{
//         width: 28, height: 28, borderRadius: 8,
//         background: `${color}22`,
//         display: "flex", alignItems: "center", justifyContent: "center",
//         color: color, marginBottom: 2,
//       }}>
//         {icon}
//       </div>
//       <div style={{ fontSize: 22, fontWeight: 800, color, lineHeight: 1 }}>{val}</div>
//       <div style={{
//         fontSize: 11, color: txtSub, marginTop: 2,
//         display: "flex", alignItems: "center", gap: 3
//       }}>
//         {label}
//         <svg width={9} height={9} viewBox="0 0 24 24" fill="none"
//           stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
//           style={{ opacity: hov ? 1 : 0, transition: "opacity 0.15s", color }}>
//           <path d="M5 12h14M12 5l7 7-7 7"/>
//         </svg>
//       </div>
//     </button>
//   );
// };

// // ─────────────────────────────────────────────
// // ORG DETAILS SIDE PANEL
// // ─────────────────────────────────────────────
// const OrgDetailsPanel = ({ org, stats, dark, onClose }) => {
//   const navigate = useNavigate();

//   if (!org) return null;

//   const panelBg    = dark ? "#0f1117" : "#fff";
//   const txtMain    = dark ? "#f1f5f9" : "#0f172a";
//   const txtSub     = dark ? "#64748b" : "#94a3b8";
//   const divClr     = dark ? "rgba(255,255,255,0.06)" : "#f1f5f9";
//   const statBg     = dark ? "rgba(255,255,255,0.04)" : "#f8fafc";
//   const statHovBg  = dark ? "rgba(255,255,255,0.09)" : "#f1f5f9";

//   const statRow = (label, value, color) => (
//     <div style={{
//       display: "flex", justifyContent: "space-between", alignItems: "center",
//       padding: "10px 0", borderBottom: `1px solid ${divClr}`
//     }}>
//       <span style={{ fontSize: 12, color: txtSub }}>{label}</span>
//       <span style={{ fontSize: 13, fontWeight: 700, color: color || txtMain }}>{value}</span>
//     </div>
//   );

//   const handleNavigate = (path) => {
//     onClose();
//     navigate(path);
//   };

//   const statCards = [
//     {
//       label: "Admins",
//       val:   stats.totalAdmins,
//       color: "#6366f1",
//       path:  `/superadmin/organizations/${org.id}/admins`,
//       icon: (
//         <svg width={14} height={14} viewBox="0 0 24 24" fill="none"
//           stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
//           <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
//         </svg>
//       ),
//     },
//     {
//       label: "Trainers",
//       val:   stats.totalTrainers,
//       color: "#8b5cf6",
//       path:  `/superadmin/organizations/${org.id}/trainers`,
//       icon: (
//         <svg width={14} height={14} viewBox="0 0 24 24" fill="none"
//           stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
//           <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
//           <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>
//         </svg>
//       ),
//     },
//     {
//       label: "Batches",
//       val:   stats.totalBatches,
//       color: "#3b82f6",
//       path:  `/superadmin/organizations/${org.id}/batches`,
//       icon: (
//         <svg width={14} height={14} viewBox="0 0 24 24" fill="none"
//           stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
//           <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
//         </svg>
//       ),
//     },
//     {
//       label: "Students",
//       val:   stats.totalStudents,
//       color: "#14b8a6",
//       path:  `/superadmin/organizations/${org.id}/students`,
//       icon: (
//         <svg width={14} height={14} viewBox="0 0 24 24" fill="none"
//           stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
//           <path d="M12 14l9-5-9-5-9 5 9 5z"/>
//           <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
//         </svg>
//       ),
//     },
//   ];

//   return (
//     <div
//       style={{
//         position: "fixed", inset: 0, zIndex: 100,
//         background: "rgba(0,0,0,0.4)",
//         display: "flex", alignItems: "center", justifyContent: "flex-end"
//       }}
//       onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
//     >
//       <div style={{
//         width: 340, height: "100%", background: panelBg,
//         borderLeft: dark ? "1px solid rgba(255,255,255,0.10)" : "1px solid #e5e7eb",
//         padding: "24px 22px",
//         display: "flex", flexDirection: "column", gap: 18,
//         overflowY: "auto"
//       }}>

//         {/* Header */}
//         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
//           <div>
//             <div style={{ fontSize: 16, fontWeight: 800, color: txtMain }}>{org.name}</div>
//             <div style={{ fontSize: 11, color: txtSub, marginTop: 2 }}>{org.domain}</div>
//           </div>
//           <button onClick={onClose} style={{
//             background: "none", border: "none", cursor: "pointer", color: txtSub, display: "flex"
//           }}>
//             <svg width={16} height={16} viewBox="0 0 24 24" fill="none"
//               stroke="currentColor" strokeWidth={2.5}>
//               <path d="M18 6L6 18M6 6l12 12"/>
//             </svg>
//           </button>
//         </div>

//         {/* Status + Plan badges */}
//         <div style={{ display: "flex", gap: 8 }}>
//           <Badge cfg={STATUS_CONFIG[org.status]} />
//           <Badge cfg={PLAN_CONFIG[org.plan]} />
//         </div>

//         {/* Clickable Stat Cards */}
//         <div>
//           <div style={{
//             fontSize: 11, fontWeight: 700, color: txtSub,
//             letterSpacing: "0.08em", textTransform: "uppercase",
//             marginBottom: 10
//           }}>
//             Quick Navigation
//           </div>
//           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
//             {statCards.map((s) => (
//               <StatNavCard
//                 key={s.label}
//                 label={s.label}
//                 val={s.val}
//                 color={s.color}
//                 icon={s.icon}
//                 bg={statBg}
//                 hoverBg={statHovBg}
//                 dark={dark}
//                 txtSub={txtSub}
//                 onClick={() => handleNavigate(s.path)}
//               />
//             ))}
//           </div>
//         </div>

//         {/* Details rows */}
//         <div>
//           <div style={{ fontSize: 12, fontWeight: 700, color: txtMain, marginBottom: 4 }}>Details</div>
//           {statRow("Industry",        org.industry)}
//           {statRow("Location",        org.location)}
//           {statRow("Contact",         org.contactEmail)}
//           {statRow("Plan Expiry",     formatDate(org.planExpiry))}
//           {statRow("Max Students",    org.maxStudents)}
//           {statRow("Max Trainers",    org.maxTrainers)}
//           {statRow("Created",         formatDate(org.createdAt))}
//           {statRow("Active Students", stats.activeStudents, "#10b981")}
//         </div>

//         {/* View Full Details CTA */}
//         <button
//           onClick={() => handleNavigate(`/superadmin/organizations/${org.id}`)}
//           style={{
//             width: "100%", padding: "10px 0", borderRadius: 8, fontSize: 13, fontWeight: 700,
//             background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
//             color: "#fff", border: "none", cursor: "pointer",
//             display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
//             marginTop: "auto",
//           }}
//         >
//           <svg width={13} height={13} viewBox="0 0 24 24" fill="none"
//             stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
//             <path d="M15 3h6v6M10 14L21 3M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
//           </svg>
//           View Full Organization
//         </button>

//       </div>
//     </div>
//   );
// };

// // ─────────────────────────────────────────────
// // MAIN PAGE COMPONENT — must be defined LAST
// // ─────────────────────────────────────────────
// const OrganizationPage = () => {
//   // Your existing OrganizationPage logic here
//   // e.g. state, data fetching, rendering the table + OrgDetailsPanel

//   return (
//     <div>
//       {/* your page content */}
//     </div>
//   );
// };

// export default OrganizationPage;

















// OrganizationPage.jsx
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSaas } from "../context/SaasContext";
import { useTheme } from "../context/ThemeContext"; // adjust path if needed

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
const formatDate = (d) => (d ? new Date(d).toLocaleDateString() : "—");

const STATUS_CONFIG = {
  active:   { label: "Active",   bg: "#dcfce7", color: "#16a34a" },
  inactive: { label: "Inactive", bg: "#fee2e2", color: "#dc2626" },
  trial:    { label: "Trial",    bg: "#fef9c3", color: "#ca8a04" },
};

const PLAN_CONFIG = {
  free:       { label: "Free",       bg: "#f1f5f9", color: "#64748b" },
  pro:        { label: "Pro",        bg: "#ede9fe", color: "#7c3aed" },
  enterprise: { label: "Enterprise", bg: "#dbeafe", color: "#1d4ed8" },
};

const Badge = ({ cfg }) => {
  if (!cfg) return null;
  return (
    <span style={{
      padding: "2px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700,
      background: cfg.bg, color: cfg.color,
    }}>
      {cfg.label}
    </span>
  );
};

// ─────────────────────────────────────────────
// STAT NAV CARD
// ─────────────────────────────────────────────
const StatNavCard = ({ label, val, color, icon, bg, hoverBg, dark, txtSub, onClick }) => {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? hoverBg : bg,
        borderRadius: 10, padding: "12px 14px", textAlign: "center",
        border: hov ? `1px solid ${color}55` : dark ? "1px solid rgba(255,255,255,0.06)" : "1px solid #e5e7eb",
        cursor: "pointer", transform: hov ? "scale(1.04)" : "scale(1)",
        transition: "all 0.18s ease", display: "flex", flexDirection: "column",
        alignItems: "center", gap: 4,
        boxShadow: hov ? `0 4px 16px ${color}33` : "none",
      }}
    >
      <div style={{
        width: 28, height: 28, borderRadius: 8, background: `${color}22`,
        display: "flex", alignItems: "center", justifyContent: "center",
        color, marginBottom: 2,
      }}>{icon}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color, lineHeight: 1 }}>{val}</div>
      <div style={{ fontSize: 11, color: txtSub, marginTop: 2, display: "flex", alignItems: "center", gap: 3 }}>
        {label}
        <svg width={9} height={9} viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
          style={{ opacity: hov ? 1 : 0, transition: "opacity 0.15s", color }}>
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
};

// ─────────────────────────────────────────────
// ORG DETAILS SIDE PANEL
// ─────────────────────────────────────────────
const OrgDetailsPanel = ({ org, stats, dark, onClose }) => {
  const navigate = useNavigate();
  if (!org) return null;

  const panelBg   = dark ? "#0f1117" : "#fff";
  const txtMain   = dark ? "#f1f5f9" : "#0f172a";
  const txtSub    = dark ? "#64748b" : "#94a3b8";
  const divClr    = dark ? "rgba(255,255,255,0.06)" : "#f1f5f9";
  const statBg    = dark ? "rgba(255,255,255,0.04)" : "#f8fafc";
  const statHovBg = dark ? "rgba(255,255,255,0.09)" : "#f1f5f9";

  const statRow = (label, value, color) => (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "10px 0", borderBottom: `1px solid ${divClr}`,
    }}>
      <span style={{ fontSize: 12, color: txtSub }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: color || txtMain }}>{value}</span>
    </div>
  );

  const handleNavigate = (path) => { onClose(); navigate(path); };

  const statCards = [
    {
      label: "Admins", val: stats.totalAdmins, color: "#6366f1",
      path: `/superadmin/organizations/${org.id}/admins`,
      icon: <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
    },
    {
      label: "Trainers", val: stats.totalTrainers, color: "#8b5cf6",
      path: `/superadmin/organizations/${org.id}/trainers`,
      icon: <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" /></svg>,
    },
    {
      label: "Batches", val: stats.totalBatches, color: "#3b82f6",
      path: `/superadmin/organizations/${org.id}/batches`,
      icon: <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" /></svg>,
    },
    {
      label: "Students", val: stats.totalStudents, color: "#14b8a6",
      path: `/superadmin/organizations/${org.id}/students`,
      icon: <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>,
    },
  ];

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "rgba(0,0,0,0.4)",
        display: "flex", alignItems: "center", justifyContent: "flex-end",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        width: 340, height: "100%", background: panelBg,
        borderLeft: dark ? "1px solid rgba(255,255,255,0.10)" : "1px solid #e5e7eb",
        padding: "24px 22px", display: "flex", flexDirection: "column", gap: 18, overflowY: "auto",
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: txtMain }}>{org.name}</div>
            <div style={{ fontSize: 11, color: txtSub, marginTop: 2 }}>{org.domain}</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: txtSub, display: "flex" }}>
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Badges */}
        <div style={{ display: "flex", gap: 8 }}>
          <Badge cfg={STATUS_CONFIG[org.status]} />
          <Badge cfg={PLAN_CONFIG[org.plan]} />
        </div>

        {/* Quick Nav Cards */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: txtSub, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>
            Quick Navigation
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {statCards.map((s) => (
              <StatNavCard key={s.label} label={s.label} val={s.val} color={s.color}
                icon={s.icon} bg={statBg} hoverBg={statHovBg} dark={dark}
                txtSub={txtSub} onClick={() => handleNavigate(s.path)} />
            ))}
          </div>
        </div>

        {/* Details */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: txtMain, marginBottom: 4 }}>Details</div>
          {statRow("Industry",        org.industry)}
          {statRow("Location",        org.location)}
          {statRow("Contact",         org.contactEmail)}
          {statRow("Plan Expiry",     formatDate(org.planExpiry))}
          {statRow("Max Students",    org.maxStudents)}
          {statRow("Max Trainers",    org.maxTrainers)}
          {statRow("Created",         formatDate(org.createdAt))}
          {statRow("Active Students", stats.activeStudents, "#10b981")}
        </div>

        {/* CTA */}
        <button
          onClick={() => handleNavigate(`/superadmin/organizations/${org.id}`)}
          style={{
            width: "100%", padding: "10px 0", borderRadius: 8, fontSize: 13, fontWeight: 700,
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            color: "#fff", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            marginTop: "auto",
          }}
        >
          <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h6v6M10 14L21 3M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
          </svg>
          View Full Organization
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────
const OrganizationPage = () => {
  const { organizations, getOrgStats, updateOrgStatus, deleteOrganization } = useSaas();
  const navigate = useNavigate();

  // Theme — try to use your ThemeContext; fallback to false if not available
  const [dark, setDark] = useState(false);
  try {
    // If you have useTheme hook, replace the useState above with:
    // const { dark } = useTheme();
  } catch {}

  const [search,      setSearch]      = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter,   setPlanFilter]   = useState("all");
  const [selectedOrg,  setSelectedOrg]  = useState(null);
  const [selectedStats, setSelectedStats] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null); // org to delete

  // ── Derived filtered list ──
  const filtered = useMemo(() => {
    return organizations.filter((o) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        o.name?.toLowerCase().includes(q) ||
        o.domain?.toLowerCase().includes(q) ||
        o.contactEmail?.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || o.status === statusFilter;
      const matchPlan   = planFilter   === "all" || o.plan   === planFilter;
      return matchSearch && matchStatus && matchPlan;
    });
  }, [organizations, search, statusFilter, planFilter]);

  // ── Colors ──
  const bg       = dark ? "#0a0d14" : "#f8fafc";
  const cardBg   = dark ? "#0f1117" : "#fff";
  const txtMain  = dark ? "#f1f5f9" : "#0f172a";
  const txtSub   = dark ? "#64748b" : "#94a3b8";
  const border   = dark ? "rgba(255,255,255,0.07)" : "#e5e7eb";
  const inputBg  = dark ? "#1e2330" : "#f1f5f9";

  // ── Handlers ──
  const handleRowClick = (org) => {
    setSelectedOrg(org);
    setSelectedStats(getOrgStats(org.id));
  };

  const handleStatusToggle = (e, org) => {
    e.stopPropagation();
    const next = org.status === "active" ? "inactive" : "active";
    updateOrgStatus(org.id, next);
  };

  const handleDelete = (e, org) => {
    e.stopPropagation();
    setConfirmDelete(org);
  };

  const confirmDeleteOrg = () => {
    if (confirmDelete) {
      deleteOrganization(confirmDelete.id);
      setConfirmDelete(null);
      if (selectedOrg?.id === confirmDelete.id) setSelectedOrg(null);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: bg, padding: "28px 32px", fontFamily: "Inter, sans-serif" }}>

      {/* ── Page Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: txtMain, margin: 0 }}>Organizations</h1>
          <p style={{ fontSize: 13, color: txtSub, margin: "4px 0 0" }}>
            {organizations.length} total · {organizations.filter(o => o.status === "active").length} active
          </p>
        </div>
        <button
          onClick={() => navigate("/superadmin/organizations/new")}
          style={{
            padding: "9px 18px", borderRadius: 8, fontSize: 13, fontWeight: 700,
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            color: "#fff", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 6,
          }}
        >
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M12 5v14M5 12h14" /></svg>
          New Organization
        </button>
      </div>

      {/* ── Filters ── */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        {/* Search */}
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={txtSub}
            strokeWidth={2} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }}>
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search organizations..."
            style={{
              width: "100%", padding: "8px 12px 8px 30px", borderRadius: 8,
              border: `1px solid ${border}`, background: inputBg,
              color: txtMain, fontSize: 13, outline: "none", boxSizing: "border-box",
            }}
          />
        </div>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: "8px 12px", borderRadius: 8, border: `1px solid ${border}`,
            background: inputBg, color: txtMain, fontSize: 13, cursor: "pointer", outline: "none",
          }}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="trial">Trial</option>
        </select>

        {/* Plan filter */}
        <select
          value={planFilter}
          onChange={(e) => setPlanFilter(e.target.value)}
          style={{
            padding: "8px 12px", borderRadius: 8, border: `1px solid ${border}`,
            background: inputBg, color: txtMain, fontSize: 13, cursor: "pointer", outline: "none",
          }}
        >
          <option value="all">All Plans</option>
          <option value="free">Free</option>
          <option value="pro">Pro</option>
          <option value="enterprise">Enterprise</option>
        </select>
      </div>

      {/* ── Table ── */}
      <div style={{
        background: cardBg, borderRadius: 14,
        border: `1px solid ${border}`, overflow: "hidden",
      }}>
        {/* Table Header */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 80px 80px 80px 80px 100px",
          padding: "10px 18px",
          background: dark ? "rgba(255,255,255,0.03)" : "#f8fafc",
          borderBottom: `1px solid ${border}`,
        }}>
          {["Organization", "Status", "Plan", "Admins", "Trainers", "Batches", "Students", "Actions"].map((h) => (
            <div key={h} style={{ fontSize: 11, fontWeight: 700, color: txtSub, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {h}
            </div>
          ))}
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div style={{ padding: "48px 0", textAlign: "center", color: txtSub, fontSize: 14 }}>
            No organizations found
          </div>
        ) : (
          filtered.map((org) => {
            const stats = getOrgStats(org.id);
            return (
              <OrgRow
                key={org.id}
                org={org}
                stats={stats}
                dark={dark}
                txtMain={txtMain}
                txtSub={txtSub}
                border={border}
                onRowClick={() => handleRowClick(org)}
                onStatusToggle={(e) => handleStatusToggle(e, org)}
                onDelete={(e) => handleDelete(e, org)}
              />
            );
          })
        )}
      </div>

      {/* ── Side Panel ── */}
      {selectedOrg && (
        <OrgDetailsPanel
          org={selectedOrg}
          stats={selectedStats}
          dark={dark}
          onClose={() => setSelectedOrg(null)}
        />
      )}

      {/* ── Delete Confirm Modal ── */}
      {confirmDelete && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 200,
          background: "rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{
            background: cardBg, borderRadius: 14, padding: "28px 32px",
            width: 380, border: `1px solid ${border}`,
          }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: txtMain, marginBottom: 8 }}>Delete Organization?</div>
            <div style={{ fontSize: 13, color: txtSub, marginBottom: 24 }}>
              This will permanently delete <strong style={{ color: txtMain }}>{confirmDelete.name}</strong> and all its admins, trainers, batches, and students.
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setConfirmDelete(null)}
                style={{
                  flex: 1, padding: "9px 0", borderRadius: 8, fontSize: 13, fontWeight: 600,
                  background: inputBg, color: txtMain, border: `1px solid ${border}`, cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteOrg}
                style={{
                  flex: 1, padding: "9px 0", borderRadius: 8, fontSize: 13, fontWeight: 700,
                  background: "#ef4444", color: "#fff", border: "none", cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// ORG ROW — extracted for cleanliness
// ─────────────────────────────────────────────
const OrgRow = ({ org, stats, dark, txtMain, txtSub, border, onRowClick, onStatusToggle, onDelete }) => {
  const [hov, setHov] = useState(false);
  const rowBg = hov ? (dark ? "rgba(255,255,255,0.04)" : "#f8fafc") : "transparent";

  return (
    <div
      onClick={onRowClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr 1fr 80px 80px 80px 80px 100px",
        padding: "13px 18px", cursor: "pointer",
        background: rowBg, transition: "background 0.15s",
        borderBottom: `1px solid ${border}`,
        alignItems: "center",
      }}
    >
      {/* Name + domain */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: txtMain }}>{org.name}</div>
        <div style={{ fontSize: 11, color: txtSub }}>{org.domain}</div>
      </div>

      {/* Status badge */}
      <div><Badge cfg={STATUS_CONFIG[org.status]} /></div>

      {/* Plan badge */}
      <div><Badge cfg={PLAN_CONFIG[org.plan]} /></div>

      {/* Counts */}
      <div style={{ fontSize: 13, fontWeight: 600, color: txtMain }}>{stats.totalAdmins}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: txtMain }}>{stats.totalTrainers}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: txtMain }}>{stats.totalBatches}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: txtMain }}>{stats.totalStudents}</div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 6 }} onClick={(e) => e.stopPropagation()}>
        {/* Toggle status */}
        <button
          onClick={onStatusToggle}
          title={org.status === "active" ? "Deactivate" : "Activate"}
          style={{
            width: 28, height: 28, borderRadius: 6, border: "none", cursor: "pointer",
            background: org.status === "active" ? "#dcfce7" : "#fee2e2",
            color: org.status === "active" ? "#16a34a" : "#dc2626",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            {org.status === "active"
              ? <path d="M18.36 6.64A9 9 0 0 1 20.77 15M6.16 6.16a9 9 0 1 0 12.68 12.68M2 2l20 20" />
              : <path d="M18.36 6.64a9 9 0 1 1-12.73 0M12 2v10" />}
          </svg>
        </button>

        {/* Delete */}
        <button
          onClick={onDelete}
          title="Delete"
          style={{
            width: 28, height: 28, borderRadius: 6, border: "none", cursor: "pointer",
            background: "#fee2e2", color: "#dc2626",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default OrganizationPage;