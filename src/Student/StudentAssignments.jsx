// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   ArrowRight, Calendar, FileText, CheckCircle,
//   Clock, AlertCircle, Lock, CheckCircle2,
// } from "lucide-react";

// import {
//   getMySubmissions,
//   getStudentAssignments,
// } from "@/services/assessmentService";

// import { progressService } from "@/services/progressService";

// /* ─── Styles (Component 3 design system) ───────────────────────────────── */
// const styles = `
//   @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

//   :root {
//     --sa-bg:        #f1f5f9;
//     --sa-card:      #ffffff;
//     --sa-text:      #0f172a;
//     --sa-muted:     #64748b;
//     --sa-border:    #e2e8f0;
//     --sa-accent1:   #22d3ee;
//     --sa-accent2:   #fb923c;
//     --sa-accent3:   #34d399;
//     --sa-accent4:   #a78bfa;
//     --sa-danger:    #f87171;
//     --sa-shadow:    0 4px 24px rgba(0,0,0,0.06);
//     --sa-shadow-lg: 0 8px 40px rgba(0,0,0,0.10);
//     --sa-radius:    20px;
//   }

//   .sa-dark {
//     --sa-bg:        #0a0a0a;
//     --sa-card:      #111111;
//     --sa-text:      #ffffff;
//     --sa-muted:     #94a3b8;
//     --sa-border:    rgba(255,255,255,0.06);
//     --sa-shadow:    0 4px 24px rgba(0,0,0,0.40);
//     --sa-shadow-lg: 0 8px 40px rgba(0,0,0,0.60);
//   }

//   .sa-root {
//     font-family: 'Poppins', sans-serif;
//     min-height: 100vh;
//     background: var(--sa-bg);
//     color: var(--sa-text);
//     padding: 24px;
//     box-sizing: border-box;
//     transition: background 0.3s, color 0.3s;
//   }

//   .sa-inner {
//     max-width: 1300px;
//     margin: 0 auto;
//   }

//   /* ── Header card ── */
//   .sa-header {
//     background: var(--sa-card);
//     border: 1px solid var(--sa-border);
//     border-radius: var(--sa-radius);
//     padding: 32px 36px;
//     margin-bottom: 28px;
//     box-shadow: var(--sa-shadow);
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//     gap: 24px;
//     flex-wrap: wrap;
//     position: relative;
//     overflow: hidden;
//   }

//   .sa-header::before {
//     content: '';
//     position: absolute;
//     inset: 0;
//     pointer-events: none;
//     opacity: 0.03;
//     background-image: linear-gradient(var(--sa-border) 1px, transparent 1px),
//                       linear-gradient(90deg, var(--sa-border) 1px, transparent 1px);
//     background-size: 40px 40px;
//   }

//   .sa-header-glow {
//     position: absolute;
//     top: -30%;
//     left: 40%;
//     width: 300px;
//     height: 200px;
//     background: radial-gradient(ellipse, rgba(167,139,250,0.06), transparent 70%);
//     pointer-events: none;
//   }

//   .sa-badge {
//     display: inline-flex;
//     align-items: center;
//     gap: 6px;
//     padding: 5px 12px;
//     border-radius: 50px;
//     border: 1px solid var(--sa-border);
//     background: rgba(167,139,250,0.08);
//     color: var(--sa-accent4);
//     font-size: 10px;
//     font-weight: 700;
//     letter-spacing: 0.08em;
//     text-transform: uppercase;
//     margin-bottom: 14px;
//   }

//   .sa-title {
//     font-size: 32px;
//     font-weight: 800;
//     color: var(--sa-text);
//     margin: 0 0 6px;
//     letter-spacing: -0.02em;
//   }

//   .sa-subtitle {
//     font-size: 13px;
//     color: var(--sa-muted);
//     margin: 0;
//     font-weight: 500;
//   }

//   .sa-header-icon {
//     width: 100px;
//     height: 100px;
//     border-radius: var(--sa-radius);
//     background: rgba(167,139,250,0.08);
//     border: 1px solid rgba(167,139,250,0.15);
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     font-size: 40px;
//     color: var(--sa-accent4);
//     flex-shrink: 0;
//     position: relative;
//     z-index: 1;
//   }

//   .sa-header-stats {
//     display: flex;
//     gap: 12px;
//     flex-wrap: wrap;
//     margin-top: 18px;
//   }

//   .sa-stat-pill {
//     display: flex;
//     align-items: center;
//     gap: 12px;
//     background: rgba(255,255,255,0.04);
//     border: 1px solid var(--sa-border);
//     border-radius: 12px;
//     padding: 8px 16px;
//     font-size: 11px;
//     font-weight: 600;
//     color: var(--sa-muted);
//   }

//   .sa-stat-pill-sep {
//     width: 1px;
//     height: 14px;
//     background: var(--sa-border);
//   }

//   .sa-hint-pill {
//     display: inline-flex;
//     align-items: center;
//     gap: 6px;
//     padding: 5px 14px;
//     border-radius: 50px;
//     background: rgba(251,146,60,0.08);
//     border: 1px solid rgba(251,146,60,0.2);
//     color: var(--sa-accent2);
//     font-size: 10px;
//     font-weight: 700;
//     letter-spacing: 0.06em;
//     margin-top: 12px;
//   }

//   .sa-progress-bar-wrap {
//     margin-top: 8px;
//     height: 4px;
//     background: var(--sa-border);
//     border-radius: 99px;
//     overflow: hidden;
//     width: 100px;
//   }

//   .sa-progress-bar-fill {
//     height: 100%;
//     background: var(--sa-accent3);
//     border-radius: 99px;
//     transition: width 0.7s ease;
//   }

//   @media (max-width: 768px) {
//     .sa-header-icon { display: none; }
//     .sa-title { font-size: 24px; }
//   }

//   /* ── Hint banner ── */
//   .sa-hint-banner {
//     padding: 10px 18px;
//     border-radius: 14px;
//     background: rgba(251,146,60,0.06);
//     border: 1px solid rgba(251,146,60,0.18);
//     color: var(--sa-accent2);
//     font-size: 12px;
//     font-weight: 600;
//     margin-bottom: 20px;
//     display: flex;
//     align-items: center;
//     gap: 8px;
//   }

//   /* ── Grid ── */
//   .sa-grid {
//     display: grid;
//     grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
//     gap: 20px;
//   }

//   /* ── Card ── */
//   .sa-card {
//     background: var(--sa-card);
//     border: 1px solid var(--sa-border);
//     border-radius: var(--sa-radius);
//     padding: 24px;
//     box-shadow: var(--sa-shadow);
//     display: flex;
//     flex-direction: column;
//     gap: 0;
//     transition: transform 0.22s, box-shadow 0.22s, border-color 0.22s;
//     position: relative;
//     overflow: hidden;
//   }

//   .sa-card:hover {
//     transform: translateY(-4px);
//     box-shadow: var(--sa-shadow-lg);
//     border-color: rgba(167,139,250,0.22);
//   }

//   .sa-card-submitted {
//     border-color: rgba(52,211,153,0.35) !important;
//   }

//   .sa-card-locked {
//     opacity: 0.6;
//     border-color: var(--sa-border) !important;
//   }

//   .sa-card-locked:hover {
//     transform: none;
//     box-shadow: var(--sa-shadow);
//     border-color: var(--sa-border) !important;
//   }

//   .sa-card-head {
//     display: flex;
//     justify-content: space-between;
//     align-items: flex-start;
//     gap: 12px;
//     margin-bottom: 12px;
//   }

//   .sa-card-index {
//     position: absolute;
//     top: 0;
//     left: 0;
//     width: 100%;
//     height: 3px;
//     border-radius: 20px 20px 0 0;
//   }

//   .sa-card-title {
//     font-size: 15px;
//     font-weight: 700;
//     color: var(--sa-text);
//     line-height: 1.4;
//     display: -webkit-box;
//     -webkit-line-clamp: 2;
//     -webkit-box-orient: vertical;
//     overflow: hidden;
//     margin: 0;
//     transition: color 0.2s;
//     display: flex;
//     align-items: flex-start;
//     gap: 6px;
//   }

//   .sa-card:hover .sa-card-title { color: var(--sa-accent4); }
//   .sa-card-locked .sa-card-title { color: var(--sa-muted) !important; }

//   .sa-card-desc {
//     font-size: 12px;
//     color: var(--sa-muted);
//     line-height: 1.5;
//     margin: 0 0 16px;
//     display: -webkit-box;
//     -webkit-line-clamp: 2;
//     -webkit-box-orient: vertical;
//     overflow: hidden;
//   }

//   /* ── Tags ── */
//   .sa-tag {
//     display: inline-flex;
//     align-items: center;
//     gap: 5px;
//     padding: 4px 10px;
//     border-radius: 8px;
//     font-size: 11px;
//     font-weight: 700;
//     white-space: nowrap;
//     flex-shrink: 0;
//     letter-spacing: 0.04em;
//   }

//   .sa-tag-active {
//     background: rgba(52,211,153,0.10);
//     color: var(--sa-accent3);
//     border: 1px solid rgba(52,211,153,0.20);
//   }

//   .sa-tag-late {
//     background: rgba(248,113,113,0.10);
//     color: var(--sa-danger);
//     border: 1px solid rgba(248,113,113,0.20);
//   }

//   .sa-tag-evaluated {
//     background: rgba(34,211,238,0.10);
//     color: var(--sa-accent1);
//     border: 1px solid rgba(34,211,238,0.20);
//   }

