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

// /* ─────────────────────────────────────────────────────────────
//    CONSTANTS
// ───────────────────────────────────────────────────────────── */
// const LANGUAGES = ["JAVA", "PYTHON", "JAVASCRIPT", "BASH"];
// const LANG_LABEL = {
//   JAVA: "☕ Java",
//   PYTHON: "🐍 Python",
//   JAVASCRIPT: "🟨 JS",
//   BASH: "🖥️ Bash",
// };
// const DEFAULT_CODE = {
//   JAVA: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`,
//   PYTHON: `# Write your solution here\nprint("Hello, World!")`,
//   JAVASCRIPT: `process.stdin.resume();\nprocess.stdin.setEncoding('utf8');\nlet input = '';\nprocess.stdin.on('data', d => input += d);\nprocess.stdin.on('end', () => {\n    console.log("Hello, World!");\n});`,
//   BASH: `#!/bin/bash\necho "Hello, World!"`,
// };

// /* ─── helpers ─────────────────────────────────────────────── */
// const diffColor = (d) =>
//   d === "EASY"
//     ? { color: "#16a34a", bg: "#dcfce7", border: "#bbf7d0" }
//     : d === "MEDIUM"
//       ? { color: "#d97706", bg: "#fef3c7", border: "#fde68a" }
//       : { color: "#dc2626", bg: "#fee2e2", border: "#fecaca" };

// const statusColor = (s) =>
//   s === "SUCCESS" ? "#16a34a" : s === "COMPILE_ERROR" ? "#d97706" : "#dc2626";
// const statusBg = (s) =>
//   s === "SUCCESS" ? "#dcfce7" : s === "COMPILE_ERROR" ? "#fef3c7" : "#fee2e2";
// const verdictColor = (v) =>
//   v === "ACCEPTED" ? "#16a34a" : v === "PARTIAL" ? "#d97706" : "#dc2626";

// /* ─── CircleProgress ──────────────────────────────────────── */
// function CircleProgress({ pct, size = 48, stroke = 4, color = "#6366f1" }) {
//   const r = (size - stroke) / 2;
//   const circ = 2 * Math.PI * r;
//   const offset = circ - (pct / 100) * circ;
//   return (
//     <svg width={size} height={size}>
//       <circle
//         cx={size / 2}
//         cy={size / 2}
//         r={r}
//         fill="none"
//         stroke="#e2e8f0"
//         strokeWidth={stroke}
//       />
//       <circle
//         cx={size / 2}
//         cy={size / 2}
//         r={r}
//         fill="none"
//         stroke={color}
//         strokeWidth={stroke}
//         strokeDasharray={circ}
//         strokeDashoffset={offset}
//         strokeLinecap="round"
//         style={{
//           transform: "rotate(-90deg)",
//           transformOrigin: "50% 50%",
//           transition: "stroke-dashoffset 0.6s ease",
//         }}
//       />
//       <text
//         x="50%"
//         y="50%"
//         textAnchor="middle"
//         dy="0.35em"
//         style={{
//           fontSize: size * 0.22,
//           fontWeight: 700,
//           fill: "#0f172a",
//           fontFamily: "inherit",
//         }}
//       >
//         {pct}%
//       </text>
//     </svg>
//   );
// }

// function ProblemSection({ label, children }) {
//   return (
//     <div style={{ marginBottom: 16 }}>
//       <div
//         style={{
//           fontSize: 11,
//           fontWeight: 700,
//           color: "#6366f1",
//           letterSpacing: "0.08em",
//           textTransform: "uppercase",
//           marginBottom: 6,
//         }}
//       >
//         {label}
//       </div>
//       {children}
//     </div>
//   );
// }

// /* ═══════════════════════════════════════════════════════════
//    MAIN COMPONENT
// ═══════════════════════════════════════════════════════════ */
// export default function StudentStudyPlanPage() {
//   const [batchId, setBatchId] = useState(null);
//   const [batchLoading, setBatchLoading] = useState(true);
//   const [batchError, setBatchError] = useState(false);

//   // views: "list" | "detail" | "compiler"
//   const [view, setView] = useState("list");
//   const [plans, setPlans] = useState([]);
//   const [plansLoading, setPlansLoading] = useState(false);
//   const [selectedPlan, setSelectedPlan] = useState(null);
//   const [planLoading, setPlanLoading] = useState(false);
//   const [expandedSection, setExpandedSection] = useState(null);

//   // compiler
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
//   const textareaRef = useRef(null);

//   /* ── batch init ─────────────────────────────────────── */
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
//     try {
//       const stdin = problemDetail?.sampleInput || "";
//       const res = await runCode(batchId, language, code, stdin);
//       setRunOutput(res.data);
//     } catch (e) {
//       setRunOutput({
//         output: e.response?.data?.message || "Run failed.",
//         status: "RUNTIME_ERROR",
//       });
//     } finally {
//       setRunLoading(false);
//     }
//   };

//   const handleSubmit = async () => {
//     if (!problemDetail) return;
//     setSubmitLoading(true);
//     setJudgeResult(null);
//     setRunOutput(null);
//     try {
//       const res = await submitCodeForJudge(
//         problemDetail.id,
//         batchId,
//         language,
//         code,
//       );
//       const result = res.data;
//       setJudgeResult(result);
//       if (
//         result.overallVerdict === "ACCEPTED" ||
//         result.overallVerdict === "PARTIAL" ||
//         result.marksObtained > 0
//       ) {
//         setCanMarkDone(true);
//         flash(
//           "🎉 Submitted! Your solution passed — click ✓ Mark as Done to save progress.",
//           "ok",
//         );
//       } else {
//         flash("Solution did not pass. Fix your code and try again.", "err");
//       }
//     } catch {
//       setJudgeResult({
//         overallVerdict: "ERROR",
//         marksObtained: 0,
//         totalMarks: 0,
//       });
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
//       flash("✓ Problem marked as complete! Keep going!", "ok");
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
//       const start = ta.selectionStart;
//       const end = ta.selectionEnd;
//       const newCode = code.substring(0, start) + "    " + code.substring(end);
//       setCode(newCode);
//       setTimeout(() => {
//         ta.selectionStart = ta.selectionEnd = start + 4;
//       }, 0);
//     }
//   };

//   const planProgress = (p) => {
//     if (!p?.sections?.length) return 0;
//     const total = p.sections.reduce(
//       (s, sec) => s + (sec.items?.length || 0),
//       0,
//     );
//     const done = p.sections.reduce(
//       (s, sec) => s + (sec.items?.filter((i) => i.completed)?.length || 0),
//       0,
//     );
//     return total ? Math.round((done / total) * 100) : 0;
//   };

//   /* ══════ LOADING / ERROR ══════ */
//   if (batchLoading)
//     return (
//       <div style={S.screen}>
//         <div style={S.spinner} />
//         <p style={{ color: "#64748b", marginTop: 14, fontSize: 14 }}>
//           Loading your study plans…
//         </p>
//       </div>
//     );
//   if (batchError)
//     return (
//       <div style={S.screen}>
//         <div style={{ fontSize: 40, marginBottom: 10 }}>⚠️</div>
//         <p style={{ color: "#dc2626", fontSize: 14 }}>
//           Could not load your batch. Contact your trainer.
//         </p>
//       </div>
//     );

//   /* ══════════════════════════════════════════════════════
//      COMPILER VIEW
//   ══════════════════════════════════════════════════════ */
//   if (view === "compiler") {
//     const problem = problemDetail;
//     const planColor = selectedPlan?.thumbnailColor || "#6366f1";

//     return (
//       <div style={S.root}>
//         {(runLoading || submitLoading) && (
//           <div style={S.runOverlay}>
//             <div style={S.runOverlayBox}>
//               <div style={S.runSpinner} />
//               <div
//                 style={{
//                   fontSize: 15,
//                   fontWeight: 700,
//                   color: "#1e293b",
//                   marginTop: 8,
//                 }}
//               >
//                 {submitLoading ? "⚡ Judging your code…" : "▶ Running code…"}
//               </div>
//               <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
//                 {submitLoading ? "Running all test cases" : "Please wait…"}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* HEADER */}
//         <div style={S.header}>
//           <div style={S.headerLeft}>
//             <button
//               style={S.backBtn}
//               onClick={() => {
//                 setView("detail");
//                 setCompilerItem(null);
//                 setProblemDetail(null);
//                 setJudgeResult(null);
//                 setCanMarkDone(false);
//               }}
//             >
//               ← Plan
//             </button>
//             <span style={S.logoIcon}>📚</span>
//             <span style={S.logoText}>Study Plans</span>
//             {problem && (
//               <span
//                 style={{
//                   ...S.diffChipHeader,
//                   background: diffColor(problem.difficulty).bg,
//                   color: diffColor(problem.difficulty).color,
//                   border: `1px solid ${diffColor(problem.difficulty).border}`,
//                 }}
//               >
//                 {problem.difficulty}
//               </span>
//             )}
//           </div>
//           <div style={S.headerRight}>
//             <div style={S.langToggle}>
//               {LANGUAGES.map((l) => (
//                 <button
//                   key={l}
//                   onClick={() => handleLanguageChange(l)}
//                   style={{
//                     ...S.langBtn,
//                     ...(language === l
//                       ? {
//                           ...S.langBtnActive,
//                           borderColor: planColor,
//                           color: planColor,
//                         }
//                       : {}),
//                   }}
//                 >
//                   {LANG_LABEL[l]}
//                 </button>
//               ))}
//             </div>
//             <button
//               style={S.runBtn}
//               onClick={handleRun}
//               disabled={runLoading || submitLoading}
//             >
//               {runLoading ? (
//                 <>
//                   <span style={S.btnSpinnerDark} /> Running…
//                 </>
//               ) : (
//                 "▶ Run"
//               )}
//             </button>
//             <button
//               style={S.submitBtn}
//               onClick={handleSubmit}
//               disabled={runLoading || submitLoading || !problem}
//             >
//               {submitLoading ? (
//                 <>
//                   <span style={S.btnSpinner} /> Judging…
//                 </>
//               ) : (
//                 "⚡ Submit"
//               )}
//             </button>
//             {canMarkDone && (
//               <button
//                 style={{ ...S.markDoneBtn, opacity: markingItem ? 0.7 : 1 }}
//                 onClick={handleMarkDone}
//                 disabled={!!markingItem}
//               >
//                 {markingItem ? "Saving…" : "✓ Mark as Done"}
//               </button>
//             )}
//           </div>
//         </div>

//         {flashMsg && (
//           <div
//             style={{
//               ...S.flash,
//               background: flashType === "ok" ? "#dcfce7" : "#fee2e2",
//               color: flashType === "ok" ? "#16a34a" : "#dc2626",
//               borderColor: flashType === "ok" ? "#bbf7d0" : "#fecaca",
//             }}
//           >
//             {flashMsg}
//           </div>
//         )}

//         {canMarkDone && (
//           <div style={S.markDoneBanner}>
//             🎉 Your solution passed! Click{" "}
//             <strong style={{ marginLeft: 4, marginRight: 4 }}>
//               ✓ Mark as Done
//             </strong>{" "}
//             in the header to save your progress to this study plan.
//           </div>
//         )}

