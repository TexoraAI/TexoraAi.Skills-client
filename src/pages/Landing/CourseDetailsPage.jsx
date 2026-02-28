// import {
//   ArrowLeft,
//   Award,
//   BookOpen,
//   Calendar,
//   CheckCircle,
//   Clock,
//   Moon,
//   PlayCircle,
//   Star,
//   Sun,
//   Target,
//   Users,
//   X,
//   Zap,
// } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";

// export default function CourseDetailsPage() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const courseData = location.state?.course;

//   const [showEnrollModal, setShowEnrollModal] = useState(false);
//   const [dark, setDark] = useState(
//     () => localStorage.getItem("theme") === "dark",
//   );

//   useEffect(() => {
//     if (dark) {
//       document.documentElement.classList.add("dark");
//     } else {
//       document.documentElement.classList.remove("dark");
//     }
//   }, [dark]);

//   useEffect(() => {
//     if (!courseData) {
//       navigate("/courses");
//     }
//   }, [courseData, navigate]);

//   if (!courseData) return null;

//   const learningOutcomes = [
//     "Build and launch a real product from scratch",
//     "Master product strategy and roadmapping",
//     "Learn data-driven decision making",
//     "Understand user research and validation",
//     "Manage stakeholders and cross-functional teams",
//     "Create compelling product narratives",
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-black">
//       {/* Header */}
//       <div className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
//         <div className="max-w-7xl mx-auto px-2 py-2">
//           <div className="flex items-center justify-between mb-4">
//             <button
//               onClick={() => navigate("/courses")}
//               className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
//             >
//               <ArrowLeft size={20} />
//               <span>Back to courses</span>
//             </button>

//             <button
//               onClick={() => {
//                 const next = !dark;
//                 setDark(next);
//                 localStorage.setItem("theme", next ? "dark" : "light");
//               }}
//               className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900 transition"
//             >
//               {dark ? (
//                 <Sun className="w-5 h-5 text-yellow-400" />
//               ) : (
//                 <Moon className="w-5 h-5" />
//               )}
//             </button>
//           </div>

//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//             <div>
//               <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 rounded-full text-sm text-yellow-800 dark:text-yellow-400 mb-2">
//                 <Award size={14} />
//                 <span>Featured Program</span>
//               </div>
//               <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
//                 {courseData.title}
//               </h1>
//               <p className="text-gray-600 dark:text-gray-400 mb-3">
//                 {courseData.instructorFull} • {courseData.instructorTitle}
//               </p>
//               <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
//                 <div className="flex items-center gap-1">
//                   <Star size={16} className="text-yellow-400 fill-yellow-400" />
//                   <span className="font-semibold text-gray-900 dark:text-white">
//                     {courseData.rating}
//                   </span>
//                   <span>({courseData.reviews})</span>
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <Users size={16} />
//                   <span>{courseData.students} students</span>
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <Clock size={16} />
//                   <span>{courseData.duration}</span>
//                 </div>
//               </div>
//             </div>

//             <div className="flex flex-col gap-3">
//               <button
//                 onClick={() => setShowEnrollModal(true)}
//                 className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-xl hover:shadow-blue-500/50 transition"
//               >
//                 Enroll Now • {courseData.price}
//               </button>
//               <button
//                 onClick={() =>
//                   navigate("/syllabus", { state: { course: courseData } })
//                 }
//                 className="border border-gray-300 dark:border-gray-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 dark:hover:bg-gray-900 transition"
//               >
//                 View Syllabus
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Content */}
//       <div className="max-w-7xl mx-auto px-6 py-8">
//         <div className="grid lg:grid-cols-3 gap-8">
//           {/* Main Content */}
//           <div className="lg:col-span-2 space-y-8">
//             {/* Overview */}
//             <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
//               <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
//                 About this program
//               </h2>
//               <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
//                 {courseData.description}
//               </p>

//               <div className="grid md:grid-cols-3 gap-4 mb-6">
//                 <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-xl p-4 border border-blue-200/50 dark:border-blue-800/50">
//                   <div className="flex items-center gap-2 mb-2">
//                     <PlayCircle
//                       className="text-blue-600 dark:text-blue-400"
//                       size={20}
//                     />
//                     <span className="font-semibold text-gray-900 dark:text-white">
//                       {courseData.liveSessions}
//                     </span>
//                   </div>
//                   <p className="text-sm text-gray-600 dark:text-gray-400">
//                     Live Sessions
//                   </p>
//                 </div>

//                 <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-xl p-4 border border-emerald-200/50 dark:border-emerald-800/50">
//                   <div className="flex items-center gap-2 mb-2">
//                     <BookOpen
//                       className="text-emerald-600 dark:text-emerald-400"
//                       size={20}
//                     />
//                     <span className="font-semibold text-gray-900 dark:text-white">
//                       {courseData.totalLessons}
//                     </span>
//                   </div>
//                   <p className="text-sm text-gray-600 dark:text-gray-400">
//                     Total Lessons
//                   </p>
//                 </div>

//                 <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-xl p-4 border border-purple-200/50 dark:border-purple-800/50">
//                   <div className="flex items-center gap-2 mb-2">
//                     <Target
//                       className="text-purple-600 dark:text-purple-400"
//                       size={20}
//                     />
//                     <span className="font-semibold text-gray-900 dark:text-white">
//                       {courseData.projects}
//                     </span>
//                   </div>
//                   <p className="text-sm text-gray-600 dark:text-gray-400">
//                     Projects
//                   </p>
//                 </div>
//               </div>

//               <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
//                 <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">
//                   What You'll Learn
//                 </h3>
//                 <div className="grid md:grid-cols-2 gap-3">
//                   {learningOutcomes.map((outcome, idx) => (
//                     <div key={idx} className="flex items-start gap-3">
//                       <CheckCircle
//                         size={20}
//                         className="text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5"
//                       />
//                       <span className="text-sm text-gray-700 dark:text-gray-300">
//                         {outcome}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Modules */}
//             <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
//               <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">
//                 Course Modules
//               </h3>
//               <div className="space-y-2">
//                 {courseData.modules.map((module, index) => (
//                   <div
//                     key={index}
//                     className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl"
//                   >
//                     <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
//                       <span className="text-white font-bold text-xs">
//                         {index + 1}
//                       </span>
//                     </div>
//                     <span className="text-gray-700 dark:text-gray-300">
//                       {module}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Sidebar */}
//           <div className="space-y-6">
//             {/* Enroll Card */}
//             <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 sticky top-24">
//               <div className="text-center mb-6">
//                 <p className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
//                   {courseData.price}
//                 </p>
//                 <p className="text-sm text-emerald-600 dark:text-emerald-400">
//                   Limited time offer
//                 </p>
//               </div>

//               <button
//                 onClick={() => setShowEnrollModal(true)}
//                 className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 text-white py-4 rounded-xl font-semibold hover:shadow-xl hover:shadow-blue-500/50 transition mb-4"
//               >
//                 Enroll Now
//               </button>

//               <button
//                 onClick={() =>
//                   navigate("/syllabus", { state: { course: courseData } })
//                 }
//                 className="w-full border border-gray-300 dark:border-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-100 dark:hover:bg-gray-900 transition mb-6"
//               >
//                 View Full Syllabus
//               </button>

//               <div className="space-y-3 text-sm">
//                 <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
//                   <Calendar size={16} />
//                   <span>Next cohort starting soon</span>
//                 </div>
//                 <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
//                   <Clock size={16} />
//                   <span>{courseData.duration} intensive program</span>
//                 </div>
//                 <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
//                   <Users size={16} />
//                   <span>Small cohort (max 30 students)</span>
//                 </div>
//               </div>
//             </div>

//             {/* Highlights */}
//             <div className="bg-gradient-to-br from-blue-50 to-emerald-50 dark:from-blue-950/30 dark:to-emerald-950/30 rounded-2xl p-6 border border-blue-200/50 dark:border-blue-800/50">
//               <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">
//                 Program Highlights
//               </h3>
//               <div className="space-y-3">
//                 {courseData.highlights.map((highlight, idx) => (
//                   <div key={idx} className="flex items-start gap-3">
//                     <Zap
//                       size={18}
//                       className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
//                     />
//                     <span className="text-sm text-gray-700 dark:text-gray-300">
//                       {highlight}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Enroll Modal */}
//       {showEnrollModal && (
//         <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//           <div className="bg-white dark:bg-zinc-900 rounded-3xl max-w-md w-full p-8 border border-gray-200 dark:border-gray-800 shadow-2xl">
//             <div className="flex items-center justify-between mb-6">
//               <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
//                 Ready to start?
//               </h3>
//               <button
//                 onClick={() => setShowEnrollModal(false)}
//                 className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
//               >
//                 <X size={24} className="text-gray-500" />
//               </button>
//             </div>

