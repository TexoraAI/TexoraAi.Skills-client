
// import React, { useState, useEffect } from "react";
// import { Search, BookOpen } from "lucide-react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const API = "http://localhost:9000";

// const authHeader = () => ({
//   Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
// });

// const MyCourses = () => {
//   const [search, setSearch] = useState("");
//   const [courses, setCourses] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     axios
//       .get(`${API}/api/courses`, { headers: authHeader() })
//       .then((res) => setCourses(res.data))
//       .catch(console.error);
//   }, []);

//   const filtered = courses.filter((c) =>
//     c.title.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div className="p-6 space-y-6 bg-background">
//       {/* Header */}
//       <h1 className="text-2xl font-bold text-foreground">
//         My Courses
//       </h1>

//       {/* Search */}
//       <div className="relative w-full md:w-1/3">
//         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
//         <input
//           type="text"
//           placeholder="Search courses..."
//           className="
//             w-full pl-10 pr-4 py-2 rounded-xl
//             bg-card border border-border
//             text-foreground placeholder:text-muted-foreground
//             focus:outline-none focus:ring-2 focus:ring-primary
//           "
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//       </div>

//       {/* Courses Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filtered.map((course) => (
//           <div
//             key={course.id}
//             className="
//               p-5 rounded-xl
//               bg-card border border-border
//               shadow-sm hover:shadow-lg transition
//               flex flex-col
//             "
//           >
//             {/* Title */}
//             <div className="flex justify-between items-center mb-3">
//               <h2 className="text-lg font-semibold text-foreground">
//                 {course.title}
//               </h2>
//               <BookOpen className="text-primary" />
//             </div>

//             {/* Instructor */}
//             <p className="text-sm text-muted-foreground mb-2">
//               Instructor:{" "}
//               <span className="font-medium text-foreground">
//                 {course.createdBy}
//               </span>
//             </p>

//             {/* Category */}
//             <span className="w-fit px-3 py-1 text-xs rounded-full bg-muted text-foreground">
//               {course.category || "General"}
//             </span>

//             {/* Progress */}
//             <div className="mt-4">
//               <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
//                 <div
//                   className="bg-primary h-2 rounded-full"
//                   style={{ width: "10%" }}
//                 />
//               </div>
//               <p className="text-sm text-muted-foreground mt-1">
//                 Progress: 0%
//               </p>
//             </div>

//             {/* Action */}
//             <button
//               onClick={() => navigate(`/student/course/${course.id}`)}
//               className="
//                 mt-4 w-full py-2 rounded-xl
//                 bg-primary text-primary-foreground
//                 hover:opacity-90 transition
//               "
//             >
//               View Course
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default MyCourses;


import React, { useState, useEffect } from "react";
import { Search, BookOpen, User, Award, TrendingUp, GraduationCap, ChevronRight } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:9000";

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
});

const MyCourses = () => {
  const [search, setSearch] = useState("");
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API}/api/courses`, { headers: authHeader() })
      .then((res) => setCourses(res.data))
      .catch(console.error);
  }, []);

  const filtered = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  // Calculate stats
  const totalCourses = courses.length;
  const inProgressCourses = courses.length; // You can modify this based on actual progress data
  const completedCourses = 0; // You can modify this based on actual completion data

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* ================= MODERN HERO BANNER ================= */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 dark:from-orange-900 dark:via-amber-900 dark:to-yellow-900">
        {/* Decorative background elements */}
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        
        {/* Floating orbs */}
        <div className="absolute top-10 left-20 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse delay-700" />
        
        {/* Content */}
        <div className="relative px-6 py-16 md:py-24 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Left side - Text content */}
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                <GraduationCap className="h-4 w-4 text-orange-300" />
                <span className="text-xs font-semibold text-white uppercase tracking-wider">
                  Learning Dashboard
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
                My Courses
              </h1>
              
              <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl">
                Continue your learning journey and track your progress across all enrolled courses
              </p>
              
              {/* Stats */}
              <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
                <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                  <BookOpen className="h-6 w-6 text-white/80" />
                  <div className="text-left">
                    <p className="text-2xl font-bold text-white">{totalCourses}</p>
                    <p className="text-xs text-white/70">Enrolled Courses</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                  <TrendingUp className="h-6 w-6 text-white/80" />
                  <div className="text-left">
                    <p className="text-2xl font-bold text-white">{inProgressCourses}</p>
                    <p className="text-xs text-white/70">In Progress</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                  <Award className="h-6 w-6 text-white/80" />
                  <div className="text-left">
                    <p className="text-2xl font-bold text-white">{completedCourses}</p>
                    <p className="text-xs text-white/70">Completed</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right side - Illustration */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="w-64 h-64 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 flex items-center justify-center overflow-hidden">
                  <div className="relative">
                    {/* Stacked books effect */}
                    <div className="absolute -bottom-2 -left-4 w-28 h-32 rounded-lg bg-orange-400/20 backdrop-blur-sm transform -rotate-12" />
                    <div className="absolute -bottom-1 left-2 w-28 h-32 rounded-lg bg-amber-400/20 backdrop-blur-sm transform -rotate-6" />
                    <div className="relative w-32 h-36 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <BookOpen className="h-20 w-20 text-white/80" strokeWidth={1.5} />
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-yellow-400/20 backdrop-blur-sm flex items-center justify-center animate-bounce">
                  <Award className="h-10 w-10 text-yellow-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= SEARCH & COURSES ================= */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 h-5 w-5" />
            <input
              type="text"
              placeholder="Search courses..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent transition-all shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((course) => (
            <div
              key={course.id}
              className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-orange-300 dark:hover:border-orange-700 flex flex-col"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 line-clamp-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors mb-2">
                    {course.title}
                  </h2>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 group-hover:from-orange-200 dark:group-hover:from-orange-800/50 group-hover:to-amber-200 dark:group-hover:to-amber-800/50 transition-all ml-3">
                  <BookOpen className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>

              {/* Instructor */}
              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-200 dark:border-slate-700">
                <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
                  <User className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Instructor</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {course.createdBy}
                  </p>
                </div>
              </div>

              {/* Category */}
              <div className="mb-4">
                <span className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
                  {course.category || "General"}
                </span>
              </div>

              {/* Progress */}
              <div className="mt-auto">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Progress</span>
                  <span className="text-xs font-bold text-orange-600 dark:text-orange-400">0%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden mb-4">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-amber-500 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: "0%" }}
                  />
                </div>

                {/* Action Button */}
                <button
                  onClick={() => navigate(`/student/course/${course.id}`)}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-semibold shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-300 group"
                >
                  View Course
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-orange-100 dark:bg-orange-900/20 mb-4">
                <BookOpen className="h-10 w-10 text-orange-600 dark:text-orange-400" />
              </div>
              <p className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">
                {search ? "No courses found" : "No courses enrolled"}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {search ? "Try adjusting your search" : "Enroll in courses to start learning"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyCourses;