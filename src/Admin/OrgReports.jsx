
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BarChart3,
  Users,
  Layers,
  Shield,
  Activity,
  Video,
  BookOpen,
  ClipboardList,
  FolderOpen,
  Eye,
  ArrowUpRight,
} from "lucide-react";

// ─── Import ONLY from your provided service files ─────────────────────────────
import { progressService } from "../services/progressService";
import userService from "../services/userService";
import videoService from "../services/videoService";
import { courseService } from "../services/courseService";
import { getAllQuizzes, getAssignmentsByBatch } from "../services/assessmentService";
import { getAllBatches } from "../services/batchService";
import fileService from "../services/fileService";

/* ══════════════════════════════════════════════════════════════════════════════
   THEME — mirrors AdminDashboard T object exactly
══════════════════════════════════════════════════════════════════════════════ */
const T = {
  dark: {
    pageBg: "#0a0a0a",
    cardBg: "#111111",
    cardBgHov: "#161616",
    heroBg: "#0d0d14",
    border: "rgba(255,255,255,0.06)",
    borderHov: "rgba(255,255,255,0.14)",
    borderHero: "rgba(255,255,255,0.07)",
    text: "#ffffff",
    textSub: "rgba(255,255,255,0.55)",
    textMuted: "rgba(255,255,255,0.3)",
    textLabel: "rgba(255,255,255,0.22)",
    pillBg: "rgba(255,255,255,0.04)",
    pillBorder: "rgba(255,255,255,0.07)",
    pillText: "rgba(255,255,255,0.25)",
    iconBg: "rgba(255,255,255,0.05)",
    iconBorder: "rgba(255,255,255,0.08)",
    shadow: "0 4px 20px rgba(0,0,0,0.4)",
    shadowHov: "0 20px 60px rgba(0,0,0,0.6)",
    barBg: "rgba(255,255,255,0.05)",
    recentItemBg: "rgba(255,255,255,0.03)",
    recentItemBorder: "rgba(255,255,255,0.06)",
    recentItemBgHov: "rgba(255,255,255,0.07)",
    emptyBorder: "rgba(255,255,255,0.07)",
    emptyBg: "rgba(255,255,255,0.02)",
    emptyIcon: "rgba(255,255,255,0.15)",
    heroBadgeDot: "#818cf8",
    heroBadgeText: "#a5b4fc",
    heroTitle: "#ffffff",
    heroSub: "rgba(255,255,255,0.38)",
    heroBtnBg: "rgba(255,255,255,0.04)",
    heroBtnBorder: "rgba(255,255,255,0.09)",
    heroBtnColor: "rgba(255,255,255,0.50)",
    heroStatBg: "rgba(255,255,255,0.04)",
    heroStatBorder: "rgba(255,255,255,0.08)",
    heroStatText: "rgba(255,255,255,0.42)",
    heroStatDiv: "rgba(255,255,255,0.10)",
    tabActiveBg: "linear-gradient(135deg,#2563eb,#06b6d4)",
    tabInactiveBg: "transparent",
    tabActiveColor: "#ffffff",
    tabInactiveColor: "rgba(255,255,255,0.40)",
    tabContainerBg: "rgba(255,255,255,0.04)",
    tabContainerBorder: "rgba(255,255,255,0.07)",
    sectionLabel: "rgba(255,255,255,0.30)",
    progressTrack: "rgba(255,255,255,0.07)",
    batchBtnActiveBg: "rgba(16,185,129,0.12)",
    batchBtnActiveBorder: "#10b981",
    batchBtnActiveColor: "#10b981",
    batchBtnBg: "rgba(255,255,255,0.04)",
    batchBtnBorder: "rgba(255,255,255,0.10)",
    batchBtnColor: "rgba(255,255,255,0.45)",
    divider: "rgba(255,255,255,0.06)",
    skeletonFrom: "rgba(255,255,255,0.04)",
    skeletonMid: "rgba(255,255,255,0.08)",
    errorBg: "rgba(239,68,68,0.10)",
    errorBorder: "rgba(239,68,68,0.20)",
    errorColor: "#f87171",
    backColor: "rgba(255,255,255,0.45)",
    backColorHov: "rgba(255,255,255,0.90)",
    gridLine: "rgba(255,255,255,0.025)",
  },
  light: {
    pageBg: "#f1f5f9",
    cardBg: "#ffffff",
    cardBgHov: "#f8fafc",
    heroBg: "#ffffff",
    border: "#e2e8f0",
    borderHov: "#cbd5e1",
    borderHero: "#e2e8f0",
    text: "#0f172a",
    textSub: "#475569",
    textMuted: "#64748b",
    textLabel: "#94a3b8",
    pillBg: "#f1f5f9",
    pillBorder: "#e2e8f0",
    pillText: "#94a3b8",
    iconBg: "#f8fafc",
    iconBorder: "#e2e8f0",
    shadow: "0 1px 8px rgba(0,0,0,0.07)",
    shadowHov: "0 8px 32px rgba(0,0,0,0.10)",
    barBg: "#f1f5f9",
    recentItemBg: "#f8fafc",
    recentItemBorder: "#e2e8f0",
    recentItemBgHov: "#f1f5f9",
    emptyBorder: "#e2e8f0",
    emptyBg: "#f8fafc",
    emptyIcon: "#cbd5e1",
    heroBadgeDot: "#6366f1",
    heroBadgeText: "#4f46e5",
    heroTitle: "#0f172a",
    heroSub: "#64748b",
    heroBtnBg: "#f8fafc",
    heroBtnBorder: "#e2e8f0",
    heroBtnColor: "#475569",
    heroStatBg: "#f8fafc",
    heroStatBorder: "#e2e8f0",
    heroStatText: "#64748b",
    heroStatDiv: "#e2e8f0",
    tabActiveBg: "linear-gradient(135deg,#2563eb,#06b6d4)",
    tabInactiveBg: "transparent",
    tabActiveColor: "#ffffff",
    tabInactiveColor: "#64748b",
    tabContainerBg: "#f8fafc",
    tabContainerBorder: "#e2e8f0",
    sectionLabel: "#94a3b8",
    progressTrack: "#e2e8f0",
    batchBtnActiveBg: "rgba(16,185,129,0.08)",
    batchBtnActiveBorder: "#10b981",
    batchBtnActiveColor: "#059669",
    batchBtnBg: "#f8fafc",
    batchBtnBorder: "#e2e8f0",
    batchBtnColor: "#64748b",
    divider: "#e2e8f0",
    skeletonFrom: "#f1f5f9",
    skeletonMid: "#e2e8f0",
    errorBg: "#fef2f2",
    errorBorder: "#fecaca",
    errorColor: "#dc2626",
    backColor: "#64748b",
    backColorHov: "#0f172a",
    gridLine: "rgba(0,0,0,0.025)",
  },
};

/* ─── helpers ─────────────────────────────────────────────────────────────── */
function fmtN(v) { return typeof v === "number" ? Math.round(v) : 0; }

function pillColors(v) {
  if (v >= 75) return { bg: "rgba(16,185,129,0.15)", color: "#34d399", border: "rgba(16,185,129,0.20)" };
  if (v >= 50) return { bg: "rgba(245,158,11,0.15)", color: "#fbbf24", border: "rgba(245,158,11,0.20)" };
  return { bg: "rgba(239,68,68,0.15)", color: "#f87171", border: "rgba(239,68,68,0.20)" };
}

function progColor(v) {
  return v >= 75 ? "#10b981" : v >= 50 ? "#f59e0b" : "#ef4444";
}

function initials(email = "") {
  const name = email.split("@")[0];
  const parts = name.split(/[._-]/);
  return parts.length > 1
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
}

const AV_BG  = ["#E1F5EE","#EEEDFE","#FAECE7","#E6F1FB","#FAEEDA","#EAF3DE"];
const AV_FG  = ["#0F6E56","#3C3489","#993C1D","#185FA5","#854F0B","#3B6D11"];
const AV_GLO = [
  "rgba(16,185,129,0.4)","rgba(139,92,246,0.4)","rgba(239,68,68,0.4)",
  "rgba(59,130,246,0.4)","rgba(245,158,11,0.4)","rgba(20,184,166,0.4)",
];

/* ─── API utilities ── */
function toArr(res) {
  if (res.status !== "fulfilled") return [];
  const d = res.value?.data;
  if (Array.isArray(d)) return d;
  if (Array.isArray(d?.content)) return d.content;
  if (Array.isArray(d?.data)) return d.data;
  return [];
}

const authH = () => ({ Authorization: `Bearer ${localStorage.getItem("lms_token")}` });
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

async function fetchFilesForBatch(batchId) {
  try {
    const r = await fetch(`${API_BASE}/file/batch/${batchId}`, { headers: authH() });
    if (!r.ok) return [];
    const d = await r.json();
    return Array.isArray(d) ? d : Array.isArray(d?.content) ? d.content : [];
  } catch { return []; }
}

function matchEmail(obj, email) {
  if (!obj || !email) return false;
  const e = email.toLowerCase();
  return (
    obj.trainerEmail?.toLowerCase() === e ||
    obj.uploaderEmail?.toLowerCase() === e ||
    obj.createdBy?.toLowerCase() === e ||
    obj.ownerEmail?.toLowerCase() === e ||
    obj.instructorEmail?.toLowerCase() === e ||
    obj.uploadedBy?.toLowerCase() === e ||
    obj.trainerid?.toLowerCase() === e ||
    obj.trainer?.toLowerCase() === e ||
    obj.trainer?.email?.toLowerCase() === e ||
    obj.createdByEmail?.toLowerCase() === e ||
    obj.assignedTrainer?.toLowerCase() === e ||
    (Array.isArray(obj.trainerEmails) && obj.trainerEmails.map(x => x.toLowerCase()).includes(e))
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   SHARED DESIGN PRIMITIVES
══════════════════════════════════════════════════════════════════════════════ */

/** Card */
function Card({ children, t, style = {}, hover = false }) {
  const [hov, setHov] = useState(false);
  const isHoverable = hover;
  return (
    <div
      onMouseEnter={isHoverable ? () => setHov(true) : undefined}
      onMouseLeave={isHoverable ? () => setHov(false) : undefined}
      style={{
        background: isHoverable && hov ? t.cardBgHov : t.cardBg,
        border: `1px solid ${isHoverable && hov ? t.borderHov : t.border}`,
        borderRadius: 20,
        padding: "1.25rem",
        marginBottom: "1rem",
        boxShadow: isHoverable && hov ? t.shadowHov : t.shadow,
        transition: "all 0.25s ease",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** Section label — uses div so it can safely hold icon children */
function SLabel({ children, t, style = {} }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 6,
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      color: t.sectionLabel,
      margin: "0 0 14px",
      fontFamily: "'Poppins',sans-serif",
      lineHeight: 1,
      ...style,
    }}>{children}</div>
  );
}

/** Status pill */
function SPill({ value, style = {} }) {
  const pc = pillColors(value);
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      fontSize: 11,
      padding: "4px 12px",
      borderRadius: 999,
      fontWeight: 600,
      fontFamily: "'Poppins',sans-serif",
      background: pc.bg,
      color: pc.color,
      border: `1px solid ${pc.border}`,
      whiteSpace: "nowrap",
      lineHeight: 1,
      ...style,
    }}>{fmtN(value)}% avg</span>
  );
}

/** Skeleton loader */
function Skel({ height = 200, t }) {
  return (
    <div style={{
      height, borderRadius: 16, marginBottom: "1rem",
      background: `linear-gradient(90deg,${t.skeletonFrom},${t.skeletonMid},${t.skeletonFrom})`,
      backgroundSize: "200% 100%",
      animation: "or-shimmer 1.5s ease-in-out infinite",
    }} />
  );
}

/** Error box */
function ErrBox({ msg, t }) {
  return (
    <div style={{
      background: t.errorBg, border: `1px solid ${t.errorBorder}`,
      borderRadius: 12, padding: "1rem 1.25rem",
      color: t.errorColor, fontFamily: "'Poppins',sans-serif", fontSize: 13,
      marginBottom: "1rem",
    }}>{msg}</div>
  );
}

/** Back button */
function BackBtn({ label, onClick, t }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: 13,
        fontWeight: 500,
        color: hov ? t.backColorHov : t.backColor,
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "6px 0",
        marginBottom: "1.25rem",
        fontFamily: "'Poppins',sans-serif",
        transition: "color .15s",
        lineHeight: 1,
      }}
    >
      <ArrowLeft size={13} style={{ flexShrink: 0 }} />
      {label}
    </button>
  );
}

/** Progress bar */
function PBar({ value, color, t }) {
  return (
    <div style={{ flex: 1, background: t.progressTrack, borderRadius: 4, height: 6, overflow: "hidden" }}>
      <div style={{
        width: `${Math.min(value || 0, 100)}%`, height: 6, borderRadius: 4,
        background: color, boxShadow: `0 0 8px ${color}60`,
        transition: "width .7s cubic-bezier(0.4,0,0.2,1)",
      }} />
    </div>
  );
}

/** Content badge */
function CBadge({ icon: Icon, label, count, color, t }) {
  return (
    <div style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      background: `${color}14`,
      border: `1px solid ${color}28`,
      borderRadius: 10,
      padding: "6px 10px",
      lineHeight: 1,
    }}>
      <Icon size={12} color={color} style={{ flexShrink: 0 }} />
      <span style={{ fontSize: 11, fontWeight: 700, color, fontFamily: "'Poppins',sans-serif", lineHeight: 1 }}>{count}</span>
      <span style={{ fontSize: 10, color: t.textMuted, fontFamily: "'Poppins',sans-serif", lineHeight: 1 }}>{label}</span>
    </div>
  );
}

/** Empty state */
function EmptyState({ icon: Icon, text, t }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 0", gap: 10 }}>
      <div style={{
        width: 46, height: 46, borderRadius: 13,
        display: "flex", alignItems: "center", justifyContent: "center",
        border: `1.5px dashed ${t.emptyBorder}`, background: t.emptyBg,
      }}>
        <Icon size={19} color={t.emptyIcon} />
      </div>
      <p style={{ fontSize: 11, color: t.textMuted, fontWeight: 500, fontFamily: "'Poppins',sans-serif", margin: 0 }}>{text}</p>
    </div>
  );
}

/** More label */
function MoreLabel({ count, t }) {
  return (
    <p style={{ fontSize: 10, color: t.textLabel, textAlign: "center", margin: "6px 0 0", fontFamily: "'Poppins',sans-serif" }}>
      +{count} more
    </p>
  );
}

/** Content row (list item) */
function CRow({ icon: Icon, color, title, sub, t }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 10px",
        borderRadius: 12,
        background: hov ? t.recentItemBgHov : t.recentItemBg,
        border: `1px solid ${hov ? t.recentItemBorder : "transparent"}`,
        transition: "all .15s",
        marginBottom: 4,
      }}
    >
      <div style={{
        width: 32, height: 32, borderRadius: 9, flexShrink: 0,
        background: `${color}18`, border: `1px solid ${color}28`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon size={13} color={color} />
      </div>
      <span style={{
        fontSize: 12, color: t.text, flex: 1,
        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        fontFamily: "'Poppins',sans-serif", fontWeight: 500,
        lineHeight: 1.3,
      }}>{title}</span>
      {sub && (
        <span style={{
          fontSize: 10, color: t.textLabel, flexShrink: 0,
          fontFamily: "'Poppins',sans-serif", lineHeight: 1,
        }}>{sub}</span>
      )}
    </div>
  );
}

/** Metric tile */
function MetricTile({ label, value, color, t }) {
  return (
    <div style={{
      background: t.cardBg, border: `1px solid ${t.border}`,
      borderRadius: 16, padding: "16px 18px", boxShadow: t.shadow,
      position: "relative", overflow: "hidden",
    }}>
      <p style={{
        fontSize: 10, color: t.textLabel, textTransform: "uppercase",
        letterSpacing: "0.07em", margin: "0 0 8px", fontWeight: 600,
        fontFamily: "'Poppins',sans-serif", lineHeight: 1,
      }}>{label}</p>
      <p style={{
        fontSize: 24, fontWeight: 800, color: color || t.text,
        margin: 0, fontFamily: "'Poppins',sans-serif", lineHeight: 1,
      }}>{value}</p>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────────
   ARC METER
────────────────────────────────────────────────────────────────────────────── */
function ArcMeter({ value, color, size = 100 }) {
  const r = 38, cx = 50, cy = 52;
  const circ = Math.PI * r;
  const progress = (value / 100) * circ;
  return (
    <svg viewBox="0 0 100 60" style={{ width: size, height: size * 0.6 }}>
      <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" strokeLinecap="round" />
      <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none" stroke={color} strokeWidth="6" strokeLinecap="round"
        strokeDasharray={`${progress} ${circ}`}
        style={{ filter: `drop-shadow(0 0 8px ${color})`, transition: "stroke-dasharray 1s ease" }} />
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize="13" fontWeight="700"
        fill={color} fontFamily="'Poppins',sans-serif">{fmtN(value)}%</text>
    </svg>
  );
}

/* ──────────────────────────────────────────────────────────────────────────────
   RADAR CHART
────────────────────────────────────────────────────────────────────────────── */
function RadarChart({ data }) {
  const axes = [
    { label: "Videos",      val: data.videoWatchPercentage ?? 0 },
    { label: "Files",       val: data.fileDownloadPercentage ?? 0 },
    { label: "Quizzes",     val: data.quizCompletionPercentage ?? 0 },
    { label: "Assignments", val: data.assignmentCompletionPercentage ?? 0 },
    { label: "Course",      val: data.courseProgressPercentage ?? 0 },
  ];
  const N = axes.length, cx = 140, cy = 130, r = 90;
  const ang = i => (Math.PI * 2 * i) / N - Math.PI / 2;
  const pt  = (i, pct) => {
    const a = ang(i), d = (pct / 100) * r;
    return [cx + d * Math.cos(a), cy + d * Math.sin(a)];
  };
  const poly = axes.map((a, i) => pt(i, a.val).join(",")).join(" ");
  return (
    <svg viewBox="0 0 280 260"
      style={{ width: "100%", maxWidth: 280, filter: "drop-shadow(0 0 12px rgba(0,255,178,0.15))" }}>
      <defs>
        <radialGradient id="rfill-or" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#00FFB2" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#00FFB2" stopOpacity="0.04" />
        </radialGradient>
      </defs>
      {[20, 40, 60, 80, 100].map(ring => (
        <polygon key={ring}
          points={axes.map((_, i) => pt(i, ring).join(",")).join(" ")}
          fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      ))}
      {axes.map((_, i) => {
        const [x2, y2] = pt(i, 100);
        return <line key={i} x1={cx} y1={cy} x2={x2} y2={y2} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />;
      })}
      <polygon points={poly} fill="url(#rfill-or)" stroke="#00FFB2" strokeWidth="2" />
      {axes.map((a, i) => {
        const [x, y] = pt(i, a.val);
        return <circle key={i} cx={x} cy={y} r={4} fill="#00FFB2"
          style={{ filter: "drop-shadow(0 0 5px #00FFB2)" }} />;
      })}
      {axes.map((a, i) => {
        const [x, y] = pt(i, 118);
        return <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle"
          fontSize="10" fill="rgba(255,255,255,0.55)" fontFamily="'Poppins',sans-serif">{a.label}</text>;
      })}
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   STUDENT DETAIL PANEL
══════════════════════════════════════════════════════════════════════════════ */
function StudentDetailPanel({ student, batchId, onBack, t }) {
  const [detail, setDetail]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    progressService
      .getStudentProgressInBatch(batchId, student.studentEmail)
      .then(res => { setDetail(res.data); setLoading(false); })
      .catch(() => { setDetail(student); setLoading(false); });
  }, [student, batchId]);

  const d = detail || student;
  const arcMeters = [
    { label: "Videos",      val: d.videoWatchPercentage,          color: "#00FFB2", sub: `${d.videosWatched??0}/${d.totalVideos??0}` },
    { label: "Files",       val: d.fileDownloadPercentage,        color: "#38BDF8", sub: `${d.filesDownloaded??0}/${d.totalFiles??0}` },
    { label: "Quizzes",     val: d.quizCompletionPercentage,      color: "#A78BFA", sub: `${d.quizzesCompleted??0}/${d.totalQuizzes??0}` },
    { label: "Assignments", val: d.assignmentCompletionPercentage,color: "#FB923C", sub: `${d.assignmentsCompleted??0}/${d.totalAssignments??0}` },
    { label: "Course",      val: d.courseProgressPercentage,      color: "#FBBF24", sub: `${d.courseContentCompleted??0}/${d.totalCourseContent??0}` },
  ];
  const breakdownBars = [
    { label: "Video watch",  val: d.videoWatchPercentage,          color: "#00FFB2" },
    { label: "File download",val: d.fileDownloadPercentage,        color: "#38BDF8" },
    { label: "Quiz",         val: d.quizCompletionPercentage,      color: "#A78BFA" },
    { label: "Assignments",  val: d.assignmentCompletionPercentage,color: "#FB923C" },
    { label: "Course",       val: d.courseProgressPercentage,      color: "#FBBF24" },
  ];

  return (
    <div>
      <BackBtn label="Back to batch students" onClick={onBack} t={t} />
      {loading ? <Skel height={440} t={t} /> : (
        <Card t={t}>
          {/* Banner */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24, flexWrap: "wrap" }}>
            <div style={{
              width: 52, height: 52, borderRadius: "50%", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, fontWeight: 700, fontFamily: "'Poppins',sans-serif",
              background: "linear-gradient(135deg,#00FFB2,#00C87A)", color: "#003D24",
              lineHeight: 1,
            }}>{initials(d.studentEmail)}</div>
            <div>
              <h2 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 18, fontWeight: 700, margin: 0, color: t.text, lineHeight: 1.2 }}>{d.studentEmail}</h2>
              <p style={{ fontSize: 12, color: t.textMuted, margin: "4px 0 0", fontFamily: "'Poppins',sans-serif", lineHeight: 1 }}>
                Batch <strong style={{ color: t.textSub }}>{d.batchId || batchId}</strong>
              </p>
            </div>
            <div style={{
              marginLeft: "auto",
              display: "flex", flexDirection: "column", alignItems: "center",
              border: `2px solid ${progColor(d.overallProgressPercentage)}44`,
              borderRadius: 16, padding: "12px 22px",
              background: t.heroStatBg,
            }}>
              <span style={{
                fontFamily: "'Poppins',sans-serif", fontSize: 30, fontWeight: 900,
                lineHeight: 1, color: progColor(d.overallProgressPercentage),
              }}>{fmtN(d.overallProgressPercentage)}%</span>
              <span style={{ fontSize: 9, color: t.textLabel, marginTop: 4, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "'Poppins',sans-serif", lineHeight: 1 }}>overall</span>
            </div>
          </div>

          {/* Arc meter row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8, marginBottom: 20 }}>
            {arcMeters.map(m => (
              <div key={m.label} style={{
                background: t.heroStatBg, border: `1px solid ${t.heroStatBorder}`,
                borderRadius: 16, padding: "12px 8px 10px", textAlign: "center",
                display: "flex", flexDirection: "column", alignItems: "center",
              }}>
                <ArcMeter value={m.val || 0} color={m.color} size={90} />
                <p style={{ fontSize: 10, fontWeight: 700, color: t.textMuted, margin: "4px 0 2px", textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "'Poppins',sans-serif", lineHeight: 1 }}>{m.label}</p>
                <p style={{ fontSize: 10, color: t.textLabel, margin: 0, fontFamily: "'Poppins',sans-serif", lineHeight: 1 }}>{m.sub}</p>
              </div>
            ))}
          </div>

          {/* Breakdown + Radar */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={{ background: t.heroStatBg, border: `1px solid ${t.heroStatBorder}`, borderRadius: 16, padding: 18 }}>
              <SLabel t={t}>Progress Breakdown</SLabel>
              {breakdownBars.map(m => (
                <div key={m.label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <span style={{ fontSize: 11, color: t.textMuted, width: 105, flexShrink: 0, fontFamily: "'Poppins',sans-serif", lineHeight: 1 }}>{m.label}</span>
                  <PBar value={m.val} color={m.color} t={t} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: m.color, width: 40, textAlign: "right", fontFamily: "'Poppins',sans-serif", lineHeight: 1 }}>{fmtN(m.val)}%</span>
                </div>
              ))}
            </div>
            <div style={{
              background: t.heroStatBg, border: `1px solid ${t.heroStatBorder}`,
              borderRadius: 16, padding: 18,
              display: "flex", flexDirection: "column", alignItems: "center",
            }}>
              <SLabel t={t} style={{ alignSelf: "flex-start" }}>Skill Radar</SLabel>
              <RadarChart data={d} />
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   TRAINER DETAIL
══════════════════════════════════════════════════════════════════════════════ */
function TrainerDetail({ trainer, onBack, t }) {
  const [progressReport, setProgressReport]     = useState(null);
  const [progressLoading, setProgressLoading]   = useState(true);
  const [progressError, setProgressError]       = useState(null);
  const [contentLoading, setContentLoading]     = useState(true);
  const [content, setContent] = useState({ videos:[], files:[], courses:[], quizzes:[], assignments:[], batches:[] });
  const [selectedBatch, setSelectedBatch]       = useState(null);
  const [batchStudents, setBatchStudents]       = useState([]);
  const [batchStudLoading, setBatchStudLoading] = useState(false);
  const [batchStudError, setBatchStudError]     = useState(null);
  const [selectedStudent, setSelectedStudent]   = useState(null);
  const [activeTab, setActiveTab]               = useState("progress");
  const trainerEmail = trainer.email;

  /* ── 1. Progress report + Content parallel fetch ── */
  useEffect(() => {
    setProgressLoading(true);
    progressService.getTrainerProgressReport(trainerEmail)
      .then(res => { setProgressReport(res.data); setProgressLoading(false); })
      .catch(err => { setProgressError(err.response?.data?.message || err.message); setProgressLoading(false); });

    setContentLoading(true);
    Promise.allSettled([
      videoService.getAllVideos(),
      courseService.getAllCoursesForAdmin(),
      getAllQuizzes(),
      getAllBatches(),
    ]).then(async ([vRes, cRes, qRes, bRes]) => {
      const videos   = toArr(vRes).filter(v => matchEmail(v, trainerEmail));
      const courses  = toArr(cRes).filter(c => matchEmail(c, trainerEmail));
      const quizzes  = toArr(qRes).filter(q => matchEmail(q, trainerEmail));
      const allBatches = toArr(bRes);
      const batches  = allBatches.filter(b => matchEmail(b, trainerEmail));
      const batchIds = batches.map(b => b.id ?? b.batchId).filter(Boolean);

      let allFiles = [], allAssignments = [];
      if (batchIds.length > 0) {
        const perBatch = await Promise.allSettled(
          batchIds.flatMap(batchId => [
            fetchFilesForBatch(batchId).then(data => ({ type: "files", data })),
            getAssignmentsByBatch(batchId)
              .then(r => {
                const arr = Array.isArray(r.data) ? r.data
                  : Array.isArray(r.data?.content) ? r.data.content
                  : Array.isArray(r.data?.data)    ? r.data.data : [];
                return { type: "assignments", data: arr };
              })
              .catch(() => ({ type: "assignments", data: [] })),
          ])
        );
        const sF = new Set(), sA = new Set();
        for (const res of perBatch) {
          if (res.status !== "fulfilled") continue;
          const { type, data } = res.value;
          const arr = Array.isArray(data) ? data : Array.isArray(data?.content) ? data.content : Array.isArray(data?.data) ? data.data : [];
          for (const item of arr) {
            const id = item.id ?? item.fileId ?? item.assignmentId ?? JSON.stringify(item);
            if (type === "files"       && !sF.has(id)) { sF.add(id); allFiles.push(item); }
            if (type === "assignments" && !sA.has(id)) { sA.add(id); allAssignments.push(item); }
          }
        }
      }
      setContent({ videos, files: allFiles, courses, quizzes, assignments: allAssignments, batches });
      if (batches.length > 0) setSelectedBatch(batches[0]);
      setContentLoading(false);
    });
  }, [trainerEmail]);

  /* ── 2. Batch students ── */
  useEffect(() => {
    if (!selectedBatch) return;
    setBatchStudLoading(true);
    setBatchStudError(null);
    setBatchStudents([]);
    setSelectedStudent(null);
    const batchId = selectedBatch.id ?? selectedBatch.batchId;
    progressService.getBatchProgressReport(batchId)
      .then(res => {
        const students = res.data?.studentReports ?? (Array.isArray(res.data) ? res.data : []);
        setBatchStudents(students);
        setBatchStudLoading(false);
      })
      .catch(err => { setBatchStudError(err.response?.data?.message || err.message); setBatchStudLoading(false); });
  }, [selectedBatch]);

  const areas = progressReport ? [
    { label: "Video watch",  val: progressReport.avgVideoWatchPercentage,          color: "#22d3ee" },
    { label: "File download",val: progressReport.avgFileDownloadPercentage,        color: "#38bdf8" },
    { label: "Quiz",         val: progressReport.avgQuizCompletionPercentage,      color: "#a78bfa" },
    { label: "Assignments",  val: progressReport.avgAssignmentCompletionPercentage,color: "#fb923c" },
    { label: "Course",       val: progressReport.avgCourseProgressPercentage,      color: "#f59e0b" },
  ] : [];

  if (selectedStudent) {
    return <StudentDetailPanel student={selectedStudent} batchId={selectedBatch?.id ?? selectedBatch?.batchId} onBack={() => setSelectedStudent(null)} t={t} />;
  }

  const tabs = [
    { key: "progress", label: "Progress Report" },
    { key: "content",  label: "Content" },
    { key: "batches",  label: "Batch Students" },
  ];

  return (
    <div>
      <BackBtn label="Back to all trainers" onClick={onBack} t={t} />

      {/* Trainer hero card */}
      <div style={{
        background: t.heroBg, border: `1px solid ${t.borderHero}`,
        borderRadius: 20, padding: "20px 24px", marginBottom: "1rem",
        boxShadow: t.shadow,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 14,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14, flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, fontWeight: 700, fontFamily: "'Poppins',sans-serif",
            background: AV_BG[0], color: AV_FG[0],
            boxShadow: `0 4px 18px ${AV_GLO[0]}`,
            lineHeight: 1,
          }}>{initials(trainerEmail)}</div>
          <div>
            <h2 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 18, fontWeight: 700, margin: 0, color: t.text, lineHeight: 1.2 }}>{trainerEmail}</h2>
            <p style={{ fontSize: 12, color: t.textMuted, margin: "4px 0 0", fontFamily: "'Poppins',sans-serif", lineHeight: 1 }}>{trainer.displayName || "Trainer"}</p>
          </div>
        </div>
        {progressReport && <SPill value={progressReport.avgOverallProgressPercentage} style={{ fontSize: 12, padding: "5px 16px" }} />}
      </div>

      {/* Content stat badges */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: "1rem", alignItems: "center" }}>
        {contentLoading
          ? [1,2,3,4,5,6].map(i => <div key={i} style={{ width: 90, height: 32, borderRadius: 10, background: t.barBg, animation: "or-pulse 1.5s ease infinite" }} />)
          : <>
            <CBadge icon={Video}        label="Videos"      count={content.videos.length}      color="#f43f5e" t={t} />
            <CBadge icon={FolderOpen}   label="Files"       count={content.files.length}       color="#2dd4bf" t={t} />
            <CBadge icon={BookOpen}     label="Courses"     count={content.courses.length}     color="#c084fc" t={t} />
            <CBadge icon={BarChart3}    label="Quizzes"     count={content.quizzes.length}     color="#a78bfa" t={t} />
            <CBadge icon={ClipboardList}label="Assignments" count={content.assignments.length} color="#f59e0b" t={t} />
            <CBadge icon={Users}        label="Batches"     count={content.batches.length}     color="#22d3ee" t={t} />
          </>
        }
      </div>

      {/* Tab bar */}
      <div style={{
        display: "flex", gap: 4, marginBottom: "1rem",
        background: t.tabContainerBg, border: `1px solid ${t.tabContainerBorder}`,
        borderRadius: 14, padding: 4, width: "fit-content",
        alignItems: "center",
      }}>
        {tabs.map(({ key, label }) => (
          <button key={key} onClick={() => setActiveTab(key)} style={{
            padding: "8px 18px", borderRadius: 10, fontSize: 12, fontWeight: 600,
            cursor: "pointer", border: "none", transition: "all .2s",
            fontFamily: "'Poppins',sans-serif", lineHeight: 1,
            background: activeTab === key ? t.tabActiveBg : t.tabInactiveBg,
            color: activeTab === key ? t.tabActiveColor : t.tabInactiveColor,
            boxShadow: activeTab === key ? "0 4px 20px rgba(37,99,235,0.3)" : "none",
          }}>{label}</button>
        ))}
      </div>

      {/* ══ Progress Tab ══ */}
      {activeTab === "progress" && (
        <>
          {progressLoading && <Skel height={300} t={t} />}
          {progressError   && <ErrBox msg={progressError} t={t} />}
          {!progressLoading && !progressError && progressReport && (
            <>
              {/* Metric tiles */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 10, marginBottom: "1rem" }}>
                <MetricTile label="Batches"        value={progressReport.totalBatches}                                                                          t={t} />
                <MetricTile label="Students"       value={progressReport.totalStudentsHandled}                                                                  t={t} />
                <MetricTile label="Avg overall"    value={`${fmtN(progressReport.avgOverallProgressPercentage)}%`}    color={progColor(progressReport.avgOverallProgressPercentage)} t={t} />
                <MetricTile label="Avg video"      value={`${fmtN(progressReport.avgVideoWatchPercentage)}%`}          color="#22d3ee" t={t} />
                <MetricTile label="Avg quiz"       value={`${fmtN(progressReport.avgQuizCompletionPercentage)}%`}      color="#a78bfa" t={t} />
                <MetricTile label="Avg assignment" value={`${fmtN(progressReport.avgAssignmentCompletionPercentage)}%`}color="#fb923c" t={t} />
              </div>

              {/* Breakdown + Score tiles */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: "1rem" }}>
                <Card t={t} style={{ margin: 0 }}>
                  <SLabel t={t}>Progress Breakdown</SLabel>
                  {areas.map(a => (
                    <div key={a.label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                      <span style={{ fontSize: 11, color: t.textMuted, width: 110, flexShrink: 0, fontFamily: "'Poppins',sans-serif", lineHeight: 1 }}>{a.label}</span>
                      <PBar value={a.val} color={a.color} t={t} />
                      <span style={{ fontSize: 12, fontWeight: 600, color: t.text, width: 38, textAlign: "right", fontFamily: "'Poppins',sans-serif", lineHeight: 1 }}>{fmtN(a.val)}%</span>
                    </div>
                  ))}
                </Card>
                <Card t={t} style={{ margin: 0 }}>
                  <SLabel t={t}>Score Tiles</SLabel>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                    {areas.map(a => (
                      <div key={a.label} style={{
                        flex: "1 1 80px", background: t.heroStatBg,
                        border: `1px solid ${t.heroStatBorder}`, borderRadius: 12, padding: 12, textAlign: "center",
                        display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                      }}>
                        <div style={{ fontSize: 20, fontWeight: 800, color: a.color, fontFamily: "'Poppins',sans-serif", textShadow: `0 0 12px ${a.color}55`, lineHeight: 1 }}>{fmtN(a.val)}%</div>
                        <div style={{ fontSize: 10, color: t.textMuted, fontFamily: "'Poppins',sans-serif", lineHeight: 1 }}>{a.label}</div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Batch list */}
              <Card t={t}>
                <SLabel t={t}>Batches ({progressReport.batchReports?.length || 0})</SLabel>
                {(progressReport.batchReports || []).map((batch, bi) => (
                  <div key={batch.batchId} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    flexWrap: "wrap", gap: 12, padding: "12px 0",
                    borderBottom: bi < (progressReport.batchReports.length - 1) ? `1px solid ${t.divider}` : "none",
                  }}>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, margin: 0, color: t.text, fontFamily: "'Poppins',sans-serif", lineHeight: 1.2 }}>Batch {batch.batchId}</p>
                      <p style={{ fontSize: 12, color: t.textMuted, margin: "4px 0 0", fontFamily: "'Poppins',sans-serif", lineHeight: 1 }}>{batch.totalStudents} students</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 130 }}>
                        {[
                          { label: "Video", val: batch.avgVideoWatchPercentage,    color: "#22d3ee" },
                          { label: "Quiz",  val: batch.avgQuizCompletionPercentage, color: "#a78bfa" },
                        ].map(a => (
                          <div key={a.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ fontSize: 10, color: t.textLabel, width: 32, fontFamily: "'Poppins',sans-serif", lineHeight: 1 }}>{a.label}</span>
                            <div style={{ width: 72, background: t.progressTrack, borderRadius: 3, height: 5 }}>
                              <div style={{ width: `${Math.min(a.val, 100)}%`, height: 5, borderRadius: 3, background: a.color, transition: "width 0.6s ease" }} />
                            </div>
                            <span style={{ fontSize: 10, color: t.textMuted, fontFamily: "'Poppins',sans-serif", lineHeight: 1 }}>{fmtN(a.val)}%</span>
                          </div>
                        ))}
                      </div>
                      <SPill value={batch.avgOverallProgressPercentage} />
                    </div>
                  </div>
                ))}
              </Card>
            </>
          )}
        </>
      )}

      {/* ══ Content Tab ══ */}
      {activeTab === "content" && (
        <div>
          {contentLoading ? <Skel height={340} t={t} /> : (
            <>
              <Card t={t}>
                <SLabel t={t}>
                  <Video size={11} color="#f43f5e" style={{ flexShrink: 0 }} />
                  Videos ({content.videos.length})
                </SLabel>
                {content.videos.length === 0 ? <EmptyState icon={Video} text="No videos found" t={t} />
                  : content.videos.slice(0, 6).map((v, i) => (
                    <CRow key={v.id || i} icon={Video} color="#f43f5e" t={t}
                      title={v.title || v.fileName || v.videoTitle || v.originalFileName || "Untitled Video"}
                      sub={v.uploadedAt ? new Date(v.uploadedAt).toLocaleDateString() : v.createdAt ? new Date(v.createdAt).toLocaleDateString() : ""} />
                  ))}
                {content.videos.length > 6 && <MoreLabel count={content.videos.length - 6} t={t} />}
              </Card>

              <Card t={t}>
                <SLabel t={t}>
                  <BookOpen size={11} color="#c084fc" style={{ flexShrink: 0 }} />
                  Courses ({content.courses.length})
                </SLabel>
                {content.courses.length === 0 ? <EmptyState icon={BookOpen} text="No courses found" t={t} />
                  : content.courses.slice(0, 6).map((c, i) => (
                    <CRow key={c.id || i} icon={BookOpen} color="#c084fc" t={t}
                      title={c.title || c.courseName || c.name || "Untitled Course"}
                      sub={c.studentsEnrolled != null ? `${c.studentsEnrolled} enrolled` : ""} />
                  ))}
                {content.courses.length > 6 && <MoreLabel count={content.courses.length - 6} t={t} />}
              </Card>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: "1rem" }}>
                <Card t={t} style={{ margin: 0 }}>
                  <SLabel t={t}>
                    <FolderOpen size={11} color="#2dd4bf" style={{ flexShrink: 0 }} />
                    Files ({content.files.length})
                  </SLabel>
                  {content.files.length === 0 ? <EmptyState icon={FolderOpen} text="No files found" t={t} />
                    : content.files.slice(0, 5).map((f, i) => (
                      <CRow key={f.id || f.fileId || i} icon={FolderOpen} color="#2dd4bf" t={t}
                        title={f.title || f.fileName || f.originalFileName || f.name || "Untitled"}
                        sub={f.uploadedAt ? new Date(f.uploadedAt).toLocaleDateString() : f.createdAt ? new Date(f.createdAt).toLocaleDateString() : ""} />
                    ))}
                  {content.files.length > 5 && <MoreLabel count={content.files.length - 5} t={t} />}
                </Card>

                <Card t={t} style={{ margin: 0 }}>
                  <SLabel t={t}>
                    <BarChart3 size={11} color="#a78bfa" style={{ flexShrink: 0 }} />
                    Quizzes ({content.quizzes.length})
                  </SLabel>
                  {content.quizzes.length === 0 ? <EmptyState icon={BarChart3} text="No quizzes found" t={t} />
                    : content.quizzes.slice(0, 5).map((q, i) => (
                      <CRow key={q.id || i} icon={BarChart3} color="#a78bfa" t={t}
                        title={q.title || q.quizName || q.name || "Untitled Quiz"} sub="" />
                    ))}
                  {content.quizzes.length > 5 && <MoreLabel count={content.quizzes.length - 5} t={t} />}
                </Card>
              </div>

              <Card t={t}>
                <SLabel t={t}>
                  <ClipboardList size={11} color="#f59e0b" style={{ flexShrink: 0 }} />
                  Assignments ({content.assignments.length})
                </SLabel>
                {content.assignments.length === 0 ? <EmptyState icon={ClipboardList} text="No assignments found" t={t} />
                  : content.assignments.slice(0, 6).map((a, i) => (
                    <CRow key={a.id || a.assignmentId || i} icon={ClipboardList} color="#f59e0b" t={t}
                      title={a.title || a.assignmentName || a.name || "Untitled"}
                      sub={a.dueDate ? (new Date(a.dueDate) < new Date() ? "Overdue" : `Due ${new Date(a.dueDate).toLocaleDateString()}`) : ""} />
                  ))}
                {content.assignments.length > 6 && <MoreLabel count={content.assignments.length - 6} t={t} />}
              </Card>
            </>
          )}
        </div>
      )}

      {/* ══ Batch Students Tab ══ */}
      {activeTab === "batches" && (
        <div>
          {/* Batch selector pills */}
          {content.batches.length > 0 && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: "1rem", alignItems: "center" }}>
              {content.batches.map(b => {
                const bid    = b.id ?? b.batchId;
                const selBid = selectedBatch?.id ?? selectedBatch?.batchId;
                const active = bid === selBid;
                return (
                  <button key={bid} onClick={() => setSelectedBatch(b)} style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "8px 18px", borderRadius: 50, fontSize: 12, fontWeight: 600,
                    cursor: "pointer", fontFamily: "'Poppins',sans-serif", transition: "all .2s",
                    border: `1px solid ${active ? t.batchBtnActiveBorder : t.batchBtnBorder}`,
                    background: active ? t.batchBtnActiveBg : t.batchBtnBg,
                    color: active ? t.batchBtnActiveColor : t.batchBtnColor,
                    boxShadow: active ? "0 0 20px rgba(16,185,129,0.15)" : "none",
                    lineHeight: 1,
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor", flexShrink: 0 }} />
                    Batch {b.name || bid}
                  </button>
                );
              })}
            </div>
          )}

          {batchStudLoading && <Skel height={300} t={t} />}
          {batchStudError   && <ErrBox msg={batchStudError} t={t} />}

          {!batchStudLoading && !batchStudError && batchStudents.length > 0 && (
            <Card t={t}>
              <SLabel t={t}>
                Students in Batch {selectedBatch?.name || selectedBatch?.id || selectedBatch?.batchId} ({batchStudents.length}) — click to view report
              </SLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {batchStudents.map((s, i) => (
                  <StudentListRow key={s.studentEmail} student={s} index={i} onClick={() => setSelectedStudent(s)} t={t} />
                ))}
              </div>
            </Card>
          )}

          {!batchStudLoading && !batchStudError && batchStudents.length === 0 && selectedBatch && (
            <Card t={t} style={{ textAlign: "center", padding: "3rem 1rem" }}>
              <EmptyState icon={Users}
                text={`No students found in Batch ${selectedBatch?.name || selectedBatch?.id || selectedBatch?.batchId}`}
                t={t} />
            </Card>
          )}

          {!batchStudLoading && content.batches.length === 0 && (
            <Card t={t} style={{ textAlign: "center", padding: "3rem 1rem" }}>
              <EmptyState icon={Users} text="No batches found for this trainer" t={t} />
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Student list row ── */
function StudentListRow({ student: s, index: i, onClick, t }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "12px 14px", borderRadius: 14, cursor: "pointer",
        transition: "all .2s",
        background: hov ? t.recentItemBgHov : t.recentItemBg,
        border: `1px solid ${hov ? t.borderHov : t.recentItemBorder}`,
        boxShadow: hov ? t.shadowHov : "none",
        transform: hov ? "translateY(-1px)" : "none",
      }}
    >
      <div style={{
        width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 13, fontWeight: 700, fontFamily: "'Poppins',sans-serif",
        background: AV_BG[i % 6], color: AV_FG[i % 6],
        lineHeight: 1,
      }}>{initials(s.studentEmail)}</div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontSize: 13, fontWeight: 600, margin: "0 0 6px", color: t.text,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          fontFamily: "'Poppins',sans-serif", lineHeight: 1,
        }}>{s.studentEmail}</p>
        <div style={{ display: "flex", gap: 4 }}>
          {[
            { val: s.videoWatchPercentage,          color: "#22d3ee" },
            { val: s.quizCompletionPercentage,      color: "#a78bfa" },
            { val: s.assignmentCompletionPercentage,color: "#fb923c" },
          ].map((m, mi) => (
            <div key={mi} style={{ flex: 1, height: 3, background: t.progressTrack, borderRadius: 2, overflow: "hidden" }}>
              <div style={{ width: `${Math.min(m.val || 0, 100)}%`, height: 3, borderRadius: 2, background: m.color, transition: "width 0.6s ease" }} />
            </div>
          ))}
        </div>
      </div>

      <div style={{
        display: "inline-flex", alignItems: "center",
        fontSize: 13, fontWeight: 700, color: progColor(s.overallProgressPercentage),
        border: `1px solid ${progColor(s.overallProgressPercentage)}44`,
        borderRadius: 20, padding: "4px 12px", flexShrink: 0,
        fontFamily: "'Poppins',sans-serif", lineHeight: 1,
      }}>{fmtN(s.overallProgressPercentage)}%</div>

      <Eye size={14} color={hov ? t.textSub : t.textLabel} style={{ flexShrink: 0, transition: "color .2s" }} />
    </div>
  );
}

/* ─── Trainer card ── */
function TrainerCard({ trainer, index, onClick, t }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? t.cardBgHov : t.cardBg,
        border: `1px solid ${hov ? t.borderHov : t.border}`,
        borderRadius: 20, padding: "1.25rem", marginBottom: 10,
        cursor: "pointer", transition: "all .25s ease",
        transform: hov ? "translateY(-3px) scale(1.004)" : "translateY(0) scale(1)",
        boxShadow: hov ? `${t.shadowHov}, 0 0 40px ${AV_GLO[index % 6]}` : t.shadow,
        position: "relative", overflow: "hidden",
      }}
    >
      {/* Glow blob */}
      <div style={{
        position: "absolute", top: -30, right: -30, width: 120, height: 120,
        borderRadius: "50%", background: AV_GLO[index % 6],
        filter: "blur(40px)", opacity: hov ? 0.5 : 0.12,
        transition: "opacity .3s", pointerEvents: "none",
      }} />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 46, height: 46, borderRadius: 14, flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, fontWeight: 700, fontFamily: "'Poppins',sans-serif",
            background: AV_BG[index % 6], color: AV_FG[index % 6],
            boxShadow: `0 4px 16px ${AV_GLO[index % 6]}`,
            lineHeight: 1,
          }}>{initials(trainer.email)}</div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, margin: 0, color: t.text, fontFamily: "'Poppins',sans-serif", lineHeight: 1.2 }}>{trainer.email}</p>
            <p style={{ fontSize: 12, color: t.textMuted, margin: "4px 0 0", fontFamily: "'Poppins',sans-serif", lineHeight: 1 }}>{trainer.displayName || "Trainer"}</p>
          </div>
        </div>

        <button style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
          padding: "7px 14px", fontSize: 12, borderRadius: 10, cursor: "pointer",
          fontWeight: 600, border: `1px solid ${hov ? t.borderHov : t.border}`,
          background: hov ? t.heroStatBg : t.iconBg, color: hov ? t.text : t.textSub,
          fontFamily: "'Poppins',sans-serif", whiteSpace: "nowrap",
          transition: "all .2s", lineHeight: "normal",
          verticalAlign: "middle",
        }}>
          <Eye size={14} strokeWidth={1.8} style={{ flexShrink: 0, display: "block" }} />
          <span style={{ lineHeight: 1 }}>View Details</span>
          {hov && <ArrowUpRight size={13} strokeWidth={1.8} style={{ flexShrink: 0, display: "block" }} />}
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   MAIN — OrgReports
══════════════════════════════════════════════════════════════════════════════ */
const OrgReports = () => {
  const navigate = useNavigate();
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [selected, setSelected] = useState(null);

  /* Dark/light mode detection — mirrors AdminDashboard exactly */
  const [isDark, setIsDark] = useState(
    () => typeof document !== "undefined" && (
      document.documentElement.classList.contains("dark") ||
      document.documentElement.getAttribute("data-theme") === "dark"
    )
  );
  useEffect(() => {
    const obs = new MutationObserver(() => {
      setIsDark(
        document.documentElement.classList.contains("dark") ||
        document.documentElement.getAttribute("data-theme") === "dark"
      );
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class","data-theme"] });
    return () => obs.disconnect();
  }, []);

  const t = isDark ? T.dark : T.light;

  /* Load trainers */
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res      = await userService.getUsers(0, 1000);
        const allUsers = res.data?.content || res.data || [];
        setTrainers(allUsers.filter(u =>
          u.roles === "ROLE_TRAINER" || u.role === "ROLE_TRAINER" ||
          u.roles === "TRAINER"      || u.role === "TRAINER" ||
          (Array.isArray(u.roles) && u.roles.includes("ROLE_TRAINER"))
        ));
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to load trainers");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div style={{
      minHeight: "100vh", background: t.pageBg, color: t.text,
      fontFamily: "'Poppins',sans-serif", transition: "background 0.3s,color 0.3s",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        @keyframes or-shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
        @keyframes or-pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes or-fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes or-blink{0%,100%{opacity:1}50%{opacity:0.15}}
        @keyframes or-pulse-ring{0%{box-shadow:0 0 0 0 rgba(52,211,153,0.5)}70%{box-shadow:0 0 0 8px rgba(52,211,153,0)}100%{box-shadow:0 0 0 0 rgba(52,211,153,0)}}
        .or-d1{animation:or-blink 1.6s ease infinite}
        .or-d2{animation:or-blink 1.6s 0.3s ease infinite}
        .or-d3{animation:or-blink 1.6s 0.6s ease infinite}
        .or-live{animation:or-pulse-ring 2.2s ease-out infinite}
        .or-fade{animation:or-fadeUp 0.4s ease both}
        @media(max-width:640px){.or-two-col{grid-template-columns:1fr!important}}
        *{box-sizing:border-box;}
        button{outline:none;}
      `}</style>

      {/* ═══ HERO ═══ */}
      <div style={{
        position: "relative", overflow: "hidden",
        background: t.heroBg, borderBottom: `1px solid ${t.borderHero}`,
        padding: "0 24px", boxShadow: t.shadow,
      }}>
        {/* Grid overlay */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `linear-gradient(${t.gridLine} 1px,transparent 1px),linear-gradient(90deg,${t.gridLine} 1px,transparent 1px)`,
          backgroundSize: "40px 40px", pointerEvents: "none",
        }} />
        {/* Ellipse glows */}
        <div style={{ position: "absolute", top: "-50%", left: "20%", width: 400, height: 300, background: "radial-gradient(ellipse,rgba(99,102,241,0.12),transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "-40%", right: "10%", width: 300, height: 250, background: "radial-gradient(ellipse,rgba(34,211,238,0.08),transparent 70%)", pointerEvents: "none" }} />

        <div style={{
          maxWidth: 1300, margin: "0 auto", padding: "24px 0",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 16, position: "relative",
        }}>
          {/* LEFT */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button onClick={() => navigate(-1)} style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: t.heroBtnBg, border: `1px solid ${t.heroBtnBorder}`,
              borderRadius: 12, padding: "8px 16px", fontSize: 13, fontWeight: 600,
              color: t.heroBtnColor, cursor: "pointer", fontFamily: "'Poppins',sans-serif",
              transition: "all 0.2s", lineHeight: 1,
            }}>
              <ArrowLeft size={14} style={{ flexShrink: 0 }} /> Back
            </button>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                <div className="or-d1" style={{ width: 6, height: 6, borderRadius: "50%", background: t.heroBadgeDot, flexShrink: 0 }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: t.heroBadgeText, fontFamily: "'Poppins',sans-serif", lineHeight: 1 }}>Admin Portal</span>
              </div>
              <h1 style={{
                fontFamily: "'Poppins',sans-serif", fontWeight: 900,
                fontSize: "clamp(1.3rem,2.5vw,1.9rem)", color: t.heroTitle,
                margin: 0, lineHeight: 1.1, letterSpacing: "-0.02em",
              }}>
                Trainer{" "}
                <span style={{ background: "linear-gradient(135deg,#a78bfa,#22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Reports</span>
              </h1>
              <p style={{ fontSize: 11, color: t.heroSub, marginTop: 6, fontWeight: 500, fontFamily: "'Poppins',sans-serif", margin: "6px 0 0", lineHeight: 1 }}>Progress insights for all trainers</p>
            </div>
          </div>

          {/* RIGHT — stat chips + badges */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            {[
              { icon: Shield,   label: "Secure",           val: "Enterprise" },
              { icon: Activity, label: "Live Data",         val: "Real-time"  },
              { icon: Layers,   label: "Progress Reports",  val: "All Batches"},
            ].map(({ icon: Icon, label, val }) => (
              <div key={label} style={{
                display: "flex", alignItems: "center", gap: 10,
                background: t.heroStatBg, border: `1px solid ${t.heroStatBorder}`,
                borderRadius: 14, padding: "10px 16px", boxShadow: t.shadow,
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                  background: t.iconBg, border: `1px solid ${t.iconBorder}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon size={14} color={t.heroBadgeText} />
                </div>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: t.text, margin: 0, fontFamily: "'Poppins',sans-serif", lineHeight: 1.2 }}>{val}</p>
                  <p style={{ fontSize: 10, color: t.textMuted, margin: "3px 0 0", fontFamily: "'Poppins',sans-serif", lineHeight: 1 }}>{label}</p>
                </div>
              </div>
            ))}

            {/* LIVE badge */}
            <div className="or-live" style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.28)",
              borderRadius: 999, padding: "10px 16px",
              color: "#34d399", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em",
              fontFamily: "'Poppins',sans-serif", lineHeight: 1,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#34d399", display: "inline-block", flexShrink: 0 }} />
              LIVE
            </div>
          </div>
        </div>
      </div>

      {/* ═══ PAGE CONTENT ═══ */}
      <div style={{ maxWidth: 1300, margin: "0 auto", padding: "24px" }}>

        {/* Loading skeletons */}
        {loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[1,2,3].map(i => (
              <div key={i} style={{
                height: 80, borderRadius: 16,
                background: `linear-gradient(90deg,${t.skeletonFrom},${t.skeletonMid},${t.skeletonFrom})`,
                backgroundSize: "200% 100%",
                animation: "or-shimmer 1.5s ease-in-out infinite",
              }} />
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && <ErrBox msg={error} t={t} />}

        {/* Trainer Detail */}
        {!loading && !error && selected && (
          <TrainerDetail trainer={selected} onBack={() => setSelected(null)} t={t} />
        )}

        {/* Trainer list */}
        {!loading && !error && !selected && (
          <>
            {/* Summary metric */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 10, marginBottom: "1.25rem" }}>
              <div style={{
                background: t.cardBg, border: `1px solid ${t.border}`,
                borderRadius: 16, padding: "16px 18px", boxShadow: t.shadow,
                position: "relative", overflow: "hidden",
              }}>
                <div style={{
                  position: "absolute", top: 16, right: 16,
                  width: 36, height: 36, borderRadius: 10,
                  background: t.barBg,
                  border: `1px solid ${t.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  pointerEvents: "none",
                }}>
                  <Users size={16} color={t.textLabel} strokeWidth={1.5} />
                </div>
                <p style={{ fontSize: 10, color: t.textLabel, textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 8px", fontWeight: 700, fontFamily: "'Poppins',sans-serif", lineHeight: 1 }}>Total Trainers</p>
                <p style={{ fontSize: 38, fontWeight: 900, color: t.text, margin: 0, fontFamily: "'Poppins',sans-serif", lineHeight: 1 }}>{trainers.length}</p>
                <div style={{ height: 2, background: t.barBg, borderRadius: 99, overflow: "hidden", marginTop: 12 }}>
                  <div style={{ height: "100%", width: "60%", borderRadius: 99, background: "linear-gradient(90deg,#22d3ee,#a78bfa)" }} />
                </div>
              </div>
            </div>

            {/* Empty */}
            {trainers.length === 0 ? (
              <Card t={t} style={{ textAlign: "center", padding: "3rem 1rem" }}>
                <EmptyState icon={Users} text="No trainers found" t={t} />
                <p style={{ fontSize: 13, color: t.textMuted, margin: "4px 0 0", fontFamily: "'Poppins',sans-serif" }}>
                  Add users with the{" "}
                  <code style={{ background: t.heroStatBg, border: `1px solid ${t.heroStatBorder}`, padding: "1px 7px", borderRadius: 5, fontSize: 12, fontFamily: "monospace" }}>ROLE_TRAINER</code>
                  {" "}role in User Management.
                </p>
              </Card>
            ) : (
              <Card t={t}>
                <SLabel t={t}>All Trainers ({trainers.length})</SLabel>
                {trainers.map((trainer, i) => (
                  <TrainerCard
                    key={trainer.id || trainer.email}
                    trainer={trainer}
                    index={i}
                    onClick={() => setSelected(trainer)}
                    t={t}
                  />
                ))}
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OrgReports;