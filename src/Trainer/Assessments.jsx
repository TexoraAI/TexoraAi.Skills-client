// import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import {
//   ClipboardList,
//   Search,
//   Plus,
//   Calendar,
//   TrendingUp,
//   Users,
//   FileText,
//   BarChart3,
//   Download,
//   BookOpen,
//   Trophy,
//   Target,
//   AlertCircle,
//   Sparkles,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// const Assessments = () => {
//   const navigate = useNavigate();
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filterType, setFilterType] = useState("All");

//   // Empty arrays for initial state
//   const upcoming = [];
//   const recentAssessments = [];

//   // Calculate stats (all will be 0 initially)
//   const totalScheduled = upcoming.filter(a => a.status === "Scheduled").length;
//   const totalDrafts = upcoming.filter(a => a.status === "Draft").length;
//   const totalEnrolled = upcoming.reduce((acc, a) => acc + a.enrolled, 0);
//   const avgRecentScore = recentAssessments.length > 0
//     ? (recentAssessments.reduce((acc, a) => acc + a.avgScore, 0) / recentAssessments.length).toFixed(1)
//     : 0;

//   const filteredUpcoming = upcoming.filter((item) => {
//     const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       item.batch.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesType = filterType === "All" || item.type === filterType;
//     return matchesSearch && matchesType;
//   });

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
//       {/* Premium Hero Header */}
//       <div className="bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 dark:from-sky-700 dark:via-blue-800 dark:to-indigo-900">

//         <div className="max-w-7xl mx-auto px-6 py-8">
//           <div className="flex items-center gap-3 mb-2">
//             <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
//               <ClipboardList className="w-6 h-6 text-white" />
//             </div>
//             <p className="text-xs font-semibold tracking-wide text-indigo-100 uppercase">
//               Assessment Center
//             </p>
//           </div>
//           <h1 className="text-3xl font-bold text-white mb-2">
//             Assessments Overview
//           </h1>
//           <p className="text-indigo-100">
//             Manage quizzes and assignments across all your batches
//           </p>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-6 py-8">
//         {/* Stats Dashboard */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//           <Card className="p-6 border-slate-200 dark:border-slate-800 bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-slate-900">
//             <div className="flex items-center justify-between mb-2">
//               <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
//                 <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
//               </div>
//               <TrendingUp className="w-4 h-4 text-purple-600" />
//             </div>
//             <p className="text-2xl font-bold text-foreground">{totalScheduled}</p>
//             <p className="text-sm text-muted-foreground">Scheduled</p>
//           </Card>

//           <Card className="p-6 border-slate-200 dark:border-slate-800 bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/20 dark:to-slate-900">
//             <div className="flex items-center justify-between mb-2">
//               <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
//                 <FileText className="w-5 h-5 text-amber-600 dark:text-amber-400" />
//               </div>
//               <TrendingUp className="w-4 h-4 text-amber-600" />
//             </div>
//             <p className="text-2xl font-bold text-foreground">{totalDrafts}</p>
//             <p className="text-sm text-muted-foreground">Drafts</p>
//           </Card>

//           <Card className="p-6 border-slate-200 dark:border-slate-800 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-slate-900">
//             <div className="flex items-center justify-between mb-2">
//               <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
//                 <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
//               </div>
//               <TrendingUp className="w-4 h-4 text-blue-600" />
//             </div>
//             <p className="text-2xl font-bold text-foreground">{totalEnrolled}</p>
//             <p className="text-sm text-muted-foreground">Total Students</p>
//           </Card>

//           <Card className="p-6 border-slate-200 dark:border-slate-800 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:to-slate-900">
//             <div className="flex items-center justify-between mb-2">
//               <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
//                 <Trophy className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
//               </div>
//               <TrendingUp className="w-4 h-4 text-emerald-600" />
//             </div>
//             <p className="text-2xl font-bold text-foreground">{avgRecentScore}%</p>
//             <p className="text-sm text-muted-foreground">Avg Score</p>
//           </Card>
//         </div>

//         {/* Upcoming Assessments */}
//         <Card className="p-6 mb-8 border-slate-200 dark:border-slate-800 shadow-sm">
//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
//             <div>
//               <div className="flex items-center gap-2 mb-1">
//                 <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
//                 <h2 className="text-lg font-semibold text-foreground">
//                   Upcoming Assessments
//                 </h2>
//               </div>
//               <p className="text-sm text-muted-foreground">
//                 Quizzes and assignments scheduled for the next few days
//               </p>
//             </div>

