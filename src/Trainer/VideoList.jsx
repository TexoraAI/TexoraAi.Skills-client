import React, { useEffect, useRef, useState } from "react";
import {
  Play,
  Trash2,
  Film,
  Tag,
  Globe,
  BookOpen,
  AlignLeft,
  Layers,
  Link,
  Send,
  Pencil,
  X,
  Upload,
  Video as VideoIcon,
} from "lucide-react";
import videoService from "../services/videoService";

// ─── Global Design System — single source of truth for colors, type,
// spacing, radius, StatCard, PageContainer and Hero. This page now visually
// matches the Trainer Dashboard (Golden Reference) instead of redeclaring
// its own theme tokens.
import {
  T,
  FONT_FAMILY,
  FONT_WEIGHT,
  RADIUS,
  CARD_PADDING,
  ACCENT_PURPLE,
  PageContainer,
  Hero,
  StatCard,
} from "@/design-system";

const FF = FONT_FAMILY;

/* ─── URL embed parser (unchanged business logic) ─── */
const parseVideoUrl = (rawUrl) => {
  if (!rawUrl || !rawUrl.trim()) return null;
  const url = rawUrl.trim();
  const ytWatch = url.match(
    /(?:youtube\.com\/watch\?(?:.*&)?v=|youtu\.be\/)([\w-]{11})/,
  );
  const ytShorts = url.match(/youtube\.com\/shorts\/([\w-]{11})/);
  const ytEmbed = url.match(/youtube\.com\/embed\/([\w-]{11})/);
  if (ytWatch || ytShorts || ytEmbed) {
    const id = (ytWatch || ytShorts || ytEmbed)[1];
    return {
      type: "iframe",
      url: `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`,
    };
  }
  const vimeo = url.match(/(?:vimeo\.com\/(?:video\/)?)(\d+)/);
  if (vimeo)
    return {
      type: "iframe",
      url: `https://player.vimeo.com/video/${vimeo[1]}`,
    };
  if (/\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(url))
    return { type: "video", url };
  if (
    url.includes("youtube.com/embed/") ||
    url.includes("player.vimeo.com/video/")
  )
    return { type: "iframe", url };
  return { type: "video", url };
};

const getVideoSourceUrl = (video) =>
  video.videoUrl ||
  video.originalUrl ||
  video.sourceUrl ||
  video.url ||
  video.embedUrl ||
  null;

/* ─── SmartPlayer (unchanged business logic) ─── */
const SmartPlayer = ({ blobUrl, sourceUrl, style = {} }) => {
  const base = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    border: "none",
    ...style,
  };
  if (blobUrl) return <video src={blobUrl} controls style={base} />;
  if (sourceUrl) {
    const parsed = parseVideoUrl(sourceUrl);
    if (!parsed) return null;
    if (parsed.type === "iframe")
      return (
        <iframe
          src={parsed.url}
          style={{ ...base, objectFit: undefined }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Video player"
        />
      );
    return <video src={parsed.url} controls style={base} />;
  }
  return null;
};

/* ─── Pill badge — matches design-system pill visual language ─── */
const Pill = ({ bg, color, children }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 3,
      padding: "3px 9px",
      borderRadius: RADIUS.pill,
      background: bg,
      color,
      fontSize: 10,
      fontWeight: FONT_WEIGHT.bold,
      fontFamily: FF,
      whiteSpace: "nowrap",
      letterSpacing: "0.02em",
    }}
  >
    {children}
  </span>
);

const UrlBadge = ({ t }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 3,
      padding: "2px 8px",
      borderRadius: RADIUS.pill,
      background: t.pillBg,
      border: `1px solid ${t.pillBorder}`,
      color: t.pillText,
      fontSize: 9,
      fontWeight: FONT_WEIGHT.bold,
      fontFamily: FF,
    }}
  >
    <Link size={8} /> URL
  </span>
);

/* ─── Publish button (unchanged business logic, restyled) ─── */
const PublishButton = ({ video, onPublished }) => {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const handlePublish = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await videoService.publishVideo(video.id);
      onPublished(res.data);
    } catch (err) {
      setError("Failed to publish");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <button
        onClick={handlePublish}
        disabled={saving}
        className="vl-publish-btn"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "7px 14px",
          borderRadius: RADIUS.button,
          border: "1px solid rgba(34,197,94,0.4)",
          background: saving ? "rgba(34,197,94,0.05)" : "rgba(34,197,94,0.08)",
          color: "#22c55e",
          fontSize: 11,
          fontWeight: FONT_WEIGHT.bold,
          cursor: saving ? "not-allowed" : "pointer",
          fontFamily: FF,
          opacity: saving ? 0.6 : 1,
        }}
      >
        <Send size={11} />
        {saving ? "Publishing…" : "Publish Now"}
      </button>
      {error && (
        <span style={{ fontSize: 10, color: "#f87171", fontFamily: FF }}>
          {error}
        </span>
      )}
    </div>
  );
};

