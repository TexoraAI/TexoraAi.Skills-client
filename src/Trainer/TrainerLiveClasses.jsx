// src/trainer/TrainerLiveClasses.jsx
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import {
  getSessionHistory,
  endLiveSession,
  deleteLiveSession,
  uploadRecording,
  joinCall,
  createLiveSession,
  getMyRecordings,
  getRecordingById,
  updateRecording,
  deleteRecording,
  incrementRecordingViews,
  startLiveSessionWithToken,
  getMeetingLink, // ADD
  getTrainerCalendar, // ADD
  getPublishedSessions,
} from "@/services/liveSessionService";
import { getTrainerBatches } from "@/services/batchService";

import {
  Video,
  History,
  Upload,
  List,
  BarChart3,
  Circle,
  Calendar,
  Clock,
  Users,
  Radio,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Phone,
  LayoutDashboard,
  ArrowLeft,
  UploadCloud,
  X,
  Search,
  Play,
  FileText,
  Activity,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Download,
  MessageCircle,
  Bell,
  MessageSquare,
  Save,
  Trash2,
  Eye,
  AlertTriangle,
  Lock,
  Copy,
  Check,
  Zap,
  ExternalLink,
  Globe,
  RefreshCw,
  Link,
  Layers,
  Settings,
  Rocket,
  Send,
} from "lucide-react";
import { Client } from "@stomp/stompjs";

/* ─── theme tokens (merged: File1 base + File2 extra keys) ─── */
const T = {
  dark: {
    pageBg: "#0a0a0a",
    cardBg: "#111111",
    cardBgHov: "#161616",
    heroBg: "#141414",
    border: "rgba(255,255,255,0.06)",
    borderHov: "rgba(255,255,255,0.14)",
    borderHero: "rgba(255,255,255,0.07)",
    text: "#ffffff",
    textSub: "rgba(255,255,255,0.3)",
    textMuted: "rgba(255,255,255,0.2)",
    pillBg: "rgba(255,255,255,0.04)",
    pillText: "rgba(255,255,255,0.25)",
    barBg: "rgba(255,255,255,0.05)",
    actBg: "rgba(255,255,255,0.04)",
    actBorder: "rgba(255,255,255,0.07)",
    gridLine: "rgba(255,255,255,0.5)",
    shadow: "0 4px 20px rgba(0,0,0,0.4)",
    shadowHov: "0 20px 60px rgba(0,0,0,0.6)",
    recentItemBg: "rgba(255,255,255,0.03)",
    recentItemBorder: "rgba(255,255,255,0.05)",
    recentItemBgHov: "rgba(255,255,255,0.06)",
    emptyBorder: "rgba(255,255,255,0.07)",
    emptyBg: "rgba(255,255,255,0.02)",
    emptyIcon: "rgba(255,255,255,0.12)",
    navStripBg: "#111111",
    navStripBorder: "rgba(255,255,255,0.06)",
    tabInactiveBg: "rgba(255,255,255,0.04)",
    tabInactiveBorder: "rgba(255,255,255,0.10)",
    tabInactiveText: "rgba(255,255,255,0.45)",
    inputBg: "#1a1a1a",
    inputBorder: "rgba(255,255,255,0.08)",
    inputText: "#ffffff",
    labelColor: "rgba(255,255,255,0.4)",
    selectBg: "#1a1a1a",
    dropBg: "rgba(255,255,255,0.02)",
    dropBorder: "rgba(255,255,255,0.07)",
    thumbBg: "rgba(255,255,255,0.04)",
    videoBg: "rgba(255,255,255,0.03)",
    videoBorder: "rgba(255,255,255,0.05)",
    tableBorderColor: "rgba(255,255,255,0.05)",
    tableHov: "rgba(255,255,255,0.03)",
    theadBg: "rgba(255,255,255,0.03)",
    toggleBg: "rgba(255,255,255,0.03)",
    toggleBorder: "rgba(255,255,255,0.06)",
    liveColor: "#34d399",
    liveText: "#34d399",
    actBar: "rgba(255,255,255,0.5)",
    actIcon: "rgba(255,255,255,0.3)",
    panelActiveBg: "#141414",
    panelInactiveBg: "#0f0f0f",
    headHov: "rgba(255,255,255,0.02)",
    reviewBg: "rgba(255,255,255,0.03)",
    reviewBorder: "rgba(255,255,255,0.06)",
    numInactiveBg: "rgba(255,255,255,0.04)",
    numInactiveBorder: "rgba(255,255,255,0.10)",
    numInactiveText: "rgba(255,255,255,0.25)",
    statusReady: {
      color: "#34d399",
      bg: "rgba(52,211,153,0.1)",
      border: "rgba(52,211,153,0.2)",
    },
    statusProcessing: {
      color: "#f59e0b",
      bg: "rgba(245,158,11,0.1)",
      border: "rgba(245,158,11,0.2)",
    },
    statusFailed: {
      color: "#f87171",
      bg: "rgba(248,113,113,0.1)",
      border: "rgba(248,113,113,0.2)",
    },
    // File2 extras
    sidebarBg: "#0d0d0d",
    sidebarBorder: "rgba(255,255,255,0.05)",
    panelBg: "#101010",
    panelHeader: "#141414",
    panelHeaderBorder: "rgba(255,255,255,0.07)",
    dividerBg: "rgba(255,255,255,0.05)",
    dividerHov: "rgba(34,197,94,0.4)",
    stepBadgePending: "rgba(255,255,255,0.06)",
    stepBadgePendingBorder: "rgba(255,255,255,0.10)",
    stepBadgePendingText: "rgba(255,255,255,0.25)",
    reviewFieldBg: "#161616",
    reviewFieldBorder: "rgba(255,255,255,0.07)",
    calMiniHeaderBg: "#111111",
    calDivider: "rgba(255,255,255,0.07)",
    calMiniDayHov: "rgba(255,255,255,0.06)",
    calMiniTodayBg: "#0078d4",
    calMiniSelectedBg: "rgba(0,120,212,0.25)",
    calMiniWeekend: "rgba(255,255,255,0.18)",
    calMiniDayOther: "rgba(255,255,255,0.12)",
    calMiniEventDot: "#22c55e",
    calEventBg: "rgba(0,120,212,0.10)",
    calEventBorder: "rgba(0,120,212,0.30)",
    calEventText: "#60a5fa",
    calIconColor: "rgba(255,255,255,0.3)",
    modeCardBg: "#161616",
    modeCardBorder: "rgba(255,255,255,0.08)",
    modeCardHov: "#1c1c1c",
    heroBannerBg:
      "linear-gradient(135deg, #0f1a0f 0%, #0a120a 50%, #0a0a0a 100%)",
    heroBannerBorder: "rgba(34,197,94,0.08)",
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
    textSub: "#64748b",
    textMuted: "#94a3b8",
    pillBg: "#f1f5f9",
    pillText: "#94a3b8",
    barBg: "#f1f5f9",
    actBg: "#f8fafc",
    actBorder: "#e2e8f0",
    gridLine: "rgba(0,0,0,0.12)",
    shadow: "0 1px 8px rgba(0,0,0,0.07)",
    shadowHov: "0 8px 32px rgba(0,0,0,0.10)",
    recentItemBg: "#f8fafc",
    recentItemBorder: "#e2e8f0",
    recentItemBgHov: "#f1f5f9",
    emptyBorder: "#e2e8f0",
    emptyBg: "#f8fafc",
    emptyIcon: "#cbd5e1",
    navStripBg: "#ffffff",
    navStripBorder: "#e2e8f0",
    tabInactiveBg: "#f8fafc",
    tabInactiveBorder: "#e2e8f0",
    tabInactiveText: "#64748b",
    inputBg: "#f8fafc",
    inputBorder: "#e2e8f0",
    inputText: "#0f172a",
    labelColor: "#64748b",
    selectBg: "#f8fafc",
    dropBg: "#f8fafc",
    dropBorder: "#e2e8f0",
    thumbBg: "#f1f5f9",
    videoBg: "#f8fafc",
    videoBorder: "#e2e8f0",
    tableBorderColor: "#e2e8f0",
    tableHov: "#f8fafc",
    theadBg: "#f8fafc",
    toggleBg: "#f8fafc",
    toggleBorder: "#e2e8f0",
    liveColor: "#16a34a",
    liveText: "#16a34a",
    actBar: "#94a3b8",
    actIcon: "#94a3b8",
    panelActiveBg: "#ffffff",
    panelInactiveBg: "#fafafa",
    headHov: "rgba(0,0,0,0.015)",
    reviewBg: "#f8fafc",
    reviewBorder: "#e2e8f0",
    numInactiveBg: "#f1f5f9",
    numInactiveBorder: "#e2e8f0",
    numInactiveText: "#94a3b8",
    statusReady: {
      color: "#16a34a",
      bg: "rgba(22,163,74,0.1)",
      border: "rgba(22,163,74,0.2)",
    },
    statusProcessing: {
      color: "#d97706",
      bg: "rgba(217,119,6,0.1)",
      border: "rgba(217,119,6,0.2)",
    },
    statusFailed: {
      color: "#dc2626",
      bg: "rgba(220,38,38,0.1)",
      border: "rgba(220,38,38,0.2)",
    },
    // File2 extras
    sidebarBg: "#f8fafc",
    sidebarBorder: "#e8ecf2",
    panelBg: "#ffffff",
    panelHeader: "#f8fafc",
    panelHeaderBorder: "#e8ecf2",
    dividerBg: "#e2e8f0",
    dividerHov: "rgba(34,197,94,0.5)",
    stepBadgePending: "#f1f5f9",
    stepBadgePendingBorder: "#e2e8f0",
    stepBadgePendingText: "#94a3b8",
    reviewFieldBg: "#f8fafc",
    reviewFieldBorder: "#e2e8f0",
    calMiniHeaderBg: "#f8fafc",
    calDivider: "#e8ecf0",
    calMiniDayHov: "#f1f5f9",
    calMiniTodayBg: "#0078d4",
    calMiniSelectedBg: "#dbeafe",
    calMiniWeekend: "#64748b",
    calMiniDayOther: "#cbd5e1",
    calMiniEventDot: "#22c55e",
    calEventBg: "#e8f4fd",
    calEventBorder: "#90caf9",
    calEventText: "#1565c0",
    calIconColor: "#8b9ab0",
    modeCardBg: "#f8fafc",
    modeCardBorder: "#e2e8f0",
    modeCardHov: "#f1f5f9",
    heroBannerBg:
      "linear-gradient(135deg, #f0fdf4 0%, #f8fafc 50%, #ffffff 100%)",
    heroBannerBorder: "rgba(34,197,94,0.12)",
  },
};

const PANEL_ACCENTS = {
  1: {
    color: "#f43f5e",
    dim: "rgba(244,63,94,0.10)",
    border: "rgba(244,63,94,0.25)",
    label: "Session Details",
    sub: "Title, batch & schedule",
  },
  2: {
    color: "#22d3ee",
    dim: "rgba(34,211,238,0.10)",
    border: "rgba(34,211,238,0.25)",
    label: "Session Settings",
    sub: "Chat, recording & alerts",
  },
  3: {
    color: "#34d399",
    dim: "rgba(52,211,153,0.10)",
    border: "rgba(52,211,153,0.25)",
    label: "Review & Launch",
    sub: "Confirm and go live",
  },
};

const NAV_TABS = [
  {
    key: "live-dashboard",
    label: "Live Dashboard",
    icon: LayoutDashboard,
    primary: true,
  },
  {
    key: "start-live",
    label: "Start Live Session",
    icon: Video,
    primary: false,
  },
  { key: "join-call", label: "Join Call", icon: Phone, primary: false },
  {
    key: "live-history",
    label: "Live Session History",
    icon: History,
    primary: false,
  },
  {
    key: "live-attendance",
    label: "Live Attendance Report",
    icon: Users,
    primary: false,
  },
  {
    key: "upload-recorded",
    label: "Upload Recorded Video",
    icon: Upload,
    primary: false,
  },
  {
    key: "recorded-list",
    label: "Recorded Classes List",
    icon: List,
    primary: false,
  },
];

const wsUrl =
  (import.meta.env.VITE_WS_BASE_URL || "ws://localhost:9000") + "/live-chat";

const getTrainerEmail = () => {
  try {
    const u = JSON.parse(localStorage.getItem("lms_user") || "{}");
    return u.email || null;
  } catch {
    return null;
  }
};

const statusConfig = {
  present: { label: "On Time", icon: CheckCircle2, color: "#34d399" },
  late: { label: "Late", icon: AlertCircle, color: "#f59e0b" },
  "left-early": { label: "Left Early", icon: XCircle, color: "#f87171" },
};

function unwrapBatches(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw.data)) return raw.data;
  if (Array.isArray(raw.batches)) return raw.batches;
  if (Array.isArray(raw.content)) return raw.content;
  return [];
}
function getBatchId(b) {
  return String(b.id ?? b.batchId ?? b.batch_id ?? b.BatchId ?? "");
}
function getBatchName(b, id) {
  return b.name ?? b.batchName ?? b.batch_name ?? b.BatchName ?? `Batch ${id}`;
}

