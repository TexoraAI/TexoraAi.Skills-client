// src/Business/Team/Performance.jsx
import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const Performance = () => {
  // 🔒 Backend se aayega
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔜 REAL API
    // teamService.getPerformance().then(res => setMembers(res.data))
    setLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Team Performance
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Track leads and enrollments by team members
        </p>
      </div>

      {/* Card */}
      <Card className="bg-black text-white dark:bg-slate-900 border border-slate-700">
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <p className="text-sm text-slate-400">Loading performance...</p>
          ) : members.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm font-medium">
                No performance data available
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Team performance will appear once activity starts.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {members.map((m) => {
                const conversion =
                  m.leads > 0
                    ? Math.round((m.enrollments / m.leads) * 100)
                    : 0;

                return (
                  <div key={m.id} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{m.name}</span>
                      <span className="text-emerald-400">
                        {conversion}%
                      </span>
                    </div>

                    <Progress
                      value={conversion}
                      className="h-2 bg-slate-800"
                    />

                    <p className="text-xs text-slate-400">
                      Leads: {m.leads} · Enrollments: {m.enrollments}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Performance;
