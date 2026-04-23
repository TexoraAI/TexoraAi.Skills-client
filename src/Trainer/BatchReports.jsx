// import React, { useEffect, useState } from "react";
// // import { getBatchReports } from "../services/batchService";
// import {
//   Loader2,
//   BarChart3,
//   Users,
//   Target,
//   TrendingUp,
//   Award,
//   BookOpen,
//   Download,
//   Filter,
//   Search,
//   Sparkles,
//   CheckCircle,
//   Trophy,
//   ArrowUpRight,
//   ArrowDownRight,
// } from "lucide-react";

// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// const BatchReports = () => {
//   const [reports, setReports] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");

//   useEffect(() => {
//     getBatchReports()
//       .then((res) => setReports(res.data || []))
//       .finally(() => setLoading(false));
//   }, []);

//   // Filter batches
//   const filteredReports = reports.filter((report) =>
//     report.batchName.toLowerCase().includes(searchQuery.toLowerCase()),
//   );

//   // Calculate overall stats
//   const totalStudents = reports.reduce((acc, r) => acc + (r.students || 0), 0);
//   const avgScore =
//     reports.length > 0
//       ? reports.reduce((acc, r) => acc + (r.avgScore || 0), 0) / reports.length
//       : 0;
//   const avgCompletion =
//     reports.length > 0
//       ? reports.reduce((acc, r) => acc + (r.completion || 0), 0) /
//         reports.length
//       : 0;
//   const topBatches = reports.filter((r) => (r.avgScore || 0) >= 80).length;

//   const getScoreColor = (score) => {
//     if (score >= 90) return "text-purple-600 dark:text-purple-400";
//     if (score >= 80) return "text-emerald-600 dark:text-emerald-400";
//     if (score >= 70) return "text-blue-600 dark:text-blue-400";
//     if (score >= 60) return "text-amber-600 dark:text-amber-400";
//     return "text-rose-600 dark:text-rose-400";
//   };

//   const getScoreBgColor = (score) => {
//     if (score >= 90) return "bg-purple-100 dark:bg-purple-900/30";
//     if (score >= 80) return "bg-emerald-100 dark:bg-emerald-900/30";
//     if (score >= 70) return "bg-blue-100 dark:bg-blue-900/30";
//     if (score >= 60) return "bg-amber-100 dark:bg-amber-900/30";
//     return "bg-rose-100 dark:bg-rose-900/30";
//   };

//   const getProgressColor = (completion) => {
//     if (completion >= 90) return "bg-purple-500";
//     if (completion >= 80) return "bg-emerald-500";
//     if (completion >= 70) return "bg-blue-500";
//     if (completion >= 60) return "bg-amber-500";
//     return "bg-rose-500";
//   };

//   /* ===== Loading ===== */
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center">
//         <div className="flex flex-col items-center gap-3">
//           <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
//           <p className="text-sm text-muted-foreground">
//             Loading batch reports...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
//       {/* Premium Hero Header */}
//       <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 dark:from-cyan-900 dark:via-blue-900 dark:to-indigo-900">
//         <div className="max-w-7xl mx-auto px-6 py-8">
//           <div className="flex items-center gap-3 mb-2">
//             <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
//               <BarChart3 className="w-6 h-6 text-white" />
//             </div>
//             <p className="text-xs font-semibold tracking-wide text-cyan-100 uppercase">
//               Analytics & Reporting
//             </p>
//           </div>
//           <h1 className="text-3xl font-bold text-white mb-2">Batch Reports</h1>
//           <p className="text-cyan-100">
//             Performance summary and analytics across all batches
//           </p>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-6 py-8">
//         {/* Stats Dashboard */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//           <Card className="p-6 border-slate-200 dark:border-slate-800 bg-gradient-to-br from-cyan-50 to-white dark:from-cyan-950/20 dark:to-slate-900">
//             <div className="flex items-center justify-between mb-2">
//               <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
//                 <BookOpen className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
//               </div>
//               <TrendingUp className="w-4 h-4 text-cyan-600" />
//             </div>
//             <p className="text-2xl font-bold text-foreground">
//               {reports.length}
//             </p>
//             <p className="text-sm text-muted-foreground">Total Batches</p>
//           </Card>

//           <Card className="p-6 border-slate-200 dark:border-slate-800 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-slate-900">
//             <div className="flex items-center justify-between mb-2">
//               <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
//                 <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
//               </div>
//               <TrendingUp className="w-4 h-4 text-blue-600" />
//             </div>
//             <p className="text-2xl font-bold text-foreground">
//               {totalStudents}
//             </p>
//             <p className="text-sm text-muted-foreground">Total Students</p>
//           </Card>

//           <Card className="p-6 border-slate-200 dark:border-slate-800 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:to-slate-900">
//             <div className="flex items-center justify-between mb-2">
//               <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
//                 <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
//               </div>
//               <TrendingUp className="w-4 h-4 text-emerald-600" />
//             </div>
//             <p className="text-2xl font-bold text-foreground">
//               {avgScore.toFixed(1)}%
//             </p>
//             <p className="text-sm text-muted-foreground">Avg Score</p>
//           </Card>

