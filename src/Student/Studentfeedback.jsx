
// import { useState, useEffect } from "react";
// import {
//   getStudentContext,
//   submitFeedback,
//   checkFeedbackStatus,
// } from "../services/chatService";

// const MOODS = [
//   { icon: "😞", label: "Poor", value: "POOR" },
//   { icon: "😕", label: "Okay", value: "OKAY" },
//   { icon: "😐", label: "Fine", value: "FINE" },
//   { icon: "😊", label: "Good", value: "GOOD" },
//   { icon: "🤩", label: "Amazing", value: "AMAZING" },
// ];

// const TRAINER_DIMS = [
//   { key: "trainerClarityRating", label: "Clarity of explanation" },
//   { key: "trainerDoubtClearingRating", label: "Doubt clearing" },
//   { key: "trainerEnergyRating", label: "Energy & engagement" },
//   { key: "trainerTechnicalDepthRating", label: "Technical depth" },
// ];

// const CONTENT_TAGS = [
//   "Too fast",
//   "Too slow",
//   "Just right",
//   "Hard to follow",
//   "Very clear",
//   "Needs more examples",
//   "Great real-world demos",
//   "Outdated material",
// ];

// const IMPROVE_TAGS = [
//   "More practice time",
//   "Better code examples",
//   "Recorded sessions",
//   "Q&A time",
//   "Notes & resources",
//   "Smaller batches",
//   "Weekend doubt sessions",
// ];

// /* ── Toast Notification ───────────────────────────────────────── */
// function Toast({ message, type = "success", onClose }) {
//   useEffect(() => {
//     const timer = setTimeout(onClose, 3000);
//     return () => clearTimeout(timer);
//   }, [onClose]);

//   return (
//     <div
//       className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[100]
//                    rounded-xl px-6 py-4 text-sm font-medium shadow-2xl
//                    animate-in fade-in slide-in-from-bottom-4 duration-300"
//       style={{
//         background: type === "success" ? "#10b981" : "#ef4444",
//         color: "white",
//         animation: "slideInUp 0.3s ease-out",
//       }}
//     >
//       {type === "success" ? "✅" : "⚠️"} {message}
//     </div>
//   );
// }

// /* ── Page Transition Wrapper ───────────────────────────────────── */
// function PageTransition({ isActive, children }) {
//   return (
//     <div
//       style={{
//         animation: isActive
//           ? "popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)"
//           : "popOut 0.3s ease-in",
//         transformOrigin: "center",
//       }}
//     >
//       <style>{`
//         @keyframes popIn {
//           from {
//             opacity: 0;
//             transform: scale(0.85) translateY(20px);
//           }
//           to {
//             opacity: 1;
//             transform: scale(1) translateY(0);
//           }
//         }
        
//         @keyframes popOut {
//           from {
//             opacity: 1;
//             transform: scale(1) translateY(0);
//           }
//           to {
//             opacity: 0;
//             transform: scale(0.85) translateY(20px);
//           }
//         }

//         @keyframes slideInUp {
//           from {
//             opacity: 0;
//             transform: translate(-50%, 20px);
//           }
//           to {
//             opacity: 1;
//             transform: translate(-50%, 0);
//           }
//         }

//         @keyframes pulse {
//           0%, 100% {
//             opacity: 1;
//           }
//           50% {
//             opacity: 0.5;
//           }
//         }
//       `}</style>
//       {children}
//     </div>
//   );
// }

// /* ── Star rating row ───────────────────────────────────────────── */
// function StarRow({ label, value, onChange }) {
//   const [hover, setHover] = useState(0);
//   return (
//     <div className="flex items-center justify-between mb-3">
//       <span className="text-sm text-slate-300 min-w-[170px]">{label}</span>
//       <div className="flex gap-1">
//         {[1, 2, 3, 4, 5].map((i) => (
//           <span
//             key={i}
//             onClick={() => onChange(i)}
//             onMouseEnter={() => setHover(i)}
//             onMouseLeave={() => setHover(0)}
//             className="cursor-pointer transition-all duration-200"
//             style={{
//               transform:
//                 (hover || value) >= i
//                   ? "scale(1.2) rotate(10deg)"
//                   : "scale(1) rotate(0deg)",
//             }}
//           >
//             <svg
//               width="22"
//               height="22"
//               viewBox="0 0 24 24"
//               fill={(hover || value) >= i ? "#f59e0b" : "none"}
//               stroke={(hover || value) >= i ? "#f59e0b" : "#2a3a55"}
//               strokeWidth="1.5"
//             >
//               <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
//             </svg>
//           </span>
//         ))}
//       </div>
//     </div>
//   );
// }

// /* ── Chip ──────────────────────────────────────────────────────── */
// function Chip({ label, selected, onToggle }) {
//   return (
//     <button
//       onClick={onToggle}
//       className="rounded-full px-3 py-1.5 text-xs transition-all cursor-pointer duration-200"
//       style={{
//         border: `1.5px solid ${selected ? "#5b8dee" : "#2a3a55"}`,
//         background: selected ? "rgba(91,141,238,.15)" : "#1a2235",
//         color: selected ? "#5b8dee" : "#94a3b8",
//         fontWeight: selected ? 600 : 400,
//         transform: selected ? "scale(1.05)" : "scale(1)",
//         boxShadow: selected ? "0 4px 12px rgba(91,141,238,.2)" : "none",
//       }}
//     >
//       {label}
//     </button>
//   );
// }

// /* ── Card ──────────────────────────────────────────────────────── */
// function Card({ title, sub, children }) {
//   return (
//     <div
//       className="rounded-2xl p-6 mb-4 transition-all duration-300"
//       style={{
//         background: "#111827",
//         border: "1px solid #1f2d45",
//         backdropFilter: "blur(10px)",
//       }}
//     >
//       {title && (
//         <p className="text-sm font-semibold text-slate-200 mb-1">{title}</p>
//       )}
//       {sub && <p className="text-xs text-slate-400 mb-4">{sub}</p>}
//       {children}
//     </div>
//   );
// }

// /* ── Nav row ───────────────────────────────────────────────────── */
// function NavRow({ onBack, onNext, nextLabel = "Continue →" }) {
//   const [nextHover, setNextHover] = useState(false);

//   return (
//     <div className="flex gap-2.5 mt-6">
//       {onBack && (
//         <button
//           onClick={onBack}
//           className="px-5 py-2.5 rounded-xl text-sm text-slate-400 cursor-pointer transition-all duration-200 hover:text-slate-200"
//           style={{
//             border: "1px solid #2a3a55",
//             background: "transparent",
//             transform: nextHover ? "none" : "translateX(0)",
//           }}
//         >
//           ← Back
//         </button>
//       )}
//       {onNext && (
//         <button
//           onMouseEnter={() => setNextHover(true)}
//           onMouseLeave={() => setNextHover(false)}
//           onClick={onNext}
//           className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer transition-all duration-200"
//           style={{
//             border: "none",
//             background: nextHover
//               ? "linear-gradient(135deg,#7c3aed,#5b8dee)"
//               : "linear-gradient(135deg,#5b8dee,#7c3aed)",
//             transform: nextHover
//               ? "scale(1.02) translateY(-2px)"
//               : "scale(1) translateY(0)",
//             boxShadow: nextHover ? "0 8px 20px rgba(91,141,238,.3)" : "none",
//           }}
//         >
//           {nextLabel}
//         </button>
//       )}
//     </div>
//   );
// }

// /* ── Modal ─────────────────────────────────────────────────────── */
// function Modal({ onClose, children }) {
//   return (
//     <div
//       onClick={onClose}
//       className="fixed inset-0 z-50 flex items-center justify-center animate-in fade-in duration-200"
//       style={{
//         background: "rgba(0,0,0,.65)",
//         backdropFilter: "blur(6px)",
//       }}
//     >
//       <div
//         onClick={(e) => e.stopPropagation()}
//         className="w-[90%] max-w-md rounded-2xl p-8 animate-in zoom-in duration-300"
//         style={{
//           background: "#111827",
//           border: "1px solid #2a3a55",
//           animation: "popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
//         }}
//       >
//         {children}
//       </div>
//     </div>
//   );
// }

