import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail, Phone, MapPin, ArrowRight, ChevronDown,
  Star, Shield, Zap,
} from "lucide-react";

/* ═══════════════════════════════════════════════════
   ILM ORA  ·  CONTACT PAGE
   Brand: Navy #1a2340 | Orange #F97316 | Green #16a34a
   Tone: Editorial/Magazine — warm cream BG, bold type
   ← Exact same design system as Careers page
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
@keyframes scaleIn{
  from{opacity:0;transform:scale(0.96);}
  to{opacity:1;transform:scale(1);}
}
@keyframes spin{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}

/* ── Navbar (identical to Careers) ── */
.con-nav{
  position:sticky;top:0;z-index:100;
  background:${C.white};
  border-bottom:1px solid ${C.border};
  padding:0 60px;height:68px;
  display:flex;align-items:center;justify-content:space-between;
  box-shadow:0 2px 16px rgba(26,35,64,0.05);
}
.con-logo{
  font-family:'Plus Jakarta Sans',sans-serif;
  font-size:26px;font-weight:900;
  letter-spacing:-0.5px;cursor:pointer;
  border:none;background:none;padding:0;
  display:inline-flex;align-items:center;user-select:none;
}
.con-logo .ilm{color:${C.green};}
.con-logo .ora{color:${C.orange};margin-left:6px;}

/* ── Hero (same structure as Careers hero) ── */
.con-hero{
  background:${C.navy};
  position:relative;overflow:hidden;
  padding:48px 60px 40px;
}
.con-hero::before{
  content:'';position:absolute;inset:0;
  background:
    radial-gradient(ellipse 80% 60% at 70% 0%, ${C.orange}18 0%, transparent 60%),
    radial-gradient(ellipse 50% 40% at 10% 80%, ${C.green}12 0%, transparent 55%);
  pointer-events:none;
}
.con-hero-inner{
  max-width:1100px;margin:0 auto;
  position:relative;z-index:1;
}

/* ── Section ── */
.con-section{
  padding:80px 60px;
}
.con-section-inner{
  max-width:1100px;margin:0 auto;
}

/* ── Info card ── */
.info-card{
  background:${C.white};
  border:1.5px solid ${C.border};
  border-radius:20px;
  padding:32px 28px;
  display:flex;flex-direction:column;align-items:flex-start;gap:16px;
  transition:box-shadow 0.2s,transform 0.2s;
}
.info-card:hover{
  box-shadow:0 8px 28px rgba(26,35,64,0.07);
  transform:translateY(-3px);
}

/* ── Form card ── */
.form-card{
  background:${C.white};
  border:1.5px solid ${C.border};
  border-radius:24px;
  padding:44px 40px;
  box-shadow:0 4px 24px rgba(26,35,64,0.06);
}

/* ── FAQ card ── */
.faq-card{
  background:${C.white};
  border:1.5px solid ${C.border};
  border-radius:24px;
  padding:36px 32px;
  box-shadow:0 4px 24px rgba(26,35,64,0.06);
}

/* ── FAQ item ── */
.faq-item{
  border-radius:14px;
  border:1.5px solid ${C.border};
  overflow:hidden;
  transition:border-color 0.2s;
}
.faq-item.open{border-color:${C.orange}60;}
.faq-btn{
  width:100%;display:flex;justify-content:space-between;align-items:center;
  padding:16px 20px;text-align:left;gap:12px;
  background:transparent;border:none;cursor:pointer;
  transition:background 0.18s;
}
.faq-btn:hover,.faq-item.open .faq-btn{background:${C.orangeLight};}
.faq-answer{
  padding:0 20px 16px;
  font-size:13.5px;color:${C.muted};
  font-family:'Sora',sans-serif;line-height:1.75;
}

