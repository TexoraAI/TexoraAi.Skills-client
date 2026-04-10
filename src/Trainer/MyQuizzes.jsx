// import axios from "axios";
// import {
//   AlertCircle,
//   Award,
//   Calendar,
//   CheckCircle,
//   Clock,
//   Copy,
//   Download,
//   Edit,
//   Eye,
//   FileText,
//   Filter,
//   Percent,
//   Search,
//   Trash2,
//   Users,
//   X,
// } from "lucide-react";
// import { useEffect, useState } from "react";
// import { deleteQuiz } from "../services/assessmentService";

// const API_BASE_URL =
//   import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

// export default function MyQuizzes() {
//   const [quizzes, setQuizzes] = useState([]);
//   const [selectedQuiz, setSelectedQuiz] = useState(null);
//   const [attempts, setAttempts] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [showAttempts, setShowAttempts] = useState(false);
//   const [showFilter, setShowFilter] = useState(false);
//   const [durationFilter, setDurationFilter] = useState("All");

//   useEffect(() => { loadQuizzes(); }, []);

//   const loadQuizzes = async () => {
//     try {
//       const res = await axios.get(`${API_BASE_URL}/quizzes/trainer`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem("lms_token")}` },
//       });
//       setQuizzes(res.data || []);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id, title) => {
//     if (!window.confirm(`Delete "${title}"?`)) return;
//     await deleteQuiz(id);
//     loadQuizzes();
//   };

//   const loadAttempts = async (quizId, title) => {
//     const token = localStorage.getItem("lms_token");
//     const res = await axios.get(`${API_BASE_URL}/attempts/quiz/${quizId}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     setAttempts(res.data);
//     setSelectedQuiz({ id: quizId, title });
//     setShowAttempts(true);
//   };

//   const filteredQuizzes = quizzes.filter((q) => {
//     const matchesSearch = q.title?.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesDuration =
//       durationFilter === "All" ? true
//       : durationFilter === "Short" ? (q.duration || 30) <= 20
//       : durationFilter === "Medium" ? (q.duration || 30) > 20 && (q.duration || 30) <= 40
//       : (q.duration || 30) > 40;
//     return matchesSearch && matchesDuration;
//   });

//   const exportQuizzes = () => {
//     if (!filteredQuizzes.length) return;
//     const headers = ["Title", "Duration", "Questions", "Marks"];
//     const rows = filteredQuizzes.map((q) => [q.title, q.duration || 30, q.questionCount || 10, q.totalMarks || 100]);
//     const csv = "data:text/csv;charset=utf-8," + [headers, ...rows].map((r) => r.join(",")).join("\n");
//     const link = document.createElement("a");
//     link.href = encodeURI(csv);
//     link.download = "my-quizzes.csv";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
//         <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
//       </div>
//     );
//   }

//   /* ── shared classes ── */
//   const iconBtn = "p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm hover:shadow-md transition-all text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200";
//   const filterBtn = (active) =>
//     `px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm ${
//       active
//         ? "bg-blue-600 text-white shadow-blue-500/25 shadow-md"
//         : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-300"
//     }`;

//   return (
//     <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-5 space-y-5">

//       {/* ── HERO ── */}
//       <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 px-6 py-5 text-white shadow-xl shadow-blue-500/20">
//         <div className="pointer-events-none absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 blur-3xl" />
//         <div className="pointer-events-none absolute -bottom-8 left-1/3 w-32 h-32 rounded-full bg-indigo-400/20 blur-2xl" />
//         <div className="relative flex items-center gap-3">
//           <div className="w-11 h-11 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center shadow-inner shrink-0">
//             <FileText className="w-5 h-5 text-white" />
//           </div>
//           <div>
//             <p className="text-[10px] font-semibold uppercase tracking-widest text-white/60 mb-0.5">Assessment Center</p>
//             <h1 className="text-xl font-bold tracking-tight leading-none">My Quizzes</h1>
//           </div>
//         </div>
//       </div>

