// import { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import authService from "../../services/authService";

// const ROLES = [
//   {
//     value: "student",
//     label: "Student",
//     desc: "Learn & grow with 300+ courses",
//     color: "#27ae60",
//     bg: "rgba(39,174,96,0.10)",
//     icon: (
//       <svg
//         width="18"
//         height="18"
//         viewBox="0 0 24 24"
//         fill="none"
//         stroke="#27ae60"
//         strokeWidth="2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       >
//         <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
//         <path d="M6 12v5c3 3 9 3 12 0v-5" />
//       </svg>
//     ),
//   },
//   {
//     value: "trainer",
//     label: "Trainer",
//     desc: "Teach & inspire thousands of learners",
//     color: "#e67e22",
//     bg: "rgba(230,126,34,0.10)",
//     icon: (
//       <svg
//         width="18"
//         height="18"
//         viewBox="0 0 24 24"
//         fill="none"
//         stroke="#e67e22"
//         strokeWidth="2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       >
//         <rect x="9" y="2" width="6" height="12" rx="3" />
//         <path d="M19 10a7 7 0 0 1-14 0" />
//         <line x1="12" y1="19" x2="12" y2="22" />
//         <line x1="8" y1="22" x2="16" y2="22" />
//       </svg>
//     ),
//   },
//   {
//     value: "Manager",
//     label: "Business & Partnership",
//     desc: "Scale your team with structured learning",
//     color: "#8e44ad",
//     bg: "rgba(142,68,173,0.10)",
//     icon: (
//       <svg
//         width="18"
//         height="18"
//         viewBox="0 0 24 24"
//         fill="none"
//         stroke="#8e44ad"
//         strokeWidth="2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       >
//         <rect x="2" y="7" width="20" height="14" rx="2" />
//         <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
//       </svg>
//     ),
//   },
// ];

// const ONBOARDING_CONFIGS = {
//   student: [
//     {
//       title: "What do you want to learn?",
//       subtitle: "Choose areas that matter most",
//       multiSelect: true,
//       options: [
//         {
//           label: "Programming & Development",
//           desc: "Java, Python, web & software",
//         },
//         { label: "Data & AI", desc: "Data science, ML and AI tools" },
//         { label: "Design & Creativity", desc: "UI/UX, graphics and content" },
//         { label: "Business & Marketing", desc: "Digital marketing and growth" },
//         {
//           label: "Career Preparation",
//           desc: "Interview skills and job readiness",
//         },
//       ],
//     },
//     {
//       title: "Your current learning stage?",
//       subtitle: "We'll personalise your recommendations",
//       multiSelect: true,
//       options: [
//         { label: "School Student", desc: "Exploring basics and interests" },
//         { label: "College Student", desc: "Building career-ready skills" },
//         {
//           label: "Fresher / Job Seeker",
//           desc: "Preparing for first opportunity",
//         },
//         { label: "Working Learner", desc: "Upskilling alongside work" },
//       ],
//     },
//     {
//       title: "How do you prefer to learn?",
//       subtitle: "Choose your comfortable learning style",
//       multiSelect: true,
//       options: [
//         { label: "Live Classes", desc: "Interactive sessions with trainers" },
//         { label: "Recorded Courses", desc: "Learn anytime at your own pace" },
//         { label: "Practice Projects", desc: "Learn by building real tasks" },
//         {
//           label: "Mixed Learning",
//           desc: "Live, recorded and practice together",
//         },
//       ],
//     },
//     {
//       title: "Time available weekly?",
//       subtitle: "We'll suggest the right pace for you",
//       multiSelect: true,
//       options: [
//         { label: "1 - 3 hours", desc: "Light learning schedule" },
//         { label: "4 - 6 hours", desc: "Balanced weekly progress" },
//         { label: "7 - 10 hours", desc: "Focused learning plan" },
//         { label: "10+ hours", desc: "Intensive learning mode" },
//       ],
//     },
//     {
//       title: "Your biggest student goal?",
//       subtitle: "We'll tailor your onboarding",
//       multiSelect: true,
//       options: [
//         { label: "Build Skills", desc: "Improve practical knowledge" },
//         { label: "Get Certified", desc: "Earn completion certificates" },
//         {
//           label: "Get Internship / Job",
//           desc: "Prepare for career opportunities",
//         },
//         {
//           label: "Improve Academic Performance",
//           desc: "Support college or school learning",
//         },
//       ],
//     },
//     {
//       title: "Where do you want to start?",
//       subtitle: "Choose your first ILM ORA action",
//       multiSelect: true,
//       options: [
//         { label: "Explore Courses", desc: "Browse available programs" },
//         { label: "Join Live Class", desc: "Attend trainer-led sessions" },
//         { label: "Complete Profile", desc: "Set up your student profile" },
//         { label: "View Dashboard", desc: "Go to your learning workspace" },
//       ],
//     },
//   ],
//   trainer: [
//     {
//       title: "What do you want to teach?",
//       subtitle: "Choose your teaching focus areas",
//       multiSelect: true,
//       options: [
//         {
//           label: "Programming & Technology",
//           desc: "Coding, software and tech skills",
//         },
//         { label: "Data, AI & Analytics", desc: "Data science and analytics" },
//         {
//           label: "Design & Creative Skills",
//           desc: "Design and creative tools",
//         },
//         { label: "Business & Marketing", desc: "Growth, sales and marketing" },
//         {
//           label: "Soft Skills & Career",
//           desc: "Communication and career skills",
//         },
//       ],
//     },
//     {
//       title: "Your trainer profile?",
//       subtitle: "Personalise your trainer workspace",
//       multiSelect: true,
//       options: [
//         { label: "Individual Trainer", desc: "Teaching independently" },
//         { label: "Industry Expert", desc: "Sharing professional experience" },
//         { label: "Coaching Mentor", desc: "Guiding students or job seekers" },
//         { label: "Institute Trainer", desc: "Teaching for an organisation" },
//       ],
//     },
//     {
//       title: "How to deliver training?",
//       subtitle: "We'll prepare the right teaching tools",
//       multiSelect: true,
//       options: [
//         { label: "Live Sessions", desc: "Real-time interactive classes" },
//         { label: "Recorded Lessons", desc: "Upload structured course content" },
//         {
//           label: "Assignments & Projects",
//           desc: "Give learners practical tasks",
//         },
//         { label: "Hybrid Teaching", desc: "Live, recorded and assignments" },
//       ],
//     },
//     {
//       title: "Your training experience?",
//       subtitle: "We'll adjust guidance for your level",
//       multiSelect: true,
//       options: [
//         { label: "New Trainer", desc: "Starting your teaching journey" },
//         { label: "1 - 2 Years", desc: "Some teaching experience" },
//         { label: "3 - 5 Years", desc: "Experienced trainer" },
//         { label: "5+ Years", desc: "Advanced teaching experience" },
//       ],
//     },
//     {
//       title: "Your biggest trainer goal?",
//       subtitle: "We'll tailor your trainer onboarding",
//       multiSelect: true,
//       options: [
//         { label: "Create Courses", desc: "Build structured learning content" },
//         { label: "Teach Live Classes", desc: "Run interactive sessions" },
//         { label: "Grow Learners", desc: "Reach more students" },
//         {
//           label: "Track Student Progress",
//           desc: "Monitor performance and outcomes",
//         },
//       ],
//     },
//     {
//       title: "Where do you want to start?",
//       subtitle: "Choose your first trainer action",
//       multiSelect: true,
//       options: [
//         { label: "Create Course", desc: "Start building a course" },
//         { label: "Schedule Live Class", desc: "Plan your first session" },
//         {
//           label: "Complete Trainer Profile",
//           desc: "Set up your teaching profile",
//         },
//         { label: "View Trainer Dashboard", desc: "Go to your workspace" },
//       ],
//     },
//   ],
//   Manager: [
//     {
//       title: "What do you want to manage?",
//       subtitle: "Choose your organisation learning needs",
//       multiSelect: true,
//       options: [
//         { label: "Student Training", desc: "Manage learners and courses" },
//         { label: "Trainer Management", desc: "Manage trainers and sessions" },
//         { label: "Corporate Upskilling", desc: "Train employees or teams" },
//         {
//           label: "Institute Programs",
//           desc: "Run structured learning programs",
//         },
//         { label: "Reports & Analytics", desc: "Track learning outcomes" },
//       ],
//     },
//     {
//       title: "Type of organisation?",
//       subtitle: "Personalise your admin workspace",
//       multiSelect: true,
//       options: [
//         {
//           label: "Educational Institute",
//           desc: "School, college or training center",
//         },
//         {
//           label: "Company / Business",
//           desc: "Corporate team or business training",
//         },
//         { label: "Coaching Center", desc: "Skill-based or exam coaching" },
//         {
//           label: "Startup / Agency",
//           desc: "Small team or service organisation",
//         },
//       ],
//     },
//     {
//       title: "How many users to manage?",
//       subtitle: "We'll prepare the right workspace scale",
//       multiSelect: true,
//       options: [
//         { label: "1 - 50 users", desc: "Small learning setup" },
//         { label: "51 - 200 users", desc: "Growing organisation" },
//         { label: "201 - 1000 users", desc: "Large learning operation" },
//         { label: "1000+ users", desc: "Enterprise-level training" },
//       ],
//     },
//     {
//       title: "Most important admin tools?",
//       subtitle: "Choose what you need first",
//       multiSelect: true,
//       options: [
//         {
//           label: "Course Management",
//           desc: "Create and manage learning programs",
//         },
//         {
//           label: "User Management",
//           desc: "Manage students, trainers and teams",
//         },
//         { label: "Live Class Scheduling", desc: "Plan and monitor sessions" },
//         { label: "Certificates", desc: "Issue and manage certificates" },
//         {
//           label: "Analytics & Reports",
//           desc: "Track progress and performance",
//         },
//       ],
//     },
//     {
//       title: "Your biggest admin goal?",
//       subtitle: "We'll tailor your onboarding",
//       multiSelect: true,
//       options: [
//         {
//           label: "Launch Learning Platform",
//           desc: "Set up LMS for your organisation",
//         },
//         {
//           label: "Improve Training Quality",
//           desc: "Deliver better learning experiences",
//         },
//         {
//           label: "Manage Teams Efficiently",
//           desc: "Organise users, trainers and courses",
//         },
//         {
//           label: "Track Business Outcomes",
//           desc: "Measure progress and performance",
//         },
//       ],
//     },
//     {
//       title: "Where do you want to start?",
//       subtitle: "Choose your first admin action",
//       multiSelect: true,
//       options: [
//         {
//           label: "Setup Organisation",
//           desc: "Complete business/admin profile",
//         },
//         { label: "Add Courses", desc: "Start building course catalog" },
//         {
//           label: "Invite Users",
//           desc: "Add students, trainers or team members",
//         },
//         { label: "View Admin Dashboard", desc: "Go to your admin workspace" },
//       ],
//     },
//   ],
// };

// // BUG FIX: Animated spinner SVG — was inline JSX in original but missing from render in some paths
// const ISpinner = () => (
//   <svg
//     width="13"
//     height="13"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2.5"
//     strokeLinecap="round"
//   >
//     <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83">
//       <animateTransform
//         attributeName="transform"
//         type="rotate"
//         from="0 12 12"
//         to="360 12 12"
//         dur="0.7s"
//         repeatCount="indefinite"
//       />
//     </path>
//   </svg>
// );

// const ICheck = ({ s = 14 }) => (
//   <svg
//     width={s}
//     height={s}
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
//     <polyline points="22 4 12 14.01 9 11.01" />
//   </svg>
// );

// /*
//  * FLOW (per diagram):
//  *   "role"       → Step 1: Pick Student / Trainer / Manager  (Step 1 of 8)
//  *   "onboarding" → Steps 2-7: 6-step quiz                    (Step 2-7 of 8)
//  *   "confirm"    → Step 8: Profile Review (Name+Email+Role)  → API → navigate("/ilm-demo")
//  *
//  * BUG FIXES applied:
//  *  1. normalizeStoredRole: "Manager" casing was sometimes lost between session/localStorage
//  *  2. finishOnboarding: was not persisting role to sessionStorage before moving to confirm
//  *  3. submitToBackend (Skip path): was navigating to "/" instead of "/ilm-demo"
//  *  4. submitToBackend: lms_user.role mapping was wrong for TENANT_ADMIN — should be "admin" not "manager"
//  *  5. submitToBackend: profileCompleted was never being set to true after successful google login
//  *  6. handleOnboardingBack at step 0: correctly returns to "role" stage
//  *  7. Confirm stage: progress bar was hardcoded 87% — now correctly shows 100% (step 8 of 8)
//  *  8. Step label in onboarding: was using onboardingStep+2 but total was 8, now consistent
//  *  9. Role stage: "Step 1 of 8" label was missing from footer — added
//  * 10. Skip button in role stage: called submitToBackend({}) but role was "" — guard added
//  */
// export default function CompleteProfile({
//   onSkip,
//   prefillName = "",
//   prefillEmail = "",
//   googleCredential: googleCredentialProp = null,
//   isGoogleUser: isGoogleUserProp = false,
// }) {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const stored = (() => {
//     try {
//       return JSON.parse(localStorage.getItem("lms_user") || "{}");
//     } catch {
//       return {};
//     }
//   })();

//   const isGoogle = Boolean(
//     isGoogleUserProp ||
//     location.state?.isGoogleUser ||
//     location.state?.fromGoogleLogin ||
//     stored.isGoogleUser,
//   );

//   const googleCredential =
//     googleCredentialProp ||
//     location.state?.googleCredential ||
//     sessionStorage.getItem("ilmora_google_credential") ||
//     null;

//   const resolvedName = prefillName || location.state?.name || stored.name || "";
//   const resolvedEmail =
//     prefillEmail || location.state?.email || stored.email || "";

//   const [profileStage, setProfileStage] = useState("role");
//   const [onboardingStep, setOnboardingStep] = useState(0);
//   const [onboardingAnswers, setOnboardingAnswers] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});

//   // BUG FIX 1: normalizeStoredRole — "Manager" must survive round-trip through storage
//   const normalizeStoredRole = (raw) => {
//     if (!raw) return "";
//     const trimmed = raw.trim();
//     // exact-match first (preserves "Manager" casing)
//     if (trimmed === "Manager" || trimmed === "trainer" || trimmed === "student")
//       return trimmed;
//     const r = trimmed.toUpperCase();
//     if (["TENANT_ADMIN", "ADMIN", "BUSINESS", "MANAGER"].includes(r))
//       return "Manager";
//     if (r === "TRAINER") return "trainer";
//     if (r === "STUDENT") return "student";
//     return "";
//   };

//   const [role, setRole] = useState(() => {
//     const fromSession = normalizeStoredRole(
//       sessionStorage.getItem("ilmora_selected_role"),
//     );
//     const fromLocal = normalizeStoredRole(localStorage.getItem("role"));
//     return fromSession || fromLocal || "";
//   });

//   const roleObj = ROLES.find((r) => r.value === role);
//   const roleDisplayLabel =
//     roleObj?.label ||
//     (role === "Manager"
//       ? "Business & Partnership"
//       : role === "trainer"
//         ? "Trainer"
//         : role === "student"
//           ? "Student"
//           : role || "—");

//   // ── Onboarding helpers ──────────────────────────────────────────────────
//   const handleOnboardingSelect = (optionLabel) => {
//     setOnboardingAnswers((prev) => {
//       const key = `step_${onboardingStep}`;
//       const current = Array.isArray(prev[key]) ? prev[key] : [];
//       return {
//         ...prev,
//         [key]: current.includes(optionLabel)
//           ? current.filter((x) => x !== optionLabel)
//           : [...current, optionLabel],
//       };
//     });
//   };

//   const isOnboardingStepValid = () => {
//     const ans = onboardingAnswers[`step_${onboardingStep}`];
//     return Array.isArray(ans) && ans.length > 0;
//   };

//   // BUG FIX 2: persist role to sessionStorage before moving to confirm
//   const finishOnboarding = () => {
//     localStorage.setItem(
//       "ilmora_onboarding_answers",
//       JSON.stringify({ role, answers: onboardingAnswers }),
//     );
//     if (role) sessionStorage.setItem("ilmora_selected_role", role);
//     setProfileStage("confirm");
//   };

//   const handleOnboardingContinue = () => {
//     const configs = ONBOARDING_CONFIGS[role] || [];
//     if (onboardingStep < configs.length - 1) {
//       setOnboardingStep((p) => p + 1);
//     } else {
//       finishOnboarding();
//     }
//   };

//   // BUG FIX 6: back from step 0 returns to role selection
//   const handleOnboardingBack = () => {
//     if (onboardingStep > 0) {
//       setOnboardingStep((p) => p - 1);
//     } else {
//       setProfileStage("role");
//     }
//   };

//   // ── Submit to backend ────────────────────────────────────────────────────
//   const submitToBackend = async (answers) => {
//     localStorage.setItem(
//       "ilmora_onboarding_answers",
//       JSON.stringify({ role, answers }),
//     );
//     if (role) sessionStorage.setItem("ilmora_selected_role", role);

//     const credential =
//       googleCredential || sessionStorage.getItem("ilmora_google_credential");

//     // BUG FIX 3: non-Google / skip path — navigate to /ilm-demo not "/"
//     if (!credential) {
//       console.warn("⚠️ Google credential not found — navigating to /ilm-demo");
//       if (onSkip) onSkip();
//       navigate("/ilm-demo", { replace: true });
//       return;
//     }

//     setLoading(true);
//     try {
//       const backendRole =
//         role === "student"
//           ? "STUDENT"
//           : role === "trainer"
//             ? "TRAINER"
//             : "TENANT_ADMIN";

//       const axiosRes = await authService.googleLogin({
//         idToken: credential,
//         role: backendRole,
//         onboardingAnswers: answers,
//       });
//       const res = axiosRes?.data ?? axiosRes;

//       if (res?.token) {
//         const finalRole = res.role || backendRole;

//         // BUG FIX 4: role stored in lms_user must match what the rest of the app expects
//         // admin/tenant_admin → "admin", trainer → "trainer", student → "student"
//         const normalizedUiRole = ["TENANT_ADMIN", "ADMIN", "BUSINESS"].includes(
//           finalRole.toUpperCase(),
//         )
//           ? "admin"
//           : finalRole.toLowerCase();

//         localStorage.setItem("lms_token", res.token);
//         localStorage.setItem("role", finalRole);

//         if (res.organizationId)
//           localStorage.setItem("organizationId", res.organizationId);
//         else localStorage.removeItem("organizationId");

//         // BUG FIX 5: profileCompleted flag — set to true when backend confirms it,
//         // but do NOT force-set to true here; respect what the backend returns.
//         localStorage.setItem(
//           "lms_user",
//           JSON.stringify({
//             name: res.name || resolvedName,
//             email: res.email || resolvedEmail,
//             role: normalizedUiRole,
//             isGoogleUser: true,
//             profileCompleted: !!res.profileCompleted, // honour backend value
//             organizationId: res.organizationId || null,
//           }),
//         );

//         // Clean up session storage
//         sessionStorage.removeItem("ilmora_google_credential");
//         sessionStorage.removeItem("ilmora_google_user");
//         sessionStorage.removeItem("ilmora_selected_role");
//       } else {
//         console.error("❌ No token in response:", res);
//       }
//     } catch (err) {
//       console.error("❌ Onboarding API error:", err);
//     } finally {
//       setLoading(false);
//     }

//     if (onSkip) onSkip();
//     // BUG FIX 3 (also here): always go to /ilm-demo after submit
//     navigate("/ilm-demo", { replace: true });
//   };

//   const handleConfirmSubmit = () => submitToBackend(onboardingAnswers);

//   /* ════════ SHARED STYLES ════════ */
//   const sharedStyles = `
//     @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
//     *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

//     .cp-overlay {
//       position: fixed; inset: 0; z-index: 1000;
//       background: rgba(0,0,0,0.5);
//       display: flex; align-items: center; justify-content: center;
//       padding: 12px;
//       font-family: 'Inter', sans-serif;
//     }

//     .cp-modal {
//       width: 100%; max-width: 400px;
//       background: #faf7f4;
//       border-radius: 16px;
//       box-shadow: 0 20px 56px rgba(0,0,0,0.22);
//       display: flex; flex-direction: column;
//       max-height: calc(100vh - 24px);
//       overflow: hidden;
//       animation: cpIn .22s ease both;
//     }
//     .ob-modal {
//       width: 100%; max-width: 480px;
//       background: #faf7f4;
//       border-radius: 16px;
//       box-shadow: 0 20px 56px rgba(0,0,0,0.18);
//       display: flex; flex-direction: column;
//       max-height: calc(100vh - 24px);
//       overflow: hidden;
//       animation: cpIn .22s ease both;
//     }
//     @keyframes cpIn { from { opacity:0; transform:scale(0.96) translateY(8px); } to { opacity:1; transform:scale(1) translateY(0); } }

