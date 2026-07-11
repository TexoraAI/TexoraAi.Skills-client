import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import {
  Plus,
  X,
  Search,
  SlidersHorizontal,
  Eye,
  Edit2,
  Trash2,
  GripVertical,
  Upload,
  Link as LinkIcon,
  FileVideo,
  Image as ImageIcon,
  Quote,
  CheckCircle,
  FileEdit,
  Rocket,
  Loader,
  ListVideo,
  ExternalLink,
} from "lucide-react";
import videoService from "../../../services/videoService";
// ⚠️ Adjust this import path to match where ThemeContext actually lives
// relative to this file (same context used elsewhere in Super Admin).
import { useTheme } from "../../context/ThemeContext";

/* ============================================================
   THEME TOKENS
   ============================================================ */
const getTokens = (dark) => ({
  pageBg: dark ? "#0f1115" : "#f1f3f9",
  surface: dark ? "#1a1d27" : "#ffffff",
  surfaceBorder: dark
    ? "1px solid rgba(255,255,255,0.08)"
    : "1px solid #e5e7eb",
  innerBg: dark ? "rgba(255,255,255,0.04)" : "#f9fafb",
  innerBorder: dark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #e5e7eb",
  textPrimary: dark ? "#f1f5f9" : "#111827",
  textSecondary: dark ? "#cbd5e1" : "#374151",
  textMuted: dark ? "#94a3b8" : "#6b7280",
  textFaint: dark ? "#64748b" : "#9ca3af",
  inputBg: dark ? "rgba(255,255,255,0.05)" : "#ffffff",
  inputBorder: dark ? "1px solid rgba(255,255,255,0.14)" : "1px solid #d1d5db",
  dashedBorder: dark ? "rgba(255,255,255,0.18)" : "#d1d5db",
  dragActiveBg: dark ? "rgba(124,58,237,0.15)" : "#f3f0ff",
  hoverBg: dark ? "rgba(255,255,255,0.04)" : "#fafafa",
  shadow: dark ? "0 1px 6px rgba(0,0,0,0.3)" : "0 1px 6px rgba(0,0,0,0.05)",
  shadowLg: dark
    ? "0 8px 30px rgba(0,0,0,0.45)"
    : "0 8px 30px rgba(0,0,0,0.12)",
  accent: "#7c3aed",
  accentSoft: dark ? "rgba(124,58,237,0.15)" : "#f3f0ff",
});

const getInputStyle = (t) => ({
  width: "100%",
  padding: "9px 12px",
  borderRadius: 8,
  border: t.inputBorder,
  background: t.inputBg,
  color: t.textPrimary,
  fontSize: 13,
  fontFamily: "Inter,sans-serif",
  outline: "none",
  boxSizing: "border-box",
});

function formatDate(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

/* Same detection pattern used on the public WatchNow card —
   kept small/local here just for the admin preview modal. */
function parseVideoUrl(rawUrl) {
  if (!rawUrl) return null;
  const url = rawUrl.trim();
  const ytMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/embed\/)([\w-]{11})/,
  );
  if (ytMatch)
    return {
      type: "iframe",
      url: `https://www.youtube.com/embed/${ytMatch[1]}`,
    };
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch)
    return {
      type: "iframe",
      url: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
    };
  if (/\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(url))
    return { type: "video", url };
  return { type: "iframe", url };
}

function StatusBadge({ status, dark }) {
  const isPublished = status === "published";
  const cfg = isPublished
    ? dark
      ? {
          bg: "rgba(34,197,94,0.15)",
          color: "#4ade80",
          border: "rgba(74,222,128,0.35)",
        }
      : { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" }
    : dark
      ? {
          bg: "rgba(217,119,6,0.15)",
          color: "#fbbf24",
          border: "rgba(251,191,36,0.35)",
        }
      : { bg: "#fffbeb", color: "#d97706", border: "#fde68a" };
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 700,
        padding: "3px 10px",
        borderRadius: 999,
        background: cfg.bg,
        color: cfg.color,
        border: `1px solid ${cfg.border}`,
        fontFamily: "Inter,sans-serif",
        whiteSpace: "nowrap",
      }}
    >
      {isPublished ? "Published" : "Draft"}
    </span>
  );
}

/* ============================================================
   STAT CARDS — same visual pattern as Featured Programs
   (Total / Active / Inactive / Categories), adapted to stories.
   ============================================================ */
function StatsBar({ t, stats, loading, statusFilter, setStatusFilter }) {
  const cards = [
    {
      key: "",
      label: "Total Stories",
      value: stats.totalStories,
      gradient: "linear-gradient(135deg, #3b82f6, #2563eb)",
      icon: ListVideo,
    },
    {
      key: "published",
      label: "Published",
      value: stats.publishedStories,
      gradient: "linear-gradient(135deg, #22c55e, #15803d)",
      icon: CheckCircle,
    },
    {
      key: "draft",
      label: "Draft",
      value: stats.draftStories,
      gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
      icon: FileEdit,
    },
    {
      key: "",
      label: "External Links",
      value: stats.externalVideos,
      gradient: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
      icon: ExternalLink,
      nonFilter: true,
    },
  ];
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      {cards.map((c) => {
        const isActive = !c.nonFilter && statusFilter === c.key && c.key !== "";
        return (
          <button
            key={c.label}
            type="button"
            disabled={c.nonFilter}
            onClick={() =>
              !c.nonFilter &&
              setStatusFilter(statusFilter === c.key ? "" : c.key)
            }
            style={{
              textAlign: "left",
              padding: "16px 18px",
              borderRadius: 16,
              background: c.gradient,
              border: "none",
              cursor: c.nonFilter ? "default" : "pointer",
              boxShadow: isActive
                ? "0 0 0 3px rgba(255,255,255,0.55), 0 10px 24px rgba(0,0,0,0.18)"
                : "0 6px 18px rgba(0,0,0,0.12)",
              fontFamily: "Inter,sans-serif",
              flex: "1 1 150px",
              minWidth: 150,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <c.icon
              size={64}
              color="rgba(255,255,255,0.12)"
              style={{ position: "absolute", right: -10, top: -10 }}
            />
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 9,
                background: "rgba(255,255,255,0.22)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12,
              }}
            >
              <c.icon size={16} color="#fff" />
            </div>
            <p
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: "#fff",
                margin: 0,
                lineHeight: 1,
              }}
            >
              {loading ? "—" : c.value}
            </p>
            <p
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "rgba(255,255,255,0.92)",
                margin: "5px 0 0",
              }}
            >
              {c.label}
            </p>
          </button>
        );
      })}
    </div>
  );
}

/* ============================================================
   VIDEO SOURCE FIELD — toggle between Upload File / Paste URL
   ============================================================ */
function VideoSourceField({
  mode,
  setMode,
  videoFile,
  setVideoFile,
  externalUrl,
  setExternalUrl,
  t,
}) {
  const inputRef = useRef(null);
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        {["file", "url"].map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              padding: "8px 10px",
              borderRadius: 8,
              border: mode === m ? "none" : t.inputBorder,
              background: mode === m ? t.accent : t.inputBg,
              color: mode === m ? "#fff" : t.textSecondary,
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "Inter,sans-serif",
            }}
          >
            {m === "file" ? <FileVideo size={13} /> : <LinkIcon size={13} />}
            {m === "file" ? "Upload Video File" : "Paste Video URL"}
          </button>
        ))}
      </div>

      {mode === "file" ? (
        <>
          <input
            ref={inputRef}
            type="file"
            accept="video/*"
            style={{ display: "none" }}
            onChange={(e) => setVideoFile(e.target.files[0] || null)}
          />
          <div
            onClick={() => inputRef.current?.click()}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "9px 12px",
              borderRadius: 8,
              cursor: "pointer",
              border: t.inputBorder,
              background: t.inputBg,
            }}
          >
            <Upload size={14} color={t.textMuted} />
            <span
              style={{
                fontSize: 12,
                color: videoFile ? t.textPrimary : t.textFaint,
                fontFamily: "Inter,sans-serif",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {videoFile?.name || "Upload video file (MP4, WebM, MOV)"}
            </span>
          </div>
        </>
      ) : (
        <input
          type="text"
          value={externalUrl}
          onChange={(e) => setExternalUrl(e.target.value)}
          placeholder="https://youtube.com/watch?v=… or https://vimeo.com/…"
          style={getInputStyle(t)}
        />
      )}
    </div>
  );
}