//       {/* ── STATS ── */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//         {[
//           { icon: FileText, label: "Total Quizzes", value: quizzes.length, color: "from-cyan-500 to-blue-500", glow: "shadow-blue-500/15" },
//           { icon: Users, label: "Total Attempts", value: attempts.length, color: "from-indigo-500 to-violet-500", glow: "shadow-indigo-500/15" },
//           {
//             icon: Award,
//             label: "Avg Score",
//             value: attempts.length
//               ? (attempts.reduce((s, a) => s + a.score, 0) / attempts.length).toFixed(1) + "%"
//               : "0%",
//             color: "from-emerald-500 to-green-500",
//             glow: "shadow-emerald-500/15",
//           },
//         ].map(({ icon: Icon, label, value, color, glow }) => (
//           <div key={label} className={`rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 flex items-center gap-4 shadow-md ${glow}`}>
//             <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg shrink-0`}>
//               <Icon className="w-5 h-5 text-white" />
//             </div>
//             <div>
//               <p className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">{value}</p>
//               <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-0.5">{label}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* ── SEARCH + FILTER + EXPORT ── */}
//       <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-md space-y-3">
//         <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
//           <div className="relative w-full md:max-w-md">
//             <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
//             <input
//               className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 placeholder:text-slate-400"
//               placeholder="Search quizzes..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>
//           <div className="flex gap-2 shrink-0">
//             <button
//               onClick={() => setShowFilter(!showFilter)}
//               className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border text-xs font-semibold shadow-sm transition-all ${
//                 showFilter
//                   ? "bg-blue-600 text-white border-blue-600 shadow-blue-500/25"
//                   : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-300"
//               }`}
//             >
//               <Filter className="w-3.5 h-3.5" /> Filter
//             </button>
//             <button
//               onClick={exportQuizzes}
//               className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 shadow-sm hover:border-emerald-300 hover:text-emerald-600 transition-all"
//             >
//               <Download className="w-3.5 h-3.5" /> Export
//             </button>
//           </div>
//         </div>

//         {showFilter && (
//           <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2 flex-wrap">
//             {["All", "Short", "Medium", "Long"].map((d) => (
//               <button key={d} className={filterBtn(durationFilter === d)} onClick={() => setDurationFilter(d)}>
//                 {d}
//               </button>
//             ))}
//             <button
//               className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-600 transition"
//               onClick={() => setDurationFilter("All")}
//             >
//               Clear
//             </button>
//           </div>
//         )}
//       </div>

//       {/* ── QUIZ LIST ── */}
//       <div className="space-y-3">
//         {filteredQuizzes.length === 0 && (
//           <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 text-center shadow-sm">
//             <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
//             <p className="text-sm text-slate-400">No quizzes found</p>
//           </div>
//         )}

//         {filteredQuizzes.map((quiz) => (
//           <div
//             key={quiz.id}
//             className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 flex flex-col md:flex-row justify-between gap-4 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all"
//           >
//             <div className="flex gap-3.5 items-center">
//               <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
//                 <FileText className="w-5 h-5 text-white" />
//               </div>
//               <div>
//                 <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm leading-tight">{quiz.title}</h3>
//                 <div className="flex gap-3 text-xs text-slate-400 mt-1.5">
//                   <span className="flex items-center gap-1">
//                     <Clock className="w-3 h-3" /> {quiz.duration || 30} min
//                   </span>
//                   <span className="flex items-center gap-1">
//                     <Award className="w-3 h-3" /> {quiz.totalMarks || 100} marks
//                   </span>
//                 </div>
//               </div>
//             </div>

//             <div className="flex gap-2 items-center shrink-0">
//               <button className={iconBtn} title="View Attempts" onClick={() => loadAttempts(quiz.id, quiz.title)}>
//                 <Eye className="w-4 h-4" />
//               </button>
//               <button className={iconBtn} title="Edit">
//                 <Edit className="w-4 h-4" />
//               </button>
//               <button className={iconBtn} title="Duplicate">
//                 <Copy className="w-4 h-4" />
//               </button>
//               <button
//                 className="p-2 rounded-xl border border-red-100 dark:border-red-900/40 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/50 shadow-sm hover:shadow-md transition-all text-red-500"
//                 title="Delete"
//                 onClick={() => handleDelete(quiz.id, quiz.title)}
//               >
//                 <Trash2 className="w-4 h-4" />
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* ── ATTEMPTS MODAL ── */}
//       {showAttempts && selectedQuiz && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="w-full max-w-4xl max-h-[90vh] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">