//     .cp-hdr { padding: 11px 16px 0; flex-shrink: 0; background: #faf7f4; border-radius: 16px 16px 0 0; }
//     .cp-hdr-top { display: flex; align-items: center; margin-bottom: 9px; }
//     .cp-logo { font-size: 1.15rem; font-weight: 800; letter-spacing: -0.3px; line-height: 1; }
//     .cp-logo-ilm { color: #27ae60; }
//     .cp-logo-ora { color: #e67e22; }
//     .cp-hdr-right { margin-left: auto; display: flex; align-items: center; gap: 10px; }
//     .cp-orange-line { height:2.5px; background:#e67e22; margin:0 -16px; }
//     .cp-prog { height:2px; background:#ece7e1; flex-shrink:0; }
//     .cp-prog-fill { height:100%; background:#e67e22; transition:width .4s ease; }

//     .cp-body { flex:1; overflow-y:auto; padding:14px 16px 8px; background:#faf7f4; }
//     .cp-body::-webkit-scrollbar { width:3px; }
//     .cp-body::-webkit-scrollbar-thumb { background:#ddd5cb; border-radius:3px; }
//     .cp-title { font-size:16px; font-weight:700; color:#111; margin-bottom:3px; }
//     .cp-sub { font-size:11.5px; color:#aaa; margin-bottom:12px; line-height:1.4; }

//     .cp-roles { display:flex; flex-direction:column; gap:7px; }
//     .cp-role { display:flex; align-items:center; gap:10px; padding:10px 12px; border-radius:10px; border:1.5px solid #ede8e0; background:#fff; cursor:pointer; transition:all .16s; user-select:none; }
//     .cp-role:hover { border-color:#d5cdc4; }
//     .cp-role.sel { border-color:#e67e22; box-shadow:0 0 0 2.5px rgba(230,126,34,.10); }
//     .cp-role-ico { width:34px; height:34px; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
//     .cp-role-info { flex:1; }
//     .cp-role-name { font-size:13px; font-weight:700; color:#111; }
//     .cp-role-desc { font-size:11px; color:#bbb; margin-top:1px; }
//     .cp-radio { width:16px; height:16px; border-radius:50%; border:2px solid #d5cdc5; flex-shrink:0; display:flex; align-items:center; justify-content:center; transition:border-color .16s; }
//     .cp-radio.sel { border-color:#e67e22; }
//     .cp-radio-dot { width:7px; height:7px; border-radius:50%; background:#e67e22; }

//     .cp-foot { display:flex; align-items:center; justify-content:space-between; padding:10px 16px; border-top:1px solid #ece7e0; background:#faf7f4; flex-shrink:0; border-radius:0 0 16px 16px; }
//     .cp-step-lbl { font-size:11px; color:#bbb; font-weight:500; }
//     .cp-foot-r { display:flex; gap:7px; align-items:center; }
//     .cp-btn-back { padding:8px 14px; background:#fff; border:1.5px solid #e4dfd8; border-radius:8px; font-family:'Inter',sans-serif; font-size:12px; font-weight:600; color:#888; cursor:pointer; transition:all .16s; }
//     .cp-btn-back:hover { background:#f5f0eb; }
//     .cp-btn-next { padding:8px 20px; background:#e67e22; border:none; border-radius:9px; font-family:'Inter',sans-serif; font-size:12px; font-weight:700; color:#fff; cursor:pointer; box-shadow:0 2px 8px rgba(230,126,34,.30); transition:opacity .16s, transform .12s; display:flex; align-items:center; gap:4px; }
//     .cp-btn-next:hover:not(:disabled) { opacity:.88; transform:translateY(-1px); }
//     .cp-btn-next:disabled { opacity:.35; cursor:not-allowed; transform:none; }
//     .cp-err-g { font-size:10px; color:#e74c3c; margin-top:5px; }

//     .ob-options { display:grid; grid-template-columns:1fr; gap:7px; margin-bottom:14px; }
//     .ob-opt { display:flex; align-items:flex-start; gap:10px; padding:9px 12px; border-radius:10px; border:1.5px solid #ede8e0; background:#fff; cursor:pointer; transition:all .16s; user-select:none; }
//     .ob-opt:hover { border-color:#d5cdc4; }
//     .ob-opt.sel { border-color:#e67e22; background:#fff8f2; box-shadow:0 0 0 2.5px rgba(230,126,34,.10); }
//     .ob-opt-info { flex:1; }
//     .ob-opt-label { font-size:12.5px; font-weight:700; color:#111; }
//     .ob-opt-desc { font-size:11px; color:#bbb; margin-top:1px; }
//     .ob-opt-check { width:16px; height:16px; border-radius:4px; border:2px solid #d5cdc5; flex-shrink:0; display:flex; align-items:center; justify-content:center; margin-top:2px; transition:all .16s; }
//     .ob-opt.sel .ob-opt-check { border-color:#e67e22; background:#e67e22; }
//     .ob-multi-hint { font-size:10.5px; color:#e67e22; font-weight:600; background:rgba(230,126,34,0.08); border-radius:5px; padding:3px 8px; margin-bottom:10px; display:inline-flex; align-items:center; gap:4px; }
//     .ob-skip-link { background:none; border:none; cursor:pointer; font-family:'Inter',sans-serif; font-size:11.5px; color:#bbb; text-decoration:underline; }

//     /* confirm / gc */
//     .gc-body { flex:1; overflow-y:auto; padding:18px 16px 10px; }
//     .gc-check-ring { width:44px; height:44px; border-radius:50%; background:rgba(39,174,96,0.10); display:flex; align-items:center; justify-content:center; margin:0 auto 10px; }
//     .gc-title { font-size:18px; font-weight:800; color:#111; text-align:center; margin-bottom:4px; }
//     .gc-title em { font-style:italic; color:#27ae60; }
//     .gc-sub { font-size:11.5px; color:#aaa; text-align:center; margin-bottom:14px; line-height:1.45; }
//     .gc-card { background:#fff; border-radius:10px; border:1.5px solid #ede8e0; padding:10px 12px; display:flex; flex-direction:column; gap:9px; margin-bottom:10px; }
//     .gc-card-row { display:flex; align-items:center; gap:10px; }
//     .gc-card-icon { width:30px; height:30px; border-radius:7px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
//     .gc-card-label { font-size:10px; color:#aaa; font-weight:600; text-transform:uppercase; letter-spacing:.04em; }
//     .gc-card-value { font-size:13px; font-weight:700; color:#111; }
//     .gc-google-pill { display:inline-flex; align-items:center; gap:5px; background:rgba(39,174,96,0.08); color:#27ae60; border-radius:20px; padding:4px 10px; font-size:10.5px; font-weight:600; margin:0 auto; }
//     .gc-foot { padding:10px 16px; border-top:1px solid #ece7e0; background:#faf7f4; flex-shrink:0; border-radius:0 0 16px 16px; }
//     .gc-btn-submit { width:100%; padding:11px; background:#27ae60; border:none; border-radius:10px; font-family:'Inter',sans-serif; font-size:13px; font-weight:700; color:#fff; cursor:pointer; box-shadow:0 3px 12px rgba(39,174,96,.28); transition:opacity .16s, transform .12s; display:flex; align-items:center; justify-content:center; gap:6px; }
//     .gc-btn-submit:hover:not(:disabled) { opacity:.88; transform:translateY(-1px); }
//     .gc-btn-submit:disabled { opacity:.4; cursor:not-allowed; transform:none; }
//   `;

//   /* ════════════════════════════════════════ STAGE: role (Step 1 of 8) */
//   if (profileStage === "role") {
//     // Step 1 of 8 → progress = 1/8 = 12.5%
//     const progressPct = 12.5;
//     return (
//       <>
//         <style>{sharedStyles}</style>
//         <div className="cp-overlay">
//           <div className="cp-modal">
//             <div className="cp-hdr">
//               <div className="cp-hdr-top">
//                 <div className="cp-logo">
//                   <span className="cp-logo-ilm">ILM</span>
//                   <span className="cp-logo-ora">ORA</span>
//                 </div>
//                 {/* BUG FIX 10: Skip in role stage only works if a role was previously stored */}
//                 {onSkip && role && (
//                   <div className="cp-hdr-right">
//                     {/* <button
//                       className="ob-skip-link"
//                       onClick={async () => {
//                         await submitToBackend({});
//                       }}
//                     >
//                       Skip
//                     </button> */}
//                   </div>
//                 )}
//               </div>
//               <div className="cp-orange-line" />
//             </div>
//             <div className="cp-prog">
//               <div
//                 className="cp-prog-fill"
//                 style={{ width: `${progressPct}%` }}
//               />
//             </div>

//             <div className="cp-body">
//               <div className="cp-title">Choose your role</div>
//               <div className="cp-sub">
//                 We'll personalise your ILM ORA experience based on how you'll
//                 use the platform.
//               </div>
//               <div className="cp-roles">
//                 {ROLES.map((r) => (
//                   <div
//                     key={r.value}
//                     className={`cp-role${role === r.value ? " sel" : ""}`}
//                     onClick={() => setRole(r.value)}
//                   >
//                     <div className="cp-role-ico" style={{ background: r.bg }}>
//                       {r.icon}
//                     </div>
//                     <div className="cp-role-info">
//                       <div className="cp-role-name">{r.label}</div>
//                       <div className="cp-role-desc">{r.desc}</div>
//                     </div>
//                     <div
//                       className={`cp-radio${role === r.value ? " sel" : ""}`}
//                     >
//                       {role === r.value && <div className="cp-radio-dot" />}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               {errors.role && <div className="cp-err-g">{errors.role}</div>}
//             </div>

//             {/* BUG FIX 9: "Step 1 of 8" now shown in footer */}
//             <div className="cp-foot">
//               <span className="cp-step-lbl">Step 1 of 8</span>
//               <div className="cp-foot-r">
//                 <button
//                   className="cp-btn-next"
//                   disabled={!role}
//                   onClick={() => {
//                     if (!role) {
//                       setErrors({ role: "Please select a role" });
//                       return;
//                     }
//                     setErrors({});
//                     sessionStorage.setItem("ilmora_selected_role", role);
//                     setProfileStage("onboarding");
//                   }}
//                 >
//                   Continue →
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </>
//     );
//   }

//   /* ════════════════════════════════════════ STAGE: onboarding (Steps 2-7 of 8) */
//   if (profileStage === "onboarding") {
//     const configs = ONBOARDING_CONFIGS[role] || [];
//     const config = configs[onboardingStep] || {};
//     const isValid = isOnboardingStepValid();
//     // BUG FIX 8: step numbers: quiz steps are 2-7 (onboardingStep 0-5 → display step 2-7)
//     const displayStep = onboardingStep + 2;
//     const totalSteps = 8;
//     const progressPct = Math.round((displayStep / totalSteps) * 100);

//     return (
//       <>
//         <style>{sharedStyles}</style>
//         <div className="cp-overlay">
//           <div className="ob-modal">
//             <div className="cp-hdr">
//               <div className="cp-hdr-top">
//                 <div className="cp-logo">
//                   <span className="cp-logo-ilm">ILM</span>
//                   <span className="cp-logo-ora">ORA</span>
//                 </div>
//                 <div className="cp-hdr-right">
//                   {/* <button className="ob-skip-link" onClick={finishOnboarding}>
//                     Skip quiz →
//                   </button> */}
//                 </div>
//               </div>
//               <div className="cp-orange-line" />
//             </div>
//             <div className="cp-prog">
//               <div
//                 className="cp-prog-fill"
//                 style={{ width: `${progressPct}%` }}
//               />
//             </div>

//             <div className="cp-body">
//               <div className="cp-title">{config.title}</div>
//               <div className="cp-sub">{config.subtitle}</div>
//               {config.multiSelect && (
//                 <div className="ob-multi-hint">
//                   <svg
//                     width="9"
//                     height="9"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2.5"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   >
//                     <polyline points="9 11 12 14 22 4" />
//                     <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
//                   </svg>
//                   Select all that apply
//                 </div>
//               )}
//               <div className="ob-options">
//                 {(config.options || []).map((opt, oi) => {
//                   const isSelected = (
//                     onboardingAnswers[`step_${onboardingStep}`] || []
//                   ).includes(opt.label);
//                   return (
//                     <div
//                       key={oi}
//                       className={`ob-opt${isSelected ? " sel" : ""}`}
//                       onClick={() => handleOnboardingSelect(opt.label)}
//                     >
//                       <div className="ob-opt-info">
//                         <div className="ob-opt-label">{opt.label}</div>
//                         {opt.desc && (
//                           <div className="ob-opt-desc">{opt.desc}</div>
//                         )}
//                       </div>
//                       <div className="ob-opt-check">
//                         {isSelected && (
//                           <svg
//                             width="9"
//                             height="9"
//                             viewBox="0 0 24 24"
//                             fill="none"
//                             stroke="#fff"
//                             strokeWidth="3.5"
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                           >
//                             <polyline points="20 6 9 17 4 12" />
//                           </svg>
//                         )}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>

//             <div className="cp-foot">
//               <span className="cp-step-lbl">
//                 Step {displayStep} of {totalSteps}
//               </span>
//               <div className="cp-foot-r">
//                 <button className="cp-btn-back" onClick={handleOnboardingBack}>
//                   ← Back
//                 </button>
//                 <button
//                   className="cp-btn-next"
//                   onClick={handleOnboardingContinue}
//                   disabled={!isValid}
//                 >
//                   {onboardingStep === configs.length - 1
//                     ? "Finish →"
//                     : "Continue →"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </>
//     );
//   }

//   /* ════════════════════════════════════════ STAGE: confirm (Step 8 of 8) */
//   return (
//     <>
//       <style>{sharedStyles}</style>
//       <div className="cp-overlay">
//         <div className="cp-modal">
//           <div className="cp-hdr">
//             <div className="cp-hdr-top">
//               <div className="cp-logo">
//                 <span className="cp-logo-ilm">ILM</span>
//                 <span className="cp-logo-ora">ORA</span>
//               </div>
//             </div>
//             <div className="cp-orange-line" />
//           </div>
//           {/* BUG FIX 7: progress is 100% at step 8 of 8, not hardcoded 87% */}
//           <div className="cp-prog">
//             <div className="cp-prog-fill" style={{ width: "100%" }} />
//           </div>

//           <div className="gc-body">
//             <div className="gc-check-ring">
//               <svg
//                 width="26"
//                 height="26"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="#27ae60"
//                 strokeWidth="2.5"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               >
//                 <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
//                 <polyline points="22 4 12 14.01 9 11.01" />
//               </svg>
//             </div>
//             <div className="gc-title">
//               Almost <em>done!</em>
//             </div>
//             <div className="gc-sub">
//               Review your details below and submit to continue.
//             </div>

//             <div className="gc-card">
//               {/* Name row */}
//               <div className="gc-card-row">
//                 <div
//                   className="gc-card-icon"
//                   style={{ background: "rgba(230,126,34,0.10)" }}
//                 >
//                   <svg
//                     width="14"
//                     height="14"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="#e67e22"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   >
//                     <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
//                     <circle cx="12" cy="7" r="4" />
//                   </svg>
//                 </div>
//                 <div>
//                   <div className="gc-card-label">Name</div>
//                   <div className="gc-card-value">{resolvedName || "—"}</div>
//                 </div>
//               </div>

//               {/* Email row */}
//               <div className="gc-card-row">
//                 <div
//                   className="gc-card-icon"
//                   style={{ background: "rgba(59,130,246,0.10)" }}
//                 >
//                   <svg
//                     width="14"
//                     height="14"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="#3b82f6"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   >
//                     <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
//                     <polyline points="22,6 12,13 2,6" />
//                   </svg>
//                 </div>
//                 <div>
//                   <div className="gc-card-label">Email</div>
//                   <div className="gc-card-value">{resolvedEmail || "—"}</div>
//                 </div>
//               </div>

//               {/* Role row */}
//               <div className="gc-card-row">
//                 <div
//                   className="gc-card-icon"
//                   style={{ background: roleObj?.bg || "rgba(142,68,173,0.10)" }}
//                 >
//                   {roleObj?.icon || (
//                     <svg
//                       width="14"
//                       height="14"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="#8e44ad"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     >
//                       <rect x="2" y="7" width="20" height="14" rx="2" />
//                       <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
//                     </svg>
//                   )}
//                 </div>
//                 <div>
//                   <div className="gc-card-label">Role</div>
//                   <div className="gc-card-value">{roleDisplayLabel}</div>
//                 </div>
//               </div>
//             </div>

//             {isGoogle && (
//               <div style={{ display: "flex", justifyContent: "center" }}>
//                 <div className="gc-google-pill">
//                   <svg
//                     width="10"
//                     height="10"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2.5"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   >
//                     <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
//                     <polyline points="22 4 12 14.01 9 11.01" />
//                   </svg>
//                   Verified via Google
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Footer: step 8 of 8 + submit */}
//           <div className="gc-foot">
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 marginBottom: "10px",
//               }}
//             >
//               <span
//                 style={{
//                   fontSize: "11px",
//                   color: "#bbb",
//                   fontWeight: 500,
//                   fontFamily: "'Inter',sans-serif",
//                 }}
//               >
//                 Step 8 of 8
//               </span>
//               <button
//                 className="ob-skip-link"
//                 style={{ fontSize: "11px" }}
//                 onClick={() => setProfileStage("onboarding")}
//               >
//                 ← Back
//               </button>
//             </div>
//             <button
//               className="gc-btn-submit"
//               onClick={handleConfirmSubmit}
//               disabled={loading}
//             >
//               {loading ? (
//                 <>
//                   <ISpinner /> Connecting…
//                 </>
//               ) : (
//                 <>
//                   <ICheck s={14} /> Submit &amp; Continue
//                 </>
//               )}
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }old


































































































// import { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import authService from "../../services/authService";
// import onboardingImage from "../../assets/onboarding.png";
// import studentOnboardingImage from "../../assets/student-onboarding.png";
// import trainerOnboardingImage from "../../assets/trainer-onboarding.png";
// import managerOnboardingImage from "../../assets/manager-onboarding.png";

// const ROLES = [
//   {
//     value: "student",
//     label: "Student",
//     desc: "Learn & grow with 300+ courses",
//     color: "#27ae60",
//     bg: "rgba(39,174,96,0.10)",
//     icon: (
//       <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#27ae60" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//         <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
//         <path d="M6 12v5c3 3 9 3 12 0v-5" />
//       </svg>
//     ),
//   },
//   {
//     value: "trainer",
//     label: "Trainer",
//     desc: "Teach & inspire thousands of learners",
//     color: "#e67e22",
//     bg: "rgba(230,126,34,0.10)",
//     icon: (
//       <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e67e22" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//         <rect x="9" y="2" width="6" height="12" rx="3" />
//         <path d="M19 10a7 7 0 0 1-14 0" />
//         <line x1="12" y1="19" x2="12" y2="22" />
//         <line x1="8" y1="22" x2="16" y2="22" />
//       </svg>
//     ),
//   },
//   {
//     value: "Manager",
//     label: "Business & Partnership",
//     desc: "Scale your team with structured learning",
//     color: "#8e44ad",
//     bg: "rgba(142,68,173,0.10)",
//     icon: (
//       <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8e44ad" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//         <rect x="2" y="7" width="20" height="14" rx="2" />
//         <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
//       </svg>
//     ),
//   },
// ];

// const ONBOARDING_VISUAL = {
//   student: {
//     image: studentOnboardingImage,
//   },
//   trainer: {
//     image: trainerOnboardingImage,
//   },
//   Manager: {
//     image: managerOnboardingImage,
//   },
// };

// const ONBOARDING_CONFIGS = {
//   student: [
//     {
//       title: "What do you want to learn?",
//       subtitle: "Choose areas that matter most",
//       multiSelect: true,
//       options: [
//         { label: "Programming & Development", desc: "Java, Python, web & software" },
//         { label: "Data & AI", desc: "Data science, ML and AI tools" },
//         { label: "Design & Creativity", desc: "UI/UX, graphics and content" },
//         { label: "Business & Marketing", desc: "Digital marketing and growth" },
//         { label: "Career Preparation", desc: "Interview skills and job readiness" },
//       ],
//     },
//     {
//       title: "Your current learning stage?",
//       subtitle: "We'll personalise your recommendations",
//       multiSelect: true,
//       options: [
//         { label: "School Student", desc: "Exploring basics and interests" },
//         { label: "College Student", desc: "Building career-ready skills" },
//         { label: "Fresher / Job Seeker", desc: "Preparing for first opportunity" },
//         { label: "Working Learner", desc: "Upskilling alongside work" },
//       ],
//     },
//     {
//       title: "How do you prefer to learn?",
//       subtitle: "Choose your comfortable learning style",
//       multiSelect: true,
//       options: [
//         { label: "Live Classes", desc: "Interactive sessions with trainers" },
//         { label: "Recorded Courses", desc: "Learn anytime at your own pace" },
//         { label: "Practice Projects", desc: "Learn by building real tasks" },
//         { label: "Mixed Learning", desc: "Live, recorded and practice together" },
//       ],
//     },
//     {
//       title: "Time available weekly?",
//       subtitle: "We'll suggest the right pace for you",
//       multiSelect: true,
//       options: [
//         { label: "1 - 3 hours", desc: "Light learning schedule" },
//         { label: "4 - 6 hours", desc: "Balanced weekly progress" },
//         { label: "7 - 10 hours", desc: "Focused learning plan" },
//         { label: "10+ hours", desc: "Intensive learning mode" },
//       ],
//     },
//     {
//       title: "Your biggest student goal?",
//       subtitle: "We'll tailor your onboarding",
//       multiSelect: true,
//       options: [
//         { label: "Build Skills", desc: "Improve practical knowledge" },
//         { label: "Get Certified", desc: "Earn completion certificates" },
//         { label: "Get Internship / Job", desc: "Prepare for career opportunities" },
//         { label: "Improve Academic Performance", desc: "Support college or school learning" },
//       ],
//     },
//     {
//       title: "Where do you want to start?",
//       subtitle: "Choose your first ILMORA action",
//       multiSelect: true,
//       options: [
//         { label: "Explore Courses", desc: "Browse available programs" },
//         { label: "Join Live Class", desc: "Attend trainer-led sessions" },
//         { label: "Complete Profile", desc: "Set up your student profile" },
//         { label: "View Dashboard", desc: "Go to your learning workspace" },
//       ],
//     },
//   ],
//   trainer: [
//     {
//       title: "What do you want to teach?",
//       subtitle: "Choose your teaching focus areas",
//       multiSelect: true,
//       options: [
//         { label: "Programming & Technology", desc: "Coding, software and tech skills" },
//         { label: "Data, AI & Analytics", desc: "Data science and analytics" },
//         { label: "Design & Creative Skills", desc: "Design and creative tools" },
//         { label: "Business & Marketing", desc: "Growth, sales and marketing" },
//         { label: "Soft Skills & Career", desc: "Communication and career skills" },
//       ],
//     },
//     {
//       title: "Your trainer profile?",
//       subtitle: "Personalise your trainer workspace",
//       multiSelect: true,
//       options: [
//         { label: "Individual Trainer", desc: "Teaching independently" },
//         { label: "Industry Expert", desc: "Sharing professional experience" },
//         { label: "Coaching Mentor", desc: "Guiding students or job seekers" },
//         { label: "Institute Trainer", desc: "Teaching for an organisation" },
//       ],
//     },
//     {
//       title: "How to deliver training?",
//       subtitle: "We'll prepare the right teaching tools",
//       multiSelect: true,
//       options: [
//         { label: "Live Sessions", desc: "Real-time interactive classes" },
//         { label: "Recorded Lessons", desc: "Upload structured course content" },
//         { label: "Assignments & Projects", desc: "Give learners practical tasks" },
//         { label: "Hybrid Teaching", desc: "Live, recorded and assignments" },
//       ],
//     },
//     {
//       title: "Your training experience?",
//       subtitle: "We'll adjust guidance for your level",
//       multiSelect: true,
//       options: [
//         { label: "New Trainer", desc: "Starting your teaching journey" },
//         { label: "1 - 2 Years", desc: "Some teaching experience" },
//         { label: "3 - 5 Years", desc: "Experienced trainer" },
//         { label: "5+ Years", desc: "Advanced teaching experience" },
//       ],
//     },
//     {
//       title: "Your biggest trainer goal?",
//       subtitle: "We'll tailor your trainer onboarding",
//       multiSelect: true,
//       options: [
//         { label: "Create Courses", desc: "Build structured learning content" },
//         { label: "Teach Live Classes", desc: "Run interactive sessions" },
//         { label: "Grow Learners", desc: "Reach more students" },
//         { label: "Track Student Progress", desc: "Monitor performance and outcomes" },
//       ],
//     },
//     {
//       title: "Where do you want to start?",
//       subtitle: "Choose your first trainer action",
//       multiSelect: true,
//       options: [
//         { label: "Create Course", desc: "Start building a course" },
//         { label: "Schedule Live Class", desc: "Plan your first session" },
//         { label: "Complete Trainer Profile", desc: "Set up your teaching profile" },
//         { label: "View Trainer Dashboard", desc: "Go to your workspace" },
//       ],
//     },
//   ],
//   Manager: [
//     {
//       title: "What do you want to manage?",
//       subtitle: "Choose your organisation learning needs",
//       multiSelect: true,
//       options: [
//         { label: "Student Training", desc: "Manage learners and courses" },
//         { label: "Trainer Management", desc: "Manage trainers and sessions" },
//         { label: "Corporate Upskilling", desc: "Train employees or teams" },
//         { label: "Institute Programs", desc: "Run structured learning programs" },
//         { label: "Reports & Analytics", desc: "Track learning outcomes" },
//       ],
//     },
//     {
//       title: "Type of organisation?",
//       subtitle: "Personalise your admin workspace",
//       multiSelect: true,
//       options: [
//         { label: "Educational Institute", desc: "School, college or training center" },
//         { label: "Company / Business", desc: "Corporate team or business training" },
//         { label: "Coaching Center", desc: "Skill-based or exam coaching" },
//         { label: "Startup / Agency", desc: "Small team or service organisation" },
//       ],
//     },
//     {
//       title: "How many users to manage?",
//       subtitle: "We'll prepare the right workspace scale",
//       multiSelect: true,
//       options: [
//         { label: "1 - 50 users", desc: "Small learning setup" },
//         { label: "51 - 200 users", desc: "Growing organisation" },
//         { label: "201 - 1000 users", desc: "Large learning operation" },
//         { label: "1000+ users", desc: "Enterprise-level training" },
//       ],
//     },
//     {
//       title: "Most important admin tools?",
//       subtitle: "Choose what you need first",
//       multiSelect: true,
//       options: [
//         { label: "Course Management", desc: "Create and manage learning programs" },
//         { label: "User Management", desc: "Manage students, trainers and teams" },
//         { label: "Live Class Scheduling", desc: "Plan and monitor sessions" },
//         { label: "Certificates", desc: "Issue and manage certificates" },
//         { label: "Analytics & Reports", desc: "Track progress and performance" },
//       ],
//     },
//     {
//       title: "Your biggest admin goal?",
//       subtitle: "We'll tailor your onboarding",
//       multiSelect: true,
//       options: [
//         { label: "Launch Learning Platform", desc: "Set up LMS for your organisation" },
//         { label: "Improve Training Quality", desc: "Deliver better learning experiences" },
//         { label: "Manage Teams Efficiently", desc: "Organise users, trainers and courses" },
//         { label: "Track Business Outcomes", desc: "Measure progress and performance" },
//       ],
//     },
//     {
//       title: "Where do you want to start?",
//       subtitle: "Choose your first admin action",
//       multiSelect: true,
//       options: [
//         { label: "Setup Organisation", desc: "Complete business/admin profile" },
//         { label: "Add Courses", desc: "Start building course catalog" },
//         { label: "Invite Users", desc: "Add students, trainers or team members" },
//         { label: "View Admin Dashboard", desc: "Go to your admin workspace" },
//       ],
//     },
//   ],
// };

// const ISpinner = () => (
//   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
//     <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83">
//       <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.7s" repeatCount="indefinite" />
//     </path>
//   </svg>
// );

// const ICheck = ({ s = 14 }) => (
//   <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
//     <polyline points="22 4 12 14.01 9 11.01" />
//   </svg>
// );

// /* ─────────────────────────────────────────────────────────────────────────────
//    GLOBAL RESPONSIVE STYLES — v6
//    (v2: rotation-safe, image-first rewrite)
//    (v3: iPad Mini 768px off-by-one fix — 768px -> 767px on the two
//         portrait queries; landscape-compact query switched from
//         width-based to max-height: 500px)
//    (v4: onboarding left-panel image gap fix — object-fit contain -> cover,
//         which removed the zoom/viewport-dependent letterbox gap)
//    (v5: Continue button clipping fix + smoothed breakpoint coverage band
//         from 1180px down to 768px so no tablet width falls through
//         ungated.)
//    (v6: THE ACTUAL CROP FIX —
//         v4 switched image containers from object-fit:contain to
//         object-fit:cover to remove a letterbox GAP. That trade quietly
//         introduced a CROP bug instead: cover fills a container by
//         scaling the image up until it overflows, then clips whatever
//         sticks out. Every later pass (v5) tuned the *container's*
//         aspect-ratio at each breakpoint, but never checked the actual
//         source image's aspect ratio against it — so on any device width
//         where the forced container ratio didn't match the image's real
//         ratio, cover sliced through the subject. That's the bug in the
//         bug report screenshot (iPad-portrait band, image cut mid-subject).
//         Tuning breakpoint numbers can never fully fix this, because the
//         mismatch is between the CONTAINER'S FORCED SHAPE and the
//         IMAGE'S OWN SHAPE — two independent numbers — not between the
//         container and the viewport width.
//         FIX: every image container below now uses object-fit: CONTAIN
//         again, and no container forces a fixed aspect-ratio anymore.
//         Containers size from flex (min-height + flex:1 1 auto) so they
//         adapt to whatever space is available at any width, height,
//         rotation, or zoom — and contain guarantees the full image is
//         always visible inside that space, never cropped, only
//         letterboxed (using the panel's own background color, so the
//         letterbox reads as intentional padding, not a bug). This removes
//         the dependency on knowing the exact source pixel dimensions of
//         onboarding.png / student-onboarding.png / trainer-onboarding.png
//         / manager-onboarding.png — contain is correct regardless of what
//         those turn out to be.)
//    ───────────────────────────────────────────────────────────────────────── */
// const GLOBAL_CSS = `
// @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
// *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

// /* ════════════════ SHARED BASE ════════════════ */
// .cp-overlay {
//   position: fixed; inset: 0; z-index: 1000;
//   width: 100%;
//   box-sizing: border-box;
//   background:
//     radial-gradient(circle at 8% 90%, rgba(142,68,173,0.16), transparent 45%),
//     radial-gradient(circle at 95% 92%, rgba(230,126,34,0.16), transparent 45%),
//     radial-gradient(circle at 6% 6%, rgba(52,152,219,0.16), transparent 40%),
//     radial-gradient(circle at 92% 4%, rgba(243,156,18,0.14), transparent 40%),
//     #f3f0ec;
//   display: flex; align-items: center; justify-content: center;
//   padding: 14px;
//   font-family: 'Inter', sans-serif;
//   overflow: hidden;
//   height: 100dvh;
// }
// .cp-modal {
//   width: 100%; max-width: 540px;
//   box-sizing: border-box;
//   background: #ffffff;
//   border-radius: 22px;
//   box-shadow: 0 24px 56px rgba(20,20,30,0.16);
//   display: flex; flex-direction: column;
//   height: auto;
//   max-height: calc(100dvh - 28px);
//   overflow-y: auto;
//   flex-shrink: 0;
//   animation: cpIn .22s ease both;
//   position: relative;
// }
// @keyframes cpIn { from { opacity:0; transform:scale(0.96) translateY(8px); } to { opacity:1; transform:scale(1) translateY(0); } }

// .cp-hdr { padding: 18px 32px 0; flex-shrink: 0; background: #ffffff; border-radius: 22px 22px 0 0; }
// .cp-hdr-top { display: flex; align-items: center; margin-bottom: 10px; }
// .cp-logo { font-size: 1.2rem; font-weight: 800; letter-spacing: -0.3px; line-height: 1; }
// .cp-logo-ilm { color: #27ae60; }
// .cp-logo-ora { color: #e67e22; }
// .cp-orange-line { height:3px; background:#e67e22; margin:0 -32px; flex-shrink: 0; }
// .cp-body { flex: 1 1 auto; min-height: 0; overflow-y: auto; padding:28px 32px 8px; background:#ffffff; position: relative; }

// /* — decorative confetti dots scattered around the check icon, like reference — */
// .cp-confetti { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
// .cp-confetti span {
//   position: absolute;
//   display: block;
//   border-radius: 2px;
// }
// .cp-dot-1  { top: 18px;  left: 36px;  width: 6px;  height: 6px;  background: #cfe9d8; border-radius: 50%; }
// .cp-dot-2  { top: 10px;  left: 78px;  width: 5px;  height: 5px;  background: #f0a93a; transform: rotate(45deg); }
// .cp-dot-3  { top: 34px;  left: 110px; width: 6px;  height: 6px;  background: #cfe9d8; border-radius: 50%; }
// .cp-dot-4  { top: 2px;   left: 168px; width: 5px;  height: 5px;  background: #cfe9d8; border-radius: 50%; }
// .cp-dot-5  { top: 26px;  right: 100px;width: 6px;  height: 6px;  background: #f0a93a; transform: rotate(45deg); }
// .cp-dot-6  { top: 6px;   right: 60px; width: 5px;  height: 5px;  background: #cfe9d8; border-radius: 50%; }
// .cp-dot-7  { top: 40px;  right: 30px; width: 6px;  height: 6px;  background: #cfe9d8; border-radius: 50%; }

// .gc-check-ring { width: 56px; height: 56px; border-radius: 50%; background: rgba(39,174,96,0.10); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; position: relative; z-index: 1; flex-shrink: 0; }
// .gc-title { font-size: 24px; font-weight: 800; color: #1a1a2e; text-align: center; margin-bottom: 6px; letter-spacing: -0.3px; position: relative; z-index: 1; }
// .gc-title em { font-style: italic; color: #27ae60; }
// .gc-sub { font-size: 13px; color: #9a9aa1; text-align: center; margin-bottom: 22px; line-height: 1.5; position: relative; z-index: 1; }
// .gc-card { background: #fff; border-radius: 14px; border: 1.5px solid #ece8e2; padding: 4px 18px; display: flex; flex-direction: column; margin-bottom: 16px; position: relative; z-index: 1; flex-shrink: 0; }
// .gc-card-row { display: flex; align-items: center; gap: 13px; padding: 13px 0; }
// .gc-card-row + .gc-card-row { border-top: 1px solid #f1ede6; }
// .gc-card-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
// .gc-card-text { flex: 1; min-width: 0; }
// .gc-card-label { font-size: 10px; color: #aaa; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; margin-bottom: 3px; }
// .gc-card-value { font-size: 14.5px; font-weight: 700; color: #1a1a2e; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
// .gc-google-pill { display: inline-flex; align-items: center; gap: 6px; background: rgba(39,174,96,0.08); color: #27ae60; border-radius: 20px; padding: 6px 14px; font-size: 11.5px; font-weight: 700; margin: 0 auto 4px; position: relative; z-index: 1; }
// .gc-google-row { display: flex; justify-content: center; flex-shrink: 0; }
// .gc-foot { padding: 16px 32px 26px; background: #ffffff; flex-shrink: 0; border-radius: 0 0 22px 22px; }
// .gc-foot-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; gap: 10px; }
// .gc-btn-submit { width: 100%; padding: 13px; background: #27ae60; border: none; border-radius: 11px; font-family: 'Inter',sans-serif; font-size: 14px; font-weight: 700; color: #fff; cursor: pointer; box-shadow: 0 6px 16px rgba(39,174,96,.30); transition: opacity .16s, transform .12s; display: flex; align-items: center; justify-content: center; gap: 7px; }
// .gc-btn-submit:hover:not(:disabled) { opacity: .9; transform: translateY(-1px); }
// .gc-btn-submit:disabled { opacity: .45; cursor: not-allowed; transform: none; }
// .ob-skip-link { background: none; border: none; cursor: pointer; font-family: 'Inter',sans-serif; font-size: 12px; color: #27ae60; font-weight: 600; text-decoration: none; flex-shrink: 0; display: inline-flex; align-items: center; gap: 4px; }
// .gc-step-lbl { font-size: 12px; color: #a3a3aa; font-weight: 500; }

// /* tablets / iPad mini */
// @media (max-width: 900px) {
//   .cp-modal { max-width: 460px; }
// }

// /* mobile / narrow */
// @media (max-width: 640px) {
//   .cp-overlay { padding: 8px; }
//   .cp-modal { max-width: 420px; border-radius: 18px; }
//   .cp-hdr { padding: 14px 20px 0; }
//   .cp-orange-line { margin: 0 -20px; }
//   .cp-body { padding: 22px 20px 6px; }
//   .gc-check-ring { width: 48px; height: 48px; margin-bottom: 12px; }
//   .gc-title { font-size: 20px; margin-bottom: 4px; }
//   .gc-sub { font-size: 11.5px; margin-bottom: 16px; }
//   .gc-card { padding: 2px 14px; margin-bottom: 12px; }
//   .gc-card-row { padding: 10px 0; gap: 10px; }
//   .gc-card-icon { width: 32px; height: 32px; border-radius: 8px; }
//   .gc-card-label { font-size: 9px; }
//   .gc-card-value { font-size: 13px; }
//   .gc-foot { padding: 10px 20px 18px; }
//   .gc-foot-top { margin-bottom: 10px; }
//   .gc-btn-submit { padding: 11px; font-size: 13px; }
// }

// /* very short viewports */
// @media (max-height: 620px) {
//   .cp-modal { max-height: calc(100dvh - 16px); }
//   .gc-sub { margin-bottom: 12px; }
//   .gc-card-row { padding: 8px 0; }
//   .gc-check-ring { width: 40px; height: 40px; margin-bottom: 8px; }
//   .gc-title { font-size: 18px; margin-bottom: 4px; }
// }

// /* ════════════════ ROLE STAGE ════════════════ */
// .rl-overlay {
//   position: fixed; inset: 0; z-index: 1000;
//   background:
//     radial-gradient(circle at 8% 90%, rgba(142,68,173,0.16), transparent 45%),
//     radial-gradient(circle at 95% 92%, rgba(230,126,34,0.16), transparent 45%),
//     radial-gradient(circle at 6% 6%, rgba(52,152,219,0.16), transparent 40%),
//     radial-gradient(circle at 92% 4%, rgba(243,156,18,0.14), transparent 40%),
//     #f3f0ec;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   padding: 16px;
//   font-family: 'Inter', sans-serif;
//   overflow-y: auto;
//   height: 100dvh;
// }

// /* ── ROLE CARD: Desktop default (side-by-side row) ──
//    No min-height floor that can outgrow the viewport; height is a
//    flexible min() with no forced minimum, and the card's row children
//    (.rl-left / .rl-right) manage their own internal scrolling so the
//    footer/Continue button is never pushed outside the visible card. */
// .rl-card {
//   width: 100%;
//   max-width: 1080px;
//   background: linear-gradient(180deg, #ffffff 0%, #fbfaf8 100%);
//   border-radius: 22px;
//   box-shadow: 0 28px 64px rgba(20,20,30,0.16);
//   display: flex;
//   flex-direction: row;
//   overflow: hidden;
//   height: min(760px, calc(100dvh - 32px));
//   max-height: calc(100dvh - 32px);
//   animation: rlIn .24s ease both;
// }
// @keyframes rlIn {
//   from { opacity:0; transform: translateY(10px) scale(.98); }
//   to   { opacity:1; transform: translateY(0)    scale(1);   }
// }

// /* ── LEFT PANEL: branding + illustration (role stage) ── */
// .rl-left {
//   flex: 0 0 44%;
//   padding: 36px 32px;
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   gap: 0;
//   min-width: 0;
//   min-height: 0;
//   overflow-y: auto;
//   overflow-x: hidden;
// }

// .rl-welcome  { font-size: 12px; font-weight: 600; color: #6b6b72; margin-bottom: 2px; margin-top: 4px; flex-shrink: 0; }
// .rl-headline { font-size: clamp(1.8rem, 3vw, 2.6rem); line-height: 1.06; font-weight: 800; letter-spacing: -0.5px; color: #1a1a2e; margin-bottom: 8px; flex-shrink: 0; }
// .rl-headline .rl-ilm { color: #27ae60; }
// .rl-headline .rl-ora { color: #e67e22; }
// .rl-tagline  { font-size: 13px; font-weight: 600; color: #555; margin-bottom: 12px; flex-shrink: 0; }
// .rl-divider  { width: 56px; height: 3px; border-radius: 2px; background: linear-gradient(90deg, #27ae60, #e67e22); margin-bottom: 14px; flex-shrink: 0; }
// .rl-desc     { font-size: 13px; color: #8b8b93; line-height: 1.55; margin-bottom: 0; max-width: 340px; flex-shrink: 0; }

// /* ── IMAGE CONTAINER — v6 fix ──
//    No fixed aspect-ratio is forced here at the base rule or in ANY
//    media query below. The box is purely flex-sized (flex:1 1 auto +
//    min-height:0), so it simply occupies whatever space is left in the
//    panel after the text above it. object-fit:contain on the <img>
//    guarantees the ENTIRE source image is always visible inside that
//    box — scaled down to fit, never scaled-up-then-clipped like cover
//    does. This is what makes the fix independent of the image's real
//    pixel dimensions: contain is correct for ANY aspect ratio. */
// .rl-illo {
//   margin-top: 20px;
//   flex: 1 1 auto;
//   min-height: 80px;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   width: 100%;
//   border-radius: 14px;
//   overflow: hidden;
//   background: transparent;
// }
// .rl-illo img {
//   width: 100%;
//   height: 100%;
//   object-fit: contain;
//   object-position: center;
//   border-radius: 14px;
//   display: block;
// }