//             <div className="space-y-4 mb-6">
//               <div className="bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-950/30 dark:to-emerald-950/30 rounded-xl p-4">
//                 <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
//                   {courseData.price}
//                 </p>
//                 <p className="text-sm text-gray-600 dark:text-gray-400">
//                   One-time payment
//                 </p>
//               </div>

//               <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
//                 <div className="flex items-center gap-2">
//                   <CheckCircle size={16} className="text-emerald-600" />
//                   <span>Full access to all course materials</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <CheckCircle size={16} className="text-emerald-600" />
//                   <span>1:1 mentorship sessions</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <CheckCircle size={16} className="text-emerald-600" />
//                   <span>Lifetime community access</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <CheckCircle size={16} className="text-emerald-600" />
//                   <span>Industry certification</span>
//                 </div>
//               </div>
//             </div>

//             <button className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 text-white py-4 rounded-xl font-semibold hover:shadow-xl hover:shadow-blue-500/50 transition">
//               Proceed to Payment
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }old










import {
  ArrowLeft,
  Award,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Moon,
  PlayCircle,
  Star,
  Sun,
  Target,
  Users,
  X,
  Zap,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function CourseDetailsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const courseData = location.state?.course;

  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [dark, setDark] = useState(
    () => localStorage.getItem("theme") === "dark",
  );

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  useEffect(() => {
    if (!courseData) navigate("/");
  }, [courseData, navigate]);

  if (!courseData) return null;

  const learningOutcomes = [
    "Build and launch a real product from scratch",
    "Master product strategy and roadmapping",
    "Learn data-driven decision making",
    "Understand user research and validation",
    "Manage stakeholders and cross-functional teams",
    "Create compelling product narratives",
  ];

  return (
    <div className="min-h-screen bg-[#F6EDE6] dark:bg-black text-[#1E293B] dark:text-white">

      {/* ── Header ── */}
      <div className="bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-[#F97316]/20 dark:border-gray-800 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">

          {/* Top row */}
          <div className="flex items-center justify-between mb-5">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-[#F97316] transition font-medium text-sm"
            >
              <ArrowLeft size={18} />
              <span>Back to courses</span>
            </button>

            <button
              onClick={() => setDark(!dark)}
              className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-[#F6EDE6] dark:hover:bg-gray-900 transition shadow-sm bg-white dark:bg-black"
            >
              {dark
                ? <Sun className="w-5 h-5 text-[#F97316]" />
                : <Moon className="w-5 h-5 text-[#1E293B]" />}
            </button>
          </div>

          {/* Title + actions row */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              {/* Featured badge */}
              <div className="inline-flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 px-3 py-1 rounded-full text-xs font-semibold mb-3">
                <Award size={13} />
                Featured Program
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-[#1E293B] dark:text-white mb-2 leading-tight">
                {courseData.title}
              </h1>

              {courseData.instructorFull && (
                <p className="text-gray-500 dark:text-gray-400 mb-3 text-sm">
                  {courseData.instructorFull} • {courseData.instructorTitle}
                </p>
              )}

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-1.5">
                  <Star size={15} className="text-amber-400 fill-amber-400" />
                  <span className="font-semibold text-[#1E293B] dark:text-white">{courseData.rating}</span>
                  <span className="text-gray-400">({courseData.reviews || ""})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users size={15} className="text-[#F97316]" />
                  <span>{courseData.students} students</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={15} className="text-[#F97316]" />
                  <span>{courseData.duration}</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <button
                onClick={() => setShowEnrollModal(true)}
                className="bg-[#1E293B] hover:bg-[#334155] text-white px-8 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
              >
                Enroll Now • {courseData.price}
              </button>
              <button
                onClick={() => navigate("/syllabus", { state: { course: courseData } })}
                className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-[#1E293B] dark:text-white px-8 py-3 rounded-xl font-semibold hover:border-[#F97316]/40 hover:shadow-sm transition-all"
              >
                View Syllabus
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-3 gap-10">

          {/* LEFT — 2/3 */}
          <div className="lg:col-span-2 space-y-8">

            {/* About this program */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 shadow-md">
              <h2 className="text-xl font-bold text-[#1E293B] dark:text-white mb-3">
                About this program
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                {courseData.description}
              </p>

              {/* Stats cards */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <PlayCircle className="text-blue-500" size={18} />
                    <span className="font-bold text-[#1E293B] dark:text-white">
                      {courseData.liveSessions || "—"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Live Sessions</p>
                </div>

                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <BookOpen className="text-emerald-500" size={18} />
                    <span className="font-bold text-[#1E293B] dark:text-white">
                      {courseData.totalLessons || "—"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total Lessons</p>
                </div>

                <div className="bg-[#F97316]/5 dark:bg-[#F97316]/10 border border-[#F97316]/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="text-[#F97316]" size={18} />
                    <span className="font-bold text-[#1E293B] dark:text-white">
                      {courseData.projects || "—"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Projects</p>
                </div>
              </div>

              {/* What You'll Learn */}
              <div className="border-t border-gray-100 dark:border-gray-800 pt-6">
                <h3 className="font-bold text-lg text-[#1E293B] dark:text-white mb-5">
                  What You'll Learn
                </h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {learningOutcomes.map((outcome, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle size={18} className="text-[#F97316] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Course Modules */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 shadow-md">
              <h3 className="font-bold text-xl text-[#1E293B] dark:text-white mb-6">Course Modules</h3>
              <div className="space-y-3">
                {courseData.modules.map((module, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 bg-[#F6EDE6] dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-[#F97316]/40 hover:shadow-sm transition-all"
                  >
                    <div className="w-8 h-8 bg-[#1E293B] dark:bg-[#F97316] rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                      <span className="text-white font-bold text-sm">{index + 1}</span>
                    </div>
                    <span className="text-[#1E293B] dark:text-white font-medium">{module}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — 1/3 sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-5">

              {/* Price card */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-md overflow-hidden">
                {/* Orange top bar */}
                <div className="h-1 bg-[#F97316]" />

                <div className="p-7">
                  <div className="text-center mb-6">
                    <p className="text-4xl font-bold text-[#1E293B] dark:text-white mb-1">
                      {courseData.price}
                    </p>
                    <p className="text-sm text-[#F97316] font-semibold">Limited time offer</p>
                  </div>

                  <button
                    onClick={() => setShowEnrollModal(true)}
                    className="w-full bg-[#F97316] hover:bg-[#ea6c0a] text-white py-4 rounded-xl font-bold shadow-md hover:shadow-lg transition-all mb-3"
                  >
                    Enroll Now
                  </button>

                  <button
                    onClick={() => navigate("/syllabus", { state: { course: courseData } })}
                    className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-[#1E293B] dark:text-white py-3 rounded-xl font-semibold hover:border-[#F97316]/40 transition-all mb-6 text-sm"
                  >
                    View Full Syllabus
                  </button>

                  {/* Cohort info */}
                  <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                    {[
                      { icon: Calendar, text: "Next cohort starting soon" },
                      { icon: Clock, text: `${courseData.duration} intensive program` },
                      { icon: Users, text: "Small cohort (max 30 students)" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                        <item.icon size={15} className="text-[#F97316] flex-shrink-0" />
                        <span>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Program Highlights */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-md">
                <h3 className="font-bold text-[#1E293B] dark:text-white mb-5">Program Highlights</h3>
                <div className="space-y-3">
                  {courseData.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Zap size={16} className="text-[#F97316] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ── Enroll Modal ── */}
      {showEnrollModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-md w-full border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden">
            {/* Orange top bar */}
            <div className="h-1.5 bg-[#F97316]" />

            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-[#1E293B] dark:text-white">
                  Ready to start?
                </h3>
                <button
                  onClick={() => setShowEnrollModal(false)}
                  className="p-2 rounded-xl hover:bg-[#F6EDE6] dark:hover:bg-gray-800 transition"
                >
                  <X size={22} className="text-gray-500" />
                </button>
              </div>

              {/* Price box */}
              <div className="bg-[#F6EDE6] dark:bg-gray-800 rounded-2xl p-5 mb-6 border border-gray-200 dark:border-gray-700">
                <p className="text-3xl font-bold text-[#1E293B] dark:text-white mb-1">
                  {courseData.price}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">One-time payment</p>
              </div>

              {/* Inclusions */}
              <div className="space-y-3 mb-8">
                {[
                  "Full access to all course materials",
                  "1:1 mentorship sessions",
                  "Lifetime community access",
                  "Industry certification",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                    <CheckCircle size={16} className="text-[#F97316] flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <button className="w-full bg-[#1E293B] hover:bg-[#334155] text-white py-4 rounded-xl font-bold shadow-md hover:shadow-lg transition-all">
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