function ThumbnailField({ preview, onChange, t }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const handleFile = (file) => {
    if (!file || !file.type?.startsWith("image/")) return;
    onChange(file);
  };
  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => handleFile(e.target.files[0])}
      />
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFile(e.dataTransfer.files[0]);
        }}
        style={{
          position: "relative",
          aspectRatio: "16 / 9",
          borderRadius: 10,
          cursor: "pointer",
          border: `1.5px dashed ${dragOver ? "#7c3aed" : t.dashedBorder}`,
          background: dragOver ? t.dragActiveBg : t.innerBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {preview ? (
          <>
            <img
              src={preview}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
              }}
              style={{
                position: "absolute",
                top: 6,
                right: 6,
                width: 22,
                height: 22,
                borderRadius: "50%",
                border: "none",
                background: "rgba(0,0,0,0.6)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <X size={12} />
            </button>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: 12 }}>
            <ImageIcon
              size={20}
              color={t.textFaint}
              style={{ margin: "0 auto 6px" }}
            />
            <p
              style={{
                fontSize: 11,
                color: t.textMuted,
                margin: 0,
                fontFamily: "Inter,sans-serif",
              }}
            >
              Click or drag a thumbnail image
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, required, children, t }) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          color: t.textMuted,
          fontFamily: "Inter,sans-serif",
          marginBottom: 6,
        }}
      >
        {label} {required && <span style={{ color: "#7c3aed" }}>*</span>}
      </label>
      {children}
    </div>
  );
}

/* ============================================================
   STORY EDITOR — create / edit form (matches the "New Story" card)
   ============================================================ */
