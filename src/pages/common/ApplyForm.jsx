// import React, { useState } from "react";
// import {
//   ArrowRight,
//   BookOpen,
//   Building2,
//   CheckCircle2,
//   ChevronRight,
//   FileText,
//   GraduationCap,
//   Info,
//   Lightbulb,
//   Rocket,
//   ShieldCheck,
//   Sparkles,
//   Users,
//   Layers,
// } from "lucide-react";

// // ✅ Forms (unchanged)
// import ApplyAdmin from "../../Admin/ApplyAdmin";
// import ApplyTrainer from "../../Trainer/ApplyTrainer";
// import ApplyBusiness from "../../Business/ApplyBusiness";
// import StudentApplicationForm from "../../Student/StudentApplicationForm";

// /* ── role config ── */
// const ROLES = [
//   {
//     key:     "student",
//     label:   "Student",
//     tagline: "Learn & grow",
//     icon:    BookOpen,
//     grad:    "from-cyan-500 to-blue-600",
//     softBg:  "bg-cyan-50 dark:bg-cyan-950/30",
//     border:  "border-cyan-200 dark:border-cyan-800",
//     ring:    "ring-cyan-400",
//     text:    "text-cyan-700 dark:text-cyan-300",
//   },
//   {
//     key:     "trainer",
//     label:   "Trainer",
//     tagline: "Teach & inspire",
//     icon:    GraduationCap,
//     grad:    "from-violet-500 to-purple-600",
//     softBg:  "bg-violet-50 dark:bg-violet-950/30",
//     border:  "border-violet-200 dark:border-violet-800",
//     ring:    "ring-violet-400",
//     text:    "text-violet-700 dark:text-violet-300",
//   },
//   {
//     key:     "business",
//     label:   "Business",
//     tagline: "Scale your team",
//     icon:    Building2,
//     grad:    "from-amber-500 to-orange-500",
//     softBg:  "bg-amber-50 dark:bg-amber-950/30",
//     border:  "border-amber-200 dark:border-amber-800",
//     ring:    "ring-amber-400",
//     text:    "text-amber-700 dark:text-amber-300",
//   },
//   {
//     key:     "admin",
//     label:   "Admin",
//     tagline: "Full platform access",
//     icon:    ShieldCheck,
//     grad:    "from-rose-500 to-red-500",
//     softBg:  "bg-rose-50 dark:bg-rose-950/30",
//     border:  "border-rose-200 dark:border-rose-800",
//     ring:    "ring-rose-400",
//     text:    "text-rose-700 dark:text-rose-300",
//   },
// ];

// /* ── info panel tips per role ── */
// const ROLE_INFO = {
//   student: {
//     title: "Student Application",
//     desc:  "Join thousands of learners on ILM ORA and unlock your potential.",
//     tips: [
//       { icon: FileText,     text: "Fill your personal details accurately" },
//       { icon: ShieldCheck,  text: "Upload a valid government-issued ID proof" },
//       { icon: CheckCircle2, text: "Applications reviewed within 24 hours" },
//       { icon: Sparkles,     text: "Email confirmation sent upon approval" },
//     ],
//   },
//   trainer: {
//     title: "Trainer Application",
//     desc:  "Share your expertise and shape the next generation of professionals.",
//     tips: [
//       { icon: Lightbulb,     text: "Clearly describe your area of expertise" },
//       { icon: GraduationCap, text: "Include past teaching or mentoring experience" },
//       { icon: FileText,      text: "Attach relevant certifications or credentials" },
//       { icon: ShieldCheck,   text: "Profile verified by admin before activation" },
//     ],
//   },
//   business: {
//     title: "Business Application",
//     desc:  "Empower your workforce with structured, scalable learning.",
//     tips: [
//       { icon: Building2, text: "Provide your company registration details" },
//       { icon: Users,     text: "Mention team size & specific learning goals" },
//       { icon: Layers,    text: "Business plans include bulk enrollments" },
//       { icon: Sparkles,  text: "Dedicated support team after approval" },
//     ],
//   },
//   admin: {
//     title: "Admin Application",
//     desc:  "Platform control is restricted to verified administrators only.",
//     tips: [
//       { icon: ShieldCheck, text: "Admin access is strictly controlled & verified" },
//       { icon: Building2,   text: "Provide your full organisation details" },
//       { icon: FileText,    text: "Background verification may be required" },
//       { icon: Users,       text: "Approved only by existing super-admins" },
//     ],
//   },
// };

// const STEPS = ["Choose Role", "Fill Form", "Submit"];

// /* ================= MAIN ================= */
// const ApplyForm = () => {
//   const [role, setRole]             = useState("");
//   const [leftWidth, setLeftWidth]   = useState(58);
//   const [isDragging, setIsDragging] = useState(false);

//   /* ── drag logic (unchanged) ── */
//   const handleMouseMove = (e) => {
//     if (!isDragging) return;
//     const newWidth = (e.clientX / window.innerWidth) * 100;
//     if (newWidth > 25 && newWidth < 75) setLeftWidth(newWidth);
//   };
//   const handleMouseUp = () => setIsDragging(false);

