import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import roadmapService from "../../services/roadmapService";
import RoadmapCard from "../../components/roadmap/RoadmapCard";
import "../../components/roadmap/roadmap-tokens.css";

/**
 * Super Admin · TemplateLibraryPage
 * Global roadmap-template catalogue. Templates are the org-agnostic blueprints
 * that org admins clone into their own orgs.
 *
 * Backend (all require SUPER_ADMIN — a non-super-admin caller gets 403):
 *   GET  /api/progress/roadmaps/admin/templates            -> PagedResponse<TemplateResponse>
 *   POST /api/progress/roadmaps/admin/templates            -> TemplateResponse
 *   GET  /api/progress/roadmaps/admin/templates/{id}       -> TemplateResponse (any, incl. drafts)
 *
 * SEAM — the list endpoint is PUBLISHED-ONLY (service uses
 * findByIsPublishedTrueAndIsArchivedFalse). There is no "list all templates
 * including drafts" endpoint, so a freshly-created draft will NOT appear in
 * this grid until it is published. getTemplate(id) DOES return drafts, so the
 * editor still works — we surface the seam with a note and an "Open by ID"
 * shortcut instead of pretending drafts are listed.
 *
 * TemplateResponse boolean JSON keys: "published", "archived" (Jackson from
 * isPublished()/isArchived()). nodeCount = totalNodes.
 */

const TEMPLATE_ROUTE = "/superadmin/roadmap-templates";

// Fallback categories if the catalogue is empty (so the filter bar isn't bare).
const FALLBACK_CATEGORIES = [
  "Frontend",
  "Backend",
  "DevOps",
  "Data",
  "Mobile",
  "Design",
];

export default function TemplateLibraryPage() {
  const navigate = useNavigate();

  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [forbidden, setForbidden] = useState(false);

  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [openId, setOpenId] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    setForbidden(false);
    try {
      const res = await roadmapService.listTemplates({ page: 0, size: 100 });
      setTemplates(res?.content || []);
    } catch (e) {
      if (e?.response?.status === 403) {
        setForbidden(true);
      } else {
        setError(readError(e, "Could not load the template library."));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const categories = useMemo(() => {
    const set = new Set();
    templates.forEach((t) => {
      if (t.category) set.add(t.category);
    });
    const derived = Array.from(set).sort((a, b) => a.localeCompare(b));
    return derived.length ? derived : FALLBACK_CATEGORIES;
  }, [templates]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return templates.filter((t) => {
      if (activeCategory !== "all" && (t.category || "") !== activeCategory) {
        return false;
      }
      if (!q) return true;
      return (
        (t.title || "").toLowerCase().includes(q) ||
        (t.description || "").toLowerCase().includes(q) ||
        (t.category || "").toLowerCase().includes(q)
      );
    });
  }, [templates, query, activeCategory]);

  function goToEditor(id) {
    if (id == null || id === "") return;
    navigate(`${TEMPLATE_ROUTE}/${id}/edit`);
  }

  async function submitCreate(payload) {
    setCreating(true);
    setError("");
    try {
      const created = await roadmapService.createTemplate({
        title: payload.title,
        description: payload.description || null,
        category: payload.category || null,
        thumbnailUrl: payload.thumbnailUrl || null,
      });
      // A new template is a draft, so it won't show in the (published-only)
      // list — jump straight into the editor where getTemplate(id) works.
      setShowCreate(false);
      goToEditor(created.id);
    } catch (e) {
      if (e?.response?.status === 403) {
        setError("Only a super admin can create templates.");
      } else {
        setError(readError(e, "Could not create the template."));
      }
      setCreating(false);
    }
  }

  if (forbidden) {
    return (
      <Shell>
        <ForbiddenPanel />
      </Shell>
    );
  }

  return (
    <Shell>
      <div style={headerRow}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>
            Roadmap template library
          </h1>
          <p
            style={{
              margin: "6px 0 0",
              color: "var(--rm-text-muted, #6b7280)",
              fontSize: 14,
            }}
          >
            Global blueprints org admins clone into their organizations.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            style={ghostBtnStyle}
            onClick={() => navigate("/superadmin/overview")}
          >
            Platform overview
          </button>
          <button style={primaryBtnStyle} onClick={() => setShowCreate(true)}>
            + New template
          </button>
        </div>
      </div>

      {/* published-only seam note + open-by-id bridge */}
      <div style={seamNote}>
        <span>
          This grid lists <strong>published</strong> templates only. A template
          you just created is a draft and won’t appear here until you publish it
          — open it directly:
        </span>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            goToEditor(openId.trim());
          }}
          style={{ display: "flex", gap: 6, flexShrink: 0 }}
        >
          <input
            value={openId}
            onChange={(e) => setOpenId(e.target.value.replace(/[^0-9]/g, ""))}
            placeholder="Template ID"
            inputMode="numeric"
            style={{ ...inputStyle, width: 120, padding: "6px 10px" }}
          />
          <button type="submit" style={ghostBtnStyle} disabled={!openId.trim()}>
            Open editor
          </button>
        </form>
      </div>

      {error && (
        <div style={errorBar}>
          <span>{error}</span>
          <button
            onClick={() => setError("")}
            style={{ ...linkBtnStyle, color: "#b91c1c" }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* search + category filter */}
      <div style={filterRow}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search templates…"
          style={{ ...inputStyle, maxWidth: 320 }}
        />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <CategoryChip
            label="All"
            active={activeCategory === "all"}
            onClick={() => setActiveCategory("all")}
          />
          {categories.map((c) => (
            <CategoryChip
              key={c}
              label={c}
              active={activeCategory === c}
              onClick={() => setActiveCategory(c)}
            />
          ))}
        </div>
      </div>

      {/* grid */}
      {loading ? (
        <Centered>Loading templates…</Centered>
      ) : filtered.length === 0 ? (
        <Centered>
          {templates.length === 0
            ? "No published templates yet. Create one — it opens in the editor, then publish it to list it here."
            : "No templates match your search."}
        </Centered>
      ) : (
        <div style={grid}>
          {filtered.map((t) => (
            <div key={t.id} style={cardWrap}>
              <RoadmapCard
                title={t.title}
                category={t.category}
                description={t.description}
                thumbnailUrl={t.thumbnailUrl}
                nodeCount={t.totalNodes ?? 0}
                status={t.published ? "published" : "draft"}
                updatedAt={formatDate(t.updatedAt || t.createdAt)}
                variant="light"
                onClick={() => goToEditor(t.id)}
              />
              <div style={cardFooter}>
                <span
                  style={{
                    fontSize: 12,
                    color: "var(--rm-text-muted, #6b7280)",
                  }}
                >
                  v{t.version ?? 1}
                  {t.archived ? " · archived" : ""}
                </span>
                <button style={smallGhostBtn} onClick={() => goToEditor(t.id)}>
                  Open editor →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreate && (
        <CreateTemplateModal
          busy={creating}
          categories={categories}
          onCancel={() => setShowCreate(false)}
          onSubmit={submitCreate}
        />
      )}
    </Shell>
  );
}

/* ------------------------------------------------------------------ */
/* Create modal                                                        */
/* ------------------------------------------------------------------ */

function CreateTemplateModal({ onSubmit, onCancel, busy, categories }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");

  const canSubmit = title.trim().length > 0 && !busy;

  return (
    <div style={modalBackdrop} onClick={onCancel}>
      <div style={modalCard} onClick={(e) => e.stopPropagation()}>
        <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 800 }}>
          New template
        </h2>
        <p
          style={{
            margin: "0 0 16px",
            fontSize: 13.5,
            color: "var(--rm-text-muted, #6b7280)",
          }}
        >
          Creates a draft and opens the editor. The slug is generated from the
          title.
        </p>

        <label style={fieldLabel}>Title *</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Full-Stack Web Developer"
          style={inputStyle}
          autoFocus
        />

        <label style={fieldLabel}>Category</label>
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="e.g. Frontend"
          list="tlp-category-options"
          style={inputStyle}
        />
        <datalist id="tlp-category-options">
          {categories.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>

        <label style={fieldLabel}>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="What does this roadmap cover?"
          style={{ ...inputStyle, resize: "vertical" }}
        />

        <label style={fieldLabel}>Thumbnail URL</label>
        <input
          value={thumbnailUrl}
          onChange={(e) => setThumbnailUrl(e.target.value)}
          placeholder="https://…"
          style={inputStyle}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
            marginTop: 20,
          }}
        >
          <button style={ghostBtnStyle} onClick={onCancel} disabled={busy}>
            Cancel
          </button>
          <button
            style={{ ...primaryBtnStyle, opacity: canSubmit ? 1 : 0.6 }}
            onClick={() =>
              canSubmit &&
              onSubmit({
                title: title.trim(),
                category: category.trim(),
                description: description.trim(),
                thumbnailUrl: thumbnailUrl.trim(),
              })
            }
            disabled={!canSubmit}
          >
            {busy ? "Creating…" : "Create & edit"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Small pieces                                                        */
/* ------------------------------------------------------------------ */

function Shell({ children }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--rm-bg, #f5f3ee)",
        color: "var(--rm-text, #17130a)",
        fontFamily: "var(--rm-font-ui, system-ui, sans-serif)",
        padding: "28px clamp(16px, 5vw, 56px)",
        boxSizing: "border-box",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>{children}</div>
    </div>
  );
}

function CategoryChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        border: `1px solid ${active ? "var(--rm-accent, #7c3aed)" : "var(--rm-border, #d9d5cc)"}`,
        background: active
          ? "var(--rm-accent, #7c3aed)"
          : "var(--rm-surface, #fff)",
        color: active ? "#fff" : "var(--rm-text, #17130a)",
        borderRadius: 999,
        padding: "6px 14px",
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}

function ForbiddenPanel() {
  return (
    <div
      style={{
        ...cardWrap,
        maxWidth: 560,
        margin: "60px auto 0",
        textAlign: "center",
        padding: 32,
      }}
    >
      <div style={{ fontSize: 40 }}>🔒</div>
      <h2 style={{ margin: "10px 0 6px", fontSize: 20, fontWeight: 800 }}>
        Super admin only
      </h2>
      <p
        style={{
          margin: 0,
          color: "var(--rm-text-muted, #6b7280)",
          fontSize: 14,
          lineHeight: 1.6,
        }}
      >
        The global template library is restricted to super administrators. If
        you manage a single organization, use your org’s roadmap management
        screen instead — you can clone any published template there.
      </p>
    </div>
  );
}

function Centered({ children }) {
  return (
    <div
      style={{
        display: "grid",
        placeItems: "center",
        minHeight: 240,
        color: "var(--rm-text-muted, #6b7280)",
        fontSize: 14.5,
        textAlign: "center",
        padding: 20,
      }}
    >
      {children}
    </div>
  );
}

function formatDate(value) {
  if (!value) return null;
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return null;
  }
}

function readError(e, fallback) {
  return (
    e?.response?.data?.message ||
    e?.response?.data?.error ||
    e?.message ||
    fallback
  );
}

/* ------------------------------------------------------------------ */
/* Styles                                                              */
/* ------------------------------------------------------------------ */

const headerRow = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 16,
  flexWrap: "wrap",
  marginBottom: 18,
};

const seamNote = {
  display: "flex",
  alignItems: "center",
  gap: 14,
  flexWrap: "wrap",
  justifyContent: "space-between",
  background: "var(--rm-progress-bg, #fef3c7)",
  border: "1px solid var(--rm-progress, #d97706)",
  color: "#8a5a00",
  borderRadius: 12,
  padding: "10px 14px",
  fontSize: 13,
  lineHeight: 1.5,
  marginBottom: 16,
};

const errorBar = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  background: "#fef2f2",
  color: "#b91c1c",
  border: "1px solid #fecaca",
  borderRadius: 10,
  padding: "9px 14px",
  fontSize: 13.5,
  marginBottom: 16,
};

