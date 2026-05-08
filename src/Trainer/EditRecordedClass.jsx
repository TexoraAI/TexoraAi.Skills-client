import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getRecordingById,
  updateRecording,
  deleteRecording,
  incrementRecordingViews,
  uploadRecording,
} from "@/services/liveSessionService";
import {
  ArrowLeft,
  Save,
  Trash2,
  UploadCloud,
  CheckCircle2,
  Eye,
  Clock,
  Video,
  AlertTriangle,
  X,
} from "lucide-react";

const T = {
  dark: {
    pageBg: "#0a0a0a",
    cardBg: "#111111",
    heroBg: "#141414",
    border: "rgba(255,255,255,0.06)",
    borderHero: "rgba(255,255,255,0.07)",
    text: "#ffffff",
    textSub: "rgba(255,255,255,0.3)",
    textMuted: "rgba(255,255,255,0.2)",
    labelColor: "rgba(255,255,255,0.4)",
    inputBg: "#1a1a1a",
    inputBorder: "rgba(255,255,255,0.08)",
    inputText: "#ffffff",
    shadow: "0 4px 20px rgba(0,0,0,0.4)",
    gridLine: "rgba(255,255,255,0.5)",
    barBg: "rgba(255,255,255,0.05)",
  },
  light: {
    pageBg: "#f1f5f9",
    cardBg: "#ffffff",
    heroBg: "#ffffff",
    border: "#e2e8f0",
    borderHero: "#e2e8f0",
    text: "#0f172a",
    textSub: "#64748b",
    textMuted: "#94a3b8",
    labelColor: "#64748b",
    inputBg: "#f8fafc",
    inputBorder: "#e2e8f0",
    inputText: "#0f172a",
    shadow: "0 1px 8px rgba(0,0,0,0.07)",
    gridLine: "rgba(0,0,0,0.12)",
    barBg: "#f1f5f9",
  },
};

