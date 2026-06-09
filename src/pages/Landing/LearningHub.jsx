import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Moon, Sun, Menu, X, Sparkles,
  Video, BrainCircuit, ListChecks, Code2, ClipboardCheck, MessageCircle,
  BookOpen, Award, FileText, PlayCircle, Library, FolderOpen,
  CheckCircle2, ArrowRight, Lock, BarChart3, Play, Download,
  Calendar, Star, ChevronRight, Zap, Flame, Trophy, Clock,
  Podcast, Users, TrendingUp, BookMarked, LayoutDashboard
} from "lucide-react";

// ─── DATA ────────────────────────────────────────────────────────────────────
const FEATURES = [
  { color: "#F97316", title: "Live Sessions",          desc: "Join real-time classes with industry trainers. Ask questions, collaborate and learn live.",         icon: <Video size={22} /> },
  { color: "#3b82f6", title: "Skill Mapping",          desc: "AI-driven skill gap analysis to identify your strengths and areas for improvement.",               icon: <BrainCircuit size={22} /> },
  { color: "#8b5cf6", title: "Study Plan",             desc: "Personalized weekly study roadmap tailored to your learning goals and pace.",                       icon: <ListChecks size={22} /> },
  { color: "#22c55e", title: "Coding Lab",             desc: "Practice DSA, system design and real-world problems in an in-browser IDE.",                        icon: <Code2 size={22} /> },
  { color: "#f59e0b", title: "Assessments & Quizzes",  desc: "Structured quizzes and mock tests to evaluate and reinforce your knowledge.",                      icon: <ClipboardCheck size={22} /> },
  { color: "#ec4899", title: "Trainer Chat",           desc: "Direct messaging with your assigned trainer for doubt resolution anytime.",                        icon: <MessageCircle size={22} /> },
  { color: "#14b8a6", title: "Learning Resources",     desc: "Curated PDFs, notes, recorded lectures, and reference materials at your fingertips.",              icon: <Library size={22} /> },
  { color: "#f97316", title: "Certificates",           desc: "Earn verifiable certificates upon course completion to showcase your skills.",                     icon: <Award size={22} /> },
];

const COURSES = [
  { title: "Java Backend Engineering", progress: 75, color: "#f97316", tag: "Backend", thumb: "☕" },
  { title: "React Development",        progress: 45, color: "#3b82f6", tag: "Frontend", thumb: "⚛️" },
  { title: "AWS Fundamentals",         progress: 30, color: "#f59e0b", tag: "Cloud",    thumb: "☁️" },
];

const ROADMAP = [
  { week: "Week 1", topic: "Java Basics",    status: "done" },
  { week: "Week 2", topic: "OOP Concepts",   status: "done" },
  { week: "Week 3", topic: "Collections",    status: "current" },
  { week: "Week 4", topic: "Spring Boot",    status: "locked" },
  { week: "Week 5", topic: "Microservices",  status: "locked" },
];

const LIVE = [
  { title: "Java Backend Masterclass",  time: "Today • 6:00 PM",    trainer: "Rahul S.",  avatar: "RS", live: true,  color: "#ef4444" },
  { title: "React Workshop",            time: "Tomorrow • 7:00 PM", trainer: "Priya M.",  avatar: "PM", live: false, color: "#3b82f6" },
  { title: "System Design Bootcamp",    time: "Wed • 5:00 PM",      trainer: "Arjun K.",  avatar: "AK", live: false, color: "#8b5cf6" },
];

const SKILLS = [
  { name: "Java",  pct: 80, color: "#f97316" },
  { name: "SQL",   pct: 70, color: "#3b82f6" },
  { name: "React", pct: 60, color: "#8b5cf6" },
  { name: "AWS",   pct: 40, color: "#22c55e" },
];

const QUIZZES = [
  { title: "Java Quiz",        questions: 20, status: "pending",   score: null, color: "#F97316" },
  { title: "React Quiz",       questions: 15, status: "completed", score: 88,   color: "#3b82f6" },
  { title: "SQL Fundamentals", questions: 25, status: "pending",   score: null, color: "#22c55e" },
];

const TRAINERS = [
  { name: "Rahul Sharma", role: "Java & Backend Expert",  exp: "8 years", initials: "RS", color: "#F97316", rating: 4.9 },
  { name: "Priya Mehta",  role: "React & Frontend Lead",  exp: "6 years", initials: "PM", color: "#3b82f6", rating: 4.8 },
  { name: "Arjun Kumar",  role: "AWS & DevOps Engineer",  exp: "7 years", initials: "AK", color: "#8b5cf6", rating: 4.9 },
];

const RESOURCES = [
  { color: "#f97316", title: "PDF Notes",       desc: "Detailed topic-wise notes for offline revision.",      tag: "24 Files",     icon: <FileText size={22} /> },
  { color: "#3b82f6", title: "Recorded Classes",desc: "All past live sessions are available on demand.",      tag: "48 Videos",    icon: <Video size={22} /> },
  { color: "#8b5cf6", title: "Video Lectures",  desc: "Curated video tutorials for every concept.",           tag: "120 Lectures", icon: <PlayCircle size={22} /> },
  { color: "#22c55e", title: "Assignments",     desc: "Practice assignments with sample test cases.",         tag: "36 Tasks",     icon: <FolderOpen size={22} /> },
];

const CERTS = [
  { title: "Java Backend Engineering", date: "May 2025",   grade: "A+", color: "#F97316", status: "earned" },
  { title: "React Development",        date: "In Progress", grade: "--", color: "#3b82f6", status: "pending" },
];

const ACTIVITIES = [
  { iconColor: "#22c55e", icon: <CheckCircle2 size={16} />, text: "Completed Java Quiz",                    sub: "Score: 88% • 2 hours ago" },
  { iconColor: "#3b82f6", icon: <Video size={16} />,        text: "Joined Live Session — React Workshop",   sub: "Duration: 90 mins • Yesterday" },
  { iconColor: "#F97316", icon: <Download size={16} />,     text: "Downloaded Notes — Spring Boot",         sub: "PDF • 3 days ago" },
  { iconColor: "#8b5cf6", icon: <FolderOpen size={16} />,   text: "Submitted Assignment — REST APIs",       sub: "Grade Pending • 4 days ago" },
];



