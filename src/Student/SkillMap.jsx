// // src/Student/SkillMap.jsx
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Brain,
//   Trophy,
//   AlertTriangle,
//   BarChart2,
//   ArrowLeft,
//   RefreshCw,
//   Star,
// } from "lucide-react";
// import { progressService } from "../services/progressService";
// import SkillCard from "../components/skill/SkillCard";
// import SkillRadarChart from "../components/skill/SkillRadarChart";
// import WeakSkillsSection from "../components/skill/WeakSkillsSection";
// import CareerRoadmap from "../components/skill/CareerRoadmap";

// const T = {
//   dark: {
//     pageBg: "#0a0a0a",
//     cardBg: "#111111",
//     cardBgHov: "#161616",
//     border: "rgba(255,255,255,0.06)",
//     borderHov: "rgba(255,255,255,0.14)",
//     text: "#ffffff",
//     textSub: "rgba(255,255,255,0.3)",
//     textMuted: "rgba(255,255,255,0.2)",
//     textLabel: "rgba(255,255,255,0.22)",
//     pillBg: "rgba(255,255,255,0.04)",
//     pillBorder: "rgba(255,255,255,0.07)",
//     pillText: "rgba(255,255,255,0.25)",
//     barBg: "rgba(255,255,255,0.05)",
//     recentItemBg: "rgba(255,255,255,0.03)",
//     recentItemBorder: "rgba(255,255,255,0.05)",
//     shadow: "0 4px 20px rgba(0,0,0,0.4)",
//     shadowHov: "0 20px 60px rgba(0,0,0,0.6)",
//     heroBg: "#111111",
//     borderHero: "rgba(255,255,255,0.07)",
//     actBg: "rgba(255,255,255,0.04)",
//     actBorder: "rgba(255,255,255,0.07)",
//   },
//   light: {
//     pageBg: "#F8F9FB",
//     cardBg: "#ffffff",
//     cardBgHov: "#f8fafc",
//     border: "#e2e8f0",
//     borderHov: "#cbd5e1",
//     text: "#0f172a",
//     textSub: "#64748b",
//     textMuted: "#94a3b8",
//     textLabel: "#94a3b8",
//     pillBg: "#f1f5f9",
//     pillBorder: "#e2e8f0",
//     pillText: "#94a3b8",
//     barBg: "#f1f5f9",
//     recentItemBg: "#f8fafc",
//     recentItemBorder: "#e2e8f0",
//     shadow: "0 1px 8px rgba(0,0,0,0.07)",
//     shadowHov: "0 8px 32px rgba(0,0,0,0.10)",
//     heroBg: "#ffffff",
//     borderHero: "#e2e8f0",
//     actBg: "#f8fafc",
//     actBorder: "#e2e8f0",
//   },
// };

// const TABS = ["overview", "all skills", "weak areas", "roadmap"];

// const SkillMap = () => {
//   const navigate = useNavigate();
//   const [skills, setSkills] = useState([]);
//   const [summaryStats, setSummaryStats] = useState({
//     avgScore: 0,
//     strongCount: 0,
//     weakCount: 0,
//     totalSkills: 0,
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeTab, setActiveTab] = useState("overview");
//   const [resumeToast, setResumeToast] = useState(null);

//   const [isDark, setIsDark] = useState(
//     () =>
//       typeof document !== "undefined" &&
//       (document.documentElement.classList.contains("dark") ||
//         document.documentElement.getAttribute("data-theme") === "dark"),
//   );
//   useEffect(() => {
//     const obs = new MutationObserver(() =>
//       setIsDark(
//         document.documentElement.classList.contains("dark") ||
//           document.documentElement.getAttribute("data-theme") === "dark",
//       ),
//     );
//     obs.observe(document.documentElement, {
//       attributes: true,
//       attributeFilter: ["class", "data-theme"],
//     });
//     return () => obs.disconnect();
//   }, []);
//   const t = isDark ? T.dark : T.light;

//   // ── JWT helpers ──
//   const getEmailFromToken = () => {
//     try {
//       const token = localStorage.getItem("lms_token");
//       if (!token) return null;
//       const payload = JSON.parse(
//         atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
//       );
//       return payload.sub ?? payload.email ?? payload.username ?? null;
//     } catch {
//       return null;
//     }
//   };

//   const getBatchIdFromToken = () => {
//     try {
//       const token = localStorage.getItem("lms_token");
//       if (!token) return null;
//       const payload = JSON.parse(
//         atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
//       );
//       return payload.batchId ?? payload.batch_id ?? payload.batchid ?? null;
//     } catch {
//       return null;
//     }
//   };

//   const load = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       // ── 1. Resolve email ──
//       const email =
//         getEmailFromToken() ??
//         localStorage.getItem("lms_email") ??
//         localStorage.getItem("userEmail") ??
//         null;

//       if (!email) {
//         setError("Could not find your email. Please log out and log in again.");
//         setLoading(false);
//         return;
//       }

//       // ── 2. Resolve batchId ──
//       let batchId =
//         getBatchIdFromToken() ?? localStorage.getItem("lms_batch_id") ?? null;

//       if (!batchId) {
//         try {
//           const { getStudentClassroom } =
//             await import("../services/batchService");
//           const classRes = await getStudentClassroom();
//           const classData = classRes?.data ?? classRes;
//           batchId =
//             classData?.batchId ?? classData?.id ?? classData?.batch_id ?? null;
//         } catch (classErr) {
//           console.warn(
//             "getStudentClassroom failed:",
//             classErr?.response?.status,
//             classErr?.message,
//           );
//         }
//       }

//       if (!batchId) {
//         setError(
//           "Could not resolve your batch ID. Please make sure you are assigned to a batch.",
//         );
//         setLoading(false);
//         return;
//       }

//       // ── 3. SEED first so data always exists ──
//       // This calls POST /api/skill-map/seed to auto-populate from existing progress
//       try {
//         await progressService.seedSkillScores();
//       } catch (seedErr) {
//         // seed failing is non-fatal — data may already exist
//         console.warn("Seed attempt:", seedErr?.message);
//       }

//       // ── 4. Fetch skill map ──
//       const res = await progressService.getStudentSkillMap(email, batchId);
//       const data = res.data;

//       // ── 5. Normalise skill shape ──
//       const normalised = (data.skills ?? []).map((s, idx) => ({
//         id: s.id ?? idx + 1,
//         name: s.skillName ?? s.name ?? "Unknown Skill",
//         score: Math.round(s.overallScore ?? s.score ?? 0),
//         quizScore: Math.round(s.quizScore ?? 0),
//         assignmentScore: Math.round(s.assignmentScore ?? 0),
//         videoScore: Math.round(s.videoScore ?? 0),
//         overallScore: Math.round(s.overallScore ?? s.score ?? 0),
//         isWeak: s.weak ?? s.isWeak ?? Math.round(s.overallScore ?? 0) < 50,
//         isStrong:
//           s.strong ?? s.isStrong ?? Math.round(s.overallScore ?? 0) >= 70,
//         level:
//           s.level ??
//           ((s.overallScore ?? 0) >= 70
//             ? "Advanced"
//             : (s.overallScore ?? 0) >= 40
//               ? "Intermediate"
//               : "Beginner"),
//         updatedAt: s.updatedAt,
//       }));

//       setSkills(normalised);
//       setSummaryStats({
//         avgScore: Math.round(data.avgScore ?? 0),
//         strongCount: data.strongCount ?? 0,
//         weakCount: data.weakCount ?? 0,
//         totalSkills: data.totalSkills ?? normalised.length,
//       });
//     } catch (e) {
//       console.error("SkillMap fetch error:", e);
//       if (e?.response?.status === 403) {
//         setError(
//           "Access denied (403). Your session may have expired — please log out and log in again.",
//         );
//       } else if (e?.response?.status === 401) {
//         setError("Session expired. Please log in again.");
//       } else {
//         setError("Failed to load skill data. Please try again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     load();
//   }, []);

//   const weakSkills = skills.filter((s) => s.isWeak);
//   const strongSkills = skills.filter((s) => s.isStrong);

//   const handleResumeAdd = (skillName) => {
//     setResumeToast(`"${skillName}" added to resume!`);
//     setTimeout(() => setResumeToast(null), 3000);
//   };

//   if (loading)
//     return (
//       <div
//         style={{
//           minHeight: "100vh",
//           background: t.pageBg,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//         }}
//       >
//         <div
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             gap: 14,
//           }}
//         >
//           <div
//             style={{
//               width: 52,
//               height: 52,
//               borderRadius: 14,
//               background: "rgba(167,139,250,0.1)",
//               border: "1px solid rgba(167,139,250,0.2)",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               animation: "spin 1s linear infinite",
//             }}
//           >
//             <Brain size={22} color="#a78bfa" />
//           </div>
//           <p
//             style={{
//               fontSize: 13,
//               color: t.textMuted,
//               fontFamily: "'Poppins',sans-serif",
//             }}
//           >
//             Analyzing your skills…
//           </p>
//           <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
//         </div>
//       </div>
//     );

//   if (error)
//     return (
//       <div
//         style={{
//           minHeight: "100vh",
//           background: t.pageBg,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           fontFamily: "'Poppins',sans-serif",
//         }}
//       >
//         <div
//           style={{
//             textAlign: "center",
//             background: t.cardBg,
//             border: `1px solid ${t.border}`,
//             borderRadius: 20,
//             padding: "40px 32px",
//             maxWidth: 420,
//           }}
//         >
//           <AlertTriangle
//             size={32}
//             color="#f87171"
//             style={{ display: "block", margin: "0 auto 12px" }}
//           />
//           <p
//             style={{
//               fontSize: 13,
//               color: t.text,
//               fontWeight: 700,
//               margin: "0 0 8px",
//             }}
//           >
//             Something went wrong
//           </p>
//           <p style={{ fontSize: 12, color: t.textMuted, margin: "0 0 20px" }}>
//             {error}
//           </p>
//           <button
//             onClick={load}
//             style={{
//               padding: "9px 22px",
//               borderRadius: 10,
//               background: "rgba(167,139,250,0.1)",
//               border: "1px solid rgba(167,139,250,0.3)",
//               color: "#a78bfa",
//               fontSize: 12,
//               fontWeight: 600,
//               cursor: "pointer",
//               fontFamily: "'Poppins',sans-serif",
//             }}
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
//         @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
//         .sfade { animation: fadeUp 0.4s ease both; }
//       `}</style>

//       {resumeToast && (
//         <div
//           style={{
//             position: "fixed",
//             bottom: 24,
//             left: "50%",
//             transform: "translateX(-50%)",
//             background: "#1e293b",
//             color: "#fff",
//             padding: "10px 20px",
//             borderRadius: 12,
//             fontSize: 12,
//             fontWeight: 600,
//             fontFamily: "'Poppins',sans-serif",
//             boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
//             border: "1px solid rgba(255,255,255,0.08)",
//             zIndex: 9999,
//             display: "flex",
//             alignItems: "center",
//             gap: 8,
//           }}
//         >
//           <Star size={13} color="#fbbf24" fill="#fbbf24" /> {resumeToast}
//         </div>
//       )}

