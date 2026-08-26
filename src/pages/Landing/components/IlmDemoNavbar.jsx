import { GoogleOAuthProvider } from "@react-oauth/google";
import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import auth from "../../auth";
import ProfileDetailsForm from "../common/ProfileDetailsForm";
import { PLAN_SETS } from "../Company/Pricing";
import CompleteProfile from "../common/CompleteProfile";
import IlmDemoSidebar, { SIDEBAR_WIDTHS } from "../../components/IlmDemoSidebar";
import Footer from "../Landing/components/Footer";
import NotificationBell from "../../components/NotificationBell";
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
  Sparkles,
  ChevronDown,
   Code2,
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
/* ─── POPUP 4: Inline Pricing Selector (replaces /pricing route redirect) ── */
function PricingSelectModal({ plans, roleLabel, isAnnual, setIsAnnual, onClose, onChoosePlan }) {
  const fmt = (n) => (n === 0 ? "0" : n.toLocaleString("en-IN"));
  return (
    <div className="ilm-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ilm-modal ilm-modal-pricing">
        <button className="ilm-modal-close" onClick={onClose}><X size={16} /></button>

        <div style={{ textAlign: "center", marginBottom: 18 }}>
          <h2 className="ilm-modal-title" style={{ marginBottom: 4 }}>Choose your plan</h2>
          <p className="ilm-modal-sub" style={{ marginBottom: 14 }}>
            Showing plans for <strong style={{ color: "#F97316" }}>{roleLabel}</strong>
          </p>
          <div className="ilm-billing-toggle">
            <span className={!isAnnual ? "active" : ""} onClick={() => setIsAnnual(false)}>Monthly</span>
            <span className={isAnnual ? "active" : ""} onClick={() => setIsAnnual(true)}>
              Annual <em>Save 30%</em>
            </span>
          </div>
        </div>

        <div className="ilm-pricing-grid">
          {plans.map((plan) => (
            <div key={plan.id} className={`ilm-pricing-card ${plan.popular ? "popular" : ""}`}>
              {plan.popular && <div className="ilm-pricing-badge">⚡ Most Popular</div>}
              <div className="ilm-pricing-name" style={{ color: plan.accentColor }}>{plan.name}</div>
              <div className="ilm-pricing-price">
                <span>₹</span>{fmt(isAnnual ? plan.annualPrice : plan.monthlyPrice)}
              </div>
              <div className="ilm-pricing-period">{plan.period}</div>
              <p className="ilm-pricing-desc">{plan.desc}</p>
              <button
                className="ilm-pricing-cta"
                style={{ background: plan.popular ? "linear-gradient(135deg,#F97316,#ea580c)" : "#1E293B" }}
                onClick={() => onChoosePlan(plan)}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
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
      default: navigate("/ilm-demo", { replace: true });
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

const ICON_COLORS = ["#F97316", "#16a34a", "#6366f1", "#ec4899", "#0ea5e9", "#f59e0b", "#10b981", "#8b5cf6", "#ef4444", "#14b8a6", "#f97316", "#3b82f6"];

/* ─── NAV "Product" dropdown items ───────────────────────────────────────
   Mirrors Navbar.jsx's Product menu: ILM ORA Calendry (renamed from
   "ILM ORA Meet" — same route/functionality) and Workspace only. Resume
   Builder, AI Companion, and Whiteboard moved to the ILM ORA Feature menu.
   Routes match Navbar.jsx's PRODUCT_ROUTES exactly so there are no
   duplicate/diverging routes. */
const NAV_PRODUCT_MENU_ITEMS = [
  {
    key: "meet",
    title: "ILM ORA Calendry",
    description: "Live classes & video sessions",
    icon: Video,
    route: "/ilm-ora-meet",
    color: "#F97316",
  },
  {
    key: "workspace",
    title: "Workspace",
    description: "Your all-in-one collaborative space",
    icon: Layers,
    route: "/workspace",
    color: "#F97316",
  },
 {
  key: "codingLab",
  title: "Coding Lab",
  description: "Practice, Code & Build Real Projects",
  icon: Code2,     // ✅ direct component, koi quotes nahi
  route: "/coding-lab",
  color: "#F97316",
}
];

/* ─── Main Demo Page ─────────────────────────────────────────────────────── */
export default function IlmOraDemoPage() {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showRolePopup, setShowRolePopup] = useState(false);

  // New popup states
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showPricingModal, setShowPricingModal] = useState(false);
  const [isAnnual, setIsAnnual] = useState(false);

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

  const [featureMenuOpen, setFeatureMenuOpen] = useState(false);
  const [productMenuOpen, setProductMenuOpen] = useState(false);
  const featureMenuRef = useRef(null);
  const productMenuRef = useRef(null);
  // Mobile/tablet-width trigger for the Product menu renders in d-nav-right
  // (see CSS: hidden >=768px, shown below) since .d-nav-links itself is
  // hidden below 768px. It shares productMenuOpen/setProductMenuOpen with
  // the desktop trigger; this ref just lets outside-click detection treat
  // both trigger+panel instances as "inside" the menu.
  const productMenuMobileRef = useRef(null);
  useEffect(() => {
    const handler = (e) => { if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false); };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const [googleUserInfo, setGoogleUserInfo] = useState(null);
  
    useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
      if (featureMenuRef.current && !featureMenuRef.current.contains(e.target)) setFeatureMenuOpen(false);
      const insideDesktopProductMenu = productMenuRef.current && productMenuRef.current.contains(e.target);
      const insideMobileProductMenu = productMenuMobileRef.current && productMenuMobileRef.current.contains(e.target);
      if (!insideDesktopProductMenu && !insideMobileProductMenu) setProductMenuOpen(false);
    };
    document.addEventListener("click", handler);
    const saved = sessionStorage.getItem("ilmora_google_user");
    if (saved) { try { setGoogleUserInfo(JSON.parse(saved)); } catch (e) {} }
    return () => document.removeEventListener("click", handler);
  }, []);

  const getSavedUser = () => {
    try { return JSON.parse(localStorage.getItem("lms_user") || "{}"); } catch { return {}; }
  };

  const savedUser = getSavedUser();

const signupUser = (() => {
  try {
    return JSON.parse(localStorage.getItem("lms_user") || "{}");
  } catch {
    return {};
  }
})();

const isLoggedIn = !!localStorage.getItem("lms_token") || !!localStorage.getItem("lms_user");

const userName =
  signupUser?.name ||
  savedUser?.name ||
  signupUser?.email?.split("@")[0] ||
  savedUser?.email?.split("@")[0] ||
  "there";

const userEmail =
  signupUser?.email ||
  savedUser?.email ||
  "";

  const normalizeAppRole = (raw) => {
    const r = (raw || "").toString().trim().toUpperCase();
    if (["TENANT_ADMIN", "ADMIN", "BUSINESS", "MANAGER", "PARTNERSHIP"].includes(r)) return "admin";
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
    addToast({ type: "star", title: "You're all set!", desc: "Use the navigation above to jump into any section." });
  };

  // Navigate to the REAL profile route for this role instead of mounting
  // <ProfilePage /> inline. Mounting it inline made it inherit this page's
  // global styles (the universal box-sizing/margin/padding reset and the
  // DM Sans font-family on .d-page), which is what broke its layout,
  // spacing and width compared to visiting /student/profile directly.
  const goToProfile = (opts = {}) => {
    const { withReturn = false } = opts;
    const path = `/${userRole}/profile`;
    navigate(withReturn ? `${path}?returnTo=/ilm-demo` : path);
  };

  const handleProfileModalComplete = () => {
    setShowProfileModal(false);
    goToProfile({ withReturn: true });
  };

  // const handleViewPlans = () => {
  //   setShowPlanModal(false);
  //   addToast({ type: "info", title: "Choose a Plan", desc: "Please select a subscription plan to continue." });
  //   // Same-tab navigation so plan selection stays part of the ilm-demo flow.
  //   navigate("/pricing?returnTo=/ilm-demo");
  // };
  const handleViewPlans = () => {
    setShowPlanModal(false);
    addToast({ type: "info", title: "Choose a Plan", desc: "Please select a subscription plan to continue." });
    // Stay on the ilm-demo page — show the pricing selector as an
    // in-page modal instead of navigating to /pricing.
    setShowPricingModal(true);
  };

  const handleChoosePlanInline = (plan) => {
    localStorage.setItem("selectedPlan", plan.id);
    setShowPricingModal(false);
    addToast({ type: "star", title: `"${plan.name}" selected!`, desc: "Your plan is ready — let's unlock your dashboard." });
    setShowSuccessModal(true);
  };

  const handleDashGateUpdateProfile = () => {
    setShowProfileModal(false);
    goToProfile({ withReturn: true });
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
  const ctaRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(".d-hero-greeting", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 })
        .fromTo(".d-hero-name", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.55 }, "-=0.25")
        .fromTo(".d-hero-subtitle", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.45 }, "-=0.2")
        .fromTo(".d-hero-title", { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.2")
        .fromTo(".d-hero-typing", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.45 }, "-=0.25")
        .fromTo(".d-hero-btns", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.4 }, "-=0.2");
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
      gsap.fromTo(".d-cta", { opacity: 0, y: 40, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power3.out", scrollTrigger: { trigger: ctaRef.current, start: "top 85%" } });
    }, ctaRef);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        /* ─── SCOPED RESET ───────────────────────────────────────────────
           Previously this was a global star-selector reset (*, *::before,
           *::after), which also forced margin/padding to 0 and box-sizing to
           border-box on <Footer /> (mounted at the bottom of .d-page),
           even though Footer manages its own spacing. That's what made
           the footer look "squished"/broken. Scoping the reset to
           .d-reset-scope (nav → cta, everything except Footer) fixes it
           without touching Footer's internal styling. */
        .d-reset-scope, .d-reset-scope *, .d-reset-scope *::before, .d-reset-scope *::after {
          box-sizing: border-box; margin: 0; padding: 0;
        }

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

        .d-page { font-family:'DM Sans',sans-serif; min-height:100vh; background:var(--d-bg); color:var(--d-text); transition:background .3s,color .3s; }
        @media (max-width: 768px) {
  .d-reset-scope {
    margin-left: 0 !important;
  }
}
        /* NAVBAR */
        .d-nav { position:sticky; top:0; z-index:100; display:flex; align-items:center; justify-content:space-between; padding:0 24px; height:68px; background:#181818; backdrop-filter:blur(20px); border-bottom:1px solid rgba(255,255,255,0.08); box-shadow:0 1px 20px rgba(0,0,0,0.25); transition:background .3s,border-color .3s; }
        @media(min-width:768px){ .d-nav { padding:0 48px; } }
        .d-nav-logo {
          font-family:'Playfair Display',serif;
          font-size:1.9rem;
          font-weight:900;
          letter-spacing:0.01em;
          cursor:pointer;
          display:flex;
          align-items:center;
          gap:10px;
          line-height:1;
        }
        @media(min-width:768px){ .d-nav-logo { font-size:2.1rem; } }
        .d-beta {
          font-family:'DM Sans',sans-serif;
          font-size:0.68rem;
          font-weight:700;
          background:var(--d-orange);
          color:#fff;
          border-radius:6px;
          padding:3px 10px;
          letter-spacing:0.06em;
        }
        .d-nav-links { display:none; align-items:center; gap:4px; }
        @media(min-width:768px){ .d-nav-links { display:flex; } }
        .d-nav-link { font-size:0.82rem; font-weight:600; color:#e5e7eb; background:none; border:none; padding:7px 14px; border-radius:8px; cursor:pointer; font-family:'DM Sans',sans-serif; transition:0.18s; display:flex; align-items:center; }
        .d-nav-link:hover { background:rgba(255,255,255,0.06); color:var(--d-orange); }
        .d-nav-right { display:flex; align-items:center; gap:10px; }

        /* PRODUCT MENU DROPDOWN (desktop nav-link trigger + mobile icon trigger) */
        .d-product-menu-wrap { position:relative; }
        .d-product-menu-wrap-mobile { display:flex; }
        @media(min-width:768px){ .d-product-menu-wrap-mobile { display:none; } }
        .d-product-mobile-trigger { width:40px; height:40px; background:rgba(255,255,255,0.06); border-radius:12px; border:1.5px solid rgba(255,255,255,0.12); cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background .3s,border-color .3s,transform .2s; flex-shrink:0; color:var(--d-orange); }
        .d-product-mobile-trigger:hover { transform:scale(1.06); border-color:var(--d-orange); }
        .d-product-dropdown { position:absolute; top:calc(100% + 10px); left:0; width:min(300px,88vw); background:#232323; border:1px solid rgba(255,255,255,0.08); border-radius:14px; padding:6px; box-shadow:0 16px 48px rgba(0,0,0,0.35); opacity:0; visibility:hidden; transform:translateY(-8px) scale(.98); pointer-events:none; transition:all .2s cubic-bezier(.22,.61,.36,1); z-index:300; }
        .d-product-dropdown.open { opacity:1; visibility:visible; transform:translateY(0) scale(1); pointer-events:all; }
        .d-product-dropdown-mobile { left:auto; right:0; }
        .d-product-dropdown-item { display:flex; align-items:flex-start; gap:10px; width:100%; padding:10px 10px; border-radius:10px; background:none; border:none; cursor:pointer; text-align:left; transition:background .15s; font-family:'DM Sans',sans-serif; }
        .d-product-dropdown-item:hover { background:rgba(249,115,22,0.12); }
        .d-product-dropdown-icon { width:36px; height:36px; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:1px; }
        .d-product-dropdown-item-title { font-size:.83rem; font-weight:700; color:#f1f5f9; }
        .d-product-dropdown-item-desc { font-size:.72rem; color:#94a3b8; margin-top:2px; line-height:1.4; }
        .d-btn-login { font-size:0.8rem; font-weight:600; color:var(--d-text-muted); background:var(--d-card-bg); border:1px solid var(--d-card-border); border-radius:10px; padding:8px 18px; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all 0.18s; box-shadow:0 1px 4px rgba(0,0,0,0.06); }
        .d-btn-login:hover { border-color:var(--d-orange); color:var(--d-orange); }
        .d-btn-signup { font-size:0.8rem; font-weight:700; color:#fff; background:#1E293B; border:none; border-radius:10px; padding:8px 20px; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all 0.18s; display:flex; align-items:center; gap:6px; box-shadow:0 4px 12px rgba(30,41,59,0.25); }
        .d-btn-signup:hover { background:#334155; transform:translateY(-1px); }
        .d-theme-toggle { width:40px; height:40px; background:rgba(255,255,255,0.06); border-radius:12px; border:1.5px solid rgba(255,255,255,0.12); cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background .3s,border-color .3s,transform .2s; flex-shrink:0; color:var(--d-orange); }
        .d-theme-toggle:hover { transform:scale(1.1); box-shadow:0 4px 12px rgba(0,0,0,0.15); }
        .d-theme-toggle svg { display:block; width:20px; height:20px; }

        /* USER MENU */
        .d-user-menu-wrap { position:relative; }
        .d-user-trigger { display:flex; align-items:center; gap:6px; cursor:pointer; padding:4px 8px 4px 4px; border-radius:999px; transition:0.18s; }
        .d-user-trigger:hover { background:rgba(255,255,255,0.06); }
        .d-user-avatar { width:36px; height:36px; border-radius:50%; background:linear-gradient(135deg,#F97316,#ea580c); display:flex; align-items:center; justify-content:center; font-size:0.9rem; font-weight:800; color:#fff; border:2px solid rgba(249,115,22,.3); flex-shrink:0; user-select:none; }
        .d-user-arrow { transition:transform .25s; flex-shrink:0; color:#e5e7eb; }
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
        @media(min-width:900px){ .d-hero { padding:52px 48px 40px; } }
        .d-hero::before { content:''; position:absolute; top:-100px; right:-100px; width:400px; height:400px; background:rgba(249,115,22,0.06); border-radius:50%; pointer-events:none; }
        .d-hero::after  { content:''; position:absolute; bottom:-80px; left:-80px; width:300px; height:300px; background:rgba(34,197,94,0.05); border-radius:50%; pointer-events:none; }
        .d-hero-content { flex:1; text-align:center; max-width:760px; }
        .d-hero-welcome { display:flex; flex-direction:column; align-items:center; gap:3px; margin-bottom:14px; }
        .d-hero-greeting { font-size:0.78rem; font-weight:600; color:var(--d-hero-greeting); display:flex; align-items:center; gap:7px; }
        .d-hero-name { font-family:'Playfair Display',serif; font-size:1.4rem; font-weight:900; color:var(--d-hero-name); }
        .d-hero-name .ora { color:var(--d-orange); }
        .d-hero-subtitle { font-size:0.8rem; color:var(--d-hero-sub); }
        .d-hero-title { font-family:'Playfair Display',serif; font-size:2rem; font-weight:900; line-height:1.1; color:var(--d-hero-title); margin-bottom:10px; }
        @media(min-width:768px){ .d-hero-title { font-size:2.8rem; } }
        .d-hero-title .ora { color:var(--d-orange); }
        .d-hero-title .ilm { color:var(--d-green); }
        .d-hero-typing { min-height:1.6em; margin-bottom:8px; font-size:0.92rem; color:var(--d-hero-sub); display:flex; align-items:center; justify-content:center; gap:6px; }
        .d-typewriter { color:var(--d-orange); font-weight:700; font-size:0.96rem; }
        .d-hero-btns { display:flex; gap:12px; justify-content:center; flex-wrap:wrap; }

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

        /* CTA */
        .d-cta { background:#1E293B; border-radius:24px; padding:56px 32px; text-align:center; margin:0 24px 64px; position:relative; overflow:hidden; }
        @media(min-width:768px){ .d-cta { margin:0 48px 80px; } }
        .d-cta::before { content:''; position:absolute; top:0; left:0; right:0; height:4px; background:linear-gradient(90deg,var(--d-orange),var(--d-green)); }
        .d-cta-title { font-family:'Playfair Display',serif; font-size:2.2rem; font-weight:900; color:#fff; margin-bottom:12px; }
        .d-cta-sub { color:rgba(255,255,255,0.55); font-size:0.95rem; margin-bottom:32px; }
        .d-cta-btns { display:flex; gap:12px; justify-content:center; flex-wrap:wrap; }
        .d-cta-primary { background:var(--d-orange); color:#fff; border:none; border-radius:12px; padding:14px 32px; font-size:0.9rem; font-weight:700; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all 0.18s; box-shadow:0 4px 16px rgba(249,115,22,0.4); }
        .d-cta-primary:hover { background:#ea6c0a; transform:translateY(-2px); }

        /* ═══ NEW TOAST SYSTEM ═══ */
        .toast-container { position:fixed; bottom:28px; right:24px; z-index:2000; display:flex; flex-direction:column; gap:10px; pointer-events:none; box-sizing:border-box; }
        .toast-item { display:flex; align-items:flex-start; gap:12px; background:#fff; border-radius:14px; padding:14px 14px 14px 16px; min-width:260px; max-width:340px; box-shadow:0 8px 32px rgba(0,0,0,0.14),0 2px 8px rgba(0,0,0,0.06); border-left:4px solid #e2e8f0; pointer-events:all; position:relative; transition:all 0.3s cubic-bezier(.22,.61,.36,1); box-sizing:border-box; margin:0; }
        .toast-enter { animation:toastIn 0.35s cubic-bezier(.22,.61,.36,1) forwards; }
        .toast-exit { animation:toastOut 0.3s ease forwards; }
        @keyframes toastIn { from{opacity:0;transform:translateX(40px) scale(0.95)} to{opacity:1;transform:translateX(0) scale(1)} }
        @keyframes toastOut { from{opacity:1;transform:translateX(0) scale(1)} to{opacity:0;transform:translateX(40px) scale(0.95)} }
        .toast-success { border-left-color:#16a34a; }
        .toast-warning { border-left-color:#F97316; }
        .toast-info { border-left-color:#3b82f6; }
        .toast-error { border-left-color:#ef4444; }
        .toast-star { border-left-color:#8b5cf6; }
        .toast-icon-wrap { width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:1px; box-sizing:border-box; }
        .toast-success .toast-icon-wrap { background:rgba(22,163,74,0.1); color:#16a34a; }
        .toast-warning .toast-icon-wrap { background:rgba(249,115,22,0.1); color:#F97316; }
        .toast-info .toast-icon-wrap { background:rgba(59,130,246,0.1); color:#3b82f6; }
        .toast-error .toast-icon-wrap { background:rgba(239,68,68,0.1); color:#ef4444; }
        .toast-star .toast-icon-wrap { background:rgba(139,92,246,0.1); color:#8b5cf6; }
        .toast-body { flex:1; min-width:0; box-sizing:border-box; }
        .toast-title { font-size:0.82rem; font-weight:700; color:#1E293B; line-height:1.3; margin:0; }
        .toast-desc { font-size:0.74rem; color:#64748b; margin-top:3px; line-height:1.4; }
        .toast-close { background:none; border:none; cursor:pointer; color:#94a3b8; display:flex; align-items:center; justify-content:center; width:20px; height:20px; border-radius:50%; flex-shrink:0; margin-left:4px; transition:color 0.15s,background 0.15s; padding:0; box-sizing:border-box; }
        .toast-close:hover { background:#f1f5f9; color:#475569; }

        /* ═══ NEW POPUP MODALS ═══ */
        .ilm-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.55); z-index:1000; display:flex; align-items:center; justify-content:center; padding:20px; backdrop-filter:blur(6px); animation:ilmFade 0.2s ease; box-sizing:border-box; }
        @keyframes ilmFade { from{opacity:0} to{opacity:1} }
        .ilm-modal { background:#fff; border-radius:24px; padding:36px 32px 28px; width:100%; max-width:380px; position:relative; box-shadow:0 32px 80px rgba(0,0,0,0.18); animation:ilmUp 0.3s cubic-bezier(.22,.61,.36,1); text-align:center; box-sizing:border-box; margin:0; }
        @keyframes ilmUp { from{opacity:0;transform:translateY(20px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        .ilm-modal-close { position:absolute; top:14px; right:14px; background:none; border:none; cursor:pointer; color:#94a3b8; width:30px; height:30px; display:flex; align-items:center; justify-content:center; border-radius:50%; transition:all 0.18s; box-sizing:border-box; padding:0; margin:0; }
        .ilm-modal-close:hover { background:#f1f5f9; color:#1E293B; }
        .ilm-modal-icon-wrap { width:60px; height:60px; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 16px; box-sizing:border-box; }
        .ilm-modal-title { font-family:'Playfair Display',serif; font-size:1.2rem; font-weight:900; color:#1e0e02; margin-bottom:8px; line-height:1.3; margin-top:0; }
        .ilm-modal-sub { font-size:0.82rem; color:#8a6040; line-height:1.65; margin-bottom:20px; margin-top:0; }
        .ilm-check-list { list-style:none; text-align:left; display:flex; flex-direction:column; gap:10px; margin-bottom:24px; padding:0 4px; margin-top:0; }
        .ilm-check-list li { display:flex; align-items:center; gap:10px; font-size:0.82rem; color:#475569; font-weight:500; margin:0; }
        .ilm-btn-primary { width:100%; padding:13px; background:linear-gradient(135deg,#F97316,#ea580c); color:#fff; border:none; border-radius:12px; font-size:0.9rem; font-weight:700; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all 0.18s; box-shadow:0 4px 16px rgba(249,115,22,0.35); margin-bottom:10px; display:block; box-sizing:border-box; }
        .ilm-btn-primary:hover { opacity:0.92; transform:translateY(-1px); }
        .ilm-btn-green { width:100%; padding:13px; background:linear-gradient(135deg,#16a34a,#15803d); color:#fff; border:none; border-radius:12px; font-size:0.9rem; font-weight:700; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all 0.18s; box-shadow:0 4px 16px rgba(22,163,74,0.35); margin-top:4px; display:block; box-sizing:border-box; }
        .ilm-btn-green:hover { opacity:0.92; transform:translateY(-1px); }
        .ilm-btn-ghost { width:100%; background:none; border:none; color:#94a3b8; font-family:'DM Sans',sans-serif; font-size:0.82rem; font-weight:600; cursor:pointer; padding:8px; transition:color 0.18s; display:block; box-sizing:border-box; margin:0; }
        .ilm-btn-ghost:hover { color:#475569; }
        .ilm-success-badge { display:inline-flex; align-items:center; gap:8px; background:rgba(22,163,74,0.1); border:1px solid rgba(22,163,74,0.25); border-radius:999px; padding:8px 18px; font-size:0.82rem; font-weight:700; color:#16a34a; margin:0 auto 20px; box-sizing:border-box; }

        /* LOGIN MODAL */
        .lm-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.55); z-index:1000; display:flex; align-items:center; justify-content:center; padding:20px; backdrop-filter:blur(4px); animation:lmFade 0.2s ease; box-sizing:border-box; }
        @keyframes lmFade { from{opacity:0} to{opacity:1} }
        .lm-box { background:#fff; border-radius:20px; padding:32px 28px; width:100%; max-width:420px; position:relative; box-shadow:0 24px 64px rgba(0,0,0,0.2); animation:lmUp 0.3s ease; box-sizing:border-box; margin:0; }
        @keyframes lmUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .lm-close { position:absolute; top:16px; right:16px; background:none; border:none; font-size:1rem; cursor:pointer; color:#94a3b8; width:28px; height:28px; display:flex; align-items:center; justify-content:center; border-radius:50%; transition:all 0.18s; box-sizing:border-box; padding:0; margin:0; }
        .lm-close:hover { background:#f1f5f9; color:#1E293B; }
        .lm-logo { font-family:'Playfair Display',serif; font-size:2rem; font-weight:900; text-align:center; margin-bottom:8px; cursor:pointer; }
        .lm-heading { text-align:center; margin-bottom:20px; }
        .lm-heading h2 { font-size:1.2rem; font-weight:700; color:#1e0e02; margin-bottom:6px; margin-top:0; }
        .lm-heading p { font-size:0.84rem; color:#8a6040; margin:0; }
        .lm-heading p button { background:none; border:none; cursor:pointer; color:#F97316; font-family:'DM Sans',sans-serif; font-size:0.84rem; font-weight:700; padding:0; margin:0; }
        .lm-heading p button:hover { text-decoration:underline; }
        .lm-google-wrap { width:100%; margin-bottom:14px; display:flex; justify-content:center; box-sizing:border-box; }
        .lm-or { display:flex; align-items:center; gap:12px; margin-bottom:14px; }
        .lm-or-line { flex:1; height:1px; background:rgba(180,100,30,0.15); }
        .lm-or-text { font-size:0.7rem; color:#b8906a; letter-spacing:0.1em; text-transform:uppercase; }
        .lm-field { margin-bottom:12px; }
        .lm-field label { display:block; font-size:0.72rem; font-weight:700; color:#8a6040; margin-bottom:5px; letter-spacing:0.06em; text-transform:uppercase; margin-top:0; }
        .lm-field input { width:100%; padding:11px 14px; background:rgba(255,255,255,0.8); border:1.5px solid rgba(180,120,60,0.2); border-radius:10px; color:#1a0e06; font-family:'DM Sans',sans-serif; font-size:0.875rem; outline:none; transition:border-color 0.2s,box-shadow 0.2s; box-sizing:border-box; margin:0; }
        .lm-field input::placeholder { color:#c0a070; }
        .lm-field input:focus { border-color:#F97316; box-shadow:0 0 0 3px rgba(249,115,22,0.1); background:#fff; }
        .lm-pw-wrap { position:relative; }
        .lm-pw-wrap input { padding-right:44px; }
        .lm-eye { position:absolute; right:12px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; color:#b8906a; display:flex; align-items:center; padding:0; transition:color 0.2s; margin:0; box-sizing:border-box; }
        .lm-eye:hover { color:#F97316; }
        .lm-forgot { text-align:right; margin:6px 0 14px; }
        .lm-forgot button { background:none; border:none; cursor:pointer; color:#F97316; font-family:'DM Sans',sans-serif; font-size:0.78rem; font-weight:500; padding:0; margin:0; box-sizing:border-box; }
        .lm-forgot button:hover { text-decoration:underline; }
        .lm-submit { width:100%; padding:13px; background:linear-gradient(135deg,#F97316,#ea580c); color:#fff; font-family:'DM Sans',sans-serif; font-weight:700; font-size:0.95rem; border:none; border-radius:10px; cursor:pointer; transition:opacity 0.2s,transform 0.15s; box-shadow:0 4px 18px rgba(249,115,22,0.32); display:flex; align-items:center; justify-content:center; gap:8px; box-sizing:border-box; margin:0; }
        .lm-submit:hover:not(:disabled) { opacity:0.9; transform:translateY(-1px); }
        .lm-submit:disabled { opacity:0.5; cursor:not-allowed; }
        .lm-spinner { width:13px; height:13px; border:2px solid rgba(255,255,255,0.3); border-top-color:#fff; border-radius:50%; animation:spin 0.7s linear infinite; }
        @keyframes spin { to{transform:rotate(360deg)} }
        .lm-back-home { text-align:center; margin-top:14px; }
        .lm-back-home button { background:none; border:none; cursor:pointer; color:#94a3b8; font-family:'DM Sans',sans-serif; font-size:0.78rem; padding:0; margin:0; box-sizing:border-box; }
       .lm-back-home button:hover { color:#475569; }

        /* ═══ INLINE PRICING MODAL ═══ */
        .ilm-modal-pricing { max-width: 920px; text-align: left; padding: 32px 28px 28px; }
        .ilm-billing-toggle { display:inline-flex; align-items:center; gap:4px; background:#f1f5f9; border:1.5px solid #e2e8f0; border-radius:100px; padding:5px; margin-top:6px; box-sizing:border-box; }
        .ilm-billing-toggle span { font-size:0.78rem; font-weight:700; padding:7px 16px; border-radius:100px; cursor:pointer; color:#64748b; transition:all .2s; display:flex; align-items:center; gap:6px; box-sizing:border-box; margin:0; }
        .ilm-billing-toggle span.active { background:#1E293B; color:#fff; }
        .ilm-billing-toggle span em { font-style:normal; background:#dcfce7; color:#16a34a; font-size:0.62rem; font-weight:800; padding:2px 7px; border-radius:100px; margin:0; }
        .ilm-pricing-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
        @media(max-width:768px){ .ilm-pricing-grid { grid-template-columns:1fr; } }
        .ilm-pricing-card { position:relative; background:#fff; border:1.5px solid #e2e8f0; border-radius:16px; padding:22px 20px; display:flex; flex-direction:column; transition:all .2s; box-sizing:border-box; margin:0; }
        .ilm-pricing-card:hover { border-color:rgba(249,115,22,0.4); box-shadow:0 8px 24px rgba(0,0,0,0.08); transform:translateY(-2px); }
        .ilm-pricing-card.popular { border-color:#F97316; box-shadow:0 4px 20px rgba(249,115,22,0.12); }
        .ilm-pricing-badge { position:absolute; top:-12px; left:50%; transform:translateX(-50%); background:#F97316; color:#fff; font-size:0.65rem; font-weight:800; padding:4px 14px; border-radius:100px; white-space:nowrap; margin:0; box-sizing:border-box; }
        .ilm-pricing-name { font-size:0.7rem; font-weight:800; letter-spacing:0.1em; text-transform:uppercase; margin-bottom:10px; margin-top:0; }
        .ilm-pricing-price { font-size:1.9rem; font-weight:900; color:#1E293B; font-family:'Playfair Display',serif; margin:0; }
        .ilm-pricing-price span { font-size:1rem; font-weight:700; margin-right:2px; }
        .ilm-pricing-period { font-size:0.72rem; color:#94a3b8; margin-bottom:10px; margin-top:0; }
        .ilm-pricing-desc { font-size:0.78rem; color:#64748b; line-height:1.5; margin-bottom:16px; min-height:40px; margin-top:0; }
        .ilm-pricing-cta { margin-top:auto; width:100%; padding:11px; border:none; border-radius:10px; color:#fff; font-size:0.82rem; font-weight:700; cursor:pointer; font-family:'DM Sans',sans-serif; transition:opacity .18s, transform .12s; box-sizing:border-box; }
        .ilm-pricing-cta:hover { opacity:0.9; transform:translateY(-1px); }
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
            onGoToDashboard={() => setShowSuccessModal(false)}
          />
        )}

        {showPricingModal && (
          <PricingSelectModal
            plans={PLAN_SETS[featureRoleKey]?.plans || PLAN_SETS.student.plans}
            roleLabel={PLAN_SETS[featureRoleKey]?.label || "Student"}
            isAnnual={isAnnual}
            setIsAnnual={setIsAnnual}
            onClose={() => setShowPricingModal(false)}
            onChoosePlan={handleChoosePlanInline}
          />
        )}

        {/*
          NOTE: The Profile screen is intentionally NOT rendered here.
          It used to be mounted inline as an overlay <div><ProfilePage/></div>
          directly inside this component's tree. Because it lived inside
          .d-page, it inherited this page's global <style> rules — most
          importantly the unscoped `*, *::before, *::after { box-sizing:
          border-box; margin:0; padding:0; }` reset and the DM Sans
          font-family on .d-page — which subtly broke ProfilePage's
          spacing/width/typography versus visiting /student/profile directly.

          Fix: navigate to the real route instead (see goToProfile()).
          Every button that used to call setShowProfileForm(true) now
          calls goToProfile(...) / navigate(`/${userRole}/profile`).
        */}

        {/* ═══ NAVBAR ═══
            Rendered full-width, OUTSIDE the sidebar-margin wrapper below —
            so it always spans edge-to-edge like the reference image,
            instead of starting after the sidebar. Uses "d-nav d-reset-scope"
            so its own box-sizing/margin/padding reset still applies without
            inheriting the sidebar's marginLeft. */}
        <nav className="d-nav d-reset-scope">
            <div className="d-nav-logo" onClick={() => navigate("/")}>
              <span style={{ color: "#16a34a" }}>ILM</span>&nbsp;<span style={{ color: "#F97316" }}>ORA</span>
              <span className="d-beta">BETA</span>
            </div>

            <div className="d-nav-links">
              <button className="d-nav-link" onClick={() => navigate("/all-courses")}>
                All Courses
              </button>
              <button className="d-nav-link" onClick={() => scrollToId("features")}>
                ILM ORA Feature
                <ChevronRight size={13} style={{ transform: "rotate(90deg)", marginLeft: 4 }} />
              </button>
              <div className="d-product-menu-wrap" ref={productMenuRef}>
                <button
                  type="button"
                  className="d-nav-link"
                  aria-haspopup="true"
                  aria-expanded={productMenuOpen}
                  onClick={() => setProductMenuOpen((o) => !o)}
                >
                  Product
                  <ChevronDown size={13} style={{ marginLeft: 4, transition: "transform .2s", transform: productMenuOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
                </button>
                <div className={`d-product-dropdown ${productMenuOpen ? "open" : ""}`} role="menu">
                  {NAV_PRODUCT_MENU_ITEMS.map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      role="menuitem"
                      className="d-product-dropdown-item"
                      onClick={() => { setProductMenuOpen(false); navigate(item.route); }}
                    >
                      <div className="d-product-dropdown-icon" style={{ background: `${item.color}1f`, color: item.color }}>
                        <item.icon size={18} strokeWidth={1.8} />
                      </div>
                      <div>
                        <div className="d-product-dropdown-item-title">{item.title}</div>
                        <div className="d-product-dropdown-item-desc">{item.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <button className="d-nav-link" onClick={() => navigate("/mentors")}>
                Mentors
              </button>
              <button className="d-nav-link" onClick={() => scrollToId("successstories")}>
                Success Stories
              </button>
            </div>
            
           <div className="d-nav-right">

  {/* Notification Bell */}
  {isLoggedIn && (
    <NotificationBell roleOverride={featureRoleKey} />
  )}

  {/* Product menu — compact trigger for iPad Mini/tablet/iPhone/Pixel/
      small mobile widths (<768px), where .d-nav-links is hidden. Shares
      productMenuOpen state with the desktop trigger above so only one
      menu instance is ever open at a time. */}
  <div className="d-product-menu-wrap d-product-menu-wrap-mobile" ref={productMenuMobileRef}>
    <button
      type="button"
      className="d-product-mobile-trigger"
      aria-label="Product menu"
      aria-haspopup="true"
      aria-expanded={productMenuOpen}
      onClick={() => setProductMenuOpen((o) => !o)}
    >
      <Sparkles size={18} />
    </button>
    <div className={`d-product-dropdown d-product-dropdown-mobile ${productMenuOpen ? "open" : ""}`} role="menu">
      {NAV_PRODUCT_MENU_ITEMS.map((item) => (
        <button
          key={item.key}
          type="button"
          role="menuitem"
          className="d-product-dropdown-item"
          onClick={() => { setProductMenuOpen(false); navigate(item.route); }}
        >
          <div className="d-product-dropdown-icon" style={{ background: `${item.color}1f`, color: item.color }}>
            <item.icon size={18} strokeWidth={1.8} />
          </div>
          <div>
            <div className="d-product-dropdown-item-title">{item.title}</div>
            <div className="d-product-dropdown-item-desc">{item.description}</div>
          </div>
        </button>
      ))}
    </div>
  </div>

  {/* Theme Toggle */}
  <button
    className="d-theme-toggle"
    onClick={toggleTheme}
    aria-label="Toggle theme"
  >
    {isDark ? <Sun size={18} /> : <Moon size={18} />}
  </button>

  {isLoggedIn ? (
                <div className="d-user-menu-wrap" ref={userMenuRef}>
                  <div className="d-user-trigger" onClick={() => setUserMenuOpen((o) => !o)}>
                    <div className="d-user-avatar">{userInitial}</div>
                    <ChevronRight
                      size={14}
                      className="d-user-arrow"
                      style={{ transform: userMenuOpen ? "rotate(-90deg)" : "rotate(90deg)" }}
                    />
                  </div>
                  <div className={`d-user-dropdown ${userMenuOpen ? "open" : ""}`}>
                    <div className="d-user-dropdown-header">
                      <div className="d-user-dropdown-name">{userName}</div>
                      <div className="d-user-dropdown-email">{userEmail}</div>
                    </div>
                    <div className="d-user-dropdown-divider" />
                    <button
                      className="d-user-dropdown-item"
                      onClick={() => { setUserMenuOpen(false); handleGoToDashboard(); }}
                    >
                      <DashboardIcon size={16} /> Dashboard
                    </button>
                    <button
                      className="d-user-dropdown-item"
                      onClick={() => { setUserMenuOpen(false); goToProfile({ withReturn: true }); }}
                    >
                      <User size={16} /> My Profile
                    </button>
                    <button
                      className="d-user-dropdown-item upgrade"
                      onClick={() => { setUserMenuOpen(false); handleViewPlans(); }}
                    >
                      <Crown size={16} /> Upgrade Plan
                    </button>
                    <div className="d-user-dropdown-divider" />
                    <button className="d-user-dropdown-item signout" onClick={handleSignOut}>
                      <X size={16} /> Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <button className="d-btn-login" onClick={() => setShowLogin(true)}>Log In</button>
                  <button className="d-btn-signup" onClick={() => navigate("/complete-profile")}>Sign Up</button>
                </>
              )}
            </div>
        </nav>

        {/* ═════════ ILM Demo Sidebar ═════════
            Rendered directly (no transform wrapper) so its own
            `position: fixed` stays relative to the real viewport —
            that's what keeps it pinned in place and full-height while
            scrolling. (A transform-based wrapper was tried here to tuck
            it below the navbar, but that turns "fixed" into effectively
            "absolute", so the sidebar scrolled away with the page and
            got cut off — which is the bug you just saw.)
            The navbar's z-index (100) is higher than the sidebar's, so
            the opaque navbar simply paints over the sidebar's top strip —
            same visual result as the reference image, without breaking
            the sidebar's scroll behavior. */}
        {isLoggedIn && (
          <IlmDemoSidebar roleOverride={featureRoleKey} />
        )}

        {/* ═══════════════════════════════════════════════════════════════
            d-reset-scope: wraps hero → cta (everything except Footer and
            the nav, which is handled above). Keeps the sidebar-margin push
            for the main content area exactly as before.
        ═══════════════════════════════════════════════════════════════ */}
        <div className="d-reset-scope" style={isLoggedIn ? { marginLeft: SIDEBAR_WIDTHS.full } : undefined}>

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

          {/* ═══ CTA ═══ */}
          <div ref={ctaRef}>
            <div className="d-cta">
              <div className="d-cta-title">Ready to Transform Your Career?</div>
              <p className="d-cta-sub">Be among the first to learn with ILM ORA — join our growing community</p>
              <div className="d-cta-btns" />
            </div>
          </div>

        </div>
        {/* ═══ /d-reset-scope ═══ */}
       
             
        {/* ═══ FOOTER ═══ */}
{/* Rendered OUTSIDE .d-reset-scope on purpose (see note above),
    so it uses its own natural spacing instead of having every
    margin/padding zeroed by this page's reset. */}

<div
  style={
    isLoggedIn
      ? { marginLeft: SIDEBAR_WIDTHS.full }
      : undefined
  }
>
  <Footer scrollToSection={(id) => scrollToId(id)} />
</div>

        {/* ═══ MULTI-TOAST ═══ */}
        <ToastContainer toasts={toasts} />
      </div>
    </>
  );
}


































