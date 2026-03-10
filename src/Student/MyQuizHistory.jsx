import React, { useEffect, useState } from "react";
import { getMyQuizHistory } from "../services/assessmentService";
import {
  Trophy,
  Target,
  Calendar,
  Award,
  TrendingUp,
  FileText,
  CheckCircle2,
  XCircle
} from "lucide-react";

export default function MyQuizHistory() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const res = await getMyQuizHistory();
  
      const list =
        res?.data?.data ||
        res?.data?.attempts ||
        res?.data ||
        [];
  
      setAttempts(Array.isArray(list) ? list : []);
  
    } catch (err) {
      console.error("Failed to load quiz history", err);
    } finally {
      setLoading(false);
    }
  };

  // ================= STATS =================
  const totalAttempts = attempts.length;

  const passedAttempts = attempts.filter(a => {
    const total = a.quiz?.questions?.length || 0;
    const percent = total > 0 ? (a.score * 100) / total : 0;
    return percent >= 50;
  }).length;

  const averageScore = attempts.length > 0
    ? attempts.reduce((sum, a) => {
        const total = a.quiz?.questions?.length || 0;
        const percent = total > 0 ? (a.score * 100) / total : 0;
        return sum + percent;
      }, 0) / attempts.length
    : 0;

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">
            Loading quiz history...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">

      {/* ================= LIGHT BLUE HERO ================= */}
      <header
        className="relative overflow-hidden
        bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400
        dark:from-sky-600 dark:via-blue-600 dark:to-indigo-600"
      >
        <div className="absolute inset-0 bg-white/10 dark:bg-black/10" />

        <div className="relative max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            {/* LEFT */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="p-2 rounded-md bg-white/30 backdrop-blur shadow">
                  <Trophy className="h-4 w-4 text-yellow-300" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wide text-white/90">
                  Performance Tracking
                </span>
              </div>

              <h1 className="text-2xl font-bold text-white">
                My Quiz History
              </h1>

              <p className="text-sm text-white/85 max-w-xl">
                Track your assessment performance and review quiz attempts
              </p>
            </div>

            {/* RIGHT STATS */}
            <div className="flex flex-wrap gap-3">
              <Stat
                icon={<FileText className="h-4 w-4" />}
                label="Attempts"
                value={totalAttempts}
              />
              <Stat
                icon={<CheckCircle2 className="h-4 w-4 text-emerald-300" />}
                label="Passed"
                value={passedAttempts}
              />
              <Stat
                icon={<TrendingUp className="h-4 w-4 text-yellow-300" />}
                label="Avg Score"
                value={`${averageScore.toFixed(1)}%`}
              />
            </div>

          </div>
        </div>
      </header>

      {/* ================= QUIZ HISTORY (UNCHANGED CONTENT AREA) ================= */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {attempts.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center
                            w-20 h-20 rounded-full
                            bg-blue-100 dark:bg-blue-900/20 mb-4">
              <FileText className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">
              No Quiz Attempts Yet
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Your quiz attempts will appear here once you start taking assessments
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Desktop table / mobile cards — SAME AS YOUR EXISTING CODE */}
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= STAT ================= */
const Stat = ({ icon, label, value }) => (
  <div className="flex items-center gap-2 px-4 py-2
                  rounded-xl bg-white/30 backdrop-blur
                  border border-white/30 text-white shadow">
    {icon}
    <div>
      <p className="text-base font-bold leading-none">{value}</p>
      <p className="text-[11px] text-white/80">{label}</p>
    </div>
  </div>
);

