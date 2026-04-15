// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   AlertCircle, ArrowLeft, CheckCircle, Clock,
//   MessageSquare, Search, Tag, Zap,
// } from "lucide-react";

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// /* ── stat cards ── */
// const STATS = [
//   {
//     label: "Open Feedback",
//     value: "0",
//     sub:   "Awaiting response",
//     icon:  AlertCircle,
//     grad:  "from-emerald-500 to-teal-600",
//     bg:    "bg-emerald-50 dark:bg-emerald-950/40",
//     text:  "text-emerald-600 dark:text-emerald-400",
//   },
//   {
//     label: "In Progress",
//     value: "0",
//     sub:   "Under review",
//     icon:  Clock,
//     grad:  "from-amber-500 to-orange-600",
//     bg:    "bg-amber-50 dark:bg-amber-950/40",
//     text:  "text-amber-600 dark:text-amber-400",
//   },
//   {
//     label: "Resolved",
//     value: "0",
//     sub:   "Closed items",
//     icon:  CheckCircle,
//     grad:  "from-blue-500 to-cyan-600",
//     bg:    "bg-blue-50 dark:bg-blue-950/40",
//     text:  "text-blue-600 dark:text-blue-400",
//   },
// ];

// /* ── type chip colours ── */
// const TYPE_CFG = {
//   bug:     "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-400 dark:border-red-800",
//   feature: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/50 dark:text-violet-400 dark:border-violet-800",
//   general: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
// };

// /* ── status badge ── */
// const STATUS_CFG = {
//   open:     "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800",
//   progress: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800",
//   closed:   "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-800",
// };

// /* ================= MAIN ================= */
// const FeedbackAdmin = () => {
//   const navigate = useNavigate();
//   const [type, setType]     = useState("all");
//   const [status, setStatus] = useState("all");
//   const [search, setSearch] = useState("");

//   /* ================= RENDER ================= */
//   return (
//     <div className="min-h-screen bg-[#f0f4ff] dark:bg-[#060b18] p-5 space-y-5">

//       {/* ═══════ HERO ═══════ */}
//       <div className="relative overflow-hidden rounded-2xl shadow-xl
//         bg-gradient-to-r from-[#1a56db] via-[#3b82f6] to-[#06b6d4]">
//         <div className="pointer-events-none absolute -right-12 -top-12 h-52 w-52 rounded-full bg-white/10 blur-3xl" />
//         <div className="pointer-events-none absolute right-32 bottom-[-30px] h-36 w-36 rounded-full bg-cyan-300/20 blur-2xl" />
//         <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 bg-gradient-to-r from-transparent via-white/30 to-transparent" />

//         <div className="relative flex items-center justify-between px-6 py-5">
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => navigate(-1)}
//               className="flex items-center gap-1.5 rounded-xl bg-white/15 px-3 py-1.5
//                 text-sm font-medium text-white backdrop-blur-sm hover:bg-white/25 transition-all"
//             >
//               <ArrowLeft className="h-4 w-4" /> Back
//             </button>
//             <div>
//               <h1 className="text-2xl font-bold tracking-tight text-white">Feedback &amp; Support</h1>
//               <p className="mt-0.5 text-sm text-blue-100/80">Review, track and respond to feedback</p>
//             </div>
//           </div>

//           <div className="hidden md:flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-2 backdrop-blur-sm">
//             <MessageSquare className="h-4 w-4 text-cyan-200" />
//             <span className="text-sm font-semibold text-white">
//               0
//               <span className="ml-1 font-normal text-blue-100/80">Items</span>
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* ═══════ STAT CARDS ═══════ */}
//       <div className="grid gap-4 md:grid-cols-3">
//         {STATS.map((s) => {
//           const Icon = s.icon;
//           return (
//             <div
//               key={s.label}
//               className="relative overflow-hidden rounded-2xl border border-slate-200
//                 dark:border-slate-800 bg-white dark:bg-slate-900 shadow p-5"
//             >
//               <div className={`pointer-events-none absolute -right-4 -top-4 h-24 w-24
//                 rounded-full bg-gradient-to-br ${s.grad} opacity-10 blur-2xl`} />

//               <div className="relative flex items-start justify-between">
//                 <div>
//                   <p className="text-[11px] uppercase tracking-widest font-semibold
//                     text-slate-500 dark:text-slate-400">
//                     {s.label}
//                   </p>
//                   <p className="mt-2 text-3xl font-bold text-slate-800 dark:text-slate-100">
//                     {s.value}
//                   </p>
//                   <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{s.sub}</p>
//                 </div>
//                 <div className={`h-11 w-11 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>
//                   <Icon className={`h-5 w-5 ${s.text}`} />
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* ═══════ FILTER BAR ═══════ */}
//       <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between
//         rounded-2xl border border-slate-200 dark:border-slate-800
//         bg-white dark:bg-slate-900 shadow px-4 py-3">

//         <div className="flex gap-2 flex-wrap">
//           <Select value={type} onValueChange={setType}>
//             <SelectTrigger className="h-9 w-36 rounded-xl bg-slate-50 dark:bg-slate-800
//               border-slate-200 dark:border-slate-700 text-sm">
//               <SelectValue placeholder="Type" />
//             </SelectTrigger>
//             <SelectContent className="rounded-xl border border-slate-200 dark:border-slate-700
//               bg-white dark:bg-slate-900 shadow-xl z-50">
//               <SelectItem value="all">All types</SelectItem>
//               <SelectItem value="bug">Bug</SelectItem>
//               <SelectItem value="feature">Feature</SelectItem>
//               <SelectItem value="general">General</SelectItem>
//             </SelectContent>
//           </Select>

//           <Select value={status} onValueChange={setStatus}>
//             <SelectTrigger className="h-9 w-36 rounded-xl bg-slate-50 dark:bg-slate-800
//               border-slate-200 dark:border-slate-700 text-sm">
//               <SelectValue placeholder="Status" />
//             </SelectTrigger>
//             <SelectContent className="rounded-xl border border-slate-200 dark:border-slate-700
//               bg-white dark:bg-slate-900 shadow-xl z-50">
//               <SelectItem value="all">All status</SelectItem>
//               <SelectItem value="open">Open</SelectItem>
//               <SelectItem value="progress">In progress</SelectItem>
//               <SelectItem value="closed">Closed</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         <div className="relative sm:w-64">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
//           <Input
//             placeholder="Search feedback…"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="pl-9 h-9 rounded-xl bg-slate-50 dark:bg-slate-800
//               border-slate-200 dark:border-slate-700 text-sm"
//           />
//         </div>
//       </div>

//       {/* ═══════ FEEDBACK LIST CARD ═══════ */}
//       <Card className="overflow-hidden rounded-2xl border border-slate-200
//         dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg">

//         <CardHeader className="flex flex-row items-center gap-2.5
//           border-b border-slate-100 dark:border-slate-800
//           bg-slate-50/60 dark:bg-slate-900/60 px-6 py-4">
//           <div className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-950/50
//             flex items-center justify-center">
//             <MessageSquare className="h-4 w-4 text-blue-500" />
//           </div>
//           <div>
//             <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-100">
//               Feedback Items
//             </CardTitle>
//             <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
//               0 items found
//             </p>
//           </div>
//         </CardHeader>

//         <CardContent className="p-4">
//           {/* empty state */}
//           <div className="flex flex-col items-center justify-center py-16 gap-3">
//             <div className="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-slate-800
//               flex items-center justify-center">
//               <MessageSquare className="h-7 w-7 text-slate-400" />
//             </div>
//             <p className="text-sm font-medium text-slate-500">No feedback available</p>
//             <p className="text-xs text-slate-400">Feedback will appear once users submit it</p>
//           </div>

//           {/* when data available, render rows like this: */}
//           {/*
//           <div className="space-y-2">
//             {items.map((item) => (
//               <div key={item.id} className="group flex items-center justify-between
//                 rounded-2xl border border-slate-100 dark:border-slate-800
//                 bg-slate-50/50 dark:bg-slate-800/40 px-5 py-4
//                 hover:border-blue-200 dark:hover:border-blue-800
//                 hover:bg-blue-50/30 dark:hover:bg-slate-800
//                 hover:shadow-md transition-all duration-200">
//                 <div className="flex items-center gap-3">
//                   <div className="h-9 w-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center">
//                     <MessageSquare className="h-4 w-4 text-blue-500" />
//                   </div>
//                   <div>
//                     <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{item.title}</p>
//                     <div className="flex gap-2 mt-1">
//                       <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${TYPE_CFG[item.type]}`}><Tag className="h-3 w-3 mr-1" />{item.type}</span>
//                       <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${STATUS_CFG[item.status]}`}>{item.status}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//           */}
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default FeedbackAdmin;
















import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Clock,
  MessageSquare,
  Search,
  Tag,
  ChevronDown,
} from "lucide-react";

/* ─── theme token map (exact copy from AdminDashboard) ─── */
const T = {
  dark: {
    pageBg: "#0a0a0a",
    cardBg: "#111111",
    cardBgHov: "#161616",
    heroBg: "#141414",
    border: "rgba(255,255,255,0.06)",
    borderHov: "rgba(255,255,255,0.14)",
    borderHero: "rgba(255,255,255,0.07)",
    text: "#ffffff",
    textSub: "rgba(255,255,255,0.3)",
    textMuted: "rgba(255,255,255,0.2)",
    textLabel: "rgba(255,255,255,0.22)",
    pillBg: "rgba(255,255,255,0.04)",
    pillBorder: "rgba(255,255,255,0.07)",
    pillText: "rgba(255,255,255,0.25)",
    iconBg: "rgba(255,255,255,0.05)",
    iconBorder: "rgba(255,255,255,0.08)",
    barBg: "rgba(255,255,255,0.05)",
    actBg: "rgba(255,255,255,0.04)",
    actBorder: "rgba(255,255,255,0.07)",
    emptyBorder: "rgba(255,255,255,0.07)",
    emptyBg: "rgba(255,255,255,0.02)",
    emptyIcon: "rgba(255,255,255,0.12)",
    gridLine: "rgba(255,255,255,0.5)",
    recentItemBg: "rgba(255,255,255,0.03)",
    recentItemBorder: "rgba(255,255,255,0.05)",
    recentItemBgHov: "rgba(255,255,255,0.06)",
    shadow: "0 4px 20px rgba(0,0,0,0.4)",
    inputBg: "rgba(255,255,255,0.04)",
    inputBorder: "rgba(255,255,255,0.08)",
    inputText: "rgba(255,255,255,0.7)",
    dropdownBg: "#1a1a1a",
    dropdownItemHov: "rgba(255,255,255,0.05)",
  },
  light: {
    pageBg: "#f1f5f9",
    cardBg: "#ffffff",
    cardBgHov: "#f8fafc",
    heroBg: "#ffffff",
    border: "#e2e8f0",
    borderHov: "#cbd5e1",
    borderHero: "#e2e8f0",
    text: "#0f172a",
    textSub: "#64748b",
    textMuted: "#94a3b8",
    textLabel: "#94a3b8",
    pillBg: "#f1f5f9",
    pillBorder: "#e2e8f0",
    pillText: "#94a3b8",
    iconBg: "#f8fafc",
    iconBorder: "#e2e8f0",
    barBg: "#f1f5f9",
    actBg: "#f8fafc",
    actBorder: "#e2e8f0",
    emptyBorder: "#e2e8f0",
    emptyBg: "#f8fafc",
    emptyIcon: "#cbd5e1",
    gridLine: "rgba(0,0,0,0.12)",
    recentItemBg: "#f8fafc",
    recentItemBorder: "#e2e8f0",
    recentItemBgHov: "#f1f5f9",
    shadow: "0 1px 8px rgba(0,0,0,0.07)",
    inputBg: "#f8fafc",
    inputBorder: "#e2e8f0",
    inputText: "#0f172a",
    dropdownBg: "#ffffff",
    dropdownItemHov: "#f1f5f9",
  },
};

/* ── stat card config ── */
const STATS = [
  { label: "Open Feedback", value: "0", sub: "Awaiting response", icon: AlertCircle, color: "#22D3EE" },
  { label: "In Progress",   value: "0", sub: "Under review",      icon: Clock,       color: "#FB923C" },
  { label: "Resolved",      value: "0", sub: "Closed items",      icon: CheckCircle, color: "#34D399" },
];

/* ── chip / badge colours ── */
const TYPE_COLORS = {
  bug:     { color: "#F87171", bg: "rgba(248,113,113,0.12)", border: "rgba(248,113,113,0.25)" },
  feature: { color: "#22D3EE", bg: "rgba(34,211,238,0.12)",  border: "rgba(34,211,238,0.25)"  },
  general: { color: "#94a3b8", bg: "rgba(148,163,184,0.10)", border: "rgba(148,163,184,0.2)"  },
};
const STATUS_COLORS = {
  open:     { color: "#22D3EE", bg: "rgba(34,211,238,0.12)",  border: "rgba(34,211,238,0.25)"  },
  progress: { color: "#FB923C", bg: "rgba(251,146,60,0.12)",  border: "rgba(251,146,60,0.25)"  },
  closed:   { color: "#34D399", bg: "rgba(52,211,153,0.12)",  border: "rgba(52,211,153,0.25)"  },
};

