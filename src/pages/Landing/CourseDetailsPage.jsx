
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
//       localStorage.setItem("theme", "dark");
//     } else {
//       document.documentElement.classList.remove("dark");
//       localStorage.setItem("theme", "light");
//     }
//   }, [dark]);

//   useEffect(() => {
//     if (!courseData) navigate("/");
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
//     <div className="min-h-screen bg-[#F6EDE6] dark:bg-black text-[#1E293B] dark:text-white">

//       {/* ── Header ── */}
//       <div className="bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-[#F97316]/20 dark:border-gray-800 sticky top-0 z-40 shadow-sm">
//         <div className="max-w-7xl mx-auto px-6 py-4">

//           {/* Top row */}
//           <div className="flex items-center justify-between mb-5">
//             <button
//               onClick={() => navigate(-1)}
//               className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-[#F97316] transition font-medium text-sm"
//             >
//               <ArrowLeft size={18} />
//               <span>Back to courses</span>
//             </button>

//             <button
//               onClick={() => setDark(!dark)}
//               className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-[#F6EDE6] dark:hover:bg-gray-900 transition shadow-sm bg-white dark:bg-black"
//             >
//               {dark
//                 ? <Sun className="w-5 h-5 text-[#F97316]" />
//                 : <Moon className="w-5 h-5 text-[#1E293B]" />}
//             </button>
//           </div>

//           {/* Title + actions row */}
//           <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
//             <div>
//               {/* Featured badge */}
//               <div className="inline-flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 px-3 py-1 rounded-full text-xs font-semibold mb-3">
//                 <Award size={13} />
//                 Featured Program
//               </div>

//               <h1 className="text-3xl md:text-4xl font-bold text-[#1E293B] dark:text-white mb-2 leading-tight">
//                 {courseData.title}
//               </h1>

//               {courseData.instructorFull && (
//                 <p className="text-gray-500 dark:text-gray-400 mb-3 text-sm">
//                   {courseData.instructorFull} • {courseData.instructorTitle}
//                 </p>
//               )}

//               {/* Meta */}
//               <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
//                 <div className="flex items-center gap-1.5">
//                   <Star size={15} className="text-amber-400 fill-amber-400" />
//                   <span className="font-semibold text-[#1E293B] dark:text-white">{courseData.rating}</span>
//                   <span className="text-gray-400">({courseData.reviews || ""})</span>
//                 </div>
//                 <div className="flex items-center gap-1.5">
//                   <Users size={15} className="text-[#F97316]" />
//                   <span>{courseData.students} students</span>
//                 </div>
//                 <div className="flex items-center gap-1.5">
//                   <Clock size={15} className="text-[#F97316]" />
//                   <span>{courseData.duration}</span>
//                 </div>
//               </div>
//             </div>

//             {/* Action buttons */}
//             <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
//               <button
//                 onClick={() => setShowEnrollModal(true)}
//                 className="bg-[#1E293B] hover:bg-[#334155] text-white px-8 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
//               >
//                 Enroll Now • {courseData.price}
//               </button>
//               <button
//                 onClick={() => navigate("/syllabus", { state: { course: courseData } })}
//                 className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-[#1E293B] dark:text-white px-8 py-3 rounded-xl font-semibold hover:border-[#F97316]/40 hover:shadow-sm transition-all"
//               >
//                 View Syllabus
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ── Main Content ── */}
//       <div className="max-w-7xl mx-auto px-6 py-10">
//         <div className="grid lg:grid-cols-3 gap-10">

//           {/* LEFT — 2/3 */}
//           <div className="lg:col-span-2 space-y-8">

//             {/* About this program */}
//             <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 shadow-md">
//               <h2 className="text-xl font-bold text-[#1E293B] dark:text-white mb-3">
//                 About this program
//               </h2>
//               <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
//                 {courseData.description}
//               </p>

//               {/* Stats cards */}
//               <div className="grid grid-cols-3 gap-4 mb-8">
//                 <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900 rounded-xl p-4">
//                   <div className="flex items-center gap-2 mb-1">
//                     <PlayCircle className="text-blue-500" size={18} />
//                     <span className="font-bold text-[#1E293B] dark:text-white">
//                       {courseData.liveSessions || "—"}
//                     </span>
//                   </div>
//                   <p className="text-xs text-gray-500 dark:text-gray-400">Live Sessions</p>
//                 </div>

//                 <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900 rounded-xl p-4">
//                   <div className="flex items-center gap-2 mb-1">
//                     <BookOpen className="text-emerald-500" size={18} />
//                     <span className="font-bold text-[#1E293B] dark:text-white">
//                       {courseData.totalLessons || "—"}
//                     </span>
//                   </div>
//                   <p className="text-xs text-gray-500 dark:text-gray-400">Total Lessons</p>
//                 </div>

//                 <div className="bg-[#F97316]/5 dark:bg-[#F97316]/10 border border-[#F97316]/20 rounded-xl p-4">
//                   <div className="flex items-center gap-2 mb-1">
//                     <Target className="text-[#F97316]" size={18} />
//                     <span className="font-bold text-[#1E293B] dark:text-white">
//                       {courseData.projects || "—"}
//                     </span>
//                   </div>
//                   <p className="text-xs text-gray-500 dark:text-gray-400">Projects</p>
//                 </div>
//               </div>

//               {/* What You'll Learn */}
//               <div className="border-t border-gray-100 dark:border-gray-800 pt-6">
//                 <h3 className="font-bold text-lg text-[#1E293B] dark:text-white mb-5">
//                   What You'll Learn
//                 </h3>
//                 <div className="grid md:grid-cols-2 gap-3">
//                   {learningOutcomes.map((outcome, idx) => (
//                     <div key={idx} className="flex items-start gap-3">
//                       <CheckCircle size={18} className="text-[#F97316] flex-shrink-0 mt-0.5" />
//                       <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{outcome}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Course Modules */}
//             <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 shadow-md">
//               <h3 className="font-bold text-xl text-[#1E293B] dark:text-white mb-6">Course Modules</h3>
//               <div className="space-y-3">
//                 {courseData.modules.map((module, index) => (
//                   <div
//                     key={index}
//                     className="flex items-center gap-4 p-4 bg-[#F6EDE6] dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-[#F97316]/40 hover:shadow-sm transition-all"
//                   >
//                     <div className="w-8 h-8 bg-[#1E293B] dark:bg-[#F97316] rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
//                       <span className="text-white font-bold text-sm">{index + 1}</span>
//                     </div>
//                     <span className="text-[#1E293B] dark:text-white font-medium">{module}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* RIGHT — 1/3 sidebar */}
//           <div className="lg:col-span-1">
//             <div className="sticky top-28 space-y-5">

//               {/* Price card */}
//               <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-md overflow-hidden">
//                 {/* Orange top bar */}
//                 <div className="h-1 bg-[#F97316]" />

//                 <div className="p-7">
//                   <div className="text-center mb-6">
//                     <p className="text-4xl font-bold text-[#1E293B] dark:text-white mb-1">
//                       {courseData.price}
//                     </p>
//                     <p className="text-sm text-[#F97316] font-semibold">Limited time offer</p>
//                   </div>

//                   <button
//                     onClick={() => setShowEnrollModal(true)}
//                     className="w-full bg-[#F97316] hover:bg-[#ea6c0a] text-white py-4 rounded-xl font-bold shadow-md hover:shadow-lg transition-all mb-3"
//                   >
//                     Enroll Now
//                   </button>

//                   <button
//                     onClick={() => navigate("/syllabus", { state: { course: courseData } })}
//                     className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-[#1E293B] dark:text-white py-3 rounded-xl font-semibold hover:border-[#F97316]/40 transition-all mb-6 text-sm"
//                   >
//                     View Full Syllabus
//                   </button>

//                   {/* Cohort info */}
//                   <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800">
//                     {[
//                       { icon: Calendar, text: "Next cohort starting soon" },
//                       { icon: Clock, text: `${courseData.duration} intensive program` },
//                       { icon: Users, text: "Small cohort (max 30 students)" },
//                     ].map((item, i) => (
//                       <div key={i} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
//                         <item.icon size={15} className="text-[#F97316] flex-shrink-0" />
//                         <span>{item.text}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               {/* Program Highlights */}
//               <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-md">
//                 <h3 className="font-bold text-[#1E293B] dark:text-white mb-5">Program Highlights</h3>
//                 <div className="space-y-3">
//                   {courseData.highlights.map((highlight, idx) => (
//                     <div key={idx} className="flex items-start gap-3">
//                       <Zap size={16} className="text-[#F97316] flex-shrink-0 mt-0.5" />
//                       <span className="text-sm text-gray-600 dark:text-gray-300">{highlight}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ── Enroll Modal ── */}
//       {showEnrollModal && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//           <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-md w-full border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden">
//             {/* Orange top bar */}
//             <div className="h-1.5 bg-[#F97316]" />

//             <div className="p-8">
//               <div className="flex items-center justify-between mb-6">
//                 <h3 className="text-2xl font-bold text-[#1E293B] dark:text-white">
//                   Ready to start?
//                 </h3>
//                 <button
//                   onClick={() => setShowEnrollModal(false)}
//                   className="p-2 rounded-xl hover:bg-[#F6EDE6] dark:hover:bg-gray-800 transition"
//                 >
//                   <X size={22} className="text-gray-500" />
//                 </button>
//               </div>

