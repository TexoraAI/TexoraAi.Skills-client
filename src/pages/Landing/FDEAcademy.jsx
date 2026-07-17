import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen, Users, FlaskConical, Trophy, ChevronDown,
  Zap, Target, Code2, Briefcase, CheckCircle2, ArrowRight,
  Download, Send, Star, Globe, Shield, TrendingUp,
  GraduationCap, Layers, Brain, Rocket,
  Award, Calendar, MapPin, Heart,
} from "lucide-react";
import slide1 from "/FDE Academy/1.webp";
import slide2 from "/FDE Academy/2.webp";
import slide3 from "/FDE Academy/3.webp";
import slide4 from "/FDE Academy/4.webp";

// ✅ Shared shell used by every other public page (Careers, About, Pricing,
// Terms of Service, etc). Rendering inside it gives this page the exact
// same AnnouncementBanner → Navbar → ... → Footer as every other public
// page — so there is only ONE navbar and ONE footer across the whole site.
import PublicLayout from "../Landing/components/PublicLayout";

/* ═══════════════════════════════════════════════════════════
   Same LIGHT/DARK palette as TermsOfService.jsx, so this page's
   light/dark theme matches every other public page exactly.
═══════════════════════════════════════════════════════════ */
const LIGHT = {
  bg:           "#fbeee0",
  surface:      "#ffffff",
  bgSub:        "#fdf5ec",
  bgSubDark:    "#f5e8d5",
  border:       "#e8d9c4",
  borderMid:    "#d5c4aa",
  heading:      "#1a2340",
  navy:         "#1a2340",
  orange:       "#F97316",
  orangeHov:    "#ea6b0e",
  orangeLight:  "#fff3e8",
  orangeBorder: "#fcd4a8",
  green:        "#16a34a",
  greenLight:   "#e8f5ef",
  greenBorder:  "#a3d9bc",
  teal:         "#0d9488",
  rose:         "#e11d48",
  roseLight:    "#fef2f4",
  amber:        "#d97706",
  pink:         "#db2777",
  muted:        "#5a6173",
  muted2:       "#8a93a8",
};

const DARK = {
  bg:           "#0d1117",
  surface:      "#161b26",
  bgSub:        "#161d2b",
  bgSubDark:    "#0a0e17",
  border:       "#2a3245",
  borderMid:    "#3a4560",
  heading:      "#f1f5f9",
  navy:         "#1a2340",
  orange:       "#F97316",
  orangeHov:    "#fb923c",
  orangeLight:  "#fff3e8",
  orangeBorder: "#fcd4a8",
  green:        "#16a34a",
  greenLight:   "#e8f5ef",
  greenBorder:  "#a3d9bc",
  teal:         "#0d9488",
  rose:         "#e11d48",
  roseLight:    "#fef2f4",
  amber:        "#d97706",
  pink:         "#db2777",
  muted:        "#94a3b8",
  muted2:       "#64748b",
};

/* ─── RESPONSIVE HOOK ─────────────────────────────── */
function useBreakpoint() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    let raf = null;
    const fn = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        setW(window.innerWidth);
        raf = null;
      });
    };
    window.addEventListener("resize", fn, { passive: true });
    return () => {
      window.removeEventListener("resize", fn);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return { isMobile: w < 640, isTablet: w >= 640 && w < 1024, isDesktop: w >= 1024, w };
}

/* ─── DATA ────────────────────────────────────────── */
const TABS = [
  { id: "overview",       label: "Overview",     Icon: BookOpen },
  { id: "curriculum",    label: "Curriculum",   Icon: Layers },
  { id: "fdelab",        label: "FDE Lab™",     Icon: FlaskConical },
  { id: "mentors",       label: "Mentors",      Icon: Users },
  { id: "certification", label: "Dual Cert",    Icon: Award },
  { id: "schedule",      label: "Schedule",     Icon: Calendar },
  { id: "career",        label: "Career",       Icon: TrendingUp },
  { id: "community",     label: "Community",    Icon: Globe },
  { id: "retreat",       label: "Goa Retreat",  Icon: MapPin },
  { id: "admission",     label: "Admission",    Icon: GraduationCap },
];

const PHASES = [
  {
    tag: "Phase 1", weeks: "Weeks 1–4", title: "Foundations",
    color: "#e86a2a", bg: "#fdf4ee",
    tagline: "Learn the language of production AI",
    tech: ["Python, Git, workflows, modern AI tooling", "Prompting patterns, APIs, basic system design", "Thinking beyond notebooks"],
    consult: ["Understanding business problems", "Asking the right questions", "Framing AI use cases clearly"],
    output: "Your first working AI tool · Clear problem statements and solution outlines",
  },
  {
    tag: "Phase 2", weeks: "Weeks 5–12", title: "Core Build",
    color: "#c94fa3", bg: "#fdf0f9",
    tagline: "Move from tools to systems",
    tech: ["LLM applications and workflows", "Context engineering and RAG foundations", "Early evaluation and reliability patterns"],
    consult: ["Requirement discovery", "PRDs and solution design documents", "Communicating trade-offs clearly"],
    output: "A deployable AI system · Architecture diagrams and design decisions",
  },
  {
    tag: "Phase 3", weeks: "Weeks 13–20", title: "Deployment Depth",
    color: "#7c3aed", bg: "#f5f0ff",
    tagline: "Where most AI projects fail… and you learn why",
    tech: ["Advanced RAG and retrieval strategies", "Evaluation, monitoring, and iteration", "Scaling, reliability, and failure handling"],
    consult: ["Stakeholder alignment", "Delivery planning and iteration cycles", "Managing feedback and scope changes"],
    output: "Production-grade systems · Deployment-ready documentation · Clear ownership narratives",
  },
  {
    tag: "Phase 4", weeks: "Weeks 21–32", title: "Capstone & Mastery",
    color: "#059669", bg: "#f0fdf8",
    tagline: "Simulate real-world Forward Deployed Engineering",
    tech: ["Full-stack AI systems", "Agent-based workflows", "Production patterns used by real teams"],
    consult: ["End-to-end delivery simulation", "Presenting outcomes, not features", "Defending decisions under ambiguity"],
    output: "A full FDE-style portfolio · Case studies · Confidence to own systems post-launch",
  },
];

const TOOLS = [
  "OpenAI GPT","Anthropic Claude","Google Gemini","Ollama","LangGraph",
  "CrewAI","AutoGen","LlamaIndex","Pinecone","Weaviate","Qdrant",
  "LangSmith","RAGAS","FastAPI","Docker","AWS","GCP","Vercel",
  "n8n","Cursor","Browserbase","Weights & Biases","DSPy",
];

const CASES = [
  { co: "Salesforce", task: "CRM Auto-Enrichment: Extract company data from web & calls" },
  { co: "Freshworks", task: "Ticket Intelligence: Route 100K monthly tickets, multi-language" },
  { co: "Razorpay",   task: "Transaction Reconciliation: Match 3M transactions across banks" },
  { co: "Stripe",     task: "Payment Fraud Detection: Real-time ML pipeline, 100ms latency" },
  { co: "Postman",    task: "API Documentation Generator: Analyze endpoints, generate docs" },
  { co: "Notion",     task: "Workspace Intelligence: Q&A over docs, meeting summaries" },
];

const MENTORS = [
  { name: "Utkarsh Kinslay", co: "UnifyApps",  role: "Forward Deployed SW Engineer" },
  { name: "Mrinal Raj",      co: "Mercor",      role: "Forward Deployed Engineer" },
  { name: "Arindam Paul",    co: "Amazon",      role: "Forward Deployed Engineer" },
  { name: "Deepanshu Goel",  co: "Heizen",      role: "Forward Deployed Engineer" },
  { name: "Darshan Anand",   co: "Zomato",      role: "Forward Deployed Engineer" },
  { name: "Gourav Kushwaha", co: "PromptQL",    role: "Lead FDE" },
  { name: "Rushikesh Akhare",co: "Luminai",     role: "Lead FDE" },
  { name: "Shefin Shareef",  co: "Moveworks",   role: "Forward Deployed Engineer" },
  { name: "Vishnu Sanketh",  co: "Valiance",    role: "Forward Deployed Engineer" },
  { name: "Pankaj Jaiswal",  co: "Supervity",   role: "Forward Deployed Engineer" },
];

const CAREER_ROLES = [
  { title: "Forward Deployed Engineer (FDE)", indiaRange: "₹45 LPA – ₹1.8 Cr+", globalRange: "$220k – $380k (US & Europe)", desc: "Owning AI deployments end-to-end inside customer or internal environments, from integration to adoption.", color: "#e86a2a" },
  { title: "AI Solutions Engineer (Architect)", indiaRange: "₹35 LPA – ₹1.2 Cr+", globalRange: "$250k – $450k+", desc: "Translating business problems into deployable AI systems, bridging engineering and stakeholder needs.", color: "#c94fa3" },
  { title: "Forward Deployed AI Architect", indiaRange: "₹50 LPA – ₹1.2 Cr+", globalRange: "$250k – $450k+", desc: "Leading system design and deployment strategy across teams and use cases.", color: "#7c3aed" },
  { title: "Applied AI Engineer (Production)", indiaRange: "₹20 LPA – ₹70 LPA", globalRange: "$180k – $320k", desc: "Building, deploying, and maintaining AI systems that run reliably at scale.", color: "#059669" },
  { title: "AI Systems Lead / Staff Engineer", indiaRange: "₹80 LPA – ₹2.5 Cr+", globalRange: "$450k – $750k+", desc: "Owning reliability, iteration, and long-term system evolution across multiple deployments.", color: "#0284c7" },
];

const CAREER_SUPPORT = [
  { num: "1", title: "Role Mapping & Readiness Tracking", color: "#e86a2a", items: ["Clear mapping to roles like Forward Deployed Engineer, Applied AI Engineer, AI Solutions Engineer", "Ongoing readiness checks against real job descriptions", "Gaps identified early and addressed inside the program"] },
  { num: "2", title: "Deployment-First Profile Building", color: "#c94fa3", items: ["Resume and LinkedIn profiles built around real deployments, not coursework", "Positioning you as someone who can own systems in production", "Clear articulation of impact, decisions made, and systems shipped"] },
  { num: "3", title: "Interview Training for FDE-Style Roles", color: "#7c3aed", items: ["Structured mock interviews with practitioners and hiring-side evaluators", "Focus on system design, trade-offs, failure handling, and deployment decisions", "Feedback loops to fix weak signals before real interviews"] },
  { num: "4", title: "Job Role Mapping & Company Matching", color: "#059669", items: ["Access to roles sourced through Futurense's hiring network", "Matching based on your strengths, background, and deployment work", "Warm introductions where relevant, not blind applications"] },
  { num: "5", title: "Offer & Compensation Support", color: "#0284c7", items: ["Role-level salary benchmarking for India and global remote roles", "Guidance on evaluating offers, scope, and growth potential", "Support during negotiation conversations when required"] },
];

const COMMUNITY_COUNTRIES = ["India","United States","Canada","UK","Germany","Netherlands","Singapore","UAE","Australia","Israel"];
const COMMUNITY_COMPANIES = ["OpenAI","Anthropic","Palantir","Databricks","Snowflake","Stripe","Ramp","Atlassian","Notion","Postman","Salesforce","Google","Amazon","Microsoft"];

const COMMUNITY_FEATURES = [
  { title: "Offline meetups", desc: "Regular city-level meetups across India and other regions where members meet, exchange notes, and build real professional relationships", color: "#c94fa3" },
  { title: "Global online sessions", desc: "Live discussions with FDEs across geographies, sharing how deployment looks inside different companies and markets", color: "#e86a2a" },
  { title: "Peer problem-solving", desc: "Members help each other think through real deployment challenges, architecture decisions, and delivery trade-offs", color: "#7c3aed" },
  { title: "Network-driven hiring flow", desc: "Referrals, role visibility, and hiring conversations happen organically within the group", color: "#059669" },
];

const SLIDES = [
  {
    badge: "World's First Structured FDE Program",
    headline1: "Become the",
    highlight: "Top 1%",
    headline2: "of AI Engineers.",
    sub: "Build, deploy, and own AI systems that survive real-world constraints. Not demos — production systems trusted by real organizations.",
    img: slide1,
    imgAlt: "FDE Academy Image 1",
  },
  {
    badge: "IIT Roorkee PG Certification",
    headline1: "Learn. Build.",
    highlight: "Deploy.",
    headline2: "Own it.",
    sub: "32 weeks of dual-track training: Technical depth meets consulting judgment. Graduate with real systems in production.",
    img: slide2,
    imgAlt: "FDE Academy Image 2",
  },
  {
    badge: "Mentors from 10+ Top AI Companies",
    headline1: "Trained by",
    highlight: "Real FDEs",
    headline2: "at the frontier.",
    sub: "Mentors from Moveworks, Amazon, Zomato, PromptQL and more. Not theory — real deployment judgment.",
    img: slide3,
    imgAlt: "FDE Academy Image 3",
  },
  {
    badge: "800% Growth in FDE Jobs 2025",
    headline1: "The role",
    highlight: "companies",
    headline2: "can't fill.",
    sub: "70%+ of AI pilots fail after launch. FDEs are the engineers who own systems end-to-end — before and after deployment.",
    img: slide4,
    imgAlt: "FDE Academy Image 4",
  },
];

