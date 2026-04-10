// import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import {
//   ClipboardList,
//   Search,
//   Plus,
//   Calendar,
//   TrendingUp,
//   Users,
//   FileText,
//   BarChart3,
//   Download,
//   Trophy,
//   AlertCircle,
//   Sparkles,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// const Assessments = () => {
//   const navigate = useNavigate();
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filterType, setFilterType] = useState("All");

//   const upcoming = [];
//   const recentAssessments = [];

//   const totalScheduled = upcoming.filter((a) => a.status === "Scheduled").length;
//   const totalDrafts = upcoming.filter((a) => a.status === "Draft").length;
//   const totalEnrolled = upcoming.reduce((acc, a) => acc + a.enrolled, 0);
//   const avgRecentScore =
//     recentAssessments.length > 0
//       ? (
//           recentAssessments.reduce((acc, a) => acc + a.avgScore, 0) /
//           recentAssessments.length
//         ).toFixed(1)
//       : 0;

//   const filteredUpcoming = upcoming.filter((item) => {
//     const matchesSearch =
//       item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       item.batch.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesType = filterType === "All" || item.type === filterType;
//     return matchesSearch && matchesType;
//   });

//   const stats = [
//     {
//       label: "Scheduled",
//       value: totalScheduled,
//       icon: Calendar,
//       color: "#9333ea",
//       bg: "from-purple-50 to-white dark:from-purple-950/20 dark:to-slate-900",
//       iconBg: "bg-purple-100 dark:bg-purple-900/30",
//       iconColor: "text-purple-600 dark:text-purple-400",
//       trendColor: "text-purple-500",
//     },
//     {
//       label: "Drafts",
//       value: totalDrafts,
//       icon: FileText,
//       color: "#d97706",
//       bg: "from-amber-50 to-white dark:from-amber-950/20 dark:to-slate-900",
//       iconBg: "bg-amber-100 dark:bg-amber-900/30",
//       iconColor: "text-amber-600 dark:text-amber-400",
//       trendColor: "text-amber-500",
//     },
//     {
//       label: "Total Students",
//       value: totalEnrolled,
//       icon: Users,
//       color: "#2563eb",
//       bg: "from-blue-50 to-white dark:from-blue-950/20 dark:to-slate-900",
//       iconBg: "bg-blue-100 dark:bg-blue-900/30",
//       iconColor: "text-blue-600 dark:text-blue-400",
//       trendColor: "text-blue-500",
//     },
//     {
//       label: "Avg Score",
//       value: `${avgRecentScore}%`,
//       icon: Trophy,
//       color: "#059669",
//       bg: "from-emerald-50 to-white dark:from-emerald-950/20 dark:to-slate-900",
//       iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
//       iconColor: "text-emerald-600 dark:text-emerald-400",
//       trendColor: "text-emerald-500",
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-[#f4f6fb] dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">

//       {/* ── HERO ── */}
//       <div
//         className="relative overflow-hidden"
//         style={{
//           background:
//             "linear-gradient(135deg, #0ea5e9 0%, #2563eb 45%, #4f46e5 100%)",
//         }}
//       >
//         {/* decorative blobs */}
//         <div
//           className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-20"
//           style={{ background: "radial-gradient(circle, #bae6fd, transparent)" }}
//         />
//         <div
//           className="pointer-events-none absolute -bottom-8 left-1/3 w-48 h-24 rounded-full opacity-15"
//           style={{ background: "radial-gradient(circle, #818cf8, transparent)" }}
//         />

//         <div className="relative px-5 py-5">
//           <div className="flex items-center gap-2 mb-1">
//             <div
//               className="w-7 h-7 rounded-lg flex items-center justify-center"
//               style={{ background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.25)" }}
//             >
//               <ClipboardList style={{ width: 14, height: 14, color: "white" }} />
//             </div>
//             <p
//               className="text-[9px] font-bold uppercase tracking-[0.12em]"
//               style={{ color: "rgba(255,255,255,0.6)" }}
//             >
//               Assessment Center
//             </p>
//           </div>
//           <h1 className="text-[18px] font-bold text-white leading-tight mb-0.5">
//             Assessments Overview
//           </h1>
//           <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.65)" }}>
//             Manage quizzes and assignments across all your batches
//           </p>
//         </div>
//       </div>

//       <div className="px-4 py-4 space-y-4">

//         {/* ── STATS GRID ── */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
//           {stats.map(({ label, value, icon: Icon, bg, iconBg, iconColor, trendColor }) => (
//             <div
//               key={label}
//               className={`rounded-xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br ${bg} px-4 py-3`}
//               style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
//             >
//               <div className="flex items-center justify-between mb-2">
//                 <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${iconBg}`}>
//                   <Icon style={{ width: 13, height: 13 }} className={iconColor} />
//                 </div>
//                 <TrendingUp style={{ width: 12, height: 12 }} className={trendColor} />
//               </div>
//               <p className="text-[20px] font-bold text-slate-800 dark:text-slate-100 leading-none mb-0.5">
//                 {value}
//               </p>
//               <p className="text-[11px] text-slate-500 dark:text-slate-400">{label}</p>
//             </div>
//           ))}
//         </div>

//         {/* ── UPCOMING ASSESSMENTS ── */}
//         <div
//           className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
//           style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.05)" }}
//         >
//           {/* card header */}
//           <div className="px-5 py-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
//             <div className="flex items-center gap-2.5">
//               <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
//                 <Calendar style={{ width: 13, height: 13 }} className="text-indigo-600 dark:text-indigo-400" />
//               </div>
//               <div>
//                 <p className="text-[13px] font-semibold text-slate-800 dark:text-slate-100 leading-tight">
//                   Upcoming Assessments
//                 </p>
//                 <p className="text-[11px] text-slate-400">
//                   Quizzes & assignments scheduled soon
//                 </p>
//               </div>
//             </div>
//             <div className="flex gap-2">
//               <button
//                 onClick={() => navigate("/trainer/create-quiz")}
//                 className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-[11px] font-semibold transition-all hover:brightness-105"
//                 style={{
//                   background: "linear-gradient(135deg, #9333ea, #6366f1)",
//                   boxShadow: "0 2px 6px rgba(99,102,241,0.3)",
//                 }}
//               >
//                 <Plus style={{ width: 11, height: 11 }} />
//                 Quiz
//               </button>
//               <button
//                 onClick={() => navigate("/trainer/create-assignments")}
//                 className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
//               >
//                 <Plus style={{ width: 11, height: 11 }} />
//                 Assignment
//               </button>
//             </div>
//           </div>

//           {/* empty state */}
//           {upcoming.length === 0 ? (
//             <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
//               <div
//                 className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
//                 style={{ background: "linear-gradient(135deg, #eef2ff, #e0e7ff)" }}
//               >
//                 <ClipboardList style={{ width: 24, height: 24, color: "#6366f1" }} />
//               </div>
//               <p className="text-[14px] font-semibold text-slate-700 dark:text-slate-200 mb-1">
//                 No Upcoming Assessments
//               </p>
//               <p className="text-[12px] text-slate-400 max-w-xs mb-5 leading-relaxed">
//                 Get started by creating your first quiz or assignment to track student progress effectively.
//               </p>
//               <div className="flex gap-2.5">
//                 <button
//                   onClick={() => navigate("/trainer/create-quiz")}
//                   className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-[12px] font-semibold transition-all hover:brightness-105"
//                   style={{
//                     background: "linear-gradient(135deg, #9333ea, #6366f1)",
//                     boxShadow: "0 2px 8px rgba(99,102,241,0.3)",
//                   }}
//                 >
//                   <Plus style={{ width: 12, height: 12 }} />
//                   Create Quiz
//                 </button>
//                 <button
//                   onClick={() => navigate("/trainer/create-assignments")}
//                   className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-semibold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
//                 >
//                   <Plus style={{ width: 12, height: 12 }} />
//                   Create Assignment
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <>
//               {/* search & filter */}
//               <div className="px-5 pt-3 pb-3 flex flex-col md:flex-row gap-2.5">
//                 <div className="flex-1 relative">
//                   <Search
//                     style={{ width: 13, height: 13 }}
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
//                   />
//                   <input
//                     placeholder="Search assessments..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[13px] text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/15 placeholder:text-slate-400"
//                   />
//                 </div>
//                 <div className="flex gap-1.5">
//                   {["All", "Quiz", "Assignment"].map((type) => (
//                     <button
//                       key={type}
//                       onClick={() => setFilterType(type)}
//                       className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
//                         filterType === type
//                           ? "bg-indigo-600 text-white shadow-sm"
//                           : "border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
//                       }`}
//                     >
//                       {type}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               <div className="px-5 pb-4 space-y-2">
//                 {filteredUpcoming.map((item) => (
//                   <div
//                     key={item.id}
//                     className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all"
//                   />
//                 ))}
//               </div>
//             </>
//           )}
//         </div>

//         {/* ── RECENT ASSESSMENTS ── */}
//         <div
//           className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
//           style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.05)" }}
//         >
//           <div className="px-5 py-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
//             <div className="flex items-center gap-2.5">
//               <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
//                 <BarChart3 style={{ width: 13, height: 13 }} className="text-blue-600 dark:text-blue-400" />
//               </div>
//               <div>
//                 <p className="text-[13px] font-semibold text-slate-800 dark:text-slate-100 leading-tight">
//                   Recent Assessments
//                 </p>
//                 <p className="text-[11px] text-slate-400">
//                   Completed assessments & performance analytics
//                 </p>
//               </div>
//             </div>
//             {recentAssessments.length > 0 && (
//               <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
//                 <Download style={{ width: 11, height: 11 }} />
//                 Export
//               </button>
//             )}
//           </div>

//           {recentAssessments.length === 0 ? (
//             <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
//               <div
//                 className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
//                 style={{ background: "linear-gradient(135deg, #eff6ff, #dbeafe)" }}
//               >
//                 <BarChart3 style={{ width: 24, height: 24, color: "#3b82f6" }} />
//               </div>
//               <p className="text-[14px] font-semibold text-slate-700 dark:text-slate-200 mb-1">
//                 No Completed Assessments Yet
//               </p>
//               <p className="text-[12px] text-slate-400 max-w-xs mb-4 leading-relaxed">
//                 Once students complete your assessments, you'll see detailed analytics and performance metrics here.
//               </p>
//               <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
//                 <Sparkles style={{ width: 12, height: 12, color: "#60a5fa" }} />
//                 <span>Create assessments to start tracking progress</span>
//               </div>
//             </div>
//           ) : (
//             <div className="px-5 py-4 space-y-2">
//               {recentAssessments.map((item) => (
//                 <div
//                   key={item.id}
//                   className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all"
//                 />
//               ))}
//             </div>
//           )}
//         </div>

//         {/* ── HELP SECTION ── */}
//         <div
//           className="rounded-2xl border border-blue-100 dark:border-blue-900/40 px-5 py-4"
//           style={{
//             background: "linear-gradient(135deg, #eff6ff 0%, #f8faff 100%)",
//             boxShadow: "0 1px 3px rgba(59,130,246,0.08)",
//           }}
//         >
//           <div className="flex gap-3">
//             <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0 mt-0.5">
//               <AlertCircle style={{ width: 14, height: 14 }} className="text-blue-600 dark:text-blue-400" />
//             </div>
//             <div>
//               <p className="text-[13px] font-semibold text-slate-700 dark:text-slate-200 mb-2">
//                 Getting Started with Assessments
//               </p>
//               <ul className="space-y-1.5">
//                 {[
//                   "Create quizzes with multiple choice, true/false, and short answer questions",
//                   "Set up assignments for practical tasks with file uploads and deadlines",
//                   "Track student submissions and provide detailed feedback",
//                   "View analytics and performance metrics to identify support areas",
//                 ].map((tip, i) => (
//                   <li key={i} className="flex items-start gap-2">
//                     <span
//                       className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
//                       style={{ background: "#3b82f6" }}
//                     />
//                     <span className="text-[12px] text-slate-500 dark:text-slate-400 leading-relaxed">
//                       {tip}
//                     </span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default Assessments;















import React, { useState } from "react";
import {
  ClipboardList, Search, Plus, Calendar, TrendingUp,
  Users, FileText, BarChart3, Download, Trophy, AlertCircle, Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
:root{--bg:#f1f5f9;--card:#ffffff;--tx:#0f172a;--mu:#64748b;--bd:#e2e8f0;
  --c1:#22d3ee;--c2:#fb923c;--c3:#34d399;--c4:#a78bfa;--cr:#f87171;
  --sh:0 4px 24px rgba(0,0,0,0.06);--shl:0 8px 40px rgba(0,0,0,0.10);--r:20px;}
.as-dk{--bg:#0a0a0a;--card:#111111;--tx:#ffffff;--mu:#94a3b8;--bd:rgba(255,255,255,0.06);
  --sh:0 4px 24px rgba(0,0,0,0.40);--shl:0 8px 40px rgba(0,0,0,0.60);}
.as{font-family:'Poppins',sans-serif;min-height:100vh;background:var(--bg);color:var(--tx);padding:24px;box-sizing:border-box;}
.as-in{max-width:1200px;margin:0 auto;display:flex;flex-direction:column;gap:20px;}
.as-hdr{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);padding:28px 32px;box-shadow:var(--sh);display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap;}
.as-hdr-l{display:flex;align-items:center;gap:16px;}
.as-ico{width:52px;height:52px;border-radius:14px;background:rgba(34,211,238,.10);border:1px solid rgba(34,211,238,.18);display:flex;align-items:center;justify-content:center;color:var(--c1);flex-shrink:0;}
.as-bdg{display:inline-flex;align-items:center;gap:6px;padding:4px 11px;border-radius:50px;border:1px solid var(--bd);background:rgba(34,211,238,.08);color:var(--c1);font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;margin-bottom:6px;}
.as-h1{font-size:24px;font-weight:800;color:var(--tx);margin:0 0 2px;}
.as-sub{font-size:13px;color:var(--mu);margin:0;}
.as-stats{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:16px;}
.as-stat{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);padding:20px 22px;box-shadow:var(--sh);display:flex;align-items:center;gap:14px;transition:transform .2s,box-shadow .2s;}
.as-stat:hover{transform:translateY(-2px);box-shadow:var(--shl);}
.as-si{width:44px;height:44px;border-radius:13px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.as-sv{font-size:22px;font-weight:800;line-height:1;margin-bottom:3px;}
.as-sl{font-size:10px;font-weight:600;color:var(--mu);text-transform:uppercase;letter-spacing:.06em;}
.as-panel{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);box-shadow:var(--sh);overflow:hidden;}
.as-ph{display:flex;align-items:center;justify-content:space-between;padding:18px 24px;border-bottom:1px solid var(--bd);flex-wrap:wrap;gap:12px;}
.as-phl{display:flex;align-items:center;gap:10px;}
.as-pico{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.as-ptitle{font-size:14px;font-weight:700;color:var(--tx);margin:0 0 2px;}
.as-psub{font-size:11px;color:var(--mu);margin:0;}
.as-phbtns{display:flex;gap:8px;}
.as-pbtn{display:inline-flex;align-items:center;gap:6px;padding:9px 16px;border-radius:11px;border:none;font-family:'Poppins',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:opacity .2s,transform .15s;white-space:nowrap;}
.as-pbtn:hover{opacity:.87;transform:translateY(-1px);}
.as-pbtn-c{background:var(--c4);color:#0a0a0a;}
.as-pbtn-o{background:transparent;color:var(--mu);border:1px solid var(--bd)!important;}
.as-pbtn-o:hover{border-color:rgba(34,211,238,.30)!important;color:var(--c1);}
.as-pbtn-dl{background:transparent;color:var(--mu);border:1px solid var(--bd)!important;}
.as-pbtn-dl:hover{border-color:rgba(34,211,238,.30)!important;color:var(--c1);}
.as-emp{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:56px 20px;text-align:center;gap:0;}
.as-eico{width:64px;height:64px;border-radius:18px;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;}
.as-et{font-size:15px;font-weight:700;color:var(--tx);margin:0 0 6px;}
.as-es{font-size:12px;color:var(--mu);max-width:280px;line-height:1.6;margin:0 auto 20px;}
.as-emp-btns{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;}
.as-help{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);padding:24px 28px;box-shadow:var(--sh);display:flex;gap:16px;}
.as-hi{width:44px;height:44px;border-radius:13px;background:rgba(34,211,238,.10);border:1px solid rgba(34,211,238,.15);display:flex;align-items:center;justify-content:center;color:var(--c1);flex-shrink:0;margin-top:2px;}
.as-ht{font-size:14px;font-weight:700;color:var(--tx);margin:0 0 12px;}
.as-hl{display:flex;flex-direction:column;gap:8px;}
.as-hli{display:flex;align-items:flex-start;gap:8px;font-size:12px;color:var(--mu);}
.as-hd{width:6px;height:6px;border-radius:50%;background:var(--c1);flex-shrink:0;margin-top:4px;}
`;
if(!document.getElementById("as-st")){const t=document.createElement("style");t.id="as-st";t.textContent=STYLES;document.head.appendChild(t);}
const isDark=()=>document.documentElement.classList.contains("dark")||document.body.classList.contains("dark")||window.matchMedia("(prefers-color-scheme: dark)").matches;

const Assessments = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [dark, setDark] = useState(isDark);

  React.useEffect(()=>{
    const o=new MutationObserver(()=>setDark(isDark()));
    o.observe(document.documentElement,{attributes:true,attributeFilter:["class"]});
    o.observe(document.body,{attributes:true,attributeFilter:["class"]});
    return()=>o.disconnect();
  },[]);

  const upcoming=[];
  const recentAssessments=[];
  const totalScheduled=upcoming.filter(a=>a.status==="Scheduled").length;
  const totalDrafts=upcoming.filter(a=>a.status==="Draft").length;
  const totalEnrolled=upcoming.reduce((acc,a)=>acc+a.enrolled,0);
  const avgRecentScore=recentAssessments.length>0?(recentAssessments.reduce((acc,a)=>acc+a.avgScore,0)/recentAssessments.length).toFixed(1):0;

  const stats=[
    {label:"Scheduled",value:totalScheduled,icon:<Calendar size={18}/>,accent:"var(--c4)",bg:"rgba(167,139,250,.10)"},
    {label:"Drafts",value:totalDrafts,icon:<FileText size={18}/>,accent:"var(--c2)",bg:"rgba(251,146,60,.10)"},
    {label:"Total Students",value:totalEnrolled,icon:<Users size={18}/>,accent:"var(--c1)",bg:"rgba(34,211,238,.10)"},
    {label:"Avg Score",value:`${avgRecentScore}%`,icon:<Trophy size={18}/>,accent:"var(--c3)",bg:"rgba(52,211,153,.10)"},
  ];

  return(
    <div className={`as${dark?" as-dk":""}`}>
      <div className="as-in">
        <div className="as-hdr">
          <div className="as-hdr-l">
            <div className="as-ico"><ClipboardList size={24}/></div>
            <div>
              <div className="as-bdg"><ClipboardList size={10}/> Assessment Center</div>
              <h1 className="as-h1">Assessments Overview</h1>
              <p className="as-sub">Manage quizzes and assignments across all your batches</p>
            </div>
          </div>
        </div>

        <div className="as-stats">
          {stats.map((s,i)=>(
            <div key={i} className="as-stat">
              <div className="as-si" style={{background:s.bg,color:s.accent}}>{s.icon}</div>
              <div><div className="as-sv" style={{color:s.accent}}>{s.value}</div><div className="as-sl">{s.label}</div></div>
            </div>
          ))}
        </div>

        {/* Upcoming */}
        <div className="as-panel">
          <div className="as-ph">
            <div className="as-phl">
              <div className="as-pico" style={{background:"rgba(167,139,250,.10)",color:"var(--c4)"}}><Calendar size={16}/></div>
              <div><p className="as-ptitle">Upcoming Assessments</p><p className="as-psub">Quizzes & assignments scheduled soon</p></div>
            </div>
            <div className="as-phbtns">
              <button className="as-pbtn as-pbtn-c" onClick={()=>navigate("/trainer/create-quiz")}><Plus size={12}/> Quiz</button>
              <button className="as-pbtn as-pbtn-o" onClick={()=>navigate("/trainer/create-assignments")} style={{border:"1px solid var(--bd)"}}><Plus size={12}/> Assignment</button>
            </div>
          </div>

          {upcoming.length===0?(
            <div className="as-emp">
              <div className="as-eico" style={{background:"rgba(167,139,250,.10)",border:"1px solid rgba(167,139,250,.15)"}}><ClipboardList size={26} style={{color:"var(--c4)"}}/></div>
              <p className="as-et">No Upcoming Assessments</p>
              <p className="as-es">Get started by creating your first quiz or assignment to track student progress effectively.</p>
              <div className="as-emp-btns">
                <button className="as-pbtn as-pbtn-c" onClick={()=>navigate("/trainer/create-quiz")}><Plus size={13}/> Create Quiz</button>
                <button className="as-pbtn as-pbtn-o" onClick={()=>navigate("/trainer/create-assignments")} style={{border:"1px solid var(--bd)"}}><Plus size={13}/> Create Assignment</button>
              </div>
            </div>
          ):(
            <div style={{padding:"16px 24px",display:"flex",flexDirection:"column",gap:8}}>
              {upcoming.map(item=><div key={item.id} style={{borderRadius:13,border:"1px solid var(--bd)",padding:16,background:"var(--bg)"}}/>)}
            </div>
          )}
        </div>

        {/* Recent */}
        <div className="as-panel">
          <div className="as-ph">
            <div className="as-phl">
              <div className="as-pico" style={{background:"rgba(34,211,238,.10)",color:"var(--c1)"}}><BarChart3 size={16}/></div>
              <div><p className="as-ptitle">Recent Assessments</p><p className="as-psub">Completed assessments & performance analytics</p></div>
            </div>
            {recentAssessments.length>0&&(
              <button className="as-pbtn as-pbtn-dl" style={{border:"1px solid var(--bd)"}}><Download size={12}/> Export</button>
            )}
          </div>

          {recentAssessments.length===0?(
            <div className="as-emp">
              <div className="as-eico" style={{background:"rgba(34,211,238,.10)",border:"1px solid rgba(34,211,238,.15)"}}><BarChart3 size={26} style={{color:"var(--c1)"}}/></div>
              <p className="as-et">No Completed Assessments Yet</p>
              <p className="as-es">Once students complete your assessments, you'll see detailed analytics and performance metrics here.</p>
              <div className="as-hli" style={{fontSize:12,color:"var(--mu)"}}>
                <Sparkles size={13} style={{color:"var(--c1)",flexShrink:0}}/>
                <span>Create assessments to start tracking progress</span>
              </div>
            </div>
          ):(
            <div style={{padding:"16px 24px",display:"flex",flexDirection:"column",gap:8}}>
              {recentAssessments.map(item=><div key={item.id} style={{borderRadius:13,border:"1px solid var(--bd)",padding:16,background:"var(--bg)"}}/>)}
            </div>
          )}
        </div>

        {/* Help */}
        <div className="as-help">
          <div className="as-hi"><AlertCircle size={20}/></div>
          <div>
            <h3 className="as-ht">Getting Started with Assessments</h3>
            <div className="as-hl">
              {["Create quizzes with multiple choice, true/false, and short answer questions","Set up assignments for practical tasks with file uploads and deadlines","Track student submissions and provide detailed feedback","View analytics and performance metrics to identify support areas"].map((tip,i)=>(
                <div key={i} className="as-hli"><span className="as-hd"/><span>{tip}</span></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Assessments;