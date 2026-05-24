// pages/StudentDetailsPage.jsx
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

const Badge = ({ cfg }) => {
  const c = cfg || STATUS_CONFIG.inactive;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 999, background: c.bg, color: c.color }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.dot, flexShrink: 0 }} />
      {c.label}
    </span>
  );
};

const TabBtn = ({ label, active, onClick, dark, accent = "#14b8a6" }) => (
  <button onClick={onClick} style={{
    padding: "7px 14px", borderRadius: 7, fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer",
    background: active ? accent : (dark ? "rgba(255,255,255,0.05)" : "#f1f5f9"),
    color: active ? "#fff" : (dark ? "#94a3b8" : "#64748b"), transition: "all 0.15s",
  }}>
    {label}
  </button>
);

// ─────────────────────────────────────────────
// LINKED ENTITY CARD
// ─────────────────────────────────────────────
const EntityCard = ({ icon, title, subtitle, badge, onNavigate, navigateLabel, dark }) => {
  const cardBg  = dark ? "rgba(255,255,255,0.04)" : "#f8fafc";
  const cardBdr = dark ? "rgba(255,255,255,0.06)" : "#e5e7eb";
  const txtMain = dark ? "#f1f5f9" : "#0f172a";
  const txtSub  = dark ? "#64748b" : "#94a3b8";
  return (
    <div style={{ padding: "16px 18px", borderRadius: 12, background: cardBg, border: `1px solid ${cardBdr}`, flex: 1, minWidth: 180 }}>
      <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: 14, fontWeight: 700, color: txtMain }}>{title || "—"}</div>
      {subtitle && <div style={{ fontSize: 12, color: txtSub, marginTop: 3 }}>{subtitle}</div>}
      {badge && <div style={{ marginTop: 8 }}>{badge}</div>}
      {onNavigate && (
        <button onClick={onNavigate} style={{
          marginTop: 12, width: "100%", padding: "7px 0", borderRadius: 7, fontSize: 11, fontWeight: 600,
          background: dark ? "rgba(99,102,241,0.12)" : "#ede9fe", color: dark ? "#a78bfa" : "#6d28d9",
          border: "none", cursor: "pointer", transition: "all 0.15s",
        }}>
          {navigateLabel || "View Details"}
        </button>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────
const StudentDetailsPage = () => {
  const { studentId } = useParams();
  const navigate      = useNavigate();
  const { dark }      = useTheme();

  const {
    organizations,
    orgAdmins: allOrgAdmins,
    trainers:  allTrainers,
    batches:   allBatches,
    students:  allStudents,
  } = useSaas();

  const [activeTab, setActiveTab] = useState("profile");

  // Resolve
  const student = allStudents.find((s) => s.id === studentId);
  const batch   = student ? allBatches.find((b) => b.id === student.batchId) : null;
  const trainer = student ? allTrainers.find((t) => t.id === student.trainerId) : null;
  const org     = student ? organizations.find((o) => o.id === student.organizationId) : null;

  // tokens
  const cardBg  = dark ? "rgba(255,255,255,0.03)" : "#ffffff";
  const cardBdr = dark ? "rgba(255,255,255,0.08)" : "#e5e7eb";
  const txtMain = dark ? "#f1f5f9" : "#0f172a";
  const txtSub  = dark ? "#64748b" : "#94a3b8";
  const divClr  = dark ? "rgba(255,255,255,0.06)" : "#f1f5f9";

  if (!student) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: txtSub }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>👨‍🎓</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: txtMain }}>Student Not Found</div>
        <button onClick={() => navigate(-1)} style={{ marginTop: 20, padding: "10px 20px", borderRadius: 8, background: "#14b8a6", color: "#fff", border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>
          Go Back
        </button>
      </div>
    );
  }

  const [a, b]    = avatarColor(student.name);
  const statusCfg = STATUS_CONFIG[student.status] || STATUS_CONFIG.inactive;
  const prog      = student.progress || 0;
  const progColor = prog >= 75 ? "#10b981" : prog >= 40 ? "#f59e0b" : "#ef4444";

  // Build breadcrumb
  const breadcrumbItems = org && batch && trainer
    ? [
        { label: "Organizations", href: "/superadmin/organizations" },
        { label: org.name, href: `/superadmin/organizations/${org.id}` },
        { label: trainer.name, href: `/superadmin/trainers/${trainer.id}` },
        { label: batch.name, href: `/superadmin/batches/${batch.id}` },
        { label: student.name },
      ]
    : org
    ? [
        { label: "Organizations", href: "/superadmin/organizations" },
        { label: org.name, href: `/superadmin/organizations/${org.id}` },
        { label: student.name },
      ]
    : [{ label: student.name }];

  const tabs = [
    { key: "profile",     label: "Profile" },
    { key: "relations",   label: "Relations" },
    { key: "attendance",  label: "Attendance" },
    { key: "performance", label: "Performance" },
    { key: "certificates",label: "Certificates" },
    { key: "analytics",   label: "Analytics" },
  ];

  // Mock certificates
  const certificates = student.certificates || [
    ...(prog >= 100 ? [{ id: 1, name: "Course Completion", date: new Date().toISOString(), issued: true }] : []),
    { id: 2, name: "Participation Certificate", date: student.joinedAt, issued: prog >= 50 },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Breadcrumb */}
      <BreadcrumbNavigation items={breadcrumbItems} />

      {/* Student Header */}
      <div style={{ background: `linear-gradient(135deg, #0e7490, #14b8a6)`, borderRadius: 14, padding: "24px 28px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 18, flexWrap: "wrap" }}>
          <div style={{ width: 68, height: 68, borderRadius: "50%", background: `linear-gradient(135deg,${a},${b})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 22, fontWeight: 800, flexShrink: 0, border: "3px solid rgba(255,255,255,0.3)" }}>
            {initials(student.name)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "-0.02em" }}>{student.name}</h1>
              <span style={{ fontSize: 11, padding: "3px 9px", borderRadius: 99, background: "rgba(255,255,255,0.20)", color: "#fff", fontWeight: 600 }}>
                {statusCfg.label}
              </span>
            </div>
            <div style={{ display: "flex", gap: 20, marginTop: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>✉️ {student.email}</span>
              {org && <span style={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>🏢 {org.name}</span>}
              {batch && <span style={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>📦 {batch.name}</span>}
              {trainer && <span style={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>👨‍🏫 {trainer.name}</span>}
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", marginTop: 4 }}>
              Joined {formatDate(student.joinedAt)} · {student.enrolledCourses || 0} courses enrolled
            </div>
          </div>

          {/* Progress ring */}
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 36, fontWeight: 800, color: "#fff", lineHeight: 1 }}>{prog}%</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>Progress</div>
            <div style={{ marginTop: 6, width: 80, height: 6, borderRadius: 99, background: "rgba(255,255,255,0.20)" }}>
              <div style={{ width: `${prog}%`, height: "100%", background: "#fff", borderRadius: 99, transition: "width 0.5s" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {tabs.map((tab) => (
          <TabBtn key={tab.key} label={tab.label} active={activeTab === tab.key} onClick={() => setActiveTab(tab.key)} dark={dark} accent="#0891b2" />
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ background: cardBg, border: `1px solid ${cardBdr}`, borderRadius: 12, overflow: "hidden" }}>

        {/* ── PROFILE ── */}
        {activeTab === "profile" && (
          <div style={{ padding: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: txtMain, marginBottom: 16 }}>Student Profile</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {[
                { label: "Full Name",        value: student.name },
                { label: "Email",            value: student.email },
                { label: "Status",           value: statusCfg.label },
                { label: "Organization",     value: org?.name || "—" },
                { label: "Batch",            value: batch?.name || "—" },
                { label: "Trainer",          value: trainer?.name || "—" },
                { label: "Enrolled Courses", value: student.enrolledCourses || 0 },
                { label: "Progress",         value: `${prog}%` },
                { label: "Joined",           value: formatDate(student.joinedAt) },
                { label: "Last Login",       value: student.lastLogin ? formatDate(student.lastLogin) : "Never" },
                { label: "Phone",            value: student.phone || "—" },
                { label: "Location",         value: student.location || "—" },
              ].map((row) => (
                <div key={row.label} style={{ padding: "12px 16px", borderRadius: 10, background: dark ? "rgba(255,255,255,0.04)" : "#f8fafc", border: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "#e5e7eb"}` }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: txtSub, textTransform: "uppercase", marginBottom: 4 }}>{row.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: txtMain }}>{row.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── RELATIONS ── */}
        {activeTab === "relations" && (
          <div style={{ padding: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: txtMain, marginBottom: 16 }}>Related Entities</div>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <EntityCard
                icon="🏢"
                title={org?.name || "No Organization"}
                subtitle={org?.industry || org?.domain}
                badge={org && <Badge cfg={STATUS_CONFIG[org.status] || STATUS_CONFIG.inactive} />}
                onNavigate={org ? () => navigate(`/superadmin/organizations/${org.id}`) : null}
                navigateLabel="View Organization"
                dark={dark}
              />
              <EntityCard
                icon="👨‍🏫"
                title={trainer?.name || "No Trainer Assigned"}
                subtitle={trainer?.specialization || trainer?.email}
                badge={trainer && <Badge cfg={STATUS_CONFIG[trainer.status] || STATUS_CONFIG.inactive} />}
                onNavigate={trainer ? () => navigate(`/superadmin/trainers/${trainer.id}`) : null}
                navigateLabel="View Trainer"
                dark={dark}
              />
              <EntityCard
                icon="📦"
                title={batch?.name || "No Batch Assigned"}
                subtitle={batch?.course}
                badge={batch && <Badge cfg={STATUS_CONFIG[batch.status] || STATUS_CONFIG.inactive} />}
                onNavigate={batch ? () => navigate(`/superadmin/batches/${batch.id}`) : null}
                navigateLabel="View Batch"
                dark={dark}
              />
            </div>
          </div>
        )}

        {/* ── ATTENDANCE ── */}
        {activeTab === "attendance" && (
          <div style={{ padding: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: txtMain, marginBottom: 16 }}>Attendance Record</div>
            {/* Mock weekly attendance */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8, marginBottom: 20 }}>
              {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((day) => {
                const present = Math.random() > 0.25;
                return (
                  <div key={day} style={{ textAlign: "center", padding: "12px 6px", borderRadius: 8, background: present ? (dark ? "rgba(16,185,129,0.12)" : "#d1fae5") : (dark ? "rgba(239,68,68,0.08)" : "#fef2f2"), border: `1px solid ${present ? (dark ? "rgba(16,185,129,0.20)" : "#6ee7b7") : (dark ? "rgba(239,68,68,0.15)" : "#fca5a5")}` }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: txtSub, textTransform: "uppercase" }}>{day}</div>
                    <div style={{ fontSize: 18, marginTop: 4 }}>{present ? "✅" : "❌"}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              {[
                { label: "Present Days",  value: "22", color: "#10b981" },
                { label: "Absent Days",   value: "4",  color: "#ef4444" },
                { label: "Attendance %",  value: "85%", color: "#f59e0b" },
              ].map((item) => (
                <div key={item.label} style={{ textAlign: "center", padding: "16px", borderRadius: 12, background: dark ? "rgba(255,255,255,0.04)" : "#f8fafc", border: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "#e5e7eb"}` }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: item.color }}>{item.value}</div>
                  <div style={{ fontSize: 12, color: txtSub, marginTop: 3 }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PERFORMANCE ── */}
        {activeTab === "performance" && (
          <div style={{ padding: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: txtMain, marginBottom: 16 }}>Performance Overview</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
              {[
                { label: "Overall Progress",     value: `${prog}%`,                     color: progColor,  icon: "📈" },
                { label: "Enrolled Courses",     value: student.enrolledCourses || 0,   color: "#6366f1",  icon: "📚" },
                { label: "Assignments Done",     value: Math.floor(Math.random()*10+5), color: "#14b8a6",  icon: "📝" },
                { label: "Quizzes Attempted",    value: Math.floor(Math.random()*8+2),  color: "#f59e0b",  icon: "❓" },
                { label: "Avg Quiz Score",       value: `${Math.floor(Math.random()*20+70)}%`, color: "#10b981", icon: "🎯" },
                { label: "Certificates Earned",  value: certificates.filter(c=>c.issued).length, color: "#8b5cf6", icon: "🏆" },
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

            {/* Progress bar detail */}
            <div style={{ marginTop: 20, padding: "16px 18px", borderRadius: 12, background: dark ? "rgba(255,255,255,0.04)" : "#f8fafc", border: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "#e5e7eb"}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: txtMain }}>Course Progress</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: progColor }}>{prog}%</span>
              </div>
              <div style={{ height: 8, borderRadius: 99, background: dark ? "rgba(255,255,255,0.08)" : "#e5e7eb", overflow: "hidden" }}>
                <div style={{ width: `${prog}%`, height: "100%", background: `linear-gradient(90deg, ${progColor}, ${progColor}cc)`, borderRadius: 99, transition: "width 0.5s" }} />
              </div>
            </div>
          </div>
        )}

        {/* ── CERTIFICATES ── */}
        {activeTab === "certificates" && (
          <div style={{ padding: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: txtMain, marginBottom: 16 }}>Certificates</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {certificates.map((cert) => (
                <div key={cert.id} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px",
                  borderRadius: 12, background: cert.issued ? (dark ? "rgba(16,185,129,0.06)" : "#f0fdf4") : (dark ? "rgba(255,255,255,0.03)" : "#f8fafc"),
                  border: `1px solid ${cert.issued ? (dark ? "rgba(16,185,129,0.20)" : "#bbf7d0") : (dark ? "rgba(255,255,255,0.06)" : "#e5e7eb")}`,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 24 }}>{cert.issued ? "🏆" : "🔒"}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: txtMain }}>{cert.name}</div>
                      <div style={{ fontSize: 11, color: txtSub, marginTop: 2 }}>{cert.issued ? `Issued ${formatDate(cert.date)}` : "Not yet earned"}</div>
                    </div>
                  </div>
                  {cert.issued && (
                    <button style={{ padding: "6px 12px", borderRadius: 7, fontSize: 11, fontWeight: 600, background: "#10b981", color: "#fff", border: "none", cursor: "pointer" }}>
                      Download
                    </button>
                  )}
                </div>
              ))}
              {certificates.length === 0 && (
                <div style={{ textAlign: "center", padding: "40px 0", color: txtSub, fontSize: 13 }}>No certificates yet</div>
              )}
            </div>
          </div>
        )}

        {/* ── ANALYTICS ── */}
        {activeTab === "analytics" && (
          <div style={{ padding: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: txtMain, marginBottom: 16 }}>Student Analytics</div>

            {/* Relation summary */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
              <div style={{ padding: "14px 16px", borderRadius: 10, background: dark ? "rgba(99,102,241,0.08)" : "#eef2ff", border: `1px solid ${dark ? "rgba(99,102,241,0.20)" : "#c7d2fe"}` }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: dark ? "#a5b4fc" : "#6366f1", textTransform: "uppercase", letterSpacing: "0.08em" }}>Organization</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: txtMain, marginTop: 4 }}>{org?.name || "—"}</div>
              </div>
              <div style={{ padding: "14px 16px", borderRadius: 10, background: dark ? "rgba(139,92,246,0.08)" : "#f5f3ff", border: `1px solid ${dark ? "rgba(139,92,246,0.20)" : "#ddd6fe"}` }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: dark ? "#a78bfa" : "#7c3aed", textTransform: "uppercase", letterSpacing: "0.08em" }}>Trainer</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: txtMain, marginTop: 4 }}>{trainer?.name || "—"}</div>
              </div>
              <div style={{ padding: "14px 16px", borderRadius: 10, background: dark ? "rgba(59,130,246,0.08)" : "#eff6ff", border: `1px solid ${dark ? "rgba(59,130,246,0.20)" : "#bfdbfe"}` }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: dark ? "#60a5fa" : "#2563eb", textTransform: "uppercase", letterSpacing: "0.08em" }}>Batch</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: txtMain, marginTop: 4 }}>{batch?.name || "—"}</div>
              </div>
            </div>

            {/* Time on platform */}
            <div style={{ padding: "16px 18px", borderRadius: 12, background: dark ? "rgba(255,255,255,0.04)" : "#f8fafc", border: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "#e5e7eb"}` }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: txtMain, marginBottom: 12 }}>Engagement Metrics</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                {[
                  { label: "Days Active",     value: Math.floor(Math.random()*50+20) },
                  { label: "Hours Spent",     value: Math.floor(Math.random()*100+40) },
                  { label: "Logins",          value: Math.floor(Math.random()*80+15) },
                  { label: "Forum Posts",     value: Math.floor(Math.random()*20) },
                ].map((m) => (
                  <div key={m.label} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "#14b8a6" }}>{m.value}</div>
                    <div style={{ fontSize: 10, color: txtSub, marginTop: 2 }}>{m.label}</div>
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

export default StudentDetailsPage;