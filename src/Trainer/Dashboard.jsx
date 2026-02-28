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
      route: "/trainer/batches",
    },
    {
      label: "Total Students",
      value: statsData.students,
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

  const students = [];

  return (
    <div className="space-y-6 pb-8">
      {/* ================= COMPACT HERO ================= */}
      <div className="rounded-2xl p-5 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 text-white shadow-md">
        <h1 className="text-xl font-semibold">Trainer Dashboard</h1>
        <p className="text-sm text-white/90">Backend integration in progress</p>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <button
              key={i}
              onClick={() => navigate(stat.route)}
              className="rounded-xl bg-card border p-4 flex items-center justify-between hover:shadow-md transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white shadow flex items-center justify-center">
                  <Icon className="w-5 h-5 text-blue-600" />
                </div>

                <div className="text-left">
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-xl font-bold">{stat.value}</p>
                </div>
              </div>

              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </button>
          );
        })}
      </div>

      {/* ================= STUDENT PROGRESS ================= */}
      <div className="rounded-xl bg-card border p-4">
        <h2 className="text-sm font-semibold mb-2">Student Progress</h2>

        {students.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No student data available yet
          </p>
        ) : null}
      </div>

      {/* ================= SCHEDULE ================= */}
      <div className="rounded-xl bg-card border p-4">
        <h2 className="text-sm font-semibold mb-1">Today’s Schedule</h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          No upcoming sessions
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
