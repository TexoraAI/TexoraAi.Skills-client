// import React, { useState } from "react";
// import {
//   ArrowDown,
//   ArrowLeft,
//   ArrowUp,
//   Building2,
//   Mail,
//   Palette,
//   Phone,
//   Pencil,
//   Plus,
//   Timer,
//   Trash2,
//   TrendingUp,
//   Users,
//   X,
// } from "lucide-react";

// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// /* ── stats config ── */
// const STATS = [
//   {
//     label: "Active Users",
//     value: 0,
//     trend: "up",
//     change: "0%",
//     icon: Users,
//     grad: "from-cyan-500 to-blue-600",
//     bg: "bg-cyan-50 dark:bg-cyan-950/40",
//     text: "text-cyan-600 dark:text-cyan-400",
//   },
//   {
//     label: "Monthly Growth",
//     value: "0%",
//     trend: "down",
//     change: "0%",
//     icon: TrendingUp,
//     grad: "from-indigo-500 to-violet-600",
//     bg: "bg-indigo-50 dark:bg-indigo-950/40",
//     text: "text-indigo-600 dark:text-indigo-400",
//   },
//   {
//     label: "Support Emails",
//     value: 0,
//     trend: "up",
//     change: "0",
//     icon: Mail,
//     grad: "from-blue-500 to-cyan-600",
//     bg: "bg-blue-50 dark:bg-blue-950/40",
//     text: "text-blue-600 dark:text-blue-400",
//   },
// ];

// /* ================= MAIN ================= */
// const OrgSettings = () => {
//   const [mode, setMode] = useState("view");
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     timezone: "IST",
//     primaryColor: "#4F46E5",
//   });

//   const onChange = (e) =>
//     setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

//   const modeBadge = {
//     view:   { label: "View Mode",   cls: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700" },
//     create: { label: "Create Mode", cls: "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800" },
//     edit:   { label: "Edit Mode",   cls: "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800" },
//   }[mode];

//   return (
//     <div className="min-h-screen bg-[#f0f4ff] dark:bg-[#060b18] p-5 space-y-5">

//       {/* ═══════ HERO ═══════ */}
//       <div className="relative overflow-hidden rounded-2xl shadow-xl
//         bg-gradient-to-r from-[#1a56db] via-[#3b82f6] to-[#06b6d4]">
//         <div className="pointer-events-none absolute -right-12 -top-12 h-52 w-52 rounded-full bg-white/10 blur-3xl" />
//         <div className="pointer-events-none absolute right-32 bottom-[-30px] h-36 w-36 rounded-full bg-cyan-300/20 blur-2xl" />
//         <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 bg-gradient-to-r from-transparent via-white/30 to-transparent" />

//         <div className="relative flex items-center justify-between px-6 py-5">
//           <div className="flex items-center gap-4">
//             <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
//               <Building2 className="h-5 w-5 text-white" />
//             </div>
//             <div>
//               <h1 className="text-2xl font-bold tracking-tight text-white">
//                 Organisation Settings
//               </h1>
//               <p className="mt-0.5 text-sm text-blue-100/80">
//                 Manage branding, configuration &amp; organisation health
//               </p>
//             </div>
//           </div>

//           {/* mode badge */}
//           <span className={`hidden md:inline-flex items-center rounded-xl border px-3 py-1.5
//             text-xs font-semibold backdrop-blur-sm ${modeBadge.cls}`}>
//             {modeBadge.label}
//           </span>
//         </div>
//       </div>

//       {/* ═══════ STATS ═══════ */}
//       <div className="grid gap-4 md:grid-cols-3">
//         {STATS.map((s) => {
//           const Icon  = s.icon;
//           const Trend = s.trend === "up" ? ArrowUp : ArrowDown;
//           return (
//             <div
//               key={s.label}
//               className="relative overflow-hidden rounded-2xl border border-slate-200
//                 dark:border-slate-800 bg-white dark:bg-slate-900 shadow p-5"
//             >
//               {/* faint bg blob */}
//               <div className={`pointer-events-none absolute -right-4 -top-4 h-24 w-24
//                 rounded-full bg-gradient-to-br ${s.grad} opacity-10 blur-2xl`} />

