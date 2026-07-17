import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Mail, Phone, MapPin, ArrowRight, ChevronDown,
} from "lucide-react";

// ✅ Real API — replaces the fake setTimeout
import { submitContactForm } from "../../services/notificationService";

// ✅ Shared shell used by every other public page (Careers, About, Pricing,
// FAQ, etc). Lives at src/pages/Landing/components/PublicLayout. Rendering
// inside it gives this page the exact same
// AnnouncementBanner → Navbar → ... → Footer shell as Careers — so there
// is only ONE navbar and ONE footer across the whole site.
import PublicLayout from "../Landing/components/PublicLayout";

/* ═══════════════════════════════════════════════════
   ILM ORA  ·  CONTACT PAGE
   Brand: Navy #1a2340 | Orange #F97316 | Green #16a34a
   Rebuilt to match the Careers page shell exactly:
     - same PublicLayout navbar/footer (no page-local nav/footer)
     - same dark-navy hero "banner" treatment
     - same LIGHT/DARK palette + theme-prop pattern
     - all page CSS scoped under `.con-page` (never leaks into
       PublicLayout's navbar/footer)
═══════════════════════════════════════════════════ */

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
  greenLight:   "#f0fdf4",
  greenBorder:  "#bbf7d0",
  teal:         "#0d9488",
  pink:         "#db2777",
  muted:        "#5a6173",
  muted2:       "#8a93a8",
  errorBg:      "#fef2f2",
  errorBorder:  "#fecaca",
  errorText:    "#dc2626",
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
  greenLight:   "#f0fdf4",
  greenBorder:  "#bbf7d0",
  teal:         "#0d9488",
  pink:         "#db2777",
  muted:        "#94a3b8",
  muted2:       "#64748b",
  errorBg:      "#3f1d1f",
  errorBorder:  "#7f1d1d",
  errorText:    "#fca5a5",
};

/* ─────────────────────────────────────────────────────────────
   Everything scoped under `.con-page` instead of bare `*` / `html`
   / `body` selectors, so this page can never strip margin/padding
   off PublicLayout's navbar and footer (same fix as Careers).
───────────────────────────────────────────────────────────── */
const getCSS = (C) => `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Sora:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');

.con-page, .con-page *, .con-page *::before, .con-page *::after{box-sizing:border-box;}
.con-page h1, .con-page h2, .con-page h3, .con-page h4,
.con-page p, .con-page ul, .con-page ol, .con-page label,
.con-page button, .con-page span, .con-page div, .con-page a { margin:0; padding:0; }
.con-page{scroll-behavior:smooth;-webkit-font-smoothing:antialiased;}

.con-page ::-webkit-scrollbar{width:4px;}
.con-page ::-webkit-scrollbar-track{background:${C.bgSub};}
.con-page ::-webkit-scrollbar-thumb{background:${C.orange}80;border-radius:4px;}

.con-page a{color:${C.orange};text-decoration:none;font-weight:600;transition:color 0.18s;}
.con-page a:hover{color:${C.orangeHov};}

@keyframes fadeUp{
  from{opacity:0;transform:translateY(24px);}
  to{opacity:1;transform:translateY(0);}
}
@keyframes blink{0%,100%{opacity:1;}50%{opacity:0.35;}}
@keyframes scaleIn{
  from{opacity:0;transform:scale(0.96);}
  to{opacity:1;transform:scale(1);}
}
@keyframes spin{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}

/* ── Hero (identical treatment to Careers' .car-hero) ── */
.con-page .con-hero{
  background:${C.navy};
  position:relative;overflow:hidden;
  padding:52px 60px 44px;
}
.con-page .con-hero::before{
  content:'';position:absolute;inset:0;
  background:
    radial-gradient(ellipse 80% 60% at 70% 0%, ${C.orange}18 0%, transparent 60%),
    radial-gradient(ellipse 50% 40% at 10% 80%, ${C.green}12 0%, transparent 55%);
  pointer-events:none;
}
.con-page .con-hero-inner{
  max-width:1100px;margin:0 auto;
  position:relative;z-index:1;
}

/* ── Section (same rhythm as Careers' .car-section) ── */
.con-page .con-section{
  padding:80px 60px;
}
.con-page .con-section-inner{
  max-width:1100px;margin:0 auto;
}

/* ── Info card ── */
.con-page .info-card{
  background:${C.surface};
  border:1.5px solid ${C.border};
  border-radius:20px;
  padding:32px 28px;
  display:flex;flex-direction:column;align-items:flex-start;gap:16px;
  transition:box-shadow 0.2s,transform 0.2s;
}
.con-page .info-card:hover{
  box-shadow:0 8px 28px rgba(26,35,64,0.07);
  transform:translateY(-3px);
}

/* ── Form card ── */
.con-page .form-card{
  background:${C.surface};
  border:1.5px solid ${C.border};
  border-radius:24px;
  padding:44px 40px;
  box-shadow:0 4px 24px rgba(26,35,64,0.06);
}

/* ── FAQ card ── */
.con-page .faq-card{
  background:${C.surface};
  border:1.5px solid ${C.border};
  border-radius:24px;
  padding:36px 32px;
  box-shadow:0 4px 24px rgba(26,35,64,0.06);
}

/* ── FAQ item ── */
.con-page .faq-item{
  border-radius:14px;
  border:1.5px solid ${C.border};
  overflow:hidden;
  transition:border-color 0.2s;
}
.con-page .faq-item.open{border-color:${C.orange}60;}
.con-page .faq-btn{
  width:100%;display:flex;justify-content:space-between;align-items:center;
  padding:16px 20px;text-align:left;gap:12px;
  background:transparent;border:none;cursor:pointer;
  transition:background 0.18s;
}
.con-page .faq-btn:hover,.con-page .faq-item.open .faq-btn{background:${C.orangeLight};}
.con-page .faq-answer{
  padding:0 20px 16px;
  font-size:13.5px;color:${C.muted};
  font-family:'Sora',sans-serif;line-height:1.75;
}

/* ── Input ── */
.con-page .con-input{
  width:100%;
  padding:12px 16px;
  border-radius:12px;
  font-size:14px;
  font-family:'Sora',sans-serif;
  color:${C.heading};
  background:${C.bgSub};
  border:1.5px solid ${C.border};
  outline:none;
  transition:border-color 0.18s,box-shadow 0.18s,background 0.18s;
}
.con-page .con-input:focus{
  border-color:${C.orange};
  box-shadow:0 0 0 3px ${C.orange}18;
  background:${C.surface};
}
.con-page .con-input.err{
  border-color:${C.errorText};
  box-shadow:0 0 0 3px ${C.errorText}18;
}
.con-page .con-input::placeholder{color:${C.muted2};}

/* ── Buttons ── */
.con-page .btn-orange{
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
.con-page .btn-orange:hover{transform:translateY(-2px);box-shadow:0 10px 32px ${C.orange}55;color:#fff;}

.con-page .btn-ghost-dark{
  display:inline-flex;align-items:center;gap:8px;
  padding:13px 28px;background:transparent;
  color:rgba(255,255,255,0.8);font-weight:700;font-size:14px;
  border-radius:12px;border:1.5px solid rgba(255,255,255,0.2);
  cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;
  transition:border-color 0.18s,background 0.18s,color 0.18s;
  text-decoration:none;
}
.con-page .btn-ghost-dark:hover{border-color:rgba(255,255,255,0.5);color:#fff;}

/* ── Labels ── */
.con-page .sec-label{
  font-size:11px;font-weight:700;letter-spacing:0.1em;
  text-transform:uppercase;font-family:'DM Mono',monospace;
  margin-bottom:10px;display:block;
}
.con-page .sec-heading{
  font-family:'Plus Jakarta Sans',sans-serif;
  font-weight:900;line-height:1.1;letter-spacing:-0.03em;
  color:${C.heading};
}

/* ── CTA banner (identical treatment to Careers' .cta-banner) ── */
.con-page .cta-banner{
  background:${C.navy};
  padding:72px 60px;text-align:center;
  position:relative;overflow:hidden;
}
.con-page .cta-banner::before{
  content:'';position:absolute;inset:0;
  background:radial-gradient(ellipse 60% 80% at 50% 0%, ${C.orange}18 0%, transparent 65%);
  pointer-events:none;
}

/* ── Error banner ── */
.con-page .error-banner{
  border-radius:12px;
  padding:14px 18px;
  background:${C.errorBg};
  border:1.5px solid ${C.errorBorder};
  color:${C.errorText};
  font-size:13.5px;
  font-family:'Sora',sans-serif;
  display:flex;align-items:center;gap:10px;
}

/* ── RESPONSIVE ── */
@media(max-width:1100px){
  .con-page .con-section{padding:64px 40px;}
  .con-page .con-hero{padding:40px 40px 36px;}
  .con-page .cta-banner{padding:56px 40px;}
  .con-page .form-card{padding:32px 28px;}
  .con-page .faq-card{padding:28px 24px;}
}
@media(max-width:768px){
  .con-page .con-hero{padding:32px 20px 28px;}
  .con-page .con-section{padding:52px 20px;}
  .con-page .cta-banner{padding:44px 20px;}
  .con-page .form-card{padding:24px 20px;}
  .con-page .faq-card{padding:22px 18px;}
  .con-page .info-grid{grid-template-columns:1fr !important;}
  .con-page .form-faq-grid{grid-template-columns:1fr !important;}
  .con-page .form-row{grid-template-columns:1fr !important;}
  .con-page .hero-stats-row{flex-wrap:wrap;}
}
`;

