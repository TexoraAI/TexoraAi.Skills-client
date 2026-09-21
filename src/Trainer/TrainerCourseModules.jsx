import axios from "axios";
import {
  FileText,
  Plus,
  Trash2,
  Video,
  BookOpen,
  Upload,
  List,
  Pencil,
  X,
  Check,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import videoService from "../services/videoService";
import { courseService } from "../services/courseService";

import fileService from "../services/fileService";
import UpgradeModal from "../components/plan/UpgradeModal";
import { parsePlanError } from "../services/planErrorHandler";
import UsageBadge from "../components/plan/UsageBadge";

// ─── Global Design System — single source of truth for colors, type,
// spacing, radius, StatCard, PageContainer and Hero. This page now visually
// matches the Trainer Dashboard (Golden Reference) instead of the page-local
// Tailwind classes it used before.
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

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";
const FF = FONT_FAMILY;

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
});

const isDarkMode = () =>
  document.documentElement.classList.contains("dark") ||
  document.documentElement.getAttribute("data-theme") === "dark" ||
  document.body.classList.contains("dark");

const extractTitle = (fileName) =>
  fileName
    .replace(/\.[^/.]+$/, "")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const getAuthTokenUserId = () => {
  try {
    const token = localStorage.getItem("lms_token");
    if (!token) return null;
    return JSON.parse(atob(token.split(".")[1]))?.userId ?? null;
  } catch {
    return null;
  }
};

/* local layout-only CSS (resizable panel chrome + responsive collapse) */
const LOCAL_STYLES = `
.tcmod-panels{display:flex;flex:1;overflow:hidden;}
.tcmod-p1{flex-shrink:0;display:flex;flex-direction:column;overflow:hidden;transition:width .3s;}
.tcmod-resize{width:12px;flex-shrink:0;display:flex;align-items:center;justify-content:center;cursor:col-resize;transition:background .2s;}
.tcmod-resize-pill{width:3px;height:40px;border-radius:4px;transition:background .2s;}
.tcmod-p2{flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0;}
.tcmod-p3{flex-shrink:0;display:flex;flex-direction:column;overflow-y:auto;}
.tcmod-row{transition:all .15s;}
.tcmod-row:hover{transform:translateY(-1px);}
.tcmod-spin{width:16px;height:16px;border-radius:50%;animation:tcmod-spin .8s linear infinite;}
@keyframes tcmod-spin{to{transform:rotate(360deg)}}
@media (max-width: 900px){
  .tcmod-panels{flex-direction:column;}
  .tcmod-p1{width:100% !important;border-right:none !important;}
  .tcmod-resize{display:none;}
  .tcmod-p3{width:100% !important;}
}
`;
if (typeof document !== "undefined" && !document.getElementById("tcmod-st")) {
  const s = document.createElement("style");
  s.id = "tcmod-st";
  s.textContent = LOCAL_STYLES;
  document.head.appendChild(s);
}

/* ─────────────────── EDIT MODAL — restyled, logic unchanged ─────────────────── */
const EditModal = ({ module, t, onClose, onSaved, userId }) => {
  const [editTitle, setEditTitle] = useState(module.title || "");
  const [editFile, setEditFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [upgradeConfig, setUpgradeConfig] = useState(null);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setEditFile(f);
    if (!editTitle.trim() || editTitle === module.title) {
      setEditTitle(extractTitle(f.name));
    }
  };

  const handleSave = async () => {
    if (!editTitle.trim()) {
      setError("Lesson title is required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      let updatedUrl = module.url;

      if (editFile) {
        if (module.contentType === "VIDEO") {
          const res = await videoService.uploadCourseVideo(
            editFile,
            module.courseId,
            module.moduleId ?? 0,
            module.batchId ?? 0,
          );
          updatedUrl = res.data?.url;
        } else {
          const res = await fileService.uploadCourseFile(
            editFile,
            module.courseId,
            module.moduleId ?? 0,
            module.batchId ?? 0,
          );
          updatedUrl = res.data?.url;
        }
      }

      await axios.put(
        `${API}/content/${module.id}`,
        {
          title: editTitle.trim(),
          url: updatedUrl,
          contentType: module.contentType,
        },
        { headers: authHeader() },
      );

      setSuccess("Module updated successfully!");
      setTimeout(() => {
        onSaved({ ...module, title: editTitle.trim(), url: updatedUrl });
        onClose();
      }, 800);
    } catch (err) {
      console.error("Edit failed:", err);
      const planError = parsePlanError(err);
      if (planError) {
        setUpgradeConfig({ featureLabel: planError.message });
      } else {
        setError(
          err?.response?.data?.message || "Update failed. Please try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const labelStyle = {
    display: "block",
    fontSize: 10,
    fontWeight: FONT_WEIGHT.bold,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: t.textMuted,
    marginBottom: 6,
    fontFamily: FF,
  };
  const inputStyle = {
    width: "100%",
    padding: "10px 13px",
    borderRadius: RADIUS.chip,
    border: `1px solid ${t.border}`,
    background: t.pageBg,
    color: t.text,
    fontFamily: FF,
    fontSize: 13,
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        background: t.modalOverlay || "rgba(0,0,0,0.55)",
        backdropFilter: "blur(4px)",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 420,
          borderRadius: RADIUS.standardCard,
          overflow: "hidden",
          background: t.cardBg,
          border: `1px solid ${t.border}`,
          boxShadow: t.shadowHov || "0 20px 60px rgba(0,0,0,0.35)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 24px",
            background: "linear-gradient(135deg,#1e3a8a,#2563eb)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Pencil size={16} color="rgba(255,255,255,0.85)" />
            <span
              style={{
                fontSize: 13,
                fontWeight: FONT_WEIGHT.bold,
                color: "#fff",
                letterSpacing: "0.02em",
                fontFamily: FF,
              }}
            >
              Edit Module
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: 6,
              borderRadius: RADIUS.chip,
              border: "none",
              background: "rgba(255,255,255,0.15)",
              cursor: "pointer",
              display: "flex",
            }}
          >
            <X size={16} color="#fff" />
          </button>
        </div>

        {/* Body */}
        <div
          style={{
            padding: "20px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 12px",
              borderRadius: RADIUS.chip,
              background: t.pageBg,
              border: `1px solid ${t.border}`,
            }}
          >
            {module.contentType === "VIDEO" ? (
              <Video size={16} color="#3b82f6" style={{ flexShrink: 0 }} />
            ) : (
              <FileText size={16} color="#f59e0b" style={{ flexShrink: 0 }} />
            )}
            <div style={{ minWidth: 0 }}>
              <p
                style={{
                  fontSize: 10,
                  fontWeight: FONT_WEIGHT.bold,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: t.textMuted,
                  margin: 0,
                  fontFamily: FF,
                }}
              >
                Current File
              </p>
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: t.textSub,
                  margin: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  fontFamily: FF,
                }}
              >
                {module.url || "No file"}
              </p>
            </div>
          </div>

          <div>
            <label style={labelStyle}>
              Lesson Title <span style={{ color: "#f87171" }}>*</span>
            </label>
            <input
              style={inputStyle}
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Enter lesson title"
            />
          </div>

          <div>
            <label style={labelStyle}>
              Replace File{" "}
              <span
                style={{
                  fontWeight: 400,
                  textTransform: "none",
                  letterSpacing: 0,
                  opacity: 0.7,
                }}
              >
                (optional)
              </span>
            </label>
            <label
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "16px",
                borderRadius: RADIUS.chip,
                border: `2px dashed ${t.border}`,
                background: t.pageBg,
                cursor: "pointer",
              }}
            >
              <Upload size={18} color={t.textMuted} />
              <span
                style={{
                  fontSize: 11,
                  color: t.textSub,
                  textAlign: "center",
                  fontFamily: FF,
                }}
              >
                {editFile ? (
                  <span style={{ color: "#3b82f6", fontWeight: 600 }}>
                    {editFile.name}
                  </span>
                ) : (
                  `Click to replace ${module.contentType === "VIDEO" ? "video" : "PDF"}`
                )}
              </span>
              <input
                type="file"
                style={{ display: "none" }}
                accept={
                  module.contentType === "VIDEO"
                    ? "video/*"
                    : ".pdf,.doc,.docx,.ppt,.pptx"
                }
                onChange={handleFileChange}
              />
            </label>
          </div>

          {error && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 12px",
                borderRadius: RADIUS.chip,
                background: "rgba(248,113,113,0.08)",
                border: "1px solid rgba(248,113,113,0.25)",
              }}
            >
              <AlertCircle
                size={14}
                color="#f87171"
                style={{ flexShrink: 0 }}
              />
              <p
                style={{
                  fontSize: 11,
                  color: "#f87171",
                  margin: 0,
                  fontFamily: FF,
                }}
              >
                {error}
              </p>
            </div>
          )}
          {success && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 12px",
                borderRadius: RADIUS.chip,
                background: "rgba(52,211,153,0.08)",
                border: "1px solid rgba(52,211,153,0.25)",
              }}
            >
              <Check size={14} color="#34d399" style={{ flexShrink: 0 }} />
              <p
                style={{
                  fontSize: 11,
                  color: "#34d399",
                  margin: 0,
                  fontFamily: FF,
                }}
              >
                {success}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ display: "flex", gap: 10, padding: "0 24px 20px" }}>
          <button
            onClick={onClose}
            disabled={loading}
            style={{
              flex: 1,
              padding: "10px 16px",
              borderRadius: RADIUS.button,
              fontSize: 13,
              fontWeight: FONT_WEIGHT.bold,
              color: t.textSub,
              border: `1px solid ${t.border}`,
              background: t.pageBg,
              cursor: "pointer",
              opacity: loading ? 0.5 : 1,
              fontFamily: FF,
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "10px 16px",
              borderRadius: RADIUS.button,
              fontSize: 13,
              fontWeight: FONT_WEIGHT.bold,
              color: "#fff",
              border: "none",
              background: "linear-gradient(135deg,#166534,#16a34a)",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
              boxShadow: "0 4px 14px rgba(22,163,74,0.3)",
              fontFamily: FF,
            }}
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Check size={14} /> Save Changes
              </>
            )}
          </button>
        </div>
      </div>
      {upgradeConfig && (
        <UpgradeModal
          isOpen={!!upgradeConfig}
          onClose={() => setUpgradeConfig(null)}
          planType="individual"
          userId={userId}
          currentPlan="free"
          availableTargetPlans={["pro", "premium"]}
          featureLabel={upgradeConfig.featureLabel}
          onSuccess={() => setUpgradeConfig(null)}
        />
      )}
    </div>
  );
};

