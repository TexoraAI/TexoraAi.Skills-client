// src/SuperAdmin/dashboard/SuperAdminDashboard.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

let useUserManagement;
try {
  useUserManagement = require("../context/UserManagementContext").useUserManagement;
} catch {
  useUserManagement = () => ({});
}

// ============================================================
// COLOR PALETTE
// ============================================================
const cardThemes = {
  blue: {
    gradient:     "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 60%, #e0f2fe 100%)",
    gradientDark: "linear-gradient(135deg, rgba(14,165,233,0.18) 0%, rgba(56,189,248,0.10) 100%)",
    iconBg:       "linear-gradient(135deg, #38bdf8, #0ea5e9)",
    accent:       "#0ea5e9",
    accentDark:   "#38bdf8",
    border:       "#bae6fd",
    borderDark:   "rgba(56,189,248,0.3)",
    trendPos:     { bg: "rgba(14,165,233,0.15)",  color: "#0369a1" },
    trendPosDark: { bg: "rgba(56,189,248,0.15)",  color: "#38bdf8" },
    trendNeg:     { bg: "rgba(239,68,68,0.12)",   color: "#dc2626" },
    trendNegDark: { bg: "rgba(248,113,113,0.15)", color: "#f87171" },
  },
  violet: {
    gradient:     "linear-gradient(135deg, #ede9fe 0%, #ddd6fe 60%, #ede9fe 100%)",
    gradientDark: "linear-gradient(135deg, rgba(139,92,246,0.18) 0%, rgba(167,139,250,0.10) 100%)",
    iconBg:       "linear-gradient(135deg, #a78bfa, #7c3aed)",
    accent:       "#7c3aed",
    accentDark:   "#a78bfa",
    border:       "#ddd6fe",
    borderDark:   "rgba(167,139,250,0.3)",
    trendPos:     { bg: "rgba(124,58,237,0.12)",  color: "#6d28d9" },
    trendPosDark: { bg: "rgba(167,139,250,0.15)", color: "#a78bfa" },
    trendNeg:     { bg: "rgba(239,68,68,0.12)",   color: "#dc2626" },
    trendNegDark: { bg: "rgba(248,113,113,0.15)", color: "#f87171" },
  },
  indigo: {
    gradient:     "linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 60%, #e0e7ff 100%)",
    gradientDark: "linear-gradient(135deg, rgba(99,102,241,0.18) 0%, rgba(129,140,248,0.10) 100%)",
    iconBg:       "linear-gradient(135deg, #818cf8, #4f46e5)",
    accent:       "#4f46e5",
    accentDark:   "#818cf8",
    border:       "#c7d2fe",
    borderDark:   "rgba(129,140,248,0.3)",
    trendPos:     { bg: "rgba(79,70,229,0.12)",   color: "#4338ca" },
    trendPosDark: { bg: "rgba(129,140,248,0.15)", color: "#818cf8" },
    trendNeg:     { bg: "rgba(239,68,68,0.12)",   color: "#dc2626" },
    trendNegDark: { bg: "rgba(248,113,113,0.15)", color: "#f87171" },
  },
  emerald: {
    gradient:     "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 60%, #d1fae5 100%)",
    gradientDark: "linear-gradient(135deg, rgba(16,185,129,0.18) 0%, rgba(52,211,153,0.10) 100%)",
    iconBg:       "linear-gradient(135deg, #34d399, #059669)",
    accent:       "#059669",
    accentDark:   "#34d399",
    border:       "#a7f3d0",
    borderDark:   "rgba(52,211,153,0.3)",
    trendPos:     { bg: "rgba(5,150,105,0.12)",  color: "#047857" },
    trendPosDark: { bg: "rgba(52,211,153,0.15)", color: "#34d399" },
    trendNeg:     { bg: "rgba(239,68,68,0.12)",  color: "#dc2626" },
    trendNegDark: { bg: "rgba(248,113,113,0.15)",color: "#f87171" },
  },
  amber: {
    gradient:     "linear-gradient(135deg, #fef3c7 0%, #fde68a 60%, #fef3c7 100%)",
    gradientDark: "linear-gradient(135deg, rgba(245,158,11,0.18) 0%, rgba(251,191,36,0.10) 100%)",
    iconBg:       "linear-gradient(135deg, #fbbf24, #d97706)",
    accent:       "#d97706",
    accentDark:   "#fbbf24",
    border:       "#fde68a",
    borderDark:   "rgba(251,191,36,0.3)",
    trendPos:     { bg: "rgba(217,119,6,0.12)",  color: "#b45309" },
    trendPosDark: { bg: "rgba(251,191,36,0.15)", color: "#fbbf24" },
    trendNeg:     { bg: "rgba(239,68,68,0.12)",  color: "#dc2626" },
    trendNegDark: { bg: "rgba(248,113,113,0.15)",color: "#f87171" },
  },
  red: {
    gradient:     "linear-gradient(135deg, #fee2e2 0%, #fecaca 60%, #fee2e2 100%)",
    gradientDark: "linear-gradient(135deg, rgba(239,68,68,0.18) 0%, rgba(248,113,113,0.10) 100%)",
    iconBg:       "linear-gradient(135deg, #f87171, #dc2626)",
    accent:       "#dc2626",
    accentDark:   "#f87171",
    border:       "#fecaca",
    borderDark:   "rgba(248,113,113,0.3)",
    trendPos:     { bg: "rgba(220,38,38,0.12)",  color: "#b91c1c" },
    trendPosDark: { bg: "rgba(248,113,113,0.15)",color: "#f87171" },
    trendNeg:     { bg: "rgba(239,68,68,0.12)",  color: "#dc2626" },
    trendNegDark: { bg: "rgba(248,113,113,0.15)",color: "#f87171" },
  },
  pink: {
    gradient:     "linear-gradient(135deg, #fce7f3 0%, #fbcfe8 60%, #fce7f3 100%)",
    gradientDark: "linear-gradient(135deg, rgba(236,72,153,0.18) 0%, rgba(244,114,182,0.10) 100%)",
    iconBg:       "linear-gradient(135deg, #f472b6, #db2777)",
    accent:       "#db2777",
    accentDark:   "#f472b6",
    border:       "#fbcfe8",
    borderDark:   "rgba(244,114,182,0.3)",
    trendPos:     { bg: "rgba(219,39,119,0.12)", color: "#be185d" },
    trendPosDark: { bg: "rgba(244,114,182,0.15)",color: "#f472b6" },
    trendNeg:     { bg: "rgba(239,68,68,0.12)",  color: "#dc2626" },
    trendNegDark: { bg: "rgba(248,113,113,0.15)",color: "#f87171" },
  },
  cyan: {
    gradient:     "linear-gradient(135deg, #cffafe 0%, #a5f3fc 60%, #cffafe 100%)",
    gradientDark: "linear-gradient(135deg, rgba(6,182,212,0.18) 0%, rgba(34,211,238,0.10) 100%)",
    iconBg:       "linear-gradient(135deg, #22d3ee, #0891b2)",
    accent:       "#0891b2",
    accentDark:   "#22d3ee",
    border:       "#a5f3fc",
    borderDark:   "rgba(34,211,238,0.3)",
    trendPos:     { bg: "rgba(8,145,178,0.12)",  color: "#0e7490" },
    trendPosDark: { bg: "rgba(34,211,238,0.15)", color: "#22d3ee" },
    trendNeg:     { bg: "rgba(239,68,68,0.12)",  color: "#dc2626" },
    trendNegDark: { bg: "rgba(248,113,113,0.15)",color: "#f87171" },
  },
};

