import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight, Star, Users, Award, TrendingUp, ChevronDown,
  Globe, Clock, BookOpen, Menu, Moon, Sun, MapPin, Phone,
  CheckCircle2, Zap, Video, Wifi, Monitor, Building2,
  GraduationCap, Target, BarChart2, Mic,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import MegaMenu from "../../components/MegaMenu";

/* ─── Data ───────────────────────────────────────────────────────────────── */

const COUNTRIES = [
  { name: "Oman",         flagCode: "om", route: "/ilm-ora-gulf/om" },
  { name: "UAE",          flagCode: "ae", route: "/ilm-ora-gulf/ae" },
  { name: "Malaysia",     flagCode: "my", route: "/ilm-ora-gulf/my" },
  { name: "Kuwait",       flagCode: "kw", route: "/ilm-ora-gulf/kw" },
  { name: "Qatar",        flagCode: "qa", route: "/ilm-ora-gulf/qa" },
  { name: "Saudi Arabia", flagCode: "sa", route: "/ilm-ora-gulf/sa" },
  { name: "Bahrain",      flagCode: "bh", route: "/ilm-ora-gulf/bh" },
  { name: "Uganda",       flagCode: "ug", route: "/ilm-ora-gulf/ug" },
  { name: "Nigeria",      flagCode: "ng", route: "/ilm-ora-gulf/ng" },
  { name: "Tanzania",     flagCode: "tz", route: "/ilm-ora-gulf/tz" },
  { name: "Singapore",    flagCode: "sg", route: "/ilm-ora-gulf/sg" },
];

const HIGHLIGHTS = [
  {
    Icon: Video,
    title: "Live & Interactive Classes",
    desc: "Real-time sessions with expert ILM ORA coaches — not pre-recorded videos.",
    mode: "Online",
  },
  {
    Icon: Monitor,
    title: "Recorded Lectures",
    desc: "Every session is recorded so you can revise anytime, at your own pace.",
    mode: "Online",
  },
  {
    Icon: Zap,
    title: "Doubt Solving Sessions",
    desc: "24×7 doubt support with dedicated mentors for rock-solid preparation.",
    mode: "Online",
  },
  {
    Icon: Users,
    title: "Gulf Exclusive Batches",
    desc: "Small cohorts with personalised attention designed for NRI students.",
    mode: "Online",
  },
  {
    Icon: Building2,
    title: "Offline Centres",
    desc: "Physical classrooms across Gulf cities for immersive, in-person learning.",
    mode: "Offline",
  },
  {
    Icon: GraduationCap,
    title: "Experienced Faculty",
    desc: "Hand-picked educators with proven track records in competitive exams.",
    mode: "Offline",
  },
];

const COURSES = [
  { Icon: Target,       title: "IIT JEE",          desc: "Engineering entrance prep for Class 11–12 & Droppers",        tag: "Most Popular", color: "#f97316" },
  { Icon: BarChart2,    title: "NEET",             desc: "Medical entrance coaching tailored for Gulf students",         tag: "Top Rated",    color: "#10b981" },
  { Icon: GraduationCap,title: "CBSE Boards",      desc: "Class 9–12 Science, Commerce & Arts — all streams",           tag: null,           color: "#6366f1" },
  { Icon: Globe,        title: "Foundation",       desc: "Class 6–10 foundation for future competitive success",         tag: null,           color: "#f59e0b" },
  { Icon: Mic,          title: "ILM ORA Talk",     desc: "Spoken English & communication skills for Gulf learners",      tag: "New",          color: "#ec4899" },
  { Icon: BookOpen,     title: "Study Abroad",     desc: "IELTS, TOEFL & university application guidance",              tag: null,           color: "#0ea5e9" },
];

const STATS = [
  { value: "15,000+", label: "Gulf Learners",       Icon: Users      },
  { value: "4.9★",    label: "Average Rating",      Icon: Star       },
  { value: "11",      label: "Countries Covered",   Icon: Globe      },
  { value: "200+",    label: "Expert Educators",    Icon: Award      },
];

