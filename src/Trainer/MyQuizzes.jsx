// import React, { useEffect, useState } from "react";
// import { getAllQuizzes, deleteQuiz } from "../services/assessmentService";
// import axios from "axios";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { 
//   Trash2, 
//   Eye, 
//   Edit, 
//   Users, 
//   Clock,
//   CheckCircle,
//   AlertCircle,
//   FileText,
//   TrendingUp,
//   Award,
//   Search,
//   Filter,
//   Download,
//   MoreVertical,
//   X,
//   BarChart3,
//   Calendar,
//   Percent,
//   Copy,
//   Share2,
// } from "lucide-react";
// export default function MyQuizzes() {
//   const [quizzes, setQuizzes] = useState([]);
//   const [selectedQuiz, setSelectedQuiz] = useState(null);
//   const [attempts, setAttempts] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [showAttempts, setShowAttempts] = useState(false);
//   useEffect(() => {
//     loadQuizzes();
//   }, []);
//   const loadQuizzes = async () => {
//     try {
//       setLoading(true);
//       const res = await getAllQuizzes();
//       setQuizzes(res.data);
//     } catch (err) {
//       console.error("Failed to load quizzes", err);
//     } finally {
//       setLoading(false);
//     }
//   };
//   const handleDelete = async (id, title) => {
//     if (!window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) return;
//     try {
//       await deleteQuiz(id);
//       loadQuizzes();
//       if (selectedQuiz === id) {
//         setSelectedQuiz(null);
//         setAttempts([]);
//         setShowAttempts(false);
//       }
//     } catch (err) {
//       alert("Failed to delete quiz. Please try again.");
//     }
//   };
//   const loadAttempts = async (quizId, quizTitle) => {
//     try {
//       const token = localStorage.getItem("lms_token");
//       const res = await axios.get(
//         `http://localhost:9000/api/attempts/quiz/${quizId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setAttempts(res.data);
//       setSelectedQuiz({ id: quizId, title: quizTitle });
//       setShowAttempts(true);
//     } catch (err) {
//       alert("Failed to load attempts");
//     }
//   };
//   const filteredQuizzes = quizzes.filter((quiz) =>
//     quiz.title?.toLowerCase().includes(searchQuery.toLowerCase())
//   );
//   // Calculate statistics
//   const getQuizStats = (quizId) => {
//     const quizAttempts = attempts.filter(a => a.quizId === quizId);
//     if (quizAttempts.length === 0) return null;
//     const scores = quizAttempts.map(a => a.score);
//     const avgScore = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
//     const maxScore = Math.max(...scores);
//     const minScore = Math.min(...scores);
//     return { total: quizAttempts.length, avgScore, maxScore, minScore };
//   };
//   const getOverallStats = () => {
//     const totalQuizzes = quizzes.length;
//     const totalAttempts = attempts.length;
//     const avgScore = attempts.length > 0 
//       ? (attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length).toFixed(1)
//       : 0;
//     return { totalQuizzes, totalAttempts, avgScore };
//   };
//   const stats = getOverallStats();
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
//         <div className="text-center space-y-4">
//           <div className="w-16 h-16 border-4 border-emerald-200 dark:border-emerald-900 rounded-full animate-spin border-t-emerald-600 dark:border-t-emerald-400 mx-auto" />
//           <p className="text-slate-600 dark:text-slate-400 font-medium">Loading quizzes...</p>
//         </div>
//       </div>
//     );
//   }
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
//       <div className="max-w-7xl mx-auto space-y-8">
//         {/* Header */}
//         <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-700 p-8 md:p-12 shadow-2xl">
//           <div className="relative z-10">
//             <div className="flex items-center gap-4 mb-3">
//               <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
//                 <FileText className="w-8 h-8 text-white" />
//               </div>
//               <div>
//                 <p className="text-sm font-semibold text-white/80 uppercase tracking-wide">
//                   Assessment Management
//                 </p>
//                 <h1 className="text-4xl font-bold text-white">My Quizzes</h1>
//               </div>
//             </div>
//             <p className="text-lg text-white/90 max-w-2xl">
//               Manage your quizzes and track student performance
//             </p>
//           </div>
//           {/* Decorative elements */}
//           <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
//           <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-3xl" />
//         </div>
//         {/* Quick Stats */}
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
//           <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-lg">
//             <div className="flex items-center justify-between mb-4">
//               <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600">
//                 <FileText className="w-6 h-6 text-white" />
//               </div>
//               <TrendingUp className="w-5 h-5 text-emerald-500" />
//             </div>
//             <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{stats.totalQuizzes}</p>
//             <p className="text-sm text-slate-600 dark:text-slate-400">Total Quizzes</p>
//           </div>
//           <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-lg">
//             <div className="flex items-center justify-between mb-4">
//               <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
//                 <Users className="w-6 h-6 text-white" />
//               </div>
//             </div>
//             <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{stats.totalAttempts}</p>
//             <p className="text-sm text-slate-600 dark:text-slate-400">Total Attempts</p>
//           </div>
//           <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-lg">
//             <div className="flex items-center justify-between mb-4">
//               <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600">
//                 <Award className="w-6 h-6 text-white" />
//               </div>
//             </div>
//             <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{stats.avgScore}%</p>
//             <p className="text-sm text-slate-600 dark:text-slate-400">Average Score</p>
//           </div>
//         </div>
//         {/* Search and Filter */}
//         <Card className="p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg">
//           <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
//             <div className="relative flex-1 w-full md:max-w-md">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
//               <input
//                 type="text"
//                 placeholder="Search quizzes..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
//               />
//             </div>
//             <div className="flex gap-2">
//               <Button variant="outline" className="flex items-center gap-2">
//                 <Filter className="w-4 h-4" />
//                 Filter
//               </Button>
//               <Button variant="outline" className="flex items-center gap-2">
//                 <Download className="w-4 h-4" />
//                 Export
//               </Button>
//             </div>
//           </div>
//         </Card>
//         {/* Quiz List */}
//         <div className="space-y-4">
//           <div className="flex items-center justify-between">
//             <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
//               Quizzes ({filteredQuizzes.length})
//             </h2>
//           </div>
//           {filteredQuizzes.length === 0 ? (
//             <Card className="p-12 text-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
//               <div className="max-w-md mx-auto space-y-4">
//                 <div className="w-20 h-20 mx-auto bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
//                   <FileText className="w-10 h-10 text-slate-400" />
//                 </div>
//                 <h3 className="text-xl font-bold text-slate-900 dark:text-white">
//                   {searchQuery ? "No quizzes found" : "No quizzes created yet"}
//                 </h3>
//                 <p className="text-slate-600 dark:text-slate-400">
//                   {searchQuery 
//                     ? "Try adjusting your search query" 
//                     : "Create your first quiz to get started"}
//                 </p>
//               </div>
//             </Card>
//           ) : (
//             <div className="space-y-4">
//               {filteredQuizzes.map((quiz) => (
//                 <Card 
//                   key={quiz.id} 
//                   className="group p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300"
//                 >
//                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//                     <div className="flex-1">
//                       <div className="flex items-start gap-4">
//                         <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg">
//                           <FileText className="w-6 h-6 text-white" />
//                         </div>
//                         <div className="flex-1">
//                           <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
//                             {quiz.title}
//                           </h3>
                          
