// import React, { useEffect, useRef, useState, useCallback } from "react";
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
//   January: 1, February: 2, March: 3, April: 4,
//   May: 5, June: 6, July: 7, August: 8,
//   September: 9, October: 10, November: 11, December: 12,
// };

// /* ================= COMPONENT ================= */

// const Attendance = () => {
//   const [month, setMonth] = useState("February");
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const year = new Date().getFullYear();

//   /* ================= RESIZABLE PANEL ================= */
//   const [leftWidth, setLeftWidth] = useState(62);
//   const isDragging = useRef(false);
//   const containerRef = useRef(null);

//   const onMouseDown = useCallback(() => {
//     isDragging.current = true;
//     document.body.style.cursor = "col-resize";
//     document.body.style.userSelect = "none";
//   }, []);

//   const onMouseMove = useCallback((e) => {
//     if (!isDragging.current || !containerRef.current) return;
//     const rect = containerRef.current.getBoundingClientRect();
//     const newLeft = ((e.clientX - rect.left) / rect.width) * 100;
//     if (newLeft > 30 && newLeft < 80) setLeftWidth(newLeft);
//   }, []);

//   const onMouseUp = useCallback(() => {
//     isDragging.current = false;
//     document.body.style.cursor = "";
//     document.body.style.userSelect = "";
//   }, []);

//   useEffect(() => {
//     window.addEventListener("mousemove", onMouseMove);
//     window.addEventListener("mouseup", onMouseUp);
//     return () => {
//       window.removeEventListener("mousemove", onMouseMove);
//       window.removeEventListener("mouseup", onMouseUp);
//     };
//   }, [onMouseMove, onMouseUp]);

//   /* ================= DATA ================= */

//   useEffect(() => { loadAttendance(); }, [month]);

//   const loadAttendance = async () => {
//     setLoading(true);
//     try {
//       const res = await attendanceService.getMonthlyAttendance(year, monthMap[month]);
//       const formatted = res.data.map((a) => ({
//         rawDate: a.attendanceDate,
//         date: formatDateDDMMYYYY(a.attendanceDate),
//         isToday: isToday(a.attendanceDate),
//         status:
//           a.status === "PRESENT" ? "Present"
//           : a.status === "ABSENT" ? "Absent"
//           : "Late",
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
//   const lateDays    = attendanceData.filter((a) => a.status === "Late").length;
//   const absentDays  = attendanceData.filter((a) => a.status === "Absent").length;
//   const attendancePercentage =
//     totalDays > 0 ? (((presentDays + lateDays) / totalDays) * 100).toFixed(1) : 0;

//   /* ================= UI HELPERS ================= */

//   const statusBadge = (status) => {
//     if (status === "Present")
//       return <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">Present</Badge>;
//     if (status === "Late")
//       return <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">Late</Badge>;
//     return <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">Absent</Badge>;
//   };

//   const statusIcon = (status) => {
//     if (status === "Present") return <CheckCircle className="text-emerald-500" size={18} />;
//     if (status === "Late")    return <AlertCircle className="text-amber-500"  size={18} />;
//     return                           <XCircle     className="text-red-500"    size={18} />;
//   };

//   /* ============================================================
//      RENDER
//   ============================================================ */

//   return (
//     <div className="min-h-screen bg-slate-100 dark:bg-[#0f1b38]">

//       {/* ===== PAGE TITLE ===== */}
//       <div className="px-6 pt-7 pb-5 max-w-full">
//         <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//           <div>
//             <div className="flex items-center gap-2 mb-1">
//               <div className="p-2 rounded-lg"
//                 style={{ background: "linear-gradient(135deg,#1e3a8a,#1d4ed8)" }}>
//                 <Calendar className="h-4 w-4 text-white" />
//               </div>
//               <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
//                 Attendance Overview
//               </span>
//             </div>
//             <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Attendance</h1>
//             <p className="text-sm text-slate-500 dark:text-slate-400">
//               Track your monthly attendance and performance
//             </p>
//           </div>

//           {/* Month selector */}
//           <div className="flex items-center gap-3">
//             <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
//               <Calendar className="text-blue-600 dark:text-blue-400 h-4 w-4" />
//             </div>
//             <Select value={month} onValueChange={setMonth}>
//               <SelectTrigger className="w-[200px] bg-white dark:bg-[#162040]
//                                         border border-slate-200 dark:border-white/10
//                                         text-slate-800 dark:text-white rounded-xl shadow-sm">
//                 <SelectValue placeholder="Select Month" />
//               </SelectTrigger>
//               <SelectContent
//                 position="popper" side="bottom" align="start"
//                 className="z-50 bg-white dark:bg-[#162040]
//                            text-slate-900 dark:text-slate-100
//                            border border-slate-200 dark:border-white/10
//                            shadow-xl max-h-64 overflow-y-auto rounded-xl"
//               >
//                 {Object.keys(monthMap).map((m) => (
//                   <SelectItem key={m} value={m}
//                     className="cursor-pointer focus:bg-blue-100 dark:focus:bg-blue-900/40">
//                     {m} {year}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//         </div>
//       </div>

//       {/* ===== STAT CARDS ===== */}
//       <div className="px-6 pb-5 max-w-7xl mx-auto">
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           {[
//             { icon: <CheckCircle size={18} />, value: presentDays,            label: "Present",    light: "linear-gradient(135deg,#166534,#16a34a)", dark: "linear-gradient(135deg,#14532d,#166534)" },
//             { icon: <AlertCircle size={18} />, value: lateDays,               label: "Late",       light: "linear-gradient(135deg,#92400e,#d97706)", dark: "linear-gradient(135deg,#78350f,#92400e)" },
//             { icon: <XCircle     size={18} />, value: absentDays,             label: "Absent",     light: "linear-gradient(135deg,#991b1b,#dc2626)", dark: "linear-gradient(135deg,#7f1d1d,#991b1b)" },
//             { icon: <BarChart3   size={18} />, value: `${attendancePercentage}%`, label: "Attendance", light: "linear-gradient(135deg,#1e3a8a,#2563eb)", dark: "linear-gradient(135deg,#1e3a5f,#1d4ed8)" },
//           ].map((s, i) => (
//             <div key={i} className="rounded-xl px-5 py-4 flex flex-col gap-1 text-white shadow-md"
//               style={{ background: s.light }}>
//               <span className="text-white/70">{s.icon}</span>
//               <span className="text-2xl font-extrabold">{s.value}</span>
//               <span className="text-xs text-white/65 uppercase tracking-widest font-semibold">{s.label}</span>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* ===== SPLIT PANEL ===== */}
//       <div
//         ref={containerRef}
//         className="flex mx-6 mb-6 max-w-7xl xl:mx-auto overflow-hidden
//                    rounded-2xl border border-slate-200 dark:border-white/10
//                    bg-white dark:bg-[#162040] shadow-sm"
//         style={{ height: "calc(100vh - 300px)", minHeight: "400px" }}
//       >
//         {/* ---- LEFT: Table ---- */}
//         <div className="flex flex-col overflow-hidden" style={{ width: `${leftWidth}%`, minWidth: "30%" }}>

//           {/* Table header bar */}
//           <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-100 dark:border-white/10">
//             <BarChart3 className="w-4 h-4 text-blue-500 dark:text-blue-400" />
//             <span className="text-sm font-bold text-slate-700 dark:text-white tracking-wide">
//               Monthly Attendance — {month} {year}
//             </span>
//           </div>

//           <div className="flex-1 overflow-y-auto">
//             <Table>
//               <TableHeader>
//                 <TableRow className="bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/10">
//                   <TableHead className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[11px] tracking-wider">Date</TableHead>
//                   <TableHead className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[11px] tracking-wider">Status</TableHead>
//                   <TableHead className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[11px] tracking-wider">Indicator</TableHead>
//                 </TableRow>
//               </TableHeader>

//               <TableBody>
//                 {loading && (
//                   <TableRow>
//                     <TableCell colSpan={3} className="text-center py-10 text-slate-400 dark:text-slate-500 text-sm">
//                       Loading attendance...
//                     </TableCell>
//                   </TableRow>
//                 )}

//                 {!loading && attendanceData.length === 0 && (
//                   <TableRow>
//                     <TableCell colSpan={3} className="text-center py-10 text-slate-400 dark:text-slate-500 text-sm">
//                       No attendance records found
//                     </TableCell>
//                   </TableRow>
//                 )}

//                 {!loading && attendanceData.map((att, idx) => (
//                   <TableRow
//                     key={idx}
//                     className={`border-b border-slate-50 dark:border-white/5 transition hover:bg-slate-50 dark:hover:bg-white/5
//                       ${att.isToday ? "bg-emerald-50 dark:bg-emerald-900/20" : ""}`}
//                   >
//                     <TableCell className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
//                       {att.date}
//                       {att.isToday && (
//                         <Badge className="ml-2 bg-emerald-200 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 text-[10px]">
//                           Today
//                         </Badge>
//                       )}
//                     </TableCell>
//                     <TableCell>{statusBadge(att.status)}</TableCell>
//                     <TableCell>{statusIcon(att.status)}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//         </div>

//         {/* ---- DRAG HANDLE (CRM style ←|→) ---- */}
//         <div
//           onMouseDown={onMouseDown}
//           className="relative flex-shrink-0 w-3 flex items-center justify-center
//                      cursor-col-resize group z-10
//                      bg-slate-100 dark:bg-white/5
//                      border-x border-slate-200 dark:border-white/10
//                      hover:bg-blue-100 dark:hover:bg-blue-900/30 transition"
//         >
//           <div className="absolute flex items-center gap-0.5
//                           px-1.5 py-2 rounded-lg
//                           bg-white dark:bg-[#1e3a5f]
//                           border border-slate-300 dark:border-white/20
//                           shadow group-hover:shadow-blue-300/40 dark:group-hover:shadow-blue-900/60
//                           group-hover:border-blue-400 dark:group-hover:border-blue-600
//                           transition select-none">
//             <svg width="6" height="12" viewBox="0 0 6 12" fill="none"
//               className="text-slate-400 dark:text-slate-300 group-hover:text-blue-500 dark:group-hover:text-blue-400">
//               <path d="M1 1L0 6L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
//             </svg>
//             <div className="w-px h-4 bg-slate-300 dark:bg-slate-500 group-hover:bg-blue-400 transition mx-0.5" />
//             <svg width="6" height="12" viewBox="0 0 6 12" fill="none"
//               className="text-slate-400 dark:text-slate-300 group-hover:text-blue-500 dark:group-hover:text-blue-400">
//               <path d="M5 1L6 6L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
//             </svg>
//           </div>
//         </div>

//         {/* ---- RIGHT: Summary ---- */}
//         <div className="flex flex-col overflow-y-auto" style={{ flex: 1, minWidth: "20%" }}>

//           <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-100 dark:border-white/10">
//             <TrendingUp className="w-4 h-4 text-blue-500 dark:text-blue-400" />
//             <span className="text-sm font-bold text-slate-700 dark:text-white tracking-wide">
//               Summary
//             </span>
//           </div>

//           <div className="px-5 py-5 space-y-5">

//             {/* Attendance % ring placeholder */}
//             <div className="rounded-xl p-4 text-center border border-slate-100 dark:border-white/8
//                             bg-slate-50 dark:bg-white/5">
//               <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
//                 Attendance Rate
//               </p>
//               <p className="text-4xl font-extrabold text-blue-600 dark:text-blue-400">
//                 {attendancePercentage}%
//               </p>
//               <p className="text-xs text-slate-400 mt-1">
//                 {presentDays + lateDays} of {totalDays} days
//               </p>
//               {/* Progress bar */}
//               <div className="mt-3 h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
//                 <div
//                   className="h-full rounded-full transition-all duration-500"
//                   style={{
//                     width: `${attendancePercentage}%`,
//                     background: "linear-gradient(90deg,#1d4ed8,#16a34a)",
//                   }}
//                 />
//               </div>
//             </div>

//             {/* Breakdown */}
//             <div>
//               <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
//                 Breakdown
//               </p>
//               <div className="space-y-2">
//                 {[
//                   { label: "Present", value: presentDays, color: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400" },
//                   { label: "Late",    value: lateDays,    color: "bg-amber-500",   text: "text-amber-600 dark:text-amber-400" },
//                   { label: "Absent",  value: absentDays,  color: "bg-red-500",     text: "text-red-600 dark:text-red-400" },
//                 ].map((s, i) => (
//                   <div key={i} className="flex items-center justify-between
//                                           px-3 py-2.5 rounded-xl
//                                           bg-slate-50 dark:bg-white/5
//                                           border border-slate-100 dark:border-white/8">
//                     <div className="flex items-center gap-2">
//                       <span className={`w-2.5 h-2.5 rounded-full ${s.color}`} />
//                       <span className="text-sm text-slate-600 dark:text-slate-300">{s.label}</span>
//                     </div>
//                     <span className={`text-sm font-bold ${s.text}`}>{s.value}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Month info */}
//             <div>
//               <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
//                 Period
//               </p>
//               <div className="flex items-center gap-3 px-3 py-3 rounded-xl
//                               bg-slate-50 dark:bg-white/5
//                               border border-slate-100 dark:border-white/8">
//                 <div className="p-2 rounded-lg"
//                   style={{ background: "linear-gradient(135deg,#1e3a8a,#1d4ed8)" }}>
//                   <Calendar className="w-4 h-4 text-white" />
//                 </div>
//                 <div>
//                   <p className="text-sm font-bold text-slate-800 dark:text-white">{month} {year}</p>
//                   <p className="text-xs text-slate-400">{totalDays} records found</p>
//                 </div>
//               </div>
//             </div>

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Attendance;




















import React, { useEffect, useRef, useState, useCallback } from "react";
import { Calendar, CheckCircle, XCircle, AlertCircle, TrendingUp, BarChart3, ChevronDown, Check } from "lucide-react";
import attendanceService from "../services/attendanceService";

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
:root{--bg:#f1f5f9;--card:#ffffff;--tx:#0f172a;--mu:#64748b;--bd:#e2e8f0;
  --c1:#22d3ee;--c2:#fb923c;--c3:#34d399;--c4:#a78bfa;--cr:#f87171;
  --sh:0 4px 24px rgba(0,0,0,0.06);--shl:0 8px 40px rgba(0,0,0,0.10);--r:20px;}
.sa-dk{--bg:#0a0a0a;--card:#111111;--tx:#ffffff;--mu:#94a3b8;--bd:rgba(255,255,255,0.06);
  --sh:0 4px 24px rgba(0,0,0,0.40);--shl:0 8px 40px rgba(0,0,0,0.60);}

.sa{font-family:'Poppins',sans-serif;min-height:100vh;background:var(--bg);color:var(--tx);}
.sa-top{padding:24px 24px 20px;max-width:1400px;margin:0 auto;}
.sa-top-row{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-bottom:20px;}
.sa-top-l{display:flex;align-items:center;gap:14px;}
.sa-top-ico{width:52px;height:52px;border-radius:14px;background:rgba(34,211,238,.10);border:1px solid rgba(34,211,238,.18);display:flex;align-items:center;justify-content:center;color:var(--c1);flex-shrink:0;}
.sa-bdg{display:inline-flex;align-items:center;gap:6px;padding:4px 11px;border-radius:50px;border:1px solid var(--bd);background:rgba(34,211,238,.08);color:var(--c1);font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;margin-bottom:6px;}
.sa-h1{font-size:24px;font-weight:800;color:var(--tx);margin:0 0 2px;}
.sa-sub{font-size:13px;color:var(--mu);margin:0;}

/* ── CUSTOM DROPDOWN ── fully themed, no portal ── */
.sa-month-wrap{display:flex;align-items:center;gap:10px;position:relative;}
.sa-month-ico{width:38px;height:38px;border-radius:11px;background:rgba(34,211,238,.10);border:1px solid rgba(34,211,238,.15);display:flex;align-items:center;justify-content:center;color:var(--c1);flex-shrink:0;}
.sa-dd{position:relative;min-width:185px;font-family:'Poppins',sans-serif;}
.sa-dd-btn{display:flex;align-items:center;justify-content:space-between;gap:8px;width:100%;height:42px;padding:0 14px;border-radius:13px;border:1px solid var(--bd);background:var(--card);color:var(--tx);font-family:'Poppins',sans-serif;font-size:13px;font-weight:600;cursor:pointer;user-select:none;box-shadow:var(--sh);transition:border-color .2s,box-shadow .2s;}
.sa-dd-btn:hover{border-color:rgba(34,211,238,.35);}
.sa-dd-btn.open{border-color:var(--c1);box-shadow:0 0 0 3px rgba(34,211,238,.12);}
.sa-dd-chev{flex-shrink:0;color:var(--mu);transition:transform .2s;}
.sa-dd-btn.open .sa-dd-chev{transform:rotate(180deg);}
.sa-dd-menu{position:absolute;top:calc(100% + 6px);left:0;right:0;z-index:9999;background:var(--card);border:1px solid var(--bd);border-radius:14px;box-shadow:var(--shl);overflow:hidden;max-height:256px;overflow-y:auto;animation:sa-fadein .12s ease;}
@keyframes sa-fadein{from{opacity:0;transform:translateY(-5px)}to{opacity:1;transform:translateY(0)}}
.sa-dd-menu::-webkit-scrollbar{width:4px;}
.sa-dd-menu::-webkit-scrollbar-thumb{background:var(--bd);border-radius:4px;}
.sa-dd-opt{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;cursor:pointer;font-family:'Poppins',sans-serif;font-size:13px;font-weight:500;color:var(--tx);transition:background .12s;}
.sa-dd-opt:hover{background:rgba(34,211,238,.06);}
.sa-dd-opt.sel{color:var(--c1);font-weight:700;background:rgba(34,211,238,.06);}

/* ── STAT CARDS ── */
.sa-stats{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:14px;margin-bottom:20px;}
.sa-stat{border-radius:var(--r);padding:18px 20px;color:#fff;position:relative;overflow:hidden;box-shadow:var(--sh);}
.sa-stat::before{content:"";position:absolute;right:-10px;top:-10px;width:56px;height:56px;border-radius:50%;background:rgba(255,255,255,.10);}
.sa-sico{width:30px;height:30px;border-radius:9px;background:rgba(255,255,255,.18);display:flex;align-items:center;justify-content:center;margin-bottom:8px;}
.sa-sv{font-size:26px;font-weight:800;line-height:1;margin-bottom:3px;}
.sa-sl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;opacity:.65;}

/* ── SPLIT PANELS ── */
.sa-panels{display:flex;border-radius:var(--r);border:1px solid var(--bd);background:var(--card);box-shadow:var(--shl);overflow:hidden;margin:0 24px 24px;max-width:1352px;}
.sa-table-panel{display:flex;flex-direction:column;overflow:hidden;min-width:30%;}
.sa-panel-head{display:flex;align-items:center;gap:8px;padding:14px 20px;border-bottom:1px solid var(--bd);flex-shrink:0;background:var(--bg);}
.sa-panel-title{font-size:13px;font-weight:700;color:var(--tx);}
.sa-table-scroll{flex:1;overflow-y:auto;}
.sa-table-scroll::-webkit-scrollbar{width:4px;}
.sa-table-scroll::-webkit-scrollbar-thumb{background:var(--bd);border-radius:4px;}
table.sa-t{width:100%;border-collapse:collapse;font-size:13px;}
.sa-t thead th{padding:12px 18px;text-align:left;font-size:11px;font-weight:700;color:var(--mu);text-transform:uppercase;letter-spacing:.06em;background:var(--bg);border-bottom:1px solid var(--bd);}
.sa-t tbody tr{border-bottom:1px solid var(--bd);transition:background .15s;}
.sa-t tbody tr:last-child{border-bottom:none;}
.sa-t tbody tr:hover{background:rgba(34,211,238,.025);}
.sa-t tbody tr.today{background:rgba(52,211,153,.06);}
.sa-t tbody td{padding:12px 18px;vertical-align:middle;}
.sa-td-date{font-size:13px;font-weight:700;color:var(--tx);display:flex;align-items:center;gap:7px;}
.sa-today-tag{padding:2px 8px;border-radius:6px;background:rgba(52,211,153,.12);border:1px solid rgba(52,211,153,.20);color:var(--c3);font-size:10px;font-weight:800;}
.sa-badge{display:inline-flex;align-items:center;padding:4px 11px;border-radius:8px;font-size:11px;font-weight:700;border:1px solid;}
.sa-badge-present{background:rgba(52,211,153,.10);color:var(--c3);border-color:rgba(52,211,153,.20);}
.sa-badge-late{background:rgba(251,146,60,.10);color:var(--c2);border-color:rgba(251,146,60,.20);}
.sa-badge-absent{background:rgba(248,113,113,.10);color:var(--cr);border-color:rgba(248,113,113,.20);}
.sa-empty-row td{text-align:center;padding:48px 20px;color:var(--mu);font-size:13px;font-weight:500;}

/* drag handle */
.sa-handle{flex-shrink:0;width:12px;display:flex;align-items:center;justify-content:center;cursor:col-resize;background:var(--bg);border-left:1px solid var(--bd);border-right:1px solid var(--bd);transition:background .2s;position:relative;}
.sa-handle:hover{background:rgba(34,211,238,.06);}
.sa-handle-pill{position:absolute;display:flex;align-items:center;gap:2px;padding:6px 5px;border-radius:8px;background:var(--card);border:1px solid var(--bd);box-shadow:var(--sh);transition:border-color .2s,box-shadow .2s;}
.sa-handle:hover .sa-handle-pill{border-color:rgba(34,211,238,.35);box-shadow:0 4px 16px rgba(34,211,238,.12);}
.sa-handle-line{width:1px;height:14px;background:var(--bd);transition:background .2s;}
.sa-handle:hover .sa-handle-line{background:var(--c1);}

/* summary */
.sa-summary{display:flex;flex-direction:column;overflow-y:auto;flex:1;min-width:20%;}
.sa-sum-body{padding:20px;display:flex;flex-direction:column;gap:18px;}
.sa-sum-lbl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--mu);margin:0 0 8px;}
.sa-rate-box{border-radius:14px;padding:18px;text-align:center;background:var(--bg);border:1px solid var(--bd);}
.sa-rate-val{font-size:40px;font-weight:800;color:var(--c1);line-height:1;margin:0 0 4px;}
.sa-rate-sub{font-size:12px;color:var(--mu);margin:0 0 12px;}
.sa-rate-bar{height:8px;border-radius:99px;background:var(--bd);overflow:hidden;}
.sa-rate-fill{height:100%;border-radius:99px;transition:width .5s;}
.sa-breakdown{display:flex;flex-direction:column;gap:8px;}
.sa-brow{display:flex;align-items:center;justify-content:space-between;padding:11px 14px;border-radius:12px;background:var(--bg);border:1px solid var(--bd);}
.sa-brow-l{display:flex;align-items:center;gap:8px;}
.sa-bdot{width:9px;height:9px;border-radius:50%;flex-shrink:0;}
.sa-brow-lbl{font-size:13px;color:var(--mu);}
.sa-brow-val{font-size:13px;font-weight:800;}
.sa-period-card{display:flex;align-items:center;gap:12px;padding:13px 16px;border-radius:13px;background:var(--bg);border:1px solid var(--bd);}
.sa-period-ico{width:36px;height:36px;border-radius:10px;background:rgba(34,211,238,.10);border:1px solid rgba(34,211,238,.15);display:flex;align-items:center;justify-content:center;color:var(--c1);flex-shrink:0;}
.sa-period-name{font-size:13px;font-weight:700;color:var(--tx);margin:0 0 2px;}
.sa-period-sub{font-size:11px;color:var(--mu);margin:0;}
`;

if (!document.getElementById("sa-at-st")) {
  const t = document.createElement("style");
  t.id = "sa-at-st";
  t.textContent = STYLES;
  document.head.appendChild(t);
}

const isDark = () =>
  document.documentElement.classList.contains("dark") ||
  document.body.classList.contains("dark") ||
  window.matchMedia("(prefers-color-scheme: dark)").matches;

const formatDateDDMMYYYY = d => {
  const dt = new Date(d);
  return `${String(dt.getDate()).padStart(2,"0")}-${String(dt.getMonth()+1).padStart(2,"0")}-${dt.getFullYear()}`;
};
const isToday = d => {
  const t = new Date(), dt = new Date(d);
  return dt.getDate()===t.getDate() && dt.getMonth()===t.getMonth() && dt.getFullYear()===t.getFullYear();
};

const monthMap = {
  January:1,February:2,March:3,April:4,May:5,June:6,
  July:7,August:8,September:9,October:10,November:11,December:12,
};

const STAT_GRADS = [
  "linear-gradient(135deg,#064e3b,#059669)",
  "linear-gradient(135deg,#78350f,#d97706)",
  "linear-gradient(135deg,#7f1d1d,#dc2626)",
  "linear-gradient(135deg,#1e3a8a,#2563eb)",
];

/* ─── Custom Dropdown — no portal, inherits CSS vars perfectly ─────────── */
const MonthDropdown = ({ value, onChange, year }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const months = Object.keys(monthMap);

  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="sa-dd" ref={ref}>
      <div className={`sa-dd-btn${open ? " open" : ""}`} onClick={() => setOpen(o => !o)}>
        <span>{value} {year}</span>
        <ChevronDown size={15} className="sa-dd-chev" />
      </div>
      {open && (
        <div className="sa-dd-menu">
          {months.map(m => (
            <div
              key={m}
              className={`sa-dd-opt${value === m ? " sel" : ""}`}
              onClick={() => { onChange(m); setOpen(false); }}
            >
              <span>{m} {year}</span>
              {value === m && <Check size={13} style={{color:"var(--c1)",flexShrink:0}}/>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─── Main ───────────────────────────────────────────────────────────────── */
const StudentAttendance = () => {
  const [month, setMonth] = useState("February");
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dark, setDark] = useState(isDark);
  const year = new Date().getFullYear();
  const [leftWidth, setLeftWidth] = useState(62);
  const isDragging = useRef(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const o = new MutationObserver(() => setDark(isDark()));
    o.observe(document.documentElement, { attributes:true, attributeFilter:["class"] });
    o.observe(document.body, { attributes:true, attributeFilter:["class"] });
    return () => o.disconnect();
  }, []);

  const onMouseDown = useCallback(() => { isDragging.current=true; document.body.style.cursor="col-resize"; document.body.style.userSelect="none"; }, []);
  const onMouseMove = useCallback(e => {
    if (!isDragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const nl = ((e.clientX - rect.left) / rect.width) * 100;
    if (nl > 30 && nl < 80) setLeftWidth(nl);
  }, []);
  const onMouseUp = useCallback(() => { isDragging.current=false; document.body.style.cursor=""; document.body.style.userSelect=""; }, []);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => { window.removeEventListener("mousemove", onMouseMove); window.removeEventListener("mouseup", onMouseUp); };
  }, [onMouseMove, onMouseUp]);

  useEffect(() => { loadAttendance(); }, [month]);

  const loadAttendance = async () => {
    setLoading(true);
    try {
      const res = await attendanceService.getMonthlyAttendance(year, monthMap[month]);
      setAttendanceData(res.data.map(a => ({
        rawDate: a.attendanceDate,
        date: formatDateDDMMYYYY(a.attendanceDate),
        isToday: isToday(a.attendanceDate),
        status: a.status==="PRESENT" ? "Present" : a.status==="ABSENT" ? "Absent" : "Late",
      })));
    } catch (e) { console.error(e); setAttendanceData([]); }
    finally { setLoading(false); }
  };

  const totalDays   = attendanceData.length;
  const presentDays = attendanceData.filter(a => a.status==="Present").length;
  const lateDays    = attendanceData.filter(a => a.status==="Late").length;
  const absentDays  = attendanceData.filter(a => a.status==="Absent").length;
  const pct         = totalDays > 0 ? (((presentDays+lateDays)/totalDays)*100).toFixed(1) : 0;

  const statCards = [
    { icon:<CheckCircle size={16}/>, value:presentDays, label:"Present", grad:STAT_GRADS[0] },
    { icon:<AlertCircle size={16}/>, value:lateDays,    label:"Late",    grad:STAT_GRADS[1] },
    { icon:<XCircle     size={16}/>, value:absentDays,  label:"Absent",  grad:STAT_GRADS[2] },
    { icon:<BarChart3   size={16}/>, value:`${pct}%`,   label:"Rate",    grad:STAT_GRADS[3] },
  ];

  const statusBadge = s => {
    if (s==="Present") return <span className="sa-badge sa-badge-present">Present</span>;
    if (s==="Late")    return <span className="sa-badge sa-badge-late">Late</span>;
    return                    <span className="sa-badge sa-badge-absent">Absent</span>;
  };
  const statusIcon = s => {
    if (s==="Present") return <CheckCircle size={16} style={{color:"var(--c3)"}}/>;
    if (s==="Late")    return <AlertCircle size={16} style={{color:"var(--c2)"}}/>;
    return                     <XCircle    size={16} style={{color:"var(--cr)"}}/>;
  };

  return (
    <div className={`sa${dark ? " sa-dk" : ""}`}>

      <div className="sa-top">
        <div className="sa-top-row">
          <div className="sa-top-l">
            <div className="sa-top-ico"><Calendar size={24}/></div>
            <div>
              <div className="sa-bdg"><Calendar size={10}/> Attendance Overview</div>
              <h1 className="sa-h1">Attendance</h1>
              <p className="sa-sub">Track your monthly attendance and performance</p>
            </div>
          </div>

          <div className="sa-month-wrap">
            <div className="sa-month-ico"><Calendar size={16}/></div>
            {/* Custom dropdown — no shadcn portal — inherits --card/--bd perfectly */}
            <MonthDropdown value={month} onChange={setMonth} year={year} />
          </div>
        </div>

        <div className="sa-stats">
          {statCards.map((s, i) => (
            <div key={i} className="sa-stat" style={{background:s.grad}}>
              <div className="sa-sico">{s.icon}</div>
              <div className="sa-sv">{s.value}</div>
              <div className="sa-sl">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div ref={containerRef} className="sa-panels" style={{height:"calc(100vh - 280px)", minHeight:380}}>

        {/* Table */}
        <div className="sa-table-panel" style={{width:`${leftWidth}%`}}>
          <div className="sa-panel-head">
            <BarChart3 size={15} style={{color:"var(--c1)"}}/>
            <span className="sa-panel-title">Monthly Attendance — {month} {year}</span>
          </div>
          <div className="sa-table-scroll">
            <table className="sa-t">
              <thead><tr><th>Date</th><th>Status</th><th>Indicator</th></tr></thead>
              <tbody>
                {loading && <tr className="sa-empty-row"><td colSpan={3}>Loading attendance...</td></tr>}
                {!loading && attendanceData.length===0 && <tr className="sa-empty-row"><td colSpan={3}>No attendance records found</td></tr>}
                {!loading && attendanceData.map((att, idx) => (
                  <tr key={idx} className={att.isToday ? "today" : ""}>
                    <td><div className="sa-td-date">{att.date}{att.isToday && <span className="sa-today-tag">Today</span>}</div></td>
                    <td>{statusBadge(att.status)}</td>
                    <td>{statusIcon(att.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Drag Handle */}
        <div className="sa-handle" onMouseDown={onMouseDown}>
          <div className="sa-handle-pill">
            <svg width="5" height="12" viewBox="0 0 6 12" fill="none">
              <path d="M1 1L0 6L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{color:"var(--mu)"}}/>
            </svg>
            <div className="sa-handle-line"/>
            <svg width="5" height="12" viewBox="0 0 6 12" fill="none">
              <path d="M5 1L6 6L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{color:"var(--mu)"}}/>
            </svg>
          </div>
        </div>

        {/* Summary */}
        <div className="sa-summary">
          <div className="sa-panel-head">
            <TrendingUp size={15} style={{color:"var(--c1)"}}/>
            <span className="sa-panel-title">Summary</span>
          </div>
          <div className="sa-sum-body">
            <div>
              <p className="sa-sum-lbl">Attendance Rate</p>
              <div className="sa-rate-box">
                <p className="sa-rate-val">{pct}%</p>
                <p className="sa-rate-sub">{presentDays+lateDays} of {totalDays} days</p>
                <div className="sa-rate-bar">
                  <div className="sa-rate-fill" style={{width:`${pct}%`, background:"linear-gradient(90deg,var(--c1),var(--c3))"}}/>
                </div>
              </div>
            </div>
            <div>
              <p className="sa-sum-lbl">Breakdown</p>
              <div className="sa-breakdown">
                {[
                  {label:"Present",value:presentDays,dot:"var(--c3)",val:"var(--c3)"},
                  {label:"Late",   value:lateDays,   dot:"var(--c2)",val:"var(--c2)"},
                  {label:"Absent", value:absentDays, dot:"var(--cr)", val:"var(--cr)"},
                ].map((s, i) => (
                  <div key={i} className="sa-brow">
                    <div className="sa-brow-l">
                      <div className="sa-bdot" style={{background:s.dot}}/>
                      <span className="sa-brow-lbl">{s.label}</span>
                    </div>
                    <span className="sa-brow-val" style={{color:s.val}}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="sa-sum-lbl">Period</p>
              <div className="sa-period-card">
                <div className="sa-period-ico"><Calendar size={16}/></div>
                <div>
                  <p className="sa-period-name">{month} {year}</p>
                  <p className="sa-period-sub">{totalDays} records found</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentAttendance;