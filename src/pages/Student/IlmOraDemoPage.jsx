// import { GoogleOAuthProvider } from "@react-oauth/google";
// import { useEffect, useState, useRef, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { GoogleLogin } from "@react-oauth/google";
// import { jwtDecode } from "jwt-decode";
// import auth from "../../auth";
// import ProfileDetailsForm from "../common/ProfileDetailsForm";
// import CompleteProfile from "../common/CompleteProfile";
// import {
//   BookOpen,
//   FileText,
//   Radio,
//   Award,
//   FileUser,
//   Map,
//   BarChart2,
//   CalendarCheck,
//   Video,
//   Bot,
//   NotebookPen,
//   MessageCircleQuestion,
//   Users,
//   CheckSquare,
//   ClipboardList,
//   TrendingUp,
//   Upload,
//   Cpu,
//   PenTool,
//   BarChart,
//   Film,
//   Layers,
//   Landmark,
//   LayoutDashboard,
//   UserCog,
//   PieChart,
//   FileBarChart,
//   Handshake,
//   UserCheck,
//   Building2,
//   Library,
//   GitBranch,
//   Tag,
//   ServerCog,
//   MonitorPlay,
//   Briefcase,
//   Globe,
//   DollarSign,
//   Megaphone,
//   Target,
//   Settings,
//   Sun,
//   Moon,
//   LayoutDashboard as DashboardIcon,
//   AlertCircle,
// } from "lucide-react";

// gsap.registerPlugin(ScrollTrigger);

// const GOOGLE_CLIENT_ID =
//   "572421778240-akk3kkb4f60ukuv9pcfrpg2ielm09thk.apps.googleusercontent.com";

// /* ─── TypeWriter ─────────────────────────────────────────────────────────── */
// function TypeWriter({
//   texts = [],
//   typingSpeed = 75,
//   deletingSpeed = 50,
//   pauseDuration = 1500,
//   showCursor = true,
//   cursorCharacter = "_",
//   cursorBlinkDuration = 0.5,
//   variableSpeedEnabled = false,
//   variableSpeedMin = 60,
//   variableSpeedMax = 120,
//   className = "",
// }) {
//   const [displayed, setDisplayed] = useState("");
//   const [phase, setPhase] = useState("typing");
//   const [index, setIndex] = useState(0);
//   const [charPos, setCharPos] = useState(0);
//   const [cursorVisible, setCursorVisible] = useState(true);

//   const getSpeed = useCallback(
//     (base) =>
//       variableSpeedEnabled
//         ? Math.random() * (variableSpeedMax - variableSpeedMin) +
//           variableSpeedMin
//         : base,
//     [variableSpeedEnabled, variableSpeedMin, variableSpeedMax],
//   );

//   useEffect(() => {
//     if (!showCursor) return;
//     const id = setInterval(
//       () => setCursorVisible((v) => !v),
//       cursorBlinkDuration * 1000,
//     );
//     return () => clearInterval(id);
//   }, [showCursor, cursorBlinkDuration]);

//   useEffect(() => {
//     if (!texts.length) return;
//     const current = texts[index % texts.length];
//     if (phase === "typing") {
//       if (charPos < current.length) {
//         const t = setTimeout(() => {
//           setDisplayed(current.slice(0, charPos + 1));
//           setCharPos((p) => p + 1);
//         }, getSpeed(typingSpeed));
//         return () => clearTimeout(t);
//       } else {
//         const t = setTimeout(() => setPhase("deleting"), pauseDuration);
//         return () => clearTimeout(t);
//       }
//     }
//     if (phase === "deleting") {
//       if (charPos > 0) {
//         const t = setTimeout(() => {
//           setDisplayed(current.slice(0, charPos - 1));
//           setCharPos((p) => p - 1);
//         }, getSpeed(deletingSpeed));
//         return () => clearTimeout(t);
//       } else {
//         setIndex((i) => (i + 1) % texts.length);
//         setPhase("typing");
//       }
//     }
//   }, [
//     phase,
//     charPos,
//     index,
//     texts,
//     typingSpeed,
//     deletingSpeed,
//     pauseDuration,
//     getSpeed,
//   ]);

//   return (
//     <span className={className} aria-live="polite">
//       {displayed}
//       {showCursor && (
//         <span
//           style={{ opacity: cursorVisible ? 1 : 0, transition: "opacity 0.1s" }}
//           aria-hidden="true"
//         >
//           {cursorCharacter}
//         </span>
//       )}
//     </span>
//   );
// }

// /* ─── LOGIN MODAL ────────────────────────────────────────────────────────── */
// function LoginModal({ onClose, onGoogleSuccess }) {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   // BUG FIX: redirectByRole now correctly handles all role mappings
//   const redirectByRole = (role) => {
//     onClose();
//     const r = (role || "").toUpperCase();
//     switch (r) {
//       case "SUPER_ADMIN":
//         navigate("/superadmin", { replace: true });
//         break;
//       case "ADMIN":
//       case "TENANT_ADMIN":
//       case "BUSINESS":
//         navigate("/admin", { replace: true });
//         break;
//       case "TRAINER":
//         navigate("/trainer", { replace: true });
//         break;
//       default:
//         navigate("/student", { replace: true });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (loading) return;
//     setLoading(true);
//     try {
//       const ok = await auth.login({ email, password });
//       if (ok) {
//         const role = (auth.getCurrentRole() || "STUDENT").toUpperCase();
//         localStorage.setItem("role", role);
//         // BUG FIX: seed lms_user for email/password logins — was missing profileCompleted
//         localStorage.setItem(
//           "lms_user",
//           JSON.stringify({
//             email,
//             role: ["TENANT_ADMIN", "ADMIN", "BUSINESS"].includes(role)
//               ? "admin"
//               : role.toLowerCase(),
//             profileCompleted: false,
//             isGoogleUser: false,
//           }),
//         );
//         redirectByRole(role);
//       } else {
//         alert("Login failed! Check your credentials.");
//       }
//     } catch (err) {
//       alert("Login error: " + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoogleSuccess = async (res) => {
//     try {
//       // Clean slate before processing
//       localStorage.removeItem("lms_token");
//       localStorage.removeItem("lms_user");
//       localStorage.removeItem("role");

//       const dec = jwtDecode(res.credential);
//       const check = await auth.checkGoogleUser({ idToken: res.credential });

//       if (check.isNewUser === false && check.token && check.role) {
//         // Existing Google user — log them straight in
//         const role = check.role.toUpperCase();
//         localStorage.setItem("lms_token", check.token);
//         localStorage.setItem("role", role);
//         if (check.organizationId)
//           localStorage.setItem("organizationId", check.organizationId);
//         else localStorage.removeItem("organizationId");
//         localStorage.setItem(
//           "lms_user",
//           JSON.stringify({
//             name: check.name || dec.name,
//             email: check.email || dec.email,
//             role: ["TENANT_ADMIN", "ADMIN", "BUSINESS"].includes(role)
//               ? "admin"
//               : role.toLowerCase(),
//             isGoogleUser: true,
//             profileCompleted: !!check.profileCompleted,
//             organizationId: check.organizationId || null,
//           }),
//         );
//         onClose();
//         redirectByRole(role);
//         return;
//       }

//       // New Google user — clear and send to CompleteProfile flow
//       localStorage.removeItem("lms_token");
//       localStorage.removeItem("lms_user");
//       localStorage.removeItem("role");
//       sessionStorage.setItem("ilmora_google_credential", res.credential);
//       onClose();
//       onGoogleSuccess &&
//         onGoogleSuccess({
//           name: dec.name,
//           email: dec.email,
//           googleCredential: res.credential,
//         });
//     } catch (err) {
//       // Fallback: still route new user to CompleteProfile
//       try {
//         const dec = jwtDecode(res.credential);
//         localStorage.removeItem("lms_token");
//         localStorage.removeItem("lms_user");
//         localStorage.removeItem("role");
//         sessionStorage.setItem("ilmora_google_credential", res.credential);
//         onClose();
//         onGoogleSuccess &&
//           onGoogleSuccess({
//             name: dec.name,
//             email: dec.email,
//             googleCredential: res.credential,
//           });
//       } catch (_) {
//         alert("Google login failed. Please try again.");
//       }
//     }
//   };

//   const EyeOpen = () => (
//     <svg
//       width="17"
//       height="17"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
//       <circle cx="12" cy="12" r="3" />
//     </svg>
//   );
//   const EyeOff = () => (
//     <svg
//       width="17"
//       height="17"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
//       <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
//       <line x1="1" y1="1" x2="23" y2="23" />
//     </svg>
//   );

//   return (
//     <div
//       className="lm-overlay"
//       onClick={(e) => e.target === e.currentTarget && onClose()}
//     >
//       <div className="lm-box">
//         <button className="lm-close" onClick={onClose} aria-label="Close">
//           ✕
//         </button>
//         <div className="lm-logo" onClick={onClose}>
//           <span style={{ color: "#16a34a" }}>ILM</span>
//           <span style={{ color: "#F97316" }}>ORA</span>
//         </div>
//         <div className="lm-heading">
//           <h2>Welcome back!</h2>
//           <p>
//             Don't have an account?{" "}
//             <button
//               onClick={() => {
//                 onClose();
//                 navigate("/complete-profile");
//               }}
//             >
//               Apply now
//             </button>
//           </p>
//         </div>
//         <div className="lm-google-wrap">
//           <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
//             <GoogleLogin
//               onSuccess={handleGoogleSuccess}
//               onError={() => console.error("Google OAuth failed")}
//               theme="outline"
//               size="large"
//               text="continue_with"
//               shape="rectangular"
//               width="372"
//               auto_select={false}
//               cancel_on_tap_outside={true}
//             />
//           </GoogleOAuthProvider>
//         </div>
//         <div className="lm-or">
//           <div className="lm-or-line" />
//           <span className="lm-or-text">OR</span>
//           <div className="lm-or-line" />
//         </div>
//         <form onSubmit={handleSubmit}>
//           <div className="lm-field">
//             <label>Email</label>
//             <input
//               type="email"
//               placeholder="Enter your email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               disabled={loading}
//             />
//           </div>
//           <div className="lm-field">
//             <label>Password</label>
//             <div className="lm-pw-wrap">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Enter your password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 disabled={loading}
//               />
//               <button
//                 type="button"
//                 className="lm-eye"
//                 onClick={() => setShowPassword((p) => !p)}
//                 tabIndex={-1}
//               >
//                 {showPassword ? <EyeOff /> : <EyeOpen />}
//               </button>
//             </div>
//           </div>
//           <div className="lm-forgot">
//             <button
//               type="button"
//               onClick={() => {
//                 onClose();
//                 navigate("/forgot-password");
//               }}
//             >
//               Forgot password?
//             </button>
//           </div>
//           <button type="submit" className="lm-submit" disabled={loading}>
//             {loading ? (
//               <>
//                 <span className="lm-spinner" />
//                 Signing in…
//               </>
//             ) : (
//               "Log in"
//             )}
//           </button>
//         </form>
//         <div className="lm-back-home">
//           <button
//             onClick={() => {
//               onClose();
//               navigate("/");
//             }}
//           >
//             ← Back to home
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ─── DASHBOARD GATE MODAL ───────────────────────────────────────────────── */
// function DashboardGateModal({
//   onClose,
//   reason,
//   onUpdateProfile,
//   onChoosePlan,
// }) {
//   return (
//     <div
//       className="lm-overlay"
//       onClick={(e) => e.target === e.currentTarget && onClose()}
//     >
//       <div className="lm-box" style={{ maxWidth: 400, textAlign: "center" }}>
//         <button className="lm-close" onClick={onClose} aria-label="Close">
//           ✕
//         </button>
//         <div
//           style={{
//             width: 56,
//             height: 56,
//             borderRadius: "50%",
//             background: "rgba(249,115,22,0.1)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             margin: "0 auto 16px",
//           }}
//         >
//           <AlertCircle size={28} color="#F97316" strokeWidth={2} />
//         </div>
//         <h2
//           style={{
//             fontSize: "1.15rem",
//             fontWeight: 800,
//             color: "#1e0e02",
//             marginBottom: 8,
//             fontFamily: "'Playfair Display',serif",
//           }}
//         >
//           One more step before your dashboard
//         </h2>
//         <p
//           style={{
//             fontSize: "0.86rem",
//             color: "#8a6040",
//             marginBottom: 24,
//             lineHeight: 1.6,
//           }}
//         >
//           {reason === "profile"
//             ? "Please complete your profile details first so we can personalize your dashboard."
//             : "Please choose a plan to unlock your dashboard."}
//         </p>
//         <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
//           {/* BUG FIX: "Complete Profile" button — always clickable when reason === "profile" */}
//           <button
//             onClick={onUpdateProfile}
//             style={{
//               width: "100%",
//               padding: "12px",
//               borderRadius: 10,
//               fontSize: "0.88rem",
//               fontWeight: 700,
//               cursor: reason === "profile" ? "pointer" : "not-allowed",
//               background:
//                 reason === "profile"
//                   ? "linear-gradient(135deg,#F97316,#ea580c)"
//                   : "#f1f5f9",
//               color: reason === "profile" ? "#fff" : "#94a3b8",
//               border: "none",
//               fontFamily: "'DM Sans',sans-serif",
//               boxShadow:
//                 reason === "profile"
//                   ? "0 4px 14px rgba(249,115,22,0.3)"
//                   : "none",
//               opacity: reason === "profile" ? 1 : 0.5,
//             }}
//           >
//             Complete Profile →
//           </button>
//           {/* BUG FIX: "Choose Plan" button — always clickable when reason === "plan" */}
//           <button
//             onClick={onChoosePlan}
//             style={{
//               width: "100%",
//               padding: "12px",
//               borderRadius: 10,
//               fontSize: "0.88rem",
//               fontWeight: 700,
//               cursor: reason === "plan" ? "pointer" : "not-allowed",
//               background: reason === "plan" ? "#1E293B" : "#f1f5f9",
//               color: reason === "plan" ? "#fff" : "#94a3b8",
//               border: "none",
//               fontFamily: "'DM Sans',sans-serif",
//               opacity: reason === "plan" ? 1 : 0.5,
//             }}
//           >
//             Choose Plan →
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ─── Role-based Features with Lucide Icons ─────────────────────────────── */
// const ROLE_CONFIG = {
//   student: {
//     title: "Everything You Need to Learn",
//     features: [
//       {
//         Icon: BookOpen,
//         name: "My Courses",
//         desc: "Access all enrolled courses, track progress and continue learning right where you left off.",
//         route: "/student/my-courses",
//         badge: "Popular",
//       },
//       {
//         Icon: FileText,
//         name: "Assignments",
//         desc: "View, submit and track your assignments with instructor feedback and deadlines.",
//         route: "/student/assignments",
//       },
//       {
//         Icon: Radio,
//         name: "Live Classes",
//         desc: "Join live interactive sessions with trainers in real time. Ask questions, collaborate.",
//         route: "/student/live-classes",
//       },
//       {
//         Icon: Award,
//         name: "Certificates",
//         desc: "Download and share your completion certificates to boost your LinkedIn profile.",
//         route: "/student/certificates",
//         badge: "Hot",
//       },
//       {
//         Icon: FileUser,
//         name: "Resume Builder",
//         desc: "Build an AI-powered resume showcasing your skills, courses and certifications.",
//         route: "/student/resume-builder",
//       },
//       {
//         Icon: Map,
//         name: "Skill Map",
//         desc: "Visualise your entire skill journey, gaps and recommended learning paths on one map.",
//         route: "/student/skill-map",
//       },
//       {
//         Icon: BarChart2,
//         name: "Assessments",
//         desc: "Test your knowledge with quizzes and auto-graded assessments mapped to each course module.",
//         route: "/student/assessments",
//       },
//       {
//         Icon: CalendarCheck,
//         name: "Attendance",
//         desc: "View your class attendance records and keep track of sessions attended.",
//         route: "/student/attendance",
//       },
//       {
//         Icon: Video,
//         name: "Recorded Classes",
//         desc: "Rewatch any live class recording at your own pace whenever you need.",
//         route: "/student/recorded-classes",
//       },
//       {
//         Icon: Bot,
//         name: "AI Companion",
//         desc: "Your personal AI tutor — ask questions, get explanations and study smarter 24/7.",
//         route: "/student/ai-companion",
//         badge: "AI",
//       },
//       {
//         Icon: NotebookPen,
//         name: "Notebook",
//         desc: "Take notes directly inside courses and sync them for review later.",
//         route: "/student/notebook",
//       },
//       {
//         Icon: MessageCircleQuestion,
//         name: "Doubts",
//         desc: "Raise doubts and get answers from trainers and peers — never get stuck again.",
//         route: "/student/doubts",
//       },
//     ],
//   },
//   trainer: {
//     title: "Everything You Need to Teach",
//     features: [
//       {
//         Icon: Users,
//         name: "Batch Management",
//         desc: "Create and manage student batches, assign courses and track overall batch performance.",
//         route: "/trainer/batches",
//         badge: "Core",
//       },
//       {
//         Icon: CalendarCheck,
//         name: "Attendance",
//         desc: "Mark and monitor student attendance across all your live sessions and classes.",
//         route: "/trainer/attendance",
//       },
//       {
//         Icon: ClipboardList,
//         name: "Assignment Mgmt",
//         desc: "Create assignments, set deadlines, review submissions and give detailed feedback.",
//         route: "/trainer/assignments",
//       },
//       {
//         Icon: Radio,
//         name: "Live Sessions",
//         desc: "Start and manage live interactive classes with students using built-in tools.",
//         route: "/trainer/live-session",
//         badge: "Live",
//       },
//       {
//         Icon: TrendingUp,
//         name: "Reports",
//         desc: "Detailed performance reports for individual students and entire batches.",
//         route: "/trainer/reports",
//       },
//       {
//         Icon: Upload,
//         name: "Upload Content",
//         desc: "Upload videos, documents and course materials for students to access anytime.",
//         route: "/trainer/upload-content",
//       },
//       {
//         Icon: Bot,
//         name: "AI Companion",
//         desc: "Use AI to auto-generate course content, quiz questions and learning plans.",
//         route: "/trainer/ai-companion",
//         badge: "AI",
//       },
//       {
//         Icon: FileText,
//         name: "Assessments",
//         desc: "Build quizzes and assessments to evaluate student knowledge at every milestone.",
//         route: "/trainer/assessments",
//       },
//       {
//         Icon: Film,
//         name: "Recorded Classes",
//         desc: "Manage your library of recorded class sessions for student replay.",
//         route: "/trainer/recorded-classes",
//       },
//       {
//         Icon: BarChart2,
//         name: "Performance",
//         desc: "Deep-dive analytics on student engagement, completion rates and skill scores.",
//         route: "/trainer/performance-analysis",
//       },
//       {
//         Icon: Map,
//         name: "Skill Map",
//         desc: "Design skill maps to guide students from beginner to expert in your domain.",
//         route: "/trainer/skill-map",
//       },
//       {
//         Icon: Layers,
//         name: "Classroom",
//         desc: "Manage your virtual classroom: materials, tools, whiteboard and student roster.",
//         route: "/trainer/classroom",
//       },
//     ],
//   },
//   business: {
//     title: "Everything You Need to Manage",
//     features: [
//       {
//         Icon: LayoutDashboard,
//         name: "Org Dashboard",
//         desc: "Bird's-eye view of your entire organisation's learning activity and KPIs.",
//         route: "/admin/dashboard",
//         badge: "Core",
//       },
//       {
//         Icon: UserCog,
//         name: "Team Management",
//         desc: "Add employees, assign roles, manage departments and track team-level progress.",
//         route: "/admin/users",
//       },
//       {
//         Icon: PieChart,
//         name: "Analytics",
//         desc: "Advanced analytics on course completion, skill development and ROI of training spend.",
//         route: "/admin/reports",
//         badge: "New",
//       },
//       {
//         Icon: FileBarChart,
//         name: "Reports",
//         desc: "Export detailed reports on individual and team performance for leadership reviews.",
//         route: "/admin/org-reports",
//       },
//       {
//         Icon: Handshake,
//         name: "Partnership Programs",
//         desc: "Set up partnership programs, co-branded batches and joint certification programs.",
//         route: "/admin/org-settings",
//       },
//       {
//         Icon: UserCheck,
//         name: "Employee Progress",
//         desc: "Track every employee's learning journey, skill gaps and upcoming milestones.",
//         route: "/admin/students",
//       },
//       {
//         Icon: Building2,
//         name: "Manage Batches",
//         desc: "Create bulk batches, assign trainers and enroll employees in one click.",
//         route: "/admin/batches",
//       },
//       {
//         Icon: Library,
//         name: "All Courses",
//         desc: "Browse and assign from the full ILM ORA course catalog to your team.",
//         route: "/admin/all-courses",
//       },
//       {
//         Icon: GitBranch,
//         name: "Branches",
//         desc: "Manage multiple office locations or departments as separate branches.",
//         route: "/admin/branches",
//       },
//       {
//         Icon: Tag,
//         name: "Categories",
//         desc: "Organise courses and skills into categories aligned with your business needs.",
//         route: "/admin/categories",
//       },
//       {
//         Icon: ServerCog,
//         name: "File Management",
//         desc: "Centralised file library for all training materials across your organisation.",
//         route: "/admin/file-list",
//       },
//       {
//         Icon: MonitorPlay,
//         name: "Live Sessions",
//         desc: "Schedule and monitor company-wide live training sessions and webinars.",
//         route: "/admin/live-sessions",
//       },
//     ],
//   },
//   partnership: {
//     title: "Everything You Need to Grow",
//     features: [
//       {
//         Icon: Handshake,
//         name: "Partnership Programs",
//         desc: "Create and manage co-branded partnership programs with academic and corporate partners.",
//         route: "/partnership/programs",
//         badge: "Core",
//       },
//       {
//         Icon: Users,
//         name: "Lead Management",
//         desc: "Track and convert partnership leads through a dedicated pipeline built for growth teams.",
//         route: "/partnership/leads",
//       },
//       {
//         Icon: BookOpen,
//         name: "Co-Branded Courses",
//         desc: "Launch and manage co-branded courses jointly created with partner organisations.",
//         route: "/partnership/co-branded-courses",
//       },
//       {
//         Icon: DollarSign,
//         name: "Revenue Sharing",
//         desc: "Track revenue splits, payouts and earnings across every active partnership in real time.",
//         route: "/partnership/revenue-sharing",
//         badge: "New",
//       },
//       {
//         Icon: BarChart2,
//         name: "Reports",
//         desc: "Detailed performance reports across all partnership programs, leads and channels.",
//         route: "/partnership/reports",
//       },
//       {
//         Icon: Award,
//         name: "Certifications",
//         desc: "Issue and manage co-branded certifications for learners completing partner programs.",
//         route: "/partnership/certifications",
//       },
//     ],
//   },
// };