//           <Card className="p-6 border-slate-200 dark:border-slate-800 bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-slate-900">
//             <div className="flex items-center justify-between mb-2">
//               <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
//                 <Trophy className="w-5 h-5 text-purple-600 dark:text-purple-400" />
//               </div>
//               <TrendingUp className="w-4 h-4 text-purple-600" />
//             </div>
//             <p className="text-2xl font-bold text-foreground">{topBatches}</p>
//             <p className="text-sm text-muted-foreground">Top Batches (80%+)</p>
//           </Card>
//         </div>

//         {/* Search & Actions Bar */}
//         <Card className="p-4 mb-6 border-slate-200 dark:border-slate-800 shadow-sm">
//           <div className="flex flex-col md:flex-row gap-4">
//             {/* Search */}
//             <div className="flex-1 relative">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//               <Input
//                 placeholder="Search batches..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="pl-10 border-slate-300 dark:border-slate-700"
//               />
//             </div>

//             {/* Actions */}
//             <div className="flex gap-2">
//               <Button variant="outline" size="sm" className="gap-2">
//                 <Download className="w-4 h-4" />
//                 Export
//               </Button>
//             </div>
//           </div>
//         </Card>

//         {/* Batch Reports Table */}
//         {filteredReports.length === 0 ? (
//           <Card className="p-12 text-center border-slate-200 dark:border-slate-800">
//             <div className="inline-flex p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
//               <BookOpen className="w-12 h-12 text-blue-600 dark:text-blue-400" />
//             </div>
//             <h3 className="text-xl font-semibold text-foreground mb-2">
//               {reports.length === 0 ? "No Batches Yet" : "No Matching Batches"}
//             </h3>
//             <p className="text-sm text-muted-foreground">
//               {reports.length === 0
//                 ? "Batch reports will appear here once batches are created"
//                 : "Try adjusting your search"}
//             </p>
//           </Card>
//         ) : (
//           <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
//                   <tr className="text-muted-foreground">
//                     <th className="py-4 px-6 text-left font-semibold">
//                       Batch Name
//                     </th>
//                     <th className="py-4 px-6 text-left font-semibold">
//                       Students
//                     </th>
//                     <th className="py-4 px-6 text-left font-semibold">
//                       Average Score
//                     </th>
//                     <th className="py-4 px-6 text-left font-semibold">
//                       Completion Rate
//                     </th>
//                     <th className="py-4 px-6 text-left font-semibold">
//                       Performance
//                     </th>
//                   </tr>
//                 </thead>

//                 <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
//                   {filteredReports.map((report) => (
//                     <tr
//                       key={report.batchName}
//                       className="text-foreground hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
//                     >
//                       {/* Batch Name */}
//                       <td className="py-4 px-6">
//                         <div className="flex items-center gap-3">
//                           <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold text-sm shrink-0">
//                             {report.batchName.charAt(0).toUpperCase()}
//                           </div>
//                           <div>
//                             <p className="font-semibold text-foreground">
//                               {report.batchName}
//                             </p>
//                             <p className="text-xs text-muted-foreground">
//                               Active Batch
//                             </p>
//                           </div>
//                         </div>
//                       </td>

//                       {/* Students */}
//                       <td className="py-4 px-6">
//                         <div className="flex items-center gap-2">
//                           <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
//                           <span className="font-semibold">
//                             {report.students || 0}
//                           </span>
//                         </div>
//                       </td>

//                       {/* Average Score */}
//                       <td className="py-4 px-6">
//                         <div className="flex items-center gap-2">
//                           <div
//                             className={`p-1.5 rounded-lg ${getScoreBgColor(
//                               report.avgScore || 0,
//                             )}`}
//                           >
//                             <Award
//                               className={`w-4 h-4 ${getScoreColor(
//                                 report.avgScore || 0,
//                               )}`}
//                             />
//                           </div>
//                           <span
//                             className={`font-semibold ${getScoreColor(
//                               report.avgScore || 0,
//                             )}`}
//                           >
//                             {report.avgScore || 0}%
//                           </span>
//                           {(report.avgScore || 0) >= 80 ? (
//                             <ArrowUpRight className="w-3 h-3 text-emerald-600" />
//                           ) : (
//                             <ArrowDownRight className="w-3 h-3 text-rose-600" />
//                           )}
//                         </div>
//                       </td>

//                       {/* Completion Rate */}
//                       <td className="py-4 px-6">
//                         <div className="space-y-1">
//                           <div className="flex items-center justify-between text-xs">
//                             <span className="font-semibold">
//                               {report.completion || 0}%
//                             </span>
//                           </div>
//                           <div className="w-32 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
//                             <div
//                               className={`h-full ${getProgressColor(
//                                 report.completion || 0,
//                               )} transition-all`}
//                               style={{ width: `${report.completion || 0}%` }}
//                             />
//                           </div>
//                         </div>
//                       </td>

//                       {/* Performance Badge */}
//                       <td className="py-4 px-6">
//                         {(report.avgScore || 0) >= 90 ? (
//                           <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
//                             <Trophy className="w-3 h-3" />
//                             Outstanding
//                           </span>
//                         ) : (report.avgScore || 0) >= 80 ? (
//                           <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
//                             <CheckCircle className="w-3 h-3" />
//                             Excellent
//                           </span>
//                         ) : (report.avgScore || 0) >= 70 ? (
//                           <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
//                             <Target className="w-3 h-3" />
//                             Good
//                           </span>
//                         ) : (
//                           <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
//                             <TrendingUp className="w-3 h-3" />
//                             Needs Improvement
//                           </span>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </Card>
//         )}

//         {/* Help Section */}
//         <Card className="p-6 mt-8 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-slate-900">
//           <div className="flex gap-4">
//             <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg shrink-0 h-fit">
//               <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
//             </div>
//             <div>
//               <h3 className="font-semibold text-foreground mb-2">
//                 Understanding Batch Performance
//               </h3>
//               <ul className="text-sm text-muted-foreground space-y-2">
//                 <li className="flex items-start gap-2">
//                   <span className="text-blue-600 dark:text-blue-400 mt-0.5">
//                     •
//                   </span>
//                   <span>
//                     <strong>Outstanding (90%+):</strong> Batches with
//                     exceptional overall performance across all metrics
//                   </span>
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <span className="text-blue-600 dark:text-blue-400 mt-0.5">
//                     •
//                   </span>
//                   <span>
//                     <strong>Excellent (80-89%):</strong> Strong batch
//                     performance with consistent student engagement
//                   </span>
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <span className="text-blue-600 dark:text-blue-400 mt-0.5">
//                     •
//                   </span>
//                   <span>
//                     <strong>Good (70-79%):</strong> Satisfactory performance
//                     with opportunities for growth
//                   </span>
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <span className="text-blue-600 dark:text-blue-400 mt-0.5">
//                     •
//                   </span>
//                   <span>
//                     <strong>Needs Improvement (&lt;70%):</strong> Batches that
//                     may benefit from additional instructor support
//                   </span>
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default BatchReports;




















import { useState, useEffect } from "react";
import { progressService } from "../services/progressService";
import { getTrainerBatches } from "../services/batchService";

function fmt(v) {
  return typeof v === "number" ? Math.round(v) : 0;
}
function progColor(v) {
  return v >= 75 ? "#00FFB2" : v >= 50 ? "#FFB800" : "#FF4D6D";
}
function progGlow(v) {
  return v >= 75
    ? "0 0 20px rgba(0,255,178,0.4)"
    : v >= 50
      ? "0 0 20px rgba(255,184,0,0.4)"
      : "0 0 20px rgba(255,77,109,0.4)";
}
function initials(email = "") {
  const name = email.split("@")[0];
  const parts = name.split(/[._-]/);
  return parts.length > 1
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
}
const AV_COLORS = [
  { bg: "linear-gradient(135deg,#00FFB2,#00C87A)", text: "#003D24" },
  { bg: "linear-gradient(135deg,#A78BFA,#7C3AED)", text: "#EDE9FE" },
  { bg: "linear-gradient(135deg,#FB923C,#DC2626)", text: "#FFF7ED" },
  { bg: "linear-gradient(135deg,#38BDF8,#0369A1)", text: "#E0F2FE" },
  { bg: "linear-gradient(135deg,#FBBF24,#D97706)", text: "#1C1917" },
];

// 3D-ish Donut ring for overall metric
function DonutRing({ value, color, size = 80, strokeW = 8 }) {
  const r = (size - strokeW * 2) / 2;
  const circ = 2 * Math.PI * r;
  const progress = (value / 100) * circ;
  const cx = size / 2,
    cy = size / 2;
  return (
    <svg
      width={size}
      height={size}
      style={{
        transform: "rotate(-90deg)",
        filter: `drop-shadow(0 0 10px ${color}80)`,
      }}
    >
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth={strokeW}
      />
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={strokeW}
        strokeLinecap="round"
        strokeDasharray={`${progress} ${circ}`}
        style={{
          transition: "stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1)",
        }}
      />
    </svg>
  );
}

function RadarChart({ data }) {
  const axes = [
    { label: "Videos", val: data.videoWatchPercentage ?? 0 },
    { label: "Files", val: data.fileDownloadPercentage ?? 0 },
    { label: "Quizzes", val: data.quizCompletionPercentage ?? 0 },
    { label: "Assignments", val: data.assignmentCompletionPercentage ?? 0 },
    { label: "Course", val: data.courseProgressPercentage ?? 0 },
  ];
  const N = axes.length,
    cx = 130,
    cy = 120,
    r = 85;
  const ang = (i) => (Math.PI * 2 * i) / N - Math.PI / 2;
  const pt = (i, pct) => {
    const a = ang(i);
    const d = (pct / 100) * r;
    return [cx + d * Math.cos(a), cy + d * Math.sin(a)];
  };
  const poly = axes.map((a, i) => pt(i, a.val).join(",")).join(" ");
  return (
    <svg
      viewBox="0 0 260 240"
      style={{
        width: "100%",
        maxWidth: 220,
        filter: "drop-shadow(0 0 10px rgba(0,255,178,0.15))",
      }}
    >
      <defs>
        <radialGradient id="brf" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00FFB2" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#00FFB2" stopOpacity="0.02" />
        </radialGradient>
      </defs>
      {[20, 40, 60, 80, 100].map((ring) => (
        <polygon
          key={ring}
          points={axes.map((_, i) => pt(i, ring).join(",")).join(" ")}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1"
        />
      ))}
      {axes.map((_, i) => {
        const [x2, y2] = pt(i, 100);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={x2}
            y2={y2}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
          />
        );
      })}
      <polygon
        points={poly}
        fill="url(#brf)"
        stroke="#00FFB2"
        strokeWidth="1.5"
      />
      {axes.map((a, i) => {
        const [x, y] = pt(i, a.val);
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={3.5}
            fill="#00FFB2"
            style={{ filter: "drop-shadow(0 0 5px #00FFB2)" }}
          />
        );
      })}
      {axes.map((a, i) => {
        const [x, y] = pt(i, 115);
        return (
          <text
            key={i}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="10"
            fill="rgba(255,255,255,0.5)"
            fontFamily="'Space Grotesk',sans-serif"
          >
            {a.label}
          </text>
        );
      })}
    </svg>
  );
}