// /* ── RIGHT PANEL: role selection ──
//    .rl-roles scrolls internally (min-height:0 + overflow-y:auto)
//    so the footer with the Continue button is ALWAYS pinned and visible,
//    no matter how tall the role list gets relative to viewport height. */
// .rl-right {
//   flex: 1;
//   padding: 36px 36px 26px;
//   display: flex;
//   flex-direction: column;
//   background: #ffffff;
//   border-left: 1px solid #f0ede8;
//   min-width: 0;
//   min-height: 0;
//   overflow: hidden;
// }
// .rl-right-title { font-size: 20px; font-weight: 800; color: #1a1a2e; margin-bottom: 5px; flex-shrink: 0; }
// .rl-right-sub   { font-size: 13px; color: #9a9aa1; line-height: 1.5; margin-bottom: 20px; flex-shrink: 0; }
// .rl-roles       { display: flex; flex-direction: column; gap: 11px; flex: 1 1 auto; min-height: 0; overflow-y: auto; padding-right: 2px; }
// .rl-role {
//   display: flex; align-items: center; gap: 14px;
//   padding: 14px 16px; border-radius: 13px;
//   border: 1.5px solid #ece8e2; background: #fff;
//   cursor: pointer; transition: border-color .16s, box-shadow .16s, background .16s;
//   user-select: none;
//   flex-shrink: 0;
// }
// .rl-role:hover    { border-color: #d8d2c8; }
// .rl-role.sel      { border-color: #27ae60; background: rgba(39,174,96,0.04); box-shadow: 0 0 0 3px rgba(39,174,96,0.10); }
// .rl-role-ico      { width: 44px; height: 44px; border-radius: 11px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
// .rl-role-info     { flex: 1; min-width: 0; }
// .rl-role-name     { font-size: 14px; font-weight: 700; color: #1a1a2e; }
// .rl-role-desc     { font-size: 12px; color: #a3a3aa; margin-top: 2px; }
// .rl-radio         { width: 21px; height: 21px; border-radius: 50%; border: 2px solid #d9d4cb; flex-shrink: 0; display: flex; align-items: center; justify-content: center; transition: border-color .16s, background .16s; }
// .rl-radio.sel     { border-color: #27ae60; background: #27ae60; color: #fff; }
// .rl-err           { font-size: 11.5px; color: #e74c3c; margin-top: 4px; margin-bottom: 4px; flex-shrink: 0; }
// .rl-footer        { display: flex; align-items: center; justify-content: space-between; margin-top: 16px; flex-shrink: 0; padding-top: 4px; }
// .rl-step-lbl      { font-size: 11.5px; color: #a3a3aa; font-weight: 500; }
// .rl-btn-continue  {
//   padding: 12px 24px;
//   background: linear-gradient(92deg, #e67e22 0%, #f0532b 100%);
//   border: none; border-radius: 11px;
//   font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 700; color: #fff;
//   cursor: pointer; box-shadow: 0 6px 18px rgba(230,126,34,.32);
//   transition: opacity .16s, transform .12s;
//   display: flex; align-items: center; gap: 6px;
//   white-space: nowrap;
// }
// .rl-btn-continue:hover:not(:disabled) { opacity: .92; transform: translateY(-1px); }
// .rl-btn-continue:disabled             { opacity: .4; cursor: not-allowed; transform: none; }

// /* ════════════════ ONBOARDING STAGE ════════════════ */
// .ob2-overlay {
//   position: fixed; inset: 0; z-index: 1000;
//   background:
//     radial-gradient(circle at 8% 90%, rgba(142,68,173,0.16), transparent 45%),
//     radial-gradient(circle at 95% 92%, rgba(230,126,34,0.16), transparent 45%),
//     radial-gradient(circle at 6% 6%, rgba(52,152,219,0.16), transparent 40%),
//     radial-gradient(circle at 92% 4%, rgba(243,156,18,0.14), transparent 40%),
//     #f3f0ec;
//   display: flex; align-items: center; justify-content: center;
//   padding: 16px;
//   font-family: 'Inter', sans-serif;
//   overflow-y: auto;
//   height: 100dvh;
// }

// /* No rigid min-height; height is flexible min() with no minimum
//    floor, so the card can shrink to fit short/zoomed-in viewports instead
//    of overflowing and hiding its own footer. */
// .ob2-card {
//   width: 100%;
//   max-width: 1080px;
//   background: linear-gradient(180deg, #ffffff 0%, #fbfaf8 100%);
//   border-radius: 22px;
//   box-shadow: 0 28px 64px rgba(20,20,30,0.16);
//   display: flex;
//   flex-direction: row;
//   overflow: hidden;
//   height: min(760px, calc(100dvh - 32px));
//   max-height: calc(100dvh - 32px);
//   animation: ob2In .22s ease both;
// }
// @keyframes ob2In {
//   from { opacity:0; transform: translateY(8px) scale(.98); }
//   to   { opacity:1; transform: translateY(0)   scale(1);   }
// }

// .ob2-left {
//   flex: 0 0 32%;
//   min-width: 0;
//   min-height: 0;
//   display: flex;
//   flex-direction: column;
//   background: #faf7f4;
// }
// .ob2-left-logo {
//   position: absolute;
//   top: 14px;
//   left: 16px;
//   z-index: 2;
//   font-size: 1.05rem;
//   font-weight: 800;
//   letter-spacing: -0.3px;
//   line-height: 1;
//   pointer-events: none;
//   filter: drop-shadow(0 1px 3px rgba(0,0,0,0.18));
// }
// .ob2-left-logo .ob2-logo-ilm { color: #27ae60; }
// .ob2-left-logo .ob2-logo-ora { color: #e67e22; }

// /* ── IMAGE CONTAINER — v6 fix ──
//    Same logic as .rl-illo above: no fixed aspect-ratio anywhere, in any
//    media query. flex:1 1 auto + min-height:0 means this box simply
//    takes whatever space .ob2-left has (which itself flexes against the
//    quiz panel on the right), and object-fit:contain on the <img> below
//    guarantees nothing is ever cropped, regardless of the real pixel
//    dimensions of student/trainer/manager-onboarding.png. */
// .ob2-left-img-wrap {
//   flex: 1 1 auto;
//   min-height: 80px;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   overflow: hidden;
//   background: #faf7f4;
//   position: relative;
// }
// .ob2-left-img {
//   display: block;
//   width: 100%;
//   height: 100%;
//   object-fit: contain;
//   object-position: center;
// }
// /* .ob2-right uses min-height:0 so its flex children can shrink
//    properly; .ob2-options (below) is the part that scrolls, keeping the
//    footer with Continue/Back permanently pinned and visible. */
// .ob2-right {
//   flex: 1;
//   padding: 28px 36px 24px;
//   display: flex;
//   flex-direction: column;
//   background: #ffffff;
//   border-left: 1px solid #f0ede8;
//   min-width: 0;
//   min-height: 0;
//   overflow: hidden;
// }
// .ob2-segments     { display: flex; gap: 5px; margin-bottom: 20px; flex-shrink: 0; }
// .ob2-segment      { flex: 1; height: 5px; border-radius: 3px; background: #ece7e0; overflow: hidden; }
// .ob2-segment-fill { height: 100%; width: 0%; background: linear-gradient(90deg, #27ae60, #1e9e54); border-radius: 3px; transition: width .3s ease; }
// .ob2-segment.done .ob2-segment-fill    { width: 100%; }
// .ob2-segment.current .ob2-segment-fill { width: 100%; background: linear-gradient(90deg, #e67e22, #f0532b); }
// .ob2-title     { font-size: 20px; font-weight: 800; color: #1a1a2e; margin-bottom: 5px; flex-shrink: 0; }
// .ob2-sub       { font-size: 12.5px; color: #9a9aa1; line-height: 1.5; margin-bottom: 12px; flex-shrink: 0; }
// .ob2-hint      { font-size: 11px; color: #27ae60; font-weight: 600; background: rgba(39,174,96,0.08); border-radius: 7px; padding: 5px 10px; margin-bottom: 14px; display: inline-flex; align-items: center; gap: 5px; width: fit-content; flex-shrink: 0; }
// .ob2-topbar{
//   display:flex;
//   align-items:center;
//   justify-content:space-between;
//   margin-bottom:16px;
//   padding-bottom:12px;
//   border-bottom:1px solid #f1f1f1;
//   flex-shrink: 0;
// }

// .ob2-select-all{
//   display:inline-flex;
//   align-items:center;
//   gap:8px;
//   padding:10px 16px;
//   border:1px solid rgba(39,174,96,.15);
//   border-radius:999px;
//   background:#fff;
//   color:#27ae60;
//   font-size:12px;
//   font-weight:700;
//   cursor:pointer;
//   box-shadow:0 2px 8px rgba(0,0,0,.05);
//   transition:all .25s ease;
// }

// .ob2-select-all:hover{
//   transform:translateY(-2px);
//   box-shadow:0 8px 20px rgba(39,174,96,.12);
//   border-color:#27ae60;
//   background:#fff;
// }

// .ob2-select-all.active{
//   background:#27ae60;
//   color:#fff;
//   border-color:#27ae60;
//   box-shadow:0 8px 20px rgba(39,174,96,.25);
// }

// .ob2-counter{
//   padding:6px 10px;
//   border-radius:999px;
//   background:#f5f7fa;
//   color:#666;
//   font-size:11px;
//   font-weight:700;
// }
// /* This is the scroll container. flex:1 + min-height:0 +
//    overflow-y:auto means a long options list scrolls WITHIN this box
//    instead of expanding the card and shoving the footer/Continue button
//    off-screen. */
// .ob2-options{
//   display:flex;
//   flex-direction:column;
//   gap:10px;
//   flex:1 1 auto;
//   min-height: 0;
//   overflow-y: auto;
//   padding-right: 2px;
//   justify-content:flex-start;
// }
// .ob2-opt {
//   display: flex; align-items: center; gap: 12px;
//   padding: 12px 14px; border-radius: 12px;
//   border: 1.5px solid #ece8e2; background: #fff;
//   cursor: pointer; transition: border-color .16s, box-shadow .16s, background .16s;
//   user-select: none; flex-shrink: 0;
// }
// .ob2-opt:hover              { border-color: #d8d2c8; }
// .ob2-opt.sel                { border-color: #27ae60; background: rgba(39,174,96,0.04); box-shadow: 0 0 0 3px rgba(39,174,96,0.10); }
// .ob2-opt-ico                { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
// .ob2-opt-info               { flex: 1; min-width: 0; }
// .ob2-opt-label              { font-size: 13px; font-weight: 700; color: #1a1a2e; }
// .ob2-opt-desc               { font-size: 11.5px; color: #a3a3aa; margin-top: 2px; line-height: 1.35; }
// .ob2-opt-check              { width: 19px; height: 19px; border-radius: 5px; border: 2px solid #d9d4cb; flex-shrink: 0; display: flex; align-items: center; justify-content: center; transition: border-color .16s, background .16s; }
// .ob2-opt.sel .ob2-opt-check { border-color: #27ae60; background: #27ae60; color: #fff; }
// /* footer is flex-shrink:0 and sits outside the scrolling
//    .ob2-options box, so Continue/Back are always rendered and clickable,
//    regardless of zoom level or how many options are in the list. */
// .ob2-footer {
//   display:flex;
//   align-items:center;
//   justify-content:space-between;
//   margin-top: 12px;
//   padding-top:14px;
//   flex-shrink: 0;
//   border-top: 1px solid #f5f2ed;
// }
// .ob2-step-lbl  { font-size: 11.5px; color: #a3a3aa; font-weight: 500; }
// .ob2-foot-r    { display: flex; gap: 9px; align-items: center; }
// .ob2-btn-back     { padding: 11px 16px; background: #fff; border: 1.5px solid #e4dfd8; border-radius: 10px; font-family: 'Inter',sans-serif; font-size: 12.5px; font-weight: 600; color: #6b6b72; cursor: pointer; transition: background .16s; white-space: nowrap; }
// .ob2-btn-back:hover { background: #f5f0eb; }
// .ob2-btn-continue { padding: 12px 22px; background: linear-gradient(92deg, #e67e22 0%, #f0532b 100%); border: none; border-radius: 11px; font-family: 'Inter',sans-serif; font-size: 13px; font-weight: 700; color: #fff; cursor: pointer; box-shadow: 0 6px 18px rgba(230,126,34,.32); transition: opacity .16s, transform .12s; display: flex; align-items: center; gap: 6px; white-space: nowrap; }
// .ob2-btn-continue:hover:not(:disabled) { opacity: .92; transform: translateY(-1px); }
// .ob2-btn-continue:disabled             { opacity: .4; cursor: not-allowed; transform: none; }


// /* ══════════════════════════════════════════════════════════════════
//    RESPONSIVE — width-based scale-down (still ROW layout)
//    Breakpoint coverage is a continuous band from 1180px down to 768px
//    (desktop -> small laptop -> large tablet -> standard tablet), so
//    there is no untuned "gap" device width. NOTE — v6: none of these
//    rules touch object-fit or force an aspect-ratio on the image
//    containers anymore; they only resize padding/text/icon sizes. The
//    image containers stay flex-sized + contain at every single one of
//    these breakpoints, which is what makes the crop fix hold everywhere
//    instead of only at hand-picked widths.
// ══════════════════════════════════════════════════════════════════ */

// @media (max-width: 1180px) {
//   .rl-card, .ob2-card { max-width: 960px; }
// }

// @media (max-width: 1024px) {
//   .rl-card, .ob2-card { max-width: 860px; }

//   .rl-left          { flex: 0 0 40%; padding: 28px 22px; }
//   .rl-headline      { font-size: 2.1rem; }
//   .rl-right         { padding: 28px 26px 22px; }
//   .rl-right-title   { font-size: 19px; }

//   .ob2-left         { flex: 0 0 36%; }
//   .ob2-right        { padding: 24px 26px 20px; }
//   .ob2-title        { font-size: 18px; }
// }

// /* intermediate tablet band — iPad Air / iPad Pro 11" / similar
//    (820px–900px) sit here so they get a tuned step instead of jumping
//    straight from 1024px spacing to 900px spacing. */
// @media (max-width: 900px) {
//   .rl-card, .ob2-card { max-width: 800px; }

//   .rl-left        { flex: 0 0 38%; padding: 24px 18px; }
//   .rl-headline    { font-size: 1.9rem; }
//   .rl-tagline     { font-size: 12.5px; }
//   .rl-desc        { font-size: 12px; }
//   .rl-right       { padding: 24px 22px 18px; }
//   .rl-right-title { font-size: 18px; }
//   .rl-role        { padding: 12px 14px; }
//   .rl-role-ico    { width: 40px; height: 40px; }

//   .ob2-left       { flex: 0 0 34%; }
//   .ob2-right      { padding: 20px 22px 18px; }
//   .ob2-title      { font-size: 17px; }
//   .ob2-opt        { padding: 11px 13px; }
//   .ob2-opt-ico    { width: 36px; height: 36px; }
// }

// /* ── tablet portrait band (e.g. iPad Mini 768×1024, iPad Air 820×1180,
//    iPad Pro 11" 834×1194, iPad Pro 12.9" 1024×1366) ──
//    Covers the FULL tablet-portrait width range (max-width 1024px, so
//    every iPad in portrait is included) gated by aspect ratio so phones
//    never match it. v6: only re-flows the LEFT PANEL's width (a fixed px
//    column instead of a %), it does NOT force any aspect-ratio or
//    object-fit on the image inside it — the image box still just flexes
//    to fill whatever vertical space is left in that column, and contain
//    (set once, globally, above) keeps the full image visible no matter
//    how that column's height shakes out. */
// @media (max-width: 1024px) and (min-aspect-ratio: 3/4) and (orientation: portrait) {
//   .rl-card, .ob2-card { max-width: 700px; }
//   .rl-left  { flex: 0 0 220px; padding: 20px 18px; }
//   .ob2-left { flex: 0 0 240px; }
// }

// /* ── phone portrait (stacked mobile layout) ──
//    max-width 767px keeps this from ever catching tablet portrait widths
//    (smallest tablet portrait is 744px+ but those are caught by the
//    aspect-ratio-gated rule above first, since both rules apply but this
//    one is more specific to true phone aspect ratios via max-aspect-ratio).
//    v6: image wrap boxes get a min-height (not aspect-ratio) so they take
//    a sensible chunk of the stacked layout's vertical space, and contain
//    does the rest — no crop possible at any phone width/rotation. */
// @media (max-width: 767px) and (max-aspect-ratio: 3/4) {
//   .rl-overlay, .ob2-overlay, .cp-overlay { padding: 10px; }

//   .rl-card, .ob2-card {
//     flex-direction: column;
//     max-width: 100%;
//     height: auto;
//     max-height: calc(100dvh - 20px);
//     border-radius: 16px;
//     margin: 0 auto;
//     overflow-y: auto;
//   }

//   .rl-left {
//     flex: 0 0 auto;
//     width: 100%;
//     padding: 18px 16px 14px;
//     border-bottom: 1px solid #f0ede8;
//     overflow: visible;
//     min-height: 0;
//   }
//   .rl-welcome  { font-size: 11px; }
//   .rl-headline { font-size: clamp(1.5rem, 7vw, 1.9rem); margin-bottom: 5px; }
//   .rl-tagline  { font-size: 11.5px; margin-bottom: 8px; }
//   .rl-divider  { width: 40px; margin-bottom: 10px; }
//   .rl-desc     { font-size: 11.5px; margin-bottom: 12px; max-width: 100%; }
//   .rl-illo {
//     margin-top: 12px;
//     width: 100%;
//     min-height: clamp(120px, 32dvh, 220px);
//     flex: 0 0 auto;
//   }
//   .rl-right        { flex: none; width: 100%; padding: 14px 14px 16px; min-height: 0; overflow: visible; }
//   .rl-roles        { gap: 9px; overflow: visible; flex: none; }
//   .rl-right-title  { font-size: 15px; margin-bottom: 4px; }
//   .rl-right-sub    { font-size: 11.5px; margin-bottom: 12px; }
//   .rl-role         { padding: 10px 12px; gap: 10px; border-radius: 10px; }
//   .rl-role-ico     { width: 36px; height: 36px; border-radius: 9px; }
//   .rl-role-name    { font-size: 12.5px; }
//   .rl-role-desc    { font-size: 10.5px; }
//   .rl-radio        { width: 18px; height: 18px; }
//   .rl-step-lbl     { font-size: 10.5px; }
//   .rl-footer       { margin-top: 12px; }
//   .rl-btn-continue { padding: 10px 16px; font-size: 12px; border-radius: 9px; }

//   .ob2-left {
//     flex: 0 0 auto;
//     width: 100%;
//     border-bottom: 1px solid #f0ede8;
//     min-height: 0;
//   }
//   .ob2-left-img-wrap {
//     min-height: clamp(160px, 40dvh, 300px);
//     flex: 0 0 auto;
//   }
//   .ob2-left-logo { top: 12px; left: 14px; font-size: 0.95rem; }

//   .ob2-right     { padding: 14px 16px 16px; border-left: none; min-height: 0; overflow: visible; }
//   .ob2-title     { font-size: 16px; margin-bottom: 4px; }
//   .ob2-sub       { font-size: 11.5px; margin-bottom: 10px; }
//   .ob2-hint      { font-size: 10.5px; padding: 4px 8px; margin-bottom: 10px; }
//   .ob2-segments  { gap: 4px; margin-bottom: 14px; }
//   .ob2-segment   { height: 4px; }
//   .ob2-options   { gap: 8px; overflow: visible; flex: none; }
//   .ob2-opt       { padding: 10px 12px; gap: 10px; border-radius: 10px; }
//   .ob2-opt-ico   { width: 32px; height: 32px; border-radius: 8px; }
//   .ob2-opt-label { font-size: 12px; }
//   .ob2-opt-desc  { font-size: 10.5px; }
//   .ob2-opt-check { width: 17px; height: 17px; }
//   .ob2-footer    { margin-top: 14px; position: sticky; bottom: 0; background: #fff; padding-bottom: 4px; }
//   .ob2-step-lbl  { font-size: 11px; }
//   .ob2-btn-continue { padding: 10px 16px; font-size: 12px; border-radius: 10px; }
//   .ob2-btn-back     { padding: 10px 13px; font-size: 11.5px; border-radius: 9px; }

//   .cp-modal { max-width: 460px; border-radius: 18px; }
// }

// @media (max-width: 480px) and (max-aspect-ratio: 3/4) {
//   .rl-headline { font-size: clamp(1.35rem, 8vw, 1.7rem); }
//   .rl-illo     { min-height: clamp(110px, 28dvh, 180px); }

//   .ob2-left-img-wrap { min-height: clamp(120px, 30dvh, 200px); }
// }

// @media (max-width: 360px) and (max-aspect-ratio: 3/4) {
//   .rl-right-sub  { display: none; }
//   .ob2-sub       { display: none; }
//   .ob2-opt-desc  { display: none; }
//   .rl-illo       { min-height: clamp(100px, 24dvh, 150px); }
//   .ob2-left-img-wrap { min-height: clamp(100px, 26dvh, 170px); }
// }