// ============================================================
// THEME TOKENS
// ============================================================
const getTokens = (dark) => ({
  pageBg:       "transparent",
  cardBg:       dark ? "rgba(255,255,255,0.03)"           : "#ffffff",
  cardBorder:   dark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #e5e7eb",
  innerCardBg:  dark ? "rgba(255,255,255,0.03)"           : "#f9fafb",
  innerBorder:  dark ? "1px solid rgba(255,255,255,0.05)" : "1px solid #e5e7eb",
  activityLine: dark ? "1px solid rgba(255,255,255,0.05)" : "1px solid #f1f5f9",
  textPrimary:  dark ? "#ffffff"  : "#0f172a",
  textSecond:   dark ? "#94a3b8"  : "#64748b",
  textMuted:    dark ? "#64748b"  : "#94a3b8",
  textAxisMth:  dark ? "#475569"  : "#94a3b8",
  cardShadow:   dark ? "0 8px 30px rgba(0,0,0,0.3)" : "0 8px 30px rgba(0,0,0,0.08)",
});

// ============================================================
// STAT CARD
// ============================================================
const StatCard = ({ label, value = 0, sub, icon, color, trend, onClick, dark }) => {
  const th = cardThemes[color] || cardThemes.blue;

  const bg         = dark ? th.gradientDark : th.gradient;
  const borderCol  = dark ? th.borderDark   : th.border;
  const accent     = dark ? th.accentDark   : th.accent;
  const trendStyle = trend >= 0
    ? (dark ? th.trendPosDark : th.trendPos)
    : (dark ? th.trendNegDark : th.trendNeg);

  const valuColor  = dark ? "#fff" : th.accent;
  const labelColor = dark ? "#e2e8f0" : "#1e293b";
  const subColor   = dark ? "#64748b" : "#64748b";

  return (
    <button
      onClick={onClick}
      style={{
        textAlign: "left",
        width: "100%",
        cursor: "pointer",
        background: bg,
        border: `1.5px solid ${borderCol}`,
        borderRadius: 14,
        padding: 0,
        overflow: "hidden",
        transition: "transform 0.2s, box-shadow 0.2s",
        position: "relative",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px) scale(1.015)";
        e.currentTarget.style.boxShadow = dark
          ? `0 12px 32px ${th.borderDark}`
          : `0 12px 32px ${th.border}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Colored top stripe */}
      <div style={{
        height: 4,
        background: th.iconBg,
        borderRadius: "14px 14px 0 0",
      }} />

      {/* Card body */}
      <div style={{ padding: "16px 18px 18px" }}>
        {/* Icon + trend row */}
        <div style={{
          display: "flex", alignItems: "flex-start",
          justifyContent: "space-between", marginBottom: 14,
        }}>
          <div style={{
            width: 42, height: 42, borderRadius: 10,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: th.iconBg, color: "#fff",
            boxShadow: `0 4px 12px ${borderCol}`,
            flexShrink: 0,
          }}>
            {icon}
          </div>
          {trend !== undefined && (
            <span style={{
              fontSize: 11, fontWeight: 700,
              padding: "3px 9px", borderRadius: 999,
              background: trendStyle.bg,
              color: trendStyle.color,
              letterSpacing: "0.02em",
            }}>
              {trend >= 0 ? "+" : ""}{trend}%
            </span>
          )}
        </div>

        {/* Value */}
        <div style={{
          fontSize: 28, fontWeight: 800,
          color: valuColor,
          letterSpacing: "-0.03em",
          lineHeight: 1,
          marginBottom: 4,
        }}>
          {Number(value).toLocaleString()}
        </div>

        {/* Label */}
        <div style={{ fontSize: 13, fontWeight: 600, color: labelColor, marginTop: 4 }}>
          {label}
        </div>

        {/* Sub */}
        {sub && (
          <div style={{
            fontSize: 11, color: subColor, marginTop: 4,
            display: "flex", alignItems: "center", gap: 4,
          }}>
            <span style={{
              display: "inline-block", width: 6, height: 6,
              borderRadius: "50%", background: accent, flexShrink: 0,
            }} />
            {sub}
          </div>
        )}
      </div>
    </button>
  );
};

// ============================================================
// MINI BAR CHART
// ============================================================
const colorMap = {
  blue: "#22d3ee", violet: "#a78bfa", indigo: "#818cf8",
  emerald: "#34d399", amber: "#fbbf24", red: "#f87171",
  pink: "#f472b6", cyan: "#22d3ee",
};

const MiniBarChart = ({ data = [], color = "violet" }) => {
  const max = Math.max(...data, 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 64 }}>
      {data.map((v, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
          <div style={{
            height: `${(v / max) * 100}%`, minHeight: 2,
            background: `${colorMap[color]}99`,
            borderRadius: "2px 2px 0 0",
            transition: "height 0.7s",
          }} />
        </div>
      ))}
    </div>
  );
};

// ============================================================
// ACTIVITY ITEM
// ============================================================
const ActivityItem = ({ user = "", action, time, status, dark }) => {
  const t = getTokens(dark);
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "12px 0",
      borderBottom: t.activityLine,
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#fff", fontSize: 12, fontWeight: 700,
        background: "linear-gradient(135deg,rgba(139,92,246,0.7),rgba(99,102,241,0.7))",
      }}>
        {user[0] || "?"}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13, color: t.textPrimary, fontWeight: 500, margin: 0 }}>{user}</p>
        <p style={{ fontSize: 11, color: t.textMuted, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{action}</p>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <p style={{ fontSize: 11, color: t.textMuted, margin: 0 }}>{time}</p>
        <span style={{
          fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 999,
          marginTop: 2, display: "inline-block",
          background:
            status === "active"  ? "rgba(52,211,153,0.12)" :
            status === "pending" ? "rgba(251,191,36,0.12)"  :
                                   "rgba(148,163,184,0.12)",
          color:
            status === "active"  ? "#34d399" :
            status === "pending" ? "#fbbf24"  :
                                   "#94a3b8",
        }}>
          {status}
        </span>
      </div>
    </div>
  );
};

// ============================================================
// PANEL
// ============================================================
const Panel = ({ children, style = {}, dark }) => {
  const t = getTokens(dark);
  return (
    <div style={{
      background: t.cardBg,
      border: t.cardBorder,
      borderRadius: 12, padding: 20,
      ...style,
    }}>
      {children}
    </div>
  );
};

// ============================================================
// MAIN DASHBOARD
// ============================================================
const SuperAdminDashboard = () => {
  const navigate  = useNavigate();
  const { dark }  = useTheme();
  const t         = getTokens(dark);

  let ctxData = {};
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    ctxData = useUserManagement() || {};
  } catch {
    ctxData = {};
  }

  const { getStats, trainers = [], pendingApprovals = [] } = ctxData;

  const stats = (() => {
    try { return getStats?.() || {}; } catch { return {}; }
  })();

  const {
    totalStudents  = 0,
    totalTrainers  = 0,
    totalAdmins    = 0,
    activeUsers    = 0,
    suspendedUsers = 0,
  } = stats;

  const [userGrowth]  = useState([42, 56, 48, 65, 72, 58, 80, 75, 90, 85, 98, 110]);
  const [revenueData] = useState([28, 35, 30, 45, 42, 55, 50, 62, 58, 70, 65, 82]);

  const recentActivity = [
    { user: "Aarav Sharma", action: "Enrolled in React Masterclass",  time: "2m ago",  status: "active"   },
    { user: "Rajesh Kumar", action: "Applied as Trainer",             time: "8m ago",  status: "pending"  },
    { user: "Priya Singh",  action: "Completed Python Bootcamp",      time: "25m ago", status: "active"   },
    { user: "Admin Kiran",  action: "Updated course categories",      time: "1h ago",  status: "active"   },
    { user: "Mohit Verma",  action: "Account suspended",              time: "2h ago",  status: "inactive" },
    { user: "Sneha Iyer",   action: "Downloaded certificate",         time: "3h ago",  status: "active"   },
  ];

  const pendingTrainers = (() => {
    try { return Array.isArray(trainers) ? trainers.filter(tr => tr?.status === "pending").length : 0; }
    catch { return 0; }
  })();

  const safePendingApprovals = Array.isArray(pendingApprovals) ? pendingApprovals : [];

  // ── 8 cards → 4 per row (2 rows of 4) ──
  const cardData = [
    {
      label: "Total Students",
      value: totalStudents,
      color: "blue",
      trend: 12,
      sub: `${activeUsers} currently active`,
      icon: (
        <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
          <path d="M12 14l9-5-9-5-9 5 9 5z"/>
          <path d="M12 14l6.16-3.422a12 12 0 01.665 6.479A11.952 11.952 0 0012 20.055"/>
        </svg>
      ),
      onClick: () => navigate("/superadmin/students"),
    },
    {
      label: "Total Trainers",
      value: totalTrainers,
      color: "violet",
      trend: 5,
      sub: `${pendingTrainers} pending approval`,
      icon: (
        <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
          <path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/>
          <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>
        </svg>
      ),
      onClick: () => navigate("/superadmin/trainers"),
    },
    {
      label: "Total Admins",
      value: totalAdmins,
      color: "indigo",
      trend: 0,
      sub: `${totalAdmins} admin accounts`,
      icon: (
        <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      ),
      onClick: () => navigate("/superadmin/admins"),
    },
    {
      label: "Active Users",
      value: activeUsers,
      color: "emerald",
      trend: 8,
      sub: "Online right now",
      icon: (
        <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
          <circle cx={12} cy={12} r={10}/>
          <path d="M12 6v6l4 2"/>
        </svg>
      ),
      onClick: () => navigate("/superadmin/users"),
    },
    {
      label: "Pending Approvals",
      value: safePendingApprovals.length,
      color: "amber",
      trend: -3,
      sub: "Awaiting review",
      icon: (
        <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      ),
      onClick: () => navigate("/superadmin/approvals"),
    },
    {
      label: "Suspended",
      value: suspendedUsers,
      color: "red",
      trend: -2,
      sub: "Blocked accounts",
      icon: (
        <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
          <circle cx={12} cy={12} r={10}/>
          <path d="M4.93 4.93l14.14 14.14"/>
        </svg>
      ),
      onClick: () => navigate("/superadmin/users"),
    },
    {
      label: "Live Classes",
      value: 4,
      color: "pink",
      trend: 25,
      sub: "Sessions happening now",
      icon: (
        <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
          <polygon points="23 7 16 12 23 17 23 7"/>
          <rect x={1} y={5} width={15} height={14} rx={2}/>
        </svg>
      ),
      onClick: () => {},
    },
    {
      label: "Total Courses",
      value: 87,
      color: "cyan",
      trend: 7,
      sub: "Across all categories",
      icon: (
        <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
          <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
        </svg>
      ),
      onClick: () => {},
    },
  ];

  const months = ["J","F","M","A","M","J","J","A","S","O","N","D"];

  return (
    <>
      {/* ── Responsive grid CSS ── */}
      <style>{`
        .stats-grid {
          display: grid;
          /* ✅ Exactly 4 columns on large screens */
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        /* 2 columns on medium screens (tablets) */
        @media (max-width: 900px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
        }
        /* 1 column on mobile */
        @media (max-width: 480px) {
          .stats-grid { grid-template-columns: 1fr; }
        }

        .charts-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        @media (max-width: 768px) {
          .charts-grid { grid-template-columns: 1fr; }
        }

        .bottom-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 16px;
        }
        @media (max-width: 768px) {
          .bottom-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

        {/* ── Page Header ── */}
        <div>
          <h1 style={{
            fontSize: 22, fontWeight: 700,
            color: t.textPrimary, margin: 0,
            letterSpacing: "-0.02em",
          }}>
            Platform Overview
          </h1>
          <p style={{ fontSize: 13, color: t.textSecond, marginTop: 4 }}>
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long", year: "numeric",
              month: "long", day: "numeric",
            })}
          </p>
        </div>

        {/* ── Stats Grid: 4 columns × 2 rows ── */}
        <div className="stats-grid">
          {cardData.map((c, i) => (
            <StatCard key={i} {...c} dark={dark} />
          ))}
        </div>

        {/* ── Charts Row ── */}
        <div className="charts-grid">
          {/* User Growth */}
          <Panel dark={dark}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 13, fontWeight: 600, color: t.textPrimary, margin: 0 }}>User Growth</h3>
                <p style={{ fontSize: 11, color: t.textMuted, margin: "2px 0 0" }}>Monthly registrations</p>
              </div>
              <span style={{
                fontSize: 11, fontWeight: 500, padding: "3px 8px", borderRadius: 999,
                background: "rgba(167,139,250,0.12)", color: "#a78bfa",
              }}>
                +18% this month
              </span>
            </div>
            <MiniBarChart data={userGrowth} color="violet" />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
              {months.map((m, i) => (
                <span key={i} style={{ fontSize: 10, color: t.textAxisMth, flex: 1, textAlign: "center" }}>{m}</span>
              ))}
            </div>
          </Panel>

          {/* Revenue */}
          <Panel dark={dark}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 13, fontWeight: 600, color: t.textPrimary, margin: 0 }}>Revenue</h3>
                <p style={{ fontSize: 11, color: t.textMuted, margin: "2px 0 0" }}>Monthly earnings (₹ thousands)</p>
              </div>
              <span style={{
                fontSize: 11, fontWeight: 500, padding: "3px 8px", borderRadius: 999,
                background: "rgba(52,211,153,0.12)", color: "#34d399",
              }}>
                +24% YoY
              </span>
            </div>
            <MiniBarChart data={revenueData} color="emerald" />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
              {months.map((m, i) => (
                <span key={i} style={{ fontSize: 10, color: t.textAxisMth, flex: 1, textAlign: "center" }}>{m}</span>
              ))}
            </div>
          </Panel>
        </div>

        {/* ── Bottom Row ── */}
        <div className="bottom-grid">

          {/* Recent Activity */}
          <Panel dark={dark}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <h3 style={{ fontSize: 13, fontWeight: 600, color: t.textPrimary, margin: 0 }}>Recent Activity</h3>
              <button style={{ fontSize: 11, color: "#a78bfa", background: "none", border: "none", cursor: "pointer" }}>
                View all
              </button>
            </div>
            {recentActivity.map((item, i) => (
              <ActivityItem key={i} {...item} dark={dark} />
            ))}
          </Panel>

          {/* Pending Approvals Panel */}
          <Panel dark={dark}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h3 style={{ fontSize: 13, fontWeight: 600, color: t.textPrimary, margin: 0 }}>Pending Approvals</h3>
              <span style={{
                fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 999,
                background: "rgba(251,191,36,0.15)", color: "#fbbf24",
              }}>
                {safePendingApprovals.length}
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {safePendingApprovals.slice(0, 5).map((u, i) => (
                <div key={u?.id ?? i} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: 12, borderRadius: 8,
                  background: t.innerCardBg,
                  border: t.innerBorder,
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontSize: 12, fontWeight: 700,
                    background: "linear-gradient(135deg,rgba(245,158,11,0.7),rgba(234,88,12,0.7))",
                  }}>
                    {u?.name?.[0] || "?"}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontSize: 13, color: t.textPrimary, fontWeight: 500,
                      margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      {u?.name || "Unknown"}
                    </p>
                    <p style={{ fontSize: 11, color: t.textMuted, margin: 0, textTransform: "capitalize" }}>
                      {u?.role || ""}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/superadmin/approvals")}
                    style={{ fontSize: 11, color: "#a78bfa", background: "none", border: "none", cursor: "pointer", flexShrink: 0 }}
                  >
                    Review →
                  </button>
                </div>
              ))}

              {safePendingApprovals.length === 0 && (
                <div style={{ textAlign: "center", padding: "32px 0", color: t.textMuted, fontSize: 13 }}>
                  No pending approvals
                </div>
              )}

              {safePendingApprovals.length > 5 && (
                <button
                  onClick={() => navigate("/superadmin/approvals")}
                  style={{
                    width: "100%", textAlign: "center", fontSize: 11,
                    color: "#a78bfa", background: "none", border: "none",
                    cursor: "pointer", padding: "8px 0",
                  }}
                >
                  View {safePendingApprovals.length - 5} more →
                </button>
              )}
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
};

export default SuperAdminDashboard;