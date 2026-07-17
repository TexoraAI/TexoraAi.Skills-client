import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Handshake, Monitor, User, BookOpen, CreditCard,
  AlertTriangle, Shield, RefreshCw, Scale, ChevronDown, ChevronRight,
  Mail, Globe, Lock, CheckCircle2, ArrowRight, FileText,
} from "lucide-react";

// ✅ Shared shell used by every other public page (Careers, About, Pricing,
// Contact, FAQ, etc). Lives at src/pages/Landing/components/PublicLayout.
// Rendering inside it gives this page the exact same
// AnnouncementBanner → Navbar → ... → Footer as every other public page —
// so there is only ONE navbar and ONE footer across the whole site.
import PublicLayout from "../Landing/components/PublicLayout";

/* ═══════════════════════════════════════════════════════════
   ILM ORA  ·  TERMS OF SERVICE
   Brand: Navy #1a2340 | Orange #F97316 | Green #16a34a
   Rebuilt to match the Careers page shell exactly:
     - same PublicLayout navbar/footer (no page-local nav/footer)
     - same dark-navy hero "banner" treatment
     - same LIGHT/DARK palette + theme-prop pattern
     - all page CSS scoped under `.tos-page` (never leaks into
       PublicLayout's navbar/footer, same fix applied on Careers)
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

/* ─────────────────────────────────────────────────────────────
   Everything scoped under `.tos-page` instead of bare `*` / `html`
   / `body` selectors, so this page can never strip margin/padding
   off PublicLayout's navbar and footer.
───────────────────────────────────────────────────────────── */
const getCSS = (C) => `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Sora:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');

.tos-page, .tos-page *, .tos-page *::before, .tos-page *::after{box-sizing:border-box;}
.tos-page h1, .tos-page h2, .tos-page h3, .tos-page h4,
.tos-page p, .tos-page ul, .tos-page ol,
.tos-page button, .tos-page span, .tos-page div, .tos-page a { margin:0; padding:0; }
.tos-page{scroll-behavior:smooth;-webkit-font-smoothing:antialiased;}

.tos-page ::-webkit-scrollbar{width:4px;}
.tos-page ::-webkit-scrollbar-track{background:${C.bgSub};}
.tos-page ::-webkit-scrollbar-thumb{background:${C.orange}80;border-radius:4px;}

.tos-page a{color:${C.orange};text-decoration:none;font-weight:600;transition:color 0.18s;}
.tos-page a:hover{color:${C.orangeHov};}

@keyframes fadeUp{
  from{opacity:0;transform:translateY(24px);}
  to{opacity:1;transform:translateY(0);}
}
@keyframes blink{0%,100%{opacity:1;}50%{opacity:0.4;}}
@keyframes floatY{0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);}}
@keyframes ringOut{from{transform:scale(1);opacity:0.5;}to{transform:scale(1.65);opacity:0;}}

/* ── Hero (same treatment as Careers' .car-hero) ── */
.tos-page .tos-hero{
  background:${C.navy};
  position:relative;overflow:hidden;
  padding:52px 60px 64px;
}
.tos-page .tos-hero::before{
  content:'';position:absolute;inset:0;
  background:
    radial-gradient(ellipse 80% 60% at 70% 0%, ${C.orange}18 0%, transparent 60%),
    radial-gradient(ellipse 50% 40% at 10% 80%, ${C.green}12 0%, transparent 55%);
  pointer-events:none;
}
.tos-page .tos-hero-inner{
  max-width:1200px;margin:0 auto;
  display:grid;grid-template-columns:1fr 400px;
  gap:48px;align-items:center;
  position:relative;z-index:1;
}

/* ── Doc preview card (hero right panel) ── */
.tos-page .doc-preview-card{
  background:rgba(255,255,255,0.06);
  border:1px solid rgba(255,255,255,0.12);
  border-radius:20px;
  padding:32px;
  backdrop-filter:blur(12px);
}

/* ── Stat pill (hero) ── */
.tos-page .stat-pill{
  display:flex;flex-direction:column;align-items:center;
  padding:18px 20px;background:rgba(255,255,255,0.07);
  border:1px solid rgba(255,255,255,0.12);
  border-radius:16px;
}

/* ── Buttons ── */
.tos-page .btn-orange{
  display:inline-flex;align-items:center;gap:8px;
  padding:14px 32px;
  background:linear-gradient(135deg,${C.orange},#fb923c);
  color:#fff;font-weight:800;font-size:14.5px;
  border-radius:12px;border:none;cursor:pointer;
  font-family:'Plus Jakarta Sans',sans-serif;
  box-shadow:0 6px 24px ${C.orange}40;
  transition:transform 0.18s,box-shadow 0.18s;
  text-decoration:none;
}
.tos-page .btn-orange:hover{transform:translateY(-2px);box-shadow:0 10px 32px ${C.orange}55;color:#fff;}

.tos-page .btn-ghost-dark{
  display:inline-flex;align-items:center;gap:8px;
  padding:13px 28px;background:transparent;
  color:rgba(255,255,255,0.8);font-weight:700;font-size:14px;
  border-radius:12px;border:1.5px solid rgba(255,255,255,0.2);
  cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;
  transition:border-color 0.18s,background 0.18s,color 0.18s;
  text-decoration:none;
}
.tos-page .btn-ghost-dark:hover{border-color:rgba(255,255,255,0.5);color:#fff;}

.tos-page .btn-ghost{
  display:inline-flex;align-items:center;gap:8px;
  padding:12px 26px;background:transparent;
  color:${C.heading};font-weight:700;font-size:14px;
  border-radius:12px;border:1.5px solid ${C.borderMid};
  cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;
  text-decoration:none;transition:border-color 0.18s,background 0.18s,color 0.18s;
}
.tos-page .btn-ghost:hover{border-color:${C.orange};background:${C.orangeLight};color:${C.orangeHov};}

/* ── Section wrapper (same rhythm as Careers' .car-section) ── */
.tos-page .tos-section{
  padding:72px 60px;
}
.tos-page .tos-section-inner{
  max-width:1100px;margin:0 auto;
}

/* Section card */
.tos-page .sec-card{
  background:${C.surface};
  border:1.5px solid ${C.border};
  border-radius:16px;overflow:hidden;
  cursor:pointer;
  transition:border-color 0.25s,box-shadow 0.25s,transform 0.2s;
}
.tos-page .sec-card:hover{
  box-shadow:0 8px 36px rgba(0,0,0,0.07);
  transform:translateY(-2px);
}
.tos-page .sec-card.open{
  box-shadow:0 10px 40px rgba(0,0,0,0.08);
}

/* TOC button */
.tos-page .toc-btn{
  display:flex;align-items:center;gap:10px;
  width:100%;padding:10px 14px;
  background:none;border:none;border-radius:10px;
  font-family:'Sora',sans-serif;font-size:12.5px;
  color:${C.muted};cursor:pointer;text-align:left;
  transition:background 0.18s,color 0.18s,padding-left 0.2s;
}
.tos-page .toc-btn:hover{background:${C.bgSub};color:${C.heading};padding-left:18px;}
.tos-page .toc-btn.active{
  background:${C.orangeLight};color:${C.orangeHov};font-weight:600;
  border-left:3px solid ${C.orange};
  border-radius:0 10px 10px 0;padding-left:11px;
}

/* Point row */
.tos-page .pt-row{
  display:flex;gap:12px;align-items:flex-start;
  padding:5px 0;font-family:'Sora',sans-serif;
  font-size:13.5px;line-height:1.75;
  color:${C.muted};transition:color 0.18s;
}
.tos-page .pt-row:hover{color:${C.heading};}

/* ── CTA banner (identical treatment to Careers' .cta-banner) ── */
.tos-page .cta-banner{
  background:${C.navy};
  padding:72px 60px;text-align:center;
  position:relative;overflow:hidden;
}
.tos-page .cta-banner::before{
  content:'';position:absolute;inset:0;
  background:radial-gradient(ellipse 60% 80% at 50% 0%, ${C.orange}18 0%, transparent 65%);
  pointer-events:none;
}

/* ── RESPONSIVE ── */
@media(max-width:1100px){
  .tos-page .tos-hero-inner{display:flex;flex-direction:column;align-items:stretch;gap:0;}
  .tos-page .tos-hero-visual{
    display:flex;align-self:flex-start;width:100%;max-width:440px;margin:28px 0 0;
  }
  .tos-page .tos-hero{padding:44px 40px 48px;}
  .tos-page .tos-section{padding:56px 40px;}
  .tos-page .cta-banner{padding:56px 40px;}
  .tos-page .layout-grid{grid-template-columns:1fr !important;}
  .tos-page .sidebar-col{display:none !important;}
}
@media(max-width:768px){
  .tos-page .tos-hero{padding:36px 20px 40px;}
  .tos-page .doc-preview-card{padding:24px;}
  .tos-page .tos-section{padding:44px 20px;}
  .tos-page .cta-banner{padding:44px 20px;}
  .tos-page .hero-stats-row{grid-template-columns:1fr 1fr !important;}
  .tos-page .sec-card-head{padding:16px 16px !important;gap:12px !important;}
  .tos-page .sec-card-body{padding:0 16px 20px !important;}
  .tos-page .subsec-grid{grid-template-columns:1fr !important;}
  .tos-page .subsec-span{grid-column:1 !important;}
  .tos-page .contact-grid{grid-template-columns:1fr !important;}
  .tos-page .notice-wrap{flex-direction:column;gap:10px !important;}
  .tos-page .cta-btns{flex-direction:column;align-items:center;}
}
@media(max-width:480px){
  .tos-page .hero-stats-row{grid-template-columns:1fr 1fr !important;}
  .tos-page .sec-icon-box{width:40px !important;height:40px !important;border-radius:11px !important;}
  .tos-page .sec-title{font-size:13.5px !important;}
  .tos-page .sec-summary{display:none !important;}
}
`;

