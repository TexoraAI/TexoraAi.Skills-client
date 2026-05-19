import React, { useState, useMemo } from "react";
import { useUserManagement } from "../context/UserManagementContext";
// import { USER_STATUS } from "../../constants/permissions";
import { USER_STATUS } from "../constants/permissions";
// ─── Star Rating ──────────────────────────────────────────────
const StarRating = ({ rating }) => {
  const stars = Math.round(rating);
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width={12} height={12} viewBox="0 0 24 24" fill={i <= stars ? "#f59e0b" : "none"} stroke="#f59e0b" strokeWidth={1.5}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
};

// ─── Bar Chart Horizontal ─────────────────────────────────────
const HBar = ({ label, value, max, color }) => (
  <div className="flex items-center gap-3">
    <span className="text-xs text-slate-400 w-24 truncate shrink-0">{label}</span>
    <div className="flex-1 bg-white/6 rounded-full h-2">
      <div className="h-2 rounded-full transition-all duration-700" style={{ width: `${(value / max) * 100}%`, background: color }} />
    </div>
    <span className="text-xs font-bold text-white tabular-nums w-10 text-right">{value}</span>
  </div>
);

// ─── Spark ────────────────────────────────────────────────────
const Spark = ({ values, color }) => {
  const max = Math.max(...values, 1);
  return (
    <div className="flex items-end gap-[3px] h-8">
      {values.map((v, i) => (
        <div key={i} className="flex-1 rounded-sm" style={{ height: `${(v / max) * 100}%`, minHeight: 2, background: color, opacity: 0.5 + (i / values.length) * 0.5 }} />
      ))}
    </div>
  );
};

// ─── Main ─────────────────────────────────────────────────────
const TrainerAnalytics = () => {
  const { trainers } = useUserManagement();
  const [sortKey, setSortKey] = useState("rating");
  const [range, setRange] = useState("30d");

  const stats = useMemo(() => {
    const active = trainers.filter((t) => t.status === USER_STATUS.ACTIVE);
    const avgRating = (trainers.reduce((a, t) => a + parseFloat(t.rating || 0), 0) / (trainers.length || 1)).toFixed(2);
    const totalStudents = trainers.reduce((a, t) => a + (t.totalStudents || 0), 0);
    const topTrainers = [...trainers]
      .sort((a, b) => {
        if (sortKey === "rating") return parseFloat(b.rating || 0) - parseFloat(a.rating || 0);
        if (sortKey === "students") return (b.totalStudents || 0) - (a.totalStudents || 0);
        return 0;
      })
      .slice(0, 8);

    const specCount = {};
    trainers.forEach((t) => { specCount[t.specialization || "General"] = (specCount[t.specialization || "General"] || 0) + 1; });
    return { active, avgRating, totalStudents, topTrainers, specCount };
  }, [trainers, sortKey]);

  const specMax = Math.max(...Object.values(stats.specCount), 1);
  const specColors = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Trainer Analytics</h2>
          <p className="text-slate-400 text-sm mt-0.5">Performance insights across all platform trainers</p>
        </div>
        <div className="flex items-center gap-1 bg-white/5 border border-white/8 rounded-lg p-1">
          {["7d","30d","90d","1y"].map((r) => (
            <button key={r} onClick={() => setRange(r)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${range === r ? "bg-violet-500 text-white" : "text-slate-400 hover:text-white"}`}
            >{r}</button>
          ))}
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Trainers", value: trainers.length, spark: [4,5,5,6,6,7,7,7,8,8,9,trainers.length], color: "#8b5cf6", trend: 5 },
          { label: "Active Trainers", value: stats.active.length, spark: [3,3,4,4,5,5,5,6,6,6,7,stats.active.length], color: "#10b981", trend: 8 },
          { label: "Avg Rating", value: stats.avgRating + " ⭐", spark: [3.2,3.4,3.3,3.6,3.5,3.7,3.8,3.7,3.9,4.0,4.1,parseFloat(stats.avgRating)], color: "#f59e0b", trend: 3 },
          { label: "Total Students", value: stats.totalStudents, spark: [80,100,90,120,110,140,130,150,145,160,155,stats.totalStudents], color: "#3b82f6", trend: 12 },
        ].map((m) => (
          <div key={m.label} className="rounded-xl bg-white/3 border border-white/8 p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{m.label}</p>
                <p className="text-2xl font-bold text-white mt-1 tabular-nums">{m.value}</p>
              </div>
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400">+{m.trend}%</span>
            </div>
            <Spark values={m.spark} color={m.color} />
          </div>
        ))}
      </div>

      {/* Specialization + Top Trainers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Specialization Breakdown */}
        <div className="rounded-xl bg-white/3 border border-white/8 p-5">
          <p className="text-sm font-semibold text-white mb-4">By Specialization</p>
          <div className="space-y-3">
            {Object.entries(stats.specCount).map(([spec, count], i) => (
              <HBar key={spec} label={spec} value={count} max={specMax} color={specColors[i % specColors.length]} />
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-white/6 space-y-2">
            {[
              { label: "Avg Session Duration", value: "52 min" },
              { label: "Total Live Sessions", value: "284" },
              { label: "Videos Uploaded", value: "1,420" },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-xs text-slate-400">{label}</span>
                <span className="text-xs font-bold text-white">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Trainers Leaderboard */}
        <div className="lg:col-span-2 rounded-xl bg-white/3 border border-white/8 p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-white">Trainer Leaderboard</p>
            <div className="flex items-center gap-1 bg-white/5 border border-white/8 rounded-lg p-1">
              {[{ key: "rating", label: "By Rating" }, { key: "students", label: "By Students" }].map((opt) => (
                <button key={opt.key} onClick={() => setSortKey(opt.key)}
                  className={`px-2.5 py-1 text-xs font-medium rounded transition-all ${sortKey === opt.key ? "bg-violet-500 text-white" : "text-slate-400 hover:text-white"}`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {stats.topTrainers.map((t, i) => (
              <div key={t.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/2 border border-white/5 hover:bg-white/4 transition-all">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                  ${i === 0 ? "bg-amber-500/25 text-amber-400" : i === 1 ? "bg-slate-400/20 text-slate-400" : i === 2 ? "bg-orange-500/20 text-orange-400" : "bg-white/5 text-slate-500"}`}>
                  {i + 1}
                </span>

                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500/50 to-indigo-600/50 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {t.name[0]}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium truncate">{t.name}</p>
                  <p className="text-xs text-slate-500 truncate">{t.specialization}</p>
                </div>

                <div className="text-right shrink-0">
                  <StarRating rating={parseFloat(t.rating || 0)} />
                  <p className="text-xs text-slate-500 mt-0.5">{t.totalStudents} students</p>
                </div>

                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0
                  ${t.status === USER_STATUS.ACTIVE ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>
                  {t.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Avg Student Satisfaction", value: "4.3/5", icon: "😊", color: "text-emerald-400" },
          { label: "Content Hours Uploaded", value: "3,280 hrs", icon: "🎬", color: "text-violet-400" },
          { label: "Assignments Created", value: "842", icon: "📝", color: "text-blue-400" },
          { label: "Quizzes Published", value: "316", icon: "🧠", color: "text-amber-400" },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="rounded-xl bg-white/3 border border-white/8 p-4 flex items-center gap-4">
            <span className="text-3xl">{icon}</span>
            <div>
              <p className={`text-lg font-bold ${color}`}>{value}</p>
              <p className="text-xs text-slate-400 mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainerAnalytics;