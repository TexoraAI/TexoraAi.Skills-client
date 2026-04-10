// import { getTrainerStudents } from "@/services/chatService";
// import { useEffect, useState } from "react";
// import attendanceService from "../services/attendanceService";
// import videoService from "../services/videoService";
// import {
//   AlertCircle,
//   BarChart3,
//   Calendar,
//   CheckCircle,
//   ChevronDown,
//   Search,
//   UserCheck,
//   Users,
//   XCircle,
// } from "lucide-react";

// // ── ALL ORIGINAL LOGIC UNCHANGED ──
// const todayISO = new Date().toISOString().split("T")[0];

// const formatDate = (dateStr) =>
//   new Date(dateStr).toLocaleDateString("en-US", {
//     weekday: "long",
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   });

// const STATUS_CONFIG = {
//   PRESENT: {
//     label: "Present",
//     icon: CheckCircle,
//     pill: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800",
//     btn: "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/25",
//     dot: "#10b981",
//   },
//   ABSENT: {
//     label: "Absent",
//     icon: XCircle,
//     pill: "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800",
//     btn: "bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/25",
//     dot: "#f43f5e",
//   },
//   LATE: {
//     label: "Late",
//     icon: AlertCircle,
//     pill: "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800",
//     btn: "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/25",
//     dot: "#f59e0b",
//   },
// };

// const Attendance = () => {
//   const [students, setStudents] = useState([]);
//   const [batches, setBatches] = useState([]);
//   const [batchId, setBatchId] = useState(null);
//   const [saving, setSaving] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filterStatus, setFilterStatus] = useState("All");
//   const [showSuccess, setShowSuccess] = useState(false);

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

//   useEffect(() => {
//     if (!batchId) { setStudents([]); return; }
//     const loadStudents = async () => {
//       try {
//         const res = await getTrainerStudents(batchId);
//         const mappedStudents = res.data.map((email, index) => ({
//           userId: index + 1,
//           email,
//           name: email.split("@")[0],
//           status: "PRESENT",
//           batchId,
//         }));
//         setStudents(mappedStudents);
//       } catch (err) {
//         console.error("Failed to load batch students", err);
//         setStudents([]);
//       }
//     };
//     loadStudents();
//   }, [batchId]);

//   const updateStatus = (index, status) => {
//     const copy = [...students];
//     copy[index].status = status;
//     setStudents(copy);
//   };

//   const markAll = (status) => setStudents(students.map((s) => ({ ...s, status })));

//   const submitAttendance = async () => {
//     try {
//       setSaving(true);
//       await attendanceService.markAttendance({
//         batchId,
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
//       alert("Failed to mark attendance");
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

//   const selectedBatch = batches.find((b) => b.id === batchId);

//   const inputCls = `w-full rounded-xl px-3 py-2.5 text-sm
//     bg-white dark:bg-white/[0.04]
//     border border-slate-200 dark:border-white/[0.08]
//     text-slate-800 dark:text-slate-100
//     placeholder-slate-300 dark:placeholder-slate-600
//     focus:outline-none focus:ring-2 focus:ring-blue-500/25
//     focus:border-blue-400/60 dark:focus:border-blue-500/50
//     transition duration-150`;

//   return (
//     <>
//       <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');`}</style>

//       <div
//         style={{ fontFamily: "'Poppins', sans-serif" }}
//         className="min-h-screen bg-[#f0f4f9] dark:bg-[#0b1428]"
//       >
//         <div style={{ maxWidth: 1300, margin: "0 auto", padding: 24 }}>

//           {/* ── HEADER ── */}
//           <div className="flex items-start justify-between mb-6">
//             <div className="flex items-center gap-3">
//               <div
//                 className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/20"
//                 style={{ background: "linear-gradient(135deg,#1e3a8a,#2563eb)" }}
//               >
//                 <UserCheck className="w-5 h-5 text-white" />
//               </div>
//               <div>
//                 <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500 mb-0.5">
//                   Attendance Management
//                 </p>
//                 <h1 className="text-xl font-black text-slate-800 dark:text-white leading-tight">
//                   Today's Attendance
//                 </h1>
//                 <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-0.5">
//                   <Calendar className="w-3 h-3" /> {formatDate(todayISO)}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* ── SUCCESS TOAST ── */}
//           {showSuccess && (
//             <div className="mb-4 px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/25 border border-emerald-200 dark:border-emerald-700/40 flex items-center gap-2 shadow-sm">
//               <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
//               <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
//                 Attendance submitted successfully!
//               </p>
//             </div>
//           )}