//         {/* EDITOR LAYOUT */}
//         <div
//           style={{
//             display: "flex",
//             flex: 1,
//             overflow: "hidden",
//             height: "calc(100vh - 56px)",
//           }}
//         >
//           {/* Problem panel */}
//           <div style={S.problemPanel}>
//             {problemLoading ? (
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   height: "100%",
//                   flexDirection: "column",
//                   gap: 10,
//                 }}
//               >
//                 <div style={S.spinner} />
//                 <span style={{ color: "#94a3b8", fontSize: 13 }}>
//                   Loading problem…
//                 </span>
//               </div>
//             ) : !problem ? (
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   height: "100%",
//                   color: "#dc2626",
//                   fontSize: 13,
//                 }}
//               >
//                 Could not load problem.
//               </div>
//             ) : (
//               <div style={S.problemDetailWrap}>
//                 {/* Breadcrumb */}
//                 <div style={S.breadcrumb}>
//                   <span style={{ color: planColor, fontWeight: 700 }}>
//                     {selectedPlan?.icon} {selectedPlan?.title}
//                   </span>
//                   <span style={{ color: "#cbd5e1" }}>›</span>
//                   <span style={{ color: "#94a3b8" }}>Problem</span>
//                 </div>
//                 <h2 style={S.problemTitle}>{problem.title}</h2>
//                 <div style={S.infoRow}>
//                   <span
//                     style={{
//                       ...S.diffChipHeader,
//                       background: diffColor(problem.difficulty).bg,
//                       color: diffColor(problem.difficulty).color,
//                       border: `1px solid ${diffColor(problem.difficulty).border}`,
//                     }}
//                   >
//                     {problem.difficulty}
//                   </span>
//                   <span style={S.marksChip}>🏆 {problem.totalMarks} pts</span>
//                 </div>
//                 <ProblemSection label="Description">
//                   <p style={S.descText}>{problem.description}</p>
//                 </ProblemSection>
//                 {problem.inputFormat && (
//                   <ProblemSection label="Input Format">
//                     <p style={S.descText}>{problem.inputFormat}</p>
//                   </ProblemSection>
//                 )}
//                 {problem.outputFormat && (
//                   <ProblemSection label="Output Format">
//                     <p style={S.descText}>{problem.outputFormat}</p>
//                   </ProblemSection>
//                 )}
//                 {problem.constraints && (
//                   <ProblemSection label="Constraints">
//                     <div style={S.monoBlock}>{problem.constraints}</div>
//                   </ProblemSection>
//                 )}
//                 <div style={S.ioGrid}>
//                   {problem.sampleInput && (
//                     <div style={S.ioBox}>
//                       <div style={S.ioLabel}>Sample Input</div>
//                       <pre style={S.ioContent}>{problem.sampleInput}</pre>
//                     </div>
//                   )}
//                   {problem.sampleOutput && (
//                     <div style={S.ioBox}>
//                       <div style={S.ioLabel}>Sample Output</div>
//                       <pre style={S.ioContent}>{problem.sampleOutput}</pre>
//                     </div>
//                   )}
//                 </div>
//                 {problem.visibleTestCases?.filter((tc) => !tc.isHidden).length >
//                   0 && (
//                   <ProblemSection label="Sample Test Cases">
//                     {problem.visibleTestCases
//                       .filter((tc) => !tc.isHidden)
//                       .map((tc, i) => (
//                         <div key={tc.id} style={S.testCase}>
//                           <div style={S.testCaseLabel}>Case {i + 1}</div>
//                           {tc.input && (
//                             <div style={S.testCaseRow}>
//                               <span style={S.testKey}>Input</span>
//                               <code style={S.testVal}>{tc.input}</code>
//                             </div>
//                           )}
//                           <div style={S.testCaseRow}>
//                             <span style={S.testKey}>Expected</span>
//                             <code style={S.testVal}>{tc.expectedOutput}</code>
//                           </div>
//                         </div>
//                       ))}
//                   </ProblemSection>
//                 )}
//                 {/* Context hint */}
//                 <div
//                   style={{
//                     ...S.planContextBox,
//                     borderLeft: `3px solid ${planColor}`,
//                   }}
//                 >
//                   <div
//                     style={{
//                       fontSize: 11,
//                       fontWeight: 700,
//                       color: planColor,
//                       marginBottom: 4,
//                       textTransform: "uppercase",
//                     }}
//                   >
//                     How to get credit
//                   </div>
//                   <div
//                     style={{ fontSize: 12, color: "#475569", lineHeight: 1.5 }}
//                   >
//                     Write your solution → click <strong>⚡ Submit</strong> →
//                     once your code passes, the <strong>✓ Mark as Done</strong>{" "}
//                     button will appear.
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Editor + Output */}
//           <div
//             style={{
//               flex: 1,
//               display: "flex",
//               flexDirection: "column",
//               overflow: "hidden",
//             }}
//           >
//             <div style={S.editorAreaWrap}>
//               <div style={S.lineNumbers}>
//                 {code.split("\n").map((_, i) => (
//                   <div key={i} style={S.lineNum}>
//                     {i + 1}
//                   </div>
//                 ))}
//               </div>
//               <textarea
//                 ref={textareaRef}
//                 style={S.codeTextarea}
//                 value={code}
//                 onChange={(e) => setCode(e.target.value)}
//                 onKeyDown={handleTabKey}
//                 spellCheck={false}
//                 autoCapitalize="none"
//                 autoCorrect="off"
//                 placeholder="// Start coding here…"
//               />
//             </div>

//             {/* Output */}
//             <div style={S.outputPanel}>
//               {!runOutput && !judgeResult && !runLoading && !submitLoading && (
//                 <div style={S.outputPlaceholder}>
//                   Click <strong>▶ Run</strong> to test with sample input, or{" "}
//                   <strong>⚡ Submit</strong> to judge all test cases.
//                 </div>
//               )}
//               {runOutput && !judgeResult && (
//                 <div>
//                   <div
//                     style={{
//                       display: "flex",
//                       gap: 10,
//                       alignItems: "center",
//                       marginBottom: 10,
//                     }}
//                   >
//                     <span
//                       style={{
//                         ...S.statusChip,
//                         background: statusBg(runOutput.status),
//                         color: statusColor(runOutput.status),
//                       }}
//                     >
//                       ● {runOutput.status}
//                     </span>
//                     {runOutput.executionTimeMs && (
//                       <span style={{ color: "#94a3b8", fontSize: 12 }}>
//                         {runOutput.executionTimeMs}ms
//                       </span>
//                     )}
//                   </div>
//                   <pre style={S.outputPre}>
//                     {runOutput.output || "(no output)"}
//                   </pre>
//                 </div>
//               )}
//               {judgeResult && (
//                 <div>
//                   <div style={S.judgeHeader}>
//                     <span
//                       style={{
//                         ...S.verdictBig,
//                         color: verdictColor(judgeResult.overallVerdict),
//                       }}
//                     >
//                       {judgeResult.overallVerdict === "ACCEPTED" ? "✓ " : "✗ "}
//                       {judgeResult.overallVerdict}
//                     </span>
//                     <span style={S.scoreChip}>
//                       {judgeResult.marksObtained}/{judgeResult.totalMarks} pts
//                     </span>
//                     <span style={{ color: "#94a3b8", fontSize: 12 }}>
//                       {judgeResult.testCasesPassed}/{judgeResult.totalTestCases}{" "}
//                       tests
//                     </span>
//                     {canMarkDone && (
//                       <button
//                         style={{ ...S.markDoneBtn, marginLeft: "auto" }}
//                         onClick={handleMarkDone}
//                         disabled={!!markingItem}
//                       >
//                         {markingItem ? "Saving…" : "✓ Mark as Done"}
//                       </button>
//                     )}
//                   </div>
//                   <div style={S.judgeGrid}>
//                     {judgeResult.judgeResults?.map((r, i) => (
//                       <div
//                         key={i}
//                         style={{
//                           ...S.judgeCard,
//                           background: r.passed ? "#f0fdf4" : "#fff5f5",
//                           borderColor: r.passed ? "#86efac" : "#fca5a5",
//                         }}
//                       >
//                         <div
//                           style={{
//                             display: "flex",
//                             justifyContent: "space-between",
//                             marginBottom: 2,
//                           }}
//                         >
//                           <span
//                             style={{
//                               fontWeight: 700,
//                               color: "#374151",
//                               fontSize: 12,
//                             }}
//                           >
//                             Test {i + 1}
//                           </span>
//                           <span
//                             style={{
//                               color: r.passed ? "#16a34a" : "#dc2626",
//                               fontWeight: 700,
//                               fontSize: 12,
//                             }}
//                           >
//                             {r.verdict}
//                           </span>
//                         </div>
//                         {!r.isHidden && r.actualOutput && (
//                           <div
//                             style={{
//                               marginTop: 4,
//                               fontSize: 11,
//                               color: "#64748b",
//                             }}
//                           >
//                             <span style={{ fontWeight: 600 }}>Output: </span>
//                             <code
//                               style={{
//                                 color: "#4338ca",
//                                 background: "#ede9fe",
//                                 padding: "1px 4px",
//                                 borderRadius: 3,
//                               }}
//                             >
//                               {r.actualOutput}
//                             </code>
//                           </div>
//                         )}
//                         {r.isHidden && (
//                           <div
//                             style={{
//                               color: "#9ca3af",
//                               fontSize: 11,
//                               marginTop: 4,
//                             }}
//                           >
//                             Hidden test case
//                           </div>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   /* ══════════════════════════════════════════════════════
//      LIST VIEW
//   ══════════════════════════════════════════════════════ */
//   if (view === "list")
//     return (
//       <div style={S.root}>
//         <div style={S.header}>
//           <div style={S.headerLeft}>
//             <span style={S.logoIcon}>📚</span>
//             <span style={S.logoText}>Study Plans</span>
//             <span style={S.studentBadge}>Student</span>
//           </div>
//           <div style={S.headerRight}>
//             <span style={S.batchPill}>Batch: {batchId}</span>
//           </div>
//         </div>
//         {flashMsg && (
//           <div
//             style={{
//               ...S.flash,
//               background: flashType === "ok" ? "#dcfce7" : "#fee2e2",
//               color: flashType === "ok" ? "#16a34a" : "#dc2626",
//               borderColor: flashType === "ok" ? "#bbf7d0" : "#fecaca",
//             }}
//           >
//             {flashMsg}
//           </div>
//         )}
//         <div style={S.content}>
//           <div style={S.pageTitle}>
//             My Study Plans
//             <span style={S.countBadge}>{plans.length} plans</span>
//           </div>
//           {plansLoading ? (
//             <div style={{ textAlign: "center", padding: "80px 0" }}>
//               <div style={{ ...S.spinner, margin: "0 auto" }} />
//               <p style={{ color: "#94a3b8", marginTop: 14 }}>Loading plans…</p>
//             </div>
//           ) : plans.length === 0 ? (
//             <div style={S.empty}>
//               <div style={{ fontSize: 56, marginBottom: 14 }}>📭</div>
//               <div
//                 style={{
//                   fontSize: 16,
//                   fontWeight: 700,
//                   color: "#0f172a",
//                   marginBottom: 6,
//                 }}
//               >
//                 No study plans yet
//               </div>
//               <div style={{ fontSize: 13, color: "#94a3b8" }}>
//                 Your trainer hasn't assigned any study plans to your batch.
//               </div>
//             </div>
//           ) : (
//             <div style={S.planGrid}>
//               {plans.map((plan) => {
//                 const pct = planProgress(plan);
//                 const color = plan.thumbnailColor || "#6366f1";
//                 return (
//                   <div
//                     key={plan.id}
//                     style={S.planCard}
//                     onClick={() => openPlan(plan)}
//                   >
//                     <div style={{ ...S.cardBanner, background: color }}>
//                       <span style={S.cardBannerIcon}>{plan.icon || "📘"}</span>
//                       <CircleProgress
//                         pct={pct}
//                         size={48}
//                         stroke={4}
//                         color="rgba(255,255,255,0.9)"
//                       />
//                     </div>
//                     <div style={S.cardBody}>
//                       <div style={S.cardTitle}>{plan.title}</div>
//                       {plan.description && (
//                         <div style={S.cardDesc}>
//                           {plan.description.slice(0, 100)}
//                           {plan.description.length > 100 ? "…" : ""}
//                         </div>
//                       )}
//                       <div style={S.cardMeta}>
//                         <span style={S.metaChip}>
//                           🎯 {plan.totalProblems || 0} problems
//                         </span>
//                         {plan.dueDate && (
//                           <span
//                             style={{
//                               ...S.metaChip,
//                               background: "#fef3c7",
//                               color: "#92400e",
//                             }}
//                           >
//                             📅 Due {new Date(plan.dueDate).toLocaleDateString()}
//                           </span>
//                         )}
//                       </div>
//                       <div style={S.progressBarWrap}>
//                         <div
//                           style={{
//                             ...S.progressBar,
//                             width: `${pct}%`,
//                             background: color,
//                           }}
//                         />
//                       </div>
//                       <div style={S.progressLabel}>{pct}% complete</div>
//                     </div>
//                     <div style={S.cardFooter}>
//                       <button style={{ ...S.openBtn, background: color }}>
//                         Open Plan →
//                       </button>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </div>
//     );

//   /* ══════════════════════════════════════════════════════
//      DETAIL VIEW
//   ══════════════════════════════════════════════════════ */
//   const plan = selectedPlan;
//   const overallPct = plan ? planProgress(plan) : 0;
//   const planColor = plan?.thumbnailColor || "#6366f1";

//   return (
//     <div style={S.root}>
//       <div style={S.header}>
//         <div style={S.headerLeft}>
//           <button
//             style={S.backBtn}
//             onClick={() => {
//               setView("list");
//               setSelectedPlan(null);
//             }}
//           >
//             ← Back
//           </button>
//           <span style={S.logoIcon}>📚</span>
//           <span style={S.logoText}>Study Plans</span>
//           <span style={S.studentBadge}>Student</span>
//         </div>
//         <div style={S.headerRight}>
//           <span style={S.batchPill}>Batch: {batchId}</span>
//         </div>
//       </div>
//       {flashMsg && (
//         <div
//           style={{
//             ...S.flash,
//             background: flashType === "ok" ? "#dcfce7" : "#fee2e2",
//             color: flashType === "ok" ? "#16a34a" : "#dc2626",
//             borderColor: flashType === "ok" ? "#bbf7d0" : "#fecaca",
//           }}
//         >
//           {flashMsg}
//         </div>
//       )}
//       {planLoading ? (
//         <div style={S.screen}>
//           <div style={S.spinner} />
//           <p style={{ color: "#94a3b8", marginTop: 14 }}>Loading plan…</p>
//         </div>
//       ) : !plan ? (
//         <div style={S.screen}>
//           <div style={{ fontSize: 40 }}>😕</div>
//           <p style={{ color: "#dc2626" }}>Could not load this plan.</p>
//           <button style={S.backBtn} onClick={() => setView("list")}>
//             ← Go Back
//           </button>
//         </div>
//       ) : (
//         <div style={S.content}>
//           {/* HERO */}
//           <div style={{ ...S.hero, background: planColor }}>
//             <div style={{ flex: 1 }}>
//               <div style={S.heroIcon}>{plan.icon || "📘"}</div>
//               <div style={S.heroTitle}>{plan.title}</div>
//               {plan.description && (
//                 <div style={S.heroDesc}>{plan.description}</div>
//               )}
//               <div style={S.heroMeta}>
//                 <span style={S.heroBadge}>
//                   🎯 {plan.totalProblems || 0} Problems
//                 </span>
//                 {plan.dueDate && (
//                   <span style={S.heroBadge}>
//                     📅 Due {new Date(plan.dueDate).toLocaleDateString()}
//                   </span>
//                 )}
//               </div>
//             </div>
//             <div style={{ textAlign: "center", flexShrink: 0 }}>
//               <CircleProgress
//                 pct={overallPct}
//                 size={80}
//                 stroke={6}
//                 color="rgba(255,255,255,0.9)"
//               />
//               <div
//                 style={{
//                   color: "rgba(255,255,255,0.8)",
//                   fontSize: 11,
//                   marginTop: 6,
//                   fontWeight: 600,
//                 }}
//               >
//                 Overall Progress
//               </div>
//             </div>
//           </div>

