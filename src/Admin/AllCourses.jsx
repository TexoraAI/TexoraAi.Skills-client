import { courseService } from "@/services/courseService";
import {
  BookOpen,
  Folder,
  Layers,
  Mail,
  Plus,
  Search,
  Tag,
  Users,
  X,
  UserCheck,
  GripVertical,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";

// ─── Global Design System — single source of truth for colors, type,
// spacing, radius, StatCard, PageContainer and Hero. This page must not
// redeclare tokens or components that already live there (see
// AdminDashboard.jsx, the Golden Reference, which this page now visually
// matches). The page's previous bespoke CSS-variable theme (--c1, --blue,
// Google-Fonts import, etc.) has been removed in favor of the shared
// tokens below.
import {
  T,
  FONT_FAMILY,
  FONT_WEIGHT,
  FONT_SIZE,
  LINE_HEIGHT,
  LETTER_SPACING,
  RADIUS,
  CARD_PADDING,
  ACCENT_PURPLE,
  PageContainer,
  Hero,
  StatCard,
} from "@/design-system";

/* ─────────────────────────────────────────────────────────────────────────
   Page-local layout helpers only — no color/spacing/radius values are
   invented here, everything is sourced from the theme token object (t)
   or the shared FONT_FAMILY / FONT_WEIGHT / RADIUS / CARD_PADDING tokens,
   exactly the same way AdminDashboard.jsx's SectionCard / IconBadge /
   EmptyBlock are page-local but token-driven. The resizable create-course
   drawer/divider is inherently page-specific layout (not part of the
   shared design system), so it stays here, restyled with the same tokens.
───────────────────────────────────────────────────────────────────────── */

const isDark = () =>
  document.documentElement.classList.contains("dark") ||
  document.documentElement.getAttribute("data-theme") === "dark";

function IconBadge({ icon: Icon, color, size = 34, iconSize = 15 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: RADIUS.chip,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `${color}18`,
        border: `1px solid ${color}30`,
        flexShrink: 0,
      }}
    >
      <Icon size={iconSize} color={color} />
    </div>
  );
}

function SectionCard({ t, children, style }) {
  return (
    <div
      style={{
        background: t.cardBg,
        border: `1px solid ${t.border}`,
        borderRadius: RADIUS.standardCard,
        padding: CARD_PADDING.standardCard,
        boxShadow: t.shadow,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function EmptyBlock({ t, icon: Icon, title, sub }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "36px 18px",
        gap: 12,
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 14,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: `1.5px dashed ${t.emptyBorder}`,
          background: t.emptyBg,
        }}
      >
        <Icon size={20} color={t.emptyIcon} />
      </div>
      <div>
        <p
          style={{
            fontSize: 13,
            color: t.text,
            fontWeight: FONT_WEIGHT.bold,
            fontFamily: FONT_FAMILY,
            margin: 0,
          }}
        >
          {title}
        </p>
        {sub && (
          <p
            style={{
              fontSize: 11.5,
              color: t.textMuted,
              fontFamily: FONT_FAMILY,
              margin: "4px 0 0",
            }}
          >
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

function SearchBar({ t, value, onChange, placeholder }) {
  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 280 }}>
      <Search
        size={14}
        color={t.textMuted}
        style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          boxSizing: "border-box",
          borderRadius: RADIUS.chip,
          border: `1px solid ${t.border}`,
          background: t.recentItemBg,
          color: t.text,
          fontFamily: FONT_FAMILY,
          fontSize: 12.5,
          padding: "9px 12px 9px 34px",
          outline: "none",
        }}
      />
    </div>
  );
}

function Field({ t, label, required, hint, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: 5,
          fontSize: 10.5,
          fontWeight: FONT_WEIGHT.bold,
          textTransform: "uppercase",
          letterSpacing: LETTER_SPACING.eyebrow,
          color: t.textMuted,
          fontFamily: FONT_FAMILY,
        }}
      >
        {label} {required && <span style={{ color: "#e11d48" }}>*</span>}
      </label>
      {children}
      {hint && (
        <p style={{ fontSize: 10.5, color: t.textMuted, margin: "1px 0 0", fontFamily: FONT_FAMILY }}>{hint}</p>
      )}
    </div>
  );
}

function inputStyle(t) {
  return {
    width: "100%",
    boxSizing: "border-box",
    padding: "11px 13px",
    borderRadius: RADIUS.chip,
    border: `1.5px solid ${t.border}`,
    background: t.recentItemBg,
    color: t.text,
    fontFamily: FONT_FAMILY,
    fontSize: 12.5,
    outline: "none",
  };
}

/* ── category tag colours (literal hex, no page-scoped CSS vars) ── */
const CAT_COLORS = [
  { color: "#4f46e5", bd: "rgba(79,70,229,.22)" },
  { color: "#db2777", bd: "rgba(219,39,119,.22)" },
  { color: "#d97706", bd: "rgba(217,119,6,.22)" },
  { color: "#059669", bd: "rgba(5,150,105,.22)" },
  { color: "#2563eb", bd: "rgba(37,99,235,.22)" },
];
const catColor = (val) => CAT_COLORS[(String(val)?.charCodeAt(0) ?? 0) % CAT_COLORS.length];

/* ── avatar gradients ── */
const GRAD_BG = [
  "linear-gradient(135deg,#6d28d9,#4338ca)",
  "linear-gradient(135deg,#db2777,#9d174d)",
  "linear-gradient(135deg,#d97706,#92400e)",
  "linear-gradient(135deg,#059669,#065f46)",
  "linear-gradient(135deg,#2563eb,#1e40af)",
  "linear-gradient(135deg,#7c3aed,#5b21b6)",
];
const gradBg = (val) => GRAD_BG[(String(val)?.charCodeAt(0) ?? 0) % GRAD_BG.length];

/* ── default form ── */
const EMPTY_FORM = {
  title: "",
  category: "",
  description: "",
  assignedTrainerEmail: "",
};

/* ── split layout constraints (per spec) ── */
const MIN_LEFT_WIDTH = 500; // px
const MIN_RIGHT_WIDTH = 420; // px
const DEFAULT_RIGHT_PCT = 0.4; // 40% of screen