// ─── PROGRESS BAR ────────────────────────────────────────────────────────────
function ProgressBar({ value, color }) {
  const [width, setWidth] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setTimeout(() => setWidth(value), 200); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);
  return (
    <div ref={ref} style={{ background: "var(--lh-bar-bg)", borderRadius: 99, height: 8, overflow: "hidden", width: "100%" }}>
      <div style={{ height: "100%", borderRadius: 99, width: `${width}%`, background: `linear-gradient(90deg, ${color}, ${color}cc)`, transition: "width 1.2s cubic-bezier(.4,0,.2,1)" }} />
    </div>
  );
}

// ─── SECTION BADGE ───────────────────────────────────────────────────────────
function SecBadge({ children }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.22)", borderRadius: 99, padding: "6px 16px", marginBottom: 16 }}>
      <Sparkles size={13} color="#F97316" />
      <span style={{ color: "#F97316", fontSize: 13, fontWeight: 600, letterSpacing: "0.02em" }}>{children}</span>
    </div>
  );
}

// ─── NAVBAR ──────────────────────────────────────────────────────────────────
function Navbar({ darkMode, toggleTheme }) {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const navLinks = [
    { text: "Courses",      href: "#courses" },
    { text: "Live Classes", href: "#live" },
    { text: "Trainers",     href: "#trainers" },
    { text: "Resources",    href: "#resources" },
  ];

  const scrollTo = (href) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileOpen(false);
  };

  const navBg      = darkMode ? (scrolled ? "rgba(10,10,10,0.97)" : "rgba(10,10,10,0.88)") : (scrolled ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.88)");
  const borderColor = darkMode ? "rgba(255,255,255,0.06)" : "rgba(249,115,22,0.18)";
  const textColor   = darkMode ? "#e5e7eb" : "#1E293B";
  const btnBg       = darkMode ? "rgba(255,255,255,0.06)" : "#f3f4f6";

  return (
    <>
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 9000, background: navBg, backdropFilter: "blur(18px)", borderBottom: `1px solid ${borderColor}`, boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.1)" : "none", transition: "background 0.3s, box-shadow 0.3s", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between" }}>

          {/* Logo */}
          <div onClick={() => navigate("/")} style={{ cursor: "pointer", userSelect: "none", transition: "transform 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
            <span style={{ fontSize: 28, fontWeight: 800, fontFamily: "serif", lineHeight: 1 }}>
              <span style={{ color: "#16a34a" }}>ILM</span>
              <span style={{ color: "#f97316", marginLeft: 4 }}>ORA</span>
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.3)", borderRadius: 4, marginLeft: 8, padding: "2px 6px", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: "#F97316", textTransform: "uppercase", verticalAlign: "middle" }}>Beta</span>
          </div>

          {/* Desktop nav */}
          <div style={{ display: "flex", alignItems: "center", gap: 4, flex: 1, justifyContent: "center" }} className="lh-desktop-nav">
            {navLinks.map(link => (
              <button key={link.text} onClick={() => scrollTo(link.href)}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: textColor, fontWeight: 500, fontSize: 15, padding: "8px 16px", borderRadius: 10, fontFamily: "'Plus Jakarta Sans', sans-serif", transition: "color 0.2s, background 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.color = "#F97316"; e.currentTarget.style.background = "rgba(249,115,22,0.06)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = textColor; e.currentTarget.style.background = "transparent"; }}>
                {link.text}
              </button>
            ))}
          </div>

          {/* Right controls */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={toggleTheme} style={{ width: 40, height: 40, borderRadius: 12, border: `1px solid ${darkMode ? "rgba(255,255,255,0.1)" : "#e5e7eb"}`, background: btnBg, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: darkMode ? "#F97316" : "#1E293B", transition: "all 0.2s" }}>
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={() => navigate("/login")} className="lh-desktop-nav"
              style={{ display: "flex", alignItems: "center", gap: 6, background: "#1E293B", color: "#fff", border: "none", borderRadius: 12, padding: "9px 20px", fontWeight: 700, fontSize: 14.5, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif", boxShadow: "0 4px 14px rgba(30,41,59,0.3)", transition: "background 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.background = "#334155"}
              onMouseLeave={e => e.currentTarget.style.background = "#1E293B"}>
              <Sparkles size={15} /> Get Started
            </button>
            <button onClick={() => setMobileOpen(true)} className="lh-mobile-menu-btn"
              style={{ width: 40, height: 40, borderRadius: 12, border: `1px solid ${darkMode ? "rgba(255,255,255,0.1)" : "#e5e7eb"}`, background: btnBg, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: textColor }}>
              <Menu size={20} />
            </button>
          </div>
        </div>
        <style>{`.lh-desktop-nav{display:flex!important}.lh-mobile-menu-btn{display:none!important}@media(max-width:900px){.lh-desktop-nav{display:none!important}.lh-mobile-menu-btn{display:flex!important}}`}</style>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 99999, background: darkMode ? "#0a0a0a" : "#ffffff", overflowY: "auto", fontFamily: "'Plus Jakarta Sans', sans-serif", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: `1px solid ${darkMode ? "rgba(255,255,255,0.07)" : "#f3f4f6"}`, position: "sticky", top: 0, zIndex: 10, background: darkMode ? "#0a0a0a" : "#ffffff" }}>
            <span style={{ fontSize: 26, fontWeight: 800, fontFamily: "serif" }}>
              <span style={{ color: "#16a34a" }}>ILM</span><span style={{ color: "#f97316", marginLeft: 4 }}>ORA</span>
            </span>
            <button onClick={() => setMobileOpen(false)} style={{ border: "none", background: darkMode ? "rgba(255,255,255,0.08)" : "#f5f5f5", borderRadius: 10, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: darkMode ? "#9ca3af" : "#6b7280" }}>
              <X size={18} />
            </button>
          </div>
          <div style={{ flex: 1, padding: "8px 0 40px" }}>
            {navLinks.map(link => (
              <button key={link.text} onClick={() => scrollTo(link.href)} style={{ width: "100%", display: "flex", alignItems: "center", padding: "16px 24px", border: "none", borderBottom: `1px solid ${darkMode ? "rgba(255,255,255,0.05)" : "#f9fafb"}`, background: "transparent", cursor: "pointer", textAlign: "left", fontSize: 15, fontWeight: 600, color: darkMode ? "#e5e7eb" : "#1e293b", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {link.text}
              </button>
            ))}
            <div style={{ height: 1, background: darkMode ? "rgba(255,255,255,0.06)" : "#f3f4f6", margin: "16px 24px" }} />
            <button onClick={() => { toggleTheme(); setMobileOpen(false); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "16px 24px", border: "none", background: "transparent", cursor: "pointer", fontSize: 15, fontWeight: 600, color: darkMode ? "#e5e7eb" : "#1e293b", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {darkMode ? <Sun size={18} color="#F97316" /> : <Moon size={18} />}
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
            <div style={{ height: 1, background: darkMode ? "rgba(255,255,255,0.06)" : "#f3f4f6", margin: "8px 24px 16px" }} />
            <div style={{ padding: "0 20px" }}>
              <button onClick={() => { navigate("/login"); setMobileOpen(false); }} style={{ width: "100%", padding: 14, borderRadius: 14, border: "none", background: "#1E293B", color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                <Sparkles size={16} /> Get Started
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function LearningHub() {
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem("theme");
      if (saved) return saved === "dark";
      return document.documentElement.classList.contains("dark");
    } catch { return false; }
  });

  const toggleTheme = () => {
    setDarkMode(prev => {
      const next = !prev;
      localStorage.setItem("theme", next ? "dark" : "light");
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  };

  useEffect(() => {
    const onStorage = (e) => { if (e.key === "theme") setDarkMode(e.newValue === "dark"); };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const theme = darkMode ? {
    "--lh-page-bg": "#0a0a0a", "--lh-card-bg": "#111111", "--lh-card-hover": "#161616",
    "--lh-hero-bg": "#141414", "--lh-section-bg": "#0d0d0d", "--lh-border": "rgba(255,255,255,0.06)",
    "--lh-border-hov": "rgba(255,255,255,0.14)", "--lh-text": "#ffffff", "--lh-text-sub": "rgba(255,255,255,0.55)",
    "--lh-text-muted": "rgba(255,255,255,0.3)", "--lh-pill-bg": "rgba(255,255,255,0.04)",
    "--lh-icon-bg": "rgba(255,255,255,0.05)", "--lh-bar-bg": "rgba(255,255,255,0.06)",
    "--lh-shadow": "0 4px 20px rgba(0,0,0,0.4)", "--lh-shadow-hov": "0 16px 48px rgba(0,0,0,0.6)",
  } : {
    "--lh-page-bg": "#F8F3EE", "--lh-card-bg": "#ffffff", "--lh-card-hover": "#fefefe",
    "--lh-hero-bg": "#ffffff", "--lh-section-bg": "#f2ece6", "--lh-border": "#e8e0d8",
    "--lh-border-hov": "#d4c8be", "--lh-text": "#1E293B", "--lh-text-sub": "#64748b",
    "--lh-text-muted": "#94a3b8", "--lh-pill-bg": "#f1ede8", "--lh-icon-bg": "#fdf8f4",
    "--lh-bar-bg": "#f1ede8", "--lh-shadow": "0 2px 12px rgba(0,0,0,0.07)",
    "--lh-shadow-hov": "0 12px 40px rgba(0,0,0,0.13)",
  };

  const s = {
    wrap:  { ...theme, background: "var(--lh-page-bg)", color: "var(--lh-text)", fontFamily: "'Plus Jakarta Sans', sans-serif", minHeight: "100vh" },
    inner: { maxWidth: 1200, margin: "0 auto", padding: "0 24px" },
  };

  return (
    <div style={s.wrap}>
      <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />

      <div style={{ paddingTop: 68 }}>
        <HeroSection s={s} />

        {/* FEATURES */}
        <section style={{ padding: "80px 0", background: "var(--lh-section-bg)" }}>
          <div style={s.inner}>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <SecBadge>Platform Features</SecBadge>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(28px,4vw,40px)", fontWeight: 700, color: "var(--lh-text)", lineHeight: 1.15, marginBottom: 16, letterSpacing: "-0.03em" }}>
                Everything You Need <span style={{ color: "#F97316" }}>To Learn</span>
              </h2>
              <p style={{ color: "var(--lh-text-sub)", fontSize: 16, maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
                A complete ecosystem designed to take you from beginner to industry-ready professional.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
              {FEATURES.map(f => <FeatureCard key={f.title} f={f} />)}
            </div>
          </div>
        </section>

        {/* CONTINUE LEARNING */}
        <section id="courses" style={{ padding: "80px 0", background: "var(--lh-page-bg)" }}>
          <div style={s.inner}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 40, flexWrap: "wrap", gap: 16 }}>
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.22)", borderRadius: 99, padding: "6px 16px", marginBottom: 10 }}>
                  <Flame size={12} color="#F97316" />
                  <span style={{ color: "#F97316", fontSize: 13, fontWeight: 600 }}>In Progress</span>
                </div>
                <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 30, fontWeight: 700, color: "var(--lh-text)", letterSpacing: "-0.03em" }}>Continue Learning</h2>
              </div>
              <button style={{ display: "flex", alignItems: "center", gap: 5, color: "#F97316", background: "transparent", border: "1px solid rgba(249,115,22,0.3)", borderRadius: 10, padding: "8px 16px", fontWeight: 600, fontSize: 13.5, fontFamily: "'Plus Jakarta Sans', sans-serif", cursor: "pointer" }}>
                View All <ChevronRight size={15} />
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 22 }}>
              {COURSES.map(c => <CourseCard key={c.title} c={c} />)}
            </div>
          </div>
        </section>

        {/* ROADMAP */}
        <section style={{ padding: "80px 0", background: "var(--lh-section-bg)" }}>
          <div style={s.inner}>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <SecBadge>Your Path</SecBadge>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(28px,4vw,40px)", fontWeight: 700, color: "var(--lh-text)", lineHeight: 1.15, marginBottom: 16, letterSpacing: "-0.03em" }}>
                Study <span style={{ color: "#F97316" }}>Roadmap</span>
              </h2>
              <p style={{ color: "var(--lh-text-sub)", fontSize: 16, maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
                Structured week-by-week learning path to keep you on track.
              </p>
            </div>
            <RoadmapSection />
          </div>
        </section>

        {/* LIVE CLASSES */}
        <section id="live" style={{ padding: "80px 0", background: "var(--lh-page-bg)" }}>
          <div style={s.inner}>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <SecBadge>Real-Time Learning</SecBadge>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(28px,4vw,40px)", fontWeight: 700, color: "var(--lh-text)", lineHeight: 1.15, letterSpacing: "-0.03em" }}>
                Upcoming <span style={{ color: "#F97316" }}>Live Classes</span>
              </h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 22 }}>
              {LIVE.map(sess => <LiveCard key={sess.title} sess={sess} />)}
            </div>
          </div>
        </section>

        {/* SKILL MAPPING */}
        <section style={{ padding: "80px 0", background: "var(--lh-section-bg)" }}>
          <div style={s.inner}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.22)", borderRadius: 99, padding: "6px 16px", marginBottom: 16 }}>
                  <BrainCircuit size={13} color="#F97316" />
                  <span style={{ color: "#F97316", fontSize: 13, fontWeight: 600 }}>AI Analysis</span>
                </div>
                <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(28px,3.5vw,38px)", fontWeight: 700, color: "var(--lh-text)", lineHeight: 1.15, marginBottom: 14, letterSpacing: "-0.035em" }}>
                  Your <span style={{ color: "#F97316" }}>Skill Map</span>
                </h2>
                <p style={{ color: "var(--lh-text-sub)", fontSize: 16, lineHeight: 1.7, marginBottom: 32 }}>
                  AI-driven analysis of your skill proficiency based on quizzes, assignments, and coding performance.
                </p>
                <button style={{ background: "#F97316", color: "#fff", border: "none", borderRadius: 14, padding: "12px 22px", fontWeight: 700, fontSize: 14.5, display: "flex", alignItems: "center", gap: 8, cursor: "pointer", boxShadow: "0 6px 24px rgba(249,115,22,0.35)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  <BarChart3 size={16} /> View Full Analysis
                </button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {SKILLS.map(sk => (
                  <div key={sk.name}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ color: "var(--lh-text)", fontWeight: 600, fontSize: 15 }}>{sk.name}</span>
                      <span style={{ color: sk.color, fontWeight: 700, fontSize: 15, fontFamily: "'Space Grotesk', sans-serif" }}>{sk.pct}%</span>
                    </div>
                    <ProgressBar value={sk.pct} color={sk.color} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CODING LAB */}
        <section style={{ padding: "80px 0", background: "var(--lh-page-bg)" }}>
          <div style={s.inner}>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <SecBadge>Practice Arena</SecBadge>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(28px,4vw,40px)", fontWeight: 700, color: "var(--lh-text)", lineHeight: 1.15, letterSpacing: "-0.03em" }}>
                Today's <span style={{ color: "#F97316" }}>Coding Challenge</span>
              </h2>
            </div>
            <CodingLab />
          </div>
        </section>

        {/* ASSESSMENTS */}
        <section style={{ padding: "80px 0", background: "var(--lh-section-bg)" }}>
          <div style={s.inner}>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <SecBadge>Test Your Knowledge</SecBadge>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(28px,4vw,40px)", fontWeight: 700, color: "var(--lh-text)", lineHeight: 1.15, letterSpacing: "-0.03em" }}>
                Assessments <span style={{ color: "#F97316" }}>&amp; Quizzes</span>
              </h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 22 }}>
              {QUIZZES.map(q => <QuizCard key={q.title} q={q} />)}
            </div>
          </div>
        </section>

        {/* TRAINERS */}
        <section id="trainers" style={{ padding: "80px 0", background: "var(--lh-page-bg)" }}>
          <div style={s.inner}>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <SecBadge>Expert Mentors</SecBadge>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(28px,4vw,40px)", fontWeight: 700, color: "var(--lh-text)", lineHeight: 1.15, marginBottom: 16, letterSpacing: "-0.03em" }}>
                Connect With <span style={{ color: "#F97316" }}>Your Trainers</span>
              </h2>
              <p style={{ color: "var(--lh-text-sub)", fontSize: 16, maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
                Get direct access to industry professionals who guide your learning journey.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 22 }}>
              {TRAINERS.map(tr => <TrainerCard key={tr.name} tr={tr} />)}
            </div>
          </div>
        </section>

        {/* RESOURCES */}
        <section id="resources" style={{ padding: "80px 0", background: "var(--lh-section-bg)" }}>
          <div style={s.inner}>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <SecBadge>Study Material</SecBadge>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(28px,4vw,40px)", fontWeight: 700, color: "var(--lh-text)", lineHeight: 1.15, marginBottom: 16, letterSpacing: "-0.03em" }}>
                Learning <span style={{ color: "#F97316" }}>Resources</span>
              </h2>
              <p style={{ color: "var(--lh-text-sub)", fontSize: 16, maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
                Everything you need to revise, practice and excel.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
              {RESOURCES.map(r => <ResourceCard key={r.title} r={r} />)}
            </div>
          </div>
        </section>

        {/* CERTIFICATES */}
        <section style={{ padding: "80px 0", background: "var(--lh-page-bg)" }}>
          <div style={s.inner}>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <SecBadge>Achievements</SecBadge>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(28px,4vw,40px)", fontWeight: 700, color: "var(--lh-text)", lineHeight: 1.15, letterSpacing: "-0.03em" }}>
                Your <span style={{ color: "#F97316" }}>Certificates</span>
              </h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 22, maxWidth: 800, margin: "0 auto" }}>
              {CERTS.map(c => <CertCard key={c.title} c={c} />)}
            </div>
          </div>
        </section>

        {/* RECENT ACTIVITY */}
        <section style={{ padding: "80px 0", background: "var(--lh-section-bg)" }}>
          <div style={s.inner}>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <SecBadge>Timeline</SecBadge>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(28px,4vw,40px)", fontWeight: 700, color: "var(--lh-text)", lineHeight: 1.15, letterSpacing: "-0.03em" }}>
                Recent <span style={{ color: "#F97316" }}>Activity</span>
              </h2>
            </div>
            <div style={{ maxWidth: 640, margin: "0 auto", display: "flex", flexDirection: "column", gap: 12 }}>
              {ACTIVITIES.map(a => <ActivityRow key={a.text} a={a} />)}
            </div>
          </div>
        </section>

        {/* CTA */}
        <div style={{ padding: "48px 0", background: "linear-gradient(135deg, #1E293B 0%, #0f172a 100%)", position: "relative", overflow: "hidden", textAlign: "center" }}>
          <div style={{ position: "absolute", top: -40, left: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(249,115,22,0.1)", filter: "blur(50px)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(249,115,22,0.07)", filter: "blur(40px)", pointerEvents: "none" }} />
          <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 24px", position: "relative" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.22)", borderRadius: 99, padding: "5px 14px", marginBottom: 16 }}>
              <Zap size={13} color="#F97316" />
              <span style={{ color: "#F97316", fontSize: 12.5, fontWeight: 600 }}>Start Today</span>
            </div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(26px,4vw,42px)", fontWeight: 700, color: "#fff", lineHeight: 1.15, letterSpacing: "-0.035em", margin: "0 0 12px" }}>
              Ready To Become <span style={{ color: "#F97316" }}>Industry Ready?</span>
            </h2>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 15, lineHeight: 1.65, maxWidth: 480, margin: "0 auto 28px" }}>
              Join thousands of learners accelerating their careers with ILM ORA's complete learning ecosystem.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <button style={{ background: "#F97316", color: "#fff", border: "none", borderRadius: 12, padding: "12px 26px", fontWeight: 700, fontSize: 15, display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                <Play size={15} fill="white" stroke="none" /> Continue Learning
              </button>
              <button style={{ background: "transparent", color: "#fff", border: "1.5px solid rgba(255,255,255,0.18)", borderRadius: 12, padding: "12px 26px", fontWeight: 600, fontSize: 14.5, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Explore Courses
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── HERO ────────────────────────────────────────────────────────────────────
function HeroSection({ s }) {
  return (
    <div style={{ background: "var(--lh-hero-bg)", padding: "64px 0", borderBottom: "1px solid var(--lh-border)" }}>
      <div style={{ ...s.inner, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.22)", borderRadius: 99, padding: "6px 16px", marginBottom: 20 }}>
            <Sparkles size={13} color="#F97316" />
            <span style={{ color: "#F97316", fontSize: 13, fontWeight: 600, letterSpacing: "0.02em" }}>Advanced Learning Ecosystem</span>
          </div>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(36px,5vw,56px)", fontWeight: 700, lineHeight: 1.12, letterSpacing: "-0.035em", color: "var(--lh-text)", marginBottom: 20 }}>
            Accelerate Your <span style={{ color: "#F97316" }}>Learning Journey</span>
          </h1>
          <p style={{ color: "var(--lh-text-sub)", fontSize: 17, lineHeight: 1.75, maxWidth: 480, marginBottom: 40 }}>
            Access live sessions, coding labs, assessments, study plans, mentors, and AI-powered learning tools from one place.
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <button style={{ background: "#F97316", color: "#fff", border: "none", borderRadius: 14, padding: "14px 28px", fontWeight: 700, fontSize: 15, display: "flex", alignItems: "center", gap: 8, cursor: "pointer", boxShadow: "0 6px 24px rgba(249,115,22,0.35)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              <BookOpen size={18} /> Explore Learning Hub
            </button>
            <button style={{ background: "transparent", color: "var(--lh-text)", border: "1.5px solid var(--lh-border)", borderRadius: 14, padding: "14px 28px", fontWeight: 600, fontSize: 15, display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              <Play size={18} fill="currentColor" stroke="none" /> Join Live Session
            </button>
          </div>
          <div style={{ display: "flex", gap: 32, marginTop: 48, flexWrap: "wrap" }}>
            {[["12k+", "Active Learners", <Users size={14} />], ["200+", "Live Sessions", <Podcast size={14} />], ["95%", "Placement Rate", <TrendingUp size={14} />]].map(([num, lbl, icon]) => (
              <div key={lbl}>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 24, fontWeight: 700, color: "var(--lh-text)", letterSpacing: "-0.03em" }}>{num}</div>
                <div style={{ fontSize: 13, color: "var(--lh-text-muted)", fontWeight: 500, marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>{icon}{lbl}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Hero Card */}
        <div style={{ background: "linear-gradient(135deg, rgba(249,115,22,0.07) 0%, rgba(30,41,59,0.05) 100%)", border: "1px solid var(--lh-border)", borderRadius: 28, padding: 32, position: "relative", overflow: "hidden" }}>
          <div style={{ background: "#1e2329", borderRadius: 16, padding: 20, marginBottom: 16, fontFamily: "'JetBrains Mono', monospace", fontSize: 13, lineHeight: 1.7 }}>
            <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
              {["#ff5f57","#ffbd2e","#28c840"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
            </div>
            <div><span style={{ color: "#ff7b72" }}>class</span> <span style={{ color: "#79c0ff" }}>LearningPath</span> {"{"}</div>
            <div style={{ paddingLeft: 16 }}><span style={{ color: "#ff7b72" }}>def</span> <span style={{ color: "#d2a8ff" }}>accelerate</span>(self):</div>
            <div style={{ paddingLeft: 32 }}><span style={{ color: "#a5d6ff" }}>"Master skills fast"</span></div>
            <div style={{ paddingLeft: 16, color: "#3fb950" }}>return <span style={{ color: "#a5d6ff" }}>Success()</span></div>
            <div>{"}"}</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { icon: <Video size={16} color="#F97316" />,     lbl: "Live Class",   val: "Starting soon" },
              { icon: <Trophy size={16} color="#22c55e" />,    lbl: "Quiz Score",   val: "92/100" },
              { icon: <TrendingUp size={16} color="#3b82f6" />,lbl: "Progress",     val: "75% done" },
              { icon: <Award size={16} color="#a855f7" />,     lbl: "Certificate",  val: "1 earned" },
            ].map(m => (
              <div key={m.lbl} style={{ background: "var(--lh-card-bg)", border: "1px solid var(--lh-border)", borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ background: "var(--lh-icon-bg)", border: "1px solid var(--lh-border)", borderRadius: 8, padding: 7, display: "flex" }}>{m.icon}</div>
                <div>
                  <div style={{ fontSize: 11, color: "var(--lh-text-muted)", fontWeight: 500 }}>{m.lbl}</div>
                  <div style={{ fontSize: 13, color: "var(--lh-text)", fontWeight: 700 }}>{m.val}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", border: "2px solid rgba(249,115,22,0.15)", pointerEvents: "none" }} />
        </div>
      </div>
    </div>
  );
}

// ─── CARD COMPONENTS ─────────────────────────────────────────────────────────
function FeatureCard({ f }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ background: hovered ? `linear-gradient(145deg,${f.color}18 0%,var(--lh-card-bg) 60%)` : `linear-gradient(145deg,${f.color}0d 0%,var(--lh-card-bg) 55%)`, border: `1.5px solid ${hovered ? f.color+"60" : f.color+"28"}`, borderTop: `3px solid ${f.color}`, borderRadius: 18, padding: "26px 24px", boxShadow: hovered ? `0 12px 36px ${f.color}28` : `0 2px 12px ${f.color}12`, transform: hovered ? "translateY(-5px)" : "none", transition: "all 0.25s", cursor: "pointer", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: `${f.color}14`, filter: "blur(20px)", pointerEvents: "none", opacity: hovered ? 1 : 0.5, transition: "opacity 0.3s" }} />
      <div style={{ width: 52, height: 52, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, background: `linear-gradient(135deg,${f.color}28,${f.color}14)`, border: `1.5px solid ${f.color}40`, color: f.color, boxShadow: `0 4px 14px ${f.color}22` }}>
        {f.icon}
      </div>
      <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 700, color: f.color, marginBottom: 8, letterSpacing: "-0.02em" }}>{f.title}</h3>
      <p style={{ fontSize: 13.5, color: "var(--lh-text-sub)", lineHeight: 1.65 }}>{f.desc}</p>
    </div>
  );
}

function CourseCard({ c }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ background: "var(--lh-card-bg)", border: `1px solid ${hovered ? c.color+"40" : "var(--lh-border)"}`, borderRadius: 18, overflow: "hidden", boxShadow: hovered ? `0 10px 36px ${c.color}18` : "var(--lh-shadow)", transform: hovered ? "translateY(-3px)" : "none", transition: "all 0.25s" }}>
      <div style={{ height: 120, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52, background: `linear-gradient(135deg,${c.color}18,${c.color}08)` }}>{c.thumb}</div>
      <div style={{ padding: "20px 22px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ background: `${c.color}18`, color: c.color, borderRadius: 99, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>{c.tag}</span>
          <span style={{ color: c.color, fontWeight: 700, fontSize: 15, fontFamily: "'Space Grotesk', sans-serif" }}>{c.progress}%</span>
        </div>
        <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16.5, fontWeight: 600, color: "var(--lh-text)", margin: "0 0 14px", letterSpacing: "-0.02em" }}>{c.title}</h3>
        <ProgressBar value={c.progress} color={c.color} />
        <button style={{ width: "100%", marginTop: 18, background: c.color, color: "#fff", border: "none", borderRadius: 12, padding: 11, fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          <Play size={15} fill="white" stroke="none" /> Continue
        </button>
      </div>
    </div>
  );
}

function RoadmapSection() {
  return (
    <div style={{ maxWidth: 640, margin: "0 auto", position: "relative" }}>
      <div style={{ position: "absolute", left: 23, top: 24, bottom: 24, width: 2, background: "linear-gradient(to bottom, #F97316, var(--lh-border))" }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {ROADMAP.map(r => {
          const done = r.status === "done", cur = r.status === "current", locked = r.status === "locked";
          const dotBg = done ? "#F97316" : cur ? "rgba(249,115,22,0.12)" : "var(--lh-icon-bg)";
          const dotBorder = done || cur ? "#F97316" : "var(--lh-border)";
          const dotShadow = done ? "0 0 0 4px rgba(249,115,22,0.18)" : cur ? "0 0 0 6px rgba(249,115,22,0.1)" : "none";
          const statusLabel = done ? "✓ Done" : cur ? "→ Active" : "🔒 Locked";
          const statusStyle = done
            ? { background: "rgba(34,197,94,0.12)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.25)" }
            : cur
            ? { background: "rgba(249,115,22,0.12)", color: "#F97316", border: "1px solid rgba(249,115,22,0.25)" }
            : { background: "var(--lh-pill-bg)", color: "var(--lh-text-muted)", border: "1px solid var(--lh-border)" };
          return (
            <div key={r.topic} style={{ display: "flex", alignItems: "center", gap: 20, position: "relative" }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", flexShrink: 0, zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: dotBg, border: `2px solid ${dotBorder}`, boxShadow: dotShadow }}>
                {done ? <CheckCircle2 size={20} color="white" /> : cur ? <ArrowRight size={20} color="#F97316" /> : <Lock size={16} color="var(--lh-text-muted)" />}
              </div>
              <div style={{ flex: 1, background: "var(--lh-card-bg)", border: `1px solid ${cur ? "rgba(249,115,22,0.35)" : "var(--lh-border)"}`, borderRadius: 14, padding: "16px 20px", boxShadow: cur ? "0 4px 20px rgba(249,115,22,0.15)" : "var(--lh-shadow)", display: "flex", alignItems: "center", justifyContent: "space-between", opacity: locked ? 0.55 : 1 }}>
                <div>
                  <div style={{ fontSize: 11, color: "var(--lh-text-muted)", fontWeight: 600, marginBottom: 3, letterSpacing: "0.04em", textTransform: "uppercase" }}>{r.week}</div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 600, color: "var(--lh-text)", letterSpacing: "-0.02em" }}>{r.topic}</div>
                </div>
                <div style={{ ...statusStyle, borderRadius: 99, padding: "4px 12px", fontSize: 11.5, fontWeight: 700 }}>{statusLabel}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LiveCard({ sess }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ background: "var(--lh-card-bg)", border: `1px solid ${hovered ? sess.color+"40" : "var(--lh-border)"}`, borderRadius: 18, padding: 24, boxShadow: hovered ? `0 10px 32px ${sess.color}18` : "var(--lh-shadow)", transform: hovered ? "translateY(-3px)" : "none", transition: "all 0.25s" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
        <div style={{ width: 48, height: 48, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, flexShrink: 0, fontFamily: "'Space Grotesk', sans-serif", background: `${sess.color}20`, border: `2px solid ${sess.color}40`, color: sess.color }}>{sess.avatar}</div>
        <div style={{ flex: 1 }}>
          {sess.live && (
            <div style={{ background: "rgba(239,68,68,0.12)", color: "#ef4444", fontSize: 10.5, fontWeight: 700, padding: "2px 8px", borderRadius: 99, display: "inline-flex", alignItems: "center", gap: 4, marginBottom: 5 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ef4444", animation: "lhPulse 1.4s infinite", display: "inline-block" }} />
              LIVE
            </div>
          )}
          <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 600, color: "var(--lh-text)", margin: "0 0 4px", letterSpacing: "-0.02em" }}>{sess.title}</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--lh-text-muted)", fontSize: 13 }}>
            <Calendar size={13} /> {sess.time}
          </div>
          <div style={{ fontSize: 12, color: "var(--lh-text-sub)", marginTop: 4 }}>Trainer: {sess.trainer}</div>
        </div>
      </div>
      <button style={{ width: "100%", marginTop: 18, background: sess.live ? "#ef4444" : sess.color, color: "#fff", border: "none", borderRadius: 12, padding: 11, fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <Play size={15} fill="white" stroke="none" /> {sess.live ? "Join Now" : "Set Reminder"}
      </button>
      <style>{`@keyframes lhPulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
    </div>
  );
}

function QuizCard({ q }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ background: "var(--lh-card-bg)", border: `1px solid ${hovered ? q.color+"40" : "var(--lh-border)"}`, borderRadius: 18, padding: 24, boxShadow: hovered ? `0 8px 28px ${q.color}18` : "var(--lh-shadow)", transform: hovered ? "translateY(-3px)" : "none", transition: "all 0.25s" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div style={{ background: `${q.color}18`, border: `1px solid ${q.color}28`, borderRadius: 10, padding: 10, display: "flex", color: q.color }}>
          <ClipboardCheck size={20} />
        </div>
        {q.status === "completed"
          ? <span style={{ background: "rgba(34,197,94,0.12)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.25)", borderRadius: 8, padding: "4px 10px", fontSize: 11.5, fontWeight: 700 }}>✓ Done</span>
          : <span style={{ background: "var(--lh-pill-bg)", color: "var(--lh-text-muted)", border: "1px solid var(--lh-border)", borderRadius: 8, padding: "4px 10px", fontSize: 11.5, fontWeight: 600 }}>Pending</span>
        }
      </div>
      <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 17, fontWeight: 600, color: "var(--lh-text)", margin: "0 0 6px", letterSpacing: "-0.02em" }}>{q.title}</h3>
      <p style={{ fontSize: 13, color: "var(--lh-text-sub)", margin: "0 0 16px" }}>{q.questions} Questions</p>
      {q.score !== null && (
        <div style={{ background: `${q.color}12`, borderRadius: 10, padding: "10px 14px", marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, color: "var(--lh-text-sub)" }}>Your Score</span>
          <span style={{ fontSize: 18, fontWeight: 700, color: q.color, fontFamily: "'Space Grotesk', sans-serif" }}>{q.score}%</span>
        </div>
      )}
      <button style={{ width: "100%", background: q.status === "completed" ? "transparent" : q.color, color: q.status === "completed" ? q.color : "#fff", border: `1.5px solid ${q.color}`, borderRadius: 11, padding: 10, fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {q.status === "completed" ? "Retake Quiz" : "Attempt Now"}
      </button>
    </div>
  );
}

function TrainerCard({ tr }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ background: "var(--lh-card-bg)", border: `1px solid ${hovered ? tr.color+"40" : "var(--lh-border)"}`, borderRadius: 20, padding: "28px 24px", textAlign: "center", boxShadow: hovered ? `0 12px 40px ${tr.color}18` : "var(--lh-shadow)", transform: hovered ? "translateY(-4px)" : "none", transition: "all 0.25s" }}>
      <div style={{ width: 72, height: 72, borderRadius: "50%", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 22, fontFamily: "'Space Grotesk', sans-serif", background: `${tr.color}22`, border: `3px solid ${tr.color}50`, color: tr.color }}>{tr.initials}</div>
      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 700, color: "var(--lh-text)", marginBottom: 4, letterSpacing: "-0.02em" }}>{tr.name}</div>
      <div style={{ fontSize: 13.5, color: "var(--lh-text-sub)", marginBottom: 6 }}>{tr.role}</div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 20 }}>
        <span style={{ fontSize: 12, color: "var(--lh-text-muted)", display: "flex", alignItems: "center", gap: 4 }}><Clock size={12} /> {tr.exp} exp</span>
        <span style={{ color: "#f59e0b", fontSize: 12.5, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", display: "flex", alignItems: "center", gap: 3 }}><Star size={12} fill="#f59e0b" stroke="none" /> {tr.rating}</span>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <button style={{ flex: 1, border: "none", borderRadius: 10, padding: 10, fontWeight: 700, fontSize: 13.5, cursor: "pointer", background: tr.color, color: "#fff", fontFamily: "'Plus Jakarta Sans', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <MessageCircle size={14} /> Chat
        </button>
        <button style={{ flex: 1, background: "transparent", border: `1.5px solid ${tr.color}`, borderRadius: 10, padding: 10, fontWeight: 600, fontSize: 13.5, cursor: "pointer", color: tr.color, fontFamily: "'Plus Jakarta Sans', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <Calendar size={14} /> Schedule
        </button>
      </div>
    </div>
  );
}

function ResourceCard({ r }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ background: "var(--lh-card-bg)", border: `1px solid ${hovered ? r.color+"40" : "var(--lh-border)"}`, borderRadius: 18, padding: "26px 24px", boxShadow: hovered ? `0 8px 28px ${r.color}18` : "var(--lh-shadow)", transform: hovered ? "translateY(-4px)" : "none", transition: "all 0.25s", cursor: "pointer" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div style={{ background: `${r.color}14`, border: `1px solid ${r.color}28`, borderRadius: 12, padding: 11, color: r.color }}>{r.icon}</div>
        <span style={{ background: `${r.color}12`, color: r.color, fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 99 }}>{r.tag}</span>
      </div>
      <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 600, color: "var(--lh-text)", marginBottom: 8, letterSpacing: "-0.02em" }}>{r.title}</h3>
      <p style={{ fontSize: 13.5, color: "var(--lh-text-sub)", lineHeight: 1.65, marginBottom: 18 }}>{r.desc}</p>
      <div style={{ display: "flex", alignItems: "center", gap: 4, color: r.color, fontWeight: 600, fontSize: 13.5 }}>
        View All <ChevronRight size={15} />
      </div>
    </div>
  );
}

function CertCard({ c }) {
  return (
    <div style={{ background: "var(--lh-card-bg)", border: `2px solid ${c.status === "earned" ? c.color+"40" : "var(--lh-border)"}`, borderRadius: 20, padding: "28px 26px", position: "relative", overflow: "hidden", boxShadow: c.status === "earned" ? `0 8px 32px ${c.color}20` : "var(--lh-shadow)" }}>
      {c.status === "earned" && <div style={{ position: "absolute", top: -18, right: -18, width: 80, height: 80, borderRadius: "50%", background: `${c.color}15` }} />}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
        <div style={{ background: `${c.color}18`, border: `1.5px solid ${c.color}30`, borderRadius: 14, padding: 12, color: c.color }}>
          <Award size={26} />
        </div>
        <div>
          <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 600, color: "var(--lh-text)", margin: "0 0 3px", letterSpacing: "-0.02em" }}>{c.title}</h3>
          <div style={{ fontSize: 12.5, color: "var(--lh-text-muted)" }}>{c.date}</div>
        </div>
      </div>
      {c.status === "earned" && (
        <div style={{ background: `${c.color}10`, borderRadius: 12, padding: "10px 14px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, color: "var(--lh-text-sub)" }}>Final Grade</span>
          <span style={{ fontSize: 20, fontWeight: 700, color: c.color, fontFamily: "'Space Grotesk', sans-serif" }}>{c.grade}</span>
        </div>
      )}
      <button style={{ width: "100%", background: c.status === "earned" ? c.color : "transparent", color: c.status === "earned" ? "#fff" : "var(--lh-text-muted)", border: `1.5px solid ${c.status === "earned" ? c.color : "var(--lh-border)"}`, borderRadius: 11, padding: 11, fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {c.status === "earned" ? <><Download size={15} /> Download Certificate</> : <><Lock size={15} /> Complete Course</>}
      </button>
    </div>
  );
}

function ActivityRow({ a }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ background: "var(--lh-card-bg)", border: `1px solid ${hovered ? "rgba(249,115,22,0.3)" : "var(--lh-border)"}`, borderRadius: 14, padding: "16px 20px", display: "flex", alignItems: "center", gap: 16, boxShadow: "var(--lh-shadow)", transition: "border-color 0.2s" }}>
      <div style={{ borderRadius: 10, padding: 9, flexShrink: 0, display: "flex", background: `${a.iconColor}14`, border: `1px solid ${a.iconColor}28`, color: a.iconColor }}>{a.icon}</div>
      <div>
        <div style={{ fontSize: 14.5, fontWeight: 600, color: "var(--lh-text)", letterSpacing: "-0.01em" }}>{a.text}</div>
        <div style={{ fontSize: 12, color: "var(--lh-text-muted)", marginTop: 2 }}>{a.sub}</div>
      </div>
    </div>
  );
}

function CodingLab() {
  return (
    <div style={{ maxWidth: 840, margin: "0 auto" }}>
      <div style={{ background: "var(--lh-card-bg)", border: "1px solid var(--lh-border)", borderRadius: 22, overflow: "hidden", boxShadow: "var(--lh-shadow)" }}>
        <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--lh-border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ background: "rgba(249,115,22,0.12)", borderRadius: 10, padding: 8, display: "flex", color: "#F97316" }}>
              <Code2 size={18} />
            </div>
            <div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 17, color: "var(--lh-text)", letterSpacing: "-0.02em" }}>Reverse Linked List</div>
              <div style={{ fontSize: 12, color: "var(--lh-text-muted)", marginTop: 2 }}>Data Structures • Linked Lists</div>
            </div>
          </div>
          <span style={{ background: "rgba(245,158,11,0.12)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 8, padding: "5px 12px", fontSize: 12.5, fontWeight: 700, display: "flex", alignItems: "center", gap: 5 }}>
            <Zap size={13} /> Medium
          </span>
        </div>
        <div style={{ background: "#1e2329", padding: 24, fontFamily: "'JetBrains Mono', monospace", fontSize: 13.5, lineHeight: 1.7, overflowX: "auto" }}>
          {[
            ["1",  <><span style={{color:"#8b949e"}}>// Reverse a Linked List</span></>],
            ["2",  <><span style={{color:"#ff7b72"}}>class</span> <span style={{color:"#79c0ff"}}>ListNode</span> {"{"}</>],
            ["3",  <><span style={{paddingLeft:16,display:"inline-block"}}><span style={{color:"#ff7b72"}}>int</span> <span style={{color:"#e6edf3"}}>val</span>;</span></>],
            ["4",  <><span style={{paddingLeft:16,display:"inline-block"}}><span style={{color:"#79c0ff"}}>ListNode</span> <span style={{color:"#e6edf3"}}>next</span>;</span></>],
            ["5",  <span style={{color:"#e6edf3"}}>{"}"}</span>],
            ["6",  ""],
            ["7",  <><span style={{color:"#79c0ff"}}>ListNode</span> <span style={{color:"#d2a8ff"}}>reverse</span>(<span style={{color:"#79c0ff"}}>ListNode</span> <span style={{color:"#e6edf3"}}>head</span>) {"{"}</>],
            ["8",  <><span style={{paddingLeft:16,display:"inline-block"}}><span style={{color:"#79c0ff"}}>ListNode</span> <span style={{color:"#e6edf3"}}>prev</span> = <span style={{color:"#ff7b72"}}>null</span>;</span></>],
            ["9",  <><span style={{paddingLeft:16,display:"inline-block"}}><span style={{color:"#79c0ff"}}>ListNode</span> <span style={{color:"#e6edf3"}}>curr</span> = <span style={{color:"#e6edf3"}}>head</span>;</span></>],
            ["10", <><span style={{paddingLeft:16,display:"inline-block"}}><span style={{color:"#ff7b72"}}>while</span> (<span style={{color:"#e6edf3"}}>curr</span> != <span style={{color:"#ff7b72"}}>null</span>) {"{"}</span></>],
            ["11", <><span style={{paddingLeft:32,display:"inline-block"}}><span style={{color:"#79c0ff"}}>ListNode</span> <span style={{color:"#e6edf3"}}>next</span> = <span style={{color:"#e6edf3"}}>curr.next</span>;</span></>],
            ["12", <><span style={{paddingLeft:32,display:"inline-block"}}><span style={{color:"#e6edf3"}}>curr.next</span> = <span style={{color:"#e6edf3"}}>prev</span>;</span></>],
            ["13", <><span style={{paddingLeft:32,display:"inline-block"}}><span style={{color:"#e6edf3"}}>prev</span> = <span style={{color:"#e6edf3"}}>curr</span>;</span></>],
            ["14", <><span style={{paddingLeft:32,display:"inline-block"}}><span style={{color:"#e6edf3"}}>curr</span> = <span style={{color:"#e6edf3"}}>next</span>;</span></>],
            ["15", <><span style={{paddingLeft:16,display:"inline-block"}}>{"}"}</span></>],
            ["16", <><span style={{paddingLeft:16,display:"inline-block"}}><span style={{color:"#ff7b72"}}>return</span> <span style={{color:"#e6edf3"}}>prev</span>;</span></>],
            ["17", "}"],
          ].map(([ln, content]) => (
            <div key={ln}>
              <span style={{ color: "#555", minWidth: 28, userSelect: "none", display: "inline-block" }}>{ln}</span>
              {content}
            </div>
          ))}
        </div>
        <div style={{ padding: "20px 24px", borderTop: "1px solid var(--lh-border)", display: "flex", gap: 12 }}>
          <button style={{ flex: 1, background: "#F97316", color: "#fff", border: "none", borderRadius: 12, padding: 12, fontWeight: 700, fontSize: 14.5, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
            <Play size={16} fill="white" stroke="none" /> Solve Now
          </button>
          <button style={{ flex: 1, background: "transparent", color: "var(--lh-text)", border: "1.5px solid var(--lh-border)", borderRadius: 12, padding: 12, fontWeight: 600, fontSize: 14.5, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
            <BookMarked size={16} /> View Solutions
          </button>
        </div>
      </div>
    </div>
  );
}