//               <div className="relative flex items-start justify-between">
//                 <div>
//                   <p className="text-[11px] uppercase tracking-widest font-semibold text-slate-500 dark:text-slate-400">
//                     {s.label}
//                   </p>
//                   <p className="mt-2 text-3xl font-bold text-slate-800 dark:text-slate-100">
//                     {s.value}
//                   </p>
//                   <div className={`mt-1.5 flex items-center gap-1 text-xs font-medium ${
//                     s.trend === "up" ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"
//                   }`}>
//                     <Trend className="h-3 w-3" />
//                     {s.change}
//                   </div>
//                 </div>

//                 <div className={`h-11 w-11 rounded-xl ${s.bg} flex items-center justify-center`}>
//                   <Icon className={`h-5 w-5 ${s.text}`} />
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* ═══════ ACTIONS ═══════ */}
//       <div className="flex flex-wrap justify-end gap-2">
//         {mode !== "view" && (
//           <button
//             onClick={() => setMode("view")}
//             className="flex items-center gap-1.5 rounded-xl border border-slate-200
//               dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2
//               text-sm font-medium text-slate-600 dark:text-slate-300
//               hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
//           >
//             <X className="h-4 w-4" /> Cancel
//           </button>
//         )}

//         <button
//           onClick={() => setMode("create")}
//           className="flex items-center gap-1.5 rounded-xl
//             bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2
//             text-sm font-semibold text-white shadow
//             hover:opacity-90 hover:scale-105 transition-all"
//         >
//           <Plus className="h-4 w-4" /> Create Org
//         </button>

//         <button
//           onClick={() => setMode("edit")}
//           className="flex items-center gap-1.5 rounded-xl
//             bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2
//             text-sm font-semibold text-white shadow
//             hover:opacity-90 hover:scale-105 transition-all"
//         >
//           <Pencil className="h-4 w-4" /> Edit Org
//         </button>

//         <button
//           className="flex items-center gap-1.5 rounded-xl
//             bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800
//             px-4 py-2 text-sm font-semibold text-red-600 dark:text-red-400
//             hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
//         >
//           <Trash2 className="h-4 w-4" /> Delete Org
//         </button>
//       </div>

//       {/* ═══════ FORM ═══════ */}
//       {mode !== "view" && (
//         <div className="space-y-4">

//           {/* ── BASIC INFO ── */}
//           <Card className="overflow-hidden rounded-2xl border border-slate-200
//             dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg">

//             <CardHeader className="border-b border-slate-100 dark:border-slate-800
//               bg-slate-50/60 dark:bg-slate-900/60 px-6 py-4">
//               <div className="flex items-center gap-2.5">
//                 <div className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-950/50
//                   flex items-center justify-center">
//                   <Building2 className="h-4 w-4 text-blue-500" />
//                 </div>
//                 <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-100">
//                   Organisation Details
//                 </CardTitle>
//               </div>
//             </CardHeader>

//             <CardContent className="p-6 grid gap-5 md:grid-cols-2">
//               <Field label="Organisation Name" name="name" value={formData.name} onChange={onChange} icon={Building2} placeholder="e.g. Texora AI" />
//               <Field label="Support Email"      name="email" value={formData.email} onChange={onChange} icon={Mail}      placeholder="support@company.com" />
//               <Field label="Contact Number"     name="phone" value={formData.phone} onChange={onChange} icon={Phone}     placeholder="+91 98765 43210" />

//               {/* timezone */}
//               <div className="space-y-1.5">
//                 <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
//                   <Timer className="h-3.5 w-3.5" /> Default Timezone
//                 </label>
//                 <Select
//                   value={formData.timezone}
//                   onValueChange={(v) => setFormData((p) => ({ ...p, timezone: v }))}
//                 >
//                   <SelectTrigger className="h-10 rounded-xl border-slate-200
//                     dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent className="rounded-xl border border-slate-200
//                     dark:border-slate-700 bg-white dark:bg-slate-900">
//                     {["IST", "UTC", "EST", "CET"].map((tz) => (
//                       <SelectItem key={tz} value={tz}>{tz}</SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//             </CardContent>
//           </Card>

//           {/* ── BRANDING ── */}
//           <Card className="overflow-hidden rounded-2xl border border-slate-200
//             dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg">

//             <CardHeader className="border-b border-slate-100 dark:border-slate-800
//               bg-slate-50/60 dark:bg-slate-900/60 px-6 py-4">
//               <div className="flex items-center gap-2.5">
//                 <div className="h-8 w-8 rounded-lg bg-violet-50 dark:bg-violet-950/50
//                   flex items-center justify-center">
//                   <Palette className="h-4 w-4 text-violet-500" />
//                 </div>
//                 <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-100">
//                   Branding
//                 </CardTitle>
//               </div>
//             </CardHeader>

