// import { useState, useEffect, useRef } from "react";
// import {
//   getStudentStudyPlans,
//   getStudentStudyPlanById,
//   markStudyPlanProgress,
//   getStudentProblemById,
//   submitCodeForJudge,
//   runCode,
// } from "../services/assessmentService";
// import { getStudentClassroom } from "../services/batchService";
// import {
//   BookOpen,
//   ChevronLeft,
//   ChevronRight,
//   ChevronDown,
//   Play,
//   Zap,
//   Check,
//   RefreshCw,
//   AlertTriangle,
//   Target,
//   Calendar,
//   Trophy,
//   Layers,
//   FileText,
//   Clock,
// } from "lucide-react";

// const LANGUAGES = ["JAVA", "PYTHON", "JAVASCRIPT", "BASH"];
// const LANG_LABEL = {
//   JAVA: "Java",
//   PYTHON: "Python",
//   JAVASCRIPT: "JS",
//   BASH: "Bash",
// };
// const LANG_ICON = { JAVA: "☕", PYTHON: "🐍", JAVASCRIPT: "⚡", BASH: "🖥" };
// const DEFAULT_CODE = {
//   JAVA: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`,
//   PYTHON: `# Write your solution here\nprint("Hello, World!")`,
//   JAVASCRIPT: `process.stdin.resume();\nprocess.stdin.setEncoding('utf8');\nlet input = '';\nprocess.stdin.on('data', d => input += d);\nprocess.stdin.on('end', () => {\n    console.log("Hello, World!");\n});`,
//   BASH: `#!/bin/bash\necho "Hello, World!"`,
// };

// /* ── Theme tokens ── */
// const T = {
//   dark: {
//     pageBg: "#0f172a",
//     navBg: "rgba(11,17,30,0.97)",
//     cardBg: "rgba(255,255,255,0.025)",
//     cardBorder: "rgba(255,255,255,0.07)",
//     text: "#f8fafc",
//     textSub: "#94a3b8",
//     textMuted: "#475569",
//     pillBg: "rgba(255,255,255,0.05)",
//     pillBorder: "rgba(255,255,255,0.09)",
//     pillText: "#94a3b8",
//     divider: "rgba(255,255,255,0.06)",
//     inputBg: "#020617",
//     breadcrumb: "#475569",
//     breadcrumbActive: "#f8fafc",
//     statPillBg: "rgba(255,255,255,0.05)",
//     statPillBorder: "rgba(255,255,255,0.09)",
//     accentDot: "#7c3aed",
//     heroBg: "transparent",
//   },
//   light: {
//     pageBg: "#f8fafc",
//     navBg: "rgba(255,255,255,0.97)",
//     cardBg: "#ffffff",
//     cardBorder: "#e2e8f0",
//     text: "#0f172a",
//     textSub: "#475569",
//     textMuted: "#94a3b8",
//     pillBg: "#f1f5f9",
//     pillBorder: "#e2e8f0",
//     pillText: "#64748b",
//     divider: "#e2e8f0",
//     inputBg: "#f8fafc",
//     breadcrumb: "#94a3b8",
//     breadcrumbActive: "#0f172a",
//     statPillBg: "#f1f5f9",
//     statPillBorder: "#e2e8f0",
//     accentDot: "#7c3aed",
//     heroBg: "transparent",
//   },
// };

// const diffStyle = (d) =>
//   d === "EASY"
//     ? { color: "#22c55e", bg: "rgba(34,197,94,0.1)", border: "rgba(34,197,94,0.25)" }
//     : d === "MEDIUM"
//     ? { color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.25)" }
//     : { color: "#ef4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.25)" };

// const statusColor = (s) =>
//   s === "SUCCESS" ? "#22c55e" : s === "COMPILE_ERROR" ? "#f59e0b" : "#ef4444";
// const verdictColor = (v) =>
//   v === "ACCEPTED" ? "#22c55e" : v === "PARTIAL" ? "#f59e0b" : "#ef4444";

// /* ── Arc Progress ── */
// function ArcProgress({ pct, size = 80, color = "#6366f1" }) {
//   const r = (size - 10) / 2;
//   const circ = 2 * Math.PI * r;
//   const offset = circ - (pct / 100) * circ;
//   return (
//     <svg width={size} height={size} style={{ filter: `drop-shadow(0 0 8px ${color}60)` }}>
//       <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={7} />
//       <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={7}
//         strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
//         style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%", transition: "stroke-dashoffset 0.9s cubic-bezier(0.4,0,0.2,1)" }} />
//       <text x="50%" y="50%" textAnchor="middle" dy="0.35em"
//         style={{ fontSize: size * 0.195, fontWeight: 800, fill: "#f8fafc", fontFamily: "'Outfit', sans-serif" }}>
//         {pct}%
//       </text>
//     </svg>
//   );
// }

// function SmallArc({ pct, size = 44, color = "#6366f1" }) {
//   const r = (size - 7) / 2;
//   const circ = 2 * Math.PI * r;
//   const offset = circ - (pct / 100) * circ;
//   return (
//     <svg width={size} height={size}>
//       <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={5} />
//       <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={5}
//         strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
//         style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%", transition: "stroke-dashoffset 0.6s ease" }} />
//       <text x="50%" y="50%" textAnchor="middle" dy="0.35em"
//         style={{ fontSize: size * 0.22, fontWeight: 800, fill: color, fontFamily: "'Outfit', sans-serif" }}>
//         {pct}%
//       </text>
//     </svg>
//   );
// }

// function Skeleton({ w = "100%", h = 16, r = 8, style = {} }) {
//   return (
//     <div style={{
//       width: w, height: h, borderRadius: r,
//       background: "linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%)",
//       backgroundSize: "400px 100%",
//       animation: "shimmer 1.6s infinite linear",
//       ...style,
//     }} />
//   );
// }

// /* ── useTheme hook ── */
// function useTheme() {
//   const [isDark, setIsDark] = useState(
//     () => typeof document !== "undefined" &&
//       (document.documentElement.classList.contains("dark") ||
//        document.documentElement.getAttribute("data-theme") === "dark")
//   );
//   useEffect(() => {
//     const obs = new MutationObserver(() =>
//       setIsDark(
//         document.documentElement.classList.contains("dark") ||
//         document.documentElement.getAttribute("data-theme") === "dark"
//       )
//     );
//     obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
//     return () => obs.disconnect();
//   }, []);
//   return isDark ? T.dark : T.light;
// }

// const G = `
//   @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
//   *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
//   ::-webkit-scrollbar { width: 5px; height: 5px; }
//   ::-webkit-scrollbar-track { background: transparent; }
//   ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.2); border-radius: 10px; }
//   ::-webkit-scrollbar-thumb:hover { background: rgba(99,102,241,0.35); }
//   @keyframes spin { to { transform: rotate(360deg); } }
//   @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
//   @keyframes shimmer { from { background-position: -400px 0; } to { background-position: 400px 0; } }
//   @keyframes slide-in { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }
//   .fade-up { animation: fadeUp 0.32s ease both; }
//   .slide-in { animation: slide-in 0.25s ease both; }
//   .card-hover {
//     transition: transform 0.2s cubic-bezier(0.4,0,0.2,1), box-shadow 0.2s ease, border-color 0.2s ease;
//     cursor: pointer;
//   }
//   .card-hover:hover { transform: translateY(-3px); }
//   .btn-primary {
//     display: inline-flex; align-items: center; gap: 6px;
//     padding: 8px 18px; border: none; border-radius: 10px; cursor: pointer;
//     font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 13px;
//     transition: all 0.16s ease;
//   }
//   .btn-primary:hover { filter: brightness(1.1); transform: translateY(-1px); }
//   .btn-primary:active { transform: scale(0.97); }
//   .btn-ghost {
//     display: inline-flex; align-items: center; gap: 5px;
//     padding: 6px 14px; border-radius: 8px; cursor: pointer;
//     font-family: 'Outfit', sans-serif; font-weight: 600; font-size: 13px;
//     transition: all 0.15s ease;
//   }
//   .btn-ghost:hover { opacity: 0.8; }
//   .btn-ghost:active { transform: scale(0.97); }
//   .item-row {
//     display: flex; align-items: center; gap: 14px;
//     padding: 14px 24px;
//     border-bottom: 1px solid rgba(255,255,255,0.04);
//     transition: background 0.15s ease;
//   }
//   .item-row:hover { background: rgba(255,255,255,0.025); }
//   .item-row:last-child { border-bottom: none; }
//   .lang-tab {
//     padding: 5px 12px; border-radius: 7px; border: none; cursor: pointer;
//     font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 12px;
//     transition: all 0.14s ease;
//   }
//   .section-header-row {
//     display: flex; align-items: center; justify-content: space-between;
//     padding: 16px 22px; cursor: pointer;
//     transition: background 0.15s ease;
//     border-left: 3px solid transparent;
//   }
//   .section-header-row:hover { background: rgba(255,255,255,0.02); }
//   .output-tab {
//     padding: 5px 14px; border-radius: 7px; border: none; cursor: pointer;
//     font-family: 'Outfit', sans-serif; font-weight: 600; font-size: 12px;
//     transition: all 0.14s ease;
//   }
// `;

// export default function StudentStudyPlanPage() {
//   const t = useTheme();
//   const isDark = t === T.dark || t.pageBg === "#0f172a";

//   const [batchId, setBatchId] = useState(null);
//   const [batchLoading, setBatchLoading] = useState(true);
//   const [batchError, setBatchError] = useState(false);
//   const [view, setView] = useState("list");
//   const [plans, setPlans] = useState([]);
//   const [plansLoading, setPlansLoading] = useState(false);
//   const [selectedPlan, setSelectedPlan] = useState(null);
//   const [planLoading, setPlanLoading] = useState(false);
//   const [expandedSection, setExpandedSection] = useState(null);
//   const [compilerItem, setCompilerItem] = useState(null);
//   const [problemDetail, setProblemDetail] = useState(null);
//   const [problemLoading, setProblemLoading] = useState(false);
//   const [language, setLanguage] = useState("PYTHON");
//   const [code, setCode] = useState(DEFAULT_CODE["PYTHON"]);
//   const [runOutput, setRunOutput] = useState(null);
//   const [judgeResult, setJudgeResult] = useState(null);
//   const [runLoading, setRunLoading] = useState(false);
//   const [submitLoading, setSubmitLoading] = useState(false);
//   const [canMarkDone, setCanMarkDone] = useState(false);
//   const [markingItem, setMarkingItem] = useState(null);
//   const [flashMsg, setFlashMsg] = useState("");
//   const [flashType, setFlashType] = useState("ok");
//   const [activeOutputTab, setActiveOutputTab] = useState("output");
//   const textareaRef = useRef(null);

//   useEffect(() => {
//     const init = async () => {
//       setBatchLoading(true);
//       try {
//         const res = await getStudentClassroom();
//         const classroom = res?.data || res;
//         const id = classroom?.batchId || classroom?.id || null;
//         if (id) setBatchId(id);
//         else setBatchError(true);
//       } catch {
//         setBatchError(true);
//       } finally {
//         setBatchLoading(false);
//       }
//     };
//     init();
//   }, []);

//   useEffect(() => {
//     if (batchId) fetchPlans();
//   }, [batchId]);

//   const fetchPlans = async () => {
//     setPlansLoading(true);
//     try {
//       const res = await getStudentStudyPlans(batchId);
//       setPlans(res.data || []);
//     } catch {
//       setPlans([]);
//     } finally {
//       setPlansLoading(false);
//     }
//   };

//   const flash = (msg, type = "ok") => {
//     setFlashMsg(msg);
//     setFlashType(type);
//     setTimeout(() => setFlashMsg(""), 3500);
//   };

//   const openPlan = async (plan) => {
//     setPlanLoading(true);
//     setView("detail");
//     try {
//       const res = await getStudentStudyPlanById(plan.id);
//       setSelectedPlan(res.data);
//       setExpandedSection(res.data?.sections?.[0]?.id ?? null);
//     } catch {
//       setSelectedPlan(null);
//     } finally {
//       setPlanLoading(false);
//     }
//   };

//   const refreshPlanDetail = async () => {
//     if (!selectedPlan) return;
//     try {
//       const res = await getStudentStudyPlanById(selectedPlan.id);
//       setSelectedPlan(res.data);
//     } catch {}
//   };

//   const openCompiler = async (item, sectionId) => {
//     setProblemLoading(true);
//     setView("compiler");
//     setCompilerItem({ item, sectionId });
//     setRunOutput(null);
//     setJudgeResult(null);
//     setCanMarkDone(false);
//     setCode(DEFAULT_CODE[language]);
//     try {
//       const res = await getStudentProblemById(item.problemId);
//       setProblemDetail(res.data);
//     } catch {
//       setProblemDetail(null);
//     } finally {
//       setProblemLoading(false);
//     }
//   };

//   const handleLanguageChange = (lang) => {
//     setLanguage(lang);
//     setCode(DEFAULT_CODE[lang]);
//     setRunOutput(null);
//     setJudgeResult(null);
//   };

//   const handleRun = async () => {
//     setRunLoading(true);
//     setRunOutput(null);
//     setJudgeResult(null);
//     setActiveOutputTab("output");
//     try {
//       const stdin = problemDetail?.sampleInput || "";
//       const res = await runCode(batchId, language, code, stdin);
//       setRunOutput(res.data);
//     } catch (e) {
//       setRunOutput({ output: e.response?.data?.message || "Run failed.", status: "RUNTIME_ERROR" });
//     } finally {
//       setRunLoading(false);
//     }
//   };

//   const handleSubmit = async () => {
//     if (!problemDetail) return;
//     setSubmitLoading(true);
//     setJudgeResult(null);
//     setRunOutput(null);
//     setActiveOutputTab("results");
//     try {
//       const res = await submitCodeForJudge(problemDetail.id, batchId, language, code);
//       const result = res.data;
//       setJudgeResult(result);
//       if (result.overallVerdict === "ACCEPTED" || result.overallVerdict === "PARTIAL" || result.marksObtained > 0) {
//         setCanMarkDone(true);
//         flash("🎉 Solution passed! Click Mark as Done to save your progress.", "ok");
//       } else {
//         flash("Solution did not pass. Review and try again.", "err");
//       }
//     } catch {
//       setJudgeResult({ overallVerdict: "ERROR", marksObtained: 0, totalMarks: 0 });
//       flash("Submission failed. Please try again.", "err");
//     } finally {
//       setSubmitLoading(false);
//     }
//   };

