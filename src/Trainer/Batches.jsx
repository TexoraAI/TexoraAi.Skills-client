// import React, { useEffect, useState } from "react";
// import { getTrainerBatches } from "../services/batchService";
// import {
//   Loader2,
//   Users,
//   Clock,
//   Search,
//   Grid3x3,
//   List,
//   ChevronRight,
//   PlayCircle,
//   CheckCircle,
//   AlertCircle,
// } from "lucide-react";

// import { Card } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";

// /* ===== Status Config ===== */
// const statusVariant = {
//   RUNNING: "default",
//   UPCOMING: "secondary",
//   COMPLETED: "outline",
// };

// const statusConfig = {
//   RUNNING: {
//     icon: PlayCircle,
//     color: "text-emerald-600 dark:text-emerald-400",
//     bg: "bg-emerald-100 dark:bg-emerald-900/40",
//     gradient: "from-emerald-500 to-teal-600",
//   },
//   UPCOMING: {
//     icon: Clock,
//     color: "text-blue-600 dark:text-blue-400",
//     bg: "bg-blue-100 dark:bg-blue-900/40",
//     gradient: "from-blue-500 to-indigo-600",
//   },
//   COMPLETED: {
//     icon: CheckCircle,
//     color: "text-slate-600 dark:text-slate-400",
//     bg: "bg-slate-100 dark:bg-slate-800",
//     gradient: "from-slate-500 to-slate-600",
//   },
// };

// const Batches = () => {
//   const [batches, setBatches] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [statusFilter, setStatusFilter] = useState("ALL");
//   const [viewMode, setViewMode] = useState("grid");

//   useEffect(() => {
//     getTrainerBatches()
//       .then((res) => setBatches(res.data || []))
//       .finally(() => setLoading(false));
//   }, []);

//   const filteredBatches = batches.filter((batch) => {
//     const matchesSearch =
//       batch.batchCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       batch.name?.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesStatus =
//       statusFilter === "ALL" || batch.status === statusFilter;
//     return matchesSearch && matchesStatus;
//   });

//   const stats = {
//     total: batches.length,
//     running: batches.filter((b) => b.status === "RUNNING").length,
//     upcoming: batches.filter((b) => b.status === "UPCOMING").length,
//     completed: batches.filter((b) => b.status === "COMPLETED").length,
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0b1220]">
//         <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen p-6 bg-slate-50 dark:bg-[#0b1220]">
//       <div className="max-w-7xl mx-auto space-y-8">
//         {/* ================= HERO (REAL ICON + DARK FIX) ================= */}
//         <div
//           className="
//           relative overflow-hidden rounded-3xl
//           bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500
//           p-6 shadow-xl
//         "
//         >
//           <div className="relative z-10 flex items-center gap-4">
//             {/* REAL ICON */}
//             <div
//               className="
//               p-3 rounded-2xl
//               bg-white
//               shadow-lg
//             "
//             >
//               <Users className="w-6 h-6 text-blue-600" />
//             </div>

//             <div>
//               <h1 className="text-2xl font-bold text-white">
//                 Batch Management
//               </h1>
//               <p className="text-sm text-white/90">
//                 Manage and monitor your training batches
//               </p>
//             </div>
//           </div>

//           {/* subtle glow */}
//           <div className="absolute -top-20 -right-20 w-56 h-56 bg-white/20 rounded-full blur-3xl" />
//         </div>
//         {/* ============================================================= */}

//         {/* ================= STATS ================= */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           <StatCard label="Total" value={stats.total} icon={Users} />
//           <StatCard label="Running" value={stats.running} icon={PlayCircle} />
//           <StatCard label="Upcoming" value={stats.upcoming} icon={Clock} />
//           <StatCard
//             label="Completed"
//             value={stats.completed}
//             icon={CheckCircle}
//           />
//         </div>

//         {/* ================= FILTERS ================= */}
//         <div className="bg-white dark:bg-[#0f1c3a] rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
//           <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
//             <div className="relative flex-1 max-w-md">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
//               <input
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 placeholder="Search batch..."
//                 className="
//                   w-full pl-9 pr-3 py-2.5 rounded-xl border
//                   bg-slate-50 dark:bg-[#0b1220]
//                   text-slate-900 dark:text-slate-100
//                   border-slate-300 dark:border-slate-700
//                 "
//               />
//             </div>