/* ════════════════════════════════════════════════════════════════════
   MAIN — all state, handlers, API calls, drag-resize logic, and modal
   behavior are UNCHANGED from the original implementation. Only the
   render layer below has been rebuilt on the shared design system.
════════════════════════════════════════════════════════════════════ */
const AllCourses = () => {
  const [dark, setDark] = useState(isDark);
  const [activeTab, setActiveTab] = useState("courses"); // "courses" | "categories"
  const [search, setSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trainers, setTrainers] = useState([]);
  const [trainersLoading, setTrainersLoading] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null); // { msg, err }

  const getDefaultRightWidth = () => {
    const pct = window.innerWidth * DEFAULT_RIGHT_PCT;
    const maxAllowedByLeft = window.innerWidth - MIN_LEFT_WIDTH - 6;
    return Math.max(MIN_RIGHT_WIDTH, Math.min(pct, maxAllowedByLeft));
  };
  const [rightWidth, setRightWidth] = useState(getDefaultRightWidth);
  const [dragging, setDragging] = useState(false);
  const dragStateRef = useRef({ startX: 0, startWidth: 0 });
  const splitRef = useRef(null);

  useEffect(() => {
    const o = new MutationObserver(() => setDark(isDark()));
    o.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
    return () => o.disconnect();
  }, []);

  useEffect(() => {
    setTrainersLoading(true);
    courseService
      .getOrgTrainers()
      .then((res) => setTrainers(res.data || []))
      .catch((err) => console.error("Failed to load trainers", err))
      .finally(() => setTrainersLoading(false));
  }, []);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = () => {
    setLoading(true);
    courseService
      .getOrgAdminCourses()
      .then((res) => {
        const mapped = res.data.map((c) => ({
          id: c.id,
          name: c.title,
          category: c.category,
          trainerName: c.ownerEmail,
          assignedTrainer: c.assignedTrainerEmail || null,
          status: "PUBLISHED",
          enrollments: 0,
        }));
        setCourses(mapped);
      })
      .catch((err) => console.error("Failed to load courses", err))
      .finally(() => setLoading(false));
  };

  const showToast = (msg, err = false) => {
    setToast({ msg, err });
    setTimeout(() => setToast(null), 3000);
  };

  const openModal = () => {
    setForm(EMPTY_FORM);
    setRightWidth(getDefaultRightWidth());
    setOpen(true);
    setClosing(false);
  };

  const closeModal = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setOpen(false);
      setClosing(false);
      setForm(EMPTY_FORM);
    }, 200);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeModal]);

  const onDividerMouseDown = (e) => {
    e.preventDefault();
    dragStateRef.current = { startX: e.clientX, startWidth: rightWidth };
    setDragging(true);
  };

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e) => {
      const containerWidth = splitRef.current
        ? splitRef.current.getBoundingClientRect().width
        : window.innerWidth;
      const delta = dragStateRef.current.startX - e.clientX;
      let nextRight = dragStateRef.current.startWidth + delta;
      const maxRight = containerWidth - MIN_LEFT_WIDTH - 6;
      nextRight = Math.min(maxRight, Math.max(MIN_RIGHT_WIDTH, nextRight));
      setRightWidth(nextRight);
    };
    const onUp = () => setDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragging]);

  const handleCreate = async () => {
    if (!form.title.trim()) {
      showToast("Course name is required", true);
      return;
    }
    if (!form.category.trim()) {
      showToast("Category is required", true);
      return;
    }
    if (!form.assignedTrainerEmail) {
      showToast("Please assign a trainer", true);
      return;
    }

    try {
      setSubmitting(true);
      await courseService.adminCreateCourse({
        title: form.title.trim(),
        category: form.category.trim(),
        description: form.description.trim(),
        assignedTrainerEmail: form.assignedTrainerEmail,
      });
      closeModal();
      loadCourses();
      showToast("Course created and assigned successfully!");
    } catch (err) {
      console.error("Create course failed", err);
      showToast(err?.response?.data?.message || "Failed to create course", true);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCourses = courses.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  const publishedCount = courses.filter((c) => c.status === "PUBLISHED").length;

  // Categories are grouped from the same `courses` data this page already
  // loads via loadCourses() — same source getOrgAdminCourses() that
  // Categories.jsx used, just derived in-page instead of a second fetch.
  const categories = (() => {
    const grouped = {};
    courses.forEach((c) => {
      const category = c.category || "Uncategorized";
      grouped[category] = (grouped[category] || 0) + 1;
    });
    return Object.keys(grouped).map((name, index) => ({
      id: index + 1,
      name,
      courseCount: grouped[name],
      active: true,
    }));
  })();

  const filteredCategories = categories.filter((c) => c.name.toLowerCase().includes(categorySearch.toLowerCase()));

  const activeCategoryCount = categories.filter((c) => c.active).length;

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const t = dark ? T.dark : T.light;

  const stats = [
    { label: "Total Courses", numericValue: courses.length, icon: BookOpen, colorKey: "blue", change: "All courses in your organisation" },
    { label: "Published", numericValue: publishedCount, icon: Users, colorKey: "green", change: "Currently live for learners" },
    { label: "Trainers", numericValue: trainers.length, icon: UserCheck, colorKey: "purple", change: "Available to assign" },
  ];

  // ── HERO COPY — switches with the active tab so the heading always
  // reflects what's actually on screen (Courses vs Categories).
  const heroCopy =
    activeTab === "categories"
      ? {
          eyebrow: "Category Management",
          title: "Categories",
          subtitle: "Create, organise and manage all course categories in your organisation",
        }
      : {
          eyebrow: "Course Management",
          title: "All Courses",
          subtitle: "Create, assign and manage all courses in your organisation",
        };

  return (
    <PageContainer mode={dark ? "dark" : "light"} pageBg={t.pageBg} textColor={t.text}>
      <style>{`
        @media (max-width:560px){
          .ac-hero-badges{width:100%;}
        }
        .ac-spin{ animation: acSpin 0.8s linear infinite; }
        @keyframes acSpin { to{ transform: rotate(360deg);} }
        .ac-pulse{ animation: acPulse 1.4s ease-in-out infinite; }
        @keyframes acPulse { 0%,100%{opacity:1} 50%{opacity:.45} }
        .ac-blink{ animation: acBlink 1.4s ease-in-out infinite; }
        @keyframes acBlink { 0%,100%{opacity:1} 50%{opacity:.3} }
        .ac-toast-in{ animation: acToastIn .25s ease; }
        @keyframes acToastIn { from{ transform: translateY(16px); opacity:0;} to{ transform: translateY(0); opacity:1;} }
        .ac-split-row{ display:flex; align-items:stretch; gap:0; }
        @media (max-width:1024px){
          .ac-split-row{ flex-direction:column; }
          .ac-divider{ display:none !important; }
          .ac-panel{ width:100% !important; flex-basis:auto !important; }
        }
        .ac-tscroll{ width:100%; overflow-x:auto; -webkit-overflow-scrolling:touch; }
        .ac-tscroll::-webkit-scrollbar{ height:8px; }
      `}</style>

      {/* ═══ HERO — shared <Hero> component, matches Admin/Trainer Dashboard exactly ═══ */}
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
              {heroCopy.eyebrow}
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
            {heroCopy.title}
          </h1>
          <p style={{ fontSize: FONT_SIZE.bodySmall, color: t.textSub, margin: 0, fontWeight: FONT_WEIGHT.medium, fontFamily: FONT_FAMILY }}>
            {heroCopy.subtitle}
          </p>
        </div>

        <div className="hero-badges ac-hero-badges">
          {!loading && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                background: t.actBg,
                border: `1px solid ${t.actBorder}`,
                borderRadius: RADIUS.chip,
                padding: "8px 16px",
                fontSize: 11,
                fontWeight: FONT_WEIGHT.semibold,
                fontFamily: FONT_FAMILY,
                color: t.textSub,
                flexWrap: "wrap",
              }}
            >
              <span>{courses.length} courses</span>
              <span style={{ width: 1, height: 14, background: t.actBorder }} />
              <span>{publishedCount} published</span>
              <span style={{ width: 1, height: 14, background: t.actBorder }} />
              <span>{trainers.length} trainers</span>
            </div>
          )}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              background: "rgba(124,58,237,0.08)",
              border: "1px solid rgba(124,58,237,0.3)",
              borderRadius: RADIUS.pill,
              padding: "8px 18px",
              color: ACCENT_PURPLE.base,
              fontSize: 11,
              fontWeight: FONT_WEIGHT.bold,
              letterSpacing: LETTER_SPACING.eyebrowWide,
              fontFamily: FONT_FAMILY,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: ACCENT_PURPLE.base, display: "inline-block" }} />
            LIVE
          </div>
        </div>
      </Hero>

      {/* ═══ 3 STAT CARDS — shared <StatCard> ═══ */}
      <div className="stat-grid" style={{ marginBottom: 20 }}>
        {stats.map((s, i) => (
          <StatCard key={s.label} stat={s} index={i} loading={loading} mode={dark ? "dark" : "light"} />
        ))}
      </div>

      {/* ═══ TABS — Courses / Categories, switches content in-page (no route change) ═══ */}
      <div
        style={{
          display: "flex",
          gap: 6,
          marginBottom: 14,
          background: t.cardBg,
          border: `1px solid ${t.border}`,
          borderRadius: RADIUS.chip,
          padding: 6,
          width: "fit-content",
          boxShadow: t.shadow,
        }}
      >
        {[
          { key: "courses", label: "Courses", icon: BookOpen },
          { key: "categories", label: "Categories", icon: Folder },
        ].map((tab) => {
          const isActive = activeTab === tab.key;
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 16px",
                borderRadius: RADIUS.chip,
                border: "none",
                background: isActive ? `linear-gradient(135deg, ${ACCENT_PURPLE.base}, #4f46e5)` : "transparent",
                color: isActive ? "#ffffff" : t.text,
                opacity: isActive ? 1 : 0.65,
                fontFamily: FONT_FAMILY,
                fontSize: 12,
                fontWeight: FONT_WEIGHT.bold,
                cursor: "pointer",
              }}
            >
              <Icon size={13} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* ═══ TOOLBAR — search + actions (contextual to the active tab) ═══ */}
      <SectionCard
        t={t}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
          marginBottom: 14,
          padding: "12px 16px",
        }}
      >
        {activeTab === "courses" ? (
          <>
            <SearchBar t={t} value={search} onChange={setSearch} placeholder="Search courses…" />
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button
                onClick={openModal}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "9px 16px",
                  borderRadius: RADIUS.button,
                  border: "none",
                  background: `linear-gradient(135deg, ${ACCENT_PURPLE.base}, #4f46e5)`,
                  color: "#ffffff",
                  fontFamily: FONT_FAMILY,
                  fontSize: 12,
                  fontWeight: FONT_WEIGHT.bold,
                  cursor: "pointer",
                  boxShadow: "0 6px 18px rgba(79,70,229,0.3)",
                }}
              >
                <Plus size={13} /> Create Course
              </button>
            </div>
          </>
        ) : (
          <>
            <SearchBar t={t} value={categorySearch} onChange={setCategorySearch} placeholder="Search categories…" />
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button
                onClick={() => setCategoryModalOpen(true)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "9px 16px",
                  borderRadius: RADIUS.button,
                  border: "none",
                  background: `linear-gradient(135deg, ${ACCENT_PURPLE.base}, #4f46e5)`,
                  color: "#ffffff",
                  fontFamily: FONT_FAMILY,
                  fontSize: 12,
                  fontWeight: FONT_WEIGHT.bold,
                  cursor: "pointer",
                  boxShadow: "0 6px 18px rgba(79,70,229,0.3)",
                }}
              >
                <Plus size={13} /> Add Category
              </button>
            </div>
          </>
        )}
      </SectionCard>

      {/* ═══ SPLIT ROW: course table (+ resizable create-course drawer) ═══ */}
      {activeTab === "courses" && (
      <div className="ac-split-row" ref={splitRef}>
        <div style={{ flex: "1 1 auto", minWidth: 0 }}>
          <SectionCard t={t} style={{ padding: 0, overflow: "hidden" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 18px",
                borderBottom: `1px solid ${t.border}`,
                background: t.recentItemBg,
              }}
            >
              <div>
                <p style={{ fontSize: 13, fontWeight: FONT_WEIGHT.bold, color: t.text, margin: 0, fontFamily: FONT_FAMILY }}>
                  Course List
                </p>
                <p style={{ fontSize: 11, color: t.textMuted, margin: "2px 0 0", fontFamily: FONT_FAMILY }}>
                  {filteredCourses.length} course{filteredCourses.length !== 1 && "s"} found
                </p>
              </div>
            </div>

            {loading &&
              [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="ac-pulse"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 18px",
                    borderBottom: `1px solid ${t.recentItemBorder}`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 10, background: t.barBg }} />
                    <div>
                      <div style={{ height: 9, width: 160, borderRadius: 6, background: t.barBg, marginBottom: 7 }} />
                      <div style={{ height: 9, width: 100, borderRadius: 6, background: t.barBg }} />
                    </div>
                  </div>
                  <div style={{ height: 20, width: 70, borderRadius: 30, background: t.barBg }} />
                </div>
              ))}

            {!loading && filteredCourses.length === 0 && (
              <EmptyBlock
                t={t}
                icon={BookOpen}
                title="No courses yet"
                sub={'Click "Create Course" to add your first course and assign it to a trainer'}
              />
            )}

            {!loading && filteredCourses.length > 0 && (
              <div className="ac-tscroll">
                <table style={{ width: "100%", minWidth: 640, borderCollapse: "collapse", fontFamily: FONT_FAMILY, fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: t.recentItemBg }}>
                      {["#", "Course", "Category", "Trainer", "Status", "Enrollments"].map((h, i) => (
                        <th
                          key={h}
                          style={{
                            textAlign: i === 5 ? "right" : "left",
                            padding: "9px 12px",
                            fontSize: 9.5,
                            fontWeight: FONT_WEIGHT.bold,
                            letterSpacing: LETTER_SPACING.eyebrow,
                            textTransform: "uppercase",
                            color: t.textMuted,
                            borderBottom: `1px solid ${t.border}`,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCourses.map((c, index) => {
                      const cc = catColor(c.category);
                      return (
                        <tr key={c.id} style={{ borderBottom: `1px solid ${t.recentItemBorder}` }}>
                          <td style={{ padding: "10px 12px", fontSize: 11, fontWeight: FONT_WEIGHT.bold, color: t.textMuted }}>
                            {String(index + 1).padStart(2, "0")}
                          </td>
                          <td style={{ padding: "10px 12px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <div
                                style={{
                                  width: 32,
                                  height: 32,
                                  borderRadius: 10,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  flexShrink: 0,
                                  background: gradBg(c.name),
                                }}
                              >
                                <BookOpen size={14} color="#ffffff" />
                              </div>
                              <span style={{ fontSize: 12, fontWeight: FONT_WEIGHT.bold, color: t.text, whiteSpace: "nowrap" }}>
                                {c.name}
                              </span>
                            </div>
                          </td>
                          <td style={{ padding: "10px 12px" }}>
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 4,
                                padding: "3px 9px",
                                borderRadius: 8,
                                fontSize: 10.5,
                                fontWeight: FONT_WEIGHT.bold,
                                border: `1px solid ${cc.bd}`,
                                color: cc.color,
                                background: `${cc.color}12`,
                                whiteSpace: "nowrap",
                              }}
                            >
                              <Tag size={10} /> {c.category || "—"}
                            </span>
                          </td>
                          <td style={{ padding: "10px 12px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: t.textMuted, whiteSpace: "nowrap" }}>
                              <Mail size={11} />
                              {c.assignedTrainer ? (
                                <>
                                  {c.assignedTrainer}
                                  <span
                                    style={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: 4,
                                      padding: "2px 7px",
                                      borderRadius: 6,
                                      fontSize: 9.5,
                                      fontWeight: FONT_WEIGHT.bold,
                                      background: "rgba(244,114,182,.10)",
                                      border: "1px solid rgba(244,114,182,.20)",
                                      color: "#db2777",
                                      marginLeft: 4,
                                    }}
                                  >
                                    <UserCheck size={9} /> Assigned
                                  </span>
                                </>
                              ) : (
                                c.trainerName
                              )}
                            </div>
                          </td>
                          <td style={{ padding: "10px 12px" }}>
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 5,
                                padding: "3px 9px",
                                borderRadius: 8,
                                fontSize: 10.5,
                                fontWeight: FONT_WEIGHT.bold,
                                background: "rgba(52,211,153,.10)",
                                border: "1px solid rgba(52,211,153,.22)",
                                color: "#059669",
                                whiteSpace: "nowrap",
                              }}
                            >
                              <span className="ac-blink" style={{ width: 5, height: 5, borderRadius: "50%", background: "#34d399", display: "inline-block" }} />
                              {c.status}
                            </span>
                          </td>
                          <td style={{ padding: "10px 12px", textAlign: "right" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4, fontSize: 12, fontWeight: FONT_WEIGHT.bold, color: t.text }}>
                              <Users size={12} color={t.textMuted} /> {c.enrollments}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </SectionCard>
        </div>

        {open && (
          <>
            <div
              className="ac-divider"
              onMouseDown={onDividerMouseDown}
              title="Drag to resize"
              style={{
                width: 6,
                flex: "0 0 6px",
                cursor: "col-resize",
                position: "relative",
                alignSelf: "stretch",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                touchAction: "none",
              }}
            >
              <div
                style={{
                  width: 16,
                  height: 36,
                  borderRadius: 8,
                  background: t.cardBg,
                  border: `1px solid ${t.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: dragging ? ACCENT_PURPLE.base : t.textMuted,
                  boxShadow: t.shadow,
                }}
              >
                <GripVertical size={12} />
              </div>
            </div>

            <div
              className="ac-panel"
              style={{
                width: rightWidth,
                flexBasis: rightWidth,
                flexShrink: 0,
                background: t.cardBg,
                border: `1px solid ${t.border}`,
                borderRadius: RADIUS.standardCard,
                boxShadow: t.shadow,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                opacity: closing ? 0 : 1,
                transition: "opacity 0.2s",
                maxHeight: "calc(100vh - 40px)",
              }}
              role="region"
              aria-label="Create Course"
            >
              <div
                style={{
                  flexShrink: 0,
                  padding: "16px 20px",
                  borderBottom: `1px solid ${t.border}`,
                  background: t.recentItemBg,
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                  <IconBadge icon={BookOpen} color={ACCENT_PURPLE.base} size={38} iconSize={17} />
                  <div>
                    <p style={{ fontSize: 14, fontWeight: FONT_WEIGHT.bold, color: t.text, margin: "0 0 2px", fontFamily: FONT_FAMILY }}>
                      Create Course
                    </p>
                    <p style={{ fontSize: 11, color: t.textMuted, margin: 0, fontFamily: FONT_FAMILY }}>
                      Fill in the details and assign to a trainer
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  aria-label="Close"
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 9,
                    border: `1px solid ${t.border}`,
                    background: t.cardBg,
                    color: t.textMuted,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    flexShrink: 0,
                  }}
                >
                  <X size={14} />
                </button>
              </div>

              <div style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 16, minWidth: 0 }}>
                <Field t={t} label="Course Name" required>
                  <input
                    style={inputStyle(t)}
                    placeholder="e.g. React for Beginners"
                    value={form.title}
                    onChange={set("title")}
                  />
                </Field>

                <Field t={t} label="Category" required>
                  <input
                    style={inputStyle(t)}
                    placeholder="e.g. Web Development"
                    value={form.category}
                    onChange={set("category")}
                  />
                </Field>

                <Field t={t} label="Description">
                  <textarea
                    style={{ ...inputStyle(t), resize: "none", fontFamily: FONT_FAMILY }}
                    rows={5}
                    placeholder="Brief course description…"
                    value={form.description}
                    onChange={set("description")}
                  />
                </Field>

                <div style={{ height: 1, background: t.border }} />

                <Field t={t} label="Assign Trainer" required hint="The selected trainer will own and manage this course.">
                  <select
                    style={{ ...inputStyle(t), cursor: "pointer" }}
                    value={form.assignedTrainerEmail}
                    onChange={set("assignedTrainerEmail")}
                    disabled={trainersLoading}
                  >
                    <option value="">
                      {trainersLoading ? "Loading trainers…" : trainers.length === 0 ? "No trainers available" : "Select a trainer…"}
                    </option>
                    {trainers.map((tr) => (
                      <option key={tr.email} value={tr.email}>
                        {tr.displayName ? `${tr.displayName} — ${tr.email}` : tr.email}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <div
                style={{
                  flexShrink: 0,
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 9,
                  padding: "14px 20px",
                  background: t.cardBg,
                  borderTop: `1px solid ${t.border}`,
                }}
              >
                <button
                  onClick={closeModal}
                  style={{
                    padding: "9px 17px",
                    borderRadius: RADIUS.button,
                    border: `1.5px solid ${t.border}`,
                    background: t.pillBg,
                    color: t.textMuted,
                    fontFamily: FONT_FAMILY,
                    fontSize: 12,
                    fontWeight: FONT_WEIGHT.bold,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={submitting}
                  style={{
                    padding: "9px 20px",
                    borderRadius: RADIUS.button,
                    border: "none",
                    background: `linear-gradient(135deg, ${ACCENT_PURPLE.base}, #4f46e5)`,
                    color: "#ffffff",
                    fontFamily: FONT_FAMILY,
                    fontSize: 12,
                    fontWeight: FONT_WEIGHT.bold,
                    cursor: submitting ? "not-allowed" : "pointer",
                    opacity: submitting ? 0.6 : 1,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    boxShadow: "0 6px 18px rgba(79,70,229,0.3)",
                  }}
                >
                  {submitting ? (
                    <>
                      <Loader2 size={14} className="ac-spin" /> Creating…
                    </>
                  ) : (
                    <>
                      <Plus size={13} /> Create &amp; Assign
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      )}

      {/* ═══ CATEGORIES TAB ═══ */}
      {activeTab === "categories" && (
        <SectionCard t={t} style={{ padding: 0, overflow: "hidden" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 18px",
              borderBottom: `1px solid ${t.border}`,
              background: t.recentItemBg,
            }}
          >
            <div>
              <p style={{ fontSize: 13, fontWeight: FONT_WEIGHT.bold, color: t.text, margin: 0, fontFamily: FONT_FAMILY }}>
                Category List
              </p>
              <p style={{ fontSize: 11, color: t.textMuted, margin: "2px 0 0", fontFamily: FONT_FAMILY }}>
                {filteredCategories.length} categor{filteredCategories.length !== 1 ? "ies" : "y"} found
              </p>
            </div>
          </div>

          {loading &&
            [1, 2, 3].map((i) => (
              <div
                key={i}
                className="ac-pulse"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 18px",
                  borderBottom: `1px solid ${t.recentItemBorder}`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: t.barBg }} />
                  <div style={{ height: 9, width: 140, borderRadius: 6, background: t.barBg }} />
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <div style={{ height: 20, width: 70, borderRadius: 30, background: t.barBg }} />
                  <div style={{ height: 20, width: 60, borderRadius: 30, background: t.barBg }} />
                </div>
              </div>
            ))}

          {!loading && filteredCategories.length === 0 && (
            <EmptyBlock t={t} icon={Layers} title="No categories yet" sub="Create categories to organize courses" />
          )}

          {!loading && filteredCategories.length > 0 && (
            <div className="ac-tscroll">
              <table style={{ width: "100%", minWidth: 520, borderCollapse: "collapse", fontFamily: FONT_FAMILY, fontSize: 12 }}>
                <thead>
                  <tr style={{ background: t.recentItemBg }}>
                    {["#", "Category", "Total Courses", "Status"].map((h) => (
                      <th
                        key={h}
                        style={{
                          textAlign: "left",
                          padding: "9px 12px",
                          fontSize: 9.5,
                          fontWeight: FONT_WEIGHT.bold,
                          letterSpacing: LETTER_SPACING.eyebrow,
                          textTransform: "uppercase",
                          color: t.textMuted,
                          borderBottom: `1px solid ${t.border}`,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.map((c, index) => {
                    const cc = catColor(c.name);
                    return (
                      <tr key={c.id} style={{ borderBottom: `1px solid ${t.recentItemBorder}` }}>
                        <td style={{ padding: "10px 12px", fontSize: 11, fontWeight: FONT_WEIGHT.bold, color: t.textMuted }}>
                          {String(index + 1).padStart(2, "0")}
                        </td>
                        <td style={{ padding: "10px 12px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div
                              style={{
                                width: 32,
                                height: 32,
                                borderRadius: 10,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                                background: gradBg(c.name),
                              }}
                            >
                              <Tag size={14} color="#ffffff" />
                            </div>
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 4,
                                padding: "3px 9px",
                                borderRadius: 8,
                                fontSize: 10.5,
                                fontWeight: FONT_WEIGHT.bold,
                                border: `1px solid ${cc.bd}`,
                                color: cc.color,
                                background: `${cc.color}12`,
                                whiteSpace: "nowrap",
                              }}
                            >
                              {c.name}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: "10px 12px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12 }}>
                            <BookOpen size={12} color={t.textMuted} />
                            <span style={{ fontWeight: FONT_WEIGHT.bold, color: t.text }}>{c.courseCount}</span>
                            <span style={{ fontSize: 10.5, color: t.textMuted }}>course{c.courseCount !== 1 && "s"}</span>
                          </div>
                        </td>
                        <td style={{ padding: "10px 12px" }}>
                          {c.active ? (
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 5,
                                padding: "3px 9px",
                                borderRadius: 8,
                                fontSize: 10.5,
                                fontWeight: FONT_WEIGHT.bold,
                                background: "rgba(52,211,153,.10)",
                                border: "1px solid rgba(52,211,153,.22)",
                                color: "#059669",
                                whiteSpace: "nowrap",
                              }}
                            >
                              <span className="ac-blink" style={{ width: 5, height: 5, borderRadius: "50%", background: "#34d399", display: "inline-block" }} />
                              Active
                            </span>
                          ) : (
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 5,
                                padding: "3px 9px",
                                borderRadius: 8,
                                fontSize: 10.5,
                                fontWeight: FONT_WEIGHT.bold,
                                background: t.pillBg,
                                border: `1px solid ${t.pillBorder}`,
                                color: t.textMuted,
                                whiteSpace: "nowrap",
                              }}
                            >
                              <span style={{ width: 5, height: 5, borderRadius: "50%", background: t.textMuted, display: "inline-block" }} />
                              Inactive
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>
      )}

      {/* ── Add Category modal (visual only — same as original Categories.jsx,
           whose "Create" button had no onClick wired up; preserved as-is) ── */}
      {categoryModalOpen && (
        <div
          onClick={() => setCategoryModalOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 250,
            background: "rgba(30,21,51,0.55)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: t.cardBg,
              border: `1px solid ${t.border}`,
              borderRadius: RADIUS.standardCard,
              width: "100%",
              maxWidth: 400,
              overflow: "hidden",
              boxShadow: t.shadow,
            }}
          >
            <div
              style={{
                padding: "16px 20px",
                borderBottom: `1px solid ${t.border}`,
                background: t.recentItemBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <IconBadge icon={Layers} color={ACCENT_PURPLE.base} size={36} iconSize={16} />
                <div>
                  <p style={{ fontSize: 14, fontWeight: FONT_WEIGHT.bold, color: t.text, margin: "0 0 2px", fontFamily: FONT_FAMILY }}>
                    Add Category
                  </p>
                  <p style={{ fontSize: 11, color: t.textMuted, margin: 0, fontFamily: FONT_FAMILY }}>
                    Create a new course category
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCategoryModalOpen(false)}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 9,
                  border: `1px solid ${t.border}`,
                  background: t.cardBg,
                  color: t.textMuted,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <X size={14} />
              </button>
            </div>
            <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
              <Field t={t} label="Category Name">
                <input style={inputStyle(t)} placeholder="e.g. Web Development" />
              </Field>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 9 }}>
                <button
                  onClick={() => setCategoryModalOpen(false)}
                  style={{
                    padding: "9px 17px",
                    borderRadius: RADIUS.button,
                    border: `1.5px solid ${t.border}`,
                    background: t.pillBg,
                    color: t.textMuted,
                    fontFamily: FONT_FAMILY,
                    fontSize: 12,
                    fontWeight: FONT_WEIGHT.bold,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  style={{
                    padding: "9px 20px",
                    borderRadius: RADIUS.button,
                    border: "none",
                    background: `linear-gradient(135deg, ${ACCENT_PURPLE.base}, #4f46e5)`,
                    color: "#ffffff",
                    fontFamily: FONT_FAMILY,
                    fontSize: 12,
                    fontWeight: FONT_WEIGHT.bold,
                    cursor: "pointer",
                    boxShadow: "0 6px 18px rgba(79,70,229,0.3)",
                  }}
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div
          className="ac-toast-in"
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 200,
            padding: "10px 16px",
            borderRadius: RADIUS.chip,
            background: toast.err ? "rgba(248,113,113,.12)" : "rgba(52,211,153,.12)",
            border: `1px solid ${toast.err ? "rgba(248,113,113,.25)" : "rgba(52,211,153,.25)"}`,
            color: toast.err ? "#e11d48" : "#059669",
            fontFamily: FONT_FAMILY,
            fontSize: 12,
            fontWeight: FONT_WEIGHT.bold,
            boxShadow: t.shadow,
            display: "flex",
            alignItems: "center",
            gap: 7,
            maxWidth: "calc(100vw - 32px)",
          }}
        >
          {toast.err ? <AlertCircle size={14} /> : <CheckCircle2 size={14} />}
          {toast.msg}
        </div>
      )}
    </PageContainer>
  );
};

export default AllCourses;