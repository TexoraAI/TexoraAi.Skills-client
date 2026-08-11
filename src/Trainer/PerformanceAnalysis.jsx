// import React, { useState, useEffect } from "react";
// import { BarChart3, TrendingUp, CheckCircle, CalendarCheck, Activity, Download, Target, Trophy, AlertTriangle, BookOpen, Info, Sparkles, Users, ArrowUpRight } from "lucide-react";

// /* ─── theme tokens ─── */
// const T = {
//   dark: {
//     pageBg: "#0a0a0a", cardBg: "#111111", cardBgHov: "#161616", heroBg: "#141414",
//     border: "rgba(255,255,255,0.06)", borderHov: "rgba(255,255,255,0.14)", borderHero: "rgba(255,255,255,0.07)",
//     text: "#ffffff", textSub: "rgba(255,255,255,0.3)", textMuted: "rgba(255,255,255,0.2)",
//     textLabel: "rgba(255,255,255,0.22)", pillBg: "rgba(255,255,255,0.04)", pillBorder: "rgba(255,255,255,0.07)",
//     pillText: "rgba(255,255,255,0.25)", actBg: "rgba(255,255,255,0.04)", actBorder: "rgba(255,255,255,0.07)",
//     actBar: "rgba(255,255,255,0.5)", actIcon: "rgba(255,255,255,0.3)",
//     shadow: "0 4px 20px rgba(0,0,0,0.4)", shadowHov: "0 20px 60px rgba(0,0,0,0.6)",
//     gridLine: "rgba(255,255,255,0.5)", barBg: "rgba(255,255,255,0.05)",
//     emptyBorder: "rgba(255,255,255,0.07)", emptyBg: "rgba(255,255,255,0.02)", emptyIcon: "rgba(255,255,255,0.12)",
//     inputBg: "#1a1a1a", inputBorder: "rgba(255,255,255,0.08)", inputText: "#ffffff",
//   },
//   light: {
//     pageBg: "#f1f5f9", cardBg: "#ffffff", cardBgHov: "#f8fafc", heroBg: "#ffffff",
//     border: "#e2e8f0", borderHov: "#cbd5e1", borderHero: "#e2e8f0",
//     text: "#0f172a", textSub: "#64748b", textMuted: "#94a3b8",
//     textLabel: "#94a3b8", pillBg: "#f1f5f9", pillBorder: "#e2e8f0", pillText: "#94a3b8",
//     actBg: "#f8fafc", actBorder: "#e2e8f0", actBar: "#94a3b8", actIcon: "#94a3b8",
//     shadow: "0 1px 8px rgba(0,0,0,0.07)", shadowHov: "0 8px 32px rgba(0,0,0,0.10)",
//     gridLine: "rgba(0,0,0,0.12)", barBg: "#f1f5f9",
//     emptyBorder: "#e2e8f0", emptyBg: "#f8fafc", emptyIcon: "#cbd5e1",
//     inputBg: "#f8fafc", inputBorder: "#e2e8f0", inputText: "#0f172a",
//   },
// };

// const PerformanceAnalysis = () => {
//   const [timeRange, setTimeRange] = useState("6months");
//   const [isDark, setIsDark] = useState(
//     () => typeof document !== "undefined" && (document.documentElement.classList.contains("dark") || document.documentElement.getAttribute("data-theme") === "dark")
//   );
//   useEffect(() => {
//     const obs = new MutationObserver(() => setIsDark(document.documentElement.classList.contains("dark") || document.documentElement.getAttribute("data-theme") === "dark"));
//     obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
//     return () => obs.disconnect();
//   }, []);
//   const t = isDark ? T.dark : T.light;

//   const stats = [
//     { label: "Course Completion", value: "0%", icon: BookOpen, color: "#34d399", target: "80%", progress: 0 },
//     { label: "Assessment Score", value: "0%", icon: Target, color: "#22d3ee", target: "85%", progress: 0 },
//     { label: "Attendance", value: "0%", icon: CalendarCheck, color: "#a78bfa", target: "90%", progress: 0 },
//     { label: "Engagement", value: "0%", icon: Activity, color: "#f59e0b", target: "90%", progress: 0 },
//   ];

