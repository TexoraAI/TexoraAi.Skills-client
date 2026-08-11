// import React, { useState, useEffect } from "react";
// import {
//   ArrowDown, ArrowUp, Building2, Mail, Palette,
//   Phone, Pencil, Plus, Timer, Trash2, TrendingUp,
//   Users, X, Sparkles, Activity,
// } from "lucide-react";

// /* ─── theme token map — same as AdminDashboard ─── */
// const T = {
//   dark: {
//     pageBg:"#0a0a0a", cardBg:"#111111", heroBg:"#141414",
//     border:"rgba(255,255,255,0.06)", borderHov:"rgba(255,255,255,0.14)", borderHero:"rgba(255,255,255,0.07)",
//     text:"#ffffff", textSub:"rgba(255,255,255,0.3)", textMuted:"rgba(255,255,255,0.2)", textLabel:"rgba(255,255,255,0.22)",
//     pillBg:"rgba(255,255,255,0.04)", pillBorder:"rgba(255,255,255,0.07)", pillText:"rgba(255,255,255,0.25)",
//     actBg:"rgba(255,255,255,0.04)", actBorder:"rgba(255,255,255,0.07)", actIcon:"rgba(255,255,255,0.3)", actBar:"rgba(255,255,255,0.5)",
//     gridLine:"rgba(255,255,255,0.5)", shadow:"0 4px 20px rgba(0,0,0,0.4)", shadowHov:"0 20px 60px rgba(0,0,0,0.6)",
//     emptyBorder:"rgba(255,255,255,0.07)", emptyBg:"rgba(255,255,255,0.02)", emptyIcon:"rgba(255,255,255,0.12)",
//     recentItemBg:"rgba(255,255,255,0.03)", recentItemBorder:"rgba(255,255,255,0.05)", recentItemBgHov:"rgba(255,255,255,0.06)",
//     liveColor:"#34d399", liveText:"#34d399",
//     inputBg:"rgba(255,255,255,0.05)", inputBorder:"rgba(255,255,255,0.1)", inputText:"#ffffff",
//     skeletonBg:"rgba(255,255,255,0.07)", theadBg:"rgba(255,255,255,0.03)",
//     sectionHeaderBg:"rgba(255,255,255,0.03)",
//   },
//   light: {
//     pageBg:"#f1f5f9", cardBg:"#ffffff", heroBg:"#ffffff",
//     border:"#e2e8f0", borderHov:"#cbd5e1", borderHero:"#e2e8f0",
//     text:"#0f172a", textSub:"#64748b", textMuted:"#94a3b8", textLabel:"#94a3b8",
//     pillBg:"#f1f5f9", pillBorder:"#e2e8f0", pillText:"#94a3b8",
//     actBg:"#f8fafc", actBorder:"#e2e8f0", actIcon:"#94a3b8", actBar:"#94a3b8",
//     gridLine:"rgba(0,0,0,0.12)", shadow:"0 1px 8px rgba(0,0,0,0.07)", shadowHov:"0 8px 32px rgba(0,0,0,0.10)",
//     emptyBorder:"#e2e8f0", emptyBg:"#f8fafc", emptyIcon:"#cbd5e1",
//     recentItemBg:"#f8fafc", recentItemBorder:"#e2e8f0", recentItemBgHov:"#f1f5f9",
//     liveColor:"#16a34a", liveText:"#16a34a",
//     inputBg:"#f8fafc", inputBorder:"#e2e8f0", inputText:"#0f172a",
//     skeletonBg:"#e2e8f0", theadBg:"rgba(0,0,0,0.02)",
//     sectionHeaderBg:"#f8fafc",
//   },
// };

// /* ─── stat cards config ─── */
// const STATS = [
//   { label:"Active Users",    value:0,    trend:"up",   change:"0%", icon:Users,     color:"#22d3ee" },
//   { label:"Monthly Growth",  value:"0%", trend:"down", change:"0%", icon:TrendingUp, color:"#a78bfa" },
//   { label:"Support Emails",  value:0,    trend:"up",   change:"0",  icon:Mail,       color:"#34d399" },
// ];