//   .sa-tag-submitted {
//     background: rgba(52,211,153,0.10);
//     color: var(--sa-accent3);
//     border: 1px solid rgba(52,211,153,0.25);
//   }

//   .sa-tag-locked {
//     background: rgba(251,146,60,0.10);
//     color: var(--sa-accent2);
//     border: 1px solid rgba(251,146,60,0.20);
//   }

//   /* ── Divider ── */
//   .sa-divider {
//     height: 1px;
//     background: var(--sa-border);
//     margin: 0 0 16px;
//   }

//   /* ── Meta row ── */
//   .sa-meta {
//     display: flex;
//     gap: 16px;
//     flex-wrap: wrap;
//     margin-bottom: 12px;
//   }

//   .sa-meta-item {
//     display: flex;
//     align-items: center;
//     gap: 5px;
//     font-size: 12px;
//     font-weight: 500;
//     color: var(--sa-muted);
//   }

//   /* ── Unlock hint ── */
//   .sa-unlock-hint {
//     font-size: 10px;
//     font-style: italic;
//     color: var(--sa-muted);
//     margin-bottom: 12px;
//     opacity: 0.8;
//   }

//   /* ── Button ── */
//   .sa-btn {
//     display: inline-flex;
//     align-items: center;
//     justify-content: center;
//     gap: 8px;
//     width: 100%;
//     padding: 13px 20px;
//     border-radius: 14px;
//     border: none;
//     background: var(--sa-accent4);
//     color: #0a0a0a;
//     font-family: 'Poppins', sans-serif;
//     font-size: 13px;
//     font-weight: 700;
//     cursor: pointer;
//     transition: opacity 0.2s, transform 0.2s;
//     margin-top: auto;
//   }

//   .sa-btn:hover { opacity: 0.85; transform: translateY(-1px); }

//   .sa-btn-submitted {
//     background: var(--sa-accent3);
//     color: #0a0a0a;
//   }

//   .sa-btn-locked {
//     background: var(--sa-border);
//     color: var(--sa-muted);
//     cursor: not-allowed;
//   }

//   .sa-btn-locked:hover { opacity: 1; transform: none; }

//   /* ── Toast ── */
//   .sa-toast {
//     position: fixed;
//     top: 20px;
//     left: 50%;
//     transform: translateX(-50%);
//     z-index: 9999;
//     padding: 12px 20px;
//     border-radius: 14px;
//     background: #111111;
//     border: 1px solid rgba(251,146,60,0.3);
//     color: #fff;
//     font-family: 'Poppins', sans-serif;
//     font-size: 13px;
//     font-weight: 600;
//     box-shadow: 0 8px 40px rgba(0,0,0,0.5);
//     display: flex;
//     align-items: center;
//     gap: 8px;
//     animation: sa-toast-in 0.3s ease;
//     white-space: nowrap;
//   }

//   @keyframes sa-toast-in {
//     from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
//     to   { opacity: 1; transform: translateX(-50%) translateY(0); }
//   }

//   /* ── Empty / Loading ── */
//   .sa-state {
//     text-align: center;
//     padding: 80px 20px;
//     color: var(--sa-muted);
//     font-size: 14px;
//     font-weight: 500;
//   }

//   .sa-state-icon {
//     font-size: 44px;
//     color: var(--sa-accent4);
//     margin-bottom: 16px;
//     opacity: 0.5;
//   }

//   @keyframes sa-fadein { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
//   .sa-anim { animation: sa-fadein 0.4s ease both; }
// `;

// /* Inject styles once */
// if (typeof document !== "undefined" && !document.getElementById("sa-styles")) {
//   const tag = document.createElement("style");
//   tag.id = "sa-styles";
//   tag.textContent = styles;
//   document.head.appendChild(tag);
// }

// /* ─── Dark mode helper ───────────────────────────────────────────────────── */
// const isDarkMode = () =>
//   document.documentElement.classList.contains("dark") ||
//   document.body.classList.contains("dark") ||
//   window.matchMedia("(prefers-color-scheme: dark)").matches;

// /* ─── JWT email decode ───────────────────────────────────────────────────── */
// const getEmailFromToken = () => {
//   try {
//     const token = localStorage.getItem("lms_token");
//     if (!token) return null;
//     return JSON.parse(atob(token.split(".")[1])).sub;
//   } catch {
//     return null;
//   }
// };

// /* ─── Component ──────────────────────────────────────────────────────────── */
// export default function StudentAssignments() {
//   const [assignments, setAssignments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [dark, setDark] = useState(isDarkMode);
//   const navigate = useNavigate();

//   /* ── Progress state (Component 4 logic) ── */
//   const [completedAssignmentIds, setCompletedAssignmentIds] = useState([]);
//   const [progressPercentage, setProgressPercentage] = useState(0);

//   /* ── Locked toast (Component 4 logic) ── */
//   const [lockedMsg, setLockedMsg] = useState(null);