//               {/* Price box */}
//               <div className="bg-[#F6EDE6] dark:bg-gray-800 rounded-2xl p-5 mb-6 border border-gray-200 dark:border-gray-700">
//                 <p className="text-3xl font-bold text-[#1E293B] dark:text-white mb-1">
//                   {courseData.price}
//                 </p>
//                 <p className="text-sm text-gray-500 dark:text-gray-400">One-time payment</p>
//               </div>

//               {/* Inclusions */}
//               <div className="space-y-3 mb-8">
//                 {[
//                   "Full access to all course materials",
//                   "1:1 mentorship sessions",
//                   "Lifetime community access",
//                   "Industry certification",
//                 ].map((item, i) => (
//                   <div key={i} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
//                     <CheckCircle size={16} className="text-[#F97316] flex-shrink-0" />
//                     <span>{item}</span>
//                   </div>
//                 ))}
//               </div>

//               <button className="w-full bg-[#1E293B] hover:bg-[#334155] text-white py-4 rounded-xl font-bold shadow-md hover:shadow-lg transition-all">
//                 Proceed to Payment
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


























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
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { courseService } from "../../services/courseService";
export default function CourseDetailsPage() {
  // const navigate = useNavigate();
  // const location = useLocation();
  // const courseData = location.state?.course;

  // const [showEnrollModal, setShowEnrollModal] = useState(false);
  // const [dark, setDark] = useState(
  //   () => localStorage.getItem("theme") === "dark",
  // );
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const [courseData, setCourseData] = useState(location.state?.course || null);
  const [loadingCourse, setLoadingCourse] = useState(!location.state?.course);
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

  // useEffect(() => {
  //   if (!courseData) navigate("/");
  // }, [courseData, navigate]);

  // if (!courseData) return null;
  useEffect(() => {
    if (!id) {
      navigate("/");
      return;
    }
    if (courseData) return; // already have it from state
    async function load() {
      try {
        const { data } = await courseService.getFeaturedProgramById(id);
        setCourseData({
          id: data.id,
          title: data.title,
          instructor: data.instructorRole || data.instructorName,
          instructorFull: data.instructorName,
          instructorTitle: data.instructorRole || "",
          duration: `${data.durationWeeks} weeks`,
          students: data.studentsEnrolled,
          rating: data.rating,
          level: data.level,
          description: data.shortDescription,
          modules: (data.syllabusWeeks || []).map((w) => w.title),
          price: `₹${Number(data.price).toLocaleString("en-IN")}`,
          // highlights: (data.highlights || []).map((t, i) => ({
          //   id: i,
          //   text: t,
          // })),
          // learningOutcomes: (data.learningOutcomes || []).map((t, i) => ({
          //   id: i,
          //   text: t,
          // })),
          highlights: (data.highlights || [])
            .map((t) => (typeof t === "string" ? t : t?.text || ""))
            .filter((t) => t && t !== "[object Object]"),
          learningOutcomes: (data.learningOutcomes || [])
            .map((t, i) => ({
              id: i,
              text: typeof t === "string" ? t : t?.text || "",
            }))
            .filter((t) => t.text && t.text !== "[object Object]"),
          totalLessons: data.lessons,
          projects: data.projects,
          syllabusWeeks: data.syllabusWeeks || [],
          enrollmentUrl: data.enrollmentUrl || "",
          liveSessions: data.liveSessions ?? "—",
        });
      } catch (err) {
        console.error("Failed to load course", err);
        navigate("/");
      } finally {
        setLoadingCourse(false);
      }
    }
    load();
  }, [id]);

  if (loadingCourse)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F6EDE6] dark:bg-black">
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    );
  if (!courseData) return null;

  // const learningOutcomes = courseData.learningOutcomes?.length
  //   ? courseData.learningOutcomes
  //   : [
  //       { id: 0, text: "Build and launch a real product from scratch" },
  //       { id: 1, text: "Master product strategy and roadmapping" },
  //       { id: 2, text: "Learn data-driven decision making" },
  //       { id: 3, text: "Understand user research and validation" },
  //       { id: 4, text: "Manage stakeholders and cross-functional teams" },
  //       { id: 5, text: "Create compelling product narratives" },
  //     ];
  const learningOutcomes = (courseData.learningOutcomes || [])
    .map((t, i) => (typeof t === "string" ? { id: i, text: t } : t))
    .filter((t) => t?.text && t.text !== "[object Object]");

  const finalLearningOutcomes = learningOutcomes.length
    ? learningOutcomes
    : [
        { id: 0, text: "Build and launch a real product from scratch" },
        { id: 1, text: "Master product strategy and roadmapping" },
        { id: 2, text: "Learn data-driven decision making" },
        { id: 3, text: "Understand user research and validation" },
        { id: 4, text: "Manage stakeholders and cross-functional teams" },
        { id: 5, text: "Create compelling product narratives" },
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
              {dark ? (
                <Sun className="w-5 h-5 text-[#F97316]" />
              ) : (
                <Moon className="w-5 h-5 text-[#1E293B]" />
              )}
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
                  <span className="font-semibold text-[#1E293B] dark:text-white">
                    {courseData.rating}
                  </span>
                  <span className="text-gray-400">
                    ({courseData.reviews || ""})
                  </span>
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
                onClick={() =>
                  navigate("/syllabus", { state: { course: courseData } })
                }
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
                {/* <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <PlayCircle className="text-blue-500" size={18} />
                    <span className="font-bold text-[#1E293B] dark:text-white">
                      {courseData.liveSessions || "—"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Live Sessions
                  </p>
                </div> */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <PlayCircle className="text-blue-500" size={18} />
                    {/* <span className="font-bold text-[#1E293B] dark:text-white">
                      —
                    </span> */}
                    <span className="font-bold text-[#1E293B] dark:text-white">
                      {courseData.liveSessions ?? "—"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Live Sessions
                  </p>
                </div>

                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <BookOpen className="text-emerald-500" size={18} />
                    <span className="font-bold text-[#1E293B] dark:text-white">
                      {courseData.totalLessons || "—"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Total Lessons
                  </p>
                </div>

                <div className="bg-[#F97316]/5 dark:bg-[#F97316]/10 border border-[#F97316]/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="text-[#F97316]" size={18} />
                    <span className="font-bold text-[#1E293B] dark:text-white">
                      {courseData.projects || "—"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Projects
                  </p>
                </div>
              </div>

              {/* What You'll Learn */}
              <div className="border-t border-gray-100 dark:border-gray-800 pt-6">
                <h3 className="font-bold text-lg text-[#1E293B] dark:text-white mb-5">
                  What You'll Learn
                </h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {finalLearningOutcomes.map((outcome, idx) => (
                    <div
                      key={outcome.id ?? idx}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle
                        size={18}
                        className="text-[#F97316] flex-shrink-0 mt-0.5"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {outcome.text ?? outcome}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Course Modules */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 shadow-md">
              <h3 className="font-bold text-xl text-[#1E293B] dark:text-white mb-6">
                Course Modules
              </h3>
              <div className="space-y-3">
                {courseData.modules.map((module, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 bg-[#F6EDE6] dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-[#F97316]/40 hover:shadow-sm transition-all"
                  >
                    <div className="w-8 h-8 bg-[#1E293B] dark:bg-[#F97316] rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                      <span className="text-white font-bold text-sm">
                        {index + 1}
                      </span>
                    </div>
                    <span className="text-[#1E293B] dark:text-white font-medium">
                      {module}
                    </span>
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
                    <p className="text-sm text-[#F97316] font-semibold">
                      Limited time offer
                    </p>
                  </div>

                  <button
                    onClick={() => setShowEnrollModal(true)}
                    className="w-full bg-[#F97316] hover:bg-[#ea6c0a] text-white py-4 rounded-xl font-bold shadow-md hover:shadow-lg transition-all mb-3"
                  >
                    Enroll Now
                  </button>

                  <button
                    onClick={() =>
                      navigate(`/syllabus/${courseData.id}`, {
                        state: { course: courseData },
                      })
                    }
                    className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-[#1E293B] dark:text-white py-3 rounded-xl font-semibold hover:border-[#F97316]/40 transition-all mb-6 text-sm"
                  >
                    View Full Syllabus
                  </button>

                  {/* Cohort info */}
                  <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                    {[
                      { icon: Calendar, text: "Next cohort starting soon" },
                      {
                        icon: Clock,
                        text: `${courseData.duration} intensive program`,
                      },
                      { icon: Users, text: "Small cohort (max 30 students)" },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300"
                      >
                        <item.icon
                          size={15}
                          className="text-[#F97316] flex-shrink-0"
                        />
                        <span>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Program Highlights */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-md">
                <h3 className="font-bold text-[#1E293B] dark:text-white mb-5">
                  Program Highlights
                </h3>
                <div className="space-y-3">
                  {(courseData.highlights || [])
                    .map((h) => (typeof h === "string" ? h : h?.text || ""))
                    .filter((h) => h && h !== "[object Object]")
                    .map((highlight, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <Zap
                          size={16}
                          className="text-[#F97316] flex-shrink-0 mt-0.5"
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {highlight}
                        </span>
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
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  One-time payment
                </p>
              </div>

              {/* Inclusions */}
              <div className="space-y-3 mb-8">
                {[
                  "Full access to all course materials",
                  "1:1 mentorship sessions",
                  "Lifetime community access",
                  "Industry certification",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300"
                  >
                    <CheckCircle
                      size={16}
                      className="text-[#F97316] flex-shrink-0"
                    />
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
