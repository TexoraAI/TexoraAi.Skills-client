
// import React, { useState } from "react";
// import {
//   BookOpen,
//   CheckCircle,
//   Clock,
//   Percent,
//   Calendar,
//   Bell,
//   TrendingUp,
//   Award,
//   Target,
//   Activity,
//   Video,
//   ChevronRight,
//   ArrowUp,
//   ArrowDown,
//   Play,
//   FileText,
//   Users,
//   Zap,
//   BarChart3,
//   Trophy,
// } from "lucide-react";

// const DashboardPage = () => {
//   const [activeTab, setActiveTab] = useState("overview");

//   // ================= DATA =================
//   const stats = [
//     { label: "Active Courses", value: "4", change: "+2 this month", trend: "up", icon: BookOpen, gradient: "from-indigo-600 to-purple-600" },
//     { label: "Completed Courses", value: "12", change: "+3 completed", trend: "up", icon: CheckCircle, gradient: "from-emerald-500 to-teal-600" },
//     { label: "Pending Assessments", value: "5", change: "2 overdue", trend: "down", icon: Clock, gradient: "from-amber-500 to-orange-600" },
//     { label: "Attendance", value: "94%", change: "6% above target", trend: "up", icon: Percent, gradient: "from-sky-500 to-blue-600" },
//   ];

//   const courseProgress = [
//     { name: "React Advanced", progress: 68, color: "bg-indigo-500", gradient: "from-indigo-500 to-purple-600" },
//     { name: "Node.js Backend", progress: 45, color: "bg-emerald-500", gradient: "from-emerald-500 to-teal-600" },
//     { name: "UI/UX Design", progress: 82, color: "bg-purple-500", gradient: "from-purple-500 to-pink-600" },
//     { name: "Database Architecture", progress: 34, color: "bg-blue-500", gradient: "from-blue-500 to-cyan-600" },
//   ];

//   const upcomingEvents = [
//     { title: "Live session: React State Management", date: "Tomorrow, 7 PM", type: "live", icon: Video, color: "text-red-500" },
//     { title: "Quiz: JavaScript Basics", date: "In 3 days", type: "quiz", icon: FileText, color: "text-amber-500" },
//     { title: "Project checkpoint submission", date: "In 5 days", type: "assignment", icon: CheckCircle, color: "text-blue-500" },
//     { title: "Mentor 1-on-1 Session", date: "In 6 days", type: "meeting", icon: Users, color: "text-emerald-500" },
//   ];

//   const recentActivity = [
//     { action: "Completed: React Hooks Deep Dive", time: "2 hours ago", icon: CheckCircle, color: "text-emerald-500" },
//     { action: "New assignment added in Node.js Backend", time: "5 hours ago", icon: FileText, color: "text-blue-500" },
//     { action: "Instructor replied to your doubt in UI/UX", time: "1 day ago", icon: Bell, color: "text-purple-500" },
//     { action: "New video uploaded in Database Architecture", time: "2 days ago", icon: Video, color: "text-amber-500" },
//   ];

//   const achievements = [
//     { title: "Quick Learner", desc: "Complete 5 courses", icon: Zap, unlocked: true, progress: 100, color: "from-yellow-400 to-orange-500" },
//     { title: "Perfect Attendance", desc: "100% attendance for a month", icon: Target, unlocked: false, progress: 75, color: "from-emerald-400 to-teal-500" },
//     { title: "Top Performer", desc: "Score 90+ in 3 assessments", icon: Trophy, unlocked: false, progress: 33, color: "from-purple-400 to-pink-500" },
//   ];

//   const allCourses = [
//     { id: 1, title: "React Advanced Concepts", instructor: "John Doe", progress: 68, totalLessons: 24, completedLessons: 16, duration: "12 weeks", image: "🎨", status: "In Progress", color: "from-indigo-500 to-purple-600", nextLesson: "State Management Patterns" },
//     { id: 2, title: "Node.js Backend Development", instructor: "Jane Smith", progress: 45, totalLessons: 30, completedLessons: 14, duration: "10 weeks", image: "💻", status: "In Progress", color: "from-emerald-500 to-teal-600", nextLesson: "Authentication & Authorization" },
//     { id: 3, title: "UI/UX Design Fundamentals", instructor: "Mike Johnson", progress: 82, totalLessons: 18, completedLessons: 15, duration: "8 weeks", image: "🎯", status: "In Progress", color: "from-purple-500 to-pink-600", nextLesson: "User Testing Techniques" },
//     { id: 4, title: "Database Architecture", instructor: "Sarah Lee", progress: 34, totalLessons: 22, completedLessons: 8, duration: "14 weeks", image: "🗄️", status: "In Progress", color: "from-blue-500 to-cyan-600", nextLesson: "Indexing Strategies" },
//   ];

//   const weeklyProgress = [
//     { day: "Mon", hours: 3.5 }, { day: "Tue", hours: 4.2 }, { day: "Wed", hours: 2.8 },
//     { day: "Thu", hours: 5.1 }, { day: "Fri", hours: 3.9 }, { day: "Sat", hours: 6.2 }, { day: "Sun", hours: 4.5 },
//   ];

//   const skillProgress = [
//     { skill: "React.js", level: 68, maxLevel: 100, color: "bg-blue-500", gradient: "from-blue-500 to-indigo-600" },
//     { skill: "Node.js", level: 45, maxLevel: 100, color: "bg-green-500", gradient: "from-green-500 to-emerald-600" },
//     { skill: "UI/UX", level: 82, maxLevel: 100, color: "bg-purple-500", gradient: "from-purple-500 to-pink-600" },
//     { skill: "Database", level: 34, maxLevel: 100, color: "bg-cyan-500", gradient: "from-cyan-500 to-blue-600" },
//   ];

//   // ================= OVERVIEW =================
//   const OverviewPage = () => {
//     const maxHours = Math.max(...weeklyProgress.map(d => d.hours));
    
//     return (
//       <div className="space-y-6">
//         {/* STATS */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           {stats.map((item) => {
//             const Icon = item.icon;
//             const TrendIcon = item.trend === "up" ? ArrowUp : ArrowDown;
            
//             return (
//               <div key={item.label} className="group relative rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 hover:shadow-xl transition-all duration-300 overflow-hidden">
//                 {/* Gradient background on hover */}
//                 <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
//                 <div className="relative space-y-4">
//                   <div className="flex items-center justify-between">
//                     <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
//                       {item.label}
//                     </p>
//                     <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
//                       <Icon className="w-6 h-6 text-white" />
//                     </div>
//                   </div>
                  
//                   <div>
//                     <p className="text-4xl font-bold text-slate-900 dark:text-white mb-2">{item.value}</p>
//                     <div className="flex items-center gap-1.5">
//                       <TrendIcon className={`w-4 h-4 ${item.trend === "up" ? "text-emerald-500" : "text-red-500"}`} />
//                       <p className={`text-sm font-medium ${item.trend === "up" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
//                         {item.change}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {/* WEEKLY ACTIVITY CHART */}
//         <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-lg">
//           <div className="flex items-center justify-between mb-6">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg">
//                 <BarChart3 className="w-5 h-5 text-white" />
//               </div>
//               <div>
//                 <h2 className="text-xl font-bold text-slate-900 dark:text-white">Weekly Activity</h2>
//                 <p className="text-sm text-slate-600 dark:text-slate-400">Learning hours this week</p>
//               </div>
//             </div>
//             <div className="text-right">
//               <p className="text-3xl font-bold text-slate-900 dark:text-white">30.2h</p>
//               <p className="text-sm text-emerald-600 dark:text-emerald-400">+12% vs last week</p>
//             </div>
//           </div>
          
//           <div className="flex items-end justify-between gap-3 h-48">
//             {weeklyProgress.map((day) => {
//               const heightPercent = (day.hours / maxHours) * 100;
//               return (
//                 <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
//                   <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-t-xl relative overflow-hidden group cursor-pointer">
//                     <div 
//                       className="w-full bg-gradient-to-t from-indigo-600 to-purple-500 rounded-t-xl transition-all duration-500 hover:from-indigo-500 hover:to-purple-400"
//                       style={{ height: `${heightPercent}%`, minHeight: '8px' }}
//                     />
//                     <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
//                   </div>
//                   <div className="text-center">
//                     <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">{day.day}</p>
//                     <p className="text-xs text-slate-500 dark:text-slate-500">{day.hours}h</p>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* COURSE PROGRESS */}
//         <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-lg">
//           <div className="flex items-center gap-3 mb-6">
//             <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
//               <TrendingUp className="w-5 h-5 text-white" />
//             </div>
//             <div>
//               <h2 className="text-xl font-bold text-slate-900 dark:text-white">Course Progress</h2>
//               <p className="text-sm text-slate-600 dark:text-slate-400">Your current learning journey</p>
//             </div>
//           </div>
          
//           <div className="space-y-5">
//             {courseProgress.map((c) => (
//               <div key={c.name} className="group">
//                 <div className="flex justify-between items-center mb-2">
//                   <span className="font-semibold text-slate-900 dark:text-white">{c.name}</span>
//                   <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{c.progress}%</span>
//                 </div>
//                 <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
//                   <div 
//                     className={`h-3 bg-gradient-to-r ${c.gradient} rounded-full transition-all duration-700 ease-out relative`}
//                     style={{ width: `${c.progress}%` }}
//                   >
//                     <div className="absolute inset-0 bg-white/20 animate-pulse" />
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* 3 COLUMNS */}
//         <div className="grid gap-6 lg:grid-cols-3">
//           {/* UPCOMING */}
//           <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-lg">
//             <div className="flex items-center gap-3 mb-5">
//               <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
//                 <Calendar className="w-5 h-5 text-white" />
//               </div>
//               <h3 className="font-bold text-slate-900 dark:text-white text-lg">Upcoming Events</h3>
//             </div>
            
//             <div className="space-y-3">
//               {upcomingEvents.map((e, i) => {
//                 const Icon = e.icon;
//                 return (
//                   <div key={i} className="group p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-300 border border-transparent hover:border-slate-200 dark:hover:border-slate-600">
//                     <div className="flex items-start gap-3">
//                       <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${e.color}`} />
//                       <div className="flex-1 min-w-0">
//                         <p className="text-sm font-semibold text-slate-900 dark:text-white leading-snug">{e.title}</p>
//                         <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{e.date}</p>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//           {/* ACTIVITY */}
//           <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-lg">
//             <div className="flex items-center gap-3 mb-5">
//               <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
//                 <Activity className="w-5 h-5 text-white" />
//               </div>
//               <h3 className="font-bold text-slate-900 dark:text-white text-lg">Recent Activity</h3>
//             </div>
            
//             <div className="space-y-3">
//               {recentActivity.map((a, i) => {
//                 const Icon = a.icon;
//                 return (
//                   <div key={i} className="group p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-300">
//                     <div className="flex items-start gap-3">
//                       <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${a.color}`} />
//                       <div className="flex-1 min-w-0">
//                         <p className="text-sm text-slate-900 dark:text-white leading-snug">{a.action}</p>
//                         <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">{a.time}</p>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//           {/* ACHIEVEMENTS */}
//           <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-lg">
//             <div className="flex items-center gap-3 mb-5">
//               <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg">
//                 <Award className="w-5 h-5 text-white" />
//               </div>
//               <h3 className="font-bold text-slate-900 dark:text-white text-lg">Achievements</h3>
//             </div>
            
//             <div className="space-y-3">
//               {achievements.map((a, i) => {
//                 const Icon = a.icon;
//                 return (
//                   <div 
//                     key={i} 
//                     className={`relative overflow-hidden p-4 rounded-xl border transition-all duration-300 ${
//                       a.unlocked 
//                         ? 'bg-gradient-to-br ' + a.color + ' border-transparent shadow-lg' 
//                         : 'bg-slate-50 dark:bg-slate-700/30 border-slate-200 dark:border-slate-700'
//                     }`}
//                   >
//                     <div className="relative z-10">
//                       <div className="flex items-center gap-3 mb-2">
//                         <Icon className={`w-6 h-6 ${a.unlocked ? 'text-white' : 'text-slate-400 dark:text-slate-600'}`} />
//                         <div className="flex-1">
//                           <p className={`font-semibold text-sm ${a.unlocked ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
//                             {a.title}
//                           </p>
//                           <p className={`text-xs ${a.unlocked ? 'text-white/90' : 'text-slate-600 dark:text-slate-400'}`}>
//                             {a.desc}
//                           </p>
//                         </div>
//                       </div>
                      
