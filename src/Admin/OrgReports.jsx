// // src/Admin/OrgReports.jsx
// import React, { useState } from "react";
// import {
//   BarChart3,
//   Plus,
//   Download,
//   FileText,
//   X,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "@/components/ui/select";
// import { Input } from "@/components/ui/input";

// /* ===== DUMMY DATA ===== */
// const reports = [];

// const OrgReports = () => {
//   const [period, setPeriod] = useState("30");
//   const [type, setType] = useState("all");
//   const [open, setOpen] = useState(false);

//   /* HERO / PRIMARY BUTTON */
//   const primaryBtn =
//     "h-8 px-3 text-sm bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 text-white hover:opacity-90";

//   /* SELECT DROPDOWN FIX (LIGHT + DARK) */
//   const selectContentClass = `
//     z-50 bg-white text-slate-900
//     border border-slate-200 shadow-md
//     dark:bg-slate-900 dark:text-slate-100
//     dark:border-slate-700
//   `;

//   return (
//     <div className="space-y-6">
//       {/* HERO */}
//       <div className="rounded-2xl px-6 py-5 text-white shadow-lg bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600">
//         <h1 className="text-2xl font-semibold">
//           Organisation Reports
//         </h1>
//         <p className="mt-1 text-sm opacity-90">
//           Download insights for management & stakeholders
//         </p>
//       </div>

//       {/* FILTER BAR */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
//         <div className="flex gap-2">
//           <Select value={period} onValueChange={setPeriod}>
//             <SelectTrigger className="h-8 w-36 text-sm">
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent className={selectContentClass}>
//               <SelectItem value="30">Last 30 days</SelectItem>
//               <SelectItem value="90">Last 90 days</SelectItem>
//               <SelectItem value="365">This year</SelectItem>
//             </SelectContent>
//           </Select>

//           <Select value={type} onValueChange={setType}>
//             <SelectTrigger className="h-8 w-40 text-sm">
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent className={selectContentClass}>
//               <SelectItem value="all">All types</SelectItem>
//               <SelectItem value="enrollment">Enrollment</SelectItem>
//               <SelectItem value="completion">Completion</SelectItem>
//               <SelectItem value="revenue">Revenue</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         <Button className={primaryBtn} onClick={() => setOpen(true)}>
//           <Plus className="h-4 w-4 mr-1" />
//           Create Report
//         </Button>
//       </div>

//       {/* REPORT LIST */}
//       <Card>
//         <CardHeader className="py-2">
//           <CardTitle className="text-sm">
//             Generated Reports
//           </CardTitle>
//         </CardHeader>

//         <CardContent>
//           {reports.length === 0 ? (
//             <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
//               <BarChart3 className="h-8 w-8 mb-2 opacity-40" />
//               <p className="text-sm">No reports generated</p>
//               <p className="text-xs">
//                 Reports will appear here
//               </p>
//             </div>
//           ) : (
//             <div className="space-y-2">
//               {reports.map((r) => (
//                 <div
//                   key={r.id}
//                   className="flex items-center justify-between rounded-lg border px-4 py-3"
//                 >
//                   <div>
//                     <p className="text-sm font-medium">{r.name}</p>
//                     <div className="flex gap-2 mt-1">
//                       <Badge variant="outline">{r.type}</Badge>
//                       <Badge variant="secondary">{r.format}</Badge>
//                     </div>
//                   </div>

//                   <Button size="sm" className={primaryBtn}>
//                     <Download className="h-4 w-4 mr-1" />
//                     Download
//                   </Button>
//                 </div>
//               ))}
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* INFO */}
//       <Card>
//         <CardHeader className="py-2">
//           <CardTitle className="text-sm flex items-center gap-2">
//             <FileText className="h-4 w-4" />
//             About Reports
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <p className="text-sm text-muted-foreground">
//             Reports can be generated in CSV / Excel / PDF formats
//             and shared with stakeholders.
//           </p>
//         </CardContent>
//       </Card>

//       {/* MODAL */}
//       {open && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="relative w-full max-w-md rounded-xl bg-white dark:bg-slate-900 p-5 space-y-3">
//             <h3 className="text-base font-semibold">
//               Create Custom Report
//             </h3>

//             <button
//               onClick={() => setOpen(false)}
//               className="absolute right-3 top-3 text-slate-500 hover:text-slate-900"
//             >
//               <X className="h-4 w-4" />
//             </button>

//             <Input className="h-8 text-sm" placeholder="Report Name" />
//             <Input className="h-8 text-sm" placeholder="Description (optional)" />

//             <div className="flex justify-end gap-2 pt-2">
//               <Button size="sm" variant="outline" onClick={() => setOpen(false)}>
//                 Cancel
//               </Button>
//               <Button size="sm" className={primaryBtn}>
//                 Create
//               </Button>
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
  Info, Plus, TrendingUp, X,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/* ── dummy data (unchanged) ── */
const reports = [];

/* ── report type chip colours ── */
const TYPE_CFG = {
  enrollment: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-800",
  completion: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800",
  revenue:    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800",
};

/* ── info cards ── */
const INFO_CARDS = [
  { icon: FileText,   label: "CSV / Excel / PDF",   desc: "Multiple export formats",         grad: "from-blue-500 to-cyan-600"    },
  { icon: TrendingUp, label: "Stakeholder Ready",    desc: "Shareable with management",       grad: "from-violet-500 to-indigo-600" },
  { icon: BarChart3,  label: "Filterable Insights",  desc: "By period, type & more",          grad: "from-amber-500 to-orange-600"  },
];

/* ================= MAIN ================= */
const OrgReports = () => {
  const navigate = useNavigate();

  const [period, setPeriod] = useState("30");
  const [type, setType]     = useState("all");
  const [open, setOpen]     = useState(false);

  /* ================= RENDER ================= */
  return (
    <div className="min-h-screen bg-[#f0f4ff] dark:bg-[#060b18] p-5 space-y-5">

      {/* ═══════ HERO ═══════ */}
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

      {/* ═══════ FILTER + ACTION BAR ═══════ */}
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

          <Select value={type} onValueChange={setType}>
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
          onClick={() => setOpen(true)}
          className="flex items-center gap-1.5 rounded-xl
            bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2
            text-sm font-semibold text-white shadow
            hover:opacity-90 hover:scale-105 transition-all self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" /> Create Report
        </button>
      </div>

      {/* ═══════ REPORT LIST CARD ═══════ */}
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

      {/* ═══════ INFO CARDS ═══════ */}
      <div className="grid gap-4 sm:grid-cols-3">
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

      {/* ═══════ MODAL ═══════ */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center
          bg-black/50 backdrop-blur-md">

          <div className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden
            bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">

            {/* header */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-4">
              <div className="flex items-center justify-between">
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
                  onClick={() => setOpen(false)}
                  className="rounded-lg bg-white/15 p-1.5 text-white hover:bg-white/25 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* body */}
            <div className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Report Name</label>
                <Input
                  placeholder="e.g. Q1 Enrollment Summary"
                  className="h-10 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Description <span className="normal-case font-normal">(optional)</span></label>
                <Input
                  placeholder="Brief description of the report"
                  className="h-10 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  onClick={() => setOpen(false)}
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
      )}
    </div>
  );
};

export default OrgReports;