import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const FollowUps = () => {
  // 🔒 Backend se data aayega
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔜 REAL API CALL
    // followUpService.getFollowUps().then(res => setItems(res.data))
    setLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Follow Ups
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Scheduled follow-ups with leads and clients
        </p>
      </div>

      {/* Card */}
      <Card className="bg-black text-white dark:bg-slate-900 border border-slate-700">
        <CardHeader>
          <CardTitle>Upcoming Follow Ups</CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <p className="text-sm text-slate-400">Loading follow ups...</p>
          ) : items.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm font-medium">
                No follow ups scheduled
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Follow ups will appear here once added.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((i) => (
                <div
                  key={i.id}
                  className="flex items-center justify-between rounded-lg border border-slate-800 p-4"
                >
                  <div>
                    <p className="text-sm font-semibold">{i.name}</p>
                    <p className="text-xs text-slate-400">{i.note}</p>
                  </div>

                  <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/40">
                    Due: {i.due}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FollowUps;
