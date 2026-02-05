import React, { useState } from "react";

const stats = [
  {
    title: "Total Organisations",
    value: "148",
    change: "+12%",
    up: true,
    color: "#6366f1",
    bg: "rgba(99,102,241,0.08)",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    title: "Active Admins",
    value: "364",
    change: "+8%",
    up: true,
    color: "#10b981",
    bg: "rgba(16,185,129,0.08)",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    title: "Active Trainers",
    value: "892",
    change: "+5%",
    up: true,
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-1H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-1h7z" />
      </svg>
    ),
  },
  {
    title: "Total Students",
    value: "12,458",
    change: "+23%",
    up: true,
    color: "#ec4899",
    bg: "rgba(236,72,153,0.08)",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
  },
];

const recentActivity = [
  { id: 1, action: "New organisation registered", org: "Innovate Labs", time: "2 min ago", type: "add", color: "#6366f1" },
  { id: 2, action: "Admin role updated", org: "TechVenture Inc.", time: "15 min ago", type: "edit", color: "#f59e0b" },
  { id: 3, action: "Trainer assigned", org: "EduZone Academy", time: "1 hr ago", type: "assign", color: "#10b981" },
  { id: 4, action: "Student batch enrolled", org: "Future Skills Hub", time: "2 hr ago", type: "add", color: "#6366f1" },
  { id: 5, action: "Email campaign sent", org: "System", time: "3 hr ago", type: "email", color: "#ec4899" },
  { id: 6, action: "Audit log flagged", org: "Security System", time: "5 hr ago", type: "alert", color: "#ef4444" },
];

const topOrgs = [
  { name: "Innovate Labs", students: 2340, trainers: 48, growth: 18 },
  { name: "TechVenture Inc.", students: 1890, trainers: 36, growth: 12 },
  { name: "EduZone Academy", students: 1560, trainers: 29, growth: 24 },
  { name: "Future Skills Hub", students: 1230, trainers: 22, growth: 9 },
  { name: "CodeMasters Pro", students: 980, trainers: 18, growth: 15 },
];

