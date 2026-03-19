import React, { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Building2,
  CheckCircle2,
  ChevronRight,
  FileText,
  GraduationCap,
  Info,
  Lightbulb,
  Rocket,
  ShieldCheck,
  Sparkles,
  Users,
  Layers,
} from "lucide-react";

// ✅ Forms (unchanged)
import ApplyAdmin from "../../Admin/ApplyAdmin";
import ApplyTrainer from "../../Trainer/ApplyTrainer";
import ApplyBusiness from "../../Business/ApplyBusiness";
import StudentApplicationForm from "../../Student/StudentApplicationForm";

/* ── role config ── */
const ROLES = [
  {
    key:     "student",
    label:   "Student",
    tagline: "Learn & grow",
    icon:    BookOpen,
    grad:    "from-cyan-500 to-blue-600",
    softBg:  "bg-cyan-50 dark:bg-cyan-950/30",
    border:  "border-cyan-200 dark:border-cyan-800",
    ring:    "ring-cyan-400",
    text:    "text-cyan-700 dark:text-cyan-300",
  },
  {
    key:     "trainer",
    label:   "Trainer",
    tagline: "Teach & inspire",
    icon:    GraduationCap,
    grad:    "from-violet-500 to-purple-600",
    softBg:  "bg-violet-50 dark:bg-violet-950/30",
    border:  "border-violet-200 dark:border-violet-800",
    ring:    "ring-violet-400",
    text:    "text-violet-700 dark:text-violet-300",
  },
  {
    key:     "business",
    label:   "Business",
    tagline: "Scale your team",
    icon:    Building2,
    grad:    "from-amber-500 to-orange-500",
    softBg:  "bg-amber-50 dark:bg-amber-950/30",
    border:  "border-amber-200 dark:border-amber-800",
    ring:    "ring-amber-400",
    text:    "text-amber-700 dark:text-amber-300",
  },
  {
    key:     "admin",
    label:   "Admin",
    tagline: "Full platform access",
    icon:    ShieldCheck,
    grad:    "from-rose-500 to-red-500",
    softBg:  "bg-rose-50 dark:bg-rose-950/30",
    border:  "border-rose-200 dark:border-rose-800",
    ring:    "ring-rose-400",
    text:    "text-rose-700 dark:text-rose-300",
  },
];

/* ── info panel tips per role ── */
const ROLE_INFO = {
  student: {
    title: "Student Application",
    desc:  "Join thousands of learners on ILM ORA and unlock your potential.",
    tips: [
      { icon: FileText,     text: "Fill your personal details accurately" },
      { icon: ShieldCheck,  text: "Upload a valid government-issued ID proof" },
      { icon: CheckCircle2, text: "Applications reviewed within 24 hours" },
      { icon: Sparkles,     text: "Email confirmation sent upon approval" },
    ],
  },
  trainer: {
    title: "Trainer Application",
    desc:  "Share your expertise and shape the next generation of professionals.",
    tips: [
      { icon: Lightbulb,     text: "Clearly describe your area of expertise" },
      { icon: GraduationCap, text: "Include past teaching or mentoring experience" },
      { icon: FileText,      text: "Attach relevant certifications or credentials" },
      { icon: ShieldCheck,   text: "Profile verified by admin before activation" },
    ],
  },
  business: {
    title: "Business Application",
    desc:  "Empower your workforce with structured, scalable learning.",
    tips: [
      { icon: Building2, text: "Provide your company registration details" },
      { icon: Users,     text: "Mention team size & specific learning goals" },
      { icon: Layers,    text: "Business plans include bulk enrollments" },
      { icon: Sparkles,  text: "Dedicated support team after approval" },
    ],
  },
  admin: {
    title: "Admin Application",
    desc:  "Platform control is restricted to verified administrators only.",
    tips: [
      { icon: ShieldCheck, text: "Admin access is strictly controlled & verified" },
      { icon: Building2,   text: "Provide your full organisation details" },
      { icon: FileText,    text: "Background verification may be required" },
      { icon: Users,       text: "Approved only by existing super-admins" },
    ],
  },
};

const STEPS = ["Choose Role", "Fill Form", "Submit"];

