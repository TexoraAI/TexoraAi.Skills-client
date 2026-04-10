// import React, { useState } from "react";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Users,
//   Search,
//   Download,
//   Filter,
//   TrendingUp,
//   Award,
//   CheckCircle,
//   BarChart3,
//   Eye,
//   Target,
//   Calendar,
//   BookOpen,
//   Trophy,
//   Sparkles,
//   ChevronDown,
//   Clock,
//   ArrowUpRight,
//   ArrowDownRight,
//   X,
// } from "lucide-react";

// const StudentReports = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filterBatch, setFilterBatch] = useState("All");
//   const [selectedStudent, setSelectedStudent] = useState(null);

//   // Empty initial data - real data will come from API
//   const students = [];

//   const batches = ["All", "Full Stack A", "React Evening"];

//   // Filter students
//   const filteredStudents = students.filter((student) => {
//     const matchesSearch =
//       student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       student.email.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesBatch =
//       filterBatch === "All" || student.batch === filterBatch;
//     return matchesSearch && matchesBatch;
//   });

//   // Calculate stats
//   const avgProgress =
//     students.length > 0
//       ? students.reduce((acc, s) => acc + s.progress, 0) / students.length
//       : 0;
//   const avgAttendance =
//     students.length > 0
//       ? students.reduce((acc, s) => acc + s.attendance, 0) / students.length
//       : 0;
//   const avgScore =
//     students.length > 0
//       ? students.reduce((acc, s) => acc + s.avgScore, 0) / students.length
//       : 0;
//   const excellentStudents = students.filter(
//     (s) => s.status === "Excellent" || s.status === "Outstanding"
//   ).length;

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Outstanding":
//         return "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800";
//       case "Excellent":
//         return "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800";
//       case "Good":
//         return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800";
//       case "Needs Attention":
//         return "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800";
//       default:
//         return "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400";
//     }
//   };

//   const getProgressColor = (progress) => {
//     if (progress >= 90) return "bg-purple-500";
//     if (progress >= 80) return "bg-emerald-500";
//     if (progress >= 70) return "bg-blue-500";
//     if (progress >= 60) return "bg-amber-500";
//     return "bg-rose-500";
//   };

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
//           <h1 className="text-3xl font-bold text-white mb-2">
//             Student Reports
//           </h1>
//           <p className="text-cyan-100">
//             View individual performance and analytics across all batches
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
//                 <Users className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
//               </div>
//               <TrendingUp className="w-4 h-4 text-cyan-600" />
//             </div>
//             <p className="text-2xl font-bold text-foreground">
//               {students.length}
//             </p>
//             <p className="text-sm text-muted-foreground">Total Students</p>
//           </Card>

//           <Card className="p-6 border-slate-200 dark:border-slate-800 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-slate-900">
//             <div className="flex items-center justify-between mb-2">
//               <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
//                 <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
//               </div>
//               <TrendingUp className="w-4 h-4 text-blue-600" />
//             </div>
//             <p className="text-2xl font-bold text-foreground">
//               {avgProgress.toFixed(0)}%
//             </p>
//             <p className="text-sm text-muted-foreground">Avg Progress</p>
//           </Card>

//           <Card className="p-6 border-slate-200 dark:border-slate-800 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:to-slate-900">
//             <div className="flex items-center justify-between mb-2">
//               <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
//                 <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
//               </div>
//               <TrendingUp className="w-4 h-4 text-emerald-600" />
//             </div>
//             <p className="text-2xl font-bold text-foreground">
//               {avgAttendance.toFixed(0)}%
//             </p>
//             <p className="text-sm text-muted-foreground">Avg Attendance</p>
//           </Card>

//           <Card className="p-6 border-slate-200 dark:border-slate-800 bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-slate-900">
//             <div className="flex items-center justify-between mb-2">
//               <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
//                 <Trophy className="w-5 h-5 text-purple-600 dark:text-purple-400" />
//               </div>
//               <TrendingUp className="w-4 h-4 text-purple-600" />
//             </div>
//             <p className="text-2xl font-bold text-foreground">
//               {excellentStudents}
//             </p>
//             <p className="text-sm text-muted-foreground">Top Performers</p>
//           </Card>
//         </div>

//         {/* Search & Filter Bar */}
//         <Card className="p-4 mb-6 border-slate-200 dark:border-slate-800 shadow-sm">
//           <div className="flex flex-col md:flex-row gap-4">
//             {/* Search */}
//             <div className="flex-1 relative">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//               <Input
//                 placeholder="Search students by name or email..."
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

//           {/* Batch Filter */}
//           <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
//             {batches.map((batch) => (
//               <Button
//                 key={batch}
//                 size="sm"
//                 variant={filterBatch === batch ? "default" : "outline"}
//                 onClick={() => setFilterBatch(batch)}
//                 className={
//                   filterBatch === batch
//                     ? "bg-blue-600 hover:bg-blue-700 text-white"
//                     : ""
//                 }
//               >
//                 {batch}
//               </Button>
//             ))}
//           </div>
//         </Card>

//         {/* Student Table */}
//         {filteredStudents.length === 0 ? (
//           <Card className="p-12 text-center border-slate-200 dark:border-slate-800">
//             <div className="inline-flex p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
//               <Users className="w-12 h-12 text-blue-600 dark:text-blue-400" />
//             </div>
//             <h3 className="text-xl font-semibold text-foreground mb-2">
//               {students.length === 0 ? "No Students Yet" : "No Matching Students"}
//             </h3>
//             <p className="text-sm text-muted-foreground">
//               {students.length === 0
//                 ? "Students will appear here once they're enrolled"
//                 : "Try adjusting your search or filter"}
//             </p>
//           </Card>
//         ) : (
//           <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
//                   <tr className="text-muted-foreground">
//                     <th className="py-4 px-6 text-left font-semibold">
//                       Student
//                     </th>
//                     <th className="py-4 px-6 text-left font-semibold">Batch</th>
//                     <th className="py-4 px-6 text-left font-semibold">
//                       Progress
//                     </th>
//                     <th className="py-4 px-6 text-left font-semibold">
//                       Attendance
//                     </th>
//                     <th className="py-4 px-6 text-left font-semibold">
//                       Assignments
//                     </th>
//                     <th className="py-4 px-6 text-left font-semibold">
//                       Avg Score
//                     </th>
//                     <th className="py-4 px-6 text-left font-semibold">
//                       Status
//                     </th>
//                     <th className="py-4 px-6 text-left font-semibold">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>

//                 <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
//                   {filteredStudents.map((student) => (
//                     <tr
//                       key={student.id}
//                       className="text-foreground hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
//                     >
//                       {/* Student */}
//                       <td className="py-4 px-6">
//                         <div className="flex items-center gap-3">
//                           <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold text-sm shrink-0">
//                             {student.name.charAt(0).toUpperCase()}
//                           </div>
//                           <div>
//                             <p className="font-semibold text-foreground">
//                               {student.name}
//                             </p>
//                             <p className="text-xs text-muted-foreground">
//                               {student.email}
//                             </p>
//                           </div>
//                         </div>
//                       </td>

//                       {/* Batch */}
//                       <td className="py-4 px-6">
//                         <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
//                           <BookOpen className="w-3 h-3" />
//                           {student.batch}
//                         </span>
//                       </td>

//                       {/* Progress */}
//                       <td className="py-4 px-6">
//                         <div className="space-y-1">
//                           <div className="flex items-center justify-between text-xs">
//                             <span className="font-semibold">
//                               {student.progress}%
//                             </span>
//                             {student.trend === "up" ? (
//                               <ArrowUpRight className="w-3 h-3 text-emerald-600" />
//                             ) : (
//                               <ArrowDownRight className="w-3 h-3 text-rose-600" />
//                             )}
//                           </div>
//                           <div className="w-32 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
//                             <div
//                               className={`h-full ${getProgressColor(
//                                 student.progress
//                               )} transition-all`}
//                               style={{ width: `${student.progress}%` }}
//                             />
//                           </div>
//                         </div>
//                       </td>

