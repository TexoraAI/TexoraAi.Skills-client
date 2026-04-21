import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  fetchMyNotifications,
  markOneRead,
  markAllReadAPI,
  clearAllNotificationsAPI,
  connectWebSocket,
  disconnectWebSocket,
} from "../services/notificationService";

// ── SVG Icon components ──────────────────────────────────────
const Icons = {
  Video: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
      <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
    </svg>
  ),
  File: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/>
    </svg>
  ),
  Assessment: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
  Content: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  ),
  Quiz: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
      <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  Course: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
  ),
  Assignment: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
      <rect x="9" y="2" width="6" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/>
    </svg>
  ),
  Attendance: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  Batch: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  Message: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  Live: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
      <circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/>
    </svg>
  ),
  Student: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  Doubt: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
      <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  Submission: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
      <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
    </svg>
  ),
  Reminder: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  Bell: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
  Check: ({ color = "#fff", size = 14 }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width={size} height={size}>
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  Trash: ({ color = "#fff", size = 14 }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={size} height={size}>
      <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
    </svg>
  ),
  Eye: ({ color = "#fff", size = 14 }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={size} height={size}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  EyeOff: ({ color = "#fff", size = 14 }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={size} height={size}>
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ),
  TrashLarge: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="44" height="44" style={{ color: "#f43f5e" }}>
      <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
    </svg>
  ),
  BellOff: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="44" height="44" style={{ color: "#94a3b8" }}>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/><path d="M18.63 13A17.89 17.89 0 0 1 18 8"/><path d="M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h14"/><path d="M18 8a6 6 0 0 0-9.33-5"/><line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ),
  AllClear: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="44" height="44" style={{ color: "#10b981" }}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
};

// ── Role-aware TYPE_META ─────────────────────────────────────
const TYPE_META = {
  NEW_VIDEO:        { IconComp: Icons.Video,      label: "Video",      grad: "#6366f1,#818cf8", ring: "#6366f120" },
  NEW_FILE:         { IconComp: Icons.File,       label: "File",       grad: "#10b981,#34d399", ring: "#10b98120" },
  NEW_ASSESSMENT:   { IconComp: Icons.Assessment, label: "Assessment", grad: "#f59e0b,#fbbf24", ring: "#f59e0b20" },
  NEW_CONTENT:      { IconComp: Icons.Content,    label: "Content",    grad: "#0ea5e9,#38bdf8", ring: "#0ea5e920" },
  NEW_QUIZ:         { IconComp: Icons.Quiz,       label: "Quiz",       grad: "#8b5cf6,#a78bfa", ring: "#8b5cf620" },
  NEW_COURSE:       { IconComp: Icons.Course,     label: "Course",     grad: "#ec4899,#f472b6", ring: "#ec489920" },
  NEW_ASSIGNMENT:   { IconComp: Icons.Assignment, label: "Assignment", grad: "#f97316,#fb923c", ring: "#f9731620" },
  ATTENDANCE:       { IconComp: Icons.Attendance, label: "Attendance", grad: "#14b8a6,#2dd4bf", ring: "#14b8a620" },
  BATCH_UPDATE:     { IconComp: Icons.Batch,      label: "Batch",      grad: "#f43f5e,#fb7185", ring: "#f43f5e20" },
  CHAT_MESSAGE:     { IconComp: Icons.Message,    label: "Message",    grad: "#ec4899,#f472b6", ring: "#ec489920" },
  LIVE_SESSION:     { IconComp: Icons.Live,       label: "Live",       grad: "#7c3aed,#8b5cf6", ring: "#7c3aed20" },
  STUDENT_JOINED:   { IconComp: Icons.Student,    label: "Student",    grad: "#0ea5e9,#38bdf8", ring: "#0ea5e920" },
  DOUBT_RAISED:     { IconComp: Icons.Doubt,      label: "Doubt",      grad: "#f59e0b,#fbbf24", ring: "#f59e0b20" },
  ASSIGNMENT_SUBMIT:{ IconComp: Icons.Submission, label: "Submission", grad: "#10b981,#34d399", ring: "#10b98120" },
  SESSION_REMINDER: { IconComp: Icons.Reminder,   label: "Reminder",   grad: "#6366f1,#818cf8", ring: "#6366f120" },
  BATCH_ASSIGNED:   { IconComp: Icons.Batch,      label: "Batch",      grad: "#f43f5e,#fb7185", ring: "#f43f5e20" },
  DEFAULT:          { IconComp: Icons.Bell,       label: "Alert",      grad: "#64748b,#94a3b8", ring: "#64748b20" },
};

