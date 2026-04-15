// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   ArrowLeft, BarChart3, Download, FileText,
//   Info, Plus, TrendingUp, X, ChevronRight,
// } from "lucide-react";

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// /* ── dummy data ── */
// const reports = [];

// /* ── report type chip colours ── */
// const TYPE_CFG = {
//   enrollment: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-800",
//   completion:  "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800",
//   revenue:     "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800",
// };

// /* ── info cards ── */
// const INFO_CARDS = [
//   { icon: FileText,   label: "CSV / Excel / PDF",  desc: "Multiple export formats",   grad: "from-blue-500 to-cyan-600"     },
//   { icon: TrendingUp, label: "Stakeholder Ready",   desc: "Shareable with management", grad: "from-violet-500 to-indigo-600" },
//   { icon: BarChart3,  label: "Filterable Insights", desc: "By period, type & more",    grad: "from-amber-500 to-orange-600"  },
// ];

// /* ── report type options for the panel ── */
// const REPORT_TYPES = [
//   { value: "enrollment", label: "Enrollment",  color: "blue"    },
//   { value: "completion", label: "Completion",  color: "emerald" },
//   { value: "revenue",    label: "Revenue",     color: "amber"   },
// ];

// /* ── format options ── */
// const FORMAT_OPTIONS = ["CSV", "Excel", "PDF"];

// /* ================= MAIN ================= */
// const OrgReports = () => {
//   const navigate = useNavigate();

//   const [period,      setPeriod]      = useState("30");
//   const [filterType,  setFilterType]  = useState("all");
//   const [panelOpen,   setPanelOpen]   = useState(false);

//   /* panel form state */
//   const [reportName,  setReportName]  = useState("");
//   const [reportDesc,  setReportDesc]  = useState("");
//   const [reportType,  setReportType]  = useState("enrollment");
//   const [reportFormat,setReportFormat]= useState("CSV");

//   const openPanel  = () => setPanelOpen(true);
//   const closePanel = () => setPanelOpen(false);

//   /* ================= RENDER ================= */
//   return (
//     <div className="min-h-screen bg-[#f0f4ff] dark:bg-[#060b18] p-5">

//       {/* ── outer flex: main content + slide panel ── */}
//       <div className="flex gap-5 items-start transition-all duration-300">

//         {/* ════════════════ LEFT / MAIN COLUMN ════════════════ */}
//         <div
//           className="flex-1 min-w-0 space-y-5 transition-all duration-300"
//           style={{ maxWidth: panelOpen ? "calc(100% - 25rem)" : "100%" }}
//         >

//           {/* ── HERO ── */}
//           <div className="relative overflow-hidden rounded-2xl shadow-xl
//             bg-gradient-to-r from-[#1a56db] via-[#3b82f6] to-[#06b6d4]">
//             <div className="pointer-events-none absolute -right-12 -top-12 h-52 w-52 rounded-full bg-white/10 blur-3xl" />
//             <div className="pointer-events-none absolute right-32 bottom-[-30px] h-36 w-36 rounded-full bg-cyan-300/20 blur-2xl" />
//             <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 bg-gradient-to-r from-transparent via-white/30 to-transparent" />

//             <div className="relative flex items-center justify-between px-6 py-5">
//               <div className="flex items-center gap-4">
//                 <button
//                   onClick={() => navigate(-1)}
//                   className="flex items-center gap-1.5 rounded-xl bg-white/15 px-3 py-1.5
//                     text-sm font-medium text-white backdrop-blur-sm hover:bg-white/25 transition-all"
//                 >
//                   <ArrowLeft className="h-4 w-4" /> Back
//                 </button>
//                 <div>
//                   <h1 className="text-2xl font-bold tracking-tight text-white">Organisation Reports</h1>
//                   <p className="mt-0.5 text-sm text-blue-100/80">Download insights for management &amp; stakeholders</p>
//                 </div>
//               </div>