// /* ─── small components ─── */
// function Field({ t, label, icon: Icon, name, value, onChange, placeholder, type = "text" }) {
//   const inp = {
//     width:"100%", padding:"8px 12px", borderRadius:9,
//     border:`1px solid ${t.inputBorder}`, background:t.inputBg,
//     color:t.inputText, fontSize:12, fontFamily:"'Poppins',sans-serif",
//     outline:"none", boxSizing:"border-box",
//   };
//   return (
//     <div>
//       <label style={{ display:"flex", alignItems:"center", gap:5, fontSize:9, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:t.textMuted, fontFamily:"'Poppins',sans-serif", marginBottom:5 }}>
//         {Icon && <Icon size={11} />}{label}
//       </label>
//       <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} style={inp} />
//     </div>
//   );
// }

// function SectionCard({ t, isDark, icon: Icon, iconColor, title, children }) {
//   return (
//     <div style={{ background:t.cardBg, border:`1px solid ${t.border}`, borderRadius:20, overflow:"hidden", boxShadow:t.shadow }}>
//       <div style={{ display:"flex", alignItems:"center", gap:10, padding:"13px 18px", borderBottom:`1px solid ${t.border}`, background:t.sectionHeaderBg }}>
//         <div style={{ width:30, height:30, borderRadius:9, background:`${iconColor}14`, border:`1px solid ${iconColor}28`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
//           <Icon size={14} color={iconColor} />
//         </div>
//         <p style={{ fontSize:13, fontWeight:700, color:t.text, margin:0, fontFamily:"'Poppins',sans-serif" }}>{title}</p>
//       </div>
//       <div style={{ padding:"16px 18px" }}>
//         {children}
//       </div>
//     </div>
//   );
// }

// /* ════════════ MAIN ════════════ */
// const OrgSettings = () => {
//   const [isDark, setIsDark] = useState(
//     () => typeof document !== "undefined" && (
//       document.documentElement.classList.contains("dark") ||
//       document.documentElement.getAttribute("data-theme") === "dark"
//     )
//   );
//   useEffect(() => {
//     const obs = new MutationObserver(() =>
//       setIsDark(document.documentElement.classList.contains("dark") || document.documentElement.getAttribute("data-theme") === "dark")
//     );
//     obs.observe(document.documentElement, { attributes:true, attributeFilter:["class","data-theme"] });
//     return () => obs.disconnect();
//   }, []);
//   const t = isDark ? T.dark : T.light;

//   const [mode, setMode] = useState("view");
//   const [formData, setFormData] = useState({
//     name:"", email:"", phone:"", timezone:"IST", primaryColor:"#4F46E5",
//   });
//   const onChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

//   const inp = {
//     width:"100%", padding:"8px 12px", borderRadius:9,
//     border:`1px solid ${t.inputBorder}`, background:t.inputBg,
//     color:t.inputText, fontSize:12, fontFamily:"'Poppins',sans-serif",
//     outline:"none", boxSizing:"border-box",
//   };

//   const modeCfg = {
//     view:   { label:"View Mode",   color:"#94a3b8" },
//     create: { label:"Create Mode", color:"#34d399" },
//     edit:   { label:"Edit Mode",   color:"#22d3ee" },
//   }[mode];

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
//         @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
//         .osfade{animation:fadeUp 0.45s ease both}
//         @keyframes blink{0%,100%{opacity:1}50%{opacity:0.15}}
//         .d1{animation:blink 1.6s ease infinite}.d2{animation:blink 1.6s 0.3s ease infinite}.d3{animation:blink 1.6s 0.6s ease infinite}
//         @keyframes pulse-ring{0%{box-shadow:0 0 0 0 rgba(52,211,153,0.5)}70%{box-shadow:0 0 0 8px rgba(52,211,153,0)}100%{box-shadow:0 0 0 0 rgba(52,211,153,0)}}
//         .livebadge{animation:pulse-ring 2.2s ease-out infinite}
//         .os-stat:hover{box-shadow:0 8px 32px rgba(34,211,238,0.1) !important;transform:translateY(-2px)}
//         .os-stat{transition:all 0.2s}
//         input:focus,select:focus{border-color:#22d3ee !important;box-shadow:0 0 0 3px rgba(34,211,238,0.1)}
//       `}</style>

//       <div style={{ minHeight:"100vh", background:t.pageBg, color:t.text, fontFamily:"'Poppins',sans-serif", transition:"background 0.3s,color 0.3s" }}>
//         <div style={{ maxWidth:1300, margin:"0 auto", padding:24, paddingBottom:52 }}>

//           {/* ═══ HERO ═══ */}
//           <div className="osfade" style={{
//             borderRadius:24, padding:"28px 32px", background:t.heroBg,
//             border:`1px solid ${t.borderHero}`, position:"relative", overflow:"hidden",
//             marginBottom:18, boxShadow:t.shadow,
//           }}>
//             <div style={{ position:"absolute", inset:0, pointerEvents:"none", opacity:isDark?0.04:0.025, backgroundImage:`linear-gradient(${t.gridLine} 1px,transparent 1px),linear-gradient(90deg,${t.gridLine} 1px,transparent 1px)`, backgroundSize:"40px 40px" }} />
//             <div style={{ position:"absolute", top:"-30%", left:"40%", width:300, height:200, background:"radial-gradient(ellipse,rgba(34,211,238,0.06),transparent 70%)", pointerEvents:"none" }} />
//             <div style={{ position:"absolute", bottom:"-40%", right:"10%", width:250, height:200, background:"radial-gradient(ellipse,rgba(167,139,250,0.06),transparent 70%)", pointerEvents:"none" }} />

//             <div style={{ position:"relative", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
//               <div>
//                 <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
//                   <Sparkles size={11} color={t.textSub} />
//                   <span style={{ fontSize:9, fontWeight:700, letterSpacing:"0.22em", textTransform:"uppercase", color:t.textSub, fontFamily:"'Poppins',sans-serif" }}>Admin Portal</span>
//                 </div>
//                 <h1 style={{ fontFamily:"'Poppins',sans-serif", fontWeight:900, fontSize:"clamp(1.6rem,3vw,2.2rem)", color:t.text, margin:0, lineHeight:1.1, letterSpacing:"-0.02em" }}>Organisation Settings</h1>
//                 <p style={{ fontSize:12, color:t.textSub, marginTop:6, fontWeight:500 }}>Manage branding, configuration &amp; organisation health</p>
//               </div>

//               <div style={{ display:"flex", alignItems:"center", gap:10 }}>
//                 {/* mode badge */}
//                 <span style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"6px 14px", borderRadius:999, background:`${modeCfg.color}14`, border:`1px solid ${modeCfg.color}33`, color:modeCfg.color, fontSize:10, fontWeight:700, letterSpacing:"0.06em", fontFamily:"'Poppins',sans-serif" }}>
//                   <span style={{ width:6, height:6, borderRadius:"50%", background:modeCfg.color, display:"inline-block" }} />
//                   {modeCfg.label}
//                 </span>

//                 {/* activity bars */}
//                 <div style={{ display:"flex", alignItems:"center", gap:8, background:t.actBg, border:`1px solid ${t.actBorder}`, borderRadius:10, padding:"8px 12px" }}>
//                   <Activity size={12} color={t.actIcon} />
//                   <div style={{ display:"flex", gap:3, alignItems:"flex-end", height:14 }}>
//                     <span className="d1" style={{ width:3, height:10, borderRadius:2, background:t.actBar, display:"block" }} />
//                     <span className="d2" style={{ width:3, height:14, borderRadius:2, background:t.actBar, display:"block" }} />
//                     <span className="d3" style={{ width:3, height:7, borderRadius:2, background:t.actBar, display:"block" }} />
//                   </div>
//                 </div>

//                 <div className="livebadge" style={{ display:"flex", alignItems:"center", gap:7, background:isDark?"rgba(52,211,153,0.08)":"rgba(22,163,74,0.08)", border:isDark?"1px solid rgba(52,211,153,0.3)":"1px solid rgba(22,163,74,0.3)", borderRadius:999, padding:"8px 16px", color:t.liveText, fontSize:11, fontWeight:700, letterSpacing:"0.1em", fontFamily:"'Poppins',sans-serif" }}>
//                   <span style={{ width:6, height:6, borderRadius:"50%", background:t.liveColor, display:"inline-block" }} /> LIVE
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* ═══ STATS ═══ */}
//           <div className="osfade" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:14, marginBottom:18 }}>
//             {STATS.map((s, i) => {
//               const Icon = s.icon;
//               const Trend = s.trend === "up" ? ArrowUp : ArrowDown;
//               return (
//                 <div key={i} className="os-stat" style={{ background:t.cardBg, border:`1px solid ${t.border}`, borderRadius:20, padding:"18px 20px", boxShadow:t.shadow, position:"relative", overflow:"hidden" }}>
//                   <div style={{ position:"absolute", top:-16, right:-16, width:70, height:70, borderRadius:"50%", background:s.color, filter:"blur(30px)", opacity:0.08, pointerEvents:"none" }} />
//                   <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", position:"relative" }}>
//                     <div>
//                       <p style={{ fontSize:9, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:t.textMuted, margin:0, fontFamily:"'Poppins',sans-serif" }}>{s.label}</p>
//                       <p style={{ fontSize:32, fontWeight:800, color:t.text, margin:"8px 0 0", fontFamily:"'Poppins',sans-serif", lineHeight:1 }}>{s.value}</p>
//                       <div style={{ display:"flex", alignItems:"center", gap:4, marginTop:5, fontSize:10, fontWeight:600, color:s.trend==="up"?(isDark?"#34d399":"#16a34a"):"#f87171", fontFamily:"'Poppins',sans-serif" }}>
//                         <Trend size={11} />{s.change}
//                       </div>
//                     </div>
//                     <div style={{ width:38, height:38, borderRadius:11, background:`${s.color}14`, border:`1px solid ${s.color}28`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
//                       <Icon size={17} color={s.color} />
//                     </div>
//                   </div>
//                   <div style={{ marginTop:12, height:2, background:t.border, borderRadius:99, overflow:"hidden" }}>
//                     <div style={{ height:"100%", width:"20%", background:s.color, borderRadius:99, opacity:0.7 }} />
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           {/* ═══ ACTION BUTTONS ═══ */}
//           <div className="osfade" style={{ display:"flex", justifyContent:"flex-end", gap:8, flexWrap:"wrap", marginBottom:18 }}>
//             {mode !== "view" && (
//               <button onClick={() => setMode("view")} style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 16px", borderRadius:10, border:`1px solid ${t.border}`, background:t.actBg, color:t.textSub, fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"'Poppins',sans-serif" }}>
//                 <X size={13} /> Cancel
//               </button>
//             )}
//             <button onClick={() => setMode("create")} style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 16px", borderRadius:10, background:"linear-gradient(135deg,#34d399,#059669)", border:"none", color:"#fff", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"'Poppins',sans-serif", boxShadow:"0 4px 14px rgba(52,211,153,0.3)" }}>
//               <Plus size={13} /> Create Org
//             </button>
//             <button onClick={() => setMode("edit")} style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 16px", borderRadius:10, background:"linear-gradient(135deg,#3b82f6,#22d3ee)", border:"none", color:"#fff", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"'Poppins',sans-serif", boxShadow:"0 4px 14px rgba(34,211,238,0.3)" }}>
//               <Pencil size={13} /> Edit Org
//             </button>
//             <button style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 16px", borderRadius:10, background:"rgba(248,113,113,0.08)", border:"1px solid rgba(248,113,113,0.25)", color:"#f87171", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"'Poppins',sans-serif" }}>
//               <Trash2 size={13} /> Delete Org
//             </button>
//           </div>

//           {/* ═══ FORM ═══ */}
//           {mode !== "view" && (
//             <div className="osfade" style={{ display:"flex", flexDirection:"column", gap:14 }}>

//               {/* Organisation Details */}
//               <SectionCard t={t} isDark={isDark} icon={Building2} iconColor="#22d3ee" title="Organisation Details">
//                 <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:12 }}>
//                   <Field t={t} label="Organisation Name" name="name" value={formData.name} onChange={onChange} icon={Building2} placeholder="e.g. Texora AI" />
//                   <Field t={t} label="Support Email" name="email" value={formData.email} onChange={onChange} icon={Mail} placeholder="support@company.com" />
//                   <Field t={t} label="Contact Number" name="phone" value={formData.phone} onChange={onChange} icon={Phone} placeholder="+91 98765 43210" />
//                   {/* Timezone */}
//                   <div>
//                     <label style={{ display:"flex", alignItems:"center", gap:5, fontSize:9, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:t.textMuted, fontFamily:"'Poppins',sans-serif", marginBottom:5 }}>
//                       <Timer size={11} /> Default Timezone
//                     </label>
//                     <select
//                       value={formData.timezone}
//                       onChange={e => setFormData(p => ({ ...p, timezone: e.target.value }))}
//                       style={{ ...inp, cursor:"pointer" }}
//                     >
//                       {["IST","UTC","EST","CET"].map(tz => <option key={tz} value={tz}>{tz}</option>)}
//                     </select>
//                   </div>
//                 </div>
//               </SectionCard>

//               {/* Branding */}
//               <SectionCard t={t} isDark={isDark} icon={Palette} iconColor="#a78bfa" title="Branding">
//                 <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:16 }}>
//                   {/* Logo preview */}
//                   <div>
//                     <label style={{ display:"block", fontSize:9, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:t.textMuted, fontFamily:"'Poppins',sans-serif", marginBottom:8 }}>Logo Preview</label>
//                     <div style={{ display:"flex", alignItems:"center", gap:12 }}>
//                       <div style={{ width:48, height:48, borderRadius:12, background:"linear-gradient(135deg,#3b82f6,#22d3ee)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:800, fontSize:12, fontFamily:"'Poppins',sans-serif", flexShrink:0, border:`1px solid ${t.border}` }}>ORG</div>
//                       <div>
//                         <p style={{ fontSize:12, fontWeight:600, color:t.text, margin:0, fontFamily:"'Poppins',sans-serif" }}>Organisation Logo</p>
//                         <span style={{ display:"inline-block", marginTop:4, fontSize:10, padding:"2px 10px", borderRadius:999, background:t.actBg, border:`1px solid ${t.border}`, color:t.textMuted, fontFamily:"'Poppins',sans-serif" }}>Upload later</span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Primary colour */}
//                   <div>
//                     <label style={{ display:"flex", alignItems:"center", gap:5, fontSize:9, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:t.textMuted, fontFamily:"'Poppins',sans-serif", marginBottom:8 }}>
//                       <Palette size={11} /> Primary Color
//                     </label>
//                     <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
//                       <input type="color" name="primaryColor" value={formData.primaryColor} onChange={onChange} style={{ width:40, height:36, borderRadius:8, border:`1px solid ${t.border}`, cursor:"pointer", background:"transparent", padding:2, flexShrink:0 }} />
//                       <input name="primaryColor" value={formData.primaryColor} onChange={onChange} style={{ ...inp, fontFamily:"monospace", flex:1 }} />
//                     </div>
//                     <div style={{ height:6, borderRadius:99, background:formData.primaryColor, opacity:0.8 }} />
//                   </div>
//                 </div>
//               </SectionCard>

//               {/* Save */}
//               <div style={{ display:"flex", justifyContent:"flex-end" }}>
//                 <button style={{ display:"flex", alignItems:"center", gap:7, padding:"10px 24px", borderRadius:11, background:"linear-gradient(135deg,#3b82f6,#22d3ee)", border:"none", color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"'Poppins',sans-serif", boxShadow:"0 4px 14px rgba(34,211,238,0.35)" }}>
//                   {mode === "create" ? <><Plus size={14} /> Create Organisation</> : <><Pencil size={14} /> Save Changes</>}
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default OrgSettings;



































