import { useState, useEffect, useRef } from "react";
import { Video, Upload, ChevronDown, UploadCloud, X, CheckCircle2 } from "lucide-react";
import { uploadRecording } from "@/services/liveSessionService";
import { getTrainerBatches } from "@/services/batchService";
import { unwrapBatches, getBatchId, getBatchName, inputStyle, labelStyle } from "../data/utils";
import UploadSubmitBtn from "../components/UploadSubmitBtn";
import { FONT_FAMILY, FONT_WEIGHT } from "../data/theme";

export default function PanelUploadRecorded({ t, isDark, navigate, onSuccess }) {
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
  const [batches, setBatches] = useState([]);
  const [loadingBatches, setLoadingB] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [form, setForm] = useState({
    lectureTitle: "",
    shortDescription: "",
    batchId: "",
    batchName: "",
  });
  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  useEffect(() => {
    (async () => {
      setLoadingB(true);
      try {
        const raw = await getTrainerBatches();
        const list = unwrapBatches(raw);
        setBatches(list);
        if (list.length > 0) {
          const first = list[0];
          const id = getBatchId(first);
          const name = getBatchName(first, id);
          setForm((p) => ({ ...p, batchId: id, batchName: name }));
        }
      } catch (err) {
        console.error(err);
        setBatches([]);
      } finally {
        setLoadingB(false);
      }
    })();
  }, []);

  const handleBatchChange = (value) => {
    const selected = batches.find((b) => getBatchId(b) === String(value));
    setForm((p) => ({
      ...p,
      batchId: String(value),
      batchName: selected ? getBatchName(selected, value) : "",
    }));
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.type.startsWith("video/")) {
      setFile(dropped);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!form.lectureTitle.trim()) {
      setError("Lecture title is required");
      return;
    }
    if (!form.batchId) {
      setError("Please select a batch");
      return;
    }
    if (!file) {
      setError("Please select a video file");
      return;
    }
    setError(null);
    try {
      setUploading(true);
      const fd = new FormData();
      fd.append("file", file);
      fd.append("title", form.lectureTitle);
      fd.append("description", form.shortDescription || "");
      fd.append("batchId", String(form.batchId));
      fd.append("batchName", form.batchName || "");
      await uploadRecording(fd);
      setSuccess(true);
      setTimeout(() => {
        onSuccess && onSuccess();
      }, 1500);
    } catch (err) {
      console.error(err);
      const status = err?.response?.status;
      if (status === 403)
        setError("Access denied (403). Please re-login and try again.");
      else
        setError(
          err?.response?.data?.error || "Upload failed. Please try again.",
        );
    } finally {
      setUploading(false);
    }
  };

  const iStyle = inputStyle(t);
  const lStyle = labelStyle(t);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {uploadSuccess && (
        <div
          className="dfade"
          style={{
            background: "rgba(52,211,153,0.1)",
            border: "1px solid rgba(52,211,153,0.3)",
            borderRadius: 16,
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <CheckCircle2 size={22} color="#34d399" />
          <div>
            <p
              style={{
                fontSize: 13,
                fontWeight: FONT_WEIGHT.bold,
                color: "#34d399",
                margin: 0,
                fontFamily: FONT_FAMILY,
              }}
            >
              Video uploaded successfully!
            </p>
            <p
              style={{
                fontSize: 11,
                color: t.textMuted,
                margin: "3px 0 0",
                fontFamily: FONT_FAMILY,
              }}
            >
              Switching to your video library...
            </p>
          </div>
        </div>
      )}
      {error && (
        <div
          style={{
            background: "rgba(248,113,113,0.1)",
            border: "1px solid rgba(248,113,113,0.3)",
            borderRadius: 12,
            padding: "12px 16px",
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
      {!file ? (
        <div
          onClick={() => fileRef.current.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          style={{
            borderRadius: 20,
            border: `2px dashed ${dragOver ? "#2dd4bf" : t.dropBorder}`,
            background: dragOver
              ? isDark
                ? "rgba(45,212,191,0.05)"
                : "rgba(45,212,191,0.04)"
              : t.dropBg,
            padding: "60px 24px",
            textAlign: "center",
            cursor: "pointer",
            transition: "all 0.2s",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div style={{ animation: "uploadFloat 2.5s ease-in-out infinite" }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 18,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(45,212,191,0.1)",
                border: "1px solid rgba(45,212,191,0.2)",
              }}
            >
              <UploadCloud size={28} color="#2dd4bf" />
            </div>
          </div>
          <div>
            <p
              style={{
                fontFamily: FONT_FAMILY,
                fontWeight: FONT_WEIGHT.bold,
                fontSize: 16,
                color: t.text,
                margin: "0 0 6px",
              }}
            >
              Drop your video here
            </p>
            <p
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 11,
                color: t.textMuted,
                margin: 0,
              }}
            >
              MP4, MOV, AVI — max 500MB
            </p>
          </div>
          <button
            style={{
              padding: "9px 22px",
              borderRadius: 10,
              border: "1px solid rgba(45,212,191,0.3)",
              background: "rgba(45,212,191,0.1)",
              color: "#2dd4bf",
              fontSize: 12,
              fontWeight: FONT_WEIGHT.bold,
              cursor: "pointer",
              fontFamily: FONT_FAMILY,
            }}
          >
            Select File
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="video/*"
            style={{ display: "none" }}
            onChange={(e) => {
              setFile(e.target.files[0]);
              setError(null);
            }}
          />
        </div>
      ) : (
        <>
          <div
            className="dfade"
            style={{
              background: t.cardBg,
              border: `1px solid ${t.border}`,
              borderRadius: 20,
              padding: "16px 20px",
              boxShadow: t.shadow,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(45,212,191,0.1)",
                border: "1px solid rgba(45,212,191,0.2)",
                flexShrink: 0,
              }}
            >
              <Video size={18} color="#2dd4bf" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  fontSize: 12,
                  fontWeight: FONT_WEIGHT.bold,
                  color: t.text,
                  margin: 0,
                  fontFamily: FONT_FAMILY,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {file.name}
              </p>
              <p
                style={{
                  fontSize: 10,
                  color: t.textMuted,
                  margin: "3px 0 0",
                  fontFamily: FONT_FAMILY,
                }}
              >
                {(file.size / (1024 * 1024)).toFixed(2)} MB · {file.type}
              </p>
            </div>
            <button
              onClick={() => {
                setFile(null);
                setError(null);
              }}
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                border: `1px solid ${t.border}`,
                background: "transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: t.textMuted,
              }}
            >
              <X size={14} />
            </button>
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
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={lStyle}>Lecture Title *</label>
                <input
                  style={iStyle}
                  value={form.lectureTitle}
                  onChange={(e) => set("lectureTitle", e.target.value)}
                  placeholder="e.g. React Hooks Deep Dive"
                />
              </div>
              <div>
                <label style={lStyle}>Short Description</label>
                <textarea
                  style={{ ...iStyle, resize: "vertical", minHeight: 80 }}
                  value={form.shortDescription}
                  onChange={(e) => set("shortDescription", e.target.value)}
                  placeholder="Brief overview for students..."
                />
              </div>
              <div>
                <label style={lStyle}>Select Batch *</label>
                {loadingBatches ? (
                  <div
                    style={{
                      ...iStyle,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      color: t.textMuted,
                      cursor: "not-allowed",
                    }}
                  >
                    <span
                      style={{
                        width: 12,
                        height: 12,
                        border: `2px solid ${t.inputBorder}`,
                        borderTop: "2px solid #2dd4bf",
                        borderRadius: "50%",
                        display: "inline-block",
                        animation: "spin 0.8s linear infinite",
                      }}
                    />
                    Loading batches...
                  </div>
                ) : batches.length === 0 ? (
                  <div
                    style={{ ...iStyle, color: "#f87171", cursor: "default" }}
                  >
                    ⚠️ No batches found
                  </div>
                ) : (
                  <div style={{ position: "relative" }}>
                    <select
                      style={{ ...iStyle, cursor: "pointer", paddingRight: 36 }}
                      value={form.batchId}
                      onChange={(e) => handleBatchChange(e.target.value)}
                    >
                      {batches.map((b, i) => {
                        const id = getBatchId(b);
                        const name = getBatchName(b, id);
                        return (
                          <option key={i} value={id}>
                            {name}
                          </option>
                        );
                      })}
                    </select>
                    <ChevronDown
                      size={13}
                      color={t.textMuted}
                      style={{
                        position: "absolute",
                        right: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                        pointerEvents: "none",
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <UploadSubmitBtn
            uploading={uploading}
            success={uploadSuccess}
            onClick={handleUpload}
          />
        </>
      )}
    </div>
  );
}