// const BASE = "https://ilm.ora.texora.ai";

// const STATS = [
//   { value: "500+", label: "Early Learners" },
//   { value: "15+", label: "Expert Mentors" },
//   { value: "20+", label: "Courses Live" },
//   { value: "4.9★", label: "Average Rating" },
// ];

// const TOOLS = [
//   {
//     icon: "texora",
//     desc: "AI-powered platform redefining professional growth, automation and business intelligence at scale.",
//     tags: ["AI Platform", "Flagship"],
//     key: "texora",
//     route: "https://texora.ai/",
//   },
//   {
//     icon: "tora-cx",
//     desc: "Customer experience platform powered by AI. Automate support, boost satisfaction and retain more users.",
//     tags: ["Customer AI", "Free Trial"],
//     key: "tora-cx",
//     route: "https://tora-cx.texora.ai/",
//   },
//   {
//     icon: "crm",
//     desc: "Smart CRM built for modern teams. Track leads, manage pipelines and close deals faster with AI insights.",
//     tags: ["CRM", "Free"],
//     key: "crmorbit",
//     route: "https://crm-orbit.texora.ai/",
//   },
//   {
//     icon: "ilm_ora",
//     desc: "AI-powered learning platform. World-class courses, skill assessments, resume builder & mock interviews.",
//     tags: ["EdTech", "You are here"],
//     key: "ilmora",
//     route: "https://ilm.ora.texora.ai/",
//   },
//   {
//     icon: "taskorbit",
//     desc: "Smarter task & team management. AI nudges, goal tracking and workflow automation in one clean space.",
//     tags: ["Productivity", "Free"],
//     key: "taskorbit",
//     route: "https://task-orbit.texora.ai/",
//   },
//   {
//     icon: "innovara",
//     desc: "Next-gen AI innovation suite. Build, deploy and scale AI solutions for your business effortlessly.",
//     tags: ["AI Builder", "Beta"],
//     key: "innovora",
//     route: "https://texora.ai/innovora-ai",
//   },
// ];

// const BLOG_POSTS = [
//   {
//     cover:
//       "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=700&q=80",
//     title: "How ILM ORA Is Redefining Professional Learning in 2026",
//     cat: "Platform Updates",
//     date: "Mar 26, 2026",
//     reads: 4,
//     featured: true,
//     excerpt:
//       "From AI-powered skill scores to real-time mentor sessions — here's how ILM ORA is changing the game for working professionals.",
//   },
//   {
//     cover:
//       "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&q=80",
//     title: "Task Orbit: A Smarter Way to Manage Learning Teams",
//     cat: "Product Updates",
//     date: "Mar 23, 2026",
//     reads: 7,
//     excerpt:
//       "Built for team leads and L&D managers who want clarity, automation, and zero friction.",
//   },
//   {
//     cover:
//       "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=80",
//     title: "What Is a Skill Score? And Why It Decides Your Career",
//     cat: "How-To Guides",
//     date: "Mar 23, 2026",
//     reads: 5,
//     excerpt:
//       "Your Skill Score is more than a number — it's a career signal that employers and mentors are watching.",
//   },
//   {
//     cover:
//       "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
//     title: "Why 'Course Sync' Might Be the Missing Piece in Your Growth",
//     cat: "Use Cases",
//     date: "Mar 20, 2026",
//     reads: 3,
//     excerpt:
//       "Synchronising your learning goals with your team calendar sounds simple. The results are anything but.",
//   },
// ];

// const ICON_COLORS = [
//   "#F97316",
//   "#16a34a",
//   "#6366f1",
//   "#ec4899",
//   "#0ea5e9",
//   "#f59e0b",
//   "#10b981",
//   "#8b5cf6",
//   "#ef4444",
//   "#14b8a6",
//   "#f97316",
//   "#3b82f6",
// ];

// /* ─── Main Demo Page ─────────────────────────────────────────────────────── */
// export default function IlmOraDemoPage() {
//   const navigate = useNavigate();
//   const [showLogin, setShowLogin] = useState(false);
//   const [showRolePopup, setShowRolePopup] = useState(false);
//   const [showDashGate, setShowDashGate] = useState(false);
//   const [showProfileForm, setShowProfileForm] = useState(false);
//   const [dashGateReason, setDashGateReason] = useState("profile");

//   const [theme, setTheme] = useState(
//     () => localStorage.getItem("ilmora-theme") || "light",
//   );
//   useEffect(() => {
//     localStorage.setItem("ilmora-theme", theme);
//   }, [theme]);
//   const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

//   const [toast, setToast] = useState({ msg: "", show: false });
//   const toastTimer = useRef(null);
//   const showToast = (msg) => {
//     setToast({ msg, show: true });
//     if (toastTimer.current) clearTimeout(toastTimer.current);
//     toastTimer.current = setTimeout(
//       () => setToast((t) => ({ ...t, show: false })),
//       2200,
//     );
//   };
//   useEffect(
//     () => () => toastTimer.current && clearTimeout(toastTimer.current),
//     [],
//   );

//   const [userMenuOpen, setUserMenuOpen] = useState(false);
//   const userMenuRef = useRef(null);
//   useEffect(() => {
//     const handler = (e) => {
//       if (userMenuRef.current && !userMenuRef.current.contains(e.target))
//         setUserMenuOpen(false);
//     };
//     document.addEventListener("click", handler);
//     return () => document.removeEventListener("click", handler);
//   }, []);

//   const [googleUserInfo, setGoogleUserInfo] = useState(null);
//   useEffect(() => {
//     const token = localStorage.getItem("lms_token");
//     if (token) {
//       sessionStorage.removeItem("ilmora_google_user");
//       sessionStorage.removeItem("ilmora_google_credential");
//       return;
//     }
//     const saved = sessionStorage.getItem("ilmora_google_user");
//     if (saved) {
//       try {
//         setGoogleUserInfo(JSON.parse(saved));
//       } catch (e) {}
//     }
//   }, []);

//   // BUG FIX: Read savedUser fresh each render so updates propagate immediately
//   const getSavedUser = () => {
//     try {
//       return JSON.parse(localStorage.getItem("lms_user") || "{}");
//     } catch {
//       return {};
//     }
//   };

//   const savedUser = getSavedUser();
//   const isLoggedIn = !!localStorage.getItem("lms_token");
//   const userName =
//     savedUser?.name || savedUser?.email?.split("@")[0] || "there";
//   const userEmail = savedUser?.email || "";

//   // BUG FIX: normalizeAppRole — role can arrive in TWO different shapes:
//   //   - localStorage["role"]      → raw backend casing, e.g. "TENANT_ADMIN", "TRAINER", "STUDENT"
//   //   - lms_user.role             → already normalized to "admin" / "trainer" / "student"
//   // The old code did `(localStorage.getItem("role") || savedUser?.role || "student").toLowerCase()`,
//   // which (a) preferred the RAW value over the already-normalized one, and (b) only
//   // lowercased it with no alias handling. So a Manager/Business user whose raw role was
//   // "TENANT_ADMIN" became userRole = "tenant_admin" — which matched NOTHING in the
//   // `userRole === "admin" ? "Manager" : ...` check further down, so they silently fell
//   // through to the Student form. This single normalizer fixes every downstream usage.
//   const normalizeAppRole = (raw) => {
//     const r = (raw || "").toString().trim().toUpperCase();
//     if (["TENANT_ADMIN", "ADMIN", "BUSINESS", "MANAGER"].includes(r))
//       return "admin";
//     if (r === "TRAINER") return "trainer";
//     if (r === "STUDENT") return "student";
//     return "";
//   };

//   const userRole =
//     normalizeAppRole(savedUser?.role) ||
//     normalizeAppRole(localStorage.getItem("role")) ||
//     "student";

//   const userInitial = (userName || "U").trim().charAt(0).toUpperCase();

//   // BUG FIX: featureRoleKey now derives from the already-normalized userRole,
//   // so it no longer needs its own separate alias list (which only partially
//   // matched and was easy to get out of sync with the rest of the page).
//   const featureRoleKey =
//     userRole === "admin"
//       ? "business"
//       : userRole === "trainer"
//         ? "trainer"
//         : "student";

//   // BUG FIX: show CompleteProfile popup for new Google users who arrive without a token
//   useEffect(() => {
//     const token = localStorage.getItem("lms_token");
//     const user = getSavedUser();
//     if (!token && user?.isNewUser === true) setShowRolePopup(true);
//   }, []);

//   const handleRoleSkip = () => {
//     setShowRolePopup(false);
//     setGoogleUserInfo(null);
//   };

//   const handleGoogleNewUser = (googleInfo) => {
//     sessionStorage.setItem(
//       "ilmora_google_credential",
//       googleInfo.googleCredential,
//     );
//     sessionStorage.setItem("ilmora_google_user", JSON.stringify(googleInfo));
//     setGoogleUserInfo(googleInfo);
//     setShowRolePopup(true);
//   };

//   const handleSignOut = () => {
//     localStorage.removeItem("lms_token");
//     localStorage.removeItem("lms_user");
//     localStorage.removeItem("role");
//     localStorage.removeItem("organizationId");
//     localStorage.removeItem("selectedPlan");
//     sessionStorage.removeItem("ilmora_google_user");
//     sessionStorage.removeItem("ilmora_google_credential");
//     setUserMenuOpen(false);
//     showToast("Signed out successfully");
//     navigate("/", { replace: true });
//   };

//   // NOTE: kept for the Products section (d-tool-card) which still navigates on click.
//   const goFeature = (route, name) => {
//     showToast(`Opening ${name}…`);
//     setTimeout(() => window.open(BASE + route, "_blank"), 350);
//   };

//   // BUG FIX: handleGoToDashboard — reads fresh lms_user from storage each time
//   const handleGoToDashboard = () => {
//     setUserMenuOpen(false);
//     const user = getSavedUser();
//     const profileCompleted = !!user?.profileCompleted;
//     const planSelected = !!localStorage.getItem("selectedPlan");

//     if (!profileCompleted) {
//       showToast("Please complete your profile first");
//       setDashGateReason("profile");
//       setShowDashGate(true);
//       return;
//     }
//     if (!planSelected) {
//       showToast("Please choose a plan first");
//       setDashGateReason("plan");
//       setShowDashGate(true);
//       return;
//     }
//     showToast("Opening your dashboard…");
//     const dashRoute = featureRoleKey === "business" ? "admin" : featureRoleKey;
//     setTimeout(() => navigate(`/${dashRoute}`), 350);
//   };

//   // BUG FIX: "Complete Profile" in gate modal opens ProfileDetailsForm, not CompleteProfile
//   const handleDashGateUpdateProfile = () => {
//     setShowDashGate(false);
//     setShowProfileForm(true);
//   };

//   const handleDashGateChoosePlan = () => {
//     setShowDashGate(false);
//     navigate("/pricing?returnTo=/ilm-demo");
//   };

//   // BUG FIX: ProfileDetailsForm onSuccess — re-read lms_user from storage then check plan
//   const handleProfileFormSuccess = () => {
//     setShowProfileForm(false);

//     showToast("Profile saved! Please choose a plan.");

//     navigate("/pricing?returnTo=/ilm-demo");
//   };

//   const scrollToId = (id) => {
//     document
//       .getElementById(id)
//       ?.scrollIntoView({ behavior: "smooth", block: "start" });
//   };

//   const hour = new Date().getHours();
//   const greeting =
//     hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
//   const roleConfig = ROLE_CONFIG[featureRoleKey] || ROLE_CONFIG.student;
//   const isDark = theme === "dark";

//   // GSAP refs
//   const heroRef = useRef(null);
//   const statsRef = useRef(null);
//   const featuresRef = useRef(null);
//   const toolsRef = useRef(null);
//   const blogRef = useRef(null);
//   const ctaRef = useRef(null);

//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
//       tl.fromTo(
//         ".d-hero-greeting",
//         { opacity: 0, y: 20 },
//         { opacity: 1, y: 0, duration: 0.5 },
//       )
//         .fromTo(
//           ".d-hero-name",
//           { opacity: 0, y: 24 },
//           { opacity: 1, y: 0, duration: 0.55 },
//           "-=0.25",
//         )
//         .fromTo(
//           ".d-hero-subtitle",
//           { opacity: 0, y: 16 },
//           { opacity: 1, y: 0, duration: 0.45 },
//           "-=0.2",
//         )
//         .fromTo(
//           ".d-hero-title",
//           { opacity: 0, y: 32 },
//           { opacity: 1, y: 0, duration: 0.6 },
//           "-=0.2",
//         )
//         .fromTo(
//           ".d-hero-typing",
//           { opacity: 0, y: 14 },
//           { opacity: 1, y: 0, duration: 0.45 },
//           "-=0.25",
//         )
//         .fromTo(
//           ".d-hero-btns",
//           { opacity: 0, y: 14 },
//           { opacity: 1, y: 0, duration: 0.4 },
//           "-=0.2",
//         );
//     }, heroRef);
//     return () => ctx.revert();
//   }, []);

//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       gsap.fromTo(
//         ".d-stat",
//         { opacity: 0, y: 30 },
//         {
//           opacity: 1,
//           y: 0,
//           duration: 0.55,
//           stagger: 0.1,
//           ease: "power3.out",
//           scrollTrigger: { trigger: statsRef.current, start: "top 85%" },
//         },
//       );
//     }, statsRef);
//     return () => ctx.revert();
//   }, []);

//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       gsap.fromTo(
//         ".d-feature-card",
//         { opacity: 0, y: 30 },
//         {
//           opacity: 1,
//           y: 0,
//           duration: 0.45,
//           stagger: 0.06,
//           ease: "power3.out",
//           scrollTrigger: { trigger: featuresRef.current, start: "top 85%" },
//         },
//       );
//     }, featuresRef);
//     return () => ctx.revert();
//   }, [featureRoleKey]);

//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       gsap.fromTo(
//         ".d-tool-card",
//         { opacity: 0, y: 40, scale: 0.97 },
//         {
//           opacity: 1,
//           y: 0,
//           scale: 1,
//           duration: 0.5,
//           stagger: 0.08,
//           ease: "power3.out",
//           scrollTrigger: { trigger: toolsRef.current, start: "top 80%" },
//         },
//       );
//     }, toolsRef);
//     return () => ctx.revert();
//   }, []);

//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       gsap.fromTo(
//         ".d-blog-featured,.d-blog-side-card",
//         { opacity: 0, y: 32 },
//         {
//           opacity: 1,
//           y: 0,
//           duration: 0.5,
//           stagger: 0.1,
//           ease: "power3.out",
//           scrollTrigger: { trigger: blogRef.current, start: "top 85%" },
//         },
//       );
//     }, blogRef);
//     return () => ctx.revert();
//   }, []);

//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       gsap.fromTo(
//         ".d-cta",
//         { opacity: 0, y: 40, scale: 0.98 },
//         {
//           opacity: 1,
//           y: 0,
//           scale: 1,
//           duration: 0.6,
//           ease: "power3.out",
//           scrollTrigger: { trigger: ctaRef.current, start: "top 85%" },
//         },
//       );
//     }, ctaRef);
//     return () => ctx.revert();
//   }, []);

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');
//         *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

//         .d-page[data-theme="light"] {
//           --d-green:#16a34a; --d-orange:#F97316; --d-dark:#1E293B; --d-cream:#F6EDE6;
//           --d-white:#fff; --d-gray:#64748b; --d-light:#f1f5f9;
//           --d-bg:#F6EDE6; --d-bg2:#fff; --d-card-bg:#fff; --d-card-border:#e2e8f0;
//           --d-nav-bg:#fff; --d-nav-border:#e5d9c8;
//           --d-text:#1E293B; --d-text-muted:#64748b;
//           --d-stats-bg:#1E293B; --d-stats-text:rgba(255,255,255,.5);
//           --d-footer-bg:#fff; --d-footer-border:#e2e8f0;
//           --d-hero-bg: linear-gradient(135deg,#F6EDE6 0%,#fff 60%,#F6EDE6 100%);
//           --d-hero-title:#1E293B; --d-hero-sub:#64748b; --d-hero-greeting:#94a3b8; --d-hero-name:#1E293B;
//           --d-tab-bg:#fff; --d-tab-border:#e2e8f0; --d-tab-color:#64748b;
//           --d-toggle-bg:#f1f5f9; --d-toggle-border:#e2e8f0; --d-toggle-icon:#F97316;
//           --d-dd-bg:#ffffff; --d-dd-border:#e2e8f0; --d-dd-shadow:0 16px 48px rgba(0,0,0,0.12);
//           --d-dd-header-name:#1E293B; --d-dd-header-email:#64748b; --d-dd-divider:#f1f5f9;
//           --d-dd-item-color:#475569; --d-dd-item-hover-bg:#f8fafc; --d-dd-item-hover-color:#1E293B;
//           --d-dd-upgrade-color:#F97316; --d-dd-upgrade-hover-bg:rgba(249,115,22,0.06);
//           --d-dd-signout-color:#ef4444; --d-dd-signout-hover-bg:rgba(239,68,68,0.06);
//         }
//         .d-page[data-theme="dark"] {
//           --d-green:#22c55e; --d-orange:#fb923c; --d-dark:#f1f5f9; --d-cream:#1e293b;
//           --d-white:#0f172a; --d-gray:#94a3b8; --d-light:#1e293b;
//           --d-bg:#0f172a; --d-bg2:#0f172a; --d-card-bg:#1e293b; --d-card-border:#334155;
//           --d-nav-bg:#0f172a; --d-nav-border:rgba(255,255,255,0.08);
//           --d-text:#f1f5f9; --d-text-muted:#94a3b8;
//           --d-stats-bg:#0b1424; --d-stats-text:rgba(255,255,255,.4);
//           --d-footer-bg:#0b1424; --d-footer-border:#1e293b;
//           --d-hero-bg: linear-gradient(135deg,#0b1424 0%,#0f172a 50%,#0b1424 100%);
//           --d-hero-title:#f1f5f9; --d-hero-sub:#94a3b8; --d-hero-greeting:#64748b; --d-hero-name:#f1f5f9;
//           --d-tab-bg:#1e293b; --d-tab-border:#334155; --d-tab-color:#94a3b8;
//           --d-toggle-bg:#1e293b; --d-toggle-border:#334155; --d-toggle-icon:#fb923c;
//           --d-dd-bg:#1e293b; --d-dd-border:#334155; --d-dd-shadow:0 16px 48px rgba(0,0,0,0.45);
//           --d-dd-header-name:#f1f5f9; --d-dd-header-email:#64748b; --d-dd-divider:#334155;
//           --d-dd-item-color:#94a3b8; --d-dd-item-hover-bg:#2d3f55; --d-dd-item-hover-color:#f1f5f9;
//           --d-dd-upgrade-color:#fb923c; --d-dd-upgrade-hover-bg:rgba(251,146,60,0.1);
//           --d-dd-signout-color:#f87171; --d-dd-signout-hover-bg:rgba(248,113,113,0.08);
//         }

//         .d-page { font-family:'DM Sans',sans-serif; min-height:100vh; background:var(--d-bg); color:var(--d-text); overflow-x:hidden; transition:background .3s,color .3s; }

