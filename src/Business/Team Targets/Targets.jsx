// src/Business/Team/Targets.jsx
import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const Targets = () => {
  // 🔒 Backend se data aayega
  const [targets, setTargets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔜 REAL API
    // teamService.getTargets().then(res => setTargets(res.data))
    setLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Team Targets
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Monthly targets vs achievements
        </p>
      </div>

      {/* Card */}
      <Card className="bg-black text-white dark:bg-slate-900 border border-slate-700">
        <CardHeader>
          <CardTitle>Target Progress</CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <p className="text-sm text-slate-400">Loading targets...</p>
          ) : targets.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm font-medium">
                No targets configured
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Targets will appear once management sets them.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {targets.map((t) => {
                const percent =
                  typeof t.monthly === "number"
                    ? Math.round((t.achieved / t.monthly) * 100)
                    : 0;

                return (
                  <div key={t.metric} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{t.metric}</span>
                      <span className="text-emerald-400">
                        {percent}%
                      </span>
                    </div>

                    <Progress
                      value={percent}
                      className="h-2 bg-slate-800"
                    />

                    <p className="text-xs text-slate-400">
                      Target: {t.monthly} · Achieved: {t.achieved}
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

export default Targets;
