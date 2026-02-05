// src/Business/Marketing/Sources.jsx
import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const Sources = () => {
  // 🔒 Backend se aayega
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔜 REAL API CALL
    // marketingService.getLeadSources().then(res => setSources(res.data))
    setLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Sources
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Lead distribution by acquisition source
        </p>
      </div>

      {/* Card */}
      <Card className="bg-black text-white dark:bg-slate-900 border border-slate-700">
        <CardHeader>
          <CardTitle>Lead Sources</CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <p className="text-sm text-slate-400">Loading sources...</p>
          ) : sources.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm font-medium">
                No source data available
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Source analytics will appear once data is tracked.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sources.map((s) => (
                <div key={s.name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{s.name}</span>
                    <span className="text-emerald-400">
                      {s.percent}%
                    </span>
                  </div>

                  <Progress
                    value={s.percent}
                    className="h-2 bg-slate-800"
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Sources;
