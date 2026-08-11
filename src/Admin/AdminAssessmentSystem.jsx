// import React, { useState, useEffect, useMemo, useCallback } from "react";
// import {
//   getQuizAdminReport,
//   getAssignmentAdminReport,
//   getCodingProblemAdminReport,
//   getStudyPlanAdminReport,
//   getQuizAttemptsByQuizId,
//   getSubmissionsByAssignment,
//   getAssignmentsByProblemId,
//   getStudyPlanItemsAdmin,
// } from "../services/assessmentService";
// import {
//   FileQuestion,
//   ClipboardList,
//   Code2,
//   BookOpen,
//   Search,
//   ChevronDown,
//   ChevronRight,
//   Loader2,
//   AlertTriangle,
//   CheckCircle2,
//   XCircle,
// } from "lucide-react";

// /* =====================================================================
//    NOTE ON ASSUMPTIONS
//    - Import path "../services/assessmentService" assumes this file lives
//      one level below the folder that holds assessmentService.js (e.g.
//      src/pages/AdminAssessmentSystem.jsx + src/services/assessmentService.js).
//      Adjust the path to match your actual project structure.
//    - Styling uses Tailwind utility classes (no dynamic class-name
//      interpolation, so nothing gets purged in production builds).
//    - UI/UX, responsiveness, dark-mode classes, and interaction patterns
//      (clickable gradient stat cards that double as tab switchers, tab
//      fade-in, mobile-first spacing) are mirrored from
//      SuperAdminAssessmentSystem.jsx so both pages feel like the same
//      product. Data fetching/logic stays scoped to the current admin
//      (no organization column/badge, since this view isn't cross-org).
// ===================================================================== */

// const TABS = [
//   { key: "quiz", label: "Quiz", icon: FileQuestion, accent: "blue" },
//   {
//     key: "assignment",
//     label: "Assignment",
//     icon: ClipboardList,
//     accent: "orange",
//   },
//   { key: "problem", label: "Coding Problem", icon: Code2, accent: "green" },
//   { key: "studyplan", label: "Study Plan", icon: BookOpen, accent: "purple" },
// ];

// // Soft accents (used for badges / tab underline / search focus ring)
// const ACCENTS = {
//   blue: {
//     text: "text-blue-600",
//     bgSoft: "bg-blue-50",
//     bgSolid: "bg-blue-600",
//     border: "border-blue-600",
//     ring: "focus:ring-blue-500",
//     badgeBg: "bg-blue-100",
//     badgeText: "text-blue-700",
//     iconBg: "bg-blue-100",
//   },
//   orange: {
//     text: "text-orange-600",
//     bgSoft: "bg-orange-50",
//     bgSolid: "bg-orange-500",
//     border: "border-orange-500",
//     ring: "focus:ring-orange-500",
//     badgeBg: "bg-orange-100",
//     badgeText: "text-orange-700",
//     iconBg: "bg-orange-100",
//   },
//   green: {
//     text: "text-emerald-600",
//     bgSoft: "bg-emerald-50",
//     bgSolid: "bg-emerald-600",
//     border: "border-emerald-600",
//     ring: "focus:ring-emerald-500",
//     badgeBg: "bg-emerald-100",
//     badgeText: "text-emerald-700",
//     iconBg: "bg-emerald-100",
//   },
//   purple: {
//     text: "text-purple-600",
//     bgSoft: "bg-purple-50",
//     bgSolid: "bg-purple-600",
//     border: "border-purple-600",
//     ring: "focus:ring-purple-500",
//     badgeBg: "bg-purple-100",
//     badgeText: "text-purple-700",
//     iconBg: "bg-purple-100",
//   },
// };

// // Solid gradient backgrounds for the big stat/nav cards, matching the
// // WatchNow-style colored-card look (blue / green / orange / purple).
// const GRADIENTS = {
//   blue: "bg-gradient-to-br from-blue-500 to-blue-600",
//   orange: "bg-gradient-to-br from-orange-400 to-orange-500",
//   green: "bg-gradient-to-br from-emerald-500 to-emerald-600",
//   purple: "bg-gradient-to-br from-purple-500 to-purple-600",
// };

// // Heading + subheading shown at the top of the page, driven by the
// // currently active tab.
// const HEADER_META = {
//   quiz: {
//     title: "Quiz Management",
//     subtitle: "Manage all quizzes you've created",
//   },
//   assignment: {
//     title: "Assignment Management",
//     subtitle: "Manage all assignments you've created",
//   },
//   problem: {
//     title: "Coding Problem Management",
//     subtitle: "Manage all coding problems you've created",
//   },
//   studyplan: {
//     title: "Study Plan Management",
//     subtitle: "Manage all study plans you've created",
//   },
// };

// function formatDate(value) {
//   if (!value) return "—";
//   const d = new Date(value);
//   if (Number.isNaN(d.getTime())) return "—";
//   return d.toLocaleDateString(undefined, {
//     year: "numeric",
//     month: "short",
//     day: "numeric",
//   });
// }

// function sum(list, key) {
//   return list.reduce((acc, item) => acc + (Number(item[key]) || 0), 0);
// }

// /* --------------------------- small pieces --------------------------- */

// // Clickable, colored stat card. Doubles as a tab switcher — clicking any
// // card changes the active tab (and drives the page heading) just like
// // clicking the tab strip below it does.
// function StatCard({ icon: Icon, label, value, accent, isActive, onClick }) {
//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       className={`flex items-center gap-2.5 rounded-xl p-3 text-left text-white shadow-sm transition-all duration-150 sm:gap-4 sm:rounded-2xl sm:p-5 ${GRADIENTS[accent]} ${
//         isActive
//           ? "ring-2 ring-offset-2 ring-white/70 scale-[1.02] shadow-lg"
//           : "opacity-90 hover:opacity-100 hover:scale-[1.01]"
//       }`}
//     >
//       <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/20 sm:h-12 sm:w-12 sm:rounded-xl">
//         <Icon className="h-4 w-4 text-white sm:h-6 sm:w-6" strokeWidth={2.25} />
//       </div>
//       <div className="min-w-0">
//         <p className="text-lg font-semibold leading-tight text-white sm:text-2xl">
//           {value}
//         </p>
//         <p className="truncate text-xs text-white/90 sm:text-sm">{label}</p>
//       </div>
//     </button>
//   );
// }

// function EmptyState({ icon: Icon, message }) {
//   return (
//     <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
//       <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
//         <Icon className="h-7 w-7 text-slate-400 dark:text-slate-500" />
//       </div>
//       <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{message}</p>
//     </div>
//   );
// }

// function StatusBadge({ active }) {
//   return active ? (
//     <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
//       <CheckCircle2 className="h-3.5 w-3.5" /> Active
//     </span>
//   ) : (
//     <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
//       <XCircle className="h-3.5 w-3.5" /> Inactive
//     </span>
//   );
// }

// function SearchBar({ value, onChange, placeholder, accent }) {
//   const a = ACCENTS[accent];
//   return (
//     <div className="relative w-full sm:max-w-xs">
//       <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
//       <input
//         type="text"
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         placeholder={placeholder}
//         className={`w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-2 pl-9 pr-3 text-sm text-slate-700 dark:text-slate-200 outline-none transition focus:border-transparent focus:ring-2 ${a.ring}`}
//       />
//     </div>
//   );
// }

// /* ----------------------- row-expand drill-downs ---------------------- */

// function QuizAttemptsPanel({ quizId }) {
//   const [state, setState] = useState({ loading: true, error: null, rows: [] });

//   useEffect(() => {
//     let alive = true;
//     setState({ loading: true, error: null, rows: [] });
//     getQuizAttemptsByQuizId(quizId)
//       .then((res) => {
//         if (!alive) return;
//         const rows = Array.isArray(res.data) ? res.data : [];
//         setState({ loading: false, error: null, rows });
//       })
//       .catch(() => {
//         if (!alive) return;
//         setState({
//           loading: false,
//           error: "Couldn't load attempts for this quiz.",
//           rows: [],
//         });
//       });
//     return () => {
//       alive = false;
//     };
//   }, [quizId]);

//   if (state.loading) return <InlineLoading label="Loading attempts…" />;
//   if (state.error) return <InlineError message={state.error} />;
//   if (state.rows.length === 0)
//     return <InlineEmpty message="No attempts yet for this quiz." />;

//   return (
//     <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
//       <table className="w-full text-sm">
//         <thead className="bg-slate-50 dark:bg-slate-900 text-left text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
//           <tr>
//             <th className="px-4 py-2 font-medium">Student</th>
//             <th className="px-4 py-2 font-medium">Score</th>
//           </tr>
//         </thead>
//         <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
//           {state.rows.map((row, i) => (
//             <tr key={row.id ?? i}>
//               <td className="px-4 py-2 text-slate-700 dark:text-slate-200">
//                 {row.userEmail ?? "—"}
//               </td>
//               <td className="px-4 py-2 text-slate-700 dark:text-slate-200">{row.score ?? "—"}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// function AssignmentSubmissionsPanel({ assignmentId }) {
//   const [state, setState] = useState({ loading: true, error: null, rows: [] });

//   useEffect(() => {
//     let alive = true;
//     setState({ loading: true, error: null, rows: [] });
//     getSubmissionsByAssignment(assignmentId)
//       .then((res) => {
//         if (!alive) return;
//         const rows = Array.isArray(res.data) ? res.data : [];
//         setState({ loading: false, error: null, rows });
//       })
//       .catch(() => {
//         if (!alive) return;
//         setState({
//           loading: false,
//           error: "Couldn't load submissions for this assignment.",
//           rows: [],
//         });
//       });
//     return () => {
//       alive = false;
//     };
//   }, [assignmentId]);

//   if (state.loading) return <InlineLoading label="Loading submissions…" />;
//   if (state.error) return <InlineError message={state.error} />;
//   if (state.rows.length === 0)
//     return <InlineEmpty message="No submissions yet for this assignment." />;

//   return (
//     <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
//       <table className="w-full text-sm">
//         <thead className="bg-slate-50 dark:bg-slate-900 text-left text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
//           <tr>
//             <th className="px-4 py-2 font-medium">Student</th>
//             <th className="px-4 py-2 font-medium">Status</th>
//             <th className="px-4 py-2 font-medium">Marks</th>
//           </tr>
//         </thead>
//         <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
//           {state.rows.map((row, i) => (
//             <tr key={row.id ?? i}>
//               <td className="px-4 py-2 text-slate-700 dark:text-slate-200">
//                 {row.studentEmail ?? "—"}
//               </td>
//               <td className="px-4 py-2 text-slate-700 dark:text-slate-200">{row.status ?? "—"}</td>
//               <td className="px-4 py-2 text-slate-700 dark:text-slate-200">{row.marks ?? "—"}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// function CodingProblemAssignmentsPanel({ problemId }) {
//   const [state, setState] = useState({ loading: true, error: null, rows: [] });

//   useEffect(() => {
//     let alive = true;
//     setState({ loading: true, error: null, rows: [] });
//     getAssignmentsByProblemId(problemId)
//       .then((res) => {
//         if (!alive) return;
//         setState({
//           loading: false,
//           error: null,
//           rows: Array.isArray(res.data) ? res.data : [],
//         });
//       })
//       .catch(() => {
//         if (!alive) return;
//         setState({
//           loading: false,
//           error: "Couldn't load assigned batches.",
//           rows: [],
//         });
//       });
//     return () => {
//       alive = false;
//     };
//   }, [problemId]);

//   if (state.loading) return <InlineLoading label="Loading assigned batches…" />;
//   if (state.error) return <InlineError message={state.error} />;
//   if (state.rows.length === 0)
//     return <InlineEmpty message="Not assigned to any batch yet." />;

//   return (
//     <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
//       <table className="w-full text-sm">
//         <thead className="bg-slate-50 dark:bg-slate-900 text-left text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
//           <tr>
//             <th className="px-4 py-2 font-medium">Batch</th>
//             <th className="px-4 py-2 font-medium">Assigned By</th>
//             <th className="px-4 py-2 font-medium">Due Date</th>
//           </tr>
//         </thead>
//         <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
//           {state.rows.map((row) => (
//             <tr key={row.assignmentId}>
//               <td className="px-4 py-2 text-slate-700 dark:text-slate-200">{row.batchId}</td>
//               <td className="px-4 py-2 text-slate-700 dark:text-slate-200">
//                 {row.assignedByEmail}
//               </td>
//               <td className="px-4 py-2 text-slate-700 dark:text-slate-200">
//                 {formatDate(row.dueDate)}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// function StudyPlanItemsPanel({ planId }) {
//   const [state, setState] = useState({
//     loading: true,
//     error: null,
//     sections: [],
//   });

//   useEffect(() => {
//     let alive = true;
//     setState({ loading: true, error: null, sections: [] });
//     getStudyPlanItemsAdmin(planId)
//       .then((res) => {
//         if (!alive) return;
//         setState({
//           loading: false,
//           error: null,
//           sections: res.data?.sections ?? [],
//         });
//       })
//       .catch(() => {
//         if (!alive) return;
//         setState({
//           loading: false,
//           error: "Couldn't load items for this study plan.",
//           sections: [],
//         });
//       });
//     return () => {
//       alive = false;
//     };
//   }, [planId]);

//   if (state.loading) return <InlineLoading label="Loading items…" />;
//   if (state.error) return <InlineError message={state.error} />;

//   const allItems = state.sections.flatMap((s) => s.items ?? []);
//   if (allItems.length === 0)
//     return <InlineEmpty message="No items in this study plan." />;

//   return (
//     <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
//       <table className="w-full text-sm">
//         <thead className="bg-slate-50 dark:bg-slate-900 text-left text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
//           <tr>
//             <th className="px-4 py-2 font-medium">Problem</th>
//             <th className="px-4 py-2 font-medium">Difficulty</th>
//             <th className="px-4 py-2 font-medium">Marks</th>
//           </tr>
//         </thead>
//         <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
//           {allItems.map((item) => (
//             <tr key={item.id}>
//               <td className="px-4 py-2 text-slate-700 dark:text-slate-200">{item.problemTitle}</td>
//               <td className="px-4 py-2 text-slate-700 dark:text-slate-200">
//                 {item.problemDifficulty ?? "—"}
//               </td>
//               <td className="px-4 py-2 text-slate-700 dark:text-slate-200">
//                 {item.problemTotalMarks ?? "—"}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// function InlineLoading({ label }) {
//   return (
//     <div className="flex items-center gap-2 px-4 py-4 text-sm text-slate-500 dark:text-slate-400">
//       <Loader2 className="h-4 w-4 animate-spin" /> {label}
//     </div>
//   );
// }

// function InlineError({ message }) {
//   return (
//     <div className="flex items-center gap-2 px-4 py-4 text-sm text-rose-600">
//       <AlertTriangle className="h-4 w-4" /> {message}
//     </div>
//   );
// }

