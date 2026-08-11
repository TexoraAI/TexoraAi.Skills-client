// //src//student//attendance.jsx--->student file
// import React, { useEffect, useRef, useState, useCallback } from "react";
// import {
//   Calendar,
//   CheckCircle,
//   XCircle,
//   AlertCircle,
//   TrendingUp,
//   BarChart3,
//   Sparkles,
//   Activity,
//   Download,
//   Filter,
// } from "lucide-react";
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

// /* ── HERO SECTION — no box, plain background with bottom divider ── */
// .sa-hero{
//   padding:8px 0 24px;
//   background:transparent;
//   border:none;
//   border-bottom:1px solid var(--bd);
//   position:relative;
//   overflow:visible;
//   margin-bottom:20px;
//   box-shadow:none;
// }
// .sa-dk .sa-hero{border-bottom-color:rgba(255,255,255,0.07);}

// .sa-hero-inner{position:relative;z-index:1;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px;}
// .sa-hero-eyebrow{display:flex;align-items:center;gap:7px;margin-bottom:10px;}
// .sa-hero-eyebrow-txt{font-size:9px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:var(--mu);font-family:'Poppins',sans-serif;}
// .sa-hero-title{font-family:'Poppins',sans-serif;font-weight:700;font-size:clamp(1.5rem,3vw,2.2rem);color:#3B82F6;margin:0 0 6px;line-height:1.1;letter-spacing:-0.02em;}
// .sa-hero-desc{font-size:12px;color:var(--mu);margin-top:7px;font-weight:500;font-family:'Poppins',sans-serif;}
// .sa-hero-right{display:flex;align-items:center;gap:10px;flex-wrap:wrap;}
// .sa-hero-stats{display:flex;align-items:center;gap:12px;background:rgba(255,255,255,0.04);border:1px solid var(--bd);border-radius:12px;padding:8px 16px;font-size:11px;font-weight:600;font-family:'Poppins',sans-serif;color:var(--mu);}
// .sa-hero-stats-div{width:1px;height:14px;background:var(--bd);}
// .sa-hero-act{display:flex;align-items:center;gap:8px;background:rgba(255,255,255,0.04);border:1px solid var(--bd);border-radius:10px;padding:8px 14px;}
// .sa-hero-dots{display:flex;gap:3px;align-items:flex-end;height:14px;}
// .sa-hero-dot{width:3px;border-radius:2px;background:var(--mu);display:block;}
// .sa-live-badge{display:flex;align-items:center;gap:7px;background:rgba(34,211,238,0.08);border:1px solid rgba(34,211,238,0.3);border-radius:999px;padding:8px 18px;color:var(--c1);font-size:11px;font-weight:700;letter-spacing:.1em;font-family:'Poppins',sans-serif;}
// .sa-live-dot{width:6px;height:6px;border-radius:50%;background:var(--c1);display:inline-block;}

// @keyframes sa-blink{0%,100%{opacity:1}50%{opacity:0.15}}
// .sa-d1{animation:sa-blink 1.6s ease infinite;}
// .sa-d2{animation:sa-blink 1.6s 0.3s ease infinite;}
// .sa-d3{animation:sa-blink 1.6s 0.6s ease infinite;}
// @keyframes sa-pulse-ring{0%{box-shadow:0 0 0 0 rgba(34,211,238,0.5)}70%{box-shadow:0 0 0 8px rgba(34,211,238,0)}100%{box-shadow:0 0 0 0 rgba(34,211,238,0)}}
// .sa-live-badge{animation:sa-pulse-ring 2.2s ease-out infinite;}

// /* ── STAT CARDS — solid gradient + watermark icon, full-width fill ── */
// .sa-stats{display:grid;grid-template-columns:repeat(4, 1fr);gap:14px;margin-bottom:20px;}
// .sa-stat{border-radius:var(--r);padding:20px 20px 18px;color:#fff;position:relative;overflow:hidden;box-shadow:0 6px 18px rgba(0,0,0,0.14);transition:transform .25s ease, box-shadow .25s ease;}
// .sa-stat:hover{transform:translateY(-3px);box-shadow:0 14px 32px rgba(0,0,0,0.22);}
// .sa-stat-watermark{position:absolute;right:-16px;bottom:-16px;color:rgba(255,255,255,0.16);pointer-events:none;}
// .sa-sico{width:38px;height:38px;border-radius:11px;background:rgba(255,255,255,.22);display:flex;align-items:center;justify-content:center;margin-bottom:10px;position:relative;}
// .sa-sv{font-size:32px;font-weight:800;line-height:1;margin-bottom:6px;position:relative;}
// .sa-sl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;opacity:.85;position:relative;}

// @media (max-width: 900px){ .sa-stats{grid-template-columns:repeat(2, 1fr);} }
// @media (max-width: 480px){ .sa-stats{grid-template-columns:1fr;} }
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
// .sa-filter-bar{display:flex;flex-wrap:wrap;align-items:center;gap:8px;padding:12px 20px;border-bottom:1px solid var(--bd);background:var(--bg);}
// .sa-filter-sel,.sa-filter-date{padding:8px 10px;border-radius:9px;border:1px solid var(--bd);background:var(--card);color:var(--tx);font-family:'Poppins',sans-serif;font-size:12px;outline:none;}
// .sa-filter-btn{display:inline-flex;align-items:center;gap:6px;padding:8px 14px;border-radius:9px;border:none;font-family:'Poppins',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:opacity .2s,transform .15s;}
// .sa-filter-btn:hover{opacity:.87;transform:translateY(-1px);}
// .sa-filter-btn:disabled{opacity:.5;cursor:not-allowed;transform:none;}
// `;

// if (!document.getElementById("sa-at-st")) {
//   const t = document.createElement("style");
//   t.id = "sa-at-st";
//   t.textContent = STYLES;
//   document.head.appendChild(t);
// }

// const isDarkFn = () =>
//   document.documentElement.classList.contains("dark") ||
//   document.body.classList.contains("dark") ||
//   window.matchMedia("(prefers-color-scheme: dark)").matches;

// const formatDateDDMMYYYY = (d) => {
//   const dt = new Date(d);
//   return `${String(dt.getDate()).padStart(2, "0")}-${String(dt.getMonth() + 1).padStart(2, "0")}-${dt.getFullYear()}`;
// };
// const isTodayFn = (d) => {
//   const t = new Date(),
//     dt = new Date(d);
//   return (
//     dt.getDate() === t.getDate() &&
//     dt.getMonth() === t.getMonth() &&
//     dt.getFullYear() === t.getFullYear()
//   );
// };

// const STAT_GRADS = [
//   "linear-gradient(135deg,#22c55e,#16a34a)",
//   "linear-gradient(135deg,#f97316,#ea580c)",
//   "linear-gradient(135deg,#f87171,#dc2626)",
//   "linear-gradient(135deg,#3b82f6,#2563eb)",
// ];

// /* ─── Main ─────────────────────────────────────────────────────────────── */
// const StudentAttendance = () => {
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [dark, setDark] = useState(isDarkFn);
//   const year = new Date().getFullYear();
//   const [leftWidth, setLeftWidth] = useState(62);

//   // Filters — this is now the ONLY data source, defaults to current month
//   const [filterType, setFilterType] = useState("THIS_MONTH");
//   const [filterStartDate, setFilterStartDate] = useState("");
//   const [filterEndDate, setFilterEndDate] = useState("");
//   const [filterLoading, setFilterLoading] = useState(false);
//   const [filterError, setFilterError] = useState(null);
//   const [downloading, setDownloading] = useState(false);
//   const isDragging = useRef(false);
//   const containerRef = useRef(null);

//   useEffect(() => {
//     const o = new MutationObserver(() => setDark(isDarkFn()));
//     o.observe(document.documentElement, {
//       attributes: true,
//       attributeFilter: ["class"],
//     });
//     o.observe(document.body, { attributes: true, attributeFilter: ["class"] });
//     return () => o.disconnect();
//   }, []);

//   const onMouseDown = useCallback(() => {
//     isDragging.current = true;
//     document.body.style.cursor = "col-resize";
//     document.body.style.userSelect = "none";
//   }, []);

//   const onMouseMove = useCallback((e) => {
//     if (!isDragging.current || !containerRef.current) return;
//     const rect = containerRef.current.getBoundingClientRect();
//     const nl = ((e.clientX - rect.left) / rect.width) * 100;
//     if (nl > 30 && nl < 80) setLeftWidth(nl);
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

//   // Fetch filtered attendance history — the only data source for this page
//   const loadFilteredHistory = async () => {
//     if (filterType === "CUSTOM" && (!filterStartDate || !filterEndDate)) {
//       setFilterError("Select both start and end date for a custom range.");
//       return;
//     }
//     setLoading(true);
//     setFilterLoading(true);
//     setFilterError(null);
//     try {
//       const r = await attendanceService.getStudentHistory({
//         filterType,
//         startDate: filterType === "CUSTOM" ? filterStartDate : undefined,
//         endDate: filterType === "CUSTOM" ? filterEndDate : undefined,
//       });
//       setAttendanceData(
//         (r.data.records || []).map((a) => ({
//           rawDate: a.attendanceDate,
//           date: formatDateDDMMYYYY(a.attendanceDate),
//           isToday: isTodayFn(a.attendanceDate),
//           status:
//             a.status === "PRESENT"
//               ? "Present"
//               : a.status === "ABSENT"
//                 ? "Absent"
//                 : "Late",
//         })),
//       );
//     } catch (e) {
//       console.error(e);
//       setFilterError("Failed to load filtered history.");
//     } finally {
//       setLoading(false);
//       setFilterLoading(false);
//     }
//   };

//   // Download Excel for current filter
//   const handleDownload = async () => {
//     if (filterType === "CUSTOM" && (!filterStartDate || !filterEndDate)) {
//       setFilterError("Select both start and end date for a custom range.");
//       return;
//     }
//     setDownloading(true);
//     setFilterError(null);
//     try {
//       const r = await attendanceService.downloadStudentReport({
//         filterType,
//         startDate: filterType === "CUSTOM" ? filterStartDate : undefined,
//         endDate: filterType === "CUSTOM" ? filterEndDate : undefined,
//       });
//       const url = window.URL.createObjectURL(new Blob([r.data]));
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", "attendance-report.xlsx");
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(url);
//     } catch (e) {
//       console.error(e);
//       setFilterError("Failed to download report.");
//     } finally {
//       setDownloading(false);
//     }
//   };

//   // Auto-run for every filter except CUSTOM, which needs explicit Search
//   useEffect(() => {
//     if (filterType !== "CUSTOM") {
//       loadFilteredHistory();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [filterType]);

//   const totalDays = attendanceData.length;
//   const presentDays = attendanceData.filter(
//     (a) => a.status === "Present",
//   ).length;
//   const lateDays = attendanceData.filter((a) => a.status === "Late").length;
//   const absentDays = attendanceData.filter((a) => a.status === "Absent").length;
//   const pct =
//     totalDays > 0
//       ? (((presentDays + lateDays) / totalDays) * 100).toFixed(1)
//       : 0;

//   const statCards = [
//     {
//       Icon: CheckCircle,
//       value: presentDays,
//       label: "Present",
//       grad: STAT_GRADS[0],
//     },
//     {
//       Icon: AlertCircle,
//       value: lateDays,
//       label: "Late",
//       grad: STAT_GRADS[1],
//     },
//     {
//       Icon: XCircle,
//       value: absentDays,
//       label: "Absent",
//       grad: STAT_GRADS[2],
//     },
//     {
//       Icon: BarChart3,
//       value: `${pct}%`,
//       label: "Rate",
//       grad: STAT_GRADS[3],
//     },
//   ];

//   const statusBadge = (s) => {
//     if (s === "Present")
//       return <span className="sa-badge sa-badge-present">Present</span>;
//     if (s === "Late")
//       return <span className="sa-badge sa-badge-late">Late</span>;
//     return <span className="sa-badge sa-badge-absent">Absent</span>;
//   };
//   const statusIcon = (s) => {
//     if (s === "Present")
//       return <CheckCircle size={16} style={{ color: "var(--c3)" }} />;
//     if (s === "Late")
//       return <AlertCircle size={16} style={{ color: "var(--c2)" }} />;
//     return <XCircle size={16} style={{ color: "var(--cr)" }} />;
//   };

//   const periodLabel =
//     filterType === "CUSTOM"
//       ? "Custom Range"
//       : filterType.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

//   return (
//     <div className={`sa${dark ? " sa-dk" : ""}`}>
//       <div className="sa-top">
//         {/* ═══ HERO SECTION (no box — plain background) ═══ */}
//         <div className="sa-hero">
//           <div className="sa-hero-inner">
//             <div>
//               <div className="sa-hero-eyebrow">
//                 <Sparkles size={11} color="var(--mu)" />
//                 <span className="sa-hero-eyebrow-txt">Attendance Tracking</span>
//               </div>
//               <h1 className="sa-hero-title">Attendance</h1>
//               <p className="sa-hero-desc">
//                 Track your monthly attendance and performance
//               </p>
//             </div>

//             <div className="sa-hero-right">
//               {/* Stats pill */}
//               <div className="sa-hero-stats">
//                 <span>{totalDays} days</span>
//                 <span className="sa-hero-stats-div" />
//                 <span style={{ color: "var(--c3)", fontWeight: 700 }}>
//                   {presentDays} present
//                 </span>
//                 <span className="sa-hero-stats-div" />
//                 <span style={{ color: "var(--c1)", fontWeight: 700 }}>
//                   {pct}% rate
//                 </span>
//               </div>

//               {/* Activity bars */}
//               <div className="sa-hero-act">
//                 <Activity size={12} color="var(--mu)" />
//                 <div className="sa-hero-dots">
//                   <span className="sa-hero-dot sa-d1" style={{ height: 10 }} />
//                   <span className="sa-hero-dot sa-d2" style={{ height: 14 }} />
//                   <span className="sa-hero-dot sa-d3" style={{ height: 7 }} />
//                 </div>
//               </div>

//               {/* Live badge */}
//               <div className="sa-live-badge">
//                 <span className="sa-live-dot" />
//                 LIVE
//               </div>
//             </div>
//           </div>
//         </div>
//         {/* ═══ END HERO ═══ */}

//         <div className="sa-stats">
//           {statCards.map((s, i) => (
//             <div key={i} className="sa-stat" style={{ background: s.grad }}>
//               <s.Icon size={90} strokeWidth={1.5} className="sa-stat-watermark" />
//               <div className="sa-sico">
//                 <s.Icon size={16} color="#fff" strokeWidth={2.2} />
//               </div>
//               <div className="sa-sv">{s.value}</div>
//               <div className="sa-sl">{s.label}</div>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div
//         ref={containerRef}
//         className="sa-panels"
//         style={{ height: "calc(100vh - 360px)", minHeight: 380 }}
//       >
//         {/* Table */}
//         <div className="sa-table-panel" style={{ width: `${leftWidth}%` }}>
//           <div className="sa-panel-head">
//             <BarChart3 size={15} style={{ color: "var(--c1)" }} />
//             <span className="sa-panel-title">Attendance History</span>
//           </div>

//           {/* Filter bar — always visible, this is the only view now */}
//           <div className="sa-filter-bar">
//             <select
//               className="sa-filter-sel"
//               value={filterType}
//               onChange={(e) => setFilterType(e.target.value)}
//             >
//               <option value="TODAY">Today</option>
//               <option value="YESTERDAY">Yesterday</option>
//               <option value="LAST_7_DAYS">Last 7 Days</option>
//               <option value="LAST_14_DAYS">Last 14 Days</option>
//               <option value="LAST_30_DAYS">Last 30 Days</option>
//               <option value="THIS_WEEK">This Week</option>
//               <option value="THIS_MONTH">This Month</option>
//               <option value="CUSTOM">Custom Range</option>
//             </select>

//             {filterType === "CUSTOM" && (
//               <>
//                 <input
//                   type="date"
//                   className="sa-filter-date"
//                   value={filterStartDate}
//                   onChange={(e) => setFilterStartDate(e.target.value)}
//                 />
//                 <input
//                   type="date"
//                   className="sa-filter-date"
//                   value={filterEndDate}
//                   onChange={(e) => setFilterEndDate(e.target.value)}
//                 />
//               </>
//             )}

//             <button
//               className="sa-filter-btn"
//               style={{ background: "var(--c1)", color: "#0a0a0a" }}
//               disabled={filterLoading}
//               onClick={loadFilteredHistory}
//             >
//               {filterLoading ? "Loading…" : "Search"}
//             </button>
//             <button
//               className="sa-filter-btn"
//               style={{ background: "#a78bfa", color: "#0a0a0a" }}
//               disabled={downloading}
//               onClick={handleDownload}
//             >
//               <Download size={13} />{" "}
//               {downloading ? "Downloading…" : "Download Excel"}
//             </button>

//             {filterError && (
//               <span
//                 style={{ color: "var(--cr)", fontSize: 11, fontWeight: 600 }}
//               >
//                 {filterError}
//               </span>
//             )}
//           </div>

//           <div className="sa-table-scroll">
//             <table className="sa-t">
//               <thead>
//                 <tr>
//                   <th>Date</th>
//                   <th>Status</th>
//                   <th>Indicator</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {loading && (
//                   <tr className="sa-empty-row">
//                     <td colSpan={3}>Loading attendance...</td>
//                   </tr>
//                 )}
//                 {!loading && attendanceData.length === 0 && (
//                   <tr className="sa-empty-row">
//                     <td colSpan={3}>No attendance records found</td>
//                   </tr>
//                 )}
//                 {!loading &&
//                   attendanceData.map((att, idx) => (
//                     <tr key={idx} className={att.isToday ? "today" : ""}>
//                       <td>
//                         <div className="sa-td-date">
//                           {att.date}
//                           {att.isToday && (
//                             <span className="sa-today-tag">Today</span>
//                           )}
//                         </div>
//                       </td>
//                       <td>{statusBadge(att.status)}</td>
//                       <td>{statusIcon(att.status)}</td>
//                     </tr>
//                   ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Drag Handle */}
//         <div className="sa-handle" onMouseDown={onMouseDown}>
//           <div className="sa-handle-pill">
//             <svg width="5" height="12" viewBox="0 0 6 12" fill="none">
//               <path
//                 d="M1 1L0 6L1 11"
//                 stroke="currentColor"
//                 strokeWidth="1.5"
//                 strokeLinecap="round"
//                 style={{ color: "var(--mu)" }}
//               />
//             </svg>
//             <div className="sa-handle-line" />
//             <svg width="5" height="12" viewBox="0 0 6 12" fill="none">
//               <path
//                 d="M5 1L6 6L5 11"
//                 stroke="currentColor"
//                 strokeWidth="1.5"
//                 strokeLinecap="round"
//                 style={{ color: "var(--mu)" }}
//               />
//             </svg>
//           </div>
//         </div>

//         {/* Summary */}
//         <div className="sa-summary">
//           <div className="sa-panel-head">
//             <TrendingUp size={15} style={{ color: "var(--c1)" }} />
//             <span className="sa-panel-title">Summary</span>
//           </div>
//           <div className="sa-sum-body">
//             <div>
//               <p className="sa-sum-lbl">Attendance Rate</p>
//               <div className="sa-rate-box">
//                 <p className="sa-rate-val">{pct}%</p>
//                 <p className="sa-rate-sub">
//                   {presentDays + lateDays} of {totalDays} days
//                 </p>
//                 <div className="sa-rate-bar">
//                   <div
//                     className="sa-rate-fill"
//                     style={{
//                       width: `${pct}%`,
//                       background: "linear-gradient(90deg,var(--c1),var(--c3))",
//                     }}
//                   />
//                 </div>
//               </div>
//             </div>
//             <div>
//               <p className="sa-sum-lbl">Breakdown</p>
//               <div className="sa-breakdown">
//                 {[
//                   {
//                     label: "Present",
//                     value: presentDays,
//                     dot: "var(--c3)",
//                     val: "var(--c3)",
//                   },
//                   {
//                     label: "Late",
//                     value: lateDays,
//                     dot: "var(--c2)",
//                     val: "var(--c2)",
//                   },
//                   {
//                     label: "Absent",
//                     value: absentDays,
//                     dot: "var(--cr)",
//                     val: "var(--cr)",
//                   },
//                 ].map((s, i) => (
//                   <div key={i} className="sa-brow">
//                     <div className="sa-brow-l">
//                       <div className="sa-bdot" style={{ background: s.dot }} />
//                       <span className="sa-brow-lbl">{s.label}</span>
//                     </div>
//                     <span className="sa-brow-val" style={{ color: s.val }}>
//                       {s.value}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//             <div>
//               <p className="sa-sum-lbl">Period</p>
//               <div className="sa-period-card">
//                 <div className="sa-period-ico">
//                   <Calendar size={16} />
//                 </div>
//                 <div>
//                   <p className="sa-period-name">{periodLabel}</p>
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
import {
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  BarChart3,
  Sparkles,
  Activity,
  Download,
} from "lucide-react";
import attendanceService from "../services/attendanceService";
 
// ── Golden Reference design system — same tokens, StatCard, and
// PageContainer shell used by Dashboard / AssignmentDetail /
// StudentAssignments / Assessments / AttemptQuiz. This page previously
// shipped its own complete parallel stylesheet: a `:root` / `.sa-dk`
// CSS-variable pair standing in for `T`, its own gradient-watermark
// stat tile, and ~60 `.sa-*` classes reimplementing the hero, table,
// badges, and panel chrome the rest of the app already has tokens for.
// All of that is gone. The one piece with no golden-reference
// equivalent — the draggable split table/summary layout — stays
// custom, but every color/spacing value now comes from `t`.
import {
  T,
  FONT_FAMILY,
  FONT_WEIGHT,
  FONT_SIZE,
  LINE_HEIGHT,
  LETTER_SPACING,
  StatCard,
  PageContainer,
} from "@/design-system";
 
const isDarkFn = () =>
  document.documentElement.classList.contains("dark") ||
  document.body.classList.contains("dark") ||
  window.matchMedia("(prefers-color-scheme: dark)").matches;
 
const formatDateDDMMYYYY = (d) => {
  const dt = new Date(d);
  return `${String(dt.getDate()).padStart(2, "0")}-${String(dt.getMonth() + 1).padStart(2, "0")}-${dt.getFullYear()}`;
};
const isTodayFn = (d) => {
  const t = new Date(),
    dt = new Date(d);
  return (
    dt.getDate() === t.getDate() &&
    dt.getMonth() === t.getMonth() &&
    dt.getFullYear() === t.getFullYear()
  );
};
 
/* Status accent colors — domain-specific, kept alongside `t` the same
   way every other page keeps its own accent hexes (cyan/orange/green/etc.) */
const STATUS_COLOR = { Present: "#34d399", Late: "#fb923c", Absent: "#f87171" };
 
/* Small shared helper for status badges, same pattern as the tagStyle
   helper in StudentAssignments */
const badgeStyle = (color) => ({
  display: "inline-flex", alignItems: "center", padding: "4px 11px",
  borderRadius: 8, fontSize: 11, fontWeight: FONT_WEIGHT.bold,
  background: `${color}1A`, color, border: `1px solid ${color}33`,
  fontFamily: FONT_FAMILY,
});
 
/* ─── Main ─────────────────────────────────────────────────────────────── */
const StudentAttendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [leftWidth, setLeftWidth] = useState(62);
 
  // Filters — the only data source, defaults to current month
  const [filterType, setFilterType] = useState("THIS_MONTH");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [filterLoading, setFilterLoading] = useState(false);
  const [filterError, setFilterError] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const isDragging = useRef(false);
  const containerRef = useRef(null);
 
  // Same dark-mode detection pattern as the Dashboard golden reference
  const [isDark, setIsDark] = useState(isDarkFn);
  useEffect(() => {
    const o = new MutationObserver(() => setIsDark(isDarkFn()));
    o.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    o.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => o.disconnect();
  }, []);
  const t = isDark ? T.dark : T.light;
 
  const onMouseDown = useCallback(() => {
    isDragging.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);
 
  const onMouseMove = useCallback((e) => {
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
 
  // Fetch filtered attendance history — the only data source for this page
  const loadFilteredHistory = async () => {
    if (filterType === "CUSTOM" && (!filterStartDate || !filterEndDate)) {
      setFilterError("Select both start and end date for a custom range.");
      return;
    }
    setLoading(true);
    setFilterLoading(true);
    setFilterError(null);
    try {
      const r = await attendanceService.getStudentHistory({
        filterType,
        startDate: filterType === "CUSTOM" ? filterStartDate : undefined,
        endDate: filterType === "CUSTOM" ? filterEndDate : undefined,
      });
      setAttendanceData(
        (r.data.records || []).map((a) => ({
          rawDate: a.attendanceDate,
          date: formatDateDDMMYYYY(a.attendanceDate),
          isToday: isTodayFn(a.attendanceDate),
          status:
            a.status === "PRESENT"
              ? "Present"
              : a.status === "ABSENT"
                ? "Absent"
                : "Late",
        })),
      );
    } catch (e) {
      console.error(e);
      setFilterError("Failed to load filtered history.");
    } finally {
      setLoading(false);
      setFilterLoading(false);
    }
  };
 
  // Download Excel for current filter
  const handleDownload = async () => {
    if (filterType === "CUSTOM" && (!filterStartDate || !filterEndDate)) {
      setFilterError("Select both start and end date for a custom range.");
      return;
    }
    setDownloading(true);
    setFilterError(null);
    try {
      const r = await attendanceService.downloadStudentReport({
        filterType,
        startDate: filterType === "CUSTOM" ? filterStartDate : undefined,
        endDate: filterType === "CUSTOM" ? filterEndDate : undefined,
      });
      const url = window.URL.createObjectURL(new Blob([r.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "attendance-report.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      setFilterError("Failed to download report.");
    } finally {
      setDownloading(false);
    }
  };
 
  // Auto-run for every filter except CUSTOM, which needs explicit Search
  useEffect(() => {
    if (filterType !== "CUSTOM") {
      loadFilteredHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterType]);
 
  const totalDays = attendanceData.length;
  const presentDays = attendanceData.filter((a) => a.status === "Present").length;
  const lateDays = attendanceData.filter((a) => a.status === "Late").length;
  const absentDays = attendanceData.filter((a) => a.status === "Absent").length;
  const pct =
    totalDays > 0 ? (((presentDays + lateDays) / totalDays) * 100).toFixed(1) : 0;
 
  // Same `stat` shape the Dashboard/AssignmentDetail/Assessments hand to
  // <StatCard/>. Only blue/green/orange/purple colorKeys are confirmed
  // to exist in the shared component, so Absent maps to purple rather
  // than an unconfirmed "red" — worth swapping if the design system
  // does support a red/danger key.
  const stats = [
    { label: "Present", numericValue: presentDays, change: `${totalDays} total days`, trend: "up", icon: CheckCircle, colorKey: "green" },
    { label: "Late", numericValue: lateDays, change: lateDays > 0 ? "arrived late" : "none", trend: lateDays > 0 ? "down" : "up", icon: AlertCircle, colorKey: "orange" },
    { label: "Absent", numericValue: absentDays, change: absentDays > 0 ? "missed days" : "none", trend: absentDays > 0 ? "down" : "up", icon: XCircle, colorKey: "purple" },
    { label: "Rate", numericValue: `${pct}%`, change: "present + late", trend: pct >= 75 ? "up" : "down", icon: BarChart3, colorKey: "blue" },
  ];
 
  const statusBadge = (s) => (
    <span style={badgeStyle(STATUS_COLOR[s] || t.textMuted)}>{s}</span>
  );
  const statusIcon = (s) => {
    if (s === "Present") return <CheckCircle size={16} style={{ color: STATUS_COLOR.Present }} />;
    if (s === "Late") return <AlertCircle size={16} style={{ color: STATUS_COLOR.Late }} />;
    return <XCircle size={16} style={{ color: STATUS_COLOR.Absent }} />;
  };
 
  const periodLabel =
    filterType === "CUSTOM"
      ? "Custom Range"
      : filterType.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
 
  const selectStyle = {
    padding: "8px 10px", borderRadius: 9, border: `1px solid ${t.border}`,
    background: t.cardBg, color: t.text, fontFamily: FONT_FAMILY,
    fontSize: 12, outline: "none",
  };
 
  const filterBtnStyle = (bg, disabled) => ({
    display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px",
    borderRadius: 9, border: "none", fontFamily: FONT_FAMILY,
    fontSize: 12, fontWeight: FONT_WEIGHT.bold, cursor: disabled ? "not-allowed" : "pointer",
    background: bg, color: "#0a0a0a", opacity: disabled ? 0.5 : 1,
    transition: "opacity 0.2s, transform 0.15s",
  });
 
  return (
    <PageContainer mode={isDark ? "dark" : "light"} pageBg={t.pageBg} textColor={t.text}>
 
      {/* ═══ HERO — same borderless pattern as the rest of the app ═══ */}
      <div className="dfade" style={{ padding: "8px 0 24px", background: "transparent", border: "none", borderBottom: `1px solid ${t.borderHero}`, marginBottom: 20, boxShadow: "none" }}>
        <div className="hero-flex">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
              <Sparkles size={11} color={t.textSub} />
              <span style={{ fontSize: FONT_SIZE.eyebrow, fontWeight: FONT_WEIGHT.bold, letterSpacing: LETTER_SPACING.eyebrowWide, textTransform: "uppercase", color: t.textSub, fontFamily: FONT_FAMILY }}>
                Attendance Tracking
              </span>
            </div>
            <h1 style={{
              fontFamily: FONT_FAMILY, fontWeight: FONT_WEIGHT.heroTitle, fontSize: FONT_SIZE.heroTitle,
              color: "#3B82F6", margin: "0 0 6px", lineHeight: LINE_HEIGHT.heroTitle, letterSpacing: LETTER_SPACING.heroTitle,
            }}>
              Attendance
            </h1>
            <p style={{ fontSize: FONT_SIZE.bodySmall, color: t.textSub, marginTop: 7, fontWeight: FONT_WEIGHT.medium, fontFamily: FONT_FAMILY }}>
              Track your monthly attendance and performance
            </p>
          </div>
 
          <div className="hero-badges">
            <div style={{ display: "flex", alignItems: "center", gap: 12, background: t.actBg, border: `1px solid ${t.actBorder}`, borderRadius: 12, padding: "8px 16px", fontSize: 11, fontWeight: FONT_WEIGHT.semibold, fontFamily: FONT_FAMILY, color: t.textSub }}>
              <span>{totalDays} days</span>
              <span style={{ width: 1, height: 14, background: t.actBorder }} />
              <span style={{ color: "#34d399", fontWeight: FONT_WEIGHT.bold }}>{presentDays} present</span>
              <span style={{ width: 1, height: 14, background: t.actBorder }} />
              <span style={{ color: "#22d3ee", fontWeight: FONT_WEIGHT.bold }}>{pct}% rate</span>
            </div>
 
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: t.actBg, border: `1px solid ${t.actBorder}`, borderRadius: 10, padding: "8px 14px" }}>
              <Activity size={12} color={t.actIcon} />
              <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 14 }}>
                <span className="d1" style={{ width: 3, height: 10, borderRadius: 2, background: t.actBar, display: "block" }} />
                <span className="d2" style={{ width: 3, height: 14, borderRadius: 2, background: t.actBar, display: "block" }} />
                <span className="d3" style={{ width: 3, height: 7, borderRadius: 2, background: t.actBar, display: "block" }} />
              </div>
            </div>
 
            <div className="livebadge" style={{ display: "flex", alignItems: "center", gap: 7, background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.3)", borderRadius: 999, padding: "8px 18px", color: "#22d3ee", fontSize: 11, fontWeight: FONT_WEIGHT.bold, letterSpacing: "0.1em", fontFamily: FONT_FAMILY }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22d3ee", display: "inline-block" }} />
              LIVE
            </div>
          </div>
        </div>
      </div>
 
      {/* ═══ STAT CARDS — shared <StatCard/>, same stat-grid layout ═══ */}
      <div className="stat-grid" style={{ marginBottom: 20 }}>
        {stats.map((s, i) => <StatCard key={i} stat={s} index={i} loading={false} />)}
      </div>
 
      {/* ═══ SPLIT PANELS (table + resizable summary) ═══ */}
      <div
        ref={containerRef}
        style={{
          display: "flex", borderRadius: 20, border: `1px solid ${t.border}`,
          background: t.cardBg, boxShadow: t.shadowHov, overflow: "hidden",
          height: "calc(100vh - 360px)", minHeight: 380,
        }}
      >
        {/* Table panel */}
        <div style={{ width: `${leftWidth}%`, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: "30%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 20px", borderBottom: `1px solid ${t.border}`, flexShrink: 0, background: t.recentItemBg }}>
            <BarChart3 size={15} style={{ color: "#22d3ee" }} />
            <span style={{ fontSize: 13, fontWeight: FONT_WEIGHT.bold, color: t.text, fontFamily: FONT_FAMILY }}>Attendance History</span>
          </div>
 
          {/* Filter bar */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, padding: "12px 20px", borderBottom: `1px solid ${t.border}`, background: t.recentItemBg }}>
            <select style={selectStyle} value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="TODAY">Today</option>
              <option value="YESTERDAY">Yesterday</option>
              <option value="LAST_7_DAYS">Last 7 Days</option>
              <option value="LAST_14_DAYS">Last 14 Days</option>
              <option value="LAST_30_DAYS">Last 30 Days</option>
              <option value="THIS_WEEK">This Week</option>
              <option value="THIS_MONTH">This Month</option>
              <option value="CUSTOM">Custom Range</option>
            </select>
 
            {filterType === "CUSTOM" && (
              <>
                <input type="date" style={selectStyle} value={filterStartDate} onChange={(e) => setFilterStartDate(e.target.value)} />
                <input type="date" style={selectStyle} value={filterEndDate} onChange={(e) => setFilterEndDate(e.target.value)} />
              </>
            )}
 
            <button style={filterBtnStyle("#22d3ee", filterLoading)} disabled={filterLoading} onClick={loadFilteredHistory}>
              {filterLoading ? "Loading…" : "Search"}
            </button>
            <button style={filterBtnStyle("#a78bfa", downloading)} disabled={downloading} onClick={handleDownload}>
              <Download size={13} /> {downloading ? "Downloading…" : "Download Excel"}
            </button>
 
            {filterError && (
              <span style={{ color: "#f87171", fontSize: 11, fontWeight: FONT_WEIGHT.semibold, fontFamily: FONT_FAMILY }}>
                {filterError}
              </span>
            )}
          </div>
 
          <div style={{ flex: 1, overflowY: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr>
                  {["Date", "Status", "Indicator"].map((h) => (
                    <th key={h} style={{ padding: "12px 18px", textAlign: "left", fontSize: 11, fontWeight: FONT_WEIGHT.bold, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", background: t.recentItemBg, borderBottom: `1px solid ${t.border}`, fontFamily: FONT_FAMILY }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={3} style={{ textAlign: "center", padding: "48px 20px", color: t.textMuted, fontSize: 13, fontWeight: FONT_WEIGHT.medium, fontFamily: FONT_FAMILY }}>
                      Loading attendance...
                    </td>
                  </tr>
                )}
                {!loading && attendanceData.length === 0 && (
                  <tr>
                    <td colSpan={3} style={{ textAlign: "center", padding: "48px 20px", color: t.textMuted, fontSize: 13, fontWeight: FONT_WEIGHT.medium, fontFamily: FONT_FAMILY }}>
                      No attendance records found
                    </td>
                  </tr>
                )}
                {!loading && attendanceData.map((att, idx) => (
                  <tr key={idx} style={{ borderBottom: `1px solid ${t.border}`, background: att.isToday ? "rgba(52,211,153,0.06)" : "transparent" }}>
                    <td style={{ padding: "12px 18px", verticalAlign: "middle" }}>
                      <div style={{ fontSize: 13, fontWeight: FONT_WEIGHT.bold, color: t.text, display: "flex", alignItems: "center", gap: 7, fontFamily: FONT_FAMILY }}>
                        {att.date}
                        {att.isToday && (
                          <span style={{ padding: "2px 8px", borderRadius: 6, background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.20)", color: "#34d399", fontSize: 10, fontWeight: FONT_WEIGHT.bold }}>
                            Today
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: "12px 18px", verticalAlign: "middle" }}>{statusBadge(att.status)}</td>
                    <td style={{ padding: "12px 18px", verticalAlign: "middle" }}>{statusIcon(att.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
 
        {/* Drag handle */}
        <div
          onMouseDown={onMouseDown}
          style={{ flexShrink: 0, width: 12, display: "flex", alignItems: "center", justifyContent: "center", cursor: "col-resize", background: t.recentItemBg, borderLeft: `1px solid ${t.border}`, borderRight: `1px solid ${t.border}`, position: "relative" }}
        >
          <div style={{ position: "absolute", display: "flex", alignItems: "center", gap: 2, padding: "6px 5px", borderRadius: 8, background: t.cardBg, border: `1px solid ${t.border}`, boxShadow: t.shadow }}>
            <svg width="5" height="12" viewBox="0 0 6 12" fill="none">
              <path d="M1 1L0 6L1 11" stroke={t.textMuted} strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <div style={{ width: 1, height: 14, background: t.border }} />
            <svg width="5" height="12" viewBox="0 0 6 12" fill="none">
              <path d="M5 1L6 6L5 11" stroke={t.textMuted} strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
 
        {/* Summary panel */}
        <div style={{ flex: 1, minWidth: "20%", display: "flex", flexDirection: "column", overflowY: "auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 20px", borderBottom: `1px solid ${t.border}`, flexShrink: 0, background: t.recentItemBg }}>
            <TrendingUp size={15} style={{ color: "#22d3ee" }} />
            <span style={{ fontSize: 13, fontWeight: FONT_WEIGHT.bold, color: t.text, fontFamily: FONT_FAMILY }}>Summary</span>
          </div>
 
          <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <p style={{ fontSize: 10, fontWeight: FONT_WEIGHT.bold, textTransform: "uppercase", letterSpacing: "0.1em", color: t.textMuted, margin: "0 0 8px", fontFamily: FONT_FAMILY }}>
                Attendance Rate
              </p>
              <div style={{ borderRadius: 14, padding: 18, textAlign: "center", background: t.recentItemBg, border: `1px solid ${t.border}` }}>
                <p style={{ fontSize: 40, fontWeight: FONT_WEIGHT.bold, color: "#22d3ee", lineHeight: 1, margin: "0 0 4px" }}>{pct}%</p>
                <p style={{ fontSize: 12, color: t.textMuted, margin: "0 0 12px", fontFamily: FONT_FAMILY }}>
                  {presentDays + lateDays} of {totalDays} days
                </p>
                <div style={{ height: 8, borderRadius: 99, background: t.border, overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: 99, width: `${pct}%`, background: "linear-gradient(90deg,#22d3ee,#34d399)", transition: "width 0.5s" }} />
                </div>
              </div>
            </div>
 
            <div>
              <p style={{ fontSize: 10, fontWeight: FONT_WEIGHT.bold, textTransform: "uppercase", letterSpacing: "0.1em", color: t.textMuted, margin: "0 0 8px", fontFamily: FONT_FAMILY }}>
                Breakdown
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { label: "Present", value: presentDays, color: "#34d399" },
                  { label: "Late", value: lateDays, color: "#fb923c" },
                  { label: "Absent", value: absentDays, color: "#f87171" },
                ].map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px", borderRadius: 12, background: t.recentItemBg, border: `1px solid ${t.border}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 9, height: 9, borderRadius: "50%", flexShrink: 0, background: s.color }} />
                      <span style={{ fontSize: 13, color: t.textMuted, fontFamily: FONT_FAMILY }}>{s.label}</span>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: FONT_WEIGHT.bold, color: s.color, fontFamily: FONT_FAMILY }}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
 
            <div>
              <p style={{ fontSize: 10, fontWeight: FONT_WEIGHT.bold, textTransform: "uppercase", letterSpacing: "0.1em", color: t.textMuted, margin: "0 0 8px", fontFamily: FONT_FAMILY }}>
                Period
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", borderRadius: 13, background: t.recentItemBg, border: `1px solid ${t.border}` }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(34,211,238,0.10)", border: "1px solid rgba(34,211,238,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#22d3ee", flexShrink: 0 }}>
                  <Calendar size={16} />
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: FONT_WEIGHT.bold, color: t.text, margin: "0 0 2px", fontFamily: FONT_FAMILY }}>{periodLabel}</p>
                  <p style={{ fontSize: 11, color: t.textMuted, margin: 0, fontFamily: FONT_FAMILY }}>{totalDays} records found</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
 
export default StudentAttendance;