// /* ── landscape compact layout (phones AND short tablets in landscape) ──
//    Gated purely on viewport HEIGHT, not width, so it correctly catches
//    every device that is short top-to-bottom in landscape — phones
//    (≤430px tall) as well as smaller tablets in landscape that still
//    don't have much vertical room. v6: image columns here are a flexible
//    side panel (flex:1 1 auto, min-height:0) with no aspect-ratio lock —
//    contain shrinks the full image to fit the narrow/short space without
//    ever slicing it, which matters most here since landscape-compact is
//    the tightest space budget of any breakpoint. */
// @media (max-height: 500px) {
//   .rl-overlay, .ob2-overlay { padding: 8px; height: 100dvh; align-items: stretch; }

//   .rl-card, .ob2-card {
//     flex-direction: row;
//     max-width: 100%;
//     width: 100%;
//     height: auto;
//     max-height: calc(100dvh - 16px);
//     min-height: 0;
//     border-radius: 14px;
//     margin: 0;
//   }

//   .rl-left {
//     flex: 0 0 38%;
//     width: auto;
//     padding: 14px 16px;
//     overflow-y: auto;
//     border-bottom: none;
//     border-right: 1px solid #f0ede8;
//   }
//   .rl-welcome  { font-size: 10px; margin-bottom: 1px; }
//   .rl-headline { font-size: clamp(1.1rem, 4vw, 1.5rem); line-height: 1.05; margin-bottom: 4px; }
//   .rl-tagline  { font-size: 10px; margin-bottom: 5px; }
//   .rl-divider  { width: 30px; height: 2px; margin-bottom: 6px; }
//   .rl-desc     { font-size: 10px; line-height: 1.4; margin-bottom: 8px; }
//   .rl-illo     {
//     margin-top: 8px;
//     flex: 1 1 auto;
//     min-height: 50px;
//     width: 100%;
//   }

//   .rl-right { flex: 1; width: auto; padding: 14px 16px; min-height: 0; }
//   .rl-right-title  { font-size: 13px; }
//   .rl-right-sub    { font-size: 10.5px; margin-bottom: 8px; }
//   .rl-roles        { gap: 5px; }
//   .rl-role         { padding: 7px 9px; gap: 8px; border-radius: 8px; }
//   .rl-role-ico     { width: 30px; height: 30px; border-radius: 7px; }
//   .rl-role-name    { font-size: 12px; }
//   .rl-role-desc    { font-size: 10px; }
//   .rl-footer       { margin-top: 8px; }
//   .rl-btn-continue { padding: 7px 14px; font-size: 11px; border-radius: 8px; }

//   .ob2-left {
//     flex: 0 0 36%;
//     width: auto;
//     min-height: 0;
//     border-bottom: none;
//   }
//   .ob2-left-img-wrap {
//     flex: 1 1 auto;
//     min-height: 50px;
//   }
//   .ob2-left-logo { top: 10px; left: 12px; font-size: 0.85rem; }

//   .ob2-right {
//     flex: 1;
//     width: auto;
//     padding: 10px 16px;
//     min-height: 0;
//     border-left: 1px solid #f0ede8;
//   }
//   .ob2-segments  { gap: 3px; margin-bottom: 8px; }
//   .ob2-segment   { height: 3px; }
//   .ob2-title     { font-size: 13px; margin-bottom: 3px; }
//   .ob2-sub       { font-size: 10px; margin-bottom: 5px; }
//   .ob2-hint      { font-size: 9.5px; padding: 3px 7px; margin-bottom: 7px; }
//   .ob2-options   { gap: 4px; }
//   .ob2-opt       { padding: 6px 9px; gap: 7px; border-radius: 7px; }
//   .ob2-opt-ico   { width: 24px; height: 24px; border-radius: 6px; }
//   .ob2-opt-label { font-size: 11px; }
//   .ob2-opt-desc  { display: none; }
//   .ob2-opt-check { width: 15px; height: 15px; }
//   .ob2-footer    { margin-top: 7px; padding-top: 7px; }
//   .ob2-step-lbl  { font-size: 10px; }
//   .ob2-btn-continue { padding: 6px 11px; font-size: 10.5px; border-radius: 8px; }
//   .ob2-btn-back     { padding: 6px 9px;  font-size: 10.5px; border-radius: 7px; }

//   .cp-overlay { padding: 8px; }
//   .cp-modal { max-width: 480px; max-height: calc(100dvh - 16px); }
//   .gc-sub { margin-bottom: 10px; }
//   .gc-card-row { padding: 7px 0; }
//   .gc-check-ring { width: 38px; height: 38px; margin-bottom: 6px; }
//   .gc-title { font-size: 17px; margin-bottom: 3px; }
// }

// /* ── extra-short viewports (heavy browser zoom, very short windows) ──
//    Same idea as above but for truly cramped heights (e.g. zoomed in at
//    125%+ on a laptop, or a small browser window). Compacts vertical
//    rhythm further so the Continue/Submit button is guaranteed to render
//    inside the viewport without relying on scrolling at all. */
// @media (max-height: 380px) {
//   .ob2-segments, .rl-welcome { margin-bottom: 2px; }
//   .ob2-title, .rl-headline   { font-size: 12px !important; }
//   .ob2-sub, .rl-tagline, .rl-desc { display: none; }
//   .ob2-opt, .rl-role { padding: 5px 8px; }
//   .ob2-footer, .rl-footer { margin-top: 4px; padding-top: 4px; }
//   .gc-card-row { padding: 5px 0; }
//   .rl-illo { min-height: 36px; }
//   .ob2-left-img-wrap { min-height: 36px; }
// }
// `;

// export default function CompleteProfile({
//   onSkip,
//   prefillName = "",
//   prefillEmail = "",
//   googleCredential: googleCredentialProp = null,
//   isGoogleUser: isGoogleUserProp = false,
// }) {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const stored = (() => {
//     try { return JSON.parse(localStorage.getItem("lms_user") || "{}"); }
//     catch { return {}; }
//   })();

//   const isGoogle = Boolean(
//     isGoogleUserProp ||
//     location.state?.isGoogleUser ||
//     location.state?.fromGoogleLogin ||
//     stored.isGoogleUser,
//   );

//   const googleCredential =
//     googleCredentialProp ||
//     location.state?.googleCredential ||
//     sessionStorage.getItem("ilmora_google_credential") ||
//     null;

//   const resolvedName = prefillName || location.state?.name || stored.name || "";
//   const resolvedEmail = prefillEmail || location.state?.email || stored.email || "";

//   const [profileStage, setProfileStage] = useState("role");
//   const [onboardingStep, setOnboardingStep] = useState(0);
//   const [onboardingAnswers, setOnboardingAnswers] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});

//   const normalizeStoredRole = (raw) => {
//     if (!raw) return "";
//     const trimmed = raw.trim();
//     if (trimmed === "Manager" || trimmed === "trainer" || trimmed === "student") return trimmed;
//     const r = trimmed.toUpperCase();
//     if (["TENANT_ADMIN", "ADMIN", "BUSINESS", "MANAGER"].includes(r)) return "Manager";
//     if (r === "TRAINER") return "trainer";
//     if (r === "STUDENT") return "student";
//     return "";
//   };

//   const [role, setRole] = useState(() => {
//     const fromSession = normalizeStoredRole(sessionStorage.getItem("ilmora_selected_role"));
//     const fromLocal = normalizeStoredRole(localStorage.getItem("role"));
//     return fromSession || fromLocal || "";
//   });

//   const roleObj = ROLES.find((r) => r.value === role);
//   const roleDisplayLabel = roleObj?.label ||
//     (role === "Manager" ? "Business & Partnership" : role === "trainer" ? "Trainer" : role === "student" ? "Student" : role || "—");

//   const handleOnboardingSelect = (optionLabel) => {
//     setOnboardingAnswers((prev) => {
//       const key = `step_${onboardingStep}`;
//       const current = Array.isArray(prev[key]) ? prev[key] : [];
//       return {
//         ...prev,
//         [key]: current.includes(optionLabel)
//           ? current.filter((x) => x !== optionLabel)
//           : [...current, optionLabel],
//       };
//     });
//   };

//   const isOnboardingStepValid = () => {
//     const ans = onboardingAnswers[`step_${onboardingStep}`];
//     return Array.isArray(ans) && ans.length > 0;
//   };

//   const finishOnboarding = () => {
//     localStorage.setItem("ilmora_onboarding_answers", JSON.stringify({ role, answers: onboardingAnswers }));
//     if (role) sessionStorage.setItem("ilmora_selected_role", role);
//     setProfileStage("confirm");
//   };

//   const handleOnboardingContinue = () => {
//     const configs = ONBOARDING_CONFIGS[role] || [];
//     if (onboardingStep < configs.length - 1) {
//       setOnboardingStep((p) => p + 1);
//     } else {
//       finishOnboarding();
//     }
//   };

//   const handleOnboardingBack = () => {
//     if (onboardingStep > 0) {
//       setOnboardingStep((p) => p - 1);
//     } else {
//       setProfileStage("role");
//     }
//   };

//   const submitToBackend = async (answers) => {
//     localStorage.setItem("ilmora_onboarding_answers", JSON.stringify({ role, answers }));
//     if (role) sessionStorage.setItem("ilmora_selected_role", role);

//     const credential = googleCredential || sessionStorage.getItem("ilmora_google_credential");

//     if (!credential) {
//       console.warn("⚠️ Google credential not found — navigating to /ilm-demo");
//       if (onSkip) onSkip();
//       navigate("/ilm-demo", { replace: true });
//       return;
//     }

//     setLoading(true);
//     try {
//       const backendRole =
//         role === "student" ? "STUDENT" : role === "trainer" ? "TRAINER" : "TENANT_ADMIN";

//       const axiosRes = await authService.googleLogin({
//         idToken: credential,
//         role: backendRole,
//         onboardingAnswers: answers,
//       });
//       const res = axiosRes?.data ?? axiosRes;

//       if (res?.token) {
//         const finalRole = res.role || backendRole;
//         const normalizedUiRole = ["TENANT_ADMIN", "ADMIN", "BUSINESS"].includes(finalRole.toUpperCase())
//           ? "admin" : finalRole.toLowerCase();

//         localStorage.setItem("lms_token", res.token);
//         localStorage.setItem("role", finalRole);
//         if (res.organizationId) localStorage.setItem("organizationId", res.organizationId);
//         else localStorage.removeItem("organizationId");

//         localStorage.setItem("lms_user", JSON.stringify({
//           name: res.name || resolvedName,
//           email: res.email || resolvedEmail,
//           role: normalizedUiRole,
//           isGoogleUser: true,
//           profileCompleted: !!res.profileCompleted,
//           organizationId: res.organizationId || null,
//         }));

//         sessionStorage.removeItem("ilmora_google_credential");
//         sessionStorage.removeItem("ilmora_google_user");
//         sessionStorage.removeItem("ilmora_selected_role");
//       } else {
//         console.error("❌ No token in response:", res);
//       }
//     } catch (err) {
//       console.error("❌ Onboarding API error:", err);
//     } finally {
//       setLoading(false);
//     }

//     if (onSkip) onSkip();
//     navigate("/ilm-demo", { replace: true });
//   };

//   const handleConfirmSubmit = () => submitToBackend(onboardingAnswers);

//   /* ══════════════════════════════════════════
//      STAGE: role (Step 1 of 8)
//   ══════════════════════════════════════════ */
//   if (profileStage === "role") {
//     return (
//       <>
//         <style>{GLOBAL_CSS}</style>
//         <div className="rl-overlay">
//           <div className="rl-card">
//             {/* Left: brand + illustration */}
//             <div className="rl-left">
//               <div className="rl-welcome">Welcome to</div>
//               <div className="rl-headline">
//                 <span className="rl-ilm">ILM</span>&nbsp;<span className="rl-ora">ORA</span>
//               </div>
//               <div className="rl-tagline">Your AI Learning &amp; Growth Partner</div>
//               <div className="rl-divider" />
//               <div className="rl-desc">
//                 Step into a smarter way of learning and collaborating.
//                 Personalised. Powerful. Purposeful.
//               </div>
//               <div className="rl-illo">
//                 <img src={onboardingImage} alt="Students collaborating and learning together" />
//               </div>
//             </div>

//             {/* Right: role selection */}
//             <div className="rl-right">
//               <div className="rl-right-title">Choose your role ✨</div>
//               <div className="rl-right-sub">
//                 We'll personalise your ILMORA experience based on how you'll use the platform.
//               </div>
//               <div className="rl-roles">
//                 {ROLES.map((r) => (
//                   <div
//                     key={r.value}
//                     className={`rl-role${role === r.value ? " sel" : ""}`}
//                     onClick={() => setRole(r.value)}
//                   >
//                     <div className="rl-role-ico" style={{ background: r.bg }}>
//                       {r.icon}
//                     </div>
//                     <div className="rl-role-info">
//                       <div className="rl-role-name">{r.label}</div>
//                       <div className="rl-role-desc">{r.desc}</div>
//                     </div>
//                     <div className={`rl-radio${role === r.value ? " sel" : ""}`}>
//                       {role === r.value && <ICheck s={12} />}
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {errors.role && <div className="rl-err">{errors.role}</div>}

//               <div className="rl-footer">
//                 <span className="rl-step-lbl">Step 1 of 8</span>
//                 <button
//                   className="rl-btn-continue"
//                   disabled={!role}
//                   onClick={() => {
//                     if (!role) { setErrors({ role: "Please select a role" }); return; }
//                     setErrors({});
//                     sessionStorage.setItem("ilmora_selected_role", role);
//                     setProfileStage("onboarding");
//                   }}
//                 >
//                   Continue →
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </>
//     );
//   }

//   /* ══════════════════════════════════════════
//      STAGE: onboarding (Steps 2–7 of 8)
//   ══════════════════════════════════════════ */
//   if (profileStage === "onboarding") {
//     const configs = ONBOARDING_CONFIGS[role] || [];
//     const config = configs[onboardingStep] || {};
//     const isValid = isOnboardingStepValid();
//     const displayStep = onboardingStep + 2;
//     const totalSteps = 8;
//     const visual = ONBOARDING_VISUAL[role] || ONBOARDING_VISUAL.student;

//     return (
//       <>
//         <style>{GLOBAL_CSS}</style>
//         <div className="ob2-overlay">
//           <div className="ob2-card">
//             {/* Left: role photo only, with ILM ORA logo pinned top-right */}
//             <div className="ob2-left">
//               <div className="ob2-left-img-wrap">
//                 <div className="ob2-left-logo">
//                   <span className="ob2-logo-ilm">ILM</span>&nbsp;<span className="ob2-logo-ora">ORA</span>
//                 </div>
//                 <img className="ob2-left-img" src={visual.image} alt={`${roleDisplayLabel} onboarding`} />
//               </div>
//             </div>

//             {/* Right: quiz */}
//             <div className="ob2-right">
//               <div className="ob2-segments">
//                 {configs.map((_, i) => (
//                   <div key={i} className={`ob2-segment${i < onboardingStep ? " done" : i === onboardingStep ? " current" : ""}`}>
//                     <div className="ob2-segment-fill" />
//                   </div>
//                 ))}
//               </div>

//               <div className="ob2-title">{config.title} ✨</div>
//               <div className="ob2-sub">{config.subtitle}</div>

//               {config.multiSelect && (
//                 <div className="ob2-topbar">
//                   <button
//                     type="button"
//                     className={`ob2-select-all ${
//                       (onboardingAnswers[`step_${onboardingStep}`] || []).length ===
//                       (config.options || []).length
//                         ? "active"
//                         : ""
//                     }`}
//                     onClick={() => {
//                       const allOptions = (config.options || []).map((o) => o.label);

//                       setOnboardingAnswers((prev) => {
//                         const key = `step_${onboardingStep}`;
//                         const current = prev[key] || [];

//                         return {
//                           ...prev,
//                           [key]: current.length === allOptions.length ? [] : allOptions,
//                         };
//                       });
//                     }}
//                   >
//                     ✓ Select All
//                   </button>

//                   <div className="ob2-counter">
//                     {(onboardingAnswers[`step_${onboardingStep}`] || []).length}
//                     /
//                     {(config.options || []).length}
//                     {" "}Selected
//                   </div>
//                 </div>
//               )}

//               <div className="ob2-options">
//                 {(config.options || []).map((opt, oi) => {
//                   const isSelected = (onboardingAnswers[`step_${onboardingStep}`] || []).includes(opt.label);
//                   return (
//                     <div
//                       key={oi}
//                       className={`ob2-opt${isSelected ? " sel" : ""}`}
//                       onClick={() => handleOnboardingSelect(opt.label)}
//                     >
//                       <div className="ob2-opt-ico" style={{ background: roleObj?.bg || "rgba(142,68,173,0.10)" }}>
//                         {roleObj?.icon}
//                       </div>
//                       <div className="ob2-opt-info">
//                         <div className="ob2-opt-label">{opt.label}</div>
//                         {opt.desc && <div className="ob2-opt-desc">{opt.desc}</div>}
//                       </div>
//                       <div className="ob2-opt-check">
//                         {isSelected && <ICheck s={11} />}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>

//               <div className="ob2-footer">
//                 <span className="ob2-step-lbl">Step {displayStep} of {totalSteps}</span>
//                 <div className="ob2-foot-r">
//                   <button className="ob2-btn-back" onClick={handleOnboardingBack}>← Back</button>
//                   <button
//                     className="ob2-btn-continue"
//                     onClick={handleOnboardingContinue}
//                     disabled={!isValid}
//                   >
//                     {onboardingStep === configs.length - 1 ? "Finish →" : "Continue →"}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </>
//     );
//   }

//   /* ══════════════════════════════════════════
//      STAGE: confirm (Step 8 of 8)
//   ══════════════════════════════════════════ */
//   return (
//     <>
//       <style>{GLOBAL_CSS}</style>
//       <div className="cp-overlay">
//         <div className="cp-modal">
//           <div className="cp-hdr">
//             <div className="cp-hdr-top">
//               <div className="cp-logo">
//                 <span className="cp-logo-ilm">ILM</span>&nbsp;<span className="cp-logo-ora">ORA</span>
//               </div>
//             </div>
//             <div className="cp-orange-line" />
//           </div>

//           <div className="cp-body">
//             <div className="cp-confetti">
//               <span className="cp-dot-1" />
//               <span className="cp-dot-2" />
//               <span className="cp-dot-3" />
//               <span className="cp-dot-4" />
//               <span className="cp-dot-5" />
//               <span className="cp-dot-6" />
//               <span className="cp-dot-7" />
//             </div>

//             <div className="gc-check-ring">
//               <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#27ae60" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//                 <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
//                 <polyline points="22 4 12 14.01 9 11.01" />
//               </svg>
//             </div>
//             <div className="gc-title">Almost <em>done!</em></div>
//             <div className="gc-sub">Review your details below and submit to continue.</div>

//             <div className="gc-card">
//               <div className="gc-card-row">
//                 <div className="gc-card-icon" style={{ background: "rgba(230,126,34,0.10)" }}>
//                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e67e22" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                     <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
//                     <circle cx="12" cy="7" r="4" />
//                   </svg>
//                 </div>
//                 <div className="gc-card-text">
//                   <div className="gc-card-label">Name</div>
//                   <div className="gc-card-value">{resolvedName || "—"}</div>
//                 </div>
//               </div>

//               <div className="gc-card-row">
//                 <div className="gc-card-icon" style={{ background: "rgba(59,130,246,0.10)" }}>
//                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                     <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
//                     <polyline points="22,6 12,13 2,6" />
//                   </svg>
//                 </div>
//                 <div className="gc-card-text">
//                   <div className="gc-card-label">Email</div>
//                   <div className="gc-card-value">{resolvedEmail || "—"}</div>
//                 </div>
//               </div>

//               <div className="gc-card-row">
//                 <div className="gc-card-icon" style={{ background: roleObj?.bg || "rgba(39,174,96,0.10)" }}>
//                   {roleObj?.icon || (
//                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#27ae60" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                       <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
//                       <path d="M6 12v5c3 3 9 3 12 0v-5" />
//                     </svg>
//                   )}
//                 </div>
//                 <div className="gc-card-text">
//                   <div className="gc-card-label">Role</div>
//                   <div className="gc-card-value">{roleDisplayLabel}</div>
//                 </div>
//               </div>
//             </div>

//             {isGoogle && (
//               <div className="gc-google-row">
//                 <div className="gc-google-pill">
//                   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//                     <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
//                     <polyline points="22 4 12 14.01 9 11.01" />
//                   </svg>
//                   Verified via Google
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className="gc-foot">
//             <div className="gc-foot-top">
//               <span className="gc-step-lbl">Step 8 of 8</span>
//               <button className="ob-skip-link" onClick={() => setProfileStage("onboarding")}>
//                 ← Back
//               </button>
//             </div>
//             <button className="gc-btn-submit" onClick={handleConfirmSubmit} disabled={loading}>
//               {loading ? (<><ISpinner /> Connecting…</>) : (<><ICheck s={14} /> Submit &amp; Continue</>)}
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }existing 





























































































































































































import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import onboardingImage from "../../assets/onboarding.png";
import studentOnboardingImage from "../../assets/student-onboarding.png";
import trainerOnboardingImage from "../../assets/trainer-onboarding.png";
import managerOnboardingImage from "../../assets/manager-onboarding.png";

const ROLES = [
  {
    value: "student",
    label: "Student",
    desc: "Learn & grow with 300+ courses",
    color: "#27ae60",
    bg: "rgba(39,174,96,0.10)",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#27ae60" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
  },
  {
    value: "trainer",
    label: "Trainer",
    desc: "Teach & inspire thousands of learners",
    color: "#e67e22",
    bg: "rgba(230,126,34,0.10)",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e67e22" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="2" width="6" height="12" rx="3" />
        <path d="M19 10a7 7 0 0 1-14 0" />
        <line x1="12" y1="19" x2="12" y2="22" />
        <line x1="8" y1="22" x2="16" y2="22" />
      </svg>
    ),
  },
  {
    value: "Manager",
    label: "Business & Partnership",
    desc: "Scale your team with structured learning",
    color: "#8e44ad",
    bg: "rgba(142,68,173,0.10)",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8e44ad" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
  },
];

const ONBOARDING_VISUAL = {
  student: {
    image: studentOnboardingImage,
  },
  trainer: {
    image: trainerOnboardingImage,
  },
  Manager: {
    image: managerOnboardingImage,
  },
};

const ONBOARDING_CONFIGS = {
  student: [
    {
      title: "What do you want to learn?",
      subtitle: "Choose areas that matter most",
      multiSelect: true,
      options: [
        { label: "Programming & Development", desc: "Java, Python, web & software" },
        { label: "Data & AI", desc: "Data science, ML and AI tools" },
        { label: "Design & Creativity", desc: "UI/UX, graphics and content" },
        { label: "Business & Marketing", desc: "Digital marketing and growth" },
        { label: "Career Preparation", desc: "Interview skills and job readiness" },
      ],
    },
    {
      title: "Your current learning stage?",
      subtitle: "We'll personalise your recommendations",
      multiSelect: true,
      options: [
        { label: "School Student", desc: "Exploring basics and interests" },
        { label: "College Student", desc: "Building career-ready skills" },
        { label: "Fresher / Job Seeker", desc: "Preparing for first opportunity" },
        { label: "Working Learner", desc: "Upskilling alongside work" },
      ],
    },
    {
      title: "How do you prefer to learn?",
      subtitle: "Choose your comfortable learning style",
      multiSelect: true,
      options: [
        { label: "Live Classes", desc: "Interactive sessions with trainers" },
        { label: "Recorded Courses", desc: "Learn anytime at your own pace" },
        { label: "Practice Projects", desc: "Learn by building real tasks" },
        { label: "Mixed Learning", desc: "Live, recorded and practice together" },
      ],
    },
    {
      title: "Time available weekly?",
      subtitle: "We'll suggest the right pace for you",
      multiSelect: true,
      options: [
        { label: "1 - 3 hours", desc: "Light learning schedule" },
        { label: "4 - 6 hours", desc: "Balanced weekly progress" },
        { label: "7 - 10 hours", desc: "Focused learning plan" },
        { label: "10+ hours", desc: "Intensive learning mode" },
      ],
    },
    {
      title: "Your biggest student goal?",
      subtitle: "We'll tailor your onboarding",
      multiSelect: true,
      options: [
        { label: "Build Skills", desc: "Improve practical knowledge" },
        { label: "Get Certified", desc: "Earn completion certificates" },
        { label: "Get Internship / Job", desc: "Prepare for career opportunities" },
        { label: "Improve Academic Performance", desc: "Support college or school learning" },
      ],
    },
    {
      title: "Where do you want to start?",
      subtitle: "Choose your first ILMORA action",
      multiSelect: true,
      options: [
        { label: "Explore Courses", desc: "Browse available programs" },
        { label: "Join Live Class", desc: "Attend trainer-led sessions" },
        { label: "Complete Profile", desc: "Set up your student profile" },
        { label: "View Dashboard", desc: "Go to your learning workspace" },
      ],
    },
  ],
  trainer: [
    {
      title: "What do you want to teach?",
      subtitle: "Choose your teaching focus areas",
      multiSelect: true,
      options: [
        { label: "Programming & Technology", desc: "Coding, software and tech skills" },
        { label: "Data, AI & Analytics", desc: "Data science and analytics" },
        { label: "Design & Creative Skills", desc: "Design and creative tools" },
        { label: "Business & Marketing", desc: "Growth, sales and marketing" },
        { label: "Soft Skills & Career", desc: "Communication and career skills" },
      ],
    },
    {
      title: "Your trainer profile?",
      subtitle: "Personalise your trainer workspace",
      multiSelect: true,
      options: [
        { label: "Individual Trainer", desc: "Teaching independently" },
        { label: "Industry Expert", desc: "Sharing professional experience" },
        { label: "Coaching Mentor", desc: "Guiding students or job seekers" },
        { label: "Institute Trainer", desc: "Teaching for an organisation" },
      ],
    },
    {
      title: "How to deliver training?",
      subtitle: "We'll prepare the right teaching tools",
      multiSelect: true,
      options: [
        { label: "Live Sessions", desc: "Real-time interactive classes" },
        { label: "Recorded Lessons", desc: "Upload structured course content" },
        { label: "Assignments & Projects", desc: "Give learners practical tasks" },
        { label: "Hybrid Teaching", desc: "Live, recorded and assignments" },
      ],
    },
    {
      title: "Your training experience?",
      subtitle: "We'll adjust guidance for your level",
      multiSelect: true,
      options: [
        { label: "New Trainer", desc: "Starting your teaching journey" },
        { label: "1 - 2 Years", desc: "Some teaching experience" },
        { label: "3 - 5 Years", desc: "Experienced trainer" },
        { label: "5+ Years", desc: "Advanced teaching experience" },
      ],
    },
    {
      title: "Your biggest trainer goal?",
      subtitle: "We'll tailor your trainer onboarding",
      multiSelect: true,
      options: [
        { label: "Create Courses", desc: "Build structured learning content" },
        { label: "Teach Live Classes", desc: "Run interactive sessions" },
        { label: "Grow Learners", desc: "Reach more students" },
        { label: "Track Student Progress", desc: "Monitor performance and outcomes" },
      ],
    },
    {
      title: "Where do you want to start?",
      subtitle: "Choose your first trainer action",
      multiSelect: true,
      options: [
        { label: "Create Course", desc: "Start building a course" },
        { label: "Schedule Live Class", desc: "Plan your first session" },
        { label: "Complete Trainer Profile", desc: "Set up your teaching profile" },
        { label: "View Trainer Dashboard", desc: "Go to your workspace" },
      ],
    },
  ],
  Manager: [
    {
      title: "What do you want to manage?",
      subtitle: "Choose your organisation learning needs",
      multiSelect: true,
      options: [
        { label: "Student Training", desc: "Manage learners and courses" },
        { label: "Trainer Management", desc: "Manage trainers and sessions" },
        { label: "Corporate Upskilling", desc: "Train employees or teams" },
        { label: "Institute Programs", desc: "Run structured learning programs" },
        { label: "Reports & Analytics", desc: "Track learning outcomes" },
      ],
    },
    {
      title: "Type of organisation?",
      subtitle: "Personalise your admin workspace",
      multiSelect: true,
      options: [
        { label: "Educational Institute", desc: "School, college or training center" },
        { label: "Company / Business", desc: "Corporate team or business training" },
        { label: "Coaching Center", desc: "Skill-based or exam coaching" },
        { label: "Startup / Agency", desc: "Small team or service organisation" },
      ],
    },
    {
      title: "How many users to manage?",
      subtitle: "We'll prepare the right workspace scale",
      multiSelect: true,
      options: [
        { label: "1 - 50 users", desc: "Small learning setup" },
        { label: "51 - 200 users", desc: "Growing organisation" },
        { label: "201 - 1000 users", desc: "Large learning operation" },
        { label: "1000+ users", desc: "Enterprise-level training" },
      ],
    },
    {
      title: "Most important admin tools?",
      subtitle: "Choose what you need first",
      multiSelect: true,
      options: [
        { label: "Course Management", desc: "Create and manage learning programs" },
        { label: "User Management", desc: "Manage students, trainers and teams" },
        { label: "Live Class Scheduling", desc: "Plan and monitor sessions" },
        { label: "Certificates", desc: "Issue and manage certificates" },
        { label: "Analytics & Reports", desc: "Track progress and performance" },
      ],
    },
    {
      title: "Your biggest admin goal?",
      subtitle: "We'll tailor your onboarding",
      multiSelect: true,
      options: [
        { label: "Launch Learning Platform", desc: "Set up LMS for your organisation" },
        { label: "Improve Training Quality", desc: "Deliver better learning experiences" },
        { label: "Manage Teams Efficiently", desc: "Organise users, trainers and courses" },
        { label: "Track Business Outcomes", desc: "Measure progress and performance" },
      ],
    },
    {
      title: "Where do you want to start?",
      subtitle: "Choose your first admin action",
      multiSelect: true,
      options: [
        { label: "Setup Organisation", desc: "Complete business/admin profile" },
        { label: "Add Courses", desc: "Start building course catalog" },
        { label: "Invite Users", desc: "Add students, trainers or team members" },
        { label: "View Admin Dashboard", desc: "Go to your admin workspace" },
      ],
    },
  ],
};

const ISpinner = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83">
      <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.7s" repeatCount="indefinite" />
    </path>
  </svg>
);

const ICheck = ({ s = 14 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

/* ─────────────────────────────────────────────────────────────────────────────
   GLOBAL RESPONSIVE STYLES — v7
   (v2: rotation-safe, image-first rewrite)
   (v3: iPad Mini 768px off-by-one fix — 768px -> 767px on the two
        portrait queries; landscape-compact query switched from
        width-based to max-height: 500px)
   (v4: onboarding left-panel image gap fix — object-fit contain -> cover,
        which removed the zoom/viewport-dependent letterbox gap)
   (v5: Continue button clipping fix + smoothed breakpoint coverage band
        from 1180px down to 768px so no tablet width falls through
        ungated.)
   (v6: THE ACTUAL CROP FIX —
        v4 switched image containers from object-fit:contain to
        object-fit:cover to remove a letterbox GAP. That trade quietly
        introduced a CROP bug instead: cover fills a container by
        scaling the image up until it overflows, then clips whatever
        sticks out. Every later pass (v5) tuned the *container's*
        aspect-ratio at each breakpoint, but never checked the actual
        source image's aspect ratio against it — so on any device width
        where the forced container ratio didn't match the image's real
        ratio, cover sliced through the subject. That's the bug in the
        bug report screenshot (iPad-portrait band, image cut mid-subject).
        Tuning breakpoint numbers can never fully fix this, because the
        mismatch is between the CONTAINER'S FORCED SHAPE and the
        IMAGE'S OWN SHAPE — two independent numbers — not between the
        container and the viewport width.
        FIX: every image container below now uses object-fit: CONTAIN
        again, and no container forces a fixed aspect-ratio anymore.
        Containers size from flex (min-height + flex:1 1 auto) so they
        adapt to whatever space is available at any width, height,
        rotation, or zoom — and contain guarantees the full image is
        always visible inside that space, never cropped, only
        letterboxed (using the panel's own background color, so the
        letterbox reads as intentional padding, not a bug). This removes
        the dependency on knowing the exact source pixel dimensions of
        onboarding.png / student-onboarding.png / trainer-onboarding.png
        / manager-onboarding.png — contain is correct regardless of what
        those turn out to be.)
   (v7: ENTERPRISE COMPACT + AUDIT PASS —
        - Trimmed oversized base padding/margins/gaps across rl-left,
          rl-right, rl-roles, rl-role, rl-footer, ob2-right, ob2-options,
          ob2-opt, ob2-footer, ob2-topbar/select-all, cp-hdr/cp-body/gc-foot
          so more content sits above the fold without touching any
          functional class names, markup, or breakpoint structure.
        - Reduced the row-card height ceiling (760px -> 700px) on
          rl-card/ob2-card so the modal settles inside typical laptop/
          tablet viewport heights with less reliance on internal scroll.
        - Added defensive overflow-x: hidden on rl-overlay/ob2-overlay
          to rule out any horizontal scroll edge case.
        - Added missing compact rules for .ob2-topbar/.ob2-select-all/
          .ob2-counter in the phone-portrait and landscape-compact
          breakpoints (previously only sized for desktop/tablet, so they
          sat oversized on small screens).
        - Made .rl-footer sticky in the phone-portrait stacked layout to
          match .ob2-footer's existing sticky treatment, so the role-stage
          Continue button is never scrolled out of reach the same way the
          onboarding-stage Continue button already wasn't.
        - Tightened the mobile/480px/360px image min-height clamps so
          illustrations take a little less vertical budget on small
          screens, leaving more room for the form above the fold.
        No change to component logic, state, validation, routing, or any
        API call — this pass is CSS-only.)
   ───────────────────────────────────────────────────────────────────────── */
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

/* ════════════════ SHARED BASE ════════════════ */
.cp-overlay {
  position: fixed; inset: 0; z-index: 1000;
  width: 100%;
  box-sizing: border-box;
  background:
    radial-gradient(circle at 8% 90%, rgba(142,68,173,0.16), transparent 45%),
    radial-gradient(circle at 95% 92%, rgba(230,126,34,0.16), transparent 45%),
    radial-gradient(circle at 6% 6%, rgba(52,152,219,0.16), transparent 40%),
    radial-gradient(circle at 92% 4%, rgba(243,156,18,0.14), transparent 40%),
    #f3f0ec;
  display: flex; align-items: center; justify-content: center;
  padding: 14px;
  font-family: 'Inter', sans-serif;
  overflow: hidden;
  height: 100dvh;
}
.cp-modal {
  width: 100%; max-width: 540px;
  box-sizing: border-box;
  background: #ffffff;
  border-radius: 22px;
  box-shadow: 0 24px 56px rgba(20,20,30,0.16);
  display: flex; flex-direction: column;
  height: auto;
  max-height: calc(100dvh - 28px);
  overflow-y: auto;
  flex-shrink: 0;
  animation: cpIn .22s ease both;
  position: relative;
}
@keyframes cpIn { from { opacity:0; transform:scale(0.96) translateY(8px); } to { opacity:1; transform:scale(1) translateY(0); } }

.cp-hdr { padding: 14px 28px 0; flex-shrink: 0; background: #ffffff; border-radius: 22px 22px 0 0; }
.cp-hdr-top { display: flex; align-items: center; margin-bottom: 10px; }
.cp-logo { font-size: 1.2rem; font-weight: 800; letter-spacing: -0.3px; line-height: 1; }
.cp-logo-ilm { color: #27ae60; }
.cp-logo-ora { color: #e67e22; }
.cp-orange-line { height:3px; background:#e67e22; margin:0 -28px; flex-shrink: 0; }
.cp-body { flex: 1 1 auto; min-height: 0; overflow-y: auto; padding:20px 28px 6px; background:#ffffff; position: relative; }

/* — decorative confetti dots scattered around the check icon, like reference — */
.cp-confetti { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
.cp-confetti span {
  position: absolute;
  display: block;
  border-radius: 2px;
}
.cp-dot-1  { top: 18px;  left: 36px;  width: 6px;  height: 6px;  background: #cfe9d8; border-radius: 50%; }
.cp-dot-2  { top: 10px;  left: 78px;  width: 5px;  height: 5px;  background: #f0a93a; transform: rotate(45deg); }
.cp-dot-3  { top: 34px;  left: 110px; width: 6px;  height: 6px;  background: #cfe9d8; border-radius: 50%; }
.cp-dot-4  { top: 2px;   left: 168px; width: 5px;  height: 5px;  background: #cfe9d8; border-radius: 50%; }
.cp-dot-5  { top: 26px;  right: 100px;width: 6px;  height: 6px;  background: #f0a93a; transform: rotate(45deg); }
.cp-dot-6  { top: 6px;   right: 60px; width: 5px;  height: 5px;  background: #cfe9d8; border-radius: 50%; }
.cp-dot-7  { top: 40px;  right: 30px; width: 6px;  height: 6px;  background: #cfe9d8; border-radius: 50%; }

.gc-check-ring { width: 56px; height: 56px; border-radius: 50%; background: rgba(39,174,96,0.10); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; position: relative; z-index: 1; flex-shrink: 0; }
.gc-title { font-size: 24px; font-weight: 800; color: #1a1a2e; text-align: center; margin-bottom: 6px; letter-spacing: -0.3px; position: relative; z-index: 1; }
.gc-title em { font-style: italic; color: #27ae60; }
.gc-sub { font-size: 13px; color: #9a9aa1; text-align: center; margin-bottom: 22px; line-height: 1.5; position: relative; z-index: 1; }
.gc-card { background: #fff; border-radius: 14px; border: 1.5px solid #ece8e2; padding: 4px 18px; display: flex; flex-direction: column; margin-bottom: 16px; position: relative; z-index: 1; flex-shrink: 0; }
.gc-card-row { display: flex; align-items: center; gap: 13px; padding: 11px 0; }
.gc-card-row + .gc-card-row { border-top: 1px solid #f1ede6; }
.gc-card-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.gc-card-text { flex: 1; min-width: 0; }
.gc-card-label { font-size: 10px; color: #aaa; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; margin-bottom: 3px; }
.gc-card-value { font-size: 14.5px; font-weight: 700; color: #1a1a2e; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.gc-google-pill { display: inline-flex; align-items: center; gap: 6px; background: rgba(39,174,96,0.08); color: #27ae60; border-radius: 20px; padding: 6px 14px; font-size: 11.5px; font-weight: 700; margin: 0 auto 4px; position: relative; z-index: 1; }
.gc-google-row { display: flex; justify-content: center; flex-shrink: 0; }
.gc-foot { padding: 12px 28px 18px; background: #ffffff; flex-shrink: 0; border-radius: 0 0 22px 22px; }
.gc-foot-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; gap: 10px; }
.gc-btn-submit { width: 100%; padding: 13px; background: #27ae60; border: none; border-radius: 11px; font-family: 'Inter',sans-serif; font-size: 14px; font-weight: 700; color: #fff; cursor: pointer; box-shadow: 0 6px 16px rgba(39,174,96,.30); transition: opacity .16s, transform .12s; display: flex; align-items: center; justify-content: center; gap: 7px; }
.gc-btn-submit:hover:not(:disabled) { opacity: .9; transform: translateY(-1px); }
.gc-btn-submit:disabled { opacity: .45; cursor: not-allowed; transform: none; }
.ob-skip-link { background: none; border: none; cursor: pointer; font-family: 'Inter',sans-serif; font-size: 12px; color: #27ae60; font-weight: 600; text-decoration: none; flex-shrink: 0; display: inline-flex; align-items: center; gap: 4px; }
.gc-step-lbl { font-size: 12px; color: #a3a3aa; font-weight: 500; }

/* tablets / iPad mini */
@media (max-width: 900px) {
  .cp-modal { max-width: 460px; }
}

/* mobile / narrow */
@media (max-width: 640px) {
  .cp-overlay { padding: 8px; }
  .cp-modal { max-width: 420px; border-radius: 18px; }
  .cp-hdr { padding: 14px 20px 0; }
  .cp-orange-line { margin: 0 -20px; }
  .cp-body { padding: 22px 20px 6px; }
  .gc-check-ring { width: 48px; height: 48px; margin-bottom: 12px; }
  .gc-title { font-size: 20px; margin-bottom: 4px; }
  .gc-sub { font-size: 11.5px; margin-bottom: 16px; }
  .gc-card { padding: 2px 14px; margin-bottom: 12px; }
  .gc-card-row { padding: 10px 0; gap: 10px; }
  .gc-card-icon { width: 32px; height: 32px; border-radius: 8px; }
  .gc-card-label { font-size: 9px; }
  .gc-card-value { font-size: 13px; }
  .gc-foot { padding: 10px 20px 18px; }
  .gc-foot-top { margin-bottom: 10px; }
  .gc-btn-submit { padding: 11px; font-size: 13px; }
}

/* very short viewports */
@media (max-height: 620px) {
  .cp-modal { max-height: calc(100dvh - 16px); }
  .gc-sub { margin-bottom: 12px; }
  .gc-card-row { padding: 8px 0; }
  .gc-check-ring { width: 40px; height: 40px; margin-bottom: 8px; }
  .gc-title { font-size: 18px; margin-bottom: 4px; }
}

/* ════════════════ ROLE STAGE ════════════════ */
.rl-overlay {
  position: fixed; inset: 0; z-index: 1000;
  background:
    radial-gradient(circle at 8% 90%, rgba(142,68,173,0.16), transparent 45%),
    radial-gradient(circle at 95% 92%, rgba(230,126,34,0.16), transparent 45%),
    radial-gradient(circle at 6% 6%, rgba(52,152,219,0.16), transparent 40%),
    radial-gradient(circle at 92% 4%, rgba(243,156,18,0.14), transparent 40%),
    #f3f0ec;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  font-family: 'Inter', sans-serif;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100dvh;
}

/* ── ROLE CARD: Desktop default (side-by-side row) ──
   No min-height floor that can outgrow the viewport; height is a
   flexible min() with no forced minimum, and the card's row children
   (.rl-left / .rl-right) manage their own internal scrolling so the
   footer/Continue button is never pushed outside the visible card. */
.rl-card {
  width: 100%;
  max-width: 1080px;
  background: linear-gradient(180deg, #ffffff 0%, #fbfaf8 100%);
  border-radius: 22px;
  box-shadow: 0 28px 64px rgba(20,20,30,0.16);
  display: flex;
  flex-direction: row;
  overflow: hidden;
  height: min(700px, calc(100dvh - 32px));
  max-height: calc(100dvh - 32px);
  animation: rlIn .24s ease both;
}
@keyframes rlIn {
  from { opacity:0; transform: translateY(10px) scale(.98); }
  to   { opacity:1; transform: translateY(0)    scale(1);   }
}

/* ── LEFT PANEL: branding + illustration (role stage) ── */
.rl-left {
  flex: 0 0 44%;
  padding: 26px 28px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0;
  min-width: 0;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
}

.rl-welcome  { font-size: 12px; font-weight: 600; color: #6b6b72; margin-bottom: 2px; margin-top: 4px; flex-shrink: 0; }
.rl-headline { font-size: clamp(1.8rem, 3vw, 2.6rem); line-height: 1.06; font-weight: 800; letter-spacing: -0.5px; color: #1a1a2e; margin-bottom: 8px; flex-shrink: 0; }
.rl-headline .rl-ilm { color: #27ae60; }
.rl-headline .rl-ora { color: #e67e22; }
.rl-tagline  { font-size: 13px; font-weight: 600; color: #555; margin-bottom: 10px; flex-shrink: 0; }
.rl-divider  { width: 56px; height: 3px; border-radius: 2px; background: linear-gradient(90deg, #27ae60, #e67e22); margin-bottom: 10px; flex-shrink: 0; }
.rl-desc     { font-size: 13px; color: #8b8b93; line-height: 1.55; margin-bottom: 0; max-width: 340px; flex-shrink: 0; }

/* ── IMAGE CONTAINER — v6 fix ──
   No fixed aspect-ratio is forced here at the base rule or in ANY
   media query below. The box is purely flex-sized (flex:1 1 auto +
   min-height:0), so it simply occupies whatever space is left in the
   panel after the text above it. object-fit:contain on the <img>
   guarantees the ENTIRE source image is always visible inside that
   box — scaled down to fit, never scaled-up-then-clipped like cover
   does. This is what makes the fix independent of the image's real
   pixel dimensions: contain is correct for ANY aspect ratio. */
.rl-illo {
  margin-top: 16px;
  flex: 1 1 auto;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  border-radius: 14px;
  overflow: hidden;
  background: transparent;
}
.rl-illo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
  border-radius: 14px;
  display: block;
}

/* ── RIGHT PANEL: role selection ──
   .rl-roles scrolls internally (min-height:0 + overflow-y:auto)
   so the footer with the Continue button is ALWAYS pinned and visible,
   no matter how tall the role list gets relative to viewport height. */
.rl-right {
  flex: 1;
  padding: 26px 30px 22px;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-left: 1px solid #f0ede8;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}
.rl-right-title { font-size: 20px; font-weight: 800; color: #1a1a2e; margin-bottom: 5px; flex-shrink: 0; }
.rl-right-sub   { font-size: 13px; color: #9a9aa1; line-height: 1.5; margin-bottom: 14px; flex-shrink: 0; }
.rl-roles       { display: flex; flex-direction: column; gap: 9px; flex: 1 1 auto; min-height: 0; overflow-y: auto; padding-right: 2px; }
.rl-role {
  display: flex; align-items: center; gap: 14px;
  padding: 12px 14px; border-radius: 13px;
  border: 1.5px solid #ece8e2; background: #fff;
  cursor: pointer; transition: border-color .16s, box-shadow .16s, background .16s;
  user-select: none;
  flex-shrink: 0;
}
.rl-role:hover    { border-color: #d8d2c8; }
.rl-role.sel      { border-color: #27ae60; background: rgba(39,174,96,0.04); box-shadow: 0 0 0 3px rgba(39,174,96,0.10); }
.rl-role-ico      { width: 44px; height: 44px; border-radius: 11px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.rl-role-info     { flex: 1; min-width: 0; }
.rl-role-name     { font-size: 14px; font-weight: 700; color: #1a1a2e; }
.rl-role-desc     { font-size: 12px; color: #a3a3aa; margin-top: 2px; }
.rl-radio         { width: 21px; height: 21px; border-radius: 50%; border: 2px solid #d9d4cb; flex-shrink: 0; display: flex; align-items: center; justify-content: center; transition: border-color .16s, background .16s; }
.rl-radio.sel     { border-color: #27ae60; background: #27ae60; color: #fff; }
.rl-err           { font-size: 11.5px; color: #e74c3c; margin-top: 4px; margin-bottom: 4px; flex-shrink: 0; }
.rl-footer        { display: flex; align-items: center; justify-content: space-between; margin-top: 12px; flex-shrink: 0; padding-top: 4px; }
.rl-step-lbl      { font-size: 11.5px; color: #a3a3aa; font-weight: 500; }
.rl-btn-continue  {
  padding: 12px 24px;
  background: linear-gradient(92deg, #e67e22 0%, #f0532b 100%);
  border: none; border-radius: 11px;
  font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 700; color: #fff;
  cursor: pointer; box-shadow: 0 6px 18px rgba(230,126,34,.32);
  transition: opacity .16s, transform .12s;
  display: flex; align-items: center; gap: 6px;
  white-space: nowrap;
}
.rl-btn-continue:hover:not(:disabled) { opacity: .92; transform: translateY(-1px); }
.rl-btn-continue:disabled             { opacity: .4; cursor: not-allowed; transform: none; }

/* ════════════════ ONBOARDING STAGE ════════════════ */
.ob2-overlay {
  position: fixed; inset: 0; z-index: 1000;
  background:
    radial-gradient(circle at 8% 90%, rgba(142,68,173,0.16), transparent 45%),
    radial-gradient(circle at 95% 92%, rgba(230,126,34,0.16), transparent 45%),
    radial-gradient(circle at 6% 6%, rgba(52,152,219,0.16), transparent 40%),
    radial-gradient(circle at 92% 4%, rgba(243,156,18,0.14), transparent 40%),
    #f3f0ec;
  display: flex; align-items: center; justify-content: center;
  padding: 16px;
  font-family: 'Inter', sans-serif;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100dvh;
}

/* No rigid min-height; height is flexible min() with no minimum
   floor, so the card can shrink to fit short/zoomed-in viewports instead
   of overflowing and hiding its own footer. */
.ob2-card {
  width: 100%;
  max-width: 1080px;
  background: linear-gradient(180deg, #ffffff 0%, #fbfaf8 100%);
  border-radius: 22px;
  box-shadow: 0 28px 64px rgba(20,20,30,0.16);
  display: flex;
  flex-direction: row;
  overflow: hidden;
  height: min(700px, calc(100dvh - 32px));
  max-height: calc(100dvh - 32px);
  animation: ob2In .22s ease both;
}
@keyframes ob2In {
  from { opacity:0; transform: translateY(8px) scale(.98); }
  to   { opacity:1; transform: translateY(0)   scale(1);   }
}

.ob2-left {
  flex: 0 0 32%;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background: #faf7f4;
}
.ob2-left-logo {
  position: absolute;
  top: 14px;
  left: 16px;
  z-index: 2;
  font-size: 1.05rem;
  font-weight: 800;
  letter-spacing: -0.3px;
  line-height: 1;
  pointer-events: none;
  filter: drop-shadow(0 1px 3px rgba(0,0,0,0.18));
}
.ob2-left-logo .ob2-logo-ilm { color: #27ae60; }
.ob2-left-logo .ob2-logo-ora { color: #e67e22; }

/* ── IMAGE CONTAINER — v6 fix ──
   Same logic as .rl-illo above: no fixed aspect-ratio anywhere, in any
   media query. flex:1 1 auto + min-height:0 means this box simply
   takes whatever space .ob2-left has (which itself flexes against the
   quiz panel on the right), and object-fit:contain on the <img> below
   guarantees nothing is ever cropped, regardless of the real pixel
   dimensions of student/trainer/manager-onboarding.png. */
.ob2-left-img-wrap {
  flex: 1 1 auto;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #faf7f4;
  position: relative;
}
.ob2-left-img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
}
/* .ob2-right uses min-height:0 so its flex children can shrink
   properly; .ob2-options (below) is the part that scrolls, keeping the
   footer with Continue/Back permanently pinned and visible. */
.ob2-right {
  flex: 1;
  padding: 22px 30px 20px;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-left: 1px solid #f0ede8;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}
.ob2-segments     { display: flex; gap: 5px; margin-bottom: 20px; flex-shrink: 0; }
.ob2-segment      { flex: 1; height: 5px; border-radius: 3px; background: #ece7e0; overflow: hidden; }
.ob2-segment-fill { height: 100%; width: 0%; background: linear-gradient(90deg, #27ae60, #1e9e54); border-radius: 3px; transition: width .3s ease; }
.ob2-segment.done .ob2-segment-fill    { width: 100%; }
.ob2-segment.current .ob2-segment-fill { width: 100%; background: linear-gradient(90deg, #e67e22, #f0532b); }
.ob2-title     { font-size: 20px; font-weight: 800; color: #1a1a2e; margin-bottom: 5px; flex-shrink: 0; }
.ob2-sub       { font-size: 12.5px; color: #9a9aa1; line-height: 1.5; margin-bottom: 10px; flex-shrink: 0; }
.ob2-hint      { font-size: 11px; color: #27ae60; font-weight: 600; background: rgba(39,174,96,0.08); border-radius: 7px; padding: 5px 10px; margin-bottom: 14px; display: inline-flex; align-items: center; gap: 5px; width: fit-content; flex-shrink: 0; }
.ob2-topbar{
  display:flex;
  align-items:center;
  justify-content:space-between;
  margin-bottom:12px;
  padding-bottom:10px;
  border-bottom:1px solid #f1f1f1;
  flex-shrink: 0;
}

.ob2-select-all{
  display:inline-flex;
  align-items:center;
  gap:8px;
  padding:8px 14px;
  border:1px solid rgba(39,174,96,.15);
  border-radius:999px;
  background:#fff;
  color:#27ae60;
  font-size:12px;
  font-weight:700;
  cursor:pointer;
  box-shadow:0 2px 8px rgba(0,0,0,.05);
  transition:all .25s ease;
}

.ob2-select-all:hover{
  transform:translateY(-2px);
  box-shadow:0 8px 20px rgba(39,174,96,.12);
  border-color:#27ae60;
  background:#fff;
}

.ob2-select-all.active{
  background:#27ae60;
  color:#fff;
  border-color:#27ae60;
  box-shadow:0 8px 20px rgba(39,174,96,.25);
}

.ob2-counter{
  padding:6px 10px;
  border-radius:999px;
  background:#f5f7fa;
  color:#666;
  font-size:11px;
  font-weight:700;
}
/* This is the scroll container. flex:1 + min-height:0 +
   overflow-y:auto means a long options list scrolls WITHIN this box
   instead of expanding the card and shoving the footer/Continue button
   off-screen. */
.ob2-options{
  display:flex;
  flex-direction:column;
  gap:8px;
  flex:1 1 auto;
  min-height: 0;
  overflow-y: auto;
  padding-right: 2px;
  justify-content:flex-start;
}
.ob2-opt {
  display: flex; align-items: center; gap: 12px;
  padding: 10px 13px; border-radius: 12px;
  border: 1.5px solid #ece8e2; background: #fff;
  cursor: pointer; transition: border-color .16s, box-shadow .16s, background .16s;
  user-select: none; flex-shrink: 0;
}
.ob2-opt:hover              { border-color: #d8d2c8; }
.ob2-opt.sel                { border-color: #27ae60; background: rgba(39,174,96,0.04); box-shadow: 0 0 0 3px rgba(39,174,96,0.10); }
.ob2-opt-ico                { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.ob2-opt-info               { flex: 1; min-width: 0; }
.ob2-opt-label              { font-size: 13px; font-weight: 700; color: #1a1a2e; }
.ob2-opt-desc               { font-size: 11.5px; color: #a3a3aa; margin-top: 2px; line-height: 1.35; }
.ob2-opt-check              { width: 19px; height: 19px; border-radius: 5px; border: 2px solid #d9d4cb; flex-shrink: 0; display: flex; align-items: center; justify-content: center; transition: border-color .16s, background .16s; }
.ob2-opt.sel .ob2-opt-check { border-color: #27ae60; background: #27ae60; color: #fff; }
/* footer is flex-shrink:0 and sits outside the scrolling
   .ob2-options box, so Continue/Back are always rendered and clickable,
   regardless of zoom level or how many options are in the list. */
.ob2-footer {
  display:flex;
  align-items:center;
  justify-content:space-between;
  margin-top: 10px;
  padding-top:12px;
  flex-shrink: 0;
  border-top: 1px solid #f5f2ed;
}
.ob2-step-lbl  { font-size: 11.5px; color: #a3a3aa; font-weight: 500; }
.ob2-foot-r    { display: flex; gap: 9px; align-items: center; }
.ob2-btn-back     { padding: 11px 16px; background: #fff; border: 1.5px solid #e4dfd8; border-radius: 10px; font-family: 'Inter',sans-serif; font-size: 12.5px; font-weight: 600; color: #6b6b72; cursor: pointer; transition: background .16s; white-space: nowrap; }
.ob2-btn-back:hover { background: #f5f0eb; }
.ob2-btn-continue { padding: 12px 22px; background: linear-gradient(92deg, #e67e22 0%, #f0532b 100%); border: none; border-radius: 11px; font-family: 'Inter',sans-serif; font-size: 13px; font-weight: 700; color: #fff; cursor: pointer; box-shadow: 0 6px 18px rgba(230,126,34,.32); transition: opacity .16s, transform .12s; display: flex; align-items: center; gap: 6px; white-space: nowrap; }
.ob2-btn-continue:hover:not(:disabled) { opacity: .92; transform: translateY(-1px); }
.ob2-btn-continue:disabled             { opacity: .4; cursor: not-allowed; transform: none; }


/* ══════════════════════════════════════════════════════════════════
   RESPONSIVE — width-based scale-down (still ROW layout)
   Breakpoint coverage is a continuous band from 1180px down to 768px
   (desktop -> small laptop -> large tablet -> standard tablet), so
   there is no untuned "gap" device width. NOTE — v6: none of these
   rules touch object-fit or force an aspect-ratio on the image
   containers anymore; they only resize padding/text/icon sizes. The
   image containers stay flex-sized + contain at every single one of
   these breakpoints, which is what makes the crop fix hold everywhere
   instead of only at hand-picked widths.
══════════════════════════════════════════════════════════════════ */

@media (max-width: 1180px) {
  .rl-card, .ob2-card { max-width: 960px; }
}

@media (max-width: 1024px) {
  .rl-card, .ob2-card { max-width: 860px; }

  .rl-left          { flex: 0 0 40%; padding: 24px 20px; }
  .rl-headline      { font-size: 2.1rem; }
  .rl-right         { padding: 24px 24px 20px; }
  .rl-right-title   { font-size: 19px; }

  .ob2-left         { flex: 0 0 36%; }
  .ob2-right        { padding: 20px 24px 18px; }
  .ob2-title        { font-size: 18px; }
}

/* intermediate tablet band — iPad Air / iPad Pro 11" / similar
   (820px–900px) sit here so they get a tuned step instead of jumping
   straight from 1024px spacing to 900px spacing. */
@media (max-width: 900px) {
  .rl-card, .ob2-card { max-width: 800px; }

  .rl-left        { flex: 0 0 38%; padding: 20px 16px; }
  .rl-headline    { font-size: 1.9rem; }
  .rl-tagline     { font-size: 12.5px; }
  .rl-desc        { font-size: 12px; }
  .rl-right       { padding: 20px 20px 16px; }
  .rl-right-title { font-size: 18px; }
  .rl-role        { padding: 11px 13px; }
  .rl-role-ico    { width: 40px; height: 40px; }

  .ob2-left       { flex: 0 0 34%; }
  .ob2-right      { padding: 18px 20px 16px; }
  .ob2-title      { font-size: 17px; }
  .ob2-opt        { padding: 10px 12px; }
  .ob2-opt-ico    { width: 36px; height: 36px; }
}

/* ── tablet portrait band (e.g. iPad Mini 768×1024, iPad Air 820×1180,
   iPad Pro 11" 834×1194, iPad Pro 12.9" 1024×1366) ──
   Covers the FULL tablet-portrait width range (max-width 1024px, so
   every iPad in portrait is included) gated by aspect ratio so phones
   never match it. v6: only re-flows the LEFT PANEL's width (a fixed px
   column instead of a %), it does NOT force any aspect-ratio or
   object-fit on the image inside it — the image box still just flexes
   to fill whatever vertical space is left in that column, and contain
   (set once, globally, above) keeps the full image visible no matter
   how that column's height shakes out. */
@media (max-width: 1024px) and (min-aspect-ratio: 3/4) and (orientation: portrait) {
  .rl-card, .ob2-card { max-width: 700px; }
  .rl-left  { flex: 0 0 220px; padding: 18px 16px; }
  .ob2-left { flex: 0 0 240px; }
}

/* ── phone portrait (stacked mobile layout) ──
   max-width 767px keeps this from ever catching tablet portrait widths
   (smallest tablet portrait is 744px+ but those are caught by the
   aspect-ratio-gated rule above first, since both rules apply but this
   one is more specific to true phone aspect ratios via max-aspect-ratio).
   v6: image wrap boxes get a min-height (not aspect-ratio) so they take
   a sensible chunk of the stacked layout's vertical space, and contain
   does the rest — no crop possible at any phone width/rotation. */
@media (max-width: 767px) and (max-aspect-ratio: 3/4) {
  .rl-overlay, .ob2-overlay, .cp-overlay { padding: 10px; }

  .rl-card, .ob2-card {
    flex-direction: column;
    max-width: 100%;
    height: auto;
    max-height: calc(100dvh - 20px);
    border-radius: 16px;
    margin: 0 auto;
    overflow-y: auto;
  }

  .rl-left {
    flex: 0 0 auto;
    width: 100%;
    padding: 18px 16px 14px;
    border-bottom: 1px solid #f0ede8;
    overflow: visible;
    min-height: 0;
  }
  .rl-welcome  { font-size: 11px; }
  .rl-headline { font-size: clamp(1.5rem, 7vw, 1.9rem); margin-bottom: 5px; }
  .rl-tagline  { font-size: 11.5px; margin-bottom: 8px; }
  .rl-divider  { width: 40px; margin-bottom: 10px; }
  .rl-desc     { font-size: 11.5px; margin-bottom: 12px; max-width: 100%; }
  .rl-illo {
    margin-top: 12px;
    width: 100%;
    min-height: clamp(100px, 26dvh, 180px);
    flex: 0 0 auto;
  }
  .rl-right        { flex: none; width: 100%; padding: 14px 14px 16px; min-height: 0; overflow: visible; }
  .rl-roles        { gap: 9px; overflow: visible; flex: none; }
  .rl-right-title  { font-size: 15px; margin-bottom: 4px; }
  .rl-right-sub    { font-size: 11.5px; margin-bottom: 12px; }
  .rl-role         { padding: 10px 12px; gap: 10px; border-radius: 10px; }
  .rl-role-ico     { width: 36px; height: 36px; border-radius: 9px; }
  .rl-role-name    { font-size: 12.5px; }
  .rl-role-desc    { font-size: 10.5px; }
  .rl-radio        { width: 18px; height: 18px; }
  .rl-step-lbl     { font-size: 10.5px; }
  .rl-footer       { margin-top: 10px; position: sticky; bottom: 0; background: #fff; padding-top: 6px; padding-bottom: 2px; }
  .rl-btn-continue { padding: 10px 16px; font-size: 12px; border-radius: 9px; }

  .ob2-left {
    flex: 0 0 auto;
    width: 100%;
    border-bottom: 1px solid #f0ede8;
    min-height: 0;
  }
  .ob2-left-img-wrap {
    min-height: clamp(130px, 32dvh, 240px);
    flex: 0 0 auto;
  }
  .ob2-left-logo { top: 12px; left: 14px; font-size: 0.95rem; }

  .ob2-right     { padding: 14px 16px 16px; border-left: none; min-height: 0; overflow: visible; }
  .ob2-title     { font-size: 16px; margin-bottom: 4px; }
  .ob2-sub       { font-size: 11.5px; margin-bottom: 10px; }
  .ob2-hint      { font-size: 10.5px; padding: 4px 8px; margin-bottom: 10px; }
  .ob2-topbar       { margin-bottom: 10px; padding-bottom: 8px; }
  .ob2-select-all   { padding: 7px 12px; font-size: 11px; gap: 6px; }
  .ob2-counter      { padding: 5px 9px; font-size: 10px; }
  .ob2-segments  { gap: 4px; margin-bottom: 14px; }
  .ob2-segment   { height: 4px; }
  .ob2-options   { gap: 8px; overflow: visible; flex: none; }
  .ob2-opt       { padding: 10px 12px; gap: 10px; border-radius: 10px; }
  .ob2-opt-ico   { width: 32px; height: 32px; border-radius: 8px; }
  .ob2-opt-label { font-size: 12px; }
  .ob2-opt-desc  { font-size: 10.5px; }
  .ob2-opt-check { width: 17px; height: 17px; }
  .ob2-footer    { margin-top: 14px; position: sticky; bottom: 0; background: #fff; padding-bottom: 4px; }
  .ob2-step-lbl  { font-size: 11px; }
  .ob2-btn-continue { padding: 10px 16px; font-size: 12px; border-radius: 10px; }
  .ob2-btn-back     { padding: 10px 13px; font-size: 11.5px; border-radius: 9px; }

  .cp-modal { max-width: 460px; border-radius: 18px; }
}

@media (max-width: 480px) and (max-aspect-ratio: 3/4) {
  .rl-headline { font-size: clamp(1.35rem, 8vw, 1.7rem); }
  .rl-illo     { min-height: clamp(90px, 22dvh, 150px); }

  .ob2-left-img-wrap { min-height: clamp(100px, 24dvh, 160px); }
}

@media (max-width: 360px) and (max-aspect-ratio: 3/4) {
  .rl-right-sub  { display: none; }
  .ob2-sub       { display: none; }
  .ob2-opt-desc  { display: none; }
  .rl-illo       { min-height: clamp(85px, 20dvh, 130px); }
  .ob2-left-img-wrap { min-height: clamp(90px, 22dvh, 140px); }
}

/* ── landscape compact layout (phones AND short tablets in landscape) ──
   Gated purely on viewport HEIGHT, not width, so it correctly catches
   every device that is short top-to-bottom in landscape — phones
   (≤430px tall) as well as smaller tablets in landscape that still
   don't have much vertical room. v6: image columns here are a flexible
   side panel (flex:1 1 auto, min-height:0) with no aspect-ratio lock —
   contain shrinks the full image to fit the narrow/short space without
   ever slicing it, which matters most here since landscape-compact is
   the tightest space budget of any breakpoint. */
@media (max-height: 500px) {
  .rl-overlay, .ob2-overlay { padding: 8px; height: 100dvh; align-items: stretch; }

  .rl-card, .ob2-card {
    flex-direction: row;
    max-width: 100%;
    width: 100%;
    height: auto;
    max-height: calc(100dvh - 16px);
    min-height: 0;
    border-radius: 14px;
    margin: 0;
  }

  .rl-left {
    flex: 0 0 38%;
    width: auto;
    padding: 14px 16px;
    overflow-y: auto;
    border-bottom: none;
    border-right: 1px solid #f0ede8;
  }
  .rl-welcome  { font-size: 10px; margin-bottom: 1px; }
  .rl-headline { font-size: clamp(1.1rem, 4vw, 1.5rem); line-height: 1.05; margin-bottom: 4px; }
  .rl-tagline  { font-size: 10px; margin-bottom: 5px; }
  .rl-divider  { width: 30px; height: 2px; margin-bottom: 6px; }
  .rl-desc     { font-size: 10px; line-height: 1.4; margin-bottom: 8px; }
  .rl-illo     {
    margin-top: 8px;
    flex: 1 1 auto;
    min-height: 50px;
    width: 100%;
  }

  .rl-right { flex: 1; width: auto; padding: 14px 16px; min-height: 0; }
  .rl-right-title  { font-size: 13px; }
  .rl-right-sub    { font-size: 10.5px; margin-bottom: 8px; }
  .rl-roles        { gap: 5px; }
  .rl-role         { padding: 7px 9px; gap: 8px; border-radius: 8px; }
  .rl-role-ico     { width: 30px; height: 30px; border-radius: 7px; }
  .rl-role-name    { font-size: 12px; }
  .rl-role-desc    { font-size: 10px; }
  .rl-footer       { margin-top: 8px; }
  .rl-btn-continue { padding: 7px 14px; font-size: 11px; border-radius: 8px; }

  .ob2-left {
    flex: 0 0 36%;
    width: auto;
    min-height: 0;
    border-bottom: none;
  }
  .ob2-left-img-wrap {
    flex: 1 1 auto;
    min-height: 50px;
  }
  .ob2-left-logo { top: 10px; left: 12px; font-size: 0.85rem; }

  .ob2-right {
    flex: 1;
    width: auto;
    padding: 10px 16px;
    min-height: 0;
    border-left: 1px solid #f0ede8;
  }
  .ob2-segments  { gap: 3px; margin-bottom: 8px; }
  .ob2-segment   { height: 3px; }
  .ob2-title     { font-size: 13px; margin-bottom: 3px; }
  .ob2-sub       { font-size: 10px; margin-bottom: 5px; }
  .ob2-hint      { font-size: 9.5px; padding: 3px 7px; margin-bottom: 7px; }
  .ob2-topbar       { margin-bottom: 6px; padding-bottom: 6px; }
  .ob2-select-all   { padding: 5px 10px; font-size: 10px; gap: 5px; }
  .ob2-counter      { padding: 4px 8px; font-size: 9.5px; }
  .ob2-options   { gap: 4px; }
  .ob2-opt       { padding: 6px 9px; gap: 7px; border-radius: 7px; }
  .ob2-opt-ico   { width: 24px; height: 24px; border-radius: 6px; }
  .ob2-opt-label { font-size: 11px; }
  .ob2-opt-desc  { display: none; }
  .ob2-opt-check { width: 15px; height: 15px; }
  .ob2-footer    { margin-top: 7px; padding-top: 7px; }
  .ob2-step-lbl  { font-size: 10px; }
  .ob2-btn-continue { padding: 6px 11px; font-size: 10.5px; border-radius: 8px; }
  .ob2-btn-back     { padding: 6px 9px;  font-size: 10.5px; border-radius: 7px; }

  .cp-overlay { padding: 8px; }
  .cp-modal { max-width: 480px; max-height: calc(100dvh - 16px); }
  .gc-sub { margin-bottom: 10px; }
  .gc-card-row { padding: 7px 0; }
  .gc-check-ring { width: 38px; height: 38px; margin-bottom: 6px; }
  .gc-title { font-size: 17px; margin-bottom: 3px; }
}

/* ── extra-short viewports (heavy browser zoom, very short windows) ──
   Same idea as above but for truly cramped heights (e.g. zoomed in at
   125%+ on a laptop, or a small browser window). Compacts vertical
   rhythm further so the Continue/Submit button is guaranteed to render
   inside the viewport without relying on scrolling at all. */
@media (max-height: 380px) {
  .ob2-segments, .rl-welcome { margin-bottom: 2px; }
  .ob2-title, .rl-headline   { font-size: 12px !important; }
  .ob2-sub, .rl-tagline, .rl-desc { display: none; }
  .ob2-opt, .rl-role { padding: 5px 8px; }
  .ob2-footer, .rl-footer { margin-top: 4px; padding-top: 4px; }
  .gc-card-row { padding: 5px 0; }
  .rl-illo { min-height: 36px; }
  .ob2-left-img-wrap { min-height: 36px; }
}
`;

export default function CompleteProfile({
  onSkip,
  prefillName = "",
  prefillEmail = "",
  googleCredential: googleCredentialProp = null,
  isGoogleUser: isGoogleUserProp = false,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const stored = (() => {
    try { return JSON.parse(localStorage.getItem("lms_user") || "{}"); }
    catch { return {}; }
  })();

  const isGoogle = Boolean(
    isGoogleUserProp ||
    location.state?.isGoogleUser ||
    location.state?.fromGoogleLogin ||
    stored.isGoogleUser,
  );

  const googleCredential =
    googleCredentialProp ||
    location.state?.googleCredential ||
    sessionStorage.getItem("ilmora_google_credential") ||
    null;

  const resolvedName = prefillName || location.state?.name || stored.name || "";
  const resolvedEmail = prefillEmail || location.state?.email || stored.email || "";

  const [profileStage, setProfileStage] = useState("role");
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [onboardingAnswers, setOnboardingAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const normalizeStoredRole = (raw) => {
    if (!raw) return "";
    const trimmed = raw.trim();
    if (trimmed === "Manager" || trimmed === "trainer" || trimmed === "student") return trimmed;
    const r = trimmed.toUpperCase();
    if (["TENANT_ADMIN", "ADMIN", "BUSINESS", "MANAGER"].includes(r)) return "Manager";
    if (r === "TRAINER") return "trainer";
    if (r === "STUDENT") return "student";
    return "";
  };

  const [role, setRole] = useState(() => {
    const fromSession = normalizeStoredRole(sessionStorage.getItem("ilmora_selected_role"));
    const fromLocal = normalizeStoredRole(localStorage.getItem("role"));
    return fromSession || fromLocal || "";
  });

  const roleObj = ROLES.find((r) => r.value === role);
  const roleDisplayLabel = roleObj?.label ||
    (role === "Manager" ? "Business & Partnership" : role === "trainer" ? "Trainer" : role === "student" ? "Student" : role || "—");

  const handleOnboardingSelect = (optionLabel) => {
    setOnboardingAnswers((prev) => {
      const key = `step_${onboardingStep}`;
      const current = Array.isArray(prev[key]) ? prev[key] : [];
      return {
        ...prev,
        [key]: current.includes(optionLabel)
          ? current.filter((x) => x !== optionLabel)
          : [...current, optionLabel],
      };
    });
  };

  const isOnboardingStepValid = () => {
    const ans = onboardingAnswers[`step_${onboardingStep}`];
    return Array.isArray(ans) && ans.length > 0;
  };

  const finishOnboarding = () => {
    localStorage.setItem("ilmora_onboarding_answers", JSON.stringify({ role, answers: onboardingAnswers }));
    if (role) sessionStorage.setItem("ilmora_selected_role", role);
    setProfileStage("confirm");
  };

  const handleOnboardingContinue = () => {
    const configs = ONBOARDING_CONFIGS[role] || [];
    if (onboardingStep < configs.length - 1) {
      setOnboardingStep((p) => p + 1);
    } else {
      finishOnboarding();
    }
  };

  const handleOnboardingBack = () => {
    if (onboardingStep > 0) {
      setOnboardingStep((p) => p - 1);
    } else {
      setProfileStage("role");
    }
  };

  const submitToBackend = async (answers) => {
    localStorage.setItem("ilmora_onboarding_answers", JSON.stringify({ role, answers }));
    if (role) sessionStorage.setItem("ilmora_selected_role", role);

    const credential = googleCredential || sessionStorage.getItem("ilmora_google_credential");

    if (!credential) {
      console.warn("⚠️ Google credential not found — navigating to /ilm-demo");
      if (onSkip) onSkip();
      navigate("/ilm-demo", { replace: true });
      return;
    }

    setLoading(true);
    try {
      const backendRole =
        role === "student" ? "STUDENT" : role === "trainer" ? "TRAINER" : "TENANT_ADMIN";

      const axiosRes = await authService.googleLogin({
        idToken: credential,
        role: backendRole,
        onboardingAnswers: answers,
      });
      const res = axiosRes?.data ?? axiosRes;

      if (res?.token) {
        const finalRole = res.role || backendRole;
        const normalizedUiRole = ["TENANT_ADMIN", "ADMIN", "BUSINESS"].includes(finalRole.toUpperCase())
          ? "admin" : finalRole.toLowerCase();

        localStorage.setItem("lms_token", res.token);
        localStorage.setItem("role", finalRole);
        if (res.organizationId) localStorage.setItem("organizationId", res.organizationId);
        else localStorage.removeItem("organizationId");

        localStorage.setItem("lms_user", JSON.stringify({
          name: res.name || resolvedName,
          email: res.email || resolvedEmail,
          role: normalizedUiRole,
          isGoogleUser: true,
          profileCompleted: !!res.profileCompleted,
          organizationId: res.organizationId || null,
        }));

        sessionStorage.removeItem("ilmora_google_credential");
        sessionStorage.removeItem("ilmora_google_user");
        sessionStorage.removeItem("ilmora_selected_role");
      } else {
        console.error("❌ No token in response:", res);
      }
    } catch (err) {
      console.error("❌ Onboarding API error:", err);
    } finally {
      setLoading(false);
    }

    if (onSkip) onSkip();
    navigate("/ilm-demo", { replace: true });
  };

  const handleConfirmSubmit = () => submitToBackend(onboardingAnswers);

  /* ══════════════════════════════════════════
     STAGE: role (Step 1 of 8)
  ══════════════════════════════════════════ */
  if (profileStage === "role") {
    return (
      <>
        <style>{GLOBAL_CSS}</style>
        <div className="rl-overlay">
          <div className="rl-card">
            {/* Left: brand + illustration */}
            <div className="rl-left">
              <div className="rl-welcome">Welcome to</div>
              <div className="rl-headline">
                <span className="rl-ilm">ILM</span>&nbsp;<span className="rl-ora">ORA</span>
              </div>
              <div className="rl-tagline">Your AI Learning &amp; Growth Partner</div>
              <div className="rl-divider" />
              <div className="rl-desc">
                Step into a smarter way of learning and collaborating.
                Personalised. Powerful. Purposeful.
              </div>
              <div className="rl-illo">
                <img src={onboardingImage} alt="Students collaborating and learning together" />
              </div>
            </div>

            {/* Right: role selection */}
            <div className="rl-right">
              <div className="rl-right-title">Choose your role ✨</div>
              <div className="rl-right-sub">
                We'll personalise your ILMORA experience based on how you'll use the platform.
              </div>
              <div className="rl-roles">
                {ROLES.map((r) => (
                  <div
                    key={r.value}
                    className={`rl-role${role === r.value ? " sel" : ""}`}
                    onClick={() => setRole(r.value)}
                  >
                    <div className="rl-role-ico" style={{ background: r.bg }}>
                      {r.icon}
                    </div>
                    <div className="rl-role-info">
                      <div className="rl-role-name">{r.label}</div>
                      <div className="rl-role-desc">{r.desc}</div>
                    </div>
                    <div className={`rl-radio${role === r.value ? " sel" : ""}`}>
                      {role === r.value && <ICheck s={12} />}
                    </div>
                  </div>
                ))}
              </div>

              {errors.role && <div className="rl-err">{errors.role}</div>}

              <div className="rl-footer">
                <span className="rl-step-lbl">Step 1 of 8</span>
                <button
                  className="rl-btn-continue"
                  disabled={!role}
                  onClick={() => {
                    if (!role) { setErrors({ role: "Please select a role" }); return; }
                    setErrors({});
                    sessionStorage.setItem("ilmora_selected_role", role);
                    setProfileStage("onboarding");
                  }}
                >
                  Continue →
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  /* ══════════════════════════════════════════
     STAGE: onboarding (Steps 2–7 of 8)
  ══════════════════════════════════════════ */
  if (profileStage === "onboarding") {
    const configs = ONBOARDING_CONFIGS[role] || [];
    const config = configs[onboardingStep] || {};
    const isValid = isOnboardingStepValid();
    const displayStep = onboardingStep + 2;
    const totalSteps = 8;
    const visual = ONBOARDING_VISUAL[role] || ONBOARDING_VISUAL.student;

    return (
      <>
        <style>{GLOBAL_CSS}</style>
        <div className="ob2-overlay">
          <div className="ob2-card">
            {/* Left: role photo only, with ILM ORA logo pinned top-right */}
            <div className="ob2-left">
              <div className="ob2-left-img-wrap">
                <div className="ob2-left-logo">
                  <span className="ob2-logo-ilm">ILM</span>&nbsp;<span className="ob2-logo-ora">ORA</span>
                </div>
                <img className="ob2-left-img" src={visual.image} alt={`${roleDisplayLabel} onboarding`} />
              </div>
            </div>

            {/* Right: quiz */}
            <div className="ob2-right">
              <div className="ob2-segments">
                {configs.map((_, i) => (
                  <div key={i} className={`ob2-segment${i < onboardingStep ? " done" : i === onboardingStep ? " current" : ""}`}>
                    <div className="ob2-segment-fill" />
                  </div>
                ))}
              </div>

              <div className="ob2-title">{config.title} ✨</div>
              <div className="ob2-sub">{config.subtitle}</div>

              {config.multiSelect && (
                <div className="ob2-topbar">
                  <button
                    type="button"
                    className={`ob2-select-all ${
                      (onboardingAnswers[`step_${onboardingStep}`] || []).length ===
                      (config.options || []).length
                        ? "active"
                        : ""
                    }`}
                    onClick={() => {
                      const allOptions = (config.options || []).map((o) => o.label);

                      setOnboardingAnswers((prev) => {
                        const key = `step_${onboardingStep}`;
                        const current = prev[key] || [];

                        return {
                          ...prev,
                          [key]: current.length === allOptions.length ? [] : allOptions,
                        };
                      });
                    }}
                  >
                    ✓ Select All
                  </button>

                  <div className="ob2-counter">
                    {(onboardingAnswers[`step_${onboardingStep}`] || []).length}
                    /
                    {(config.options || []).length}
                    {" "}Selected
                  </div>
                </div>
              )}

              <div className="ob2-options">
                {(config.options || []).map((opt, oi) => {
                  const isSelected = (onboardingAnswers[`step_${onboardingStep}`] || []).includes(opt.label);
                  return (
                    <div
                      key={oi}
                      className={`ob2-opt${isSelected ? " sel" : ""}`}
                      onClick={() => handleOnboardingSelect(opt.label)}
                    >
                      <div className="ob2-opt-ico" style={{ background: roleObj?.bg || "rgba(142,68,173,0.10)" }}>
                        {roleObj?.icon}
                      </div>
                      <div className="ob2-opt-info">
                        <div className="ob2-opt-label">{opt.label}</div>
                        {opt.desc && <div className="ob2-opt-desc">{opt.desc}</div>}
                      </div>
                      <div className="ob2-opt-check">
                        {isSelected && <ICheck s={11} />}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="ob2-footer">
                <span className="ob2-step-lbl">Step {displayStep} of {totalSteps}</span>
                <div className="ob2-foot-r">
                  <button className="ob2-btn-back" onClick={handleOnboardingBack}>← Back</button>
                  <button
                    className="ob2-btn-continue"
                    onClick={handleOnboardingContinue}
                    disabled={!isValid}
                  >
                    {onboardingStep === configs.length - 1 ? "Finish →" : "Continue →"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  /* ══════════════════════════════════════════
     STAGE: confirm (Step 8 of 8)
  ══════════════════════════════════════════ */
  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div className="cp-overlay">
        <div className="cp-modal">
          <div className="cp-hdr">
            <div className="cp-hdr-top">
              <div className="cp-logo">
                <span className="cp-logo-ilm">ILM</span>&nbsp;<span className="cp-logo-ora">ORA</span>
              </div>
            </div>
            <div className="cp-orange-line" />
          </div>

          <div className="cp-body">
            <div className="cp-confetti">
              <span className="cp-dot-1" />
              <span className="cp-dot-2" />
              <span className="cp-dot-3" />
              <span className="cp-dot-4" />
              <span className="cp-dot-5" />
              <span className="cp-dot-6" />
              <span className="cp-dot-7" />
            </div>

            <div className="gc-check-ring">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#27ae60" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div className="gc-title">Almost <em>done!</em></div>
            <div className="gc-sub">Review your details below and submit to continue.</div>

            <div className="gc-card">
              <div className="gc-card-row">
                <div className="gc-card-icon" style={{ background: "rgba(230,126,34,0.10)" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e67e22" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div className="gc-card-text">
                  <div className="gc-card-label">Name</div>
                  <div className="gc-card-value">{resolvedName || "—"}</div>
                </div>
              </div>

              <div className="gc-card-row">
                <div className="gc-card-icon" style={{ background: "rgba(59,130,246,0.10)" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div className="gc-card-text">
                  <div className="gc-card-label">Email</div>
                  <div className="gc-card-value">{resolvedEmail || "—"}</div>
                </div>
              </div>

              <div className="gc-card-row">
                <div className="gc-card-icon" style={{ background: roleObj?.bg || "rgba(39,174,96,0.10)" }}>
                  {roleObj?.icon || (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#27ae60" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                      <path d="M6 12v5c3 3 9 3 12 0v-5" />
                    </svg>
                  )}
                </div>
                <div className="gc-card-text">
                  <div className="gc-card-label">Role</div>
                  <div className="gc-card-value">{roleDisplayLabel}</div>
                </div>
              </div>
            </div>

            {isGoogle && (
              <div className="gc-google-row">
                <div className="gc-google-pill">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  Verified via Google
                </div>
              </div>
            )}
          </div>

          <div className="gc-foot">
            <div className="gc-foot-top">
              <span className="gc-step-lbl">Step 8 of 8</span>
              <button className="ob-skip-link" onClick={() => setProfileStage("onboarding")}>
                ← Back
              </button>
            </div>
            <button className="gc-btn-submit" onClick={handleConfirmSubmit} disabled={loading}>
              {loading ? (<><ISpinner /> Connecting…</>) : (<><ICheck s={14} /> Submit &amp; Continue</>)}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}