//   /* ── form render (unchanged) ── */
//   const renderForm = () => {
//     switch (role) {
//       case "admin":    return <ApplyAdmin />;
//       case "trainer":  return <ApplyTrainer />;
//       case "business": return <ApplyBusiness />;
//       case "student":  return <StudentApplicationForm />;
//       default:
//         return (
//           <div className="flex flex-col items-center justify-center h-full gap-5 py-20">
//             <div className="relative">
//               <div className="h-20 w-20 rounded-2xl bg-slate-100 dark:bg-slate-800
//                 flex items-center justify-center">
//                 <ArrowRight className="h-9 w-9 text-slate-300 dark:text-slate-600" />
//               </div>
//               <div className="absolute -top-1.5 -right-1.5 h-6 w-6 rounded-full
//                 bg-gradient-to-br from-blue-500 to-cyan-500
//                 flex items-center justify-center">
//                 <Sparkles className="h-3 w-3 text-white" />
//               </div>
//             </div>
//             <div className="text-center">
//               <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
//                 Choose your role to begin
//               </p>
//               <p className="text-xs text-slate-400 mt-1">
//                 Select one of the cards above to load your application form
//               </p>
//             </div>
//           </div>
//         );
//     }
//   };

//   const activeRole = ROLES.find((r) => r.key === role);
//   const info       = ROLE_INFO[role];
//   const step       = role ? 1 : 0;

//   return (
//     <div
//       className="min-h-screen bg-[#f0f4ff] dark:bg-[#060b18] p-5 space-y-5 select-none"
//       onMouseMove={handleMouseMove}
//       onMouseUp={handleMouseUp}
//     >

//       {/* ═══════ HERO ═══════ */}
//       <div className="rounded-2xl border border-slate-200 dark:border-slate-800
//         bg-white dark:bg-slate-900 shadow-sm">

//         <div className="flex items-center justify-between px-6 py-4">
//           <div className="flex items-center gap-4">
//             <div className="h-11 w-11 rounded-xl bg-slate-100 dark:bg-slate-800
//               flex items-center justify-center">
//               <Rocket className="h-5 w-5 text-orange-500" />
//             </div>
//             <h1 className="text-2xl font-bold tracking-tight">
//             <span className="text-green-600">ILM</span>{" "}
//             <span className="text-[#F97316]">ORA</span>
//             </h1>
//           </div>

//           {/* step tracker */}
//           <div className="hidden md:flex items-center gap-1.5 rounded-2xl
//             bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700
//             px-4 py-2">
//             {STEPS.map((s, i) => (
//               <React.Fragment key={s}>
//                 <div className="flex items-center gap-1.5">
//                   <div className={`h-5 w-5 rounded-full flex items-center justify-center
//                     ${i < step ? "bg-green-500" : i === step ? "bg-orange-500" : "bg-slate-300 dark:bg-slate-600"}`}>
//                     {i < step
//                       ? <CheckCircle2 className="h-4 w-4 text-white" />
//                       : <span className="text-[10px] font-bold text-white">{i + 1}</span>
//                     }
//                   </div>
//                   <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
//                     {s}
//                   </span>
//                 </div>
//                 {i < STEPS.length - 1 && (
//                   <ChevronRight className="h-3.5 w-3.5 text-slate-400 mx-0.5" />
//                 )}
//               </React.Fragment>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* ═══════ ROLE SELECTOR ═══════ */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//         {ROLES.map((item) => {
//           const Icon     = item.icon;
//           const isActive = role === item.key;
//           return (
//             <button
//               key={item.key}
//               onClick={() => setRole(item.key)}
//               className={`group relative overflow-hidden rounded-2xl border text-left
//                 transition-all duration-200 p-4
//                 ${isActive
//                   ? `${item.softBg} ${item.border} shadow-lg ring-2 ${item.ring}
//                      ring-offset-2 ring-offset-[#f0f4ff] dark:ring-offset-[#060b18] scale-[1.02]`
//                   : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-md hover:scale-[1.01]"
//                 }`}
//             >
//               {isActive && (
//                 <div className={`absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r ${item.grad}`} />
//               )}
//               <div className={`h-10 w-10 rounded-xl mb-3 flex items-center justify-center transition-all
//                 ${isActive
//                   ? `bg-gradient-to-br ${item.grad} shadow-md`
//                   : "bg-slate-100 dark:bg-slate-800 group-hover:bg-slate-200 dark:group-hover:bg-slate-700"
//                 }`}>
//                 <Icon className={`h-5 w-5 ${isActive ? "text-white" : "text-slate-500 dark:text-slate-400"}`} />
//               </div>
//               <p className={`text-sm font-bold ${isActive ? item.text : "text-slate-800 dark:text-slate-100"}`}>
//                 {item.label}
//               </p>
//               <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
//                 {item.tagline}
//               </p>
//               {isActive && (
//                 <div className={`absolute top-3 right-3 h-5 w-5 rounded-full
//                   bg-gradient-to-br ${item.grad} flex items-center justify-center shadow-sm`}>
//                   <CheckCircle2 className="h-3.5 w-3.5 text-white" />
//                 </div>
//               )}
//             </button>
//           );
//         })}
//       </div>

//       {/* ═══════ RESIZABLE PANEL ═══════ */}
//       <div
//         className="flex rounded-2xl border border-slate-200 dark:border-slate-800
//           overflow-hidden shadow-xl"
//         style={{ height: "72vh" }}
//       >

//         {/* ── LEFT: FORM ── */}
//         <div
//           style={{ width: `${leftWidth}%` }}
//           className="flex flex-col overflow-hidden bg-white dark:bg-slate-900
//             border-r border-slate-100 dark:border-slate-800"
//         >
//           {/* form topbar */}
//           <div className="flex items-center gap-3 px-5 py-3 shrink-0
//             border-b border-slate-100 dark:border-slate-800
//             bg-slate-50/80 dark:bg-slate-900/80">
//             {activeRole ? (
//               <>
//                 <div className={`h-7 w-7 rounded-lg bg-gradient-to-br ${activeRole.grad}
//                   flex items-center justify-center shrink-0 shadow-sm`}>
//                   {React.createElement(activeRole.icon, { className: "h-3.5 w-3.5 text-white" })}
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
//                     {info?.title}
//                   </p>
//                   <p className="text-[10px] text-slate-400">Fill all required fields carefully</p>
//                 </div>
//                 <span className={`inline-flex items-center rounded-full border
//                   px-2 py-0.5 text-[10px] font-semibold shrink-0
//                   ${activeRole.softBg} ${activeRole.border} ${activeRole.text}`}>
//                   {activeRole.label}
//                 </span>
//               </>
//             ) : (
//               <div className="flex items-center gap-2">
//                 <div className="h-7 w-7 rounded-lg bg-slate-100 dark:bg-slate-800
//                   flex items-center justify-center">
//                   <FileText className="h-3.5 w-3.5 text-slate-400" />
//                 </div>
//                 <p className="text-xs font-medium text-slate-400">Application Form</p>
//               </div>
//             )}
//           </div>

//           {/* form body */}
//           <div className="flex-1 overflow-auto p-5">
//             {renderForm()}
//           </div>
//         </div>

//         {/* ── DRAG HANDLE ── */}
//         <div
//           onMouseDown={() => setIsDragging(true)}
//           className={`relative w-2 flex-none cursor-col-resize flex items-center justify-center
//             transition-colors duration-150 group
//             ${isDragging
//               ? "bg-blue-500"
//               : "bg-slate-100 dark:bg-slate-800 hover:bg-blue-400 dark:hover:bg-blue-600"
//             }`}
//         >
//           <div className="flex flex-col gap-1">
//             {[...Array(5)].map((_, i) => (
//               <div key={i} className={`h-1 w-1 rounded-full transition-colors
//                 ${isDragging ? "bg-white/70" : "bg-slate-300 dark:bg-slate-600 group-hover:bg-white/80"}`} />
//             ))}
//           </div>
//         </div>

//         {/* ── RIGHT: INFO PANEL ── 🔥 FIX: removed h-full + flex-col from inner div ── */}
//         <div
//           style={{ width: `${100 - leftWidth}%` }}
//           className="overflow-y-auto bg-slate-50 dark:bg-[#0a1220]"
//         >
//           {role && info && activeRole ? (
//             /* 🔥 KEY FIX: no h-full, no flex-col — just a normal padded block that scrolls naturally */
//             <div className="p-5 space-y-4">

//               {/* role header card */}
//               <div className={`relative overflow-hidden rounded-2xl p-4
//                 bg-gradient-to-br ${activeRole.grad}`}>
//                 <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-white/10 blur-xl" />
//                 <div className="relative flex items-center gap-3">
//                   <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
//                     {React.createElement(activeRole.icon, { className: "h-5 w-5 text-white" })}
//                   </div>
//                   <div>
//                     <p className="text-sm font-bold text-white">{info.title}</p>
//                     <p className="text-[11px] text-white/70 mt-0.5 leading-relaxed">{info.desc}</p>
//                   </div>
//                 </div>
//               </div>

//               {/* tips header */}
//               <div className="flex items-center gap-1.5">
//                 <Lightbulb className="h-3.5 w-3.5 text-slate-400" />
//                 <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
//                   Application Tips
//                 </p>
//               </div>

//               {/* tip cards */}
//               <div className="space-y-2">
//                 {info.tips.map((tip, i) => {
//                   const TipIcon = tip.icon;
//                   return (
//                     <div
//                       key={i}
//                       className="flex items-start gap-3 rounded-xl
//                         bg-white dark:bg-slate-800/80 border border-slate-100
//                         dark:border-slate-700/60 px-3.5 py-3
//                         hover:border-slate-200 dark:hover:border-slate-600
//                         transition-colors duration-150"
//                     >
//                       <div className={`mt-0.5 h-6 w-6 rounded-lg bg-gradient-to-br ${activeRole.grad}
//                         flex items-center justify-center shrink-0 shadow-sm`}>
//                         <TipIcon className="h-3.5 w-3.5 text-white" />
//                       </div>
//                       <div>
//                         <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-0.5 uppercase tracking-wide">
//                           Step {i + 1}
//                         </p>
//                         <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
//                           {tip.text}
//                         </p>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>

//               {/* info note */}
//               <div className="flex items-start gap-2.5 rounded-xl
//                 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800
//                 px-3.5 py-3">
//                 <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
//                 <p className="text-[11px] text-blue-700 dark:text-blue-300 leading-relaxed">
//                   Applications are manually reviewed. You'll receive an email confirmation once a decision is made.
//                 </p>
//               </div>
//             </div>