//   const handleMarkDone = async () => {
//     if (!compilerItem || !judgeResult) return;
//     setMarkingItem(compilerItem.item.id);
//     try {
//       await markStudyPlanProgress({
//         studyPlanItemId: compilerItem.item.id,
//         batchId,
//         problemId: compilerItem.item.problemId,
//         marksObtained: judgeResult.marksObtained || 0,
//       });
//       flash("✓ Problem completed! Keep it up!", "ok");
//       await refreshPlanDetail();
//       setView("detail");
//       setCompilerItem(null);
//       setProblemDetail(null);
//       setJudgeResult(null);
//       setCanMarkDone(false);
//     } catch {
//       flash("Could not save progress. Please try again.", "err");
//     } finally {
//       setMarkingItem(null);
//     }
//   };

//   const handleTabKey = (e) => {
//     if (e.key === "Tab") {
//       e.preventDefault();
//       const ta = textareaRef.current;
//       const start = ta.selectionStart, end = ta.selectionEnd;
//       const newCode = code.substring(0, start) + "    " + code.substring(end);
//       setCode(newCode);
//       setTimeout(() => { ta.selectionStart = ta.selectionEnd = start + 4; }, 0);
//     }
//   };

//   const planProgress = (p) => {
//     if (!p?.sections?.length) return 0;
//     const total = p.sections.reduce((s, sec) => s + (sec.items?.length || 0), 0);
//     const done = p.sections.reduce((s, sec) => s + (sec.items?.filter((i) => i.completed)?.length || 0), 0);
//     return total ? Math.round((done / total) * 100) : 0;
//   };

//   /* ── Shared nav styles ── */
//   const navStyle = {
//     height: 56,
//     background: t.navBg,
//     backdropFilter: "blur(16px)",
//     borderBottom: `1px solid ${t.divider}`,
//     display: "flex",
//     alignItems: "center",
//     padding: "0 28px",
//     justifyContent: "space-between",
//     position: "sticky",
//     top: 0,
//     zIndex: 50,
//     boxShadow: isDark ? "none" : "0 1px 3px rgba(0,0,0,0.06)",
//   };

//   /* ── LOADING ── */
//   if (batchLoading)
//     return (
//       <>
//         <style>{G}</style>
//         <div style={{ minHeight: "100vh", background: t.pageBg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, fontFamily: "'Outfit', sans-serif" }}>
//           <div style={{ position: "relative" }}>
//             <div style={{ width: 48, height: 48, border: "2px solid rgba(99,102,241,0.15)", borderTop: "2px solid #6366f1", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
//           </div>
//           <div style={{ textAlign: "center" }}>
//             <p style={{ color: t.text, fontSize: 14, fontWeight: 600 }}>Loading workspace</p>
//             <p style={{ color: t.textMuted, fontSize: 12, marginTop: 4 }}>Connecting to your batch…</p>
//           </div>
//         </div>
//       </>
//     );

//   if (batchError)
//     return (
//       <>
//         <style>{G}</style>
//         <div style={{ minHeight: "100vh", background: t.pageBg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, fontFamily: "'Outfit', sans-serif" }}>
//           <div style={{ width: 52, height: 52, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
//             <AlertTriangle size={22} color="#ef4444" />
//           </div>
//           <div style={{ textAlign: "center" }}>
//             <p style={{ color: t.text, fontSize: 15, fontWeight: 700 }}>Unable to load batch</p>
//             <p style={{ color: t.textMuted, fontSize: 13, marginTop: 6 }}>Please contact your trainer to resolve this.</p>
//           </div>
//         </div>
//       </>
//     );

//   /* ── FLASH BAR ── */
//   const FlashBar = () =>
//     flashMsg ? (
//       <div style={{
//         padding: "9px 24px", fontSize: 13, textAlign: "center", fontWeight: 600,
//         background: flashType === "ok" ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)",
//         borderBottom: `1px solid ${flashType === "ok" ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
//         color: flashType === "ok" ? "#22c55e" : "#ef4444",
//         fontFamily: "'Outfit', sans-serif",
//       }}>
//         {flashMsg}
//       </div>
//     ) : null;

//   /* ══════════════════════════════════════════════════════
//      COMPILER VIEW  (dark only — code editor)
//   ══════════════════════════════════════════════════════ */
//   if (view === "compiler") {
//     const problem = problemDetail;
//     const planColor = selectedPlan?.thumbnailColor || "#6366f1";
//     const dc = problem ? diffStyle(problem.difficulty) : null;
//     const lineCount = code.split("\n").length;

//     return (
//       <>
//         <style>{G + `.lang-tab:hover { background: rgba(255,255,255,0.06) !important; } .tc-pill { transition: transform 0.15s ease; } .tc-pill:hover { transform: scale(1.02); }`}</style>
//         <div style={{ height: "100vh", background: "#0f172a", display: "flex", flexDirection: "column", fontFamily: "'Outfit', sans-serif", overflow: "hidden" }}>

//           {/* Judging overlay */}
//           {(runLoading || submitLoading) && (
//             <div style={{ position: "fixed", inset: 0, background: "rgba(10,15,30,0.88)", backdropFilter: "blur(10px)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}>
//               <div style={{ background: "linear-gradient(145deg, #131c30 0%, #1a2540 100%)", border: "1px solid rgba(99,102,241,0.25)", borderRadius: 20, padding: "44px 60px", display: "flex", flexDirection: "column", alignItems: "center", gap: 18, boxShadow: "0 40px 80px rgba(0,0,0,0.6)" }}>
//                 <div style={{ position: "relative" }}>
//                   <div style={{ width: 52, height: 52, border: `2px solid rgba(99,102,241,0.15)`, borderTop: `2px solid ${planColor}`, borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
//                 </div>
//                 <div>
//                   <div style={{ fontSize: 15, fontWeight: 800, color: "#f8fafc", textAlign: "center", marginBottom: 5 }}>
//                     {submitLoading ? "⚡ Judging your code" : "▶ Running code"}
//                   </div>
//                   <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", textAlign: "center" }}>
//                     {submitLoading ? "Running against all test cases…" : "Testing with sample input…"}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Top Nav */}
//           <div style={{ height: 52, background: "rgba(13,19,33,0.98)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", padding: "0 18px", gap: 10, flexShrink: 0, zIndex: 100 }}>
//             <button className="btn-ghost" onClick={() => { setView("detail"); setCompilerItem(null); setProblemDetail(null); setJudgeResult(null); setCanMarkDone(false); }}
//               style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.65)" }}>
//               <ChevronLeft size={14} /> Back
//             </button>
//             <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.08)" }} />
//             <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
//               <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>Study Plans</span>
//               <ChevronRight size={12} color="rgba(255,255,255,0.2)" />
//               {selectedPlan && <span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", fontWeight: 500 }}>{selectedPlan.title}</span>}
//               <ChevronRight size={12} color="rgba(255,255,255,0.2)" />
//               <span style={{ fontSize: 12, color: "#f8fafc", fontWeight: 700 }}>{problem?.title || "Problem"}</span>
//             </div>
//             {problem && dc && (
//               <span style={{ fontSize: 10, fontWeight: 700, background: dc.bg, color: dc.color, border: `1px solid ${dc.border}`, borderRadius: 20, padding: "2px 9px", letterSpacing: "0.04em" }}>
//                 {problem.difficulty}
//               </span>
//             )}
//             <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
//               <div style={{ display: "flex", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 9, padding: 3, gap: 2 }}>
//                 {LANGUAGES.map((l) => (
//                   <button key={l} className="lang-tab" onClick={() => handleLanguageChange(l)}
//                     style={{ background: language === l ? planColor : "transparent", color: language === l ? "#fff" : "rgba(255,255,255,0.4)", boxShadow: language === l ? `0 2px 8px ${planColor}50` : "none" }}>
//                     {LANG_ICON[l]} {LANG_LABEL[l]}
//                   </button>
//                 ))}
//               </div>
//               <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.08)" }} />
//               <button className="btn-ghost" onClick={handleRun} disabled={runLoading || submitLoading}
//                 style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.65)" }}>
//                 <Play size={12} fill="currentColor" /> Run
//               </button>
//               <button className="btn-primary" onClick={handleSubmit} disabled={runLoading || submitLoading || !problem}
//                 style={{ background: `linear-gradient(135deg, ${planColor} 0%, ${planColor}bb 100%)`, color: "#fff", boxShadow: `0 4px 12px ${planColor}40`, opacity: (runLoading || submitLoading || !problem) ? 0.6 : 1 }}>
//                 <Zap size={13} /> Submit
//               </button>
//               {canMarkDone && (
//                 <button className="btn-primary" onClick={handleMarkDone} disabled={!!markingItem}
//                   style={{ background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)", color: "#fff", boxShadow: "0 4px 12px rgba(34,197,94,0.35)", whiteSpace: "nowrap", opacity: markingItem ? 0.7 : 1 }}>
//                   {markingItem ? <><RefreshCw size={12} /> Saving…</> : <><Check size={12} /> Mark Done</>}
//                 </button>
//               )}
//             </div>
//           </div>

//           <FlashBar />

//           {canMarkDone && (
//             <div style={{ background: "rgba(245,158,11,0.07)", borderBottom: "1px solid rgba(245,158,11,0.18)", padding: "8px 24px", fontSize: 12, color: "#f59e0b", textAlign: "center", flexShrink: 0, fontWeight: 500, fontFamily: "'Outfit',sans-serif" }}>
//               <Trophy size={13} style={{ display: "inline", marginRight: 6, verticalAlign: "middle" }} />
//               Your solution passed! Click <strong>Mark Done</strong> in the toolbar to save your progress.
//             </div>
//           )}

//           {/* Editor Layout */}
//           <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
//             {/* LEFT: Problem Panel */}
//             <div style={{ width: 370, flexShrink: 0, borderRight: "1px solid rgba(255,255,255,0.06)", overflowY: "auto", background: "#0d1424" }}>
//               {problemLoading ? (
//                 <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
//                   <Skeleton h={22} w="70%" /><Skeleton h={14} w="40%" /><Skeleton h={80} /><Skeleton h={60} /><Skeleton h={100} />
//                 </div>
//               ) : !problem ? (
//                 <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 12, padding: 32 }}>
//                   <AlertTriangle size={36} color="#ef4444" />
//                   <p style={{ color: "#ef4444", fontSize: 14, textAlign: "center" }}>Could not load problem details.</p>
//                 </div>
//               ) : (
//                 <div style={{ padding: "24px 22px 56px" }}>
//                   <h2 style={{ fontSize: 18, fontWeight: 800, color: "#f8fafc", lineHeight: 1.3, marginBottom: 12 }}>{problem.title}</h2>
//                   <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 22, flexWrap: "wrap" }}>
//                     {dc && <span style={{ fontSize: 10, fontWeight: 700, background: dc.bg, color: dc.color, border: `1px solid ${dc.border}`, borderRadius: 20, padding: "2px 9px" }}>{problem.difficulty}</span>}
//                     <span style={{ fontSize: 10, fontWeight: 700, background: "rgba(245,158,11,0.1)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 20, padding: "2px 9px", display: "flex", alignItems: "center", gap: 3 }}>
//                       <Trophy size={10} /> {problem.totalMarks} pts
//                     </span>
//                   </div>
//                   {[
//                     { label: "Description", content: problem.description, mono: false },
//                     { label: "Input Format", content: problem.inputFormat, mono: false },
//                     { label: "Output Format", content: problem.outputFormat, mono: false },
//                     { label: "Constraints", content: problem.constraints, mono: true },
//                   ].filter((s) => s.content).map(({ label, content, mono }) => (
//                     <div key={label} style={{ marginBottom: 20 }}>
//                       <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(148,163,184,0.6)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 7 }}>{label}</div>
//                       {mono ? (
//                         <div style={{ background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.15)", borderRadius: 9, padding: "10px 12px", fontSize: 12, color: "#a5b4fc", fontFamily: "'JetBrains Mono', monospace", whiteSpace: "pre-wrap", lineHeight: 1.7 }}>{content}</div>
//                       ) : (
//                         <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.75 }}>{content}</p>
//                       )}
//                     </div>
//                   ))}
//                   {(problem.sampleInput || problem.sampleOutput) && (
//                     <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
//                       {problem.sampleInput && (
//                         <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "10px 12px" }}>
//                           <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(148,163,184,0.5)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 7 }}>Input</div>
//                           <pre style={{ fontSize: 12, color: "#e2e8f0", fontFamily: "'JetBrains Mono', monospace", whiteSpace: "pre-wrap" }}>{problem.sampleInput}</pre>
//                         </div>
//                       )}
//                       {problem.sampleOutput && (
//                         <div style={{ background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.15)", borderRadius: 10, padding: "10px 12px" }}>
//                           <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(34,197,94,0.6)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 7 }}>Output</div>
//                           <pre style={{ fontSize: 12, color: "#22c55e", fontFamily: "'JetBrains Mono', monospace", whiteSpace: "pre-wrap" }}>{problem.sampleOutput}</pre>
//                         </div>
//                       )}
//                     </div>
//                   )}
//                   {problem.visibleTestCases?.filter((tc) => !tc.isHidden).length > 0 && (
//                     <div style={{ marginBottom: 20 }}>
//                       <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(148,163,184,0.6)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 9 }}>Sample Test Cases</div>
//                       {problem.visibleTestCases.filter((tc) => !tc.isHidden).map((tc, i) => (
//                         <div key={tc.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 9, padding: "10px 12px", marginBottom: 7 }}>
//                           <div style={{ fontSize: 10, color: "rgba(148,163,184,0.5)", fontWeight: 600, marginBottom: 7 }}>Case {i + 1}</div>
//                           {tc.input && (
//                             <div style={{ display: "flex", gap: 9, marginBottom: 5, fontSize: 12, alignItems: "center" }}>
//                               <span style={{ color: "rgba(148,163,184,0.5)", minWidth: 50, fontWeight: 600, fontSize: 10 }}>Input</span>
//                               <code style={{ color: "#a5b4fc", background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: 4, fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>{tc.input}</code>
//                             </div>
//                           )}
//                           <div style={{ display: "flex", gap: 9, fontSize: 12, alignItems: "center" }}>
//                             <span style={{ color: "rgba(148,163,184,0.5)", minWidth: 50, fontWeight: 600, fontSize: 10 }}>Expected</span>
//                             <code style={{ color: "#22c55e", background: "rgba(34,197,94,0.08)", padding: "2px 7px", borderRadius: 4, fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>{tc.expectedOutput}</code>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                   <div style={{ background: `linear-gradient(135deg, ${planColor}0f, ${planColor}06)`, border: `1px solid ${planColor}20`, borderRadius: 10, padding: "12px 14px" }}>
//                     <div style={{ fontSize: 10, fontWeight: 700, color: planColor, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.08em" }}>Getting credit</div>
//                     <div style={{ fontSize: 12, color: "rgba(148,163,184,0.7)", lineHeight: 1.6 }}>
//                       Write your solution → <span style={{ color: "#e2e8f0", fontWeight: 600 }}>⚡ Submit</span> → once it passes, click <span style={{ color: "#22c55e", fontWeight: 600 }}>✓ Mark Done</span>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* RIGHT: Code Editor + Output */}
//             <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
//               <div style={{ flex: 1, display: "flex", overflow: "hidden", background: "#020617" }}>
//                 <div style={{ padding: "20px 12px 20px 16px", background: "#020617", borderRight: "1px solid rgba(255,255,255,0.04)", minWidth: 50, textAlign: "right", userSelect: "none", overflowY: "hidden", flexShrink: 0, fontFamily: "'JetBrains Mono', monospace" }}>
//                   {Array.from({ length: lineCount }, (_, i) => (
//                     <div key={i} style={{ fontSize: 13, lineHeight: "22px", color: "rgba(148,163,184,0.2)", fontWeight: 500 }}>{i + 1}</div>
//                   ))}
//                 </div>
//                 <textarea ref={textareaRef}
//                   style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#e2e8f0", fontSize: 13.5, lineHeight: "22px", padding: "20px 22px", resize: "none", fontFamily: "'JetBrains Mono', monospace", overflowY: "auto", tabSize: 4, caretColor: "#6366f1", letterSpacing: "0.01em" }}
//                   value={code} onChange={(e) => setCode(e.target.value)} onKeyDown={handleTabKey}
//                   spellCheck={false} autoCapitalize="none" autoCorrect="off" placeholder="// Start coding here…" />
//               </div>