// function InlineEmpty({ message }) {
//   return <div className="px-4 py-4 text-sm text-slate-400 dark:text-slate-500">{message}</div>;
// }

// /* ------------------------------ tables ------------------------------- */

// function QuizTable({ rows, expandedId, onToggle }) {
//   if (rows.length === 0)
//     return <EmptyState icon={FileQuestion} message="No quizzes found." />;
//   return (
//     <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
//       <table className="w-full min-w-[640px] text-sm">
//         <thead className="bg-slate-50 dark:bg-slate-900 text-left text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
//           <tr>
//             <th className="w-10 px-4 py-3" />
//             <th className="px-4 py-3 font-medium">#</th>
//             <th className="px-4 py-3 font-medium">Title</th>
//             <th className="px-4 py-3 font-medium">Creator</th>
//             <th className="px-4 py-3 font-medium">Batch</th>
//             <th className="px-4 py-3 font-medium">Questions</th>
//             <th className="px-4 py-3 font-medium">Attempts</th>
//           </tr>
//         </thead>
//         <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
//           {rows.map((row, i) => {
//             const isOpen = expandedId === row.id;
//             return (
//               <React.Fragment key={row.id ?? i}>
//                 <tr
//                   onClick={() => onToggle(row.id)}
//                   className="cursor-pointer transition hover:bg-slate-50 dark:hover:bg-slate-700/60"
//                 >
//                   <td className="px-4 py-3 text-slate-400 dark:text-slate-500">
//                     {isOpen ? (
//                       <ChevronDown className="h-4 w-4" />
//                     ) : (
//                       <ChevronRight className="h-4 w-4" />
//                     )}
//                   </td>
//                   <td className="px-4 py-3 text-slate-400 dark:text-slate-500">{i + 1}</td>
//                   <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-100">
//                     {row.title}
//                   </td>
//                   <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
//                     {row.trainerEmail}
//                   </td>
//                   <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
//                     {row.batchId ?? "—"}
//                   </td>
//                   <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
//                     {row.questionCount ?? 0}
//                   </td>
//                   <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
//                     {row.attemptCount ?? 0}
//                   </td>
//                 </tr>
//                 {isOpen && (
//                   <tr>
//                     <td colSpan={7} className="bg-slate-50 dark:bg-slate-900 px-4 py-3">
//                       <QuizAttemptsPanel quizId={row.id} />
//                     </td>
//                   </tr>
//                 )}
//               </React.Fragment>
//             );
//           })}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// function AssignmentTable({ rows, expandedId, onToggle }) {
//   if (rows.length === 0)
//     return <EmptyState icon={ClipboardList} message="No assignments found." />;
//   return (
//     <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
//       <table className="w-full min-w-[760px] text-sm">
//         <thead className="bg-slate-50 dark:bg-slate-900 text-left text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
//           <tr>
//             <th className="w-10 px-4 py-3" />
//             <th className="px-4 py-3 font-medium">#</th>
//             <th className="px-4 py-3 font-medium">Title</th>
//             <th className="px-4 py-3 font-medium">Creator</th>
//             <th className="px-4 py-3 font-medium">Batch</th>
//             <th className="px-4 py-3 font-medium">Deadline</th>
//             <th className="px-4 py-3 font-medium">Submissions</th>
//             <th className="px-4 py-3 font-medium">Created</th>
//           </tr>
//         </thead>
//         <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
//           {rows.map((row, i) => {
//             const isOpen = expandedId === row.id;
//             return (
//               <React.Fragment key={row.id ?? i}>
//                 <tr
//                   onClick={() => onToggle(row.id)}
//                   className="cursor-pointer transition hover:bg-slate-50 dark:hover:bg-slate-700/60"
//                 >
//                   <td className="px-4 py-3 text-slate-400 dark:text-slate-500">
//                     {isOpen ? (
//                       <ChevronDown className="h-4 w-4" />
//                     ) : (
//                       <ChevronRight className="h-4 w-4" />
//                     )}
//                   </td>
//                   <td className="px-4 py-3 text-slate-400 dark:text-slate-500">{i + 1}</td>
//                   <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-100">
//                     {row.title}
//                   </td>
//                   <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
//                     {row.trainerEmail}
//                   </td>
//                   <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
//                     {row.batchId ?? "—"}
//                   </td>
//                   <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
//                     {formatDate(row.deadline)}
//                   </td>
//                   <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
//                     {row.submissionCount ?? 0}
//                   </td>
//                   <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
//                     {formatDate(row.createdAt)}
//                   </td>
//                 </tr>
//                 {isOpen && (
//                   <tr>
//                     <td colSpan={8} className="bg-slate-50 dark:bg-slate-900 px-4 py-3">
//                       <AssignmentSubmissionsPanel assignmentId={row.id} />
//                     </td>
//                   </tr>
//                 )}
//               </React.Fragment>
//             );
//           })}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// function ProblemTable({ rows, expandedId, onToggle }) {
//   if (rows.length === 0)
//     return <EmptyState icon={Code2} message="No coding problems found." />;
//   return (
//     <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
//       <table className="w-full min-w-[860px] text-sm">
//         <thead className="bg-slate-50 dark:bg-slate-900 text-left text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
//           <tr>
//             <th className="w-10 px-4 py-3" />
//             <th className="px-4 py-3 font-medium">#</th>
//             <th className="px-4 py-3 font-medium">Title</th>
//             <th className="px-4 py-3 font-medium">Creator</th>
//             <th className="px-4 py-3 font-medium">Difficulty</th>
//             <th className="px-4 py-3 font-medium">Total Marks</th>
//             <th className="px-4 py-3 font-medium">Assigned Batches</th>
//             <th className="px-4 py-3 font-medium">Created</th>
//             <th className="px-4 py-3 font-medium">Status</th>
//           </tr>
//         </thead>
//         <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
//           {rows.map((row, i) => {
//             const isOpen = expandedId === row.id;
//             return (
//               <React.Fragment key={row.id ?? i}>
//                 <tr
//                   onClick={() => onToggle(row.id)}
//                   className="cursor-pointer transition hover:bg-slate-50 dark:hover:bg-slate-700/60"
//                 >
//                   <td className="px-4 py-3 text-slate-400 dark:text-slate-500">
//                     {isOpen ? (
//                       <ChevronDown className="h-4 w-4" />
//                     ) : (
//                       <ChevronRight className="h-4 w-4" />
//                     )}
//                   </td>
//                   <td className="px-4 py-3 text-slate-400 dark:text-slate-500">{i + 1}</td>
//                   <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-100">
//                     {row.title}
//                   </td>
//                   <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
//                     {row.trainerEmail}
//                   </td>
//                   <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
//                     {row.difficulty ?? "—"}
//                   </td>
//                   <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
//                     {row.totalMarks ?? "—"}
//                   </td>
//                   <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
//                     {row.assignedBatchCount ?? 0}
//                   </td>
//                   <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
//                     {formatDate(row.createdAt)}
//                   </td>
//                   <td className="px-4 py-3">
//                     <StatusBadge active={!!row.isActive} />
//                   </td>
//                 </tr>
//                 {isOpen && (
//                   <tr>
//                     <td colSpan={9} className="bg-slate-50 dark:bg-slate-900 px-4 py-3">
//                       <CodingProblemAssignmentsPanel problemId={row.id} />
//                     </td>
//                   </tr>
//                 )}
//               </React.Fragment>
//             );
//           })}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// function StudyPlanTable({ rows, expandedId, onToggle }) {
//   if (rows.length === 0)
//     return <EmptyState icon={BookOpen} message="No study plans found." />;
//   return (
//     <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
//       <table className="w-full min-w-[820px] text-sm">
//         <thead className="bg-slate-50 dark:bg-slate-900 text-left text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
//           <tr>
//             <th className="w-10 px-4 py-3" />
//             <th className="px-4 py-3 font-medium">#</th>
//             <th className="px-4 py-3 font-medium">Title</th>
//             <th className="px-4 py-3 font-medium">Creator</th>
//             <th className="px-4 py-3 font-medium">Batch</th>
//             <th className="px-4 py-3 font-medium">Items</th>
//             <th className="px-4 py-3 font-medium">Due Date</th>
//             <th className="px-4 py-3 font-medium">Created</th>
//             <th className="px-4 py-3 font-medium">Status</th>
//           </tr>
//         </thead>
//         <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
//           {rows.map((row, i) => {
//             const isOpen = expandedId === row.id;
//             return (
//               <React.Fragment key={row.id ?? i}>
//                 <tr
//                   onClick={() => onToggle(row.id)}
//                   className="cursor-pointer transition hover:bg-slate-50 dark:hover:bg-slate-700/60"
//                 >
//                   <td className="px-4 py-3 text-slate-400 dark:text-slate-500">
//                     {isOpen ? (
//                       <ChevronDown className="h-4 w-4" />
//                     ) : (
//                       <ChevronRight className="h-4 w-4" />
//                     )}
//                   </td>
//                   <td className="px-4 py-3 text-slate-400 dark:text-slate-500">{i + 1}</td>
//                   <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-100">
//                     {row.title}
//                   </td>
//                   <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
//                     {row.trainerEmail}
//                   </td>
//                   <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
//                     {row.batchId ?? "—"}
//                   </td>
//                   <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
//                     {row.itemCount ?? 0}
//                   </td>
//                   <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
//                     {formatDate(row.dueDate)}
//                   </td>
//                   <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
//                     {formatDate(row.createdAt)}
//                   </td>
//                   <td className="px-4 py-3">
//                     <StatusBadge active={!!row.active} />
//                   </td>
//                 </tr>
//                 {isOpen && (
//                   <tr>
//                     <td colSpan={9} className="bg-slate-50 dark:bg-slate-900 px-4 py-3">
//                       <StudyPlanItemsPanel planId={row.id} />
//                     </td>
//                   </tr>
//                 )}
//               </React.Fragment>
//             );
//           })}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// /* ------------------------------- page -------------------------------- */

