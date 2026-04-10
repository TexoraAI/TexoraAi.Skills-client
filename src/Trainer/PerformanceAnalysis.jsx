// import React, { useState } from "react";
// import {
//   LineChart,
//   Line,
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   Area,
//   AreaChart,
// } from "recharts";

// import {
//   BarChart3,
//   TrendingUp,
//   CheckCircle,
//   CalendarCheck,
//   Activity,
//   Download,
//   Target,
//   Trophy,
//   AlertTriangle,
//   BookOpen,
//   Info,
// } from "lucide-react";

// const PerformanceAnalysis = () => {
//   const [timeRange, setTimeRange] = useState("6months");

//   // Empty data (API later)
//   const completionTrendData = [];
//   const assessmentTrendData = [];
//   const batchPerformanceData = [];
//   const performanceDistributionData = [];
//   const moduleCompletionData = [];
//   const topPerformers = [];
//   const needsAttention = [];

//   const stats = [
//     {
//       label: "Course Completion",
//       value: "0%",
//       change: "0%",
//       icon: BookOpen,
//       color: "emerald",
//       target: "80%",
//       progress: 0,
//     },
//     {
//       label: "Assessment Score",
//       value: "0%",
//       change: "0%",
//       icon: Target,
//       color: "blue",
//       target: "85%",
//       progress: 0,
//     },
//     {
//       label: "Attendance",
//       value: "0%",
//       change: "0%",
//       icon: CalendarCheck,
//       color: "purple",
//       target: "90%",
//       progress: 0,
//     },
//     {
//       label: "Engagement",
//       value: "0%",
//       change: "0%",
//       icon: Activity,
//       color: "cyan",
//       target: "90%",
//       progress: 0,
//     },
//   ];

//   const CustomTooltip = ({ active, payload, label }) => {
//     if (!active || !payload?.length) return null;
//     return (
//       <div className="rounded-md border bg-white dark:bg-slate-900 p-2 text-xs shadow">
//         <p className="font-medium mb-1">{label}</p>
//         {payload.map((p, i) => (
//           <p key={i} style={{ color: p.color }}>
//             {p.name}: {p.value}%
//           </p>
//         ))}
//       </div>
//     );
//   };

//   return (
//     <div className="space-y-5">
//       {/* HEADER */}
//       <div className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-white">
//         <div className="flex items-center gap-2 text-xs uppercase opacity-90">
//           <BarChart3 className="w-4 h-4" />
//           Analytics Dashboard
//         </div>
//         <h1 className="text-xl font-bold mt-1">Performance Analysis</h1>
//         <p className="text-sm opacity-90">
//           Student performance & batch insights
//         </p>
//       </div>

//       {/* CONTROLS */}
//       <div className="flex items-center justify-between gap-2 rounded-lg border bg-white dark:bg-slate-900 p-3">
//         <div className="flex gap-1">
//           {["3months", "6months", "1year"].map((r) => (
//             <button
//               key={r}
//               onClick={() => setTimeRange(r)}
//               className={`px-3 py-1 text-xs rounded-md ${
//                 timeRange === r
//                   ? "bg-blue-600 text-white"
//                   : "bg-slate-100 dark:bg-slate-800"
//               }`}
//             >
//               {r === "3months" ? "3M" : r === "6months" ? "6M" : "1Y"}
//             </button>
//           ))}
//         </div>

//         <button className="flex items-center gap-1 px-3 py-1 text-xs rounded-md bg-slate-100 dark:bg-slate-800">
//           <Download className="w-4 h-4" />
//           Export
//         </button>
//       </div>

//       {/* STATS */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
//         {stats.map((s) => {
//           const Icon = s.icon;
//           return (
//             <div
//               key={s.label}
//               className="rounded-lg border bg-white dark:bg-slate-900 p-3"
//             >
//               <div className="flex items-center justify-between mb-2">
//                 <p className="text-xs text-muted-foreground">{s.label}</p>
//                 <Icon className="w-4 h-4 text-blue-500" />
//               </div>
//               <p className="text-lg font-semibold">{s.value}</p>
//               <div className="mt-2 h-1.5 w-full rounded bg-slate-200 dark:bg-slate-800">
//                 <div
//                   className="h-1.5 rounded bg-blue-500"
//                   style={{ width: `${s.progress}%` }}
//                 />
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* CHARTS */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//         {/* COMPLETION */}
//         <ChartCard
//           title="Course Completion Trend"
//           icon={TrendingUp}
//           empty
//         />

//         {/* ASSESSMENT */}
//         <ChartCard
//           title="Assessment & Attendance"
//           icon={BarChart3}
//           empty
//         />
//       </div>

//       {/* BATCH + DISTRIBUTION */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//         <ChartCard
//           title="Batch Performance"
//           icon={BookOpen}
//           className="lg:col-span-2"
//           empty
//         />
//         <ChartCard
//           title="Performance Distribution"
//           icon={Target}
//           empty
//         />
//       </div>

//       {/* MODULE + INSIGHTS */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//         <ChartCard title="Module Completion" icon={BookOpen} empty />
//         <ChartCard title="Key Insights" icon={Info} empty />
//       </div>

//       {/* TOP & ATTENTION */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//         <ChartCard title="Top Performers" icon={Trophy} empty />
//         <ChartCard title="Needs Attention" icon={AlertTriangle} empty />
//       </div>
//     </div>
//   );
// };

// /* ---------------- HELPER ---------------- */

// const ChartCard = ({ title, icon: Icon, empty, className = "" }) => (
//   <div
//     className={`rounded-lg border bg-white dark:bg-slate-900 p-4 ${className}`}
//   >
//     <div className="flex items-center gap-2 mb-3">
//       <Icon className="w-4 h-4 text-blue-500" />
//       <h3 className="text-sm font-semibold">{title}</h3>
//     </div>

//     {empty ? (
//       <div className="h-[180px] flex items-center justify-center rounded-md bg-slate-100 dark:bg-slate-800/50">
//         <p className="text-xs text-muted-foreground">No data available</p>
//       </div>
//     ) : null}
//   </div>
// );

// export default PerformanceAnalysis;





















import React, { useState, useEffect } from "react";
import { BarChart3, TrendingUp, CheckCircle, CalendarCheck, Activity, Download, Target, Trophy, AlertTriangle, BookOpen, Info, Sparkles, Users, ArrowUpRight } from "lucide-react";

/* ─── theme tokens ─── */
const T = {
  dark: {
    pageBg: "#0a0a0a", cardBg: "#111111", cardBgHov: "#161616", heroBg: "#141414",
    border: "rgba(255,255,255,0.06)", borderHov: "rgba(255,255,255,0.14)", borderHero: "rgba(255,255,255,0.07)",
    text: "#ffffff", textSub: "rgba(255,255,255,0.3)", textMuted: "rgba(255,255,255,0.2)",
    textLabel: "rgba(255,255,255,0.22)", pillBg: "rgba(255,255,255,0.04)", pillBorder: "rgba(255,255,255,0.07)",
    pillText: "rgba(255,255,255,0.25)", actBg: "rgba(255,255,255,0.04)", actBorder: "rgba(255,255,255,0.07)",
    actBar: "rgba(255,255,255,0.5)", actIcon: "rgba(255,255,255,0.3)",
    shadow: "0 4px 20px rgba(0,0,0,0.4)", shadowHov: "0 20px 60px rgba(0,0,0,0.6)",
    gridLine: "rgba(255,255,255,0.5)", barBg: "rgba(255,255,255,0.05)",
    emptyBorder: "rgba(255,255,255,0.07)", emptyBg: "rgba(255,255,255,0.02)", emptyIcon: "rgba(255,255,255,0.12)",
    inputBg: "#1a1a1a", inputBorder: "rgba(255,255,255,0.08)", inputText: "#ffffff",
  },
  light: {
    pageBg: "#f1f5f9", cardBg: "#ffffff", cardBgHov: "#f8fafc", heroBg: "#ffffff",
    border: "#e2e8f0", borderHov: "#cbd5e1", borderHero: "#e2e8f0",
    text: "#0f172a", textSub: "#64748b", textMuted: "#94a3b8",
    textLabel: "#94a3b8", pillBg: "#f1f5f9", pillBorder: "#e2e8f0", pillText: "#94a3b8",
    actBg: "#f8fafc", actBorder: "#e2e8f0", actBar: "#94a3b8", actIcon: "#94a3b8",
    shadow: "0 1px 8px rgba(0,0,0,0.07)", shadowHov: "0 8px 32px rgba(0,0,0,0.10)",
    gridLine: "rgba(0,0,0,0.12)", barBg: "#f1f5f9",
    emptyBorder: "#e2e8f0", emptyBg: "#f8fafc", emptyIcon: "#cbd5e1",
    inputBg: "#f8fafc", inputBorder: "#e2e8f0", inputText: "#0f172a",
  },
};

