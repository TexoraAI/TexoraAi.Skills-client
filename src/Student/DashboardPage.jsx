// // src/Student/DashboardPage.jsx
// import React, { useState } from "react";
// import {
//   BookOpen,
//   CheckCircle,
//   Clock,
//   Percent,
//   ArrowUp,
//   ArrowDown,
// } from "lucide-react";

// const DashboardPage = () => {
//   const [activeTab, setActiveTab] = useState("overview");

//   /* ===== STATS (ZERO DATA) ===== */
//   const stats = [
//     {
//       label: "Active Courses",
//       value: "0",
//       change: "0 this month",
//       trend: "up",
//       icon: BookOpen,
//       gradient: "from-indigo-600 to-purple-600",
//     },
//     {
//       label: "Completed Courses",
//       value: "0",
//       change: "0 completed",
//       trend: "up",
//       icon: CheckCircle,
//       gradient: "from-emerald-500 to-teal-600",
//     },
//     {
//       label: "Pending Assessments",
//       value: "0",
//       change: "0 overdue",
//       trend: "down",
//       icon: Clock,
//       gradient: "from-amber-500 to-orange-600",
//     },
//     {
//       label: "Attendance",
//       value: "0%",
//       change: "No data",
//       trend: "up",
//       icon: Percent,
//       gradient: "from-sky-500 to-blue-600",
//     },
//   ];

//   /* ===== OVERVIEW ===== */
//   const OverviewPage = () => (
//     <div className="space-y-6">
//       {/* STATS */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
//         {stats.map((item) => {
//           const Icon = item.icon;
//           const TrendIcon = item.trend === "up" ? ArrowUp : ArrowDown;

//           return (
//             <div
//               key={item.label}
//               className="rounded-2xl border bg-white dark:bg-slate-800 p-5 shadow-sm"
//             >
//               <div className="flex items-center justify-between">
//                 <p className="text-xs uppercase text-slate-500">
//                   {item.label}
//                 </p>
//                 <div
//                   className={`h-9 w-9 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center`}
//                 >
//                   <Icon className="h-4 w-4 text-white" />
//                 </div>
//               </div>

//               <p className="text-2xl font-bold mt-3 text-slate-900 dark:text-white">
//                 {item.value}
//               </p>

//               <div className="flex items-center gap-1 text-xs mt-1 text-slate-500">
//                 <TrendIcon className="h-3 w-3" />
//                 {item.change}
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* EMPTY SECTIONS */}
//       <div className="grid lg:grid-cols-3 gap-5">
//         <EmptyCard title="Upcoming Events" />
//         <EmptyCard title="Recent Activity" />
//         <EmptyCard title="Achievements" />
//       </div>
//     </div>
//   );

//   const EmptyCard = ({ title }) => (
//     <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border shadow-sm">
//       <h3 className="font-semibold mb-1">{title}</h3>
//       <p className="text-sm text-slate-500">No data available</p>
//     </div>
//   );

//   const CoursesPage = () => (
//     <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border shadow-sm">
//       <h2 className="text-lg font-bold mb-1">My Courses</h2>
//       <p className="text-sm text-slate-500">
//         No courses enrolled yet
//       </p>
//     </div>
//   );

//   const ProgressPage = () => (
//     <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border shadow-sm">
//       <h2 className="text-lg font-bold mb-2">
//         Learning Progress
//       </h2>
//       <p className="text-sm text-slate-500">
//         Progress will appear once learning starts
//       </p>
//     </div>
//   );

//   /* ===== ROOT ===== */
//   return (
//     <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-5">
//       <div className="max-w-7xl mx-auto space-y-6">

//         {/* ===== HERO SECTION ===== */}
//         <div className="rounded-3xl p-6 text-white shadow-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//             <div>
//               <h1 className="text-2xl font-bold">
//                 Student Dashboard
//               </h1>
//               <p className="text-sm opacity-90 mt-1">
//                 Data will load once backend is connected
//               </p>
//             </div>

