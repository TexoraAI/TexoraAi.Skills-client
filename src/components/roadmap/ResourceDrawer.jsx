import React, { useState, useEffect } from "react";
import "./roadmap-tokens.css";

/**
 * ResourceDrawer — right-hand slide-in panel showing a node's details and its
 * (real, backend-sourced) resources.
 *
 * Props:
 *  - node        the full react-flow node ({ id, data: { title, description,
 *                status, resources, estimatedHours, ... } }). Resources are
 *                read from node.data.resources (falls back to node.resources).
 *  - isOpen      bool
 *  - onClose()   close handler
 *  - role        "student" | "trainer"
 *
 *  Student:
 *  - onStatusChange(nodeId, newUiStatus)   newUiStatus in
 *                                          not_started|in_progress|done|skipped
 *  - onResourceClick(resource)             optional (e.g. to count clicks)
 *
 *  Trainer:
 *  - onAddResource(nodeId, resource)       resource: {type,title,url,
 *                                          description,durationMinutes,difficulty}
 *  - onRemoveResource(resourceId)
 *  - onUpdateResource(resourceId, patch)   e.g. { isFeatured: true }
 *  - busy        bool (disables buttons while a request is in flight)
 */

const RES_ICON = {
  article: "📄",
  video: "▶️",
  course: "🎓",
  book: "📕",
  doc: "📘",
  tool: "🔧",
};

const RES_TYPES = ["article", "video", "course", "book", "doc", "tool"];

const STUDENT_ACTIONS = [
  { key: "done", label: "Mark done", color: "var(--rm-done, #16a34a)" },
  {
    key: "in_progress",
    label: "In progress",
    color: "var(--rm-progress, #d97706)",
  },
  { key: "skipped", label: "Skip", color: "var(--rm-skipped, #6b7280)" },
  {
    key: "not_started",
    label: "Reset",
    color: "var(--rm-border-strong, #b9b3a6)",
  },
];