/* ─── MAIN COMPONENT ──────────────────────────────── */
export default function FDEAcademy({
  theme: themeProp,
  toggleTheme: toggleThemeProp,
  setShowLoginModal,
  scrollToSection,
}) {
  const { isMobile, isTablet } = useBreakpoint();
  const [activeTab, setActiveTab]     = useState("overview");
  const [activePhase, setActivePhase] = useState(0);
  const [showApply, setShowApply]     = useState(false);
  const [formData, setFormData]       = useState({ name: "", email: "", phone: "", background: "" });
  const [submitted, setSubmitted]     = useState(false);
  const [slide, setSlide]             = useState(0);

  const dark = themeProp === "dark";

  // Same palette as TermsOfService.jsx, so light/dark theme matches
  // every other public page exactly.
  const C = dark ? DARK : LIGHT;

  // Any tab click should land the user at the top of the page, not
  // wherever they'd scrolled to on the previous tab.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab]);

  useEffect(() => {
    let t = setInterval(() => setSlide(s => (s + 1) % SLIDES.length), 4500);
    const onVisibility = () => {
      clearInterval(t);
      if (!document.hidden) {
        t = setInterval(() => setSlide(s => (s + 1) % SLIDES.length), 4500);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      clearInterval(t);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const bg      = C.bg;
  const surface = C.surface;
  const border  = C.border;
  const text    = C.heading;
  const muted   = C.muted;

  const S = SLIDES[slide];
  const handleApply      = () => setShowApply(true);
  const handleFormChange = e  => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
  const handleSubmit     = () => {
    if (!formData.name || !formData.email) return;
    setSubmitted(true);
    setTimeout(() => { setShowApply(false); setSubmitted(false); setFormData({ name: "", email: "", phone: "", background: "" }); }, 2500);
  };

  const heroFontSize = isMobile ? "32px" : isTablet ? "40px" : "48px";
  const heroPad      = isMobile ? "24px 16px 32px" : isTablet ? "32px 24px 40px" : "48px 40px 56px";
  const sectionPad   = isMobile ? "0 16px 40px" : isTablet ? "0 24px 48px" : "0 40px 60px";
  const maxW         = "1280px";

  return (
    <PublicLayout
      theme={themeProp}
      toggleTheme={toggleThemeProp}
      setShowLoginModal={setShowLoginModal}
      scrollToSection={scrollToSection}
    >
    <div className="fde-page" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: bg, minHeight: "100vh", transition: "background 0.3s", overflowX: "hidden" }}>

      {/* ── APPLY MODAL ── */}
      {showApply && (
        <div onClick={() => setShowApply(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: surface, borderRadius: "20px", padding: isMobile ? "24px" : "36px", width: "100%", maxWidth: "420px", boxShadow: "0 24px 60px rgba(0,0,0,0.3)", border: `1px solid ${border}` }}>
            {submitted ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: "52px", marginBottom: "16px" }}>🎉</div>
                <div style={{ fontSize: "22px", fontWeight: 800, color: text }}>Application Received!</div>
                <div style={{ color: muted, marginTop: "10px", fontSize: "14px" }}>Our team will reach out to {formData.email} within 24 hours.</div>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                  <div>
                    <div style={{ fontSize: "18px", fontWeight: 800, color: text }}>Apply to FDE Academy</div>
                    <div style={{ fontSize: "12px", color: muted, marginTop: "2px" }}>PGP in Forward Deployed Engineering</div>
                  </div>
                  <button onClick={() => setShowApply(false)} style={{ background: dark ? "#2a3450" : "#f0ece6", border: "none", borderRadius: "8px", width: "32px", height: "32px", cursor: "pointer", fontSize: "18px", color: muted, flexShrink: 0 }}>×</button>
                </div>
                {[
                  { name: "name", placeholder: "Full Name *", type: "text" },
                  { name: "email", placeholder: "Email Address *", type: "email" },
                  { name: "phone", placeholder: "Phone Number", type: "tel" },
                  { name: "background", placeholder: "Current Background (e.g. Backend Dev, 2 yrs)", type: "text" },
                ].map(f => (
                  <input key={f.name} name={f.name} type={f.type} placeholder={f.placeholder} value={formData[f.name]} onChange={handleFormChange}
                    style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: `1.5px solid ${border}`, fontSize: "14px", marginBottom: "12px", outline: "none", boxSizing: "border-box", fontFamily: "inherit", background: bg, color: text }} />
                ))}
                <button onClick={handleSubmit} style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, #e86a2a, #c94fa3)", color: "#fff", border: "none", borderRadius: "10px", fontWeight: 700, fontSize: "15px", cursor: "pointer", marginTop: "4px" }}>
                  Submit Application →
                </button>
                <div style={{ textAlign: "center", fontSize: "11px", color: muted, marginTop: "12px" }}>Limited seats per cohort · Responses within 24 hours</div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── HERO ── */}
      <div style={{ maxWidth: maxW, margin: "0 auto", padding: heroPad, display: "flex", flexDirection: isMobile ? "column" : "row", gap: isMobile ? "28px" : isTablet ? "32px" : "48px", alignItems: isMobile ? "stretch" : "center" }}>
        {/* LEFT */}
        <div style={{ flex: isMobile ? "none" : "0 0 46%", minWidth: 0 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "7px", background: surface, border: `1.5px solid ${border}`, borderRadius: "50px", padding: "6px 16px", marginBottom: isMobile ? "18px" : "24px", maxWidth: "100%" }}>
            <Star size={12} fill="#e86a2a" color="#e86a2a" />
            <span style={{ fontSize: isMobile ? "11px" : "12.5px", color: "#e86a2a", fontWeight: 600, whiteSpace: isMobile ? "normal" : "nowrap" }}>{S.badge}</span>
          </div>
          <h1 style={{ margin: "0 0 16px", lineHeight: 1.2, fontSize: heroFontSize, fontWeight: 800 }}>
            <span style={{ color: text }}>{S.headline1} </span>
            <span style={{ color: "#e86a2a" }}>{S.highlight} </span>
            <span style={{ color: text }}>{S.headline2}</span>
          </h1>
          <p style={{ fontSize: isMobile ? "13.5px" : "15px", color: muted, margin: "0 0 20px", lineHeight: 1.75, maxWidth: "420px" }}>{S.sub}</p>
          <div style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
            {[
              { val: "32",   unit: "Weeks",    sub: "Dual-Track",       Icon: BookOpen },
              { val: "70%+", unit: "AI Pilots", sub: "Fail Post Launch", Icon: TrendingUp },
              { val: "800%", unit: "FDE Jobs",  sub: "Growth 2025",      Icon: Rocket },
            ].map(s => (
              <div key={s.val} style={{ background: surface, border: `1px solid ${border}`, borderRadius: "12px", padding: isMobile ? "10px" : "14px", flex: 1 }}>
                <s.Icon size={14} color="#e86a2a" style={{ marginBottom: "5px" }} />
                <div style={{ fontSize: isMobile ? "18px" : "22px", fontWeight: 900, color: "#e86a2a", lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontSize: isMobile ? "10px" : "12px", fontWeight: 700, color: text }}>{s.unit}</div>
                <div style={{ fontSize: "9px", color: muted, marginTop: "1px" }}>{s.sub}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button onClick={handleApply} style={{ background: "linear-gradient(135deg, #e86a2a, #c94fa3)", color: "#fff", border: "none", padding: isMobile ? "12px 18px" : "14px 22px", borderRadius: "10px", fontWeight: 700, fontSize: isMobile ? "13px" : "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "7px" }}>
              <Send size={14} /> Apply Now
            </button>
            <button style={{ background: "transparent", color: text, border: `1.5px solid ${border}`, padding: isMobile ? "12px 18px" : "14px 22px", borderRadius: "10px", fontWeight: 600, fontSize: isMobile ? "13px" : "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "7px" }}>
              <Download size={14} /> Brochure
            </button>
          </div>
          <div style={{ display: "flex", gap: "7px", marginTop: "16px", flexWrap: "wrap" }}>
            {[{ label: "Built by Real FDEs", Icon: Shield }, { label: "Deployment-First", Icon: Zap }, { label: "IIT Roorkee Certified", Icon: GraduationCap }].map(t => (
              <span key={t.label} style={{ fontSize: "11px", background: dark ? "#2a3450" : "#ede6da", color: muted, padding: "5px 11px", borderRadius: "20px", fontWeight: 500, display: "flex", alignItems: "center", gap: "5px" }}>
                <t.Icon size={10} color="#e86a2a" /> {t.label}
              </span>
            ))}
          </div>
          <div style={{ display: "flex", gap: "6px", marginTop: "20px" }}>
            {SLIDES.map((_, i) => (
              <button key={i} onClick={() => setSlide(i)} style={{ width: i === slide ? "26px" : "7px", height: "7px", borderRadius: "4px", border: "none", cursor: "pointer", background: i === slide ? "#e86a2a" : (dark ? "#2a3450" : "#d8d0c4"), transition: "all 0.3s", padding: 0 }} />
            ))}
          </div>
        </div>

        {/* RIGHT — image (tablet + desktop) */}
        {!isMobile && (
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ borderRadius: "20px", overflow: "hidden", boxShadow: dark ? "0 20px 60px rgba(0,0,0,0.5)" : "0 20px 60px rgba(26,39,68,0.14)", position: "relative", aspectRatio: isTablet ? "16/11" : "4/3", background: "#1a2744" }}>
            <img
  key={slide}
  src={S.img}
  alt={S.imgAlt}
  loading="eager"
  decoding="async"
  fetchPriority="high"
  style={{
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    animation: "fadeIn 0.6s ease"
  }}
/>
              <div style={{ position: "absolute", top: "16px", left: "16px", background: "rgba(232,106,42,0.92)", borderRadius: "8px", padding: "5px 12px" }}>
                <span style={{ fontSize: "10px", fontWeight: 700, color: "#fff", letterSpacing: "0.5px" }}>LIVE COHORT</span>
              </div>
              <div style={{ position: "absolute", bottom: "16px", left: "16px", right: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ flex: 1, background: "rgba(255,255,255,0.12)", backdropFilter: "blur(10px)", borderRadius: "12px", padding: "10px 14px", border: "1px solid rgba(255,255,255,0.18)" }}>
                  <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.6)", marginBottom: "2px" }}>Program</div>
                  <div style={{ fontSize: isTablet ? "11px" : "12.5px", fontWeight: 700, color: "#fff" }}>PGP in Forward Deployed Engineering</div>
                </div>
                <div style={{ background: "#e86a2a", borderRadius: "10px", padding: "10px 14px", flexShrink: 0, textAlign: "center" }}>
                  <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.8)" }}>Now</div>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "#fff" }}>Enrolling</div>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
              {SLIDES.map((sl, i) => (
                <div key={i} onClick={() => setSlide(i)} style={{ flex: 1, height: "52px", borderRadius: "10px", overflow: "hidden", cursor: "pointer", opacity: i === slide ? 1 : 0.5, border: i === slide ? "2px solid #e86a2a" : "2px solid transparent", transition: "all 0.25s", background: "#1a2744" }}>
                  <img
  src={sl.img}
  alt={sl.imgAlt}
  loading="lazy"
  decoding="async"
  fetchPriority="low"
  style={{
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block"
  }}
/>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mobile image */}
        {isMobile && (
          <div style={{ borderRadius: "16px", overflow: "hidden", position: "relative", aspectRatio: "16/9", background: "#1a2744" }}>
            <img
  key={slide}
  src={S.img}
  alt={S.imgAlt}
  loading="eager"
  decoding="async"
  fetchPriority="high"
  style={{
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    animation: "fadeIn 0.6s ease"
  }}
/>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(13,19,32,0.8) 0%, transparent 60%)" }} />
            <div style={{ position: "absolute", bottom: "12px", left: "12px", right: "12px", display: "flex", gap: "8px" }}>
              <div style={{ flex: 1, background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)", borderRadius: "10px", padding: "8px 12px", border: "1px solid rgba(255,255,255,0.2)" }}>
                <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.6)" }}>Program</div>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#fff" }}>PGP in Forward Deployed Engineering</div>
              </div>
              <div style={{ background: "#e86a2a", borderRadius: "8px", padding: "8px 12px", textAlign: "center", flexShrink: 0 }}>
                <div style={{ fontSize: "8px", color: "rgba(255,255,255,0.8)" }}>Now</div>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#fff" }}>Enrolling</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── TABS + PANEL ── */}
      <div style={{ maxWidth: maxW, margin: "0 auto", padding: sectionPad }}>
        {/* Scrollable tab bar */}
        <div style={{ display: "flex", gap: "4px", background: surface, border: `1px solid ${border}`, borderRadius: "14px", padding: "5px", marginBottom: "14px", overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          {TABS.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              style={{ flexShrink: 0, padding: isMobile ? "8px 8px" : "10px 7px", border: "none", borderRadius: "10px", fontWeight: 600, fontSize: isMobile ? "10px" : "11.5px", cursor: "pointer", transition: "all 0.18s", background: activeTab === id ? "#1a2744" : "transparent", color: activeTab === id ? "#fff" : muted, display: "flex", alignItems: "center", gap: "4px", flex: isMobile ? "0 0 auto" : 1, justifyContent: "center", whiteSpace: "nowrap" }}>
              <Icon size={11} />
              {label}
            </button>
          ))}
        </div>

        {/* Panel */}
        <div style={{ background: surface, borderRadius: "18px", border: `1px solid ${border}`, padding: isMobile ? "20px 16px" : "28px 32px", maxHeight: isMobile ? "none" : "700px", overflowY: isMobile ? "visible" : "auto" }}>

          {/* ── OVERVIEW ── */}
          {activeTab === "overview" && (
            <div>
              <h2 style={{ margin: "0 0 4px", fontSize: isMobile ? "17px" : "20px", color: text, fontWeight: 800 }}>PGP in Forward Deployed Engineering</h2>
              <p style={{ color: muted, fontSize: "12px", margin: "0 0 18px" }}>& Applied AI Solutions · 32 Weeks · Dual Track · Cohort-Based</p>
              <div style={{ background: "#1a2744", borderRadius: "12px", padding: "16px", marginBottom: "16px" }}>
                <p style={{ color: "#cdd5e8", fontSize: "13px", margin: 0, lineHeight: 1.75 }}>
                  A <strong style={{ color: "#fff" }}>32-week, deployment-focused postgraduate program</strong> designed to train engineers for one role:{" "}
                  <strong style={{ color: "#f97316" }}>Owning AI systems in production</strong>.
                  You don't watch AI being built — you <em>build, deploy, and iterate</em> on it yourself.
                </p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
                {[
                  { Icon: Code2, title: "Technical Track", desc: "Build & deploy LLM apps, RAG systems, agents, full-stack AI evaluation & reliability" },
                  { Icon: Briefcase, title: "Consulting Track", desc: "Problem discovery, PRDs, stakeholder delivery, feedback loops & ownership" },
                  { Icon: Trophy, title: "IIT Roorkee Cert", desc: "FDE Academy PGP + IIT Roorkee PG Certification in Forward Deployed AI Engineering" },
                  { Icon: FlaskConical, title: "FDE Lab™", desc: "Learn. Apply. Build. — The proprietary system that builds deployment judgment" },
                ].map(f => (
                  <div key={f.title} style={{ background: bg, borderRadius: "10px", border: `1px solid ${border}`, padding: "14px" }}>
                    <f.Icon size={18} color="#e86a2a" style={{ marginBottom: "7px" }} />
                    <div style={{ fontSize: "12.5px", fontWeight: 700, color: text, marginBottom: "4px" }}>{f.title}</div>
                    <div style={{ fontSize: "11.5px", color: muted, lineHeight: 1.5 }}>{f.desc}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: dark ? "#1e2d40" : "#fdf4ee", borderRadius: "12px", padding: "16px", border: `1px solid ${dark ? "#e86a2a40" : "#fad9c0"}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
                  <GraduationCap size={14} color="#e86a2a" />
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#e86a2a" }}>What you graduate with</span>
                </div>
                {["Deployment-ready portfolio of real AI systems", "FDE Academy PGP + IIT Roorkee PG Certification", "Architecture diagrams, case write-ups, reviewed code", "Readiness for FDE interviews & on-the-job ownership"].map(item => (
                  <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: "7px", marginBottom: "7px" }}>
                    <CheckCircle2 size={13} color="#e86a2a" style={{ marginTop: "2px", flexShrink: 0 }} />
                    <span style={{ fontSize: "12.5px", color: dark ? "#cdd5e8" : "#555" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── CURRICULUM ── */}
          {activeTab === "curriculum" && (
            <div>
              <h2 style={{ margin: "0 0 4px", fontSize: isMobile ? "17px" : "20px", color: text, fontWeight: 800 }}>Dual Track Structure & Learning Journey</h2>
              <p style={{ color: muted, fontSize: "12px", margin: "0 0 16px" }}>32 weeks · Every phase produces real output · Nothing is theoretical</p>
              <div style={{ display: "flex", gap: "6px", marginBottom: "16px", flexWrap: "wrap" }}>
                {PHASES.map((p, i) => (
                  <button key={i} onClick={() => setActivePhase(i)} style={{ padding: "7px 12px", borderRadius: "8px", border: "none", fontWeight: 600, fontSize: "11px", cursor: "pointer", background: activePhase === i ? p.color : (dark ? "#2a3450" : "#f0ece6"), color: activePhase === i ? "#fff" : muted, transition: "all 0.18s" }}>
                    {isMobile ? PHASES[i].tag : `${PHASES[i].tag}: ${PHASES[i].title}`}
                  </button>
                ))}
              </div>
              {(() => {
                const p = PHASES[activePhase];
                return (
                  <div>
                    <div style={{ background: p.color, borderRadius: "12px", padding: "14px 18px", marginBottom: "12px" }}>
                      <div style={{ color: "#fff", fontWeight: 800, fontSize: "15px" }}>{p.title}</div>
                      <div style={{ color: "rgba(255,255,255,0.75)", fontSize: "12px", marginTop: "2px" }}>{p.weeks} — {p.tagline}</div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
                      <div style={{ background: dark ? "#1e2d40" : p.bg, borderRadius: "10px", padding: "14px", border: `1px solid ${dark ? `${p.color}40` : `${p.color}30`}` }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "8px" }}>
                          <Code2 size={12} color={p.color} />
                          <span style={{ fontSize: "10px", fontWeight: 700, color: p.color }}>TECHNICAL</span>
                        </div>
                        {p.tech.map(t => (
                          <div key={t} style={{ display: "flex", gap: "6px", marginBottom: "5px" }}>
                            <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: p.color, marginTop: "6px", flexShrink: 0 }} />
                            <span style={{ fontSize: "11.5px", color: dark ? "#cdd5e8" : "#555", lineHeight: 1.5 }}>{t}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{ background: dark ? "#1e2d40" : "#f8f4ff", borderRadius: "10px", padding: "14px", border: `1px solid ${dark ? "#7c3aed40" : "#ddd0ff"}` }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "8px" }}>
                          <Briefcase size={12} color="#7c3aed" />
                          <span style={{ fontSize: "10px", fontWeight: 700, color: "#7c3aed" }}>CONSULTING</span>
                        </div>
                        {p.consult.map(c => (
                          <div key={c} style={{ display: "flex", gap: "6px", marginBottom: "5px" }}>
                            <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#7c3aed", marginTop: "6px", flexShrink: 0 }} />
                            <span style={{ fontSize: "11.5px", color: dark ? "#cdd5e8" : "#555", lineHeight: 1.5 }}>{c}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{ background: dark ? "#1e2d40" : "#f0fdf4", borderRadius: "10px", padding: "12px 14px", border: `1px solid ${dark ? "#05966940" : "#bbf7d0"}`, display: "flex", gap: "8px" }}>
                      <CheckCircle2 size={14} color="#059669" style={{ flexShrink: 0, marginTop: "1px" }} />
                      <div>
                        <div style={{ fontSize: "10px", fontWeight: 700, color: "#059669", marginBottom: "2px" }}>YOU PRODUCE:</div>
                        <div style={{ fontSize: "12px", color: dark ? "#cdd5e8" : "#555" }}>{p.output}</div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* ── FDE LAB ── */}
          {activeTab === "fdelab" && (
            <div>
              <h2 style={{ margin: "0 0 4px", fontSize: isMobile ? "17px" : "20px", color: text, fontWeight: 800 }}>FDE Lab™</h2>
              <p style={{ color: muted, fontSize: "12px", margin: "0 0 16px" }}>Learn. Apply. Build. · Deployment skills that compound.</p>
              {[
                { label: "LEARN", color: "#e86a2a", Icon: BookOpen, title: "30+ GenAI Tools & Production Patterns", items: ["Agentic Orchestration: LangGraph, CrewAI, Semantic Kernel", "Advanced Prompting: Chain-of-thought, ReAct, DSPy", "Vector Search: Pinecone, Weaviate, Qdrant", "LLM Ops: LangSmith, Helicone, Weights & Biases"] },
                { label: "APPLY", color: "#c94fa3", Icon: Target, title: "Real Company Case Studies", items: CASES.map(c => `${c.co}: ${c.task}`) },
                { label: "BUILD", color: "#7c3aed", Icon: Rocket, title: "Production-Grade Deployments", items: ["Perplexity Research Engine: Claude Opus, Firecrawl, Pinecone", "Intercom Support Automation: GPT-4o, Semantic Router, Qdrant", "Cursor Code Assistant: Context-aware completions, PR reviews", "Stripe Webhook Infrastructure: 10K events/sec with retries"] },
              ].map(s => (
                <div key={s.label} style={{ borderRadius: "10px", padding: "12px 14px", marginBottom: "12px", background: `${s.color}0a`, border: `1px solid ${s.color}25`, borderLeft: `4px solid ${s.color}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "8px" }}>
                    <span style={{ background: s.color, color: "#fff", fontSize: "9px", fontWeight: 800, padding: "3px 8px", borderRadius: "4px", letterSpacing: "1px" }}>{s.label}</span>
                    <s.Icon size={13} color={s.color} />
                    <span style={{ fontSize: "12.5px", fontWeight: 700, color: text }}>{s.title}</span>
                  </div>
                  {s.items.map(item => (
                    <div key={item} style={{ display: "flex", gap: "5px", marginBottom: "4px" }}>
                      <ArrowRight size={10} color={s.color} style={{ marginTop: "3px", flexShrink: 0 }} />
                      <span style={{ fontSize: "11.5px", color: muted, lineHeight: 1.5 }}>{item}</span>
                    </div>
                  ))}
                </div>
              ))}
              <div style={{ background: "#1a2744", borderRadius: "12px", padding: "14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                  <Brain size={13} color="#e86a2a" />
                  <span style={{ fontSize: "10px", color: "#aaa", fontWeight: 700, letterSpacing: "0.5px" }}>30+ TOOLS IN THE STACK</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                  {TOOLS.map(t => (
                    <span key={t} style={{ background: "rgba(255,255,255,0.1)", color: "#e2e8f0", fontSize: "11px", padding: "3px 9px", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.15)" }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── MENTORS ── */}
          {activeTab === "mentors" && (
            <div>
              <h2 style={{ margin: "0 0 4px", fontSize: isMobile ? "17px" : "20px", color: text, fontWeight: 800 }}>Built by Real FDEs & AI Leaders</h2>
              <p style={{ color: muted, fontSize: "12px", margin: "0 0 16px", lineHeight: 1.6 }}>Curriculum shaped by Forward Deployed Engineers at the frontier of AI deployment.</p>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "9px", marginBottom: "14px" }}>
                {MENTORS.map((m, i) => {
                  const colors = ["#e86a2a","#c94fa3","#7c3aed","#059669","#0284c7","#dc2626","#b45309","#0891b2","#6d28d9","#065f46"];
                  return (
                    <div key={m.name} style={{ background: bg, borderRadius: "10px", border: `1px solid ${border}`, padding: "10px 12px", display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: colors[i % colors.length], display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: "14px", flexShrink: 0 }}>{m.name[0]}</div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: "12px", fontWeight: 700, color: text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.name}</div>
                        <div style={{ fontSize: "10.5px", color: colors[i % colors.length], fontWeight: 600 }}>{m.co}</div>
                        <div style={{ fontSize: "10px", color: muted }}>{m.role}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ background: "#1a2744", borderRadius: "12px", padding: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
                  <Users size={13} color="#e86a2a" />
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#fff" }}>They will:</span>
                </div>
                {["Guide direction & shape curriculum design", "Mentor and review your deployment work", "Share real-world deployment insights", "Help shape judgment around real AI delivery"].map(item => (
                  <div key={item} style={{ display: "flex", gap: "7px", marginBottom: "6px", alignItems: "center" }}>
                    <ArrowRight size={12} color="#e86a2a" />
                    <span style={{ fontSize: "12.5px", color: "#cdd5e8" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── DUAL CERTIFICATION ── */}
          {activeTab === "certification" && (
            <div>
              <h2 style={{ margin: "0 0 4px", fontSize: isMobile ? "17px" : "20px", color: text, fontWeight: 800 }}>Dual Certification</h2>
              <p style={{ color: muted, fontSize: "12px", margin: "0 0 20px" }}>Two credentials. One for deployment depth. One for academic credibility.</p>

              {/* FDE Academy Cert */}
              <div style={{ background: dark ? "#1e2d40" : "#fdf4ee", borderRadius: "14px", border: `1px solid ${dark ? "#e86a2a40" : "#fad9c0"}`, padding: "18px", marginBottom: "14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                  <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "linear-gradient(135deg, #e86a2a, #c94fa3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Award size={20} color="#fff" />
                  </div>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 800, color: text }}>FDE Academy</div>
                    <div style={{ fontSize: "11px", color: "#e86a2a", fontWeight: 600 }}>Postgraduate Program Certification</div>
                  </div>
                </div>
                <div style={{ fontSize: "12.5px", color: dark ? "#cdd5e8" : "#555", lineHeight: 1.7, marginBottom: "12px" }}>
                  Post Graduate Program Certificate in FDE & Applied AI Solutions — awarded upon successful completion of all 32 weeks, including the capstone project and deployment portfolio review.
                </div>
                {["Full 32-week program completion required", "Capstone project: AI-driven market expansion strategy", "Deployment portfolio reviewed by FDE mentors", "Signed by FDE Academy and Futurense leadership"].map(item => (
                  <div key={item} style={{ display: "flex", gap: "7px", marginBottom: "5px" }}>
                    <CheckCircle2 size={12} color="#e86a2a" style={{ flexShrink: 0, marginTop: "2px" }} />
                    <span style={{ fontSize: "11.5px", color: dark ? "#cdd5e8" : "#555" }}>{item}</span>
                  </div>
                ))}
              </div>

              {/* IIT Roorkee Cert */}
              <div style={{ background: dark ? "#1a2a1a" : "#f0fdf4", borderRadius: "14px", border: `1px solid ${dark ? "#05966940" : "#bbf7d0"}`, padding: "18px", marginBottom: "14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                  <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "linear-gradient(135deg, #059669, #0284c7)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <GraduationCap size={20} color="#fff" />
                  </div>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 800, color: text }}>IIT Roorkee</div>
                    <div style={{ fontSize: "11px", color: "#059669", fontWeight: 600 }}>PG Certification in Forward Deployed AI Engineering</div>
                  </div>
                </div>
                <div style={{ background: "#1a2744", borderRadius: "10px", padding: "12px 16px", marginBottom: "12px" }}>
                  <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                    {[["#6", "NIRF Engineering Rank"], ["#8", "NIRF Research Rank"], ["Top 10", "NIRF 2025 Overall"]].map(([val, label]) => (
                      <div key={label} style={{ textAlign: "center" }}>
                        <div style={{ fontSize: "20px", fontWeight: 900, color: "#e86a2a" }}>{val}</div>
                        <div style={{ fontSize: "9px", color: "#aaa", marginTop: "2px" }}>{label}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ fontSize: "12.5px", color: dark ? "#cdd5e8" : "#555", lineHeight: 1.7, marginBottom: "12px" }}>
                  Learning delivered in association with IIT Roorkee — one of India's most respected engineering institutions. The first 12 weeks include a structured academic curriculum delivered by IIT Roorkee faculty.
                </div>
                {["Live sessions by IIT Roorkee professors", "Structured academic curriculum (first 12 weeks)", "Campus immersion at IIT Roorkee", "Certification from IIT Roorkee Continuing Education Centre"].map(item => (
                  <div key={item} style={{ display: "flex", gap: "7px", marginBottom: "5px" }}>
                    <CheckCircle2 size={12} color="#059669" style={{ flexShrink: 0, marginTop: "2px" }} />
                    <span style={{ fontSize: "11.5px", color: dark ? "#cdd5e8" : "#555" }}>{item}</span>
                  </div>
                ))}
              </div>

              <div style={{ background: "#1a2744", borderRadius: "12px", padding: "14px" }}>
                <div style={{ fontSize: "12px", color: "#cdd5e8", lineHeight: 1.7 }}>
                  <strong style={{ color: "#fff" }}>Why both matter:</strong> FDE Academy certificate proves deployment capability and real systems built. IIT Roorkee certification adds academic credibility and institutional backing from India's top-ranked engineering institution. Learners graduate with added academic credibility through learning with IIT Roorkee, and strong hands-on deployment capability developed through FDE Academy.
                </div>
              </div>
            </div>
          )}

          {/* ── WEEKLY SCHEDULE ── */}
          {activeTab === "schedule" && (
            <div>
              <h2 style={{ margin: "0 0 4px", fontSize: isMobile ? "17px" : "20px", color: text, fontWeight: 800 }}>A Week at the FDE Academy</h2>
              <p style={{ color: muted, fontSize: "12px", margin: "0 0 16px" }}>Structured weekly cadence designed to mirror how Forward Deployed Engineers actually work.</p>

              {/* Legend */}
              <div style={{ display: "flex", gap: "14px", marginBottom: "16px", flexWrap: "wrap" }}>
                {[["Learn", "#c94fa3", "New concepts, demos and exploration"], ["Apply", "#e86a2a", "Guided exercises, templates and structured practice"], ["Build", "#7c3aed", "Real projects, client scenarios and portfolio pieces"]].map(([label, color, desc]) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                    <div style={{ width: "4px", height: "30px", background: color, borderRadius: "2px", flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: "11px", fontWeight: 700, color }}>{label}</div>
                      <div style={{ fontSize: "10px", color: muted, maxWidth: "160px" }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Schedule */}
              <div style={{ borderRadius: "12px", border: `1px solid ${border}`, overflow: "hidden", marginBottom: "16px" }}>
                {[
                  { day: "MON", off: true },
                  { day: "TUE", label: "Learning Focused",     session: "FDE Live Sessions | LEARN", color: "#c94fa3", time: "Up to 2 hrs" },
                  { day: "WED", label: "Application Focused",  session: "FDE Live Sessions | APPLY", color: "#e86a2a", time: "Up to 2 hrs" },
                  { day: "THU", label: "Learning Focused",     session: "FDE Live Sessions | LEARN", color: "#c94fa3", time: "Up to 2 hrs" },
                  { day: "FRI", off: true },
                  { day: "SAT", label: "Application Focused",  session: "FDE Live Sessions | APPLY", color: "#e86a2a", time: "4–6 hrs", iit: true },
                  { day: "SUN", label: "Building Focused",     session: "FDE Live Sessions | BUILD", color: "#7c3aed", time: "4–6 hrs", iit: true },
                ].map((row, i) => (
                  <div key={row.day} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", borderBottom: i < 6 ? `1px solid ${border}` : "none", background: row.off ? (dark ? "#1a2030" : "#f5f0e8") : "transparent" }}>
                    <div style={{ width: "32px", fontSize: "11px", fontWeight: 800, color: row.off ? muted : text, flexShrink: 0 }}>{row.day}</div>
                    {row.off ? (
                      <div style={{ flex: 1, fontSize: "12px", color: muted, fontWeight: 600, textAlign: "center", letterSpacing: "1px" }}>WEEKLY OFF</div>
                    ) : (
                      <>
                        <div style={{ flex: "0 0 110px", fontSize: "10.5px", color: muted }}>{row.label}</div>
                        <div style={{ display: "flex", gap: "5px", flex: 1, flexWrap: "wrap" }}>
                          {row.iit && <span style={{ background: "#e86a2a", color: "#fff", fontSize: "9px", fontWeight: 700, padding: "3px 7px", borderRadius: "5px", whiteSpace: "nowrap" }}>IIT Roorkee 3hrs · Wk 1-12</span>}
                          <span style={{ background: row.color, color: "#fff", fontSize: "9px", fontWeight: 700, padding: "3px 7px", borderRadius: "5px", whiteSpace: "nowrap" }}>{row.session}</span>
                        </div>
                        <div style={{ fontSize: "11px", fontWeight: 700, color: text, flexShrink: 0, minWidth: "52px", textAlign: "right" }}>{row.time}</div>
                      </>
                    )}
                  </div>
                ))}
              </div>

              {/* Total */}
              <div style={{ background: dark ? "#1e2d40" : "#fdf4ee", borderRadius: "12px", padding: "14px 18px", border: `1px solid ${dark ? "#e86a2a40" : "#fad9c0"}`, display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: text }}>Weekly Total</div>
                  <div style={{ fontSize: "10px", color: muted, marginTop: "2px" }}>*IIT Roorkee sessions run during Phase 1 & 2 only (first 12 weeks)</div>
                </div>
                <div style={{ background: "#e86a2a", borderRadius: "10px", padding: "8px 18px", fontSize: "18px", fontWeight: 900, color: "#fff" }}>14–18 hrs</div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: "10px" }}>
                {[
                  { title: "Flexible", desc: "Weekend sessions + weekday evenings", Icon: Zap, color: "#e86a2a" },
                  { title: "Online + Onsite", desc: "Remote learning with IIT Roorkee campus visits", Icon: Globe, color: "#c94fa3" },
                  { title: "Intensive", desc: "14–18 hours of focused learning per week", Icon: Target, color: "#7c3aed" },
                ].map(f => (
                  <div key={f.title} style={{ background: bg, borderRadius: "10px", border: `1px solid ${border}`, padding: "14px" }}>
                    <f.Icon size={16} color={f.color} style={{ marginBottom: "6px" }} />
                    <div style={{ fontSize: "12.5px", fontWeight: 700, color: text, marginBottom: "4px" }}>{f.title}</div>
                    <div style={{ fontSize: "11px", color: muted, lineHeight: 1.5 }}>{f.desc}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: "14px", background: "#1a2744", borderRadius: "10px", padding: "12px 16px" }}>
                <div style={{ fontSize: "12px", color: "#cdd5e8", lineHeight: 1.7 }}>
                  The time commitment is intentional. This program is designed for people who are serious about building real capability. Weekdays are focused on live, instructor-led sessions across the Technical and Consulting tracks, while weekends are used for deeper application, integration, and portfolio-building.
                </div>
              </div>
            </div>
          )}

          {/* ── CAREER ACCELERATION ── */}
          {activeTab === "career" && (
            <div>
              <h2 style={{ margin: "0 0 4px", fontSize: isMobile ? "17px" : "20px", color: text, fontWeight: 800 }}>Career Acceleration</h2>
              <p style={{ color: muted, fontSize: "12px", margin: "0 0 4px" }}>Job Outcomes, Roles & Compensation</p>
              <div style={{ background: "#1a2744", borderRadius: "10px", padding: "12px 16px", marginBottom: "16px" }}>
                <p style={{ color: "#cdd5e8", fontSize: "12.5px", margin: 0, lineHeight: 1.7 }}>
                  From day one, the FDE Academy is designed around one outcome: helping you transition into <strong style={{ color: "#f97316" }}>high-impact Forward Deployed and Applied AI roles.</strong>{" "}
                  This is a <strong style={{ color: "#fff" }}>structured, hands-on career execution process</strong> that runs parallel to the program.
                </p>
              </div>

              {/* Role cards */}
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
                {CAREER_ROLES.map(r => (
                  <div key={r.title} style={{ background: dark ? "#1a2030" : "#fff", borderRadius: "12px", border: `1px solid ${border}`, padding: "14px", borderLeft: `4px solid ${r.color}` }}>
                    <div style={{ fontSize: "12px", fontWeight: 800, color: text, marginBottom: "6px" }}>{r.title}</div>
                    <div style={{ fontSize: "16px", fontWeight: 900, color: r.color, marginBottom: "2px" }}>{r.indiaRange}</div>
                    <div style={{ fontSize: "10px", color: muted, marginBottom: "8px" }}>{r.globalRange}</div>
                    <div style={{ fontSize: "11px", color: dark ? "#aaa" : "#666", lineHeight: 1.5 }}>{r.desc}</div>
                  </div>
                ))}
              </div>

              {/* Futurense */}
              <div style={{ background: dark ? "#1e2d40" : "#fdf4ee", borderRadius: "12px", padding: "14px", border: `1px solid ${dark ? "#e86a2a40" : "#fad9c0"}`, marginBottom: "16px" }}>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#e86a2a", marginBottom: "6px" }}>Backed by Futurense's Hiring Engine</div>
                <div style={{ fontSize: "11.5px", color: dark ? "#cdd5e8" : "#555", marginBottom: "12px" }}>The FDE Academy is built by Futurense, one of India's largest data and AI skilling and staffing companies.</div>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {[["25,000+", "professionals trained"], ["400+", "team members"], ["540+", "global companies"]].map(([val, label]) => (
                    <div key={label} style={{ background: bg, borderRadius: "8px", padding: "10px 14px", border: `1px solid ${border}`, textAlign: "center" }}>
                      <div style={{ fontSize: "18px", fontWeight: 900, color: "#e86a2a" }}>{val}</div>
                      <div style={{ fontSize: "10px", color: muted }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Support steps */}
              <div style={{ fontSize: "13px", fontWeight: 700, color: text, marginBottom: "12px" }}>How Career Support Actually Works</div>
              <div style={{ background: dark ? "#1a2030" : "#f8f9fa", borderRadius: "12px", padding: "4px", marginBottom: "12px" }}>
                {CAREER_SUPPORT.map((s, i) => (
                  <div key={s.num} style={{ display: "flex", gap: "12px", padding: "12px", borderBottom: i < CAREER_SUPPORT.length - 1 ? `1px solid ${border}` : "none", alignItems: "flex-start" }}>
                    <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: s.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "11px", fontWeight: 800, flexShrink: 0, marginTop: "1px" }}>{s.num}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "12.5px", fontWeight: 700, color: text, marginBottom: "5px" }}>{s.title}</div>
                      {s.items.map(item => (
                        <div key={item} style={{ display: "flex", gap: "5px", marginBottom: "3px" }}>
                          <ArrowRight size={10} color={s.color} style={{ marginTop: "3px", flexShrink: 0 }} />
                          <span style={{ fontSize: "11px", color: muted, lineHeight: 1.5 }}>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background: "#1a2744", borderRadius: "12px", padding: "14px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: "#c94fa3", marginBottom: "6px" }}>This is NOT:</div>
                    {["A mass placement program", "A resume-only certification funnel", "For passive learners"].map(item => (
                      <div key={item} style={{ fontSize: "11px", color: "#aaa", marginBottom: "3px" }}>• {item}</div>
                    ))}
                  </div>
                  <div>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: "#e86a2a", marginBottom: "6px" }}>This is for people who want someone to:</div>
                    {["Push them harder", "Tell them where they're falling short", "Help them reach roles they are genuinely capable of earning"].map(item => (
                      <div key={item} style={{ fontSize: "11px", color: "#cdd5e8", marginBottom: "3px" }}>• {item}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── COMMUNITY ── */}
          {activeTab === "community" && (
            <div>
              <h2 style={{ margin: "0 0 4px", fontSize: isMobile ? "17px" : "20px", color: text, fontWeight: 800 }}>The Forward Deployed Engineer Community</h2>
              <p style={{ color: muted, fontSize: "12px", margin: "0 0 16px" }}>Lifetime access to the largest FDE community in the world.</p>

              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
                <div style={{ background: "#1a2744", borderRadius: "12px", padding: "14px" }}>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "#e86a2a", marginBottom: "6px" }}>10+ Countries</div>
                  <div style={{ fontSize: "10px", color: "#aaa", marginBottom: "8px" }}>Today, members are joining from:</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                    {COMMUNITY_COUNTRIES.map(c => (
                      <span key={c} style={{ background: "rgba(255,255,255,0.1)", color: "#e2e8f0", fontSize: "10px", padding: "2px 8px", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.15)" }}>{c}</span>
                    ))}
                  </div>
                </div>
                <div style={{ background: "#1a2744", borderRadius: "12px", padding: "14px" }}>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "#c94fa3", marginBottom: "6px" }}>Leading Companies</div>
                  <div style={{ fontSize: "10px", color: "#aaa", marginBottom: "8px" }}>Members work at:</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                    {COMMUNITY_COMPANIES.map(c => (
                      <span key={c} style={{ background: "rgba(255,255,255,0.1)", color: "#e2e8f0", fontSize: "10px", padding: "2px 8px", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.15)" }}>{c}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ background: dark ? "#1e2d40" : "#fdf4ee", borderRadius: "12px", padding: "14px", border: `1px solid ${dark ? "#e86a2a40" : "#fad9c0"}`, marginBottom: "14px" }}>
                <div style={{ fontSize: "12.5px", fontWeight: 700, color: "#e86a2a", marginBottom: "8px" }}>Why this community matters</div>
                <div style={{ fontSize: "11.5px", color: dark ? "#cdd5e8" : "#555", marginBottom: "10px", lineHeight: 1.6, fontWeight: 600 }}>Forward Deployed roles are driven by networks, not job boards.</div>
                {["Open roles surface early", "Compensation benchmarks are shared transparently", "Remote and global opportunities move peer-to-peer", "Experienced FDEs guide others on where demand is real"].map(item => (
                  <div key={item} style={{ display: "flex", gap: "7px", marginBottom: "5px" }}>
                    <CheckCircle2 size={12} color="#e86a2a" style={{ flexShrink: 0, marginTop: "2px" }} />
                    <span style={{ fontSize: "11.5px", color: dark ? "#cdd5e8" : "#555" }}>{item}</span>
                  </div>
                ))}
              </div>

              <div style={{ fontSize: "12.5px", fontWeight: 700, color: text, marginBottom: "10px" }}>How the community actually operates</div>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "9px", marginBottom: "14px" }}>
                {COMMUNITY_FEATURES.map(f => (
                  <div key={f.title} style={{ background: bg, borderRadius: "10px", border: `1px solid ${border}`, padding: "12px", borderLeft: `3px solid ${f.color}` }}>
                    <div style={{ fontSize: "12px", fontWeight: 700, color: f.color, marginBottom: "5px" }}>{f.title}</div>
                    <div style={{ fontSize: "11px", color: muted, lineHeight: 1.5 }}>{f.desc}</div>
                  </div>
                ))}
              </div>

              <div style={{ background: "#1a2744", borderRadius: "12px", padding: "14px" }}>
                <div style={{ fontSize: "11.5px", color: "#cdd5e8", lineHeight: 1.7, marginBottom: "10px" }}>
                  This community is built around <strong style={{ color: "#e86a2a" }}>one role.</strong> That focus is what gives it strength. Forward Deployed Engineering is still early as a role. Over the next few years, it will become a standard way AI companies scale. Being part of this community now means you are early, connected, and visible as that shift happens.
                </div>
                <div style={{ fontSize: "14px", fontWeight: 800, color: "#fff" }}>A small group now. A defining network over time.</div>
              </div>
            </div>
          )}

          {/* ── GOA RETREAT ── */}
          {activeTab === "retreat" && (
            <div>
              <h2 style={{ margin: "0 0 4px", fontSize: isMobile ? "17px" : "20px", color: text, fontWeight: 800 }}>The 2-Day In-Person Goa Retreat</h2>
              <p style={{ color: muted, fontSize: "12px", margin: "0 0 4px" }}>Where the first generation of FDEs comes together!</p>
              <div style={{ background: "#1a2744", borderRadius: "12px", padding: "14px", marginBottom: "16px" }}>
                <p style={{ color: "#cdd5e8", fontSize: "12.5px", margin: 0, lineHeight: 1.7 }}>
                  Once a year, the community comes together for a <strong style={{ color: "#fff" }}>2-day Goa retreat</strong> — a high-signal gathering focused on thinking, building, and connection. This is not just a meetup. It is a working retreat designed for the next generation of Forward Deployed Engineers.
                </p>
              </div>

              <div style={{ background: dark ? "#1e2d40" : "#fdf4ee", borderRadius: "12px", padding: "16px", border: `1px solid ${dark ? "#e86a2a40" : "#fad9c0"}`, marginBottom: "14px" }}>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#e86a2a", marginBottom: "10px" }}>What happens at the retreat</div>
                {[
                  "Conversations with AI thought leaders, senior practitioners, and builders",
                  "Deep discussions on how the Forward Deployed role is evolving globally",
                  "Structured working sessions and collaborative builds",
                  "Time designed to build trust and long-term professional bonds",
                ].map(item => (
                  <div key={item} style={{ display: "flex", gap: "7px", marginBottom: "7px" }}>
                    <Star size={11} fill="#e86a2a" color="#e86a2a" style={{ flexShrink: 0, marginTop: "3px" }} />
                    <span style={{ fontSize: "12px", color: dark ? "#cdd5e8" : "#555", lineHeight: 1.6, fontWeight: 500 }}>{item}</span>
                  </div>
                ))}
                <div style={{ marginTop: "10px", fontSize: "14px", fontWeight: 800, color: "#c94fa3" }}>...and a lot of fun!</div>
              </div>

              <div style={{ background: dark ? "#1a2030" : "#f5f0ff", borderRadius: "12px", padding: "14px", border: `1px solid ${dark ? "#7c3aed40" : "#ddd0ff"}`, marginBottom: "16px" }}>
                <div style={{ fontSize: "12.5px", fontWeight: 700, color: "#7c3aed", marginBottom: "6px" }}>A core part of the retreat is Content Creation</div>
                <div style={{ fontSize: "11.5px", color: dark ? "#cdd5e8" : "#555", lineHeight: 1.7 }}>
                  Members record conversations, share insights, and put their thinking out publicly. The goal is to help early members of this community <strong style={{ color: "#7c3aed" }}>become visible voices of the FDE world</strong> while the role itself is still forming.
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: "10px" }}>
                {[
                  { label: "Unwind", sub: "One of a kind staycation blend", color: "#e86a2a", Icon: Heart },
                  { label: "Recharge", sub: "Get back in charged and ready", color: "#c94fa3", Icon: Zap },
                  { label: "Focus", sub: "Give back to yourself", color: "#7c3aed", Icon: Target },
                ].map(p => (
                  <div key={p.label} style={{ background: "#1a2744", borderRadius: "12px", padding: "16px", textAlign: "center", border: `1px solid ${p.color}40` }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: `${p.color}20`, border: `1px solid ${p.color}50`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
                      <p.Icon size={18} color={p.color} />
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: 800, color: "#fff", marginBottom: "4px" }}>{p.label}</div>
                    <div style={{ fontSize: "11px", color: "#aaa" }}>{p.sub}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: "14px", background: dark ? "#1e2d40" : "#fdf4ee", borderRadius: "12px", padding: "14px", border: `1px solid ${dark ? "#e86a2a40" : "#fad9c0"}` }}>
                <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                  <MapPin size={14} color="#e86a2a" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <div style={{ fontSize: "12px", color: dark ? "#cdd5e8" : "#555", lineHeight: 1.7 }}>
                    <strong style={{ color: text }}>Location:</strong> Goa, India — once a year, the entire FDE community gathers here as a defining moment of the cohort. Included as part of the program experience.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── ADMISSION ── */}
          {activeTab === "admission" && (
            <div>
              <h2 style={{ margin: "0 0 4px", fontSize: isMobile ? "17px" : "20px", color: text, fontWeight: 800 }}>Admission</h2>
              <p style={{ color: "#c94fa3", fontSize: "12.5px", margin: "0 0 16px", fontWeight: 500, fontStyle: "italic" }}>Not for casual learners. Designed for people who want to be trusted with real systems.</p>
              <div style={{ background: dark ? "#1e2d40" : "#fdf4ee", border: `1px solid ${dark ? "#e86a2a40" : "#fad9c0"}`, borderRadius: "12px", padding: "14px", marginBottom: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                  <Target size={13} color="#e86a2a" />
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#e86a2a" }}>Who should apply</span>
                </div>
                {["Engineers who want to own AI systems, not just build them", "Developers moving from backend/frontend into applied AI", "Tech professionals wanting the FDE career path", "People who want to be trusted in high-stakes environments"].map(item => (
                  <div key={item} style={{ display: "flex", gap: "7px", marginBottom: "6px" }}>
                    <CheckCircle2 size={13} color="#e86a2a" style={{ marginTop: "2px", flexShrink: 0 }} />
                    <span style={{ fontSize: "12.5px", color: dark ? "#cdd5e8" : "#555" }}>{item}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "9px", marginBottom: "12px" }}>
                {[
                  { Icon: BookOpen, label: "Duration", value: "32 Weeks" },
                  { Icon: Layers, label: "Format", value: "Dual-Track" },
                  { Icon: Globe, label: "Mode", value: "Online · Cohort" },
                  { Icon: GraduationCap, label: "Certification", value: "IIT Roorkee PG" },
                ].map(d => (
                  <div key={d.label} style={{ background: bg, border: `1px solid ${border}`, borderRadius: "10px", padding: "12px", display: "flex", alignItems: "center", gap: "9px" }}>
                    <d.Icon size={17} color="#e86a2a" />
                    <div>
                      <div style={{ fontSize: "10px", color: muted, marginBottom: "1px" }}>{d.label}</div>
                      <div style={{ fontSize: isMobile ? "12px" : "14px", fontWeight: 800, color: text }}>{d.value}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ background: "#1a2744", borderRadius: "12px", padding: "16px" }}>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#f97316", marginBottom: "8px" }}>Our Philosophy</div>
                <p style={{ fontSize: "12.5px", color: "#cdd5e8", margin: "0 0 8px", lineHeight: 1.7 }}>
                  Most AI programs optimize for certificates. This program optimizes for <strong style={{ color: "#fff" }}>capability and accountability.</strong>
                </p>
                {["Real-world constraints, not ideal data", "System-level thinking, not isolated models", "Judgment under ambiguity, not step-by-step instructions"].map(item => (
                  <div key={item} style={{ display: "flex", gap: "7px", marginBottom: "5px" }}>
                    <ArrowRight size={12} color="#e86a2a" style={{ flexShrink: 0, marginTop: "2px" }} />
                    <span style={{ fontSize: "12px", color: "#aab4cc" }}>{item}</span>
                  </div>
                ))}
                <button onClick={handleApply} style={{ marginTop: "14px", width: "100%", padding: "12px", background: "linear-gradient(135deg, #e86a2a, #c94fa3)", color: "#fff", border: "none", borderRadius: "10px", fontWeight: 700, fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "7px" }}>
                  <Send size={14} /> Apply Now — Limited Seats
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Footer, navbar, and announcement banner now come from the
          shared PublicLayout shell below — no page-local nav/footer. */}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .fde-page, .fde-page *, .fde-page *::before, .fde-page *::after { box-sizing: border-box; }
        .fde-page ::-webkit-scrollbar { width: 6px; height: 6px; }
        .fde-page ::-webkit-scrollbar-track { background: transparent; }
        .fde-page ::-webkit-scrollbar-thumb { background: #d0c8be; border-radius: 3px; }
      `}</style>
    </div>
    </PublicLayout>
  );
}