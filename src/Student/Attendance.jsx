
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
//   const day = String(d.getDate()).padStart(2, "0");
//   const month = String(d.getMonth() + 1).padStart(2, "0");
//   const year = d.getFullYear();
//   return `${day}-${month}-${year}`;
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

//   /* ================= LOAD ATTENDANCE ================= */

//   useEffect(() => {
//     loadAttendance();
//   }, [month]);

//   const loadAttendance = async () => {
//     setLoading(true);
//     try {
//       const res = await attendanceService.getMonthlyAttendance(
//         year,
//         monthMap[month],
//       );

//       const formatted = res.data.map((a) => ({
//         rawDate: a.attendanceDate,
//         date: formatDateDDMMYYYY(a.attendanceDate),
//         isToday: isToday(a.attendanceDate),
//         status:
//           a.status === "PRESENT"
//             ? "Present"
//             : a.status === "ABSENT"
//               ? "Absent"
//               : "Late",
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
//   const presentDays = attendanceData.filter(
//     (a) => a.status === "Present",
//   ).length;
//   const lateDays = attendanceData.filter((a) => a.status === "Late").length;
//   const absentDays = attendanceData.filter((a) => a.status === "Absent").length;

//   const attendancePercentage =
//     totalDays > 0
//       ? (((presentDays + lateDays) / totalDays) * 100).toFixed(1)
//       : 0;

//   /* ================= UI HELPERS ================= */

//   const statusBadge = (status) => {
//     if (status === "Present")
//       return <Badge className="bg-emerald-100 text-emerald-700">Present</Badge>;
//     if (status === "Late")
//       return <Badge className="bg-amber-100 text-amber-700">Late</Badge>;
//     return <Badge className="bg-red-100 text-red-700">Absent</Badge>;
//   };

//   const statusIcon = (status) => {
//     if (status === "Present")
//       return <CheckCircle className="text-emerald-500" size={20} />;
//     if (status === "Late")
//       return <AlertCircle className="text-amber-500" size={20} />;
//     return <XCircle className="text-red-500" size={20} />;
//   };

//   /* ================= UI ================= */

//   return (
//     <div className="min-h-screen bg-slate-50 px-6 py-8 max-w-7xl mx-auto">
//       {/* HEADER */}
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold mb-2">Attendance</h1>
//         <p className="text-slate-600">
//           Track your attendance record month-wise
//         </p>
//       </div>

//       {/* MONTH SELECT */}
//       <Card className="mb-6 p-4">
//         <div className="flex items-center gap-4">
//           <Calendar />
//           <Select value={month} onValueChange={setMonth}>
//             <SelectTrigger className="w-[200px]">
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent>
//               {Object.keys(monthMap).map((m) => (
//                 <SelectItem key={m} value={m}>
//                   {m} {year}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>
//       </Card>

//       {/* STATS */}
//       <div className="grid grid-cols-4 gap-4 mb-6">
//         <Card className="p-4 text-center">
//           <CheckCircle className="mx-auto text-emerald-600" />
//           <p className="text-xl font-bold">{presentDays}</p>
//           <p className="text-sm">Present</p>
//         </Card>

//         <Card className="p-4 text-center">
//           <AlertCircle className="mx-auto text-amber-600" />
//           <p className="text-xl font-bold">{lateDays}</p>
//           <p className="text-sm">Late</p>
//         </Card>

//         <Card className="p-4 text-center">
//           <XCircle className="mx-auto text-red-600" />
//           <p className="text-xl font-bold">{absentDays}</p>
//           <p className="text-sm">Absent</p>
//         </Card>

//         <Card className="p-4 text-center">
//           <BarChart3 className="mx-auto text-blue-600" />
//           <p className="text-xl font-bold">{attendancePercentage}%</p>
//           <p className="text-sm">Attendance</p>
//         </Card>
//       </div>

//       {/* TABLE */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Monthly Attendance</CardTitle>
//         </CardHeader>

//         <CardContent>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Date</TableHead>
//                 <TableHead>Status</TableHead>
//                 <TableHead>Indicator</TableHead>
//               </TableRow>
//             </TableHeader>

//             <TableBody>
//               {loading && (
//                 <TableRow>
//                   <TableCell colSpan={3} className="text-center py-6">
//                     Loading attendance...
//                   </TableCell>
//                 </TableRow>
//               )}

//               {!loading && attendanceData.length === 0 && (
//                 <TableRow>
//                   <TableCell colSpan={3} className="text-center py-6">
//                     No attendance records found
//                   </TableCell>
//                 </TableRow>
//               )}

//               {!loading &&
//                 attendanceData.map((att, idx) => (
//                   <TableRow
//                     key={idx}
//                     className={att.isToday ? "bg-emerald-50" : ""}
//                   >
//                     <TableCell className="font-semibold">
//                       {att.date}
//                       {att.isToday && (
//                         <Badge className="ml-2 bg-emerald-200 text-emerald-800">
//                           Today
//                         </Badge>
//                       )}
//                     </TableCell>
//                     <TableCell>{statusBadge(att.status)}</TableCell>
//                     <TableCell>{statusIcon(att.status)}</TableCell>
//                   </TableRow>
//                 ))}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default Attendance;








import React, { useEffect, useState } from "react";
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
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
};

/* ================= COMPONENT ================= */

const Attendance = () => {
  const [month, setMonth] = useState("February");
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);

  const year = new Date().getFullYear();

  useEffect(() => {
    loadAttendance();
  }, [month]);

  const loadAttendance = async () => {
    setLoading(true);
    try {
      const res = await attendanceService.getMonthlyAttendance(
        year,
        monthMap[month]
      );

      const formatted = res.data.map((a) => ({
        rawDate: a.attendanceDate,
        date: formatDateDDMMYYYY(a.attendanceDate),
        isToday: isToday(a.attendanceDate),
        status:
          a.status === "PRESENT"
            ? "Present"
            : a.status === "ABSENT"
            ? "Absent"
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
  const lateDays = attendanceData.filter((a) => a.status === "Late").length;
  const absentDays = attendanceData.filter((a) => a.status === "Absent").length;

  const attendancePercentage =
    totalDays > 0
      ? (((presentDays + lateDays) / totalDays) * 100).toFixed(1)
      : 0;

  /* ================= UI HELPERS ================= */

  const statusBadge = (status) => {
    if (status === "Present")
      return (
        <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
          Present
        </Badge>
      );
    if (status === "Late")
      return (
        <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
          Late
        </Badge>
      );
    return (
      <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
        Absent
      </Badge>
    );
  };

  const statusIcon = (status) => {
    if (status === "Present")
      return <CheckCircle className="text-emerald-500" size={20} />;
    if (status === "Late")
      return <AlertCircle className="text-amber-500" size={20} />;
    return <XCircle className="text-red-500" size={20} />;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">

      {/* ================= LIGHT BLUE HERO ================= */}
      <header
        className="relative overflow-hidden
        bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400
        dark:from-sky-600 dark:via-blue-600 dark:to-indigo-600"
      >
        <div className="absolute inset-0 bg-white/10 dark:bg-black/10" />

        <div className="relative max-w-7xl mx-auto px-6 py-6
                        flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-2 rounded-md bg-white/30 backdrop-blur shadow">
                <Calendar className="h-4 w-4 text-white" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wide text-white/90">
                Attendance Overview
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white">Attendance</h1>
            <p className="text-sm text-white/85">
              Track your monthly attendance and performance
            </p>
          </div>

          <div className="flex gap-3 flex-wrap">
            <Stat
              icon={<CheckCircle className="h-4 w-4 text-emerald-300" />}
              value={`${attendancePercentage}%`}
            />
            <Stat
              icon={<TrendingUp className="h-4 w-4 text-yellow-300" />}
              value={`${presentDays + lateDays}/${totalDays}`}
            />
          </div>
        </div>
      </header>

      {/* ================= CONTENT ================= */}
      <div className="px-6 py-8 max-w-7xl mx-auto">

        {/* ================= MONTH SELECT ================= */}
        <Card className="mb-6 relative z-20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 rounded-md bg-blue-100 dark:bg-blue-900/30">
              <Calendar className="text-blue-600 dark:text-blue-400 h-4 w-4" />
            </div>

            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger className="w-[220px] bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700">
                <SelectValue placeholder="Select Month" />
              </SelectTrigger>

              <SelectContent
                position="popper"
                side="bottom"
                align="start"
                className="z-50 bg-white dark:bg-slate-900
                           text-slate-900 dark:text-slate-100
                           border border-slate-300 dark:border-slate-700
                           shadow-xl max-h-64 overflow-y-auto"
              >
                {Object.keys(monthMap).map((m) => (
                  <SelectItem
                    key={m}
                    value={m}
                    className="cursor-pointer focus:bg-blue-100 dark:focus:bg-blue-900/40"
                  >
                    {m} {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard icon={<CheckCircle />} value={presentDays} label="Present" />
          <StatCard icon={<AlertCircle />} value={lateDays} label="Late" />
          <StatCard icon={<XCircle />} value={absentDays} label="Absent" />
          <StatCard icon={<BarChart3 />} value={`${attendancePercentage}%`} label="Attendance" />
        </div>

        {/* ================= TABLE ================= */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Attendance</CardTitle>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Indicator</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-6">
                      Loading attendance...
                    </TableCell>
                  </TableRow>
                )}

                {!loading && attendanceData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-6">
                      No attendance records found
                    </TableCell>
                  </TableRow>
                )}

                {!loading &&
                  attendanceData.map((att, idx) => (
                    <TableRow
                      key={idx}
                      className={
                        att.isToday
                          ? "bg-emerald-50 dark:bg-emerald-900/20"
                          : ""
                      }
                    >
                      <TableCell className="font-semibold">
                        {att.date}
                        {att.isToday && (
                          <Badge className="ml-2 bg-emerald-200 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Attendance;

/* ================= SMALL COMPONENTS ================= */

const Stat = ({ icon, value }) => (
  <div className="flex items-center gap-3 px-4 py-2 rounded-xl
                  bg-white/30 backdrop-blur border border-white/30
                  text-white shadow">
    {icon}
    <span className="text-sm font-semibold">{value}</span>
  </div>
);

const StatCard = ({ icon, value, label }) => (
  <Card className="p-4 text-center">
    <div className="mx-auto mb-1 text-blue-600 dark:text-blue-400">
      {icon}
    </div>
    <p className="text-xl font-bold">{value}</p>
    <p className="text-sm text-muted-foreground">{label}</p>
  </Card>
);