// /* ──  Page Transition Message ─────���────────────────────────────── */
// function PageTransitionMessage({ page, onClose }) {
//   const messages = {
//     1: "📝 Let's start with your overall experience",
//     2: "⭐ Now, let's rate your trainer",
//     3: "📚 How was the content?",
//     4: "💡 Help us improve with your suggestions",
//   };

//   return (
//     <Modal onClose={onClose}>
//       <div className="text-center">
//         <div
//           className="text-5xl mb-4 animate-bounce"
//           style={{ animation: "bounce 0.6s ease-in-out" }}
//         >
//           {page === 1 && "📝"}
//           {page === 2 && "⭐"}
//           {page === 3 && "📚"}
//           {page === 4 && "💡"}
//         </div>
//         <p className="text-lg font-bold text-slate-200 mb-2">
//           {messages[page]}
//         </p>
//         <p className="text-xs text-slate-400 mb-5">
//           {page === 1 && "Your honest feedback helps us improve"}
//           {page === 2 &&
//             "Rate each dimension to help us understand your experience"}
//           {page === 3 && "Tell us about the content quality and pace"}
//           {page === 4 && "Share what would help you learn better"}
//         </p>
//         <button
//           onClick={onClose}
//           className="w-full py-3 rounded-xl text-sm font-semibold text-white cursor-pointer transition-all"
//           style={{
//             border: "none",
//             background: "linear-gradient(135deg,#5b8dee,#7c3aed)",
//           }}
//         >
//           Got it! Let's go →
//         </button>
//       </div>
//     </Modal>
//   );
// }

// /* ════════════════════════════════════════════════════════════════
//    MAIN COMPONENT
// ════════════════════════════════════════════════════════════════ */
// export default function StudentFeedback() {
//   /* ── context (mirrors Doubts.jsx) ── */
//   const [batchId, setBatchId] = useState(null);
//   const [trainerEmail, setTrainerEmail] = useState(null);
//   const [ctxLoading, setCtxLoading] = useState(true);
//   const [ctxError, setCtxError] = useState("");

//   // ✅ NEW: Track if student already submitted
//   const [alreadySubmitted, setAlreadySubmitted] = useState(false);

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const ctx = await getStudentContext();
//         setBatchId(ctx.data.batchId);
//         setTrainerEmail(ctx.data.trainerEmail);

//         // ✅ Check if student already submitted feedback
//         try {
//           const statusResponse = await checkFeedbackStatus(ctx.data.batchId);
//           setAlreadySubmitted(statusResponse.data.alreadySubmitted);
//         } catch (statusError) {
//           console.error("Error checking feedback status:", statusError);
//           // Don't block the component if check fails
//           setAlreadySubmitted(false);
//         }
//       } catch {
//         setCtxError("No classroom assigned. Please contact admin.");
//       } finally {
//         setCtxLoading(false);
//       }
//     };
//     load();
//   }, []);

//   /* ── form state ── */
//   const [page, setPage] = useState(1);
//   const [mood, setMood] = useState("");
//   const [stars, setStars] = useState({});
//   const [contentTags, setCTags] = useState([]);
//   const [difficulty, setDiff] = useState(3);
//   const [improveTags, setITags] = useState([]);
//   const [comment, setComment] = useState("");
//   const [anonymous, setAnonymous] = useState(true);

//   const [showConfirm, setShowConfirm] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [showPageMessage, setShowPageMessage] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [toast, setToast] = useState(null);

//   const progress = [20, 40, 60, 80, 100][page - 1];

//   const toggleArr = (arr, setArr, val) =>
//     setArr(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);

//   function buildPreviewChips() {
//     const chips = [];
//     if (mood)
//       chips.push({
//         text: `Overall: ${mood}`,
//         green: ["GOOD", "AMAZING"].includes(mood),
//       });
//     Object.entries(stars).forEach(([k, v]) => {
//       if (v) chips.push({ text: `${k}: ${v}/5`, green: v >= 4 });
//     });
//     [...contentTags, ...improveTags].forEach((t) => chips.push({ text: t }));
//     if (anonymous) chips.push({ text: "🔒 Anonymous" });
//     return chips.slice(0, 8);
//   }

//   function handlePageChange(newPage) {
//     setPage(newPage);
//     setShowPageMessage(true);
//   }

//   /* ── submit ── */
//   async function handleSubmit() {
//     setLoading(true);
//     setError("");
//     try {
//       await submitFeedback({
//         batchId,
//         trainerEmail,
//         moodRating: mood,
//         anonymous,
//         trainerClarityRating: stars["Clarity of explanation"] || 0,
//         trainerDoubtClearingRating: stars["Doubt clearing"] || 0,
//         trainerEnergyRating: stars["Energy & engagement"] || 0,
//         trainerTechnicalDepthRating: stars["Technical depth"] || 0,
//         contentTags,
//         improvementTags: improveTags,
//         comment,
//       });
//       setShowConfirm(false);
//       setShowSuccess(true);
//       setAlreadySubmitted(true); // ✅ Mark as submitted
//       setToast({
//         message: "Feedback submitted successfully!",
//         type: "success",
//       });
//     } catch (e) {
//       // ✅ Handle 409 Conflict (already submitted)
//       if (e?.response?.status === 409) {
//         const errorMsg =
//           e?.response?.data?.message ||
//           "You already submitted feedback for this batch";
//         setError(errorMsg);
//         setToast({
//           message: "❌ " + errorMsg,
//           type: "error",
//         });
//         setAlreadySubmitted(true);
//       } else {
//         const errorMsg =
//           e?.response?.data?.message || "Submission failed. Please try again.";
//         setError(errorMsg);
//         setToast({
//           message: errorMsg,
//           type: "error",
//         });
//       }
//     } finally {
//       setLoading(false);
//     }
//   }

//   const stepLabels = ["Overall", "Trainer", "Content", "Suggest", "Done"];

//   /* ── loading / error guards ── */
//   if (ctxLoading)
//     return (
//       <div
//         className="min-h-screen flex items-center justify-center w-screen"
//         style={{
//           background: "#0b0f1a",
//           color: "#94a3b8",
//           fontFamily: "'Sora',sans-serif",
//         }}
//       >
//         <div className="text-center">
//           <div
//             style={{ animation: "pulse 2s infinite" }}
//             className="text-4xl mb-4"
//           >
//             ⏳
//           </div>
//           <p>Loading your classroom…</p>
//         </div>
//       </div>
//     );

//   if (ctxError)
//     return (
//       <div
//         className="min-h-screen flex items-center justify-center w-screen"
//         style={{ background: "#0b0f1a", fontFamily: "'Sora',sans-serif" }}
//       >
//         <div
//           className="text-center p-8 rounded-2xl"
//           style={{ background: "#111827", border: "1px solid #1f2d45" }}
//         >
//           <p className="text-red-400 text-sm">{ctxError}</p>
//         </div>
//       </div>
//     );

