// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   ArrowLeft, BarChart3, Download, FileText,
//   Info, Plus, TrendingUp, X,
// } from "lucide-react";

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// /* ── dummy data (unchanged) ── */
// const reports = [];

// /* ── report type chip colours ── */
// const TYPE_CFG = {
//   enrollment: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-800",
//   completion: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800",
//   revenue:    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800",
// };

// /* ── info cards ── */
// const INFO_CARDS = [
//   { icon: FileText,   label: "CSV / Excel / PDF",   desc: "Multiple export formats",         grad: "from-blue-500 to-cyan-600"    },
//   { icon: TrendingUp, label: "Stakeholder Ready",    desc: "Shareable with management",       grad: "from-violet-500 to-indigo-600" },
//   { icon: BarChart3,  label: "Filterable Insights",  desc: "By period, type & more",          grad: "from-amber-500 to-orange-600"  },
// ];

// /* ================= MAIN ================= */
// const OrgReports = () => {
//   const navigate = useNavigate();

//   const [period, setPeriod] = useState("30");
//   const [type, setType]     = useState("all");
//   const [open, setOpen]     = useState(false);

//   /* ================= RENDER ================= */
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
//               <h1 className="text-2xl font-bold tracking-tight text-white">Organisation Reports</h1>
//               <p className="mt-0.5 text-sm text-blue-100/80">Download insights for management &amp; stakeholders</p>
//             </div>
//           </div>

//           <div className="hidden md:flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-2 backdrop-blur-sm">
//             <BarChart3 className="h-4 w-4 text-cyan-200" />
//             <span className="text-sm font-semibold text-white">
//               {reports.length}
//               <span className="ml-1 font-normal text-blue-100/80">Reports</span>
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* ═══════ FILTER + ACTION BAR ═══════ */}
//       <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

//         <div className="flex gap-2 flex-wrap">
//           <Select value={period} onValueChange={setPeriod}>
//             <SelectTrigger className="h-9 w-40 rounded-xl bg-white dark:bg-slate-900
//               border-slate-200 dark:border-slate-800 text-sm">
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent className="rounded-xl border border-slate-200 dark:border-slate-700
//               bg-white dark:bg-slate-900 shadow-xl z-50">
//               <SelectItem value="30">Last 30 days</SelectItem>
//               <SelectItem value="90">Last 90 days</SelectItem>
//               <SelectItem value="365">This year</SelectItem>
//             </SelectContent>
//           </Select>

//           <Select value={type} onValueChange={setType}>
//             <SelectTrigger className="h-9 w-44 rounded-xl bg-white dark:bg-slate-900
//               border-slate-200 dark:border-slate-800 text-sm">
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent className="rounded-xl border border-slate-200 dark:border-slate-700
//               bg-white dark:bg-slate-900 shadow-xl z-50">
//               <SelectItem value="all">All types</SelectItem>
//               <SelectItem value="enrollment">Enrollment</SelectItem>
//               <SelectItem value="completion">Completion</SelectItem>
//               <SelectItem value="revenue">Revenue</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         <button
//           onClick={() => setOpen(true)}
//           className="flex items-center gap-1.5 rounded-xl
//             bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2
//             text-sm font-semibold text-white shadow
//             hover:opacity-90 hover:scale-105 transition-all self-start sm:self-auto"
//         >
//           <Plus className="h-4 w-4" /> Create Report
//         </button>
//       </div>

//       {/* ═══════ REPORT LIST CARD ═══════ */}
//       <Card className="overflow-hidden rounded-2xl border border-slate-200
//         dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg">

//         <CardHeader className="border-b border-slate-100 dark:border-slate-800
//           bg-slate-50/60 dark:bg-slate-900/60 px-6 py-4">
//           <div>
//             <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-100">
//               Generated Reports
//             </CardTitle>
//             <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
//               {reports.length} report{reports.length !== 1 && "s"} available
//             </p>
//           </div>
//         </CardHeader>

