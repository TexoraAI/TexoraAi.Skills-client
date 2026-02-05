
// import React, { useEffect, useState } from "react";
// import { getMyQuizHistory } from "../services/assessmentService";

// export default function MyQuizHistory() {
//   const [attempts, setAttempts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadHistory();
//   }, []);

//   const loadHistory = async () => {
//     try {
//       const res = await getMyQuizHistory();
//       setAttempts(res.data);
//     } catch (err) {
//       console.error("Failed to load quiz history", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-6 space-y-6 bg-background">
//       {/* Header */}
//       <h1 className="text-2xl font-semibold text-foreground">
//         My Quiz History
//       </h1>

//       {loading ? (
//         <p className="text-muted-foreground">Loading...</p>
//       ) : attempts.length === 0 ? (
//         <p className="text-muted-foreground">
//           You have not attempted any quizzes yet.
//         </p>
//       ) : (
//         <div className="overflow-x-auto rounded-xl border border-border bg-card">
//           <table className="min-w-full border-collapse">
//             <thead className="bg-muted text-muted-foreground">
//               <tr>
//                 <th className="px-4 py-3 text-left font-medium">
//                   Quiz Title
//                 </th>
//                 <th className="px-4 py-3 text-center font-medium">
//                   Score
//                 </th>
//                 <th className="px-4 py-3 text-center font-medium">
//                   Total
//                 </th>
//                 <th className="px-4 py-3 text-center font-medium">
//                   Percentage
//                 </th>
//                 <th className="px-4 py-3 text-center font-medium">
//                   Attempted On
//                 </th>
//               </tr>
//             </thead>

//             <tbody>
//               {attempts.map((a) => {
//                 const total = a.quiz?.questions?.length || 0;
//                 const percent =
//                   total > 0 ? ((a.score * 100) / total).toFixed(1) : 0;

//                 return (
//                   <tr
//                     key={a.id}
//                     className="border-t border-border hover:bg-muted/60 transition"
//                   >
//                     <td className="px-4 py-3 text-foreground">
//                       {a.quiz?.title}
//                     </td>

//                     <td className="px-4 py-3 text-center text-foreground">
//                       {a.score}
//                     </td>

//                     <td className="px-4 py-3 text-center text-muted-foreground">
//                       {total}
//                     </td>

//                     <td
//                       className={`px-4 py-3 text-center font-semibold ${
//                         percent >= 50
//                           ? "text-emerald-500"
//                           : "text-destructive"
//                       }`}
//                     >
//                       {percent}%
//                     </td>

//                     <td className="px-4 py-3 text-center text-muted-foreground">
//                       {new Date(a.submittedAt).toLocaleString()}
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }




import React, { useEffect, useState } from "react";
import { getMyQuizHistory } from "../services/assessmentService";
import { 
  Trophy, 
  Target, 
  Calendar, 
  Award, 
  TrendingUp, 
  FileText,
  CheckCircle2,
  XCircle
} from "lucide-react";

