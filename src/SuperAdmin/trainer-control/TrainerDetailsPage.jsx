// pages/TrainerDetailsPage.jsx
// Route: /superadmin/trainers/:trainerId
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

const StatMini = ({ value, label, color, dark }) => (
  <div style={{ textAlign: "center", padding: "14px 18px", borderRadius: 10, background: dark ? "rgba(255,255,255,0.04)" : "#f8fafc", flex: 1, minWidth: 0 }}>
    <div style={{ fontSize: 26, fontWeight: 800, color: color || (dark ? "#f1f5f9" : "#0f172a"), lineHeight: 1 }}>{value}</div>
    <div style={{ fontSize: 11, color: dark ? "#64748b" : "#94a3b8", marginTop: 3 }}>{label}</div>
  </div>
);

const TabBtn = ({ label, active, count, onClick, dark }) => (
  <button onClick={onClick} style={{
    padding: "7px 14px", borderRadius: 7, fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer",
    background: active ? "#7c3aed" : (dark ? "rgba(255,255,255,0.05)" : "#f1f5f9"),
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
    fontSize: 11, fontWeight: 600, background: dark ? "rgba(139,92,246,0.12)" : "#ede9fe",
    color: dark ? "#a78bfa" : "#7c3aed", border: "none", cursor: "pointer", transition: "all 0.15s",
  }}>
    <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
    View Details
  </button>
);

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────
const TrainerDetailsPage = () => {
  const { trainerId } = useParams();
  const navigate = useNavigate();
  const { dark }  = useTheme();

  const {
    organizations,
    orgAdmins: allOrgAdmins,
    trainers:  allTrainers,
    batches:   allBatches,
    students:  allStudents,
    getTrainerData,
  } = useSaas();

  const [activeTab, setActiveTab] = useState("batches");

  // Resolve
  const trainer = allTrainers.find((t) => t.id === trainerId);
  const org     = trainer ? organizations.find((o) => o.id === trainer.organizationId) : null;

  // Relational filtering — only this trainer's data
  const trainerBatches  = allBatches.filter((b) => b.trainerId === trainerId);
  const trainerStudents = allStudents.filter((s) => s.trainerId === trainerId);

  // tokens
  const cardBg  = dark ? "rgba(255,255,255,0.03)" : "#ffffff";
  const cardBdr = dark ? "rgba(255,255,255,0.08)" : "#e5e7eb";
  const thBg    = dark ? "rgba(255,255,255,0.04)" : "#f8fafc";
  const thColor = dark ? "#64748b" : "#94a3b8";
  const txtMain = dark ? "#f1f5f9" : "#0f172a";
  const txtSub  = dark ? "#64748b" : "#94a3b8";
  const divClr  = dark ? "rgba(255,255,255,0.06)" : "#f1f5f9";

  if (!trainer) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: txtSub }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>👨‍🏫</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: txtMain }}>Trainer Not Found</div>
        <button onClick={() => navigate(-1)} style={{ marginTop: 20, padding: "10px 20px", borderRadius: 8, background: "#7c3aed", color: "#fff", border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>
          Go Back
        </button>
      </div>
    );
  }

  const [a, b]    = avatarColor(trainer.name);
  const statusCfg = STATUS_CONFIG[trainer.status] || STATUS_CONFIG.inactive;
  const avgProg   = trainerStudents.length
    ? Math.round(trainerStudents.reduce((acc, s) => acc + (s.progress || 0), 0) / trainerStudents.length)
    : 0;

  // Build breadcrumb dynamically
  const breadcrumbItems = org
    ? [
        { label: "Organizations", href: "/superadmin/organizations" },
        { label: org.name, href: `/superadmin/organizations/${org.id}` },
        { label: trainer.name },
      ]
    : [
        { label: "Organizations", href: "/superadmin/organizations" },
        { label: trainer.name },
      ];

  const tabs = [
    { key: "profile",     label: "Profile" },
    { key: "batches",     label: "Batches",  count: trainerBatches.length },
    { key: "students",    label: "Students", count: trainerStudents.length },
    { key: "attendance",  label: "Attendance" },
    { key: "performance", label: "Performance" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Breadcrumb */}
      <BreadcrumbNavigation items={breadcrumbItems} />

      {/* Trainer Header */}
      <div style={{ background: cardBg, border: `1px solid ${cardBdr}`, borderRadius: 14, padding: "24px 28px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 18, flexWrap: "wrap" }}>
          <div style={{ width: 68, height: 68, borderRadius: "50%", background: `linear-gradient(135deg,${a},${b})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 22, fontWeight: 800, flexShrink: 0 }}>
            {initials(trainer.name)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: txtMain, margin: 0, letterSpacing: "-0.02em" }}>{trainer.name}</h1>
              <Badge cfg={statusCfg} />
              {trainer.specialization && (
                <span style={{ fontSize: 11, padding: "3px 9px", borderRadius: 99, background: dark ? "rgba(139,92,246,0.12)" : "#ede9fe", color: dark ? "#a78bfa" : "#7c3aed", fontWeight: 600 }}>
                  {trainer.specialization}
                </span>
              )}
            </div>
            <div style={{ display: "flex", gap: 20, marginTop: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 12, color: txtSub }}>✉️ {trainer.email}</span>
              {org && <span style={{ fontSize: 12, color: txtSub }}>🏢 {org.name}</span>}
              {trainer.rating && <span style={{ fontSize: 12, color: txtSub }}>⭐ {parseFloat(trainer.rating).toFixed(1)} rating</span>}
            </div>
            <div style={{ fontSize: 11, color: txtSub, marginTop: 4 }}>
              Joined {formatDate(trainer.joinedAt)} · {trainer.totalStudents || trainerStudents.length} total students trained
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <StatMini value={trainerBatches.length}  label="Batches"      color="#7c3aed" dark={dark} />
          <StatMini value={trainerStudents.length} label="Students"     color="#14b8a6" dark={dark} />
          <StatMini value={`${avgProg}%`}          label="Avg Progress" color="#f59e0b" dark={dark} />
          <StatMini value={trainer.rating ? parseFloat(trainer.rating).toFixed(1) : "—"} label="Rating" color="#10b981" dark={dark} />
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

        {/* ── PROFILE ── */}
        {activeTab === "profile" && (
          <div style={{ padding: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: txtMain, marginBottom: 16 }}>Trainer Profile</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {[
                { label: "Full Name",       value: trainer.name },
                { label: "Email",           value: trainer.email },
                { label: "Specialization",  value: trainer.specialization || "—" },
                { label: "Organization",    value: org?.name || "—" },
                { label: "Status",          value: statusCfg.label },
                { label: "Rating",          value: trainer.rating ? `${parseFloat(trainer.rating).toFixed(1)} / 5.0` : "Not rated" },
                { label: "Joined",          value: formatDate(trainer.joinedAt) },
                { label: "Last Login",      value: trainer.lastLogin ? formatDate(trainer.lastLogin) : "Never" },
                { label: "Total Students",  value: trainer.totalStudents || trainerStudents.length },
                { label: "Total Batches",   value: trainerBatches.length },
              ].map((row) => (
                <div key={row.label} style={{ padding: "12px 16px", borderRadius: 10, background: dark ? "rgba(255,255,255,0.04)" : "#f8fafc", border: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "#e5e7eb"}` }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: txtSub, textTransform: "uppercase", marginBottom: 4 }}>{row.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: txtMain }}>{row.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── BATCHES ── */}
        {activeTab === "batches" && (
          <>
            <div style={{ padding: "14px 18px", borderBottom: `1px solid ${divClr}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: txtMain }}>Assigned Batches</div>
              <div style={{ fontSize: 12, color: txtSub }}>{trainerBatches.length} total</div>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: thBg }}>
                    {["BATCH", "STATUS", "STUDENTS", "PROGRESS", "CREATED", "ACTION"].map(h => (
                      <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: thColor, borderBottom: `1px solid ${divClr}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {trainerBatches.length === 0 ? (
                    <tr><td colSpan={6} style={{ textAlign: "center", padding: "40px 0", color: txtSub, fontSize: 13 }}>No batches assigned</td></tr>
                  ) : trainerBatches.map((batch) => {
                    const batchStudents = trainerStudents.filter(s => s.batchId === batch.id);
                    const batchAvgProg  = batchStudents.length ? Math.round(batchStudents.reduce((a,s)=>a+(s.progress||0),0)/batchStudents.length) : 0;
                    const progColor     = batchAvgProg >= 75 ? "#10b981" : batchAvgProg >= 40 ? "#f59e0b" : "#ef4444";
                    return (
                      <tr key={batch.id} style={{ borderBottom: `1px solid ${divClr}`, transition: "background 0.1s" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = dark ? "rgba(255,255,255,0.03)" : "#f8fafc"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
                        <td style={{ padding: "11px 16px" }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: txtMain }}>{batch.name}</div>
                          <div style={{ fontSize: 11, color: txtSub }}>{batch.course || "No course"}</div>
                        </td>
                        <td style={{ padding: "11px 16px" }}><Badge cfg={STATUS_CONFIG[batch.status] || STATUS_CONFIG.inactive} /></td>
                        <td style={{ padding: "11px 16px", fontSize: 13, fontWeight: 700, color: txtMain }}>{batchStudents.length}</td>
                        <td style={{ padding: "11px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                            <div style={{ width: 60, height: 5, borderRadius: 99, background: dark ? "rgba(255,255,255,0.08)" : "#e5e7eb", overflow: "hidden" }}>
                              <div style={{ width: `${batchAvgProg}%`, height: "100%", background: progColor, borderRadius: 99 }} />
                            </div>
                            <span style={{ fontSize: 11, fontWeight: 600, color: progColor }}>{batchAvgProg}%</span>
                          </div>
                        </td>
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
            <div style={{ padding: "14px 18px", borderBottom: `1px solid ${divClr}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: txtMain }}>Students Under This Trainer</div>
              <div style={{ fontSize: 12, color: txtSub }}>{trainerStudents.length} total</div>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: thBg }}>
                    {["STUDENT", "STATUS", "BATCH", "PROGRESS", "JOINED", "ACTION"].map(h => (
                      <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: thColor, borderBottom: `1px solid ${divClr}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {trainerStudents.length === 0 ? (
                    <tr><td colSpan={6} style={{ textAlign: "center", padding: "40px 0", color: txtSub, fontSize: 13 }}>No students assigned</td></tr>
                  ) : trainerStudents.map((student) => {
                    const [sa, sb] = avatarColor(student.name);
                    const batch    = trainerBatches.find(b => b.id === student.batchId);
                    const prog     = student.progress || 0;
                    const progColor= prog >= 75 ? "#10b981" : prog >= 40 ? "#f59e0b" : "#ef4444";
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
                        <td style={{ padding: "11px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                            <div style={{ width: 60, height: 5, borderRadius: 99, background: dark ? "rgba(255,255,255,0.08)" : "#e5e7eb", overflow: "hidden" }}>
                              <div style={{ width: `${prog}%`, height: "100%", background: progColor, borderRadius: 99 }} />
                            </div>
                            <span style={{ fontSize: 11, fontWeight: 600, color: progColor }}>{prog}%</span>
                          </div>
                        </td>
                        <td style={{ padding: "11px 16px", fontSize: 11, color: txtSub }}>{formatDate(student.joinedAt)}</td>
                        <td style={{ padding: "11px 16px" }}><ViewDetailsBtn onClick={() => navigate(`/superadmin/students/${student.id}`)} dark={dark} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ── ATTENDANCE ── */}
        {activeTab === "attendance" && (
          <div style={{ padding: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: txtMain, marginBottom: 16 }}>Attendance Overview</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
              {trainerBatches.map((batch) => {
                const batchStudents = trainerStudents.filter(s => s.batchId === batch.id);
                const attendance    = Math.floor(Math.random() * 20 + 75); // mock
                const attColor      = attendance >= 90 ? "#10b981" : attendance >= 75 ? "#f59e0b" : "#ef4444";
                return (
                  <div key={batch.id} style={{ padding: "16px 18px", borderRadius: 12, background: dark ? "rgba(255,255,255,0.04)" : "#f8fafc", border: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "#e5e7eb"}` }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: txtMain, marginBottom: 8 }}>{batch.name}</div>
                    <div style={{ fontSize: 28, fontWeight: 800, color: attColor }}>{attendance}%</div>
                    <div style={{ fontSize: 11, color: txtSub, marginTop: 2 }}>avg attendance · {batchStudents.length} students</div>
                    <div style={{ marginTop: 8, height: 6, borderRadius: 99, background: dark ? "rgba(255,255,255,0.08)" : "#e5e7eb", overflow: "hidden" }}>
                      <div style={{ width: `${attendance}%`, height: "100%", background: attColor, borderRadius: 99 }} />
                    </div>
                  </div>
                );
              })}
              {trainerBatches.length === 0 && (
                <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "40px 0", color: txtSub, fontSize: 13 }}>
                  No batches to show attendance for
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── PERFORMANCE ── */}
        {activeTab === "performance" && (
          <div style={{ padding: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: txtMain, marginBottom: 16 }}>Performance Metrics</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
              {[
                { label: "Overall Rating",      value: trainer.rating ? `${parseFloat(trainer.rating).toFixed(1)} / 5.0` : "Not rated", color: "#f59e0b", icon: "⭐" },
                { label: "Avg Student Progress", value: `${avgProg}%`,             color: "#10b981", icon: "📈" },
                { label: "Total Students",       value: trainerStudents.length,     color: "#14b8a6", icon: "👨‍🎓" },
                { label: "Active Batches",       value: trainerBatches.filter(b=>b.status==="active").length, color: "#7c3aed", icon: "📦" },
                { label: "Completed Batches",    value: trainerBatches.filter(b=>b.status==="completed").length, color: "#6366f1", icon: "✅" },
                { label: "Completion Rate",      value: trainerStudents.length ? `${Math.round(trainerStudents.filter(s=>s.progress>=100).length/trainerStudents.length*100)}%` : "0%", color: "#3b82f6", icon: "🏆" },
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

export default TrainerDetailsPage;