//         <CardContent className="p-4">
//           {reports.length === 0 ? (
//             <div className="flex flex-col items-center justify-center py-16 gap-3">
//               <div className="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-slate-800
//                 flex items-center justify-center">
//                 <BarChart3 className="h-7 w-7 text-slate-400" />
//               </div>
//               <p className="text-sm font-medium text-slate-500">No reports generated</p>
//               <p className="text-xs text-slate-400">Click "Create Report" to generate one</p>
//             </div>
//           ) : (
//             <div className="space-y-2">
//               {reports.map((r) => (
//                 <div
//                   key={r.id}
//                   className="group flex items-center justify-between rounded-2xl
//                     border border-slate-100 dark:border-slate-800
//                     bg-slate-50/50 dark:bg-slate-800/40 px-5 py-4
//                     hover:border-blue-200 dark:hover:border-blue-800
//                     hover:bg-blue-50/30 dark:hover:bg-slate-800
//                     hover:shadow-md transition-all duration-200"
//                 >
//                   <div className="flex items-center gap-3">
//                     <div className="h-9 w-9 rounded-xl bg-blue-50 dark:bg-blue-950/50
//                       flex items-center justify-center shrink-0">
//                       <FileText className="h-4 w-4 text-blue-500" />
//                     </div>
//                     <div className="space-y-1">
//                       <p className="text-sm font-bold text-slate-800 dark:text-slate-100
//                         group-hover:text-blue-600 transition-colors">
//                         {r.name}
//                       </p>
//                       <div className="flex gap-2">
//                         <span className={`inline-flex items-center rounded-full border
//                           px-2.5 py-0.5 text-[11px] font-semibold ${TYPE_CFG[r.type] ?? TYPE_CFG.enrollment}`}>
//                           {r.type}
//                         </span>
//                         <span className="inline-flex items-center rounded-full border
//                           bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700
//                           px-2.5 py-0.5 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
//                           {r.format}
//                         </span>
//                       </div>
//                     </div>
//                   </div>

//                   <button
//                     className="flex items-center gap-1.5 rounded-xl
//                       bg-gradient-to-r from-blue-600 to-cyan-500 px-3 py-1.5
//                       text-xs font-semibold text-white shadow
//                       hover:opacity-90 hover:scale-105 transition-all
//                       opacity-0 group-hover:opacity-100"
//                   >
//                     <Download className="h-3.5 w-3.5" /> Download
//                   </button>
//                 </div>
//               ))}
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* ═══════ INFO CARDS ═══════ */}
//       <div className="grid gap-4 sm:grid-cols-3">
//         {INFO_CARDS.map(({ icon: Icon, label, desc, grad }) => (
//           <div
//             key={label}
//             className="relative overflow-hidden rounded-2xl border border-slate-200
//               dark:border-slate-800 bg-white dark:bg-slate-900 shadow p-5"
//           >
//             <div className={`pointer-events-none absolute -right-4 -top-4 h-24 w-24
//               rounded-full bg-gradient-to-br ${grad} opacity-10 blur-2xl`} />
//             <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${grad}
//               flex items-center justify-center mb-3 shadow-sm`}>
//               <Icon className="h-5 w-5 text-white" />
//             </div>
//             <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{label}</p>
//             <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{desc}</p>
//           </div>
//         ))}
//       </div>

//       {/* ═══════ MODAL ═══════ */}
//       {open && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center
//           bg-black/50 backdrop-blur-md">

//           <div className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden
//             bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">

//             {/* header */}
//             <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-4">
//               <div className="flex items-center justify-between">
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
//                   onClick={() => setOpen(false)}
//                   className="rounded-lg bg-white/15 p-1.5 text-white hover:bg-white/25 transition-colors"
//                 >
//                   <X className="h-4 w-4" />
//                 </button>
//               </div>
//             </div>

//             {/* body */}
//             <div className="p-5 space-y-4">
//               <div className="space-y-1.5">
//                 <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Report Name</label>
//                 <Input
//                   placeholder="e.g. Q1 Enrollment Summary"
//                   className="h-10 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
//                 />
//               </div>

//               <div className="space-y-1.5">
//                 <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Description <span className="normal-case font-normal">(optional)</span></label>
//                 <Input
//                   placeholder="Brief description of the report"
//                   className="h-10 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
//                 />
//               </div>

