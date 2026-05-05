import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  Database, CheckCircle, Link, Lock, Shield,
  Cookie, ClipboardList, ChevronDown, Mail,
  Globe, Users, FileText, RefreshCw,
} from "lucide-react";

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
  pink:    "#db2777",
  teal:    "#0d9488",
};

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&family=Sora:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body { background: ${T.cream3}; -webkit-font-smoothing: antialiased; }

::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: ${T.cream2}; }
::-webkit-scrollbar-thumb { background: ${T.orange}80; border-radius: 4px; }

a { color: ${T.orange}; text-decoration: none; font-weight: 700; transition: color 0.18s; }
a:hover { color: #ea6b0e; }

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

/* ── Navbar ── */
.pp-nav {
  position: sticky; top: 0; z-index: 100;
  background: ${T.white};
  border-bottom: 1px solid ${T.border};
  padding: 0 32px; height: 68px;
  display: flex; align-items: center;
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

/* ── Cards ── */
.pp-card {
  background: ${T.white};
  border: 1.5px solid ${T.border};
  border-radius: 18px; overflow: hidden;
  cursor: pointer;
  transition: border-color 0.25s, box-shadow 0.25s, transform 0.2s;
}
.pp-card:hover {
  border-color: var(--accent, ${T.orange})55;
  box-shadow: 0 8px 36px rgba(0,0,0,0.07);
  transform: translateY(-2px);
}
.pp-card.open { box-shadow: 0 10px 40px rgba(0,0,0,0.08); }

/* ── TOC ── */
.toc-btn {
  display: flex; align-items: center; gap: 10px;
  width: 100%; padding: 10px 14px;
  background: none; border: none; border-radius: 10px;
  font-family: 'Sora', sans-serif; font-size: 12.5px; font-weight: 600;
  color: ${T.muted}; cursor: pointer; text-align: left;
  transition: background 0.18s, color 0.18s, padding-left 0.2s;
}
.toc-btn:hover { background: ${T.cream2}; color: ${T.navy}; padding-left: 18px; }
.toc-btn.active {
  background: ${T.orangeL}; color: ${T.orange}; font-weight: 700;
  border-left: 3px solid ${T.orange};
  border-radius: 0 10px 10px 0; padding-left: 11px;
}

/* ── Point row ── */
.pp-point {
  display: flex; gap: 12px; align-items: flex-start;
  padding: 5px 0; font-family: 'Sora', sans-serif;
  font-size: 14px; font-weight: 500; line-height: 1.72;
  color: ${T.text}; transition: color 0.18s;
}
.pp-point:hover { color: ${T.navy2}; }

/* ── Buttons ── */
.btn-primary {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 13px 30px;
  background: linear-gradient(135deg, ${T.orange}, #fb923c);
  color: #fff; font-weight: 800; font-size: 14px;
  border-radius: 12px; border: none; cursor: pointer;
  font-family: 'Plus Jakarta Sans', sans-serif; text-decoration: none;
  box-shadow: 0 6px 24px rgba(249,115,22,0.32);
  transition: transform 0.18s, box-shadow 0.18s;
}
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 36px rgba(249,115,22,0.48); color: #fff; }
.btn-ghost {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 12px 26px; background: transparent;
  color: ${T.navy}; font-weight: 700; font-size: 14px;
  border-radius: 12px; border: 1.5px solid ${T.borderM};
  cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; text-decoration: none;
  transition: border-color 0.18s, background 0.18s, color 0.18s;
}
.btn-ghost:hover { border-color: ${T.orange}; background: ${T.orangeL}; color: ${T.orange}; }

/* ── Contact card ── */
.pp-contact-card {
  background: ${T.cream2}; border: 1.5px solid ${T.border};
  border-radius: 16px; padding: 28px 24px; text-align: left;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
}
.pp-contact-card:hover {
  border-color: rgba(249,115,22,0.45);
  box-shadow: 0 8px 28px rgba(249,115,22,0.09);
  transform: translateY(-3px);
}

/* ── Responsive ── */
@media(max-width:1024px) {
  .layout-grid { grid-template-columns: 1fr !important; }
  .sidebar-col { display: none !important; }
  .pp-nav { padding: 0 20px; }
}
@media(max-width:768px) {
  .hero-section { padding: 60px 20px 52px !important; }
  .hero-title { font-size: 36px !important; letter-spacing: -1.5px !important; }
  .stats-grid { grid-template-columns: 1fr 1fr !important; }
  .stat-cell { padding: 22px 12px !important; }
  .stat-num { font-size: 32px !important; }
  .layout-grid { padding: 28px 16px 64px !important; gap: 0 !important; }
  .contact-grid { grid-template-columns: 1fr !important; }
  .cta-btns { flex-direction: column; align-items: center; }
  .bottom-bar { flex-direction: column !important; text-align: center; gap: 10px !important; }
  .subsec-grid { grid-template-columns: 1fr !important; }
  .subsec-span { grid-column: 1 !important; }
}
@media(max-width:480px) {
  .hero-title { font-size: 28px !important; }
  .pp-logo { font-size: 20px !important; }
}
`;

/* ── Animated counter ── */
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

const TOC_ITEMS = [
  { id: "info-collect",    label: "Information We Collect",   Icon: Database      },
  { id: "data-usage",      label: "How We Use Your Data",     Icon: CheckCircle   },
  { id: "legal-basis",     label: "Legal Basis (GDPR/EEA)",   Icon: FileText      },
  { id: "data-sharing",    label: "Information Sharing",       Icon: Link          },
  { id: "data-protection", label: "Security & Protection",     Icon: Lock          },
  { id: "international",   label: "International Transfers",   Icon: Globe         },
  { id: "user-rights",     label: "Your Rights & Choices",     Icon: Shield        },
  { id: "cookies",         label: "Cookies & Tracking",        Icon: Cookie        },
  { id: "children",        label: "Children's Privacy",        Icon: Users         },
  { id: "retention",       label: "Data Retention",            Icon: ClipboardList },
  { id: "policy-updates",  label: "Policy Updates",            Icon: RefreshCw     },
];

const useActive = () => {
  const [active, setActive] = useState("info-collect");
  useEffect(() => {
    const fn = () => {
      const y = window.scrollY + 200;
      for (let i = TOC_ITEMS.length - 1; i >= 0; i--) {
        const el = document.getElementById("s-" + TOC_ITEMS[i].id);
        if (el && el.offsetTop <= y) { setActive(TOC_ITEMS[i].id); break; }
      }
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return active;
};

/* ── Section card ── */
const SectionCard = ({ section, idx }) => {
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

  const Icon = section.icon;

  return (
    <div
      id={"s-" + section.id}
      ref={ref}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(22px)",
        transition: `opacity 0.48s ${idx * 50}ms ease, transform 0.48s ${idx * 50}ms cubic-bezier(.22,1,.36,1)`,
      }}
    >
      <div
        className={`pp-card ${open ? "open" : ""}`}
        style={{ "--accent": section.color, borderColor: open ? section.color + "55" : T.border }}
        onClick={() => setOpen(p => !p)}
      >
        {/* Header */}
        <div style={{ padding: "22px 26px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flexShrink: 0 }}>
              <div style={{
                width: 50, height: 50, borderRadius: 14, flexShrink: 0,
                background: open ? section.color + "1a" : section.color + "12",
                border: `1.5px solid ${section.color}${open ? "55" : "30"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.25s",
                boxShadow: open ? `0 4px 16px ${section.color}25` : "none",
              }}>
                <Icon size={22} color={section.color} strokeWidth={2} />
              </div>
              <span style={{
                fontSize: 9, fontFamily: "'DM Mono', monospace",
                color: section.color, fontWeight: 600,
              }}>
                §{String(idx + 1).padStart(2, "0")}
              </span>
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 800, fontSize: 16, color: T.navy,
                marginBottom: 5, letterSpacing: "-0.3px",
              }}>
                {section.title}
              </div>
              <div style={{
                fontFamily: "'Sora', sans-serif", fontWeight: 500,
                fontSize: 13.5, color: T.muted,
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}>
                {section.summary}
              </div>
            </div>
          </div>

          <div style={{
            width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
            background: open ? section.color + "18" : T.cream2,
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background 0.25s",
          }}>
            <ChevronDown
              size={16} color={open ? section.color : T.muted}
              strokeWidth={2.5}
              style={{ transition: "transform 0.35s cubic-bezier(.22,1,.36,1)", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
            />
          </div>
        </div>

        {/* Body */}
        <div style={{ maxHeight: open ? "4000px" : "0", overflow: "hidden", transition: "max-height 0.6s cubic-bezier(.22,1,.36,1)" }}>
          <div style={{ padding: "0 26px 28px" }}>
            <div style={{ height: 1.5, background: T.border, marginBottom: 22 }} />
            <div
              className="subsec-grid"
              style={{
                display: "grid",
                gridTemplateColumns: section.content.length === 1 ? "1fr" : "1fr 1fr",
                gap: 14,
              }}
            >
              {section.content.map((sub, si) => (
                <div
                  key={si}
                  className={section.content.length === 1 || (section.content.length === 3 && si === 2) ? "subsec-span" : ""}
                  style={{
                    background: T.cream2,
                    border: `1.5px solid ${T.border}`,
                    borderRadius: 12, padding: "18px 20px",
                    gridColumn: section.content.length === 1 || (section.content.length === 3 && si === 2) ? "span 2" : "auto",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                    <div style={{
                      width: 3.5, height: 16, borderRadius: 2,
                      background: section.color, flexShrink: 0,
                    }} />
                    <span style={{
                      fontSize: 10, fontWeight: 800, color: section.color,
                      textTransform: "uppercase", letterSpacing: "0.1em",
                      fontFamily: "'DM Mono', monospace",
                    }}>
                      {sub.subtitle}
                    </span>
                  </div>
                  {sub.details.map((d, di) => (
                    <div key={di} className="pp-point">
                      <span style={{
                        width: 7, height: 7, borderRadius: "50%",
                        background: section.color, flexShrink: 0, marginTop: 7,
                        boxShadow: `0 0 6px ${section.color}55`,
                      }} />
                      <span>{d}</span>
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
const PrivacyPolicy = () => {
  const { pathname } = useLocation();
  const [statsOn, setStatsOn] = useState(false);
  const statsRef = useRef();
  const active = useActive();

  useEffect(() => { window.scrollTo({ top: 0 }); }, [pathname]);

  useEffect(() => {
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
      id: "info-collect", icon: Database, color: "#6366f1",
      title: "Information We Collect",
      summary: "Personal, usage, and technical data we gather from you",
      content: [
        {
          subtitle: "Information You Provide", details: [
            "Name, email address, phone number, and contact details when you register.",
            "Professional background, educational history, job title, and company for your learning profile.",
            "Account credentials and authentication information.",
            "Resume or CV data, preferences, and demographics submitted during enrollment.",
            "Payment-related information processed securely by our third-party payment processor.",
            "Ratings, feedback, and reviews you voluntarily submit on the platform.",
            "Support messages and communications you send to ILM ORA.",
          ],
        },
        {
          subtitle: "Data We Collect Automatically", details: [
            "Courses accessed, progress made, assessments completed, and certifications earned.",
            "Search queries, learning behavior patterns, and content usage analytics.",
            "Device information: IP address, browser type, operating system, and device identifiers.",
            "Session recordings and video/audio from live online class attendance.",
            "Log files, error reports, and platform performance data.",
            "Cookies and similar tracking technologies (see Cookies section below).",
            "Approximate location inferred from your IP address.",
          ],
        },
        {
          subtitle: "Data From Third Parties", details: [
            "Profile information from third-party accounts (Google, LinkedIn) if you link them.",
            "Demographic and marketing data from trusted data partners.",
            "Employer or institutional data if you enroll through an enterprise account.",
          ],
        },
      ],
    },
    {
      id: "data-usage", icon: CheckCircle, color: "#16a34a",
      title: "How We Use Your Information",
      summary: "Purposes for which we process your personal data",
      content: [
        {
          subtitle: "Platform & Service Delivery", details: [
            "Delivering, maintaining, and improving our AI-powered learning platform.",
            "Tracking your course progress, issuing certificates, and managing your learning profile.",
            "Personalizing your learning experience through tailored content and AI recommendations.",
            "Processing transactions, payments, and managing your subscription.",
            "Sending push notifications and service-related communications.",
          ],
        },
        {
          subtitle: "Communication & Marketing", details: [
            "Responding to your inquiries, support requests, and feedback.",
            "Sending service updates, feature announcements, and newsletters.",
            "Marketing communications about new courses, offers, and events (with your consent).",
            "You may unsubscribe from marketing emails at any time via the opt-out link.",
          ],
        },
        {
          subtitle: "Improvement, Security & Analytics", details: [
            "Improving our AI models, algorithms, and platform features.",
            "Conducting A/B testing and product research.",
            "Detecting, preventing, and responding to fraud, abuse, and security incidents.",
            "Generating anonymized, aggregated analytics reports.",
            "Ensuring compliance with legal obligations and enforcing our Terms of Service.",
          ],
        },
      ],
    },
    {
      id: "legal-basis", icon: FileText, color: "#a855f7",
      title: "Legal Basis for Processing (GDPR / EEA)",
      summary: "Why we are legally permitted to process your personal data",
      content: [
        {
          subtitle: "Our Legal Bases", details: [
            "Consent — You have explicitly agreed, e.g., to receive marketing emails or allow optional cookies.",
            "Contractual Necessity — We need your data to provide the services you signed up for.",
            "Legal Obligation — Required by law, e.g., for tax and accounting compliance.",
            "Legitimate Interests — Platform security, fraud prevention, and product improvement, where these interests do not override your rights.",
            "If you are in the EEA or UK, you may withdraw consent at any time without affecting the lawfulness of prior processing.",
          ],
        },
      ],
    },
    {
      id: "data-sharing", icon: Link, color: "#f97316",
      title: "Information Sharing",
      summary: "When and how your data is shared with third parties",
      content: [
        {
          subtitle: "Service Providers & Partners", details: [
            "Cloud hosting, infrastructure, and data storage providers.",
            "Analytics services (e.g., Google Analytics) for usage monitoring.",
            "Payment processors and billing service providers.",
            "Customer support, live chat, and communication tools.",
            "Advertising and marketing platforms (only with appropriate consent).",
          ],
        },
        {
          subtitle: "Instructors & Institutions", details: [
            "Instructors receive your enrollment, progress, and participation data for courses you join.",
            "If you enroll through an employer or institution, relevant data may be shared with them.",
            "Your name and profile may be visible to other learners in collaborative environments.",
          ],
        },
        {
          subtitle: "Legal & Business Transfers", details: [
            "We may disclose data to comply with applicable laws, court orders, or government requests.",
            "To protect the rights, property, or safety of ILM ORA, our users, or the public.",
            "In connection with a merger, acquisition, asset sale, or business restructuring.",
            "We never sell your personal data to third parties for their own marketing purposes.",
          ],
        },
      ],
    },
    {
      id: "data-protection", icon: Lock, color: "#ef4444",
      title: "Security & Data Protection",
      summary: "Technical and organizational measures to safeguard your data",
      content: [
        {
          subtitle: "Technical Safeguards", details: [
            "AES-256-bit encryption for data at rest and TLS/SSL for all data in transit.",
            "Multi-factor authentication and role-based access controls.",
            "Regular security audits, penetration testing, and vulnerability assessments.",
            "Automated threat detection and real-time security monitoring.",
          ],
        },
        {
          subtitle: "Organizational Measures", details: [
            "Employee training on data protection and privacy best practices.",
            "Strict need-to-know access policies — only authorized staff can access personal data.",
            "Documented incident response and data breach notification procedures.",
            "Regular security policy reviews and updates.",
          ],
        },
        {
          subtitle: "Compliance Standards", details: [
            "GDPR compliance for users in the European Economic Area and UK.",
            "CCPA compliance for California residents.",
            "Industry-standard data protection certifications and audits.",
            "While we employ strong safeguards, no electronic system can guarantee absolute security.",
          ],
        },
      ],
    },
    {
      id: "international", icon: Globe, color: "#0d9488",
      title: "International Data Transfers",
      summary: "How your data may be transferred across borders",
      content: [
        {
          subtitle: "Cross-Border Processing", details: [
            "Our platform is hosted in secure cloud infrastructure.",
            "If you access ILM ORA from the EEA, UK, or other regions, your data may be transferred internationally for storage and processing.",
            "We ensure appropriate safeguards are in place for all cross-border data transfers.",
            "Transfers outside the EEA are governed by Standard Contractual Clauses or other approved mechanisms.",
            "EEA or UK users may request details on safeguards applicable to their data transfers.",
          ],
        },
      ],
    },
    {
      id: "user-rights", icon: Shield, color: "#16a34a",
      title: "Your Rights & Choices",
      summary: "Your rights regarding your personal data and how to exercise them",
      content: [
        {
          subtitle: "Access, Portability & Correction", details: [
            "Request access to the personal data we hold about you.",
            "Obtain a portable copy of your data in a commonly used format.",
            "Correct or update inaccurate or incomplete personal information.",
            "Review how your data is being processed and shared.",
          ],
        },
        {
          subtitle: "Deletion & Restriction", details: [
            "Request deletion of your personal data (subject to legal retention obligations).",
            "Withdraw consent for data processing at any time, without affecting prior processing.",
            "Object to or restrict certain types of data processing.",
            "Lodge a complaint with a data protection supervisory authority in your country.",
          ],
        },
        {
          subtitle: "Communication & Marketing Choices", details: [
            "Opt out of marketing emails at any time via the unsubscribe link.",
            "Manage notification preferences in your account settings.",
            "Control cookie and tracking preferences via our Cookie Settings.",
            "Do Not Track — there is no industry standard; we do not alter practices based on DNT signals.",
          ],
        },
      ],
    },
    {
      id: "cookies", icon: Cookie, color: "#d97706",
      title: "Cookies & Tracking Technologies",
      summary: "How we use cookies, pixels, and similar tracking tools",
      content: [
        {
          subtitle: "Essential & Functional Cookies", details: [
            "Strictly necessary cookies for authentication, security, and session management.",
            "Functional cookies to remember your preferences and personalize your experience.",
            "Load balancing and performance optimization cookies.",
            "These cookies cannot be disabled without affecting core platform functionality.",
          ],
        },
        {
          subtitle: "Analytics & Marketing Cookies", details: [
            "Google Analytics (first-party cookies) to track usage trends and improve the platform.",
            "You can opt out of Google Analytics at tools.google.com/dlpage/gaoptout.",
            "A/B testing and conversion tracking for feature optimization.",
            "Marketing cookies to show you relevant course recommendations and ads.",
          ],
        },
        {
          subtitle: "Managing Your Preferences", details: [
            "You can manage or disable cookies via your browser settings at any time.",
            "Where required by law, we will ask for your consent before placing non-essential cookies.",
            "Disabling certain cookies may limit your ability to use some platform features.",
            "We respect opt-out signals from Network Advertising Initiative and Digital Advertising Alliance members.",
          ],
        },
      ],
    },
    {
      id: "children", icon: Users, color: "#ec4899",
      title: "Children's Privacy",
      summary: "Our policy regarding users under 13 years of age",
      content: [
        {
          subtitle: "Age Restrictions", details: [
            "ILM ORA is not directed at or intended for children under the age of 13.",
            "We do not knowingly collect, maintain, or use personal information from children under 13.",
            "Users between 13–18 must have verifiable parental or guardian consent.",
            "If you believe a child has provided us with personal data, contact privacy@ilmora.ai immediately.",
            "Upon confirmation, we will promptly delete any such data from our systems.",
          ],
        },
      ],
    },
    {
      id: "retention", icon: ClipboardList, color: "#6366f1",
      title: "Data Retention",
      summary: "How long we keep your personal information",
      content: [
        {
          subtitle: "Retention Principles", details: [
            "We retain your personal data only as long as necessary to fulfill the purposes in this policy.",
            "Account data is retained for the duration of your account and a reasonable period after closure.",
            "Specific retention periods depend on the data type, service nature, and applicable legal obligations.",
            "Financial records may be retained longer to comply with tax and accounting regulations.",
            "You may request deletion of your data at any time, subject to legal retention requirements.",
            "Anonymized or aggregated data may be retained indefinitely for analytics and research.",
          ],
        },
      ],
    },
    {
      id: "policy-updates", icon: RefreshCw, color: "#db2777",
      title: "Policy Updates & Changes",
      summary: "How we handle updates to this privacy policy",
      content: [
        {
          subtitle: "Notification Process", details: [
            "We may update this Privacy Policy at any time; material changes will be communicated in advance.",
            "You will be notified via email and/or an in-app banner for significant changes.",
            "The updated policy will show a revised 'Last Updated' date at the top of this page.",
            "We provide a minimum 30-day notice period for significant changes affecting your rights.",
          ],
        },
        {
          subtitle: "Your Options on Updates", details: [
            "Continued use of ILM ORA after the effective date constitutes acceptance of the updated policy.",
            "If you disagree with material changes, you may delete your account before the effective date.",
            "You may access prior versions of this policy by contacting privacy@ilmora.ai.",
            "We encourage you to review this policy periodically to stay informed.",
          ],
        },
      ],
    },
  ];

  return (
    <>
      <style>{STYLES}</style>
      <div style={{
        minHeight: "100vh", background: T.cream3,
        color: T.text, fontFamily: "'Sora','Plus Jakarta Sans',system-ui,sans-serif",
      }}>

        {/* ══ NAVBAR ══ */}
        <nav className="pp-nav">
          <a href="/" className="pp-logo">
            <span className="ilm">ILM</span>
            <span className="ora">ORA</span>
          </a>
        </nav>

        {/* ══ HERO ══ */}
        <section className="hero-section" style={{
          padding: "80px 32px 72px", textAlign: "center",
          background: T.cream3, borderBottom: `1px solid ${T.border}`,
        }}>
          <div style={{ maxWidth: 660, margin: "0 auto" }}>

            {/* Badge */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 9,
              padding: "8px 22px", borderRadius: 999,
              background: "rgba(99,102,241,0.1)",
              border: "1.5px solid rgba(99,102,241,0.28)",
              marginBottom: 32, animation: "fadeUp 0.5s 0.05s ease both",
            }}>
              <div style={{
                width: 7, height: 7, borderRadius: "50%", background: T.indigo,
                animation: "blink 2.4s ease-in-out infinite",
              }} />
              <span style={{
                fontSize: 12, fontWeight: 800, color: T.indigo,
                fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "0.07em",
              }}>
                LEGAL DOCUMENT
              </span>
            </div>

            {/* Floating icon */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 28, animation: "fadeUp 0.5s 0.08s ease both" }}>
              <div style={{ position: "relative" }}>
                <div style={{
                  position: "absolute", inset: -10, borderRadius: "50%",
                  background: T.indigo, opacity: 0.06,
                  animation: "ringOut 3s ease-out infinite",
                }} />
                <div style={{
                  width: 84, height: 84, borderRadius: 22,
                  background: "rgba(99,102,241,0.1)",
                  border: "2px solid rgba(99,102,241,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  animation: "float 4.5s ease-in-out infinite",
                }}>
                  <Shield size={40} color={T.indigo} strokeWidth={1.8} />
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="hero-title" style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 60, fontWeight: 900,
              color: T.navy, lineHeight: 1.04,
              letterSpacing: "-2.2px", marginBottom: 20,
              animation: "fadeUp 0.52s 0.12s ease both",
            }}>
              Privacy{" "}
              <span style={{
                background: `linear-gradient(135deg, ${T.indigo}, #818cf8)`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>Policy</span>
            </h1>

            <p style={{
              fontSize: 16.5, color: T.muted, lineHeight: 1.82, fontWeight: 500,
              maxWidth: 500, margin: "0 auto 36px",
              fontFamily: "'Sora', sans-serif",
              animation: "fadeUp 0.52s 0.18s ease both",
            }}>
              Your privacy is fundamental to our mission. This policy explains how
              ILM ORA collects, uses, and protects your personal information across
              our AI-powered learning platform.
            </p>

            {/* Meta pills */}
            <div style={{
              display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap",
              animation: "fadeUp 0.52s 0.24s ease both",
            }}>
              {[
                { label: "Effective", val: "Feb 2, 2026", icon: "📅" },
                { label: "Updated",   val: "Feb 2, 2026", icon: "🔄" },
                { label: "Version",   val: "1.2.0",       icon: "📋" },
              ].map((m, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "9px 18px", borderRadius: 10,
                  background: T.white, border: `1.5px solid ${T.border}`,
                  fontSize: 13, boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}>
                  <span style={{ fontSize: 15 }}>{m.icon}</span>
                  <span style={{ color: T.muted, fontWeight: 600 }}>{m.label}:</span>
                  <span style={{
                    color: T.navy, fontWeight: 700,
                    fontFamily: "'DM Mono', monospace", fontSize: 12,
                  }}>{m.val}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ STATS BAR ══ */}
        <section ref={statsRef} style={{ padding: "0 32px", maxWidth: 1100, margin: "0 auto" }}>
          <div className="stats-grid" style={{
            display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
            background: T.white, border: `1px solid ${T.border}`,
            borderTop: "none", borderRadius: "0 0 20px 20px",
            overflow: "hidden", boxShadow: "0 6px 28px rgba(26,35,64,0.05)",
            opacity: statsOn ? 1 : 0,
            transform: statsOn ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.55s, transform 0.55s cubic-bezier(.22,1,.36,1)",
          }}>
            {[
              { to: 11,  suffix: "",      label: "Privacy Sections",     color: T.indigo  },
              { to: 256, suffix: "-bit",  label: "AES Encryption",       color: "#16a34a" },
              { to: 100, suffix: "%",     label: "GDPR Compliant",       color: T.orange  },
              { to: 30,  suffix: " Days", label: "Change Notice Period", color: T.pink    },
            ].map((s, i, arr) => (
              <div key={i} className="stat-cell" style={{
                textAlign: "center", padding: "28px 16px",
                borderRight: i < arr.length - 1 ? `1px solid ${T.border}` : "none",
              }}>
                <div className="stat-num" style={{
                  fontSize: 42, fontWeight: 900, color: s.color,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  letterSpacing: "-1.5px", lineHeight: 1,
                }}>
                  <Counter to={s.to} suffix={s.suffix} started={statsOn} />
                </div>
                <div style={{
                  fontSize: 13, color: T.muted, fontWeight: 600, marginTop: 9,
                  fontFamily: "'Sora', sans-serif", lineHeight: 1.4,
                }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ 2-COLUMN LAYOUT ══ */}
        <div className="layout-grid" style={{
          maxWidth: 1100, margin: "0 auto",
          padding: "52px 32px 96px",
          display: "grid", gridTemplateColumns: "228px 1fr",
          gap: 32, alignItems: "start",
        }}>

          {/* ── SIDEBAR ── */}
          <aside className="sidebar-col" style={{ position: "sticky", top: 88 }}>
            <div style={{
              background: T.white, border: `1.5px solid ${T.border}`,
              borderRadius: 18, padding: "16px 8px",
              boxShadow: "0 4px 20px rgba(26,35,64,0.04)",
            }}>
              <div style={{
                fontSize: 10, fontWeight: 800, color: T.muted2,
                textTransform: "uppercase", letterSpacing: "0.12em",
                fontFamily: "'DM Mono', monospace",
                padding: "0 14px", marginBottom: 10,
              }}>
                Contents
              </div>
              {TOC_ITEMS.map(item => (
                <button
                  key={item.id}
                  className={`toc-btn ${active === item.id ? "active" : ""}`}
                  onClick={() => scrollTo(item.id)}
                >
                  <item.Icon
                    size={13}
                    color={active === item.id ? T.orange : T.muted2}
                    strokeWidth={active === item.id ? 2.5 : 2}
                  />
                  {item.label}
                </button>
              ))}
            </div>

            {/* Quick contact */}
            <div style={{
              marginTop: 16, padding: "18px 16px",
              background: T.orangeL, border: `1.5px solid ${T.orangeB}`,
              borderRadius: 16,
            }}>
              <div style={{
                fontSize: 10, fontWeight: 800, color: T.orange,
                textTransform: "uppercase", letterSpacing: "0.1em",
                fontFamily: "'DM Mono', monospace", marginBottom: 12,
              }}>
                Questions?
              </div>
              <a href="mailto:privacy@ilmora.ai" style={{
                display: "flex", alignItems: "center", gap: 8,
                fontSize: 13, fontFamily: "'Sora', sans-serif", fontWeight: 700,
              }}>
                <Mail size={13} color={T.orange} strokeWidth={2.2} />
                <span style={{ color: T.navy }}>privacy@ilmora.ai</span>
              </a>
              <div style={{ fontSize: 12, color: T.muted, fontWeight: 600, marginTop: 8, fontFamily: "'Sora', sans-serif" }}>
                Mon–Fri, 9am–6pm IST
              </div>
            </div>
          </aside>

          {/* ── MAIN CONTENT ── */}
          <main>

            {/* GDPR notice */}
            <div style={{
              display: "flex", gap: 14, alignItems: "flex-start",
              padding: "20px 24px", borderRadius: 16, marginBottom: 24,
              background: "rgba(99,102,241,0.07)",
              border: "1.5px solid rgba(99,102,241,0.22)",
            }}>
              <div style={{
                width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                background: "rgba(99,102,241,0.12)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Globe size={20} color={T.indigo} strokeWidth={2} />
              </div>
              <div>
                <div style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 800, fontSize: 15, color: T.indigo, marginBottom: 7,
                }}>
                  GDPR & Global Privacy Compliance
                </div>
                <p style={{ fontSize: 14, color: T.text, lineHeight: 1.8, fontWeight: 500, fontFamily: "'Sora', sans-serif" }}>
                  If you are located in the <strong style={{ color: T.navy, fontWeight: 800 }}>European Economic Area (EEA) or UK</strong>,
                  you have additional rights under GDPR including access, portability, correction, erasure, and the right to object.
                  California residents have rights under <strong style={{ color: T.navy, fontWeight: 800 }}>CCPA</strong>.
                  Contact <a href="mailto:privacy@ilmora.ai">privacy@ilmora.ai</a> to exercise any of these rights.
                </p>
              </div>
            </div>

            {/* Welcome block */}
            <div style={{
              padding: "28px 30px", borderRadius: 18, marginBottom: 24,
              background: T.white, border: `1.5px solid ${T.border}`,
            }}>
              <div style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
                <span style={{ fontSize: 28, flexShrink: 0 }}>🛡️</span>
                <div>
                  <h2 style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 800, fontSize: 17, color: T.navy,
                    marginBottom: 10, letterSpacing: "-0.3px",
                  }}>
                    Our Commitment to Your Privacy
                  </h2>
                  <p style={{ fontSize: 14.5, color: T.text, lineHeight: 1.85, fontWeight: 500, fontFamily: "'Sora', sans-serif", marginBottom: 14 }}>
                    This Privacy Policy describes how ILM ORA (<strong style={{ color: T.navy, fontWeight: 800 }}>"we"</strong>,{" "}
                    <strong style={{ color: T.navy, fontWeight: 800 }}>"our"</strong>, or{" "}
                    <strong style={{ color: T.navy, fontWeight: 800 }}>"us"</strong>) collects, uses, shares, and protects
                    your personal information when you use our AI-powered learning platform and related services.
                    It applies to all users — learners, instructors, and enterprise customers.
                  </p>
                  <div style={{
                    fontSize: 14.5, fontWeight: 700, color: T.navy, lineHeight: 1.78,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    padding: "14px 18px", borderRadius: 10,
                    background: T.cream2, border: `1.5px solid ${T.border}`,
                  }}>
                    By accessing or using ILM ORA, you agree to the collection and use of your
                    information in accordance with this Privacy Policy. If you do not agree, please
                    discontinue use of the Service.
                  </div>
                </div>
              </div>
            </div>

            {/* Section accordions */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {sections.map((s, i) => (
                <SectionCard key={s.id} section={s} idx={i} />
              ))}
            </div>

            {/* Footer note */}
            <div style={{
              marginTop: 28, padding: "18px 22px", borderRadius: 14,
              background: T.white, border: `1.5px solid ${T.border}`,
              display: "flex", gap: 12, alignItems: "flex-start",
            }}>
              <Globe size={17} color={T.muted} strokeWidth={2} style={{ flexShrink: 0, marginTop: 2 }} />
              <p style={{ fontSize: 14, color: T.text, lineHeight: 1.8, fontWeight: 500, fontFamily: "'Sora', sans-serif" }}>
                This privacy policy is part of ILM ORA's commitment to transparency. For our complete legal terms, visit our{" "}
                <a href="/terms-of-service">Terms of Service</a>. For account support, contact{" "}
                <a href="mailto:support@ilmora.ai">support@ilmora.ai</a>.
              </p>
            </div>
          </main>
        </div>

        {/* ══ CTA SECTION ══ */}
        <section style={{
          padding: "88px 32px",
          background: T.white,
          borderTop: `1px solid ${T.border}`,
          textAlign: "center",
        }}>
          <div style={{ maxWidth: 600, margin: "0 auto" }}>

            <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
              <div style={{ position: "relative" }}>
                <div style={{
                  position: "absolute", inset: -12, borderRadius: "50%",
                  background: T.indigo, opacity: 0.06,
                  animation: "ringOut 2.8s ease-out infinite",
                }} />
                <div style={{
                  width: 78, height: 78, borderRadius: 22,
                  background: "rgba(99,102,241,0.1)",
                  border: "2px solid rgba(99,102,241,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  animation: "float 4.5s ease-in-out infinite",
                }}>
                  <Mail size={36} color={T.indigo} strokeWidth={1.8} />
                </div>
              </div>
            </div>

            <h2 style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 900,
              color: T.navy, letterSpacing: "-1.2px", marginBottom: 16,
            }}>
              Questions About Your{" "}
              <span style={{
                background: `linear-gradient(135deg, ${T.indigo}, #818cf8)`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
                Privacy?
              </span>
            </h2>

            <p style={{ color: T.muted, fontWeight: 600, fontSize: 16, marginBottom: 44, lineHeight: 1.82, fontFamily: "'Sora', sans-serif" }}>
              Our privacy and support teams are here to help with any questions
              about how we handle your personal information.
            </p>

            <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 36 }}>
              {[
                { title: "Privacy Team", email: "privacy@ilmora.ai", emoji: "🛡️", note: "Data rights, GDPR & privacy queries" },
                { title: "Support Team", email: "support@ilmora.ai", emoji: "💬", note: "Account & general assistance"        },
              ].map((c, i) => (
                <div key={i} className="pp-contact-card">
                  <div style={{ fontSize: 28, marginBottom: 14 }}>{c.emoji}</div>
                  <div style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 800, fontSize: 15.5, color: T.navy, marginBottom: 8,
                  }}>{c.title}</div>
                  <a href={`mailto:${c.email}`} style={{ fontSize: 13.5, fontFamily: "'DM Mono', monospace", color: T.indigo, fontWeight: 600 }}>
                    {c.email}
                  </a>
                  <div style={{ fontSize: 13, color: T.muted, fontWeight: 600, marginTop: 8, fontFamily: "'Sora', sans-serif" }}>
                    {c.note}
                  </div>
                </div>
              ))}
            </div>

            <div className="cta-btns" style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <a href="mailto:privacy@ilmora.ai" className="btn-primary">
                <Shield size={15} color="#fff" strokeWidth={2.5} />
                Contact Privacy Team
              </a>
              <a href="mailto:support@ilmora.ai" className="btn-ghost">
                <Mail size={15} color={T.orange} strokeWidth={2.2} />
                Get Support
              </a>
            </div>
          </div>
        </section>

        {/* ══ BOTTOM BAR ══ */}
        <div className="bottom-bar" style={{
          padding: "20px 32px",
          borderTop: `1px solid ${T.border}`,
          background: T.cream3,
          display: "flex", justifyContent: "space-between",
          alignItems: "center", flexWrap: "wrap", gap: 12,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <a href="/" style={{ textDecoration: "none" }}>
              <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 22, fontWeight: 900, letterSpacing: "-0.5px" }}>
                <span style={{ color: T.green }}>ILM</span>
                <span style={{ color: T.orange, marginLeft: 5 }}>ORA</span>
              </span>
            </a>
            <span style={{ color: T.muted2, fontWeight: 600, fontSize: 13, fontFamily: "'Sora', sans-serif" }}>
              © 2026 ILM ORA. All rights reserved.
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <Lock size={12} color={T.muted2} strokeWidth={2.2} />
            <span style={{ fontSize: 13, color: T.muted2, fontWeight: 600, fontFamily: "'Sora', sans-serif" }}>
              Secure & Privacy-First Platform
            </span>
          </div>
        </div>

      </div>
    </>
  );
};

export default PrivacyPolicy;