import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

const Renewals = () => {
  // 🔒 Backend se aayega
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔜 REAL API CALL YAHAN AAYEGI
    // renewalService.getUpcoming().then(res => setItems(res.data))
    setLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Renewals
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Upcoming subscription renewals
        </p>
      </div>

      {/* Card */}
      <Card className="bg-black text-white dark:bg-slate-900 border border-slate-700">
        <CardHeader>
          <CardTitle>Upcoming Renewals</CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <p className="text-sm text-slate-400">
              Loading renewals...
            </p>
          ) : items.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm font-medium">
                No renewals due
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Upcoming renewals will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((r) => (
                <div
                  key={r.id}
                  className="
                    flex items-center justify-between
                    rounded-xl border border-slate-700
                    bg-slate-900/80 px-4 py-3
                  "
                >
                  <div>
                    <p className="text-sm font-semibold">
                      {r.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {r.plan}
                    </p>
                  </div>

                  <span className="text-sm font-semibold text-amber-400">
                    Due: {r.due}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Renewals;