//                           <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
//                             <div className="flex items-center gap-1.5">
//                               <Clock className="w-4 h-4" />
//                               <span>{quiz.duration || "30"} min</span>
//                             </div>
//                             <span className="text-slate-300 dark:text-slate-600">•</span>
//                             <div className="flex items-center gap-1.5">
//                               <FileText className="w-4 h-4" />
//                               <span>{quiz.questionCount || "10"} questions</span>
//                             </div>
//                             <span className="text-slate-300 dark:text-slate-600">•</span>
//                             <div className="flex items-center gap-1.5">
//                               <Award className="w-4 h-4" />
//                               <span>{quiz.totalMarks || "100"} marks</span>
//                             </div>
//                             {quiz.batchId && (
//                               <>
//                                 <span className="text-slate-300 dark:text-slate-600">•</span>
//                                 <div className="flex items-center gap-1.5">
//                                   <Users className="w-4 h-4" />
//                                   <span>Batch {quiz.batchId}</span>
//                                 </div>
//                               </>
//                             )}
//                           </div>
//                           {quiz.instructions && (
//                             <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
//                               {quiz.instructions}
//                             </p>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                     <div className="flex flex-wrap md:flex-nowrap gap-2">
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => loadAttempts(quiz.id, quiz.title)}
//                         className="flex items-center gap-2"
//                       >
//                         <Eye className="w-4 h-4" />
//                         View Attempts
//                       </Button>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         className="flex items-center gap-2"
//                       >
//                         <Edit className="w-4 h-4" />
//                         Edit
//                       </Button>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         className="flex items-center gap-2"
//                       >
//                         <Copy className="w-4 h-4" />
//                         Duplicate
//                       </Button>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => handleDelete(quiz.id, quiz.title)}
//                         className="text-red-600 hover:text-red-700 hover:border-red-300"
//                       >
//                         <Trash2 className="w-4 h-4" />
//                       </Button>
//                     </div>
//                   </div>
//                 </Card>
//               ))}
//             </div>
//           )}
//         </div>
//         {/* Attempts Modal/Section */}
//         {showAttempts && selectedQuiz && (
//           <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
//             <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl">
//               {/* Header */}
//               <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
//                       Quiz Attempts
//                     </h2>
//                     <p className="text-sm text-slate-600 dark:text-slate-400">
//                       {selectedQuiz.title}
//                     </p>
//                   </div>
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => {
//                       setShowAttempts(false);
//                       setSelectedQuiz(null);
//                     }}
//                   >
//                     <X className="w-5 h-5" />
//                   </Button>
//                 </div>
//               </div>
//               {/* Stats */}
//               {attempts.length > 0 && (
//                 <div className="grid grid-cols-4 gap-4 p-6 bg-slate-50 dark:bg-slate-700/30 border-b border-slate-200 dark:border-slate-700">
//                   <div className="text-center">
//                     <p className="text-2xl font-bold text-slate-900 dark:text-white">{attempts.length}</p>
//                     <p className="text-xs text-slate-600 dark:text-slate-400">Total Attempts</p>
//                   </div>
//                   <div className="text-center">
//                     <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
//                       {(attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length).toFixed(1)}%
//                     </p>
//                     <p className="text-xs text-slate-600 dark:text-slate-400">Average Score</p>
//                   </div>
//                   <div className="text-center">
//                     <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
//                       {Math.max(...attempts.map(a => a.score))}%
//                     </p>
//                     <p className="text-xs text-slate-600 dark:text-slate-400">Highest Score</p>
//                   </div>
//                   <div className="text-center">
//                     <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
//                       {Math.min(...attempts.map(a => a.score))}%
//                     </p>
//                     <p className="text-xs text-slate-600 dark:text-slate-400">Lowest Score</p>
//                   </div>
//                 </div>
//               )}
//               {/* Content */}
//               <div className="p-6 overflow-y-auto max-h-[calc(90vh-280px)]">
//                 {attempts.length === 0 ? (
//                   <div className="text-center py-12">
//                     <div className="w-20 h-20 mx-auto bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
//                       <Users className="w-10 h-10 text-slate-400" />
//                     </div>
//                     <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
//                       No attempts yet
//                     </h3>
//                     <p className="text-sm text-slate-600 dark:text-slate-400">
//                       Students haven't attempted this quiz yet
//                     </p>
//                   </div>
//                 ) : (
//                   <div className="overflow-x-auto">
//                     <table className="w-full text-sm">
//                       <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
//                         <tr className="text-slate-700 dark:text-slate-300">
//                           <th className="py-4 px-6 text-left font-semibold">Student</th>
//                           <th className="py-4 px-6 text-center font-semibold">Score</th>
//                           <th className="py-4 px-6 text-center font-semibold">Status</th>
//                           <th className="py-4 px-6 text-center font-semibold">Submitted At</th>
//                           <th className="py-4 px-6 text-center font-semibold">Actions</th>
//                         </tr>
//                       </thead>
//                       <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
//                         {attempts.map((attempt) => (
//                           <tr key={attempt.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
//                             <td className="py-4 px-6">
//                               <div className="flex items-center gap-3">
//                                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-semibold">
//                                   {attempt.userEmail?.charAt(0).toUpperCase()}
//                                 </div>
//                                 <span className="font-medium text-slate-900 dark:text-white">
//                                   {attempt.userEmail}
//                                 </span>
//                               </div>
//                             </td>
//                             <td className="py-4 px-6 text-center">
//                               <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-700">
//                                 <Percent className="w-4 h-4 text-slate-600 dark:text-slate-400" />
//                                 <span className="font-bold text-slate-900 dark:text-white">
//                                   {attempt.score}%
//                                 </span>
//                               </div>
//                             </td>
//                             <td className="py-4 px-6 text-center">
//                               {attempt.score >= 70 ? (
//                                 <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
//                                   <CheckCircle className="w-3.5 h-3.5" />
//                                   Passed
//                                 </span>
//                               ) : (
//                                 <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-300 text-xs font-semibold">
//                                   <AlertCircle className="w-3.5 h-3.5" />
//                                   Failed
//                                 </span>
//                               )}
//                             </td>
//                             <td className="py-4 px-6 text-center">
//                               <div className="flex items-center justify-center gap-1.5 text-slate-600 dark:text-slate-400">
//                                 <Calendar className="w-4 h-4" />
//                                 <span>{new Date(attempt.submittedAt).toLocaleDateString()}</span>
//                               </div>
//                               <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">
//                                 {new Date(attempt.submittedAt).toLocaleTimeString()}
//                               </div>
//                             </td>
//                             <td className="py-4 px-6 text-center">
//                               <Button variant="ghost" size="sm">
//                                 <Eye className="w-4 h-4" />
//                               </Button>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 )}
//               </div>
//               {/* Footer */}
//               {attempts.length > 0 && (
//                 <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/30">
//                   <div className="flex justify-between items-center">
//                     <p className="text-sm text-slate-600 dark:text-slate-400">
//                       Showing {attempts.length} attempt{attempts.length !== 1 ? 's' : ''}
//                     </p>
//                     <Button variant="outline" className="flex items-center gap-2">
//                       <Download className="w-4 h-4" />
//                       Export Results
//                     </Button>
//                   </div>
//                 </div>
//               )}
//             </Card>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }





import React, { useEffect, useState } from "react";
import { getAllQuizzes, deleteQuiz } from "../services/assessmentService";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  Eye,
  Edit,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Award,
  Search,
  Filter,
  Download,
  X,
  Calendar,
  Percent,
  Copy,
} from "lucide-react";

