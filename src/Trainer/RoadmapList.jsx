import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import roadmapService, { getOrgIdFromToken } from "../services/roadmapService";
import RoadmapCard from "../components/roadmap/RoadmapCard";
import "../components/roadmap/roadmap-tokens.css";

/**
 * Trainer · RoadmapList
 * Shows the roadmaps the caller owns (created) and lets them create a new one.
 *
 * Backend:
 *   GET  /api/progress/roadmaps/org/mine  -> PagedResponse<OrgRoadmapResponse>
 *   POST /api/progress/roadmaps/org/custom -> OrgRoadmapResponse
 *
 * NOTE (backend seam): createCustomRoadmap / publish are authorized for
 * SUPER_ADMIN and matching ORG_ADMIN only. A pure TRAINER role receives
 * 403 FORBIDDEN_ROLE. The create flow below surfaces that clearly instead of
 * failing silently.
 */
export default function RoadmapList() {
  const navigate = useNavigate();

  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); // all | draft | published
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const page = await roadmapService.listMyRoadmaps({ page: 0, size: 100 });
      setRoadmaps(page?.content || []);
    } catch (e) {
      setError(readError(e, "Could not load your roadmaps."));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

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
      setShowCreate(false);
      // jump straight into the editor for the new roadmap
      navigate(`/trainer/roadmaps/${created.id}/edit`);
    } catch (e) {
      const status = e?.response?.status;
      setCreateError(
        status === 403
          ? "Your role isn't allowed to create roadmaps — only an org admin can. Ask an admin to create it, then you can author its nodes."
          : readError(e, "Could not create the roadmap."),
      );
    } finally {
      setCreating(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--rm-bg, #f5f3ee)",
        color: "var(--rm-text, #17130a)",
        fontFamily: "var(--rm-font-ui, system-ui, sans-serif)",
      }}
    >
      <div
        style={{ maxWidth: 1120, margin: "0 auto", padding: "40px 24px 64px" }}
      >
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800 }}>
              My roadmaps
            </h1>
            <p
              style={{
                margin: "6px 0 0",
                color: "var(--rm-text-muted, #6b7280)",
              }}
            >
              Create and manage the learning paths you own.
            </p>
          </div>
          <button onClick={() => setShowCreate(true)} style={primaryBtnStyle}>
            + New roadmap
          </button>
        </header>

        {/* filter tabs */}
        <div style={{ display: "flex", gap: 8, margin: "24px 0" }}>
          {[
            { key: "all", label: `All (${counts.all})` },
            { key: "draft", label: `Draft (${counts.draft})` },
            { key: "published", label: `Published (${counts.published})` },
          ].map((t) => {
            const active = filter === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setFilter(t.key)}
                style={{
                  padding: "7px 16px",
                  borderRadius: 999,
                  fontSize: 13.5,
                  fontWeight: 600,
                  cursor: "pointer",
                  border: `1px solid ${
                    active
                      ? "var(--rm-accent, #7c3aed)"
                      : "var(--rm-border, #d9d5cc)"
                  }`,
                  background: active
                    ? "var(--rm-accent, #7c3aed)"
                    : "var(--rm-surface, #fff)",
                  color: active ? "#fff" : "var(--rm-text-muted, #6b7280)",
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {loading && (
          <p style={{ color: "var(--rm-text-muted, #6b7280)" }}>Loading…</p>
        )}
        {!loading && error && (
          <div style={errorBoxStyle}>
            {error}{" "}
            <button onClick={load} style={{ ...linkBtnStyle }}>
              Retry
            </button>
          </div>
        )}
        {!loading && !error && filtered.length === 0 && (
          <div style={emptyBoxStyle}>
            No roadmaps here yet.{" "}
            {filter === "all" && (
              <button onClick={() => setShowCreate(true)} style={linkBtnStyle}>
                Create your first one
              </button>
            )}
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 18,
            }}
          >
            {filtered.map((r) => (
              <RoadmapCard
                key={r.id}
                title={r.title}
                description={r.description}
                category={r.category}
                thumbnailUrl={r.thumbnailUrl}
                nodeCount={r.totalNodes}
                studentCount={r.totalStudents}
                status={r.published ? "published" : "draft"}
                updatedAt={formatDate(r.updatedAt || r.createdAt)}
                onClick={() => navigate(`/trainer/roadmaps/${r.id}/edit`)}
              />
            ))}
          </div>
        )}
      </div>

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

  return (
    <div style={modalBackdrop} onClick={onCancel}>
      <div style={modalCard} onClick={(e) => e.stopPropagation()}>
        <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 800 }}>
          New roadmap
        </h2>
        <p
          style={{
            margin: "0 0 16px",
            fontSize: 13.5,
            color: "var(--rm-text-muted, #6b7280)",
          }}
        >
          You can add topics and resources after creating it.
        </p>

        <label style={fieldLabel}>Title *</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Frontend Developer"
          style={inputStyle}
          autoFocus
        />
        <label style={fieldLabel}>Category</label>
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="e.g. Development"
          style={inputStyle}
        />
        <label style={fieldLabel}>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What will learners get from this roadmap?"
          rows={3}
          style={{ ...inputStyle, resize: "vertical" }}
        />

        {error && (
          <div style={{ ...errorBoxStyle, marginTop: 12 }}>{error}</div>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
            marginTop: 18,
          }}
        >
          <button onClick={onCancel} style={ghostBtnStyle} disabled={busy}>
            Cancel
          </button>
          <button
            onClick={() =>
              title.trim() &&
              onCreate({ title: title.trim(), category, description })
            }
            style={primaryBtnStyle}
            disabled={busy || !title.trim()}
          >
            {busy ? "Creating…" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
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

const primaryBtnStyle = {
  border: "none",
  background: "var(--rm-accent, #7c3aed)",
  color: "#fff",
  borderRadius: 10,
  padding: "10px 18px",
  fontSize: 14,
  fontWeight: 700,
  cursor: "pointer",
};
const ghostBtnStyle = {
  border: "1px solid var(--rm-border, #d9d5cc)",
  background: "var(--rm-surface, #fff)",
  color: "var(--rm-text, #17130a)",
  borderRadius: 10,
  padding: "10px 18px",
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
};
const linkBtnStyle = {
  border: "none",
  background: "none",
  color: "var(--rm-accent, #7c3aed)",
  fontWeight: 700,
  cursor: "pointer",
  padding: 0,
  fontSize: "inherit",
};
const errorBoxStyle = {
  padding: "12px 14px",
  borderRadius: 10,
  background: "#fef2f2",
  border: "1px solid #fecaca",
  color: "#b91c1c",
  fontSize: 14,
};
const emptyBoxStyle = {
  padding: "28px",
  borderRadius: 12,
  background: "var(--rm-surface, #fff)",
  border: "1px dashed var(--rm-border, #d9d5cc)",
  color: "var(--rm-text-muted, #6b7280)",
  textAlign: "center",
  fontSize: 14.5,
};
const fieldLabel = {
  display: "block",
  fontSize: 12.5,
  fontWeight: 600,
  color: "var(--rm-text-muted, #6b7280)",
  margin: "10px 0 5px",
};
const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  border: "1px solid var(--rm-border, #d9d5cc)",
  borderRadius: 9,
  padding: "9px 12px",
  fontSize: 14,
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
};
