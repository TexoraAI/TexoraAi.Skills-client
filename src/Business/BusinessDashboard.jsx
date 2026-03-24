// src/Business/BusinessDashboard.jsx
import React, { useState } from "react";
import {
  TrendingUp,
  Users,
  DollarSign,
  Target,
  BarChart3,
  PieChart,
  Activity,
  FileText,
} from "lucide-react";

const BusinessDashboard = () => {
  const [activePanel, setActivePanel] = useState("overview");

  /* ================= STATS ================= */
  const stats = [
    {
      label: "Active Leads",
      value: 0,
      change: "+12%",
      trend: "up",
      color: "from-sky-500 to-sky-600",
      Icon: Users,
    },
    {
      label: "Conversions (This Week)",
      value: 0,
      change: "+3%",
      trend: "up",
      color: "from-emerald-500 to-emerald-600",
      Icon: TrendingUp,
    },
    {
      label: "Revenue (MTD)",
      value: "₹0",
      change: "+18%",
      trend: "up",
      color: "from-violet-500 to-violet-600",
      Icon: DollarSign,
    },
    {
      label: "Target Progress",
      value: "0%",
      change: "On track",
      trend: "neutral",
      color: "from-amber-500 to-amber-600",
      Icon: Target,
    },
  ];

  /* ================= OVERVIEW ================= */
  const OverviewPage = () => (
    <div className="space-y-6">
      {/* STATS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl bg-white dark:bg-slate-900 border shadow-sm p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs uppercase text-slate-500">
                {item.label}
              </p>
              <div
                className={`h-10 w-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center`}
              >
                <item.Icon className="h-5 w-5 text-white" />
              </div>
            </div>

            <p className="text-3xl font-bold text-slate-900 dark:text-white">
              {item.value}
            </p>

            <p className="text-xs text-slate-500 mt-1">
              {item.change} vs last period
            </p>
          </div>
        ))}
      </div>

      {/* EMPTY SECTIONS */}
      <div className="grid lg:grid-cols-3 gap-5">
        <EmptyCard title="Sales Pipeline" icon={Activity} />
        <EmptyCard title="Recent Activity" icon={FileText} />
        <EmptyCard title="Key Reports" icon={BarChart3} />
      </div>
    </div>
  );

  const EmptyCard = ({ title, icon: Icon }) => (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border shadow-sm text-center">
      <Icon className="h-8 w-8 mx-auto text-slate-400 mb-2" />
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-slate-500">
        No data available
      </p>
    </div>
  );

  /* ================= PIPELINE ================= */
  const PipelinePage = () => (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border shadow-sm">
      <h2 className="text-lg font-bold mb-2">Sales Pipeline</h2>
      <p className="text-sm text-slate-500">
        Pipeline data will appear here
      </p>
    </div>
  );

  /* ================= REPORTS ================= */
  const ReportsPage = () => (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border shadow-sm">
      <h2 className="text-lg font-bold mb-2">Reports & Analytics</h2>
      <p className="text-sm text-slate-500">
        Reports will load once backend is connected
      </p>
    </div>
  );

  /* ================= ROOT ================= */
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 p-5">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ================= HERO ================= */}
        <div className="rounded-3xl p-6 text-white shadow-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">
              Tenant Admin
              </h1>
              <p className="text-sm opacity-90 mt-1">
                Sales, pipeline & performance overview
              </p>
            </div>

            {/* PANEL SWITCHER */}
            <div className="flex bg-white/20 backdrop-blur p-1 rounded-xl">
              {["overview", "pipeline", "reports"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActivePanel(tab)}
                  className={`px-4 py-1.5 rounded-lg text-sm capitalize transition
                    ${
                      activePanel === tab
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

        {activePanel === "overview" && <OverviewPage />}
        {activePanel === "pipeline" && <PipelinePage />}
        {activePanel === "reports" && <ReportsPage />}
      </div>
    </div>
  );
};

export default BusinessDashboard;