//   const studentEmail = getEmailFromToken();

//   /* ── Dark mode observer ── */
//   useEffect(() => {
//     const obs = new MutationObserver(() => setDark(isDarkMode()));
//     obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
//     obs.observe(document.body, { attributes: true, attributeFilter: ["class"] });
//     return () => obs.disconnect();
//   }, []);

//   /* ── Sequential unlock check (Component 4 logic) ── */
//   const isUnlocked = (index) => {
//     if (index === 0) return true;
//     const prev = assignments[index - 1];
//     return completedAssignmentIds.includes(prev?.id);
//   };

//   useEffect(() => {
//     loadAssignments();
//   }, []);

//   const loadAssignments = async () => {
//     try {
//       const assignmentRes = await getStudentAssignments();
//       const submissionRes = await getMySubmissions();

//       const submissionMap = {};
//       const submissionsRaw =
//         submissionRes?.data?.data ||
//         submissionRes?.data?.submissions ||
//         submissionRes?.data ||
//         [];
//       const submissions = Array.isArray(submissionsRaw) ? submissionsRaw : [];
//       submissions.forEach((s) => { submissionMap[s.assignmentId] = s; });

//       const assignmentRaw =
//         assignmentRes?.data?.data ||
//         assignmentRes?.data?.assignments ||
//         assignmentRes?.data ||
//         [];
//       const assignmentList = Array.isArray(assignmentRaw) ? assignmentRaw : [];

//       const mergedAssignments = assignmentList.map((a) => ({
//         ...a,
//         submission: submissionMap[a.id] || null,
//       }));

//       setAssignments(mergedAssignments);

//       /* ── Load assignment progress (Component 4 logic) ── */
//       if (assignmentList.length > 0 && studentEmail) {
//         const batchId = assignmentList[0]?.batchId;
//         if (batchId) {
//           try {
//             const prog = await progressService.getAssignmentProgress(studentEmail, batchId);
//             setCompletedAssignmentIds(prog.data.completedAssignmentIds || []);
//             setProgressPercentage(prog.data.percentage || 0);
//           } catch {
//             setCompletedAssignmentIds([]);
//             setProgressPercentage(0);
//           }
//         }
//       }
//     } catch (error) {
//       console.error("Error loading assignments:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ── Navigate guard (Component 4 logic) ── */
//   const handleNavigate = (a, index) => {
//     if (!isUnlocked(index)) {
//       const prevTitle = assignments[index - 1]?.title || "previous assignment";
//       setLockedMsg(`🔒 Submit "${prevTitle}" first to unlock this assignment`);
//       setTimeout(() => setLockedMsg(null), 3000);
//       return;
//     }
//     navigate(`/student/assignments/${a.id}`);
//   };

//   const rootClass = `sa-root${dark ? " sa-dark" : ""}`;

//   /* ── Loading ── */
//   if (loading) {
//     return (
//       <div className={rootClass}>
//         <div className="sa-inner">
//           <div className="sa-state">Loading assignments...</div>
//         </div>
//       </div>
//     );
//   }

//   /* ── Empty ── */
//   if (!assignments.length) {
//     return (
//       <div className={rootClass}>
//         <div className="sa-inner">
//           <div className="sa-state">
//             <div className="sa-state-icon"><FileText size={44} /></div>
//             No assignments available.
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const accentColors = ["#22d3ee", "#a78bfa", "#34d399", "#fb923c", "#f87171"];

//   return (
//     <div className={rootClass}>

//       {/* ── Locked toast (Component 4 logic, Component 3 style) ── */}
//       {lockedMsg && (
//         <div className="sa-toast">
//           <Lock size={14} style={{ color: "#fb923c" }} />
//           {lockedMsg}
//         </div>
//       )}

//       <div className="sa-inner">

//         {/* ── Header (Component 3 design) ── */}
//         <div className="sa-header sa-anim">
//           <div className="sa-header-glow" />
//           <div style={{ position: "relative", zIndex: 1 }}>
//             <div className="sa-badge">
//               <FileText size={10} />
//               My Courses
//             </div>
            
//             <h1 style={{
//   fontFamily: "'Poppins',sans-serif",
//   fontWeight: 700,
//   fontSize: "clamp(1.5rem,3vw,2.2rem)",
//   color: "#3B82F6", // 🔵 Blue text
//   margin: "0 0 6px",
//   lineHeight: 1.1,
//   letterSpacing: "-0.02em"
// }}>
//   Assignments
// </h1>
//             <p className="sa-subtitle">View and submit your assignments</p>

//             {/* ── Sequential unlock hint (Component 4 logic) ── */}
//             <div className="sa-hint-pill">
//               📋 Submit each assignment to unlock the next one
//             </div>