const RESULTS = [
  { name: "Aryan Sharma",    score: "99.8%", exam: "JEE Main",   country: "UAE",    year: "2024" },
  { name: "Priya Nair",      score: "99.6%", exam: "CBSE Boards",country: "Oman",   year: "2024" },
  { name: "Mohammed Al-Sadi",score: "720/720",exam: "NEET",      country: "Kuwait", year: "2024" },
  { name: "Sneha Kapoor",    score: "99.4%", exam: "JEE Main",   country: "Qatar",  year: "2023" },
];

const TESTIMONIALS = [
  { name: "Rahul Mehta",   role: "JEE Advanced Qualifier, Dubai",    text: "ILM ORA Gulf gave me world-class JEE coaching without having to leave the Gulf. The live sessions and doubt support were exactly what I needed.", rating: 5 },
  { name: "Ananya Iyer",   role: "NEET Qualifier, Muscat",           text: "The faculty here truly understands the challenges of studying abroad. My NEET score improved by 120 marks after joining ILM ORA Gulf.", rating: 5 },
  { name: "Aditya Verma",  role: "CBSE 98% Scorer, Kuwait City",     text: "Small batch sizes meant my teacher actually knew my weaknesses. I went from 72% to 98% in boards in just one year.", rating: 5 },
  { name: "Fatima Al-Zahra",role: "Study Abroad — NUS Singapore",    text: "The IELTS preparation and university counselling at ILM ORA helped me get into NUS. I couldn't have done it without them.", rating: 5 },
];

const FAQS = [
  { q: "Who is ILM ORA Gulf for?",                          a: "ILM ORA Gulf is designed for Indian and NRI students living across the Gulf, Africa, and Southeast Asia who are preparing for JEE, NEET, CBSE Boards, or seeking study abroad guidance." },
  { q: "Are classes available online and offline?",          a: "Yes. We offer both live online sessions with recorded backups, and offline centres in select Gulf cities. You can choose what works best for you." },
  { q: "What is the batch size?",                           a: "We maintain a maximum of 20 students per batch to ensure personalised attention and ample interaction time with the faculty." },
  { q: "Do you provide study material?",                    a: "Yes, comprehensive study material aligned with the latest syllabus is provided digitally. Hard copies are available at our offline centres." },
  { q: "Is there a doubt-solving facility?",                a: "Absolutely. We have dedicated doubt-solving sessions every week, plus an always-on chat support with mentors." },
  { q: "How do I enrol?",                                   a: "Click 'Enrol Now' on any course card, fill a quick form and our Gulf counsellor will reach out within 24 hours to guide you through everything." },
];

const HOW_STEPS = [
  { step: "01", title: "Choose Your Country",        desc: "Select your Gulf region so we can connect you with the right local batch and centre." },
  { step: "02", title: "Pick Your Program",          desc: "JEE, NEET, CBSE, Foundation, Talk or Study Abroad — we have a program for every goal." },
  { step: "03", title: "Join a Live Cohort",         desc: "Get placed in a small, focused batch with a dedicated coach assigned just for you." },
  { step: "04", title: "Excel & Get Placed",         desc: "Receive your certificate, unlock placement support and join 15,000+ successful Gulf alumni." },
];

/* ─── Constants ──────────────────────────────────────────────────────────── */
const F = "'Plus Jakarta Sans','Segoe UI',system-ui,sans-serif";
const W = "920px";

const GLOBAL = `
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  .mob-only{display:none!important;}
  @media(max-width:1279px){
    .desk-nav{display:none!important;}
    .mob-only{display:flex!important;}
  }
  .nav-lnk{
    background:transparent;
    border:none;
    padding:7px 13px;
    border-radius:8px;
    font-size:14px;
    font-weight:600;
    cursor:pointer;
    transition:color .2s,background .2s;
    white-space:nowrap;
    color:#1E293B;
  }
  html.dark .nav-lnk{ color:#e2e8f0 !important; }
  .nav-lnk:hover{ color:#f97316!important; background:rgba(249,115,22,.07)!important; }
`;