//             <div className="flex gap-2 flex-wrap">
//               {["ALL", "RUNNING", "UPCOMING", "COMPLETED"].map((s) => (
//                 <button
//                   key={s}
//                   onClick={() => setStatusFilter(s)}
//                   className={`px-4 py-2 rounded-xl text-sm font-semibold ${
//                     statusFilter === s
//                       ? "bg-blue-600 text-white"
//                       : "bg-slate-100 dark:bg-[#0b1220] text-slate-700 dark:text-slate-300"
//                   }`}
//                 >
//                   {s}
//                 </button>
//               ))}
//             </div>

//             <div className="flex bg-slate-100 dark:bg-[#0b1220] p-1.5 rounded-xl">
//               <button
//                 onClick={() => setViewMode("grid")}
//                 className={`p-2 rounded-lg ${
//                   viewMode === "grid" && "bg-white dark:bg-[#162c63] shadow"
//                 }`}
//               >
//                 <Grid3x3 className="w-4 h-4 text-slate-700 dark:text-slate-200" />
//               </button>
//               <button
//                 onClick={() => setViewMode("table")}
//                 className={`p-2 rounded-lg ${
//                   viewMode === "table" && "bg-white dark:bg-[#162c63] shadow"
//                 }`}
//               >
//                 <List className="w-4 h-4 text-slate-700 dark:text-slate-200" />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* ================= EMPTY ================= */}
//         {filteredBatches.length === 0 && (
//           <div className="bg-white dark:bg-[#0f1c3a] border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center">
//             <AlertCircle className="w-10 h-10 mx-auto text-slate-400 mb-3" />
//             <p className="text-slate-600 dark:text-slate-300">
//               No batches found
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// /* ===== STAT CARD ===== */
// const StatCard = ({ label, value, icon: Icon }) => (
//   <div className="bg-white dark:bg-[#0f1c3a] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center justify-between">
//     <div>
//       <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
//       <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
//         {value}
//       </p>
//     </div>
//     <Icon className="w-6 h-6 text-blue-500 dark:text-blue-400" />
//   </div>
// );

// export default Batches;

































import React, { useEffect, useState } from "react";
import { getTrainerBatches } from "../services/batchService";
import {
  Users,
  Clock,
  Search,
  Grid3x3,
  List,
  PlayCircle,
  CheckCircle,
  AlertCircle,
  Hash,
  BookOpen,
} from "lucide-react";

// ── Global Design System — single source of truth for colors, typography,
// spacing, radius, shadows, StatCard, Hero, and PageContainer. This page
// now pulls the shared <Hero> component and the RADIUS / FONT_SIZE /
// LINE_HEIGHT / LETTER_SPACING / ACCENT_PURPLE tokens instead of a
// page-local hero div and hardcoded px/color values, matching the
// Attendance page (Golden Reference) exactly.
import {
  T,
  STAT_COLORS,
  FONT_FAMILY,
  FONT_WEIGHT,
  FONT_SIZE,
  LINE_HEIGHT,
  LETTER_SPACING,
  RADIUS,
  CARD_PADDING,
  ACCENT_PURPLE,
  StatCard,
  Hero,
  PageContainer,
} from "@/design-system";

/* ═══════════════════════════════════════════════
   STATUS META (page-specific semantic colors —
   mirrors the METRIC_COLORS pattern used on
   Batch Reports, layered on top of design tokens)
═══════════════════════════════════════════════ */
const STATUS_META = {
  RUNNING: { label: "Running", icon: PlayCircle, color: "#34d399" },
  UPCOMING: { label: "Upcoming", icon: Clock, color: "#38bdf8" },
  COMPLETED: { label: "Completed", icon: CheckCircle, color: "#94a3b8" },
};

