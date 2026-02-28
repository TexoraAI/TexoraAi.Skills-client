
// import React, { useEffect, useState } from "react";
// import { FileText, Calendar, Award, Clock } from "lucide-react";
// import assessmentService from "../services/assessmentService";
// import { useNavigate } from "react-router-dom";

// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";

// const Assessments = () => {
//   const [assessments, setAssessments] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const loadQuizzes = async () => {
//       try {
//         const res = await assessmentService.getAllQuizzes();
//         setAssessments(res.data);
//       } catch (err) {
//         console.error("Failed to load quizzes", err);
//       }
//     };

//     loadQuizzes();
//   }, []);

//   const statusClass =
//     "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30";

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
//       {/* ================= COMPACT HERO SECTION ================= */}
// <div className="bg-gradient-to-r from-indigo-600 to-blue-600">
//   <div className="max-w-7xl mx-auto px-6 py-5">
//     <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

//       {/* LEFT */}
//       <div>
//         <div className="flex items-center gap-2 mb-1">
//           <div className="p-2 rounded-md bg-white/15 backdrop-blur">
//             <FileText className="h-4 w-4 text-white" />
//           </div>
//           <span className="text-xs font-semibold uppercase tracking-wide text-white/90">
//             Assessment Portal
//           </span>
//         </div>

//         <h1 className="text-xl font-bold text-white">
//           Your Assessments
//         </h1>
//         <p className="text-sm text-white/80">
//           Track your progress and attempt quizzes
//         </p>
//       </div>

//       {/* RIGHT STATS */}
//       <div className="flex gap-3">
//         <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/15 backdrop-blur">
//           <FileText className="h-4 w-4 text-white" />
//           <div>
//             <p className="text-base font-bold text-white">
//               {assessments.length}
//             </p>
//             <p className="text-[11px] text-white/70">Total</p>
//           </div>
//         </div>

//         <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/15 backdrop-blur">
//           <Clock className="h-4 w-4 text-yellow-300" />
//           <div>
//             <p className="text-base font-bold text-white">
//               {assessments.length}
//             </p>
//             <p className="text-[11px] text-white/70">Pending</p>
//           </div>
//         </div>
//       </div>

//     </div>
//   </div>
// </div>
//       {/* ================= ASSESSMENT CARDS ================= */}
//       <div className="max-w-7xl mx-auto px-6 py-12">
//         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//           {assessments.map((item) => (
//             <Card
//               key={item.id}
//               className="group p-6 flex flex-col justify-between hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-indigo-200 dark:hover:border-indigo-800"
//             >
//               {/* Title */}
//               <div className="flex items-start justify-between mb-4">
//                 <h2 className="text-lg font-semibold text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
//                   {item.title}
//                 </h2>
//                 <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800/50 transition-colors">
//                   <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
//                 </div>
//               </div>

//               {/* Quiz Info */}
//               <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 pb-4 border-b border-border">
//                 <Calendar className="h-4 w-4" />
//                 Quiz ID:
//                 <span className="font-medium text-foreground">
//                   {item.id}
//                 </span>
//               </div>

//               {/* Status */}
//               <span
//                 className={`inline-block w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${statusClass} mb-4`}
//               >
//                 Pending
//               </span>

//               {/* Action */}
//               <Button
//                 className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-300"
//                 onClick={() => navigate(`/student/quiz/${item.id}`)}
//               >
//                 View Assessment
//               </Button>
//             </Card>
//           ))}

//           {assessments.length === 0 && (
//             <div className="col-span-full text-center py-16">
//               <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
//                 <Award className="h-10 w-10 text-green-600 dark:text-green-400" />
//               </div>
//               <p className="text-lg font-medium text-foreground mb-2">
//                 All caught up!
//               </p>
//               <p className="text-sm text-muted-foreground">
//                 No assessments available at the moment 🎉
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Assessments;




import React, { useEffect, useState } from "react";
import { FileText, Calendar, Award, Clock } from "lucide-react";
import assessmentService from "../services/assessmentService";
import { useNavigate } from "react-router-dom";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Assessments = () => {
  const [assessments, setAssessments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        const res = await assessmentService.getAllQuizzes();
        setAssessments(res.data);
      } catch (err) {
        console.error("Failed to load quizzes", err);
      }
    };
    loadQuizzes();
  }, []);

  const statusClass =
    "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">

      {/* ================= LIGHT BLUE HERO ================= */}
      <header
        className="relative overflow-hidden
        bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400
        dark:from-sky-600 dark:via-blue-600 dark:to-indigo-600"
      >
        <div className="absolute inset-0 bg-white/10 dark:bg-black/10" />

        <div className="relative max-w-7xl mx-auto px-6 py-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            {/* LEFT */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="p-2 rounded-md bg-white/30 backdrop-blur shadow">
                  <FileText className="h-4 w-4 text-white" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wide text-white/90">
                  Assessment Portal
                </span>
              </div>

              <h1 className="text-xl font-bold text-white">
                Your Assessments
              </h1>
              <p className="text-sm text-white/85">
                Track your progress and attempt quizzes
              </p>
            </div>

            {/* RIGHT STATS */}
            <div className="flex gap-3">
              <Stat
                icon={<FileText className="h-4 w-4" />}
                label="Total"
                value={assessments.length}
              />
              <Stat
                icon={<Clock className="h-4 w-4" />}
                label="Pending"
                value={assessments.length}
              />
            </div>

          </div>
        </div>
      </header>

      {/* ================= ASSESSMENT CARDS ================= */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {assessments.map((item) => (
            <Card
              key={item.id}
              className="group p-6 flex flex-col justify-between
                         bg-white dark:bg-slate-900
                         border border-slate-200 dark:border-slate-800
                         hover:shadow-xl transition-all duration-300
                         hover:-translate-y-1"
            >
              {/* TITLE */}
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-lg font-semibold
                               text-slate-900 dark:text-slate-100
                               group-hover:text-blue-600 dark:group-hover:text-blue-400
                               transition-colors">
                  {item.title}
                </h2>
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>

              {/* QUIZ INFO */}
              <div className="flex items-center gap-2 text-sm
                              text-slate-500 dark:text-slate-400
                              mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                <Calendar className="h-4 w-4" />
                Quiz ID:
                <span className="font-medium text-slate-900 dark:text-slate-100">
                  {item.id}
                </span>
              </div>

              {/* STATUS */}
              <span
                className={`inline-block w-fit rounded-full px-3 py-1.5
                            text-xs font-semibold ${statusClass} mb-4`}
              >
                Pending
              </span>

              {/* ACTION */}
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700
                           text-white shadow-md transition"
                onClick={() => navigate(`/student/quiz/${item.id}`)}
              >
                View Assessment
              </Button>
            </Card>
          ))}

          {assessments.length === 0 && (
            <div className="col-span-full text-center py-16">
              <div className="inline-flex items-center justify-center
                              w-20 h-20 rounded-full
                              bg-blue-100 dark:bg-blue-900/20 mb-4">
                <Award className="h-10 w-10 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                All caught up!
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No assessments available at the moment 🎉
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Assessments;

/* ================= STAT ================= */
const Stat = ({ icon, label, value }) => (
  <div className="flex items-center gap-2 px-4 py-2
                  rounded-xl bg-white/30 backdrop-blur
                  border border-white/30 text-white shadow">
    {icon}
    <div>
      <p className="text-base font-bold leading-none">{value}</p>
      <p className="text-[11px] text-white/80">{label}</p>
    </div>
  </div>
);
