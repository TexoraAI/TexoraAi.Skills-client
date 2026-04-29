import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  BookOpen,
  MessageCircleQuestion,
  FileCheck,
  Clock,
  Zap,
  ArrowUpRight,
  Sparkles,
  GraduationCap,
  Activity,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  TrendingUp,
  Video,
  FileText,
  ClipboardList,
  BarChart3,
} from "lucide-react";

// ─── Services ────────────────────────────────────────────────────────────────
import { getTrainerDashboard } from "../services/batchService";
import {
  getTrainerQuizzes,
  getTrainerAssignments,
} from "../services/assessmentService";
import videoService from "../services/videoService";
import fileService from "../services/fileService";
import { courseService } from "../services/courseService";
import { getTrainerStudents, getConversation } from "../services/chatService";

/* ─────────────────────────────────────────────────────────────────────────────
   PENDING DOUBTS CALCULATOR
───────────────────────────────────────────────────────────────────────────── */
const fetchPendingDoubtsCount = async (batches, trainerEmail) => {
  if (!batches.length || !trainerEmail) return 0;
  let pending = 0;
  for (const batch of batches) {
    try {
      const studentsRes = await getTrainerStudents(batch.id);
      const studentEmails = studentsRes.data || [];
      if (!studentEmails.length) continue;
      const convResults = await Promise.allSettled(
        studentEmails.map((email) => getConversation(batch.id, email)),
      );
      for (const result of convResults) {
        if (result.status !== "fulfilled") continue;
        const msgs = result.value?.data || [];
        if (!msgs.length) continue;
        const lastMsg = msgs[msgs.length - 1];
        if (lastMsg.senderEmail && lastMsg.senderEmail !== trainerEmail) {
          pending++;
        }
      }
    } catch (e) {
      console.error(`Doubts fetch failed for batch ${batch.id}:`, e);
    }
  }
  return pending;
};

/* ─── theme token map ─── */
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
    textLabel: "rgba(255,255,255,0.22)",
    pillBg: "rgba(255,255,255,0.04)",
    pillBorder: "rgba(255,255,255,0.07)",
    pillText: "rgba(255,255,255,0.25)",
    iconBg: "rgba(255,255,255,0.05)",
    iconBorder: "rgba(255,255,255,0.08)",
    calDayText: "rgba(255,255,255,0.6)",
    calDayHeader: "rgba(255,255,255,0.22)",
    calFooter: "rgba(255,255,255,0.2)",
    calFooterBdr: "rgba(255,255,255,0.05)",
    emptyBorder: "rgba(255,255,255,0.07)",
    emptyBg: "rgba(255,255,255,0.02)",
    emptyIcon: "rgba(255,255,255,0.12)",
    gridLine: "rgba(255,255,255,0.5)",
    barBg: "rgba(255,255,255,0.05)",
    actBar: "rgba(255,255,255,0.5)",
    actIcon: "rgba(255,255,255,0.3)",
    actBg: "rgba(255,255,255,0.04)",
    actBorder: "rgba(255,255,255,0.07)",
    navBtnBg: "rgba(255,255,255,0.04)",
    navBtnBorder: "rgba(255,255,255,0.08)",
    navBtnColor: "#888",
    todayBg: "#ffffff",
    todayText: "#000000",
    shadow: "0 4px 20px rgba(0,0,0,0.4)",
    shadowHov: "0 20px 60px rgba(0,0,0,0.6)",
    liveColor: "#34d399",
    liveText: "#34d399",
    recentItemBg: "rgba(255,255,255,0.03)",
    recentItemBorder: "rgba(255,255,255,0.05)",
    recentItemBgHov: "rgba(255,255,255,0.06)",
    overdueBg: "rgba(239,68,68,0.12)",
    overdueText: "#f87171",
    overdueBorder: "rgba(239,68,68,0.2)",
    newBadgeBg: "rgba(245,158,11,0.12)",
    newBadgeText: "#fbbf24",
    newBadgeBorder: "rgba(245,158,11,0.2)",
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
    textLabel: "#94a3b8",
    pillBg: "#f1f5f9",
    pillBorder: "#e2e8f0",
    pillText: "#94a3b8",
    iconBg: "#f8fafc",
    iconBorder: "#e2e8f0",
    calDayText: "#374151",
    calDayHeader: "#9ca3af",
    calFooter: "#9ca3af",
    calFooterBdr: "#e5e7eb",
    emptyBorder: "#e2e8f0",
    emptyBg: "#f8fafc",
    emptyIcon: "#cbd5e1",
    gridLine: "rgba(0,0,0,0.12)",
    barBg: "#f1f5f9",
    actBar: "#94a3b8",
    actIcon: "#94a3b8",
    actBg: "#f8fafc",
    actBorder: "#e2e8f0",
    navBtnBg: "#f8fafc",
    navBtnBorder: "#e2e8f0",
    navBtnColor: "#64748b",
    todayBg: "#0f172a",
    todayText: "#ffffff",
    shadow: "0 1px 8px rgba(0,0,0,0.07)",
    shadowHov: "0 8px 32px rgba(0,0,0,0.10)",
    liveColor: "#16a34a",
    liveText: "#16a34a",
    recentItemBg: "#f8fafc",
    recentItemBorder: "#e2e8f0",
    recentItemBgHov: "#f1f5f9",
    overdueBg: "#fef2f2",
    overdueText: "#ef4444",
    overdueBorder: "#fecaca",
    newBadgeBg: "#fffbeb",
    newBadgeText: "#d97706",
    newBadgeBorder: "#fde68a",
  },
};

