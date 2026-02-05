
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ClipboardList,
  Search,
  Plus,
  Calendar,
  TrendingUp,
  Users,
  FileText,
  BarChart3,
  Download,
  BookOpen,
  Trophy,
  Target,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Assessments = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All");

  // Empty arrays for initial state
  const upcoming = [];
  const recentAssessments = [];

  // Calculate stats (all will be 0 initially)
  const totalScheduled = upcoming.filter(a => a.status === "Scheduled").length;
  const totalDrafts = upcoming.filter(a => a.status === "Draft").length;
  const totalEnrolled = upcoming.reduce((acc, a) => acc + a.enrolled, 0);
  const avgRecentScore = recentAssessments.length > 0
    ? (recentAssessments.reduce((acc, a) => acc + a.avgScore, 0) / recentAssessments.length).toFixed(1)
    : 0;

  const filteredUpcoming = upcoming.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.batch.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "All" || item.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Premium Hero Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
              <ClipboardList className="w-6 h-6 text-white" />
            </div>
            <p className="text-xs font-semibold tracking-wide text-indigo-100 uppercase">
              Assessment Center
            </p>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Assessments Overview
          </h1>
          <p className="text-indigo-100">
            Manage quizzes and assignments across all your batches
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 border-slate-200 dark:border-slate-800 bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-slate-900">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <TrendingUp className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-foreground">{totalScheduled}</p>
            <p className="text-sm text-muted-foreground">Scheduled</p>
          </Card>

          <Card className="p-6 border-slate-200 dark:border-slate-800 bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/20 dark:to-slate-900">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <FileText className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <TrendingUp className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-2xl font-bold text-foreground">{totalDrafts}</p>
            <p className="text-sm text-muted-foreground">Drafts</p>
          </Card>

          <Card className="p-6 border-slate-200 dark:border-slate-800 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-slate-900">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-foreground">{totalEnrolled}</p>
            <p className="text-sm text-muted-foreground">Total Students</p>
          </Card>

          <Card className="p-6 border-slate-200 dark:border-slate-800 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:to-slate-900">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                <Trophy className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-foreground">{avgRecentScore}%</p>
            <p className="text-sm text-muted-foreground">Avg Score</p>
          </Card>
        </div>

        {/* Upcoming Assessments */}
        <Card className="p-6 mb-8 border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-lg font-semibold text-foreground">
                  Upcoming Assessments
                </h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Quizzes and assignments scheduled for the next few days
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => navigate("/trainer/create-quiz")}
                size="sm"
                className="gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
              >
                <Plus className="w-4 h-4" />
                Create Quiz
              </Button>
              <Button
                onClick={() => navigate("/trainer/create-assignments")}
                size="sm"
                variant="outline"
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Assignment
              </Button>
            </div>
          </div>

          {/* Empty State for Upcoming */}
          {upcoming.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="inline-flex p-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-4">
                <ClipboardList className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No Upcoming Assessments
              </h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                Get started by creating your first quiz or assignment. Track student progress and evaluate their learning effectively.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={() => navigate("/trainer/create-quiz")}
                  className="gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                >
                  <Plus className="w-4 h-4" />
                  Create Your First Quiz
                </Button>
                <Button
                  onClick={() => navigate("/trainer/create-assignments")}
                  variant="outline"
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create Assignment
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Search & Filter */}
              <div className="flex flex-col md:flex-row gap-3 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search assessments..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-slate-300 dark:border-slate-700"
                  />
                </div>
                <div className="flex gap-2">
                  {["All", "Quiz", "Assignment"].map((type) => (
                    <Button
                      key={type}
                      size="sm"
                      variant={filterType === type ? "default" : "outline"}
                      onClick={() => setFilterType(type)}
                      className={
                        filterType === type
                          ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                          : ""
                      }
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Assessment List (will show when data exists) */}
              <div className="space-y-3">
                {filteredUpcoming.map((item) => (
                  <div
                    key={item.id}
                    className="group rounded-lg border border-slate-200 dark:border-slate-800 p-5 bg-background hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all hover:shadow-md"
                  >
                    {/* Assessment card content here */}
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>

        {/* Recent Assessments */}
        <Card className="p-6 border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-lg font-semibold text-foreground">
                  Recent Assessments
                </h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Completed assessments and their performance analytics
              </p>
            </div>
            {recentAssessments.length > 0 && (
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
            )}
          </div>

          {/* Empty State for Recent */}
          {recentAssessments.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="inline-flex p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
                <BarChart3 className="w-12 h-12 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No Completed Assessments Yet
              </h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                Once students complete your assessments, you'll see detailed analytics and performance metrics here.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="w-4 h-4" />
                <span>Create assessments to start tracking student progress</span>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {recentAssessments.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border border-slate-200 dark:border-slate-800 p-5 bg-background hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all"
                >
                  {/* Recent assessment card content here */}
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Help Section */}
        <Card className="p-6 mt-8 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-slate-900">
          <div className="flex gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg shrink-0 h-fit">
              <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                Getting Started with Assessments
              </h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                  <span>Create quizzes to test student knowledge with multiple choice, true/false, and short answer questions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                  <span>Set up assignments for practical tasks and projects with file uploads and deadlines</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                  <span>Track student submissions and provide detailed feedback to help them improve</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                  <span>View analytics and performance metrics to identify areas where students need support</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Assessments;