//   // ✅ NEW: Show if already submitted
//   if (alreadySubmitted) {
//     return (
//       <div
//         className="min-h-screen flex items-center justify-center w-screen"
//         style={{
//           background: "#0b0f1a",
//           fontFamily: "'Sora',sans-serif",
//         }}
//       >
//         <div
//           className="text-center p-12 rounded-2xl max-w-md"
//           style={{ background: "#111827", border: "1px solid #1f2d45" }}
//         >
//           <div className="text-5xl mb-4">✅</div>
//           <p className="text-xl font-bold text-slate-200 mb-3">
//             Feedback Already Submitted
//           </p>
//           <p className="text-sm text-slate-400 mb-6">
//             You have already submitted your feedback for Batch #{batchId}.
//           </p>
//           <p className="text-xs text-slate-500 mb-6 leading-relaxed">
//             📌 <strong>Note:</strong> You can only submit feedback once per
//             batch to ensure fair and honest feedback.
//           </p>
//           <div
//             className="px-4 py-3 rounded-xl mb-6"
//             style={{ background: "#1a2235", border: "1px solid #2a3a55" }}
//           >
//             <p className="text-xs text-slate-300">
//               <strong>Trainer:</strong> {trainerEmail?.split("@")[0]}
//             </p>
//           </div>
//           <button
//             onClick={() => window.history.back()}
//             className="w-full py-3 rounded-xl text-sm font-semibold text-white cursor-pointer transition-all"
//             style={{
//               border: "none",
//               background: "linear-gradient(135deg,#5b8dee,#7c3aed)",
//             }}
//           >
//             Go Back to Dashboard
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div
//       style={{
//         background: "#0b0f1a",
//         minHeight: "100vh",
//         width: "100vw",
//         fontFamily: "'Sora',sans-serif",
//         position: "fixed",
//         top: 0,
//         left: 0,
//         overflow: "auto",
//       }}
//     >
//       {/* Full coverage background mesh */}
//       <div
//         style={{
//           position: "fixed",
//           top: 0,
//           left: 0,
//           width: "100vw",
//           height: "100vh",
//           pointerEvents: "none",
//           zIndex: 0,
//           background: `
//           radial-gradient(ellipse 100% 80% at 50% 0%,rgba(91,141,238,.12) 0%,transparent 50%),
//           radial-gradient(ellipse 80% 100% at 0% 50%,rgba(124,58,237,.10) 0%,transparent 50%),
//           radial-gradient(ellipse 80% 100% at 100% 50%,rgba(91,141,238,.08) 0%,transparent 50%),
//           radial-gradient(ellipse 100% 80% at 50% 100%,rgba(124,58,237,.09) 0%,transparent 50%)`,
//         }}
//       />

//       {/* Scrollable content */}
//       <div
//         style={{
//           position: "relative",
//           zIndex: 1,
//           width: "100%",
//           minHeight: "100vh",
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           padding: "2rem 1.5rem",
//         }}
//       >
//         {/* Topbar */}
//         <div className="flex items-center justify-center mb-8 w-full">
//           <div className="flex items-center gap-2.5">
//             <div
//               className="w-9 h-9 rounded-xl flex items-center justify-center
//                             text-sm font-bold text-white"
//               style={{ background: "linear-gradient(135deg,#5b8dee,#7c3aed)" }}
//             >
//               L
//             </div>
//             <span className="text-sm font-semibold text-slate-200">
//               LMS Portal
//               <span className="text-slate-400 font-normal ml-1.5 text-xs">
//                 / Feedback
//               </span>
//             </span>
//           </div>
//         </div>

//         {/* Main content container - centered */}
//         <div
//           style={{
//             maxWidth: "750px",
//             width: "100%",
//             margin: "0 auto",
//           }}
//         >
//           {/* Batch banner — data from context */}
//           <div
//             className="flex items-center justify-between rounded-2xl px-4 py-3 mb-8"
//             style={{ background: "#111827", border: "1px solid #1f2d45" }}
//           >
//             <div>
//               <p className="text-[10px] uppercase tracking-widest text-slate-500">
//                 Trainer
//               </p>
//               <p className="text-sm font-semibold text-slate-200 mt-0.5">
//                 {trainerEmail?.split("@")[0] || "—"}
//               </p>
//             </div>
//             <div
//               className="px-3 py-1 rounded-full text-xs font-medium"
//               style={{
//                 background: "rgba(91,141,238,.15)",
//                 border: "1px solid rgba(91,141,238,.3)",
//                 color: "#5b8dee",
//               }}
//             >
//               Batch #{batchId}
//             </div>
//           </div>

//           {/* Progress bar */}
//           <div
//             className="h-0.5 rounded mb-10 overflow-hidden"
//             style={{ background: "#1f2d45" }}
//           >
//             <div
//               className="h-full rounded transition-all duration-500"
//               style={{
//                 width: `${progress}%`,
//                 background: "linear-gradient(90deg,#5b8dee,#7c3aed)",
//               }}
//             />
//           </div>

//           {/* Step dots */}
//           <div className="flex items-center mb-10 w-full">
//             {stepLabels.map((lbl, idx) => {
//               const n = idx + 1;
//               const isActive = n === page;
//               const isDone = n < page;
//               return (
//                 <div key={n} className="flex items-center flex-1">
//                   <div className="flex flex-col items-center gap-1.5">
//                     <div
//                       className="w-8 h-8 rounded-full flex items-center justify-center
//                                   text-xs font-semibold transition-all duration-300"
//                       style={{
//                         border: `2px solid ${isDone ? "#10b981" : isActive ? "#5b8dee" : "#2a3a55"}`,
//                         background: isDone
//                           ? "#10b981"
//                           : isActive
//                             ? "rgba(91,141,238,.12)"
//                             : "#111827",
//                         color: isDone
//                           ? "#fff"
//                           : isActive
//                             ? "#5b8dee"
//                             : "#64748b",
//                         boxShadow: isActive
//                           ? "0 0 0 4px rgba(91,141,238,.12)"
//                           : "none",
//                         transform: isActive ? "scale(1.1)" : "scale(1)",
//                       }}
//                     >
//                       {isDone ? "✓" : n}
//                     </div>
//                     <span
//                       className="text-[10px] whitespace-nowrap transition-colors"
//                       style={{ color: isActive ? "#5b8dee" : "#64748b" }}
//                     >
//                       {lbl}
//                     </span>
//                   </div>
//                   {idx < stepLabels.length - 1 && (
//                     <div
//                       className="flex-1 h-0.5 -mt-4 transition-colors duration-300"
//                       style={{ background: n < page ? "#10b981" : "#1f2d45" }}
//                     />
//                   )}
//                 </div>
//               );
//             })}
//           </div>

//           {/* ── PAGE 1 — Overall mood ── */}
//           <PageTransition isActive={page === 1}>
//             {page === 1 && (
//               <>
//                 <Card
//                   title="How was this session overall?"
//                   sub="Pick the one that matches your feeling"
//                 >
//                   <div className="grid grid-cols-5 gap-2">
//                     {MOODS.map((m) => (
//                       <button
//                         key={m.value}
//                         onClick={() => {
//                           setMood(m.value);
//                           setToast({
//                             message: `You selected ${m.label}! 👍`,
//                             type: "success",
//                           });
//                         }}
//                         className="rounded-2xl py-3 flex flex-col items-center gap-1.5
//                                    cursor-pointer transition-all duration-200"
//                         style={{
//                           border: `1.5px solid ${mood === m.value ? "#5b8dee" : "#2a3a55"}`,
//                           background:
//                             mood === m.value
//                               ? "rgba(91,141,238,.15)"
//                               : "#1a2235",
//                           transform:
//                             mood === m.value
//                               ? "translateY(-4px) scale(1.05)"
//                               : "none",
//                           boxShadow:
//                             mood === m.value
//                               ? "0 8px 16px rgba(91,141,238,.2)"
//                               : "none",
//                         }}
//                       >
//                         <span className="text-2xl">{m.icon}</span>
//                         <span
//                           className="text-[10px] font-medium"
//                           style={{
//                             color: mood === m.value ? "#5b8dee" : "#94a3b8",
//                           }}
//                         >
//                           {m.label}
//                         </span>
//                       </button>
//                     ))}
//                   </div>
//                 </Card>
//                 <NavRow onNext={() => handlePageChange(2)} />
//               </>
//             )}
//           </PageTransition>