//         /* NAVBAR */
//         .d-nav { position:sticky; top:0; z-index:100; display:flex; align-items:center; justify-content:space-between; padding:0 24px; height:68px; background:var(--d-nav-bg); backdrop-filter:blur(20px); border-bottom:1px solid var(--d-nav-border); box-shadow:0 1px 20px rgba(0,0,0,0.06); transition:background .3s,border-color .3s; }
//         @media(min-width:768px){ .d-nav { padding:0 48px; } }
//         .d-nav-logo { font-family:'Playfair Display',serif; font-size:1.6rem; font-weight:900; cursor:pointer; display:flex; align-items:center; gap:8px; }
//         .d-beta { font-family:'DM Sans',sans-serif; font-size:0.58rem; font-weight:700; background:var(--d-orange); color:#fff; border-radius:6px; padding:2px 7px; letter-spacing:0.05em; }
//         .d-nav-links { display:none; align-items:center; gap:4px; }
//         @media(min-width:768px){ .d-nav-links { display:flex; } }
//         .d-nav-link { font-size:0.82rem; font-weight:600; color:var(--d-text); background:none; border:none; padding:7px 14px; border-radius:8px; cursor:pointer; font-family:'DM Sans',sans-serif; transition:0.18s; }
//         .d-nav-link:hover { background:var(--d-bg); color:var(--d-orange); }
//         .d-nav-right { display:flex; align-items:center; gap:10px; }
//         .d-btn-login { font-size:0.8rem; font-weight:600; color:var(--d-text-muted); background:var(--d-card-bg); border:1px solid var(--d-card-border); border-radius:10px; padding:8px 18px; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all 0.18s; box-shadow:0 1px 4px rgba(0,0,0,0.06); }
//         .d-btn-login:hover { border-color:var(--d-orange); color:var(--d-orange); }
//         .d-btn-signup { font-size:0.8rem; font-weight:700; color:#fff; background:#1E293B; border:none; border-radius:10px; padding:8px 20px; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all 0.18s; display:flex; align-items:center; gap:6px; box-shadow:0 4px 12px rgba(30,41,59,0.25); }
//         .d-btn-signup:hover { background:#334155; transform:translateY(-1px); }

//         .d-theme-toggle { width:40px; height:40px; background:var(--d-toggle-bg); border-radius:12px; border:1.5px solid var(--d-toggle-border); cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background .3s,border-color .3s,transform .2s; flex-shrink:0; color:var(--d-toggle-icon); }
//         .d-theme-toggle:hover { transform:scale(1.1); box-shadow:0 4px 12px rgba(0,0,0,0.15); }
//         .d-theme-toggle svg { display:block; width:20px; height:20px; }

//         /* USER MENU */
//         .d-user-menu-wrap { position:relative; }
//         .d-user-trigger { display:flex; align-items:center; gap:6px; cursor:pointer; padding:4px 8px 4px 4px; border-radius:999px; transition:0.18s; }
//         .d-user-trigger:hover { background:var(--d-bg); }
//         .d-user-avatar { width:36px; height:36px; border-radius:50%; background:linear-gradient(135deg,#F97316,#ea580c); display:flex; align-items:center; justify-content:center; font-size:0.9rem; font-weight:800; color:#fff; border:2px solid rgba(249,115,22,.3); flex-shrink:0; user-select:none; }
//         .d-user-arrow { transition:transform .25s; flex-shrink:0; color:var(--d-text-muted); }
//         .d-user-arrow.open { transform:rotate(180deg); }
//         .d-user-dropdown { position:absolute; top:calc(100% + 10px); right:0; background:var(--d-dd-bg); border:1px solid var(--d-dd-border); border-radius:14px; min-width:240px; padding:6px 0; box-shadow:var(--d-dd-shadow); opacity:0; transform:translateY(-8px) scale(.97); pointer-events:none; transition:all .2s cubic-bezier(.22,.61,.36,1); z-index:200; }
//         .d-user-dropdown.open { opacity:1; transform:translateY(0) scale(1); pointer-events:all; }
//         .d-user-dropdown-header { padding:14px 16px 12px; }
//         .d-user-dropdown-name { font-size:.88rem; font-weight:700; color:var(--d-dd-header-name); margin-bottom:2px; }
//         .d-user-dropdown-email { font-size:.72rem; color:var(--d-dd-header-email); }
//         .d-user-dropdown-divider { height:1px; background:var(--d-dd-divider); margin:4px 0; }
//         .d-user-dropdown-item { display:flex; align-items:center; gap:10px; width:100%; padding:10px 16px; font-size:.83rem; font-weight:600; color:var(--d-dd-item-color); cursor:pointer; transition:.15s; text-decoration:none; background:none; border:none; font-family:'DM Sans',sans-serif; text-align:left; }
//         .d-user-dropdown-item:hover { background:var(--d-dd-item-hover-bg); color:var(--d-dd-item-hover-color); }
//         .d-user-dropdown-item svg { flex-shrink:0; opacity:0.7; }
//         .d-user-dropdown-item.upgrade { color:var(--d-dd-upgrade-color); }
//         .d-user-dropdown-item.upgrade:hover { background:var(--d-dd-upgrade-hover-bg); }
//         .d-user-dropdown-item.upgrade svg { opacity:1; }
//         .d-user-dropdown-item.signout { color:var(--d-dd-signout-color); }
//         .d-user-dropdown-item.signout:hover { background:var(--d-dd-signout-hover-bg); }
//         .d-user-dropdown-item.signout svg { opacity:1; }

//         /* HERO */
//         .d-hero { background:var(--d-hero-bg); padding:32px 24px 28px; text-align:center; position:relative; overflow:hidden; transition:background .3s; max-width:880px; margin:0 auto; }
//         @media(min-width:768px){ .d-hero { padding:40px 48px 32px; } }
//         .d-hero::before { content:''; position:absolute; top:-100px; right:-100px; width:400px; height:400px; background:rgba(249,115,22,0.06); border-radius:50%; pointer-events:none; }
//         .d-hero::after  { content:''; position:absolute; bottom:-80px; left:-80px; width:300px; height:300px; background:rgba(34,197,94,0.05); border-radius:50%; pointer-events:none; }
//         .d-hero-welcome { display:flex; flex-direction:column; align-items:center; gap:3px; margin-bottom:14px; }
//         .d-hero-greeting { font-size:0.78rem; font-weight:600; color:var(--d-hero-greeting); display:flex; align-items:center; gap:7px; }
//         .d-hero-name { font-family:'Playfair Display',serif; font-size:1.4rem; font-weight:900; color:var(--d-hero-name); }
//         .d-hero-name .ora { color:var(--d-orange); }
//         .d-hero-subtitle { font-size:0.8rem; color:var(--d-hero-sub); }
//         .d-hero-title { font-family:'Playfair Display',serif; font-size:2rem; font-weight:900; line-height:1.1; color:var(--d-hero-title); margin-bottom:10px; }
//         @media(min-width:768px){ .d-hero-title { font-size:2.8rem; } }
//         .d-hero-title .ora { color:var(--d-orange); }
//         .d-hero-title .ilm { color:var(--d-green); }
//         .d-hero-typing { min-height:1.6em; margin-bottom:8px; font-size:0.92rem; color:var(--d-hero-sub); display:flex; align-items:center; justify-content:center; gap:6px; }
//         .d-typewriter { color:var(--d-orange); font-weight:700; font-size:0.96rem; }
//         .d-hero-btns { display:flex; gap:12px; justify-content:center; flex-wrap:wrap; }

//         /* STATS */
//         .d-stats { background:var(--d-stats-bg); padding:36px 24px; display:grid; grid-template-columns:repeat(2,1fr); gap:1px; transition:background .3s; }
//         @media(min-width:640px){ .d-stats { grid-template-columns:repeat(4,1fr); padding:36px 48px; } }
//         .d-stat { text-align:center; padding:20px 10px; }
//         .d-stat-val { font-size:2rem; font-weight:800; color:var(--d-orange); }
//         .d-stat-lbl { font-size:0.78rem; color:var(--d-stats-text); margin-top:4px; font-weight:500; }

//         /* SECTIONS */
//         .d-section { padding:64px 24px; background:var(--d-bg2); transition:background .3s; }
//         .d-section-alt { background:var(--d-bg) !important; }
//         @media(min-width:768px){ .d-section { padding:72px 48px; } }
//         .d-section-inner { max-width:1200px; margin:0 auto; }
//         .d-section-head { text-align:center; margin-bottom:40px; }
//         .d-section-tag { display:inline-block; font-size:0.72rem; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:var(--d-orange); background:rgba(249,115,22,0.08); border:1px solid rgba(249,115,22,0.2); border-radius:999px; padding:4px 14px; margin-bottom:12px; }
//         .d-section-title { font-family:'Playfair Display',serif; font-size:2rem; font-weight:900; color:var(--d-text); }
//         @media(min-width:768px){ .d-section-title { font-size:2.6rem; } }
//         .d-section-title .accent { color:var(--d-orange); }
//         .d-section-sub { font-size:0.95rem; color:var(--d-text-muted); margin-top:8px; max-width:500px; margin-left:auto; margin-right:auto; }

//         /* FEATURES — now a static, non-clickable display grid */
//         .d-features-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:16px; }
//         .d-feature-card { background:var(--d-card-bg); border-radius:16px; border:1.5px solid var(--d-card-border); box-shadow:0 2px 12px rgba(0,0,0,.05); padding:22px 20px; transition:all .22s; display:flex; flex-direction:column; gap:12px; position:relative; overflow:hidden; text-align:left; font-family:'DM Sans',sans-serif; width:100%; cursor:default; }
//         .d-feature-card::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(90deg,var(--d-orange),var(--d-green)); opacity:0; transition:.22s; }
//         .d-feature-card:hover { border-color:rgba(249,115,22,.25); box-shadow:0 8px 24px rgba(249,115,22,.08); }
//         .d-feature-card:hover::before { opacity:1; }
//         .d-feature-icon { width:44px; height:44px; border-radius:12px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
//         .d-feature-name { font-size:.95rem; font-weight:700; color:var(--d-text); }
//         .d-feature-desc { font-size:.78rem; color:var(--d-text-muted); line-height:1.55; flex:1; }
//         .d-feature-badge { position:absolute; top:12px; right:12px; font-size:.6rem; font-weight:700; background:var(--d-green); color:#fff; border-radius:6px; padding:2px 7px; }

//         /* TOOLS */
//         .d-tools-grid { display:grid; grid-template-columns:1fr; gap:16px; }
//         @media(min-width:640px){ .d-tools-grid { grid-template-columns:repeat(3,1fr); } }
//         .d-tool-card { background:var(--d-card-bg); border-radius:20px; padding:24px; cursor:pointer; border:1.5px solid var(--d-card-border); box-shadow:0 2px 12px rgba(0,0,0,0.05); transition:all 0.22s; display:flex; flex-direction:column; gap:14px; }
//         .d-tool-card:hover { border-color:var(--d-orange); box-shadow:0 12px 32px rgba(249,115,22,0.15); transform:translateY(-4px); }
//         .d-tool-icon { overflow:hidden; border-radius:10px; }
//         .d-tool-desc { font-size:0.8rem; color:var(--d-text-muted); line-height:1.65; flex:1; }
//         .d-tool-tags { display:flex; gap:7px; flex-wrap:wrap; margin-top:auto; }
//         .d-tool-tag { font-size:0.65rem; font-weight:700; border-radius:999px; padding:3px 10px; background:rgba(249,115,22,0.08); color:var(--d-orange); border:1px solid rgba(249,115,22,0.2); }
//         .d-tool-tag.green { background:rgba(34,197,94,0.08); color:var(--d-green); border-color:rgba(34,197,94,0.2); }
//         .d-tool-cta { display:flex; align-items:center; justify-content:space-between; margin-top:4px; }
//         .d-tool-try { font-size:0.78rem; font-weight:700; color:var(--d-orange); background:none; border:none; cursor:pointer; font-family:'DM Sans',sans-serif; padding:0; }

//         /* BLOG */
//         .d-blog-grid { display:grid; grid-template-columns:1fr; gap:20px; }
//         @media(min-width:768px){ .d-blog-grid { grid-template-columns:1.6fr 1fr; gap:24px; } }
//         .d-blog-featured { background:var(--d-card-bg); border-radius:20px; border:1.5px solid var(--d-card-border); box-shadow:0 2px 12px rgba(0,0,0,0.05); overflow:hidden; cursor:pointer; transition:all 0.22s; display:flex; flex-direction:column; }
//         .d-blog-featured:hover { border-color:rgba(249,115,22,0.35); box-shadow:0 16px 40px rgba(0,0,0,0.1); transform:translateY(-4px); }
//         .d-blog-featured-img { width:100%; height:220px; object-fit:cover; display:block; }
//         @media(min-width:768px){ .d-blog-featured-img { height:258px; } }
//         .d-blog-featured-body { padding:22px 24px 26px; display:flex; flex-direction:column; gap:10px; flex:1; }
//         .d-blog-featured-badge { display:inline-flex; align-items:center; gap:5px; font-size:0.6rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:#fff; background:var(--d-orange); border-radius:6px; padding:3px 10px; width:fit-content; }
//         .d-blog-featured-title { font-family:'Playfair Display',serif; font-size:1.2rem; font-weight:900; color:var(--d-text); line-height:1.3; }
//         @media(min-width:768px){ .d-blog-featured-title { font-size:1.38rem; } }
//         .d-blog-featured-excerpt { font-size:0.8rem; color:var(--d-text-muted); line-height:1.65; flex:1; }
//         .d-blog-featured-meta { display:flex; align-items:center; gap:8px; font-size:0.68rem; color:var(--d-text-muted); margin-top:4px; flex-wrap:wrap; }
//         .d-blog-featured-cat { color:var(--d-orange); font-weight:700; }
//         .d-blog-side { display:flex; flex-direction:column; gap:14px; }
//         .d-blog-side-card { background:var(--d-card-bg); border-radius:16px; border:1.5px solid var(--d-card-border); box-shadow:0 2px 8px rgba(0,0,0,0.04); padding:14px; cursor:pointer; transition:all 0.2s; display:flex; gap:12px; align-items:flex-start; }
//         .d-blog-side-card:hover { border-color:rgba(249,115,22,0.3); box-shadow:0 8px 24px rgba(0,0,0,0.08); transform:translateX(4px); }
//         .d-blog-side-img { width:72px; height:72px; border-radius:12px; object-fit:cover; flex-shrink:0; background:var(--d-light); }
//         .d-blog-side-body { flex:1; display:flex; flex-direction:column; gap:5px; }
//         .d-blog-side-cat { font-size:0.58rem; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:var(--d-orange); }
//         .d-blog-side-title { font-size:0.82rem; font-weight:700; color:var(--d-text); line-height:1.4; }
//         .d-blog-side-meta { font-size:0.66rem; color:var(--d-text-muted); display:flex; gap:5px; align-items:center; margin-top:2px; }
//         .d-blog-dot { width:3px; height:3px; border-radius:50%; background:var(--d-card-border); flex-shrink:0; display:inline-block; }

//         /* CTA */
//         .d-cta { background:#1E293B; border-radius:24px; padding:56px 32px; text-align:center; margin:0 24px 64px; position:relative; overflow:hidden; }
//         @media(min-width:768px){ .d-cta { margin:0 48px 80px; } }
//         .d-cta::before { content:''; position:absolute; top:0; left:0; right:0; height:4px; background:linear-gradient(90deg,var(--d-orange),var(--d-green)); }
//         .d-cta-title { font-family:'Playfair Display',serif; font-size:2.2rem; font-weight:900; color:#fff; margin-bottom:12px; }
//         .d-cta-sub { color:rgba(255,255,255,0.55); font-size:0.95rem; margin-bottom:32px; }
//         .d-cta-btns { display:flex; gap:12px; justify-content:center; flex-wrap:wrap; }
//         .d-cta-primary { background:var(--d-orange); color:#fff; border:none; border-radius:12px; padding:14px 32px; font-size:0.9rem; font-weight:700; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all 0.18s; box-shadow:0 4px 16px rgba(249,115,22,0.4); }
//         .d-cta-primary:hover { background:#ea6c0a; transform:translateY(-2px); }

//         /* FOOTER */
//         .d-footer-new { background:var(--d-footer-bg); color:var(--d-text); font-family:'DM Sans',sans-serif; border-top:1px solid var(--d-footer-border); transition:background .3s,color .3s; }
//         .d-footer-inner { max-width:1200px; margin:0 auto; padding:64px 24px 0; }
//         .d-footer-grid { display:grid; gap:32px; grid-template-columns:1fr; }
//         @media(min-width:768px){ .d-footer-grid { grid-template-columns:1.6fr 1fr 1fr; } }
//         @media(min-width:1024px){ .d-footer-grid { grid-template-columns:1.7fr 1fr 1fr 1fr 1.3fr; } }
//         .d-footer-brand h3 { font-family:'Playfair Display',serif; font-size:1.8rem; font-weight:900; margin-bottom:12px; }
//         .d-footer-brand p { font-size:0.82rem; color:var(--d-text-muted); line-height:1.65; max-width:280px; margin-bottom:16px; }
//         .d-footer-email { display:flex; align-items:center; gap:8px; font-size:0.82rem; color:var(--d-text-muted); margin-bottom:18px; }
//         .d-footer-email a { color:var(--d-text-muted); text-decoration:none; transition:color .18s; }
//         .d-footer-email a:hover { color:var(--d-orange); }
//         .d-footer-email svg { flex-shrink:0; color:var(--d-orange); }
//         .d-footer-socials { display:flex; gap:10px; flex-wrap:wrap; }
//         .d-footer-social-btn { width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#fff; transition:transform 0.2s; box-shadow:0 2px 6px rgba(0,0,0,0.15); flex-shrink:0; text-decoration:none; }
//         .d-footer-social-btn:hover { transform:scale(1.1); }
//         .d-footer-col h4 { font-size:0.78rem; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:var(--d-text); margin-bottom:14px; }
//         .d-footer-col ul { list-style:none; display:flex; flex-direction:column; gap:8px; }
//         .d-footer-col ul li { font-size:0.82rem; color:var(--d-text-muted); cursor:pointer; transition:color 0.18s; display:flex; align-items:center; gap:6px; }
//         .d-footer-col ul li::before { content:''; width:5px; height:5px; border-radius:50%; background:var(--d-orange); opacity:0; transition:opacity .18s; flex-shrink:0; }
//         .d-footer-col ul li:hover { color:var(--d-orange); }
//         .d-footer-col ul li:hover::before { opacity:1; }
//         .d-footer-newsletter h4 { font-size:0.92rem; font-weight:700; letter-spacing:0; text-transform:none; color:var(--d-text); margin-bottom:14px; }
//         .d-footer-newsletter-input-wrap { display:flex; border-radius:10px; overflow:hidden; border:1px solid var(--d-card-border); background:var(--d-card-bg); }
//         .d-footer-newsletter-input { flex:1; min-width:0; border:none; background:transparent; padding:10px 14px; font-size:0.78rem; color:var(--d-text); font-family:'DM Sans',sans-serif; outline:none; }
//         .d-footer-newsletter-input::placeholder { color:var(--d-text-muted); opacity:0.7; }
//         .d-footer-newsletter-btn { background:#1E293B; color:#fff; border:none; width:42px; flex-shrink:0; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:0.18s; }
//         .d-footer-newsletter-btn:hover { background:var(--d-orange); }
//         .d-footer-status { display:inline-flex; align-items:center; gap:6px; font-size:0.74rem; font-weight:600; color:var(--d-green); background:rgba(22,163,74,0.08); border:1px solid rgba(22,163,74,0.22); border-radius:999px; padding:5px 12px; margin-top:14px; }
//         .d-footer-status-dot { width:7px; height:7px; border-radius:50%; background:var(--d-green); box-shadow:0 0 0 3px rgba(22,163,74,0.18); animation:pulse 2s infinite; }
//         @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
//         .d-footer-bottom { max-width:1200px; margin:0 auto; padding:20px 24px; border-top:1px solid var(--d-footer-border); margin-top:48px; display:flex; flex-direction:column; align-items:center; gap:8px; font-size:0.72rem; color:var(--d-text-muted); }
//         @media(min-width:768px){ .d-footer-bottom { flex-direction:row; justify-content:space-between; } }

//         /* TOAST */
//         .d-toast { position:fixed; bottom:28px; left:50%; transform:translateX(-50%) translateY(20px); background:#1E293B; color:#fff; padding:14px 24px; border-radius:12px; font-size:0.84rem; font-weight:600; box-shadow:0 8px 24px rgba(0,0,0,0.25); z-index:2000; opacity:0; transition:0.3s; pointer-events:none; white-space:nowrap; }
//         .d-toast.show { opacity:1; transform:translateX(-50%) translateY(0); }