//           <div style={S.overallBarWrap}>
//             <div
//               style={{
//                 ...S.overallBar,
//                 width: `${overallPct}%`,
//                 background: planColor,
//               }}
//             />
//           </div>

//           {/* How it works */}
//           <div style={S.howItWorks}>
//             <span style={{ fontWeight: 700, color: "#1d4ed8" }}>
//               💡 How it works:{" "}
//             </span>
//             <span style={{ color: "#1e40af" }}>
//               Click <strong>Solve →</strong> on any problem → write your
//               solution → click <strong>⚡ Submit</strong> → if it passes, click{" "}
//               <strong>✓ Mark as Done</strong> to save your progress.
//             </span>
//           </div>

//           {/* SECTIONS */}
//           {!plan.sections || plan.sections.length === 0 ? (
//             <div style={S.empty}>
//               <div style={{ fontSize: 40 }}>📂</div>
//               <div style={{ marginTop: 10 }}>No sections in this plan yet.</div>
//             </div>
//           ) : (
//             <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
//               {plan.sections.map((section, si) => {
//                 const total = section.items?.length || 0;
//                 const done =
//                   section.items?.filter((i) => i.completed)?.length || 0;
//                 const sPct = total ? Math.round((done / total) * 100) : 0;
//                 const isOpen = expandedSection === section.id;

//                 return (
//                   <div key={section.id} style={S.sectionCard}>
//                     <div
//                       style={{
//                         ...S.sectionHeader,
//                         borderLeft: `4px solid ${planColor}`,
//                       }}
//                       onClick={() =>
//                         setExpandedSection(isOpen ? null : section.id)
//                       }
//                     >
//                       <div style={S.sectionHeaderLeft}>
//                         <span style={{ ...S.sectionNum, color: planColor }}>
//                           Section {si + 1}
//                         </span>
//                         <span style={S.sectionTitle}>{section.title}</span>
//                         {section.description && (
//                           <span style={S.sectionDesc}>
//                             {section.description}
//                           </span>
//                         )}
//                       </div>
//                       <div style={S.sectionHeaderRight}>
//                         <CircleProgress
//                           pct={sPct}
//                           size={40}
//                           stroke={3}
//                           color={planColor}
//                         />
//                         <span style={S.sectionCount}>
//                           {done}/{total} done
//                         </span>
//                         <span
//                           style={{
//                             color: "#94a3b8",
//                             fontSize: 14,
//                             marginLeft: 8,
//                           }}
//                         >
//                           {isOpen ? "▲" : "▼"}
//                         </span>
//                       </div>
//                     </div>

