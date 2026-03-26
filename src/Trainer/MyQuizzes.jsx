// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
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

//   useEffect(() => {
//     loadQuizzes();
//   }, []);

//   const loadQuizzes = async () => {
//     try {
//       const res = await axios.get(`${API_BASE_URL}/quizzes/trainer`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
//         },
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
//     const matchesSearch = q.title
//       ?.toLowerCase()
//       .includes(searchQuery.toLowerCase());

//     const matchesDuration =
//       durationFilter === "All"
//         ? true
//         : durationFilter === "Short"
//           ? (q.duration || 30) <= 20
//           : durationFilter === "Medium"
//             ? (q.duration || 30) > 20 && (q.duration || 30) <= 40
//             : (q.duration || 30) > 40;

//     return matchesSearch && matchesDuration;
//   });

//   const exportQuizzes = () => {
//     if (!filteredQuizzes.length) return;

//     const headers = ["Title", "Duration", "Questions", "Marks"];
//     const rows = filteredQuizzes.map((q) => [
//       q.title, q.duration || 30, q.questionCount || 10, q.totalMarks || 100,
//     ]);

//     const csv =
//       "data:text/csv;charset=utf-8," +
//       [headers, ...rows].map((r) => r.join(",")).join("\n");

//     const link = document.createElement("a");
//     link.href = encodeURI(csv);
//     link.download = "my-quizzes.csv";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-5">
//       <div className="max-w-7xl mx-auto space-y-6">
//         {/* HEADER */}
//         <div className="rounded-xl bg-gradient-to-r from-[#38BDF8] via-[#3B82F6] to-[#6366F1] p-5 text-white">
//           <div className="flex items-center gap-3">
//             <FileText className="w-6 h-6" />
//             <div>
//               <h1 className="text-xl font-bold">My Quizzes</h1>
//               <p className="text-sm opacity-90">Manage quizzes & track performance</p>
//             </div>
//           </div>
//         </div>

//         {/* STATS */}
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//           <StatCard icon={FileText} label="Total Quizzes" value={quizzes.length} />
//           <StatCard icon={Users} label="Total Attempts" value={attempts.length} />
//           <StatCard
//             icon={Award}
//             label="Avg Score"
//             value={
//               attempts.length
//                 ? (attempts.reduce((s, a) => s + a.score, 0) / attempts.length).toFixed(1) + "%"
//                 : "0%"
//             }
//           />
//         </div>

//         {/* SEARCH + FILTER + EXPORT */}
//         <Card className="p-4 space-y-4">
//           <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
//             <div className="relative w-full md:max-w-md">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
//               <input
//                 className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border bg-slate-50 dark:bg-slate-800 outline-none"
//                 placeholder="Search quizzes..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>
//             <div className="flex gap-2">
//               <Button size="sm" variant="outline" onClick={() => setShowFilter(!showFilter)}>
//                 <Filter className="w-4 h-4 mr-1" /> Filter
//               </Button>
//               <Button size="sm" variant="outline" onClick={exportQuizzes}>
//                 <Download className="w-4 h-4 mr-1" /> Export
//               </Button>
//             </div>
//           </div>

//           {showFilter && (
//             <div className="pt-3 border-t flex gap-2 flex-wrap">
//               {["All", "Short", "Medium", "Long"].map((d) => (
//                 <Button
//                   key={d}
//                   size="sm"
//                   variant={durationFilter === d ? "default" : "outline"}
//                   onClick={() => setDurationFilter(d)}
//                 >
//                   {d}
//                 </Button>
//               ))}
//               <Button size="sm" variant="ghost" onClick={() => setDurationFilter("All")}>
//                 Clear
//               </Button>
//             </div>
//           )}
//         </Card>

//         {/* QUIZ LIST */}
//         <div className="space-y-3">
//           {filteredQuizzes.map((quiz) => (
//             <Card key={quiz.id} className="p-4 flex flex-col md:flex-row justify-between gap-4">
//               <div className="flex gap-3">
//                 <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
//                   <FileText className="w-5 h-5 text-blue-600" />
//                 </div>
//                 <div>
//                   <h3 className="font-semibold">{quiz.title}</h3>
//                   <div className="flex gap-3 text-xs text-slate-500 mt-1">
//                     <span className="flex items-center gap-1">
//                       <Clock className="w-3 h-3" /> {quiz.duration || 30} min
//                     </span>
//                     <span className="flex items-center gap-1">
//                       <Award className="w-3 h-3" /> {quiz.totalMarks || 100}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//               <div className="flex gap-2">
//                 <Button size="sm" variant="outline" onClick={() => loadAttempts(quiz.id, quiz.title)}>
//                   <Eye className="w-4 h-4" />
//                 </Button>
//                 <Button size="sm" variant="outline"><Edit className="w-4 h-4" /></Button>
//                 <Button size="sm" variant="outline"><Copy className="w-4 h-4" /></Button>
//                 <Button size="sm" variant="outline" className="text-red-600" onClick={() => handleDelete(quiz.id, quiz.title)}>
//                   <Trash2 className="w-4 h-4" />
//                 </Button>
//               </div>
//             </Card>
//           ))}
//         </div>

//         {/* ATTEMPTS MODAL */}
//         {showAttempts && selectedQuiz && (
//           <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//             <Card className="w-full max-w-5xl max-h-[90vh] overflow-hidden">
//               <div className="flex justify-between items-center p-4 border-b">
//                 <h2 className="font-bold">{selectedQuiz.title}</h2>
//                 <Button size="sm" variant="ghost" onClick={() => setShowAttempts(false)}>
//                   <X className="w-4 h-4" />
//                 </Button>
//               </div>
//               <div className="p-4 overflow-y-auto">
//                 {attempts.length === 0 ? (
//                   <p className="text-center text-sm text-slate-500">No attempts yet</p>
//                 ) : (
//                   <table className="w-full text-sm">
//                     <thead className="border-b text-slate-500">
//                       <tr>
//                         <th className="py-2 text-left">Student</th>
//                         <th className="py-2 text-center">Score</th>
//                         <th className="py-2 text-center">Status</th>
//                         <th className="py-2 text-center">Date</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {attempts.map((a) => (
//                         <tr key={a.id} className="border-b">
//                           <td className="py-2">{a.userEmail}</td>
//                           <td className="py-2 text-center">
//                             <Percent className="inline w-3 h-3 mr-1" />{a.score}%
//                           </td>
//                           <td className="py-2 text-center">
//                             {a.score >= 70 ? (
//                               <span className="inline-flex items-center gap-1 text-emerald-600">
//                                 <CheckCircle className="w-4 h-4" /> Pass
//                               </span>
//                             ) : (
//                               <span className="inline-flex items-center gap-1 text-red-600">
//                                 <AlertCircle className="w-4 h-4" /> Fail
//                               </span>
//                             )}
//                           </td>
//                           <td className="py-2 text-center">
//                             <Calendar className="inline w-3 h-3 mr-1" />
//                             {new Date(a.submittedAt).toLocaleDateString()}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 )}
//               </div>
//             </Card>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// const StatCard = ({ icon: Icon, label, value }) => (
//   <Card className="p-4 flex items-center gap-3">
//     <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
//       <Icon className="w-5 h-5 text-blue-600" />
//     </div>
//     <div>
//       <p className="text-lg font-semibold">{value}</p>
//       <p className="text-xs text-slate-500">{label}</p>
//     </div>
//   </Card>
// );




















