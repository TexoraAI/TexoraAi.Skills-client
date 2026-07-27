import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Link2,
  CalendarClock,
  ShieldCheck,
  ClipboardCheck,
  KeyRound,
  PlayCircle,
  Clock,
  CalendarPlus,
  PlusCircle,
  ClipboardList,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// ✅ Same shared shell used by every other public page (Careers, ManagerHub,
// ILM ORA Meet, About, Pricing, Contact, FAQ, ResumeBuilderLanding,
// StudentHub, etc). Lives at src/pages/Landing/components/PublicLayout —
// since this file lives directly inside src/pages/Landing/, the relative
// path is "./components/...".
//
// PublicLayout owns nothing more than forwarding setShowLoginModal to
// Navbar (see below) — it does NOT render a login modal itself. Pages don't
// build their own login UI... except they actually do: each page (e.g.
// LMSHomepage.jsx) owns its own showLoginModal state + its own modal JSX,
// and just hands the setter to PublicLayout so Navbar's "Get Started"
// button can flip it on too. This file follows the same pattern — see
// LoginModal below.
import PublicLayout from "./components/PublicLayout";

// Same backend call AdminMeetings.jsx uses to verify a join code before
// letting anyone into /workspace/:code. Adjust the relative path if this
// file's folder depth ever changes (this assumes services/ lives at
// src/services/, i.e. two levels up from src/pages/Landing/).
import { validateMeetingJoinCode } from "../../services/liveSessionService";

// ── PublicLayout does NOT render a login modal itself — it only forwards
//    setShowLoginModal down to Navbar so the "Get Started" button can toggle
//    it. The actual modal has to be rendered by the page (exactly how
//    LMSHomepage.jsx does it: its own showLoginModal state + its own modal
//    JSX at the bottom, with the setter also handed to PublicLayout). ──
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import auth from "../../auth";
import authService from "../../services/authService";
import { registerFcmToken } from "../../services/firebaseService";

// ── Carousel illustrations. These live in src/assets/ (two levels up from
//    src/pages/Landing/, same as the other asset imports in this project). ──
import shareLinkImg from "../../assets/share-link.png";
import scheduleSessionsImg from "../../assets/schedule-sessions.png";
import verifySessionsImg from "../../assets/verify-sessions.png";
import attendanceTrackingImg from "../../assets/attendance-tracking.png";
import workspaceDemoVideo from "../../assets/workspace-demo.mp4";
// Photo used in the final "Bring your first session into ILM ORA" CTA band —
// sits on the left of the card, same layout idea as the "Ready to Transform
// Your Career?" CTA banner (colored photo left, heading/copy right).
import ctaPersonImg from "../../assets/cta-photo.avif";

const GOOGLE_CLIENT_ID =
  "572421778240-akk3kkb4f60ukuv9pcfrpg2ielm09thk.apps.googleusercontent.com";

/* ─────────────────────────────────────────────────────────────────
   ILMORA MEETINGS — LANDING PAGE (workspace.jsx)
   Same visual system as ResumeBuilderLanding / ILMORALanding:
   - shared Navbar + Footer via PublicLayout
   - light/dark theme (falls back to local state if not passed in)
   - same font stack: Sora (headings) + Plus Jakarta Sans (body)
───────────────────────────────────────────────────────────────── */

const ORANGE = "#f97316";
const GREEN = "#16a34a";
const DARK = "#0f172a";

const SLIDES = [
  {
    tag: "Share",
    title: "Share a session link",
    body: "Start a new meeting to get a link you can send to trainers and students you want in the class.",
    variant: "link",
    Icon: Link2,
    image: shareLinkImg,
  },
  {
    tag: "Schedule",
    title: "Plan sessions ahead",
    body: "Create a new meeting to schedule sessions on the batch calendar and notify participants in advance.",
    variant: "schedule",
    Icon: CalendarClock,
    image: scheduleSessionsImg,
  },
  {
    tag: "Verify",
    title: "Every session is verified",
    body: "No one can join a session unless invited or admitted by the trainer or admin.",
    variant: "verified",
    Icon: ShieldCheck,
    image: verifySessionsImg,
  },
  {
    tag: "Track",
    title: "Attendance, automatically",
    body: "Every join and leave is logged automatically for trainers, batches, and admins — no manual roll call.",
    variant: "attendance",
    Icon: ClipboardCheck,
    image: attendanceTrackingImg,
  },
];

/* CSS custom properties per theme — every surface in CSS below (.card,
   .border, .muted, .ink, .bg) reads from these, so the whole page re-themes
   just by swapping this object on the wrapper's inline style. */
const THEME_VARS = {
  light: {
    "--bg": "#f7e9da",
    "--card": "#ffffff",
    "--border": "#e7ddcd",
    "--ink": "#111111",
    "--muted": "#6b5f78",
  },
  dark: {
    "--bg": "#000000",
    "--card": "#111827",
    "--border": "#374151",
    "--ink": "#ffffff",
    "--muted": "#9ca3af",
  },
};

/* ─────────────────────────────────────────────────────────────────
   Login modal — real Google Sign-In + email/password + role-based
   redirect, same auth flow as LMSHomepage.jsx / TexoraLogin (/login).
   This is what actually appears when showLoginModal is true — the
   page owns this, Navbar (via PublicLayout) only owns the setter that
   flips it on.
───────────────────────────────────────────────────────────────── */
function LoginModal({ onClose }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const redirectByRole = (role) => {
    switch ((role || "").toUpperCase()) {
      case "SUPER_ADMIN":
        navigate("/superadmin", { replace: true });
        break;
      case "ADMIN":
        navigate("/admin", { replace: true });
        break;
      case "TENANT_ADMIN":
        navigate("/admin", { replace: true });
        break;
      case "BUSINESS":
        navigate("/admin", { replace: true });
        break;
      case "TRAINER":
        navigate("/trainer", { replace: true });
        break;
      default:
        navigate("/student", { replace: true });
    }
  };

  const tryRegisterFcm = () => {
    if (Notification.permission === "granted") {
      registerFcmToken().catch(console.error);
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
          })
        );
        tryRegisterFcm();
        onClose();
        redirectByRole(role);
      } else {
        alert("Login failed! Check your credentials.");
      }
    } catch (err) {
      alert(err?.response?.data?.message || err?.message || "Login error");
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
      const check = await authService.checkGoogleUser({
        idToken: res.credential,
      });

      if (check.isNewUser === false && check.token && check.role) {
        const role = check.role.toUpperCase();
        localStorage.setItem("lms_token", check.token);
        localStorage.setItem("role", role);
        if (check.organizationId) {
          localStorage.setItem("organizationId", check.organizationId);
        } else {
          localStorage.removeItem("organizationId");
        }
        localStorage.setItem(
          "lms_user",
          JSON.stringify({
            name: check.name || dec.name,
            email: check.email || dec.email,
            role: ["TENANT_ADMIN", "ADMIN", "BUSINESS"].includes(role)
              ? "admin"
              : role.toLowerCase(),
            isGoogleUser: true,
            profileCompleted: true,
            organizationId: check.organizationId || null,
          })
        );
        tryRegisterFcm();
        onClose();
        redirectByRole(role);
        return;
      }

      sessionStorage.setItem("ilmora_google_credential", res.credential);
      onClose();
      navigate("/complete-profile", {
        replace: true,
        state: {
          name: dec.name,
          email: dec.email,
          googleCredential: res.credential,
          isGoogleUser: true,
          fromGoogleLogin: true,
        },
      });
    } catch (err) {
      alert(err?.response?.data?.message || err?.message || "Login failed");
    }
  };

  const handleGoogleError = () => console.error("Google OAuth failed");

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div
        className="wsLoginModal"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <style>{LOGIN_MODAL_CSS}</style>
        <div className="wslm-card">
          <button className="wslm-close" onClick={onClose} aria-label="Close">
            ✕
          </button>

          <div className="wslm-logo">
            <span className="wslm-ilm">ILM</span>
            <span className="wslm-ora">ORA</span>
          </div>
          <h2 className="wslm-title">Welcome back!</h2>
          <p className="wslm-sub">Sign in with Google to get started, or use your email below.</p>

          <div className="wslm-google-wrap">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              text="continue_with"
              shape="rectangular"
              width="340"
              auto_select={false}
              cancel_on_tap_outside={true}
            />
          </div>

          <div className="wslm-or-div">
            <div className="wslm-or-line" />
            <span className="wslm-or-text">OR</span>
            <div className="wslm-or-line" />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="wslm-field">
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
            <div className="wslm-field">
              <label>Password</label>
              <div className="wslm-pw-wrap">
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
                  className="wslm-eye-btn"
                  onClick={() => setShowPassword((p) => !p)}
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <EyeOpen size={16} />}
                </button>
              </div>
            </div>
            <div className="wslm-forgot-row">
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
            <button type="submit" className="wslm-submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="wslm-spinner" />
                  Signing in…
                </>
              ) : (
                "Log in"
              )}
            </button>
          </form>

          <div className="wslm-back">
            <button onClick={onClose}>← Back to home</button>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

