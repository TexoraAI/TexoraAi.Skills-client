import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight, MapPin, Clock, Briefcase, Zap, Globe2,
  Users, Heart, TrendingUp, Star, ChevronRight, Mail,
  Code2, PenTool, Megaphone, BookOpen, BarChart3, Shield,
} from "lucide-react";

/* ═══════════════════════════════════════════════════
   ILM ORA  ·  CAREERS PAGE
   Brand: Navy #1a2340 | Orange #F97316 | Green #16a34a
   Tone: Editorial/Magazine — warm cream BG, bold type
═══════════════════════════════════════════════════ */

const C = {
  bg:           "#fbeee0",
  bgCard:       "#ffffff",
  bgSub:        "#fdf5ec",
  bgDark:       "#f5e8d5",
  border:       "#e8d9c4",
  borderMid:    "#d5c4aa",
  navy:         "#1a2340",
  navyDark:     "#0f172a",
  orange:       "#F97316",
  orangeLight:  "#fff3e8",
  orangeBorder: "#fcd4a8",
  green:        "#16a34a",
  greenLight:   "#f0fdf4",
  greenBorder:  "#bbf7d0",
  teal:         "#0d9488",
  pink:         "#db2777",
  muted:        "#5a6173",
  muted2:       "#8a93a8",
  white:        "#ffffff",
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Sora:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;}
body{background:${C.bg};-webkit-font-smoothing:antialiased;}

::-webkit-scrollbar{width:4px;}
::-webkit-scrollbar-track{background:${C.bgSub};}
::-webkit-scrollbar-thumb{background:${C.orange}80;border-radius:4px;}

@keyframes fadeUp{
  from{opacity:0;transform:translateY(24px);}
  to{opacity:1;transform:translateY(0);}
}
@keyframes blink{0%,100%{opacity:1;}50%{opacity:0.35;}}
@keyframes floatY{0%,100%{transform:translateY(0);}50%{transform:translateY(-7px);}}
@keyframes shimmer{
  from{background-position:-200% center;}
  to{background-position:200% center;}
}
@keyframes scaleIn{
  from{opacity:0;transform:scale(0.95);}
  to{opacity:1;transform:scale(1);}
}

/* ── Navbar ── */
.car-nav{
  position:sticky;top:0;z-index:100;
  background:${C.white};
  border-bottom:1px solid ${C.border};
  padding:0 60px;height:68px;
  display:flex;align-items:center;justify-content:space-between;
  box-shadow:0 2px 16px rgba(26,35,64,0.05);
}
.car-logo{
  font-family:'Plus Jakarta Sans',sans-serif;
  font-size:26px;font-weight:900;
  letter-spacing:-0.5px;cursor:pointer;
  border:none;background:none;padding:0;
  display:inline-flex;align-items:center;user-select:none;
}
.car-logo .ilm{color:${C.green};}
.car-logo .ora{color:${C.orange};margin-left:6px;}

/* ── Hero ── */
.car-hero{
  background:${C.navy};
  position:relative;overflow:hidden;
  padding:96px 60px 0;
}
.car-hero::before{
  content:'';position:absolute;inset:0;
  background:
    radial-gradient(ellipse 80% 60% at 70% 0%, ${C.orange}18 0%, transparent 60%),
    radial-gradient(ellipse 50% 40% at 10% 80%, ${C.green}12 0%, transparent 55%);
  pointer-events:none;
}
.car-hero-inner{
  max-width:1200px;margin:0 auto;
  display:grid;grid-template-columns:1fr 420px;
  gap:60px;align-items:flex-end;
  position:relative;z-index:1;
}
.car-hero-text{padding-bottom:72px;}
.car-hero-visual{
  position:relative;
  display:flex;flex-direction:column;gap:0;
  align-self:flex-end;
}

/* ── Job card (hero preview) ── */
.job-preview-card{
  background:rgba(255,255,255,0.06);
  border:1px solid rgba(255,255,255,0.12);
  border-radius:20px 20px 0 0;
  padding:32px;
  backdrop-filter:blur(12px);
}

