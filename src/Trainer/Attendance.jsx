
// import { getTrainerStudents } from "@/services/chatService";
// import { useEffect, useState } from "react";
// import attendanceService from "../services/attendanceService";
// import videoService from "../services/videoService";

// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import {
//   AlertCircle,
//   BarChart3,
//   Calendar,
//   CheckCircle,
//   UserCheck,
//   Users,
//   XCircle
// } from "lucide-react";

// const todayISO = new Date().toISOString().split("T")[0];

// const formatDate = (dateStr) =>
//   new Date(dateStr).toLocaleDateString("en-US", {
//     weekday: "long",
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   });

// const statusClasses = {
//   PRESENT:
//     "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800",
//   ABSENT:
//     "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800",
//   LATE: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800",
// };

// const Attendance = () => {
//   const [students, setStudents] = useState([]);
//   const [batches, setBatches] = useState([]);
//   const [batchId, setBatchId] = useState(null);

//   const [saving, setSaving] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filterStatus, setFilterStatus] = useState("All");
//   const [showSuccess, setShowSuccess] = useState(false);

//   /* ================= LOAD TRAINER BATCHES ================= */
//   useEffect(() => {
//     const loadBatches = async () => {
//       try {
//         const res = await videoService.getTrainerBatches();
//         setBatches(res.data || []);
//       } catch (e) {
//         console.error("Failed to load batches", e);
//       }
//     };
//     loadBatches();
//   }, []);

//   /* ================= LOAD STUDENTS OF SELECTED BATCH ================= */
//   useEffect(() => {
//     if (!batchId) {
//       setStudents([]);
//       return;
//     }

//     const loadStudents = async () => {
//       try {
//         const res = await getTrainerStudents(batchId);

//         const mappedStudents = res.data.map((email, index) => ({
//           userId: index + 1,
//           email: email,
//           name: email.split("@")[0],
//           status: "PRESENT",
//           batchId: batchId,
//         }));

//         setStudents(mappedStudents);
//       } catch (err) {
//         console.error("❌ Failed to load batch students", err);
//         setStudents([]);
//       }
//     };

//     loadStudents();
//   }, [batchId]);

//   /* ================= UPDATE STATUS ================= */
//   const updateStatus = (index, status) => {
//     const copy = [...students];
//     copy[index].status = status;
//     setStudents(copy);
//   };

//   const markAll = (status) => {
//     setStudents(students.map((s) => ({ ...s, status })));
//   };

//   /* ================= SUBMIT ================= */
//   const submitAttendance = async () => {
//     try {
//       setSaving(true);

//       await attendanceService.markAttendance({
//         batchId: batchId,
//         attendanceDate: todayISO,
//         attendances: students.map((s) => ({
//           studentUserId: s.userId,
//           studentEmail: s.email,
//           status: s.status,
//         })),
//       });

//       setShowSuccess(true);
//       setTimeout(() => setShowSuccess(false), 3000);
//     } catch {
//       alert("❌ Failed to mark attendance");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const filteredStudents = students.filter((s) => {
//     const q = searchQuery.toLowerCase();
//     return (
//       (s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)) &&
//       (filterStatus === "All" || s.status === filterStatus)
//     );
//   });

//   const presentCount = students.filter((s) => s.status === "PRESENT").length;
//   const absentCount = students.filter((s) => s.status === "ABSENT").length;
//   const lateCount = students.filter((s) => s.status === "LATE").length;
//   const attendanceRate =
//     students.length > 0
//       ? ((presentCount + lateCount) / students.length) * 100
//       : 0;

//   return (
//     <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
//       {/* HEADER */}
//       <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
//         <div className="max-w-7xl mx-auto px-6 py-4">
//           <div className="flex items-center gap-2 text-xs uppercase">
//             <UserCheck className="w-4 h-4" />
//             Attendance Management
//           </div>
//           <h1 className="text-xl font-bold">Today's Attendance</h1>
//           <p className="text-sm flex items-center gap-1 opacity-90">
//             <Calendar className="w-4 h-4" />
//             {formatDate(todayISO)}
//           </p>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-6 py-6">
//         {/* ⭐ SUCCESS MESSAGE (ONLY ADDED PART) */}
//         {showSuccess && (
//           <div className="mb-4 p-3 text-sm bg-emerald-100 dark:bg-emerald-900 border border-emerald-300 dark:border-emerald-700 rounded">
//             ✅ Attendance submitted successfully for this batch
//           </div>
//         )}

//         {/* BATCH SELECTOR */}
//         <Card className="p-3 mb-5">
//           <select
//             value={batchId || ""}
//             onChange={(e) => setBatchId(Number(e.target.value))}
//             className="w-full h-9 rounded-md border px-3 text-sm"
//           >
//             <option value="">Select Batch</option>
//             {batches.map((b) => (
//               <option key={b.id} value={b.id}>
//                 {b.name || "Batch"} (ID: {b.id})
//               </option>
//             ))}
//           </select>
//         </Card>

//         {/* Stats */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
//           <Card className="p-3 flex items-center gap-2">
//             <Users className="w-4 h-4" /> {students.length} Students
//           </Card>
//           <Card className="p-3 flex items-center gap-2">
//             <CheckCircle className="w-4 h-4 text-emerald-500" /> {presentCount}{" "}
//             Present
//           </Card>
//           <Card className="p-3 flex items-center gap-2">
//             <XCircle className="w-4 h-4 text-rose-500" /> {absentCount} Absent
//           </Card>
//           <Card className="p-3 flex items-center gap-2">
//             <BarChart3 className="w-4 h-4" /> {attendanceRate.toFixed(0)}%
//           </Card>
//         </div>

//         {/* Student Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//           {filteredStudents.map((s, i) => (
//             <Card key={s.userId} className="p-3 space-y-2">
//               <div>
//                 <p className="font-medium text-sm">{s.name}</p>
//                 <p className="text-xs text-muted-foreground">{s.email}</p>
//               </div>

//               <div
//                 className={`flex items-center gap-2 text-xs font-medium px-2 py-1 rounded w-fit ${statusClasses[s.status]}`}
//               >
//                 {s.status === "PRESENT" && <CheckCircle className="w-4 h-4" />}
//                 {s.status === "ABSENT" && <XCircle className="w-4 h-4" />}
//                 {s.status === "LATE" && <AlertCircle className="w-4 h-4" />}
//                 {s.status}
//               </div>

//               <select
//                 value={s.status}
//                 onChange={(e) => updateStatus(i, e.target.value)}
//                 className="w-full rounded px-2 py-1 text-sm border"
//               >
//                 <option value="PRESENT">Present</option>
//                 <option value="ABSENT">Absent</option>
//                 <option value="LATE">Late</option>
//               </select>
//             </Card>
//           ))}
//         </div>

//         {students.length > 0 && (
//           <div className="mt-6 text-center">
//             <Button onClick={submitAttendance} disabled={saving}>
//               {saving ? "Saving..." : `Submit Attendance (${students.length})`}
//             </Button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Attendance;




























import { getTrainerStudents } from "@/services/chatService";
import { useEffect, useState } from "react";
import attendanceService from "../services/attendanceService";
import videoService from "../services/videoService";
import {
  AlertCircle,
  BarChart3,
  Calendar,
  CheckCircle,
  ChevronDown,
  Search,
  UserCheck,
  Users,
  XCircle,
} from "lucide-react";

const todayISO = new Date().toISOString().split("T")[0];

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const STATUS_CONFIG = {
  PRESENT: {
    label: "Present",
    icon: CheckCircle,
    pill: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800",
    btn: "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/25",
    dot: "#10b981",
  },
  ABSENT: {
    label: "Absent",
    icon: XCircle,
    pill: "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800",
    btn: "bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/25",
    dot: "#f43f5e",
  },
  LATE: {
    label: "Late",
    icon: AlertCircle,
    pill: "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800",
    btn: "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/25",
    dot: "#f59e0b",
  },
};

