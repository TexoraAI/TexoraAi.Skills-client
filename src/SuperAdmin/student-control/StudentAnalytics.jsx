import React, { useState, useMemo } from "react";
import { useUserManagement } from "../context/UserManagementContext";
// import { USER_STATUS } from "../../constants/permissions";
import { USER_STATUS } from "../constants/permissions";
// ─── Mini Sparkline Bar ───────────────────────────────────────
const SparkBar = ({ values = [], color = "#8b5cf6", height = 40 }) => {
  const max = Math.max(...values, 1);
  return (
    <div className="flex items-end gap-[3px]" style={{ height }}>
      {values.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm transition-all duration-500"
          style={{ height: `${(v / max) * 100}%`, minHeight: 2, background: color, opacity: 0.7 + (i / values.length) * 0.3 }}
        />
      ))}
    </div>
  );
};

// ─── Donut Ring ───────────────────────────────────────────────
const DonutRing = ({ percent, color, size = 72, stroke = 8 }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (percent / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.8s ease" }}
      />
    </svg>
  );
};

// ─── Metric Card ─────────────────────────────────────────────
const MetricCard = ({ label, value, sub, trend, sparkData, color = "#8b5cf6" }) => (
  <div className="rounded-xl bg-white/3 border border-white/8 p-5 hover:bg-white/[0.04] transition-all">
    <div className="flex items-start justify-between mb-3">
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-white mt-1 tabular-nums">{value}</p>
        {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
      </div>
      {trend !== undefined && (
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${trend >= 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
          {trend >= 0 ? "▲" : "▼"} {Math.abs(trend)}%
        </span>
      )}
    </div>
    {sparkData && <SparkBar values={sparkData} color={color} height={32} />}
  </div>
);

// ─── Progress Bar Row ─────────────────────────────────────────
const ProgressRow = ({ label, value, max, color, suffix = "" }) => (
  <div className="flex items-center gap-3">
    <span className="text-xs text-slate-400 w-32 truncate shrink-0">{label}</span>
    <div className="flex-1 bg-white/6 rounded-full h-1.5">
      <div
        className="h-1.5 rounded-full transition-all duration-700"
        style={{ width: `${(value / max) * 100}%`, background: color }}
      />
    </div>
    <span className="text-xs font-semibold text-white tabular-nums w-12 text-right">
      {value}{suffix}
    </span>
  </div>
);

// ─── Main Component ───────────────────────────────────────────
const StudentAnalytics = () => {
  const { students } = useUserManagement();
  const [range, setRange] = useState("30d");

  const stats = useMemo(() => {
    const active = students.filter((s) => s.status === USER_STATUS.ACTIVE);
    const avgProgress = Math.round(students.reduce((a, s) => a + (s.progress || 0), 0) / (students.length || 1));
    const topStudents = [...students].sort((a, b) => (b.progress || 0) - (a.progress || 0)).slice(0, 5);
    const progressBuckets = {
      "0–25%": students.filter((s) => (s.progress || 0) <= 25).length,
      "26–50%": students.filter((s) => (s.progress || 0) > 25 && (s.progress || 0) <= 50).length,
      "51–75%": students.filter((s) => (s.progress || 0) > 50 && (s.progress || 0) <= 75).length,
      "76–100%": students.filter((s) => (s.progress || 0) > 75).length,
    };
    return { active, avgProgress, topStudents, progressBuckets };
  }, [students]);

  const enrollSpark = [14, 22, 18, 30, 25, 38, 42, 35, 48, 44, 52, 58];
  const activitySpark = [60, 72, 65, 80, 75, 88, 82, 90, 85, 92, 88, 95];
  const completionSpark = [20, 28, 24, 35, 30, 40, 38, 45, 42, 50, 48, 55];

  const bucketsMax = Math.max(...Object.values(stats.progressBuckets), 1);
  const bucketColors = ["#ef4444", "#f59e0b", "#3b82f6", "#10b981"];

  const ranges = ["7d", "30d", "90d", "1y"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Student Analytics</h2>
          <p className="text-slate-400 text-sm mt-0.5">Deep performance insights across all enrolled students</p>
        </div>
        <div className="flex items-center gap-1 bg-white/5 border border-white/8 rounded-lg p-1">
          {ranges.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${range === r ? "bg-violet-500 text-white" : "text-slate-400 hover:text-white"}`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Total Students" value={students.length} sub="All time registrations" trend={12} sparkData={enrollSpark} color="#8b5cf6" />
        <MetricCard label="Active Students" value={stats.active.length} sub={`${Math.round((stats.active.length / students.length) * 100)}% of total`} trend={8} sparkData={activitySpark} color="#10b981" />
        <MetricCard label="Avg Progress" value={`${stats.avgProgress}%`} sub="Across all courses" trend={5} sparkData={completionSpark} color="#3b82f6" />
        <MetricCard label="Completions" value={students.filter((s) => (s.progress || 0) >= 90).length} sub="Nearly or fully done" trend={15} sparkData={[4,6,5,8,9,11,10,13,12,14,13,16]} color="#f59e0b" />
      </div>

      {/* Progress Distribution + Donut Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Progress Buckets */}
        <div className="lg:col-span-2 rounded-xl bg-white/3 border border-white/8 p-5">
          <p className="text-sm font-semibold text-white mb-4">Progress Distribution</p>
          <div className="space-y-3">
            {Object.entries(stats.progressBuckets).map(([label, val], i) => (
              <ProgressRow key={label} label={label} value={val} max={bucketsMax} color={bucketColors[i]} suffix=" students" />
            ))}
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {["Avg Courses Enrolled", "Avg Quizzes Attempted", "Avg Assignments Done", "Cert Downloads"].map((label, i) => (
              <div key={label} className="rounded-lg bg-white/3 border border-white/6 px-3 py-2.5">
                <p className="text-xs text-slate-400">{label}</p>
                <p className="text-base font-bold text-white mt-0.5">{[3.2, 8.5, 12.1, students.filter((s) => (s.progress || 0) >= 90).length][i]}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Engagement Rings */}
        <div className="rounded-xl bg-white/3 border border-white/8 p-5">
          <p className="text-sm font-semibold text-white mb-4">Engagement Overview</p>
          <div className="space-y-5">
            {[
              { label: "Course Completion", percent: stats.avgProgress, color: "#8b5cf6" },
              { label: "Quiz Pass Rate", percent: 74, color: "#10b981" },
              { label: "Attendance Rate", percent: 82, color: "#3b82f6" },
              { label: "Assignment Submission", percent: 68, color: "#f59e0b" },
            ].map(({ label, percent, color }) => (
              <div key={label} className="flex items-center gap-4">
                <div className="relative shrink-0">
                  <DonutRing percent={percent} color={color} size={52} stroke={6} />
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">{percent}%</span>
                </div>
                <div>
                  <p className="text-xs font-medium text-white">{label}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{percent >= 75 ? "🟢 Healthy" : percent >= 50 ? "🟡 Needs attention" : "🔴 Critical"}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="rounded-xl bg-white/3 border border-white/8 p-5">
        <p className="text-sm font-semibold text-white mb-4">Top Performing Students</p>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/6">
                {["Rank", "Student", "Progress", "Courses", "Status", "Last Active"].map((h) => (
                  <th key={h} className="pb-2 px-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider first:pl-0">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/4">
              {stats.topStudents.map((s, i) => (
                <tr key={s.id} className="hover:bg-white/2 transition-colors">
                  <td className="py-3 pl-0 pr-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                      ${i === 0 ? "bg-amber-500/20 text-amber-400" : i === 1 ? "bg-slate-400/15 text-slate-400" : i === 2 ? "bg-orange-500/15 text-orange-400" : "bg-white/5 text-slate-500"}`}>
                      {i + 1}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500/50 to-indigo-600/50 flex items-center justify-center text-white text-xs font-bold">{s.name[0]}</div>
                      <div>
                        <p className="text-sm text-white font-medium">{s.name}</p>
                        <p className="text-xs text-slate-500">{s.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2 min-w-28">
                      <div className="flex-1 bg-white/8 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full bg-violet-500" style={{ width: `${s.progress}%` }} />
                      </div>
                      <span className="text-xs font-bold text-violet-400 w-8 text-right">{s.progress}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-sm text-white font-medium">{s.enrolledCourses || 1}</td>
                  <td className="py-3 px-3">
                    <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-medium capitalize">{s.status}</span>
                  </td>
                  <td className="py-3 px-3 text-xs text-slate-500">
                    {s.lastLogin ? new Date(s.lastLogin).toLocaleDateString("en-IN") : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentAnalytics;