import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Target, Globe2, BarChart3, Users,
  GraduationCap, BookOpen, Settings, Briefcase, CheckCircle2,
} from "lucide-react";

// ✅ CORRECT PATH: src/pages/About/ → src/assets/pic.png
import personImg from "../../assets/pic.png";

// ✅ Shared shell used by every other public page (Pricing, Careers,
// Contact, FAQ, etc). Lives at src/pages/Landing/components/PublicLayout.
import PublicLayout from "../Landing/components/PublicLayout";

/* ═══════════════════════════════════════════════════════════
   ILM ORA  ·  ABOUT PAGE
   Light + Dark theme aware. Colors are resolved at render time
   from the `theme` prop passed down from App.jsx (same prop the
   rest of the app uses to toggle `dark` on <html>).
═══════════════════════════════════════════════════════════ */

const LIGHT = {
  bg:           "#fbeee0",
  bgCard:       "#ffffff",
  bgSub:        "#fdf5ec",
  bgSubDark:    "#f5e8d5",
  border:       "#e8d9c4",
  borderMid:    "#d5c4aa",
  text:         "#1a2340",
  navy:         "#1a2340",
  navyDark:     "#0f172a",
  orange:       "#F97316",
  orangeHov:    "#ea6b0e",
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
  shadow:       "rgba(26,35,64,0.07)",
};

const DARK = {
  bg:           "#0b1220",
  bgCard:       "#131b2e",
  bgSub:        "#101828",
  bgSubDark:    "#0d1524",
  border:       "#243049",
  borderMid:    "#334063",
  text:         "#f1f5f9",
  navy:         "#1a2340",
  navyDark:     "#0a0f1c",
  orange:       "#fb923c",
  orangeHov:    "#f97316",
  orangeLight:  "#241a10",
  orangeBorder: "#5a3a1a",
  green:        "#4ade80",
  greenLight:   "#0f2318",
  greenBorder:  "#215c38",
  teal:         "#2dd4bf",
  pink:         "#f472b6",
  muted:        "#a8b0c4",
  muted2:       "#7b8399",
  white:        "#ffffff",
  shadow:       "rgba(0,0,0,0.35)",
};

