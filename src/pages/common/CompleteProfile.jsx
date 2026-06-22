

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import authService from "../../services/authService";

const ROLES = [
  {
    value: "student",
    label: "Student",
    desc: "Learn & grow with 300+ courses",
    color: "#27ae60",
    bg: "rgba(39,174,96,0.10)",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#27ae60"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
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
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#e67e22"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
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
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#8e44ad"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
  },
];

const ONBOARDING_CONFIGS = {
  student: [
    {
      title: "What do you want to learn?",
      subtitle: "Choose areas that matter most",
      multiSelect: true,
      options: [
        {
          label: "Programming & Development",
          desc: "Java, Python, web & software",
        },
        { label: "Data & AI", desc: "Data science, ML and AI tools" },
        { label: "Design & Creativity", desc: "UI/UX, graphics and content" },
        { label: "Business & Marketing", desc: "Digital marketing and growth" },
        {
          label: "Career Preparation",
          desc: "Interview skills and job readiness",
        },
      ],
    },
    {
      title: "Your current learning stage?",
      subtitle: "We'll personalise your recommendations",
      multiSelect: true,
      options: [
        { label: "School Student", desc: "Exploring basics and interests" },
        { label: "College Student", desc: "Building career-ready skills" },
        {
          label: "Fresher / Job Seeker",
          desc: "Preparing for first opportunity",
        },
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
        {
          label: "Mixed Learning",
          desc: "Live, recorded and practice together",
        },
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
        {
          label: "Get Internship / Job",
          desc: "Prepare for career opportunities",
        },
        {
          label: "Improve Academic Performance",
          desc: "Support college or school learning",
        },
      ],
    },
    {
      title: "Where do you want to start?",
      subtitle: "Choose your first ILM ORA action",
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
        {
          label: "Programming & Technology",
          desc: "Coding, software and tech skills",
        },
        { label: "Data, AI & Analytics", desc: "Data science and analytics" },
        {
          label: "Design & Creative Skills",
          desc: "Design and creative tools",
        },
        { label: "Business & Marketing", desc: "Growth, sales and marketing" },
        {
          label: "Soft Skills & Career",
          desc: "Communication and career skills",
        },
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
        {
          label: "Assignments & Projects",
          desc: "Give learners practical tasks",
        },
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
        {
          label: "Track Student Progress",
          desc: "Monitor performance and outcomes",
        },
      ],
    },
    {
      title: "Where do you want to start?",
      subtitle: "Choose your first trainer action",
      multiSelect: true,
      options: [
        { label: "Create Course", desc: "Start building a course" },
        { label: "Schedule Live Class", desc: "Plan your first session" },
        {
          label: "Complete Trainer Profile",
          desc: "Set up your teaching profile",
        },
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
        {
          label: "Institute Programs",
          desc: "Run structured learning programs",
        },
        { label: "Reports & Analytics", desc: "Track learning outcomes" },
      ],
    },
    {
      title: "Type of organisation?",
      subtitle: "Personalise your admin workspace",
      multiSelect: true,
      options: [
        {
          label: "Educational Institute",
          desc: "School, college or training center",
        },
        {
          label: "Company / Business",
          desc: "Corporate team or business training",
        },
        { label: "Coaching Center", desc: "Skill-based or exam coaching" },
        {
          label: "Startup / Agency",
          desc: "Small team or service organisation",
        },
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
        {
          label: "Course Management",
          desc: "Create and manage learning programs",
        },
        {
          label: "User Management",
          desc: "Manage students, trainers and teams",
        },
        { label: "Live Class Scheduling", desc: "Plan and monitor sessions" },
        { label: "Certificates", desc: "Issue and manage certificates" },
        {
          label: "Analytics & Reports",
          desc: "Track progress and performance",
        },
      ],
    },
    {
      title: "Your biggest admin goal?",
      subtitle: "We'll tailor your onboarding",
      multiSelect: true,
      options: [
        {
          label: "Launch Learning Platform",
          desc: "Set up LMS for your organisation",
        },
        {
          label: "Improve Training Quality",
          desc: "Deliver better learning experiences",
        },
        {
          label: "Manage Teams Efficiently",
          desc: "Organise users, trainers and courses",
        },
        {
          label: "Track Business Outcomes",
          desc: "Measure progress and performance",
        },
      ],
    },
    {
      title: "Where do you want to start?",
      subtitle: "Choose your first admin action",
      multiSelect: true,
      options: [
        {
          label: "Setup Organisation",
          desc: "Complete business/admin profile",
        },
        { label: "Add Courses", desc: "Start building course catalog" },
        {
          label: "Invite Users",
          desc: "Add students, trainers or team members",
        },
        { label: "View Admin Dashboard", desc: "Go to your admin workspace" },
      ],
    },
  ],
};

