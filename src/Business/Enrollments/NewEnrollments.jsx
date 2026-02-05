import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

const NewEnrollments = () => {
  // 🔒 Backend se aayega
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔜 REAL API CALL YAHAN AAYEGI
    // enrollmentService.getRecent().then(res => setEnrollments(res.data))
    setLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          New Enrollments
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Recently enrolled students
        </p>
      </div>

      {/* Card */}
      <Card className="bg-black text-white dark:bg-slate-900 border border-slate-700">
        <CardHeader>
          <CardTitle>Recent Enrollments</CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <p className="text-sm text-slate-400">
              Loading enrollments...
            </p>
          ) : enrollments.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm font-medium">
                No new enrollments yet
              </p>
              <p className="mt-1 text-xs text-slate-400">
                New enrollments will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {enrollments.map((e) => (
                <div
                  key={e.id}
                  className="
                    flex items-center justify-between
                    rounded-xl border border-slate-700
                    bg-slate-900/80 px-4 py-3
                  "
                >
                  <div>
                    <p className="text-sm font-semibold">
                      {e.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {e.course}
                    </p>
                  </div>

                  <span className="text-sm font-semibold text-emerald-400">
                    {e.amount}
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

export default NewEnrollments;
