import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowRight, Award, BookOpen,
  ChevronDown, Clock,
  GraduationCap, LogOut, Menu, Moon, Sparkles, Star, Sun,
  Target, TrendingUp, Trophy, User, Users, Zap
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import auth from "../../auth";
import heroStudent from "../../assets/hero-student.png";

const GOOGLE_CLIENT_ID = "572421778240-akk3kkb4f60ukuv9pcfrpg2ielm09thk.apps.googleusercontent.com";
const NEWSLETTER_KEY = "ilmora_newsletter_subscribers";

/* ─────────────────────────────────────────
   Newsletter helpers (localStorage)
───────────────────────────────────────── */
function getSubscribers() {
  try { return JSON.parse(localStorage.getItem(NEWSLETTER_KEY) || "[]"); }
  catch { return []; }
}
function saveSubscribers(list) {
  localStorage.setItem(NEWSLETTER_KEY, JSON.stringify(list));
}

/* ─────────────────────────────────────────
   NewsletterSection component
───────────────────────────────────────── */
function NewsletterSection() {
  const [email, setEmail]             = useState("");
  const [status, setStatus]           = useState("idle");
  const [showAdmin, setShowAdmin]     = useState(false);
  const [adminOk, setAdminOk]         = useState(false);
  const [adminCode, setAdminCode]     = useState("");
  const [subscribers, setSubscribers] = useState([]);
  const inputRef = useRef(null);

  const isValid = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleSubmit = () => {
    const trimmed = email.trim().toLowerCase();
    if (!isValid(trimmed)) { setStatus("error"); setTimeout(() => setStatus("idle"), 2500); return; }
    setStatus("loading");
    setTimeout(() => {
      const current = getSubscribers();
      if (current.some((s) => s.email === trimmed)) {
        setStatus("duplicate"); setTimeout(() => setStatus("idle"), 3000); return;
      }
      saveSubscribers([...current, { email: trimmed, subscribedAt: new Date().toISOString() }]);
      setStatus("success");
      setEmail("");
      setTimeout(() => setStatus("idle"), 3500);
    }, 600);
  };

  const openAdmin = () => {
    setSubscribers(getSubscribers());
    setShowAdmin(true);
  };

  const unlockAdmin = () => {
    if (adminCode === "ilmora2026") { setAdminOk(true); setAdminCode(""); }
    else { alert("Incorrect code"); }
  };

  const deleteSubscriber = (emailToDel) => {
    const updated = subscribers.filter((s) => s.email !== emailToDel);
    saveSubscribers(updated);
    setSubscribers(updated);
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

  const statusMsg = {
    success:   { text: "✓ You're subscribed! Welcome to ILM ORA.", color: "#68d391" },
    error:     { text: "Please enter a valid email address.",       color: "#fc8181" },
    duplicate: { text: "This email is already subscribed.",         color: "#f6ad55" },
  }[status];

  return (
    <>
      {/* ── Newsletter Banner ── */}
      <section style={{ background: "#1a1f2e", padding: "3.5rem 1.5rem", textAlign: "center" }}>
        <div style={{ maxWidth: "560px", margin: "0 auto" }}>

          {/* Heading */}
          <h2 style={{
  color: "#fff",
  fontSize: "clamp(1.1rem, 2.2vw, 1.75rem)",
  fontWeight: 700,
  margin: "0 0 1.6rem",
  lineHeight: 1.35,
  whiteSpace: "nowrap",
}}>
  Be the first to know what's new on{" "}
  <span style={{ color: "#22C55E" }}>ILM</span>{" "}
  <span style={{ color: "#F97316" }}>ORA</span>
</h2>

          {/* Input row — Maven style */}
          <div
            style={{
              display: "flex",
              maxWidth: "420px",
              margin: "0 auto",
              background: "rgba(255,255,255,0.07)",
              borderRadius: "10px",
              border: status === "error"   ? "1.5px solid #fc8181"
                    : status === "success" ? "1.5px solid #68d391"
                    : "1.5px solid rgba(255,255,255,0.18)",
              overflow: "hidden",
              transition: "border-color 0.25s",
            }}
          >
            <input
              ref={inputRef}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="your@email.com"
              disabled={status === "loading" || status === "success"}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#fff",
                fontSize: "15px",
                padding: "13px 18px",
                caretColor: "#F97316",
                minWidth: 0,
              }}
            />
            <button
              onClick={handleSubmit}
              disabled={status === "loading" || status === "success"}
              style={{
                background: status === "success" ? "#38a169" : "rgba(255,255,255,0.1)",
                border: "none",
                borderLeft: "1.5px solid rgba(255,255,255,0.18)",
                cursor: "pointer",
                padding: "0 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: "52px",
                transition: "background 0.25s",
              }}
              onMouseEnter={e => { if (status !== "success") e.currentTarget.style.background = "rgba(249,115,22,0.8)"; }}
              onMouseLeave={e => { if (status !== "success") e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
            >
              {status === "loading" ? (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="8" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5"/>
                  <path d="M10 2a8 8 0 0 1 8 8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                    <animateTransform attributeName="transform" type="rotate" from="0 10 10" to="360 10 10" dur="0.7s" repeatCount="indefinite"/>
                  </path>
                </svg>
              ) : status === "success" ? (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10l4 4 8-8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10h12M10 4l6 6-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          </div>

          {statusMsg && (
            <p style={{ marginTop: "0.7rem", fontSize: "13px", color: statusMsg.color, transition: "all 0.3s" }}>
              {statusMsg.text}
            </p>
          )}

          {/* Contact support line */}
          <p style={{ color: "#6b7280", fontSize: "13px", marginTop: "1.4rem" }}>
            Contact support:{" "}
            <a
              href="mailto:support@ilmora.com"
              style={{ color: "#9ca3af", textDecoration: "none" }}
              onMouseEnter={e => e.target.style.color = "#F97316"}
              onMouseLeave={e => e.target.style.color = "#9ca3af"}
            >
              support@ilmora.com
            </a>
          </p>
        </div>
      </section>

      {/* ── Admin Modal ── */}
      {showAdmin && (
        <div
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999,
          }}
          onClick={(e) => { if (e.target === e.currentTarget) { setShowAdmin(false); setAdminOk(false); } }}
        >
          <div style={{
            background: "#fff", borderRadius: "14px", padding: "2rem",
            width: "min(90vw,560px)", maxHeight: "80vh",
            display: "flex", flexDirection: "column", gap: "1rem",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "#111" }}>📊 Subscriber Admin</h3>
              <button
                onClick={() => { setShowAdmin(false); setAdminOk(false); }}
                style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#888" }}
              >✕</button>
            </div>

            {!adminOk ? (
              <div>
                <p style={{ color: "#666", fontSize: "14px", marginBottom: "1rem" }}>
                  Enter admin code to view subscribers:
                </p>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="password"
                    value={adminCode}
                    onChange={(e) => setAdminCode(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && unlockAdmin()}
                    placeholder="Admin code"
                    style={{
                      flex: 1, padding: "10px 14px",
                      border: "1.5px solid #e0e0e0", borderRadius: "8px",
                      fontSize: "14px", outline: "none",
                    }}
                  />
                  <button
                    onClick={unlockAdmin}
                    style={{
                      background: "#F97316", color: "#fff", border: "none",
                      borderRadius: "8px", padding: "10px 20px",
                      cursor: "pointer", fontSize: "14px", fontWeight: 600,
                    }}
                  >Unlock</button>
                </div>
                <p style={{ color: "#bbb", fontSize: "11px", marginTop: "8px" }}>Hint: ilmora2026</p>
              </div>
            ) : (
              <>
                <div style={{
                  background: "#f8fffe", border: "1px solid #d4f5e8",
                  borderRadius: "8px", padding: "12px 16px",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                  <span style={{ color: "#1a8f3c", fontWeight: 600, fontSize: "14px" }}>
                    Total Subscribers: {subscribers.length}
                  </span>
                  <button
                    onClick={() => setSubscribers(getSubscribers())}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#888", fontSize: "13px" }}
                  >↻ Refresh</button>
                </div>
                <div style={{ overflowY: "auto", flex: 1 }}>
                  {subscribers.length === 0 ? (
                    <p style={{ color: "#999", textAlign: "center", padding: "2rem", fontSize: "14px" }}>
                      No subscribers yet. Share the page!
                    </p>
                  ) : (
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                      <thead>
                        <tr style={{ borderBottom: "2px solid #f0f0f0" }}>
                          <th style={{ textAlign: "left", padding: "8px 12px", color: "#888", fontWeight: 600 }}>#</th>
                          <th style={{ textAlign: "left", padding: "8px 12px", color: "#888", fontWeight: 600 }}>Email</th>
                          <th style={{ textAlign: "left", padding: "8px 12px", color: "#888", fontWeight: 600 }}>Subscribed</th>
                          <th style={{ padding: "8px 12px" }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {subscribers.map((sub, i) => (
                          <tr key={sub.email} style={{ borderBottom: "1px solid #f5f5f5" }}>
                            <td style={{ padding: "10px 12px", color: "#bbb" }}>{i + 1}</td>
                            <td style={{ padding: "10px 12px", color: "#111", fontWeight: 500 }}>{sub.email}</td>
                            <td style={{ padding: "10px 12px", color: "#888" }}>{formatDate(sub.subscribedAt)}</td>
                            <td style={{ padding: "10px 12px", textAlign: "right" }}>
                              <button
                                onClick={() => deleteSubscriber(sub.email)}
                                style={{ background: "none", border: "none", cursor: "pointer", color: "#fc8181", fontSize: "16px" }}
                                title="Remove"
                              >🗑</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* hidden admin trigger */}
      <div id="newsletter-admin-trigger" onClick={openAdmin} style={{ display: "none" }} />
    </>
  );
}

/* ═══════════════════════════════════════════════════════
   Main Page
═══════════════════════════════════════════════════════ */
export default function LMSHomepage({ theme, toggleTheme }) {
  const [activeTab, setActiveTab] = useState("product");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const [modalEmail, setModalEmail]       = useState("");
  const [modalPassword, setModalPassword] = useState("");
  const [modalLoading, setModalLoading]   = useState(false);
  const [showModalPw, setShowModalPw]     = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      try { setUser(JSON.parse(userData)); }
      catch { sessionStorage.removeItem("user"); }
    }
  }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setShowLoginModal(false); };
    if (showLoginModal) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showLoginModal]);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const scrollToSection = (sectionId, tabName = null) => {
    if (window.location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        if (tabName) setActiveTab(tabName);
        document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    } else {
      if (tabName) setActiveTab(tabName);
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const redirectByRole = (role) => {
    switch ((role || "").toUpperCase()) {
      case "ADMIN":    navigate("/admin",    { replace: true }); break;
      case "TRAINER":  navigate("/trainer",  { replace: true }); break;
      case "BUSINESS": navigate("/business", { replace: true }); break;
      default:         navigate("/student",  { replace: true });
    }
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    if (modalLoading) return;
    setModalLoading(true);
    try {
      const ok = await auth.login({ email: modalEmail, password: modalPassword });
      if (ok) {
        const role = (auth.getCurrentRole() || "STUDENT").toUpperCase();
        localStorage.setItem("role", role);
        setShowLoginModal(false);
        redirectByRole(role);
      } else {
        alert("Login failed! Check your credentials.");
      }
    } catch (err) {
      alert("Login error: " + err.message);
    } finally {
      setModalLoading(false);
    }
  };

  const handleModalGoogle = async (res) => {
    try {
      localStorage.removeItem("lms_token");
      localStorage.removeItem("lms_user");
      localStorage.removeItem("role");
      const dec  = jwtDecode(res.credential);
      const resp = await auth.googleLogin({ idToken: res.credential });
      if (resp?.isNewUser === true) {
        localStorage.setItem("role", "STUDENT");
        localStorage.setItem("lms_user", JSON.stringify({
          name: dec.name, email: dec.email, role: "student", isNewUser: true,
        }));
        setShowLoginModal(false);
        navigate("/ilm-demo", { replace: true });
      } else {
        const role = (resp?.role || "STUDENT").toUpperCase();
        localStorage.setItem("role", role);
        localStorage.setItem("lms_user", JSON.stringify({
          name: dec.name, email: dec.email, role: role.toLowerCase(),
        }));
        setShowLoginModal(false);
        redirectByRole(role);
      }
    } catch (err) {
      try {
        const dec = jwtDecode(res.credential);
        localStorage.setItem("role", "STUDENT");
        localStorage.setItem("lms_user", JSON.stringify({
          name: dec.name, email: dec.email, role: "student", isNewUser: true,
        }));
        setShowLoginModal(false);
        navigate("/ilm-demo", { replace: true });
      } catch (_) {
        alert("Google login failed. Please try again.");
      }
    }
  };

  const companies = [
    { name: "Capgemini" }, { name: "Microsoft" }, { name: "Google" }, { name: "Texora" },
    { name: "Amazon" }, { name: "UFS" }, { name: "Apple" }, { name: "Cognizant" },
  ];

  const logoImages = {
    Capgemini: "/cap.jpg", Microsoft: "/Micrososft.jpg", Google: "/Google.jpg",
    Texora: "/Picture1.jpg", Amazon: "/Amazone.jpg", UFS: "/UFS-Logo.jpg",
    Apple: "/Apple.jpg", Cognizant: "/cognizant.jpg",
  };

  const CompanyLogo = ({ company }) =>
    logoImages[company.name]
      ? <img src={logoImages[company.name]} alt={company.name} className="w-full h-full object-contain" />
      : null;

  const courses = {
    product: [
      { id: 1, title: "Product Management Mastery", instructor: "Ex-Google PM", duration: "8 weeks", students: "2,500+", rating: 4.9, level: "Intermediate", description: "Master product lifecycle from ideation to launch. Learn roadmapping, prioritization, stakeholder management & metrics that matter.", modules: ["Discovery & Research", "Roadmapping", "Prioritization Frameworks", "Launch Strategy", "Metrics & Analytics"], price: "₹49,000", highlights: ["Live sessions with Google PMs", "Real case studies", "1:1 mentorship", "Job referral support"], liveSessions: 5, totalLessons: 81, projects: 3 },
      { id: 2, title: "Product Analytics", instructor: "Ex-Amazon", duration: "6 weeks", students: "1,800+", rating: 4.8, level: "Advanced", description: "Data-driven product decisions. Master A/B testing, cohort analysis, funnel optimization & retention strategies.", modules: ["SQL for Product Managers", "Experimentation", "Funnel Analysis", "Retention Metrics", "Customer Segmentation"], price: "₹39,000", highlights: ["Amazon case studies", "Live SQL projects", "Advanced Mixpanel", "Retention frameworks"], liveSessions: 4, totalLessons: 60, projects: 2 },
      { id: 3, title: "Product Strategy", instructor: "Ex-Meta", duration: "10 weeks", students: "2,100+", rating: 4.9, level: "Advanced", description: "Strategic frameworks for product success. Positioning, competitive analysis, growth strategies & portfolio management.", modules: ["Market Analysis", "Competitive Strategy", "Growth Playbooks", "Portfolio Management", "Pricing Strategy"], price: "₹59,000", highlights: ["Meta growth case studies", "Strategy templates", "Live workshops", "Executive simulations"], liveSessions: 6, totalLessons: 90, projects: 4 },
    ],
    design: [
      { id: 4, title: "UI/UX Design Bootcamp", instructor: "Ex-Airbnb Designer", duration: "12 weeks", students: "3,200+", rating: 5.0, level: "Beginner", description: "Complete UI/UX journey from research to prototype. Figma mastery, design systems & portfolio projects.", modules: ["User Research", "Wireframing", "Prototyping", "Design Systems", "Portfolio Building"], price: "₹69,000", highlights: ["Airbnb case studies", "Figma certification", "Live design reviews", "Job ready portfolio"], liveSessions: 8, totalLessons: 110, projects: 5 },
      { id: 5, title: "Design Systems", instructor: "Ex-Netflix", duration: "8 weeks", students: "1,500+", rating: 4.8, level: "Advanced", description: "Build scalable design systems like Netflix. Components, tokens, documentation & developer handoff.", modules: ["Component Libraries", "Design Tokens", "Documentation", "Dev Handoff", "Scale Patterns"], price: "₹45,000", highlights: ["Netflix system breakdown", "Figma + Storybook", "Live system audits", "Enterprise patterns"], liveSessions: 4, totalLessons: 70, projects: 3 },
      { id: 6, title: "User Research Pro", instructor: "Ex-Microsoft", duration: "6 weeks", students: "1,900+", rating: 4.7, level: "Intermediate", description: "Research methods that drive product decisions. Interviews, surveys, usability testing & synthesis.", modules: ["Interview Techniques", "Survey Design", "Usability Testing", "Synthesis Methods", "Stakeholder Reports"], price: "₹35,000", highlights: ["Microsoft research frameworks", "Live user testing", "Report templates", "Stakeholder presentations"], liveSessions: 3, totalLessons: 55, projects: 2 },
    ],
    growth: [
      { id: 7, title: "Growth Marketing", instructor: "Ex-Uber Growth", duration: "8 weeks", students: "2,800+", rating: 4.9, level: "Intermediate", description: "Growth loops, viral mechanics & acquisition strategies that scale businesses.", modules: ["Growth Frameworks", "Viral Loops", "Acquisition Channels", "Experimentation", "Scaling"], price: "₹49,000", highlights: ["Uber growth case studies", "Live experiments", "Channel deep dives", "Scaling frameworks"], liveSessions: 5, totalLessons: 75, projects: 3 },
      { id: 8, title: "SEO & Content Strategy", instructor: "Ex-Spotify", duration: "10 weeks", students: "2,300+", rating: 4.8, level: "Intermediate", description: "Organic growth mastery. Technical SEO, content systems & link building at scale.", modules: ["Technical SEO", "Content Systems", "Link Building", "Analytics", "Scaling Organic"], price: "₹55,000", highlights: ["Spotify SEO case studies", "Live audits", "Content calendars", "Enterprise SEO"], liveSessions: 5, totalLessons: 85, projects: 3 },
      { id: 9, title: "Performance Marketing", instructor: "Ex-Swiggy", duration: "8 weeks", students: "2,600+", rating: 4.9, level: "Advanced", description: "Paid acquisition at scale. Facebook, Google, creative testing & LTV optimization.", modules: ["Facebook Ads", "Google Ads", "Creative Strategy", "LTV Optimization", "Scaling"], price: "₹47,000", highlights: ["Swiggy ad case studies", "Live campaign builds", "Creative testing", "ROAS frameworks"], liveSessions: 5, totalLessons: 72, projects: 4 },
    ],
  };

  const testimonials = [
    { name: "Priya Sharma", role: "Product Manager @ Flipkart", text: "LMS helped me transition from engineering to PM. The mentorship was invaluable!" },
    { name: "Rahul Verma", role: "UX Designer @ Zomato", text: "Best investment in my career. Landed my dream job within 3 months of completing the course." },
    { name: "Ananya Singh", role: "Growth Lead @ CRED", text: "The practical insights and real-world case studies made all the difference." },
  ];

  const features = [
    { icon: Target, title: "Project-Based Learning", description: "Build real-world projects that showcase your skills" },
    { icon: Users, title: "Expert Mentorship", description: "Learn from professionals at top tech companies" },
    { icon: Trophy, title: "Career Support", description: "Get help with resumes, interviews & job referrals" },
    { icon: Zap, title: "Live Sessions", description: "Interactive workshops with industry experts" },
  ];

  const stats = [
    { value: "50K+", label: "Active Learners" },
    { value: "95%",  label: "Success Rate" },
    { value: "100+", label: "Expert Mentors" },
    { value: "4.9★", label: "Average Rating" },
  ];

  const mentorBenefits = [
    { icon: Award,       text: "1:1 mentorship and small cohort learning" },
    { icon: TrendingUp,  text: "Project reviews with detailed feedback" },
    { icon: Users,       text: "Peer community for accountability and networking" },
  ];

  const careerSupport = [
    { icon: Target, title: "Portfolio Support",   description: "Turn your projects into case studies hiring managers love" },
    { icon: Award,  title: "Interview Prep",      description: "Mock interviews, feedback and guidance on role expectations" },
    { icon: Users,  title: "Referrals & Network", description: "Warm intros to hiring teams and community-led referrals" },
  ];

  const getLevelColor = (level) => ({
    Beginner:     "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    Intermediate: "bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20",
    Advanced:     "bg-[#1E293B]/10 text-[#1E293B] dark:bg-white/10 dark:text-white border border-[#1E293B]/20 dark:border-white/20",
  }[level] || "bg-gray-100 text-gray-700");

  const navLinks = [
    { text: "Courses",         href: "#courses" },
    { text: "Mentors",         href: "#mentors" },
    { text: "Success Stories", href: "#successstories" },
  ];

  const openNewsletterAdmin = () => {
    document.getElementById("newsletter-admin-trigger")?.click();
  };

  return (
    <div className="min-h-screen bg-[#F6EDE6] dark:bg-black text-[#1E293B] dark:text-white">

      {/* ── Nav ── */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 dark:bg-black/95 backdrop-blur-xl shadow-md"
            : "bg-white/80 dark:bg-black/80 backdrop-blur-md"
        } border-b border-[#F97316]/20 dark:border-gray-800`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">

            <div
              className="flex items-center cursor-pointer hover:scale-105 transition-transform"
              onClick={() => navigate("/")}
            >
              <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-wide font-serif whitespace-nowrap">
                <span className="text-green-600">ILM</span>
                <span className="text-[#F97316] ml-1 sm:ml-2">ORA</span>
              </span>
            </div>

            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map(link => (
                <a key={link.text} href={link.href} className="text-[#1E293B] dark:text-gray-300 hover:text-[#F97316] font-medium transition-colors">{link.text}</a>
              ))}
              <Button variant="ghost" onClick={() => navigate("/explore-programs")} className="font-medium text-[#1E293B] dark:text-gray-300 hover:text-[#F97316]">
                Free Services
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-[#F6EDE6] dark:hover:bg-gray-900 transition shadow-sm bg-white dark:bg-black"
              >
                {theme === "dark" ? <Sun className="w-5 h-5 text-[#F97316]" /> : <Moon className="w-5 h-5 text-[#1E293B]" />}
              </button>

              {user ? (
                <div className="hidden lg:block">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-3 rounded-xl border-gray-200 dark:border-gray-700">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={user.picture} alt={user.name} />
                          <AvatarFallback className="bg-[#1E293B] text-white">{user.name?.charAt(0) || <User className="w-4 h-4" />}</AvatarFallback>
                        </Avatar>
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-72 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                      <div className="px-3 py-3 bg-[#F6EDE6] dark:bg-gray-800 rounded-t-md">
                        <p className="font-semibold text-sm text-[#1E293B] dark:text-white truncate">{user.name || "User"}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <DropdownMenuSeparator />
                      {[
                        { icon: GraduationCap, label: "My Learning", desc: "View your courses", path: "/my-learning" },
                        { icon: User,          label: "Edit Profile", desc: "Update your info",  path: "/edit-profile" },
                      ].map(item => (
                        <DropdownMenuItem key={item.label} onClick={() => navigate(item.path)} className="gap-3 cursor-pointer">
                          <div className="w-8 h-8 rounded-lg bg-[#F97316]/10 flex items-center justify-center">
                            <item.icon className="w-4 h-4 text-[#F97316]" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{item.label}</p>
                            <p className="text-xs text-gray-500">{item.desc}</p>
                          </div>
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="gap-3 text-red-600 cursor-pointer">
                        <LogOut className="w-4 h-4" /><span className="text-sm font-medium">Logout</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <Button
                  onClick={() => setShowLoginModal(true)}
                  className="bg-[#1E293B] hover:bg-[#334155] text-white font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
                >
                  <Sparkles className="w-4 h-4" /> Get Started
                </Button>
              )}

              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="ghost" size="icon" className="rounded-xl"><Menu className="w-6 h-6" /></Button>
                </SheetTrigger>
                <SheetContent className="bg-white dark:bg-gray-900">
                  <div className="flex flex-col gap-4 mt-8">
                    {navLinks.map(link => (
                      <a key={link.text} href={link.href} className="text-lg font-medium hover:text-[#F97316] transition-colors" onClick={() => setMobileMenuOpen(false)}>{link.text}</a>
                    ))}
                    <Button variant="ghost" onClick={() => { navigate("/explore-programs"); setMobileMenuOpen(false); }} className="justify-start text-lg font-medium">Free Services</Button>
                    <Separator className="my-4" />
                    {user ? (
                      <>
                        <Button onClick={() => { navigate("/my-learning"); setMobileMenuOpen(false); }} className="w-full bg-[#1E293B] hover:bg-[#334155]">My Learning</Button>
                        <Button variant="destructive" onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="w-full">Logout</Button>
                      </>
                    ) : (
                      <Button
                        onClick={() => { setMobileMenuOpen(false); setShowLoginModal(true); }}
                        className="w-full bg-[#1E293B] hover:bg-[#334155] text-white font-bold flex items-center justify-center gap-2 rounded-xl"
                      >
                        <Sparkles className="w-4 h-4" /> Get Started
                      </Button>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="pt-32 pb-24 px-6 bg-[#F6EDE6] dark:bg-black relative overflow-hidden">
        <div className="absolute -top-32 left-[10%] w-[600px] h-[600px] bg-[#F97316]/8 dark:bg-[#F97316]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-20 right-[5%] w-[500px] h-[500px] bg-[#1E293B]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          <div className="text-center lg:text-left">
            <div className="mb-8 inline-flex">
              <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-900 border border-[#F97316]/30 text-[#F97316] px-5 py-2.5 rounded-full text-sm font-semibold shadow-md">
                <Sparkles className="w-4 h-4" />
                Advanced Learning Platform for Modern Professionals
              </div>
            </div>
            <h1 className="text-4xl md:text-4xl lg:text-6xl font-bold mb-6 leading-tight text-[#1E293B] dark:text-white">
              Become the <span className="text-[#F97316]">Top 1%</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-xl leading-relaxed">
              Learn Product, Design, Growth & Marketing from industry experts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center lg:items-start">
              <button
                onClick={() => navigate("/explore-programs")}
                className="flex items-center gap-2 bg-[#1E293B] hover:bg-[#334155] text-white font-bold px-8 py-4 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                Start Learning <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex justify-center">
            <img
              src={heroStudent}
              alt="Hero Student"
              className="w-full max-w-lg object-contain drop-shadow-2xl hover:scale-105 transition duration-500"
            />
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16 px-6 bg-white dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="bg-[#F6EDE6] dark:bg-gray-900 rounded-2xl p-8 text-center border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
              <div className="text-4xl md:text-5xl font-bold text-[#F97316] mb-2">{stat.value}</div>
              <p className="text-gray-600 dark:text-gray-300 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 px-6 bg-[#F6EDE6] dark:bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#1E293B] dark:text-white">
              Why Choose
              <span className="ml-2">
                <span className="text-green-600">ILM</span>{" "}
                <span className="text-[#F97316]">ORA</span>
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Everything you need to accelerate your career growth</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all group">
                <div className="w-14 h-14 bg-[#1E293B] dark:bg-[#F97316] rounded-2xl flex items-center justify-center mb-5 group-hover:scale-105 transition-transform shadow-sm">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#1E293B] dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Companies ── */}
      <section className="py-20 px-6 bg-white dark:bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-4 font-bold">Trusted By Professionals At</p>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1E293B] dark:text-white">Top Global <span className="text-[#F97316]">Companies</span></h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {companies.map((company) => (
              <div key={company.name} className="group bg-[#F6EDE6] dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 flex items-center justify-center shadow-sm hover:shadow-md hover:-translate-y-2 hover:border-[#F97316]/30 transition-all">
                <div className="w-16 h-16 flex items-center justify-center opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all">
                  <CompanyLogo company={company} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Courses ── */}
      <section id="courses" className="py-24 px-6 scroll-mt-20 bg-[#F6EDE6] dark:bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#1E293B] dark:text-white">Featured <span className="text-[#F97316]">Programs</span></h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Choose your path and start building skills that matter</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-12 p-1.5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
              {["product", "design", "growth"].map(tab => (
                <TabsTrigger key={tab} value={tab} className="rounded-xl capitalize font-semibold data-[state=active]:bg-[#1E293B] data-[state=active]:text-white dark:data-[state=active]:bg-[#F97316] transition-all">
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(courses).map(([category, categoryCourses]) => (
              <TabsContent key={category} value={category}>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {categoryCourses.map(course => (
                    <div
                      key={course.id}
                      onClick={() => navigate("/course-details", { state: { course } })}
                      className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden cursor-pointer"
                    >
                      <div className="h-1 bg-[#F97316]" />
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getLevelColor(course.level)}`}>{course.level}</span>
                          <span className="flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-full border border-amber-200 dark:border-amber-800">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />{course.rating}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-[#1E293B] dark:text-white mb-1 group-hover:text-[#F97316] transition-colors">{course.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{course.instructor}</p>
                        <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-2 leading-relaxed text-sm">{course.description}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
                          <div className="flex items-center gap-1"><Clock className="w-4 h-4 text-[#F97316]" />{course.duration}</div>
                          <div className="flex items-center gap-1"><Users className="w-4 h-4 text-[#F97316]" />{course.students}</div>
                          <div className="flex items-center gap-1"><BookOpen className="w-4 h-4 text-[#F97316]" />{course.modules.length}</div>
                        </div>
                        <button className="w-full bg-[#1E293B] hover:bg-[#334155] text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all group-hover:scale-[1.02] shadow-sm">
                          View Details <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* ── Mentors ── */}
      <section id="mentors" className="py-24 px-6 scroll-mt-20 bg-white dark:bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#1E293B] dark:text-white">Learn from <span className="text-[#F97316]">Industry Experts</span></h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-10 max-w-xl">Sessions led by operators from top product companies so you understand how work happens in the real world.</p>
              <div className="space-y-4">
                {mentorBenefits.map((item, i) => (
                  <div key={i} className="bg-[#F6EDE6] dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#1E293B] dark:bg-[#F97316] rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 font-medium pt-1">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {testimonials.map((t, i) => (
                <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-5 italic leading-relaxed text-sm">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#1E293B] dark:bg-[#F97316] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">{t.name.charAt(0)}</div>
                    <div>
                      <p className="font-semibold text-[#1E293B] dark:text-white text-sm">{t.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Career Support ── */}
      <section id="successstories" className="py-24 px-6 scroll-mt-20 bg-[#F6EDE6] dark:bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#1E293B] dark:text-white">Career Support That <span className="text-[#F97316]">Delivers Results</span></h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">Get help with interview prep, portfolios, referrals and role mapping</p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {careerSupport.map((item, i) => (
              <div key={i} className="group bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all">
                <div className="w-16 h-16 bg-[#1E293B] dark:bg-[#F97316] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform shadow-sm">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#1E293B] dark:text-white mb-3">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
          <div className="bg-[#1E293B] dark:bg-gray-900 rounded-3xl p-14 text-center relative overflow-hidden border border-[#F97316]/20 shadow-xl">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#F97316]" />
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#F97316]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#F97316]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative max-w-3xl mx-auto">
              <h3 className="text-3xl md:text-5xl font-bold mb-6 text-white">Ready to Transform Your Career?</h3>
              <p className="text-lg text-gray-300 mb-10">Join 50,000+ professionals who've already taken the leap</p>
              <button
                onClick={() => {
                  navigate("/explore-programs");
                  setTimeout(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, 200);
                }}
                className="group inline-flex items-center gap-2 bg-[#F97316] hover:bg-[#ea6c0a] text-white px-10 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
              >
                Explore Free Services
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <NewsletterSection />

      {/* ── Footer ── */}
      {/* ═══════════════════════════════════════════════════════
          RESPONSIVE FOOTER FIX:
          - Mobile (default):  single column, all sections stack
          - sm (≥640px):       2-column grid; logo spans both cols
          - lg (≥1024px):      5-column row (original desktop layout)
      ═══════════════════════════════════════════════════════ */}
      <footer className="bg-white text-[#1E293B]">
        <div className="max-w-7xl mx-auto px-6 py-20">

          {/* ── FIXED: responsive grid ── */}
          <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 items-start">

            {/* ── Col 1: Logo + Desc + Social — spans full width on sm ── */}
            <div className="flex flex-col gap-2.5 self-start text-left sm:col-span-2 lg:col-span-1">
              <h3 className="text-3xl font-extrabold leading-none">
                <span className="text-green-600">ILM</span>{" "}
                <span className="text-[#F97316]">ORA</span>
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Modern learning platform for ambitious professionals who want to break into product, design and growth roles.
              </p>
              <p className="text-sm text-gray-500">
                📧{" "}
                <a href="mailto:support@ilmora.com" className="hover:text-[#F97316] transition-colors">
                  support@ilmora.com
                </a>
              </p>
              <p className="text-sm text-gray-500">📍 New Delhi, India</p>

              {/* Social Icons */}
              <div className="flex items-center gap-3 pt-1 flex-wrap">
                {/* YouTube */}
                <a href="https://www.youtube.com/@Texoraai" target="_blank" rel="noreferrer"
                  className="h-9 w-9 rounded-full flex items-center justify-center text-white bg-[#FF0000] hover:scale-110 hover:shadow-md transition-all">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                {/* LinkedIn */}
                <a href="https://www.linkedin.com/company/105596104" target="_blank" rel="noreferrer"
                  className="h-9 w-9 rounded-full flex items-center justify-center text-white bg-[#0A66C2] hover:scale-110 hover:shadow-md transition-all">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                {/* WhatsApp */}
                <a href="https://api.whatsapp.com/send?phone=919210970334" target="_blank" rel="noreferrer"
                  className="h-9 w-9 rounded-full flex items-center justify-center text-white bg-[#25D366] hover:scale-110 hover:shadow-md transition-all">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                  </svg>
                </a>
                {/* Instagram */}
                <a href="https://www.instagram.com/texora_ai" target="_blank" rel="noreferrer"
                  className="h-9 w-9 rounded-full flex items-center justify-center text-white hover:scale-110 hover:shadow-md transition-all"
                  style={{ background: "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)" }}>
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                  </svg>
                </a>
                {/* X (Twitter) */}
                <a href="https://x.com/texoraai" target="_blank" rel="noreferrer"
                  className="h-9 w-9 rounded-full flex items-center justify-center text-white bg-black hover:scale-110 hover:shadow-md transition-all">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L2.062 2.25H8.28l4.259 5.63 5.704-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* ── Col 2: Programs ── */}
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-bold tracking-widest text-[#1E293B] uppercase">Programs</h4>
              <ul className="flex flex-col gap-2.5 text-sm text-gray-600">
                {[
                  { label: "Product Management", action: () => scrollToSection("courses", "product") },
                  { label: "Growth Marketing",   action: () => scrollToSection("courses", "growth") },
                  { label: "UI / UX Design",     action: () => scrollToSection("courses", "design") },
                ].map(item => (
                  <li key={item.label} onClick={item.action}
                    className="hover:text-[#F97316] cursor-pointer transition-colors flex items-center gap-1.5 group">
                    <span className="w-1 h-1 rounded-full bg-[#F97316] opacity-0 group-hover:opacity-100 transition-all shrink-0" />
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Col 3: Resources ── */}
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-bold tracking-widest text-[#1E293B] uppercase">Resources</h4>
              <ul className="flex flex-col gap-2.5 text-sm text-gray-600">
                <li onClick={() => scrollToSection("successstories")}
                  className="hover:text-[#F97316] cursor-pointer transition-colors flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-[#F97316] opacity-0 group-hover:opacity-100 transition-all shrink-0" />
                  Success Stories
                </li>
                <li onClick={() => { navigate("/explore-programs"); setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 250); }}
                  className="hover:text-[#F97316] cursor-pointer transition-colors flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-[#F97316] opacity-0 group-hover:opacity-100 transition-all shrink-0" />
                  Free Services
                </li>
                <li onClick={() => window.open("https://texora.ai/blogs", "_blank")}
                  className="hover:text-[#F97316] cursor-pointer transition-colors flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-[#F97316] opacity-0 group-hover:opacity-100 transition-all shrink-0" />
                  Blogs
                </li>
                <li onClick={() => window.open("https://texora.ai/use-cases", "_blank")}
                  className="hover:text-[#F97316] cursor-pointer transition-colors flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-[#F97316] opacity-0 group-hover:opacity-100 transition-all shrink-0" />
                  Use Cases
                </li>
                <li onClick={() => window.open("https://texora.ai/product-updates", "_blank")}
                  className="hover:text-[#F97316] cursor-pointer transition-colors flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-[#F97316] opacity-0 group-hover:opacity-100 transition-all shrink-0" />
                  Product Updates
                </li>
                <li onClick={() => window.open("https://texora.ai/company-news", "_blank")}
                  className="hover:text-[#F97316] cursor-pointer transition-colors flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-[#F97316] opacity-0 group-hover:opacity-100 transition-all shrink-0" />
                  Company News
                </li>
              </ul>
            </div>

            {/* ── Col 4: Company ── */}
            <div className="flex flex-col gap-4 self-start">
              <h4 className="text-sm font-bold tracking-widest text-[#1E293B] uppercase">Company</h4>
              <ul className="flex flex-col gap-2.5 text-sm text-gray-600">
                {[
                  { label: "About Us",         action: () => navigate("/about") },
                  { label: "Careers",          action: () => navigate("/careers") },
                  { label: "Pricing",          action: () => navigate("/pricing") },
                  { label: "Privacy Policy",   action: () => navigate("/privacy-policy") },
                  { label: "Terms of Service", action: () => navigate("/terms-of-service") },
                ].map(item => (
                  <li key={item.label} onClick={item.action}
                    className="hover:text-[#F97316] cursor-pointer transition-colors flex items-center gap-1.5 group">
                    <span className="w-1 h-1 rounded-full bg-[#F97316] opacity-0 group-hover:opacity-100 transition-all shrink-0" />
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Col 5: Support ── */}
            <div className="flex flex-col gap-4 self-start">
              <h4 className="text-sm font-bold tracking-widest text-[#1E293B] uppercase">Support</h4>
              <ul className="flex flex-col gap-2.5 text-sm text-gray-600">
                {[
                  { label: "Help Center", action: () => navigate("/help-center") },
                  { label: "Contact",     action: () => navigate("/contact") },
                  { label: "FAQ",         action: () => navigate("/faq") },
                ].map(item => (
                  <li key={item.label} onClick={item.action}
                    className="hover:text-[#F97316] cursor-pointer transition-colors flex items-center gap-1.5 group">
                    <span className="w-1 h-1 rounded-full bg-[#F97316] opacity-0 group-hover:opacity-100 transition-all shrink-0" />
                    {item.label}
                  </li>
                ))}
              </ul>
              {/* Live status badge */}
              <div className="pt-1">
                <span className="inline-flex items-center gap-2 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Status: Live
                </span>
              </div>
            </div>

          </div>

          {/* ── Bottom bar ── */}
          <div className="border-t border-gray-200 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <span>© {new Date().getFullYear()} ILM ORA All rights reserved.</span>
            <div className="flex items-center gap-2">
              <span>Built with</span>
              <span className="text-red-500 text-base">❤️</span>
              <span>passion for modern learners</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ══════════════════════════════════════════
          ── Login Modal Popup ──
      ══════════════════════════════════════════ */}
      {showLoginModal && (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(5px)" }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowLoginModal(false); }}
          >
            <div
              className="relative w-full max-w-md rounded-2xl shadow-2xl"
              style={{
                background: "rgba(255,255,255,0.97)",
                border: "1px solid rgba(249,115,22,0.18)",
                padding: "36px 32px 28px",
                animation: "modalFadeUp 0.3s ease both",
              }}
            >
              <style>{`
                @keyframes modalFadeUp {
                  from { opacity: 0; transform: translateY(20px) scale(0.97); }
                  to   { opacity: 1; transform: translateY(0)   scale(1);    }
                }
              `}</style>

              <button
                onClick={() => setShowLoginModal(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition text-xl font-bold leading-none"
                aria-label="Close"
              >×</button>

              <div className="flex justify-center mb-5">
                <span className="text-4xl font-extrabold font-serif tracking-wide">
                  <span className="text-green-600">ILM</span>
                  <span className="text-[#F97316] ml-2">ORA</span>
                </span>
              </div>

              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-[#1e0e02] mb-1">Welcome back!</h2>
                <p className="text-sm text-[#8a6040]">
                  Don't have an account?{" "}
                  <button
                    onClick={() => { setShowLoginModal(false); navigate("/complete-profile"); }}
                    className="text-[#F97316] font-bold hover:underline bg-transparent border-none cursor-pointer text-sm p-0"
                  >Apply now</button>
                </p>
              </div>

              <div className="flex justify-center mb-5">
                <GoogleLogin
                  onSuccess={handleModalGoogle}
                  onError={() => console.error("Google OAuth failed")}
                  theme="outline"
                  size="large"
                  text="continue_with"
                  shape="rectangular"
                  width="360"
                  auto_select={false}
                  cancel_on_tap_outside={true}
                />
              </div>

              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px" style={{ background: "rgba(180,100,30,0.15)" }} />
                <span className="text-xs text-[#b8906a] uppercase tracking-widest font-medium">OR</span>
                <div className="flex-1 h-px" style={{ background: "rgba(180,100,30,0.15)" }} />
              </div>

              <form onSubmit={handleModalSubmit}>
                <div className="mb-3">
                  <label className="block text-xs font-bold text-[#8a6040] mb-1.5 uppercase tracking-widest">Email</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={modalEmail}
                    onChange={e => setModalEmail(e.target.value)}
                    required
                    disabled={modalLoading}
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm text-[#1a0e06] placeholder-[#c0a070] outline-none transition-all disabled:opacity-50"
                    style={{ background: "rgba(255,255,255,0.8)", border: "1.5px solid rgba(180,120,60,0.2)" }}
                    onFocus={e => { e.target.style.borderColor = "#F97316"; e.target.style.boxShadow = "0 0 0 3px rgba(249,115,22,0.1)"; e.target.style.background = "#fff"; }}
                    onBlur={e => { e.target.style.borderColor = "rgba(180,120,60,0.2)"; e.target.style.boxShadow = "none"; }}
                  />
                </div>

                <div className="mb-2">
                  <label className="block text-xs font-bold text-[#8a6040] mb-1.5 uppercase tracking-widest">Password</label>
                  <div className="relative">
                    <input
                      type={showModalPw ? "text" : "password"}
                      placeholder="Enter your password"
                      value={modalPassword}
                      onChange={e => setModalPassword(e.target.value)}
                      required
                      disabled={modalLoading}
                      className="w-full px-3.5 py-2.5 pr-11 rounded-xl text-sm text-[#1a0e06] placeholder-[#c0a070] outline-none transition-all disabled:opacity-50"
                      style={{ background: "rgba(255,255,255,0.8)", border: "1.5px solid rgba(180,120,60,0.2)" }}
                      onFocus={e => { e.target.style.borderColor = "#F97316"; e.target.style.boxShadow = "0 0 0 3px rgba(249,115,22,0.1)"; e.target.style.background = "#fff"; }}
                      onBlur={e => { e.target.style.borderColor = "rgba(180,120,60,0.2)"; e.target.style.boxShadow = "none"; }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowModalPw(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b8906a] hover:text-[#F97316] transition flex items-center justify-center p-0 bg-transparent border-none cursor-pointer"
                      tabIndex={-1}
                    >
                      {showModalPw ? (
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                          <line x1="1" y1="1" x2="23" y2="23"/>
                        </svg>
                      ) : (
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="text-right mb-5">
                  <button
                    type="button"
                    onClick={() => { setShowLoginModal(false); navigate("/forgot-password"); }}
                    className="text-xs text-[#F97316] hover:underline bg-transparent border-none cursor-pointer font-medium p-0"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={modalLoading}
                  className="w-full py-3 rounded-xl font-bold text-white text-sm transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ background: "linear-gradient(135deg,#F97316,#ea580c)", boxShadow: "0 4px 18px rgba(249,115,22,0.32)" }}
                >
                  {modalLoading ? (
                    <>
                      <span className="inline-block w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Signing in…
                    </>
                  ) : "Log in"}
                </button>
              </form>

              <div className="text-center mt-5">
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="text-xs text-[#b8906a] hover:text-[#8a6040] bg-transparent border-none cursor-pointer transition-colors"
                >
                  ← Back to home
                </button>
              </div>
            </div>
          </div>
        </GoogleOAuthProvider>
      )}

    </div>
  );
}