/* ── Section ── */
.car-section{
  padding:80px 60px;
}
.car-section-inner{
  max-width:1200px;margin:0 auto;
}

/* ── Role card ── */
.role-card{
  background:${C.white};
  border:1.5px solid ${C.border};
  border-radius:20px;
  padding:28px 32px;
  display:flex;align-items:center;justify-content:space-between;
  gap:20px;
  cursor:pointer;
  transition:border-color 0.2s,box-shadow 0.2s,transform 0.2s;
  text-decoration:none;
}
.role-card:hover{
  border-color:${C.orange};
  box-shadow:0 8px 32px rgba(249,115,22,0.10);
  transform:translateY(-2px);
}
.role-tag{
  font-size:10px;font-weight:700;letter-spacing:0.08em;
  text-transform:uppercase;font-family:'DM Mono',monospace;
  padding:3px 10px;border-radius:999px;
  display:inline-block;
}
.role-arrow{
  width:40px;height:40px;border-radius:50%;
  background:${C.bgSub};border:1.5px solid ${C.border};
  display:flex;align-items:center;justify-content:center;
  flex-shrink:0;color:${C.muted};
  transition:background 0.2s,border-color 0.2s,color 0.2s,transform 0.2s;
}
.role-card:hover .role-arrow{
  background:${C.orange};border-color:${C.orange};
  color:${C.white};transform:translateX(3px);
}

/* ── Value card ── */
.val-card{
  background:${C.white};border:1.5px solid ${C.border};
  border-radius:20px;padding:32px 28px;
  transition:box-shadow 0.2s,transform 0.2s;
}
.val-card:hover{
  box-shadow:0 8px 28px rgba(26,35,64,0.07);
  transform:translateY(-3px);
}

/* ── Perks card ── */
.perk-card{
  background:${C.bgSub};
  border:1.5px solid ${C.border};
  border-radius:16px;padding:24px 20px;
  transition:background 0.2s,border-color 0.2s;
}
.perk-card:hover{
  background:${C.white};border-color:${C.borderMid};
}

/* ── Stat pill ── */
.stat-pill{
  display:flex;flex-direction:column;align-items:center;
  padding:20px 24px;background:rgba(255,255,255,0.07);
  border:1px solid rgba(255,255,255,0.12);
  border-radius:16px;
}

/* ── Buttons ── */
.btn-orange{
  display:inline-flex;align-items:center;gap:8px;
  padding:14px 32px;
  background:linear-gradient(135deg,${C.orange},#fb923c);
  color:#fff;font-weight:800;font-size:15px;
  border-radius:12px;border:none;cursor:pointer;
  font-family:'Plus Jakarta Sans',sans-serif;
  box-shadow:0 6px 24px ${C.orange}40;
  transition:transform 0.18s,box-shadow 0.18s;
}
.btn-orange:hover{transform:translateY(-2px);box-shadow:0 10px 32px ${C.orange}55;}

.btn-ghost{
  display:inline-flex;align-items:center;gap:8px;
  padding:13px 28px;background:transparent;
  color:rgba(255,255,255,0.8);font-weight:700;font-size:14px;
  border-radius:12px;border:1.5px solid rgba(255,255,255,0.2);
  cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;
  transition:border-color 0.18s,background 0.18s,color 0.18s;
}
.btn-ghost:hover{border-color:rgba(255,255,255,0.5);color:#fff;}

/* ── Filter tab ── */
.filter-tab{
  padding:8px 18px;border-radius:999px;
  font-size:13px;font-weight:700;
  font-family:'Plus Jakarta Sans',sans-serif;
  border:1.5px solid ${C.border};
  background:transparent;cursor:pointer;color:${C.muted};
  transition:all 0.18s;
}
.filter-tab.active,.filter-tab:hover{
  background:${C.navy};border-color:${C.navy};color:#fff;
}

/* ── Labels ── */
.sec-label{
  font-size:11px;font-weight:700;letter-spacing:0.1em;
  text-transform:uppercase;font-family:'DM Mono',monospace;
  margin-bottom:10px;display:block;
}
.sec-heading{
  font-family:'Plus Jakarta Sans',sans-serif;
  font-weight:900;line-height:1.1;letter-spacing:-0.03em;
  color:${C.navy};
}
.sec-body{
  font-family:'Sora',sans-serif;
  font-size:15px;color:${C.muted};line-height:1.8;
}

/* ── CTA banner ── */
.cta-banner{
  background:${C.navy};
  padding:72px 60px;text-align:center;
  position:relative;overflow:hidden;
}
.cta-banner::before{
  content:'';position:absolute;inset:0;
  background:radial-gradient(ellipse 60% 80% at 50% 0%, ${C.orange}18 0%, transparent 65%);
  pointer-events:none;
}

/* ── RESPONSIVE ── */
@media(max-width:1100px){
  .car-hero-inner{grid-template-columns:1fr;gap:0;}
  .car-hero-visual{display:none;}
  .car-hero{padding:80px 40px 0;}
  .car-hero-text{padding-bottom:52px;}
  .car-section{padding:64px 40px;}
  .car-nav{padding:0 40px;}
  .cta-banner{padding:56px 40px;}
}
@media(max-width:768px){
  .car-nav{padding:0 20px;height:58px;}
  .car-hero{padding:60px 20px 0;}
  .car-hero-text{padding-bottom:44px;}
  .car-section{padding:52px 20px;}
  .cta-banner{padding:44px 20px;}
  .values-grid{grid-template-columns:1fr !important;}
  .perks-grid{grid-template-columns:1fr 1fr !important;}
  .stats-row{grid-template-columns:1fr 1fr !important;}
  .role-card{flex-direction:column;align-items:flex-start;}
  .role-card .role-arrow{align-self:flex-end;}
}
@media(max-width:480px){
  .perks-grid{grid-template-columns:1fr !important;}
  .stats-row{grid-template-columns:1fr 1fr !important;}
}
`;

/* ── Data ── */
const OPEN_ROLES = [
  {
    title: "Frontend Engineer",
    dept: "Engineering",
    type: "Full-time",
    location: "Remote (India)",
    icon: Code2,
    color: C.green,
    bg: C.greenLight,
    border: C.greenBorder,
    tag: "Engineering",
  },
  {
    title: "Backend Engineer",
    dept: "Engineering",
    type: "Full-time",
    location: "Remote (India)",
    icon: Code2,
    color: C.orange,
    bg: C.orangeLight,
    border: C.orangeBorder,
    tag: "Engineering",
  },
  {
    title: "EdTech Content Designer",
    dept: "Content",
    type: "Full-time",
    location: "Remote (India)",
    icon: PenTool,
    color: C.teal,
    bg: "#f0fdfa",
    border: "#99f6e4",
    tag: "Content",
  },
  {
    title: "Growth & Marketing Lead",
    dept: "Marketing",
    type: "Full-time",
    location: "Remote (India)",
    icon: Megaphone,
    color: C.pink,
    bg: "#fdf2f8",
    border: "#f9a8d4",
    tag: "Marketing",
  },
  {
    title: "Curriculum Specialist",
    dept: "Content",
    type: "Contract",
    location: "Remote (India)",
    icon: BookOpen,
    color: C.green,
    bg: C.greenLight,
    border: C.greenBorder,
    tag: "Content",
  },
  {
    title: "Data & Analytics Analyst",
    dept: "Data",
    type: "Full-time",
    location: "Remote (India)",
    icon: BarChart3,
    color: C.orange,
    bg: C.orangeLight,
    border: C.orangeBorder,
    tag: "Data",
  },
  {
    title: "EdTech Intern",
    dept: "All Teams",
    type: "Internship",
    location: "Remote (India)",
    icon: Star,
    color: C.teal,
    bg: "#f0fdfa",
    border: "#99f6e4",
    tag: "Internship",
  },
  {
    title: "Trust & Safety Manager",
    dept: "Operations",
    type: "Full-time",
    location: "Remote (India)",
    icon: Shield,
    color: C.navy,
    bg: "#f1f5f9",
    border: "#cbd5e1",
    tag: "Operations",
  },
];

const VALUES = [
  {
    icon: Zap, color: C.orange,
    title: "Move with speed",
    desc: "We ship fast, learn faster. Bureaucracy slows missions — we trust teams to decide and act without waiting for permission.",
  },
  {
    icon: Globe2, color: C.green,
    title: "Access is everything",
    desc: "Every decision we make is filtered through one lens: does this expand access to quality education for more people?",
  },
  {
    icon: Heart, color: C.pink,
    title: "Learner obsessed",
    desc: "We are building for learners first. Their success stories are the only metrics that truly matter.",
  },
  {
    icon: TrendingUp, color: C.teal,
    title: "Grow in public",
    desc: "We celebrate mistakes as learning opportunities and share wins openly. Growth happens in community, not isolation.",
  },
  {
    icon: Users, color: C.orange,
    title: "Build together",
    desc: "The best ideas come from unlikely places. We keep our culture flat, collaborative, and genuinely inclusive.",
  },
  {
    icon: Star, color: C.green,
    title: "Craft with pride",
    desc: "We never ship something we aren't proud of. Quality is not a checkbox — it's a mindset baked into everything.",
  },
];

const PERKS = [
  { emoji: "🏠", title: "100% Remote", desc: "Work from anywhere in India. Your city, your setup." },
  { emoji: "📚", title: "Free Learning", desc: "Unlimited access to all ILM ORA courses and content." },
  { emoji: "💰", title: "Competitive Pay", desc: "Market-rate salaries benchmarked quarterly." },
  { emoji: "⏰", title: "Async-first", desc: "No unnecessary meetings. Deep work is protected." },
  { emoji: "🌱", title: "Career Growth", desc: "Clear growth paths with quarterly reviews and mentoring." },
  { emoji: "🩺", title: "Health Cover", desc: "Full health insurance for you and your family." },
  { emoji: "🎯", title: "Equity", desc: "Early-stage ESOPs for all full-time team members." },
  { emoji: "🏖️", title: "Unlimited Leaves", desc: "Trust-based leave policy — take what you need." },
];

const DEPTS = ["All", "Engineering", "Content", "Marketing", "Data", "Operations", "Internship"];

const STATS_HERO = [
  { val: "35+", lbl: "Team Members" },
  { val: "12+", lbl: "Open Roles" },
  { val: "100%", lbl: "Remote" },
  { val: "2025", lbl: "Founded" },
];

/* ── Fade-in hook ── */
const useFadeIn = (delay = 0) => {
  const [vis, setVis] = useState(false);
  const ref = useRef();
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVis(true); },
      { threshold: 0.05 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return {
    ref,
    style: {
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(20px)",
      transition: `opacity 0.5s ${delay}ms ease, transform 0.5s ${delay}ms cubic-bezier(.22,1,.36,1)`,
    },
  };
};

/* ══════════════════ MAIN ══════════════════ */
const Careers = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [heroVis, setHeroVis] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [pathname]);
  useEffect(() => {
    const t = setTimeout(() => setHeroVis(true), 60);
    return () => clearTimeout(t);
  }, []);

  const hf = (delay = 0) => ({
    opacity: heroVis ? 1 : 0,
    transform: heroVis ? "translateY(0)" : "translateY(22px)",
    transition: `opacity 0.55s ${delay}ms ease, transform 0.55s ${delay}ms cubic-bezier(.22,1,.36,1)`,
  });

  const filteredRoles = activeFilter === "All"
    ? OPEN_ROLES
    : OPEN_ROLES.filter(r => r.tag === activeFilter);

  const typeColor = (type) => {
    if (type === "Full-time") return { bg: C.greenLight, color: C.green, border: C.greenBorder };
    if (type === "Internship") return { bg: C.orangeLight, color: C.orange, border: C.orangeBorder };
    return { bg: "#f0fdfa", color: C.teal, border: "#99f6e4" };
  };

  return (
    <>
      <style>{CSS}</style>
      <div style={{
        minHeight: "100vh",
        background: C.bg,
        fontFamily: "'Sora','Plus Jakarta Sans',system-ui,sans-serif",
      }}>

        {/* ══ NAVBAR ══ */}
        <nav className="car-nav">
          <button className="car-logo" onClick={() => navigate("/")}>
            <span className="ilm">ILM</span>
            <span className="ora">ORA</span>
          </button>
          <a href="mailto:careers@ilmora.ai" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "9px 20px", borderRadius: 10,
            background: C.orangeLight, border: `1.5px solid ${C.orangeBorder}`,
            fontSize: 13, fontWeight: 700, color: C.orange,
            fontFamily: "'Plus Jakarta Sans',sans-serif",
            textDecoration: "none",
            transition: "background 0.18s",
          }}>
            <Mail size={14} />
            careers@ilmora.ai
          </a>
        </nav>

        {/* ══ HERO ══ */}
        <div className="car-hero">
          <div className="car-hero-inner">

            {/* Left: Text */}
            <div className="car-hero-text">
              {/* Badge */}
              <div style={{ ...hf(0), marginBottom: 28 }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "6px 18px", borderRadius: 999,
                  background: "rgba(249,115,22,0.12)",
                  border: "1.5px solid rgba(249,115,22,0.25)",
                  fontSize: 11, fontWeight: 700, color: C.orange,
                  fontFamily: "'DM Mono',monospace", letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: "50%", background: C.orange,
                    animation: "blink 2.2s ease-in-out infinite",
                  }} />
                  We're Hiring · Join ILM ORA
                </span>
              </div>

              {/* Heading */}
              <h1 style={{
                ...hf(80),
                fontFamily: "'Plus Jakarta Sans',sans-serif",
                fontWeight: 900,
                fontSize: "clamp(38px, 5.5vw, 72px)",
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                color: C.white,
                marginBottom: 24,
              }}>
                Build the future<br />
                of{" "}
                <span style={{ color: C.green }}>learning</span>
                <br />
                <span style={{
                  background: `linear-gradient(135deg, ${C.orange}, #fbbf24)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>with us.</span>
              </h1>

              {/* Sub */}
              <p style={{
                ...hf(160),
                fontSize: 17, color: "#94a3b8",
                lineHeight: 1.8, maxWidth: 520, marginBottom: 44,
                fontFamily: "'Sora',sans-serif",
              }}>
                ILM ORA is India's newest professional learning platform. We're a
                small, ambitious team on a mission to make world-class education
                accessible to every learner, everywhere.
              </p>

              {/* CTAs */}
              <div style={{ ...hf(220), display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 56 }}>
                <button
                  className="btn-orange"
                  onClick={() => document.getElementById("open-roles")?.scrollIntoView({ behavior: "smooth" })}
                >
                  See Open Roles <ArrowRight size={16} />
                </button>
                <button className="btn-ghost"
                  onClick={() => document.getElementById("culture")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Our Culture
                </button>
              </div>

              {/* Stats row */}
              <div style={{
                ...hf(280),
                display: "grid", gridTemplateColumns: "repeat(4, auto)",
                gap: 12, width: "fit-content",
              }}
                className="stats-row"
              >
                {STATS_HERO.map(s => (
                  <div key={s.lbl} className="stat-pill">
                    <span style={{
                      fontFamily: "'Plus Jakarta Sans',sans-serif",
                      fontSize: 26, fontWeight: 900, color: C.white,
                      letterSpacing: "-1px", lineHeight: 1,
                    }}>{s.val}</span>
                    <span style={{
                      fontSize: 11, color: "#64748b",
                      fontFamily: "'DM Mono',monospace",
                      marginTop: 6, letterSpacing: "0.04em",
                    }}>{s.lbl}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Job preview cards */}
            <div className="car-hero-visual">
              <div className="job-preview-card">
                <div style={{
                  fontSize: 10, fontWeight: 700, color: C.orange,
                  fontFamily: "'DM Mono',monospace", letterSpacing: "0.1em",
                  textTransform: "uppercase", marginBottom: 20,
                }}>Open Positions</div>
                {OPEN_ROLES.slice(0, 5).map((role, i) => {
                  const Ic = role.icon;
                  return (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: 14,
                      padding: "14px 0",
                      borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.07)" : "none",
                      animation: `fadeUp 0.4s ${i * 80}ms ease both`,
                    }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: role.color + "20",
                        border: `1px solid ${role.color}30`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                      }}>
                        <Ic size={16} color={role.color} strokeWidth={1.8} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: 13.5, fontWeight: 700, color: C.white,
                          fontFamily: "'Plus Jakarta Sans',sans-serif",
                          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                        }}>{role.title}</div>
                        <div style={{
                          fontSize: 11.5, color: "#64748b",
                          fontFamily: "'Sora',sans-serif", marginTop: 2,
                        }}>{role.type} · {role.location}</div>
                      </div>
                      <ChevronRight size={14} color="#64748b" />
                    </div>
                  );
                })}
                <div style={{
                  marginTop: 20, textAlign: "center",
                  fontSize: 12, color: C.orange,
                  fontFamily: "'DM Mono',monospace", letterSpacing: "0.05em",
                }}>+{OPEN_ROLES.length - 5} more roles →</div>
              </div>
            </div>

          </div>
        </div>

        {/* ══ WHY ILM ORA ══ */}
        <section id="culture" className="car-section" style={{ background: C.white, borderBottom: `1px solid ${C.border}` }}>
          <div className="car-section-inner">
            <WhySection />
          </div>
        </section>

        {/* ══ VALUES ══ */}
        <section className="car-section" style={{ background: C.bg, borderBottom: `1px solid ${C.border}` }}>
          <div className="car-section-inner">
            <ValuesSection />
          </div>
        </section>

        {/* ══ PERKS ══ */}
        <section className="car-section" style={{ background: C.white, borderBottom: `1px solid ${C.border}` }}>
          <div className="car-section-inner">
            <PerksSection />
          </div>
        </section>

        {/* ══ OPEN ROLES ══ */}
        <section id="open-roles" className="car-section" style={{ background: C.bg, borderBottom: `1px solid ${C.border}` }}>
          <div className="car-section-inner">
            <RolesSection
              roles={filteredRoles}
              allRoles={OPEN_ROLES}
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              typeColor={typeColor}
            />
          </div>
        </section>

        {/* ══ CTA ══ */}
        <div className="cta-banner">
          <div style={{ position: "relative", zIndex: 1, maxWidth: 600, margin: "0 auto" }}>
            <div style={{
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              fontSize: 26, fontWeight: 900, letterSpacing: "-0.5px",
              marginBottom: 16, cursor: "pointer",
            }} onClick={() => navigate("/")}>
              <span style={{ color: C.green }}>ILM</span>
              <span style={{ color: C.orange, marginLeft: 6 }}>ORA</span>
            </div>
            <h2 style={{
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              fontSize: "clamp(26px,4vw,40px)", fontWeight: 900,
              color: C.white, letterSpacing: "-1px",
              lineHeight: 1.15, marginBottom: 14,
            }}>
              Don't see a role that fits?
            </h2>
            <p style={{
              fontSize: 15.5, color: "#94a3b8", lineHeight: 1.8,
              marginBottom: 28, fontFamily: "'Sora',sans-serif",
            }}>
              We're always looking for exceptional people. Send us your profile and
              tell us why you'd be a great fit for ILM ORA.
            </p>
            <a href="mailto:careers@ilmora.ai" className="btn-orange" style={{ textDecoration: "none" }}>
              <Mail size={16} />
              careers@ilmora.ai
            </a>
          </div>
        </div>

        {/* ══ FOOTER ══ */}
        <div style={{
          padding: "20px 60px",
          borderTop: `1px solid ${C.border}`,
          background: C.bg,
          display: "flex", justifyContent: "space-between",
          alignItems: "center", flexWrap: "wrap", gap: 12,
        }}>
          <span style={{
            fontFamily: "'Plus Jakarta Sans',sans-serif",
            fontSize: 20, fontWeight: 900, letterSpacing: "-0.5px",
          }}>
            <span style={{ color: C.green }}>ILM</span>
            <span style={{ color: C.orange, marginLeft: 5 }}>ORA</span>
          </span>
          <span style={{ fontSize: 12.5, color: C.muted2, fontFamily: "'Sora',sans-serif" }}>
            © 2026 ILM ORA. All rights reserved.
          </span>
        </div>

      </div>
    </>
  );
};

