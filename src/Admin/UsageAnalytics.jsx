// // src/Admin/UsageAnalytics.jsx
// import React, { useState } from "react";
// import {
//   Activity,
//   Users,
//   Clock,
//   TrendingUp,
//   BarChart3,
// } from "lucide-react";

// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent,
// } from "@/components/ui/card";
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "@/components/ui/select";

// const UsageAnalytics = () => {
//   const [period, setPeriod] = useState("7");

//   return (
//     <div className="space-y-6">
//       {/* HERO */}
//       <div className="rounded-2xl px-6 py-5 text-white shadow-lg bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600">
//         <h1 className="text-2xl font-semibold">Usage Analytics</h1>
//         <p className="text-sm opacity-90">
//           Track platform usage across users, roles and time periods
//         </p>
//       </div>

//       {/* SUMMARY CARDS */}
//       <div className="grid gap-4 md:grid-cols-3">
//         {/* USERS */}
//         <Card>
//           <CardContent className="p-4 space-y-1.5">
//             <div className="flex items-center justify-between">
//               <p className="text-xs text-muted-foreground">
//                 Daily Active Users
//               </p>
//               <div className="p-1.5 rounded-md bg-blue-100 text-blue-600">
//                 <Users className="h-4 w-4" />
//               </div>
//             </div>

//             <p className="text-2xl font-semibold">0</p>

//             <div className="flex items-center gap-1 text-xs text-emerald-600">
//               <TrendingUp className="h-3 w-3" />
//               +0% vs yesterday
//             </div>
//           </CardContent>
//         </Card>

//         {/* SESSION */}
//         <Card>
//           <CardContent className="p-4 space-y-1.5">
//             <div className="flex items-center justify-between">
//               <p className="text-xs text-muted-foreground">
//                 Avg. Session Length
//               </p>
//               <div className="p-1.5 rounded-md bg-violet-100 text-violet-600">
//                 <Clock className="h-4 w-4" />
//               </div>
//             </div>

//             <p className="text-2xl font-semibold">0 min</p>

//             <p className="text-xs text-muted-foreground">
//               Last 7 days
//             </p>
//           </CardContent>
//         </Card>

//         {/* ACTIVITY */}
//         <Card>
//           <CardContent className="p-4 space-y-1.5">
//             <div className="flex items-center justify-between">
//               <p className="text-xs text-muted-foreground">
//                 Peak Concurrent Users
//               </p>
//               <div className="p-1.5 rounded-md bg-emerald-100 text-emerald-600">
//                 <Activity className="h-4 w-4" />
//               </div>
//             </div>

//             <p className="text-2xl font-semibold">0</p>

//             <p className="text-xs text-muted-foreground">
//               Today
//             </p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* ROLE WISE USAGE */}
//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between py-3">
//           <CardTitle className="text-sm flex items-center gap-2">
//             <BarChart3 className="h-4 w-4 text-indigo-600" />
//             Role-wise Usage
//           </CardTitle>

//           <Select value={period} onValueChange={setPeriod}>
//             <SelectTrigger className="w-32 h-8 text-xs">
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="7">Last 7 days</SelectItem>
//               <SelectItem value="30">Last 30 days</SelectItem>
//             </SelectContent>
//           </Select>
//         </CardHeader>

//         <CardContent>
//           <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
//             <div className="p-3 rounded-lg bg-slate-100 mb-2">
//               <BarChart3 className="h-7 w-7 opacity-60" />
//             </div>
//             <p className="text-sm">No analytics data yet</p>
//             <p className="text-xs">
//               Usage charts will appear once data is available
//             </p>
//           </div>
//         </CardContent>
//       </Card>

//       {/* INFO */}
//       <Card>
//         <CardHeader className="py-3">
//           <CardTitle className="text-sm">Insights</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <p className="text-sm text-muted-foreground">
//             Usage analytics help understand platform engagement,
//             peak hours and role-based activity trends.
//           </p>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default UsageAnalytics;





























import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity, ArrowLeft, ArrowUp, BarChart3,
  Clock, Lightbulb, TrendingUp, Users, Zap,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/* ── stat cards config ── */
const STATS = [
  {
    label: "Daily Active Users",
    value: "0",
    sub:   "+0% vs yesterday",
    icon:  Users,
    grad:  "from-cyan-500 to-blue-600",
    bg:    "bg-cyan-50 dark:bg-cyan-950/40",
    text:  "text-cyan-600 dark:text-cyan-400",
    trend: true,
  },
  {
    label: "Avg. Session Length",
    value: "0 min",
    sub:   "Last 7 days",
    icon:  Clock,
    grad:  "from-violet-500 to-indigo-600",
    bg:    "bg-violet-50 dark:bg-violet-950/40",
    text:  "text-violet-600 dark:text-violet-400",
    trend: false,
  },
  {
    label: "Peak Concurrent Users",
    value: "0",
    sub:   "Today",
    icon:  Activity,
    grad:  "from-emerald-500 to-teal-600",
    bg:    "bg-emerald-50 dark:bg-emerald-950/40",
    text:  "text-emerald-600 dark:text-emerald-400",
    trend: false,
  },
];

