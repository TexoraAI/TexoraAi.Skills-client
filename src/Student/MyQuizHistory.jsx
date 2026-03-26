// import React, { useEffect, useState } from "react";
// import { getMyQuizHistory } from "../services/assessmentService";
// import {
//   Trophy,
//   Target,
//   Calendar,
//   Award,
//   TrendingUp,
//   FileText,
//   CheckCircle2,
//   XCircle
// } from "lucide-react";

// export default function MyQuizHistory() {
//   const [attempts, setAttempts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadHistory();
//   }, []);

//   const loadHistory = async () => {
//     try {
//       const res = await getMyQuizHistory();
  
//       const list =
//         res?.data?.data ||
//         res?.data?.attempts ||
//         res?.data ||
//         [];
  
//       setAttempts(Array.isArray(list) ? list : []);
  
//     } catch (err) {
//       console.error("Failed to load quiz history", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ================= STATS =================
//   const totalAttempts = attempts.length;

//   const passedAttempts = attempts.filter(a => {
//     const total = a.quiz?.questions?.length || 0;
//     const percent = total > 0 ? (a.score * 100) / total : 0;
//     return percent >= 50;
//   }).length;

//   const averageScore = attempts.length > 0
//     ? attempts.reduce((sum, a) => {
//         const total = a.quiz?.questions?.length || 0;
//         const percent = total > 0 ? (a.score * 100) / total : 0;
//         return sum + percent;
//       }, 0) / attempts.length
//     : 0;

//   /* ================= LOADING ================= */
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
//           <p className="text-slate-600 dark:text-slate-400">
//             Loading quiz history...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-slate-50 dark:bg-slate-950">

//       {/* ================= LIGHT BLUE HERO ================= */}
//       <header
//         className="relative overflow-hidden
//         bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400
//         dark:from-sky-600 dark:via-blue-600 dark:to-indigo-600"
//       >
//         <div className="absolute inset-0 bg-white/10 dark:bg-black/10" />

//         <div className="relative max-w-7xl mx-auto px-6 py-6">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

//             {/* LEFT */}
//             <div>
//               <div className="flex items-center gap-2 mb-1">
//                 <div className="p-2 rounded-md bg-white/30 backdrop-blur shadow">
//                   <Trophy className="h-4 w-4 text-yellow-300" />
//                 </div>
//                 <span className="text-xs font-semibold uppercase tracking-wide text-white/90">
//                   Performance Tracking
//                 </span>
//               </div>

//               <h1 className="text-2xl font-bold text-white">
//                 My Quiz History
//               </h1>

//               <p className="text-sm text-white/85 max-w-xl">
//                 Track your assessment performance and review quiz attempts
//               </p>
//             </div>

//             {/* RIGHT STATS */}
//             <div className="flex flex-wrap gap-3">
//               <Stat
//                 icon={<FileText className="h-4 w-4" />}
//                 label="Attempts"
//                 value={totalAttempts}
//               />
//               <Stat
//                 icon={<CheckCircle2 className="h-4 w-4 text-emerald-300" />}
//                 label="Passed"
//                 value={passedAttempts}
//               />
//               <Stat
//                 icon={<TrendingUp className="h-4 w-4 text-yellow-300" />}
//                 label="Avg Score"
//                 value={`${averageScore.toFixed(1)}%`}
//               />
//             </div>

//           </div>
//         </div>
//       </header>