//         /* LOGIN MODAL */
//         .lm-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.55); z-index:1000; display:flex; align-items:center; justify-content:center; padding:20px; backdrop-filter:blur(4px); animation:lmFade 0.2s ease; }
//         @keyframes lmFade { from{opacity:0} to{opacity:1} }
//         .lm-box { background:#fff; border-radius:20px; padding:32px 28px; width:100%; max-width:420px; position:relative; box-shadow:0 24px 64px rgba(0,0,0,0.2); animation:lmUp 0.3s ease; }
//         @keyframes lmUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
//         .lm-close { position:absolute; top:16px; right:16px; background:none; border:none; font-size:1rem; cursor:pointer; color:#94a3b8; width:28px; height:28px; display:flex; align-items:center; justify-content:center; border-radius:50%; transition:all 0.18s; }
//         .lm-close:hover { background:#f1f5f9; color:#1E293B; }
//         .lm-logo { font-family:'Playfair Display',serif; font-size:2rem; font-weight:900; text-align:center; margin-bottom:8px; cursor:pointer; }
//         .lm-heading { text-align:center; margin-bottom:20px; }
//         .lm-heading h2 { font-size:1.2rem; font-weight:700; color:#1e0e02; margin-bottom:6px; }
//         .lm-heading p { font-size:0.84rem; color:#8a6040; }
//         .lm-heading p button { background:none; border:none; cursor:pointer; color:#F97316; font-family:'DM Sans',sans-serif; font-size:0.84rem; font-weight:700; padding:0; }
//         .lm-heading p button:hover { text-decoration:underline; }
//         .lm-google-wrap { width:100%; margin-bottom:14px; display:flex; justify-content:center; }
//         .lm-or { display:flex; align-items:center; gap:12px; margin-bottom:14px; }
//         .lm-or-line { flex:1; height:1px; background:rgba(180,100,30,0.15); }
//         .lm-or-text { font-size:0.7rem; color:#b8906a; letter-spacing:0.1em; text-transform:uppercase; }
//         .lm-field { margin-bottom:12px; }
//         .lm-field label { display:block; font-size:0.72rem; font-weight:700; color:#8a6040; margin-bottom:5px; letter-spacing:0.06em; text-transform:uppercase; }
//         .lm-field input { width:100%; padding:11px 14px; background:rgba(255,255,255,0.8); border:1.5px solid rgba(180,120,60,0.2); border-radius:10px; color:#1a0e06; font-family:'DM Sans',sans-serif; font-size:0.875rem; outline:none; transition:border-color 0.2s,box-shadow 0.2s; }
//         .lm-field input::placeholder { color:#c0a070; }
//         .lm-field input:focus { border-color:#F97316; box-shadow:0 0 0 3px rgba(249,115,22,0.1); background:#fff; }
//         .lm-pw-wrap { position:relative; }
//         .lm-pw-wrap input { padding-right:44px; }
//         .lm-eye { position:absolute; right:12px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; color:#b8906a; display:flex; align-items:center; padding:0; transition:color 0.2s; }
//         .lm-eye:hover { color:#F97316; }
//         .lm-forgot { text-align:right; margin:6px 0 14px; }
//         .lm-forgot button { background:none; border:none; cursor:pointer; color:#F97316; font-family:'DM Sans',sans-serif; font-size:0.78rem; font-weight:500; }
//         .lm-forgot button:hover { text-decoration:underline; }
//         .lm-submit { width:100%; padding:13px; background:linear-gradient(135deg,#F97316,#ea580c); color:#fff; font-family:'DM Sans',sans-serif; font-weight:700; font-size:0.95rem; border:none; border-radius:10px; cursor:pointer; transition:opacity 0.2s,transform 0.15s; box-shadow:0 4px 18px rgba(249,115,22,0.32); display:flex; align-items:center; justify-content:center; gap:8px; }
//         .lm-submit:hover:not(:disabled) { opacity:0.9; transform:translateY(-1px); }
//         .lm-submit:disabled { opacity:0.5; cursor:not-allowed; }
//         .lm-spinner { width:13px; height:13px; border:2px solid rgba(255,255,255,0.3); border-top-color:#fff; border-radius:50%; animation:spin 0.7s linear infinite; }
//         @keyframes spin { to{transform:rotate(360deg)} }
//         .lm-back-home { text-align:center; margin-top:14px; }
//         .lm-back-home button { background:none; border:none; cursor:pointer; color:#94a3b8; font-family:'DM Sans',sans-serif; font-size:0.78rem; }
//         .lm-back-home button:hover { color:#475569; }
//       `}</style>

//       <div className="d-page" data-theme={theme}>
//         {/* ═══ MODALS ═══ */}
//         {showLogin && (
//           <LoginModal
//             onClose={() => setShowLogin(false)}
//             onGoogleSuccess={handleGoogleNewUser}
//           />
//         )}

//         {/* BUG FIX: CompleteProfile popup — passes all required props correctly */}
//         {showRolePopup && (
//           <CompleteProfile
//             onSkip={handleRoleSkip}
//             prefillName={googleUserInfo?.name || ""}
//             prefillEmail={googleUserInfo?.email || ""}
//             googleCredential={googleUserInfo?.googleCredential || null}
//             isGoogleUser={!!googleUserInfo}
//           />
//         )}

//         {showDashGate && (
//           <DashboardGateModal
//             onClose={() => setShowDashGate(false)}
//             reason={dashGateReason}
//             onUpdateProfile={handleDashGateUpdateProfile}
//             onChoosePlan={handleDashGateChoosePlan}
//           />
//         )}

//         {/* BUG FIX: ProfileDetailsForm shown when user clicks "Complete Profile" in gate modal */}
//         {showProfileForm && (
//           <ProfileDetailsForm
//             role={
//               userRole === "admin"
//                 ? "Manager"
//                 : userRole === "trainer"
//                   ? "trainer"
//                   : "student"
//             }
//             name={userName}
//             email={userEmail}
//             token={localStorage.getItem("lms_token") || ""}
//             onSuccess={handleProfileFormSuccess}
//             onBack={() => setShowProfileForm(false)}
//             isEditMode={false}
//           />
//         )}

//         {/* ═══ NAVBAR ═══ */}
//         <nav className="d-nav">
//           <div className="d-nav-logo" onClick={() => navigate("/")}>
//             <span style={{ color: "#16a34a" }}>ILM</span>
//             <span style={{ color: "#F97316" }}> ORA</span>
//             <span className="d-beta">BETA</span>
//           </div>
//           <div className="d-nav-links">
//             <button
//               className="d-nav-link"
//               onClick={() => scrollToId("features")}
//             >
//               Features
//             </button>
//             <button className="d-nav-link" onClick={() => scrollToId("tools")}>
//               Products
//             </button>
//             <button className="d-nav-link" onClick={() => scrollToId("blog")}>
//               Blog
//             </button>
//           </div>
//           <div className="d-nav-right">
//             <button
//               className="d-theme-toggle"
//               onClick={toggleTheme}
//               title={isDark ? "Switch to light mode" : "Switch to dark mode"}
//               aria-label="Toggle theme"
//             >
//               {isDark ? (
//                 <Sun size={20} strokeWidth={2} color="var(--d-toggle-icon)" />
//               ) : (
//                 <Moon size={20} strokeWidth={2} color="var(--d-toggle-icon)" />
//               )}
//             </button>

//             {isLoggedIn ? (
//               <div className="d-user-menu-wrap" ref={userMenuRef}>
//                 <div
//                   className="d-user-trigger"
//                   onClick={() => setUserMenuOpen((o) => !o)}
//                 >
//                   <div className="d-user-avatar">{userInitial}</div>
//                   <svg
//                     className={`d-user-arrow ${userMenuOpen ? "open" : ""}`}
//                     width="14"
//                     height="14"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2.5"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   >
//                     <polyline points="6 9 12 15 18 9" />
//                   </svg>
//                 </div>

//                 <div
//                   className={`d-user-dropdown ${userMenuOpen ? "open" : ""}`}
//                 >
//                   <div className="d-user-dropdown-header">
//                     <div className="d-user-dropdown-name">{userName}</div>
//                     <div className="d-user-dropdown-email">{userEmail}</div>
//                   </div>
//                   <div className="d-user-dropdown-divider" />

//                   <button
//                     className="d-user-dropdown-item"
//                     onClick={() => {
//                       setUserMenuOpen(false);
//                       setShowProfileForm(true);
//                     }}
//                   >
//                     <svg
//                       width="16"
//                       height="16"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     >
//                       <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
//                       <circle cx="12" cy="7" r="4" />
//                     </svg>
//                     Profile
//                   </button>

//                   {/* Upgrade */}
//                   <button
//                     className="d-user-dropdown-item upgrade"
//                     onClick={() => {
//                       setUserMenuOpen(false);
//                       navigate("/pricing");
//                     }}
//                   >
//                     <svg
//                       width="16"
//                       height="16"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     >
//                       <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
//                     </svg>
//                     Upgrade Plan
//                   </button>

//                   {/* Dashboard — gated */}
//                   <button
//                     className="d-user-dropdown-item"
//                     onClick={handleGoToDashboard}
//                   >
//                     <DashboardIcon size={16} />
//                     Go to Dashboard
//                   </button>

//                   <div className="d-user-dropdown-divider" />

//                   {/* Sign out */}
//                   <button
//                     className="d-user-dropdown-item signout"
//                     onClick={handleSignOut}
//                   >
//                     <svg
//                       width="16"
//                       height="16"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     >
//                       <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
//                       <polyline points="16 17 21 12 16 7" />
//                       <line x1="21" y1="12" x2="9" y2="12" />
//                     </svg>
//                     Sign out
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               <></>
//             )}
//           </div>
//         </nav>

//         {/* ═══ HERO ═══ */}
//         <section className="d-hero" ref={heroRef}>
//           <div className="d-hero-welcome">
//             <div className="d-hero-greeting">
//               <span>👋</span> {greeting}
//             </div>
//             <div className="d-hero-name">
//               Welcome back, <span className="ora">{userName}</span>
//             </div>
//             <div className="d-hero-subtitle">
//               Your AI-powered learning hub is ready. Pick up where you left off.
//             </div>
//           </div>
//           <h1 className="d-hero-title">
//             Become the <span className="ora">Top 1%</span>
//             <br />
//             with <span className="ilm">ILM</span>{" "}
//             <span className="ora">ORA</span>
//           </h1>
//           <div className="d-hero-typing">
//             <TypeWriter
//               className="d-typewriter"
//               texts={[
//                 "Start today. Stay consistent.",
//                 "Your next milestone awaits.",
//                 "Learning compounds. Keep going.",
//                 "Top 1% is a daily choice.",
//                 "Built for ambitious professionals.",
//               ]}
//               typingSpeed={70}
//               deletingSpeed={40}
//               pauseDuration={1800}
//               showCursor
//               cursorCharacter="_"
//               cursorBlinkDuration={0.5}
//             />
//           </div>
//           <div className="d-hero-btns" />
//         </section>

//         {/* ═══ FEATURES — static display cards, no click / no navigation ═══ */}
//         <section className="d-section" ref={featuresRef} id="features">
//           <div className="d-section-inner">
//             <div className="d-section-head">
//               <div className="d-section-tag">Platform Features</div>
//               <h2 className="d-section-title">
//                 {(() => {
//                   const words = roleConfig.title.split(" ");
//                   const accent = words.pop();
//                   return (
//                     <>
//                       {words.join(" ")} <span className="accent">{accent}</span>
//                     </>
//                   );
//                 })()}
//               </h2>
//               <p className="d-section-sub">
//                 A quick look at everything available to you on the platform
//               </p>
//             </div>
//             <div className="d-features-grid">
//               {roleConfig.features.map((f, idx) => {
//                 const color = ICON_COLORS[idx % ICON_COLORS.length];
//                 return (
//                   <div key={f.name} className="d-feature-card">
//                     {f.badge && (
//                       <span className="d-feature-badge">{f.badge}</span>
//                     )}
//                     <div
//                       className="d-feature-icon"
//                       style={{ background: `${color}18`, color }}
//                     >
//                       <f.Icon size={22} strokeWidth={1.8} />
//                     </div>
//                     <div className="d-feature-name">{f.name}</div>
//                     <div className="d-feature-desc">{f.desc}</div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </section>

//         {/* ═══ STATS ═══ */}
//         <div className="d-stats" ref={statsRef} id="successstories">
//           {STATS.map((s, i) => (
//             <div key={i} className="d-stat">
//               <div className="d-stat-val">{s.value}</div>
//               <div className="d-stat-lbl">{s.label}</div>
//             </div>
//           ))}
//         </div>

//         {/* ═══ TOOLS ═══ */}
//         <section className="d-section d-section-alt" ref={toolsRef} id="tools">
//           <div className="d-section-inner">
//             <div className="d-section-head">
//               <div className="d-section-tag">Texora Products</div>
//               <h2 className="d-section-title">
//                 Explore Our <span className="accent">Products</span>
//               </h2>
//               <p className="d-section-sub">
//                 Powerful AI products built by Texora — click to explore
//               </p>
//             </div>
//             <div className="d-tools-grid">
//               {TOOLS.map((t) => (
//                 <div
//                   key={t.key}
//                   className="d-tool-card"
//                   onClick={() => window.open(t.route, "_blank")}
//                 >
//                   <div
//                     className="d-tool-icon"
//                     style={{
//                       background: "#f8fafc",
//                       padding: 0,
//                       overflow: "hidden",
//                     }}
//                   >
//                     <img
//                       src={`/images/${t.icon}.jpeg`}
//                       alt={t.icon}
//                       style={{
//                         width: "100%",
//                         height: "100%",
//                         objectFit: "contain",
//                         borderRadius: "10px",
//                         padding: "4px 8px",
//                       }}
//                     />
//                   </div>
//                   <div className="d-tool-desc">{t.desc}</div>
//                   <div className="d-tool-tags">
//                     {t.tags.map((tag, i) => (
//                       <span
//                         key={tag}
//                         className={`d-tool-tag ${i === 1 ? "green" : ""}`}
//                       >
//                         {tag}
//                       </span>
//                     ))}
//                   </div>
//                   <div className="d-tool-cta">
//                     <button className="d-tool-try">Try Free →</button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* ═══ BLOG ═══ */}
//         <section className="d-section" ref={blogRef} id="blog">
//           <div className="d-section-inner">
//             <div className="d-section-head">
//               <div className="d-section-tag">Latest Insights</div>
//               <h2 className="d-section-title">
//                 From Our <span className="accent">Blog</span>
//               </h2>
//               <p className="d-section-sub">
//                 Tips, updates and guides to grow your career
//               </p>
//             </div>
//             <div className="d-blog-grid">
//               <div className="d-blog-featured">
//                 <img
//                   className="d-blog-featured-img"
//                   src={BLOG_POSTS[0].cover}
//                   alt={BLOG_POSTS[0].title}
//                   onError={(e) => {
//                     e.target.style.height = "120px";
//                     e.target.style.background = "#F6EDE6";
//                   }}
//                 />
//                 <div className="d-blog-featured-body">
//                   <span className="d-blog-featured-badge">⭐ Featured</span>
//                   <div className="d-blog-featured-title">
//                     {BLOG_POSTS[0].title}
//                   </div>
//                   <div className="d-blog-featured-excerpt">
//                     {BLOG_POSTS[0].excerpt}
//                   </div>
//                   <div className="d-blog-featured-meta">
//                     <span className="d-blog-featured-cat">
//                       {BLOG_POSTS[0].cat}
//                     </span>
//                     <span className="d-blog-dot" />
//                     <span>{BLOG_POSTS[0].date}</span>
//                     <span className="d-blog-dot" />
//                     <span>{BLOG_POSTS[0].reads} min read</span>
//                   </div>
//                 </div>
//               </div>
//               <div className="d-blog-side">
//                 {BLOG_POSTS.slice(1).map((b, i) => (
//                   <div key={i} className="d-blog-side-card">
//                     <img
//                       className="d-blog-side-img"
//                       src={b.cover}
//                       alt={b.title}
//                       onError={(e) => {
//                         e.target.style.display = "none";
//                       }}
//                     />
//                     <div className="d-blog-side-body">
//                       <div className="d-blog-side-cat">{b.cat}</div>
//                       <div className="d-blog-side-title">{b.title}</div>
//                       <div className="d-blog-side-meta">
//                         <span>{b.date}</span>
//                         <span className="d-blog-dot" />
//                         <span>{b.reads} min read</span>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* ═══ CTA ═══ */}
//         <div ref={ctaRef}>
//           <div className="d-cta">
//             <div className="d-cta-title">Ready to Transform Your Career?</div>
//             <p className="d-cta-sub">
//               Be among the first to learn with ILM ORA — join our growing
//               community
//             </p>
//             <div className="d-cta-btns"></div>
//           </div>
//         </div>

//         {/* ═══ FOOTER ═══ */}
//         <footer className="d-footer-new">
//           <div className="d-footer-inner">
//             <div className="d-footer-grid">
//               <div className="d-footer-brand">
//                 <h3>
//                   <span style={{ color: "#16a34a" }}>ILM</span>{" "}
//                   <span style={{ color: "#F97316" }}>ORA</span>
//                 </h3>
//                 <p>
//                   Modern learning platform for ambitious professionals who want
//                   to break into product, design and growth roles.
//                 </p>
//                 <div className="d-footer-email">
//                   <svg
//                     width="15"
//                     height="15"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   >
//                     <rect x="2" y="4" width="20" height="16" rx="2" />
//                     <path d="M22 6 12 13 2 6" />
//                   </svg>
//                   <a href="mailto:marketing@texora.ai">marketing@texora.ai</a>
//                 </div>
//                 <div className="d-footer-socials">
//                   {[
//                     {
//                       href: "https://www.instagram.com/texora_ai",
//                       bg: "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",
//                       svg: (
//                         <svg
//                           style={{ width: 14, height: 14 }}
//                           viewBox="0 0 24 24"
//                           fill="currentColor"
//                         >
//                           <path d="M7.75 2C4.574 2 4.574 22 7.75 22h8.5C19.426 22 22 19.426 22 16.25v-8.5C22 4.574 19.426 2 16.25 2h-8.5zm0 2h8.5C18.216 4 20 5.784 20 7.75v8.5C20 18.216 18.216 20 16.25 20h-8.5C5.784 20 4 18.216 4 16.25v-8.5C4 5.784 5.784 4 7.75 4zm4.25 3a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm4.5-.75a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5z" />
//                         </svg>
//                       ),
//                     },
//                     {
//                       href: "https://www.youtube.com/@Texoraai",
//                       bg: "#dc2626",
//                       svg: (
//                         <svg
//                           style={{ width: 14, height: 14 }}
//                           viewBox="0 0 24 24"
//                           fill="currentColor"
//                         >
//                           <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
//                         </svg>
//                       ),
//                     },
//                     {
//                       href: "https://www.linkedin.com/company/105596104",
//                       bg: "#1d4ed8",
//                       svg: (
//                         <svg
//                           style={{ width: 14, height: 14 }}
//                           viewBox="0 0 24 24"
//                           fill="currentColor"
//                         >
//                           <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
//                         </svg>
//                       ),
//                     },
//                     {
//                       href: "https://api.whatsapp.com/send?phone=919205299338",
//                       bg: "#22c55e",
//                       svg: (
//                         <svg
//                           style={{ width: 14, height: 14 }}
//                           viewBox="0 0 24 24"
//                           fill="currentColor"
//                         >
//                           <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
//                         </svg>
//                       ),
//                     },
//                     {
//                       href: "https://x.com/texoraai",
//                       bg: "#000",
//                       svg: (
//                         <svg
//                           style={{ width: 14, height: 14 }}
//                           viewBox="0 0 24 24"
//                           fill="currentColor"
//                         >
//                           <path d="M18.244 2H21l-6.54 7.482L22 22h-6.828l-5.34-6.977L3.64 22H1l7.042-8.053L2 2h6.828l4.86 6.35L18.244 2zm-2.396 18h1.89L8.224 4H6.176l9.672 16z" />
//                         </svg>
//                       ),
//                     },
//                   ].map((s, i) => (
//                     <a
//                       key={i}
//                       href={s.href}
//                       target="_blank"
//                       rel="noreferrer"
//                       className="d-footer-social-btn"
//                       style={{ background: s.bg }}
//                     >
//                       {s.svg}
//                     </a>
//                   ))}
//                 </div>
//               </div>

//               <div className="d-footer-col">
//                 <h4>Resources</h4>
//                 <ul>
//                   <li onClick={() => scrollToId("successstories")}>
//                     Success Stories
//                   </li>
//                   <li onClick={() => scrollToId("blog")}>Blogs</li>
//                   <li onClick={() => scrollToId("tools")}>Use Cases</li>
//                 </ul>
//               </div>

//               <div className="d-footer-col">
//                 <h4>Company</h4>
//                 <ul>
//                   <li onClick={() => navigate("/about")}>About Us</li>
//                   <li onClick={() => navigate("/careers")}>Careers</li>
//                   <li onClick={() => navigate("/pricing")}>Pricing</li>
//                   <li onClick={() => navigate("/privacy-policy")}>
//                     Privacy Policy
//                   </li>
//                   <li onClick={() => navigate("/help-center")}>Help Center</li>
//                   <li onClick={() => navigate("/faq")}>FAQ</li>
//                   <li onClick={() => navigate("/terms-of-service")}>
//                     Terms of Service
//                   </li>
//                 </ul>
//               </div>

