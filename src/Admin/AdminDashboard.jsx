

// import React from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Users,
//   BookOpen,
//   Clock,
//   DollarSign,
//   TrendingUp,
//   ArrowUpRight,
//   BarChart3,
//   Calendar,
// } from "lucide-react";

// const AdminDashboard = () => {
//   const navigate = useNavigate();

//   const stats = [
//     { label: "Total Users", value: "0", icon: Users, accent: "text-sky-500" },
//     { label: "Active Courses", value: "0", icon: BookOpen, accent: "text-emerald-500" },
//     { label: "Pending Approvals", value: "0", icon: Clock, accent: "text-amber-500" },
//     { label: "Revenue (MTD)", value: "$0K", icon: DollarSign, accent: "text-violet-500" },
//   ];

//   return (
//     <div className="space-y-6 pb-8">

//       {/* HEADER */}
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-xs font-semibold text-[var(--primary)] uppercase">
//             Admin Portal
//           </p>
//           <h1 className="text-3xl font-bold mt-1">
//             Admin Dashboard
//           </h1>
//           <p className="mt-2 text-sm text-[var(--muted-foreground)]">
//             Manage users, courses and overall platform performance
//           </p>
//         </div>

//         <div className="hidden md:block rounded-lg bg-[var(--card)] border border-[var(--border)] px-4 py-2">
//           <p className="text-xs text-[var(--muted-foreground)]">Current Month</p>
//           <p className="text-sm font-semibold">January 2026</p>
//         </div>
//       </div>

//       {/* QUICK ACTIONS */}
//       <div className="flex flex-wrap gap-3">
//         {["Admin", "Student", "Trainer", "Business"].map((role) => (
//           <button
//             key={role}
//             onClick={() => navigate(`/${role.toLowerCase()}`)}
//             className="px-5 py-2.5 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-medium shadow-sm hover:opacity-90"
//           >
//             {role} Panel
//           </button>
//         ))}
//       </div>

//       {/* STATS */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         {stats.map((stat, i) => {
//           const Icon = stat.icon;
//           return (
//             <div
//               key={i}
//               className="rounded-2xl bg-[var(--card)] border border-[var(--border)] p-6 shadow-sm"
//             >
//               <div className="flex items-center justify-between mb-4">
//                 <div className={`p-2.5 rounded-xl bg-[var(--muted)] ${stat.accent}`}>
//                   <Icon className="w-5 h-5" />
//                 </div>
//                 <span className="text-xs text-emerald-500 flex items-center gap-1">
//                   <TrendingUp className="w-3.5 h-3.5" /> +0%
//                 </span>
//               </div>

//               <p className="text-xs uppercase text-[var(--muted-foreground)]">
//                 {stat.label}
//               </p>
//               <p className="mt-1 text-3xl font-bold">
//                 {stat.value}
//               </p>
//             </div>
//           );
//         })}
//       </div>

//       {/* MAIN GRID */}
//       <div className="grid lg:grid-cols-3 gap-6">

//         {/* REPORTS */}
//         <div className="lg:col-span-2 rounded-2xl bg-[var(--card)] border border-[var(--border)] p-6">
//           <div className="flex items-center justify-between mb-6">
//             <div>
//               <h2 className="text-lg font-semibold">Key Reports</h2>
//               <p className="text-xs text-[var(--muted-foreground)] mt-1">
//                 High-level platform performance
//               </p>
//             </div>
//             <button className="flex items-center gap-1 text-sm text-[var(--primary)] hover:underline">
//               View Details <ArrowUpRight className="w-4 h-4" />
//             </button>
//           </div>

//           <div className="grid md:grid-cols-2 gap-4">
//             {[
//               { title: "User Growth", value: "0%", icon: BarChart3 },
//               { title: "Revenue Trend", value: "$0K", icon: TrendingUp },
//               { title: "Course Performance", value: "0%", icon: BookOpen },
//               { title: "Active Sessions", value: "0", icon: Calendar },
//             ].map((item, idx) => {
//               const Icon = item.icon;
//               return (
//                 <div
//                   key={idx}
//                   className="p-5 rounded-xl bg-[var(--muted)] border border-[var(--border)]"
//                 >
//                   <div className="flex items-center gap-3 mb-3">
//                     <div className="p-2 rounded-lg bg-[var(--card)]">
//                       <Icon className="w-5 h-5 text-[var(--primary)]" />
//                     </div>
//                     <div>
//                       <p className="text-xs text-[var(--muted-foreground)]">
//                         {item.title}
//                       </p>
//                       <p className="text-lg font-bold">{item.value}</p>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* ACTIVITY */}
//         <div className="rounded-2xl bg-[var(--card)] border border-[var(--border)] p-6">
//           <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
//           <div className="text-sm text-[var(--muted-foreground)]">
//             No recent activity
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;




import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  BookOpen,
  Clock,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  BarChart3,
  Calendar,
} from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const stats = [
    {
      label: "Total Users",
      value: "0",
      icon: Users,
      color: "from-sky-500 to-sky-600",
    },
    {
      label: "Active Courses",
      value: "0",
      icon: BookOpen,
      color: "from-emerald-500 to-emerald-600",
    },
    {
      label: "Pending Approvals",
      value: "0",
      icon: Clock,
      color: "from-amber-500 to-amber-600",
    },
    {
      label: "Revenue (MTD)",
      value: "$0K",
      icon: DollarSign,
      color: "from-violet-500 to-violet-600",
    },
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase">
            Admin Portal
          </p>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mt-1">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Manage users, courses and overall platform performance
          </p>
        </div>

        <div className="hidden md:block rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Current Month
          </p>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-200">
            January 2026
          </p>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="flex flex-wrap gap-3">
        {["Admin", "Student", "Trainer", "Business"].map((role) => (
          <button
            key={role}
            onClick={() => navigate(`/${role.toLowerCase()}`)}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700
                       text-white text-sm font-medium shadow-md transition"
          >
            {role} Panel
          </button>
        ))}
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-2xl bg-white dark:bg-slate-900
                         border border-slate-200 dark:border-slate-800
                         p-6 shadow-sm hover:shadow-lg transition"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>

                <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> +0%
                </span>
              </div>

              <p className="text-xs uppercase text-slate-600 dark:text-slate-400">
                {stat.label}
              </p>
              <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-slate-50">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* MAIN GRID */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* REPORTS */}
        <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-slate-900
                        border border-slate-200 dark:border-slate-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                Key Reports
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                High-level platform performance
              </p>
            </div>

            <button className="flex items-center gap-1 text-sm
                               text-indigo-600 dark:text-indigo-400 hover:underline">
              View Details <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: "User Growth", value: "0%", icon: BarChart3 },
              { title: "Revenue Trend", value: "$0K", icon: TrendingUp },
              { title: "Course Performance", value: "0%", icon: BookOpen },
              { title: "Active Sessions", value: "0", icon: Calendar },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800
                             border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-white dark:bg-slate-900">
                      <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {item.title}
                      </p>
                      <p className="text-lg font-bold text-slate-900 dark:text-slate-50">
                        {item.value}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ACTIVITY */}
        <div className="rounded-2xl bg-white dark:bg-slate-900
                        border border-slate-200 dark:border-slate-800 p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
            Recent Activity
          </h2>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            No recent activity
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