//               <div className="flex justify-end gap-2 pt-1">
//                 <button
//                   onClick={() => setOpen(false)}
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
//       )}
//     </div>
//   );
// };

// export default OrgReports;











import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, BarChart3, Download, FileText,
  Info, Plus, TrendingUp, X, ChevronRight,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/* ── dummy data ── */
const reports = [];

/* ── report type chip colours ── */
const TYPE_CFG = {
  enrollment: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-800",
  completion:  "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800",
  revenue:     "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800",
};

/* ── info cards ── */
const INFO_CARDS = [
  { icon: FileText,   label: "CSV / Excel / PDF",  desc: "Multiple export formats",   grad: "from-blue-500 to-cyan-600"     },
  { icon: TrendingUp, label: "Stakeholder Ready",   desc: "Shareable with management", grad: "from-violet-500 to-indigo-600" },
  { icon: BarChart3,  label: "Filterable Insights", desc: "By period, type & more",    grad: "from-amber-500 to-orange-600"  },
];

/* ── report type options for the panel ── */
const REPORT_TYPES = [
  { value: "enrollment", label: "Enrollment",  color: "blue"    },
  { value: "completion", label: "Completion",  color: "emerald" },
  { value: "revenue",    label: "Revenue",     color: "amber"   },
];

/* ── format options ── */
const FORMAT_OPTIONS = ["CSV", "Excel", "PDF"];

