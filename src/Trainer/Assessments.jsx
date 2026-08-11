
// import React, { useState } from "react";
// import {
//   ClipboardList, Search, Plus, Calendar, TrendingUp,
//   Users, FileText, BarChart3, Download, Trophy, AlertCircle, Sparkles,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// const STYLES = `
// @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
// :root{--bg:#f1f5f9;--card:#ffffff;--tx:#0f172a;--mu:#64748b;--bd:#e2e8f0;
//   --c1:#22d3ee;--c2:#fb923c;--c3:#34d399;--c4:#a78bfa;--cr:#f87171;
//   --sh:0 4px 24px rgba(0,0,0,0.06);--shl:0 8px 40px rgba(0,0,0,0.10);--r:20px;}
// .as-dk{--bg:#0a0a0a;--card:#111111;--tx:#ffffff;--mu:#94a3b8;--bd:rgba(255,255,255,0.06);
//   --sh:0 4px 24px rgba(0,0,0,0.40);--shl:0 8px 40px rgba(0,0,0,0.60);}
// .as{font-family:'Poppins',sans-serif;min-height:100vh;background:var(--bg);color:var(--tx);padding:24px;box-sizing:border-box;}
// .as-in{max-width:1200px;margin:0 auto;display:flex;flex-direction:column;gap:20px;}

// /* ── HEADER ── */
// .as-hdr{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);padding:28px 32px;box-shadow:var(--sh);display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap;}
// .as-hdr-l{display:flex;align-items:center;gap:16px;}
// .as-ico{width:52px;height:52px;border-radius:14px;background:rgba(34,211,238,.10);border:1px solid rgba(34,211,238,.18);display:flex;align-items:center;justify-content:center;color:var(--c1);flex-shrink:0;}
// .as-bdg{display:inline-flex;align-items:center;gap:6px;padding:4px 11px;border-radius:50px;border:1px solid var(--bd);background:rgba(34,211,238,.08);color:var(--c1);font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;margin-bottom:6px;}

// /* ── HERO TITLE – gradient text (same as TrainerCourseManagement) ── */
// .as-h1{font-family:'Poppins',sans-serif;font-weight:700;font-size:clamp(1.3rem,3vw,1.6rem);margin:0 0 2px;line-height:1.1;letter-spacing:-0.02em;color:var(--tx);}
// .as-h1-grad{background:linear-gradient(135deg,#a78bfa,#22d3ee);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}

// .as-sub{font-size:13px;color:var(--mu);margin:0;}

// /* ── STAT CARDS ── */
// .as-stats{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:16px;}
// .as-stat{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);padding:20px 22px;box-shadow:var(--sh);display:flex;align-items:center;gap:14px;transition:transform .2s,box-shadow .2s;}
// .as-stat:hover{transform:translateY(-2px);box-shadow:var(--shl);}
// .as-si{width:44px;height:44px;border-radius:13px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
// .as-sv{font-size:22px;font-weight:800;line-height:1;margin-bottom:3px;}
// .as-sl{font-size:10px;font-weight:600;color:var(--mu);text-transform:uppercase;letter-spacing:.06em;}

// /* ── PANEL ── */
// .as-panel{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);box-shadow:var(--sh);overflow:hidden;}
// .as-ph{display:flex;align-items:center;justify-content:space-between;padding:18px 24px;border-bottom:1px solid var(--bd);flex-wrap:wrap;gap:12px;}
// .as-phl{display:flex;align-items:center;gap:10px;}
// .as-pico{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
// .as-ptitle{font-size:14px;font-weight:700;color:var(--tx);margin:0 0 2px;}
// .as-psub{font-size:11px;color:var(--mu);margin:0;}
// .as-phbtns{display:flex;gap:8px;flex-wrap:wrap;}
// .as-pbtn{display:inline-flex;align-items:center;gap:6px;padding:9px 16px;border-radius:11px;border:none;font-family:'Poppins',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:opacity .2s,transform .15s;white-space:nowrap;}
// .as-pbtn:hover{opacity:.87;transform:translateY(-1px);}
// .as-pbtn-c{background:var(--c4);color:#0a0a0a;}
// .as-pbtn-o{background:transparent;color:var(--mu);border:1px solid var(--bd)!important;}
// .as-pbtn-o:hover{border-color:rgba(34,211,238,.30)!important;color:var(--c1);}
// .as-pbtn-dl{background:transparent;color:var(--mu);border:1px solid var(--bd)!important;}
// .as-pbtn-dl:hover{border-color:rgba(34,211,238,.30)!important;color:var(--c1);}

// /* ── EMPTY STATE ── */
// .as-emp{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:56px 20px;text-align:center;gap:0;}
// .as-eico{width:64px;height:64px;border-radius:18px;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;}
// .as-et{font-size:15px;font-weight:700;color:var(--tx);margin:0 0 6px;}
// .as-es{font-size:12px;color:var(--mu);max-width:280px;line-height:1.6;margin:0 auto 20px;}
// .as-emp-btns{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;}

// /* ── HELP BOX ── */
// .as-help{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);padding:24px 28px;box-shadow:var(--sh);display:flex;gap:16px;}
// .as-hi{width:44px;height:44px;border-radius:13px;background:rgba(34,211,238,.10);border:1px solid rgba(34,211,238,.15);display:flex;align-items:center;justify-content:center;color:var(--c1);flex-shrink:0;margin-top:2px;}
// .as-ht{font-size:14px;font-weight:700;color:var(--tx);margin:0 0 12px;}
// .as-hl{display:flex;flex-direction:column;gap:8px;}
// .as-hli{display:flex;align-items:flex-start;gap:8px;font-size:12px;color:var(--mu);}
// .as-hd{width:6px;height:6px;border-radius:50%;background:var(--c1);flex-shrink:0;margin-top:4px;}

// /* ════════════════════════════════
//    RESPONSIVE BREAKPOINTS
//    ════════════════════════════════ */

// /* ── TABLET (≤ 900px) ── */
// @media(max-width:900px){
//   .as{padding:18px;}
//   .as-hdr{padding:22px 24px;}
//   .as-h1{font-size:clamp(1.2rem,4vw,1.5rem);}
//   .as-stats{grid-template-columns:repeat(2,1fr);gap:12px;}
//   .as-ph{padding:14px 18px;}
//   .as-emp{padding:40px 16px;}
//   .as-help{padding:20px 22px;}
// }

// /* ── PHONE (≤ 600px) ── */
// @media(max-width:600px){
//   .as{padding:12px;}
//   .as-in{gap:14px;}
//   .as-hdr{padding:18px 18px;flex-direction:column;align-items:flex-start;}
//   .as-hdr-l{gap:12px;}
//   .as-ico{width:44px;height:44px;border-radius:12px;}
//   .as-h1{font-size:clamp(1.1rem,5vw,1.3rem);}
//   .as-sub{font-size:12px;}
//   .as-stats{grid-template-columns:repeat(2,1fr);gap:10px;}
//   .as-stat{padding:14px 16px;gap:10px;}
//   .as-si{width:38px;height:38px;border-radius:10px;}
//   .as-sv{font-size:18px;}
//   .as-ph{padding:12px 16px;gap:10px;}
//   .as-phbtns{width:100%;}
//   .as-pbtn{flex:1;justify-content:center;padding:8px 10px;font-size:11px;}
//   .as-emp{padding:32px 14px;}
//   .as-eico{width:52px;height:52px;}
//   .as-et{font-size:14px;}
//   .as-es{font-size:11px;}
//   .as-emp-btns{flex-direction:column;width:100%;}
//   .as-emp-btns .as-pbtn{width:100%;justify-content:center;}
//   .as-help{padding:16px 18px;gap:12px;flex-wrap:wrap;}
//   .as-hi{width:38px;height:38px;}
//   .as-ht{font-size:13px;}
//   .as-hli{font-size:11px;}
// }

// /* ── SMALL PHONE (≤ 380px) ── */
// @media(max-width:380px){
//   .as{padding:10px;}
//   .as-stats{grid-template-columns:1fr 1fr;}
//   .as-hdr{padding:14px 16px;}
//   .as-bdg{font-size:9px;padding:3px 8px;}
//   .as-pbtn{font-size:10px;padding:7px 8px;}
// }
// `;

// if (!document.getElementById("as-st")) {
//   const t = document.createElement("style");
//   t.id = "as-st";
//   t.textContent = STYLES;
//   document.head.appendChild(t);
// }

// const isDark = () =>
//   document.documentElement.classList.contains("dark") ||
//   document.body.classList.contains("dark") ||
//   window.matchMedia("(prefers-color-scheme: dark)").matches;

// const Assessments = () => {
//   const navigate = useNavigate();
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filterType, setFilterType] = useState("All");
//   const [dark, setDark] = useState(isDark);

//   React.useEffect(() => {
//     const o = new MutationObserver(() => setDark(isDark()));
//     o.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
//     o.observe(document.body, { attributes: true, attributeFilter: ["class"] });
//     return () => o.disconnect();
//   }, []);

//   const upcoming = [];
//   const recentAssessments = [];
//   const totalScheduled = upcoming.filter(a => a.status === "Scheduled").length;
//   const totalDrafts = upcoming.filter(a => a.status === "Draft").length;
//   const totalEnrolled = upcoming.reduce((acc, a) => acc + a.enrolled, 0);
//   const avgRecentScore = recentAssessments.length > 0
//     ? (recentAssessments.reduce((acc, a) => acc + a.avgScore, 0) / recentAssessments.length).toFixed(1)
//     : 0;

//   const stats = [
//     { label: "Scheduled", value: totalScheduled, icon: <Calendar size={18} />, accent: "var(--c4)", bg: "rgba(167,139,250,.10)" },
//     { label: "Drafts", value: totalDrafts, icon: <FileText size={18} />, accent: "var(--c2)", bg: "rgba(251,146,60,.10)" },
//     { label: "Total Students", value: totalEnrolled, icon: <Users size={18} />, accent: "var(--c1)", bg: "rgba(34,211,238,.10)" },
//     { label: "Avg Score", value: `${avgRecentScore}%`, icon: <Trophy size={18} />, accent: "var(--c3)", bg: "rgba(52,211,153,.10)" },
//   ];

//   return (
//     <div className={`as${dark ? " as-dk" : ""}`}>
//       <div className="as-in">

//         {/* ── HEADER ── */}
//         <div className="as-hdr">
//           <div className="as-hdr-l">
//             <div className="as-ico"><ClipboardList size={24} /></div>
//             <div>
//               <div className="as-bdg"><ClipboardList size={10} /> Assessment Center</div>
//               {/* ✅ HERO TITLE – same gradient as TrainerCourseManagement */}
//               <h1 className="as-h1">
//                 Assessments <span className="as-h1-grad">Overview</span>
//               </h1>
//               <p className="as-sub">Manage quizzes and assignments across all your batches</p>
//             </div>
//           </div>
//         </div>

//         {/* ── STAT CARDS ── */}
//         <div className="as-stats">
//           {stats.map((s, i) => (
//             <div key={i} className="as-stat">
//               <div className="as-si" style={{ background: s.bg, color: s.accent }}>{s.icon}</div>
//               <div>
//                 <div className="as-sv" style={{ color: s.accent }}>{s.value}</div>
//                 <div className="as-sl">{s.label}</div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* ── UPCOMING ASSESSMENTS ── */}
//         <div className="as-panel">
//           <div className="as-ph">
//             <div className="as-phl">
//               <div className="as-pico" style={{ background: "rgba(167,139,250,.10)", color: "var(--c4)" }}><Calendar size={16} /></div>
//               <div>
//                 <p className="as-ptitle">Upcoming Assessments</p>
//                 <p className="as-psub">Quizzes & assignments scheduled soon</p>
//               </div>
//             </div>
//             <div className="as-phbtns">
//               <button className="as-pbtn as-pbtn-c" onClick={() => navigate("/trainer/create-quiz")}>
//                 <Plus size={12} /> Quiz
//               </button>
//               <button className="as-pbtn as-pbtn-o" onClick={() => navigate("/trainer/create-assignments")} style={{ border: "1px solid var(--bd)" }}>
//                 <Plus size={12} /> Assignment
//               </button>
//             </div>
//           </div>

