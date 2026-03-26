// import React, { useEffect, useState } from "react";
// import {
//   Calendar,
//   CheckCircle,
//   XCircle,
//   AlertCircle,
//   TrendingUp,
//   BarChart3,
// } from "lucide-react";
// import attendanceService from "../services/attendanceService";

// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Badge } from "@/components/ui/badge";

// /* ================= DATE HELPERS ================= */

// const formatDateDDMMYYYY = (isoDate) => {
//   const d = new Date(isoDate);
//   return `${String(d.getDate()).padStart(2, "0")}-${String(
//     d.getMonth() + 1
//   ).padStart(2, "0")}-${d.getFullYear()}`;
// };

// const isToday = (isoDate) => {
//   const today = new Date();
//   const d = new Date(isoDate);
//   return (
//     d.getDate() === today.getDate() &&
//     d.getMonth() === today.getMonth() &&
//     d.getFullYear() === today.getFullYear()
//   );
// };

// /* ================= MONTH MAP ================= */

// const monthMap = {
//   January: 1,
//   February: 2,
//   March: 3,
//   April: 4,
//   May: 5,
//   June: 6,
//   July: 7,
//   August: 8,
//   September: 9,
//   October: 10,
//   November: 11,
//   December: 12,
// };

// /* ================= COMPONENT ================= */

// const Attendance = () => {
//   const [month, setMonth] = useState("February");
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const year = new Date().getFullYear();

//   useEffect(() => {
//     loadAttendance();
//   }, [month]);

//   const loadAttendance = async () => {
//     setLoading(true);
//     try {
//       const res = await attendanceService.getMonthlyAttendance(
//         year,
//         monthMap[month]
//       );

//       const formatted = res.data.map((a) => ({
//         rawDate: a.attendanceDate,
//         date: formatDateDDMMYYYY(a.attendanceDate),
//         isToday: isToday(a.attendanceDate),
//         status:
//           a.status === "PRESENT"
//             ? "Present"
//             : a.status === "ABSENT"
//             ? "Absent"
//             : "Late",
//       }));

//       setAttendanceData(formatted);
//     } catch (err) {
//       console.error("Failed to load attendance", err);
//       setAttendanceData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= STATS ================= */

//   const totalDays = attendanceData.length;
//   const presentDays = attendanceData.filter((a) => a.status === "Present").length;
//   const lateDays = attendanceData.filter((a) => a.status === "Late").length;
//   const absentDays = attendanceData.filter((a) => a.status === "Absent").length;

//   const attendancePercentage =
//     totalDays > 0
//       ? (((presentDays + lateDays) / totalDays) * 100).toFixed(1)
//       : 0;

//   /* ================= UI HELPERS ================= */

//   const statusBadge = (status) => {
//     if (status === "Present")
//       return (
//         <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
//           Present
//         </Badge>
//       );
//     if (status === "Late")
//       return (
//         <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
//           Late
//         </Badge>
//       );
//     return (
//       <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
//         Absent
//       </Badge>
//     );
//   };

//   const statusIcon = (status) => {
//     if (status === "Present")
//       return <CheckCircle className="text-emerald-500" size={20} />;
//     if (status === "Late")
//       return <AlertCircle className="text-amber-500" size={20} />;
//     return <XCircle className="text-red-500" size={20} />;
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 dark:bg-slate-950">

//       {/* ================= LIGHT BLUE HERO ================= */}
//       <header
//         className="relative overflow-hidden
//         bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400
//         dark:from-sky-600 dark:via-blue-600 dark:to-indigo-600"
//       >
//         <div className="absolute inset-0 bg-white/10 dark:bg-black/10" />

//         <div className="relative max-w-7xl mx-auto px-6 py-6
//                         flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//           <div>
//             <div className="flex items-center gap-2 mb-1">
//               <div className="p-2 rounded-md bg-white/30 backdrop-blur shadow">
//                 <Calendar className="h-4 w-4 text-white" />
//               </div>
//               <span className="text-xs font-semibold uppercase tracking-wide text-white/90">
//                 Attendance Overview
//               </span>
//             </div>
//             <h1 className="text-2xl font-bold text-white">Attendance</h1>
//             <p className="text-sm text-white/85">
//               Track your monthly attendance and performance
//             </p>
//           </div>

//           <div className="flex gap-3 flex-wrap">
//             <Stat
//               icon={<CheckCircle className="h-4 w-4 text-emerald-300" />}
//               value={`${attendancePercentage}%`}
//             />
//             <Stat
//               icon={<TrendingUp className="h-4 w-4 text-yellow-300" />}
//               value={`${presentDays + lateDays}/${totalDays}`}
//             />
//           </div>
//         </div>
//       </header>

//       {/* ================= CONTENT ================= */}
//       <div className="px-6 py-8 max-w-7xl mx-auto">

//         {/* ================= MONTH SELECT ================= */}
//         <Card className="mb-6 relative z-20">
//           <CardContent className="p-4 flex items-center gap-4">
//             <div className="p-2 rounded-md bg-blue-100 dark:bg-blue-900/30">
//               <Calendar className="text-blue-600 dark:text-blue-400 h-4 w-4" />
//             </div>

//             <Select value={month} onValueChange={setMonth}>
//               <SelectTrigger className="w-[220px] bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700">
//                 <SelectValue placeholder="Select Month" />
//               </SelectTrigger>

//               <SelectContent
//                 position="popper"
//                 side="bottom"
//                 align="start"
//                 className="z-50 bg-white dark:bg-slate-900
//                            text-slate-900 dark:text-slate-100
//                            border border-slate-300 dark:border-slate-700
//                            shadow-xl max-h-64 overflow-y-auto"
//               >
//                 {Object.keys(monthMap).map((m) => (
//                   <SelectItem
//                     key={m}
//                     value={m}
//                     className="cursor-pointer focus:bg-blue-100 dark:focus:bg-blue-900/40"
//                   >
//                     {m} {year}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </CardContent>
//         </Card>

//         {/* ================= STATS ================= */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//           <StatCard icon={<CheckCircle />} value={presentDays} label="Present" />
//           <StatCard icon={<AlertCircle />} value={lateDays} label="Late" />
//           <StatCard icon={<XCircle />} value={absentDays} label="Absent" />
//           <StatCard icon={<BarChart3 />} value={`${attendancePercentage}%`} label="Attendance" />
//         </div>

//         {/* ================= TABLE ================= */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Monthly Attendance</CardTitle>
//           </CardHeader>

//           <CardContent>
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Date</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead>Indicator</TableHead>
//                 </TableRow>
//               </TableHeader>

//               <TableBody>
//                 {loading && (
//                   <TableRow>
//                     <TableCell colSpan={3} className="text-center py-6">
//                       Loading attendance...
//                     </TableCell>
//                   </TableRow>
//                 )}

//                 {!loading && attendanceData.length === 0 && (
//                   <TableRow>
//                     <TableCell colSpan={3} className="text-center py-6">
//                       No attendance records found
//                     </TableCell>
//                   </TableRow>
//                 )}

//                 {!loading &&
//                   attendanceData.map((att, idx) => (
//                     <TableRow
//                       key={idx}
//                       className={
//                         att.isToday
//                           ? "bg-emerald-50 dark:bg-emerald-900/20"
//                           : ""
//                       }
//                     >
//                       <TableCell className="font-semibold">
//                         {att.date}
//                         {att.isToday && (
//                           <Badge className="ml-2 bg-emerald-200 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
//                             Today
//                           </Badge>
//                         )}
//                       </TableCell>
//                       <TableCell>{statusBadge(att.status)}</TableCell>
//                       <TableCell>{statusIcon(att.status)}</TableCell>
//                     </TableRow>
//                   ))}
//               </TableBody>
//             </Table>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default Attendance;

// /* ================= SMALL COMPONENTS ================= */

// const Stat = ({ icon, value }) => (
//   <div className="flex items-center gap-3 px-4 py-2 rounded-xl
//                   bg-white/30 backdrop-blur border border-white/30
//                   text-white shadow">
//     {icon}
//     <span className="text-sm font-semibold">{value}</span>
//   </div>
// );

// const StatCard = ({ icon, value, label }) => (
//   <Card className="p-4 text-center">
//     <div className="mx-auto mb-1 text-blue-600 dark:text-blue-400">
//       {icon}
//     </div>
//     <p className="text-xl font-bold">{value}</p>
//     <p className="text-sm text-muted-foreground">{label}</p>
//   </Card>
// );



























import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import attendanceService from "../services/attendanceService";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

/* ================= DATE HELPERS ================= */

const formatDateDDMMYYYY = (isoDate) => {
  const d = new Date(isoDate);
  return `${String(d.getDate()).padStart(2, "0")}-${String(
    d.getMonth() + 1
  ).padStart(2, "0")}-${d.getFullYear()}`;
};

const isToday = (isoDate) => {
  const today = new Date();
  const d = new Date(isoDate);
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
};

/* ================= MONTH MAP ================= */

const monthMap = {
  January: 1, February: 2, March: 3, April: 4,
  May: 5, June: 6, July: 7, August: 8,
  September: 9, October: 10, November: 11, December: 12,
};

/* ================= COMPONENT ================= */

const Attendance = () => {
  const [month, setMonth] = useState("February");
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);

  const year = new Date().getFullYear();

  /* ================= RESIZABLE PANEL ================= */
  const [leftWidth, setLeftWidth] = useState(62);
  const isDragging = useRef(false);
  const containerRef = useRef(null);

  const onMouseDown = useCallback(() => {
    isDragging.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  const onMouseMove = useCallback((e) => {
    if (!isDragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const newLeft = ((e.clientX - rect.left) / rect.width) * 100;
    if (newLeft > 30 && newLeft < 80) setLeftWidth(newLeft);
  }, []);

  const onMouseUp = useCallback(() => {
    isDragging.current = false;
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  /* ================= DATA ================= */

  useEffect(() => { loadAttendance(); }, [month]);

  const loadAttendance = async () => {
    setLoading(true);
    try {
      const res = await attendanceService.getMonthlyAttendance(year, monthMap[month]);
      const formatted = res.data.map((a) => ({
        rawDate: a.attendanceDate,
        date: formatDateDDMMYYYY(a.attendanceDate),
        isToday: isToday(a.attendanceDate),
        status:
          a.status === "PRESENT" ? "Present"
          : a.status === "ABSENT" ? "Absent"
          : "Late",
      }));
      setAttendanceData(formatted);
    } catch (err) {
      console.error("Failed to load attendance", err);
      setAttendanceData([]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= STATS ================= */

  const totalDays = attendanceData.length;
  const presentDays = attendanceData.filter((a) => a.status === "Present").length;
  const lateDays    = attendanceData.filter((a) => a.status === "Late").length;
  const absentDays  = attendanceData.filter((a) => a.status === "Absent").length;
  const attendancePercentage =
    totalDays > 0 ? (((presentDays + lateDays) / totalDays) * 100).toFixed(1) : 0;

  /* ================= UI HELPERS ================= */

  const statusBadge = (status) => {
    if (status === "Present")
      return <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">Present</Badge>;
    if (status === "Late")
      return <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">Late</Badge>;
    return <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">Absent</Badge>;
  };

  const statusIcon = (status) => {
    if (status === "Present") return <CheckCircle className="text-emerald-500" size={18} />;
    if (status === "Late")    return <AlertCircle className="text-amber-500"  size={18} />;
    return                           <XCircle     className="text-red-500"    size={18} />;
  };

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#0f1b38]">

      {/* ===== PAGE TITLE ===== */}
      <div className="px-6 pt-7 pb-5 max-w-full">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-2 rounded-lg"
                style={{ background: "linear-gradient(135deg,#1e3a8a,#1d4ed8)" }}>
                <Calendar className="h-4 w-4 text-white" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                Attendance Overview
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Attendance</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Track your monthly attendance and performance
            </p>
          </div>

          {/* Month selector */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Calendar className="text-blue-600 dark:text-blue-400 h-4 w-4" />
            </div>
            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger className="w-[200px] bg-white dark:bg-[#162040]
                                        border border-slate-200 dark:border-white/10
                                        text-slate-800 dark:text-white rounded-xl shadow-sm">
                <SelectValue placeholder="Select Month" />
              </SelectTrigger>
              <SelectContent
                position="popper" side="bottom" align="start"
                className="z-50 bg-white dark:bg-[#162040]
                           text-slate-900 dark:text-slate-100
                           border border-slate-200 dark:border-white/10
                           shadow-xl max-h-64 overflow-y-auto rounded-xl"
              >
                {Object.keys(monthMap).map((m) => (
                  <SelectItem key={m} value={m}
                    className="cursor-pointer focus:bg-blue-100 dark:focus:bg-blue-900/40">
                    {m} {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* ===== STAT CARDS ===== */}
      <div className="px-6 pb-5 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: <CheckCircle size={18} />, value: presentDays,            label: "Present",    light: "linear-gradient(135deg,#166534,#16a34a)", dark: "linear-gradient(135deg,#14532d,#166534)" },
            { icon: <AlertCircle size={18} />, value: lateDays,               label: "Late",       light: "linear-gradient(135deg,#92400e,#d97706)", dark: "linear-gradient(135deg,#78350f,#92400e)" },
            { icon: <XCircle     size={18} />, value: absentDays,             label: "Absent",     light: "linear-gradient(135deg,#991b1b,#dc2626)", dark: "linear-gradient(135deg,#7f1d1d,#991b1b)" },
            { icon: <BarChart3   size={18} />, value: `${attendancePercentage}%`, label: "Attendance", light: "linear-gradient(135deg,#1e3a8a,#2563eb)", dark: "linear-gradient(135deg,#1e3a5f,#1d4ed8)" },
          ].map((s, i) => (
            <div key={i} className="rounded-xl px-5 py-4 flex flex-col gap-1 text-white shadow-md"
              style={{ background: s.light }}>
              <span className="text-white/70">{s.icon}</span>
              <span className="text-2xl font-extrabold">{s.value}</span>
              <span className="text-xs text-white/65 uppercase tracking-widest font-semibold">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ===== SPLIT PANEL ===== */}
      <div
        ref={containerRef}
        className="flex mx-6 mb-6 max-w-7xl xl:mx-auto overflow-hidden
                   rounded-2xl border border-slate-200 dark:border-white/10
                   bg-white dark:bg-[#162040] shadow-sm"
        style={{ height: "calc(100vh - 300px)", minHeight: "400px" }}
      >
        {/* ---- LEFT: Table ---- */}
        <div className="flex flex-col overflow-hidden" style={{ width: `${leftWidth}%`, minWidth: "30%" }}>

          {/* Table header bar */}
          <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-100 dark:border-white/10">
            <BarChart3 className="w-4 h-4 text-blue-500 dark:text-blue-400" />
            <span className="text-sm font-bold text-slate-700 dark:text-white tracking-wide">
              Monthly Attendance — {month} {year}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/10">
                  <TableHead className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[11px] tracking-wider">Date</TableHead>
                  <TableHead className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[11px] tracking-wider">Status</TableHead>
                  <TableHead className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[11px] tracking-wider">Indicator</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-10 text-slate-400 dark:text-slate-500 text-sm">
                      Loading attendance...
                    </TableCell>
                  </TableRow>
                )}

                {!loading && attendanceData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-10 text-slate-400 dark:text-slate-500 text-sm">
                      No attendance records found
                    </TableCell>
                  </TableRow>
                )}

                {!loading && attendanceData.map((att, idx) => (
                  <TableRow
                    key={idx}
                    className={`border-b border-slate-50 dark:border-white/5 transition hover:bg-slate-50 dark:hover:bg-white/5
                      ${att.isToday ? "bg-emerald-50 dark:bg-emerald-900/20" : ""}`}
                  >
                    <TableCell className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
                      {att.date}
                      {att.isToday && (
                        <Badge className="ml-2 bg-emerald-200 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 text-[10px]">
                          Today
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{statusBadge(att.status)}</TableCell>
                    <TableCell>{statusIcon(att.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* ---- DRAG HANDLE (CRM style ←|→) ---- */}
        <div
          onMouseDown={onMouseDown}
          className="relative flex-shrink-0 w-3 flex items-center justify-center
                     cursor-col-resize group z-10
                     bg-slate-100 dark:bg-white/5
                     border-x border-slate-200 dark:border-white/10
                     hover:bg-blue-100 dark:hover:bg-blue-900/30 transition"
        >
          <div className="absolute flex items-center gap-0.5
                          px-1.5 py-2 rounded-lg
                          bg-white dark:bg-[#1e3a5f]
                          border border-slate-300 dark:border-white/20
                          shadow group-hover:shadow-blue-300/40 dark:group-hover:shadow-blue-900/60
                          group-hover:border-blue-400 dark:group-hover:border-blue-600
                          transition select-none">
            <svg width="6" height="12" viewBox="0 0 6 12" fill="none"
              className="text-slate-400 dark:text-slate-300 group-hover:text-blue-500 dark:group-hover:text-blue-400">
              <path d="M1 1L0 6L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <div className="w-px h-4 bg-slate-300 dark:bg-slate-500 group-hover:bg-blue-400 transition mx-0.5" />
            <svg width="6" height="12" viewBox="0 0 6 12" fill="none"
              className="text-slate-400 dark:text-slate-300 group-hover:text-blue-500 dark:group-hover:text-blue-400">
              <path d="M5 1L6 6L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
        </div>

        {/* ---- RIGHT: Summary ---- */}
        <div className="flex flex-col overflow-y-auto" style={{ flex: 1, minWidth: "20%" }}>

          <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-100 dark:border-white/10">
            <TrendingUp className="w-4 h-4 text-blue-500 dark:text-blue-400" />
            <span className="text-sm font-bold text-slate-700 dark:text-white tracking-wide">
              Summary
            </span>
          </div>

          <div className="px-5 py-5 space-y-5">

            {/* Attendance % ring placeholder */}
            <div className="rounded-xl p-4 text-center border border-slate-100 dark:border-white/8
                            bg-slate-50 dark:bg-white/5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
                Attendance Rate
              </p>
              <p className="text-4xl font-extrabold text-blue-600 dark:text-blue-400">
                {attendancePercentage}%
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {presentDays + lateDays} of {totalDays} days
              </p>
              {/* Progress bar */}
              <div className="mt-3 h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${attendancePercentage}%`,
                    background: "linear-gradient(90deg,#1d4ed8,#16a34a)",
                  }}
                />
              </div>
            </div>

            {/* Breakdown */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
                Breakdown
              </p>
              <div className="space-y-2">
                {[
                  { label: "Present", value: presentDays, color: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400" },
                  { label: "Late",    value: lateDays,    color: "bg-amber-500",   text: "text-amber-600 dark:text-amber-400" },
                  { label: "Absent",  value: absentDays,  color: "bg-red-500",     text: "text-red-600 dark:text-red-400" },
                ].map((s, i) => (
                  <div key={i} className="flex items-center justify-between
                                          px-3 py-2.5 rounded-xl
                                          bg-slate-50 dark:bg-white/5
                                          border border-slate-100 dark:border-white/8">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${s.color}`} />
                      <span className="text-sm text-slate-600 dark:text-slate-300">{s.label}</span>
                    </div>
                    <span className={`text-sm font-bold ${s.text}`}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Month info */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
                Period
              </p>
              <div className="flex items-center gap-3 px-3 py-3 rounded-xl
                              bg-slate-50 dark:bg-white/5
                              border border-slate-100 dark:border-white/8">
                <div className="p-2 rounded-lg"
                  style={{ background: "linear-gradient(135deg,#1e3a8a,#1d4ed8)" }}>
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">{month} {year}</p>
                  <p className="text-xs text-slate-400">{totalDays} records found</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;