const getCSS = (C) => `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Sora:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');

.aboutora-page, .aboutora-page *, .aboutora-page *::before, .aboutora-page *::after{box-sizing:border-box;}
.aboutora-page h1, .aboutora-page h2, .aboutora-page h3, .aboutora-page h4,
.aboutora-page p, .aboutora-page ul, .aboutora-page ol, .aboutora-page figure,
.aboutora-page button, .aboutora-page span, .aboutora-page div { margin:0; padding:0; }
.aboutora-page{scroll-behavior:smooth;font-size:16px;}

@keyframes fadeUp{
  from{opacity:0;transform:translateY(20px);}
  to{opacity:1;transform:translateY(0);}
}
@keyframes blink{0%,100%{opacity:1;}50%{opacity:0.4;}}
@keyframes floatY{0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);}}
@keyframes slideInLeft{
  from{opacity:0;transform:translateX(-28px);}
  to{opacity:1;transform:translateX(0);}
}

/* ── Hero layout ── */
.aboutora-page .hero-section{
  background:${C.bg};
  border-bottom:1px solid ${C.border};
  padding:0 60px;
  overflow:hidden;
  width:100%;
}
.aboutora-page .hero-grid{
  max-width:1200px;
  margin:0 auto;
  width:100%;
  display:grid;
  grid-template-columns:420px 1fr;
  gap:0;
  align-items:flex-end;
  min-height:460px;
}

/* LEFT — image column */
.aboutora-page .hero-img-col{
  display:flex;
  align-items:flex-end;
  justify-content:center;
  position:relative;
  padding-top:0;
}
.aboutora-page .hero-img-col::before{
  content:'';
  position:absolute;
  bottom:0;left:50%;
  transform:translateX(-50%);
  width:320px;height:320px;
  border-radius:50%;
  background:radial-gradient(circle, ${C.orange}14 0%, transparent 70%);
  pointer-events:none;
  z-index:0;
}
.aboutora-page .hero-img{
  width:100%;
  max-width:400px;
  height:auto;
  display:block;
  object-fit:contain;
  mix-blend-mode:${C === DARK ? "normal" : "multiply"};
  position:relative;z-index:1;
  animation:slideInLeft 0.75s 0.08s cubic-bezier(.22,1,.36,1) both;
  filter:drop-shadow(0 16px 40px rgba(249,115,22,0.10));
}

/* RIGHT — text column */
.aboutora-page .hero-text-col{
  padding:48px 0 48px 56px;
  display:flex;flex-direction:column;justify-content:center;
}

/* ── Cards ── */
.aboutora-page .belief-card{
  background:${C.bgCard};border:1.5px solid ${C.border};
  border-radius:16px;padding:28px 24px;
  transition:box-shadow 0.2s,transform 0.2s,border-color 0.2s;
}
.aboutora-page .belief-card:hover{
  box-shadow:0 8px 28px ${C.shadow};
  transform:translateY(-2px);border-color:${C.borderMid};
}
.aboutora-page .role-card{
  border-radius:20px;padding:28px 24px;
  transition:transform 0.2s,box-shadow 0.2s;
}
.aboutora-page .role-card:hover{
  transform:translateY(-3px);
  box-shadow:0 10px 32px ${C.shadow};
}

/* ── Section labels ── */
.aboutora-page .sec-label{
  font-size:11px;font-weight:700;letter-spacing:0.1em;
  text-transform:uppercase;font-family:'DM Mono',monospace;
  margin-bottom:10px;display:block;
}
.aboutora-page .sec-heading{
  font-family:'Plus Jakarta Sans',sans-serif;
  font-weight:900;line-height:1.12;
  letter-spacing:-0.03em;color:${C.text};
}
.aboutora-page .sec-body{
  font-family:'Sora',sans-serif;
  font-size:15px;color:${C.muted};line-height:1.8;
}

/* ── Buttons ── */
.aboutora-page .btn-primary{
  display:inline-flex;align-items:center;justify-content:center;gap:8px;
  padding:14px 30px;border-radius:12px;border:none;cursor:pointer;
  background:${C.orange};color:#fff;
  font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:15px;
  transition:background 0.18s,transform 0.18s;
}
.aboutora-page .btn-primary:hover{background:${C.orangeHov};transform:translateY(-1px);}
.aboutora-page .btn-secondary{
  display:inline-flex;align-items:center;justify-content:center;gap:8px;
  padding:14px 30px;border-radius:12px;cursor:pointer;
  background:transparent;color:#fff;border:1.5px solid rgba(255,255,255,0.35);
  font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:15px;
  transition:background 0.18s,transform 0.18s,border-color 0.18s;
}
.aboutora-page .btn-secondary:hover{background:rgba(255,255,255,0.08);border-color:rgba(255,255,255,0.6);transform:translateY(-1px);}

/* ── Timeline ── */
.aboutora-page .tl-dot{
  width:40px;height:40px;border-radius:50%;
  background:${C.green};color:#fff;
  display:flex;align-items:center;justify-content:center;
  font-size:10px;font-weight:700;
  font-family:'DM Mono',monospace;
  flex-shrink:0;line-height:1.2;text-align:center;
}
.aboutora-page .tl-line{width:2px;flex:1;background:${C.border};min-height:32px;margin-top:4px;}

/* ── Stats grid border fix ── */
.aboutora-page .stats-cell{
  text-align:center;padding:28px 20px;
  transition:background 0.18s;
}
.aboutora-page .stats-cell:hover{background:${C.bgSub};}

/* ── RESPONSIVE ── */
@media(max-width:1200px){
  .aboutora-page .hero-section{padding:0 40px;}
  .aboutora-page .hero-grid{max-width:100%;grid-template-columns:380px 1fr;}
  .aboutora-page .hero-img{max-width:350px;}
  .aboutora-page .hero-text-col{padding:68px 0 52px 40px;}
  .aboutora-page .section-pad{padding:72px 40px !important;}
}
@media(max-width:1024px){
  .aboutora-page .hero-section{padding:0 32px;}
  .aboutora-page .hero-grid{grid-template-columns:320px 1fr;}
  .aboutora-page .hero-img{max-width:300px;}
  .aboutora-page .hero-text-col{padding:60px 0 48px 32px;}
  .aboutora-page .section-pad{padding:64px 32px !important;}
  .aboutora-page .stats-wrap{padding:0 32px !important;}
}
@media(max-width:860px){
  .aboutora-page .hero-grid{
    grid-template-columns:1fr;
    grid-template-rows:auto auto;
    min-height:unset;
  }
  .aboutora-page .hero-img-col{order:2;padding-top:0;align-items:center;}
  .aboutora-page .hero-img{max-width:260px;animation:fadeUp 0.6s 0.1s ease both;}
  .aboutora-page .hero-text-col{order:1;padding:52px 0 28px 0;}
  .aboutora-page .beliefs-grid{grid-template-columns:1fr 1fr !important;}
  .aboutora-page .four-col{grid-template-columns:1fr 1fr !important;}
}
@media(max-width:768px){
  .aboutora-page .hero-section{padding:0 20px;}
  .aboutora-page .section-pad{padding:52px 20px !important;}
  .aboutora-page .stats-wrap{padding:0 20px !important;}
  .aboutora-page .two-col{grid-template-columns:1fr !important;}
  .aboutora-page .stats-grid{grid-template-columns:1fr 1fr !important;}
  .aboutora-page .mission-vision{grid-template-columns:1fr !important;}
  .aboutora-page .cta-inner{padding:40px 20px !important;}
  .aboutora-page .cta-btns{flex-direction:column;align-items:center;}
  .aboutora-page .hero-title{font-size:32px !important;letter-spacing:-1.5px !important;}
  .aboutora-page .hero-sub{font-size:14px !important;}
  .aboutora-page .trust-strip{gap:10px !important;}
}
@media(max-width:480px){
  .aboutora-page .hero-title{font-size:26px !important;}
  .aboutora-page .hero-img{max-width:200px;}
  .aboutora-page .four-col{grid-template-columns:1fr !important;}
  .aboutora-page .beliefs-grid{grid-template-columns:1fr !important;}
  .aboutora-page .stats-grid{grid-template-columns:1fr 1fr !important;}
}
`;

