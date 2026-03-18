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
    { label: "Total Users", value: "0", icon: Users },
    { label: "Active Courses", value: "0", icon: BookOpen },
    { label: "Pending Approvals", value: "0", icon: Clock },
    { label: "Revenue (MTD)", value: "$0K", icon: DollarSign },
  ];

  return (
    <div className="space-y-5 pb-6">
      {/* HERO SECTION – IMAGE COLOR */}
      <div className="rounded-2xl bg-gradient-to-r from-sky-400 via-blue-500 to-violet-500 p-6 text-white">
        <p className="text-xs uppercase tracking-wide opacity-90">
          Admin Portal
        </p>
        <h1 className="text-2xl font-bold mt-1">Admin Dashboard</h1>
        <p className="text-sm opacity-90 mt-1">
          Manage users, courses & performance
        </p>

        {/* QUICK ACTIONS */}
        <div className="flex flex-wrap gap-2 mt-4">
          {["Admin", "Student", "Trainer", "Business"].map((role) => (
            <button
              key={role}
              onClick={() => navigate(`/${role.toLowerCase()}`)}
              className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30
                         text-sm font-medium backdrop-blur transition"
            >
              {role} Panel
            </button>
          ))}
        </div>
      </div>

      {/* STATS – COMPACT */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-xl bg-white dark:bg-slate-900
                         border border-slate-200 dark:border-slate-800
                         p-4 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-gradient-to-br from-sky-500 to-violet-500 text-white">
                  <Icon className="w-4 h-4" />
                </div>

                <span className="text-xs text-emerald-600 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> 0%
                </span>
              </div>

              <p className="text-xs mt-3 text-slate-500 uppercase">
                {stat.label}
              </p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* MAIN GRID */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* REPORTS */}
        <div className="lg:col-span-2 rounded-xl bg-white dark:bg-slate-900
                        border border-slate-200 dark:border-slate-800 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold">Key Reports</h2>
              <p className="text-xs text-slate-500">
                Platform overview
              </p>
            </div>

            <button className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
              View <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
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
                  className="flex items-center gap-3 p-3 rounded-lg
                             bg-slate-50 dark:bg-slate-800
                             border border-slate-200 dark:border-slate-700"
                >
                  <div className="p-2 rounded-md bg-gradient-to-br from-sky-500 to-violet-500">
                    <Icon className="w-4 h-4 text-white" />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      {item.title}
                    </p>
                    <p className="text-base font-semibold">
                      {item.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ACTIVITY */}
        <div className="rounded-xl bg-white dark:bg-slate-900
                        border border-slate-200 dark:border-slate-800 p-5">
          <h2 className="text-base font-semibold mb-3">
            Recent Activity
          </h2>
          <p className="text-sm text-slate-500">
            No recent activity
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;










