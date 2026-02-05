// import React from "react";

// const PerformanceAnalysis = () => {
//   return (
//     <div className="space-y-6">
//       <div>
//         <p className="text-xs font-semibold tracking-wide text-indigo-400 uppercase">
//           Analytics
//         </p>
//         <h1 className="text-2xl font-semibold text-slate-100">
//           Performance Analysis
//         </h1>
//         <p className="mt-1 text-sm text-slate-400">
//           High level view of batches, completion and assessments.
//         </p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         {[
//           { label: "Average course completion", value: "76%" },
//           { label: "Average assessment score", value: "81%" },
//           { label: "Overall attendance", value: "88%" },
//         ].map((stat) => (
//           <div
//             key={stat.label}
//             className="rounded-xl bg-slate-900 border border-slate-700 p-4"
//           >
//             <p className="text-xs text-slate-400 uppercase">{stat.label}</p>
//             <p className="mt-2 text-3xl font-semibold text-white">
//               {stat.value}
//             </p>
//           </div>
//         ))}
//       </div>

//       <div className="rounded-xl bg-slate-900 border border-slate-700 p-4">
//         <h2 className="text-sm font-semibold text-slate-100 mb-2">
//           Notes
//         </h2>
//         <p className="text-sm text-slate-300">
//           Use this page later to integrate real charts (e.g. Recharts /
//           Chart.js) and show trend lines for each metric.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default PerformanceAnalysis;




import React, { useState } from "react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from "recharts";

