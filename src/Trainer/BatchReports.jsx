
import React, { useEffect, useState } from "react";
import { getBatchReports } from "../services/batchService";
import {
  Loader2,
  BarChart3,
  Users,
  Target,
  TrendingUp,
  Award,
  BookOpen,
  Download,
  Filter,
  Search,
  Sparkles,
  CheckCircle,
  Trophy,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const BatchReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getBatchReports()
      .then((res) => setReports(res.data || []))
      .finally(() => setLoading(false));
  }, []);

  // Filter batches
  const filteredReports = reports.filter((report) =>
    report.batchName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate overall stats
  const totalStudents = reports.reduce((acc, r) => acc + (r.students || 0), 0);
  const avgScore =
    reports.length > 0
      ? reports.reduce((acc, r) => acc + (r.avgScore || 0), 0) / reports.length
      : 0;
  const avgCompletion =
    reports.length > 0
      ? reports.reduce((acc, r) => acc + (r.completion || 0), 0) / reports.length
      : 0;
  const topBatches = reports.filter((r) => (r.avgScore || 0) >= 80).length;

  const getScoreColor = (score) => {
    if (score >= 90) return "text-purple-600 dark:text-purple-400";
    if (score >= 80) return "text-emerald-600 dark:text-emerald-400";
    if (score >= 70) return "text-blue-600 dark:text-blue-400";
    if (score >= 60) return "text-amber-600 dark:text-amber-400";
    return "text-rose-600 dark:text-rose-400";
  };

  const getScoreBgColor = (score) => {
    if (score >= 90) return "bg-purple-100 dark:bg-purple-900/30";
    if (score >= 80) return "bg-emerald-100 dark:bg-emerald-900/30";
    if (score >= 70) return "bg-blue-100 dark:bg-blue-900/30";
    if (score >= 60) return "bg-amber-100 dark:bg-amber-900/30";
    return "bg-rose-100 dark:bg-rose-900/30";
  };

  const getProgressColor = (completion) => {
    if (completion >= 90) return "bg-purple-500";
    if (completion >= 80) return "bg-emerald-500";
    if (completion >= 70) return "bg-blue-500";
    if (completion >= 60) return "bg-amber-500";
    return "bg-rose-500";
  };

  /* ===== Loading ===== */
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-sm text-muted-foreground">
            Loading batch reports...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Premium Hero Header */}
      <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 dark:from-cyan-900 dark:via-blue-900 dark:to-indigo-900">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <p className="text-xs font-semibold tracking-wide text-cyan-100 uppercase">
              Analytics & Reporting
            </p>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Batch Reports</h1>
          <p className="text-cyan-100">
            Performance summary and analytics across all batches
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 border-slate-200 dark:border-slate-800 bg-gradient-to-br from-cyan-50 to-white dark:from-cyan-950/20 dark:to-slate-900">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
                <BookOpen className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              </div>
              <TrendingUp className="w-4 h-4 text-cyan-600" />
            </div>
            <p className="text-2xl font-bold text-foreground">
              {reports.length}
            </p>
            <p className="text-sm text-muted-foreground">Total Batches</p>
          </Card>

          <Card className="p-6 border-slate-200 dark:border-slate-800 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-slate-900">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-foreground">
              {totalStudents}
            </p>
            <p className="text-sm text-muted-foreground">Total Students</p>
          </Card>

          <Card className="p-6 border-slate-200 dark:border-slate-800 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:to-slate-900">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-foreground">
              {avgScore.toFixed(1)}%
            </p>
            <p className="text-sm text-muted-foreground">Avg Score</p>
          </Card>

          <Card className="p-6 border-slate-200 dark:border-slate-800 bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-slate-900">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Trophy className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <TrendingUp className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-foreground">{topBatches}</p>
            <p className="text-sm text-muted-foreground">Top Batches (80%+)</p>
          </Card>
        </div>

        {/* Search & Actions Bar */}
        <Card className="p-4 mb-6 border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search batches..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-slate-300 dark:border-slate-700"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>
        </Card>

        {/* Batch Reports Table */}
        {filteredReports.length === 0 ? (
          <Card className="p-12 text-center border-slate-200 dark:border-slate-800">
            <div className="inline-flex p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
              <BookOpen className="w-12 h-12 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {reports.length === 0 ? "No Batches Yet" : "No Matching Batches"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {reports.length === 0
                ? "Batch reports will appear here once batches are created"
                : "Try adjusting your search"}
            </p>
          </Card>
        ) : (
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
                  <tr className="text-muted-foreground">
                    <th className="py-4 px-6 text-left font-semibold">
                      Batch Name
                    </th>
                    <th className="py-4 px-6 text-left font-semibold">
                      Students
                    </th>
                    <th className="py-4 px-6 text-left font-semibold">
                      Average Score
                    </th>
                    <th className="py-4 px-6 text-left font-semibold">
                      Completion Rate
                    </th>
                    <th className="py-4 px-6 text-left font-semibold">
                      Performance
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredReports.map((report) => (
                    <tr
                      key={report.batchName}
                      className="text-foreground hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                    >
                      {/* Batch Name */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold text-sm shrink-0">
                            {report.batchName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">
                              {report.batchName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Active Batch
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Students */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          <span className="font-semibold">
                            {report.students || 0}
                          </span>
                        </div>
                      </td>

                      {/* Average Score */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div
                            className={`p-1.5 rounded-lg ${getScoreBgColor(
                              report.avgScore || 0
                            )}`}
                          >
                            <Award
                              className={`w-4 h-4 ${getScoreColor(
                                report.avgScore || 0
                              )}`}
                            />
                          </div>
                          <span
                            className={`font-semibold ${getScoreColor(
                              report.avgScore || 0
                            )}`}
                          >
                            {report.avgScore || 0}%
                          </span>
                          {(report.avgScore || 0) >= 80 ? (
                            <ArrowUpRight className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <ArrowDownRight className="w-3 h-3 text-rose-600" />
                          )}
                        </div>
                      </td>

                      {/* Completion Rate */}
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold">
                              {report.completion || 0}%
                            </span>
                          </div>
                          <div className="w-32 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${getProgressColor(
                                report.completion || 0
                              )} transition-all`}
                              style={{ width: `${report.completion || 0}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Performance Badge */}
                      <td className="py-4 px-6">
                        {(report.avgScore || 0) >= 90 ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                            <Trophy className="w-3 h-3" />
                            Outstanding
                          </span>
                        ) : (report.avgScore || 0) >= 80 ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                            <CheckCircle className="w-3 h-3" />
                            Excellent
                          </span>
                        ) : (report.avgScore || 0) >= 70 ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                            <Target className="w-3 h-3" />
                            Good
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                            <TrendingUp className="w-3 h-3" />
                            Needs Improvement
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Help Section */}
        <Card className="p-6 mt-8 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-slate-900">
          <div className="flex gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg shrink-0 h-fit">
              <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                Understanding Batch Performance
              </h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 mt-0.5">
                    •
                  </span>
                  <span>
                    <strong>Outstanding (90%+):</strong> Batches with exceptional
                    overall performance across all metrics
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 mt-0.5">
                    •
                  </span>
                  <span>
                    <strong>Excellent (80-89%):</strong> Strong batch performance
                    with consistent student engagement
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 mt-0.5">
                    •
                  </span>
                  <span>
                    <strong>Good (70-79%):</strong> Satisfactory performance with
                    opportunities for growth
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 mt-0.5">
                    •
                  </span>
                  <span>
                    <strong>Needs Improvement (&lt;70%):</strong> Batches that may
                    benefit from additional instructor support
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BatchReports;