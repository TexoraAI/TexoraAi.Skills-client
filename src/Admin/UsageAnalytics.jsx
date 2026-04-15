// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Activity, ArrowLeft, ArrowUp, BarChart3,
//   Clock, Lightbulb, TrendingUp, Users, Zap,
// } from "lucide-react";

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// /* ── stat cards config ── */
// const STATS = [
//   {
//     label: "Daily Active Users",
//     value: "0",
//     sub:   "+0% vs yesterday",
//     icon:  Users,
//     grad:  "from-cyan-500 to-blue-600",
//     bg:    "bg-cyan-50 dark:bg-cyan-950/40",
//     text:  "text-cyan-600 dark:text-cyan-400",
//     trend: true,
//   },
//   {
//     label: "Avg. Session Length",
//     value: "0 min",
//     sub:   "Last 7 days",
//     icon:  Clock,
//     grad:  "from-violet-500 to-indigo-600",
//     bg:    "bg-violet-50 dark:bg-violet-950/40",
//     text:  "text-violet-600 dark:text-violet-400",
//     trend: false,
//   },
//   {
//     label: "Peak Concurrent Users",
//     value: "0",
//     sub:   "Today",
//     icon:  Activity,
//     grad:  "from-emerald-500 to-teal-600",
//     bg:    "bg-emerald-50 dark:bg-emerald-950/40",
//     text:  "text-emerald-600 dark:text-emerald-400",
//     trend: false,
//   },
// ];

// /* ── insight items ── */
// const INSIGHTS = [
//   { icon: Users,     grad: "from-cyan-500 to-blue-600",    title: "User Engagement",   desc: "Track how often different roles interact with the platform daily."        },
//   { icon: Clock,     grad: "from-violet-500 to-indigo-600", title: "Peak Hours",        desc: "Identify when your platform is most active to plan resources."            },
//   { icon: TrendingUp, grad: "from-emerald-500 to-teal-600", title: "Activity Trends",  desc: "Monitor growth and engagement patterns over time."                       },
// ];

// /* ================= MAIN ================= */
// const UsageAnalytics = () => {
//   const navigate = useNavigate();
//   const [period, setPeriod] = useState("7");

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
//             <button
//               onClick={() => navigate(-1)}
//               className="flex items-center gap-1.5 rounded-xl bg-white/15 px-3 py-1.5
//                 text-sm font-medium text-white backdrop-blur-sm hover:bg-white/25 transition-all"
//             >
//               <ArrowLeft className="h-4 w-4" /> Back
//             </button>
//             <div>
//               <h1 className="text-2xl font-bold tracking-tight text-white">Usage Analytics</h1>
//               <p className="mt-0.5 text-sm text-blue-100/80">
//                 Track platform usage across users, roles and time periods
//               </p>
//             </div>
//           </div>

//           <div className="hidden md:flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-2 backdrop-blur-sm">
//             <Zap className="h-4 w-4 text-cyan-200" />
//             <span className="text-sm font-semibold text-white">
//               Live
//               <span className="ml-1 font-normal text-blue-100/80">Dashboard</span>
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* ═══════ STAT CARDS ═══════ */}
//       <div className="grid gap-4 md:grid-cols-3">
//         {STATS.map((s) => {
//           const Icon = s.icon;
//           return (
//             <div
//               key={s.label}
//               className="relative overflow-hidden rounded-2xl border border-slate-200
//                 dark:border-slate-800 bg-white dark:bg-slate-900 shadow p-5"
//             >
//               {/* blob */}
//               <div className={`pointer-events-none absolute -right-4 -top-4 h-24 w-24
//                 rounded-full bg-gradient-to-br ${s.grad} opacity-10 blur-2xl`} />

//               <div className="relative flex items-start justify-between">
//                 <div>
//                   <p className="text-[11px] uppercase tracking-widest font-semibold
//                     text-slate-500 dark:text-slate-400">
//                     {s.label}
//                   </p>
//                   <p className="mt-2 text-3xl font-bold text-slate-800 dark:text-slate-100">
//                     {s.value}
//                   </p>
//                   <div className={`mt-1.5 flex items-center gap-1 text-xs font-medium
//                     ${s.trend ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}`}>
//                     {s.trend && <ArrowUp className="h-3 w-3" />}
//                     {s.sub}
//                   </div>
//                 </div>

//                 <div className={`h-11 w-11 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>
//                   <Icon className={`h-5 w-5 ${s.text}`} />
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* ═══════ ROLE-WISE USAGE CARD ═══════ */}
//       <Card className="overflow-hidden rounded-2xl border border-slate-200
//         dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg">

//         <CardHeader className="flex flex-row items-center justify-between
//           border-b border-slate-100 dark:border-slate-800
//           bg-slate-50/60 dark:bg-slate-900/60 px-6 py-4">
//           <div className="flex items-center gap-2.5">
//             <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/50
//               flex items-center justify-center">
//               <BarChart3 className="h-4 w-4 text-indigo-500" />
//             </div>
//             <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-100">
//               Role-wise Usage
//             </CardTitle>
//           </div>

//           <Select value={period} onValueChange={setPeriod}>
//             <SelectTrigger className="h-9 w-36 rounded-xl bg-white dark:bg-slate-900
//               border-slate-200 dark:border-slate-800 text-sm">
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent className="rounded-xl border border-slate-200 dark:border-slate-700
//               bg-white dark:bg-slate-900 shadow-xl z-50">
//               <SelectItem value="7">Last 7 days</SelectItem>
//               <SelectItem value="30">Last 30 days</SelectItem>
//             </SelectContent>
//           </Select>
//         </CardHeader>

//         <CardContent className="p-4">
//           {/* placeholder role bars */}
//           <div className="space-y-4 mb-6">
//             {[
//               { role: "Students",  pct: 0, color: "bg-cyan-500"   },
//               { role: "Trainers",  pct: 0, color: "bg-violet-500" },
//               { role: "Admins",    pct: 0, color: "bg-amber-500"  },
//             ].map(({ role, pct, color }) => (
//               <div key={role} className="space-y-1.5">
//                 <div className="flex items-center justify-between text-xs">
//                   <span className="font-medium text-slate-700 dark:text-slate-300">{role}</span>
//                   <span className="text-slate-400">{pct}%</span>
//                 </div>
//                 <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
//                   <div
//                     className={`h-full rounded-full ${color} transition-all duration-700`}
//                     style={{ width: `${pct}%` }}
//                   />
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* empty state */}
//           <div className="flex flex-col items-center justify-center py-8 gap-3
//             border-t border-slate-100 dark:border-slate-800">
//             <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-800
//               flex items-center justify-center">
//               <BarChart3 className="h-6 w-6 text-slate-400" />
//             </div>
//             <p className="text-sm font-medium text-slate-500">No analytics data yet</p>
//             <p className="text-xs text-slate-400">Usage charts will appear once data is available</p>
//           </div>
//         </CardContent>
//       </Card>

//       {/* ═══════ INSIGHTS CARD ═══════ */}
//       <Card className="overflow-hidden rounded-2xl border border-slate-200
//         dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg">

//         <CardHeader className="border-b border-slate-100 dark:border-slate-800
//           bg-slate-50/60 dark:bg-slate-900/60 px-6 py-4">
//           <div className="flex items-center gap-2.5">
//             <div className="h-8 w-8 rounded-lg bg-amber-50 dark:bg-amber-950/50
//               flex items-center justify-center">
//               <Lightbulb className="h-4 w-4 text-amber-500" />
//             </div>
//             <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-100">
//               Insights
//             </CardTitle>
//           </div>
//         </CardHeader>

//         <CardContent className="p-4">
//           <div className="grid gap-3 sm:grid-cols-3">
//             {INSIGHTS.map(({ icon: Icon, grad, title, desc }) => (
//               <div
//                 key={title}
//                 className="relative overflow-hidden rounded-2xl border border-slate-100
//                   dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-4"
//               >
//                 <div className={`pointer-events-none absolute -right-3 -top-3 h-16 w-16
//                   rounded-full bg-gradient-to-br ${grad} opacity-10 blur-xl`} />
//                 <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${grad}
//                   flex items-center justify-center mb-3 shadow-sm`}>
//                   <Icon className="h-4 w-4 text-white" />
//                 </div>
//                 <p className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-1">{title}</p>
//                 <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
//               </div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default UsageAnalytics;










// ─────────────────────────────────────────────
// UsageAnalytics.jsx
// ─────────────────────────────────────────────
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, ArrowLeft, ArrowUp, BarChart3, Clock, Lightbulb, TrendingUp, Users, Zap } from "lucide-react";

const UA_STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
:root{--bg:#f1f5f9;--card:#ffffff;--tx:#0f172a;--mu:#64748b;--bd:#e2e8f0;--c1:#22d3ee;--c2:#fb923c;--c3:#34d399;--c4:#a78bfa;--sh:0 4px 24px rgba(0,0,0,0.06);--shl:0 8px 40px rgba(0,0,0,0.10);--r:20px;}
.ua-dk{--bg:#0a0a0a;--card:#111111;--tx:#ffffff;--mu:#94a3b8;--bd:rgba(255,255,255,0.06);--sh:0 4px 24px rgba(0,0,0,0.40);--shl:0 8px 40px rgba(0,0,0,0.60);}
.ua{font-family:'Poppins',sans-serif;min-height:100vh;background:var(--bg);color:var(--tx);padding:24px;box-sizing:border-box;}
.ua-in{max-width:1200px;margin:0 auto;display:flex;flex-direction:column;gap:20px;}
.ua-hdr{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);padding:24px 28px;box-shadow:var(--sh);display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;}
.ua-hdr-l{display:flex;align-items:center;gap:14px;}
.ua-back{display:inline-flex;align-items:center;gap:6px;padding:9px 14px;border-radius:12px;border:1px solid var(--bd);background:var(--bg);color:var(--mu);font-family:'Poppins',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:border-color .2s,color .2s;flex-shrink:0;}
.ua-back:hover{border-color:rgba(34,211,238,.35);color:var(--c1);}
.ua-hdr-ico{width:52px;height:52px;border-radius:14px;background:rgba(34,211,238,.10);border:1px solid rgba(34,211,238,.18);display:flex;align-items:center;justify-content:center;color:var(--c1);flex-shrink:0;}
.ua-bdg{display:inline-flex;align-items:center;gap:6px;padding:4px 11px;border-radius:50px;border:1px solid var(--bd);background:rgba(34,211,238,.08);color:var(--c1);font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;margin-bottom:6px;}
.ua-h1{font-size:22px;font-weight:800;color:var(--tx);margin:0 0 2px;}
.ua-sub{font-size:13px;color:var(--mu);margin:0;}
.ua-live-chip{display:flex;align-items:center;gap:7px;padding:10px 18px;border-radius:13px;background:var(--bg);border:1px solid var(--bd);font-size:13px;font-weight:700;white-space:nowrap;box-shadow:var(--sh);}
.ua-stats{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:14px;}
.ua-stat{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);padding:20px 22px;box-shadow:var(--sh);display:flex;align-items:center;gap:14px;position:relative;overflow:hidden;transition:transform .2s,box-shadow .2s;}
.ua-stat:hover{transform:translateY(-2px);box-shadow:var(--shl);}
.ua-stat-ico{width:44px;height:44px;border-radius:13px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.ua-stat-val{font-size:22px;font-weight:800;color:var(--tx);margin-bottom:3px;line-height:1;}
.ua-stat-lbl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--mu);}
.ua-stat-trend{font-size:11px;font-weight:600;display:flex;align-items:center;gap:3px;margin-top:4px;color:var(--c3);}
.ua-card{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);box-shadow:var(--sh);overflow:hidden;}
.ua-ch{display:flex;align-items:center;justify-content:space-between;padding:14px 22px;border-bottom:1px solid var(--bd);background:var(--bg);}
.ua-ch-l{display:flex;align-items:center;gap:10px;}
.ua-ch-ico{width:34px;height:34px;border-radius:10px;display:flex;align-items:center;justify-content:center;}
.ua-ch-title{font-size:13px;font-weight:700;color:var(--tx);}
.ua-sel{padding:8px 12px;border-radius:11px;border:1px solid var(--bd);background:var(--card);color:var(--tx);font-family:'Poppins',sans-serif;font-size:12px;outline:none;cursor:pointer;}
.ua-sel:focus{border-color:var(--c1);}
.ua-cb{padding:20px 22px;}
.ua-bar-row{display:flex;flex-direction:column;gap:4px;margin-bottom:14px;}
.ua-bar-label-row{display:flex;justify-content:space-between;font-size:12px;}
.ua-bar-label{font-weight:600;color:var(--tx);}
.ua-bar-pct{color:var(--mu);}
.ua-bar-track{height:8px;border-radius:99px;background:var(--bd);overflow:hidden;}
.ua-bar-fill{height:100%;border-radius:99px;transition:width .7s;}
.ua-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 20px;gap:10px;text-align:center;border-top:1px solid var(--bd);}
.ua-empty-ico{width:48px;height:48px;border-radius:14px;background:rgba(34,211,238,.08);border:1px solid rgba(34,211,238,.15);display:flex;align-items:center;justify-content:center;color:var(--c1);}
.ua-empty-t{font-size:13px;font-weight:700;color:var(--mu);margin:0 0 3px;}
.ua-empty-s{font-size:12px;color:var(--mu);margin:0;}
.ua-insights{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px;}
.ua-insight{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);padding:20px;box-shadow:var(--sh);}
.ua-insight-ico{width:38px;height:38px;border-radius:12px;display:flex;align-items:center;justify-content:center;margin-bottom:12px;}
.ua-insight-title{font-size:13px;font-weight:800;color:var(--tx);margin:0 0 6px;}
.ua-insight-desc{font-size:12px;color:var(--mu);margin:0;line-height:1.6;}
`;
if(!document.getElementById("ua-st")){const t=document.createElement("style");t.id="ua-st";t.textContent=UA_STYLES;document.head.appendChild(t);}
const isDark=()=>document.documentElement.classList.contains("dark")||document.body.classList.contains("dark")||window.matchMedia("(prefers-color-scheme: dark)").matches;

const STATS=[
  {label:"Daily Active Users",value:"0",sub:"+0% vs yesterday",icon:Users,accent:"var(--c1)",bg:"rgba(34,211,238,.10)",trend:true},
  {label:"Avg. Session Length",value:"0 min",sub:"Last 7 days",icon:Clock,accent:"var(--c4)",bg:"rgba(167,139,250,.10)",trend:false},
  {label:"Peak Concurrent Users",value:"0",sub:"Today",icon:Activity,accent:"var(--c3)",bg:"rgba(52,211,153,.10)",trend:false},
];
const INSIGHTS=[
  {icon:Users,label:"User Engagement",desc:"Track how often different roles interact with the platform daily.",accent:"var(--c1)",bg:"rgba(34,211,238,.10)"},
  {icon:Clock,label:"Peak Hours",desc:"Identify when your platform is most active to plan resources.",accent:"var(--c4)",bg:"rgba(167,139,250,.10)"},
  {icon:TrendingUp,label:"Activity Trends",desc:"Monitor growth and engagement patterns over time.",accent:"var(--c3)",bg:"rgba(52,211,153,.10)"},
];
const BARS=[{role:"Students",pct:0,color:"var(--c1)"},{role:"Trainers",pct:0,color:"var(--c4)"},{role:"Admins",pct:0,color:"var(--c2)"}];

const UsageAnalytics=()=>{
  const navigate=useNavigate();
  const[dark,setDark]=useState(isDark);
  const[period,setPeriod]=useState("7");
  React.useEffect(()=>{const o=new MutationObserver(()=>setDark(isDark()));o.observe(document.documentElement,{attributes:true,attributeFilter:["class"]});o.observe(document.body,{attributes:true,attributeFilter:["class"]});return()=>o.disconnect();},[]);
  return(
    <div className={`ua${dark?" ua-dk":""}`}>
      <div className="ua-in">
        <div className="ua-hdr">
          <div className="ua-hdr-l">
            <button className="ua-back" onClick={()=>navigate(-1)}><ArrowLeft size={14}/> Back</button>
            <div className="ua-hdr-ico"><BarChart3 size={24}/></div>
            <div>
              <div className="ua-bdg"><BarChart3 size={10}/> Analytics</div>
              <h1 className="ua-h1">Usage Analytics</h1>
              <p className="ua-sub">Track platform usage across users, roles and time periods</p>
            </div>
          </div>
          <div className="ua-live-chip"><Zap size={14} style={{color:"var(--c1)"}}/><span style={{fontWeight:800,color:"var(--c1)"}}>Live</span><span style={{color:"var(--mu)",fontWeight:500}}>Dashboard</span></div>
        </div>

        <div className="ua-stats">
          {STATS.map(s=>{const Icon=s.icon;return(
            <div key={s.label} className="ua-stat">
              <div className="ua-stat-ico" style={{background:s.bg,color:s.accent}}><Icon size={20}/></div>
              <div>
                <div className="ua-stat-val">{s.value}</div>
                <div className="ua-stat-lbl">{s.label}</div>
                {s.trend&&<div className="ua-stat-trend"><ArrowUp size={11}/>{s.sub}</div>}
                {!s.trend&&<div style={{fontSize:11,color:"var(--mu)",marginTop:3}}>{s.sub}</div>}
              </div>
            </div>
          );})}
        </div>

        <div className="ua-card">
          <div className="ua-ch">
            <div className="ua-ch-l">
              <div className="ua-ch-ico" style={{background:"rgba(167,139,250,.10)",color:"var(--c4)"}}><BarChart3 size={16}/></div>
              <span className="ua-ch-title">Role-wise Usage</span>
            </div>
            <select className="ua-sel" value={period} onChange={e=>setPeriod(e.target.value)}>
              <option value="7">Last 7 days</option><option value="30">Last 30 days</option>
            </select>
          </div>
          <div className="ua-cb">
            {BARS.map(b=>(
              <div key={b.role} className="ua-bar-row">
                <div className="ua-bar-label-row"><span className="ua-bar-label">{b.role}</span><span className="ua-bar-pct">{b.pct}%</span></div>
                <div className="ua-bar-track"><div className="ua-bar-fill" style={{width:`${b.pct}%`,background:b.color}}/></div>
              </div>
            ))}
          </div>
          <div className="ua-empty">
            <div className="ua-empty-ico"><BarChart3 size={22}/></div>
            <p className="ua-empty-t">No analytics data yet</p>
            <p className="ua-empty-s">Usage charts will appear once data is available</p>
          </div>
        </div>

        <div className="ua-card">
          <div className="ua-ch">
            <div className="ua-ch-l">
              <div className="ua-ch-ico" style={{background:"rgba(251,146,60,.10)",color:"var(--c2)"}}><Lightbulb size={16}/></div>
              <span className="ua-ch-title">Insights</span>
            </div>
          </div>
          <div style={{padding:"16px"}}>
            <div className="ua-insights">
              {INSIGHTS.map(({icon:Icon,label,desc,accent,bg})=>(
                <div key={label} className="ua-insight">
                  <div className="ua-insight-ico" style={{background:bg,color:accent}}><Icon size={18}/></div>
                  <p className="ua-insight-title">{label}</p>
                  <p className="ua-insight-desc">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default UsageAnalytics;