/* ─── Loader (identical pattern to Batch Reports / Dashboard) ─── */
function Loader({ t, text }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, color: t.textMuted, fontSize: 13, fontFamily: FONT_FAMILY }}>
      <span
        style={{
          width: 20,
          height: 20,
          borderRadius: "50%",
          border: `2px solid ${ACCENT_PURPLE.base}33`,
          borderTopColor: ACCENT_PURPLE.base,
          display: "inline-block",
          animation: "bspin .8s linear infinite",
        }}
      />
      <span>{text}</span>
    </div>
  );
}

/* ─── Local page styles (layout/animation only — colors always come from T) ─── */
function pageStyles() {
  return `
    @keyframes bspin { to { transform: rotate(360deg); } }
    @keyframes bfade { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .b-fade { animation: bfade .35s ease both; }
    .batches-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 14px;
    }
    /* ── iPad Pro / small laptops ── */
    @media (max-width: 1024px) {
      .batches-grid { grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); }
    }
    /* ── Surface / iPad / iPad Mini ── */
    @media (max-width: 900px) {
      .b-toolbar { flex-direction: column; align-items: stretch !important; }
      .b-filter-chips { justify-content: flex-start !important; }
    }
    @media (max-width: 768px) {
      .batches-grid { grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 10px; }
    }
    /* ── Large phones ── */
    @media (max-width: 640px) {
      .batches-grid { grid-template-columns: 1fr; }
      .b-toolbar { flex-direction: column; align-items: stretch !important; }
      .b-filter-chips { justify-content: flex-start !important; }
    }
    /* ── Small phones ── */
    @media (max-width: 380px) {
      .b-filter-chips button { padding: 7px 12px !important; font-size: 10px !important; }
    }
    .b-scroll::-webkit-scrollbar { height: 4px; }
    .b-scroll::-webkit-scrollbar-thumb { background: var(--b-scrollbar, rgba(148,163,184,.4)); border-radius: 4px; }
  `;
}

const Batches = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState("grid");

  const [isDark, setIsDark] = useState(
    () =>
      typeof document !== "undefined" &&
      (document.documentElement.classList.contains("dark") ||
        document.documentElement.getAttribute("data-theme") === "dark"),
  );

  useEffect(() => {
    const obs = new MutationObserver(() => {
      setIsDark(
        document.documentElement.classList.contains("dark") ||
          document.documentElement.getAttribute("data-theme") === "dark",
      );
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
    return () => obs.disconnect();
  }, []);

  const t = isDark ? T.dark : T.light;

  useEffect(() => {
    getTrainerBatches()
      .then((res) => setBatches(res.data || []))
      .finally(() => setLoading(false));
  }, []);

  const filteredBatches = batches.filter((batch) => {
    const matchesSearch =
      batch.batchCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      batch.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || batch.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: batches.length,
    running: batches.filter((b) => b.status === "RUNNING").length,
    upcoming: batches.filter((b) => b.status === "UPCOMING").length,
    completed: batches.filter((b) => b.status === "COMPLETED").length,
  };

  const statCards = [
    { label: "Total Batches", numericValue: stats.total, change: `${stats.total} overall`, trend: "up", icon: Users, colorKey: "blue" },
    { label: "Running", numericValue: stats.running, change: stats.running > 0 ? `${stats.running} in progress` : "None active", trend: stats.running > 0 ? "up" : "down", icon: PlayCircle, colorKey: "green" },
    { label: "Upcoming", numericValue: stats.upcoming, change: stats.upcoming > 0 ? `${stats.upcoming} scheduled` : "None scheduled", trend: "up", icon: Clock, colorKey: "orange" },
    { label: "Completed", numericValue: stats.completed, change: `${stats.completed} finished`, trend: "up", icon: CheckCircle, colorKey: "purple" },
  ];

  const card = { background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: RADIUS.standardCard, boxShadow: t.shadow };

  if (loading) {
    return (
      <>
        <style>{pageStyles()}</style>
        <div style={{ minHeight: "100vh", background: t.pageBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Loader t={t} text="Loading batches..." />
        </div>
      </>
    );
  }

  return (
    <>
      <style>{pageStyles()}</style>
      <PageContainer mode={isDark ? "dark" : "light"} pageBg={t.pageBg} textColor={t.text}>
        {/* ═══ HERO — shared <Hero> component, same anatomy and typography
            tokens (FONT_SIZE / LINE_HEIGHT / LETTER_SPACING) as the
            Attendance page (Golden Reference), instead of a page-local
            hero div with hardcoded values. ═══ */}
        <Hero borderHero={t.borderHero}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: ACCENT_PURPLE.base }} />
              <span
                style={{
                  fontSize: FONT_SIZE.eyebrow,
                  fontWeight: FONT_WEIGHT.bold,
                  letterSpacing: LETTER_SPACING.eyebrowWide,
                  textTransform: "uppercase",
                  color: t.textSub,
                  fontFamily: FONT_FAMILY,
                }}
              >
                Batch Management
              </span>
            </div>
            <h1
              style={{
                fontFamily: FONT_FAMILY,
                fontWeight: FONT_WEIGHT.heroTitle,
                fontSize: FONT_SIZE.heroTitle,
                color: ACCENT_PURPLE.base,
                margin: "0 0 6px",
                lineHeight: LINE_HEIGHT.heroTitle,
                letterSpacing: LETTER_SPACING.heroTitle,
              }}
            >
              Batch Management
            </h1>
            <p
              style={{
                fontSize: FONT_SIZE.bodySmall,
                color: t.textSub,
                margin: 0,
                fontWeight: FONT_WEIGHT.medium,
                fontFamily: FONT_FAMILY,
              }}
            >
              Manage and monitor your training batches
            </p>
          </div>

          <div className="hero-badges">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                background: t.actBg,
                border: `1px solid ${t.actBorder}`,
                borderRadius: 12,
                padding: "8px 16px",
                fontSize: 11,
                fontWeight: 600,
                fontFamily: FONT_FAMILY,
                color: t.textSub,
              }}
            >
              <span>{stats.running} running</span>
              <span style={{ width: 1, height: 14, background: t.actBorder }} />
              <span>{stats.upcoming} upcoming</span>
            </div>
          </div>
        </Hero>

        {/* ═══ STAT CARDS ═══ */}
        <div className="stat-grid" style={{ marginBottom: 20 }}>
          {statCards.map((s, i) => (
            <StatCard key={i} stat={s} index={i} loading={false} />
          ))}
        </div>

        {/* ═══ FILTERS / TOOLBAR ═══ */}
        <div style={{ ...card, padding: CARD_PADDING.standardCard, marginBottom: 20 }}>
          <div className="b-toolbar" style={{ display: "flex", gap: 14, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
            <div style={{ position: "relative", flex: 1, minWidth: 220, maxWidth: 380 }}>
              <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: t.textMuted }} />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search batch..."
                style={{
                  width: "100%",
                  padding: "10px 12px 10px 34px",
                  borderRadius: RADIUS.button,
                  border: `1px solid ${t.border}`,
                  background: t.actBg,
                  color: t.text,
                  fontSize: 13,
                  fontFamily: FONT_FAMILY,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div className="b-filter-chips" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["ALL", "RUNNING", "UPCOMING", "COMPLETED"].map((s) => {
                const active = statusFilter === s;
                return (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    style={{
                      padding: "8px 16px",
                      borderRadius: RADIUS.pill,
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.04em",
                      cursor: "pointer",
                      fontFamily: FONT_FAMILY,
                      transition: "all .2s",
                      border: `1px solid ${active ? `${ACCENT_PURPLE.base}66` : t.pillBorder}`,
                      background: active ? `${ACCENT_PURPLE.base}18` : t.pillBg,
                      color: active ? ACCENT_PURPLE.base : t.textMuted,
                    }}
                  >
                    {s}
                  </button>
                );
              })}
            </div>

            <div style={{ display: "flex", background: t.actBg, border: `1px solid ${t.actBorder}`, padding: 4, borderRadius: RADIUS.button, gap: 2 }}>
              <button
                onClick={() => setViewMode("grid")}
                style={{
                  padding: 8,
                  borderRadius: RADIUS.chip,
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  background: viewMode === "grid" ? t.cardBg : "transparent",
                  boxShadow: viewMode === "grid" ? t.shadow : "none",
                }}
              >
                <Grid3x3 size={15} color={viewMode === "grid" ? t.text : t.textMuted} />
              </button>
              <button
                onClick={() => setViewMode("table")}
                style={{
                  padding: 8,
                  borderRadius: RADIUS.chip,
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  background: viewMode === "table" ? t.cardBg : "transparent",
                  boxShadow: viewMode === "table" ? t.shadow : "none",
                }}
              >
                <List size={15} color={viewMode === "table" ? t.text : t.textMuted} />
              </button>
            </div>
          </div>
        </div>

        {/* ═══ EMPTY STATE ═══ */}
        {filteredBatches.length === 0 && (
          <div style={{ ...card, padding: "56px 24px", textAlign: "center" }} className="b-fade">
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 15,
                margin: "0 auto 14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: `1.5px dashed ${t.emptyBorder}`,
                background: t.emptyBg,
              }}
            >
              <AlertCircle size={22} color={t.emptyIcon} />
            </div>
            <p style={{ fontSize: 13, fontWeight: 700, color: t.text, margin: 0, fontFamily: FONT_FAMILY }}>No batches found</p>
          </div>
        )}

        {/* ═══ GRID VIEW ═══ */}
        {filteredBatches.length > 0 && viewMode === "grid" && (
          <div className="batches-grid b-fade">
            {filteredBatches.map((batch) => {
              const meta = STATUS_META[batch.status] || STATUS_META.COMPLETED;
              const Icon = meta.icon;
              return (
                <div
                  key={batch.id ?? batch.batchCode}
                  style={{
                    ...card,
                    padding: 18,
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                      <div
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: RADIUS.chip,
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: `${meta.color}18`,
                          border: `1px solid ${meta.color}30`,
                        }}
                      >
                        <BookOpen size={16} color={meta.color} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: t.text,
                            margin: "0 0 3px",
                            fontFamily: FONT_FAMILY,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {batch.name || batch.batchCode || "Untitled Batch"}
                        </p>
                        <div style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 10, color: t.textMuted }}>
                          <Hash size={10} />
                          <span>{batch.batchCode || batch.id}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <span
                    style={{
                      alignSelf: "flex-start",
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      padding: "4px 10px",
                      borderRadius: RADIUS.pill,
                      background: `${meta.color}18`,
                      border: `1px solid ${meta.color}30`,
                      color: meta.color,
                      fontFamily: FONT_FAMILY,
                    }}
                  >
                    <Icon size={11} />
                    {meta.label.toUpperCase()}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* ═══ TABLE VIEW ═══ */}
        {filteredBatches.length > 0 && viewMode === "table" && (
          <div style={{ ...card, overflow: "hidden" }} className="b-fade">
            <div style={{ overflowX: "auto" }} className="b-scroll">
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["Batch", "Code", "Status"].map((th) => (
                      <th
                        key={th}
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: t.tableTh,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          padding: "12px 16px",
                          textAlign: "left",
                          borderBottom: `1px solid ${t.border}`,
                          background: t.tableThBg,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {th}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredBatches.map((batch) => {
                    const meta = STATUS_META[batch.status] || STATUS_META.COMPLETED;
                    const Icon = meta.icon;
                    const td = { padding: "12px 16px", borderBottom: `1px solid ${t.border}`, fontSize: 12, color: t.textSub, verticalAlign: "middle" };
                    return (
                      <tr key={batch.id ?? batch.batchCode}>
                        <td style={td}>
                          <span style={{ fontWeight: 600, color: t.text, fontFamily: FONT_FAMILY }}>
                            {batch.name || "Untitled Batch"}
                          </span>
                        </td>
                        <td style={td}>{batch.batchCode || batch.id}</td>
                        <td style={td}>
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 5,
                              fontSize: 10,
                              fontWeight: 700,
                              letterSpacing: "0.06em",
                              padding: "4px 10px",
                              borderRadius: RADIUS.pill,
                              background: `${meta.color}18`,
                              border: `1px solid ${meta.color}30`,
                              color: meta.color,
                              fontFamily: FONT_FAMILY,
                            }}
                          >
                            <Icon size={11} />
                            {meta.label.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </PageContainer>
    </>
  );
};

export default Batches;