//             <CardContent className="p-6 grid md:grid-cols-2 gap-6">

//               {/* logo preview */}
//               <div className="space-y-3">
//                 <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
//                   Logo Preview
//                 </label>
//                 <div className="flex items-center gap-4">
//                   <Avatar className="h-14 w-14 rounded-xl border-2 border-slate-200 dark:border-slate-700">
//                     <AvatarFallback className="rounded-xl text-sm font-bold
//                       bg-gradient-to-br from-blue-600 to-cyan-500 text-white">
//                       ORG
//                     </AvatarFallback>
//                   </Avatar>
//                   <div>
//                     <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
//                       Organisation Logo
//                     </p>
//                     <span className="mt-1 inline-flex items-center rounded-lg
//                       bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5
//                       text-[11px] font-medium text-slate-500 dark:text-slate-400">
//                       Upload later
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* primary colour */}
//               <div className="space-y-1.5">
//                 <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
//                   <Palette className="h-3.5 w-3.5" /> Primary Color
//                 </label>
//                 <div className="flex items-center gap-3">
//                   <input
//                     type="color"
//                     name="primaryColor"
//                     value={formData.primaryColor}
//                     onChange={onChange}
//                     className="h-10 w-14 rounded-xl border border-slate-200
//                       dark:border-slate-700 cursor-pointer bg-transparent p-0.5"
//                   />
//                   <Input
//                     name="primaryColor"
//                     value={formData.primaryColor}
//                     onChange={onChange}
//                     className="h-10 rounded-xl border-slate-200 dark:border-slate-700
//                       bg-slate-50 dark:bg-slate-800 font-mono text-sm"
//                   />
//                 </div>
//                 {/* colour preview swatch */}
//                 <div
//                   className="mt-2 h-3 w-full rounded-full opacity-80"
//                   style={{ background: formData.primaryColor }}
//                 />
//               </div>
//             </CardContent>
//           </Card>

//           {/* ── SAVE ── */}
//           <div className="flex justify-end">
//             <button
//               className="flex items-center gap-2 rounded-xl px-8 py-2.5
//                 bg-gradient-to-r from-blue-600 to-cyan-500 text-sm font-semibold text-white
//                 shadow hover:opacity-90 hover:scale-105 transition-all"
//             >
//               {mode === "create" ? (
//                 <><Plus className="h-4 w-4" /> Create Organisation</>
//               ) : (
//                 <><Pencil className="h-4 w-4" /> Save Changes</>
//               )}
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// /* ── reusable field ── */
// const Field = ({ label, icon: Icon, placeholder, ...props }) => (
//   <div className="space-y-1.5">
//     <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
//       {Icon && <Icon className="h-3.5 w-3.5" />}
//       {label}
//     </label>
//     <Input
//       {...props}
//       placeholder={placeholder}
//       className="h-10 rounded-xl border-slate-200 dark:border-slate-700
//         bg-slate-50 dark:bg-slate-800"
//     />
//   </div>
// );

// export default OrgSettings;
















import React, { useState, useEffect } from "react";
import {
  ArrowDown, ArrowUp, Building2, Mail, Palette,
  Phone, Pencil, Plus, Timer, Trash2, TrendingUp,
  Users, X, Sparkles, Activity,
} from "lucide-react";

/* ─── theme token map — same as AdminDashboard ─── */
const T = {
  dark: {
    pageBg:"#0a0a0a", cardBg:"#111111", heroBg:"#141414",
    border:"rgba(255,255,255,0.06)", borderHov:"rgba(255,255,255,0.14)", borderHero:"rgba(255,255,255,0.07)",
    text:"#ffffff", textSub:"rgba(255,255,255,0.3)", textMuted:"rgba(255,255,255,0.2)", textLabel:"rgba(255,255,255,0.22)",
    pillBg:"rgba(255,255,255,0.04)", pillBorder:"rgba(255,255,255,0.07)", pillText:"rgba(255,255,255,0.25)",
    actBg:"rgba(255,255,255,0.04)", actBorder:"rgba(255,255,255,0.07)", actIcon:"rgba(255,255,255,0.3)", actBar:"rgba(255,255,255,0.5)",
    gridLine:"rgba(255,255,255,0.5)", shadow:"0 4px 20px rgba(0,0,0,0.4)", shadowHov:"0 20px 60px rgba(0,0,0,0.6)",
    emptyBorder:"rgba(255,255,255,0.07)", emptyBg:"rgba(255,255,255,0.02)", emptyIcon:"rgba(255,255,255,0.12)",
    recentItemBg:"rgba(255,255,255,0.03)", recentItemBorder:"rgba(255,255,255,0.05)", recentItemBgHov:"rgba(255,255,255,0.06)",
    liveColor:"#34d399", liveText:"#34d399",
    inputBg:"rgba(255,255,255,0.05)", inputBorder:"rgba(255,255,255,0.1)", inputText:"#ffffff",
    skeletonBg:"rgba(255,255,255,0.07)", theadBg:"rgba(255,255,255,0.03)",
    sectionHeaderBg:"rgba(255,255,255,0.03)",
  },
  light: {
    pageBg:"#f1f5f9", cardBg:"#ffffff", heroBg:"#ffffff",
    border:"#e2e8f0", borderHov:"#cbd5e1", borderHero:"#e2e8f0",
    text:"#0f172a", textSub:"#64748b", textMuted:"#94a3b8", textLabel:"#94a3b8",
    pillBg:"#f1f5f9", pillBorder:"#e2e8f0", pillText:"#94a3b8",
    actBg:"#f8fafc", actBorder:"#e2e8f0", actIcon:"#94a3b8", actBar:"#94a3b8",
    gridLine:"rgba(0,0,0,0.12)", shadow:"0 1px 8px rgba(0,0,0,0.07)", shadowHov:"0 8px 32px rgba(0,0,0,0.10)",
    emptyBorder:"#e2e8f0", emptyBg:"#f8fafc", emptyIcon:"#cbd5e1",
    recentItemBg:"#f8fafc", recentItemBorder:"#e2e8f0", recentItemBgHov:"#f1f5f9",
    liveColor:"#16a34a", liveText:"#16a34a",
    inputBg:"#f8fafc", inputBorder:"#e2e8f0", inputText:"#0f172a",
    skeletonBg:"#e2e8f0", theadBg:"rgba(0,0,0,0.02)",
    sectionHeaderBg:"#f8fafc",
  },
};

/* ─── stat cards config ─── */
const STATS = [
  { label:"Active Users",    value:0,    trend:"up",   change:"0%", icon:Users,     color:"#22d3ee" },
  { label:"Monthly Growth",  value:"0%", trend:"down", change:"0%", icon:TrendingUp, color:"#a78bfa" },
  { label:"Support Emails",  value:0,    trend:"up",   change:"0",  icon:Mail,       color:"#34d399" },
];

/* ─── small components ─── */
function Field({ t, label, icon: Icon, name, value, onChange, placeholder, type = "text" }) {
  const inp = {
    width:"100%", padding:"8px 12px", borderRadius:9,
    border:`1px solid ${t.inputBorder}`, background:t.inputBg,
    color:t.inputText, fontSize:12, fontFamily:"'Poppins',sans-serif",
    outline:"none", boxSizing:"border-box",
  };
  return (
    <div>
      <label style={{ display:"flex", alignItems:"center", gap:5, fontSize:9, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:t.textMuted, fontFamily:"'Poppins',sans-serif", marginBottom:5 }}>
        {Icon && <Icon size={11} />}{label}
      </label>
      <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} style={inp} />
    </div>
  );
}