//           {/* ── PAGE 2 — Trainer ratings ── */}
//           <PageTransition isActive={page === 2}>
//             {page === 2 && (
//               <>
//                 <Card
//                   title="Rate your trainer"
//                   sub="Tap a star for each dimension"
//                 >
//                   {TRAINER_DIMS.map(({ key, label }) => (
//                     <StarRow
//                       key={key}
//                       label={label}
//                       value={stars[label] || 0}
//                       onChange={(v) => {
//                         setStars((p) => ({ ...p, [label]: v }));
//                         setToast({
//                           message: `${label}: ${v}/5 ⭐`,
//                           type: "success",
//                         });
//                       }}
//                     />
//                   ))}
//                 </Card>
//                 <NavRow
//                   onBack={() => handlePageChange(1)}
//                   onNext={() => handlePageChange(3)}
//                 />
//               </>
//             )}
//           </PageTransition>

//           {/* ── PAGE 3 — Content tags ── */}
//           <PageTransition isActive={page === 3}>
//             {page === 3 && (
//               <>
//                 <Card
//                   title="How was the content?"
//                   sub="Select all that describe it"
//                 >
//                   <div className="flex flex-wrap gap-2">
//                     {CONTENT_TAGS.map((t) => (
//                       <Chip
//                         key={t}
//                         label={t}
//                         selected={contentTags.includes(t)}
//                         onToggle={() => {
//                           toggleArr(contentTags, setCTags, t);
//                           setToast({
//                             message: contentTags.includes(t)
//                               ? `Removed "${t}"`
//                               : `Added "${t}"`,
//                             type: "success",
//                           });
//                         }}
//                       />
//                     ))}
//                   </div>
//                 </Card>
//                 <Card
//                   title="Session difficulty"
//                   sub="How challenging was the material?"
//                 >
//                   <div className="flex items-center gap-3">
//                     <span className="text-xs text-slate-400">Easy</span>
//                     <input
//                       type="range"
//                       min="1"
//                       max="5"
//                       value={difficulty}
//                       onChange={(e) => setDiff(Number(e.target.value))}
//                       className="flex-1"
//                       style={{ accentColor: "#5b8dee" }}
//                     />
//                     <span className="text-xs text-slate-400">Hard</span>
//                     <span className="font-mono text-sm text-blue-400 min-w-[16px] font-bold">
//                       {difficulty}
//                     </span>
//                   </div>
//                 </Card>
//                 <NavRow
//                   onBack={() => handlePageChange(2)}
//                   onNext={() => handlePageChange(4)}
//                 />
//               </>
//             )}
//           </PageTransition>

//           {/* ── PAGE 4 — Suggestions + comment ── */}
//           <PageTransition isActive={page === 4}>
//             {page === 4 && (
//               <>
//                 <Card
//                   title="What would help most?"
//                   sub="Pick your top suggestions"
//                 >
//                   <div className="flex flex-wrap gap-2">
//                     {IMPROVE_TAGS.map((t) => (
//                       <Chip
//                         key={t}
//                         label={t}
//                         selected={improveTags.includes(t)}
//                         onToggle={() => {
//                           toggleArr(improveTags, setITags, t);
//                           setToast({
//                             message: improveTags.includes(t)
//                               ? `Removed suggestion`
//                               : `Added suggestion`,
//                             type: "success",
//                           });
//                         }}
//                       />
//                     ))}
//                   </div>
//                 </Card>

//                 <Card>
//                   <p
//                     className="text-[10px] font-semibold uppercase tracking-widest
//                                 text-slate-500 mb-2.5"
//                   >
//                     Your comments (optional)
//                   </p>
//                   <textarea
//                     rows={4}
//                     value={comment}
//                     onChange={(e) => setComment(e.target.value)}
//                     placeholder="Anything specific for the trainer or admin team…"
//                     className="w-full rounded-xl px-3.5 py-3 text-sm text-slate-200
//                                placeholder-slate-500 resize-none outline-none"
//                     style={{
//                       background: "#1a2235",
//                       border: "1px solid #2a3a55",
//                       fontFamily: "inherit",
//                       lineHeight: 1.6,
//                     }}
//                   />

//                   {/* Anonymous toggle */}
//                   <div
//                     className="flex items-center gap-3 rounded-xl px-3.5 py-3 mt-3 cursor-pointer"
//                     onClick={() => setAnonymous(!anonymous)}
//                     style={{
//                       background: "#1a2235",
//                       border: "1px solid #1f2d45",
//                       transition: "all 0.2s",
//                     }}
//                   >
//                     <div
//                       className="w-10 h-6 rounded-full relative transition-all duration-200"
//                       style={{ background: anonymous ? "#5b8dee" : "#2a3a55" }}
//                     >
//                       <div
//                         className="w-[18px] h-[18px] rounded-full bg-white absolute top-[3px]
//                                   transition-all duration-200"
//                         style={{ left: anonymous ? "19px" : "3px" }}
//                       />
//                     </div>
//                     <div className="text-xs text-slate-400 leading-relaxed">
//                       <strong className="text-slate-200">
//                         Submit anonymously
//                       </strong>
//                       <br />
//                       Trainer sees your feedback but not your name
//                     </div>
//                   </div>
//                 </Card>

//                 {error && <p className="text-red-400 text-xs mb-3">{error}</p>}

//                 <NavRow
//                   onBack={() => handlePageChange(3)}
//                   onNext={() => setShowConfirm(true)}
//                   nextLabel="Submit feedback"
//                 />
//               </>
//             )}
//           </PageTransition>

//           {/* Extra spacing for bottom */}
//           <div style={{ height: "2rem" }} />
//         </div>
//       </div>

//       {/* ── Confirm modal ── */}
//       {showConfirm && (
//         <Modal onClose={() => setShowConfirm(false)}>
//           <div className="text-center">
//             <div
//               className="text-5xl mb-3"
//               style={{ animation: "bounce 0.6s ease-in-out" }}
//             >
//               📋
//             </div>
//             <p className="text-lg font-bold text-slate-200 mb-2">
//               Ready to submit?
//             </p>
//             <p className="text-xs text-slate-400 mb-5">
//               You can't edit it after submission.
//             </p>
//             <div className="flex flex-wrap gap-2 justify-center mb-4 max-h-40 overflow-y-auto">
//               {buildPreviewChips().map((c, i) => (
//                 <span
//                   key={i}
//                   className="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap"
//                   style={{
//                     background: c.green
//                       ? "rgba(16,185,129,.15)"
//                       : "rgba(91,141,238,.15)",
//                     color: c.green ? "#10b981" : "#5b8dee",
//                     border: `1px solid ${c.green ? "rgba(16,185,129,.3)" : "rgba(91,141,238,.3)"}`,
//                   }}
//                 >
//                   {c.text}
//                 </span>
//               ))}
//             </div>
//             <p className="text-xs text-slate-400 mb-5">
//               {anonymous
//                 ? "🔒 Submitting anonymously"
//                 : "👤 Submitting with your name"}
//             </p>
//             <button
//               onClick={handleSubmit}
//               disabled={loading}
//               className="w-full py-3 rounded-xl text-sm font-semibold text-white
//                          cursor-pointer transition-all duration-200"
//               style={{
//                 border: "none",
//                 background: "linear-gradient(135deg,#5b8dee,#7c3aed)",
//                 opacity: loading ? 0.6 : 1,
//                 transform: loading ? "scale(0.98)" : "scale(1)",
//               }}
//             >
//               {loading ? "Submitting…" : "Confirm & Submit"}
//             </button>
//             <button
//               onClick={() => setShowConfirm(false)}
//               className="w-full mt-2.5 py-2.5 rounded-xl text-sm text-slate-400 cursor-pointer transition-all"
//               style={{
//                 border: "1px solid #2a3a55",
//                 background: "transparent",
//               }}
//             >
//               Go back
//             </button>
//           </div>
//         </Modal>
//       )}

//       {/* ── Success modal ── */}
//       {showSuccess && (
//         <Modal onClose={() => setShowSuccess(false)}>
//           <div className="text-center">
//             <div
//               className="text-5xl mb-3"
//               style={{ animation: "bounce 0.6s ease-in-out" }}
//             >
//               ✅
//             </div>
//             <p className="text-lg font-bold text-slate-200 mb-2">
//               Feedback submitted!
//             </p>
//             <p className="text-xs text-slate-400 mb-5">
//               Your input helps improve every batch.
//             </p>
//             <div className="flex flex-wrap gap-2 justify-center mb-5 max-h-40 overflow-y-auto">
//               {buildPreviewChips().map((c, i) => (
//                 <span
//                   key={i}
//                   className="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap"
//                   style={{
//                     background: c.green
//                       ? "rgba(16,185,129,.15)"
//                       : "rgba(91,141,238,.15)",
//                     color: c.green ? "#10b981" : "#5b8dee",
//                     border: `1px solid ${c.green ? "rgba(16,185,129,.3)" : "rgba(91,141,238,.3)"}`,
//                   }}
//                 >
//                   {c.text}
//                 </span>
//               ))}
//             </div>
//             <button
//               onClick={() => setShowSuccess(false)}
//               className="w-full py-3 rounded-xl text-sm font-semibold text-white cursor-pointer transition-all"
//               style={{
//                 border: "none",
//                 background: "linear-gradient(135deg,#5b8dee,#7c3aed)",
//               }}
//             >
//               Back to dashboard
//             </button>
//           </div>
//         </Modal>
//       )}

//       {/* ── Page Transition Message Modal ── */}
//       {showPageMessage && (
//         <PageTransitionMessage
//           page={page}
//           onClose={() => setShowPageMessage(false)}
//         />
//       )}

//       {/* ── Toast Notification ── */}
//       {toast && (
//         <Toast
//           message={toast.message}
//           type={toast.type}
//           onClose={() => setToast(null)}
//         />
//       )}
//     </div>
//   );
// }

































import { useState, useEffect } from "react";
import {
  getStudentContext, submitFeedback, checkFeedbackStatus,
} from "../services/chatService";
import {
  Star, CheckCircle, ChevronRight, ChevronLeft, Send,
  GraduationCap, Smile, BarChart2, Lightbulb, ClipboardList, Activity,
} from "lucide-react";

/* ═══════════════════════════════════════════════
   THEME TOKEN MAP (mirrors DashboardPage)
═══════════════════════════════════════════════ */
const T = {
  dark: {
    pageBg: "#0a0a0a", cardBg: "#111111", cardBgHov: "#161616",
    border: "rgba(255,255,255,0.06)", borderHov: "rgba(255,255,255,0.14)",
    text: "#ffffff", textSub: "rgba(255,255,255,0.3)", textMuted: "rgba(255,255,255,0.2)",
    textLabel: "rgba(255,255,255,0.22)",
    pillBg: "rgba(255,255,255,0.04)", pillBorder: "rgba(255,255,255,0.07)", pillText: "rgba(255,255,255,0.25)",
    emptyBorder: "rgba(255,255,255,0.07)", emptyBg: "rgba(255,255,255,0.02)", emptyIcon: "rgba(255,255,255,0.12)",
    barBg: "rgba(255,255,255,0.05)",
    actBg: "rgba(255,255,255,0.04)", actBorder: "rgba(255,255,255,0.07)",
    recentItemBg: "rgba(255,255,255,0.03)", recentItemBorder: "rgba(255,255,255,0.05)",
    shadow: "0 4px 20px rgba(0,0,0,0.4)", shadowHov: "0 20px 60px rgba(0,0,0,0.6)",
    inputBg: "rgba(255,255,255,0.04)",
    overlayBg: "rgba(0,0,0,0.65)",
  },
  light: {
    pageBg: "#f1f5f9", cardBg: "#ffffff", cardBgHov: "#f8fafc",
    border: "#e2e8f0", borderHov: "#cbd5e1",
    text: "#0f172a", textSub: "#64748b", textMuted: "#94a3b8", textLabel: "#94a3b8",
    pillBg: "#f1f5f9", pillBorder: "#e2e8f0", pillText: "#94a3b8",
    emptyBorder: "#e2e8f0", emptyBg: "#f8fafc", emptyIcon: "#cbd5e1",
    barBg: "#f1f5f9",
    actBg: "#f8fafc", actBorder: "#e2e8f0",
    recentItemBg: "#f8fafc", recentItemBorder: "#e2e8f0",
    shadow: "0 1px 8px rgba(0,0,0,0.07)", shadowHov: "0 8px 32px rgba(0,0,0,0.10)",
    inputBg: "#f8fafc",
    overlayBg: "rgba(0,0,0,0.45)",
  },
};

const ACCENT = "#7c3aed";
const ACCENT2 = "#a855f7";
const GRAD = `linear-gradient(135deg,${ACCENT},${ACCENT2})`;

const MOODS = [
  { icon: "😞", label: "Poor", value: "POOR" },
  { icon: "😕", label: "Okay", value: "OKAY" },
  { icon: "😐", label: "Fine", value: "FINE" },
  { icon: "😊", label: "Good", value: "GOOD" },
  { icon: "🤩", label: "Amazing", value: "AMAZING" },
];

const TRAINER_DIMS = [
  { key: "trainerClarityRating", label: "Clarity of explanation" },
  { key: "trainerDoubtClearingRating", label: "Doubt clearing" },
  { key: "trainerEnergyRating", label: "Energy & engagement" },
  { key: "trainerTechnicalDepthRating", label: "Technical depth" },
];

const CONTENT_TAGS = ["Too fast","Too slow","Just right","Hard to follow","Very clear","Needs more examples","Great real-world demos","Outdated material"];
const IMPROVE_TAGS = ["More practice time","Better code examples","Recorded sessions","Q&A time","Notes & resources","Smaller batches","Weekend doubt sessions"];

const isDarkFn = () =>
  typeof document !== "undefined" &&
  (document.documentElement.classList.contains("dark") ||
   document.documentElement.getAttribute("data-theme") === "dark" ||
   window.matchMedia("(prefers-color-scheme: dark)").matches);

/* ── Toast ── */
function Toast({ message, type = "success", onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div style={{
      position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", zIndex: 200,
      borderRadius: 12, padding: "12px 20px", fontSize: 12, fontWeight: 600,
      background: type === "success" ? "#10b981" : "#ef4444", color: "#fff",
      boxShadow: "0 8px 32px rgba(0,0,0,0.25)", fontFamily: "'Poppins',sans-serif",
      animation: "sfSlideUp 0.3s ease-out", whiteSpace: "nowrap",
    }}>
      {type === "success" ? "✅" : "⚠️"} {message}
    </div>
  );
}

/* ── Star Row ── */
function StarRow({ label, value, onChange, t }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, padding: "10px 12px", borderRadius: 12, background: t.actBg, border: `1px solid ${t.actBorder}`, transition: "border-color 0.2s" }}>
      <span style={{ fontSize: 12, color: t.textSub, fontFamily: "'Poppins',sans-serif", fontWeight: 500 }}>{label}</span>
      <div style={{ display: "flex", gap: 4 }}>
        {[1, 2, 3, 4, 5].map(i => (
          <span key={i} onClick={() => onChange(i)} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(0)}
            style={{ cursor: "pointer", transition: "transform 0.15s", transform: (hover || value) >= i ? "scale(1.25) rotate(8deg)" : "scale(1)", display: "inline-flex" }}>
            <svg width="20" height="20" viewBox="0 0 24 24"
              fill={(hover || value) >= i ? "#f59e0b" : "none"}
              stroke={(hover || value) >= i ? "#f59e0b" : t.borderHov || "#2a3a55"}
              strokeWidth="1.5">
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
            </svg>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Chip ── */
function Chip({ label, selected, onToggle, t }) {
  return (
    <button onClick={onToggle} style={{
      borderRadius: 999, padding: "6px 14px", fontSize: 11, cursor: "pointer",
      border: `1.5px solid ${selected ? ACCENT : t.actBorder}`,
      background: selected ? `rgba(124,58,237,0.12)` : t.actBg,
      color: selected ? ACCENT : t.textMuted,
      fontWeight: selected ? 600 : 400,
      transform: selected ? "scale(1.04)" : "scale(1)",
      boxShadow: selected ? "0 4px 12px rgba(124,58,237,0.18)" : "none",
      transition: "all 0.18s", fontFamily: "'Poppins',sans-serif",
    }}>
      {label}
    </button>
  );
}

/* ── Card ── */
function Card({ title, sub, children, t }) {
  return (
    <div style={{
      borderRadius: 20, padding: "20px 22px", marginBottom: 14,
      background: t.cardBg, border: `1px solid ${t.border}`,
      boxShadow: t.shadow, transition: "all 0.2s",
    }}>
      {title && <p style={{ fontSize: 13, fontWeight: 700, color: t.text, margin: "0 0 4px", fontFamily: "'Poppins',sans-serif" }}>{title}</p>}
      {sub && <p style={{ fontSize: 11, color: t.textMuted, margin: "0 0 16px", fontFamily: "'Poppins',sans-serif" }}>{sub}</p>}
      {children}
    </div>
  );
}

/* ── NavRow ── */
function NavRow({ onBack, onNext, nextLabel = "Continue →", t }) {
  const [hov, setHov] = useState(false);
  return (
    <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
      {onBack && (
        <button onClick={onBack} style={{
          padding: "10px 20px", borderRadius: 12, fontSize: 12, fontWeight: 600,
          border: `1px solid ${t.actBorder}`, background: "transparent",
          color: t.textMuted, cursor: "pointer", fontFamily: "'Poppins',sans-serif",
          transition: "all 0.2s", display: "flex", alignItems: "center", gap: 6,
        }}>
          <ChevronLeft size={14} /> Back
        </button>
      )}
      {onNext && (
        <button
          onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
          onClick={onNext}
          style={{
            flex: 1, padding: "10px", borderRadius: 12, fontSize: 12, fontWeight: 700,
            border: "none", background: GRAD, color: "#fff", cursor: "pointer",
            fontFamily: "'Poppins',sans-serif",
            transform: hov ? "scale(1.02) translateY(-1px)" : "scale(1)",
            boxShadow: hov ? "0 8px 20px rgba(124,58,237,0.3)" : "none",
            transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}
        >
          {nextLabel} <ChevronRight size={14} />
        </button>
      )}
    </div>
  );
}

/* ── Modal ── */
function Modal({ onClose, children, t }) {
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: t.overlayBg, backdropFilter: "blur(6px)",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: "90%", maxWidth: 420, borderRadius: 20, padding: "28px 28px",
        background: t.cardBg, border: `1px solid ${t.border}`,
        boxShadow: t.shadowHov, animation: "sfPopIn 0.35s cubic-bezier(0.34,1.56,0.64,1)",
      }}>
        {children}
      </div>
    </div>
  );
}

/* ── Step Icon ── */
const STEP_ICONS = [Smile, Star, ClipboardList, Lightbulb, CheckCircle];