export default function ResourceDrawer({
  node,
  isOpen,
  onClose,
  role = "student",
  onStatusChange,
  onResourceClick,
  onAddResource,
  onRemoveResource,
  onUpdateResource,
  busy = false,
}) {
  const data = node?.data || node || {};
  const nodeId = data.backendId != null ? data.backendId : node?.id;
  const resources = data.resources || node?.resources || [];
  const status = data.status || "not_started";

  const [showAdd, setShowAdd] = useState(false);
  const [draft, setDraft] = useState(emptyDraft());

  useEffect(() => {
    // reset the add form whenever we switch nodes / close
    setShowAdd(false);
    setDraft(emptyDraft());
  }, [node?.id, isOpen]);

  if (!isOpen || !node) return null;

  function emptyDraft() {
    return {
      type: "article",
      title: "",
      url: "",
      description: "",
      durationMinutes: "",
      difficulty: "",
    };
  }

  function submitAdd(e) {
    e.preventDefault();
    if (!draft.title.trim() || !draft.url.trim()) return;
    onAddResource?.(nodeId, {
      type: draft.type,
      title: draft.title.trim(),
      url: draft.url.trim(),
      description: draft.description.trim() || null,
      durationMinutes: draft.durationMinutes
        ? Number(draft.durationMinutes)
        : null,
      difficulty: draft.difficulty.trim() || null,
    });
    setShowAdd(false);
    setDraft(emptyDraft());
  }

  return (
    <>
      {/* backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,.35)",
          zIndex: 40,
        }}
      />
      {/* panel */}
      <aside
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100vh",
          width: "min(440px, 100vw)",
          background: "var(--rm-surface, #fff)",
          color: "var(--rm-text, #17130a)",
          boxShadow: "-8px 0 24px rgba(0,0,0,.18)",
          zIndex: 41,
          display: "flex",
          flexDirection: "column",
          fontFamily: "var(--rm-font-ui, system-ui, sans-serif)",
          animation: "rm-drawer-in .22s ease",
        }}
      >
        {/* header */}
        <div
          style={{
            padding: "18px 20px",
            borderBottom: "1px solid var(--rm-border, #d9d5cc)",
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
          }}
        >
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: 0.5,
                color: "var(--rm-text-muted, #6b7280)",
                marginBottom: 4,
              }}
            >
              {data.nodeType || "topic"}
              {data.estimatedHours ? ` · ${data.estimatedHours}h` : ""}
              {data.isOptional ? " · optional" : ""}
            </div>
            <h2 style={{ margin: 0, fontSize: 19, fontWeight: 800 }}>
              {data.title}
            </h2>
          </div>
          <button onClick={onClose} aria-label="Close" style={iconBtnStyle}>
            ✕
          </button>
        </div>

        {/* body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "18px 20px" }}>
          {data.description && (
            <p
              style={{
                marginTop: 0,
                fontSize: 14,
                lineHeight: 1.6,
                color: "var(--rm-text, #17130a)",
              }}
            >
              {data.description}
            </p>
          )}

          {/* student status controls */}
          {role === "student" && (
            <div style={{ margin: "14px 0 22px" }}>
              <div style={sectionLabel}>Your progress</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {STUDENT_ACTIONS.map((a) => {
                  const active = status === a.key;
                  return (
                    <button
                      key={a.key}
                      disabled={busy}
                      onClick={() => onStatusChange?.(node.id, a.key)}
                      style={{
                        border: `1.5px solid ${a.color}`,
                        background: active ? a.color : "transparent",
                        color: active ? "#fff" : a.color,
                        borderRadius: 999,
                        padding: "6px 14px",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: busy ? "not-allowed" : "pointer",
                        opacity: busy ? 0.6 : 1,
                      }}
                    >
                      {a.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* resources */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <div style={{ ...sectionLabel, marginBottom: 0 }}>
              Resources {resources.length ? `(${resources.length})` : ""}
            </div>
            {role === "trainer" && (
              <button
                onClick={() => setShowAdd((v) => !v)}
                disabled={busy}
                style={smallBtnStyle}
              >
                {showAdd ? "Cancel" : "+ Add"}
              </button>
            )}
          </div>

          {/* trainer add form */}
          {role === "trainer" && showAdd && (
            <form
              onSubmit={submitAdd}
              style={{
                border: "1px solid var(--rm-border, #d9d5cc)",
                borderRadius: 10,
                padding: 12,
                marginBottom: 14,
                display: "flex",
                flexDirection: "column",
                gap: 8,
                background: "var(--rm-surface-2, #faf9f6)",
              }}
            >
              <select
                value={draft.type}
                onChange={(e) => setDraft({ ...draft, type: e.target.value })}
                style={inputStyle}
              >
                {RES_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {RES_ICON[t]} {t}
                  </option>
                ))}
              </select>
              <input
                placeholder="Title *"
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                style={inputStyle}
              />
              <input
                placeholder="URL *"
                value={draft.url}
                onChange={(e) => setDraft({ ...draft, url: e.target.value })}
                style={inputStyle}
              />
              <input
                placeholder="Description"
                value={draft.description}
                onChange={(e) =>
                  setDraft({ ...draft, description: e.target.value })
                }
                style={inputStyle}
              />
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  placeholder="Minutes"
                  type="number"
                  value={draft.durationMinutes}
                  onChange={(e) =>
                    setDraft({ ...draft, durationMinutes: e.target.value })
                  }
                  style={{ ...inputStyle, flex: 1 }}
                />
                <input
                  placeholder="Difficulty"
                  value={draft.difficulty}
                  onChange={(e) =>
                    setDraft({ ...draft, difficulty: e.target.value })
                  }
                  style={{ ...inputStyle, flex: 1 }}
                />
              </div>
              <button type="submit" disabled={busy} style={primaryBtnStyle}>
                Add resource
              </button>
            </form>
          )}

          {resources.length === 0 ? (
            <p
              style={{ fontSize: 13.5, color: "var(--rm-text-muted, #6b7280)" }}
            >
              {role === "trainer"
                ? "No resources yet. Add the first one above."
                : "No resources have been added for this topic yet."}
            </p>
          ) : (
            <ul
              style={{
                listStyle: "none",
                margin: 0,
                padding: 0,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {resources.map((r) => (
                <li
                  key={r.id ?? r.url}
                  style={{
                    border: "1px solid var(--rm-border, #d9d5cc)",
                    borderRadius: 10,
                    padding: "10px 12px",
                    display: "flex",
                    gap: 10,
                    alignItems: "flex-start",
                    background: r.isFeatured
                      ? "var(--rm-progress-bg, #fef3c7)"
                      : "var(--rm-surface, #fff)",
                  }}
                >
                  <span style={{ fontSize: 18, lineHeight: 1.2 }}>
                    {RES_ICON[r.type] || "🔗"}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => onResourceClick?.(r)}
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "var(--rm-link, #2563eb)",
                        textDecoration: "none",
                        wordBreak: "break-word",
                      }}
                    >
                      {r.title}
                    </a>
                    <div
                      style={{
                        fontSize: 12,
                        color: "var(--rm-text-muted, #6b7280)",
                        marginTop: 2,
                        display: "flex",
                        gap: 8,
                        flexWrap: "wrap",
                      }}
                    >
                      <span style={{ textTransform: "capitalize" }}>
                        {r.type}
                      </span>
                      {r.durationMinutes ? (
                        <span>· {r.durationMinutes} min</span>
                      ) : null}
                      {r.difficulty ? <span>· {r.difficulty}</span> : null}
                      {r.upvotes ? <span>· ▲ {r.upvotes}</span> : null}
                    </div>
                    {r.description && (
                      <p
                        style={{
                          margin: "6px 0 0",
                          fontSize: 12.5,
                          color: "var(--rm-text-muted, #6b7280)",
                          lineHeight: 1.5,
                        }}
                      >
                        {r.description}
                      </p>
                    )}
                  </div>

                  {role === "trainer" && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                      }}
                    >
                      <button
                        title={r.isFeatured ? "Unfeature" : "Feature"}
                        disabled={busy}
                        onClick={() =>
                          onUpdateResource?.(r.backendId ?? r.id, {
                            isFeatured: !r.isFeatured,
                          })
                        }
                        style={iconBtnStyle}
                      >
                        {r.isFeatured ? "★" : "☆"}
                      </button>
                      <button
                        title="Remove"
                        disabled={busy}
                        onClick={() => onRemoveResource?.(r.backendId ?? r.id)}
                        style={{ ...iconBtnStyle, color: "#dc2626" }}
                      >
                        🗑
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <style>{`
          @keyframes rm-drawer-in {
            from { transform: translateX(100%); }
            to   { transform: translateX(0); }
          }
        `}</style>
      </aside>
    </>
  );
}

const sectionLabel = {
  fontSize: 11,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: 0.5,
  color: "var(--rm-text-muted, #6b7280)",
  marginBottom: 8,
};

const iconBtnStyle = {
  border: "1px solid var(--rm-border, #d9d5cc)",
  background: "var(--rm-surface, #fff)",
  borderRadius: 8,
  width: 30,
  height: 30,
  cursor: "pointer",
  fontSize: 14,
  lineHeight: 1,
  display: "grid",
  placeItems: "center",
};

const smallBtnStyle = {
  border: "1px solid var(--rm-accent, #7c3aed)",
  background: "transparent",
  color: "var(--rm-accent, #7c3aed)",
  borderRadius: 8,
  padding: "4px 12px",
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
};

const primaryBtnStyle = {
  border: "none",
  background: "var(--rm-accent, #7c3aed)",
  color: "#fff",
  borderRadius: 8,
  padding: "9px 14px",
  fontSize: 14,
  fontWeight: 700,
  cursor: "pointer",
};

const inputStyle = {
  border: "1px solid var(--rm-border, #d9d5cc)",
  borderRadius: 8,
  padding: "8px 10px",
  fontSize: 13.5,
  fontFamily: "inherit",
  width: "100%",
  boxSizing: "border-box",
  background: "var(--rm-surface, #fff)",
  color: "var(--rm-text, #17130a)",
};