function SectionCard({ t, isDark, icon: Icon, iconColor, title, children }) {
  return (
    <div style={{ background:t.cardBg, border:`1px solid ${t.border}`, borderRadius:20, overflow:"hidden", boxShadow:t.shadow }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, padding:"13px 18px", borderBottom:`1px solid ${t.border}`, background:t.sectionHeaderBg }}>
        <div style={{ width:30, height:30, borderRadius:9, background:`${iconColor}14`, border:`1px solid ${iconColor}28`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          <Icon size={14} color={iconColor} />
        </div>
        <p style={{ fontSize:13, fontWeight:700, color:t.text, margin:0, fontFamily:"'Poppins',sans-serif" }}>{title}</p>
      </div>
      <div style={{ padding:"16px 18px" }}>
        {children}
      </div>
    </div>
  );
}

/* ════════════ MAIN ════════════ */
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
    obs.observe(document.documentElement, { attributes:true, attributeFilter:["class","data-theme"] });
    return () => obs.disconnect();
  }, []);
  const t = isDark ? T.dark : T.light;

  const [mode, setMode] = useState("view");
  const [formData, setFormData] = useState({
    name:"", email:"", phone:"", timezone:"IST", primaryColor:"#4F46E5",
  });
  const onChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const inp = {
    width:"100%", padding:"8px 12px", borderRadius:9,
    border:`1px solid ${t.inputBorder}`, background:t.inputBg,
    color:t.inputText, fontSize:12, fontFamily:"'Poppins',sans-serif",
    outline:"none", boxSizing:"border-box",
  };

  const modeCfg = {
    view:   { label:"View Mode",   color:"#94a3b8" },
    create: { label:"Create Mode", color:"#34d399" },
    edit:   { label:"Edit Mode",   color:"#22d3ee" },
  }[mode];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        .osfade{animation:fadeUp 0.45s ease both}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.15}}
        .d1{animation:blink 1.6s ease infinite}.d2{animation:blink 1.6s 0.3s ease infinite}.d3{animation:blink 1.6s 0.6s ease infinite}
        @keyframes pulse-ring{0%{box-shadow:0 0 0 0 rgba(52,211,153,0.5)}70%{box-shadow:0 0 0 8px rgba(52,211,153,0)}100%{box-shadow:0 0 0 0 rgba(52,211,153,0)}}
        .livebadge{animation:pulse-ring 2.2s ease-out infinite}
        .os-stat:hover{box-shadow:0 8px 32px rgba(34,211,238,0.1) !important;transform:translateY(-2px)}
        .os-stat{transition:all 0.2s}
        input:focus,select:focus{border-color:#22d3ee !important;box-shadow:0 0 0 3px rgba(34,211,238,0.1)}
      `}</style>

      <div style={{ minHeight:"100vh", background:t.pageBg, color:t.text, fontFamily:"'Poppins',sans-serif", transition:"background 0.3s,color 0.3s" }}>
        <div style={{ maxWidth:1300, margin:"0 auto", padding:24, paddingBottom:52 }}>

          {/* ═══ HERO ═══ */}
          <div className="osfade" style={{
            borderRadius:24, padding:"28px 32px", background:t.heroBg,
            border:`1px solid ${t.borderHero}`, position:"relative", overflow:"hidden",
            marginBottom:18, boxShadow:t.shadow,
          }}>
            <div style={{ position:"absolute", inset:0, pointerEvents:"none", opacity:isDark?0.04:0.025, backgroundImage:`linear-gradient(${t.gridLine} 1px,transparent 1px),linear-gradient(90deg,${t.gridLine} 1px,transparent 1px)`, backgroundSize:"40px 40px" }} />
            <div style={{ position:"absolute", top:"-30%", left:"40%", width:300, height:200, background:"radial-gradient(ellipse,rgba(34,211,238,0.06),transparent 70%)", pointerEvents:"none" }} />
            <div style={{ position:"absolute", bottom:"-40%", right:"10%", width:250, height:200, background:"radial-gradient(ellipse,rgba(167,139,250,0.06),transparent 70%)", pointerEvents:"none" }} />

            <div style={{ position:"relative", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                  <Sparkles size={11} color={t.textSub} />
                  <span style={{ fontSize:9, fontWeight:700, letterSpacing:"0.22em", textTransform:"uppercase", color:t.textSub, fontFamily:"'Poppins',sans-serif" }}>Admin Portal</span>
                </div>
                <h1 style={{ fontFamily:"'Poppins',sans-serif", fontWeight:900, fontSize:"clamp(1.6rem,3vw,2.2rem)", color:t.text, margin:0, lineHeight:1.1, letterSpacing:"-0.02em" }}>Organisation Settings</h1>
                <p style={{ fontSize:12, color:t.textSub, marginTop:6, fontWeight:500 }}>Manage branding, configuration &amp; organisation health</p>
              </div>

              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                {/* mode badge */}
                <span style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"6px 14px", borderRadius:999, background:`${modeCfg.color}14`, border:`1px solid ${modeCfg.color}33`, color:modeCfg.color, fontSize:10, fontWeight:700, letterSpacing:"0.06em", fontFamily:"'Poppins',sans-serif" }}>
                  <span style={{ width:6, height:6, borderRadius:"50%", background:modeCfg.color, display:"inline-block" }} />
                  {modeCfg.label}
                </span>

                {/* activity bars */}
                <div style={{ display:"flex", alignItems:"center", gap:8, background:t.actBg, border:`1px solid ${t.actBorder}`, borderRadius:10, padding:"8px 12px" }}>
                  <Activity size={12} color={t.actIcon} />
                  <div style={{ display:"flex", gap:3, alignItems:"flex-end", height:14 }}>
                    <span className="d1" style={{ width:3, height:10, borderRadius:2, background:t.actBar, display:"block" }} />
                    <span className="d2" style={{ width:3, height:14, borderRadius:2, background:t.actBar, display:"block" }} />
                    <span className="d3" style={{ width:3, height:7, borderRadius:2, background:t.actBar, display:"block" }} />
                  </div>
                </div>

                <div className="livebadge" style={{ display:"flex", alignItems:"center", gap:7, background:isDark?"rgba(52,211,153,0.08)":"rgba(22,163,74,0.08)", border:isDark?"1px solid rgba(52,211,153,0.3)":"1px solid rgba(22,163,74,0.3)", borderRadius:999, padding:"8px 16px", color:t.liveText, fontSize:11, fontWeight:700, letterSpacing:"0.1em", fontFamily:"'Poppins',sans-serif" }}>
                  <span style={{ width:6, height:6, borderRadius:"50%", background:t.liveColor, display:"inline-block" }} /> LIVE
                </div>
              </div>
            </div>
          </div>

          {/* ═══ STATS ═══ */}
          <div className="osfade" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:14, marginBottom:18 }}>
            {STATS.map((s, i) => {
              const Icon = s.icon;
              const Trend = s.trend === "up" ? ArrowUp : ArrowDown;
              return (
                <div key={i} className="os-stat" style={{ background:t.cardBg, border:`1px solid ${t.border}`, borderRadius:20, padding:"18px 20px", boxShadow:t.shadow, position:"relative", overflow:"hidden" }}>
                  <div style={{ position:"absolute", top:-16, right:-16, width:70, height:70, borderRadius:"50%", background:s.color, filter:"blur(30px)", opacity:0.08, pointerEvents:"none" }} />
                  <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", position:"relative" }}>
                    <div>
                      <p style={{ fontSize:9, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:t.textMuted, margin:0, fontFamily:"'Poppins',sans-serif" }}>{s.label}</p>
                      <p style={{ fontSize:32, fontWeight:800, color:t.text, margin:"8px 0 0", fontFamily:"'Poppins',sans-serif", lineHeight:1 }}>{s.value}</p>
                      <div style={{ display:"flex", alignItems:"center", gap:4, marginTop:5, fontSize:10, fontWeight:600, color:s.trend==="up"?(isDark?"#34d399":"#16a34a"):"#f87171", fontFamily:"'Poppins',sans-serif" }}>
                        <Trend size={11} />{s.change}
                      </div>
                    </div>
                    <div style={{ width:38, height:38, borderRadius:11, background:`${s.color}14`, border:`1px solid ${s.color}28`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <Icon size={17} color={s.color} />
                    </div>
                  </div>
                  <div style={{ marginTop:12, height:2, background:t.border, borderRadius:99, overflow:"hidden" }}>
                    <div style={{ height:"100%", width:"20%", background:s.color, borderRadius:99, opacity:0.7 }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* ═══ ACTION BUTTONS ═══ */}
          <div className="osfade" style={{ display:"flex", justifyContent:"flex-end", gap:8, flexWrap:"wrap", marginBottom:18 }}>
            {mode !== "view" && (
              <button onClick={() => setMode("view")} style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 16px", borderRadius:10, border:`1px solid ${t.border}`, background:t.actBg, color:t.textSub, fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"'Poppins',sans-serif" }}>
                <X size={13} /> Cancel
              </button>
            )}
            <button onClick={() => setMode("create")} style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 16px", borderRadius:10, background:"linear-gradient(135deg,#34d399,#059669)", border:"none", color:"#fff", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"'Poppins',sans-serif", boxShadow:"0 4px 14px rgba(52,211,153,0.3)" }}>
              <Plus size={13} /> Create Org
            </button>
            <button onClick={() => setMode("edit")} style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 16px", borderRadius:10, background:"linear-gradient(135deg,#3b82f6,#22d3ee)", border:"none", color:"#fff", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"'Poppins',sans-serif", boxShadow:"0 4px 14px rgba(34,211,238,0.3)" }}>
              <Pencil size={13} /> Edit Org
            </button>
            <button style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 16px", borderRadius:10, background:"rgba(248,113,113,0.08)", border:"1px solid rgba(248,113,113,0.25)", color:"#f87171", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"'Poppins',sans-serif" }}>
              <Trash2 size={13} /> Delete Org
            </button>
          </div>

          {/* ═══ FORM ═══ */}
          {mode !== "view" && (
            <div className="osfade" style={{ display:"flex", flexDirection:"column", gap:14 }}>

              {/* Organisation Details */}
              <SectionCard t={t} isDark={isDark} icon={Building2} iconColor="#22d3ee" title="Organisation Details">
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:12 }}>
                  <Field t={t} label="Organisation Name" name="name" value={formData.name} onChange={onChange} icon={Building2} placeholder="e.g. Texora AI" />
                  <Field t={t} label="Support Email" name="email" value={formData.email} onChange={onChange} icon={Mail} placeholder="support@company.com" />
                  <Field t={t} label="Contact Number" name="phone" value={formData.phone} onChange={onChange} icon={Phone} placeholder="+91 98765 43210" />
                  {/* Timezone */}
                  <div>
                    <label style={{ display:"flex", alignItems:"center", gap:5, fontSize:9, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:t.textMuted, fontFamily:"'Poppins',sans-serif", marginBottom:5 }}>
                      <Timer size={11} /> Default Timezone
                    </label>
                    <select
                      value={formData.timezone}
                      onChange={e => setFormData(p => ({ ...p, timezone: e.target.value }))}
                      style={{ ...inp, cursor:"pointer" }}
                    >
                      {["IST","UTC","EST","CET"].map(tz => <option key={tz} value={tz}>{tz}</option>)}
                    </select>
                  </div>
                </div>
              </SectionCard>

              {/* Branding */}
              <SectionCard t={t} isDark={isDark} icon={Palette} iconColor="#a78bfa" title="Branding">
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:16 }}>
                  {/* Logo preview */}
                  <div>
                    <label style={{ display:"block", fontSize:9, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:t.textMuted, fontFamily:"'Poppins',sans-serif", marginBottom:8 }}>Logo Preview</label>
                    <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                      <div style={{ width:48, height:48, borderRadius:12, background:"linear-gradient(135deg,#3b82f6,#22d3ee)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:800, fontSize:12, fontFamily:"'Poppins',sans-serif", flexShrink:0, border:`1px solid ${t.border}` }}>ORG</div>
                      <div>
                        <p style={{ fontSize:12, fontWeight:600, color:t.text, margin:0, fontFamily:"'Poppins',sans-serif" }}>Organisation Logo</p>
                        <span style={{ display:"inline-block", marginTop:4, fontSize:10, padding:"2px 10px", borderRadius:999, background:t.actBg, border:`1px solid ${t.border}`, color:t.textMuted, fontFamily:"'Poppins',sans-serif" }}>Upload later</span>
                      </div>
                    </div>
                  </div>

                  {/* Primary colour */}
                  <div>
                    <label style={{ display:"flex", alignItems:"center", gap:5, fontSize:9, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:t.textMuted, fontFamily:"'Poppins',sans-serif", marginBottom:8 }}>
                      <Palette size={11} /> Primary Color
                    </label>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                      <input type="color" name="primaryColor" value={formData.primaryColor} onChange={onChange} style={{ width:40, height:36, borderRadius:8, border:`1px solid ${t.border}`, cursor:"pointer", background:"transparent", padding:2, flexShrink:0 }} />
                      <input name="primaryColor" value={formData.primaryColor} onChange={onChange} style={{ ...inp, fontFamily:"monospace", flex:1 }} />
                    </div>
                    <div style={{ height:6, borderRadius:99, background:formData.primaryColor, opacity:0.8 }} />
                  </div>
                </div>
              </SectionCard>

              {/* Save */}
              <div style={{ display:"flex", justifyContent:"flex-end" }}>
                <button style={{ display:"flex", alignItems:"center", gap:7, padding:"10px 24px", borderRadius:11, background:"linear-gradient(135deg,#3b82f6,#22d3ee)", border:"none", color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"'Poppins',sans-serif", boxShadow:"0 4px 14px rgba(34,211,238,0.35)" }}>
                  {mode === "create" ? <><Plus size={14} /> Create Organisation</> : <><Pencil size={14} /> Save Changes</>}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OrgSettings;