//           {/* ── STAT CARDS ── */}
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//             {[
//               { label: "Students", value: students.length,        icon: Users,       gradient: "linear-gradient(135deg,#312e81,#6366f1)" },
//               { label: "Present",  value: presentCount,           icon: CheckCircle, gradient: "linear-gradient(135deg,#064e3b,#059669)" },
//               { label: "Absent",   value: absentCount,            icon: XCircle,     gradient: "linear-gradient(135deg,#7f1d1d,#dc2626)" },
//               { label: "Rate",     value: `${attendanceRate.toFixed(0)}%`, icon: BarChart3, gradient: "linear-gradient(135deg,#78350f,#d97706)" },
//             ].map(({ label, value, icon: Icon, gradient }) => (
//               <div
//                 key={label}
//                 className="relative overflow-hidden rounded-2xl p-5 text-white shadow-lg"
//                 style={{ background: gradient }}
//               >
//                 <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-10 bg-white" />
//                 <div className="absolute -right-1 -bottom-3 w-12 h-12 rounded-full opacity-10 bg-white" />
//                 <div className="relative flex flex-col gap-2">
//                   <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.18)" }}>
//                     <Icon className="w-4 h-4" />
//                   </div>
//                   <p className="text-3xl font-black tracking-tight">{value}</p>
//                   <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-white/60">{label}</p>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* ── BATCH SELECTOR ── */}
//           <div className="rounded-2xl bg-white dark:bg-[#111d35] border border-slate-200/80 dark:border-white/[0.07] shadow-xl shadow-slate-200/60 dark:shadow-black/30 mb-4 px-6 py-5">
//             <div className="flex items-center gap-2.5 mb-3">
//               <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: "rgba(34,211,238,0.15)" }}>
//                 <Users className="w-3.5 h-3.5 text-cyan-500" />
//               </div>
//               <p className="text-sm font-black text-slate-800 dark:text-white">Select Batch</p>
//             </div>
//             <div className="relative">
//               <select
//                 value={batchId || ""}
//                 onChange={(e) => setBatchId(Number(e.target.value))}
//                 className={`${inputCls} appearance-none pr-9`}
//               >
//                 <option value="">— Choose a batch —</option>
//                 {batches.map((b) => (
//                   <option key={b.id} value={b.id}>
//                     {b.name || "Batch"} (ID: {b.id})
//                   </option>
//                 ))}
//               </select>
//               <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
//             </div>
//           </div>

//           {/* ── STUDENT TABLE ── */}
//           {students.length > 0 && (
//             <div className="rounded-2xl bg-white dark:bg-[#111d35] border border-slate-200/80 dark:border-white/[0.07] shadow-xl shadow-slate-200/60 dark:shadow-black/30 overflow-hidden mb-4">

//               {/* toolbar */}
//               <div className="px-6 py-3.5 border-b border-slate-100 dark:border-white/[0.06] bg-slate-50/30 dark:bg-white/[0.01] flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
//                 <div className="flex items-center gap-2.5">
//                   <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: "rgba(34,211,238,0.15)" }}>
//                     <Users className="w-3.5 h-3.5 text-cyan-500" />
//                   </div>
//                   <div>
//                     <p className="text-sm font-black text-slate-800 dark:text-white leading-tight">
//                       {selectedBatch?.name || `Batch ${batchId}`}
//                     </p>
//                     <p className="text-[10px] text-slate-400 dark:text-slate-500">{students.length} students</p>
//                   </div>
//                 </div>

//                 <div className="flex gap-2 flex-wrap items-center">
//                   {/* search */}
//                   <div className="relative">
//                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
//                     <input
//                       placeholder="Search..."
//                       value={searchQuery}
//                       onChange={(e) => setSearchQuery(e.target.value)}
//                       className="rounded-xl pl-9 pr-3 py-2 text-xs w-36 bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] text-slate-800 dark:text-slate-100 placeholder-slate-300 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/25 transition"
//                     />
//                   </div>

//                   {/* filter pills */}
//                   {["All", "PRESENT", "ABSENT", "LATE"].map((s) => (
//                     <button
//                       key={s}
//                       onClick={() => setFilterStatus(s)}
//                       className={`px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-[0.98] ${
//                         filterStatus === s
//                           ? "text-white shadow-md"
//                           : "bg-white dark:bg-white/[0.06] border border-slate-200 dark:border-white/[0.08] text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10"
//                       }`}
//                       style={filterStatus === s ? { background: "linear-gradient(135deg,#1e3a8a,#2563eb)" } : {}}
//                     >
//                       {s === "All" ? "All" : s[0] + s.slice(1).toLowerCase()}
//                     </button>
//                   ))}

//                   {/* mark all */}
//                   <div className="flex gap-1.5">
//                     {["PRESENT", "ABSENT", "LATE"].map((s) => (
//                       <button
//                         key={s}
//                         onClick={() => markAll(s)}
//                         className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition shadow-sm ${STATUS_CONFIG[s].btn}`}
//                       >
//                         All {s[0] + s.slice(1).toLowerCase()}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               {/* progress bar */}
//               <div className="px-6 py-2 border-b border-slate-100 dark:border-white/[0.06] flex items-center gap-3">
//                 <div className="flex-1 h-1.5 rounded-full bg-slate-100 dark:bg-white/[0.05] overflow-hidden flex">
//                   <div
//                     className="h-full bg-emerald-500 transition-all duration-500"
//                     style={{ width: `${students.length ? (presentCount / students.length) * 100 : 0}%` }}
//                   />
//                   <div
//                     className="h-full bg-amber-400 transition-all duration-500"
//                     style={{ width: `${students.length ? (lateCount / students.length) * 100 : 0}%` }}
//                   />
//                   <div
//                     className="h-full bg-rose-400 transition-all duration-500"
//                     style={{ width: `${students.length ? (absentCount / students.length) * 100 : 0}%` }}
//                   />
//                 </div>
//                 <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 flex-shrink-0">
//                   {attendanceRate.toFixed(0)}% present
//                 </span>
//               </div>

//               {/* student rows */}
//               <div className="divide-y divide-slate-100 dark:divide-white/[0.05]">
//                 {filteredStudents.length === 0 ? (
//                   <div className="py-12 text-center">
//                     <p className="text-sm font-semibold text-slate-400 dark:text-slate-500">
//                       No students match your filter
//                     </p>
//                   </div>
//                 ) : (
//                   filteredStudents.map((s) => {
//                     const cfg = STATUS_CONFIG[s.status];
//                     const Icon = cfg.icon;
//                     const realIndex = students.findIndex((st) => st.userId === s.userId);
//                     return (
//                       <div
//                         key={s.userId}
//                         className="flex items-center gap-3 px-6 py-3 hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors group"
//                       >
//                         {/* avatar */}
//                         <div
//                           className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-black text-white"
//                           style={{
//                             background: `linear-gradient(135deg,${cfg.dot}cc,${cfg.dot}88)`,
//                             boxShadow: `0 1px 4px ${cfg.dot}40`,
//                           }}
//                         >
//                           {s.name.charAt(0).toUpperCase()}
//                         </div>

//                         {/* name + email */}
//                         <div className="flex-1 min-w-0">
//                           <p className="text-sm font-bold text-slate-800 dark:text-white truncate capitalize">
//                             {s.name}
//                           </p>
//                           <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">{s.email}</p>
//                         </div>

//                         {/* status pill */}
//                         <div className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-xl flex-shrink-0 ${cfg.pill}`}>
//                           <Icon className="w-3 h-3" />
//                           {cfg.label}
//                         </div>

//                         {/* toggle buttons */}
//                         <div className="flex gap-1 flex-shrink-0">
//                           {["PRESENT", "ABSENT", "LATE"].map((st) => (
//                             <button
//                               key={st}
//                               onClick={() => updateStatus(realIndex, st)}
//                               className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all text-xs font-black ${
//                                 s.status === st
//                                   ? `${STATUS_CONFIG[st].btn} shadow-sm`
//                                   : "bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10"
//                               }`}
//                               title={st[0] + st.slice(1).toLowerCase()}
//                             >
//                               {st === "PRESENT" ? "P" : st === "ABSENT" ? "A" : "L"}
//                             </button>
//                           ))}
//                         </div>
//                       </div>
//                     );
//                   })
//                 )}
//               </div>