/* ── insight items ── */
const INSIGHTS = [
  { icon: Users,     grad: "from-cyan-500 to-blue-600",    title: "User Engagement",   desc: "Track how often different roles interact with the platform daily."        },
  { icon: Clock,     grad: "from-violet-500 to-indigo-600", title: "Peak Hours",        desc: "Identify when your platform is most active to plan resources."            },
  { icon: TrendingUp, grad: "from-emerald-500 to-teal-600", title: "Activity Trends",  desc: "Monitor growth and engagement patterns over time."                       },
];

/* ================= MAIN ================= */
const UsageAnalytics = () => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState("7");

  return (
    <div className="min-h-screen bg-[#f0f4ff] dark:bg-[#060b18] p-5 space-y-5">

      {/* ═══════ HERO ═══════ */}
      <div className="relative overflow-hidden rounded-2xl shadow-xl
        bg-gradient-to-r from-[#1a56db] via-[#3b82f6] to-[#06b6d4]">
        <div className="pointer-events-none absolute -right-12 -top-12 h-52 w-52 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute right-32 bottom-[-30px] h-36 w-36 rounded-full bg-cyan-300/20 blur-2xl" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        <div className="relative flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 rounded-xl bg-white/15 px-3 py-1.5
                text-sm font-medium text-white backdrop-blur-sm hover:bg-white/25 transition-all"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Usage Analytics</h1>
              <p className="mt-0.5 text-sm text-blue-100/80">
                Track platform usage across users, roles and time periods
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-2 backdrop-blur-sm">
            <Zap className="h-4 w-4 text-cyan-200" />
            <span className="text-sm font-semibold text-white">
              Live
              <span className="ml-1 font-normal text-blue-100/80">Dashboard</span>
            </span>
          </div>
        </div>
      </div>

      {/* ═══════ STAT CARDS ═══════ */}
      <div className="grid gap-4 md:grid-cols-3">
        {STATS.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="relative overflow-hidden rounded-2xl border border-slate-200
                dark:border-slate-800 bg-white dark:bg-slate-900 shadow p-5"
            >
              {/* blob */}
              <div className={`pointer-events-none absolute -right-4 -top-4 h-24 w-24
                rounded-full bg-gradient-to-br ${s.grad} opacity-10 blur-2xl`} />

              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-widest font-semibold
                    text-slate-500 dark:text-slate-400">
                    {s.label}
                  </p>
                  <p className="mt-2 text-3xl font-bold text-slate-800 dark:text-slate-100">
                    {s.value}
                  </p>
                  <div className={`mt-1.5 flex items-center gap-1 text-xs font-medium
                    ${s.trend ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}`}>
                    {s.trend && <ArrowUp className="h-3 w-3" />}
                    {s.sub}
                  </div>
                </div>

                <div className={`h-11 w-11 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`h-5 w-5 ${s.text}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ═══════ ROLE-WISE USAGE CARD ═══════ */}
      <Card className="overflow-hidden rounded-2xl border border-slate-200
        dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg">

        <CardHeader className="flex flex-row items-center justify-between
          border-b border-slate-100 dark:border-slate-800
          bg-slate-50/60 dark:bg-slate-900/60 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/50
              flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-indigo-500" />
            </div>
            <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              Role-wise Usage
            </CardTitle>
          </div>

          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="h-9 w-36 rounded-xl bg-white dark:bg-slate-900
              border-slate-200 dark:border-slate-800 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl border border-slate-200 dark:border-slate-700
              bg-white dark:bg-slate-900 shadow-xl z-50">
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>

        <CardContent className="p-4">
          {/* placeholder role bars */}
          <div className="space-y-4 mb-6">
            {[
              { role: "Students",  pct: 0, color: "bg-cyan-500"   },
              { role: "Trainers",  pct: 0, color: "bg-violet-500" },
              { role: "Admins",    pct: 0, color: "bg-amber-500"  },
            ].map(({ role, pct, color }) => (
              <div key={role} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700 dark:text-slate-300">{role}</span>
                  <span className="text-slate-400">{pct}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${color} transition-all duration-700`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* empty state */}
          <div className="flex flex-col items-center justify-center py-8 gap-3
            border-t border-slate-100 dark:border-slate-800">
            <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-800
              flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-500">No analytics data yet</p>
            <p className="text-xs text-slate-400">Usage charts will appear once data is available</p>
          </div>
        </CardContent>
      </Card>

      {/* ═══════ INSIGHTS CARD ═══════ */}
      <Card className="overflow-hidden rounded-2xl border border-slate-200
        dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg">

        <CardHeader className="border-b border-slate-100 dark:border-slate-800
          bg-slate-50/60 dark:bg-slate-900/60 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-amber-50 dark:bg-amber-950/50
              flex items-center justify-center">
              <Lightbulb className="h-4 w-4 text-amber-500" />
            </div>
            <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              Insights
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <div className="grid gap-3 sm:grid-cols-3">
            {INSIGHTS.map(({ icon: Icon, grad, title, desc }) => (
              <div
                key={title}
                className="relative overflow-hidden rounded-2xl border border-slate-100
                  dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-4"
              >
                <div className={`pointer-events-none absolute -right-3 -top-3 h-16 w-16
                  rounded-full bg-gradient-to-br ${grad} opacity-10 blur-xl`} />
                <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${grad}
                  flex items-center justify-center mb-3 shadow-sm`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-1">{title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsageAnalytics;