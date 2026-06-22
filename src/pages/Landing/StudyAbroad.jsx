import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight, CheckCircle2, Star, Users, Award, TrendingUp,
  ChevronDown, Globe, Clock, BookOpen, Menu, Moon, Sun,
  MapPin, GraduationCap, DollarSign, Calendar, Plane,
  FileText, ClipboardList, Phone, Mail, Shield, Zap,
  Building, Languages, Heart, Target, BarChart, ChevronRight,
  Flag, X, Send, User, MessageSquare,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import MegaMenu from "../../components/MegaMenu";

/* ─── Country flag image URLs (using flagcdn.com — free, fast, reliable) ── */
const FLAG_IMGS = {
  uk:        "https://flagcdn.com/w80/gb.png",
  usa:       "https://flagcdn.com/w80/us.png",
  canada:    "https://flagcdn.com/w80/ca.png",
  germany:   "https://flagcdn.com/w80/de.png",
  australia: "https://flagcdn.com/w80/au.png",
  ireland:   "https://flagcdn.com/w80/ie.png",
};

/* ─── Flag component — uses img tag for reliable rendering ─────────────── */
function FlagImg({ countryId, size = 48, style = {} }) {
  return (
    <img
      src={FLAG_IMGS[countryId]}
      alt={countryId}
      width={size}
      height={size * 0.6}
      style={{
        objectFit: "cover",
        borderRadius: "4px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
        display: "block",
        ...style,
      }}
      loading="lazy"
    />
  );
}