//               {/* Output panel */}
//               <div style={{ height: 230, borderTop: "1px solid rgba(255,255,255,0.06)", background: "#0a1020", flexShrink: 0, display: "flex", flexDirection: "column" }}>
//                 <div style={{ display: "flex", alignItems: "center", padding: "0 14px", borderBottom: "1px solid rgba(255,255,255,0.05)", height: 38, gap: 4, flexShrink: 0, background: "rgba(0,0,0,0.2)" }}>
//                   {["output", "results"].map((tab) => (
//                     <button key={tab} className="output-tab" onClick={() => setActiveOutputTab(tab)}
//                       style={{ background: activeOutputTab === tab ? "rgba(99,102,241,0.12)" : "transparent", border: activeOutputTab === tab ? "1px solid rgba(99,102,241,0.25)" : "1px solid transparent", color: activeOutputTab === tab ? "#a5b4fc" : "rgba(148,163,184,0.5)", fontFamily: "'Outfit',sans-serif" }}>
//                       {tab === "output" ? <><Play size={10} style={{ display: "inline", marginRight: 4 }} />Output</> : <><Zap size={10} style={{ display: "inline", marginRight: 4 }} />Results</>}
//                     </button>
//                   ))}
//                   {judgeResult && (
//                     <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
//                       <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(148,163,184,0.5)" }}>{judgeResult.testCasesPassed}/{judgeResult.totalTestCases} passed</span>
//                       <span style={{ fontSize: 12, fontWeight: 900, color: verdictColor(judgeResult.overallVerdict), padding: "2px 9px", background: `${verdictColor(judgeResult.overallVerdict)}15`, borderRadius: 6, border: `1px solid ${verdictColor(judgeResult.overallVerdict)}30` }}>
//                         {judgeResult.overallVerdict === "ACCEPTED" ? "✓ " : "✗ "}{judgeResult.overallVerdict}
//                       </span>
//                     </div>
//                   )}
//                 </div>
//                 <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px" }}>
//                   {activeOutputTab === "output" && (
//                     <>
//                       {!runOutput && !runLoading && (
//                         <div style={{ color: "rgba(148,163,184,0.3)", fontSize: 12, paddingTop: 10, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 7 }}>
//                           <Play size={22} color="rgba(148,163,184,0.2)" />
//                           <span>Click <span style={{ color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>Run</span> to test with sample input</span>
//                         </div>
//                       )}
//                       {runOutput && (
//                         <div className="slide-in">
//                           <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 9 }}>
//                             <span style={{ borderRadius: 6, padding: "2px 9px", fontSize: 11, fontWeight: 700, background: runOutput.status === "SUCCESS" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", color: statusColor(runOutput.status), border: `1px solid ${statusColor(runOutput.status)}30` }}>● {runOutput.status}</span>
//                             {runOutput.executionTimeMs && <span style={{ color: "rgba(148,163,184,0.4)", fontSize: 11, display: "flex", alignItems: "center", gap: 3 }}><Clock size={11} />{runOutput.executionTimeMs}ms</span>}
//                           </div>
//                           <pre style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.6, whiteSpace: "pre-wrap", wordBreak: "break-all", fontFamily: "'JetBrains Mono', monospace" }}>{runOutput.output || "(no output)"}</pre>
//                         </div>
//                       )}
//                     </>
//                   )}
//                   {activeOutputTab === "results" && (
//                     <>
//                       {!judgeResult && !submitLoading && (
//                         <div style={{ color: "rgba(148,163,184,0.3)", fontSize: 12, paddingTop: 10, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 7 }}>
//                           <Zap size={22} color="rgba(148,163,184,0.2)" />
//                           <span>Click <span style={{ color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>Submit</span> to judge all test cases</span>
//                         </div>
//                       )}
//                       {judgeResult && (
//                         <div className="slide-in">
//                           <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12, flexWrap: "wrap" }}>
//                             <span style={{ fontSize: 11, background: "rgba(245,158,11,0.1)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 6, padding: "2px 9px", fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
//                               <Trophy size={11} /> {judgeResult.marksObtained}/{judgeResult.totalMarks} pts
//                             </span>
//                             {canMarkDone && (
//                               <button className="btn-primary" onClick={handleMarkDone} disabled={!!markingItem}
//                                 style={{ marginLeft: "auto", background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "#fff", boxShadow: "0 4px 10px rgba(34,197,94,0.3)", fontSize: 11, padding: "4px 12px" }}>
//                                 {markingItem ? "Saving…" : <><Check size={11} /> Mark Done</>}
//                               </button>
//                             )}
//                           </div>
//                           <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
//                             {judgeResult.judgeResults?.map((r, i) => (
//                               <div key={i} style={{ background: r.passed ? "rgba(34,197,94,0.07)" : "rgba(239,68,68,0.07)", border: `1px solid ${r.passed ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`, borderRadius: 9, padding: "7px 11px", minWidth: 105, fontSize: 11 }}>
//                                 <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
//                                   <span style={{ fontWeight: 700, color: "rgba(248,250,252,0.6)", fontSize: 10 }}>Test {i + 1}</span>
//                                   <span style={{ color: r.passed ? "#22c55e" : "#ef4444", fontWeight: 700, fontSize: 10 }}>{r.verdict}</span>
//                                 </div>
//                                 {!r.isHidden && r.actualOutput && (
//                                   <code style={{ color: "#a5b4fc", background: "rgba(99,102,241,0.1)", padding: "1px 5px", borderRadius: 3, fontFamily: "'JetBrains Mono', monospace", fontSize: 10 }}>{r.actualOutput}</code>
//                                 )}
//                                 {r.isHidden && <div style={{ color: "rgba(148,163,184,0.3)", fontSize: 10 }}>Hidden</div>}
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       )}
//                     </>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </>
//     );
//   }

//   /* ══════════════════════════════════════════════════════
//      LIST VIEW  — matches Notebook page style
//   ══════════════════════════════════════════════════════ */
//   if (view === "list") {
//     const totalProblems = plans.reduce((s, p) => s + (p.totalProblems || 0), 0);
//     const totalDone = plans.reduce((s, p) =>
//       s + (p.sections?.reduce((ss, sec) => ss + (sec.items?.filter((i) => i.completed)?.length || 0), 0) || 0), 0);

//     return (
//       <>
//         <style>{G}</style>
//         <div style={{ minHeight: "100vh", background: t.pageBg, fontFamily: "'Outfit', sans-serif", display: "flex", flexDirection: "column" }}>

//           {/* Top nav */}
//           <div style={navStyle}>
//             <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//               {/* Real icon — BookOpen from lucide */}
//               <div style={{ width: 30, height: 30, background: isDark ? "rgba(99,102,241,0.15)" : "#ede9fe", border: isDark ? "1px solid rgba(99,102,241,0.25)" : "1px solid #ddd6fe", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
//                 <BookOpen size={15} color="#7c3aed" />
//               </div>
//               <span style={{ fontSize: 14, fontWeight: 800, color: t.text, letterSpacing: "-0.01em" }}>Study Plans</span>
//               <span style={{ fontSize: 11, fontWeight: 700, background: isDark ? "rgba(99,102,241,0.12)" : "#ede9fe", color: "#7c3aed", border: isDark ? "1px solid rgba(99,102,241,0.2)" : "1px solid #ddd6fe", borderRadius: 20, padding: "2px 9px" }}>
//                 Student
//               </span>
//             </div>
//             {/* Batch pill */}
//             <div style={{ fontSize: 11, fontWeight: 600, background: t.statPillBg, color: t.textSub, border: `1px solid ${t.statPillBorder}`, borderRadius: 20, padding: "4px 12px" }}>
//               Batch #{batchId}
//             </div>
//           </div>

//           <FlashBar />

//           <div style={{ flex: 1, padding: "36px 40px", maxWidth: 1280, width: "100%", margin: "0 auto" }}>

//             {/* ── Page heading (Notebook style) ── */}
//             <div style={{ marginBottom: 32 }}>
//               <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
//                 <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#7c3aed", display: "inline-block" }} />
//                 <span style={{ fontSize: 11, fontWeight: 700, color: "#7c3aed", letterSpacing: "0.12em", textTransform: "uppercase" }}>Study Plans</span>
//               </div>
//               <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
//                 <div>
//                   <h1 style={{ fontSize: 28, fontWeight: 900, color: t.text, letterSpacing: "-0.02em", lineHeight: 1.15, marginBottom: 4 }}>
//                     My Study Plans
//                   </h1>
//                   <p style={{ fontSize: 13, color: t.textSub, fontWeight: 400 }}>
//                     Track your progress and solve problems at your own pace
//                   </p>
//                 </div>
//                 {/* Stat pills — exactly like Notebook: "1 Notebooks · 1 Sections · 1 Pages" */}
//                 {!plansLoading && plans.length > 0 && (
//                   <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
//                     {[
//                       { icon: <Layers size={13} />, label: `${plans.length} Plan${plans.length !== 1 ? "s" : ""}` },
//                       { icon: <Target size={13} />, label: `${totalProblems} Problems` },
//                       { icon: <Check size={13} />, label: `${totalDone} Solved` },
//                     ].map((s, i) => (
//                       <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: t.textSub, background: t.statPillBg, border: `1px solid ${t.statPillBorder}`, borderRadius: 8, padding: "5px 12px" }}>
//                         <span style={{ color: "#7c3aed" }}>{s.icon}</span>
//                         {s.label}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Divider */}
//             <div style={{ height: 1, background: t.divider, marginBottom: 28 }} />

//             {/* Content */}
//             {plansLoading ? (
//               <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
//                 {[1, 2, 3].map((i) => (
//                   <div key={i} style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}`, borderRadius: 16, overflow: "hidden" }}>
//                     <Skeleton h={100} r={0} style={{ background: isDark ? "rgba(255,255,255,0.03)" : "#f1f5f9" }} />
//                     <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
//                       <Skeleton h={18} w="65%" style={{ background: isDark ? "rgba(255,255,255,0.04)" : "#e2e8f0" }} />
//                       <Skeleton h={13} style={{ background: isDark ? "rgba(255,255,255,0.03)" : "#e2e8f0" }} />
//                       <Skeleton h={13} w="80%" style={{ background: isDark ? "rgba(255,255,255,0.03)" : "#e2e8f0" }} />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : plans.length === 0 ? (
//               <div style={{ textAlign: "center", padding: "80px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
//                 <div style={{ width: 72, height: 72, background: isDark ? "rgba(99,102,241,0.08)" : "#ede9fe", border: isDark ? "1px solid rgba(99,102,241,0.15)" : "1px solid #ddd6fe", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
//                   <BookOpen size={30} color="#7c3aed" />
//                 </div>
//                 <div>
//                   <div style={{ fontSize: 17, fontWeight: 700, color: t.text, marginBottom: 6 }}>No study plans yet</div>
//                   <div style={{ fontSize: 13, color: t.textMuted }}>Your trainer hasn't assigned any study plans to your batch yet.</div>
//                 </div>
//               </div>
//             ) : (
//               <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
//                 {plans.map((plan, idx) => {
//                   const pct = planProgress(plan);
//                   const color = plan.thumbnailColor || "#7c3aed";
//                   const doneCnt = plan.sections?.reduce((s, sec) => s + (sec.items?.filter((i) => i.completed)?.length || 0), 0) || 0;
//                   return (
//                     <div key={plan.id} className="card-hover fade-up"
//                       onClick={() => openPlan(plan)}
//                       style={{
//                         animationDelay: `${idx * 0.06}s`,
//                         background: t.cardBg,
//                         border: `1px solid ${t.cardBorder}`,
//                         borderRadius: 16,
//                         overflow: "hidden",
//                         boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.3)" : "0 2px 12px rgba(0,0,0,0.06)",
//                         display: "flex",
//                         flexDirection: "column",
//                       }}>
//                       {/* Card banner */}
//                       <div style={{ height: 100, background: `linear-gradient(140deg, ${color}d0 0%, ${color}80 100%)`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 22px", position: "relative", overflow: "hidden" }}>
//                         <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.14) 0%, transparent 65%)" }} />
//                         <div style={{ position: "relative", fontSize: 40, lineHeight: 1, filter: "drop-shadow(0 3px 8px rgba(0,0,0,0.25))" }}>{plan.icon || "📘"}</div>
//                         <div style={{ position: "relative" }}>
//                           <ArcProgress pct={pct} size={68} color="rgba(255,255,255,0.95)" />
//                         </div>
//                       </div>