export default function BatchReports() {
  const [batches, setBatches] = useState([]);
  const [batchesLoading, setBatchesLoading] = useState(true);
  const [selectedBatchId, setSelectedBatchId] = useState(null);
  const [report, setReport] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [tab, setTab] = useState("table");

  useEffect(() => {
    getTrainerBatches()
      .then((data) => {
        const list = data || [];
        setBatches(list);
        if (list.length > 0) setSelectedBatchId(list[0].id);
        setBatchesLoading(false);
      })
      .catch(() => setBatchesLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedBatchId) return;
    setReport(null);
    setSelectedStudent(null);
    setReportLoading(true);
    setReportError(null);
    progressService
      .getBatchProgressReport(selectedBatchId)
      .then((res) => {
        setReport(res.data);
        setReportLoading(false);
      })
      .catch((err) => {
        setReportError(err.response?.data?.message || err.message);
        setReportLoading(false);
      });
  }, [selectedBatchId]);

  const students = report?.studentReports || [];

  if (batchesLoading)
    return (
      <>
        <style>{css}</style>
        <div className="br-wrap">
          <div className="br-loader">
            <div className="br-spinner" />
            <span>Loading...</span>
          </div>
        </div>
      </>
    );

  return (
    <>
      <style>{css}</style>
      <div className="br-wrap">
        {/* HEADER */}
        <div className="br-header">
          <div>
            <div className="br-title-badge">BATCH ANALYTICS</div>
            <h1 className="br-title">Batch Progress Report</h1>
            <p className="br-subtitle">
              Monitor cohort performance and individual learner progress
            </p>
          </div>
          <div className="br-batch-row">
            {batches.map((b) => (
              <button
                key={b.id}
                className={`br-batch-btn${selectedBatchId === b.id ? " active" : ""}`}
                onClick={() => setSelectedBatchId(b.id)}
              >
                <span className="br-batch-dot" />
                Batch {b.id}
              </button>
            ))}
          </div>
        </div>

        {reportLoading && (
          <div className="br-loader" style={{ height: 200 }}>
            <div className="br-spinner" />
            <span>Loading batch data…</span>
          </div>
        )}
        {reportError && <div className="br-err">{reportError}</div>}

        {!reportLoading && !reportError && report && (
          <>
            {/* STAT CARDS ROW */}
            <div className="br-stats-row">
              {[
                {
                  label: "Total Students",
                  val: report.totalStudents,
                  raw: true,
                  accent: "#fff",
                },
                {
                  label: "Avg Overall",
                  val: report.avgOverallProgressPercentage,
                  accent: progColor(report.avgOverallProgressPercentage),
                },
                {
                  label: "Avg Video",
                  val: report.avgVideoWatchPercentage,
                  accent: "#00FFB2",
                },
                {
                  label: "Avg Files",
                  val: report.avgFileDownloadPercentage,
                  accent: "#38BDF8",
                },
                {
                  label: "Avg Quizzes",
                  val: report.avgQuizCompletionPercentage,
                  accent: "#A78BFA",
                },
                {
                  label: "Avg Assignments",
                  val: report.avgAssignmentCompletionPercentage,
                  accent: "#FB923C",
                },
              ].map((m, i) => (
                <div key={m.label} className="br-stat-card">
                  <div
                    className="br-stat-glow"
                    style={{ background: m.accent + "15" }}
                  />
                  {!m.raw && (
                    <DonutRing
                      value={m.val || 0}
                      color={m.accent}
                      size={56}
                      strokeW={5}
                    />
                  )}
                  {m.raw && (
                    <div
                      className="br-stat-num-big"
                      style={{ color: m.accent }}
                    >
                      {m.val}
                    </div>
                  )}
                  <p
                    className="br-stat-val"
                    style={m.raw ? { display: "none" } : { color: m.accent }}
                  >
                    {fmt(m.val)}%
                  </p>
                  <p className="br-stat-label">{m.label}</p>
                </div>
              ))}
            </div>

            {/* TWO COLUMN: table/bars + student detail */}
            <div className="br-main-grid">
              {/* LEFT: student list with tabs */}
              <div className="br-left-panel">
                <div className="br-panel-inner">
                  <div className="br-tabs">
                    {["table", "bars"].map((t) => (
                      <button
                        key={t}
                        className={`br-tab${tab === t ? " active" : ""}`}
                        onClick={() => setTab(t)}
                      >
                        {t === "table" ? "↗ Table" : "▦ Bars"}
                      </button>
                    ))}
                    <span className="br-tab-count">
                      {students.length} students
                    </span>
                  </div>

                  {students.length === 0 && (
                    <div className="br-empty">No students in this batch</div>
                  )}

                  {tab === "table" && students.length > 0 && (
                    <div className="br-table-wrap">
                      <table className="br-table">
                        <thead>
                          <tr>
                            <th>Student</th>
                            <th>Videos</th>
                            <th>Files</th>
                            <th>Quizzes</th>
                            <th>Assign.</th>
                            <th>Overall</th>
                          </tr>
                        </thead>
                        <tbody>
                          {students.map((s, i) => {
                            const col = AV_COLORS[i % 5];
                            const isActive =
                              selectedStudent?.studentEmail === s.studentEmail;
                            return (
                              <tr
                                key={s.studentEmail}
                                className={isActive ? "active" : ""}
                                onClick={() =>
                                  setSelectedStudent(isActive ? null : s)
                                }
                              >
                                <td>
                                  <div className="br-cell-student">
                                    <div
                                      className="br-av-sm"
                                      style={{
                                        background: col.bg,
                                        color: col.text,
                                      }}
                                    >
                                      {initials(s.studentEmail)}
                                    </div>
                                    <span className="br-email-text">
                                      {s.studentEmail.split("@")[0]}
                                    </span>
                                  </div>
                                </td>
                                <td>
                                  <span
                                    className="br-mini-pct"
                                    style={{ color: "#00FFB2" }}
                                  >
                                    {fmt(s.videoWatchPercentage)}%
                                  </span>
                                </td>
                                <td>
                                  <span
                                    className="br-mini-pct"
                                    style={{ color: "#38BDF8" }}
                                  >
                                    {fmt(s.fileDownloadPercentage)}%
                                  </span>
                                </td>
                                <td>
                                  <span
                                    className="br-mini-pct"
                                    style={{ color: "#A78BFA" }}
                                  >
                                    {fmt(s.quizCompletionPercentage)}%
                                  </span>
                                </td>
                                <td>
                                  <span
                                    className="br-mini-pct"
                                    style={{ color: "#FB923C" }}
                                  >
                                    {fmt(s.assignmentCompletionPercentage)}%
                                  </span>
                                </td>
                                <td>
                                  <span
                                    className="br-overall-badge"
                                    style={{
                                      color: progColor(
                                        s.overallProgressPercentage,
                                      ),
                                      borderColor:
                                        progColor(s.overallProgressPercentage) +
                                        "44",
                                      boxShadow: isActive
                                        ? progGlow(s.overallProgressPercentage)
                                        : "none",
                                    }}
                                  >
                                    {fmt(s.overallProgressPercentage)}%
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {tab === "bars" && students.length > 0 && (
                    <div className="br-bars-list">
                      {students.map((s, i) => {
                        const col = AV_COLORS[i % 5];
                        const isActive =
                          selectedStudent?.studentEmail === s.studentEmail;
                        const c = progColor(s.overallProgressPercentage);
                        return (
                          <div
                            key={s.studentEmail}
                            className={`br-bar-row${isActive ? " active" : ""}`}
                            onClick={() =>
                              setSelectedStudent(isActive ? null : s)
                            }
                          >
                            <div
                              className="br-av-sm"
                              style={{ background: col.bg, color: col.text }}
                            >
                              {initials(s.studentEmail)}
                            </div>
                            <div className="br-bar-info">
                              <p className="br-bar-email">{s.studentEmail}</p>
                              <div className="br-bar-track">
                                <div
                                  className="br-bar-fill"
                                  style={{
                                    width: `${Math.min(s.overallProgressPercentage || 0, 100)}%`,
                                    background: c,
                                    boxShadow: `0 0 8px ${c}`,
                                  }}
                                />
                              </div>
                            </div>
                            <span className="br-bar-pct" style={{ color: c }}>
                              {fmt(s.overallProgressPercentage)}%
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT: student detail */}
              <div className="br-right-panel">
                {!selectedStudent && (
                  <div className="br-no-select">
                    <div className="br-no-select-orb" />
                    <div className="br-no-select-icon">
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="rgba(0,255,178,0.4)"
                        strokeWidth="1.5"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                    <p className="br-no-select-text">
                      Click a student to see
                      <br />
                      their detailed report
                    </p>
                  </div>
                )}

                {selectedStudent && (
                  <div className="br-detail">
                    {/* banner */}
                    <div className="br-detail-top">
                      <div
                        className="br-detail-av"
                        style={{
                          background: AV_COLORS[0].bg,
                          color: AV_COLORS[0].text,
                        }}
                      >
                        {initials(selectedStudent.studentEmail)}
                      </div>
                      <div className="br-detail-info">
                        <h3 className="br-detail-name">
                          {selectedStudent.studentEmail}
                        </h3>
                        <span className="br-detail-batch-tag">
                          Batch {selectedStudent.batchId || selectedBatchId}
                        </span>
                      </div>
                      <div className="br-detail-donut">
                        <div
                          style={{
                            position: "relative",
                            width: 72,
                            height: 72,
                          }}
                        >
                          <DonutRing
                            value={
                              selectedStudent.overallProgressPercentage || 0
                            }
                            color={progColor(
                              selectedStudent.overallProgressPercentage,
                            )}
                            size={72}
                            strokeW={6}
                          />
                          <div
                            className="br-donut-center"
                            style={{
                              color: progColor(
                                selectedStudent.overallProgressPercentage,
                              ),
                            }}
                          >
                            {fmt(selectedStudent.overallProgressPercentage)}%
                          </div>
                        </div>
                        <p className="br-donut-lbl">overall</p>
                      </div>
                    </div>

                    {/* metric row */}
                    <div className="br-detail-metrics">
                      {[
                        {
                          label: "Videos",
                          val: selectedStudent.videoWatchPercentage,
                          color: "#00FFB2",
                          sub: `${selectedStudent.videosWatched ?? 0}/${selectedStudent.totalVideos ?? 0}`,
                        },
                        {
                          label: "Files",
                          val: selectedStudent.fileDownloadPercentage,
                          color: "#38BDF8",
                          sub: `${selectedStudent.filesDownloaded ?? 0}/${selectedStudent.totalFiles ?? 0}`,
                        },
                        {
                          label: "Quizzes",
                          val: selectedStudent.quizCompletionPercentage,
                          color: "#A78BFA",
                          sub: `${selectedStudent.quizzesCompleted ?? 0}/${selectedStudent.totalQuizzes ?? 0}`,
                        },
                        {
                          label: "Assignments",
                          val: selectedStudent.assignmentCompletionPercentage,
                          color: "#FB923C",
                          sub: `${selectedStudent.assignmentsCompleted ?? 0}/${selectedStudent.totalAssignments ?? 0}`,
                        },
                        {
                          label: "Course",
                          val: selectedStudent.courseProgressPercentage,
                          color: "#FBBF24",
                          sub: `${selectedStudent.courseContentCompleted ?? 0}/${selectedStudent.totalCourseContent ?? 0}`,
                        },
                      ].map((m) => (
                        <div key={m.label} className="br-dm-card">
                          <p className="br-dm-val" style={{ color: m.color }}>
                            {fmt(m.val)}%
                          </p>
                          <p className="br-dm-label">{m.label}</p>
                          <p className="br-dm-sub">{m.sub}</p>
                        </div>
                      ))}
                    </div>

                    {/* progress bars + radar */}
                    <div className="br-detail-lower">
                      <div className="br-detail-bars">
                        <p className="br-section-title">Breakdown</p>
                        {[
                          {
                            label: "Video watch",
                            val: selectedStudent.videoWatchPercentage,
                            color: "#00FFB2",
                          },
                          {
                            label: "File download",
                            val: selectedStudent.fileDownloadPercentage,
                            color: "#38BDF8",
                          },
                          {
                            label: "Quiz completion",
                            val: selectedStudent.quizCompletionPercentage,
                            color: "#A78BFA",
                          },
                          {
                            label: "Assignments",
                            val: selectedStudent.assignmentCompletionPercentage,
                            color: "#FB923C",
                          },
                          {
                            label: "Course content",
                            val: selectedStudent.courseProgressPercentage,
                            color: "#FBBF24",
                          },
                        ].map((m) => (
                          <div key={m.label} className="br-prog-row">
                            <span className="br-prog-lbl">{m.label}</span>
                            <div className="br-prog-track">
                              <div
                                className="br-prog-fill"
                                style={{
                                  width: `${Math.min(m.val || 0, 100)}%`,
                                  background: m.color,
                                  boxShadow: `0 0 8px ${m.color}`,
                                }}
                              />
                            </div>
                            <span
                              className="br-prog-pct"
                              style={{ color: m.color }}
                            >
                              {fmt(m.val)}%
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="br-detail-radar">
                        <p className="br-section-title">Skill Radar</p>
                        <RadarChart data={selectedStudent} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Outfit:wght@300;400;600;700&display=swap');

.br-wrap {
  font-family: 'Space Grotesk', sans-serif;
  background: #080C14;
  min-height: 100vh;
  padding: 2rem 1.5rem;
  color: #fff;
  background-image:
    radial-gradient(ellipse at 10% 0%, rgba(0,255,178,0.07) 0%, transparent 45%),
    radial-gradient(ellipse at 90% 90%, rgba(167,139,250,0.07) 0%, transparent 45%),
    radial-gradient(ellipse at 60% 30%, rgba(56,189,248,0.04) 0%, transparent 35%);
}

/* HEADER */
.br-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 2rem;
}
.br-title-badge {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.2em;
  color: #00FFB2;
  background: rgba(0,255,178,0.1);
  border: 1px solid rgba(0,255,178,0.2);
  padding: 3px 10px;
  border-radius: 20px;
  display: inline-block;
  margin-bottom: 8px;
}
.br-title {
  font-family: 'Outfit', sans-serif;
  font-size: 26px;
  font-weight: 700;
  margin: 0 0 4px;
  background: linear-gradient(135deg,#fff 40%,rgba(255,255,255,0.45));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.br-subtitle { font-size: 13px; color: rgba(255,255,255,0.35); margin: 0; }

.br-batch-row { display:flex; gap:8px; flex-wrap:wrap; align-items:center; }
.br-batch-btn {
  display:flex; align-items:center; gap:6px;
  padding:8px 18px; border-radius:50px; font-size:13px; font-weight:500;
  cursor:pointer; border:1px solid rgba(255,255,255,0.1);
  background:rgba(255,255,255,0.04); color:rgba(255,255,255,0.5);
  font-family:'Space Grotesk',sans-serif; transition:all .2s;
}
.br-batch-btn:hover { border-color:rgba(0,255,178,0.4); color:#00FFB2; }
.br-batch-btn.active { background:rgba(0,255,178,0.12); border-color:#00FFB2; color:#00FFB2; box-shadow:0 0 20px rgba(0,255,178,0.15); }
.br-batch-dot { width:6px; height:6px; border-radius:50%; background:currentColor; }

/* STAT CARDS */
.br-stats-row {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
  margin-bottom: 20px;
}
@media(max-width:900px){ .br-stats-row{ grid-template-columns:repeat(3,1fr); } }
@media(max-width:500px){ .br-stats-row{ grid-template-columns:repeat(2,1fr); } }

.br-stat-card {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 18px;
  padding: 16px 12px;
  text-align: center;
  position: relative;
  overflow: hidden;
  transition: transform 0.2s, border-color 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.br-stat-card:hover { transform: translateY(-3px); border-color: rgba(255,255,255,0.14); }
.br-stat-glow { position:absolute; top:0; left:0; right:0; bottom:0; border-radius:18px; pointer-events:none; }
.br-stat-num-big { font-family:'Outfit',sans-serif; font-size:32px; font-weight:700; line-height:1; margin:6px 0 2px; }
.br-stat-val { font-size:11px; font-weight:700; margin:0 0 2px; }
.br-stat-label { font-size:10px; font-weight:500; color:rgba(255,255,255,0.35); margin:0; text-transform:uppercase; letter-spacing:0.08em; }

/* MAIN GRID */
.br-main-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  align-items: start;
}
@media(max-width:900px){ .br-main-grid{ grid-template-columns:1fr; } }

/* LEFT PANEL */
.br-left-panel {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 20px;
  overflow: hidden;
  position: relative;
}
.br-left-panel::before {
  content:''; position:absolute; top:0; left:0; right:0; height:1px;
  background: linear-gradient(90deg,transparent,rgba(0,255,178,0.3),transparent);
}

.br-panel-inner { padding: 0; }

.br-tabs {
  display: flex;
  align-items: center;
  gap: 0;
  padding: 0 16px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.br-tab {
  padding: 14px 16px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  color: rgba(255,255,255,0.35);
  border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  background: none;
  font-family: 'Space Grotesk', sans-serif;
  transition: all .15s;
  letter-spacing: 0.03em;
}
.br-tab:hover { color: rgba(255,255,255,0.7); }
.br-tab.active { color: #00FFB2; border-bottom-color: #00FFB2; }
.br-tab-count { margin-left: auto; font-size: 11px; color: rgba(255,255,255,0.3); }

.br-table-wrap { overflow-x: auto; max-height: 500px; overflow-y: auto; }
.br-table-wrap::-webkit-scrollbar { width: 3px; height: 3px; }
.br-table-wrap::-webkit-scrollbar-thumb { background: rgba(0,255,178,0.2); border-radius: 3px; }

.br-table { width: 100%; border-collapse: collapse; }
.br-table th {
  font-size: 10px;
  font-weight: 600;
  color: rgba(255,255,255,0.3);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 12px 14px;
  text-align: left;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  background: rgba(0,0,0,0.2);
  position: sticky; top: 0;
  white-space: nowrap;
}
.br-table td {
  padding: 10px 14px;
  border-bottom: 1px solid rgba(255,255,255,0.04);
  font-size: 12px;
  color: rgba(255,255,255,0.7);
  vertical-align: middle;
  cursor: pointer;
  transition: background 0.15s;
}
.br-table tr:last-child td { border-bottom: none; }
.br-table tbody tr:hover td { background: rgba(255,255,255,0.04); }
.br-table tbody tr.active td { background: rgba(0,255,178,0.05); }

.br-cell-student { display:flex; align-items:center; gap:8px; }
.br-av-sm {
  width: 28px; height: 28px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 10px; font-weight: 700; flex-shrink: 0;
}
.br-email-text { font-size: 12px; font-weight: 500; }
.br-mini-pct { font-size: 12px; font-weight: 600; }
.br-overall-badge {
  font-size: 11px; font-weight: 700;
  border: 1px solid; border-radius: 20px;
  padding: 3px 9px; display: inline-block;
}

.br-bars-list { padding: 12px; max-height: 500px; overflow-y: auto; }
.br-bars-list::-webkit-scrollbar { width: 3px; }
.br-bars-list::-webkit-scrollbar-thumb { background: rgba(0,255,178,0.2); border-radius: 3px; }

.br-bar-row {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 8px;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  border: 1px solid transparent;
  margin-bottom: 6px;
}
.br-bar-row:hover { background: rgba(255,255,255,0.04); }
.br-bar-row.active { background: rgba(0,255,178,0.05); border-color: rgba(0,255,178,0.2); }
.br-bar-info { flex: 1; min-width: 0; }
.br-bar-email { font-size: 12px; font-weight: 500; color: rgba(255,255,255,0.7); margin: 0 0 5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.br-bar-track { height: 5px; background: rgba(255,255,255,0.07); border-radius: 3px; overflow: hidden; }
.br-bar-fill { height: 5px; border-radius: 3px; transition: width 0.8s cubic-bezier(0.4,0,0.2,1); }
.br-bar-pct { font-size: 12px; font-weight: 700; flex-shrink: 0; width: 38px; text-align: right; }

.br-empty { padding: 3rem; text-align: center; color: rgba(255,255,255,0.2); font-size: 13px; }

/* RIGHT PANEL */
.br-right-panel {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 20px;
  min-height: 400px;
  position: relative;
  overflow: hidden;
}
.br-right-panel::before {
  content:''; position:absolute; top:0; left:0; right:0; height:1px;
  background: linear-gradient(90deg,transparent,rgba(167,139,250,0.3),transparent);
}

.br-no-select {
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  height: 400px; gap: 16px;
  position: relative;
}
.br-no-select-orb {
  position: absolute;
  width: 200px; height: 200px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0,255,178,0.04) 0%, transparent 70%);
  pointer-events: none;
}
.br-no-select-icon {
  width: 72px; height: 72px;
  border-radius: 50%;
  background: rgba(0,255,178,0.05);
  border: 1px solid rgba(0,255,178,0.1);
  display: flex; align-items: center; justify-content: center;
}
.br-no-select-text { font-size: 13px; color: rgba(255,255,255,0.2); text-align: center; line-height: 1.6; }

/* DETAIL */
.br-detail { padding: 22px; }

.br-detail-top {
  display: flex; align-items: center; gap: 14px;
  margin-bottom: 20px; flex-wrap: wrap;
  padding-bottom: 18px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.br-detail-av {
  width: 46px; height: 46px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; font-weight: 700; flex-shrink: 0;
}
.br-detail-info { flex: 1; }
.br-detail-name { font-family:'Outfit',sans-serif; font-size:16px; font-weight:600; margin:0 0 5px; color:#fff; }
.br-detail-batch-tag {
  font-size: 11px; background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.1);
  padding: 3px 10px; border-radius: 20px; color: rgba(255,255,255,0.5);
}
.br-detail-donut { display:flex; flex-direction:column; align-items:center; gap:3px; margin-left:auto; }
.br-donut-center {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  font-size: 13px; font-weight: 700;
  font-family: 'Outfit', sans-serif;
}
.br-donut-lbl { font-size:10px; color:rgba(255,255,255,0.3); letter-spacing:0.1em; text-transform:uppercase; }

.br-detail-metrics {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
  margin-bottom: 18px;
}
@media(max-width:600px){ .br-detail-metrics{ grid-template-columns:repeat(3,1fr); } }

.br-dm-card {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 14px;
  padding: 12px 8px;
  text-align: center;
  transition: transform 0.2s;
}
.br-dm-card:hover { transform: translateY(-2px); }
.br-dm-val { font-family:'Outfit',sans-serif; font-size:18px; font-weight:700; margin:0 0 3px; }
.br-dm-label { font-size:10px; font-weight:600; color:rgba(255,255,255,0.5); margin:0 0 2px; text-transform:uppercase; letter-spacing:0.06em; }
.br-dm-sub { font-size:10px; color:rgba(255,255,255,0.25); margin:0; }

.br-detail-lower {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 16px;
  align-items: start;
}
@media(max-width:600px){ .br-detail-lower{ grid-template-columns:1fr; } }

.br-section-title { font-size:10px; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; color:rgba(255,255,255,0.3); margin:0 0 14px; }
.br-detail-bars, .br-detail-radar { }
.br-prog-row { display:flex; align-items:center; gap:10px; margin-bottom:11px; }
.br-prog-row:last-child { margin-bottom:0; }
.br-prog-lbl { font-size:11px; color:rgba(255,255,255,0.45); width:100px; flex-shrink:0; }
.br-prog-track { flex:1; height:5px; background:rgba(255,255,255,0.07); border-radius:3px; overflow:hidden; }
.br-prog-fill { height:5px; border-radius:3px; transition:width .8s cubic-bezier(0.4,0,0.2,1); }
.br-prog-pct { font-size:12px; font-weight:700; width:38px; text-align:right; }

/* LOADERS */
.br-loader { display:flex; align-items:center; justify-content:center; gap:12px; color:rgba(255,255,255,0.3); font-size:13px; }
.br-spinner { width:20px; height:20px; border:2px solid rgba(0,255,178,0.15); border-top-color:#00FFB2; border-radius:50%; animation:brspin 0.8s linear infinite; }
@keyframes brspin { to{ transform:rotate(360deg); } }
.br-err { color:#FF4D6D; font-size:13px; padding:20px; text-align:center; }
`;


