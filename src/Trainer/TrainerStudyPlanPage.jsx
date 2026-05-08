import { useState, useEffect } from "react";
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
const ICONS = ["📘", "🚀", "🐍", "☕", "🗄️", "🧩", "⚡", "🎯", "💡", "🔥"];

const emptyPlan = {
  title: "",
  description: "",
  batchId: "",
  thumbnailColor: "#6366f1",
  icon: "📘",
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
        icon: p.icon || "📘",
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
      ? { color: "#16a34a", bg: "#dcfce7" }
      : d === "MEDIUM"
        ? { color: "#d97706", bg: "#fef3c7" }
        : { color: "#dc2626", bg: "#fee2e2" };

  /* ─────────────────────────────────────────────────────── */
  return (
    <div style={S.root}>
      {/* DELETE MODAL */}
      {deleteConfirm && (
        <div style={S.overlay}>
          <div style={S.modal}>
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
      <div style={S.header}>
        <div style={S.headerLeft}>
          <span style={S.logoIcon}>📚</span>
          <span style={S.logoText}>Study Plans</span>
          <span style={S.trainerBadge}>Trainer</span>
        </div>
        <div style={S.tabs}>
          {[
            { key: "plans", label: "📋 My Plans" },
            {
              key: "create",
              label: editingId ? "✏️ Edit Plan" : "➕ Create Plan",
            },
            ...(selectedPlan && tab === "detail"
              ? [{ key: "detail", label: "🔍 Plan Detail" }]
              : []),
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              style={{ ...S.tabBtn, ...(tab === key ? S.tabActive : {}) }}
            >
              {label}
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
        <div style={S.content}>
          <div style={S.pageTitle}>
            My Study Plans
            <span style={S.countBadge}>{plans.length}</span>
            <button
              style={S.newBtn}
              onClick={() => {
                setFormData(emptyPlan);
                setEditingId(null);
                setTab("create");
              }}
            >
              + New Plan
            </button>
          </div>

          {plans.length === 0 ? (
            <div style={S.empty}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📚</div>
              <div>No study plans yet. Create your first one!</div>
            </div>
          ) : (
            <div style={S.planGrid}>
              {plans.map((plan) => (
                <div key={plan.id} style={S.planCard}>
                  {/* Card header with color */}
                  <div
                    style={{
                      ...S.planCardHeader,
                      background: plan.thumbnailColor || "#6366f1",
                    }}
                  >
                    <span style={S.planCardIcon}>{plan.icon || "📘"}</span>
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
                        🎯 {plan.totalProblems} problems
                      </span>
                      {plan.batchId && (
                        <span style={S.metaChip}>
                          👥 {getBatchName(plan.batchId)}
                        </span>
                      )}
                    </div>
                    {plan.dueDate && (
                      <div style={S.dueDate}>
                        Due: {new Date(plan.dueDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  <div style={S.planCardFooter}>
                    <button style={S.actBtn} onClick={() => viewDetail(plan)}>
                      🔍 View
                    </button>
                    <button style={S.actBtn} onClick={() => startEdit(plan)}>
                      ✏️ Edit
                    </button>
                    <button
                      style={{
                        ...S.actBtn,
                        color: plan.active ? "#d97706" : "#16a34a",
                      }}
                      onClick={() => handleToggle(plan.id)}
                    >
                      {plan.active ? "⏸ Deactivate" : "▶ Activate"}
                    </button>
                    <button
                      style={{ ...S.actBtn, color: "#dc2626" }}
                      onClick={() => setDeleteConfirm(plan.id)}
                    >
                      🗑 Delete
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
        <div style={S.content}>
          <div style={S.pageTitle}>
            {editingId ? "✏️ Edit Study Plan" : "➕ Create Study Plan"}
          </div>

          <div style={S.form}>
            {/* Basic info */}
            <div style={S.formSection}>
              <div style={S.formSectionTitle}>Plan Details</div>
              <div style={S.formGrid2}>
                <div style={S.formGroup}>
                  <label style={S.label}>Title *</label>
                  <input
                    style={S.input}
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, title: e.target.value }))
                    }
                    placeholder="e.g. Python Fundamentals"
                  />
                </div>
                <div style={S.formGroup}>
                  <label style={S.label}>Assign to Batch</label>
                  <select
                    style={S.input}
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
                <div style={{ ...S.formGroup, gridColumn: "1 / -1" }}>
                  <label style={S.label}>Description</label>
                  <textarea
                    style={{ ...S.input, resize: "vertical" }}
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
                <div style={S.formGroup}>
                  <label style={S.label}>Due Date (optional)</label>
                  <input
                    style={S.input}
                    type="datetime-local"
                    value={formData.dueDate}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, dueDate: e.target.value }))
                    }
                  />
                </div>
              </div>

              {/* Icon + Color pickers */}
              <div style={S.formRow}>
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
                        {ic}
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
                    <span style={{ fontSize: 22 }}>{formData.icon}</span>
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
                }}
              >
                <div style={S.formSectionTitle}>Sections & Problems</div>
                <button style={S.addSectionBtn} onClick={addSection}>
                  + Add Section
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
                      ✕ Remove
                    </button>
                  </div>

                  <div style={S.formGrid2}>
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
                                ✕
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
            <div
              style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}
            >
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
        <div style={S.content}>
          {/* Plan hero */}
          <div
            style={{
              ...S.planHero,
              background: selectedPlan.thumbnailColor || "#6366f1",
            }}
          >
            <div style={S.heroIcon}>{selectedPlan.icon || "📘"}</div>
            <div>
              <div style={S.heroTitle}>{selectedPlan.title}</div>
              {selectedPlan.description && (
                <div style={S.heroDesc}>{selectedPlan.description}</div>
              )}
              <div style={S.heroMeta}>
                <span style={S.heroBadge}>
                  🎯 {selectedPlan.totalProblems} Problems
                </span>
                {selectedPlan.batchId && (
                  <span style={S.heroBadge}>
                    👥 {getBatchName(selectedPlan.batchId)}
                  </span>
                )}
                {selectedPlan.dueDate && (
                  <span style={S.heroBadge}>
                    📅 Due {new Date(selectedPlan.dueDate).toLocaleDateString()}
                  </span>
                )}
                <span
                  style={{
                    ...S.heroBadge,
                    background: selectedPlan.active ? "#dcfce7" : "#fee2e2",
                    color: selectedPlan.active ? "#16a34a" : "#dc2626",
                  }}
                >
                  {selectedPlan.active ? "✓ Active" : "⏸ Inactive"}
                </span>
              </div>
            </div>
          </div>

          {/* Actions row */}
          <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
            <button style={S.actBtn} onClick={() => startEdit(selectedPlan)}>
              ✏️ Edit Plan
            </button>
            <button
              style={{
                ...S.actBtn,
                color: selectedPlan.active ? "#d97706" : "#16a34a",
              }}
              onClick={() => handleToggle(selectedPlan.id)}
            >
              {selectedPlan.active ? "⏸ Deactivate" : "▶ Activate"}
            </button>
            <button
              style={{ ...S.actBtn, color: "#dc2626" }}
              onClick={() => setDeleteConfirm(selectedPlan.id)}
            >
              🗑 Delete
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
                          🏆 {item.problemTotalMarks} pts
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
const S = {
  root: {
    minHeight: "100vh",
    background: "#f8fafc",
    color: "#1e293b",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 24px",
    height: 56,
    background: "#0f172a",
    borderBottom: "1px solid #1e293b",
    flexShrink: 0,
  },
  headerLeft: { display: "flex", alignItems: "center", gap: 12 },
  logoIcon: { fontSize: 22 },
  logoText: {
    fontSize: 16,
    fontWeight: 700,
    color: "#f1f5f9",
    letterSpacing: 0.5,
  },
  trainerBadge: {
    fontSize: 11,
    background: "#f59e0b22",
    color: "#f59e0b",
    border: "1px solid #f59e0b",
    borderRadius: 20,
    padding: "2px 10px",
    fontWeight: 600,
  },
  tabs: { display: "flex", gap: 4 },
  tabBtn: {
    background: "none",
    border: "none",
    color: "#94a3b8",
    padding: "8px 16px",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 13,
    fontFamily: "inherit",
  },
  tabActive: { background: "#1e293b", color: "#f1f5f9", fontWeight: 600 },
  flashOk: {
    background: "#dcfce7",
    color: "#16a34a",
    border: "1px solid #bbf7d0",
    padding: "10px 24px",
    fontSize: 13,
    textAlign: "center",
  },
  flashErr: {
    background: "#fee2e2",
    color: "#dc2626",
    border: "1px solid #fecaca",
    padding: "10px 24px",
    fontSize: 13,
    textAlign: "center",
  },
  content: {
    flex: 1,
    padding: "28px 32px",
    maxWidth: 1100,
    width: "100%",
    margin: "0 auto",
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 800,
    marginBottom: 24,
    display: "flex",
    alignItems: "center",
    gap: 12,
    color: "#0f172a",
  },
  countBadge: {
    background: "#e2e8f0",
    color: "#64748b",
    borderRadius: 20,
    padding: "2px 12px",
    fontSize: 13,
    fontWeight: 600,
  },
  newBtn: {
    marginLeft: "auto",
    background: "#0f172a",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "8px 18px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 13,
    fontFamily: "inherit",
  },
  empty: {
    color: "#94a3b8",
    textAlign: "center",
    padding: "60px 0",
    fontSize: 15,
  },
  planGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: 20,
  },
  planCard: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: 14,
    overflow: "hidden",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
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
    color: "#0f172a",
    marginBottom: 6,
  },
  planCardDesc: {
    fontSize: 12,
    color: "#64748b",
    lineHeight: 1.5,
    marginBottom: 10,
  },
  planMeta: { display: "flex", gap: 8, flexWrap: "wrap" },
  metaChip: {
    fontSize: 11,
    background: "#f1f5f9",
    color: "#475569",
    borderRadius: 20,
    padding: "2px 8px",
    fontWeight: 600,
  },
  dueDate: { fontSize: 11, color: "#94a3b8", marginTop: 6 },
  planCardFooter: {
    display: "flex",
    gap: 6,
    padding: "12px 16px",
    borderTop: "1px solid #f1f5f9",
    flexWrap: "wrap",
  },
  // Form
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 24,
  },
  formSection: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    padding: 24,
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  },
  formSectionTitle: {
    fontSize: 15,
    fontWeight: 800,
    color: "#0f172a",
    marginBottom: 16,
    paddingBottom: 10,
    borderBottom: "1px solid #f1f5f9",
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
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  input: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    color: "#1e293b",
    borderRadius: 8,
    padding: "10px 12px",
    fontSize: 13,
    fontFamily: "inherit",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },
  iconGrid: { display: "flex", gap: 6, flexWrap: "wrap", marginTop: 4 },
  iconBtn: {
    background: "#f1f5f9",
    border: "2px solid transparent",
    borderRadius: 8,
    padding: "6px 10px",
    cursor: "pointer",
    fontSize: 18,
  },
  iconBtnActive: { border: "2px solid #6366f1", background: "#eef2ff" },
  colorGrid: { display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4 },
  colorBtn: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    border: "3px solid transparent",
    cursor: "pointer",
  },
  colorBtnActive: { border: "3px solid #0f172a" },
  // Sections in form
  emptySections: {
    textAlign: "center",
    padding: "32px 0",
    color: "#94a3b8",
    fontSize: 14,
    background: "#f8fafc",
    borderRadius: 8,
    border: "1px dashed #e2e8f0",
  },
  addSectionBtn: {
    background: "#0f172a",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "8px 16px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 13,
    fontFamily: "inherit",
  },
  sectionCard: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: 10,
    padding: 18,
    marginBottom: 16,
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionNum: {
    fontSize: 12,
    fontWeight: 800,
    color: "#6366f1",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  removeSectionBtn: {
    background: "#fee2e2",
    color: "#dc2626",
    border: "1px solid #fecaca",
    borderRadius: 6,
    padding: "4px 10px",
    cursor: "pointer",
    fontSize: 12,
    fontFamily: "inherit",
    fontWeight: 600,
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
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: 8,
    padding: "8px 12px",
  },
  itemNum: { color: "#94a3b8", fontSize: 12, fontWeight: 700, minWidth: 20 },
  itemTitle: { flex: 1, fontSize: 13, fontWeight: 600, color: "#0f172a" },
  diffBadge: {
    fontSize: 10,
    borderRadius: 20,
    padding: "2px 8px",
    fontWeight: 700,
  },
  removeItemBtn: {
    background: "none",
    border: "none",
    color: "#dc2626",
    cursor: "pointer",
    fontSize: 14,
    fontFamily: "inherit",
  },
  // Buttons
  actBtn: {
    background: "#f1f5f9",
    color: "#475569",
    border: "1px solid #e2e8f0",
    padding: "6px 12px",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 12,
    fontFamily: "inherit",
    fontWeight: 600,
  },
  cancelBtn: {
    background: "#f1f5f9",
    color: "#475569",
    border: "1px solid #e2e8f0",
    padding: "10px 24px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 14,
    fontFamily: "inherit",
  },
  saveBtn: {
    background: "#0f172a",
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
  // Detail view
  planHero: {
    borderRadius: 14,
    padding: "28px 28px",
    display: "flex",
    alignItems: "flex-start",
    gap: 20,
    marginBottom: 20,
    color: "#fff",
  },
  heroIcon: { fontSize: 48, flexShrink: 0 },
  heroTitle: { fontSize: 24, fontWeight: 800, marginBottom: 6 },
  heroDesc: { fontSize: 13, opacity: 0.85, marginBottom: 12, lineHeight: 1.5 },
  heroMeta: { display: "flex", gap: 8, flexWrap: "wrap" },
  heroBadge: {
    fontSize: 12,
    background: "rgba(255,255,255,0.25)",
    color: "#fff",
    borderRadius: 20,
    padding: "3px 12px",
    fontWeight: 600,
  },
  detailSection: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  },
  detailSectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "14px 18px",
    background: "#f8fafc",
    borderBottom: "1px solid #e2e8f0",
  },
  detailSectionNum: {
    fontSize: 11,
    fontWeight: 800,
    color: "#6366f1",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  detailSectionTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: "#0f172a",
    flex: 1,
  },
  detailSectionDesc: { fontSize: 13, color: "#64748b", padding: "10px 18px 0" },
  detailItemList: { padding: "10px 18px 18px" },
  detailItem: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 0",
    borderBottom: "1px solid #f1f5f9",
  },
  detailItemNum: {
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: 700,
    minWidth: 24,
  },
  detailItemTitle: { flex: 1, fontSize: 13, fontWeight: 600, color: "#0f172a" },
  marksBadge: {
    fontSize: 11,
    background: "#fefce8",
    color: "#ca8a04",
    border: "1px solid #fde68a",
    borderRadius: 20,
    padding: "2px 8px",
    fontWeight: 700,
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
  },
  modal: {
    background: "#fff",
    borderRadius: 12,
    padding: 28,
    maxWidth: 420,
    width: "90%",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 800,
    color: "#dc2626",
    marginBottom: 12,
  },
  modalBody: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 1.6,
    marginBottom: 24,
  },
  modalActions: { display: "flex", gap: 12, justifyContent: "flex-end" },
};