/* ─── count-up hook ─── */
function useCountUp(target, duration = 1200) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (target === 0) {
      setVal(0);
      return;
    }
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return val;
}

/* ─── mini calendar ─── */
function MiniCalendar({ t }) {
  const today = new Date();
  const [current, setCurrent] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
  });
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
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const firstDay = new Date(current.year, current.month, 1).getDay();
  const daysInMonth = new Date(current.year, current.month + 1, 0).getDate();
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  const prev = () =>
    setCurrent((c) => ({
      year: c.month === 0 ? c.year - 1 : c.year,
      month: c.month === 0 ? 11 : c.month - 1,
    }));
  const next = () =>
    setCurrent((c) => ({
      year: c.month === 11 ? c.year + 1 : c.year,
      month: c.month === 11 ? 0 : c.month + 1,
    }));
  const isToday = (d) =>
    d === today.getDate() &&
    current.month === today.getMonth() &&
    current.year === today.getFullYear();
  const cells = Array(offset)
    .fill(null)
    .concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div
      style={{
        background: t.cardBg,
        border: `1px solid ${t.border}`,
        borderRadius: 20,
        padding: 22,
        height: "100%",
        boxSizing: "border-box",
        boxShadow: t.shadow,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 18,
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
              background: t.iconBg,
              border: `1px solid ${t.iconBorder}`,
            }}
          >
            <CalendarDays size={16} color={t.text} />
          </div>
          <span
            style={{
              fontFamily: "'Poppins',sans-serif",
              fontWeight: 700,
              fontSize: 13,
              color: t.text,
            }}
          >
            {monthNames[current.month]} {current.year}
          </span>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {[prev, next].map((fn, i) => (
            <button
              key={i}
              onClick={fn}
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                border: `1px solid ${t.navBtnBorder}`,
                cursor: "pointer",
                background: t.navBtnBg,
                color: t.navBtnColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {i === 0 ? <ChevronLeft size={13} /> : <ChevronRight size={13} />}
            </button>
          ))}
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7,1fr)",
          gap: 2,
          marginBottom: 6,
        }}
      >
        {dayNames.map((d) => (
          <div
            key={d}
            style={{
              textAlign: "center",
              fontSize: 9,
              fontWeight: 700,
              color: t.calDayHeader,
              letterSpacing: "0.06em",
              paddingBottom: 6,
              fontFamily: "'Poppins',sans-serif",
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
          gap: 2,
        }}
      >
        {cells.map((d, i) => (
          <div
            key={i}
            style={{
              aspectRatio: "1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 8,
              fontSize: 11,
              fontWeight: isToday(d) ? 700 : 500,
              cursor: d ? "pointer" : "default",
              background: isToday(d) ? t.todayBg : "transparent",
              color: isToday(d)
                ? t.todayText
                : d
                  ? t.calDayText
                  : "transparent",
              fontFamily: "'Poppins',sans-serif",
              transition: "background 0.15s",
            }}
          >
            {d}
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: 16,
          paddingTop: 12,
          borderTop: `1px solid ${t.calFooterBdr}`,
          fontSize: 10,
          color: t.calFooter,
          textAlign: "center",
          fontFamily: "'Poppins',sans-serif",
          fontWeight: 500,
          letterSpacing: "0.05em",
        }}
      >
        NO SESSIONS SCHEDULED
      </div>
    </div>
  );
}

/* ─── stat card ─── */
function StatCard({ stat, index, navigate, t, subLoading }) {
  const Icon = stat.icon;
  const count = useCountUp(subLoading ? 0 : stat.value);
  const [hov, setHov] = useState(false);

  return (
    <button
      onClick={() => navigate(stat.route)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        animationDelay: `${index * 80}ms`,
        background: hov ? t.cardBgHov : t.cardBg,
        border: `1px solid ${hov ? t.borderHov : t.border}`,
        boxShadow: hov ? `${t.shadowHov}, 0 0 40px ${stat.color}12` : t.shadow,
        borderRadius: 20,
        padding: "22px 22px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        textAlign: "left",
        cursor: "pointer",
        transition: "all 0.25s ease",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -20,
          right: -20,
          width: 90,
          height: 90,
          borderRadius: "50%",
          background: stat.color,
          filter: "blur(40px)",
          opacity: hov ? 0.15 : 0.04,
          transition: "opacity 0.4s",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: `${stat.color}18`,
            border: `1px solid ${stat.color}30`,
          }}
        >
          <Icon size={19} color={stat.color} strokeWidth={2} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {/* "New" badge for live cards */}
          {stat.live && !subLoading && stat.value > 0 && (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontSize: 9,
                fontWeight: 700,
                color: t.newBadgeText,
                background: t.newBadgeBg,
                border: `1px solid ${t.newBadgeBorder}`,
                padding: "3px 8px",
                borderRadius: 999,
                fontFamily: "'Poppins',sans-serif",
              }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: t.newBadgeText,
                  display: "inline-block",
                }}
              />
              New
            </span>
          )}
          <ArrowUpRight
            size={13}
            style={{
              color: stat.color,
              opacity: hov ? 0.7 : 0,
              transition: "opacity 0.2s",
            }}
          />
        </div>
      </div>
      <div>
        {subLoading ? (
          <div
            style={{
              width: 48,
              height: 40,
              borderRadius: 8,
              background: t.barBg,
              animation: "pulse 1.5s ease infinite",
            }}
          />
        ) : (
          <p
            style={{
              fontSize: 40,
              fontWeight: 800,
              lineHeight: 1,
              fontFamily: "'Poppins',sans-serif",
              color: t.text,
              margin: 0,
            }}
          >
            {count}
          </p>
        )}
        <p
          style={{
            fontSize: 10,
            marginTop: 6,
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: t.textMuted,
            fontFamily: "'Poppins',sans-serif",
            margin: "6px 0 0",
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
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: hov ? "60%" : "30%",
          height: 1,
          background: `linear-gradient(90deg,${stat.color},transparent)`,
          transition: "width 0.5s ease",
          opacity: 0.5,
        }}
      />
    </button>
  );
}

/* ─── quick action pill ─── */
function QuickAction({ label, route, color, navigate, t }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={() => navigate(route)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "9px 18px",
        borderRadius: 10,
        border: `1px solid ${hov ? color + "55" : t.border}`,
        background: hov ? `${color}12` : "transparent",
        color: hov ? color : t.textMuted,
        fontSize: 12,
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.2s",
        fontFamily: "'Poppins',sans-serif",
        letterSpacing: "0.03em",
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: hov ? color : t.textMuted,
          transition: "background 0.2s",
          flexShrink: 0,
        }}
      />
      {label}
    </button>
  );
}

/* ─── recent panel ─── */
function RecentPanel({
  title,
  color,
  items,
  loading,
  emptyIcon: EmptyIcon,
  emptyText,
  viewRoute,
  renderItem,
  navigate,
  t,
}) {
  return (
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
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
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
              background: `${color}18`,
              border: `1px solid ${color}30`,
            }}
          >
            <EmptyIcon size={15} color={color} />
          </div>
          <span
            style={{
              fontFamily: "'Poppins',sans-serif",
              fontWeight: 700,
              fontSize: 13,
              color: t.text,
            }}
          >
            {title}
          </span>
        </div>
        <button
          onClick={() => navigate(viewRoute)}
          style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.06em",
            color: t.textMuted,
            background: t.pillBg,
            border: `1px solid ${t.pillBorder}`,
            borderRadius: 999,
            padding: "4px 12px",
            cursor: "pointer",
            fontFamily: "'Poppins',sans-serif",
          }}
        >
          View all
        </button>
      </div>

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{ display: "flex", gap: 10, alignItems: "center" }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: t.barBg,
                  flexShrink: 0,
                }}
              />
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                <div
                  style={{
                    height: 10,
                    borderRadius: 5,
                    background: t.barBg,
                    width: "70%",
                  }}
                />
                <div
                  style={{
                    height: 8,
                    borderRadius: 4,
                    background: t.barBg,
                    width: "45%",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "28px 0",
            gap: 10,
          }}
        >
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
            }}
          >
            <EmptyIcon size={20} color={t.emptyIcon} />
          </div>
          <p
            style={{
              fontSize: 11,
              color: t.textMuted,
              fontWeight: 500,
              fontFamily: "'Poppins',sans-serif",
              margin: 0,
            }}
          >
            {emptyText}
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {items.map((item, i) => renderItem(item, i))}
        </div>
      )}
    </div>
  );
}

