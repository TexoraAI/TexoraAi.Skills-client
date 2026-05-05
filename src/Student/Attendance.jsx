// import React, { useEffect, useRef, useState, useCallback } from "react";
// import { Calendar, CheckCircle, XCircle, AlertCircle, TrendingUp, BarChart3, ChevronDown, Check } from "lucide-react";
// import attendanceService from "../services/attendanceService";

// const STYLES = `
// @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
// :root{--bg:#f1f5f9;--card:#ffffff;--tx:#0f172a;--mu:#64748b;--bd:#e2e8f0;
//   --c1:#22d3ee;--c2:#fb923c;--c3:#34d399;--c4:#a78bfa;--cr:#f87171;
//   --sh:0 4px 24px rgba(0,0,0,0.06);--shl:0 8px 40px rgba(0,0,0,0.10);--r:20px;}
// .sa-dk{--bg:#0a0a0a;--card:#111111;--tx:#ffffff;--mu:#94a3b8;--bd:rgba(255,255,255,0.06);
//   --sh:0 4px 24px rgba(0,0,0,0.40);--shl:0 8px 40px rgba(0,0,0,0.60);}

// .sa{font-family:'Poppins',sans-serif;min-height:100vh;background:var(--bg);color:var(--tx);}
// .sa-top{padding:24px 24px 20px;max-width:1400px;margin:0 auto;}
// .sa-top-row{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-bottom:20px;}
// .sa-top-l{display:flex;align-items:center;gap:14px;}
// .sa-top-ico{width:52px;height:52px;border-radius:14px;background:rgba(34,211,238,.10);border:1px solid rgba(34,211,238,.18);display:flex;align-items:center;justify-content:center;color:var(--c1);flex-shrink:0;}
// .sa-bdg{display:inline-flex;align-items:center;gap:6px;padding:4px 11px;border-radius:50px;border:1px solid var(--bd);background:rgba(34,211,238,.08);color:var(--c1);font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;margin-bottom:6px;}
// .sa-h1{font-size:24px;font-weight:800;color:var(--tx);margin:0 0 2px;}
// .sa-sub{font-size:13px;color:var(--mu);margin:0;}

// /* ── CUSTOM DROPDOWN ── fully themed, no portal ── */
// .sa-month-wrap{display:flex;align-items:center;gap:10px;position:relative;}
// .sa-month-ico{width:38px;height:38px;border-radius:11px;background:rgba(34,211,238,.10);border:1px solid rgba(34,211,238,.15);display:flex;align-items:center;justify-content:center;color:var(--c1);flex-shrink:0;}
// .sa-dd{position:relative;min-width:185px;font-family:'Poppins',sans-serif;}
// .sa-dd-btn{display:flex;align-items:center;justify-content:space-between;gap:8px;width:100%;height:42px;padding:0 14px;border-radius:13px;border:1px solid var(--bd);background:var(--card);color:var(--tx);font-family:'Poppins',sans-serif;font-size:13px;font-weight:600;cursor:pointer;user-select:none;box-shadow:var(--sh);transition:border-color .2s,box-shadow .2s;}
// .sa-dd-btn:hover{border-color:rgba(34,211,238,.35);}
// .sa-dd-btn.open{border-color:var(--c1);box-shadow:0 0 0 3px rgba(34,211,238,.12);}
// .sa-dd-chev{flex-shrink:0;color:var(--mu);transition:transform .2s;}
// .sa-dd-btn.open .sa-dd-chev{transform:rotate(180deg);}
// .sa-dd-menu{position:absolute;top:calc(100% + 6px);left:0;right:0;z-index:9999;background:var(--card);border:1px solid var(--bd);border-radius:14px;box-shadow:var(--shl);overflow:hidden;max-height:256px;overflow-y:auto;animation:sa-fadein .12s ease;}
// @keyframes sa-fadein{from{opacity:0;transform:translateY(-5px)}to{opacity:1;transform:translateY(0)}}
// .sa-dd-menu::-webkit-scrollbar{width:4px;}
// .sa-dd-menu::-webkit-scrollbar-thumb{background:var(--bd);border-radius:4px;}
// .sa-dd-opt{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;cursor:pointer;font-family:'Poppins',sans-serif;font-size:13px;font-weight:500;color:var(--tx);transition:background .12s;}
// .sa-dd-opt:hover{background:rgba(34,211,238,.06);}
// .sa-dd-opt.sel{color:var(--c1);font-weight:700;background:rgba(34,211,238,.06);}

// /* ── STAT CARDS ── */
// .sa-stats{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:14px;margin-bottom:20px;}
// .sa-stat{border-radius:var(--r);padding:18px 20px;color:#fff;position:relative;overflow:hidden;box-shadow:var(--sh);}
// .sa-stat::before{content:"";position:absolute;right:-10px;top:-10px;width:56px;height:56px;border-radius:50%;background:rgba(255,255,255,.10);}
// .sa-sico{width:30px;height:30px;border-radius:9px;background:rgba(255,255,255,.18);display:flex;align-items:center;justify-content:center;margin-bottom:8px;}
// .sa-sv{font-size:26px;font-weight:800;line-height:1;margin-bottom:3px;}
// .sa-sl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;opacity:.65;}

// /* ── SPLIT PANELS ── */
// .sa-panels{display:flex;border-radius:var(--r);border:1px solid var(--bd);background:var(--card);box-shadow:var(--shl);overflow:hidden;margin:0 24px 24px;max-width:1352px;}
// .sa-table-panel{display:flex;flex-direction:column;overflow:hidden;min-width:30%;}
// .sa-panel-head{display:flex;align-items:center;gap:8px;padding:14px 20px;border-bottom:1px solid var(--bd);flex-shrink:0;background:var(--bg);}
// .sa-panel-title{font-size:13px;font-weight:700;color:var(--tx);}
// .sa-table-scroll{flex:1;overflow-y:auto;}
// .sa-table-scroll::-webkit-scrollbar{width:4px;}
// .sa-table-scroll::-webkit-scrollbar-thumb{background:var(--bd);border-radius:4px;}
// table.sa-t{width:100%;border-collapse:collapse;font-size:13px;}
// .sa-t thead th{padding:12px 18px;text-align:left;font-size:11px;font-weight:700;color:var(--mu);text-transform:uppercase;letter-spacing:.06em;background:var(--bg);border-bottom:1px solid var(--bd);}
// .sa-t tbody tr{border-bottom:1px solid var(--bd);transition:background .15s;}
// .sa-t tbody tr:last-child{border-bottom:none;}
// .sa-t tbody tr:hover{background:rgba(34,211,238,.025);}
// .sa-t tbody tr.today{background:rgba(52,211,153,.06);}
// .sa-t tbody td{padding:12px 18px;vertical-align:middle;}
// .sa-td-date{font-size:13px;font-weight:700;color:var(--tx);display:flex;align-items:center;gap:7px;}
// .sa-today-tag{padding:2px 8px;border-radius:6px;background:rgba(52,211,153,.12);border:1px solid rgba(52,211,153,.20);color:var(--c3);font-size:10px;font-weight:800;}
// .sa-badge{display:inline-flex;align-items:center;padding:4px 11px;border-radius:8px;font-size:11px;font-weight:700;border:1px solid;}
// .sa-badge-present{background:rgba(52,211,153,.10);color:var(--c3);border-color:rgba(52,211,153,.20);}
// .sa-badge-late{background:rgba(251,146,60,.10);color:var(--c2);border-color:rgba(251,146,60,.20);}
// .sa-badge-absent{background:rgba(248,113,113,.10);color:var(--cr);border-color:rgba(248,113,113,.20);}
// .sa-empty-row td{text-align:center;padding:48px 20px;color:var(--mu);font-size:13px;font-weight:500;}

// /* drag handle */
// .sa-handle{flex-shrink:0;width:12px;display:flex;align-items:center;justify-content:center;cursor:col-resize;background:var(--bg);border-left:1px solid var(--bd);border-right:1px solid var(--bd);transition:background .2s;position:relative;}
// .sa-handle:hover{background:rgba(34,211,238,.06);}
// .sa-handle-pill{position:absolute;display:flex;align-items:center;gap:2px;padding:6px 5px;border-radius:8px;background:var(--card);border:1px solid var(--bd);box-shadow:var(--sh);transition:border-color .2s,box-shadow .2s;}
// .sa-handle:hover .sa-handle-pill{border-color:rgba(34,211,238,.35);box-shadow:0 4px 16px rgba(34,211,238,.12);}
// .sa-handle-line{width:1px;height:14px;background:var(--bd);transition:background .2s;}
// .sa-handle:hover .sa-handle-line{background:var(--c1);}

// /* summary */
// .sa-summary{display:flex;flex-direction:column;overflow-y:auto;flex:1;min-width:20%;}
// .sa-sum-body{padding:20px;display:flex;flex-direction:column;gap:18px;}
// .sa-sum-lbl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--mu);margin:0 0 8px;}
// .sa-rate-box{border-radius:14px;padding:18px;text-align:center;background:var(--bg);border:1px solid var(--bd);}
// .sa-rate-val{font-size:40px;font-weight:800;color:var(--c1);line-height:1;margin:0 0 4px;}
// .sa-rate-sub{font-size:12px;color:var(--mu);margin:0 0 12px;}
// .sa-rate-bar{height:8px;border-radius:99px;background:var(--bd);overflow:hidden;}
// .sa-rate-fill{height:100%;border-radius:99px;transition:width .5s;}
// .sa-breakdown{display:flex;flex-direction:column;gap:8px;}
// .sa-brow{display:flex;align-items:center;justify-content:space-between;padding:11px 14px;border-radius:12px;background:var(--bg);border:1px solid var(--bd);}
// .sa-brow-l{display:flex;align-items:center;gap:8px;}
// .sa-bdot{width:9px;height:9px;border-radius:50%;flex-shrink:0;}
// .sa-brow-lbl{font-size:13px;color:var(--mu);}
// .sa-brow-val{font-size:13px;font-weight:800;}
// .sa-period-card{display:flex;align-items:center;gap:12px;padding:13px 16px;border-radius:13px;background:var(--bg);border:1px solid var(--bd);}
// .sa-period-ico{width:36px;height:36px;border-radius:10px;background:rgba(34,211,238,.10);border:1px solid rgba(34,211,238,.15);display:flex;align-items:center;justify-content:center;color:var(--c1);flex-shrink:0;}
// .sa-period-name{font-size:13px;font-weight:700;color:var(--tx);margin:0 0 2px;}
// .sa-period-sub{font-size:11px;color:var(--mu);margin:0;}
// `;

// if (!document.getElementById("sa-at-st")) {
//   const t = document.createElement("style");
//   t.id = "sa-at-st";
//   t.textContent = STYLES;
//   document.head.appendChild(t);
// }

// const isDark = () =>
//   document.documentElement.classList.contains("dark") ||
//   document.body.classList.contains("dark") ||
//   window.matchMedia("(prefers-color-scheme: dark)").matches;

// const formatDateDDMMYYYY = d => {
//   const dt = new Date(d);
//   return `${String(dt.getDate()).padStart(2,"0")}-${String(dt.getMonth()+1).padStart(2,"0")}-${dt.getFullYear()}`;
// };
// const isToday = d => {
//   const t = new Date(), dt = new Date(d);
//   return dt.getDate()===t.getDate() && dt.getMonth()===t.getMonth() && dt.getFullYear()===t.getFullYear();
// };

// const monthMap = {
//   January:1,February:2,March:3,April:4,May:5,June:6,
//   July:7,August:8,September:9,October:10,November:11,December:12,
// };

// const STAT_GRADS = [
//   "linear-gradient(135deg,#064e3b,#059669)",
//   "linear-gradient(135deg,#78350f,#d97706)",
//   "linear-gradient(135deg,#7f1d1d,#dc2626)",
//   "linear-gradient(135deg,#1e3a8a,#2563eb)",
// ];

// /* ─── Custom Dropdown — no portal, inherits CSS vars perfectly ─────────── */
// const MonthDropdown = ({ value, onChange, year }) => {
//   const [open, setOpen] = useState(false);
//   const ref = useRef(null);
//   const months = Object.keys(monthMap);

//   useEffect(() => {
//     const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   return (
//     <div className="sa-dd" ref={ref}>
//       <div className={`sa-dd-btn${open ? " open" : ""}`} onClick={() => setOpen(o => !o)}>
//         <span>{value} {year}</span>
//         <ChevronDown size={15} className="sa-dd-chev" />
//       </div>
//       {open && (
//         <div className="sa-dd-menu">
//           {months.map(m => (
//             <div
//               key={m}
//               className={`sa-dd-opt${value === m ? " sel" : ""}`}
//               onClick={() => { onChange(m); setOpen(false); }}
//             >
//               <span>{m} {year}</span>
//               {value === m && <Check size={13} style={{color:"var(--c1)",flexShrink:0}}/>}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// /* ─── Main ───────────────────────────────────────────────────────────────── */
// const StudentAttendance = () => {
//   const [month, setMonth] = useState("February");
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [dark, setDark] = useState(isDark);
//   const year = new Date().getFullYear();
//   const [leftWidth, setLeftWidth] = useState(62);
//   const isDragging = useRef(false);
//   const containerRef = useRef(null);

//   useEffect(() => {
//     const o = new MutationObserver(() => setDark(isDark()));
//     o.observe(document.documentElement, { attributes:true, attributeFilter:["class"] });
//     o.observe(document.body, { attributes:true, attributeFilter:["class"] });
//     return () => o.disconnect();
//   }, []);

//   const onMouseDown = useCallback(() => { isDragging.current=true; document.body.style.cursor="col-resize"; document.body.style.userSelect="none"; }, []);
//   const onMouseMove = useCallback(e => {
//     if (!isDragging.current || !containerRef.current) return;
//     const rect = containerRef.current.getBoundingClientRect();
//     const nl = ((e.clientX - rect.left) / rect.width) * 100;
//     if (nl > 30 && nl < 80) setLeftWidth(nl);
//   }, []);
//   const onMouseUp = useCallback(() => { isDragging.current=false; document.body.style.cursor=""; document.body.style.userSelect=""; }, []);

//   useEffect(() => {
//     window.addEventListener("mousemove", onMouseMove);
//     window.addEventListener("mouseup", onMouseUp);
//     return () => { window.removeEventListener("mousemove", onMouseMove); window.removeEventListener("mouseup", onMouseUp); };
//   }, [onMouseMove, onMouseUp]);

//   useEffect(() => { loadAttendance(); }, [month]);

//   const loadAttendance = async () => {
//     setLoading(true);
//     try {
//       const res = await attendanceService.getMonthlyAttendance(year, monthMap[month]);
//       setAttendanceData(res.data.map(a => ({
//         rawDate: a.attendanceDate,
//         date: formatDateDDMMYYYY(a.attendanceDate),
//         isToday: isToday(a.attendanceDate),
//         status: a.status==="PRESENT" ? "Present" : a.status==="ABSENT" ? "Absent" : "Late",
//       })));
//     } catch (e) { console.error(e); setAttendanceData([]); }
//     finally { setLoading(false); }
//   };

//   const totalDays   = attendanceData.length;
//   const presentDays = attendanceData.filter(a => a.status==="Present").length;
//   const lateDays    = attendanceData.filter(a => a.status==="Late").length;
//   const absentDays  = attendanceData.filter(a => a.status==="Absent").length;
//   const pct         = totalDays > 0 ? (((presentDays+lateDays)/totalDays)*100).toFixed(1) : 0;

//   const statCards = [
//     { icon:<CheckCircle size={16}/>, value:presentDays, label:"Present", grad:STAT_GRADS[0] },
//     { icon:<AlertCircle size={16}/>, value:lateDays,    label:"Late",    grad:STAT_GRADS[1] },
//     { icon:<XCircle     size={16}/>, value:absentDays,  label:"Absent",  grad:STAT_GRADS[2] },
//     { icon:<BarChart3   size={16}/>, value:`${pct}%`,   label:"Rate",    grad:STAT_GRADS[3] },
//   ];

//   const statusBadge = s => {
//     if (s==="Present") return <span className="sa-badge sa-badge-present">Present</span>;
//     if (s==="Late")    return <span className="sa-badge sa-badge-late">Late</span>;
//     return                    <span className="sa-badge sa-badge-absent">Absent</span>;
//   };
//   const statusIcon = s => {
//     if (s==="Present") return <CheckCircle size={16} style={{color:"var(--c3)"}}/>;
//     if (s==="Late")    return <AlertCircle size={16} style={{color:"var(--c2)"}}/>;
//     return                     <XCircle    size={16} style={{color:"var(--cr)"}}/>;
//   };

//   return (
//     <div className={`sa${dark ? " sa-dk" : ""}`}>

//       <div className="sa-top">
//         <div className="sa-top-row">
//           <div className="sa-top-l">
//             <div className="sa-top-ico"><Calendar size={24}/></div>
//             <div>
//               <div className="sa-bdg"><Calendar size={10}/> Attendance Overview</div>
//               <h1 className="sa-h1">Attendance</h1>
//               <p className="sa-sub">Track your monthly attendance and performance</p>
//             </div>
//           </div>

//           <div className="sa-month-wrap">
//             <div className="sa-month-ico"><Calendar size={16}/></div>
//             {/* Custom dropdown — no shadcn portal — inherits --card/--bd perfectly */}
//             <MonthDropdown value={month} onChange={setMonth} year={year} />
//           </div>
//         </div>

//         <div className="sa-stats">
//           {statCards.map((s, i) => (
//             <div key={i} className="sa-stat" style={{background:s.grad}}>
//               <div className="sa-sico">{s.icon}</div>
//               <div className="sa-sv">{s.value}</div>
//               <div className="sa-sl">{s.label}</div>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div ref={containerRef} className="sa-panels" style={{height:"calc(100vh - 280px)", minHeight:380}}>

//         {/* Table */}
//         <div className="sa-table-panel" style={{width:`${leftWidth}%`}}>
//           <div className="sa-panel-head">
//             <BarChart3 size={15} style={{color:"var(--c1)"}}/>
//             <span className="sa-panel-title">Monthly Attendance — {month} {year}</span>
//           </div>
//           <div className="sa-table-scroll">
//             <table className="sa-t">
//               <thead><tr><th>Date</th><th>Status</th><th>Indicator</th></tr></thead>
//               <tbody>
//                 {loading && <tr className="sa-empty-row"><td colSpan={3}>Loading attendance...</td></tr>}
//                 {!loading && attendanceData.length===0 && <tr className="sa-empty-row"><td colSpan={3}>No attendance records found</td></tr>}
//                 {!loading && attendanceData.map((att, idx) => (
//                   <tr key={idx} className={att.isToday ? "today" : ""}>
//                     <td><div className="sa-td-date">{att.date}{att.isToday && <span className="sa-today-tag">Today</span>}</div></td>
//                     <td>{statusBadge(att.status)}</td>
//                     <td>{statusIcon(att.status)}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Drag Handle */}
//         <div className="sa-handle" onMouseDown={onMouseDown}>
//           <div className="sa-handle-pill">
//             <svg width="5" height="12" viewBox="0 0 6 12" fill="none">
//               <path d="M1 1L0 6L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{color:"var(--mu)"}}/>
//             </svg>
//             <div className="sa-handle-line"/>
//             <svg width="5" height="12" viewBox="0 0 6 12" fill="none">
//               <path d="M5 1L6 6L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{color:"var(--mu)"}}/>
//             </svg>
//           </div>
//         </div>

//         {/* Summary */}
//         <div className="sa-summary">
//           <div className="sa-panel-head">
//             <TrendingUp size={15} style={{color:"var(--c1)"}}/>
//             <span className="sa-panel-title">Summary</span>
//           </div>
//           <div className="sa-sum-body">
//             <div>
//               <p className="sa-sum-lbl">Attendance Rate</p>
//               <div className="sa-rate-box">
//                 <p className="sa-rate-val">{pct}%</p>
//                 <p className="sa-rate-sub">{presentDays+lateDays} of {totalDays} days</p>
//                 <div className="sa-rate-bar">
//                   <div className="sa-rate-fill" style={{width:`${pct}%`, background:"linear-gradient(90deg,var(--c1),var(--c3))"}}/>
//                 </div>
//               </div>
//             </div>
//             <div>
//               <p className="sa-sum-lbl">Breakdown</p>
//               <div className="sa-breakdown">
//                 {[
//                   {label:"Present",value:presentDays,dot:"var(--c3)",val:"var(--c3)"},
//                   {label:"Late",   value:lateDays,   dot:"var(--c2)",val:"var(--c2)"},
//                   {label:"Absent", value:absentDays, dot:"var(--cr)", val:"var(--cr)"},
//                 ].map((s, i) => (
//                   <div key={i} className="sa-brow">
//                     <div className="sa-brow-l">
//                       <div className="sa-bdot" style={{background:s.dot}}/>
//                       <span className="sa-brow-lbl">{s.label}</span>
//                     </div>
//                     <span className="sa-brow-val" style={{color:s.val}}>{s.value}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//             <div>
//               <p className="sa-sum-lbl">Period</p>
//               <div className="sa-period-card">
//                 <div className="sa-period-ico"><Calendar size={16}/></div>
//                 <div>
//                   <p className="sa-period-name">{month} {year}</p>
//                   <p className="sa-period-sub">{totalDays} records found</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default StudentAttendance;


































import React, { useEffect, useRef, useState, useCallback } from "react";
import { Calendar, CheckCircle, XCircle, AlertCircle, TrendingUp, BarChart3, ChevronDown, Check, Sparkles, Activity } from "lucide-react";
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

/* ── HERO SECTION ── overflow visible so dropdown shows ── */
.sa-hero{
  border-radius:24px;
  padding:30px 36px;
  background:var(--card);
  border:1px solid var(--bd);
  position:relative;
  overflow:visible;        /* ← KEY FIX: was hidden, dropdown was clipped */
  margin-bottom:20px;
  box-shadow:var(--sh);
}
.sa-dk .sa-hero{background:#141414;border-color:rgba(255,255,255,0.07);}

/* grid & glow clipped inside a pseudo-wrapper so border-radius still applies visually */
.sa-hero-bg{
  position:absolute;inset:0;
  border-radius:24px;
  overflow:hidden;
  pointer-events:none;
  z-index:0;
}
.sa-hero-grid{
  position:absolute;inset:0;
  opacity:0.025;
  background-image:linear-gradient(rgba(0,0,0,0.12) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.12) 1px,transparent 1px);
  background-size:40px 40px;
}
.sa-dk .sa-hero-grid{opacity:0.04;background-image:linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px);}
.sa-hero-glow{
  position:absolute;top:-30%;left:40%;
  width:300px;height:200px;
  background:radial-gradient(ellipse,rgba(34,211,238,0.06),transparent 70%);
}
.sa-hero-inner{position:relative;z-index:1;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px;}
.sa-hero-eyebrow{display:flex;align-items:center;gap:7px;margin-bottom:10px;}
.sa-hero-eyebrow-txt{font-size:9px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:var(--mu);font-family:'Poppins',sans-serif;}
.sa-hero-title{font-family:'Poppins',sans-serif;font-weight:700;font-size:clamp(1.5rem,3vw,2.2rem);color:#22d3ee;margin:0 0 6px;line-height:1.1;letter-spacing:-0.02em;}
.sa-hero-desc{font-size:12px;color:var(--mu);margin-top:7px;font-weight:500;font-family:'Poppins',sans-serif;}
.sa-hero-right{display:flex;align-items:center;gap:10px;flex-wrap:wrap;}
.sa-hero-stats{display:flex;align-items:center;gap:12px;background:rgba(255,255,255,0.04);border:1px solid var(--bd);border-radius:12px;padding:8px 16px;font-size:11px;font-weight:600;font-family:'Poppins',sans-serif;color:var(--mu);}
.sa-hero-stats-div{width:1px;height:14px;background:var(--bd);}
.sa-hero-act{display:flex;align-items:center;gap:8px;background:rgba(255,255,255,0.04);border:1px solid var(--bd);border-radius:10px;padding:8px 14px;}
.sa-hero-dots{display:flex;gap:3px;align-items:flex-end;height:14px;}
.sa-hero-dot{width:3px;border-radius:2px;background:var(--mu);display:block;}
.sa-live-badge{display:flex;align-items:center;gap:7px;background:rgba(34,211,238,0.08);border:1px solid rgba(34,211,238,0.3);border-radius:999px;padding:8px 18px;color:var(--c1);font-size:11px;font-weight:700;letter-spacing:.1em;font-family:'Poppins',sans-serif;}
.sa-live-dot{width:6px;height:6px;border-radius:50%;background:var(--c1);display:inline-block;}

@keyframes sa-blink{0%,100%{opacity:1}50%{opacity:0.15}}
.sa-d1{animation:sa-blink 1.6s ease infinite;}
.sa-d2{animation:sa-blink 1.6s 0.3s ease infinite;}
.sa-d3{animation:sa-blink 1.6s 0.6s ease infinite;}
@keyframes sa-pulse-ring{0%{box-shadow:0 0 0 0 rgba(34,211,238,0.5)}70%{box-shadow:0 0 0 8px rgba(34,211,238,0)}100%{box-shadow:0 0 0 0 rgba(34,211,238,0)}}
.sa-live-badge{animation:sa-pulse-ring 2.2s ease-out infinite;}

/* ── CUSTOM DROPDOWN ── */
.sa-month-wrap{display:flex;align-items:center;gap:10px;position:relative;}
.sa-month-ico{width:38px;height:38px;border-radius:11px;background:rgba(34,211,238,.10);border:1px solid rgba(34,211,238,.15);display:flex;align-items:center;justify-content:center;color:var(--c1);flex-shrink:0;}
.sa-dd{position:relative;min-width:185px;font-family:'Poppins',sans-serif;}
.sa-dd-btn{display:flex;align-items:center;justify-content:space-between;gap:8px;width:100%;height:42px;padding:0 14px;border-radius:13px;border:1px solid var(--bd);background:var(--card);color:var(--tx);font-family:'Poppins',sans-serif;font-size:13px;font-weight:600;cursor:pointer;user-select:none;box-shadow:var(--sh);transition:border-color .2s,box-shadow .2s;}
.sa-dd-btn:hover{border-color:rgba(34,211,238,.35);}
.sa-dd-btn.open{border-color:var(--c1);box-shadow:0 0 0 3px rgba(34,211,238,.12);}
.sa-dd-chev{flex-shrink:0;color:var(--mu);transition:transform .2s;}
.sa-dd-btn.open .sa-dd-chev{transform:rotate(180deg);}
.sa-dd-menu{
  position:fixed;          /* ← FIXED positioning: escapes all overflow:hidden parents */
  z-index:99999;
  background:var(--card);
  border:1px solid var(--bd);
  border-radius:14px;
  box-shadow:var(--shl);
  overflow:hidden;
  max-height:256px;
  overflow-y:auto;
  animation:sa-fadein .12s ease;
  min-width:185px;
}
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

const isDarkFn = () =>
  document.documentElement.classList.contains("dark") ||
  document.body.classList.contains("dark") ||
  window.matchMedia("(prefers-color-scheme: dark)").matches;

const formatDateDDMMYYYY = d => {
  const dt = new Date(d);
  return `${String(dt.getDate()).padStart(2,"0")}-${String(dt.getMonth()+1).padStart(2,"0")}-${dt.getFullYear()}`;
};
const isTodayFn = d => {
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

/* ─── Custom Dropdown — position:fixed menu to escape overflow:hidden ─── */
const MonthDropdown = ({ value, onChange, year }) => {
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState({});
  const btnRef = useRef(null);
  const ref = useRef(null);
  const months = Object.keys(monthMap);

  // Calculate fixed position from button's screen coords
  const openMenu = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setMenuStyle({
        top: rect.bottom + 6,
        left: rect.left,
        width: rect.width,
      });
    }
    setOpen(o => !o);
  };

  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="sa-dd" ref={ref}>
      <div
        ref={btnRef}
        className={`sa-dd-btn${open ? " open" : ""}`}
        onClick={openMenu}
      >
        <span>{value} {year}</span>
        <ChevronDown size={15} className="sa-dd-chev" />
      </div>
      {open && (
        <div className="sa-dd-menu" style={menuStyle}>
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

/* ─── Main ─────────────────────────────────────────────────────────────── */
const StudentAttendance = () => {
  const [month, setMonth] = useState("February");
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dark, setDark] = useState(isDarkFn);
  const year = new Date().getFullYear();
  const [leftWidth, setLeftWidth] = useState(62);
  const isDragging = useRef(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const o = new MutationObserver(() => setDark(isDarkFn()));
    o.observe(document.documentElement, { attributes:true, attributeFilter:["class"] });
    o.observe(document.body, { attributes:true, attributeFilter:["class"] });
    return () => o.disconnect();
  }, []);

  const onMouseDown = useCallback(() => {
    isDragging.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  const onMouseMove = useCallback(e => {
    if (!isDragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const nl = ((e.clientX - rect.left) / rect.width) * 100;
    if (nl > 30 && nl < 80) setLeftWidth(nl);
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

  useEffect(() => { loadAttendance(); }, [month]);

  const loadAttendance = async () => {
    setLoading(true);
    try {
      const res = await attendanceService.getMonthlyAttendance(year, monthMap[month]);
      setAttendanceData(res.data.map(a => ({
        rawDate: a.attendanceDate,
        date: formatDateDDMMYYYY(a.attendanceDate),
        isToday: isTodayFn(a.attendanceDate),
        status: a.status==="PRESENT" ? "Present" : a.status==="ABSENT" ? "Absent" : "Late",
      })));
    } catch (e) {
      console.error(e);
      setAttendanceData([]);
    } finally {
      setLoading(false);
    }
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

        {/* ═══ HERO SECTION ═══ */}
        <div className="sa-hero">
          {/* BG effects in a clipped wrapper — hero card itself is overflow:visible */}
          <div className="sa-hero-bg">
            <div className="sa-hero-grid" />
            <div className="sa-hero-glow" />
          </div>

          <div className="sa-hero-inner">
            <div>
              <div className="sa-hero-eyebrow">
                <Sparkles size={11} color="var(--mu)" />
                <span className="sa-hero-eyebrow-txt">Attendance Tracking</span>
              </div>
              <h1 className="sa-hero-title">Attendance</h1>
              <p className="sa-hero-desc">Track your monthly attendance and performance</p>
            </div>

            <div className="sa-hero-right">
              {/* Stats pill */}
              <div className="sa-hero-stats">
                <span>{totalDays} days</span>
                <span className="sa-hero-stats-div" />
                <span style={{color:"var(--c3)",fontWeight:700}}>{presentDays} present</span>
                <span className="sa-hero-stats-div" />
                <span style={{color:"var(--c1)",fontWeight:700}}>{pct}% rate</span>
              </div>

              {/* Activity bars */}
              <div className="sa-hero-act">
                <Activity size={12} color="var(--mu)" />
                <div className="sa-hero-dots">
                  <span className="sa-hero-dot sa-d1" style={{height:10}} />
                  <span className="sa-hero-dot sa-d2" style={{height:14}} />
                  <span className="sa-hero-dot sa-d3" style={{height:7}} />
                </div>
              </div>

              {/* Month Dropdown — fixed-position menu, never clipped */}
              <div className="sa-month-wrap">
                <div className="sa-month-ico"><Calendar size={16}/></div>
                <MonthDropdown value={month} onChange={setMonth} year={year} />
              </div>

              {/* Live badge */}
              <div className="sa-live-badge">
                <span className="sa-live-dot" />
                LIVE
              </div>
            </div>
          </div>
        </div>
        {/* ═══ END HERO ═══ */}

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

      <div ref={containerRef} className="sa-panels" style={{height:"calc(100vh - 360px)", minHeight:380}}>

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