//                       {!a.unlocked && (
//                         <div className="mt-3">
//                           <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
//                             <div 
//                               className={`h-1.5 bg-gradient-to-r ${a.color} rounded-full transition-all duration-700`}
//                               style={{ width: `${a.progress}%` }}
//                             />
//                           </div>
//                           <p className="text-xs text-slate-500 dark:text-slate-500 mt-1.5">{a.progress}% complete</p>
//                         </div>
//                       )}
                      
//                       {a.unlocked && (
//                         <div className="absolute top-2 right-2">
//                           <CheckCircle className="w-5 h-5 text-white" />
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // ================= COURSES =================
//   const CoursesPage = () => (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-3xl font-bold text-slate-900 dark:text-white">My Courses</h2>
//           <p className="text-slate-600 dark:text-slate-400 mt-1">Continue your learning journey</p>
//         </div>
//         <button className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300">
//           Browse Catalog
//         </button>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {allCourses.map((c) => (
//           <div key={c.id} className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300">
//             <div className={`h-32 bg-gradient-to-br ${c.color} flex items-center justify-center text-6xl relative overflow-hidden`}>
//               <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
//               <span className="relative z-10 group-hover:scale-110 transition-transform duration-300">{c.image}</span>
//             </div>
            
//             <div className="p-6 space-y-4">
//               <div>
//                 <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-1">{c.title}</h3>
//                 <p className="text-sm text-slate-600 dark:text-slate-400">by {c.instructor}</p>
//               </div>

//               <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
//                 <span>{c.completedLessons}/{c.totalLessons} lessons</span>
//                 <span>{c.duration}</span>
//               </div>

//               <div>
//                 <div className="flex justify-between text-sm mb-2">
//                   <span className="font-semibold text-slate-900 dark:text-white">Progress</span>
//                   <span className="font-bold text-slate-700 dark:text-slate-300">{c.progress}%</span>
//                 </div>
//                 <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
//                   <div 
//                     className={`h-3 bg-gradient-to-r ${c.color} rounded-full transition-all duration-700`}
//                     style={{ width: `${c.progress}%` }}
//                   />
//                 </div>
//               </div>

//               <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
//                 <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">Next up:</p>
//                 <p className="text-sm font-semibold text-slate-900 dark:text-white mb-3">{c.nextLesson}</p>
                
//                 <button className={`w-full bg-gradient-to-r ${c.color} text-white py-3 rounded-xl flex items-center justify-center gap-2 font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300`}>
//                   <Play className="w-4 h-4" />
//                   Continue Learning
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );

//   // ================= PROGRESS =================
//   const ProgressPage = () => (
//     <div className="space-y-6">
//       <div>
//         <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Learning Progress</h2>
//         <p className="text-slate-600 dark:text-slate-400 mt-1">Track your skill development and achievements</p>
//       </div>

//       {/* Skills Progress */}
//       <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-lg">
//         <div className="flex items-center gap-3 mb-6">
//           <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
//             <Target className="w-5 h-5 text-white" />
//           </div>
//           <div>
//             <h3 className="font-bold text-xl text-slate-900 dark:text-white">Skill Mastery</h3>
//             <p className="text-sm text-slate-600 dark:text-slate-400">Your technical expertise levels</p>
//           </div>
//         </div>
        
//         <div className="space-y-6">
//           {skillProgress.map((s) => (
//             <div key={s.skill}>
//               <div className="flex justify-between items-center mb-3">
//                 <div>
//                   <span className="font-semibold text-lg text-slate-900 dark:text-white">{s.skill}</span>
//                   <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
//                     {s.level < 30 ? 'Beginner' : s.level < 60 ? 'Intermediate' : s.level < 85 ? 'Advanced' : 'Expert'}
//                   </p>
//                 </div>
//                 <div className="text-right">
//                   <span className="text-2xl font-bold text-slate-900 dark:text-white">{s.level}</span>
//                   <span className="text-slate-500 dark:text-slate-500">/{s.maxLevel}</span>
//                 </div>
//               </div>
//               <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
//                 <div 
//                   className={`h-4 bg-gradient-to-r ${s.gradient} rounded-full transition-all duration-700 relative`}
//                   style={{ width: `${(s.level / s.maxLevel) * 100}%` }}
//                 >
//                   <div className="absolute inset-0 bg-white/20 animate-pulse" />
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Learning Streak */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-lg">
//           <div className="flex items-center gap-3 mb-4">
//             <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
//               <Zap className="w-6 h-6" />
//             </div>
//             <div>
//               <h3 className="font-bold text-lg">Learning Streak</h3>
//               <p className="text-sm text-white/80">Keep it going!</p>
//             </div>
//           </div>
//           <p className="text-5xl font-bold mb-2">7 days</p>
//           <p className="text-white/90">Your longest streak: 12 days</p>
//         </div>

//         <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg">
//           <div className="flex items-center gap-3 mb-4">
//             <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
//               <Trophy className="w-6 h-6" />
//             </div>
//             <div>
//               <h3 className="font-bold text-lg">Total Points</h3>
//               <p className="text-sm text-white/80">Keep learning to earn more</p>
//             </div>
//           </div>
//           <p className="text-5xl font-bold mb-2">2,845</p>
//           <p className="text-white/90">Rank: Top 15% of learners</p>
//         </div>
//       </div>
//     </div>
//   );

//   // ================= ROOT =================
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
//       <div className="max-w-7xl mx-auto space-y-8">
//         {/* HEADER */}
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
//           <div>
//             <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//               Student Dashboard
//             </h1>
//             <p className="text-slate-600 dark:text-slate-400 mt-2">Welcome back! Ready to continue learning?</p>
//           </div>

//           <div className="flex gap-2 bg-white dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg">
//             {["overview", "courses", "progress"].map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(tab)}
//                 className={`px-6 py-2.5 rounded-lg text-sm font-semibold capitalize transition-all duration-300 ${
//                   activeTab === tab
//                     ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
//                     : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
//                 }`}
//               >
//                 {tab}
//               </button>
//             ))}
//           </div>
//         </div>

//         {activeTab === "overview" && <OverviewPage />}
//         {activeTab === "courses" && <CoursesPage />}
//         {activeTab === "progress" && <ProgressPage />}
//       </div>
//     </div>
//   );
// };

// export default DashboardPage;



import React, { useState } from "react";
import {
  BookOpen,
  CheckCircle,
  Clock,
  Percent,
  Calendar,
  Bell,
  TrendingUp,
  Award,
  Target,
  Activity,
  Video,
  ArrowUp,
  ArrowDown,
  Play,
  FileText,
  Users,
  Zap,
  BarChart3,
  Trophy,
} from "lucide-react";

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // ================= ZERO DATA =================
  const stats = [
    { label: "Active Courses", value: "0", change: "0 this month", trend: "up", icon: BookOpen, gradient: "from-indigo-600 to-purple-600" },
    { label: "Completed Courses", value: "0", change: "0 completed", trend: "up", icon: CheckCircle, gradient: "from-emerald-500 to-teal-600" },
    { label: "Pending Assessments", value: "0", change: "0 overdue", trend: "down", icon: Clock, gradient: "from-amber-500 to-orange-600" },
    { label: "Attendance", value: "0%", change: "No data", trend: "up", icon: Percent, gradient: "from-sky-500 to-blue-600" },
  ];

  const courseProgress = [];
  const upcomingEvents = [];
  const recentActivity = [];
  const achievements = [];
  const allCourses = [];
  const weeklyProgress = [
    { day: "Mon", hours: 0 },
    { day: "Tue", hours: 0 },
    { day: "Wed", hours: 0 },
    { day: "Thu", hours: 0 },
    { day: "Fri", hours: 0 },
    { day: "Sat", hours: 0 },
    { day: "Sun", hours: 0 },
  ];

  const skillProgress = [
    { skill: "React.js", level: 0, maxLevel: 100, gradient: "from-blue-500 to-indigo-600" },
    { skill: "Node.js", level: 0, maxLevel: 100, gradient: "from-green-500 to-emerald-600" },
    { skill: "UI/UX", level: 0, maxLevel: 100, gradient: "from-purple-500 to-pink-600" },
    { skill: "Database", level: 0, maxLevel: 100, gradient: "from-cyan-500 to-blue-600" },
  ];

  // ================= OVERVIEW =================
  const OverviewPage = () => {
    const maxHours = 1; // prevent divide by zero

    return (
      <div className="space-y-6">
        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((item) => {
            const Icon = item.icon;
            const TrendIcon = item.trend === "up" ? ArrowUp : ArrowDown;

            return (
              <div
                key={item.label}
                className="rounded-2xl border bg-white dark:bg-slate-800 p-6 shadow"
              >
                <div className="flex justify-between items-center">
                  <p className="text-xs uppercase text-slate-500">
                    {item.label}
                  </p>
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>

                <p className="text-3xl font-bold mt-4 text-slate-900 dark:text-white">
                  {item.value}
                </p>

                <div className="flex items-center gap-1 text-xs mt-2 text-slate-500">
                  <TrendIcon className="w-3 h-3" />
                  {item.change}
                </div>
              </div>
            );
          })}
        </div>

        {/* WEEKLY ACTIVITY */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border shadow">
          <h2 className="text-lg font-bold mb-4">Weekly Activity</h2>
          <div className="flex items-end gap-3 h-32">
            {weeklyProgress.map((d) => (
              <div key={d.day} className="flex-1 text-center">
                <div className="h-20 bg-slate-200 dark:bg-slate-700 rounded" />
                <p className="text-xs mt-2 text-slate-500">{d.day}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-slate-500 mt-4">
            No activity data available
          </p>
        </div>

        {/* EMPTY SECTIONS */}
        <div className="grid lg:grid-cols-3 gap-6">
          <EmptyCard title="Upcoming Events" />
          <EmptyCard title="Recent Activity" />
          <EmptyCard title="Achievements" />
        </div>
      </div>
    );
  };

  const EmptyCard = ({ title }) => (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border shadow">
      <h3 className="font-bold mb-2">{title}</h3>
      <p className="text-sm text-slate-500">No data available</p>
    </div>
  );

  // ================= COURSES =================
  const CoursesPage = () => (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border shadow">
      <h2 className="text-2xl font-bold mb-2">My Courses</h2>
      <p className="text-slate-500">No courses enrolled yet</p>
    </div>
  );

  // ================= PROGRESS =================
  const ProgressPage = () => (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border shadow space-y-4">
      <h2 className="text-2xl font-bold">Learning Progress</h2>

      {skillProgress.map((s) => (
        <div key={s.skill}>
          <div className="flex justify-between text-sm mb-1">
            <span>{s.skill}</span>
            <span>0 / {s.maxLevel}</span>
          </div>
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full" />
        </div>
      ))}

      <p className="text-sm text-slate-500 mt-4">
        Progress data will appear once learning starts
      </p>
    </div>
  );

  // ================= ROOT =================
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-indigo-600">
              Student Dashboard
            </h1>
            <p className="text-slate-500 mt-1">
              Data will load once backend is connected
            </p>
          </div>

          <div className="flex gap-2 bg-white dark:bg-slate-800 p-1 rounded-xl border">
            {["overview", "courses", "progress"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm ${
                  activeTab === tab
                    ? "bg-indigo-600 text-white"
                    : "text-slate-500"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "overview" && <OverviewPage />}
        {activeTab === "courses" && <CoursesPage />}
        {activeTab === "progress" && <ProgressPage />}
      </div>
    </div>
  );
};

export default DashboardPage;
