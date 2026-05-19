// pages/OrganizationAdminDetailsPage.jsx
// SuperAdmin → Organization → Admin detail view
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
  try { return new Date(dateStr).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }); }
  catch { return dateStr; }
}
const AVATAR_COLORS = [
  ["#6366f1","#818cf8"],["#8b5cf6","#a78bfa"],["#ec4899","#f472b6"],
  ["#14b8a6","#2dd4bf"],["#f59e0b","#fbbf24"],["#10b981","#34d399"],
  ["#3b82f6","#60a5fa"],["#ef4444","#f87171"],
];
const avatarColor = (name = "") => AVATAR_COLORS[(name.charCodeAt(0) || 0) % AVATAR_COLORS.length];

// ─────────────────────────────────────────────
// BADGE
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

// ─────────────────────────────────────────────
// STAT MINI
// ─────────────────────────────────────────────
const StatMini = ({ value, label, color, dark }) => (
  <div style={{ textAlign: "center", padding: "14px 18px", borderRadius: 10, background: dark ? "rgba(255,255,255,0.04)" : "#f8fafc", flex: 1, minWidth: 0 }}>
    <div style={{ fontSize: 26, fontWeight: 800, color: color || (dark ? "#f1f5f9" : "#0f172a"), lineHeight: 1 }}>{value}</div>
    <div style={{ fontSize: 11, color: dark ? "#64748b" : "#94a3b8", marginTop: 3 }}>{label}</div>
  </div>
);

// ─────────────────────────────────────────────
// TAB BUTTON
// ─────────────────────────────────────────────
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

// ─────────────────────────────────────────────
// VIEW DETAILS BUTTON
// ─────────────────────────────────────────────
const ViewDetailsBtn = ({ onClick, dark }) => (
  <button onClick={onClick} style={{
    display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 6,
    fontSize: 11, fontWeight: 600, background: dark ? "rgba(99,102,241,0.12)" : "#ede9fe",
    color: dark ? "#a78bfa" : "#6d28d9", border: "none", cursor: "pointer", transition: "all 0.15s",
  }}>
    <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
    View Details
  </button>
);