//                     {isOpen && (
//                       <div style={S.itemsWrap}>
//                         {!section.items || section.items.length === 0 ? (
//                           <div
//                             style={{
//                               padding: "20px",
//                               color: "#94a3b8",
//                               fontSize: 13,
//                               textAlign: "center",
//                             }}
//                           >
//                             No problems in this section.
//                           </div>
//                         ) : (
//                           section.items.map((item, ii) => {
//                             const dc = diffColor(item.problemDifficulty);
//                             return (
//                               <div
//                                 key={item.id}
//                                 style={{
//                                   ...S.itemRow,
//                                   background: item.completed
//                                     ? "#f0fdf4"
//                                     : "#ffffff",
//                                   borderLeft: item.completed
//                                     ? "3px solid #16a34a"
//                                     : "3px solid transparent",
//                                 }}
//                               >
//                                 <div style={S.itemIndex}>{ii + 1}</div>
//                                 <div
//                                   style={{
//                                     ...S.itemCheck,
//                                     background: item.completed
//                                       ? "#16a34a"
//                                       : "#f1f5f9",
//                                     border: item.completed
//                                       ? "2px solid #16a34a"
//                                       : "2px solid #e2e8f0",
//                                   }}
//                                 >
//                                   {item.completed && (
//                                     <svg
//                                       width="12"
//                                       height="12"
//                                       viewBox="0 0 12 12"
//                                     >
//                                       <polyline
//                                         points="2,6 5,9 10,3"
//                                         stroke="#fff"
//                                         strokeWidth="2"
//                                         fill="none"
//                                         strokeLinecap="round"
//                                         strokeLinejoin="round"
//                                       />
//                                     </svg>
//                                   )}
//                                 </div>
//                                 <div style={{ flex: 1, minWidth: 0 }}>
//                                   <div
//                                     style={{
//                                       ...S.itemTitle,
//                                       color: item.completed
//                                         ? "#64748b"
//                                         : "#0f172a",
//                                       textDecoration: item.completed
//                                         ? "line-through"
//                                         : "none",
//                                     }}
//                                   >
//                                     {item.problemTitle}
//                                   </div>
//                                   <div style={S.itemMeta}>
//                                     <span
//                                       style={{
//                                         ...S.diffBadge,
//                                         color: dc.color,
//                                         background: dc.bg,
//                                         border: `1px solid ${dc.border}`,
//                                       }}
//                                     >
//                                       {item.problemDifficulty}
//                                     </span>
//                                     <span style={S.marksBadge}>
//                                       🏆 {item.problemTotalMarks} pts
//                                     </span>
//                                     {item.completed && (
//                                       <span style={S.completedBadge}>
//                                         ✓ Completed
//                                       </span>
//                                     )}
//                                   </div>
//                                 </div>
//                                 <div style={S.itemActions}>
//                                   {item.completed ? (
//                                     <span style={S.doneTag}>✓ Done</span>
//                                   ) : (
//                                     <button
//                                       style={{
//                                         ...S.solveBtn,
//                                         background: planColor,
//                                       }}
//                                       onClick={() =>
//                                         openCompiler(item, section.id)
//                                       }
//                                     >
//                                       Solve →
//                                     </button>
//                                   )}
//                                 </div>
//                               </div>
//                             );
//                           })
//                         )}
//                         <div style={S.sectionFooterBar}>
//                           <div
//                             style={{
//                               ...S.sectionBarFill,
//                               width: `${sPct}%`,
//                               background: planColor,
//                             }}
//                           />
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// /* ─── Styles ──────────────────────────────────────────────── */
// const S = {
//   root: {
//     minHeight: "100vh",
//     background: "#f8fafc",
//     color: "#1e293b",
//     fontFamily: "'Inter','Segoe UI',sans-serif",
//     display: "flex",
//     flexDirection: "column",
//   },
//   screen: {
//     minHeight: "100vh",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     background: "#f8fafc",
//     gap: 8,
//   },
//   spinner: {
//     width: 32,
//     height: 32,
//     border: "3px solid #e2e8f0",
//     borderTop: "3px solid #6366f1",
//     borderRadius: "50%",
//     animation: "spin 0.8s linear infinite",
//   },
//   runOverlay: {
//     position: "fixed",
//     inset: 0,
//     background: "rgba(0,0,0,0.45)",
//     zIndex: 9999,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   runOverlayBox: {
//     background: "#fff",
//     borderRadius: 16,
//     padding: "32px 40px",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     gap: 8,
//     boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
//     minWidth: 280,
//   },
//   runSpinner: {
//     width: 40,
//     height: 40,
//     border: "4px solid #e2e8f0",
//     borderTop: "4px solid #6366f1",
//     borderRadius: "50%",
//     animation: "spin 0.8s linear infinite",
//   },
//   header: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: "0 20px",
//     height: 56,
//     background: "#0f172a",
//     borderBottom: "1px solid #1e293b",
//     flexShrink: 0,
//   },
//   headerLeft: { display: "flex", alignItems: "center", gap: 10 },
//   headerRight: {
//     display: "flex",
//     alignItems: "center",
//     gap: 8,
//     flexWrap: "wrap",
//   },
//   logoIcon: { fontSize: 18 },
//   logoText: { fontSize: 14, fontWeight: 700, color: "#f1f5f9" },
//   studentBadge: {
//     fontSize: 11,
//     background: "#3b82f622",
//     color: "#60a5fa",
//     border: "1px solid #3b82f6",
//     borderRadius: 20,
//     padding: "2px 10px",
//     fontWeight: 600,
//   },
//   batchPill: {
//     fontSize: 11,
//     background: "#1e293b",
//     color: "#94a3b8",
//     borderRadius: 20,
//     padding: "3px 12px",
//     fontWeight: 600,
//   },
//   backBtn: {
//     background: "#1e293b",
//     border: "1px solid #334155",
//     color: "#94a3b8",
//     borderRadius: 6,
//     padding: "5px 14px",
//     cursor: "pointer",
//     fontSize: 12,
//     fontWeight: 600,
//     fontFamily: "inherit",
//   },
//   flash: {
//     padding: "10px 24px",
//     fontSize: 13,
//     textAlign: "center",
//     fontWeight: 600,
//     border: "1px solid",
//     flexShrink: 0,
//   },
//   markDoneBanner: {
//     background: "#fef9c3",
//     borderBottom: "1px solid #fde047",
//     padding: "10px 24px",
//     fontSize: 13,
//     color: "#713f12",
//     textAlign: "center",
//     flexShrink: 0,
//   },
//   content: {
//     flex: 1,
//     padding: "28px 32px",
//     maxWidth: 1100,
//     width: "100%",
//     margin: "0 auto",
//     boxSizing: "border-box",
//   },
//   pageTitle: {
//     fontSize: 22,
//     fontWeight: 800,
//     marginBottom: 24,
//     display: "flex",
//     alignItems: "center",
//     gap: 12,
//     color: "#0f172a",
//   },
//   countBadge: {
//     background: "#e2e8f0",
//     color: "#64748b",
//     borderRadius: 20,
//     padding: "2px 12px",
//     fontSize: 12,
//     fontWeight: 600,
//   },
//   empty: { textAlign: "center", padding: "80px 0", color: "#94a3b8" },
//   planGrid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
//     gap: 20,
//   },
//   planCard: {
//     background: "#fff",
//     border: "1px solid #e2e8f0",
//     borderRadius: 14,
//     overflow: "hidden",
//     boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
//     cursor: "pointer",
//     display: "flex",
//     flexDirection: "column",
//   },
//   cardBanner: {
//     height: 100,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: "0 18px",
//   },
//   cardBannerIcon: { fontSize: 40 },
//   cardBody: { padding: "16px 18px 12px", flex: 1 },
//   cardTitle: {
//     fontSize: 15,
//     fontWeight: 800,
//     color: "#0f172a",
//     marginBottom: 6,
//   },
//   cardDesc: {
//     fontSize: 12,
//     color: "#64748b",
//     lineHeight: 1.5,
//     marginBottom: 10,
//   },
//   cardMeta: { display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 },
//   metaChip: {
//     fontSize: 11,
//     background: "#f1f5f9",
//     color: "#475569",
//     borderRadius: 20,
//     padding: "2px 9px",
//     fontWeight: 600,
//   },
//   progressBarWrap: {
//     height: 6,
//     background: "#f1f5f9",
//     borderRadius: 6,
//     overflow: "hidden",
//     marginBottom: 4,
//   },
//   progressBar: {
//     height: "100%",
//     borderRadius: 6,
//     transition: "width 0.5s ease",
//   },
//   progressLabel: { fontSize: 11, color: "#94a3b8", fontWeight: 600 },
//   cardFooter: { padding: "12px 18px", borderTop: "1px solid #f1f5f9" },
//   openBtn: {
//     color: "#fff",
//     border: "none",
//     borderRadius: 8,
//     padding: "8px 18px",
//     cursor: "pointer",
//     fontWeight: 700,
//     fontSize: 13,
//     fontFamily: "inherit",
//     width: "100%",
//   },
//   hero: {
//     borderRadius: 14,
//     padding: "28px 28px",
//     display: "flex",
//     alignItems: "flex-start",
//     gap: 20,
//     marginBottom: 12,
//     color: "#fff",
//   },
//   heroIcon: { fontSize: 44, marginBottom: 8 },
//   heroTitle: { fontSize: 24, fontWeight: 800, marginBottom: 6 },
//   heroDesc: { fontSize: 13, opacity: 0.85, marginBottom: 12, lineHeight: 1.5 },
//   heroMeta: { display: "flex", gap: 8, flexWrap: "wrap" },
//   heroBadge: {
//     fontSize: 12,
//     background: "rgba(255,255,255,0.22)",
//     color: "#fff",
//     borderRadius: 20,
//     padding: "3px 12px",
//     fontWeight: 600,
//   },
//   overallBarWrap: {
//     height: 8,
//     background: "#e2e8f0",
//     borderRadius: 8,
//     overflow: "hidden",
//     marginBottom: 20,
//   },
//   overallBar: {
//     height: "100%",
//     borderRadius: 8,
//     transition: "width 0.6s ease",
//   },
//   howItWorks: {
//     background: "#eff6ff",
//     border: "1px solid #bfdbfe",
//     borderRadius: 10,
//     padding: "12px 16px",
//     marginBottom: 24,
//     fontSize: 13,
//     lineHeight: 1.5,
//   },
//   sectionCard: {
//     background: "#fff",
//     border: "1px solid #e2e8f0",
//     borderRadius: 12,
//     overflow: "hidden",
//     boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
//   },
//   sectionHeader: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: "16px 18px",
//     cursor: "pointer",
//     gap: 12,
//     background: "#fafafa",
//     borderBottom: "1px solid #f1f5f9",
//   },
//   sectionHeaderLeft: {
//     display: "flex",
//     flexDirection: "column",
//     gap: 2,
//     flex: 1,
//   },
//   sectionNum: {
//     fontSize: 11,
//     fontWeight: 800,
//     textTransform: "uppercase",
//     letterSpacing: 0.8,
//   },
//   sectionTitle: { fontSize: 15, fontWeight: 700, color: "#0f172a" },
//   sectionDesc: { fontSize: 12, color: "#64748b", marginTop: 2 },
//   sectionHeaderRight: {
//     display: "flex",
//     alignItems: "center",
//     gap: 8,
//     flexShrink: 0,
//   },
//   sectionCount: { fontSize: 12, fontWeight: 600, color: "#64748b" },
//   itemsWrap: { display: "flex", flexDirection: "column" },
//   itemRow: {
//     display: "flex",
//     alignItems: "center",
//     gap: 12,
//     padding: "14px 18px",
//     borderBottom: "1px solid #f8fafc",
//   },
//   itemIndex: {
//     fontSize: 12,
//     fontWeight: 700,
//     color: "#cbd5e1",
//     minWidth: 20,
//     textAlign: "center",
//   },
//   itemCheck: {
//     width: 22,
//     height: 22,
//     borderRadius: "50%",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     flexShrink: 0,
//     transition: "all 0.2s",
//   },
//   itemTitle: {
//     fontSize: 14,
//     fontWeight: 600,
//     marginBottom: 4,
//     lineHeight: 1.3,
//   },
//   itemMeta: { display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" },
//   diffBadge: {
//     fontSize: 10,
//     borderRadius: 20,
//     padding: "2px 8px",
//     fontWeight: 700,
//   },
//   marksBadge: {
//     fontSize: 11,
//     background: "#fefce8",
//     color: "#ca8a04",
//     border: "1px solid #fde68a",
//     borderRadius: 20,
//     padding: "2px 8px",
//     fontWeight: 700,
//   },
//   completedBadge: {
//     fontSize: 11,
//     background: "#dcfce7",
//     color: "#16a34a",
//     borderRadius: 20,
//     padding: "2px 8px",
//     fontWeight: 700,
//   },
//   itemActions: { flexShrink: 0 },
//   solveBtn: {
//     color: "#fff",
//     border: "none",
//     borderRadius: 6,
//     padding: "7px 16px",
//     cursor: "pointer",
//     fontWeight: 700,
//     fontSize: 12,
//     fontFamily: "inherit",
//   },
//   doneTag: {
//     fontSize: 12,
//     fontWeight: 700,
//     color: "#16a34a",
//     background: "#dcfce7",
//     borderRadius: 6,
//     padding: "5px 12px",
//   },
//   sectionFooterBar: { height: 4, background: "#f1f5f9" },
//   sectionBarFill: { height: "100%", transition: "width 0.5s ease" },
//   // compiler
//   diffChipHeader: {
//     fontSize: 11,
//     borderRadius: 20,
//     padding: "2px 10px",
//     fontWeight: 700,
//     letterSpacing: "0.04em",
//   },
//   langToggle: { display: "flex", gap: 4 },
//   langBtn: {
//     background: "#1e293b",
//     border: "1px solid #334155",
//     color: "#64748b",
//     padding: "5px 12px",
//     borderRadius: 6,
//     cursor: "pointer",
//     fontSize: 12,
//     fontFamily: "inherit",
//     fontWeight: 600,
//   },
//   langBtnActive: { background: "#0f172a", fontWeight: 700 },
//   runBtn: {
//     background: "#1e293b",
//     color: "#e2e8f0",
//     border: "1px solid #334155",
//     borderRadius: 6,
//     padding: "6px 16px",
//     cursor: "pointer",
//     fontWeight: 700,
//     fontSize: 13,
//     fontFamily: "inherit",
//     display: "flex",
//     alignItems: "center",
//     gap: 4,
//   },
//   submitBtn: {
//     background: "#6366f1",
//     color: "#fff",
//     border: "none",
//     borderRadius: 6,
//     padding: "6px 18px",
//     cursor: "pointer",
//     fontWeight: 700,
//     fontSize: 13,
//     fontFamily: "inherit",
//     display: "flex",
//     alignItems: "center",
//     gap: 4,
//   },
//   markDoneBtn: {
//     background: "#16a34a",
//     color: "#fff",
//     border: "none",
//     borderRadius: 6,
//     padding: "6px 18px",
//     cursor: "pointer",
//     fontWeight: 700,
//     fontSize: 13,
//     fontFamily: "inherit",
//     display: "flex",
//     alignItems: "center",
//     gap: 6,
//     whiteSpace: "nowrap",
//   },
//   btnSpinner: {
//     display: "inline-block",
//     width: 12,
//     height: 12,
//     border: "2px solid rgba(255,255,255,0.3)",
//     borderTop: "2px solid #fff",
//     borderRadius: "50%",
//   },
//   btnSpinnerDark: {
//     display: "inline-block",
//     width: 12,
//     height: 12,
//     border: "2px solid rgba(0,0,0,0.15)",
//     borderTop: "2px solid #475569",
//     borderRadius: "50%",
//   },
//   problemPanel: {
//     width: 380,
//     flexShrink: 0,
//     borderRight: "1px solid #e2e8f0",
//     overflowY: "auto",
//     background: "#fafafa",
//   },
//   problemDetailWrap: { padding: "20px 20px 32px" },
//   breadcrumb: {
//     display: "flex",
//     alignItems: "center",
//     gap: 6,
//     fontSize: 12,
//     marginBottom: 14,
//     flexWrap: "wrap",
//   },
//   problemTitle: {
//     fontSize: 17,
//     fontWeight: 800,
//     color: "#0f172a",
//     margin: "0 0 10px",
//     lineHeight: 1.4,
//   },
//   infoRow: { display: "flex", gap: 8, alignItems: "center", marginBottom: 16 },
//   marksChip: {
//     fontSize: 11,
//     background: "#fefce8",
//     color: "#ca8a04",
//     border: "1px solid #fde68a",
//     borderRadius: 20,
//     padding: "2px 8px",
//     fontWeight: 700,
//   },
//   descText: { fontSize: 13, color: "#475569", lineHeight: 1.7, margin: 0 },
//   monoBlock: {
//     background: "#f1f5f9",
//     border: "1px solid #e2e8f0",
//     borderRadius: 6,
//     padding: "8px 12px",
//     fontSize: 12,
//     color: "#4338ca",
//     fontFamily: "monospace",
//     whiteSpace: "pre-wrap",
//   },
//   ioGrid: {
//     display: "grid",
//     gridTemplateColumns: "1fr 1fr",
//     gap: 10,
//     marginBottom: 16,
//   },
//   ioBox: {
//     background: "#f8fafc",
//     border: "1px solid #e2e8f0",
//     borderRadius: 8,
//     padding: 10,
//   },
//   ioLabel: {
//     fontSize: 10,
//     fontWeight: 700,
//     color: "#94a3b8",
//     textTransform: "uppercase",
//     marginBottom: 6,
//     letterSpacing: "0.06em",
//   },
//   ioContent: {
//     margin: 0,
//     fontSize: 12,
//     color: "#0f172a",
//     fontFamily: "monospace",
//     whiteSpace: "pre-wrap",
//   },
//   testCase: {
//     background: "#f8fafc",
//     border: "1px solid #e2e8f0",
//     borderRadius: 8,
//     padding: "10px 12px",
//     marginBottom: 8,
//   },
//   testCaseLabel: {
//     fontSize: 11,
//     color: "#94a3b8",
//     fontWeight: 700,
//     marginBottom: 6,
//   },
//   testCaseRow: {
//     display: "flex",
//     gap: 8,
//     alignItems: "flex-start",
//     marginBottom: 4,
//   },
//   testKey: {
//     color: "#64748b",
//     fontSize: 11,
//     minWidth: 60,
//     flexShrink: 0,
//     fontWeight: 600,
//   },
//   testVal: {
//     color: "#4338ca",
//     fontSize: 11,
//     background: "#ede9fe",
//     padding: "1px 5px",
//     borderRadius: 4,
//     wordBreak: "break-all",
//     fontFamily: "monospace",
//   },
//   planContextBox: {
//     background: "#f0f9ff",
//     borderRadius: 8,
//     padding: "12px 14px",
//     marginTop: 16,
//   },
//   editorAreaWrap: {
//     flex: 1,
//     display: "flex",
//     overflow: "hidden",
//     background: "#0f172a",
//     minHeight: 0,
//   },
//   lineNumbers: {
//     padding: "16px 12px 16px 8px",
//     background: "#0f172a",
//     borderRight: "1px solid #1e293b",
//     minWidth: 44,
//     textAlign: "right",
//     userSelect: "none",
//     overflowY: "hidden",
//     flexShrink: 0,
//   },
//   lineNum: { fontSize: 13, lineHeight: "21.5px", color: "#334155" },
//   codeTextarea: {
//     flex: 1,
//     background: "transparent",
//     border: "none",
//     outline: "none",
//     color: "#e2e8f0",
//     fontSize: 13,
//     lineHeight: "21.5px",
//     padding: "16px",
//     resize: "none",
//     fontFamily: "'JetBrains Mono','Fira Code',monospace",
//     overflowY: "auto",
//     tabSize: 4,
//   },
//   outputPanel: {
//     height: 220,
//     borderTop: "1px solid #e2e8f0",
//     background: "#ffffff",
//     overflowY: "auto",
//     padding: "14px 18px",
//     flexShrink: 0,
//   },
//   outputPlaceholder: {
//     color: "#94a3b8",
//     fontSize: 13,
//     padding: "20px 0",
//     textAlign: "center",
//   },
//   statusChip: {
//     display: "inline-block",
//     borderRadius: 20,
//     padding: "3px 12px",
//     fontSize: 12,
//     fontWeight: 700,
//     marginBottom: 8,
//   },
//   outputPre: {
//     margin: 0,
//     fontSize: 13,
//     color: "#1e293b",
//     lineHeight: 1.6,
//     whiteSpace: "pre-wrap",
//     wordBreak: "break-all",
//     fontFamily: "'JetBrains Mono',monospace",
//   },
//   judgeHeader: {
//     display: "flex",
//     gap: 16,
//     alignItems: "center",
//     marginBottom: 12,
//     flexWrap: "wrap",
//   },
//   verdictBig: { fontSize: 16, fontWeight: 900 },
//   scoreChip: {
//     background: "#fefce8",
//     color: "#ca8a04",
//     border: "1px solid #fde68a",
//     borderRadius: 20,
//     padding: "3px 12px",
//     fontSize: 12,
//     fontWeight: 700,
//   },
//   judgeGrid: { display: "flex", flexWrap: "wrap", gap: 8 },
//   judgeCard: {
//     border: "1px solid",
//     borderRadius: 8,
//     padding: "8px 12px",
//     minWidth: 130,
//     fontSize: 12,
//   },
// };

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

const diffStyle = (d) =>
  d === "EASY"
    ? {
        color: "#22c55e",
        bg: "rgba(34,197,94,0.1)",
        border: "rgba(34,197,94,0.25)",
      }
    : d === "MEDIUM"
      ? {
          color: "#f59e0b",
          bg: "rgba(245,158,11,0.1)",
          border: "rgba(245,158,11,0.25)",
        }
      : {
          color: "#ef4444",
          bg: "rgba(239,68,68,0.1)",
          border: "rgba(239,68,68,0.25)",
        };

const statusColor = (s) =>
  s === "SUCCESS" ? "#22c55e" : s === "COMPILE_ERROR" ? "#f59e0b" : "#ef4444";
const verdictColor = (v) =>
  v === "ACCEPTED" ? "#22c55e" : v === "PARTIAL" ? "#f59e0b" : "#ef4444";

/* ── Arc Progress (compact, glow version) ── */
function ArcProgress({ pct, size = 80, color = "#6366f1" }) {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg
      width={size}
      height={size}
      style={{ filter: `drop-shadow(0 0 8px ${color}60)` }}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth={7}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={7}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{
          transform: "rotate(-90deg)",
          transformOrigin: "50% 50%",
          transition: "stroke-dashoffset 0.9s cubic-bezier(0.4,0,0.2,1)",
        }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy="0.35em"
        style={{
          fontSize: size * 0.195,
          fontWeight: 800,
          fill: "#f8fafc",
          fontFamily: "'Outfit', sans-serif",
        }}
      >
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
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth={5}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={5}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{
          transform: "rotate(-90deg)",
          transformOrigin: "50% 50%",
          transition: "stroke-dashoffset 0.6s ease",
        }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy="0.35em"
        style={{
          fontSize: size * 0.22,
          fontWeight: 800,
          fill: color,
          fontFamily: "'Outfit', sans-serif",
        }}
      >
        {pct}%
      </text>
    </svg>
  );
}

