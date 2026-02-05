
// import React from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Users,
//   BookOpen,
//   MessageCircleQuestion,
//   FileCheck,
//   TrendingUp,
//   Calendar,
//   Award,
//   Clock,
// } from "lucide-react";

// const Dashboard = () => {
//   const navigate = useNavigate();

//   const stats = [
//     {
//       label: "Active Batches",
//       value: "0",
//       icon: BookOpen,
//       color: "from-blue-500 to-blue-600",
//       route: "/trainer/batches",
//     },
//     {
//       label: "Total Students",
//       value: "0",
//       icon: Users,
//       color: "from-emerald-500 to-emerald-600",
//       route: "/trainer/student-reports",
//     },
//     {
//       label: "Pending Doubts",
//       value: "0",
//       icon: MessageCircleQuestion,
//       color: "from-amber-500 to-amber-600",
//       route: "/trainer/doubts-management",
//     },
//     {
//       label: "Tests Created",
//       value: "0",
//       icon: FileCheck,
//       color: "from-violet-500 to-violet-600",
//       route: "/trainer/create-quiz",
//     },
//   ];

//   const quickActions = [
//     {
//       label: "Create Quiz",
//       icon: FileCheck,
//       color: "from-purple-500 to-pink-500",
//       route: "/trainer/create-quiz",
//     },
//     {
//       label: "Upload Content",
//       icon: BookOpen,
//       color: "from-blue-500 to-cyan-500",
//       route: "/trainer/upload-videos",
//     },
//     {
//       label: "Attendance",
//       icon: Calendar,
//       color: "from-emerald-500 to-green-500",
//       route: "/trainer/attendance",
//     },
//     {
//       label: "Assessments",
//       icon: Award,
//       color: "from-orange-500 to-red-500",
//       route: "/trainer/assessments",
//     },
//   ];

//   return (
//     <div className="space-y-6 pb-8">
//       {/* Header */}
//       <div>
//         <h1 className="text-3xl font-bold text-foreground">
//           Trainer Dashboard
//         </h1>
//         <p className="mt-1 text-sm text-muted-foreground">
//           Overview of your training activity
//         </p>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         {stats.map((stat, i) => {
//           const Icon = stat.icon;
//           return (
//             <button
//               key={i}
//               onClick={() => navigate(stat.route)}
//               className="rounded-2xl bg-card border p-6 text-left hover:shadow-lg transition"
//             >
//               <div className="flex items-center justify-between">
//                 <div>
//                   <div
//                     className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}
//                   >
//                     <Icon className="w-5 h-5 text-white" />
//                   </div>
//                   <p className="mt-3 text-xs uppercase font-medium text-muted-foreground">
//                     {stat.label}
//                   </p>
//                   <p className="text-3xl font-bold text-foreground">
//                     {stat.value}
//                   </p>
//                 </div>
//                 <TrendingUp className="w-4 h-4 text-muted-foreground" />
//               </div>
//             </button>
//           );
//         })}
//       </div>

//       {/* Quick Actions */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//         {quickActions.map((a, i) => {
//           const Icon = a.icon;
//           return (
//             <button
//               key={i}
//               onClick={() => navigate(a.route)}
//               className="flex items-center gap-3 p-4 rounded-xl bg-card border hover:shadow-md transition"
//             >
//               <div
//                 className={`p-2 rounded-lg bg-gradient-to-br ${a.color}`}
//               >
//                 <Icon className="w-4 h-4 text-white" />
//               </div>
//               <span className="text-sm font-medium text-foreground">
//                 {a.label}
//               </span>
//             </button>
//           );
//         })}
//       </div>

//       {/* Activity Summary */}
//       <div className="grid lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2 rounded-2xl bg-card border p-6">
//           <h2 className="text-lg font-semibold text-foreground mb-4">
//             Recent Activity
//           </h2>

//           <div className="space-y-3">
//             {[
//               { label: "Videos Uploaded", icon: BookOpen },
//               { label: "Doubts Resolved", icon: MessageCircleQuestion },
//               { label: "Tests Conducted", icon: Award },
//             ].map((item, i) => {
//               const Icon = item.icon;
//               return (
//                 <div
//                   key={i}
//                   className="flex items-center justify-between rounded-xl bg-muted p-4"
//                 >
//                   <div className="flex items-center gap-3">
//                     <Icon className="w-4 h-4 text-muted-foreground" />
//                     <p className="text-sm font-medium text-foreground">
//                       {item.label}
//                     </p>
//                   </div>
//                   <span className="text-lg font-bold text-foreground">
//                     0
//                   </span>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* Calendar */}
//         <div className="rounded-2xl bg-card border p-6">
//           <h2 className="text-lg font-semibold text-foreground mb-4">
//             Schedule
//           </h2>

//           <div className="flex items-center gap-3 text-sm text-muted-foreground">
//             <Clock className="w-4 h-4" />
//             No upcoming sessions
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  BookOpen,
  MessageCircleQuestion,
  FileCheck,
  TrendingUp,
  Clock,
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();

  // 🔹 TEMPORARY PLACEHOLDER DATA (Backend pending)
  const stats = [
    {
      label: "Active Batches",
      value: 0,
      icon: BookOpen,
      color: "from-cyan-500 to-blue-500",
      route: "/trainer/batches",
    },
    {
      label: "Total Students",
      value: 0,
      icon: Users,
      color: "from-emerald-500 to-green-500",
      route: "/trainer/student-reports",
    },
    {
      label: "Pending Doubts",
      value: 0,
      icon: MessageCircleQuestion,
      color: "from-amber-500 to-orange-500",
      route: "/trainer/doubts-management",
    },
    {
      label: "Tests Created",
      value: 0,
      icon: FileCheck,
      color: "from-indigo-500 to-violet-500",
      route: "/trainer/create-quiz",
    },
  ];

  const students = []; // 👈 backend se aayega

  return (
    <div className="space-y-8 pb-10">
      {/* Hero Header */}
      <div className="rounded-3xl p-8 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 text-white shadow-xl">
        <h1 className="text-3xl font-bold">Trainer Dashboard</h1>
        <p className="mt-2 text-sm opacity-90">
          Backend integration in progress
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <button
              key={i}
              onClick={() => navigate(stat.route)}
              className="rounded-2xl bg-card border p-6 hover:shadow-xl transition"
            >
              <div className="flex justify-between">
                <div>
                  <div
                    className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="mt-3 text-xs uppercase text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Student Progress */}
      <div className="rounded-2xl bg-card border p-6">
        <h2 className="text-lg font-semibold mb-4">
          Student Progress
        </h2>

        {students.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No student data available yet
          </p>
        ) : null}
      </div>

      {/* Schedule */}
      <div className="rounded-2xl bg-card border p-6">
        <h2 className="text-lg font-semibold mb-2">
          Today’s Schedule
        </h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          No upcoming sessions
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