function StoryEditor({ t, initial, onCancel, onSaved }) {
  const isEdit = !!initial?.id;
  const [quote, setQuote] = useState(initial?.quote || "");
  const [personName, setPersonName] = useState(initial?.personName || "");
  const [personRole, setPersonRole] = useState(initial?.personRole || "");
  const [mode, setMode] = useState(initial?.externalVideoUrl ? "url" : "file");
  const [videoFile, setVideoFile] = useState(null);
  const [externalUrl, setExternalUrl] = useState(
    initial?.externalVideoUrl || "",
  );
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(
    initial?.thumbnail
      ? videoService.getWatchNowStreamUrl(initial.thumbnail)
      : null,
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleThumbnailChange = (file) => {
    if (!file) {
      setThumbnailFile(null);
      setThumbnailPreview(null);
      return;
    }
    setThumbnailFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setThumbnailPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const buildFormData = (status) => {
    const fd = new FormData();
    fd.append("quote", quote);
    fd.append("personName", personName);
    fd.append("personRole", personRole);
    fd.append("status", status);
    fd.append("sortOrder", initial?.sortOrder ?? 0);
    if (mode === "url") {
      fd.append("externalVideoUrl", externalUrl.trim());
    } else if (videoFile) {
      fd.append("video", videoFile);
    }
    if (thumbnailFile) fd.append("thumbnail", thumbnailFile);
    return fd;
  };

  const validate = () => {
    if (!quote.trim()) return "Quote is required.";
    if (!personName.trim()) return "Person name is required.";
    if (!personRole.trim()) return "Person role is required.";
    if (!isEdit && !thumbnailFile) return "Thumbnail is required.";
    if (mode === "url" && !externalUrl.trim())
      return "Paste a video URL, or switch to Upload Video File.";
    if (mode === "file" && !isEdit && !videoFile)
      return "Upload a video file, or switch to Paste Video URL.";
    return "";
  };

  const submit = async (status) => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setError("");
    setSaving(status === "published" ? "publish" : "draft");
    try {
      const fd = buildFormData(status);
      if (isEdit) {
        await videoService.updateWatchNow(initial.id, fd);
      } else {
        await videoService.uploadWatchNow(fd);
      }
      onSaved();
    } catch (e) {
      setError(
        e?.response?.data?.message || "Something went wrong saving this story.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        border: t.surfaceBorder,
        borderRadius: 14,
        background: t.surface,
        padding: 20,
        marginBottom: 18,
        boxShadow: t.shadowLg,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <h3
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            fontSize: 14,
            fontWeight: 700,
            color: t.textPrimary,
            margin: 0,
            fontFamily: "Inter,sans-serif",
          }}
        >
          <Quote size={15} color="#7c3aed" />{" "}
          {isEdit ? "Edit Story" : "New Story"}
        </h3>
        <button
          onClick={onCancel}
          style={{
            width: 26,
            height: 26,
            borderRadius: 7,
            border: t.inputBorder,
            background: t.inputBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <X size={13} color={t.textMuted} />
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Field label="Quote" required t={t}>
            <textarea
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="What did they say about their experience?"
              rows={4}
              style={{
                ...getInputStyle(t),
                resize: "vertical",
                fontFamily: "Inter,sans-serif",
              }}
            />
          </Field>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <Field label="Person Name" required t={t}>
              <input
                value={personName}
                onChange={(e) => setPersonName(e.target.value)}
                placeholder="e.g. Priya Nair"
                style={getInputStyle(t)}
              />
            </Field>
            <Field label="Person Role" required t={t}>
              <input
                value={personRole}
                onChange={(e) => setPersonRole(e.target.value)}
                placeholder="e.g. Software Engineer @ Acme"
                style={getInputStyle(t)}
              />
            </Field>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Field label="Video Source" required t={t}>
            <VideoSourceField
              mode={mode}
              setMode={setMode}
              videoFile={videoFile}
              setVideoFile={setVideoFile}
              externalUrl={externalUrl}
              setExternalUrl={setExternalUrl}
              t={t}
            />
          </Field>
          <Field label="Thumbnail" required t={t}>
            <ThumbnailField
              preview={thumbnailPreview}
              onChange={handleThumbnailChange}
              t={t}
            />
          </Field>
        </div>
      </div>

      {error && (
        <p
          style={{
            fontSize: 12,
            color: "#dc2626",
            marginTop: 14,
            fontFamily: "Inter,sans-serif",
          }}
        >
          {error}
        </p>
      )}

      <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
        <button
          type="button"
          disabled={!!saving}
          onClick={() => submit("draft")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "9px 16px",
            borderRadius: 8,
            border: "none",
            background: t.accentSoft,
            color: t.accent,
            fontSize: 12.5,
            fontWeight: 700,
            cursor: saving ? "default" : "pointer",
            opacity: saving ? 0.7 : 1,
            fontFamily: "Inter,sans-serif",
          }}
        >
          <FileEdit size={13} />{" "}
          {saving === "draft" ? "Saving…" : "Save as Draft"}
        </button>
        <button
          type="button"
          disabled={!!saving}
          onClick={() => submit("published")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "9px 16px",
            borderRadius: 8,
            border: "none",
            background: "linear-gradient(135deg,#7c3aed,#6d28d9)",
            color: "#fff",
            fontSize: 12.5,
            fontWeight: 700,
            cursor: saving ? "default" : "pointer",
            opacity: saving ? 0.7 : 1,
            fontFamily: "Inter,sans-serif",
          }}
        >
          <Rocket size={13} />{" "}
          {saving === "publish" ? "Publishing…" : "Publish"}
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   PREVIEW MODAL — Eye icon opens this
   ============================================================ */
function PreviewModal({ t, item, onClose }) {
  if (!item) return null;
  const rawUrl = item.videoFileName
    ? videoService.getWatchNowStreamUrl(item.videoFileName)
    : item.externalVideoUrl;
  const parsed = item.videoFileName
    ? { type: "video", url: rawUrl }
    : parseVideoUrl(rawUrl);

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        zIndex: 999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          width: "min(640px, 100%)",
          background: t.surface,
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: t.shadowLg,
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "16/9",
            background: "#000",
          }}
        >
          {parsed?.type === "video" ? (
            <video
              src={parsed.url}
              controls
              autoPlay
              className="w-full h-full"
              style={{ width: "100%", height: "100%" }}
            />
          ) : parsed ? (
            <iframe
              src={`${parsed.url}${parsed.url.includes("?") ? "&" : "?"}autoplay=1`}
              title={item.personName}
              style={{ width: "100%", height: "100%", border: "none" }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : null}
        </div>
        <div style={{ padding: 18 }}>
          <p
            style={{
              fontSize: 13,
              color: t.textSecondary,
              fontStyle: "italic",
              margin: "0 0 10px",
              fontFamily: "Inter,sans-serif",
            }}
          >
            "{item.quote}"
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: t.textPrimary,
                  margin: 0,
                  fontFamily: "Inter,sans-serif",
                }}
              >
                {item.personName}
              </p>
              <p
                style={{
                  fontSize: 11.5,
                  color: t.textMuted,
                  margin: "2px 0 0",
                  fontFamily: "Inter,sans-serif",
                }}
              >
                {item.personRole}
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                padding: "7px 14px",
                borderRadius: 8,
                border: t.inputBorder,
                background: t.inputBg,
                color: t.textSecondary,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "Inter,sans-serif",
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   MAIN
   ============================================================ */
export default function AdminWatchNowManagement() {
  const { dark } = useTheme();
  const t = getTokens(dark);

  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({
    totalStories: 0,
    publishedStories: 0,
    draftStories: 0,
    uploadedVideos: 0,
    externalVideos: 0,
  });
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null = closed, {} = new, {...} = edit
  const [previewItem, setPreviewItem] = useState(null);
  const [toast, setToast] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const dragIndexRef = useRef(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setStatsLoading(true);
    try {
      const [{ data: list }, { data: statsData }] = await Promise.all([
        videoService.getWatchNowAll(),
        videoService.getWatchNowStats(),
      ]);
      setItems(
        Array.isArray(list)
          ? [...list].sort((a, b) => a.sortOrder - b.sortOrder)
          : [],
      );
      setStats(statsData || stats);
    } catch (e) {
      console.error("Failed to load WatchNow stories", e);
    } finally {
      setLoading(false);
      setStatsLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((v) => {
      const matchesSearch =
        !q ||
        v.quote?.toLowerCase().includes(q) ||
        v.personName?.toLowerCase().includes(q) ||
        v.personRole?.toLowerCase().includes(q);
      const matchesStatus = !statusFilter || v.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [items, search, statusFilter]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this story? This cannot be undone.")) return;
    try {
      await videoService.deleteWatchNow(id);
      setItems((prev) => prev.filter((v) => v.id !== id));
      loadAll();
    } catch (e) {
      console.error("Delete failed", e);
    }
  };

  const persistOrder = async (nextItems) => {
    setItems(nextItems);
    try {
      await videoService.reorderWatchNow(nextItems.map((v) => v.id));
    } catch (e) {
      console.error("Reorder failed", e);
      loadAll();
    }
  };

  const handleDrop = (targetIdx) => {
    const from = dragIndexRef.current;
    dragIndexRef.current = null;
    if (from == null || from === targetIdx) return;
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(targetIdx, 0, moved);
    persistOrder(next);
  };

  const handleSaved = () => {
    setEditing(null);
    setToast("Story saved.");
    setTimeout(() => setToast(""), 2500);
    loadAll();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: t.pageBg,
        fontFamily: "Inter,sans-serif",
      }}
    >
      <div
        style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 22px 60px" }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 18,
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <p
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: t.accent,
                margin: "0 0 4px",
              }}
            >
              WatchNow › Stories
            </p>
            <h1
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: t.textPrimary,
                margin: 0,
              }}
            >
              WatchNow Management
            </h1>
            <p
              style={{ fontSize: 12.5, color: t.textMuted, margin: "3px 0 0" }}
            >
              Manage video testimonial stories shown on the WatchNow page
            </p>
          </div>
          {!editing && (
            <button
              type="button"
              onClick={() => setEditing({})}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "10px 18px",
                borderRadius: 10,
                border: "none",
                background: "linear-gradient(135deg,#7c3aed,#6d28d9)",
                color: "#fff",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(124,58,237,0.35)",
              }}
            >
              <Plus size={14} /> Add Story
            </button>
          )}
        </div>

        {/* Stats */}
        <div style={{ marginBottom: 18 }}>
          <StatsBar
            t={t}
            stats={stats}
            loading={statsLoading}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
        </div>

        {toast && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 14,
              fontSize: 12,
              color: "#16a34a",
              background: dark ? "rgba(34,197,94,0.1)" : "#f0fdf4",
              border: `1px solid ${dark ? "rgba(74,222,128,0.3)" : "#bbf7d0"}`,
              borderRadius: 8,
              padding: "8px 12px",
            }}
          >
            <CheckCircle size={14} /> {toast}
          </div>
        )}

        {editing && (
          <StoryEditor
            t={t}
            initial={editing}
            onCancel={() => setEditing(null)}
            onSaved={handleSaved}
          />
        )}

        {/* Search + filter row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexWrap: "wrap",
            marginBottom: 14,
          }}
        >
          <div
            style={{ position: "relative", flex: "1 1 220px", minWidth: 220 }}
          >
            <Search
              size={14}
              color={t.textFaint}
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
              }}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by quote, name, or role…"
              style={{ ...getInputStyle(t), paddingLeft: 34, height: 38 }}
            />
          </div>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 8,
              border: t.inputBorder,
              background: t.inputBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <SlidersHorizontal size={14} color={t.textMuted} />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              ...getInputStyle(t),
              height: 38,
              width: 150,
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: t.textFaint,
              whiteSpace: "nowrap",
            }}
          >
            {filtered.length} result{filtered.length === 1 ? "" : "s"}
          </span>
        </div>

        {/* Table */}
        <div
          style={{
            background: t.surface,
            border: t.surfaceBorder,
            borderRadius: 14,
            overflow: "hidden",
          }}
        >
          {loading ? (
            <div
              style={{ display: "flex", justifyContent: "center", padding: 60 }}
            >
              <Loader
                size={18}
                color={t.textMuted}
                style={{ animation: "spin 1s linear infinite" }}
              />
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "50px 16px" }}>
              <Quote
                size={20}
                color={t.textFaint}
                style={{ margin: "0 auto 10px" }}
              />
              <p
                style={{
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: t.textPrimary,
                  margin: "0 0 3px",
                }}
              >
                {items.length === 0
                  ? "No stories yet"
                  : "No stories match your filters"}
              </p>
              <p style={{ fontSize: 11.5, color: t.textMuted, margin: 0 }}>
                {items.length === 0
                  ? 'Click "Add Story" to create your first WatchNow testimonial.'
                  : "Try clearing the search or status filter."}
              </p>
            </div>
          ) : (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "28px 64px 2fr 1.2fr 100px 90px 140px 100px",
                  gap: 12,
                  padding: "10px 16px",
                  borderBottom: t.surfaceBorder,
                  background: t.innerBg,
                }}
              >
                {[
                  "",
                  "THUMB",
                  "QUOTE",
                  "PERSON",
                  "SOURCE",
                  "STATUS",
                  "CREATED",
                  "ACTIONS",
                ].map((h) => (
                  <span
                    key={h}
                    style={{
                      fontSize: 10.5,
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      color: t.textFaint,
                      textTransform: "uppercase",
                    }}
                  >
                    {h}
                  </span>
                ))}
              </div>
              {filtered.map((item, idx) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={() => (dragIndexRef.current = idx)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(idx)}
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "28px 64px 2fr 1.2fr 100px 90px 140px 100px",
                    gap: 12,
                    alignItems: "center",
                    padding: "10px 16px",
                    borderBottom:
                      idx < filtered.length - 1 ? t.surfaceBorder : "none",
                    cursor: "grab",
                  }}
                >
                  <GripVertical size={14} color={t.textFaint} />
                  <img
                    src={videoService.getWatchNowStreamUrl(item.thumbnail)}
                    alt=""
                    style={{
                      width: 56,
                      height: 36,
                      borderRadius: 6,
                      objectFit: "cover",
                      background: t.innerBg,
                    }}
                  />
                  <span
                    style={{
                      fontSize: 12.5,
                      color: t.textSecondary,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    title={item.quote}
                  >
                    "{item.quote}"
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: 12.5,
                        fontWeight: 600,
                        color: t.textPrimary,
                        margin: 0,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.personName}
                    </p>
                    <p
                      style={{
                        fontSize: 11,
                        color: t.textMuted,
                        margin: "2px 0 0",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.personRole}
                    </p>
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      color: t.textMuted,
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    {item.videoFileName ? (
                      <Upload size={11} />
                    ) : (
                      <LinkIcon size={11} />
                    )}
                    {item.videoFileName ? "Uploaded" : "External"}
                  </span>
                  <StatusBadge status={item.status} dark={dark} />
                  <span style={{ fontSize: 11, color: t.textFaint }}>
                    {formatDate(item.createdAt)}
                  </span>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <button
                      onClick={() => setPreviewItem(item)}
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 6,
                        border: t.inputBorder,
                        background: t.inputBg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                    >
                      <Eye size={12} color={t.textMuted} />
                    </button>
                    <button
                      onClick={() => setEditing(item)}
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 6,
                        border: t.inputBorder,
                        background: t.inputBg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                    >
                      <Edit2 size={12} color={t.textMuted} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 6,
                        border: dark
                          ? "1px solid rgba(248,113,113,0.3)"
                          : "1px solid #fecaca",
                        background: dark ? "rgba(239,68,68,0.12)" : "#fef2f2",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                    >
                      <Trash2 size={12} color={dark ? "#f87171" : "#dc2626"} />
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {previewItem && (
        <PreviewModal
          t={t}
          item={previewItem}
          onClose={() => setPreviewItem(null)}
        />
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
