import { useState, useEffect } from "react";
import { Video, Clock, ArrowLeft, UploadCloud, X, CheckCircle2, Save, Trash2, Eye, AlertTriangle } from "lucide-react";
import { uploadRecording, getRecordingById, updateRecording, deleteRecording, incrementRecordingViews } from "@/services/liveSessionService";
import { inputStyle, labelStyle } from "../data/utils";
import { FONT_FAMILY, FONT_WEIGHT } from "../data/theme";

export default function PanelEditRecording({ t, isDark, navigate, recordingId, onBack }) {
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

  useEffect(() => {
    if (!recordingId) return;
    (async () => {
      try {
        const res = await getRecordingById(recordingId);
        const data = res.data;
        setRecording(data);
        setForm({
          title: data.title || "",
          description: data.description || "",
        });
        incrementRecordingViews(recordingId).catch(() => {});
      } catch (err) {
        console.error(err);
        setError("Recording not found.");
      } finally {
        setLoading(false);
      }
    })();
  }, [recordingId]);

  const handleSave = async () => {
    if (!form.title.trim()) {
      setError("Title is required");
      return;
    }
    setError(null);
    try {
      setSaving(true);
      const res = await updateRecording(recordingId, {
        title: form.title,
        description: form.description,
      });
      setRecording(res.data);
      setSaved(true);
    } catch (err) {
      console.error(err);
      setError("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteRecording(recordingId);
      onBack();
    } catch (err) {
      console.error(err);
      setError("Failed to delete recording.");
      setDeleting(false);
    }
  };

  const handleReplaceFile = async (file) => {
    if (!file) return;
    setError(null);
    try {
      setReplacing(true);
      const fd = new FormData();
      fd.append("file", file);
      fd.append("title", recording.title);
      fd.append("description", recording.description || "");
      fd.append("batchId", recording.batchId);
      fd.append("batchName", recording.batchName || "");
      if (recording.durationMinutes)
        fd.append("durationMinutes", recording.durationMinutes);
      if (recording.sessionId) fd.append("sessionId", recording.sessionId);
      await deleteRecording(recordingId);
      await uploadRecording(fd);
      setReplaceSuccess(true);
      setTimeout(() => onBack(), 1500);
    } catch (err) {
      console.error(err);
      setError("Failed to replace video file.");
    } finally {
      setReplacing(false);
    }
  };

  const iStyle = inputStyle(t);
  const lStyle = { ...labelStyle(t), fontSize: 11, letterSpacing: "0.04em" };

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px 0",
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            border: "3px solid rgba(34,211,238,0.2)",
            borderTop: "3px solid #22d3ee",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
      </div>
    );
  if (error && !recording)
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px 0",
          gap: 12,
        }}
      >
        <AlertTriangle size={36} color="#f87171" />
        <p
          style={{
            fontFamily: FONT_FAMILY,
            color: "#f87171",
            fontSize: 13,
            fontWeight: FONT_WEIGHT.semibold,
            margin: 0,
          }}
        >
          {error}
        </p>
        <button
          onClick={onBack}
          style={{
            padding: "8px 20px",
            borderRadius: 10,
            border: "1px solid rgba(244,63,94,0.25)",
            background: "rgba(244,63,94,0.08)",
            color: "#f43f5e",
            fontSize: 11,
            fontWeight: FONT_WEIGHT.bold,
            cursor: "pointer",
            fontFamily: FONT_FAMILY,
          }}
        >
          ← Back to Library
        </button>
      </div>
    );

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <button
          onClick={onBack}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            padding: "7px 14px",
            borderRadius: 9,
            border: `1px solid ${t.border}`,
            background: "transparent",
            color: t.textMuted,
            fontSize: 11,
            fontWeight: FONT_WEIGHT.semibold,
            cursor: "pointer",
            fontFamily: FONT_FAMILY,
          }}
        >
          <ArrowLeft size={13} /> Back to Library
        </button>
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
            fontWeight: FONT_WEIGHT.bold,
            cursor: saving ? "not-allowed" : "pointer",
            fontFamily: FONT_FAMILY,
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
            fontFamily: FONT_FAMILY,
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
          gridTemplateColumns: "minmax(280px,1fr) minmax(240px,300px)",
          gap: 16,
          alignItems: "start",
        }}
        className="rlc-sidebar-flex"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
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
                fontWeight: FONT_WEIGHT.bold,
                color: t.text,
                fontFamily: FONT_FAMILY,
                margin: "0 0 18px",
              }}
            >
              Video Details
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
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
                fontWeight: FONT_WEIGHT.bold,
                color: t.text,
                fontFamily: FONT_FAMILY,
                margin: "0 0 16px",
              }}
            >
              File Information
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
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
                      fontWeight: FONT_WEIGHT.bold,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: t.textMuted,
                      fontFamily: FONT_FAMILY,
                      margin: "0 0 4px",
                    }}
                  >
                    {item.label}
                  </p>
                  <p
                    style={{
                      fontSize: 12,
                      fontWeight: FONT_WEIGHT.semibold,
                      color: t.text,
                      fontFamily: FONT_FAMILY,
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
                fontWeight: FONT_WEIGHT.bold,
                color: t.text,
                fontFamily: FONT_FAMILY,
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
                  fontWeight: FONT_WEIGHT.semibold,
                  fontFamily: FONT_FAMILY,
                }}
              >
                <CheckCircle2 size={18} /> File replaced! Going back...
              </div>
            ) : replacing ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  color: t.textMuted,
                  fontSize: 12,
                  fontFamily: FONT_FAMILY,
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
                    document.getElementById("replace-input-inline").click()
                  }
                  style={{
                    borderRadius: 14,
                    border: `2px dashed ${replaceFile ? "#22d3ee" : t.border}`,
                    background: replaceFile ? "rgba(34,211,238,0.04)" : t.barBg,
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
                      fontWeight: FONT_WEIGHT.semibold,
                      color: t.text,
                      fontFamily: FONT_FAMILY,
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
                      fontFamily: FONT_FAMILY,
                      margin: 0,
                    }}
                  >
                    {replaceFile
                      ? `${(replaceFile.size / (1024 * 1024)).toFixed(2)} MB`
                      : "Replaces the current file · MP4, MOV, AVI"}
                  </p>
                  <input
                    id="replace-input-inline"
                    type="file"
                    accept="video/*"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      if (e.target.files[0]) setReplaceFile(e.target.files[0]);
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
                      fontWeight: FONT_WEIGHT.bold,
                      cursor: "pointer",
                      fontFamily: FONT_FAMILY,
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
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
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
                fontWeight: FONT_WEIGHT.bold,
                color: t.text,
                fontFamily: FONT_FAMILY,
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
                    fontFamily: FONT_FAMILY,
                  }}
                >
                  {s.icon} {s.label}
                </div>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: FONT_WEIGHT.bold,
                    color: t.text,
                    fontFamily: FONT_FAMILY,
                  }}
                >
                  {s.value}
                </span>
              </div>
            ))}
          </div>
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
                fontWeight: FONT_WEIGHT.bold,
                color: t.text,
                fontFamily: FONT_FAMILY,
                margin: "0 0 12px",
              }}
            >
              Status
            </p>
            <span
              style={{
                fontSize: 10,
                fontWeight: FONT_WEIGHT.extrabold,
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
                fontFamily: FONT_FAMILY,
              }}
            >
              {recording?.status || "UNKNOWN"}
            </span>
          </div>
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
                fontWeight: FONT_WEIGHT.bold,
                color: "#f87171",
                fontFamily: FONT_FAMILY,
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
                fontFamily: FONT_FAMILY,
                margin: "0 0 14px",
              }}
            >
              Deleting removes the file permanently from the server.
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
                  fontWeight: FONT_WEIGHT.bold,
                  cursor: "pointer",
                  fontFamily: FONT_FAMILY,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                <Trash2 size={12} /> Delete Recording
              </button>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: FONT_WEIGHT.bold,
                    color: "#f87171",
                    fontFamily: FONT_FAMILY,
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
                      fontWeight: FONT_WEIGHT.semibold,
                      cursor: "pointer",
                      fontFamily: FONT_FAMILY,
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
                      fontWeight: FONT_WEIGHT.bold,
                      cursor: deleting ? "not-allowed" : "pointer",
                      fontFamily: FONT_FAMILY,
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
  );
}
