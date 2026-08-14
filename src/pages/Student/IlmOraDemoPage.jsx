import { GoogleOAuthProvider } from "@react-oauth/google";
import { useEffect, useState, useRef, useCallback, useMemo, Suspense } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import auth from "../../auth";
import ChatWidgetButton from "../../Student/ChatWidgetButton";
import IlmDemoSidebar, {
  SIDEBAR_WIDTHS,
  SECTION_INDEX,
  ROLE_HOME_PATH,
} from "../../components/IlmDemoSidebar";
import Footer from "../Landing/components/Footer";
import { HUB_MENU_ITEMS, PRODUCT_MENU_ITEMS } from "../Landing/components/navMenuData";
import IlmDemoProfilePage from "../IlmDemoProfilePage";
import NotificationBell from "../../components/NotificationBell";
// ILM ORA Feature dropdown pages — Student, Trainer and Manager Hub.
// These are standalone public pages opened from the top navbar dropdown.
// The selected hub opens its actual route instead of rendering inside /ilm-demo.
import StudentHub from "../Landing/StudentHub";
import TrainerHub from "../Landing/TrainerHub";
import ManagerHub from "../Landing/ManagerHub";
// All Courses uses the same real production page available at /all-courses.
// The navbar opens the actual All Courses route instead of rendering it
// inside the /ilm-demo shell.
import AllCoursesPage from "../Landing/AllCourses";
// ═══ REAL PRODUCTION CONTENT ═══
// getRoleHomeComponent()/getSectionComponent() resolve the same
// production components used by the main application.
// Sidebar sections continue to render within the /ilm-demo shell.
import {
  getRoleHomeComponent,
  getSectionComponent,
} from "./ilmDemoContentRegistry";
// NOTE: this page used to install a global axios write-guard
// (../../demo/ilmDemoWriteGuard.js) that blocked POST/PUT/PATCH/DELETE
// while /ilm-demo was mounted, with a "This is a Live Demo" modal shown
// on every blocked click. That two-tier demo/production split has been
// removed — /ilm-demo is now the single real dashboard, reached only
// after a user has actually authenticated (onboarding or email/password
// login/registration), so every write goes straight through to the real
// backend exactly like it does anywhere else in the app.
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
  Menu,
  LogOut,
  Lock,
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
  ChevronRight,
  X,
  Check,
  Info,
  Star,
  ArrowRight,
  GraduationCap,
  BarChart3,
  ChevronDown,
  Trophy,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// Icon name (string, from shared navMenuData.js) → actual lucide-react
// component already imported above. Navigation handlers
// (goToHub / goToProductSection) stay in this file, NOT in the shared
// data file — only the item content (title/description/icon) is shared.
const NAV_ICON_MAP = { GraduationCap, Users, BarChart3, FileText, LayoutDashboard };
const HUB_ICON_COLORS = { student: "#16a34a", trainer: "#3b82f6", admin: "#a855f7" };
const PRODUCT_ICON_COLORS = { meet: "#F97316", resume: "#16a34a", workspace: "#F97316" };

const GOOGLE_CLIENT_ID =
  "572421778240-akk3kkb4f60ukuv9pcfrpg2ielm09thk.apps.googleusercontent.com";

// "ILM ORA Feature" dropdown → Student/Trainer/Manager Hub. Keyed by the
// same hubKey goToHub() receives ("student" | "trainer" | "admin").
const HUB_COMPONENTS = {
  student: StudentHub,
  trainer: TrainerHub,
  admin: ManagerHub,
};

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
  }, [
    phase,
    charPos,
    index,
    texts,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
    getSpeed,
  ]);

  return (
    <span className={className} aria-live="polite">
      {displayed}
      {showCursor && (
        <span
          style={{ opacity: cursorVisible ? 1 : 0, transition: "opacity 0.1s" }}
          aria-hidden="true"
        >
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
        <div
          key={t.id}
          className={`toast-item toast-${t.type} ${t.exiting ? "toast-exit" : "toast-enter"}`}
        >
          <div className="toast-icon-wrap">
            {t.type === "success" && <Check size={14} strokeWidth={2.5} />}
            {t.type === "warning" && (
              <AlertCircle size={14} strokeWidth={2.5} />
            )}
            {t.type === "info" && <Info size={14} strokeWidth={2.5} />}
            {t.type === "error" && <X size={14} strokeWidth={2.5} />}
            {t.type === "star" && <Star size={14} strokeWidth={2.5} />}
          </div>
          <div className="toast-body">
            <div className="toast-title">{t.title}</div>
            {t.desc && <div className="toast-desc">{t.desc}</div>}
            {t.action && (
              <button
                className="toast-action-btn"
                onClick={() => {
                  t.action.onClick();
                  t.onClose();
                }}
              >
                {t.action.label} <ArrowRight size={12} />
              </button>
            )}
          </div>
          <button className="toast-close" onClick={t.onClose}>
            <X size={12} />
          </button>
        </div>
      ))}
    </div>
  );
}

/* ─── Fallback while a real page is being fetched/rendered ───────────── */
function IlmDemoContentLoading() {
  return (
    <div
      style={{
        padding: "60px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#94a3b8",
        gap: 10,
      }}
    >
      <span
        style={{
          width: 16,
          height: 16,
          borderRadius: "50%",
          border: "2px solid #e2e8f0",
          borderTopColor: "#F97316",
          animation: "ilmSpin 0.7s linear infinite",
        }}
      />
      Loading…
      <style>{`@keyframes ilmSpin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ─── SECTION CONTENT (fallback ONLY, e.g. a section not yet migrated) ───
   Every real sidebar item now renders its actual production page (see
   ilmDemoContentRegistry.js). This card only ever shows if a path in
   SECTION_INDEX has no registered real component behind it yet — it is
   NOT the normal path for any live sidebar item. */
function IlmDemoSectionContent({ section, onBack }) {
  const meta = SECTION_INDEX[section] || {
    name: "Overview",
    icon: DashboardIcon,
  };
  const Icon = meta.icon || DashboardIcon;
  return (
    <div style={{ padding: "28px 32px 60px", maxWidth: 1100, margin: "0 auto" }}>
      <button
        onClick={onBack}
        style={{
          padding: "8px 16px",
          borderRadius: 10,
          border: "1px solid #e2e8f0",
          background: "#fff",
          cursor: "pointer",
          fontWeight: 600,
          fontSize: "0.85rem",
          color: "#334155",
        }}
      >
        ← Back to Dashboard
      </button>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          margin: "24px 0 8px",
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: "#fff7ed",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#F97316",
            flexShrink: 0,
          }}
        >
          <Icon size={22} />
        </div>
        <div>
          <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#1e293b" }}>
            {meta.name}
          </div>
          {meta.parent && (
            <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
              {meta.parent}
            </div>
          )}
        </div>
      </div>

      <p style={{ color: "#64748b", maxWidth: 560, marginBottom: 28 }}>
        {meta.name} isn't wired into the live demo yet. Every other sidebar
        item shows the real ILM ORA production page — this one's still on
        the list.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
        }}
      >
        {["No data yet", "No data yet", "No data yet"].map((label, i) => (
          <div
            key={i}
            style={{
              background: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: 14,
              padding: 24,
              textAlign: "center",
              color: "#94a3b8",
            }}
          >
            <Icon size={20} style={{ marginBottom: 8, opacity: 0.5 }} />
            <div>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── POPUP 1: Profile Incomplete ───────────────────────────────────────── */
function ProfileIncompleteModal({ onClose, onCompleteProfile }) {
  return (
    <div
      className="ilm-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="ilm-modal">
        <button className="ilm-modal-close" onClick={onClose}>
          <X size={16} />
        </button>
        <div
          className="ilm-modal-icon-wrap"
          style={{ background: "rgba(249,115,22,0.1)" }}
        >
          <User size={28} color="#F97316" strokeWidth={1.8} />
        </div>
        <h2 className="ilm-modal-title">Complete Your Profile First</h2>
        <p className="ilm-modal-sub">
          To unlock your personalized dashboard, please complete your profile
          information.
        </p>
        <ul className="ilm-check-list">
          <li>
            <CheckCircle size={16} color="#F97316" />
            <span>Personalized Learning Path</span>
          </li>
          <li>
            <CheckCircle size={16} color="#F97316" />
            <span>Recommended Courses</span>
          </li>
          <li>
            <CheckCircle size={16} color="#F97316" />
            <span>Progress Tracking</span>
          </li>
        </ul>
        <button className="ilm-btn-primary" onClick={onCompleteProfile}>
          Complete Profile
        </button>
        <button className="ilm-btn-ghost" onClick={onClose}>
          Do This Later
        </button>
      </div>
    </div>
  );
}

/* ─── POPUP 2: Success / Congratulations (Step 9 in new flow) ───────────── */
function SuccessModal({ onClose, onGoToDashboard }) {
  return (
    <div
      className="ilm-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="ilm-modal">
        <button className="ilm-modal-close" onClick={onClose}>
          <X size={16} />
        </button>
        <div
          className="ilm-modal-icon-wrap"
          style={{ background: "rgba(22,163,74,0.12)" }}
        >
          <div style={{ position: "relative" }}>
            <CheckCircle size={32} color="#16a34a" strokeWidth={2} />
            {/* sparkle dots */}
            <span
              style={{
                position: "absolute",
                top: -6,
                right: -10,
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#F97316",
              }}
            />
            <span
              style={{
                position: "absolute",
                top: 0,
                left: -10,
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "#16a34a",
              }}
            />
            <span
              style={{
                position: "absolute",
                bottom: -6,
                right: -6,
                width: 4,
                height: 4,
                borderRadius: "50%",
                background: "#F97316",
              }}
            />
          </div>
        </div>
        <h2 className="ilm-modal-title">Congratulations!</h2>
        <p className="ilm-modal-sub">
          Your account setup is complete. You can now access your personalized
          dashboard freely.
        </p>
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
/* ─── LOGIN MODAL ────────────────────────────────────────────────────────── */
function LoginModal({ onClose, onGoogleSuccess, onAuthenticated }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const redirectByRole = (role) => {
    onClose();
    const r = (role || "").toUpperCase();
    switch (r) {
      case "SUPER_ADMIN":
        navigate("/superadmin", { replace: true });
        break;
      default:
        navigate("/ilm-demo", { replace: true });
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
        localStorage.setItem(
          "lms_user",
          JSON.stringify({
            email,
            role: ["TENANT_ADMIN", "ADMIN", "BUSINESS"].includes(role)
              ? "admin"
              : role.toLowerCase(),
            profileCompleted: false,
            isGoogleUser: false,
          }),
        );
        onAuthenticated && onAuthenticated(); // ✅ real token exists now
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
        if (check.organizationId)
          localStorage.setItem("organizationId", check.organizationId);
        else localStorage.removeItem("organizationId");
        localStorage.setItem(
          "lms_user",
          JSON.stringify({
            name: check.name || dec.name,
            email: check.email || dec.email,
            role: ["TENANT_ADMIN", "ADMIN", "BUSINESS"].includes(role)
              ? "admin"
              : role.toLowerCase(),
            isGoogleUser: true,
            profileCompleted: !!check.profileCompleted,
            organizationId: check.organizationId || null,
          }),
        );
        onAuthenticated && onAuthenticated(); // ✅ real token exists now
        onClose();
        redirectByRole(role);
        return;
      }
      localStorage.removeItem("lms_token");
      localStorage.removeItem("lms_user");
      localStorage.removeItem("role");
      sessionStorage.setItem("ilmora_google_credential", res.credential);
      onClose();
      onGoogleSuccess &&
        onGoogleSuccess({
          name: dec.name,
          email: dec.email,
          googleCredential: res.credential,
        });
    } catch (err) {
      try {
        const dec = jwtDecode(res.credential);
        localStorage.removeItem("lms_token");
        localStorage.removeItem("lms_user");
        localStorage.removeItem("role");
        sessionStorage.setItem("ilmora_google_credential", res.credential);
        onClose();
        onGoogleSuccess &&
          onGoogleSuccess({
            name: dec.name,
            email: dec.email,
            googleCredential: res.credential,
          });
      } catch (_) {
        alert("Google login failed. Please try again.");
      }
    }
  };

  const EyeOpen = () => (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
  const EyeOff = () => (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );

  return (
    <div
      className="lm-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="lm-box">
        <button className="lm-close" onClick={onClose} aria-label="Close">
          ✕
        </button>
        <div className="lm-logo" onClick={onClose}>
          <span style={{ color: "#16a34a" }}>ILM</span>
          <span style={{ color: "#F97316" }}>ORA</span>
        </div>
        <div className="lm-heading">
          <h2>Welcome back!</h2>
          <p>
            Don't have an account?{" "}
            <button
              onClick={() => {
                onClose();
                navigate("/ilm-demo");
              }}
            >
              Apply now
            </button>
          </p>
        </div>
        <div className="lm-google-wrap">
          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => console.error("Google OAuth failed")}
              theme="outline"
              size="large"
              text="continue_with"
              shape="rectangular"
              width="372"
              auto_select={false}
              cancel_on_tap_outside={true}
            />
          </GoogleOAuthProvider>
        </div>
        <div className="lm-or">
          <div className="lm-or-line" />
          <span className="lm-or-text">OR</span>
          <div className="lm-or-line" />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="lm-field">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="lm-field">
            <label>Password</label>
            <div className="lm-pw-wrap">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              <button
                type="button"
                className="lm-eye"
                onClick={() => setShowPassword((p) => !p)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff /> : <EyeOpen />}
              </button>
            </div>
          </div>
          <div className="lm-forgot">
            <button
              type="button"
              onClick={() => {
                onClose();
                navigate("/forgot-password");
              }}
            >
              Forgot password?
            </button>
          </div>
          <button type="submit" className="lm-submit" disabled={loading}>
            {loading ? (
              <>
                <span className="lm-spinner" />
                Signing in…
              </>
            ) : (
              "Log in"
            )}
          </button>
        </form>
        <div className="lm-back-home">
          <button
            onClick={() => {
              onClose();
              navigate("/");
            }}
          >
            ← Back to home
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── STEP 4: Role Selection Toast ───────────────────────────────────────── */
const ROLE_CHOICES = [
  { key: "student", label: "Student", desc: "Learn & grow", Icon: BookOpen },
  { key: "trainer", label: "Trainer", desc: "Teach & inspire", Icon: Users },
  {
    key: "business",
    label: "Business & Partnership",
    desc: "Manage your organisation or grow partnerships",
    Icon: Building2,
  },
];

function RoleSelectToast({ onSelect, onSkip }) {
  return (
    <div
      className="ilm-overlay ilm-overlay-clear"
      onClick={(e) => e.target === e.currentTarget && onSkip()}
    >
      <div className="ilm-modal ilm-role-toast">
        <button className="ilm-modal-close" onClick={onSkip}>
          <X size={16} />
        </button>
        <h2 className="ilm-modal-title">Which role are you interested in?</h2>
        <p className="ilm-modal-sub">
          Explore the platform based on your role and experience.
        </p>
        <div className="ilm-role-list">
          {ROLE_CHOICES.map(({ key, label, desc, Icon }) => (
            <button
              key={key}
              className="ilm-role-option"
              onClick={() => onSelect(key)}
            >
              <span className="ilm-role-icon">
                <Icon size={20} />
              </span>
              <span className="ilm-role-text">
                <span className="ilm-role-label">{label}</span>
                <span className="ilm-role-desc">{desc}</span>
              </span>
              <ChevronRight size={16} className="ilm-role-chevron" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
function InterestSelectInline({ options, onSelect, onSkip }) {
  return (
    <section
      className="d-section"
      style={{ minHeight: "60vh", display: "flex", alignItems: "center" }}
    >
      <div className="d-section-inner" style={{ maxWidth: 620 }}>
        <div className="d-section-head" style={{ position: "relative" }}>
          <button
            onClick={onSkip}
            style={{
              position: "absolute",
              top: -8,
              right: 0,
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#94a3b8",
              width: 30,
              height: 30,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
            }}
            aria-label="Skip"
          >
            <X size={18} />
          </button>
          <div className="d-section-tag">Almost there</div>
          <h2
            className="d-section-title"
            style={{
              whiteSpace: "nowrap",
              fontSize: "clamp(1.1rem, 4vw, 1.9rem)",
            }}
          >
            What are you most <span className="accent">interested</span> in?
          </h2>
          <p className="d-section-sub">
            Pick one to help us tailor your dashboard.
          </p>
        </div>
        <div className="ilm-role-list">
          {options.map(({ key, label, desc, Icon }) => (
            <button
              key={key}
              className="ilm-role-option"
              onClick={() => onSelect(key)}
            >
              <span className="ilm-role-icon">
                <Icon size={20} />
              </span>
              <span className="ilm-role-text">
                <span className="ilm-role-label">{label}</span>
                <span className="ilm-role-desc">{desc}</span>
              </span>
              <ChevronRight size={16} className="ilm-role-chevron" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
/* ─── Role-based Features ────────────────────────────────────────────────── */
const ROLE_CONFIG = {
  student: {
    title: "Everything You Need to Learn",
    features: [
      {
        Icon: BookOpen,
        name: "My Courses",
        desc: "Access all enrolled courses, track progress and continue learning right where you left off.",
        route: "/student/my-courses",
        badge: "Popular",
      },
      {
        Icon: FileText,
        name: "Assignments",
        desc: "View, submit and track your assignments with instructor feedback and deadlines.",
        route: "/student/assignments",
      },
      {
        Icon: Radio,
        name: "Live Classes",
        desc: "Join live interactive sessions with trainers in real time. Ask questions, collaborate.",
        route: "/student/live-classes",
      },
      {
        Icon: Award,
        name: "Certificates",
        desc: "Download and share your completion certificates to boost your LinkedIn profile.",
        route: "/student/certificates",
        badge: "Hot",
      },
      {
        Icon: FileUser,
        name: "Resume Builder",
        desc: "Build an AI-powered resume showcasing your skills, courses and certifications.",
        route: "/student/resume-builder",
      },
      {
        Icon: Map,
        name: "Skill Map",
        desc: "Visualise your entire skill journey, gaps and recommended learning paths on one map.",
        route: "/student/skill-map",
      },
      {
        Icon: BarChart2,
        name: "Assessments",
        desc: "Test your knowledge with quizzes and auto-graded assessments mapped to each course module.",
        route: "/student/assessments",
      },
      {
        Icon: CalendarCheck,
        name: "Attendance",
        desc: "View your class attendance records and keep track of sessions attended.",
        route: "/student/attendance",
      },
      {
        Icon: Video,
        name: "Recorded Classes",
        desc: "Rewatch any live class recording at your own pace whenever you need.",
        route: "/student/recorded-classes",
      },
      {
        Icon: Bot,
        name: "AI Companion",
        desc: "Your personal AI tutor — ask questions, get explanations and study smarter 24/7.",
        route: "/student/ai-companion",
        badge: "AI",
      },
      {
        Icon: NotebookPen,
        name: "Notebook",
        desc: "Take notes directly inside courses and sync them for review later.",
        route: "/student/notebook",
      },
      {
        Icon: MessageCircleQuestion,
        name: "Doubts",
        desc: "Raise doubts and get answers from trainers and peers — never get stuck again.",
        route: "/student/doubts",
      },
    ],
  },
  trainer: {
    title: "Everything You Need to Teach",
    features: [
      {
        Icon: Users,
        name: "Batch Management",
        desc: "Create and manage student batches, assign courses and track overall batch performance.",
        route: "/trainer/batches",
        badge: "Core",
      },
      {
        Icon: CalendarCheck,
        name: "Attendance",
        desc: "Mark and monitor student attendance across all your live sessions and classes.",
        route: "/trainer/attendance",
      },
      {
        Icon: ClipboardList,
        name: "Assignment Mgmt",
        desc: "Create assignments, set deadlines, review submissions and give detailed feedback.",
        route: "/trainer/assignments",
      },
      {
        Icon: Radio,
        name: "Live Sessions",
        desc: "Start and manage live interactive classes with students using built-in tools.",
        route: "/trainer/live-session",
        badge: "Live",
      },
      {
        Icon: TrendingUp,
        name: "Reports",
        desc: "Detailed performance reports for individual students and entire batches.",
        route: "/trainer/reports",
      },
      {
        Icon: Upload,
        name: "Upload Content",
        desc: "Upload videos, documents and course materials for students to access anytime.",
        route: "/trainer/upload-content",
      },
      {
        Icon: Bot,
        name: "AI Companion",
        desc: "Use AI to auto-generate course content, quiz questions and learning plans.",
        route: "/trainer/ai-companion",
        badge: "AI",
      },
      {
        Icon: FileText,
        name: "Assessments",
        desc: "Build quizzes and assessments to evaluate student knowledge at every milestone.",
        route: "/trainer/assessments",
      },
      {
        Icon: Film,
        name: "Recorded Classes",
        desc: "Manage your library of recorded class sessions for student replay.",
        route: "/trainer/recorded-classes",
      },
      {
        Icon: BarChart2,
        name: "Performance",
        desc: "Deep-dive analytics on student engagement, completion rates and skill scores.",
        route: "/trainer/performance-analysis",
      },
      {
        Icon: Map,
        name: "Skill Map",
        desc: "Design skill maps to guide students from beginner to expert in your domain.",
        route: "/trainer/skill-map",
      },
      {
        Icon: Layers,
        name: "Classroom",
        desc: "Manage your virtual classroom: materials, tools, whiteboard and student roster.",
        route: "/trainer/classroom",
      },
    ],
  },
  admin: {
    title: "Everything You Need to Manage",
    features: [
      {
        Icon: LayoutDashboard,
        name: "Org Dashboard",
        desc: "Bird's-eye view of your entire organisation's learning activity and KPIs.",
        route: "/admin/dashboard",
        badge: "Core",
      },
      {
        Icon: UserCog,
        name: "Team Management",
        desc: "Add employees, assign roles, manage departments and track team-level progress.",
        route: "/admin/users",
      },
      {
        Icon: PieChart,
        name: "Analytics",
        desc: "Advanced analytics on course completion, skill development and ROI of training spend.",
        route: "/admin/reports",
        badge: "New",
      },
      {
        Icon: FileBarChart,
        name: "Reports",
        desc: "Export detailed reports on individual and team performance for leadership reviews.",
        route: "/admin/org-reports",
      },
      {
        Icon: Handshake,
        name: "Partnership Programs",
        desc: "Set up partnership programs, co-branded batches and joint certification programs.",
        route: "/admin/org-settings",
      },
      {
        Icon: UserCheck,
        name: "Employee Progress",
        desc: "Track every employee's learning journey, skill gaps and upcoming milestones.",
        route: "/admin/students",
      },
      {
        Icon: Building2,
        name: "Manage Batches",
        desc: "Create bulk batches, assign trainers and enroll employees in one click.",
        route: "/admin/batches",
      },
      {
        Icon: Library,
        name: "All Courses",
        desc: "Browse and assign from the full ILM ORA course catalog to your team.",
        route: "/admin/all-courses",
      },
      {
        Icon: GitBranch,
        name: "Branches",
        desc: "Manage multiple office locations or departments as separate branches.",
        route: "/admin/branches",
      },
      {
        Icon: Tag,
        name: "Categories",
        desc: "Organise courses and skills into categories aligned with your business needs.",
        route: "/admin/categories",
      },
      {
        Icon: ServerCog,
        name: "File Management",
        desc: "Centralised file library for all training materials across your organisation.",
        route: "/admin/file-list",
      },
      {
        Icon: MonitorPlay,
        name: "Live Sessions",
        desc: "Schedule and monitor company-wide live training sessions and webinars.",
        route: "/admin/live-sessions",
      },
    ],
  },
  partnership: {
    title: "Everything You Need to Grow",
    features: [
      {
        Icon: Handshake,
        name: "Partnership Programs",
        desc: "Create and manage co-branded partnership programs with academic and corporate partners.",
        route: "/partnership/programs",
        badge: "Core",
      },
      {
        Icon: Users,
        name: "Lead Management",
        desc: "Track and convert partnership leads through a dedicated pipeline built for growth teams.",
        route: "/partnership/leads",
      },
      {
        Icon: BookOpen,
        name: "Co-Branded Courses",
        desc: "Launch and manage co-branded courses jointly created with partner organisations.",
        route: "/partnership/co-branded-courses",
      },
      {
        Icon: DollarSign,
        name: "Revenue Sharing",
        desc: "Track revenue splits, payouts and earnings across every active partnership in real time.",
        route: "/partnership/revenue-sharing",
        badge: "New",
      },
      {
        Icon: BarChart2,
        name: "Reports",
        desc: "Detailed performance reports across all partnership programs, leads and channels.",
        route: "/partnership/reports",
      },
      {
        Icon: Award,
        name: "Certifications",
        desc: "Issue and manage co-branded certifications for learners completing partner programs.",
        route: "/partnership/certifications",
      },
    ],
  },
};

const INTEREST_CONFIG = {
  student: [
    {
      key: "exam_prep",
      label: "Exam Prep & Certifications",
      desc: "IELTS, PTE, competitive exams and certification tracks.",
      Icon: Award,
    },
    {
      key: "career_skills",
      label: "Career & Resume Skills",
      desc: "Resume building, interview prep and job-readiness.",
      Icon: FileUser,
    },
    {
      key: "tech_programming",
      label: "Tech & Programming",
      desc: "Coding, data and technical skill-building courses.",
      Icon: Cpu,
    },
    {
      key: "design_creative",
      label: "Design & Creative",
      desc: "UI/UX, graphic design and creative portfolio skills.",
      Icon: PenTool,
    },
    {
      key: "business_finance",
      label: "Business & Finance",
      desc: "Business fundamentals, finance and analytics.",
      Icon: DollarSign,
    },
    {
      key: "soft_skills",
      label: "Communication & Soft Skills",
      desc: "Public speaking, teamwork and workplace communication.",
      Icon: MessageCircleQuestion,
    },
  ],
  trainer: [
    {
      key: "curriculum",
      label: "Curriculum & Course Design",
      desc: "Build structured courses and learning paths.",
      Icon: Layers,
    },
    {
      key: "live_teaching",
      label: "Live Teaching & Facilitation",
      desc: "Run engaging live classes and sessions.",
      Icon: Radio,
    },
    {
      key: "assessment",
      label: "Assessment & Grading",
      desc: "Design quizzes, assignments and grading rubrics.",
      Icon: ClipboardList,
    },
    {
      key: "mentorship",
      label: "Mentorship & Coaching",
      desc: "Guide learners one-on-one toward their goals.",
      Icon: Handshake,
    },
    {
      key: "content_creation",
      label: "Content Creation & Media",
      desc: "Produce videos, notes and learning material.",
      Icon: Film,
    },
    {
      key: "analytics_reporting",
      label: "Analytics & Reporting",
      desc: "Track batch performance and learning outcomes.",
      Icon: BarChart,
    },
  ],
  business: [
    {
      key: "onboarding",
      label: "Team Onboarding & L&D",
      desc: "Structured onboarding and learning programs for new hires.",
      Icon: UserCog,
    },
    {
      key: "compliance",
      label: "Compliance & Policy Training",
      desc: "Mandatory training, policy and certification tracking.",
      Icon: ClipboardList,
    },
    {
      key: "skill_gap",
      label: "Skill Gap Analysis",
      desc: "Identify and close skill gaps across your teams.",
      Icon: BarChart2,
    },
    {
      key: "performance",
      label: "Performance Analytics",
      desc: "Org-wide dashboards on learning ROI and progress.",
      Icon: TrendingUp,
    },
    {
      key: "co_branded",
      label: "Co-Branded Programs",
      desc: "Launch joint courses with academic or corporate partners.",
      Icon: Handshake,
    },
    {
      key: "lead_mgmt",
      label: "Partnership & Lead Management",
      desc: "Track partnership leads and revenue-sharing deals.",
      Icon: Target,
    },
  ],
};

const BASE = "https://ilm.ora.texora.ai";

const STATS = [
  { value: "500+", label: "Early Learners" },
  { value: "15+", label: "Expert Mentors" },
  { value: "20+", label: "Courses Live" },
  { value: "4.9★", label: "Average Rating" },
];

const TOOLS = [
  {
    icon: "texora",
    desc: "AI-powered platform redefining professional growth, automation and business intelligence at scale.",
    tags: ["AI Platform", "Flagship"],
    key: "texora",
    route: "https://texora.ai/",
  },
  {
    icon: "tora-cx",
    desc: "Customer experience platform powered by AI. Automate support, boost satisfaction and retain more users.",
    tags: ["Customer AI", "Free Trial"],
    key: "tora-cx",
    route: "https://tora-cx.texora.ai/",
  },
  {
    icon: "crm",
    desc: "Smart CRM built for modern teams. Track leads, manage pipelines and close deals faster with AI insights.",
    tags: ["CRM", "Free"],
    key: "crmorbit",
    route: "https://crm-orbit.texora.ai/",
  },
  {
    icon: "ilm_ora",
    desc: "AI-powered learning platform. World-class courses, skill assessments, resume builder & mock interviews.",
    tags: ["EdTech", "You are here"],
    key: "ilmora",
    route: "https://ilm.ora.texora.ai/",
  },
  {
    icon: "taskorbit",
    desc: "Smarter task & team management. AI nudges, goal tracking and workflow automation in one clean space.",
    tags: ["Productivity", "Free"],
    key: "taskorbit",
    route: "https://task-orbit.texora.ai/",
  },
  {
    icon: "innovara",
    desc: "Next-gen AI innovation suite. Build, deploy and scale AI solutions for your business effortlessly.",
    tags: ["AI Builder", "Beta"],
    key: "innovora",
    route: "https://texora.ai/innovora-ai",
  },
];

const ICON_COLORS = [
  "#F97316",
  "#16a34a",
  "#6366f1",
  "#ec4899",
  "#0ea5e9",
  "#f59e0b",
  "#10b981",
  "#8b5cf6",
  "#ef4444",
  "#14b8a6",
  "#f97316",
  "#3b82f6",
];

/* ─── Main Demo Page ─────────────────────────────────────────────────────── */
export default function IlmOraDemoPage() {
  const navigate = useNavigate();
  const location = useLocation();
  // Which sidebar section is shown in the content area, e.g.
  // "/student/workspace". Stored in the URL (?section=...) so it's
  // shareable/refreshable, but it never triggers a real route change —
  // we stay on /ilm-demo and just swap what renders below the sidebar.
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSection = searchParams.get("section") || null;
  const [showLogin, setShowLogin] = useState(false);
  const [showRolePopup, setShowRolePopup] = useState(false);
  const [showInterestPopup, setShowInterestPopup] = useState(false);

  // Real backend session check. /ilm-demo is now the single real
  // dashboard route — it's only ever reached after actual authentication
  // (onboarding completion, or email/password register/login), so there
  // is no separate "read-only sandbox" state to toggle here anymore.
  // `hasRealSession` is kept only as a simple helper for UI that needs to
  // know whether a real backend token exists (e.g. showing the avatar vs.
  // "Get Started" in the navbar) — it no longer drives any write-blocking.
  const hasRealBackendToken = () => !!localStorage.getItem("lms_token");
  const [hasRealSession, setHasRealSession] = useState(hasRealBackendToken);

  // Keep it in sync if the token changes in another tab (e.g. logging out
  // of a real account elsewhere while /ilm-demo is open here).
  useEffect(() => {
    const syncFromStorage = () => setHasRealSession(hasRealBackendToken());
    window.addEventListener("storage", syncFromStorage);
    return () => window.removeEventListener("storage", syncFromStorage);
  }, []);
  // ── Bug 1 fix helpers ────────────────────────────────────────────────
  // Safely read the cached user object.
  const readSavedUserSafe = () => {
    try {
      return JSON.parse(localStorage.getItem("lms_user") || "{}");
    } catch {
      return {};
    }
  };

  // Persisted (sessionStorage) "return to this path after profile is
  // completed" value, so a hard refresh mid-profile-completion doesn't
  // forget where the user was headed.
  const getPersistedReturnPath = () => {
    try {
      return sessionStorage.getItem("ilmora_profile_return_path") || null;
    } catch {
      return null;
    }
  };

  // Profile Info tab (name/email/photo/role) is OPTIONAL — those fields
  // already come from Google login, and role-change is a nice-to-have.
  // Only the Details tab (mobile, DOB, education, etc.) is MANDATORY to
  // unlock the dashboard.
  const isProfileFullyComplete = (user) => !!user?.profileCompleted;
  const [showProfile, setShowProfile] = useState(false);
  const [profileReturnPathState, setProfileReturnPathState] = useState(
    getPersistedReturnPath,
  );
  // Which field/section inside the profile page to auto-scroll to once it
  // opens — "role" | "password" | null. Set by goToProfile() and passed
  // straight through to <IlmDemoProfilePage scrollTarget=.../>, which
  // already knows how to smooth-scroll to #profile-role-field or
  // #profile-password-section (see IlmDemoProfilePage.jsx).
  const [profileScrollTarget, setProfileScrollTarget] = useState(null);

  // Wrapper that keeps React state AND sessionStorage in sync, so a
  // refresh while mid-profile-completion still remembers where to send
  // the user back to once they finish (Step 10).
  const setProfileReturnPath = (path) => {
    setProfileReturnPathState(path);
    try {
      if (path) sessionStorage.setItem("ilmora_profile_return_path", path);
      else sessionStorage.removeItem("ilmora_profile_return_path");
    } catch {}
  };
  const profileReturnPath = profileReturnPathState;
  // ─────────────────────────────────────────────────────────────────────

  // Steps 7→10 gate modals
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false); // ← responsive mobile nav toggle
  const [mobileFeatureOpen, setMobileFeatureOpen] = useState(true); // ← ILM ORA Feature accordion, full-screen mobile menu
  const [mobileProductOpen, setMobileProductOpen] = useState(true); // ← Product accordion, full-screen mobile menu

  // Which role was picked in Step 4 (kept for reference / feature lookups)
  const [selectedRole, setSelectedRole] = useState(null);

  const [theme, setTheme] = useState(
    () => localStorage.getItem("ilmora-theme") || "light",
  );
  useEffect(() => {
    localStorage.setItem("ilmora-theme", theme);
    // App.jsx (the normal /student, /trainer, /admin routing) toggles this
    // same "dark" class on <html> whenever ITS OWN theme state changes —
    // that's what nested dashboard pages (DashboardPage.jsx etc., via the
    // MutationObserver-based getT(theme)/ThemeCtx pattern) actually read to
    // pick T.light vs T.dark. This page keeps its own separate theme state
    // (so the /ilm-demo hero/nav/sidebar can toggle independently of the
    // rest of the app), but it never mirrored that class toggle — so any
    // real dashboard rendered inside <ContentComponent /> below never
    // learned the theme changed and stayed stuck in light mode. Mirroring
    // it here fixes that without touching how any dashboard page itself
    // decides light vs dark.
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);
  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  // New multi-toast system
  const [toasts, setToasts] = useState([]);
  const toastIdRef = useRef(0);

  const addToast = useCallback(
    ({ type = "success", title, desc, duration = 3500, action }) => {
      const id = ++toastIdRef.current;
      setToasts((prev) => [
        ...prev,
        {
          id,
          type,
          title,
          desc,
          action,
          exiting: false,
          onClose: () => removeToast(id),
        },
      ]);
      setTimeout(() => {
        setToasts((prev) =>
          prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)),
        );
        setTimeout(
          () => setToasts((prev) => prev.filter((t) => t.id !== id)),
          350,
        );
      }, duration);
    },
    [],
  );

  const removeToast = (id) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)),
    );
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 350);
  };

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // "ILM ORA Feature" nav mega-menu — click-toggle, same pattern as the
  // user-avatar menu above (open state + ref + outside click closes it).
  const [featureMenuOpen, setFeatureMenuOpen] = useState(false);
  const featureMenuRef = useRef(null);

  // Product dropdown — ILM ORA Meet, AI Resume Builder and Workspace.
  // Uses the same click-toggle and outside-click behavior as the
  // ILM ORA Feature dropdown. Each item opens its actual production route.
  const [productMenuOpen, setProductMenuOpen] = useState(false);
  const productMenuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target))
        setUserMenuOpen(false);
      if (featureMenuRef.current && !featureMenuRef.current.contains(e.target))
        setFeatureMenuOpen(false);
      if (productMenuRef.current && !productMenuRef.current.contains(e.target))
        setProductMenuOpen(false);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const [googleUserInfo, setGoogleUserInfo] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem("lms_token");
    if (token) {
      sessionStorage.removeItem("ilmora_google_user");
      sessionStorage.removeItem("ilmora_google_credential");
      return;
    }
    const saved = sessionStorage.getItem("ilmora_google_user");
    if (saved) {
      try {
        setGoogleUserInfo(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const getSavedUser = () => {
    try {
      return JSON.parse(localStorage.getItem("lms_user") || "{}");
    } catch {
      return {};
    }
  };

  // ── Role-change lock ──
  // The Role field on the profile page can only be changed ONCE. Once used,
  // `lms_user.roleChangeUsed` is set (see IlmDemoProfilePage.jsx) and stays
  // locked forever after — this reads that same flag so the "Edit Role"
  // item in the avatar dropdown can warn the user before they even open
  // the profile page.
  // ── Role-change count lock (max 3 changes) ──
  // The Role field on the profile page can be swapped up to
  // MAX_ROLE_CHANGES times. `lms_user.roleChangeCount` tracks how many
  // times it's been used (see IlmDemoProfilePage.jsx) — this reads the
  // same value so the "Swap Role" item in the avatar dropdown can warn
  // the user before they even open the profile page.
  const MAX_ROLE_CHANGES = 3;
  const getRoleChangeCount = () => {
    try {
      return Number(JSON.parse(localStorage.getItem("lms_user") || "{}").roleChangeCount) || 0;
    } catch {
      return 0;
    }
  };
  const hasUsedRoleChange = () => getRoleChangeCount() >= MAX_ROLE_CHANGES;

  const savedUser = getSavedUser();
  const hasRole = !!savedUser?.role;

  const signupUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("lms_user") || "{}");
    } catch {
      return {};
    }
  })();

  const isLoggedIn =
    !!localStorage.getItem("lms_token") || !!localStorage.getItem("lms_user");

  const userName =
    signupUser?.name ||
    savedUser?.name ||
    signupUser?.email?.split("@")[0] ||
    savedUser?.email?.split("@")[0] ||
    "there";

  const userEmail = signupUser?.email || savedUser?.email || "";

  const normalizeAppRole = (raw) => {
    const r = (raw || "").toString().trim().toUpperCase();
    if (
      ["TENANT_ADMIN", "ADMIN", "BUSINESS", "MANAGER", "PARTNERSHIP"].includes(
        r,
      )
    )
      return "admin";
    if (r === "TRAINER") return "trainer";
    if (r === "STUDENT") return "student";
    return "";
  };

  const userRole =
    normalizeAppRole(savedUser?.role) ||
    normalizeAppRole(localStorage.getItem("role")) ||
    "student";
  const userInitial = (userName || "U").trim().charAt(0).toUpperCase();
  const featureRoleKey =
    userRole === "admin"
      ? "admin"
      : userRole === "trainer"
        ? "trainer"
        : "student";

  // ── Sidebar toggle ↔ content width sync ─────────────────────────────
  // IlmDemoSidebar supports being a CONTROLLED component (it reads
  // sidebarMode/setSidebarMode props when given, falling back to its own
  // internal state only when they're not passed). Previously they were
  // never passed here, so this page had no idea whether the sidebar was
  // "full" (280px) or "icon" (72px) — the content wrapper below and the
  // Footer wrapper both hardcoded `marginLeft: SIDEBAR_WIDTHS.full`
  // regardless of the sidebar's actual on-screen width. Clicking the
  // hamburger visually shrank the sidebar to an icon rail but left a
  // permanent 280px-wide gap reserved for it, so the dashboard content
  // never expanded into the freed-up space.
  // Fix: lift the mode up here, pass it down as a controlled prop, and
  // drive both margins from SIDEBAR_WIDTHS[sidebarMode] so the content
  // area compresses/expands in sync with the sidebar every time the
  // toggle is clicked.
  const readStoredSidebarMode = (roleKey) => {
    try {
      const stored = localStorage.getItem(`sidebarMode:ilmdemo:${roleKey}`);
      return stored && stored !== "hidden" ? stored : "full";
    } catch {
      return "full";
    }
  };
  const [sidebarMode, setSidebarMode] = useState(() =>
    readStoredSidebarMode(featureRoleKey),
  );
  useEffect(() => {
    setSidebarMode(readStoredSidebarMode(featureRoleKey));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [featureRoleKey]);
  const contentOffset =
    SIDEBAR_WIDTHS[sidebarMode] ?? SIDEBAR_WIDTHS.full;

  // ═══ REAL CONTENT RESOLUTION ═══
  // activeSection (?section=/student/live-classes, etc.) picks a specific
  // sidebar item's real page; with no section selected, the role's real
  // dashboard (DashboardPage / Trainer Dashboard / AdminDashboard) renders
  // — replacing what used to be the marketing hero shown post-login.
  // "Business & Partnership" always resolves to featureRoleKey "admin"
  // above, so it already lands on the real Admin dashboard/pages — there
  // is no separate Business panel in this app, by design.
  // A `hub:<key>` section (set by goToHub, from the "ILM ORA Feature"
  // dropdown) is a special case: it always shows that hub's own preview
  // page (StudentHub/TrainerHub/ManagerHub) regardless of the logged-in
  // user's own featureRoleKey, so it's resolved separately below instead
  // of going through the per-role sidebar registry.
  const activeHubKey =
    activeSection && activeSection.startsWith("hub:")
      ? activeSection.slice(4)
      : null;
  const HubComponent = activeHubKey ? HUB_COMPONENTS[activeHubKey] : null;

  // "All Courses" navbar link — a `page:all-courses` value in ?section=
  // (set by goToAllCourses), same pattern as `hub:<key>` above. It's the
  // exact same AllCoursesPage App.jsx renders at /all-courses, shared by
  // every role (not looked up per-role in the registry), so it's resolved
  // separately here too instead of going through getSectionComponent.
  const isAllCoursesSection = activeSection === "page:all-courses";

  const ContentComponent = useMemo(() => {
    if (activeHubKey || isAllCoursesSection) return null;
    if (activeSection) {
      return getSectionComponent(featureRoleKey, activeSection) || null;
    }
    return getRoleHomeComponent(featureRoleKey);
  }, [activeSection, activeHubKey, isAllCoursesSection, featureRoleKey]);

  // Setup state
  const profileCompleted = !!getSavedUser()?.profileCompleted;
  // Whether the mandatory profile gate (Profile Info + Details) has been
  // cleared. Used to decide whether the "← Back to Dashboard" escape
  // hatch above the profile page is even shown.
  // Profile completion is no longer mandatory, so the "← Back to
  // Dashboard" escape hatch on the profile page is always available.
  const canLeaveProfile = true;

  /* ── Role-selection toast trigger ─────────────────────────────────────────
     Two independent entry points can request Step 4 (Which role are you
     interested in?):
     1. A brand-new Google user (isNewUser === true in lms_user) — but we
        only trust this if a matching Google credential is actually present
        in sessionStorage. A bare isNewUser:true flag with no credential is
        stale data left over from an interrupted/earlier flow — clean it up
        instead of trusting it (prevents the toast firing on every page
        load/refresh without any Google sign-in happening first).
     2. A signed-out visitor who clicked "Get Started" on the landing page.
        LMSHomepage now navigates here with router state
        { openRoleSelect: true }. We read that once on mount, show the
        toast immediately, and clear the state so a later refresh/back
        navigation doesn't reopen it. This does not require any Google
        info — handleRoleChosen already guards every googleUserInfo?.field
        access with optional chaining, so picking a role with no Google
        session just stores role + empty name/email, exactly like before. */
  useEffect(() => {
    const token = localStorage.getItem("lms_token");
    const user = getSavedUser();
    const hasGoogleCred = !!sessionStorage.getItem("ilmora_google_credential");

    if (!token && user?.isNewUser === true) {
      if (hasGoogleCred) {
        setShowRolePopup(true);
      } else {
        // Stale flag from an interrupted flow — clear it so it doesn't
        // keep firing the popup on every mount/refresh.
        localStorage.removeItem("lms_user");
      }
      return;
    }
    if (!token && location.state?.openRoleSelect) {
      setShowRolePopup(true);
      // Clear the one-shot flag so it doesn't reappear on back/refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, []);

  const handleRoleSkip = () => {
    setShowRolePopup(false);
    setGoogleUserInfo(null);
  };

  // Step 3: user is now authenticated the moment Google sign-in succeeds —
  // mark them logged in right away (before role/profile are chosen) so the
  // navbar switches to the avatar immediately and "Get Started" disappears.
  const handleGoogleNewUser = (googleInfo) => {
    sessionStorage.setItem(
      "ilmora_google_credential",
      googleInfo.googleCredential,
    );
    sessionStorage.setItem("ilmora_google_user", JSON.stringify(googleInfo));
    setGoogleUserInfo(googleInfo);

    localStorage.setItem(
      "lms_user",
      JSON.stringify({
        name: googleInfo.name || "",
        email: googleInfo.email || "",
        isGoogleUser: true,
        isNewUser: true,
        profileCompleted: false,
      }),
    );

    setShowRolePopup(true); // Step 4: role selection toast
  };

  // Step 4 -> Step 6: user picked a role. Save it (profile still incomplete)
  // and go straight to the role-based dashboard — no welcome popup in
  // between. The full profile form is deferred until Step 7/8 (first
  // sidebar/navbar click).
  //  const handleRoleChosen = (roleKey) => {
  //     const appRole = roleKey === "business" ? "admin" : roleKey;
  //     localStorage.setItem("role", appRole.toUpperCase());
  //     localStorage.setItem(
  //       "lms_user",
  //       JSON.stringify({
  //         name: googleUserInfo?.name || "",
  //         email: googleUserInfo?.email || "",
  //         role: appRole,
  //         isGoogleUser: !!googleUserInfo,
  //         profileCompleted: false,
  //         isNewUser: false,
  //       })
  //     );
  //     setSelectedRole(roleKey);
  //     setShowRolePopup(false);
  //     setShowInterestPopup(true); // Step 4.5: ask interest for the chosen role
  //   };

  //   // Step 4.5 -> Step 6: user picked an interest within their role.
  //   const handleInterestChosen = (interestKey) => {
  //     const user = getSavedUser();
  //     localStorage.setItem("lms_user", JSON.stringify({ ...user, interest: interestKey }));
  //     setShowInterestPopup(false);
  //     setGoogleUserInfo(null);
  //     addToast({ type: "star", title: "You're in!", desc: "Explore your role-based dashboard below." });
  //   };

  //   const handleInterestSkip = () => {
  //     setShowInterestPopup(false);
  //     setGoogleUserInfo(null);
  //     addToast({ type: "star", title: "You're in!", desc: "Explore your role-based dashboard below." });
  //   };
  // "Business & Partnership" must reach the backend as Role.TENANT_ADMIN,
  // NOT Role.ADMIN — the Role enum has both as separate values, and only
  // TENANT_ADMIN triggers Organization creation / org-scoped queries.
  const BACKEND_ROLE_BY_KEY = {
    student: "STUDENT",
    trainer: "TRAINER",
    admin: "TENANT_ADMIN",
  };

  const handleRoleChosen = (roleKey) => {
    const appRole = roleKey === "business" ? "admin" : roleKey;
    localStorage.setItem("role", appRole.toUpperCase());
    localStorage.setItem(
      "lms_user",
      JSON.stringify({
        name: googleUserInfo?.name || "",
        email: googleUserInfo?.email || "",
        role: appRole,
        isGoogleUser: !!googleUserInfo,
        profileCompleted: false,
        isNewUser: false,
      }),
    );
    setSelectedRole(roleKey);
    setShowRolePopup(false);
    setShowInterestPopup(true); // Step 4.5: ask interest for the chosen role
  };

  // Step 4.5 -> Step 6: role + (optional) interest are both known now — this
  // is the single point where onboarding actually reaches the backend for a
  // brand-new Google user (Bug 1 fix). If there's no Google credential in
  // this session (e.g. the local-only "Get Started" preview flow), behavior
  // is unchanged — local storage only.
  const finalizeOnboarding = async (interestKey) => {
    const user = getSavedUser();
    const appRole = normalizeAppRole(user?.role) || "student";
    const credential = sessionStorage.getItem("ilmora_google_credential");

    if (credential) {
      const onboardingAnswers = { role: [appRole] };
      if (interestKey) onboardingAnswers.interest = [interestKey];

      try {
        const res = await auth.googleLogin({
          idToken: credential,
          role: BACKEND_ROLE_BY_KEY[appRole] || "STUDENT",
          onboardingAnswers,
        });
        // Converge on the same lms_token/lms_user shape handleGoogleSuccess
        // already writes for existing users, so both paths agree.
        localStorage.setItem("lms_token", res.token);
        localStorage.setItem(
          "role",
          (res.role || BACKEND_ROLE_BY_KEY[appRole] || "STUDENT").toUpperCase(),
        );
        if (res.organizationId)
          localStorage.setItem("organizationId", res.organizationId);
        else localStorage.removeItem("organizationId");
        localStorage.setItem(
          "lms_user",
          JSON.stringify({
            name: res.name || user.name || "",
            email: res.email || user.email || "",
            role: appRole,
            interest: interestKey || undefined,
            isGoogleUser: true,
            profileCompleted: !!res.profileCompleted,
            organizationId: res.organizationId || null,
            isNewUser: false,
          }),
        );
        sessionStorage.removeItem("ilmora_google_credential");
        sessionStorage.removeItem("ilmora_google_user");
        setHasRealSession(true); // real token now exists
      } catch (err) {
        console.error("Failed to finalize onboarding with backend:", err);
        // Don't block the UX on a network hiccup — keep the local-only
        // fallback so nothing destructive happens; the user's role/profile
        // still gets saved on their next successful save.
        localStorage.setItem(
          "lms_user",
          JSON.stringify({ ...user, interest: interestKey }),
        );
      }
    } else {
      localStorage.setItem(
        "lms_user",
        JSON.stringify({ ...user, interest: interestKey }),
      );
    }

    setShowInterestPopup(false);
    setGoogleUserInfo(null);
    addToast({
      type: "star",
      title: "You're in!",
      desc: "Explore your role-based dashboard below.",
    });
  };

  const handleInterestChosen = (interestKey) => {
    finalizeOnboarding(interestKey);
  };

  const handleInterestSkip = () => {
    finalizeOnboarding(null);
  };
  const handleSignOut = () => {
    localStorage.removeItem("lms_token");
    localStorage.removeItem("lms_user");
    localStorage.removeItem("role");
    localStorage.removeItem("organizationId");
    localStorage.removeItem("selectedPlan");
    sessionStorage.removeItem("ilmora_google_user");
    sessionStorage.removeItem("ilmora_google_credential");
    sessionStorage.removeItem("ilmora_profile_return_path"); // Bug 1: clear persisted return path too
    setUserMenuOpen(false);
    setHasRealSession(false); // real token is gone
    addToast({
      type: "info",
      title: "Signed out",
      desc: "You have been signed out successfully.",
    });
    navigate("/", { replace: true });
  };

  const handleGoToDashboard = () => {
    setUserMenuOpen(false);
    addToast({
      type: "star",
      title: "You're all set!",
      desc: "Use the navigation above to jump into any section.",
    });
  };

  // ═══ STEPS 7 → 10: the single gate every sidebar/navbar tab goes through ═══
  // Step 7: user clicks any tab.
  // Decision "Profile Info + Details Completed?":
  //   NO  -> Step 8: redirect to the profile page, remembering where they
  //          wanted to go (returnTo) so Step 10 can send them back there
  //          automatically once they save BOTH steps.
  //   YES -> Step 10: go straight to the page they clicked.
  const goToFeature = (path) => {
    const user = getSavedUser();
    if (!user?.role) {
      addToast({
        type: "warning",
        title: "Select Your Role",
        desc: "Please choose your role first to continue.",
      });
      setShowRolePopup(true);
      return;
    }
    // Profile completion is NOT required to access features right now —
    // every feature is free. To gate a specific paid/advanced feature
    // later, add a check here for that feature's route (e.g. a plan or
    // subscription flag) before navigating, instead of blocking access
    // to the whole dashboard.
    //
    // This is used by top-navbar links (All Courses, Mentors) that are
    // meant to leave the demo and go to their real public pages — unlike
    // the LEFT SIDEBAR, whose clicks go through goToSection() below and
    // stay inside /ilm-demo.
    navigate(path);
  };

  // Used ONLY by the ILM ORA demo's left sidebar (IlmDemoSidebar's
  // onNavigate). Sidebar items used to go through goToFeature() above,
  // which called navigate(path) straight to the REAL app route (e.g.
  // /student/workspace) — a totally different page/layout outside the
  // demo. Instead, every sidebar click now stays on /ilm-demo and just
  // records which section to show via ?section=, so the demo's own
  // sidebar + header never unmount.
  const goToSection = (path) => {
    const user = getSavedUser();
    if (!user?.role) {
      addToast({
        type: "warning",
        title: "Select Your Role",
        desc: "Please choose your role first to continue.",
      });
      setShowRolePopup(true);
      return;
    }
    const role = normalizeAppRole(user.role) || "student";
    const homePath = ROLE_HOME_PATH[role] || "/student";
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (!path || path === homePath) {
          next.delete("section"); // "Dashboard" → back to the demo overview
        } else {
          next.set("section", path);
        }
        return next;
      },
      { replace: false },
    );
  };

// ─────────────────────────────────────────────────────────────
// TOP NAVBAR ROUTES
// These links open the actual production pages.
// LEFT SIDEBAR navigation remains inside the /ilm-demo shell.
// ─────────────────────────────────────────────────────────────

const HUB_ROUTES = {
  student: "/student-hub",
  trainer: "/trainer-hub",
  admin: "/manager-hub",
};

const PRODUCT_ROUTES = {
  meet: "/ilm-ora-meet",
  resume: "/resume-builder",
  workspace: "/workspace",
};

// ILM ORA Feature → Student / Trainer / Manager Hub
const goToHub = (hubKey) => {
  setFeatureMenuOpen(false);

  if (isLoggedIn && hasRole) {
    navigate(HUB_ROUTES[hubKey] || "/");
  } else {
    scrollToId("features");
  }
};

// Product → real public product page
const goToProductSection = (productKey) => {
  setProductMenuOpen(false);

  if (isLoggedIn && hasRole) {
    navigate(PRODUCT_ROUTES[productKey] || "/");
  } else {
    scrollToId("tools");
  }
};

// All Courses → actual production All Courses page.
const goToAllCourses = () => {
  navigate("/all-courses");
};

  // Navigate to the REAL profile route for this role instead of mounting
  // <ProfilePage /> inline. Mounting it inline made it inherit this page's
  // global styles (the universal box-sizing/margin/padding reset and the
  // DM Sans font-family on .d-page), which is what broke its layout,
  // spacing and width compared to visiting /student/profile directly.
  //
  // `scrollTarget` ("role" | "password" | null) is forwarded straight to
  // <IlmDemoProfilePage scrollTarget=.../> so it can open on the right
  // tab and smooth-scroll to the exact field (Role field or Password
  // section) once it mounts.
  const goToProfile = (scrollTarget = null) => {
    const user = getSavedUser();
    if (!user?.role) {
      addToast({
        type: "warning",
        title: "Select Your Role",
        desc: "Please choose your role first to continue.",
      });
      setShowRolePopup(true);
      return;
    }
    setProfileReturnPath(null);
    setProfileScrollTarget(scrollTarget);
    setShowProfile(true);
  };

  const handleProfileBack = () => {
    // Mandatory gate: while Profile Info + Details aren't both complete,
    // there is no way back to the dashboard/homepage content — this
    // handler is only ever wired up to a visible button once
    // canLeaveProfile is true (see render below), but guard here too in
    // case it's ever called programmatically.
    if (!canLeaveProfile) return;
    setShowProfile(false);
    if (profileReturnPath) {
      const path = profileReturnPath;
      setProfileReturnPath(null);
      navigate(path);
    }
  };

  const goToDashboard = () => {
  const user = getSavedUser();

  // Keep the current logged-in user/session.
  // Only return from the current internal page to Dashboard Home.
  if (!user?.role) {
    addToast({
      type: "warning",
      title: "Select Your Role",
      desc: "Please choose your role first to continue.",
    });
    setShowRolePopup(true);
    return;
  }

  // Close Profile / Role / other internal page views.
  setShowProfile(false);
  setProfileScrollTarget(null);
  setProfileReturnPath(null);

  // /ilm-demo is the existing Dashboard shell.
  // Removing ?section returns the SAME logged-in user
  // to their role-based Dashboard Home.
  setSearchParams(
    (prev) => {
      const next = new URLSearchParams(prev);
      next.delete("section");
      return next;
    },
    { replace: true }
  );
};
  const handleProfileCompleted = () => {
    setShowProfile(false);
    setProfileReturnPath(null);
    setProfileScrollTarget(null);
    // Profile complete hone ke baad IlmOraDemoPage (/ilm-demo) pe bhejo.
    // Wahan ek toast dikhega — user uspe click karega to role ke hisab
    // se seedha uska dashboard khulega (goToDashboard already role-based
    // navigate karta hai — Student -> /student/dashboard, Trainer ->
    // /trainer/dashboard, Admin -> /admin/dashboard).
    navigate("/ilm-demo", { replace: true });
    addToast({
      type: "star",
      title: "Profile Completed! 🎉",
      desc: "Your personalized dashboard is ready.",
      duration: 8000,
      action: { label: "Go to Dashboard", onClick: goToDashboard },
    });
  };

  const handleProfileModalComplete = () => {
    setShowProfileModal(false);
    setShowProfile(true);
  };

  const handleDashGateUpdateProfile = () => {
    setShowProfileModal(false);
    setShowProfile(true);
  };

  const scrollToId = (id) => {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const roleConfig = ROLE_CONFIG[featureRoleKey] || ROLE_CONFIG.student;
  const isDark = theme === "dark";

  // GSAP refs
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const featuresRef = useRef(null);
  const toolsRef = useRef(null);
  const ctaRef = useRef(null);

  // ── Auto-scroll ref for the Tools/Products row (bug fix: continuous
  // auto-scroll, pauses on hover, seamlessly loops) ──────────────────────
  // Uses a CALLBACK ref (not useRef + mount-only useEffect) because this
  // section is conditionally rendered (hidden behind role/interest popups
  // or the profile page). A plain useRef + useEffect([]) only wires up the
  // animation once, on the very first mount — if the section happens to be
  // unmounted at that moment, toolsScrollRef.current is null, the effect
  // bails out via `if (!wrap) return;`, and since deps are [], it never
  // retries even after the section becomes visible later. That's what
  // caused the "works sometimes, not others" behavior. A callback ref
  // fires every time the node is attached OR detached, so the animation
  // reliably (re)starts every time the Tools row mounts.
  const toolsAnimRef = useRef({ raf: null, cleanup: null });

  const toolsScrollRef = useCallback((wrap) => {
    // Detach: node removed (section hidden) — stop any running animation.
    if (toolsAnimRef.current.cleanup) {
      toolsAnimRef.current.cleanup();
      toolsAnimRef.current.cleanup = null;
    }
    if (!wrap) return;

    // Attach: node mounted (section visible) — start the animation.
    let pos = wrap.scrollLeft || 0;
    let paused = false;
    let raf;
    const speed = 0.5; // px per frame

    const step = () => {
      if (!paused) {
        pos += speed;
        const half = wrap.scrollWidth / 2;
        if (pos >= half) pos = 0;
        wrap.scrollLeft = pos;
      }
      raf = requestAnimationFrame(step);
    };
    const onEnter = () => {
      paused = true;
    };
    const onLeave = () => {
      paused = false;
    };

    wrap.addEventListener("mouseenter", onEnter);
    wrap.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(step);

    toolsAnimRef.current.cleanup = () => {
      cancelAnimationFrame(raf);
      wrap.removeEventListener("mouseenter", onEnter);
      wrap.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        ".d-hero-greeting",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5 },
      )
        .fromTo(
          ".d-hero-name",
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.55 },
          "-=0.25",
        )
        .fromTo(
          ".d-hero-subtitle",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.45 },
          "-=0.2",
        )
        .fromTo(
          ".d-hero-title",
          { opacity: 0, y: 32 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.2",
        )
        .fromTo(
          ".d-hero-typing",
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.45 },
          "-=0.25",
        )
        .fromTo(
          ".d-hero-btns",
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.4 },
          "-=0.2",
        );
    }, heroRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".d-stat",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: statsRef.current, start: "top 85%" },
        },
      );
    }, statsRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".d-feature-card",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.06,
          ease: "power3.out",
          scrollTrigger: { trigger: featuresRef.current, start: "top 85%" },
        },
      );
    }, featuresRef);
    return () => ctx.revert();
  }, [featureRoleKey]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".d-tool-card",
        { opacity: 0, y: 40, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: toolsRef.current, start: "top 80%" },
        },
      );
    }, toolsRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".d-cta",
        { opacity: 0, y: 40, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: { trigger: ctaRef.current, start: "top 85%" },
        },
      );
    }, ctaRef);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');

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

        .d-page { font-family:'DM Sans',sans-serif; min-height:100vh; background:var(--d-bg); color:var(--d-text); transition:background .3s,color .3s; overflow-x:hidden; padding-top:60px; }
@media(min-width:480px){ .d-page { padding-top:64px; } }
@media(min-width:768px){ .d-page { padding-top:68px; } }
        /* Below the point where IlmDemoSidebar collapses to an overlay/drawer,
           never let a fixed sidebar-width margin push page content off-screen. */
        @media (max-width: 1024px) {
          .d-reset-scope, .d-sidebar-offset {
            margin-left: 0 !important;
            width: 100% !important;
          }
        }
        .d-nav { position:fixed; top:0; left:0; width:100%; z-index:9999; display:flex; align-items:center; justify-content:space-between; padding:0 16px; height:60px; background:#181818; backdrop-filter:blur(20px); border-bottom:1px solid rgba(255,255,255,0.08); box-shadow:0 1px 20px rgba(0,0,0,0.25); transition:background .3s,border-color .3s; gap:8px; flex-wrap:nowrap; box-sizing:border-box; }
        @media(min-width:480px){ .d-nav { padding:0 20px; height:64px; } }
        @media(min-width:768px){ .d-nav { padding:0 32px; height:68px; } }
        @media(min-width:1024px){ .d-nav { padding:0 48px; } }
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
        .d-nav-links { display:none; align-items:center; gap:2px; flex-wrap:wrap; }
        @media(min-width:1024px){ .d-nav-links { display:flex; gap:4px; } }
        .d-nav-link { font-size:0.78rem; font-weight:600; color:#e5e7eb; background:none; border:none; padding:7px 10px; border-radius:8px; cursor:pointer; font-family:'DM Sans',sans-serif; transition:0.18s; display:flex; align-items:center; white-space:nowrap; }
        @media(min-width:1200px){ .d-nav-link { font-size:0.82rem; padding:7px 14px; } }
        .d-nav-link:hover { background:rgba(255,255,255,0.06); color:var(--d-orange); }

        /* ILM ORA Feature dropdown — click to toggle.
           Uses the same interaction pattern as the user-avatar menu.
           Each item opens its corresponding Hub page. */
        .d-nav-dropdown { position:relative; }
        .d-nav-dropdown-menu {
          position:absolute; top:calc(100% + 8px); left:0; width:280px;
          max-width:calc(100vw - 32px);
          background:#232323; border:1px solid rgba(255,255,255,0.08);
          border-radius:12px; box-shadow:0 16px 48px rgba(0,0,0,0.45);
          padding:8px; opacity:0; visibility:hidden; transform:translateY(-6px);
          pointer-events:none;
          transition:all .2s cubic-bezier(.22,.61,.36,1); z-index:200;
        }
        .d-nav-dropdown-menu.open {
          opacity:1; visibility:visible; transform:translateY(0); pointer-events:all;
        }
        .d-nav-dropdown-item { display:flex; align-items:flex-start; gap:12px; width:100%; text-align:left; padding:10px 12px; border-radius:8px; background:none; border:none; cursor:pointer; font-family:'DM Sans',sans-serif; transition:background .15s; }
        .d-nav-dropdown-item:hover { background:rgba(249,115,22,0.12); }
        .d-nav-dropdown-item-icon { flex-shrink:0; margin-top:2px; }
        .d-nav-dropdown-item-title { font-size:0.85rem; font-weight:700; color:#f1f5f9; }
        .d-nav-dropdown-item-desc { font-size:0.72rem; color:#94a3b8; margin-top:2px; }
        .d-nav-dropdown-chevron { transition:transform .2s; }
        .d-nav-dropdown-chevron.open { transform:rotate(180deg); }

        /* Mobile hamburger + full-screen nav overlay (pure CSS, driven by a checkbox-like React toggle) */
        .d-nav-hamburger { display:flex; width:38px; height:38px; align-items:center; justify-content:center; background:rgba(255,255,255,0.06); border:1.5px solid rgba(255,255,255,0.12); border-radius:10px; color:#e5e7eb; cursor:pointer; flex-shrink:0; }
        @media(min-width:1024px){ .d-nav-hamburger { display:none; } }
        .d-nav-links-mobile { display:none; position:fixed; inset:0; width:100%; height:100dvh; background:#0b0b0f; flex-direction:column; padding:0; gap:0; z-index:10000; box-shadow:none; overflow-y:auto; }
        .d-nav-links-mobile.open { display:flex; }
        @media(min-width:1024px){ .d-nav-links-mobile { display:none !important; } }
        .d-mobile-menu-header { display:flex; align-items:center; justify-content:space-between; padding:16px 20px; border-bottom:1px solid rgba(255,255,255,0.08); flex-shrink:0; }
        .d-mobile-menu-logo { font-size:1.4rem; font-weight:800; font-family:'DM Sans',sans-serif; letter-spacing:0.01em; white-space:nowrap; }
        .d-mobile-menu-close { display:flex; width:36px; height:36px; align-items:center; justify-content:center; background:transparent; border:none; color:#e5e7eb; cursor:pointer; border-radius:10px; transition:background .15s; flex-shrink:0; }
        .d-mobile-menu-close:hover { background:rgba(255,255,255,0.08); }
        .d-mobile-menu-body { flex:1 1 auto; overflow-y:auto; padding:10px 12px 20px; display:flex; flex-direction:column; gap:2px; }
        .d-nav-links-mobile .d-nav-link { width:100%; color:#e5e7eb; padding:14px 12px; font-size:1rem; font-weight:700; justify-content:flex-start; gap:14px; border-radius:12px; }
        .d-nav-links-mobile .d-nav-link:hover { background:rgba(255,255,255,0.06); }
        .d-mobile-menu-divider { height:1px; background:rgba(255,255,255,0.08); margin:10px 4px; flex-shrink:0; }
        .d-mobile-section-header { display:flex; align-items:center; justify-content:space-between; width:100%; background:none; border:none; cursor:pointer; padding:12px; font-family:'DM Sans',sans-serif; font-size:0.95rem; font-weight:700; color:#f1f5f9; border-radius:10px; }
        .d-mobile-section-header:hover { background:rgba(255,255,255,0.06); }
        .d-mobile-section-chevron { transition:transform .2s; color:#e5e7eb; flex-shrink:0; }
        .d-mobile-section-chevron.open { transform:rotate(180deg); }
        .d-mobile-section-items { display:flex; flex-direction:column; gap:2px; padding:2px 0 4px; }
        .d-mobile-section-item { display:flex; align-items:flex-start; gap:14px; width:100%; text-align:left; padding:8px 8px; border-radius:12px; background:none; border:none; cursor:pointer; font-family:'DM Sans',sans-serif; transition:background .15s; }
        .d-mobile-section-item:hover { background:rgba(255,255,255,0.06); }
        .d-mobile-section-item-icon { flex-shrink:0; width:40px; height:40px; border-radius:12px; background:#f8fafc; display:flex; align-items:center; justify-content:center; }
        .d-mobile-section-item-title { display:block; font-size:0.92rem; font-weight:700; color:#f8fafc; }
        .d-mobile-section-item-desc { display:block; font-size:0.76rem; color:#94a3b8; margin-top:2px; }
        .d-mobile-user-block { flex-shrink:0; padding:18px 20px calc(24px + env(safe-area-inset-bottom)); border-top:1px solid rgba(255,255,255,0.08); }
        .d-mobile-user-row { display:flex; align-items:center; gap:12px; margin-bottom:16px; }
        .d-mobile-user-avatar { width:44px; height:44px; border-radius:50%; background:linear-gradient(135deg,#F97316,#ea580c); display:flex; align-items:center; justify-content:center; font-size:1.05rem; font-weight:800; color:#fff; flex-shrink:0; user-select:none; }
        .d-mobile-user-name { font-size:1rem; font-weight:800; color:#f8fafc; overflow-wrap:anywhere; }
        .d-mobile-user-email { font-size:0.82rem; color:#94a3b8; margin-top:1px; overflow-wrap:anywhere; }
        .d-mobile-user-action { display:flex; align-items:center; gap:12px; width:100%; padding:12px; font-size:0.95rem; font-weight:700; background:none; border:none; cursor:pointer; font-family:'DM Sans',sans-serif; border-radius:10px; text-align:left; color:#60a5fa; }
        .d-mobile-user-action:hover { background:rgba(255,255,255,0.06); }
        .d-mobile-user-action.signout { color:#f87171; }

        .d-nav-right { display:flex; align-items:center; gap:6px; flex-shrink:0; }
        @media(min-width:480px){ .d-nav-right { gap:8px; } }
        @media(min-width:768px){ .d-nav-right { gap:10px; } }
        .d-btn-login { font-size:0.72rem; font-weight:600; color:var(--d-text-muted); background:var(--d-card-bg); border:1px solid var(--d-card-border); border-radius:10px; padding:7px 12px; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all 0.18s; box-shadow:0 1px 4px rgba(0,0,0,0.06); white-space:nowrap; }
        @media(min-width:480px){ .d-btn-login { font-size:0.78rem; padding:8px 16px; } }
        @media(min-width:768px){ .d-btn-login { font-size:0.8rem; padding:8px 18px; } }
        .d-btn-login:hover { border-color:var(--d-orange); color:var(--d-orange); }
        .d-btn-signup { font-size:0.72rem; font-weight:700; color:#fff; background:#1E293B; border:none; border-radius:10px; padding:7px 14px; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all 0.18s; display:flex; align-items:center; gap:6px; box-shadow:0 4px 12px rgba(30,41,59,0.25); white-space:nowrap; }
        @media(min-width:480px){ .d-btn-signup { font-size:0.78rem; padding:8px 18px; } }
        @media(min-width:768px){ .d-btn-signup { font-size:0.8rem; padding:8px 20px; } }
        .d-btn-signup:hover { background:#334155; transform:translateY(-1px); }
        .d-theme-toggle { width:36px; height:36px; background:rgba(255,255,255,0.06); border-radius:12px; border:1.5px solid rgba(255,255,255,0.12); cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background .3s,border-color .3s,transform .2s; flex-shrink:0; color:var(--d-orange); }
        @media(min-width:768px){ .d-theme-toggle { width:40px; height:40px; } }
        .d-theme-toggle:hover { transform:scale(1.1); box-shadow:0 4px 12px rgba(0,0,0,0.15); }
        .d-theme-toggle svg { display:block; width:18px; height:18px; }
        @media(min-width:768px){ .d-theme-toggle svg { width:20px; height:20px; } }

        .d-user-menu-wrap { position:relative; }
        .d-user-trigger { display:flex; align-items:center; gap:6px; cursor:pointer; padding:4px 8px 4px 4px; border-radius:999px; transition:0.18s; }
        .d-user-trigger:hover { background:rgba(255,255,255,0.06); }
        .d-user-avatar { width:32px; height:32px; border-radius:50%; background:linear-gradient(135deg,#F97316,#ea580c); display:flex; align-items:center; justify-content:center; font-size:0.82rem; font-weight:800; color:#fff; border:2px solid rgba(249,115,22,.3); flex-shrink:0; user-select:none; }
        @media(min-width:768px){ .d-user-avatar { width:36px; height:36px; font-size:0.9rem; } }
        .d-user-arrow { transition:transform .25s; flex-shrink:0; color:#e5e7eb; }
        .d-user-arrow.open { transform:rotate(180deg); }
        .d-user-dropdown { position:absolute; top:calc(100% + 10px); right:0; background:var(--d-dd-bg); border:1px solid var(--d-dd-border); border-radius:14px; min-width:220px; max-width:calc(100vw - 32px); padding:6px 0; box-shadow:var(--d-dd-shadow); opacity:0; transform:translateY(-8px) scale(.97); pointer-events:none; transition:all .2s cubic-bezier(.22,.61,.36,1); z-index:200; }
        @media(min-width:480px){ .d-user-dropdown { min-width:240px; } }
        .d-user-dropdown.open { opacity:1; transform:translateY(0) scale(1); pointer-events:all; }
        .d-user-dropdown-header { padding:14px 16px 12px; }
        .d-user-dropdown-name { font-size:.88rem; font-weight:700; color:var(--d-dd-header-name); margin-bottom:2px; }
        .d-user-dropdown-email { font-size:.72rem; color:var(--d-dd-header-email); overflow-wrap:anywhere; }
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

        .d-hero-wrap { background:var(--d-hero-bg); transition:background .3s; }
        .d-hero { padding:24px 16px 20px; display:flex; flex-direction:column; align-items:center; position:relative; overflow:hidden; max-width:1200px; margin:0 auto; }
        @media(min-width:480px){ .d-hero { padding:28px 20px 24px; } }
        @media(min-width:768px){ .d-hero { padding:40px 32px 32px; } }
        @media(min-width:900px){ .d-hero { padding:52px 48px 40px; } }
        .d-hero::before { content:''; position:absolute; top:-100px; right:-100px; width:280px; height:280px; background:rgba(249,115,22,0.06); border-radius:50%; pointer-events:none; }
        @media(min-width:768px){ .d-hero::before { width:400px; height:400px; } }
        .d-hero::after  { content:''; position:absolute; bottom:-80px; left:-80px; width:200px; height:200px; background:rgba(34,197,94,0.05); border-radius:50%; pointer-events:none; }
        @media(min-width:768px){ .d-hero::after { width:300px; height:300px; } }
        .d-hero-content { flex:1; text-align:center; max-width:760px; width:100%; }
        .d-hero-welcome { display:flex; flex-direction:column; align-items:center; gap:3px; margin-bottom:12px; }
        @media(min-width:768px){ .d-hero-welcome { margin-bottom:14px; } }
        .d-hero-greeting { font-size:0.72rem; font-weight:600; color:var(--d-hero-greeting); display:flex; align-items:center; gap:7px; }
        @media(min-width:768px){ .d-hero-greeting { font-size:0.78rem; } }
        .d-hero-name { font-family:'Playfair Display',serif; font-size:1.15rem; font-weight:900; color:var(--d-hero-name); text-align:center; }
        @media(min-width:480px){ .d-hero-name { font-size:1.3rem; } }
        @media(min-width:768px){ .d-hero-name { font-size:1.4rem; } }
        .d-hero-name .ora { color:var(--d-orange); }
        .d-hero-subtitle { font-size:0.74rem; color:var(--d-hero-sub); padding:0 8px; }
        @media(min-width:768px){ .d-hero-subtitle { font-size:0.8rem; padding:0; } }
        .d-hero-title { font-family:'Playfair Display',serif; font-size:1.65rem; font-weight:900; line-height:1.15; color:var(--d-hero-title); margin-bottom:10px; }
        @media(min-width:400px){ .d-hero-title { font-size:1.9rem; } }
        @media(min-width:640px){ .d-hero-title { font-size:2.3rem; } }
        @media(min-width:768px){ .d-hero-title { font-size:2.8rem; } }
        @media(min-width:1440px){ .d-hero-title { font-size:3.1rem; } }
        .d-hero-title .ora { color:var(--d-orange); }
        .d-hero-title .ilm { color:var(--d-green); }
        .d-hero-typing { min-height:1.6em; margin-bottom:8px; font-size:0.8rem; color:var(--d-hero-sub); display:flex; align-items:center; justify-content:center; gap:6px; text-align:center; padding:0 8px; }
        @media(min-width:768px){ .d-hero-typing { font-size:0.92rem; padding:0; } }
        .d-typewriter { color:var(--d-orange); font-weight:700; font-size:0.84rem; }
        @media(min-width:768px){ .d-typewriter { font-size:0.96rem; } }
        .d-hero-btns { display:flex; gap:12px; justify-content:center; flex-wrap:wrap; }

        .d-stats { background:var(--d-stats-bg); padding:24px 16px; display:grid; grid-template-columns:repeat(2,1fr); gap:1px; transition:background .3s; }
        @media(min-width:480px){ .d-stats { padding:28px 20px; } }
        @media(min-width:640px){ .d-stats { grid-template-columns:repeat(4,1fr); padding:36px 32px; } }
        @media(min-width:1024px){ .d-stats { padding:36px 48px; } }
        .d-stat { text-align:center; padding:14px 6px; }
        @media(min-width:480px){ .d-stat { padding:20px 10px; } }
        .d-stat-val { font-size:1.5rem; font-weight:800; color:var(--d-orange); }
        @media(min-width:480px){ .d-stat-val { font-size:1.75rem; } }
        @media(min-width:768px){ .d-stat-val { font-size:2rem; } }
        .d-stat-lbl { font-size:0.68rem; color:var(--d-stats-text); margin-top:4px; font-weight:500; }
        @media(min-width:480px){ .d-stat-lbl { font-size:0.78rem; } }

        .d-section { padding:40px 16px; background:var(--d-bg2); transition:background .3s; }
        .d-section-alt { background:var(--d-bg) !important; }
        @media(min-width:480px){ .d-section { padding:48px 20px; } }
        @media(min-width:768px){ .d-section { padding:64px 32px; } }
        @media(min-width:1024px){ .d-section { padding:72px 48px; } }
        .d-section-inner { max-width:1280px; margin:0 auto; }
        .d-section-head { text-align:center; margin-bottom:28px; }
        @media(min-width:768px){ .d-section-head { margin-bottom:40px; } }
        .d-section-tag { display:inline-block; font-size:0.66rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:var(--d-orange); background:rgba(249,115,22,0.08); border:1px solid rgba(249,115,22,0.2); border-radius:999px; padding:4px 12px; margin-bottom:10px; }
        @media(min-width:768px){ .d-section-tag { font-size:0.72rem; letter-spacing:0.12em; padding:4px 14px; margin-bottom:12px; } }
        .d-section-title { font-family:'Playfair Display',serif; font-size:1.55rem; font-weight:900; color:var(--d-text); padding:0 8px; }
        @media(min-width:480px){ .d-section-title { font-size:1.8rem; } }
        @media(min-width:768px){ .d-section-title { font-size:2.3rem; padding:0; } }
        @media(min-width:1024px){ .d-section-title { font-size:2.6rem; } }
        .d-section-title .accent { color:var(--d-orange); }
        .d-section-sub { font-size:0.85rem; color:var(--d-text-muted); margin-top:8px; max-width:500px; margin-left:auto; margin-right:auto; padding:0 8px; }
        @media(min-width:768px){ .d-section-sub { font-size:0.95rem; padding:0; } }

        .d-features-grid { display:grid; grid-template-columns:1fr; gap:14px; }
        @media(min-width:480px){ .d-features-grid { grid-template-columns:repeat(2,1fr); gap:16px; } }
        @media(min-width:768px){ .d-features-grid { grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); } }
        @media(min-width:1440px){ .d-features-grid { grid-template-columns:repeat(4,1fr); } }
        .d-feature-card { background:var(--d-card-bg); border-radius:16px; border:1.5px solid var(--d-card-border); box-shadow:0 2px 12px rgba(0,0,0,.05); padding:18px 16px; transition:all .22s; display:flex; flex-direction:column; gap:10px; position:relative; overflow:hidden; text-align:left; font-family:'DM Sans',sans-serif; width:100%; cursor:default; }
        @media(min-width:768px){ .d-feature-card { padding:22px 20px; gap:12px; } }
        .d-feature-card::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(90deg,var(--d-orange),var(--d-green)); opacity:0; transition:.22s; }
        .d-feature-card:hover { border-color:rgba(249,115,22,.25); box-shadow:0 8px 24px rgba(249,115,22,.08); }
        .d-feature-card:hover::before { opacity:1; }
        .d-feature-icon { width:40px; height:40px; border-radius:12px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        @media(min-width:768px){ .d-feature-icon { width:44px; height:44px; } }
        .d-feature-name { font-size:.9rem; font-weight:700; color:var(--d-text); }
        @media(min-width:768px){ .d-feature-name { font-size:.95rem; } }
        .d-feature-desc { font-size:.76rem; color:var(--d-text-muted); line-height:1.55; flex:1; }
        @media(min-width:768px){ .d-feature-desc { font-size:.78rem; } }
        .d-feature-badge { position:absolute; top:12px; right:12px; font-size:.6rem; font-weight:700; background:var(--d-green); color:#fff; border-radius:6px; padding:2px 7px; }

        .d-tools-track-wrap { overflow-x:auto; scrollbar-width:none; -ms-overflow-style:none; }
        .d-tools-track-wrap::-webkit-scrollbar { display:none; }
        .d-tools-grid { display:flex; flex-wrap:nowrap; gap:12px; padding:4px 4px 12px; width:max-content; }
        .d-tool-card { background:var(--d-card-bg); border-radius:14px; padding:14px; cursor:pointer; border:1.5px solid var(--d-card-border); box-shadow:0 2px 10px rgba(0,0,0,0.05); transition:all 0.22s; display:flex; flex-direction:column; gap:8px; flex:0 0 190px; min-width:190px; }
        @media(min-width:480px){ .d-tool-card { flex-basis:220px; min-width:220px; padding:16px; } }
        @media(min-width:768px){ .d-tool-card { flex-basis:240px; min-width:240px; padding:16px; gap:10px; } }
        .d-tool-card:hover { border-color:var(--d-orange); box-shadow:0 12px 32px rgba(249,115,22,0.15); transform:translateY(-4px); }
        .d-tool-icon { overflow:hidden; border-radius:8px; height:70px; }
        .d-tool-desc { font-size:0.7rem; color:var(--d-text-muted); line-height:1.45; flex:1; }
        @media(min-width:768px){ .d-tool-desc { font-size:0.72rem; } }
        .d-tool-tags { display:flex; gap:5px; flex-wrap:wrap; margin-top:auto; }
        .d-tool-tag { font-size:0.58rem; font-weight:700; border-radius:999px; padding:2px 8px; background:rgba(249,115,22,0.08); color:var(--d-orange); border:1px solid rgba(249,115,22,0.2); }
        .d-tool-tag.green { background:rgba(34,197,94,0.08); color:var(--d-green); border-color:rgba(34,197,94,0.2); }
        .d-tool-cta { display:flex; align-items:center; justify-content:space-between; margin-top:2px; }
        .d-tool-try { font-size:0.7rem; font-weight:700; color:var(--d-orange); background:none; border:none; cursor:pointer; font-family:'DM Sans',sans-serif; padding:0; }

        .d-cta { background:#1E293B; border-radius:20px; padding:36px 20px; text-align:center; margin:0 16px 40px; position:relative; overflow:hidden; }
        @media(min-width:480px){ .d-cta { padding:44px 28px; margin:0 20px 48px; } }
        @media(min-width:768px){ .d-cta { border-radius:24px; padding:56px 32px; margin:0 32px 64px; } }
        @media(min-width:1024px){ .d-cta { margin:0 48px 80px; } }
        .d-cta::before { content:''; position:absolute; top:0; left:0; right:0; height:4px; background:linear-gradient(90deg,var(--d-orange),var(--d-green)); }
        .d-cta-title { font-family:'Playfair Display',serif; font-size:1.5rem; font-weight:900; color:#fff; margin-bottom:10px; }
        @media(min-width:480px){ .d-cta-title { font-size:1.8rem; } }
        @media(min-width:768px){ .d-cta-title { font-size:2.2rem; margin-bottom:12px; } }
        .d-cta-sub { color:rgba(255,255,255,0.55); font-size:0.85rem; margin-bottom:24px; }
        @media(min-width:768px){ .d-cta-sub { font-size:0.95rem; margin-bottom:32px; } }
        .d-cta-btns { display:flex; gap:12px; justify-content:center; flex-wrap:wrap; }
        .d-cta-primary { background:var(--d-orange); color:#fff; border:none; border-radius:12px; padding:12px 24px; font-size:0.85rem; font-weight:700; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all 0.18s; box-shadow:0 4px 16px rgba(249,115,22,0.4); width:100%; max-width:280px; }
        @media(min-width:480px){ .d-cta-primary { padding:14px 32px; font-size:0.9rem; width:auto; } }
        .d-cta-primary:hover { background:#ea6c0a; transform:translateY(-2px); }

        .toast-container { position:fixed; bottom:16px; right:16px; left:16px; z-index:10001; display:flex; flex-direction:column; align-items:flex-end; gap:10px; pointer-events:none; box-sizing:border-box; }
        @media(min-width:480px){ .toast-container { left:auto; bottom:28px; right:24px; } }
        .toast-item { display:flex; align-items:flex-start; gap:12px; background:#fff; border-radius:14px; padding:14px 14px 14px 16px; width:100%; min-width:0; max-width:340px; box-shadow:0 8px 32px rgba(0,0,0,0.14),0 2px 8px rgba(0,0,0,0.06); border-left:4px solid #e2e8f0; pointer-events:all; position:relative; transition:all 0.3s cubic-bezier(.22,.61,.36,1); box-sizing:border-box; margin:0; }
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
        .toast-action-btn { margin-top:8px; display:inline-flex; align-items:center; gap:6px; font-size:0.75rem; font-weight:700; color:#fff; background:#F97316; border:none; border-radius:8px; padding:6px 12px; cursor:pointer; font-family:'DM Sans',sans-serif; transition:opacity 0.15s; }
        .toast-action-btn:hover { opacity:0.88; }
        .ilm-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.55); z-index:10000; display:flex; align-items:center; justify-content:center; padding:16px; backdrop-filter:blur(6px); animation:ilmFade 0.2s ease; box-sizing:border-box; }
        @media(min-width:480px){ .ilm-overlay { padding:20px; } }
        @keyframes ilmFade { from{opacity:0} to{opacity:1} }
        .ilm-modal { background:#fff; border-radius:22px; padding:28px 22px 22px; width:100%; max-width:380px; max-height:calc(100vh - 32px); overflow-y:auto; position:relative; box-shadow:0 32px 80px rgba(0,0,0,0.18); animation:ilmUp 0.3s cubic-bezier(.22,.61,.36,1); text-align:center; box-sizing:border-box; margin:0; }
        @media(min-width:480px){ .ilm-modal { border-radius:24px; padding:36px 32px 28px; max-height:calc(100vh - 40px); } }
        @keyframes ilmUp { from{opacity:0;transform:translateY(20px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        .ilm-modal-close { position:absolute; top:14px; right:14px; background:none; border:none; cursor:pointer; color:#94a3b8; width:30px; height:30px; display:flex; align-items:center; justify-content:center; border-radius:50%; transition:all 0.18s; box-sizing:border-box; padding:0; margin:0; }
        .ilm-modal-close:hover { background:#f1f5f9; color:#1E293B; }
        .ilm-modal-icon-wrap { width:56px; height:56px; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 14px; box-sizing:border-box; }
        @media(min-width:480px){ .ilm-modal-icon-wrap { width:60px; height:60px; margin:0 auto 16px; } }
        .ilm-modal-title { font-family:'Playfair Display',serif; font-size:1.1rem; font-weight:900; color:#1e0e02; margin-bottom:8px; line-height:1.3; margin-top:0; }
        @media(min-width:480px){ .ilm-modal-title { font-size:1.2rem; } }
        .ilm-modal-sub { font-size:0.8rem; color:#8a6040; line-height:1.65; margin-bottom:18px; margin-top:0; }
        @media(min-width:480px){ .ilm-modal-sub { font-size:0.82rem; margin-bottom:20px; } }
        .ilm-check-list { list-style:none; text-align:left; display:flex; flex-direction:column; gap:10px; margin-bottom:24px; padding:0 4px; margin-top:0; }
        .ilm-check-list li { display:flex; align-items:center; gap:10px; font-size:0.82rem; color:#475569; font-weight:500; margin:0; }
        .ilm-btn-primary { width:100%; padding:13px; background:linear-gradient(135deg,#F97316,#ea580c); color:#fff; border:none; border-radius:12px; font-size:0.9rem; font-weight:700; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all 0.18s; box-shadow:0 4px 16px rgba(249,115,22,0.35); margin-bottom:10px; display:block; box-sizing:border-box; }
        .ilm-btn-primary:hover { opacity:0.92; transform:translateY(-1px); }
        .ilm-btn-green { width:100%; padding:13px; background:linear-gradient(135deg,#16a34a,#15803d); color:#fff; border:none; border-radius:12px; font-size:0.9rem; font-weight:700; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all 0.18s; box-shadow:0 4px 16px rgba(22,163,74,0.35); margin-top:4px; display:block; box-sizing:border-box; }
        .ilm-btn-green:hover { opacity:0.92; transform:translateY(-1px); }
        .ilm-btn-ghost { width:100%; background:none; border:none; color:#94a3b8; font-family:'DM Sans',sans-serif; font-size:0.82rem; font-weight:600; cursor:pointer; padding:8px; transition:color 0.18s; display:block; box-sizing:border-box; margin:0; }
        .ilm-btn-ghost:hover { color:#475569; }
        .ilm-success-badge { display:inline-flex; align-items:center; gap:8px; background:rgba(22,163,74,0.1); border:1px solid rgba(22,163,74,0.25); border-radius:999px; padding:8px 18px; font-size:0.82rem; font-weight:700; color:#16a34a; margin:0 auto 20px; box-sizing:border-box; }

        .ilm-role-toast { max-width:380px; text-align:left; }
        .ilm-role-toast .ilm-modal-title, .ilm-role-toast .ilm-modal-sub { text-align:center; }
        .ilm-role-list { display:flex; flex-direction:column; gap:10px; margin-top:6px; }
        .ilm-role-option { display:flex; align-items:center; gap:12px; width:100%; padding:12px 14px; background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:12px; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all .18s; text-align:left; box-sizing:border-box; }
        .ilm-role-option:hover { border-color:#F97316; background:rgba(249,115,22,0.05); transform:translateY(-1px); }
        .ilm-role-icon { width:36px; height:36px; border-radius:10px; background:rgba(249,115,22,0.1); color:#F97316; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .ilm-role-text { display:flex; flex-direction:column; gap:2px; flex:1; }
        .ilm-role-label { font-size:0.86rem; font-weight:700; color:#1E293B; }
        .ilm-role-desc { font-size:0.74rem; color:#64748b; }
        .ilm-role-chevron { color:#94a3b8; flex-shrink:0; }
.ilm-overlay-clear { background:transparent; backdrop-filter:none; }
        .lm-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.55); z-index:10000; display:flex; align-items:center; justify-content:center; padding:16px; backdrop-filter:blur(4px); animation:lmFade 0.2s ease; box-sizing:border-box; }
        @media(min-width:480px){ .lm-overlay { padding:20px; } }
        @keyframes lmFade { from{opacity:0} to{opacity:1} }
        .lm-box { background:#fff; border-radius:18px; padding:26px 20px; width:100%; max-width:420px; max-height:calc(100vh - 32px); overflow-y:auto; position:relative; box-shadow:0 24px 64px rgba(0,0,0,0.2); animation:lmUp 0.3s ease; box-sizing:border-box; margin:0; }
        @media(min-width:480px){ .lm-box { border-radius:20px; padding:32px 28px; max-height:calc(100vh - 40px); } }
        @keyframes lmUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .lm-close { position:absolute; top:16px; right:16px; background:none; border:none; font-size:1rem; cursor:pointer; color:#94a3b8; width:28px; height:28px; display:flex; align-items:center; justify-content:center; border-radius:50%; transition:all 0.18s; box-sizing:border-box; padding:0; margin:0; }
        .lm-close:hover { background:#f1f5f9; color:#1E293B; }
        .lm-logo { font-family:'Playfair Display',serif; font-size:1.7rem; font-weight:900; text-align:center; margin-bottom:8px; cursor:pointer; }
        @media(min-width:480px){ .lm-logo { font-size:2rem; } }
        .lm-heading { text-align:center; margin-bottom:18px; }
        @media(min-width:480px){ .lm-heading { margin-bottom:20px; } }
        .lm-heading h2 { font-size:1.1rem; font-weight:700; color:#1e0e02; margin-bottom:6px; margin-top:0; }
        @media(min-width:480px){ .lm-heading h2 { font-size:1.2rem; } }
        .lm-heading p { font-size:0.82rem; color:#8a6040; margin:0; }
        @media(min-width:480px){ .lm-heading p { font-size:0.84rem; } }
        .lm-heading p button { background:none; border:none; cursor:pointer; color:#F97316; font-family:'DM Sans',sans-serif; font-size:0.84rem; font-weight:700; padding:0; margin:0; }
        .lm-heading p button:hover { text-decoration:underline; }
        .lm-google-wrap { width:100%; margin-bottom:14px; display:flex; justify-content:center; box-sizing:border-box; overflow:hidden; }
        .lm-google-wrap > div { max-width:100%; }
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

        .ilm-modal-pricing { max-width: 920px; text-align: left; padding: 28px 20px 22px; }
        @media(min-width:480px){ .ilm-modal-pricing { padding: 32px 28px 28px; } }
        .ilm-billing-toggle { display:inline-flex; align-items:center; gap:4px; background:#f1f5f9; border:1.5px solid #e2e8f0; border-radius:100px; padding:5px; margin-top:6px; box-sizing:border-box; }
        .ilm-billing-toggle span { font-size:0.78rem; font-weight:700; padding:7px 16px; border-radius:100px; cursor:pointer; color:#64748b; transition:all .2s; display:flex; align-items:center; gap:6px; box-sizing:border-box; margin:0; }
        .ilm-billing-toggle span.active { background:#1E293B; color:#fff; }
        .ilm-billing-toggle span em { font-style:normal; background:#dcfce7; color:#16a34a; font-size:0.62rem; font-weight:800; padding:2px 7px; border-radius:100px; margin:0; }
        .ilm-pricing-grid { display:grid; grid-template-columns:1fr; gap:16px; }
        @media(min-width:640px){ .ilm-pricing-grid { grid-template-columns:repeat(2,1fr); } }
        @media(min-width:900px){ .ilm-pricing-grid { grid-template-columns:repeat(3,1fr); } }
        .ilm-pricing-card { position:relative; background:#fff; border:1.5px solid #e2e8f0; border-radius:16px; padding:22px 20px; display:flex; flex-direction:column; transition:all .2s; box-sizing:border-box; margin:0; }
        .ilm-pricing-card:hover { border-color:rgba(249,115,22,0.4); box-shadow:0 8px 24px rgba(0,0,0,0.08); transform:translateY(-2px); }
        .ilm-pricing-card.popular { border-color:#F97316; box-shadow:0 4px 20px rgba(249,115,22,0.12); }
        .ilm-pricing-badge { position:absolute; top:-12px; left:50%; transform:translateX(-50%); background:#F97316; color:#fff; font-size:0.65rem; font-weight:800; padding:4px 14px; border-radius:100px; white-space:nowrap; margin:0; box-sizing:border-box; }
        .ilm-pricing-name { font-size:0.7rem; font-weight:800; letter-spacing:0.1em; text-transform:uppercase; margin-bottom:10px; margin-top:0; }
        .ilm-pricing-price { font-size:1.7rem; font-weight:900; color:#1E293B; font-family:'Playfair Display',serif; margin:0; }
        @media(min-width:480px){ .ilm-pricing-price { font-size:1.9rem; } }
        .ilm-pricing-price span { font-size:1rem; font-weight:700; margin-right:2px; }
        .ilm-pricing-period { font-size:0.72rem; color:#94a3b8; margin-bottom:10px; margin-top:0; }
        .ilm-pricing-desc { font-size:0.78rem; color:#64748b; line-height:1.5; margin-bottom:16px; min-height:40px; margin-top:0; }
        .ilm-pricing-cta { margin-top:auto; width:100%; padding:11px; border:none; border-radius:10px; color:#fff; font-size:0.82rem; font-weight:700; cursor:pointer; font-family:'DM Sans',sans-serif; transition:opacity .18s, transform .12s; box-sizing:border-box; }
        .ilm-pricing-cta:hover { opacity:0.9; transform:translateY(-1px); }

        /* ── Hub preview pages (Student/Trainer/Manager Hub) embed fix ──────────
           StudentHub/TrainerHub/ManagerHub ko chhua nahi — yeh sirf unke root
           wrapper (PublicLayout) ke forced height:100vh / apne overflow-y ko,
           bahar se neutralize karta hai, taaki woh /ilm-demo ke already-scrolling
           shell ke andar apna DOOSRA scroll container na banaye. Result: sirf EK
           scrollbar, aur hero/footer ka spacing bhi page ke natural content flow
           se aata hai (fake 100vh calculation se nahi). */
        .ilm-hub-embed { overflow: visible; }
.ilm-hub-embed > * {
  min-height: 0 !important;
  height: auto !important;
  max-height: none !important;
  overflow-y: visible !important;
  overflow-x: visible !important;
}

        /* ── Extra-large desktop / large iMac / ultra-wide refinement ── */
        @media(min-width:1600px){
          .d-section-inner, .d-hero { max-width:1360px; }
        }
      `}</style>

      <div className="d-page" data-theme={theme}>
        {/* ═══ MODALS ═══ */}
        {showLogin && (
          <LoginModal
            onClose={() => setShowLogin(false)}
            onGoogleSuccess={handleGoogleNewUser}
            onAuthenticated={() => setHasRealSession(true)}
          />
        )}

        {showRolePopup && (
          <RoleSelectToast
            onSelect={handleRoleChosen}
            onSkip={handleRoleSkip}
          /> // Step 4
        )}

        {/* Step 5 welcome popup intentionally removed — role selection now
            goes straight to the role-based dashboard (Step 6). */}

        {/* Steps 7→10 gate modals */}
        {showProfileModal && (
          <ProfileIncompleteModal
            onClose={() => setShowProfileModal(false)}
            onCompleteProfile={handleProfileModalComplete}
          />
        )}
        {showSuccessModal && (
          <SuccessModal
            onClose={() => setShowSuccessModal(false)}
            onGoToDashboard={() => setShowSuccessModal(false)}
          />
        )}

        <nav className="d-nav d-reset-scope">
          <div
            className="flex items-center cursor-pointer hover:scale-105 transition-transform flex-shrink-0"
            onClick={() => navigate("/")}
          >
            <span className="text-[22px] sm:text-[28px] md:text-[32px] font-extrabold tracking-wide font-serif leading-none whitespace-nowrap">
              <span className="text-green-600">ILM</span>{" "}
              <span className="text-[#F97316] ml-1">ORA</span>
              <span className="inline-flex items-center bg-orange-50 border border-[#F97316] rounded ml-1.5 px-1.5 py-0.5 text-[0.42rem] sm:text-[0.45rem] md:text-[0.5rem] font-sans font-semibold tracking-widest text-[#F97316] uppercase leading-snug align-middle">
                Beta
              </span>
            </span>
          </div>

          <div className="d-nav-links">
            <button
              className="d-nav-link"
              onClick={goToAllCourses}
            >
              All Courses
            </button>
            {/* ILM ORA Feature — click-toggle dropdown.
                Each item opens its corresponding Student, Trainer or Manager Hub page. */}
            <div className="d-nav-dropdown" ref={featureMenuRef}>
              <button
                type="button"
                className="d-nav-link"
                onClick={(e) => {
                  e.stopPropagation();
                  setFeatureMenuOpen((o) => !o);
                }}
              >
                ILM ORA Feature
                <ChevronDown
                  size={14}
                  className={`d-nav-dropdown-chevron ${featureMenuOpen ? "open" : ""}`}
                  style={{ marginLeft: 4 }}
                />
              </button>
              <div className={`d-nav-dropdown-menu ${featureMenuOpen ? "open" : ""}`}>
                {HUB_MENU_ITEMS.map((item) => {
                  const ItemIcon = NAV_ICON_MAP[item.icon];
                  return (
                    <button
                      key={item.key}
                      className="d-nav-dropdown-item"
                      onClick={() => goToHub(item.key)}
                    >
                      <ItemIcon
                        size={18}
                        className="d-nav-dropdown-item-icon"
                        color={HUB_ICON_COLORS[item.key]}
                      />
                      <div>
                        <div className="d-nav-dropdown-item-title">{item.title}</div>
                        <div className="d-nav-dropdown-item-desc">{item.description}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Product dropdown — ILM ORA Meet, AI Resume Builder and Workspace.
                Uses the same click-toggle and outside-click behavior as the
                ILM ORA Feature dropdown. Each item opens its actual production route. */}
            <div className="d-nav-dropdown" ref={productMenuRef}>
              <button
                type="button"
                className="d-nav-link"
                onClick={(e) => {
                  e.stopPropagation();
                  setProductMenuOpen((o) => !o);
                }}
              >
                Product
                <ChevronDown
                  size={14}
                  className={`d-nav-dropdown-chevron ${productMenuOpen ? "open" : ""}`}
                  style={{ marginLeft: 4 }}
                />
              </button>
              <div className={`d-nav-dropdown-menu ${productMenuOpen ? "open" : ""}`}>
                {PRODUCT_MENU_ITEMS.map((item) => {
                  const ItemIcon = NAV_ICON_MAP[item.icon];
                  return (
                    <button
                      key={item.key}
                      className="d-nav-dropdown-item"
                      onClick={() => {
                        setProductMenuOpen(false);
                        goToProductSection(item.key);
                      }}
                    >
                      <ItemIcon
                        size={18}
                        className="d-nav-dropdown-item-icon"
                        color={PRODUCT_ICON_COLORS[item.key]}
                      />
                      <div>
                        <div className="d-nav-dropdown-item-title">{item.title}</div>
                        <div className="d-nav-dropdown-item-desc">{item.description}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mentors / Success Stories — same labels as the public
                Navbar. /ilm-demo has no #mentors/#successstories sections
                of its own, so (matching PublicLayout's existing fallback
                convention) these send the visitor to the homepage
                section, same as every other page without that content. */}
            <button className="d-nav-link" onClick={() => navigate("/#mentors")}>
              Mentors
            </button>
            <button className="d-nav-link" onClick={() => navigate("/#successstories")}>
              Success Stories
            </button>
          </div>

         <div className="d-nav-right">
  {/* Notification Bell */}
  {isLoggedIn && (
    <NotificationBell roleOverride={featureRoleKey} />
  )}

  <button
    className="d-theme-toggle"
    onClick={toggleTheme}
    aria-label="Toggle theme"
  >
    {isDark ? <Sun size={18} /> : <Moon size={18} />}
  </button>

            {isLoggedIn ? (
              <div className="d-user-menu-wrap" ref={userMenuRef}>
                <div
                  className="d-user-trigger"
                  onClick={() => setUserMenuOpen((o) => !o)}
                >
                  <div className="d-user-avatar">{userInitial}</div>
                  <ChevronRight
                    size={14}
                    className="d-user-arrow"
                    style={{
                      transform: userMenuOpen
                        ? "rotate(-90deg)"
                        : "rotate(90deg)",
                    }}
                  />
                </div>
                <div
                  className={`d-user-dropdown ${userMenuOpen ? "open" : ""}`}
                >
                  <div className="d-user-dropdown-header">
                    <div className="d-user-dropdown-name">{userName}</div>
                    <div className="d-user-dropdown-email">{userEmail}</div>
                  </div>
                  <div className="d-user-dropdown-divider" />
                  <button
                    className="d-user-dropdown-item"
                    onClick={() => {
                      setUserMenuOpen(false);
                      goToDashboard();
                    }}
                  >
                    <LayoutDashboard size={16} /> Go to Dashboard
                  </button>
                  <button
                    className="d-user-dropdown-item"
                    onClick={() => {
                      setUserMenuOpen(false);
                      goToProfile();
                    }}
                  >
                    <User size={16} /> Profile
                  </button>
                 <button
                    className={`d-user-dropdown-item${hasUsedRoleChange() ? " disabled" : ""}`}
                    onClick={() => {
                      setUserMenuOpen(false);
                      if (hasUsedRoleChange()) {
                        addToast({
                          type: "warning",
                          title: "Role Changes Exhausted",
                          desc: `You've used all ${MAX_ROLE_CHANGES} role changes. Your role is now locked.`,
                        });
                        return;
                      }
                      goToProfile("role");
                    }}
                  >
                    {hasUsedRoleChange() ? <Lock size={16} /> : <UserCog size={16} />} Swap Role
                  </button>
                  <button
                    className="d-user-dropdown-item"
                    onClick={() => {
                      setUserMenuOpen(false);
                      goToProfile("password");
                    }}
                  >
                    <Settings size={16} /> Change Password
                  </button>
                  <div className="d-user-dropdown-divider" />
                  <button
                    className="d-user-dropdown-item signout"
                    onClick={handleSignOut}
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <button
                className="d-btn-signup"
                onClick={() => setShowLogin(true)}
              >
                Get Started
              </button>
            )}

            <button
              className="d-nav-hamburger"
              onClick={() => setMobileNavOpen((o) => !o)}
              aria-label="Toggle navigation menu"
            >
              {mobileNavOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

          {/* Full-screen mobile / tablet nav overlay — shown below 1024px */}
          <div className={`d-nav-links-mobile ${mobileNavOpen ? "open" : ""}`}>
            {/* Header — logo + close button, matches the full-screen menu design */}
            <div className="d-mobile-menu-header">
              <span className="d-mobile-menu-logo">
                <span className="text-green-600">ILM</span>{" "}
                <span className="text-[#F97316] ml-1">ORA</span>
                <span className="inline-flex items-center bg-orange-50 border border-[#F97316] rounded ml-1.5 px-1.5 py-0.5 text-[0.42rem] font-sans font-semibold tracking-widest text-[#F97316] uppercase leading-snug align-middle">
                  Demo
                </span>
              </span>
              <button
                type="button"
                className="d-mobile-menu-close"
                onClick={() => setMobileNavOpen(false)}
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            <div className="d-mobile-menu-body">
              <button
                className="d-nav-link"
                onClick={() => {
                  setMobileNavOpen(false);
                  goToAllCourses();
                }}
              >
                <GraduationCap size={18} color="#16a34a" />
                All Courses
              </button>

              <div className="d-mobile-menu-divider" />

              {/* ILM ORA Feature — collapsible accordion, same items/handler
                  (goToHub) as the desktop dropdown. */}
              <button
                type="button"
                className="d-mobile-section-header"
                onClick={() => setMobileFeatureOpen((o) => !o)}
              >
                ILM ORA Feature
                <ChevronDown
                  size={18}
                  className={`d-mobile-section-chevron ${mobileFeatureOpen ? "open" : ""}`}
                />
              </button>
              {mobileFeatureOpen && (
                <div className="d-mobile-section-items">
                  {HUB_MENU_ITEMS.map((item) => {
                    const ItemIcon = NAV_ICON_MAP[item.icon];
                    return (
                      <button
                        key={item.key}
                        className="d-mobile-section-item"
                        onClick={() => {
                          setMobileNavOpen(false);
                          goToHub(item.key);
                        }}
                      >
                        <span className="d-mobile-section-item-icon">
                          <ItemIcon size={20} color={HUB_ICON_COLORS[item.key]} />
                        </span>
                        <span>
                          <span className="d-mobile-section-item-title">
                            {item.title}
                          </span>
                          <span className="d-mobile-section-item-desc">
                            {item.description}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="d-mobile-menu-divider" />

              {/* Product — collapsible accordion, same items/handler
                  (goToProductSection) as the desktop dropdown. */}
              <button
                type="button"
                className="d-mobile-section-header"
                onClick={() => setMobileProductOpen((o) => !o)}
              >
                Product
                <ChevronDown
                  size={18}
                  className={`d-mobile-section-chevron ${mobileProductOpen ? "open" : ""}`}
                />
              </button>
              {mobileProductOpen && (
                <div className="d-mobile-section-items">
                  {PRODUCT_MENU_ITEMS.map((item) => {
                    const ItemIcon = NAV_ICON_MAP[item.icon];
                    return (
                      <button
                        key={item.key}
                        className="d-mobile-section-item"
                        onClick={() => {
                          setMobileNavOpen(false);
                          goToProductSection(item.key);
                        }}
                      >
                        <span className="d-mobile-section-item-icon">
                          <ItemIcon size={20} color={PRODUCT_ICON_COLORS[item.key]} />
                        </span>
                        <span>
                          <span className="d-mobile-section-item-title">
                            {item.title}
                          </span>
                          <span className="d-mobile-section-item-desc">
                            {item.description}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="d-mobile-menu-divider" />

              {/* Mentors / Success Stories — same /#mentors, /#successstories
                  convention as the desktop nav links above. */}
              <button
                className="d-nav-link"
                onClick={() => {
                  setMobileNavOpen(false);
                  navigate("/#mentors");
                }}
              >
                <Star size={18} color="#a855f7" />
                Mentors
              </button>
              <button
                className="d-nav-link"
                onClick={() => {
                  setMobileNavOpen(false);
                  navigate("/#successstories");
                }}
              >
                <Trophy size={18} color="#eab308" />
                Success Stories
              </button>
            </div>

            {/* Footer — user profile + Go to Dashboard + Sign out (logged in),
                or Get Started (logged out). Same handlers as the desktop
                avatar dropdown, unchanged. */}
            {isLoggedIn ? (
              <div className="d-mobile-user-block">
                <div className="d-mobile-user-row">
                  <div className="d-mobile-user-avatar">{userInitial}</div>
                  <div>
                    <div className="d-mobile-user-name">{userName}</div>
                    <div className="d-mobile-user-email">{userEmail}</div>
                  </div>
                </div>
                <button
                  className="d-mobile-user-action"
                  onClick={() => {
                    setMobileNavOpen(false);
                    goToDashboard();
                  }}
                >
                  <ArrowRight size={18} />
                  Go to Dashboard
                </button>
                <button
                  className="d-mobile-user-action signout"
                  onClick={() => {
                    setMobileNavOpen(false);
                    handleSignOut();
                  }}
                >
                  <LogOut size={18} />
                  Sign out
                </button>
              </div>
            ) : (
              <div className="d-mobile-user-block">
                <button
                  className="d-btn-signup"
                  style={{ width: "100%", justifyContent: "center" }}
                  onClick={() => {
                    setMobileNavOpen(false);
                    setShowLogin(true);
                  }}
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* {isLoggedIn && !showProfile && (
          <IlmDemoSidebar roleOverride={featureRoleKey} onNavigate={goToFeature} />
        )} */}
        {isLoggedIn &&
          !showProfile &&
          !showRolePopup &&
          !showInterestPopup &&
          hasRole && (
            <IlmDemoSidebar
              roleOverride={featureRoleKey}
              onNavigate={goToSection}
              activeSection={activeSection}
              theme={theme}
              sidebarMode={sidebarMode}
              setSidebarMode={setSidebarMode}
            />
          )}
        {showInterestPopup ? (
          <div className="d-reset-scope">
            <InterestSelectInline
              options={INTEREST_CONFIG[selectedRole] || INTEREST_CONFIG.student}
              onSelect={handleInterestChosen}
              onSkip={handleInterestSkip}
            />
          </div>
        ) : showProfile ? (
          <div
            style={{
              width: "100%",
              boxSizing: "border-box",
              overflowX: "hidden",
            }}
          >
            <IlmDemoProfilePage
              roleOverride={featureRoleKey}
              onProfileComplete={handleProfileCompleted}
              scrollTarget={profileScrollTarget}
            />
          </div>
        ) : isLoggedIn && hasRole ? (
          // ═══ REAL PRODUCTION CONTENT ═══
          // Whatever ContentComponent resolved to above — the role's real
          // dashboard with no section selected, or the real page behind
          // whichever sidebar item was clicked — renders right here, inside
          // this page's own header/sidebar. We never navigate to
          // /student/*, /trainer/*, or /admin/*; the URL stays /ilm-demo.
          <div
            className={
              isAllCoursesSection
                ? "d-sidebar-offset ilm-hub-embed"
                : "d-reset-scope d-sidebar-offset"
            }
            style={{
              marginLeft: contentOffset,
              transition: "margin-left 0.28s ease",
            }}
          >
            <Suspense fallback={<IlmDemoContentLoading />}>
              {ContentComponent ? (
                <ContentComponent theme={theme} toggleTheme={toggleTheme} />
              ) : isAllCoursesSection ? (
                <AllCoursesPage
                  theme={theme}
                  toggleTheme={toggleTheme}
                  setShowLoginModal={setShowLogin}
                  embedded
                />
              ) : HubComponent ? (
                <div className="ilm-hub-embed">
                  <HubComponent
                    theme={theme}
                    toggleTheme={toggleTheme}
                    setShowLoginModal={setShowLogin}
                    scrollToSection={scrollToId}
                  />
                </div>
              ) : (
                <IlmDemoSectionContent
                  section={activeSection}
                  onBack={() =>
                    goToSection(ROLE_HOME_PATH[featureRoleKey] || "/student")
                  }
                />
              )}
            </Suspense>
          </div>
        ) : (
          <div className="d-reset-scope d-sidebar-offset">
            {/* ═══ HERO ═══ */}

            {/* ═══ HERO ═══ */}
            <div className="d-hero-wrap">
              <div className="d-hero" ref={heroRef}>
                <div className="d-hero-content">
                  <div className="d-hero-welcome">
                    <div className="d-hero-greeting">
                      <span>👋</span> {greeting}
                    </div>
                    <div className="d-hero-name">
                      Welcome back, <span className="ora">{userName}</span>
                    </div>
                    <div className="d-hero-subtitle">
                      Your AI-powered learning hub is ready. Pick up where you
                      left off.
                    </div>
                  </div>
                  <h1 className="d-hero-title">
                    Become the <span className="ora">Top 1%</span>
                    <br />
                    with <span className="ilm">ILM</span>{" "}
                    <span className="ora">ORA</span>
                  </h1>
                  <div className="d-hero-typing">
                    <TypeWriter
                      className="d-typewriter"
                      texts={[
                        "Start today. Stay consistent.",
                        "Your next milestone awaits.",
                        "Learning compounds. Keep going.",
                        "Top 1% is a daily choice.",
                        "Built for ambitious professionals.",
                      ]}
                      typingSpeed={70}
                      deletingSpeed={40}
                      pauseDuration={1800}
                      showCursor
                      cursorCharacter="_"
                      cursorBlinkDuration={0.5}
                    />
                  </div>
                  <div className="d-hero-btns">
                    {!isLoggedIn && (
                      <button
                        className="ilm-btn-primary"
                        style={{ width: "auto", padding: "12px 28px" }}
                        onClick={() => setShowLogin(true)}
                      >
                        Get Started
                      </button>
                    )}
                    {isLoggedIn && !hasRole && !showRolePopup && (
                      <button
                        className="ilm-btn-primary"
                        style={{ width: "auto", padding: "12px 28px" }}
                        onClick={() => setShowRolePopup(true)}
                      >
                        Choose Your Role
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {!showRolePopup && !showInterestPopup && (
              <>
                {/* ═══ FEATURES ═══ */}
                <section className="d-section" ref={featuresRef} id="features">
                  <div className="d-section-inner">
                    <div className="d-section-head">
                      <div className="d-section-tag">Platform Features</div>
                      <h2 className="d-section-title">
                        {(() => {
                          const words = roleConfig.title.split(" ");
                          const accent = words.pop();
                          return (
                            <>
                              {words.join(" ")}{" "}
                              <span className="accent">{accent}</span>
                            </>
                          );
                        })()}
                      </h2>
                      <p className="d-section-sub">
                        A quick look at everything available to you on the
                        platform
                      </p>
                    </div>
                    <div className="d-features-grid">
                      {roleConfig.features.map((f, idx) => {
                        const color = ICON_COLORS[idx % ICON_COLORS.length];
                        return (
                          <div key={f.name} className="d-feature-card">
                            {f.badge && (
                              <span className="d-feature-badge">{f.badge}</span>
                            )}
                            <div
                              className="d-feature-icon"
                              style={{ background: `${color}18`, color }}
                            >
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
                <section
                  className="d-section d-section-alt"
                  ref={toolsRef}
                  id="tools"
                >
                  <div className="d-section-inner">
                    <div className="d-section-head">
                      <div className="d-section-tag">Texora Products</div>
                      <h2 className="d-section-title">
                        Explore Our <span className="accent">Products</span>
                      </h2>
                      <p className="d-section-sub">
                        Powerful AI products built by Texora — click to explore
                      </p>
                    </div>
                    <div className="d-tools-track-wrap" ref={toolsScrollRef}>
                      <div className="d-tools-grid">
                        {[...TOOLS, ...TOOLS].map((t, i) => (
                          <div
                            key={t.key + "-" + i}
                            className="d-tool-card"
                            onClick={() => window.open(t.route, "_blank")}
                          >
                            <div
                              className="d-tool-icon"
                              style={{
                                background: "#f8fafc",
                                padding: 0,
                                overflow: "hidden",
                              }}
                            >
                              <img
                                src={`/images/${t.icon}.jpeg`}
                                alt={t.icon}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "contain",
                                  borderRadius: "8px",
                                  padding: "2px 6px",
                                }}
                              />
                            </div>
                            <div className="d-tool-desc">{t.desc}</div>
                            <div className="d-tool-tags">
                              {t.tags.map((tag, ti) => (
                                <span
                                  key={tag + ti}
                                  className={`d-tool-tag ${ti === 1 ? "green" : ""}`}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <div className="d-tool-cta">
                              <button className="d-tool-try">Try Free →</button>
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
                    <div className="d-cta-title">
                      Ready to Transform Your Career?
                    </div>
                    <p className="d-cta-sub">
                      Be among the first to learn with ILM ORA — join our
                      growing community
                    </p>
                    <div className="d-cta-btns">
                      {!isLoggedIn && (
                        <button
                          className="d-cta-primary"
                          onClick={() => setShowLogin(true)}
                        >
                          Get Started
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
        {/* Hub preview pages (Student/Trainer/Manager Hub) and the All
            Courses page bring their own footer via PublicLayout — don't
            stack the ilm-demo Footer under them too. */}
        {!activeHubKey && !isAllCoursesSection && (
          <div
            className="d-sidebar-offset"
            style={
              isLoggedIn &&
              !showProfile &&
              !showRolePopup &&
              !showInterestPopup &&
              hasRole
                ? { marginLeft: contentOffset, transition: "margin-left 0.28s ease" }
                : undefined
            }
          >
            <Footer scrollToSection={(id) => scrollToId(id)} />
          </div>
        )}

        {/* ═══ MULTI-TOAST ═══ */}
        <ToastContainer toasts={toasts} />

        {isLoggedIn &&
  hasRole &&
  !showRolePopup &&
  !showInterestPopup &&
  featureRoleKey === "student" && <ChatWidgetButton />}
      </div>
    </>
  );
}