const getMeta = (type) => {
  if (!type) return TYPE_META.DEFAULT;
  const key = type
    .replace(/^NEW_MESSAGE$/i, "CHAT_MESSAGE")
    .replace(/^ATTENDANCE_MARKED$/i, "ATTENDANCE")
    .replace(/^NEW_COURSE_AVAILABLE$/i, "NEW_COURSE")
    .replace(/^NEW_QUIZ_AVAILABLE$/i, "NEW_QUIZ")
    .replace(/^NEW_ASSIGNMENT_POSTED$/i, "NEW_ASSIGNMENT")
    .toUpperCase();
  return TYPE_META[key] ?? TYPE_META.DEFAULT;
};

const formatTime = (createdAt) => {
  if (!createdAt) return "";
  const diff = Math.floor((Date.now() - new Date(createdAt)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const groupByDay = (notifications) => {
  const groups = {};
  notifications.forEach((n) => {
    const date = n.createdAt ? new Date(n.createdAt) : new Date();
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    let label;
    if (date.toDateString() === today.toDateString()) label = "Today";
    else if (date.toDateString() === yesterday.toDateString()) label = "Yesterday";
    else
      label = date.toLocaleDateString("en-IN", {
        weekday: "long",
        month: "short",
        day: "numeric",
      });
    if (!groups[label]) groups[label] = [];
    groups[label].push(n);
  });
  return groups;
};

// ── Role config ──────────────────────────────────────────────
const ROLE_CONFIG = {
  student: {
    heading: "Notifications",
    subtext: "Your learning updates, quizzes, assignments & more",
    accentColor: "#6366f1",
    accentLight: "#eef2ff",
    gradFrom: "#6366f1",
    gradTo: "#8b5cf6",
    gradMid: "#ec4899",
  },
  trainer: {
    heading: "Trainer Hub",
    subtext: "Student activity, batch alerts & session reminders",
    accentColor: "#0ea5e9",
    accentLight: "#e0f2fe",
    gradFrom: "#0ea5e9",
    gradTo: "#6366f1",
    gradMid: "#8b5cf6",
  },
  admin: {
    heading: "Admin Alerts",
    subtext: "System events, user activity & platform alerts",
    accentColor: "#f43f5e",
    accentLight: "#fff1f2",
    gradFrom: "#f43f5e",
    gradTo: "#f97316",
    gradMid: "#fb923c",
  },
  business: {
    heading: "Business Insights",
    subtext: "Leads, enrollments & campaign alerts",
    accentColor: "#10b981",
    accentLight: "#ecfdf5",
    gradFrom: "#10b981",
    gradTo: "#0ea5e9",
    gradMid: "#06b6d4",
  },
};

// ── Shimmer skeleton ─────────────────────────────────────────
const SkeletonCard = () => (
  <div
    style={{
      display: "flex",
      gap: 10,
      padding: "12px 14px",
      borderRadius: 12,
      background: "var(--color-background-secondary, #f8fafc)",
      border: "0.5px solid var(--color-border-tertiary, #e2e8f0)",
      marginBottom: 6,
      animation: "pulse 1.4s ease-in-out infinite",
    }}
  >
    <div style={{ width: 38, height: 38, borderRadius: 10, background: "var(--color-border-secondary, #e2e8f0)", flexShrink: 0 }} />
    <div style={{ flex: 1 }}>
      <div style={{ width: "50%", height: 11, borderRadius: 6, background: "var(--color-border-secondary, #e2e8f0)", marginBottom: 8 }} />
      <div style={{ width: "80%", height: 11, borderRadius: 6, background: "var(--color-border-tertiary, #f1f5f9)" }} />
    </div>
  </div>
);

// ── Single notification card ─────────────────────────────────
const NotifCard = ({ item, onRead, accent, index }) => {
  const { IconComp, grad, ring } = getMeta(item.type);
  const [g1, g2] = grad.split(",");
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={() => !item.read && onRead(item.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        padding: "12px 14px",
        borderRadius: 12,
        background: item.read
          ? hovered ? "var(--color-background-secondary, #f8fafc)" : "var(--color-background-primary, #fff)"
          : hovered ? `${ring}` : `${ring}`,
        border: `0.5px solid ${
          item.read
            ? hovered ? "var(--color-border-secondary, #e2e8f0)" : "var(--color-border-tertiary, #f1f5f9)"
            : hovered ? accent : `${accent}40`
        }`,
        cursor: item.read ? "default" : "pointer",
        transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
        position: "relative",
        transform: hovered ? "translateY(-1px)" : "none",
        boxShadow: hovered ? "0 4px 14px -4px rgba(0,0,0,0.08)" : "none",
        animationDelay: `${index * 50}ms`,
        animation: "slideIn 0.35s ease both",
        marginBottom: 6,
      }}
    >
      {/* Gradient icon bubble */}
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 10,
          flexShrink: 0,
          background: `linear-gradient(135deg, ${g1}, ${g2})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <IconComp />
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 6, marginBottom: 2 }}>
          <span
            style={{
              fontSize: 13,
              fontWeight: item.read ? 500 : 700,
              color: item.read ? "var(--color-text-secondary, #64748b)" : "var(--color-text-primary, #0f172a)",
              fontFamily: "'Sora', sans-serif",
              letterSpacing: "-0.01em",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {item.title}
          </span>
          <span
            style={{
              fontSize: 10,
              color: "var(--color-text-tertiary, #94a3b8)",
              whiteSpace: "nowrap",
              flexShrink: 0,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {formatTime(item.createdAt)}
          </span>
        </div>
        <p
          style={{
            fontSize: 12,
            color: item.read ? "var(--color-text-tertiary, #94a3b8)" : "var(--color-text-secondary, #475569)",
            lineHeight: 1.4,
            margin: 0,
            fontFamily: "'DM Sans', sans-serif",
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {item.message}
        </p>
        {!item.read && (
          <span
            style={{
              display: "inline-block",
              marginTop: 3,
              fontSize: 10,
              color: accent,
              fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Tap to mark read ·
          </span>
        )}
      </div>

      {/* Unread pulse dot */}
      {!item.read && (
        <span
          style={{
            position: "absolute",
            top: 13,
            right: 13,
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: accent,
            boxShadow: `0 0 0 3px ${accent}30`,
            animation: "blink 2s ease-in-out infinite",
          }}
        />
      )}
    </div>
  );
};

// ── Confirm Dialog ───────────────────────────────────────────
const ConfirmDialog = ({ onConfirm, onCancel }) => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      zIndex: 9998,
      background: "rgba(15,23,42,0.45)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backdropFilter: "blur(4px)",
      animation: "fadeInDown 0.2s ease",
    }}
  >
    <div
      style={{
        background: "var(--color-background-primary, #fff)",
        borderRadius: 16,
        padding: "24px 20px",
        maxWidth: 320,
        width: "90%",
        border: "0.5px solid var(--color-border-secondary, #e2e8f0)",
        animation: "slideIn 0.25s cubic-bezier(0.34,1.56,0.64,1)",
        textAlign: "center",
      }}
    >
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
        <Icons.TrashLarge />
      </div>
      <h3
        style={{
          margin: "0 0 6px",
          fontSize: 16,
          fontWeight: 800,
          color: "var(--color-text-primary, #0f172a)",
          fontFamily: "'Sora', sans-serif",
          letterSpacing: "-0.02em",
        }}
      >
        Clear all notifications?
      </h3>
      <p
        style={{
          margin: "0 0 18px",
          fontSize: 12,
          color: "var(--color-text-secondary, #64748b)",
          fontFamily: "'DM Sans', sans-serif",
          lineHeight: 1.5,
        }}
      >
        This will remove all notifications from your inbox. This action cannot be undone.
      </p>
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={onCancel}
          style={{
            flex: 1,
            padding: "9px 0",
            borderRadius: 10,
            border: "0.5px solid var(--color-border-secondary, #e2e8f0)",
            background: "var(--color-background-secondary, #f8fafc)",
            fontSize: 12,
            fontWeight: 600,
            color: "var(--color-text-secondary, #64748b)",
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-background-tertiary, #f1f5f9)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "var(--color-background-secondary, #f8fafc)"; }}
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          style={{
            flex: 1,
            padding: "9px 0",
            borderRadius: 10,
            border: "none",
            background: "linear-gradient(135deg, #f43f5e, #e11d48)",
            fontSize: 12,
            fontWeight: 700,
            color: "#fff",
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.88"; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
        >
          Yes, Clear All
        </button>
      </div>
    </div>
  </div>
);

// ── Main Page ────────────────────────────────────────────────
const NotificationsPage = () => {
  const { pathname } = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [toastMsg, setToastMsg] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [hidden, setHidden] = useState(false);
  const toastRef = useRef(null);

  const role = pathname.startsWith("/student")
    ? "student"
    : pathname.startsWith("/trainer")
      ? "trainer"
      : pathname.startsWith("/admin")
        ? "admin"
        : pathname.startsWith("/business")
          ? "business"
          : "student";

  const cfg = ROLE_CONFIG[role];
  const userEmail = localStorage.getItem("email");
  const userRole = role.toUpperCase();

  useEffect(() => {
    setLoading(true);
    fetchMyNotifications()
      .then((data) => setNotifications(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // useEffect(() => {
  //   connectWebSocket({
  //     userEmail,
  //     userRole,
  //     onMessage: (newNotif) => {
  //       setNotifications((prev) => [newNotif, ...prev]);
  //       showToast(`New: ${newNotif.title}`);
  //     },
  //   });
  //   return () => disconnectWebSocket();
  // }, [userEmail, userRole]);
  
  useEffect(() => {
    const handler = (e) => {
      setNotifications((prev) => [e.detail, ...prev]);
      showToast(`New: ${e.detail.title}`);
    };
    window.addEventListener("lms:notification", handler);
    return () => window.removeEventListener("lms:notification", handler);
  }, []);
  const showToast = (msg) => {
    setToastMsg(msg);
    clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => setToastMsg(null), 3500);
  };

  const handleMarkRead = async (id) => {
    await markOneRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const handleMarkAllRead = async () => {
    await markAllReadAPI();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast("All notifications marked as read");
  };

  const handleClearAll = async () => {
    setShowConfirm(false);
    await clearAllNotificationsAPI();
    setNotifications([]);
    showToast("All notifications cleared");
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filtered = filter === "unread" ? notifications.filter((n) => !n.read) : notifications;
  const grouped = groupByDay(filtered);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%,100% { opacity: 1; }
          50%      { opacity: 0.5; }
        }
        @keyframes blink {
          0%,100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.6; transform: scale(0.85); }
        }
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(12px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: var(--color-border-secondary, #e2e8f0); border-radius: 99px; }
      `}</style>

      <div
        style={{
          fontFamily: "'DM Sans', sans-serif",
          width: "100%",
          padding: "0 16px",
          animation: "fadeInDown 0.4s ease both",
        }}
      >
        {/* ── HERO HEADER CARD ─────────────────────────────── */}
        <div
          style={{
            background: `linear-gradient(135deg, ${cfg.gradFrom} 0%, ${cfg.gradMid} 50%, ${cfg.gradTo} 100%)`,
            border: "none",
            borderRadius: 20,
            padding: "22px 24px 18px",
            marginBottom: 12,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative blobs */}
          <div
            style={{
              position: "absolute",
              top: -40,
              right: -40,
              width: 160,
              height: 160,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -30,
              left: "30%",
              width: 120,
              height: 120,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.06)",
              pointerEvents: "none",
            }}
          />

          {/* Top row: badge + title + actions */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              flexWrap: "wrap",
              position: "relative",
              zIndex: 1,
            }}
          >
            {/* Role badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                background: "rgba(255,255,255,0.2)",
                border: "0.5px solid rgba(255,255,255,0.35)",
                borderRadius: 99,
                padding: "4px 14px",
                flexShrink: 0,
                backdropFilter: "blur(6px)",
              }}
            >
              <Icons.Bell />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#fff",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  fontFamily: "'Sora', sans-serif",
                }}
              >
                {role.charAt(0).toUpperCase() + role.slice(1)} Notifications
              </span>
            </div>

            {/* Title + subtext */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <h1
                style={{
                  margin: 0,
                  fontSize: 22,
                  fontWeight: 800,
                  color: "#fff",
                  letterSpacing: "-0.025em",
                  fontFamily: "'Sora', sans-serif",
                  lineHeight: 1.1,
                }}
              >
                {cfg.heading}
              </h1>
              <p
                style={{
                  margin: "4px 0 0",
                  fontSize: 12,
                  color: "rgba(255,255,255,0.75)",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {cfg.subtext}
              </p>
            </div>

            {/* Right-side action buttons */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexShrink: 0,
                flexWrap: "wrap",
              }}
            >
              {/* Unread pill — only shown when unreadCount > 0 */}
              {unreadCount > 0 && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    background: "rgba(255,255,255,0.25)",
                    border: "0.5px solid rgba(255,255,255,0.4)",
                    borderRadius: 99,
                    padding: "4px 12px",
                    backdropFilter: "blur(6px)",
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#fff",
                      animation: "blink 2s infinite",
                      display: "inline-block",
                    }}
                  />
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>
                    {unreadCount} unread
                  </span>
                </div>
              )}

              {/* Mark all read — only shown when unreadCount > 0 */}
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    background: "rgba(255,255,255,0.15)",
                    border: "0.5px solid rgba(255,255,255,0.35)",
                    borderRadius: 8,
                    padding: "6px 12px",
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#fff",
                    cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                    transition: "all 0.15s ease",
                    backdropFilter: "blur(6px)",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.28)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.15)"; }}
                >
                  <Icons.Check />
                  <span>Mark all read</span>
                </button>
              )}

              {/* Clear all */}
              {notifications.length > 0 && (
                <button
                  onClick={() => setShowConfirm(true)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    background: "rgba(255,255,255,0.15)",
                    border: "0.5px solid rgba(255,100,100,0.5)",
                    borderRadius: 8,
                    padding: "6px 12px",
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#fff",
                    cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                    transition: "all 0.15s ease",
                    backdropFilter: "blur(6px)",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(244,63,94,0.4)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.15)"; }}
                >
                  <Icons.Trash />
                  <span>Clear all</span>
                </button>
              )}

              {/* Hide / Show toggle */}
              <button
                onClick={() => setHidden((prev) => !prev)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  background: "rgba(255,255,255,0.15)",
                  border: "0.5px solid rgba(255,255,255,0.35)",
                  borderRadius: 8,
                  padding: "6px 12px",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#fff",
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  transition: "all 0.15s ease",
                  backdropFilter: "blur(6px)",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.28)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.15)"; }}
              >
                {hidden ? <Icons.Eye /> : <Icons.EyeOff />}
                <span>{hidden ? "Show" : "Hide"}</span>
              </button>
            </div>
          </div>

          {/* Stats row */}
          <div
            style={{
              display: "flex",
              gap: 8,
              marginTop: 16,
              flexWrap: "wrap",
              position: "relative",
              zIndex: 1,
            }}
          >
            {[
              { label: "Total", value: notifications.length },
              { label: "Unread", value: unreadCount },
              { label: "Read", value: notifications.length - unreadCount },
            ].map(({ label, value }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "rgba(255,255,255,0.15)",
                  border: "0.5px solid rgba(255,255,255,0.25)",
                  backdropFilter: "blur(8px)",
                  borderRadius: 10,
                  padding: "8px 16px",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 800,
                      color: "#fff",
                      lineHeight: 1,
                      fontFamily: "'Sora', sans-serif",
                    }}
                  >
                    {value}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "rgba(255,255,255,0.7)",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      marginTop: 2,
                    }}
                  >
                    {label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── COLLAPSIBLE SECTION ──────────────────────────── */}
        {!hidden && (
          <div style={{ animation: "slideIn 0.3s ease both" }}>
            {/* Filter Tabs */}
            <div
              style={{
                display: "flex",
                gap: 6,
                marginBottom: 10,
                overflowX: "auto",
                paddingBottom: 2,
              }}
            >
              {["all", "unread"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: "5px 14px",
                    borderRadius: 99,
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    transition: "all 0.15s ease",
                    fontFamily: "'DM Sans', sans-serif",
                    border:
                      filter === f
                        ? `0.5px solid ${cfg.accentColor}`
                        : "0.5px solid var(--color-border-secondary, #e2e8f0)",
                    background:
                      filter === f
                        ? cfg.accentColor
                        : "var(--color-background-primary, #fff)",
                    color: filter === f ? "#fff" : "var(--color-text-secondary, #64748b)",
                  }}
                >
                  {f === "all" ? `All (${notifications.length})` : `Unread (${unreadCount})`}
                </button>
              ))}
            </div>

            {/* Notification List */}
            <div>
              {loading && [1, 2, 3].map((i) => <SkeletonCard key={i} />)}

              {!loading && filtered.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "48px 20px",
                    background: "var(--color-background-primary, #fff)",
                    borderRadius: 16,
                    border: "0.5px dashed var(--color-border-secondary, #e2e8f0)",
                    animation: "fadeInDown 0.4s ease",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                    {notifications.length === 0
                      ? <Icons.BellOff />
                      : filter === "unread"
                        ? <Icons.AllClear />
                        : <Icons.BellOff />}
                  </div>
                  <h3
                    style={{
                      margin: "0 0 5px",
                      fontSize: 16,
                      fontWeight: 700,
                      color: "var(--color-text-primary, #1e293b)",
                      fontFamily: "'Sora', sans-serif",
                    }}
                  >
                    {notifications.length === 0
                      ? "Inbox is clear!"
                      : filter === "unread"
                        ? "All caught up!"
                        : "No notifications yet"}
                  </h3>
                  <p style={{ margin: 0, fontSize: 12, color: "var(--color-text-tertiary, #94a3b8)" }}>
                    {notifications.length === 0
                      ? "You've cleared everything. New alerts will appear here in real-time."
                      : filter === "unread"
                        ? "You've read everything. Great job!"
                        : role === "trainer"
                          ? "Student activity & batch alerts will appear here."
                          : "Videos, quizzes & updates will appear here in real-time."}
                  </p>
                </div>
              )}

              {!loading &&
                Object.entries(grouped).map(([day, items]) => (
                  <div key={day} style={{ marginBottom: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: "var(--color-text-tertiary, #94a3b8)",
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          fontFamily: "'Sora', sans-serif",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {day}
                      </span>
                      <div style={{ flex: 1, height: 1, background: "var(--color-border-tertiary, #f1f5f9)" }} />
                      <span style={{ fontSize: 10, color: "var(--color-text-tertiary, #cbd5e1)", fontFamily: "'DM Sans', sans-serif" }}>
                        {items.length} alert{items.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div>
                      {items.map((item, i) => (
                        <NotifCard
                          key={item.id}
                          item={item}
                          onRead={handleMarkRead}
                          accent={cfg.accentColor}
                          index={i}
                        />
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Hidden state message */}
        {hidden && (
          <div
            style={{
              textAlign: "center",
              padding: "20px",
              background: "var(--color-background-secondary, #f8fafc)",
              borderRadius: 12,
              border: "0.5px dashed var(--color-border-secondary, #e2e8f0)",
              animation: "slideIn 0.3s ease both",
            }}
          >
            <p style={{ margin: 0, fontSize: 12, color: "var(--color-text-tertiary, #94a3b8)", fontFamily: "'DM Sans', sans-serif" }}>
              Notifications hidden —{" "}
              <strong style={{ color: "var(--color-text-secondary)" }}>Show</strong> to view them
            </p>
          </div>
        )}
      </div>

      {/* Confirm Dialog */}
      {showConfirm && (
        <ConfirmDialog onConfirm={handleClearAll} onCancel={() => setShowConfirm(false)} />
      )}

      {/* Toast */}
      {toastMsg && (
        <div
          style={{
            position: "fixed",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            background: "var(--color-background-primary, #0f172a)",
            color: "var(--color-text-primary, #fff)",
            padding: "10px 18px",
            borderRadius: 12,
            fontSize: 12,
            fontWeight: 600,
            zIndex: 9999,
            animation: "toastIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both",
            boxShadow: "0 6px 24px rgba(0,0,0,0.2)",
            fontFamily: "'DM Sans', sans-serif",
            display: "flex",
            alignItems: "center",
            gap: 6,
            whiteSpace: "nowrap",
            border: "0.5px solid var(--color-border-secondary, #e2e8f0)",
          }}
        >
          <Icons.Check color="#10b981" size={13} /> {toastMsg}
        </div>
      )}
    </>
  );
};

export default NotificationsPage;