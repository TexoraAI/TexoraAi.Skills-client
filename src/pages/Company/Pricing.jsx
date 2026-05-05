import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Lock } from "lucide-react";

/* ── Design tokens (identical to PrivacyPolicy.jsx) ── */
const T = {
  cream:   "#fdf6ee",
  cream2:  "#f5ede0",
  cream3:  "#fbeee0",
  navy:    "#1a2340",
  navy2:   "#0f172a",
  orange:  "#f97316",
  orangeL: "#fff3e8",
  orangeB: "#fcd4a8",
  green:   "#16a34a",
  indigo:  "#6366f1",
  text:    "#1e293b",
  muted:   "#475569",
  muted2:  "#64748b",
  border:  "#e5d9c8",
  borderM: "#d5c4aa",
  card:    "#fffaf5",
  white:   "#ffffff",
};

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&family=Sora:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body { background: ${T.cream3}; -webkit-font-smoothing: antialiased; }
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: ${T.cream2}; }
::-webkit-scrollbar-thumb { background: ${T.orange}80; border-radius: 4px; }
a { text-decoration: none; transition: color 0.18s; }

@keyframes fadeUp {
  from { opacity:0; transform:translateY(22px); }
  to   { opacity:1; transform:translateY(0); }
}
@keyframes float {
  0%,100% { transform:translateY(0px); }
  50%      { transform:translateY(-8px); }
}
@keyframes blink {
  0%,100% { opacity:1; }
  50%      { opacity:0.35; }
}
@keyframes ringOut {
  from { transform:scale(1); opacity:0.45; }
  to   { transform:scale(1.7); opacity:0; }
}

/* ── Navbar — SAME as PrivacyPolicy ── */
.pp-nav {
  position: sticky; top: 0; z-index: 100;
  background: ${T.white};
  border-bottom: 1px solid ${T.border};
  padding: 0 32px; height: 68px;
  display: flex; align-items: center; justify-content: space-between;
  box-shadow: 0 2px 16px rgba(26,35,64,0.05);
}
.pp-logo {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 26px; font-weight: 900;
  letter-spacing: -0.5px; text-decoration: none;
  cursor: pointer; transition: opacity 0.18s;
}
.pp-logo:hover { opacity: 0.82; }
.pp-logo .ilm { color: ${T.green}; }
.pp-logo .ora { color: ${T.orange}; margin-left: 6px; }
.nav-links { display: flex; gap: 28px; list-style: none; }
.nav-link {
  font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 600;
  color: ${T.muted}; text-decoration: none; transition: color 0.18s;
}
.nav-link:hover { color: ${T.navy}; }
.nav-link.active { color: ${T.orange}; font-weight: 700; }
.nav-cta {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 10px 22px;
  background: linear-gradient(135deg, ${T.navy}, #263059);
  color: #fff; font-weight: 800; font-size: 13.5px;
  border-radius: 10px; border: none; cursor: pointer;
  font-family: 'Plus Jakarta Sans', sans-serif;
  box-shadow: 0 4px 16px rgba(26,35,64,0.2);
  transition: transform 0.18s, box-shadow 0.18s;
}
.nav-cta:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(26,35,64,0.32); }

/* ── Pricing card ── */
.pricing-card {
  background: ${T.white}; border: 1.5px solid ${T.border};
  border-radius: 20px; padding: 38px 32px;
  position: relative;
  transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s;
}
.pricing-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 50px rgba(26,35,64,0.1);
  border-color: rgba(249,115,22,0.35);
}
.pricing-card.popular {
  background: ${T.navy}; border-color: ${T.navy};
}
.pricing-card.popular:hover { border-color: ${T.orange}; }