//               <div className="hidden md:flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-2 backdrop-blur-sm">
//                 <BarChart3 className="h-4 w-4 text-cyan-200" />
//                 <span className="text-sm font-semibold text-white">
//                   {reports.length}
//                   <span className="ml-1 font-normal text-blue-100/80">Reports</span>
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* ── FILTER + ACTION BAR ── */}
//           <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//             <div className="flex gap-2 flex-wrap">
//               <Select value={period} onValueChange={setPeriod}>
//                 <SelectTrigger className="h-9 w-40 rounded-xl bg-white dark:bg-slate-900
//                   border-slate-200 dark:border-slate-800 text-sm">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent className="rounded-xl border border-slate-200 dark:border-slate-700
//                   bg-white dark:bg-slate-900 shadow-xl z-50">
//                   <SelectItem value="30">Last 30 days</SelectItem>
//                   <SelectItem value="90">Last 90 days</SelectItem>
//                   <SelectItem value="365">This year</SelectItem>
//                 </SelectContent>
//               </Select>

//               <Select value={filterType} onValueChange={setFilterType}>
//                 <SelectTrigger className="h-9 w-44 rounded-xl bg-white dark:bg-slate-900
//                   border-slate-200 dark:border-slate-800 text-sm">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent className="rounded-xl border border-slate-200 dark:border-slate-700
//                   bg-white dark:bg-slate-900 shadow-xl z-50">
//                   <SelectItem value="all">All types</SelectItem>
//                   <SelectItem value="enrollment">Enrollment</SelectItem>
//                   <SelectItem value="completion">Completion</SelectItem>
//                   <SelectItem value="revenue">Revenue</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             <button
//               onClick={openPanel}
//               className="flex items-center gap-1.5 rounded-xl
//                 bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2
//                 text-sm font-semibold text-white shadow
//                 hover:opacity-90 hover:scale-105 transition-all self-start sm:self-auto"
//             >
//               <Plus className="h-4 w-4" /> Create Report
//             </button>
//           </div>

//           {/* ── REPORT LIST CARD ── */}
//           <Card className="overflow-hidden rounded-2xl border border-slate-200
//             dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg">

//             <CardHeader className="border-b border-slate-100 dark:border-slate-800
//               bg-slate-50/60 dark:bg-slate-900/60 px-6 py-4">
//               <div>
//                 <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-100">
//                   Generated Reports
//                 </CardTitle>
//                 <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
//                   {reports.length} report{reports.length !== 1 && "s"} available
//                 </p>
//               </div>
//             </CardHeader>

//             <CardContent className="p-4">
//               {reports.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center py-16 gap-3">
//                   <div className="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-slate-800
//                     flex items-center justify-center">
//                     <BarChart3 className="h-7 w-7 text-slate-400" />
//                   </div>
//                   <p className="text-sm font-medium text-slate-500">No reports generated</p>
//                   <p className="text-xs text-slate-400">Click "Create Report" to generate one</p>
//                 </div>
//               ) : (
//                 <div className="space-y-2">
//                   {reports.map((r) => (
//                     <div
//                       key={r.id}
//                       className="group flex items-center justify-between rounded-2xl
//                         border border-slate-100 dark:border-slate-800
//                         bg-slate-50/50 dark:bg-slate-800/40 px-5 py-4
//                         hover:border-blue-200 dark:hover:border-blue-800
//                         hover:bg-blue-50/30 dark:hover:bg-slate-800
//                         hover:shadow-md transition-all duration-200"
//                     >
//                       <div className="flex items-center gap-3">
//                         <div className="h-9 w-9 rounded-xl bg-blue-50 dark:bg-blue-950/50
//                           flex items-center justify-center shrink-0">
//                           <FileText className="h-4 w-4 text-blue-500" />
//                         </div>
//                         <div className="space-y-1">
//                           <p className="text-sm font-bold text-slate-800 dark:text-slate-100
//                             group-hover:text-blue-600 transition-colors">
//                             {r.name}
//                           </p>
//                           <div className="flex gap-2">
//                             <span className={`inline-flex items-center rounded-full border
//                               px-2.5 py-0.5 text-[11px] font-semibold ${TYPE_CFG[r.type] ?? TYPE_CFG.enrollment}`}>
//                               {r.type}
//                             </span>
//                             <span className="inline-flex items-center rounded-full border
//                               bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700
//                               px-2.5 py-0.5 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
//                               {r.format}
//                             </span>
//                           </div>
//                         </div>
//                       </div>

//                       <button
//                         className="flex items-center gap-1.5 rounded-xl
//                           bg-gradient-to-r from-blue-600 to-cyan-500 px-3 py-1.5
//                           text-xs font-semibold text-white shadow
//                           hover:opacity-90 hover:scale-105 transition-all
//                           opacity-0 group-hover:opacity-100"
//                       >
//                         <Download className="h-3.5 w-3.5" /> Download
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </CardContent>
//           </Card>

//           {/* ── INFO CARDS ── */}
//           <div className={`grid gap-4 transition-all duration-300 ${panelOpen ? "grid-cols-1 sm:grid-cols-2" : "sm:grid-cols-3"}`}>
//             {INFO_CARDS.map(({ icon: Icon, label, desc, grad }) => (
//               <div
//                 key={label}
//                 className="relative overflow-hidden rounded-2xl border border-slate-200
//                   dark:border-slate-800 bg-white dark:bg-slate-900 shadow p-5"
//               >
//                 <div className={`pointer-events-none absolute -right-4 -top-4 h-24 w-24
//                   rounded-full bg-gradient-to-br ${grad} opacity-10 blur-2xl`} />
//                 <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${grad}
//                   flex items-center justify-center mb-3 shadow-sm`}>
//                   <Icon className="h-5 w-5 text-white" />
//                 </div>
//                 <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{label}</p>
//                 <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{desc}</p>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* ════════════════ RIGHT / SLIDE PANEL ════════════════ */}
//         <div
//           className={`shrink-0 transition-all duration-300 ease-in-out overflow-hidden
//             ${panelOpen ? "w-96 opacity-100" : "w-0 opacity-0 pointer-events-none"}`}
//         >
//           <div className="w-96 rounded-2xl border border-slate-200 dark:border-slate-800
//             bg-white dark:bg-slate-900 shadow-2xl overflow-hidden">

//             {/* panel header */}
//             <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-4">
//               <div className="flex items-center justify-between mb-3">
//                 <div className="flex items-center gap-2.5">
//                   <div className="h-8 w-8 rounded-xl bg-white/20 flex items-center justify-center">
//                     <BarChart3 className="h-4 w-4 text-white" />
//                   </div>
//                   <div>
//                     <h3 className="text-sm font-bold text-white">Create Custom Report</h3>
//                     <p className="text-[11px] text-blue-100/70">Fill in the details below</p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={closePanel}
//                   className="rounded-lg bg-white/15 p-1.5 text-white hover:bg-white/25 transition-colors"
//                 >
//                   <X className="h-4 w-4" />
//                 </button>
//               </div>

//               {/* step indicator */}
//               <div className="flex items-center gap-2 mt-1">
//                 {["Report Info", "Format & Type"].map((step, i) => (
//                   <React.Fragment key={step}>
//                     <div className="flex items-center gap-1.5">
//                       <div className="h-5 w-5 rounded-full bg-white/25 flex items-center justify-center
//                         text-[10px] font-bold text-white">
//                         {i + 1}
//                       </div>
//                       <span className="text-[11px] text-white/80 font-medium">{step}</span>
//                     </div>
//                     {i < 1 && <ChevronRight className="h-3 w-3 text-white/40" />}
//                   </React.Fragment>
//                 ))}
//               </div>
//             </div>

//             {/* panel body */}
//             <div className="p-5 space-y-5">

//               {/* report name */}
//               <div className="space-y-1.5">
//                 <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
//                   Report Name
//                 </label>
//                 <Input
//                   value={reportName}
//                   onChange={(e) => setReportName(e.target.value)}
//                   placeholder="e.g. Q1 Enrollment Summary"
//                   className="h-10 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
//                 />
//               </div>

//               {/* description */}
//               <div className="space-y-1.5">
//                 <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
//                   Description <span className="normal-case font-normal">(optional)</span>
//                 </label>
//                 <Input
//                   value={reportDesc}
//                   onChange={(e) => setReportDesc(e.target.value)}
//                   placeholder="Brief description of the report"
//                   className="h-10 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
//                 />
//               </div>

//               {/* report type — vertical cards */}
//               <div className="space-y-1.5">
//                 <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
//                   Report Type
//                 </label>
//                 <div className="space-y-2">
//                   {REPORT_TYPES.map(({ value, label, color }) => {
//                     const selected = reportType === value;
//                     const colorMap = {
//                       blue:    { border: "border-blue-400",    bg: "bg-blue-50 dark:bg-blue-950/40",    text: "text-blue-700 dark:text-blue-300",    dot: "bg-blue-500"    },
//                       emerald: { border: "border-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/40", text: "text-emerald-700 dark:text-emerald-300", dot: "bg-emerald-500" },
//                       amber:   { border: "border-amber-400",   bg: "bg-amber-50 dark:bg-amber-950/40",   text: "text-amber-700 dark:text-amber-300",   dot: "bg-amber-500"   },
//                     };
//                     const c = colorMap[color];
//                     return (
//                       <button
//                         key={value}
//                         onClick={() => setReportType(value)}
//                         className={`w-full flex items-center gap-3 rounded-xl border px-4 py-3
//                           transition-all duration-150 text-left
//                           ${selected
//                             ? `${c.border} ${c.bg} shadow-sm`
//                             : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-slate-300"
//                           }`}
//                       >
//                         <div className={`h-2.5 w-2.5 rounded-full ${c.dot} shrink-0 ${selected ? "opacity-100" : "opacity-30"}`} />
//                         <span className={`text-sm font-semibold ${selected ? c.text : "text-slate-500 dark:text-slate-400"}`}>
//                           {label}
//                         </span>
//                         {selected && (
//                           <span className={`ml-auto text-[10px] font-bold uppercase tracking-wider ${c.text}`}>
//                             Selected
//                           </span>
//                         )}
//                       </button>
//                     );
//                   })}
//                 </div>
//               </div>

//               {/* format */}
//               <div className="space-y-1.5">
//                 <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
//                   Export Format
//                 </label>
//                 <div className="flex gap-2">
//                   {FORMAT_OPTIONS.map((fmt) => (
//                     <button
//                       key={fmt}
//                       onClick={() => setReportFormat(fmt)}
//                       className={`flex-1 rounded-xl border py-2 text-xs font-semibold transition-all
//                         ${reportFormat === fmt
//                           ? "border-blue-400 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300"
//                           : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500 hover:border-slate-300"
//                         }`}
//                     >
//                       {fmt}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* footer actions */}
//               <div className="flex justify-end gap-2 pt-1">
//                 <button
//                   onClick={closePanel}
//                   className="px-4 py-2 rounded-xl text-sm font-medium
//                     bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300
//                     hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className="flex items-center gap-1.5 px-5 py-2 rounded-xl
//                     text-sm font-semibold text-white shadow
//                     bg-gradient-to-r from-blue-600 to-cyan-500
//                     hover:opacity-90 hover:scale-105 transition-all"
//                 >
//                   <Plus className="h-4 w-4" /> Create
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>{/* end outer flex */}
//     </div>
//   );
// };

// export default OrgReports;

















import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BarChart3, Download, FileText, Info, Plus, TrendingUp, X, ChevronRight } from "lucide-react";

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
:root{--bg:#f1f5f9;--card:#ffffff;--tx:#0f172a;--mu:#64748b;--bd:#e2e8f0;--c1:#22d3ee;--c2:#fb923c;--c3:#34d399;--c4:#a78bfa;--cr:#f87171;--sh:0 4px 24px rgba(0,0,0,0.06);--shl:0 8px 40px rgba(0,0,0,0.10);--r:20px;}
.or-dk{--bg:#0a0a0a;--card:#111111;--tx:#ffffff;--mu:#94a3b8;--bd:rgba(255,255,255,0.06);--sh:0 4px 24px rgba(0,0,0,0.40);--shl:0 8px 40px rgba(0,0,0,0.60);}
.or{font-family:'Poppins',sans-serif;min-height:100vh;background:var(--bg);color:var(--tx);padding:24px;box-sizing:border-box;}
.or-outer{max-width:1300px;margin:0 auto;display:flex;gap:20px;align-items:flex-start;}
.or-main{flex:1;min-width:0;display:flex;flex-direction:column;gap:20px;}
.or-hdr{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);padding:24px 28px;box-shadow:var(--sh);display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;}
.or-hdr-l{display:flex;align-items:center;gap:14px;}
.or-back{display:inline-flex;align-items:center;gap:6px;padding:9px 14px;border-radius:12px;border:1px solid var(--bd);background:var(--bg);color:var(--mu);font-family:'Poppins',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:border-color .2s,color .2s;flex-shrink:0;}
.or-back:hover{border-color:rgba(34,211,238,.35);color:var(--c1);}
.or-hdr-ico{width:52px;height:52px;border-radius:14px;background:rgba(34,211,238,.10);border:1px solid rgba(34,211,238,.18);display:flex;align-items:center;justify-content:center;color:var(--c1);flex-shrink:0;}
.or-bdg{display:inline-flex;align-items:center;gap:6px;padding:4px 11px;border-radius:50px;border:1px solid var(--bd);background:rgba(34,211,238,.08);color:var(--c1);font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;margin-bottom:6px;}
.or-h1{font-size:22px;font-weight:800;color:var(--tx);margin:0 0 2px;}
.or-sub{font-size:13px;color:var(--mu);margin:0;}
.or-chip{display:flex;align-items:center;gap:7px;padding:10px 18px;border-radius:13px;background:var(--bg);border:1px solid var(--bd);font-size:13px;font-weight:700;white-space:nowrap;box-shadow:var(--sh);}
.or-fbar{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;}
.or-selects{display:flex;gap:8px;flex-wrap:wrap;}
.or-sel{padding:9px 13px;border-radius:12px;border:1px solid var(--bd);background:var(--card);color:var(--tx);font-family:'Poppins',sans-serif;font-size:13px;outline:none;cursor:pointer;transition:border-color .2s;}
.or-sel:focus{border-color:var(--c1);}
.or-create-btn{display:inline-flex;align-items:center;gap:6px;padding:10px 20px;border-radius:13px;border:none;background:var(--c1);color:#0a0a0a;font-family:'Poppins',sans-serif;font-size:13px;font-weight:800;cursor:pointer;transition:opacity .2s,transform .15s;}
.or-create-btn:hover{opacity:.87;transform:translateY(-1px);}
.or-list-card{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);box-shadow:var(--sh);overflow:hidden;}
.or-lh{display:flex;align-items:center;justify-content:space-between;padding:14px 22px;border-bottom:1px solid var(--bd);background:var(--bg);}
.or-lh-title{font-size:13px;font-weight:700;color:var(--tx);margin:0 0 2px;}
.or-lh-sub{font-size:11px;color:var(--mu);margin:0;}
.or-lb{padding:16px;}
.or-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 20px;gap:12px;text-align:center;}
.or-empty-ico{width:52px;height:52px;border-radius:15px;background:rgba(34,211,238,.08);border:1px solid rgba(34,211,238,.15);display:flex;align-items:center;justify-content:center;color:var(--c1);}
.or-empty-t{font-size:14px;font-weight:700;color:var(--tx);margin:0 0 4px;}
.or-empty-s{font-size:12px;color:var(--mu);margin:0;}
.or-ritem{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 16px;border-radius:14px;border:1px solid var(--bd);background:var(--bg);margin-bottom:8px;transition:all .2s;}
.or-ritem:last-child{margin-bottom:0;}
.or-ritem:hover{border-color:rgba(34,211,238,.25);box-shadow:var(--sh);}
.or-ritem-l{display:flex;align-items:center;gap:10px;}
.or-ritem-ico{width:36px;height:36px;border-radius:10px;background:rgba(34,211,238,.10);display:flex;align-items:center;justify-content:center;color:var(--c1);flex-shrink:0;}
.or-ritem-name{font-size:13px;font-weight:700;color:var(--tx);margin:0 0 4px;transition:color .15s;}
.or-ritem:hover .or-ritem-name{color:var(--c1);}
.or-ritem-tags{display:flex;gap:6px;}
.or-rtag{display:inline-flex;padding:3px 9px;border-radius:7px;font-size:11px;font-weight:700;border:1px solid;}
.or-dl-btn{display:inline-flex;align-items:center;gap:5px;padding:7px 13px;border-radius:10px;border:none;background:var(--c1);color:#0a0a0a;font-family:'Poppins',sans-serif;font-size:11px;font-weight:700;cursor:pointer;opacity:0;transition:opacity .15s,transform .15s;}
.or-ritem:hover .or-dl-btn{opacity:1;}
.or-dl-btn:hover{transform:translateY(-1px);}
.or-info-grid{display:grid;gap:14px;}
.or-info-card{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);padding:20px;box-shadow:var(--sh);}
.or-info-ico{width:40px;height:40px;border-radius:12px;display:flex;align-items:center;justify-content:center;margin-bottom:12px;}
.or-info-title{font-size:13px;font-weight:800;color:var(--tx);margin:0 0 4px;}
.or-info-desc{font-size:12px;color:var(--mu);margin:0;}
/* panel */
.or-panel{flex-shrink:0;width:380px;background:var(--card);border:1px solid var(--bd);border-radius:var(--r);box-shadow:var(--shl);overflow:hidden;transition:all .3s;}
.or-ph{padding:18px 20px;background:rgba(34,211,238,.06);border-bottom:1px solid var(--bd);}
.or-ph-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;}
.or-ph-l{display:flex;align-items:center;gap:10px;}
.or-ph-ico{width:36px;height:36px;border-radius:10px;background:rgba(34,211,238,.12);border:1px solid rgba(34,211,238,.20);display:flex;align-items:center;justify-content:center;color:var(--c1);}
.or-ph-title{font-size:14px;font-weight:800;color:var(--tx);margin:0 0 2px;}
.or-ph-sub{font-size:11px;color:var(--mu);margin:0;}
.or-xbtn{width:30px;height:30px;border-radius:9px;border:1px solid var(--bd);background:var(--bg);color:var(--mu);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .15s;}
.or-xbtn:hover{border-color:rgba(248,113,113,.30);color:var(--cr);}
.or-steps{display:flex;align-items:center;gap:8px;}
.or-step-item{display:flex;align-items:center;gap:5px;}
.or-step-num{width:20px;height:20px;border-radius:50%;background:rgba(34,211,238,.15);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:800;color:var(--c1);}
.or-step-label{font-size:11px;color:rgba(255,255,255,.7);font-weight:500;}
.or-pb{padding:20px;display:flex;flex-direction:column;gap:14px;}
.or-field label{display:block;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--mu);margin-bottom:5px;}
.or-inp{width:100%;padding:10px 12px;border-radius:12px;border:1px solid var(--bd);background:var(--bg);color:var(--tx);font-family:'Poppins',sans-serif;font-size:13px;outline:none;box-sizing:border-box;transition:border-color .2s,box-shadow .2s;}
.or-inp:focus{border-color:var(--c1);box-shadow:0 0 0 3px rgba(34,211,238,.12);}
.or-inp::placeholder{color:var(--mu);}
.or-type-btn{width:100%;display:flex;align-items:center;gap:10px;padding:11px 13px;border-radius:12px;border:1px solid var(--bd);background:transparent;font-family:'Poppins',sans-serif;font-size:12px;font-weight:600;cursor:pointer;transition:all .15s;text-align:left;margin-bottom:7px;}
.or-type-btn:last-child{margin-bottom:0;}
.or-fmt-row{display:flex;gap:6px;}
.or-fmt-btn{flex:1;padding:8px;border-radius:10px;border:1px solid var(--bd);background:transparent;font-family:'Poppins',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:all .15s;color:var(--mu);}
.or-fmt-btn.on{border-color:rgba(34,211,238,.40);background:rgba(34,211,238,.08);color:var(--c1);}
.or-pf{display:flex;justify-content:flex-end;gap:8px;padding:14px 20px;border-top:1px solid var(--bd);}
.or-cancel{padding:9px 16px;border-radius:11px;border:1px solid var(--bd);background:var(--bg);color:var(--mu);font-family:'Poppins',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:all .15s;}
.or-cancel:hover{border-color:rgba(34,211,238,.30);color:var(--c1);}
.or-submit{display:inline-flex;align-items:center;gap:6px;padding:9px 20px;border-radius:11px;border:none;background:var(--c1);color:#0a0a0a;font-family:'Poppins',sans-serif;font-size:12px;font-weight:800;cursor:pointer;transition:opacity .2s,transform .15s;}
.or-submit:hover{opacity:.87;transform:translateY(-1px);}
`;
if(!document.getElementById("or-st")){const t=document.createElement("style");t.id="or-st";t.textContent=STYLES;document.head.appendChild(t);}
const isDark=()=>document.documentElement.classList.contains("dark")||document.body.classList.contains("dark")||window.matchMedia("(prefers-color-scheme: dark)").matches;

const reports=[];
const TYPE_TAGS={enrollment:{bg:"rgba(34,211,238,.10)",color:"var(--c1)",bd:"rgba(34,211,238,.20)"},completion:{bg:"rgba(52,211,153,.10)",color:"var(--c3)",bd:"rgba(52,211,153,.20)"},revenue:{bg:"rgba(251,146,60,.10)",color:"var(--c2)",bd:"rgba(251,146,60,.20)"}};
const INFO_CARDS=[{icon:FileText,label:"CSV / Excel / PDF",desc:"Multiple export formats",accent:"var(--c1)",bg:"rgba(34,211,238,.10)"},{icon:TrendingUp,label:"Stakeholder Ready",desc:"Shareable with management",accent:"var(--c4)",bg:"rgba(167,139,250,.10)"},{icon:BarChart3,label:"Filterable Insights",desc:"By period, type & more",accent:"var(--c2)",bg:"rgba(251,146,60,.10)"}];
const REPORT_TYPES=[{value:"enrollment",label:"Enrollment",accent:"var(--c1)",bg:"rgba(34,211,238,.08)",bd:"rgba(34,211,238,.25)"},{value:"completion",label:"Completion",accent:"var(--c3)",bg:"rgba(52,211,153,.08)",bd:"rgba(52,211,153,.25)"},{value:"revenue",label:"Revenue",accent:"var(--c2)",bg:"rgba(251,146,60,.08)",bd:"rgba(251,146,60,.25)"}];
const FORMAT_OPTIONS=["CSV","Excel","PDF"];

const OrgReports=()=>{
  const navigate=useNavigate();
  const[dark,setDark]=useState(isDark);
  const[period,setPeriod]=useState("30");
  const[filterType,setFilterType]=useState("all");
  const[panelOpen,setPanelOpen]=useState(false);
  const[reportName,setReportName]=useState("");
  const[reportDesc,setReportDesc]=useState("");
  const[reportType,setReportType]=useState("enrollment");
  const[reportFormat,setReportFormat]=useState("CSV");

  React.useEffect(()=>{const o=new MutationObserver(()=>setDark(isDark()));o.observe(document.documentElement,{attributes:true,attributeFilter:["class"]});o.observe(document.body,{attributes:true,attributeFilter:["class"]});return()=>o.disconnect();},[]);

  return(
    <div className={`or${dark?" or-dk":""}`}>
      <div className="or-outer">
        <div className="or-main">
          <div className="or-hdr">
            <div className="or-hdr-l">
              <button className="or-back" onClick={()=>navigate(-1)}><ArrowLeft size={14}/> Back</button>
              <div className="or-hdr-ico"><BarChart3 size={24}/></div>
              <div>
                <div className="or-bdg"><BarChart3 size={10}/> Reports</div>
                <h1 className="or-h1">Organisation Reports</h1>
                <p className="or-sub">Download insights for management & stakeholders</p>
              </div>
            </div>
            <div className="or-chip"><BarChart3 size={14} style={{color:"var(--c1)"}}/><span style={{fontWeight:800,color:"var(--c1)"}}>{reports.length}</span><span style={{color:"var(--mu)",fontWeight:500}}>Reports</span></div>
          </div>

          <div className="or-fbar">
            <div className="or-selects">
              <select className="or-sel" value={period} onChange={e=>setPeriod(e.target.value)}>
                <option value="30">Last 30 days</option><option value="90">Last 90 days</option><option value="365">This year</option>
              </select>
              <select className="or-sel" value={filterType} onChange={e=>setFilterType(e.target.value)}>
                <option value="all">All types</option><option value="enrollment">Enrollment</option><option value="completion">Completion</option><option value="revenue">Revenue</option>
              </select>
            </div>
            <button className="or-create-btn" onClick={()=>setPanelOpen(true)}><Plus size={15}/> Create Report</button>
          </div>

          <div className="or-list-card">
            <div className="or-lh">
              <div><p className="or-lh-title">Generated Reports</p><p className="or-lh-sub">{reports.length} report{reports.length!==1&&"s"} available</p></div>
            </div>
            <div className="or-lb">
              {reports.length===0?(
                <div className="or-empty">
                  <div className="or-empty-ico"><BarChart3 size={24}/></div>
                  <p className="or-empty-t">No reports generated</p>
                  <p className="or-empty-s">Click "Create Report" to generate one</p>
                </div>
              ):reports.map(r=>{const tc=TYPE_TAGS[r.type]||TYPE_TAGS.enrollment;return(
                <div key={r.id} className="or-ritem">
                  <div className="or-ritem-l">
                    <div className="or-ritem-ico"><FileText size={16}/></div>
                    <div><p className="or-ritem-name">{r.name}</p><div className="or-ritem-tags"><span className="or-rtag" style={{background:tc.bg,color:tc.color,borderColor:tc.bd}}>{r.type}</span><span className="or-rtag" style={{background:"var(--bg)",color:"var(--mu)",borderColor:"var(--bd)"}}>{r.format}</span></div></div>
                  </div>
                  <button className="or-dl-btn"><Download size={13}/> Download</button>
                </div>
              );})}
            </div>
          </div>

          <div className="or-info-grid" style={{gridTemplateColumns:`repeat(${panelOpen?2:3},1fr)`}}>
            {INFO_CARDS.map(({icon:Icon,label,desc,accent,bg})=>(
              <div key={label} className="or-info-card">
                <div className="or-info-ico" style={{background:bg,color:accent}}><Icon size={20}/></div>
                <p className="or-info-title">{label}</p>
                <p className="or-info-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {panelOpen&&(
          <div className="or-panel">
            <div className="or-ph">
              <div className="or-ph-row">
                <div className="or-ph-l">
                  <div className="or-ph-ico"><BarChart3 size={17}/></div>
                  <div><p className="or-ph-title">Create Custom Report</p><p className="or-ph-sub">Fill in the details below</p></div>
                </div>
                <button className="or-xbtn" onClick={()=>setPanelOpen(false)}><X size={14}/></button>
              </div>
              <div className="or-steps">
                {["Report Info","Format & Type"].map((s,i)=>(
                  <React.Fragment key={s}>
                    <div className="or-step-item"><div className="or-step-num">{i+1}</div><span style={{fontSize:11,color:"var(--mu)",fontWeight:500}}>{s}</span></div>
                    {i<1&&<ChevronRight size={13} style={{color:"var(--bd)"}}/>}
                  </React.Fragment>
                ))}
              </div>
            </div>
            <div className="or-pb">
              <div className="or-field"><label>Report Name</label><input className="or-inp" value={reportName} onChange={e=>setReportName(e.target.value)} placeholder="e.g. Q1 Enrollment Summary"/></div>
              <div className="or-field"><label>Description <span style={{textTransform:"none",fontWeight:400}}>(optional)</span></label><input className="or-inp" value={reportDesc} onChange={e=>setReportDesc(e.target.value)} placeholder="Brief description"/></div>
              <div className="or-field">
                <label>Report Type</label>
                {REPORT_TYPES.map(({value,label,accent,bg,bd})=>{const sel=reportType===value;return(
                  <button key={value} className={`or-type-btn`} style={sel?{borderColor:bd,background:bg,color:accent}:{}} onClick={()=>setReportType(value)}>
                    <span style={{width:8,height:8,borderRadius:"50%",background:accent,opacity:sel?1:.3,flexShrink:0}}/>
                    <span style={{fontSize:13,fontWeight:600,color:sel?accent:"var(--mu)"}}>{label}</span>
                    {sel&&<span style={{marginLeft:"auto",fontSize:10,fontWeight:800,color:accent}}>Selected</span>}
                  </button>
                );})}
              </div>
              <div className="or-field">
                <label>Export Format</label>
                <div className="or-fmt-row">
                  {FORMAT_OPTIONS.map(f=><button key={f} className={`or-fmt-btn${reportFormat===f?" on":""}`} onClick={()=>setReportFormat(f)}>{f}</button>)}
                </div>
              </div>
            </div>
            <div className="or-pf">
              <button className="or-cancel" onClick={()=>setPanelOpen(false)}>Cancel</button>
              <button className="or-submit"><Plus size={14}/> Create</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default OrgReports;