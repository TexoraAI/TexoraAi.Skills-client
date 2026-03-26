// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Users,
//   BookOpen,
//   MessageCircleQuestion,
//   FileCheck,
//   TrendingUp,
//   Clock,
// } from "lucide-react";

// import { getTrainerDashboard } from "../services/batchService";

// const Dashboard = () => {
//   const navigate = useNavigate();

//   /* ================= REAL DATA ================= */
//   const [statsData, setStatsData] = useState({
//     batches: 0,
//     students: 0,
//   });

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const res = await getTrainerDashboard();

//         setStatsData({
//           batches: res.batches.length,
//           students: res.students.length,
//         });
//       } catch (e) {
//         console.error("Dashboard load failed", e);
//       }
//     };

//     load();
//   }, []);

//   /* ================= STATS ================= */
//   const stats = [
//     {
//       label: "Active Batches",
//       value: statsData.batches,
//       icon: BookOpen,
//       color: "from-cyan-500 to-blue-500",
//       route: "/trainer/batches",
//     },
//     {
//       label: "Total Students",
//       value: statsData.students,
//       icon: Users,
//       color: "from-emerald-500 to-green-500",
//       route: "/trainer/student-reports",
//     },
//     {
//       label: "Pending Doubts",
//       value: 0,
//       icon: MessageCircleQuestion,
//       color: "from-amber-500 to-orange-500",
//       route: "/trainer/doubts-management",
//     },
//     {
//       label: "Tests Created",
//       value: 0,
//       icon: FileCheck,
//       color: "from-indigo-500 to-violet-500",
//       route: "/trainer/create-quiz",
//     },
//   ];

//   const students = [];

//   return (
//     <div className="space-y-6 pb-8">
//       {/* ================= COMPACT HERO ================= */}
//       <div className="rounded-2xl p-5 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 text-white shadow-md">
//         <h1 className="text-xl font-semibold">Trainer Dashboard</h1>
//         <p className="text-sm text-white/90">Backend integration in progress</p>
//       </div>

//       {/* ================= STATS ================= */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         {stats.map((stat, i) => {
//           const Icon = stat.icon;
//           return (
//             <button
//               key={i}
//               onClick={() => navigate(stat.route)}
//               className="rounded-xl bg-card border p-4 flex items-center justify-between hover:shadow-md transition"
//             >
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 rounded-lg bg-white shadow flex items-center justify-center">
//                   <Icon className="w-5 h-5 text-blue-600" />
//                 </div>

//                 <div className="text-left">
//                   <p className="text-xs text-muted-foreground">{stat.label}</p>
//                   <p className="text-xl font-bold">{stat.value}</p>
//                 </div>
//               </div>

//               <TrendingUp className="w-4 h-4 text-muted-foreground" />
//             </button>
//           );
//         })}
//       </div>

//       {/* ================= STUDENT PROGRESS ================= */}
//       <div className="rounded-xl bg-card border p-4">
//         <h2 className="text-sm font-semibold mb-2">Student Progress</h2>

//         {students.length === 0 ? (
//           <p className="text-sm text-muted-foreground">
//             No student data available yet
//           </p>
//         ) : null}
//       </div>

//       {/* ================= SCHEDULE ================= */}
//       <div className="rounded-xl bg-card border p-4">
//         <h2 className="text-sm font-semibold mb-1">Today’s Schedule</h2>
//         <div className="flex items-center gap-2 text-sm text-muted-foreground">
//           <Clock className="w-4 h-4" />
//           No upcoming sessions
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;







import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  BookOpen,
  MessageCircleQuestion,
  FileCheck,
  TrendingUp,
  Clock,
} from "lucide-react";

import { getTrainerDashboard } from "../services/batchService";

const Dashboard = () => {
  const navigate = useNavigate();

  /* ================= REAL DATA ================= */
  const [statsData, setStatsData] = useState({
    batches: 0,
    students: 0,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getTrainerDashboard();
        setStatsData({
          batches: res.batches.length,
          students: res.students.length,
        });
      } catch (e) {
        console.error("Dashboard load failed", e);
      }
    };
    load();
  }, []);

  /* ================= STATS ================= */
  const stats = [
    {
      label: "Active Batches",
      value: statsData.batches,
      icon: BookOpen,
      color: "from-cyan-500 to-blue-500",
      iconBg: "bg-gradient-to-br from-cyan-500 to-blue-500",
      route: "/trainer/batches",
    },
    {
      label: "Total Students",
      value: statsData.students,
      icon: Users,
      color: "from-emerald-500 to-green-500",
      iconBg: "bg-gradient-to-br from-emerald-500 to-green-500",
      route: "/trainer/student-reports",
    },
    {
      label: "Pending Doubts",
      value: 0,
      icon: MessageCircleQuestion,
      color: "from-amber-500 to-orange-500",
      iconBg: "bg-gradient-to-br from-amber-500 to-orange-500",
      route: "/trainer/doubts-management",
    },
    {
      label: "Tests Created",
      value: 0,
      icon: FileCheck,
      color: "from-indigo-500 to-violet-500",
      iconBg: "bg-gradient-to-br from-indigo-500 to-violet-500",
      route: "/trainer/create-quiz",
    },
  ];

  const students = [];

  return (
    <div className="p-5 space-y-5 pb-8 max-w-6xl mx-auto">

      {/* ================= HERO ================= */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 px-6 py-5 text-white shadow-xl">
        {/* decorative blobs */}
        <div className="pointer-events-none absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-6 left-1/3 w-32 h-32 rounded-full bg-white/10 blur-2xl" />

        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/60 mb-1">Overview</p>
            <h1 className="text-xl font-bold tracking-tight">Trainer Dashboard</h1>
            <p className="text-xs text-white/60 mt-0.5">Backend integration in progress</p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 px-3 py-1.5 text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_2px_rgba(52,211,153,0.6)]" />
            Live
          </div>
        </div>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <button
              key={i}
              onClick={() => navigate(stat.route)}
              className="group relative overflow-hidden rounded-2xl bg-card border hover:border-border/80 p-5 flex flex-col gap-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 text-left"
            >
              {/* subtle gradient top bar */}
              <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${stat.color} opacity-60 group-hover:opacity-100 transition-opacity`} />

              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-xl ${stat.iconBg} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <TrendingUp className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-muted-foreground/70 transition-colors" />
              </div>

              <div>
                <p className="text-3xl font-extrabold tracking-tight leading-none">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1.5 font-medium">{stat.label}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* ================= BOTTOM ROW ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Student Progress */}
        <div className="rounded-2xl bg-card border p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 rounded-full bg-gradient-to-b from-cyan-500 to-blue-500" />
              <h2 className="text-sm font-semibold">Student Progress</h2>
            </div>
            <span className="text-[11px] font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-full border">
              This week
            </span>
          </div>

          {students.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 gap-3">
              <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center border border-dashed">
                <Users className="w-5 h-5 text-muted-foreground/40" />
              </div>
              <p className="text-xs text-muted-foreground">No student data available yet</p>
            </div>
          ) : null}
        </div>

        {/* Today's Schedule */}
        <div className="rounded-2xl bg-card border p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 rounded-full bg-gradient-to-b from-indigo-500 to-violet-500" />
              <h2 className="text-sm font-semibold">Today's Schedule</h2>
            </div>
            <span className="text-[11px] font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-full border">
              Today
            </span>
          </div>

          <div className="flex flex-col items-center justify-center py-8 gap-3">
            <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center border border-dashed">
              <Clock className="w-5 h-5 text-muted-foreground/40" />
            </div>
            <p className="text-xs text-muted-foreground">No upcoming sessions</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;