/* ── Skeleton loader ── */
function Skeleton({ w = "100%", h = 16, r = 8, style = {} }) {
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: r,
        background:
          "linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%)",
        backgroundSize: "400px 100%",
        animation: "shimmer 1.6s infinite linear",
        ...style,
      }}
    />
  );
}

const G = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { background: #0f172a; }
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.18); }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes shimmer { from { background-position: -400px 0; } to { background-position: 400px 0; } }
  @keyframes glow-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
  @keyframes slide-in { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }
  .fade-up { animation: fadeUp 0.35s ease both; }
  .slide-in { animation: slide-in 0.25s ease both; }
  .card-hover {
    transition: transform 0.22s cubic-bezier(0.4,0,0.2,1), box-shadow 0.22s ease, border-color 0.22s ease;
    cursor: pointer;
  }
  .card-hover:hover {
    transform: translateY(-4px);
    box-shadow: 0 24px 56px rgba(0,0,0,0.45) !important;
    border-color: rgba(99,102,241,0.3) !important;
  }
  .btn-primary {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 20px; border: none; border-radius: 10px; cursor: pointer;
    font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 13px;
    transition: all 0.18s ease; position: relative; overflow: hidden;
  }
  .btn-primary:hover { filter: brightness(1.12); transform: translateY(-1px); }
  .btn-primary:active { transform: scale(0.97); }
  .btn-ghost {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 7px 16px; border-radius: 9px; cursor: pointer;
    font-family: 'Outfit', sans-serif; font-weight: 600; font-size: 13px;
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
    color: rgba(255,255,255,0.65);
    transition: all 0.18s ease;
  }
  .btn-ghost:hover { background: rgba(255,255,255,0.09); color: rgba(255,255,255,0.9); border-color: rgba(255,255,255,0.18); }
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
    padding: 6px 14px; border-radius: 8px; border: none; cursor: pointer;
    font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 12px;
    transition: all 0.15s ease;
  }
  .section-header-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 18px 24px; cursor: pointer;
    transition: background 0.15s ease;
    border-left: 3px solid transparent;
  }
  .section-header-row:hover { background: rgba(255,255,255,0.02); }
  .output-tab {
    padding: 5px 16px; border-radius: 7px; border: none; cursor: pointer;
    font-family: 'Outfit', sans-serif; font-weight: 600; font-size: 12px;
    transition: all 0.15s ease;
  }
