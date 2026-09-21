// src/trainer/ai-companion/AiContextResourceModal.jsx
import { useEffect, useState } from "react";
import { X, FileText, Paperclip, Video, PenSquare } from "lucide-react";

// Adjust to wherever this app centralizes its fetch calls / base URL handling.
const API_BASE = "/api/v1/ai-companion/resources";

async function fetchJson(url) {
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) {
    throw new Error(`Request to ${url} failed with status ${res.status}`);
  }
  return res.json();
}

export default function AiContextResourceModal({
  isDark,
  onSave,
  onClose,
  initialContext = "",
  initialResourceIds = "",
  sessionId = null, // NEW: needed to scope recordings/whiteboard to the current session
}) {
  const [context, setContext] = useState(initialContext);

  // Selected IDs are still tracked as a Set of strings, same as the old
  // comma-parsed representation, so the onSave payload shape is unchanged.
  const [selectedIds, setSelectedIds] = useState(
    () =>
      new Set(
        initialResourceIds
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      ),
  );

  const [docs, setDocs] = useState([]);
  const [recordings, setRecordings] = useState([]);
  const [whiteboard, setWhiteboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadResources() {
      setLoading(true);
      setLoadError(null);
      try {
        const requests = [fetchJson(`${API_BASE}/docs`)];

        if (sessionId) {
          requests.push(
            fetchJson(`${API_BASE}/recordings?sessionId=${sessionId}`),
          );
          requests.push(
            fetchJson(`${API_BASE}/whiteboard?sessionId=${sessionId}`),
          );
        }

        const [docsRes, recordingsRes, whiteboardRes] =
          await Promise.all(requests);

        if (cancelled) return;

        setDocs(docsRes ?? []);
        setRecordings(recordingsRes ?? []);
        // /whiteboard returns a list of 0 or 1 snapshot
        setWhiteboard(
          Array.isArray(whiteboardRes) && whiteboardRes.length > 0
            ? whiteboardRes[0]
            : null,
        );
      } catch (err) {
        if (!cancelled)
          setLoadError("Could not load resources. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadResources();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  const bg = isDark ? "#111827" : "#ffffff";
  const overlay = "rgba(0,0,0,0.55)";
  const border = isDark ? "rgba(255,255,255,0.1)" : "#e5e7eb";
  const textPrimary = isDark ? "#f9fafb" : "#111827";
  const textSecondary = isDark ? "rgba(255,255,255,0.5)" : "#6b7280";
  const inputBg = isDark ? "#1f2937" : "#f9fafb";
  const itemBg = isDark ? "#1f2937" : "#f9fafb";
  const itemBgSelected = isDark ? "rgba(37,99,235,0.18)" : "#eff6ff";

  const sectionLabelStyle = {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    fontWeight: 600,
    color: textSecondary,
    marginBottom: 8,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  };

  const emptyTextStyle = {
    fontSize: 12,
    color: textSecondary,
    margin: 0,
    padding: "6px 2px",
  };

  const toggleId = (id) => {
    const key = String(id);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const formatDate = (value) => {
    if (!value) return "";
    try {
      return new Date(value).toLocaleString();
    } catch {
      return String(value);
    }
  };

  const renderPickerItem = ({ id, name, meta }) => {
    const selected = selectedIds.has(String(id));
    return (
      <label
        key={id}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 10px",
          borderRadius: 8,
          background: selected ? itemBgSelected : itemBg,
          border: `1px solid ${selected ? "#2563eb" : border}`,
          cursor: "pointer",
          marginBottom: 6,
        }}
      >
        <input
          type="checkbox"
          checked={selected}
          onChange={() => toggleId(id)}
          style={{ flexShrink: 0 }}
        />
        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              fontSize: 12.5,
              color: textPrimary,
              fontWeight: 500,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {name}
          </div>
          {meta && (
            <div style={{ fontSize: 11, color: textSecondary }}>{meta}</div>
          )}
        </div>
      </label>
    );
  };

  const handleSave = () => {
    onSave({
      additionalContext: context,
      resourceIds: Array.from(selectedIds),
    });
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: overlay,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        fontFamily: "'Poppins', sans-serif",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: bg,
          border: `1px solid ${border}`,
          borderRadius: 16,
          width: "100%",
          maxWidth: 520,
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: isDark
            ? "0 20px 60px rgba(0,0,0,0.6)"
            : "0 20px 60px rgba(0,0,0,0.15)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "18px 20px 14px",
            borderBottom: `1px solid ${border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: textPrimary,
                marginBottom: 2,
              }}
            >
              Add Context & Resources
            </div>
            <div style={{ fontSize: 11, color: textSecondary }}>
              Provide additional context or pick resources for the AI to use.
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: textSecondary,
              padding: 4,
              borderRadius: 6,
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "18px 20px", overflowY: "auto" }}>
          {/* Additional context */}
          <div style={{ marginBottom: 18 }}>
            <label style={sectionLabelStyle}>
              <FileText size={12} />
              Additional Context
            </label>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Add session notes, agenda, meeting description, or any relevant context that will help AI give better answers..."
              rows={4}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "10px 14px",
                borderRadius: 10,
                border: `1px solid ${border}`,
                background: inputBg,
                color: textPrimary,
                fontSize: 13,
                resize: "vertical",
                fontFamily: "'Poppins', sans-serif",
                outline: "none",
                lineHeight: 1.6,
                transition: "border-color 0.15s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
              onBlur={(e) => (e.target.style.borderColor = border)}
            />
          </div>

          {loading && (
            <p style={emptyTextStyle}>
              Loading your documents, recordings and whiteboard…
            </p>
          )}
          {loadError && (
            <p style={{ ...emptyTextStyle, color: "#dc2626" }}>{loadError}</p>
          )}

          {!loading && !loadError && (
            <>
              {/* Uploaded documents */}
              <div style={{ marginBottom: 18 }}>
                <label style={sectionLabelStyle}>
                  <Paperclip size={12} />
                  Uploaded Documents
                </label>
                {docs.length === 0 ? (
                  <p style={emptyTextStyle}>No uploaded documents yet.</p>
                ) : (
                  docs.map((doc) =>
                    renderPickerItem({
                      id: doc.id,
                      name: doc.fileName,
                      meta: formatDate(doc.createdAt),
                    }),
                  )
                )}
              </div>

              {/* Recordings */}
              <div style={{ marginBottom: 18 }}>
                <label style={sectionLabelStyle}>
                  <Video size={12} />
                  Recordings
                </label>
                {!sessionId ? (
                  <p style={emptyTextStyle}>
                    Select a session to see its recordings.
                  </p>
                ) : recordings.length === 0 ? (
                  <p style={emptyTextStyle}>No recordings for this session.</p>
                ) : (
                  recordings.map((rec) =>
                    renderPickerItem({
                      id: rec.id,
                      name: rec.title || rec.fileName || `Recording ${rec.id}`,
                      meta: formatDate(rec.uploadedAt),
                    }),
                  )
                )}
              </div>

              {/* Whiteboard */}
              <div>
                <label style={sectionLabelStyle}>
                  <PenSquare size={12} />
                  Whiteboard
                </label>
                {!sessionId ? (
                  <p style={emptyTextStyle}>
                    Select a session to see its whiteboard.
                  </p>
                ) : !whiteboard ? (
                  <p style={emptyTextStyle}>
                    No whiteboard snapshot for this session.
                  </p>
                ) : (
                  renderPickerItem({
                    id: whiteboard.id,
                    name: "Whiteboard snapshot",
                    meta: formatDate(whiteboard.updatedAt),
                  })
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "14px 20px",
            borderTop: `1px solid ${border}`,
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
            flexShrink: 0,
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "8px 18px",
              borderRadius: 8,
              border: `1px solid ${border}`,
              background: "transparent",
              color: textSecondary,
              cursor: "pointer",
              fontSize: 13,
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 500,
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = isDark
                ? "rgba(255,255,255,0.05)"
                : "#f3f4f6")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: "8px 20px",
              borderRadius: 8,
              border: "none",
              background: "#2563eb",
              color: "#fff",
              cursor: "pointer",
              fontSize: 13,
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              boxShadow: "0 2px 8px rgba(37,99,235,0.3)",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#1d4ed8")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#2563eb")}
          >
            Save & Apply
          </button>
        </div>
      </div>
    </div>
  );
}
