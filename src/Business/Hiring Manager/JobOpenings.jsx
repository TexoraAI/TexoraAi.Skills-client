import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const JobOpenings = () => {
  // 🔒 Backend se aayega
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔜 REAL API CALL YAHAN AAYEGI
    // jobService.getOpenings().then(res => setJobs(res.data))
    setLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Job Openings
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Manage active job and internship openings
        </p>
      </div>

      {/* Card */}
      <Card className="bg-black text-white dark:bg-slate-900 border border-slate-700">
        <CardHeader>
          <CardTitle>Active Openings</CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <p className="text-sm text-slate-400">
              Loading job openings...
            </p>
          ) : jobs.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm font-medium">
                No job openings available
              </p>
              <p className="mt-1 text-xs text-slate-400">
                New openings will appear here once created.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="
                    flex items-center justify-between
                    rounded-xl border border-slate-700
                    bg-slate-900/80 px-4 py-3
                  "
                >
                  <div>
                    <p className="text-sm font-semibold">
                      {job.title}
                    </p>
                    <p className="text-xs text-slate-400">
                      {job.location} · {job.openings} openings
                    </p>
                  </div>

                  <Button
                    size="sm"
                    className="bg-violet-600 hover:bg-violet-500"
                  >
                    View candidates
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default JobOpenings;