//       <div
//         style={{
//           minHeight: "100vh",
//           background: t.pageBg,
//           fontFamily: "'Poppins',sans-serif",
//         }}
//       >
//         <div
//           style={{
//             maxWidth: 1300,
//             margin: "0 auto",
//             padding: 24,
//             paddingBottom: 52,
//           }}
//         >
//           {/* HERO */}
//           <div
//             className="sfade"
//             style={{
//               background: t.heroBg,
//               border: `1px solid ${t.borderHero}`,
//               borderRadius: 24,
//               padding: "28px 32px",
//               marginBottom: 20,
//               boxShadow: t.shadow,
//             }}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 flexWrap: "wrap",
//                 gap: 16,
//               }}
//             >
//               <div>
//                 <button
//                   onClick={() => navigate("/student")}
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 6,
//                     fontSize: 11,
//                     fontWeight: 600,
//                     color: t.textMuted,
//                     background: "transparent",
//                     border: "none",
//                     cursor: "pointer",
//                     fontFamily: "'Poppins',sans-serif",
//                     marginBottom: 12,
//                     padding: 0,
//                   }}
//                 >
//                   <ArrowLeft size={13} /> Back to Dashboard
//                 </button>
//                 <div
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 8,
//                     marginBottom: 8,
//                   }}
//                 >
//                   <div
//                     style={{
//                       width: 6,
//                       height: 6,
//                       borderRadius: "50%",
//                       background: "#a78bfa",
//                     }}
//                   />
//                   <span
//                     style={{
//                       fontSize: 10,
//                       fontWeight: 700,
//                       letterSpacing: "0.2em",
//                       textTransform: "uppercase",
//                       color: t.textSub,
//                     }}
//                   >
//                     Skill Intelligence
//                   </span>
//                 </div>
//                 <h1
//                   style={{
//                     fontSize: "clamp(1.5rem,3vw,2rem)",
//                     fontWeight: 900,
//                     color: t.text,
//                     margin: "0 0 6px",
//                     lineHeight: 1.1,
//                     letterSpacing: "-0.02em",
//                   }}
//                 >
//                   Skill Map
//                 </h1>
//                 <p
//                   style={{
//                     fontSize: 12,
//                     color: t.textSub,
//                     margin: 0,
//                     fontWeight: 500,
//                   }}
//                 >
//                   Your personalized skill analysis & career roadmap
//                 </p>
//                 <div
//                   style={{
//                     display: "flex",
//                     gap: 8,
//                     marginTop: 16,
//                     flexWrap: "wrap",
//                   }}
//                 >
//                   {TABS.map((tab) => (
//                     <button
//                       key={tab}
//                       onClick={() => setActiveTab(tab)}
//                       style={{
//                         padding: "6px 16px",
//                         borderRadius: 10,
//                         fontSize: 11,
//                         fontWeight: 600,
//                         cursor: "pointer",
//                         fontFamily: "'Poppins',sans-serif",
//                         textTransform: "capitalize",
//                         transition: "all 0.2s",
//                         border: `1px solid ${activeTab === tab ? "rgba(167,139,250,0.5)" : t.borderHov}`,
//                         background:
//                           activeTab === tab ? "#a78bfa" : t.actBg,
//                         color: activeTab === tab ? "#ffffff" : t.textSub,
//                       }}
//                     >
//                       {tab.charAt(0).toUpperCase() + tab.slice(1)}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 8,
//                   flexWrap: "wrap",
//                 }}
//               >
//                 <div
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 12,
//                     background: t.actBg,
//                     border: `1px solid ${t.actBorder}`,
//                     borderRadius: 12,
//                     padding: "8px 16px",
//                     fontSize: 11,
//                     fontWeight: 600,
//                     color: t.textSub,
//                   }}
//                 >
//                   <span>{summaryStats.totalSkills} skills</span>
//                   <span
//                     style={{ width: 1, height: 14, background: t.actBorder }}
//                   />
//                   <span style={{ color: "#34d399" }}>
//                     {summaryStats.strongCount} strong
//                   </span>
//                   <span
//                     style={{ width: 1, height: 14, background: t.actBorder }}
//                   />
//                   {summaryStats.weakCount > 0 ? (
//                     <span style={{ color: "#f87171" }}>
//                       {summaryStats.weakCount} weak
//                     </span>
//                   ) : (
//                     <span style={{ color: "#34d399" }}>None weak ✓</span>
//                   )}
//                 </div>
//                 <button
//                   onClick={load}
//                   style={{
//                     width: 38,
//                     height: 38,
//                     borderRadius: 10,
//                     background: t.actBg,
//                     border: `1px solid ${t.actBorder}`,
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     cursor: "pointer",
//                     color: t.textMuted,
//                   }}
//                 >
//                   <RefreshCw size={15} />
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* SUMMARY STAT CARDS */}
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
//               gap: 14,
//               marginBottom: 20,
//             }}
//           >
//             {[
//               {
//                 label: "Avg. Score",
//                 value: `${summaryStats.avgScore}%`,
//                 color: "#a78bfa",
//                 icon: BarChart2,
//               },
//               {
//                 label: "Strong Skills",
//                 value: summaryStats.strongCount,
//                 color: "#34d399",
//                 icon: Trophy,
//               },
//               {
//                 label: "Weak Areas",
//                 value: summaryStats.weakCount,
//                 color: "#f87171",
//                 icon: AlertTriangle,
//               },
//               {
//                 label: "Total Skills",
//                 value: summaryStats.totalSkills,
//                 color: "#22d3ee",
//                 icon: Brain,
//               },
//             ].map((s, i) => {
//               const Icon = s.icon;
//               return (
//                 <div
//                   key={i}
//                   className="sfade"
//                   style={{
//                     background: t.cardBg,
//                     border: `1px solid ${t.border}`,
//                     borderRadius: 16,
//                     padding: 20,
//                     boxShadow: t.shadow,
//                     animationDelay: `${i * 60}ms`,
//                   }}
//                 >
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "space-between",
//                       marginBottom: 10,
//                     }}
//                   >
//                     <p
//                       style={{
//                         fontSize: 10,
//                         fontWeight: 700,
//                         letterSpacing: "0.1em",
//                         textTransform: "uppercase",
//                         color: t.textMuted,
//                         margin: 0,
//                       }}
//                     >
//                       {s.label}
//                     </p>
//                     <div
//                       style={{
//                         width: 32,
//                         height: 32,
//                         borderRadius: 9,
//                         background: `${s.color}18`,
//                         border: `1px solid ${s.color}30`,
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                       }}
//                     >
//                       <Icon size={14} color={s.color} />
//                     </div>
//                   </div>
//                   <p
//                     style={{
//                       fontSize: 30,
//                       fontWeight: 800,
//                       color: t.text,
//                       margin: 0,
//                     }}
//                   >
//                     {s.value}
//                   </p>
//                 </div>
//               );
//             })}
//           </div>

//           {/* TAB CONTENT */}
//           {activeTab === "overview" && (
//             <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
//               <div
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: "1fr 1fr",
//                   gap: 16,
//                 }}
//               >
//                 <SkillRadarChart skills={skills} t={t} />
//                 <WeakSkillsSection weakSkills={weakSkills} t={t} />
//               </div>
//               <CareerRoadmap skills={skills} t={t} />
//               <div>
//                 <p
//                   style={{
//                     fontSize: 13,
//                     fontWeight: 700,
//                     color: t.text,
//                     margin: "0 0 14px",
//                     fontFamily: "'Poppins',sans-serif",
//                   }}
//                 >
//                   Top Skills
//                 </p>
//                 <div
//                   style={{
//                     display: "grid",
//                     gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
//                     gap: 14,
//                   }}
//                 >
//                   {[...skills]
//                     .sort((a, b) => b.score - a.score)
//                     .slice(0, 3)
//                     .map((skill) => (
//                       <SkillCard
//                         key={skill.id}
//                         skill={skill}
//                         t={t}
//                         onResumeAdd={handleResumeAdd}
//                       />
//                     ))}
//                 </div>
//               </div>
//             </div>
//           )}

//           {activeTab === "all skills" && (
//             <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
//               <p style={{ fontSize: 12, color: t.textMuted, margin: 0 }}>
//                 Showing{" "}
//                 <strong style={{ color: t.text }}>{skills.length}</strong>{" "}
//                 skills tracked
//               </p>
//               <div
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
//                   gap: 14,
//                 }}
//               >
//                 {[...skills]
//                   .sort((a, b) => b.score - a.score)
//                   .map((skill) => (
//                     <SkillCard
//                       key={skill.id}
//                       skill={skill}
//                       t={t}
//                       onResumeAdd={handleResumeAdd}
//                     />
//                   ))}
//               </div>
//             </div>
//           )}

//           {activeTab === "weak areas" && (
//             <WeakSkillsSection weakSkills={weakSkills} t={t} />
//           )}

//           {activeTab === "roadmap" && (
//             <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
//               <CareerRoadmap skills={skills} t={t} />
//               <SkillRadarChart skills={skills} t={t} />
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default SkillMap;






































// // src/Student/SkillMap.jsx
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Brain,
//   Trophy,
//   AlertTriangle,
//   BarChart2,
//   ArrowLeft,
//   RefreshCw,
//   Star,
// } from "lucide-react";
// import { progressService } from "../services/progressService";
// import SkillCard from "../components/skill/SkillCard";
// import SkillRadarChart from "../components/skill/SkillRadarChart";
// import WeakSkillsSection from "../components/skill/WeakSkillsSection";
// import CareerRoadmap from "../components/skill/CareerRoadmap";

// const T = {
//   dark: {
//     pageBg: "#0a0a0a",
//     cardBg: "#111111",
//     cardBgHov: "#161616",
//     border: "rgba(255,255,255,0.06)",
//     borderHov: "rgba(255,255,255,0.14)",
//     text: "#ffffff",
//     textSub: "rgba(255,255,255,0.3)",
//     textMuted: "rgba(255,255,255,0.2)",
//     textLabel: "rgba(255,255,255,0.22)",
//     pillBg: "rgba(255,255,255,0.04)",
//     pillBorder: "rgba(255,255,255,0.07)",
//     pillText: "rgba(255,255,255,0.25)",
//     barBg: "rgba(255,255,255,0.05)",
//     recentItemBg: "rgba(255,255,255,0.03)",
//     recentItemBorder: "rgba(255,255,255,0.05)",
//     shadow: "0 4px 20px rgba(0,0,0,0.4)",
//     shadowHov: "0 20px 60px rgba(0,0,0,0.6)",
//     heroBg: "#111111",
//     borderHero: "rgba(255,255,255,0.07)",
//     actBg: "rgba(255,255,255,0.04)",
//     actBorder: "rgba(255,255,255,0.07)",
//   },
//   light: {
//     pageBg: "#F8F9FB",
//     cardBg: "#ffffff",
//     cardBgHov: "#f8fafc",
//     border: "#e2e8f0",
//     borderHov: "#cbd5e1",
//     text: "#0f172a",
//     textSub: "#64748b",
//     textMuted: "#94a3b8",
//     textLabel: "#94a3b8",
//     pillBg: "#f1f5f9",
//     pillBorder: "#e2e8f0",
//     pillText: "#94a3b8",
//     barBg: "#f1f5f9",
//     recentItemBg: "#f8fafc",
//     recentItemBorder: "#e2e8f0",
//     shadow: "0 1px 8px rgba(0,0,0,0.07)",
//     shadowHov: "0 8px 32px rgba(0,0,0,0.10)",
//     heroBg: "#ffffff",
//     borderHero: "#e2e8f0",
//     actBg: "#f8fafc",
//     actBorder: "#e2e8f0",
//   },
// };

// const TABS = ["overview", "all skills", "weak areas", "roadmap"];

// const SkillMap = () => {
//   const navigate = useNavigate();
//   const [skills, setSkills] = useState([]);
//   const [summaryStats, setSummaryStats] = useState({
//     avgScore: 0,
//     strongCount: 0,
//     weakCount: 0,
//     totalSkills: 0,
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeTab, setActiveTab] = useState("overview");
//   const [resumeToast, setResumeToast] = useState(null);

//   const [isDark, setIsDark] = useState(
//     () =>
//       typeof document !== "undefined" &&
//       (document.documentElement.classList.contains("dark") ||
//         document.documentElement.getAttribute("data-theme") === "dark"),
//   );
//   useEffect(() => {
//     const obs = new MutationObserver(() =>
//       setIsDark(
//         document.documentElement.classList.contains("dark") ||
//           document.documentElement.getAttribute("data-theme") === "dark",
//       ),
//     );
//     obs.observe(document.documentElement, {
//       attributes: true,
//       attributeFilter: ["class", "data-theme"],
//     });
//     return () => obs.disconnect();
//   }, []);
//   const t = isDark ? T.dark : T.light;

//   // ── JWT helpers ──
//   const getEmailFromToken = () => {
//     try {
//       const token = localStorage.getItem("lms_token");
//       if (!token) return null;
//       const payload = JSON.parse(
//         atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
//       );
//       return payload.sub ?? payload.email ?? payload.username ?? null;
//     } catch {
//       return null;
//     }
//   };

//   const getBatchIdFromToken = () => {
//     try {
//       const token = localStorage.getItem("lms_token");
//       if (!token) return null;
//       const payload = JSON.parse(
//         atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
//       );
//       return payload.batchId ?? payload.batch_id ?? payload.batchid ?? null;
//     } catch {
//       return null;
//     }
//   };

//   const load = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       // ── 1. Resolve email ──
//       const email =
//         getEmailFromToken() ??
//         localStorage.getItem("lms_email") ??
//         localStorage.getItem("userEmail") ??
//         null;

//       if (!email) {
//         setError("Could not find your email. Please log out and log in again.");
//         setLoading(false);
//         return;
//       }

//       // ── 2. Resolve batchId ──
//       let batchId =
//         getBatchIdFromToken() ?? localStorage.getItem("lms_batch_id") ?? null;

//       if (!batchId) {
//         try {
//           const { getStudentClassroom } =
//             await import("../services/batchService");
//           const classRes = await getStudentClassroom();
//           const classData = classRes?.data ?? classRes;
//           batchId =
//             classData?.batchId ?? classData?.id ?? classData?.batch_id ?? null;
//         } catch (classErr) {
//           console.warn(
//             "getStudentClassroom failed:",
//             classErr?.response?.status,
//             classErr?.message,
//           );
//         }
//       }

//       if (!batchId) {
//         setError(
//           "Could not resolve your batch ID. Please make sure you are assigned to a batch.",
//         );
//         setLoading(false);
//         return;
//       }

//       // ── 3. SEED first so data always exists ──
//       // This calls POST /api/skill-map/seed to auto-populate from existing progress
//       try {
//         await progressService.seedSkillScores();
//       } catch (seedErr) {
//         // seed failing is non-fatal — data may already exist
//         console.warn("Seed attempt:", seedErr?.message);
//       }

//       // ── 4. Fetch skill map ──
//       const res = await progressService.getStudentSkillMap(email, batchId);
//       const data = res.data;

//       // ── 5. Normalise skill shape ──
//       const normalised = (data.skills ?? []).map((s, idx) => ({
//         id: s.id ?? idx + 1,
//         name: s.skillName ?? s.name ?? "Unknown Skill",
//         score: Math.round(s.overallScore ?? s.score ?? 0),
//         quizScore: Math.round(s.quizScore ?? 0),
//         assignmentScore: Math.round(s.assignmentScore ?? 0),
//         videoScore: Math.round(s.videoScore ?? 0),
//         overallScore: Math.round(s.overallScore ?? s.score ?? 0),
//         isWeak: s.weak ?? s.isWeak ?? Math.round(s.overallScore ?? 0) < 50,
//         isStrong:
//           s.strong ?? s.isStrong ?? Math.round(s.overallScore ?? 0) >= 70,
//         level:
//           s.level ??
//           ((s.overallScore ?? 0) >= 70
//             ? "Advanced"
//             : (s.overallScore ?? 0) >= 40
//               ? "Intermediate"
//               : "Beginner"),
//         updatedAt: s.updatedAt,
//       }));

//       setSkills(normalised);
//       setSummaryStats({
//         avgScore: Math.round(data.avgScore ?? 0),
//         strongCount: data.strongCount ?? 0,
//         weakCount: data.weakCount ?? 0,
//         totalSkills: data.totalSkills ?? normalised.length,
//       });
//     } catch (e) {
//       console.error("SkillMap fetch error:", e);
//       if (e?.response?.status === 403) {
//         setError(
//           "Access denied (403). Your session may have expired — please log out and log in again.",
//         );
//       } else if (e?.response?.status === 401) {
//         setError("Session expired. Please log in again.");
//       } else {
//         setError("Failed to load skill data. Please try again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     load();
//   }, []);

//   const weakSkills = skills.filter((s) => s.isWeak);
//   const strongSkills = skills.filter((s) => s.isStrong);

//   const handleResumeAdd = (skillName) => {
//     setResumeToast(`"${skillName}" added to resume!`);
//     setTimeout(() => setResumeToast(null), 3000);
//   };

//   if (loading)
//     return (
//       <div
//         style={{
//           minHeight: "100vh",
//           background: t.pageBg,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//         }}
//       >
//         <div
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             gap: 14,
//           }}
//         >
//           <div
//             style={{
//               width: 52,
//               height: 52,
//               borderRadius: 14,
//               background: "rgba(167,139,250,0.1)",
//               border: "1px solid rgba(167,139,250,0.2)",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               animation: "spin 1s linear infinite",
//             }}
//           >
//             <Brain size={22} color="#a78bfa" />
//           </div>
//           <p
//             style={{
//               fontSize: 13,
//               color: t.textMuted,
//               fontFamily: "'Poppins',sans-serif",
//             }}
//           >
//             Analyzing your skills…
//           </p>
//           <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
//         </div>
//       </div>
//     );

//   if (error)
//     return (
//       <div
//         style={{
//           minHeight: "100vh",
//           background: t.pageBg,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           fontFamily: "'Poppins',sans-serif",
//         }}
//       >
//         <div
//           style={{
//             textAlign: "center",
//             background: t.cardBg,
//             border: `1px solid ${t.border}`,
//             borderRadius: 20,
//             padding: "40px 32px",
//             maxWidth: 420,
//           }}
//         >
//           <AlertTriangle
//             size={32}
//             color="#f87171"
//             style={{ display: "block", margin: "0 auto 12px" }}
//           />
//           <p
//             style={{
//               fontSize: 13,
//               color: t.text,
//               fontWeight: 700,
//               margin: "0 0 8px",
//             }}
//           >
//             Something went wrong
//           </p>
//           <p style={{ fontSize: 12, color: t.textMuted, margin: "0 0 20px" }}>
//             {error}
//           </p>
//           <button
//             onClick={load}
//             style={{
//               padding: "9px 22px",
//               borderRadius: 10,
//               background: "rgba(167,139,250,0.1)",
//               border: "1px solid rgba(167,139,250,0.3)",
//               color: "#a78bfa",
//               fontSize: 12,
//               fontWeight: 600,
//               cursor: "pointer",
//               fontFamily: "'Poppins',sans-serif",
//             }}
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
//         @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
//         .sfade { animation: fadeUp 0.4s ease both; }
//       `}</style>

//       {resumeToast && (
//         <div
//           style={{
//             position: "fixed",
//             bottom: 24,
//             left: "50%",
//             transform: "translateX(-50%)",
//             background: "#1e293b",
//             color: "#fff",
//             padding: "10px 20px",
//             borderRadius: 12,
//             fontSize: 12,
//             fontWeight: 600,
//             fontFamily: "'Poppins',sans-serif",
//             boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
//             border: "1px solid rgba(255,255,255,0.08)",
//             zIndex: 9999,
//             display: "flex",
//             alignItems: "center",
//             gap: 8,
//           }}
//         >
//           <Star size={13} color="#fbbf24" fill="#fbbf24" /> {resumeToast}
//         </div>
//       )}

//       <div
//         style={{
//           minHeight: "100vh",
//           background: t.pageBg,
//           fontFamily: "'Poppins',sans-serif",
//         }}
//       >
//         <div
//           style={{
//             maxWidth: 1300,
//             margin: "0 auto",
//             padding: 24,
//             paddingBottom: 52,
//           }}
//         >
//           {/* HERO */}
//           <div
//             className="sfade"
//             style={{
//               background: t.heroBg,
//               border: `1px solid ${t.borderHero}`,
//               borderRadius: 24,
//               padding: "28px 32px",
//               marginBottom: 20,
//               boxShadow: t.shadow,
//             }}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 flexWrap: "wrap",
//                 gap: 16,
//               }}
//             >
//               <div>
//                 <button
//                   onClick={() => navigate("/student")}
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 6,
//                     fontSize: 11,
//                     fontWeight: 600,
//                     color: t.textMuted,
//                     background: "transparent",
//                     border: "none",
//                     cursor: "pointer",
//                     fontFamily: "'Poppins',sans-serif",
//                     marginBottom: 12,
//                     padding: 0,
//                   }}
//                 >
//                   <ArrowLeft size={13} /> Back to Dashboard
//                 </button>
//                 <div
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 8,
//                     marginBottom: 8,
//                   }}
//                 >
//                   <div
//                     style={{
//                       width: 6,
//                       height: 6,
//                       borderRadius: "50%",
//                       background: "#a78bfa",
//                     }}
//                   />
//                   <span
//                     style={{
//                       fontSize: 10,
//                       fontWeight: 700,
//                       letterSpacing: "0.2em",
//                       textTransform: "uppercase",
//                       color: t.textSub,
//                     }}
//                   >
//                     Skill Intelligence
//                   </span>
//                 </div>
//                 <h1
//                   style={{
//                     fontSize: "clamp(1.5rem,3vw,2rem)",
//                     fontWeight: 900,
//                     color: t.text,
//                     margin: "0 0 6px",
//                     lineHeight: 1.1,
//                     letterSpacing: "-0.02em",
//                   }}
//                 >
//                   Skill Map
//                 </h1>
//                 <p
//                   style={{
//                     fontSize: 12,
//                     color: t.textSub,
//                     margin: 0,
//                     fontWeight: 500,
//                   }}
//                 >
//                   Your personalized skill analysis & career roadmap
//                 </p>
//                 <div
//                   style={{
//                     display: "flex",
//                     gap: 8,
//                     marginTop: 16,
//                     flexWrap: "wrap",
//                   }}
//                 >
//                   {TABS.map((tab) => (
//                     <button
//                       key={tab}
//                       onClick={() => setActiveTab(tab)}
//                       style={{
//                         padding: "6px 16px",
//                         borderRadius: 10,
//                         fontSize: 11,
//                         fontWeight: 600,
//                         cursor: "pointer",
//                         fontFamily: "'Poppins',sans-serif",
//                         textTransform: "capitalize",
//                         transition: "all 0.2s",
//                         border: `1px solid ${activeTab === tab ? "rgba(167,139,250,0.5)" : t.borderHov}`,
//                         background:
//                           activeTab === tab ? "#a78bfa" : t.actBg,
//                         color: activeTab === tab ? "#ffffff" : t.textSub,
//                       }}
//                     >
//                       {tab.charAt(0).toUpperCase() + tab.slice(1)}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 8,
//                   flexWrap: "wrap",
//                 }}
//               >
//                 <div
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 12,
//                     background: t.actBg,
//                     border: `1px solid ${t.actBorder}`,
//                     borderRadius: 12,
//                     padding: "8px 16px",
//                     fontSize: 11,
//                     fontWeight: 600,
//                     color: t.textSub,
//                   }}
//                 >
//                   <span>{summaryStats.totalSkills} skills</span>
//                   <span
//                     style={{ width: 1, height: 14, background: t.actBorder }}
//                   />
//                   <span style={{ color: "#34d399" }}>
//                     {summaryStats.strongCount} strong
//                   </span>
//                   <span
//                     style={{ width: 1, height: 14, background: t.actBorder }}
//                   />
//                   {summaryStats.weakCount > 0 ? (
//                     <span style={{ color: "#f87171" }}>
//                       {summaryStats.weakCount} weak
//                     </span>
//                   ) : (
//                     <span style={{ color: "#34d399" }}>None weak ✓</span>
//                   )}
//                 </div>
//                 <button
//                   onClick={load}
//                   style={{
//                     width: 38,
//                     height: 38,
//                     borderRadius: 10,
//                     background: t.actBg,
//                     border: `1px solid ${t.actBorder}`,
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     cursor: "pointer",
//                     color: t.textMuted,
//                   }}
//                 >
//                   <RefreshCw size={15} />
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* SUMMARY STAT CARDS */}
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
//               gap: 14,
//               marginBottom: 20,
//             }}
//           >
//             {[
//               {
//                 label: "Avg. Score",
//                 value: `${summaryStats.avgScore}%`,
//                 color: "#a78bfa",
//                 icon: BarChart2,
//               },
//               {
//                 label: "Strong Skills",
//                 value: summaryStats.strongCount,
//                 color: "#34d399",
//                 icon: Trophy,
//               },
//               {
//                 label: "Weak Areas",
//                 value: summaryStats.weakCount,
//                 color: "#f87171",
//                 icon: AlertTriangle,
//               },
//               {
//                 label: "Total Skills",
//                 value: summaryStats.totalSkills,
//                 color: "#22d3ee",
//                 icon: Brain,
//               },
//             ].map((s, i) => {
//               const Icon = s.icon;
//               return (
//                 <div
//                   key={i}
//                   className="sfade"
//                   style={{
//                     background: t.cardBg,
//                     border: `1px solid ${t.border}`,
//                     borderRadius: 16,
//                     padding: 20,
//                     boxShadow: t.shadow,
//                     animationDelay: `${i * 60}ms`,
//                   }}
//                 >
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "space-between",
//                       marginBottom: 10,
//                     }}
//                   >
//                     <p
//                       style={{
//                         fontSize: 10,
//                         fontWeight: 700,
//                         letterSpacing: "0.1em",
//                         textTransform: "uppercase",
//                         color: t.textMuted,
//                         margin: 0,
//                       }}
//                     >
//                       {s.label}
//                     </p>
//                     <div
//                       style={{
//                         width: 32,
//                         height: 32,
//                         borderRadius: 9,
//                         background: `${s.color}18`,
//                         border: `1px solid ${s.color}30`,
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                       }}
//                     >
//                       <Icon size={14} color={s.color} />
//                     </div>
//                   </div>
//                   <p
//                     style={{
//                       fontSize: 30,
//                       fontWeight: 800,
//                       color: t.text,
//                       margin: 0,
//                     }}
//                   >
//                     {s.value}
//                   </p>
//                 </div>
//               );
//             })}
//           </div>

//           {/* TAB CONTENT */}
//           {activeTab === "overview" && (
//             <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
//               <div
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: "1fr 1fr",
//                   gap: 16,
//                 }}
//               >
//                 <SkillRadarChart skills={skills} t={t} />
//                 <WeakSkillsSection weakSkills={weakSkills} t={t} />
//               </div>
//               <CareerRoadmap skills={skills} t={t} />
//               <div>
//                 <p
//                   style={{
//                     fontSize: 13,
//                     fontWeight: 700,
//                     color: t.text,
//                     margin: "0 0 14px",
//                     fontFamily: "'Poppins',sans-serif",
//                   }}
//                 >
//                   Top Skills
//                 </p>
//                 <div
//                   style={{
//                     display: "grid",
//                     gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
//                     gap: 14,
//                   }}
//                 >
//                   {[...skills]
//                     .sort((a, b) => b.score - a.score)
//                     .slice(0, 3)
//                     .map((skill) => (
//                       <SkillCard
//                         key={skill.id}
//                         skill={skill}
//                         t={t}
//                         onResumeAdd={handleResumeAdd}
//                       />
//                     ))}
//                 </div>
//               </div>
//             </div>
//           )}

//           {activeTab === "all skills" && (
//             <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
//               <p style={{ fontSize: 12, color: t.textMuted, margin: 0 }}>
//                 Showing{" "}
//                 <strong style={{ color: t.text }}>{skills.length}</strong>{" "}
//                 skills tracked
//               </p>
//               <div
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
//                   gap: 14,
//                 }}
//               >
//                 {[...skills]
//                   .sort((a, b) => b.score - a.score)
//                   .map((skill) => (
//                     <SkillCard
//                       key={skill.id}
//                       skill={skill}
//                       t={t}
//                       onResumeAdd={handleResumeAdd}
//                     />
//                   ))}
//               </div>
//             </div>
//           )}

//           {activeTab === "weak areas" && (
//             <WeakSkillsSection weakSkills={weakSkills} t={t} />
//           )}

//           {activeTab === "roadmap" && (
//             <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
//               <CareerRoadmap skills={skills} t={t} />
//               <SkillRadarChart skills={skills} t={t} />
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default SkillMap;






































// src/Student/SkillMap.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Brain,
  Trophy,
  AlertTriangle,
  BarChart2,
  ArrowLeft,
  RefreshCw,
  Star,
  Activity,
} from "lucide-react";
import { progressService } from "../services/progressService";
import SkillCard from "../components/skill/SkillCard";
import SkillRadarChart from "../components/skill/SkillRadarChart";
import WeakSkillsSection from "../components/skill/WeakSkillsSection";
import CareerRoadmap from "../components/skill/CareerRoadmap";

// ── Global Design System — same single source of truth the Dashboard
// (Golden Reference) uses for colors, typography, spacing, radius,
// shadows, StatCard and the responsive PageContainer shell. This page
// no longer declares its own token map or page-shell markup — every
// value below comes from the shared system so it stays pixel-identical
// to Dashboard and to every other page that adopts it.
import { T, StatCard, PageContainer, FONT_FAMILY, FONT_WEIGHT, FONT_SIZE, LETTER_SPACING, LINE_HEIGHT } from "@/design-system";

const TABS = ["overview", "all skills", "weak areas", "roadmap"];

// Brand accent used for all interactive chrome (tabs, buttons, spinner,
// live badge) — matches the #7c3aed used across DashboardPage.jsx.
const BRAND = "#7c3aed";

const SkillMap = () => {
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);
  const [summaryStats, setSummaryStats] = useState({
    avgScore: 0,
    strongCount: 0,
    weakCount: 0,
    totalSkills: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [resumeToast, setResumeToast] = useState(null);

  const [isDark, setIsDark] = useState(
    () =>
      typeof document !== "undefined" &&
      (document.documentElement.classList.contains("dark") ||
        document.documentElement.getAttribute("data-theme") === "dark"),
  );
  useEffect(() => {
    const obs = new MutationObserver(() =>
      setIsDark(
        document.documentElement.classList.contains("dark") ||
          document.documentElement.getAttribute("data-theme") === "dark",
      ),
    );
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });
    return () => obs.disconnect();
  }, []);
  const t = isDark ? T.dark : T.light;

  // ── JWT helpers (unchanged) ──
  const getEmailFromToken = () => {
    try {
      const token = localStorage.getItem("lms_token");
      if (!token) return null;
      const payload = JSON.parse(
        atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
      );
      return payload.sub ?? payload.email ?? payload.username ?? null;
    } catch {
      return null;
    }
  };

  const getBatchIdFromToken = () => {
    try {
      const token = localStorage.getItem("lms_token");
      if (!token) return null;
      const payload = JSON.parse(
        atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
      );
      return payload.batchId ?? payload.batch_id ?? payload.batchid ?? null;
    } catch {
      return null;
    }
  };

  // ── load() is 100% unchanged from the original — no logic edits ──
  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      // ── 1. Resolve email ──
      const email =
        getEmailFromToken() ??
        localStorage.getItem("lms_email") ??
        localStorage.getItem("userEmail") ??
        null;

      if (!email) {
        setError("Could not find your email. Please log out and log in again.");
        setLoading(false);
        return;
      }

      // ── 2. Resolve batchId ──
      let batchId =
        getBatchIdFromToken() ?? localStorage.getItem("lms_batch_id") ?? null;

      if (!batchId) {
        try {
          const { getStudentClassroom } =
            await import("../services/batchService");
          const classRes = await getStudentClassroom();
          const classData = classRes?.data ?? classRes;
          batchId =
            classData?.batchId ?? classData?.id ?? classData?.batch_id ?? null;
        } catch (classErr) {
          console.warn(
            "getStudentClassroom failed:",
            classErr?.response?.status,
            classErr?.message,
          );
        }
      }

      if (!batchId) {
        setError(
          "Could not resolve your batch ID. Please make sure you are assigned to a batch.",
        );
        setLoading(false);
        return;
      }

      // ── 3. SEED first so data always exists ──
      try {
        await progressService.seedSkillScores();
      } catch (seedErr) {
        console.warn("Seed attempt:", seedErr?.message);
      }

      // ── 4. Fetch skill map ──
      const res = await progressService.getStudentSkillMap(email, batchId);
      const data = res.data;

      // ── 5. Normalise skill shape ──
      const normalised = (data.skills ?? []).map((s, idx) => ({
        id: s.id ?? idx + 1,
        name: s.skillName ?? s.name ?? "Unknown Skill",
        score: Math.round(s.overallScore ?? s.score ?? 0),
        quizScore: Math.round(s.quizScore ?? 0),
        assignmentScore: Math.round(s.assignmentScore ?? 0),
        videoScore: Math.round(s.videoScore ?? 0),
        overallScore: Math.round(s.overallScore ?? s.score ?? 0),
        isWeak: s.weak ?? s.isWeak ?? Math.round(s.overallScore ?? 0) < 50,
        isStrong:
          s.strong ?? s.isStrong ?? Math.round(s.overallScore ?? 0) >= 70,
        level:
          s.level ??
          ((s.overallScore ?? 0) >= 70
            ? "Advanced"
            : (s.overallScore ?? 0) >= 40
              ? "Intermediate"
              : "Beginner"),
        updatedAt: s.updatedAt,
      }));

      setSkills(normalised);
      setSummaryStats({
        avgScore: Math.round(data.avgScore ?? 0),
        strongCount: data.strongCount ?? 0,
        weakCount: data.weakCount ?? 0,
        totalSkills: data.totalSkills ?? normalised.length,
      });
    } catch (e) {
      console.error("SkillMap fetch error:", e);
      if (e?.response?.status === 403) {
        setError(
          "Access denied (403). Your session may have expired — please log out and log in again.",
        );
      } else if (e?.response?.status === 401) {
        setError("Session expired. Please log in again.");
      } else {
        setError("Failed to load skill data. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const weakSkills = skills.filter((s) => s.isWeak);
  const strongSkills = skills.filter((s) => s.isStrong);

  const handleResumeAdd = (skillName) => {
    setResumeToast(`"${skillName}" added to resume!`);
    setTimeout(() => setResumeToast(null), 3000);
  };

  // Summary stat cards now feed the shared <StatCard/> component,
  // same shape as the `stats` array in DashboardPage.jsx.
  const stats = [
    {
      label: "Avg. Score",
      numericValue: summaryStats.avgScore,
      isPercent: true,
      change: `${summaryStats.totalSkills} skills tracked`,
      trend: "up",
      icon: BarChart2,
      colorKey: "purple",
    },
    {
      label: "Strong Skills",
      numericValue: summaryStats.strongCount,
      change: "performing well",
      trend: "up",
      icon: Trophy,
      colorKey: "green",
    },
    {
      label: "Weak Areas",
      numericValue: summaryStats.weakCount,
      change: summaryStats.weakCount > 0 ? "needs attention" : "none weak",
      trend: summaryStats.weakCount > 0 ? "down" : "up",
      icon: AlertTriangle,
      colorKey: "orange",
    },
    {
      label: "Total Skills",
      numericValue: summaryStats.totalSkills,
      change: "in your map",
      trend: "up",
      icon: Brain,
      colorKey: "blue",
    },
  ];

  /* ── Scoped responsive rules for the page-specific grids ──
     Everything shell-level (max width, gutters, base breakpoints) is
     already handled by <PageContainer/>, same as Dashboard. These
     rules only cover the two layouts unique to SkillMap: the
     radar+weak-areas split row, and the roadmap tab stack. Breakpoints
     mirror common device widths (Mac/laptop, iPad, iPad Mini, tablet,
     large phone, iPhone/Pixel). */
  const responsiveStyle = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
    @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
    @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    .sfade { animation: fadeUp 0.4s ease both; }

    .skillmap-hero-flex {
      display: flex; align-items: center; justify-content: space-between;
      flex-wrap: wrap; gap: 16px;
    }
    .skillmap-hero-badges { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }

    .skillmap-split-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
    }
    .skillmap-cards-grid {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 14px;
    }
    .skillmap-tabs { display: flex; gap: 8px; flex-wrap: wrap; }

    /* Laptop / small desktop */
    @media (max-width: 1200px) {
      .skillmap-split-grid { gap: 14px; }
    }

    /* iPad landscape / small laptop */
    @media (max-width: 1024px) {
      .skillmap-split-grid { grid-template-columns: 1fr; }
    }

    /* iPad Mini / iPad portrait / tablets */
    @media (max-width: 834px) {
      .skillmap-cards-grid { grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); }
    }

    /* Tablet / large phone */
    @media (max-width: 768px) {
      .skillmap-hero-badges { width: 100%; justify-content: flex-start; }
    }

    /* Phones — iPhone, Pixel, small Android */
    @media (max-width: 480px) {
      .skillmap-cards-grid { grid-template-columns: 1fr; }
      .skillmap-tabs button { flex: 1 1 auto; text-align: center; }
    }
  `;

  if (loading)
    return (
      <div
        style={{
          minHeight: "100vh",
          background: t.pageBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <style>{responsiveStyle}</style>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: "rgba(124,58,237,0.1)",
              border: "1px solid rgba(124,58,237,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "spin 1s linear infinite",
            }}
          >
            <Brain size={22} color={BRAND} />
          </div>
          <p
            style={{
              fontSize: 13,
              color: t.textMuted,
              fontFamily: FONT_FAMILY,
            }}
          >
            Analyzing your skills…
          </p>
        </div>
      </div>
    );

  if (error)
    return (
      <div
        style={{
          minHeight: "100vh",
          background: t.pageBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: FONT_FAMILY,
          padding: 20,
        }}
      >
        <style>{responsiveStyle}</style>
        <div
          style={{
            textAlign: "center",
            background: t.cardBg,
            border: `1px solid ${t.border}`,
            borderRadius: 20,
            padding: "40px 32px",
            maxWidth: 420,
            boxShadow: t.shadow,
          }}
        >
          <AlertTriangle
            size={32}
            color="#f87171"
            style={{ display: "block", margin: "0 auto 12px" }}
          />
          <p
            style={{
              fontSize: 13,
              color: t.text,
              fontWeight: FONT_WEIGHT.bold,
              margin: "0 0 8px",
            }}
          >
            Something went wrong
          </p>
          <p style={{ fontSize: 12, color: t.textMuted, margin: "0 0 20px" }}>
            {error}
          </p>
          <button
            onClick={load}
            style={{
              padding: "9px 22px",
              borderRadius: 10,
              background: "rgba(124,58,237,0.1)",
              border: "1px solid rgba(124,58,237,0.3)",
              color: BRAND,
              fontSize: 12,
              fontWeight: FONT_WEIGHT.semibold,
              cursor: "pointer",
              fontFamily: FONT_FAMILY,
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );

  return (
    <PageContainer mode={isDark ? "dark" : "light"} pageBg={t.pageBg} textColor={t.text}>
      <style>{responsiveStyle}</style>

      {resumeToast && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#1e293b",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: 12,
            fontSize: 12,
            fontWeight: FONT_WEIGHT.semibold,
            fontFamily: FONT_FAMILY,
            boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
            border: "1px solid rgba(255,255,255,0.08)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Star size={13} color="#fbbf24" fill="#fbbf24" /> {resumeToast}
        </div>
      )}

      {/* ═══ HERO — same pattern as DashboardPage.jsx ═══ */}
      <div
        className="dfade"
        style={{
          padding: "8px 0 24px",
          background: "transparent",
          border: "none",
          borderBottom: `1px solid ${t.borderHero}`,
          marginBottom: 20,
          boxShadow: "none",
        }}
      >
        <div className="skillmap-hero-flex">
          {/* Left */}
          <div>
            <button
              onClick={() => navigate("/student")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 11,
                fontWeight: FONT_WEIGHT.semibold,
                color: t.textMuted,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontFamily: FONT_FAMILY,
                marginBottom: 12,
                padding: 0,
              }}
            >
              <ArrowLeft size={13} /> Back to Dashboard
            </button>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 8,
              }}
            >
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: BRAND }} />
              <span
                style={{
                  fontSize: FONT_SIZE.eyebrow,
                  fontWeight: FONT_WEIGHT.bold,
                  letterSpacing: LETTER_SPACING.eyebrowWide,
                  textTransform: "uppercase",
                  color: t.textSub,
                  fontFamily: FONT_FAMILY,
                }}
              >
                Skill Intelligence
              </span>
            </div>
            <h1
              style={{
                fontFamily: FONT_FAMILY,
                fontWeight: FONT_WEIGHT.heroTitle,
                fontSize: FONT_SIZE.heroTitle,
                color: "#3B82F6",
                margin: "0 0 6px",
                lineHeight: LINE_HEIGHT.heroTitle,
                letterSpacing: LETTER_SPACING.heroTitle,
              }}
            >
              Skill Map
            </h1>
            <p
              style={{
                fontSize: FONT_SIZE.bodySmall,
                color: t.textSub,
                margin: 0,
                fontWeight: FONT_WEIGHT.medium,
                fontFamily: FONT_FAMILY,
              }}
            >
              Your personalized skill analysis &amp; career roadmap
            </p>
            <div className="skillmap-tabs" style={{ marginTop: 14 }}>
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: "6px 16px",
                    borderRadius: 10,
                    fontSize: 11,
                    fontWeight: FONT_WEIGHT.semibold,
                    cursor: "pointer",
                    fontFamily: FONT_FAMILY,
                    textTransform: "capitalize",
                    transition: "all 0.2s",
                    border: `1px solid ${activeTab === tab ? "rgba(124,58,237,0.5)" : t.borderHov}`,
                    background: activeTab === tab ? "rgba(124,58,237,0.1)" : t.actBg,
                    color: activeTab === tab ? BRAND : t.textSub,
                  }}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Right: badges */}
          <div className="skillmap-hero-badges">
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
                fontWeight: FONT_WEIGHT.semibold,
                fontFamily: FONT_FAMILY,
                color: t.textSub,
              }}
            >
              <span>{summaryStats.totalSkills} skills</span>
              <span style={{ width: 1, height: 14, background: t.actBorder }} />
              <span style={{ color: "#34d399" }}>{summaryStats.strongCount} strong</span>
              <span style={{ width: 1, height: 14, background: t.actBorder }} />
              {summaryStats.weakCount > 0 ? (
                <span style={{ color: "#f87171" }}>{summaryStats.weakCount} weak</span>
              ) : (
                <span style={{ color: "#34d399" }}>None weak ✓</span>
              )}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: t.actBg,
                border: `1px solid ${t.actBorder}`,
                borderRadius: 10,
                padding: "8px 12px",
              }}
            >
              <Activity size={12} color={t.actIcon} />
              <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 14 }}>
                <span style={{ width: 3, height: 10, borderRadius: 2, background: t.actBar, display: "block" }} />
                <span style={{ width: 3, height: 14, borderRadius: 2, background: t.actBar, display: "block" }} />
                <span style={{ width: 3, height: 7, borderRadius: 2, background: t.actBar, display: "block" }} />
              </div>
            </div>

            <button
              onClick={load}
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: t.actBg,
                border: `1px solid ${t.actBorder}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: t.textMuted,
              }}
            >
              <RefreshCw size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* ═══ SUMMARY STAT CARDS — shared StatCard component ═══ */}
      <div className="stat-grid" style={{ marginBottom: 20 }}>
        {stats.map((s, i) => (
          <StatCard key={i} stat={s} index={i} loading={loading} />
        ))}
      </div>

      {/* ═══ TAB CONTENT ═══ */}
      {activeTab === "overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="skillmap-split-grid">
            <SkillRadarChart skills={skills} t={t} />
            <WeakSkillsSection weakSkills={weakSkills} t={t} />
          </div>
          <CareerRoadmap skills={skills} t={t} />
          <div>
            <p
              style={{
                fontSize: 13,
                fontWeight: FONT_WEIGHT.bold,
                color: t.text,
                margin: "0 0 14px",
                fontFamily: FONT_FAMILY,
              }}
            >
              Top Skills
            </p>
            <div className="skillmap-cards-grid">
              {[...skills]
                .sort((a, b) => b.score - a.score)
                .slice(0, 3)
                .map((skill) => (
                  <SkillCard
                    key={skill.id}
                    skill={skill}
                    t={t}
                    onResumeAdd={handleResumeAdd}
                  />
                ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "all skills" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <p style={{ fontSize: 12, color: t.textMuted, margin: 0, fontFamily: FONT_FAMILY }}>
            Showing <strong style={{ color: t.text }}>{skills.length}</strong> skills tracked
          </p>
          <div className="skillmap-cards-grid">
            {[...skills]
              .sort((a, b) => b.score - a.score)
              .map((skill) => (
                <SkillCard
                  key={skill.id}
                  skill={skill}
                  t={t}
                  onResumeAdd={handleResumeAdd}
                />
              ))}
          </div>
        </div>
      )}

      {activeTab === "weak areas" && (
        <WeakSkillsSection weakSkills={weakSkills} t={t} />
      )}

      {activeTab === "roadmap" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <CareerRoadmap skills={skills} t={t} />
          <SkillRadarChart skills={skills} t={t} />
        </div>
      )}
    </PageContainer>
  );
};

export default SkillMap;