/* ─────────────────── MAIN PAGE ─────────────────── */
export default function TrainerCourseModules() {
  const { courseId } = useParams();

  const [modules, setModules] = useState([]);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [type, setType] = useState("VIDEO");
  const [loading, setLoading] = useState(false);
  const [addError, setAddError] = useState("");
  const [editingModule, setEditingModule] = useState(null);
  const [upgradeConfig, setUpgradeConfig] = useState(null);
  const [moduleUsage, setModuleUsage] = useState(null);
  const [storageUsage, setStorageUsage] = useState(null);

  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightWidth, setRightWidth] = useState(320);
  const isDragging = useRef(false);
  const containerRef = useRef(null);

  const [isDark, setIsDark] = useState(isDarkMode);
  useEffect(() => {
    const o = new MutationObserver(() => setIsDark(isDarkMode()));
    o.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });
    o.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => o.disconnect();
  }, []);
  const t = isDark ? T.dark : T.light;

  const onMouseDown = useCallback(() => {
    isDragging.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);
  const onMouseMove = useCallback((e) => {
    if (!isDragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const fromRight = rect.right - e.clientX;
    if (fromRight > 240 && fromRight < 540) setRightWidth(fromRight);
  }, []);
  const onMouseUp = useCallback(() => {
    isDragging.current = false;
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }, []);
  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  useEffect(() => {
    loadModules();
    fetchUsage();
  }, [courseId]);

  const loadModules = async () => {
    try {
      const res = await axios.get(`${API}/content/course/${courseId}`, {
        headers: authHeader(),
      });
      setModules(res.data);
    } catch (err) {
      console.error("Failed to load modules", err);
    }
  };

  const fetchUsage = async () => {
    try {
      const [moduleRes, videoRes, fileRes] = await Promise.all([
        courseService.getModuleUsage(courseId),
        videoService.getCourseVideoUploadQuota(),
        fileService.getCourseFileUploadQuota(),
      ]);

      setModuleUsage(moduleRes.data);

      // Combine video + file storage into one pill — both pools use the
      // SAME per-tier capacity (CourseContentTierLimits is identical in
      // both services), so used bytes are summed and capacity is taken
      // from either response (they're equal for the same trainer/tier).
      const usedBytes =
        (videoRes.data.usedBytes || 0) + (fileRes.data.usedBytes || 0);
      const capacityBytes = videoRes.data.capacityBytes;
      setStorageUsage({
        tier: videoRes.data.tier,
        usedBytes,
        capacityBytes,
      });
    } catch (e) {
      console.error("Failed to fetch usage", e);
    }
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    if (!title.trim()) setTitle(extractTitle(f.name));
  };

  const uploadAsset = async () => {
    if (!title.trim()) {
      setAddError("Lesson title is required");
      return;
    }
    if (!file) {
      setAddError(`Please select a ${type === "VIDEO" ? "video" : "PDF"} file`);
      return;
    }

    try {
      setLoading(true);
      setAddError("");

      let fileUrl;
      if (type === "VIDEO") {
        const res = await videoService.uploadCourseVideo(file, courseId, 0, 0);
        fileUrl = res.data?.url;
      } else {
        const res = await fileService.uploadCourseFile(file, courseId, 0, 0);
        fileUrl = res.data?.url;
      }

      await axios.post(
        `${API}/content`,
        {
          courseId,
          title: title.trim(),
          contentType: type,
          url: fileUrl,
          orderIndex: modules.length + 1,
        },
        { headers: authHeader() },
      );

      setTitle("");
      setFile(null);
      loadModules();
      fetchUsage(); // ADDED
    } catch (err) {
      console.error(err);
      const planError = parsePlanError(err);
      if (planError) {
        setUpgradeConfig({ featureLabel: planError.message });
      } else {
        setAddError("Upload failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteModule = async (module) => {
    if (!window.confirm("Delete this module?")) return;
    try {
      await axios.delete(`${API}/content/${module.id}`, {
        headers: authHeader(),
      });
      setModules((prev) => prev.filter((m) => m.id !== module.id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleModuleSaved = (updated) => {
    setModules((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
  };

  const videoCount = modules.filter((m) => m.contentType === "VIDEO").length;
  const pdfCount = modules.filter((m) => m.contentType === "PDF").length;

  const stats = [
    {
      label: "Total Modules",
      numericValue: modules.length,
      change: `${modules.length} lessons`,
      icon: List,
      colorKey: "blue",
    },
    {
      label: "Videos",
      numericValue: videoCount,
      change: `${videoCount} uploaded`,
      icon: Video,
      colorKey: "green",
    },
    {
      label: "PDFs",
      numericValue: pdfCount,
      change: `${pdfCount} uploaded`,
      icon: FileText,
      colorKey: "orange",
    },
  ];

  const labelStyle = {
    display: "block",
    fontSize: 10,
    fontWeight: FONT_WEIGHT.bold,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: t.textMuted,
    marginBottom: 6,
    fontFamily: FF,
  };
  const inputStyle = {
    width: "100%",
    padding: "10px 13px",
    borderRadius: RADIUS.chip,
    border: `1px solid ${t.border}`,
    background: t.pageBg,
    color: t.text,
    fontFamily: FF,
    fontSize: 13,
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <PageContainer
      mode={isDark ? "dark" : "light"}
      pageBg={t.pageBg}
      textColor={t.text}
    >
      {editingModule && (
        <EditModal
          module={editingModule}
          t={t}
          onClose={() => setEditingModule(null)}
          onSaved={handleModuleSaved}
          userId={getAuthTokenUserId()}
        />
      )}

      {/* ═══ HERO — shared component, matches Trainer Dashboard exactly ═══ */}
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
              Course
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
            Course Modules
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
            Add and manage video/PDF lessons for this course
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
            COURSE #{courseId}
          </div>

          {moduleUsage && (
            <UsageBadge
              used={moduleUsage.used}
              limit={moduleUsage.limit}
              label={`Modules (${moduleUsage.tier?.toUpperCase() || ""})`}
              c={{
                cardBorder: t.border,
                cardBg: t.pageBg,
                textSub: t.textMuted,
                textPrimary: t.text,
                divider: t.border,
                accent: "#34d399",
                errorColor: "#f87171",
              }}
            />
          )}

          {storageUsage && (
            <UsageBadge
              storageUsedBytes={storageUsage.usedBytes}
              storageCapBytes={storageUsage.capacityBytes}
              label="Storage"
              c={{
                cardBorder: t.border,
                cardBg: t.pageBg,
                textSub: t.textMuted,
                textPrimary: t.text,
                divider: t.border,
                accent: "#22d3ee",
                errorColor: "#f87171",
              }}
            />
          )}
        </div>
      </Hero>

      {/* ═══ STAT CARDS — shared <StatCard>, same grid as the dashboard ═══ */}
      <div className="stat-grid" style={{ marginBottom: 20 }}>
        {stats.map((s, i) => (
          <StatCard key={i} stat={s} index={i} loading={false} />
        ))}
      </div>

      {/* ═══ 3-PANEL WORKSPACE ═══ */}
      <div
        ref={containerRef}
        className="tcmod-panels"
        style={{
          background: t.cardBg,
          border: `1px solid ${t.border}`,
          borderRadius: RADIUS.standardCard,
          boxShadow: t.shadow,
          height: "calc(100vh - 340px)",
          minHeight: 420,
        }}
      >
        {/* Panel 1: Content type */}
        <div
          className="tcmod-p1"
          style={{
            width: leftCollapsed ? 0 : 200,
            borderRight: `1px solid ${t.border}`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 16px",
              borderBottom: `1px solid ${t.border}`,
              background: t.pageBg,
            }}
          >
            <List size={14} color="#3b82f6" style={{ flexShrink: 0 }} />
            <span
              style={{
                fontSize: 12,
                fontWeight: FONT_WEIGHT.bold,
                color: t.text,
                whiteSpace: "nowrap",
                fontFamily: FF,
              }}
            >
              Options
            </span>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 12px" }}>
            <p
              style={{
                fontSize: 10,
                fontWeight: FONT_WEIGHT.bold,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: t.textMuted,
                marginBottom: 8,
                fontFamily: FF,
              }}
            >
              Content Type
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {["VIDEO", "PDF"].map((tp) => (
                <button
                  key={tp}
                  onClick={() => {
                    setType(tp);
                    setFile(null);
                    setTitle("");
                    setAddError("");
                  }}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    fontSize: 13,
                    padding: "9px 12px",
                    borderRadius: RADIUS.chip,
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    border: "none",
                    cursor: "pointer",
                    fontFamily: FF,
                    color: type === tp ? "#fff" : t.textSub,
                    background:
                      type === tp
                        ? "linear-gradient(135deg,#1e3a8a,#2563eb)"
                        : "transparent",
                  }}
                >
                  {tp === "VIDEO" ? (
                    <Video size={14} />
                  ) : (
                    <FileText size={14} />
                  )}
                  {tp === "VIDEO" ? "Video" : "PDF"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Left collapse handle */}
        <div
          onClick={() => setLeftCollapsed(!leftCollapsed)}
          className="tcmod-resize"
          style={{
            background: t.pageBg,
            borderLeft: `1px solid ${t.border}`,
            borderRight: `1px solid ${t.border}`,
          }}
        >
          <div className="tcmod-resize-pill" style={{ background: t.border }} />
        </div>

        {/* Panel 2: Module list */}
        <div className="tcmod-p2">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 20px",
              borderBottom: `1px solid ${t.border}`,
              background: t.pageBg,
            }}
          >
            <List size={14} color="#3b82f6" />
            <span
              style={{
                fontSize: 13,
                fontWeight: FONT_WEIGHT.bold,
                color: t.text,
                letterSpacing: "0.02em",
                fontFamily: FF,
              }}
            >
              Modules ({modules.length})
            </span>
          </div>

          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: 16,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {modules.length === 0 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  gap: 12,
                  opacity: 0.5,
                }}
              >
                <BookOpen size={40} color={t.textMuted} />
                <p style={{ fontSize: 13, color: t.textMuted, fontFamily: FF }}>
                  No modules yet. Add your first lesson!
                </p>
              </div>
            )}

            {modules.map((m, idx) => (
              <div
                key={m.id}
                className="tcmod-row"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: "12px 16px",
                  borderRadius: RADIUS.chip,
                  border: `1px solid ${t.border}`,
                  background: t.pageBg,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    minWidth: 0,
                  }}
                >
                  <span
                    style={{
                      flexShrink: 0,
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 10,
                      fontWeight: FONT_WEIGHT.bold,
                      color: "#fff",
                      background: "linear-gradient(135deg,#1e3a8a,#2563eb)",
                      fontFamily: FF,
                    }}
                  >
                    {idx + 1}
                  </span>

                  <div
                    style={{
                      flexShrink: 0,
                      padding: 6,
                      borderRadius: RADIUS.chip,
                      border:
                        m.contentType === "VIDEO"
                          ? "1px solid rgba(59,130,246,0.3)"
                          : "1px solid rgba(245,158,11,0.3)",
                      background:
                        m.contentType === "VIDEO"
                          ? "rgba(59,130,246,0.12)"
                          : "rgba(245,158,11,0.12)",
                    }}
                  >
                    {m.contentType === "VIDEO" ? (
                      <Video size={14} color="#3b82f6" />
                    ) : (
                      <FileText size={14} color="#f59e0b" />
                    )}
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: FONT_WEIGHT.bold,
                        color: t.text,
                        margin: 0,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        fontFamily: FF,
                      }}
                    >
                      {m.title}
                    </p>
                    <p
                      style={{
                        fontSize: 11,
                        color: t.textMuted,
                        margin: 0,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        fontFamily: FF,
                      }}
                    >
                      {m.url}
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <button
                    onClick={() => setEditingModule(m)}
                    title="Edit module"
                    style={{
                      padding: 7,
                      borderRadius: RADIUS.chip,
                      border: "1px solid transparent",
                      background: "transparent",
                      color: t.textMuted,
                      cursor: "pointer",
                      display: "flex",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#3b82f6";
                      e.currentTarget.style.borderColor =
                        "rgba(59,130,246,0.3)";
                      e.currentTarget.style.background =
                        "rgba(59,130,246,0.08)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = t.textMuted;
                      e.currentTarget.style.borderColor = "transparent";
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => deleteModule(m)}
                    title="Delete module"
                    style={{
                      padding: 7,
                      borderRadius: RADIUS.chip,
                      border: "1px solid transparent",
                      background: "transparent",
                      color: t.textMuted,
                      cursor: "pointer",
                      display: "flex",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#f87171";
                      e.currentTarget.style.borderColor =
                        "rgba(248,113,113,0.3)";
                      e.currentTarget.style.background =
                        "rgba(248,113,113,0.08)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = t.textMuted;
                      e.currentTarget.style.borderColor = "transparent";
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Drag handle between panel 2 & 3 */}
        <div
          onMouseDown={onMouseDown}
          className="tcmod-resize"
          style={{
            background: t.pageBg,
            borderLeft: `1px solid ${t.border}`,
            borderRight: `1px solid ${t.border}`,
          }}
        >
          <div className="tcmod-resize-pill" style={{ background: t.border }} />
        </div>

        {/* Panel 3: Add module form */}
        <div
          className="tcmod-p3"
          style={{ width: rightWidth, borderLeft: `1px solid ${t.border}` }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 20px",
              borderBottom: `1px solid ${t.border}`,
              background: t.pageBg,
            }}
          >
            <div
              style={{
                padding: 6,
                borderRadius: RADIUS.chip,
                background: "linear-gradient(135deg,#166534,#16a34a)",
                display: "flex",
              }}
            >
              <Plus size={14} color="#fff" />
            </div>
            <span
              style={{
                fontSize: 13,
                fontWeight: FONT_WEIGHT.bold,
                color: t.text,
                letterSpacing: "0.02em",
                fontFamily: FF,
              }}
            >
              Add Module
            </span>
          </div>

          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: 20,
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <div>
              <label style={labelStyle}>
                Lesson Title <span style={{ color: "#f87171" }}>*</span>
              </label>
              <input
                style={inputStyle}
                placeholder="e.g., Introduction to React"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label style={labelStyle}>Content Type</label>
              <div style={{ display: "flex", gap: 8 }}>
                {["VIDEO", "PDF"].map((tp) => (
                  <button
                    key={tp}
                    onClick={() => {
                      setType(tp);
                      setFile(null);
                      setTitle("");
                      setAddError("");
                    }}
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                      padding: "8px 12px",
                      borderRadius: RADIUS.chip,
                      fontSize: 12,
                      fontWeight: FONT_WEIGHT.bold,
                      cursor: "pointer",
                      fontFamily: FF,
                      color: type === tp ? "#fff" : t.textSub,
                      border:
                        type === tp
                          ? "1px solid transparent"
                          : `1px solid ${t.border}`,
                      background:
                        type === tp
                          ? "linear-gradient(135deg,#1e3a8a,#2563eb)"
                          : t.pageBg,
                    }}
                  >
                    {tp === "VIDEO" ? (
                      <Video size={14} />
                    ) : (
                      <FileText size={14} />
                    )}
                    {tp === "VIDEO" ? "Video" : "PDF"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={labelStyle}>
                Upload File <span style={{ color: "#f87171" }}>*</span>
              </label>
              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "20px 16px",
                  borderRadius: RADIUS.chip,
                  border: `2px dashed ${t.border}`,
                  background: t.pageBg,
                  cursor: "pointer",
                }}
              >
                <Upload size={22} color={t.textMuted} />
                <span
                  style={{
                    fontSize: 11,
                    color: t.textSub,
                    textAlign: "center",
                    fontFamily: FF,
                  }}
                >
                  {file ? (
                    <span style={{ color: "#3b82f6", fontWeight: 600 }}>
                      {file.name}
                    </span>
                  ) : (
                    `Click to upload ${type === "VIDEO" ? "video" : "PDF"}`
                  )}
                </span>
                <input
                  type="file"
                  style={{ display: "none" }}
                  accept={
                    type === "VIDEO" ? "video/*" : ".pdf,.doc,.docx,.ppt,.pptx"
                  }
                  onChange={handleFileChange}
                />
              </label>
            </div>

            {addError && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 12px",
                  borderRadius: RADIUS.chip,
                  background: "rgba(248,113,113,0.08)",
                  border: "1px solid rgba(248,113,113,0.25)",
                }}
              >
                <AlertCircle
                  size={14}
                  color="#f87171"
                  style={{ flexShrink: 0 }}
                />
                <p
                  style={{
                    fontSize: 11,
                    color: "#f87171",
                    margin: 0,
                    fontFamily: FF,
                  }}
                >
                  {addError}
                </p>
              </div>
            )}

            <button
              onClick={uploadAsset}
              disabled={loading}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "10px 16px",
                borderRadius: RADIUS.button,
                fontSize: 13,
                fontWeight: FONT_WEIGHT.bold,
                color: "#fff",
                border: "none",
                background: "linear-gradient(135deg,#166534,#16a34a)",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1,
                boxShadow: "0 4px 14px rgba(22,163,74,0.3)",
                fontFamily: FF,
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Plus size={14} /> Add Module
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      {upgradeConfig && (
        <UpgradeModal
          isOpen={!!upgradeConfig}
          onClose={() => setUpgradeConfig(null)}
          planType="individual"
          userId={getAuthTokenUserId()}
          currentPlan="free"
          availableTargetPlans={["pro", "premium"]}
          featureLabel={upgradeConfig.featureLabel}
          onSuccess={() => setUpgradeConfig(null)}
        />
      )}
    </PageContainer>
  );
}
