import { useState, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import PublicLayout from "../Landing/components/PublicLayout";
/* ── Design tokens ── */
/* Brand/accent colors stay fixed across both themes (identical to PrivacyPolicy.jsx) */
const BRAND = {
  navy:    "#1a2340", // fixed dark-navy accent blocks (popular card, guarantee box, toast, navy CTA)
  orange:  "#f97316",
  orangeL: "#fff3e8",
  orangeB: "#fcd4a8",
  green:   "#16a34a",
  indigo:  "#6366f1",
  white:   "#ffffff",
};

/* Surface/text colors DO change with the theme toggle */
const THEMES = {
  light: {
    cream:   "#fdf6ee",
    cream2:  "#f5ede0",
    cream3:  "#fbeee0",
    surface: "#ffffff",   // page/card background (was T.white)
    heading: "#1a2340",   // headings & body text on the page surface (was T.navy used as text)
    text:    "#1e293b",
    muted:   "#475569",
    muted2:  "#64748b",
    border:  "#e5d9c8",
    borderM: "#d5c4aa",
  },
  dark: {
    cream:   "#0f1420",
    cream2:  "#161c2b",
    cream3:  "#0b0e16",
    surface: "#161c2c",
    heading: "#f5f7fb",
    text:    "#e2e8f0",
    muted:   "#a7b0c0",
    muted2:  "#8b93a6",
    border:  "#242c40",
    borderM: "#2d3652",
  },
};

/* Builds the scoped stylesheet for the given theme's tokens */
function buildStyles(T) {
  return `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&family=Sora:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

/*
  Scoped to .pricing-page only — this file no longer renders its own
  navbar/footer (those come from PublicLayout: AnnouncementBanner →
  Navbar → {children} → Footer), so these rules must not leak out and
  affect those shared components. Previously some of these were
  unscoped/global (*, html, body) which could bleed into the shared
  Navbar/Banner/Footer markup rendered alongside this page.
*/
.pricing-page, .pricing-page *, .pricing-page *::before, .pricing-page *::after {
  box-sizing: border-box;
}
.pricing-page { background: ${T.cream3}; -webkit-font-smoothing: antialiased; }
.pricing-page ::-webkit-scrollbar { width: 4px; }
.pricing-page ::-webkit-scrollbar-track { background: ${T.cream2}; }
.pricing-page ::-webkit-scrollbar-thumb { background: ${T.orange}80; border-radius: 4px; }
.pricing-page a { text-decoration: none; transition: color 0.18s; }

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

/* ── Pricing card ── */
.pricing-card {
  background: ${T.surface}; border: 1.5px solid ${T.border};
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
  background: ${T.surface}; border: 1.5px solid ${T.border};
  border-radius: 16px; margin-bottom: 10px; overflow: hidden;
  cursor: pointer; transition: border-color 0.2s, box-shadow 0.2s;
}
.faq-card:hover { border-color: rgba(249,115,22,0.35); box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
.faq-card.open { border-color: rgba(249,115,22,0.45); box-shadow: 0 6px 28px rgba(249,115,22,0.08); }

@media(max-width:960px){
  .cards-grid { grid-template-columns: 1fr !important; }
  .nav-links { display: none !important; }
  .pp-nav { padding: 0 16px; }
  .guarantee-box { margin: 0 16px 60px !important; padding: 48px 24px !important; }
}
@media(max-width:600px){
  .trust-strip { flex-direction: column; align-items: center; gap: 12px !important; }
}
`;
}

const studentPlans = [
  {
    id: "student-starter",
    name: "Starter",
    monthlyPrice: 0,
    annualPrice: 0,
    period: "Free forever",
    desc: "Perfect for exploring ILM ORA and getting a feel for our platform.",
    cta: "Get Started Free",
    ctaType: "outline",
    popular: false,
    accentColor: BRAND.green,
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
    id: "student-pro",
    name: "Pro Learner",
    monthlyPrice: 1499,
    annualPrice: 999,
    period: "/month · billed as shown",
    desc: "For professionals serious about mastering Product, Design, Growth & Marketing.",
    cta: "Start Learning →",
    ctaType: "primary",
    popular: true,
    accentColor: BRAND.orange,
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
    id: "student-elite",
    name: "Elite",
    monthlyPrice: 3999,
    annualPrice: 2799,
    period: "/month · billed as shown",
    desc: "For those who want industry-expert mentorship and guaranteed career outcomes.",
    cta: "Go Elite →",
    ctaType: "navy",
    popular: false,
    accentColor: BRAND.indigo,
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

const trainerPlans = [
  {
    id: "trainer-basic",
    name: "Trainer Basic",
    monthlyPrice: 0,
    annualPrice: 0,
    period: "Free forever",
    desc: "Get started teaching on ILM ORA with essential tools.",
    cta: "Get Started Free",
    ctaType: "outline",
    popular: false,
    accentColor: BRAND.green,
    features: [
      { text: "Create up to 2 batches",        included: true  },
      { text: "Basic attendance & reports",    included: true  },
      { text: "Community support",             included: true  },
      { text: "Upload recorded classes",       included: true  },
      { text: "AI Companion for content",      included: false },
      { text: "Live session analytics",        included: false },
      { text: "Payout priority processing",    included: false },
    ],
  },
  {
    id: "trainer-elite",
    name: "Trainer Elite",
    monthlyPrice: 1299,
    annualPrice: 899,
    period: "/month · billed as shown",
    desc: "For trainers who want to scale batches and earnings with AI tools.",
    cta: "Go Elite →",
    ctaType: "primary",
    popular: true,
    accentColor: BRAND.orange,
    features: [
      { text: "Unlimited batches",              included: true },
      { text: "AI Companion for content & quiz", included: true },
      { text: "Advanced performance analytics",  included: true },
      { text: "Live session tools & recordings", included: true },
      { text: "Priority payouts",                included: true },
      { text: "Skill map builder",                included: true },
      { text: "Dedicated trainer success manager", included: false },
    ],
  },
  {
    id: "trainer-pro-plus",
    name: "Trainer Pro+",
    monthlyPrice: 2999,
    annualPrice: 2099,
    period: "/month · billed as shown",
    desc: "For top trainers running multiple cohorts with a dedicated success manager.",
    cta: "Go Pro+ →",
    ctaType: "navy",
    popular: false,
    accentColor: BRAND.indigo,
    features: [
      { text: "Everything in Trainer Elite",      included: true },
      { text: "Dedicated trainer success manager", included: true },
      { text: "Co-marketing & featured placement", included: true },
      { text: "Custom branded classroom",          included: true },
      { text: "Early access to new tools",          included: true },
      { text: "Highest revenue share tier",         included: true },
      { text: "1-on-1 strategy sessions",            included: true },
    ],
  },
];

const businessPlans = [
  {
    id: "business-starter",
    name: "Business Starter",
    monthlyPrice: 0,
    annualPrice: 0,
    period: "Free forever",
    desc: "Try ILM ORA for Business with a small team before scaling up.",
    cta: "Get Started Free",
    ctaType: "outline",
    popular: false,
    accentColor: BRAND.green,
    features: [
      { text: "Up to 10 employee seats",     included: true  },
      { text: "Basic org dashboard",          included: true  },
      { text: "Assign from course catalog",   included: true  },
      { text: "Email support",                included: true  },
      { text: "Advanced analytics & ROI",     included: false },
      { text: "Multiple branches",            included: false },
      { text: "Dedicated account manager",    included: false },
    ],
  },
  {
    id: "business-pro",
    name: "Business Pro",
    monthlyPrice: 8999,
    annualPrice: 6299,
    period: "/month · billed as shown",
    desc: "For growing organizations training teams across departments.",
    cta: "Go Pro →",
    ctaType: "primary",
    popular: true,
    accentColor: BRAND.orange,
    features: [
      { text: "Up to 200 employee seats",        included: true },
      { text: "Advanced analytics & ROI tracking", included: true },
      { text: "Multiple branches & departments",   included: true },
      { text: "Bulk batch creation",                included: true },
      { text: "Priority support",                   included: true },
      { text: "Custom reports for leadership",       included: true },
      { text: "Dedicated account manager",           included: false },
    ],
  },
  {
    id: "business-enterprise",
    name: "Enterprise",
    monthlyPrice: 24999,
    annualPrice: 17499,
    period: "/month · billed as shown",
    desc: "For large enterprises needing unlimited scale and dedicated support.",
    cta: "Contact Sales →",
    ctaType: "navy",
    popular: false,
    accentColor: BRAND.indigo,
    features: [
      { text: "Unlimited employee seats",       included: true },
      { text: "Unlimited branches & departments", included: true },
      { text: "Dedicated account manager",        included: true },
      { text: "Custom integrations & SSO",         included: true },
      { text: "SLA-backed priority support",       included: true },
      { text: "Co-branded certification programs", included: true },
      { text: "Quarterly business reviews",         included: true },
    ],
  },
];

const partnershipPlans = [
  {
    id: "partnership-starter",
    name: "Partner Starter",
    monthlyPrice: 0,
    annualPrice: 0,
    period: "Free forever",
    desc: "Explore co-branded partnership opportunities with ILM ORA.",
    cta: "Get Started Free",
    ctaType: "outline",
    popular: false,
    accentColor: BRAND.green,
    features: [
      { text: "1 active partnership program",  included: true  },
      { text: "Basic lead tracking",            included: true  },
      { text: "Co-branded course (1)",          included: true  },
      { text: "Community support",              included: true  },
      { text: "Revenue sharing dashboard",      included: false },
      { text: "Marketing co-promotion",         included: false },
      { text: "Dedicated partnership manager",  included: false },
    ],
  },
  {
    id: "partnership-growth",
    name: "Partner Growth",
    monthlyPrice: 4999,
    annualPrice: 3499,
    period: "/month · billed as shown",
    desc: "For partners actively growing leads, co-branded courses and revenue.",
    cta: "Grow With Us →",
    ctaType: "primary",
    popular: true,
    accentColor: BRAND.orange,
    features: [
      { text: "Up to 5 active programs",       included: true },
      { text: "Full revenue sharing dashboard", included: true },
      { text: "Co-branded courses (up to 5)",   included: true },
      { text: "Lead pipeline & reports",         included: true },
      { text: "Marketing co-promotion",          included: true },
      { text: "Priority certification issuance",  included: true },
      { text: "Dedicated partnership manager",    included: false },
    ],
  },
  {
    id: "partnership-elite",
    name: "Partner Elite",
    monthlyPrice: 12999,
    annualPrice: 8999,
    period: "/month · billed as shown",
    desc: "For strategic partners running large-scale joint certification programs.",
    cta: "Go Elite →",
    ctaType: "navy",
    popular: false,
    accentColor: BRAND.indigo,
    features: [
      { text: "Unlimited active programs",         included: true },
      { text: "Unlimited co-branded courses",        included: true },
      { text: "Dedicated partnership manager",       included: true },
      { text: "Highest revenue share tier",          included: true },
      { text: "Featured placement on ILM ORA",       included: true },
      { text: "Joint marketing campaigns",           included: true },
      { text: "Quarterly strategy reviews",           included: true },
    ],
  },
];

const PLAN_SETS = {
  student: { label: "Student", plans: studentPlans },
  trainer: { label: "Trainer", plans: trainerPlans },
  business: { label: "Business", plans: businessPlans },
  partnership: { label: "Partnership", plans: partnershipPlans },
};

const faqs = [
  { q: "Can I switch plans anytime?",               a: "Yes! You can upgrade or downgrade your plan at any time from your account settings. Changes take effect from your next billing cycle." },
  { q: "Are the courses taught in Hindi or English?", a: "Our courses are available in both Hindi and English. Each course listing clearly indicates the language of instruction so you can choose what suits you best." },
  { q: "What payment methods are accepted?",        a: "We accept UPI, Debit/Credit cards, Net Banking, and EMI options via Razorpay. All payments are secured with 256-bit SSL encryption." },
  { q: "Do I get lifetime access to course content?", a: "Pro and Elite subscribers have access to all content as long as their subscription is active. Certificates earned remain yours permanently even after cancellation." },
  { q: "Is there a student discount available?",    a: "Yes! Students with a valid .edu email or college ID can get an additional 20% off on Pro and Elite plans. Contact our support team to apply the discount." },
];

const fmt = (n) => (n === 0 ? "0" : n.toLocaleString("en-IN"));

export default function Pricing({ theme, toggleTheme, setShowLoginModal }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get("returnTo");
  const [isAnnual, setIsAnnual] = useState(false);
  const [openFaq,  setOpenFaq]  = useState(null);
  const [toast, setToast] = useState({ msg: "", show: false });

  /* Theme-aware tokens: fixed brand colors + the light/dark surface set
     picked by the `theme` prop passed down from App.jsx. This is what
     makes the whole page (not just the shared Navbar/Footer) respond
     to the light/dark toggle. */
  const isDarkTheme = theme === "dark";
  const T = { ...BRAND, ...THEMES[isDarkTheme ? "dark" : "light"] };
  const STYLES = buildStyles(T);

  /* Resolve which plan-set to show based on logged-in user's role */
  const storedRole = (localStorage.getItem("role") || "student").toLowerCase();
  const roleKey = ["tenant_admin", "admin", "business"].includes(storedRole)
    ? "business"
    : ["trainer"].includes(storedRole)
      ? "trainer"
      : ["partnership"].includes(storedRole)
        ? "partnership"
        : "student";
  const activePlanSet = PLAN_SETS[roleKey];
  const plans = activePlanSet.plans;

  const showToast = (msg) => {
    setToast({ msg, show: true });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 2400);
  };

  const handleChoosePlan = (plan) => {
    // Placeholder until the backend "save selected plan" endpoint exists.
    // TODO: replace with a real API call, e.g. userService.selectPlan(plan.id)
    localStorage.setItem("selectedPlan", plan.id);
    showToast(`"${plan.name}" selected!`);

    // Visitors picking a plan aren't logged in yet — open the shared
    // Login/Signup modal (App.jsx's AuthModals) instead of silently
    // redirecting home. Guard in case a caller ever renders this page
    // without the prop wired up.
    if (typeof setShowLoginModal === "function") {
      setShowLoginModal(true);
    } else {
      setTimeout(() => {
        navigate(returnTo || "/");
      }, 700);
    }
  };

  /* Scroll to top on route change — same as PrivacyPolicy */
  useEffect(() => { window.scrollTo({ top: 0 }); }, [pathname]);

  return (
  <>
    <style>{STYLES}</style>

    <PublicLayout
      theme={theme}
      toggleTheme={toggleTheme}
      setShowLoginModal={setShowLoginModal}
    >
      <div
        style={{
          minHeight: "100vh",
          background: T.cream3,
          fontFamily: "'Sora','Plus Jakarta Sans',sans-serif",
          color: T.text,
        }}
      >
        

        {/* ══════════════════════════════════════
            HERO
        ══════════════════════════════════════ */}
       <section
  style={{
    textAlign: "center",
    padding: "48px 20px 56px",
    borderBottom: `1px solid ${T.border}`,
  }}
>
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
              color: T.heading, lineHeight: 1.06, letterSpacing: "-2px",
              marginBottom: 20, animation: "fadeUp 0.52s 0.12s ease both",
            }}>
              Invest in Your{" "}
              <span style={{ background: `linear-gradient(135deg,${T.orange},#fb923c)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Top 1%
              </span>{" "}
              Future
            </h1>

            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              fontSize: 12.5, fontWeight: 700, color: T.muted, marginBottom: 8,
              fontFamily: "'Sora',sans-serif",
            }}>
              Showing plans for{" "}
              <span style={{ color: T.orange, fontWeight: 800 }}>{activePlanSet.label}</span>
            </div>

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
              background: T.surface, border: `1.5px solid ${T.border}`,
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
                  <span style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.7, color: plan.popular ? "#fff" : T.heading }}>₹</span>
                  <span style={{
                    fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 900,
                    fontSize: 52, lineHeight: 1, letterSpacing: "-2px",
                    color: plan.popular ? "#fff" : T.heading,
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
                    onClick={() => handleChoosePlan(plan)}
                    style={{ width: "100%", padding: "14px", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer", background: "transparent", border: `1.5px solid ${T.border}`, color: T.heading, fontFamily: "'Plus Jakarta Sans',sans-serif", transition: "all .2s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = T.orange; e.currentTarget.style.color = T.orange; e.currentTarget.style.background = T.orangeL; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = T.border;  e.currentTarget.style.color = T.heading;   e.currentTarget.style.background = "transparent"; }}
                  >{plan.cta}</button>
                )}
                {plan.ctaType === "primary" && (
                  <button
                    onClick={() => handleChoosePlan(plan)}
                    style={{ width: "100%", padding: "14px", borderRadius: 12, fontSize: 14, fontWeight: 800, cursor: "pointer", background: `linear-gradient(135deg,${T.orange},#fb923c)`, border: "none", color: "#fff", fontFamily: "'Plus Jakarta Sans',sans-serif", boxShadow: "0 6px 20px rgba(249,115,22,0.35)", transition: "all .2s" }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 28px rgba(249,115,22,0.5)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)";    e.currentTarget.style.boxShadow = "0 6px 20px rgba(249,115,22,0.35)"; }}
                  >{plan.cta}</button>
                )}
                {plan.ctaType === "navy" && (
                  <button
                    onClick={() => handleChoosePlan(plan)}
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
          <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 900, fontSize: "clamp(26px,4vw,36px)", textAlign: "center", color: T.heading, letterSpacing: "-1px", marginBottom: 40 }}>
            Frequently Asked Questions
          </h2>

          {faqs.map((faq, i) => (
            <div key={i} className={`faq-card ${openFaq === i ? "open" : ""}`} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", gap: 16 }}>
                <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 15, color: T.heading }}>
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

        {/* Toast */}
        <div style={{
          position: "fixed", bottom: 28, left: "50%",
          transform: `translateX(-50%) translateY(${toast.show ? "0" : "20px"})`,
          background: T.navy, color: "#fff", padding: "14px 24px", borderRadius: 12,
          fontSize: "0.84rem", fontWeight: 600, boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
          zIndex: 2000, opacity: toast.show ? 1 : 0, transition: "0.3s",
          pointerEvents: "none", whiteSpace: "nowrap", fontFamily: "'Sora',sans-serif",
        }}>
          {toast.msg}
        </div>

      </div>
      </PublicLayout>
    </>
  );
}