// BUG FIX: Animated spinner SVG — was inline JSX in original but missing from render in some paths
const ISpinner = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
  >
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83">
      <animateTransform
        attributeName="transform"
        type="rotate"
        from="0 12 12"
        to="360 12 12"
        dur="0.7s"
        repeatCount="indefinite"
      />
    </path>
  </svg>
);

const ICheck = ({ s = 14 }) => (
  <svg
    width={s}
    height={s}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

/*
 * FLOW (per diagram):
 *   "role"       → Step 1: Pick Student / Trainer / Manager  (Step 1 of 8)
 *   "onboarding" → Steps 2-7: 6-step quiz                    (Step 2-7 of 8)
 *   "confirm"    → Step 8: Profile Review (Name+Email+Role)  → API → navigate("/ilm-demo")
 *
 * BUG FIXES applied:
 *  1. normalizeStoredRole: "Manager" casing was sometimes lost between session/localStorage
 *  2. finishOnboarding: was not persisting role to sessionStorage before moving to confirm
 *  3. submitToBackend (Skip path): was navigating to "/" instead of "/ilm-demo"
 *  4. submitToBackend: lms_user.role mapping was wrong for TENANT_ADMIN — should be "admin" not "manager"
 *  5. submitToBackend: profileCompleted was never being set to true after successful google login
 *  6. handleOnboardingBack at step 0: correctly returns to "role" stage
 *  7. Confirm stage: progress bar was hardcoded 87% — now correctly shows 100% (step 8 of 8)
 *  8. Step label in onboarding: was using onboardingStep+2 but total was 8, now consistent
 *  9. Role stage: "Step 1 of 8" label was missing from footer — added
 * 10. Skip button in role stage: called submitToBackend({}) but role was "" — guard added
 */
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
    try {
      return JSON.parse(localStorage.getItem("lms_user") || "{}");
    } catch {
      return {};
    }
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
  const resolvedEmail =
    prefillEmail || location.state?.email || stored.email || "";

  const [profileStage, setProfileStage] = useState("role");
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [onboardingAnswers, setOnboardingAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // BUG FIX 1: normalizeStoredRole — "Manager" must survive round-trip through storage
  const normalizeStoredRole = (raw) => {
    if (!raw) return "";
    const trimmed = raw.trim();
    // exact-match first (preserves "Manager" casing)
    if (trimmed === "Manager" || trimmed === "trainer" || trimmed === "student")
      return trimmed;
    const r = trimmed.toUpperCase();
    if (["TENANT_ADMIN", "ADMIN", "BUSINESS", "MANAGER"].includes(r))
      return "Manager";
    if (r === "TRAINER") return "trainer";
    if (r === "STUDENT") return "student";
    return "";
  };

  const [role, setRole] = useState(() => {
    const fromSession = normalizeStoredRole(
      sessionStorage.getItem("ilmora_selected_role"),
    );
    const fromLocal = normalizeStoredRole(localStorage.getItem("role"));
    return fromSession || fromLocal || "";
  });

  const roleObj = ROLES.find((r) => r.value === role);
  const roleDisplayLabel =
    roleObj?.label ||
    (role === "Manager"
      ? "Business & Partnership"
      : role === "trainer"
        ? "Trainer"
        : role === "student"
          ? "Student"
          : role || "—");

  // ── Onboarding helpers ──────────────────────────────────────────────────
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

  // BUG FIX 2: persist role to sessionStorage before moving to confirm
  const finishOnboarding = () => {
    localStorage.setItem(
      "ilmora_onboarding_answers",
      JSON.stringify({ role, answers: onboardingAnswers }),
    );
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

  // BUG FIX 6: back from step 0 returns to role selection
  const handleOnboardingBack = () => {
    if (onboardingStep > 0) {
      setOnboardingStep((p) => p - 1);
    } else {
      setProfileStage("role");
    }
  };

  // ── Submit to backend ────────────────────────────────────────────────────
  const submitToBackend = async (answers) => {
    localStorage.setItem(
      "ilmora_onboarding_answers",
      JSON.stringify({ role, answers }),
    );
    if (role) sessionStorage.setItem("ilmora_selected_role", role);

    const credential =
      googleCredential || sessionStorage.getItem("ilmora_google_credential");

    // BUG FIX 3: non-Google / skip path — navigate to /ilm-demo not "/"
    if (!credential) {
      console.warn("⚠️ Google credential not found — navigating to /ilm-demo");
      if (onSkip) onSkip();
      navigate("/ilm-demo", { replace: true });
      return;
    }

    setLoading(true);
    try {
      const backendRole =
        role === "student"
          ? "STUDENT"
          : role === "trainer"
            ? "TRAINER"
            : "TENANT_ADMIN";

      const axiosRes = await authService.googleLogin({
        idToken: credential,
        role: backendRole,
        onboardingAnswers: answers,
      });
      const res = axiosRes?.data ?? axiosRes;

      if (res?.token) {
        const finalRole = res.role || backendRole;

        // BUG FIX 4: role stored in lms_user must match what the rest of the app expects
        // admin/tenant_admin → "admin", trainer → "trainer", student → "student"
        const normalizedUiRole = ["TENANT_ADMIN", "ADMIN", "BUSINESS"].includes(
          finalRole.toUpperCase(),
        )
          ? "admin"
          : finalRole.toLowerCase();

        localStorage.setItem("lms_token", res.token);
        localStorage.setItem("role", finalRole);

        if (res.organizationId)
          localStorage.setItem("organizationId", res.organizationId);
        else localStorage.removeItem("organizationId");

        // BUG FIX 5: profileCompleted flag — set to true when backend confirms it,
        // but do NOT force-set to true here; respect what the backend returns.
        localStorage.setItem(
          "lms_user",
          JSON.stringify({
            name: res.name || resolvedName,
            email: res.email || resolvedEmail,
            role: normalizedUiRole,
            isGoogleUser: true,
            profileCompleted: !!res.profileCompleted, // honour backend value
            organizationId: res.organizationId || null,
          }),
        );

        // Clean up session storage
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
    // BUG FIX 3 (also here): always go to /ilm-demo after submit
    navigate("/ilm-demo", { replace: true });
  };

  const handleConfirmSubmit = () => submitToBackend(onboardingAnswers);

  /* ════════ SHARED STYLES ════════ */
  const sharedStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    .cp-overlay {
      position: fixed; inset: 0; z-index: 1000;
      background: rgba(0,0,0,0.5);
      display: flex; align-items: center; justify-content: center;
      padding: 12px;
      font-family: 'Inter', sans-serif;
    }

    .cp-modal {
      width: 100%; max-width: 400px;
      background: #faf7f4;
      border-radius: 16px;
      box-shadow: 0 20px 56px rgba(0,0,0,0.22);
      display: flex; flex-direction: column;
      max-height: calc(100vh - 24px);
      overflow: hidden;
      animation: cpIn .22s ease both;
    }
    .ob-modal {
      width: 100%; max-width: 480px;
      background: #faf7f4;
      border-radius: 16px;
      box-shadow: 0 20px 56px rgba(0,0,0,0.18);
      display: flex; flex-direction: column;
      max-height: calc(100vh - 24px);
      overflow: hidden;
      animation: cpIn .22s ease both;
    }
    @keyframes cpIn { from { opacity:0; transform:scale(0.96) translateY(8px); } to { opacity:1; transform:scale(1) translateY(0); } }

    .cp-hdr { padding: 11px 16px 0; flex-shrink: 0; background: #faf7f4; border-radius: 16px 16px 0 0; }
    .cp-hdr-top { display: flex; align-items: center; margin-bottom: 9px; }
    .cp-logo { font-size: 1.15rem; font-weight: 800; letter-spacing: -0.3px; line-height: 1; }
    .cp-logo-ilm { color: #27ae60; }
    .cp-logo-ora { color: #e67e22; }
    .cp-hdr-right { margin-left: auto; display: flex; align-items: center; gap: 10px; }
    .cp-orange-line { height:2.5px; background:#e67e22; margin:0 -16px; }
    .cp-prog { height:2px; background:#ece7e1; flex-shrink:0; }
    .cp-prog-fill { height:100%; background:#e67e22; transition:width .4s ease; }

    .cp-body { flex:1; overflow-y:auto; padding:14px 16px 8px; background:#faf7f4; }
    .cp-body::-webkit-scrollbar { width:3px; }
    .cp-body::-webkit-scrollbar-thumb { background:#ddd5cb; border-radius:3px; }
    .cp-title { font-size:16px; font-weight:700; color:#111; margin-bottom:3px; }
    .cp-sub { font-size:11.5px; color:#aaa; margin-bottom:12px; line-height:1.4; }

    .cp-roles { display:flex; flex-direction:column; gap:7px; }
    .cp-role { display:flex; align-items:center; gap:10px; padding:10px 12px; border-radius:10px; border:1.5px solid #ede8e0; background:#fff; cursor:pointer; transition:all .16s; user-select:none; }
    .cp-role:hover { border-color:#d5cdc4; }
    .cp-role.sel { border-color:#e67e22; box-shadow:0 0 0 2.5px rgba(230,126,34,.10); }
    .cp-role-ico { width:34px; height:34px; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .cp-role-info { flex:1; }
    .cp-role-name { font-size:13px; font-weight:700; color:#111; }
    .cp-role-desc { font-size:11px; color:#bbb; margin-top:1px; }
    .cp-radio { width:16px; height:16px; border-radius:50%; border:2px solid #d5cdc5; flex-shrink:0; display:flex; align-items:center; justify-content:center; transition:border-color .16s; }
    .cp-radio.sel { border-color:#e67e22; }
    .cp-radio-dot { width:7px; height:7px; border-radius:50%; background:#e67e22; }

    .cp-foot { display:flex; align-items:center; justify-content:space-between; padding:10px 16px; border-top:1px solid #ece7e0; background:#faf7f4; flex-shrink:0; border-radius:0 0 16px 16px; }
    .cp-step-lbl { font-size:11px; color:#bbb; font-weight:500; }
    .cp-foot-r { display:flex; gap:7px; align-items:center; }
    .cp-btn-back { padding:8px 14px; background:#fff; border:1.5px solid #e4dfd8; border-radius:8px; font-family:'Inter',sans-serif; font-size:12px; font-weight:600; color:#888; cursor:pointer; transition:all .16s; }
    .cp-btn-back:hover { background:#f5f0eb; }
    .cp-btn-next { padding:8px 20px; background:#e67e22; border:none; border-radius:9px; font-family:'Inter',sans-serif; font-size:12px; font-weight:700; color:#fff; cursor:pointer; box-shadow:0 2px 8px rgba(230,126,34,.30); transition:opacity .16s, transform .12s; display:flex; align-items:center; gap:4px; }
    .cp-btn-next:hover:not(:disabled) { opacity:.88; transform:translateY(-1px); }
    .cp-btn-next:disabled { opacity:.35; cursor:not-allowed; transform:none; }
    .cp-err-g { font-size:10px; color:#e74c3c; margin-top:5px; }

    .ob-options { display:grid; grid-template-columns:1fr; gap:7px; margin-bottom:14px; }
    .ob-opt { display:flex; align-items:flex-start; gap:10px; padding:9px 12px; border-radius:10px; border:1.5px solid #ede8e0; background:#fff; cursor:pointer; transition:all .16s; user-select:none; }
    .ob-opt:hover { border-color:#d5cdc4; }
    .ob-opt.sel { border-color:#e67e22; background:#fff8f2; box-shadow:0 0 0 2.5px rgba(230,126,34,.10); }
    .ob-opt-info { flex:1; }
    .ob-opt-label { font-size:12.5px; font-weight:700; color:#111; }
    .ob-opt-desc { font-size:11px; color:#bbb; margin-top:1px; }
    .ob-opt-check { width:16px; height:16px; border-radius:4px; border:2px solid #d5cdc5; flex-shrink:0; display:flex; align-items:center; justify-content:center; margin-top:2px; transition:all .16s; }
    .ob-opt.sel .ob-opt-check { border-color:#e67e22; background:#e67e22; }
    .ob-multi-hint { font-size:10.5px; color:#e67e22; font-weight:600; background:rgba(230,126,34,0.08); border-radius:5px; padding:3px 8px; margin-bottom:10px; display:inline-flex; align-items:center; gap:4px; }
    .ob-skip-link { background:none; border:none; cursor:pointer; font-family:'Inter',sans-serif; font-size:11.5px; color:#bbb; text-decoration:underline; }

    /* confirm / gc */
    .gc-body { flex:1; overflow-y:auto; padding:18px 16px 10px; }
    .gc-check-ring { width:44px; height:44px; border-radius:50%; background:rgba(39,174,96,0.10); display:flex; align-items:center; justify-content:center; margin:0 auto 10px; }
    .gc-title { font-size:18px; font-weight:800; color:#111; text-align:center; margin-bottom:4px; }
    .gc-title em { font-style:italic; color:#27ae60; }
    .gc-sub { font-size:11.5px; color:#aaa; text-align:center; margin-bottom:14px; line-height:1.45; }
    .gc-card { background:#fff; border-radius:10px; border:1.5px solid #ede8e0; padding:10px 12px; display:flex; flex-direction:column; gap:9px; margin-bottom:10px; }
    .gc-card-row { display:flex; align-items:center; gap:10px; }
    .gc-card-icon { width:30px; height:30px; border-radius:7px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .gc-card-label { font-size:10px; color:#aaa; font-weight:600; text-transform:uppercase; letter-spacing:.04em; }
    .gc-card-value { font-size:13px; font-weight:700; color:#111; }
    .gc-google-pill { display:inline-flex; align-items:center; gap:5px; background:rgba(39,174,96,0.08); color:#27ae60; border-radius:20px; padding:4px 10px; font-size:10.5px; font-weight:600; margin:0 auto; }
    .gc-foot { padding:10px 16px; border-top:1px solid #ece7e0; background:#faf7f4; flex-shrink:0; border-radius:0 0 16px 16px; }
    .gc-btn-submit { width:100%; padding:11px; background:#27ae60; border:none; border-radius:10px; font-family:'Inter',sans-serif; font-size:13px; font-weight:700; color:#fff; cursor:pointer; box-shadow:0 3px 12px rgba(39,174,96,.28); transition:opacity .16s, transform .12s; display:flex; align-items:center; justify-content:center; gap:6px; }
    .gc-btn-submit:hover:not(:disabled) { opacity:.88; transform:translateY(-1px); }
    .gc-btn-submit:disabled { opacity:.4; cursor:not-allowed; transform:none; }
  `;

  /* ════════════════════════════════════════ STAGE: role (Step 1 of 8) */
  if (profileStage === "role") {
    // Step 1 of 8 → progress = 1/8 = 12.5%
    const progressPct = 12.5;
    return (
      <>
        <style>{sharedStyles}</style>
        <div className="cp-overlay">
          <div className="cp-modal">
            <div className="cp-hdr">
              <div className="cp-hdr-top">
                <div className="cp-logo">
                  <span className="cp-logo-ilm">ILM</span>
                  <span className="cp-logo-ora">ORA</span>
                </div>
                {/* BUG FIX 10: Skip in role stage only works if a role was previously stored */}
                {onSkip && role && (
                  <div className="cp-hdr-right">
                    {/* <button
                      className="ob-skip-link"
                      onClick={async () => {
                        await submitToBackend({});
                      }}
                    >
                      Skip
                    </button> */}
                  </div>
                )}
              </div>
              <div className="cp-orange-line" />
            </div>
            <div className="cp-prog">
              <div
                className="cp-prog-fill"
                style={{ width: `${progressPct}%` }}
              />
            </div>

            <div className="cp-body">
              <div className="cp-title">Choose your role</div>
              <div className="cp-sub">
                We'll personalise your ILM ORA experience based on how you'll
                use the platform.
              </div>
              <div className="cp-roles">
                {ROLES.map((r) => (
                  <div
                    key={r.value}
                    className={`cp-role${role === r.value ? " sel" : ""}`}
                    onClick={() => setRole(r.value)}
                  >
                    <div className="cp-role-ico" style={{ background: r.bg }}>
                      {r.icon}
                    </div>
                    <div className="cp-role-info">
                      <div className="cp-role-name">{r.label}</div>
                      <div className="cp-role-desc">{r.desc}</div>
                    </div>
                    <div
                      className={`cp-radio${role === r.value ? " sel" : ""}`}
                    >
                      {role === r.value && <div className="cp-radio-dot" />}
                    </div>
                  </div>
                ))}
              </div>
              {errors.role && <div className="cp-err-g">{errors.role}</div>}
            </div>

            {/* BUG FIX 9: "Step 1 of 8" now shown in footer */}
            <div className="cp-foot">
              <span className="cp-step-lbl">Step 1 of 8</span>
              <div className="cp-foot-r">
                <button
                  className="cp-btn-next"
                  disabled={!role}
                  onClick={() => {
                    if (!role) {
                      setErrors({ role: "Please select a role" });
                      return;
                    }
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

  /* ════════════════════════════════════════ STAGE: onboarding (Steps 2-7 of 8) */
  if (profileStage === "onboarding") {
    const configs = ONBOARDING_CONFIGS[role] || [];
    const config = configs[onboardingStep] || {};
    const isValid = isOnboardingStepValid();
    // BUG FIX 8: step numbers: quiz steps are 2-7 (onboardingStep 0-5 → display step 2-7)
    const displayStep = onboardingStep + 2;
    const totalSteps = 8;
    const progressPct = Math.round((displayStep / totalSteps) * 100);

    return (
      <>
        <style>{sharedStyles}</style>
        <div className="cp-overlay">
          <div className="ob-modal">
            <div className="cp-hdr">
              <div className="cp-hdr-top">
                <div className="cp-logo">
                  <span className="cp-logo-ilm">ILM</span>
                  <span className="cp-logo-ora">ORA</span>
                </div>
                <div className="cp-hdr-right">
                  {/* <button className="ob-skip-link" onClick={finishOnboarding}>
                    Skip quiz →
                  </button> */}
                </div>
              </div>
              <div className="cp-orange-line" />
            </div>
            <div className="cp-prog">
              <div
                className="cp-prog-fill"
                style={{ width: `${progressPct}%` }}
              />
            </div>

            <div className="cp-body">
              <div className="cp-title">{config.title}</div>
              <div className="cp-sub">{config.subtitle}</div>
              {config.multiSelect && (
                <div className="ob-multi-hint">
                  <svg
                    width="9"
                    height="9"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="9 11 12 14 22 4" />
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                  </svg>
                  Select all that apply
                </div>
              )}
              <div className="ob-options">
                {(config.options || []).map((opt, oi) => {
                  const isSelected = (
                    onboardingAnswers[`step_${onboardingStep}`] || []
                  ).includes(opt.label);
                  return (
                    <div
                      key={oi}
                      className={`ob-opt${isSelected ? " sel" : ""}`}
                      onClick={() => handleOnboardingSelect(opt.label)}
                    >
                      <div className="ob-opt-info">
                        <div className="ob-opt-label">{opt.label}</div>
                        {opt.desc && (
                          <div className="ob-opt-desc">{opt.desc}</div>
                        )}
                      </div>
                      <div className="ob-opt-check">
                        {isSelected && (
                          <svg
                            width="9"
                            height="9"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#fff"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="cp-foot">
              <span className="cp-step-lbl">
                Step {displayStep} of {totalSteps}
              </span>
              <div className="cp-foot-r">
                <button className="cp-btn-back" onClick={handleOnboardingBack}>
                  ← Back
                </button>
                <button
                  className="cp-btn-next"
                  onClick={handleOnboardingContinue}
                  disabled={!isValid}
                >
                  {onboardingStep === configs.length - 1
                    ? "Finish →"
                    : "Continue →"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  /* ════════════════════════════════════════ STAGE: confirm (Step 8 of 8) */
  return (
    <>
      <style>{sharedStyles}</style>
      <div className="cp-overlay">
        <div className="cp-modal">
          <div className="cp-hdr">
            <div className="cp-hdr-top">
              <div className="cp-logo">
                <span className="cp-logo-ilm">ILM</span>
                <span className="cp-logo-ora">ORA</span>
              </div>
            </div>
            <div className="cp-orange-line" />
          </div>
          {/* BUG FIX 7: progress is 100% at step 8 of 8, not hardcoded 87% */}
          <div className="cp-prog">
            <div className="cp-prog-fill" style={{ width: "100%" }} />
          </div>

          <div className="gc-body">
            <div className="gc-check-ring">
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#27ae60"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div className="gc-title">
              Almost <em>done!</em>
            </div>
            <div className="gc-sub">
              Review your details below and submit to continue.
            </div>

            <div className="gc-card">
              {/* Name row */}
              <div className="gc-card-row">
                <div
                  className="gc-card-icon"
                  style={{ background: "rgba(230,126,34,0.10)" }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#e67e22"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div>
                  <div className="gc-card-label">Name</div>
                  <div className="gc-card-value">{resolvedName || "—"}</div>
                </div>
              </div>

              {/* Email row */}
              <div className="gc-card-row">
                <div
                  className="gc-card-icon"
                  style={{ background: "rgba(59,130,246,0.10)" }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div>
                  <div className="gc-card-label">Email</div>
                  <div className="gc-card-value">{resolvedEmail || "—"}</div>
                </div>
              </div>

              {/* Role row */}
              <div className="gc-card-row">
                <div
                  className="gc-card-icon"
                  style={{ background: roleObj?.bg || "rgba(142,68,173,0.10)" }}
                >
                  {roleObj?.icon || (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#8e44ad"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="2" y="7" width="20" height="14" rx="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                  )}
                </div>
                <div>
                  <div className="gc-card-label">Role</div>
                  <div className="gc-card-value">{roleDisplayLabel}</div>
                </div>
              </div>
            </div>

            {isGoogle && (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div className="gc-google-pill">
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  Verified via Google
                </div>
              </div>
            )}
          </div>

          {/* Footer: step 8 of 8 + submit */}
          <div className="gc-foot">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <span
                style={{
                  fontSize: "11px",
                  color: "#bbb",
                  fontWeight: 500,
                  fontFamily: "'Inter',sans-serif",
                }}
              >
                Step 8 of 8
              </span>
              <button
                className="ob-skip-link"
                style={{ fontSize: "11px" }}
                onClick={() => setProfileStage("onboarding")}
              >
                ← Back
              </button>
            </div>
            <button
              className="gc-btn-submit"
              onClick={handleConfirmSubmit}
              disabled={loading}
            >
              {loading ? (
                <>
                  <ISpinner /> Connecting…
                </>
              ) : (
                <>
                  <ICheck s={14} /> Submit &amp; Continue
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