// export default function AdminAssessmentSystem() {
//   const [activeTab, setActiveTab] = useState("quiz");
//   const [expandedId, setExpandedId] = useState(null);
//   const [searchTerms, setSearchTerms] = useState({
//     quiz: "",
//     assignment: "",
//     problem: "",
//     studyplan: "",
//   });

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [data, setData] = useState({
//     quiz: [],
//     assignment: [],
//     problem: [],
//     studyplan: [],
//   });

//   useEffect(() => {
//     let alive = true;
//     setLoading(true);
//     setError(null);

//     Promise.all([
//       getQuizAdminReport(),
//       getAssignmentAdminReport(),
//       getCodingProblemAdminReport(),
//       getStudyPlanAdminReport(),
//     ])
//       .then(([quizRes, assignmentRes, problemRes, studyPlanRes]) => {
//         if (!alive) return;
//         setData({
//           quiz: Array.isArray(quizRes.data) ? quizRes.data : [],
//           assignment: Array.isArray(assignmentRes.data)
//             ? assignmentRes.data
//             : [],
//           problem: Array.isArray(problemRes.data) ? problemRes.data : [],
//           studyplan: Array.isArray(studyPlanRes.data) ? studyPlanRes.data : [],
//         });
//         setLoading(false);
//       })
//       .catch(() => {
//         if (!alive) return;
//         setError("Couldn't load the assessment system data. Please try again.");
//         setLoading(false);
//       });

//     return () => {
//       alive = false;
//     };
//   }, []);

//   const handleTabChange = useCallback((key) => {
//     setActiveTab(key);
//     setExpandedId(null);
//   }, []);

//   const handleToggleRow = useCallback((id) => {
//     setExpandedId((prev) => (prev === id ? null : id));
//   }, []);

//   const filtered = useMemo(() => {
//     const term = searchTerms[activeTab].trim().toLowerCase();
//     const rows = data[activeTab] || [];
//     if (!term) return rows;
//     return rows.filter((row) => {
//       const title = (row.title || "").toLowerCase();
//       const creator = (row.trainerEmail || "").toLowerCase();
//       return title.includes(term) || creator.includes(term);
//     });
//   }, [data, activeTab, searchTerms]);

//   const summaryLine = useMemo(() => {
//     const rows = data[activeTab] || [];
//     if (rows.length === 0) return null;
//     switch (activeTab) {
//       case "quiz": {
//         const batches = new Set(rows.map((r) => r.batchId).filter(Boolean))
//           .size;
//         const attempts = sum(rows, "attemptCount");
//         return `${rows.length} quiz${rows.length === 1 ? "" : "zes"} across ${batches} batch${batches === 1 ? "" : "es"}, ${attempts} total attempt${attempts === 1 ? "" : "s"}`;
//       }
//       case "assignment": {
//         const batches = new Set(rows.map((r) => r.batchId).filter(Boolean))
//           .size;
//         const submissions = sum(rows, "submissionCount");
//         return `${rows.length} assignment${rows.length === 1 ? "" : "s"} across ${batches} batch${batches === 1 ? "" : "es"}, ${submissions} total submission${submissions === 1 ? "" : "s"}`;
//       }
//       case "problem": {
//         const active = rows.filter((r) => r.isActive).length;
//         return `${rows.length} coding problem${rows.length === 1 ? "" : "s"}, ${active} currently active`;
//       }
//       case "studyplan": {
//         const items = sum(rows, "itemCount");
//         return `${rows.length} study plan${rows.length === 1 ? "" : "s"} with ${items} item${items === 1 ? "" : "s"} total`;
//       }
//       default:
//         return null;
//     }
//   }, [data, activeTab]);

//   const activeMeta = TABS.find((t) => t.key === activeTab);
//   const activeAccent = ACCENTS[activeMeta.accent];
//   const activeHeader = HEADER_META[activeTab];

//   const searchPlaceholders = {
//     quiz: "Search quizzes by title or creator…",
//     assignment: "Search assignments by title or creator…",
//     problem: "Search problems by title or creator…",
//     studyplan: "Search study plans by title or creator…",
//   };

//   return (
//     <div className="mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-8 lg:px-8">
//       {/* header — title + subtitle change based on the active tab */}
//       <div key={`header-${activeTab}`} className="mb-5 assessment-tab-fade sm:mb-8">
//         <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
//           {activeHeader.title}
//         </h1>
//         <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">{activeHeader.subtitle}</p>
//       </div>

//       {/* colored stat cards — also act as tab switchers */}
//       <div className="mb-5 grid grid-cols-2 gap-3 sm:mb-8 sm:gap-4 md:grid-cols-4">
//         {TABS.map((tab) => (
//           <StatCard
//             key={tab.key}
//             icon={tab.icon}
//             label={tab.label}
//             value={data[tab.key].length}
//             accent={tab.accent}
//             isActive={activeTab === tab.key}
//             onClick={() => handleTabChange(tab.key)}
//           />
//         ))}
//       </div>

//       {/* tabs */}
//       <div className="mb-6 flex gap-1 overflow-x-auto border-b border-slate-200 dark:border-slate-700 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-2">
//         {TABS.map((tab) => {
//           const isActive = tab.key === activeTab;
//           const a = ACCENTS[tab.accent];
//           const Icon = tab.icon;
//           const count = data[tab.key].length;
//           return (
//             <button
//               key={tab.key}
//               onClick={() => handleTabChange(tab.key)}
//               className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-t-lg border-b-2 px-3 py-2.5 text-xs font-medium transition-all duration-150 sm:gap-2 sm:px-4 sm:text-sm ${
//                 isActive
//                   ? `${a.border} ${a.text}`
//                   : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
//               }`}
//             >
//               <Icon
//                 className={`h-4 w-4 shrink-0 transition-colors duration-150 ${isActive ? a.text : "text-slate-400 dark:text-slate-500"}`}
//               />
//               {tab.label}
//               <span
//                 className={`ml-1 shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold transition-colors duration-150 ${
//                   isActive
//                     ? `${a.badgeBg} ${a.badgeText}`
//                     : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
//                 }`}
//               >
//                 {count}
//               </span>
//             </button>
//           );
//         })}
//       </div>

//       {/* body */}
//       {loading ? (
//         <div className="flex items-center justify-center gap-2 py-24 text-slate-500 dark:text-slate-400">
//           <Loader2 className="h-5 w-5 animate-spin" /> Loading assessment data…
//         </div>
//       ) : error ? (
//         <div className="flex flex-col items-center justify-center gap-2 py-24 text-center">
//           <AlertTriangle className="h-8 w-8 text-rose-500" />
//           <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{error}</p>
//         </div>
//       ) : (
//         <div key={activeTab} className="assessment-tab-fade">
//           <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//             <p className="text-sm text-slate-500 dark:text-slate-400">
//               {summaryLine ?? "No data yet."}
//             </p>
//             <SearchBar
//               value={searchTerms[activeTab]}
//               onChange={(val) =>
//                 setSearchTerms((prev) => ({ ...prev, [activeTab]: val }))
//               }
//               placeholder={searchPlaceholders[activeTab]}
//               accent={activeMeta.accent}
//             />
//           </div>

//           {activeTab === "quiz" && (
//             <QuizTable
//               rows={filtered}
//               expandedId={expandedId}
//               onToggle={handleToggleRow}
//             />
//           )}
//           {activeTab === "assignment" && (
//             <AssignmentTable
//               rows={filtered}
//               expandedId={expandedId}
//               onToggle={handleToggleRow}
//             />
//           )}
//           {activeTab === "problem" && (
//             <ProblemTable
//               rows={filtered}
//               expandedId={expandedId}
//               onToggle={handleToggleRow}
//             />
//           )}
//           {activeTab === "studyplan" && (
//             <StudyPlanTable
//               rows={filtered}
//               expandedId={expandedId}
//               onToggle={handleToggleRow}
//             />
//           )}
//         </div>
//       )}

//       <style>{`
//         .assessment-tab-fade {
//           animation: assessmentTabFade 180ms ease-out;
//         }
//         @keyframes assessmentTabFade {
//           from { opacity: 0; transform: translateY(4px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         @media (prefers-reduced-motion: reduce) {
//           .assessment-tab-fade { animation: none; }
//         }
//       `}</style>
//     </div>
//   );
// }














































import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  getQuizAdminReport,
  getAssignmentAdminReport,
  getCodingProblemAdminReport,
  getStudyPlanAdminReport,
  getQuizAttemptsByQuizId,
  getSubmissionsByAssignment,
  getAssignmentsByProblemId,
  getStudyPlanItemsAdmin,
} from "../services/assessmentService";
import {
  FileQuestion,
  ClipboardList,
  Code2,
  BookOpen,
  Search,
  ChevronDown,
  ChevronRight,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ClipboardCheck,
} from "lucide-react";

// ─── Global Design System — single source of truth for colors, type,
// spacing, radius, StatCard, PageContainer and Hero. This page must not
// redeclare tokens or components that already live there. It now visually
// matches AdminDashboard.jsx (the Golden Reference) and re-uses its
// page-local layout helpers (SectionCard / SectionHeader / IconBadge /
// EmptyBlock) so both pages feel like the same product.
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

/* =====================================================================
   NOTE ON ASSUMPTIONS
   - Import path "../services/assessmentService" assumes this file lives
     one level below the folder that holds assessmentService.js (e.g.
     src/pages/AdminAssessmentSystem.jsx + src/services/assessmentService.js).
     Adjust the path to match your actual project structure.
   - All data fetching, state, handlers, filtering/search logic, and
     drill-down panels are UNCHANGED from the original implementation.
     Only the presentation layer (markup + styling) has been rebuilt on
     top of the shared design-system tokens/components, matching
     AdminDashboard.jsx exactly (same Hero, PageContainer, StatCard,
     SectionCard, spacing, radius, typography, colors).
===================================================================== */

const TABS = [
  { key: "quiz", label: "Quiz", icon: FileQuestion, colorKey: "blue", hex: "#3b82f6" },
  { key: "assignment", label: "Assignment", icon: ClipboardList, colorKey: "amber", hex: "#f59e0b" },
  { key: "problem", label: "Coding Problem", icon: Code2, colorKey: "green", hex: "#16a34a" },
  { key: "studyplan", label: "Study Plan", icon: BookOpen, colorKey: "purple", hex: ACCENT_PURPLE.base },
];

// Heading + subheading shown at the top of the page, driven by the
// currently active tab.
const HEADER_META = {
  quiz: {
    title: "Quiz Management",
    subtitle: "Manage all quizzes you've created",
  },
  assignment: {
    title: "Assignment Management",
    subtitle: "Manage all assignments you've created",
  },
  problem: {
    title: "Coding Problem Management",
    subtitle: "Manage all coding problems you've created",
  },
  studyplan: {
    title: "Study Plan Management",
    subtitle: "Manage all study plans you've created",
  },
};

function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const isDark = () =>
  document.documentElement.classList.contains("dark") ||
  document.documentElement.getAttribute("data-theme") === "dark";

/* ─────────────────────────────────────────────────────────────────────────
   Page-local layout helpers — token-driven only, copied 1:1 in spirit from
   AdminDashboard.jsx so this page inherits identical visuals.
───────────────────────────────────────────────────────────────────────── */

function IconBadge({ icon: Icon, color, size = 34, iconSize = 15 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: RADIUS.chip,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `${color}18`,
        border: `1px solid ${color}30`,
        flexShrink: 0,
      }}
    >
      <Icon size={iconSize} color={color} />
    </div>
  );
}

function SectionCard({ t, children, style }) {
  return (
    <div
      style={{
        background: t.cardBg,
        border: `1px solid ${t.border}`,
        borderRadius: RADIUS.standardCard,
        padding: CARD_PADDING.standardCard,
        boxShadow: t.shadow,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function EmptyBlock({ t, icon: Icon, title }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "28px 0",
        gap: 12,
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 14,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: `1.5px dashed ${t.emptyBorder}`,
          background: t.emptyBg,
        }}
      >
        <Icon size={20} color={t.emptyIcon} />
      </div>
      <p
        style={{
          fontSize: 13,
          color: t.textMuted,
          fontWeight: FONT_WEIGHT.bold,
          fontFamily: FONT_FAMILY,
          margin: 0,
        }}
      >
        {title}
      </p>
    </div>
  );
}

function StatusBadge({ t, active }) {
  const color = active ? "#16a34a" : t.textMuted;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontSize: 11,
        fontWeight: FONT_WEIGHT.bold,
        color,
        background: active ? "#16a34a18" : t.pillBg,
        border: `1px solid ${active ? "#16a34a30" : t.pillBorder}`,
        padding: "3px 9px",
        borderRadius: RADIUS.pill,
        fontFamily: FONT_FAMILY,
      }}
    >
      {active ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function SearchBar({ t, value, onChange, placeholder }) {
  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 280 }}>
      <Search
        size={14}
        color={t.textMuted}
        style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          boxSizing: "border-box",
          borderRadius: RADIUS.chip,
          border: `1px solid ${t.border}`,
          background: t.recentItemBg,
          color: t.text,
          fontFamily: FONT_FAMILY,
          fontSize: 12,
          padding: "9px 12px 9px 32px",
          outline: "none",
        }}
      />
    </div>
  );
}

/* ----------------------- row-expand drill-downs ---------------------- */

function InlineLoading({ t, label }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "16px 4px",
        fontSize: 12,
        color: t.textMuted,
        fontFamily: FONT_FAMILY,
      }}
    >
      <Loader2 size={14} className="ds-spin" /> {label}
    </div>
  );
}

function InlineError({ message }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "16px 4px",
        fontSize: 12,
        color: "#e11d48",
        fontFamily: FONT_FAMILY,
      }}
    >
      <AlertTriangle size={14} /> {message}
    </div>
  );
}

function InlineEmpty({ t, message }) {
  return (
    <div style={{ padding: "16px 4px", fontSize: 12, color: t.textMuted, fontFamily: FONT_FAMILY }}>
      {message}
    </div>
  );
}

function DrillTable({ t, columns, rows }) {
  return (
    <div style={{ overflowX: "auto", borderRadius: RADIUS.chip, border: `1px solid ${t.recentItemBorder}` }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: FONT_FAMILY }}>
        <thead>
          <tr style={{ background: t.recentItemBg }}>
            {columns.map((c) => (
              <th
                key={c}
                style={{
                  textAlign: "left",
                  padding: "8px 14px",
                  fontSize: 10,
                  fontWeight: FONT_WEIGHT.bold,
                  letterSpacing: LETTER_SPACING.eyebrow,
                  textTransform: "uppercase",
                  color: t.textMuted,
                  borderBottom: `1px solid ${t.recentItemBorder}`,
                }}
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((cells, i) => (
            <tr key={i} style={{ borderTop: i === 0 ? "none" : `1px solid ${t.recentItemBorder}` }}>
              {cells.map((cell, j) => (
                <td key={j} style={{ padding: "8px 14px", fontSize: 12, color: t.text }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function QuizAttemptsPanel({ t, quizId }) {
  const [state, setState] = useState({ loading: true, error: null, rows: [] });

  useEffect(() => {
    let alive = true;
    setState({ loading: true, error: null, rows: [] });
    getQuizAttemptsByQuizId(quizId)
      .then((res) => {
        if (!alive) return;
        const rows = Array.isArray(res.data) ? res.data : [];
        setState({ loading: false, error: null, rows });
      })
      .catch(() => {
        if (!alive) return;
        setState({ loading: false, error: "Couldn't load attempts for this quiz.", rows: [] });
      });
    return () => {
      alive = false;
    };
  }, [quizId]);

  if (state.loading) return <InlineLoading t={t} label="Loading attempts…" />;
  if (state.error) return <InlineError message={state.error} />;
  if (state.rows.length === 0) return <InlineEmpty t={t} message="No attempts yet for this quiz." />;

  return (
    <DrillTable
      t={t}
      columns={["Student", "Score"]}
      rows={state.rows.map((row) => [row.userEmail ?? "—", row.score ?? "—"])}
    />
  );
}

function AssignmentSubmissionsPanel({ t, assignmentId }) {
  const [state, setState] = useState({ loading: true, error: null, rows: [] });

  useEffect(() => {
    let alive = true;
    setState({ loading: true, error: null, rows: [] });
    getSubmissionsByAssignment(assignmentId)
      .then((res) => {
        if (!alive) return;
        const rows = Array.isArray(res.data) ? res.data : [];
        setState({ loading: false, error: null, rows });
      })
      .catch(() => {
        if (!alive) return;
        setState({ loading: false, error: "Couldn't load submissions for this assignment.", rows: [] });
      });
    return () => {
      alive = false;
    };
  }, [assignmentId]);

  if (state.loading) return <InlineLoading t={t} label="Loading submissions…" />;
  if (state.error) return <InlineError message={state.error} />;
  if (state.rows.length === 0) return <InlineEmpty t={t} message="No submissions yet for this assignment." />;

  return (
    <DrillTable
      t={t}
      columns={["Student", "Status", "Marks"]}
      rows={state.rows.map((row) => [row.studentEmail ?? "—", row.status ?? "—", row.marks ?? "—"])}
    />
  );
}

function CodingProblemAssignmentsPanel({ t, problemId }) {
  const [state, setState] = useState({ loading: true, error: null, rows: [] });

  useEffect(() => {
    let alive = true;
    setState({ loading: true, error: null, rows: [] });
    getAssignmentsByProblemId(problemId)
      .then((res) => {
        if (!alive) return;
        setState({ loading: false, error: null, rows: Array.isArray(res.data) ? res.data : [] });
      })
      .catch(() => {
        if (!alive) return;
        setState({ loading: false, error: "Couldn't load assigned batches.", rows: [] });
      });
    return () => {
      alive = false;
    };
  }, [problemId]);

  if (state.loading) return <InlineLoading t={t} label="Loading assigned batches…" />;
  if (state.error) return <InlineError message={state.error} />;
  if (state.rows.length === 0) return <InlineEmpty t={t} message="Not assigned to any batch yet." />;

  return (
    <DrillTable
      t={t}
      columns={["Batch", "Assigned By", "Due Date"]}
      rows={state.rows.map((row) => [row.batchId, row.assignedByEmail, formatDate(row.dueDate)])}
    />
  );
}

function StudyPlanItemsPanel({ t, planId }) {
  const [state, setState] = useState({ loading: true, error: null, sections: [] });

  useEffect(() => {
    let alive = true;
    setState({ loading: true, error: null, sections: [] });
    getStudyPlanItemsAdmin(planId)
      .then((res) => {
        if (!alive) return;
        setState({ loading: false, error: null, sections: res.data?.sections ?? [] });
      })
      .catch(() => {
        if (!alive) return;
        setState({ loading: false, error: "Couldn't load items for this study plan.", sections: [] });
      });
    return () => {
      alive = false;
    };
  }, [planId]);

  if (state.loading) return <InlineLoading t={t} label="Loading items…" />;
  if (state.error) return <InlineError message={state.error} />;

  const allItems = state.sections.flatMap((s) => s.items ?? []);
  if (allItems.length === 0) return <InlineEmpty t={t} message="No items in this study plan." />;

  return (
    <DrillTable
      t={t}
      columns={["Problem", "Difficulty", "Marks"]}
      rows={allItems.map((item) => [item.problemTitle, item.problemDifficulty ?? "—", item.problemTotalMarks ?? "—"])}
    />
  );
}

/* ------------------------------ tables ------------------------------- */

function DataTable({ t, rows, columns, expandedId, onToggle, emptyIcon, emptyMessage, renderExpanded }) {
  if (rows.length === 0) return <EmptyBlock t={t} icon={emptyIcon} title={emptyMessage} />;

  return (
    <div style={{ overflowX: "auto", borderRadius: RADIUS.standardCard, border: `1px solid ${t.border}` }}>
      <table style={{ width: "100%", minWidth: 640, borderCollapse: "collapse", fontFamily: FONT_FAMILY }}>
        <thead>
          <tr style={{ background: t.recentItemBg }}>
            <th style={{ width: 34, padding: "10px 8px", borderBottom: `1px solid ${t.border}` }} />
            <th
              style={{
                textAlign: "left",
                padding: "10px 12px",
                fontSize: 10,
                fontWeight: FONT_WEIGHT.bold,
                letterSpacing: LETTER_SPACING.eyebrow,
                textTransform: "uppercase",
                color: t.textMuted,
                borderBottom: `1px solid ${t.border}`,
              }}
            >
              #
            </th>
            {columns.map((c) => (
              <th
                key={c.key}
                style={{
                  textAlign: "left",
                  padding: "10px 12px",
                  fontSize: 10,
                  fontWeight: FONT_WEIGHT.bold,
                  letterSpacing: LETTER_SPACING.eyebrow,
                  textTransform: "uppercase",
                  color: t.textMuted,
                  borderBottom: `1px solid ${t.border}`,
                  whiteSpace: "nowrap",
                }}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const isOpen = expandedId === row.id;
            return (
              <React.Fragment key={row.id ?? i}>
                <tr
                  onClick={() => onToggle(row.id)}
                  style={{
                    cursor: "pointer",
                    borderBottom: `1px solid ${t.recentItemBorder}`,
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = t.recentItemBg)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={{ padding: "10px 8px", color: t.textMuted, textAlign: "center" }}>
                    {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </td>
                  <td style={{ padding: "10px 12px", fontSize: 12, color: t.textMuted }}>{i + 1}</td>
                  {columns.map((c) => (
                    <td
                      key={c.key}
                      style={{
                        padding: "10px 12px",
                        fontSize: 12,
                        fontWeight: c.emphasize ? FONT_WEIGHT.semibold : FONT_WEIGHT.medium,
                        color: c.emphasize ? t.text : t.textMuted,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {c.render(row)}
                    </td>
                  ))}
                </tr>
                {isOpen && (
                  <tr>
                    <td colSpan={columns.length + 2} style={{ background: t.pageBg, padding: "12px 16px" }}>
                      {renderExpanded(row)}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const QUIZ_COLUMNS = [
  { key: "title", label: "Title", emphasize: true, render: (r) => r.title },
  { key: "trainerEmail", label: "Creator", render: (r) => r.trainerEmail },
  { key: "batchId", label: "Batch", render: (r) => r.batchId ?? "—" },
  { key: "questionCount", label: "Questions", render: (r) => r.questionCount ?? 0 },
  { key: "attemptCount", label: "Attempts", render: (r) => r.attemptCount ?? 0 },
];

const ASSIGNMENT_COLUMNS = [
  { key: "title", label: "Title", emphasize: true, render: (r) => r.title },
  { key: "trainerEmail", label: "Creator", render: (r) => r.trainerEmail },
  { key: "batchId", label: "Batch", render: (r) => r.batchId ?? "—" },
  { key: "deadline", label: "Deadline", render: (r) => formatDate(r.deadline) },
  { key: "submissionCount", label: "Submissions", render: (r) => r.submissionCount ?? 0 },
  { key: "createdAt", label: "Created", render: (r) => formatDate(r.createdAt) },
];

const buildProblemColumns = (t) => [
  { key: "title", label: "Title", emphasize: true, render: (r) => r.title },
  { key: "trainerEmail", label: "Creator", render: (r) => r.trainerEmail },
  { key: "difficulty", label: "Difficulty", render: (r) => r.difficulty ?? "—" },
  { key: "totalMarks", label: "Total Marks", render: (r) => r.totalMarks ?? "—" },
  { key: "assignedBatchCount", label: "Assigned Batches", render: (r) => r.assignedBatchCount ?? 0 },
  { key: "createdAt", label: "Created", render: (r) => formatDate(r.createdAt) },
  { key: "isActive", label: "Status", render: (r) => <StatusBadge t={t} active={!!r.isActive} /> },
];

const buildStudyPlanColumns = (t) => [
  { key: "title", label: "Title", emphasize: true, render: (r) => r.title },
  { key: "trainerEmail", label: "Creator", render: (r) => r.trainerEmail },
  { key: "batchId", label: "Batch", render: (r) => r.batchId ?? "—" },
  { key: "itemCount", label: "Items", render: (r) => r.itemCount ?? 0 },
  { key: "dueDate", label: "Due Date", render: (r) => formatDate(r.dueDate) },
  { key: "createdAt", label: "Created", render: (r) => formatDate(r.createdAt) },
  { key: "active", label: "Status", render: (r) => <StatusBadge t={t} active={!!r.active} /> },
];

/* ------------------------------- page -------------------------------- */

export default function AdminAssessmentSystem() {
  const [dark, setDark] = useState(isDark);
  useEffect(() => {
    setDark(isDark());
    const obs = new MutationObserver(() => setDark(isDark()));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
    return () => obs.disconnect();
  }, []);
  const t = dark ? T.dark : T.light;

  const [activeTab, setActiveTab] = useState("quiz");
  const [expandedId, setExpandedId] = useState(null);
  const [searchTerms, setSearchTerms] = useState({
    quiz: "",
    assignment: "",
    problem: "",
    studyplan: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    quiz: [],
    assignment: [],
    problem: [],
    studyplan: [],
  });

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);

    Promise.all([
      getQuizAdminReport(),
      getAssignmentAdminReport(),
      getCodingProblemAdminReport(),
      getStudyPlanAdminReport(),
    ])
      .then(([quizRes, assignmentRes, problemRes, studyPlanRes]) => {
        if (!alive) return;
        setData({
          quiz: Array.isArray(quizRes.data) ? quizRes.data : [],
          assignment: Array.isArray(assignmentRes.data) ? assignmentRes.data : [],
          problem: Array.isArray(problemRes.data) ? problemRes.data : [],
          studyplan: Array.isArray(studyPlanRes.data) ? studyPlanRes.data : [],
        });
        setLoading(false);
      })
      .catch(() => {
        if (!alive) return;
        setError("Couldn't load the assessment system data. Please try again.");
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  const handleTabChange = useCallback((key) => {
    setActiveTab(key);
    setExpandedId(null);
  }, []);

  const handleToggleRow = useCallback((id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  const filtered = useMemo(() => {
    const term = searchTerms[activeTab].trim().toLowerCase();
    const rows = data[activeTab] || [];
    if (!term) return rows;
    return rows.filter((row) => {
      const title = (row.title || "").toLowerCase();
      const creator = (row.trainerEmail || "").toLowerCase();
      return title.includes(term) || creator.includes(term);
    });
  }, [data, activeTab, searchTerms]);

  const activeHeader = HEADER_META[activeTab];

  const searchPlaceholders = {
    quiz: "Search quizzes by title or creator…",
    assignment: "Search assignments by title or creator…",
    problem: "Search problems by title or creator…",
    studyplan: "Search study plans by title or creator…",
  };

  // ── stat cards — rendered through the shared design-system <StatCard>,
  // same shape/colorKey set (blue/amber/green/purple) AdminDashboard uses.
  // Clicking a card switches tabs instead of navigating, since these are
  // sub-views of a single page rather than separate routes.
  const stats = TABS.map((tab) => ({
    label: tab.label,
    numericValue: data[tab.key].length,
    icon: tab.icon,
    colorKey: tab.colorKey,
    change: HEADER_META[tab.key].subtitle,
  }));

  return (
    <PageContainer mode={dark ? "dark" : "light"} pageBg={t.pageBg} textColor={t.text}>
      <style>{`
        @media (max-width:560px){
          .assessment-hero-badges{width:100%;}
        }
        .ds-spin{ animation: dsSpin 0.9s linear infinite; }
        @keyframes dsSpin { from{ transform: rotate(0deg);} to{ transform: rotate(360deg);} }
        .assessment-tab-fade { animation: assessmentTabFade 180ms ease-out; }
        @keyframes assessmentTabFade {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .assessment-tab-fade { animation: none; }
          .ds-spin { animation: none; }
        }
        .assessment-tabstrip::-webkit-scrollbar{ display:none; }
      `}</style>

      {/* ═══ HERO — shared <Hero> component, matches Admin/Trainer Dashboard exactly ═══ */}
      <Hero borderHero={t.borderHero}>
        <div key={`hero-${activeTab}`} className="assessment-tab-fade">
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: ACCENT_PURPLE.base }} />
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
              Assessment System
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
            {activeHeader.title}
          </h1>
          <p
            style={{
              fontSize: FONT_SIZE.bodySmall,
              color: t.textSub,
              margin: 0,
              fontWeight: FONT_WEIGHT.medium,
              fontFamily: FONT_FAMILY,
            }}
          >
            {activeHeader.subtitle}
          </p>
        </div>

        <div className="hero-badges assessment-hero-badges">
          {!loading && !error && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                background: t.actBg,
                border: `1px solid ${t.actBorder}`,
                borderRadius: RADIUS.chip,
                padding: "8px 16px",
                fontSize: 11,
                fontWeight: FONT_WEIGHT.semibold,
                fontFamily: FONT_FAMILY,
                color: t.textSub,
                flexWrap: "wrap",
              }}
            >
              <span>{data.quiz.length} quizzes</span>
              <span style={{ width: 1, height: 14, background: t.actBorder }} />
              <span>{data.assignment.length} assignments</span>
              <span style={{ width: 1, height: 14, background: t.actBorder }} />
              <span>{data.problem.length} problems</span>
              <span style={{ width: 1, height: 14, background: t.actBorder }} />
              <span>{data.studyplan.length} plans</span>
            </div>
          )}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              background: "rgba(124,58,237,0.08)",
              border: "1px solid rgba(124,58,237,0.3)",
              borderRadius: RADIUS.pill,
              padding: "8px 18px",
              color: ACCENT_PURPLE.base,
              fontSize: 11,
              fontWeight: FONT_WEIGHT.bold,
              letterSpacing: LETTER_SPACING.eyebrowWide,
              fontFamily: FONT_FAMILY,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: ACCENT_PURPLE.base, display: "inline-block" }} />
            LIVE
          </div>
        </div>
      </Hero>

      {/* ═══ 4 STAT CARDS — shared <StatCard>, doubling as tab switchers ═══ */}
      <div className="stat-grid" style={{ marginBottom: 20 }}>
        {TABS.map((tab, i) => (
          <div
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            style={{
              cursor: "pointer",
              outline: activeTab === tab.key ? `2px solid ${tab.hex}` : "none",
              outlineOffset: 2,
              borderRadius: RADIUS.standardCard,
              transition: "outline 0.15s",
            }}
          >
            <StatCard stat={stats[i]} index={i} loading={loading} mode={dark ? "dark" : "light"} />
          </div>
        ))}
      </div>

      {/* ═══ MAIN CARD: tabstrip + search + table ═══ */}
      <SectionCard t={t}>
        {/* tab strip */}
        <div
          className="assessment-tabstrip"
          style={{
            display: "flex",
            gap: 8,
            overflowX: "auto",
            borderBottom: `1px solid ${t.recentItemBorder}`,
            marginBottom: 16,
            paddingBottom: 2,
          }}
        >
          {TABS.map((tab) => {
            const isActive = tab.key === activeTab;
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  flexShrink: 0,
                  whiteSpace: "nowrap",
                  border: "none",
                  background: "transparent",
                  borderBottom: isActive ? `2px solid ${tab.hex}` : "2px solid transparent",
                  // Inactive tabs use t.text at reduced opacity instead of
                  // t.textMuted directly — t.textMuted alone was reading
                  // too washed-out against the card background.
                  color: isActive ? tab.hex : t.text,
                  opacity: isActive ? 1 : 0.62,
                  fontFamily: FONT_FAMILY,
                  fontWeight: FONT_WEIGHT.bold,
                  fontSize: 12,
                  padding: "8px 6px",
                  cursor: "pointer",
                }}
              >
                <Icon size={14} />
                {tab.label}
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: FONT_WEIGHT.bold,
                    padding: "1px 7px",
                    borderRadius: RADIUS.pill,
                    background: isActive ? `${tab.hex}18` : t.pillBg,
                    color: isActive ? tab.hex : t.text,
                    border: `1px solid ${isActive ? `${tab.hex}30` : t.pillBorder}`,
                  }}
                >
                  {data[tab.key].length}
                </span>
              </button>
            );
          })}
        </div>

        {loading ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "64px 0",
              color: t.textMuted,
              fontFamily: FONT_FAMILY,
              fontSize: 13,
            }}
          >
            <Loader2 size={16} className="ds-spin" /> Loading assessment data…
          </div>
        ) : error ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              padding: "64px 0",
              textAlign: "center",
            }}
          >
            <AlertTriangle size={28} color="#e11d48" />
            <p style={{ fontSize: 13, fontWeight: FONT_WEIGHT.bold, color: t.text, fontFamily: FONT_FAMILY, margin: 0 }}>
              {error}
            </p>
          </div>
        ) : (
          <div key={activeTab} className="assessment-tab-fade">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                marginBottom: 14,
              }}
            >
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <SearchBar
                  t={t}
                  value={searchTerms[activeTab]}
                  onChange={(val) => setSearchTerms((prev) => ({ ...prev, [activeTab]: val }))}
                  placeholder={searchPlaceholders[activeTab]}
                />
              </div>
            </div>

            {activeTab === "quiz" && (
              <DataTable
                t={t}
                rows={filtered}
                columns={QUIZ_COLUMNS}
                expandedId={expandedId}
                onToggle={handleToggleRow}
                emptyIcon={FileQuestion}
                emptyMessage="No quizzes found."
                renderExpanded={(row) => <QuizAttemptsPanel t={t} quizId={row.id} />}
              />
            )}
            {activeTab === "assignment" && (
              <DataTable
                t={t}
                rows={filtered}
                columns={ASSIGNMENT_COLUMNS}
                expandedId={expandedId}
                onToggle={handleToggleRow}
                emptyIcon={ClipboardList}
                emptyMessage="No assignments found."
                renderExpanded={(row) => <AssignmentSubmissionsPanel t={t} assignmentId={row.id} />}
              />
            )}
            {activeTab === "problem" && (
              <DataTable
                t={t}
                rows={filtered}
                columns={buildProblemColumns(t)}
                expandedId={expandedId}
                onToggle={handleToggleRow}
                emptyIcon={Code2}
                emptyMessage="No coding problems found."
                renderExpanded={(row) => <CodingProblemAssignmentsPanel t={t} problemId={row.id} />}
              />
            )}
            {activeTab === "studyplan" && (
              <DataTable
                t={t}
                rows={filtered}
                columns={buildStudyPlanColumns(t)}
                expandedId={expandedId}
                onToggle={handleToggleRow}
                emptyIcon={BookOpen}
                emptyMessage="No study plans found."
                renderExpanded={(row) => <StudyPlanItemsPanel t={t} planId={row.id} />}
              />
            )}
          </div>
        )}
      </SectionCard>
    </PageContainer>
  );
}