//             {/* ── Stats pills ── */}
//             <div className="sa-header-stats">
//               <div className="sa-stat-pill">
//                 <span style={{ color: "var(--sa-text)", fontWeight: 700 }}>{assignments.length}</span>
//                 <span className="sa-stat-pill-sep" />
//                 <span>Total</span>
//               </div>
//               {assignments.length > 0 && (
//                 <div className="sa-stat-pill" style={{ flexDirection: "column", alignItems: "flex-start", gap: 4 }}>
//                   <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//                     <span style={{ color: "var(--sa-accent3)", fontWeight: 700 }}>
//                       {completedAssignmentIds.length} / {assignments.length}
//                     </span>
//                     <span>Submitted</span>
//                   </div>
//                   <div className="sa-progress-bar-wrap">
//                     <div className="sa-progress-bar-fill" style={{ width: `${progressPercentage}%` }} />
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="sa-header-icon">
//             <FileText size={40} />
//           </div>
//         </div>

//         {/* ── Sequential hint banner (Component 4 logic) ── */}
//         {assignments.length > 0 && (
//           <div className="sa-hint-banner sa-anim">
//             <AlertCircle size={14} />
//             Assignments are unlocked sequentially — submit each one to unlock the next
//           </div>
//         )}

//         {/* ── Grid ── */}
//         <div className="sa-grid">
//           {assignments.map((a, index) => {
//             const isLate = new Date(a.deadline) < new Date();
//             const evaluated = a.submission && a.submission.obtainedMarks !== null;
//             /* ── Progress check (Component 4 logic) ── */
//             const isSubmitted = completedAssignmentIds.includes(a.id);
//             const unlocked = isUnlocked(index);
//             const accent = accentColors[index % accentColors.length];

//             let cardClass = "sa-card sa-anim";
//             if (isSubmitted) cardClass += " sa-card-submitted";
//             else if (!unlocked) cardClass += " sa-card-locked";

//             return (
//               <div key={a.id} className={cardClass} style={{ animationDelay: `${index * 0.06}s` }}>
//                 {/* Top accent bar */}
//                 <div className="sa-card-index" style={{
//                   background: unlocked ? `linear-gradient(90deg, ${accent}, transparent)` : "var(--sa-border)",
//                 }} />

//                 {/* Head */}
//                 <div className="sa-card-head" style={{ marginTop: 8 }}>
//                   <h2 className="sa-card-title">
//                     {!unlocked && <Lock size={13} style={{ color: "#fb923c", flexShrink: 0, marginTop: 2 }} />}
//                     {index + 1}. {a.title}
//                   </h2>

//                   {/* ── Badges (Component 4 logic) ── */}
//                   {evaluated ? (
//                     <span className="sa-tag sa-tag-evaluated">
//                       <CheckCircle size={11} />
//                       {a.submission.obtainedMarks}/{a.maxMarks}
//                     </span>
//                   ) : isSubmitted ? (
//                     <span className="sa-tag sa-tag-submitted">
//                       <CheckCircle2 size={11} />
//                       Submitted
//                     </span>
//                   ) : !unlocked ? (
//                     <span className="sa-tag sa-tag-locked">
//                       <Lock size={11} />
//                       Locked
//                     </span>
//                   ) : isLate ? (
//                     <span className="sa-tag sa-tag-late">
//                       <AlertCircle size={11} />
//                       Passed
//                     </span>
//                   ) : (
//                     <span className="sa-tag sa-tag-active">
//                       <Clock size={11} />
//                       Active
//                     </span>
//                   )}
//                 </div>

//                 <p className="sa-card-desc">{a.description}</p>

//                 <div className="sa-divider" />

//                 {/* Meta */}
//                 <div className="sa-meta">
//                   <span className="sa-meta-item">
//                     <Calendar size={13} style={{ color: "var(--sa-accent4)" }} />
//                     {new Date(a.deadline).toLocaleDateString()}
//                   </span>
//                   <span className="sa-meta-item">
//                     <FileText size={13} style={{ color: "var(--sa-accent2)" }} />
//                     {a.maxMarks} Marks
//                   </span>
//                 </div>

//                 {/* ── Unlock hint (Component 4 logic) ── */}
//                 {unlocked && !isSubmitted && (
//                   <p className="sa-unlock-hint">Submit to unlock the next assignment</p>
//                 )}

//                 {/* Button */}
//                 <button
//                   className={`sa-btn ${isSubmitted ? "sa-btn-submitted" : !unlocked ? "sa-btn-locked" : ""}`}
//                   onClick={() => handleNavigate(a, index)}
//                 >
//                   {isSubmitted ? (
//                     <><CheckCircle2 size={15} /> View Submission</>
//                   ) : !unlocked ? (
//                     <><Lock size={15} /> Locked</>
//                   ) : (
//                     <>View / Submit <ArrowRight size={15} /></>
//                   )}
//                 </button>
//               </div>
//             );
//           })}
//         </div>

//       </div>
//     </div>
//   );
// }











