export default function MyQuizHistory() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const res = await getMyQuizHistory();
      setAttempts(res.data);
    } catch (err) {
      console.error("Failed to load quiz history", err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  const totalAttempts = attempts.length;
  const passedAttempts = attempts.filter(a => {
    const total = a.quiz?.questions?.length || 0;
    const percent = total > 0 ? (a.score * 100) / total : 0;
    return percent >= 50;
  }).length;
  const averageScore = attempts.length > 0
    ? attempts.reduce((sum, a) => {
        const total = a.quiz?.questions?.length || 0;
        const percent = total > 0 ? (a.score * 100) / total : 0;
        return sum + percent;
      }, 0) / attempts.length
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading quiz history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* ================= MODERN HERO BANNER ================= */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900">
        {/* Decorative background elements */}
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        
        {/* Floating orbs */}
        <div className="absolute top-10 right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 left-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-700" />
        
        {/* Content */}
        <div className="relative px-6 py-16 md:py-24 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Left side - Text content */}
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                <Trophy className="h-4 w-4 text-yellow-300" />
                <span className="text-xs font-semibold text-white uppercase tracking-wider">
                  Performance Tracking
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
                My Quiz History
              </h1>
              
              <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl">
                Track your assessment performance and review your quiz attempts
              </p>
              
              {/* Stats */}
              <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
                <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                  <FileText className="h-6 w-6 text-white/80" />
                  <div className="text-left">
                    <p className="text-2xl font-bold text-white">{totalAttempts}</p>
                    <p className="text-xs text-white/70">Total Attempts</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                  <CheckCircle2 className="h-6 w-6 text-white/80" />
                  <div className="text-left">
                    <p className="text-2xl font-bold text-white">{passedAttempts}</p>
                    <p className="text-xs text-white/70">Passed</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                  <TrendingUp className="h-6 w-6 text-white/80" />
                  <div className="text-left">
                    <p className="text-2xl font-bold text-white">{averageScore.toFixed(1)}%</p>
                    <p className="text-xs text-white/70">Average Score</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right side - Illustration */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="w-64 h-64 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 flex items-center justify-center overflow-hidden">
                  <div className="relative">
                    <div className="w-40 h-40 rounded-full bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center">
                      <Trophy className="h-24 w-24 text-white/80" strokeWidth={1.5} />
                    </div>
                    <div className="absolute inset-0 rounded-full bg-yellow-400/20 blur-xl animate-pulse" />
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-pink-400/20 backdrop-blur-sm flex items-center justify-center animate-bounce">
                  <Award className="h-10 w-10 text-pink-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= QUIZ HISTORY ================= */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {attempts.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-900/20 mb-4">
              <FileText className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
            </div>
            <p className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">
              No Quiz Attempts Yet
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Your quiz attempts will appear here once you start taking assessments
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-b-2 border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="px-6 py-4 text-left">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                          <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Quiz Title</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Target className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                          <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Score</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-center">
                        <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Total</span>
                      </th>
                      <th className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <TrendingUp className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                          <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Percentage</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Calendar className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                          <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Attempted On</span>
                        </div>
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {attempts.map((a) => {
                      const total = a.quiz?.questions?.length || 0;
                      const percent = total > 0 ? ((a.score * 100) / total).toFixed(1) : 0;
                      const isPassed = percent >= 50;

                      return (
                        <tr
                          key={a.id}
                          className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                              {a.quiz?.title || "Untitled Quiz"}
                            </p>
                          </td>

                          <td className="px-6 py-4 text-center">
                            <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-bold">
                              {a.score}
                            </span>
                          </td>

                          <td className="px-6 py-4 text-center">
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                              {total}
                            </span>
                          </td>

                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              {isPassed ? (
                                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                              ) : (
                                <XCircle className="h-5 w-5 text-red-500" />
                              )}
                              <span className={`text-lg font-bold ${
                                isPassed
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : "text-red-600 dark:text-red-400"
                              }`}>
                                {percent}%
                              </span>
                            </div>
                          </td>

                          <td className="px-6 py-4 text-center">
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {new Date(a.submittedAt).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-500">
                              {new Date(a.submittedAt).toLocaleTimeString()}
                            </p>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {attempts.map((a) => {
                const total = a.quiz?.questions?.length || 0;
                const percent = total > 0 ? ((a.score * 100) / total).toFixed(1) : 0;
                const isPassed = percent >= 50;

                return (
                  <div
                    key={a.id}
                    className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm p-5 space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
                          {a.quiz?.title || "Untitled Quiz"}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {new Date(a.submittedAt).toLocaleString()}
                        </p>
                      </div>
                      {isPassed ? (
                        <CheckCircle2 className="h-6 w-6 text-emerald-500 flex-shrink-0" />
                      ) : (
                        <XCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20">
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Score</p>
                        <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                          {a.score}
                        </p>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Total</p>
                        <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                          {total}
                        </p>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20">
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">%</p>
                        <p className={`text-xl font-bold ${
                          isPassed
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-red-600 dark:text-red-400"
                        }`}>
                          {percent}%
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}