//       {/* ================= QUIZ HISTORY (UNCHANGED CONTENT AREA) ================= */}
//       <div className="max-w-7xl mx-auto px-6 py-12">
//         {attempts.length === 0 ? (
//           <div className="text-center py-20">
//             <div className="inline-flex items-center justify-center
//                             w-20 h-20 rounded-full
//                             bg-blue-100 dark:bg-blue-900/20 mb-4">
//               <FileText className="h-10 w-10 text-blue-600 dark:text-blue-400" />
//             </div>
//             <p className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">
//               No Quiz Attempts Yet
//             </p>
//             <p className="text-sm text-slate-500 dark:text-slate-400">
//               Your quiz attempts will appear here once you start taking assessments
//             </p>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {/* Desktop table / mobile cards — SAME AS YOUR EXISTING CODE */}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// /* ================= STAT ================= */
// const Stat = ({ icon, label, value }) => (
//   <div className="flex items-center gap-2 px-4 py-2
//                   rounded-xl bg-white/30 backdrop-blur
//                   border border-white/30 text-white shadow">
//     {icon}
//     <div>
//       <p className="text-base font-bold leading-none">{value}</p>
//       <p className="text-[11px] text-white/80">{label}</p>
//     </div>
//   </div>
// );























import React, { useEffect, useRef, useState, useCallback } from "react";
import { getMyQuizHistory } from "../services/assessmentService";
import {
  Trophy,
  Calendar,
  TrendingUp,
  FileText,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export default function MyQuizHistory() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= RESIZABLE PANEL ================= */
  const [leftWidth, setLeftWidth] = useState(65);
  const isDragging = useRef(false);
  const containerRef = useRef(null);

  const onMouseDown = useCallback(() => {
    isDragging.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  const onMouseMove = useCallback((e) => {
    if (!isDragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const newLeft = ((e.clientX - rect.left) / rect.width) * 100;
    if (newLeft > 30 && newLeft < 80) setLeftWidth(newLeft);
  }, []);

  const onMouseUp = useCallback(() => {
    isDragging.current = false;
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  /* ================= DATA ================= */
  useEffect(() => { loadHistory(); }, []);

  const loadHistory = async () => {
    try {
      const res = await getMyQuizHistory();
      const list = res?.data?.data || res?.data?.attempts || res?.data || [];
      setAttempts(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Failed to load quiz history", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= STATS ================= */
  const totalAttempts = attempts.length;

  const passedAttempts = attempts.filter((a) => {
    const total = a.quiz?.questions?.length || 0;
    const percent = total > 0 ? (a.score * 100) / total : 0;
    return percent >= 50;
  }).length;

  const averageScore =
    attempts.length > 0
      ? attempts.reduce((sum, a) => {
          const total = a.quiz?.questions?.length || 0;
          const percent = total > 0 ? (a.score * 100) / total : 0;
          return sum + percent;
        }, 0) / attempts.length
      : 0;

  const getPercent = (a) => {
    const total = a.quiz?.questions?.length || 0;
    return total > 0 ? ((a.score * 100) / total).toFixed(1) : "0.0";
  };

  const isPassed = (a) => parseFloat(getPercent(a)) >= 50;

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-[#0f1b38]">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400 text-sm">Loading quiz history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#0f1b38]">

      {/* ===== PAGE TITLE ===== */}
      <div className="px-6 pt-7 pb-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-2 rounded-lg" style={{ background: "linear-gradient(135deg,#1e3a8a,#1d4ed8)" }}>
            <Trophy className="h-4 w-4 text-yellow-300" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Performance Tracking
          </span>
        </div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">My Quiz History</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Track your assessment performance and review quiz attempts
        </p>
      </div>

      {/* ===== STAT CARDS ===== */}
      <div className="px-6 pb-5 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: <FileText size={18} />,     value: totalAttempts,                   label: "Total Attempts", style: "linear-gradient(135deg,#1e3a8a,#2563eb)" },
            { icon: <CheckCircle2 size={18} />, value: passedAttempts,                  label: "Passed",         style: "linear-gradient(135deg,#166534,#16a34a)" },
            { icon: <XCircle size={18} />,      value: totalAttempts - passedAttempts,  label: "Failed",         style: "linear-gradient(135deg,#991b1b,#dc2626)" },
            { icon: <TrendingUp size={18} />,   value: `${averageScore.toFixed(1)}%`,   label: "Avg Score",      style: "linear-gradient(135deg,#0369a1,#0ea5e9)" },
          ].map((s, i) => (
            <div key={i} className="rounded-xl px-5 py-4 flex flex-col gap-1 text-white shadow-md"
              style={{ background: s.style }}>
              <span className="text-white/70">{s.icon}</span>
              <span className="text-2xl font-extrabold">{s.value}</span>
              <span className="text-xs text-white/65 uppercase tracking-widest font-semibold">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ===== EMPTY STATE ===== */}
      {attempts.length === 0 ? (
        <div className="max-w-7xl mx-auto px-6 pb-6">
          <div className="rounded-2xl border border-slate-200 dark:border-white/10
                          bg-white dark:bg-[#162040] p-16 text-center shadow-sm">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full
                            bg-blue-100 dark:bg-blue-900/20 mb-4">
              <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-base font-semibold text-slate-700 dark:text-slate-200 mb-1">
              No Quiz Attempts Yet
            </p>
            <p className="text-sm text-slate-400">
              Your quiz attempts will appear here once you start taking assessments
            </p>
          </div>
        </div>
      ) : (

        /* ===== SPLIT PANEL ===== */
        <div
          ref={containerRef}
          className="flex mx-6 mb-6 max-w-7xl xl:mx-auto overflow-hidden
                     rounded-2xl border border-slate-200 dark:border-white/10
                     bg-white dark:bg-[#162040] shadow-sm"
          style={{ height: "calc(100vh - 290px)", minHeight: "400px" }}
        >
          {/* ---- LEFT: Quiz List ---- */}
          <div className="flex flex-col overflow-hidden" style={{ width: `${leftWidth}%`, minWidth: "30%" }}>

            <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-100 dark:border-white/10">
              <FileText className="w-4 h-4 text-blue-500 dark:text-blue-400" />
              <span className="text-sm font-bold text-slate-700 dark:text-white tracking-wide">All Attempts</span>
            </div>

            {/* Table header */}
            <div className="grid grid-cols-4 gap-2 px-5 py-2.5
                            bg-slate-50 dark:bg-white/5
                            border-b border-slate-100 dark:border-white/10
                            text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              <span>Quiz</span>
              <span>Score</span>
              <span>Date</span>
              <span>Result</span>
            </div>

            <div className="flex-1 overflow-y-auto">
              {attempts.map((a, idx) => {
                const percent = getPercent(a);
                const passed = isPassed(a);
                return (
                  <div key={idx}
                    className="grid grid-cols-4 gap-2 items-center px-5 py-3
                               border-b border-slate-50 dark:border-white/5
                               hover:bg-slate-50 dark:hover:bg-white/5 transition">

                    {/* Quiz name */}
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex-shrink-0">
                        <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                        {a.quiz?.title || "Quiz"}
                      </span>
                    </div>

                    {/* Score + mini bar */}
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-white">
                        {a.score}/{a.quiz?.questions?.length || "—"}
                      </p>
                      <div className="mt-1 h-1.5 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden w-16">
                        <div className="h-full rounded-full"
                          style={{
                            width: `${percent}%`,
                            background: passed
                              ? "linear-gradient(90deg,#16a34a,#22c55e)"
                              : "linear-gradient(90deg,#dc2626,#ef4444)",
                          }} />
                      </div>
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {a.submittedAt ? new Date(a.submittedAt).toLocaleDateString() : "—"}
                      </span>
                    </div>

                    {/* Result badge */}
                    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full w-fit
                      ${passed
                        ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                        : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                      }`}>
                      {passed ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {passed ? "Pass" : "Fail"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ---- DRAG HANDLE (CRM ←|→) ---- */}
          <div
            onMouseDown={onMouseDown}
            className="relative flex-shrink-0 w-3 flex items-center justify-center
                       cursor-col-resize group z-10
                       bg-slate-100 dark:bg-white/5
                       border-x border-slate-200 dark:border-white/10
                       hover:bg-blue-100 dark:hover:bg-blue-900/30 transition"
          >
            <div className="absolute flex items-center gap-0.5 px-1.5 py-2 rounded-lg
                            bg-white dark:bg-[#1e3a5f]
                            border border-slate-300 dark:border-white/20
                            shadow group-hover:shadow-blue-300/40
                            group-hover:border-blue-400 dark:group-hover:border-blue-600
                            transition select-none">
              <svg width="6" height="12" viewBox="0 0 6 12" fill="none"
                className="text-slate-400 dark:text-slate-300 group-hover:text-blue-500 dark:group-hover:text-blue-400">
                <path d="M1 1L0 6L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <div className="w-px h-4 bg-slate-300 dark:bg-slate-500 group-hover:bg-blue-400 transition mx-0.5" />
              <svg width="6" height="12" viewBox="0 0 6 12" fill="none"
                className="text-slate-400 dark:text-slate-300 group-hover:text-blue-500 dark:group-hover:text-blue-400">
                <path d="M5 1L6 6L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
          </div>

          {/* ---- RIGHT: Performance Summary ---- */}
          <div className="flex flex-col overflow-y-auto" style={{ flex: 1, minWidth: "20%" }}>

            <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-100 dark:border-white/10">
              <TrendingUp className="w-4 h-4 text-blue-500 dark:text-blue-400" />
              <span className="text-sm font-bold text-slate-700 dark:text-white tracking-wide">Performance</span>
            </div>

            <div className="px-5 py-5 space-y-5">

              {/* Avg score */}
              <div className="rounded-xl p-4 text-center border border-slate-100 dark:border-white/8 bg-slate-50 dark:bg-white/5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
                  Average Score
                </p>
                <p className="text-4xl font-extrabold text-blue-600 dark:text-blue-400">
                  {averageScore.toFixed(1)}%
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  across {totalAttempts} attempt{totalAttempts !== 1 ? "s" : ""}
                </p>
                <div className="mt-3 h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${averageScore}%`,
                      background: averageScore >= 50
                        ? "linear-gradient(90deg,#1d4ed8,#16a34a)"
                        : "linear-gradient(90deg,#dc2626,#f97316)",
                    }} />
                </div>
              </div>

              {/* Breakdown */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
                  Breakdown
                </p>
                <div className="space-y-2">
                  {[
                    { label: "Passed", value: passedAttempts,               color: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400" },
                    { label: "Failed", value: totalAttempts - passedAttempts, color: "bg-red-500",   text: "text-red-600 dark:text-red-400" },
                    { label: "Total",  value: totalAttempts,                 color: "bg-blue-500",   text: "text-blue-600 dark:text-blue-400" },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center justify-between px-3 py-2.5 rounded-xl
                                            bg-slate-50 dark:bg-white/5
                                            border border-slate-100 dark:border-white/8">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${s.color}`} />
                        <span className="text-sm text-slate-600 dark:text-slate-300">{s.label}</span>
                      </div>
                      <span className={`text-sm font-bold ${s.text}`}>{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Best attempt */}
              {(() => {
                const best = attempts.reduce((prev, curr) =>
                  parseFloat(getPercent(curr)) > parseFloat(getPercent(prev)) ? curr : prev
                );
                return (
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
                      Best Attempt
                    </p>
                    <div className="flex items-center gap-3 px-3 py-3 rounded-xl
                                    bg-slate-50 dark:bg-white/5
                                    border border-slate-100 dark:border-white/8">
                      <div className="p-2 rounded-lg" style={{ background: "linear-gradient(135deg,#1e3a8a,#1d4ed8)" }}>
                        <Trophy className="w-4 h-4 text-yellow-300" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-800 dark:text-white truncate">
                          {best.quiz?.title || "Quiz"}
                        </p>
                        <p className="text-xs text-slate-400">{getPercent(best)}%</p>
                      </div>
                    </div>
                  </div>
                );
              })()}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}