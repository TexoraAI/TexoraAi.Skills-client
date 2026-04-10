
// import { Award, Calendar, Clock, FileText } from "lucide-react";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import assessmentService from "../services/assessmentService";

// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";

// const Assessments = () => {
//   const [assessments, setAssessments] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const loadQuizzes = async () => {
//       try {
//         // ✅ FIXED: use student endpoint
//         const res = await assessmentService.getStudentQuizzes();
//         setAssessments(res.data);
//       } catch (err) {
//         console.error("Failed to load quizzes", err);
//       }
//     };
//     loadQuizzes();
//   }, []);

//   const statusClass =
//     "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30";

//   return (
//     <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
//       <header
//         className="relative overflow-hidden
//         bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400
//         dark:from-sky-600 dark:via-blue-600 dark:to-indigo-600"
//       >
//         <div className="absolute inset-0 bg-white/10 dark:bg-black/10" />

//         <div className="relative max-w-7xl mx-auto px-6 py-5">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//             <div>
//               <div className="flex items-center gap-2 mb-1">
//                 <div className="p-2 rounded-md bg-white/30 backdrop-blur shadow">
//                   <FileText className="h-4 w-4 text-white" />
//                 </div>
//                 <span className="text-xs font-semibold uppercase tracking-wide text-white/90">
//                   Assessment Portal
//                 </span>
//               </div>

//               <h1 className="text-xl font-bold text-white">Your Assessments</h1>
//               <p className="text-sm text-white/85">
//                 Track your progress and attempt quizzes
//               </p>
//             </div>

//             <div className="flex gap-3">
//               <Stat
//                 icon={<FileText className="h-4 w-4" />}
//                 label="Total"
//                 value={assessments.length}
//               />
//               <Stat
//                 icon={<Clock className="h-4 w-4" />}
//                 label="Pending"
//                 value={assessments.length}
//               />
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="max-w-7xl mx-auto px-6 py-12">
//         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//           {assessments.map((item) => (
//             <Card
//               key={item.id}
//               className="group p-6 flex flex-col justify-between
//                          bg-white dark:bg-slate-900
//                          border border-slate-200 dark:border-slate-800
//                          hover:shadow-xl transition-all duration-300
//                          hover:-translate-y-1"
//             >
//               <div className="flex items-start justify-between mb-4">
//                 <h2
//                   className="text-lg font-semibold
//                                text-slate-900 dark:text-slate-100
//                                group-hover:text-blue-600 dark:group-hover:text-blue-400
//                                transition-colors"
//                 >
//                   {item.title}
//                 </h2>
//                 <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
//                   <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
//                 </div>
//               </div>

//               <div
//                 className="flex items-center gap-2 text-sm
//                               text-slate-500 dark:text-slate-400
//                               mb-4 pb-4 border-b border-slate-200 dark:border-slate-700"
//               >
//                 <Calendar className="h-4 w-4" />
//                 Quiz ID:
//                 <span className="font-medium text-slate-900 dark:text-slate-100">
//                   {item.id}
//                 </span>
//               </div>

//               <span
//                 className={`inline-block w-fit rounded-full px-3 py-1.5
//                             text-xs font-semibold ${statusClass} mb-4`}
//               >
//                 Pending
//               </span>

//               <Button
//                 className="w-full bg-blue-600 hover:bg-blue-700
//                            text-white shadow-md transition"
//                 onClick={() => navigate(`/student/quiz/${item.id}`)}
//               >
//                 View Assessment
//               </Button>
//             </Card>
//           ))}

//           {assessments.length === 0 && (
//             <div className="col-span-full text-center py-16">
//               <div
//                 className="inline-flex items-center justify-center
//                               w-20 h-20 rounded-full
//                               bg-blue-100 dark:bg-blue-900/20 mb-4"
//               >
//                 <Award className="h-10 w-10 text-blue-600 dark:text-blue-400" />
//               </div>
//               <p className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
//                 All caught up!
//               </p>
//               <p className="text-sm text-slate-500 dark:text-slate-400">
//                 No assessments available at the moment 🎉
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Assessments;

// const Stat = ({ icon, label, value }) => (
//   <div
//     className="flex items-center gap-2 px-4 py-2
//                   rounded-xl bg-white/30 backdrop-blur
//                   border border-white/30 text-white shadow"
//   >
//     {icon}
//     <div>
//       <p className="text-base font-bold leading-none">{value}</p>
//       <p className="text-[11px] text-white/80">{label}</p>
//     </div>
//   </div>
// ); old working ui bad

























// import { Award, Calendar, Clock, FileText, ChevronRight, ChevronDown, Sparkles, Activity, ArrowUpRight, Zap } from "lucide-react";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import assessmentService from "../services/assessmentService";

// /* ═══════════════════════════════════════════════
//    THEME TOKEN MAP (matches Dashboard exactly)
// ═══════════════════════════════════════════════ */
// const T = {
//   dark: {
//     pageBg: "#0a0a0a",
//     cardBg: "#111111",
//     cardBgHov: "#161616",
//     heroBg: "#141414",
//     border: "rgba(255,255,255,0.06)",
//     borderHov: "rgba(255,255,255,0.14)",
//     borderHero: "rgba(255,255,255,0.07)",
//     text: "#ffffff",
//     textSub: "rgba(255,255,255,0.3)",
//     textMuted: "rgba(255,255,255,0.2)",
//     textLabel: "rgba(255,255,255,0.22)",
//     pillBg: "rgba(255,255,255,0.04)",
//     pillBorder: "rgba(255,255,255,0.07)",
//     pillText: "rgba(255,255,255,0.25)",
//     iconBg: "rgba(255,255,255,0.05)",
//     iconBorder: "rgba(255,255,255,0.08)",
//     gridLine: "rgba(255,255,255,0.5)",
//     barBg: "rgba(255,255,255,0.05)",
//     actBar: "rgba(255,255,255,0.5)",
//     actIcon: "rgba(255,255,255,0.3)",
//     actBg: "rgba(255,255,255,0.04)",
//     actBorder: "rgba(255,255,255,0.07)",
//     navBtnBg: "rgba(255,255,255,0.04)",
//     navBtnBorder: "rgba(255,255,255,0.08)",
//     shadow: "0 4px 20px rgba(0,0,0,0.4)",
//     shadowHov: "0 20px 60px rgba(0,0,0,0.6)",
//     emptyBorder: "rgba(255,255,255,0.07)",
//     emptyBg: "rgba(255,255,255,0.02)",
//     emptyIcon: "rgba(255,255,255,0.12)",
//     recentItemBg: "rgba(255,255,255,0.03)",
//     recentItemBorder: "rgba(255,255,255,0.05)",
//     recentItemBgHov: "rgba(255,255,255,0.06)",
//     rowHov: "rgba(255,255,255,0.04)",
//     collapseHdr: "rgba(255,255,255,0.03)",
//   },
//   light: {
//     pageBg: "#f1f5f9",
//     cardBg: "#ffffff",
//     cardBgHov: "#f8fafc",
//     heroBg: "#ffffff",
//     border: "#e2e8f0",
//     borderHov: "#cbd5e1",
//     borderHero: "#e2e8f0",
//     text: "#0f172a",
//     textSub: "#64748b",
//     textMuted: "#94a3b8",
//     textLabel: "#94a3b8",
//     pillBg: "#f1f5f9",
//     pillBorder: "#e2e8f0",
//     pillText: "#94a3b8",
//     iconBg: "#f8fafc",
//     iconBorder: "#e2e8f0",
//     gridLine: "rgba(0,0,0,0.12)",
//     barBg: "#f1f5f9",
//     actBar: "#94a3b8",
//     actIcon: "#94a3b8",
//     actBg: "#f8fafc",
//     actBorder: "#e2e8f0",
//     navBtnBg: "#f8fafc",
//     navBtnBorder: "#e2e8f0",
//     shadow: "0 1px 8px rgba(0,0,0,0.07)",
//     shadowHov: "0 8px 32px rgba(0,0,0,0.10)",
//     emptyBorder: "#e2e8f0",
//     emptyBg: "#f8fafc",
//     emptyIcon: "#cbd5e1",
//     recentItemBg: "#f8fafc",
//     recentItemBorder: "#e2e8f0",
//     recentItemBgHov: "#f1f5f9",
//     rowHov: "#f8fafc",
//     collapseHdr: "#f8fafc",
//   },
// };

// /* ═══════════════════════════════════════════════
//    STAT CARD (matches Dashboard StatCard style)
// ═══════════════════════════════════════════════ */
// const StatCard = ({ icon: Icon, value, label, color, t }) => {
//   const [hov, setHov] = useState(false);
//   return (
//     <div
//       onMouseEnter={() => setHov(true)}
//       onMouseLeave={() => setHov(false)}
//       style={{
//         background: hov ? t.cardBgHov : t.cardBg,
//         border: `1px solid ${hov ? t.borderHov : t.border}`,
//         boxShadow: hov ? `${t.shadowHov}, 0 0 40px ${color}12` : t.shadow,
//         borderRadius: 20, padding: "22px 22px 20px",
//         display: "flex", flexDirection: "column", gap: 14,
//         transition: "all 0.25s ease", position: "relative", overflow: "hidden",
//         cursor: "default",
//       }}
//     >
//       <div style={{
//         position: "absolute", top: -20, right: -20, width: 90, height: 90,
//         borderRadius: "50%", background: color, filter: "blur(40px)",
//         opacity: hov ? 0.15 : 0.04, transition: "opacity 0.4s", pointerEvents: "none",
//       }} />
//       <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//         <div style={{
//           width: 42, height: 42, borderRadius: 12,
//           display: "flex", alignItems: "center", justifyContent: "center",
//           background: `${color}18`, border: `1px solid ${color}30`,
//         }}>
//           <Icon size={19} color={color} strokeWidth={2} />
//         </div>
//         <ArrowUpRight size={13} style={{ color, opacity: hov ? 0.7 : 0, transition: "opacity 0.2s" }} />
//       </div>
//       <div>
//         <p style={{
//           fontSize: 40, fontWeight: 800, lineHeight: 1,
//           fontFamily: "'Poppins',sans-serif", color: t.text, margin: 0,
//         }}>{value}</p>
//         <p style={{
//           fontSize: 10, marginTop: 6, fontWeight: 600, letterSpacing: "0.1em",
//           textTransform: "uppercase", color: t.textMuted,
//           fontFamily: "'Poppins',sans-serif", margin: "6px 0 0",
//         }}>{label}</p>
//       </div>
//       <div style={{ height: 2, background: t.barBg, borderRadius: 99, overflow: "hidden" }}>
//         <div style={{
//           height: "100%", borderRadius: 99, background: color,
//           width: hov ? "65%" : "20%", transition: "width 0.65s ease", opacity: 0.85,
//         }} />
//       </div>
//       <div style={{
//         position: "absolute", bottom: 0, left: 0,
//         width: hov ? "60%" : "30%", height: 1,
//         background: `linear-gradient(90deg,${color},transparent)`,
//         transition: "width 0.5s ease", opacity: 0.5,
//       }} />
//     </div>
//   );
// };

// /* ═══════════════════════════════════════════════
//    COLLAPSIBLE QUIZ ROW (CRM-style)
// ═══════════════════════════════════════════════ */
// const QuizRow = ({ item, index, t, navigate }) => {
//   const [open, setOpen] = useState(false);
//   const [hov, setHov] = useState(false);
//   const accentColor = "#fb923c";

//   return (
//     <div
//       style={{
//         borderRadius: 16,
//         border: `1px solid ${open ? accentColor + "40" : hov ? t.borderHov : t.border}`,
//         overflow: "hidden",
//         boxShadow: open ? `0 0 24px ${accentColor}10` : t.shadow,
//         transition: "all 0.25s ease",
//         background: t.cardBg,
//       }}
//       className="quiz-row-anim"
//       onMouseEnter={() => setHov(true)}
//       onMouseLeave={() => setHov(false)}
//     >
//       {/* ── Header Row ── */}
//       <div
//         onClick={() => setOpen((p) => !p)}
//         style={{
//           display: "flex", alignItems: "center", gap: 14,
//           padding: "16px 20px", cursor: "pointer",
//           background: open ? `${accentColor}08` : hov ? t.cardBgHov : t.cardBg,
//           transition: "background 0.2s",
//           userSelect: "none",
//         }}
//       >
//         {/* Index Badge */}
//         <div style={{
//           width: 34, height: 34, borderRadius: 10, flexShrink: 0,
//           display: "flex", alignItems: "center", justifyContent: "center",
//           background: open ? `${accentColor}20` : t.iconBg,
//           border: `1px solid ${open ? accentColor + "40" : t.iconBorder}`,
//           fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 12,
//           color: open ? accentColor : t.textMuted,
//           transition: "all 0.2s",
//         }}>{String(index + 1).padStart(2, "0")}</div>

//         {/* Title */}
//         <div style={{ flex: 1, minWidth: 0 }}>
//           <p style={{
//             margin: 0, fontSize: 13, fontWeight: 700,
//             color: open ? accentColor : t.text,
//             fontFamily: "'Poppins',sans-serif",
//             overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
//             transition: "color 0.2s",
//           }}>{item.title}</p>
//           <p style={{
//             margin: "2px 0 0", fontSize: 10, color: t.textMuted,
//             fontFamily: "'Poppins',sans-serif",
//           }}>Quiz ID: {item.id}</p>
//         </div>

//         {/* Status Badge */}
//         <span style={{
//           fontSize: 9, fontWeight: 700, letterSpacing: "0.1em",
//           textTransform: "uppercase", padding: "4px 12px", borderRadius: 999,
//           background: "rgba(251,146,60,0.12)", color: accentColor,
//           border: "1px solid rgba(251,146,60,0.3)",
//           fontFamily: "'Poppins',sans-serif", flexShrink: 0,
//         }}>Pending</span>

//         {/* CRM Collapse Arrow */}
//         <div style={{
//           width: 28, height: 28, borderRadius: 8, flexShrink: 0,
//           display: "flex", alignItems: "center", justifyContent: "center",
//           background: open ? `${accentColor}18` : t.actBg,
//           border: `1px solid ${open ? accentColor + "30" : t.actBorder}`,
//           transition: "all 0.2s",
//         }}>
//           <ChevronDown
//             size={14}
//             color={open ? accentColor : t.textMuted}
//             style={{ transition: "transform 0.3s", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
//           />
//         </div>
//       </div>

//       {/* ── Collapsible Body ── */}
//       <div style={{
//         maxHeight: open ? 300 : 0,
//         overflow: "hidden",
//         transition: "max-height 0.35s cubic-bezier(0.4,0,0.2,1)",
//       }}>
//         <div style={{
//           borderTop: `1px solid ${accentColor}20`,
//           padding: "20px",
//           background: open ? `${accentColor}04` : "transparent",
//         }}>
//           {/* Detail Grid */}
//           <div style={{
//             display: "grid", gridTemplateColumns: "1fr 1fr",
//             gap: 12, marginBottom: 18,
//           }}>
//             {[
//               { label: "Quiz ID", value: item.id, icon: FileText, color: "#22d3ee" },
//               { label: "Status", value: "Pending Attempt", icon: Clock, color: accentColor },
//               { label: "Type", value: "Assessment", icon: Award, color: "#a78bfa" },
//               { label: "Scheduled", value: "Available Now", icon: Calendar, color: "#34d399" },
//             ].map((det, i) => (
//               <div key={i} style={{
//                 display: "flex", alignItems: "center", gap: 10,
//                 padding: "10px 14px", borderRadius: 12,
//                 background: t.recentItemBg, border: `1px solid ${t.recentItemBorder}`,
//               }}>
//                 <div style={{
//                   width: 30, height: 30, borderRadius: 8, flexShrink: 0,
//                   display: "flex", alignItems: "center", justifyContent: "center",
//                   background: `${det.color}18`, border: `1px solid ${det.color}30`,
//                 }}>
//                   <det.icon size={13} color={det.color} />
//                 </div>
//                 <div>
//                   <p style={{ margin: 0, fontSize: 9, color: t.textMuted, fontFamily: "'Poppins',sans-serif", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>{det.label}</p>
//                   <p style={{ margin: "2px 0 0", fontSize: 12, fontWeight: 700, color: t.text, fontFamily: "'Poppins',sans-serif" }}>{det.value}</p>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* CTA */}
//           <button
//             onClick={(e) => { e.stopPropagation(); navigate(`/student/quiz/${item.id}`); }}
//             style={{
//               width: "100%", padding: "12px", borderRadius: 12,
//               background: `linear-gradient(135deg, ${accentColor}, #ef4444)`,
//               border: "none", cursor: "pointer",
//               color: "#fff", fontSize: 12, fontWeight: 700,
//               fontFamily: "'Poppins',sans-serif", letterSpacing: "0.05em",
//               display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
//               boxShadow: `0 4px 20px ${accentColor}30`,
//               transition: "transform 0.15s, box-shadow 0.15s",
//             }}
//             onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = `0 8px 28px ${accentColor}40`; }}
//             onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 4px 20px ${accentColor}30`; }}
//           >
//             <Zap size={14} /> Start Assessment <ChevronRight size={14} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ═══════════════════════════════════════════════
//    MAIN ASSESSMENTS PAGE
// ═══════════════════════════════════════════════ */
// const Assessments = () => {
//   const [assessments, setAssessments] = useState([]);
//   const navigate = useNavigate();

//   const [isDark, setIsDark] = useState(
//     () =>
//       typeof document !== "undefined" &&
//       (document.documentElement.classList.contains("dark") ||
//         document.documentElement.getAttribute("data-theme") === "dark")
//   );

//   useEffect(() => {
//     const obs = new MutationObserver(() => {
//       setIsDark(
//         document.documentElement.classList.contains("dark") ||
//           document.documentElement.getAttribute("data-theme") === "dark"
//       );
//     });
//     obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
//     return () => obs.disconnect();
//   }, []);

//   const t = isDark ? T.dark : T.light;

//   useEffect(() => {
//     const loadQuizzes = async () => {
//       try {
//         const res = await assessmentService.getStudentQuizzes();
//         setAssessments(res.data);
//       } catch (err) {
//         console.error("Failed to load quizzes", err);
//       }
//     };
//     loadQuizzes();
//   }, []);

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
//         @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
//         .dfade{animation:fadeUp 0.45s ease both}
//         .quiz-row-anim{animation:fadeUp 0.45s ease both}
//         @keyframes blink{0%,100%{opacity:1}50%{opacity:0.15}}
//         .d1{animation:blink 1.6s ease infinite}
//         .d2{animation:blink 1.6s 0.3s ease infinite}
//         .d3{animation:blink 1.6s 0.6s ease infinite}
//         @keyframes pulse-ring{0%{box-shadow:0 0 0 0 rgba(251,146,60,0.5)}70%{box-shadow:0 0 0 8px rgba(251,146,60,0)}100%{box-shadow:0 0 0 0 rgba(251,146,60,0)}}
//         .livebadge{animation:pulse-ring 2.2s ease-out infinite}
//       `}</style>

//       <div style={{
//         minHeight: "100vh", background: t.pageBg, color: t.text,
//         fontFamily: "'Poppins',sans-serif",
//         transition: "background 0.3s, color 0.3s",
//       }}>
//         <div style={{ padding: 24, maxWidth: 1300, margin: "0 auto", paddingBottom: 52 }}>

//           {/* ═══ HERO ═══ */}
//           <div className="dfade" style={{
//             borderRadius: 24, padding: "30px 36px",
//             background: t.heroBg, border: `1px solid ${t.borderHero}`,
//             position: "relative", overflow: "hidden",
//             marginBottom: 20, boxShadow: t.shadow,
//           }}>
//             <div style={{
//               position: "absolute", inset: 0, pointerEvents: "none",
//               opacity: isDark ? 0.04 : 0.025,
//               backgroundImage: `linear-gradient(${t.gridLine} 1px,transparent 1px),linear-gradient(90deg,${t.gridLine} 1px,transparent 1px)`,
//               backgroundSize: "40px 40px",
//             }} />
//             <div style={{
//               position: "absolute", top: "-30%", left: "40%",
//               width: 300, height: 200,
//               background: "radial-gradient(ellipse,rgba(251,146,60,0.06),transparent 70%)",
//               pointerEvents: "none",
//             }} />

//             <div style={{
//               position: "relative", display: "flex", alignItems: "center",
//               justifyContent: "space-between", flexWrap: "wrap", gap: 16,
//             }}>
//               <div>
//                 <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
//                   <Sparkles size={11} color={t.textSub} />
//                   <span style={{
//                     fontSize: 9, fontWeight: 700, letterSpacing: "0.22em",
//                     textTransform: "uppercase", color: t.textSub,
//                     fontFamily: "'Poppins',sans-serif",
//                   }}>Assessment Portal</span>
//                 </div>
//                 <h1 style={{
//                   fontFamily: "'Poppins',sans-serif", fontWeight: 900,
//                   fontSize: "clamp(1.6rem,3vw,2.4rem)", color: t.text,
//                   margin: 0, lineHeight: 1.1, letterSpacing: "-0.02em",
//                 }}>Your Assessments</h1>
//                 <p style={{
//                   fontSize: 12, color: t.textSub, marginTop: 7,
//                   fontWeight: 500, fontFamily: "'Poppins',sans-serif",
//                 }}>Track your progress and attempt quizzes</p>
//               </div>

//               <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//                 <div style={{
//                   display: "flex", alignItems: "center", gap: 12,
//                   background: t.actBg, border: `1px solid ${t.actBorder}`,
//                   borderRadius: 12, padding: "8px 16px",
//                   fontSize: 11, fontWeight: 600,
//                   fontFamily: "'Poppins',sans-serif", color: t.textSub,
//                 }}>
//                   <span>{assessments.length} total</span>
//                   <span style={{ width: 1, height: 14, background: t.actBorder }} />
//                   <span style={{ color: "#fb923c", fontWeight: 700 }}>
//                     <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fb923c", display: "inline-block", marginRight: 5 }} />
//                     {assessments.length} pending
//                   </span>
//                 </div>
//                 <div style={{
//                   display: "flex", alignItems: "center", gap: 8,
//                   background: t.actBg, border: `1px solid ${t.actBorder}`,
//                   borderRadius: 10, padding: "8px 14px",
//                 }}>
//                   <Activity size={12} color={t.actIcon} />
//                   <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 14 }}>
//                     <span className="d1" style={{ width: 3, height: 10, borderRadius: 2, background: t.actBar, display: "block" }} />
//                     <span className="d2" style={{ width: 3, height: 14, borderRadius: 2, background: t.actBar, display: "block" }} />
//                     <span className="d3" style={{ width: 3, height: 7, borderRadius: 2, background: t.actBar, display: "block" }} />
//                   </div>
//                 </div>
//                 <div className="livebadge" style={{
//                   display: "flex", alignItems: "center", gap: 7,
//                   background: "rgba(251,146,60,0.08)",
//                   border: "1px solid rgba(251,146,60,0.3)",
//                   borderRadius: 999, padding: "8px 18px",
//                   color: "#fb923c", fontSize: 11, fontWeight: 700,
//                   letterSpacing: "0.1em", fontFamily: "'Poppins',sans-serif",
//                 }}>
//                   <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fb923c", display: "inline-block" }} />
//                   LIVE
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* ═══ STAT CARDS ═══ */}
//           <div style={{
//             display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(185px,1fr))",
//             gap: 14, marginBottom: 20,
//           }}>
//             <StatCard icon={FileText} value={assessments.length} label="Total Assessments" color="#22d3ee" t={t} />
//             <StatCard icon={Clock} value={assessments.length} label="Pending" color="#fb923c" t={t} />
//             <StatCard icon={Award} value={0} label="Completed" color="#34d399" t={t} />
//             <StatCard icon={Calendar} value="—" label="Due This Week" color="#a78bfa" t={t} />
//           </div>

//           {/* ═══ QUIZ LIST ═══ */}
//           <div className="dfade" style={{
//             background: t.cardBg, border: `1px solid ${t.border}`,
//             borderRadius: 24, overflow: "hidden", boxShadow: t.shadow,
//           }}>
//             {/* Panel Header */}
//             <div style={{
//               display: "flex", alignItems: "center", justifyContent: "space-between",
//               padding: "20px 24px",
//               borderBottom: `1px solid ${t.border}`,
//             }}>
//               <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//                 <div style={{
//                   width: 34, height: 34, borderRadius: 10,
//                   display: "flex", alignItems: "center", justifyContent: "center",
//                   background: "rgba(251,146,60,0.1)", border: "1px solid rgba(251,146,60,0.2)",
//                 }}>
//                   <FileText size={15} color="#fb923c" />
//                 </div>
//                 <div>
//                   <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 13, color: t.text, display: "block" }}>All Assessments</span>
//                   <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 10, color: t.textMuted }}>Click any row to expand details</span>
//                 </div>
//               </div>
//               <span style={{
//                 fontSize: 9, fontWeight: 700, letterSpacing: "0.1em",
//                 padding: "4px 12px", borderRadius: 999, textTransform: "uppercase",
//                 background: t.pillBg, border: `1px solid ${t.pillBorder}`, color: t.pillText,
//                 fontFamily: "'Poppins',sans-serif",
//               }}>{assessments.length} items</span>
//             </div>

//             {/* Rows */}
//             <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 10 }}>
//               {assessments.map((item, idx) => (
//                 <QuizRow key={item.id} item={item} index={idx} t={t} navigate={navigate} />
//               ))}

//               {assessments.length === 0 && (
//                 <div style={{
//                   display: "flex", flexDirection: "column", alignItems: "center",
//                   justifyContent: "center", padding: "60px 0", gap: 14,
//                 }}>
//                   <div style={{
//                     width: 64, height: 64, borderRadius: 18,
//                     display: "flex", alignItems: "center", justifyContent: "center",
//                     border: `1.5px dashed ${t.emptyBorder}`, background: t.emptyBg,
//                   }}>
//                     <Award size={26} color={t.emptyIcon} />
//                   </div>
//                   <div style={{ textAlign: "center" }}>
//                     <p style={{ fontSize: 14, fontWeight: 700, color: t.text, margin: 0, fontFamily: "'Poppins',sans-serif" }}>All caught up!</p>
//                     <p style={{ fontSize: 11, color: t.textMuted, margin: "4px 0 0", fontFamily: "'Poppins',sans-serif" }}>No assessments available at the moment 🎉</p>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//         </div>
//       </div>
//     </>
//   );
// };

// export default Assessments;old ui 












import {
  Award,
  Calendar,
  Clock,
  FileText,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Activity,
  ArrowUpRight,
  Zap,
  CheckCircle2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import assessmentService from "../services/assessmentService";
import { progressService } from "../services/progressService";

/* ═══════════════════════════════════════════════
   TOKEN HELPER (from file 1)
═══════════════════════════════════════════════ */
const getEmailFromToken = () => {
  try {
    const token = localStorage.getItem("lms_token");
    if (!token) return null;
    return JSON.parse(atob(token.split(".")[1])).sub;
  } catch {
    return null;
  }
};

/* ═══════════════════════════════════════════════
   THEME TOKEN MAP
═══════════════════════════════════════════════ */
const T = {
  dark: {
    pageBg: "#0a0a0a",
    cardBg: "#111111",
    cardBgHov: "#161616",
    heroBg: "#141414",
    border: "rgba(255,255,255,0.06)",
    borderHov: "rgba(255,255,255,0.14)",
    borderHero: "rgba(255,255,255,0.07)",
    text: "#ffffff",
    textSub: "rgba(255,255,255,0.3)",
    textMuted: "rgba(255,255,255,0.2)",
    textLabel: "rgba(255,255,255,0.22)",
    pillBg: "rgba(255,255,255,0.04)",
    pillBorder: "rgba(255,255,255,0.07)",
    pillText: "rgba(255,255,255,0.25)",
    iconBg: "rgba(255,255,255,0.05)",
    iconBorder: "rgba(255,255,255,0.08)",
    gridLine: "rgba(255,255,255,0.5)",
    barBg: "rgba(255,255,255,0.05)",
    actBar: "rgba(255,255,255,0.5)",
    actIcon: "rgba(255,255,255,0.3)",
    actBg: "rgba(255,255,255,0.04)",
    actBorder: "rgba(255,255,255,0.07)",
    navBtnBg: "rgba(255,255,255,0.04)",
    navBtnBorder: "rgba(255,255,255,0.08)",
    shadow: "0 4px 20px rgba(0,0,0,0.4)",
    shadowHov: "0 20px 60px rgba(0,0,0,0.6)",
    emptyBorder: "rgba(255,255,255,0.07)",
    emptyBg: "rgba(255,255,255,0.02)",
    emptyIcon: "rgba(255,255,255,0.12)",
    recentItemBg: "rgba(255,255,255,0.03)",
    recentItemBorder: "rgba(255,255,255,0.05)",
    recentItemBgHov: "rgba(255,255,255,0.06)",
    rowHov: "rgba(255,255,255,0.04)",
    collapseHdr: "rgba(255,255,255,0.03)",
  },
  light: {
    pageBg: "#f1f5f9",
    cardBg: "#ffffff",
    cardBgHov: "#f8fafc",
    heroBg: "#ffffff",
    border: "#e2e8f0",
    borderHov: "#cbd5e1",
    borderHero: "#e2e8f0",
    text: "#0f172a",
    textSub: "#64748b",
    textMuted: "#94a3b8",
    textLabel: "#94a3b8",
    pillBg: "#f1f5f9",
    pillBorder: "#e2e8f0",
    pillText: "#94a3b8",
    iconBg: "#f8fafc",
    iconBorder: "#e2e8f0",
    gridLine: "rgba(0,0,0,0.12)",
    barBg: "#f1f5f9",
    actBar: "#94a3b8",
    actIcon: "#94a3b8",
    actBg: "#f8fafc",
    actBorder: "#e2e8f0",
    navBtnBg: "#f8fafc",
    navBtnBorder: "#e2e8f0",
    shadow: "0 1px 8px rgba(0,0,0,0.07)",
    shadowHov: "0 8px 32px rgba(0,0,0,0.10)",
    emptyBorder: "#e2e8f0",
    emptyBg: "#f8fafc",
    emptyIcon: "#cbd5e1",
    recentItemBg: "#f8fafc",
    recentItemBorder: "#e2e8f0",
    recentItemBgHov: "#f1f5f9",
    rowHov: "#f8fafc",
    collapseHdr: "#f8fafc",
  },
};

/* ═══════════════════════════════════════════════
   STAT CARD
═══════════════════════════════════════════════ */
const StatCard = ({ icon: Icon, value, label, color, t, extra }) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? t.cardBgHov : t.cardBg,
        border: `1px solid ${hov ? t.borderHov : t.border}`,
        boxShadow: hov ? `${t.shadowHov}, 0 0 40px ${color}12` : t.shadow,
        borderRadius: 20,
        padding: "22px 22px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        transition: "all 0.25s ease",
        position: "relative",
        overflow: "hidden",
        cursor: "default",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -20,
          right: -20,
          width: 90,
          height: 90,
          borderRadius: "50%",
          background: color,
          filter: "blur(40px)",
          opacity: hov ? 0.15 : 0.04,
          transition: "opacity 0.4s",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: `${color}18`,
            border: `1px solid ${color}30`,
          }}
        >
          <Icon size={19} color={color} strokeWidth={2} />
        </div>
        <ArrowUpRight
          size={13}
          style={{ color, opacity: hov ? 0.7 : 0, transition: "opacity 0.2s" }}
        />
      </div>
      <div>
        <p
          style={{
            fontSize: 40,
            fontWeight: 800,
            lineHeight: 1,
            fontFamily: "'Poppins',sans-serif",
            color: t.text,
            margin: 0,
          }}
        >
          {value}
        </p>
        <p
          style={{
            fontSize: 10,
            marginTop: 6,
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: t.textMuted,
            fontFamily: "'Poppins',sans-serif",
            margin: "6px 0 0",
          }}
        >
          {label}
        </p>
        {/* ✅ Progress bar for "Submitted" stat card */}
        {extra !== undefined && (
          <div
            style={{
              marginTop: 8,
              width: "80px",
              background: t.barBg,
              borderRadius: 99,
              height: 4,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                borderRadius: 99,
                background: color,
                width: `${extra}%`,
                transition: "width 0.65s ease",
              }}
            />
          </div>
        )}
      </div>
      <div
        style={{
          height: 2,
          background: t.barBg,
          borderRadius: 99,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            borderRadius: 99,
            background: color,
            width: hov ? "65%" : "20%",
            transition: "width 0.65s ease",
            opacity: 0.85,
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: hov ? "60%" : "30%",
          height: 1,
          background: `linear-gradient(90deg,${color},transparent)`,
          transition: "width 0.5s ease",
          opacity: 0.5,
        }}
      />
    </div>
  );
};

/* ═══════════════════════════════════════════════
   COLLAPSIBLE QUIZ ROW
═══════════════════════════════════════════════ */
const QuizRow = ({ item, index, t, navigate, isSubmitted }) => {
  const [open, setOpen] = useState(false);
  const [hov, setHov] = useState(false);

  // ✅ Different accent colors for submitted vs pending
  const accentColor = isSubmitted ? "#34d399" : "#fb923c";
  const gradientEnd = isSubmitted ? "#059669" : "#ef4444";

  return (
    <div
      style={{
        borderRadius: 16,
        border: `1px solid ${open ? accentColor + "40" : hov ? t.borderHov : t.border}`,
        overflow: "hidden",
        boxShadow: open ? `0 0 24px ${accentColor}10` : t.shadow,
        transition: "all 0.25s ease",
        background: t.cardBg,
      }}
      className="quiz-row-anim"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {/* ── Header Row ── */}
      <div
        onClick={() => setOpen((p) => !p)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "16px 20px",
          cursor: "pointer",
          background: open ? `${accentColor}08` : hov ? t.cardBgHov : t.cardBg,
          transition: "background 0.2s",
          userSelect: "none",
        }}
      >
        {/* Index Badge */}
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: open ? `${accentColor}20` : t.iconBg,
            border: `1px solid ${open ? accentColor + "40" : t.iconBorder}`,
            fontFamily: "'Poppins',sans-serif",
            fontWeight: 800,
            fontSize: 12,
            color: open ? accentColor : t.textMuted,
            transition: "all 0.2s",
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </div>

        {/* Title */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              margin: 0,
              fontSize: 13,
              fontWeight: 700,
              color: open ? accentColor : t.text,
              fontFamily: "'Poppins',sans-serif",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              transition: "color 0.2s",
            }}
          >
            {item.title}
          </p>
          <p
            style={{
              margin: "2px 0 0",
              fontSize: 10,
              color: t.textMuted,
              fontFamily: "'Poppins',sans-serif",
            }}
          >
            Quiz ID: {item.id}
          </p>
        </div>

        {/* ✅ Status Badge — submitted or pending */}
        <span
          style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            padding: "4px 12px",
            borderRadius: 999,
            background: isSubmitted
              ? "rgba(52,211,153,0.12)"
              : "rgba(251,146,60,0.12)",
            color: accentColor,
            border: `1px solid ${accentColor}4D`,
            fontFamily: "'Poppins',sans-serif",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}
        >
          {isSubmitted && <CheckCircle2 size={9} />}
          {isSubmitted ? "Submitted" : "Pending"}
        </span>

        {/* Collapse Arrow */}
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: open ? `${accentColor}18` : t.actBg,
            border: `1px solid ${open ? accentColor + "30" : t.actBorder}`,
            transition: "all 0.2s",
          }}
        >
          <ChevronDown
            size={14}
            color={open ? accentColor : t.textMuted}
            style={{
              transition: "transform 0.3s",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </div>
      </div>

      {/* ── Collapsible Body ── */}
      <div
        style={{
          maxHeight: open ? 300 : 0,
          overflow: "hidden",
          transition: "max-height 0.35s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <div
          style={{
            borderTop: `1px solid ${accentColor}20`,
            padding: "20px",
            background: open ? `${accentColor}04` : "transparent",
          }}
        >
          {/* Detail Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginBottom: 18,
            }}
          >
            {[
              { label: "Quiz ID", value: item.id, icon: FileText, color: "#22d3ee" },
              {
                label: "Status",
                value: isSubmitted ? "Submitted" : "Pending Attempt",
                icon: isSubmitted ? CheckCircle2 : Clock,
                color: accentColor,
              },
              { label: "Type", value: "Assessment", icon: Award, color: "#a78bfa" },
              {
                label: "Scheduled",
                value: "Available Now",
                icon: Calendar,
                color: "#34d399",
              },
            ].map((det, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 14px",
                  borderRadius: 12,
                  background: t.recentItemBg,
                  border: `1px solid ${t.recentItemBorder}`,
                }}
              >
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: `${det.color}18`,
                    border: `1px solid ${det.color}30`,
                  }}
                >
                  <det.icon size={13} color={det.color} />
                </div>
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 9,
                      color: t.textMuted,
                      fontFamily: "'Poppins',sans-serif",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      fontWeight: 600,
                    }}
                  >
                    {det.label}
                  </p>
                  <p
                    style={{
                      margin: "2px 0 0",
                      fontSize: 12,
                      fontWeight: 700,
                      color: t.text,
                      fontFamily: "'Poppins',sans-serif",
                    }}
                  >
                    {det.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* ✅ CTA — different for submitted vs pending */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/student/quiz/${item.id}`);
            }}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: 12,
              background: `linear-gradient(135deg, ${accentColor}, ${gradientEnd})`,
              border: "none",
              cursor: "pointer",
              color: "#fff",
              fontSize: 12,
              fontWeight: 700,
              fontFamily: "'Poppins',sans-serif",
              letterSpacing: "0.05em",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              boxShadow: `0 4px 20px ${accentColor}30`,
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = `0 8px 28px ${accentColor}40`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = `0 4px 20px ${accentColor}30`;
            }}
          >
            {isSubmitted ? (
              <>
                <CheckCircle2 size={14} /> View Result <ChevronRight size={14} />
              </>
            ) : (
              <>
                <Zap size={14} /> Start Assessment <ChevronRight size={14} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   MAIN ASSESSMENTS PAGE
═══════════════════════════════════════════════ */
const Assessments = () => {
  const [assessments, setAssessments] = useState([]);

  // ✅ From file 1 — backend progress fields
  const [completedQuizIds, setCompletedQuizIds] = useState([]);
  const [quizPercentage, setQuizPercentage] = useState(0);

  const navigate = useNavigate();
  const studentEmail = getEmailFromToken();

  const [isDark, setIsDark] = useState(
    () =>
      typeof document !== "undefined" &&
      (document.documentElement.classList.contains("dark") ||
        document.documentElement.getAttribute("data-theme") === "dark")
  );

  useEffect(() => {
    const obs = new MutationObserver(() => {
      setIsDark(
        document.documentElement.classList.contains("dark") ||
          document.documentElement.getAttribute("data-theme") === "dark"
      );
    });
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });
    return () => obs.disconnect();
  }, []);

  const t = isDark ? T.dark : T.light;

  // ✅ From file 1 — loads quizzes + progress together
  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        const res = await assessmentService.getStudentQuizzes();
        const data = res.data || [];
        setAssessments(data);

        if (data.length > 0 && studentEmail) {
          const batchId = data[0]?.batchId;
          if (batchId) {
            try {
              const prog = await progressService.getQuizProgress(
                studentEmail,
                batchId
              );
              // ✅ backend field names: completedQuizIds, percentage
              setCompletedQuizIds(prog.data.completedQuizIds || []);
              setQuizPercentage(prog.data.percentage || 0);
            } catch {
              setCompletedQuizIds([]);
              setQuizPercentage(0);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load quizzes", err);
      }
    };
    loadQuizzes();
  }, []);

  // ✅ Derived counts from completedQuizIds
  const submittedCount = completedQuizIds.length;
  const pendingCount = assessments.length - submittedCount;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        .dfade{animation:fadeUp 0.45s ease both}
        .quiz-row-anim{animation:fadeUp 0.45s ease both}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.15}}
        .d1{animation:blink 1.6s ease infinite}
        .d2{animation:blink 1.6s 0.3s ease infinite}
        .d3{animation:blink 1.6s 0.6s ease infinite}
        @keyframes pulse-ring{0%{box-shadow:0 0 0 0 rgba(251,146,60,0.5)}70%{box-shadow:0 0 0 8px rgba(251,146,60,0)}100%{box-shadow:0 0 0 0 rgba(251,146,60,0)}}
        .livebadge{animation:pulse-ring 2.2s ease-out infinite}
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: t.pageBg,
          color: t.text,
          fontFamily: "'Poppins',sans-serif",
          transition: "background 0.3s, color 0.3s",
        }}
      >
        <div
          style={{
            padding: 24,
            maxWidth: 1300,
            margin: "0 auto",
            paddingBottom: 52,
          }}
        >
          {/* ═══ HERO ═══ */}
          <div
            className="dfade"
            style={{
              borderRadius: 24,
              padding: "30px 36px",
              background: t.heroBg,
              border: `1px solid ${t.borderHero}`,
              position: "relative",
              overflow: "hidden",
              marginBottom: 20,
              boxShadow: t.shadow,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                opacity: isDark ? 0.04 : 0.025,
                backgroundImage: `linear-gradient(${t.gridLine} 1px,transparent 1px),linear-gradient(90deg,${t.gridLine} 1px,transparent 1px)`,
                backgroundSize: "40px 40px",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "-30%",
                left: "40%",
                width: 300,
                height: 200,
                background:
                  "radial-gradient(ellipse,rgba(251,146,60,0.06),transparent 70%)",
                pointerEvents: "none",
              }}
            />

            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 16,
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    marginBottom: 10,
                  }}
                >
                  <Sparkles size={11} color={t.textSub} />
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      color: t.textSub,
                      fontFamily: "'Poppins',sans-serif",
                    }}
                  >
                    Assessment Portal
                  </span>
                </div>
                <h1
                  style={{
                    fontFamily: "'Poppins',sans-serif",
                    fontWeight: 900,
                    fontSize: "clamp(1.6rem,3vw,2.4rem)",
                    color: t.text,
                    margin: 0,
                    lineHeight: 1.1,
                    letterSpacing: "-0.02em",
                  }}
                >
                  Your Assessments
                </h1>
                <p
                  style={{
                    fontSize: 12,
                    color: t.textSub,
                    marginTop: 7,
                    fontWeight: 500,
                    fontFamily: "'Poppins',sans-serif",
                  }}
                >
                  Track your progress and attempt quizzes
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {/* ✅ Summary pill with submitted/pending counts from backend */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    background: t.actBg,
                    border: `1px solid ${t.actBorder}`,
                    borderRadius: 12,
                    padding: "8px 16px",
                    fontSize: 11,
                    fontWeight: 600,
                    fontFamily: "'Poppins',sans-serif",
                    color: t.textSub,
                  }}
                >
                  <span>{assessments.length} total</span>
                  <span
                    style={{
                      width: 1,
                      height: 14,
                      background: t.actBorder,
                    }}
                  />
                  <span style={{ color: "#34d399", fontWeight: 700 }}>
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#34d399",
                        display: "inline-block",
                        marginRight: 5,
                      }}
                    />
                    {submittedCount} submitted
                  </span>
                  <span
                    style={{
                      width: 1,
                      height: 14,
                      background: t.actBorder,
                    }}
                  />
                  <span style={{ color: "#fb923c", fontWeight: 700 }}>
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#fb923c",
                        display: "inline-block",
                        marginRight: 5,
                      }}
                    />
                    {pendingCount} pending
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: t.actBg,
                    border: `1px solid ${t.actBorder}`,
                    borderRadius: 10,
                    padding: "8px 14px",
                  }}
                >
                  <Activity size={12} color={t.actIcon} />
                  <div
                    style={{
                      display: "flex",
                      gap: 3,
                      alignItems: "flex-end",
                      height: 14,
                    }}
                  >
                    <span
                      className="d1"
                      style={{
                        width: 3,
                        height: 10,
                        borderRadius: 2,
                        background: t.actBar,
                        display: "block",
                      }}
                    />
                    <span
                      className="d2"
                      style={{
                        width: 3,
                        height: 14,
                        borderRadius: 2,
                        background: t.actBar,
                        display: "block",
                      }}
                    />
                    <span
                      className="d3"
                      style={{
                        width: 3,
                        height: 7,
                        borderRadius: 2,
                        background: t.actBar,
                        display: "block",
                      }}
                    />
                  </div>
                </div>
                <div
                  className="livebadge"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    background: "rgba(251,146,60,0.08)",
                    border: "1px solid rgba(251,146,60,0.3)",
                    borderRadius: 999,
                    padding: "8px 18px",
                    color: "#fb923c",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    fontFamily: "'Poppins',sans-serif",
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#fb923c",
                      display: "inline-block",
                    }}
                  />
                  LIVE
                </div>
              </div>
            </div>
          </div>

          {/* ═══ STAT CARDS — now with backend data ═══ */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(185px,1fr))",
              gap: 14,
              marginBottom: 20,
            }}
          >
            <StatCard
              icon={FileText}
              value={assessments.length}
              label="Total Assessments"
              color="#22d3ee"
              t={t}
            />
            <StatCard
              icon={Clock}
              value={pendingCount}
              label="Pending"
              color="#fb923c"
              t={t}
            />
            {/* ✅ Submitted card shows quizPercentage as a progress bar */}
            <StatCard
              icon={CheckCircle2}
              value={submittedCount}
              label="Submitted"
              color="#34d399"
              t={t}
              extra={quizPercentage}
            />
            <StatCard
              icon={Calendar}
              value="—"
              label="Due This Week"
              color="#a78bfa"
              t={t}
            />
          </div>

          {/* ═══ QUIZ LIST ═══ */}
          <div
            className="dfade"
            style={{
              background: t.cardBg,
              border: `1px solid ${t.border}`,
              borderRadius: 24,
              overflow: "hidden",
              boxShadow: t.shadow,
            }}
          >
            {/* Panel Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "20px 24px",
                borderBottom: `1px solid ${t.border}`,
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: 10 }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(251,146,60,0.1)",
                    border: "1px solid rgba(251,146,60,0.2)",
                  }}
                >
                  <FileText size={15} color="#fb923c" />
                </div>
                <div>
                  <span
                    style={{
                      fontFamily: "'Poppins',sans-serif",
                      fontWeight: 700,
                      fontSize: 13,
                      color: t.text,
                      display: "block",
                    }}
                  >
                    All Assessments
                  </span>
                  <span
                    style={{
                      fontFamily: "'Poppins',sans-serif",
                      fontSize: 10,
                      color: t.textMuted,
                    }}
                  >
                    Click any row to expand details
                  </span>
                </div>
              </div>
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  padding: "4px 12px",
                  borderRadius: 999,
                  textTransform: "uppercase",
                  background: t.pillBg,
                  border: `1px solid ${t.pillBorder}`,
                  color: t.pillText,
                  fontFamily: "'Poppins',sans-serif",
                }}
              >
                {assessments.length} items
              </span>
            </div>

            {/* Rows */}
            <div
              style={{
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {assessments.map((item, idx) => {
                // ✅ Check completedQuizIds from backend
                const isSubmitted = completedQuizIds.includes(item.id);
                return (
                  <QuizRow
                    key={item.id}
                    item={item}
                    index={idx}
                    t={t}
                    navigate={navigate}
                    isSubmitted={isSubmitted}
                  />
                );
              })}

              {assessments.length === 0 && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "60px 0",
                    gap: 14,
                  }}
                >
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 18,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: `1.5px dashed ${t.emptyBorder}`,
                      background: t.emptyBg,
                    }}
                  >
                    <Award size={26} color={t.emptyIcon} />
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <p
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: t.text,
                        margin: 0,
                        fontFamily: "'Poppins',sans-serif",
                      }}
                    >
                      All caught up!
                    </p>
                    <p
                      style={{
                        fontSize: 11,
                        color: t.textMuted,
                        margin: "4px 0 0",
                        fontFamily: "'Poppins',sans-serif",
                      }}
                    >
                      No assessments available at the moment 🎉
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Assessments;