//   const chartSections = [
//     [
//       { title: "Course Completion Trend", icon: TrendingUp, color: "#34d399", span: 1 },
//       { title: "Assessment & Attendance", icon: BarChart3, color: "#22d3ee", span: 1 },
//     ],
//     [
//       { title: "Batch Performance", icon: BookOpen, color: "#a78bfa", span: 2 },
//       { title: "Performance Distribution", icon: Target, color: "#f59e0b", span: 1 },
//     ],
//     [
//       { title: "Module Completion", icon: BookOpen, color: "#2dd4bf", span: 1 },
//       { title: "Key Insights", icon: Info, color: "#fb923c", span: 1 },
//     ],
//     [
//       { title: "Top Performers", icon: Trophy, color: "#f59e0b", span: 1 },
//       { title: "Needs Attention", icon: AlertTriangle, color: "#f87171", span: 1 },
//     ],
//   ];

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
//         @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
//         .dfade{animation:fadeUp 0.45s ease both}
//         @keyframes blink{0%,100%{opacity:1}50%{opacity:0.15}}
//         .d1{animation:blink 1.6s ease infinite}
//         .d2{animation:blink 1.6s 0.3s ease infinite}
//         .d3{animation:blink 1.6s 0.6s ease infinite}
//         @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
//         @keyframes pulse-ring{0%{box-shadow:0 0 0 0 rgba(52,211,153,0.5)}70%{box-shadow:0 0 0 8px rgba(52,211,153,0)}100%{box-shadow:0 0 0 0 rgba(52,211,153,0)}}
//         .livebadge{animation:pulse-ring 2.2s ease-out infinite}
//       `}</style>

//       <div style={{ minHeight: "100vh", background: t.pageBg, color: t.text, fontFamily: "'Poppins',sans-serif", transition: "background 0.3s,color 0.3s" }}>
//         <div style={{ position: "relative", zIndex: 1, padding: 24, maxWidth: 1300, margin: "0 auto", paddingBottom: 52 }}>

//           {/* ═══ HERO ═══ */}
//           <div className="dfade" style={{ borderRadius: 24, padding: "30px 36px", background: t.heroBg, border: `1px solid ${t.borderHero}`, position: "relative", overflow: "hidden", marginBottom: 20, boxShadow: t.shadow }}>
//             <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: isDark ? 0.04 : 0.025, backgroundImage: `linear-gradient(${t.gridLine} 1px,transparent 1px),linear-gradient(90deg,${t.gridLine} 1px,transparent 1px)`, backgroundSize: "40px 40px" }} />
//             <div style={{ position: "absolute", top: "-30%", left: "40%", width: 300, height: 200, background: "radial-gradient(ellipse,rgba(34,211,238,0.06),transparent 70%)", pointerEvents: "none" }} />
//             <div style={{ position: "absolute", bottom: "-40%", right: "10%", width: 250, height: 200, background: "radial-gradient(ellipse,rgba(167,139,250,0.06),transparent 70%)", pointerEvents: "none" }} />

//             <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
//               <div>
//                 <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
//                   <Sparkles size={11} color={t.textSub} />
//                   <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: t.textSub, fontFamily: "'Poppins',sans-serif" }}>Analytics</span>
//                 </div>
//                 <h1 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 900, fontSize: "clamp(1.6rem,3vw,2.4rem)", color: t.text, margin: 0, lineHeight: 1.1, letterSpacing: "-0.02em" }}>Performance Analysis</h1>
//                 <p style={{ fontSize: 12, color: t.textSub, marginTop: 7, fontWeight: 500, fontFamily: "'Poppins',sans-serif" }}>Student performance &amp; batch insights at a glance</p>
//               </div>

//               <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//                 {/* Time range selector */}
//                 <div style={{ display: "flex", gap: 4, background: t.actBg, border: `1px solid ${t.actBorder}`, borderRadius: 10, padding: 4 }}>
//                   {[{ key: "3months", label: "3M" }, { key: "6months", label: "6M" }, { key: "1year", label: "1Y" }].map(({ key, label }) => (
//                     <button key={key} onClick={() => setTimeRange(key)} style={{ padding: "5px 12px", borderRadius: 7, border: "none", fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", cursor: "pointer", fontFamily: "'Poppins',sans-serif", transition: "all 0.2s", background: timeRange === key ? "#22d3ee" : "transparent", color: timeRange === key ? "#000" : t.textMuted }}>
//                       {label}
//                     </button>
//                   ))}
//                 </div>