/* ════════════════════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════════════════════ */
export default function StudentFeedback() {
  const [dark, setDark] = useState(isDarkFn);
  const t = dark ? T.dark : T.light;

  useEffect(() => {
    const obs = new MutationObserver(() => setDark(isDarkFn()));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
    return () => obs.disconnect();
  }, []);

  /* context */
  const [batchId, setBatchId] = useState(null);
  const [trainerEmail, setTrainerEmail] = useState(null);
  const [ctxLoading, setCtxLoading] = useState(true);
  const [ctxError, setCtxError] = useState("");
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const ctx = await getStudentContext();
        setBatchId(ctx.data.batchId);
        setTrainerEmail(ctx.data.trainerEmail);
        try {
          const s = await checkFeedbackStatus(ctx.data.batchId);
          setAlreadySubmitted(s.data.alreadySubmitted);
        } catch { setAlreadySubmitted(false); }
      } catch { setCtxError("No classroom assigned. Please contact admin."); }
      finally { setCtxLoading(false); }
    };
    load();
  }, []);

  /* form state */
  const [page, setPage] = useState(1);
  const [mood, setMood] = useState("");
  const [stars, setStars] = useState({});
  const [contentTags, setCTags] = useState([]);
  const [difficulty, setDiff] = useState(3);
  const [improveTags, setITags] = useState([]);
  const [comment, setComment] = useState("");
  const [anonymous, setAnonymous] = useState(true);

  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const progress = [20, 40, 60, 80, 100][page - 1];
  const toggleArr = (arr, setArr, val) => setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);

  function buildPreviewChips() {
    const chips = [];
    if (mood) chips.push({ text: `Overall: ${mood}`, green: ["GOOD", "AMAZING"].includes(mood) });
    Object.entries(stars).forEach(([k, v]) => { if (v) chips.push({ text: `${k}: ${v}/5`, green: v >= 4 }); });
    [...contentTags, ...improveTags].forEach(t2 => chips.push({ text: t2 }));
    if (anonymous) chips.push({ text: "🔒 Anonymous" });
    return chips.slice(0, 8);
  }

  async function handleSubmit() {
    setLoading(true); setError("");
    try {
      await submitFeedback({
        batchId, trainerEmail, moodRating: mood, anonymous,
        trainerClarityRating: stars["Clarity of explanation"] || 0,
        trainerDoubtClearingRating: stars["Doubt clearing"] || 0,
        trainerEnergyRating: stars["Energy & engagement"] || 0,
        trainerTechnicalDepthRating: stars["Technical depth"] || 0,
        contentTags, improvementTags: improveTags, comment,
      });
      setShowConfirm(false); setShowSuccess(true); setAlreadySubmitted(true);
      setToast({ message: "Feedback submitted successfully!", type: "success" });
    } catch (e) {
      if (e?.response?.status === 409) {
        const msg = e?.response?.data?.message || "You already submitted feedback for this batch";
        setError(msg); setToast({ message: msg, type: "error" }); setAlreadySubmitted(true);
      } else {
        const msg = e?.response?.data?.message || "Submission failed. Please try again.";
        setError(msg); setToast({ message: msg, type: "error" });
      }
    } finally { setLoading(false); }
  }

  const stepLabels = ["Overall", "Trainer", "Content", "Suggest", "Done"];

  /* ── Guards ── */
  if (ctxLoading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: dark ? "#0a0a0a" : "#f1f5f9", fontFamily: "'Poppins',sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 16, animation: "sfPulse 2s infinite" }}>⏳</div>
        <p style={{ color: dark ? "rgba(255,255,255,0.4)" : "#94a3b8", fontSize: 13 }}>Loading your classroom…</p>
      </div>
    </div>
  );

  if (ctxError) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: dark ? "#0a0a0a" : "#f1f5f9", fontFamily: "'Poppins',sans-serif" }}>
      <div style={{ padding: "32px 40px", borderRadius: 20, background: t.cardBg, border: `1px solid ${t.border}`, boxShadow: t.shadow, textAlign: "center" }}>
        <p style={{ color: "#f87171", fontSize: 13, margin: 0 }}>{ctxError}</p>
      </div>
    </div>
  );

  if (alreadySubmitted) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: t.pageBg, fontFamily: "'Poppins',sans-serif" }}>
      <div style={{ padding: "48px 40px", borderRadius: 24, background: t.cardBg, border: `1px solid ${t.border}`, boxShadow: t.shadow, textAlign: "center", maxWidth: 400, width: "90%" }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.25)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <CheckCircle size={26} color="#34d399" />
        </div>
        <p style={{ fontSize: 17, fontWeight: 800, color: t.text, margin: "0 0 8px" }}>Feedback Already Submitted</p>
        <p style={{ fontSize: 12, color: t.textMuted, margin: "0 0 20px", lineHeight: 1.6 }}>You have already submitted feedback for Batch #{batchId}. Each batch allows only one submission to ensure fair results.</p>
        <div style={{ padding: "10px 14px", borderRadius: 12, background: t.actBg, border: `1px solid ${t.actBorder}`, marginBottom: 20 }}>
          <p style={{ fontSize: 11, color: t.textSub, margin: 0 }}>
            <GraduationCap size={12} style={{ marginRight: 4, verticalAlign: "middle" }} />
            <strong>Trainer:</strong> {trainerEmail?.split("@")[0]}
          </p>
        </div>
        <button onClick={() => window.history.back()} style={{ width: "100%", padding: "11px", borderRadius: 12, border: "none", background: GRAD, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Poppins',sans-serif" }}>
          ← Go Back to Dashboard
        </button>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        @keyframes sfFadeUp { from { opacity:0; transform:translateY(14px) } to { opacity:1; transform:translateY(0) } }
        @keyframes sfPopIn { from { opacity:0; transform:scale(0.88) translateY(16px) } to { opacity:1; transform:scale(1) translateY(0) } }
        @keyframes sfSlideUp { from { opacity:0; transform:translate(-50%,16px) } to { opacity:1; transform:translate(-50%,0) } }
        @keyframes sfPulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes sfPulseRing { 0%{box-shadow:0 0 0 0 rgba(124,58,237,0.5)} 70%{box-shadow:0 0 0 8px rgba(124,58,237,0)} 100%{box-shadow:0 0 0 0 rgba(124,58,237,0)} }
        .sf-fade { animation: sfFadeUp 0.4s ease both; }
        .sf-live { animation: sfPulseRing 2.2s ease-out infinite; }
        .sf-page { animation: sfFadeUp 0.35s ease both; }
        .sf-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.12) !important; }
        .sf-mood:hover { transform: translateY(-4px) scale(1.06) !important; }
        input[type=range] { accent-color: ${ACCENT}; }
      `}</style>

      <div style={{ background: t.pageBg, minHeight: "100vh", fontFamily: "'Poppins',sans-serif", transition: "background 0.3s, color 0.3s", color: t.text }}>
      <div
  style={{
    width: "100%",
    maxWidth: "100%",
    padding: "24px 32px 60px",
  }}
>

          {/* ═══ HERO BANNER ═══ */}
          <div className="sf-fade" style={{
            borderRadius: 20, padding: "22px 26px", marginBottom: 20,
            background: t.cardBg, border: `1px solid ${t.border}`, boxShadow: t.shadow,
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: `rgba(124,58,237,0.12)`, border: `1px solid rgba(124,58,237,0.22)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <ClipboardList size={16} color={ACCENT} />
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: t.textSub }}>Feedback Portal</span>
                </div>
                <h1 style={{ fontSize: "clamp(1.2rem,2.5vw,1.6rem)", fontWeight: 900, color: t.text, margin: "0 0 4px", letterSpacing: "-0.02em" }}>Session Feedback</h1>
                <p style={{ fontSize: 11, color: t.textSub, margin: 0, fontWeight: 500 }}>Share your honest experience with us</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {/* Batch badge */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, background: t.actBg, border: `1px solid ${t.actBorder}`, borderRadius: 12, padding: "8px 14px" }}>
                  <GraduationCap size={13} color={ACCENT} />
                  <div>
                    <p style={{ fontSize: 9, color: t.textLabel, margin: 0, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>Trainer</p>
                    <p style={{ fontSize: 12, color: t.text, margin: 0, fontWeight: 700 }}>{trainerEmail?.split("@")[0] || "—"}</p>
                  </div>
                  <div style={{ width: 1, height: 24, background: t.actBorder }} />
                  <div>
                    <p style={{ fontSize: 9, color: t.textLabel, margin: 0, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>Batch</p>
                    <p style={{ fontSize: 12, color: t.text, margin: 0, fontWeight: 700 }}>#{batchId}</p>
                  </div>
                </div>
                {/* Live badge */}
                <div className="sf-live" style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.28)", borderRadius: 999, padding: "7px 14px", color: ACCENT, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: ACCENT, display: "inline-block" }} />
                  LIVE
                </div>
              </div>
            </div>
          </div>

          {/* ═══ PROGRESS BAR ═══ */}
          <div style={{ height: 3, borderRadius: 99, background: t.barBg, marginBottom: 10, overflow: "hidden" }}>
            <div style={{ height: "100%", borderRadius: 99, background: GRAD, width: `${progress}%`, transition: "width 0.5s ease" }} />
          </div>

          {/* ═══ STEP DOTS ═══ */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
            {stepLabels.map((lbl, idx) => {
              const n = idx + 1;
              const isActive = n === page;
              const isDone = n < page;
              const StepIcon = STEP_ICONS[idx];
              return (
                <div key={n} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: "50%",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      border: `2px solid ${isDone ? "#34d399" : isActive ? ACCENT : t.actBorder}`,
                      background: isDone ? "#34d399" : isActive ? `rgba(124,58,237,0.12)` : t.actBg,
                      color: isDone ? "#fff" : isActive ? ACCENT : t.textMuted,
                      boxShadow: isActive ? `0 0 0 4px rgba(124,58,237,0.12)` : "none",
                      transform: isActive ? "scale(1.1)" : "scale(1)",
                      transition: "all 0.25s",
                    }}>
                      {isDone ? <CheckCircle size={15} color="#fff" /> : <StepIcon size={14} />}
                    </div>
                    <span style={{ fontSize: 9, color: isActive ? ACCENT : t.textMuted, fontWeight: isActive ? 700 : 500, letterSpacing: "0.04em" }}>{lbl}</span>
                  </div>
                  {idx < stepLabels.length - 1 && (
                    <div style={{ flex: 1, height: 2, background: n < page ? "#34d399" : t.barBg, margin: "-14px 4px 0", transition: "background 0.3s", borderRadius: 99 }} />
                  )}
                </div>
              );
            })}
          </div>

          {/* ═══ PAGE 1 — Overall Mood ═══ */}
          {page === 1 && (
            <div className="sf-page">
              <Card title="How was this session overall?" sub="Pick the one that matches your feeling" t={t}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 10 }}>
                  {MOODS.map(m => (
                    <button
                      key={m.value}
                      className="sf-mood"
                      onClick={() => { setMood(m.value); setToast({ message: `You selected ${m.label}!`, type: "success" }); }}
                      style={{
                        borderRadius: 16, padding: "14px 8px",
                        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                        cursor: "pointer", border: `1.5px solid ${mood === m.value ? ACCENT : t.actBorder}`,
                        background: mood === m.value ? `rgba(124,58,237,0.12)` : t.actBg,
                        transform: mood === m.value ? "translateY(-4px) scale(1.05)" : "none",
                        boxShadow: mood === m.value ? "0 8px 20px rgba(124,58,237,0.2)" : "none",
                        transition: "all 0.2s", fontFamily: "'Poppins',sans-serif",
                      }}
                    >
                      <span style={{ fontSize: 26 }}>{m.icon}</span>
                      <span style={{ fontSize: 10, fontWeight: 600, color: mood === m.value ? ACCENT : t.textMuted }}>{m.label}</span>
                    </button>
                  ))}
                </div>
              </Card>
              <NavRow onNext={() => setPage(2)} t={t} />
            </div>
          )}

          {/* ═══ PAGE 2 — Trainer Ratings ═══ */}
          {page === 2 && (
            <div className="sf-page">
              <Card title="Rate your trainer" sub="Tap a star for each dimension" t={t}>
                {TRAINER_DIMS.map(({ key, label }) => (
                  <StarRow key={key} label={label} value={stars[label] || 0}
                    onChange={v => { setStars(p => ({ ...p, [label]: v })); setToast({ message: `${label}: ${v}/5 ⭐`, type: "success" }); }}
                    t={t} />
                ))}
              </Card>
              <NavRow onBack={() => setPage(1)} onNext={() => setPage(3)} t={t} />
            </div>
          )}

          {/* ═══ PAGE 3 — Content Tags ═══ */}
          {page === 3 && (
            <div className="sf-page">
              <Card title="How was the content?" sub="Select all that apply" t={t}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {CONTENT_TAGS.map(tag => (
                    <Chip key={tag} label={tag} selected={contentTags.includes(tag)}
                      onToggle={() => { toggleArr(contentTags, setCTags, tag); setToast({ message: contentTags.includes(tag) ? `Removed "${tag}"` : `Added "${tag}"`, type: "success" }); }}
                      t={t} />
                  ))}
                </div>
              </Card>
              <Card title="Session difficulty" sub="How challenging was the material?" t={t}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 11, color: t.textMuted, fontWeight: 500 }}>Easy</span>
                  <input type="range" min="1" max="5" value={difficulty} onChange={e => setDiff(Number(e.target.value))} style={{ flex: 1 }} />
                  <span style={{ fontSize: 11, color: t.textMuted, fontWeight: 500 }}>Hard</span>
                  <div style={{ minWidth: 32, height: 32, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", background: `rgba(124,58,237,0.12)`, border: `1px solid rgba(124,58,237,0.22)` }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: ACCENT }}>{difficulty}</span>
                  </div>
                </div>
              </Card>
              <NavRow onBack={() => setPage(2)} onNext={() => setPage(4)} t={t} />
            </div>
          )}

          {/* ═══ PAGE 4 — Suggestions ═══ */}
          {page === 4 && (
            <div className="sf-page">
              <Card title="What would help most?" sub="Pick your top suggestions" t={t}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {IMPROVE_TAGS.map(tag => (
                    <Chip key={tag} label={tag} selected={improveTags.includes(tag)}
                      onToggle={() => { toggleArr(improveTags, setITags, tag); setToast({ message: improveTags.includes(tag) ? "Removed suggestion" : "Added suggestion", type: "success" }); }}
                      t={t} />
                  ))}
                </div>
              </Card>
              <Card t={t}>
                <p style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: t.textLabel, margin: "0 0 10px" }}>Your comments (optional)</p>
                <textarea
                  rows={4} value={comment} onChange={e => setComment(e.target.value)}
                  placeholder="Anything specific for the trainer or admin team…"
                  style={{
                    width: "100%", borderRadius: 12, padding: "12px 14px",
                    background: t.actBg, border: `1px solid ${t.actBorder}`,
                    color: t.text, fontSize: 12, resize: "none", outline: "none",
                    fontFamily: "'Poppins',sans-serif", lineHeight: 1.6, boxSizing: "border-box",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={e => e.target.style.borderColor = ACCENT}
                  onBlur={e => e.target.style.borderColor = t.actBorder}
                />
                {/* Anonymous toggle */}
                <div
                  onClick={() => setAnonymous(!anonymous)}
                  style={{
                    display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
                    borderRadius: 12, marginTop: 10, cursor: "pointer",
                    background: t.actBg, border: `1px solid ${t.actBorder}`, transition: "all 0.2s",
                  }}
                >
                  <div style={{ width: 40, height: 22, borderRadius: 999, position: "relative", background: anonymous ? ACCENT : t.barBg, transition: "background 0.2s", flexShrink: 0 }}>
                    <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: anonymous ? 21 : 3, transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
                  </div>
                  <div style={{ fontSize: 11, color: t.textSub, lineHeight: 1.5 }}>
                    <strong style={{ color: t.text, display: "block", marginBottom: 1 }}>Submit anonymously</strong>
                    Trainer sees your feedback but not your name
                  </div>
                </div>
              </Card>
              {error && <p style={{ color: "#f87171", fontSize: 11, margin: "0 0 12px" }}>{error}</p>}
              <NavRow onBack={() => setPage(3)} onNext={() => setShowConfirm(true)} nextLabel="Submit Feedback" t={t} />
            </div>
          )}

        </div>
      </div>

      {/* ═══ CONFIRM MODAL ═══ */}
      {showConfirm && (
        <Modal onClose={() => setShowConfirm(false)} t={t}>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.22)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
              <Send size={22} color={ACCENT} />
            </div>
            <p style={{ fontSize: 16, fontWeight: 800, color: t.text, margin: "0 0 6px" }}>Ready to submit?</p>
            <p style={{ fontSize: 11, color: t.textMuted, margin: "0 0 18px" }}>You can't edit it after submission.</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", marginBottom: 16, maxHeight: 120, overflowY: "auto" }}>
              {buildPreviewChips().map((c, i) => (
                <span key={i} style={{
                  padding: "4px 12px", borderRadius: 999, fontSize: 10, fontWeight: 600,
                  background: c.green ? "rgba(52,211,153,0.12)" : "rgba(124,58,237,0.12)",
                  color: c.green ? "#34d399" : ACCENT,
                  border: `1px solid ${c.green ? "rgba(52,211,153,0.25)" : "rgba(124,58,237,0.25)"}`,
                  fontFamily: "'Poppins',sans-serif",
                }}>{c.text}</span>
              ))}
            </div>
            <p style={{ fontSize: 11, color: t.textMuted, marginBottom: 16 }}>
              {anonymous ? "🔒 Submitting anonymously" : "👤 Submitting with your name"}
            </p>
            <button onClick={handleSubmit} disabled={loading} style={{
              width: "100%", padding: "11px", borderRadius: 12, border: "none",
              background: GRAD, color: "#fff", fontSize: 12, fontWeight: 700,
              cursor: "pointer", fontFamily: "'Poppins',sans-serif",
              opacity: loading ? 0.65 : 1, transition: "opacity 0.2s",
            }}>
              {loading ? "Submitting…" : "Confirm & Submit"}
            </button>
            <button onClick={() => setShowConfirm(false)} style={{
              width: "100%", marginTop: 8, padding: "10px", borderRadius: 12,
              border: `1px solid ${t.actBorder}`, background: "transparent",
              color: t.textMuted, fontSize: 12, fontWeight: 600, cursor: "pointer",
              fontFamily: "'Poppins',sans-serif",
            }}>
              Go back
            </button>
          </div>
        </Modal>
      )}

      {/* ═══ SUCCESS MODAL ═══ */}
      {showSuccess && (
        <Modal onClose={() => setShowSuccess(false)} t={t}>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.25)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
              <CheckCircle size={24} color="#34d399" />
            </div>
            <p style={{ fontSize: 16, fontWeight: 800, color: t.text, margin: "0 0 6px" }}>Feedback submitted!</p>
            <p style={{ fontSize: 11, color: t.textMuted, margin: "0 0 18px" }}>Your input helps improve every batch. Thank you!</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", marginBottom: 18, maxHeight: 120, overflowY: "auto" }}>
              {buildPreviewChips().map((c, i) => (
                <span key={i} style={{
                  padding: "4px 12px", borderRadius: 999, fontSize: 10, fontWeight: 600,
                  background: c.green ? "rgba(52,211,153,0.12)" : "rgba(124,58,237,0.12)",
                  color: c.green ? "#34d399" : ACCENT,
                  border: `1px solid ${c.green ? "rgba(52,211,153,0.25)" : "rgba(124,58,237,0.25)"}`,
                  fontFamily: "'Poppins',sans-serif",
                }}>{c.text}</span>
              ))}
            </div>
            <button onClick={() => setShowSuccess(false)} style={{
              width: "100%", padding: "11px", borderRadius: 12, border: "none",
              background: GRAD, color: "#fff", fontSize: 12, fontWeight: 700,
              cursor: "pointer", fontFamily: "'Poppins',sans-serif",
            }}>
              Back to dashboard
            </button>
          </div>
        </Modal>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}