/* ─── Navbar ─────────────────────────────────────────────────────────────── */
function Navbar({ isDark, toggleTheme }) {
  const navigate = useNavigate();
  const [open, setOpen]         = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const NAV = [
    { label: "Mentors",         path: "/mentors" },
    { label: "Success Stories", path: "/success-stories" },
    { label: "Free Services",   path: "/free-services" },
    { label: "School Programs", path: "/school-class" },
  ];

  const navBg = isDark
    ? (scrolled ? "#0c0c14" : "rgba(12,12,20,.94)")
    : (scrolled ? "#ffffff" : "rgba(255,255,255,.94)");

  const btnBase = {
    width: "38px", height: "38px", display: "flex", alignItems: "center", justifyContent: "center",
    borderRadius: "10px", cursor: "pointer", transition: "all .2s",
    border: isDark ? "1px solid rgba(255,255,255,.13)" : "1px solid #e2e8f0",
    background: isDark ? "rgba(255,255,255,.05)" : "#f8fafc",
  };

  const mLinkClr = isDark ? "#e2e8f0" : "#1E293B";

  return (
    <>
      <style>{GLOBAL}</style>
      <nav style={{ position: "fixed", top: 0, width: "100%", zIndex: 100, background: navBg, backdropFilter: "blur(18px)", borderBottom: isDark ? "1px solid rgba(255,255,255,.07)" : "1px solid rgba(249,115,22,.1)", boxShadow: scrolled ? "0 2px 22px rgba(0,0,0,.13)" : "none", transition: "background .3s,box-shadow .3s" }}>
        <div style={{ maxWidth: W, margin: "0 auto", padding: "0 20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "60px" }}>

            {/* Logo */}
            <div onClick={() => navigate("/")} style={{ cursor: "pointer", flexShrink: 0 }}>
              <span style={{ fontSize: "clamp(22px,2.8vw,28px)", fontWeight: 900, fontFamily: "Georgia,serif", lineHeight: 1, whiteSpace: "nowrap" }}>
                <span style={{ color: "#16a34a" }}>ILM</span>
                <span style={{ color: "#f97316", marginLeft: "3px" }}>ORA</span>
              </span>
            </div>

            {/* Desktop nav */}
            <div className="desk-nav" style={{ display: "flex", alignItems: "center", gap: "2px", flex: 1, justifyContent: "center", margin: "0 16px" }}>
              <MegaMenu />
              {NAV.map(l => (
                <button key={l.label} className="nav-lnk" onClick={() => navigate(l.path)} style={{ fontFamily: F }}>{l.label}</button>
              ))}
            </div>

            {/* Right */}
            <div style={{ display: "flex", alignItems: "center", gap: "9px", flexShrink: 0 }}>
              <button onClick={toggleTheme} style={btnBase}>
                {isDark
                  ? <Sun  style={{ width: "16px", height: "16px", color: "#f97316" }} />
                  : <Moon style={{ width: "16px", height: "16px", color: "#475569" }} />}
              </button>

              <div className="mob-only" style={{ alignItems: "center" }}>
                <Sheet open={open} onOpenChange={setOpen}>
                  <SheetTrigger asChild>
                    <button style={btnBase}>
                      <Menu style={{ width: "18px", height: "18px", color: isDark ? "#e2e8f0" : "#1E293B" }} />
                    </button>
                  </SheetTrigger>
                  <SheetContent side="right" style={{ background: isDark ? "#0c0c14" : "#fff", width: "280px", padding: 0, borderLeft: isDark ? "1px solid rgba(255,255,255,.07)" : "1px solid #f1f5f9" }}>
                    <div style={{ padding: "16px 20px", borderBottom: isDark ? "1px solid rgba(255,255,255,.07)" : "1px solid #f1f5f9" }}>
                      <span style={{ fontSize: "22px", fontWeight: 900, fontFamily: "Georgia,serif" }}>
                        <span style={{ color: "#16a34a" }}>ILM</span>
                        <span style={{ color: "#f97316", marginLeft: "3px" }}>ORA</span>
                      </span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", padding: "12px", gap: "2px" }}>
                      <p style={{ fontSize: "10px", fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", color: "#94a3b8", padding: "0 8px", marginBottom: "6px" }}>Menu</p>
                      <div style={{ paddingBottom: "6px" }}><MegaMenu /></div>
                      {NAV.map(l => (
                        <button key={l.label}
                          onClick={() => { navigate(l.path); setOpen(false); }}
                          style={{ color: mLinkClr, background: "transparent", border: "none", padding: "11px 10px", borderRadius: "9px", fontSize: "14px", fontWeight: 600, cursor: "pointer", textAlign: "left", width: "100%", transition: "all .2s", fontFamily: F }}
                          onMouseEnter={e => { e.currentTarget.style.color = "#f97316"; e.currentTarget.style.background = "rgba(249,115,22,.07)"; }}
                          onMouseLeave={e => { e.currentTarget.style.color = mLinkClr; e.currentTarget.style.background = "transparent"; }}>
                          {l.label}
                        </button>
                      ))}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

/* ─── Helpers ────────────────────────────────────────────────────────────── */
const Pill = ({ children }) => (
  <span style={{ display: "inline-block", fontSize: "10px", fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", color: "#f97316", background: "rgba(249,115,22,.08)", border: "1px solid rgba(249,115,22,.2)", borderRadius: "100px", padding: "3px 13px" }}>
    {children}
  </span>
);

function SectionHead({ pill, title, sub, tp, ts }) {
  return (
    <div style={{ textAlign: "center", marginBottom: "28px" }}>
      <Pill>{pill}</Pill>
      <h2 style={{ fontSize: "clamp(18px,2.8vw,30px)", fontWeight: 800, color: tp, marginTop: "10px", marginBottom: "7px", fontFamily: F, lineHeight: 1.2 }}
        dangerouslySetInnerHTML={{ __html: title }} />
      {sub && <p style={{ color: ts, fontSize: "clamp(12px,1.2vw,13px)", maxWidth: "440px", margin: "0 auto", lineHeight: 1.6 }}>{sub}</p>}
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────────────── */
export default function ILMORAGulf() {
  const navigate  = useNavigate();
  const [faq,    setFaq]    = useState(null);
  const [theme,  setTheme]  = useState("light");
  const [activeCourse, setActiveCourse] = useState(null);

  const isDark = theme === "dark";
  useEffect(() => { document.documentElement.classList.toggle("dark", isDark); }, [isDark]);
  useEffect(() => { window.scrollTo({ top: 0 }); }, []);

  /* Palette — identical to IlmOraTalk */
  const BG   = isDark ? "#0c0c14" : "#F5EDE6";
  const CARD = isDark ? "#13131e" : "#ffffff";
  const BDR  = isDark ? "rgba(255,255,255,.08)" : "#e8e8e8";
  const TP   = isDark ? "#f1f5f9" : "#1E293B";
  const TS   = isDark ? "#94a3b8" : "#64748b";
  const SW   = isDark ? "#0f0f18" : "#ffffff";
  const ST   = isDark ? "#0c0c14" : "#F5EDE6";
  const SD   = isDark ? "#07070e" : "#1E293B";
  const IC   = isDark ? "rgba(255,255,255,.03)" : "#f9f9f9";

  const SP = "clamp(32px,5vw,52px) clamp(14px,3vw,20px)";

  return (
    <div style={{ fontFamily: F, background: BG, minHeight: "100vh", color: TP, transition: "background .3s,color .3s" }}>
      <Navbar isDark={isDark} toggleTheme={() => setTheme(p => p === "dark" ? "light" : "dark")} />
      <div style={{ height: "60px" }} />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f172a 55%,#1e1b3a 100%)", padding: "clamp(44px,7vw,76px) clamp(14px,3vw,20px) clamp(36px,6vw,60px)", position: "relative", overflow: "hidden" }}>
        {/* Glow blobs */}
        <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "300px", height: "300px", borderRadius: "50%", background: "rgba(249,115,22,.07)", filter: "blur(80px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-40px", left: "-40px", width: "220px", height: "220px", borderRadius: "50%", background: "rgba(16,185,129,.06)", filter: "blur(80px)", pointerEvents: "none" }} />

        <div style={{ maxWidth: W, margin: "0 auto", position: "relative", zIndex: 1 }}>
          {/* Badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: "7px", background: "rgba(249,115,22,.11)", border: "1px solid rgba(249,115,22,.28)", borderRadius: "100px", padding: "4px 14px", marginBottom: "18px" }}>
            <Globe size={12} color="#f97316" />
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#f97316", letterSpacing: ".04em" }}>ILM ORA Gulf — Learning Across 11 Countries</span>
          </div>

          <h1 style={{ fontSize: "clamp(26px,4.5vw,52px)", fontWeight: 800, color: "#fff", lineHeight: 1.1, marginBottom: "14px", maxWidth: "600px", fontFamily: F }}>
            World-Class Learning<br /><span style={{ color: "#f97316" }}>Wherever You Are.</span>
          </h1>
          <p style={{ fontSize: "clamp(12px,1.5vw,15px)", color: "#94a3b8", maxWidth: "460px", lineHeight: 1.7, marginBottom: "28px" }}>
            ILM ORA Gulf brings expert coaching for JEE, NEET, CBSE, Communication & Study Abroad to Indian & NRI students across the Gulf, Africa & Southeast Asia.
          </p>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "40px" }}>
            <button
              onClick={() => document.getElementById("courses")?.scrollIntoView({ behavior: "smooth" })}
              style={{ display: "inline-flex", alignItems: "center", gap: "7px", background: "#f97316", color: "#fff", border: "none", borderRadius: "10px", padding: "11px 24px", fontSize: "13px", fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 18px rgba(249,115,22,.32)", transition: "all .2s", fontFamily: F }}
              onMouseEnter={e => { e.currentTarget.style.background = "#ea6c0a"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#f97316"; e.currentTarget.style.transform = "none"; }}>
              Explore Courses <ArrowRight size={14} />
            </button>
            <button
              onClick={() => document.getElementById("countries")?.scrollIntoView({ behavior: "smooth" })}
              style={{ display: "inline-flex", alignItems: "center", gap: "7px", background: "transparent", color: "#e2e8f0", border: "1px solid rgba(255,255,255,.2)", borderRadius: "10px", padding: "11px 24px", fontSize: "13px", fontWeight: 600, cursor: "pointer", transition: "all .2s", fontFamily: F }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,.4)"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,.2)"; e.currentTarget.style.color = "#e2e8f0"; }}>
              <Globe size={14} /> Select Your Country
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: "clamp(12px,2.5vw,28px)", flexWrap: "wrap" }}>
            {STATS.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(249,115,22,.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <s.Icon size={14} color="#f97316" />
                </div>
                <div>
                  <div style={{ fontSize: "clamp(13px,1.5vw,16px)", fontWeight: 800, color: "#fff", fontFamily: F }}>{s.value}</div>
                  <div style={{ fontSize: "9px", color: "#64748b", fontWeight: 500 }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COUNTRY SELECTOR ──────────────────────────────────────────────── */}
      <section id="countries" style={{ padding: SP, background: SW, transition: "background .3s" }}>
        <div style={{ maxWidth: W, margin: "0 auto" }}>
          <SectionHead
            pill="Select Your Region"
            title={`Choose your <span style="color:#f97316">country</span>`}
            sub="ILM ORA Gulf is available across 11 countries. Select yours to explore local batches, centres & programs."
            tp={TP} ts={TS} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,160px),1fr))", gap: "10px" }}>
            {COUNTRIES.map((c) => (
              <button
                key={c.name}
                onClick={() => navigate(c.route)}
                style={{ display: "flex", alignItems: "center", gap: "10px", padding: "13px 14px", borderRadius: "12px", border: `1px solid ${BDR}`, background: CARD, cursor: "pointer", textAlign: "left", transition: "all .18s ease", width: "100%" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(249,115,22,.35)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(249,115,22,.1)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = BDR; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
              >
                <span style={{ flexShrink: 0, width: "44px", height: "30px", borderRadius: "6px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f0f0", border: "1px solid #e0e0e0" }}>
                  <img
                    src={`https://flagcdn.com/w40/${c.flagCode}.png`}
                    alt={c.name}
                    style={{ width: "44px", height: "30px", objectFit: "cover", display: "block" }}
                  />
                </span>
                <span style={{ fontSize: "13px", fontWeight: 700, color: TP, fontFamily: F }}>{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW WE DELIVER ────────────────────────────────────────────────── */}
      <section style={{ padding: SP, background: ST, transition: "background .3s" }}>
        <div style={{ maxWidth: W, margin: "0 auto" }}>
          <SectionHead
            pill="How We Deliver"
            title={`Online & Offline — <span style="color:#f97316">you choose</span>`}
            sub="Two powerful learning modes, one mission: get you to the top."
            tp={TP} ts={TS} />

          {/* Mode tabs header */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
            {["Online", "Offline"].map((mode) => (
              <div key={mode} style={{ background: mode === "Online" ? "rgba(249,115,22,.08)" : "rgba(16,185,129,.08)", border: `1px solid ${mode === "Online" ? "rgba(249,115,22,.2)" : "rgba(16,185,129,.2)"}`, borderRadius: "12px", padding: "12px 16px", textAlign: "center" }}>
                <div style={{ fontSize: "13px", fontWeight: 800, color: mode === "Online" ? "#f97316" : "#10b981", marginBottom: "2px" }}>{mode} Learning</div>
                <div style={{ fontSize: "10px", color: TS }}>
                  {mode === "Online" ? "From the comfort of your home" : "Physical classrooms in Gulf cities"}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,240px),1fr))", gap: "10px" }}>
            {HIGHLIGHTS.map((item, i) => (
              <div key={i}
                style={{ background: IC, borderRadius: "12px", padding: "15px", border: `1px solid ${BDR}`, display: "flex", gap: "11px", alignItems: "flex-start", transition: "all .2s", position: "relative", overflow: "hidden" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = item.mode === "Online" ? "rgba(249,115,22,.3)" : "rgba(16,185,129,.3)"; e.currentTarget.style.boxShadow = `0 4px 14px ${item.mode === "Online" ? "rgba(249,115,22,.09)" : "rgba(16,185,129,.09)"}`; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = BDR; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}>
                {/* Mode tag */}
                <div style={{ position: "absolute", top: "10px", right: "10px", fontSize: "8px", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: item.mode === "Online" ? "#f97316" : "#10b981", background: item.mode === "Online" ? "rgba(249,115,22,.1)" : "rgba(16,185,129,.1)", borderRadius: "100px", padding: "2px 7px" }}>
                  {item.mode}
                </div>
                <div style={{ width: "34px", height: "34px", borderRadius: "9px", background: item.mode === "Online" ? "rgba(249,115,22,.1)" : "rgba(16,185,129,.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <item.Icon size={15} color={item.mode === "Online" ? "#f97316" : "#10b981"} />
                </div>
                <div style={{ paddingRight: "32px" }}>
                  <div style={{ fontWeight: 700, fontSize: "12px", color: TP, marginBottom: "3px" }}>{item.title}</div>
                  <div style={{ fontSize: "11px", color: TS, lineHeight: 1.55 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COURSES ───────────────────────────────────────────────────────── */}
      <section id="courses" style={{ padding: SP, background: SW, transition: "background .3s" }}>
        <div style={{ maxWidth: W, margin: "0 auto" }}>
          <SectionHead
            pill="Our Programs"
            title={`Everything you need to <span style="color:#f97316">succeed</span>`}
            sub="From entrance exams to communication skills — ILM ORA Gulf covers every academic goal."
            tp={TP} ts={TS} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,260px),1fr))", gap: "10px" }}>
            {COURSES.map((c, i) => {
              const CIcon = c.Icon;
              return (
                <div key={i}
                  style={{ background: CARD, borderRadius: "13px", padding: "18px", border: `1px solid ${activeCourse === i ? c.color + "55" : BDR}`, cursor: "pointer", transition: "all .2s", boxShadow: activeCourse === i ? `0 4px 18px ${c.color}22` : "none", position: "relative", overflow: "hidden" }}
                  onClick={() => setActiveCourse(activeCourse === i ? null : i)}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = c.color + "55"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 4px 16px ${c.color}18`; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = activeCourse === i ? c.color + "55" : BDR; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = activeCourse === i ? `0 4px 18px ${c.color}22` : "none"; }}>
                  {/* Top accent */}
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: c.color, borderRadius: "13px 13px 0 0" }} />
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "10px", marginTop: "4px" }}>
                    <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: c.color + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <CIcon size={17} color={c.color} />
                    </div>
                    {c.tag && (
                      <span style={{ fontSize: "9px", fontWeight: 700, background: c.color, color: "#fff", borderRadius: "100px", padding: "2px 8px", letterSpacing: ".04em", whiteSpace: "nowrap", alignSelf: "flex-start" }}>{c.tag}</span>
                    )}
                  </div>
                  <div style={{ fontWeight: 800, fontSize: "14px", color: TP, marginBottom: "5px", fontFamily: F }}>{c.title}</div>
                  <div style={{ fontSize: "11px", color: TS, lineHeight: 1.55, marginBottom: "13px" }}>{c.desc}</div>
                  <button
                    onClick={e => { e.stopPropagation(); navigate("/course-details"); }}
                    style={{ display: "inline-flex", alignItems: "center", gap: "5px", background: c.color, color: "#fff", border: "none", borderRadius: "8px", padding: "7px 14px", fontSize: "11px", fontWeight: 700, cursor: "pointer", transition: "opacity .2s", fontFamily: F }}
                    onMouseEnter={e => e.currentTarget.style.opacity = ".85"}
                    onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                    Enrol Now <ArrowRight size={11} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TOPPERS ───────────────────────────────────────────────────────── */}
      <section style={{ padding: SP, background: SD }}>
        <div style={{ maxWidth: W, margin: "0 auto" }}>
          <SectionHead
            pill="Gulf Results"
            title={`Our students <span style="color:#f97316">shine</span>`}
            tp="#ffffff" ts="#94a3b8"
            sub="Real results from real ILM ORA Gulf students across JEE, NEET & CBSE." />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,190px),1fr))", gap: "10px", marginBottom: "24px" }}>
            {RESULTS.map((r, i) => (
              <div key={i}
                style={{ background: "rgba(255,255,255,.05)", borderRadius: "12px", padding: "18px", border: "1px solid rgba(255,255,255,.08)", textAlign: "center", transition: "all .2s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,.09)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,.05)"; e.currentTarget.style.transform = "none"; }}>
                {/* Avatar */}
                <div style={{ width: "46px", height: "46px", borderRadius: "50%", background: "#f97316", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: "16px", margin: "0 auto 10px", fontFamily: F }}>
                  {r.name.charAt(0)}
                </div>
                <div style={{ fontSize: "18px", fontWeight: 900, color: "#f97316", fontFamily: F, marginBottom: "2px" }}>{r.score}</div>
                <div style={{ fontSize: "10px", fontWeight: 700, color: "#fff", marginBottom: "2px" }}>{r.exam}</div>
                <div style={{ fontSize: "11px", fontWeight: 600, color: "#cbd5e1", marginBottom: "4px" }}>{r.name}</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                  <MapPin size={9} color="#64748b" />
                  <span style={{ fontSize: "9px", color: "#64748b" }}>{r.country} · {r.year}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center" }}>
            <button
              onClick={() => navigate("/success-stories")}
              style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "transparent", color: "#f97316", border: "1px solid rgba(249,115,22,.35)", borderRadius: "10px", padding: "10px 22px", fontSize: "12px", fontWeight: 700, cursor: "pointer", transition: "all .2s", fontFamily: F }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(249,115,22,.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
              View All Results <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
      <section style={{ padding: SP, background: SW, transition: "background .3s" }}>
        <div style={{ maxWidth: W, margin: "0 auto" }}>
          <SectionHead
            pill="The Process"
            title={`How it <span style="color:#f97316">works</span>`}
            tp={TP} ts={TS} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,170px),1fr))", gap: "11px" }}>
            {HOW_STEPS.map((s, i) => (
              <div key={i}
                style={{ textAlign: "center", padding: "clamp(16px,2vw,22px) clamp(10px,1.5vw,14px)", background: IC, borderRadius: "12px", border: `1px solid ${BDR}`, transition: "all .2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#fed7aa"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(249,115,22,.09)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = BDR; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{ fontSize: "clamp(22px,3.5vw,34px)", fontWeight: 900, color: "#f97316", opacity: 1, lineHeight: 1, marginBottom: "9px", fontFamily: F }}>{s.step}</div>
                <h4 style={{ fontSize: "clamp(11px,1.2vw,12px)", fontWeight: 800, color: TP, marginBottom: "5px", fontFamily: F }}>{s.title}</h4>
                <p style={{ fontSize: "10px", color: TS, lineHeight: 1.55 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────────────── */}
      <section style={{ padding: SP, background: ST, transition: "background .3s" }}>
        <div style={{ maxWidth: W, margin: "0 auto" }}>
          <SectionHead
            pill="Student Stories"
            title={`Real people. <span style="color:#f97316">Real results.</span>`}
            tp={TP} ts={TS} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,210px),1fr))", gap: "11px" }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i}
                style={{ background: CARD, borderRadius: "12px", padding: "clamp(12px,2vw,17px)", border: `1px solid ${BDR}`, transition: "all .2s", display: "flex", flexDirection: "column" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#fed7aa"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(249,115,22,.08)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = BDR; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}>
                <div style={{ display: "flex", gap: "2px", marginBottom: "9px" }}>
                  {[...Array(t.rating)].map((_, j) => <Star key={j} size={11} color="#f97316" fill="#f97316" />)}
                </div>
                <p style={{ fontSize: "11px", color: TS, lineHeight: 1.65, marginBottom: "13px", fontStyle: "italic", flex: 1 }}>"{t.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "#f97316", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: "12px", flexShrink: 0 }}>{t.name.charAt(0)}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: "10px", color: TP, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.name}</div>
                    <div style={{ fontSize: "9px", color: TS, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section style={{ padding: SP, background: SW, transition: "background .3s" }}>
        <div style={{ maxWidth: "620px", margin: "0 auto" }}>
          <SectionHead
            pill="FAQ"
            title={`Frequently asked <span style="color:#f97316">questions</span>`}
            tp={TP} ts={TS} />
          <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
            {FAQS.map((f, i) => (
              <div key={i} style={{ background: CARD, borderRadius: "11px", border: `1px solid ${faq === i ? "#fed7aa" : BDR}`, overflow: "hidden", transition: "all .2s", boxShadow: faq === i ? "0 3px 12px rgba(249,115,22,.07)" : "none" }}>
                <button onClick={() => setFaq(faq === i ? null : i)}
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "clamp(11px,1.5vw,14px) clamp(12px,1.6vw,17px)", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", gap: "8px" }}>
                  <span style={{ fontSize: "clamp(11px,1.1vw,12.5px)", fontWeight: 700, color: TP, fontFamily: F }}>{f.q}</span>
                  <ChevronDown size={13} color="#94a3b8" style={{ flexShrink: 0, transform: faq === i ? "rotate(180deg)" : "none", transition: "transform .25s" }} />
                </button>
                {faq === i && <div style={{ padding: "0 clamp(12px,1.6vw,17px) clamp(10px,1.5vw,13px)", fontSize: "11px", color: TS, lineHeight: 1.65 }}>{f.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section style={{ padding: SP, background: SD, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "#f97316" }} />
        <div style={{ position: "absolute", top: "-50px", right: "-50px", width: "240px", height: "240px", borderRadius: "50%", background: "rgba(249,115,22,.06)", filter: "blur(70px)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "560px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <h2 style={{ fontSize: "clamp(18px,3.2vw,34px)", fontWeight: 800, color: "#fff", marginBottom: "10px", lineHeight: 1.2, fontFamily: F }}>
            Your Gulf journey starts <span style={{ color: "#f97316" }}>here.</span>
          </h2>
          <p style={{ fontSize: "clamp(11px,1.3vw,13px)", color: "#94a3b8", marginBottom: "22px", lineHeight: 1.6 }}>
            Join 15,000+ Gulf learners who trusted ILM ORA to get them where they wanted to go. Select your country and enrol today.
          </p>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => document.getElementById("countries")?.scrollIntoView({ behavior: "smooth" })}
              style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#f97316", color: "#fff", border: "none", borderRadius: "10px", padding: "11px 24px", fontSize: "13px", fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 18px rgba(249,115,22,.32)", transition: "all .2s", fontFamily: F }}
              onMouseEnter={e => { e.currentTarget.style.background = "#ea6c0a"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#f97316"; e.currentTarget.style.transform = "none"; }}>
              <Globe size={14} /> Choose Your Country
            </button>
            <button
              onClick={() => navigate("/")}
              style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "transparent", color: "#94a3b8", border: "1px solid rgba(255,255,255,.13)", borderRadius: "10px", padding: "11px 24px", fontSize: "13px", fontWeight: 600, cursor: "pointer", transition: "all .2s", fontFamily: F }}
              onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "rgba(255,255,255,.3)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "#94a3b8"; e.currentTarget.style.borderColor = "rgba(255,255,255,.13)"; }}>
              ← Back to Home
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}