/* ── Data ── */
const STATS = [
  { value: "1000+", label: "Learners Enrolled",   colorKey: "orange" },
  { value: "20+",    label: "Expert Mentors",       colorKey: "green"  },
  { value: "88%",    label: "Learner Satisfaction", colorKey: "teal"   },
  { value: "20+",    label: "Courses Available",    colorKey: "pink"   },
];

const BELIEFS = [
  { Icon: Target,    colorKey: "orange", title: "Learning by doing",     desc: "Every course is built around hands-on projects, real assessments, and live feedback — not passive video consumption." },
  { Icon: Globe2,    colorKey: "green",  title: "Access without limits",  desc: "Geography shouldn't determine opportunity. ILM ORA connects learners across India and beyond to world-class instructors." },
  { Icon: BarChart3, colorKey: "teal",   title: "Measurable outcomes",    desc: "We track every learner's progress so trainers, admins, and businesses can make decisions grounded in real data." },
  { Icon: Users,     colorKey: "pink",   title: "Community first",        desc: "Learning alongside peers builds accountability, confidence, and networks that last far beyond the course." },
];

const ROLES = [
  { role: "Students",       Icon: GraduationCap, colorKey: "green",  bgKey: "greenLight",  borderKey: "greenBorder", desc: "Personalised dashboards, course progress, assessment scores, and career roadmaps — all in one place.",              features: ["Track progress", "Take assessments", "Career guidance"]   },
  { role: "Trainers",       Icon: BookOpen,      colorKey: "orange", bgKey: "orangeLight", borderKey: "orangeBorder",desc: "Upload content, run live sessions, review submissions, and monitor cohort performance with rich analytics.",           features: ["Upload content", "Live sessions", "Cohort analytics"]     },
  { role: "Admins",         Icon: Settings,      colorKey: "teal",   bgKey: "tealLight",   borderKey: "tealBorder",  desc: "Full platform control — manage users, assign courses, configure permissions, and view institution-wide reports.",     features: ["User management", "Course assignment", "Full reports"]    },
  { role: "Business Teams", Icon: Briefcase,     colorKey: "pink",   bgKey: "pinkLight",   borderKey: "pinkBorder",  desc: "Upskill your workforce with measurable ROI. Monitor team performance and align learning to business goals.",           features: ["Team upskilling", "ROI tracking", "Performance reports"]  },
];

const TIMELINE = [
  { year: "2025",       label: "2025", event: "ILM ORA founded — a small team with a big vision to make professional education accessible across India." },
  { year: "Early 2026", label: "E.26", event: "Platform built and tested. First 20+ courses launched across Product, Design, Marketing, and Tech." },
  { year: "Mid 2026",   label: "M.26", event: "Onboarded 20+ expert mentors and crossed 1000 enrolled learners within the first cohort cycle." },
  { year: "Late 2026",  label: "L.26", event: "Introducing AI-powered assessments, role-based dashboards, and real-time analytics — the road ahead." },
];

/* ── Scroll fade-in hook ── */
const useFadeIn = (delay = 0) => {
  const [vis, setVis] = useState(false);
  const ref = useRef();
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVis(true); },
      { threshold: 0.06 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return {
    ref,
    style: {
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(22px)",
      transition: `opacity 0.52s ${delay}ms ease, transform 0.52s ${delay}ms cubic-bezier(.22,1,.36,1)`,
    },
  };
};

/* ══════════════════ MAIN ══════════════════
   Rendered INSIDE PublicLayout, so the page gets the exact same
   AnnouncementBanner → Navbar → ... → Footer shell as every other
   public page. All page-local CSS is scoped under `.aboutora-page`
   so it can never leak into PublicLayout's navbar/footer.

   Theme: `theme` ("light" | "dark") is passed down from App.jsx
   (the same state that drives the `dark` class on <html>). We
   resolve a full color palette from it on every render instead of
   using a single hard-coded palette, so the page actually reacts
   to the theme toggle instead of always looking the same.
═══════════════════════════════════════════════════════════ */
const AboutTexoraSkills = ({ theme, toggleTheme, setShowLoginModal, scrollToSection }) => {
  const navigate     = useNavigate();
  const { pathname } = useLocation();
  const [heroVis, setHeroVis] = useState(false);

  const isDark = theme === "dark";
  const C = isDark ? DARK : LIGHT;
  const CSS = getCSS(C);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [pathname]);
  useEffect(() => {
    const t = setTimeout(() => setHeroVis(true), 60);
    return () => clearTimeout(t);
  }, []);

  const hf = (delay = 0) => ({
    opacity:    heroVis ? 1 : 0,
    transform:  heroVis ? "translateY(0)" : "translateY(22px)",
    transition: `opacity 0.55s ${delay}ms ease, transform 0.55s ${delay}ms cubic-bezier(.22,1,.36,1)`,
  });

  // "Get Started" → open the same login/signup modal every other
  // public page uses. Falls back to /signup if the modal setter
  // wasn't passed in for some reason, so the button always does
  // *something* useful instead of silently failing.
  const handleGetStarted = () => {
    if (typeof setShowLoginModal === "function") {
      setShowLoginModal(true);
    } else {
      navigate("/signup");
    }
  };

  return (
    <PublicLayout
      theme={theme}
      toggleTheme={toggleTheme}
      setShowLoginModal={setShowLoginModal}
      scrollToSection={scrollToSection}
    >
      <style>{CSS}</style>
      <div
        className="aboutora-page"
        style={{
          background: C.bg,
          color: C.text,
          fontFamily: "'Sora','Plus Jakarta Sans',system-ui,sans-serif",
          width: "100%",
          overflowX: "hidden",
          transition: "background 0.25s ease, color 0.25s ease",
        }}
      >

        {/* ══ HERO — Image LEFT | Text RIGHT ══ */}
        <div className="hero-section">
          <div className="hero-grid">

            {/* ── LEFT: pic.png ── */}
            <div className="hero-img-col">
              <img
                src={personImg}
                alt="ILM ORA Learner"
                className="hero-img"
              />
            </div>

            {/* ── RIGHT: heading + text + buttons ── */}
            <div className="hero-text-col">

              {/* Badge */}
              <div style={{ ...hf(0), marginBottom: 28 }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "7px 20px", borderRadius: 999,
                  background: C.orangeLight, border: `1.5px solid ${C.orangeBorder}`,
                  fontSize: 12, fontWeight: 700, color: C.orange,
                  fontFamily: "'Plus Jakarta Sans',sans-serif", letterSpacing: "0.06em",
                }}>
                  <span style={{
                    width: 7, height: 7, borderRadius: "50%",
                    background: C.orange,
                    animation: "blink 2.4s ease-in-out infinite",
                  }} />
                  Advanced Learning Platform for Modern Professionals
                </span>
              </div>

              {/* Heading */}
              <h1
                className="hero-title sec-heading"
                style={{
                  ...hf(100),
                  fontSize: "clamp(34px, 4.5vw, 62px)",
                  marginBottom: 22,
                }}
              >
                Help us build the{" "}
                <span style={{ color: C.green }}>university</span>
                <br />
                <span style={{ color: C.orange }}>of the future.</span>
              </h1>

              {/* Subtext */}
              <p
                className="hero-sub sec-body"
                style={{ ...hf(180), maxWidth: 520, marginBottom: 40, fontSize: 16, color: C.muted }}
              >
                ILM ORA is India's newest professional learning platform — centralising
                courses, assessments, and performance tracking into one powerful system,
                built from the ground up in 2026 for the next generation of learners.
              </p>

              {/* Get Started button */}
              <div style={{ ...hf(250), marginBottom: 36 }}>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleGetStarted}
                >
                  Get Started
                </button>
              </div>

              {/* Trust strip */}
              <div
                className="trust-strip"
                style={{
                  ...hf(320),
                  display: "flex", gap: 14, marginTop: 4, flexWrap: "wrap",
                }}
              >
                {[
                  { val: "1000+", lbl: "Learners" },
                  { val: "20+",    lbl: "Mentors"  },
                  { val: "20+",    lbl: "Courses"  },
                ].map(s => (
                  <div key={s.lbl} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 20px", borderRadius: 12,
                    background: C.bgCard, border: `1.5px solid ${C.border}`,
                    boxShadow: `0 2px 8px ${C.shadow}`,
                  }}>
                    <span style={{
                      fontFamily: "'Plus Jakarta Sans',sans-serif",
                      fontWeight: 900, fontSize: 18, color: C.orange,
                      letterSpacing: "-0.5px",
                    }}>{s.val}</span>
                    <span style={{
                      fontSize: 13, color: C.muted,
                      fontFamily: "'Sora',sans-serif",
                    }}>{s.lbl}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ══ STATS BAR ══ */}
        <div className="stats-wrap" style={{ padding: "0 60px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div
              className="stats-grid"
              style={{
                display: "grid", gridTemplateColumns: "repeat(4,1fr)",
                background: C.bgCard,
                border: `1px solid ${C.border}`,
                borderTop: "none",
                borderRadius: "0 0 24px 24px",
                overflow: "hidden",
                boxShadow: `0 8px 32px ${C.shadow}`,
              }}
            >
              {STATS.map((s, i, arr) => (
                <div
                  key={s.label}
                  className="stats-cell"
                  style={{
                    borderRight: i < arr.length - 1 ? `1px solid ${C.border}` : "none",
                  }}
                >
                  <div style={{
                    fontSize: 42, fontWeight: 900, color: C[s.colorKey],
                    fontFamily: "'Plus Jakarta Sans',sans-serif",
                    letterSpacing: "-1.5px", lineHeight: 1,
                  }}>{s.value}</div>
                  <div style={{
                    fontSize: 13, color: C.muted, marginTop: 10,
                    fontFamily: "'Sora',sans-serif",
                  }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══ MISSION & VISION ══ */}
        <section className="section-pad" style={{
          padding: "80px 60px",
          background: C.bg,
          borderTop: `1px solid ${C.border}`,
          marginTop: 0,
        }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <MvSection C={C} />
          </div>
        </section>

        {/* ══ BELIEFS ══ */}
        <section className="section-pad" style={{
          padding: "80px 60px",
          background: C.bgCard,
          borderTop: `1px solid ${C.border}`,
          borderBottom: `1px solid ${C.border}`,
        }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <BeliefsSection C={C} />
          </div>
        </section>

        {/* ══ ROLES ══ */}
        <section className="section-pad" style={{
          padding: "80px 60px",
          background: C.bg,
          borderBottom: `1px solid ${C.border}`,
        }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <RolesSection C={C} />
          </div>
        </section>

        {/* ══ TIMELINE ══ */}
        <section className="section-pad" style={{
          padding: "80px 60px",
          background: C.bgCard,
        }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <TimelineSection C={C} />
          </div>
        </section>

        {/* ══ CTA BANNER ══ */}
        <section
          className="cta-inner"
          style={{
            padding: "56px 60px",
            background: C.navy,
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: 600, margin: "0 auto" }}>
            <div
              style={{
                fontFamily: "'Plus Jakarta Sans',sans-serif",
                fontSize: 28, fontWeight: 900,
                letterSpacing: "-0.5px", marginBottom: 16, cursor: "pointer",
              }}
              onClick={() => navigate("/")}
            >
              <span style={{ color: C.green }}>ILM</span>
              <span style={{ color: C.orange, marginLeft: 6 }}>ORA</span>
            </div>

            <h2 style={{
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              fontSize: "clamp(26px,4vw,40px)", fontWeight: 900,
              color: "#ffffff", letterSpacing: "-1.2px",
              lineHeight: 1.15, marginBottom: 14,
            }}>
              Create the future with us
            </h2>

            <p style={{
              fontSize: 15.5, color: "#94a3b8", lineHeight: 1.8,
              marginBottom: 28, fontFamily: "'Sora',sans-serif",
            }}>
              We launched in 2026 with a simple belief — that great education shouldn't
              depend on where you live or who you know. Join us early and help shape what
              ILM ORA becomes.
            </p>

            <div className="cta-btns" style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <button
                type="button"
                className="btn-primary"
                onClick={handleGetStarted}
              >
                Get Started
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => navigate("/")}
              >
                Explore Courses
              </button>
            </div>
          </div>
        </section>

      </div>
    </PublicLayout>
  );
};

/* ══ Mission & Vision ══ */
const MvSection = ({ C }) => {
  const a = useFadeIn(0);
  return (
    <div ref={a.ref} style={a.style}>
      <div
        className="mission-vision"
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}
      >
        {/* Mission — navy (fixed dark accent panel in both themes) */}
        <div style={{ background: C.navy, borderRadius: 24, padding: "48px 44px" }}>
          <div style={{
            display: "inline-block", background: C.green, color: "#ffffff",
            fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
            padding: "4px 14px", borderRadius: 999, marginBottom: 24,
            textTransform: "uppercase", fontFamily: "'DM Mono',monospace",
          }}>Our Mission</div>
          <h2 style={{
            fontFamily: "'Plus Jakarta Sans',sans-serif",
            fontWeight: 900, fontSize: "clamp(22px,2.5vw,30px)",
            lineHeight: 1.25, marginBottom: 18, color: "#ffffff", letterSpacing: "-0.5px",
          }}>
            Empower learners with job-ready skills.
          </h2>
          <p style={{ fontSize: 15, color: "#94a3b8", lineHeight: 1.85, fontFamily: "'Sora',sans-serif" }}>
            We build learning experiences that produce measurable outcomes — not just
            certificates. Every course on ILM ORA is designed career-first, with real
            projects and expert feedback from day one.
          </p>
        </div>

        {/* Vision — orange tint, theme aware */}
        <div style={{
          background: C.orangeLight,
          border: `1.5px solid ${C.orangeBorder}`,
          borderRadius: 24, padding: "48px 44px",
        }}>
          <div style={{
            display: "inline-block", background: C.orange, color: "#ffffff",
            fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
            padding: "4px 14px", borderRadius: 999, marginBottom: 24,
            textTransform: "uppercase", fontFamily: "'DM Mono',monospace",
          }}>Our Vision</div>
          <h2 style={{
            fontFamily: "'Plus Jakarta Sans',sans-serif",
            fontWeight: 900, fontSize: "clamp(22px,2.5vw,30px)",
            lineHeight: 1.25, marginBottom: 18, color: C.text, letterSpacing: "-0.5px",
          }}>
            The trusted learning backbone for future-ready India.
          </h2>
          <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.85, fontFamily: "'Sora',sans-serif" }}>
            We envision a world where every professional — regardless of city or background —
            has access to world-class education and the tools to prove their skills.
          </p>
        </div>
      </div>
    </div>
  );
};

/* ══ Beliefs ══ */
const BeliefsSection = ({ C }) => {
  const h = useFadeIn(0);
  const g = useFadeIn(80);
  return (
    <>
      <div ref={h.ref} style={{ ...h.style, maxWidth: 560, marginBottom: 52 }}>
        <span className="sec-label" style={{ color: C.green }}>At ILM ORA, we believe</span>
        <h2 className="sec-heading" style={{ fontSize: "clamp(28px,3vw,40px)", marginBottom: 16 }}>
          Community is the cornerstone of learning online.
        </h2>
        <p className="sec-body" style={{ fontSize: 16 }}>
          Going through a course alongside a group of peers is the most powerful way to achieve transformation.
        </p>
      </div>
      <div ref={g.ref} style={g.style}>
        <div className="beliefs-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24 }}>
          {BELIEFS.map(({ Icon, colorKey, title, desc }) => {
            const color = C[colorKey];
            return (
              <div key={title} className="belief-card">
                <div style={{
                  width: 50, height: 50, borderRadius: 14, marginBottom: 18,
                  background: color + "12", border: `1.5px solid ${color}28`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon size={22} color={color} strokeWidth={1.9} />
                </div>
                <h3 style={{
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  fontWeight: 800, fontSize: 15.5, color: C.text,
                  marginBottom: 10, letterSpacing: "-0.2px",
                }}>{title}</h3>
                <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.8, fontFamily: "'Sora',sans-serif" }}>{desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

/* ══ Roles ══ */
const RolesSection = ({ C }) => {
  const h = useFadeIn(0);
  const g = useFadeIn(80);

  // teal/pink light+border tints aren't in the base palette (only
  // orange/green were), so derive them here from the accent color
  // instead of hard-coding a 5th/6th light/dark pair per theme.
  const tint = (hex) => ({ bg: hex + "1a", border: hex + "40" });
  const tealTint = tint(C.teal);
  const pinkTint = tint(C.pink);

  const bgFor = (bgKey) => {
    if (bgKey === "tealLight") return tealTint.bg;
    if (bgKey === "pinkLight") return pinkTint.bg;
    return C[bgKey];
  };
  const borderFor = (borderKey) => {
    if (borderKey === "tealBorder") return tealTint.border;
    if (borderKey === "pinkBorder") return pinkTint.border;
    return C[borderKey];
  };

  return (
    <>
      <div ref={h.ref} style={{ ...h.style, maxWidth: 560, marginBottom: 52 }}>
        <span className="sec-label" style={{ color: C.orange }}>One platform</span>
        <h2 className="sec-heading" style={{ fontSize: "clamp(28px,3vw,40px)", marginBottom: 16 }}>
          Built for every learning role.
        </h2>
        <p className="sec-body" style={{ fontSize: 16 }}>
          Role-based dashboards mean every person on the platform sees exactly what they need — nothing more, nothing less.
        </p>
      </div>
      <div ref={g.ref} style={g.style}>
        <div className="four-col" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24 }}>
          {ROLES.map(({ role, Icon, colorKey, bgKey, borderKey, desc, features }) => {
            const color = C[colorKey];
            return (
              <div key={role} className="role-card" style={{ background: bgFor(bgKey), border: `1.5px solid ${borderFor(borderKey)}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 10,
                    background: color + "18", border: `1.5px solid ${color}30`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Icon size={19} color={color} strokeWidth={1.9} />
                  </div>
                  <span style={{
                    background: color, color: "#ffffff",
                    fontSize: 11, fontWeight: 700, letterSpacing: "0.07em",
                    padding: "3px 12px", borderRadius: 999,
                    textTransform: "uppercase", fontFamily: "'DM Mono',monospace",
                  }}>{role}</span>
                </div>
                <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.8, fontFamily: "'Sora',sans-serif", marginBottom: 20 }}>{desc}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {features.map(f => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13, color: C.text, fontFamily: "'Sora',sans-serif" }}>
                      <CheckCircle2 size={14} color={color} strokeWidth={2.2} />
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

/* ══ Timeline ══ */
const TimelineSection = ({ C }) => {
  const h = useFadeIn(0);
  const t = useFadeIn(80);
  return (
    <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "start" }}>
      <div ref={h.ref} style={h.style}>
        <span className="sec-label" style={{ color: C.green }}>Our story</span>
        <h2 className="sec-heading" style={{ fontSize: "clamp(28px,3vw,40px)", marginBottom: 18 }}>
          How ILM ORA came to be.
        </h2>
        <p className="sec-body" style={{ fontSize: 16 }}>
          Founded in 2025 and launched in 2026, ILM ORA is still in its early chapter —
          but the mission has always been clear. Here's how we got here.
        </p>
      </div>
      <div ref={t.ref} style={{ ...t.style, display: "flex", flexDirection: "column" }}>
        {TIMELINE.map((item, i) => (
          <div key={item.year} style={{ display: "flex", gap: 20 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
              <div className="tl-dot">{item.label}</div>
              {i < TIMELINE.length - 1 && <div className="tl-line" />}
            </div>
            <div style={{ paddingBottom: i < TIMELINE.length - 1 ? 32 : 0 }}>
              <div style={{
                fontSize: 12, fontWeight: 700, color: C.green,
                fontFamily: "'DM Mono',monospace", marginBottom: 8,
              }}>{item.year}</div>
              <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8, fontFamily: "'Sora',sans-serif", margin: 0 }}>{item.event}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutTexoraSkills;