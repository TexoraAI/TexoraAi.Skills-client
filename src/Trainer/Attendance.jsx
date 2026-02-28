// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import attendanceService from "../services/attendanceService";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   UserCheck,
//   Users,
//   Calendar,
//   CheckCircle,
//   XCircle,
//   Download,
//   AlertCircle,
//   BarChart3,
// } from "lucide-react";

// const STUDENT_API = "http://localhost:9000/api/students";

// // YYYY-MM-DD
// const todayISO = new Date().toISOString().split("T")[0];

// const formatDate = (dateStr) =>
//   new Date(dateStr).toLocaleDateString("en-US", {
//     weekday: "long",
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   });

// const statusClasses = {
//   PRESENT: "bg-emerald-100 text-emerald-700 border-emerald-200",
//   ABSENT: "bg-rose-100 text-rose-700 border-rose-200",
//   LATE: "bg-amber-100 text-amber-700 border-amber-200",
// };

// const Attendance = () => {
//   const [students, setStudents] = useState([]);
//   const [saving, setSaving] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filterStatus, setFilterStatus] = useState("All");
//   const [showSuccess, setShowSuccess] = useState(false);

//   // ================= LOAD STUDENTS =================
//   useEffect(() => {
//     loadStudents();
//   }, []);

//   const loadStudents = async () => {
//     try {
//       const res = await axios.get(STUDENT_API, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
//         },
//       });

//       const mapped = res.data.map((s) => ({
//         userId: s.userId,
//         email: s.email,
//         name: s.email.split("@")[0],
//         status: "PRESENT",
//         batchId: 1, // TODO: make dynamic later
//       }));

//       setStudents(mapped);
//     } catch (err) {
//       console.error("Failed to load students", err);
//       alert("❌ Failed to load students");
//     }
//   };

//   // ================= UPDATE STATUS =================
//   const updateStatus = (index, status) => {
//     const copy = [...students];
//     copy[index].status = status;
//     setStudents(copy);
//   };

//   // ================= MARK ALL =================
//   const markAll = (status) => {
//     setStudents(students.map((s) => ({ ...s, status })));
//   };

//   // ================= SUBMIT ATTENDANCE (FIXED) =================
//   const submitAttendance = async () => {
//     try {
//       setSaving(true);

//       const payload = {
//         batchId: students[0]?.batchId,
//         attendanceDate: todayISO,
//         attendances: students.map((s) => ({
//           studentUserId: s.userId,
//           studentEmail: s.email, // ✅ REQUIRED FIX
//           status: s.status,
//         })),
//       };

//       await attendanceService.markAttendance(payload);

//       setShowSuccess(true);
//       setTimeout(() => setShowSuccess(false), 3000);
//     } catch (err) {
//       console.error("Attendance submit failed", err);
//       alert("❌ Failed to mark attendance");
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ================= FILTER =================
//   const filteredStudents = students.filter((s) => {
//     const matchSearch =
//       s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       s.email.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchStatus = filterStatus === "All" || s.status === filterStatus;
//     return matchSearch && matchStatus;
//   });

//   // ================= STATS =================
//   const presentCount = students.filter((s) => s.status === "PRESENT").length;
//   const absentCount = students.filter((s) => s.status === "ABSENT").length;
//   const lateCount = students.filter((s) => s.status === "LATE").length;
//   const attendanceRate =
//     students.length > 0
//       ? ((presentCount + lateCount) / students.length) * 100
//       : 0;

//   return (
//     <div className="min-h-screen bg-slate-50">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
//         <div className="max-w-7xl mx-auto px-6 py-6">
//           <div className="flex items-center gap-2 mb-1">
//             <UserCheck />
//             <span className="uppercase text-xs font-semibold">
//               Attendance Management
//             </span>
//           </div>
//           <h1 className="text-2xl font-bold">Today's Attendance</h1>
//           <p className="text-sm flex items-center gap-2">
//             <Calendar className="w-4 h-4" />
//             {formatDate(todayISO)}
//           </p>
//         </div>
//       </div>

//       {/* Content */}
//       <div className="max-w-7xl mx-auto px-6 py-8">
//         {showSuccess && (
//           <div className="mb-4 p-4 bg-green-100 border border-green-300 rounded">
//             ✅ Attendance marked successfully
//           </div>
//         )}

//         {/* Stats */}
//         <div className="grid grid-cols-4 gap-4 mb-6">
//           <Card className="p-4">
//             <Users /> {students.length} Students
//           </Card>
//           <Card className="p-4">
//             <CheckCircle /> {presentCount} Present
//           </Card>
//           <Card className="p-4">
//             <XCircle /> {absentCount} Absent
//           </Card>
//           <Card className="p-4">
//             <BarChart3 /> {attendanceRate.toFixed(0)}%
//           </Card>
//         </div>

//         {/* Controls */}
//         <Card className="p-4 mb-6">
//           <div className="flex gap-2">
//             <Input
//               placeholder="Search students..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//             <Button onClick={() => markAll("PRESENT")}>Mark All Present</Button>
//             <Button onClick={() => markAll("ABSENT")}>Mark All Absent</Button>
//             <Button variant="outline">
//               <Download className="w-4 h-4" />
//             </Button>
//           </div>

//           <div className="flex gap-2 mt-3">
//             {["All", "PRESENT", "ABSENT", "LATE"].map((s) => (
//               <Button
//                 key={s}
//                 variant={filterStatus === s ? "default" : "outline"}
//                 onClick={() => setFilterStatus(s)}
//               >
//                 {s}
//               </Button>
//             ))}
//           </div>
//         </Card>

//         {/* Student Cards */}
//         <div className="grid grid-cols-3 gap-4">
//           {filteredStudents.map((s, i) => (
//             <Card key={s.userId} className="p-4">
//               <p className="font-semibold">{s.name}</p>
//               <p className="text-xs text-gray-500">{s.email}</p>

//               <select
//                 value={s.status}
//                 onChange={(e) => updateStatus(i, e.target.value)}
//                 className={`mt-3 w-full border rounded px-2 py-1 ${statusClasses[s.status]}`}
//               >
//                 <option value="PRESENT">Present</option>
//                 <option value="ABSENT">Absent</option>
//                 <option value="LATE">Late</option>
//               </select>
//             </Card>
//           ))}
//         </div>

//         {/* Submit */}
//         {students.length > 0 && (
//           <div className="mt-8 text-center">
//             <Button onClick={submitAttendance} disabled={saving}>
//               {saving ? "Saving..." : `Submit Attendance (${students.length})`}
//             </Button>
//           </div>
//         )}

//         {/* Tips */}
//         <Card className="p-4 mt-8">
//           <AlertCircle className="inline mr-2" />
//           Use “Mark All Present” and adjust exceptions before submitting.
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default Attendance;










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
  CheckCircle,
  XCircle,
  Download,
  AlertCircle,
  BarChart3,
} from "lucide-react";

const STUDENT_API = "http://localhost:9000/api/students";

// YYYY-MM-DD
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
  LATE:
    "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800",
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

      setStudents(
        res.data.map((s) => ({
          userId: s.userId,
          email: s.email,
          name: s.email.split("@")[0],
          status: "PRESENT",
          batchId: 1,
        }))
      );
    } catch (err) {
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

  // ================= SUBMIT =================
  const submitAttendance = async () => {
    try {
      setSaving(true);
      await attendanceService.markAttendance({
        batchId: students[0]?.batchId,
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

  // ================= FILTER =================
  const filteredStudents = students.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      (s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q)) &&
      (filterStatus === "All" || s.status === filterStatus)
    );
  });

  // ================= STATS =================
  const presentCount = students.filter((s) => s.status === "PRESENT").length;
  const absentCount = students.filter((s) => s.status === "ABSENT").length;
  const lateCount = students.filter((s) => s.status === "LATE").length;
  const attendanceRate =
    students.length > 0
      ? ((presentCount + lateCount) / students.length) * 100
      : 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Header */}
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
        {/* Success */}
        {showSuccess && (
          <div className="mb-4 p-3 text-sm bg-emerald-100 dark:bg-emerald-900 border border-emerald-300 dark:border-emerald-700 rounded">
            ✅ Attendance marked successfully
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          <Card className="p-3 flex items-center gap-2">
            <Users className="w-4 h-4" /> {students.length} Students
          </Card>
          <Card className="p-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-500" /> {presentCount} Present
          </Card>
          <Card className="p-3 flex items-center gap-2">
            <XCircle className="w-4 h-4 text-rose-500" /> {absentCount} Absent
          </Card>
          <Card className="p-3 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" /> {attendanceRate.toFixed(0)}%
          </Card>
        </div>

        {/* Controls */}
        <Card className="p-4 mb-5">
          <div className="flex flex-wrap gap-2">
            <Input
              className="h-9"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button size="sm" onClick={() => markAll("PRESENT")}>
              Mark All Present
            </Button>
            <Button size="sm" onClick={() => markAll("ABSENT")}>
              Mark All Absent
            </Button>
            <Button size="sm" variant="outline">
              <Download className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex gap-2 mt-3">
            {["All", "PRESENT", "ABSENT", "LATE"].map((s) => (
              <Button
                key={s}
                size="sm"
                variant={filterStatus === s ? "default" : "outline"}
                onClick={() => setFilterStatus(s)}
              >
                {s}
              </Button>
            ))}
          </div>
        </Card>

        {/* Student Cards with REAL ICON STATUS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {filteredStudents.map((s, i) => (
            <Card key={s.userId} className="p-3 space-y-2">
              <div>
                <p className="font-medium text-sm">{s.name}</p>
                <p className="text-xs text-muted-foreground">{s.email}</p>
              </div>

              {/* Status Badge */}
              <div
                className={`flex items-center gap-2 text-xs font-medium px-2 py-1 rounded w-fit ${statusClasses[s.status]}`}
              >
                {s.status === "PRESENT" && <CheckCircle className="w-4 h-4" />}
                {s.status === "ABSENT" && <XCircle className="w-4 h-4" />}
                {s.status === "LATE" && <AlertCircle className="w-4 h-4" />}
                {s.status}
              </div>

              {/* Status Select */}
              <select
                value={s.status}
                onChange={(e) => updateStatus(i, e.target.value)}
                className="w-full rounded px-2 py-1 text-sm border border-border bg-background dark:bg-slate-900"
              >
                <option value="PRESENT">Present</option>
                <option value="ABSENT">Absent</option>
                <option value="LATE">Late</option>
              </select>
            </Card>
          ))}
        </div>

        {/* Submit */}
        {students.length > 0 && (
          <div className="mt-6 text-center">
            <Button onClick={submitAttendance} disabled={saving}>
              {saving ? "Saving..." : `Submit Attendance (${students.length})`}
            </Button>
          </div>
        )}

        {/* Tip */}
        <Card className="p-3 mt-6 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          Mark all → fix exceptions → submit
        </Card>
      </div>
    </div>
  );
};

export default Attendance;