//                       {/* Attendance */}
//                       <td className="py-4 px-6">
//                         <div className="space-y-1">
//                           <span className="text-xs font-semibold">
//                             {student.attendance}%
//                           </span>
//                           <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
//                             <div
//                               className={`h-full ${
//                                 student.attendance >= 90
//                                   ? "bg-emerald-500"
//                                   : student.attendance >= 75
//                                   ? "bg-blue-500"
//                                   : "bg-amber-500"
//                               } transition-all`}
//                               style={{ width: `${student.attendance}%` }}
//                             />
//                           </div>
//                         </div>
//                       </td>

//                       {/* Assignments */}
//                       <td className="py-4 px-6">
//                         <div className="text-xs">
//                           <span className="font-semibold">
//                             {student.assignments.completed}
//                           </span>
//                           <span className="text-muted-foreground">
//                             /{student.assignments.total}
//                           </span>
//                         </div>
//                       </td>

//                       {/* Avg Score */}
//                       <td className="py-4 px-6">
//                         <div className="flex items-center gap-1.5">
//                           <Award className="w-4 h-4 text-amber-500" />
//                           <span className="font-semibold">
//                             {student.avgScore.toFixed(1)}%
//                           </span>
//                         </div>
//                       </td>

//                       {/* Status */}
//                       <td className="py-4 px-6">
//                         <span
//                           className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(
//                             student.status
//                           )}`}
//                         >
//                           {student.status === "Outstanding" ||
//                           student.status === "Excellent" ? (
//                             <CheckCircle className="w-3 h-3" />
//                           ) : student.status === "Needs Attention" ? (
//                             <Clock className="w-3 h-3" />
//                           ) : (
//                             <Target className="w-3 h-3" />
//                           )}
//                           {student.status}
//                         </span>
//                       </td>

//                       {/* Actions */}
//                       <td className="py-4 px-6">
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => setSelectedStudent(student)}
//                           className="gap-2"
//                         >
//                           <Eye className="w-3.5 h-3.5" />
//                           Details
//                         </Button>
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
//                 Understanding Student Performance
//               </h3>
//               <ul className="text-sm text-muted-foreground space-y-2">
//                 <li className="flex items-start gap-2">
//                   <span className="text-blue-600 dark:text-blue-400 mt-0.5">
//                     •
//                   </span>
//                   <span>
//                     <strong>Outstanding (90%+):</strong> Students excelling in
//                     all areas with exceptional performance
//                   </span>
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <span className="text-blue-600 dark:text-blue-400 mt-0.5">
//                     •
//                   </span>
//                   <span>
//                     <strong>Excellent (80-89%):</strong> Strong performers
//                     showing consistent progress
//                   </span>
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <span className="text-blue-600 dark:text-blue-400 mt-0.5">
//                     •
//                   </span>
//                   <span>
//                     <strong>Good (70-79%):</strong> Satisfactory performance with
//                     room for improvement
//                   </span>
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <span className="text-blue-600 dark:text-blue-400 mt-0.5">
//                     •
//                   </span>
//                   <span>
//                     <strong>Needs Attention (&lt;70%):</strong> Students requiring
//                     additional support and guidance
//                   </span>
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </Card>
//       </div>

//       {/* Student Details Modal (placeholder) */}
//       {selectedStudent && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//           <div
//             className="absolute inset-0 bg-black/60 backdrop-blur-sm"
//             onClick={() => setSelectedStudent(null)}
//           />
//           <Card className="relative z-50 w-full max-w-2xl p-6 border-slate-200 dark:border-slate-800 shadow-2xl">
//             <div className="flex items-start justify-between mb-4">
//               <div>
//                 <h3 className="text-xl font-semibold text-foreground">
//                   {selectedStudent.name}
//                 </h3>
//                 <p className="text-sm text-muted-foreground">
//                   Detailed Performance Report
//                 </p>
//               </div>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 onClick={() => setSelectedStudent(null)}
//               >
//                 <X className="w-5 h-5" />
//               </Button>
//             </div>
//             <p className="text-sm text-muted-foreground">
//               Full detailed analytics coming soon...
//             </p>
//           </Card>
//         </div>
//       )}
//     </div>
//   );
// };

// export default StudentReports;



















