// import React from "react";
// import { Card } from "@/components/ui/card";

// const StudentReports = () => {
//   const rows = [
//     {
//       name: "Aman Kumar",
//       batch: "Full Stack A",
//       progress: "85%",
//       attendance: "92%",
//     },
//     {
//       name: "Neha Sharma",
//       batch: "React Evening",
//       progress: "78%",
//       attendance: "88%",
//     },
//   ];

//   return (
//     <div className="max-w-6xl mx-auto px-6 py-6 space-y-6">
//       {/* Header */}
//       <div>
//         <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
//           Reports
//         </p>
//         <h1 className="text-2xl font-semibold text-foreground">
//           Student Reports
//         </h1>
//         <p className="mt-1 text-sm text-muted-foreground">
//           View individual performance across all batches.
//         </p>
//       </div>

//       {/* Table */}
//       <Card className="p-4">
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm text-left">
//             <thead className="border-b">
//               <tr className="text-muted-foreground">
//                 <th className="py-3 px-2 font-semibold">Student</th>
//                 <th className="py-3 px-2 font-semibold">Batch</th>
//                 <th className="py-3 px-2 font-semibold">Course progress</th>
//                 <th className="py-3 px-2 font-semibold">Attendance</th>
//               </tr>
//             </thead>

//             <tbody className="divide-y">
//               {rows.map((r) => (
//                 <tr key={r.name} className="text-foreground">
//                   <td className="py-3 px-2 font-medium">{r.name}</td>
//                   <td className="py-3 px-2">{r.batch}</td>
//                   <td className="py-3 px-2">{r.progress}</td>
//                   <td className="py-3 px-2">{r.attendance}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </Card>
//     </div>
//   );
// };

// export default StudentReports;




import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Users,
  Search,
  Download,
  Filter,
  TrendingUp,
  Award,
  CheckCircle,
  BarChart3,
  Eye,
  Target,
  Calendar,
  BookOpen,
  Trophy,
  Sparkles,
  ChevronDown,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  X,
} from "lucide-react";

const StudentReports = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBatch, setFilterBatch] = useState("All");
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Empty initial data - real data will come from API
  const students = [];

  const batches = ["All", "Full Stack A", "React Evening"];

  // Filter students
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBatch =
      filterBatch === "All" || student.batch === filterBatch;
    return matchesSearch && matchesBatch;
  });

  // Calculate stats
  const avgProgress =
    students.length > 0
      ? students.reduce((acc, s) => acc + s.progress, 0) / students.length
      : 0;
  const avgAttendance =
    students.length > 0
      ? students.reduce((acc, s) => acc + s.attendance, 0) / students.length
      : 0;
  const avgScore =
    students.length > 0
      ? students.reduce((acc, s) => acc + s.avgScore, 0) / students.length
      : 0;
  const excellentStudents = students.filter(
    (s) => s.status === "Excellent" || s.status === "Outstanding"
  ).length;

  const getStatusColor = (status) => {
    switch (status) {
      case "Outstanding":
        return "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800";
      case "Excellent":
        return "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800";
      case "Good":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800";
      case "Needs Attention":
        return "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800";
      default:
        return "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400";
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 90) return "bg-purple-500";
    if (progress >= 80) return "bg-emerald-500";
    if (progress >= 70) return "bg-blue-500";
    if (progress >= 60) return "bg-amber-500";
    return "bg-rose-500";
  };

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
          <h1 className="text-3xl font-bold text-white mb-2">
            Student Reports
          </h1>
          <p className="text-cyan-100">
            View individual performance and analytics across all batches
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
                <Users className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              </div>
              <TrendingUp className="w-4 h-4 text-cyan-600" />
            </div>
            <p className="text-2xl font-bold text-foreground">
              {students.length}
            </p>
            <p className="text-sm text-muted-foreground">Total Students</p>
          </Card>

          <Card className="p-6 border-slate-200 dark:border-slate-800 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-slate-900">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-foreground">
              {avgProgress.toFixed(0)}%
            </p>
            <p className="text-sm text-muted-foreground">Avg Progress</p>
          </Card>

          <Card className="p-6 border-slate-200 dark:border-slate-800 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:to-slate-900">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-foreground">
              {avgAttendance.toFixed(0)}%
            </p>
            <p className="text-sm text-muted-foreground">Avg Attendance</p>
          </Card>

          <Card className="p-6 border-slate-200 dark:border-slate-800 bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-slate-900">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Trophy className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <TrendingUp className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-foreground">
              {excellentStudents}
            </p>
            <p className="text-sm text-muted-foreground">Top Performers</p>
          </Card>
        </div>

        {/* Search & Filter Bar */}
        <Card className="p-4 mb-6 border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search students by name or email..."
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

          {/* Batch Filter */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {batches.map((batch) => (
              <Button
                key={batch}
                size="sm"
                variant={filterBatch === batch ? "default" : "outline"}
                onClick={() => setFilterBatch(batch)}
                className={
                  filterBatch === batch
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : ""
                }
              >
                {batch}
              </Button>
            ))}
          </div>
        </Card>

        {/* Student Table */}
        {filteredStudents.length === 0 ? (
          <Card className="p-12 text-center border-slate-200 dark:border-slate-800">
            <div className="inline-flex p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
              <Users className="w-12 h-12 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {students.length === 0 ? "No Students Yet" : "No Matching Students"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {students.length === 0
                ? "Students will appear here once they're enrolled"
                : "Try adjusting your search or filter"}
            </p>
          </Card>
        ) : (
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
                  <tr className="text-muted-foreground">
                    <th className="py-4 px-6 text-left font-semibold">
                      Student
                    </th>
                    <th className="py-4 px-6 text-left font-semibold">Batch</th>
                    <th className="py-4 px-6 text-left font-semibold">
                      Progress
                    </th>
                    <th className="py-4 px-6 text-left font-semibold">
                      Attendance
                    </th>
                    <th className="py-4 px-6 text-left font-semibold">
                      Assignments
                    </th>
                    <th className="py-4 px-6 text-left font-semibold">
                      Avg Score
                    </th>
                    <th className="py-4 px-6 text-left font-semibold">
                      Status
                    </th>
                    <th className="py-4 px-6 text-left font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="text-foreground hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                    >
                      {/* Student */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold text-sm shrink-0">
                            {student.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">
                              {student.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {student.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Batch */}
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          <BookOpen className="w-3 h-3" />
                          {student.batch}
                        </span>
                      </td>

                      {/* Progress */}
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold">
                              {student.progress}%
                            </span>
                            {student.trend === "up" ? (
                              <ArrowUpRight className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <ArrowDownRight className="w-3 h-3 text-rose-600" />
                            )}
                          </div>
                          <div className="w-32 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${getProgressColor(
                                student.progress
                              )} transition-all`}
                              style={{ width: `${student.progress}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Attendance */}
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <span className="text-xs font-semibold">
                            {student.attendance}%
                          </span>
                          <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                student.attendance >= 90
                                  ? "bg-emerald-500"
                                  : student.attendance >= 75
                                  ? "bg-blue-500"
                                  : "bg-amber-500"
                              } transition-all`}
                              style={{ width: `${student.attendance}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Assignments */}
                      <td className="py-4 px-6">
                        <div className="text-xs">
                          <span className="font-semibold">
                            {student.assignments.completed}
                          </span>
                          <span className="text-muted-foreground">
                            /{student.assignments.total}
                          </span>
                        </div>
                      </td>

                      {/* Avg Score */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5">
                          <Award className="w-4 h-4 text-amber-500" />
                          <span className="font-semibold">
                            {student.avgScore.toFixed(1)}%
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(
                            student.status
                          )}`}
                        >
                          {student.status === "Outstanding" ||
                          student.status === "Excellent" ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : student.status === "Needs Attention" ? (
                            <Clock className="w-3 h-3" />
                          ) : (
                            <Target className="w-3 h-3" />
                          )}
                          {student.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedStudent(student)}
                          className="gap-2"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Details
                        </Button>
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
                Understanding Student Performance
              </h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 mt-0.5">
                    •
                  </span>
                  <span>
                    <strong>Outstanding (90%+):</strong> Students excelling in
                    all areas with exceptional performance
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 mt-0.5">
                    •
                  </span>
                  <span>
                    <strong>Excellent (80-89%):</strong> Strong performers
                    showing consistent progress
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 mt-0.5">
                    •
                  </span>
                  <span>
                    <strong>Good (70-79%):</strong> Satisfactory performance with
                    room for improvement
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 mt-0.5">
                    •
                  </span>
                  <span>
                    <strong>Needs Attention (&lt;70%):</strong> Students requiring
                    additional support and guidance
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </div>

      {/* Student Details Modal (placeholder) */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedStudent(null)}
          />
          <Card className="relative z-50 w-full max-w-2xl p-6 border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-foreground">
                  {selectedStudent.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Detailed Performance Report
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedStudent(null)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Full detailed analytics coming soon...
            </p>
          </Card>
        </div>
      )}
    </div>
  );
};

export default StudentReports;