// function parseScheduledDateTime(session) {
//   const rawDate = session.scheduledDate ?? session.date ?? "";
//   const rawTime = session.scheduledTime ?? session.time ?? "";
//   if (!rawDate || !rawTime) return null;
//   let dateStr = String(rawDate).trim();
//   if (/^\d{8}$/.test(dateStr))
//     dateStr = `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;
//   let timeStr = String(rawTime).trim();
//   if (/^\d{4}$/.test(timeStr))
//     timeStr = `${timeStr.slice(0, 2)}:${timeStr.slice(2, 4)}`;
//   if (/^\d{2}\d{2}:\d{2}$/.test(timeStr))
//     timeStr = `${timeStr.slice(0, 2)}:${timeStr.slice(2)}`;
//   const dt = new Date(`${dateStr}T${timeStr}`);
//   return isNaN(dt.getTime()) ? null : dt;
// }
function parseScheduledDateTime(session) {
  const rawDate = session.scheduledDate ?? session.date ?? "";
  const rawTime = session.scheduledTime ?? session.time ?? "";
  if (!rawDate || !rawTime) return null;
  let dateStr = String(rawDate).trim();
  if (/^\d{8}$/.test(dateStr))
    dateStr = `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;
  let timeStr = String(rawTime).trim();
  if (/^\d{4}$/.test(timeStr))
    timeStr = `${timeStr.slice(0, 2)}:${timeStr.slice(2, 4)}`;
  if (/^\d{2}\d{2}:\d{2}$/.test(timeStr))
    timeStr = `${timeStr.slice(0, 2)}:${timeStr.slice(2)}`;
  // ✅ NEW — if the session carries a timezone, interpret date/time in THAT zone
  if (session.timezone) {
    const dt = zonedDateTimeToUTC(dateStr, timeStr, session.timezone);
    return dt && !isNaN(dt.getTime()) ? dt : null;
  }
  // Legacy fallback for sessions created before this feature existed
  const dt = new Date(`${dateStr}T${timeStr}`);
  return isNaN(dt.getTime()) ? null : dt;
}

/* ═══ TIMEZONE DATA & HELPERS (NEW) ═══ */
const TIMEZONES = [
  { id: "Pacific/Midway", label: "Midway Island" },
  { id: "Pacific/Honolulu", label: "Hawaii" },
  { id: "America/Anchorage", label: "Alaska" },
  { id: "America/Los_Angeles", label: "Los Angeles" },
  { id: "America/Denver", label: "Denver" },
  { id: "America/Chicago", label: "Chicago" },
  { id: "America/New_York", label: "New York" },
  { id: "America/Sao_Paulo", label: "Sao Paulo" },
  { id: "Atlantic/Azores", label: "Azores" },
  { id: "UTC", label: "UTC" },
  { id: "Europe/London", label: "London" },
  { id: "Europe/Paris", label: "Paris" },
  { id: "Europe/Berlin", label: "Berlin" },
  { id: "Europe/Athens", label: "Athens" },
  { id: "Europe/Moscow", label: "Moscow" },
  { id: "Africa/Cairo", label: "Cairo" },
  { id: "Africa/Johannesburg", label: "Johannesburg" },
  { id: "Asia/Jerusalem", label: "Jerusalem" },
  { id: "Asia/Dubai", label: "Dubai" },
  { id: "Asia/Karachi", label: "Karachi" },
  { id: "Asia/Kolkata", label: "India" },
  { id: "Asia/Dhaka", label: "Dhaka" },
  { id: "Asia/Bangkok", label: "Bangkok" },
  { id: "Asia/Jakarta", label: "Jakarta" },
  { id: "Asia/Shanghai", label: "China" },
  { id: "Asia/Singapore", label: "Singapore" },
  { id: "Asia/Tokyo", label: "Tokyo" },
  { id: "Asia/Seoul", label: "Seoul" },
  { id: "Australia/Perth", label: "Perth" },
  { id: "Australia/Sydney", label: "Sydney" },
  { id: "Pacific/Auckland", label: "Auckland" },
  { id: "Pacific/Fiji", label: "Fiji" },
];

function getTzOffsetMinutes(tz, atDate = new Date()) {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
      .formatToParts(atDate)
      .reduce((acc, p) => {
        acc[p.type] = p.value;
        return acc;
      }, {});
    const asUTC = Date.UTC(
      Number(parts.year),
      Number(parts.month) - 1,
      Number(parts.day),
      Number(parts.hour),
      Number(parts.minute),
      Number(parts.second),
    );
    return Math.round((asUTC - atDate.getTime()) / 60000);
  } catch {
    return 0;
  }
}

function formatTzOffset(mins) {
  const sign = mins >= 0 ? "+" : "-";
  const abs = Math.abs(mins);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return `UTC${sign}${h}${m ? ":" + String(m).padStart(2, "0") : ""}`;
}

const DEFAULT_TIMEZONE =
  Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

// Interpret date+time strings as belonging to `tz`; return the absolute instant (Date).
function zonedDateTimeToUTC(dateStr, timeStr, tz) {
  if (!dateStr || !timeStr) return null;
  const naiveUTC = new Date(`${dateStr}T${timeStr}:00Z`);
  const offsetMin = getTzOffsetMinutes(tz, naiveUTC);
  return new Date(naiveUTC.getTime() - offsetMin * 60000);
}

function canShowGoLive(session) {
  if (session.status !== "SCHEDULED") return false;
  const scheduledAt = parseScheduledDateTime(session);
  if (!scheduledAt) return true;
  const now = new Date();
  const diffMinutes = (scheduledAt.getTime() - now.getTime()) / (1000 * 60);
  if (session.createdAt) {
    const createdAt = new Date(session.createdAt);
    const gapFromCreation =
      (scheduledAt.getTime() - createdAt.getTime()) / (1000 * 60);
    if (gapFromCreation < 15) return diffMinutes <= 0;
  }
  return diffMinutes <= 15;
}

function getGoLiveCountdown(session) {
  const scheduledAt = parseScheduledDateTime(session);
  if (!scheduledAt) return null;
  const now = new Date();
  if (session.createdAt) {
    const createdAt = new Date(session.createdAt);
    const gapFromCreation =
      (scheduledAt.getTime() - createdAt.getTime()) / (1000 * 60);
    if (gapFromCreation < 15) {
      const diffMs = scheduledAt.getTime() - now.getTime();
      if (diffMs <= 0) return null;
      const mins = Math.ceil(diffMs / (1000 * 60));
      const secs = Math.ceil((diffMs % (1000 * 60)) / 1000);
      return mins <= 1 ? `in ${secs}s` : `in ${mins}m`;
    }
  }
  const diffMs = scheduledAt.getTime() - now.getTime();
  const diffMinutes = Math.ceil(diffMs / (1000 * 60));
  if (diffMinutes > 15) {
    const hours = Math.floor(diffMinutes / 60);
    const mins = diffMinutes % 60;
    return hours > 0 ? `in ${hours}h ${mins}m` : `in ${mins}m`;
  }
  return null;
}

const genRoomId = () =>
  "ROOM-" + Math.random().toString(36).slice(2, 10).toUpperCase();

/* ══════════════════════════════════════════════════
   HERO BANNER (from File 2)
══════════════════════════════════════════════════ */
function HeroBanner({ t, isDark, heroMeta }) {
  return (
    <div
      style={{
        position: "relative",
        padding: "28px 32px 24px",
        background: t.heroBannerBg,
        borderBottom: `1px solid ${t.heroBannerBorder}`,
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -40,
          right: -40,
          width: 180,
          height: 180,
          borderRadius: "50%",
          background: "#a78bfa",
          filter: "blur(80px)",
          opacity: isDark ? 0.07 : 0.1,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -30,
          left: 120,
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: "#22d3ee",
          filter: "blur(60px)",
          opacity: isDark ? 0.04 : 0.07,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 10,
        }}
      >
        <Radio size={11} color={isDark ? "rgba(255,255,255,0.3)" : "#94a3b8"} />
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: isDark ? "rgba(255,255,255,0.3)" : "#94a3b8",
            fontFamily: "'Poppins',sans-serif",
          }}
        >
          LIVE STUDIO
        </span>
      </div>
      <h1
        style={{
          fontFamily: "'Poppins',sans-serif",
          fontWeight: 800,
          fontSize: "clamp(1.6rem,3vw,2.4rem)",
          margin: "0 0 6px",
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
          color: t.text,
        }}
      >
        {heroMeta.title}{" "}
        <span
          style={{
            background: "linear-gradient(135deg, #16a34a, #22c55e, #86efac)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {heroMeta.highlight}
        </span>
      </h1>
      <p
        style={{
          fontFamily: "'Poppins',sans-serif",
          fontSize: 12,
          color: t.textSub,
          margin: 0,
          fontWeight: 500,
        }}
      >
        {heroMeta.subtitle}
      </p>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   THREE PANEL DRAG LAYOUT (from File 2)
══════════════════════════════════════════════════ */
function ThreePanelLayout({
  t,
  isDark,
  left,
  center,
  right,
  defaultLeftW = 220,
  defaultRightW = 260,
  minLeft = 160,
  maxLeft = 320,
  minRight = 200,
  maxRight = 360,
}) {
  const [leftW, setLeftW] = useState(defaultLeftW);
  const [rightW, setRightW] = useState(defaultRightW);
  const [dragging, setDragging] = useState(null);
  const dragStartRef = useRef(null);

  const onMouseDown = (side, e) => {
    e.preventDefault();
    setDragging(side);
    dragStartRef.current = { x: e.clientX, leftW, rightW };
  };

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e) => {
      const dx = e.clientX - dragStartRef.current.x;
      if (dragging === "left")
        setLeftW(
          Math.max(minLeft, Math.min(maxLeft, dragStartRef.current.leftW + dx)),
        );
      else
        setRightW(
          Math.max(
            minRight,
            Math.min(maxRight, dragStartRef.current.rightW - dx),
          ),
        );
    };
    const onUp = () => setDragging(null);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragging, minLeft, maxLeft, minRight, maxRight]);

  const divider = (side) => (
    <div
      style={{
        width: 6,
        flexShrink: 0,
        cursor: "col-resize",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
        userSelect: "none",
        zIndex: 10,
      }}
      onMouseDown={(e) => onMouseDown(side, e)}
      onMouseEnter={(e) =>
        (e.currentTarget.querySelector(".dvline").style.background =
          t.dividerHov)
      }
      onMouseLeave={(e) => {
        if (dragging !== side)
          e.currentTarget.querySelector(".dvline").style.background =
            t.dividerBg;
      }}
    >
      <div
        className="dvline"
        style={{
          position: "absolute",
          width: 2,
          top: 0,
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          background: dragging === side ? "#22c55e" : t.dividerBg,
          borderRadius: 99,
          transition: "background 0.2s",
        }}
      />
      <div
        style={{
          position: "absolute",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          pointerEvents: "none",
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 3,
              height: 3,
              borderRadius: "50%",
              background: dragging === side ? "#22c55e" : t.textMuted,
              opacity: 0.5,
            }}
          />
        ))}
      </div>
      {dragging === side && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            cursor: "col-resize",
            zIndex: 9999,
          }}
        />
      )}
    </div>
  );

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
      <div
        style={{
          width: leftW,
          flexShrink: 0,
          background: t.sidebarBg,
          borderRight: `1px solid ${t.sidebarBorder}`,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {left}
      </div>
      {divider("left")}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          background: t.panelBg,
        }}
      >
        {center}
      </div>
      {divider("right")}
      <div
        style={{
          width: rightW,
          flexShrink: 0,
          background: t.sidebarBg,
          borderLeft: `1px solid ${t.sidebarBorder}`,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {right}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   MINI CALENDAR (from File 2)
══════════════════════════════════════════════════ */
// function MiniCalendar({
//   t,
//   isDark,
//   selectedDate,
//   onSelectDate,
//   sessionEvents = [],
// }) {
function MiniCalendar({
  t,
  isDark,
  selectedDate,
  onSelectDate,
  sessionEvents = [],
  onMonthChange,
}) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMon = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrev = new Date(viewYear, viewMonth, 0).getDate();

  const cells = [];
  for (let i = firstDay - 1; i >= 0; i--)
    cells.push({ day: daysInPrev - i, thisMonth: false, prev: true });
  for (let d = 1; d <= daysInMon; d++) cells.push({ day: d, thisMonth: true });
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++)
    cells.push({ day: d, thisMonth: false, next: true });

  const isToday = (cell) =>
    cell.thisMonth &&
    cell.day === today.getDate() &&
    viewMonth === today.getMonth() &&
    viewYear === today.getFullYear();
  const isSelected = (cell) => {
    if (!selectedDate || !cell.thisMonth) return false;
    const [y, m, d] = selectedDate.split("-").map(Number);
    return cell.day === d && viewMonth === m - 1 && viewYear === y;
  };
  const hasEvent = (cell) => {
    if (!cell.thisMonth) return false;
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(cell.day).padStart(2, "0")}`;
    return sessionEvents.some((e) => e.date === dateStr);
  };

  // const prevMonth = () => {
  //   if (viewMonth === 0) {
  //     setViewMonth(11);
  //     setViewYear((y) => y - 1);
  //   } else setViewMonth((m) => m - 1);
  // };
  const prevMonth = () => {
    let newMonth, newYear;
    if (viewMonth === 0) {
      newMonth = 11;
      newYear = viewYear - 1;
    } else {
      newMonth = viewMonth - 1;
      newYear = viewYear;
    }
    setViewMonth(newMonth);
    setViewYear(newYear);
    onMonthChange?.(newYear, newMonth);
  };
  // const nextMonth = () => {
  //   if (viewMonth === 11) {
  //     setViewMonth(0);
  //     setViewYear((y) => y + 1);
  //   } else setViewMonth((m) => m + 1);
  // };
  const nextMonth = () => {
    let newMonth, newYear;
    if (viewMonth === 11) {
      newMonth = 0;
      newYear = viewYear + 1;
    } else {
      newMonth = viewMonth + 1;
      newYear = viewYear;
    }
    setViewMonth(newMonth);
    setViewYear(newYear);
    onMonthChange?.(newYear, newMonth);
  };
  const handleClick = (cell) => {
    if (!cell.thisMonth) return;
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(cell.day).padStart(2, "0")}`;
    onSelectDate(dateStr);
  };

  return (
    <div style={{ userSelect: "none" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 12px 8px",
          background: t.calMiniHeaderBg,
          borderBottom: `1px solid ${t.calDivider}`,
        }}
      >
        <button
          onClick={prevMonth}
          style={{
            width: 22,
            height: 22,
            borderRadius: 5,
            border: `1px solid ${t.calDivider}`,
            background: "transparent",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: t.textMuted,
          }}
        >
          <ChevronLeft size={11} />
        </button>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: t.text,
            fontFamily: "'Poppins',sans-serif",
          }}
        >
          {monthNames[viewMonth]} {viewYear}
        </span>
        <button
          onClick={nextMonth}
          style={{
            width: 22,
            height: 22,
            borderRadius: 5,
            border: `1px solid ${t.calDivider}`,
            background: "transparent",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: t.textMuted,
          }}
        >
          <ChevronRight size={11} />
        </button>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7,1fr)",
          padding: "5px 6px 2px",
        }}
      >
        {dayNames.map((d) => (
          <div
            key={d}
            style={{
              textAlign: "center",
              fontSize: 8,
              fontWeight: 700,
              color: t.textMuted,
              fontFamily: "'Poppins',sans-serif",
              padding: "1px 0",
            }}
          >
            {d}
          </div>
        ))}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7,1fr)",
          padding: "0 6px 8px",
          gap: "1px 0",
        }}
      >
        {cells.map((cell, i) => {
          const tod = isToday(cell),
            sel = isSelected(cell),
            evt = hasEvent(cell);
          const isWeekend = i % 7 === 0 || i % 7 === 6;
          return (
            <div
              key={i}
              onClick={() => handleClick(cell)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: 24,
                borderRadius: 5,
                cursor: cell.thisMonth ? "pointer" : "default",
                background: tod
                  ? "#0078d4"
                  : sel
                    ? t.calMiniSelectedBg
                    : "transparent",
                transition: "background 0.15s",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                if (!tod && !sel && cell.thisMonth)
                  e.currentTarget.style.background = t.calMiniDayHov;
              }}
              onMouseLeave={(e) => {
                if (!tod && !sel)
                  e.currentTarget.style.background = "transparent";
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  fontWeight: tod || sel ? 700 : 500,
                  color: tod
                    ? "#fff"
                    : !cell.thisMonth
                      ? t.calMiniDayOther
                      : isWeekend
                        ? t.calMiniWeekend
                        : t.text,
                  fontFamily: "'Poppins',sans-serif",
                  lineHeight: 1,
                }}
              >
                {cell.day}
              </span>
              {evt && !tod && (
                <span
                  style={{
                    width: 3,
                    height: 3,
                    borderRadius: "50%",
                    background: t.calMiniEventDot,
                    marginTop: 1,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
      <div
        style={{
          borderTop: `1px solid ${t.calDivider}`,
          padding: "5px 12px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <button
          onClick={() => {
            setViewMonth(today.getMonth());
            setViewYear(today.getFullYear());
            const d = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
            onSelectDate(d);
          }}
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: "#0078d4",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontFamily: "'Poppins',sans-serif",
          }}
        >
          Today
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   PANEL SECTION HEADER helper
══════════════════════════════════════════════════ */
function PanelSectionHeader({ icon: Icon, color, title, t }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 14px",
        borderBottom: `1px solid ${t.panelHeaderBorder}`,
        background: t.panelHeader,
      }}
    >
      <div
        style={{
          width: 26,
          height: 26,
          borderRadius: 7,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `${color}18`,
          border: `1px solid ${color}28`,
          flexShrink: 0,
        }}
      >
        <Icon size={13} color={color} />
      </div>
      <span
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: t.text,
          fontFamily: "'Poppins',sans-serif",
        }}
      >
        {title}
      </span>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   COMPACT TOGGLE SWITCH (File 2)
══════════════════════════════════════════════════ */
function ToggleSwitch({ checked, onChange, color = "#22c55e" }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      style={{
        width: 36,
        height: 20,
        borderRadius: 99,
        cursor: "pointer",
        border: "none",
        outline: "none",
        position: "relative",
        background: checked ? color : "#94a3b8",
        flexShrink: 0,
        transition: "background 0.2s",
      }}
      role="switch"
      aria-checked={checked}
    >
      <div
        style={{
          position: "absolute",
          top: 2,
          left: checked ? 18 : 2,
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: "#fff",
          boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
          transition: "left 0.2s",
        }}
      />
    </button>
  );
}

/* ══════════════════════════════════════════════════
   COMPACT LABEL + INPUT helpers (File 2 style)
══════════════════════════════════════════════════ */
function CompactLabel({ children, t }) {
  return (
    <label
      style={{
        fontSize: 9,
        fontWeight: 700,
        color: t.labelColor,
        fontFamily: "'Poppins',sans-serif",
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        marginBottom: 4,
        display: "block",
      }}
    >
      {children}
    </label>
  );
}
/* ══════════════════════════════════════════════════
   TIMEZONE SELECT (NEW)
══════════════════════════════════════════════════ */
function TimezoneSelect({ t, value, onChange }) {
  return (
    <div style={{ position: "relative" }}>
      <select
        className="sls-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ cursor: "pointer", paddingRight: 30 }}
      >
        {TIMEZONES.map((tz) => (
          <option key={tz.id} value={tz.id}>
            {tz.label} ({formatTzOffset(getTzOffsetMinutes(tz.id))})
          </option>
        ))}
      </select>
      <ChevronDown
        size={11}
        color={t.textMuted}
        style={{
          position: "absolute",
          right: 10,
          top: "50%",
          transform: "translateY(-50%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

/* ══════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════ */
const TrainerLiveClasses = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("live-dashboard");
  const [editRecordingId, setEditRecordingId] = useState(null);

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

  const switchTab = (tab) => {
    setActiveTab(tab.key);
    setEditRecordingId(null);
  };

  // heroMeta: uses File2's title/highlight/subtitle pattern
  const heroMeta = {
    "live-dashboard": {
      title: "Live",
      highlight: "Dashboard",
      subtitle: "All your sessions — live, scheduled & ended",
    },
    "start-live": {
      title: "Start",
      highlight: "Live Session",
      subtitle: "Schedule a new session for your batch",
    },
    "join-call": {
      title: "Join",
      highlight: "Call",
      subtitle: "Accept incoming student calls",
    },
    "live-history": {
      title: "Session",
      highlight: "History",
      subtitle: "All your past live sessions in one place",
    },
    "live-attendance": {
      title: "Attendance",
      highlight: "Report",
      subtitle: "Detailed attendance analytics",
    },
    "upload-recorded": {
      title: "Upload",
      highlight: "Recorded Video",
      subtitle: "Publish recorded content for students",
    },
    "recorded-list": {
      title: editRecordingId ? "Edit" : "Recorded",
      highlight: editRecordingId ? "Recording" : "Classes",
      subtitle: editRecordingId
        ? "Update title, description or replace file"
        : "Browse and manage your video library",
    },
  }[activeTab] || { title: "Live", highlight: "Studio", subtitle: "" };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        @keyframes fadeUp      { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse       { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes liveDot     { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(1.5)} }
        @keyframes blink       { 0%,100%{opacity:1} 50%{opacity:0.15} }
        @keyframes uploadFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes radarPulse  { 0%,100%{opacity:0.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.02)} }
        @keyframes callPulse   { 0%{box-shadow:0 0 0 0 rgba(99,102,241,0.5)} 70%{box-shadow:0 0 0 18px rgba(99,102,241,0)} 100%{box-shadow:0 0 0 0 rgba(99,102,241,0)} }
        @keyframes callPulse2  { 0%{box-shadow:0 0 0 0 rgba(99,102,241,0.3)} 70%{box-shadow:0 0 0 32px rgba(99,102,241,0)} 100%{box-shadow:0 0 0 0 rgba(99,102,241,0)} }
        @keyframes pulse-ring  { 0%{box-shadow:0 0 0 0 rgba(34,197,94,0.5)} 70%{box-shadow:0 0 0 8px rgba(34,197,94,0)} 100%{box-shadow:0 0 0 0 rgba(34,197,94,0)} }
        @keyframes slideDown   { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin        { to{transform:rotate(360deg)} }
        @keyframes toastIn     { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .dfade { animation: fadeUp 0.45s ease both }
        .livebadge { animation: pulse-ring 2.2s ease-out infinite }
        .d1 { animation: blink 1.6s ease infinite }
        .d2 { animation: blink 1.6s 0.3s ease infinite }
        .d3 { animation: blink 1.6s 0.6s ease infinite }
        .panel-body-inner { animation: slideDown 0.3s ease both }
        .publish-toast { animation: toastIn 0.3s ease both }
        .nav-strip-scroll { overflow-x:auto; overflow-y:visible; -webkit-overflow-scrolling:touch; scrollbar-width:thin; scrollbar-color:${isDark ? "rgba(255,255,255,0.18) rgba(255,255,255,0.04)" : "rgba(0,0,0,0.18) rgba(0,0,0,0.04)"}; padding-bottom:6px; }
        .nav-strip-scroll::-webkit-scrollbar { display:block; height:4px; }
        .nav-strip-scroll::-webkit-scrollbar-track { background:${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}; border-radius:99px; }
        .nav-strip-scroll::-webkit-scrollbar-thumb { background:${isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.18)"}; border-radius:99px; }
        .nav-strip-inner { display:inline-flex; flex-wrap:nowrap; align-items:center; gap:6px; min-width:max-content; padding:2px; }
        .panel-scroll { overflow-y:auto; flex:1; }
        .panel-scroll::-webkit-scrollbar { width:3px; }
        .panel-scroll::-webkit-scrollbar-track { background:transparent; }
        .panel-scroll::-webkit-scrollbar-thumb { background:${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}; border-radius:99px; }
        input[type=date]::-webkit-calendar-picker-indicator,
        input[type=time]::-webkit-calendar-picker-indicator { filter:${isDark ? "invert(1) opacity(0.3)" : "opacity(0.5)"}; cursor:pointer; }
        .sls-input { width:100%; padding:7px 10px; border-radius:7px; border:1px solid ${t.inputBorder}; background:${t.inputBg}; color:${t.inputText}; font-size:11px; font-family:'Poppins',sans-serif; font-weight:500; outline:none; transition:border 0.2s,box-shadow 0.2s; box-sizing:border-box; appearance:none; }
        .sls-input:focus { border-color:#22c55e; box-shadow:0 0 0 2px rgba(34,197,94,0.12); }
        .sls-input::placeholder { color:${t.textMuted}; font-weight:400; }
        .mode-card { display:flex; align-items:center; gap:10px; padding:10px 12px; border-radius:8px; border:1.5px solid ${t.modeCardBorder}; background:${t.modeCardBg}; cursor:pointer; transition:all 0.18s; flex:1; }
        .mode-card:hover { border-color:${isDark ? "rgba(255,255,255,0.18)" : "#94a3b8"}; background:${t.modeCardHov}; }
        .mode-card.sel-custom { border-color:#22c55e; background:${isDark ? "rgba(34,197,94,0.06)" : "#f0fdf4"}; box-shadow:0 0 0 2px rgba(34,197,94,0.12); }
        .mode-card.sel-ext { border-color:#0078d4; background:${isDark ? "rgba(0,120,212,0.06)" : "#eff6ff"}; box-shadow:0 0 0 2px rgba(0,120,212,0.12); }
        .review-field { background:${t.reviewFieldBg}; border:1px solid ${t.reviewFieldBorder}; border-radius:7px; padding:8px 10px; }
        .next-btn { display:inline-flex; align-items:center; gap:5px; padding:7px 14px; border-radius:7px; border:none; background:#22c55e; color:#fff; font-size:11px; font-weight:700; cursor:pointer; font-family:'Poppins',sans-serif; transition:all 0.18s; }
        .next-btn:hover { background:#16a34a; box-shadow:0 3px 10px rgba(34,197,94,0.35); }
        select option { background:${isDark ? "#1a1a1a" : "#f8fafc"}; color:${isDark ? "#ffffff" : "#0f172a"}; }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: t.pageBg,
          color: t.text,
          fontFamily: "'Poppins',sans-serif",
          transition: "background 0.3s,color 0.3s",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* HERO BANNER */}
        <HeroBanner t={t} isDark={isDark} heroMeta={heroMeta} />

        {/* NAV STRIP */}
        <div
          style={{
            background: t.navStripBg,
            borderBottom: `1px solid ${t.navStripBorder}`,
            padding: "0 32px",
            flexShrink: 0,
          }}
        >
          <div
            className="nav-strip-scroll"
            style={{ height: 46, display: "flex", alignItems: "center" }}
          >
            <div className="nav-strip-inner">
              {NAV_TABS.map((tab) => {
                const isActive = activeTab === tab.key;
                const Icon = tab.icon;
                let bg, border, color;
                if (isActive) {
                  bg = "#22c55e";
                  border = "#22c55e";
                  color = "#ffffff";
                } else if (tab.primary) {
                  bg = isDark ? "rgba(34,197,94,0.10)" : "rgba(34,197,94,0.07)";
                  border = "rgba(34,197,94,0.35)";
                  color = "#22c55e";
                } else {
                  bg = t.tabInactiveBg;
                  border = t.tabInactiveBorder;
                  color = t.tabInactiveText;
                }
                return (
                  <button
                    key={tab.key}
                    onClick={() => switchTab(tab)}
                    style={{
                      flexShrink: 0,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "6px 14px",
                      borderRadius: 8,
                      border: `1px solid ${border}`,
                      background: bg,
                      color,
                      fontSize: 11,
                      fontWeight: isActive || tab.primary ? 700 : 600,
                      cursor: "pointer",
                      transition: "all 0.18s",
                      fontFamily: "'Poppins',sans-serif",
                      letterSpacing: "0.02em",
                      whiteSpace: "nowrap",
                      boxShadow: isActive
                        ? "0 4px 14px rgba(34,197,94,0.35)"
                        : "none",
                    }}
                  >
                    <Icon size={12} strokeWidth={2.2} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* CONTENT AREA */}
        <div
          style={{
            flex: 1,
            overflow: activeTab === "start-live" ? "hidden" : "auto",
          }}
        >
          {activeTab === "start-live" ? (
            /* StartLive gets the full 3-panel layout */
            <div style={{ height: "calc(100vh - 140px)" }}>
              <StartLiveThreePanel t={t} isDark={isDark} navigate={navigate} />
            </div>
          ) : (
            <div
              style={{
                padding: "20px 32px 52px",
                maxWidth: 1300,
                margin: "0 auto",
              }}
            >
              {activeTab === "live-dashboard" && (
                <PanelLiveDashboard t={t} isDark={isDark} navigate={navigate} />
              )}
              {activeTab === "join-call" && (
                <PanelJoinCall t={t} isDark={isDark} navigate={navigate} />
              )}
              {activeTab === "live-history" && (
                <PanelLiveHistory
                  t={t}
                  isDark={isDark}
                  navigate={navigate}
                  onEditRecording={(id) => {
                    setEditRecordingId(id);
                    setActiveTab("recorded-list");
                  }}
                />
              )}
              {activeTab === "live-attendance" && (
                <PanelAttendanceReport
                  t={t}
                  isDark={isDark}
                  navigate={navigate}
                />
              )}
              {activeTab === "upload-recorded" && (
                <PanelUploadRecorded
                  t={t}
                  isDark={isDark}
                  navigate={navigate}
                  onSuccess={() => switchTab({ key: "recorded-list" })}
                />
              )}
              {activeTab === "recorded-list" && !editRecordingId && (
                <PanelRecordedList
                  t={t}
                  isDark={isDark}
                  navigate={navigate}
                  onEdit={(id) => setEditRecordingId(id)}
                  onUpload={() => switchTab({ key: "upload-recorded" })}
                />
              )}
              {activeTab === "recorded-list" && editRecordingId && (
                <PanelEditRecording
                  t={t}
                  isDark={isDark}
                  navigate={navigate}
                  recordingId={editRecordingId}
                  onBack={() => setEditRecordingId(null)}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

/* ══════════════════════════════════════════════════
   START LIVE — 3-PANEL LAYOUT (File 2 UI + File 1 backend)
══════════════════════════════════════════════════ */
function StartLiveThreePanel({ t, isDark, navigate }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [sessionEvents, setSessionEvents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [publishDone, setPublishDone] = useState(false);
  const [error, setError] = useState(null);
  const [shortScheduleWarning, setShortScheduleWarning] = useState(null);

  // const [form, setForm] = useState({
  //   title: "",
  //   description: "",
  //   batchId: "",
  //   date: "",
  //   time: "",
  //   duration: "",
  //   chat: true,
  //   recording: true,
  //   notifications: true,
  //   isPublished: false, // ADD
  //   mode: "",
  //   meetingLink: "",
  //   roomId: genRoomId(),
  // });
  const [form, setForm] = useState({
    title: "",
    description: "",
    batchId: "",
    date: "",
    time: "",
    duration: "",
    chat: true,
    recording: true,
    notifications: true,
    isPublished: false, // ADD
    mode: "",
    meetingLink: "",
    roomId: genRoomId(),
    timezone: DEFAULT_TIMEZONE, // ✅ NEW
    scheduleMode: "schedule", // ✅ NEW — "schedule" | "now"
  });
  const upd = (key, val) => {
    setForm((p) => ({ ...p, [key]: val }));
    if (key === "date" || key === "time") setShortScheduleWarning(null);
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await getTrainerBatches();
        setBatches(unwrapBatches(data) || []);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);
  // ✅ Load existing sessions into calendar on mount
  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const now = new Date();
  //       const from = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
  //       const to = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-31`;
  //       const res = await getTrainerCalendar(from, to);
  //       const data = Array.isArray(res.data) ? res.data : [];
  //       setSessionEvents(
  //         data.map((s) => ({
  //           date: s.scheduledDate,
  //           title: s.title,
  //         })),
  //       );
  //     } catch (err) {
  //       console.error("Calendar load failed", err);
  //     }
  //   })();
  // }, []);
  const loadCalendarEvents = async (year, month) => {
    try {
      const from = `${year}-${String(month + 1).padStart(2, "0")}-01`;
      const to = `${year}-${String(month + 1).padStart(2, "0")}-31`;
      const res = await getTrainerCalendar(from, to);
      const data = Array.isArray(res.data) ? res.data : [];
      console.log("Calendar data:", JSON.stringify(data.slice(0, 2)));
      // setSessionEvents(
      //   data.map((s) => ({ date: s.scheduledDate, title: s.title })),
      // );
      setSessionEvents(
        data.map((s) => {
          let dateStr = s.scheduledDate;
          if (Array.isArray(dateStr)) {
            const [y, m, d] = dateStr;
            dateStr = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
          }
          return { date: dateStr, title: s.title };
        }),
      );
    } catch (err) {
      console.error("Calendar load failed", err);
    }
  };

  useEffect(() => {
    const now = new Date();
    loadCalendarEvents(now.getFullYear(), now.getMonth());
  }, []);
  const handleCopyRoomId = () => {
    navigator.clipboard.writeText(form.roomId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const selectedBatch = batches.find(
    (b) => String(b.id ?? b.batchId) === String(form.batchId),
  );
  const batchLabel = selectedBatch
    ? getBatchName(selectedBatch, form.batchId)
    : null;

  // ✅ batchId no longer required — session can be global (no batch)
  // const step1Valid = form.title.trim() && form.date && form.time;
  // ✅ batchId no longer required — session can be global (no batch)
  // ✅ "Start Now" mode doesn't need date/time
  const step1Valid =
    form.scheduleMode === "now"
      ? form.title.trim()
      : form.title.trim() && form.date && form.time;
  // const buildPayload = (status) => ({
  //   title: form.title,
  //   description: form.description,
  //   // ✅ batchId is optional — null if not selected (global session)
  //   ...(form.batchId ? { batchId: Number(form.batchId) } : {}),
  //   scheduledDate: form.date,
  //   scheduledTime: form.time,
  //   duration: Number(form.duration),
  //   chatEnabled: form.chat,
  //   autoRecord: form.recording,
  //   notifyStudents: form.notifications,
  //   isPublished: form.isPublished,
  //   // ✅ meetingType maps to backend field
  //   meetingType: form.mode === "external" ? "EXTERNAL" : "CUSTOM",
  //   ...(status ? { status } : {}),
  //   ...(form.mode === "external"
  //     ? { externalMeetingUrl: form.meetingLink }
  //     : {}),
  // });
  const buildPayload = (status) => {
    // ✅ "Start Now" — use this instant's date/time in the chosen timezone
    let scheduledDate = form.date;
    let scheduledTime = form.time;
    const tz = form.scheduleMode === "now" ? DEFAULT_TIMEZONE : form.timezone;
    if (form.scheduleMode === "now") {
      const nowParts = new Intl.DateTimeFormat("en-CA", {
        timeZone: tz,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
        .formatToParts(new Date())
        .reduce((acc, p) => {
          acc[p.type] = p.value;
          return acc;
        }, {});
      scheduledDate = `${nowParts.year}-${nowParts.month}-${nowParts.day}`;
      scheduledTime = `${nowParts.hour}:${nowParts.minute}`;
    }
    return {
      title: form.title,
      description: form.description,
      // ✅ batchId is optional — null if not selected (global session)
      ...(form.batchId ? { batchId: Number(form.batchId) } : {}),
      scheduledDate,
      scheduledTime,
      timezone: tz, // ✅ NEW — always sent
      duration: Number(form.duration),
      chatEnabled: form.chat,
      autoRecord: form.recording,
      notifyStudents: form.notifications,
      isPublished: form.isPublished,
      // ✅ meetingType maps to backend field
      meetingType: form.mode === "external" ? "EXTERNAL" : "CUSTOM",
      ...(status ? { status } : {}),
      ...(form.mode === "external"
        ? { externalMeetingUrl: form.meetingLink }
        : {}),
    };
  };
  // const handleGoLive = async () => {
  //   setError(null);
  //   setShortScheduleWarning(null);
  //   if (!form.title.trim()) {
  //     setError("Session title is required.");
  //     setCurrentStep(1);
  //     return;
  //   }

  //   if (!form.date) {
  //     setError("Please select a date.");
  //     setCurrentStep(1);
  //     return;
  //   }
  //   if (!form.time) {
  //     setError("Please select a time.");
  //     setCurrentStep(1);
  //     return;
  //   }
  //   if (!form.duration) {
  //     setError("Please select a duration.");
  //     setCurrentStep(1);
  //     return;
  //   }

  //   const scheduledDateTime = new Date(`${form.date}T${form.time}`);
  //   const now = new Date();
  //   if (scheduledDateTime <= now) {
  //     setError("Scheduled date and time must be in the future.");
  //     setCurrentStep(1);
  //     return;
  //   }

  //   const diffMin = (scheduledDateTime - now) / (1000 * 60);
  //   if (diffMin < 30) {
  //     setShortScheduleWarning(
  //       `⚡ Session starts in ${Math.ceil(diffMin)} min. Students will get an immediate notification instead of a 15-min reminder.`,
  //     );
  //   }

  //   try {
  //     setSubmitting(true);
  //     const res = await createLiveSession(buildPayload());
  //     navigate(`/trainer/session-scheduled/${res.data.id}`, {
  //       state: {
  //         scheduledDate: form.date,
  //         scheduledTime: form.time,
  //         title: form.title,
  //         duration: form.duration,
  //       },
  //     });
  //   } catch (err) {
  //     console.error(err);
  //     setError(
  //       err?.response?.data?.error ||
  //         "Failed to create session. Please try again.",
  //     );
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };
  const handleGoLive = async () => {
    setError(null);
    setShortScheduleWarning(null);
    if (!form.title.trim()) {
      setError("Session title is required.");
      setCurrentStep(1);
      return;
    }
    if (!form.duration) {
      setError("Please enter a duration.");
      setCurrentStep(1);
      return;
    }

    // ✅ NEW — "Start Now": create then immediately go live
    if (form.scheduleMode === "now") {
      try {
        setSubmitting(true);
        const res = await createLiveSession(buildPayload());
        const liveRes = await startLiveSessionWithToken(res.data.id);
        const { room, token } = liveRes.data;
        if (!token) {
          setError(
            "Session created, but couldn't get a live token. Start it from the dashboard.",
          );
          return;
        }
        sessionStorage.setItem("call_state", JSON.stringify({ room, token }));
        navigate(`/trainer/live-controls/${res.data.id}`, {
          state: { room, token },
        });
      } catch (err) {
        console.error(err);
        setError(
          err?.response?.data?.error ||
            "Failed to start session. Please try again.",
        );
      } finally {
        setSubmitting(false);
      }
      return;
    }

    // ── Scheduled flow (unchanged logic, now timezone-aware) ──
    if (!form.date) {
      setError("Please select a date.");
      setCurrentStep(1);
      return;
    }
    if (!form.time) {
      setError("Please select a time.");
      setCurrentStep(1);
      return;
    }

    const scheduledDateTime = zonedDateTimeToUTC(
      form.date,
      form.time,
      form.timezone,
    );
    const now = new Date();
    if (!scheduledDateTime || scheduledDateTime <= now) {
      setError("Scheduled date and time must be in the future.");
      setCurrentStep(1);
      return;
    }

    try {
      setSubmitting(true);
      const res = await createLiveSession(buildPayload());
      navigate(`/trainer/session-scheduled/${res.data.id}`, {
        state: {
          scheduledDate: form.date,
          scheduledTime: form.time,
          timezone: form.timezone,
          title: form.title,
          duration: form.duration,
        },
      });
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.error ||
          "Failed to create session. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handlePublish = async () => {
    if (!step1Valid) {
      setError("Please complete Step 1 first.");
      setCurrentStep(1);
      return;
    }
    try {
      setPublishing(true);
      await createLiveSession(buildPayload("SCHEDULED"));
      if (form.date)
        setSessionEvents((prev) => [
          ...prev,
          { date: form.date, title: form.title },
        ]);
      setPublishDone(true);
      setTimeout(() => setPublishDone(false), 3500);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.error || "Failed to schedule session.");
    } finally {
      setPublishing(false);
    }
  };

  const stepState = (n) => {
    if (currentStep === n) return "active";
    if (n === 1 && step1Valid) return "done";
    if (n === 2 && step1Valid && currentStep > 2) return "done";
    return "pending";
  };

  /* ── LEFT PANEL ── */
  const LeftPanel = (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <PanelSectionHeader icon={Layers} color="#22c55e" title="Steps" t={t} />
      <div
        className="panel-scroll"
        style={{
          padding: "12px 10px",
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        {[
          {
            n: 1,
            title: "Session Details",
            subtitle: "Title, batch & schedule",
            icon: Calendar,
          },
          {
            n: 2,
            title: "Settings",
            subtitle: "Chat, record, alerts",
            icon: Settings,
          },
          {
            n: 3,
            title: "Review & Launch",
            subtitle: "Confirm and go live",
            icon: Rocket,
          },
        ].map(({ n, title, subtitle, icon: Icon }) => {
          const s = stepState(n);
          const isAct = s === "active",
            isDone = s === "done";
          return (
            <button
              key={n}
              onClick={() => setCurrentStep(n)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                padding: "9px 10px",
                borderRadius: 8,
                border: `1px solid ${isAct ? "rgba(34,197,94,0.35)" : isDone ? "rgba(34,197,94,0.20)" : t.border}`,
                background: isAct
                  ? "rgba(34,197,94,0.07)"
                  : isDone
                    ? "rgba(34,197,94,0.04)"
                    : "transparent",
                cursor: "pointer",
                textAlign: "left",
                width: "100%",
                transition: "all 0.15s",
              }}
            >
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  background: isAct
                    ? "#22c55e"
                    : isDone
                      ? "rgba(34,197,94,0.20)"
                      : t.stepBadgePending,
                  border: `1.5px solid ${isAct ? "#22c55e" : isDone ? "rgba(34,197,94,0.40)" : t.stepBadgePendingBorder}`,
                  fontSize: 10,
                  fontWeight: 800,
                  color: isAct
                    ? "#fff"
                    : isDone
                      ? "#22c55e"
                      : t.stepBadgePendingText,
                  fontFamily: "'Poppins',sans-serif",
                }}
              >
                {isDone ? <CheckCircle2 size={12} color="#22c55e" /> : n}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: isAct ? t.text : isDone ? t.text : t.textSub,
                    fontFamily: "'Poppins',sans-serif",
                    lineHeight: 1.2,
                  }}
                >
                  {title}
                </div>
                <div
                  style={{
                    fontSize: 9,
                    color: t.textMuted,
                    fontFamily: "'Poppins',sans-serif",
                  }}
                >
                  {subtitle}
                </div>
              </div>
              {isAct && (
                <div
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: "#22c55e",
                    flexShrink: 0,
                  }}
                />
              )}
            </button>
          );
        })}

        <div style={{ margin: "8px 0", borderTop: `1px solid ${t.border}` }} />

        {[
          { label: "Title", val: form.title || "—", color: "#22c55e" },
          { label: "Batch", val: batchLabel || "—", color: "#22d3ee" },
          { label: "Date", val: form.date || "—", color: "#a78bfa" },
          { label: "Time", val: form.time || "—", color: "#f59e0b" },
          {
            label: "Duration",
            val: form.duration ? `${form.duration}m` : "—",
            color: "#2dd4bf",
          },
        ].map(({ label, val, color }) => (
          <div
            key={label}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "4px 6px",
              borderRadius: 5,
            }}
          >
            <span
              style={{
                fontSize: 9,
                color: t.textMuted,
                fontFamily: "'Poppins',sans-serif",
                fontWeight: 600,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              {label}
            </span>
            <span
              style={{
                fontSize: 10,
                color: val === "—" ? t.textMuted : t.text,
                fontFamily: "'Poppins',sans-serif",
                fontWeight: 600,
                maxWidth: 90,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {val}
            </span>
          </div>
        ))}

        {form.mode && (
          <div
            style={{
              marginTop: 4,
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "5px 8px",
              borderRadius: 6,
              background:
                form.mode === "custom"
                  ? "rgba(34,197,94,0.08)"
                  : "rgba(0,120,212,0.08)",
              border: `1px solid ${form.mode === "custom" ? "rgba(34,197,94,0.22)" : "rgba(0,120,212,0.22)"}`,
            }}
          >
            {form.mode === "custom" ? (
              <Zap size={10} color="#22c55e" />
            ) : (
              <ExternalLink size={10} color="#0078d4" />
            )}
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                color: form.mode === "custom" ? "#22c55e" : "#0078d4",
                fontFamily: "'Poppins',sans-serif",
              }}
            >
              {form.mode === "custom" ? "Custom Live" : "External Link"}
            </span>
          </div>
        )}
      </div>

      <div
        style={{
          padding: "10px",
          borderTop: `1px solid ${t.border}`,
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        {publishDone && (
          <div
            className="publish-toast"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 10px",
              borderRadius: 7,
              background: isDark ? "rgba(34,197,94,0.10)" : "#f0fdf4",
              border: `1px solid ${isDark ? "rgba(34,197,94,0.3)" : "#bbf7d0"}`,
            }}
          >
            <CheckCircle2 size={13} color="#22c55e" />
            <div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#22c55e",
                  fontFamily: "'Poppins',sans-serif",
                }}
              >
                Published!
              </div>
              <div
                style={{
                  fontSize: 9,
                  color: t.textSub,
                  fontFamily: "'Poppins',sans-serif",
                }}
              >
                Session scheduled.
              </div>
            </div>
          </div>
        )}
        {/* <button
          onClick={handlePublish}
          disabled={publishing}
          style={{
            width: "100%",
            padding: "7px 0",
            borderRadius: 7,
            border: `1px solid ${t.border}`,
            background: "transparent",
            color: t.textSub,
            fontSize: 10,
            fontWeight: 600,
            cursor: publishing ? "not-allowed" : "pointer",
            fontFamily: "'Poppins',sans-serif",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 5,
            transition: "all 0.18s",
          }}
        >
          <Send size={11} />
          {publishing ? "Scheduling…" : "Schedule for Later"}
        </button> */}
        {form.scheduleMode !== "now" && (
          <button
            onClick={handlePublish}
            disabled={publishing}
            style={{
              width: "100%",
              padding: "7px 0",
              borderRadius: 7,
              border: `1px solid ${t.border}`,
              background: "transparent",
              color: t.textSub,
              fontSize: 10,
              fontWeight: 600,
              cursor: publishing ? "not-allowed" : "pointer",
              fontFamily: "'Poppins',sans-serif",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
              transition: "all 0.18s",
            }}
          >
            <Send size={11} />
            {publishing ? "Scheduling…" : "Schedule for Later"}
          </button>
        )}
      </div>
    </div>
  );

  /* ── CENTER PANEL ── */
  const CenterPanel = (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* step header bar */}
      <div
        style={{
          padding: "10px 16px",
          borderBottom: `1px solid ${t.panelHeaderBorder}`,
          background: t.panelHeader,
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(34,197,94,0.15)",
            border: "1.5px solid rgba(34,197,94,0.4)",
            fontSize: 11,
            fontWeight: 800,
            color: "#22c55e",
            fontFamily: "'Poppins',sans-serif",
          }}
        >
          {currentStep}
        </div>
        <div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: t.text,
              fontFamily: "'Poppins',sans-serif",
            }}
          >
            {currentStep === 1
              ? "Session Details"
              : currentStep === 2
                ? "Session Settings"
                : "Review & Launch"}
          </div>
          <div
            style={{
              fontSize: 9,
              color: t.textMuted,
              fontFamily: "'Poppins',sans-serif",
            }}
          >
            {currentStep === 1
              ? "Title, batch & schedule"
              : currentStep === 2
                ? "Chat, recording & alerts"
                : "Confirm and go live"}
          </div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              onClick={() => setCurrentStep(n)}
              style={{
                width: n === currentStep ? 20 : 6,
                height: 6,
                borderRadius: 99,
                background:
                  n === currentStep
                    ? "#22c55e"
                    : n < currentStep
                      ? "rgba(34,197,94,0.4)"
                      : t.border,
                cursor: "pointer",
                transition: "all 0.25s",
              }}
            />
          ))}
        </div>
      </div>

      <div className="panel-scroll">
        {/* error / warning banners */}
        {error && (
          <div
            style={{
              margin: "10px 16px 0",
              background: "rgba(248,113,113,0.1)",
              border: "1px solid rgba(248,113,113,0.3)",
              borderRadius: 8,
              padding: "8px 12px",
              fontSize: 11,
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
              <X size={13} />
            </button>
          </div>
        )}
        {shortScheduleWarning && (
          <div
            style={{
              margin: "10px 16px 0",
              background: "rgba(245,158,11,0.1)",
              border: "1px solid rgba(245,158,11,0.3)",
              borderRadius: 8,
              padding: "8px 12px",
              fontSize: 11,
              color: "#f59e0b",
              fontFamily: "'Poppins',sans-serif",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {shortScheduleWarning}
            <button
              onClick={() => setShortScheduleWarning(null)}
              style={{
                background: "none",
                border: "none",
                color: "#f59e0b",
                cursor: "pointer",
              }}
            >
              <X size={13} />
            </button>
          </div>
        )}

        {/* STEP 1 */}
        {currentStep === 1 && (
          <div
            style={{
              padding: "14px 16px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {/* ✅ NEW — Schedule vs Start Now */}
            <div style={{ display: "flex", gap: 8 }}>
              <div
                className={`mode-card${form.scheduleMode === "schedule" ? " sel-custom" : ""}`}
                onClick={() => upd("scheduleMode", "schedule")}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 7,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                      form.scheduleMode === "schedule"
                        ? "rgba(34,197,94,0.14)"
                        : isDark
                          ? "rgba(255,255,255,0.06)"
                          : "#f1f5f9",
                    border: `1px solid ${form.scheduleMode === "schedule" ? "rgba(34,197,94,0.35)" : t.modeCardBorder}`,
                    flexShrink: 0,
                  }}
                >
                  <Calendar
                    size={13}
                    color={
                      form.scheduleMode === "schedule"
                        ? "#22c55e"
                        : t.calIconColor
                    }
                  />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color:
                        form.scheduleMode === "schedule" ? "#22c55e" : t.text,
                      fontFamily: "'Poppins',sans-serif",
                    }}
                  >
                    Schedule
                  </div>
                  <div
                    style={{
                      fontSize: 9,
                      color: t.textSub,
                      fontFamily: "'Poppins',sans-serif",
                    }}
                  >
                    Pick date & time
                  </div>
                </div>
                {form.scheduleMode === "schedule" && (
                  <CheckCircle2
                    size={13}
                    color="#22c55e"
                    style={{ marginLeft: "auto" }}
                  />
                )}
              </div>
              <div
                className={`mode-card${form.scheduleMode === "now" ? " sel-ext" : ""}`}
                onClick={() => upd("scheduleMode", "now")}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 7,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                      form.scheduleMode === "now"
                        ? "rgba(0,120,212,0.12)"
                        : isDark
                          ? "rgba(255,255,255,0.06)"
                          : "#f1f5f9",
                    border: `1px solid ${form.scheduleMode === "now" ? "rgba(0,120,212,0.35)" : t.modeCardBorder}`,
                    flexShrink: 0,
                  }}
                >
                  <Zap
                    size={13}
                    color={
                      form.scheduleMode === "now" ? "#0078d4" : t.calIconColor
                    }
                  />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: form.scheduleMode === "now" ? "#0078d4" : t.text,
                      fontFamily: "'Poppins',sans-serif",
                    }}
                  >
                    Start Now
                  </div>
                  <div
                    style={{
                      fontSize: 9,
                      color: t.textSub,
                      fontFamily: "'Poppins',sans-serif",
                    }}
                  >
                    Go live immediately
                  </div>
                </div>
                {form.scheduleMode === "now" && (
                  <CheckCircle2
                    size={13}
                    color="#0078d4"
                    style={{ marginLeft: "auto" }}
                  />
                )}
              </div>
            </div>
            <div>
              <CompactLabel t={t}>Session Title *</CompactLabel>
              <input
                className="sls-input"
                value={form.title}
                onChange={(e) => upd("title", e.target.value)}
                placeholder="e.g. React Hooks Deep Dive"
              />
            </div>
            <div>
              <CompactLabel t={t}>
                Description{" "}
                <span
                  style={{
                    fontWeight: 400,
                    textTransform: "none",
                    fontSize: 9,
                  }}
                >
                  (optional)
                </span>
              </CompactLabel>
              <textarea
                className="sls-input"
                value={form.description}
                onChange={(e) => upd("description", e.target.value)}
                placeholder="Brief overview for students..."
                rows={2}
                style={{ resize: "vertical", lineHeight: 1.5 }}
              />
            </div>
            <div>
              {/* <CompactLabel t={t}>Select Batch *</CompactLabel> */}
              <CompactLabel t={t}>
                Select Batch{" "}
                <span
                  style={{
                    fontWeight: 400,
                    textTransform: "none",
                    fontSize: 9,
                  }}
                >
                  (optional — leave empty for global session)
                </span>
              </CompactLabel>
              <div style={{ position: "relative" }}>
                <select
                  className="sls-input"
                  value={form.batchId}
                  onChange={(e) => upd("batchId", e.target.value)}
                  style={{ cursor: "pointer", paddingRight: 30 }}
                >
                  <option value="">Choose a batch...</option>
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
                  size={11}
                  color={t.textMuted}
                  style={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                  }}
                />
              </div>
            </div>
            {/* <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 8,
              }}
            >
              <div>
                <CompactLabel t={t}>Date *</CompactLabel>
                <input
                  type="date"
                  className="sls-input"
                  value={form.date}
                  onChange={(e) => upd("date", e.target.value)}
                />
              </div>
              <div>
                <CompactLabel t={t}>Time *</CompactLabel>
                <input
                  type="time"
                  className="sls-input"
                  value={form.time}
                  onChange={(e) => upd("time", e.target.value)}
                />
              </div>
              <div>
                <CompactLabel t={t}>Duration</CompactLabel>
                <div style={{ position: "relative" }}>
                  <select
                    className="sls-input"
                    value={form.duration}
                    onChange={(e) => upd("duration", e.target.value)}
                    style={{ cursor: "pointer", paddingRight: 30 }}
                  >
                    <option value="">Select...</option>
                    {durations.map((d) => (
                      <option key={d} value={d}>
                        {d} min
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={11}
                    color={t.textMuted}
                    style={{
                      position: "absolute",
                      right: 10,
                      top: "50%",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                    }}
                  />
                </div>
              </div>
            </div> */}
            {form.scheduleMode === "schedule" && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 8,
                }}
              >
                <div>
                  <CompactLabel t={t}>Date *</CompactLabel>
                  <input
                    type="date"
                    className="sls-input"
                    value={form.date}
                    onChange={(e) => upd("date", e.target.value)}
                  />
                </div>
                <div>
                  <CompactLabel t={t}>Time *</CompactLabel>
                  <input
                    type="time"
                    className="sls-input"
                    value={form.time}
                    onChange={(e) => upd("time", e.target.value)}
                  />
                </div>
              </div>
            )}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  form.scheduleMode === "schedule" ? "1fr 1fr" : "1fr",
                gap: 8,
              }}
            >
              {form.scheduleMode === "schedule" && (
                <div>
                  <CompactLabel t={t}>Timezone *</CompactLabel>
                  <TimezoneSelect
                    t={t}
                    value={form.timezone}
                    onChange={(tz) => upd("timezone", tz)}
                  />
                </div>
              )}
              <div>
                <CompactLabel t={t}>
                  Duration (minutes) * — max 150
                </CompactLabel>
                <input
                  type="number"
                  min="1"
                  max="150"
                  className="sls-input"
                  value={form.duration}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v === "" || (Number(v) >= 0 && Number(v) <= 150))
                      upd("duration", v);
                  }}
                  placeholder="e.g. 45"
                />
              </div>
            </div>

            {/* Session Mode */}
            <div>
              <CompactLabel t={t}>Session Mode</CompactLabel>
              <div style={{ display: "flex", gap: 8 }}>
                <div
                  className={`mode-card${form.mode === "custom" ? " sel-custom" : ""}`}
                  onClick={() =>
                    upd("mode", form.mode === "custom" ? "" : "custom")
                  }
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 7,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background:
                        form.mode === "custom"
                          ? "rgba(34,197,94,0.14)"
                          : isDark
                            ? "rgba(255,255,255,0.06)"
                            : "#f1f5f9",
                      border: `1px solid ${form.mode === "custom" ? "rgba(34,197,94,0.35)" : t.modeCardBorder}`,
                      flexShrink: 0,
                    }}
                  >
                    <Zap
                      size={13}
                      color={
                        form.mode === "custom" ? "#22c55e" : t.calIconColor
                      }
                    />
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: form.mode === "custom" ? "#22c55e" : t.text,
                        fontFamily: "'Poppins',sans-serif",
                      }}
                    >
                      Custom Live
                    </div>
                    <div
                      style={{
                        fontSize: 9,
                        color: t.textSub,
                        fontFamily: "'Poppins',sans-serif",
                      }}
                    >
                      Your platform
                    </div>
                  </div>
                  {form.mode === "custom" && (
                    <CheckCircle2
                      size={13}
                      color="#22c55e"
                      style={{ marginLeft: "auto" }}
                    />
                  )}
                </div>
                <div
                  className={`mode-card${form.mode === "external" ? " sel-ext" : ""}`}
                  onClick={() =>
                    upd("mode", form.mode === "external" ? "" : "external")
                  }
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 7,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background:
                        form.mode === "external"
                          ? "rgba(0,120,212,0.12)"
                          : isDark
                            ? "rgba(255,255,255,0.06)"
                            : "#f1f5f9",
                      border: `1px solid ${form.mode === "external" ? "rgba(0,120,212,0.35)" : t.modeCardBorder}`,
                      flexShrink: 0,
                    }}
                  >
                    <ExternalLink
                      size={13}
                      color={
                        form.mode === "external" ? "#0078d4" : t.calIconColor
                      }
                    />
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: form.mode === "external" ? "#0078d4" : t.text,
                        fontFamily: "'Poppins',sans-serif",
                      }}
                    >
                      External Link
                    </div>
                    <div
                      style={{
                        fontSize: 9,
                        color: t.textSub,
                        fontFamily: "'Poppins',sans-serif",
                      }}
                    >
                      Zoom / Meet
                    </div>
                  </div>
                  {form.mode === "external" && (
                    <CheckCircle2
                      size={13}
                      color="#0078d4"
                      style={{ marginLeft: "auto" }}
                    />
                  )}
                </div>
              </div>
              {form.mode === "custom" && (
                <div
                  style={{
                    marginTop: 8,
                    padding: "8px 10px",
                    borderRadius: 7,
                    background: isDark ? "rgba(34,197,94,0.05)" : "#f0fdf4",
                    border: "1px solid rgba(34,197,94,0.2)",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    flexWrap: "wrap",
                  }}
                >
                  <Globe size={11} color="#22c55e" style={{ flexShrink: 0 }} />
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#22c55e",
                      flex: 1,
                    }}
                  >
                    {form.roomId}
                  </span>
                  <button
                    onClick={handleCopyRoomId}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 3,
                      padding: "3px 8px",
                      borderRadius: 5,
                      border: "1px solid rgba(34,197,94,0.25)",
                      background: copied
                        ? "rgba(34,197,94,0.10)"
                        : "transparent",
                      color: "#22c55e",
                      fontSize: 10,
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "'Poppins',sans-serif",
                    }}
                  >
                    <Copy size={9} /> {copied ? "Copied!" : "Copy"}
                  </button>
                  <button
                    onClick={() => upd("roomId", genRoomId())}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 3,
                      padding: "3px 8px",
                      borderRadius: 5,
                      border: "1px solid rgba(34,197,94,0.25)",
                      background: "transparent",
                      color: "#22c55e",
                      fontSize: 10,
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "'Poppins',sans-serif",
                    }}
                  >
                    <RefreshCw size={9} />
                  </button>
                </div>
              )}
              {form.mode === "external" && (
                <div style={{ marginTop: 8, position: "relative" }}>
                  <Link
                    size={11}
                    color={t.calIconColor}
                    style={{
                      position: "absolute",
                      left: 10,
                      top: "50%",
                      transform: "translateY(-50%)",
                    }}
                  />
                  <input
                    className="sls-input"
                    value={form.meetingLink}
                    onChange={(e) => upd("meetingLink", e.target.value)}
                    placeholder="Paste Zoom / Meet / Teams link..."
                    style={{ paddingLeft: 28 }}
                  />
                </div>
              )}
              {/* ✅ Publish toggle — makes session globally visible */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: form.isPublished
                    ? isDark
                      ? "rgba(34,197,94,0.06)"
                      : "#f0fdf4"
                    : isDark
                      ? "rgba(255,255,255,0.02)"
                      : "#f8fafc",
                  border: `1px solid ${form.isPublished ? "rgba(34,197,94,0.25)" : t.border}`,
                  marginTop: 4,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: form.isPublished ? "#22c55e" : t.text,
                      fontFamily: "'Poppins',sans-serif",
                    }}
                  >
                    Publish Globally
                  </div>
                  <div
                    style={{
                      fontSize: 9,
                      color: t.textSub,
                      fontFamily: "'Poppins',sans-serif",
                    }}
                  >
                    Show in public sessions list (no batch required)
                  </div>
                </div>
                <ToggleSwitch
                  checked={form.isPublished}
                  onChange={(val) => upd("isPublished", val)}
                  color="#22c55e"
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                paddingTop: 4,
              }}
            >
              <button
                className="next-btn"
                onClick={() => {
                  if (step1Valid) setCurrentStep(2);
                  else {
                    setError("Fill Title, Batch, Date & Time first.");
                  }
                }}
              >
                Next <ChevronRight size={12} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {currentStep === 2 && (
          <div>
            {[
              {
                key: "chat",
                label: "Enable Chat",
                sub: "Students can message during live",
                Icon: MessageSquare,
                color: "#22d3ee",
              },
              {
                key: "recording",
                label: "Auto Record",
                sub: "Save session for replay access",
                Icon: Radio,
                color: "#f43f5e",
              },
              {
                key: "notifications",
                label: "Notify Students",
                sub: "Push alert when going live",
                Icon: Bell,
                color: "#22c55e",
              },
            ].map(({ key, label, sub, Icon, color }) => (
              <div
                key={key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  borderBottom: `1px solid ${t.border}`,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = isDark
                    ? "rgba(255,255,255,0.02)"
                    : "#fafafa")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: form[key]
                        ? `${color}14`
                        : isDark
                          ? "rgba(255,255,255,0.04)"
                          : "#f8fafc",
                      border: `1px solid ${form[key] ? color + "30" : t.border}`,
                      flexShrink: 0,
                      transition: "all 0.2s",
                    }}
                  >
                    <Icon
                      size={14}
                      color={form[key] ? color : t.calIconColor}
                    />
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: t.text,
                        fontFamily: "'Poppins',sans-serif",
                      }}
                    >
                      {label}
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        color: t.textSub,
                        fontFamily: "'Poppins',sans-serif",
                      }}
                    >
                      {sub}
                    </div>
                  </div>
                </div>
                <ToggleSwitch
                  checked={form[key]}
                  onChange={(val) => upd(key, val)}
                  color={color}
                />
              </div>
            ))}
            <div
              style={{
                padding: "12px 16px",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <button className="next-btn" onClick={() => setCurrentStep(3)}>
                Next <ChevronRight size={12} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {currentStep === 3 && (
          <div
            style={{
              padding: "14px 16px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
              }}
            >
              {[
                {
                  label: "Title",
                  value: form.title || "—",
                  icon: <Video size={10} color="#22c55e" />,
                },
                {
                  label: "Batch",
                  value: batchLabel || "—",
                  icon: <Users size={10} color="#22d3ee" />,
                },
                // {
                //   label: "Date",
                //   value: form.date || "—",
                //   icon: <Calendar size={10} color="#a78bfa" />,
                // },
                // {
                //   label: "Time",
                //   value: form.time || "—",
                //   icon: <Clock size={10} color="#f59e0b" />,
                // },
                {
                  label: "Date",
                  value: form.scheduleMode === "now" ? "Now" : form.date || "—",
                  icon: <Calendar size={10} color="#a78bfa" />,
                },
                {
                  label: "Time",
                  value:
                    form.scheduleMode === "now"
                      ? "Immediately"
                      : form.time || "—",
                  icon: <Clock size={10} color="#f59e0b" />,
                },
                {
                  label: "Timezone",
                  value:
                    form.scheduleMode === "now"
                      ? DEFAULT_TIMEZONE
                      : form.timezone || "—",
                  icon: <Globe size={10} color="#0078d4" />,
                },
                {
                  label: "Duration",
                  value: form.duration ? `${form.duration} min` : "—",
                  icon: <Clock size={10} color="#2dd4bf" />,
                },
                {
                  label: "Chat",
                  value: form.chat ? "Enabled" : "Disabled",
                  icon: <MessageSquare size={10} color="#22d3ee" />,
                },
                {
                  label: "Recording",
                  value: form.recording ? "Enabled" : "Disabled",
                  icon: <Radio size={10} color="#f43f5e" />,
                },
                {
                  label: "Notify",
                  value: form.notifications ? "Enabled" : "Disabled",
                  icon: <Bell size={10} color="#22c55e" />,
                },
                {
                  label: "Published",
                  value: form.isPublished ? "Global" : "Batch Only",
                  icon: <Globe size={10} color="#22c55e" />,
                },
              ].map(({ label, value, icon }) => (
                <div key={label} className="review-field">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      marginBottom: 3,
                    }}
                  >
                    {icon}
                    <span
                      style={{
                        fontSize: 8,
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: t.textMuted,
                        fontFamily: "'Poppins',sans-serif",
                      }}
                    >
                      {label}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: t.text,
                      fontFamily: "'Poppins',sans-serif",
                      wordBreak: "break-all",
                    }}
                  >
                    {value}
                  </div>
                </div>
              ))}
            </div>
            {form.mode && (
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: 10,
                    fontWeight: 600,
                    color: form.mode === "custom" ? "#22c55e" : "#0078d4",
                    background:
                      form.mode === "custom"
                        ? "rgba(34,197,94,0.10)"
                        : "rgba(0,120,212,0.10)",
                    border: `1px solid ${form.mode === "custom" ? "rgba(34,197,94,0.28)" : "rgba(0,120,212,0.28)"}`,
                    padding: "3px 10px",
                    borderRadius: 5,
                    fontFamily: "'Poppins',sans-serif",
                  }}
                >
                  {form.mode === "custom" ? (
                    <>
                      <Zap size={10} /> Custom Live
                    </>
                  ) : (
                    <>
                      <ExternalLink size={10} /> External
                    </>
                  )}
                </span>
                {form.mode === "custom" && (
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontSize: 10,
                      color: "#22c55e",
                      fontWeight: 600,
                    }}
                  >
                    {form.roomId}
                  </span>
                )}
                {form.mode === "external" && form.meetingLink && (
                  <span
                    style={{
                      fontSize: 10,
                      color: t.textSub,
                      fontFamily: "'Poppins',sans-serif",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: 160,
                    }}
                  >
                    {form.meetingLink}
                  </span>
                )}
              </div>
            )}
            <button
              onClick={handleGoLive}
              disabled={submitting || !step1Valid}
              style={{
                width: "100%",
                padding: "12px 0",
                borderRadius: 10,
                border: "none",
                background: !step1Valid
                  ? isDark
                    ? "rgba(34,197,94,0.25)"
                    : "#bbf7d0"
                  : submitting
                    ? "#16a34a"
                    : "#22c55e",
                color: !step1Valid ? "rgba(255,255,255,0.4)" : "#fff",
                fontSize: 13,
                fontWeight: 800,
                cursor: !step1Valid || submitting ? "not-allowed" : "pointer",
                fontFamily: "'Poppins',sans-serif",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                transition: "all 0.2s",
                boxShadow:
                  step1Valid && !submitting
                    ? "0 6px 20px rgba(34,197,94,0.35)"
                    : "none",
              }}
            >
              {/* {submitting ? (
                "Scheduling…"
              ) : ( */}
              {submitting ? (
                form.scheduleMode === "now" ? (
                  "Starting…"
                ) : (
                  "Scheduling…"
                )
              ) : (
                <>
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: "#fff",
                      display: "inline-block",
                      animation: step1Valid
                        ? "liveDot 1.2s ease-in-out infinite"
                        : "none",
                    }}
                  />
                  {/* {form.mode === "external"
                    ? "Save & Notify Students"
                    : "Schedule Session"} */}
                  {form.scheduleMode === "now"
                    ? "Start Now"
                    : form.mode === "external"
                      ? "Save & Notify Students"
                      : "Schedule Session"}
                </>
              )}
            </button>
            {/* <button
              onClick={handlePublish}
              disabled={publishing}
              style={{
                width: "100%",
                padding: "9px 0",
                borderRadius: 9,
                border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "#e2e8f0"}`,
                background: "transparent",
                color: t.textSub,
                fontSize: 11,
                fontWeight: 600,
                cursor: publishing ? "not-allowed" : "pointer",
                fontFamily: "'Poppins',sans-serif",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              <Send size={12} />
              {publishing ? "Scheduling…" : "Schedule for Later (Publish)"}
            </button> */}
            {form.scheduleMode !== "now" && (
              <button
                onClick={handlePublish}
                disabled={publishing}
                style={{
                  width: "100%",
                  padding: "9px 0",
                  borderRadius: 9,
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "#e2e8f0"}`,
                  background: "transparent",
                  color: t.textSub,
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: publishing ? "not-allowed" : "pointer",
                  fontFamily: "'Poppins',sans-serif",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                <Send size={12} />
                {publishing ? "Scheduling…" : "Schedule for Later (Publish)"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  /* ── RIGHT PANEL ── */
  const RightPanel = (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <PanelSectionHeader
        icon={Calendar}
        color="#0078d4"
        title="Schedule"
        t={t}
      />
      <div className="panel-scroll">
        {/* <MiniCalendar
          t={t}
          isDark={isDark}
          selectedDate={form.date}
          onSelectDate={(dateStr) => upd("date", dateStr)}
          sessionEvents={sessionEvents}
        /> */}
        <MiniCalendar
          t={t}
          isDark={isDark}
          selectedDate={form.date}
          onSelectDate={(dateStr) => upd("date", dateStr)}
          sessionEvents={sessionEvents}
          onMonthChange={loadCalendarEvents}
        />
        {form.date && (
          <div style={{ borderTop: `1px solid ${t.calDivider}` }}>
            <div style={{ padding: "8px 12px 4px" }}>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: t.text,
                  fontFamily: "'Poppins',sans-serif",
                }}
              >
                {new Date(form.date + "T00:00:00").toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
            <div style={{ padding: "0 10px 10px" }}>
              {sessionEvents.filter((e) => e.date === form.date).length ===
              0 ? (
                <div style={{ textAlign: "center", padding: "10px 0" }}>
                  <p
                    style={{
                      fontSize: 9,
                      color: t.textMuted,
                      fontFamily: "'Poppins',sans-serif",
                      margin: 0,
                    }}
                  >
                    No sessions scheduled
                  </p>
                </div>
              ) : (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 4 }}
                >
                  {sessionEvents
                    .filter((e) => e.date === form.date)
                    .map((ev, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 7,
                          padding: "5px 8px",
                          borderRadius: 6,
                          background: t.calEventBg,
                          border: `1px solid ${t.calEventBorder}`,
                        }}
                      >
                        <div
                          style={{
                            width: 2,
                            height: 22,
                            borderRadius: 99,
                            background: "#0078d4",
                            flexShrink: 0,
                          }}
                        />
                        <div>
                          <div
                            style={{
                              fontSize: 10,
                              fontWeight: 600,
                              color: t.calEventText,
                              fontFamily: "'Poppins',sans-serif",
                            }}
                          >
                            {ev.title}
                          </div>
                          <div
                            style={{
                              fontSize: 8,
                              color: t.calIconColor,
                              fontFamily: "'Poppins',sans-serif",
                            }}
                          >
                            Scheduled
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}
        <div
          style={{
            margin: "0 10px 10px",
            background: isDark ? "rgba(0,120,212,0.06)" : "#f0f8ff",
            border: `1px solid ${isDark ? "rgba(0,120,212,0.2)" : "#bfdbfe"}`,
            borderRadius: 10,
            padding: "10px 12px",
          }}
        >
          <div
            style={{
              fontSize: 9,
              fontWeight: 700,
              color: "#0078d4",
              fontFamily: "'Poppins',sans-serif",
              marginBottom: 6,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            Tips
          </div>
          {[
            "Click a date to auto-fill the date field",
            "Complete all 3 steps before scheduling",
            "'Schedule for Later' saves without going live",
          ].map((tip, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 5,
                marginBottom: 4,
              }}
            >
              <span
                style={{
                  width: 3,
                  height: 3,
                  borderRadius: "50%",
                  background: "#0078d4",
                  marginTop: 5,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: 9,
                  color: t.textSub,
                  fontFamily: "'Poppins',sans-serif",
                  lineHeight: 1.5,
                }}
              >
                {tip}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <ThreePanelLayout
      t={t}
      isDark={isDark}
      left={LeftPanel}
      center={CenterPanel}
      right={RightPanel}
      defaultLeftW={210}
      defaultRightW={250}
      minLeft={170}
      maxLeft={300}
      minRight={200}
      maxRight={340}
    />
  );
}

/* ══════════════════════════════════════════════════
   PANEL 0 — LIVE DASHBOARD  (File 1, unchanged)
══════════════════════════════════════════════════ */
function PanelLiveDashboard({ t, isDark, navigate }) {
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState({
    live: 0,
    viewers: 0,
    scheduled: 0,
    completed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [isSessionsOpen, setIsSessionsOpen] = useState(true);
  const [, setTick] = useState(0);

  const fetchSessions = async () => {
    try {
      const res = await getSessionHistory();
      const data = Array.isArray(res.data) ? res.data : [];
      setSessions(data);
      setStats({
        live: data.filter((s) => s.status === "LIVE").length,
        viewers: data.reduce((acc, s) => acc + (s.viewerCount ?? 0), 0),
        scheduled: data.filter((s) => s.status === "SCHEDULED").length,
        completed: data.filter((s) => s.status === "ENDED").length,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
    const dataInterval = setInterval(fetchSessions, 15000);
    const tickInterval = setInterval(() => setTick((n) => n + 1), 10000);
    return () => {
      clearInterval(dataInterval);
      clearInterval(tickInterval);
    };
  }, []);

  const sessionTabs = ["all", "LIVE", "SCHEDULED", "ENDED"];
  const filtered =
    activeTab === "all"
      ? sessions
      : sessions.filter((s) => s.status === activeTab);

  const handleEnd = async (id) => {
    try {
      await endLiveSession(id);
      setSessions((prev) =>
        prev.map((s) =>
          s.id === id
            ? { ...s, status: "ENDED", actualEndTime: new Date().toISOString() }
            : s,
        ),
      );
      setStats((prev) => ({
        ...prev,
        live: Math.max(0, prev.live - 1),
        completed: prev.completed + 1,
      }));
    } catch (err) {
      console.error(err);
      alert("Failed to end session.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteLiveSession(id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
      setStats((prev) => ({
        ...prev,
        completed: Math.max(0, prev.completed - 1),
      }));
    } catch (err) {
      console.error(err);
      alert("Failed to delete session.");
    }
  };

  // const handleStartLive = async (id) => {
  //   try {
  //     const res = await startLiveSessionWithToken(id);
  //     const { room, token } = res.data;
  //     if (!token) {
  //       alert("Could not get LiveKit token.");
  //       return;
  //     }
  //     setSessions((prev) =>
  //       prev.map((s) =>
  //         s.id === id
  //           ? {
  //               ...s,
  //               status: "LIVE",
  //               actualStartTime: new Date().toISOString(),
  //             }
  //           : s,
  //       ),
  //     );
  //     setStats((prev) => ({
  //       ...prev,
  //       live: prev.live + 1,
  //       scheduled: Math.max(0, prev.scheduled - 1),
  //     }));
  //     sessionStorage.setItem("call_state", JSON.stringify({ room, token }));
  //     navigate(`/trainer/live-controls/${id}`, { state: { room, token } });
  //   } catch (err) {
  //     console.error(err);
  //     const msg =
  //       err?.response?.data?.error ??
  //       err?.response?.data?.message ??
  //       err.message;
  //     alert("Cannot start: " + msg);
  //   }
  // };
  const handleStartLive = async (id) => {
    try {
      // ✅ Check if EXTERNAL session — open link directly
      const session = sessions.find((s) => s.id === id);
      if (session?.meetingType === "EXTERNAL" && session?.externalMeetingUrl) {
        // Still start the session on backend to set status LIVE
        await startLiveSessionWithToken(id);
        setSessions((prev) =>
          prev.map((s) =>
            s.id === id
              ? {
                  ...s,
                  status: "LIVE",
                  actualStartTime: new Date().toISOString(),
                }
              : s,
          ),
        );
        setStats((prev) => ({
          ...prev,
          live: prev.live + 1,
          scheduled: Math.max(0, prev.scheduled - 1),
        }));
        // Open the external meeting link
        window.open(session.externalMeetingUrl, "_blank");
        return;
      }

      // CUSTOM — normal LiveKit flow
      const res = await startLiveSessionWithToken(id);
      const { room, token } = res.data;
      if (!token) {
        alert("Could not get LiveKit token.");
        return;
      }
      setSessions((prev) =>
        prev.map((s) =>
          s.id === id
            ? {
                ...s,
                status: "LIVE",
                actualStartTime: new Date().toISOString(),
              }
            : s,
        ),
      );
      setStats((prev) => ({
        ...prev,
        live: prev.live + 1,
        scheduled: Math.max(0, prev.scheduled - 1),
      }));
      sessionStorage.setItem("call_state", JSON.stringify({ room, token }));
      navigate(`/trainer/live-controls/${id}`, { state: { room, token } });
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.error ??
        err?.response?.data?.message ??
        err.message;
      alert("Cannot start: " + msg);
    }
  };
  const statCards = [
    { label: "Live Now", value: stats.live, color: "#f43f5e", icon: Circle },
    {
      label: "Live Viewers",
      value: stats.viewers,
      color: "#f59e0b",
      icon: Users,
    },
    {
      label: "Scheduled",
      value: stats.scheduled,
      color: "#22d3ee",
      icon: Calendar,
    },
    {
      label: "Completed",
      value: stats.completed,
      color: "#34d399",
      icon: BarChart3,
    },
  ];

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(155px,1fr))",
          gap: 12,
          marginBottom: 20,
        }}
      >
        {statCards.map((s, i) => (
          <StatCard key={i} stat={s} index={i} t={t} />
        ))}
      </div>
      <div
        style={{
          background: t.cardBg,
          border: `1px solid ${t.border}`,
          borderRadius: 20,
          padding: 22,
          boxShadow: t.shadow,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 18,
            flexWrap: "wrap",
            gap: 10,
          }}
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
                background: "rgba(34,197,94,0.1)",
                border: "1px solid rgba(34,197,94,0.2)",
              }}
            >
              <Radio size={15} color="#22c55e" />
            </div>
            <span
              style={{
                fontFamily: "'Poppins',sans-serif",
                fontWeight: 700,
                fontSize: 13,
                color: t.text,
              }}
            >
              All Sessions
            </span>
          </div>
          <div
            style={{
              display: "flex",
              gap: 6,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {sessionTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "5px 14px",
                  borderRadius: 999,
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  fontFamily: "'Poppins',sans-serif",
                  cursor: "pointer",
                  border: "none",
                  transition: "all 0.2s",
                  background: activeTab === tab ? "#22c55e" : t.pillBg,
                  color: activeTab === tab ? "#fff" : t.pillText,
                  boxShadow:
                    activeTab === tab
                      ? "0 4px 12px rgba(34,197,94,0.3)"
                      : "none",
                }}
              >
                {tab}
              </button>
            ))}
            <button
              onClick={() => setIsSessionsOpen((p) => !p)}
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                border: `1px solid ${t.border}`,
                background: t.pillBg,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: t.textMuted,
              }}
            >
              <ChevronDown
                size={13}
                style={{
                  transition: "transform 0.3s",
                  transform: isSessionsOpen ? "rotate(0deg)" : "rotate(-90deg)",
                }}
              />
            </button>
          </div>
        </div>
        {isSessionsOpen &&
          (loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    height: 56,
                    borderRadius: 12,
                    background: t.barBg,
                    animation: "pulse 1.5s ease infinite",
                  }}
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "40px 0",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: `1.5px dashed ${t.emptyBorder}`,
                  background: t.emptyBg,
                }}
              >
                <Video size={22} color={t.emptyIcon} />
              </div>
              <p
                style={{
                  fontSize: 12,
                  color: t.textMuted,
                  fontWeight: 500,
                  fontFamily: "'Poppins',sans-serif",
                  margin: 0,
                }}
              >
                No sessions found
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {filtered.map((session) => (
                <SessionRow
                  key={session.id}
                  session={session}
                  t={t}
                  navigate={navigate}
                  handleEnd={handleEnd}
                  handleDelete={handleDelete}
                  handleStartLive={handleStartLive}
                />
              ))}
            </div>
          ))}
      </div>
    </>
  );
}

function StatCard({ stat, index, t }) {
  const [hov, setHov] = useState(false);
  const Icon = stat.icon;
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        animationDelay: `${index * 80}ms`,
        background: hov ? t.cardBgHov : t.cardBg,
        border: `1px solid ${hov ? t.borderHov : t.border}`,
        boxShadow: hov ? `${t.shadowHov},0 0 40px ${stat.color}12` : t.shadow,
        borderRadius: 16,
        padding: "18px 18px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        position: "relative",
        overflow: "hidden",
        transition: "all 0.25s ease",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -16,
          right: -16,
          width: 72,
          height: 72,
          borderRadius: "50%",
          background: stat.color,
          filter: "blur(32px)",
          opacity: hov ? 0.18 : 0.05,
          transition: "opacity 0.4s",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `${stat.color}18`,
          border: `1px solid ${stat.color}30`,
        }}
      >
        <Icon size={17} color={stat.color} strokeWidth={2} />
      </div>
      <div>
        <p
          style={{
            fontSize: 36,
            fontWeight: 800,
            lineHeight: 1,
            fontFamily: "'Poppins',sans-serif",
            color: t.text,
            margin: 0,
          }}
        >
          {stat.value}
        </p>
        <p
          style={{
            fontSize: 9,
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: t.textMuted,
            fontFamily: "'Poppins',sans-serif",
            margin: "5px 0 0",
          }}
        >
          {stat.label}
        </p>
      </div>
      <div
        style={{
          height: 2,
          background: t.barBg,
          borderRadius: 99,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            borderRadius: 99,
            background: stat.color,
            width: hov ? "65%" : "20%",
            transition: "width 0.65s ease",
            opacity: 0.85,
          }}
        />
      </div>
    </div>
  );
}

function SessionRow({
  session,
  t,
  navigate,
  handleEnd,
  handleDelete,
  handleStartLive,
}) {
  const [hov, setHov] = useState(false);
  const statusColors = {
    LIVE: "#f43f5e",
    SCHEDULED: "#22d3ee",
    ENDED: "#34d399",
  };
  const color = statusColors[session.status] || t.textMuted;
  const showGoLive = canShowGoLive(session);
  const countdown = !showGoLive ? getGoLiveCountdown(session) : null;
  const scheduledAt = parseScheduledDateTime(session);
  const displayDate = scheduledAt
    ? scheduledAt.toLocaleDateString()
    : (session.scheduledDate ?? "—");
  const displayTime = scheduledAt
    ? scheduledAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : (session.scheduledTime ?? "—");
  const actualEnd = session.actualEndTime
    ? new Date(session.actualEndTime)
    : null;
  const actualStart = session.actualStartTime
    ? new Date(session.actualStartTime)
    : null;

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 14px",
        borderRadius: 14,
        background: hov ? t.recentItemBgHov : t.recentItemBg,
        border: `1px solid ${hov ? t.recentItemBorder : "transparent"}`,
        transition: "all 0.15s",
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `${color}18`,
          border: `1px solid ${color}30`,
          flexShrink: 0,
        }}
      >
        <Video size={15} color={color} />
      </div>
      <div
        style={{
          flex: 1,
          minWidth: 0,
          cursor: session.status === "LIVE" ? "pointer" : "default",
        }}
        onClick={() => {
          if (session.status === "LIVE")
            navigate(`/trainer/live-controls/${session.id}`);
        }}
      >
        <p
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: t.text,
            margin: 0,
            fontFamily: "'Poppins',sans-serif",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {session.title}
        </p>
        <div
          style={{ display: "flex", gap: 10, marginTop: 3, flexWrap: "wrap" }}
        >
          <span
            style={{
              fontSize: 10,
              color: t.textMuted,
              fontFamily: "'Poppins',sans-serif",
              display: "flex",
              alignItems: "center",
              gap: 3,
            }}
          >
            <Calendar size={10} /> {displayDate}
          </span>
          <span
            style={{
              fontSize: 10,
              color: t.textMuted,
              fontFamily: "'Poppins',sans-serif",
              display: "flex",
              alignItems: "center",
              gap: 3,
            }}
          >
            <Clock size={10} /> {displayTime}
          </span>
          {session.duration && (
            <span
              style={{
                fontSize: 10,
                color: t.textMuted,
                fontFamily: "'Poppins',sans-serif",
                display: "flex",
                alignItems: "center",
                gap: 3,
              }}
            >
              <Radio size={10} /> {session.duration} min
            </span>
          )}
          {session.status === "LIVE" && actualStart && (
            <span
              style={{
                fontSize: 10,
                color: "#22c55e",
                fontFamily: "'Poppins',sans-serif",
                display: "flex",
                alignItems: "center",
                gap: 3,
              }}
            >
              ▶ Started{" "}
              {actualStart.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
          {session.status === "ENDED" && actualEnd && (
            <span
              style={{
                fontSize: 10,
                color: t.textMuted,
                fontFamily: "'Poppins',sans-serif",
                display: "flex",
                alignItems: "center",
                gap: 3,
              }}
            >
              ■ Ended{" "}
              {actualEnd.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
        </div>
      </div>
      <span
        style={{
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: "0.1em",
          color,
          background: `${color}18`,
          border: `1px solid ${color}30`,
          padding: "3px 10px",
          borderRadius: 999,
          fontFamily: "'Poppins',sans-serif",
          display: "flex",
          alignItems: "center",
          gap: 5,
          flexShrink: 0,
        }}
      >
        {session.status === "LIVE" && (
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: color,
              display: "inline-block",
              animation: "liveDot 1.2s ease-in-out infinite",
            }}
          />
        )}
        {session.status}
      </span>
      <div
        style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}
      >
        {(session.status === "SCHEDULED" || session.status === "LIVE") && (
          <CopyLinkBtn sessionId={session.id} />
        )}
        {session.status === "SCHEDULED" && showGoLive && (
          <ActionBtn
            label="Go Live"
            color="#22c55e"
            onClick={() => handleStartLive(session.id)}
          />
        )}
        {session.status === "SCHEDULED" && !showGoLive && countdown && (
          <span
            style={{
              fontSize: 9,
              fontWeight: 600,
              color: "#22d3ee",
              background: "rgba(34,211,238,0.08)",
              border: "1px solid rgba(34,211,238,0.2)",
              padding: "4px 10px",
              borderRadius: 8,
              fontFamily: "'Poppins',sans-serif",
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "center",
              gap: 3,
            }}
          >
            <Clock size={9} />
            {countdown}
          </span>
        )}
        {session.status === "SCHEDULED" && !showGoLive && !countdown && (
          <span
            style={{
              fontSize: 9,
              fontWeight: 600,
              color: t.textMuted,
              background: t.barBg,
              border: `1px solid ${t.border}`,
              padding: "4px 10px",
              borderRadius: 8,
              fontFamily: "'Poppins',sans-serif",
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "center",
              gap: 3,
            }}
          >
            <Lock size={9} /> Locked
          </span>
        )}
        {session.status === "LIVE" && (
          <>
            {/* <ActionBtn
              label="Join"
              color="#34d399"
              onClick={() => navigate(`/trainer/live-controls/${session.id}`)}
            /> */}
            <ActionBtn
              label="Join"
              color="#34d399"
              onClick={() => {
                if (
                  session.meetingType === "EXTERNAL" &&
                  session.externalMeetingUrl
                ) {
                  window.open(session.externalMeetingUrl, "_blank");
                } else {
                  navigate(`/trainer/live-controls/${session.id}`);
                }
              }}
            />
            <ActionBtn
              label="End"
              color="#f59e0b"
              onClick={() => handleEnd(session.id)}
            />
          </>
        )}
        {session.status === "ENDED" && (
          <ActionBtn
            label="Delete"
            color="#f43f5e"
            onClick={() => handleDelete(session.id)}
          />
        )}
      </div>
    </div>
  );
}

/* ── shared small helpers ── */
const inputStyle = (t) => ({
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
  appearance: "none",
});
const labelStyle = (t) => ({
  fontSize: 10,
  fontWeight: 600,
  color: t.labelColor,
  fontFamily: "'Poppins',sans-serif",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  marginBottom: 6,
  display: "block",
});

function CopyLinkBtn({ sessionId }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = (e) => {
    e.stopPropagation();
    const link = `${window.location.origin}/public/book-session/${sessionId}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      title="Copy public booking link"
      style={{
        padding: "5px 12px",
        borderRadius: 8,
        border: `1px solid ${copied ? "#34d39940" : "#a78bfa40"}`,
        background: copied ? "rgba(52,211,153,0.12)" : "rgba(167,139,250,0.12)",
        color: copied ? "#34d399" : "#a78bfa",
        fontSize: 10,
        fontWeight: 700,
        cursor: "pointer",
        fontFamily: "'Poppins',sans-serif",
        transition: "all 0.15s",
        display: "flex",
        alignItems: "center",
        gap: 5,
      }}
    >
      {copied ? (
        <>
          <Check size={10} /> Copied!
        </>
      ) : (
        <>
          <Copy size={10} /> Copy Link
        </>
      )}
    </button>
  );
}
function ActionBtn({ label, color, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: "5px 12px",
        borderRadius: 8,
        border: `1px solid ${color}40`,
        background: hov ? `${color}25` : `${color}12`,
        color,
        fontSize: 10,
        fontWeight: 700,
        cursor: "pointer",
        fontFamily: "'Poppins',sans-serif",
        transition: "all 0.15s",
      }}
    >
      {label}
    </button>
  );
}
function HeroBtn({ label, icon: Icon, color, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "8px 16px",
        borderRadius: 10,
        border: `1px solid ${hov ? color + "55" : color + "30"}`,
        background: hov ? `${color}22` : `${color}12`,
        color,
        fontSize: 11,
        fontWeight: 700,
        cursor: "pointer",
        fontFamily: "'Poppins',sans-serif",
        transition: "all 0.2s",
      }}
    >
      <Icon size={13} /> {label}
    </button>
  );
}

/* ══════════════════════════════════════════════════
   PANEL 2 — JOIN CALL  (File 1, unchanged)
══════════════════════════════════════════════════ */
function PanelJoinCall({ t, isDark, navigate }) {
  const [room, setRoom] = useState(null);
  const [connected, setConnected] = useState(false);
  const [trainerEmail, setEmail] = useState(null);
  const stompRef = useRef(null);

  useEffect(() => {
    const email = getTrainerEmail();
    if (!email) return;
    setEmail(email);
    const client = new Client({
      brokerURL: wsUrl,
      reconnectDelay: 5000,
      onConnect: () => {
        setConnected(true);
        client.subscribe(`/topic/calls/${email}`, (msg) => setRoom(msg.body));
      },
      onDisconnect: () => setConnected(false),
    });
    client.activate();
    stompRef.current = client;
    return () => client.deactivate();
  }, []);

  const handleJoin = async () => {
    try {
      if (!room) return alert("No incoming call");
      const res = await joinCall(room);
      const { token } = res.data;
      if (!token) return alert("Invalid token");
      sessionStorage.setItem("call_state", JSON.stringify({ room, token }));
      navigate("/trainer/call-room", { state: { room, token } });
    } catch (err) {
      console.error(err);
      alert("Failed to join call.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 32,
        padding: "32px 0",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: t.actBg,
            border: `1px solid ${t.actBorder}`,
            borderRadius: 12,
            padding: "8px 16px",
            fontSize: 11,
            fontWeight: 600,
            fontFamily: "'Poppins',sans-serif",
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              color: connected ? t.liveText : t.textMuted,
              fontWeight: 700,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: connected ? t.liveColor : t.textMuted,
                display: "inline-block",
                animation: connected
                  ? "liveDot 1.2s ease-in-out infinite"
                  : "none",
              }}
            />
            {connected ? "Connected" : "Offline"}
          </span>
        </div>
        <div
          className="livebadge"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            background: isDark
              ? "rgba(34,197,94,0.08)"
              : "rgba(22,163,74,0.08)",
            border: isDark
              ? "1px solid rgba(34,197,94,0.3)"
              : "1px solid rgba(22,163,74,0.3)",
            borderRadius: 999,
            padding: "8px 18px",
            color: t.liveText,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.1em",
            fontFamily: "'Poppins',sans-serif",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: t.liveColor,
              display: "inline-block",
            }}
          />
          LIVE
        </div>
      </div>
      {room ? (
        <>
          <div
            style={{
              position: "relative",
              width: 120,
              height: 120,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: "2px solid rgba(99,102,241,0.5)",
                animation: "callPulse 2s ease-out infinite",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: "2px solid rgba(99,102,241,0.3)",
                animation: "callPulse2 2s ease-out infinite 0.4s",
              }}
            />
            <div
              style={{
                width: 90,
                height: 90,
                borderRadius: "50%",
                background: "linear-gradient(135deg,#4338ca,#818cf8)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 2,
              }}
            >
              <svg width="40" height="40" viewBox="0 0 44 44" fill="none">
                <circle cx="22" cy="17" r="9" fill="rgba(255,255,255,0.9)" />
                <ellipse
                  cx="22"
                  cy="38"
                  rx="15"
                  ry="9"
                  fill="rgba(255,255,255,0.9)"
                />
              </svg>
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: t.textMuted,
                fontFamily: "'Poppins',sans-serif",
                margin: "0 0 8px",
              }}
            >
              INCOMING CALL
            </p>
            <h2
              style={{
                fontFamily: "'Poppins',sans-serif",
                fontSize: 32,
                fontWeight: 900,
                color: t.text,
                margin: "0 0 6px",
                letterSpacing: "-0.04em",
              }}
            >
              Student
            </h2>
            <p
              style={{
                fontSize: 12,
                color: t.textMuted,
                margin: 0,
                fontFamily: "'Poppins',sans-serif",
              }}
            >
              Room · {room}
            </p>
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            <CallActionBtn type="decline" onClick={() => setRoom(null)} />
            <CallActionBtn type="accept" onClick={handleJoin} />
          </div>
        </>
      ) : (
        <>
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              border: "1.5px solid rgba(99,102,241,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "radarPulse 3s ease-in-out infinite",
            }}
          >
            <div
              style={{
                width: 88,
                height: 88,
                borderRadius: "50%",
                border: "1.5px solid rgba(99,102,241,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  background: isDark
                    ? "rgba(99,102,241,0.12)"
                    : "rgba(79,70,229,0.07)",
                  border: "1.5px solid rgba(99,102,241,0.45)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Phone size={22} color={isDark ? "#a5b4fc" : "#6366f1"} />
              </div>
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <h3
              style={{
                fontFamily: "'Poppins',sans-serif",
                fontSize: 26,
                fontWeight: 900,
                color: t.text,
                margin: "0 0 8px",
              }}
            >
              Waiting for calls
            </h3>
            <p
              style={{
                fontSize: 12,
                color: t.textMuted,
                margin: 0,
                fontFamily: "'Poppins',sans-serif",
                fontWeight: 500,
              }}
            >
              {connected
                ? `Listening as ${trainerEmail ?? "trainer"}`
                : trainerEmail
                  ? "Connecting…"
                  : "Email not found"}
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: connected
                    ? isDark
                      ? "#6366f1"
                      : "#4f46e5"
                    : isDark
                      ? "#374151"
                      : "#d1d5db",
                  animation: "liveDot 1.4s ease-in-out infinite",
                  animationDelay: `${i * 0.18}s`,
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function CallActionBtn({ type, onClick }) {
  const [hov, setHov] = useState(false);
  const isDecline = type === "decline";
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 72,
        height: 72,
        borderRadius: "50%",
        border: "none",
        cursor: "pointer",
        background: isDecline
          ? hov
            ? "#991b1b"
            : "linear-gradient(135deg,#7f1d1d,#ef4444)"
          : hov
            ? "#14532d"
            : "linear-gradient(135deg,#14532d,#22c55e)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        boxShadow: isDecline
          ? "0 8px 32px rgba(239,68,68,0.4)"
          : "0 8px 32px rgba(34,197,94,0.45)",
        transition: "transform 0.2s",
        transform: hov ? "scale(1.06)" : "scale(1)",
      }}
    >
      {isDecline ? (
        <X size={24} color="white" />
      ) : (
        <Phone size={24} color="white" />
      )}
      <span
        style={{
          fontSize: 9,
          fontWeight: 600,
          color: "rgba(255,255,255,0.7)",
          letterSpacing: "0.1em",
          fontFamily: "'Poppins',sans-serif",
        }}
      >
        {isDecline ? "Decline" : "Accept"}
      </span>
    </button>
  );
}

/* ══════════════════════════════════════════════════
   PANEL 3 — LIVE SESSION HISTORY  (File 1, unchanged)
══════════════════════════════════════════════════ */
function PanelLiveHistory({ t, isDark, navigate, onEditRecording }) {
  const [sessions, setSessions] = useState([]);
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    (async () => {
      try {
        const [sessRes, recRes] = await Promise.all([
          getSessionHistory(),
          getMyRecordings(),
        ]);
        setSessions(Array.isArray(sessRes.data) ? sessRes.data : []);
        setRecordings(Array.isArray(recRes.data) ? recRes.data : []);
      } catch (err) {
        console.error(err);
        setSessions([]);
        setRecordings([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const recordingBySession = {};
  recordings.forEach((r) => {
    if (r.sessionId && !recordingBySession[r.sessionId])
      recordingBySession[r.sessionId] = r;
  });

  const filtered = sessions.filter((s) => {
    const matchSearch = s.title?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const iStyle = inputStyle(t);
  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "center",
          marginBottom: 14,
        }}
      >
        <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
          <Search
            size={13}
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: t.textMuted,
            }}
          />
          <input
            placeholder="Search sessions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ ...iStyle, padding: "9px 14px 9px 34px" }}
          />
        </div>
        <div style={{ position: "relative", minWidth: 160 }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              ...iStyle,
              cursor: "pointer",
              paddingRight: 36,
              width: "auto",
            }}
          >
            <option value="all">All Status</option>
            <option value="LIVE">Live</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="ENDED">Completed</option>
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
      </div>
      <div
        style={{
          background: t.cardBg,
          border: `1px solid ${t.border}`,
          borderRadius: 20,
          boxShadow: t.shadow,
          overflow: "hidden",
        }}
      >
        {loading ? (
          <div
            style={{
              padding: 24,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  height: 52,
                  borderRadius: 10,
                  background: t.barBg,
                  animation: "pulse 1.5s ease infinite",
                }}
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "60px 0",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: `1.5px dashed ${t.emptyBorder}`,
                background: t.emptyBg,
              }}
            >
              <Video size={22} color={t.emptyIcon} />
            </div>
            <p
              style={{
                fontSize: 12,
                color: t.textMuted,
                fontWeight: 500,
                fontFamily: "'Poppins',sans-serif",
                margin: 0,
              }}
            >
              No sessions found
            </p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr
                  style={{
                    background: t.theadBg,
                    borderBottom: `1px solid ${t.tableBorderColor}`,
                  }}
                >
                  {[
                    "Session",
                    "Date & Time",
                    "Duration",
                    "Status",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "12px 20px",
                        textAlign: "left",
                        fontSize: 9,
                        fontWeight: 700,
                        color: t.textMuted,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        fontFamily: "'Poppins',sans-serif",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <HistoryRow
                    key={s.id}
                    session={s}
                    t={t}
                    navigate={navigate}
                    recording={recordingBySession[s.id] ?? null}
                    onViewRecording={onEditRecording}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function HistoryRow({ session: s, t, navigate, recording, onViewRecording }) {
  const [hov, setHov] = useState(false);
  const statusColors = {
    LIVE: "#f43f5e",
    SCHEDULED: "#22d3ee",
    ENDED: "#34d399",
  };
  const statusColor = statusColors[s.status] || "#94a3b8";
  const scheduledAt = parseScheduledDateTime(s);
  const displayDate = scheduledAt
    ? scheduledAt.toLocaleDateString()
    : (s.scheduledDate ?? "—");
  const displayTime = scheduledAt
    ? scheduledAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : (s.scheduledTime ?? "—");

  return (
    <tr
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderBottom: `1px solid ${t.tableBorderColor}`,
        background: hov ? t.tableHov : "transparent",
        transition: "background 0.15s",
      }}
    >
      <td style={{ padding: "14px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(34,211,238,0.1)",
              border: "1px solid rgba(34,211,238,0.2)",
              flexShrink: 0,
            }}
          >
            <Video size={14} color="#22d3ee" />
          </div>
          <div>
            <p
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: t.text,
                margin: 0,
                fontFamily: "'Poppins',sans-serif",
              }}
            >
              {s.title}
            </p>
            <p
              style={{
                fontSize: 10,
                color: t.textMuted,
                margin: "2px 0 0",
                fontFamily: "'Poppins',sans-serif",
              }}
            >
              {s.batchName ?? ""}
            </p>
          </div>
        </div>
      </td>
      <td style={{ padding: "14px 20px" }}>
        <p
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: t.text,
            margin: 0,
            fontFamily: "'Poppins',sans-serif",
          }}
        >
          {displayDate}
        </p>
        <p
          style={{
            fontSize: 10,
            color: t.textMuted,
            margin: "2px 0 0",
            fontFamily: "'Poppins',sans-serif",
          }}
        >
          {displayTime}
        </p>
      </td>
      <td style={{ padding: "14px 20px" }}>
        <span
          style={{
            fontSize: 12,
            color: t.textSub,
            fontFamily: "'Poppins',sans-serif",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <Clock size={12} /> {s.duration ? `${s.duration} min` : "—"}
        </span>
      </td>
      <td style={{ padding: "14px 20px" }}>
        <span
          style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: statusColor,
            background: `${statusColor}18`,
            border: `1px solid ${statusColor}30`,
            padding: "3px 10px",
            borderRadius: 999,
            fontFamily: "'Poppins',sans-serif",
            display: "flex",
            alignItems: "center",
            gap: 4,
            width: "fit-content",
          }}
        >
          {s.status === "LIVE" && (
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: statusColor,
                display: "inline-block",
                animation: "liveDot 1.2s ease-in-out infinite",
              }}
            />
          )}
          {s.status}
        </span>
      </td>
      <td style={{ padding: "14px 20px" }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {recording && (
            <HeroBtn
              label="Recording"
              icon={Play}
              color="#a78bfa"
              onClick={(e) => {
                e.stopPropagation();
                if (onViewRecording) onViewRecording(recording.id);
              }}
            />
          )}
          {!recording && s.recordingUrl && (
            <HeroBtn
              label="Replay"
              icon={Play}
              color="#a78bfa"
              onClick={() => window.open(s.recordingUrl, "_blank")}
            />
          )}
        </div>
      </td>
    </tr>
  );
}

/* ══════════════════════════════════════════════════
   PANEL 4 — ATTENDANCE REPORT  (File 1, unchanged)
══════════════════════════════════════════════════ */
function PanelAttendanceReport({ t, isDark, navigate }) {
  const [attendees] = useState([
    {
      name: "Raghib Imam",
      joinTime: "10:00 AM",
      leaveTime: "11:00 AM",
      duration: "60 min",
      watchPercent: 95,
      chatMessages: 5,
      status: "present",
    },
  ]);
  const [search, setSearch] = useState("");
  const filtered = attendees.filter((a) =>
    a.name?.toLowerCase().includes(search.toLowerCase()),
  );
  const completedCount = attendees.filter((a) => a.status === "present").length;
  const completionRate =
    attendees.length > 0
      ? Math.round((completedCount / attendees.length) * 100)
      : 0;
  const avgWatch =
    attendees.length > 0
      ? Math.round(
          attendees.reduce((acc, a) => acc + (a.watchPercent ?? 0), 0) /
            attendees.length,
        )
      : 0;
  const totalMessages = attendees.reduce(
    (acc, a) => acc + (a.chatMessages ?? 0),
    0,
  );

  const handleExport = () => {
    const csv =
      "data:text/csv;charset=utf-8,Name,Join Time,Leave Time,Duration,Watch %,Chat\n" +
      attendees
        .map(
          (a) =>
            `${a.name},${a.joinTime},${a.leaveTime},${a.duration},${a.watchPercent},${a.chatMessages}`,
        )
        .join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = "attendance.csv";
    document.body.appendChild(link);
    link.click();
  };

  const metricCards = [
    {
      label: "Total Attendees",
      value: attendees.length,
      color: "#22d3ee",
      icon: Users,
    },
    {
      label: "Completed",
      value: completedCount,
      color: "#34d399",
      icon: CheckCircle2,
    },
    {
      label: "Completion Rate",
      value: `${completionRate}%`,
      color: "#a78bfa",
      icon: BarChart3,
    },
    {
      label: "Avg Watch Time",
      value: `${avgWatch}%`,
      color: "#f59e0b",
      icon: Clock,
    },
    {
      label: "Chat Messages",
      value: totalMessages,
      color: "#f43f5e",
      icon: MessageCircle,
    },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 16,
          justifyContent: "flex-end",
        }}
      >
        <HeroBtn
          label="Export CSV"
          icon={Download}
          color="#22d3ee"
          onClick={handleExport}
        />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
          gap: 14,
          marginBottom: 20,
        }}
      >
        {metricCards.map((m, i) => (
          <AttMetricCard key={i} metric={m} t={t} index={i} />
        ))}
      </div>
      <div
        style={{
          background: t.cardBg,
          border: `1px solid ${t.border}`,
          borderRadius: 20,
          boxShadow: t.shadow,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "14px 20px",
            borderBottom: `1px solid ${t.tableBorderColor}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
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
                background: "rgba(167,139,250,0.1)",
                border: "1px solid rgba(167,139,250,0.2)",
              }}
            >
              <Users size={15} color="#a78bfa" />
            </div>
            <span
              style={{
                fontFamily: "'Poppins',sans-serif",
                fontWeight: 700,
                fontSize: 13,
                color: t.text,
              }}
            >
              Attendee Details
            </span>
          </div>
          <input
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "7px 14px",
              borderRadius: 10,
              border: `1px solid ${t.border}`,
              background: isDark ? "#1a1a1a" : "#f8fafc",
              color: t.text,
              fontSize: 11,
              fontFamily: "'Poppins',sans-serif",
              fontWeight: 500,
              outline: "none",
              width: 200,
            }}
          />
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  background: t.theadBg,
                  borderBottom: `1px solid ${t.tableBorderColor}`,
                }}
              >
                {[
                  "Student",
                  "Joined",
                  "Left",
                  "Duration",
                  "Watch %",
                  "Chat",
                  "Status",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "11px 18px",
                      textAlign: "left",
                      fontSize: 9,
                      fontWeight: 700,
                      color: t.textMuted,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      fontFamily: "'Poppins',sans-serif",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((a, i) => (
                <AttendeeRow key={i} attendee={a} t={t} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AttMetricCard({ metric, t, index }) {
  const [hov, setHov] = useState(false);
  const Icon = metric.icon;
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="dfade"
      style={{
        animationDelay: `${index * 60}ms`,
        background: hov ? t.cardBgHov : t.cardBg,
        border: `1px solid ${hov ? metric.color + "30" : t.border}`,
        boxShadow: hov ? `0 8px 32px ${metric.color}12` : t.shadow,
        borderRadius: 20,
        padding: "20px 22px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        transition: "all 0.25s ease",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -15,
          right: -15,
          width: 70,
          height: 70,
          borderRadius: "50%",
          background: metric.color,
          filter: "blur(30px)",
          opacity: hov ? 0.15 : 0.04,
          transition: "opacity 0.4s",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `${metric.color}18`,
          border: `1px solid ${metric.color}30`,
        }}
      >
        <Icon size={17} color={metric.color} />
      </div>
      <div>
        <p
          style={{
            fontSize: 32,
            fontWeight: 800,
            lineHeight: 1,
            fontFamily: "'Poppins',sans-serif",
            color: t.text,
            margin: 0,
          }}
        >
          {metric.value}
        </p>
        <p
          style={{
            fontSize: 9,
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: t.textMuted,
            fontFamily: "'Poppins',sans-serif",
            margin: "5px 0 0",
          }}
        >
          {metric.label}
        </p>
      </div>
      <div
        style={{
          height: 2,
          background: t.barBg,
          borderRadius: 99,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            borderRadius: 99,
            background: metric.color,
            width: hov ? "60%" : "18%",
            transition: "width 0.65s ease",
          }}
        />
      </div>
    </div>
  );
}

function AttendeeRow({ attendee: a, t }) {
  const [hov, setHov] = useState(false);
  const cfg = statusConfig[a.status] || statusConfig.present;
  const Icon = cfg.icon;
  return (
    <tr
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderBottom: `1px solid ${t.tableBorderColor}`,
        background: hov ? t.tableHov : "transparent",
        transition: "background 0.15s",
      }}
    >
      <td style={{ padding: "13px 18px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 700,
              color: "#fff",
              flexShrink: 0,
            }}
          >
            {(a.name || "?")[0]}
          </div>
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: t.text,
              fontFamily: "'Poppins',sans-serif",
            }}
          >
            {a.name}
          </span>
        </div>
      </td>
      {[a.joinTime, a.leaveTime, a.duration].map((v, i) => (
        <td
          key={i}
          style={{
            padding: "13px 18px",
            fontSize: 12,
            color: t.textSub,
            fontFamily: "'Poppins',sans-serif",
          }}
        >
          {v}
        </td>
      ))}
      <td style={{ padding: "13px 18px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div
            style={{
              flex: 1,
              maxWidth: 60,
              height: 4,
              borderRadius: 99,
              background: t.barBg,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                borderRadius: 99,
                background:
                  a.watchPercent >= 80
                    ? "#34d399"
                    : a.watchPercent >= 50
                      ? "#f59e0b"
                      : "#f87171",
                width: `${a.watchPercent}%`,
              }}
            />
          </div>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: t.text,
              fontFamily: "'Poppins',sans-serif",
            }}
          >
            {a.watchPercent}%
          </span>
        </div>
      </td>
      <td
        style={{
          padding: "13px 18px",
          fontSize: 12,
          color: t.textSub,
          fontFamily: "'Poppins',sans-serif",
        }}
      >
        {a.chatMessages}
      </td>
      <td style={{ padding: "13px 18px" }}>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: cfg.color,
            background: `${cfg.color}18`,
            border: `1px solid ${cfg.color}30`,
            padding: "3px 10px",
            borderRadius: 999,
            width: "fit-content",
            fontFamily: "'Poppins',sans-serif",
          }}
        >
          <Icon size={10} color={cfg.color} /> {cfg.label}
        </span>
      </td>
    </tr>
  );
}

/* ══════════════════════════════════════════════════
   PANEL 5 — UPLOAD RECORDED VIDEO  (File 1, unchanged)
══════════════════════════════════════════════════ */
function PanelUploadRecorded({ t, isDark, navigate, onSuccess }) {
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
                fontWeight: 700,
                color: "#34d399",
                margin: 0,
                fontFamily: "'Poppins',sans-serif",
              }}
            >
              Video uploaded successfully!
            </p>
            <p
              style={{
                fontSize: 11,
                color: t.textMuted,
                margin: "3px 0 0",
                fontFamily: "'Poppins',sans-serif",
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
                fontFamily: "'Poppins',sans-serif",
                fontWeight: 700,
                fontSize: 16,
                color: t.text,
                margin: "0 0 6px",
              }}
            >
              Drop your video here
            </p>
            <p
              style={{
                fontFamily: "'Poppins',sans-serif",
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
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "'Poppins',sans-serif",
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
                  fontWeight: 700,
                  color: t.text,
                  margin: 0,
                  fontFamily: "'Poppins',sans-serif",
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
                  fontFamily: "'Poppins',sans-serif",
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

function UploadSubmitBtn({ uploading, success, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={uploading || success}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: "100%",
        padding: "14px 0",
        borderRadius: 14,
        border: "none",
        background: success
          ? "#34d399"
          : uploading
            ? "rgba(45,212,191,0.5)"
            : hov
              ? "#14b8a6"
              : "#2dd4bf",
        color: uploading ? "rgba(255,255,255,0.7)" : "#0f172a",
        fontSize: 13,
        fontWeight: 700,
        cursor: uploading || success ? "not-allowed" : "pointer",
        fontFamily: "'Poppins',sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        transition: "all 0.2s",
        boxShadow:
          hov && !uploading ? "0 8px 24px rgba(45,212,191,0.35)" : "none",
      }}
    >
      {success ? (
        <>
          <CheckCircle2 size={16} /> Uploaded!
        </>
      ) : uploading ? (
        <>
          <span
            style={{
              width: 14,
              height: 14,
              border: "2px solid rgba(15,23,42,0.3)",
              borderTop: "2px solid rgba(15,23,42,0.8)",
              borderRadius: "50%",
              display: "inline-block",
              animation: "spin 0.8s linear infinite",
            }}
          />
          Uploading...
        </>
      ) : (
        <>
          <UploadCloud size={16} /> Upload & Publish
        </>
      )}
    </button>
  );
}

/* ══════════════════════════════════════════════════
   PANEL 6 — RECORDED CLASSES LIST  (File 1, unchanged)
══════════════════════════════════════════════════ */
function PanelRecordedList({ t, isDark, navigate, onEdit, onUpload }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await getMyRecordings();
        setVideos(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
        setError("Failed to load recordings.");
        setVideos([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = videos.filter(
    (v) =>
      v.title?.toLowerCase().includes(search.toLowerCase()) ||
      v.batchName?.toLowerCase().includes(search.toLowerCase()),
  );
  const readyCount = videos.filter((v) => v.status === "READY").length;
  const processingCount = videos.filter(
    (v) => v.status === "PROCESSING",
  ).length;
  const iStyle = inputStyle(t);

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <p
          style={{
            fontSize: 12,
            color: t.textSub,
            fontFamily: "'Poppins',sans-serif",
            margin: 0,
            fontWeight: 500,
          }}
        >
          {videos.length} video{videos.length !== 1 ? "s" : ""} · {readyCount}{" "}
          ready{processingCount > 0 ? ` · ${processingCount} processing` : ""}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: t.actBg,
              border: `1px solid ${t.actBorder}`,
              borderRadius: 10,
              padding: "8px 14px",
            }}
          >
            <Activity size={12} color={t.actIcon} />
            <div
              style={{
                display: "flex",
                gap: 3,
                alignItems: "flex-end",
                height: 14,
              }}
            >
              <span
                className="d1"
                style={{
                  width: 3,
                  height: 10,
                  borderRadius: 2,
                  background: t.actBar,
                  display: "block",
                }}
              />
              <span
                className="d2"
                style={{
                  width: 3,
                  height: 14,
                  borderRadius: 2,
                  background: t.actBar,
                  display: "block",
                }}
              />
              <span
                className="d3"
                style={{
                  width: 3,
                  height: 7,
                  borderRadius: 2,
                  background: t.actBar,
                  display: "block",
                }}
              />
            </div>
          </div>
          <button
            onClick={onUpload}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "8px 18px",
              borderRadius: 10,
              border: "1px solid rgba(45,212,191,0.3)",
              background: "rgba(45,212,191,0.08)",
              color: "#2dd4bf",
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "'Poppins',sans-serif",
              transition: "all 0.2s",
            }}
          >
            <Upload size={13} /> Upload Video
          </button>
        </div>
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
            fontFamily: "'Poppins',sans-serif",
          }}
        >
          ⚠️ {error}
        </div>
      )}
      <div
        style={{
          background: t.cardBg,
          border: `1px solid ${t.border}`,
          borderRadius: 16,
          padding: "12px 16px",
          boxShadow: t.shadow,
          marginBottom: 20,
          position: "relative",
        }}
      >
        <Search
          size={13}
          style={{
            position: "absolute",
            left: 28,
            top: "50%",
            transform: "translateY(-50%)",
            color: t.textMuted,
          }}
        />
        <input
          placeholder="Search by title or batch..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ ...iStyle, padding: "8px 14px 8px 34px" }}
        />
      </div>
      {loading ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
            gap: 14,
          }}
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              style={{
                background: t.cardBg,
                border: `1px solid ${t.border}`,
                borderRadius: 20,
                overflow: "hidden",
                boxShadow: t.shadow,
              }}
            >
              <div
                style={{
                  height: 160,
                  background: t.barBg,
                  animation: "pulse 1.5s ease infinite",
                }}
              />
              <div
                style={{
                  padding: 16,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    height: 12,
                    borderRadius: 6,
                    background: t.barBg,
                    animation: "pulse 1.5s ease infinite",
                    width: "75%",
                  }}
                />
                <div
                  style={{
                    height: 10,
                    borderRadius: 5,
                    background: t.barBg,
                    animation: "pulse 1.5s ease infinite",
                    width: "50%",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "80px 0",
            gap: 14,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: `1.5px dashed ${t.emptyBorder}`,
              background: t.emptyBg,
            }}
          >
            <Video size={28} color={t.emptyIcon} />
          </div>
          <p
            style={{
              fontSize: 13,
              color: t.textMuted,
              fontWeight: 600,
              fontFamily: "'Poppins',sans-serif",
              margin: 0,
            }}
          >
            {search ? "No videos match your search" : "No recordings yet"}
          </p>
          <button
            onClick={onUpload}
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
            Upload Your First Video →
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
            gap: 14,
          }}
        >
          {filtered.map((video, i) => (
            <RecordedVideoCard
              key={video.id}
              video={video}
              t={t}
              isDark={isDark}
              index={i}
              onEdit={onEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function RecordedVideoCard({ video, t, isDark, index, onEdit }) {
  const [hov, setHov] = useState(false);
  const statusStyle =
    video.status === "READY"
      ? t.statusReady
      : video.status === "PROCESSING"
        ? t.statusProcessing
        : t.statusFailed;
  return (
    <div
      onClick={() => onEdit(video.id)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="dfade"
      style={{
        animationDelay: `${index * 50}ms`,
        background: hov ? t.cardBgHov : t.cardBg,
        border: `1px solid ${hov ? t.borderHov : t.border}`,
        boxShadow: hov
          ? `${t.shadowHov},0 0 40px rgba(244,63,94,0.08)`
          : t.shadow,
        borderRadius: 20,
        overflow: "hidden",
        cursor: "pointer",
        transition: "all 0.25s ease",
      }}
    >
      <div
        style={{
          position: "relative",
          height: 160,
          background: t.thumbBg,
          overflow: "hidden",
        }}
      >
        {video.thumbnail ? (
          <img
            src={video.thumbnail}
            alt={video.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              transition: "transform 0.4s ease",
              transform: hov ? "scale(1.04)" : "scale(1)",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: isDark
                ? "linear-gradient(135deg,rgba(244,63,94,0.08),rgba(167,139,250,0.08))"
                : "linear-gradient(135deg,rgba(244,63,94,0.05),rgba(167,139,250,0.05))",
            }}
          >
            <Video size={32} color={t.emptyIcon} />
          </div>
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: hov ? 1 : 0,
            transition: "opacity 0.25s",
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Play size={18} color="#0f172a" style={{ marginLeft: 2 }} />
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            fontSize: 8,
            fontWeight: 800,
            letterSpacing: "0.08em",
            color: statusStyle.color,
            background: statusStyle.bg,
            border: `1px solid ${statusStyle.border}`,
            padding: "3px 8px",
            borderRadius: 999,
            fontFamily: "'Poppins',sans-serif",
          }}
        >
          {video.status}
        </div>
      </div>
      <div style={{ padding: "14px 16px 16px" }}>
        <h3
          style={{
            fontFamily: "'Poppins',sans-serif",
            fontSize: 13,
            fontWeight: 700,
            color: t.text,
            margin: "0 0 4px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {video.title}
        </h3>
        <p
          style={{
            fontFamily: "'Poppins',sans-serif",
            fontSize: 11,
            color: t.textMuted,
            margin: "0 0 10px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {video.description || "No description"}
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 6,
          }}
        >
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.08em",
              color: "#f43f5e",
              background: "rgba(244,63,94,0.1)",
              border: "1px solid rgba(244,63,94,0.2)",
              padding: "3px 8px",
              borderRadius: 999,
              fontFamily: "'Poppins',sans-serif",
            }}
          >
            {video.batchName || "No batch"}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {video.durationMinutes && (
              <span
                style={{
                  fontSize: 10,
                  color: t.textMuted,
                  fontFamily: "'Poppins',sans-serif",
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                }}
              >
                <Clock size={10} /> {video.durationMinutes}m
              </span>
            )}
            <span
              style={{
                fontSize: 10,
                color: t.textMuted,
                fontFamily: "'Poppins',sans-serif",
                display: "flex",
                alignItems: "center",
                gap: 3,
              }}
            >
              <Eye size={10} /> {video.viewCount ?? 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   PANEL 7 — EDIT RECORDING  (File 1, unchanged)
══════════════════════════════════════════════════ */
function PanelEditRecording({ t, isDark, navigate, recordingId, onBack }) {
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
            fontFamily: "'Poppins',sans-serif",
            color: "#f87171",
            fontSize: 13,
            fontWeight: 600,
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
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "'Poppins',sans-serif",
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
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "'Poppins',sans-serif",
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
                fontWeight: 700,
                color: t.text,
                fontFamily: "'Poppins',sans-serif",
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
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
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
  );
}
export default TrainerLiveClasses;