//               {/* footer submit */}
//               <div className="px-6 py-4 border-t border-slate-100 dark:border-white/[0.06] bg-slate-50/30 dark:bg-white/[0.01] flex items-center justify-between flex-wrap gap-3">
//                 <div className="flex items-center gap-4 text-xs font-bold">
//                   <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
//                     <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
//                     {presentCount} Present
//                   </span>
//                   <span className="flex items-center gap-1.5 text-rose-500 dark:text-rose-400">
//                     <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
//                     {absentCount} Absent
//                   </span>
//                   <span className="flex items-center gap-1.5 text-amber-500 dark:text-amber-400">
//                     <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
//                     {lateCount} Late
//                   </span>
//                 </div>
//                 <button
//                   onClick={submitAttendance}
//                   disabled={saving}
//                   className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black text-white disabled:opacity-60 hover:opacity-90 active:scale-[0.98] transition shadow-md"
//                   style={{ background: "linear-gradient(135deg,#1e3a8a,#2563eb)" }}
//                 >
//                   {saving ? (
//                     <>
//                       <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
//                       Saving…
//                     </>
//                   ) : (
//                     <>
//                       <CheckCircle className="w-3.5 h-3.5" />
//                       Submit Attendance ({students.length})
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* ── EMPTY (no batch selected) ── */}
//           {!batchId && (
//             <div className="rounded-2xl bg-white dark:bg-[#111d35] border border-slate-200/80 dark:border-white/[0.07] shadow-xl shadow-slate-200/60 dark:shadow-black/30 flex flex-col items-center justify-center py-20 px-6 text-center gap-4">
//               <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-slate-100 dark:bg-white/[0.04]">
//                 <UserCheck className="w-7 h-7 text-slate-300 dark:text-slate-600" />
//               </div>
//               <p className="text-sm font-black text-slate-800 dark:text-white">
//                 Select a Batch to Begin
//               </p>
//               <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs leading-relaxed">
//                 Choose a batch from the dropdown above to load students and mark today's attendance.
//               </p>
//             </div>
//           )}

//         </div>
//       </div>
//     </>
//   );
// };

// export default Attendance;






































import { getTrainerStudents } from "@/services/chatService";
import { useEffect, useState } from "react";
import attendanceService from "../services/attendanceService";
import videoService from "../services/videoService";
import {
  AlertCircle, BarChart3, Calendar, CheckCircle,
  ChevronDown, Search, UserCheck, Users, XCircle,
} from "lucide-react";

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
:root{--bg:#f1f5f9;--card:#ffffff;--tx:#0f172a;--mu:#64748b;--bd:#e2e8f0;
  --c1:#22d3ee;--c2:#fb923c;--c3:#34d399;--c4:#a78bfa;--cr:#f87171;
  --sh:0 4px 24px rgba(0,0,0,0.06);--shl:0 8px 40px rgba(0,0,0,0.10);--r:20px;}
.at-dk{--bg:#0a0a0a;--card:#111111;--tx:#ffffff;--mu:#94a3b8;--bd:rgba(255,255,255,0.06);
  --sh:0 4px 24px rgba(0,0,0,0.40);--shl:0 8px 40px rgba(0,0,0,0.60);}
.at{font-family:'Poppins',sans-serif;min-height:100vh;background:var(--bg);color:var(--tx);padding:24px;box-sizing:border-box;}
.at-in{max-width:1300px;margin:0 auto;display:flex;flex-direction:column;gap:20px;}
.at-hdr{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);padding:28px 32px;box-shadow:var(--sh);display:flex;align-items:center;gap:16px;flex-wrap:wrap;}
.at-ico{width:52px;height:52px;border-radius:14px;background:rgba(34,211,238,.10);border:1px solid rgba(34,211,238,.18);display:flex;align-items:center;justify-content:center;color:var(--c1);flex-shrink:0;}
.at-bdg{display:inline-flex;align-items:center;gap:6px;padding:4px 11px;border-radius:50px;border:1px solid var(--bd);background:rgba(34,211,238,.08);color:var(--c1);font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;margin-bottom:6px;}
.at-h1{font-size:24px;font-weight:800;color:var(--tx);margin:0 0 2px;}
.at-sub{font-size:12px;color:var(--mu);margin:0;display:flex;align-items:center;gap:5px;}
.at-toast{padding:13px 18px;border-radius:14px;background:rgba(52,211,153,.08);border:1px solid rgba(52,211,153,.20);display:flex;align-items:center;gap:10px;color:var(--c3);font-size:13px;font-weight:600;}
.at-stats{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px;}
.at-stat{border-radius:var(--r);padding:20px 22px;color:#fff;position:relative;overflow:hidden;box-shadow:var(--sh);}
.at-stat::before{content:"";position:absolute;right:-12px;top:-12px;width:64px;height:64px;border-radius:50%;background:rgba(255,255,255,.10);}
.at-sico{width:32px;height:32px;border-radius:10px;background:rgba(255,255,255,.18);display:flex;align-items:center;justify-content:center;margin-bottom:10px;}
.at-sv{font-size:28px;font-weight:800;line-height:1;margin-bottom:4px;}
.at-sl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;opacity:.65;}
.at-box{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);padding:22px 26px;box-shadow:var(--sh);}
.at-bhead{display:flex;align-items:center;gap:10px;margin-bottom:14px;}
.at-bico{width:34px;height:34px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.at-btitle{font-size:13px;font-weight:700;color:var(--tx);}
.at-sel{width:100%;padding:12px 40px 12px 14px;border-radius:13px;border:1px solid var(--bd);background:var(--bg);color:var(--tx);font-family:'Poppins',sans-serif;font-size:13px;font-weight:500;outline:none;appearance:none;cursor:pointer;transition:border-color .2s,box-shadow .2s;}
.at-sel:focus{border-color:var(--c1);box-shadow:0 0 0 3px rgba(34,211,238,.12);}
.at-sel-wrap{position:relative;}
.at-sel-wrap svg{position:absolute;right:12px;top:50%;transform:translateY(-50%);pointer-events:none;color:var(--mu);}
.at-tbl-wrap{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);box-shadow:var(--sh);overflow:hidden;}
.at-toolbar{display:flex;align-items:center;justify-content:space-between;padding:16px 22px;border-bottom:1px solid var(--bd);flex-wrap:wrap;gap:12px;}
.at-tl{display:flex;align-items:center;gap:10px;}
.at-tname{font-size:13px;font-weight:700;color:var(--tx);}
.at-tcnt{font-size:11px;color:var(--mu);}
.at-tr{display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
.at-srch{position:relative;}
.at-srch svg{position:absolute;left:10px;top:50%;transform:translateY(-50%);pointer-events:none;color:var(--mu);}
.at-srch input{padding:8px 12px 8px 32px;border-radius:11px;border:1px solid var(--bd);background:var(--bg);color:var(--tx);font-family:'Poppins',sans-serif;font-size:12px;outline:none;width:130px;transition:border-color .2s;}
.at-srch input:focus{border-color:var(--c1);}
.at-srch input::placeholder{color:var(--mu);}
.at-fpill{padding:7px 14px;border-radius:10px;border:1px solid var(--bd);background:transparent;color:var(--mu);font-family:'Poppins',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:all .15s;}
.at-fpill:hover{border-color:rgba(34,211,238,.30);color:var(--c1);}
.at-fpill.on{color:white;}
.at-mpill{padding:7px 12px;border-radius:10px;font-family:'Poppins',sans-serif;font-size:12px;font-weight:700;cursor:pointer;border:none;transition:opacity .2s,transform .15s;}
.at-mpill:hover{opacity:.85;transform:translateY(-1px);}
.at-prog{display:flex;align-items:center;gap:12px;padding:10px 22px;border-bottom:1px solid var(--bd);}
.at-prog-bar{flex:1;height:6px;border-radius:99px;background:var(--bd);overflow:hidden;display:flex;}
.at-prog-seg{height:100%;transition:width .5s;}
.at-pct{font-size:11px;font-weight:700;color:var(--mu);flex-shrink:0;}
.at-rows{divide-y:1px solid var(--bd);}
.at-row{display:flex;align-items:center;gap:12px;padding:12px 22px;border-bottom:1px solid var(--bd);transition:background .15s;}
.at-row:last-child{border-bottom:none;}
.at-row:hover{background:rgba(34,211,238,.025);}
.at-rav{width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;color:white;flex-shrink:0;}
.at-rname{font-size:13px;font-weight:700;color:var(--tx);margin:0 0 2px;}
.at-remail{font-size:11px;color:var(--mu);margin:0;}
.at-rpill{display:inline-flex;align-items:center;gap:5px;padding:5px 12px;border-radius:9px;font-size:11px;font-weight:700;border:1px solid;flex-shrink:0;}
.at-rtbtn{width:28px;height:28px;border-radius:9px;border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:11px;font-weight:800;font-family:'Poppins',sans-serif;transition:all .15s;}
.at-rtbtn.off{background:var(--bg);border:1px solid var(--bd)!important;color:var(--mu);}
.at-rtbtn.off:hover{background:rgba(34,211,238,.08);}
.at-foot{display:flex;align-items:center;justify-content:space-between;padding:14px 22px;border-top:1px solid var(--bd);flex-wrap:wrap;gap:12px;}
.at-fleg{display:flex;align-items:center;gap:16px;}
.at-fli{display:flex;align-items:center;gap:6px;font-size:12px;font-weight:700;}
.at-fdot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}
.at-sbtn{display:inline-flex;align-items:center;gap:8px;padding:12px 24px;border-radius:13px;border:none;color:white;font-family:'Poppins',sans-serif;font-size:13px;font-weight:800;cursor:pointer;transition:opacity .2s,transform .15s;background:linear-gradient(135deg,#1e3a8a,#2563eb);}
.at-sbtn:hover{opacity:.87;transform:translateY(-1px);}
.at-sbtn:disabled{opacity:.5;cursor:not-allowed;transform:none;}
.at-empty{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);box-shadow:var(--sh);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:80px 20px;gap:12px;text-align:center;}
.at-eico{width:52px;height:52px;border-radius:15px;background:rgba(34,211,238,.10);border:1px solid rgba(34,211,238,.15);display:flex;align-items:center;justify-content:center;color:var(--c1);}
.at-et{font-size:14px;font-weight:700;color:var(--tx);margin:0 0 4px;}
.at-es{font-size:12px;color:var(--mu);max-width:260px;line-height:1.6;margin:0;}
`;
if(!document.getElementById("at-st")){const t=document.createElement("style");t.id="at-st";t.textContent=STYLES;document.head.appendChild(t);}
const isDark=()=>document.documentElement.classList.contains("dark")||document.body.classList.contains("dark")||window.matchMedia("(prefers-color-scheme: dark)").matches;

const todayISO=new Date().toISOString().split("T")[0];
const formatDate=d=>new Date(d).toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"});
const SC={
  PRESENT:{label:"Present",icon:CheckCircle,pill:{background:"rgba(52,211,153,.10)",color:"var(--c3)",borderColor:"rgba(52,211,153,.20)"},btnBg:"var(--c3)",dot:"#10b981"},
  ABSENT: {label:"Absent", icon:XCircle,   pill:{background:"rgba(248,113,113,.10)",color:"var(--cr)",borderColor:"rgba(248,113,113,.20)"},btnBg:"var(--cr)",dot:"#f43f5e"},
  LATE:   {label:"Late",   icon:AlertCircle,pill:{background:"rgba(251,146,60,.10)", color:"var(--c2)",borderColor:"rgba(251,146,60,.20)"},btnBg:"var(--c2)",dot:"#f59e0b"},
};

const Attendance = () => {
  const [students,setStudents]=useState([]);
  const [batches,setBatches]=useState([]);
  const [batchId,setBatchId]=useState(null);
  const [saving,setSaving]=useState(false);
  const [searchQuery,setSearchQuery]=useState("");
  const [filterStatus,setFilterStatus]=useState("All");
  const [showSuccess,setShowSuccess]=useState(false);
  const [dark,setDark]=useState(isDark);

  useEffect(()=>{
    const o=new MutationObserver(()=>setDark(isDark()));
    o.observe(document.documentElement,{attributes:true,attributeFilter:["class"]});
    o.observe(document.body,{attributes:true,attributeFilter:["class"]});
    return()=>o.disconnect();
  },[]);

  useEffect(()=>{
    const load=async()=>{try{const r=await videoService.getTrainerBatches();setBatches(r.data||[]);}catch(e){console.error(e);}};
    load();
  },[]);

  useEffect(()=>{
    if(!batchId){setStudents([]);return;}
    const load=async()=>{
      try{
        const r=await getTrainerStudents(batchId);
        setStudents(r.data.map((email,i)=>({userId:i+1,email,name:email.split("@")[0],status:"PRESENT",batchId})));
      }catch(e){console.error(e);setStudents([]);}
    };
    load();
  },[batchId]);

  const updateStatus=(i,s)=>{const c=[...students];c[i].status=s;setStudents(c);};
  const markAll=s=>setStudents(students.map(st=>({...st,status:s})));
  const submitAttendance=async()=>{
    try{
      setSaving(true);
      await attendanceService.markAttendance({batchId,attendanceDate:todayISO,attendances:students.map(s=>({studentUserId:s.userId,studentEmail:s.email,status:s.status}))});
      setShowSuccess(true);setTimeout(()=>setShowSuccess(false),3000);
    }catch{alert("Failed to mark attendance");}
    finally{setSaving(false);}
  };

  const filtered=students.filter(s=>{
    const q=searchQuery.toLowerCase();
    return(s.name.toLowerCase().includes(q)||s.email.toLowerCase().includes(q))&&(filterStatus==="All"||s.status===filterStatus);
  });
  const presentCount=students.filter(s=>s.status==="PRESENT").length;
  const absentCount=students.filter(s=>s.status==="ABSENT").length;
  const lateCount=students.filter(s=>s.status==="LATE").length;
  const rate=students.length>0?((presentCount+lateCount)/students.length)*100:0;
  const selectedBatch=batches.find(b=>b.id===batchId);

  const statCards=[
    {label:"Students",value:students.length,icon:<Users size={18}/>,bg:"linear-gradient(135deg,#312e81,#6366f1)"},
    {label:"Present", value:presentCount,   icon:<CheckCircle size={18}/>,bg:"linear-gradient(135deg,#064e3b,#059669)"},
    {label:"Absent",  value:absentCount,    icon:<XCircle size={18}/>,   bg:"linear-gradient(135deg,#7f1d1d,#dc2626)"},
    {label:"Rate",    value:`${rate.toFixed(0)}%`,icon:<BarChart3 size={18}/>,bg:"linear-gradient(135deg,#78350f,#d97706)"},
  ];

  return(
    <div className={`at${dark?" at-dk":""}`}>
      <div className="at-in">
        <div className="at-hdr">
          <div className="at-ico"><UserCheck size={24}/></div>
          <div>
            <div className="at-bdg"><UserCheck size={10}/> Attendance Management</div>
            <h1 className="at-h1">Today's Attendance</h1>
            <p className="at-sub"><Calendar size={12}/> {formatDate(todayISO)}</p>
          </div>
        </div>

        {showSuccess&&(
          <div className="at-toast"><CheckCircle size={16}/>Attendance submitted successfully!</div>
        )}

        <div className="at-stats">
          {statCards.map((s,i)=>(
            <div key={i} className="at-stat" style={{background:s.bg}}>
              <div className="at-sico">{s.icon}</div>
              <div className="at-sv">{s.value}</div>
              <div className="at-sl">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Batch selector */}
        <div className="at-box">
          <div className="at-bhead">
            <div className="at-bico" style={{background:"rgba(34,211,238,.10)",color:"var(--c1)"}}><Users size={16}/></div>
            <span className="at-btitle">Select Batch</span>
          </div>
          <div className="at-sel-wrap">
            <select className="at-sel" value={batchId||""} onChange={e=>setBatchId(Number(e.target.value))}>
              <option value="">— Choose a batch —</option>
              {batches.map(b=><option key={b.id} value={b.id}>{b.name||"Batch"} (ID: {b.id})</option>)}
            </select>
            <ChevronDown size={15}/>
          </div>
        </div>

        {/* Table */}
        {students.length>0&&(
          <div className="at-tbl-wrap">
            <div className="at-toolbar">
              <div className="at-tl">
                <div className="at-bico" style={{background:"rgba(34,211,238,.10)",color:"var(--c1)"}}><Users size={15}/></div>
                <div>
                  <div className="at-tname">{selectedBatch?.name||`Batch ${batchId}`}</div>
                  <div className="at-tcnt">{students.length} students</div>
                </div>
              </div>
              <div className="at-tr">
                <div className="at-srch">
                  <Search size={13}/>
                  <input placeholder="Search..." value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}/>
                </div>
                {["All","PRESENT","ABSENT","LATE"].map(s=>(
                  <button key={s} className={`at-fpill${filterStatus===s?" on":""}`}
                    style={filterStatus===s?{background:"linear-gradient(135deg,#1e3a8a,#2563eb)"}:{}}
                    onClick={()=>setFilterStatus(s)}>
                    {s==="All"?"All":s[0]+s.slice(1).toLowerCase()}
                  </button>
                ))}
                {["PRESENT","ABSENT","LATE"].map(s=>(
                  <button key={s} className="at-mpill" style={{background:SC[s].btnBg,color:"#0a0a0a"}} onClick={()=>markAll(s)}>
                    All {s[0]+s.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="at-prog">
              <div className="at-prog-bar">
                <div className="at-prog-seg" style={{width:`${students.length?(presentCount/students.length)*100:0}%`,background:"#10b981"}}/>
                <div className="at-prog-seg" style={{width:`${students.length?(lateCount/students.length)*100:0}%`,background:"#f59e0b"}}/>
                <div className="at-prog-seg" style={{width:`${students.length?(absentCount/students.length)*100:0}%`,background:"#f43f5e"}}/>
              </div>
              <span className="at-pct">{rate.toFixed(0)}% present</span>
            </div>

            <div>
              {filtered.length===0?(
                <div style={{padding:"40px 20px",textAlign:"center",color:"var(--mu)",fontSize:13,fontWeight:600}}>No students match your filter</div>
              ):filtered.map(s=>{
                const cfg=SC[s.status];
                const Icon=cfg.icon;
                const ri=students.findIndex(st=>st.userId===s.userId);
                return(
                  <div key={s.userId} className="at-row">
                    <div className="at-rav" style={{background:`${cfg.dot}cc`}}>{s.name.charAt(0).toUpperCase()}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <p className="at-rname">{s.name}</p>
                      <p className="at-remail">{s.email}</p>
                    </div>
                    <span className="at-rpill" style={cfg.pill}><Icon size={11}/>{cfg.label}</span>
                    <div style={{display:"flex",gap:4,flexShrink:0}}>
                      {["PRESENT","ABSENT","LATE"].map(st=>(
                        <button key={st} className={`at-rtbtn${s.status===st?"":" off"}`}
                          style={s.status===st?{background:SC[st].btnBg,color:"#0a0a0a",border:"none"}:{}}
                          onClick={()=>updateStatus(ri,st)} title={st[0]+st.slice(1).toLowerCase()}>
                          {st==="PRESENT"?"P":st==="ABSENT"?"A":"L"}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="at-foot">
              <div className="at-fleg">
                <div className="at-fli"><div className="at-fdot" style={{background:"#10b981"}}/><span style={{color:"var(--c3)"}}>{presentCount} Present</span></div>
                <div className="at-fli"><div className="at-fdot" style={{background:"#f43f5e"}}/><span style={{color:"var(--cr)"}}>{absentCount} Absent</span></div>
                <div className="at-fli"><div className="at-fdot" style={{background:"#f59e0b"}}/><span style={{color:"var(--c2)"}}>{lateCount} Late</span></div>
              </div>
              <button className="at-sbtn" onClick={submitAttendance} disabled={saving}>
                {saving?(<><div style={{width:14,height:14,border:"2px solid rgba(255,255,255,.4)",borderTopColor:"white",borderRadius:"50%",animation:"at-spin 0.8s linear infinite"}}/> Saving…</>):(<><CheckCircle size={14}/> Submit Attendance ({students.length})</>)}
              </button>
            </div>
          </div>
        )}

        {!batchId&&(
          <div className="at-empty">
            <div className="at-eico"><UserCheck size={26}/></div>
            <p className="at-et">Select a Batch to Begin</p>
            <p className="at-es">Choose a batch from the dropdown above to load students and mark today's attendance.</p>
          </div>
        )}
      </div>
      <style>{`@keyframes at-spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
};
export default Attendance;