//           {upcoming.length === 0 ? (
//             <div className="as-emp">
//               <div className="as-eico" style={{ background: "rgba(167,139,250,.10)", border: "1px solid rgba(167,139,250,.15)" }}>
//                 <ClipboardList size={26} style={{ color: "var(--c4)" }} />
//               </div>
//               <p className="as-et">No Upcoming Assessments</p>
//               <p className="as-es">Get started by creating your first quiz or assignment to track student progress effectively.</p>
//               <div className="as-emp-btns">
//                 <button className="as-pbtn as-pbtn-c" onClick={() => navigate("/trainer/create-quiz")}>
//                   <Plus size={13} /> Create Quiz
//                 </button>
//                 <button className="as-pbtn as-pbtn-o" onClick={() => navigate("/trainer/create-assignments")} style={{ border: "1px solid var(--bd)" }}>
//                   <Plus size={13} /> Create Assignment
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <div style={{ padding: "16px 24px", display: "flex", flexDirection: "column", gap: 8 }}>
//               {upcoming.map(item => (
//                 <div key={item.id} style={{ borderRadius: 13, border: "1px solid var(--bd)", padding: 16, background: "var(--bg)" }} />
//               ))}
//             </div>
//           )}
//         </div>

//         {/* ── RECENT ASSESSMENTS ── */}
//         <div className="as-panel">
//           <div className="as-ph">
//             <div className="as-phl">
//               <div className="as-pico" style={{ background: "rgba(34,211,238,.10)", color: "var(--c1)" }}><BarChart3 size={16} /></div>
//               <div>
//                 <p className="as-ptitle">Recent Assessments</p>
//                 <p className="as-psub">Completed assessments & performance analytics</p>
//               </div>
//             </div>
//             {recentAssessments.length > 0 && (
//               <button className="as-pbtn as-pbtn-dl" style={{ border: "1px solid var(--bd)" }}>
//                 <Download size={12} /> Export
//               </button>
//             )}
//           </div>

//           {recentAssessments.length === 0 ? (
//             <div className="as-emp">
//               <div className="as-eico" style={{ background: "rgba(34,211,238,.10)", border: "1px solid rgba(34,211,238,.15)" }}>
//                 <BarChart3 size={26} style={{ color: "var(--c1)" }} />
//               </div>
//               <p className="as-et">No Completed Assessments Yet</p>
//               <p className="as-es">Once students complete your assessments, you'll see detailed analytics and performance metrics here.</p>
//               <div className="as-hli" style={{ fontSize: 12, color: "var(--mu)" }}>
//                 <Sparkles size={13} style={{ color: "var(--c1)", flexShrink: 0 }} />
//                 <span>Create assessments to start tracking progress</span>
//               </div>
//             </div>
//           ) : (
//             <div style={{ padding: "16px 24px", display: "flex", flexDirection: "column", gap: 8 }}>
//               {recentAssessments.map(item => (
//                 <div key={item.id} style={{ borderRadius: 13, border: "1px solid var(--bd)", padding: 16, background: "var(--bg)" }} />
//               ))}
//             </div>
//           )}
//         </div>

//         {/* ── HELP BOX ── */}
//         <div className="as-help">
//           <div className="as-hi"><AlertCircle size={20} /></div>
//           <div>
//             <h3 className="as-ht">Getting Started with Assessments</h3>
//             <div className="as-hl">
//               {[
//                 "Create quizzes with multiple choice, true/false, and short answer questions",
//                 "Set up assignments for practical tasks with file uploads and deadlines",
//                 "Track student submissions and provide detailed feedback",
//                 "View analytics and performance metrics to identify support areas",
//               ].map((tip, i) => (
//                 <div key={i} className="as-hli">
//                   <span className="as-hd" />
//                   <span>{tip}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default Assessments;


