//                 <div style={{ display: "flex", alignItems: "center", gap: 8, background: t.actBg, border: `1px solid ${t.actBorder}`, borderRadius: 10, padding: "8px 14px" }}>
//                   <Activity size={12} color={t.actIcon} />
//                   <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 14 }}>
//                     <span className="d1" style={{ width: 3, height: 10, borderRadius: 2, background: t.actBar, display: "block" }} />
//                     <span className="d2" style={{ width: 3, height: 14, borderRadius: 2, background: t.actBar, display: "block" }} />
//                     <span className="d3" style={{ width: 3, height: 7, borderRadius: 2, background: t.actBar, display: "block" }} />
//                   </div>
//                 </div>

//                 <ExportBtn t={t} />
//               </div>
//             </div>
//           </div>

//           {/* ═══ STAT CARDS ═══ */}
//           <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14, marginBottom: 20 }}>
//             {stats.map((s, i) => (
//               <StatCard key={i} stat={s} index={i} t={t} />
//             ))}
//           </div>

//           {/* ═══ CHART ROWS ═══ */}
//           {chartSections.map((row, ri) => (
//             <div key={ri} style={{ display: "grid", gridTemplateColumns: row.map(c => c.span === 2 ? "2fr" : "1fr").join(" "), gap: 14, marginBottom: 14 }}>
//               {row.map((chart, ci) => (
//                 <ChartCard key={ci} chart={chart} t={t} isDark={isDark} index={ri * 10 + ci} />
//               ))}
//             </div>
//           ))}
//         </div>
//       </div>
//     </>
//   );
// };

// /* ─── Stat Card ─── */
// function StatCard({ stat, index, t }) {
//   const [hov, setHov] = useState(false);
//   const Icon = stat.icon;
//   return (
//     <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} className="dfade" style={{
//       animationDelay: `${index * 80}ms`, background: hov ? t.cardBgHov : t.cardBg,
//       border: `1px solid ${hov ? stat.color + "30" : t.border}`,
//       boxShadow: hov ? `${t.shadowHov}, 0 0 40px ${stat.color}12` : t.shadow,
//       borderRadius: 20, padding: "22px 22px 20px", display: "flex", flexDirection: "column", gap: 14,
//       position: "relative", overflow: "hidden", transition: "all 0.25s ease",
//     }}>
//       <div style={{ position: "absolute", top: -20, right: -20, width: 90, height: 90, borderRadius: "50%", background: stat.color, filter: "blur(40px)", opacity: hov ? 0.15 : 0.04, transition: "opacity 0.4s", pointerEvents: "none" }} />
//       <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//         <div style={{ width: 42, height: 42, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", background: `${stat.color}18`, border: `1px solid ${stat.color}30` }}>
//           <Icon size={19} color={stat.color} strokeWidth={2} />
//         </div>
//         <span style={{ fontSize: 9, fontWeight: 700, color: t.textMuted, fontFamily: "'Poppins',sans-serif", letterSpacing: "0.06em" }}>TARGET {stat.target}</span>
//       </div>
//       <div>
//         <p style={{ fontSize: 40, fontWeight: 800, lineHeight: 1, fontFamily: "'Poppins',sans-serif", color: t.text, margin: 0 }}>{stat.value}</p>
//         <p style={{ fontSize: 10, marginTop: 6, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: t.textMuted, fontFamily: "'Poppins',sans-serif", margin: "6px 0 0" }}>{stat.label}</p>
//       </div>
//       <div style={{ height: 2, background: t.barBg, borderRadius: 99, overflow: "hidden" }}>
//         <div style={{ height: "100%", borderRadius: 99, background: stat.color, width: hov ? "65%" : "20%", transition: "width 0.65s ease", opacity: 0.85 }} />
//       </div>
//     </div>
//   );
// }

// /* ─── Chart Card (empty state) ─── */
// function ChartCard({ chart, t, isDark, index }) {
//   const Icon = chart.icon;
//   return (
//     <div className="dfade" style={{ animationDelay: `${index * 40}ms`, background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 20, padding: 22, boxShadow: t.shadow }}>
//       <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//           <div style={{ width: 34, height: 34, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: `${chart.color}18`, border: `1px solid ${chart.color}30` }}>
//             <Icon size={15} color={chart.color} />
//           </div>
//           <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 13, color: t.text }}>{chart.title}</span>
//         </div>
//         <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "4px 10px", borderRadius: 999, background: t.pillBg, border: `1px solid ${t.pillBorder}`, color: t.pillText, fontFamily: "'Poppins',sans-serif" }}>
//           No Data
//         </span>
//       </div>

//       {/* Empty state placeholder */}
//       <div style={{ height: 180, borderRadius: 14, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, border: `1.5px dashed ${t.emptyBorder}`, background: t.emptyBg }}>
//         {/* Mini bar chart placeholder */}
//         <div style={{ display: "flex", alignItems: "flex-end", gap: 5, opacity: 0.3 }}>
//           {[40, 65, 30, 75, 50, 85, 45].map((h, i) => (
//             <div key={i} style={{ width: 12, height: h * 0.6, borderRadius: 4, background: chart.color }} />
//           ))}
//         </div>
//         <p style={{ fontSize: 11, color: t.textMuted, fontWeight: 500, fontFamily: "'Poppins',sans-serif", margin: 0 }}>No data available yet</p>
//         <p style={{ fontSize: 9, color: t.emptyIcon, fontWeight: 500, fontFamily: "'Poppins',sans-serif", margin: 0, letterSpacing: "0.05em" }}>Data will appear as students engage</p>
//       </div>
//     </div>
//   );
// }

// function ExportBtn({ t }) {
//   const [hov, setHov] = useState(false);
//   return (
//     <button onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 16px", borderRadius: 10, border: `1px solid ${hov ? "rgba(34,211,238,0.4)" : t.actBorder}`, background: hov ? "rgba(34,211,238,0.1)" : t.actBg, color: hov ? "#22d3ee" : t.textMuted, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "'Poppins',sans-serif", transition: "all 0.2s", letterSpacing: "0.03em" }}>
//       <Download size={13} /> Export
//     </button>
//   );
// }

// export default PerformanceAnalysis;


















































import React, { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  CalendarCheck,
  Activity,
  Download,
  Target,
  Trophy,
  AlertTriangle,
  BookOpen,
  Info,
  Sparkles,
} from "lucide-react";

// ─── Global Design System — single source of truth for colors, type,
// spacing, radius, StatCard, PageContainer and Hero. This page must not
// redeclare tokens or components that already live there (see the
// Trainer Attendance page, the Golden Reference, which this page now
// visually matches).
import {
  T,
  FONT_FAMILY,
  FONT_WEIGHT,
  FONT_SIZE,
  LINE_HEIGHT,
  LETTER_SPACING,
  RADIUS,
  CARD_PADDING,
  ACCENT_PURPLE,
  PageContainer,
  Hero,
  StatCard,
} from "@/design-system";

/* ─────────────────────────────────────────────────────────────────────────
   Page-local layout helpers only — no color/spacing/radius values are
   invented here, everything is sourced from the theme token object (t)
   or the shared FONT_FAMILY / FONT_WEIGHT / RADIUS / CARD_PADDING tokens,
   exactly the same way Attendance.jsx's SectionCard / SectionHeader /
   EmptyBlock / PillButton are page-local but token-driven.
───────────────────────────────────────────────────────────────────────── */

const isDark = () =>
  document.documentElement.classList.contains("dark") ||
  document.documentElement.getAttribute("data-theme") === "dark" ||
  document.body.classList.contains("dark") ||
  window.matchMedia("(prefers-color-scheme: dark)").matches;

function IconBadge({ icon: Icon, color, size = 34, iconSize = 15 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: RADIUS.chip,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `${color}18`,
        border: `1px solid ${color}30`,
        flexShrink: 0,
      }}
    >
      <Icon size={iconSize} color={color} />
    </div>
  );
}

function SectionCard({ t, children, style }) {
  return (
    <div
      style={{
        background: t.cardBg,
        border: `1px solid ${t.border}`,
        borderRadius: RADIUS.standardCard,
        padding: CARD_PADDING.standardCard,
        boxShadow: t.shadow,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function SectionHeader({ t, icon: Icon, color, title, sub, right }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
        flexWrap: "wrap",
        gap: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <IconBadge icon={Icon} color={color} />
        <div>
          <div
            style={{
              fontFamily: FONT_FAMILY,
              fontWeight: FONT_WEIGHT.bold,
              fontSize: 13,
              color: t.text,
            }}
          >
            {title}
          </div>
          {sub && (
            <div
              style={{
                fontSize: 11,
                color: t.textMuted,
                fontFamily: FONT_FAMILY,
                marginTop: 2,
              }}
            >
              {sub}
            </div>
          )}
        </div>
      </div>
      {right}
    </div>
  );
}

function PillButton({ active, color, onClick, children, t }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "7px 14px",
        borderRadius: RADIUS.pill,
        border: `1px solid ${active ? `${color}55` : t.pillBorder}`,
        background: active ? `${color}18` : t.pillBg,
        color: active ? color : t.textMuted,
        fontFamily: FONT_FAMILY,
        fontWeight: 700,
        fontSize: 12,
        cursor: "pointer",
        transition: "all .15s",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </button>
  );
}

function SolidButton({ color, icon: Icon, children, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: "11px 22px",
        borderRadius: RADIUS.button,
        border: "none",
        background: color,
        color: "#fff",
        fontFamily: FONT_FAMILY,
        fontWeight: 700,
        fontSize: 13,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.55 : 1,
        transition: "opacity .2s, transform .15s",
      }}
    >
      {Icon && <Icon size={14} />} {children}
    </button>
  );
}

function EmptyBlock({ t, color = "#22d3ee", title, sub }) {
  return (
    <div
      style={{
        height: 180,
        borderRadius: RADIUS.chip,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        border: `1.5px dashed ${t.emptyBorder}`,
        background: t.emptyBg,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-end", gap: 5, opacity: 0.3 }}>
        {[40, 65, 30, 75, 50, 85, 45].map((h, i) => (
          <div
            key={i}
            style={{ width: 12, height: h * 0.6, borderRadius: 4, background: color }}
          />
        ))}
      </div>
      <p
        style={{
          fontSize: 11,
          color: t.textMuted,
          fontWeight: 500,
          fontFamily: FONT_FAMILY,
          margin: 0,
        }}
      >
        {title}
      </p>
      {sub && (
        <p
          style={{
            fontSize: 9,
            color: t.emptyIcon,
            fontWeight: 500,
            fontFamily: FONT_FAMILY,
            margin: 0,
            letterSpacing: "0.05em",
          }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

/* ─── chart card (token-driven, same visual language as SectionCard rows
   on Attendance's History & Reports tab) ─── */
function ChartCard({ chart, t, index }) {
  const pill = {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    padding: "4px 10px",
    borderRadius: RADIUS.pill,
    background: t.pillBg,
    border: `1px solid ${t.pillBorder}`,
    color: t.pillText,
    fontFamily: FONT_FAMILY,
  };
  return (
    <SectionCard t={t} style={{ animationDelay: `${index * 40}ms` }}>
      <SectionHeader
        t={t}
        icon={chart.icon}
        color={chart.color}
        title={chart.title}
        right={<span style={pill}>No Data</span>}
      />
      <EmptyBlock
        t={t}
        color={chart.color}
        title="No data available yet"
        sub="Data will appear as students engage"
      />
    </SectionCard>
  );
}

const TIME_RANGES = [
  { key: "3months", label: "3M" },
  { key: "6months", label: "6M" },
  { key: "1year", label: "1Y" },
];

const PerformanceAnalysis = () => {
  const [timeRange, setTimeRange] = useState("6months");
  const [dark, setDark] = useState(isDark);

  useEffect(() => {
    const obs = new MutationObserver(() => setDark(isDark()));
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });
    obs.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  const t = dark ? T.dark : T.light;

  // ── stat cards — rendered through the shared design-system <StatCard>,
  // colorKey drawn from the same blue/green/purple/red set the Trainer
  // Attendance/Assessments pages use. numericValue is always a plain
  // Number (matching Assessments.jsx's `totalScheduled` / `Number(avgRecentScore)`
  // pattern) — never a pre-formatted "0%" string, which is what produced
  // NaN before (StatCard coerces numericValue with Number()).
  const statCards = [
    {
      label: "Course Completion",
      numericValue: 0,
      suffix: "%",
      change: "Target 80%",
      icon: BookOpen,
      colorKey: "green",
    },
    {
      label: "Assessment Score",
      numericValue: 0,
      suffix: "%",
      change: "Target 85%",
      icon: Target,
      colorKey: "blue",
    },
    {
      label: "Attendance",
      numericValue: 0,
      suffix: "%",
      change: "Target 90%",
      icon: CalendarCheck,
      colorKey: "purple",
    },
    {
      label: "Engagement",
      numericValue: 0,
      suffix: "%",
      change: "Target 90%",
      icon: Activity,
      colorKey: "red",
    },
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
    <PageContainer mode={dark ? "dark" : "light"} pageBg={t.pageBg} textColor={t.text}>
      <style>{`
        @keyframes pa-blink{0%,100%{opacity:1}50%{opacity:0.15}}
        .pa-d1{animation:pa-blink 1.6s ease infinite}
        .pa-d2{animation:pa-blink 1.6s 0.3s ease infinite}
        .pa-d3{animation:pa-blink 1.6s 0.6s ease infinite}
        @media (max-width:560px){
          .pa-hero-actions{flex-direction:column;align-items:stretch;width:100%;}
          .pa-time-range{width:100%;justify-content:space-between;}
        }
        @media (max-width:860px){
          .pa-chart-row{grid-template-columns:1fr !important;}
        }
      `}</style>

      {/* ═══ HERO — shared <Hero> component, matches Trainer Attendance exactly ═══ */}
      <Hero borderHero={t.borderHero}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <Sparkles size={11} color={t.textSub} />
            <span
              style={{
                fontSize: FONT_SIZE.eyebrow,
                fontWeight: FONT_WEIGHT.bold,
                letterSpacing: LETTER_SPACING.eyebrowWide,
                textTransform: "uppercase",
                color: t.textSub,
                fontFamily: FONT_FAMILY,
              }}
            >
              Analytics
            </span>
          </div>
          <h1
            style={{
              fontFamily: FONT_FAMILY,
              fontWeight: FONT_WEIGHT.heroTitle,
              fontSize: FONT_SIZE.heroTitle,
              color: ACCENT_PURPLE.base,
              margin: "0 0 6px",
              lineHeight: LINE_HEIGHT.heroTitle,
              letterSpacing: LETTER_SPACING.heroTitle,
            }}
          >
            Performance Analysis
          </h1>
          <p
            style={{
              fontSize: FONT_SIZE.bodySmall,
              color: t.textSub,
              margin: 0,
              fontWeight: FONT_WEIGHT.medium,
              fontFamily: FONT_FAMILY,
            }}
          >
            Student performance &amp; batch insights at a glance
          </p>
        </div>

        <div className="hero-badges pa-hero-actions">
          <div className="pa-time-range" style={{ display: "flex", gap: 4, background: t.actBg, border: `1px solid ${t.actBorder}`, borderRadius: RADIUS.chip, padding: 4 }}>
            {TIME_RANGES.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setTimeRange(key)}
                style={{
                  padding: "5px 12px",
                  borderRadius: RADIUS.button,
                  border: "none",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  cursor: "pointer",
                  fontFamily: FONT_FAMILY,
                  transition: "all 0.2s",
                  background: timeRange === key ? ACCENT_PURPLE.base : "transparent",
                  color: timeRange === key ? "#000" : t.textMuted,
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: t.actBg,
              border: `1px solid ${t.actBorder}`,
              borderRadius: RADIUS.chip,
              padding: "8px 14px",
            }}
          >
            <Activity size={12} color={t.actIcon} />
            <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 14 }}>
              <span className="pa-d1" style={{ width: 3, height: 10, borderRadius: 2, background: t.actBar, display: "block" }} />
              <span className="pa-d2" style={{ width: 3, height: 14, borderRadius: 2, background: t.actBar, display: "block" }} />
              <span className="pa-d3" style={{ width: 3, height: 7, borderRadius: 2, background: t.actBar, display: "block" }} />
            </div>
          </div>

          <SolidButton color={`linear-gradient(135deg,${ACCENT_PURPLE.base},#6366f1)`} icon={Download}>
            Export
          </SolidButton>
        </div>
      </Hero>

      {/* ═══ STAT CARDS — shared <StatCard>, via the shared .stat-grid class ═══ */}
      <div className="stat-grid" style={{ marginBottom: 20 }}>
        {statCards.map((s, i) => (
          <StatCard key={i} stat={s} index={i} loading={false} />
        ))}
      </div>

      {/* ═══ CHART ROWS — token-driven SectionCard grid ═══ */}
      {chartSections.map((row, ri) => (
        <div
          key={ri}
          className="pa-chart-row"
          style={{
            display: "grid",
            gridTemplateColumns: row.map((c) => (c.span === 2 ? "2fr" : "1fr")).join(" "),
            gap: 14,
            marginBottom: 14,
          }}
        >
          {row.map((chart, ci) => (
            <ChartCard key={ci} chart={chart} t={t} index={ri * 10 + ci} />
          ))}
        </div>
      ))}
    </PageContainer>
  );
};

export default PerformanceAnalysis;