/* ══ Why Section ══ */
const WhySection = () => {
  const h = useFadeIn(0);
  const g = useFadeIn(80);
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "center" }}
      className="values-grid"
    >
      <div ref={h.ref} style={h.style}>
        <span className="sec-label" style={{ color: C.orange }}>Why ILM ORA</span>
        <h2 className="sec-heading" style={{ fontSize: "clamp(28px,3vw,42px)", marginBottom: 20 }}>
          A place to do the best work of your career.
        </h2>
        <p className="sec-body" style={{ fontSize: 16, marginBottom: 24 }}>
          We're not a legacy company with legacy thinking. We're a team of builders,
          educators, and creators who believe great education changes lives — and
          we're building the tools to make that happen at scale.
        </p>
        <p className="sec-body" style={{ fontSize: 16 }}>
          Founded in 2025 and launched in 2026, ILM ORA is early enough that you'll
          shape the culture, late enough that we have traction worth betting on.
        </p>
      </div>
      <div ref={g.ref} style={g.style}>
        {/* Highlight cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            { icon: "🚀", title: "Early-stage energy", desc: "Your work ships to real learners. No layers of approval." },
            { icon: "🌍", title: "Mission-driven", desc: "Every feature we ship improves access to quality education." },
            { icon: "📈", title: "Growing fast", desc: "1,200+ learners in our first cohort cycle. Momentum is real." },
          ].map((item, i) => (
            <div key={i} style={{
              display: "flex", gap: 18, alignItems: "flex-start",
              padding: "20px 24px",
              background: C.bgSub, border: `1.5px solid ${C.border}`,
              borderRadius: 16,
            }}>
              <span style={{ fontSize: 24, lineHeight: 1, flexShrink: 0, marginTop: 2 }}>{item.icon}</span>
              <div>
                <div style={{
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  fontWeight: 800, fontSize: 15, color: C.navy, marginBottom: 4,
                }}>{item.title}</div>
                <div style={{ fontSize: 13.5, color: C.muted, fontFamily: "'Sora',sans-serif", lineHeight: 1.7 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ══ Values Section ══ */
const ValuesSection = () => {
  const h = useFadeIn(0);
  const g = useFadeIn(80);
  return (
    <>
      <div ref={h.ref} style={{ ...h.style, maxWidth: 520, marginBottom: 52 }}>
        <span className="sec-label" style={{ color: C.green }}>How we work</span>
        <h2 className="sec-heading" style={{ fontSize: "clamp(28px,3vw,40px)", marginBottom: 14 }}>
          Our values aren't on a wall. They're in every decision.
        </h2>
        <p className="sec-body" style={{ fontSize: 16 }}>
          Six principles guide how we hire, how we build, and how we treat each other.
        </p>
      </div>
      <div ref={g.ref} style={g.style}>
        <div className="values-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {VALUES.map(({ icon: Icon, color, title, desc }) => (
            <div key={title} className="val-card">
              <div style={{
                width: 48, height: 48, borderRadius: 13, marginBottom: 18,
                background: color + "12", border: `1.5px solid ${color}25`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon size={22} color={color} strokeWidth={1.9} />
              </div>
              <h3 style={{
                fontFamily: "'Plus Jakarta Sans',sans-serif",
                fontWeight: 800, fontSize: 15.5, color: C.navy,
                marginBottom: 10, letterSpacing: "-0.2px",
              }}>{title}</h3>
              <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.8, fontFamily: "'Sora',sans-serif" }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

/* ══ Perks Section ══ */
const PerksSection = () => {
  const h = useFadeIn(0);
  const g = useFadeIn(80);
  return (
    <>
      <div ref={h.ref} style={{ ...h.style, maxWidth: 520, marginBottom: 52 }}>
        <span className="sec-label" style={{ color: C.orange }}>Benefits & Perks</span>
        <h2 className="sec-heading" style={{ fontSize: "clamp(28px,3vw,40px)", marginBottom: 14 }}>
          We take care of people who take care of learners.
        </h2>
        <p className="sec-body" style={{ fontSize: 16 }}>
          We offer competitive packages with benefits that actually matter.
        </p>
      </div>
      <div ref={g.ref} style={g.style}>
        <div className="perks-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {PERKS.map((p, i) => (
            <div key={i} className="perk-card">
              <div style={{ fontSize: 28, marginBottom: 12, lineHeight: 1 }}>{p.emoji}</div>
              <div style={{
                fontFamily: "'Plus Jakarta Sans',sans-serif",
                fontWeight: 800, fontSize: 14.5, color: C.navy, marginBottom: 6,
              }}>{p.title}</div>
              <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, fontFamily: "'Sora',sans-serif" }}>{p.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

/* ══ Roles Section ══ */
const RolesSection = ({ roles, allRoles, activeFilter, setActiveFilter, typeColor }) => {
  const h = useFadeIn(0);
  const g = useFadeIn(80);
  return (
    <>
      <div ref={h.ref} style={{ ...h.style, marginBottom: 40 }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 20, marginBottom: 28 }}>
          <div>
            <span className="sec-label" style={{ color: C.green }}>Open Roles</span>
            <h2 className="sec-heading" style={{ fontSize: "clamp(28px,3vw,40px)" }}>
              Find your place at ILM ORA.
            </h2>
          </div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "6px 16px", borderRadius: 999,
            background: C.greenLight, border: `1.5px solid ${C.greenBorder}`,
            fontSize: 12, fontWeight: 700, color: C.green,
            fontFamily: "'DM Mono',monospace",
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: "50%", background: C.green,
              animation: "blink 2.5s ease-in-out infinite",
            }} />
            {allRoles.length} positions open
          </div>
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {DEPTS.map(dept => (
            <button
              key={dept}
              className={`filter-tab${activeFilter === dept ? " active" : ""}`}
              onClick={() => setActiveFilter(dept)}
            >
              {dept}
              {dept !== "All" && (
                <span style={{ marginLeft: 6, opacity: 0.6 }}>
                  ({allRoles.filter(r => r.tag === dept).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div ref={g.ref} style={{ ...g.style, display: "flex", flexDirection: "column", gap: 12 }}>
        {roles.map((role, i) => {
          const Ic = role.icon;
          const tc = typeColor(role.type);
          return (
            <a key={i} href="#" className="role-card" style={{ textDecoration: "none" }}>
              {/* Left: icon + info */}
              <div style={{ display: "flex", alignItems: "center", gap: 18, flex: 1, minWidth: 0 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: role.color + "12", border: `1.5px solid ${role.color}25`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <Ic size={20} color={role.color} strokeWidth={1.8} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{
                    fontFamily: "'Plus Jakarta Sans',sans-serif",
                    fontWeight: 800, fontSize: 16, color: C.navy,
                    marginBottom: 6, letterSpacing: "-0.2px",
                  }}>{role.title}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 5,
                      fontSize: 12.5, color: C.muted, fontFamily: "'Sora',sans-serif",
                    }}>
                      <MapPin size={11} strokeWidth={2} /> {role.location}
                    </span>
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 5,
                      fontSize: 12.5, color: C.muted, fontFamily: "'Sora',sans-serif",
                    }}>
                      <Briefcase size={11} strokeWidth={2} /> {role.dept}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: type badge + arrow */}
              <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
                <span className="role-tag" style={{
                  background: tc.bg, color: tc.color,
                  border: `1.5px solid ${tc.border}`,
                }}>
                  {role.type}
                </span>
                <div className="role-arrow">
                  <ArrowRight size={16} strokeWidth={2.2} />
                </div>
              </div>
            </a>
          );
        })}

        {roles.length === 0 && (
          <div style={{
            textAlign: "center", padding: "60px 20px",
            color: C.muted, fontFamily: "'Sora',sans-serif", fontSize: 15,
          }}>
            No open roles in this department right now. <br />
            <a href="mailto:careers@ilmora.ai" style={{ color: C.orange, fontWeight: 700 }}>
              Send us your profile anyway →
            </a>
          </div>
        )}
      </div>
    </>
  );
};

export default Careers;