//             {/* modal header */}
//             <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
//               <div>
//                 <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-0.5">Attempts</p>
//                 <h2 className="font-bold text-slate-800 dark:text-slate-100 text-sm">{selectedQuiz.title}</h2>
//               </div>
//               <button
//                 className="w-8 h-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center hover:bg-slate-100 transition shadow-sm"
//                 onClick={() => setShowAttempts(false)}
//               >
//                 <X className="w-4 h-4 text-slate-500" />
//               </button>
//             </div>

//             {/* modal body */}
//             <div className="p-5 overflow-y-auto">
//               {attempts.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center py-12 gap-3">
//                   <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
//                     <Users className="w-6 h-6 text-slate-300" />
//                   </div>
//                   <p className="text-sm text-slate-400">No attempts yet</p>
//                 </div>
//               ) : (
//                 <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
//                   <table className="w-full text-sm">
//                     <thead className="bg-slate-50 dark:bg-slate-800">
//                       <tr>
//                         {["Student", "Score", "Status", "Date"].map((h) => (
//                           <th key={h} className="py-3 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
//                         ))}
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
//                       {attempts.map((a) => (
//                         <tr key={a.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
//                           <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">{a.userEmail}</td>
//                           <td className="py-3 px-4">
//                             <span className="inline-flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-200">
//                               <Percent className="w-3 h-3 text-slate-400" />{a.score}%
//                             </span>
//                           </td>
//                           <td className="py-3 px-4">
//                             {a.score >= 70 ? (
//                               <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-100 dark:border-emerald-900">
//                                 <CheckCircle className="w-3 h-3" /> Pass
//                               </span>
//                             ) : (
//                               <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-500 text-xs font-semibold border border-red-100 dark:border-red-900">
//                                 <AlertCircle className="w-3 h-3" /> Fail
//                               </span>
//                             )}
//                           </td>
//                           <td className="py-3 px-4 text-slate-400 text-xs">
//                             <span className="flex items-center gap-1">
//                               <Calendar className="w-3 h-3" />
//                               {new Date(a.submittedAt).toLocaleDateString()}
//                             </span>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }





















// src/trainer/MyQuizzes.jsx
import axios from "axios";
import {
  AlertCircle, Award, Calendar, CheckCircle, Clock, Copy,
  Download, Edit, Eye, FileText, Filter, Percent,
  Search, Trash2, Users, X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { deleteQuiz } from "../services/assessmentService";
import {
  useTrainerTheme, PageShell, PageHero, ThemedCard, CardHeader,
  ThemedInput, PrimaryButton, SecondaryButton,
  EmptyState, StatMiniCard, Pill,
} from "./trainerTheme";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

export default function MyQuizzes() {
  const { t, isDark } = useTrainerTheme();

  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAttempts, setShowAttempts] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [durationFilter, setDurationFilter] = useState("All");

  useEffect(() => { loadQuizzes(); }, []);

  const loadQuizzes = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/quizzes/trainer`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("lms_token")}` },
      });
      setQuizzes(res.data || []);
    } finally { setLoading(false); }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    await deleteQuiz(id);
    loadQuizzes();
  };

  const loadAttempts = async (quizId, title) => {
    const token = localStorage.getItem("lms_token");
    const res = await axios.get(`${API_BASE_URL}/attempts/quiz/${quizId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setAttempts(res.data);
    setSelectedQuiz({ id: quizId, title });
    setShowAttempts(true);
  };

  const filteredQuizzes = quizzes.filter((q) => {
    const matchesSearch = q.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDuration =
      durationFilter === "All" ? true
      : durationFilter === "Short" ? (q.duration || 30) <= 20
      : durationFilter === "Medium" ? (q.duration || 30) > 20 && (q.duration || 30) <= 40
      : (q.duration || 30) > 40;
    return matchesSearch && matchesDuration;
  });

  const exportQuizzes = () => {
    if (!filteredQuizzes.length) return;
    const headers = ["Title", "Duration", "Questions", "Marks"];
    const rows = filteredQuizzes.map((q) => [q.title, q.duration || 30, q.questionCount || 10, q.totalMarks || 100]);
    const csv = "data:text/csv;charset=utf-8," + [headers, ...rows].map((r) => r.join(",")).join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = "my-quizzes.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const avgScore = attempts.length
    ? (attempts.reduce((s, a) => s + a.score, 0) / attempts.length).toFixed(1) + "%"
    : "0%";

  return (
    <PageShell t={t}>
      {/* HERO */}
      <PageHero
        t={t} isDark={isDark}
        icon={FileText}
        badge="Assessment Center"
        title="My Quizzes"
        subtitle="Manage and track all your created quizzes."
        color="#22d3ee"
      />

      {/* STATS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14, marginBottom: 20 }}>
        <StatMiniCard t={t} icon={FileText} color="#22d3ee" value={quizzes.length} label="Total Quizzes" />
        <StatMiniCard t={t} icon={Users}    color="#7c3aed" value={attempts.length} label="Total Attempts" />
        <StatMiniCard t={t} icon={Award}    color="#34d399" value={avgScore}        label="Avg Score" />
      </div>

      {/* SEARCH + FILTER */}
      <ThemedCard t={t} style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
            <Search size={14} color={t.textMuted} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
            <ThemedInput
              t={t}
              placeholder="Search quizzes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: 36 }}
            />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => setShowFilter(!showFilter)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "10px 16px", borderRadius: 12, cursor: "pointer",
                fontFamily: "'Poppins',sans-serif", fontSize: 12, fontWeight: 600,
                background: showFilter ? "#22d3ee" : "transparent",
                color: showFilter ? "#fff" : t.textMuted,
                border: `1px solid ${showFilter ? "#22d3ee" : t.border}`,
                transition: "all 0.2s",
              }}
            >
              <Filter size={13} /> Filter
            </button>
            <button
              onClick={exportQuizzes}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "10px 16px", borderRadius: 12, cursor: "pointer",
                fontFamily: "'Poppins',sans-serif", fontSize: 12, fontWeight: 600,
                background: "transparent", color: t.textMuted,
                border: `1px solid ${t.border}`, transition: "all 0.2s",
              }}
            >
              <Download size={13} /> Export
            </button>
          </div>
        </div>

        {showFilter && (
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${t.border}`, display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["All", "Short", "Medium", "Long"].map((d) => (
              <button key={d} onClick={() => setDurationFilter(d)} style={{
                padding: "6px 14px", borderRadius: 999, cursor: "pointer",
                fontFamily: "'Poppins',sans-serif", fontSize: 11, fontWeight: 700,
                background: durationFilter === d ? "#22d3ee" : "transparent",
                color: durationFilter === d ? "#fff" : t.textMuted,
                border: `1px solid ${durationFilter === d ? "#22d3ee" : t.border}`,
                transition: "all 0.2s",
              }}>{d}</button>
            ))}
          </div>
        )}
      </ThemedCard>

      {/* QUIZ LIST */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {loading ? (
          <ThemedCard t={t}>
            <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
              <div style={{ width: 32, height: 32, border: "3px solid rgba(34,211,238,0.3)", borderTop: "3px solid #22d3ee", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
            </div>
          </ThemedCard>
        ) : filteredQuizzes.length === 0 ? (
          <ThemedCard t={t}>
            <EmptyState t={t} icon={FileText} text="No quizzes found" />
          </ThemedCard>
        ) : (
          filteredQuizzes.map((quiz) => (
            <div key={quiz.id} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              flexWrap: "wrap", gap: 12,
              background: t.cardBg, border: `1px solid ${t.border}`,
              borderRadius: 16, padding: "14px 18px",
              boxShadow: t.shadow, transition: "all 0.2s",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.2)",
                }}>
                  <FileText size={18} color="#22d3ee" />
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: t.text, margin: 0, fontFamily: "'Poppins',sans-serif" }}>{quiz.title}</p>
                  <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: t.textMuted, fontFamily: "'Poppins',sans-serif" }}>
                      <Clock size={11} /> {quiz.duration || 30} min
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: t.textMuted, fontFamily: "'Poppins',sans-serif" }}>
                      <Award size={11} /> {quiz.totalMarks || 100} marks
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {[
                  { icon: Eye,   color: "#22d3ee", onClick: () => loadAttempts(quiz.id, quiz.title), title: "View Attempts" },
                  { icon: Edit,  color: "#7c3aed", onClick: () => {}, title: "Edit" },
                  { icon: Copy,  color: "#fb923c", onClick: () => {}, title: "Duplicate" },
                ].map(({ icon: Icon, color, onClick, title }) => (
                  <button key={title} onClick={onClick} title={title} style={{
                    width: 34, height: 34, borderRadius: 10,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: `${color}18`, border: `1px solid ${color}30`,
                    cursor: "pointer", transition: "all 0.2s",
                  }}>
                    <Icon size={14} color={color} />
                  </button>
                ))}
                <button onClick={() => handleDelete(quiz.id, quiz.title)} title="Delete" style={{
                  width: 34, height: 34, borderRadius: 10,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)",
                  cursor: "pointer", transition: "all 0.2s",
                }}>
                  <Trash2 size={14} color="#f87171" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ATTEMPTS MODAL */}
      {showAttempts && selectedQuiz && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 9999, padding: 16,
        }}>
          <div style={{
            width: "100%", maxWidth: 720, maxHeight: "90vh",
            background: t.cardBg, border: `1px solid ${t.border}`,
            borderRadius: 24, boxShadow: t.shadowHov,
            display: "flex", flexDirection: "column", overflow: "hidden",
          }}>
            {/* modal header */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "16px 20px", borderBottom: `1px solid ${t.border}`,
              background: t.inputBg,
            }}>
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: t.textMuted, margin: 0, fontFamily: "'Poppins',sans-serif" }}>Attempts</p>
                <h2 style={{ fontSize: 14, fontWeight: 700, color: t.text, margin: "3px 0 0", fontFamily: "'Poppins',sans-serif" }}>{selectedQuiz.title}</h2>
              </div>
              <button onClick={() => setShowAttempts(false)} style={{
                width: 32, height: 32, borderRadius: 10,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: t.actBg, border: `1px solid ${t.border}`,
                cursor: "pointer", color: t.textMuted,
              }}>
                <X size={14} />
              </button>
            </div>

            <div style={{ padding: 20, overflowY: "auto" }}>
              {attempts.length === 0 ? (
                <EmptyState t={t} icon={Users} text="No attempts yet" />
              ) : (
                <div style={{ borderRadius: 14, border: `1px solid ${t.border}`, overflow: "hidden" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: t.inputBg }}>
                        {["Student", "Score", "Status", "Date"].map((h) => (
                          <th key={h} style={{
                            padding: "10px 16px", textAlign: "left",
                            fontSize: 10, fontWeight: 700, textTransform: "uppercase",
                            letterSpacing: "0.08em", color: t.textMuted,
                            fontFamily: "'Poppins',sans-serif",
                            borderBottom: `1px solid ${t.border}`,
                          }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {attempts.map((a) => (
                        <tr key={a.id} style={{ borderBottom: `1px solid ${t.border}` }}>
                          <td style={{ padding: "10px 16px", fontSize: 13, fontWeight: 500, color: t.text, fontFamily: "'Poppins',sans-serif" }}>{a.userEmail}</td>
                          <td style={{ padding: "10px 16px", fontSize: 13, fontWeight: 600, color: t.text, fontFamily: "'Poppins',sans-serif" }}>
                            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                              <Percent size={11} color={t.textMuted} />{a.score}%
                            </span>
                          </td>
                          <td style={{ padding: "10px 16px" }}>
                            {a.score >= 70 ? (
                              <span style={{
                                display: "inline-flex", alignItems: "center", gap: 5,
                                padding: "3px 10px", borderRadius: 999,
                                background: "rgba(52,211,153,0.1)", color: "#34d399",
                                border: "1px solid rgba(52,211,153,0.2)",
                                fontSize: 11, fontWeight: 700, fontFamily: "'Poppins',sans-serif",
                              }}>
                                <CheckCircle size={11} /> Pass
                              </span>
                            ) : (
                              <span style={{
                                display: "inline-flex", alignItems: "center", gap: 5,
                                padding: "3px 10px", borderRadius: 999,
                                background: "rgba(248,113,113,0.1)", color: "#f87171",
                                border: "1px solid rgba(248,113,113,0.2)",
                                fontSize: 11, fontWeight: 700, fontFamily: "'Poppins',sans-serif",
                              }}>
                                <AlertCircle size={11} /> Fail
                              </span>
                            )}
                          </td>
                          <td style={{ padding: "10px 16px", fontSize: 11, color: t.textMuted, fontFamily: "'Poppins',sans-serif" }}>
                            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                              <Calendar size={11} />
                              {new Date(a.submittedAt).toLocaleDateString()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}