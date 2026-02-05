
import React, { useEffect, useState } from "react";
import { FileText, Calendar, Award, Clock } from "lucide-react";
import assessmentService from "../services/assessmentService";
import { useNavigate } from "react-router-dom";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Assessments = () => {
  const [assessments, setAssessments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        const res = await assessmentService.getAllQuizzes();
        setAssessments(res.data);
      } catch (err) {
        console.error("Failed to load quizzes", err);
      }
    };

    loadQuizzes();
  }, []);

  const statusClass =
    "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* ================= MODERN HERO BANNER ================= */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900">
        {/* Decorative background elements */}
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        
        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-700" />
        
        {/* Content */}
        <div className="relative px-6 py-16 md:py-24 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Left side - Text content */}
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                <Award className="h-4 w-4 text-yellow-300" />
                <span className="text-xs font-semibold text-white uppercase tracking-wider">
                  Assessment Portal
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
                Your Assessments
              </h1>
              
              <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl">
                Track your progress, attempt quizzes, and excel in your learning journey
              </p>
              
              {/* Stats */}
              <div className="flex flex-wrap items-center gap-6 justify-center md:justify-start">
                <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm">
                  <FileText className="h-5 w-5 text-white/80" />
                  <div className="text-left">
                    <p className="text-2xl font-bold text-white">{assessments.length}</p>
                    <p className="text-xs text-white/70">Total Quizzes</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm">
                  <Clock className="h-5 w-5 text-white/80" />
                  <div className="text-left">
                    <p className="text-2xl font-bold text-white">{assessments.length}</p>
                    <p className="text-xs text-white/70">Pending</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right side - Illustration/Icon */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="w-64 h-64 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 flex items-center justify-center">
                  <FileText className="h-32 w-32 text-white/80" strokeWidth={1.5} />
                </div>
                <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-yellow-400/20 backdrop-blur-sm flex items-center justify-center">
                  <Award className="h-10 w-10 text-yellow-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= ASSESSMENT CARDS ================= */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {assessments.map((item) => (
            <Card
              key={item.id}
              className="group p-6 flex flex-col justify-between hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-indigo-200 dark:hover:border-indigo-800"
            >
              {/* Title */}
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {item.title}
                </h2>
                <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800/50 transition-colors">
                  <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>

              {/* Quiz Info */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 pb-4 border-b border-border">
                <Calendar className="h-4 w-4" />
                Quiz ID:
                <span className="font-medium text-foreground">
                  {item.id}
                </span>
              </div>

              {/* Status */}
              <span
                className={`inline-block w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${statusClass} mb-4`}
              >
                Pending
              </span>

              {/* Action */}
              <Button
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-300"
                onClick={() => navigate(`/student/quiz/${item.id}`)}
              >
                View Assessment
              </Button>
            </Card>
          ))}

          {assessments.length === 0 && (
            <div className="col-span-full text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
                <Award className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-lg font-medium text-foreground mb-2">
                All caught up!
              </p>
              <p className="text-sm text-muted-foreground">
                No assessments available at the moment 🎉
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Assessments;