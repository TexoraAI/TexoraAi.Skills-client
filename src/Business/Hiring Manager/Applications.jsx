import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

const Applications = () => {
  // 🔒 Backend se aayega
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔜 REAL API CALL YAHAN AAYEGI
    // applicationService.getAll().then(res => setApplications(res.data))
    setLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Applications
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Job & internship applications received
        </p>
      </div>

      {/* Card */}
      <Card className="bg-black text-white dark:bg-slate-900 border border-slate-700">
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <p className="text-sm text-slate-400">
              Loading applications...
            </p>
          ) : applications.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm font-medium">
                No applications yet
              </p>
              <p className="mt-1 text-xs text-slate-400">
                New applications will appear here once received.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map((a) => (
                <div
                  key={a.id}
                  className="
                    flex items-center justify-between
                    rounded-xl border border-slate-700
                    bg-slate-900/80 px-4 py-3
                  "
                >
                  <div>
                    <p className="text-sm font-semibold">
                      {a.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {a.role}
                    </p>
                  </div>

                  <span className="text-xs font-medium text-emerald-400">
                    {a.status}
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

export default Applications;