import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight, Calendar, FileText, CheckCircle,
  Clock, AlertCircle, Lock, CheckCircle2,
} from "lucide-react";

import {
  getMySubmissions,
  getStudentAssignments,
} from "@/services/assessmentService";

import { progressService } from "@/services/progressService";

// ── Golden Reference design system — same tokens + shell used by the
// Student Dashboard (and now AssignmentDetail). No local CSS variables,
// no injected stylesheet of colors/radii/shadows — everything below
// reads from `T`, and the card grid reuses the same `.courses-grid`
// responsive layout the Dashboard's Courses tab already defines.
import { T, PageContainer } from "@/design-system";

/* ─── JWT email decode ───────────────────────────────────────────────────── */
const getEmailFromToken = () => {
  try {
    const token = localStorage.getItem("lms_token");
    if (!token) return null;
    return JSON.parse(atob(token.split(".")[1])).sub;
  } catch {
    return null;
  }
};

/* ─── Component ──────────────────────────────────────────────────────────── */
export default function StudentAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /* ── Progress state ── */
  const [completedAssignmentIds, setCompletedAssignmentIds] = useState([]);
  const [progressPercentage, setProgressPercentage] = useState(0);

  /* ── Locked toast ── */
  const [lockedMsg, setLockedMsg] = useState(null);

  const studentEmail = getEmailFromToken();

  // Same dark-mode detection pattern as the Dashboard golden reference
  const [isDark, setIsDark] = useState(
    () => typeof document !== "undefined" &&
      (document.documentElement.classList.contains("dark") ||
       document.documentElement.getAttribute("data-theme") === "dark"),
  );

  useEffect(() => {
    const obs = new MutationObserver(() => {
      setIsDark(
        document.documentElement.classList.contains("dark") ||
        document.documentElement.getAttribute("data-theme") === "dark",
      );
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
    return () => obs.disconnect();
  }, []);

  const t = isDark ? T.dark : T.light;

  /* ── Sequential unlock check ── */
  const isUnlocked = (index) => {
    if (index === 0) return true;
    const prev = assignments[index - 1];
    return completedAssignmentIds.includes(prev?.id);
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      const assignmentRes = await getStudentAssignments();
      const submissionRes = await getMySubmissions();

      const submissionMap = {};
      const submissionsRaw =
        submissionRes?.data?.data ||
        submissionRes?.data?.submissions ||
        submissionRes?.data ||
        [];
      const submissions = Array.isArray(submissionsRaw) ? submissionsRaw : [];
      submissions.forEach((s) => { submissionMap[s.assignmentId] = s; });

      const assignmentRaw =
        assignmentRes?.data?.data ||
        assignmentRes?.data?.assignments ||
        assignmentRes?.data ||
        [];
      const assignmentList = Array.isArray(assignmentRaw) ? assignmentRaw : [];

      const mergedAssignments = assignmentList.map((a) => ({
        ...a,
        submission: submissionMap[a.id] || null,
      }));

      setAssignments(mergedAssignments);

      /* ── Load assignment progress ── */
      if (assignmentList.length > 0 && studentEmail) {
        const batchId = assignmentList[0]?.batchId;
        if (batchId) {
          try {
            const prog = await progressService.getAssignmentProgress(studentEmail, batchId);
            setCompletedAssignmentIds(prog.data.completedAssignmentIds || []);
            setProgressPercentage(prog.data.percentage || 0);
          } catch {
            setCompletedAssignmentIds([]);
            setProgressPercentage(0);
          }
        }
      }
    } catch (error) {
      console.error("Error loading assignments:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ── Navigate guard ── */
  const handleNavigate = (a, index) => {
    if (!isUnlocked(index)) {
      const prevTitle = assignments[index - 1]?.title || "previous assignment";
      setLockedMsg(`Submit "${prevTitle}" first to unlock this assignment`);
      setTimeout(() => setLockedMsg(null), 3000);
      return;
    }
    navigate(`/student/assignments/${a.id}`);
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <PageContainer mode={isDark ? "dark" : "light"} pageBg={t.pageBg} textColor={t.text}>
        <div style={{
          textAlign: "center", padding: "80px 20px", color: t.textMuted,
          fontSize: 14, fontWeight: 500, fontFamily: "'Poppins',sans-serif",
        }}>
          Loading assignments...
        </div>
      </PageContainer>
    );
  }

  /* ── Empty ── */
  if (!assignments.length) {
    return (
      <PageContainer mode={isDark ? "dark" : "light"} pageBg={t.pageBg} textColor={t.text}>
        <div style={{
          background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 20,
          padding: "60px 20px", textAlign: "center", boxShadow: t.shadow,
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: 18, border: `1.5px dashed ${t.emptyBorder}`,
            background: t.emptyBg, display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px",
          }}>
            <FileText size={28} color={t.emptyIcon} />
          </div>
          <p style={{ fontSize: 15, fontWeight: 700, color: t.text, margin: "0 0 6px", fontFamily: "'Poppins',sans-serif" }}>
            No Assignments Yet
          </p>
          <p style={{ fontSize: 12, color: t.textMuted, margin: 0, fontFamily: "'Poppins',sans-serif" }}>
            No assignments available.
          </p>
        </div>
      </PageContainer>
    );
  }

  const accentColors = ["#22d3ee", "#a78bfa", "#34d399", "#fb923c", "#f87171"];

  return (
    <PageContainer mode={isDark ? "dark" : "light"} pageBg={t.pageBg} textColor={t.text}>

      {/* ── Locked toast ── */}
      {lockedMsg && (
        <div style={{
          position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", zIndex: 9999,
          padding: "12px 20px", borderRadius: 14, background: t.cardBg,
          border: "1px solid rgba(251,146,60,0.3)", color: t.text,
          fontFamily: "'Poppins',sans-serif", fontSize: 13, fontWeight: 600,
          boxShadow: t.shadowHov, display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap",
        }}>
          <Lock size={14} style={{ color: "#fb923c" }} />
          {lockedMsg}
        </div>
      )}

      {/* ═══ HERO ═══ */}
      <div style={{
        padding: "8px 0 24px", borderBottom: `1px solid ${t.borderHero}`, marginBottom: 20,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#7c3aed" }} />
              <span style={{
                fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase",
                color: t.textSub, fontFamily: "'Poppins',sans-serif",
              }}>
                My Courses
              </span>
            </div>
            <h1 style={{
              fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: "clamp(1.5rem,3vw,2.2rem)",
              color: "#3B82F6", margin: "0 0 6px", lineHeight: 1.1, letterSpacing: "-0.02em",
            }}>
              Assignments
            </h1>
            <p style={{ fontSize: 12, color: t.textSub, margin: 0, fontWeight: 500, fontFamily: "'Poppins',sans-serif" }}>
              View and submit your assignments
            </p>

            {/* Sequential unlock hint */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px",
              borderRadius: 50, background: "rgba(251,146,60,0.08)", border: "1px solid rgba(251,146,60,0.2)",
              color: "#fb923c", fontSize: 10, fontWeight: 700, letterSpacing: "0.06em",
              marginTop: 12, fontFamily: "'Poppins',sans-serif",
            }}>
              📋 Submit each assignment to unlock the next one
            </div>
          </div>

          {/* Right: stat pills, same shape as Dashboard's hero-badges */}
          <div style={{
            display: "flex", alignItems: "center", gap: 12,
            background: t.actBg, border: `1px solid ${t.actBorder}`,
            borderRadius: 12, padding: "10px 18px",
            fontSize: 11, fontWeight: 600, fontFamily: "'Poppins',sans-serif", color: t.textSub,
          }}>
            <span><strong style={{ color: t.text }}>{assignments.length}</strong> total</span>
            <span style={{ width: 1, height: 14, background: t.actBorder }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ color: "#34d399", fontWeight: 700 }}>
                {completedAssignmentIds.length} / {assignments.length} submitted
              </span>
              <div style={{ height: 4, background: t.barBg, borderRadius: 99, overflow: "hidden", width: 100 }}>
                <div style={{ height: "100%", background: "#34d399", borderRadius: 99, width: `${progressPercentage}%`, transition: "width 0.7s ease" }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Sequential hint banner ── */}
      <div style={{
        padding: "10px 18px", borderRadius: 14, background: "rgba(251,146,60,0.06)",
        border: "1px solid rgba(251,146,60,0.18)", color: "#fb923c", fontSize: 12, fontWeight: 600,
        marginBottom: 20, display: "flex", alignItems: "center", gap: 8, fontFamily: "'Poppins',sans-serif",
      }}>
        <AlertCircle size={14} />
        Assignments are unlocked sequentially — submit each one to unlock the next
      </div>

      {/* ── Grid — reuses the Dashboard's course-card grid layout ── */}
      <div className="courses-grid">
        {assignments.map((a, index) => {
          const isLate = new Date(a.deadline) < new Date();
          const evaluated = a.submission && a.submission.obtainedMarks !== null;
          const isSubmitted = completedAssignmentIds.includes(a.id);
          const unlocked = isUnlocked(index);
          const accent = accentColors[index % accentColors.length];

          let badge;
          if (evaluated) {
            badge = (
              <span style={tagStyle("rgba(34,211,238,0.10)", "#22d3ee", "rgba(34,211,238,0.20)")}>
                <CheckCircle size={11} /> {a.submission.obtainedMarks}/{a.maxMarks}
              </span>
            );
          } else if (isSubmitted) {
            badge = (
              <span style={tagStyle("rgba(52,211,153,0.10)", "#34d399", "rgba(52,211,153,0.25)")}>
                <CheckCircle2 size={11} /> Submitted
              </span>
            );
          } else if (!unlocked) {
            badge = (
              <span style={tagStyle("rgba(251,146,60,0.10)", "#fb923c", "rgba(251,146,60,0.20)")}>
                <Lock size={11} /> Locked
              </span>
            );
          } else if (isLate) {
            badge = (
              <span style={tagStyle("rgba(248,113,113,0.10)", "#f87171", "rgba(248,113,113,0.20)")}>
                <AlertCircle size={11} /> Passed
              </span>
            );
          } else {
            badge = (
              <span style={tagStyle("rgba(52,211,153,0.10)", "#34d399", "rgba(52,211,153,0.20)")}>
                <Clock size={11} /> Active
              </span>
            );
          }

          return (
            <div
              key={a.id}
              style={{
                background: t.courseCardBg, border: `1px solid ${isSubmitted ? "rgba(52,211,153,0.35)" : t.border}`,
                borderRadius: 20, boxShadow: t.shadow, overflow: "hidden", display: "flex",
                flexDirection: "column", position: "relative", transition: "all 0.2s",
                opacity: unlocked ? 1 : 0.6, cursor: "default",
              }}
              onMouseEnter={(e) => {
                if (!unlocked) return;
                e.currentTarget.style.boxShadow = t.shadowHov;
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = t.shadow;
                e.currentTarget.style.transform = "none";
              }}
            >
              {/* Top accent bar */}
              <div style={{
                height: 4,
                background: unlocked ? `linear-gradient(90deg, ${accent}, transparent)` : t.barBg,
              }} />

              <div style={{ padding: "18px 20px 20px", flex: 1, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 12 }}>
                  <h2 style={{
                    fontSize: 15, fontWeight: 700, color: unlocked ? t.text : t.textMuted, margin: 0,
                    lineHeight: 1.4, fontFamily: "'Poppins',sans-serif", display: "flex",
                    alignItems: "flex-start", gap: 6,
                    overflow: "hidden", textOverflow: "ellipsis",
                    display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                  }}>
                    {!unlocked && <Lock size={13} style={{ color: "#fb923c", flexShrink: 0, marginTop: 2 }} />}
                    {index + 1}. {a.title}
                  </h2>
                </div>

                <div style={{ marginBottom: 6 }}>{badge}</div>

                {a.description && (
                  <p style={{
                    fontSize: 12, color: t.textMuted, lineHeight: 1.5, margin: "10px 0 16px",
                    fontFamily: "'Poppins',sans-serif", display: "-webkit-box", WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical", overflow: "hidden",
                  }}>
                    {a.description}
                  </p>
                )}

                <div style={{ height: 1, background: t.border, margin: "0 0 16px" }} />

                {/* Meta */}
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 12 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 500, color: t.textMuted, fontFamily: "'Poppins',sans-serif" }}>
                    <Calendar size={13} style={{ color: "#a78bfa" }} />
                    {new Date(a.deadline).toLocaleDateString()}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 500, color: t.textMuted, fontFamily: "'Poppins',sans-serif" }}>
                    <FileText size={13} style={{ color: "#fb923c" }} />
                    {a.maxMarks} Marks
                  </span>
                </div>

                {unlocked && !isSubmitted && (
                  <p style={{ fontSize: 10, fontStyle: "italic", color: t.textMuted, margin: "0 0 12px", opacity: 0.8, fontFamily: "'Poppins',sans-serif" }}>
                    Submit to unlock the next assignment
                  </p>
                )}

                {/* Button */}
                <button
                  onClick={() => handleNavigate(a, index)}
                  style={{
                    marginTop: "auto", width: "100%", display: "flex", alignItems: "center",
                    justifyContent: "center", gap: 8, padding: "12px 20px", borderRadius: 12,
                    border: "none", fontFamily: "'Poppins',sans-serif", fontSize: 12, fontWeight: 700,
                    cursor: unlocked ? "pointer" : "not-allowed",
                    background: isSubmitted
                      ? "#34d399"
                      : !unlocked
                        ? t.barBg
                        : "linear-gradient(135deg,#7c3aed,#a855f7)",
                    color: isSubmitted ? "#0a0a0a" : !unlocked ? t.textMuted : "#fff",
                  }}
                >
                  {isSubmitted ? (
                    <><CheckCircle2 size={15} /> View Submission</>
                  ) : !unlocked ? (
                    <><Lock size={15} /> Locked</>
                  ) : (
                    <>View / Submit <ArrowRight size={15} /></>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </PageContainer>
  );
}

/* Small shared helper for the status tag pills */
function tagStyle(bg, color, border) {
  return {
    display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px",
    borderRadius: 8, fontSize: 11, fontWeight: 700, letterSpacing: "0.04em",
    background: bg, color, border: `1px solid ${border}`, fontFamily: "'Poppins',sans-serif",
  };
}