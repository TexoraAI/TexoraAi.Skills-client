import React, { useState } from "react";
import { useUserManagement } from "../context/UserManagementContext";
import { useTheme } from "../context/ThemeContext";

// ─── Sparkline ────────────────────────────────────────────────
const SparkLine = ({ values, color = "#8b5cf6", height = 48 }) => {
  const max = Math.max(...values, 1);
  const min = Math.min(...values);
  const w = 120, h = height, pad = 4;
  const pts = values.map((v, i) => {
    const x = pad + (i / (values.length - 1)) * (w - pad * 2);
    const y = h - pad - ((v - min) / (max - min || 1)) * (h - pad * 2);
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height }} preserveAspectRatio="none">
      <polyline points={pts} fill="none" stroke={color} strokeWidth={1.8} strokeLinejoin="round" strokeLinecap="round" />
      <polygon points={`${pts} ${w - pad},${h} ${pad},${h}`} fill={color} opacity={0.12} />
    </svg>
  );
};

// ─── Metric Card ─────────────────────────────────────────────
const MetricCard = ({ label, value, sub, trend, spark, color, dark }) => (
  <div className={`rounded-xl border p-5 transition-all ${
    dark ? "bg-white/[0.03] border-white/8 hover:bg-white/[0.05]" : "bg-gray-50 border-gray-200 hover:bg-gray-100"
  }`}>
    <div className="flex items-start justify-between mb-1">
      <p className={`text-xs font-semibold uppercase tracking-wider ${dark ? "text-slate-400" : "text-gray-500"}`}>{label}</p>
      {trend !== undefined && (
        <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${trend >= 0 ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"}`}>
          {trend >= 0 ? "+" : ""}{trend}%
        </span>
      )}
    </div>
    <p className={`text-2xl font-bold tabular-nums mt-1 ${dark ? "text-white" : "text-gray-800"}`}>{value}</p>
    {sub && <p className={`text-xs mt-0.5 ${dark ? "text-slate-500" : "text-gray-400"}`}>{sub}</p>}
    {spark && <div className="mt-3"><SparkLine values={spark} color={color} height={36} /></div>}
  </div>
);

// ─── Section Header ───────────────────────────────────────────
const SectionHeader = ({ title, sub, right, dark }) => (
  <div className="flex items-center justify-between mb-4">
    <div>
      <h3 className={`text-sm font-semibold ${dark ? "text-white" : "text-gray-800"}`}>{title}</h3>
      {sub && <p className={`text-xs mt-0.5 ${dark ? "text-slate-500" : "text-gray-400"}`}>{sub}</p>}
    </div>
    {right}
  </div>
);

// ─── Main ─────────────────────────────────────────────────────
const AnalyticsDashboard = () => {
  const { students, trainers, admins, getStats } = useUserManagement();
  const { dark } = useTheme();
  const stats = getStats();
  const [range, setRange] = useState("30d");

  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const userGrowth  = [22,31,26,38,42,35,50,48,62,58,74,88];
  const revenueData = [18,24,21,30,28,36,33,42,40,52,48,65];
  const sessionData = [8,12,10,15,14,18,16,20,19,23,21,26];
  const certData    = [4,6,5,8,9,11,10,13,12,15,14,17];
  const engageData  = [55,62,58,70,68,75,72,80,78,84,82,88];

  const maxRev   = Math.max(...revenueData);
  const maxUsers = Math.max(...userGrowth);

  // Theme shorthands
  const panelBg   = dark ? "bg-white/[0.03] border-white/8"  : "bg-white border-gray-200";
  const titleText = dark ? "text-white"                       : "text-gray-800";
  const subText   = dark ? "text-slate-400"                   : "text-gray-500";
  const mutedText = dark ? "text-slate-500"                   : "text-gray-400";
  const barTrack  = dark ? "bg-white/[0.06]"                  : "bg-gray-200";
  const tooltipBg = dark ? "#1a1a2e"                          : "#1f2937";

  const funnelData = [
    { label: "Registered",         value: stats.totalUsers,                           pct: 100, color: "#8b5cf6" },
    { label: "Active",             value: stats.activeUsers,                           pct: Math.round((stats.activeUsers/stats.totalUsers)*100), color: "#3b82f6" },
    { label: "Enrolled in a Course",value: Math.round(stats.totalStudents*0.88),       pct: 88,  color: "#10b981" },
    { label: "Completed ≥ 1 Course",value: Math.round(stats.totalStudents*0.52),       pct: 52,  color: "#f59e0b" },
    { label: "Certified",           value: Math.round(stats.totalStudents*0.28),       pct: 28,  color: "#ef4444" },
  ];

  const topCourses = [
    { name: "React.js Masterclass", students: 312, completion: 78, revenue: "₹1,24,800" },
    { name: "Python Bootcamp",       students: 287, completion: 82, revenue: "₹1,14,800" },
    { name: "Data Science Pro",      students: 245, completion: 70, revenue: "₹98,000"   },
    { name: "UI/UX Design",          students: 198, completion: 85, revenue: "₹79,200"   },
    { name: "Node.js Advanced",      students: 176, completion: 74, revenue: "₹70,400"   },
  ];
  const maxStudents = Math.max(...topCourses.map((c) => c.students));

  const platformHealth = [
    { label: "Server Uptime",        value: "99.97%",       status: "good"    },
    { label: "API Latency",          value: "142ms",        status: "good"    },
    { label: "Cdn Response",         value: "48ms",         status: "good"    },
    { label: "Video Stream Quality", value: "1080p 98.2%",  status: "good"    },
    { label: "Storage Used",         value: "2.4 TB / 10 TB", status: "warning" },
    { label: "Active Sessions",      value: "284",          status: "good"    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className={`text-xl font-bold ${titleText}`}>Analytics Dashboard</h1>
          <p className={`text-sm mt-0.5 ${subText}`}>Platform-wide performance and insights</p>
        </div>
        <div className={`flex items-center gap-1 border rounded-lg p-1 ${dark ? "bg-white/5 border-white/8" : "bg-gray-100 border-gray-200"}`}>
          {["7d","30d","90d","1y"].map((r) => (
            <button key={r} onClick={() => setRange(r)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                range === r ? "bg-violet-500 text-white" : dark ? "text-slate-400 hover:text-white" : "text-gray-500 hover:text-gray-800"
              }`}>{r}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          { label:"Total Users",      value:stats.totalUsers, trend:14, spark:userGrowth,  color:"#8b5cf6", sub:"All roles"   },
          { label:"Active Users",     value:stats.activeUsers,trend: 8, spark:engageData,  color:"#10b981", sub:"Online today"},
          { label:"Revenue",          value:"₹18.4L",          trend:22, spark:revenueData, color:"#f59e0b", sub:"This month" },
          { label:"Live Sessions",    value:284,               trend:30, spark:sessionData, color:"#3b82f6", sub:"This month" },
          { label:"Certificates",     value:147,               trend:18, spark:certData,    color:"#ec4899", sub:"Issued"     },
          { label:"Avg Satisfaction", value:"4.3★",            trend: 2, spark:[3.8,4.0,3.9,4.1,4.0,4.2,4.1,4.3,4.2,4.4,4.3,4.5], color:"#f59e0b", sub:"Out of 5" },
        ].map((m) => <MetricCard key={m.label} {...m} dark={dark} />)}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* User Growth */}
        <div className={`rounded-xl border p-5 ${panelBg}`}>
          <SectionHeader dark={dark} title="User Growth" sub="Monthly new registrations"
            right={<span className="text-xs text-emerald-500 font-semibold bg-emerald-500/10 px-2 py-1 rounded-full">+18% vs last year</span>}
          />
          <div className="flex items-end gap-1.5 h-36">
            {userGrowth.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full rounded-t-sm bg-violet-500/60 hover:bg-violet-500 transition-all cursor-pointer relative group"
                  style={{ height:`${(v/maxUsers)*100}%`, minHeight:4 }}>
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                    style={{ background: tooltipBg }}>{v}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {MONTHS.map((m) => <span key={m} className={`flex-1 text-center text-[10px] ${mutedText}`}>{m}</span>)}
          </div>
        </div>

        {/* Revenue */}
        <div className={`rounded-xl border p-5 ${panelBg}`}>
          <SectionHeader dark={dark} title="Monthly Revenue" sub="In ₹ lakhs"
            right={<span className="text-xs text-emerald-500 font-semibold bg-emerald-500/10 px-2 py-1 rounded-full">+24% YoY</span>}
          />
          <div className="flex items-end gap-1.5 h-36">
            {revenueData.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full rounded-t-sm bg-emerald-500/50 hover:bg-emerald-500/80 transition-all cursor-pointer relative group"
                  style={{ height:`${(v/maxRev)*100}%`, minHeight:4 }}>
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                    style={{ background: tooltipBg }}>₹{v}L</div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {MONTHS.map((m) => <span key={m} className={`flex-1 text-center text-[10px] ${mutedText}`}>{m}</span>)}
          </div>
        </div>
      </div>

      {/* Funnel + Top Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className={`rounded-xl border p-5 ${panelBg}`}>
          <SectionHeader dark={dark} title="Student Journey Funnel" sub="From registration to certification" />
          <div className="space-y-2.5">
            {funnelData.map(({ label, value, pct, color }) => (
              <div key={label}>
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs ${subText}`}>{label}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${titleText}`}>{value.toLocaleString()}</span>
                    <span className={`text-[10px] ${mutedText}`}>{pct}%</span>
                  </div>
                </div>
                <div className={`rounded-full h-2 ${barTrack}`}>
                  <div className="h-2 rounded-full transition-all duration-700" style={{ width:`${pct}%`, background:color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`rounded-xl border p-5 ${panelBg}`}>
          <SectionHeader dark={dark} title="Top Courses by Enrollment" />
          <div className="space-y-3">
            {topCourses.map((course, i) => (
              <div key={course.name} className="flex items-center gap-3">
                <span className={`text-xs font-bold w-4 shrink-0 ${mutedText}`}>{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-medium truncate ${titleText}`}>{course.name}</span>
                    <span className={`text-xs ml-2 shrink-0 ${mutedText}`}>{course.students}</span>
                  </div>
                  <div className={`rounded-full h-1.5 ${barTrack}`}>
                    <div className="h-1.5 rounded-full bg-violet-500/70" style={{ width:`${(course.students/maxStudents)*100}%` }} />
                  </div>
                </div>
                <span className="text-xs text-emerald-500 font-semibold shrink-0">{course.completion}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Platform Health + Role Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Role Distribution */}
        <div className={`rounded-xl border p-5 ${panelBg}`}>
          <SectionHeader dark={dark} title="User Distribution" />
          <div className="space-y-3">
            {[
              { label:"Students", value:stats.totalStudents, total:stats.totalUsers, color:"#3b82f6" },
              { label:"Trainers", value:stats.totalTrainers, total:stats.totalUsers, color:"#8b5cf6" },
              { label:"Admins",   value:stats.totalAdmins,   total:stats.totalUsers, color:"#10b981" },
            ].map(({ label, value, total, color }) => (
              <div key={label}>
                <div className="flex justify-between mb-1">
                  <span className={`text-xs ${subText}`}>{label}</span>
                  <span className={`text-xs font-bold ${titleText}`}>
                    {value} <span className={`font-normal ${mutedText}`}>({Math.round((value/total)*100)}%)</span>
                  </span>
                </div>
                <div className={`rounded-full h-2 ${barTrack}`}>
                  <div className="h-2 rounded-full" style={{ width:`${(value/total)*100}%`, background:color }} />
                </div>
              </div>
            ))}
          </div>
          <div className={`mt-4 pt-4 border-t grid grid-cols-2 gap-2 ${dark ? "border-white/6" : "border-gray-200"}`}>
            {[
              { label:"Active",    value:stats.activeUsers,    color:"text-emerald-500" },
              { label:"Inactive",  value:stats.inactiveUsers,  color:dark?"text-slate-400":"text-gray-500" },
              { label:"Suspended", value:stats.suspendedUsers, color:"text-red-500"     },
              { label:"Pending",   value:stats.pendingUsers,   color:"text-amber-500"   },
            ].map(({ label, value, color }) => (
              <div key={label}>
                <p className={`text-base font-bold ${color}`}>{value}</p>
                <p className={`text-xs ${mutedText}`}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Health */}
        <div className={`lg:col-span-2 rounded-xl border p-5 ${panelBg}`}>
          <SectionHeader dark={dark} title="Platform Health" sub="Real-time system metrics"
            right={
              <span className="flex items-center gap-1.5 text-xs text-emerald-500 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                All Systems Operational
              </span>
            }
          />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {platformHealth.map(({ label, value, status }) => (
              <div key={label} className={`rounded-lg border px-4 py-3 ${
                status === "good"
                  ? dark ? "bg-emerald-500/5 border-emerald-500/15" : "bg-emerald-50 border-emerald-200"
                  : dark ? "bg-amber-500/5 border-amber-500/15"     : "bg-amber-50 border-amber-200"
              }`}>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${status === "good" ? "bg-emerald-400" : "bg-amber-400"}`} />
                  <p className={`text-xs truncate ${subText}`}>{label}</p>
                </div>
                <p className={`text-sm font-bold ${status === "good" ? "text-emerald-500" : "text-amber-500"}`}>{value}</p>
              </div>
            ))}
          </div>

          <div className={`mt-4 pt-4 border-t ${dark ? "border-white/6" : "border-gray-200"}`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs ${subText}`}>Bandwidth Usage</span>
              <span className={`text-xs font-bold ${titleText}`}>68%</span>
            </div>
            <div className={`rounded-full h-2.5 ${barTrack}`}>
              <div className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all" style={{ width:"68%" }} />
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className={`text-[10px] ${mutedText}`}>Current: 6.8 Gbps</span>
              <span className={`text-[10px] ${mutedText}`}>Capacity: 10 Gbps</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;