/* Animated counter */
const Counter = ({ to, suffix = "", started }) => {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!started) return;
    const dur = 1400, t0 = performance.now();
    const go = now => {
      const p = Math.min((now - t0) / dur, 1);
      setV(Math.round((1 - Math.pow(1 - p, 3)) * to));
      if (p < 1) requestAnimationFrame(go);
    };
    requestAnimationFrame(go);
  }, [started, to]);
  return <>{v}{suffix}</>;
};

/* TOC + active watcher */
const TOC = [
  { id: "acceptance",  label: "Acceptance of Terms",     Icon: Handshake     },
  { id: "platform",    label: "Platform Usage",           Icon: Monitor       },
  { id: "account",     label: "Your Account",             Icon: User          },
  { id: "content",     label: "Content & IP Rights",      Icon: BookOpen      },
  { id: "payment",     label: "Payment & Billing",        Icon: CreditCard    },
  { id: "prohibited",  label: "Prohibited Conduct",       Icon: Shield        },
  { id: "disclaimers", label: "Disclaimers & Liability",  Icon: AlertTriangle },
  { id: "termination", label: "Changes & Termination",    Icon: RefreshCw     },
  { id: "disputes",    label: "Disputes & Legal",         Icon: Scale         },
];

const useActive = () => {
  const [active, setActive] = useState("acceptance");
  useEffect(() => {
    const fn = () => {
      const y = window.scrollY + 200;
      for (let i = TOC.length - 1; i >= 0; i--) {
        const el = document.getElementById("s-" + TOC[i].id);
        if (el && el.offsetTop <= y) { setActive(TOC[i].id); break; }
      }
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return active;
};

/* ── Section accordion card ── */
const SectionCard = ({ data, idx, C }) => {
  const [open, setOpen] = useState(false);
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

  const Ico = data.Icon;

  return (
    <div
      id={"s-" + data.id}
      ref={ref}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(22px)",
        transition: `opacity 0.48s ${idx * 55}ms ease, transform 0.48s ${idx * 55}ms cubic-bezier(.22,1,.36,1)`,
      }}
    >
      <div
        className={`sec-card ${open ? "open" : ""}`}
        style={{ borderColor: open ? data.color + "70" : C.border }}
        onClick={() => setOpen(p => !p)}
      >
        {/* Header */}
        <div
          className="sec-card-head"
          style={{
            padding: "22px 24px",
            display: "flex", alignItems: "center",
            justifyContent: "space-between", gap: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16, flex: 1, minWidth: 0 }}>
            {/* Icon */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flexShrink: 0 }}>
              <div
                className="sec-icon-box"
                style={{
                  width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                  background: open ? data.color + "18" : data.color + "10",
                  border: `1.5px solid ${data.color}${open ? "50" : "28"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.25s",
                  boxShadow: open ? `0 4px 16px ${data.color}25` : "none",
                }}
              >
                <Ico size={21} color={data.color} strokeWidth={1.9} />
              </div>
              <span style={{
                fontSize: 9, fontFamily: "'DM Mono', monospace",
                color: data.color, opacity: 0.75, fontWeight: 500,
              }}>
                §{String(idx + 1).padStart(2, "0")}
              </span>
            </div>

            {/* Text */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                className="sec-title"
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 800, fontSize: 15.5, color: C.heading,
                  marginBottom: 4, letterSpacing: "-0.2px",
                }}
              >
                {data.title}
              </div>
              <div
                className="sec-summary"
                style={{
                  fontFamily: "'Sora', sans-serif",
                  fontSize: 13, color: C.muted,
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}
              >
                {data.summary}
              </div>
            </div>
          </div>

          {/* Chevron */}
          <div style={{
            width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
            background: open ? data.color + "18" : C.bgSubDark,
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background 0.25s",
          }}>
            <ChevronDown
              size={16} color={open ? data.color : C.muted}
              style={{ transition: "transform 0.35s cubic-bezier(.22,1,.36,1)", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
            />
          </div>
        </div>

        {/* Body */}
        <div style={{
          maxHeight: open ? "3600px" : "0",
          overflow: "hidden",
          transition: "max-height 0.6s cubic-bezier(.22,1,.36,1)",
        }}>
          <div className="sec-card-body" style={{ padding: "0 24px 26px" }}>
            <div style={{ height: 1, background: C.border, marginBottom: 20 }} />
            <div
              className="subsec-grid"
              style={{
                display: "grid",
                gridTemplateColumns: data.subsections.length === 1 ? "1fr" : "1fr 1fr",
                gap: 14,
              }}
            >
              {data.subsections.map((sub, si) => (
                <div
                  key={si}
                  className={
                    (data.subsections.length === 3 && si === 2) || data.subsections.length === 1
                      ? "subsec-span" : ""
                  }
                  style={{
                    background: C.bgSub, border: `1.5px solid ${C.border}`,
                    borderRadius: 12, padding: "18px 20px",
                    gridColumn:
                      (data.subsections.length === 3 && si === 2) || data.subsections.length === 1
                        ? "span 2" : "auto",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                    <div style={{
                      width: 3, height: 16, borderRadius: 2,
                      background: `linear-gradient(to bottom, ${data.color}, ${data.color}44)`,
                      flexShrink: 0,
                    }} />
                    <span style={{
                      fontSize: 9.5, fontWeight: 700, color: data.color,
                      textTransform: "uppercase", letterSpacing: "0.1em",
                      fontFamily: "'DM Mono', monospace",
                    }}>
                      {sub.title}
                    </span>
                  </div>

                  {sub.points.map((pt, pi) => (
                    <div key={pi} className="pt-row">
                      <span style={{
                        width: 6, height: 6, borderRadius: "50%",
                        background: data.color, flexShrink: 0, marginTop: 8,
                        boxShadow: `0 0 6px ${data.color}55`,
                      }} />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════ MAIN ══════════════════
   Rendered INSIDE PublicLayout, so this page shares the exact same
   AnnouncementBanner → Navbar → ... → Footer shell as Careers and
   every other public page. No page-local nav or footer here.
═══════════════════════════════════════════════════════════ */
const TermsOfService = ({ theme, toggleTheme, setShowLoginModal, scrollToSection }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [heroVis, setHeroVis] = useState(false);
  const [statsOn, setStatsOn] = useState(false);
  const statsRef = useRef();
  const active = useActive();

  // Pick the palette from the current theme and rebuild the scoped CSS
  // string with it, so every color on this page — not just the shared
  // navbar/footer — responds to the light/dark toggle, exactly like Careers.
  const C = theme === "dark" ? DARK : LIGHT;
  const CSS = getCSS(C);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [pathname]);
  useEffect(() => {
    const t = setTimeout(() => setHeroVis(true), 60);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setStatsOn(true); },
      { threshold: 0.2 }
    );
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  const hf = (delay = 0) => ({
    opacity: heroVis ? 1 : 0,
    transform: heroVis ? "translateY(0)" : "translateY(22px)",
    transition: `opacity 0.55s ${delay}ms ease, transform 0.55s ${delay}ms cubic-bezier(.22,1,.36,1)`,
  });

  const scrollTo = id =>
    document.getElementById("s-" + id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  const HERO_STATS = [
    { to: 9,  suffix: "",      label: "Policy Sections" },
    { to: 30, suffix: " Days", label: "Max Change Notice" },
    { to: 14, suffix: " Days", label: "Annual Refund Window" },
    { to: 30, suffix: " Days", label: "Arbitration Opt-Out" },
  ];

  const sections = [
    {
      id: "acceptance", Icon: Handshake, color: C.orange,
      title: "Acceptance of Terms",
      summary: "Legally binding agreement between you and ILM ORA",
      subsections: [
        { title: "Agreement to Terms", points: [
          "By accessing or using ILM ORA, you agree to be bound by these Terms of Service.",
          "You must be at least 18 years old, or at least 13 with verifiable parental consent.",
          "If using on behalf of an organization, you confirm authority to bind that entity.",
          "Clicking 'I Accept', registering, or simply using the Service constitutes full acceptance.",
          "These Terms supersede all prior agreements between you and ILM ORA.",
        ]},
        { title: "Service Access", points: [
          "We reserve the right to modify, suspend, or discontinue any part of our Service at any time.",
          "Access to certain features requires account registration and identity verification.",
          "You are responsible for maintaining the confidentiality of your login credentials.",
          "We may refuse service or terminate accounts at our sole and absolute discretion.",
        ]},
      ],
    },
    {
      id: "platform", Icon: Monitor, color: C.green,
      title: "Platform Usage",
      summary: "Scope, acceptable use, and availability of ILM ORA services",
      subsections: [
        { title: "What We Provide", points: [
          "ILM ORA provides AI-powered learning, cohort-based courses, skill assessments, and certifications.",
          "Our platform includes progress tracking, analytics, skill-gap analysis, and career guidance tools.",
          "Third-party tools and content may be integrated to enhance your learning experience.",
          "Service levels and available features vary by subscription plan.",
        ]},
        { title: "Acceptable Use", points: [
          "Use the platform solely for lawful educational and professional development purposes.",
          "Do not share credentials or permit unauthorized access to your account.",
          "Do not attempt to reverse-engineer, scrape, or commercially exploit any part of the Service.",
          "Simultaneous unauthorized livestreaming of course content is strictly prohibited.",
          "You are responsible for the accuracy and legality of any content you contribute.",
        ]},
        { title: "Availability", points: [
          "We target high uptime but cannot guarantee uninterrupted, error-free access at all times.",
          "Scheduled maintenance will be communicated in advance whenever reasonably possible.",
          "Beta features are subject to changes, limitations, or removal without prior notice.",
        ]},
      ],
    },
    {
      id: "account", Icon: User, color: C.navy,
      title: "Your Account",
      summary: "Responsibilities and obligations tied to your ILM ORA account",
      subsections: [
        { title: "Account Security", points: [
          "You are solely responsible for all activities that occur under your account.",
          "Notify us immediately at security@ilmora.ai if you suspect any unauthorized access.",
          "Do not share account credentials or allow simultaneous sessions from multiple users.",
          "ILM ORA is not liable for any loss or damage from unauthorized use of your account.",
        ]},
        { title: "Account Information", points: [
          "Provide accurate, complete, and current information when creating your account.",
          "Keep your profile, contact details, and billing information up to date at all times.",
          "Impersonation of any person or entity is strictly prohibited and grounds for termination.",
          "Only one account per individual is permitted unless explicitly authorized by ILM ORA.",
        ]},
      ],
    },
    {
      id: "content", Icon: BookOpen, color: "#c2410c",
      title: "Content & IP Rights",
      summary: "Ownership of platform content, your data, and third-party materials",
      subsections: [
        { title: "ILM ORA Intellectual Property", points: [
          "ILM ORA owns all rights to the platform, software, AI models, algorithms, and branding.",
          "Our trademarks, logos, and proprietary course methodologies are protected intellectual property.",
          "You may not copy, modify, distribute, or create derivative works of our platform content.",
          "Unauthorized use of our IP may result in immediate termination and legal action.",
        ]},
        { title: "Your Content & Data", points: [
          "You retain full ownership of content you create or submit on our platform.",
          "You grant ILM ORA a worldwide, non-exclusive, royalty-free license to deliver services.",
          "We may use anonymized, aggregated data to improve our AI models and platform quality.",
          "You warrant submitted content does not infringe any third-party rights.",
        ]},
        { title: "Course Content Protection", points: [
          "Course content — text, video, audio, code — is owned by ILM ORA or the respective instructor.",
          "Sharing, distributing, or re-uploading course content constitutes copyright infringement.",
          "Unauthorized sharing may result in statutory damages up to $150,000 per incident.",
          "Report infringement to copyright@ilmora.ai with full details of the alleged violation.",
        ]},
      ],
    },
    {
      id: "payment", Icon: CreditCard, color: C.rose,
      title: "Payment & Billing",
      summary: "Subscription plans, fees, refund policy, and billing terms",
      subsections: [
        { title: "Subscription & Pricing", points: [
          "ILM ORA offers free, individual, and enterprise subscription tiers with varying features.",
          "Prices are displayed in USD and are subject to applicable local taxes.",
          "Subscription prices may change with 30 days' written notice to existing subscribers.",
          "Enterprise plans may carry custom pricing and separate contractual terms.",
          "Promotional pricing is non-transferable and applies only to the qualifying account.",
        ]},
        { title: "Payment Terms & Refunds", points: [
          "All payments are due in advance for the selected billing cycle (monthly or annual).",
          "We accept major credit cards and other payment methods displayed at checkout.",
          "Failed payments may result in immediate suspension or termination of your access.",
          "All fees are non-refundable unless otherwise specified or required by applicable law.",
          "Annual subscriptions cancelled within 14 days of renewal may be eligible for a pro-rated refund.",
          "You authorize ILM ORA and our payment processors to charge your payment method on file.",
        ]},
      ],
    },
    {
      id: "prohibited", Icon: Shield, color: C.teal,
      title: "Prohibited Conduct",
      summary: "Actions strictly forbidden when using ILM ORA",
      subsections: [
        { title: "Strictly Prohibited Actions", points: [
          "Using the Service for any illegal purpose or in violation of applicable law.",
          "Harassing, threatening, impersonating, or defaming any user, instructor, or ILM ORA staff.",
          "Recording or capturing course content without explicit written permission from ILM ORA.",
          "Uploading malware, viruses, or any code designed to disrupt or damage the Service.",
          "Attempting to gain unauthorized access to other accounts, systems, or network infrastructure.",
          "Selling, renting, or commercially exploiting access to ILM ORA content or the platform.",
          "Collecting or harvesting personal data of other users without their explicit consent.",
          "Simultaneously livestreaming any course via platforms like Facebook Live or TikTok.",
        ]},
      ],
    },
    {
      id: "disclaimers", Icon: AlertTriangle, color: C.amber,
      title: "Disclaimers & Liability",
      summary: "Important limitations and warranties regarding our Service",
      subsections: [
        { title: "No Warranties", points: [
          "The Service is provided 'as is' and 'as available' without warranties of any kind.",
          "We do not warrant that the Service will be uninterrupted, secure, or completely error-free.",
          "Learning outcomes and career results are not guaranteed — they depend on individual effort.",
          "ILM ORA is not responsible for reliance on information provided by instructors or third parties.",
        ]},
        { title: "Limitation of Liability", points: [
          "Our total aggregate liability is limited to fees paid in the prior 12 months, or $100 USD — whichever is greater.",
          "We are not liable for any indirect, incidental, special, consequential, or punitive damages.",
          "We are not responsible for damages arising from third-party actions or service outages.",
          "Some jurisdictions do not permit certain liability exclusions — those apply to the fullest extent permitted by law.",
        ]},
      ],
    },
    {
      id: "termination", Icon: RefreshCw, color: C.pink,
      title: "Changes & Termination",
      summary: "How accounts are closed and how policies may change",
      subsections: [
        { title: "Termination by You", points: [
          "You may cancel your account at any time via account settings or by contacting support@ilmora.ai.",
          "Cancellation takes effect at the end of your current paid billing period.",
          "You remain responsible for all charges incurred before your termination date.",
          "Download your data and certificates before cancellation — access may not be available afterward.",
        ]},
        { title: "Termination by ILM ORA", points: [
          "We may suspend or terminate your account immediately for any violation of these Terms.",
          "Serious violations — including illegal activity or IP infringement — result in immediate termination.",
          "We will provide reasonable notice before termination where circumstances permit.",
          "Upon termination, all licenses granted to you cease immediately and permanently.",
        ]},
        { title: "Policy Updates", points: [
          "We may update these Terms at any time; material changes will be communicated 7–30 days in advance.",
          "Notification will be sent via email and/or an in-app banner notification.",
          "Continued use of the Service after the effective date constitutes acceptance of updated Terms.",
          "If you disagree with updates, you may terminate your account without penalty before the effective date.",
        ]},
      ],
    },
    {
      id: "disputes", Icon: Scale, color: C.green,
      title: "Disputes & Legal",
      summary: "Governing law, arbitration, and compliance requirements",
      subsections: [
        { title: "Governing Law", points: [
          "These Terms are governed by applicable laws of the relevant jurisdiction.",
          "If any provision is found unenforceable, the remaining Terms continue in full force.",
          "These Terms represent the entire agreement between you and ILM ORA.",
        ]},
        { title: "Dispute Resolution & Arbitration", points: [
          "We encourage informal resolution — contact legal@ilmora.ai before commencing formal proceedings.",
          "Unresolved disputes may be submitted to binding individual arbitration under applicable rules.",
          "You may opt out of arbitration within 30 days of account creation by written notice to legal@ilmora.ai.",
          "Class action lawsuits and class arbitration are waived — all claims must be brought individually.",
          "Nothing prevents either party from seeking injunctive relief in court for IP infringement matters.",
        ]},
        { title: "Compliance", points: [
          "Users must comply with all applicable local, national, and international laws and regulations.",
          "International users are responsible for compliance with local data protection and privacy laws.",
          "Report compliance concerns to compliance@ilmora.ai promptly.",
        ]},
      ],
    },
  ];

  return (
    <PublicLayout
      theme={theme}
      toggleTheme={toggleTheme}
      setShowLoginModal={setShowLoginModal}
      scrollToSection={scrollToSection}
    >
      <style>{CSS}</style>
      <div
        className="tos-page"
        style={{
          minHeight: "100vh",
          background: C.bg,
          fontFamily: "'Sora','Plus Jakarta Sans',system-ui,sans-serif",
          width: "100%",
          overflowX: "hidden",
        }}
      >

        {/* ══ HERO (same dark-navy banner treatment as Careers) ══ */}
        <div className="tos-hero">
          <div className="tos-hero-inner">

            {/* Left: Text */}
            <div>
              {/* Badge */}
              <div style={{ ...hf(0), marginBottom: 20 }}>
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
                  Legal Document
                </span>
              </div>

              {/* Heading */}
              <h1 style={{
                ...hf(80),
                fontFamily: "'Plus Jakarta Sans',sans-serif",
                fontWeight: 900,
                fontSize: "clamp(34px, 5vw, 58px)",
                lineHeight: 1.06,
                letterSpacing: "-0.03em",
                color: "#ffffff",
                marginBottom: 18,
              }}>
                Terms of{" "}
                <span style={{
                  background: `linear-gradient(135deg, ${C.orange}, #fbbf24)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>Service</span>
              </h1>

              {/* Sub */}
              <p style={{
                ...hf(160),
                fontSize: 16, color: "#94a3b8",
                lineHeight: 1.7, maxWidth: 520, marginBottom: 32,
                fontFamily: "'Sora',sans-serif",
              }}>
                These Terms govern your use of ILM ORA's AI-powered learning
                platform. By using our Service, you agree to be bound by these terms.
              </p>

              {/* CTAs */}
              <div style={{ ...hf(220), display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 36 }}>
                <button className="btn-orange" onClick={() => scrollTo("acceptance")}>
                  Read the Terms <ArrowRight size={16} />
                </button>
                <a href="mailto:legal@ilmora.ai" className="btn-ghost-dark">
                  Contact Legal Team
                </a>
              </div>

              {/* Stats row */}
              <div
                ref={statsRef}
                style={{
                  ...hf(280),
                  display: "grid", gridTemplateColumns: "repeat(4, auto)",
                  gap: 12, width: "fit-content",
                }}
                className="hero-stats-row"
              >
                {HERO_STATS.map(s => (
                  <div key={s.label} className="stat-pill">
                    <span style={{
                      fontFamily: "'Plus Jakarta Sans',sans-serif",
                      fontSize: 24, fontWeight: 900, color: "#ffffff",
                      letterSpacing: "-1px", lineHeight: 1,
                    }}>
                      <Counter to={s.to} suffix={s.suffix} started={statsOn} />
                    </span>
                    <span style={{
                      fontSize: 10.5, color: "#64748b",
                      fontFamily: "'DM Mono',monospace",
                      marginTop: 6, letterSpacing: "0.03em", textAlign: "center",
                    }}>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Document preview card */}
            <div className="tos-hero-visual">
              <div className="doc-preview-card">
                <div style={{
                  display: "flex", alignItems: "center", gap: 8, marginBottom: 20,
                }}>
                  <FileText size={14} color={C.orange} strokeWidth={2} />
                  <span style={{
                    fontSize: 10, fontWeight: 700, color: C.orange,
                    fontFamily: "'DM Mono',monospace", letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}>Contents</span>
                </div>
                {TOC.slice(0, 5).map((item, i) => {
                  const Ic = item.Icon;
                  return (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: 14,
                      padding: "12px 0",
                      borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.07)" : "none",
                      animation: `fadeUp 0.4s ${i * 80}ms ease both`,
                    }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: 9,
                        background: C.orange + "20",
                        border: `1px solid ${C.orange}30`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                      }}>
                        <Ic size={14} color={C.orange} strokeWidth={1.9} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: 13, fontWeight: 700, color: "#ffffff",
                          fontFamily: "'Plus Jakarta Sans',sans-serif",
                          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                        }}>§{String(i + 1).padStart(2, "0")} {item.label}</div>
                      </div>
                      <ChevronRight size={14} color="#64748b" />
                    </div>
                  );
                })}
                <div
                  onClick={() => scrollTo("disputes")}
                  style={{
                    marginTop: 18, textAlign: "center", cursor: "pointer",
                    fontSize: 12, color: C.orange,
                    fontFamily: "'DM Mono',monospace", letterSpacing: "0.05em",
                  }}
                >+{TOC.length - 5} more sections →</div>
              </div>
            </div>

          </div>
        </div>

        {/* ══ 2-COLUMN LAYOUT ══ */}
        <section className="tos-section" style={{ background: C.bg }}>
          <div className="tos-section-inner">
            <div
              className="layout-grid"
              style={{
                display: "grid", gridTemplateColumns: "228px 1fr",
                gap: 32, alignItems: "start",
              }}
            >
              {/* ── SIDEBAR ── */}
              <aside className="sidebar-col" style={{ position: "sticky", top: 88 }}>

                {/* TOC */}
                <div style={{
                  background: C.surface,
                  border: `1.5px solid ${C.border}`,
                  borderRadius: 18, padding: "16px 8px",
                  boxShadow: "0 4px 20px rgba(26,35,64,0.04)",
                }}>
                  <div style={{
                    fontSize: 9.5, fontWeight: 700, color: C.muted2,
                    textTransform: "uppercase", letterSpacing: "0.12em",
                    fontFamily: "'DM Mono', monospace",
                    padding: "0 14px", marginBottom: 10,
                  }}>
                    Contents
                  </div>

                  {TOC.map(item => (
                    <button
                      key={item.id}
                      className={`toc-btn ${active === item.id ? "active" : ""}`}
                      onClick={() => scrollTo(item.id)}
                    >
                      <item.Icon
                        size={13}
                        color={active === item.id ? C.orange : C.muted2}
                        strokeWidth={active === item.id ? 2.2 : 1.8}
                      />
                      {item.label}
                    </button>
                  ))}
                </div>

                {/* Quick contact */}
                <div style={{
                  marginTop: 16, padding: "18px 16px",
                  background: C.orangeLight,
                  border: `1.5px solid ${C.orangeBorder}`,
                  borderRadius: 16,
                }}>
                  <div style={{
                    fontSize: 9.5, fontWeight: 700, color: C.orangeHov,
                    textTransform: "uppercase", letterSpacing: "0.1em",
                    fontFamily: "'DM Mono', monospace", marginBottom: 12,
                  }}>
                    Questions?
                  </div>
                  <a
                    href="mailto:legal@ilmora.ai"
                    style={{
                      display: "flex", alignItems: "center", gap: 8,
                      fontSize: 13, fontFamily: "'Sora', sans-serif", fontWeight: 600,
                    }}
                  >
                    <Mail size={13} color={C.orangeHov} strokeWidth={2} />
                    <span style={{ color: "#1a2340" }}>legal@ilmora.ai</span>
                  </a>
                  <div style={{
                    fontSize: 11.5, color: "#5a6173",
                    marginTop: 8, fontFamily: "'Sora', sans-serif",
                  }}>
                    Mon–Fri, 9am–6pm IST
                  </div>
                </div>
              </aside>

              {/* ── MAIN CONTENT ── */}
              <main>

                {/* Meta pills */}
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 24 }}>
                  {[
                    { label: "Effective", val: "Feb 2, 2026" },
                    { label: "Updated",   val: "Feb 2, 2026" },
                    { label: "Version",   val: "2.0.1" },
                  ].map((m, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex", alignItems: "center", gap: 8,
                        padding: "8px 16px", borderRadius: 10,
                        background: C.surface, border: `1.5px solid ${C.border}`,
                        fontSize: 12.5,
                      }}
                    >
                      <span style={{ color: C.muted }}>{m.label}:</span>
                      <span style={{
                        color: C.heading, fontWeight: 700,
                        fontFamily: "'DM Mono', monospace", fontSize: 11.5,
                      }}>{m.val}</span>
                    </div>
                  ))}
                </div>

                {/* Arbitration notice */}
                <div
                  className="notice-wrap"
                  style={{
                    display: "flex", gap: 14, alignItems: "flex-start",
                    padding: "20px 24px", borderRadius: 16, marginBottom: 24,
                    background: C.roseLight,
                    border: `1.5px solid ${C.rose}28`,
                  }}
                >
                  <div style={{
                    width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                    background: C.rose + "14",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <AlertTriangle size={19} color={C.rose} strokeWidth={1.9} />
                  </div>
                  <div>
                    <div style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontWeight: 800, fontSize: 14, color: C.rose, marginBottom: 6,
                    }}>
                      Important Arbitration Notice
                    </div>
                    <p style={{
                      fontSize: 13.5, color: "#5a6173", lineHeight: 1.8,
                      fontFamily: "'Sora', sans-serif",
                    }}>
                      By accepting these Terms, you agree disputes will be resolved by{" "}
                      <strong style={{ color: "#1a2340" }}>binding individual arbitration</strong>.
                      You waive your right to a jury trial or class action. You may opt out within{" "}
                      <strong style={{ color: "#1a2340" }}>30 days</strong> of account creation
                      by emailing <a href="mailto:legal@ilmora.ai">legal@ilmora.ai</a>.
                    </p>
                  </div>
                </div>

                {/* Welcome block */}
                <div style={{
                  padding: "28px 30px", borderRadius: 18, marginBottom: 24,
                  background: C.surface, border: `1.5px solid ${C.border}`,
                }}>
                  <div style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 28, flexShrink: 0 }}>👋</span>
                    <div>
                      <h2 style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontWeight: 800, fontSize: 16.5, color: C.heading,
                        marginBottom: 10, letterSpacing: "-0.3px",
                      }}>
                        Welcome to ILM ORA
                      </h2>
                      <p style={{
                        fontSize: 14, color: C.muted, lineHeight: 1.85,
                        fontFamily: "'Sora', sans-serif", marginBottom: 14,
                      }}>
                        These Terms of Service form a legally binding contract between you and ILM ORA
                        governing your access to and use of our AI-powered learning platform and all
                        associated services.
                      </p>
                      <div style={{
                        fontSize: 14, fontWeight: 600, color: C.heading, lineHeight: 1.8,
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        padding: "14px 18px", borderRadius: 10,
                        background: C.bgSub, border: `1px solid ${C.border}`,
                      }}>
                        By accessing or using ILM ORA, you confirm that you have read, understood,
                        and agree to be bound by these Terms. If you do not agree, please discontinue
                        use of the Service immediately.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section list */}
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {sections.map((s, i) => (
                    <SectionCard key={s.id} data={s} idx={i} C={C} />
                  ))}
                </div>

                {/* Footer note */}
                <div style={{
                  marginTop: 28, padding: "18px 22px", borderRadius: 14,
                  background: C.surface, border: `1.5px solid ${C.border}`,
                  display: "flex", gap: 12, alignItems: "flex-start",
                }}>
                  <Globe size={16} color={C.muted2} strokeWidth={1.8} style={{ flexShrink: 0, marginTop: 2 }} />
                  <p style={{
                    fontSize: 13.5, color: C.muted, lineHeight: 1.8,
                    fontFamily: "'Sora', sans-serif",
                  }}>
                    For information on how we handle your personal data, review our{" "}
                    <a href="/privacy-policy">Privacy Policy</a>.
                    For account support, contact{" "}
                    <a href="mailto:support@ilmora.ai">support@ilmora.ai</a>.
                  </p>
                </div>
              </main>
            </div>
          </div>
        </section>

        {/* ══ CTA BANNER (identical treatment to Careers' CTA) ══ */}
        <div className="cta-banner">
          <div style={{ position: "relative", zIndex: 1, maxWidth: 640, margin: "0 auto" }}>
            <div
              style={{
                fontFamily: "'Plus Jakarta Sans',sans-serif",
                fontSize: 26, fontWeight: 900, letterSpacing: "-0.5px",
                marginBottom: 16, cursor: "pointer",
              }}
              onClick={() => navigate("/")}
            >
              <span style={{ color: C.green }}>ILM</span>
              <span style={{ color: C.orange, marginLeft: 6 }}>ORA</span>
            </div>

            <h2 style={{
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              fontSize: "clamp(26px,4vw,40px)", fontWeight: 900,
              color: "#ffffff", letterSpacing: "-1px",
              lineHeight: 1.15, marginBottom: 14,
            }}>
              Questions about these terms?
            </h2>
            <p style={{
              fontSize: 15.5, color: "#94a3b8", lineHeight: 1.8,
              marginBottom: 36, fontFamily: "'Sora',sans-serif",
            }}>
              Our legal and support teams are ready to clarify any aspect of these
              Terms, your rights, or your obligations as an ILM ORA user.
            </p>

            {/* Contact tiles */}
            <div
              className="contact-grid"
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 36, textAlign: "left" }}
            >
              {[
                { title: "Legal Team",   email: "legal@ilmora.ai",   Icon: Scale,        note: "Terms, compliance & IP queries" },
                { title: "Support Team", email: "support@ilmora.ai", Icon: CheckCircle2, note: "Account & billing assistance"   },
              ].map((c, i) => {
                const Ic = c.Icon;
                return (
                  <div
                    key={i}
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: 16, padding: "24px 22px",
                    }}
                  >
                    <div style={{
                      width: 40, height: 40, borderRadius: 11, marginBottom: 14,
                      background: C.orange + "20", border: `1px solid ${C.orange}35`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Ic size={18} color={C.orange} strokeWidth={1.9} />
                    </div>
                    <div style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontWeight: 800, fontSize: 14.5, color: "#ffffff", marginBottom: 6,
                    }}>{c.title}</div>
                    <a
                      href={`mailto:${c.email}`}
                      style={{ fontSize: 12.5, fontFamily: "'DM Mono', monospace", color: C.orange }}
                    >
                      {c.email}
                    </a>
                    <div style={{
                      fontSize: 12, color: "#64748b",
                      marginTop: 8, fontFamily: "'Sora', sans-serif",
                    }}>{c.note}</div>
                  </div>
                );
              })}
            </div>

            <div className="cta-btns" style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <a href="mailto:legal@ilmora.ai" className="btn-orange">
                <Mail size={16} />
                Contact Legal Team
              </a>
              <a href="mailto:support@ilmora.ai" className="btn-ghost-dark">
                <CheckCircle2 size={15} />
                Get Support
              </a>
            </div>
          </div>
        </div>

      </div>
    </PublicLayout>
  );
};

export default TermsOfService;