import React, { useState, useEffect } from "react";
import {
  ArrowDown, ArrowUp, Building2, Mail, Palette,
  Phone, Pencil, Plus, Timer, Trash2, TrendingUp,
  Users, X, Sparkles, Activity,
} from "lucide-react";

// ─── Global Design System — single source of truth for colors, type,
// spacing, radius, StatCard, PageContainer and Hero. This page must not
// redeclare tokens or components that already live there (see
// AdminDashboard.jsx, the Golden Reference, which this page now visually
// matches). The page's previous local `T` token map has been removed in
// favor of the shared tokens below (its keys already mirrored the shared
// system 1:1, so this is a drop-in swap, not a re-theme).
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

/* ─── stat cards config — same 3 stats, shaped for the shared <StatCard> ─── */
const STATS = [
  { label: "Active Users", numericValue: 0, icon: Users, colorKey: "blue", change: "0% this month", trend: "up" },
  { label: "Monthly Growth", numericValue: 0, icon: TrendingUp, colorKey: "purple", change: "0% vs last month", trend: "down" },
  { label: "Support Emails", numericValue: 0, icon: Mail, colorKey: "green", change: "0 this week", trend: "up" },
];

/* ─── page-local, token-driven components (unchanged logic) ─── */
function Field({ t, label, icon: Icon, name, value, onChange, placeholder, type = "text" }) {
  const inp = {
    width: "100%", padding: "8px 12px", borderRadius: RADIUS.chip,
    border: `1px solid ${t.inputBorder}`, background: t.inputBg,
    color: t.inputText, fontSize: 12, fontFamily: FONT_FAMILY,
    outline: "none", boxSizing: "border-box",
  };
  return (
    <div>
      <label style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 9, fontWeight: FONT_WEIGHT.bold, letterSpacing: LETTER_SPACING.eyebrow, textTransform: "uppercase", color: t.textMuted, fontFamily: FONT_FAMILY, marginBottom: 5 }}>
        {Icon && <Icon size={11} />}{label}
      </label>
      <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} style={inp} />
    </div>
  );
}

function SectionCard({ t, icon: Icon, iconColor, title, children }) {
  return (
    <div style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: RADIUS.standardCard, overflow: "hidden", boxShadow: t.shadow }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "13px 18px", borderBottom: `1px solid ${t.border}`, background: t.sectionHeaderBg ?? t.recentItemBg }}>
        <div style={{ width: 30, height: 30, borderRadius: RADIUS.chip, background: `${iconColor}14`, border: `1px solid ${iconColor}28`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon size={14} color={iconColor} />
        </div>
        <p style={{ fontSize: 13, fontWeight: FONT_WEIGHT.bold, color: t.text, margin: 0, fontFamily: FONT_FAMILY }}>{title}</p>
      </div>
      <div style={{ padding: CARD_PADDING.standardCard }}>
        {children}
      </div>
    </div>
  );
}

/* ════════════ MAIN — all state, handlers unchanged ════════════ */
const OrgSettings = () => {
  const [isDark, setIsDark] = useState(
    () => typeof document !== "undefined" && (
      document.documentElement.classList.contains("dark") ||
      document.documentElement.getAttribute("data-theme") === "dark"
    )
  );
  useEffect(() => {
    const obs = new MutationObserver(() =>
      setIsDark(document.documentElement.classList.contains("dark") || document.documentElement.getAttribute("data-theme") === "dark")
    );
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
    return () => obs.disconnect();
  }, []);
  const t = isDark ? T.dark : T.light;

  const [mode, setMode] = useState("view");
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", timezone: "IST", primaryColor: "#4F46E5",
  });
  const onChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const inp = {
    width: "100%", padding: "8px 12px", borderRadius: RADIUS.chip,
    border: `1px solid ${t.inputBorder}`, background: t.inputBg,
    color: t.inputText, fontSize: 12, fontFamily: FONT_FAMILY,
    outline: "none", boxSizing: "border-box",
  };

  const modeCfg = {
    view: { label: "View Mode", color: "#94a3b8" },
    create: { label: "Create Mode", color: "#34d399" },
    edit: { label: "Edit Mode", color: "#22d3ee" },
  }[mode];

  return (
    <PageContainer mode={isDark ? "dark" : "light"} pageBg={t.pageBg} textColor={t.text}>
      <style>{`
        @media (max-width:560px){
          .os-hero-badges{width:100%;}
        }
      `}</style>

      {/* ═══ HERO — shared <Hero> component, matches AdminDashboard exactly ═══ */}
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
              Admin Portal
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
            Organisation Settings
          </h1>
          <p style={{ fontSize: FONT_SIZE.bodySmall, color: t.textSub, margin: 0, fontWeight: FONT_WEIGHT.medium, fontFamily: FONT_FAMILY }}>
            Manage branding, configuration &amp; organisation health
          </p>
        </div>

        <div className="hero-badges os-hero-badges">
          <span
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "6px 14px", borderRadius: RADIUS.pill,
              background: `${modeCfg.color}14`, border: `1px solid ${modeCfg.color}33`,
              color: modeCfg.color, fontSize: 10, fontWeight: FONT_WEIGHT.bold,
              letterSpacing: LETTER_SPACING.eyebrow, fontFamily: FONT_FAMILY,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: modeCfg.color, display: "inline-block" }} />
            {modeCfg.label}
          </span>

          <div
            style={{
              display: "flex", alignItems: "center", gap: 7,
              background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.3)",
              borderRadius: RADIUS.pill, padding: "8px 18px", color: ACCENT_PURPLE.base,
              fontSize: 11, fontWeight: FONT_WEIGHT.bold, letterSpacing: LETTER_SPACING.eyebrowWide,
              fontFamily: FONT_FAMILY,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: ACCENT_PURPLE.base, display: "inline-block" }} />
            LIVE
          </div>
        </div>
      </Hero>

      {/* ═══ STATS — shared <StatCard> ═══ */}
      <div className="stat-grid" style={{ marginBottom: 20 }}>
        {STATS.map((s, i) => (
          <StatCard key={s.label} stat={s} index={i} loading={false} mode={isDark ? "dark" : "light"} />
        ))}
      </div>

      {/* ═══ ACTION BUTTONS ═══ */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
        {mode !== "view" && (
          <button
            onClick={() => setMode("view")}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: RADIUS.button, border: `1px solid ${t.border}`, background: t.actBg, color: t.textSub, fontSize: 11, fontWeight: FONT_WEIGHT.semibold, cursor: "pointer", fontFamily: FONT_FAMILY }}
          >
            <X size={13} /> Cancel
          </button>
        )}
        <button
          onClick={() => setMode("create")}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: RADIUS.button, background: "linear-gradient(135deg,#34d399,#059669)", border: "none", color: "#fff", fontSize: 11, fontWeight: FONT_WEIGHT.bold, cursor: "pointer", fontFamily: FONT_FAMILY, boxShadow: "0 4px 14px rgba(52,211,153,0.3)" }}
        >
          <Plus size={13} /> Create Org
        </button>
        <button
          onClick={() => setMode("edit")}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: RADIUS.button, background: "linear-gradient(135deg,#3b82f6,#22d3ee)", border: "none", color: "#fff", fontSize: 11, fontWeight: FONT_WEIGHT.bold, cursor: "pointer", fontFamily: FONT_FAMILY, boxShadow: "0 4px 14px rgba(34,211,238,0.3)" }}
        >
          <Pencil size={13} /> Edit Org
        </button>
        <button
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: RADIUS.button, background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.25)", color: "#f87171", fontSize: 11, fontWeight: FONT_WEIGHT.bold, cursor: "pointer", fontFamily: FONT_FAMILY }}
        >
          <Trash2 size={13} /> Delete Org
        </button>
      </div>

      {/* ═══ FORM ═══ */}
      {mode !== "view" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Organisation Details */}
          <SectionCard t={t} icon={Building2} iconColor="#22d3ee" title="Organisation Details">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12 }}>
              <Field t={t} label="Organisation Name" name="name" value={formData.name} onChange={onChange} icon={Building2} placeholder="e.g. Texora AI" />
              <Field t={t} label="Support Email" name="email" value={formData.email} onChange={onChange} icon={Mail} placeholder="support@company.com" />
              <Field t={t} label="Contact Number" name="phone" value={formData.phone} onChange={onChange} icon={Phone} placeholder="+91 98765 43210" />
              {/* Timezone */}
              <div>
                <label style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 9, fontWeight: FONT_WEIGHT.bold, letterSpacing: LETTER_SPACING.eyebrow, textTransform: "uppercase", color: t.textMuted, fontFamily: FONT_FAMILY, marginBottom: 5 }}>
                  <Timer size={11} /> Default Timezone
                </label>
                <select
                  value={formData.timezone}
                  onChange={e => setFormData(p => ({ ...p, timezone: e.target.value }))}
                  style={{ ...inp, cursor: "pointer" }}
                >
                  {["IST", "UTC", "EST", "CET"].map(tz => <option key={tz} value={tz}>{tz}</option>)}
                </select>
              </div>
            </div>
          </SectionCard>

          {/* Branding */}
          <SectionCard t={t} icon={Palette} iconColor="#a78bfa" title="Branding">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16 }}>
              {/* Logo preview */}
              <div>
                <label style={{ display: "block", fontSize: 9, fontWeight: FONT_WEIGHT.bold, letterSpacing: LETTER_SPACING.eyebrow, textTransform: "uppercase", color: t.textMuted, fontFamily: FONT_FAMILY, marginBottom: 8 }}>Logo Preview</label>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 48, height: 48, borderRadius: RADIUS.chip, background: "linear-gradient(135deg,#3b82f6,#22d3ee)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: FONT_WEIGHT.bold, fontSize: 12, fontFamily: FONT_FAMILY, flexShrink: 0, border: `1px solid ${t.border}` }}>ORG</div>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: FONT_WEIGHT.semibold, color: t.text, margin: 0, fontFamily: FONT_FAMILY }}>Organisation Logo</p>
                    <span style={{ display: "inline-block", marginTop: 4, fontSize: 10, padding: "2px 10px", borderRadius: RADIUS.pill, background: t.actBg, border: `1px solid ${t.border}`, color: t.textMuted, fontFamily: FONT_FAMILY }}>Upload later</span>
                  </div>
                </div>
              </div>

              {/* Primary colour */}
              <div>
                <label style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 9, fontWeight: FONT_WEIGHT.bold, letterSpacing: LETTER_SPACING.eyebrow, textTransform: "uppercase", color: t.textMuted, fontFamily: FONT_FAMILY, marginBottom: 8 }}>
                  <Palette size={11} /> Primary Color
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <input type="color" name="primaryColor" value={formData.primaryColor} onChange={onChange} style={{ width: 40, height: 36, borderRadius: RADIUS.chip, border: `1px solid ${t.border}`, cursor: "pointer", background: "transparent", padding: 2, flexShrink: 0 }} />
                  <input name="primaryColor" value={formData.primaryColor} onChange={onChange} style={{ ...inp, fontFamily: "monospace", flex: 1 }} />
                </div>
                <div style={{ height: 6, borderRadius: 99, background: formData.primaryColor, opacity: 0.8 }} />
              </div>
            </div>
          </SectionCard>

          {/* Save */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 24px", borderRadius: RADIUS.button, background: "linear-gradient(135deg,#3b82f6,#22d3ee)", border: "none", color: "#fff", fontSize: 12, fontWeight: FONT_WEIGHT.bold, cursor: "pointer", fontFamily: FONT_FAMILY, boxShadow: "0 4px 14px rgba(34,211,238,0.35)" }}>
              {mode === "create" ? <><Plus size={14} /> Create Organisation</> : <><Pencil size={14} /> Save Changes</>}
            </button>
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default OrgSettings;