import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ClipboardList,
  Plus,
  Calendar,
  Users,
  FileText,
  BarChart3,
  Download,
  Trophy,
  AlertCircle,
  Sparkles,
} from "lucide-react";

// ─── Global Design System — single source of truth for colors, type,
// spacing, radius, StatCard, PageContainer and Hero. This page must not
// redeclare tokens or components that already live there (see Trainer
// Dashboard, the Golden Reference, which this page now visually matches).
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

/* ─── panel header — page-local (no design-system equivalent yet) ─── */
function PanelHeader({ icon: Icon, color, title, sub, t, children }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "18px 24px",
        borderBottom: `1px solid ${t.border}`,
        flexWrap: "wrap",
        gap: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: RADIUS.chip,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: `${color}18`,
            border: `1px solid ${color}30`,
            flexShrink: 0,
          }}
        >
          <Icon size={16} color={color} />
        </div>
        <div>
          <p
            style={{
              fontSize: FONT_SIZE.sectionTitle,
              fontWeight: FONT_WEIGHT.bold,
              color: t.text,
              margin: "0 0 2px",
              fontFamily: FONT_FAMILY,
              letterSpacing: LETTER_SPACING.base,
            }}
          >
            {title}
          </p>
          <p
            style={{
              fontSize: FONT_SIZE.caption,
              color: t.textMuted,
              margin: 0,
              fontFamily: FONT_FAMILY,
              letterSpacing: LETTER_SPACING.base,
            }}
          >
            {sub}
          </p>
        </div>
      </div>
      {children && <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{children}</div>}
    </div>
  );
}

/* ─── empty state — page-local (no design-system equivalent yet) ─── */
function EmptyState({ icon: Icon, color, title, text, t, children }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "56px 20px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 18,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 16px",
          background: `${color}18`,
          border: `1px solid ${color}30`,
        }}
      >
        <Icon size={26} color={color} />
      </div>
      <p
        style={{
          fontSize: FONT_SIZE.sectionTitle,
          fontWeight: FONT_WEIGHT.bold,
          color: t.text,
          margin: "0 0 6px",
          fontFamily: FONT_FAMILY,
          letterSpacing: LETTER_SPACING.base,
        }}
      >
        {title}
      </p>
      <p
        style={{
          fontSize: FONT_SIZE.bodySmall,
          color: t.textMuted,
          maxWidth: 300,
          lineHeight: LINE_HEIGHT.body,
          margin: "0 auto 20px",
          fontFamily: FONT_FAMILY,
          letterSpacing: LETTER_SPACING.base,
        }}
      >
        {text}
      </p>
      {children && (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>{children}</div>
      )}
    </div>
  );
}

/* ══ MAIN ══ */
const Assessments = () => {
  const navigate = useNavigate();

  // ── state (unchanged) ────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All");

  const [isDark, setIsDark] = useState(
    () =>
      typeof document !== "undefined" &&
      (document.documentElement.classList.contains("dark") ||
        document.documentElement.getAttribute("data-theme") === "dark"),
  );
  useEffect(() => {
    const obs = new MutationObserver(() => {
      setIsDark(
        document.documentElement.classList.contains("dark") ||
          document.documentElement.getAttribute("data-theme") === "dark",
      );
    });
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });
    return () => obs.disconnect();
  }, []);

  const t = isDark ? T.dark : T.light;

  // ── business logic (unchanged) ───────────────────────────────────────────
  const upcoming = [];
  const recentAssessments = [];
  const totalScheduled = upcoming.filter((a) => a.status === "Scheduled").length;
  const totalDrafts = upcoming.filter((a) => a.status === "Draft").length;
  const totalEnrolled = upcoming.reduce((acc, a) => acc + a.enrolled, 0);
  const avgRecentScore =
    recentAssessments.length > 0
      ? (
          recentAssessments.reduce((acc, a) => acc + a.avgScore, 0) / recentAssessments.length
        ).toFixed(1)
      : 0;

  // ── stat cards — rendered through the shared design-system <StatCard>,
  // colorKey drawn from STAT_COLORS (blue/green/orange/purple/red only),
  // matching the pattern used on the Trainer Dashboard. ────────────────────
  const stats = [
    {
      label: "Scheduled",
      numericValue: totalScheduled,
      change: `${totalScheduled} upcoming`,
      icon: Calendar,
      colorKey: "purple",
    },
    {
      label: "Drafts",
      numericValue: totalDrafts,
      change: `${totalDrafts} pending`,
      icon: FileText,
      colorKey: "orange",
    },
    {
      label: "Total Students",
      numericValue: totalEnrolled,
      change: `${totalEnrolled} enrolled`,
      icon: Users,
      colorKey: "blue",
    },
    {
      label: "Avg Score",
      numericValue: Number(avgRecentScore),
      change: `${avgRecentScore}% average`,
      icon: Trophy,
      colorKey: "green",
    },
  ];

  const card = {
    background: t.cardBg,
    border: `1px solid ${t.border}`,
    borderRadius: RADIUS.standardCard,
    boxShadow: t.shadow,
    overflow: "hidden",
  };

  const filledBtn = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "9px 16px",
    borderRadius: RADIUS.button,
    border: "none",
    fontFamily: FONT_FAMILY,
    fontSize: FONT_SIZE.bodySmall,
    fontWeight: FONT_WEIGHT.bold,
    cursor: "pointer",
    background: ACCENT_PURPLE.base,
    color: "#0a0a0a",
    whiteSpace: "nowrap",
    letterSpacing: LETTER_SPACING.base,
  };

  const outlineBtn = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "9px 16px",
    borderRadius: RADIUS.button,
    border: `1px solid ${t.border}`,
    fontFamily: FONT_FAMILY,
    fontSize: FONT_SIZE.bodySmall,
    fontWeight: FONT_WEIGHT.bold,
    cursor: "pointer",
    background: "transparent",
    color: t.textMuted,
    whiteSpace: "nowrap",
    letterSpacing: LETTER_SPACING.base,
  };

  return (
    <PageContainer mode={isDark ? "dark" : "light"} pageBg={t.pageBg} textColor={t.text}>
      {/* ═══ HERO — shared <Hero> component, matches Trainer Dashboard exactly ═══ */}
      <Hero borderHero={t.borderHero}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <div
              style={{ width: 6, height: 6, borderRadius: "50%", background: ACCENT_PURPLE.base }}
              className="d1"
            />
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
              Assessment Center
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
            Assessments Overview
          </h1>
          <p
            style={{
              fontSize: FONT_SIZE.bodySmall,
              color: t.textSub,
              margin: 0,
              fontWeight: FONT_WEIGHT.medium,
              fontFamily: FONT_FAMILY,
              letterSpacing: LETTER_SPACING.base,
            }}
          >
            Manage quizzes and assignments across all your batches
          </p>
        </div>
      </Hero>

      {/* ═══ STAT CARDS — shared <StatCard>, laid out via the shared
          .stat-grid (same class the Trainer Dashboard uses), fully
          responsive at every breakpoint down to 380px. ═══ */}
      <div className="stat-grid" style={{ marginBottom: 20 }}>
        {stats.map((s, i) => (
          <StatCard key={i} stat={s} index={i} loading={false} />
        ))}
      </div>

      {/* ═══ UPCOMING ASSESSMENTS PANEL ═══ */}
      <div style={{ ...card, marginBottom: 14 }} className="dfade">
        <PanelHeader
          icon={Calendar}
          color={ACCENT_PURPLE.base}
          title="Upcoming Assessments"
          sub="Quizzes & assignments scheduled soon"
          t={t}
        >
          <button style={filledBtn} onClick={() => navigate("/trainer/create-quiz")}>
            <Plus size={12} /> Quiz
          </button>
          <button style={outlineBtn} onClick={() => navigate("/trainer/create-assignments")}>
            <Plus size={12} /> Assignment
          </button>
        </PanelHeader>

        {upcoming.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            color={ACCENT_PURPLE.base}
            title="No Upcoming Assessments"
            text="Get started by creating your first quiz or assignment to track student progress effectively."
            t={t}
          >
            <button style={filledBtn} onClick={() => navigate("/trainer/create-quiz")}>
              <Plus size={13} /> Create Quiz
            </button>
            <button style={outlineBtn} onClick={() => navigate("/trainer/create-assignments")}>
              <Plus size={13} /> Create Assignment
            </button>
          </EmptyState>
        ) : (
          <div style={{ padding: "16px 24px", display: "flex", flexDirection: "column", gap: 8 }}>
            {upcoming.map((item) => (
              <div
                key={item.id}
                style={{ borderRadius: 13, border: `1px solid ${t.border}`, padding: 16, background: t.pageBg }}
              />
            ))}
          </div>
        )}
      </div>

      {/* ═══ RECENT ASSESSMENTS PANEL ═══ */}
      <div style={{ ...card, marginBottom: 14 }} className="dfade">
        <PanelHeader
          icon={BarChart3}
          color="#22d3ee"
          title="Recent Assessments"
          sub="Completed assessments & performance analytics"
          t={t}
        >
          {recentAssessments.length > 0 && (
            <button style={outlineBtn}>
              <Download size={12} /> Export
            </button>
          )}
        </PanelHeader>

        {recentAssessments.length === 0 ? (
          <EmptyState
            icon={BarChart3}
            color="#22d3ee"
            title="No Completed Assessments Yet"
            text="Once students complete your assessments, you'll see detailed analytics and performance metrics here."
            t={t}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: FONT_SIZE.bodySmall,
                color: t.textMuted,
                fontFamily: FONT_FAMILY,
                letterSpacing: LETTER_SPACING.base,
              }}
            >
              <Sparkles size={13} color="#22d3ee" style={{ flexShrink: 0 }} />
              <span>Create assessments to start tracking progress</span>
            </div>
          </EmptyState>
        ) : (
          <div style={{ padding: "16px 24px", display: "flex", flexDirection: "column", gap: 8 }}>
            {recentAssessments.map((item) => (
              <div
                key={item.id}
                style={{ borderRadius: 13, border: `1px solid ${t.border}`, padding: 16, background: t.pageBg }}
              />
            ))}
          </div>
        )}
      </div>

      {/* ═══ HELP BOX — same card token set as the Trainer Dashboard's
          bottom-row cards, no page-local styling. ═══ */}
      <div style={{ ...card, padding: CARD_PADDING.standardCard, display: "flex", gap: 16 }} className="dfade">
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 13,
            background: "rgba(34,211,238,0.1)",
            border: "1px solid rgba(34,211,238,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#22d3ee",
            flexShrink: 0,
            marginTop: 2,
          }}
        >
          <AlertCircle size={20} />
        </div>
        <div>
          <h3
            style={{
              fontSize: FONT_SIZE.sectionTitle,
              fontWeight: FONT_WEIGHT.bold,
              color: t.text,
              margin: "0 0 12px",
              fontFamily: FONT_FAMILY,
              letterSpacing: LETTER_SPACING.base,
            }}
          >
            Getting Started with Assessments
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              "Create quizzes with multiple choice, true/false, and short answer questions",
              "Set up assignments for practical tasks with file uploads and deadlines",
              "Track student submissions and provide detailed feedback",
              "View analytics and performance metrics to identify support areas",
            ].map((tip, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 8,
                  fontSize: FONT_SIZE.bodySmall,
                  color: t.textMuted,
                  fontFamily: FONT_FAMILY,
                  letterSpacing: LETTER_SPACING.base,
                  lineHeight: LINE_HEIGHT.body,
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22d3ee", flexShrink: 0, marginTop: 4 }} />
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Assessments;