/* ── Input ── */
.con-input{
  width:100%;
  padding:12px 16px;
  border-radius:12px;
  font-size:14px;
  font-family:'Sora',sans-serif;
  color:${C.navy};
  background:${C.bgSub};
  border:1.5px solid ${C.border};
  outline:none;
  transition:border-color 0.18s,box-shadow 0.18s,background 0.18s;
}
.con-input:focus{
  border-color:${C.orange};
  box-shadow:0 0 0 3px ${C.orange}18;
  background:${C.white};
}
.con-input.err{
  border-color:#dc2626;
  box-shadow:0 0 0 3px #dc262618;
}
.con-input::placeholder{color:${C.muted2};}

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
  .con-section{padding:64px 40px;}
  .con-nav{padding:0 40px;}
  .con-hero{padding:36px 40px 32px;}
  .cta-banner{padding:56px 40px;}
  .form-card{padding:32px 28px;}
  .faq-card{padding:28px 24px;}
}
@media(max-width:768px){
  .con-nav{padding:0 20px;height:58px;}
  .con-hero{padding:28px 20px 24px;}
  .con-section{padding:52px 20px;}
  .cta-banner{padding:44px 20px;}
  .form-card{padding:24px 20px;}
  .faq-card{padding:22px 18px;}
  .info-grid{grid-template-columns:1fr !important;}
  .form-faq-grid{grid-template-columns:1fr !important;}
  .form-row{grid-template-columns:1fr !important;}
}
`;

const INFO_CARDS = [
  {
    icon: Mail,
    color: C.orange,
    bg: C.orangeLight,
    border: C.orangeBorder,
    label: "Email Us",
    value: "support@ilmora.ai",
    sub: "We reply within 24 hours",
  },
  {
    icon: Phone,
    color: C.green,
    bg: C.greenLight,
    border: C.greenBorder,
    label: "Call Us",
    value: "+91 9210970334",
    sub: "Mon – Fri, 9am to 6pm IST",
  },
  {
    icon: MapPin,
    color: C.teal,
    bg: "#f0fdfa",
    border: "#99f6e4",
    label: "Office",
    value: "7125 Silent Creek Ave SE",
    sub: "Snoqualmie, WA 98065",
  },
];

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

/* ══════════════════ MAIN ══════════════════ */
export default function ContactUs() {
  const navigate = useNavigate();
  const [heroVis, setHeroVis] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", topic: "", message: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  // ── Page par aate hi top par scroll ──
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  // ── Scroll to top helper ──
  const goTo = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  // Hero fade-in on mount
  useState(() => {
    const t = setTimeout(() => setHeroVis(true), 60);
    return () => clearTimeout(t);
  });

  const hf = (delay = 0) => ({
    opacity: heroVis ? 1 : 0,
    transform: heroVis ? "translateY(0)" : "translateY(22px)",
    transition: `opacity 0.55s ${delay}ms ease, transform 0.55s ${delay}ms cubic-bezier(.22,1,.36,1)`,
  });

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
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1600);
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
        <nav className="con-nav">
          <button className="con-logo" onClick={() => goTo("/")}>
            <span className="ilm">ILM</span>
            <span className="ora">ORA</span>
          </button>
          <a href="mailto:support@ilmora.ai" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "9px 20px", borderRadius: 10,
            background: C.orangeLight, border: `1.5px solid ${C.orangeBorder}`,
            fontSize: 13, fontWeight: 700, color: C.orange,
            fontFamily: "'Plus Jakarta Sans',sans-serif",
            textDecoration: "none",
            transition: "background 0.18s",
          }}>
            <Mail size={14} />
            support@ilmora.ai
          </a>
        </nav>

        {/* ══ HERO ══ */}
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
              fontSize: "clamp(38px, 5.5vw, 68px)",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: C.white,
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
              fontSize: 17, color: "#94a3b8",
              lineHeight: 1.8, maxWidth: 520, marginBottom: 44,
              fontFamily: "'Sora',sans-serif",
            }}>
              Have a question about courses, billing, or need technical help?
              Our team is ready to assist you every step of the way.
            </p>

            {/* Quick stats */}
            <div style={{
              ...hf(240),
              display: "flex", gap: 12, flexWrap: "wrap",
            }}>
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
                    fontSize: 22, fontWeight: 900, color: C.white,
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
        <section className="con-section" style={{ background: C.white, borderBottom: `1px solid ${C.border}` }}>
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
                        fontWeight: 800, fontSize: 16, color: C.navy, marginBottom: 4,
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
        <section className="con-section" style={{ background: C.bg, borderBottom: `1px solid ${C.border}` }}>
          <div className="con-section-inner">

            {/* Section heading */}
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
                  fontWeight: 900, fontSize: 22, color: C.navy,
                  letterSpacing: "-0.5px", marginBottom: 6,
                }}>Send us a message</h3>
                <p style={{ fontSize: 14, color: C.muted, fontFamily: "'Sora',sans-serif", marginBottom: 28 }}>
                  Our team will respond within 24 hours.
                </p>

                {sent ? (
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
                    </p>
                    <button
                      onClick={() => { setSent(false); setForm({ name: "", email: "", phone: "", topic: "", message: "" }); }}
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
                  <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                    {/* Name + Email */}
                    <div className="form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      <div>
                        <label style={{
                          display: "block", fontSize: 12, fontWeight: 700,
                          color: C.navy, fontFamily: "'Plus Jakarta Sans',sans-serif",
                          marginBottom: 8,
                        }}>Full name <span style={{ color: "#dc2626" }}>*</span></label>
                        <input
                          name="name" type="text" value={form.name} onChange={handleChange}
                          placeholder="Ali Hassan"
                          className={`con-input${errors.name ? " err" : ""}`}
                        />
                        {errors.name && <p style={{ fontSize: 12, color: "#dc2626", marginTop: 4, fontFamily: "'Sora',sans-serif" }}>{errors.name}</p>}
                      </div>
                      <div>
                        <label style={{
                          display: "block", fontSize: 12, fontWeight: 700,
                          color: C.navy, fontFamily: "'Plus Jakarta Sans',sans-serif",
                          marginBottom: 8,
                        }}>Email address <span style={{ color: "#dc2626" }}>*</span></label>
                        <input
                          name="email" type="email" value={form.email} onChange={handleChange}
                          placeholder="ali@example.com"
                          className={`con-input${errors.email ? " err" : ""}`}
                        />
                        {errors.email && <p style={{ fontSize: 12, color: "#dc2626", marginTop: 4, fontFamily: "'Sora',sans-serif" }}>{errors.email}</p>}
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label style={{
                        display: "block", fontSize: 12, fontWeight: 700,
                        color: C.navy, fontFamily: "'Plus Jakarta Sans',sans-serif",
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
                        color: C.navy, fontFamily: "'Plus Jakarta Sans',sans-serif",
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
                        color: C.navy, fontFamily: "'Plus Jakarta Sans',sans-serif",
                        marginBottom: 8,
                      }}>Message <span style={{ color: "#dc2626" }}>*</span></label>
                      <textarea
                        name="message" value={form.message} onChange={handleChange}
                        placeholder="Describe your question or issue in detail..."
                        rows={5}
                        className={`con-input${errors.message ? " err" : ""}`}
                        style={{ resize: "vertical" }}
                      />
                      {errors.message && <p style={{ fontSize: 12, color: "#dc2626", marginTop: 4, fontFamily: "'Sora',sans-serif" }}>{errors.message}</p>}
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
                  fontWeight: 900, fontSize: 20, color: C.navy,
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
                          fontWeight: 700, fontSize: 13.5, color: C.navy,
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
                      fontSize: 13.5, fontWeight: 800, color: C.orange,
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

        {/* ══ CTA BANNER ══ */}
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
              color: C.white, letterSpacing: "-1px",
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
            {/* ← button mein convert kiya, scroll-to-top ke saath */}
            <button
              onClick={() => goTo("/")}
              className="btn-orange"
              style={{ border: "none" }}
            >
              Start Learning <ArrowRight size={16} />
            </button>
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
          <button
            onClick={() => goTo("/")}
            style={{
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              fontSize: 20, fontWeight: 900, letterSpacing: "-0.5px",
              background: "none", border: "none", cursor: "pointer", padding: 0,
            }}
          >
            <span style={{ color: C.green }}>ILM</span>
            <span style={{ color: C.orange, marginLeft: 5 }}>ORA</span>
          </button>
          <span style={{ fontSize: 12.5, color: C.muted2, fontFamily: "'Sora',sans-serif" }}>
            © 2026 ILM ORA. All rights reserved.
          </span>
        </div>

      </div>
    </>
  );
}