const FAQS = [
  {
    q: "How do I enroll in a course?",
    a: "Create your ILM ORA account, browse the course catalog, and click Enroll. You'll get instant access after payment is confirmed.",
  },
  {
    q: "Will I receive a certificate after completion?",
    a: "Yes — a verified digital certificate is issued automatically once you complete all course requirements and assessments.",
  },
  {
    q: "I forgot my password. What should I do?",
    a: "Click 'Forgot Password' on the login screen and enter your registered email. A secure reset link will be sent immediately.",
  },
  {
    q: "What is the refund policy?",
    a: "We offer a full refund within 7 days of purchase if you are not satisfied — no questions asked, no hassle.",
  },
  {
    q: "Can I access courses on mobile?",
    a: "Absolutely. ILM ORA is fully responsive and works seamlessly on all devices including mobile and tablet.",
  },
];

const TOPICS = [
  "About a course",
  "Technical issue",
  "Account / Login",
  "Payment / Subscription",
  "Partnership inquiry",
  "Something else",
];

/* ══════════════════ MAIN ══════════════════
   Rendered INSIDE PublicLayout, so this page shares the exact same
   AnnouncementBanner → Navbar → ... → Footer shell as Careers and every
   other public page. No page-local nav or footer here.
═══════════════════════════════════════════════════════════ */
const ContactUs = ({ theme, toggleTheme, setShowLoginModal, scrollToSection }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [heroVis, setHeroVis] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", topic: "", message: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [apiError, setApiError] = useState("");
  const [openFaq, setOpenFaq] = useState(null);

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

  const goTo = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const hf = (delay = 0) => ({
    opacity: heroVis ? 1 : 0,
    transform: heroVis ? "translateY(0)" : "translateY(22px)",
    transition: `opacity 0.55s ${delay}ms ease, transform 0.55s ${delay}ms cubic-bezier(.22,1,.36,1)`,
  });

  const INFO_CARDS = [
    {
      icon: Mail,
      color: C.orange,
      label: "Email Us",
      value: "support@ilmora.ai",
      sub: "We reply within 24 hours",
    },
    {
      icon: Phone,
      color: C.green,
      label: "Call Us",
      value: "+91 9210970334",
      sub: "Mon – Fri, 9am to 6pm IST",
    },
    {
      icon: MapPin,
      color: C.teal,
      label: "Office",
      value: "7125 Silent Creek Ave SE",
      sub: "Snoqualmie, WA 98065",
    },
  ];

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required.";
    if (!form.email.trim()) e.email = "Email address is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.message.trim()) e.message = "Message cannot be empty.";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    setErrors(p => ({ ...p, [name]: "" }));
    if (apiError) setApiError("");
  };

  // Real submit — calls POST /api/v1/notification/contact
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const { ok, status, data } = await submitContactForm({
        fullName:    form.name.trim(),
        email:       form.email.trim().toLowerCase(),
        phoneNumber: form.phone.trim() || undefined,
        topic:       form.topic || undefined,
        message:     form.message.trim(),
      });

      if (ok) {
        setSent(true);
      } else if (status === 400) {
        const msg = data?.message || "Please check your inputs and try again.";
        setApiError(msg);
      } else {
        setApiError("Something went wrong. Please try again in a moment.");
      }
    } catch {
      setApiError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
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
        className="con-page"
        style={{
          minHeight: "100vh",
          background: C.bg,
          fontFamily: "'Sora','Plus Jakarta Sans',system-ui,sans-serif",
          width: "100%",
          overflowX: "hidden",
        }}
      >

        {/* ══ HERO (same dark-navy banner treatment as Careers) ══ */}
        <div className="con-hero">
          <div className="con-hero-inner">

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
                We're Here to Help · ILM ORA Support
              </span>
            </div>

            {/* Heading */}
            <h1 style={{
              ...hf(80),
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              fontWeight: 900,
              fontSize: "clamp(38px, 5.5vw, 64px)",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: "#ffffff",
              marginBottom: 20,
              maxWidth: 700,
            }}>
              Get in touch<br />
              with{" "}
              <span style={{ color: C.green }}>ILM</span>
              {" "}
              <span style={{
                background: `linear-gradient(135deg, ${C.orange}, #fbbf24)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>ORA.</span>
            </h1>

            {/* Subtext */}
            <p style={{
              ...hf(160),
              fontSize: 16.5, color: "#94a3b8",
              lineHeight: 1.8, maxWidth: 520, marginBottom: 36,
              fontFamily: "'Sora',sans-serif",
            }}>
              Have a question about courses, billing, or need technical help?
              Our team is ready to assist you every step of the way.
            </p>

            {/* CTAs */}
            <div style={{ ...hf(220), display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 36 }}>
              <button
                className="btn-orange"
                onClick={() => document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" })}
              >
                Send a Message <ArrowRight size={16} />
              </button>
              <a href="mailto:support@ilmora.ai" className="btn-ghost-dark">
                <Mail size={15} />
                support@ilmora.ai
              </a>
            </div>

            {/* Quick stats */}
            <div style={{
              ...hf(280),
              display: "flex", gap: 12, flexWrap: "wrap",
            }}
              className="hero-stats-row"
            >
              {[
                { val: "24h", lbl: "Response Time" },
                { val: "98%", lbl: "Satisfaction" },
                { val: "Mon–Fri", lbl: "Support Hours" },
              ].map(s => (
                <div key={s.lbl} style={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  padding: "16px 24px",
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 16,
                }}>
                  <span style={{
                    fontFamily: "'Plus Jakarta Sans',sans-serif",
                    fontSize: 22, fontWeight: 900, color: "#ffffff",
                    letterSpacing: "-1px", lineHeight: 1,
                  }}>{s.val}</span>
                  <span style={{
                    fontSize: 11, color: "#64748b",
                    fontFamily: "'DM Mono',monospace",
                    marginTop: 5, letterSpacing: "0.04em",
                  }}>{s.lbl}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══ INFO CARDS ══ */}
        <section className="con-section" style={{ background: C.surface, borderBottom: `1px solid ${C.border}` }}>
          <div className="con-section-inner">
            <div className="info-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
              {INFO_CARDS.map((card, i) => {
                const Ic = card.icon;
                return (
                  <div key={i} className="info-card" style={{ animation: `fadeUp 0.4s ${i * 80 + 100}ms ease both` }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: 14,
                      background: card.color + "12",
                      border: `1.5px solid ${card.color}25`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Ic size={22} color={card.color} strokeWidth={1.8} />
                    </div>
                    <div>
                      <span style={{
                        fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
                        textTransform: "uppercase", fontFamily: "'DM Mono',monospace",
                        color: card.color, display: "block", marginBottom: 4,
                      }}>{card.label}</span>
                      <div style={{
                        fontFamily: "'Plus Jakarta Sans',sans-serif",
                        fontWeight: 800, fontSize: 16, color: C.heading, marginBottom: 4,
                      }}>{card.value}</div>
                      <div style={{ fontSize: 13, color: C.muted, fontFamily: "'Sora',sans-serif" }}>
                        {card.sub}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ══ FORM + FAQ ══ */}
        <section id="contact-form" className="con-section" style={{ background: C.bg, borderBottom: `1px solid ${C.border}` }}>
          <div className="con-section-inner">

            <div style={{ marginBottom: 44 }}>
              <span className="sec-label" style={{ color: C.orange }}>Contact Us</span>
              <h2 className="sec-heading" style={{ fontSize: "clamp(28px,3vw,40px)", marginBottom: 12 }}>
                We'd love to hear from you.
              </h2>
              <p style={{ fontSize: 15, color: C.muted, fontFamily: "'Sora',sans-serif", lineHeight: 1.8, maxWidth: 480 }}>
                Fill in the form below or find quick answers in our FAQ section.
              </p>
            </div>

            <div className="form-faq-grid" style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 24, alignItems: "start" }}>

              {/* ── CONTACT FORM ── */}
              <div className="form-card">
                <h3 style={{
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  fontWeight: 900, fontSize: 22, color: C.heading,
                  letterSpacing: "-0.5px", marginBottom: 6,
                }}>Send us a message</h3>
                <p style={{ fontSize: 14, color: C.muted, fontFamily: "'Sora',sans-serif", marginBottom: 28 }}>
                  Our team will respond within 24 hours.
                </p>

                {sent ? (
                  /* ── SUCCESS STATE ── */
                  <div style={{
                    borderRadius: 16, padding: "40px 32px",
                    background: C.greenLight,
                    border: `1.5px solid ${C.greenBorder}`,
                    textAlign: "center",
                    animation: "scaleIn 0.3s ease",
                  }}>
                    <div style={{
                      width: 56, height: 56, borderRadius: "50%",
                      background: C.green + "18",
                      border: `2px solid ${C.greenBorder}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      margin: "0 auto 16px",
                    }}>
                      <svg width="24" height="24" fill="none" stroke={C.green} strokeWidth="2.5" viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <div style={{
                      fontFamily: "'Plus Jakarta Sans',sans-serif",
                      fontWeight: 800, fontSize: 18, color: C.green, marginBottom: 8,
                    }}>Message sent successfully!</div>
                    <p style={{ fontSize: 13.5, color: C.muted, fontFamily: "'Sora',sans-serif", lineHeight: 1.7, marginBottom: 20 }}>
                      Thanks for reaching out. We'll get back to you within 24 hours.
                      Check your inbox — we've sent you a confirmation email too.
                    </p>
                    <button
                      onClick={() => {
                        setSent(false);
                        setApiError("");
                        setForm({ name: "", email: "", phone: "", topic: "", message: "" });
                      }}
                      style={{
                        padding: "10px 24px", borderRadius: 10,
                        background: C.greenLight,
                        border: `1.5px solid ${C.greenBorder}`,
                        color: C.green, fontWeight: 700, fontSize: 13,
                        fontFamily: "'Plus Jakarta Sans',sans-serif",
                        cursor: "pointer",
                      }}
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  /* ── FORM ── */
                  <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                    {/* API-level error banner — shown when backend returns non-ok */}
                    {apiError && (
                      <div className="error-banner">
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                        {apiError}
                      </div>
                    )}

                    {/* Name + Email */}
                    <div className="form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      <div>
                        <label style={{
                          display: "block", fontSize: 12, fontWeight: 700,
                          color: C.heading, fontFamily: "'Plus Jakarta Sans',sans-serif",
                          marginBottom: 8,
                        }}>Full name <span style={{ color: C.errorText }}>*</span></label>
                        <input
                          name="name" type="text" value={form.name} onChange={handleChange}
                          placeholder="Ali Hassan"
                          className={`con-input${errors.name ? " err" : ""}`}
                        />
                        {errors.name && <p style={{ fontSize: 12, color: C.errorText, marginTop: 4, fontFamily: "'Sora',sans-serif" }}>{errors.name}</p>}
                      </div>
                      <div>
                        <label style={{
                          display: "block", fontSize: 12, fontWeight: 700,
                          color: C.heading, fontFamily: "'Plus Jakarta Sans',sans-serif",
                          marginBottom: 8,
                        }}>Email address <span style={{ color: C.errorText }}>*</span></label>
                        <input
                          name="email" type="email" value={form.email} onChange={handleChange}
                          placeholder="ali@example.com"
                          className={`con-input${errors.email ? " err" : ""}`}
                        />
                        {errors.email && <p style={{ fontSize: 12, color: C.errorText, marginTop: 4, fontFamily: "'Sora',sans-serif" }}>{errors.email}</p>}
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label style={{
                        display: "block", fontSize: 12, fontWeight: 700,
                        color: C.heading, fontFamily: "'Plus Jakarta Sans',sans-serif",
                        marginBottom: 8,
                      }}>
                        Phone number{" "}
                        <span style={{ fontWeight: 400, color: C.muted2 }}>(optional)</span>
                      </label>
                      <input
                        name="phone" type="tel" value={form.phone} onChange={handleChange}
                        placeholder="+91 92109 70334"
                        className="con-input"
                      />
                    </div>

                    {/* Topic */}
                    <div>
                      <label style={{
                        display: "block", fontSize: 12, fontWeight: 700,
                        color: C.heading, fontFamily: "'Plus Jakarta Sans',sans-serif",
                        marginBottom: 8,
                      }}>Topic</label>
                      <select
                        name="topic" value={form.topic} onChange={handleChange}
                        className="con-input"
                        style={{ appearance: "none", cursor: "pointer" }}
                      >
                        <option value="">Select a topic...</option>
                        {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <label style={{
                        display: "block", fontSize: 12, fontWeight: 700,
                        color: C.heading, fontFamily: "'Plus Jakarta Sans',sans-serif",
                        marginBottom: 8,
                      }}>Message <span style={{ color: C.errorText }}>*</span></label>
                      <textarea
                        name="message" value={form.message} onChange={handleChange}
                        placeholder="Describe your question or issue in detail..."
                        rows={5}
                        className={`con-input${errors.message ? " err" : ""}`}
                        style={{ resize: "vertical" }}
                      />
                      {errors.message && <p style={{ fontSize: 12, color: C.errorText, marginTop: 4, fontFamily: "'Sora',sans-serif" }}>{errors.message}</p>}
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-orange"
                      style={{
                        width: "100%", justifyContent: "center",
                        opacity: loading ? 0.75 : 1,
                        cursor: loading ? "not-allowed" : "pointer",
                      }}
                    >
                      {loading ? (
                        <>
                          <svg style={{ animation: "spin 1s linear infinite", width: 16, height: 16 }} fill="none" viewBox="0 0 24 24">
                            <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>Send Message <ArrowRight size={16} /></>
                      )}
                    </button>
                  </form>
                )}
              </div>

              {/* ── FAQ ── */}
              <div className="faq-card">
                <span className="sec-label" style={{ color: C.green }}>Quick Answers</span>
                <h3 style={{
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  fontWeight: 900, fontSize: 20, color: C.heading,
                  letterSpacing: "-0.3px", marginBottom: 6,
                }}>FAQs</h3>
                <p style={{ fontSize: 13.5, color: C.muted, fontFamily: "'Sora',sans-serif", marginBottom: 24, lineHeight: 1.7 }}>
                  Quick answers to common questions.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {FAQS.map((faq, i) => (
                    <div key={i} className={`faq-item${openFaq === i ? " open" : ""}`}>
                      <button className="faq-btn" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                        <span style={{
                          fontFamily: "'Plus Jakarta Sans',sans-serif",
                          fontWeight: 700, fontSize: 13.5, color: C.heading,
                          lineHeight: 1.5, flex: 1,
                        }}>{faq.q}</span>
                        <ChevronDown
                          size={16}
                          color={C.orange}
                          style={{
                            flexShrink: 0,
                            transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.2s",
                          }}
                        />
                      </button>
                      {openFaq === i && (
                        <div className="faq-answer">{faq.a}</div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Still need help */}
                <div style={{
                  marginTop: 24, borderRadius: 14, padding: "18px 20px",
                  background: C.orangeLight,
                  border: `1.5px solid ${C.orangeBorder}`,
                  textAlign: "center",
                }}>
                  <p style={{ fontSize: 12, color: C.muted, fontFamily: "'Sora',sans-serif", marginBottom: 6 }}>
                    Still have questions?
                  </p>
                  <a
                    href="mailto:support@ilmora.ai"
                    style={{
                      fontSize: 13.5, fontWeight: 800, color: C.orangeHov,
                      fontFamily: "'Plus Jakarta Sans',sans-serif",
                      textDecoration: "none",
                    }}
                  >
                    support@ilmora.ai →
                  </a>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ══ CTA BANNER (identical treatment to Careers' CTA) ══ */}
        <div className="cta-banner">
          <div style={{ position: "relative", zIndex: 1, maxWidth: 600, margin: "0 auto" }}>
            <div
              style={{
                fontFamily: "'Plus Jakarta Sans',sans-serif",
                fontSize: 26, fontWeight: 900, letterSpacing: "-0.5px",
                marginBottom: 16, cursor: "pointer",
              }}
              onClick={() => goTo("/")}
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
              Ready to start learning?
            </h2>
            <p style={{
              fontSize: 15.5, color: "#94a3b8", lineHeight: 1.8,
              marginBottom: 28, fontFamily: "'Sora',sans-serif",
            }}>
              Explore hundreds of courses on ILM ORA and become the top 1%.
            </p>
            <button
              onClick={() => goTo("/")}
              className="btn-orange"
              style={{ border: "none" }}
            >
              Start Learning <ArrowRight size={16} />
            </button>
          </div>
        </div>

      </div>
    </PublicLayout>
  );
};

export default ContactUs;