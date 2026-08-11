
// // ─────────────────────────────────────────────
// // UsageAnalytics.jsx
// // ─────────────────────────────────────────────
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Activity, ArrowLeft, ArrowUp, BarChart3, Clock, Lightbulb, TrendingUp, Users, Zap } from "lucide-react";

// const UA_STYLES = `
// @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
// :root{--bg:#f1f5f9;--card:#ffffff;--tx:#0f172a;--mu:#64748b;--bd:#e2e8f0;--c1:#22d3ee;--c2:#fb923c;--c3:#34d399;--c4:#a78bfa;--sh:0 4px 24px rgba(0,0,0,0.06);--shl:0 8px 40px rgba(0,0,0,0.10);--r:20px;}
// .ua-dk{--bg:#0a0a0a;--card:#111111;--tx:#ffffff;--mu:#94a3b8;--bd:rgba(255,255,255,0.06);--sh:0 4px 24px rgba(0,0,0,0.40);--shl:0 8px 40px rgba(0,0,0,0.60);}
// .ua{font-family:'Poppins',sans-serif;min-height:100vh;background:var(--bg);color:var(--tx);padding:24px;box-sizing:border-box;}
// .ua-in{max-width:1200px;margin:0 auto;display:flex;flex-direction:column;gap:20px;}
// .ua-hdr{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);padding:24px 28px;box-shadow:var(--sh);display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;}
// .ua-hdr-l{display:flex;align-items:center;gap:14px;}
// .ua-back{display:inline-flex;align-items:center;gap:6px;padding:9px 14px;border-radius:12px;border:1px solid var(--bd);background:var(--bg);color:var(--mu);font-family:'Poppins',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:border-color .2s,color .2s;flex-shrink:0;}
// .ua-back:hover{border-color:rgba(34,211,238,.35);color:var(--c1);}
// .ua-hdr-ico{width:52px;height:52px;border-radius:14px;background:rgba(34,211,238,.10);border:1px solid rgba(34,211,238,.18);display:flex;align-items:center;justify-content:center;color:var(--c1);flex-shrink:0;}
// .ua-bdg{display:inline-flex;align-items:center;gap:6px;padding:4px 11px;border-radius:50px;border:1px solid var(--bd);background:rgba(34,211,238,.08);color:var(--c1);font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;margin-bottom:6px;}
// .ua-h1{font-size:22px;font-weight:800;color:var(--tx);margin:0 0 2px;}
// .ua-sub{font-size:13px;color:var(--mu);margin:0;}
// .ua-live-chip{display:flex;align-items:center;gap:7px;padding:10px 18px;border-radius:13px;background:var(--bg);border:1px solid var(--bd);font-size:13px;font-weight:700;white-space:nowrap;box-shadow:var(--sh);}
// .ua-stats{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:14px;}
// .ua-stat{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);padding:20px 22px;box-shadow:var(--sh);display:flex;align-items:center;gap:14px;position:relative;overflow:hidden;transition:transform .2s,box-shadow .2s;}
// .ua-stat:hover{transform:translateY(-2px);box-shadow:var(--shl);}
// .ua-stat-ico{width:44px;height:44px;border-radius:13px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
// .ua-stat-val{font-size:22px;font-weight:800;color:var(--tx);margin-bottom:3px;line-height:1;}
// .ua-stat-lbl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--mu);}
// .ua-stat-trend{font-size:11px;font-weight:600;display:flex;align-items:center;gap:3px;margin-top:4px;color:var(--c3);}
// .ua-card{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);box-shadow:var(--sh);overflow:hidden;}
// .ua-ch{display:flex;align-items:center;justify-content:space-between;padding:14px 22px;border-bottom:1px solid var(--bd);background:var(--bg);}
// .ua-ch-l{display:flex;align-items:center;gap:10px;}
// .ua-ch-ico{width:34px;height:34px;border-radius:10px;display:flex;align-items:center;justify-content:center;}
// .ua-ch-title{font-size:13px;font-weight:700;color:var(--tx);}
// .ua-sel{padding:8px 12px;border-radius:11px;border:1px solid var(--bd);background:var(--card);color:var(--tx);font-family:'Poppins',sans-serif;font-size:12px;outline:none;cursor:pointer;}
// .ua-sel:focus{border-color:var(--c1);}
// .ua-cb{padding:20px 22px;}
// .ua-bar-row{display:flex;flex-direction:column;gap:4px;margin-bottom:14px;}
// .ua-bar-label-row{display:flex;justify-content:space-between;font-size:12px;}
// .ua-bar-label{font-weight:600;color:var(--tx);}
// .ua-bar-pct{color:var(--mu);}
// .ua-bar-track{height:8px;border-radius:99px;background:var(--bd);overflow:hidden;}
// .ua-bar-fill{height:100%;border-radius:99px;transition:width .7s;}
// .ua-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 20px;gap:10px;text-align:center;border-top:1px solid var(--bd);}
// .ua-empty-ico{width:48px;height:48px;border-radius:14px;background:rgba(34,211,238,.08);border:1px solid rgba(34,211,238,.15);display:flex;align-items:center;justify-content:center;color:var(--c1);}
// .ua-empty-t{font-size:13px;font-weight:700;color:var(--mu);margin:0 0 3px;}
// .ua-empty-s{font-size:12px;color:var(--mu);margin:0;}
// .ua-insights{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px;}
// .ua-insight{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);padding:20px;box-shadow:var(--sh);}
// .ua-insight-ico{width:38px;height:38px;border-radius:12px;display:flex;align-items:center;justify-content:center;margin-bottom:12px;}
// .ua-insight-title{font-size:13px;font-weight:800;color:var(--tx);margin:0 0 6px;}
// .ua-insight-desc{font-size:12px;color:var(--mu);margin:0;line-height:1.6;}
// `;
// if(!document.getElementById("ua-st")){const t=document.createElement("style");t.id="ua-st";t.textContent=UA_STYLES;document.head.appendChild(t);}
// const isDark=()=>document.documentElement.classList.contains("dark")||document.body.classList.contains("dark")||window.matchMedia("(prefers-color-scheme: dark)").matches;

