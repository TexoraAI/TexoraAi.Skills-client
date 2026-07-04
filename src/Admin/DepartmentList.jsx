import {
  ArrowLeft,
  Building2,
  GitBranch,
  GripVertical,
  Layers,
  Pencil,
  Plus,
  Search,
  Trash2,
  Users,
  X,
  ChevronRight,
  Sparkles,
  Activity,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../services/batchService"; // adjust path to your api.js

/* ─── theme token map ─── */
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
    actIcon: "rgba(255,255,255,0.3)",
    actBar: "rgba(255,255,255,0.5)",
    gridLine: "rgba(255,255,255,0.5)",
    shadow: "0 4px 20px rgba(0,0,0,0.4)",
    shadowHov: "0 20px 60px rgba(0,0,0,0.6)",
    emptyBorder: "rgba(255,255,255,0.07)",
    emptyBg: "rgba(255,255,255,0.02)",
    emptyIcon: "rgba(255,255,255,0.12)",
    recentItemBg: "rgba(255,255,255,0.03)",
    recentItemBorder: "rgba(255,255,255,0.05)",
    liveColor: "#34d399",
    liveText: "#34d399",
    inputBg: "rgba(255,255,255,0.05)",
    inputBorder: "rgba(255,255,255,0.1)",
    inputText: "#ffffff",
    skeletonBg: "rgba(255,255,255,0.07)",
    theadBg: "rgba(255,255,255,0.03)",
    rowOver: "rgba(34,211,238,0.07)",
    dropdownBg: "#1a1a1a",
    dropdownItemHov: "rgba(255,255,255,0.06)",
    errorBg: "rgba(244,63,94,0.08)",
    errorBorder: "rgba(244,63,94,0.2)",
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
    actIcon: "#94a3b8",
    actBar: "#94a3b8",
    gridLine: "rgba(0,0,0,0.12)",
    shadow: "0 1px 8px rgba(0,0,0,0.07)",
    shadowHov: "0 8px 32px rgba(0,0,0,0.10)",
    emptyBorder: "#e2e8f0",
    emptyBg: "#f8fafc",
    emptyIcon: "#cbd5e1",
    recentItemBg: "#f8fafc",
    recentItemBorder: "#e2e8f0",
    liveColor: "#16a34a",
    liveText: "#16a34a",
    inputBg: "#f8fafc",
    inputBorder: "#e2e8f0",
    inputText: "#0f172a",
    skeletonBg: "#e2e8f0",
    theadBg: "rgba(0,0,0,0.02)",
    rowOver: "rgba(34,211,238,0.06)",
    dropdownBg: "#ffffff",
    dropdownItemHov: "#f1f5f9",
    errorBg: "rgba(244,63,94,0.05)",
    errorBorder: "rgba(244,63,94,0.15)",
  },
};

const GRAD_COLORS = [
  ["#a78bfa", "#7c3aed"],
  ["#22d3ee", "#0891b2"],
  ["#f43f5e", "#be123c"],
  ["#f59e0b", "#b45309"],
  ["#34d399", "#059669"],
  ["#818cf8", "#4338ca"],
];
const gradColor = (name) =>
  GRAD_COLORS[(name?.charCodeAt(0) ?? 0) % GRAD_COLORS.length];

const TABS = [
  { label: "Departments", path: "/admin/departmentlist", icon: Building2 },
  { label: "Branches", path: "/admin/branches", icon: GitBranch },
  { label: "Batches", path: "/admin/batches", icon: Layers },
];

// Department type options — real-world department names
const DEPARTMENT_OPTIONS = [
  "Engineering",
  "Computer Science",
  "Electronics & Communication",
  "Mechanical Engineering",
  "Civil Engineering",
  "Information Technology",
  "MBA",
  "Business Administration",
  "Finance & Accounting",
  "Human Resources",
  "Marketing",
  "Sales & Business Development",
  "Data Science & AI",
  "Cybersecurity",
  "Cloud Computing",
  "Product Management",
  "Operations",
  "Research & Development",
  "Legal & Compliance",
  "Quality Assurance",
  "Design & UX",
  "Content & Communications",
  "Customer Support",
  "Logistics & Supply Chain",
  "Healthcare Management",
  "Biotechnology",
  "Architecture",
  "Physics",
  "Mathematics",
  "Chemistry",
];

/* ══ drag list hook ══ */
function useDragList(items, setItems) {
  const dragIdx = useRef(null),
    overIdx = useRef(null);
  const [active, setActive] = useState(null),
    [over, setOver] = useState(null);
  const handlers = (i) => ({
    draggable: true,
    onDragStart: () => {
      dragIdx.current = i;
      setActive(i);
    },
    onDragOver: (e) => {
      e.preventDefault();
      overIdx.current = i;
      setOver(i);
    },
    onDrop: () => {
      const from = dragIdx.current,
        to = overIdx.current;
      if (from !== null && to !== null && from !== to) {
        const next = [...items];
        const [m] = next.splice(from, 1);
        next.splice(to, 0, m);
        setItems(next);
      }
      dragIdx.current = null;
      overIdx.current = null;
      setActive(null);
      setOver(null);
    },
    onDragEnd: () => {
      dragIdx.current = null;
      overIdx.current = null;
      setActive(null);
      setOver(null);
    },
  });
  return { handlers, active, over };
}

/* ══════════ MAIN ══════════ */
const DepartmentList = () => {
  const navigate = useNavigate();

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
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });
    return () => obs.disconnect();
  }, []);

  const t = isDark ? T.dark : T.light;

  /* ── state ── */
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null); // id being deleted
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [mode, setMode] = useState("create");
  const [currentId, setCurrentId] = useState(null);
  const [form, setForm] = useState({ name: "", head: "" });
  const [dropOpen, setDropOpen] = useState(false);
  const [customOptions, setCustomOptions] = useState([]);
  const [formError, setFormError] = useState("");
  const [limitError, setLimitError] = useState(null);
  const allOptions = [...DEPARTMENT_OPTIONS, ...customOptions];

  const {
    handlers: dragHandlers,
    active: dragActive,
    over: dragOver,
  } = useDragList(departments, setDepartments);

  const filtered = departments.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()),
  );

  // ── Get org id from JWT stored in localStorage ──
  // Your auth service stores organizationId in the JWT / user profile.
  // Read it so we can send it when creating a department.
  const getOrgId = useCallback(() => {
    try {
      const token = localStorage.getItem("lms_token");
      if (!token) return null;
      const payload = JSON.parse(atob(token.split(".")[1]));
      // JWT claims: adjust key name if your auth service uses a different claim
      return payload.organizationId || payload.orgId || null;
    } catch {
      return null;
    }
  }, []);

  /* ── Fetch all departments on mount ── */
  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getDepartments();
      setDepartments(res.data || []);
    } catch (err) {
      setError("Failed to load departments. Please try again.");
      console.error("getDepartments error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ── Handlers ── */
  const handleAdd = () => {
    setMode("create");
    setForm({ name: "", head: "" });
    setFormError("");
    setPanelOpen(true);
  };

  const handleEdit = (dept) => {
    setMode("edit");
    setCurrentId(dept.id);
    setForm({ name: dept.name, head: dept.head || "" });
    setFormError("");
    setPanelOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      setFormError("Department name is required.");
      return;
    }
    if (!form.head.trim()) {
      setFormError("Department head is required.");
      return;
    }
    setFormError("");

    try {
      setSaving(true);

      if (mode === "create") {
        const orgId = getOrgId();
        const payload = {
          name: form.name.trim(),
          head: form.head.trim(),
          organizationId: orgId, // from JWT — may be null for super admin edge case
        };
        const res = await createDepartment(payload);
        setDepartments((prev) => [...prev, res.data]);
      } else {
        const payload = {
          name: form.name.trim(),
          head: form.head.trim(),
        };
        const res = await updateDepartment(currentId, payload);
        setDepartments((prev) =>
          prev.map((d) => (d.id === currentId ? res.data : d)),
        );
      }

      setPanelOpen(false);

      // } catch (err) {
      //   const msg =
      //     (typeof err?.response?.data === "string"
      //       ? err?.response?.data
      //       : null) ||
      //     err?.response?.data?.message ||
      //     "Something went wrong. Please try again.";
      //   setFormError(msg);
      //   console.error("save department error:", err?.response?.data);
      // } finally {
      //   setSaving(false);
      // }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        "Something went wrong.";
      const text = typeof msg === "string" ? msg : "Something went wrong.";
      if (
        text.toLowerCase().includes("limit") ||
        text.toLowerCase().includes("max")
      ) {
        setLimitError(text);
      } else {
        setFormError(text);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Delete this department? All branches and batches under it will also be deleted.",
      )
    )
      return;
    try {
      setDeleting(id);
      await deleteDepartment(id);
      setDepartments((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      alert("Delete failed. Please try again.");
      console.error("deleteDepartment error:", err);
    } finally {
      setDeleting(null);
    }
  };

  const handleAddCustomOption = () => {
    const v = window.prompt("Enter new department type:");
    if (v?.trim()) {
      setCustomOptions((prev) => [...prev, v.trim()]);
      setForm((f) => ({ ...f, name: v.trim() }));
      setDropOpen(false);
    }
  };

  /* ── Styles ── */
  const inputStyle = {
    width: "100%",
    height: 38,
    borderRadius: 10,
    border: `1px solid ${t.inputBorder}`,
    background: t.inputBg,
    color: t.inputText,
    fontSize: 12,
    fontFamily: "'Poppins',sans-serif",
    padding: "0 12px",
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle = {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: t.textMuted,
    fontFamily: "'Poppins',sans-serif",
    display: "flex",
    alignItems: "center",
    gap: 5,
    marginBottom: 6,
  };

  /* ══════════ RENDER ══════════ */
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        .dfade{animation:fadeUp 0.45s ease both}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.15}}
        .d1{animation:blink 1.6s ease infinite}
        .d2{animation:blink 1.6s 0.3s ease infinite}
        .d3{animation:blink 1.6s 0.6s ease infinite}
        @keyframes pulse-ring{0%{box-shadow:0 0 0 0 rgba(52,211,153,0.5)}70%{box-shadow:0 0 0 8px rgba(52,211,153,0)}100%{box-shadow:0 0 0 0 rgba(52,211,153,0)}}
        .livebadge{animation:pulse-ring 2.2s ease-out infinite}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        .spin{animation:spin 0.8s linear infinite}
        .dept-row .grip-btn{opacity:0;transition:opacity 0.2s}
        .dept-row:hover .grip-btn{opacity:1}
        .dept-row .row-actions{opacity:0;transition:opacity 0.2s}
        .dept-row:hover .row-actions{opacity:1}
        .dept-row:hover .dept-name{color:#22d3ee}
        .dept-name{transition:color 0.15s}
        .drop-item:hover{background:var(--drop-hov)}
        .skeleton{background:linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.06) 50%,transparent 100%);background-size:200% 100%;animation:shimmer 1.4s infinite}
        @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: t.pageBg,
          color: t.text,
          fontFamily: "'Poppins',sans-serif",
          transition: "background 0.3s,color 0.3s",
        }}
      >
        <div
          style={{
            maxWidth: 1300,
            margin: "0 auto",
            padding: 24,
            paddingBottom: 52,
          }}
        >
          {/* ═══ HERO ═══ */}
          <div
            className="dfade"
            style={{
              borderRadius: 24,
              padding: "30px 36px",
              background: t.heroBg,
              border: `1px solid ${t.borderHero}`,
              position: "relative",
              overflow: "hidden",
              marginBottom: 20,
              boxShadow: t.shadow,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                opacity: isDark ? 0.04 : 0.025,
                backgroundImage: `linear-gradient(${t.gridLine} 1px,transparent 1px),linear-gradient(90deg,${t.gridLine} 1px,transparent 1px)`,
                backgroundSize: "40px 40px",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "-30%",
                left: "40%",
                width: 300,
                height: 200,
                background:
                  "radial-gradient(ellipse,rgba(34,211,238,0.06),transparent 70%)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "-40%",
                right: "10%",
                width: 250,
                height: 200,
                background:
                  "radial-gradient(ellipse,rgba(167,139,250,0.06),transparent 70%)",
                pointerEvents: "none",
              }}
            />

            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 16,
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 10,
                  }}
                >
                  <button
                    onClick={() => navigate(-1)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "6px 14px",
                      borderRadius: 10,
                      border: `1px solid ${t.borderHov}`,
                      background: t.actBg,
                      color: t.textSub,
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "'Poppins',sans-serif",
                    }}
                  >
                    <ArrowLeft size={13} /> Back
                  </button>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 7 }}
                  >
                    <Sparkles size={11} color={t.textSub} />
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        letterSpacing: "0.22em",
                        textTransform: "uppercase",
                        color: t.textSub,
                        fontFamily: "'Poppins',sans-serif",
                      }}
                    >
                      Admin Portal
                    </span>
                    <ChevronRight size={10} color={t.textSub} />
                    <span
                      onClick={() => navigate("/admin/organisation-overview")}
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        letterSpacing: "0.22em",
                        textTransform: "uppercase",
                        color: t.textSub,
                        fontFamily: "'Poppins',sans-serif",
                        cursor: "pointer",
                      }}
                    >
                      Organisation Manager
                    </span>
                  </div>
                </div>
                <h1
                  style={{
                    fontFamily: "'Poppins',sans-serif",
                    fontWeight: 900,
                    fontSize: "clamp(1.6rem,3vw,2.4rem)",
                    color: t.text,
                    margin: 0,
                    lineHeight: 1.1,
                    letterSpacing: "-0.02em",
                  }}
                >
                  Department Management
                </h1>
                <p
                  style={{
                    fontSize: 12,
                    color: t.textSub,
                    marginTop: 7,
                    fontWeight: 500,
                    fontFamily: "'Poppins',sans-serif",
                  }}
                >
                  Manage organisational departments &amp; leadership
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
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
                    fontFamily: "'Poppins',sans-serif",
                    color: t.textSub,
                  }}
                >
                  <Users size={13} color="#a78bfa" />
                  <span style={{ color: t.text, fontWeight: 700 }}>
                    {departments.length}
                  </span>
                  <span>Departments</span>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: t.actBg,
                    border: `1px solid ${t.actBorder}`,
                    borderRadius: 10,
                    padding: "8px 14px",
                  }}
                >
                  <Activity size={12} color={t.actIcon} />
                  <div
                    style={{
                      display: "flex",
                      gap: 3,
                      alignItems: "flex-end",
                      height: 14,
                    }}
                  >
                    <span
                      className="d1"
                      style={{
                        width: 3,
                        height: 10,
                        borderRadius: 2,
                        background: t.actBar,
                        display: "block",
                      }}
                    />
                    <span
                      className="d2"
                      style={{
                        width: 3,
                        height: 14,
                        borderRadius: 2,
                        background: t.actBar,
                        display: "block",
                      }}
                    />
                    <span
                      className="d3"
                      style={{
                        width: 3,
                        height: 7,
                        borderRadius: 2,
                        background: t.actBar,
                        display: "block",
                      }}
                    />
                  </div>
                </div>

                <div
                  className="livebadge"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    background: isDark
                      ? "rgba(52,211,153,0.08)"
                      : "rgba(22,163,74,0.08)",
                    border: isDark
                      ? "1px solid rgba(52,211,153,0.3)"
                      : "1px solid rgba(22,163,74,0.3)",
                    borderRadius: 999,
                    padding: "8px 18px",
                    color: t.liveText,
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    fontFamily: "'Poppins',sans-serif",
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: t.liveColor,
                      display: "inline-block",
                    }}
                  />
                  LIVE
                </div>
              </div>
            </div>
          </div>

          {/* ═══ GLOBAL ERROR BANNER ═══ */}
          {error && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "12px 18px",
                borderRadius: 12,
                marginBottom: 16,
                background: t.errorBg,
                border: `1px solid ${t.errorBorder}`,
                color: "#f43f5e",
                fontSize: 12,
                fontFamily: "'Poppins',sans-serif",
              }}
            >
              <AlertCircle size={15} />
              <span style={{ flex: 1 }}>{error}</span>
              <button
                onClick={fetchDepartments}
                style={{
                  padding: "4px 12px",
                  borderRadius: 8,
                  background: "rgba(244,63,94,0.12)",
                  border: "1px solid rgba(244,63,94,0.25)",
                  color: "#f43f5e",
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "'Poppins',sans-serif",
                }}
              >
                Retry
              </button>
            </div>
          )}

          {/* ═══ ACTION BAR ═══ */}
          <div
            className="dfade"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 4,
                borderRadius: 14,
                background: t.cardBg,
                border: `1px solid ${t.border}`,
                padding: 4,
                boxShadow: t.shadow,
              }}
            >
              {TABS.map(({ label, path, icon: Icon }) => {
                const isActive =
                  typeof location !== "undefined" && location.pathname === path;
                return (
                  <button
                    key={path}
                    onClick={() => navigate(path)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "7px 16px",
                      borderRadius: 10,
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "'Poppins',sans-serif",
                      fontSize: 11,
                      fontWeight: 600,
                      background: isActive
                        ? "linear-gradient(135deg,#22d3ee,#3b82f6)"
                        : "transparent",
                      color: isActive ? "#fff" : t.textSub,
                      boxShadow: isActive
                        ? "0 2px 8px rgba(34,211,238,0.3)"
                        : "none",
                      transition: "all 0.2s",
                    }}
                  >
                    <Icon size={13} /> {label}
                  </button>
                );
              })}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ position: "relative" }}>
                <Search
                  size={14}
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
                  placeholder="Search departments…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    paddingLeft: 34,
                    paddingRight: 14,
                    height: 36,
                    width: 220,
                    borderRadius: 10,
                    border: `1px solid ${t.border}`,
                    background: t.cardBg,
                    color: t.text,
                    fontSize: 11,
                    fontFamily: "'Poppins',sans-serif",
                    outline: "none",
                    boxShadow: t.shadow,
                  }}
                />
              </div>
            </div>
          </div>

          {/* ═══ MAIN LAYOUT ═══ */}
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            {/* TABLE CARD */}
            <div style={{ flex: 1, minWidth: 0, transition: "all 0.3s" }}>
              <div
                style={{
                  background: t.cardBg,
                  border: `1px solid ${t.border}`,
                  borderRadius: 20,
                  overflow: "hidden",
                  boxShadow: t.shadow,
                }}
              >
                {/* card header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px 22px",
                    borderBottom: `1px solid ${t.border}`,
                    background: isDark
                      ? "rgba(255,255,255,0.02)"
                      : "rgba(0,0,0,0.01)",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: t.text,
                        margin: 0,
                        fontFamily: "'Poppins',sans-serif",
                      }}
                    >
                      All Departments
                    </p>
                    <p
                      style={{
                        fontSize: 10,
                        color: t.textMuted,
                        margin: "3px 0 0",
                        fontFamily: "'Poppins',sans-serif",
                      }}
                    >
                      {loading
                        ? "Loading…"
                        : `${filtered.length} record${filtered.length !== 1 ? "s" : ""} found`}
                      {!loading && departments.length > 0 && (
                        <span style={{ marginLeft: 8, color: t.textLabel }}>
                          · Drag to reorder
                        </span>
                      )}
                    </p>
                  </div>
                  <button
                    onClick={handleAdd}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      padding: "8px 18px",
                      borderRadius: 10,
                      background: "linear-gradient(135deg,#3b82f6,#22d3ee)",
                      border: "none",
                      color: "#fff",
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: "pointer",
                      fontFamily: "'Poppins',sans-serif",
                      boxShadow: "0 4px 14px rgba(34,211,238,0.35)",
                      transition: "all 0.2s",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <Plus size={14} /> Add Department
                  </button>
                </div>

                {/* table */}
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr
                        style={{
                          background: t.theadBg,
                          borderBottom: `1px solid ${t.border}`,
                        }}
                      >
                        {["", "#", "Department", "Head", "Actions"].map(
                          (h, i) => (
                            <th
                              key={i}
                              style={{
                                padding:
                                  i === 0 ? "12px 8px 12px 18px" : "12px 16px",
                                textAlign: i === 4 ? "right" : "left",
                                fontSize: 9,
                                fontWeight: 700,
                                letterSpacing: "0.1em",
                                textTransform: "uppercase",
                                color: t.textMuted,
                                fontFamily: "'Poppins',sans-serif",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {h}
                            </th>
                          ),
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {/* Loading skeletons */}
                      {loading &&
                        Array.from({ length: 4 }).map((_, i) => (
                          <tr
                            key={i}
                            style={{ borderBottom: `1px solid ${t.border}` }}
                          >
                            <td
                              style={{
                                padding: "14px 8px 14px 18px",
                                width: 32,
                              }}
                            >
                              <div
                                style={{
                                  width: 24,
                                  height: 24,
                                  borderRadius: 6,
                                  background: t.skeletonBg,
                                }}
                                className="skeleton"
                              />
                            </td>
                            <td style={{ padding: "14px 16px" }}>
                              <div
                                style={{
                                  width: 20,
                                  height: 12,
                                  borderRadius: 4,
                                  background: t.skeletonBg,
                                }}
                                className="skeleton"
                              />
                            </td>
                            <td style={{ padding: "14px 16px" }}>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 10,
                                }}
                              >
                                <div
                                  style={{
                                    width: 34,
                                    height: 34,
                                    borderRadius: 10,
                                    background: t.skeletonBg,
                                    flexShrink: 0,
                                  }}
                                  className="skeleton"
                                />
                                <div
                                  style={{
                                    width: 120,
                                    height: 12,
                                    borderRadius: 4,
                                    background: t.skeletonBg,
                                  }}
                                  className="skeleton"
                                />
                              </div>
                            </td>
                            <td style={{ padding: "14px 16px" }}>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 8,
                                }}
                              >
                                <div
                                  style={{
                                    width: 30,
                                    height: 30,
                                    borderRadius: "50%",
                                    background: t.skeletonBg,
                                    flexShrink: 0,
                                  }}
                                  className="skeleton"
                                />
                                <div
                                  style={{
                                    width: 90,
                                    height: 12,
                                    borderRadius: 4,
                                    background: t.skeletonBg,
                                  }}
                                  className="skeleton"
                                />
                              </div>
                            </td>
                            <td
                              style={{
                                padding: "14px 22px 14px 16px",
                                textAlign: "right",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "flex-end",
                                  gap: 6,
                                }}
                              >
                                <div
                                  style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: 8,
                                    background: t.skeletonBg,
                                  }}
                                  className="skeleton"
                                />
                                <div
                                  style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: 8,
                                    background: t.skeletonBg,
                                  }}
                                  className="skeleton"
                                />
                              </div>
                            </td>
                          </tr>
                        ))}

                      {/* Empty state */}
                      {!loading && filtered.length === 0 && (
                        <tr>
                          <td colSpan={5}>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "52px 0",
                                gap: 12,
                              }}
                            >
                              <div
                                style={{
                                  width: 52,
                                  height: 52,
                                  borderRadius: 14,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  border: `1.5px dashed ${t.emptyBorder}`,
                                  background: t.emptyBg,
                                }}
                              >
                                <Building2 size={22} color={t.emptyIcon} />
                              </div>
                              <p
                                style={{
                                  fontSize: 12,
                                  color: t.textMuted,
                                  fontWeight: 500,
                                  fontFamily: "'Poppins',sans-serif",
                                  margin: 0,
                                }}
                              >
                                {search
                                  ? "No departments match your search"
                                  : "No departments yet"}
                              </p>
                              <p
                                style={{
                                  fontSize: 10,
                                  color: t.textLabel,
                                  fontFamily: "'Poppins',sans-serif",
                                  margin: 0,
                                }}
                              >
                                {search
                                  ? "Try a different keyword"
                                  : `Click "Add Department" to get started`}
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}

                      {/* Rows */}
                      {!loading &&
                        filtered.map((dept, index) => {
                          const dh = dragHandlers(index);
                          const isDragging = dragActive === index;
                          const isOver =
                            dragOver === index && dragActive !== index;
                          const isDeleting = deleting === dept.id;
                          const [c1, c2] = gradColor(dept.head || dept.name);

                          return (
                            <tr
                              key={dept.id}
                              {...dh}
                              className="dept-row"
                              style={{
                                borderBottom: `1px solid ${t.border}`,
                                background: isDragging
                                  ? t.actBg
                                  : isOver
                                    ? t.rowOver
                                    : "transparent",
                                opacity: isDragging || isDeleting ? 0.5 : 1,
                                transition: "background 0.15s, opacity 0.2s",
                                cursor: "default",
                                outline: isOver ? `2px solid #22d3ee` : "none",
                                outlineOffset: -1,
                              }}
                            >
                              {/* grip */}
                              <td
                                style={{
                                  padding: "14px 8px 14px 18px",
                                  width: 32,
                                }}
                              >
                                <div
                                  className="grip-btn"
                                  style={{
                                    cursor: "grab",
                                    padding: 5,
                                    borderRadius: 7,
                                    background: t.actBg,
                                    display: "inline-flex",
                                  }}
                                >
                                  <GripVertical size={13} color={t.textMuted} />
                                </div>
                              </td>

                              {/* index */}
                              <td style={{ padding: "14px 16px", width: 40 }}>
                                <span
                                  style={{
                                    fontSize: 11,
                                    fontWeight: 600,
                                    color: t.textMuted,
                                    fontFamily: "'Poppins',sans-serif",
                                  }}
                                >
                                  {String(index + 1).padStart(2, "0")}
                                </span>
                              </td>

                              {/* department name */}
                              <td style={{ padding: "14px 16px" }}>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 10,
                                  }}
                                >
                                  <div
                                    style={{
                                      width: 34,
                                      height: 34,
                                      borderRadius: 10,
                                      background: isDark
                                        ? "rgba(167,139,250,0.12)"
                                        : "rgba(167,139,250,0.1)",
                                      border:
                                        "1px solid rgba(167,139,250,0.25)",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      flexShrink: 0,
                                    }}
                                  >
                                    <Building2 size={15} color="#a78bfa" />
                                  </div>
                                  <div>
                                    <span
                                      className="dept-name"
                                      style={{
                                        fontSize: 12,
                                        fontWeight: 700,
                                        color: t.text,
                                        fontFamily: "'Poppins',sans-serif",
                                        display: "block",
                                      }}
                                    >
                                      {dept.name}
                                    </span>
                                    {dept.organizationId && (
                                      <span
                                        style={{
                                          fontSize: 9,
                                          color: t.textLabel,
                                          fontFamily: "'Poppins',sans-serif",
                                        }}
                                      >
                                        Org: {dept.organizationId.slice(0, 8)}…
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </td>

                              {/* head */}
                              <td style={{ padding: "14px 16px" }}>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                  }}
                                >
                                  <div
                                    style={{
                                      width: 30,
                                      height: 30,
                                      borderRadius: "50%",
                                      background: `linear-gradient(135deg,${c1},${c2})`,
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      color: "#fff",
                                      fontWeight: 800,
                                      fontSize: 10,
                                      fontFamily: "'Poppins',sans-serif",
                                      boxShadow: `0 2px 8px ${c1}44`,
                                      flexShrink: 0,
                                    }}
                                  >
                                    {(dept.head || "?")
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")
                                      .slice(0, 2)
                                      .toUpperCase()}
                                  </div>
                                  <span
                                    style={{
                                      fontSize: 12,
                                      color: t.textSub,
                                      fontFamily: "'Poppins',sans-serif",
                                      fontWeight: 500,
                                    }}
                                  >
                                    {dept.head || "—"}
                                  </span>
                                </div>
                              </td>

                              {/* actions */}
                              <td
                                style={{
                                  padding: "14px 22px 14px 16px",
                                  textAlign: "right",
                                }}
                              >
                                <div
                                  className="row-actions"
                                  style={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    gap: 6,
                                  }}
                                >
                                  <button
                                    onClick={() => handleEdit(dept)}
                                    disabled={isDeleting}
                                    style={{
                                      width: 32,
                                      height: 32,
                                      borderRadius: 8,
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      background: "rgba(34,211,238,0.08)",
                                      border: "1px solid rgba(34,211,238,0.2)",
                                      color: isDark ? "#22d3ee" : "#0891b2",
                                      cursor: "pointer",
                                      transition: "all 0.15s",
                                    }}
                                  >
                                    <Pencil size={13} />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(dept.id)}
                                    disabled={isDeleting}
                                    style={{
                                      width: 32,
                                      height: 32,
                                      borderRadius: 8,
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      background: "rgba(244,63,94,0.08)",
                                      border: "1px solid rgba(244,63,94,0.2)",
                                      color: "#f43f5e",
                                      cursor: isDeleting
                                        ? "not-allowed"
                                        : "pointer",
                                      transition: "all 0.15s",
                                    }}
                                  >
                                    {isDeleting ? (
                                      <Loader2 size={13} className="spin" />
                                    ) : (
                                      <Trash2 size={13} />
                                    )}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* ═══ INLINE SLIDE PANEL ═══ */}
            <div
              style={{
                flexShrink: 0,
                width: panelOpen ? 340 : 0,
                opacity: panelOpen ? 1 : 0,
                pointerEvents: panelOpen ? "auto" : "none",
                overflow: "hidden",
                transition: "width 0.3s ease, opacity 0.3s ease",
              }}
            >
              <div
                style={{
                  width: 340,
                  borderRadius: 20,
                  border: `1px solid ${t.border}`,
                  background: t.cardBg,
                  overflow: "hidden",
                  boxShadow: t.shadowHov,
                }}
              >
                {/* panel header */}
                <div
                  style={{
                    background: "linear-gradient(135deg,#1a56db,#06b6d4)",
                    padding: "18px 20px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <div
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 10,
                          background: "rgba(255,255,255,0.2)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {mode === "create" ? (
                          <Plus size={15} color="#fff" />
                        ) : (
                          <Pencil size={15} color="#fff" />
                        )}
                      </div>
                      <div>
                        <p
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: "#fff",
                            margin: 0,
                            fontFamily: "'Poppins',sans-serif",
                          }}
                        >
                          {mode === "create"
                            ? "New Department"
                            : "Edit Department"}
                        </p>
                        <p
                          style={{
                            fontSize: 10,
                            color: "rgba(255,255,255,0.6)",
                            margin: "2px 0 0",
                            fontFamily: "'Poppins',sans-serif",
                          }}
                        >
                          {mode === "create"
                            ? "Add a new department to your org"
                            : "Update department details"}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setPanelOpen(false)}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        background: "rgba(255,255,255,0.15)",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <X size={14} color="#fff" />
                    </button>
                  </div>
                </div>

                {/* panel body */}
                <div
                  style={{
                    padding: 20,
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                  }}
                >
                  {/* Form error */}
                  {formError && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "10px 14px",
                        borderRadius: 10,
                        background: t.errorBg,
                        border: `1px solid ${t.errorBorder}`,
                        color: "#f43f5e",
                        fontSize: 11,
                        fontFamily: "'Poppins',sans-serif",
                      }}
                    >
                      <AlertCircle size={13} />
                      <span>{formError}</span>
                    </div>
                  )}

                  {/* Department Name dropdown */}
                  <div>
                    <label style={labelStyle}>
                      <Building2 size={11} /> Department Type *
                    </label>
                    <div style={{ display: "flex", gap: 8 }}>
                      <div style={{ flex: 1, position: "relative" }}>
                        <button
                          onClick={() => setDropOpen((o) => !o)}
                          style={{
                            ...inputStyle,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            cursor: "pointer",
                            textAlign: "left",
                          }}
                        >
                          <span
                            style={{
                              color: form.name ? t.inputText : t.textMuted,
                              fontSize: 12,
                            }}
                          >
                            {form.name || "Select department type"}
                          </span>
                          <ChevronRight
                            size={13}
                            color={t.textMuted}
                            style={{
                              transform: dropOpen ? "rotate(90deg)" : "none",
                              transition: "transform 0.2s",
                            }}
                          />
                        </button>

                        {dropOpen && (
                          <div
                            style={{
                              position: "absolute",
                              top: "calc(100% + 4px)",
                              left: 0,
                              right: 0,
                              background: t.dropdownBg,
                              border: `1px solid ${t.border}`,
                              borderRadius: 12,
                              boxShadow: t.shadowHov,
                              zIndex: 999,
                              maxHeight: 220,
                              overflowY: "auto",
                              "--drop-hov": t.dropdownItemHov,
                            }}
                          >
                            {allOptions.map((d) => (
                              <div
                                key={d}
                                className="drop-item"
                                onClick={() => {
                                  setForm((f) => ({ ...f, name: d }));
                                  setDropOpen(false);
                                }}
                                style={{
                                  padding: "9px 14px",
                                  fontSize: 12,
                                  cursor: "pointer",
                                  color: t.text,
                                  fontFamily: "'Poppins',sans-serif",
                                  background:
                                    form.name === d
                                      ? isDark
                                        ? "rgba(34,211,238,0.1)"
                                        : "rgba(34,211,238,0.07)"
                                      : "transparent",
                                  fontWeight: form.name === d ? 600 : 400,
                                }}
                              >
                                {d}
                              </div>
                            ))}
                            {/* Add custom option at bottom */}
                            <div
                              className="drop-item"
                              onClick={handleAddCustomOption}
                              style={{
                                padding: "9px 14px",
                                fontSize: 12,
                                cursor: "pointer",
                                color: "#22d3ee",
                                fontFamily: "'Poppins',sans-serif",
                                fontWeight: 600,
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                borderTop: `1px solid ${t.border}`,
                              }}
                            >
                              <Plus size={12} /> Add custom type…
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Department Head */}
                  <div>
                    <label style={labelStyle}>Department Head *</label>
                    <input
                      placeholder="Enter full name of department head"
                      value={form.head}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, head: e.target.value }))
                      }
                      style={inputStyle}
                    />
                  </div>

                  {/* Live preview */}
                  {form.name &&
                    form.head &&
                    (() => {
                      const [pc1, pc2] = gradColor(form.head);
                      return (
                        <div
                          style={{
                            borderRadius: 12,
                            border: "1px solid rgba(34,211,238,0.2)",
                            background: isDark
                              ? "rgba(34,211,238,0.05)"
                              : "rgba(34,211,238,0.04)",
                            padding: 14,
                          }}
                        >
                          <p
                            style={{
                              fontSize: 9,
                              fontWeight: 700,
                              letterSpacing: "0.1em",
                              textTransform: "uppercase",
                              color: "#22d3ee",
                              fontFamily: "'Poppins',sans-serif",
                              margin: "0 0 10px",
                            }}
                          >
                            Preview
                          </p>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                            }}
                          >
                            <div
                              style={{
                                width: 34,
                                height: 34,
                                borderRadius: 10,
                                background: isDark
                                  ? "rgba(167,139,250,0.15)"
                                  : "rgba(167,139,250,0.1)",
                                border: "1px solid rgba(167,139,250,0.3)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                              }}
                            >
                              <Building2 size={15} color="#a78bfa" />
                            </div>
                            <div style={{ flex: 1 }}>
                              <p
                                style={{
                                  fontSize: 12,
                                  fontWeight: 700,
                                  color: t.text,
                                  margin: 0,
                                  fontFamily: "'Poppins',sans-serif",
                                }}
                              >
                                {form.name}
                              </p>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 6,
                                  marginTop: 3,
                                }}
                              >
                                <div
                                  style={{
                                    width: 18,
                                    height: 18,
                                    borderRadius: "50%",
                                    background: `linear-gradient(135deg,${pc1},${pc2})`,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#fff",
                                    fontWeight: 800,
                                    fontSize: 8,
                                    fontFamily: "'Poppins',sans-serif",
                                    flexShrink: 0,
                                  }}
                                >
                                  {form.head
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .slice(0, 2)
                                    .toUpperCase()}
                                </div>
                                <span
                                  style={{
                                    fontSize: 10,
                                    color: t.textSub,
                                    fontFamily: "'Poppins',sans-serif",
                                  }}
                                >
                                  {form.head}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                </div>

                {/* panel footer */}
                <div
                  style={{
                    borderTop: `1px solid ${t.border}`,
                    padding: "14px 20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <button
                    onClick={() => setPanelOpen(false)}
                    disabled={saving}
                    style={{
                      padding: "8px 18px",
                      borderRadius: 10,
                      border: `1px solid ${t.border}`,
                      background: t.actBg,
                      color: t.textSub,
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "'Poppins',sans-serif",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "8px 20px",
                      borderRadius: 10,
                      background: saving
                        ? "rgba(34,211,238,0.3)"
                        : "linear-gradient(135deg,#3b82f6,#22d3ee)",
                      border: "none",
                      color: "#fff",
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: saving ? "not-allowed" : "pointer",
                      fontFamily: "'Poppins',sans-serif",
                      boxShadow: saving
                        ? "none"
                        : "0 4px 14px rgba(34,211,238,0.35)",
                      transition: "all 0.2s",
                    }}
                  >
                    {saving ? (
                      <>
                        <Loader2 size={13} className="spin" /> Saving…
                      </>
                    ) : (
                      <>
                        {mode === "create" ? "Add Department" : "Save Changes"}{" "}
                        <ChevronRight size={13} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {limitError && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,

            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(4px)",

            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <div
            style={{
              background: t.cardBg,
              borderRadius: 20,
              padding: "32px 28px",

              maxWidth: 420,
              width: "100%",
              textAlign: "center",

              border: `1px solid ${t.border}`,
              boxShadow: t.shadowHov,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",

                background: "rgba(244,63,94,0.1)",
                border: "1.5px solid rgba(244,63,94,0.3)",

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                margin: "0 auto 16px",
              }}
            >
              <Building2 size={24} color="#f43f5e" />
            </div>

            <p
              style={{
                fontSize: 16,
                fontWeight: 800,
                color: t.text,

                fontFamily: "'Poppins',sans-serif",
                margin: "0 0 8px",
              }}
            >
              Department Limit Reached
            </p>

            <p
              style={{
                fontSize: 12,
                color: t.textSub,
                fontFamily: "'Poppins',sans-serif",

                margin: "0 0 20px",
                lineHeight: 1.6,
              }}
            >
              {limitError}. Please contact your Super Admin to upgrade your
              plan.
            </p>

            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button
                onClick={() => setLimitError(null)}
                style={{
                  padding: "9px 22px",
                  borderRadius: 10,

                  border: `1px solid ${t.border}`,
                  background: t.actBg,

                  color: t.textSub,
                  fontSize: 12,
                  fontWeight: 600,

                  cursor: "pointer",
                  fontFamily: "'Poppins',sans-serif",
                }}
              >
                Close
              </button>

              <button
                onClick={() => setLimitError(null)}
                style={{
                  padding: "9px 22px",
                  borderRadius: 10,
                  border: "none",

                  background: "linear-gradient(135deg,#f43f5e,#be123c)",

                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 700,

                  cursor: "pointer",
                  fontFamily: "'Poppins',sans-serif",

                  boxShadow: "0 4px 14px rgba(244,63,94,0.35)",
                }}
              >
                Upgrade Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DepartmentList;