const PerformanceAnalysis = () => {
  const [timeRange, setTimeRange] = useState("6months");
  const [isDark, setIsDark] = useState(
    () => typeof document !== "undefined" && (document.documentElement.classList.contains("dark") || document.documentElement.getAttribute("data-theme") === "dark")
  );
  useEffect(() => {
    const obs = new MutationObserver(() => setIsDark(document.documentElement.classList.contains("dark") || document.documentElement.getAttribute("data-theme") === "dark"));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
    return () => obs.disconnect();
  }, []);
  const t = isDark ? T.dark : T.light;

  const stats = [
    { label: "Course Completion", value: "0%", icon: BookOpen, color: "#34d399", target: "80%", progress: 0 },
    { label: "Assessment Score", value: "0%", icon: Target, color: "#22d3ee", target: "85%", progress: 0 },
    { label: "Attendance", value: "0%", icon: CalendarCheck, color: "#a78bfa", target: "90%", progress: 0 },
    { label: "Engagement", value: "0%", icon: Activity, color: "#f59e0b", target: "90%", progress: 0 },
  ];

  const chartSections = [
    [
      { title: "Course Completion Trend", icon: TrendingUp, color: "#34d399", span: 1 },
      { title: "Assessment & Attendance", icon: BarChart3, color: "#22d3ee", span: 1 },
    ],
    [
      { title: "Batch Performance", icon: BookOpen, color: "#a78bfa", span: 2 },
      { title: "Performance Distribution", icon: Target, color: "#f59e0b", span: 1 },
    ],
    [
      { title: "Module Completion", icon: BookOpen, color: "#2dd4bf", span: 1 },
      { title: "Key Insights", icon: Info, color: "#fb923c", span: 1 },
    ],
    [
      { title: "Top Performers", icon: Trophy, color: "#f59e0b", span: 1 },
      { title: "Needs Attention", icon: AlertTriangle, color: "#f87171", span: 1 },
    ],
  ];

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
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes pulse-ring{0%{box-shadow:0 0 0 0 rgba(52,211,153,0.5)}70%{box-shadow:0 0 0 8px rgba(52,211,153,0)}100%{box-shadow:0 0 0 0 rgba(52,211,153,0)}}
        .livebadge{animation:pulse-ring 2.2s ease-out infinite}
      `}</style>

      <div style={{ minHeight: "100vh", background: t.pageBg, color: t.text, fontFamily: "'Poppins',sans-serif", transition: "background 0.3s,color 0.3s" }}>
        <div style={{ position: "relative", zIndex: 1, padding: 24, maxWidth: 1300, margin: "0 auto", paddingBottom: 52 }}>

          {/* ═══ HERO ═══ */}
          <div className="dfade" style={{ borderRadius: 24, padding: "30px 36px", background: t.heroBg, border: `1px solid ${t.borderHero}`, position: "relative", overflow: "hidden", marginBottom: 20, boxShadow: t.shadow }}>
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: isDark ? 0.04 : 0.025, backgroundImage: `linear-gradient(${t.gridLine} 1px,transparent 1px),linear-gradient(90deg,${t.gridLine} 1px,transparent 1px)`, backgroundSize: "40px 40px" }} />
            <div style={{ position: "absolute", top: "-30%", left: "40%", width: 300, height: 200, background: "radial-gradient(ellipse,rgba(34,211,238,0.06),transparent 70%)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: "-40%", right: "10%", width: 250, height: 200, background: "radial-gradient(ellipse,rgba(167,139,250,0.06),transparent 70%)", pointerEvents: "none" }} />

            <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
                  <Sparkles size={11} color={t.textSub} />
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: t.textSub, fontFamily: "'Poppins',sans-serif" }}>Analytics</span>
                </div>
                <h1 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 900, fontSize: "clamp(1.6rem,3vw,2.4rem)", color: t.text, margin: 0, lineHeight: 1.1, letterSpacing: "-0.02em" }}>Performance Analysis</h1>
                <p style={{ fontSize: 12, color: t.textSub, marginTop: 7, fontWeight: 500, fontFamily: "'Poppins',sans-serif" }}>Student performance &amp; batch insights at a glance</p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {/* Time range selector */}
                <div style={{ display: "flex", gap: 4, background: t.actBg, border: `1px solid ${t.actBorder}`, borderRadius: 10, padding: 4 }}>
                  {[{ key: "3months", label: "3M" }, { key: "6months", label: "6M" }, { key: "1year", label: "1Y" }].map(({ key, label }) => (
                    <button key={key} onClick={() => setTimeRange(key)} style={{ padding: "5px 12px", borderRadius: 7, border: "none", fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", cursor: "pointer", fontFamily: "'Poppins',sans-serif", transition: "all 0.2s", background: timeRange === key ? "#22d3ee" : "transparent", color: timeRange === key ? "#000" : t.textMuted }}>
                      {label}
                    </button>
                  ))}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8, background: t.actBg, border: `1px solid ${t.actBorder}`, borderRadius: 10, padding: "8px 14px" }}>
                  <Activity size={12} color={t.actIcon} />
                  <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 14 }}>
                    <span className="d1" style={{ width: 3, height: 10, borderRadius: 2, background: t.actBar, display: "block" }} />
                    <span className="d2" style={{ width: 3, height: 14, borderRadius: 2, background: t.actBar, display: "block" }} />
                    <span className="d3" style={{ width: 3, height: 7, borderRadius: 2, background: t.actBar, display: "block" }} />
                  </div>
                </div>

                <ExportBtn t={t} />
              </div>
            </div>
          </div>

          {/* ═══ STAT CARDS ═══ */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14, marginBottom: 20 }}>
            {stats.map((s, i) => (
              <StatCard key={i} stat={s} index={i} t={t} />
            ))}
          </div>

          {/* ═══ CHART ROWS ═══ */}
          {chartSections.map((row, ri) => (
            <div key={ri} style={{ display: "grid", gridTemplateColumns: row.map(c => c.span === 2 ? "2fr" : "1fr").join(" "), gap: 14, marginBottom: 14 }}>
              {row.map((chart, ci) => (
                <ChartCard key={ci} chart={chart} t={t} isDark={isDark} index={ri * 10 + ci} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

/* ─── Stat Card ─── */
function StatCard({ stat, index, t }) {
  const [hov, setHov] = useState(false);
  const Icon = stat.icon;
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} className="dfade" style={{
      animationDelay: `${index * 80}ms`, background: hov ? t.cardBgHov : t.cardBg,
      border: `1px solid ${hov ? stat.color + "30" : t.border}`,
      boxShadow: hov ? `${t.shadowHov}, 0 0 40px ${stat.color}12` : t.shadow,
      borderRadius: 20, padding: "22px 22px 20px", display: "flex", flexDirection: "column", gap: 14,
      position: "relative", overflow: "hidden", transition: "all 0.25s ease",
    }}>
      <div style={{ position: "absolute", top: -20, right: -20, width: 90, height: 90, borderRadius: "50%", background: stat.color, filter: "blur(40px)", opacity: hov ? 0.15 : 0.04, transition: "opacity 0.4s", pointerEvents: "none" }} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ width: 42, height: 42, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", background: `${stat.color}18`, border: `1px solid ${stat.color}30` }}>
          <Icon size={19} color={stat.color} strokeWidth={2} />
        </div>
        <span style={{ fontSize: 9, fontWeight: 700, color: t.textMuted, fontFamily: "'Poppins',sans-serif", letterSpacing: "0.06em" }}>TARGET {stat.target}</span>
      </div>
      <div>
        <p style={{ fontSize: 40, fontWeight: 800, lineHeight: 1, fontFamily: "'Poppins',sans-serif", color: t.text, margin: 0 }}>{stat.value}</p>
        <p style={{ fontSize: 10, marginTop: 6, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: t.textMuted, fontFamily: "'Poppins',sans-serif", margin: "6px 0 0" }}>{stat.label}</p>
      </div>
      <div style={{ height: 2, background: t.barBg, borderRadius: 99, overflow: "hidden" }}>
        <div style={{ height: "100%", borderRadius: 99, background: stat.color, width: hov ? "65%" : "20%", transition: "width 0.65s ease", opacity: 0.85 }} />
      </div>
    </div>
  );
}

/* ─── Chart Card (empty state) ─── */
function ChartCard({ chart, t, isDark, index }) {
  const Icon = chart.icon;
  return (
    <div className="dfade" style={{ animationDelay: `${index * 40}ms`, background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 20, padding: 22, boxShadow: t.shadow }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: `${chart.color}18`, border: `1px solid ${chart.color}30` }}>
            <Icon size={15} color={chart.color} />
          </div>
          <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 13, color: t.text }}>{chart.title}</span>
        </div>
        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "4px 10px", borderRadius: 999, background: t.pillBg, border: `1px solid ${t.pillBorder}`, color: t.pillText, fontFamily: "'Poppins',sans-serif" }}>
          No Data
        </span>
      </div>

      {/* Empty state placeholder */}
      <div style={{ height: 180, borderRadius: 14, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, border: `1.5px dashed ${t.emptyBorder}`, background: t.emptyBg }}>
        {/* Mini bar chart placeholder */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 5, opacity: 0.3 }}>
          {[40, 65, 30, 75, 50, 85, 45].map((h, i) => (
            <div key={i} style={{ width: 12, height: h * 0.6, borderRadius: 4, background: chart.color }} />
          ))}
        </div>
        <p style={{ fontSize: 11, color: t.textMuted, fontWeight: 500, fontFamily: "'Poppins',sans-serif", margin: 0 }}>No data available yet</p>
        <p style={{ fontSize: 9, color: t.emptyIcon, fontWeight: 500, fontFamily: "'Poppins',sans-serif", margin: 0, letterSpacing: "0.05em" }}>Data will appear as students engage</p>
      </div>
    </div>
  );
}

function ExportBtn({ t }) {
  const [hov, setHov] = useState(false);
  return (
    <button onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 16px", borderRadius: 10, border: `1px solid ${hov ? "rgba(34,211,238,0.4)" : t.actBorder}`, background: hov ? "rgba(34,211,238,0.1)" : t.actBg, color: hov ? "#22d3ee" : t.textMuted, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "'Poppins',sans-serif", transition: "all 0.2s", letterSpacing: "0.03em" }}>
      <Download size={13} /> Export
    </button>
  );
}

export default PerformanceAnalysis;