const Attendance = () => {
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [batchId, setBatchId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showSuccess, setShowSuccess] = useState(false);

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

  useEffect(() => {
    if (!batchId) { setStudents([]); return; }
    const loadStudents = async () => {
      try {
        const res = await getTrainerStudents(batchId);
        const mappedStudents = res.data.map((email, index) => ({
          userId: index + 1,
          email,
          name: email.split("@")[0],
          status: "PRESENT",
          batchId,
        }));
        setStudents(mappedStudents);
      } catch (err) {
        console.error("Failed to load batch students", err);
        setStudents([]);
      }
    };
    loadStudents();
  }, [batchId]);

  const updateStatus = (index, status) => {
    const copy = [...students];
    copy[index].status = status;
    setStudents(copy);
  };

  const markAll = (status) => setStudents(students.map((s) => ({ ...s, status })));

  const submitAttendance = async () => {
    try {
      setSaving(true);
      await attendanceService.markAttendance({
        batchId,
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
      alert("Failed to mark attendance");
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

  const selectedBatch = batches.find((b) => b.id === batchId);

  return (
    <div className="min-h-screen bg-[#f4f6fb] dark:bg-slate-950">

      {/* ── HERO ── */}
      <div
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 60%, #7c3aed 100%)" }}
      >
        <div className="pointer-events-none absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #bfdbfe, transparent)" }} />
        <div className="pointer-events-none absolute bottom-0 left-1/4 w-36 h-16 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #c4b5fd, transparent)" }} />
        <div className="relative px-5 py-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.25)" }}>
              <UserCheck style={{ width: 14, height: 14, color: "white" }} />
            </div>
            <p className="text-[9px] font-bold uppercase tracking-[0.12em]"
              style={{ color: "rgba(255,255,255,0.6)" }}>
              Attendance Management
            </p>
          </div>
          <h1 className="text-[18px] font-bold text-white leading-tight">Today's Attendance</h1>
          <p className="text-[12px] flex items-center gap-1.5 mt-0.5"
            style={{ color: "rgba(255,255,255,0.65)" }}>
            <Calendar style={{ width: 11, height: 11 }} />
            {formatDate(todayISO)}
          </p>
        </div>
      </div>

      <div className="px-4 py-4 space-y-3">

        {/* ── SUCCESS BANNER ── */}
        {showSuccess && (
          <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 px-4 py-2.5 flex items-center gap-2.5"
            style={{ background: "linear-gradient(135deg,#f0fdf4,#ecfdf5)", boxShadow: "0 1px 3px rgba(16,185,129,0.12)" }}>
            <CheckCircle style={{ width: 14, height: 14, color: "#059669" }} />
            <p className="text-[13px] font-semibold text-emerald-700">
              Attendance submitted successfully!
            </p>
          </div>
        )}

        {/* ── BATCH SELECTOR ── */}
        <div
          className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-5 py-4"
          style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.05)" }}
        >
          <label className="block text-[10.5px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Select Batch
          </label>
          <div className="relative">
            <select
              value={batchId || ""}
              onChange={(e) => setBatchId(Number(e.target.value))}
              className="w-full appearance-none px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-[13px] text-slate-800 dark:text-slate-100 outline-none transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-400/15 pr-9"
            >
              <option value="">— Choose a batch —</option>
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name || "Batch"} (ID: {b.id})
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              style={{ width: 14, height: 14 }}
            />
          </div>
        </div>

        {/* ── STATS ROW ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {[
            { label: "Students", value: students.length, icon: Users, color: "#6366f1", bg: "from-indigo-50 to-white dark:from-indigo-950/20 dark:to-slate-900", iconBg: "bg-indigo-100 dark:bg-indigo-900/30", iconColor: "#6366f1" },
            { label: "Present", value: presentCount, icon: CheckCircle, color: "#10b981", bg: "from-emerald-50 to-white dark:from-emerald-950/20 dark:to-slate-900", iconBg: "bg-emerald-100 dark:bg-emerald-900/30", iconColor: "#10b981" },
            { label: "Absent", value: absentCount, icon: XCircle, color: "#f43f5e", bg: "from-rose-50 to-white dark:from-rose-950/20 dark:to-slate-900", iconBg: "bg-rose-100 dark:bg-rose-900/30", iconColor: "#f43f5e" },
            { label: "Rate", value: `${attendanceRate.toFixed(0)}%`, icon: BarChart3, color: "#f59e0b", bg: "from-amber-50 to-white dark:from-amber-950/20 dark:to-slate-900", iconBg: "bg-amber-100 dark:bg-amber-900/30", iconColor: "#f59e0b" },
          ].map(({ label, value, icon: Icon, bg, iconBg, iconColor }) => (
            <div
              key={label}
              className={`rounded-xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br ${bg} px-4 py-3`}
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${iconBg}`}>
                  <Icon style={{ width: 13, height: 13, color: iconColor }} />
                </div>
              </div>
              <p className="text-[20px] font-bold text-slate-800 dark:text-slate-100 leading-none mb-0.5">{value}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{label}</p>
            </div>
          ))}
        </div>

        {/* ── STUDENT TABLE ── */}
        {students.length > 0 && (
          <div
            className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.05)" }}
          >
            {/* table header toolbar */}
            <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Users style={{ width: 13, height: 13, color: "#3b82f6" }} />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-slate-800 dark:text-slate-100 leading-tight">
                    {selectedBatch?.name || `Batch ${batchId}`}
                  </p>
                  <p className="text-[11px] text-slate-400">{students.length} students</p>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap items-center">
                {/* search */}
                <div className="relative">
                  <Search
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                    style={{ width: 12, height: 12 }}
                  />
                  <input
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-7 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[12px] text-slate-700 dark:text-slate-200 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/15 placeholder:text-slate-400 w-36"
                  />
                </div>

                {/* filter pills */}
                {["All", "PRESENT", "ABSENT", "LATE"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setFilterStatus(s)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                      filterStatus === s
                        ? "bg-blue-600 text-white shadow-sm"
                        : "border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    {s === "All" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
                  </button>
                ))}

                {/* mark all */}
                <div className="flex gap-1.5">
                  {["PRESENT", "ABSENT", "LATE"].map((s) => (
                    <button
                      key={s}
                      onClick={() => markAll(s)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all shadow-sm ${STATUS_CONFIG[s].btn}`}
                      style={{ boxShadow: `0 1px 4px ${STATUS_CONFIG[s].dot}40` }}
                    >
                      All {s.charAt(0) + s.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* progress bar */}
            <div className="px-5 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <div className="flex-1 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
                <div
                  className="h-full bg-emerald-500 transition-all duration-500 rounded-l-full"
                  style={{ width: `${students.length ? (presentCount / students.length) * 100 : 0}%` }}
                />
                <div
                  className="h-full bg-amber-400 transition-all duration-500"
                  style={{ width: `${students.length ? (lateCount / students.length) * 100 : 0}%` }}
                />
                <div
                  className="h-full bg-rose-400 transition-all duration-500"
                  style={{ width: `${students.length ? (absentCount / students.length) * 100 : 0}%` }}
                />
              </div>
              <span className="text-[11px] font-semibold text-slate-500 shrink-0">
                {attendanceRate.toFixed(0)}% present
              </span>
            </div>

            {/* student rows */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredStudents.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-[13px] text-slate-400">No students match your filter</p>
                </div>
              ) : (
                filteredStudents.map((s, i) => {
                  const cfg = STATUS_CONFIG[s.status];
                  const Icon = cfg.icon;
                  const realIndex = students.findIndex((st) => st.userId === s.userId);
                  return (
                    <div
                      key={s.userId}
                      className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors group"
                    >
                      {/* avatar */}
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[12px] font-bold text-white"
                        style={{
                          background: `linear-gradient(135deg, ${cfg.dot}cc, ${cfg.dot}88)`,
                          boxShadow: `0 1px 4px ${cfg.dot}40`,
                        }}
                      >
                        {s.name.charAt(0).toUpperCase()}
                      </div>

                      {/* name + email */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-slate-800 dark:text-slate-100 truncate capitalize">
                          {s.name}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">{s.email}</p>
                      </div>

                      {/* status pill */}
                      <div className={`flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg shrink-0 ${cfg.pill}`}>
                        <Icon style={{ width: 11, height: 11 }} />
                        {cfg.label}
                      </div>

                      {/* status toggle buttons */}
                      <div className="flex gap-1 shrink-0">
                        {["PRESENT", "ABSENT", "LATE"].map((st) => (
                          <button
                            key={st}
                            onClick={() => updateStatus(realIndex, st)}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all text-[10px] font-bold ${
                              s.status === st
                                ? `${STATUS_CONFIG[st].btn} shadow-sm`
                                : "bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                            }`}
                            title={st.charAt(0) + st.slice(1).toLowerCase()}
                          >
                            {st === "PRESENT" ? "P" : st === "ABSENT" ? "A" : "L"}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* footer submit */}
            <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-800/20">
              <div className="flex items-center gap-4 text-[12px]">
                <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  {presentCount} Present
                </span>
                <span className="flex items-center gap-1 text-rose-500 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
                  {absentCount} Absent
                </span>
                <span className="flex items-center gap-1 text-amber-500 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                  {lateCount} Late
                </span>
              </div>
              <button
                onClick={submitAttendance}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-white text-[13px] font-semibold disabled:opacity-60 transition-all hover:brightness-105"
                style={{
                  background: "linear-gradient(135deg, #2563eb, #4f46e5)",
                  boxShadow: "0 2px 8px rgba(79,70,229,0.3)",
                }}
              >
                {saving ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    <CheckCircle style={{ width: 14, height: 14 }} />
                    Submit Attendance ({students.length})
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ── EMPTY STATE (no batch selected) ── */}
        {!batchId && (
          <div
            className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center py-14 px-6 text-center"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
              style={{ background: "linear-gradient(135deg,#eff6ff,#e0e7ff)" }}
            >
              <UserCheck style={{ width: 24, height: 24, color: "#6366f1" }} />
            </div>
            <p className="text-[14px] font-semibold text-slate-700 dark:text-slate-200 mb-1">
              Select a Batch to Begin
            </p>
            <p className="text-[12px] text-slate-400 max-w-xs leading-relaxed">
              Choose a batch from the dropdown above to load students and mark today's attendance.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Attendance;