/* ── FAQ ── */
.faq-card {
  background: ${T.white}; border: 1.5px solid ${T.border};
  border-radius: 16px; margin-bottom: 10px; overflow: hidden;
  cursor: pointer; transition: border-color 0.2s, box-shadow 0.2s;
}
.faq-card:hover { border-color: rgba(249,115,22,0.35); box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
.faq-card.open { border-color: rgba(249,115,22,0.45); box-shadow: 0 6px 28px rgba(249,115,22,0.08); }

/* ── Bottom bar — SAME as PrivacyPolicy ── */
.bottom-bar {
  padding: 20px 32px;
  border-top: 1px solid ${T.border};
  background: ${T.cream3};
  display: flex; justify-content: space-between;
  align-items: center; flex-wrap: wrap; gap: 12px;
}

@media(max-width:960px){
  .cards-grid { grid-template-columns: 1fr !important; }
  .nav-links { display: none !important; }
  .pp-nav { padding: 0 16px; }
  .guarantee-box { margin: 0 16px 60px !important; padding: 48px 24px !important; }
}
@media(max-width:600px){
  .bottom-bar { flex-direction: column; text-align: center; }
  .trust-strip { flex-direction: column; align-items: center; gap: 12px !important; }
}
`;

const plans = [
  {
    id: "starter",
    name: "Starter",
    monthlyPrice: 0,
    annualPrice: 0,
    period: "Free forever",
    desc: "Perfect for exploring ILM ORA and getting a feel for our platform.",
    cta: "Get Started Free",
    ctaType: "outline",
    popular: false,
    accentColor: T.green,
    features: [
      { text: "Access to 3 free courses",       included: true  },
      { text: "Community forum access",          included: true  },
      { text: "Weekly live Q&A sessions",        included: true  },
      { text: "Basic learning path",             included: true  },
      { text: "Mentor 1-on-1 sessions",          included: false },
      { text: "Certificate of completion",       included: false },
      { text: "Career support & resume review",  included: false },
    ],
  },
  {
    id: "pro",
    name: "Pro Learner",
    monthlyPrice: 1499,
    annualPrice: 999,
    period: "/month · billed as shown",
    desc: "For professionals serious about mastering Product, Design, Growth & Marketing.",
    cta: "Start Learning →",
    ctaType: "primary",
    popular: true,
    accentColor: T.orange,
    features: [
      { text: "Full course library (50+ courses)", included: true  },
      { text: "Live cohort-based learning",        included: true  },
      { text: "2 mentor sessions/month",           included: true  },
      { text: "Certificate of completion",         included: true  },
      { text: "Priority community access",         included: true  },
      { text: "Downloadable resources",            included: true  },
      { text: "Dedicated career coach",            included: false },
    ],
  },
  {
    id: "elite",
    name: "Elite",
    monthlyPrice: 3999,
    annualPrice: 2799,
    period: "/month · billed as shown",
    desc: "For those who want industry-expert mentorship and guaranteed career outcomes.",
    cta: "Go Elite →",
    ctaType: "navy",
    popular: false,
    accentColor: T.indigo,
    features: [
      { text: "Everything in Pro Learner",    included: true },
      { text: "Unlimited mentor sessions",    included: true },
      { text: "Dedicated career coach",       included: true },
      { text: "Resume & LinkedIn review",     included: true },
      { text: "Mock interviews with experts", included: true },
      { text: "Job referral network access",  included: true },
      { text: "1-year placement support",     included: true },
    ],
  },
];

const faqs = [
  { q: "Can I switch plans anytime?",               a: "Yes! You can upgrade or downgrade your plan at any time from your account settings. Changes take effect from your next billing cycle." },
  { q: "Are the courses taught in Hindi or English?", a: "Our courses are available in both Hindi and English. Each course listing clearly indicates the language of instruction so you can choose what suits you best." },
  { q: "What payment methods are accepted?",        a: "We accept UPI, Debit/Credit cards, Net Banking, and EMI options via Razorpay. All payments are secured with 256-bit SSL encryption." },
  { q: "Do I get lifetime access to course content?", a: "Pro and Elite subscribers have access to all content as long as their subscription is active. Certificates earned remain yours permanently even after cancellation." },
  { q: "Is there a student discount available?",    a: "Yes! Students with a valid .edu email or college ID can get an additional 20% off on Pro and Elite plans. Contact our support team to apply the discount." },
];

const fmt = (n) => (n === 0 ? "0" : n.toLocaleString("en-IN"));

export default function Pricing() {
  const { pathname } = useLocation();
  const [isAnnual, setIsAnnual] = useState(false);
  const [openFaq,  setOpenFaq]  = useState(null);

  /* Scroll to top on route change — same as PrivacyPolicy */
  useEffect(() => { window.scrollTo({ top: 0 }); }, [pathname]);

  return (
    <>
      <style>{STYLES}</style>
      <div style={{ minHeight: "100vh", background: T.cream3, fontFamily: "'Sora','Plus Jakarta Sans',sans-serif", color: T.text }}>

        {/* ══════════════════════════════════════
            NAVBAR  — identical to PrivacyPolicy
        ══════════════════════════════════════ */}
        <nav className="pp-nav">
          <a href="/" className="pp-logo">
            <span className="ilm">ILM</span>
            <span className="ora">ORA</span>
          </a>

          
        </nav>

        {/* ══════════════════════════════════════
            HERO
        ══════════════════════════════════════ */}
        <section style={{ textAlign: "center", padding: "80px 20px 56px", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ maxWidth: 640, margin: "0 auto" }}>

            {/* Badge */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 9,
              padding: "8px 22px", borderRadius: 999,
              background: T.orangeL, border: `1.5px solid ${T.orangeB}`,
              marginBottom: 32, animation: "fadeUp 0.5s 0.05s ease both",
            }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: T.orange, animation: "blink 2.4s ease-in-out infinite" }} />
              <span style={{ fontSize: 12, fontWeight: 800, color: T.orange, fontFamily: "'Plus Jakarta Sans',sans-serif", letterSpacing: "0.07em" }}>
                SIMPLE, TRANSPARENT PRICING
              </span>
            </div>

            {/* Floating emoji icon */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 28, animation: "fadeUp 0.5s 0.08s ease both" }}>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", inset: -10, borderRadius: "50%", background: T.orange, opacity: 0.06, animation: "ringOut 3s ease-out infinite" }} />
                <div style={{
                  width: 84, height: 84, borderRadius: 22,
                  background: T.orangeL, border: `2px solid ${T.orangeB}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  animation: "float 4.5s ease-in-out infinite", fontSize: 40,
                }}>
                  💡
                </div>
              </div>
            </div>

            {/* Heading */}
            <h1 style={{
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              fontSize: "clamp(36px,6vw,60px)", fontWeight: 900,
              color: T.navy, lineHeight: 1.06, letterSpacing: "-2px",
              marginBottom: 20, animation: "fadeUp 0.52s 0.12s ease both",
            }}>
              Invest in Your{" "}
              <span style={{ background: `linear-gradient(135deg,${T.orange},#fb923c)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Top 1%
              </span>{" "}
              Future
            </h1>

            <p style={{
              fontSize: 16.5, color: T.muted, lineHeight: 1.82, fontWeight: 500,
              maxWidth: 480, margin: "0 auto 40px",
              fontFamily: "'Sora',sans-serif",
              animation: "fadeUp 0.52s 0.18s ease both",
            }}>
              Choose the plan that fits your learning goals. No hidden fees, cancel anytime.
            </p>

            {/* Billing Toggle */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              background: T.white, border: `1.5px solid ${T.border}`,
              borderRadius: 100, padding: "6px 8px", cursor: "pointer",
              boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
            }}>
              {[
                { label: "Monthly",  annual: false },
                { label: "Annual",   annual: true  },
              ].map(({ label, annual }) => (
                <span
                  key={label}
                  onClick={() => setIsAnnual(annual)}
                  style={{
                    fontSize: 14, fontWeight: 600, padding: "8px 20px",
                    borderRadius: 100, cursor: "pointer",
                    fontFamily: "'Sora',sans-serif",
                    display: "flex", alignItems: "center", gap: 8,
                    transition: "all .2s",
                    background: isAnnual === annual ? T.navy : "transparent",
                    color:      isAnnual === annual ? "#fff" : T.muted,
                  }}
                >
                  {label}
                  {annual && (
                    <span style={{
                      background: "#dcfce7", color: "#16a34a",
                      fontSize: 11, fontWeight: 800, padding: "3px 10px",
                      borderRadius: 100, fontFamily: "'DM Mono',monospace",
                    }}>
                      Save 30%
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            PRICING CARDS
        ══════════════════════════════════════ */}
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "56px 32px 80px" }}>
          <div
            className="cards-grid"
            style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}
          >
            {plans.map((plan) => (
              <div key={plan.id} className={`pricing-card ${plan.popular ? "popular" : ""}`}>

                {/* Popular badge */}
                {plan.popular && (
                  <div style={{
                    position: "absolute", top: -15, left: "50%", transform: "translateX(-50%)",
                    background: T.orange, color: "#fff", fontSize: 12, fontWeight: 800,
                    padding: "6px 20px", borderRadius: 100, whiteSpace: "nowrap",
                    fontFamily: "'Plus Jakarta Sans',sans-serif", letterSpacing: "0.04em",
                    boxShadow: "0 4px 16px rgba(249,115,22,0.4)",
                  }}>
                    ⚡ Most Popular
                  </div>
                )}

                {/* Plan name */}
                <div style={{
                  fontSize: 10, fontWeight: 800, letterSpacing: "0.14em",
                  textTransform: "uppercase", fontFamily: "'DM Mono',monospace",
                  color: plan.popular ? "#f07a36" : plan.accentColor,
                  marginBottom: 18,
                }}>
                  {plan.name}
                </div>

                {/* Price */}
                <div style={{ display: "flex", alignItems: "flex-end", gap: 4, marginBottom: 4 }}>
                  <span style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.7, color: plan.popular ? "#fff" : T.navy }}>₹</span>
                  <span style={{
                    fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 900,
                    fontSize: 52, lineHeight: 1, letterSpacing: "-2px",
                    color: plan.popular ? "#fff" : T.navy,
                  }}>
                    {fmt(isAnnual ? plan.annualPrice : plan.monthlyPrice)}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: plan.popular ? "rgba(255,255,255,0.6)" : T.muted, marginBottom: 14, fontFamily: "'Sora',sans-serif" }}>
                  {plan.period}
                </div>

                <p style={{ fontSize: 14, lineHeight: 1.65, marginBottom: 24, fontFamily: "'Sora',sans-serif", minHeight: 48, color: plan.popular ? "rgba(255,255,255,0.75)" : T.muted }}>
                  {plan.desc}
                </p>

                <hr style={{ border: "none", borderTop: `1px solid ${plan.popular ? "rgba(255,255,255,0.15)" : T.border}`, margin: "0 0 22px" }} />

                {/* Features */}
                <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
                  {plan.features.map((f, i) => (
                    <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, fontFamily: "'Sora',sans-serif", lineHeight: 1.5 }}>
                      <span style={{
                        fontWeight: 800, flexShrink: 0, marginTop: 1, fontSize: 13,
                        color: f.included
                          ? plan.popular ? "#f07a36" : plan.accentColor
                          : plan.popular ? "rgba(255,255,255,0.25)" : "#d1d5db",
                      }}>
                        {f.included ? "✓" : "✕"}
                      </span>
                      <span style={{ color: plan.popular ? (f.included ? "#fff" : "rgba(255,255,255,0.4)") : (f.included ? T.text : T.muted2) }}>
                        {f.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                {plan.ctaType === "outline" && (
                  <button
                    style={{ width: "100%", padding: "14px", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer", background: "transparent", border: `1.5px solid ${T.border}`, color: T.navy, fontFamily: "'Plus Jakarta Sans',sans-serif", transition: "all .2s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = T.orange; e.currentTarget.style.color = T.orange; e.currentTarget.style.background = T.orangeL; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = T.border;  e.currentTarget.style.color = T.navy;   e.currentTarget.style.background = "transparent"; }}
                  >{plan.cta}</button>
                )}
                {plan.ctaType === "primary" && (
                  <button
                    style={{ width: "100%", padding: "14px", borderRadius: 12, fontSize: 14, fontWeight: 800, cursor: "pointer", background: `linear-gradient(135deg,${T.orange},#fb923c)`, border: "none", color: "#fff", fontFamily: "'Plus Jakarta Sans',sans-serif", boxShadow: "0 6px 20px rgba(249,115,22,0.35)", transition: "all .2s" }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 28px rgba(249,115,22,0.5)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)";    e.currentTarget.style.boxShadow = "0 6px 20px rgba(249,115,22,0.35)"; }}
                  >{plan.cta}</button>
                )}
                {plan.ctaType === "navy" && (
                  <button
                    style={{ width: "100%", padding: "14px", borderRadius: 12, fontSize: 14, fontWeight: 800, cursor: "pointer", background: `linear-gradient(135deg,${T.navy},#263059)`, border: "none", color: "#fff", fontFamily: "'Plus Jakarta Sans',sans-serif", boxShadow: "0 6px 20px rgba(26,35,64,0.25)", transition: "all .2s" }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
                  >{plan.cta}</button>
                )}
              </div>
            ))}
          </div>

          {/* Trust strip */}
          <div className="trust-strip" style={{ display: "flex", justifyContent: "center", gap: 32, flexWrap: "wrap", marginTop: 40 }}>
            {[
              "🔒 Secure Payments via Razorpay",
              "↩️ 7-Day Money-Back Guarantee",
              "📜 Certificate Included",
              "🎓 Learn at Your Own Pace",
            ].map((item, i) => (
              <span key={i} style={{ fontSize: 13, fontWeight: 600, color: T.muted, fontFamily: "'Sora',sans-serif" }}>
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════
            GUARANTEE
        ══════════════════════════════════════ */}
        <div className="guarantee-box" style={{
          background: T.navy, color: "#fff", borderRadius: 24,
          textAlign: "center", padding: "64px 32px",
          maxWidth: 1100, margin: "0 auto 80px",
        }}>
          {/* Floating icon */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", inset: -10, borderRadius: "50%", background: T.orange, opacity: 0.12, animation: "ringOut 3s ease-out infinite" }} />
              <div style={{
                width: 72, height: 72, borderRadius: 20,
                background: "rgba(249,115,22,0.18)", border: "2px solid rgba(249,115,22,0.4)",
                display: "flex", alignItems: "center", justifyContent: "center",
                animation: "float 4.5s ease-in-out infinite", fontSize: 34,
              }}>
                🛡️
              </div>
            </div>
          </div>

          <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 900, fontSize: "clamp(26px,4vw,40px)", letterSpacing: "-1px", marginBottom: 14 }}>
            100%{" "}
            <span style={{ background: `linear-gradient(135deg,${T.orange},#fb923c)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Money-Back
            </span>{" "}
            Guarantee
          </h2>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 16, maxWidth: 460, margin: "0 auto 36px", lineHeight: 1.82, fontFamily: "'Sora',sans-serif" }}>
            Not satisfied within 7 days? We'll refund every rupee — no questions asked.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            
            <button style={{
              display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px",
              background: "transparent", color: "#fff", fontWeight: 700, fontSize: 14,
              borderRadius: 12, border: "1.5px solid rgba(255,255,255,0.25)", cursor: "pointer",
              fontFamily: "'Plus Jakarta Sans',sans-serif", transition: "all .2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; }}
            >
              Talk to an Advisor
            </button>
          </div>
        </div>

        {/* ══════════════════════════════════════
            FAQ
        ══════════════════════════════════════ */}
        <section style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px 100px" }}>
          <div style={{ textAlign: "center", fontSize: 10, fontWeight: 800, color: T.orange, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "'DM Mono',monospace", marginBottom: 12 }}>
            Got Questions?
          </div>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 900, fontSize: "clamp(26px,4vw,36px)", textAlign: "center", color: T.navy, letterSpacing: "-1px", marginBottom: 40 }}>
            Frequently Asked Questions
          </h2>

          {faqs.map((faq, i) => (
            <div key={i} className={`faq-card ${openFaq === i ? "open" : ""}`} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", gap: 16 }}>
                <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 15, color: T.navy }}>
                  {faq.q}
                </span>
                <div style={{
                  width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
                  border: `1.5px solid ${openFaq === i ? T.orange : T.border}`,
                  background: openFaq === i ? T.orangeL : T.cream2,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18, color: openFaq === i ? T.orange : T.muted,
                  transition: "all .25s", transform: openFaq === i ? "rotate(45deg)" : "rotate(0deg)",
                }}>
                  +
                </div>
              </div>
              <div style={{ maxHeight: openFaq === i ? "300px" : "0", overflow: "hidden", transition: "max-height 0.35s ease" }}>
                <div style={{ padding: "0 24px 20px", fontSize: 14, color: T.muted, lineHeight: 1.8, fontFamily: "'Sora',sans-serif", fontWeight: 500 }}>
                  {faq.a}
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* ══════════════════════════════════════
            BOTTOM BAR — identical to PrivacyPolicy
        ══════════════════════════════════════ */}
        <div className="bottom-bar">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <a href="/" style={{ textDecoration: "none" }}>
              <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 22, fontWeight: 900, letterSpacing: "-0.5px" }}>
                <span style={{ color: T.green }}>ILM</span>
                <span style={{ color: T.orange, marginLeft: 5 }}>ORA</span>
              </span>
            </a>
            <span style={{ color: T.muted2, fontWeight: 600, fontSize: 13, fontFamily: "'Sora',sans-serif" }}>
              © 2026 ILM ORA. All rights reserved.
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <Lock size={12} color={T.muted2} strokeWidth={2.2} />
            <span style={{ fontSize: 13, color: T.muted2, fontWeight: 600, fontFamily: "'Sora',sans-serif" }}>
              Secure &amp; Privacy-First Platform
            </span>
          </div>
        </div>

      </div>
    </>
  );
}