//           ) : (
//             /* empty state — needs h-full to center properly */
//             <div className="flex flex-col items-center justify-center h-full gap-4 p-6">
//               <div className="relative">
//                 <div className="h-16 w-16 rounded-2xl bg-white dark:bg-slate-800 border
//                   border-slate-200 dark:border-slate-700 shadow-sm
//                   flex items-center justify-center">
//                   <Info className="h-7 w-7 text-slate-300 dark:text-slate-600" />
//                 </div>
//                 <div className="absolute -bottom-1.5 -right-1.5 h-6 w-6 rounded-full
//                   bg-gradient-to-br from-blue-500 to-cyan-500
//                   flex items-center justify-center shadow">
//                   <Sparkles className="h-3 w-3 text-white" />
//                 </div>
//               </div>
//               <div className="text-center">
//                 <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Info Panel</p>
//                 <p className="text-xs text-slate-400 mt-1 leading-relaxed">
//                   Select a role to see<br />application tips & details
//                 </p>
//               </div>
//               <div className="flex flex-wrap justify-center gap-2 mt-1">
//                 {ROLES.map((r) => {
//                   const Icon = r.icon;
//                   return (
//                     <button
//                       key={r.key}
//                       onClick={() => setRole(r.key)}
//                       className={`flex items-center gap-1.5 rounded-xl border
//                         px-2.5 py-1.5 text-[11px] font-semibold transition-all hover:scale-105
//                         ${r.softBg} ${r.border} ${r.text}`}
//                     >
//                       <Icon className="h-3 w-3" /> {r.label}
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ApplyForm;














































import React, { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Building2,
  CheckCircle2,
  ChevronRight,
  FileText,
  GraduationCap,
  Info,
  Lightbulb,
  Rocket,
  ShieldCheck,
  Sparkles,
  Users,
  Layers,
} from "lucide-react";

// ✅ Forms (unchanged)
import ApplyAdmin from "../../Admin/ApplyAdmin";
import ApplyTrainer from "../../Trainer/ApplyTrainer";
import ApplyBusiness from "../../Business/ApplyBusiness";
import StudentApplicationForm from "../../Student/StudentApplicationForm";

/* ── role config ── */
const ROLES = [
  {
    key:     "student",
    label:   "Student",
    tagline: "Learn & grow",
    icon:    BookOpen,
    grad:    "from-cyan-500 to-blue-600",
    color:   "#22c55e",
    softBg:  "#f0fdf4",
    border:  "rgba(34,197,94,0.25)",
    ring:    "rgba(34,197,94,0.4)",
    text:    "#15803d",
  },
  {
    key:     "trainer",
    label:   "Trainer",
    tagline: "Teach & inspire",
    icon:    GraduationCap,
    grad:    "from-violet-500 to-purple-600",
    color:   "#a855f7",
    softBg:  "#faf5ff",
    border:  "rgba(168,85,247,0.25)",
    ring:    "rgba(168,85,247,0.4)",
    text:    "#7e22ce",
  },
  {
    key:     "business",
    label:   "Business",
    tagline: "Scale your team",
    icon:    Building2,
    grad:    "from-amber-500 to-orange-500",
    color:   "#F97316",
    softBg:  "#fff7ed",
    border:  "rgba(249,115,22,0.25)",
    ring:    "rgba(249,115,22,0.4)",
    text:    "#c2410c",
  },
  {
    key:     "admin",
    label:   "Admin",
    tagline: "Full platform access",
    icon:    ShieldCheck,
    grad:    "from-rose-500 to-red-500",
    color:   "#ef4444",
    softBg:  "#fff1f2",
    border:  "rgba(239,68,68,0.25)",
    ring:    "rgba(239,68,68,0.4)",
    text:    "#b91c1c",
  },
];

/* ── info panel tips per role ── */
const ROLE_INFO = {
  student: {
    title: "Student Application",
    desc:  "Join thousands of learners on ILM ORA and unlock your potential.",
    tips: [
      { icon: FileText,     text: "Fill your personal details accurately" },
      { icon: ShieldCheck,  text: "Upload a valid government-issued ID proof" },
      { icon: CheckCircle2, text: "Applications reviewed within 24 hours" },
      { icon: Sparkles,     text: "Email confirmation sent upon approval" },
    ],
  },
  trainer: {
    title: "Trainer Application",
    desc:  "Share your expertise and shape the next generation of professionals.",
    tips: [
      { icon: Lightbulb,     text: "Clearly describe your area of expertise" },
      { icon: GraduationCap, text: "Include past teaching or mentoring experience" },
      { icon: FileText,      text: "Attach relevant certifications or credentials" },
      { icon: ShieldCheck,   text: "Profile verified by admin before activation" },
    ],
  },
  business: {
    title: "Business Application",
    desc:  "Empower your workforce with structured, scalable learning.",
    tips: [
      { icon: Building2, text: "Provide your company registration details" },
      { icon: Users,     text: "Mention team size & specific learning goals" },
      { icon: Layers,    text: "Business plans include bulk enrollments" },
      { icon: Sparkles,  text: "Dedicated support team after approval" },
    ],
  },
  admin: {
    title: "Admin Application",
    desc:  "Platform control is restricted to verified administrators only.",
    tips: [
      { icon: ShieldCheck, text: "Admin access is strictly controlled & verified" },
      { icon: Building2,   text: "Provide your full organisation details" },
      { icon: FileText,    text: "Background verification may be required" },
      { icon: Users,       text: "Approved only by existing super-admins" },
    ],
  },
};

