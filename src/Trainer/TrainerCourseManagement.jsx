import axios from "axios";
import {
  BookOpen,
  CheckCircle,
  Clock,
  Download,
  Edit2,
  Eye,
  GraduationCap,
  Plus,
  Search,
  Star,
  Trash2,
  Users,
  X,
  ChevronRight,
  Layers,
} from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getTrainerBatches } from "@/services/batchService";
import UpgradeModal from "../components/plan/UpgradeModal";
import { parsePlanError } from "../services/planErrorHandler";
import UsageBadge from "../components/plan/UsageBadge"; // adjust path to match your actual location
// ─── Global Design System — single source of truth for colors, type,
// spacing, radius, StatCard, PageContainer and Hero. This page now visually
// matches the Attendance page (Golden Reference) — same Hero anatomy,
// same typography tokens (FONT_SIZE / LINE_HEIGHT / LETTER_SPACING), same
// stat-card grid, same card surfaces — instead of redeclaring page-local
// type scales or a bespoke CSS-variable theme.
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

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";
const FF = FONT_FAMILY;

const isDarkMode = () =>
  document.documentElement.classList.contains("dark") ||
  document.documentElement.getAttribute("data-theme") === "dark" ||
  document.body.classList.contains("dark");

const CAT_COLORS = {
  Product: { bg: "rgba(167,139,250,.12)", color: "#a78bfa" },
  Design: { bg: "rgba(251,146,60,.12)", color: "#fb923c" },
  "Growth & Marketing": { bg: "rgba(34,211,238,.12)", color: "#22d3ee" },
  Development: { bg: "rgba(52,211,153,.12)", color: "#34d399" },
  Business: { bg: "rgba(248,113,113,.12)", color: "#f87171" },
  _d: { bg: "rgba(100,116,139,.12)", color: "#64748b" },
};
const catStyle = (c) => CAT_COLORS[c] || CAT_COLORS._d;

/* ─── page-local layout chrome only (resizable 3-panel workspace has no
   design-system equivalent yet). Card surfaces, type, and color all pull
   from the shared tokens below — same rule the Golden Reference follows
   for its page-local MiniCalendar / RecentPanel helpers.
   Responsive breakpoints cover: desktop / laptop, iPad Pro (1024px),
   Surface Pro / standard tablets (900px), iPad & iPad Mini (768px),
   large phones (480px), and small phones (380px). ─── */
const LOCAL_STYLES = `
.tcm-panels{display:flex;flex:1;overflow:hidden;}
.tcm-p1{flex-shrink:0;display:flex;flex-direction:column;overflow:hidden;transition:width .3s;}
.tcm-p1-list{flex:1;overflow-y:auto;padding:8px;}
.tcm-resize{width:12px;flex-shrink:0;display:flex;align-items:center;justify-content:center;cursor:col-resize;transition:background .2s;}
.tcm-resize-pill{width:3px;height:40px;border-radius:4px;transition:background .2s;}
.tcm-p2{flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0;}
.tcm-p2-grid{flex:1;overflow-y:auto;padding:16px;}
.tcm-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px;}
.tcm-p3{flex-shrink:0;display:flex;flex-direction:column;overflow:hidden;}
.tcm-p3-body{flex:1;overflow-y:auto;padding:18px;display:flex;flex-direction:column;gap:14px;}
.tcm-cc{transition:all .2s;}
.tcm-cc:hover{transform:translateY(-2px);}
.tcm-cat-btn{transition:all .15s;}
.tcm-ab{transition:all .15s;}
.tcm-del{transition:all .15s;}
.tcm-sub,.tcm-btn{transition:opacity .2s,transform .15s;}
.tcm-sub:hover,.tcm-btn:hover{opacity:.88;transform:translateY(-1px);}
.tcm-spin{width:20px;height:20px;border-radius:50%;animation:tcm-spin .8s linear infinite;}
.tcm-batch-row{display:flex;gap:8px;margin-bottom:16px;overflow-x:auto;flex-wrap:wrap;}
@keyframes tcm-spin{to{transform:rotate(360deg)}}

/* ── iPad Pro / small laptops ── */
@media (max-width: 1024px){
  .tcm-grid{grid-template-columns:repeat(auto-fill,minmax(210px,1fr));}
}

/* ── Surface / standard tablets — stack the 3-panel workspace ── */
@media (max-width: 900px){
  .tcm-panels{flex-direction:column;height:auto !important;min-height:0 !important;}
  .tcm-p1{width:100% !important;border-right:none !important;border-bottom:1px solid var(--tcm-border,transparent);}
  .tcm-p1-list{display:flex;flex-wrap:wrap;gap:6px;padding:10px;}
  .tcm-p1-list .tcm-cat-btn{width:auto;flex:0 0 auto;}
  .tcm-resize{display:none;}
  .tcm-p2-grid{max-height:70vh;}
  .tcm-p3{width:100% !important;max-height:80vh;}
}

/* ── iPad / iPad Mini ── */
@media (max-width: 768px){
  .tcm-grid{grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:10px;}
  .tcm-batch-row{gap:6px;}
}

/* ── Large phones (iPhone Pro Max, Pixel, Galaxy) ── */
@media (max-width: 600px){
  .tcm-grid{grid-template-columns:1fr;}
  .tcm-p2-grid{padding:10px;}
  .tcm-p3-body{padding:14px;}
}

/* ── Small phones (iPhone SE / compact Android) ── */
@media (max-width: 380px){
  .tcm-batch-row button{padding:7px 12px !important;font-size:11px !important;}
  .tcm-cc{padding:14px !important;}
}
`;
if (typeof document !== "undefined" && !document.getElementById("tcm-st")) {
  const s = document.createElement("style");
  s.id = "tcm-st";
  s.textContent = LOCAL_STYLES;
  document.head.appendChild(s);
}

const getAuthTokenUserId = () => {
  try {
    const token = localStorage.getItem("lms_token");
    if (!token) return null;
    return JSON.parse(atob(token.split(".")[1]))?.userId ?? null;
  } catch {
    return null;
  }
};

const TrainerCourseManagement = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("All");
  const [editingCourse, setEditingCourse] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    category: "",
    description: "",
  });
  const [createForm, setCreateForm] = useState({
    title: "",
    category: "",
    description: "",
    batchId: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [upgradeConfig, setUpgradeConfig] = useState(null);
  const [courseUsage, setCourseUsage] = useState(null);
  const [previewCourseId, setPreviewCourseId] = useState(null);
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);
  const [rightMode, setRightMode] = useState("create");
  const [rightWidth, setRightWidth] = useState(340);
  const [isDark, setIsDark] = useState(isDarkMode);
  const isDragging = useRef(false);
  const containerRef = useRef(null);

  const t = isDark ? T.dark : T.light;

  useEffect(() => {
    const o = new MutationObserver(() => setIsDark(isDarkMode()));
    o.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });
    o.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => o.disconnect();
  }, []);

  const onMouseDown = useCallback(() => {
    isDragging.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);
  const onMouseMove = useCallback((e) => {
    if (!isDragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const fr = rect.right - e.clientX;
    if (fr > 260 && fr < 560) setRightWidth(fr);
  }, []);
  const onMouseUp = useCallback(() => {
    isDragging.current = false;
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }, []);
  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  const authHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
  });

  useEffect(() => {
    fetchCourses();
    fetchCourseUsage(); // ADDED
    (async () => {
      try {
        const r = await getTrainerBatches();
        setBatches(r || []);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const fetchCourses = async () => {
    try {
      const r = await axios.get(`${API}/courses/trainer/all`, {
        headers: authHeader(),
      });
      setCourses(r.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseUsage = async () => {
    try {
      const r = await axios.get(`${API}/courses/usage/create`, {
        headers: authHeader(),
      });
      setCourseUsage(r.data);
    } catch (e) {
      console.error("Failed to fetch course usage", e);
    }
  };

  const showNotif = (msg) => {
    setSuccessMessage(msg);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const createCourse = async (e) => {
    e.preventDefault();
    if (!createForm.title || !createForm.category || !createForm.batchId) {
      alert("Please fill in all required fields");
      return;
    }
    try {
      await axios.post(`${API}/courses`, createForm, { headers: authHeader() });
      setCreateForm({ title: "", category: "", description: "", batchId: "" });
      setRightOpen(false);
      fetchCourses();
      fetchCourseUsage(); // ADDED — usage pill updates right after create
      showNotif("Course created successfully!");
    } catch (err) {
      const planError = parsePlanError(err);
      if (planError) {
        setUpgradeConfig({ featureLabel: planError.message });
      } else {
        alert("Failed to create course");
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course?")) return;
    try {
      await axios.delete(`${API}/courses/${id}`, { headers: authHeader() });
      setCourses((p) => p.filter((c) => c.id !== id));
      if (editingCourse?.id === id) {
        setEditingCourse(null);
        setRightOpen(false);
      }
      if (previewCourseId === id) setPreviewCourseId(null);
      showNotif("Course deleted.");
    } catch {
      alert("Delete failed");
    }
  };

  const openEdit = (course) => {
    setEditingCourse(course);
    setEditForm({
      title: course.title,
      category: course.category,
      description: course.description || "",
    });
    setRightMode("edit");
    setRightOpen(true);
    setPreviewCourseId(null);
  };

  const saveEdit = async () => {
    try {
      await axios.put(`${API}/courses/${editingCourse.id}`, editForm, {
        headers: authHeader(),
      });
      setEditingCourse(null);
      setRightOpen(false);
      fetchCourses();
      showNotif("Course updated!");
    } catch {
      alert("Update failed");
    }
  };

  const categories = [
    "All",
    "Product",
    "Design",
    "Growth & Marketing",
    "Development",
    "Business",
  ];
  const filteredCourses = courses.filter((c) => {
    const ms =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.ownerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const mc = selectedCategory === "All" || c.category === selectedCategory;
    const mb = selectedBatch === "All" || c.batchId === selectedBatch;
    return ms && mc && mb;
  });

  const totalCourses = courses.length;
  const totalStudents = courses.reduce((a, c) => a + (c.enrolledCount || 0), 0);

  // ── Avg Rating source number (unchanged business logic). numericValue
  // fed to <StatCard> is always a plain Number — passing the old
  // pre-formatted "4.8" / "—" string caused StatCard to render NaN on
  // other pages (Performance Analysis, Attendance), so the same fix
  // applies here: raw number, empty-state text moved into `change`.
  const avgRatingNum = courses.length
    ? courses.reduce((a, c) => a + (c.rating || 4.8), 0) / courses.length
    : 0;

  // ── stat cards through the shared <StatCard>, identical pattern to
  // the Attendance page (Golden Reference). ──
  const stats = [
    {
      label: "Total Courses",
      numericValue: totalCourses,
      change: `${totalCourses} created`,
      icon: BookOpen,
      colorKey: "blue",
    },
    {
      label: "Enrollments",
      numericValue: totalStudents,
      change: `${totalStudents} students`,
      icon: Users,
      colorKey: "green",
    },
    {
      label: "Avg Rating",
      numericValue: Number(avgRatingNum.toFixed(1)),
      change: courses.length ? "across all courses" : "No courses yet",
      icon: Star,
      colorKey: "orange",
    },
  ];

  const rightModeColor =
    rightMode === "create"
      ? "#34d399"
      : rightMode === "edit"
        ? "#22d3ee"
        : "#a78bfa";
  const rightModeBg =
    rightMode === "create"
      ? "rgba(52,211,153,.15)"
      : rightMode === "edit"
        ? "rgba(34,211,238,.15)"
        : "rgba(167,139,250,.15)";

  const inputStyle = {
    width: "100%",
    padding: "8px 10px",
    borderRadius: RADIUS.chip,
    border: `1px solid ${t.border}`,
    background: t.pageBg,
    color: t.text,
    fontFamily: FF,
    fontSize: 12.5,
    outline: "none",
    boxSizing: "border-box",
  };
  const labelStyle = {
    display: "block",
    fontSize: 9.5,
    fontWeight: FONT_WEIGHT.bold,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: t.textMuted,
    marginBottom: 4,
    fontFamily: FF,
  };
  const fieldStyle = { marginBottom: 10 };

  return (
    <PageContainer
      mode={isDark ? "dark" : "light"}
      pageBg={t.pageBg}
      textColor={t.text}
    >
      {/* ═══ HERO — shared <Hero> component; same anatomy (eyebrow dot +
          label, title, subtitle, right-side badge cluster) and the same
          typography tokens (FONT_SIZE / LINE_HEIGHT / LETTER_SPACING)
          used on the Attendance page, so the two pages read as one
          product instead of two different type scales. ═══ */}
      <Hero borderHero={t.borderHero}>
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 8,
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: ACCENT_PURPLE.base,
              }}
            />
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
              Learning Management
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
            Course Management
          </h1>
          <p
            style={{
              fontSize: FONT_SIZE.bodySmall,
              color: t.textSub,
              margin: 0,
              fontWeight: FONT_WEIGHT.medium,
              fontFamily: FONT_FAMILY,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <BookOpen size={12} /> Create, organize, and publish your courses
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
            <span>
              {totalCourses} course{totalCourses !== 1 ? "s" : ""}
            </span>
            <span style={{ width: 1, height: 14, background: t.actBorder }} />
            <span>
              {batches.length} batch{batches.length !== 1 ? "es" : ""}
            </span>
          </div>

          {courseUsage && (
            <UsageBadge
              used={courseUsage.used}
              limit={courseUsage.limit}
              unlimited={courseUsage.limit === -1 || courseUsage.limit == null}
              period={courseUsage.period}
              label={`Plan: ${courseUsage.tier?.toUpperCase() || ""}`}
              c={{
                cardBorder: t.actBorder,
                cardBg: t.actBg,
                textSub: t.textSub,
                textPrimary: t.text,
                divider: t.actBorder,
                accent: "#34d399",
                errorColor: "#f87171",
              }}
            />
          )}

          {showSuccess && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(52,211,153,.08)",
                border: "1px solid rgba(52,211,153,.25)",
                borderRadius: RADIUS.pill,
                padding: "8px 16px",
                fontSize: 11,
                fontWeight: FONT_WEIGHT.bold,
                fontFamily: FONT_FAMILY,
                color: "#34d399",
              }}
            >
              <CheckCircle size={13} /> {successMessage}
            </div>
          )}

          <button
            className="tcm-btn"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "9px 16px",
              borderRadius: RADIUS.button,
              border: `1px solid ${t.border}`,
              background: t.cardBg,
              color: t.textSub,
              fontSize: 12,
              fontWeight: FONT_WEIGHT.bold,
              cursor: "pointer",
              fontFamily: FONT_FAMILY,
            }}
          >
            <Download size={13} /> Export
          </button>
          <button
            className="tcm-btn"
            onClick={() => {
              setRightMode("create");
              setRightOpen(true);
              setEditingCourse(null);
              setPreviewCourseId(null);
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              background: "rgba(124,58,237,0.08)",
              border: "1px solid rgba(124,58,237,0.3)",
              borderRadius: RADIUS.pill,
              padding: "9px 18px",
              color: ACCENT_PURPLE.base,
              fontSize: 11,
              fontWeight: FONT_WEIGHT.bold,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              fontFamily: FONT_FAMILY,
              cursor: "pointer",
            }}
          >
            <Plus size={14} /> New Course
          </button>
        </div>
      </Hero>

      {/* ═══ STAT CARDS — shared <StatCard>, same .stat-grid class the
          Attendance page uses, so column counts and breakpoints inherit
          identically across both pages. ═══ */}
      <div className="stat-grid" style={{ marginBottom: 20 }}>
        {stats.map((s, i) => (
          <StatCard key={i} stat={s} index={i} loading={loading} />
        ))}
      </div>

      {/* ═══ BATCH FILTER — pill row, same shape/weight as the Attendance
          page's toolbar pills; active state reuses the shared blue
          gradient already used for primary actions on both pages. ═══ */}
      <div className="tcm-batch-row">
        <button
          className="tcm-btn"
          style={{
            padding: "8px 16px",
            borderRadius: RADIUS.pill,
            fontFamily: FF,
            fontSize: 12,
            fontWeight: FONT_WEIGHT.bold,
            cursor: "pointer",
            background:
              selectedBatch === "All"
                ? "linear-gradient(135deg,#1e3a8a,#2563eb)"
                : t.pillBg,
            color: selectedBatch === "All" ? "#fff" : t.textMuted,
            border:
              selectedBatch === "All" ? "none" : `1px solid ${t.pillBorder}`,
          }}
          onClick={() => setSelectedBatch("All")}
        >
          All Batches
        </button>
        {batches.map((b) => (
          <button
            key={b.id}
            className="tcm-btn"
            style={{
              padding: "8px 16px",
              borderRadius: RADIUS.pill,
              fontFamily: FF,
              fontSize: 12,
              fontWeight: FONT_WEIGHT.bold,
              cursor: "pointer",
              background:
                selectedBatch === b.id
                  ? "linear-gradient(135deg,#1e3a8a,#2563eb)"
                  : t.pillBg,
              color: selectedBatch === b.id ? "#fff" : t.textMuted,
              border:
                selectedBatch === b.id ? "none" : `1px solid ${t.pillBorder}`,
            }}
            onClick={() => setSelectedBatch(b.id)}
          >
            Batch {b.id}
            {b.name ? ` — ${b.name}` : ""}
          </button>
        ))}
      </div>

      {/* ═══ 3-PANEL WORKSPACE — same card surface, radius, and shadow
          tokens (t.cardBg / t.border / RADIUS.standardCard / t.shadow)
          as every SectionCard on the Attendance page. Panel chrome is
          page-local since no resizable-panel component exists in the
          design system yet, but it borrows the surface tokens. ═══ */}
      <div
        ref={containerRef}
        className="tcm-panels"
        style={{
          background: t.cardBg,
          border: `1px solid ${t.border}`,
          borderRadius: RADIUS.standardCard,
          boxShadow: t.shadow,
          height: "calc(100vh - 340px)",
          minHeight: 420,
          marginBottom: 20,
        }}
      >
        {/* Panel 1 - categories */}
        <div
          className="tcm-p1"
          style={{
            width: leftCollapsed ? 0 : 200,
            borderRight: `1px solid ${t.border}`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "14px 16px",
              borderBottom: `1px solid ${t.border}`,
              background: t.pageBg,
            }}
          >
            <Layers size={13} style={{ color: "#22d3ee", flexShrink: 0 }} />
            <span
              style={{
                fontSize: 11,
                fontWeight: FONT_WEIGHT.bold,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: t.textMuted,
                fontFamily: FF,
              }}
            >
              Categories
            </span>
          </div>
          <div className="tcm-p1-list">
            {categories.map((cat) => (
              <button
                key={cat}
                className="tcm-cat-btn"
                onClick={() => setSelectedCategory(cat)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "9px 12px",
                  borderRadius: RADIUS.chip,
                  border: "none",
                  background:
                    selectedCategory === cat
                      ? "linear-gradient(135deg,#1e3a8a,#2563eb)"
                      : "transparent",
                  fontFamily: FF,
                  fontSize: 12,
                  fontWeight: FONT_WEIGHT.bold,
                  color: selectedCategory === cat ? "#fff" : t.textMuted,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 2,
                }}
              >
                <span>{cat}</span>
                {selectedCategory === cat && (
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "rgba(255,255,255,.7)",
                    }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Resize 1 */}
        <div
          className="tcm-resize"
          style={{
            cursor: "pointer",
            background: t.pageBg,
            borderLeft: `1px solid ${t.border}`,
            borderRight: `1px solid ${t.border}`,
          }}
          onClick={() => setLeftCollapsed((p) => !p)}
        >
          <div className="tcm-resize-pill" style={{ background: t.border }} />
        </div>

        {/* Panel 2 - course list */}
        <div className="tcm-p2">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 16px",
              borderBottom: `1px solid ${t.border}`,
              background: t.pageBg,
            }}
          >
            <div style={{ position: "relative", flex: 1 }}>
              <Search
                size={13}
                style={{
                  position: "absolute",
                  left: 11,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: t.textMuted,
                  pointerEvents: "none",
                }}
              />
              <input
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "9px 12px 9px 34px",
                  borderRadius: RADIUS.chip,
                  border: `1px solid ${t.border}`,
                  background: t.cardBg,
                  color: t.text,
                  fontFamily: FF,
                  fontSize: 12,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <span
              style={{
                fontSize: 11,
                fontWeight: FONT_WEIGHT.bold,
                color: t.textMuted,
                whiteSpace: "nowrap",
                fontFamily: FF,
              }}
            >
              {filteredCourses.length} found
            </span>
          </div>

          <div className="tcm-p2-grid">
            {loading ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 60,
                }}
              >
                <div
                  className="tcm-spin"
                  style={{
                    border: `2px solid ${t.border}`,
                    borderTopColor: "#22d3ee",
                  }}
                />
              </div>
            ) : filteredCourses.length === 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "60px 20px",
                  gap: 10,
                  textAlign: "center",
                  color: t.textMuted,
                  fontSize: 13,
                  fontFamily: FF,
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 15,
                    background: t.pageBg,
                    border: `1px solid ${t.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <BookOpen size={24} color={t.textMuted} />
                </div>
                <span>
                  {searchQuery || selectedCategory !== "All"
                    ? "No courses match your filters"
                    : "No courses yet — create your first!"}
                </span>
              </div>
            ) : (
              <div className="tcm-grid">
                {filteredCourses.map((course) => {
                  const cs = catStyle(course.category);
                  const isActive =
                    editingCourse?.id === course.id ||
                    previewCourseId === course.id;
                  return (
                    <div
                      key={course.id}
                      className="tcm-cc"
                      style={{
                        borderRadius: RADIUS.standardCard,
                        border: isActive
                          ? "1px solid rgba(34,211,238,.4)"
                          : `1px solid ${t.border}`,
                        background: isActive
                          ? "rgba(34,211,238,.04)"
                          : t.pageBg,
                        padding: 18,
                        boxShadow: isActive ? t.shadow : "none",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: 10,
                        }}
                      >
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            padding: "3px 8px",
                            borderRadius: RADIUS.chip,
                            fontSize: 10,
                            fontWeight: FONT_WEIGHT.bold,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            background: "rgba(52,211,153,.10)",
                            color: "#34d399",
                            border: "1px solid rgba(52,211,153,.15)",
                            fontFamily: FF,
                          }}
                        >
                          <CheckCircle size={10} /> Published
                        </span>
                        <span
                          style={{
                            display: "inline-flex",
                            padding: "3px 8px",
                            borderRadius: RADIUS.chip,
                            fontSize: 10,
                            fontWeight: FONT_WEIGHT.bold,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            background: cs.bg,
                            color: cs.color,
                            fontFamily: FF,
                          }}
                        >
                          {course.category}
                        </span>
                      </div>

                      <div style={{ marginBottom: 8 }}>
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: FONT_WEIGHT.bold,
                            padding: "3px 8px",
                            borderRadius: RADIUS.chip,
                            background: "rgba(34,211,238,.10)",
                            color: "#22d3ee",
                            border: "1px solid rgba(34,211,238,.15)",
                            fontFamily: FF,
                          }}
                        >
                          Batch {course.batchId}
                        </span>
                      </div>

                      <p
                        style={{
                          fontSize: 13,
                          fontWeight: FONT_WEIGHT.bold,
                          color: t.text,
                          lineHeight: 1.35,
                          margin: "0 0 4px",
                          fontFamily: FF,
                        }}
                      >
                        {course.title}
                      </p>
                      <p
                        style={{
                          fontSize: 11,
                          color: t.textMuted,
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          margin: "0 0 12px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          fontFamily: FF,
                        }}
                      >
                        <GraduationCap size={11} /> {course.ownerEmail}
                      </p>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          fontSize: 11,
                          color: t.textMuted,
                          padding: "10px 0",
                          borderTop: `1px solid ${t.border}`,
                          borderBottom: `1px solid ${t.border}`,
                          marginBottom: 10,
                          fontFamily: FF,
                        }}
                      >
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <Clock size={11} /> 8w
                        </span>
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <Users size={11} /> {course.enrolledCount || 0}
                        </span>
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <Star
                            size={11}
                            style={{ color: "#fb923c", fill: "#fb923c" }}
                          />{" "}
                          {course.rating || 4.8}
                        </span>
                      </div>

                      {course.description && (
                        <p
                          style={{
                            fontSize: 11,
                            color: t.textMuted,
                            lineHeight: 1.5,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            marginBottom: 10,
                            fontFamily: FF,
                          }}
                        >
                          {course.description}
                        </p>
                      )}

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(3,1fr)",
                          gap: 6,
                          marginBottom: 6,
                        }}
                      >
                        <button
                          className="tcm-ab"
                          onClick={() => openEdit(course)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 4,
                            padding: 7,
                            borderRadius: RADIUS.chip,
                            border: `1px solid ${t.border}`,
                            background: t.cardBg,
                            color: t.textMuted,
                            fontFamily: FF,
                            fontSize: 10,
                            fontWeight: FONT_WEIGHT.bold,
                            cursor: "pointer",
                          }}
                        >
                          <Edit2 size={11} /> Edit
                        </button>
                        <button
                          className="tcm-ab"
                          onClick={() =>
                            navigate(`/trainer/course/${course.id}/modules`)
                          }
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 4,
                            padding: 7,
                            borderRadius: RADIUS.chip,
                            border: `1px solid ${t.border}`,
                            background: t.cardBg,
                            color: t.textMuted,
                            fontFamily: FF,
                            fontSize: 10,
                            fontWeight: FONT_WEIGHT.bold,
                            cursor: "pointer",
                          }}
                        >
                          <BookOpen size={11} /> Modules
                        </button>
                        <button
                          className="tcm-ab"
                          onClick={() => {
                            setPreviewCourseId(course.id);
                            setRightMode("preview");
                            setRightOpen(true);
                            setEditingCourse(null);
                          }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 4,
                            padding: 7,
                            borderRadius: RADIUS.chip,
                            border: `1px solid ${t.border}`,
                            background: t.cardBg,
                            color: t.textMuted,
                            fontFamily: FF,
                            fontSize: 10,
                            fontWeight: FONT_WEIGHT.bold,
                            cursor: "pointer",
                          }}
                        >
                          <Eye size={11} /> Preview
                        </button>
                      </div>
                      <button
                        className="tcm-del"
                        onClick={() => handleDelete(course.id)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 4,
                          width: "100%",
                          padding: 7,
                          borderRadius: RADIUS.chip,
                          border: `1px solid ${t.border}`,
                          background: t.cardBg,
                          color: t.textMuted,
                          fontFamily: FF,
                          fontSize: 10,
                          fontWeight: FONT_WEIGHT.bold,
                          cursor: "pointer",
                        }}
                      >
                        <Trash2 size={11} /> Delete Course
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Resize 2 */}
        {rightOpen ? (
          <div
            className="tcm-resize"
            style={{
              background: t.pageBg,
              borderLeft: `1px solid ${t.border}`,
            }}
            onMouseDown={onMouseDown}
          >
            <div className="tcm-resize-pill" style={{ background: t.border }} />
          </div>
        ) : (
          <div
            className="tcm-resize"
            style={{
              cursor: "pointer",
              background: t.pageBg,
              borderLeft: `1px solid ${t.border}`,
            }}
            onClick={() => {
              setRightMode("create");
              setRightOpen(true);
              setEditingCourse(null);
              setPreviewCourseId(null);
            }}
          >
            <div className="tcm-resize-pill" style={{ background: t.border }} />
          </div>
        )}

        {/* Panel 3 */}
        {rightOpen && (
          <div
            className="tcm-p3"
            style={{ width: rightWidth, borderLeft: `1px solid ${t.border}` }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "13px 18px",
                borderBottom: `1px solid ${t.border}`,
                background: t.pageBg,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: RADIUS.chip,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: rightModeBg,
                    color: rightModeColor,
                    flexShrink: 0,
                  }}
                >
                  {rightMode === "create" ? (
                    <Plus size={14} />
                  ) : rightMode === "edit" ? (
                    <Edit2 size={14} />
                  ) : (
                    <Eye size={14} />
                  )}
                </div>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: FONT_WEIGHT.bold,
                    color: t.text,
                    fontFamily: FF,
                  }}
                >
                  {rightMode === "create"
                    ? "New Course"
                    : rightMode === "edit"
                      ? "Edit Course"
                      : "Course Preview"}
                </span>
              </div>
              <button
                onClick={() => {
                  setRightOpen(false);
                  setEditingCourse(null);
                  setPreviewCourseId(null);
                }}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: RADIUS.chip,
                  border: `1px solid ${t.border}`,
                  background: t.pageBg,
                  color: t.textMuted,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <X size={13} />
              </button>
            </div>

            <div className="tcm-p3-body">
              {rightMode === "preview" &&
                previewCourseId &&
                (() => {
                  const c = courses.find((x) => x.id === previewCourseId);
                  if (!c) return null;
                  return (
                    <>
                      <div
                        style={{
                          borderRadius: RADIUS.standardCard,
                          padding: 20,
                          color: "white",
                          marginBottom: 14,
                          background: "linear-gradient(135deg,#312e81,#6366f1)",
                        }}
                      >
                        <span
                          style={{
                            display: "inline-flex",
                            padding: "3px 9px",
                            borderRadius: RADIUS.chip,
                            fontSize: 10,
                            fontWeight: FONT_WEIGHT.bold,
                            textTransform: "uppercase",
                            marginBottom: 8,
                            background: "rgba(255,255,255,.15)",
                            color: "white",
                            fontFamily: FF,
                          }}
                        >
                          {c.category}
                        </span>
                        <h2
                          style={{
                            fontSize: 17,
                            fontWeight: FONT_WEIGHT.bold,
                            margin: "0 0 6px",
                            lineHeight: 1.3,
                            fontFamily: FF,
                          }}
                        >
                          {c.title}
                        </h2>
                        <p
                          style={{
                            fontSize: 11,
                            opacity: 0.7,
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            margin: 0,
                            fontFamily: FF,
                          }}
                        >
                          <GraduationCap size={12} /> {c.ownerEmail}
                        </p>
                      </div>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(3,1fr)",
                          gap: 8,
                          marginBottom: 14,
                        }}
                      >
                        {[
                          {
                            icon: <Clock size={13} />,
                            val: "8 weeks",
                            lbl: "Duration",
                          },
                          {
                            icon: <Users size={13} />,
                            val: c.enrolledCount || 0,
                            lbl: "Enrolled",
                          },
                          {
                            icon: (
                              <Star
                                size={13}
                                style={{ color: "#fb923c", fill: "#fb923c" }}
                              />
                            ),
                            val: c.rating || 4.8,
                            lbl: "Rating",
                          },
                        ].map((m, i) => (
                          <div
                            key={i}
                            style={{
                              borderRadius: RADIUS.chip,
                              padding: 12,
                              textAlign: "center",
                              background: t.pageBg,
                              border: `1px solid ${t.border}`,
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                color: t.textMuted,
                                marginBottom: 6,
                              }}
                            >
                              {m.icon}
                            </div>
                            <div
                              style={{
                                fontSize: 14,
                                fontWeight: FONT_WEIGHT.bold,
                                color: t.text,
                                marginBottom: 3,
                                fontFamily: FF,
                              }}
                            >
                              {m.val}
                            </div>
                            <div
                              style={{
                                fontSize: 10,
                                fontWeight: FONT_WEIGHT.bold,
                                textTransform: "uppercase",
                                letterSpacing: "0.06em",
                                color: t.textMuted,
                                fontFamily: FF,
                              }}
                            >
                              {m.lbl}
                            </div>
                          </div>
                        ))}
                      </div>
                      {c.description && (
                        <div
                          style={{
                            borderRadius: RADIUS.chip,
                            padding: 14,
                            background: t.pageBg,
                            border: `1px solid ${t.border}`,
                            marginBottom: 14,
                          }}
                        >
                          <p
                            style={{
                              fontSize: 10,
                              fontWeight: FONT_WEIGHT.bold,
                              textTransform: "uppercase",
                              letterSpacing: "0.08em",
                              color: t.textMuted,
                              margin: "0 0 6px",
                              fontFamily: FF,
                            }}
                          >
                            About
                          </p>
                          <p
                            style={{
                              fontSize: 13,
                              color: t.textSub,
                              lineHeight: 1.6,
                              margin: 0,
                              fontFamily: FF,
                            }}
                          >
                            {c.description}
                          </p>
                        </div>
                      )}
                      <button
                        className="tcm-sub"
                        style={{
                          width: "100%",
                          justifyContent: "center",
                          marginBottom: 8,
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          padding: 11,
                          borderRadius: RADIUS.button,
                          border: "none",
                          background: "#22d3ee",
                          color: "#0a0a0a",
                          fontFamily: FF,
                          fontSize: 13,
                          fontWeight: FONT_WEIGHT.bold,
                          cursor: "pointer",
                        }}
                        onClick={() => openEdit(c)}
                      >
                        <Edit2 size={14} /> Edit This Course
                      </button>
                      <button
                        className="tcm-sub"
                        style={{
                          width: "100%",
                          justifyContent: "center",
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          padding: 11,
                          borderRadius: RADIUS.button,
                          border: "none",
                          background: "#a78bfa",
                          color: "#0a0a0a",
                          fontFamily: FF,
                          fontSize: 13,
                          fontWeight: FONT_WEIGHT.bold,
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          navigate(`/trainer/course/${c.id}/modules`)
                        }
                      >
                        <BookOpen size={14} /> Manage Modules
                      </button>
                    </>
                  );
                })()}

              {(rightMode === "create" || rightMode === "edit") && (
                <>
                  {rightMode === "create" && (
                    <div style={fieldStyle}>
                      <label style={labelStyle}>
                        Batch <span style={{ color: "#f87171" }}>*</span>
                      </label>
                      <select
                        style={{ ...inputStyle, cursor: "pointer" }}
                        value={createForm.batchId}
                        onChange={(e) =>
                          setCreateForm({
                            ...createForm,
                            batchId: e.target.value,
                          })
                        }
                      >
                        <option value="">Select Batch…</option>
                        {batches.map((b) => (
                          <option key={b.id} value={b.id}>
                            Batch {b.id}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div style={fieldStyle}>
                    <label style={labelStyle}>
                      Course Title <span style={{ color: "#f87171" }}>*</span>
                    </label>
                    <input
                      style={inputStyle}
                      placeholder="e.g., Advanced React Development"
                      value={
                        rightMode === "create"
                          ? createForm.title
                          : editForm.title
                      }
                      onChange={(e) =>
                        rightMode === "create"
                          ? setCreateForm({
                              ...createForm,
                              title: e.target.value,
                            })
                          : setEditForm({ ...editForm, title: e.target.value })
                      }
                    />
                  </div>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>
                      Category <span style={{ color: "#f87171" }}>*</span>
                    </label>
                    <input
                      style={inputStyle}
                      placeholder="e.g., Development"
                      value={
                        rightMode === "create"
                          ? createForm.category
                          : editForm.category
                      }
                      onChange={(e) =>
                        rightMode === "create"
                          ? setCreateForm({
                              ...createForm,
                              category: e.target.value,
                            })
                          : setEditForm({
                              ...editForm,
                              category: e.target.value,
                            })
                      }
                    />
                  </div>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Description</label>
                    <textarea
                      style={{ ...inputStyle, resize: "none" }}
                      rows={5}
                      placeholder="Describe what students will learn…"
                      value={
                        rightMode === "create"
                          ? createForm.description
                          : editForm.description
                      }
                      onChange={(e) =>
                        rightMode === "create"
                          ? setCreateForm({
                              ...createForm,
                              description: e.target.value,
                            })
                          : setEditForm({
                              ...editForm,
                              description: e.target.value,
                            })
                      }
                    />
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      className="tcm-sub"
                      style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                        padding: 11,
                        borderRadius: RADIUS.button,
                        border: "none",
                        color: "#0a0a0a",
                        fontFamily: FF,
                        fontSize: 13,
                        fontWeight: FONT_WEIGHT.bold,
                        cursor: "pointer",
                        background:
                          rightMode === "create" ? "#34d399" : "#22d3ee",
                      }}
                      onClick={rightMode === "create" ? createCourse : saveEdit}
                    >
                      <CheckCircle size={15} />{" "}
                      {rightMode === "create"
                        ? "Create Course"
                        : "Save Changes"}
                    </button>
                    <button
                      style={{
                        padding: "11px 16px",
                        borderRadius: RADIUS.button,
                        border: `1px solid ${t.border}`,
                        background: t.pageBg,
                        color: t.textMuted,
                        fontFamily: FF,
                        fontSize: 13,
                        fontWeight: FONT_WEIGHT.bold,
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setRightOpen(false);
                        setEditingCourse(null);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      {upgradeConfig && (
        <UpgradeModal
          isOpen={!!upgradeConfig}
          onClose={() => setUpgradeConfig(null)}
          planType="individual"
          userId={getAuthTokenUserId()}
          currentPlan="free"
          availableTargetPlans={["pro", "premium"]}
          featureLabel={upgradeConfig.featureLabel}
          onSuccess={() => setUpgradeConfig(null)}
        />
      )}
    </PageContainer>
  );
};

export default TrainerCourseManagement;