export default function MyQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAttempts, setShowAttempts] = useState(false);

  // NEW
  const [showFilter, setShowFilter] = useState(false);
  const [durationFilter, setDurationFilter] = useState("All");

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      const res = await getAllQuizzes();
      setQuizzes(res.data);
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
    const res = await axios.get(
      `http://localhost:9000/api/attempts/quiz/${quizId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setAttempts(res.data);
    setSelectedQuiz({ id: quizId, title });
    setShowAttempts(true);
  };

  // FILTER + SEARCH
  const filteredQuizzes = quizzes.filter((q) => {
    const matchesSearch = q.title
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesDuration =
      durationFilter === "All"
        ? true
        : durationFilter === "Short"
        ? (q.duration || 30) <= 20
        : durationFilter === "Medium"
        ? (q.duration || 30) > 20 && (q.duration || 30) <= 40
        : (q.duration || 30) > 40;

    return matchesSearch && matchesDuration;
  });

  // EXPORT CSV
  const exportQuizzes = () => {
    if (!filteredQuizzes.length) return;

    const headers = ["Title", "Duration", "Questions", "Marks"];
    const rows = filteredQuizzes.map((q) => [
      q.title,
      q.duration || 30,
      q.questionCount || 10,
      q.totalMarks || 100,
    ]);

    const csv =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((r) => r.join(",")).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = "my-quizzes.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-5">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="rounded-xl bg-gradient-to-r from-[#38BDF8] via-[#3B82F6] to-[#6366F1] p-5 text-white">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6" />
            <div>
              <h1 className="text-xl font-bold">My Quizzes</h1>
              <p className="text-sm opacity-90">
                Manage quizzes & track performance
              </p>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard icon={FileText} label="Total Quizzes" value={quizzes.length} />
          <StatCard icon={Users} label="Total Attempts" value={attempts.length} />
          <StatCard
            icon={Award}
            label="Avg Score"
            value={
              attempts.length
                ? (
                    attempts.reduce((s, a) => s + a.score, 0) / attempts.length
                  ).toFixed(1) + "%"
                : "0%"
            }
          />
        </div>

        {/* SEARCH + FILTER + EXPORT */}
        <Card className="p-4 space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border bg-slate-50 dark:bg-slate-800 outline-none"
                placeholder="Search quizzes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowFilter(!showFilter)}
              >
                <Filter className="w-4 h-4 mr-1" /> Filter
              </Button>
              <Button size="sm" variant="outline" onClick={exportQuizzes}>
                <Download className="w-4 h-4 mr-1" /> Export
              </Button>
            </div>
          </div>

          {/* FILTER PANEL */}
          {showFilter && (
            <div className="pt-3 border-t flex gap-2 flex-wrap">
              {["All", "Short", "Medium", "Long"].map((d) => (
                <Button
                  key={d}
                  size="sm"
                  variant={durationFilter === d ? "default" : "outline"}
                  onClick={() => setDurationFilter(d)}
                >
                  {d}
                </Button>
              ))}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setDurationFilter("All")}
              >
                Clear
              </Button>
            </div>
          )}
        </Card>

        {/* QUIZ LIST */}
        <div className="space-y-3">
          {filteredQuizzes.map((quiz) => (
            <Card
              key={quiz.id}
              className="p-4 flex flex-col md:flex-row justify-between gap-4"
            >
              <div className="flex gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">{quiz.title}</h3>
                  <div className="flex gap-3 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {quiz.duration || 30} min
                    </span>
                    <span className="flex items-center gap-1">
                      <Award className="w-3 h-3" /> {quiz.totalMarks || 100}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => loadAttempts(quiz.id, quiz.title)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600"
                  onClick={() => handleDelete(quiz.id, quiz.title)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* ATTEMPTS MODAL */}
        {showAttempts && selectedQuiz && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <Card className="w-full max-w-5xl max-h-[90vh] overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="font-bold">{selectedQuiz.title}</h2>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowAttempts(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="p-4 overflow-y-auto">
                {attempts.length === 0 ? (
                  <p className="text-center text-sm text-slate-500">
                    No attempts yet
                  </p>
                ) : (
                  <table className="w-full text-sm">
                    <thead className="border-b text-slate-500">
                      <tr>
                        <th className="py-2 text-left">Student</th>
                        <th className="py-2 text-center">Score</th>
                        <th className="py-2 text-center">Status</th>
                        <th className="py-2 text-center">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attempts.map((a) => (
                        <tr key={a.id} className="border-b">
                          <td className="py-2">{a.userEmail}</td>
                          <td className="py-2 text-center">
                            <Percent className="inline w-3 h-3 mr-1" />
                            {a.score}%
                          </td>
                          <td className="py-2 text-center">
                            {a.score >= 70 ? (
                              <span className="inline-flex items-center gap-1 text-emerald-600">
                                <CheckCircle className="w-4 h-4" /> Pass
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-red-600">
                                <AlertCircle className="w-4 h-4" /> Fail
                              </span>
                            )}
                          </td>
                          <td className="py-2 text-center">
                            <Calendar className="inline w-3 h-3 mr-1" />
                            {new Date(a.submittedAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

/* STAT CARD */
const StatCard = ({ icon: Icon, label, value }) => (
  <Card className="p-4 flex items-center gap-3">
    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
      <Icon className="w-5 h-5 text-blue-600" />
    </div>
    <div>
      <p className="text-lg font-semibold">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  </Card>
);