/* ══ MAIN ══ */
const Dashboard = () => {
  const navigate = useNavigate();
  const trainerEmail =
    JSON.parse(localStorage.getItem("lms_user") || "{}")?.email || "";

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

  // ── state ──────────────────────────────────────────────────────────────────
  const [loading, setLoading] = useState(true);
  const [doubtsLoading, setDoubtsLoading] = useState(true);

  const [counts, setCounts] = useState({
    batches: 0,
    students: 0,
    quizzes: 0,
    assignments: 0,
    videos: 0,
    files: 0,
    courses: 0,
    doubts: 0,
  });
  const [recentVideos, setRecentVideos] = useState([]);
  const [recentFiles, setRecentFiles] = useState([]);
  const [recentAssignments, setRecentAssignments] = useState([]);

  // ── load ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [dashRes, quizRes, assignRes, videoRes, fileRes, courseRes] =
        await Promise.allSettled([
          getTrainerDashboard(),
          getTrainerQuizzes(),
          getTrainerAssignments(),
          videoService.getTrainerVideos(),
          fileService.getTrainerFiles(),
          courseService.getMyCourses(),
        ]);

      const batches =
        dashRes.status === "fulfilled" ? dashRes.value.batches || [] : [];
      const students =
        dashRes.status === "fulfilled" ? dashRes.value.students || [] : [];
      const quizzes =
        quizRes.status === "fulfilled" ? quizRes.value?.data || [] : [];
      const assigns =
        assignRes.status === "fulfilled" ? assignRes.value?.data || [] : [];
      const videos =
        videoRes.status === "fulfilled" ? videoRes.value?.data || [] : [];
      const files =
        fileRes.status === "fulfilled" ? fileRes.value?.data || [] : [];
      const courses =
        courseRes.status === "fulfilled" ? courseRes.value?.data || [] : [];

      setCounts((prev) => ({
        ...prev,
        batches: batches.length,
        students: students.length,
        quizzes: quizzes.length,
        assignments: assigns.length,
        videos: videos.length,
        files: files.length,
        courses: courses.length,
      }));
      setRecentVideos(videos.slice(0, 4));
      setRecentFiles(files.slice(0, 4));
      setRecentAssignments(assigns.slice(0, 4));
      setLoading(false);

      // pending doubts — separate slower fetch
      setDoubtsLoading(true);
      try {
        const pendingCount = await fetchPendingDoubtsCount(
          batches,
          trainerEmail,
        );
        setCounts((prev) => ({ ...prev, doubts: pendingCount }));
      } catch (e) {
        console.error("Doubts count failed:", e);
      } finally {
        setDoubtsLoading(false);
      }
    };
    load();
  }, [trainerEmail]);

  const fmt = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
    });
  };

  // ── stat cards config ──────────────────────────────────────────────────────
  const stats = [
    {
      label: "Active Batches",
      value: counts.batches,
      icon: BookOpen,
      color: "#22d3ee",
      route: "/trainer/batches",
    },
    {
      label: "Total Students",
      value: counts.students,
      icon: GraduationCap,
      color: "#34d399",
      route: "/trainer/student-reports",
    },
    {
      label: "Tests Created",
      value: counts.quizzes,
      icon: FileCheck,
      color: "#a78bfa",
      route: "/trainer/create-quiz",
    },
    {
      label: "Assignments",
      value: counts.assignments,
      icon: ClipboardList,
      color: "#f59e0b",
      route: "/trainer/assignments",
    },
    {
      label: "Videos Uploaded",
      value: counts.videos,
      icon: Video,
      color: "#f43f5e",
      route: "/trainer/recorded-classes",
    },
    {
      label: "Files Uploaded",
      value: counts.files,
      icon: FileText,
      color: "#2dd4bf",
      route: "/trainer/content-management",
    },
    {
      label: "Courses Created",
      value: counts.courses,
      icon: Users,
      color: "#c084fc",
      route: "/trainer/courses",
    },
    {
      label: "Pending Doubts",
      value: counts.doubts,
      icon: MessageCircleQuestion,
      color: "#fb923c",
      route: "/trainer/doubts-management",
      live: true,
    },
  ];

  const quickActions = [
    { label: "Create Quiz", route: "/trainer/create-quiz", color: "#a78bfa" },
    {
      label: "Manage Doubts",
      route: "/trainer/doubts-management",
      color: "#fb923c",
    },
    { label: "View Batches", route: "/trainer/batches", color: "#22d3ee" },
    {
      label: "Student Reports",
      route: "/trainer/student-reports",
      color: "#34d399",
    },
    {
      label: "Upload Video",
      route: "/trainer/recorded-classes",
      color: "#f43f5e",
    },
    { label: "Manage Courses", route: "/trainer/courses", color: "#c084fc" },
  ];

  const card = {
    background: t.cardBg,
    border: `1px solid ${t.border}`,
    borderRadius: 20,
    padding: 24,
    boxShadow: t.shadow,
  };
  const pill = {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    padding: "4px 10px",
    borderRadius: 999,
    background: t.pillBg,
    border: `1px solid ${t.pillBorder}`,
    color: t.pillText,
    fontFamily: "'Poppins',sans-serif",
  };

  /* ─── recent item row helper ─── */
  const RecentRow = ({ color, Icon: Ic, title, sub, badge }) => {
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
          transition: "all 0.15s",
          cursor: "default",
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
            background: `${color}18`,
            border: `1px solid ${color}30`,
            flexShrink: 0,
          }}
        >
          <Ic size={15} color={color} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: t.text,
              margin: 0,
              fontFamily: "'Poppins',sans-serif",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {title}
          </p>
          <p
            style={{
              fontSize: 10,
              color: t.textMuted,
              margin: "2px 0 0",
              fontFamily: "'Poppins',sans-serif",
            }}
          >
            {sub}
          </p>
        </div>
        {badge && (
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              color: t.overdueText,
              background: t.overdueBg,
              border: `1px solid ${t.overdueBorder}`,
              padding: "2px 7px",
              borderRadius: 999,
              flexShrink: 0,
              fontFamily: "'Poppins',sans-serif",
            }}
          >
            Overdue
          </span>
        )}
      </div>
    );
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        .dfade{animation:fadeUp 0.45s ease both}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.15}}
        .d1{animation:blink 1.6s ease infinite}
        .d2{animation:blink 1.6s 0.3s ease infinite}
        .d3{animation:blink 1.6s 0.6s ease infinite}
        @keyframes pulse-ring{0%{box-shadow:0 0 0 0 rgba(52,211,153,0.5)}70%{box-shadow:0 0 0 8px rgba(52,211,153,0)}100%{box-shadow:0 0 0 0 rgba(52,211,153,0)}}
        .livebadge{animation:pulse-ring 2.2s ease-out infinite}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: t.pageBg,
          color: t.text,
          fontFamily: "'Poppins',sans-serif",
          position: "relative",
          transition: "background 0.3s,color 0.3s",
        }}
      >
        <div
          style={{
            position: "relative",
            zIndex: 1,
            padding: 24,
            maxWidth: 1300,
            margin: "0 auto",
            paddingBottom: 52,
          }}
        >
          {/* ═══ HERO ═══ */}
          <div
            className="dfade"
            style={{
              borderRadius: 24,
              padding: "30px 36px",
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
                position: "absolute",
                top: "-30%",
                left: "40%",
                width: 300,
                height: 200,
                background:
                  "radial-gradient(ellipse,rgba(34,211,238,0.06),transparent 70%)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "-40%",
                right: "10%",
                width: 250,
                height: 200,
                background:
                  "radial-gradient(ellipse,rgba(167,139,250,0.06),transparent 70%)",
                pointerEvents: "none",
              }}
            />

            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 16,
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    marginBottom: 10,
                  }}
                >
                  <Sparkles size={11} color={t.textSub} />
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      color: t.textSub,
                      fontFamily: "'Poppins',sans-serif",
                    }}
                  >
                    Overview
                  </span>
                </div>
                <h1
                  style={{
                    fontFamily: "'Poppins',sans-serif",
                    fontWeight: 900,
                    fontSize: "clamp(1.6rem,3vw,2.4rem)",
                    color: t.text,
                    margin: 0,
                    lineHeight: 1.1,
                    letterSpacing: "-0.02em",
                  }}
                >
                  Trainer Dashboard
                </h1>
                <p
                  style={{
                    fontSize: 12,
                    color: t.textSub,
                    marginTop: 7,
                    fontWeight: 500,
                    fontFamily: "'Poppins',sans-serif",
                  }}
                >
                  All your content &amp; student activity at a glance
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {/* summary pill */}
                {!loading && (
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
                      color: t.textSub,
                    }}
                  >
                    <span>
                      {counts.batches} batch{counts.batches !== 1 ? "es" : ""}
                    </span>
                    <span
                      style={{ width: 1, height: 14, background: t.actBorder }}
                    />
                    <span>
                      {counts.students} student
                      {counts.students !== 1 ? "s" : ""}
                    </span>
                    <span
                      style={{ width: 1, height: 14, background: t.actBorder }}
                    />
                    {doubtsLoading ? (
                      <span style={{ opacity: 0.5 }}>checking doubts…</span>
                    ) : counts.doubts > 0 ? (
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                          color: "#fb923c",
                          fontWeight: 700,
                        }}
                      >
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: "#fb923c",
                            display: "inline-block",
                          }}
                        />
                        {counts.doubts} unanswered
                      </span>
                    ) : (
                      <span style={{ color: t.liveText }}>
                        No pending doubts ✓
                      </span>
                    )}
                  </div>
                )}

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
                <div
                  className="livebadge"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    background: isDark
                      ? "rgba(52,211,153,0.08)"
                      : "rgba(22,163,74,0.08)",
                    border: isDark
                      ? "1px solid rgba(52,211,153,0.3)"
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
            </div>
          </div>

          {/* ═══ 8 STAT CARDS ═══ */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(185px,1fr))",
              gap: 14,
              marginBottom: 20,
            }}
          >
            {stats.map((s, i) => (
              <StatCard
                key={i}
                stat={s}
                index={i}
                navigate={navigate}
                t={t}
                subLoading={loading || (s.live && doubtsLoading)}
              />
            ))}
          </div>

          {/* ═══ RECENT CONTENT ROW ═══ */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
              gap: 14,
              marginBottom: 14,
            }}
          >
            <RecentPanel
              title="Recent Videos"
              color="#f43f5e"
              items={recentVideos}
              loading={loading}
              emptyIcon={Video}
              emptyText="No videos uploaded yet"
              viewRoute="/trainer/recorded-classes"
              navigate={navigate}
              t={t}
              renderItem={(v, i) => (
                <RecentRow
                  key={i}
                  color="#f43f5e"
                  Icon={Video}
                  title={v.title || v.fileName || "Untitled"}
                  sub={fmt(v.uploadedAt || v.createdAt)}
                  t={t}
                />
              )}
            />

            <RecentPanel
              title="Recent Files"
              color="#2dd4bf"
              items={recentFiles}
              loading={loading}
              emptyIcon={FileText}
              emptyText="No files uploaded yet"
              viewRoute="/trainer/content-management"
              navigate={navigate}
              t={t}
              renderItem={(f, i) => (
                <RecentRow
                  key={i}
                  color="#2dd4bf"
                  Icon={FileText}
                  title={
                    f.title || f.fileName || f.originalFileName || "Untitled"
                  }
                  sub={fmt(f.uploadedAt || f.createdAt)}
                  t={t}
                />
              )}
            />

            <RecentPanel
              title="Recent Assignments"
              color="#f59e0b"
              items={recentAssignments}
              loading={loading}
              emptyIcon={ClipboardList}
              emptyText="No assignments created yet"
              viewRoute="/trainer/assignments"
              navigate={navigate}
              t={t}
              renderItem={(a, i) => (
                <RecentRow
                  key={i}
                  color="#f59e0b"
                  Icon={ClipboardList}
                  title={a.title || a.assignmentName || "Untitled"}
                  sub={a.dueDate ? `Due ${fmt(a.dueDate)}` : fmt(a.createdAt)}
                  badge={a.dueDate && new Date(a.dueDate) < new Date()}
                  t={t}
                />
              )}
            />
          </div>

          {/* ═══ BOTTOM ROW ═══ */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 290px",
              gap: 14,
              marginBottom: 14,
            }}
          >
            {/* Student Progress */}
            <div style={card} className="dfade">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 20,
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
                      background: "rgba(34,211,238,0.1)",
                      border: "1px solid rgba(34,211,238,0.2)",
                    }}
                  >
                    <Users size={15} color="#22d3ee" />
                  </div>
                  <span
                    style={{
                      fontFamily: "'Poppins',sans-serif",
                      fontWeight: 700,
                      fontSize: 13,
                      color: t.text,
                    }}
                  >
                    Student Progress
                  </span>
                </div>
                <span style={pill}>This week</span>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "28px 0",
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
                  <BarChart3 size={20} color={t.emptyIcon} />
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
                  Progress tracking coming soon
                </p>
                <button
                  onClick={() => navigate("/trainer/student-reports")}
                  style={{
                    padding: "6px 18px",
                    borderRadius: 8,
                    border: "1px solid rgba(34,211,238,0.25)",
                    background: "rgba(34,211,238,0.08)",
                    color: "#0891b2",
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "'Poppins',sans-serif",
                  }}
                >
                  View Reports →
                </button>
              </div>
            </div>

            {/* Today's Schedule */}
            <div style={card} className="dfade">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 20,
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
                    <Clock size={15} color="#a78bfa" />
                  </div>
                  <span
                    style={{
                      fontFamily: "'Poppins',sans-serif",
                      fontWeight: 700,
                      fontSize: 13,
                      color: t.text,
                    }}
                  >
                    Today's Schedule
                  </span>
                </div>
                <span style={pill}>Today</span>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "28px 0",
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
                  <Clock size={20} color={t.emptyIcon} />
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
                  No upcoming sessions
                </p>
                <button
                  onClick={() => navigate("/trainer/batches")}
                  style={{
                    padding: "6px 18px",
                    borderRadius: 8,
                    border: "1px solid rgba(167,139,250,0.25)",
                    background: "rgba(167,139,250,0.08)",
                    color: "#7c3aed",
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "'Poppins',sans-serif",
                  }}
                >
                  Manage Batches →
                </button>
              </div>
            </div>

            {/* Calendar */}
            <MiniCalendar t={t} />
          </div>

          {/* ═══ QUICK ACTIONS ═══ */}
          <div
            style={{
              ...card,
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 10,
            }}
            className="dfade"
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginRight: 10,
              }}
            >
              <Zap size={14} color={t.textLabel} />
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: t.textLabel,
                  fontFamily: "'Poppins',sans-serif",
                }}
              >
                Quick Actions
              </span>
            </div>
            {quickActions.map((a, i) => (
              <QuickAction key={i} {...a} navigate={navigate} t={t} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