/* ─── Assign Batch button (unchanged business logic, restyled) ─── */
const AssignBatchButton = ({ video, onAssigned, t }) => {
  const [batches, setBatches] = useState([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open && batches.length === 0) {
      videoService
        .getTrainerBatches()
        .then((res) => setBatches(res.data || []))
        .catch(() => setError("Failed to load batches"));
    }
  }, [open]);

  const handleAssign = async () => {
    if (!selected) return;
    setSaving(true);
    setError("");
    try {
      const res = await videoService.assignBatch(video.id, selected);
      onAssigned(res.data);
      setOpen(false);
      setSelected("");
    } catch (err) {
      setError("Failed to assign batch");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (!open)
    return (
      <button
        onClick={() => setOpen(true)}
        className="vl-assign-btn"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          padding: "6px 12px",
          borderRadius: RADIUS.button,
          border: "1px solid rgba(251,146,60,0.4)",
          background: "rgba(251,146,60,0.08)",
          color: "#fb923c",
          fontSize: 11,
          fontWeight: FONT_WEIGHT.bold,
          cursor: "pointer",
          fontFamily: FF,
        }}
      >
        ⚠ No Batch — Assign
      </button>
    );

  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}
    >
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        style={{
          fontSize: 12,
          padding: "7px 9px",
          borderRadius: RADIUS.chip,
          border: `1px solid ${t.border}`,
          background: t.inputBg,
          color: t.text,
          fontFamily: FF,
          outline: "none",
          cursor: "pointer",
        }}
      >
        <option value="">Select batch…</option>
        {batches.map((b) => (
          <option key={b.id} value={b.id}>
            {b.name || `Batch ${b.id}`} (ID: {b.id})
          </option>
        ))}
      </select>
      {error && (
        <span style={{ fontSize: 10, color: "#f87171", fontFamily: FF }}>
          {error}
        </span>
      )}
      <div style={{ display: "flex", gap: 6 }}>
        <button
          onClick={handleAssign}
          disabled={!selected || saving}
          style={{
            padding: "6px 14px",
            borderRadius: RADIUS.button,
            border: "none",
            background: "#2563eb",
            color: "#fff",
            fontSize: 11,
            fontWeight: FONT_WEIGHT.bold,
            cursor: "pointer",
            fontFamily: FF,
            opacity: !selected || saving ? 0.5 : 1,
          }}
        >
          {saving ? "Saving…" : "Assign"}
        </button>
        <button
          onClick={() => {
            setOpen(false);
            setError("");
            setSelected("");
          }}
          style={{
            padding: "6px 12px",
            borderRadius: RADIUS.button,
            border: `1px solid ${t.border}`,
            background: "transparent",
            color: t.textSub,
            fontSize: 11,
            cursor: "pointer",
            fontFamily: FF,
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════════
   EDIT MODAL — business logic unchanged, restyled to design system
════════════════════════════════════════════════════════════════════ */
const EditModal = ({ video, t, onClose, onSaved }) => {
  const isUrlVideo = !!getVideoSourceUrl(video);

  const [title, setTitle] = useState(video.title || "");
  const [description, setDescription] = useState(video.description || "");
  const [tags, setTags] = useState(
    Array.isArray(video.tags) ? video.tags.join(", ") : video.tags || "",
  );
  const [category, setCategory] = useState(video.category || "");
  const [language, setLanguage] = useState(video.language || "English");
  const [visibility, setVisibility] = useState(video.visibility || "public");
  const [audience, setAudience] = useState(video.audience || "not-kids");
  const [ageRestrict, setAgeRestrict] = useState(video.ageRestrict || false);
  const [course, setCourse] = useState(video.course || "");
  const [status, setStatus] = useState(video.status || "draft");

  const [newUrl, setNewUrl] = useState("");
  const [newFile, setNewFile] = useState(null);
  const fileRef = useRef();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const labelStyle = {
    fontSize: 10,
    fontWeight: FONT_WEIGHT.bold,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: t.textMuted,
    fontFamily: FF,
    marginBottom: 5,
    display: "block",
  };
  const inputStyle = {
    width: "100%",
    fontSize: 12,
    padding: "8px 11px",
    borderRadius: RADIUS.chip,
    border: `1px solid ${t.border}`,
    background: t.inputBg,
    color: t.text,
    fontFamily: FF,
    outline: "none",
    boxSizing: "border-box",
  };
  const rowStyle = { display: "flex", flexDirection: "column", gap: 3 };

  const handleSave = async () => {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    setSaving(true);
    setError("");

    const tagList = tags
      .split(",")
      .map((tg) => tg.trim())
      .filter(Boolean);
    const opts = {
      tags: tagList,
      category,
      language,
      visibility,
      audience,
      ageRestrict,
      course,
      status,
    };

    try {
      let res;
      if (isUrlVideo) {
        res = await videoService.editVideoUrl(
          video.id,
          newUrl || null,
          title,
          description,
          video.batchId || null,
          opts,
        );
      } else {
        res = await videoService.editVideo(
          video.id,
          newFile || null,
          title,
          description,
          video.batchId || null,
          opts,
        );
      }
      onSaved(res.data);
      onClose();
    } catch (err) {
      console.error("Edit failed", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to save changes",
      );
    } finally {
      setSaving(false);
    }
  };

  const backdropRef = useRef();
  const handleBackdrop = (e) => {
    if (e.target === backdropRef.current) onClose();
  };

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdrop}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: t.modalOverlay,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        style={{
          background: t.cardBg,
          borderRadius: RADIUS.standardCard,
          width: "100%",
          maxWidth: 520,
          maxHeight: "90vh",
          overflowY: "auto",
          padding: 24,
          position: "relative",
          border: `1px solid ${t.border}`,
          boxShadow: t.shadowHov,
          fontFamily: FF,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: 15,
                fontWeight: FONT_WEIGHT.bold,
                color: t.text,
                fontFamily: FF,
              }}
            >
              Edit Video
            </h3>
            <p
              style={{
                margin: "2px 0 0",
                fontSize: 11,
                color: t.textSub,
                fontFamily: FF,
              }}
            >
              {isUrlVideo ? "URL-based video" : "File upload video"} · ID{" "}
              {video.id}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: t.textSub,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 4,
              borderRadius: RADIUS.chip,
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={rowStyle}>
            <label style={labelStyle}>Title *</label>
            <input
              style={inputStyle}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Video title"
            />
          </div>

          <div style={rowStyle}>
            <label style={labelStyle}>Description</label>
            <textarea
              style={{
                ...inputStyle,
                minHeight: 68,
                resize: "vertical",
                lineHeight: 1.5,
              }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description…"
            />
          </div>

          {isUrlVideo ? (
            <div style={rowStyle}>
              <label style={labelStyle}>
                Replace URL{" "}
                <span
                  style={{
                    fontWeight: 400,
                    opacity: 0.6,
                    textTransform: "none",
                    letterSpacing: 0,
                  }}
                >
                  (leave blank to keep current)
                </span>
              </label>
              <input
                style={inputStyle}
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=... or direct .mp4 link"
              />
              {video.videoUrl && (
                <span
                  style={{
                    fontSize: 10,
                    color: t.textMuted,
                    marginTop: 2,
                    fontFamily: FF,
                  }}
                >
                  Current:{" "}
                  {video.videoUrl.length > 55
                    ? video.videoUrl.slice(0, 52) + "…"
                    : video.videoUrl}
                </span>
              )}
            </div>
          ) : (
            <div style={rowStyle}>
              <label style={labelStyle}>
                Replace Video File{" "}
                <span
                  style={{
                    fontWeight: 400,
                    opacity: 0.6,
                    textTransform: "none",
                    letterSpacing: 0,
                  }}
                >
                  (leave empty to keep current)
                </span>
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <button
                  onClick={() => fileRef.current?.click()}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "7px 14px",
                    borderRadius: RADIUS.button,
                    border: `1px solid ${t.border}`,
                    background: t.inputBg,
                    color: t.textSub,
                    fontSize: 11,
                    fontWeight: FONT_WEIGHT.bold,
                    cursor: "pointer",
                    fontFamily: FF,
                  }}
                >
                  <Upload size={12} /> Choose File
                </button>
                <span
                  style={{ fontSize: 11, color: t.textMuted, fontFamily: FF }}
                >
                  {newFile
                    ? newFile.name
                    : video.originalFileName || "no file chosen"}
                </span>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="video/*"
                style={{ display: "none" }}
                onChange={(e) => setNewFile(e.target.files[0] || null)}
              />
            </div>
          )}

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div style={rowStyle}>
              <label style={labelStyle}>
                Tags{" "}
                <span
                  style={{
                    fontWeight: 400,
                    opacity: 0.6,
                    textTransform: "none",
                    letterSpacing: 0,
                  }}
                >
                  (comma-separated)
                </span>
              </label>
              <input
                style={inputStyle}
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="java, spring, oop"
              />
            </div>
            <div style={rowStyle}>
              <label style={labelStyle}>Category</label>
              <input
                style={inputStyle}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Education"
              />
            </div>
          </div>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div style={rowStyle}>
              <label style={labelStyle}>Language</label>
              <select
                style={{ ...inputStyle, cursor: "pointer" }}
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                {[
                  "English",
                  "Hindi",
                  "Telugu",
                  "Tamil",
                  "Kannada",
                  "Malayalam",
                  "Other",
                ].map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
            <div style={rowStyle}>
              <label style={labelStyle}>Visibility</label>
              <select
                style={{ ...inputStyle, cursor: "pointer" }}
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="unlisted">Unlisted</option>
              </select>
            </div>
          </div>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div style={rowStyle}>
              <label style={labelStyle}>Course</label>
              <input
                style={inputStyle}
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                placeholder="e.g. Java Bootcamp"
              />
            </div>
            <div style={rowStyle}>
              <label style={labelStyle}>Status</label>
              <select
                style={{ ...inputStyle, cursor: "pointer" }}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
              userSelect: "none",
            }}
          >
            <input
              type="checkbox"
              checked={ageRestrict}
              onChange={(e) => setAgeRestrict(e.target.checked)}
              style={{ width: 14, height: 14, cursor: "pointer" }}
            />
            <span style={{ fontSize: 12, color: t.textSub, fontFamily: FF }}>
              Age Restricted (18+)
            </span>
          </label>

          {error && (
            <div
              style={{
                padding: "8px 12px",
                borderRadius: RADIUS.chip,
                background: "rgba(248,113,113,0.08)",
                border: "1px solid rgba(248,113,113,0.25)",
                fontSize: 11,
                color: "#f87171",
                fontFamily: FF,
              }}
            >
              {error}
            </div>
          )}

          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "flex-end",
              paddingTop: 6,
            }}
          >
            <button
              onClick={onClose}
              style={{
                padding: "8px 18px",
                borderRadius: RADIUS.button,
                border: `1px solid ${t.border}`,
                background: "transparent",
                color: t.textSub,
                fontSize: 12,
                fontWeight: FONT_WEIGHT.bold,
                cursor: "pointer",
                fontFamily: FF,
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                padding: "8px 22px",
                borderRadius: RADIUS.button,
                border: "none",
                background: saving
                  ? "#1d4ed8aa"
                  : "linear-gradient(135deg,#2563eb,#1d4ed8)",
                color: "#fff",
                fontSize: 12,
                fontWeight: FONT_WEIGHT.bold,
                cursor: saving ? "not-allowed" : "pointer",
                fontFamily: FF,
                display: "flex",
                alignItems: "center",
                gap: 7,
                boxShadow: "0 4px 14px rgba(37,99,235,0.3)",
              }}
            >
              {saving ? (
                "Saving…"
              ) : (
                <>
                  <Pencil size={12} /> Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════════
   MAIN VIDEO LIST — now themed via PageContainer + Hero + StatCard,
   matching the Trainer Dashboard (Golden Reference). Business logic,
   API calls, and state management are unchanged.
════════════════════════════════════════════════════════════════════ */
const VideoList = ({ refreshKey, trainerMode }) => {
  const [videos, setVideos] = useState([]);
  const [videoUrls, setVideoUrls] = useState({});
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [playing, setPlaying] = useState({});
  const [editingVideo, setEditingVideo] = useState(null);

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

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const res = trainerMode
          ? await videoService.getTrainerVideos()
          : await videoService.getStudentVideos();
        setVideos(res.data || []);
        setPlaying({});
        setVideoUrls({});
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [refreshKey, trainerMode]);

  const handlePlay = async (video) => {
    setPlaying((p) => ({ ...p, [video.id]: true }));
    const sourceUrl = getVideoSourceUrl(video);
    if (sourceUrl) return;
    if (!videoUrls[video.id] && video.id) {
      try {
        const { url } = await videoService.getVideoBlob(video.id); // now id-based
        setVideoUrls((p) => ({ ...p, [video.id]: url }));
      } catch (err) {
        console.error("Failed to load video blob", err);
        setPlaying((p) => ({ ...p, [video.id]: false }));
      }
    }
  };

  const deleteVideo = async (id) => {
    if (!trainerMode) return;
    if (!confirm("Delete this video?")) return;
    await videoService.deleteVideo(id);
    setVideos((p) => p.filter((v) => v.id !== id));
  };

  const handleVideoUpdated = (updatedVideo) => {
    setVideos((p) =>
      p.map((v) => (v.id === updatedVideo.id ? updatedVideo : v)),
    );
  };

  const toggleExpand = (id) => setExpanded((p) => ({ ...p, [id]: !p[id] }));

  // ── derived counts for the stat row (Golden Reference pattern) ──
  const totalVideos = videos.length;
  const publishedCount = videos.filter((v) => v.status === "published").length;
  const draftCount = videos.filter((v) => v.status === "draft").length;
  const noBatchCount = videos.filter((v) => !v.batchId).length;

  const stats = [
    {
      label: "Total Videos",
      numericValue: totalVideos,
      change: `${totalVideos} uploaded`,
      icon: Film,
      colorKey: "blue",
    },
    {
      label: "Published",
      numericValue: publishedCount,
      change: `${publishedCount} live`,
      icon: Send,
      colorKey: "green",
    },
    {
      label: "Drafts",
      numericValue: draftCount,
      change: `${draftCount} pending`,
      icon: Pencil,
      colorKey: "orange",
    },
    {
      label: "Needs Batch",
      numericValue: noBatchCount,
      change: noBatchCount > 0 ? `${noBatchCount} unassigned` : "All assigned",
      icon: Layers,
      colorKey: "purple",
    },
  ];

  const card = {
    background: t.cardBg,
    border: `1px solid ${t.border}`,
    borderRadius: RADIUS.standardCard,
    boxShadow: t.shadow,
  };

  return (
    <PageContainer
      mode={isDark ? "dark" : "light"}
      pageBg={t.pageBg}
      textColor={t.text}
    >
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:translateY(0) } }
        .vl-card { transition: box-shadow .2s, border-color .2s, transform .2s; }
        .vl-card:hover { transform: translateY(-2px); }
        .vl-play-btn { transition: all .18s; }
        .vl-play-btn:hover { background: #1d4ed8 !important; transform: scale(1.04); }
        .vl-del-btn { transition: all .15s; }
        .vl-del-btn:hover { background: rgba(248,113,113,0.15) !important; color: #f87171 !important; border-color: rgba(248,113,113,0.3) !important; }
        .vl-edit-btn { transition: all .15s; }
        .vl-edit-btn:hover { background: rgba(99,102,241,0.18) !important; color: #818cf8 !important; border-color: rgba(99,102,241,0.4) !important; }
        .vl-expand-btn { transition: all .15s; }
        .vl-expand-btn:hover { color: #22d3ee !important; }
        .vl-publish-btn:hover { background: rgba(34,197,94,0.16) !important; }
        .vl-assign-btn:hover { background: rgba(251,146,60,0.16) !important; }
        .vl-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
        }
        @media (max-width: 640px) {
          .vl-grid { grid-template-columns: 1fr; gap: 12px; }
        }
      `}</style>

      {/* ═══ HERO — same shared component the Trainer Dashboard uses ═══ */}
      <Hero borderHero={t.borderHero}>
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 8,
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: ACCENT_PURPLE.base,
              }}
            />
            <span
              style={{
                fontSize: 10,
                fontWeight: FONT_WEIGHT.bold,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: t.textSub,
                fontFamily: FF,
              }}
            >
              {trainerMode ? "Trainer Portal" : "Student Portal"}
            </span>
          </div>
          <h1
            style={{
              fontFamily: FF,
              fontWeight: FONT_WEIGHT.bold,
              fontSize: "clamp(1.5rem,3vw,2.2rem)",
              color: ACCENT_PURPLE.base,
              margin: "0 0 6px",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            {trainerMode ? "Video Library" : "Recorded Classes"}
          </h1>
          <p
            style={{
              fontSize: 12,
              color: t.textSub,
              margin: 0,
              fontWeight: 500,
              fontFamily: FF,
            }}
          >
            {trainerMode
              ? "Upload, organize, and publish your recorded lessons"
              : "Watch lectures uploaded by your trainers"}
          </p>
        </div>

        <div className="hero-badges">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              background: "rgba(124,58,237,0.08)",
              border: "1px solid rgba(124,58,237,0.3)",
              borderRadius: RADIUS.pill,
              padding: "8px 18px",
              color: ACCENT_PURPLE.base,
              fontSize: 11,
              fontWeight: FONT_WEIGHT.bold,
              letterSpacing: "0.1em",
              fontFamily: FF,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: ACCENT_PURPLE.base,
                display: "inline-block",
              }}
            />
            {totalVideos} TOTAL
          </div>
        </div>
      </Hero>

      {/* ═══ STAT ROW — only shown for trainers, mirrors dashboard's stat-grid ═══ */}
      {trainerMode && (
        <div className="stat-grid" style={{ marginBottom: 20 }}>
          {stats.map((s, i) => (
            <StatCard key={i} stat={s} index={i} loading={loading} />
          ))}
        </div>
      )}

      {/* Edit modal — rendered on top of everything */}
      {editingVideo && (
        <EditModal
          video={editingVideo}
          t={t}
          onClose={() => setEditingVideo(null)}
          onSaved={(updated) => {
            handleVideoUpdated(updated);
            setEditingVideo(null);
          }}
        />
      )}

      {/* ═══ VIDEO GRID ═══ */}
      {loading ? (
        <div className="vl-grid">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{ ...card, padding: CARD_PADDING.standardCard }}
            >
              <div
                style={{
                  height: 144,
                  borderRadius: RADIUS.chip,
                  background: t.barBg,
                  marginBottom: 12,
                }}
              />
              <div
                style={{
                  height: 12,
                  width: "70%",
                  borderRadius: 6,
                  background: t.barBg,
                  marginBottom: 8,
                }}
              />
              <div
                style={{
                  height: 10,
                  width: "50%",
                  borderRadius: 5,
                  background: t.barBg,
                  marginBottom: 6,
                }}
              />
              <div
                style={{
                  height: 10,
                  width: "40%",
                  borderRadius: 5,
                  background: t.barBg,
                }}
              />
            </div>
          ))}
        </div>
      ) : videos.length === 0 ? (
        <div
          style={{
            ...card,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "52px 24px",
            gap: 12,
            border: `1.5px dashed ${t.emptyBorder}`,
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: t.emptyBg,
              border: `1px solid ${t.iconBorder}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <VideoIcon size={22} color={t.emptyIcon} />
          </div>
          <p
            style={{
              fontSize: 13,
              fontWeight: FONT_WEIGHT.bold,
              color: t.textSub,
              margin: 0,
              fontFamily: FF,
            }}
          >
            No videos yet
          </p>
          <p
            style={{
              fontSize: 11,
              color: t.textMuted,
              margin: 0,
              textAlign: "center",
              fontFamily: FF,
            }}
          >
            {trainerMode
              ? "Upload your first video above"
              : "No lectures available yet"}
          </p>
        </div>
      ) : (
        <div className="vl-grid">
          {videos.map((video, idx) => {
            const isExpanded = expanded[video.id];
            const isPlaying = playing[video.id];
            const sourceUrl = getVideoSourceUrl(video);
            const isUrlVideo = !!sourceUrl;
            const blobUrl = videoUrls[video.id];
            const hasNoBatch = !video.batchId;
            const isDraft = video.status === "draft";
            const showPublishBtn = trainerMode && isDraft && !hasNoBatch;
            const showAssignBtn = trainerMode && hasNoBatch;
            const playerReady = isPlaying && (isUrlVideo ? true : !!blobUrl);

            let tags = [];
            if (Array.isArray(video.tags)) tags = video.tags.filter(Boolean);
            else if (typeof video.tags === "string" && video.tags.trim())
              tags = video.tags
                .split(",")
                .map((tg) => tg.trim())
                .filter(Boolean);

            const desc = video.description || video.shortDesc || "";
            const courseName =
              video.course || video.courseName || video.playlist || "";
            const category = video.category || "";
            const language = video.language || "";

            return (
              <div
                key={video.id}
                className="vl-card"
                style={{
                  background: t.cardBg,
                  borderRadius: RADIUS.standardCard,
                  border:
                    hasNoBatch && trainerMode
                      ? "1px solid rgba(251,146,60,0.3)"
                      : isDraft && trainerMode
                        ? "1px solid rgba(34,197,94,0.25)"
                        : `1px solid ${t.border}`,
                  padding: CARD_PADDING.standardCard,
                  boxShadow: t.shadow,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  animation: "fadeUp .35s ease both",
                  animationDelay: `${idx * 50}ms`,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* top accent */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 16,
                    right: 16,
                    height: 2,
                    background:
                      hasNoBatch && trainerMode
                        ? "linear-gradient(90deg,#fb923c,transparent)"
                        : isDraft && trainerMode
                          ? "linear-gradient(90deg,#22c55e,transparent)"
                          : "linear-gradient(90deg,#22d3ee,transparent)",
                    borderRadius: "0 0 99px 99px",
                    opacity: 0.6,
                  }}
                />

                {hasNoBatch && trainerMode && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "5px 10px",
                      borderRadius: RADIUS.chip,
                      background: "rgba(251,146,60,0.08)",
                      border: "1px solid rgba(251,146,60,0.25)",
                      fontSize: 10,
                      fontWeight: FONT_WEIGHT.bold,
                      color: "#fb923c",
                      fontFamily: FF,
                    }}
                  >
                    ⚠ Not visible to students — no batch assigned
                  </div>
                )}

                <div
                  style={{
                    height: playerReady ? "auto" : 144,
                    aspectRatio: playerReady ? "16/9" : undefined,
                    borderRadius: RADIUS.chip,
                    overflow: "hidden",
                    background: "#000",
                    border: `1px solid ${t.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  {playerReady ? (
                    <SmartPlayer
                      blobUrl={isUrlVideo ? null : blobUrl}
                      sourceUrl={isUrlVideo ? sourceUrl : null}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 10,
                        width: "100%",
                        height: "100%",
                        position: "relative",
                        justifyContent: "center",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: `linear-gradient(135deg, ${ACCENT_PURPLE.base}, #1d4ed8)`,
                          opacity: 0.18,
                          borderRadius: RADIUS.chip,
                        }}
                      />
                      {isUrlVideo && (
                        <div
                          style={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            zIndex: 2,
                          }}
                        >
                          <UrlBadge t={t} />
                        </div>
                      )}
                      {isDraft && trainerMode && (
                        <div
                          style={{
                            position: "absolute",
                            top: 8,
                            left: 8,
                            zIndex: 2,
                            padding: "2px 8px",
                            borderRadius: RADIUS.pill,
                            background: "rgba(234,179,8,0.15)",
                            color: "#fbbf24",
                            fontSize: 9,
                            fontWeight: FONT_WEIGHT.bold,
                            fontFamily: FF,
                          }}
                        >
                          DRAFT
                        </div>
                      )}
                      <button
                        className="vl-play-btn"
                        onClick={() => handlePlay(video)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 7,
                          padding: "9px 20px",
                          borderRadius: RADIUS.button,
                          background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
                          border: "none",
                          color: "#fff",
                          fontSize: 13,
                          fontWeight: FONT_WEIGHT.bold,
                          cursor: "pointer",
                          boxShadow: "0 4px 12px rgba(37,99,235,0.35)",
                          fontFamily: FF,
                          position: "relative",
                          zIndex: 1,
                        }}
                      >
                        <Play
                          size={14}
                          style={{ fill: "#fff", strokeWidth: 0 }}
                        />
                        Play
                      </button>
                      {isPlaying && !isUrlVideo && !blobUrl && (
                        <div
                          style={{
                            position: "absolute",
                            bottom: 8,
                            fontSize: 10,
                            color: "rgba(255,255,255,0.6)",
                            fontFamily: FF,
                            zIndex: 2,
                          }}
                        >
                          Loading…
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <p
                  style={{
                    fontSize: 13,
                    fontWeight: FONT_WEIGHT.bold,
                    color: t.text,
                    margin: 0,
                    lineHeight: 1.4,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    fontFamily: FF,
                  }}
                >
                  {video.title}
                </p>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 5,
                    alignItems: "center",
                  }}
                >
                  {courseName && (
                    <Pill bg="rgba(167,139,250,0.12)" color="#a78bfa">
                      <BookOpen size={9} /> {courseName}
                    </Pill>
                  )}
                  {category && (
                    <Pill bg="rgba(251,146,60,0.12)" color="#fb923c">
                      <Layers size={9} /> {category}
                    </Pill>
                  )}
                  {language && (
                    <Pill bg={t.pillBg} color={t.pillText}>
                      <Globe size={9} /> {language}
                    </Pill>
                  )}
                </div>

                {desc && (
                  <div>
                    <p
                      style={{
                        fontSize: 11,
                        color: t.textSub,
                        margin: 0,
                        lineHeight: 1.55,
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: isExpanded ? "unset" : 2,
                        WebkitBoxOrient: "vertical",
                        fontFamily: FF,
                      }}
                    >
                      <AlignLeft
                        size={9}
                        style={{
                          marginRight: 4,
                          flexShrink: 0,
                          verticalAlign: "middle",
                          opacity: 0.6,
                        }}
                      />
                      {desc}
                    </p>
                    {desc.length > 80 && (
                      <button
                        className="vl-expand-btn"
                        onClick={() => toggleExpand(video.id)}
                        style={{
                          background: "none",
                          border: "none",
                          padding: 0,
                          marginTop: 2,
                          fontSize: 10,
                          fontWeight: FONT_WEIGHT.bold,
                          color: t.textMuted,
                          cursor: "pointer",
                          fontFamily: FF,
                        }}
                      >
                        {isExpanded ? "Show less" : "Show more"}
                      </button>
                    )}
                  </div>
                )}

                {tags.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 4,
                      marginTop: 4,
                      alignItems: "center",
                    }}
                  >
                    <Tag
                      size={10}
                      color={t.textMuted}
                      style={{ marginTop: 2, flexShrink: 0 }}
                    />
                    {tags.slice(0, 4).map((tag, i) => (
                      <Pill key={i} bg={t.pillBg} color={t.pillText}>
                        {tag}
                      </Pill>
                    ))}
                    {tags.length > 4 && (
                      <span
                        style={{
                          fontSize: 10,
                          color: t.textMuted,
                          fontFamily: FF,
                        }}
                      >
                        +{tags.length - 4}
                      </span>
                    )}
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingTop: 6,
                    borderTop: `1px solid ${t.border}`,
                  }}
                >
                  <span
                    style={{ fontSize: 10, color: t.textMuted, fontFamily: FF }}
                  >
                    {isUrlVideo ? (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 3,
                        }}
                      >
                        <Link size={9} /> External URL
                      </span>
                    ) : (
                      `${((video.size || 0) / 1024 / 1024).toFixed(1)} MB`
                    )}
                  </span>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 5 }}
                  >
                    {video.batchId && (
                      <Pill bg={t.pillBg} color={t.pillText}>
                        Batch {video.batchId}
                      </Pill>
                    )}
                    {video.visibility && (
                      <Pill bg={t.pillBg} color={t.textSub}>
                        {video.visibility}
                      </Pill>
                    )}
                  </div>
                </div>

                {showPublishBtn && (
                  <PublishButton
                    video={video}
                    onPublished={handleVideoUpdated}
                  />
                )}
                {showAssignBtn && (
                  <AssignBatchButton
                    video={video}
                    onAssigned={handleVideoUpdated}
                    t={t}
                  />
                )}

                {trainerMode && (
                  <div
                    style={{ display: "flex", gap: 8, alignItems: "center" }}
                  >
                    <button
                      className="vl-edit-btn"
                      onClick={() => setEditingVideo(video)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                        padding: "7px 13px",
                        borderRadius: RADIUS.button,
                        background: "rgba(99,102,241,0.08)",
                        border: "1px solid rgba(99,102,241,0.25)",
                        color: "#818cf8",
                        cursor: "pointer",
                        fontSize: 11,
                        fontWeight: FONT_WEIGHT.bold,
                        fontFamily: FF,
                        flex: 1,
                        justifyContent: "center",
                      }}
                    >
                      <Pencil size={12} /> Edit
                    </button>
                    <button
                      className="vl-del-btn"
                      onClick={() => deleteVideo(video.id)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 34,
                        height: 34,
                        borderRadius: RADIUS.button,
                        background: "rgba(248,113,113,0.06)",
                        border: "1px solid rgba(248,113,113,0.2)",
                        color: "#f87171",
                        cursor: "pointer",
                        flexShrink: 0,
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </PageContainer>
  );
};

export default VideoList;
