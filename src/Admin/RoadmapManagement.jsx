import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import roadmapService, { getOrgIdFromToken } from "../services/roadmapService";
import RoadmapCard from "../components/roadmap/RoadmapCard";
import "../components/roadmap/roadmap-tokens.css";

/**
 * Admin · RoadmapManagement
 * Build, publish, and reuse learning roadmaps across the org.
 *
 * Backend (all under /api/progress/roadmaps):
 *   GET  /org/mine                      -> PagedResponse<OrgRoadmapResponse>   (roadmaps I created — incl. DRAFTS, full metadata)
 *   GET  /org                           -> PagedResponse<RoadmapListItemResponse> (all PUBLISHED org roadmaps — light)
 *   GET  /org/{id}                      -> OrgRoadmapResponse                  (hydrate a light item to full metadata)
 *   POST /org/custom                    -> OrgRoadmapResponse (201)            (create custom; org auto-derived from JWT for org-admin)
 *   POST /org/clone/{templateId}        -> OrgRoadmapResponse (201)            (clone a global template into my org)
 *   POST /org/{id}/publish|unpublish    -> OrgRoadmapResponse
 *   GET  /admin/templates               -> PagedResponse<TemplateResponse>     (SUPER_ADMIN only — see seam below)
 *
 * SEAMS (documented, handled gracefully):
 *  1. GET /org returns only PUBLISHED, non-archived roadmaps. The only endpoint that
 *     returns DRAFTS with full metadata is /org/mine (roadmaps the caller created).
 *     So this page MERGES /org/mine (mine, incl. drafts) with /org (all published,
 *     hydrated to full metadata). Drafts created by *other* users in the org are not
 *     exposed by any backend endpoint — that is an irreducible backend limitation.
 *  2. GET /admin/templates is SUPER_ADMIN only (requireSuperAdmin). A plain org admin
 *     gets 403, so the "Clone from Template Library" section is loaded best-effort and
 *     hidden (with a short note) when forbidden. Cloning by id (POST /org/clone/{id})
 *     itself IS allowed for org admins.
 */
export default function RoadmapManagement() {
  const navigate = useNavigate();

  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); // all | draft | published
  const [busyId, setBusyId] = useState(null); // roadmap id currently publishing/unpublishing
  const [actionError, setActionError] = useState("");

  const [templates, setTemplates] = useState([]);
  const [templatesLoading, setTemplatesLoading] = useState(true);
  const [templatesForbidden, setTemplatesForbidden] = useState(false);
  const [templatesError, setTemplatesError] = useState("");

  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const [cloneTarget, setCloneTarget] = useState(null);
  const [cloneName, setCloneName] = useState("");
  const [cloning, setCloning] = useState(false);
  const [cloneError, setCloneError] = useState("");

  // ---- data load ----------------------------------------------------------

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      // /org/mine gives full metadata incl. drafts; /org gives all published (light).
      const [mine, published] = await Promise.all([
        roadmapService.listMyRoadmaps({ page: 0, size: 100 }),
        roadmapService
          .listOrgRoadmaps({ page: 0, size: 100 })
          .catch(() => null),
      ]);

      const byId = new Map();
      (mine?.content || []).forEach((r) => byId.set(r.id, r));

      // Published roadmaps created by *others* aren't in /org/mine — hydrate them
      // to full OrgRoadmapResponse so cards show status / student counts / dates.
      const missing = (published?.content || []).filter((r) => !byId.has(r.id));
      const hydrated = await Promise.all(
        missing.map((r) =>
          roadmapService.getOrgRoadmap(r.id).catch(() => null),
        ),
      );
      hydrated.forEach((r) => {
        if (r && r.id != null) byId.set(r.id, r);
      });

      const merged = [...byId.values()].sort(
        (a, b) =>
          ts(b.updatedAt || b.createdAt) - ts(a.updatedAt || a.createdAt),
      );
      setRoadmaps(merged);
    } catch (e) {
      setError(readError(e, "Could not load your org's roadmaps."));
    } finally {
      setLoading(false);
    }
  }, []);

  const loadTemplates = useCallback(async () => {
    setTemplatesLoading(true);
    setTemplatesForbidden(false);
    setTemplatesError("");
    try {
      const page = await roadmapService.listTemplates({ page: 0, size: 50 });
      setTemplates(page?.content || []);
    } catch (e) {
      if (e?.response?.status === 403) {
        setTemplatesForbidden(true); // super-admin-only endpoint — hide the section
      } else {
        setTemplatesError(readError(e, "Could not load the template library."));
      }
    } finally {
      setTemplatesLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    loadTemplates();
  }, [load, loadTemplates]);

  // ---- derived ------------------------------------------------------------

  const counts = useMemo(() => {
    const published = roadmaps.filter((r) => r.published).length;
    return {
      all: roadmaps.length,
      published,
      draft: roadmaps.length - published,
    };
  }, [roadmaps]);

  const filtered = useMemo(() => {
    if (filter === "published") return roadmaps.filter((r) => r.published);
    if (filter === "draft") return roadmaps.filter((r) => !r.published);
    return roadmaps;
  }, [roadmaps, filter]);

  // ---- actions ------------------------------------------------------------

  async function togglePublish(r) {
    setBusyId(r.id);
    setActionError("");
    try {
      const updated = r.published
        ? await roadmapService.unpublishRoadmap(r.id)
        : await roadmapService.publishRoadmap(r.id);
      setRoadmaps((prev) =>
        prev.map((x) => (x.id === r.id ? { ...x, ...updated } : x)),
      );
    } catch (e) {
      const status = e?.response?.status;
      setActionError(
        status === 403
          ? "Only an org admin (or super admin) for this roadmap's org can publish it."
          : readError(e, "Could not update publish state."),
      );
    } finally {
      setBusyId(null);
    }
  }

  async function handleCreate({ title, category, description }) {
    setCreating(true);
    setCreateError("");
    try {
      const orgId = getOrgIdFromToken();
      if (orgId == null) {
        throw new Error(
          "Couldn't determine your organization id from the session. Set VITE_DEFAULT_ORG_ID or localStorage['lms_org_id'].",
        );
      }
      const created = await roadmapService.createCustomRoadmap({
        orgId,
        title,
        category: category || null,
        description: description || null,
      });
      setRoadmaps((prev) => [created, ...prev]);
      setShowCreate(false);
    } catch (e) {
      const status = e?.response?.status;
      setCreateError(
        status === 403
          ? "Your role isn't allowed to create org roadmaps — only an org admin or super admin can."
          : readError(e, "Could not create the roadmap."),
      );
    } finally {
      setCreating(false);
    }
  }

  function openClone(template) {
    setCloneTarget(template);
    setCloneName(`${template.title} (Copy)`);
    setCloneError("");
  }

  async function confirmClone() {
    if (!cloneTarget || !cloneName.trim()) return;
    setCloning(true);
    setCloneError("");
    try {
      const orgId = getOrgIdFromToken();
      const created = await roadmapService.cloneTemplate(cloneTarget.id, {
        orgId,
        title: cloneName.trim(),
      });
      setRoadmaps((prev) => [created, ...prev]);
      setCloneTarget(null);
      setCloneName("");
    } catch (e) {
      const status = e?.response?.status;
      setCloneError(
        status === 403
          ? "Your role isn't allowed to clone templates into this org."
          : readError(e, "Could not clone the template."),
      );
    } finally {
      setCloning(false);
    }
  }

  // ---- render -------------------------------------------------------------

  return (
    <div className="rmg-page">
      <style>{ROADMAP_MANAGEMENT_CSS}</style>

      <header className="rmg-header">
        <div>
          <h1 className="rmg-title">Roadmap Management</h1>
          <p className="rmg-subtitle">
            Build, publish, and reuse learning roadmaps across your org.
          </p>
        </div>
        <button
          className="rmg-btn rmg-btn-primary"
          onClick={() => setShowCreate(true)}
        >
          + Create Custom Roadmap
        </button>
      </header>

      {actionError && <div className="rmg-alert">{actionError}</div>}

      {/* Section 1: org roadmaps */}
      <section className="rmg-section">
        <div className="rmg-section-head">
          <h2>Your Org&rsquo;s Roadmaps</h2>
          <div className="rmg-tabs">
            {[
              { key: "all", label: `All (${counts.all})` },
              { key: "draft", label: `Draft (${counts.draft})` },
              { key: "published", label: `Published (${counts.published})` },
            ].map((t) => (
              <button
                key={t.key}
                className={`rmg-tab ${filter === t.key ? "rmg-tab-active" : ""}`}
                onClick={() => setFilter(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {loading && <p className="rmg-muted">Loading…</p>}
        {!loading && error && (
          <div className="rmg-alert">
            {error}{" "}
            <button className="rmg-link-btn" onClick={load}>
              Retry
            </button>
          </div>
        )}
        {!loading && !error && filtered.length === 0 && (
          <div className="rmg-empty">
            No roadmaps here yet.{" "}
            <button
              className="rmg-link-btn"
              onClick={() => setShowCreate(true)}
            >
              Create your first one
            </button>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="rmg-grid">
            {filtered.map((r) => (
              <div key={r.id} className="rmg-card-wrap">
                <RoadmapCard
                  title={r.title}
                  description={r.description}
                  category={r.category}
                  thumbnailUrl={r.thumbnailUrl}
                  nodeCount={r.totalNodes}
                  studentCount={r.totalStudents}
                  status={r.published ? "published" : "draft"}
                  updatedAt={formatDate(r.updatedAt || r.createdAt)}
                  onClick={() =>
                    navigate(`/admin/roadmaps/analytics?id=${r.id}`)
                  }
                />
                <div className="rmg-actions">
                  <button
                    className="rmg-link-btn"
                    disabled={busyId === r.id}
                    onClick={() => togglePublish(r)}
                  >
                    {busyId === r.id
                      ? "…"
                      : r.published
                        ? "Unpublish"
                        : "Publish"}
                  </button>
                  <button
                    className="rmg-link-btn"
                    onClick={() => navigate(`/admin/roadmaps/${r.id}/edit`)}
                  >
                    Edit
                  </button>
                  <button
                    className="rmg-link-btn"
                    onClick={() =>
                      navigate(`/admin/roadmaps/analytics?id=${r.id}`)
                    }
                  >
                    Analytics
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Section 2: template library (super-admin-only endpoint; hidden on 403) */}
      {!templatesForbidden && (
        <section className="rmg-section">
          <div className="rmg-section-head">
            <h2>Clone from Template Library</h2>
            {!templatesLoading && (
              <span className="rmg-count">{templates.length} templates</span>
            )}
          </div>

          {templatesLoading && <p className="rmg-muted">Loading templates…</p>}
          {!templatesLoading && templatesError && (
            <div className="rmg-alert">
              {templatesError}{" "}
              <button className="rmg-link-btn" onClick={loadTemplates}>
                Retry
              </button>
            </div>
          )}
          {!templatesLoading && !templatesError && templates.length === 0 && (
            <div className="rmg-empty">
              No published templates are available yet.
            </div>
          )}
          {!templatesLoading && !templatesError && templates.length > 0 && (
            <div className="rmg-grid">
              {templates.map((t) => (
                <div className="rmg-template-card" key={t.id}>
                  <div className="rmg-template-tag">Template</div>
                  <h3 className="rmg-template-title">{t.title}</h3>
                  {t.description && (
                    <p className="rmg-template-desc">{t.description}</p>
                  )}
                  <div className="rmg-template-meta">
                    {t.category && <span>{t.category}</span>}
                    {t.category && t.totalNodes != null && (
                      <span>&middot;</span>
                    )}
                    {t.totalNodes != null && <span>{t.totalNodes} topics</span>}
                  </div>
                  <button
                    className="rmg-btn rmg-btn-secondary rmg-template-clone"
                    onClick={() => openClone(t)}
                  >
                    Clone into my org
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {templatesForbidden && (
        <p className="rmg-seam-note">
          The shared template library is managed by super admins. Ask a super
          admin to publish templates you can clone here.
        </p>
      )}

      {/* Clone modal */}
      {cloneTarget && (
        <div
          className="rmg-modal-overlay"
          onClick={() => !cloning && setCloneTarget(null)}
        >
          <div className="rmg-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Clone &ldquo;{cloneTarget.title}&rdquo;</h3>
            <p className="rmg-modal-hint">
              This adds a new <strong>draft</strong> roadmap to your org, based
              on this template.
            </p>
            <label className="rmg-field">
              <span>Roadmap name</span>
              <input
                type="text"
                value={cloneName}
                onChange={(e) => setCloneName(e.target.value)}
                autoFocus
              />
            </label>
            {cloneError && <div className="rmg-alert">{cloneError}</div>}
            <div className="rmg-modal-actions">
              <button
                className="rmg-btn rmg-btn-ghost"
                onClick={() => setCloneTarget(null)}
                disabled={cloning}
              >
                Cancel
              </button>
              <button
                className="rmg-btn rmg-btn-primary"
                onClick={confirmClone}
                disabled={cloning || !cloneName.trim()}
              >
                {cloning ? "Cloning…" : "Clone Roadmap"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create modal */}
      {showCreate && (
        <CreateRoadmapModal
          busy={creating}
          error={createError}
          onCancel={() => {
            setShowCreate(false);
            setCreateError("");
          }}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}

function CreateRoadmapModal({ onCreate, onCancel, busy, error }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  function submit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    onCreate({ title: title.trim(), category, description });
  }

  return (
    <div className="rmg-modal-overlay" onClick={() => !busy && onCancel()}>
      <form
        className="rmg-modal"
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
      >
        <h3>Create Custom Roadmap</h3>
        <p className="rmg-modal-hint">
          Starts as a draft. You can add topics and resources after creating it.
        </p>

        <label className="rmg-field">
          <span>Title *</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. API Design Fundamentals"
            autoFocus
            required
          />
        </label>
        <label className="rmg-field">
          <span>Description</span>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What will learners be able to do after completing this?"
          />
        </label>
        <label className="rmg-field">
          <span>Category</span>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. Engineering"
          />
        </label>

        {error && <div className="rmg-alert">{error}</div>}

        <div className="rmg-modal-actions">
          <button
            type="button"
            className="rmg-btn rmg-btn-ghost"
            onClick={onCancel}
            disabled={busy}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rmg-btn rmg-btn-primary"
            disabled={busy || !title.trim()}
          >
            {busy ? "Creating…" : "Create Roadmap"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ---- helpers --------------------------------------------------------------

function ts(iso) {
  const t = iso ? new Date(iso).getTime() : 0;
  return Number.isFinite(t) ? t : 0;
}

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function readError(e, fallback) {
  return (
    e?.response?.data?.message ||
    e?.response?.data?.error ||
    e?.message ||
    fallback
  );
}

// ---- styles (page-local; aligned to the shared --rm-* palette) -----------

const ROADMAP_MANAGEMENT_CSS = `
.rmg-page {
  padding: 32px 40px 64px;
  max-width: 1280px;
  margin: 0 auto;
  color: var(--rm-text, #17130a);
  font-family: var(--rm-font-ui, system-ui, sans-serif);
}
.rmg-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 24px;
}
.rmg-title {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 0 0 6px;
  color: var(--rm-text, #17130a);
}
.rmg-subtitle {
  margin: 0;
  font-size: 14.5px;
  color: var(--rm-text-muted, #6b7280);
}
.rmg-section { margin-bottom: 44px; }
.rmg-section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 18px;
  border-bottom: 1px solid var(--rm-border, #d9d5cc);
  padding-bottom: 12px;
}
.rmg-section-head h2 {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  color: var(--rm-text, #17130a);
}
.rmg-count { font-size: 13px; color: var(--rm-text-muted, #9ca3af); }
.rmg-tabs { display: flex; gap: 8px; }
.rmg-tab {
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid var(--rm-border, #d9d5cc);
  background: var(--rm-surface, #fff);
  color: var(--rm-text-muted, #6b7280);
}
.rmg-tab-active {
  border-color: var(--rm-accent, #7c3aed);
  background: var(--rm-accent, #7c3aed);
  color: #fff;
}
.rmg-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 18px;
}
.rmg-card-wrap {
  display: flex;
  flex-direction: column;
  border-radius: var(--rm-radius-lg, 16px);
  background: var(--rm-surface, #fff);
  border: 1px solid var(--rm-border, #d9d5cc);
  overflow: hidden;
}
.rmg-card-wrap > a,
.rmg-card-wrap > div:first-child {
  border: none !important;
}
.rmg-actions {
  display: flex;
  gap: 16px;
  padding: 12px 18px;
  border-top: 1px solid var(--rm-border, #eee);
  background: var(--rm-surface-2, #faf9f6);
}
.rmg-muted { color: var(--rm-text-muted, #6b7280); }
.rmg-link-btn {
  background: none;
  border: none;
  padding: 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--rm-accent, #7c3aed);
  cursor: pointer;
}
.rmg-link-btn:hover { text-decoration: underline; }
.rmg-link-btn:disabled { opacity: 0.5; cursor: default; text-decoration: none; }

/* Template cards */
.rmg-template-card {
  position: relative;
  display: flex;
  flex-direction: column;
  background: var(--rm-surface, #fff);
  border: 1px solid var(--rm-border, #d9d5cc);
  border-radius: var(--rm-radius-lg, 16px);
  padding: 18px;
}
.rmg-template-tag {
  align-self: flex-start;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--rm-accent, #7c3aed);
  background: var(--rm-accent-soft, #ede9fe);
  padding: 3px 9px;
  border-radius: 999px;
  margin-bottom: 10px;
}
.rmg-template-title {
  font-size: 15.5px;
  font-weight: 700;
  margin: 0 0 6px;
  color: var(--rm-text, #17130a);
}
.rmg-template-desc {
  font-size: 13.5px;
  line-height: 1.5;
  color: var(--rm-text-muted, #6b7280);
  margin: 0 0 12px;
  flex-grow: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.rmg-template-meta {
  display: flex;
  gap: 6px;
  font-size: 12.5px;
  color: var(--rm-text-muted, #9ca3af);
  margin-bottom: 14px;
}
.rmg-template-clone { width: 100%; }

/* Buttons */
.rmg-btn {
  font-size: 13.5px;
  font-weight: 700;
  padding: 9px 16px;
  border-radius: 10px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: background .15s ease, border-color .15s ease, opacity .15s ease;
}
.rmg-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.rmg-btn-primary { background: var(--rm-accent, #7c3aed); color: #fff; }
.rmg-btn-primary:hover:not(:disabled) { background: var(--rm-accent-strong, #6d28d9); }
.rmg-btn-secondary { background: var(--rm-surface-2, #f3f4f6); color: var(--rm-text, #17130a); }
.rmg-btn-secondary:hover { background: var(--rm-border, #e9eaed); }
.rmg-btn-ghost {
  background: transparent;
  border-color: var(--rm-border, #d9d5cc);
  color: var(--rm-text, #17130a);
}
.rmg-btn-ghost:hover { background: var(--rm-surface-2, #f3f4f6); }

/* States */
.rmg-alert {
  padding: 12px 14px;
  border-radius: 10px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
  font-size: 14px;
  margin-bottom: 16px;
}
.rmg-empty {
  padding: 28px;
  border-radius: 12px;
  background: var(--rm-surface, #fff);
  border: 1px dashed var(--rm-border, #d9d5cc);
  color: var(--rm-text-muted, #6b7280);
  text-align: center;
  font-size: 14.5px;
}
.rmg-seam-note {
  font-size: 13px;
  color: var(--rm-text-muted, #9ca3af);
  margin: 0 0 32px;
}

/* Modal */
.rmg-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 20px;
}
.rmg-modal {
  background: var(--rm-surface, #fff);
  border-radius: 16px;
  padding: 26px;
  width: 100%;
  max-width: 460px;
  box-shadow: 0 20px 60px rgba(0,0,0,.3);
  font-family: var(--rm-font-ui, system-ui, sans-serif);
}
.rmg-modal h3 {
  margin: 0 0 6px;
  font-size: 18px;
  font-weight: 800;
  color: var(--rm-text, #17130a);
}
.rmg-modal-hint {
  margin: 0 0 18px;
  font-size: 13px;
  color: var(--rm-text-muted, #6b7280);
}
.rmg-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
  font-size: 13px;
  font-weight: 600;
  color: var(--rm-text, #17130a);
}
.rmg-field input,
.rmg-field textarea {
  font-family: inherit;
  font-size: 14px;
  padding: 9px 11px;
  border-radius: 8px;
  border: 1px solid var(--rm-border, #d9d5cc);
  background: var(--rm-surface, #fff);
  color: var(--rm-text, #17130a);
  resize: vertical;
  box-sizing: border-box;
}
.rmg-field input:focus,
.rmg-field textarea:focus {
  outline: none;
  border-color: var(--rm-accent, #7c3aed);
  box-shadow: 0 0 0 3px var(--rm-accent-soft, rgba(124,58,237,.15));
}
.rmg-modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 6px;
}

@media (max-width: 640px) {
  .rmg-page { padding: 24px 18px 48px; }
  .rmg-header { flex-direction: column; }
}
`;