//             {/* TABS */}
//             <div className="flex bg-white/20 backdrop-blur p-1 rounded-xl">
//               {["overview", "courses", "progress"].map((tab) => (
//                 <button
//                   key={tab}
//                   onClick={() => setActiveTab(tab)}
//                   className={`px-4 py-1.5 rounded-lg text-sm capitalize transition
//                     ${
//                       activeTab === tab
//                         ? "bg-white text-indigo-600 font-medium"
//                         : "text-white/80 hover:text-white"
//                     }`}
//                 >
//                   {tab}
//                 </button>
//               ))}
//             </div>
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

import React, { useState, useEffect } from "react";
import {
  BookOpen,
  CheckCircle,
  Clock,
  Percent,
  ArrowUp,
  ArrowDown,
  User,
} from "lucide-react";
import { getStudentClassroom } from "@/services/batchService";

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [classroom, setClassroom] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD CLASSROOM ================= */

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getStudentClassroom();
        setClassroom(res.data);
      } catch (e) {
        console.log("Student not assigned yet");
        setClassroom(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  /* ===== STATS ===== */

  const stats = [
    {
      label: "Active Courses",
      value: "0",
      change: "0 this month",
      trend: "up",
      icon: BookOpen,
      gradient: "from-indigo-600 to-purple-600",
    },
    {
      label: "Completed Courses",
      value: "0",
      change: "0 completed",
      trend: "up",
      icon: CheckCircle,
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      label: "Pending Assessments",
      value: "0",
      change: "0 overdue",
      trend: "down",
      icon: Clock,
      gradient: "from-amber-500 to-orange-600",
    },
    {
      label: "Attendance",
      value: "0%",
      change: "No data",
      trend: "up",
      icon: Percent,
      gradient: "from-sky-500 to-blue-600",
    },
  ];

  /* ===== CLASSROOM CARD ===== */

  const ClassroomCard = () => (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border shadow-sm flex items-center gap-4">
      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
        <User className="text-white" />
      </div>

      {loading ? (
        <div>
          <h3 className="font-semibold">Loading classroom...</h3>
          <p className="text-sm text-slate-500">Please wait</p>
        </div>
      ) : classroom ? (
        <div>
          <h3 className="font-semibold">{classroom.batchName}</h3>
          <p className="text-sm text-slate-500">
            Trainer: {classroom.trainerName}
          </p>
          <p className="text-xs text-slate-400">{classroom.trainerEmail}</p>
        </div>
      ) : (
        <div>
          <h3 className="font-semibold">No Classroom Assigned</h3>
          <p className="text-sm text-slate-500">
            Waiting for admin to assign trainer
          </p>
        </div>
      )}
    </div>
  );

  /* ===== OVERVIEW ===== */

  const OverviewPage = () => (
    <div className="space-y-6">
      <ClassroomCard />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((item) => {
          const Icon = item.icon;
          const TrendIcon = item.trend === "up" ? ArrowUp : ArrowDown;

          return (
            <div
              key={item.label}
              className="rounded-2xl border bg-white dark:bg-slate-800 p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase text-slate-500">{item.label}</p>
                <div
                  className={`h-9 w-9 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center`}
                >
                  <Icon className="h-4 w-4 text-white" />
                </div>
              </div>

              <p className="text-2xl font-bold mt-3 text-slate-900 dark:text-white">
                {item.value}
              </p>

              <div className="flex items-center gap-1 text-xs mt-1 text-slate-500">
                <TrendIcon className="h-3 w-3" />
                {item.change}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const CoursesPage = () => (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border shadow-sm">
      <h2 className="text-lg font-bold mb-1">My Courses</h2>
      <p className="text-sm text-slate-500">Courses will appear here</p>
    </div>
  );

  const ProgressPage = () => (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border shadow-sm">
      <h2 className="text-lg font-bold mb-2">Learning Progress</h2>
      <p className="text-sm text-slate-500">Progress will appear here</p>
    </div>
  );

  /* ===== ROOT ===== */

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-5">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HERO */}
        <div className="rounded-3xl p-6 text-white shadow-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Student Dashboard</h1>
              <p className="text-sm opacity-90 mt-1">
                Your classroom & learning overview
              </p>
            </div>

            <div className="flex bg-white/20 backdrop-blur p-1 rounded-xl">
              {["overview", "courses", "progress"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-lg text-sm capitalize transition
                    ${
                      activeTab === tab
                        ? "bg-white text-indigo-600 font-medium"
                        : "text-white/80 hover:text-white"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
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