//             <div className="flex gap-2">
//               <Button
//                 onClick={() => navigate("/trainer/create-quiz")}
//                 size="sm"
//                 className="gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
//               >
//                 <Plus className="w-4 h-4" />
//                 Create Quiz
//               </Button>
//               <Button
//                 onClick={() => navigate("/trainer/create-assignments")}
//                 size="sm"
//                 variant="outline"
//                 className="gap-2"
//               >
//                 <Plus className="w-4 h-4" />
//                 Create Assignment
//               </Button>
//             </div>
//           </div>

//           {/* Empty State for Upcoming */}
//           {upcoming.length === 0 ? (
//             <div className="text-center py-16 px-4">
//               <div className="inline-flex p-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-4">
//                 <ClipboardList className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
//               </div>
//               <h3 className="text-xl font-semibold text-foreground mb-2">
//                 No Upcoming Assessments
//               </h3>
//               <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
//                 Get started by creating your first quiz or assignment. Track student progress and evaluate their learning effectively.
//               </p>
//               <div className="flex flex-col sm:flex-row gap-3 justify-center">
//                 <Button
//                   onClick={() => navigate("/trainer/create-quiz")}
//                   className="gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
//                 >
//                   <Plus className="w-4 h-4" />
//                   Create Your First Quiz
//                 </Button>
//                 <Button
//                   onClick={() => navigate("/trainer/create-assignments")}
//                   variant="outline"
//                   className="gap-2"
//                 >
//                   <Plus className="w-4 h-4" />
//                   Create Assignment
//                 </Button>
//               </div>
//             </div>
//           ) : (
//             <>
//               {/* Search & Filter */}
//               <div className="flex flex-col md:flex-row gap-3 mb-6">
//                 <div className="flex-1 relative">
//                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//                   <Input
//                     placeholder="Search assessments..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     className="pl-10 border-slate-300 dark:border-slate-700"
//                   />
//                 </div>
//                 <div className="flex gap-2">
//                   {["All", "Quiz", "Assignment"].map((type) => (
//                     <Button
//                       key={type}
//                       size="sm"
//                       variant={filterType === type ? "default" : "outline"}
//                       onClick={() => setFilterType(type)}
//                       className={
//                         filterType === type
//                           ? "bg-indigo-600 hover:bg-indigo-700 text-white"
//                           : ""
//                       }
//                     >
//                       {type}
//                     </Button>
//                   ))}
//                 </div>
//               </div>

//               {/* Assessment List (will show when data exists) */}
//               <div className="space-y-3">
//                 {filteredUpcoming.map((item) => (
//                   <div
//                     key={item.id}
//                     className="group rounded-lg border border-slate-200 dark:border-slate-800 p-5 bg-background hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all hover:shadow-md"
//                   >
//                     {/* Assessment card content here */}
//                   </div>
//                 ))}
//               </div>
//             </>
//           )}
//         </Card>

//         {/* Recent Assessments */}
//         <Card className="p-6 border-slate-200 dark:border-slate-800 shadow-sm">
//           <div className="flex items-center justify-between mb-6">
//             <div>
//               <div className="flex items-center gap-2 mb-1">
//                 <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
//                 <h2 className="text-lg font-semibold text-foreground">
//                   Recent Assessments
//                 </h2>
//               </div>
//               <p className="text-sm text-muted-foreground">
//                 Completed assessments and their performance analytics
//               </p>
//             </div>
//             {recentAssessments.length > 0 && (
//               <Button variant="outline" size="sm" className="gap-2">
//                 <Download className="w-4 h-4" />
//                 Export
//               </Button>
//             )}
//           </div>

//           {/* Empty State for Recent */}
//           {recentAssessments.length === 0 ? (
//             <div className="text-center py-16 px-4">
//               <div className="inline-flex p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
//                 <BarChart3 className="w-12 h-12 text-blue-600 dark:text-blue-400" />
//               </div>
//               <h3 className="text-xl font-semibold text-foreground mb-2">
//                 No Completed Assessments Yet
//               </h3>
//               <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
//                 Once students complete your assessments, you'll see detailed analytics and performance metrics here.
//               </p>
//               <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
//                 <Sparkles className="w-4 h-4" />
//                 <span>Create assessments to start tracking student progress</span>
//               </div>
//             </div>
//           ) : (
//             <div className="space-y-3">
//               {recentAssessments.map((item) => (
//                 <div
//                   key={item.id}
//                   className="rounded-lg border border-slate-200 dark:border-slate-800 p-5 bg-background hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all"
//                 >
//                   {/* Recent assessment card content here */}
//                 </div>
//               ))}
//             </div>
//           )}
//         </Card>

