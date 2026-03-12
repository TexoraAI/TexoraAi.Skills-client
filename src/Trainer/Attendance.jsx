
import { getTrainerStudents } from "@/services/chatService";
import { useEffect, useState } from "react";
import attendanceService from "../services/attendanceService";
import videoService from "../services/videoService";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  AlertCircle,
  BarChart3,
  Calendar,
  CheckCircle,
  UserCheck,
  Users,
  XCircle
} from "lucide-react";

const todayISO = new Date().toISOString().split("T")[0];

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const statusClasses = {
  PRESENT:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800",
  ABSENT:
    "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800",
  LATE: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800",
};

const Attendance = () => {
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [batchId, setBatchId] = useState(null);

  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showSuccess, setShowSuccess] = useState(false);

  /* ================= LOAD TRAINER BATCHES ================= */
  useEffect(() => {
    const loadBatches = async () => {
      try {
        const res = await videoService.getTrainerBatches();
        setBatches(res.data || []);
      } catch (e) {
        console.error("Failed to load batches", e);
      }
    };
    loadBatches();
  }, []);

  /* ================= LOAD STUDENTS OF SELECTED BATCH ================= */
  useEffect(() => {
    if (!batchId) {
      setStudents([]);
      return;
    }

    const loadStudents = async () => {
      try {
        const res = await getTrainerStudents(batchId);

        const mappedStudents = res.data.map((email, index) => ({
          userId: index + 1,
          email: email,
          name: email.split("@")[0],
          status: "PRESENT",
          batchId: batchId,
        }));

        setStudents(mappedStudents);
      } catch (err) {
        console.error("❌ Failed to load batch students", err);
        setStudents([]);
      }
    };

    loadStudents();
  }, [batchId]);

  /* ================= UPDATE STATUS ================= */
  const updateStatus = (index, status) => {
    const copy = [...students];
    copy[index].status = status;
    setStudents(copy);
  };

  const markAll = (status) => {
    setStudents(students.map((s) => ({ ...s, status })));
  };

  /* ================= SUBMIT ================= */
  const submitAttendance = async () => {
    try {
      setSaving(true);

      await attendanceService.markAttendance({
        batchId: batchId,
        attendanceDate: todayISO,
        attendances: students.map((s) => ({
          studentUserId: s.userId,
          studentEmail: s.email,
          status: s.status,
        })),
      });

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch {
      alert("❌ Failed to mark attendance");
    } finally {
      setSaving(false);
    }
  };

  const filteredStudents = students.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      (s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)) &&
      (filterStatus === "All" || s.status === filterStatus)
    );
  });

  const presentCount = students.filter((s) => s.status === "PRESENT").length;
  const absentCount = students.filter((s) => s.status === "ABSENT").length;
  const lateCount = students.filter((s) => s.status === "LATE").length;
  const attendanceRate =
    students.length > 0
      ? ((presentCount + lateCount) / students.length) * 100
      : 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-2 text-xs uppercase">
            <UserCheck className="w-4 h-4" />
            Attendance Management
          </div>
          <h1 className="text-xl font-bold">Today's Attendance</h1>
          <p className="text-sm flex items-center gap-1 opacity-90">
            <Calendar className="w-4 h-4" />
            {formatDate(todayISO)}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* ⭐ SUCCESS MESSAGE (ONLY ADDED PART) */}
        {showSuccess && (
          <div className="mb-4 p-3 text-sm bg-emerald-100 dark:bg-emerald-900 border border-emerald-300 dark:border-emerald-700 rounded">
            ✅ Attendance submitted successfully for this batch
          </div>
        )}

        {/* BATCH SELECTOR */}
        <Card className="p-3 mb-5">
          <select
            value={batchId || ""}
            onChange={(e) => setBatchId(Number(e.target.value))}
            className="w-full h-9 rounded-md border px-3 text-sm"
          >
            <option value="">Select Batch</option>
            {batches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name || "Batch"} (ID: {b.id})
              </option>
            ))}
          </select>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          <Card className="p-3 flex items-center gap-2">
            <Users className="w-4 h-4" /> {students.length} Students
          </Card>
          <Card className="p-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-500" /> {presentCount}{" "}
            Present
          </Card>
          <Card className="p-3 flex items-center gap-2">
            <XCircle className="w-4 h-4 text-rose-500" /> {absentCount} Absent
          </Card>
          <Card className="p-3 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" /> {attendanceRate.toFixed(0)}%
          </Card>
        </div>

        {/* Student Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {filteredStudents.map((s, i) => (
            <Card key={s.userId} className="p-3 space-y-2">
              <div>
                <p className="font-medium text-sm">{s.name}</p>
                <p className="text-xs text-muted-foreground">{s.email}</p>
              </div>

              <div
                className={`flex items-center gap-2 text-xs font-medium px-2 py-1 rounded w-fit ${statusClasses[s.status]}`}
              >
                {s.status === "PRESENT" && <CheckCircle className="w-4 h-4" />}
                {s.status === "ABSENT" && <XCircle className="w-4 h-4" />}
                {s.status === "LATE" && <AlertCircle className="w-4 h-4" />}
                {s.status}
              </div>

              <select
                value={s.status}
                onChange={(e) => updateStatus(i, e.target.value)}
                className="w-full rounded px-2 py-1 text-sm border"
              >
                <option value="PRESENT">Present</option>
                <option value="ABSENT">Absent</option>
                <option value="LATE">Late</option>
              </select>
            </Card>
          ))}
        </div>

        {students.length > 0 && (
          <div className="mt-6 text-center">
            <Button onClick={submitAttendance} disabled={saving}>
              {saving ? "Saving..." : `Submit Attendance (${students.length})`}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;