//               <div className="d-footer-col d-footer-newsletter">
//                 <h4>Be the first to know</h4>
//                 <div className="d-footer-newsletter-input-wrap">
//                   <input
//                     type="email"
//                     className="d-footer-newsletter-input"
//                     placeholder="marketing@texora.ai"
//                   />
//                   <button
//                     className="d-footer-newsletter-btn"
//                     aria-label="Subscribe"
//                     onClick={() =>
//                       showToast("Thanks! We'll keep you posted 🚀")
//                     }
//                   >
//                     <svg
//                       width="16"
//                       height="16"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2.4"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     >
//                       <path d="M5 12h14M13 6l6 6-6 6" />
//                     </svg>
//                   </button>
//                 </div>
//                 <div className="d-footer-status">
//                   <span className="d-footer-status-dot" />
//                   Status: Live
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="d-footer-bottom">
//             <span>
//               © {new Date().getFullYear()} ILM ORA All rights reserved.
//             </span>
//             <span>Built with passion for modern learners 🚀</span>
//           </div>
//         </footer>

//         {/* ═══ TOAST ═══ */}
//         <div className={`d-toast ${toast.show ? "show" : ""}`}>{toast.msg}</div>
//       </div>
//     </>
//   );
// }




















































































import { GoogleOAuthProvider } from "@react-oauth/google";
import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import auth from "../../auth";
import ProfileDetailsForm from "../common/ProfileDetailsForm";
import CompleteProfile from "../common/CompleteProfile";
import {
  BookOpen,
  FileText,
  Radio,
  Award,
  FileUser,
  Map,
  BarChart2,
  CalendarCheck,
  Video,
  Bot,
  NotebookPen,
  MessageCircleQuestion,
  Users,
  CheckSquare,
  ClipboardList,
  TrendingUp,
  Upload,
  Cpu,
  PenTool,
  BarChart,
  Film,
  Layers,
  Landmark,
  LayoutDashboard,
  UserCog,
  PieChart,
  FileBarChart,
  Handshake,
  UserCheck,
  Building2,
  Library,
  GitBranch,
  Tag,
  ServerCog,
  MonitorPlay,
  Briefcase,
  Globe,
  DollarSign,
  Megaphone,
  Target,
  Settings,
  Sun,
  Moon,
  LayoutDashboard as DashboardIcon,
  AlertCircle,
  User,
  Crown,
  CheckCircle,
  Clock,
  Lock,
  ChevronRight,
  X,
  Check,
  Info,
  Star,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const GOOGLE_CLIENT_ID =
  "572421778240-akk3kkb4f60ukuv9pcfrpg2ielm09thk.apps.googleusercontent.com";

/* ─── TypeWriter ─────────────────────────────────────────────────────────── */
function TypeWriter({
  texts = [],
  typingSpeed = 75,
  deletingSpeed = 50,
  pauseDuration = 1500,
  showCursor = true,
  cursorCharacter = "_",
  cursorBlinkDuration = 0.5,
  variableSpeedEnabled = false,
  variableSpeedMin = 60,
  variableSpeedMax = 120,
  className = "",
}) {
  const [displayed, setDisplayed] = useState("");
  const [phase, setPhase] = useState("typing");
  const [index, setIndex] = useState(0);
  const [charPos, setCharPos] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);

  const getSpeed = useCallback(
    (base) =>
      variableSpeedEnabled
        ? Math.random() * (variableSpeedMax - variableSpeedMin) +
          variableSpeedMin
        : base,
    [variableSpeedEnabled, variableSpeedMin, variableSpeedMax],
  );

  useEffect(() => {
    if (!showCursor) return;
    const id = setInterval(
      () => setCursorVisible((v) => !v),
      cursorBlinkDuration * 1000,
    );
    return () => clearInterval(id);
  }, [showCursor, cursorBlinkDuration]);

  useEffect(() => {
    if (!texts.length) return;
    const current = texts[index % texts.length];
    if (phase === "typing") {
      if (charPos < current.length) {
        const t = setTimeout(() => {
          setDisplayed(current.slice(0, charPos + 1));
          setCharPos((p) => p + 1);
        }, getSpeed(typingSpeed));
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setPhase("deleting"), pauseDuration);
        return () => clearTimeout(t);
      }
    }
    if (phase === "deleting") {
      if (charPos > 0) {
        const t = setTimeout(() => {
          setDisplayed(current.slice(0, charPos - 1));
          setCharPos((p) => p - 1);
        }, getSpeed(deletingSpeed));
        return () => clearTimeout(t);
      } else {
        setIndex((i) => (i + 1) % texts.length);
        setPhase("typing");
      }
    }
  }, [phase, charPos, index, texts, typingSpeed, deletingSpeed, pauseDuration, getSpeed]);

  return (
    <span className={className} aria-live="polite">
      {displayed}
      {showCursor && (
        <span style={{ opacity: cursorVisible ? 1 : 0, transition: "opacity 0.1s" }} aria-hidden="true">
          {cursorCharacter}
        </span>
      )}
    </span>
  );
}

/* ─── TOAST SYSTEM ───────────────────────────────────────────────────────── */
// Types: "success" | "warning" | "info" | "error" | "star"
function ToastContainer({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast-item toast-${t.type} ${t.exiting ? "toast-exit" : "toast-enter"}`}>
          <div className="toast-icon-wrap">
            {t.type === "success" && <Check size={14} strokeWidth={2.5} />}
            {t.type === "warning" && <AlertCircle size={14} strokeWidth={2.5} />}
            {t.type === "info" && <Info size={14} strokeWidth={2.5} />}
            {t.type === "error" && <X size={14} strokeWidth={2.5} />}
            {t.type === "star" && <Star size={14} strokeWidth={2.5} />}
          </div>
          <div className="toast-body">
            <div className="toast-title">{t.title}</div>
            {t.desc && <div className="toast-desc">{t.desc}</div>}
          </div>
          <button className="toast-close" onClick={t.onClose}>
            <X size={12} />
          </button>
        </div>
      ))}
    </div>
  );
}

/* ─── POPUP 1: Profile Incomplete ───────────────────────────────────────── */
function ProfileIncompleteModal({ onClose, onCompleteProfile }) {
  return (
    <div className="ilm-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ilm-modal">
        <button className="ilm-modal-close" onClick={onClose}><X size={16} /></button>
        <div className="ilm-modal-icon-wrap" style={{ background: "rgba(249,115,22,0.1)" }}>
          <User size={28} color="#F97316" strokeWidth={1.8} />
        </div>
        <h2 className="ilm-modal-title">Complete Your Profile First</h2>
        <p className="ilm-modal-sub">To unlock your personalized dashboard, please complete your profile information.</p>
        <ul className="ilm-check-list">
          <li><CheckCircle size={16} color="#F97316" /><span>Personalized Learning Path</span></li>
          <li><CheckCircle size={16} color="#F97316" /><span>Recommended Courses</span></li>
          <li><CheckCircle size={16} color="#F97316" /><span>Progress Tracking</span></li>
        </ul>
        <button className="ilm-btn-primary" onClick={onCompleteProfile}>
          Complete Profile
        </button>
        <button className="ilm-btn-ghost" onClick={onClose}>Do This Later</button>
      </div>
    </div>
  );
}

/* ─── POPUP 2: Plan Not Selected ─────────────────────────────────────────── */
function PlanNotSelectedModal({ onClose, onViewPlans }) {
  return (
    <div className="ilm-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ilm-modal">
        <button className="ilm-modal-close" onClick={onClose}><X size={16} /></button>
        <div className="ilm-modal-icon-wrap" style={{ background: "rgba(249,115,22,0.1)" }}>
          <Crown size={28} color="#F97316" strokeWidth={1.8} />
        </div>
        <h2 className="ilm-modal-title">Unlock Your Dashboard</h2>
        <p className="ilm-modal-sub">Choose a subscription plan to access all ILM ORA features.</p>
        <ul className="ilm-check-list">
          <li><CheckCircle size={16} color="#F97316" /><span>Dashboard Access</span></li>
          <li><CheckCircle size={16} color="#F97316" /><span>Live Classes</span></li>
          <li><CheckCircle size={16} color="#F97316" /><span>Certificates</span></li>
          <li><CheckCircle size={16} color="#F97316" /><span>AI Learning Tools</span></li>
        </ul>
        <button className="ilm-btn-primary" onClick={onViewPlans}>
          View Plans
        </button>
        <button className="ilm-btn-ghost" onClick={onClose}>Do This Later</button>
      </div>
    </div>
  );
}

/* ─── POPUP 3: Success / Congratulations ────────────────────────────────── */
function SuccessModal({ onClose, onGoToDashboard }) {
  return (
    <div className="ilm-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ilm-modal">
        <button className="ilm-modal-close" onClick={onClose}><X size={16} /></button>
        <div className="ilm-modal-icon-wrap" style={{ background: "rgba(22,163,74,0.12)" }}>
          <div style={{ position: "relative" }}>
            <CheckCircle size={32} color="#16a34a" strokeWidth={2} />
            {/* sparkle dots */}
            <span style={{ position: "absolute", top: -6, right: -10, width: 6, height: 6, borderRadius: "50%", background: "#F97316" }} />
            <span style={{ position: "absolute", top: 0, left: -10, width: 5, height: 5, borderRadius: "50%", background: "#16a34a" }} />
            <span style={{ position: "absolute", bottom: -6, right: -6, width: 4, height: 4, borderRadius: "50%", background: "#F97316" }} />
          </div>
        </div>
        <h2 className="ilm-modal-title">Congratulations!</h2>
        <p className="ilm-modal-sub">Your account setup is complete. You can now access your personalized dashboard freely.</p>
        <div className="ilm-success-badge">
          <CheckCircle size={16} color="#16a34a" />
          <span>Dashboard Unlocked</span>
        </div>
        <button className="ilm-btn-green" onClick={onGoToDashboard}>
          Go To Dashboard
        </button>
      </div>
    </div>
  );
}

/* ─── PROGRESS CARD (Hero side card) ────────────────────────────────────── */
function SetupProgressCard({ profileCompleted, planSelected, onCompleteSetup }) {
  const steps = [
    { label: "Profile", done: profileCompleted, pendingLabel: "Pending", doneLabel: "Completed" },
    { label: "Plan", done: planSelected, pendingLabel: "Pending", doneLabel: "Completed" },
    { label: "Dashboard", done: profileCompleted && planSelected, pendingLabel: "Locked", doneLabel: "Unlocked", isLock: true },
  ];
  const completedCount = steps.filter((s) => s.done).length;
  const pct = Math.round((completedCount / steps.length) * 100);

  return (
    <div className="setup-card">
      <div className="setup-card-header">
        <span className="setup-card-title">Complete Setup</span>
        <span className="setup-card-pct">{pct}%</span>
      </div>
      <div className="setup-progress-bar">
        <div className="setup-progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="setup-steps">
        {steps.map((s, i) => (
          <div key={i} className="setup-step">
            <div className="setup-step-left">
              {s.done ? <Check size={14} color="#16a34a" strokeWidth={2.5} /> : s.isLock ? <Lock size={13} color="#F97316" strokeWidth={2} /> : <Clock size={13} color="#F97316" strokeWidth={2} />}
              <span className="setup-step-label">{s.label}</span>
            </div>
            <span className={`setup-step-status ${s.done ? "done" : s.isLock && !s.done ? "locked" : "pending"}`}>
              {s.done ? s.doneLabel : s.isLock ? s.pendingLabel : s.pendingLabel}
            </span>
          </div>
        ))}
      </div>
      <button className="setup-card-btn" onClick={onCompleteSetup}>
        Complete Setup
      </button>
    </div>
  );
}

/* ─── LOGIN MODAL ────────────────────────────────────────────────────────── */
function LoginModal({ onClose, onGoogleSuccess }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const redirectByRole = (role) => {
    onClose();
    const r = (role || "").toUpperCase();
    switch (r) {
      case "SUPER_ADMIN": navigate("/superadmin", { replace: true }); break;
      case "ADMIN": case "TENANT_ADMIN": case "BUSINESS": navigate("/admin", { replace: true }); break;
      case "TRAINER": navigate("/trainer", { replace: true }); break;
      default: navigate("/student", { replace: true });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const ok = await auth.login({ email, password });
      if (ok) {
        const role = (auth.getCurrentRole() || "STUDENT").toUpperCase();
        localStorage.setItem("role", role);
        localStorage.setItem("lms_user", JSON.stringify({
          email,
          role: ["TENANT_ADMIN", "ADMIN", "BUSINESS"].includes(role) ? "admin" : role.toLowerCase(),
          profileCompleted: false,
          isGoogleUser: false,
        }));
        redirectByRole(role);
      } else {
        alert("Login failed! Check your credentials.");
      }
    } catch (err) {
      alert("Login error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (res) => {
    try {
      localStorage.removeItem("lms_token");
      localStorage.removeItem("lms_user");
      localStorage.removeItem("role");
      const dec = jwtDecode(res.credential);
      const check = await auth.checkGoogleUser({ idToken: res.credential });
      if (check.isNewUser === false && check.token && check.role) {
        const role = check.role.toUpperCase();
        localStorage.setItem("lms_token", check.token);
        localStorage.setItem("role", role);
        if (check.organizationId) localStorage.setItem("organizationId", check.organizationId);
        else localStorage.removeItem("organizationId");
        localStorage.setItem("lms_user", JSON.stringify({
          name: check.name || dec.name,
          email: check.email || dec.email,
          role: ["TENANT_ADMIN", "ADMIN", "BUSINESS"].includes(role) ? "admin" : role.toLowerCase(),
          isGoogleUser: true,
          profileCompleted: !!check.profileCompleted,
          organizationId: check.organizationId || null,
        }));
        onClose();
        redirectByRole(role);
        return;
      }
      localStorage.removeItem("lms_token");
      localStorage.removeItem("lms_user");
      localStorage.removeItem("role");
      sessionStorage.setItem("ilmora_google_credential", res.credential);
      onClose();
      onGoogleSuccess && onGoogleSuccess({ name: dec.name, email: dec.email, googleCredential: res.credential });
    } catch (err) {
      try {
        const dec = jwtDecode(res.credential);
        localStorage.removeItem("lms_token");
        localStorage.removeItem("lms_user");
        localStorage.removeItem("role");
        sessionStorage.setItem("ilmora_google_credential", res.credential);
        onClose();
        onGoogleSuccess && onGoogleSuccess({ name: dec.name, email: dec.email, googleCredential: res.credential });
      } catch (_) {
        alert("Google login failed. Please try again.");
      }
    }
  };

  const EyeOpen = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  );
  const EyeOff = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );

  return (
    <div className="lm-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="lm-box">
        <button className="lm-close" onClick={onClose} aria-label="Close">✕</button>
        <div className="lm-logo" onClick={onClose}>
          <span style={{ color: "#16a34a" }}>ILM</span><span style={{ color: "#F97316" }}>ORA</span>
        </div>
        <div className="lm-heading">
          <h2>Welcome back!</h2>
          <p>Don't have an account?{" "}
            <button onClick={() => { onClose(); navigate("/complete-profile"); }}>Apply now</button>
          </p>
        </div>
        <div className="lm-google-wrap">
          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => console.error("Google OAuth failed")} theme="outline" size="large" text="continue_with" shape="rectangular" width="372" auto_select={false} cancel_on_tap_outside={true} />
          </GoogleOAuthProvider>
        </div>
        <div className="lm-or">
          <div className="lm-or-line" /><span className="lm-or-text">OR</span><div className="lm-or-line" />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="lm-field">
            <label>Email</label>
            <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} />
          </div>
          <div className="lm-field">
            <label>Password</label>
            <div className="lm-pw-wrap">
              <input type={showPassword ? "text" : "password"} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading} />
              <button type="button" className="lm-eye" onClick={() => setShowPassword((p) => !p)} tabIndex={-1}>
                {showPassword ? <EyeOff /> : <EyeOpen />}
              </button>
            </div>
          </div>
          <div className="lm-forgot">
            <button type="button" onClick={() => { onClose(); navigate("/forgot-password"); }}>Forgot password?</button>
          </div>
          <button type="submit" className="lm-submit" disabled={loading}>
            {loading ? (<><span className="lm-spinner" />Signing in…</>) : "Log in"}
          </button>
        </form>
        <div className="lm-back-home">
          <button onClick={() => { onClose(); navigate("/"); }}>← Back to home</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Role-based Features ────────────────────────────────────────────────── */
const ROLE_CONFIG = {
  student: {
    title: "Everything You Need to Learn",
    features: [
      { Icon: BookOpen, name: "My Courses", desc: "Access all enrolled courses, track progress and continue learning right where you left off.", route: "/student/my-courses", badge: "Popular" },
      { Icon: FileText, name: "Assignments", desc: "View, submit and track your assignments with instructor feedback and deadlines.", route: "/student/assignments" },
      { Icon: Radio, name: "Live Classes", desc: "Join live interactive sessions with trainers in real time. Ask questions, collaborate.", route: "/student/live-classes" },
      { Icon: Award, name: "Certificates", desc: "Download and share your completion certificates to boost your LinkedIn profile.", route: "/student/certificates", badge: "Hot" },
      { Icon: FileUser, name: "Resume Builder", desc: "Build an AI-powered resume showcasing your skills, courses and certifications.", route: "/student/resume-builder" },
      { Icon: Map, name: "Skill Map", desc: "Visualise your entire skill journey, gaps and recommended learning paths on one map.", route: "/student/skill-map" },
      { Icon: BarChart2, name: "Assessments", desc: "Test your knowledge with quizzes and auto-graded assessments mapped to each course module.", route: "/student/assessments" },
      { Icon: CalendarCheck, name: "Attendance", desc: "View your class attendance records and keep track of sessions attended.", route: "/student/attendance" },
      { Icon: Video, name: "Recorded Classes", desc: "Rewatch any live class recording at your own pace whenever you need.", route: "/student/recorded-classes" },
      { Icon: Bot, name: "AI Companion", desc: "Your personal AI tutor — ask questions, get explanations and study smarter 24/7.", route: "/student/ai-companion", badge: "AI" },
      { Icon: NotebookPen, name: "Notebook", desc: "Take notes directly inside courses and sync them for review later.", route: "/student/notebook" },
      { Icon: MessageCircleQuestion, name: "Doubts", desc: "Raise doubts and get answers from trainers and peers — never get stuck again.", route: "/student/doubts" },
    ],
  },
  trainer: {
    title: "Everything You Need to Teach",
    features: [
      { Icon: Users, name: "Batch Management", desc: "Create and manage student batches, assign courses and track overall batch performance.", route: "/trainer/batches", badge: "Core" },
      { Icon: CalendarCheck, name: "Attendance", desc: "Mark and monitor student attendance across all your live sessions and classes.", route: "/trainer/attendance" },
      { Icon: ClipboardList, name: "Assignment Mgmt", desc: "Create assignments, set deadlines, review submissions and give detailed feedback.", route: "/trainer/assignments" },
      { Icon: Radio, name: "Live Sessions", desc: "Start and manage live interactive classes with students using built-in tools.", route: "/trainer/live-session", badge: "Live" },
      { Icon: TrendingUp, name: "Reports", desc: "Detailed performance reports for individual students and entire batches.", route: "/trainer/reports" },
      { Icon: Upload, name: "Upload Content", desc: "Upload videos, documents and course materials for students to access anytime.", route: "/trainer/upload-content" },
      { Icon: Bot, name: "AI Companion", desc: "Use AI to auto-generate course content, quiz questions and learning plans.", route: "/trainer/ai-companion", badge: "AI" },
      { Icon: FileText, name: "Assessments", desc: "Build quizzes and assessments to evaluate student knowledge at every milestone.", route: "/trainer/assessments" },
      { Icon: Film, name: "Recorded Classes", desc: "Manage your library of recorded class sessions for student replay.", route: "/trainer/recorded-classes" },
      { Icon: BarChart2, name: "Performance", desc: "Deep-dive analytics on student engagement, completion rates and skill scores.", route: "/trainer/performance-analysis" },
      { Icon: Map, name: "Skill Map", desc: "Design skill maps to guide students from beginner to expert in your domain.", route: "/trainer/skill-map" },
      { Icon: Layers, name: "Classroom", desc: "Manage your virtual classroom: materials, tools, whiteboard and student roster.", route: "/trainer/classroom" },
    ],
  },
  business: {
    title: "Everything You Need to Manage",
    features: [
      { Icon: LayoutDashboard, name: "Org Dashboard", desc: "Bird's-eye view of your entire organisation's learning activity and KPIs.", route: "/admin/dashboard", badge: "Core" },
      { Icon: UserCog, name: "Team Management", desc: "Add employees, assign roles, manage departments and track team-level progress.", route: "/admin/users" },
      { Icon: PieChart, name: "Analytics", desc: "Advanced analytics on course completion, skill development and ROI of training spend.", route: "/admin/reports", badge: "New" },
      { Icon: FileBarChart, name: "Reports", desc: "Export detailed reports on individual and team performance for leadership reviews.", route: "/admin/org-reports" },
      { Icon: Handshake, name: "Partnership Programs", desc: "Set up partnership programs, co-branded batches and joint certification programs.", route: "/admin/org-settings" },
      { Icon: UserCheck, name: "Employee Progress", desc: "Track every employee's learning journey, skill gaps and upcoming milestones.", route: "/admin/students" },
      { Icon: Building2, name: "Manage Batches", desc: "Create bulk batches, assign trainers and enroll employees in one click.", route: "/admin/batches" },
      { Icon: Library, name: "All Courses", desc: "Browse and assign from the full ILM ORA course catalog to your team.", route: "/admin/all-courses" },
      { Icon: GitBranch, name: "Branches", desc: "Manage multiple office locations or departments as separate branches.", route: "/admin/branches" },
      { Icon: Tag, name: "Categories", desc: "Organise courses and skills into categories aligned with your business needs.", route: "/admin/categories" },
      { Icon: ServerCog, name: "File Management", desc: "Centralised file library for all training materials across your organisation.", route: "/admin/file-list" },
      { Icon: MonitorPlay, name: "Live Sessions", desc: "Schedule and monitor company-wide live training sessions and webinars.", route: "/admin/live-sessions" },
    ],
  },
  partnership: {
    title: "Everything You Need to Grow",
    features: [
      { Icon: Handshake, name: "Partnership Programs", desc: "Create and manage co-branded partnership programs with academic and corporate partners.", route: "/partnership/programs", badge: "Core" },
      { Icon: Users, name: "Lead Management", desc: "Track and convert partnership leads through a dedicated pipeline built for growth teams.", route: "/partnership/leads" },
      { Icon: BookOpen, name: "Co-Branded Courses", desc: "Launch and manage co-branded courses jointly created with partner organisations.", route: "/partnership/co-branded-courses" },
      { Icon: DollarSign, name: "Revenue Sharing", desc: "Track revenue splits, payouts and earnings across every active partnership in real time.", route: "/partnership/revenue-sharing", badge: "New" },
      { Icon: BarChart2, name: "Reports", desc: "Detailed performance reports across all partnership programs, leads and channels.", route: "/partnership/reports" },
      { Icon: Award, name: "Certifications", desc: "Issue and manage co-branded certifications for learners completing partner programs.", route: "/partnership/certifications" },
    ],
  },
};

const BASE = "https://ilm.ora.texora.ai";

const STATS = [
  { value: "500+", label: "Early Learners" },
  { value: "15+", label: "Expert Mentors" },
  { value: "20+", label: "Courses Live" },
  { value: "4.9★", label: "Average Rating" },
];

const TOOLS = [
  { icon: "texora", desc: "AI-powered platform redefining professional growth, automation and business intelligence at scale.", tags: ["AI Platform", "Flagship"], key: "texora", route: "https://texora.ai/" },
  { icon: "tora-cx", desc: "Customer experience platform powered by AI. Automate support, boost satisfaction and retain more users.", tags: ["Customer AI", "Free Trial"], key: "tora-cx", route: "https://tora-cx.texora.ai/" },
  { icon: "crm", desc: "Smart CRM built for modern teams. Track leads, manage pipelines and close deals faster with AI insights.", tags: ["CRM", "Free"], key: "crmorbit", route: "https://crm-orbit.texora.ai/" },
  { icon: "ilm_ora", desc: "AI-powered learning platform. World-class courses, skill assessments, resume builder & mock interviews.", tags: ["EdTech", "You are here"], key: "ilmora", route: "https://ilm.ora.texora.ai/" },
  { icon: "taskorbit", desc: "Smarter task & team management. AI nudges, goal tracking and workflow automation in one clean space.", tags: ["Productivity", "Free"], key: "taskorbit", route: "https://task-orbit.texora.ai/" },
  { icon: "innovara", desc: "Next-gen AI innovation suite. Build, deploy and scale AI solutions for your business effortlessly.", tags: ["AI Builder", "Beta"], key: "innovora", route: "https://texora.ai/innovora-ai" },
];

const BLOG_POSTS = [
  { cover: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=700&q=80", title: "How ILM ORA Is Redefining Professional Learning in 2026", cat: "Platform Updates", date: "Mar 26, 2026", reads: 4, featured: true, excerpt: "From AI-powered skill scores to real-time mentor sessions — here's how ILM ORA is changing the game for working professionals." },
  { cover: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&q=80", title: "Task Orbit: A Smarter Way to Manage Learning Teams", cat: "Product Updates", date: "Mar 23, 2026", reads: 7, excerpt: "Built for team leads and L&D managers who want clarity, automation, and zero friction." },
  { cover: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=80", title: "What Is a Skill Score? And Why It Decides Your Career", cat: "How-To Guides", date: "Mar 23, 2026", reads: 5, excerpt: "Your Skill Score is more than a number — it's a career signal that employers and mentors are watching." },
  { cover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80", title: "Why 'Course Sync' Might Be the Missing Piece in Your Growth", cat: "Use Cases", date: "Mar 20, 2026", reads: 3, excerpt: "Synchronising your learning goals with your team calendar sounds simple. The results are anything but." },
];

const ICON_COLORS = ["#F97316", "#16a34a", "#6366f1", "#ec4899", "#0ea5e9", "#f59e0b", "#10b981", "#8b5cf6", "#ef4444", "#14b8a6", "#f97316", "#3b82f6"];

/* ─── Main Demo Page ─────────────────────────────────────────────────────── */
export default function IlmOraDemoPage() {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showRolePopup, setShowRolePopup] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);

  // New popup states
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [theme, setTheme] = useState(() => localStorage.getItem("ilmora-theme") || "light");
  useEffect(() => { localStorage.setItem("ilmora-theme", theme); }, [theme]);
  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  // New multi-toast system
  const [toasts, setToasts] = useState([]);
  const toastIdRef = useRef(0);

  const addToast = useCallback(({ type = "success", title, desc, duration = 3500 }) => {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev, { id, type, title, desc, exiting: false, onClose: () => removeToast(id) }]);
    setTimeout(() => {
      setToasts((prev) => prev.map((t) => t.id === id ? { ...t, exiting: true } : t));
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 350);
    }, duration);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.map((t) => t.id === id ? { ...t, exiting: true } : t));
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 350);
  };

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  useEffect(() => {
    const handler = (e) => { if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false); };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const [googleUserInfo, setGoogleUserInfo] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem("lms_token");
    if (token) { sessionStorage.removeItem("ilmora_google_user"); sessionStorage.removeItem("ilmora_google_credential"); return; }
    const saved = sessionStorage.getItem("ilmora_google_user");
    if (saved) { try { setGoogleUserInfo(JSON.parse(saved)); } catch (e) {} }
  }, []);

  const getSavedUser = () => {
    try { return JSON.parse(localStorage.getItem("lms_user") || "{}"); } catch { return {}; }
  };

  const savedUser = getSavedUser();
  const isLoggedIn = !!localStorage.getItem("lms_token");
  const userName = savedUser?.name || savedUser?.email?.split("@")[0] || "there";
  const userEmail = savedUser?.email || "";

  const normalizeAppRole = (raw) => {
    const r = (raw || "").toString().trim().toUpperCase();
    if (["TENANT_ADMIN", "ADMIN", "BUSINESS", "MANAGER"].includes(r)) return "admin";
    if (r === "TRAINER") return "trainer";
    if (r === "STUDENT") return "student";
    return "";
  };

  const userRole = normalizeAppRole(savedUser?.role) || normalizeAppRole(localStorage.getItem("role")) || "student";
  const userInitial = (userName || "U").trim().charAt(0).toUpperCase();
  const featureRoleKey = userRole === "admin" ? "business" : userRole === "trainer" ? "trainer" : "student";

  // Setup state
  const profileCompleted = !!getSavedUser()?.profileCompleted;
  const planSelected = !!localStorage.getItem("selectedPlan");

  useEffect(() => {
    const token = localStorage.getItem("lms_token");
    const user = getSavedUser();
    if (!token && user?.isNewUser === true) setShowRolePopup(true);
  }, []);

  // Show welcome toast on mount if logged in
  useEffect(() => {
    if (isLoggedIn) {
      setTimeout(() => {
        addToast({ type: "success", title: "Welcome to ILM ORA!", desc: "Complete your profile and choose a plan to unlock your dashboard." });
      }, 800);
    }
  }, []);

  const handleRoleSkip = () => { setShowRolePopup(false); setGoogleUserInfo(null); };
  const handleGoogleNewUser = (googleInfo) => {
    sessionStorage.setItem("ilmora_google_credential", googleInfo.googleCredential);
    sessionStorage.setItem("ilmora_google_user", JSON.stringify(googleInfo));
    setGoogleUserInfo(googleInfo);
    setShowRolePopup(true);
  };

  const handleSignOut = () => {
    localStorage.removeItem("lms_token"); localStorage.removeItem("lms_user"); localStorage.removeItem("role");
    localStorage.removeItem("organizationId"); localStorage.removeItem("selectedPlan");
    sessionStorage.removeItem("ilmora_google_user"); sessionStorage.removeItem("ilmora_google_credential");
    setUserMenuOpen(false);
    addToast({ type: "info", title: "Signed out", desc: "You have been signed out successfully." });
    navigate("/", { replace: true });
  };

  const handleGoToDashboard = () => {
    setUserMenuOpen(false);
    const user = getSavedUser();
    const prof = !!user?.profileCompleted;
    const plan = !!localStorage.getItem("selectedPlan");
    if (!prof) {
      addToast({ type: "warning", title: "Complete Your Profile", desc: "Please complete your profile before accessing the dashboard." });
      setShowProfileModal(true);
      return;
    }
    if (!plan) {
      addToast({ type: "info", title: "Choose a Plan", desc: "Please select a subscription plan to continue." });
      setShowPlanModal(true);
      return;
    }
    addToast({ type: "star", title: "Dashboard Unlocked!", desc: "Welcome to your personalized dashboard." });
    const dashRoute = featureRoleKey === "business" ? "admin" : featureRoleKey;
    setTimeout(() => navigate(`/${dashRoute}`), 500);
  };

  const handleCompleteSetupClick = () => {
    const user = getSavedUser();
    const prof = !!user?.profileCompleted;
    const plan = !!localStorage.getItem("selectedPlan");
    if (!prof) { setShowProfileModal(true); return; }
    if (!plan) { setShowPlanModal(true); return; }
    setShowSuccessModal(true);
  };

  const handleProfileModalComplete = () => {
    setShowProfileModal(false);
    setShowProfileForm(true);
  };

  const handleViewPlans = () => {
    setShowPlanModal(false);
    addToast({ type: "info", title: "Choose a Plan", desc: "Please select a subscription plan to continue." });
    navigate("/pricing?returnTo=/ilm-demo");
  };

  const handleProfileFormSuccess = () => {
    setShowProfileForm(false);
    addToast({ type: "success", title: "Profile Saved!", desc: "Now choose a plan to unlock your dashboard." });
    const plan = !!localStorage.getItem("selectedPlan");
    if (!plan) { setShowPlanModal(true); } else { setShowSuccessModal(true); }
  };

  const handleDashGateUpdateProfile = () => {
    setShowProfileModal(false);
    setShowProfileForm(true);
  };

  const scrollToId = (id) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }); };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const roleConfig = ROLE_CONFIG[featureRoleKey] || ROLE_CONFIG.student;
  const isDark = theme === "dark";

  // GSAP refs
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const featuresRef = useRef(null);
  const toolsRef = useRef(null);
  const blogRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(".d-hero-greeting", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 })
        .fromTo(".d-hero-name", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.55 }, "-=0.25")
        .fromTo(".d-hero-subtitle", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.45 }, "-=0.2")
        .fromTo(".d-hero-title", { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.2")
        .fromTo(".d-hero-typing", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.45 }, "-=0.25")
        .fromTo(".d-hero-btns", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.4 }, "-=0.2")
        .fromTo(".setup-card", { opacity: 0, x: 20, scale: 0.97 }, { opacity: 1, x: 0, scale: 1, duration: 0.5 }, "-=0.3");
    }, heroRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".d-stat", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.55, stagger: 0.1, ease: "power3.out", scrollTrigger: { trigger: statsRef.current, start: "top 85%" } });
    }, statsRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".d-feature-card", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.06, ease: "power3.out", scrollTrigger: { trigger: featuresRef.current, start: "top 85%" } });
    }, featuresRef);
    return () => ctx.revert();
  }, [featureRoleKey]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".d-tool-card", { opacity: 0, y: 40, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.08, ease: "power3.out", scrollTrigger: { trigger: toolsRef.current, start: "top 80%" } });
    }, toolsRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".d-blog-featured,.d-blog-side-card", { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power3.out", scrollTrigger: { trigger: blogRef.current, start: "top 85%" } });
    }, blogRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".d-cta", { opacity: 0, y: 40, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power3.out", scrollTrigger: { trigger: ctaRef.current, start: "top 85%" } });
    }, ctaRef);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .d-page[data-theme="light"] {
          --d-green:#16a34a; --d-orange:#F97316; --d-dark:#1E293B; --d-cream:#F6EDE6;
          --d-white:#fff; --d-gray:#64748b; --d-light:#f1f5f9;
          --d-bg:#F6EDE6; --d-bg2:#fff; --d-card-bg:#fff; --d-card-border:#e2e8f0;
          --d-nav-bg:#fff; --d-nav-border:#e5d9c8;
          --d-text:#1E293B; --d-text-muted:#64748b;
          --d-stats-bg:#1E293B; --d-stats-text:rgba(255,255,255,.5);
          --d-footer-bg:#fff; --d-footer-border:#e2e8f0;
          --d-hero-bg: linear-gradient(135deg,#F6EDE6 0%,#fff 60%,#F6EDE6 100%);
          --d-hero-title:#1E293B; --d-hero-sub:#64748b; --d-hero-greeting:#94a3b8; --d-hero-name:#1E293B;
          --d-tab-bg:#fff; --d-tab-border:#e2e8f0; --d-tab-color:#64748b;
          --d-toggle-bg:#f1f5f9; --d-toggle-border:#e2e8f0; --d-toggle-icon:#F97316;
          --d-dd-bg:#ffffff; --d-dd-border:#e2e8f0; --d-dd-shadow:0 16px 48px rgba(0,0,0,0.12);
          --d-dd-header-name:#1E293B; --d-dd-header-email:#64748b; --d-dd-divider:#f1f5f9;
          --d-dd-item-color:#475569; --d-dd-item-hover-bg:#f8fafc; --d-dd-item-hover-color:#1E293B;
          --d-dd-upgrade-color:#F97316; --d-dd-upgrade-hover-bg:rgba(249,115,22,0.06);
          --d-dd-signout-color:#ef4444; --d-dd-signout-hover-bg:rgba(239,68,68,0.06);
        }
        .d-page[data-theme="dark"] {
          --d-green:#22c55e; --d-orange:#fb923c; --d-dark:#f1f5f9; --d-cream:#1e293b;
          --d-white:#0f172a; --d-gray:#94a3b8; --d-light:#1e293b;
          --d-bg:#0f172a; --d-bg2:#0f172a; --d-card-bg:#1e293b; --d-card-border:#334155;
          --d-nav-bg:#0f172a; --d-nav-border:rgba(255,255,255,0.08);
          --d-text:#f1f5f9; --d-text-muted:#94a3b8;
          --d-stats-bg:#0b1424; --d-stats-text:rgba(255,255,255,.4);
          --d-footer-bg:#0b1424; --d-footer-border:#1e293b;
          --d-hero-bg: linear-gradient(135deg,#0b1424 0%,#0f172a 50%,#0b1424 100%);
          --d-hero-title:#f1f5f9; --d-hero-sub:#94a3b8; --d-hero-greeting:#64748b; --d-hero-name:#f1f5f9;
          --d-tab-bg:#1e293b; --d-tab-border:#334155; --d-tab-color:#94a3b8;
          --d-toggle-bg:#1e293b; --d-toggle-border:#334155; --d-toggle-icon:#fb923c;
          --d-dd-bg:#1e293b; --d-dd-border:#334155; --d-dd-shadow:0 16px 48px rgba(0,0,0,0.45);
          --d-dd-header-name:#f1f5f9; --d-dd-header-email:#64748b; --d-dd-divider:#334155;
          --d-dd-item-color:#94a3b8; --d-dd-item-hover-bg:#2d3f55; --d-dd-item-hover-color:#f1f5f9;
          --d-dd-upgrade-color:#fb923c; --d-dd-upgrade-hover-bg:rgba(251,146,60,0.1);
          --d-dd-signout-color:#f87171; --d-dd-signout-hover-bg:rgba(248,113,113,0.08);
        }

        .d-page { font-family:'DM Sans',sans-serif; min-height:100vh; background:var(--d-bg); color:var(--d-text); overflow-x:hidden; transition:background .3s,color .3s; }

        /* NAVBAR */
        .d-nav { position:sticky; top:0; z-index:100; display:flex; align-items:center; justify-content:space-between; padding:0 24px; height:68px; background:var(--d-nav-bg); backdrop-filter:blur(20px); border-bottom:1px solid var(--d-nav-border); box-shadow:0 1px 20px rgba(0,0,0,0.06); transition:background .3s,border-color .3s; }
        @media(min-width:768px){ .d-nav { padding:0 48px; } }
        .d-nav-logo { font-family:'Playfair Display',serif; font-size:1.6rem; font-weight:900; cursor:pointer; display:flex; align-items:center; gap:8px; }
        .d-beta { font-family:'DM Sans',sans-serif; font-size:0.58rem; font-weight:700; background:var(--d-orange); color:#fff; border-radius:6px; padding:2px 7px; letter-spacing:0.05em; }
        .d-nav-links { display:none; align-items:center; gap:4px; }
        @media(min-width:768px){ .d-nav-links { display:flex; } }
        .d-nav-link { font-size:0.82rem; font-weight:600; color:var(--d-text); background:none; border:none; padding:7px 14px; border-radius:8px; cursor:pointer; font-family:'DM Sans',sans-serif; transition:0.18s; }
        .d-nav-link:hover { background:var(--d-bg); color:var(--d-orange); }
        .d-nav-right { display:flex; align-items:center; gap:10px; }
        .d-btn-login { font-size:0.8rem; font-weight:600; color:var(--d-text-muted); background:var(--d-card-bg); border:1px solid var(--d-card-border); border-radius:10px; padding:8px 18px; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all 0.18s; box-shadow:0 1px 4px rgba(0,0,0,0.06); }
        .d-btn-login:hover { border-color:var(--d-orange); color:var(--d-orange); }
        .d-btn-signup { font-size:0.8rem; font-weight:700; color:#fff; background:#1E293B; border:none; border-radius:10px; padding:8px 20px; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all 0.18s; display:flex; align-items:center; gap:6px; box-shadow:0 4px 12px rgba(30,41,59,0.25); }
        .d-btn-signup:hover { background:#334155; transform:translateY(-1px); }
        .d-theme-toggle { width:40px; height:40px; background:var(--d-toggle-bg); border-radius:12px; border:1.5px solid var(--d-toggle-border); cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background .3s,border-color .3s,transform .2s; flex-shrink:0; color:var(--d-toggle-icon); }
        .d-theme-toggle:hover { transform:scale(1.1); box-shadow:0 4px 12px rgba(0,0,0,0.15); }
        .d-theme-toggle svg { display:block; width:20px; height:20px; }

        /* USER MENU */
        .d-user-menu-wrap { position:relative; }
        .d-user-trigger { display:flex; align-items:center; gap:6px; cursor:pointer; padding:4px 8px 4px 4px; border-radius:999px; transition:0.18s; }
        .d-user-trigger:hover { background:var(--d-bg); }
        .d-user-avatar { width:36px; height:36px; border-radius:50%; background:linear-gradient(135deg,#F97316,#ea580c); display:flex; align-items:center; justify-content:center; font-size:0.9rem; font-weight:800; color:#fff; border:2px solid rgba(249,115,22,.3); flex-shrink:0; user-select:none; }
        .d-user-arrow { transition:transform .25s; flex-shrink:0; color:var(--d-text-muted); }
        .d-user-arrow.open { transform:rotate(180deg); }
        .d-user-dropdown { position:absolute; top:calc(100% + 10px); right:0; background:var(--d-dd-bg); border:1px solid var(--d-dd-border); border-radius:14px; min-width:240px; padding:6px 0; box-shadow:var(--d-dd-shadow); opacity:0; transform:translateY(-8px) scale(.97); pointer-events:none; transition:all .2s cubic-bezier(.22,.61,.36,1); z-index:200; }
        .d-user-dropdown.open { opacity:1; transform:translateY(0) scale(1); pointer-events:all; }
        .d-user-dropdown-header { padding:14px 16px 12px; }
        .d-user-dropdown-name { font-size:.88rem; font-weight:700; color:var(--d-dd-header-name); margin-bottom:2px; }
        .d-user-dropdown-email { font-size:.72rem; color:var(--d-dd-header-email); }
        .d-user-dropdown-divider { height:1px; background:var(--d-dd-divider); margin:4px 0; }
        .d-user-dropdown-item { display:flex; align-items:center; gap:10px; width:100%; padding:10px 16px; font-size:.83rem; font-weight:600; color:var(--d-dd-item-color); cursor:pointer; transition:.15s; text-decoration:none; background:none; border:none; font-family:'DM Sans',sans-serif; text-align:left; }
        .d-user-dropdown-item:hover { background:var(--d-dd-item-hover-bg); color:var(--d-dd-item-hover-color); }
        .d-user-dropdown-item svg { flex-shrink:0; opacity:0.7; }
        .d-user-dropdown-item.upgrade { color:var(--d-dd-upgrade-color); }
        .d-user-dropdown-item.upgrade:hover { background:var(--d-dd-upgrade-hover-bg); }
        .d-user-dropdown-item.upgrade svg { opacity:1; }
        .d-user-dropdown-item.signout { color:var(--d-dd-signout-color); }
        .d-user-dropdown-item.signout:hover { background:var(--d-dd-signout-hover-bg); }
        .d-user-dropdown-item.signout svg { opacity:1; }

        /* HERO */
        .d-hero-wrap { background:var(--d-hero-bg); transition:background .3s; }
        .d-hero { padding:32px 24px 28px; display:flex; flex-direction:column; align-items:center; position:relative; overflow:hidden; max-width:1200px; margin:0 auto; }
        @media(min-width:900px){ .d-hero { flex-direction:row; align-items:flex-start; gap:32px; padding:40px 48px 32px; text-align:left; } }
        .d-hero::before { content:''; position:absolute; top:-100px; right:-100px; width:400px; height:400px; background:rgba(249,115,22,0.06); border-radius:50%; pointer-events:none; }
        .d-hero::after  { content:''; position:absolute; bottom:-80px; left:-80px; width:300px; height:300px; background:rgba(34,197,94,0.05); border-radius:50%; pointer-events:none; }
        .d-hero-content { flex:1; text-align:center; }
        @media(min-width:900px){ .d-hero-content { text-align:left; } }
        .d-hero-welcome { display:flex; flex-direction:column; align-items:center; gap:3px; margin-bottom:14px; }
        @media(min-width:900px){ .d-hero-welcome { align-items:flex-start; } }
        .d-hero-greeting { font-size:0.78rem; font-weight:600; color:var(--d-hero-greeting); display:flex; align-items:center; gap:7px; }
        .d-hero-name { font-family:'Playfair Display',serif; font-size:1.4rem; font-weight:900; color:var(--d-hero-name); }
        .d-hero-name .ora { color:var(--d-orange); }
        .d-hero-subtitle { font-size:0.8rem; color:var(--d-hero-sub); }
        .d-hero-title { font-family:'Playfair Display',serif; font-size:2rem; font-weight:900; line-height:1.1; color:var(--d-hero-title); margin-bottom:10px; }
        @media(min-width:768px){ .d-hero-title { font-size:2.8rem; } }
        .d-hero-title .ora { color:var(--d-orange); }
        .d-hero-title .ilm { color:var(--d-green); }
        .d-hero-typing { min-height:1.6em; margin-bottom:8px; font-size:0.92rem; color:var(--d-hero-sub); display:flex; align-items:center; justify-content:center; gap:6px; }
        @media(min-width:900px){ .d-hero-typing { justify-content:flex-start; } }
        .d-typewriter { color:var(--d-orange); font-weight:700; font-size:0.96rem; }
        .d-hero-btns { display:flex; gap:12px; justify-content:center; flex-wrap:wrap; }
        @media(min-width:900px){ .d-hero-btns { justify-content:flex-start; } }

        /* SETUP PROGRESS CARD */
        .setup-card { background:#fff; border-radius:18px; padding:22px 20px; box-shadow:0 8px 32px rgba(0,0,0,0.12); border:1.5px solid #f0e8df; min-width:220px; max-width:260px; width:100%; flex-shrink:0; margin-top:24px; }
        @media(min-width:900px){ .setup-card { margin-top:4px; } }
        .d-page[data-theme="dark"] .setup-card { background:#1e293b; border-color:#334155; box-shadow:0 8px 32px rgba(0,0,0,0.35); }
        .setup-card-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; }
        .setup-card-title { font-size:0.88rem; font-weight:700; color:var(--d-text); }
        .setup-card-pct { font-size:0.88rem; font-weight:800; color:#F97316; }
        .setup-progress-bar { height:6px; background:#f1f5f9; border-radius:99px; margin-bottom:16px; overflow:hidden; }
        .d-page[data-theme="dark"] .setup-progress-bar { background:#334155; }
        .setup-progress-fill { height:100%; background:linear-gradient(90deg,#F97316,#ea580c); border-radius:99px; transition:width 0.6s ease; }
        .setup-steps { display:flex; flex-direction:column; gap:12px; margin-bottom:16px; }
        .setup-step { display:flex; align-items:center; justify-content:space-between; }
        .setup-step-left { display:flex; align-items:center; gap:8px; }
        .setup-step-label { font-size:0.82rem; font-weight:600; color:var(--d-text); }
        .setup-step-status { font-size:0.72rem; font-weight:700; }
        .setup-step-status.done { color:#16a34a; }
        .setup-step-status.pending { color:#F97316; }
        .setup-step-status.locked { color:#F97316; }
        .setup-card-btn { width:100%; padding:11px; background:#F97316; color:#fff; border:none; border-radius:10px; font-size:0.82rem; font-weight:700; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all 0.18s; box-shadow:0 4px 14px rgba(249,115,22,0.3); }
        .setup-card-btn:hover { background:#ea6c0a; transform:translateY(-1px); }

        /* STATS */
        .d-stats { background:var(--d-stats-bg); padding:36px 24px; display:grid; grid-template-columns:repeat(2,1fr); gap:1px; transition:background .3s; }
        @media(min-width:640px){ .d-stats { grid-template-columns:repeat(4,1fr); padding:36px 48px; } }
        .d-stat { text-align:center; padding:20px 10px; }
        .d-stat-val { font-size:2rem; font-weight:800; color:var(--d-orange); }
        .d-stat-lbl { font-size:0.78rem; color:var(--d-stats-text); margin-top:4px; font-weight:500; }

        /* SECTIONS */
        .d-section { padding:64px 24px; background:var(--d-bg2); transition:background .3s; }
        .d-section-alt { background:var(--d-bg) !important; }
        @media(min-width:768px){ .d-section { padding:72px 48px; } }
        .d-section-inner { max-width:1200px; margin:0 auto; }
        .d-section-head { text-align:center; margin-bottom:40px; }
        .d-section-tag { display:inline-block; font-size:0.72rem; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:var(--d-orange); background:rgba(249,115,22,0.08); border:1px solid rgba(249,115,22,0.2); border-radius:999px; padding:4px 14px; margin-bottom:12px; }
        .d-section-title { font-family:'Playfair Display',serif; font-size:2rem; font-weight:900; color:var(--d-text); }
        @media(min-width:768px){ .d-section-title { font-size:2.6rem; } }
        .d-section-title .accent { color:var(--d-orange); }
        .d-section-sub { font-size:0.95rem; color:var(--d-text-muted); margin-top:8px; max-width:500px; margin-left:auto; margin-right:auto; }

        /* FEATURES */
        .d-features-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:16px; }
        .d-feature-card { background:var(--d-card-bg); border-radius:16px; border:1.5px solid var(--d-card-border); box-shadow:0 2px 12px rgba(0,0,0,.05); padding:22px 20px; transition:all .22s; display:flex; flex-direction:column; gap:12px; position:relative; overflow:hidden; text-align:left; font-family:'DM Sans',sans-serif; width:100%; cursor:default; }
        .d-feature-card::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(90deg,var(--d-orange),var(--d-green)); opacity:0; transition:.22s; }
        .d-feature-card:hover { border-color:rgba(249,115,22,.25); box-shadow:0 8px 24px rgba(249,115,22,.08); }
        .d-feature-card:hover::before { opacity:1; }
        .d-feature-icon { width:44px; height:44px; border-radius:12px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .d-feature-name { font-size:.95rem; font-weight:700; color:var(--d-text); }
        .d-feature-desc { font-size:.78rem; color:var(--d-text-muted); line-height:1.55; flex:1; }
        .d-feature-badge { position:absolute; top:12px; right:12px; font-size:.6rem; font-weight:700; background:var(--d-green); color:#fff; border-radius:6px; padding:2px 7px; }

        /* TOOLS */
        .d-tools-grid { display:grid; grid-template-columns:1fr; gap:16px; }
        @media(min-width:640px){ .d-tools-grid { grid-template-columns:repeat(3,1fr); } }
        .d-tool-card { background:var(--d-card-bg); border-radius:20px; padding:24px; cursor:pointer; border:1.5px solid var(--d-card-border); box-shadow:0 2px 12px rgba(0,0,0,0.05); transition:all 0.22s; display:flex; flex-direction:column; gap:14px; }
        .d-tool-card:hover { border-color:var(--d-orange); box-shadow:0 12px 32px rgba(249,115,22,0.15); transform:translateY(-4px); }
        .d-tool-icon { overflow:hidden; border-radius:10px; }
        .d-tool-desc { font-size:0.8rem; color:var(--d-text-muted); line-height:1.65; flex:1; }
        .d-tool-tags { display:flex; gap:7px; flex-wrap:wrap; margin-top:auto; }
        .d-tool-tag { font-size:0.65rem; font-weight:700; border-radius:999px; padding:3px 10px; background:rgba(249,115,22,0.08); color:var(--d-orange); border:1px solid rgba(249,115,22,0.2); }
        .d-tool-tag.green { background:rgba(34,197,94,0.08); color:var(--d-green); border-color:rgba(34,197,94,0.2); }
        .d-tool-cta { display:flex; align-items:center; justify-content:space-between; margin-top:4px; }
        .d-tool-try { font-size:0.78rem; font-weight:700; color:var(--d-orange); background:none; border:none; cursor:pointer; font-family:'DM Sans',sans-serif; padding:0; }

        /* BLOG */
        .d-blog-grid { display:grid; grid-template-columns:1fr; gap:20px; }
        @media(min-width:768px){ .d-blog-grid { grid-template-columns:1.6fr 1fr; gap:24px; } }
        .d-blog-featured { background:var(--d-card-bg); border-radius:20px; border:1.5px solid var(--d-card-border); box-shadow:0 2px 12px rgba(0,0,0,0.05); overflow:hidden; cursor:pointer; transition:all 0.22s; display:flex; flex-direction:column; }
        .d-blog-featured:hover { border-color:rgba(249,115,22,0.35); box-shadow:0 16px 40px rgba(0,0,0,0.1); transform:translateY(-4px); }
        .d-blog-featured-img { width:100%; height:220px; object-fit:cover; display:block; }
        @media(min-width:768px){ .d-blog-featured-img { height:258px; } }
        .d-blog-featured-body { padding:22px 24px 26px; display:flex; flex-direction:column; gap:10px; flex:1; }
        .d-blog-featured-badge { display:inline-flex; align-items:center; gap:5px; font-size:0.6rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:#fff; background:var(--d-orange); border-radius:6px; padding:3px 10px; width:fit-content; }
        .d-blog-featured-title { font-family:'Playfair Display',serif; font-size:1.2rem; font-weight:900; color:var(--d-text); line-height:1.3; }
        @media(min-width:768px){ .d-blog-featured-title { font-size:1.38rem; } }
        .d-blog-featured-excerpt { font-size:0.8rem; color:var(--d-text-muted); line-height:1.65; flex:1; }
        .d-blog-featured-meta { display:flex; align-items:center; gap:8px; font-size:0.68rem; color:var(--d-text-muted); margin-top:4px; flex-wrap:wrap; }
        .d-blog-featured-cat { color:var(--d-orange); font-weight:700; }
        .d-blog-side { display:flex; flex-direction:column; gap:14px; }
        .d-blog-side-card { background:var(--d-card-bg); border-radius:16px; border:1.5px solid var(--d-card-border); box-shadow:0 2px 8px rgba(0,0,0,0.04); padding:14px; cursor:pointer; transition:all 0.2s; display:flex; gap:12px; align-items:flex-start; }
        .d-blog-side-card:hover { border-color:rgba(249,115,22,0.3); box-shadow:0 8px 24px rgba(0,0,0,0.08); transform:translateX(4px); }
        .d-blog-side-img { width:72px; height:72px; border-radius:12px; object-fit:cover; flex-shrink:0; background:var(--d-light); }
        .d-blog-side-body { flex:1; display:flex; flex-direction:column; gap:5px; }
        .d-blog-side-cat { font-size:0.58rem; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:var(--d-orange); }
        .d-blog-side-title { font-size:0.82rem; font-weight:700; color:var(--d-text); line-height:1.4; }
        .d-blog-side-meta { font-size:0.66rem; color:var(--d-text-muted); display:flex; gap:5px; align-items:center; margin-top:2px; }
        .d-blog-dot { width:3px; height:3px; border-radius:50%; background:var(--d-card-border); flex-shrink:0; display:inline-block; }

        /* CTA */
        .d-cta { background:#1E293B; border-radius:24px; padding:56px 32px; text-align:center; margin:0 24px 64px; position:relative; overflow:hidden; }
        @media(min-width:768px){ .d-cta { margin:0 48px 80px; } }
        .d-cta::before { content:''; position:absolute; top:0; left:0; right:0; height:4px; background:linear-gradient(90deg,var(--d-orange),var(--d-green)); }
        .d-cta-title { font-family:'Playfair Display',serif; font-size:2.2rem; font-weight:900; color:#fff; margin-bottom:12px; }
        .d-cta-sub { color:rgba(255,255,255,0.55); font-size:0.95rem; margin-bottom:32px; }
        .d-cta-btns { display:flex; gap:12px; justify-content:center; flex-wrap:wrap; }
        .d-cta-primary { background:var(--d-orange); color:#fff; border:none; border-radius:12px; padding:14px 32px; font-size:0.9rem; font-weight:700; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all 0.18s; box-shadow:0 4px 16px rgba(249,115,22,0.4); }
        .d-cta-primary:hover { background:#ea6c0a; transform:translateY(-2px); }

        /* FOOTER */
        .d-footer-new { background:var(--d-footer-bg); color:var(--d-text); font-family:'DM Sans',sans-serif; border-top:1px solid var(--d-footer-border); transition:background .3s,color .3s; }
        .d-footer-inner { max-width:1200px; margin:0 auto; padding:64px 24px 0; }
        .d-footer-grid { display:grid; gap:32px; grid-template-columns:1fr; }
        @media(min-width:768px){ .d-footer-grid { grid-template-columns:1.6fr 1fr 1fr; } }
        @media(min-width:1024px){ .d-footer-grid { grid-template-columns:1.7fr 1fr 1fr 1fr 1.3fr; } }
        .d-footer-brand h3 { font-family:'Playfair Display',serif; font-size:1.8rem; font-weight:900; margin-bottom:12px; }
        .d-footer-brand p { font-size:0.82rem; color:var(--d-text-muted); line-height:1.65; max-width:280px; margin-bottom:16px; }
        .d-footer-email { display:flex; align-items:center; gap:8px; font-size:0.82rem; color:var(--d-text-muted); margin-bottom:18px; }
        .d-footer-email a { color:var(--d-text-muted); text-decoration:none; transition:color .18s; }
        .d-footer-email a:hover { color:var(--d-orange); }
        .d-footer-email svg { flex-shrink:0; color:var(--d-orange); }
        .d-footer-socials { display:flex; gap:10px; flex-wrap:wrap; }
        .d-footer-social-btn { width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#fff; transition:transform 0.2s; box-shadow:0 2px 6px rgba(0,0,0,0.15); flex-shrink:0; text-decoration:none; }
        .d-footer-social-btn:hover { transform:scale(1.1); }
        .d-footer-col h4 { font-size:0.78rem; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:var(--d-text); margin-bottom:14px; }
        .d-footer-col ul { list-style:none; display:flex; flex-direction:column; gap:8px; }
        .d-footer-col ul li { font-size:0.82rem; color:var(--d-text-muted); cursor:pointer; transition:color 0.18s; display:flex; align-items:center; gap:6px; }
        .d-footer-col ul li::before { content:''; width:5px; height:5px; border-radius:50%; background:var(--d-orange); opacity:0; transition:opacity .18s; flex-shrink:0; }
        .d-footer-col ul li:hover { color:var(--d-orange); }
        .d-footer-col ul li:hover::before { opacity:1; }
        .d-footer-newsletter h4 { font-size:0.92rem; font-weight:700; letter-spacing:0; text-transform:none; color:var(--d-text); margin-bottom:14px; }
        .d-footer-newsletter-input-wrap { display:flex; border-radius:10px; overflow:hidden; border:1px solid var(--d-card-border); background:var(--d-card-bg); }
        .d-footer-newsletter-input { flex:1; min-width:0; border:none; background:transparent; padding:10px 14px; font-size:0.78rem; color:var(--d-text); font-family:'DM Sans',sans-serif; outline:none; }
        .d-footer-newsletter-input::placeholder { color:var(--d-text-muted); opacity:0.7; }
        .d-footer-newsletter-btn { background:#1E293B; color:#fff; border:none; width:42px; flex-shrink:0; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:0.18s; }
        .d-footer-newsletter-btn:hover { background:var(--d-orange); }
        .d-footer-status { display:inline-flex; align-items:center; gap:6px; font-size:0.74rem; font-weight:600; color:var(--d-green); background:rgba(22,163,74,0.08); border:1px solid rgba(22,163,74,0.22); border-radius:999px; padding:5px 12px; margin-top:14px; }
        .d-footer-status-dot { width:7px; height:7px; border-radius:50%; background:var(--d-green); box-shadow:0 0 0 3px rgba(22,163,74,0.18); animation:pulse 2s infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        .d-footer-bottom { max-width:1200px; margin:0 auto; padding:20px 24px; border-top:1px solid var(--d-footer-border); margin-top:48px; display:flex; flex-direction:column; align-items:center; gap:8px; font-size:0.72rem; color:var(--d-text-muted); }
        @media(min-width:768px){ .d-footer-bottom { flex-direction:row; justify-content:space-between; } }

        /* ═══ NEW TOAST SYSTEM ═══ */
        .toast-container { position:fixed; bottom:28px; right:24px; z-index:2000; display:flex; flex-direction:column; gap:10px; pointer-events:none; }
        .toast-item { display:flex; align-items:flex-start; gap:12px; background:#fff; border-radius:14px; padding:14px 14px 14px 16px; min-width:260px; max-width:340px; box-shadow:0 8px 32px rgba(0,0,0,0.14),0 2px 8px rgba(0,0,0,0.06); border-left:4px solid #e2e8f0; pointer-events:all; position:relative; transition:all 0.3s cubic-bezier(.22,.61,.36,1); }
        .toast-enter { animation:toastIn 0.35s cubic-bezier(.22,.61,.36,1) forwards; }
        .toast-exit { animation:toastOut 0.3s ease forwards; }
        @keyframes toastIn { from{opacity:0;transform:translateX(40px) scale(0.95)} to{opacity:1;transform:translateX(0) scale(1)} }
        @keyframes toastOut { from{opacity:1;transform:translateX(0) scale(1)} to{opacity:0;transform:translateX(40px) scale(0.95)} }
        .toast-success { border-left-color:#16a34a; }
        .toast-warning { border-left-color:#F97316; }
        .toast-info { border-left-color:#3b82f6; }
        .toast-error { border-left-color:#ef4444; }
        .toast-star { border-left-color:#8b5cf6; }
        .toast-icon-wrap { width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:1px; }
        .toast-success .toast-icon-wrap { background:rgba(22,163,74,0.1); color:#16a34a; }
        .toast-warning .toast-icon-wrap { background:rgba(249,115,22,0.1); color:#F97316; }
        .toast-info .toast-icon-wrap { background:rgba(59,130,246,0.1); color:#3b82f6; }
        .toast-error .toast-icon-wrap { background:rgba(239,68,68,0.1); color:#ef4444; }
        .toast-star .toast-icon-wrap { background:rgba(139,92,246,0.1); color:#8b5cf6; }
        .toast-body { flex:1; min-width:0; }
        .toast-title { font-size:0.82rem; font-weight:700; color:#1E293B; line-height:1.3; }
        .toast-desc { font-size:0.74rem; color:#64748b; margin-top:3px; line-height:1.4; }
        .toast-close { background:none; border:none; cursor:pointer; color:#94a3b8; display:flex; align-items:center; justify-content:center; width:20px; height:20px; border-radius:50%; flex-shrink:0; margin-left:4px; transition:color 0.15s,background 0.15s; padding:0; }
        .toast-close:hover { background:#f1f5f9; color:#475569; }

        /* ═══ NEW POPUP MODALS ═══ */
        .ilm-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.55); z-index:1000; display:flex; align-items:center; justify-content:center; padding:20px; backdrop-filter:blur(6px); animation:ilmFade 0.2s ease; }
        @keyframes ilmFade { from{opacity:0} to{opacity:1} }
        .ilm-modal { background:#fff; border-radius:24px; padding:36px 32px 28px; width:100%; max-width:380px; position:relative; box-shadow:0 32px 80px rgba(0,0,0,0.18); animation:ilmUp 0.3s cubic-bezier(.22,.61,.36,1); text-align:center; }
        @keyframes ilmUp { from{opacity:0;transform:translateY(20px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        .ilm-modal-close { position:absolute; top:14px; right:14px; background:none; border:none; cursor:pointer; color:#94a3b8; width:30px; height:30px; display:flex; align-items:center; justify-content:center; border-radius:50%; transition:all 0.18s; }
        .ilm-modal-close:hover { background:#f1f5f9; color:#1E293B; }
        .ilm-modal-icon-wrap { width:60px; height:60px; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 16px; }
        .ilm-modal-title { font-family:'Playfair Display',serif; font-size:1.2rem; font-weight:900; color:#1e0e02; margin-bottom:8px; line-height:1.3; }
        .ilm-modal-sub { font-size:0.82rem; color:#8a6040; line-height:1.65; margin-bottom:20px; }
        .ilm-check-list { list-style:none; text-align:left; display:flex; flex-direction:column; gap:10px; margin-bottom:24px; padding:0 4px; }
        .ilm-check-list li { display:flex; align-items:center; gap:10px; font-size:0.82rem; color:#475569; font-weight:500; }
        .ilm-btn-primary { width:100%; padding:13px; background:linear-gradient(135deg,#F97316,#ea580c); color:#fff; border:none; border-radius:12px; font-size:0.9rem; font-weight:700; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all 0.18s; box-shadow:0 4px 16px rgba(249,115,22,0.35); margin-bottom:10px; display:block; }
        .ilm-btn-primary:hover { opacity:0.92; transform:translateY(-1px); }
        .ilm-btn-green { width:100%; padding:13px; background:linear-gradient(135deg,#16a34a,#15803d); color:#fff; border:none; border-radius:12px; font-size:0.9rem; font-weight:700; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all 0.18s; box-shadow:0 4px 16px rgba(22,163,74,0.35); margin-top:4px; display:block; }
        .ilm-btn-green:hover { opacity:0.92; transform:translateY(-1px); }
        .ilm-btn-ghost { width:100%; background:none; border:none; color:#94a3b8; font-family:'DM Sans',sans-serif; font-size:0.82rem; font-weight:600; cursor:pointer; padding:8px; transition:color 0.18s; display:block; }
        .ilm-btn-ghost:hover { color:#475569; }
        .ilm-success-badge { display:inline-flex; align-items:center; gap:8px; background:rgba(22,163,74,0.1); border:1px solid rgba(22,163,74,0.25); border-radius:999px; padding:8px 18px; font-size:0.82rem; font-weight:700; color:#16a34a; margin:0 auto 20px; }

        /* LOGIN MODAL */
        .lm-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.55); z-index:1000; display:flex; align-items:center; justify-content:center; padding:20px; backdrop-filter:blur(4px); animation:lmFade 0.2s ease; }
        @keyframes lmFade { from{opacity:0} to{opacity:1} }
        .lm-box { background:#fff; border-radius:20px; padding:32px 28px; width:100%; max-width:420px; position:relative; box-shadow:0 24px 64px rgba(0,0,0,0.2); animation:lmUp 0.3s ease; }
        @keyframes lmUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .lm-close { position:absolute; top:16px; right:16px; background:none; border:none; font-size:1rem; cursor:pointer; color:#94a3b8; width:28px; height:28px; display:flex; align-items:center; justify-content:center; border-radius:50%; transition:all 0.18s; }
        .lm-close:hover { background:#f1f5f9; color:#1E293B; }
        .lm-logo { font-family:'Playfair Display',serif; font-size:2rem; font-weight:900; text-align:center; margin-bottom:8px; cursor:pointer; }
        .lm-heading { text-align:center; margin-bottom:20px; }
        .lm-heading h2 { font-size:1.2rem; font-weight:700; color:#1e0e02; margin-bottom:6px; }
        .lm-heading p { font-size:0.84rem; color:#8a6040; }
        .lm-heading p button { background:none; border:none; cursor:pointer; color:#F97316; font-family:'DM Sans',sans-serif; font-size:0.84rem; font-weight:700; padding:0; }
        .lm-heading p button:hover { text-decoration:underline; }
        .lm-google-wrap { width:100%; margin-bottom:14px; display:flex; justify-content:center; }
        .lm-or { display:flex; align-items:center; gap:12px; margin-bottom:14px; }
        .lm-or-line { flex:1; height:1px; background:rgba(180,100,30,0.15); }
        .lm-or-text { font-size:0.7rem; color:#b8906a; letter-spacing:0.1em; text-transform:uppercase; }
        .lm-field { margin-bottom:12px; }
        .lm-field label { display:block; font-size:0.72rem; font-weight:700; color:#8a6040; margin-bottom:5px; letter-spacing:0.06em; text-transform:uppercase; }
        .lm-field input { width:100%; padding:11px 14px; background:rgba(255,255,255,0.8); border:1.5px solid rgba(180,120,60,0.2); border-radius:10px; color:#1a0e06; font-family:'DM Sans',sans-serif; font-size:0.875rem; outline:none; transition:border-color 0.2s,box-shadow 0.2s; }
        .lm-field input::placeholder { color:#c0a070; }
        .lm-field input:focus { border-color:#F97316; box-shadow:0 0 0 3px rgba(249,115,22,0.1); background:#fff; }
        .lm-pw-wrap { position:relative; }
        .lm-pw-wrap input { padding-right:44px; }
        .lm-eye { position:absolute; right:12px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; color:#b8906a; display:flex; align-items:center; padding:0; transition:color 0.2s; }
        .lm-eye:hover { color:#F97316; }
        .lm-forgot { text-align:right; margin:6px 0 14px; }
        .lm-forgot button { background:none; border:none; cursor:pointer; color:#F97316; font-family:'DM Sans',sans-serif; font-size:0.78rem; font-weight:500; }
        .lm-forgot button:hover { text-decoration:underline; }
        .lm-submit { width:100%; padding:13px; background:linear-gradient(135deg,#F97316,#ea580c); color:#fff; font-family:'DM Sans',sans-serif; font-weight:700; font-size:0.95rem; border:none; border-radius:10px; cursor:pointer; transition:opacity 0.2s,transform 0.15s; box-shadow:0 4px 18px rgba(249,115,22,0.32); display:flex; align-items:center; justify-content:center; gap:8px; }
        .lm-submit:hover:not(:disabled) { opacity:0.9; transform:translateY(-1px); }
        .lm-submit:disabled { opacity:0.5; cursor:not-allowed; }
        .lm-spinner { width:13px; height:13px; border:2px solid rgba(255,255,255,0.3); border-top-color:#fff; border-radius:50%; animation:spin 0.7s linear infinite; }
        @keyframes spin { to{transform:rotate(360deg)} }
        .lm-back-home { text-align:center; margin-top:14px; }
        .lm-back-home button { background:none; border:none; cursor:pointer; color:#94a3b8; font-family:'DM Sans',sans-serif; font-size:0.78rem; }
        .lm-back-home button:hover { color:#475569; }
      `}</style>

      <div className="d-page" data-theme={theme}>

        {/* ═══ MODALS ═══ */}
        {showLogin && <LoginModal onClose={() => setShowLogin(false)} onGoogleSuccess={handleGoogleNewUser} />}

        {showRolePopup && (
          <CompleteProfile
            onSkip={handleRoleSkip}
            prefillName={googleUserInfo?.name || ""}
            prefillEmail={googleUserInfo?.email || ""}
            googleCredential={googleUserInfo?.googleCredential || null}
            isGoogleUser={!!googleUserInfo}
          />
        )}

        {/* New flow modals */}
        {showProfileModal && (
          <ProfileIncompleteModal
            onClose={() => setShowProfileModal(false)}
            onCompleteProfile={handleProfileModalComplete}
          />
        )}
        {showPlanModal && (
          <PlanNotSelectedModal
            onClose={() => setShowPlanModal(false)}
            onViewPlans={handleViewPlans}
          />
        )}
        {showSuccessModal && (
          <SuccessModal
            onClose={() => setShowSuccessModal(false)}
            onGoToDashboard={() => {
              setShowSuccessModal(false);
              const dashRoute = featureRoleKey === "business" ? "admin" : featureRoleKey;
              navigate(`/${dashRoute}`);
            }}
          />
        )}

        {showProfileForm && (
          <ProfileDetailsForm
            role={userRole === "admin" ? "Manager" : userRole === "trainer" ? "trainer" : "student"}
            name={userName}
            email={userEmail}
            token={localStorage.getItem("lms_token") || ""}
            onSuccess={handleProfileFormSuccess}
            onBack={() => setShowProfileForm(false)}
            isEditMode={false}
          />
        )}

        {/* ═══ NAVBAR ═══ */}
        <nav className="d-nav">
          <div className="d-nav-logo" onClick={() => navigate("/")}>
            <span style={{ color: "#16a34a" }}>ILM</span>
            <span style={{ color: "#F97316" }}> ORA</span>
            <span className="d-beta">BETA</span>
          </div>
          <div className="d-nav-links">
            <button className="d-nav-link" onClick={() => scrollToId("features")}>Features</button>
            <button className="d-nav-link" onClick={() => scrollToId("tools")}>Products</button>
            <button className="d-nav-link" onClick={() => scrollToId("blog")}>Blog</button>
          </div>
          <div className="d-nav-right">
            <button className="d-theme-toggle" onClick={toggleTheme} title={isDark ? "Switch to light mode" : "Switch to dark mode"} aria-label="Toggle theme">
              {isDark ? <Sun size={20} strokeWidth={2} color="var(--d-toggle-icon)" /> : <Moon size={20} strokeWidth={2} color="var(--d-toggle-icon)" />}
            </button>
            {isLoggedIn ? (
              <div className="d-user-menu-wrap" ref={userMenuRef}>
                <div className="d-user-trigger" onClick={() => setUserMenuOpen((o) => !o)}>
                  <div className="d-user-avatar">{userInitial}</div>
                  <svg className={`d-user-arrow ${userMenuOpen ? "open" : ""}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
                <div className={`d-user-dropdown ${userMenuOpen ? "open" : ""}`}>
                  <div className="d-user-dropdown-header">
                    <div className="d-user-dropdown-name">{userName}</div>
                    <div className="d-user-dropdown-email">{userEmail}</div>
                  </div>
                  <div className="d-user-dropdown-divider" />
                  <button className="d-user-dropdown-item" onClick={() => { setUserMenuOpen(false); setShowProfileForm(true); }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                    Profile
                  </button>
                  <button className="d-user-dropdown-item upgrade" onClick={() => { setUserMenuOpen(false); navigate("/pricing"); }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                    Upgrade Plan
                  </button>
                  <button className="d-user-dropdown-item" onClick={handleGoToDashboard}>
                    <DashboardIcon size={16} />
                    Go to Dashboard
                  </button>
                  <div className="d-user-dropdown-divider" />
                  <button className="d-user-dropdown-item signout" onClick={handleSignOut}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                    Sign out
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </nav>

        {/* ═══ HERO ═══ */}
        <div className="d-hero-wrap">
          <div className="d-hero" ref={heroRef}>
            <div className="d-hero-content">
              <div className="d-hero-welcome">
                <div className="d-hero-greeting"><span>👋</span> {greeting}</div>
                <div className="d-hero-name">Welcome back, <span className="ora">{userName}</span></div>
                <div className="d-hero-subtitle">Your AI-powered learning hub is ready. Pick up where you left off.</div>
              </div>
              <h1 className="d-hero-title">
                Become the <span className="ora">Top 1%</span><br />
                with <span className="ilm">ILM</span> <span className="ora">ORA</span>
              </h1>
              <div className="d-hero-typing">
                <TypeWriter
                  className="d-typewriter"
                  texts={["Start today. Stay consistent.", "Your next milestone awaits.", "Learning compounds. Keep going.", "Top 1% is a daily choice.", "Built for ambitious professionals."]}
                  typingSpeed={70}
                  deletingSpeed={40}
                  pauseDuration={1800}
                  showCursor
                  cursorCharacter="_"
                  cursorBlinkDuration={0.5}
                />
              </div>
              <div className="d-hero-btns" />
            </div>

            {/* Setup Progress Card */}
            {isLoggedIn && (
              <SetupProgressCard
                profileCompleted={profileCompleted}
                planSelected={planSelected}
                onCompleteSetup={handleCompleteSetupClick}
              />
            )}
          </div>
        </div>

        {/* ═══ FEATURES ═══ */}
        <section className="d-section" ref={featuresRef} id="features">
          <div className="d-section-inner">
            <div className="d-section-head">
              <div className="d-section-tag">Platform Features</div>
              <h2 className="d-section-title">
                {(() => {
                  const words = roleConfig.title.split(" ");
                  const accent = words.pop();
                  return <>{words.join(" ")} <span className="accent">{accent}</span></>;
                })()}
              </h2>
              <p className="d-section-sub">A quick look at everything available to you on the platform</p>
            </div>
            <div className="d-features-grid">
              {roleConfig.features.map((f, idx) => {
                const color = ICON_COLORS[idx % ICON_COLORS.length];
                return (
                  <div key={f.name} className="d-feature-card">
                    {f.badge && <span className="d-feature-badge">{f.badge}</span>}
                    <div className="d-feature-icon" style={{ background: `${color}18`, color }}>
                      <f.Icon size={22} strokeWidth={1.8} />
                    </div>
                    <div className="d-feature-name">{f.name}</div>
                    <div className="d-feature-desc">{f.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══ STATS ═══ */}
        <div className="d-stats" ref={statsRef} id="successstories">
          {STATS.map((s, i) => (
            <div key={i} className="d-stat">
              <div className="d-stat-val">{s.value}</div>
              <div className="d-stat-lbl">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ═══ TOOLS ═══ */}
        <section className="d-section d-section-alt" ref={toolsRef} id="tools">
          <div className="d-section-inner">
            <div className="d-section-head">
              <div className="d-section-tag">Texora Products</div>
              <h2 className="d-section-title">Explore Our <span className="accent">Products</span></h2>
              <p className="d-section-sub">Powerful AI products built by Texora — click to explore</p>
            </div>
            <div className="d-tools-grid">
              {TOOLS.map((t) => (
                <div key={t.key} className="d-tool-card" onClick={() => window.open(t.route, "_blank")}>
                  <div className="d-tool-icon" style={{ background: "#f8fafc", padding: 0, overflow: "hidden" }}>
                    <img src={`/images/${t.icon}.jpeg`} alt={t.icon} style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: "10px", padding: "4px 8px" }} />
                  </div>
                  <div className="d-tool-desc">{t.desc}</div>
                  <div className="d-tool-tags">
                    {t.tags.map((tag, i) => (
                      <span key={tag} className={`d-tool-tag ${i === 1 ? "green" : ""}`}>{tag}</span>
                    ))}
                  </div>
                  <div className="d-tool-cta">
                    <button className="d-tool-try">Try Free →</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ BLOG ═══ */}
        <section className="d-section" ref={blogRef} id="blog">
          <div className="d-section-inner">
            <div className="d-section-head">
              <div className="d-section-tag">Latest Insights</div>
              <h2 className="d-section-title">From Our <span className="accent">Blog</span></h2>
              <p className="d-section-sub">Tips, updates and guides to grow your career</p>
            </div>
            <div className="d-blog-grid">
              <div className="d-blog-featured">
                <img className="d-blog-featured-img" src={BLOG_POSTS[0].cover} alt={BLOG_POSTS[0].title} onError={(e) => { e.target.style.height = "120px"; e.target.style.background = "#F6EDE6"; }} />
                <div className="d-blog-featured-body">
                  <span className="d-blog-featured-badge">⭐ Featured</span>
                  <div className="d-blog-featured-title">{BLOG_POSTS[0].title}</div>
                  <div className="d-blog-featured-excerpt">{BLOG_POSTS[0].excerpt}</div>
                  <div className="d-blog-featured-meta">
                    <span className="d-blog-featured-cat">{BLOG_POSTS[0].cat}</span>
                    <span className="d-blog-dot" /><span>{BLOG_POSTS[0].date}</span>
                    <span className="d-blog-dot" /><span>{BLOG_POSTS[0].reads} min read</span>
                  </div>
                </div>
              </div>
              <div className="d-blog-side">
                {BLOG_POSTS.slice(1).map((b, i) => (
                  <div key={i} className="d-blog-side-card">
                    <img className="d-blog-side-img" src={b.cover} alt={b.title} onError={(e) => { e.target.style.display = "none"; }} />
                    <div className="d-blog-side-body">
                      <div className="d-blog-side-cat">{b.cat}</div>
                      <div className="d-blog-side-title">{b.title}</div>
                      <div className="d-blog-side-meta"><span>{b.date}</span><span className="d-blog-dot" /><span>{b.reads} min read</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══ CTA ═══ */}
        <div ref={ctaRef}>
          <div className="d-cta">
            <div className="d-cta-title">Ready to Transform Your Career?</div>
            <p className="d-cta-sub">Be among the first to learn with ILM ORA — join our growing community</p>
            <div className="d-cta-btns" />
          </div>
        </div>

        {/* ═══ FOOTER ═══ */}
        <footer className="d-footer-new">
          <div className="d-footer-inner">
            <div className="d-footer-grid">
              <div className="d-footer-brand">
                <h3><span style={{ color: "#16a34a" }}>ILM</span> <span style={{ color: "#F97316" }}>ORA</span></h3>
                <p>Modern learning platform for ambitious professionals who want to break into product, design and growth roles.</p>
                <div className="d-footer-email">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 6 12 13 2 6" /></svg>
                  <a href="mailto:marketing@texora.ai">marketing@texora.ai</a>
                </div>
                <div className="d-footer-socials">
                  {[
                    { href: "https://www.instagram.com/texora_ai", bg: "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)", svg: <svg style={{ width: 14, height: 14 }} viewBox="0 0 24 24" fill="currentColor"><path d="M7.75 2C4.574 2 4.574 22 7.75 22h8.5C19.426 22 22 19.426 22 16.25v-8.5C22 4.574 19.426 2 16.25 2h-8.5zm0 2h8.5C18.216 4 20 5.784 20 7.75v8.5C20 18.216 18.216 20 16.25 20h-8.5C5.784 20 4 18.216 4 16.25v-8.5C4 5.784 5.784 4 7.75 4zm4.25 3a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm4.5-.75a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5z" /></svg> },
                    { href: "https://www.youtube.com/@Texoraai", bg: "#dc2626", svg: <svg style={{ width: 14, height: 14 }} viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg> },
                    { href: "https://www.linkedin.com/company/105596104", bg: "#1d4ed8", svg: <svg style={{ width: 14, height: 14 }} viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg> },
                    { href: "https://api.whatsapp.com/send?phone=919205299338", bg: "#22c55e", svg: <svg style={{ width: 14, height: 14 }} viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" /></svg> },
                    { href: "https://x.com/texoraai", bg: "#000", svg: <svg style={{ width: 14, height: 14 }} viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2H21l-6.54 7.482L22 22h-6.828l-5.34-6.977L3.64 22H1l7.042-8.053L2 2h6.828l4.86 6.35L18.244 2zm-2.396 18h1.89L8.224 4H6.176l9.672 16z" /></svg> },
                  ].map((s, i) => (
                    <a key={i} href={s.href} target="_blank" rel="noreferrer" className="d-footer-social-btn" style={{ background: s.bg }}>{s.svg}</a>
                  ))}
                </div>
              </div>
              <div className="d-footer-col">
                <h4>Resources</h4>
                <ul>
                  <li onClick={() => scrollToId("successstories")}>Success Stories</li>
                  <li onClick={() => scrollToId("blog")}>Blogs</li>
                  <li onClick={() => scrollToId("tools")}>Use Cases</li>
                </ul>
              </div>
              <div className="d-footer-col">
                <h4>Company</h4>
                <ul>
                  <li onClick={() => navigate("/about")}>About Us</li>
                  <li onClick={() => navigate("/careers")}>Careers</li>
                  <li onClick={() => navigate("/pricing")}>Pricing</li>
                  <li onClick={() => navigate("/privacy-policy")}>Privacy Policy</li>
                  <li onClick={() => navigate("/help-center")}>Help Center</li>
                  <li onClick={() => navigate("/faq")}>FAQ</li>
                  <li onClick={() => navigate("/terms-of-service")}>Terms of Service</li>
                </ul>
              </div>
              <div className="d-footer-col d-footer-newsletter">
                <h4>Be the first to know</h4>
                <div className="d-footer-newsletter-input-wrap">
                  <input type="email" className="d-footer-newsletter-input" placeholder="marketing@texora.ai" />
                  <button className="d-footer-newsletter-btn" aria-label="Subscribe" onClick={() => addToast({ type: "success", title: "Subscribed!", desc: "Thanks! We'll keep you posted 🚀" })}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                  </button>
                </div>
                <div className="d-footer-status">
                  <span className="d-footer-status-dot" />Status: Live
                </div>
              </div>
            </div>
          </div>
          <div className="d-footer-bottom">
            <span>© {new Date().getFullYear()} ILM ORA All rights reserved.</span>
            <span>Built with passion for modern learners 🚀</span>
          </div>
        </footer>

        {/* ═══ MULTI-TOAST ═══ */}
        <ToastContainer toasts={toasts} />
      </div>
    </>
  );
}