const STEPS = ["Choose Role", "Fill Form", "Submit"];

/* ── gradient map for inline styles ── */
const GRAD_COLORS = {
  student:  ["#06b6d4", "#2563eb"],
  trainer:  ["#a855f7", "#9333ea"],
  business: ["#f59e0b", "#F97316"],
  admin:    ["#f43f5e", "#ef4444"],
};

/* ================= MAIN ================= */
const ApplyForm = () => {
  const [role, setRole]             = useState("");
  const [leftWidth, setLeftWidth]   = useState(58);
  const [isDragging, setIsDragging] = useState(false);

  /* ── drag logic (unchanged) ── */
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const newWidth = (e.clientX / window.innerWidth) * 100;
    if (newWidth > 25 && newWidth < 75) setLeftWidth(newWidth);
  };
  const handleMouseUp = () => setIsDragging(false);

  /* ── form render (unchanged) ── */
  const renderForm = () => {
    switch (role) {
      case "admin":    return <ApplyAdmin />;
      case "trainer":  return <ApplyTrainer />;
      case "business": return <ApplyBusiness />;
      case "student":  return <StudentApplicationForm />;
      default:
        return (
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",gap:20,padding:"80px 0"}}>
            <div style={{position:"relative"}}>
              <div style={{height:80,width:80,borderRadius:20,background:"rgba(180,100,30,0.08)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <ArrowRight style={{width:36,height:36,color:"rgba(180,100,30,0.25)"}} />
              </div>
              <div style={{position:"absolute",top:-6,right:-6,height:24,width:24,borderRadius:"50%",background:"linear-gradient(135deg,#F97316,#ea580c)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <Sparkles style={{width:12,height:12,color:"#fff"}} />
              </div>
            </div>
            <div style={{textAlign:"center"}}>
              <p style={{fontSize:"0.87rem",fontWeight:700,color:"#5a3010",fontFamily:"'DM Sans',sans-serif"}}>Choose your role to begin</p>
              <p style={{fontSize:"0.75rem",color:"rgba(120,65,12,0.5)",marginTop:4,fontFamily:"'DM Sans',sans-serif"}}>Select one of the cards above to load your application form</p>
            </div>
          </div>
        );
    }
  };

  const activeRole = ROLES.find((r) => r.key === role);
  const info       = ROLE_INFO[role];
  const step       = role ? 1 : 0;
  const gradColors = role ? GRAD_COLORS[role] : null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; }

        .ap-pg {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: #f5ece1;
          position: relative;
          overflow-x: hidden;
          padding: 0;
          user-select: none;
        }
        .ap-pg::before {
          content: '';
          position: fixed;
          inset: 0;
          z-index: 0;
          background-image: radial-gradient(circle, rgba(180,100,30,0.07) 1px, transparent 1px);
          background-size: 28px 28px;
          pointer-events: none;
        }

        /* blobs */
        .ap-blob { position: fixed; border-radius: 50%; filter: blur(110px); pointer-events: none; z-index: 0; }
        .ap-b1 { width:700px;height:700px;background:radial-gradient(circle,rgba(249,115,22,0.13),transparent 60%);top:-250px;left:-200px;animation:apbp 10s ease-in-out infinite; }
        .ap-b2 { width:600px;height:600px;background:radial-gradient(circle,rgba(249,115,22,0.08),transparent 60%);bottom:-200px;right:-180px;animation:apbp 13s ease-in-out infinite 4s; }
        .ap-b3 { width:350px;height:350px;background:radial-gradient(circle,rgba(34,197,94,0.06),transparent 60%);top:20%;right:10%;animation:apbp 8s ease-in-out infinite 2s; }
        @keyframes apbp { 0%,100%{opacity:.4;transform:scale(1)} 50%{opacity:.9;transform:scale(1.1)} }

        /* wrapper */
        .ap-wrap { position: relative; z-index: 10; padding: 20px; display: flex; flex-direction: column; gap: 16px; min-height: 100vh; }
        @media (min-width: 640px) { .ap-wrap { padding: 28px 32px; gap: 20px; } }

        /* ── HEADER ── */
        .ap-header {
          background: rgba(255,255,255,0.75);
          border: 1px solid rgba(249,115,22,0.15);
          border-radius: 20px;
          backdrop-filter: blur(20px);
          box-shadow: 0 4px 24px rgba(160,80,20,0.08);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 20px;
          animation: apfup .6s ease both;
        }
        @media (min-width: 640px) { .ap-header { padding: 16px 28px; border-radius: 24px; } }
        @keyframes apfup { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }

        .ap-logo-icon {
          height: 44px; width: 44px; border-radius: 14px;
          background: linear-gradient(135deg, rgba(249,115,22,0.15), rgba(249,115,22,0.05));
          border: 1px solid rgba(249,115,22,0.2);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .ap-logo-text {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem; font-weight: 900; line-height: 1;
        }
        @media (min-width: 640px) { .ap-logo-text { font-size: 1.75rem; } }

        /* step tracker */
        .ap-steps {
          display: none;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.6);
          border: 1px solid rgba(180,100,30,0.12);
          border-radius: 999px;
          padding: 8px 18px;
          backdrop-filter: blur(8px);
        }
        @media (min-width: 768px) { .ap-steps { display: flex; } }
        .ap-step-dot {
          height: 22px; width: 22px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.65rem; font-weight: 800; color: #fff;
          transition: background 0.3s;
        }
        .ap-step-label { font-size: 0.72rem; font-weight: 700; color: #5a3010; }
        .ap-step-arrow { color: rgba(160,80,20,0.3); font-size: 0.7rem; margin: 0 2px; }

        /* ── ROLE CARDS ── */
        .ap-roles { display: grid; grid-template-columns: repeat(2,1fr); gap: 12px; animation: apfup .6s ease .1s both; }
        @media (min-width: 768px) { .ap-roles { grid-template-columns: repeat(4,1fr); } }

        .ap-role-card {
          position: relative; overflow: hidden;
          border-radius: 18px; border: 1.5px solid rgba(180,100,30,0.12);
          background: rgba(255,255,255,0.72);
          backdrop-filter: blur(16px);
          padding: 16px;
          cursor: pointer;
          transition: transform 0.18s, box-shadow 0.18s, border-color 0.18s;
          text-align: left;
          box-shadow: 0 2px 12px rgba(160,80,20,0.06);
        }
        .ap-role-card:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(160,80,20,0.13); }
        .ap-role-card.active { transform: translateY(-3px) scale(1.02); box-shadow: 0 16px 40px rgba(160,80,20,0.18); }
        .ap-role-card-bar { position: absolute; top: 0; inset-x: 0; height: 3px; border-radius: 18px 18px 0 0; }
        .ap-role-icon {
          height: 42px; width: 42px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 12px;
          transition: all 0.2s;
        }
        .ap-role-label { font-size: 0.875rem; font-weight: 800; color: #2a1206; }
        .ap-role-tag   { font-size: 0.72rem; color: rgba(120,65,12,0.55); font-weight: 500; margin-top: 2px; }
        .ap-role-check {
          position: absolute; top: 12px; right: 12px;
          height: 22px; width: 22px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 3px 10px rgba(0,0,0,0.15);
        }

        /* ── SPLIT PANEL ── */
        .ap-panel {
          display: flex;
          border-radius: 22px;
          border: 1px solid rgba(249,115,22,0.14);
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(160,80,20,0.12), 0 2px 8px rgba(160,80,20,0.06);
          flex: 1;
          animation: apfup .6s ease .2s both;
          background: rgba(255,255,255,0.6);
        }

        /* LEFT */
        .ap-left {
          display: flex; flex-direction: column;
          overflow: hidden;
          background: rgba(255,255,255,0.82);
          border-right: 1px solid rgba(249,115,22,0.1);
          backdrop-filter: blur(16px);
        }
        .ap-left-topbar {
          display: flex; align-items: center; gap: 10px;
          padding: 12px 18px; flex-shrink: 0;
          border-bottom: 1px solid rgba(249,115,22,0.1);
          background: rgba(245,236,225,0.6);
          backdrop-filter: blur(8px);
        }
        .ap-left-role-icon {
          height: 30px; width: 30px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(0,0,0,0.12);
        }
        .ap-left-title { font-size: 0.75rem; font-weight: 800; color: #2a1206; }
        .ap-left-sub   { font-size: 0.65rem; color: rgba(120,65,12,0.5); margin-top: 1px; }
        .ap-left-badge {
          margin-left: auto; flex-shrink: 0;
          font-size: 0.65rem; font-weight: 700;
          border-radius: 999px; padding: 3px 10px;
          border: 1px solid;
        }
        .ap-left-body { flex: 1; overflow: auto; padding: 20px; }

        /* DRAG HANDLE */
        .ap-drag {
          width: 8px; flex: none; cursor: col-resize;
          display: flex; align-items: center; justify-content: center;
          background: rgba(245,236,225,0.8);
          transition: background 0.15s;
        }
        .ap-drag:hover, .ap-drag.active { background: #F97316; }
        .ap-drag-dots { display: flex; flex-direction: column; gap: 4px; }
        .ap-drag-dot { width: 4px; height: 4px; border-radius: 50%; background: rgba(180,100,30,0.3); transition: background 0.15s; }
        .ap-drag:hover .ap-drag-dot, .ap-drag.active .ap-drag-dot { background: rgba(255,255,255,0.8); }

        /* RIGHT */
        .ap-right {
          overflow-y: auto;
          background: rgba(250,244,236,0.7);
          backdrop-filter: blur(12px);
        }
        .ap-right-inner { padding: 20px; display: flex; flex-direction: column; gap: 14px; }

        /* role header card in right */
        .ap-info-hero {
          position: relative; overflow: hidden;
          border-radius: 18px; padding: 18px;
        }
        .ap-info-hero-glow {
          position: absolute; right: -16px; top: -16px;
          height: 80px; width: 80px; border-radius: 50%;
          background: rgba(255,255,255,0.15); filter: blur(20px);
        }
        .ap-info-hero-icon {
          height: 42px; width: 42px; border-radius: 14px;
          background: rgba(255,255,255,0.2);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .ap-info-hero-title { font-size: 0.85rem; font-weight: 800; color: #fff; }
        .ap-info-hero-desc  { font-size: 0.72rem; color: rgba(255,255,255,0.75); margin-top: 3px; line-height: 1.5; }

        /* tips */
        .ap-tips-label {
          display: flex; align-items: center; gap: 6px;
          font-size: 0.65rem; font-weight: 800; letter-spacing: 0.12em;
          text-transform: uppercase; color: rgba(120,65,12,0.45);
        }
        .ap-tip-card {
          display: flex; align-items: flex-start; gap: 12px;
          background: rgba(255,255,255,0.75);
          border: 1px solid rgba(249,115,22,0.12);
          border-radius: 14px; padding: 12px 14px;
          backdrop-filter: blur(8px);
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .ap-tip-card:hover { border-color: rgba(249,115,22,0.25); box-shadow: 0 4px 16px rgba(160,80,20,0.08); }
        .ap-tip-icon {
          height: 28px; width: 28px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .ap-tip-step { font-size: 0.62rem; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(120,65,12,0.4); margin-bottom: 2px; }
        .ap-tip-text { font-size: 0.78rem; color: #5a3010; line-height: 1.55; }

        /* info note */
        .ap-info-note {
          display: flex; align-items: flex-start; gap: 10px;
          background: rgba(255,255,255,0.6);
          border: 1px solid rgba(249,115,22,0.2);
          border-radius: 14px; padding: 12px 14px;
          backdrop-filter: blur(8px);
        }
        .ap-info-note-text { font-size: 0.75rem; color: #7a4020; line-height: 1.6; }

        /* empty state right */
        .ap-right-empty {
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; height: 100%; gap: 16px; padding: 24px;
        }
        .ap-empty-icon-wrap { position: relative; }
        .ap-empty-icon {
          height: 64px; width: 64px; border-radius: 20px;
          background: rgba(255,255,255,0.75);
          border: 1px solid rgba(249,115,22,0.15);
          box-shadow: 0 4px 16px rgba(160,80,20,0.08);
          display: flex; align-items: center; justify-content: center;
          backdrop-filter: blur(8px);
        }
        .ap-empty-sparkle {
          position: absolute; bottom: -6px; right: -6px;
          height: 24px; width: 24px; border-radius: 50%;
          background: linear-gradient(135deg,#F97316,#ea580c);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 3px 10px rgba(249,115,22,0.3);
        }
        .ap-empty-title { font-size: 0.87rem; font-weight: 700; color: #5a3010; text-align: center; }
        .ap-empty-sub   { font-size: 0.74rem; color: rgba(120,65,12,0.5); text-align: center; margin-top: 4px; line-height: 1.5; }
        .ap-empty-chips { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-top: 4px; }
        .ap-empty-chip {
          display: flex; align-items: center; gap: 6px;
          border-radius: 999px; border: 1.5px solid;
          padding: 6px 12px; font-size: 0.72rem; font-weight: 700;
          cursor: pointer; transition: transform 0.15s, box-shadow 0.15s;
          background: rgba(255,255,255,0.7); backdrop-filter: blur(8px);
        }
        .ap-empty-chip:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(160,80,20,0.12); }
      `}</style>

      <div
        className="ap-pg"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* background blobs */}
        <div className="ap-blob ap-b1" />
        <div className="ap-blob ap-b2" />
        <div className="ap-blob ap-b3" />

        <div className="ap-wrap">

          {/* ═══════ HEADER ═══════ */}
          <div className="ap-header">
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <div className="ap-logo-icon">
                <Rocket style={{width:20,height:20,color:"#F97316"}} />
              </div>
              <div className="ap-logo-text">
                <span style={{color:"#22c55e"}}>ILM</span>
                <span style={{color:"#F97316"}}> ORA</span>
              </div>
            </div>

            {/* step tracker */}
            <div className="ap-steps">
              {STEPS.map((s, i) => (
                <React.Fragment key={s}>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <div
                      className="ap-step-dot"
                      style={{
                        background: i < step ? "#22c55e" : i === step ? "#F97316" : "rgba(180,100,30,0.18)"
                      }}
                    >
                      {i < step
                        ? <CheckCircle2 style={{width:13,height:13,color:"#fff"}} />
                        : <span style={{fontSize:"0.65rem",fontWeight:800,color:"#fff"}}>{i + 1}</span>
                      }
                    </div>
                    <span className="ap-step-label">{s}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <ChevronRight style={{width:13,height:13,color:"rgba(160,80,20,0.3)",margin:"0 2px"}} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* ═══════ ROLE SELECTOR ═══════ */}
          <div className="ap-roles">
            {ROLES.map((item) => {
              const Icon     = item.icon;
              const isActive = role === item.key;
              const gColors  = GRAD_COLORS[item.key];
              return (
                <div
                  key={item.key}
                  className={`ap-role-card${isActive ? " active" : ""}`}
                  style={{
                    borderColor: isActive ? item.border : "rgba(180,100,30,0.12)",
                    boxShadow: isActive
                      ? `0 16px 40px rgba(160,80,20,0.16), 0 0 0 2.5px ${item.ring}`
                      : undefined,
                  }}
                  onClick={() => setRole(item.key)}
                >
                  {isActive && (
                    <div
                      className="ap-role-card-bar"
                      style={{background:`linear-gradient(90deg,${gColors[0]},${gColors[1]})`}}
                    />
                  )}

                  <div
                    className="ap-role-icon"
                    style={{
                      background: isActive
                        ? `linear-gradient(135deg,${gColors[0]},${gColors[1]})`
                        : "rgba(180,100,30,0.08)",
                      boxShadow: isActive ? `0 4px 16px ${item.ring}` : undefined,
                    }}
                  >
                    <Icon style={{width:20,height:20,color: isActive ? "#fff" : "rgba(120,65,12,0.5)"}} />
                  </div>

                  <p className="ap-role-label" style={{color: isActive ? item.text : "#2a1206"}}>
                    {item.label}
                  </p>
                  <p className="ap-role-tag">{item.tagline}</p>

                  {isActive && (
                    <div
                      className="ap-role-check"
                      style={{background:`linear-gradient(135deg,${gColors[0]},${gColors[1]})`}}
                    >
                      <CheckCircle2 style={{width:13,height:13,color:"#fff"}} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ═══════ SPLIT PANEL ═══════ */}
          <div className="ap-panel" style={{height:"72vh"}}>

            {/* ── LEFT: FORM ── */}
            <div className="ap-left" style={{width:`${leftWidth}%`}}>
              {/* topbar */}
              <div className="ap-left-topbar">
                {activeRole ? (
                  <>
                    <div
                      className="ap-left-role-icon"
                      style={{background:`linear-gradient(135deg,${gradColors[0]},${gradColors[1]})`}}
                    >
                      {React.createElement(activeRole.icon, {style:{width:15,height:15,color:"#fff"}})}
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div className="ap-left-title">{info?.title}</div>
                      <div className="ap-left-sub">Fill all required fields carefully</div>
                    </div>
                    <div
                      className="ap-left-badge"
                      style={{
                        background: activeRole.softBg,
                        borderColor: activeRole.border,
                        color: activeRole.text,
                      }}
                    >
                      {activeRole.label}
                    </div>
                  </>
                ) : (
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{height:30,width:30,borderRadius:10,background:"rgba(180,100,30,0.08)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <FileText style={{width:15,height:15,color:"rgba(120,65,12,0.35)"}} />
                    </div>
                    <span className="ap-left-sub" style={{fontSize:"0.78rem",fontWeight:500}}>Application Form</span>
                  </div>
                )}
              </div>

              {/* form body */}
              <div className="ap-left-body">
                {renderForm()}
              </div>
            </div>

            {/* ── DRAG HANDLE ── */}
            <div
              className={`ap-drag${isDragging ? " active" : ""}`}
              onMouseDown={() => setIsDragging(true)}
            >
              <div className="ap-drag-dots">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="ap-drag-dot" />
                ))}
              </div>
            </div>

            {/* ── RIGHT: INFO PANEL ── */}
            <div className="ap-right" style={{width:`${100 - leftWidth}%`}}>
              {role && info && activeRole ? (
                <div className="ap-right-inner">

                  {/* role header */}
                  <div
                    className="ap-info-hero"
                    style={{background:`linear-gradient(135deg,${gradColors[0]},${gradColors[1]})`}}
                  >
                    <div className="ap-info-hero-glow" />
                    <div style={{position:"relative",display:"flex",alignItems:"center",gap:12}}>
                      <div className="ap-info-hero-icon">
                        {React.createElement(activeRole.icon, {style:{width:20,height:20,color:"#fff"}})}
                      </div>
                      <div>
                        <div className="ap-info-hero-title">{info.title}</div>
                        <div className="ap-info-hero-desc">{info.desc}</div>
                      </div>
                    </div>
                  </div>

                  {/* tips header */}
                  <div className="ap-tips-label">
                    <Lightbulb style={{width:14,height:14,color:"rgba(120,65,12,0.4)"}} />
                    Application Tips
                  </div>

                  {/* tip cards */}
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    {info.tips.map((tip, i) => {
                      const TipIcon = tip.icon;
                      return (
                        <div key={i} className="ap-tip-card">
                          <div
                            className="ap-tip-icon"
                            style={{background:`linear-gradient(135deg,${gradColors[0]},${gradColors[1]})`}}
                          >
                            <TipIcon style={{width:14,height:14,color:"#fff"}} />
                          </div>
                          <div>
                            <div className="ap-tip-step">Step {i + 1}</div>
                            <div className="ap-tip-text">{tip.text}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* info note */}
                  <div className="ap-info-note">
                    <Info style={{width:16,height:16,color:"#F97316",flexShrink:0,marginTop:1}} />
                    <div className="ap-info-note-text">
                      Applications are manually reviewed. You'll receive an email confirmation once a decision is made.
                    </div>
                  </div>

                </div>
              ) : (
                /* empty state */
                <div className="ap-right-empty">
                  <div className="ap-empty-icon-wrap">
                    <div className="ap-empty-icon">
                      <Info style={{width:28,height:28,color:"rgba(180,100,30,0.25)"}} />
                    </div>
                    <div className="ap-empty-sparkle">
                      <Sparkles style={{width:12,height:12,color:"#fff"}} />
                    </div>
                  </div>
                  <div>
                    <div className="ap-empty-title">Info Panel</div>
                    <div className="ap-empty-sub">Select a role to see<br />application tips &amp; details</div>
                  </div>
                  <div className="ap-empty-chips">
                    {ROLES.map((r) => {
                      const Icon = r.icon;
                      const gc = GRAD_COLORS[r.key];
                      return (
                        <div
                          key={r.key}
                          className="ap-empty-chip"
                          style={{borderColor: r.border, color: r.text}}
                          onClick={() => setRole(r.key)}
                        >
                          <Icon style={{width:12,height:12}} />
                          {r.label}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default ApplyForm;