/* ─── Counselling Modal ─────────────────────────────────────────────────── */
function CounsellingModal({ isOpen, onClose, country }) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", country: country || "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (country) setForm(f => ({ ...f, country }));
  }, [country]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setSubmitted(false);
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.email) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200)); // simulate API call
    setLoading(false);
    setSubmitted(true);
  };

  const inputStyle = {
    width: "100%",
    padding: "11px 14px",
    borderRadius: "10px",
    border: "1.5px solid #e2e8f0",
    background: "#f8fafc",
    fontSize: "13px",
    fontFamily: "'Plus Jakarta Sans',sans-serif",
    color: "#1E293B",
    outline: "none",
    transition: "border-color .2s",
    boxSizing: "border-box",
  };

  const labelStyle = {
    fontSize: "11px",
    fontWeight: 700,
    color: "#64748b",
    marginBottom: "5px",
    display: "block",
    fontFamily: "'Plus Jakarta Sans',sans-serif",
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)",
          zIndex: 9998, backdropFilter: "blur(4px)",
          animation: "fadeIn .2s ease",
        }}
      />

      {/* Modal */}
      <div style={{
        position: "fixed", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        zIndex: 9999,
        background: "#ffffff",
        borderRadius: "20px",
        width: "min(520px, calc(100vw - 32px))",
        maxHeight: "90vh",
        overflowY: "auto",
        boxShadow: "0 24px 64px rgba(0,0,0,0.22)",
        animation: "slideUp .25s cubic-bezier(.16,1,.3,1)",
      }}>
        {/* Header gradient bar */}
        <div style={{ height: "4px", background: "linear-gradient(90deg,#f97316,#ec4899,#6366f1)", borderRadius: "20px 20px 0 0" }} />

        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: "16px", right: "16px",
            background: "#f1f5f9", border: "none", borderRadius: "8px",
            width: "30px", height: "30px", display: "flex",
            alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "#64748b",
          }}
        >
          <X size={16} />
        </button>

        <div style={{ padding: "22px 26px 26px" }}>
          {submitted ? (
            /* ── Success State ── */
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{
                width: "64px", height: "64px", borderRadius: "50%",
                background: "rgba(16,185,129,.1)", display: "flex",
                alignItems: "center", justifyContent: "center",
                margin: "0 auto 16px",
                border: "2px solid rgba(16,185,129,.3)",
              }}>
                <CheckCircle2 size={28} color="#10b981" />
              </div>
              <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#1E293B", marginBottom: "8px", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                You're all set! 🎉
              </h3>
              <p style={{ fontSize: "13px", color: "#64748b", lineHeight: 1.7, marginBottom: "20px", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                Our study abroad counsellor will call you within <strong>24 hours</strong> to discuss your goals and chart your path forward.
              </p>
              <div style={{
                background: "rgba(249,115,22,.05)", border: "1px solid rgba(249,115,22,.15)",
                borderRadius: "12px", padding: "14px",
              }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#f97316", marginBottom: "4px", textTransform: "uppercase", letterSpacing: ".06em" }}>What happens next?</div>
                {["Counsellor reviews your profile", "Free 30-min video/phone session", "Personalized university shortlist", "End-to-end guidance begins"].map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "7px", marginTop: "7px" }}>
                    <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: "#f97316", color: "#fff", fontSize: "9px", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</div>
                    <span style={{ fontSize: "12px", color: "#334155", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{s}</span>
                  </div>
                ))}
              </div>
              <button onClick={onClose}
                style={{ marginTop: "18px", background: "#f97316", color: "#fff", border: "none", borderRadius: "10px", padding: "11px 28px", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                Done
              </button>
            </div>
          ) : (
            /* ── Form ── */
            <>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
                <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(249,115,22,.1)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(249,115,22,.2)", flexShrink: 0 }}>
                  <Plane size={18} color="#f97316" />
                </div>
                <div>
                  <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#1E293B", margin: 0, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Book Free Counselling</h3>
                  <p style={{ fontSize: "11px", color: "#94a3b8", margin: 0, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Our expert will call you within 24 hours</p>
                </div>
              </div>

              {/* Trust badges */}
              <div style={{ display: "flex", gap: "6px", marginBottom: "18px", flexWrap: "wrap" }}>
                {[{ icon: Shield, text: "98% Visa Success", color: "#10b981" }, { icon: Star, text: "4.9★ Rated", color: "#f59e0b" }, { icon: Users, text: "5000+ Students", color: "#6366f1" }].map((b, i) => (
                  <div key={i} style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: `${b.color}10`, border: `1px solid ${b.color}25`, borderRadius: "100px", padding: "3px 10px" }}>
                    <b.icon size={10} color={b.color} />
                    <span style={{ fontSize: "10px", fontWeight: 700, color: b.color, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{b.text}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "13px" }}>
                {/* Name */}
                <div>
                  <label style={labelStyle}>Full Name *</label>
                  <input
                    style={inputStyle}
                    placeholder="e.g. Rahul Sharma"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    onFocus={e => e.target.style.borderColor = "#f97316"}
                    onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                  />
                </div>

                {/* Phone + Email */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div>
                    <label style={labelStyle}>Phone *</label>
                    <input
                      style={inputStyle}
                      placeholder="+91 9876543210"
                      value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      onFocus={e => e.target.style.borderColor = "#f97316"}
                      onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Email *</label>
                    <input
                      style={inputStyle}
                      placeholder="you@email.com"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      onFocus={e => e.target.style.borderColor = "#f97316"}
                      onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                    />
                  </div>
                </div>

                {/* Preferred Country */}
                <div>
                  <label style={labelStyle}>Preferred Country</label>
                  <select
                    style={{ ...inputStyle, cursor: "pointer" }}
                    value={form.country}
                    onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
                    onFocus={e => e.target.style.borderColor = "#f97316"}
                    onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                  >
                    <option value="">Select a country...</option>
                    <option value="uk">🇬🇧 United Kingdom</option>
                    <option value="usa">🇺🇸 United States</option>
                    <option value="canada">🇨🇦 Canada</option>
                    <option value="germany">🇩🇪 Germany</option>
                    <option value="australia">🇦🇺 Australia</option>
                    <option value="ireland">🇮🇪 Ireland</option>
                  </select>
                </div>

                {/* Education Level */}
                <div>
                  <label style={labelStyle}>Current Education Level</label>
                  <select
                    style={{ ...inputStyle, cursor: "pointer" }}
                    value={form.level || ""}
                    onChange={e => setForm(f => ({ ...f, level: e.target.value }))}
                    onFocus={e => e.target.style.borderColor = "#f97316"}
                    onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                  >
                    <option value="">Select level...</option>
                    <option value="12th">12th / Intermediate</option>
                    <option value="ug">Undergraduate (pursuing)</option>
                    <option value="graduate">Graduate / Degree holder</option>
                    <option value="pg">Postgraduate</option>
                    <option value="working">Working Professional</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label style={labelStyle}>Your Goal / Message (optional)</label>
                  <textarea
                    style={{ ...inputStyle, minHeight: "72px", resize: "vertical" }}
                    placeholder="e.g. I want to do MS in CS from a top UK university..."
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    onFocus={e => e.target.style.borderColor = "#f97316"}
                    onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading || !form.name || !form.phone || !form.email}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                    background: (!form.name || !form.phone || !form.email) ? "#e2e8f0" : "#f97316",
                    color: (!form.name || !form.phone || !form.email) ? "#94a3b8" : "#fff",
                    border: "none", borderRadius: "11px", padding: "13px",
                    fontSize: "13px", fontWeight: 700, cursor: !form.name || !form.phone || !form.email ? "not-allowed" : "pointer",
                    fontFamily: "'Plus Jakarta Sans',sans-serif",
                    transition: "all .2s",
                    boxShadow: form.name && form.phone && form.email ? "0 4px 18px rgba(249,115,22,.35)" : "none",
                  }}
                >
                  {loading ? (
                    <>
                      <div style={{ width: "14px", height: "14px", border: "2px solid rgba(255,255,255,.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin .6s linear infinite" }} />
                      Submitting...
                    </>
                  ) : (
                    <> <Send size={14} /> Book My Free Session </>
                  )}
                </button>

                <p style={{ fontSize: "10px", color: "#94a3b8", textAlign: "center", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                  🔒 Your details are safe. No spam, ever. We'll only call to help.
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translate(-50%,-44%); } to { opacity: 1; transform: translate(-50%,-50%); } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}

/* ─── Country data ──────────────────────────────────────────────────────── */
const COUNTRIES = [
  {
    id: "uk",
    name: "United Kingdom",
    shortCode: "GB",
    tagline: "World's Oldest Academic Tradition",
    color: "#003087",
    accent: "#CF142B",
    gradient: "linear-gradient(135deg,#003087 0%,#CF142B 100%)",
    heroImg: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80",
    stats: [{ label: "Universities", value: "130+" }, { label: "Avg Salary", value: "£35K" }, { label: "Work Visa", value: "2 Yrs" }, { label: "Intakes", value: "Sep/Jan" }],
    highlights: ["Oxford, Cambridge, Imperial College", "2-year Post-Study Work Visa", "QS Top 10 universities", "Shorter 1-year Masters programs", "Multicultural student community", "NHS healthcare access"],
    exams: ["IELTS 6.5+", "TOEFL 90+"],
    cost: "£15,000–£30,000/yr",
    popular: ["MBA", "Data Science", "Engineering", "Law", "Medicine"],
    badge: "Most Preferred",
  },
  {
    id: "usa",
    name: "United States",
    shortCode: "US",
    tagline: "Land of Innovation & Opportunity",
    color: "#002868",
    accent: "#BF0A30",
    gradient: "linear-gradient(135deg,#002868 0%,#BF0A30 100%)",
    heroImg: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80",
    stats: [{ label: "Universities", value: "4,000+" }, { label: "Avg Salary", value: "$75K" }, { label: "OPT Period", value: "3 Yrs" }, { label: "Intakes", value: "Jan/Aug" }],
    highlights: ["MIT, Harvard, Stanford, Caltech", "OPT + STEM extension up to 3 years", "World's largest research funding", "Silicon Valley networking access", "Campus placement programs", "F-1 student visa process"],
    exams: ["IELTS 6.5+", "GRE/GMAT", "TOEFL 80+"],
    cost: "$25,000–$55,000/yr",
    popular: ["Computer Science", "Business", "Engineering", "Finance", "Healthcare"],
    badge: "Top Destination",
  },
  {
    id: "canada",
    name: "Canada",
    shortCode: "CA",
    tagline: "Gateway to Permanent Residency",
    color: "#CC0000",
    accent: "#CC0000",
    gradient: "linear-gradient(135deg,#CC0000 0%,#FF6B6B 100%)",
    heroImg: "https://images.unsplash.com/photo-1517935706615-2717063c2225?w=600&q=80",
    stats: [{ label: "Universities", value: "96+" }, { label: "Avg Salary", value: "C$55K" }, { label: "PGWP", value: "3 Yrs" }, { label: "Intakes", value: "Jan/Sep/May" }],
    highlights: ["University of Toronto, UBC, McGill", "3-year Post-Graduate Work Permit", "Clear PR pathway via Express Entry", "Safe, welcoming environment", "Affordable tuition vs USA/UK", "3 intakes per year"],
    exams: ["IELTS 6.0+", "TOEFL 83+"],
    cost: "C$20,000–C$40,000/yr",
    popular: ["IT & Computing", "Business Analytics", "Nursing", "Engineering", "Agriculture"],
    badge: "PR Friendly",
  },
  {
    id: "germany",
    name: "Germany",
    shortCode: "DE",
    tagline: "Free Education, World-Class Research",
    color: "#D00000",
    accent: "#FFCE00",
    gradient: "linear-gradient(135deg,#1a1a1a 0%,#D00000 60%,#FFCE00 100%)",
    heroImg: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=600&q=80",
    stats: [{ label: "Universities", value: "400+" }, { label: "Tuition", value: "FREE*" }, { label: "Work Hours", value: "20/wk" }, { label: "Intakes", value: "Apr/Oct" }],
    highlights: ["TU Munich, Heidelberg, LMU", "No tuition at public universities", "EU Blue Card after graduation", "Strong engineering & tech sector", "Erasmus exchange opportunities", "18-month job seeker visa"],
    exams: ["TestDaF / DSH (German)", "IELTS 6.0+ (English programs)"],
    cost: "€0–€3,000/yr + living",
    popular: ["Engineering", "Computer Science", "Automotive", "Medicine", "Architecture"],
    badge: "Free Tuition",
  },
  {
    id: "australia",
    name: "Australia",
    shortCode: "AU",
    tagline: "Study, Work & Thrive Down Under",
    color: "#00008B",
    accent: "#FFCC00",
    gradient: "linear-gradient(135deg,#00008B 0%,#009B77 100%)",
    heroImg: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600&q=80",
    stats: [{ label: "Universities", value: "43+" }, { label: "Avg Salary", value: "A$65K" }, { label: "Work Visa", value: "4 Yrs" }, { label: "Intakes", value: "Feb/Jul" }],
    highlights: ["ANU, Melbourne, Sydney, UNSW", "Up to 4-year graduate work visa", "Beautiful lifestyle & climate", "Strong mining, IT, healthcare sectors", "Multicultural society", "Medicare access for some nationalities"],
    exams: ["IELTS 6.5+", "PTE 58+"],
    cost: "A$20,000–A$45,000/yr",
    popular: ["Nursing", "Engineering", "IT", "Business", "Environmental Science"],
    badge: "High ROI",
  },
  {
    id: "ireland",
    name: "Ireland",
    shortCode: "IE",
    tagline: "EU Hub with English-Speaking Culture",
    color: "#169B62",
    accent: "#FF883E",
    gradient: "linear-gradient(135deg,#169B62 0%,#FF883E 100%)",
    heroImg: "https://images.unsplash.com/photo-1549918864-48ac978761a4?w=600&q=80",
    stats: [{ label: "Universities", value: "34+" }, { label: "Avg Salary", value: "€45K" }, { label: "Stay-Back", value: "2 Yrs" }, { label: "Intakes", value: "Sep/Jan" }],
    highlights: ["Trinity College Dublin, UCD", "EU country with English instruction", "Home to Google, Meta, Apple EU HQs", "2-year stay-back visa option", "Gateway to EU job market", "Friendly immigration policies"],
    exams: ["IELTS 6.0+", "TOEFL 79+"],
    cost: "€10,000–€25,000/yr",
    popular: ["Business", "Pharma", "IT", "Data Analytics", "Finance"],
    badge: "EU Gateway",
  },
];

const EXAMS = [
  { name: "IELTS", Icon: FileText, color: "#6366f1", desc: "International English Language Testing System — accepted by 10,000+ institutions in 140+ countries.", score: "Band 6.0–8.0", duration: "2 hrs 45 min", prep: "8–12 weeks" },
  { name: "TOEFL", Icon: ClipboardList, color: "#10b981", desc: "Test of English as a Foreign Language — preferred by US universities and institutions.", score: "79–120", duration: "3 hrs", prep: "6–10 weeks" },
  { name: "GRE", Icon: BarChart, color: "#f59e0b", desc: "Graduate Record Examination — required for most US/Canada Master's programs.", score: "300–340", duration: "3 hrs 45 min", prep: "10–16 weeks" },
  { name: "GMAT", Icon: Target, color: "#ec4899", desc: "Graduate Management Admission Test — required for MBA programs worldwide.", score: "600–750+", duration: "3 hrs 7 min", prep: "10–16 weeks" },
];

const STEPS = [
  { step: "01", title: "Free Counselling", desc: "Discuss your profile, goals, and budget with our certified study abroad advisor.", Icon: Phone },
  { step: "02", title: "Country & Course Selection", desc: "We shortlist universities matching your academics, budget, and career goals.", Icon: Globe },
  { step: "03", title: "Application & Documentation", desc: "Complete applications with SOP, LOR, and document verification handled by us.", Icon: FileText },
  { step: "04", title: "Visa & Pre-Departure", desc: "Visa guidance, forex, travel prep, and arrival orientation — we stay with you.", Icon: Plane },
];

const STATS_HERO = [
  { value: "5,000+", label: "Students Placed", Icon: Users },
  { value: "98%", label: "Visa Success Rate", Icon: Shield },
  { value: "40+", label: "Countries", Icon: Globe },
  { value: "4.9★", label: "Rating", Icon: Star },
];

const FAQS = [
  { q: "Which country is best for Indian students?", a: "Canada and UK are currently most popular due to post-study work permits and PR pathways. However, the best country depends on your course, budget, and career goals — our counsellors help you decide." },
  { q: "What IELTS score do I need to study abroad?", a: "Most universities require IELTS 6.0–6.5 for UG and 6.5–7.0 for PG programs. Germany's English-taught programs may accept 6.0. Our IELTS prep program can help you reach your target score." },
  { q: "Can I work while studying abroad?", a: "Yes! UK allows 20hrs/week, Canada allows 20hrs/week (unlimited off-campus from Nov 2024), Australia allows 48hrs/fortnight, and USA allows 20hrs/week on-campus." },
  { q: "How early should I start the application process?", a: "Ideally 12–18 months before your intended intake. Applications for September intake open as early as October the previous year." },
  { q: "What is the total cost of studying abroad?", a: "It varies widely: Germany can cost as little as €10,000/yr (living only), while USA/UK can reach $60,000–$80,000/yr including living. Our counsellors help plan scholarships and education loans." },
  { q: "Does ILM ORA help with scholarships?", a: "Yes! We actively identify merit-based, government, and university scholarships your profile qualifies for and guide you through the application process." },
];

const F = "'Plus Jakarta Sans','Segoe UI',system-ui,sans-serif";
const W = "1100px";

const GLOBAL = `
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  .mob-only{display:none!important;}
  @media(max-width:1279px){
    .desk-nav{display:none!important;}
    .mob-only{display:flex!important;}
  }
  .nav-lnk{
    background:transparent;border:none;padding:7px 13px;border-radius:8px;
    font-size:14px;font-weight:600;cursor:pointer;transition:color .2s,background .2s;
    white-space:nowrap;color:#1E293B;
  }
  html.dark .nav-lnk{color:#e2e8f0!important;}
  .nav-lnk:hover{color:#f97316!important;background:rgba(249,115,22,.07)!important;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
  .flag-float{animation:float 3s ease-in-out infinite;}
  .sa-card-hover:hover{transform:translateY(-4px);box-shadow:0 16px 40px rgba(0,0,0,.14)!important;}
  .sa-card-hover{transition:all .25s ease;}
  .exam-card:hover{transform:translateY(-2px);}
  .exam-card{transition:all .2s;}
`;

/* ─── Navbar ─────────────────────────────────────────────────────────────── */
function Navbar({ isDark, toggleTheme, onCounselClick }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const NAV = [
    { label: "Mentors", path: "/mentors" },
    { label: "Success Stories", path: "/success-stories" },
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
            <div onClick={() => navigate("/")} style={{ cursor: "pointer", flexShrink: 0 }}>
              <span style={{ fontSize: "clamp(22px,2.8vw,28px)", fontWeight: 900, fontFamily: "Georgia,serif", lineHeight: 1 }}>
                <span style={{ color: "#16a34a" }}>ILM</span>
                <span style={{ color: "#f97316", marginLeft: "3px" }}>ORA</span>
              </span>
            </div>
            <div className="desk-nav" style={{ display: "flex", alignItems: "center", gap: "2px", flex: 1, justifyContent: "center", margin: "0 16px" }}>
              <MegaMenu />
              {NAV.map(l => (
                <button key={l.label} className="nav-lnk" onClick={() => navigate(l.path)} style={{ fontFamily: F }}>{l.label}</button>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "9px", flexShrink: 0 }}>
              <button onClick={toggleTheme} style={btnBase}>
                {isDark ? <Sun style={{ width: "16px", height: "16px", color: "#f97316" }} /> : <Moon style={{ width: "16px", height: "16px", color: "#475569" }} />}
              </button>
              <div className="mob-only" style={{ alignItems: "center" }}>
                <Sheet open={open} onOpenChange={setOpen}>
                  <SheetTrigger asChild>
                    <button style={btnBase}>
                      <Menu style={{ width: "18px", height: "18px", color: isDark ? "#e2e8f0" : "#1E293B" }} />
                    </button>
                  </SheetTrigger>
                  <SheetContent side="right" style={{ background: isDark ? "#0c0c14" : "#fff", width: "280px", padding: 0 }}>
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
                        <button key={l.label} onClick={() => { navigate(l.path); setOpen(false); }}
                          style={{ color: mLinkClr, background: "transparent", border: "none", padding: "11px 10px", borderRadius: "9px", fontSize: "14px", fontWeight: 600, cursor: "pointer", textAlign: "left", width: "100%", fontFamily: F }}
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

const Pill = ({ children }) => (
  <span style={{ display: "inline-block", fontSize: "10px", fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", color: "#f97316", background: "rgba(249,115,22,.08)", border: "1px solid rgba(249,115,22,.2)", borderRadius: "100px", padding: "3px 13px" }}>
    {children}
  </span>
);

function SectionHead({ pill, title, sub, tp, ts }) {
  return (
    <div style={{ textAlign: "center", marginBottom: "32px" }}>
      <Pill>{pill}</Pill>
      <h2 style={{ fontSize: "clamp(20px,3vw,32px)", fontWeight: 800, color: tp, marginTop: "10px", marginBottom: "8px", fontFamily: F, lineHeight: 1.2 }}
        dangerouslySetInnerHTML={{ __html: title }} />
      {sub && <p style={{ color: ts, fontSize: "clamp(12px,1.3vw,14px)", maxWidth: "500px", margin: "0 auto", lineHeight: 1.6 }}>{sub}</p>}
    </div>
  );
}

/* ─── MAIN ───────────────────────────────────────────────────────────────── */
export default function StudyAbroad() {
  const navigate = useNavigate();
  const [faq, setFaq] = useState(null);
  const [theme, setTheme] = useState("light");
  const [activeCountry, setActiveCountry] = useState("uk");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCountry, setModalCountry] = useState("");

  const isDark = theme === "dark";
  useEffect(() => { document.documentElement.classList.toggle("dark", isDark); }, [isDark]);
  useEffect(() => { window.scrollTo({ top: 0 }); }, []);

  /* Open modal helper */
  const openCounsel = (countryId = "") => {
    setModalCountry(countryId);
    setModalOpen(true);
  };

  const BG = isDark ? "#0c0c14" : "#F5EDE6";
  const CARD = isDark ? "#13131e" : "#ffffff";
  const BDR = isDark ? "rgba(255,255,255,.08)" : "#e8e8e8";
  const TP = isDark ? "#f1f5f9" : "#1E293B";
  const TS = isDark ? "#94a3b8" : "#64748b";
  const SW = isDark ? "#0f0f18" : "#ffffff";
  const ST = isDark ? "#0c0c14" : "#F5EDE6";
  const SD = isDark ? "#07070e" : "#1E293B";
  const IC = isDark ? "rgba(255,255,255,.03)" : "#f9f9f9";
  const SP = "clamp(36px,5vw,56px) clamp(14px,3vw,20px)";

  const current = COUNTRIES.find(c => c.id === activeCountry);

  /* ── Floating flag rows for hero (real images) ── */
  const heroFlagIds = ["uk", "usa", "canada", "germany", "australia", "ireland"];

  return (
    <div style={{ fontFamily: F, background: BG, minHeight: "100vh", color: TP, transition: "background .3s,color .3s" }}>
      <Navbar isDark={isDark} toggleTheme={() => setTheme(p => p === "dark" ? "light" : "dark")} onCounselClick={() => openCounsel()} />
      <div style={{ height: "60px" }} />

      {/* ── COUNSELLING MODAL ────────────────────────────────────────────── */}
      <CounsellingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        country={modalCountry}
      />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section style={{ background: "linear-gradient(135deg,#0a1628 0%,#0f172a 50%,#1a1035 100%)", padding: "clamp(50px,8vw,90px) clamp(14px,3vw,20px) clamp(40px,6vw,70px)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-80px", right: "-80px", width: "320px", height: "320px", borderRadius: "50%", background: "rgba(249,115,22,.06)", filter: "blur(80px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-60px", left: "-60px", width: "240px", height: "240px", borderRadius: "50%", background: "rgba(99,102,241,.06)", filter: "blur(80px)", pointerEvents: "none" }} />

        {/* Floating flag images background */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
          {heroFlagIds.map((id, i) => (
            <div key={id} style={{
              position: "absolute",
              opacity: 0.08,
              animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.4}s`,
              top: `${10 + (i * 14)}%`,
              left: `${i % 2 === 0 ? 2 + i * 8 : 88 - i * 8}%`,
            }}>
              <FlagImg countryId={id} size={64} style={{ borderRadius: "6px", opacity: 1 }} />
            </div>
          ))}
        </div>

        <div style={{ maxWidth: W, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "18px", flexWrap: "wrap" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "7px", background: "rgba(249,115,22,.11)", border: "1px solid rgba(249,115,22,.28)", borderRadius: "100px", padding: "4px 14px" }}>
              <Plane size={12} color="#f97316" />
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#f97316", letterSpacing: ".04em" }}>ILM ORA — Study Abroad</span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,380px),1fr))", gap: "clamp(24px,4vw,48px)", alignItems: "center" }}>
            <div>
              <h1 style={{ fontSize: "clamp(28px,5vw,54px)", fontWeight: 800, color: "#fff", lineHeight: 1.1, marginBottom: "16px", fontFamily: F }}>
                Your Dream University.<br />
                <span style={{ color: "#f97316" }}>Any Country.</span><br />
                <span style={{ color: "#94a3b8", fontSize: "0.75em", fontWeight: 600 }}>We Get You There.</span>
              </h1>
              <p style={{ fontSize: "clamp(12px,1.5vw,15px)", color: "#94a3b8", maxWidth: "440px", lineHeight: 1.75, marginBottom: "26px" }}>
                From IELTS prep to visa filing — ILM ORA Study Abroad is your end-to-end partner for studying in UK, USA, Canada, Germany, Australia & Ireland.
              </p>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <button onClick={() => document.getElementById("countries")?.scrollIntoView({ behavior: "smooth" })}
                  style={{ display: "inline-flex", alignItems: "center", gap: "7px", background: "#f97316", color: "#fff", border: "none", borderRadius: "10px", padding: "11px 22px", fontSize: "13px", fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 18px rgba(249,115,22,.32)", fontFamily: F, transition: "all .2s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#ea6c0a"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#f97316"; e.currentTarget.style.transform = "none"; }}>
                  Explore Countries <ArrowRight size={14} />
                </button>
                <button onClick={() => document.getElementById("exams")?.scrollIntoView({ behavior: "smooth" })}
                  style={{ display: "inline-flex", alignItems: "center", gap: "7px", background: "rgba(255,255,255,.08)", color: "#e2e8f0", border: "1px solid rgba(255,255,255,.15)", borderRadius: "10px", padding: "11px 22px", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: F, transition: "all .2s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,.14)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,.08)"; }}>
                  Exam Prep <BookOpen size={14} />
                </button>
              </div>
              {/* Stats */}
              <div style={{ display: "flex", gap: "clamp(14px,2.5vw,28px)", marginTop: "36px", flexWrap: "wrap" }}>
                {STATS_HERO.map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(249,115,22,.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <s.Icon size={13} color="#f97316" />
                    </div>
                    <div>
                      <div style={{ fontSize: "clamp(13px,1.4vw,16px)", fontWeight: 800, color: "#fff" }}>{s.value}</div>
                      <div style={{ fontSize: "9px", color: "#64748b", fontWeight: 500 }}>{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero country flags grid — REAL FLAG IMAGES */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "10px" }}>
              {COUNTRIES.map((c) => (
                <div key={c.id}
                  onClick={() => { setActiveCountry(c.id); document.getElementById("countries")?.scrollIntoView({ behavior: "smooth" }); }}
                  style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", borderRadius: "14px", padding: "14px 10px", textAlign: "center", cursor: "pointer", transition: "all .2s", backdropFilter: "blur(10px)" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(249,115,22,.12)"; e.currentTarget.style.borderColor = "rgba(249,115,22,.4)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,.1)"; e.currentTarget.style.transform = "none"; }}>
                  {/* Real flag image */}
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: "8px" }}>
                    <FlagImg countryId={c.id} size={52} />
                  </div>
                  <div style={{ fontSize: "clamp(9px,1vw,10px)", fontWeight: 700, color: "#e2e8f0", lineHeight: 1.2 }}>{c.name}</div>
                  {c.badge && <div style={{ fontSize: "8px", fontWeight: 700, color: "#f97316", background: "rgba(249,115,22,.15)", borderRadius: "100px", padding: "2px 6px", marginTop: "4px", display: "inline-block" }}>{c.badge}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── COUNTRIES DEEP DIVE ───────────────────────────────────────────── */}
      <section id="countries" style={{ padding: SP, background: SW, transition: "background .3s" }}>
        <div style={{ maxWidth: W, margin: "0 auto" }}>
          <SectionHead pill="Destinations"
            title={`Choose your <span style="color:#f97316">dream country</span>`}
            sub="Each country offers unique advantages. Explore in detail and find the perfect fit for your goals."
            tp={TP} ts={TS} />

          {/* Country tab pills with real flag images */}
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "center", marginBottom: "24px" }}>
            {COUNTRIES.map(c => {
              const isA = c.id === activeCountry;
              return (
                <button key={c.id} onClick={() => setActiveCountry(c.id)}
                  style={{ display: "inline-flex", alignItems: "center", gap: "7px", padding: "7px 14px", borderRadius: "100px", border: isA ? `2px solid ${c.color}` : `2px solid ${BDR}`, background: isA ? c.color : CARD, color: isA ? "#fff" : TS, fontSize: "clamp(10px,1.1vw,12px)", fontWeight: 700, cursor: "pointer", transition: "all .2s", boxShadow: isA ? `0 3px 12px ${c.color}55` : "none", fontFamily: F }}>
                  <FlagImg countryId={c.id} size={20} style={{ borderRadius: "3px", boxShadow: "none" }} />
                  {c.name}
                </button>
              );
            })}
          </div>

          {/* Country detail card */}
          {current && (
            <div style={{ background: CARD, borderRadius: "18px", overflow: "hidden", boxShadow: isDark ? "0 8px 36px rgba(0,0,0,.5)" : "0 6px 28px rgba(0,0,0,.09)", border: `1px solid ${current.color}30`, transition: "all .3s" }}>
              <div style={{ height: "4px", background: current.gradient }} />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,320px),1fr))" }}>
                {/* Left: Info */}
                <div style={{ padding: "clamp(18px,3vw,32px)", borderRight: `1px solid ${BDR}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "14px" }}>
                    {/* Big flag image */}
                    <FlagImg countryId={current.id} size={72} style={{ borderRadius: "8px" }} />
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                        <h3 style={{ fontSize: "clamp(16px,2vw,22px)", fontWeight: 800, color: TP, fontFamily: F }}>{current.name}</h3>
                        <span style={{ fontSize: "9px", fontWeight: 700, background: current.color, color: "#fff", borderRadius: "100px", padding: "3px 8px" }}>{current.badge}</span>
                      </div>
                      <div style={{ fontSize: "11px", color: current.color, fontWeight: 600, marginTop: "2px" }}>{current.tagline}</div>
                    </div>
                  </div>

                  {/* Quick stats */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "8px", marginBottom: "18px" }}>
                    {current.stats.map((s, i) => (
                      <div key={i} style={{ background: IC, borderRadius: "10px", padding: "10px 12px", border: `1px solid ${BDR}` }}>
                        <div style={{ fontSize: "clamp(14px,1.8vw,18px)", fontWeight: 800, color: current.color, fontFamily: F }}>{s.value}</div>
                        <div style={{ fontSize: "10px", color: TS, fontWeight: 500, marginTop: "2px" }}>{s.label}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "5px", background: "rgba(249,115,22,.08)", borderRadius: "8px", padding: "6px 10px", border: "1px solid rgba(249,115,22,.15)" }}>
                      <DollarSign size={11} color="#f97316" />
                      <span style={{ fontSize: "10px", fontWeight: 700, color: TP }}>{current.cost}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "18px" }}>
                    {current.exams.map((e, i) => (
                      <span key={i} style={{ fontSize: "10px", fontWeight: 700, color: "#6366f1", background: "rgba(99,102,241,.08)", border: "1px solid rgba(99,102,241,.2)", borderRadius: "6px", padding: "4px 8px" }}>{e}</span>
                    ))}
                  </div>

                  <div style={{ marginBottom: "18px" }}>
                    <div style={{ fontSize: "9px", fontWeight: 800, textTransform: "uppercase", letterSpacing: ".08em", color: TS, marginBottom: "8px" }}>Popular Courses</div>
                    <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                      {current.popular.map((p, i) => (
                        <span key={i} style={{ fontSize: "10px", fontWeight: 600, color: TP, background: IC, border: `1px solid ${BDR}`, borderRadius: "6px", padding: "4px 8px" }}>{p}</span>
                      ))}
                    </div>
                  </div>

                  {/* ── CTA Button — opens modal ── */}
                  <button
                    onClick={() => openCounsel(current.id)}
                    style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: current.color, color: "#fff", border: "none", borderRadius: "10px", padding: "10px 20px", fontSize: "12px", fontWeight: 700, cursor: "pointer", boxShadow: `0 4px 14px ${current.color}55`, fontFamily: F, transition: "opacity .2s" }}
                    onMouseEnter={e => e.currentTarget.style.opacity = ".85"} onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                    Get Free Counselling <ArrowRight size={12} />
                  </button>
                </div>

                {/* Right: Highlights */}
                <div style={{ padding: "clamp(18px,3vw,32px)", background: IC }}>
                  <div style={{ fontSize: "9px", fontWeight: 800, textTransform: "uppercase", letterSpacing: ".08em", color: TS, marginBottom: "14px" }}>Why Study in {current.name}</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "11px" }}>
                    {current.highlights.map((h, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "9px" }}>
                        <CheckCircle2 size={14} color={current.color} style={{ flexShrink: 0, marginTop: "2px" }} />
                        <span style={{ fontSize: "12px", color: isDark ? "#cbd5e1" : "#334155", lineHeight: 1.55, fontWeight: 500 }}>{h}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: "20px", background: `${current.color}0e`, border: `1px solid ${current.color}22`, borderRadius: "12px", padding: "14px" }}>
                    <div style={{ fontSize: "9px", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", color: current.color, marginBottom: "5px" }}>Next Intake</div>
                    <div style={{ fontSize: "14px", fontWeight: 800, color: TP, fontFamily: F }}>September 2026</div>
                    <div style={{ fontSize: "10px", color: TS, marginTop: "3px" }}>Applications closing soon — apply early for scholarships</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mini country cards with real flag images */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,150px),1fr))", gap: "9px", marginTop: "14px" }}>
            {COUNTRIES.map(c => (
              <div key={c.id} onClick={() => setActiveCountry(c.id)}
                className="sa-card-hover"
                style={{ background: CARD, borderRadius: "12px", padding: "14px", border: `2px solid ${c.id === activeCountry ? c.color : BDR}`, cursor: "pointer", textAlign: "center", boxShadow: c.id === activeCountry ? `0 4px 14px ${c.color}33` : "none" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "7px" }}>
                  <FlagImg countryId={c.id} size={40} />
                </div>
                <div style={{ fontWeight: 700, fontSize: "10px", color: TP, fontFamily: F, marginBottom: "2px" }}>{c.name}</div>
                <div style={{ fontSize: "9px", color: c.color, fontWeight: 600 }}>{c.badge}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXAM PREP ─────────────────────────────────────────────────────── */}
      <section id="exams" style={{ padding: SP, background: ST, transition: "background .3s" }}>
        <div style={{ maxWidth: W, margin: "0 auto" }}>
          <SectionHead pill="Exam Preparation"
            title={`Ace your <span style="color:#f97316">language & aptitude tests</span>`}
            sub="We offer guided preparation for all major exams required for overseas admissions."
            tp={TP} ts={TS} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,220px),1fr))", gap: "11px" }}>
            {EXAMS.map((exam, i) => (
              <div key={i} className="exam-card"
                style={{ background: CARD, borderRadius: "14px", padding: "clamp(14px,2vw,20px)", border: `1px solid ${BDR}`, boxShadow: "none" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = exam.color + "55"; e.currentTarget.style.boxShadow = `0 6px 20px ${exam.color}18`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = BDR; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "11px", background: exam.color + "18", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px", border: `1px solid ${exam.color}22` }}>
                  <exam.Icon size={18} color={exam.color} />
                </div>
                <h4 style={{ fontSize: "clamp(15px,1.8vw,18px)", fontWeight: 800, color: TP, fontFamily: F, marginBottom: "5px" }}>{exam.name}</h4>
                <p style={{ fontSize: "11px", color: TS, lineHeight: 1.6, marginBottom: "14px" }}>{exam.desc}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                  {[{ label: "Score Range", val: exam.score }, { label: "Duration", val: exam.duration }, { label: "Prep Time", val: exam.prep }].map((row, ri) => (
                    <div key={ri} style={{ display: "flex", justifyContent: "space-between", fontSize: "10px" }}>
                      <span style={{ color: TS, fontWeight: 500 }}>{row.label}</span>
                      <span style={{ color: exam.color, fontWeight: 700 }}>{row.val}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => openCounsel()}
                  style={{ marginTop: "14px", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", background: exam.color + "15", color: exam.color, border: `1px solid ${exam.color}30`, borderRadius: "8px", padding: "8px", fontSize: "11px", fontWeight: 700, cursor: "pointer", fontFamily: F, transition: "all .2s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = exam.color; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = exam.color + "15"; e.currentTarget.style.color = exam.color; }}>
                  Start Prep <ChevronRight size={11} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section style={{ padding: SP, background: SW, transition: "background .3s" }}>
        <div style={{ maxWidth: W, margin: "0 auto" }}>
          <SectionHead pill="Our Process"
            title={`From dream to <span style="color:#f97316">departure</span>`}
            sub="We handle every step so you can focus on what matters — your future."
            tp={TP} ts={TS} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,200px),1fr))", gap: "12px" }}>
            {STEPS.map((s, i) => (
              <div key={i}
                style={{ textAlign: "center", padding: "clamp(18px,2.5vw,28px) clamp(12px,1.8vw,18px)", background: IC, borderRadius: "14px", border: `1px solid ${BDR}`, transition: "all .2s", position: "relative" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#fed7aa"; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 6px 18px rgba(249,115,22,.1)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = BDR; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "rgba(249,115,22,.12)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", border: "1px solid rgba(249,115,22,.2)" }}>
                  <s.Icon size={20} color="#f97316" />
                </div>
                <div style={{ fontSize: "clamp(28px,4vw,38px)", fontWeight: 900, color: "#f97316", lineHeight: 1, marginBottom: "10px", fontFamily: F }}>{s.step}</div>
                <h4 style={{ fontSize: "clamp(12px,1.3vw,13px)", fontWeight: 800, color: TP, marginBottom: "6px", fontFamily: F }}>{s.title}</h4>
                <p style={{ fontSize: "11px", color: TS, lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY ILM ORA ──────────────────────────────────────────────────── */}
      <section style={{ padding: SP, background: SD }}>
        <div style={{ maxWidth: W, margin: "0 auto" }}>
          <SectionHead pill="Why Choose Us"
            title={`Your trusted partner <span style="color:#f97316">abroad</span>`}
            tp="#ffffff" ts="#94a3b8" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,230px),1fr))", gap: "11px" }}>
            {[
              { Icon: Shield, title: "98% Visa Success", desc: "Our expert visa team has secured approvals for thousands of students across all major countries.", color: "#10b981" },
              { Icon: Globe, title: "40+ Countries", desc: "We have partnerships and expertise spanning 40+ destination countries worldwide.", color: "#6366f1" },
              { Icon: Award, title: "Scholarship Support", desc: "We actively identify and apply for scholarships that can reduce your tuition by 30–100%.", color: "#f59e0b" },
              { Icon: Users, title: "End-to-End Support", desc: "From choosing a course to landing at your destination — we're with you at every step.", color: "#ec4899" },
              { Icon: Phone, title: "Dedicated Counsellor", desc: "One dedicated counsellor assigned to your profile throughout the entire journey.", color: "#f97316" },
              { Icon: Languages, title: "Exam Preparation", desc: "In-house IELTS, TOEFL, GRE & GMAT coaching to help you hit your target scores.", color: "#14b8a6" },
            ].map((item, i) => (
              <div key={i}
                style={{ background: "rgba(255,255,255,.05)", borderRadius: "12px", padding: "clamp(14px,2vw,18px)", border: "1px solid rgba(255,255,255,.07)", transition: "all .2s", display: "flex", gap: "12px", alignItems: "flex-start" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,.09)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,.05)"; e.currentTarget.style.transform = "none"; }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: item.color + "20", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: `1px solid ${item.color}30` }}>
                  <item.Icon size={15} color={item.color} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "12px", color: "#f1f5f9", marginBottom: "4px" }}>{item.title}</div>
                  <div style={{ fontSize: "11px", color: "#94a3b8", lineHeight: 1.55 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section style={{ padding: SP, background: ST, transition: "background .3s" }}>
        <div style={{ maxWidth: "660px", margin: "0 auto" }}>
          <SectionHead pill="FAQ"
            title={`Frequently asked <span style="color:#f97316">questions</span>`}
            tp={TP} ts={TS} />
          <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
            {FAQS.map((f, i) => (
              <div key={i} style={{ background: CARD, borderRadius: "12px", border: `1px solid ${faq === i ? "#fed7aa" : BDR}`, overflow: "hidden", transition: "all .2s", boxShadow: faq === i ? "0 3px 14px rgba(249,115,22,.07)" : "none" }}>
                <button onClick={() => setFaq(faq === i ? null : i)}
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "clamp(12px,1.6vw,15px) clamp(14px,1.8vw,18px)", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", gap: "8px" }}>
                  <span style={{ fontSize: "clamp(11px,1.2vw,13px)", fontWeight: 700, color: TP, fontFamily: F }}>{f.q}</span>
                  <ChevronDown size={13} color="#94a3b8" style={{ flexShrink: 0, transform: faq === i ? "rotate(180deg)" : "none", transition: "transform .25s" }} />
                </button>
                {faq === i && <div style={{ padding: "0 clamp(14px,1.8vw,18px) clamp(11px,1.5vw,14px)", fontSize: "12px", color: TS, lineHeight: 1.7 }}>{f.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section style={{ padding: SP, background: "linear-gradient(135deg,#0a1628 0%,#0f172a 60%,#1a1035 100%)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: "linear-gradient(90deg,#f97316,#ec4899,#6366f1)" }} />
        <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "280px", height: "280px", borderRadius: "50%", background: "rgba(249,115,22,.06)", filter: "blur(80px)", pointerEvents: "none" }} />
        {/* Floating flag images in CTA */}
        {["uk", "usa", "canada", "germany"].map((id, i) => (
          <div key={id} style={{ position: "absolute", opacity: 0.06, bottom: `${10 + i * 15}%`, left: `${5 + i * 22}%`, animation: `float ${2.5 + i * 0.3}s ease-in-out infinite`, animationDelay: `${i * 0.5}s` }}>
            <FlagImg countryId={id} size={48} />
          </div>
        ))}
        <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: "clamp(40px,6vw,64px)", marginBottom: "14px" }}>✈️</div>
          <h2 style={{ fontSize: "clamp(20px,3.5vw,38px)", fontWeight: 800, color: "#fff", marginBottom: "12px", lineHeight: 1.2, fontFamily: F }}>
            Ready to study <span style={{ color: "#f97316" }}>abroad?</span>
          </h2>
          <p style={{ fontSize: "clamp(12px,1.4vw,14px)", color: "#94a3b8", marginBottom: "26px", lineHeight: 1.7 }}>
            Book your free 30-minute counselling session today. Our experts will map out your entire journey — from university selection to visa approval.
          </p>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
            {/* ── Main CTA — opens modal ── */}
            <button
              onClick={() => openCounsel()}
              style={{ display: "inline-flex", alignItems: "center", gap: "7px", background: "#f97316", color: "#fff", border: "none", borderRadius: "10px", padding: "12px 26px", fontSize: "13px", fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 20px rgba(249,115,22,.38)", fontFamily: F, transition: "all .2s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#ea6c0a"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#f97316"; e.currentTarget.style.transform = "none"; }}>
              Book Free Counselling <ArrowRight size={14} />
            </button>
            <button onClick={() => navigate("/")}
              style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "transparent", color: "#94a3b8", border: "1px solid rgba(255,255,255,.15)", borderRadius: "10px", padding: "12px 22px", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: F, transition: "all .2s" }}
              onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "rgba(255,255,255,.35)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "#94a3b8"; e.currentTarget.style.borderColor = "rgba(255,255,255,.15)"; }}>
              ← Back to Home
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}