// const STATS=[
//   {label:"Daily Active Users",value:"0",sub:"+0% vs yesterday",icon:Users,accent:"var(--c1)",bg:"rgba(34,211,238,.10)",trend:true},
//   {label:"Avg. Session Length",value:"0 min",sub:"Last 7 days",icon:Clock,accent:"var(--c4)",bg:"rgba(167,139,250,.10)",trend:false},
//   {label:"Peak Concurrent Users",value:"0",sub:"Today",icon:Activity,accent:"var(--c3)",bg:"rgba(52,211,153,.10)",trend:false},
// ];
// const INSIGHTS=[
//   {icon:Users,label:"User Engagement",desc:"Track how often different roles interact with the platform daily.",accent:"var(--c1)",bg:"rgba(34,211,238,.10)"},
//   {icon:Clock,label:"Peak Hours",desc:"Identify when your platform is most active to plan resources.",accent:"var(--c4)",bg:"rgba(167,139,250,.10)"},
//   {icon:TrendingUp,label:"Activity Trends",desc:"Monitor growth and engagement patterns over time.",accent:"var(--c3)",bg:"rgba(52,211,153,.10)"},
// ];
// const BARS=[{role:"Students",pct:0,color:"var(--c1)"},{role:"Trainers",pct:0,color:"var(--c4)"},{role:"Admins",pct:0,color:"var(--c2)"}];

// const UsageAnalytics=()=>{
//   const navigate=useNavigate();
//   const[dark,setDark]=useState(isDark);
//   const[period,setPeriod]=useState("7");
//   React.useEffect(()=>{const o=new MutationObserver(()=>setDark(isDark()));o.observe(document.documentElement,{attributes:true,attributeFilter:["class"]});o.observe(document.body,{attributes:true,attributeFilter:["class"]});return()=>o.disconnect();},[]);
//   return(
//     <div className={`ua${dark?" ua-dk":""}`}>
//       <div className="ua-in">
//         <div className="ua-hdr">
//           <div className="ua-hdr-l">
//             <button className="ua-back" onClick={()=>navigate(-1)}><ArrowLeft size={14}/> Back</button>
//             <div className="ua-hdr-ico"><BarChart3 size={24}/></div>
//             <div>
//               <div className="ua-bdg"><BarChart3 size={10}/> Analytics</div>
//               <h1 className="ua-h1">Usage Analytics</h1>
//               <p className="ua-sub">Track platform usage across users, roles and time periods</p>
//             </div>
//           </div>
//           <div className="ua-live-chip"><Zap size={14} style={{color:"var(--c1)"}}/><span style={{fontWeight:800,color:"var(--c1)"}}>Live</span><span style={{color:"var(--mu)",fontWeight:500}}>Dashboard</span></div>
//         </div>

//         <div className="ua-stats">
//           {STATS.map(s=>{const Icon=s.icon;return(
//             <div key={s.label} className="ua-stat">
//               <div className="ua-stat-ico" style={{background:s.bg,color:s.accent}}><Icon size={20}/></div>
//               <div>
//                 <div className="ua-stat-val">{s.value}</div>
//                 <div className="ua-stat-lbl">{s.label}</div>
//                 {s.trend&&<div className="ua-stat-trend"><ArrowUp size={11}/>{s.sub}</div>}
//                 {!s.trend&&<div style={{fontSize:11,color:"var(--mu)",marginTop:3}}>{s.sub}</div>}
//               </div>
//             </div>
//           );})}
//         </div>

//         <div className="ua-card">
//           <div className="ua-ch">
//             <div className="ua-ch-l">
//               <div className="ua-ch-ico" style={{background:"rgba(167,139,250,.10)",color:"var(--c4)"}}><BarChart3 size={16}/></div>
//               <span className="ua-ch-title">Role-wise Usage</span>
//             </div>
//             <select className="ua-sel" value={period} onChange={e=>setPeriod(e.target.value)}>
//               <option value="7">Last 7 days</option><option value="30">Last 30 days</option>
//             </select>
//           </div>
//           <div className="ua-cb">
//             {BARS.map(b=>(
//               <div key={b.role} className="ua-bar-row">
//                 <div className="ua-bar-label-row"><span className="ua-bar-label">{b.role}</span><span className="ua-bar-pct">{b.pct}%</span></div>
//                 <div className="ua-bar-track"><div className="ua-bar-fill" style={{width:`${b.pct}%`,background:b.color}}/></div>
//               </div>
//             ))}
//           </div>
//           <div className="ua-empty">
//             <div className="ua-empty-ico"><BarChart3 size={22}/></div>
//             <p className="ua-empty-t">No analytics data yet</p>
//             <p className="ua-empty-s">Usage charts will appear once data is available</p>
//           </div>
//         </div>

//         <div className="ua-card">
//           <div className="ua-ch">
//             <div className="ua-ch-l">
//               <div className="ua-ch-ico" style={{background:"rgba(251,146,60,.10)",color:"var(--c2)"}}><Lightbulb size={16}/></div>
//               <span className="ua-ch-title">Insights</span>
//             </div>
//           </div>
//           <div style={{padding:"16px"}}>
//             <div className="ua-insights">
//               {INSIGHTS.map(({icon:Icon,label,desc,accent,bg})=>(
//                 <div key={label} className="ua-insight">
//                   <div className="ua-insight-ico" style={{background:bg,color:accent}}><Icon size={18}/></div>
//                   <p className="ua-insight-title">{label}</p>
//                   <p className="ua-insight-desc">{desc}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default UsageAnalytics;














































// ─────────────────────────────────────────────
// UsageAnalytics.jsx
// ─────────────────────────────────────────────
import React, { useState } from "react";
import { Activity, BarChart3, Clock, Lightbulb, TrendingUp, Users, Zap } from "lucide-react";

// ─── Global Design System — single source of truth for colors, type,
// spacing, radius, StatCard, PageContainer and Hero. This page must not
// redeclare tokens or components that already live there (see
// AdminDashboard.jsx, the Golden Reference, which this page now visually
// matches). The page's previous bespoke CSS-variable theme (--c1, Google
// Fonts import, injected <style> stylesheet) has been removed in favor
// of the shared tokens below.
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

const isDark = () =>
  document.documentElement.classList.contains("dark") ||
  document.documentElement.getAttribute("data-theme") === "dark";

/* ─── page-local, token-driven components ─── */
function IconBadge({ icon: Icon, color, size = 34, iconSize = 15 }) {
  return (
    <div
      style={{
        width: size, height: size, borderRadius: RADIUS.chip,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: `${color}18`, border: `1px solid ${color}30`, flexShrink: 0,
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
        background: t.cardBg, border: `1px solid ${t.border}`,
        borderRadius: RADIUS.standardCard, padding: CARD_PADDING.standardCard,
        boxShadow: t.shadow, ...style,
      }}
    >
      {children}
    </div>
  );
}

function EmptyBlock({ t, icon: Icon, title, sub }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "36px 18px", gap: 12, textAlign: "center" }}>
      <div style={{ width: 48, height: 48, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", border: `1.5px dashed ${t.emptyBorder}`, background: t.emptyBg }}>
        <Icon size={20} color={t.emptyIcon} />
      </div>
      <div>
        <p style={{ fontSize: 13, color: t.text, fontWeight: FONT_WEIGHT.bold, fontFamily: FONT_FAMILY, margin: 0 }}>{title}</p>
        {sub && <p style={{ fontSize: 11.5, color: t.textMuted, fontFamily: FONT_FAMILY, margin: "4px 0 0" }}>{sub}</p>}
      </div>
    </div>
  );
}

/* ─── data (unchanged) ─── */
const STATS = [
  { label: "Daily Active Users", numericValue: 0, icon: Users, colorKey: "blue", change: "+0% vs yesterday" },
  { label: "Avg. Session Length (min)", numericValue: 0, icon: Clock, colorKey: "purple", change: "Last 7 days" },
  { label: "Peak Concurrent Users", numericValue: 0, icon: Activity, colorKey: "green", change: "Today" },
];
const INSIGHTS = [
  { icon: Users, label: "User Engagement", desc: "Track how often different roles interact with the platform daily.", accent: "#22d3ee", bg: "rgba(34,211,238,.10)" },
  { icon: Clock, label: "Peak Hours", desc: "Identify when your platform is most active to plan resources.", accent: "#a78bfa", bg: "rgba(167,139,250,.10)" },
  { icon: TrendingUp, label: "Activity Trends", desc: "Monitor growth and engagement patterns over time.", accent: "#34d399", bg: "rgba(52,211,153,.10)" },
];
const BARS = [
  { role: "Students", pct: 0, color: "#22d3ee" },
  { role: "Trainers", pct: 0, color: "#a78bfa" },
  { role: "Admins", pct: 0, color: "#fb923c" },
];

/* ════════════ MAIN — state/handlers unchanged ════════════ */
const UsageAnalytics = () => {
  const [dark, setDark] = useState(isDark);
  const [period, setPeriod] = useState("7");

  React.useEffect(() => {
    const o = new MutationObserver(() => setDark(isDark()));
    o.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
    return () => o.disconnect();
  }, []);

  const t = dark ? T.dark : T.light;

  return (
    <PageContainer mode={dark ? "dark" : "light"} pageBg={t.pageBg} textColor={t.text}>
      <style>{`
        @media (max-width:560px){
          .ua-hero-badges{width:100%;}
        }
      `}</style>

      {/* ═══ HERO — shared <Hero> component, matches AdminDashboard exactly ═══ */}
      <Hero borderHero={t.borderHero}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: ACCENT_PURPLE.base }} />
            <span
              style={{
                fontSize: FONT_SIZE.eyebrow, fontWeight: FONT_WEIGHT.bold,
                letterSpacing: LETTER_SPACING.eyebrowWide, textTransform: "uppercase",
                color: t.textSub, fontFamily: FONT_FAMILY,
              }}
            >
              Analytics
            </span>
          </div>
          <h1
            style={{
              fontFamily: FONT_FAMILY, fontWeight: FONT_WEIGHT.heroTitle,
              fontSize: FONT_SIZE.heroTitle, color: ACCENT_PURPLE.base,
              margin: "0 0 6px", lineHeight: LINE_HEIGHT.heroTitle,
              letterSpacing: LETTER_SPACING.heroTitle,
            }}
          >
            Usage Analytics
          </h1>
          <p style={{ fontSize: FONT_SIZE.bodySmall, color: t.textSub, margin: 0, fontWeight: FONT_WEIGHT.medium, fontFamily: FONT_FAMILY }}>
            Track platform usage across users, roles and time periods
          </p>
        </div>

        <div className="hero-badges ua-hero-badges">
          <div
            style={{
              display: "flex", alignItems: "center", gap: 7,
              background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.3)",
              borderRadius: RADIUS.pill, padding: "8px 18px", color: ACCENT_PURPLE.base,
              fontSize: 11, fontWeight: FONT_WEIGHT.bold, letterSpacing: LETTER_SPACING.eyebrowWide,
              fontFamily: FONT_FAMILY,
            }}
          >
            <Zap size={13} />
            LIVE Dashboard
          </div>
        </div>
      </Hero>

      {/* ═══ STATS — shared <StatCard> ═══ */}
      <div className="stat-grid" style={{ marginBottom: 20 }}>
        {STATS.map((s, i) => (
          <StatCard key={s.label} stat={s} index={i} loading={false} mode={dark ? "dark" : "light"} />
        ))}
      </div>

      {/* ═══ ROLE-WISE USAGE ═══ */}
      <SectionCard t={t} style={{ padding: 0, overflow: "hidden", marginBottom: 14 }}>
        <div
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "14px 18px", borderBottom: `1px solid ${t.border}`, background: t.recentItemBg,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <IconBadge icon={BarChart3} color={ACCENT_PURPLE.base} size={34} iconSize={16} />
            <span style={{ fontSize: 13, fontWeight: FONT_WEIGHT.bold, color: t.text, fontFamily: FONT_FAMILY }}>Role-wise Usage</span>
          </div>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            style={{
              padding: "8px 12px", borderRadius: RADIUS.chip, border: `1px solid ${t.border}`,
              background: t.cardBg, color: t.text, fontFamily: FONT_FAMILY, fontSize: 12,
              outline: "none", cursor: "pointer",
            }}
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
          </select>
        </div>

        <div style={{ padding: 20 }}>
          {BARS.map((b) => (
            <div key={b.role} style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontFamily: FONT_FAMILY }}>
                <span style={{ fontWeight: FONT_WEIGHT.semibold, color: t.text }}>{b.role}</span>
                <span style={{ color: t.textMuted }}>{b.pct}%</span>
              </div>
              <div style={{ height: 8, borderRadius: 99, background: t.barBg, overflow: "hidden" }}>
                <div style={{ width: `${b.pct}%`, height: "100%", borderRadius: 99, background: b.color, transition: "width 0.7s" }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: `1px solid ${t.border}` }}>
          <EmptyBlock t={t} icon={BarChart3} title="No analytics data yet" sub="Usage charts will appear once data is available" />
        </div>
      </SectionCard>

      {/* ═══ INSIGHTS ═══ */}
      <SectionCard t={t} style={{ padding: 0, overflow: "hidden" }}>
        <div
          style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "14px 18px", borderBottom: `1px solid ${t.border}`, background: t.recentItemBg,
          }}
        >
          <IconBadge icon={Lightbulb} color="#fb923c" size={34} iconSize={16} />
          <span style={{ fontSize: 13, fontWeight: FONT_WEIGHT.bold, color: t.text, fontFamily: FONT_FAMILY }}>Insights</span>
        </div>
        <div style={{ padding: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 14 }}>
            {INSIGHTS.map(({ icon: Icon, label, desc, accent, bg }) => (
              <div key={label} style={{ background: t.recentItemBg, border: `1px solid ${t.recentItemBorder}`, borderRadius: RADIUS.chip, padding: 18 }}>
                <div style={{ width: 38, height: 38, borderRadius: RADIUS.chip, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12, background: bg, color: accent }}>
                  <Icon size={18} />
                </div>
                <p style={{ fontSize: 13, fontWeight: FONT_WEIGHT.bold, color: t.text, margin: "0 0 6px", fontFamily: FONT_FAMILY }}>{label}</p>
                <p style={{ fontSize: 12, color: t.textMuted, margin: 0, lineHeight: 1.6, fontFamily: FONT_FAMILY }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>
    </PageContainer>
  );
};

export default UsageAnalytics;