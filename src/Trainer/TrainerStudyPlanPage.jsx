import { useState, useEffect } from "react";
import {
  BookOpen,
  ClipboardList,
  Plus,
  Pencil,
  Eye,
  Target,
  Users,
  Calendar,
  X,
  Trash2,
  Play,
  Pause,
  Trophy,
  CheckCircle2,
  PauseCircle,
  Rocket,
  Code2,
  Coffee,
  Database,
  Puzzle,
  Zap,
  Lightbulb,
  Flame,
  FileText,
} from "lucide-react";
import {
  createStudyPlan,
  getMyStudyPlans,
  getStudyPlanById,
  updateStudyPlan,
  deleteStudyPlan,
  toggleStudyPlanActive,
  getMyProblems,
} from "../services/assessmentService";
import { getTrainerBatches } from "../services/batchService";

// Same shared light/dark token set the Dashboard page reads from — reused
// here so this page follows the app's theme toggle exactly the same way.
import { T } from "@/design-system";

/* ─── brand / theme ──────────────────────────────────────────
   Single source of truth for the header color. Update NAVBAR
   below to match your outer app navbar's exact hex and every
   themed element in this page (header, active tab, primary
   buttons) stays in sync automatically.                        */
const BRAND = {
  navbar: "#181818", // exact color sampled from the app's top navbar
  accent: "#f59e0b",
};

/* ─── colour presets ─────────────────────────────────── */
const COLORS = [
  "#6366f1",
  "#3b82f6",
  "#0ea5e9",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
];

/* Real icon set for study plans (replaces the old emoji picker).
   Each plan stores the short `key` string (e.g. "book") instead of
   an emoji character. ICON_MAP resolves a key to its component so
   it can be rendered anywhere the plan's icon is shown. */
const ICON_MAP = {
  book: BookOpen,
  rocket: Rocket,
  code: Code2,
  coffee: Coffee,
  database: Database,
  puzzle: Puzzle,
  zap: Zap,
  target: Target,
  bulb: Lightbulb,
  flame: Flame,
};
const ICONS = Object.keys(ICON_MAP); // ["book","rocket","code","coffee","database","puzzle","zap","target","bulb","flame"]

/* Resolves a plan's icon (a key like "book") to its real component.
   Falls back to BookOpen for any older records still holding an emoji. */
const PlanIcon = ({ iconKey, ...props }) => {
  const Cmp = ICON_MAP[iconKey] || BookOpen;
  return <Cmp {...props} />;
};

const emptyPlan = {
  title: "",
  description: "",
  batchId: "",
  thumbnailColor: "#6366f1",
  icon: "book",
  dueDate: "",
  sections: [],
};

const emptySection = { title: "", description: "", orderIndex: 0, items: [] };

export default function TrainerStudyPlanPage() {
  const [tab, setTab] = useState("plans"); // plans | create | detail
  const [plans, setPlans] = useState([]);
  const [problems, setProblems] = useState([]);
  const [batches, setBatches] = useState([]);
  const [formData, setFormData] = useState(emptyPlan);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null); // for detail view
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // ── light/dark theme — identical detection pattern to the Dashboard
  // page, so this page's theme flips in sync with the rest of the app
  // (watches <html> for the "dark" class / data-theme attribute).
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
  const S = getStyles(t, isDark);

  useEffect(() => {
    fetchPlans();
    fetchProblems();
    fetchBatches();
  }, []);

  const flash = (msg, isErr = false) => {
    if (isErr) setErrorMsg(msg);
    else setSuccessMsg(msg);
    setTimeout(() => {
      setSuccessMsg("");
      setErrorMsg("");
    }, 3500);
  };

  const fetchPlans = async () => {
    try {
      const r = await getMyStudyPlans();
      setPlans(r.data || []);
    } catch {
      setPlans([]);
    }
  };

  const fetchProblems = async () => {
    try {
      const r = await getMyProblems();
      setProblems(r.data || []);
    } catch {
      setProblems([]);
    }
  };

  const fetchBatches = async () => {
    try {
      const d = await getTrainerBatches();
      setBatches(Array.isArray(d) ? d : []);
    } catch {
      setBatches([]);
    }
  };

  /* ── Section helpers ─────────────────────────────────── */
  const addSection = () => {
    setFormData((p) => ({
      ...p,
      sections: [
        ...p.sections,
        { ...emptySection, orderIndex: p.sections.length, items: [] },
      ],
    }));
  };

  const removeSection = (si) =>
    setFormData((p) => ({
      ...p,
      sections: p.sections
        .filter((_, i) => i !== si)
        .map((s, i) => ({ ...s, orderIndex: i })),
    }));

  const updateSection = (si, field, val) =>
    setFormData((p) => {
      const secs = [...p.sections];
      secs[si] = { ...secs[si], [field]: val };
      return { ...p, sections: secs };
    });

  /* ── Item helpers ────────────────────────────────────── */
  const addItemToSection = (si, problemId) => {
    const problem = problems.find((p) => p.id === Number(problemId));
    if (!problem) return;
    setFormData((p) => {
      const secs = [...p.sections];
      const already = secs[si].items.some((it) => it.problemId === problem.id);
      if (already) return p;
      secs[si] = {
        ...secs[si],
        items: [
          ...secs[si].items,
          {
            problemId: problem.id,
            orderIndex: secs[si].items.length,
          },
        ],
      };
      return { ...p, sections: secs };
    });
  };

  const removeItemFromSection = (si, ii) =>
    setFormData((p) => {
      const secs = [...p.sections];
      secs[si] = {
        ...secs[si],
        items: secs[si].items
          .filter((_, i) => i !== ii)
          .map((it, i) => ({ ...it, orderIndex: i })),
      };
      return { ...p, sections: secs };
    });

  /* ── Save ────────────────────────────────────────────── */
  const handleSave = async () => {
    if (!formData.title.trim()) {
      flash("Title is required.", true);
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...formData,
        batchId: formData.batchId ? Number(formData.batchId) : null,
      };
      if (editingId) {
        await updateStudyPlan(editingId, payload);
        flash("Study plan updated!");
      } else {
        await createStudyPlan(payload);
        flash("Study plan created!");
      }
      setFormData(emptyPlan);
      setEditingId(null);
      setTab("plans");
      fetchPlans();
    } catch (e) {
      flash(e.response?.data?.message || "Save failed.", true);
    } finally {
      setSaving(false);
    }
  };

  const startEdit = async (plan) => {
    try {
      const r = await getStudyPlanById(plan.id);
      const p = r.data;
      setFormData({
        title: p.title || "",
        description: p.description || "",
        batchId: p.batchId ? String(p.batchId) : "",
        thumbnailColor: p.thumbnailColor || "#6366f1",
        icon: p.icon && ICON_MAP[p.icon] ? p.icon : "book",
        dueDate: p.dueDate ? p.dueDate.substring(0, 16) : "",
        sections: (p.sections || []).map((s) => ({
          title: s.title,
          description: s.description || "",
          orderIndex: s.orderIndex,
          items: (s.items || []).map((it) => ({
            problemId: it.problemId,
            orderIndex: it.orderIndex,
          })),
        })),
      });
      setEditingId(p.id);
      setTab("create");
    } catch {
      flash("Could not load plan.", true);
    }
  };

  const viewDetail = async (plan) => {
    try {
      const r = await getStudyPlanById(plan.id);
      setSelectedPlan(r.data);
      setTab("detail");
    } catch {
      flash("Could not load plan.", true);
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleStudyPlanActive(id);
      flash("Plan status updated.");
      fetchPlans();
    } catch {
      flash("Failed to update.", true);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteStudyPlan(deleteConfirm);
      flash("Plan deleted.");
      fetchPlans();
      if (tab === "detail") setTab("plans");
    } catch {
      flash("Delete failed.", true);
    } finally {
      setDeleteConfirm(null);
    }
  };

  const getBatchName = (batchId) => {
    const b = batches.find(
      (b) =>
        (b.batchId || b.id) === batchId ||
        String(b.batchId || b.id) === String(batchId),
    );
    return b
      ? b.batchName || b.name || String(batchId)
      : String(batchId || "—");
  };

  const getProblemName = (problemId) => {
    const p = problems.find((p) => p.id === problemId);
    return p ? p.title : `Problem #${problemId}`;
  };

  const getProblemDiff = (problemId) => {
    const p = problems.find((p) => p.id === problemId);
    return p ? p.difficulty : "—";
  };

  const diffColor = (d) =>
    d === "EASY"
      ? {
          color: isDark ? "#4ade80" : "#16a34a",
          bg: isDark ? "rgba(22,163,74,0.15)" : "#dcfce7",
        }
      : d === "MEDIUM"
        ? {
            color: isDark ? "#fbbf24" : "#d97706",
            bg: isDark ? "rgba(217,119,6,0.15)" : "#fef3c7",
          }
        : {
            color: isDark ? "#f87171" : "#dc2626",
            bg: isDark ? "rgba(220,38,38,0.15)" : "#fee2e2",
          };

  /* ─────────────────────────────────────────────────────── */
  return (
    <div style={S.root} className="sp-root">
      {/* Responsive stylesheet — laptop / desktop / iPad / iPad mini /
          tablet / phone (incl. Pixel & iPhone) breakpoints. Uses
          !important only to win over this file's inline styles, and
          clamp()/vw-based sizing so 100% / 90% / 80% / 75% / 50%
          browser zoom scales everything together instead of one
          piece breaking layout before another. */}
      <style>{`
        .sp-root, .sp-root * { box-sizing: border-box; }

        .sp-header {
          flex-wrap: nowrap;
          height: 56px !important;
          min-height: 56px;
          padding-top: 0;
          padding-bottom: 0;
        }
        .sp-header-left {
          min-width: 0;
        }
        .sp-tabs {
          overflow-x: auto;
          -ms-overflow-style: none;
          scrollbar-width: none;
          flex: 1 1 auto;
          min-width: 0;
          justify-content: flex-end;
        }
        .sp-tabs::-webkit-scrollbar { display: none; }
        .sp-tab-btn { white-space: nowrap; flex-shrink: 0; }

        .sp-plan-grid {
          grid-template-columns: repeat(auto-fill, minmax(clamp(220px, 26vw, 300px), 1fr)) !important;
        }

        .sp-form-grid-2,
        .sp-form-row {
          display: grid !important;
          grid-template-columns: 1fr 1fr;
        }

        .sp-hero {
          flex-wrap: wrap;
        }

        .sp-card-footer,
        .sp-form-actions,
        .sp-actions-row {
          flex-wrap: wrap;
        }

        /* ≤1024px — iPads / small laptops */
        @media (max-width: 1024px) {
          .sp-content { padding-left: clamp(16px, 3vw, 24px) !important; padding-right: clamp(16px, 3vw, 24px) !important; }
        }

        /* ≤900px — landscape tablets / iPad mini */
        @media (max-width: 900px) {
          .sp-form-grid-2 { grid-template-columns: 1fr !important; }
        }

        /* ≤768px — portrait iPad / large phones */
        @media (max-width: 768px) {
          .sp-form-row { grid-template-columns: 1fr !important; row-gap: 20px; }
          .sp-hero { text-align: center; justify-content: center; }
          .sp-hero-meta { justify-content: center; }
        }

        /* ≤640px — small tablets / large phones (Pixel, iPhone Pro Max)
           The outer app shell renders a fixed sidebar-toggle (hamburger)
           button on top-left of the content area at this breakpoint.
           So on mobile we: (1) stack the "Study Plans" title and the
           tab bar into two separate, full-width rows instead of forcing
           them onto one cramped line, and (2) reserve left padding on
           the title row only, so that toggle never sits on top of our
           text. The tab row sits below it and is unaffected. */
        @media (max-width: 640px) {
          .sp-header {
            flex-direction: column;
            align-items: stretch;
            height: auto !important;
            min-height: 88px;
            padding: 0 !important;
          }
          .sp-header-left {
            height: 46px;
            flex-shrink: 0;
            padding: 0 14px 0 54px; /* 54px clears the outer hamburger toggle */
            box-sizing: border-box;
          }
          .sp-tabs {
            height: 42px;
            flex-shrink: 0;
            justify-content: flex-start;
            gap: 8px;
            padding: 0 14px;
            border-top: 1px solid rgba(255,255,255,0.08);
          }
          .sp-tab-btn { padding: 8px 12px !important; }
          .sp-logo-text { font-size: 14px !important; }
          .sp-page-title { font-size: 18px !important; flex-wrap: wrap; row-gap: 10px; }
          .sp-new-btn { margin-left: 0 !important; margin-top: 14px !important; width: 100%; justify-content: center; padding: 12px 18px !important; }
          .sp-plan-grid { grid-template-columns: 1fr !important; }
        }

        /* ≤480px — standard phones (iPhone, Pixel) */
        @media (max-width: 480px) {
          .sp-trainer-badge { display: none; }
          .sp-header-left { padding-left: 48px !important; }
          .sp-content { padding: 16px !important; }
          .sp-card-footer .sp-act-btn { flex: 1 1 auto; }
          .sp-modal { padding: 20px !important; }
          .sp-form-actions,
          .sp-actions-row { flex-direction: column-reverse; }
          .sp-form-actions button,
          .sp-actions-row .sp-act-btn { width: 100%; justify-content: center; }
        }

        /* ≤375px — iPhone SE / smallest phones */
        @media (max-width: 375px) {
          .sp-logo-text { font-size: 12px !important; }
          .sp-tab-btn { padding: 8px 10px !important; }
          .sp-hero-icon svg { width: 34px !important; height: 34px !important; }
        }
      `}</style>

      {/* DELETE MODAL */}
      {deleteConfirm && (
        <div style={S.overlay}>
          <div style={S.modal} className="sp-modal">
            <div style={S.modalTitle}>Delete Study Plan?</div>
            <div style={S.modalBody}>
              This will permanently delete the plan and all its sections.
              Student progress will also be removed.
            </div>
            <div style={S.modalActions}>
              <button
                style={S.cancelBtn}
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </button>
              <button style={S.dangerBtn} onClick={handleDelete}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div style={S.header} className="sp-header">
        <div style={S.headerLeft} className="sp-header-left">
          <BookOpen size={22} color="#f1f5f9" style={S.logoIcon} />
          <span style={S.logoText} className="sp-logo-text">
            Study Plans
          </span>
          <span style={S.trainerBadge} className="sp-trainer-badge">
            Trainer
          </span>
        </div>
        <div style={S.tabs} className="sp-tabs">
          {[
            {
              key: "plans",
              label: "My Plans",
              icon: <ClipboardList size={14} />,
            },
            {
              key: "create",
              label: editingId ? "Edit Plan" : "Create Plan",
              icon: editingId ? <Pencil size={14} /> : <Plus size={14} />,
            },
            ...(selectedPlan && tab === "detail"
              ? [
                  {
                    key: "detail",
                    label: "Plan Detail",
                    icon: <Eye size={14} />,
                  },
                ]
              : []),
          ].map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              style={{ ...S.tabBtn, ...(tab === key ? S.tabActive : {}) }}
              className="sp-tab-btn"
            >
              <span style={S.tabBtnInner}>
                {icon}
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* FLASH */}
      {successMsg && <div style={S.flashOk}>{successMsg}</div>}
      {errorMsg && <div style={S.flashErr}>{errorMsg}</div>}

      {/* ════════════════════════════════════════
          TAB: PLANS LIST
          ════════════════════════════════════════ */}
      {tab === "plans" && (
        <div style={S.content} className="sp-content">
          <div style={S.pageTitle} className="sp-page-title">
            My Study Plans
            <span style={S.countBadge}>{plans.length}</span>
            <button
              style={S.newBtn}
              className="sp-new-btn"
              onClick={() => {
                setFormData(emptyPlan);
                setEditingId(null);
                setTab("create");
              }}
            >
              <Plus size={14} style={{ marginRight: 4, verticalAlign: -2 }} />
              New Plan
            </button>
          </div>

          {plans.length === 0 ? (
            <div style={S.empty}>
              <BookOpen size={48} color="#cbd5e1" style={{ marginBottom: 12 }} />
              <div>No study plans yet. Create your first one!</div>
            </div>
          ) : (
            <div style={S.planGrid} className="sp-plan-grid">
              {plans.map((plan) => (
                <div key={plan.id} style={S.planCard}>
                  {/* Card header with color */}
                  <div
                    style={{
                      ...S.planCardHeader,
                      background: plan.thumbnailColor || "#6366f1",
                    }}
                  >
                    <span style={S.planCardIcon}>
                      <PlanIcon iconKey={plan.icon} size={32} color="#fff" />
                    </span>
                    <span
                      style={{
                        ...S.activeBadge,
                        background: plan.active ? "#dcfce7" : "#fee2e2",
                        color: plan.active ? "#16a34a" : "#dc2626",
                      }}
                    >
                      {plan.active ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div style={S.planCardBody}>
                    <div style={S.planCardTitle}>{plan.title}</div>
                    {plan.description && (
                      <div style={S.planCardDesc}>
                        {plan.description.slice(0, 90)}
                        {plan.description.length > 90 ? "…" : ""}
                      </div>
                    )}
                    <div style={S.planMeta}>
                      <span style={S.metaChip}>
                        <Target size={12} style={S.chipIcon} />
                        {plan.totalProblems} problems
                      </span>
                      {plan.batchId && (
                        <span style={S.metaChip}>
                          <Users size={12} style={S.chipIcon} />
                          {getBatchName(plan.batchId)}
                        </span>
                      )}
                    </div>
                    {plan.dueDate && (
                      <div style={S.dueDate}>
                        <Calendar
                          size={11}
                          style={{ verticalAlign: -2, marginRight: 4 }}
                        />
                        Due: {new Date(plan.dueDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  <div
                    style={S.planCardFooter}
                    className="sp-card-footer"
                  >
                    <button
                      style={S.actBtn}
                      className="sp-act-btn"
                      onClick={() => viewDetail(plan)}
                    >
                      <Eye size={13} style={S.btnIcon} />
                      View
                    </button>
                    <button
                      style={S.actBtn}
                      className="sp-act-btn"
                      onClick={() => startEdit(plan)}
                    >
                      <Pencil size={13} style={S.btnIcon} />
                      Edit
                    </button>
                    <button
                      style={{
                        ...S.actBtn,
                        color: plan.active ? "#d97706" : "#16a34a",
                      }}
                      className="sp-act-btn"
                      onClick={() => handleToggle(plan.id)}
                    >
                      {plan.active ? (
                        <Pause size={13} style={S.btnIcon} />
                      ) : (
                        <Play size={13} style={S.btnIcon} />
                      )}
                      {plan.active ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      style={{ ...S.actBtn, color: "#dc2626" }}
                      className="sp-act-btn"
                      onClick={() => setDeleteConfirm(plan.id)}
                    >
                      <Trash2 size={13} style={S.btnIcon} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════
          TAB: CREATE / EDIT
          ════════════════════════════════════════ */}
      {tab === "create" && (
        <div style={S.content} className="sp-content">
          <div style={S.pageTitle} className="sp-page-title">
            {editingId ? (
              <Pencil size={18} style={S.titleIcon} />
            ) : (
              <Plus size={18} style={S.titleIcon} />
            )}
            {editingId ? "Edit Study Plan" : "Create Study Plan"}
          </div>

          <div style={S.form}>
            {/* Basic info */}
            <div style={S.formSection}>
              <div style={S.formSectionTitle}>Plan Details</div>
              <div style={S.formGrid2} className="sp-form-grid-2">
                <div style={S.formGroup}>
                  <label style={S.label}>Title *</label>
                  <div style={S.inputWrap}>
                    <BookOpen size={15} style={S.inputIcon} />
                    <input
                      style={S.inputWithIcon}
                      value={formData.title}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, title: e.target.value }))
                      }
                      placeholder="e.g. Python Fundamentals"
                    />
                  </div>
                </div>
                <div style={S.formGroup}>
                  <label style={S.label}>Assign to Batch</label>
                  <div style={S.inputWrap}>
                    <Users size={15} style={S.inputIcon} />
                    <select
                      style={S.inputWithIcon}
                      value={formData.batchId}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, batchId: e.target.value }))
                      }
                    >
                      <option value="">-- Select Batch (optional) --</option>
                      {batches.map((b) => (
                        <option key={b.batchId || b.id} value={b.batchId || b.id}>
                          {b.batchName || b.name || b.batchId || b.id}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div style={{ ...S.formGroup, gridColumn: "1 / -1" }}>
                  <label style={S.label}>Description</label>
                  <div style={S.inputWrap}>
                    <FileText size={15} style={S.inputIconTextarea} />
                    <textarea
                      style={{ ...S.inputWithIcon, resize: "vertical" }}
                      rows={3}
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          description: e.target.value,
                        }))
                      }
                      placeholder="What will students learn from this plan?"
                    />
                  </div>
                </div>
                <div style={S.formGroup}>
                  <label style={S.label}>Due Date (optional)</label>
                  <div style={S.inputWrap}>
                    <Calendar size={15} style={S.inputIcon} />
                    <input
                      style={S.inputWithIcon}
                      type="datetime-local"
                      value={formData.dueDate}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, dueDate: e.target.value }))
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Icon + Color pickers */}
              <div style={S.formRow} className="sp-form-row">
                <div style={S.formGroup}>
                  <label style={S.label}>Icon</label>
                  <div style={S.iconGrid}>
                    {ICONS.map((ic) => (
                      <button
                        key={ic}
                        style={{
                          ...S.iconBtn,
                          ...(formData.icon === ic ? S.iconBtnActive : {}),
                        }}
                        onClick={() => setFormData((p) => ({ ...p, icon: ic }))}
                      >
                        <PlanIcon
                          iconKey={ic}
                          size={18}
                          color={formData.icon === ic ? "#6366f1" : "#475569"}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div style={S.formGroup}>
                  <label style={S.label}>Card Color</label>
                  <div style={S.colorGrid}>
                    {COLORS.map((c) => (
                      <button
                        key={c}
                        style={{
                          ...S.colorBtn,
                          background: c,
                          ...(formData.thumbnailColor === c
                            ? S.colorBtnActive
                            : {}),
                        }}
                        onClick={() =>
                          setFormData((p) => ({ ...p, thumbnailColor: c }))
                        }
                      />
                    ))}
                  </div>
                  {/* Preview */}
                  <div
                    style={{
                      marginTop: 10,
                      background: formData.thumbnailColor,
                      borderRadius: 10,
                      padding: "12px 16px",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: 14,
                    }}
                  >
                    <PlanIcon iconKey={formData.icon} size={22} color="#fff" />
                    {formData.title || "Your Plan Title"}
                  </div>
                </div>
              </div>
            </div>

            {/* Sections */}
            <div style={S.formSection}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                  flexWrap: "wrap",
                  gap: 10,
                }}
              >
                <div style={S.formSectionTitle}>Sections & Problems</div>
                <button style={S.addSectionBtn} onClick={addSection}>
                  <Plus size={14} style={{ marginRight: 4, verticalAlign: -2 }} />
                  Add Section
                </button>
              </div>

              {formData.sections.length === 0 && (
                <div style={S.emptySections}>
                  No sections yet. Click "Add Section" to start building your
                  plan.
                </div>
              )}

              {formData.sections.map((section, si) => (
                <div key={si} style={S.sectionCard}>
                  <div style={S.sectionHeader}>
                    <span style={S.sectionNum}>Section {si + 1}</span>
                    <button
                      style={S.removeSectionBtn}
                      onClick={() => removeSection(si)}
                    >
                      <X size={12} style={{ marginRight: 3, verticalAlign: -1 }} />
                      Remove
                    </button>
                  </div>

                  <div style={S.formGrid2} className="sp-form-grid-2">
                    <div style={S.formGroup}>
                      <label style={S.label}>Section Title *</label>
                      <input
                        style={S.input}
                        value={section.title}
                        onChange={(e) =>
                          updateSection(si, "title", e.target.value)
                        }
                        placeholder="e.g. Variables & Data Types"
                      />
                    </div>
                    <div style={S.formGroup}>
                      <label style={S.label}>Description</label>
                      <input
                        style={S.input}
                        value={section.description}
                        onChange={(e) =>
                          updateSection(si, "description", e.target.value)
                        }
                        placeholder="Optional section description"
                      />
                    </div>
                  </div>

                  {/* Problems in this section */}
                  <div style={{ marginTop: 12 }}>
                    <label style={S.label}>Problems in this section</label>

                    {section.items.length > 0 && (
                      <div style={S.itemList}>
                        {section.items.map((item, ii) => {
                          const diff = diffColor(
                            getProblemDiff(item.problemId),
                          );
                          return (
                            <div key={ii} style={S.itemRow}>
                              <span style={S.itemNum}>{ii + 1}</span>
                              <span style={S.itemTitle}>
                                {getProblemName(item.problemId)}
                              </span>
                              <span
                                style={{
                                  ...S.diffBadge,
                                  color: diff.color,
                                  background: diff.bg,
                                }}
                              >
                                {getProblemDiff(item.problemId)}
                              </span>
                              <button
                                style={S.removeItemBtn}
                                onClick={() => removeItemFromSection(si, ii)}
                              >
                                <X size={14} />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                      <select
                        style={{ ...S.input, flex: 1 }}
                        onChange={(e) => {
                          if (e.target.value)
                            addItemToSection(si, e.target.value);
                          e.target.value = "";
                        }}
                        defaultValue=""
                      >
                        <option value="">+ Add problem to this section…</option>
                        {problems
                          .filter(
                            (p) =>
                              !section.items.some(
                                (it) => it.problemId === p.id,
                              ),
                          )
                          .map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.title} ({p.difficulty})
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div style={S.formActions} className="sp-form-actions">
              <button
                style={S.cancelBtn}
                onClick={() => {
                  setTab("plans");
                  setEditingId(null);
                }}
              >
                Cancel
              </button>
              <button style={S.saveBtn} onClick={handleSave} disabled={saving}>
                {saving ? "Saving…" : editingId ? "Update Plan" : "Create Plan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════
          TAB: DETAIL VIEW
          ════════════════════════════════════════ */}
      {tab === "detail" && selectedPlan && (
        <div style={S.content} className="sp-content">
          {/* Plan hero */}
          <div
            style={{
              ...S.planHero,
              background: selectedPlan.thumbnailColor || "#6366f1",
            }}
            className="sp-hero"
          >
            <div style={S.heroIcon} className="sp-hero-icon">
              <PlanIcon iconKey={selectedPlan.icon} size={44} color="#fff" />
            </div>
            <div>
              <div style={S.heroTitle}>{selectedPlan.title}</div>
              {selectedPlan.description && (
                <div style={S.heroDesc}>{selectedPlan.description}</div>
              )}
              <div style={S.heroMeta} className="sp-hero-meta">
                <span style={S.heroBadge}>
                  <Target size={13} style={S.chipIcon} />
                  {selectedPlan.totalProblems} Problems
                </span>
                {selectedPlan.batchId && (
                  <span style={S.heroBadge}>
                    <Users size={13} style={S.chipIcon} />
                    {getBatchName(selectedPlan.batchId)}
                  </span>
                )}
                {selectedPlan.dueDate && (
                  <span style={S.heroBadge}>
                    <Calendar size={13} style={S.chipIcon} />
                    Due {new Date(selectedPlan.dueDate).toLocaleDateString()}
                  </span>
                )}
                <span
                  style={{
                    ...S.heroBadge,
                    background: selectedPlan.active ? "#dcfce7" : "#fee2e2",
                    color: selectedPlan.active ? "#16a34a" : "#dc2626",
                  }}
                >
                  {selectedPlan.active ? (
                    <CheckCircle2 size={13} style={S.chipIcon} />
                  ) : (
                    <PauseCircle size={13} style={S.chipIcon} />
                  )}
                  {selectedPlan.active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>

          {/* Actions row */}
          <div style={S.actionsRow} className="sp-actions-row">
            <button
              style={S.actBtn}
              className="sp-act-btn"
              onClick={() => startEdit(selectedPlan)}
            >
              <Pencil size={13} style={S.btnIcon} />
              Edit Plan
            </button>
            <button
              style={{
                ...S.actBtn,
                color: selectedPlan.active ? "#d97706" : "#16a34a",
              }}
              className="sp-act-btn"
              onClick={() => handleToggle(selectedPlan.id)}
            >
              {selectedPlan.active ? (
                <Pause size={13} style={S.btnIcon} />
              ) : (
                <Play size={13} style={S.btnIcon} />
              )}
              {selectedPlan.active ? "Deactivate" : "Activate"}
            </button>
            <button
              style={{ ...S.actBtn, color: "#dc2626" }}
              className="sp-act-btn"
              onClick={() => setDeleteConfirm(selectedPlan.id)}
            >
              <Trash2 size={13} style={S.btnIcon} />
              Delete
            </button>
          </div>

          {/* Sections */}
          {(selectedPlan.sections || []).length === 0 ? (
            <div style={S.empty}>No sections in this plan yet.</div>
          ) : (
            (selectedPlan.sections || []).map((section, si) => (
              <div key={section.id} style={S.detailSection}>
                <div style={S.detailSectionHeader}>
                  <span style={S.detailSectionNum}>Section {si + 1}</span>
                  <span style={S.detailSectionTitle}>{section.title}</span>
                  <span style={S.countBadge}>
                    {section.items.length} problems
                  </span>
                </div>
                {section.description && (
                  <div style={S.detailSectionDesc}>{section.description}</div>
                )}
                <div style={S.detailItemList}>
                  {(section.items || []).map((item, ii) => {
                    const diff = diffColor(item.problemDifficulty);
                    return (
                      <div key={item.id} style={S.detailItem}>
                        <span style={S.detailItemNum}>{ii + 1}</span>
                        <span style={S.detailItemTitle}>
                          {item.problemTitle}
                        </span>
                        <span
                          style={{
                            ...S.diffBadge,
                            color: diff.color,
                            background: diff.bg,
                          }}
                        >
                          {item.problemDifficulty}
                        </span>
                        <span style={S.marksBadge}>
                          <Trophy size={11} style={S.chipIcon} />
                          {item.problemTotalMarks} pts
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Styles ──────────────────────────────────────────────── */
// Theme-aware — takes the shared `t` token set (T.light / T.dark from
// @/design-system, same as the Dashboard page) plus `isDark`, and
// returns the style object. Called fresh each render as
// `const S = getStyles(t, isDark);` so every color here flips with the
// app-wide theme toggle. The header stays BRAND.navbar in both themes
// since the outer app navbar itself doesn't change color.
function getStyles(t, isDark) {
  const surfaceMuted = isDark ? "rgba(255,255,255,0.03)" : "#f8fafc";
  const surfaceMutedBorder = isDark ? "rgba(255,255,255,0.10)" : "#e2e8f0";
  const chipBg = isDark ? "rgba(255,255,255,0.06)" : "#f1f5f9";
  const inputBg = isDark ? "rgba(255,255,255,0.04)" : "#f8fafc";
  const inputBorder = isDark ? "rgba(255,255,255,0.14)" : "#e2e8f0";

  return {
    root: {
      minHeight: "100vh",
      width: "100%",
      background: t.pageBg,
      color: t.text,
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      display: "flex",
      flexDirection: "column",
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 clamp(14px, 3vw, 24px)",
      minHeight: 56,
      background: BRAND.navbar,
      borderBottom: "1px solid #2a2a2a",
      flexShrink: 0,
      width: "100%",
    },
    headerLeft: { display: "flex", alignItems: "center", gap: 10, flexShrink: 1, minWidth: 0, marginRight: 12 },
    logoIcon: { flexShrink: 0 },
    logoText: {
      fontSize: "clamp(13px, 1.4vw, 16px)",
      fontWeight: 700,
      color: "#f1f5f9",
      letterSpacing: 0.5,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    trainerBadge: {
      fontSize: 11,
      background: `${BRAND.accent}22`,
      color: BRAND.accent,
      border: `1px solid ${BRAND.accent}`,
      borderRadius: 20,
      padding: "2px 10px",
      fontWeight: 600,
      whiteSpace: "nowrap",
      flexShrink: 0,
    },
    tabs: { display: "flex", gap: 4 },
    tabBtn: {
      background: "none",
      border: "none",
      color: "#94a3b8",
      padding: "8px 14px",
      borderRadius: 6,
      cursor: "pointer",
      fontSize: 13,
      fontFamily: "inherit",
    },
    tabBtnInner: { display: "flex", alignItems: "center", gap: 6 },
    tabActive: { background: "#2a2a2a", color: "#f1f5f9", fontWeight: 600 },
    flashOk: {
      background: isDark ? "rgba(22,163,74,0.15)" : "#dcfce7",
      color: isDark ? "#4ade80" : "#16a34a",
      border: `1px solid ${isDark ? "rgba(22,163,74,0.35)" : "#bbf7d0"}`,
      padding: "10px 24px",
      fontSize: 13,
      textAlign: "center",
    },
    flashErr: {
      background: isDark ? "rgba(220,38,38,0.15)" : "#fee2e2",
      color: isDark ? "#f87171" : "#dc2626",
      border: `1px solid ${isDark ? "rgba(220,38,38,0.35)" : "#fecaca"}`,
      padding: "10px 24px",
      fontSize: 13,
      textAlign: "center",
    },
    content: {
      flex: 1,
      padding: "clamp(18px, 3vw, 28px) clamp(18px, 4vw, 32px)",
      width: "100%",
      maxWidth: "1920px",
      margin: "0 auto",
    },
    pageTitle: {
      fontSize: "clamp(18px, 2vw, 22px)",
      fontWeight: 800,
      marginBottom: 24,
      display: "flex",
      alignItems: "center",
      gap: 12,
      color: t.text,
    },
    titleIcon: { flexShrink: 0 },
    countBadge: {
      background: chipBg,
      color: t.textMuted,
      borderRadius: 20,
      padding: "2px 12px",
      fontSize: 13,
      fontWeight: 600,
    },
    newBtn: {
      marginLeft: "auto",
      background: BRAND.navbar,
      color: "#fff",
      border: "none",
      borderRadius: 8,
      padding: "8px 18px",
      cursor: "pointer",
      fontWeight: 700,
      fontSize: 13,
      fontFamily: "inherit",
      display: "inline-flex",
      alignItems: "center",
    },
    empty: {
      color: t.textMuted,
      textAlign: "center",
      padding: "60px 0",
      fontSize: 15,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    planGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
      gap: 20,
      width: "100%",
    },
    planCard: {
      background: t.cardBg,
      border: `1px solid ${t.border}`,
      borderRadius: 14,
      overflow: "hidden",
      boxShadow: t.shadow,
      display: "flex",
      flexDirection: "column",
    },
    planCardHeader: {
      height: 90,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 16px",
    },
    planCardIcon: { fontSize: 36 },
    activeBadge: {
      fontSize: 11,
      borderRadius: 20,
      padding: "3px 10px",
      fontWeight: 700,
    },
    planCardBody: { padding: "14px 16px", flex: 1 },
    planCardTitle: {
      fontSize: 15,
      fontWeight: 800,
      color: t.text,
      marginBottom: 6,
    },
    planCardDesc: {
      fontSize: 12,
      color: t.textMuted,
      lineHeight: 1.5,
      marginBottom: 10,
    },
    planMeta: { display: "flex", gap: 8, flexWrap: "wrap" },
    metaChip: {
      fontSize: 11,
      background: chipBg,
      color: t.textSub,
      borderRadius: 20,
      padding: "2px 8px",
      fontWeight: 600,
      display: "inline-flex",
      alignItems: "center",
    },
    chipIcon: { marginRight: 4, verticalAlign: -2 },
    dueDate: { fontSize: 11, color: t.textMuted, marginTop: 6 },
    planCardFooter: {
      display: "flex",
      gap: 6,
      padding: "12px 16px",
      borderTop: `1px solid ${t.border}`,
      flexWrap: "wrap",
    },
    // Form
    form: {
      display: "flex",
      flexDirection: "column",
      gap: 24,
      width: "100%",
    },
    formSection: {
      background: t.cardBg,
      border: `1px solid ${t.border}`,
      borderRadius: 12,
      padding: "clamp(16px, 2.5vw, 24px)",
      boxShadow: t.shadow,
    },
    formSectionTitle: {
      fontSize: 15,
      fontWeight: 800,
      color: t.text,
      marginBottom: 16,
      paddingBottom: 10,
      borderBottom: `1px solid ${t.border}`,
    },
    formGrid2: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 16,
      marginBottom: 16,
    },
    formRow: { display: "flex", gap: 24, flexWrap: "wrap" },
    formGroup: { display: "flex", flexDirection: "column", gap: 6, flex: 1 },
    label: {
      fontSize: 11,
      fontWeight: 700,
      color: t.textMuted,
      textTransform: "uppercase",
      letterSpacing: 0.6,
    },
    // Base input — used directly for the icon-less controls, and spread
    // into `inputWithIcon` below for the ones that carry a leading icon
    // (Title / Batch / Description / Due date), matching the reference UI.
    input: {
      background: inputBg,
      border: `1px solid ${inputBorder}`,
      color: t.text,
      borderRadius: 8,
      padding: "10px 12px",
      fontSize: 13,
      fontFamily: "inherit",
      outline: "none",
      width: "100%",
      boxSizing: "border-box",
    },
    inputWrap: { position: "relative", width: "100%" },
    inputIcon: {
      position: "absolute",
      left: 12,
      top: 12,
      color: t.textMuted,
      pointerEvents: "none",
      display: "flex",
    },
    inputIconTextarea: {
      position: "absolute",
      left: 12,
      top: 12,
      color: t.textMuted,
      pointerEvents: "none",
      display: "flex",
    },
    inputWithIcon: {
      background: inputBg,
      border: `1px solid ${inputBorder}`,
      color: t.text,
      borderRadius: 8,
      padding: "10px 12px 10px 38px",
      fontSize: 13,
      fontFamily: "inherit",
      outline: "none",
      width: "100%",
      boxSizing: "border-box",
    },
    iconGrid: { display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4 },
    iconBtn: {
      width: 42,
      height: 42,
      background: chipBg,
      border: "2px solid transparent",
      borderRadius: 10,
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
    iconBtnActive: {
      border: "2px solid #6366f1",
      background: isDark ? "rgba(99,102,241,0.18)" : "#eef2ff",
    },
    colorGrid: { display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4 },
    colorBtn: {
      width: 32,
      height: 32,
      borderRadius: "50%",
      border: "3px solid transparent",
      cursor: "pointer",
    },
    colorBtnActive: { border: `3px solid ${t.text}` },
    // Sections in form
    emptySections: {
      textAlign: "center",
      padding: "32px 0",
      color: t.textMuted,
      fontSize: 14,
      background: surfaceMuted,
      borderRadius: 8,
      border: `1px dashed ${surfaceMutedBorder}`,
    },
    addSectionBtn: {
      background: BRAND.navbar,
      color: "#fff",
      border: "none",
      borderRadius: 8,
      padding: "8px 16px",
      cursor: "pointer",
      fontWeight: 700,
      fontSize: 13,
      fontFamily: "inherit",
      display: "inline-flex",
      alignItems: "center",
    },
    sectionCard: {
      background: surfaceMuted,
      border: `1px solid ${surfaceMutedBorder}`,
      borderRadius: 10,
      padding: "clamp(14px, 2vw, 18px)",
      marginBottom: 16,
    },
    sectionHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 14,
      flexWrap: "wrap",
      gap: 8,
    },
    sectionNum: {
      fontSize: 12,
      fontWeight: 800,
      color: isDark ? "#a5b4fc" : "#6366f1",
      textTransform: "uppercase",
      letterSpacing: 0.8,
    },
    removeSectionBtn: {
      background: isDark ? "rgba(220,38,38,0.15)" : "#fee2e2",
      color: isDark ? "#f87171" : "#dc2626",
      border: `1px solid ${isDark ? "rgba(220,38,38,0.35)" : "#fecaca"}`,
      borderRadius: 6,
      padding: "4px 10px",
      cursor: "pointer",
      fontSize: 12,
      fontFamily: "inherit",
      fontWeight: 600,
      display: "inline-flex",
      alignItems: "center",
    },
    itemList: {
      display: "flex",
      flexDirection: "column",
      gap: 6,
      marginBottom: 8,
    },
    itemRow: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      background: t.cardBg,
      border: `1px solid ${t.border}`,
      borderRadius: 8,
      padding: "8px 12px",
      flexWrap: "wrap",
    },
    itemNum: { color: t.textMuted, fontSize: 12, fontWeight: 700, minWidth: 20 },
    itemTitle: { flex: 1, fontSize: 13, fontWeight: 600, color: t.text },
    diffBadge: {
      fontSize: 10,
      borderRadius: 20,
      padding: "2px 8px",
      fontWeight: 700,
    },
    removeItemBtn: {
      background: "none",
      border: "none",
      color: isDark ? "#f87171" : "#dc2626",
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
    },
    // Buttons
    actBtn: {
      background: chipBg,
      color: t.textSub,
      border: `1px solid ${t.border}`,
      padding: "6px 12px",
      borderRadius: 6,
      cursor: "pointer",
      fontSize: 12,
      fontFamily: "inherit",
      fontWeight: 600,
      display: "inline-flex",
      alignItems: "center",
    },
    btnIcon: { marginRight: 5, verticalAlign: -2 },
    cancelBtn: {
      background: chipBg,
      color: t.textSub,
      border: `1px solid ${t.border}`,
      padding: "10px 24px",
      borderRadius: 8,
      cursor: "pointer",
      fontWeight: 700,
      fontSize: 14,
      fontFamily: "inherit",
    },
    saveBtn: {
      background: BRAND.navbar,
      color: "#fff",
      border: "none",
      padding: "10px 24px",
      borderRadius: 8,
      cursor: "pointer",
      fontWeight: 700,
      fontSize: 14,
      fontFamily: "inherit",
    },
    dangerBtn: {
      background: "#dc2626",
      color: "#fff",
      border: "none",
      padding: "10px 24px",
      borderRadius: 8,
      cursor: "pointer",
      fontWeight: 700,
      fontSize: 14,
      fontFamily: "inherit",
    },
    formActions: {
      display: "flex",
      gap: 12,
      justifyContent: "flex-end",
    },
    actionsRow: { display: "flex", gap: 10, marginBottom: 24 },
    // Detail view
    planHero: {
      borderRadius: 14,
      padding: "clamp(20px, 3vw, 28px)",
      display: "flex",
      alignItems: "flex-start",
      gap: 20,
      marginBottom: 20,
      color: "#fff",
      width: "100%",
    },
    heroIcon: { fontSize: "clamp(38px, 4vw, 48px)", flexShrink: 0 },
    heroTitle: { fontSize: "clamp(20px, 2.4vw, 24px)", fontWeight: 800, marginBottom: 6 },
    heroDesc: { fontSize: 13, opacity: 0.85, marginBottom: 12, lineHeight: 1.5 },
    heroMeta: { display: "flex", gap: 8, flexWrap: "wrap" },
    heroBadge: {
      fontSize: 12,
      background: "rgba(255,255,255,0.25)",
      color: "#fff",
      borderRadius: 20,
      padding: "3px 12px",
      fontWeight: 600,
      display: "inline-flex",
      alignItems: "center",
    },
    detailSection: {
      background: t.cardBg,
      border: `1px solid ${t.border}`,
      borderRadius: 12,
      marginBottom: 16,
      overflow: "hidden",
      boxShadow: t.shadow,
    },
    detailSectionHeader: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "14px 18px",
      background: surfaceMuted,
      borderBottom: `1px solid ${t.border}`,
      flexWrap: "wrap",
    },
    detailSectionNum: {
      fontSize: 11,
      fontWeight: 800,
      color: isDark ? "#a5b4fc" : "#6366f1",
      textTransform: "uppercase",
      letterSpacing: 0.8,
    },
    detailSectionTitle: {
      fontSize: 15,
      fontWeight: 700,
      color: t.text,
      flex: 1,
    },
    detailSectionDesc: { fontSize: 13, color: t.textMuted, padding: "10px 18px 0" },
    detailItemList: { padding: "10px 18px 18px" },
    detailItem: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "10px 0",
      borderBottom: `1px solid ${t.border}`,
      flexWrap: "wrap",
    },
    detailItemNum: {
      color: t.textMuted,
      fontSize: 12,
      fontWeight: 700,
      minWidth: 24,
    },
    detailItemTitle: { flex: 1, fontSize: 13, fontWeight: 600, color: t.text },
    marksBadge: {
      fontSize: 11,
      background: isDark ? "rgba(202,138,4,0.18)" : "#fefce8",
      color: isDark ? "#facc15" : "#ca8a04",
      border: `1px solid ${isDark ? "rgba(202,138,4,0.4)" : "#fde68a"}`,
      borderRadius: 20,
      padding: "2px 8px",
      fontWeight: 700,
      display: "inline-flex",
      alignItems: "center",
    },
    // Modal
    overlay: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: 16,
    },
    modal: {
      background: t.cardBg,
      borderRadius: 12,
      padding: 28,
      maxWidth: 420,
      width: "90%",
      boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 800,
      color: isDark ? "#f87171" : "#dc2626",
      marginBottom: 12,
    },
    modalBody: {
      fontSize: 14,
      color: t.textMuted,
      lineHeight: 1.6,
      marginBottom: 24,
    },
    modalActions: { display: "flex", gap: 12, justifyContent: "flex-end", flexWrap: "wrap" },
  };
}