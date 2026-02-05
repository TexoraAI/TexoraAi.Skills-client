// // src/Admin/UsageAnalytics.jsx
// import React from "react";

// const UsageAnalytics = () => {
//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div>
//         <h1 className="text-xl font-semibold text-slate-100">
//           Usage analytics
//         </h1>
//         <p className="mt-1 text-sm text-slate-400">
//           Track platform usage across users, roles and time periods.
//         </p>
//       </div>

//       {/* Summary cards */}
//       <div className="grid gap-4 md:grid-cols-3">
//         <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4">
//           <p className="text-xs text-slate-400">Daily active users</p>
//           <p className="mt-2 text-2xl font-semibold text-slate-50">0</p>
//           <p className="mt-1 text-[11px] text-emerald-400">+0% vs yesterday</p>
//         </div>
//         <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4">
//           <p className="text-xs text-slate-400">Average session length</p>
//           <p className="mt-2 text-2xl font-semibold text-slate-50">0 min</p>
//           <p className="mt-1 text-[11px] text-slate-400">Last 7 days</p>
//         </div>
//         <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4">
//           <p className="text-xs text-slate-400">Peak concurrent users</p>
//           <p className="mt-2 text-2xl font-semibold text-slate-50">0</p>
//           <p className="mt-1 text-[11px] text-slate-400">Today</p>
//         </div>
//       </div>

//       {/* Role wise usage placeholder */}
//       <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4">
//         <div className="flex items-center justify-between mb-3">
//           <h2 className="text-sm font-semibold text-slate-100">
//             Role wise usage
//           </h2>
//           <select className="text-[11px] bg-slate-950 border border-slate-700 rounded-md px-2 py-1 text-slate-100 focus:outline-none focus:ring-1 focus:ring-violet-500">
//             <option>Last 7 days</option>
//             <option>Last 30 days</option>
//           </select>
//         </div>

//         <p className="text-sm text-slate-400">
        
//         </p>
//       </div>
//     </div>
//   );
// };

// export default UsageAnalytics;



// src/Admin/UsageAnalytics.jsx
import React, { useState } from "react";
import {
  Activity,
  Users,
  Clock,
  TrendingUp,
  BarChart3,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const UsageAnalytics = () => {
  const [period, setPeriod] = useState("7");

  return (
    <div className="space-y-8">
      {/* HERO */}
      <div className="rounded-3xl p-8 text-white shadow-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600">
        <h1 className="text-3xl font-bold">Usage Analytics</h1>
        <p className="mt-2 text-sm opacity-90">
          Track platform usage across users, roles and time periods
        </p>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="p-6 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Daily Active Users
              </p>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>

            <p className="text-3xl font-bold">0</p>

            <div className="flex items-center gap-1 text-xs text-emerald-600">
              <TrendingUp className="h-3 w-3" />
              +0% vs yesterday
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Avg. Session Length
              </p>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>

            <p className="text-3xl font-bold">0 min</p>

            <p className="text-xs text-muted-foreground">
              Last 7 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Peak Concurrent Users
              </p>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </div>

            <p className="text-3xl font-bold">0</p>

            <p className="text-xs text-muted-foreground">
              Today
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ROLE WISE USAGE */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Role-wise Usage
          </CardTitle>

          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>

        <CardContent>
          {/* Placeholder */}
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <BarChart3 className="h-10 w-10 mb-3 opacity-40" />
            <p className="text-sm">No analytics data yet</p>
            <p className="text-xs">
              Usage charts will appear once data is available
            </p>
          </div>
        </CardContent>
      </Card>

      {/* INFO */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Usage analytics help understand platform engagement,
            peak hours and role-based activity trends.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsageAnalytics;