function EyeOpen({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOff({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

export default function IlmoraMeetingsLanding({ theme, toggleTheme, scrollToSection }) {
  const navigate = useNavigate();

  // Falls back to its own light/dark state if no theme is passed down from
  // App.jsx, so this page still works if it's ever mounted standalone.
  const [localTheme, setLocalTheme] = useState("light");
  const activeTheme = theme || localTheme;
  const handleToggleTheme =
    toggleTheme || (() => setLocalTheme((t) => (t === "dark" ? "light" : "dark")));

  const [active, setActive] = useState(0);
  const timerRef = useRef(null);

  // Same as every other public page: own this bit of state and hand the
  // setter down to PublicLayout, which owns the actual "Get Started" login
  // modal (Google + email/password) — same modal StudentHub.jsx's "Get
  // Started" button opens. No modal markup lives in this file.
  const [showLoginModal, setShowLoginModal] = useState(false);

  const [joinCode, setJoinCode] = useState("");
  const [joinError, setJoinError] = useState("");
  const [joining, setJoining] = useState(false);
  const [newMeetingOpen, setNewMeetingOpen] = useState(false);
  const newMeetingRef = useRef(null);

  /* ── carousel autoplay ── */
  const go = (i) => setActive(((i % SLIDES.length) + SLIDES.length) % SLIDES.length);

  const startAuto = () => {
    stopAuto();
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
  };
  const stopAuto = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => {
    startAuto();
    return stopAuto;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── fallback smooth-scroll if App.jsx doesn't hand one down ── */
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.pageYOffset - 80;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  // Opens PublicLayout's real login modal — same "Get Started" flow as
  // every other public page (StudentHub.jsx included). No modal markup
  // lives in this file.
  const openLoginModal = () => setShowLoginModal(true);

  // Closes the "New meeting" dropdown when clicking anywhere outside it.
  useEffect(() => {
    if (!newMeetingOpen) return;
    const onDocClick = (e) => {
      if (newMeetingRef.current && !newMeetingRef.current.contains(e.target)) {
        setNewMeetingOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [newMeetingOpen]);

  // Accepts either a bare code ("JAVA-482K") or a full link someone pasted
  // (e.g. "https://ilmora.app/workspace/JAVA-482K" or ".../ilmorameet/JAVA-482K")
  // and returns just the join code.
  const extractJoinCode = (raw) => {
    const value = raw.trim();
    if (!value) return "";
    if (!/^https?:\/\//i.test(value) && !value.includes("/")) return value;
    try {
      const withScheme = /^https?:\/\//i.test(value) ? value : `https://${value}`;
      const url = new URL(withScheme);
      const segments = url.pathname.split("/").filter(Boolean);
      return segments.length ? segments[segments.length - 1] : value;
    } catch {
      // Not a valid URL — fall back to the last "/"-separated segment.
      const segments = value.split("/").filter(Boolean);
      return segments.length ? segments[segments.length - 1] : value;
    }
  };

  // Same flow as AdminMeetings.jsx's handleJoinByCode(): hit the backend to
  // check the code is real/live BEFORE navigating anywhere. The old version
  // here just navigated on any non-empty string, so a wrong or expired code
  // still dropped the user onto /workspace/:code with nothing to join.
  const handleJoinByCode = async () => {
    const code = extractJoinCode(joinCode);
    if (!code) {
      setJoinError("Enter a valid session code or link to continue.");
      return;
    }
    setJoining(true);
    setJoinError("");
    try {
      const res = await validateMeetingJoinCode(code);
      if (res?.data?.valid) {
        navigate(`/workspace/${encodeURIComponent(code)}`);
      } else {
        setJoinError(res?.data?.message || "Invalid or expired session code.");
      }
    } catch (err) {
      setJoinError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Invalid or expired session code."
      );
    } finally {
      setJoining(false);
    }
  };

  // ── BUG FIX ──────────────────────────────────────────────────────
  // This used to be hardcoded to THEME_VARS.light no matter what, which is
  // why light/dark theme never actually applied on this page — the CSS
  // vars (--bg, --card, --ink, --muted) were frozen to the light palette
  // regardless of activeTheme. Now it picks the palette that matches the
  // real site-wide theme (falling back to light if activeTheme is missing
  // or unrecognized), so dark mode actually works here like every other
  // page.
  const vars = THEME_VARS[activeTheme] || THEME_VARS.light;

  return (
    <PublicLayout
      theme={activeTheme}
      toggleTheme={handleToggleTheme}
      setShowLoginModal={setShowLoginModal}
      scrollToSection={scrollToSection || scrollTo}
    >
      <div className="ilmoraMeetingsPage" style={vars}>
        <style>{CSS}</style>

        {/* HERO */}
        <header className="hero">
          <div>
            <div className="eyebrow"><span className="eyebrow-dot"></span> NEW · Meetings</div>
            <h1>
              Live sessions, <em className="word-orange">verified</em> and <em className="word-green">logged</em> — without a second tool.
            </h1>
            <p>
              Start a session, share one link, and let ILMORA handle who gets in and who
              showed up. Meetings lives right next to your batches, so nothing needs
              re-explaining to trainers or students.
            </p>
            <div className="hero-ctas">
              <div className="join-by-code">
                <span className="join-by-code-icon" aria-hidden="true">
                  <KeyRound size={15} />
                </span>
                <input
                  type="text"
                  placeholder="Enter session code"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleJoinByCode()}
                  disabled={joining}
                />
                <button
                  className="btn-primary join-inline-btn"
                  disabled={!joinCode.trim() || joining}
                  onClick={handleJoinByCode}
                >
                  {joining ? "Checking…" : "Join"}
                </button>
              </div>

              <div className="new-meeting-split" ref={newMeetingRef}>
                <button className="split-btn-main" onClick={openLoginModal}>
                  + New meeting
                </button>
                <button
                  className="split-btn-caret"
                  aria-label="More meeting options"
                  onClick={() => setNewMeetingOpen((o) => !o)}
                >
                  <ChevronDown size={14} />
                </button>
                {newMeetingOpen && (
                  <div className="split-menu">
                    <button onClick={openLoginModal}>
                      <PlayCircle size={16} /> Start instant session
                    </button>
                    <button onClick={openLoginModal}>
                      <Clock size={16} /> Schedule for later
                    </button>
                    <button onClick={openLoginModal}>
                      <CalendarPlus size={16} /> Add to calendar
                    </button>
                  </div>
                )}
              </div>
            </div>
            {joinError && <p className="hero-join-error">{joinError}</p>}
            <div className="hero-proof">
              <div><b>0 extra logins</b>runs inside ILMORA</div>
              <div><b>100% verified</b>join-code gated</div>
              <div><b>Auto</b>attendance, no roll call</div>
            </div>
            <div className="hero-avatars">
              <div className="avatar-stack">
                <span>AR</span><span>KS</span><span>MP</span>
              </div>
              <small>Trusted by trainers &amp; admins across every batch</small>
            </div>
          </div>

          <div className="mock">
            <div className="mock-bar">
              <span className="mock-dot"></span><span className="mock-dot"></span><span className="mock-dot"></span>
              <span className="mock-title">Meetings · Today</span>
            </div>
            <div className="mock-body">
              <div className="m-row">
                <span className="m-dot live"></span>
                <div className="m-main">
                  <div className="m-title">Java doubts session</div>
                  <div className="m-meta">Hosted by Aditi Rao · Batch 12B</div>
                </div>
                <span className="m-time">Now</span>
                <button className="m-btn live">Join</button>
              </div>
              <div className="m-row">
                <span className="m-dot sched"></span>
                <div className="m-main">
                  <div className="m-title">Platform-wide policy briefing</div>
                  <div className="m-meta">Hosted by Super Admin · All organizations</div>
                </div>
                <span className="m-time">Starts 4:30 PM</span>
                <button className="m-btn sched">Notify me</button>
              </div>
              <div className="m-row">
                <span className="m-dot"></span>
                <div className="m-main">
                  <div className="m-title">DSA weekly review</div>
                  <div className="m-meta">Hosted by Kabir Singh · Batch 9A</div>
                </div>
                <span className="m-time">Ended Tue</span>
                <button className="m-btn sched" style={{ opacity: 0.5 }}>Ended</button>
              </div>
            </div>
          </div>
        </header>

        {/* PRODUCT DEMO — Coverr-style full-bleed video hero with content overlaid on top */}
        <section id="demo-section" className="demo-hero">
          <div className="demo-hero-media">
            <video
              className="demo-hero-video"
              src={workspaceDemoVideo}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
            <div className="demo-hero-overlay"></div>
            <div className="demo-hero-content">
              <h2 className="demo-hero-title-nowrap">
                See <span className="brand-ilm">ILM</span> <span className="brand-ora">ORA</span> Meetings in action
              </h2>
              <p>
                Watch what starting, sharing, and tracking a live session actually looks
                like — start to finish, right inside your own workspace.
              </p>
              <button className="btn-primary demo-hero-cta" onClick={openLoginModal}>
                Try it now
              </button>
            </div>
          </div>
        </section>

        {/* SPOTLIGHT CAROUSEL — premium floating-card showcase */}
        <section id="carousel-section" className="pc-section">
          <div className="pc-decor" aria-hidden="true">
            <span className="pc-glow"></span>
            <span className="pc-circle pc-circle--1"></span>
            <span className="pc-circle pc-circle--2"></span>
            <span className="pc-particle pc-particle--1"></span>
            <span className="pc-particle pc-particle--2"></span>
            <span className="pc-particle pc-particle--3"></span>
            <span className="pc-particle pc-particle--4"></span>
          </div>

          <div className="pc-head">
            <div className="pc-badge">
              <span className="pc-badge-avatars">
                <span>AR</span><span>KS</span><span>MP</span>
              </span>
              Trusted by trainers &amp; admins across every batch
            </div>
            <h2>Four things <em className="word-orange">Meetings</em> does for <em className="word-green">you</em></h2>
            <p>
              Every session — instant or scheduled — carries the same guardrails, whether
              it&apos;s one trainer and three students, or a briefing to every organization
              on ILMORA.
            </p>
          </div>

          <div className="pc-wrap" onMouseEnter={stopAuto} onMouseLeave={startAuto}>
            <button className="pc-arrow pc-arrow--prev" aria-label="Previous" onClick={() => go(active - 1)}>
              <ChevronLeft size={20} />
            </button>

            <div className="pc-card">
              <div className="pc-stage">
                {SLIDES.map((s, i) => (
                  <div key={s.tag} className={`pc-slide ${i === active ? "is-active" : ""}`}>
                    <img className="pc-img" src={s.image} alt={s.title} loading="lazy" />
                  </div>
                ))}
              </div>
            </div>

            <button className="pc-arrow pc-arrow--next" aria-label="Next" onClick={() => go(active + 1)}>
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="pc-dots">
            {SLIDES.map((s, i) => (
              <button
                key={s.tag}
                className={`pc-dot ${i === active ? "is-active" : ""}`}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => go(i)}
              />
            ))}
          </div>
        </section>

        {/* STATS */}
        <section id="stats-section">
          <div className="section-head">
            <h2 className="heading-nowrap">Built for how <em className="word-orange">batches</em> actually <em className="word-green">run</em></h2>
            <p>Numbers from organizations already running sessions through ILMORA Meetings.</p>
          </div>
          <div className="stat-grid">
            <div className="stat-card">
              <div className="stat-value">1-click</div>
              <div className="stat-label">Session start</div>
              <div className="stat-underline"></div>
            </div>
            <div className="stat-card">
              <div className="stat-value">100%</div>
              <div className="stat-label">Join-code verified</div>
              <div className="stat-underline"></div>
            </div>
            <div className="stat-card">
              <div className="stat-value">0</div>
              <div className="stat-label">Manual roll calls</div>
              <div className="stat-underline"></div>
            </div>
            <div className="stat-card">
              <div className="stat-value">Auto</div>
              <div className="stat-label">Calendar sync</div>
              <div className="stat-underline"></div>
            </div>
          </div>
        </section>

        {/* FEATURE STRIP */}
        <section id="features-section">
          <div className="section-head">
            <h2>The details that make it <em className="word-orange">feel</em> <em className="word-green">built-in</em></h2>
            <p>Not a bolt-on video tool — Meetings speaks the same language as your batches, trainers and organizations.</p>
          </div>
          <div className="feature-strip">
            <div className="feature-card">
              <div className="feature-icon"><PlusCircle size={19} /></div>
              <h3>Start instant or schedule ahead</h3>
              <p>One button splits into &quot;start now&quot; or &quot;schedule for later&quot; — pick a date, time, and who it&apos;s for, right from the same control.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><Link2 size={19} /></div>
              <h3>One link, every calendar</h3>
              <p>Share a join code or link, or drop the session straight into Google Calendar or an .ics invite — no separate meeting tool to juggle.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><ClipboardList size={19} /></div>
              <h3>A calendar view of every session</h3>
              <p>Live, scheduled, and completed sessions show up on a month calendar, so admins can see what&apos;s happening across every batch at a glance.</p>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section>
          <div className="cta-band">
            <div className="cta-band-media">
              <img src={ctaPersonImg} alt="" />
            </div>
            <div className="cta-band-content">
              <h2>
                Bring your first session into <em className="word-green">ILM</em> <em className="word-orange">ORA</em>
              </h2>
              <p>Meetings is live for every organization on your plan — no setup, no separate login.</p>
            </div>
          </div>
        </section>

        {/* Real login modal — Navbar's "Get Started" button (via PublicLayout's
            setShowLoginModal) flips this on, same as LMSHomepage.jsx. */}
        {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
      </div>
    </PublicLayout>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Styles — same visual language as meetings-landing.html, but:
   - fonts switched to Sora (headings) + Plus Jakarta Sans (body),
     matching ResumeBuilderLanding / ILMORALanding
   - every surface color reads from CSS vars set on the wrapper's
     inline style (THEME_VARS), so dark/light just works
   - scoped under .ilmoraMeetingsPage so nothing leaks out
───────────────────────────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

  .ilmoraMeetingsPage{
    --brand:${GREEN};
    --brand-2:${ORANGE};
    --live:${GREEN};
    background:var(--bg);
    color:var(--ink);
    font-family:'Plus Jakarta Sans',sans-serif;
    -webkit-font-smoothing:antialiased;
    transition:background .25s ease, color .25s ease;
  }
  .ilmoraMeetingsPage *{box-sizing:border-box;}
  .ilmoraMeetingsPage h1,
  .ilmoraMeetingsPage h2,
  .ilmoraMeetingsPage h3{ font-family:'Sora',sans-serif; letter-spacing:-0.02em; }

  /* ---------- Hero ---------- */
  .ilmoraMeetingsPage .hero{
    max-width:1180px; margin:0 auto; padding:36px 24px 10px;
    display:grid; grid-template-columns:1.05fr 0.95fr; gap:48px; align-items:center;
  }
  .ilmoraMeetingsPage .eyebrow{
    display:inline-flex; align-items:center; gap:7px;
    background:rgba(22,163,74,.09); color:var(--brand);
    border:1px solid rgba(22,163,74,.18);
    font-size:12px; font-weight:700; letter-spacing:.03em;
    padding:6px 12px; border-radius:999px; margin-bottom:20px;
  }
  .ilmoraMeetingsPage .eyebrow-dot{ width:6px; height:6px; border-radius:999px; background:var(--live); box-shadow:0 0 0 3px rgba(20,184,166,.2); }
  .ilmoraMeetingsPage .hero h1{ font-size:clamp(2rem,3.8vw,3.15rem); line-height:1.08; font-weight:900; margin:0 0 20px; letter-spacing:-1px; }
  .ilmoraMeetingsPage em{ font-style:normal; }
  .ilmoraMeetingsPage em.word-orange{ color:var(--brand-2); }
  .ilmoraMeetingsPage em.word-green{ color:var(--brand); }
  .ilmoraMeetingsPage .hero p{ font-size:16px; line-height:1.75; color:var(--muted); max-width:460px; margin:0 0 28px; }
  .ilmoraMeetingsPage .hero-ctas{ display:flex; gap:12px; margin-bottom:28px; flex-wrap:wrap; }
  .ilmoraMeetingsPage .btn-primary{
    display:inline-flex; align-items:center; gap:8px;
    background:var(--brand-2); color:#fff;
    border:none; padding:13px 22px; border-radius:11px; font-size:14.5px; font-weight:700;
    cursor:pointer; box-shadow:0 10px 24px rgba(249,115,22,.3); font-family:inherit;
    transition:all .2s;
  }
  .ilmoraMeetingsPage .btn-primary:hover{ background:#ea6c0e; transform:translateY(-2px); }
  .ilmoraMeetingsPage .btn-ghost{
    display:inline-flex; align-items:center; gap:8px;
    background:transparent; color:var(--ink); border:1px solid var(--border);
    padding:13px 20px; border-radius:11px; font-size:14.5px; font-weight:600; cursor:pointer;
    font-family:inherit; transition:all .2s;
  }
  .ilmoraMeetingsPage .btn-ghost:hover{ border-color:var(--brand-2); color:var(--brand-2); }

  /* ---------- Hero toolbar: Join by code / New meeting ---------- */
  .ilmoraMeetingsPage .join-by-code{
    display:flex; align-items:center; gap:8px;
    background:var(--card); border:1px solid var(--border); border-radius:11px;
    padding:6px 6px 6px 14px; min-width:260px;
  }
  .ilmoraMeetingsPage .join-by-code-icon{ display:flex; align-items:center; opacity:.7; color:var(--muted); }
  .ilmoraMeetingsPage .join-by-code input{
    flex:1; border:none; outline:none; background:transparent; font-size:14px;
    font-family:inherit; color:var(--ink); min-width:0;
  }
  .ilmoraMeetingsPage .join-by-code input::placeholder{ color:var(--muted); }
  .ilmoraMeetingsPage .join-inline-btn{
    padding:9px 16px; border-radius:8px; font-size:13.5px; box-shadow:none;
  }
  .ilmoraMeetingsPage .join-inline-btn:disabled{
    background:rgba(249,115,22,.35); cursor:not-allowed; transform:none;
  }
  .ilmoraMeetingsPage .hero-join-error{ color:#dc2626; font-size:12.5px; margin:-16px 0 20px; }

  .ilmoraMeetingsPage .new-meeting-split{ position:relative; display:flex; }
  .ilmoraMeetingsPage .split-btn-main{
    display:inline-flex; align-items:center; gap:6px;
    background:var(--brand-2); color:#fff;
    border:none; padding:13px 18px; border-radius:11px 0 0 11px; font-size:14.5px; font-weight:700;
    cursor:pointer; font-family:inherit; box-shadow:0 10px 24px rgba(249,115,22,.3);
    transition:background .2s;
  }
  .ilmoraMeetingsPage .split-btn-main:hover{ background:#ea6c0e; }
  .ilmoraMeetingsPage .split-btn-caret{
    display:flex; align-items:center; justify-content:center;
    background:var(--brand-2); color:#fff;
    border:none; border-left:1px solid rgba(255,255,255,.3);
    padding:13px 12px; border-radius:0 11px 11px 0; cursor:pointer; font-size:12px;
    transition:background .2s;
  }
  .ilmoraMeetingsPage .split-btn-caret:hover{ background:#ea6c0e; }
  .ilmoraMeetingsPage .split-menu{
    position:absolute; top:calc(100% + 8px); left:0; min-width:210px; z-index:20;
    background:var(--card); border:1px solid var(--border); border-radius:12px;
    box-shadow:0 12px 30px rgba(0,0,0,.14); padding:6px;
  }
  .ilmoraMeetingsPage .split-menu button{
    display:flex; align-items:center; gap:8px; width:100%; text-align:left;
    background:transparent; border:none; padding:10px 12px; border-radius:8px;
    font-size:13.5px; color:var(--ink); cursor:pointer; font-family:inherit;
  }
  .ilmoraMeetingsPage .split-menu button:hover{ background:rgba(22,163,74,.1); }

  @media (max-width:560px){
    .ilmoraMeetingsPage .join-by-code{ min-width:0; width:100%; }
  }

  .ilmoraMeetingsPage .hero-proof{ display:flex; gap:22px; font-size:12.5px; color:var(--muted); align-items:center; flex-wrap:wrap; }
  .ilmoraMeetingsPage .hero-proof b{ color:var(--ink); font-family:'Sora'; font-size:15px; display:block; }
  .ilmoraMeetingsPage .hero-avatars{ display:flex; align-items:center; gap:10px; margin-top:6px; }
  .ilmoraMeetingsPage .avatar-stack{ display:flex; }
  .ilmoraMeetingsPage .avatar-stack span{
    width:34px; height:34px; border-radius:999px; border:2.5px solid var(--bg);
    display:flex; align-items:center; justify-content:center; color:#fff;
    font-family:'Sora'; font-weight:700; font-size:12.5px; margin-left:-10px;
  }
  .ilmoraMeetingsPage .avatar-stack span:first-child{ margin-left:0; }
  .ilmoraMeetingsPage .avatar-stack span:nth-child(1){ background:#16a34a; }
  .ilmoraMeetingsPage .avatar-stack span:nth-child(2){ background:#f97316; }
  .ilmoraMeetingsPage .avatar-stack span:nth-child(3){ background:#0ea5e9; }
  .ilmoraMeetingsPage .hero-avatars small{ color:var(--muted); font-size:12px; }

  /* ---------- Hero mock ---------- */
  .ilmoraMeetingsPage .mock{
    background:var(--card); border:1px solid var(--border); border-radius:20px;
    box-shadow:0 24px 60px rgba(23,15,40,.09); overflow:hidden;
  }
  .ilmoraMeetingsPage .mock-bar{ display:flex; align-items:center; gap:6px; padding:12px 16px; border-bottom:1px solid var(--border); }
  .ilmoraMeetingsPage .mock-dot{ width:8px; height:8px; border-radius:999px; background:#e4dcf2; }
  .ilmoraMeetingsPage .mock-title{ margin-left:6px; font-size:12px; color:var(--muted); font-weight:600; }
  .ilmoraMeetingsPage .mock-body{ padding:16px; display:flex; flex-direction:column; gap:8px; }
  .ilmoraMeetingsPage .m-row{ display:flex; align-items:center; gap:12px; padding:11px 12px; border-radius:12px; }
  .ilmoraMeetingsPage .m-row:hover{ background:rgba(22,163,74,.06); }
  .ilmoraMeetingsPage .m-dot{ width:8px; height:8px; border-radius:999px; background:#d8d2e8; flex-shrink:0; }
  .ilmoraMeetingsPage .m-dot.live{ background:var(--live); box-shadow:0 0 0 3px rgba(20,184,166,.18); }
  .ilmoraMeetingsPage .m-dot.sched{ background:var(--brand); }
  .ilmoraMeetingsPage .m-main{ flex:1; min-width:0; }
  .ilmoraMeetingsPage .m-title{ font-size:13px; font-weight:700; }
  .ilmoraMeetingsPage .m-meta{ font-size:11.5px; color:var(--muted); margin-top:1px; }
  .ilmoraMeetingsPage .m-time{ font-size:12px; color:var(--muted); white-space:nowrap; }
  .ilmoraMeetingsPage .m-btn{ font-size:12px; font-weight:700; padding:6px 12px; border-radius:8px; border:none; color:#fff; }
  .ilmoraMeetingsPage .m-btn.live{ background:linear-gradient(135deg,var(--live),#0ea5e9); }
  .ilmoraMeetingsPage .m-btn.sched{ background:rgba(107,100,120,.18); color:var(--muted); }

  /* ---------- Product demo — Coverr-style video hero ---------- */
  .ilmoraMeetingsPage .demo-hero{ padding-top:6px; padding-bottom:60px; }
  .ilmoraMeetingsPage .demo-hero-media{
    position:relative; border-radius:28px; overflow:hidden;
    aspect-ratio:16 / 8.4; max-height:620px;
    box-shadow:0 30px 70px rgba(23,15,40,.18);
    background:#0f172a;
  }
  .ilmoraMeetingsPage .demo-hero-video{
    position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:center;
  }
  .ilmoraMeetingsPage .demo-hero-overlay{
    position:absolute; inset:0;
    background:linear-gradient(180deg, rgba(15,23,42,.12) 0%, rgba(15,23,42,.32) 55%, rgba(15,23,42,.78) 100%);
  }
  .ilmoraMeetingsPage .demo-hero-content{
    position:relative; z-index:2; height:100%;
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    text-align:center; gap:16px; padding:48px 24px;
  }
  .ilmoraMeetingsPage .demo-hero-content h2{
    color:#fff; font-size:clamp(1.8rem, 3.6vw, 2.6rem); font-weight:800;
    letter-spacing:-1px; margin:0; max-width:640px;
  }
  .ilmoraMeetingsPage .demo-hero-content h2.demo-hero-title-nowrap{
    max-width:none; white-space:nowrap; font-size:clamp(1.3rem, 3.4vw, 2.6rem);
  }
  .ilmoraMeetingsPage .demo-hero-content .brand-ilm{ color:var(--brand); }
  .ilmoraMeetingsPage .demo-hero-content .brand-ora{ color:var(--brand-2); }
  @media (max-width:640px){
    .ilmoraMeetingsPage .demo-hero-content h2.demo-hero-title-nowrap{
      white-space:normal; font-size:clamp(1.5rem, 5.6vw, 2rem);
    }
  }
  .ilmoraMeetingsPage .demo-hero-content p{
    color:rgba(255,255,255,.85); font-size:15.5px; line-height:1.7; max-width:520px; margin:0;
  }
  .ilmoraMeetingsPage .demo-hero-cta{ margin-top:6px; }

  @media (max-width:640px){
    .ilmoraMeetingsPage .demo-hero-media{ aspect-ratio:9 / 13; max-height:none; border-radius:20px; }
    .ilmoraMeetingsPage .demo-hero-content{ padding:32px 20px; }
  }

  /* ---------- Section shell ---------- */
  .ilmoraMeetingsPage section{ max-width:1180px; margin:0 auto; padding:70px 24px; }
  .ilmoraMeetingsPage .section-head{ max-width:560px; margin-bottom:38px; }
  .ilmoraMeetingsPage .section-head h2{
    font-size:clamp(2.1rem, 4.2vw, 52px); font-weight:800; line-height:1.1; letter-spacing:-1.4px; margin:0 0 12px;
    color:var(--ink);
  }
  .ilmoraMeetingsPage .section-head h2.heading-nowrap{
    white-space:nowrap; font-size:clamp(1.6rem, 3.4vw, 52px);
  }
  @media (max-width:760px){
    .ilmoraMeetingsPage .section-head h2.heading-nowrap{
      white-space:normal; font-size:clamp(1.8rem, 6vw, 2.4rem);
    }
  }
  .ilmoraMeetingsPage .section-head p{ color:var(--muted); font-size:15px; line-height:1.7; margin:0; }
  #features-section .section-head{ max-width:none; }
  #features-section .section-head h2{ white-space:normal; }

  /* ---------- Premium spotlight carousel ---------- */
  /* BUG FIX: this whole block used to be hardcoded to light hex colors
     (#fff, #111, #666, #FFF4E6, etc.) regardless of theme. Replaced with
     the same --bg / --card / --ink / --muted / --border vars every other
     section already uses, so this section now actually switches with
     light/dark mode instead of always staying light/cream. */
  .ilmoraMeetingsPage #carousel-section.pc-section{
    max-width:none; width:100%; margin:0; padding:120px 24px;
    position:relative; overflow:hidden; isolation:isolate;
    background:var(--bg);
  }

  /* decorative layer: glow / rings / particles, all behind the content */
  .ilmoraMeetingsPage .pc-decor{ position:absolute; inset:0; z-index:0; overflow:hidden; pointer-events:none; }
  .ilmoraMeetingsPage .pc-glow{
    position:absolute; top:50%; left:50%; width:900px; height:900px;
    transform:translate(-50%,-50%);
    background:radial-gradient(circle, rgba(249,115,22,.16) 0%, rgba(249,115,22,0) 70%);
    filter:blur(30px);
  }
  .ilmoraMeetingsPage .pc-circle{ position:absolute; border-radius:999px; border:1px solid rgba(249,115,22,.14); }
  .ilmoraMeetingsPage .pc-circle--1{ width:480px; height:480px; top:-140px; left:-160px; animation:pcDrift 14s ease-in-out infinite; }
  .ilmoraMeetingsPage .pc-circle--2{ width:360px; height:360px; bottom:-150px; right:-120px; border-color:rgba(249,115,22,.1); animation:pcDrift 18s ease-in-out infinite reverse; }
  .ilmoraMeetingsPage .pc-particle{ position:absolute; width:6px; height:6px; border-radius:999px; background:#F97316; opacity:.35; animation:pcFloatParticle 8s ease-in-out infinite; }
  .ilmoraMeetingsPage .pc-particle--1{ top:16%; left:11%; }
  .ilmoraMeetingsPage .pc-particle--2{ top:72%; left:7%; width:4px; height:4px; animation-delay:1.6s; }
  .ilmoraMeetingsPage .pc-particle--3{ top:20%; right:9%; animation-delay:.9s; }
  .ilmoraMeetingsPage .pc-particle--4{ top:76%; right:13%; width:5px; height:5px; animation-delay:2.4s; }
  @keyframes pcDrift{ 0%,100%{ transform:translateY(0) translateX(0);} 50%{ transform:translateY(-14px) translateX(10px);} }
  @keyframes pcFloatParticle{ 0%,100%{ transform:translateY(0); opacity:.25;} 50%{ transform:translateY(-18px); opacity:.6;} }

  /* heading block */
  .ilmoraMeetingsPage .pc-head{ position:relative; z-index:2; max-width:680px; margin:0 auto 56px; text-align:center; }
  .ilmoraMeetingsPage .pc-badge{
    display:inline-flex; align-items:center; gap:10px;
    background:var(--card); border-radius:999px; padding:7px 18px 7px 7px;
    box-shadow:0 10px 26px rgba(20,10,0,.07); font-size:12.5px; font-weight:700; color:var(--ink);
    margin-bottom:22px;
  }
  .ilmoraMeetingsPage .pc-badge-avatars{ display:flex; }
  .ilmoraMeetingsPage .pc-badge-avatars span{
    width:26px; height:26px; border-radius:999px; border:2px solid var(--card);
    display:flex; align-items:center; justify-content:center; color:#fff;
    font-family:'Sora'; font-weight:700; font-size:9.5px; margin-left:-9px;
  }
  .ilmoraMeetingsPage .pc-badge-avatars span:first-child{ margin-left:0; }
  .ilmoraMeetingsPage .pc-badge-avatars span:nth-child(1){ background:#16a34a; }
  .ilmoraMeetingsPage .pc-badge-avatars span:nth-child(2){ background:#f97316; }
  .ilmoraMeetingsPage .pc-badge-avatars span:nth-child(3){ background:#0ea5e9; }
  .ilmoraMeetingsPage .pc-head h2{
    font-size:clamp(2.1rem, 4.2vw, 52px); font-weight:800; line-height:1.1;
    letter-spacing:-1.4px; margin:0 0 16px; color:var(--ink);
  }
  .ilmoraMeetingsPage .pc-head p{ font-size:18px; line-height:1.7; color:var(--muted); max-width:620px; margin:0 auto; }

  /* floating card + arrows */
  .ilmoraMeetingsPage .pc-wrap{ position:relative; z-index:2; display:flex; align-items:center; justify-content:center; gap:26px; }
  .ilmoraMeetingsPage .pc-arrow{
    width:48px; height:48px; border-radius:999px; border:none; flex-shrink:0;
    background:var(--card); color:var(--ink); display:flex; align-items:center; justify-content:center;
    cursor:pointer; box-shadow:0 14px 32px rgba(20,10,0,.1);
    transition:background .3s cubic-bezier(.16,1,.3,1), color .3s cubic-bezier(.16,1,.3,1), transform .3s cubic-bezier(.16,1,.3,1), box-shadow .3s cubic-bezier(.16,1,.3,1);
  }
  .ilmoraMeetingsPage .pc-arrow:hover{ background:#F97316; color:#fff; transform:scale(1.08); box-shadow:0 18px 38px rgba(249,115,22,.35); }

  .ilmoraMeetingsPage .pc-card{
    position:relative; width:min(78vw, 760px); padding:16px; border-radius:26px;
    background:var(--card); border:1px solid var(--border);
    box-shadow:0 30px 64px rgba(0,0,0,.11);
    animation:pcFloat 6s cubic-bezier(.45,0,.55,1) infinite;
  }
  @keyframes pcFloat{ 0%,100%{ transform:translateY(0); } 50%{ transform:translateY(-10px); } }

  @media (min-width:1600px){
    .ilmoraMeetingsPage .pc-card{ width:min(60vw, 900px); }
  }

  .ilmoraMeetingsPage .pc-stage{ position:relative; width:100%; aspect-ratio:3 / 2; border-radius:20px; overflow:hidden; background:var(--bg); }
  .ilmoraMeetingsPage .pc-slide{ position:absolute; inset:0; opacity:0; transition:opacity .8s cubic-bezier(.16,1,.3,1); }
  .ilmoraMeetingsPage .pc-slide.is-active{ opacity:1; }
  .ilmoraMeetingsPage .pc-img{ width:100%; height:100%; object-fit:contain; object-position:center; display:block; }

  /* pagination */
  .ilmoraMeetingsPage .pc-dots{ position:relative; z-index:2; display:flex; justify-content:center; gap:8px; margin-top:32px; }
  .ilmoraMeetingsPage .pc-dot{ width:8px; height:8px; border-radius:999px; border:none; background:#DADADA; cursor:pointer; transition:all .3s cubic-bezier(.16,1,.3,1); }
  .ilmoraMeetingsPage .pc-dot.is-active{ background:#F97316; width:28px; }

  @media (max-width:640px){
    .ilmoraMeetingsPage #carousel-section.pc-section{ padding:80px 18px; }
    .ilmoraMeetingsPage .pc-wrap{ gap:12px; }
    .ilmoraMeetingsPage .pc-arrow{ width:40px; height:40px; }
    .ilmoraMeetingsPage .pc-card{ padding:12px; border-radius:22px; }
    .ilmoraMeetingsPage .pc-stage{ border-radius:16px; }
  }

  /* ---------- Stats ---------- */
  .ilmoraMeetingsPage .stat-grid{ display:grid; grid-template-columns:repeat(4,1fr); gap:16px; }
  .ilmoraMeetingsPage .stat-card{ background:var(--card); border:1.5px solid var(--border); border-radius:18px; padding:20px; transition:transform .2s, box-shadow .2s; }
  .ilmoraMeetingsPage .stat-card:hover{ transform:translateY(-3px); box-shadow:0 10px 28px rgba(0,0,0,.08); }
  .ilmoraMeetingsPage .stat-value{ font-size:26px; font-weight:900; font-family:'Sora'; }
  .ilmoraMeetingsPage .stat-label{ font-size:11px; font-weight:700; letter-spacing:.05em; text-transform:uppercase; color:var(--muted); margin-top:4px; }
  .ilmoraMeetingsPage .stat-underline{ height:3px; border-radius:999px; background:linear-gradient(90deg,var(--brand),var(--brand-2)); margin-top:14px; width:55%; }

  /* ---------- Feature strip ---------- */
  .ilmoraMeetingsPage .feature-strip{ display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
  .ilmoraMeetingsPage .feature-card{ background:var(--card); border:1.5px solid var(--border); border-radius:18px; padding:24px; transition:transform .2s, box-shadow .2s; }
  .ilmoraMeetingsPage .feature-card:hover{ transform:translateY(-4px); box-shadow:0 12px 32px rgba(0,0,0,.08); }
  .ilmoraMeetingsPage .feature-icon{ width:38px; height:38px; border-radius:11px; display:flex; align-items:center; justify-content:center; background:rgba(22,163,74,.12); color:var(--brand); margin-bottom:16px; }
  .ilmoraMeetingsPage .feature-card h3{ font-size:15.5px; margin:0 0 8px; }
  .ilmoraMeetingsPage .feature-card p{ font-size:13.5px; color:var(--muted); line-height:1.65; margin:0; }

  /* ---------- Final CTA ---------- */
  .ilmoraMeetingsPage .cta-band{
    background:linear-gradient(135deg, ${DARK}, #1c2b1e);
    border-radius:28px; overflow:hidden;
    display:flex; align-items:stretch; min-height:220px;
    margin-top:10px;
  }
  .ilmoraMeetingsPage .cta-band-media{
    flex:0 0 260px; align-self:stretch; position:relative; overflow:hidden;
    background:${DARK}; margin:0; padding:0; min-height:220px;
    border-top-left-radius:28px; border-bottom-left-radius:28px;
  }
  .ilmoraMeetingsPage .cta-band-media img{
    position:absolute; inset:0; margin:0; padding:0; border:none;
    width:100%; height:100%; object-fit:cover; object-position:center 20%;
    display:block;
  }
  .ilmoraMeetingsPage .cta-band-content{
    flex:1; padding:38px 48px; text-align:center;
    display:flex; flex-direction:column; justify-content:center; align-items:center;
  }
  .ilmoraMeetingsPage .cta-band h2{
    font-size:clamp(1.5rem,2.6vw,1.9rem); margin:0 0 10px; font-weight:900; color:#fff;
  }
  .ilmoraMeetingsPage .cta-band h2 em{ font-style:normal; }
  .ilmoraMeetingsPage .cta-band p{ color:rgba(255,255,255,.65); max-width:440px; margin:0 auto; font-size:15px; }
  .ilmoraMeetingsPage .cta-band .btn-primary{ box-shadow:0 10px 30px rgba(22,163,74,.4); }
  @media (max-width:700px){
    .ilmoraMeetingsPage .cta-band{ flex-direction:column; }
    .ilmoraMeetingsPage .cta-band-media{ flex-basis:auto; height:160px; }
    .ilmoraMeetingsPage .cta-band-content{ padding:28px 24px; }
  }

  /* ---------- Responsive ---------- */
  @media (max-width:900px){
    .ilmoraMeetingsPage .hero{ grid-template-columns:1fr; }
    .ilmoraMeetingsPage .stat-grid{ grid-template-columns:repeat(2,1fr); }
    .ilmoraMeetingsPage .feature-strip{ grid-template-columns:1fr; }
  }
  @media (max-width:520px){
    #features-section .section-head h2{ white-space:normal; }
  }
`;

/* ─────────────────────────────────────────────────────────────────
   Login modal styles — scoped separately (not under .ilmoraMeetingsPage)
   since the modal is fixed to the viewport, not inside the page wrapper.
───────────────────────────────────────────────────────────────── */
const LOGIN_MODAL_CSS = `
  .wsLoginModal{
    position:fixed; inset:0; z-index:1000;
    display:flex; align-items:center; justify-content:center;
    padding:24px 16px;
    background:rgba(0,0,0,0.55);
    backdrop-filter:blur(5px);
  }
  .wsLoginModal *{ box-sizing:border-box; }
  .wslm-card{
    position:relative; width:100%; max-width:420px;
    background:rgba(255,255,255,0.97);
    border:1px solid rgba(249,115,22,0.18);
    border-radius:20px;
    padding:26px 26px 22px;
    box-shadow:0 30px 70px rgba(17,17,17,.35);
    animation:wslmFadeUp .3s ease both;
    font-family:'Plus Jakarta Sans',sans-serif;
  }
  @keyframes wslmFadeUp{ from{ opacity:0; transform:translateY(20px) scale(.97);} to{ opacity:1; transform:translateY(0) scale(1);} }
  .wslm-close{
    position:absolute; top:12px; right:12px; width:28px; height:28px; border-radius:999px;
    border:none; background:transparent; color:#9ca3af; font-size:16px; cursor:pointer;
    display:flex; align-items:center; justify-content:center;
  }
  .wslm-close:hover{ background:#f3f4f6; color:#374151; }
  .wslm-logo{ text-align:center; font-family:'Sora',sans-serif; font-weight:800; font-size:26px; margin-bottom:6px; }
  .wslm-ilm{ color:#16a34a; }
  .wslm-ora{ color:#f97316; margin-left:6px; }
  .wslm-title{ text-align:center; font-size:16px; font-weight:700; color:#1e0e02; margin:0 0 2px; }
  .wslm-sub{ text-align:center; font-size:12.5px; color:#8a6040; margin:0 0 16px; }
  .wslm-google-wrap{ display:flex; justify-content:center; margin-bottom:14px; }
  .wslm-google-wrap > div{ width:100% !important; max-width:100% !important; }
  .wslm-or-div{ display:flex; align-items:center; gap:10px; margin-bottom:14px; }
  .wslm-or-line{ flex:1; height:1px; background:rgba(180,100,30,.15); }
  .wslm-or-text{ font-size:11px; color:#b8906a; letter-spacing:.1em; text-transform:uppercase; }
  .wslm-field{ margin-bottom:12px; }
  .wslm-field label{ display:block; font-size:11px; font-weight:700; color:#8a6040; margin-bottom:5px; letter-spacing:.05em; text-transform:uppercase; }
  .wslm-field input{
    width:100%; padding:11px 14px; border-radius:10px; font-size:13.5px; outline:none;
    background:rgba(255,255,255,.85); border:1.5px solid rgba(180,120,60,.2); color:#1a0e06;
    font-family:inherit; transition:border-color .2s, box-shadow .2s;
  }
  .wslm-field input:focus{ border-color:#f97316; box-shadow:0 0 0 3px rgba(249,115,22,.1); background:#fff; }
  .wslm-field input:disabled{ opacity:.5; cursor:not-allowed; }
  .wslm-pw-wrap{ position:relative; }
  .wslm-pw-wrap input{ padding-right:42px; }
  .wslm-eye-btn{ position:absolute; right:11px; top:50%; transform:translateY(-50%); background:none; border:none; color:#b8906a; cursor:pointer; display:flex; padding:0; }
  .wslm-eye-btn:hover{ color:#f97316; }
  .wslm-forgot-row{ text-align:right; margin:2px 0 14px; }
  .wslm-forgot-row button{ background:none; border:none; color:#f97316; font-size:12.5px; font-weight:600; cursor:pointer; padding:0; font-family:inherit; }
  .wslm-forgot-row button:hover{ text-decoration:underline; }
  .wslm-submit{
    width:100%; padding:12.5px; border:none; border-radius:11px; color:#fff; font-weight:700; font-size:14.5px;
    background:linear-gradient(135deg,#f97316,#ea580c); box-shadow:0 4px 18px rgba(249,115,22,.32);
    cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; font-family:inherit;
    transition:transform .15s, opacity .2s;
  }
  .wslm-submit:hover:not(:disabled){ transform:translateY(-1px); opacity:.95; }
  .wslm-submit:disabled{ opacity:.55; cursor:not-allowed; }
  .wslm-spinner{ width:13px; height:13px; border-radius:999px; border:2px solid rgba(255,255,255,.3); border-top-color:#fff; animation:wslmSpin .7s linear infinite; }
  @keyframes wslmSpin{ to{ transform:rotate(360deg); } }
  .wslm-back{ text-align:center; margin-top:14px; }
  .wslm-back button{ background:none; border:none; color:#8a6040; font-size:12px; cursor:pointer; font-family:inherit; }
  .wslm-back button:hover{ color:#5c4025; }
`;










































