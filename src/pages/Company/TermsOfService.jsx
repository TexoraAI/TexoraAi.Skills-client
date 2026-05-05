import React, { useState, useEffect, useRef } from "react";
import {
  Handshake, Monitor, User, BookOpen, CreditCard,
  AlertTriangle, Shield, RefreshCw, Scale, ChevronDown,
  Mail, Globe, Lock, CheckCircle2, ArrowLeft,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   ILM ORA  ·  TERMS OF SERVICE
   Colors from ilm.ora.texora.ai screenshot:
     BG:     #fbeee0  (warm cream peach — exact match)
     Navy:   #1a2340  (dark heading text)
     Orange: #F97316  (ORA color, accent)
     Green:  #16a34a  (ILM color)
     Muted:  #5a6173  (body/sub text)
     White:  #ffffff
     Border: #e8d9c4
═══════════════════════════════════════════════════════════ */

const C = {
  bg:          "#fbeee0",
  bgCard:      "#ffffff",
  bgSub:       "#fdf5ec",
  bgSubDark:   "#f5e8d5",
  border:      "#e8d9c4",
  borderMid:   "#d5c4aa",
  navy:        "#1a2340",
  navyLight:   "#2d3a5c",
  orange:      "#F97316",
  orangeHov:   "#ea6b0e",
  orangeLight: "#fff3e8",
  orangeBorder:"#fcd4a8",
  green:       "#16a34a",
  greenLight:  "#e8f5ef",
  greenBorder: "#a3d9bc",
  teal:        "#0d9488",
  rose:        "#e11d48",
  roseLight:   "#fef2f4",
  amber:       "#d97706",
  pink:        "#db2777",
  muted:       "#5a6173",
  muted2:      "#8a93a8",
  white:       "#ffffff",
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Sora:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;font-size:16px;}
body{background:${C.bg};-webkit-font-smoothing:antialiased;}

::-webkit-scrollbar{width:4px;}
::-webkit-scrollbar-track{background:${C.bgSub};}
::-webkit-scrollbar-thumb{background:${C.orange}80;border-radius:4px;}

a{color:${C.orange};text-decoration:none;font-weight:600;transition:color 0.18s;}
a:hover{color:${C.orangeHov};}

@keyframes fadeUp{
  from{opacity:0;transform:translateY(18px);}
  to{opacity:1;transform:translateY(0);}
}
@keyframes blink{0%,100%{opacity:1;}50%{opacity:0.4;}}
@keyframes floatY{0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);}}
@keyframes ringOut{from{transform:scale(1);opacity:0.5;}to{transform:scale(1.65);opacity:0;}}
@keyframes slideIn{from{opacity:0;transform:translateY(22px);}to{opacity:1;transform:translateY(0);}}

/* Navbar */
.ora-nav{
  position:sticky;top:0;z-index:100;
  background:${C.white};
  border-bottom:1px solid ${C.border};
  padding:0 32px;height:68px;
  display:flex;align-items:center;justify-content:space-between;
  box-shadow:0 2px 16px rgba(26,35,64,0.05);
}
.ora-logo{
  font-family:'Plus Jakarta Sans',sans-serif;
  font-size:26px;font-weight:900;
  letter-spacing:-0.5px;flex-shrink:0;
}
.ora-logo .ilm{color:${C.green};}
.ora-logo .ora{color:${C.orange};margin-left:6px;}
.nav-center{
  font-family:'Plus Jakarta Sans',sans-serif;
  font-size:13.5px;font-weight:600;color:${C.muted};
  letter-spacing:0.01em;
}
.nav-back{
  display:flex;align-items:center;gap:7px;
  font-family:'Plus Jakarta Sans',sans-serif;
  font-size:13px;font-weight:700;color:${C.navy};
  padding:9px 18px;border-radius:10px;
  background:${C.bgSub};border:1.5px solid ${C.border};
  transition:border-color 0.18s,color 0.18s,background 0.18s;
  cursor:pointer;text-decoration:none;
}
.nav-back:hover{border-color:${C.orange};color:${C.orange};background:${C.orangeLight};}

/* Section card */
.sec-card{
  background:${C.bgCard};
  border:1.5px solid ${C.border};
  border-radius:16px;overflow:hidden;
  cursor:pointer;
  transition:border-color 0.25s,box-shadow 0.25s,transform 0.2s;
}
.sec-card:hover{
  box-shadow:0 8px 36px rgba(0,0,0,0.07);
  transform:translateY(-2px);
}
.sec-card.open{
  box-shadow:0 10px 40px rgba(0,0,0,0.08);
}

/* TOC button */
.toc-btn{
  display:flex;align-items:center;gap:10px;
  width:100%;padding:10px 14px;
  background:none;border:none;border-radius:10px;
  font-family:'Sora',sans-serif;font-size:12.5px;
  color:${C.muted};cursor:pointer;text-align:left;
  transition:background 0.18s,color 0.18s,padding-left 0.2s;
}
.toc-btn:hover{background:${C.bgSub};color:${C.navy};padding-left:18px;}
.toc-btn.active{
  background:${C.orangeLight};color:${C.orange};font-weight:600;
  border-left:3px solid ${C.orange};
  border-radius:0 10px 10px 0;padding-left:11px;
}

/* Point row */
.pt-row{
  display:flex;gap:12px;align-items:flex-start;
  padding:5px 0;font-family:'Sora',sans-serif;
  font-size:13.5px;line-height:1.75;
  color:${C.muted};transition:color 0.18s;
}
.pt-row:hover{color:${C.navy};}

/* Buttons */
.btn-primary{
  display:inline-flex;align-items:center;gap:8px;
  padding:13px 30px;
  background:linear-gradient(135deg,${C.orange},#fb923c);
  color:#fff;font-weight:800;font-size:14px;
  border-radius:12px;border:none;cursor:pointer;
  font-family:'Plus Jakarta Sans',sans-serif;
  text-decoration:none;
  box-shadow:0 6px 24px ${C.orange}35;
  transition:transform 0.18s,box-shadow 0.18s;
}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 12px 36px ${C.orange}50;color:#fff;}
.btn-ghost{
  display:inline-flex;align-items:center;gap:8px;
  padding:12px 26px;background:transparent;
  color:${C.navy};font-weight:700;font-size:14px;
  border-radius:12px;border:1.5px solid ${C.borderMid};
  cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;
  text-decoration:none;transition:border-color 0.18s,background 0.18s,color 0.18s;
}
.btn-ghost:hover{border-color:${C.orange};background:${C.orangeLight};color:${C.orange};}

/* ── RESPONSIVE ── */
@media(max-width:1024px){
  .layout-grid{grid-template-columns:1fr !important;}
  .sidebar-col{display:none !important;}
  .ora-nav{padding:0 20px;}
  .nav-center{display:none;}
}
@media(max-width:768px){
  .hero-section{padding:56px 20px 52px !important;}
  .hero-title{font-size:36px !important;letter-spacing:-1.5px !important;}
  .hero-sub{font-size:14.5px !important;}
  .meta-pills{gap:8px !important;}
  .meta-pill{padding:7px 12px !important;font-size:12px !important;}
  .stats-grid{grid-template-columns:1fr 1fr !important;}
  .stat-cell-inner{padding:22px 12px !important;}
  .stat-num{font-size:32px !important;}
  .layout-grid{padding:28px 16px 64px !important;gap:0 !important;}
  .sec-card-head{padding:16px 16px !important;gap:12px !important;}
  .sec-card-body{padding:0 16px 20px !important;}
  .subsec-grid{grid-template-columns:1fr !important;}
  .subsec-span{grid-column:1 !important;}
  .cta-section{padding:64px 16px !important;}
  .cta-btns{flex-direction:column;align-items:center;}
  .contact-grid{grid-template-columns:1fr !important;}
  .bottom-bar-inner{flex-direction:column !important;text-align:center;gap:10px !important;}
  .notice-wrap{flex-direction:column;gap:10px !important;}
}
@media(max-width:480px){
  .hero-title{font-size:28px !important;letter-spacing:-1px !important;}
  .ora-logo{font-size:20px !important;}
  .sec-icon-box{width:40px !important;height:40px !important;border-radius:11px !important;}
  .sec-title{font-size:13.5px !important;}
  .sec-summary{display:none !important;}
  .stats-grid{border-radius:0 0 14px 14px !important;}
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
const SectionCard = ({ data, idx }) => {
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
                color: data.color, opacity: 0.65, fontWeight: 500,
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
                  fontWeight: 800, fontSize: 15.5, color: C.navy,
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

/* ══════════════ MAIN ══════════════ */
export default function TermsOfService() {
  const [statsOn, setStatsOn] = useState(false);
  const statsRef = useRef();
  const active = useActive();

  useEffect(() => {
    window.scrollTo({ top: 0 });
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setStatsOn(true); },
      { threshold: 0.2 }
    );
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  const scrollTo = id =>
    document.getElementById("s-" + id)?.scrollIntoView({ behavior: "smooth", block: "start" });

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
    <>
      <style>{CSS}</style>
      <div style={{
        minHeight: "100vh",
        background: C.bg,
        color: C.navy,
        fontFamily: "'Sora', 'Plus Jakarta Sans', system-ui, sans-serif",
      }}>

        {/* ══ NAVBAR ══ */}
       
    <nav className="ora-nav">
    <a href="/" className="ora-logo" style={{ textDecoration: "none" }}>
    <span className="ilm">ILM</span>
    <span className="ora">ORA</span>
    </a>
  </nav>
        {/* ══ HERO ══ */}
        <section
          className="hero-section"
          style={{
            padding: "76px 32px 70px",
            textAlign: "center",
            background: C.bg,
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          <div style={{ maxWidth: 660, margin: "0 auto" }}>

            {/* Badge */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 9,
              padding: "8px 22px", borderRadius: 999,
              background: C.orangeLight, border: `1.5px solid ${C.orangeBorder}`,
              marginBottom: 30,
              animation: "fadeUp 0.5s 0.05s ease both",
            }}>
              <div style={{
                width: 7, height: 7, borderRadius: "50%",
                background: C.orange,
                animation: "blink 2.4s ease-in-out infinite",
              }} />
              <span style={{
                fontSize: 12, fontWeight: 700, color: C.orange,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                letterSpacing: "0.06em",
              }}>
                LEGAL DOCUMENT
              </span>
            </div>

            {/* Title */}
            <h1
              className="hero-title"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 60, fontWeight: 900,
                color: C.navy, lineHeight: 1.04,
                letterSpacing: "-2.2px", marginBottom: 22,
                animation: "fadeUp 0.52s 0.1s ease both",
              }}
            >
              Terms of{" "}
              <span style={{
                background: `linear-gradient(135deg, ${C.orange}, #fb923c)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>Service</span>
            </h1>

            {/* Subtitle */}
            <p
              className="hero-sub"
              style={{
                fontSize: 16, color: C.muted, lineHeight: 1.85,
                maxWidth: 480, margin: "0 auto 38px",
                fontFamily: "'Sora', sans-serif",
                animation: "fadeUp 0.52s 0.16s ease both",
              }}
            >
              These Terms govern your use of ILM ORA's AI-powered learning
              platform. By using our Service, you agree to be bound by these terms.
            </p>

            {/* Meta pills */}
            <div
              className="meta-pills"
              style={{
                display: "flex", gap: 12,
                justifyContent: "center", flexWrap: "wrap",
                animation: "fadeUp 0.52s 0.22s ease both",
              }}
            >
              {[
                { label: "Effective", val: "Feb 2, 2026", icon: "📅" },
                { label: "Updated",   val: "Feb 2, 2026", icon: "🔄" },
                { label: "Version",   val: "2.0.1",       icon: "📋" },
              ].map((m, i) => (
                <div
                  key={i}
                  className="meta-pill"
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "9px 18px", borderRadius: 10,
                    background: C.white, border: `1.5px solid ${C.border}`,
                    fontSize: 13, boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  <span style={{ fontSize: 15 }}>{m.icon}</span>
                  <span style={{ color: C.muted }}>{m.label}:</span>
                  <span style={{
                    color: C.navy, fontWeight: 700,
                    fontFamily: "'DM Mono', monospace", fontSize: 12,
                  }}>{m.val}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ STATS BAR ══ */}
        <section
          ref={statsRef}
          style={{ padding: "0 32px", maxWidth: 1100, margin: "0 auto" }}
        >
          <div
            className="stats-grid"
            style={{
              display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
              background: C.white,
              border: `1px solid ${C.border}`,
              borderTop: "none",
              borderRadius: "0 0 20px 20px",
              overflow: "hidden",
              boxShadow: "0 6px 28px rgba(26,35,64,0.05)",
              opacity: statsOn ? 1 : 0,
              transform: statsOn ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 0.55s, transform 0.55s cubic-bezier(.22,1,.36,1)",
            }}
          >
            {[
              { to: 9,  suffix: "",      label: "Policy Sections",           color: C.orange },
              { to: 30, suffix: " Days", label: "Max Notice for Changes",     color: C.green  },
              { to: 14, suffix: " Days", label: "Annual Refund Window",       color: C.teal   },
              { to: 30, suffix: " Days", label: "Arbitration Opt-Out Period", color: C.pink   },
            ].map((s, i, arr) => (
              <div
                key={i}
                className="stat-cell-inner"
                style={{
                  textAlign: "center", padding: "28px 16px",
                  borderRight: i < arr.length - 1 ? `1px solid ${C.border}` : "none",
                }}
              >
                <div
                  className="stat-num"
                  style={{
                    fontSize: 42, fontWeight: 900, color: s.color,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    letterSpacing: "-1.5px", lineHeight: 1,
                  }}
                >
                  <Counter to={s.to} suffix={s.suffix} started={statsOn} />
                </div>
                <div style={{
                  fontSize: 12.5, color: C.muted, marginTop: 9,
                  fontFamily: "'Sora', sans-serif", lineHeight: 1.4,
                }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ 2-COLUMN LAYOUT ══ */}
        <div
          className="layout-grid"
          style={{
            maxWidth: 1100, margin: "0 auto",
            padding: "52px 32px 96px",
            display: "grid", gridTemplateColumns: "228px 1fr",
            gap: 32, alignItems: "start",
          }}
        >
          {/* ── SIDEBAR ── */}
          <aside className="sidebar-col" style={{ position: "sticky", top: 88 }}>

            {/* TOC */}
            <div style={{
              background: C.white,
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
                fontSize: 9.5, fontWeight: 700, color: C.orange,
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
                <Mail size={13} color={C.orange} strokeWidth={2} />
                <span style={{ color: C.navy }}>legal@ilmora.ai</span>
              </a>
              <div style={{
                fontSize: 11.5, color: C.muted,
                marginTop: 8, fontFamily: "'Sora', sans-serif",
              }}>
                Mon–Fri, 9am–6pm IST
              </div>
            </div>
          </aside>

          {/* ── MAIN CONTENT ── */}
          <main>

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
                  fontSize: 13.5, color: C.muted, lineHeight: 1.8,
                  fontFamily: "'Sora', sans-serif",
                }}>
                  By accepting these Terms, you agree disputes will be resolved by{" "}
                  <strong style={{ color: C.navy }}>binding individual arbitration</strong>.
                  You waive your right to a jury trial or class action. You may opt out within{" "}
                  <strong style={{ color: C.navy }}>30 days</strong> of account creation
                  by emailing <a href="mailto:legal@ilmora.ai">legal@ilmora.ai</a>.
                </p>
              </div>
            </div>

            {/* Welcome block */}
            <div style={{
              padding: "28px 30px", borderRadius: 18, marginBottom: 24,
              background: C.white, border: `1.5px solid ${C.border}`,
            }}>
              <div style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
                <span style={{ fontSize: 28, flexShrink: 0 }}>👋</span>
                <div>
                  <h2 style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 800, fontSize: 16.5, color: C.navy,
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
                    fontSize: 14, fontWeight: 600, color: C.navy, lineHeight: 1.8,
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
                <SectionCard key={s.id} data={s} idx={i} />
              ))}
            </div>

            {/* Footer note */}
            <div style={{
              marginTop: 28, padding: "18px 22px", borderRadius: 14,
              background: C.white, border: `1.5px solid ${C.border}`,
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

        {/* ══ CTA SECTION ══ */}
        <section
          className="cta-section"
          style={{
            padding: "88px 32px",
            background: C.white,
            borderTop: `1px solid ${C.border}`,
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: 600, margin: "0 auto" }}>

            {/* Floating icon */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
              <div style={{ position: "relative" }}>
                <div style={{
                  position: "absolute", inset: -12, borderRadius: "50%",
                  background: C.orange, opacity: 0.06,
                  animation: "ringOut 2.8s ease-out infinite",
                }} />
                <div style={{
                  width: 78, height: 78, borderRadius: 22,
                  background: C.orangeLight,
                  border: `1.5px solid ${C.orangeBorder}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  animation: "floatY 4.5s ease-in-out infinite",
                }}>
                  <Scale size={36} color={C.orange} strokeWidth={1.6} />
                </div>
              </div>
            </div>

            <h2 style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 900,
              color: C.navy, letterSpacing: "-1.2px", marginBottom: 16,
            }}>
              Questions About{" "}
              <span style={{
                background: `linear-gradient(135deg, ${C.orange}, #fb923c)`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
                These Terms?
              </span>
            </h2>

            <p style={{
              color: C.muted, fontSize: 15.5, marginBottom: 44, lineHeight: 1.85,
              fontFamily: "'Sora', sans-serif",
            }}>
              Our legal and support teams are ready to clarify any aspect of these
              Terms, your rights, or your obligations as an ILM ORA user.
            </p>

            {/* Contact tiles */}
            <div
              className="contact-grid"
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 36 }}
            >
              {[
                { title: "Legal Team",   email: "legal@ilmora.ai",   emoji: "⚖️", note: "Terms, compliance & IP queries" },
                { title: "Support Team", email: "support@ilmora.ai", emoji: "💬", note: "Account & billing assistance"   },
              ].map((c, i) => (
                <div
                  key={i}
                  style={{
                    background: C.bgSub, border: `1.5px solid ${C.border}`,
                    borderRadius: 16, padding: "28px 24px", textAlign: "left",
                    transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s",
                    cursor: "default",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = C.orange + "70";
                    e.currentTarget.style.boxShadow = "0 8px 28px rgba(249,115,22,0.09)";
                    e.currentTarget.style.transform = "translateY(-3px)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = C.border;
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div style={{ fontSize: 28, marginBottom: 14 }}>{c.emoji}</div>
                  <div style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 800, fontSize: 15, color: C.navy, marginBottom: 8,
                  }}>{c.title}</div>
                  <a
                    href={`mailto:${c.email}`}
                    style={{ fontSize: 13, fontFamily: "'DM Mono', monospace" }}
                  >
                    {c.email}
                  </a>
                  <div style={{
                    fontSize: 12.5, color: C.muted,
                    marginTop: 8, fontFamily: "'Sora', sans-serif",
                  }}>{c.note}</div>
                </div>
              ))}
            </div>

            <div
              className="cta-btns"
              style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}
            >
              <a href="mailto:legal@ilmora.ai" className="btn-primary">
                <Mail size={15} color="#fff" strokeWidth={2.2} />
                Contact Legal Team
              </a>
              <a href="mailto:support@ilmora.ai" className="btn-ghost">
                <CheckCircle2 size={15} color={C.orange} strokeWidth={2} />
                Get Support
              </a>
            </div>
          </div>
        </section>

        {/* ══ BOTTOM BAR ══ */}
        <div
          className="bottom-bar-inner"
          style={{
            padding: "20px 32px",
            borderTop: `1px solid ${C.border}`,
            background: C.bg,
            display: "flex", justifyContent: "space-between",
            alignItems: "center", flexWrap: "wrap", gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 22, fontWeight: 900, letterSpacing: "-0.5px",
            }}>
              <span style={{ color: C.green }}>ILM</span>
              <span style={{ color: C.orange, marginLeft: 5 }}>ORA</span>
            </span>
            <span style={{ color: C.muted2, fontSize: 12.5, fontFamily: "'Sora', sans-serif" }}>
              © 2026 ILM ORA. All rights reserved.
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <Lock size={12} color={C.muted2} strokeWidth={1.8} />
            <span style={{ fontSize: 12.5, color: C.muted2, fontFamily: "'Sora', sans-serif" }}>
              Secure & Compliant Platform
            </span>
          </div>
        </div>

      </div>
    </>
  );
}