//                       {/* Card body */}
//                       <div style={{ padding: "16px 20px 14px", flex: 1 }}>
//                         <div style={{ fontSize: 15, fontWeight: 800, color: t.text, marginBottom: 5, lineHeight: 1.25 }}>{plan.title}</div>
//                         {plan.description && (
//                           <div style={{ fontSize: 12.5, color: t.textSub, lineHeight: 1.55, marginBottom: 12 }}>
//                             {plan.description.slice(0, 75)}{plan.description.length > 75 ? "…" : ""}
//                           </div>
//                         )}
//                         {/* Tags */}
//                         <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 14 }}>
//                           <span style={{ fontSize: 10, fontWeight: 600, background: t.pillBg, color: t.pillText, borderRadius: 20, padding: "3px 9px", border: `1px solid ${t.pillBorder}`, display: "flex", alignItems: "center", gap: 4 }}>
//                             <Target size={10} /> {plan.totalProblems || 0} problems
//                           </span>
//                           {plan.dueDate && (
//                             <span style={{ fontSize: 10, fontWeight: 600, background: "rgba(245,158,11,0.08)", color: "#f59e0b", borderRadius: 20, padding: "3px 9px", border: "1px solid rgba(245,158,11,0.18)", display: "flex", alignItems: "center", gap: 4 }}>
//                               <Calendar size={10} /> Due {new Date(plan.dueDate).toLocaleDateString()}
//                             </span>
//                           )}
//                         </div>
//                         {/* Progress bar */}
//                         <div>
//                           <div style={{ height: 4, background: isDark ? "rgba(255,255,255,0.06)" : "#e2e8f0", borderRadius: 4, overflow: "hidden" }}>
//                             <div style={{ height: "100%", borderRadius: 4, background: `linear-gradient(90deg, ${color}, ${color}cc)`, width: `${pct}%`, transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)", boxShadow: `0 0 6px ${color}50` }} />
//                           </div>
//                           <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
//                             <span style={{ fontSize: 11, color: t.textMuted, fontWeight: 500 }}>{pct}% complete</span>
//                             <span style={{ fontSize: 11, color: t.textMuted, fontWeight: 500 }}>{doneCnt}/{plan.totalProblems || 0}</span>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Card footer */}
//                       <div style={{ padding: "10px 20px", borderTop: `1px solid ${t.divider}` }}>
//                         <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//                           <span style={{ fontSize: 12, color: t.textMuted, fontWeight: 500 }}>
//                             {pct === 100 ? "🎉 Completed!" : pct > 0 ? "In progress" : "Not started"}
//                           </span>
//                           <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 700, color: color }}>
//                             Open Plan <ChevronRight size={14} />
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         </div>
//       </>
//     );
//   }

//   /* ══════════════════════════════════════════════════════
//      DETAIL VIEW
//   ══════════════════════════════════════════════════════ */
//   const plan = selectedPlan;
//   const overallPct = plan ? planProgress(plan) : 0;
//   const planColor = plan?.thumbnailColor || "#7c3aed";

//   return (
//     <>
//       <style>{G + `.solve-btn { transition: all 0.16s ease; } .solve-btn:hover { filter: brightness(1.1); transform: translateY(-1px); } .solve-btn:active { transform: scale(0.97); }`}</style>
//       <div style={{ minHeight: "100vh", background: t.pageBg, fontFamily: "'Outfit', sans-serif", display: "flex", flexDirection: "column" }}>

//         {/* Top nav */}
//         <div style={navStyle}>
//           <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//             <button className="btn-ghost" onClick={() => { setView("list"); setSelectedPlan(null); }}
//               style={{ background: t.pillBg, border: `1px solid ${t.pillBorder}`, color: t.textSub }}>
//               <ChevronLeft size={14} /> Back
//             </button>
//             <div style={{ width: 1, height: 20, background: t.divider }} />
//             {/* Breadcrumb */}
//             <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
//               <span style={{ fontSize: 12, color: t.breadcrumb, fontWeight: 500 }}>Study Plans</span>
//               <ChevronRight size={12} color={t.breadcrumb} />
//               <span style={{ fontSize: 12, color: t.breadcrumbActive, fontWeight: 700 }}>{plan?.title || "Plan"}</span>
//             </div>
//           </div>
//           <div style={{ fontSize: 11, fontWeight: 600, background: t.statPillBg, color: t.textSub, border: `1px solid ${t.statPillBorder}`, borderRadius: 20, padding: "4px 12px" }}>
//             Batch #{batchId}
//           </div>
//         </div>

//         <FlashBar />

//         {planLoading ? (
//           <div style={{ flex: 1, padding: "40px", maxWidth: 900, margin: "0 auto", width: "100%", display: "flex", flexDirection: "column", gap: 18 }}>
//             <Skeleton h={32} w="50%" style={{ background: isDark ? "rgba(255,255,255,0.05)" : "#e2e8f0" }} />
//             <Skeleton h={14} w="70%" style={{ background: isDark ? "rgba(255,255,255,0.03)" : "#e2e8f0" }} />
//             <Skeleton h={110} style={{ background: isDark ? "rgba(255,255,255,0.03)" : "#e2e8f0" }} />
//             <Skeleton h={180} style={{ background: isDark ? "rgba(255,255,255,0.03)" : "#e2e8f0" }} />
//           </div>
//         ) : !plan ? (
//           <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, padding: 40 }}>
//             <AlertTriangle size={36} color="#ef4444" />
//             <p style={{ color: "#ef4444", fontSize: 14 }}>Could not load this plan.</p>
//             <button className="btn-ghost" onClick={() => setView("list")} style={{ background: t.pillBg, border: `1px solid ${t.pillBorder}`, color: t.textSub }}>← Go Back</button>
//           </div>
//         ) : (
//           <div style={{ flex: 1, paddingBottom: 80 }}>
//             {/* Hero */}
//             <div style={{ background: `linear-gradient(145deg, ${planColor}c0 0%, ${planColor}70 40%, ${isDark ? "rgba(15,23,42,0)" : "rgba(248,250,252,0)"} 100%)`, position: "relative", overflow: "hidden", padding: "44px 44px 52px" }}>
//               <div style={{ position: "absolute", right: -60, top: -60, width: 280, height: 280, background: `${planColor}15`, borderRadius: "50%", filter: "blur(40px)" }} />
//               <div style={{ position: "relative", maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "flex-start", gap: 28, justifyContent: "space-between" }}>
//                 <div style={{ flex: 1 }}>
//                   <div style={{ fontSize: 50, marginBottom: 14, filter: "drop-shadow(0 5px 12px rgba(0,0,0,0.3))", lineHeight: 1 }}>{plan.icon || "📘"}</div>
//                   <h1 style={{ fontSize: 30, fontWeight: 900, color: "#f8fafc", marginBottom: 8, lineHeight: 1.1, letterSpacing: "-0.02em", textShadow: "0 2px 12px rgba(0,0,0,0.3)" }}>{plan.title}</h1>
//                   {plan.description && (
//                     <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.65)", marginBottom: 18, lineHeight: 1.65, maxWidth: 520 }}>{plan.description}</p>
//                   )}
//                   <div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}>
//                     {[
//                       { icon: <Target size={12} />, label: `${plan.totalProblems || 0} Problems` },
//                       plan.dueDate && { icon: <Calendar size={12} />, label: `Due ${new Date(plan.dueDate).toLocaleDateString()}` },
//                       { icon: overallPct === 100 ? <Check size={12} /> : <FileText size={12} />, label: overallPct === 100 ? "Completed" : `${overallPct}% done`, green: overallPct === 100 },
//                     ].filter(Boolean).map((tag, i) => (
//                       <span key={i} style={{ fontSize: 12, fontWeight: 700, background: tag.green ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)", color: tag.green ? "#22c55e" : "#fff", borderRadius: 20, padding: "4px 12px", border: `1px solid ${tag.green ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.18)"}`, display: "flex", alignItems: "center", gap: 5 }}>
//                         {tag.icon} {tag.label}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//                 <div style={{ textAlign: "center", flexShrink: 0 }}>
//                   <ArcProgress pct={overallPct} size={100} color="rgba(255,255,255,0.95)" />
//                   <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, marginTop: 7, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Overall Progress</div>
//                 </div>
//               </div>
//             </div>

//             {/* Thin progress bar */}
//             <div style={{ height: 3, background: isDark ? "rgba(255,255,255,0.04)" : "#e2e8f0" }}>
//               <div style={{ height: "100%", background: `linear-gradient(90deg, ${planColor}, ${planColor}80)`, width: `${overallPct}%`, transition: "width 0.9s cubic-bezier(0.4,0,0.2,1)", boxShadow: `0 0 10px ${planColor}60` }} />
//             </div>

//             {/* Content */}
//             <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 36px" }}>
//               {/* Info banner */}
//               <div style={{ background: isDark ? "rgba(99,102,241,0.06)" : "#f5f3ff", border: isDark ? "1px solid rgba(99,102,241,0.14)" : "1px solid #ddd6fe", borderRadius: 10, padding: "12px 16px", marginTop: 24, marginBottom: 28, fontSize: 13, lineHeight: 1.55 }}>
//                 <span style={{ fontWeight: 700, color: "#7c3aed" }}>💡 How it works · </span>
//                 <span style={{ color: t.textSub }}>
//                   Click <strong style={{ color: t.text }}>Solve</strong> → write your solution → click <strong style={{ color: t.text }}>⚡ Submit</strong> → if it passes, click <strong style={{ color: "#22c55e" }}>✓ Mark Done</strong> to save progress.
//                 </span>
//               </div>

//               {/* Sections */}
//               {!plan.sections || plan.sections.length === 0 ? (
//                 <div style={{ textAlign: "center", padding: "70px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
//                   <div style={{ width: 60, height: 60, background: isDark ? "rgba(99,102,241,0.08)" : "#ede9fe", border: isDark ? "1px solid rgba(99,102,241,0.15)" : "1px solid #ddd6fe", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
//                     <Layers size={26} color="#7c3aed" />
//                   </div>
//                   <div style={{ color: t.textMuted, fontSize: 13 }}>No sections in this plan yet.</div>
//                 </div>
//               ) : (
//                 <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
//                   {plan.sections.map((section, si) => {
//                     const total = section.items?.length || 0;
//                     const done = section.items?.filter((i) => i.completed)?.length || 0;
//                     const sPct = total ? Math.round((done / total) * 100) : 0;
//                     const isOpen = expandedSection === section.id;

//                     return (
//                       <div key={section.id} className="fade-up"
//                         style={{ animationDelay: `${si * 0.06}s`, background: t.cardBg, border: `1px solid ${t.cardBorder}`, borderRadius: 14, overflow: "hidden", boxShadow: isDark ? "0 4px 18px rgba(0,0,0,0.2)" : "0 2px 10px rgba(0,0,0,0.05)" }}>
//                         {/* Section header */}
//                         <div className="section-header-row" onClick={() => setExpandedSection(isOpen ? null : section.id)}
//                           style={{ borderLeft: `3px solid ${isOpen ? planColor : "transparent"}`, borderBottom: isOpen ? `1px solid ${t.divider}` : "none" }}>
//                           <div style={{ flex: 1 }}>
//                             <div style={{ fontSize: 10, fontWeight: 700, color: planColor, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 2 }}>Section {si + 1}</div>
//                             <div style={{ fontSize: 15, fontWeight: 700, color: t.text }}>{section.title}</div>
//                             {section.description && <div style={{ fontSize: 12, color: t.textMuted, marginTop: 2 }}>{section.description}</div>}
//                           </div>
//                           <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
//                             <div style={{ textAlign: "right" }}>
//                               <div style={{ fontSize: 12, fontWeight: 700, color: t.textSub }}>{done}/{total}</div>
//                               <div style={{ fontSize: 10, color: t.textMuted, fontWeight: 500 }}>done</div>
//                             </div>
//                             <SmallArc pct={sPct} size={42} color={planColor} />
//                             <div style={{ width: 26, height: 26, borderRadius: 7, background: t.pillBg, border: `1px solid ${t.pillBorder}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
//                               <ChevronDown size={13} color={t.textMuted} style={{ transition: "transform 0.2s ease", transform: isOpen ? "rotate(180deg)" : "none" }} />
//                             </div>
//                           </div>
//                         </div>

//                         {/* Items */}
//                         {isOpen && (
//                           <div>
//                             {!section.items || section.items.length === 0 ? (
//                               <div style={{ padding: "22px", color: t.textMuted, fontSize: 13, textAlign: "center" }}>No problems in this section yet.</div>
//                             ) : (
//                               section.items.map((item, ii) => {
//                                 const dc = diffStyle(item.problemDifficulty);
//                                 return (
//                                   <div key={item.id} className="item-row"
//                                     style={{ borderLeft: item.completed ? `3px solid #22c55e` : "3px solid transparent", background: item.completed ? (isDark ? "rgba(34,197,94,0.025)" : "rgba(34,197,94,0.03)") : "transparent" }}>
//                                     <div style={{ fontSize: 11, fontWeight: 600, color: t.textMuted, minWidth: 22, textAlign: "center" }}>{ii + 1}</div>
//                                     <div style={{ width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: item.completed ? "#22c55e" : t.pillBg, border: item.completed ? "2px solid #22c55e" : `2px solid ${t.pillBorder}`, boxShadow: item.completed ? "0 0 8px rgba(34,197,94,0.35)" : "none", transition: "all 0.22s ease" }}>
//                                       {item.completed && <Check size={11} color="#fff" strokeWidth={3} />}
//                                     </div>
//                                     <div style={{ flex: 1, minWidth: 0 }}>
//                                       <div style={{ fontSize: 13.5, fontWeight: 700, color: item.completed ? t.textMuted : t.text, textDecoration: item.completed ? "line-through" : "none", marginBottom: 5, textDecorationColor: t.textMuted }}>
//                                         {item.problemTitle}
//                                       </div>
//                                       <div style={{ display: "flex", gap: 7, alignItems: "center", flexWrap: "wrap" }}>
//                                         <span style={{ fontSize: 10, fontWeight: 700, background: dc.bg, color: dc.color, border: `1px solid ${dc.border}`, borderRadius: 20, padding: "2px 8px" }}>{item.problemDifficulty}</span>
//                                         <span style={{ fontSize: 10, fontWeight: 700, background: "rgba(245,158,11,0.08)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 20, padding: "2px 8px", display: "flex", alignItems: "center", gap: 3 }}>
//                                           <Trophy size={9} /> {item.problemTotalMarks} pts
//                                         </span>
//                                         {item.completed && (
//                                           <span style={{ fontSize: 10, fontWeight: 700, background: "rgba(34,197,94,0.08)", color: "#22c55e", borderRadius: 20, padding: "2px 8px", border: "1px solid rgba(34,197,94,0.18)", display: "flex", alignItems: "center", gap: 3 }}>
//                                             <Check size={9} /> Completed
//                                           </span>
//                                         )}
//                                       </div>
//                                     </div>
//                                     <div style={{ flexShrink: 0 }}>
//                                       {item.completed ? (
//                                         <span style={{ fontSize: 11, fontWeight: 700, color: "#22c55e", background: "rgba(34,197,94,0.08)", borderRadius: 8, padding: "5px 12px", border: "1px solid rgba(34,197,94,0.18)", display: "flex", alignItems: "center", gap: 4 }}>
//                                           <Check size={11} /> Done
//                                         </span>
//                                       ) : (
//                                         <button className="btn-primary solve-btn" onClick={() => openCompiler(item, section.id)}
//                                           style={{ background: `linear-gradient(135deg, ${planColor} 0%, ${planColor}bb 100%)`, color: "#fff", boxShadow: `0 4px 10px ${planColor}40`, padding: "6px 16px", display: "flex", alignItems: "center", gap: 5 }}>
//                                           Solve <ChevronRight size={13} />
//                                         </button>
//                                       )}
//                                     </div>
//                                   </div>
//                                 );
//                               })
//                             )}
//                             {/* Section progress bar */}
//                             <div style={{ height: 3, background: isDark ? "rgba(255,255,255,0.04)" : "#e2e8f0" }}>
//                               <div style={{ height: "100%", background: planColor, width: `${sPct}%`, transition: "width 0.6s ease", boxShadow: `0 0 6px ${planColor}50` }} />
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// }
















import { useState, useEffect, useRef } from "react";
import {
  getStudentStudyPlans,
  getStudentStudyPlanById,
  markStudyPlanProgress,
  getStudentProblemById,
  submitCodeForJudge,
  runCode,
} from "../services/assessmentService";
import { getStudentClassroom } from "../services/batchService";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Play,
  Zap,
  Check,
  RefreshCw,
  AlertTriangle,
  Target,
  Calendar,
  Trophy,
  Layers,
  FileText,
  Clock,
} from "lucide-react";

const LANGUAGES = ["JAVA", "PYTHON", "JAVASCRIPT", "BASH"];
const LANG_LABEL = {
  JAVA: "Java",
  PYTHON: "Python",
  JAVASCRIPT: "JS",
  BASH: "Bash",
};
const LANG_ICON = { JAVA: "☕", PYTHON: "🐍", JAVASCRIPT: "⚡", BASH: "🖥" };
const DEFAULT_CODE = {
  JAVA: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`,
  PYTHON: `# Write your solution here\nprint("Hello, World!")`,
  JAVASCRIPT: `process.stdin.resume();\nprocess.stdin.setEncoding('utf8');\nlet input = '';\nprocess.stdin.on('data', d => input += d);\nprocess.stdin.on('end', () => {\n    console.log("Hello, World!");\n});`,
  BASH: `#!/bin/bash\necho "Hello, World!"`,
};

/* ── Theme tokens ── */
const T = {
  dark: {
    pageBg: "#0f172a",
    navBg: "rgba(11,17,30,0.97)",
    cardBg: "rgba(255,255,255,0.025)",
    cardBorder: "rgba(255,255,255,0.07)",
    text: "#f8fafc",
    textSub: "#94a3b8",
    textMuted: "#475569",
    pillBg: "rgba(255,255,255,0.05)",
    pillBorder: "rgba(255,255,255,0.09)",
    pillText: "#94a3b8",
    divider: "rgba(255,255,255,0.06)",
    inputBg: "#020617",
    breadcrumb: "#475569",
    breadcrumbActive: "#f8fafc",
    statPillBg: "rgba(255,255,255,0.05)",
    statPillBorder: "rgba(255,255,255,0.09)",
    accentDot: "#7c3aed",
    heroBg: "transparent",
  },
  light: {
    pageBg: "#f8fafc",
    navBg: "rgba(255,255,255,0.97)",
    cardBg: "#ffffff",
    cardBorder: "#e2e8f0",
    text: "#0f172a",
    textSub: "#475569",
    textMuted: "#94a3b8",
    pillBg: "#f1f5f9",
    pillBorder: "#e2e8f0",
    pillText: "#64748b",
    divider: "#e2e8f0",
    inputBg: "#f8fafc",
    breadcrumb: "#94a3b8",
    breadcrumbActive: "#0f172a",
    statPillBg: "#f1f5f9",
    statPillBorder: "#e2e8f0",
    accentDot: "#7c3aed",
    heroBg: "transparent",
  },
};

const diffStyle = (d) =>
  d === "EASY"
    ? { color: "#22c55e", bg: "rgba(34,197,94,0.1)", border: "rgba(34,197,94,0.25)" }
    : d === "MEDIUM"
    ? { color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.25)" }
    : { color: "#ef4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.25)" };

const statusColor = (s) =>
  s === "SUCCESS" ? "#22c55e" : s === "COMPILE_ERROR" ? "#f59e0b" : "#ef4444";
const verdictColor = (v) =>
  v === "ACCEPTED" ? "#22c55e" : v === "PARTIAL" ? "#f59e0b" : "#ef4444";

/* ── Arc Progress ── */
function ArcProgress({ pct, size = 80, color = "#6366f1" }) {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ filter: `drop-shadow(0 0 8px ${color}60)` }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={7} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={7}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%", transition: "stroke-dashoffset 0.9s cubic-bezier(0.4,0,0.2,1)" }} />
      <text x="50%" y="50%" textAnchor="middle" dy="0.35em"
        style={{ fontSize: size * 0.195, fontWeight: 800, fill: "#f8fafc", fontFamily: "'Outfit', sans-serif" }}>
        {pct}%
      </text>
    </svg>
  );
}

function SmallArc({ pct, size = 44, color = "#6366f1" }) {
  const r = (size - 7) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={5} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={5}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%", transition: "stroke-dashoffset 0.6s ease" }} />
      <text x="50%" y="50%" textAnchor="middle" dy="0.35em"
        style={{ fontSize: size * 0.22, fontWeight: 800, fill: color, fontFamily: "'Outfit', sans-serif" }}>
        {pct}%
      </text>
    </svg>
  );
}

function Skeleton({ w = "100%", h = 16, r = 8, style = {} }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: r,
      background: "linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%)",
      backgroundSize: "400px 100%",
      animation: "shimmer 1.6s infinite linear",
      ...style,
    }} />
  );
}

/* ── useTheme hook — FIXED: returns { t, isDark } ── */
function useTheme() {
  const getIsDark = () =>
    typeof document !== "undefined" &&
    (document.documentElement.classList.contains("dark") ||
      document.documentElement.getAttribute("data-theme") === "dark");

  const [isDark, setIsDark] = useState(getIsDark);

  useEffect(() => {
    const obs = new MutationObserver(() => setIsDark(getIsDark()));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
    return () => obs.disconnect();
  }, []);

  return { t: isDark ? T.dark : T.light, isDark };
}

const G = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.2); border-radius: 10px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(99,102,241,0.35); }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes shimmer { from { background-position: -400px 0; } to { background-position: 400px 0; } }
  @keyframes slide-in { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }
  .fade-up { animation: fadeUp 0.32s ease both; }
  .slide-in { animation: slide-in 0.25s ease both; }
  .card-hover {
    transition: transform 0.2s cubic-bezier(0.4,0,0.2,1), box-shadow 0.2s ease, border-color 0.2s ease;
    cursor: pointer;
  }
  .card-hover:hover { transform: translateY(-3px); }
  .btn-primary {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 18px; border: none; border-radius: 10px; cursor: pointer;
    font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 13px;
    transition: all 0.16s ease;
  }
  .btn-primary:hover { filter: brightness(1.1); transform: translateY(-1px); }
  .btn-primary:active { transform: scale(0.97); }
  .btn-ghost {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 6px 14px; border-radius: 8px; cursor: pointer;
    font-family: 'Outfit', sans-serif; font-weight: 600; font-size: 13px;
    transition: all 0.15s ease;
  }
  .btn-ghost:hover { opacity: 0.8; }
  .btn-ghost:active { transform: scale(0.97); }
  .item-row {
    display: flex; align-items: center; gap: 14px;
    padding: 14px 24px;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    transition: background 0.15s ease;
  }
  .item-row:hover { background: rgba(255,255,255,0.025); }
  .item-row:last-child { border-bottom: none; }
  .lang-tab {
    padding: 5px 12px; border-radius: 7px; border: none; cursor: pointer;
    font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 12px;
    transition: all 0.14s ease;
  }
  .section-header-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 22px; cursor: pointer;
    transition: background 0.15s ease;
    border-left: 3px solid transparent;
  }
  .section-header-row:hover { background: rgba(255,255,255,0.02); }
  .output-tab {
    padding: 5px 14px; border-radius: 7px; border: none; cursor: pointer;
    font-family: 'Outfit', sans-serif; font-weight: 600; font-size: 12px;
    transition: all 0.14s ease;
  }
`;

export default function StudentStudyPlanPage() {
  // ── FIXED: destructure { t, isDark } from useTheme ──
  const { t, isDark } = useTheme();

  const [batchId, setBatchId] = useState(null);
  const [batchLoading, setBatchLoading] = useState(true);
  const [batchError, setBatchError] = useState(false);
  const [view, setView] = useState("list");
  const [plans, setPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [planLoading, setPlanLoading] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);
  const [compilerItem, setCompilerItem] = useState(null);
  const [problemDetail, setProblemDetail] = useState(null);
  const [problemLoading, setProblemLoading] = useState(false);
  const [language, setLanguage] = useState("PYTHON");
  const [code, setCode] = useState(DEFAULT_CODE["PYTHON"]);
  const [runOutput, setRunOutput] = useState(null);
  const [judgeResult, setJudgeResult] = useState(null);
  const [runLoading, setRunLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [canMarkDone, setCanMarkDone] = useState(false);
  const [markingItem, setMarkingItem] = useState(null);
  const [flashMsg, setFlashMsg] = useState("");
  const [flashType, setFlashType] = useState("ok");
  const [activeOutputTab, setActiveOutputTab] = useState("output");
  const textareaRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      setBatchLoading(true);
      try {
        const res = await getStudentClassroom();
        const classroom = res?.data || res;
        const id = classroom?.batchId || classroom?.id || null;
        if (id) setBatchId(id);
        else setBatchError(true);
      } catch {
        setBatchError(true);
      } finally {
        setBatchLoading(false);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (batchId) fetchPlans();
  }, [batchId]);

  const fetchPlans = async () => {
    setPlansLoading(true);
    try {
      const res = await getStudentStudyPlans(batchId);
      setPlans(res.data || []);
    } catch {
      setPlans([]);
    } finally {
      setPlansLoading(false);
    }
  };

  const flash = (msg, type = "ok") => {
    setFlashMsg(msg);
    setFlashType(type);
    setTimeout(() => setFlashMsg(""), 3500);
  };

  const openPlan = async (plan) => {
    setPlanLoading(true);
    setView("detail");
    try {
      const res = await getStudentStudyPlanById(plan.id);
      setSelectedPlan(res.data);
      setExpandedSection(res.data?.sections?.[0]?.id ?? null);
    } catch {
      setSelectedPlan(null);
    } finally {
      setPlanLoading(false);
    }
  };

  const refreshPlanDetail = async () => {
    if (!selectedPlan) return;
    try {
      const res = await getStudentStudyPlanById(selectedPlan.id);
      setSelectedPlan(res.data);
    } catch {}
  };

  const openCompiler = async (item, sectionId) => {
    setProblemLoading(true);
    setView("compiler");
    setCompilerItem({ item, sectionId });
    setRunOutput(null);
    setJudgeResult(null);
    setCanMarkDone(false);
    setCode(DEFAULT_CODE[language]);
    try {
      const res = await getStudentProblemById(item.problemId);
      setProblemDetail(res.data);
    } catch {
      setProblemDetail(null);
    } finally {
      setProblemLoading(false);
    }
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setCode(DEFAULT_CODE[lang]);
    setRunOutput(null);
    setJudgeResult(null);
  };

  const handleRun = async () => {
    setRunLoading(true);
    setRunOutput(null);
    setJudgeResult(null);
    setActiveOutputTab("output");
    try {
      const stdin = problemDetail?.sampleInput || "";
      const res = await runCode(batchId, language, code, stdin);
      setRunOutput(res.data);
    } catch (e) {
      setRunOutput({ output: e.response?.data?.message || "Run failed.", status: "RUNTIME_ERROR" });
    } finally {
      setRunLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!problemDetail) return;
    setSubmitLoading(true);
    setJudgeResult(null);
    setRunOutput(null);
    setActiveOutputTab("results");
    try {
      const res = await submitCodeForJudge(problemDetail.id, batchId, language, code);
      const result = res.data;
      setJudgeResult(result);
      if (result.overallVerdict === "ACCEPTED" || result.overallVerdict === "PARTIAL" || result.marksObtained > 0) {
        setCanMarkDone(true);
        flash("🎉 Solution passed! Click Mark as Done to save your progress.", "ok");
      } else {
        flash("Solution did not pass. Review and try again.", "err");
      }
    } catch {
      setJudgeResult({ overallVerdict: "ERROR", marksObtained: 0, totalMarks: 0 });
      flash("Submission failed. Please try again.", "err");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleMarkDone = async () => {
    if (!compilerItem || !judgeResult) return;
    setMarkingItem(compilerItem.item.id);
    try {
      await markStudyPlanProgress({
        studyPlanItemId: compilerItem.item.id,
        batchId,
        problemId: compilerItem.item.problemId,
        marksObtained: judgeResult.marksObtained || 0,
      });
      flash("✓ Problem completed! Keep it up!", "ok");
      await refreshPlanDetail();
      setView("detail");
      setCompilerItem(null);
      setProblemDetail(null);
      setJudgeResult(null);
      setCanMarkDone(false);
    } catch {
      flash("Could not save progress. Please try again.", "err");
    } finally {
      setMarkingItem(null);
    }
  };

  const handleTabKey = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const ta = textareaRef.current;
      const start = ta.selectionStart, end = ta.selectionEnd;
      const newCode = code.substring(0, start) + "    " + code.substring(end);
      setCode(newCode);
      setTimeout(() => { ta.selectionStart = ta.selectionEnd = start + 4; }, 0);
    }
  };

  const planProgress = (p) => {
    if (!p?.sections?.length) return 0;
    const total = p.sections.reduce((s, sec) => s + (sec.items?.length || 0), 0);
    const done = p.sections.reduce((s, sec) => s + (sec.items?.filter((i) => i.completed)?.length || 0), 0);
    return total ? Math.round((done / total) * 100) : 0;
  };

  /* ── Shared nav styles ── */
  const navStyle = {
    height: 56,
    background: t.navBg,
    backdropFilter: "blur(16px)",
    borderBottom: `1px solid ${t.divider}`,
    display: "flex",
    alignItems: "center",
    padding: "0 28px",
    justifyContent: "space-between",
    position: "sticky",
    top: 0,
    zIndex: 50,
    boxShadow: isDark ? "none" : "0 1px 3px rgba(0,0,0,0.06)",
  };

  /* ── LOADING ── */
  if (batchLoading)
    return (
      <>
        <style>{G}</style>
        <div style={{ minHeight: "100vh", background: t.pageBg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, fontFamily: "'Outfit', sans-serif" }}>
          <div style={{ position: "relative" }}>
            <div style={{ width: 48, height: 48, border: "2px solid rgba(99,102,241,0.15)", borderTop: "2px solid #6366f1", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ color: t.text, fontSize: 14, fontWeight: 600 }}>Loading workspace</p>
            <p style={{ color: t.textMuted, fontSize: 12, marginTop: 4 }}>Connecting to your batch…</p>
          </div>
        </div>
      </>
    );

  if (batchError)
    return (
      <>
        <style>{G}</style>
        <div style={{ minHeight: "100vh", background: t.pageBg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, fontFamily: "'Outfit', sans-serif" }}>
          <div style={{ width: 52, height: 52, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <AlertTriangle size={22} color="#ef4444" />
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ color: t.text, fontSize: 15, fontWeight: 700 }}>Unable to load batch</p>
            <p style={{ color: t.textMuted, fontSize: 13, marginTop: 6 }}>Please contact your trainer to resolve this.</p>
          </div>
        </div>
      </>
    );

  /* ── FLASH BAR ── */
  const FlashBar = () =>
    flashMsg ? (
      <div style={{
        padding: "9px 24px", fontSize: 13, textAlign: "center", fontWeight: 600,
        background: flashType === "ok" ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)",
        borderBottom: `1px solid ${flashType === "ok" ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
        color: flashType === "ok" ? "#22c55e" : "#ef4444",
        fontFamily: "'Outfit', sans-serif",
      }}>
        {flashMsg}
      </div>
    ) : null;

  /* ══════════════════════════════════════════════════════
     COMPILER VIEW  (dark only — code editor)
  ══════════════════════════════════════════════════════ */
  if (view === "compiler") {
    const problem = problemDetail;
    const planColor = selectedPlan?.thumbnailColor || "#6366f1";
    const dc = problem ? diffStyle(problem.difficulty) : null;
    const lineCount = code.split("\n").length;

    return (
      <>
        <style>{G + `.lang-tab:hover { background: rgba(255,255,255,0.06) !important; } .tc-pill { transition: transform 0.15s ease; } .tc-pill:hover { transform: scale(1.02); }`}</style>
        <div style={{ height: "100vh", background: "#0f172a", display: "flex", flexDirection: "column", fontFamily: "'Outfit', sans-serif", overflow: "hidden" }}>

          {/* Judging overlay */}
          {(runLoading || submitLoading) && (
            <div style={{ position: "fixed", inset: 0, background: "rgba(10,15,30,0.88)", backdropFilter: "blur(10px)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ background: "linear-gradient(145deg, #131c30 0%, #1a2540 100%)", border: "1px solid rgba(99,102,241,0.25)", borderRadius: 20, padding: "44px 60px", display: "flex", flexDirection: "column", alignItems: "center", gap: 18, boxShadow: "0 40px 80px rgba(0,0,0,0.6)" }}>
                <div style={{ position: "relative" }}>
                  <div style={{ width: 52, height: 52, border: `2px solid rgba(99,102,241,0.15)`, borderTop: `2px solid ${planColor}`, borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#f8fafc", textAlign: "center", marginBottom: 5 }}>
                    {submitLoading ? "⚡ Judging your code" : "▶ Running code"}
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", textAlign: "center" }}>
                    {submitLoading ? "Running against all test cases…" : "Testing with sample input…"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Top Nav */}
          <div style={{ height: 52, background: "rgba(13,19,33,0.98)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", padding: "0 18px", gap: 10, flexShrink: 0, zIndex: 100 }}>
            <button className="btn-ghost" onClick={() => { setView("detail"); setCompilerItem(null); setProblemDetail(null); setJudgeResult(null); setCanMarkDone(false); }}
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.65)" }}>
              <ChevronLeft size={14} /> Back
            </button>
            <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.08)" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>Study Plans</span>
              <ChevronRight size={12} color="rgba(255,255,255,0.2)" />
              {selectedPlan && <span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", fontWeight: 500 }}>{selectedPlan.title}</span>}
              <ChevronRight size={12} color="rgba(255,255,255,0.2)" />
              <span style={{ fontSize: 12, color: "#f8fafc", fontWeight: 700 }}>{problem?.title || "Problem"}</span>
            </div>
            {problem && dc && (
              <span style={{ fontSize: 10, fontWeight: 700, background: dc.bg, color: dc.color, border: `1px solid ${dc.border}`, borderRadius: 20, padding: "2px 9px", letterSpacing: "0.04em" }}>
                {problem.difficulty}
              </span>
            )}
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ display: "flex", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 9, padding: 3, gap: 2 }}>
                {LANGUAGES.map((l) => (
                  <button key={l} className="lang-tab" onClick={() => handleLanguageChange(l)}
                    style={{ background: language === l ? planColor : "transparent", color: language === l ? "#fff" : "rgba(255,255,255,0.4)", boxShadow: language === l ? `0 2px 8px ${planColor}50` : "none" }}>
                    {LANG_ICON[l]} {LANG_LABEL[l]}
                  </button>
                ))}
              </div>
              <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.08)" }} />
              <button className="btn-ghost" onClick={handleRun} disabled={runLoading || submitLoading}
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.65)" }}>
                <Play size={12} fill="currentColor" /> Run
              </button>
              <button className="btn-primary" onClick={handleSubmit} disabled={runLoading || submitLoading || !problem}
                style={{ background: `linear-gradient(135deg, ${planColor} 0%, ${planColor}bb 100%)`, color: "#fff", boxShadow: `0 4px 12px ${planColor}40`, opacity: (runLoading || submitLoading || !problem) ? 0.6 : 1 }}>
                <Zap size={13} /> Submit
              </button>
              {canMarkDone && (
                <button className="btn-primary" onClick={handleMarkDone} disabled={!!markingItem}
                  style={{ background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)", color: "#fff", boxShadow: "0 4px 12px rgba(34,197,94,0.35)", whiteSpace: "nowrap", opacity: markingItem ? 0.7 : 1 }}>
                  {markingItem ? <><RefreshCw size={12} /> Saving…</> : <><Check size={12} /> Mark Done</>}
                </button>
              )}
            </div>
          </div>

          <FlashBar />

          {canMarkDone && (
            <div style={{ background: "rgba(245,158,11,0.07)", borderBottom: "1px solid rgba(245,158,11,0.18)", padding: "8px 24px", fontSize: 12, color: "#f59e0b", textAlign: "center", flexShrink: 0, fontWeight: 500, fontFamily: "'Outfit',sans-serif" }}>
              <Trophy size={13} style={{ display: "inline", marginRight: 6, verticalAlign: "middle" }} />
              Your solution passed! Click <strong>Mark Done</strong> in the toolbar to save your progress.
            </div>
          )}

          {/* Editor Layout */}
          <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
            {/* LEFT: Problem Panel */}
            <div style={{ width: 370, flexShrink: 0, borderRight: "1px solid rgba(255,255,255,0.06)", overflowY: "auto", background: "#0d1424" }}>
              {problemLoading ? (
                <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
                  <Skeleton h={22} w="70%" /><Skeleton h={14} w="40%" /><Skeleton h={80} /><Skeleton h={60} /><Skeleton h={100} />
                </div>
              ) : !problem ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 12, padding: 32 }}>
                  <AlertTriangle size={36} color="#ef4444" />
                  <p style={{ color: "#ef4444", fontSize: 14, textAlign: "center" }}>Could not load problem details.</p>
                </div>
              ) : (
                <div style={{ padding: "24px 22px 56px" }}>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: "#f8fafc", lineHeight: 1.3, marginBottom: 12 }}>{problem.title}</h2>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 22, flexWrap: "wrap" }}>
                    {dc && <span style={{ fontSize: 10, fontWeight: 700, background: dc.bg, color: dc.color, border: `1px solid ${dc.border}`, borderRadius: 20, padding: "2px 9px" }}>{problem.difficulty}</span>}
                    <span style={{ fontSize: 10, fontWeight: 700, background: "rgba(245,158,11,0.1)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 20, padding: "2px 9px", display: "flex", alignItems: "center", gap: 3 }}>
                      <Trophy size={10} /> {problem.totalMarks} pts
                    </span>
                  </div>
                  {[
                    { label: "Description", content: problem.description, mono: false },
                    { label: "Input Format", content: problem.inputFormat, mono: false },
                    { label: "Output Format", content: problem.outputFormat, mono: false },
                    { label: "Constraints", content: problem.constraints, mono: true },
                  ].filter((s) => s.content).map(({ label, content, mono }) => (
                    <div key={label} style={{ marginBottom: 20 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(148,163,184,0.6)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 7 }}>{label}</div>
                      {mono ? (
                        <div style={{ background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.15)", borderRadius: 9, padding: "10px 12px", fontSize: 12, color: "#a5b4fc", fontFamily: "'JetBrains Mono', monospace", whiteSpace: "pre-wrap", lineHeight: 1.7 }}>{content}</div>
                      ) : (
                        <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.75 }}>{content}</p>
                      )}
                    </div>
                  ))}
                  {(problem.sampleInput || problem.sampleOutput) && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
                      {problem.sampleInput && (
                        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "10px 12px" }}>
                          <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(148,163,184,0.5)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 7 }}>Input</div>
                          <pre style={{ fontSize: 12, color: "#e2e8f0", fontFamily: "'JetBrains Mono', monospace", whiteSpace: "pre-wrap" }}>{problem.sampleInput}</pre>
                        </div>
                      )}
                      {problem.sampleOutput && (
                        <div style={{ background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.15)", borderRadius: 10, padding: "10px 12px" }}>
                          <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(34,197,94,0.6)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 7 }}>Output</div>
                          <pre style={{ fontSize: 12, color: "#22c55e", fontFamily: "'JetBrains Mono', monospace", whiteSpace: "pre-wrap" }}>{problem.sampleOutput}</pre>
                        </div>
                      )}
                    </div>
                  )}
                  {problem.visibleTestCases?.filter((tc) => !tc.isHidden).length > 0 && (
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(148,163,184,0.6)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 9 }}>Sample Test Cases</div>
                      {problem.visibleTestCases.filter((tc) => !tc.isHidden).map((tc, i) => (
                        <div key={tc.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 9, padding: "10px 12px", marginBottom: 7 }}>
                          <div style={{ fontSize: 10, color: "rgba(148,163,184,0.5)", fontWeight: 600, marginBottom: 7 }}>Case {i + 1}</div>
                          {tc.input && (
                            <div style={{ display: "flex", gap: 9, marginBottom: 5, fontSize: 12, alignItems: "center" }}>
                              <span style={{ color: "rgba(148,163,184,0.5)", minWidth: 50, fontWeight: 600, fontSize: 10 }}>Input</span>
                              <code style={{ color: "#a5b4fc", background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: 4, fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>{tc.input}</code>
                            </div>
                          )}
                          <div style={{ display: "flex", gap: 9, fontSize: 12, alignItems: "center" }}>
                            <span style={{ color: "rgba(148,163,184,0.5)", minWidth: 50, fontWeight: 600, fontSize: 10 }}>Expected</span>
                            <code style={{ color: "#22c55e", background: "rgba(34,197,94,0.08)", padding: "2px 7px", borderRadius: 4, fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>{tc.expectedOutput}</code>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div style={{ background: `linear-gradient(135deg, ${planColor}0f, ${planColor}06)`, border: `1px solid ${planColor}20`, borderRadius: 10, padding: "12px 14px" }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: planColor, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.08em" }}>Getting credit</div>
                    <div style={{ fontSize: 12, color: "rgba(148,163,184,0.7)", lineHeight: 1.6 }}>
                      Write your solution → <span style={{ color: "#e2e8f0", fontWeight: 600 }}>⚡ Submit</span> → once it passes, click <span style={{ color: "#22c55e", fontWeight: 600 }}>✓ Mark Done</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT: Code Editor + Output */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
              <div style={{ flex: 1, display: "flex", overflow: "hidden", background: "#020617" }}>
                <div style={{ padding: "20px 12px 20px 16px", background: "#020617", borderRight: "1px solid rgba(255,255,255,0.04)", minWidth: 50, textAlign: "right", userSelect: "none", overflowY: "hidden", flexShrink: 0, fontFamily: "'JetBrains Mono', monospace" }}>
                  {Array.from({ length: lineCount }, (_, i) => (
                    <div key={i} style={{ fontSize: 13, lineHeight: "22px", color: "rgba(148,163,184,0.2)", fontWeight: 500 }}>{i + 1}</div>
                  ))}
                </div>
                <textarea ref={textareaRef}
                  style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#e2e8f0", fontSize: 13.5, lineHeight: "22px", padding: "20px 22px", resize: "none", fontFamily: "'JetBrains Mono', monospace", overflowY: "auto", tabSize: 4, caretColor: "#6366f1", letterSpacing: "0.01em" }}
                  value={code} onChange={(e) => setCode(e.target.value)} onKeyDown={handleTabKey}
                  spellCheck={false} autoCapitalize="none" autoCorrect="off" placeholder="// Start coding here…" />
              </div>

              {/* Output panel */}
              <div style={{ height: 230, borderTop: "1px solid rgba(255,255,255,0.06)", background: "#0a1020", flexShrink: 0, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "center", padding: "0 14px", borderBottom: "1px solid rgba(255,255,255,0.05)", height: 38, gap: 4, flexShrink: 0, background: "rgba(0,0,0,0.2)" }}>
                  {["output", "results"].map((tab) => (
                    <button key={tab} className="output-tab" onClick={() => setActiveOutputTab(tab)}
                      style={{ background: activeOutputTab === tab ? "rgba(99,102,241,0.12)" : "transparent", border: activeOutputTab === tab ? "1px solid rgba(99,102,241,0.25)" : "1px solid transparent", color: activeOutputTab === tab ? "#a5b4fc" : "rgba(148,163,184,0.5)", fontFamily: "'Outfit',sans-serif" }}>
                      {tab === "output" ? <><Play size={10} style={{ display: "inline", marginRight: 4 }} />Output</> : <><Zap size={10} style={{ display: "inline", marginRight: 4 }} />Results</>}
                    </button>
                  ))}
                  {judgeResult && (
                    <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(148,163,184,0.5)" }}>{judgeResult.testCasesPassed}/{judgeResult.totalTestCases} passed</span>
                      <span style={{ fontSize: 12, fontWeight: 900, color: verdictColor(judgeResult.overallVerdict), padding: "2px 9px", background: `${verdictColor(judgeResult.overallVerdict)}15`, borderRadius: 6, border: `1px solid ${verdictColor(judgeResult.overallVerdict)}30` }}>
                        {judgeResult.overallVerdict === "ACCEPTED" ? "✓ " : "✗ "}{judgeResult.overallVerdict}
                      </span>
                    </div>
                  )}
                </div>
                <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px" }}>
                  {activeOutputTab === "output" && (
                    <>
                      {!runOutput && !runLoading && (
                        <div style={{ color: "rgba(148,163,184,0.3)", fontSize: 12, paddingTop: 10, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 7 }}>
                          <Play size={22} color="rgba(148,163,184,0.2)" />
                          <span>Click <span style={{ color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>Run</span> to test with sample input</span>
                        </div>
                      )}
                      {runOutput && (
                        <div className="slide-in">
                          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 9 }}>
                            <span style={{ borderRadius: 6, padding: "2px 9px", fontSize: 11, fontWeight: 700, background: runOutput.status === "SUCCESS" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", color: statusColor(runOutput.status), border: `1px solid ${statusColor(runOutput.status)}30` }}>● {runOutput.status}</span>
                            {runOutput.executionTimeMs && <span style={{ color: "rgba(148,163,184,0.4)", fontSize: 11, display: "flex", alignItems: "center", gap: 3 }}><Clock size={11} />{runOutput.executionTimeMs}ms</span>}
                          </div>
                          <pre style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.6, whiteSpace: "pre-wrap", wordBreak: "break-all", fontFamily: "'JetBrains Mono', monospace" }}>{runOutput.output || "(no output)"}</pre>
                        </div>
                      )}
                    </>
                  )}
                  {activeOutputTab === "results" && (
                    <>
                      {!judgeResult && !submitLoading && (
                        <div style={{ color: "rgba(148,163,184,0.3)", fontSize: 12, paddingTop: 10, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 7 }}>
                          <Zap size={22} color="rgba(148,163,184,0.2)" />
                          <span>Click <span style={{ color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>Submit</span> to judge all test cases</span>
                        </div>
                      )}
                      {judgeResult && (
                        <div className="slide-in">
                          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12, flexWrap: "wrap" }}>
                            <span style={{ fontSize: 11, background: "rgba(245,158,11,0.1)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 6, padding: "2px 9px", fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                              <Trophy size={11} /> {judgeResult.marksObtained}/{judgeResult.totalMarks} pts
                            </span>
                            {canMarkDone && (
                              <button className="btn-primary" onClick={handleMarkDone} disabled={!!markingItem}
                                style={{ marginLeft: "auto", background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "#fff", boxShadow: "0 4px 10px rgba(34,197,94,0.3)", fontSize: 11, padding: "4px 12px" }}>
                                {markingItem ? "Saving…" : <><Check size={11} /> Mark Done</>}
                              </button>
                            )}
                          </div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                            {judgeResult.judgeResults?.map((r, i) => (
                              <div key={i} style={{ background: r.passed ? "rgba(34,197,94,0.07)" : "rgba(239,68,68,0.07)", border: `1px solid ${r.passed ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`, borderRadius: 9, padding: "7px 11px", minWidth: 105, fontSize: 11 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                  <span style={{ fontWeight: 700, color: "rgba(248,250,252,0.6)", fontSize: 10 }}>Test {i + 1}</span>
                                  <span style={{ color: r.passed ? "#22c55e" : "#ef4444", fontWeight: 700, fontSize: 10 }}>{r.verdict}</span>
                                </div>
                                {!r.isHidden && r.actualOutput && (
                                  <code style={{ color: "#a5b4fc", background: "rgba(99,102,241,0.1)", padding: "1px 5px", borderRadius: 3, fontFamily: "'JetBrains Mono', monospace", fontSize: 10 }}>{r.actualOutput}</code>
                                )}
                                {r.isHidden && <div style={{ color: "rgba(148,163,184,0.3)", fontSize: 10 }}>Hidden</div>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  /* ══════════════════════════════════════════════════════
     LIST VIEW
  ══════════════════════════════════════════════════════ */
  if (view === "list") {
    const totalProblems = plans.reduce((s, p) => s + (p.totalProblems || 0), 0);
    const totalDone = plans.reduce((s, p) =>
      s + (p.sections?.reduce((ss, sec) => ss + (sec.items?.filter((i) => i.completed)?.length || 0), 0) || 0), 0);

    return (
      <>
        <style>{G}</style>
        <div style={{ minHeight: "100vh", background: t.pageBg, fontFamily: "'Outfit', sans-serif", display: "flex", flexDirection: "column" }}>

          {/* Top nav */}
          <div style={navStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 30, height: 30, background: isDark ? "rgba(99,102,241,0.15)" : "#ede9fe", border: isDark ? "1px solid rgba(99,102,241,0.25)" : "1px solid #ddd6fe", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <BookOpen size={15} color="#7c3aed" />
              </div>
              <span style={{ fontSize: 14, fontWeight: 800, color: t.text, letterSpacing: "-0.01em" }}>Study Plans</span>
              <span style={{ fontSize: 11, fontWeight: 700, background: isDark ? "rgba(99,102,241,0.12)" : "#ede9fe", color: "#7c3aed", border: isDark ? "1px solid rgba(99,102,241,0.2)" : "1px solid #ddd6fe", borderRadius: 20, padding: "2px 9px" }}>
                Student
              </span>
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, background: t.statPillBg, color: t.textSub, border: `1px solid ${t.statPillBorder}`, borderRadius: 20, padding: "4px 12px" }}>
              Batch #{batchId}
            </div>
          </div>

          <FlashBar />

          <div style={{ flex: 1, padding: "36px 40px", maxWidth: 1280, width: "100%", margin: "0 auto" }}>

            <div style={{ marginBottom: 32 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#7c3aed", display: "inline-block" }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: "#7c3aed", letterSpacing: "0.12em", textTransform: "uppercase" }}>Study Plans</span>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
                <div>
                  <h1 style={{ fontSize: 28, fontWeight: 900, color: t.text, letterSpacing: "-0.02em", lineHeight: 1.15, marginBottom: 4 }}>
                    My Study Plans
                  </h1>
                  <p style={{ fontSize: 13, color: t.textSub, fontWeight: 400 }}>
                    Track your progress and solve problems at your own pace
                  </p>
                </div>
                {!plansLoading && plans.length > 0 && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    {[
                      { icon: <Layers size={13} />, label: `${plans.length} Plan${plans.length !== 1 ? "s" : ""}` },
                      { icon: <Target size={13} />, label: `${totalProblems} Problems` },
                      { icon: <Check size={13} />, label: `${totalDone} Solved` },
                    ].map((s, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: t.textSub, background: t.statPillBg, border: `1px solid ${t.statPillBorder}`, borderRadius: 8, padding: "5px 12px" }}>
                        <span style={{ color: "#7c3aed" }}>{s.icon}</span>
                        {s.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div style={{ height: 1, background: t.divider, marginBottom: 28 }} />

            {plansLoading ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
                {[1, 2, 3].map((i) => (
                  <div key={i} style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}`, borderRadius: 16, overflow: "hidden" }}>
                    <Skeleton h={100} r={0} style={{ background: isDark ? "rgba(255,255,255,0.03)" : "#f1f5f9" }} />
                    <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
                      <Skeleton h={18} w="65%" style={{ background: isDark ? "rgba(255,255,255,0.04)" : "#e2e8f0" }} />
                      <Skeleton h={13} style={{ background: isDark ? "rgba(255,255,255,0.03)" : "#e2e8f0" }} />
                      <Skeleton h={13} w="80%" style={{ background: isDark ? "rgba(255,255,255,0.03)" : "#e2e8f0" }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : plans.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
                <div style={{ width: 72, height: 72, background: isDark ? "rgba(99,102,241,0.08)" : "#ede9fe", border: isDark ? "1px solid rgba(99,102,241,0.15)" : "1px solid #ddd6fe", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <BookOpen size={30} color="#7c3aed" />
                </div>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: t.text, marginBottom: 6 }}>No study plans yet</div>
                  <div style={{ fontSize: 13, color: t.textMuted }}>Your trainer hasn't assigned any study plans to your batch yet.</div>
                </div>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
                {plans.map((plan, idx) => {
                  const pct = planProgress(plan);
                  const color = plan.thumbnailColor || "#7c3aed";
                  const doneCnt = plan.sections?.reduce((s, sec) => s + (sec.items?.filter((i) => i.completed)?.length || 0), 0) || 0;
                  return (
                    <div key={plan.id} className="card-hover fade-up"
                      onClick={() => openPlan(plan)}
                      style={{
                        animationDelay: `${idx * 0.06}s`,
                        background: t.cardBg,
                        border: `1px solid ${t.cardBorder}`,
                        borderRadius: 16,
                        overflow: "hidden",
                        boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.3)" : "0 2px 12px rgba(0,0,0,0.06)",
                        display: "flex",
                        flexDirection: "column",
                      }}>
                      {/* Card banner */}
                      <div style={{ height: 100, background: `linear-gradient(140deg, ${color}d0 0%, ${color}80 100%)`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 22px", position: "relative", overflow: "hidden" }}>
                        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.14) 0%, transparent 65%)" }} />
                        <div style={{ position: "relative", fontSize: 40, lineHeight: 1, filter: "drop-shadow(0 3px 8px rgba(0,0,0,0.25))" }}>{plan.icon || "📘"}</div>
                        <div style={{ position: "relative" }}>
                          <ArcProgress pct={pct} size={68} color="rgba(255,255,255,0.95)" />
                        </div>
                      </div>

                      {/* Card body — FIXED: explicit bg from theme token */}
                      <div style={{ padding: "16px 20px 14px", flex: 1, background: t.cardBg }}>
                        <div style={{ fontSize: 15, fontWeight: 800, color: t.text, marginBottom: 5, lineHeight: 1.25 }}>{plan.title}</div>
                        {plan.description && (
                          <div style={{ fontSize: 12.5, color: t.textSub, lineHeight: 1.55, marginBottom: 12 }}>
                            {plan.description.slice(0, 75)}{plan.description.length > 75 ? "…" : ""}
                          </div>
                        )}
                        <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 14 }}>
                          <span style={{ fontSize: 10, fontWeight: 600, background: t.pillBg, color: t.pillText, borderRadius: 20, padding: "3px 9px", border: `1px solid ${t.pillBorder}`, display: "flex", alignItems: "center", gap: 4 }}>
                            <Target size={10} /> {plan.totalProblems || 0} problems
                          </span>
                          {plan.dueDate && (
                            <span style={{ fontSize: 10, fontWeight: 600, background: "rgba(245,158,11,0.08)", color: "#f59e0b", borderRadius: 20, padding: "3px 9px", border: "1px solid rgba(245,158,11,0.18)", display: "flex", alignItems: "center", gap: 4 }}>
                              <Calendar size={10} /> Due {new Date(plan.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <div>
                          <div style={{ height: 4, background: isDark ? "rgba(255,255,255,0.06)" : "#e2e8f0", borderRadius: 4, overflow: "hidden" }}>
                            <div style={{ height: "100%", borderRadius: 4, background: `linear-gradient(90deg, ${color}, ${color}cc)`, width: `${pct}%`, transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)", boxShadow: `0 0 6px ${color}50` }} />
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
                            <span style={{ fontSize: 11, color: t.textMuted, fontWeight: 500 }}>{pct}% complete</span>
                            <span style={{ fontSize: 11, color: t.textMuted, fontWeight: 500 }}>{doneCnt}/{plan.totalProblems || 0}</span>
                          </div>
                        </div>
                      </div>

                      {/* Card footer — FIXED: explicit bg from theme token */}
                      <div style={{ padding: "10px 20px", borderTop: `1px solid ${t.divider}`, background: t.cardBg }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <span style={{ fontSize: 12, color: t.textMuted, fontWeight: 500 }}>
                            {pct === 100 ? "🎉 Completed!" : pct > 0 ? "In progress" : "Not started"}
                          </span>
                          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 700, color: color }}>
                            Open Plan <ChevronRight size={14} />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  /* ══════════════════════════════════════════════════════
     DETAIL VIEW
  ══════════════════════════════════════════════════════ */
  const plan = selectedPlan;
  const overallPct = plan ? planProgress(plan) : 0;
  const planColor = plan?.thumbnailColor || "#7c3aed";

  return (
    <>
      <style>{G + `.solve-btn { transition: all 0.16s ease; } .solve-btn:hover { filter: brightness(1.1); transform: translateY(-1px); } .solve-btn:active { transform: scale(0.97); }`}</style>
      <div style={{ minHeight: "100vh", background: t.pageBg, fontFamily: "'Outfit', sans-serif", display: "flex", flexDirection: "column" }}>

        {/* Top nav */}
        <div style={navStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button className="btn-ghost" onClick={() => { setView("list"); setSelectedPlan(null); }}
              style={{ background: t.pillBg, border: `1px solid ${t.pillBorder}`, color: t.textSub }}>
              <ChevronLeft size={14} /> Back
            </button>
            <div style={{ width: 1, height: 20, background: t.divider }} />
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 12, color: t.breadcrumb, fontWeight: 500 }}>Study Plans</span>
              <ChevronRight size={12} color={t.breadcrumb} />
              <span style={{ fontSize: 12, color: t.breadcrumbActive, fontWeight: 700 }}>{plan?.title || "Plan"}</span>
            </div>
          </div>
          <div style={{ fontSize: 11, fontWeight: 600, background: t.statPillBg, color: t.textSub, border: `1px solid ${t.statPillBorder}`, borderRadius: 20, padding: "4px 12px" }}>
            Batch #{batchId}
          </div>
        </div>

        <FlashBar />

        {planLoading ? (
          <div style={{ flex: 1, padding: "40px", maxWidth: 900, margin: "0 auto", width: "100%", display: "flex", flexDirection: "column", gap: 18 }}>
            <Skeleton h={32} w="50%" style={{ background: isDark ? "rgba(255,255,255,0.05)" : "#e2e8f0" }} />
            <Skeleton h={14} w="70%" style={{ background: isDark ? "rgba(255,255,255,0.03)" : "#e2e8f0" }} />
            <Skeleton h={110} style={{ background: isDark ? "rgba(255,255,255,0.03)" : "#e2e8f0" }} />
            <Skeleton h={180} style={{ background: isDark ? "rgba(255,255,255,0.03)" : "#e2e8f0" }} />
          </div>
        ) : !plan ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, padding: 40 }}>
            <AlertTriangle size={36} color="#ef4444" />
            <p style={{ color: "#ef4444", fontSize: 14 }}>Could not load this plan.</p>
            <button className="btn-ghost" onClick={() => setView("list")} style={{ background: t.pillBg, border: `1px solid ${t.pillBorder}`, color: t.textSub }}>← Go Back</button>
          </div>
        ) : (
          <div style={{ flex: 1, paddingBottom: 80 }}>
            {/* Hero */}
            <div style={{ background: `linear-gradient(145deg, ${planColor}c0 0%, ${planColor}70 40%, ${isDark ? "rgba(15,23,42,0)" : "rgba(248,250,252,0)"} 100%)`, position: "relative", overflow: "hidden", padding: "44px 44px 52px" }}>
              <div style={{ position: "absolute", right: -60, top: -60, width: 280, height: 280, background: `${planColor}15`, borderRadius: "50%", filter: "blur(40px)" }} />
              <div style={{ position: "relative", maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "flex-start", gap: 28, justifyContent: "space-between" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 50, marginBottom: 14, filter: "drop-shadow(0 5px 12px rgba(0,0,0,0.3))", lineHeight: 1 }}>{plan.icon || "📘"}</div>
                  <h1 style={{ fontSize: 30, fontWeight: 900, color: "#f8fafc", marginBottom: 8, lineHeight: 1.1, letterSpacing: "-0.02em", textShadow: "0 2px 12px rgba(0,0,0,0.3)" }}>{plan.title}</h1>
                  {plan.description && (
                    <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.65)", marginBottom: 18, lineHeight: 1.65, maxWidth: 520 }}>{plan.description}</p>
                  )}
                  <div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}>
                    {[
                      { icon: <Target size={12} />, label: `${plan.totalProblems || 0} Problems` },
                      plan.dueDate && { icon: <Calendar size={12} />, label: `Due ${new Date(plan.dueDate).toLocaleDateString()}` },
                      { icon: overallPct === 100 ? <Check size={12} /> : <FileText size={12} />, label: overallPct === 100 ? "Completed" : `${overallPct}% done`, green: overallPct === 100 },
                    ].filter(Boolean).map((tag, i) => (
                      <span key={i} style={{ fontSize: 12, fontWeight: 700, background: tag.green ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)", color: tag.green ? "#22c55e" : "#fff", borderRadius: 20, padding: "4px 12px", border: `1px solid ${tag.green ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.18)"}`, display: "flex", alignItems: "center", gap: 5 }}>
                        {tag.icon} {tag.label}
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{ textAlign: "center", flexShrink: 0 }}>
                  <ArcProgress pct={overallPct} size={100} color="rgba(255,255,255,0.95)" />
                  <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, marginTop: 7, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Overall Progress</div>
                </div>
              </div>
            </div>

            {/* Thin progress bar */}
            <div style={{ height: 3, background: isDark ? "rgba(255,255,255,0.04)" : "#e2e8f0" }}>
              <div style={{ height: "100%", background: `linear-gradient(90deg, ${planColor}, ${planColor}80)`, width: `${overallPct}%`, transition: "width 0.9s cubic-bezier(0.4,0,0.2,1)", boxShadow: `0 0 10px ${planColor}60` }} />
            </div>

            {/* Content */}
            <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 36px" }}>
              {/* Info banner */}
              <div style={{ background: isDark ? "rgba(99,102,241,0.06)" : "#f5f3ff", border: isDark ? "1px solid rgba(99,102,241,0.14)" : "1px solid #ddd6fe", borderRadius: 10, padding: "12px 16px", marginTop: 24, marginBottom: 28, fontSize: 13, lineHeight: 1.55 }}>
                <span style={{ fontWeight: 700, color: "#7c3aed" }}>💡 How it works · </span>
                <span style={{ color: t.textSub }}>
                  Click <strong style={{ color: t.text }}>Solve</strong> → write your solution → click <strong style={{ color: t.text }}>⚡ Submit</strong> → if it passes, click <strong style={{ color: "#22c55e" }}>✓ Mark Done</strong> to save progress.
                </span>
              </div>

              {/* Sections */}
              {!plan.sections || plan.sections.length === 0 ? (
                <div style={{ textAlign: "center", padding: "70px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 60, height: 60, background: isDark ? "rgba(99,102,241,0.08)" : "#ede9fe", border: isDark ? "1px solid rgba(99,102,241,0.15)" : "1px solid #ddd6fe", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Layers size={26} color="#7c3aed" />
                  </div>
                  <div style={{ color: t.textMuted, fontSize: 13 }}>No sections in this plan yet.</div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {plan.sections.map((section, si) => {
                    const total = section.items?.length || 0;
                    const done = section.items?.filter((i) => i.completed)?.length || 0;
                    const sPct = total ? Math.round((done / total) * 100) : 0;
                    const isOpen = expandedSection === section.id;

                    return (
                      <div key={section.id} className="fade-up"
                        style={{ animationDelay: `${si * 0.06}s`, background: t.cardBg, border: `1px solid ${t.cardBorder}`, borderRadius: 14, overflow: "hidden", boxShadow: isDark ? "0 4px 18px rgba(0,0,0,0.2)" : "0 2px 10px rgba(0,0,0,0.05)" }}>
                        {/* Section header */}
                        <div className="section-header-row" onClick={() => setExpandedSection(isOpen ? null : section.id)}
                          style={{ borderLeft: `3px solid ${isOpen ? planColor : "transparent"}`, borderBottom: isOpen ? `1px solid ${t.divider}` : "none", background: t.cardBg }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 10, fontWeight: 700, color: planColor, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 2 }}>Section {si + 1}</div>
                            <div style={{ fontSize: 15, fontWeight: 700, color: t.text }}>{section.title}</div>
                            {section.description && <div style={{ fontSize: 12, color: t.textMuted, marginTop: 2 }}>{section.description}</div>}
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                            <div style={{ textAlign: "right" }}>
                              <div style={{ fontSize: 12, fontWeight: 700, color: t.textSub }}>{done}/{total}</div>
                              <div style={{ fontSize: 10, color: t.textMuted, fontWeight: 500 }}>done</div>
                            </div>
                            <SmallArc pct={sPct} size={42} color={planColor} />
                            <div style={{ width: 26, height: 26, borderRadius: 7, background: t.pillBg, border: `1px solid ${t.pillBorder}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <ChevronDown size={13} color={t.textMuted} style={{ transition: "transform 0.2s ease", transform: isOpen ? "rotate(180deg)" : "none" }} />
                            </div>
                          </div>
                        </div>

                        {/* Items */}
                        {isOpen && (
                          <div style={{ background: t.cardBg }}>
                            {!section.items || section.items.length === 0 ? (
                              <div style={{ padding: "22px", color: t.textMuted, fontSize: 13, textAlign: "center" }}>No problems in this section yet.</div>
                            ) : (
                              section.items.map((item, ii) => {
                                const dc = diffStyle(item.problemDifficulty);
                                return (
                                  <div key={item.id} className="item-row"
                                    style={{ borderLeft: item.completed ? `3px solid #22c55e` : "3px solid transparent", background: item.completed ? (isDark ? "rgba(34,197,94,0.025)" : "rgba(34,197,94,0.03)") : t.cardBg }}>
                                    <div style={{ fontSize: 11, fontWeight: 600, color: t.textMuted, minWidth: 22, textAlign: "center" }}>{ii + 1}</div>
                                    <div style={{ width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: item.completed ? "#22c55e" : t.pillBg, border: item.completed ? "2px solid #22c55e" : `2px solid ${t.pillBorder}`, boxShadow: item.completed ? "0 0 8px rgba(34,197,94,0.35)" : "none", transition: "all 0.22s ease" }}>
                                      {item.completed && <Check size={11} color="#fff" strokeWidth={3} />}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                      <div style={{ fontSize: 13.5, fontWeight: 700, color: item.completed ? t.textMuted : t.text, textDecoration: item.completed ? "line-through" : "none", marginBottom: 5, textDecorationColor: t.textMuted }}>
                                        {item.problemTitle}
                                      </div>
                                      <div style={{ display: "flex", gap: 7, alignItems: "center", flexWrap: "wrap" }}>
                                        <span style={{ fontSize: 10, fontWeight: 700, background: dc.bg, color: dc.color, border: `1px solid ${dc.border}`, borderRadius: 20, padding: "2px 8px" }}>{item.problemDifficulty}</span>
                                        <span style={{ fontSize: 10, fontWeight: 700, background: "rgba(245,158,11,0.08)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 20, padding: "2px 8px", display: "flex", alignItems: "center", gap: 3 }}>
                                          <Trophy size={9} /> {item.problemTotalMarks} pts
                                        </span>
                                        {item.completed && (
                                          <span style={{ fontSize: 10, fontWeight: 700, background: "rgba(34,197,94,0.08)", color: "#22c55e", borderRadius: 20, padding: "2px 8px", border: "1px solid rgba(34,197,94,0.18)", display: "flex", alignItems: "center", gap: 3 }}>
                                            <Check size={9} /> Completed
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                    <div style={{ flexShrink: 0 }}>
                                      {item.completed ? (
                                        <span style={{ fontSize: 11, fontWeight: 700, color: "#22c55e", background: "rgba(34,197,94,0.08)", borderRadius: 8, padding: "5px 12px", border: "1px solid rgba(34,197,94,0.18)", display: "flex", alignItems: "center", gap: 4 }}>
                                          <Check size={11} /> Done
                                        </span>
                                      ) : (
                                        <button className="btn-primary solve-btn" onClick={() => openCompiler(item, section.id)}
                                          style={{ background: `linear-gradient(135deg, ${planColor} 0%, ${planColor}bb 100%)`, color: "#fff", boxShadow: `0 4px 10px ${planColor}40`, padding: "6px 16px", display: "flex", alignItems: "center", gap: 5 }}>
                                          Solve <ChevronRight size={13} />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                );
                              })
                            )}
                            {/* Section progress bar */}
                            <div style={{ height: 3, background: isDark ? "rgba(255,255,255,0.04)" : "#e2e8f0" }}>
                              <div style={{ height: "100%", background: planColor, width: `${sPct}%`, transition: "width 0.6s ease", boxShadow: `0 0 6px ${planColor}50` }} />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}