/* ── custom select (no shadcn dependency) ── */
function CustomSelect({ value, onChange, options, t }) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);
  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: 8, height: 36, padding: "0 12px", borderRadius: 10,
          background: t.inputBg, border: `1px solid ${open ? "rgba(34,211,238,0.4)" : t.inputBorder}`,
          color: t.inputText, fontSize: 12, fontWeight: 500,
          fontFamily: "'Poppins',sans-serif", cursor: "pointer", minWidth: 140,
          transition: "border-color 0.15s",
          boxShadow: open ? "0 0 0 3px rgba(34,211,238,0.08)" : "none",
        }}
      >
        <span>{selected?.label}</span>
        <ChevronDown size={13} style={{
          opacity: 0.5,
          transform: open ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform 0.2s",
        }} />
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0, zIndex: 50,
          background: t.dropdownBg, border: `1px solid ${t.inputBorder}`,
          borderRadius: 12, padding: 4, minWidth: 140,
          boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
        }}>
          {options.map((o) => (
            <button
              key={o.value}
              onClick={() => { onChange(o.value); setOpen(false); }}
              onMouseEnter={(e) => { if (value !== o.value) e.currentTarget.style.background = t.dropdownItemHov; }}
              onMouseLeave={(e) => { if (value !== o.value) e.currentTarget.style.background = "transparent"; }}
              style={{
                display: "block", width: "100%", padding: "8px 12px",
                borderRadius: 8, textAlign: "left", cursor: "pointer",
                background: value === o.value ? "rgba(34,211,238,0.1)" : "transparent",
                color: value === o.value ? "#22D3EE" : t.inputText,
                fontSize: 12, fontWeight: value === o.value ? 600 : 400,
                fontFamily: "'Poppins',sans-serif", border: "none", transition: "background 0.1s",
              }}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── stat card ── */
function StatCard({ stat, t }) {
  const Icon = stat.icon;
  return (
    <div style={{
      background: t.cardBg, border: `1px solid ${t.border}`,
      borderRadius: 20, padding: "22px 22px 20px",
      boxShadow: t.shadow, position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: -20, right: -20, width: 90, height: 90,
        borderRadius: "50%", background: stat.color,
        filter: "blur(40px)", opacity: 0.06, pointerEvents: "none",
      }} />
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <p style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
            textTransform: "uppercase", color: t.textMuted,
            fontFamily: "'Poppins',sans-serif", margin: 0,
          }}>{stat.label}</p>
          <p style={{
            fontSize: 40, fontWeight: 800, lineHeight: 1,
            fontFamily: "'Poppins',sans-serif", color: t.text, margin: "10px 0 0",
          }}>{stat.value}</p>
          <p style={{
            fontSize: 11, color: t.textMuted, margin: "6px 0 0",
            fontFamily: "'Poppins',sans-serif",
          }}>{stat.sub}</p>
        </div>
        <div style={{
          width: 42, height: 42, borderRadius: 12,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: `${stat.color}18`, border: `1px solid ${stat.color}30`,
        }}>
          <Icon size={19} color={stat.color} strokeWidth={2} />
        </div>
      </div>
      <div style={{ height: 2, background: t.barBg, borderRadius: 99, overflow: "hidden", marginTop: 16 }}>
        <div style={{
          height: "100%", borderRadius: 99, background: stat.color, width: "20%", opacity: 0.85,
        }} />
      </div>
    </div>
  );
}

/* ── feedback row (for when data is present) ── */
function FeedbackRow({ item, tc, sc, t }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 16px", borderRadius: 14,
        background: hov ? t.recentItemBgHov : t.recentItemBg,
        border: `1px solid ${hov ? t.recentItemBorder : "transparent"}`,
        transition: "all 0.15s", cursor: "default",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.2)",
        }}>
          <MessageSquare size={15} color="#22D3EE" />
        </div>
        <div>
          <p style={{
            fontSize: 13, fontWeight: 600, color: t.text,
            fontFamily: "'Poppins',sans-serif", margin: 0,
          }}>{item.title}</p>
          <div style={{ display: "flex", gap: 6, marginTop: 5 }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              fontSize: 10, fontWeight: 600, padding: "2px 9px", borderRadius: 999,
              fontFamily: "'Poppins',sans-serif",
              background: tc.bg, color: tc.color, border: `1px solid ${tc.border}`,
            }}>
              <Tag size={9} />{item.type}
            </span>
            <span style={{
              display: "inline-flex", alignItems: "center",
              fontSize: 10, fontWeight: 600, padding: "2px 9px", borderRadius: 999,
              fontFamily: "'Poppins',sans-serif",
              background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`,
            }}>
              {item.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= MAIN ================= */
const FeedbackAdmin = () => {
  const navigate = useNavigate();

  /* dark mode observer — same pattern as AdminDashboard */
  const [isDark, setIsDark] = useState(
    () => typeof document !== "undefined" && (
      document.documentElement.classList.contains("dark") ||
      document.documentElement.getAttribute("data-theme") === "dark"
    )
  );
  useEffect(() => {
    const obs = new MutationObserver(() => {
      setIsDark(
        document.documentElement.classList.contains("dark") ||
        document.documentElement.getAttribute("data-theme") === "dark"
      );
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
    return () => obs.disconnect();
  }, []);

  const t = isDark ? T.dark : T.light;

  const [type,   setType]   = useState("all");
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");

  const typeOptions = [
    { value: "all",     label: "All types"  },
    { value: "bug",     label: "Bug"        },
    { value: "feature", label: "Feature"    },
    { value: "general", label: "General"    },
  ];
  const statusOptions = [
    { value: "all",      label: "All status"  },
    { value: "open",     label: "Open"        },
    { value: "progress", label: "In Progress" },
    { value: "closed",   label: "Closed"      },
  ];

  /* no logic change — items stay empty */
  const items = [];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        .fbfade{animation:fadeUp 0.45s ease both}
      `}</style>

      <div style={{
        minHeight: "100vh", background: t.pageBg, color: t.text,
        fontFamily: "'Poppins',sans-serif", transition: "background 0.3s,color 0.3s",
      }}>
        <div style={{
          position: "relative", zIndex: 1,
          padding: 24, maxWidth: 1300, margin: "0 auto", paddingBottom: 52,
        }}>

          {/* ═══════ HERO ═══════ */}
          <div className="fbfade" style={{
            borderRadius: 24, padding: "30px 36px",
            background: t.heroBg, border: `1px solid ${t.borderHero}`,
            position: "relative", overflow: "hidden",
            marginBottom: 20, boxShadow: t.shadow,
          }}>
            {/* grid overlay */}
            <div style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              opacity: isDark ? 0.04 : 0.025,
              backgroundImage: `linear-gradient(${t.gridLine} 1px,transparent 1px),linear-gradient(90deg,${t.gridLine} 1px,transparent 1px)`,
              backgroundSize: "40px 40px",
            }} />
            {/* glow blobs */}
            <div style={{
              position: "absolute", top: "-30%", left: "40%", width: 300, height: 200,
              background: "radial-gradient(ellipse,rgba(34,211,238,0.06),transparent 70%)",
              pointerEvents: "none",
            }} />
            <div style={{
              position: "absolute", bottom: "-40%", right: "10%", width: 250, height: 200,
              background: "radial-gradient(ellipse,rgba(251,146,60,0.05),transparent 70%)",
              pointerEvents: "none",
            }} />

            <div style={{
              position: "relative", display: "flex", alignItems: "center",
              justifyContent: "space-between", flexWrap: "wrap", gap: 16,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <button
                  onClick={() => navigate(-1)}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "8px 14px", borderRadius: 10,
                    border: `1px solid ${t.borderHov}`,
                    background: t.actBg, color: t.textSub,
                    fontSize: 12, fontWeight: 600, cursor: "pointer",
                    fontFamily: "'Poppins',sans-serif", transition: "all 0.2s",
                  }}
                >
                  <ArrowLeft size={14} /> Back
                </button>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
                    <MessageSquare size={11} color={t.textSub} />
                    <span style={{
                      fontSize: 9, fontWeight: 700, letterSpacing: "0.22em",
                      textTransform: "uppercase", color: t.textSub,
                      fontFamily: "'Poppins',sans-serif",
                    }}>Support</span>
                  </div>
                  <h1 style={{
                    fontFamily: "'Poppins',sans-serif", fontWeight: 900,
                    fontSize: "clamp(1.4rem,2.5vw,2rem)", color: t.text,
                    margin: 0, lineHeight: 1.1, letterSpacing: "-0.02em",
                  }}>Feedback &amp; Support</h1>
                  <p style={{
                    fontSize: 12, color: t.textSub, marginTop: 6,
                    fontWeight: 500, fontFamily: "'Poppins',sans-serif",
                  }}>Review, track and respond to feedback</p>
                </div>
              </div>

              {/* items counter badge */}
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                background: t.actBg, border: `1px solid ${t.actBorder}`,
                borderRadius: 12, padding: "8px 16px",
                fontSize: 12, fontWeight: 600,
                fontFamily: "'Poppins',sans-serif", color: t.textSub,
              }}>
                <MessageSquare size={13} color="#22D3EE" />
                <span style={{ color: t.text, fontWeight: 700 }}>0</span>
                <span>Items</span>
              </div>
            </div>
          </div>

          {/* ═══════ STAT CARDS ═══════ */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: 14, marginBottom: 20,
          }}>
            {STATS.map((s, i) => <StatCard key={i} stat={s} t={t} />)}
          </div>

          {/* ═══════ FILTER BAR ═══════ */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: 12,
            background: t.cardBg, border: `1px solid ${t.border}`,
            borderRadius: 20, padding: "14px 20px",
            boxShadow: t.shadow, marginBottom: 20,
          }}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              <CustomSelect value={type}   onChange={setType}   options={typeOptions}   t={t} />
              <CustomSelect value={status} onChange={setStatus} options={statusOptions} t={t} />
            </div>

            <div style={{ position: "relative" }}>
              <Search size={14} style={{
                position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                color: t.textMuted, pointerEvents: "none",
              }} />
              <input
                placeholder="Search feedback…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  height: 36, paddingLeft: 36, paddingRight: 14,
                  borderRadius: 10, border: `1px solid ${t.inputBorder}`,
                  background: t.inputBg, color: t.inputText,
                  fontSize: 12, fontFamily: "'Poppins',sans-serif",
                  width: 220, outline: "none", transition: "border-color 0.15s, box-shadow 0.15s",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(34,211,238,0.4)";
                  e.target.style.boxShadow   = "0 0 0 3px rgba(34,211,238,0.08)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = t.inputBorder;
                  e.target.style.boxShadow   = "none";
                }}
              />
            </div>
          </div>

          {/* ═══════ FEEDBACK LIST CARD ═══════ */}
          <div style={{
            background: t.cardBg, border: `1px solid ${t.border}`,
            borderRadius: 20, overflow: "hidden", boxShadow: t.shadow,
          }}>
            {/* card header */}
            <div style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "16px 24px", borderBottom: `1px solid ${t.border}`,
              background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.015)",
            }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.2)",
              }}>
                <MessageSquare size={15} color="#22D3EE" />
              </div>
              <div>
                <p style={{
                  fontSize: 13, fontWeight: 700, color: t.text,
                  fontFamily: "'Poppins',sans-serif", margin: 0,
                }}>Feedback Items</p>
                <p style={{
                  fontSize: 11, color: t.textMuted, margin: "2px 0 0",
                  fontFamily: "'Poppins',sans-serif",
                }}>{items.length} items found</p>
              </div>
            </div>

            {/* card body */}
            <div style={{ padding: 16 }}>
              {items.length === 0 ? (
                <div style={{
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  padding: "64px 0", gap: 12,
                }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: 16,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    border: `1.5px dashed ${t.emptyBorder}`, background: t.emptyBg,
                  }}>
                    <MessageSquare size={24} color={t.emptyIcon} />
                  </div>
                  <p style={{
                    fontSize: 13, fontWeight: 500, color: t.textSub,
                    fontFamily: "'Poppins',sans-serif", margin: 0,
                  }}>No feedback available</p>
                  <p style={{
                    fontSize: 11, color: t.textMuted,
                    fontFamily: "'Poppins',sans-serif", margin: 0,
                  }}>Feedback will appear once users submit it</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {items.map((item) => {
                    const tc = TYPE_COLORS[item.type]    || TYPE_COLORS.general;
                    const sc = STATUS_COLORS[item.status] || STATUS_COLORS.open;
                    return <FeedbackRow key={item.id} item={item} tc={tc} sc={sc} t={t} />;
                  })}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default FeedbackAdmin;