const filterRow = {
  display: "flex",
  alignItems: "center",
  gap: 14,
  flexWrap: "wrap",
  justifyContent: "space-between",
  marginBottom: 18,
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
  gap: 16,
};

const cardWrap = {
  display: "flex",
  flexDirection: "column",
  background: "var(--rm-surface, #fff)",
  border: "1px solid var(--rm-border, #d9d5cc)",
  borderRadius: "var(--rm-radius-lg, 16px)",
  overflow: "hidden",
};

const cardFooter = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "10px 16px",
  borderTop: "1px solid var(--rm-border, #d9d5cc)",
  background: "var(--rm-surface-2, #faf9f6)",
};

const primaryBtnStyle = {
  border: "none",
  background: "var(--rm-accent, #7c3aed)",
  color: "#fff",
  borderRadius: 9,
  padding: "9px 16px",
  fontSize: 13.5,
  fontWeight: 700,
  cursor: "pointer",
};

const ghostBtnStyle = {
  border: "1px solid var(--rm-border, #d9d5cc)",
  background: "var(--rm-surface, #fff)",
  color: "var(--rm-text, #17130a)",
  borderRadius: 9,
  padding: "9px 16px",
  fontSize: 13.5,
  fontWeight: 600,
  cursor: "pointer",
};

const smallGhostBtn = {
  border: "1px solid var(--rm-border, #d9d5cc)",
  background: "var(--rm-surface, #fff)",
  color: "var(--rm-accent, #7c3aed)",
  borderRadius: 8,
  padding: "5px 12px",
  fontSize: 12.5,
  fontWeight: 700,
  cursor: "pointer",
};

const linkBtnStyle = {
  border: "none",
  background: "none",
  fontWeight: 700,
  cursor: "pointer",
  padding: 0,
  fontSize: "inherit",
};

const fieldLabel = {
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  color: "var(--rm-text-muted, #6b7280)",
  margin: "12px 0 5px",
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  border: "1px solid var(--rm-border, #d9d5cc)",
  borderRadius: 8,
  padding: "8px 10px",
  fontSize: 13.5,
  fontFamily: "inherit",
  background: "var(--rm-surface, #fff)",
  color: "var(--rm-text, #17130a)",
};

const modalBackdrop = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,.4)",
  display: "grid",
  placeItems: "center",
  zIndex: 50,
  padding: 20,
};

const modalCard = {
  width: "min(460px, 100%)",
  background: "var(--rm-surface, #fff)",
  borderRadius: 16,
  padding: 24,
  boxShadow: "0 20px 60px rgba(0,0,0,.3)",
  fontFamily: "var(--rm-font-ui, system-ui, sans-serif)",
  maxHeight: "90vh",
  overflowY: "auto",
};