/* ================= MAIN ================= */
const ApplyForm = () => {
  const [role, setRole]             = useState("");
  const [leftWidth, setLeftWidth]   = useState(58);
  const [isDragging, setIsDragging] = useState(false);

  /* ── drag logic (unchanged) ── */
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const newWidth = (e.clientX / window.innerWidth) * 100;
    if (newWidth > 25 && newWidth < 75) setLeftWidth(newWidth);
  };
  const handleMouseUp = () => setIsDragging(false);

  /* ── form render (unchanged) ── */
  const renderForm = () => {
    switch (role) {
      case "admin":    return <ApplyAdmin />;
      case "trainer":  return <ApplyTrainer />;
      case "business": return <ApplyBusiness />;
      case "student":  return <StudentApplicationForm />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full gap-5 py-20">
            <div className="relative">
              <div className="h-20 w-20 rounded-2xl bg-slate-100 dark:bg-slate-800
                flex items-center justify-center">
                <ArrowRight className="h-9 w-9 text-slate-300 dark:text-slate-600" />
              </div>
              <div className="absolute -top-1.5 -right-1.5 h-6 w-6 rounded-full
                bg-gradient-to-br from-blue-500 to-cyan-500
                flex items-center justify-center">
                <Sparkles className="h-3 w-3 text-white" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Choose your role to begin
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Select one of the cards above to load your application form
              </p>
            </div>
          </div>
        );
    }
  };

  const activeRole = ROLES.find((r) => r.key === role);
  const info       = ROLE_INFO[role];
  const step       = role ? 1 : 0;

  return (
    <div
      className="min-h-screen bg-[#f0f4ff] dark:bg-[#060b18] p-5 space-y-5 select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >

      {/* ═══════ HERO ═══════ */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800
        bg-white dark:bg-slate-900 shadow-sm">

        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-slate-100 dark:bg-slate-800
              flex items-center justify-center">
              <Rocket className="h-5 w-5 text-orange-500" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
            <span className="text-green-600">ILM</span>{" "}
            <span className="text-[#F97316]">ORA</span>
            </h1>
          </div>

          {/* step tracker */}
          <div className="hidden md:flex items-center gap-1.5 rounded-2xl
            bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700
            px-4 py-2">
            {STEPS.map((s, i) => (
              <React.Fragment key={s}>
                <div className="flex items-center gap-1.5">
                  <div className={`h-5 w-5 rounded-full flex items-center justify-center
                    ${i < step ? "bg-green-500" : i === step ? "bg-orange-500" : "bg-slate-300 dark:bg-slate-600"}`}>
                    {i < step
                      ? <CheckCircle2 className="h-4 w-4 text-white" />
                      : <span className="text-[10px] font-bold text-white">{i + 1}</span>
                    }
                  </div>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {s}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <ChevronRight className="h-3.5 w-3.5 text-slate-400 mx-0.5" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════ ROLE SELECTOR ═══════ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {ROLES.map((item) => {
          const Icon     = item.icon;
          const isActive = role === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setRole(item.key)}
              className={`group relative overflow-hidden rounded-2xl border text-left
                transition-all duration-200 p-4
                ${isActive
                  ? `${item.softBg} ${item.border} shadow-lg ring-2 ${item.ring}
                     ring-offset-2 ring-offset-[#f0f4ff] dark:ring-offset-[#060b18] scale-[1.02]`
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-md hover:scale-[1.01]"
                }`}
            >
              {isActive && (
                <div className={`absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r ${item.grad}`} />
              )}
              <div className={`h-10 w-10 rounded-xl mb-3 flex items-center justify-center transition-all
                ${isActive
                  ? `bg-gradient-to-br ${item.grad} shadow-md`
                  : "bg-slate-100 dark:bg-slate-800 group-hover:bg-slate-200 dark:group-hover:bg-slate-700"
                }`}>
                <Icon className={`h-5 w-5 ${isActive ? "text-white" : "text-slate-500 dark:text-slate-400"}`} />
              </div>
              <p className={`text-sm font-bold ${isActive ? item.text : "text-slate-800 dark:text-slate-100"}`}>
                {item.label}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                {item.tagline}
              </p>
              {isActive && (
                <div className={`absolute top-3 right-3 h-5 w-5 rounded-full
                  bg-gradient-to-br ${item.grad} flex items-center justify-center shadow-sm`}>
                  <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* ═══════ RESIZABLE PANEL ═══════ */}
      <div
        className="flex rounded-2xl border border-slate-200 dark:border-slate-800
          overflow-hidden shadow-xl"
        style={{ height: "72vh" }}
      >

        {/* ── LEFT: FORM ── */}
        <div
          style={{ width: `${leftWidth}%` }}
          className="flex flex-col overflow-hidden bg-white dark:bg-slate-900
            border-r border-slate-100 dark:border-slate-800"
        >
          {/* form topbar */}
          <div className="flex items-center gap-3 px-5 py-3 shrink-0
            border-b border-slate-100 dark:border-slate-800
            bg-slate-50/80 dark:bg-slate-900/80">
            {activeRole ? (
              <>
                <div className={`h-7 w-7 rounded-lg bg-gradient-to-br ${activeRole.grad}
                  flex items-center justify-center shrink-0 shadow-sm`}>
                  {React.createElement(activeRole.icon, { className: "h-3.5 w-3.5 text-white" })}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                    {info?.title}
                  </p>
                  <p className="text-[10px] text-slate-400">Fill all required fields carefully</p>
                </div>
                <span className={`inline-flex items-center rounded-full border
                  px-2 py-0.5 text-[10px] font-semibold shrink-0
                  ${activeRole.softBg} ${activeRole.border} ${activeRole.text}`}>
                  {activeRole.label}
                </span>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-slate-100 dark:bg-slate-800
                  flex items-center justify-center">
                  <FileText className="h-3.5 w-3.5 text-slate-400" />
                </div>
                <p className="text-xs font-medium text-slate-400">Application Form</p>
              </div>
            )}
          </div>

          {/* form body */}
          <div className="flex-1 overflow-auto p-5">
            {renderForm()}
          </div>
        </div>

        {/* ── DRAG HANDLE ── */}
        <div
          onMouseDown={() => setIsDragging(true)}
          className={`relative w-2 flex-none cursor-col-resize flex items-center justify-center
            transition-colors duration-150 group
            ${isDragging
              ? "bg-blue-500"
              : "bg-slate-100 dark:bg-slate-800 hover:bg-blue-400 dark:hover:bg-blue-600"
            }`}
        >
          <div className="flex flex-col gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`h-1 w-1 rounded-full transition-colors
                ${isDragging ? "bg-white/70" : "bg-slate-300 dark:bg-slate-600 group-hover:bg-white/80"}`} />
            ))}
          </div>
        </div>

        {/* ── RIGHT: INFO PANEL ── 🔥 FIX: removed h-full + flex-col from inner div ── */}
        <div
          style={{ width: `${100 - leftWidth}%` }}
          className="overflow-y-auto bg-slate-50 dark:bg-[#0a1220]"
        >
          {role && info && activeRole ? (
            /* 🔥 KEY FIX: no h-full, no flex-col — just a normal padded block that scrolls naturally */
            <div className="p-5 space-y-4">

              {/* role header card */}
              <div className={`relative overflow-hidden rounded-2xl p-4
                bg-gradient-to-br ${activeRole.grad}`}>
                <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-white/10 blur-xl" />
                <div className="relative flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                    {React.createElement(activeRole.icon, { className: "h-5 w-5 text-white" })}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{info.title}</p>
                    <p className="text-[11px] text-white/70 mt-0.5 leading-relaxed">{info.desc}</p>
                  </div>
                </div>
              </div>

              {/* tips header */}
              <div className="flex items-center gap-1.5">
                <Lightbulb className="h-3.5 w-3.5 text-slate-400" />
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  Application Tips
                </p>
              </div>

              {/* tip cards */}
              <div className="space-y-2">
                {info.tips.map((tip, i) => {
                  const TipIcon = tip.icon;
                  return (
                    <div
                      key={i}
                      className="flex items-start gap-3 rounded-xl
                        bg-white dark:bg-slate-800/80 border border-slate-100
                        dark:border-slate-700/60 px-3.5 py-3
                        hover:border-slate-200 dark:hover:border-slate-600
                        transition-colors duration-150"
                    >
                      <div className={`mt-0.5 h-6 w-6 rounded-lg bg-gradient-to-br ${activeRole.grad}
                        flex items-center justify-center shrink-0 shadow-sm`}>
                        <TipIcon className="h-3.5 w-3.5 text-white" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-0.5 uppercase tracking-wide">
                          Step {i + 1}
                        </p>
                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                          {tip.text}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* info note */}
              <div className="flex items-start gap-2.5 rounded-xl
                bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800
                px-3.5 py-3">
                <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-[11px] text-blue-700 dark:text-blue-300 leading-relaxed">
                  Applications are manually reviewed. You'll receive an email confirmation once a decision is made.
                </p>
              </div>
            </div>

          ) : (
            /* empty state — needs h-full to center properly */
            <div className="flex flex-col items-center justify-center h-full gap-4 p-6">
              <div className="relative">
                <div className="h-16 w-16 rounded-2xl bg-white dark:bg-slate-800 border
                  border-slate-200 dark:border-slate-700 shadow-sm
                  flex items-center justify-center">
                  <Info className="h-7 w-7 text-slate-300 dark:text-slate-600" />
                </div>
                <div className="absolute -bottom-1.5 -right-1.5 h-6 w-6 rounded-full
                  bg-gradient-to-br from-blue-500 to-cyan-500
                  flex items-center justify-center shadow">
                  <Sparkles className="h-3 w-3 text-white" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Info Panel</p>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Select a role to see<br />application tips & details
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2 mt-1">
                {ROLES.map((r) => {
                  const Icon = r.icon;
                  return (
                    <button
                      key={r.key}
                      onClick={() => setRole(r.key)}
                      className={`flex items-center gap-1.5 rounded-xl border
                        px-2.5 py-1.5 text-[11px] font-semibold transition-all hover:scale-105
                        ${r.softBg} ${r.border} ${r.text}`}
                    >
                      <Icon className="h-3 w-3" /> {r.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplyForm;