// // src/Business/BusinessDashboard.jsx
// import React, { useState } from "react";
// import {
//   TrendingUp,
//   Users,
//   DollarSign,
//   Target,
//   BarChart3,
//   PieChart,
//   Activity,
//   FileText,
// } from "lucide-react";

// const BusinessDashboard = () => {
//   const [activePanel, setActivePanel] = useState("overview");

//   /* ================= STATS ================= */
//   const stats = [
//     {
//       label: "Active Leads",
//       value: 0,
//       change: "+12%",
//       trend: "up",
//       color: "from-sky-500 to-sky-600",
//       Icon: Users,
//     },
//     {
//       label: "Conversions (This Week)",
//       value: 0,
//       change: "+3%",
//       trend: "up",
//       color: "from-emerald-500 to-emerald-600",
//       Icon: TrendingUp,
//     },
//     {
//       label: "Revenue (MTD)",
//       value: "₹0",
//       change: "+18%",
//       trend: "up",
//       color: "from-violet-500 to-violet-600",
//       Icon: DollarSign,
//     },
//     {
//       label: "Target Progress",
//       value: "0%",
//       change: "On track",
//       trend: "neutral",
//       color: "from-amber-500 to-amber-600",
//       Icon: Target,
//     },
//   ];

//   /* ================= OVERVIEW ================= */
//   const OverviewPage = () => (
//     <div className="space-y-6">
//       {/* STATS */}
//       <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
//         {stats.map((item) => (
//           <div
//             key={item.label}
//             className="rounded-2xl bg-white dark:bg-slate-900 border shadow-sm p-5"
//           >
//             <div className="flex items-center justify-between mb-3">
//               <p className="text-xs uppercase text-slate-500">
//                 {item.label}
//               </p>
//               <div
//                 className={`h-10 w-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center`}
//               >
//                 <item.Icon className="h-5 w-5 text-white" />
//               </div>
//             </div>

//             <p className="text-3xl font-bold text-slate-900 dark:text-white">
//               {item.value}
//             </p>

//             <p className="text-xs text-slate-500 mt-1">
//               {item.change} vs last period
//             </p>
//           </div>
//         ))}
//       </div>

//       {/* EMPTY SECTIONS */}
//       <div className="grid lg:grid-cols-3 gap-5">
//         <EmptyCard title="Sales Pipeline" icon={Activity} />
//         <EmptyCard title="Recent Activity" icon={FileText} />
//         <EmptyCard title="Key Reports" icon={BarChart3} />
//       </div>
//     </div>
//   );

//   const EmptyCard = ({ title, icon: Icon }) => (
//     <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border shadow-sm text-center">
//       <Icon className="h-8 w-8 mx-auto text-slate-400 mb-2" />
//       <h3 className="font-semibold">{title}</h3>
//       <p className="text-sm text-slate-500">
//         No data available
//       </p>
//     </div>
//   );

//   /* ================= PIPELINE ================= */
//   const PipelinePage = () => (
//     <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border shadow-sm">
//       <h2 className="text-lg font-bold mb-2">Sales Pipeline</h2>
//       <p className="text-sm text-slate-500">
//         Pipeline data will appear here
//       </p>
//     </div>
//   );

//   /* ================= REPORTS ================= */
//   const ReportsPage = () => (
//     <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border shadow-sm">
//       <h2 className="text-lg font-bold mb-2">Reports & Analytics</h2>
//       <p className="text-sm text-slate-500">
//         Reports will load once backend is connected
//       </p>
//     </div>
//   );

//   /* ================= ROOT ================= */
//   return (
//     <div className="min-h-screen bg-slate-100 dark:bg-slate-950 p-5">
//       <div className="max-w-7xl mx-auto space-y-6">

//         {/* ================= HERO ================= */}
//         <div className="rounded-3xl p-6 text-white shadow-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//             <div>
//               <h1 className="text-2xl font-bold">
//               Tenant Admin
//               </h1>
//               <p className="text-sm opacity-90 mt-1">
//                 Sales, pipeline & performance overview
//               </p>
//             </div>

//             {/* PANEL SWITCHER */}
//             <div className="flex bg-white/20 backdrop-blur p-1 rounded-xl">
//               {["overview", "pipeline", "reports"].map((tab) => (
//                 <button
//                   key={tab}
//                   onClick={() => setActivePanel(tab)}
//                   className={`px-4 py-1.5 rounded-lg text-sm capitalize transition
//                     ${
//                       activePanel === tab
//                         ? "bg-white text-indigo-600 font-medium"
//                         : "text-white/80 hover:text-white"
//                     }`}
//                 >
//                   {tab}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         {activePanel === "overview" && <OverviewPage />}
//         {activePanel === "pipeline" && <PipelinePage />}
//         {activePanel === "reports" && <ReportsPage />}
//       </div>
//     </div>
//   );
// };

// export default BusinessDashboard;




















// src/Business/BusinessDashboard.jsx
import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Users,
  DollarSign,
  Target,
  BarChart3,
  Activity,
  FileText,
  Sparkles,
  ArrowUpRight,
  Zap,
  PieChart,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/* ═══════════════════════════════════════════════
   THEME TOKEN MAP
═══════════════════════════════════════════════ */
const T = {
  dark: {
    pageBg: "#0a0a0a",
    cardBg: "#111111",
    cardBgHov: "#161616",
    heroBg: "#141414",
    border: "rgba(255,255,255,0.06)",
    borderHov: "rgba(255,255,255,0.14)",
    borderHero: "rgba(255,255,255,0.07)",
    text: "#ffffff",
    textSub: "rgba(255,255,255,0.3)",
    textMuted: "rgba(255,255,255,0.2)",
    textLabel: "rgba(255,255,255,0.22)",
    pillBg: "rgba(255,255,255,0.04)",
    pillBorder: "rgba(255,255,255,0.07)",
    pillText: "rgba(255,255,255,0.25)",
    iconBg: "rgba(255,255,255,0.05)",
    iconBorder: "rgba(255,255,255,0.08)",
    emptyBorder: "rgba(255,255,255,0.07)",
    emptyBg: "rgba(255,255,255,0.02)",
    emptyIcon: "rgba(255,255,255,0.12)",
    gridLine: "rgba(255,255,255,0.5)",
    barBg: "rgba(255,255,255,0.05)",
    actBar: "rgba(255,255,255,0.5)",
    actIcon: "rgba(255,255,255,0.3)",
    actBg: "rgba(255,255,255,0.04)",
    actBorder: "rgba(255,255,255,0.07)",
    shadow: "0 4px 20px rgba(0,0,0,0.4)",
    shadowHov: "0 20px 60px rgba(0,0,0,0.6)",
    liveColor: "#34d399",
    liveText: "#34d399",
    recentItemBg: "rgba(255,255,255,0.03)",
    recentItemBorder: "rgba(255,255,255,0.05)",
    recentItemBgHov: "rgba(255,255,255,0.06)",
    overdueBg: "rgba(239,68,68,0.12)",
    overdueText: "#f87171",
    overdueBorder: "rgba(239,68,68,0.2)",
  },
  light: {
    pageBg: "#f1f5f9",
    cardBg: "#ffffff",
    cardBgHov: "#f8fafc",
    heroBg: "#ffffff",
    border: "#e2e8f0",
    borderHov: "#cbd5e1",
    borderHero: "#e2e8f0",
    text: "#0f172a",
    textSub: "#64748b",
    textMuted: "#94a3b8",
    textLabel: "#94a3b8",
    pillBg: "#f1f5f9",
    pillBorder: "#e2e8f0",
    pillText: "#94a3b8",
    iconBg: "#f8fafc",
    iconBorder: "#e2e8f0",
    emptyBorder: "#e2e8f0",
    emptyBg: "#f8fafc",
    emptyIcon: "#cbd5e1",
    gridLine: "rgba(0,0,0,0.12)",
    barBg: "#f1f5f9",
    actBar: "#94a3b8",
    actIcon: "#94a3b8",
    actBg: "#f8fafc",
    actBorder: "#e2e8f0",
    shadow: "0 1px 8px rgba(0,0,0,0.07)",
    shadowHov: "0 8px 32px rgba(0,0,0,0.10)",
    liveColor: "#16a34a",
    liveText: "#16a34a",
    recentItemBg: "#f8fafc",
    recentItemBorder: "#e2e8f0",
    recentItemBgHov: "#f1f5f9",
    overdueBg: "#fef2f2",
    overdueText: "#ef4444",
    overdueBorder: "#fecaca",
  },
};

/* ═══════════════════════════════════════════════
   COUNT-UP HOOK
═══════════════════════════════════════════════ */
function useCountUp(target, duration = 1200) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!target || target === 0) { setVal(0); return; }
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return val;
}

/* ═══════════════════════════════════════════════
   STAT CARD
═══════════════════════════════════════════════ */
const StatCard = ({ stat, index, t, loading }) => {
  const Icon = stat.Icon;
  const numVal = typeof stat.value === "number" ? stat.value : 0;
  const count = useCountUp(loading ? 0 : numVal);
  const [hov, setHov] = useState(false);

  const displayValue = () => {
    if (loading) return null;
    if (typeof stat.value === "string") return stat.value;
    return String(count);
  };

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        animationDelay: `${index * 80}ms`,
        background: hov ? t.cardBgHov : t.cardBg,
        border: `1px solid ${hov ? t.borderHov : t.border}`,
        boxShadow: hov ? `${t.shadowHov}, 0 0 40px ${stat.color}12` : t.shadow,
        borderRadius: 20,
        padding: "22px 22px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        textAlign: "left",
        cursor: "default",
        transition: "all 0.25s ease",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{
        position: "absolute", top: -20, right: -20, width: 90, height: 90,
        borderRadius: "50%", background: stat.color, filter: "blur(40px)",
        opacity: hov ? 0.15 : 0.04, transition: "opacity 0.4s", pointerEvents: "none",
      }} />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{
          width: 42, height: 42, borderRadius: 12,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: `${stat.color}18`, border: `1px solid ${stat.color}30`,
        }}>
          <Icon size={19} color={stat.color} strokeWidth={2} />
        </div>
        <ArrowUpRight size={13} style={{ color: stat.color, opacity: hov ? 0.7 : 0, transition: "opacity 0.2s" }} />
      </div>

      <div>
        {loading ? (
          <div style={{ width: 48, height: 40, borderRadius: 8, background: t.barBg, animation: "pulse 1.5s ease infinite" }} />
        ) : (
          <p style={{
            fontSize: 40, fontWeight: 800, lineHeight: 1,
            fontFamily: "'Poppins',sans-serif", color: t.text, margin: 0,
          }}>
            {displayValue()}
          </p>
        )}
        <p style={{
          fontSize: 10, fontWeight: 600, letterSpacing: "0.1em",
          textTransform: "uppercase", color: t.textMuted,
          fontFamily: "'Poppins',sans-serif", margin: "6px 0 0",
        }}>{stat.label}</p>
      </div>

      <div style={{ height: 2, background: t.barBg, borderRadius: 99, overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 99, background: stat.color,
          width: hov ? "65%" : "20%", transition: "width 0.65s ease", opacity: 0.85,
        }} />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: t.textMuted, fontFamily: "'Poppins',sans-serif" }}>
        <TrendingUp size={11} color={stat.trend === "up" ? t.liveText : t.textMuted} />
        <span>{stat.change} vs last period</span>
      </div>

      <div style={{
        position: "absolute", bottom: 0, left: 0,
        width: hov ? "60%" : "30%", height: 1,
        background: `linear-gradient(90deg,${stat.color},transparent)`,
        transition: "width 0.5s ease", opacity: 0.5,
      }} />
    </div>
  );
};

/* ═══════════════════════════════════════════════
   EMPTY CARD (Admin style)
═══════════════════════════════════════════════ */
const EmptyCard = ({ title, icon: Icon, color, t }) => {
  const c = color || "#94a3b8";
  return (
    <div style={{
      background: t.cardBg, border: `1px solid ${t.border}`,
      borderRadius: 20, padding: 22, boxShadow: t.shadow,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: `${c}18`, border: `1px solid ${c}30`,
        }}>
          <Icon size={15} color={c} />
        </div>
        <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 13, color: t.text }}>{title}</span>
      </div>
      <div style={{
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "28px 0", gap: 10,
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: 14,
          display: "flex", alignItems: "center", justifyContent: "center",
          border: `1.5px dashed ${t.emptyBorder}`, background: t.emptyBg,
        }}>
          <Icon size={20} color={t.emptyIcon} />
        </div>
        <p style={{ fontSize: 11, color: t.textMuted, fontWeight: 500, fontFamily: "'Poppins',sans-serif", margin: 0 }}>
          No data available
        </p>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   QUICK ACTION PILL
═══════════════════════════════════════════════ */
const QuickAction = ({ label, color, onClick, t }) => {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "9px 18px", borderRadius: 10,
        border: `1px solid ${hov ? color + "55" : t.border}`,
        background: hov ? `${color}12` : "transparent",
        color: hov ? color : t.textMuted,
        fontSize: 12, fontWeight: 600, cursor: "pointer",
        transition: "all 0.2s", fontFamily: "'Poppins',sans-serif",
        letterSpacing: "0.03em",
      }}
    >
      <span style={{
        width: 5, height: 5, borderRadius: "50%",
        background: hov ? color : t.textMuted,
        transition: "background 0.2s", flexShrink: 0,
      }} />
      {label}
    </button>
  );
};

/* ═══════════════════════════════════════════════
   MINI CALENDAR
═══════════════════════════════════════════════ */
const MiniCalendar = ({ t }) => {
  const today = new Date();
  const [current, setCurrent] = useState({
    month: today.getMonth(),
    year: today.getFullYear(),
  });

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];
  const dayNames = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

  const firstDay = new Date(current.year, current.month, 1).getDay();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(current.year, current.month + 1, 0).getDate();

  const prevMonth = () =>
    setCurrent((p) => ({
      month: p.month === 0 ? 11 : p.month - 1,
      year: p.month === 0 ? p.year - 1 : p.year,
    }));
  const nextMonth = () =>
    setCurrent((p) => ({
      month: p.month === 11 ? 0 : p.month + 1,
      year: p.month === 11 ? p.year + 1 : p.year,
    }));

  const isToday = (d) =>
    d === today.getDate() &&
    current.month === today.getMonth() &&
    current.year === today.getFullYear();

  const cells = Array(startOffset).fill(null).concat(
    Array.from({ length: daysInMonth }, (_, i) => i + 1)
  );
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div style={{
      background: t.cardBg,
      border: `1px solid ${t.border}`,
      borderRadius: 20,
      padding: 22,
      height: "100%",
      boxSizing: "border-box",
      boxShadow: t.shadow,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: t.iconBg, border: `1px solid ${t.iconBorder}`,
          }}>
            <CalendarDays size={16} color={t.text} />
          </div>
          <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 13, color: t.text }}>
            {monthNames[current.month]} {current.year}
          </span>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {[prevMonth, nextMonth].map((fn, i) => (
            <button key={i} onClick={fn} style={{
              width: 28, height: 28, borderRadius: 8,
              border: `1px solid ${t.navBtnBorder ?? t.border}`,
              cursor: "pointer",
              background: t.navBtnBg ?? t.actBg,
              color: t.navBtnColor ?? t.textMuted,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {i === 0 ? <ChevronLeft size={13} /> : <ChevronRight size={13} />}
            </button>
          ))}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, marginBottom: 6 }}>
        {dayNames.map((d) => (
          <div key={d} style={{
            textAlign: "center", fontSize: 9, fontWeight: 700,
            color: t.calDayHeader ?? t.textMuted, letterSpacing: "0.06em",
            paddingBottom: 6, fontFamily: "'Poppins',sans-serif",
          }}>{d}</div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2 }}>
        {cells.map((d, i) => (
          <div key={i} style={{
            aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: 8, fontSize: 11, fontWeight: isToday(d) ? 700 : 500,
            cursor: d ? "pointer" : "default",
            background: isToday(d) ? (t.todayBg ?? t.text) : "transparent",
            color: isToday(d) ? (t.todayText ?? t.cardBg) : d ? (t.calDayText ?? t.text) : "transparent",
            fontFamily: "'Poppins',sans-serif", transition: "background 0.15s",
          }}>{d}</div>
        ))}
      </div>
      <div style={{
        marginTop: 16, paddingTop: 12,
        borderTop: `1px solid ${t.calFooterBdr ?? t.border}`,
        fontSize: 10, color: t.calFooter ?? t.textMuted, textAlign: "center",
        fontFamily: "'Poppins',sans-serif", fontWeight: 500, letterSpacing: "0.05em",
      }}>
        NO EVENTS SCHEDULED
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════ */
const BusinessDashboard = () => {
  const [activePanel, setActivePanel] = useState("overview");

  const [isDark, setIsDark] = useState(
    () =>
      typeof document !== "undefined" &&
      (document.documentElement.classList.contains("dark") ||
        document.documentElement.getAttribute("data-theme") === "dark")
  );

  useEffect(() => {
    const obs = new MutationObserver(() => {
      setIsDark(
        document.documentElement.classList.contains("dark") ||
          document.documentElement.getAttribute("data-theme") === "dark"
      );
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
    return () => obs.disconnect();
  }, []);

  const t = isDark ? T.dark : T.light;

  /* ================= STATS ================= */
  const stats = [
    {
      label: "Active Leads",
      value: 0,
      change: "+12%",
      trend: "up",
      color: "#22d3ee",
      Icon: Users,
    },
    {
      label: "Conversions (This Week)",
      value: 0,
      change: "+3%",
      trend: "up",
      color: "#34d399",
      Icon: TrendingUp,
    },
    {
      label: "Revenue (MTD)",
      value: "₹0",
      change: "+18%",
      trend: "up",
      color: "#a78bfa",
      Icon: DollarSign,
    },
    {
      label: "Target Progress",
      value: "0%",
      change: "On track",
      trend: "neutral",
      color: "#fb923c",
      Icon: Target,
    },
  ];

  const quickActions = [
    { label: "Add Lead",        color: "#22d3ee" },
    { label: "View Pipeline",   color: "#34d399" },
    { label: "Revenue Report",  color: "#a78bfa" },
    { label: "Team Targets",    color: "#fb923c" },
    { label: "Marketing",       color: "#f43f5e" },
    { label: "View Reports",    color: "#f59e0b" },
  ];

  const card = {
    background: t.cardBg,
    border: `1px solid ${t.border}`,
    borderRadius: 20,
    padding: 24,
    boxShadow: t.shadow,
  };

  const pill = {
    fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
    padding: "4px 10px", borderRadius: 999, background: t.pillBg,
    border: `1px solid ${t.pillBorder}`, color: t.pillText,
    fontFamily: "'Poppins',sans-serif",
  };

  /* ================= OVERVIEW ================= */
  const OverviewPage = () => (
    <div>
      {/* Stat Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(185px,1fr))",
        gap: 14, marginBottom: 20,
      }}>
        {stats.map((s, i) => (
          <StatCard key={i} stat={s} index={i} t={t} loading={false} />
        ))}
      </div>

      {/* Empty Panels Row */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
        gap: 14, marginBottom: 14,
      }}>
        <EmptyCard title="Sales Pipeline"   icon={Activity}  color="#22d3ee" t={t} />
        <EmptyCard title="Recent Activity"  icon={FileText}  color="#a78bfa" t={t} />
        <EmptyCard title="Key Reports"      icon={BarChart3} color="#34d399" t={t} />
      </div>

      {/* Bottom Row */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 290px",
        gap: 14, marginBottom: 14,
      }}>
        {/* Conversion Funnel placeholder */}
        <div style={card} className="dfade">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.2)",
              }}>
                <PieChart size={15} color="#22d3ee" />
              </div>
              <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 13, color: t.text }}>Conversion Funnel</span>
            </div>
            <span style={pill}>This Month</span>
          </div>
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", padding: "28px 0", gap: 12,
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              display: "flex", alignItems: "center", justifyContent: "center",
              border: `1.5px dashed ${t.emptyBorder}`, background: t.emptyBg,
            }}>
              <PieChart size={20} color={t.emptyIcon} />
            </div>
            <p style={{ fontSize: 12, color: t.textMuted, fontWeight: 500, fontFamily: "'Poppins',sans-serif", margin: 0 }}>
              No funnel data yet
            </p>
            <button
              onClick={() => setActivePanel("pipeline")}
              style={{
                padding: "6px 18px", borderRadius: 8,
                border: "1px solid rgba(34,211,238,0.25)",
                background: "rgba(34,211,238,0.06)", color: "#0891b2",
                fontSize: 11, fontWeight: 600, cursor: "pointer",
                fontFamily: "'Poppins',sans-serif",
              }}
            >
              View Pipeline →
            </button>
          </div>
        </div>

        {/* Revenue Trend placeholder */}
        <div style={card} className="dfade">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.2)",
              }}>
                <BarChart3 size={15} color="#a78bfa" />
              </div>
              <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 13, color: t.text }}>Revenue Trend</span>
            </div>
            <span style={pill}>MTD</span>
          </div>
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", padding: "28px 0", gap: 12,
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              display: "flex", alignItems: "center", justifyContent: "center",
              border: `1.5px dashed ${t.emptyBorder}`, background: t.emptyBg,
            }}>
              <BarChart3 size={20} color={t.emptyIcon} />
            </div>
            <p style={{ fontSize: 12, color: t.textMuted, fontWeight: 500, fontFamily: "'Poppins',sans-serif", margin: 0 }}>
              No revenue data yet
            </p>
            <button
              onClick={() => setActivePanel("reports")}
              style={{
                padding: "6px 18px", borderRadius: 8,
                border: "1px solid rgba(167,139,250,0.25)",
                background: "rgba(167,139,250,0.08)", color: "#7c3aed",
                fontSize: 11, fontWeight: 600, cursor: "pointer",
                fontFamily: "'Poppins',sans-serif",
              }}
            >
              View Reports →
            </button>
          </div>
        </div>
        {/* Calendar */}
        <MiniCalendar t={t} />
      </div>

      {/* Quick Actions */}
      <div style={{ ...card, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }} className="dfade">
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginRight: 10 }}>
          <Zap size={14} color={t.textLabel} />
          <span style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.12em",
            textTransform: "uppercase", color: t.textLabel,
            fontFamily: "'Poppins',sans-serif",
          }}>Quick Actions</span>
        </div>
        {quickActions.map((a, i) => (
          <QuickAction key={i} label={a.label} color={a.color} t={t} onClick={() => {}} />
        ))}
      </div>
    </div>
  );

  /* ================= PIPELINE ================= */
  const PipelinePage = () => (
    <div style={card}>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: t.text, fontFamily: "'Poppins',sans-serif" }}>
        Sales Pipeline
      </h2>
      <p style={{ fontSize: 12, color: t.textMuted, fontFamily: "'Poppins',sans-serif" }}>
        Pipeline data will appear here
      </p>
    </div>
  );

  /* ================= REPORTS ================= */
  const ReportsPage = () => (
    <div style={card}>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: t.text, fontFamily: "'Poppins',sans-serif" }}>
        Reports & Analytics
      </h2>
      <p style={{ fontSize: 12, color: t.textMuted, fontFamily: "'Poppins',sans-serif" }}>
        Reports will load once backend is connected
      </p>
    </div>
  );

  /* ================= ROOT ================= */
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        .dfade{animation:fadeUp 0.45s ease both}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.15}}
        .d1{animation:blink 1.6s ease infinite}
        .d2{animation:blink 1.6s 0.3s ease infinite}
        .d3{animation:blink 1.6s 0.6s ease infinite}
        @keyframes pulse-ring{0%{box-shadow:0 0 0 0 rgba(34,211,238,0.5)}70%{box-shadow:0 0 0 8px rgba(34,211,238,0)}100%{box-shadow:0 0 0 0 rgba(34,211,238,0)}}
        .livebadge{animation:pulse-ring 2.2s ease-out infinite}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: t.pageBg,
        color: t.text,
        fontFamily: "'Poppins',sans-serif",
        transition: "background 0.3s,color 0.3s",
      }}>
        <div style={{
          position: "relative", zIndex: 1, padding: 24,
          maxWidth: 1300, margin: "0 auto", paddingBottom: 52,
        }}>

          {/* ═══ HERO ═══ */}
          <div className="dfade" style={{
            borderRadius: 24, padding: "30px 36px",
            background: t.heroBg, border: `1px solid ${t.borderHero}`,
            position: "relative", overflow: "hidden",
            marginBottom: 20, boxShadow: t.shadow,
          }}>
            {/* Grid overlay */}
            <div style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              opacity: isDark ? 0.04 : 0.025,
              backgroundImage: `linear-gradient(${t.gridLine} 1px,transparent 1px),linear-gradient(90deg,${t.gridLine} 1px,transparent 1px)`,
              backgroundSize: "40px 40px",
            }} />
            {/* Glow blobs */}
            <div style={{
              position: "absolute", top: "-30%", left: "40%",
              width: 300, height: 200,
              background: "radial-gradient(ellipse,rgba(34,211,238,0.06),transparent 70%)",
              pointerEvents: "none",
            }} />
            <div style={{
              position: "absolute", bottom: "-40%", right: "10%",
              width: 250, height: 200,
              background: "radial-gradient(ellipse,rgba(167,139,250,0.06),transparent 70%)",
              pointerEvents: "none",
            }} />

            <div style={{
              position: "relative", display: "flex", alignItems: "center",
              justifyContent: "space-between", flexWrap: "wrap", gap: 16,
            }}>
              {/* Left: Title */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
                  <Sparkles size={11} color={t.textSub} />
                  <span style={{
                    fontSize: 9, fontWeight: 700, letterSpacing: "0.22em",
                    textTransform: "uppercase", color: t.textSub,
                    fontFamily: "'Poppins',sans-serif",
                  }}>Business Portal</span>
                </div>
                <h1 style={{
                  fontFamily: "'Poppins',sans-serif", fontWeight: 900,
                  fontSize: "clamp(1.6rem,3vw,2.4rem)", color: t.text,
                  margin: 0, lineHeight: 1.1, letterSpacing: "-0.02em",
                }}>Tenant Admin</h1>
                <p style={{
                  fontSize: 12, color: t.textSub, marginTop: 7,
                  fontWeight: 500, fontFamily: "'Poppins',sans-serif",
                }}>Sales, pipeline &amp; performance overview</p>

                {/* Tab buttons */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
                  {["overview", "pipeline", "reports"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActivePanel(tab)}
                      style={{
                        padding: "7px 16px", borderRadius: 10,
                        border: `1px solid ${activePanel === tab ? "rgba(34,211,238,0.5)" : t.borderHov}`,
                        background: activePanel === tab ? "rgba(34,211,238,0.1)" : t.actBg,
                        color: activePanel === tab ? "#22d3ee" : t.textSub,
                        fontSize: 11, fontWeight: 600, cursor: "pointer",
                        fontFamily: "'Poppins',sans-serif",
                        textTransform: "capitalize",
                        transition: "all 0.2s",
                      }}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Right: Status pills + live badge */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 12,
                  background: t.actBg, border: `1px solid ${t.actBorder}`,
                  borderRadius: 12, padding: "8px 16px",
                  fontSize: 11, fontWeight: 600,
                  fontFamily: "'Poppins',sans-serif", color: t.textSub,
                }}>
                  <span>0 leads</span>
                  <span style={{ width: 1, height: 14, background: t.actBorder }} />
                  <span>0 conversions</span>
                  <span style={{ width: 1, height: 14, background: t.actBorder }} />
                  <span style={{ color: t.liveText }}>All clear ✓</span>
                </div>

                {/* Animated bars */}
                <div style={{
                  display: "flex", alignItems: "center", gap: 8,
                  background: t.actBg, border: `1px solid ${t.actBorder}`,
                  borderRadius: 10, padding: "8px 14px",
                }}>
                  <Activity size={12} color={t.actIcon} />
                  <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 14 }}>
                    <span className="d1" style={{ width: 3, height: 10, borderRadius: 2, background: t.actBar, display: "block" }} />
                    <span className="d2" style={{ width: 3, height: 14, borderRadius: 2, background: t.actBar, display: "block" }} />
                    <span className="d3" style={{ width: 3, height: 7, borderRadius: 2, background: t.actBar, display: "block" }} />
                  </div>
                </div>

                {/* LIVE badge */}
                <div className="livebadge" style={{
                  display: "flex", alignItems: "center", gap: 7,
                  background: isDark ? "rgba(34,211,238,0.08)" : "rgba(8,145,178,0.08)",
                  border: isDark ? "1px solid rgba(34,211,238,0.3)" : "1px solid rgba(8,145,178,0.3)",
                  borderRadius: 999, padding: "8px 18px",
                  color: "#22d3ee", fontSize: 11, fontWeight: 700,
                  letterSpacing: "0.1em", fontFamily: "'Poppins',sans-serif",
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22d3ee", display: "inline-block" }} />
                  LIVE
                </div>
              </div>
            </div>
          </div>

          {activePanel === "overview"  && <OverviewPage />}
          {activePanel === "pipeline"  && <PipelinePage />}
          {activePanel === "reports"   && <ReportsPage />}
        </div>
      </div>
    </>
  );
};

export default BusinessDashboard;