// ─────────────────────────────────────────────
// PERMISSIONS DISPLAY
// ─────────────────────────────────────────────
const PERMISSION_LABELS = [
  { key: "manage_trainers",  label: "Manage Trainers",  icon: "👨‍🏫" },
  { key: "manage_students",  label: "Manage Students",  icon: "👨‍🎓" },
  { key: "manage_batches",   label: "Manage Batches",   icon: "📦" },
  { key: "view_analytics",   label: "View Analytics",   icon: "📊" },
  { key: "manage_settings",  label: "Manage Settings",  icon: "⚙️" },
  { key: "send_notifications",label: "Send Notifications", icon: "🔔" },
];

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────
const OrganizationAdminDetailsPage = () => {
  const { orgId, adminId } = useParams();
  const navigate = useNavigate();
  const { dark }  = useTheme();

  const {
    organizations,
    orgAdmins: allOrgAdmins,
    trainers:  allTrainers,
    batches:   allBatches,
    students:  allStudents,
  } = useSaas();

  const [activeTab, setActiveTab] = useState("trainers");

  // Resolve entities
  const org   = organizations.find((o) => o.id === orgId);
  const admin = allOrgAdmins.find((a) => a.id === adminId);

  // Relational data — trainers under this admin's org, batches, students
  const orgTrainers  = allTrainers.filter((t) => t.organizationId === orgId);
  const orgBatches   = allBatches.filter((b) => b.organizationId === orgId);
  const orgStudents  = allStudents.filter((s) => s.organizationId === orgId);

  // tokens
  const cardBg  = dark ? "rgba(255,255,255,0.03)" : "#ffffff";
  const cardBdr = dark ? "rgba(255,255,255,0.08)" : "#e5e7eb";
  const thBg    = dark ? "rgba(255,255,255,0.04)" : "#f8fafc";
  const thColor = dark ? "#64748b" : "#94a3b8";
  const txtMain = dark ? "#f1f5f9" : "#0f172a";
  const txtSub  = dark ? "#64748b" : "#94a3b8";
  const divClr  = dark ? "rgba(255,255,255,0.06)" : "#f1f5f9";

  if (!admin || !org) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: txtSub }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>👤</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: txtMain }}>Admin Not Found</div>
        <button onClick={() => navigate(`/superadmin/organizations/${orgId}`)} style={{ marginTop: 20, padding: "10px 20px", borderRadius: 8, background: "#6366f1", color: "#fff", border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>
          Back to Organization
        </button>
      </div>
    );
  }

  const [a, b]    = avatarColor(admin.name);
  const statusCfg = STATUS_CONFIG[admin.status] || STATUS_CONFIG.inactive;

  const tabs = [
    { key: "trainers", label: "Trainers", count: orgTrainers.length },
    { key: "batches",  label: "Batches",  count: orgBatches.length },
    { key: "students", label: "Students", count: orgStudents.length },
    { key: "permissions", label: "Permissions" },
    { key: "analytics",   label: "Analytics" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Breadcrumb */}
      <BreadcrumbNavigation
        items={[
          { label: "Organizations", href: "/superadmin/organizations" },
          { label: org.name, href: `/superadmin/organizations/${orgId}` },
          { label: admin.name },
        ]}
      />

      {/* Admin Header */}
      <div style={{ background: cardBg, border: `1px solid ${cardBdr}`, borderRadius: 14, padding: "24px 28px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 18, flexWrap: "wrap" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: `linear-gradient(135deg,${a},${b})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 22, fontWeight: 800, flexShrink: 0 }}>
            {initials(admin.name)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: txtMain, margin: 0, letterSpacing: "-0.02em" }}>{admin.name}</h1>
              <Badge cfg={statusCfg} />
              <span style={{ fontSize: 11, padding: "3px 9px", borderRadius: 99, background: "rgba(99,102,241,0.12)", color: "#6366f1", fontWeight: 600 }}>Org Admin</span>
            </div>
            <div style={{ display: "flex", gap: 20, marginTop: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 12, color: txtSub }}>✉️ {admin.email}</span>
              {admin.phone && <span style={{ fontSize: 12, color: txtSub }}>📞 {admin.phone}</span>}
              <span style={{ fontSize: 12, color: txtSub }}>🏢 {org.name}</span>
            </div>
            <div style={{ fontSize: 11, color: txtSub, marginTop: 4 }}>
              Joined {formatDate(admin.joinedAt)} · Last login {admin.lastLogin ? formatDate(admin.lastLogin) : "Never"}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <StatMini value={orgTrainers.length}  label="Trainers"  color="#8b5cf6" dark={dark} />
          <StatMini value={orgBatches.length}   label="Batches"   color="#3b82f6" dark={dark} />
          <StatMini value={orgStudents.length}  label="Students"  color="#14b8a6" dark={dark} />
          <StatMini value={orgStudents.filter(s=>s.status==="active").length} label="Active Stu." color="#10b981" dark={dark} />
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {tabs.map((tab) => (
          <TabBtn key={tab.key} label={tab.label} count={tab.count} active={activeTab === tab.key} onClick={() => setActiveTab(tab.key)} dark={dark} />
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ background: cardBg, border: `1px solid ${cardBdr}`, borderRadius: 12, overflow: "hidden" }}>

        {/* ── TRAINERS ── */}
        {activeTab === "trainers" && (
          <>
            <div style={{ padding: "14px 18px", borderBottom: `1px solid ${divClr}` }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: txtMain }}>Assigned Trainers</div>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: thBg }}>
                    {["TRAINER", "STATUS", "BATCHES", "STUDENTS", "RATING", "ACTION"].map(h => (
                      <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: thColor, borderBottom: `1px solid ${divClr}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orgTrainers.length === 0 ? (
                    <tr><td colSpan={6} style={{ textAlign: "center", padding: "40px 0", color: txtSub, fontSize: 13 }}>No trainers found</td></tr>
                  ) : orgTrainers.map((trainer) => {
                    const [ta, tb] = avatarColor(trainer.name);
                    const tBatches  = orgBatches.filter(b => b.trainerId === trainer.id);
                    const tStudents = orgStudents.filter(s => s.trainerId === trainer.id);
                    return (
                      <tr key={trainer.id} style={{ borderBottom: `1px solid ${divClr}`, transition: "background 0.1s" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = dark ? "rgba(255,255,255,0.03)" : "#f8fafc"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
                        <td style={{ padding: "11px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg,${ta},${tb})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                              {initials(trainer.name)}
                            </div>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 600, color: txtMain }}>{trainer.name}</div>
                              <div style={{ fontSize: 11, color: txtSub }}>{trainer.specialization || trainer.email}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: "11px 16px" }}><Badge cfg={STATUS_CONFIG[trainer.status] || STATUS_CONFIG.inactive} /></td>
                        <td style={{ padding: "11px 16px", fontSize: 13, fontWeight: 700, color: txtMain }}>{tBatches.length}</td>
                        <td style={{ padding: "11px 16px", fontSize: 13, fontWeight: 700, color: txtMain }}>{tStudents.length}</td>
                        <td style={{ padding: "11px 16px", fontSize: 12, color: txtMain }}>{trainer.rating ? `⭐ ${parseFloat(trainer.rating).toFixed(1)}` : "—"}</td>
                        <td style={{ padding: "11px 16px" }}><ViewDetailsBtn onClick={() => navigate(`/superadmin/trainers/${trainer.id}`)} dark={dark} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ── BATCHES ── */}
        {activeTab === "batches" && (
          <>
            <div style={{ padding: "14px 18px", borderBottom: `1px solid ${divClr}` }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: txtMain }}>Batches</div>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: thBg }}>
                    {["BATCH", "STATUS", "TRAINER", "STUDENTS", "CREATED", "ACTION"].map(h => (
                      <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: thColor, borderBottom: `1px solid ${divClr}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orgBatches.length === 0 ? (
                    <tr><td colSpan={6} style={{ textAlign: "center", padding: "40px 0", color: txtSub, fontSize: 13 }}>No batches found</td></tr>
                  ) : orgBatches.map((batch) => {
                    const trainer = orgTrainers.find(t => t.id === batch.trainerId);
                    return (
                      <tr key={batch.id} style={{ borderBottom: `1px solid ${divClr}`, transition: "background 0.1s" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = dark ? "rgba(255,255,255,0.03)" : "#f8fafc"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
                        <td style={{ padding: "11px 16px" }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: txtMain }}>{batch.name}</div>
                          <div style={{ fontSize: 11, color: txtSub }}>{batch.course || "No course"}</div>
                        </td>
                        <td style={{ padding: "11px 16px" }}><Badge cfg={STATUS_CONFIG[batch.status] || STATUS_CONFIG.inactive} /></td>
                        <td style={{ padding: "11px 16px", fontSize: 12, color: txtMain }}>{trainer?.name || "—"}</td>
                        <td style={{ padding: "11px 16px", fontSize: 13, fontWeight: 700, color: txtMain }}>{(batch.studentIds || []).length}</td>
                        <td style={{ padding: "11px 16px", fontSize: 11, color: txtSub }}>{formatDate(batch.createdAt)}</td>
                        <td style={{ padding: "11px 16px" }}><ViewDetailsBtn onClick={() => navigate(`/superadmin/batches/${batch.id}`)} dark={dark} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ── STUDENTS ── */}
        {activeTab === "students" && (
          <>
            <div style={{ padding: "14px 18px", borderBottom: `1px solid ${divClr}` }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: txtMain }}>Students</div>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: thBg }}>
                    {["STUDENT", "STATUS", "BATCH", "TRAINER", "PROGRESS", "ACTION"].map(h => (
                      <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: thColor, borderBottom: `1px solid ${divClr}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orgStudents.length === 0 ? (
                    <tr><td colSpan={6} style={{ textAlign: "center", padding: "40px 0", color: txtSub, fontSize: 13 }}>No students found</td></tr>
                  ) : orgStudents.map((student) => {
                    const [sa, sb] = avatarColor(student.name);
                    const batch   = orgBatches.find(b => b.id === student.batchId);
                    const trainer = orgTrainers.find(t => t.id === student.trainerId);
                    const prog    = student.progress || 0;
                    const progColor = prog >= 75 ? "#10b981" : prog >= 40 ? "#f59e0b" : "#ef4444";
                    return (
                      <tr key={student.id} style={{ borderBottom: `1px solid ${divClr}`, transition: "background 0.1s" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = dark ? "rgba(255,255,255,0.03)" : "#f8fafc"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
                        <td style={{ padding: "11px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg,${sa},${sb})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                              {initials(student.name)}
                            </div>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 600, color: txtMain }}>{student.name}</div>
                              <div style={{ fontSize: 11, color: txtSub }}>{student.email}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: "11px 16px" }}><Badge cfg={STATUS_CONFIG[student.status] || STATUS_CONFIG.inactive} /></td>
                        <td style={{ padding: "11px 16px", fontSize: 12, color: txtMain }}>{batch?.name || "—"}</td>
                        <td style={{ padding: "11px 16px", fontSize: 12, color: txtMain }}>{trainer?.name || "—"}</td>
                        <td style={{ padding: "11px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                            <div style={{ width: 70, height: 5, borderRadius: 99, background: dark ? "rgba(255,255,255,0.08)" : "#e5e7eb", overflow: "hidden" }}>
                              <div style={{ width: `${prog}%`, height: "100%", background: progColor, borderRadius: 99 }} />
                            </div>
                            <span style={{ fontSize: 11, fontWeight: 600, color: progColor }}>{prog}%</span>
                          </div>
                        </td>
                        <td style={{ padding: "11px 16px" }}><ViewDetailsBtn onClick={() => navigate(`/superadmin/students/${student.id}`)} dark={dark} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ── PERMISSIONS ── */}
        {activeTab === "permissions" && (
          <div style={{ padding: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: txtMain, marginBottom: 16 }}>Admin Permissions</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
              {PERMISSION_LABELS.map((perm) => {
                const granted = admin.permissions ? admin.permissions.includes(perm.key) : true;
                return (
                  <div key={perm.key} style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 10,
                    background: granted ? (dark ? "rgba(16,185,129,0.08)" : "#f0fdf4") : (dark ? "rgba(255,255,255,0.03)" : "#f8fafc"),
                    border: `1px solid ${granted ? (dark ? "rgba(16,185,129,0.20)" : "#bbf7d0") : (dark ? "rgba(255,255,255,0.06)" : "#e5e7eb")}`,
                  }}>
                    <span style={{ fontSize: 18 }}>{perm.icon}</span>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: txtMain }}>{perm.label}</div>
                      <div style={{ fontSize: 10, color: granted ? "#10b981" : txtSub, fontWeight: 600 }}>{granted ? "Granted" : "Not Granted"}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── ANALYTICS ── */}
        {activeTab === "analytics" && (
          <div style={{ padding: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: txtMain, marginBottom: 16 }}>Admin Analytics</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
              {[
                { label: "Total Trainers Managed",  value: orgTrainers.length,  color: "#8b5cf6", icon: "👨‍🏫" },
                { label: "Total Batches",            value: orgBatches.length,   color: "#3b82f6", icon: "📦" },
                { label: "Total Students",           value: orgStudents.length,  color: "#14b8a6", icon: "👨‍🎓" },
                { label: "Active Students",          value: orgStudents.filter(s=>s.status==="active").length, color: "#10b981", icon: "✅" },
                { label: "Avg Student Progress",     value: `${orgStudents.length ? Math.round(orgStudents.reduce((a,s)=>a+(s.progress||0),0)/orgStudents.length) : 0}%`, color: "#f59e0b", icon: "📈" },
                { label: "Active Batches",           value: orgBatches.filter(b=>b.status==="active").length, color: "#6366f1", icon: "🎯" },
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
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationAdminDetailsPage;