import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  getAssignmentFiles,
  getStudentAssignments,
  submitAssignment,
  getAssignmentSubmitUsage,
} from "@/services/assessmentService";

import { progressService } from "@/services/progressService";
import UpgradeModal from "@/components/plan/UpgradeModal";
import { parsePlanError } from "@/services/planErrorHandler";

import {
  Award,
  Calendar,
  CheckCircle2,
  FileText,
  Upload,
  Eye,
  Download,
  X,
  Maximize2,
  Minimize2,
  Expand,
} from "lucide-react";

// ── Golden Reference design system — same tokens, StatCard, and
// PageContainer shell used by the Student Dashboard. Nothing in this
// file declares its own colors, fonts, radii, or shadows; everything
// is pulled from `T` so this page stays visually identical to the
// dashboard (and to every other page that adopts the same imports).
import {
  T,
  FONT_FAMILY,
  FONT_WEIGHT,
  FONT_SIZE,
  LINE_HEIGHT,
  LETTER_SPACING,
  StatCard,
  PageContainer,
} from "@/design-system";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

/* ─── Only the animation keyframes the popup viewer needs.
   Colors/typography/spacing all come from `T` inline — this is not
   a parallel token system, just the two @keyframes + spinner-spin
   that the global design system doesn't define. ─── */
const viewerAnimStyles = `
  @keyframes ad-fade-in { from { opacity: 0; } to { opacity: 1; } }
  @keyframes ad-slide-up { from { opacity: 0; transform: translateY(20px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
  @keyframes ad-spin { to { transform: rotate(360deg); } }
`;

if (!document.getElementById("ad-viewer-anim")) {
  const tag = document.createElement("style");
  tag.id = "ad-viewer-anim";
  tag.textContent = viewerAnimStyles;
  document.head.appendChild(tag);
}

// Decode email from JWT
const getEmailFromToken = () => {
  try {
    const token = localStorage.getItem("lms_token");
    if (!token) return null;
    return JSON.parse(atob(token.split(".")[1])).sub;
  } catch {
    return null;
  }
};

const getAuthTokenUserId = () => {
  try {
    const token = localStorage.getItem("lms_token");
    if (!token) return null;
    return JSON.parse(atob(token.split(".")[1]))?.userId ?? null;
  } catch {
    return null;
  }
};

/* ─── Document Viewer Popup — restyled with `t` tokens ─── */
function DocViewer({ file, objectUrl, onClose, t }) {
  const [size, setSize] = useState("medium"); // small | medium | full
  const [loaded, setLoaded] = useState(false);

  const sizeMap = {
    small: { icon: <Minimize2 size={14} />, label: "Small" },
    medium: { icon: <Maximize2 size={14} />, label: "Medium" },
    full: { icon: <Expand size={14} />, label: "Full" },
  };

  const sizeStyle = {
    small: { width: "min(600px, 95vw)", height: "min(500px, 85vh)" },
    medium: { width: "min(820px, 95vw)", height: "min(680px, 88vh)" },
    full: { position: "fixed", inset: 12, width: "auto", height: "auto" },
  }[size];

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.72)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        boxSizing: "border-box",
        animation: "ad-fade-in 0.18s ease",
      }}
    >
      <div
        style={{
          ...sizeStyle,
          background: t.cardBg,
          border: `1px solid ${t.border}`,
          borderRadius: size === "full" ? 16 : 20,
          boxShadow: t.shadowHov,
          display: "flex",
          flexDirection: "column",
          animation: "ad-slide-up 0.22s ease",
          overflow: "hidden",
          transition: "width 0.25s ease, height 0.25s ease",
        }}
      >
        {/* Toolbar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 18px",
            borderBottom: `1px solid ${t.border}`,
            background: t.recentItemBg,
            flexShrink: 0,
            gap: 10,
          }}
        >
          <FileText size={15} style={{ color: "#22d3ee", flexShrink: 0 }} />
          <span
            style={{
              fontSize: 13,
              fontWeight: FONT_WEIGHT.bold,
              color: t.text,
              fontFamily: FONT_FAMILY,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              flex: 1,
              minWidth: 0,
            }}
          >
            {file.fileName}
          </span>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontSize: 10,
                fontWeight: FONT_WEIGHT.bold,
                color: t.textMuted,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                padding: "0 6px",
                fontFamily: FONT_FAMILY,
              }}
            >
              Size
            </span>

            {["small", "medium", "full"].map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                title={sizeMap[s].label}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  border: `1px solid ${size === s ? "rgba(34,211,238,0.4)" : t.navBtnBorder}`,
                  background: size === s ? "rgba(34,211,238,0.10)" : t.navBtnBg,
                  color: size === s ? "#22d3ee" : t.navBtnColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {sizeMap[s].icon}
              </button>
            ))}

            <div
              style={{
                width: 1,
                height: 20,
                background: t.border,
                margin: "0 2px",
              }}
            />

            <button
              onClick={() => window.open(objectUrl, "_blank")}
              title="Open in full tab"
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                border: `1px solid ${t.navBtnBorder}`,
                background: t.navBtnBg,
                color: t.navBtnColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <Eye size={14} />
            </button>

            <button
              onClick={onClose}
              title="Close"
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                border: `1px solid ${t.navBtnBorder}`,
                background: t.navBtnBg,
                color: t.overdueText,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* iframe body */}
        <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
          {!loaded && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                fontSize: 13,
                color: t.textMuted,
                fontWeight: FONT_WEIGHT.medium,
                fontFamily: FONT_FAMILY,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  border: `3px solid ${t.border}`,
                  borderTopColor: "#22d3ee",
                  animation: "ad-spin 0.7s linear infinite",
                }}
              />
              Loading document...
            </div>
          )}
          <iframe
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              display: "block",
            }}
            src={objectUrl}
            onLoad={() => setLoaded(true)}
            title={file.fileName}
          />
        </div>
      </div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────── */
export default function AssignmentDetail() {
  const { id } = useParams();

  const [assignment, setAssignment] = useState(null);
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [totalAssignmentCount, setTotalAssignmentCount] = useState(1);

  // Progress state
  // Progress state
  const [completedAssignmentIds, setCompletedAssignmentIds] = useState([]);
  const [progressPercentage, setProgressPercentage] = useState(0);

  // Usage / upgrade state
  const [usage, setUsage] = useState(null);
  const [upgradeConfig, setUpgradeConfig] = useState(null);

  // Viewer state
  const [viewerFile, setViewerFile] = useState(null);
  const [viewerObjectUrl, setViewerObjectUrl] = useState(null);

  const studentEmail = getEmailFromToken();

  // Same dark-mode detection pattern as the Dashboard golden reference
  const [isDark, setIsDark] = useState(
    () =>
      typeof document !== "undefined" &&
      (document.documentElement.classList.contains("dark") ||
        document.documentElement.getAttribute("data-theme") === "dark"),
  );

  useEffect(() => {
    const obs = new MutationObserver(() => {
      setIsDark(
        document.documentElement.classList.contains("dark") ||
          document.documentElement.getAttribute("data-theme") === "dark",
      );
    });
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });
    return () => obs.disconnect();
  }, []);

  const t = isDark ? T.dark : T.light;

  useEffect(() => {
    loadAssignment();
    loadFiles();
    getAssignmentSubmitUsage()
      .then((res) => setUsage(res.data))
      .catch(() => setUsage(null));
  }, [id]);

  // Cleanup object URL on unmount / close
  useEffect(() => {
    return () => {
      if (viewerObjectUrl) window.URL.revokeObjectURL(viewerObjectUrl);
    };
  }, [viewerObjectUrl]);

  const loadAssignment = async () => {
    try {
      const assignmentRes = await getStudentAssignments();
      const list =
        assignmentRes?.data?.data ||
        assignmentRes?.data?.assignments ||
        assignmentRes?.data ||
        [];
      const assignmentList = Array.isArray(list) ? list : [];
      const found = assignmentList.find((a) => a.id === Number(id));
      setAssignment(found);

      if (found?.batchId) {
        const sameBlock = assignmentList.filter(
          (a) => a.batchId === found.batchId,
        );
        setTotalAssignmentCount(sameBlock.length || 1);

        if (studentEmail) {
          try {
            const prog = await progressService.getAssignmentProgress(
              studentEmail,
              found.batchId,
            );
            setCompletedAssignmentIds(prog.data.completedAssignmentIds || []);
            setProgressPercentage(prog.data.percentage || 0);
          } catch {
            setCompletedAssignmentIds([]);
            setProgressPercentage(0);
          }
        }
      }
    } catch (error) {
      console.error("Error loading assignment:", error);
    }
  };

  const loadFiles = async () => {
    try {
      const res = await getAssignmentFiles(id);
      setFiles(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileSelect = (e) => setSelectedFile(e.target.files[0]);

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert("Please select a file");
      return;
    }
    try {
      setLoading(true);
      const res = await submitAssignment(id, selectedFile);
      setSubmissionStatus(res.data.status);

      const batchId = assignment?.batchId;
      const assignmentId = Number(id);
      if (studentEmail && batchId) {
        try {
          const prog = await progressService.markAssignmentComplete(
            studentEmail,
            batchId,
            assignmentId,
            totalAssignmentCount,
          );
          setCompletedAssignmentIds(prog.data.completedAssignmentIds || []);
          setProgressPercentage(prog.data.percentage || 0);
        } catch (progressError) {
          console.error(
            "❌ Progress API error:",
            progressError?.response?.data || progressError.message,
          );
        }
      }

      alert("Assignment submitted successfully!");
      getAssignmentSubmitUsage()
        .then((res) => setUsage(res.data))
        .catch(() => {});
    } catch (error) {
      console.error(error);
      const planError = parsePlanError(error);
      if (planError) {
        setUpgradeConfig({ featureLabel: planError.message });
      } else {
        alert("You have already submitted this assignment.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (file) => {
    try {
      const token = localStorage.getItem("lms_token");
      const response = await fetch(
        `${API_BASE_URL.replace("/api", "")}${file.downloadUrl}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const handleView = async (file) => {
    try {
      const token = localStorage.getItem("lms_token");
      const response = await fetch(
        `${API_BASE_URL.replace("/api", "")}${file.downloadUrl}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      if (viewerObjectUrl) window.URL.revokeObjectURL(viewerObjectUrl);
      setViewerObjectUrl(url);
      setViewerFile(file);
    } catch (error) {
      console.error("View failed:", error);
    }
  };

  const handleCloseViewer = () => {
    if (viewerObjectUrl) window.URL.revokeObjectURL(viewerObjectUrl);
    setViewerObjectUrl(null);
    setViewerFile(null);
  };

  if (!assignment) {
    return (
      <PageContainer
        mode={isDark ? "dark" : "light"}
        pageBg={t.pageBg}
        textColor={t.text}
      >
        <div
          style={{
            padding: 48,
            textAlign: "center",
            color: t.textMuted,
            fontSize: 14,
            fontWeight: FONT_WEIGHT.medium,
            fontFamily: FONT_FAMILY,
          }}
        >
          Loading assignment...
        </div>
      </PageContainer>
    );
  }

  const isLate = new Date(assignment.deadline) < new Date();
  const isSubmitted = completedAssignmentIds.includes(Number(id));

  // Same `stat` shape the Dashboard hands to <StatCard />
  const stats = [
    {
      label: "Files",
      numericValue: files.length,
      change: `${files.length} attached`,
      trend: "up",
      icon: FileText,
      colorKey: "blue",
    },
    {
      label: "Max Marks",
      numericValue: assignment.maxMarks,
      change: "points possible",
      trend: "up",
      icon: Award,
      colorKey: "orange",
    },
    {
      label: "Batch Submitted",
      numericValue: completedAssignmentIds.length,
      change: `of ${totalAssignmentCount} · ${progressPercentage.toFixed(0)}%`,
      trend: isSubmitted ? "up" : "down",
      icon: CheckCircle2,
      colorKey: isSubmitted ? "green" : "purple",
    },
  ];

  const card = {
    background: t.cardBg,
    border: `1px solid ${t.border}`,
    borderRadius: 20,
    boxShadow: t.shadow,
    overflow: "hidden",
  };
  const panelHead = (bg) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 22px",
    borderBottom: `1px solid ${t.border}`,
    background: bg,
  });

  const metaRow = (Icon, color, label, value, extra) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px",
        borderRadius: 12,
        background: t.recentItemBg,
        border: `1px solid ${t.recentItemBorder}`,
        marginBottom: 10,
        fontFamily: FONT_FAMILY,
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 9,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `${color}18`,
          border: `1px solid ${color}30`,
          flexShrink: 0,
        }}
      >
        <Icon size={14} color={color} />
      </div>
      <div>
        <p style={{ fontSize: 10, color: t.textMuted, margin: 0 }}>{label}</p>
        <p
          style={{
            fontSize: 13,
            fontWeight: FONT_WEIGHT.bold,
            color: t.text,
            margin: "2px 0 0",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          {value}
          {extra}
        </p>
      </div>
    </div>
  );

  return (
    <PageContainer
      mode={isDark ? "dark" : "light"}
      pageBg={t.pageBg}
      textColor={t.text}
    >
      {/* ═══ HERO ═══ */}
      <div
        style={{
          padding: "8px 0 24px",
          background: "transparent",
          border: "none",
          borderBottom: `1px solid ${t.borderHero}`,
          marginBottom: 20,
          boxShadow: "none",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 8,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#7c3aed",
            }}
          />
          <span
            style={{
              fontSize: FONT_SIZE.eyebrow,
              fontWeight: FONT_WEIGHT.bold,
              letterSpacing: LETTER_SPACING.eyebrowWide,
              textTransform: "uppercase",
              color: t.textSub,
              fontFamily: FONT_FAMILY,
            }}
          >
            Assignment Detail
          </span>
        </div>
        <h1
          style={{
            fontFamily: FONT_FAMILY,
            fontWeight: FONT_WEIGHT.heroTitle,
            fontSize: FONT_SIZE.heroTitle,
            color: "#3B82F6",
            margin: "0 0 6px",
            lineHeight: LINE_HEIGHT.heroTitle,
            letterSpacing: LETTER_SPACING.heroTitle,
          }}
        >
          {assignment.title}
        </h1>
        <p
          style={{
            fontSize: FONT_SIZE.bodySmall,
            color: t.textSub,
            margin: 0,
            fontWeight: FONT_WEIGHT.medium,
            fontFamily: FONT_FAMILY,
          }}
        >
          {assignment.description}
        </p>
      </div>

      {/* ═══ Stat cards ═══ */}
      <div className="stat-grid" style={{ marginBottom: 20 }}>
        {stats.map((s, i) => (
          <StatCard key={i} stat={s} index={i} loading={false} />
        ))}
      </div>

      {/* ═══ Assignment Info card ═══ */}
      <div style={{ ...card, marginBottom: 16 }}>
        <div style={panelHead("rgba(167,139,250,0.05)")}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(167,139,250,0.10)",
                border: "1px solid rgba(167,139,250,0.18)",
              }}
            >
              <Calendar size={15} color="#a78bfa" />
            </div>
            <div>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: FONT_WEIGHT.bold,
                  color: t.text,
                  margin: 0,
                  fontFamily: FONT_FAMILY,
                }}
              >
                Assignment Info
              </p>
              <p
                style={{
                  fontSize: 11,
                  color: t.textMuted,
                  margin: "2px 0 0",
                  fontFamily: FONT_FAMILY,
                }}
              >
                Deadline &amp; grading details
              </p>
            </div>
          </div>
        </div>

        <div style={{ padding: "20px 22px" }}>
          {metaRow(
            Calendar,
            "#a78bfa",
            "Deadline",
            new Date(assignment.deadline).toLocaleString(),
            isLate && (
              <span
                style={{
                  padding: "3px 10px",
                  borderRadius: 6,
                  background: t.overdueBg,
                  color: t.overdueText,
                  fontSize: 11,
                  fontWeight: FONT_WEIGHT.bold,
                  border: `1px solid ${t.overdueBorder}`,
                }}
              >
                Deadline Passed
              </span>
            ),
          )}
          {metaRow(Award, "#fb923c", "Max Marks", assignment.maxMarks)}

          {totalAssignmentCount > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "14px 16px",
                borderRadius: 12,
                background: t.statusCompletedBg,
                border: `1px solid ${t.statusCompletedBg}`,
                marginTop: 10,
              }}
            >
              <CheckCircle2
                size={16}
                color={t.statusCompletedText}
                style={{ flexShrink: 0 }}
              />
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: FONT_WEIGHT.bold,
                    color: t.statusCompletedText,
                    margin: 0,
                    fontFamily: FONT_FAMILY,
                  }}
                >
                  {completedAssignmentIds.length} / {totalAssignmentCount}{" "}
                  assignments submitted
                </p>
                <div
                  style={{
                    width: 100,
                    height: 4,
                    borderRadius: 99,
                    background: t.barBg,
                    overflow: "hidden",
                    marginTop: 4,
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      borderRadius: 99,
                      background: t.statusCompletedText,
                      width: `${progressPercentage}%`,
                      transition: "width 0.5s ease",
                    }}
                  />
                </div>
              </div>
              <span
                style={{
                  fontSize: 11,
                  color: t.textMuted,
                  fontFamily: FONT_FAMILY,
                }}
              >
                {progressPercentage.toFixed(0)}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ═══ Files card ═══ */}
      <div style={{ ...card, marginBottom: 16 }}>
        <div style={panelHead("rgba(34,211,238,0.05)")}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(34,211,238,0.10)",
                border: "1px solid rgba(34,211,238,0.18)",
              }}
            >
              <FileText size={15} color="#22d3ee" />
            </div>
            <div>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: FONT_WEIGHT.bold,
                  color: t.text,
                  margin: 0,
                  fontFamily: FONT_FAMILY,
                }}
              >
                Assignment Files
              </p>
              <p
                style={{
                  fontSize: 11,
                  color: t.textMuted,
                  margin: "2px 0 0",
                  fontFamily: FONT_FAMILY,
                }}
              >
                {files.length > 0
                  ? `${files.length} file${files.length !== 1 ? "s" : ""} attached`
                  : "No files attached"}
              </p>
            </div>
          </div>
        </div>

        <div style={{ padding: "20px 22px" }}>
          {files.length === 0 && (
            <div style={{ padding: "24px 0", textAlign: "center" }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: `1.5px dashed ${t.emptyBorder}`,
                  background: t.emptyBg,
                  margin: "0 auto 10px",
                }}
              >
                <FileText size={20} color={t.emptyIcon} />
              </div>
              <p
                style={{
                  fontSize: 12,
                  color: t.textMuted,
                  fontFamily: FONT_FAMILY,
                  margin: 0,
                }}
              >
                No files attached.
              </p>
            </div>
          )}

          {files.map((file) => (
            <div
              key={file.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                padding: "12px 14px",
                borderRadius: 12,
                background: t.recentItemBg,
                border: `1px solid ${t.recentItemBorder}`,
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  minWidth: 0,
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(34,211,238,0.10)",
                    color: "#22d3ee",
                    flexShrink: 0,
                  }}
                >
                  <FileText size={15} />
                </div>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: FONT_WEIGHT.semibold,
                    color: t.text,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    fontFamily: FONT_FAMILY,
                  }}
                >
                  {file.fileName}
                </span>
              </div>
              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                <button
                  onClick={() => handleView(file)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 14px",
                    borderRadius: 10,
                    border: "1px solid rgba(34,211,238,0.35)",
                    background: "transparent",
                    color: "#22d3ee",
                    fontFamily: FONT_FAMILY,
                    fontSize: 12,
                    fontWeight: FONT_WEIGHT.bold,
                    cursor: "pointer",
                  }}
                >
                  <Eye size={13} /> View
                </button>
                <button
                  onClick={() => handleDownload(file)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 14px",
                    borderRadius: 10,
                    border: "none",
                    background: "linear-gradient(135deg,#7c3aed,#a855f7)",
                    color: "#fff",
                    fontFamily: FONT_FAMILY,
                    fontSize: 12,
                    fontWeight: FONT_WEIGHT.bold,
                    cursor: "pointer",
                  }}
                >
                  <Download size={13} /> Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ Submit card ═══ */}
      <div style={card}>
        <div
          style={panelHead(
            isSubmitted ? "rgba(52,211,153,0.05)" : "rgba(167,139,250,0.05)",
          )}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(52,211,153,0.10)",
                border: "1px solid rgba(52,211,153,0.18)",
              }}
            >
              <Upload size={15} color="#34d399" />
            </div>
            <div>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: FONT_WEIGHT.bold,
                  color: t.text,
                  margin: 0,
                  fontFamily: FONT_FAMILY,
                }}
              >
                Submit Assignment
              </p>
              <p
                style={{
                  fontSize: 11,
                  color: t.textMuted,
                  margin: "2px 0 0",
                  fontFamily: FONT_FAMILY,
                }}
              >
                {isSubmitted
                  ? "Already submitted — you can resubmit"
                  : "Upload your work below"}
              </p>
            </div>
          </div>
        </div>

        <div style={{ padding: "20px 22px" }}>
          {usage && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "7px 14px",
                borderRadius: 12,
                border: `1px solid ${t.border}`,
                background: t.recentItemBg,
                marginBottom: 16,
                fontFamily: FONT_FAMILY,
                fontSize: 12,
                fontWeight: FONT_WEIGHT.semibold,
                color: t.textSub,
              }}
            >
              {usage.limit === "unlimited"
                ? "Unlimited submissions"
                : `${usage.used}/${usage.limit} submissions this month`}
            </div>
          )}
          {isSubmitted && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "12px 16px",
                borderRadius: 12,
                background: t.statusCompletedBg,
                border: `1px solid ${t.statusCompletedBg}`,
                marginBottom: 16,
              }}
            >
              <CheckCircle2 size={18} color={t.statusCompletedText} />
              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    fontWeight: FONT_WEIGHT.bold,
                    color: t.statusCompletedText,
                    fontFamily: FONT_FAMILY,
                  }}
                >
                  Assignment Submitted
                </p>
                <p
                  style={{
                    margin: "2px 0 0",
                    fontSize: 11,
                    color: t.textMuted,
                    fontFamily: FONT_FAMILY,
                  }}
                >
                  {completedAssignmentIds.length}/{totalAssignmentCount}{" "}
                  submitted ({progressPercentage.toFixed(0)}% complete)
                </p>
              </div>
            </div>
          )}

          {submissionStatus && !isSubmitted && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 16px",
                borderRadius: 12,
                background: t.statusCompletedBg,
                border: `1px solid ${t.statusCompletedBg}`,
                color: t.statusCompletedText,
                fontSize: 13,
                fontWeight: FONT_WEIGHT.semibold,
                marginBottom: 16,
                fontFamily: FONT_FAMILY,
              }}
            >
              <CheckCircle2 size={16} />
              Submitted ({submissionStatus})
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <input
              type="file"
              onChange={handleFileSelect}
              accept=".pdf,.doc,.docx,.zip,.txt"
              style={{
                width: "100%",
                padding: "13px 16px",
                borderRadius: 14,
                boxSizing: "border-box",
                border: `1px dashed ${t.border}`,
                background: t.recentItemBg,
                color: t.text,
                fontFamily: FONT_FAMILY,
                fontSize: 12,
                fontWeight: FONT_WEIGHT.medium,
                cursor: "pointer",
              }}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "13px 20px",
              borderRadius: 14,
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
              fontFamily: FONT_FAMILY,
              fontSize: 13,
              fontWeight: FONT_WEIGHT.bold,
              background: isSubmitted
                ? "#34d399"
                : "linear-gradient(135deg,#7c3aed,#a855f7)",
              color: "#fff",
            }}
          >
            <Upload size={15} />
            {loading
              ? "Submitting..."
              : isSubmitted
                ? "Resubmit Assignment"
                : "Submit Assignment"}
          </button>
        </div>
      </div>

      {/* ═══ Document Viewer Popup ═══ */}
      {viewerFile && viewerObjectUrl && (
        <DocViewer
          file={viewerFile}
          objectUrl={viewerObjectUrl}
          onClose={handleCloseViewer}
          t={t}
        />
      )}
      {upgradeConfig && (
        <UpgradeModal
          isOpen={!!upgradeConfig}
          onClose={() => setUpgradeConfig(null)}
          planType="individual"
          userId={getAuthTokenUserId()}
          currentPlan={usage?.tier || "free"}
          availableTargetPlans={["pro", "premium"]}
          featureLabel={upgradeConfig.featureLabel}
          onSuccess={() => {
            setUpgradeConfig(null);
            getAssignmentSubmitUsage()
              .then((res) => setUsage(res.data))
              .catch(() => {});
          }}
        />
      )}
    </PageContainer>
  );
}