import React, { useState } from "react";
import {
  Users, Search, Download, Award, CheckCircle, BarChart3,
  Eye, Target, BookOpen, Trophy, Clock, ArrowUpRight, ArrowDownRight, X,
} from "lucide-react";

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
:root{--bg:#f1f5f9;--card:#ffffff;--tx:#0f172a;--mu:#64748b;--bd:#e2e8f0;
  --c1:#22d3ee;--c2:#fb923c;--c3:#34d399;--c4:#a78bfa;--cr:#f87171;
  --sh:0 4px 24px rgba(0,0,0,0.06);--shl:0 8px 40px rgba(0,0,0,0.10);--r:20px;}
.sr-dk{--bg:#0a0a0a;--card:#111111;--tx:#ffffff;--mu:#94a3b8;--bd:rgba(255,255,255,0.06);
  --sh:0 4px 24px rgba(0,0,0,0.40);--shl:0 8px 40px rgba(0,0,0,0.60);}
.sr{font-family:'Poppins',sans-serif;min-height:100vh;background:var(--bg);color:var(--tx);padding:24px;box-sizing:border-box;}
.sr-in{max-width:1300px;margin:0 auto;display:flex;flex-direction:column;gap:20px;}
.sr-hdr{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);padding:28px 32px;box-shadow:var(--sh);display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap;}
.sr-hdr-l{display:flex;align-items:center;gap:16px;}
.sr-ico{width:52px;height:52px;border-radius:14px;background:rgba(34,211,238,0.10);border:1px solid rgba(34,211,238,0.18);display:flex;align-items:center;justify-content:center;color:var(--c1);flex-shrink:0;}
.sr-bdg{display:inline-flex;align-items:center;gap:6px;padding:4px 11px;border-radius:50px;border:1px solid var(--bd);background:rgba(34,211,238,0.08);color:var(--c1);font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;margin-bottom:6px;}
.sr-h1{font-size:24px;font-weight:800;color:var(--tx);margin:0 0 2px;}
.sr-sub{font-size:13px;color:var(--mu);margin:0;}
.sr-stats{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:16px;}
.sr-stat{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);padding:20px 22px;box-shadow:var(--sh);display:flex;align-items:center;gap:14px;transition:transform .2s,box-shadow .2s;}
.sr-stat:hover{transform:translateY(-2px);box-shadow:var(--shl);}
.sr-si{width:44px;height:44px;border-radius:13px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.sr-sv{font-size:22px;font-weight:800;line-height:1;margin-bottom:3px;}
.sr-sl{font-size:10px;font-weight:600;color:var(--mu);text-transform:uppercase;letter-spacing:.06em;}
.sr-tb{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);padding:20px 24px;box-shadow:var(--sh);}
.sr-sr{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:14px;}
.sr-sw{position:relative;flex:1;min-width:240px;}
.sr-sw svg{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:var(--mu);pointer-events:none;}
.sr-sw input{width:100%;padding:11px 14px 11px 42px;border-radius:13px;border:1px solid var(--bd);background:var(--bg);color:var(--tx);font-family:'Poppins',sans-serif;font-size:13px;font-weight:500;outline:none;box-sizing:border-box;transition:border-color .2s,box-shadow .2s;}
.sr-sw input::placeholder{color:var(--mu);}
.sr-sw input:focus{border-color:var(--c1);box-shadow:0 0 0 3px rgba(34,211,238,.12);}
.sr-ebtn{display:inline-flex;align-items:center;gap:6px;padding:11px 18px;border-radius:13px;border:1px solid var(--bd);background:var(--bg);color:var(--mu);font-family:'Poppins',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:border-color .2s,color .2s;}
.sr-ebtn:hover{border-color:rgba(34,211,238,.30);color:var(--c1);}
.sr-br{display:flex;gap:8px;flex-wrap:wrap;}
.sr-bb{padding:7px 16px;border-radius:10px;border:1px solid var(--bd);background:transparent;color:var(--mu);font-family:'Poppins',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:all .15s;}
.sr-bb:hover{border-color:rgba(34,211,238,.30);color:var(--c1);}
.sr-bb.on{background:var(--c1);color:#0a0a0a;border-color:var(--c1);}
.sr-emp{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);padding:60px 20px;text-align:center;box-shadow:var(--sh);}
.sr-ei{width:72px;height:72px;border-radius:20px;background:rgba(34,211,238,.10);border:1px solid rgba(34,211,238,.15);display:flex;align-items:center;justify-content:center;color:var(--c1);margin:0 auto 16px;}
.sr-et{font-size:18px;font-weight:700;color:var(--tx);margin:0 0 6px;}
.sr-es{font-size:13px;color:var(--mu);margin:0;}
.sr-tw{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);box-shadow:var(--sh);overflow:hidden;}
table.sr-t{width:100%;border-collapse:collapse;font-size:13px;}
.sr-t thead th{padding:14px 20px;text-align:left;font-size:11px;font-weight:700;color:var(--mu);text-transform:uppercase;letter-spacing:.06em;background:var(--bg);border-bottom:1px solid var(--bd);}
.sr-t tbody tr{border-bottom:1px solid var(--bd);transition:background .15s;}
.sr-t tbody tr:last-child{border-bottom:none;}
.sr-t tbody tr:hover{background:rgba(34,211,238,.03);}
.sr-t tbody td{padding:14px 20px;vertical-align:middle;}
.sr-av{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:#0a0a0a;flex-shrink:0;background:var(--c1);}
.sr-nm{font-size:13px;font-weight:700;color:var(--tx);margin:0 0 2px;}
.sr-em{font-size:11px;color:var(--mu);margin:0;}
.sr-bt{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:8px;font-size:11px;font-weight:700;background:rgba(34,211,238,.08);color:var(--c1);border:1px solid rgba(34,211,238,.15);}
.sr-pb{width:100px;height:6px;border-radius:99px;background:var(--bd);overflow:hidden;margin-top:4px;}
.sr-pf{height:100%;border-radius:99px;}
.sr-sc{display:flex;align-items:center;gap:5px;font-weight:700;color:var(--tx);}
.sr-st{display:inline-flex;align-items:center;gap:5px;padding:5px 11px;border-radius:9px;font-size:11px;font-weight:700;border:1px solid;}
.sr-db{display:inline-flex;align-items:center;gap:6px;padding:8px 14px;border-radius:10px;border:1px solid var(--bd);background:transparent;color:var(--mu);font-family:'Poppins',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:all .15s;}
.sr-db:hover{border-color:rgba(34,211,238,.30);color:var(--c1);}
.sr-hp{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);padding:24px 28px;box-shadow:var(--sh);display:flex;gap:16px;}
.sr-hi{width:44px;height:44px;border-radius:13px;background:rgba(34,211,238,.10);border:1px solid rgba(34,211,238,.15);display:flex;align-items:center;justify-content:center;color:var(--c1);flex-shrink:0;margin-top:2px;}
.sr-ht{font-size:14px;font-weight:700;color:var(--tx);margin:0 0 12px;}
.sr-hl{display:flex;flex-direction:column;gap:8px;}
.sr-hli{display:flex;align-items:flex-start;gap:8px;font-size:12px;color:var(--mu);}
.sr-hd{width:6px;height:6px;border-radius:50%;background:var(--c1);flex-shrink:0;margin-top:4px;}
.sr-mo{position:fixed;inset:0;z-index:50;background:rgba(0,0,0,.68);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;padding:20px;}
.sr-mc{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);width:100%;max-width:560px;padding:28px;box-shadow:var(--shl);}
.sr-mh{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:16px;}
.sr-mt{font-size:18px;font-weight:800;color:var(--tx);margin:0 0 4px;}
.sr-ms{font-size:12px;color:var(--mu);margin:0;}
.sr-mx{width:32px;height:32px;border-radius:9px;border:1px solid var(--bd);background:var(--bg);color:var(--mu);display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;transition:background .2s,color .2s;}
.sr-mx:hover{background:rgba(248,113,113,.10);color:var(--cr);}
.sr-mb{font-size:13px;color:var(--mu);}
`;

if (!document.getElementById("sr-st")) { const t=document.createElement("style"); t.id="sr-st"; t.textContent=STYLES; document.head.appendChild(t); }
const isDark=()=>document.documentElement.classList.contains("dark")||document.body.classList.contains("dark")||window.matchMedia("(prefers-color-scheme: dark)").matches;

const StudentReports = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBatch, setFilterBatch] = useState("All");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [dark, setDark] = useState(isDark);
  React.useEffect(()=>{const o=new MutationObserver(()=>setDark(isDark()));o.observe(document.documentElement,{attributes:true,attributeFilter:["class"]});o.observe(document.body,{attributes:true,attributeFilter:["class"]});return()=>o.disconnect();},[]);

  const students=[];
  const batches=["All","Full Stack A","React Evening"];
  const filteredStudents=students.filter(s=>{
    const ms=s.name.toLowerCase().includes(searchQuery.toLowerCase())||s.email.toLowerCase().includes(searchQuery.toLowerCase());
    const mb=filterBatch==="All"||s.batch===filterBatch;
    return ms&&mb;
  });
  const avgProgress=students.length>0?students.reduce((a,s)=>a+s.progress,0)/students.length:0;
  const avgAttendance=students.length>0?students.reduce((a,s)=>a+s.attendance,0)/students.length:0;
  const excellentStudents=students.filter(s=>s.status==="Excellent"||s.status==="Outstanding").length;

  const stStyle=s=>{
    if(s==="Outstanding") return{background:"rgba(167,139,250,.10)",color:"var(--c4)",borderColor:"rgba(167,139,250,.20)"};
    if(s==="Excellent")   return{background:"rgba(52,211,153,.10)", color:"var(--c3)",borderColor:"rgba(52,211,153,.20)"};
    if(s==="Good")        return{background:"rgba(34,211,238,.10)", color:"var(--c1)",borderColor:"rgba(34,211,238,.20)"};
    if(s==="Needs Attention") return{background:"rgba(251,146,60,.10)",color:"var(--c2)",borderColor:"rgba(251,146,60,.20)"};
    return{background:"rgba(100,116,139,.10)",color:"var(--mu)",borderColor:"var(--bd)"};
  };
  const pgColor=p=>p>=90?"var(--c4)":p>=80?"var(--c3)":p>=70?"var(--c1)":p>=60?"var(--c2)":"var(--cr)";

  const stats=[
    {icon:<Users size={20}/>,value:students.length,label:"Total Students",accent:"var(--c1)",bg:"rgba(34,211,238,.10)"},
    {icon:<Target size={20}/>,value:`${avgProgress.toFixed(0)}%`,label:"Avg Progress",accent:"var(--c2)",bg:"rgba(251,146,60,.10)"},
    {icon:<CheckCircle size={20}/>,value:`${avgAttendance.toFixed(0)}%`,label:"Avg Attendance",accent:"var(--c3)",bg:"rgba(52,211,153,.10)"},
    {icon:<Trophy size={20}/>,value:excellentStudents,label:"Top Performers",accent:"var(--c4)",bg:"rgba(167,139,250,.10)"},
  ];

  return(
    <div className={`sr${dark?" sr-dk":""}`}>
      <div className="sr-in">
        <div className="sr-hdr">
          <div className="sr-hdr-l">
            <div className="sr-ico"><BarChart3 size={24}/></div>
            <div>
              <div className="sr-bdg"><BarChart3 size={10}/> Analytics & Reporting</div>
              <h1 className="sr-h1">Student Reports</h1>
              <p className="sr-sub">View individual performance and analytics across all batches</p>
            </div>
          </div>
        </div>

        <div className="sr-stats">
          {stats.map((s,i)=>(
            <div key={i} className="sr-stat">
              <div className="sr-si" style={{background:s.bg,color:s.accent}}>{s.icon}</div>
              <div><div className="sr-sv" style={{color:s.accent}}>{s.value}</div><div className="sr-sl">{s.label}</div></div>
            </div>
          ))}
        </div>

        <div className="sr-tb">
          <div className="sr-sr">
            <div className="sr-sw"><Search size={15}/><input placeholder="Search students by name or email..." value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}/></div>
            <button className="sr-ebtn"><Download size={14}/> Export</button>
          </div>
          <div className="sr-br">
            {batches.map(b=><button key={b} className={`sr-bb${filterBatch===b?" on":""}`} onClick={()=>setFilterBatch(b)}>{b}</button>)}
          </div>
        </div>

        {filteredStudents.length===0?(
          <div className="sr-emp">
            <div className="sr-ei"><Users size={32}/></div>
            <h3 className="sr-et">{students.length===0?"No Students Yet":"No Matching Students"}</h3>
            <p className="sr-es">{students.length===0?"Students will appear here once they're enrolled":"Try adjusting your search or filter"}</p>
          </div>
        ):(
          <div className="sr-tw">
            <div style={{overflowX:"auto"}}>
              <table className="sr-t">
                <thead><tr>{["Student","Batch","Progress","Attendance","Assignments","Avg Score","Status","Actions"].map(h=><th key={h}>{h}</th>)}</tr></thead>
                <tbody>
                  {filteredStudents.map(s=>{
                    const ss=stStyle(s.status);
                    return(
                      <tr key={s.id}>
                        <td><div style={{display:"flex",alignItems:"center",gap:10}}><div className="sr-av">{s.name.charAt(0).toUpperCase()}</div><div><p className="sr-nm">{s.name}</p><p className="sr-em">{s.email}</p></div></div></td>
                        <td><span className="sr-bt"><BookOpen size={11}/>{s.batch}</span></td>
                        <td>
                          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",fontSize:11,fontWeight:700,marginBottom:4}}>
                            <span>{s.progress}%</span>
                            {s.trend==="up"?<ArrowUpRight size={12} style={{color:"var(--c3)"}}/>:<ArrowDownRight size={12} style={{color:"var(--cr)"}}/>}
                          </div>
                          <div className="sr-pb"><div className="sr-pf" style={{width:`${s.progress}%`,background:pgColor(s.progress)}}/></div>
                        </td>
                        <td>
                          <div style={{fontSize:11,fontWeight:700,marginBottom:4}}>{s.attendance}%</div>
                          <div className="sr-pb" style={{width:80}}><div className="sr-pf" style={{width:`${s.attendance}%`,background:s.attendance>=90?"var(--c3)":s.attendance>=75?"var(--c1)":"var(--c2)"}}/></div>
                        </td>
                        <td><span style={{fontSize:13,fontWeight:700,color:"var(--tx)"}}>{s.assignments.completed}</span><span style={{fontSize:12,color:"var(--mu)"}}>/{s.assignments.total}</span></td>
                        <td><div className="sr-sc"><Award size={14} style={{color:"var(--c2)"}}/>{s.avgScore.toFixed(1)}%</div></td>
                        <td><span className="sr-st" style={ss}>{s.status==="Outstanding"||s.status==="Excellent"?<CheckCircle size={11}/>:s.status==="Needs Attention"?<Clock size={11}/>:<Target size={11}/>}{s.status}</span></td>
                        <td><button className="sr-db" onClick={()=>setSelectedStudent(s)}><Eye size={13}/> Details</button></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="sr-hp">
          <div className="sr-hi"><Trophy size={20}/></div>
          <div>
            <h3 className="sr-ht">Understanding Student Performance</h3>
            <div className="sr-hl">
              {[["Outstanding (90%+)","Students excelling in all areas"],["Excellent (80-89%)","Strong performers showing consistent progress"],["Good (70-79%)","Satisfactory performance with room for improvement"],["Needs Attention (<70%)","Students requiring additional support"]].map(([b,r],i)=>(
                <div key={i} className="sr-hli"><span className="sr-hd"/><span><strong style={{color:"var(--tx)"}}>{b}:</strong> {r}</span></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedStudent&&(
        <div className={`sr-mo${dark?" sr-dk":""}`} onClick={()=>setSelectedStudent(null)}>
          <div className="sr-mc" onClick={e=>e.stopPropagation()}>
            <div className="sr-mh">
              <div><h3 className="sr-mt">{selectedStudent.name}</h3><p className="sr-ms">Detailed Performance Report</p></div>
              <button className="sr-mx" onClick={()=>setSelectedStudent(null)}><X size={15}/></button>
            </div>
            <p className="sr-mb">Full detailed analytics coming soon...</p>
          </div>
        </div>
      )}
    </div>
  );
};
export default StudentReports;