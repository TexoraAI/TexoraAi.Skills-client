import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";

// ─── SVG Icons ────────────────────────────────────────────────
const Icons = {
  Save: () => (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
      <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
      <polyline points="17 21 17 13 7 13 7 21"/>
      <polyline points="7 3 7 8 15 8"/>
    </svg>
  ),
  Check: () => (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
      <path d="M20 6L9 17l-5-5"/>
    </svg>
  ),
  Building: ({ color = "#8b5cf6" }) => (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <rect x={2} y={3} width={20} height={18} rx={2}/>
      <path d="M8 21V9h8v12M2 9h20"/>
      <path d="M10 13h4M10 17h4"/>
    </svg>
  ),
  Flag: ({ color = "#8b5cf6" }) => (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
      <line x1={4} y1={22} x2={4} y2={15}/>
    </svg>
  ),
  Bell: ({ color = "#8b5cf6" }) => (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 01-3.46 0"/>
    </svg>
  ),
  Sliders: ({ color = "#8b5cf6" }) => (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <line x1={4}  y1={21} x2={4}  y2={14}/>
      <line x1={4}  y1={10} x2={4}  y2={3}/>
      <line x1={12} y1={21} x2={12} y2={12}/>
      <line x1={12} y1={8}  x2={12} y2={3}/>
      <line x1={20} y1={21} x2={20} y2={16}/>
      <line x1={20} y1={12} x2={20} y2={3}/>
      <line x1={1}  y1={14} x2={7}  y2={14}/>
      <line x1={9}  y1={8}  x2={15} y2={8}/>
      <line x1={17} y1={16} x2={23} y2={16}/>
    </svg>
  ),
  AlertTriangle: ({ color = "#ef4444", size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
      <line x1={12} y1={9}  x2={12} y2={13}/>
      <line x1={12} y1={17} x2={12.01} y2={17}/>
    </svg>
  ),
  // Field-specific icons
  Tag: ({ color = "#64748b" }) => (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
      <line x1={7} y1={7} x2={7.01} y2={7}/>
    </svg>
  ),
  Mail: ({ color = "#64748b" }) => (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  ),
  Globe: ({ color = "#64748b" }) => (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <circle cx={12} cy={12} r={10}/>
      <line x1={2} y1={12} x2={22} y2={12}/>
      <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
    </svg>
  ),
  Clock: ({ color = "#64748b" }) => (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <circle cx={12} cy={12} r={10}/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  Type: ({ color = "#64748b" }) => (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <polyline points="4 7 4 4 20 4 20 7"/>
      <line x1={9} y1={20} x2={15} y2={20}/>
      <line x1={12} y1={4} x2={12} y2={20}/>
    </svg>
  ),
  DollarSign: ({ color = "#64748b" }) => (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <line x1={12} y1={1} x2={12} y2={23}/>
      <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
    </svg>
  ),
  // Limit icons
  BookOpen: ({ color = "#64748b" }) => (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/>
      <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/>
    </svg>
  ),
  Users: ({ color = "#64748b" }) => (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
      <circle cx={9} cy={7} r={4}/>
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
    </svg>
  ),
  Video: ({ color = "#64748b" }) => (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <polygon points="23 7 16 12 23 17 23 7"/>
      <rect x={1} y={5} width={15} height={14} rx={2} ry={2}/>
    </svg>
  ),
  HardDrive: ({ color = "#64748b" }) => (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <line x1={22} y1={12} x2={2} y2={12}/>
      <path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/>
      <line x1={6} y1={16} x2={6.01} y2={16}/>
      <line x1={10} y1={16} x2={10.01} y2={16}/>
    </svg>
  ),
  Timer: ({ color = "#64748b" }) => (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <circle cx={12} cy={13} r={8}/>
      <path d="M12 9v4l2 2M12 5V3M10 3h4"/>
    </svg>
  ),
  Group: ({ color = "#64748b" }) => (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <rect x={2} y={7} width={20} height={14} rx={2}/>
      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
      <line x1={12} y1={12} x2={12} y2={16}/>
      <line x1={10} y1={14} x2={14} y2={14}/>
    </svg>
  ),
  // Toggle-specific icons
  UserPlus: ({ color = "#64748b" }) => (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
      <circle cx={8.5} cy={7} r={4}/>
      <line x1={20} y1={8} x2={20} y2={14}/>
      <line x1={23} y1={11} x2={17} y2={11}/>
    </svg>
  ),
  UserCheck: ({ color = "#64748b" }) => (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
      <circle cx={8.5} cy={7} r={4}/>
      <polyline points="17 11 19 13 23 9"/>
    </svg>
  ),
  ShieldCheck: ({ color = "#64748b" }) => (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <polyline points="9 12 11 14 15 10"/>
    </svg>
  ),
  FileText: ({ color = "#64748b" }) => (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1={16} y1={13} x2={8} y2={13}/>
      <line x1={16} y1={17} x2={8} y2={17}/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
  Video2: ({ color = "#64748b" }) => (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <polygon points="23 7 16 12 23 17 23 7"/>
      <rect x={1} y={5} width={15} height={14} rx={2} ry={2}/>
    </svg>
  ),
  Award: ({ color = "#64748b" }) => (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <circle cx={12} cy={8} r={7}/>
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
    </svg>
  ),
  MessageSquare: ({ color = "#64748b" }) => (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
    </svg>
  ),
  Cpu: ({ color = "#64748b" }) => (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <rect x={9} y={9} width={6} height={6}/>
      <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/>
      <rect x={2} y={2} width={20} height={20} rx={2}/>
    </svg>
  ),
  Moon: ({ color = "#64748b" }) => (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
    </svg>
  ),
  AlertOctagon: ({ color = "#ef4444" }) => (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/>
      <line x1={12} y1={8}  x2={12} y2={12}/>
      <line x1={12} y1={16} x2={12.01} y2={16}/>
    </svg>
  ),
  // Notification icons
  MailCheck: ({ color = "#64748b" }) => (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  ),
  Smartphone: ({ color = "#64748b" }) => (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <rect x={5} y={2} width={14} height={20} rx={2} ry={2}/>
      <line x1={12} y1={18} x2={12.01} y2={18}/>
    </svg>
  ),
  BellRing: ({ color = "#64748b" }) => (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 01-3.46 0"/>
      <path d="M20.89 10.69A9 9 0 003.1 10.7"/>
    </svg>
  ),
  Newspaper: ({ color = "#64748b" }) => (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v16a2 2 0 01-2 2zm0 0a2 2 0 01-2-2v-9c0-1.1.9-2 2-2h2"/>
      <path d="M18 14h-8M15 18h-5M10 6h8v4h-8z"/>
    </svg>
  ),
  ShieldAlert: ({ color = "#64748b" }) => (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <line x1={12} y1={8}  x2={12} y2={12}/>
      <line x1={12} y1={16} x2={12.01} y2={16}/>
    </svg>
  ),
};

// ─── Toggle ───────────────────────────────────────────────────
const Toggle = ({ value, onChange, label, desc, icon, dark }) => (
  <div className={`flex items-center justify-between gap-4 py-4 border-b last:border-0 ${dark ? "border-white/5" : "border-gray-100"}`}>
    <div className="flex items-center gap-3 flex-1">
      {icon && (
        <div style={{
          background: dark ? "rgba(139,92,246,0.1)" : "#f5f3ff",
          borderRadius: "8px", padding: "6px", flexShrink: 0,
        }}>
          {icon}
        </div>
      )}
      <div>
        <p className={`text-sm font-medium ${dark ? "text-white" : "text-gray-800"}`}>{label}</p>
        {desc && <p className={`text-xs mt-0.5 ${dark ? "text-slate-500" : "text-gray-400"}`}>{desc}</p>}
      </div>
    </div>
    <button
      onClick={() => onChange(!value)}
      className={`relative w-11 h-6 rounded-full shrink-0 transition-all duration-200 ${
        value ? "bg-violet-500" : dark ? "bg-white/10" : "bg-gray-200"
      }`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${value ? "translate-x-5" : ""}`} />
    </button>
  </div>
);

const Field = ({ label, desc, icon, children, dark }) => (
  <div className={`py-4 border-b last:border-0 ${dark ? "border-white/5" : "border-gray-100"}`}>
    <div className="flex items-start justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-3 flex-1 min-w-48">
        {icon && (
          <div style={{
            background: dark ? "rgba(139,92,246,0.1)" : "#f5f3ff",
            borderRadius: "8px", padding: "6px", flexShrink: 0,
          }}>
            {icon}
          </div>
        )}
        <div>
          <p className={`text-sm font-medium ${dark ? "text-white" : "text-gray-800"}`}>{label}</p>
          {desc && <p className={`text-xs mt-0.5 ${dark ? "text-slate-500" : "text-gray-400"}`}>{desc}</p>}
        </div>
      </div>
      <div className="shrink-0 min-w-48">{children}</div>
    </div>
  </div>
);

const Input = ({ value, onChange, placeholder, type = "text", dark }) => (
  <input
    type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-violet-500/50 transition-all ${
      dark
        ? "bg-white/5 border-white/10 text-white placeholder-slate-500"
        : "bg-white border-gray-200 text-gray-800 placeholder-gray-400"
    }`}
  />
);

const Select = ({ value, onChange, options, dark }) => (
  <select
    value={value} onChange={(e) => onChange(e.target.value)}
    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-violet-500/50 transition-all ${
      dark ? "bg-white/5 border-white/10 text-white" : "bg-white border-gray-200 text-gray-800"
    }`}
  >
    {options.map((o) => (
      <option key={o.value} value={o.value} className={dark ? "bg-[#13131f]" : "bg-white"}>{o.label}</option>
    ))}
  </select>
);

const Section = ({ icon, title, children, dark }) => (
  <div style={{
    background: dark ? "rgba(255,255,255,0.03)" : "#ffffff",
    border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "#e5e7eb"}`,
    boxShadow: dark ? "none" : "0 1px 3px rgba(0,0,0,0.06)",
  }} className="rounded-xl overflow-hidden">
    <div style={{
      background: dark ? "rgba(255,255,255,0.02)" : "#f9fafb",
      borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "#f3f4f6"}`,
    }} className="flex items-center gap-3 px-5 py-4">
      <div style={{
        background: dark ? "rgba(139,92,246,0.15)" : "#ede9fe",
        borderRadius: "10px", padding: "7px",
      }}>
        {icon}
      </div>
      <h3 className={`text-sm font-semibold ${dark ? "text-white" : "text-gray-800"}`}>{title}</h3>
    </div>
    <div className="px-5">{children}</div>
  </div>
);

const SaveToast = ({ show }) =>
  show ? (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-emerald-500 text-white text-sm font-semibold px-4 py-3 rounded-xl shadow-2xl">
      <Icons.Check />
      Settings saved!
    </div>
  ) : null;

// ─── Main ─────────────────────────────────────────────────────
const GlobalSettings = () => {
  const { dark } = useTheme();
  const [saved, setSaved] = useState(false);

  const [platform, setPlatform] = useState({
    name: "TexoraAI Skills", tagline: "Learn. Grow. Excel.",
    supportEmail: "support@texora.ai", timezone: "Asia/Kolkata", language: "en", currency: "INR",
  });

  const [features, setFeatures] = useState({
    studentRegistration: true,  trainerRegistration: true, emailVerification: true,
    maintenanceMode:     false, darkModeDefault:     true, resumeBuilder:     true,
    liveClasses:         true,  certificates:        true, discussionForums:  false, aiAssistant: true,
  });

  const [notifications, setNotifications] = useState({
    emailOnEnroll: true, emailOnCertificate: true, emailOnAssignment: false,
    smsEnabled:    false, pushEnabled:        true, weeklyDigest:      true,  adminAlerts: true,
  });

  const [limits, setLimits] = useState({
    maxCoursesPerStudent: "10", maxStudentsPerTrainer: "500", videoUploadLimit: "2048",
    storagePerTrainer:    "50", sessionTimeout:        "30",  maxBatchSize:     "100",
  });

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 3000); };
  const setF = (k) => (v) => setFeatures((p)      => ({ ...p, [k]: v }));
  const setN = (k) => (v) => setNotifications((p) => ({ ...p, [k]: v }));
  const setL = (k) => (v) => setLimits((p)        => ({ ...p, [k]: v }));

  const ic = dark ? "#94a3b8" : "#6b7280";

  return (
    <div className="space-y-6 w-full max-w-none">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 style={{ color: dark ? "#ffffff" : "#0f172a" }} className="text-lg font-bold">
            Global Settings
          </h2>
          <p style={{ color: dark ? "#94a3b8" : "#64748b" }} className="text-sm mt-0.5">
            Configure platform-wide behavior and defaults
          </p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white text-sm font-semibold rounded-lg transition-all"
        >
          <Icons.Save />
          Save Changes
        </button>
      </div>

      {/* ── Platform Information ── */}
      <Section dark={dark} icon={<Icons.Building color="#8b5cf6" />} title="Platform Information">
        <Field dark={dark} label="Platform Name"   desc="Shown in emails, titles, and branding"         icon={<Icons.Tag color={ic} />}>
          <Input dark={dark} value={platform.name}         onChange={(v) => setPlatform((p) => ({ ...p, name: v }))}         placeholder="TexoraAI Skills" />
        </Field>
        <Field dark={dark} label="Tagline"          desc="Shown on the login and landing pages"          icon={<Icons.Type color={ic} />}>
          <Input dark={dark} value={platform.tagline}      onChange={(v) => setPlatform((p) => ({ ...p, tagline: v }))}      placeholder="Learn. Grow. Excel." />
        </Field>
        <Field dark={dark} label="Support Email"    desc="Default reply-to for all system emails"        icon={<Icons.Mail color={ic} />}>
          <Input dark={dark} value={platform.supportEmail} onChange={(v) => setPlatform((p) => ({ ...p, supportEmail: v }))} placeholder="support@yourdomain.com" type="email" />
        </Field>
        <Field dark={dark} label="Timezone"                                                              icon={<Icons.Clock color={ic} />}>
          <Select dark={dark} value={platform.timezone} onChange={(v) => setPlatform((p) => ({ ...p, timezone: v }))} options={[
            { value: "Asia/Kolkata",     label: "IST — Asia/Kolkata"     },
            { value: "UTC",              label: "UTC"                     },
            { value: "America/New_York", label: "EST — America/New_York" },
            { value: "Europe/London",    label: "GMT — Europe/London"    },
          ]} />
        </Field>
        <Field dark={dark} label="Default Language"                                                      icon={<Icons.Globe color={ic} />}>
          <Select dark={dark} value={platform.language} onChange={(v) => setPlatform((p) => ({ ...p, language: v }))} options={[
            { value: "en", label: "English" },
            { value: "hi", label: "Hindi"   },
            { value: "ta", label: "Tamil"   },
          ]} />
        </Field>
        <Field dark={dark} label="Currency"                                                              icon={<Icons.DollarSign color={ic} />}>
          <Select dark={dark} value={platform.currency} onChange={(v) => setPlatform((p) => ({ ...p, currency: v }))} options={[
            { value: "INR", label: "INR (₹)" },
            { value: "USD", label: "USD ($)" },
            { value: "EUR", label: "EUR (€)" },
          ]} />
        </Field>
      </Section>

      {/* ── Feature Flags ── */}
      <Section dark={dark} icon={<Icons.Flag color="#8b5cf6" />} title="Feature Flags">
        <Toggle dark={dark} value={features.studentRegistration} onChange={setF("studentRegistration")} label="Student Self-Registration"   desc="Allow new students to register independently"            icon={<Icons.UserPlus    color={ic} />} />
        <Toggle dark={dark} value={features.trainerRegistration} onChange={setF("trainerRegistration")} label="Trainer Applications"         desc="Allow trainers to apply from the public site"            icon={<Icons.UserCheck   color={ic} />} />
        <Toggle dark={dark} value={features.emailVerification}   onChange={setF("emailVerification")}   label="Email Verification Required"  desc="Newly registered users must verify their email"          icon={<Icons.ShieldCheck color={ic} />} />
        <Toggle dark={dark} value={features.resumeBuilder}       onChange={setF("resumeBuilder")}       label="Resume Builder Module"        desc="Allow students to build and download their resume"       icon={<Icons.FileText    color={ic} />} />
        <Toggle dark={dark} value={features.liveClasses}         onChange={setF("liveClasses")}         label="Live Classes"                 desc="Enable live video sessions for trainers"                 icon={<Icons.Video2      color={ic} />} />
        <Toggle dark={dark} value={features.certificates}        onChange={setF("certificates")}        label="Certificate Generation"       desc="Auto-generate certificates upon course completion"       icon={<Icons.Award       color={ic} />} />
        <Toggle dark={dark} value={features.discussionForums}    onChange={setF("discussionForums")}    label="Discussion Forums"            desc="Community Q&A boards (currently in beta)"               icon={<Icons.MessageSquare color={ic} />} />
        <Toggle dark={dark} value={features.aiAssistant}         onChange={setF("aiAssistant")}         label="AI Learning Assistant"        desc="AI-powered doubt resolution for students"                icon={<Icons.Cpu         color={ic} />} />
        <Toggle dark={dark} value={features.darkModeDefault}     onChange={setF("darkModeDefault")}     label="Dark Mode Default"            desc="New users see dark theme on first login"                 icon={<Icons.Moon        color={ic} />} />
        <Toggle dark={dark} value={features.maintenanceMode}     onChange={setF("maintenanceMode")}     label="Maintenance Mode"             desc="Block all logins and show maintenance page"              icon={<Icons.AlertOctagon color="#ef4444" />} />
      </Section>

      {/* ── Notifications ── */}
      <Section dark={dark} icon={<Icons.Bell color="#8b5cf6" />} title="Notification Settings">
        <Toggle dark={dark} value={notifications.emailOnEnroll}      onChange={setN("emailOnEnroll")}      label="Email on Enrollment"     desc="Students receive an email when they enroll"                   icon={<Icons.MailCheck   color={ic} />} />
        <Toggle dark={dark} value={notifications.emailOnCertificate} onChange={setN("emailOnCertificate")} label="Email on Certificate"    desc="Email students when their certificate is ready"               icon={<Icons.Award       color={ic} />} />
        <Toggle dark={dark} value={notifications.emailOnAssignment}  onChange={setN("emailOnAssignment")}  label="Email on Assignment Due" desc="Remind students before assignment deadlines"                  icon={<Icons.FileText    color={ic} />} />
        <Toggle dark={dark} value={notifications.pushEnabled}        onChange={setN("pushEnabled")}        label="Push Notifications"      desc="Browser push notifications for live class reminders"          icon={<Icons.BellRing    color={ic} />} />
        <Toggle dark={dark} value={notifications.smsEnabled}         onChange={setN("smsEnabled")}         label="SMS Notifications"       desc="SMS alerts for critical events (carrier charges apply)"       icon={<Icons.Smartphone  color={ic} />} />
        <Toggle dark={dark} value={notifications.weeklyDigest}       onChange={setN("weeklyDigest")}       label="Weekly Admin Digest"     desc="Email admins a weekly summary every Monday"                  icon={<Icons.Newspaper   color={ic} />} />
        <Toggle dark={dark} value={notifications.adminAlerts}        onChange={setN("adminAlerts")}        label="Admin Security Alerts"   desc="Instant alerts for suspicious login attempts"                 icon={<Icons.ShieldAlert color={ic} />} />
      </Section>

      {/* ── Platform Limits ── */}
      <Section dark={dark} icon={<Icons.Sliders color="#8b5cf6" />} title="Platform Limits">
        <Field dark={dark} label="Max Courses per Student"   desc="Maximum enrollments per individual student"  icon={<Icons.BookOpen  color={ic} />}>
          <Input dark={dark} value={limits.maxCoursesPerStudent}   onChange={setL("maxCoursesPerStudent")}   type="number" />
        </Field>
        <Field dark={dark} label="Max Students per Trainer"  desc="Upper bound for trainer's student count"     icon={<Icons.Users     color={ic} />}>
          <Input dark={dark} value={limits.maxStudentsPerTrainer}  onChange={setL("maxStudentsPerTrainer")}  type="number" />
        </Field>
        <Field dark={dark} label="Video Upload Limit (MB)"   desc="Maximum file size for video uploads"         icon={<Icons.Video     color={ic} />}>
          <Input dark={dark} value={limits.videoUploadLimit}       onChange={setL("videoUploadLimit")}       type="number" />
        </Field>
        <Field dark={dark} label="Storage per Trainer (GB)"  desc="Cloud storage quota per trainer account"     icon={<Icons.HardDrive color={ic} />}>
          <Input dark={dark} value={limits.storagePerTrainer}      onChange={setL("storagePerTrainer")}      type="number" />
        </Field>
        <Field dark={dark} label="Session Timeout (minutes)" desc="Auto-logout after inactivity"               icon={<Icons.Timer     color={ic} />}>
          <Input dark={dark} value={limits.sessionTimeout}         onChange={setL("sessionTimeout")}         type="number" />
        </Field>
        <Field dark={dark} label="Max Batch Size (students)" desc="Maximum students allowed per batch"          icon={<Icons.Group     color={ic} />}>
          <Input dark={dark} value={limits.maxBatchSize}           onChange={setL("maxBatchSize")}           type="number" />
        </Field>
      </Section>

      <SaveToast show={saved} />
    </div>
  );
};

export default GlobalSettings;