//         {/* Help Section */}
//         <Card className="p-6 mt-8 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-slate-900">
//           <div className="flex gap-4">
//             <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg shrink-0 h-fit">
//               <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
//             </div>
//             <div>
//               <h3 className="font-semibold text-foreground mb-2">
//                 Getting Started with Assessments
//               </h3>
//               <ul className="text-sm text-muted-foreground space-y-2">
//                 <li className="flex items-start gap-2">
//                   <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
//                   <span>Create quizzes to test student knowledge with multiple choice, true/false, and short answer questions</span>
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
//                   <span>Set up assignments for practical tasks and projects with file uploads and deadlines</span>
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
//                   <span>Track student submissions and provide detailed feedback to help them improve</span>
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
//                   <span>View analytics and performance metrics to identify areas where students need support</span>
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default Assessments;


















import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ClipboardList,
  Search,
  Plus,
  Calendar,
  TrendingUp,
  Users,
  FileText,
  BarChart3,
  Download,
  Trophy,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Assessments = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All");

  const upcoming = [];
  const recentAssessments = [];

  const totalScheduled = upcoming.filter((a) => a.status === "Scheduled").length;
  const totalDrafts = upcoming.filter((a) => a.status === "Draft").length;
  const totalEnrolled = upcoming.reduce((acc, a) => acc + a.enrolled, 0);
  const avgRecentScore =
    recentAssessments.length > 0
      ? (
          recentAssessments.reduce((acc, a) => acc + a.avgScore, 0) /
          recentAssessments.length
        ).toFixed(1)
      : 0;

  const filteredUpcoming = upcoming.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.batch.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "All" || item.type === filterType;
    return matchesSearch && matchesType;
  });

  const stats = [
    {
      label: "Scheduled",
      value: totalScheduled,
      icon: Calendar,
      color: "#9333ea",
      bg: "from-purple-50 to-white dark:from-purple-950/20 dark:to-slate-900",
      iconBg: "bg-purple-100 dark:bg-purple-900/30",
      iconColor: "text-purple-600 dark:text-purple-400",
      trendColor: "text-purple-500",
    },
    {
      label: "Drafts",
      value: totalDrafts,
      icon: FileText,
      color: "#d97706",
      bg: "from-amber-50 to-white dark:from-amber-950/20 dark:to-slate-900",
      iconBg: "bg-amber-100 dark:bg-amber-900/30",
      iconColor: "text-amber-600 dark:text-amber-400",
      trendColor: "text-amber-500",
    },
    {
      label: "Total Students",
      value: totalEnrolled,
      icon: Users,
      color: "#2563eb",
      bg: "from-blue-50 to-white dark:from-blue-950/20 dark:to-slate-900",
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400",
      trendColor: "text-blue-500",
    },
    {
      label: "Avg Score",
      value: `${avgRecentScore}%`,
      icon: Trophy,
      color: "#059669",
      bg: "from-emerald-50 to-white dark:from-emerald-950/20 dark:to-slate-900",
      iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      trendColor: "text-emerald-500",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f4f6fb] dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">

      {/* ── HERO ── */}
      <div
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0ea5e9 0%, #2563eb 45%, #4f46e5 100%)",
        }}
      >
        {/* decorative blobs */}
        <div
          className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #bae6fd, transparent)" }}
        />
        <div
          className="pointer-events-none absolute -bottom-8 left-1/3 w-48 h-24 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #818cf8, transparent)" }}
        />

        <div className="relative px-5 py-5">
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.25)" }}
            >
              <ClipboardList style={{ width: 14, height: 14, color: "white" }} />
            </div>
            <p
              className="text-[9px] font-bold uppercase tracking-[0.12em]"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              Assessment Center
            </p>
          </div>
          <h1 className="text-[18px] font-bold text-white leading-tight mb-0.5">
            Assessments Overview
          </h1>
          <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.65)" }}>
            Manage quizzes and assignments across all your batches
          </p>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">

        {/* ── STATS GRID ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {stats.map(({ label, value, icon: Icon, bg, iconBg, iconColor, trendColor }) => (
            <div
              key={label}
              className={`rounded-xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br ${bg} px-4 py-3`}
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${iconBg}`}>
                  <Icon style={{ width: 13, height: 13 }} className={iconColor} />
                </div>
                <TrendingUp style={{ width: 12, height: 12 }} className={trendColor} />
              </div>
              <p className="text-[20px] font-bold text-slate-800 dark:text-slate-100 leading-none mb-0.5">
                {value}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{label}</p>
            </div>
          ))}
        </div>

        {/* ── UPCOMING ASSESSMENTS ── */}
        <div
          className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
          style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.05)" }}
        >
          {/* card header */}
          <div className="px-5 py-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                <Calendar style={{ width: 13, height: 13 }} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-slate-800 dark:text-slate-100 leading-tight">
                  Upcoming Assessments
                </p>
                <p className="text-[11px] text-slate-400">
                  Quizzes & assignments scheduled soon
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => navigate("/trainer/create-quiz")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-[11px] font-semibold transition-all hover:brightness-105"
                style={{
                  background: "linear-gradient(135deg, #9333ea, #6366f1)",
                  boxShadow: "0 2px 6px rgba(99,102,241,0.3)",
                }}
              >
                <Plus style={{ width: 11, height: 11 }} />
                Quiz
              </button>
              <button
                onClick={() => navigate("/trainer/create-assignments")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                <Plus style={{ width: 11, height: 11 }} />
                Assignment
              </button>
            </div>
          </div>

          {/* empty state */}
          {upcoming.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
                style={{ background: "linear-gradient(135deg, #eef2ff, #e0e7ff)" }}
              >
                <ClipboardList style={{ width: 24, height: 24, color: "#6366f1" }} />
              </div>
              <p className="text-[14px] font-semibold text-slate-700 dark:text-slate-200 mb-1">
                No Upcoming Assessments
              </p>
              <p className="text-[12px] text-slate-400 max-w-xs mb-5 leading-relaxed">
                Get started by creating your first quiz or assignment to track student progress effectively.
              </p>
              <div className="flex gap-2.5">
                <button
                  onClick={() => navigate("/trainer/create-quiz")}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-[12px] font-semibold transition-all hover:brightness-105"
                  style={{
                    background: "linear-gradient(135deg, #9333ea, #6366f1)",
                    boxShadow: "0 2px 8px rgba(99,102,241,0.3)",
                  }}
                >
                  <Plus style={{ width: 12, height: 12 }} />
                  Create Quiz
                </button>
                <button
                  onClick={() => navigate("/trainer/create-assignments")}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-semibold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                >
                  <Plus style={{ width: 12, height: 12 }} />
                  Create Assignment
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* search & filter */}
              <div className="px-5 pt-3 pb-3 flex flex-col md:flex-row gap-2.5">
                <div className="flex-1 relative">
                  <Search
                    style={{ width: 13, height: 13 }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    placeholder="Search assessments..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[13px] text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/15 placeholder:text-slate-400"
                  />
                </div>
                <div className="flex gap-1.5">
                  {["All", "Quiz", "Assignment"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilterType(type)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                        filterType === type
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="px-5 pb-4 space-y-2">
                {filteredUpcoming.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all"
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* ── RECENT ASSESSMENTS ── */}
        <div
          className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
          style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.05)" }}
        >
          <div className="px-5 py-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <BarChart3 style={{ width: 13, height: 13 }} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-slate-800 dark:text-slate-100 leading-tight">
                  Recent Assessments
                </p>
                <p className="text-[11px] text-slate-400">
                  Completed assessments & performance analytics
                </p>
              </div>
            </div>
            {recentAssessments.length > 0 && (
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                <Download style={{ width: 11, height: 11 }} />
                Export
              </button>
            )}
          </div>

          {recentAssessments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
                style={{ background: "linear-gradient(135deg, #eff6ff, #dbeafe)" }}
              >
                <BarChart3 style={{ width: 24, height: 24, color: "#3b82f6" }} />
              </div>
              <p className="text-[14px] font-semibold text-slate-700 dark:text-slate-200 mb-1">
                No Completed Assessments Yet
              </p>
              <p className="text-[12px] text-slate-400 max-w-xs mb-4 leading-relaxed">
                Once students complete your assessments, you'll see detailed analytics and performance metrics here.
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <Sparkles style={{ width: 12, height: 12, color: "#60a5fa" }} />
                <span>Create assessments to start tracking progress</span>
              </div>
            </div>
          ) : (
            <div className="px-5 py-4 space-y-2">
              {recentAssessments.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all"
                />
              ))}
            </div>
          )}
        </div>

        {/* ── HELP SECTION ── */}
        <div
          className="rounded-2xl border border-blue-100 dark:border-blue-900/40 px-5 py-4"
          style={{
            background: "linear-gradient(135deg, #eff6ff 0%, #f8faff 100%)",
            boxShadow: "0 1px 3px rgba(59,130,246,0.08)",
          }}
        >
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0 mt-0.5">
              <AlertCircle style={{ width: 14, height: 14 }} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-slate-700 dark:text-slate-200 mb-2">
                Getting Started with Assessments
              </p>
              <ul className="space-y-1.5">
                {[
                  "Create quizzes with multiple choice, true/false, and short answer questions",
                  "Set up assignments for practical tasks with file uploads and deadlines",
                  "Track student submissions and provide detailed feedback",
                  "View analytics and performance metrics to identify support areas",
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span
                      className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: "#3b82f6" }}
                    />
                    <span className="text-[12px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      {tip}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Assessments;