import axios from "axios";
import {
  AlertCircle,
  Award,
  Calendar,
  CheckCircle,
  Clock,
  Copy,
  Download,
  Edit,
  Eye,
  FileText,
  Filter,
  Percent,
  Search,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { deleteQuiz } from "../services/assessmentService";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

export default function MyQuizzes() {
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
    } finally {
      setLoading(false);
    }
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  /* ── shared classes ── */
  const iconBtn = "p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm hover:shadow-md transition-all text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200";
  const filterBtn = (active) =>
    `px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm ${
      active
        ? "bg-blue-600 text-white shadow-blue-500/25 shadow-md"
        : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-300"
    }`;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-5 space-y-5">

      {/* ── HERO ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 px-6 py-5 text-white shadow-xl shadow-blue-500/20">
        <div className="pointer-events-none absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-8 left-1/3 w-32 h-32 rounded-full bg-indigo-400/20 blur-2xl" />
        <div className="relative flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center shadow-inner shrink-0">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/60 mb-0.5">Assessment Center</p>
            <h1 className="text-xl font-bold tracking-tight leading-none">My Quizzes</h1>
          </div>
        </div>
      </div>

      {/* ── STATS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: FileText, label: "Total Quizzes", value: quizzes.length, color: "from-cyan-500 to-blue-500", glow: "shadow-blue-500/15" },
          { icon: Users, label: "Total Attempts", value: attempts.length, color: "from-indigo-500 to-violet-500", glow: "shadow-indigo-500/15" },
          {
            icon: Award,
            label: "Avg Score",
            value: attempts.length
              ? (attempts.reduce((s, a) => s + a.score, 0) / attempts.length).toFixed(1) + "%"
              : "0%",
            color: "from-emerald-500 to-green-500",
            glow: "shadow-emerald-500/15",
          },
        ].map(({ icon: Icon, label, value, color, glow }) => (
          <div key={label} className={`rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 flex items-center gap-4 shadow-md ${glow}`}>
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg shrink-0`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">{value}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── SEARCH + FILTER + EXPORT ── */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-md space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 placeholder:text-slate-400"
              placeholder="Search quizzes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border text-xs font-semibold shadow-sm transition-all ${
                showFilter
                  ? "bg-blue-600 text-white border-blue-600 shadow-blue-500/25"
                  : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-300"
              }`}
            >
              <Filter className="w-3.5 h-3.5" /> Filter
            </button>
            <button
              onClick={exportQuizzes}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 shadow-sm hover:border-emerald-300 hover:text-emerald-600 transition-all"
            >
              <Download className="w-3.5 h-3.5" /> Export
            </button>
          </div>
        </div>

        {showFilter && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2 flex-wrap">
            {["All", "Short", "Medium", "Long"].map((d) => (
              <button key={d} className={filterBtn(durationFilter === d)} onClick={() => setDurationFilter(d)}>
                {d}
              </button>
            ))}
            <button
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-600 transition"
              onClick={() => setDurationFilter("All")}
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* ── QUIZ LIST ── */}
      <div className="space-y-3">
        {filteredQuizzes.length === 0 && (
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 text-center shadow-sm">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-400">No quizzes found</p>
          </div>
        )}

        {filteredQuizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 flex flex-col md:flex-row justify-between gap-4 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all"
          >
            <div className="flex gap-3.5 items-center">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm leading-tight">{quiz.title}</h3>
                <div className="flex gap-3 text-xs text-slate-400 mt-1.5">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {quiz.duration || 30} min
                  </span>
                  <span className="flex items-center gap-1">
                    <Award className="w-3 h-3" /> {quiz.totalMarks || 100} marks
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 items-center shrink-0">
              <button className={iconBtn} title="View Attempts" onClick={() => loadAttempts(quiz.id, quiz.title)}>
                <Eye className="w-4 h-4" />
              </button>
              <button className={iconBtn} title="Edit">
                <Edit className="w-4 h-4" />
              </button>
              <button className={iconBtn} title="Duplicate">
                <Copy className="w-4 h-4" />
              </button>
              <button
                className="p-2 rounded-xl border border-red-100 dark:border-red-900/40 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/50 shadow-sm hover:shadow-md transition-all text-red-500"
                title="Delete"
                onClick={() => handleDelete(quiz.id, quiz.title)}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── ATTEMPTS MODAL ── */}
      {showAttempts && selectedQuiz && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-4xl max-h-[90vh] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">

            {/* modal header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-0.5">Attempts</p>
                <h2 className="font-bold text-slate-800 dark:text-slate-100 text-sm">{selectedQuiz.title}</h2>
              </div>
              <button
                className="w-8 h-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center hover:bg-slate-100 transition shadow-sm"
                onClick={() => setShowAttempts(false)}
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            {/* modal body */}
            <div className="p-5 overflow-y-auto">
              {attempts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <Users className="w-6 h-6 text-slate-300" />
                  </div>
                  <p className="text-sm text-slate-400">No attempts yet</p>
                </div>
              ) : (
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-800">
                      <tr>
                        {["Student", "Score", "Status", "Date"].map((h) => (
                          <th key={h} className="py-3 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {attempts.map((a) => (
                        <tr key={a.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">{a.userEmail}</td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-200">
                              <Percent className="w-3 h-3 text-slate-400" />{a.score}%
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {a.score >= 70 ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-100 dark:border-emerald-900">
                                <CheckCircle className="w-3 h-3" /> Pass
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-500 text-xs font-semibold border border-red-100 dark:border-red-900">
                                <AlertCircle className="w-3 h-3" /> Fail
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-slate-400 text-xs">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
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
    </div>
  );
}