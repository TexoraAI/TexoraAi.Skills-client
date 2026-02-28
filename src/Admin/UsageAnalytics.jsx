// src/Admin/UsageAnalytics.jsx
import React, { useState } from "react";
import {
  Activity,
  Users,
  Clock,
  TrendingUp,
  BarChart3,
} from "lucide-react";

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
    <div className="space-y-6">
      {/* HERO */}
      <div className="rounded-2xl px-6 py-5 text-white shadow-lg bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600">
        <h1 className="text-2xl font-semibold">Usage Analytics</h1>
        <p className="text-sm opacity-90">
          Track platform usage across users, roles and time periods
        </p>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* USERS */}
        <Card>
          <CardContent className="p-4 space-y-1.5">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Daily Active Users
              </p>
              <div className="p-1.5 rounded-md bg-blue-100 text-blue-600">
                <Users className="h-4 w-4" />
              </div>
            </div>

            <p className="text-2xl font-semibold">0</p>

            <div className="flex items-center gap-1 text-xs text-emerald-600">
              <TrendingUp className="h-3 w-3" />
              +0% vs yesterday
            </div>
          </CardContent>
        </Card>

        {/* SESSION */}
        <Card>
          <CardContent className="p-4 space-y-1.5">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Avg. Session Length
              </p>
              <div className="p-1.5 rounded-md bg-violet-100 text-violet-600">
                <Clock className="h-4 w-4" />
              </div>
            </div>

            <p className="text-2xl font-semibold">0 min</p>

            <p className="text-xs text-muted-foreground">
              Last 7 days
            </p>
          </CardContent>
        </Card>

        {/* ACTIVITY */}
        <Card>
          <CardContent className="p-4 space-y-1.5">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Peak Concurrent Users
              </p>
              <div className="p-1.5 rounded-md bg-emerald-100 text-emerald-600">
                <Activity className="h-4 w-4" />
              </div>
            </div>

            <p className="text-2xl font-semibold">0</p>

            <p className="text-xs text-muted-foreground">
              Today
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ROLE WISE USAGE */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-indigo-600" />
            Role-wise Usage
          </CardTitle>

          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-32 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
            <div className="p-3 rounded-lg bg-slate-100 mb-2">
              <BarChart3 className="h-7 w-7 opacity-60" />
            </div>
            <p className="text-sm">No analytics data yet</p>
            <p className="text-xs">
              Usage charts will appear once data is available
            </p>
          </div>
        </CardContent>
      </Card>

      {/* INFO */}
      <Card>
        <CardHeader className="py-3">
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