`;

export default function StudentStudyPlanPage() {
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
      setRunOutput({
        output: e.response?.data?.message || "Run failed.",
        status: "RUNTIME_ERROR",
      });
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
      const res = await submitCodeForJudge(
        problemDetail.id,
        batchId,
        language,
        code,
      );
      const result = res.data;
      setJudgeResult(result);
      if (
        result.overallVerdict === "ACCEPTED" ||
        result.overallVerdict === "PARTIAL" ||
        result.marksObtained > 0
      ) {
        setCanMarkDone(true);
        flash(
          "🎉 Solution passed! Click Mark as Done to save your progress.",
          "ok",
        );
      } else {
        flash("Solution did not pass. Review and try again.", "err");
      }
    } catch {
      setJudgeResult({
        overallVerdict: "ERROR",
        marksObtained: 0,
        totalMarks: 0,
      });
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
      const start = ta.selectionStart,
        end = ta.selectionEnd;
      const newCode = code.substring(0, start) + "    " + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        ta.selectionStart = ta.selectionEnd = start + 4;
      }, 0);
    }
  };

  const planProgress = (p) => {
    if (!p?.sections?.length) return 0;
    const total = p.sections.reduce(
      (s, sec) => s + (sec.items?.length || 0),
      0,
    );
    const done = p.sections.reduce(
      (s, sec) => s + (sec.items?.filter((i) => i.completed)?.length || 0),
      0,
    );
    return total ? Math.round((done / total) * 100) : 0;
  };

  /* ──────────────────────────── LOADING ──────────────────────────── */
  if (batchLoading)
    return (
      <>
        <style>{G}</style>
        <div
          style={{
            minHeight: "100vh",
            background: "#0f172a",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
            fontFamily: "'Outfit', sans-serif",
          }}
        >
          <div style={{ position: "relative" }}>
            <div
              style={{
                width: 52,
                height: 52,
                border: "2px solid rgba(99,102,241,0.15)",
                borderTop: "2px solid #6366f1",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 6,
                borderRadius: "50%",
                background: "rgba(99,102,241,0.08)",
              }}
            />
          </div>
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: 15,
                fontWeight: 600,
              }}
            >
              Loading workspace
            </p>
            <p
              style={{
                color: "rgba(255,255,255,0.3)",
                fontSize: 13,
                marginTop: 4,
              }}
            >
              Connecting to your batch…
            </p>
          </div>
        </div>
      </>
    );

  if (batchError)
    return (
      <>
        <style>{G}</style>
        <div
          style={{
            minHeight: "100vh",
            background: "#0f172a",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            fontFamily: "'Outfit', sans-serif",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.25)",
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
            }}
          >
            ⚠️
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ color: "#f8fafc", fontSize: 16, fontWeight: 700 }}>
              Unable to load batch
            </p>
            <p
              style={{
                color: "rgba(255,255,255,0.4)",
                fontSize: 13,
                marginTop: 6,
              }}
            >
              Please contact your trainer to resolve this.
            </p>
          </div>
        </div>
      </>
    );

  /* ─────────────────────────── FLASH BAR ─────────────────────────── */
  const FlashBar = () =>
    flashMsg ? (
      <div
        style={{
          padding: "10px 24px",
          fontSize: 13,
          textAlign: "center",
          fontWeight: 600,
          background:
            flashType === "ok"
              ? "rgba(34,197,94,0.08)"
              : "rgba(239,68,68,0.08)",
          borderBottom: `1px solid ${flashType === "ok" ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
          color: flashType === "ok" ? "#22c55e" : "#ef4444",
        }}
      >
        {flashMsg}
      </div>
    ) : null;

  /* ═══════════════════════════════════════════════════════
     COMPILER VIEW
  ═══════════════════════════════════════════════════════ */
  if (view === "compiler") {
    const problem = problemDetail;
    const planColor = selectedPlan?.thumbnailColor || "#6366f1";
    const dc = problem ? diffStyle(problem.difficulty) : null;
    const lineCount = code.split("\n").length;

    return (
      <>
        <style>
          {G +
            `
          .lang-tab:hover { background: rgba(255,255,255,0.06) !important; }
          .tc-pill { transition: transform 0.15s ease; }
          .tc-pill:hover { transform: scale(1.02); }
        `}
        </style>
        <div
          style={{
            height: "100vh",
            background: "#0f172a",
            display: "flex",
            flexDirection: "column",
            fontFamily: "'Outfit', sans-serif",
            overflow: "hidden",
          }}
        >
          {/* Judging overlay */}
          {(runLoading || submitLoading) && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(10,15,30,0.88)",
                backdropFilter: "blur(10px)",
                zIndex: 9999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  background:
                    "linear-gradient(145deg, #131c30 0%, #1a2540 100%)",
                  border: "1px solid rgba(99,102,241,0.25)",
                  borderRadius: 20,
                  padding: "44px 60px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 18,
                  boxShadow:
                    "0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
                }}
              >
                <div style={{ position: "relative" }}>
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      border: `2px solid rgba(99,102,241,0.15)`,
                      borderTop: `2px solid ${planColor}`,
                      borderRadius: "50%",
                      animation: "spin 0.7s linear infinite",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 8,
                      borderRadius: "50%",
                      background: `${planColor}15`,
                    }}
                  />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 800,
                      color: "#f8fafc",
                      textAlign: "center",
                      marginBottom: 6,
                    }}
                  >
                    {submitLoading ? "⚡ Judging your code" : "▶ Running code"}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "rgba(255,255,255,0.35)",
                      textAlign: "center",
                    }}
                  >
                    {submitLoading
                      ? "Running against all test cases…"
                      : "Testing with sample input…"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Top Navigation Bar ── */}
          <div
            style={{
              height: 54,
              background: "rgba(13,19,33,0.98)",
              backdropFilter: "blur(16px)",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              alignItems: "center",
              padding: "0 20px",
              gap: 10,
              flexShrink: 0,
              zIndex: 100,
            }}
          >
            {/* Back + breadcrumb */}
            <button
              className="btn-ghost"
              onClick={() => {
                setView("detail");
                setCompilerItem(null);
                setProblemDetail(null);
                setJudgeResult(null);
                setCanMarkDone(false);
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M9 11L5 7L9 3"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Back
            </button>

            <div
              style={{
                width: 1,
                height: 22,
                background: "rgba(255,255,255,0.08)",
              }}
            />
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.35)",
                  fontWeight: 500,
                }}
              >
                Study Plans
              </span>
              <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 12 }}>
                ›
              </span>
              {selectedPlan && (
                <span
                  style={{
                    fontSize: 13,
                    color: "rgba(255,255,255,0.55)",
                    fontWeight: 500,
                  }}
                >
                  {selectedPlan.title}
                </span>
              )}
              <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 12 }}>
                ›
              </span>
              <span style={{ fontSize: 13, color: "#f8fafc", fontWeight: 700 }}>
                {problem?.title || "Problem"}
              </span>
            </div>

            {problem && dc && (
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  background: dc.bg,
                  color: dc.color,
                  border: `1px solid ${dc.border}`,
                  borderRadius: 20,
                  padding: "2px 10px",
                  letterSpacing: "0.04em",
                }}
              >
                {problem.difficulty}
              </span>
            )}

            {/* Right controls */}
            <div
              style={{
                marginLeft: "auto",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              {/* Language selector */}
              <div
                style={{
                  display: "flex",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 10,
                  padding: 3,
                  gap: 2,
                }}
              >
                {LANGUAGES.map((l) => (
                  <button
                    key={l}
                    className="lang-tab"
                    onClick={() => handleLanguageChange(l)}
                    style={{
                      background: language === l ? planColor : "transparent",
                      color: language === l ? "#fff" : "rgba(255,255,255,0.4)",
                      boxShadow:
                        language === l ? `0 2px 10px ${planColor}50` : "none",
                    }}
                  >
                    {LANG_ICON[l]} {LANG_LABEL[l]}
                  </button>
                ))}
              </div>

              <div
                style={{
                  width: 1,
                  height: 22,
                  background: "rgba(255,255,255,0.08)",
                }}
              />

              <button
                className="btn-ghost"
                onClick={handleRun}
                disabled={runLoading || submitLoading}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="currentColor"
                >
                  <path d="M2 1.5l9 4.5-9 4.5V1.5z" />
                </svg>
                Run
              </button>

              <button
                className="btn-primary"
                onClick={handleSubmit}
                disabled={runLoading || submitLoading || !problem}
                style={{
                  background: `linear-gradient(135deg, ${planColor} 0%, ${planColor}bb 100%)`,
                  color: "#fff",
                  boxShadow: `0 4px 14px ${planColor}40`,
                  opacity: runLoading || submitLoading || !problem ? 0.6 : 1,
                }}
              >
                ⚡ Submit
              </button>

              {canMarkDone && (
                <button
                  className="btn-primary"
                  onClick={handleMarkDone}
                  disabled={!!markingItem}
                  style={{
                    background:
                      "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                    color: "#fff",
                    boxShadow: "0 4px 14px rgba(34,197,94,0.35)",
                    whiteSpace: "nowrap",
                    opacity: markingItem ? 0.7 : 1,
                  }}
                >
                  {markingItem ? "Saving…" : "✓ Mark Done"}
                </button>
              )}
            </div>
          </div>

          <FlashBar />

          {/* "Mark as done" reminder */}
          {canMarkDone && (
            <div
              style={{
                background: "rgba(245,158,11,0.07)",
                borderBottom: "1px solid rgba(245,158,11,0.18)",
                padding: "9px 24px",
                fontSize: 13,
                color: "#f59e0b",
                textAlign: "center",
                flexShrink: 0,
                fontWeight: 500,
              }}
            >
              🏆 Your solution passed! Click <strong>✓ Mark Done</strong> in the
              toolbar to save your progress.
            </div>
          )}

          {/* ── Editor Layout ── */}
          <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
            {/* LEFT: Problem Panel */}
            <div
              style={{
                width: 380,
                flexShrink: 0,
                borderRight: "1px solid rgba(255,255,255,0.06)",
                overflowY: "auto",
                background: "#0d1424",
              }}
            >
              {problemLoading ? (
                <div
                  style={{
                    padding: 28,
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                  }}
                >
                  <Skeleton h={24} w="70%" />
                  <Skeleton h={14} w="40%" />
                  <Skeleton h={80} />
                  <Skeleton h={60} />
                  <Skeleton h={100} />
                </div>
              ) : !problem ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    gap: 12,
                    padding: 32,
                  }}
                >
                  <div style={{ fontSize: 40 }}>😕</div>
                  <p
                    style={{
                      color: "#ef4444",
                      fontSize: 14,
                      textAlign: "center",
                    }}
                  >
                    Could not load problem details.
                  </p>
                </div>
              ) : (
                <div style={{ padding: "28px 24px 56px" }}>
                  {/* Title & meta */}
                  <h2
                    style={{
                      fontSize: 19,
                      fontWeight: 800,
                      color: "#f8fafc",
                      lineHeight: 1.3,
                      marginBottom: 12,
                    }}
                  >
                    {problem.title}
                  </h2>
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      alignItems: "center",
                      marginBottom: 24,
                      flexWrap: "wrap",
                    }}
                  >
                    {dc && (
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          background: dc.bg,
                          color: dc.color,
                          border: `1px solid ${dc.border}`,
                          borderRadius: 20,
                          padding: "3px 10px",
                        }}
                      >
                        {problem.difficulty}
                      </span>
                    )}
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        background: "rgba(245,158,11,0.1)",
                        color: "#f59e0b",
                        border: "1px solid rgba(245,158,11,0.2)",
                        borderRadius: 20,
                        padding: "3px 10px",
                      }}
                    >
                      🏆 {problem.totalMarks} pts
                    </span>
                  </div>

                  {/* Sections */}
                  {[
                    {
                      label: "Description",
                      content: problem.description,
                      mono: false,
                    },
                    {
                      label: "Input Format",
                      content: problem.inputFormat,
                      mono: false,
                    },
                    {
                      label: "Output Format",
                      content: problem.outputFormat,
                      mono: false,
                    },
                    {
                      label: "Constraints",
                      content: problem.constraints,
                      mono: true,
                    },
                  ]
                    .filter((s) => s.content)
                    .map(({ label, content, mono }) => (
                      <div key={label} style={{ marginBottom: 22 }}>
                        <div
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: "rgba(148,163,184,0.6)",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            marginBottom: 8,
                          }}
                        >
                          {label}
                        </div>
                        {mono ? (
                          <div
                            style={{
                              background: "rgba(99,102,241,0.07)",
                              border: "1px solid rgba(99,102,241,0.15)",
                              borderRadius: 10,
                              padding: "12px 14px",
                              fontSize: 12.5,
                              color: "#a5b4fc",
                              fontFamily: "'JetBrains Mono', monospace",
                              whiteSpace: "pre-wrap",
                              lineHeight: 1.7,
                            }}
                          >
                            {content}
                          </div>
                        ) : (
                          <p
                            style={{
                              fontSize: 13.5,
                              color: "#94a3b8",
                              lineHeight: 1.75,
                            }}
                          >
                            {content}
                          </p>
                        )}
                      </div>
                    ))}

                  {/* Sample IO */}
                  {(problem.sampleInput || problem.sampleOutput) && (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 10,
                        marginBottom: 22,
                      }}
                    >
                      {problem.sampleInput && (
                        <div
                          style={{
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.07)",
                            borderRadius: 12,
                            padding: "12px 14px",
                          }}
                        >
                          <div
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              color: "rgba(148,163,184,0.5)",
                              textTransform: "uppercase",
                              letterSpacing: "0.1em",
                              marginBottom: 8,
                            }}
                          >
                            Input
                          </div>
                          <pre
                            style={{
                              fontSize: 12,
                              color: "#e2e8f0",
                              fontFamily: "'JetBrains Mono', monospace",
                              whiteSpace: "pre-wrap",
                            }}
                          >
                            {problem.sampleInput}
                          </pre>
                        </div>
                      )}
                      {problem.sampleOutput && (
                        <div
                          style={{
                            background: "rgba(34,197,94,0.05)",
                            border: "1px solid rgba(34,197,94,0.15)",
                            borderRadius: 12,
                            padding: "12px 14px",
                          }}
                        >
                          <div
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              color: "rgba(34,197,94,0.6)",
                              textTransform: "uppercase",
                              letterSpacing: "0.1em",
                              marginBottom: 8,
                            }}
                          >
                            Output
                          </div>
                          <pre
                            style={{
                              fontSize: 12,
                              color: "#22c55e",
                              fontFamily: "'JetBrains Mono', monospace",
                              whiteSpace: "pre-wrap",
                            }}
                          >
                            {problem.sampleOutput}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Test cases */}
                  {problem.visibleTestCases?.filter((tc) => !tc.isHidden)
                    .length > 0 && (
                    <div style={{ marginBottom: 22 }}>
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: "rgba(148,163,184,0.6)",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          marginBottom: 10,
                        }}
                      >
                        Sample Test Cases
                      </div>
                      {problem.visibleTestCases
                        .filter((tc) => !tc.isHidden)
                        .map((tc, i) => (
                          <div
                            key={tc.id}
                            className="tc-pill"
                            style={{
                              background: "rgba(255,255,255,0.03)",
                              border: "1px solid rgba(255,255,255,0.07)",
                              borderRadius: 10,
                              padding: "12px 14px",
                              marginBottom: 8,
                            }}
                          >
                            <div
                              style={{
                                fontSize: 11,
                                color: "rgba(148,163,184,0.5)",
                                fontWeight: 600,
                                marginBottom: 8,
                              }}
                            >
                              Case {i + 1}
                            </div>
                            {tc.input && (
                              <div
                                style={{
                                  display: "flex",
                                  gap: 10,
                                  marginBottom: 6,
                                  fontSize: 12,
                                  alignItems: "center",
                                }}
                              >
                                <span
                                  style={{
                                    color: "rgba(148,163,184,0.5)",
                                    minWidth: 52,
                                    fontWeight: 600,
                                    fontSize: 11,
                                  }}
                                >
                                  Input
                                </span>
                                <code
                                  style={{
                                    color: "#a5b4fc",
                                    background: "rgba(99,102,241,0.1)",
                                    padding: "2px 8px",
                                    borderRadius: 5,
                                    fontFamily: "'JetBrains Mono', monospace",
                                    fontSize: 12,
                                  }}
                                >
                                  {tc.input}
                                </code>
                              </div>
                            )}
                            <div
                              style={{
                                display: "flex",
                                gap: 10,
                                fontSize: 12,
                                alignItems: "center",
                              }}
                            >
                              <span
                                style={{
                                  color: "rgba(148,163,184,0.5)",
                                  minWidth: 52,
                                  fontWeight: 600,
                                  fontSize: 11,
                                }}
                              >
                                Expected
                              </span>
                              <code
                                style={{
                                  color: "#22c55e",
                                  background: "rgba(34,197,94,0.08)",
                                  padding: "2px 8px",
                                  borderRadius: 5,
                                  fontFamily: "'JetBrains Mono', monospace",
                                  fontSize: 12,
                                }}
                              >
                                {tc.expectedOutput}
                              </code>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}

                  {/* Credit box */}
                  <div
                    style={{
                      background: `linear-gradient(135deg, ${planColor}0f, ${planColor}06)`,
                      border: `1px solid ${planColor}20`,
                      borderRadius: 12,
                      padding: "14px 16px",
                      marginTop: 8,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: planColor,
                        marginBottom: 6,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                      }}
                    >
                      Getting credit
                    </div>
                    <div
                      style={{
                        fontSize: 12.5,
                        color: "rgba(148,163,184,0.7)",
                        lineHeight: 1.65,
                      }}
                    >
                      Write your solution →{" "}
                      <span style={{ color: "#e2e8f0", fontWeight: 600 }}>
                        ⚡ Submit
                      </span>{" "}
                      → once it passes, click{" "}
                      <span style={{ color: "#22c55e", fontWeight: 600 }}>
                        ✓ Mark Done
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT: Code Editor + Output */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              {/* Editor area */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  overflow: "hidden",
                  background: "#020617",
                }}
              >
                {/* Line numbers */}
                <div
                  style={{
                    padding: "22px 14px 22px 18px",
                    background: "#020617",
                    borderRight: "1px solid rgba(255,255,255,0.04)",
                    minWidth: 54,
                    textAlign: "right",
                    userSelect: "none",
                    overflowY: "hidden",
                    flexShrink: 0,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  {Array.from({ length: lineCount }, (_, i) => (
                    <div
                      key={i}
                      style={{
                        fontSize: 13,
                        lineHeight: "22px",
                        color: "rgba(148,163,184,0.2)",
                        fontWeight: 500,
                      }}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>

                {/* Textarea */}
                <textarea
                  ref={textareaRef}
                  style={{
                    flex: 1,
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: "#e2e8f0",
                    fontSize: 13.5,
                    lineHeight: "22px",
                    padding: "22px 24px",
                    resize: "none",
                    fontFamily: "'JetBrains Mono', monospace",
                    overflowY: "auto",
                    tabSize: 4,
                    caretColor: "#6366f1",
                    letterSpacing: "0.01em",
                  }}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onKeyDown={handleTabKey}
                  spellCheck={false}
                  autoCapitalize="none"
                  autoCorrect="off"
                  placeholder="// Start coding here…"
                />
              </div>

              {/* Output panel */}
              <div
                style={{
                  height: 240,
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                  background: "#0a1020",
                  flexShrink: 0,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Tab bar */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "0 16px",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                    height: 40,
                    gap: 4,
                    flexShrink: 0,
                    background: "rgba(0,0,0,0.2)",
                  }}
                >
                  {["output", "results"].map((tab) => (
                    <button
                      key={tab}
                      className="output-tab"
                      onClick={() => setActiveOutputTab(tab)}
                      style={{
                        background:
                          activeOutputTab === tab
                            ? "rgba(99,102,241,0.12)"
                            : "transparent",
                        border:
                          activeOutputTab === tab
                            ? "1px solid rgba(99,102,241,0.25)"
                            : "1px solid transparent",
                        color:
                          activeOutputTab === tab
                            ? "#a5b4fc"
                            : "rgba(148,163,184,0.5)",
                      }}
                    >
                      {tab === "output" ? "▶ Output" : "⚡ Results"}
                    </button>
                  ))}
                  {judgeResult && (
                    <div
                      style={{
                        marginLeft: "auto",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: "rgba(148,163,184,0.5)",
                        }}
                      >
                        {judgeResult.testCasesPassed}/
                        {judgeResult.totalTestCases} passed
                      </span>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 900,
                          color: verdictColor(judgeResult.overallVerdict),
                          padding: "2px 10px",
                          background: `${verdictColor(judgeResult.overallVerdict)}15`,
                          borderRadius: 6,
                          border: `1px solid ${verdictColor(judgeResult.overallVerdict)}30`,
                        }}
                      >
                        {judgeResult.overallVerdict === "ACCEPTED"
                          ? "✓ "
                          : "✗ "}
                        {judgeResult.overallVerdict}
                      </span>
                    </div>
                  )}
                </div>

                {/* Output content */}
                <div
                  style={{ flex: 1, overflowY: "auto", padding: "14px 18px" }}
                >
                  {activeOutputTab === "output" && (
                    <>
                      {!runOutput && !runLoading && (
                        <div
                          style={{
                            color: "rgba(148,163,184,0.3)",
                            fontSize: 13,
                            paddingTop: 12,
                            textAlign: "center",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <span style={{ fontSize: 24 }}>▷</span>
                          <span>
                            Click{" "}
                            <span
                              style={{
                                color: "rgba(255,255,255,0.5)",
                                fontWeight: 600,
                              }}
                            >
                              Run
                            </span>{" "}
                            to test with sample input
                          </span>
                        </div>
                      )}
                      {runOutput && (
                        <div className="slide-in">
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                              marginBottom: 10,
                            }}
                          >
                            <span
                              style={{
                                borderRadius: 6,
                                padding: "3px 10px",
                                fontSize: 11,
                                fontWeight: 700,
                                background:
                                  runOutput.status === "SUCCESS"
                                    ? "rgba(34,197,94,0.1)"
                                    : "rgba(239,68,68,0.1)",
                                color: statusColor(runOutput.status),
                                border: `1px solid ${statusColor(runOutput.status)}30`,
                              }}
                            >
                              ● {runOutput.status}
                            </span>
                            {runOutput.executionTimeMs && (
                              <span
                                style={{
                                  color: "rgba(148,163,184,0.4)",
                                  fontSize: 12,
                                }}
                              >
                                {runOutput.executionTimeMs}ms
                              </span>
                            )}
                          </div>
                          <pre
                            style={{
                              fontSize: 13,
                              color: "#94a3b8",
                              lineHeight: 1.6,
                              whiteSpace: "pre-wrap",
                              wordBreak: "break-all",
                              fontFamily: "'JetBrains Mono', monospace",
                            }}
                          >
                            {runOutput.output || "(no output)"}
                          </pre>
                        </div>
                      )}
                    </>
                  )}

                  {activeOutputTab === "results" && (
                    <>
                      {!judgeResult && !submitLoading && (
                        <div
                          style={{
                            color: "rgba(148,163,184,0.3)",
                            fontSize: 13,
                            paddingTop: 12,
                            textAlign: "center",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <span style={{ fontSize: 24 }}>⚡</span>
                          <span>
                            Click{" "}
                            <span
                              style={{
                                color: "rgba(255,255,255,0.5)",
                                fontWeight: 600,
                              }}
                            >
                              Submit
                            </span>{" "}
                            to judge all test cases
                          </span>
                        </div>
                      )}
                      {judgeResult && (
                        <div className="slide-in">
                          <div
                            style={{
                              display: "flex",
                              gap: 12,
                              alignItems: "center",
                              marginBottom: 14,
                              flexWrap: "wrap",
                            }}
                          >
                            <span
                              style={{
                                fontSize: 12,
                                background: "rgba(245,158,11,0.1)",
                                color: "#f59e0b",
                                border: "1px solid rgba(245,158,11,0.2)",
                                borderRadius: 6,
                                padding: "3px 10px",
                                fontWeight: 700,
                              }}
                            >
                              {judgeResult.marksObtained}/
                              {judgeResult.totalMarks} pts
                            </span>
                            {canMarkDone && (
                              <button
                                className="btn-primary"
                                onClick={handleMarkDone}
                                disabled={!!markingItem}
                                style={{
                                  marginLeft: "auto",
                                  background:
                                    "linear-gradient(135deg, #22c55e, #16a34a)",
                                  color: "#fff",
                                  boxShadow: "0 4px 12px rgba(34,197,94,0.3)",
                                  fontSize: 12,
                                  padding: "5px 14px",
                                }}
                              >
                                {markingItem ? "Saving…" : "✓ Mark Done"}
                              </button>
                            )}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 8,
                            }}
                          >
                            {judgeResult.judgeResults?.map((r, i) => (
                              <div
                                key={i}
                                className="tc-pill"
                                style={{
                                  background: r.passed
                                    ? "rgba(34,197,94,0.07)"
                                    : "rgba(239,68,68,0.07)",
                                  border: `1px solid ${r.passed ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
                                  borderRadius: 10,
                                  padding: "8px 12px",
                                  minWidth: 110,
                                  fontSize: 12,
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginBottom: 4,
                                  }}
                                >
                                  <span
                                    style={{
                                      fontWeight: 700,
                                      color: "rgba(248,250,252,0.6)",
                                      fontSize: 11,
                                    }}
                                  >
                                    Test {i + 1}
                                  </span>
                                  <span
                                    style={{
                                      color: r.passed ? "#22c55e" : "#ef4444",
                                      fontWeight: 700,
                                      fontSize: 11,
                                    }}
                                  >
                                    {r.verdict}
                                  </span>
                                </div>
                                {!r.isHidden && r.actualOutput && (
                                  <code
                                    style={{
                                      color: "#a5b4fc",
                                      background: "rgba(99,102,241,0.1)",
                                      padding: "1px 5px",
                                      borderRadius: 4,
                                      fontFamily: "'JetBrains Mono', monospace",
                                      fontSize: 11,
                                    }}
                                  >
                                    {r.actualOutput}
                                  </code>
                                )}
                                {r.isHidden && (
                                  <div
                                    style={{
                                      color: "rgba(148,163,184,0.3)",
                                      fontSize: 11,
                                    }}
                                  >
                                    Hidden
                                  </div>
                                )}
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

  /* ═══════════════════════════════════════════════════════
     LIST VIEW
  ═══════════════════════════════════════════════════════ */
  if (view === "list") {
    return (
      <>
        <style>
          {G +
            `
          .plan-card:hover .open-btn-inner { transform: translateX(3px); }
        `}
        </style>
        <div
          style={{
            minHeight: "100vh",
            background: "#0f172a",
            fontFamily: "'Outfit', sans-serif",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Top nav */}
          <div
            style={{
              height: 60,
              background: "rgba(11,17,30,0.97)",
              backdropFilter: "blur(16px)",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              alignItems: "center",
              padding: "0 32px",
              justifyContent: "space-between",
              position: "sticky",
              top: 0,
              zIndex: 50,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  background: "linear-gradient(135deg, #6366f1, #818cf8)",
                  borderRadius: 9,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  boxShadow: "0 4px 12px rgba(99,102,241,0.4)",
                }}
              >
                📚
              </div>
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: "#f8fafc",
                  letterSpacing: "-0.01em",
                }}
              >
                Study Plans
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  background: "rgba(99,102,241,0.12)",
                  color: "#818cf8",
                  border: "1px solid rgba(99,102,241,0.2)",
                  borderRadius: 20,
                  padding: "2px 10px",
                }}
              >
                Student
              </span>
            </div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                background: "rgba(255,255,255,0.04)",
                color: "rgba(148,163,184,0.7)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 20,
                padding: "5px 14px",
              }}
            >
              Batch #{batchId}
            </div>
          </div>

          <FlashBar />

          <div
            style={{
              flex: 1,
              padding: "48px 40px",
              maxWidth: 1280,
              width: "100%",
              margin: "0 auto",
            }}
          >
            {/* Page heading */}
            <div style={{ marginBottom: 40 }}>
              <h1
                style={{
                  fontSize: 32,
                  fontWeight: 900,
                  color: "#f8fafc",
                  letterSpacing: "-0.025em",
                  lineHeight: 1.1,
                }}
              >
                My Study Plans
              </h1>
              <p
                style={{
                  fontSize: 14,
                  color: "#64748b",
                  marginTop: 8,
                  fontWeight: 500,
                }}
              >
                Track your progress and solve problems at your own pace
              </p>
            </div>

            {plansLoading ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
                  gap: 24,
                }}
              >
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      borderRadius: 20,
                      overflow: "hidden",
                    }}
                  >
                    <Skeleton h={110} r={0} />
                    <div
                      style={{
                        padding: "20px 22px",
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                      }}
                    >
                      <Skeleton h={20} w="65%" />
                      <Skeleton h={14} />
                      <Skeleton h={14} w="80%" />
                    </div>
                  </div>
                ))}
              </div>
            ) : plans.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "100px 0",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                <div
                  style={{
                    width: 80,
                    height: 80,
                    background: "rgba(99,102,241,0.08)",
                    border: "1px solid rgba(99,102,241,0.15)",
                    borderRadius: 24,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 36,
                  }}
                >
                  📭
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 700,
                      color: "#e2e8f0",
                      marginBottom: 8,
                    }}
                  >
                    No study plans yet
                  </div>
                  <div style={{ fontSize: 14, color: "#475569" }}>
                    Your trainer hasn't assigned any study plans to your batch
                    yet.
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 24,
                  }}
                >
                  <p
                    style={{ fontSize: 13, color: "#475569", fontWeight: 500 }}
                  >
                    {plans.length} plan{plans.length !== 1 ? "s" : ""} assigned
                  </p>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(340px, 1fr))",
                    gap: 24,
                  }}
                >
                  {plans.map((plan, idx) => {
                    const pct = planProgress(plan);
                    const color = plan.thumbnailColor || "#6366f1";
                    return (
                      <div
                        key={plan.id}
                        className="card-hover plan-card fade-up"
                        onClick={() => openPlan(plan)}
                        style={{
                          animationDelay: `${idx * 0.07}s`,
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid rgba(255,255,255,0.07)",
                          borderRadius: 20,
                          overflow: "hidden",
                          boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        {/* Card banner */}
                        <div
                          style={{
                            height: 116,
                            background: `linear-gradient(145deg, ${color}e0 0%, ${color}90 60%, ${color}60 100%)`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "0 24px",
                            position: "relative",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              position: "absolute",
                              inset: 0,
                              background:
                                "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.14) 0%, transparent 65%)",
                            }}
                          />
                          <div
                            style={{
                              position: "absolute",
                              right: -20,
                              top: -20,
                              width: 120,
                              height: 120,
                              background: "rgba(255,255,255,0.04)",
                              borderRadius: "50%",
                            }}
                          />
                          <div
                            style={{
                              position: "relative",
                              fontSize: 44,
                              lineHeight: 1,
                              filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.3))",
                            }}
                          >
                            {plan.icon || "📘"}
                          </div>
                          <div style={{ position: "relative" }}>
                            <ArcProgress
                              pct={pct}
                              size={74}
                              color="rgba(255,255,255,0.95)"
                            />
                          </div>
                        </div>

                        {/* Card body */}
                        <div style={{ padding: "20px 22px 16px", flex: 1 }}>
                          <div
                            style={{
                              fontSize: 16,
                              fontWeight: 800,
                              color: "#f1f5f9",
                              marginBottom: 6,
                              lineHeight: 1.25,
                            }}
                          >
                            {plan.title}
                          </div>
                          {plan.description && (
                            <div
                              style={{
                                fontSize: 13,
                                color: "#64748b",
                                lineHeight: 1.6,
                                marginBottom: 14,
                              }}
                            >
                              {plan.description.slice(0, 85)}
                              {plan.description.length > 85 ? "…" : ""}
                            </div>
                          )}

                          {/* Tags */}
                          <div
                            style={{
                              display: "flex",
                              gap: 8,
                              flexWrap: "wrap",
                              marginBottom: 16,
                            }}
                          >
                            <span
                              style={{
                                fontSize: 11,
                                fontWeight: 600,
                                background: "rgba(255,255,255,0.06)",
                                color: "#94a3b8",
                                borderRadius: 20,
                                padding: "3px 10px",
                                border: "1px solid rgba(255,255,255,0.07)",
                              }}
                            >
                              🎯 {plan.totalProblems || 0} problems
                            </span>
                            {plan.dueDate && (
                              <span
                                style={{
                                  fontSize: 11,
                                  fontWeight: 600,
                                  background: "rgba(245,158,11,0.08)",
                                  color: "#f59e0b",
                                  borderRadius: 20,
                                  padding: "3px 10px",
                                  border: "1px solid rgba(245,158,11,0.18)",
                                }}
                              >
                                📅 Due{" "}
                                {new Date(plan.dueDate).toLocaleDateString()}
                              </span>
                            )}
                          </div>

                          {/* Progress bar */}
                          <div style={{ marginBottom: 4 }}>
                            <div
                              style={{
                                height: 4,
                                background: "rgba(255,255,255,0.06)",
                                borderRadius: 4,
                                overflow: "hidden",
                              }}
                            >
                              <div
                                style={{
                                  height: "100%",
                                  borderRadius: 4,
                                  background: `linear-gradient(90deg, ${color}, ${color}cc)`,
                                  width: `${pct}%`,
                                  transition:
                                    "width 0.8s cubic-bezier(0.4,0,0.2,1)",
                                  boxShadow: `0 0 8px ${color}50`,
                                }}
                              />
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginTop: 6,
                              }}
                            >
                              <span
                                style={{
                                  fontSize: 11,
                                  color: "#475569",
                                  fontWeight: 500,
                                }}
                              >
                                {pct}% complete
                              </span>
                              <span
                                style={{
                                  fontSize: 11,
                                  color: "#475569",
                                  fontWeight: 500,
                                }}
                              >
                                {plan.sections?.reduce(
                                  (s, sec) =>
                                    s +
                                    (sec.items?.filter((i) => i.completed)
                                      ?.length || 0),
                                  0,
                                ) || 0}
                                /{plan.totalProblems || 0}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Card footer */}
                        <div
                          style={{
                            padding: "12px 22px",
                            borderTop: "1px solid rgba(255,255,255,0.05)",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <span
                              style={{
                                fontSize: 13,
                                color: "#475569",
                                fontWeight: 500,
                              }}
                            >
                              {pct === 100
                                ? "🎉 Completed!"
                                : pct > 0
                                  ? "In progress"
                                  : "Not started"}
                            </span>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                fontSize: 13,
                                fontWeight: 700,
                                color: color,
                              }}
                            >
                              Open Plan
                              <span
                                className="open-btn-inner"
                                style={{
                                  display: "inline-block",
                                  transition: "transform 0.2s ease",
                                }}
                              >
                                →
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </>
    );
  }

  /* ═══════════════════════════════════════════════════════
     DETAIL VIEW
  ═══════════════════════════════════════════════════════ */
  const plan = selectedPlan;
  const overallPct = plan ? planProgress(plan) : 0;
  const planColor = plan?.thumbnailColor || "#6366f1";

  return (
    <>
      <style>
        {G +
          `
        .solve-btn:hover { filter: brightness(1.12); transform: translateY(-1px); }
        .solve-btn:active { transform: scale(0.97); }
        .solve-btn { transition: all 0.18s ease; }
      `}
      </style>
      <div
        style={{
          minHeight: "100vh",
          background: "#0f172a",
          fontFamily: "'Outfit', sans-serif",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Top nav */}
        <div
          style={{
            height: 60,
            background: "rgba(11,17,30,0.97)",
            backdropFilter: "blur(16px)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            alignItems: "center",
            padding: "0 32px",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            zIndex: 50,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              className="btn-ghost"
              onClick={() => {
                setView("list");
                setSelectedPlan(null);
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M9 11L5 7L9 3"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Back
            </button>
            <div
              style={{
                width: 1,
                height: 22,
                background: "rgba(255,255,255,0.08)",
              }}
            />
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 13, color: "#475569", fontWeight: 500 }}>
                Study Plans
              </span>
              <span style={{ color: "rgba(255,255,255,0.2)" }}>›</span>
              <span style={{ fontSize: 13, color: "#f8fafc", fontWeight: 700 }}>
                {plan?.title || "Plan"}
              </span>
            </div>
          </div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              background: "rgba(255,255,255,0.04)",
              color: "rgba(148,163,184,0.7)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 20,
              padding: "5px 14px",
            }}
          >
            Batch #{batchId}
          </div>
        </div>

        <FlashBar />

        {planLoading ? (
          <div
            style={{
              flex: 1,
              padding: "48px 40px",
              maxWidth: 900,
              margin: "0 auto",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            <Skeleton h={36} w="50%" />
            <Skeleton h={16} w="70%" />
            <Skeleton h={120} />
            <Skeleton h={200} />
          </div>
        ) : !plan ? (
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              padding: 40,
            }}
          >
            <div style={{ fontSize: 40 }}>😕</div>
            <p style={{ color: "#ef4444", fontSize: 15 }}>
              Could not load this plan.
            </p>
            <button className="btn-ghost" onClick={() => setView("list")}>
              ← Go Back
            </button>
          </div>
        ) : (
          <div style={{ flex: 1, paddingBottom: 80 }}>
            {/* Hero */}
            <div
              style={{
                background: `linear-gradient(145deg, ${planColor}c0 0%, ${planColor}70 40%, rgba(15,23,42,0) 100%)`,
                position: "relative",
                overflow: "hidden",
                padding: "52px 48px 60px",
              }}
            >
              {/* Decorative circles */}
              <div
                style={{
                  position: "absolute",
                  right: -60,
                  top: -60,
                  width: 300,
                  height: 300,
                  background: `${planColor}15`,
                  borderRadius: "50%",
                  filter: "blur(40px)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  right: 80,
                  bottom: -40,
                  width: 200,
                  height: 200,
                  background: `${planColor}10`,
                  borderRadius: "50%",
                  filter: "blur(30px)",
                }}
              />

              <div
                style={{
                  position: "relative",
                  maxWidth: 1200,
                  margin: "0 auto",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 32,
                  justifyContent: "space-between",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 56,
                      marginBottom: 16,
                      filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.35))",
                      lineHeight: 1,
                    }}
                  >
                    {plan.icon || "📘"}
                  </div>
                  <h1
                    style={{
                      fontSize: 34,
                      fontWeight: 900,
                      color: "#f8fafc",
                      marginBottom: 10,
                      lineHeight: 1.1,
                      letterSpacing: "-0.02em",
                      textShadow: "0 2px 14px rgba(0,0,0,0.3)",
                    }}
                  >
                    {plan.title}
                  </h1>
                  {plan.description && (
                    <p
                      style={{
                        fontSize: 14.5,
                        color: "rgba(255,255,255,0.65)",
                        marginBottom: 20,
                        lineHeight: 1.65,
                        maxWidth: 560,
                      }}
                    >
                      {plan.description}
                    </p>
                  )}
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        background: "rgba(255,255,255,0.12)",
                        backdropFilter: "blur(8px)",
                        color: "#fff",
                        borderRadius: 20,
                        padding: "5px 14px",
                        border: "1px solid rgba(255,255,255,0.18)",
                      }}
                    >
                      🎯 {plan.totalProblems || 0} Problems
                    </span>
                    {plan.dueDate && (
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          background: "rgba(255,255,255,0.12)",
                          backdropFilter: "blur(8px)",
                          color: "#fff",
                          borderRadius: 20,
                          padding: "5px 14px",
                          border: "1px solid rgba(255,255,255,0.18)",
                        }}
                      >
                        📅 Due {new Date(plan.dueDate).toLocaleDateString()}
                      </span>
                    )}
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        background:
                          overallPct === 100
                            ? "rgba(34,197,94,0.2)"
                            : "rgba(255,255,255,0.12)",
                        backdropFilter: "blur(8px)",
                        color: overallPct === 100 ? "#22c55e" : "#fff",
                        borderRadius: 20,
                        padding: "5px 14px",
                        border: `1px solid ${overallPct === 100 ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.18)"}`,
                      }}
                    >
                      {overallPct === 100
                        ? "✓ Completed"
                        : `${overallPct}% done`}
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: "center", flexShrink: 0 }}>
                  <ArcProgress
                    pct={overallPct}
                    size={108}
                    color="rgba(255,255,255,0.95)"
                  />
                  <div
                    style={{
                      color: "rgba(255,255,255,0.5)",
                      fontSize: 11,
                      marginTop: 8,
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                  >
                    Overall Progress
                  </div>
                </div>
              </div>
            </div>

            {/* Thin progress bar */}
            <div style={{ height: 3, background: "rgba(255,255,255,0.04)" }}>
              <div
                style={{
                  height: "100%",
                  background: `linear-gradient(90deg, ${planColor}, ${planColor}80)`,
                  width: `${overallPct}%`,
                  transition: "width 0.9s cubic-bezier(0.4,0,0.2,1)",
                  boxShadow: `0 0 10px ${planColor}60`,
                }}
              />
            </div>

            {/* Content */}
            <div
              style={{ maxWidth: 1000, margin: "0 auto", padding: "0 40px" }}
            >
              {/* Info banner */}
              <div
                style={{
                  background: "rgba(99,102,241,0.06)",
                  border: "1px solid rgba(99,102,241,0.14)",
                  borderRadius: 12,
                  padding: "14px 18px",
                  marginTop: 28,
                  marginBottom: 32,
                  fontSize: 13.5,
                  lineHeight: 1.55,
                }}
              >
                <span style={{ fontWeight: 700, color: "#818cf8" }}>
                  💡 How it works ·{" "}
                </span>
                <span style={{ color: "#64748b" }}>
                  Click <strong style={{ color: "#94a3b8" }}>Solve</strong> on
                  any problem → write your solution in the editor → click{" "}
                  <strong style={{ color: "#94a3b8" }}>⚡ Submit</strong> → if
                  it passes, click{" "}
                  <strong style={{ color: "#22c55e" }}>✓ Mark Done</strong> to
                  save progress.
                </span>
              </div>

              {/* Sections */}
              {!plan.sections || plan.sections.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "80px 0",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 16,
                  }}
                >
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      background: "rgba(99,102,241,0.08)",
                      border: "1px solid rgba(99,102,241,0.15)",
                      borderRadius: 18,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 28,
                    }}
                  >
                    📂
                  </div>
                  <div style={{ color: "#475569", fontSize: 14 }}>
                    No sections in this plan yet.
                  </div>
                </div>
              ) : (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 16 }}
                >
                  {plan.sections.map((section, si) => {
                    const total = section.items?.length || 0;
                    const done =
                      section.items?.filter((i) => i.completed)?.length || 0;
                    const sPct = total ? Math.round((done / total) * 100) : 0;
                    const isOpen = expandedSection === section.id;

                    return (
                      <div
                        key={section.id}
                        className="fade-up"
                        style={{
                          animationDelay: `${si * 0.07}s`,
                          background: "rgba(255,255,255,0.025)",
                          border: "1px solid rgba(255,255,255,0.07)",
                          borderRadius: 16,
                          overflow: "hidden",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                        }}
                      >
                        {/* Section header */}
                        <div
                          className="section-header-row"
                          onClick={() =>
                            setExpandedSection(isOpen ? null : section.id)
                          }
                          style={{
                            borderLeft: `3px solid ${isOpen ? planColor : "transparent"}`,
                            borderBottom: isOpen
                              ? "1px solid rgba(255,255,255,0.06)"
                              : "none",
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <div
                              style={{
                                fontSize: 11,
                                fontWeight: 700,
                                color: planColor,
                                textTransform: "uppercase",
                                letterSpacing: "0.1em",
                                marginBottom: 3,
                              }}
                            >
                              Section {si + 1}
                            </div>
                            <div
                              style={{
                                fontSize: 16,
                                fontWeight: 700,
                                color: "#e2e8f0",
                              }}
                            >
                              {section.title}
                            </div>
                            {section.description && (
                              <div
                                style={{
                                  fontSize: 12.5,
                                  color: "#475569",
                                  marginTop: 3,
                                }}
                              >
                                {section.description}
                              </div>
                            )}
                          </div>

                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 14,
                              flexShrink: 0,
                            }}
                          >
                            <div style={{ textAlign: "right" }}>
                              <div
                                style={{
                                  fontSize: 13,
                                  fontWeight: 700,
                                  color: "#94a3b8",
                                }}
                              >
                                {done}/{total}
                              </div>
                              <div
                                style={{
                                  fontSize: 11,
                                  color: "#475569",
                                  fontWeight: 500,
                                }}
                              >
                                problems done
                              </div>
                            </div>
                            <SmallArc pct={sPct} size={44} color={planColor} />
                            <div
                              style={{
                                width: 28,
                                height: 28,
                                borderRadius: 8,
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <span
                                style={{
                                  color: "rgba(148,163,184,0.5)",
                                  fontSize: 11,
                                  display: "inline-block",
                                  transition: "transform 0.2s ease",
                                  transform: isOpen ? "rotate(180deg)" : "none",
                                }}
                              >
                                ▼
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Items */}
                        {isOpen && (
                          <div>
                            {!section.items || section.items.length === 0 ? (
                              <div
                                style={{
                                  padding: "24px",
                                  color: "#475569",
                                  fontSize: 13,
                                  textAlign: "center",
                                }}
                              >
                                No problems in this section yet.
                              </div>
                            ) : (
                              section.items.map((item, ii) => {
                                const dc = diffStyle(item.problemDifficulty);
                                return (
                                  <div
                                    key={item.id}
                                    className="item-row"
                                    style={{
                                      borderLeft: item.completed
                                        ? `3px solid #22c55e`
                                        : "3px solid transparent",
                                      background: item.completed
                                        ? "rgba(34,197,94,0.025)"
                                        : "transparent",
                                    }}
                                  >
                                    {/* Index */}
                                    <div
                                      style={{
                                        fontSize: 12,
                                        fontWeight: 600,
                                        color: "#334155",
                                        minWidth: 24,
                                        textAlign: "center",
                                      }}
                                    >
                                      {ii + 1}
                                    </div>

                                    {/* Status icon */}
                                    <div
                                      style={{
                                        width: 24,
                                        height: 24,
                                        borderRadius: "50%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexShrink: 0,
                                        background: item.completed
                                          ? "#22c55e"
                                          : "rgba(255,255,255,0.04)",
                                        border: item.completed
                                          ? "2px solid #22c55e"
                                          : "2px solid rgba(255,255,255,0.09)",
                                        boxShadow: item.completed
                                          ? "0 0 10px rgba(34,197,94,0.35)"
                                          : "none",
                                        transition: "all 0.25s ease",
                                      }}
                                    >
                                      {item.completed && (
                                        <svg
                                          width="12"
                                          height="12"
                                          viewBox="0 0 12 12"
                                          fill="none"
                                        >
                                          <polyline
                                            points="2,6 5,9 10,3"
                                            stroke="#fff"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          />
                                        </svg>
                                      )}
                                    </div>

                                    {/* Problem info */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                      <div
                                        style={{
                                          fontSize: 14,
                                          fontWeight: 700,
                                          color: item.completed
                                            ? "#475569"
                                            : "#e2e8f0",
                                          textDecoration: item.completed
                                            ? "line-through"
                                            : "none",
                                          marginBottom: 6,
                                          textDecorationColor: "#334155",
                                        }}
                                      >
                                        {item.problemTitle}
                                      </div>
                                      <div
                                        style={{
                                          display: "flex",
                                          gap: 8,
                                          alignItems: "center",
                                          flexWrap: "wrap",
                                        }}
                                      >
                                        <span
                                          style={{
                                            fontSize: 11,
                                            fontWeight: 700,
                                            background: dc.bg,
                                            color: dc.color,
                                            border: `1px solid ${dc.border}`,
                                            borderRadius: 20,
                                            padding: "2px 9px",
                                          }}
                                        >
                                          {item.problemDifficulty}
                                        </span>
                                        <span
                                          style={{
                                            fontSize: 11,
                                            fontWeight: 700,
                                            background: "rgba(245,158,11,0.08)",
                                            color: "#f59e0b",
                                            border:
                                              "1px solid rgba(245,158,11,0.2)",
                                            borderRadius: 20,
                                            padding: "2px 9px",
                                          }}
                                        >
                                          🏆 {item.problemTotalMarks} pts
                                        </span>
                                        {item.completed && (
                                          <span
                                            style={{
                                              fontSize: 11,
                                              fontWeight: 700,
                                              background:
                                                "rgba(34,197,94,0.08)",
                                              color: "#22c55e",
                                              borderRadius: 20,
                                              padding: "2px 9px",
                                              border:
                                                "1px solid rgba(34,197,94,0.18)",
                                            }}
                                          >
                                            ✓ Completed
                                          </span>
                                        )}
                                      </div>
                                    </div>

                                    {/* Action */}
                                    <div style={{ flexShrink: 0 }}>
                                      {item.completed ? (
                                        <span
                                          style={{
                                            fontSize: 12,
                                            fontWeight: 700,
                                            color: "#22c55e",
                                            background: "rgba(34,197,94,0.08)",
                                            borderRadius: 9,
                                            padding: "6px 14px",
                                            border:
                                              "1px solid rgba(34,197,94,0.18)",
                                          }}
                                        >
                                          ✓ Done
                                        </span>
                                      ) : (
                                        <button
                                          className="btn-primary solve-btn"
                                          onClick={() =>
                                            openCompiler(item, section.id)
                                          }
                                          style={{
                                            background: `linear-gradient(135deg, ${planColor} 0%, ${planColor}bb 100%)`,
                                            color: "#fff",
                                            boxShadow: `0 4px 12px ${planColor}40`,
                                            padding: "7px 18px",
                                          }}
                                        >
                                          Solve →
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                );
                              })
                            )}

                            {/* Section progress bar */}
                            <div
                              style={{
                                height: 3,
                                background: "rgba(255,255,255,0.04)",
                              }}
                            >
                              <div
                                style={{
                                  height: "100%",
                                  background: planColor,
                                  width: `${sPct}%`,
                                  transition: "width 0.6s ease",
                                  boxShadow: `0 0 8px ${planColor}50`,
                                }}
                              />
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