const PerformanceAnalysis = () => {
  const [timeRange, setTimeRange] = useState("6months");
  const [selectedMetric, setSelectedMetric] = useState("all");

  // Empty data arrays - replace with actual API data
  const completionTrendData = [];
  const assessmentTrendData = [];
  const batchPerformanceData = [];
  const performanceDistributionData = [];
  const moduleCompletionData = [];
  const topPerformers = [];
  const needsAttention = [];

  const stats = [
    {
      label: "Average Course Completion",
      value: "0%",
      change: "0%",
      trend: "up",
      color: "emerald",
      icon: "📚",
      target: "80%",
      progress: 0,
    },
    {
      label: "Average Assessment Score",
      value: "0%",
      change: "0%",
      trend: "up",
      color: "blue",
      icon: "🎯",
      target: "85%",
      progress: 0,
    },
    {
      label: "Overall Attendance",
      value: "0%",
      change: "0%",
      trend: "up",
      color: "purple",
      icon: "✅",
      target: "90%",
      progress: 0,
    },
    {
      label: "Student Engagement",
      value: "0%",
      change: "0%",
      trend: "up",
      color: "cyan",
      icon: "⚡",
      target: "90%",
      progress: 0,
    },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-3 shadow-xl">
          <p className="text-slate-800 dark:text-slate-200 font-medium mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-700 p-8">
        <div className="absolute inset-0 bg-black/10 dark:bg-black/10"></div>
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">📊</span>
            <p className="text-xs font-semibold tracking-wide text-cyan-50 uppercase">
              Analytics Dashboard
            </p>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Performance Analysis
          </h1>
          <p className="text-cyan-50 max-w-2xl">
            Comprehensive insights into student performance, batch analytics, and completion trends
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
        <div className="flex gap-2">
          <button
            onClick={() => setTimeRange("3months")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              timeRange === "3months"
                ? "bg-blue-600 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            3 Months
          </button>
          <button
            onClick={() => setTimeRange("6months")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              timeRange === "6months"
                ? "bg-blue-600 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            6 Months
          </button>
          <button
            onClick={() => setTimeRange("1year")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              timeRange === "1year"
                ? "bg-blue-600 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            1 Year
          </button>
        </div>
        <button className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-medium transition-all flex items-center gap-2">
          <span>📥</span>
          Export Report
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-5 hover:border-slate-300 dark:hover:border-slate-600 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-medium">
                  {stat.label}
                </p>
                <div className="flex items-baseline gap-2 mt-2">
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                  <span className={`text-sm font-medium ${
                    stat.trend === "up" ? "text-emerald-500 dark:text-emerald-400" : "text-rose-500 dark:text-rose-400"
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">Target: {stat.target}</span>
                <span className="text-slate-600 dark:text-slate-300">{stat.progress.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full bg-gradient-to-r ${
                    stat.color === "emerald"
                      ? "from-emerald-500 to-emerald-400"
                      : stat.color === "blue"
                      ? "from-blue-500 to-blue-400"
                      : stat.color === "purple"
                      ? "from-purple-500 to-purple-400"
                      : "from-cyan-500 to-cyan-400"
                  }`}
                  style={{ width: `${stat.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completion Trend */}
        <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>📈</span>
              Course Completion Trend
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Monthly completion vs target rates
            </p>
          </div>
          {completionTrendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={completionTrendData}>
                <defs>
                  <linearGradient id="completionGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="completion"
                  stroke="#3b82f6"
                  fill="url(#completionGradient)"
                  strokeWidth={2}
                  name="Completion"
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#10b981"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  name="Target"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[280px] flex items-center justify-center bg-slate-100 dark:bg-slate-800/50 rounded-lg">
              <div className="text-center">
                <span className="text-4xl mb-2 block">📊</span>
                <p className="text-slate-600 dark:text-slate-400 text-sm">No data available</p>
                <p className="text-slate-500 dark:text-slate-500 text-xs mt-1">Connect your data source to view trends</p>
              </div>
            </div>
          )}
        </div>

        {/* Assessment & Attendance Trend */}
        <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>📊</span>
              Assessment & Attendance Trends
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Performance metrics over time
            </p>
          </div>
          {assessmentTrendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={assessmentTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  name="Assessment Score"
                  dot={{ fill: "#8b5cf6", r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="attendance"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  name="Attendance"
                  dot={{ fill: "#06b6d4", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[280px] flex items-center justify-center bg-slate-100 dark:bg-slate-800/50 rounded-lg">
              <div className="text-center">
                <span className="text-4xl mb-2 block">📈</span>
                <p className="text-slate-600 dark:text-slate-400 text-sm">No data available</p>
                <p className="text-slate-500 dark:text-slate-500 text-xs mt-1">Connect your data source to view trends</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Batch Performance & Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Batch Performance */}
        <div className="lg:col-span-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>🎓</span>
              Batch Performance Comparison
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Completion rates across different batches
            </p>
          </div>
          {batchPerformanceData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={batchPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="batch" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="completion" fill="#3b82f6" name="Completion" radius={[4, 4, 0, 0]} />
                <Bar dataKey="score" fill="#8b5cf6" name="Avg Score" radius={[4, 4, 0, 0]} />
                <Bar dataKey="attendance" fill="#06b6d4" name="Attendance" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[280px] flex items-center justify-center bg-slate-100 dark:bg-slate-800/50 rounded-lg">
              <div className="text-center">
                <span className="text-4xl mb-2 block">🎓</span>
                <p className="text-slate-600 dark:text-slate-400 text-sm">No batch data available</p>
                <p className="text-slate-500 dark:text-slate-500 text-xs mt-1">Add batches to view comparison</p>
              </div>
            </div>
          )}
        </div>

        {/* Performance Distribution */}
        <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>🎯</span>
              Performance Distribution
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Student performance breakdown
            </p>
          </div>
          {performanceDistributionData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={performanceDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {performanceDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {performanceDistributionData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-slate-600 dark:text-slate-300">{item.name}</span>
                    </div>
                    <span className="text-slate-500 dark:text-slate-400 font-medium">{item.value}%</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-[280px] flex items-center justify-center">
              <div className="text-center">
                <span className="text-4xl mb-2 block">🎯</span>
                <p className="text-slate-600 dark:text-slate-400 text-sm">No distribution data</p>
                <p className="text-slate-500 dark:text-slate-500 text-xs mt-1">Data will appear once students enroll</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Module Completion & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Module Completion */}
        <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>📚</span>
              Module Completion Rates
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Progress across course modules
            </p>
          </div>
          <div className="space-y-4">
            {moduleCompletionData.length > 0 ? (
              moduleCompletionData.map((module) => (
                <div key={module.module}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{module.module}</span>
                    <span className="text-slate-600 dark:text-slate-400">{module.completion}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        module.completion >= 80
                          ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
                          : module.completion >= 60
                          ? "bg-gradient-to-r from-blue-500 to-blue-400"
                          : "bg-gradient-to-r from-amber-500 to-amber-400"
                      }`}
                      style={{ width: `${module.completion}%` }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-[200px] flex items-center justify-center bg-slate-100 dark:bg-slate-800/50 rounded-lg">
                <div className="text-center">
                  <span className="text-4xl mb-2 block">📚</span>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">No module data available</p>
                  <p className="text-slate-500 dark:text-slate-500 text-xs mt-1">Create courses to track module progress</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Key Insights */}
        <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>💡</span>
              Key Insights
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Automated performance analysis
            </p>
          </div>
          <div className="space-y-3">
            <div className="p-4 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">No insights available yet</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    Insights will be generated automatically once student data is available
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performers & Needs Attention */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>🏆</span>
              Top Performers
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Students exceeding expectations
            </p>
          </div>
          <div className="space-y-3">
            {topPerformers.length > 0 ? (
              topPerformers.map((student, index) => (
                <div
                  key={student.name}
                  className="flex items-center gap-4 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-750 transition-all"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center font-bold text-white text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                      {student.name}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{student.batch}</p>
                  </div>
                  <div className="flex gap-3 text-xs">
                    <div className="text-center">
                      <p className="text-slate-600 dark:text-slate-400">Score</p>
                      <p className="font-semibold text-emerald-500 dark:text-emerald-400">{student.score}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-slate-600 dark:text-slate-400">Compl</p>
                      <p className="font-semibold text-blue-500 dark:text-blue-400">{student.completion}%</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-[200px] flex items-center justify-center bg-slate-100 dark:bg-slate-800/50 rounded-lg">
                <div className="text-center">
                  <span className="text-4xl mb-2 block">🏆</span>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">No top performers yet</p>
                  <p className="text-slate-500 dark:text-slate-500 text-xs mt-1">Students will appear as they excel</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Needs Attention */}
        <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>⚠️</span>
              Needs Attention
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Students requiring additional support
            </p>
          </div>
          <div className="space-y-3">
            {needsAttention.length > 0 ? (
              <>
                {needsAttention.map((student) => (
                  <div
                    key={student.name}
                    className="p-4 bg-rose-50 dark:bg-rose-500/5 border border-rose-200 dark:border-rose-500/20 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-500/10 transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{student.name}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">{student.batch}</p>
                      </div>
                      <span className="px-2 py-1 bg-rose-200 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 text-xs rounded-md font-medium">
                        {student.issue}
                      </span>
                    </div>
                    <div className="flex gap-4 text-xs">
                      <div>
                        <span className="text-slate-600 dark:text-slate-400">Score: </span>
                        <span className="text-slate-700 dark:text-slate-300 font-medium">{student.score}%</span>
                      </div>
                      <div>
                        <span className="text-slate-600 dark:text-slate-400">Completion: </span>
                        <span className="text-slate-700 dark:text-slate-300 font-medium">{student.completion}%</span>
                      </div>
                      <div>
                        <span className="text-slate-600 dark:text-slate-400">Attendance: </span>
                        <span className="text-slate-700 dark:text-slate-300 font-medium">{student.attendance}%</span>
                      </div>
                    </div>
                  </div>
                ))}
                <button className="mt-4 w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-medium transition-all">
                  View All At-Risk Students
                </button>
              </>
            ) : (
              <div className="h-[200px] flex items-center justify-center bg-slate-100 dark:bg-slate-800/50 rounded-lg">
                <div className="text-center">
                  <span className="text-4xl mb-2 block">✨</span>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">All students performing well</p>
                  <p className="text-slate-500 dark:text-slate-500 text-xs mt-1">No intervention needed at this time</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-500/10 dark:to-purple-500/10 border border-blue-200 dark:border-blue-500/20 p-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Understanding Performance Metrics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-700 dark:text-slate-300 font-medium mb-1">Completion Rate</p>
                <p className="text-slate-600 dark:text-slate-400">
                  Percentage of course content completed by students
                </p>
              </div>
              <div>
                <p className="text-slate-700 dark:text-slate-300 font-medium mb-1">Assessment Score</p>
                <p className="text-slate-600 dark:text-slate-400">
                  Average score across all quizzes and assignments
                </p>
              </div>
              <div>
                <p className="text-slate-700 dark:text-slate-300 font-medium mb-1">Attendance</p>
                <p className="text-slate-600 dark:text-slate-400">
                  Percentage of live sessions attended
                </p>
              </div>
              <div>
                <p className="text-slate-700 dark:text-slate-300 font-medium mb-1">Engagement</p>
                <p className="text-slate-600 dark:text-slate-400">
                  Combined metric of participation and activity
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceAnalysis;