/* ================= MAIN ================= */
const OrgReports = () => {
  const navigate = useNavigate();

  const [period,      setPeriod]      = useState("30");
  const [filterType,  setFilterType]  = useState("all");
  const [panelOpen,   setPanelOpen]   = useState(false);

  /* panel form state */
  const [reportName,  setReportName]  = useState("");
  const [reportDesc,  setReportDesc]  = useState("");
  const [reportType,  setReportType]  = useState("enrollment");
  const [reportFormat,setReportFormat]= useState("CSV");

  const openPanel  = () => setPanelOpen(true);
  const closePanel = () => setPanelOpen(false);

  /* ================= RENDER ================= */
  return (
    <div className="min-h-screen bg-[#f0f4ff] dark:bg-[#060b18] p-5">

      {/* ── outer flex: main content + slide panel ── */}
      <div className="flex gap-5 items-start transition-all duration-300">

        {/* ════════════════ LEFT / MAIN COLUMN ════════════════ */}
        <div
          className="flex-1 min-w-0 space-y-5 transition-all duration-300"
          style={{ maxWidth: panelOpen ? "calc(100% - 25rem)" : "100%" }}
        >

          {/* ── HERO ── */}
          <div className="relative overflow-hidden rounded-2xl shadow-xl
            bg-gradient-to-r from-[#1a56db] via-[#3b82f6] to-[#06b6d4]">
            <div className="pointer-events-none absolute -right-12 -top-12 h-52 w-52 rounded-full bg-white/10 blur-3xl" />
            <div className="pointer-events-none absolute right-32 bottom-[-30px] h-36 w-36 rounded-full bg-cyan-300/20 blur-2xl" />
            <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 bg-gradient-to-r from-transparent via-white/30 to-transparent" />

            <div className="relative flex items-center justify-between px-6 py-5">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-1.5 rounded-xl bg-white/15 px-3 py-1.5
                    text-sm font-medium text-white backdrop-blur-sm hover:bg-white/25 transition-all"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-white">Organisation Reports</h1>
                  <p className="mt-0.5 text-sm text-blue-100/80">Download insights for management &amp; stakeholders</p>
                </div>
              </div>

              <div className="hidden md:flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-2 backdrop-blur-sm">
                <BarChart3 className="h-4 w-4 text-cyan-200" />
                <span className="text-sm font-semibold text-white">
                  {reports.length}
                  <span className="ml-1 font-normal text-blue-100/80">Reports</span>
                </span>
              </div>
            </div>
          </div>

          {/* ── FILTER + ACTION BAR ── */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2 flex-wrap">
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="h-9 w-40 rounded-xl bg-white dark:bg-slate-900
                  border-slate-200 dark:border-slate-800 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border border-slate-200 dark:border-slate-700
                  bg-white dark:bg-slate-900 shadow-xl z-50">
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                  <SelectItem value="365">This year</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="h-9 w-44 rounded-xl bg-white dark:bg-slate-900
                  border-slate-200 dark:border-slate-800 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border border-slate-200 dark:border-slate-700
                  bg-white dark:bg-slate-900 shadow-xl z-50">
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="enrollment">Enrollment</SelectItem>
                  <SelectItem value="completion">Completion</SelectItem>
                  <SelectItem value="revenue">Revenue</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <button
              onClick={openPanel}
              className="flex items-center gap-1.5 rounded-xl
                bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2
                text-sm font-semibold text-white shadow
                hover:opacity-90 hover:scale-105 transition-all self-start sm:self-auto"
            >
              <Plus className="h-4 w-4" /> Create Report
            </button>
          </div>

          {/* ── REPORT LIST CARD ── */}
          <Card className="overflow-hidden rounded-2xl border border-slate-200
            dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg">

            <CardHeader className="border-b border-slate-100 dark:border-slate-800
              bg-slate-50/60 dark:bg-slate-900/60 px-6 py-4">
              <div>
                <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  Generated Reports
                </CardTitle>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {reports.length} report{reports.length !== 1 && "s"} available
                </p>
              </div>
            </CardHeader>

            <CardContent className="p-4">
              {reports.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <div className="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-slate-800
                    flex items-center justify-center">
                    <BarChart3 className="h-7 w-7 text-slate-400" />
                  </div>
                  <p className="text-sm font-medium text-slate-500">No reports generated</p>
                  <p className="text-xs text-slate-400">Click "Create Report" to generate one</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {reports.map((r) => (
                    <div
                      key={r.id}
                      className="group flex items-center justify-between rounded-2xl
                        border border-slate-100 dark:border-slate-800
                        bg-slate-50/50 dark:bg-slate-800/40 px-5 py-4
                        hover:border-blue-200 dark:hover:border-blue-800
                        hover:bg-blue-50/30 dark:hover:bg-slate-800
                        hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-blue-50 dark:bg-blue-950/50
                          flex items-center justify-center shrink-0">
                          <FileText className="h-4 w-4 text-blue-500" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-100
                            group-hover:text-blue-600 transition-colors">
                            {r.name}
                          </p>
                          <div className="flex gap-2">
                            <span className={`inline-flex items-center rounded-full border
                              px-2.5 py-0.5 text-[11px] font-semibold ${TYPE_CFG[r.type] ?? TYPE_CFG.enrollment}`}>
                              {r.type}
                            </span>
                            <span className="inline-flex items-center rounded-full border
                              bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700
                              px-2.5 py-0.5 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                              {r.format}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        className="flex items-center gap-1.5 rounded-xl
                          bg-gradient-to-r from-blue-600 to-cyan-500 px-3 py-1.5
                          text-xs font-semibold text-white shadow
                          hover:opacity-90 hover:scale-105 transition-all
                          opacity-0 group-hover:opacity-100"
                      >
                        <Download className="h-3.5 w-3.5" /> Download
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* ── INFO CARDS ── */}
          <div className={`grid gap-4 transition-all duration-300 ${panelOpen ? "grid-cols-1 sm:grid-cols-2" : "sm:grid-cols-3"}`}>
            {INFO_CARDS.map(({ icon: Icon, label, desc, grad }) => (
              <div
                key={label}
                className="relative overflow-hidden rounded-2xl border border-slate-200
                  dark:border-slate-800 bg-white dark:bg-slate-900 shadow p-5"
              >
                <div className={`pointer-events-none absolute -right-4 -top-4 h-24 w-24
                  rounded-full bg-gradient-to-br ${grad} opacity-10 blur-2xl`} />
                <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${grad}
                  flex items-center justify-center mb-3 shadow-sm`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{label}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ════════════════ RIGHT / SLIDE PANEL ════════════════ */}
        <div
          className={`shrink-0 transition-all duration-300 ease-in-out overflow-hidden
            ${panelOpen ? "w-96 opacity-100" : "w-0 opacity-0 pointer-events-none"}`}
        >
          <div className="w-96 rounded-2xl border border-slate-200 dark:border-slate-800
            bg-white dark:bg-slate-900 shadow-2xl overflow-hidden">

            {/* panel header */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-white/20 flex items-center justify-center">
                    <BarChart3 className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Create Custom Report</h3>
                    <p className="text-[11px] text-blue-100/70">Fill in the details below</p>
                  </div>
                </div>
                <button
                  onClick={closePanel}
                  className="rounded-lg bg-white/15 p-1.5 text-white hover:bg-white/25 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* step indicator */}
              <div className="flex items-center gap-2 mt-1">
                {["Report Info", "Format & Type"].map((step, i) => (
                  <React.Fragment key={step}>
                    <div className="flex items-center gap-1.5">
                      <div className="h-5 w-5 rounded-full bg-white/25 flex items-center justify-center
                        text-[10px] font-bold text-white">
                        {i + 1}
                      </div>
                      <span className="text-[11px] text-white/80 font-medium">{step}</span>
                    </div>
                    {i < 1 && <ChevronRight className="h-3 w-3 text-white/40" />}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* panel body */}
            <div className="p-5 space-y-5">

              {/* report name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Report Name
                </label>
                <Input
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                  placeholder="e.g. Q1 Enrollment Summary"
                  className="h-10 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              {/* description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Description <span className="normal-case font-normal">(optional)</span>
                </label>
                <Input
                  value={reportDesc}
                  onChange={(e) => setReportDesc(e.target.value)}
                  placeholder="Brief description of the report"
                  className="h-10 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              {/* report type — vertical cards */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Report Type
                </label>
                <div className="space-y-2">
                  {REPORT_TYPES.map(({ value, label, color }) => {
                    const selected = reportType === value;
                    const colorMap = {
                      blue:    { border: "border-blue-400",    bg: "bg-blue-50 dark:bg-blue-950/40",    text: "text-blue-700 dark:text-blue-300",    dot: "bg-blue-500"    },
                      emerald: { border: "border-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/40", text: "text-emerald-700 dark:text-emerald-300", dot: "bg-emerald-500" },
                      amber:   { border: "border-amber-400",   bg: "bg-amber-50 dark:bg-amber-950/40",   text: "text-amber-700 dark:text-amber-300",   dot: "bg-amber-500"   },
                    };
                    const c = colorMap[color];
                    return (
                      <button
                        key={value}
                        onClick={() => setReportType(value)}
                        className={`w-full flex items-center gap-3 rounded-xl border px-4 py-3
                          transition-all duration-150 text-left
                          ${selected
                            ? `${c.border} ${c.bg} shadow-sm`
                            : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-slate-300"
                          }`}
                      >
                        <div className={`h-2.5 w-2.5 rounded-full ${c.dot} shrink-0 ${selected ? "opacity-100" : "opacity-30"}`} />
                        <span className={`text-sm font-semibold ${selected ? c.text : "text-slate-500 dark:text-slate-400"}`}>
                          {label}
                        </span>
                        {selected && (
                          <span className={`ml-auto text-[10px] font-bold uppercase tracking-wider ${c.text}`}>
                            Selected
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* format */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Export Format
                </label>
                <div className="flex gap-2">
                  {FORMAT_OPTIONS.map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setReportFormat(fmt)}
                      className={`flex-1 rounded-xl border py-2 text-xs font-semibold transition-all
                        ${reportFormat === fmt
                          ? "border-blue-400 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300"
                          : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500 hover:border-slate-300"
                        }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              {/* footer actions */}
              <div className="flex justify-end gap-2 pt-1">
                <button
                  onClick={closePanel}
                  className="px-4 py-2 rounded-xl text-sm font-medium
                    bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300
                    hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl
                    text-sm font-semibold text-white shadow
                    bg-gradient-to-r from-blue-600 to-cyan-500
                    hover:opacity-90 hover:scale-105 transition-all"
                >
                  <Plus className="h-4 w-4" /> Create
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>{/* end outer flex */}
    </div>
  );
};

export default OrgReports;