export default function SuperAdminDashboard({ onNavigate }) {
  const [activeTab, setActiveTab] = useState("week");

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
      {/* Stat Cards Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "18px", marginBottom: "24px" }}>
        {stats.map((s, i) => (
          <div
            key={i}
            style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "22px",
              border: "1px solid #eef0f2",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              transition: "transform 0.2s, box-shadow 0.2s",
              cursor: "default",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "16px" }}>
              <div
                style={{
                  width: "46px",
                  height: "46px",
                  borderRadius: "12px",
                  background: s.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: s.color,
                }}
              >
                {s.icon}
              </div>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: s.up ? "#10b981" : "#ef4444",
                  background: s.up ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                  padding: "4px 10px",
                  borderRadius: "20px",
                }}
              >
                {s.up ? "↑" : "↓"} {s.change}
              </span>
            </div>
            <div style={{ fontSize: "26px", fontWeight: 700, color: "#111827", letterSpacing: "-0.5px" }}>{s.value}</div>
            <div style={{ fontSize: "13px", color: "#6b7280", marginTop: "4px" }}>{s.title}</div>
          </div>
        ))}
      </div>

      {/* Middle Row: Chart + Activity */}
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: "18px", marginBottom: "24px" }}>
        {/* Chart Card */}
        <div
          style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "24px",
            border: "1px solid #eef0f2",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
            <div>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#111827" }}>Platform Growth</h3>
              <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#9ca3af" }}>Users & organisations over time</p>
            </div>
            <div style={{ display: "flex", gap: "4px", background: "#f3f4f6", borderRadius: "8px", padding: "3px" }}>
              {["week", "month", "year"].map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  style={{
                    border: "none",
                    borderRadius: "6px",
                    padding: "5px 14px",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    background: activeTab === t ? "#fff" : "transparent",
                    color: activeTab === t ? "#111827" : "#6b7280",
                    boxShadow: activeTab === t ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                    transition: "all 0.2s",
                    textTransform: "capitalize",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Mini Bar Chart */}
          <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "160px", padding: "0 4px" }}>
            {[45, 62, 48, 75, 55, 82, 90, 68, 95, 78, 88, 100].map((val, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", height: "100%" , justifyContent: "flex-end" }}>
                <div
                  style={{
                    width: "100%",
                    height: `${val}%`,
                    borderRadius: "6px 6px 0 0",
                    background: i === 11 ? "linear-gradient(180deg, #6366f1, #8b5cf6)" : i >= 8 ? "linear-gradient(180deg, #a5b4fc, #c7d2fe)" : "#eef0f2",
                    transition: "height 0.6s cubic-bezier(0.4,0,0.2,1)",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "-22px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      fontSize: "10px",
                      fontWeight: 600,
                      color: i >= 8 ? "#6366f1" : "#9ca3af",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {val}%
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px" }}>
            {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, i) => (
              <span key={i} style={{ fontSize: "11px", color: "#9ca3af", flex: 1, textAlign: "center" }}>{m}</span>
            ))}
          </div>

          {/* Legend */}
          <div style={{ display: "flex", gap: "20px", marginTop: "18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "12px", height: "12px", borderRadius: "3px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }} />
              <span style={{ fontSize: "12px", color: "#6b7280" }}>Current Period</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "12px", height: "12px", borderRadius: "3px", background: "#c7d2fe" }} />
              <span style={{ fontSize: "12px", color: "#6b7280" }}>Previous Period</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "12px", height: "12px", borderRadius: "3px", background: "#eef0f2" }} />
              <span style={{ fontSize: "12px", color: "#6b7280" }}>Baseline</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div
          style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "24px",
            border: "1px solid #eef0f2",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px" }}>
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#111827" }}>Recent Activity</h3>
            <button
              style={{
                border: "none",
                background: "none",
                color: "#6366f1",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              View all →
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {recentActivity.map((item) => (
              <div key={item.id} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    background: `${item.color}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: item.color }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#111827" }}>{item.action}</div>
                  <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "2px" }}>
                    {item.org} · {item.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Top Organisations Table */}
      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          border: "1px solid #eef0f2",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          overflow: "hidden",
        }}
      >
        <div style={{ padding: "22px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #f0f1f3" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#111827" }}>Top Performing Organisations</h3>
            <p style={{ margin: "3px 0 0", fontSize: "13px", color: "#9ca3af" }}>By student count & growth rate</p>
          </div>
          <button
            onClick={() => onNavigate && onNavigate("admin-control")}
            style={{
              padding: "8px 18px",
              borderRadius: "8px",
              border: "1px solid #6366f1",
              background: "transparent",
              color: "#6366f1",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#6366f1";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#6366f1";
            }}
          >
            Manage All
          </button>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#fafafa" }}>
              {["#", "Organisation", "Students", "Trainers", "Growth"].map((h, i) => (
                <th
                  key={i}
                  style={{
                    padding: "12px 24px",
                    textAlign: i === 0 ? "center" : "left",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#9ca3af",
                    textTransform: "uppercase",
                    letterSpacing: "0.8px",
                    borderBottom: "1px solid #f0f1f3",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {topOrgs.map((org, i) => (
              <tr
                key={i}
                style={{ borderBottom: i < topOrgs.length - 1 ? "1px solid #f5f6f7" : "none", transition: "background 0.15s" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#fafbfc")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <td style={{ padding: "14px 24px", textAlign: "center" }}>
                  <span
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "8px",
                      background: i === 0 ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "#f3f4f6",
                      color: i === 0 ? "#fff" : "#6b7280",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: "13px",
                    }}
                  >
                    {i + 1}
                  </span>
                </td>
                <td style={{ padding: "14px 24px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div
                      style={{
                        width: "38px",
                        height: "38px",
                        borderRadius: "10px",
                        background: `hsl(${i * 55 + 220}, 60%, 90%)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "14px",
                        fontWeight: 700,
                        color: `hsl(${i * 55 + 220}, 60%, 40%)`,
                      }}
                    >
                      {org.name[0]}
                    </div>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: 600, color: "#111827" }}>{org.name}</div>
                      <div style={{ fontSize: "12px", color: "#9ca3af" }}>Active since 2024</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "14px 24px", fontSize: "14px", fontWeight: 600, color: "#374151" }}>{org.students.toLocaleString()}</td>
                <td style={{ padding: "14px 24px", fontSize: "14px", color: "#6b7280" }}>{org.trainers}</td>
                <td style={{ padding: "14px 24px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ flex: 1, maxWidth: "80px", height: "6px", borderRadius: "3px", background: "#f0f1f3", overflow: "hidden" }}>
                      <div style={{ width: `${org.growth * 4}%`, height: "100%", borderRadius: "3px", background: "linear-gradient(90deg, #6366f1, #8b5cf6)" }} />
                    </div>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#10b981" }}>+{org.growth}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}