const EditRecordedClass = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [isDark, setIsDark] = useState(
    () =>
      typeof document !== "undefined" &&
      (document.documentElement.classList.contains("dark") ||
        document.documentElement.getAttribute("data-theme") === "dark"),
  );
  useEffect(() => {
    const obs = new MutationObserver(() =>
      setIsDark(
        document.documentElement.classList.contains("dark") ||
          document.documentElement.getAttribute("data-theme") === "dark",
      ),
    );
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });
    return () => obs.disconnect();
  }, []);
  const t = isDark ? T.dark : T.light;

  const [recording, setRecording] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState(null);

  const [replaceFile, setReplaceFile] = useState(null);
  const [replacing, setReplacing] = useState(false);
  const [replaceSuccess, setReplaceSuccess] = useState(false);

  const [form, setForm] = useState({ title: "", description: "" });
  const set = (key, val) => {
    setForm((p) => ({ ...p, [key]: val }));
    setSaved(false);
  };

  // ✅ GET /api/live-sessions/recording/{id}
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await getRecordingById(id);
        const data = res.data;
        setRecording(data);
        setForm({
          title: data.title || "",
          description: data.description || "",
        });
        // ✅ POST /api/live-sessions/recording/{id}/view
        incrementRecordingViews(id).catch(() => {});
      } catch (err) {
        console.error("Failed to load recording:", err);
        setError("Recording not found.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // ✅ PUT /api/live-sessions/recording/{id}
  // Body: { title, description } — controller reads Map<String,String>
  const handleSave = async () => {
    if (!form.title.trim()) {
      setError("Title is required");
      return;
    }
    setError(null);
    try {
      setSaving(true);
      const res = await updateRecording(id, {
        title: form.title,
        description: form.description,
      });
      setRecording(res.data);
      setSaved(true);
    } catch (err) {
      console.error("Save failed:", err);
      setError("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  // ✅ DELETE /api/live-sessions/recording/{id}
  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteRecording(id);
      navigate("/trainer/recorded-list");
    } catch (err) {
      console.error("Delete failed:", err);
      setError("Failed to delete recording.");
      setDeleting(false);
    }
  };

  // ✅ Replace = DELETE old + POST /api/live-sessions/recording/upload
  // Controller reads trainerId from JWT (auth.getName()), NOT from formData
  // Required params: file, batchId, title
  // Optional params: sessionId, description, batchName, durationMinutes
  const handleReplaceFile = async (file) => {
    if (!file) return;
    setError(null);
    try {
      setReplacing(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", recording.title);
      formData.append("batchId", recording.batchId);
      // Optional fields — only append if present
      if (recording.description)
        formData.append("description", recording.description);
      if (recording.batchName)
        formData.append("batchName", recording.batchName);
      if (recording.durationMinutes)
        formData.append("durationMinutes", recording.durationMinutes);
      if (recording.sessionId)
        formData.append("sessionId", recording.sessionId);
      // ✅ Do NOT append trainerId — controller extracts it from JWT via Authentication auth

      // Delete the old recording first
      await deleteRecording(id);

      // Upload the replacement
      await uploadRecording(formData);

      setReplaceSuccess(true);
      setTimeout(() => navigate("/trainer/recorded-list"), 1500);
    } catch (err) {
      console.error("Replace failed:", err);
      setError("Failed to replace video file.");
    } finally {
      setReplacing(false);
    }
  };

  const iStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "10px 14px",
    borderRadius: 10,
    border: `1px solid ${t.inputBorder}`,
    background: t.inputBg,
    color: t.inputText,
    fontSize: 12,
    fontFamily: "'Poppins',sans-serif",
    fontWeight: 500,
    outline: "none",
    transition: "border 0.2s",
  };
  const lStyle = {
    fontSize: 11,
    fontWeight: 600,
    color: t.labelColor,
    fontFamily: "'Poppins',sans-serif",
    letterSpacing: "0.04em",
    marginBottom: 6,
    display: "block",
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: t.pageBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            border: "3px solid rgba(34,211,238,0.2)",
            borderTop: "3px solid #22d3ee",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (error && !recording) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: t.pageBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <AlertTriangle size={40} color="#f87171" />
        <p
          style={{
            fontFamily: "'Poppins',sans-serif",
            color: "#f87171",
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          {error}
        </p>
        <button
          onClick={() => navigate("/trainer/recorded-list")}
          style={{
            padding: "8px 20px",
            borderRadius: 10,
            border: "1px solid rgba(244,63,94,0.25)",
            background: "rgba(244,63,94,0.08)",
            color: "#f43f5e",
            fontSize: 11,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "'Poppins',sans-serif",
          }}
        >
          ← Back to Library
        </button>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        .dfade{animation:fadeUp 0.45s ease both}
        @keyframes spin{to{transform:rotate(360deg)}}
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: t.pageBg,
          color: t.text,
          fontFamily: "'Poppins',sans-serif",
        }}
      >
        <div
          style={{ maxWidth: 900, margin: "0 auto", padding: "24px 24px 52px" }}
        >
          {/* HERO */}
          <div
            className="dfade"
            style={{
              borderRadius: 24,
              padding: "26px 32px",
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
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <button
                  onClick={() => navigate("/trainer/recorded-list")}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    border: `1px solid ${t.border}`,
                    background: "transparent",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: t.textMuted,
                  }}
                >
                  <ArrowLeft size={15} />
                </button>
                <div>
                  <p
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      color: t.textSub,
                      fontFamily: "'Poppins',sans-serif",
                      margin: "0 0 6px",
                    }}
                  >
                    Edit Recording
                  </p>
                  <h1
                    style={{
                      fontFamily: "'Poppins',sans-serif",
                      fontWeight: 900,
                      fontSize: "clamp(1.2rem,2.5vw,1.7rem)",
                      color: t.text,
                      margin: 0,
                      lineHeight: 1.1,
                      letterSpacing: "-0.02em",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <Video size={20} color="#22d3ee" />{" "}
                    {recording?.title || "Recording"}
                  </h1>
                </div>
              </div>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "9px 20px",
                  borderRadius: 10,
                  border: "none",
                  background: saved ? "#34d399" : "#22d3ee",
                  color: "#0f172a",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: saving ? "not-allowed" : "pointer",
                  fontFamily: "'Poppins',sans-serif",
                  transition: "all 0.2s",
                  opacity: saving ? 0.7 : 1,
                }}
              >
                {saving ? (
                  <>
                    <span
                      style={{
                        width: 12,
                        height: 12,
                        border: "2px solid rgba(15,23,42,0.3)",
                        borderTop: "2px solid rgba(15,23,42,0.8)",
                        borderRadius: "50%",
                        display: "inline-block",
                        animation: "spin 0.8s linear infinite",
                      }}
                    />{" "}
                    Saving...
                  </>
                ) : saved ? (
                  <>
                    <CheckCircle2 size={14} /> Saved
                  </>
                ) : (
                  <>
                    <Save size={14} /> Save Changes
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ERROR */}
          {error && (
            <div
              style={{
                background: "rgba(248,113,113,0.1)",
                border: "1px solid rgba(248,113,113,0.3)",
                borderRadius: 12,
                padding: "12px 16px",
                marginBottom: 14,
                fontSize: 12,
                color: "#f87171",
                fontFamily: "'Poppins',sans-serif",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              ⚠️ {error}
              <button
                onClick={() => setError(null)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#f87171",
                  cursor: "pointer",
                }}
              >
                <X size={14} />
              </button>
            </div>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 300px",
              gap: 16,
              alignItems: "start",
            }}
          >
            {/* LEFT */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Details */}
              <div
                className="dfade"
                style={{
                  background: t.cardBg,
                  border: `1px solid ${t.border}`,
                  borderRadius: 20,
                  padding: 24,
                  boxShadow: t.shadow,
                }}
              >
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: t.text,
                    fontFamily: "'Poppins',sans-serif",
                    margin: "0 0 18px",
                  }}
                >
                  Video Details
                </p>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 14 }}
                >
                  <div>
                    <label style={lStyle}>Title *</label>
                    <input
                      style={iStyle}
                      value={form.title}
                      onChange={(e) => set("title", e.target.value)}
                      placeholder="Lecture title..."
                    />
                  </div>
                  <div>
                    <label style={lStyle}>Description</label>
                    <textarea
                      style={{ ...iStyle, resize: "vertical", minHeight: 100 }}
                      value={form.description}
                      onChange={(e) => set("description", e.target.value)}
                      placeholder="Describe this recording..."
                    />
                  </div>
                </div>
              </div>

              {/* File Info */}
              <div
                className="dfade"
                style={{
                  background: t.cardBg,
                  border: `1px solid ${t.border}`,
                  borderRadius: 20,
                  padding: 24,
                  boxShadow: t.shadow,
                }}
              >
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: t.text,
                    fontFamily: "'Poppins',sans-serif",
                    margin: "0 0 16px",
                  }}
                >
                  File Information
                </p>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 10,
                  }}
                >
                  {[
                    { label: "File Name", value: recording?.fileName || "—" },
                    { label: "File Size", value: recording?.fileSizeMb || "—" },
                    { label: "File Type", value: recording?.fileType || "—" },
                    {
                      label: "Duration",
                      value: recording?.durationMinutes
                        ? `${recording.durationMinutes} min`
                        : "—",
                    },
                    { label: "Batch", value: recording?.batchName || "—" },
                    { label: "Type", value: recording?.recordingType || "—" },
                    {
                      label: "Uploaded",
                      value: recording?.uploadedAt
                        ? new Date(recording.uploadedAt).toLocaleDateString()
                        : "—",
                    },
                    { label: "Status", value: recording?.status || "—" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      style={{
                        background: t.barBg,
                        borderRadius: 10,
                        padding: "10px 12px",
                      }}
                    >
                      <p
                        style={{
                          fontSize: 9,
                          fontWeight: 700,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          color: t.textMuted,
                          fontFamily: "'Poppins',sans-serif",
                          margin: "0 0 4px",
                        }}
                      >
                        {item.label}
                      </p>
                      <p
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: t.text,
                          fontFamily: "'Poppins',sans-serif",
                          margin: 0,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Replace Video */}
              <div
                className="dfade"
                style={{
                  background: t.cardBg,
                  border: `1px solid ${t.border}`,
                  borderRadius: 20,
                  padding: 24,
                  boxShadow: t.shadow,
                }}
              >
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: t.text,
                    fontFamily: "'Poppins',sans-serif",
                    margin: "0 0 16px",
                  }}
                >
                  Replace Video File
                </p>

                {replaceSuccess ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      color: "#34d399",
                      fontSize: 13,
                      fontWeight: 600,
                      fontFamily: "'Poppins',sans-serif",
                    }}
                  >
                    <CheckCircle2 size={18} /> File replaced! Redirecting...
                  </div>
                ) : replacing ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      color: t.textMuted,
                      fontSize: 12,
                      fontFamily: "'Poppins',sans-serif",
                    }}
                  >
                    <span
                      style={{
                        width: 16,
                        height: 16,
                        border: "2px solid rgba(34,211,238,0.2)",
                        borderTop: "2px solid #22d3ee",
                        borderRadius: "50%",
                        display: "inline-block",
                        animation: "spin 0.8s linear infinite",
                      }}
                    />
                    Replacing video... please wait
                  </div>
                ) : (
                  <>
                    <div
                      onClick={() =>
                        document.getElementById("replace-input").click()
                      }
                      style={{
                        borderRadius: 14,
                        border: `2px dashed ${replaceFile ? "#22d3ee" : t.border}`,
                        background: replaceFile
                          ? "rgba(34,211,238,0.04)"
                          : t.barBg,
                        padding: "32px 24px",
                        textAlign: "center",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      <UploadCloud
                        size={28}
                        color="#22d3ee"
                        style={{ marginBottom: 8 }}
                      />
                      <p
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: t.text,
                          fontFamily: "'Poppins',sans-serif",
                          margin: "0 0 4px",
                        }}
                      >
                        {replaceFile
                          ? replaceFile.name
                          : "Drop a new video file here"}
                      </p>
                      <p
                        style={{
                          fontSize: 11,
                          color: t.textMuted,
                          fontFamily: "'Poppins',sans-serif",
                          margin: 0,
                        }}
                      >
                        {replaceFile
                          ? `${(replaceFile.size / (1024 * 1024)).toFixed(2)} MB`
                          : "Replaces the current file · MP4, MOV, AVI"}
                      </p>
                      <input
                        id="replace-input"
                        type="file"
                        accept="video/*"
                        style={{ display: "none" }}
                        onChange={(e) => {
                          if (e.target.files[0])
                            setReplaceFile(e.target.files[0]);
                        }}
                      />
                    </div>
                    {replaceFile && (
                      <button
                        onClick={() => handleReplaceFile(replaceFile)}
                        style={{
                          width: "100%",
                          marginTop: 10,
                          padding: "10px 0",
                          borderRadius: 10,
                          border: "none",
                          background: "#22d3ee",
                          color: "#0f172a",
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: "pointer",
                          fontFamily: "'Poppins',sans-serif",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 7,
                        }}
                      >
                        <UploadCloud size={14} /> Replace & Publish
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* RIGHT SIDEBAR */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Stats */}
              <div
                className="dfade"
                style={{
                  background: t.cardBg,
                  border: `1px solid ${t.border}`,
                  borderRadius: 20,
                  padding: 20,
                  boxShadow: t.shadow,
                }}
              >
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: t.text,
                    fontFamily: "'Poppins',sans-serif",
                    margin: "0 0 14px",
                  }}
                >
                  Video Stats
                </p>
                {[
                  {
                    icon: <Eye size={13} color="#22d3ee" />,
                    label: "Total Views",
                    value: recording?.viewCount ?? 0,
                  },
                  {
                    icon: <Clock size={13} color="#a78bfa" />,
                    label: "Duration",
                    value: recording?.durationMinutes
                      ? `${recording.durationMinutes} min`
                      : "—",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 0",
                      borderBottom: `1px solid ${t.border}`,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        fontSize: 12,
                        color: t.textSub,
                        fontFamily: "'Poppins',sans-serif",
                      }}
                    >
                      {s.icon} {s.label}
                    </div>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: t.text,
                        fontFamily: "'Poppins',sans-serif",
                      }}
                    >
                      {s.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Status */}
              <div
                className="dfade"
                style={{
                  background: t.cardBg,
                  border: `1px solid ${t.border}`,
                  borderRadius: 20,
                  padding: 20,
                  boxShadow: t.shadow,
                }}
              >
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: t.text,
                    fontFamily: "'Poppins',sans-serif",
                    margin: "0 0 12px",
                  }}
                >
                  Status
                </p>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    letterSpacing: "0.08em",
                    color:
                      recording?.status === "READY"
                        ? "#34d399"
                        : recording?.status === "PROCESSING"
                          ? "#f59e0b"
                          : "#f87171",
                    background:
                      recording?.status === "READY"
                        ? "rgba(52,211,153,0.1)"
                        : recording?.status === "PROCESSING"
                          ? "rgba(245,158,11,0.1)"
                          : "rgba(248,113,113,0.1)",
                    border: `1px solid ${recording?.status === "READY" ? "rgba(52,211,153,0.2)" : recording?.status === "PROCESSING" ? "rgba(245,158,11,0.2)" : "rgba(248,113,113,0.2)"}`,
                    padding: "4px 12px",
                    borderRadius: 999,
                    fontFamily: "'Poppins',sans-serif",
                  }}
                >
                  {recording?.status || "UNKNOWN"}
                </span>
              </div>

              {/* Danger Zone */}
              <div
                className="dfade"
                style={{
                  background: t.cardBg,
                  border: "1px solid rgba(248,113,113,0.2)",
                  borderRadius: 20,
                  padding: 20,
                  boxShadow: t.shadow,
                }}
              >
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#f87171",
                    fontFamily: "'Poppins',sans-serif",
                    margin: "0 0 6px",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <AlertTriangle size={14} /> Danger Zone
                </p>
                <p
                  style={{
                    fontSize: 11,
                    color: t.textMuted,
                    fontFamily: "'Poppins',sans-serif",
                    margin: "0 0 14px",
                  }}
                >
                  Deleting removes the file permanently.
                </p>
                {!showDeleteConfirm ? (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    style={{
                      width: "100%",
                      padding: "9px 0",
                      borderRadius: 10,
                      border: "1px solid rgba(248,113,113,0.3)",
                      background: "rgba(248,113,113,0.08)",
                      color: "#f87171",
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: "pointer",
                      fontFamily: "'Poppins',sans-serif",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                    }}
                  >
                    <Trash2 size={12} /> Delete Recording
                  </button>
                ) : (
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 8 }}
                  >
                    <p
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#f87171",
                        fontFamily: "'Poppins',sans-serif",
                        margin: 0,
                      }}
                    >
                      Are you sure? Cannot be undone.
                    </p>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        style={{
                          flex: 1,
                          padding: "8px 0",
                          borderRadius: 9,
                          border: `1px solid ${t.border}`,
                          background: "transparent",
                          color: t.textMuted,
                          fontSize: 11,
                          fontWeight: 600,
                          cursor: "pointer",
                          fontFamily: "'Poppins',sans-serif",
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleDelete}
                        disabled={deleting}
                        style={{
                          flex: 1,
                          padding: "8px 0",
                          borderRadius: 9,
                          border: "none",
                          background: "#ef4444",
                          color: "#fff",
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: deleting ? "not-allowed" : "pointer",
                          fontFamily: "'Poppins',sans-serif",
                        }}
                      >
                        {deleting ? "Deleting..." : "Yes, Delete"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditRecordedClass;
