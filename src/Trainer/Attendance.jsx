
import React, { useEffect, useState } from "react";
import axios from "axios";
import attendanceService from "../services/attendanceService";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  UserCheck,
  Users,
  Calendar,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Download,
  Filter,
  AlertCircle,
  Sparkles,
  BarChart3,
} from "lucide-react";

const STUDENT_API = "http://localhost:9000/api/students";

// YYYY-MM-DD (LocalDate compatible)
const todayISO = new Date().toISOString().split("T")[0];

// Format date for display
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// ✅ Theme-safe status styles
const statusClasses = {
  PRESENT:
    "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  ABSENT:
    "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800",
  LATE:
    "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
};

const Attendance = () => {
  const [students, setStudents] = useState([]);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showSuccess, setShowSuccess] = useState(false);

  // ================= LOAD STUDENTS =================
  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const res = await axios.get(STUDENT_API, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
        },
      });

      const mapped = res.data.map((s) => ({
        userId: s.userId,
        email: s.email,
        name: s.email.split("@")[0],
        status: "PRESENT",
        batchId: 1, // TODO: make dynamic
      }));

      setStudents(mapped);
    } catch (err) {
      console.error("Failed to load students", err);
      alert("❌ Failed to load students");
    }
  };

  // ================= UPDATE STATUS =================
  const updateStatus = (index, status) => {
    const copy = [...students];
    copy[index].status = status;
    setStudents(copy);
  };

  // ================= MARK ALL =================
  const markAll = (status) => {
    setStudents(students.map((s) => ({ ...s, status })));
  };

  // ================= SUBMIT ATTENDANCE =================
  const submitAttendance = async () => {
    try {
      setSaving(true);

      const trainerUserId = localStorage.getItem("trainerUserId");
      if (!trainerUserId) {
        alert("❌ Trainer not logged in. Please login again.");
        return;
      }

      for (const s of students) {
        await attendanceService.markAttendance({
          studentUserId: s.userId,
          trainerUserId: Number(trainerUserId),
          batchId: s.batchId,
          status: s.status,
          date: todayISO,
        });
      }

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error("Attendance submit failed", err);
      alert("❌ Failed to mark attendance");
    } finally {
      setSaving(false);
    }
  };

  // ================= FILTER & SEARCH =================
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "All" || student.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // ================= CALCULATE STATS =================
  const presentCount = students.filter((s) => s.status === "PRESENT").length;
  const absentCount = students.filter((s) => s.status === "ABSENT").length;
  const lateCount = students.filter((s) => s.status === "LATE").length;
  const attendanceRate =
    students.length > 0
      ? ((presentCount + lateCount) / students.length) * 100
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Premium Hero Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
              <UserCheck className="w-6 h-6 text-white" />
            </div>
            <p className="text-xs font-semibold tracking-wide text-blue-100 uppercase">
              Attendance Management
            </p>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Today's Attendance
          </h1>
          <p className="text-blue-100 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {formatDate(todayISO)}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Success Notification */}
        {showSuccess && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg flex items-center gap-3 animate-in slide-in-from-top">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            <div>
              <p className="font-semibold text-green-900 dark:text-green-100">
                Attendance Marked Successfully!
              </p>
              <p className="text-sm text-green-700 dark:text-green-300">
                Attendance for {students.length} students has been recorded
              </p>
            </div>
          </div>
        )}

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 border-slate-200 dark:border-slate-800 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-slate-900">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {students.length}
            </p>
            <p className="text-sm text-muted-foreground">Total Students</p>
          </Card>

          <Card className="p-6 border-slate-200 dark:border-slate-800 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:to-slate-900">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-foreground">{presentCount}</p>
            <p className="text-sm text-muted-foreground">Present</p>
          </Card>

          <Card className="p-6 border-slate-200 dark:border-slate-800 bg-gradient-to-br from-rose-50 to-white dark:from-rose-950/20 dark:to-slate-900">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-lg">
                <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{absentCount}</p>
            <p className="text-sm text-muted-foreground">Absent</p>
          </Card>

          <Card className="p-6 border-slate-200 dark:border-slate-800 bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-slate-900">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <TrendingUp className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-foreground">
              {attendanceRate.toFixed(0)}%
            </p>
            <p className="text-sm text-muted-foreground">Attendance Rate</p>
          </Card>
        </div>

        {/* Control Panel */}
        <Card className="p-6 mb-6 border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="flex-1 w-full lg:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search students by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-slate-300 dark:border-slate-700"
                />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2 w-full lg:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => markAll("PRESENT")}
                className="gap-2 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-300 dark:hover:border-emerald-700"
              >
                <CheckCircle className="w-4 h-4" />
                Mark All Present
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => markAll("ABSENT")}
                className="gap-2 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-300 dark:hover:border-rose-700"
              >
                <XCircle className="w-4 h-4" />
                Mark All Absent
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {["All", "PRESENT", "ABSENT", "LATE"].map((status) => (
              <Button
                key={status}
                size="sm"
                variant={filterStatus === status ? "default" : "outline"}
                onClick={() => setFilterStatus(status)}
                className={
                  filterStatus === status
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                    : ""
                }
              >
                {status === "All" ? `All (${students.length})` : status}
                {status !== "All" &&
                  ` (${students.filter((s) => s.status === status).length})`}
              </Button>
            ))}
          </div>
        </Card>

        {/* Student List */}
        {filteredStudents.length === 0 ? (
          <Card className="p-12 text-center border-slate-200 dark:border-slate-800">
            <div className="inline-flex p-4 bg-slate-100 dark:bg-slate-800 rounded-full mb-4">
              <Users className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {students.length === 0
                ? "No Students Found"
                : "No Matching Students"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {students.length === 0
                ? "Students will appear here once they're enrolled in the batch"
                : "Try adjusting your search or filter"}
            </p>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredStudents.map((s, index) => {
              const actualIndex = students.findIndex(
                (student) => student.userId === s.userId
              );
              return (
                <Card
                  key={s.userId}
                  className="p-5 border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm shrink-0">
                        {s.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-foreground truncate">
                          {s.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {s.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Status Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">
                      Attendance Status
                    </label>
                    <select
                      value={s.status}
                      onChange={(e) => updateStatus(actualIndex, e.target.value)}
                      className={`w-full rounded-lg border px-3 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer ${statusClasses[s.status]}`}
                    >
                      <option value="PRESENT">✓ Present</option>
                      <option value="ABSENT">✗ Absent</option>
                      <option value="LATE">⏰ Late</option>
                    </select>
                  </div>

                  {/* Status Indicator */}
                  <div className="mt-3 flex items-center gap-2 text-xs">
                    {s.status === "PRESENT" && (
                      <>
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                          Marked as present
                        </span>
                      </>
                    )}
                    {s.status === "ABSENT" && (
                      <>
                        <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                        <span className="text-rose-600 dark:text-rose-400 font-medium">
                          Marked as absent
                        </span>
                      </>
                    )}
                    {s.status === "LATE" && (
                      <>
                        <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                        <span className="text-amber-600 dark:text-amber-400 font-medium">
                          Marked as late
                        </span>
                      </>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Submit Button */}
        {students.length > 0 && (
          <div className="mt-8 flex justify-center">
            <Button
              onClick={submitAttendance}
              disabled={saving}
              size="lg"
              className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving Attendance...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Submit Attendance for {students.length} Students
                </>
              )}
            </Button>
          </div>
        )}

        {/* Help Section */}
        <Card className="p-6 mt-8 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-slate-900">
          <div className="flex gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg shrink-0 h-fit">
              <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                Attendance Tips
              </h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 mt-0.5">
                    •
                  </span>
                  <span>
                    Use "Mark All Present" to quickly set all students as
                    present, then update individual exceptions
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 mt-0.5">
                    •
                  </span>
                  <span>
                    Search for students by name or email to quickly find them in
                    large batches
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 mt-0.5">
                    •
                  </span>
                  <span>
                    Filter by status to review or verify all present, absent, or
                    late students before submitting
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

export default Attendance;