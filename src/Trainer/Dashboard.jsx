import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import {
  Users,
  BookOpen,
  MessageCircleQuestion,
  FileCheck,
  Clock,
  GraduationCap,
  Activity,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Video,
  FileText,
  ClipboardList,
  BarChart3,
} from "lucide-react";

// ─── Services (unchanged) ───────────────────────────────────────────────────
import { getTrainerDashboard } from "../services/batchService";
import {
  getTrainerQuizzes,
  getTrainerAssignments,
} from "../services/assessmentService";
import videoService from "../services/videoService";
import fileService from "../services/fileService";
import { courseService } from "../services/courseService";
import { getTrainerStudents, getConversation } from "../services/chatService";

// ─── Global Design System — single source of truth for colors, type,
// spacing, radius, StatCard, PageContainer and Hero. This page must not
// redeclare tokens or components that already live there. Hero typography
// now pulls FONT_SIZE / LINE_HEIGHT / LETTER_SPACING the same way the
// Attendance page (Golden Reference) does, instead of hardcoded
// clamp()/px values, so every page's Hero renders from one type scale.
import {
  T,
  FONT_FAMILY,
  FONT_WEIGHT,
  FONT_SIZE,
  LINE_HEIGHT,
  LETTER_SPACING,
  RADIUS,
  CARD_PADDING,
  ACCENT_PURPLE,
  PageContainer,
  Hero,
  StatCard,
} from "@/design-system";

// Shared, real-time greeting + clock strip — same component used by the
// Student and Admin dashboards, so all three stay perfectly in sync.
import DashboardGreeting from "@/components/DashboardGreeting";

/* ─────────────────────────────────────────────────────────────────────────────
   PENDING DOUBTS CALCULATOR (unchanged business logic)
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

/* ─── mini calendar — page-local (no design-system equivalent yet) ─── */
function MiniCalendar({ t }) {
  const today = new Date();
  const [current, setCurrent] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
  });
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
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
        borderRadius: RADIUS.standardCard,
        padding: CARD_PADDING.standardCard,
        height: "100%",
        boxSizing: "border-box",
        boxShadow: t.shadow,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: RADIUS.chip, display: "flex", alignItems: "center", justifyContent: "center", background: t.iconBg, border: `1px solid ${t.iconBorder}` }}>
            <CalendarDays size={16} color={t.text} />
          </div>
          <span style={{ fontFamily: FONT_FAMILY, fontWeight: FONT_WEIGHT.bold, fontSize: 13, color: t.text }}>
            {monthNames[current.month]} {current.year}
          </span>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {[prev, next].map((fn, i) => (
            <button
              key={i}
              onClick={fn}
              style={{ width: 28, height: 28, borderRadius: RADIUS.chip, border: `1px solid ${t.navBtnBorder}`, cursor: "pointer", background: t.navBtnBg, color: t.navBtnColor, display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              {i === 0 ? <ChevronLeft size={13} /> : <ChevronRight size={13} />}
            </button>
          ))}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, marginBottom: 6 }}>
        {dayNames.map((d) => (
          <div key={d} style={{ textAlign: "center", fontSize: 9, fontWeight: 700, color: t.calDayHeader, letterSpacing: "0.06em", paddingBottom: 6, fontFamily: FONT_FAMILY }}>{d}</div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2 }}>
        {cells.map((d, i) => (
          <div
            key={i}
            style={{
              aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center",
              borderRadius: RADIUS.chip, fontSize: 11, fontWeight: isToday(d) ? 700 : 500,
              cursor: d ? "pointer" : "default",
              background: isToday(d) ? t.todayBg : "transparent",
              color: isToday(d) ? t.todayText : d ? t.calDayText : "transparent",
              fontFamily: FONT_FAMILY, transition: "background 0.15s",
            }}
          >
            {d}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16, paddingTop: 12, borderTop: `1px solid ${t.calFooterBdr}`, fontSize: 10, color: t.calFooter, textAlign: "center", fontFamily: FONT_FAMILY, fontWeight: 500, letterSpacing: "0.05em" }}>
        NO SESSIONS SCHEDULED
      </div>
    </div>
  );
}

/* ─── recent panel — page-local (no design-system equivalent yet) ─── */
function RecentPanel({ title, color, items, loading, emptyIcon: EmptyIcon, emptyText, viewRoute, renderItem, navigate, t }) {
  return (
    <div style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: RADIUS.standardCard, padding: CARD_PADDING.standardCard, boxShadow: t.shadow }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: RADIUS.chip, display: "flex", alignItems: "center", justifyContent: "center", background: `${color}18`, border: `1px solid ${color}30` }}>
            <EmptyIcon size={15} color={color} />
          </div>
          <span style={{ fontFamily: FONT_FAMILY, fontWeight: FONT_WEIGHT.bold, fontSize: 13, color: t.text }}>{title}</span>
        </div>
        <button
          onClick={() => navigate(viewRoute)}
          style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", color: t.textMuted, background: t.pillBg, border: `1px solid ${t.pillBorder}`, borderRadius: RADIUS.pill, padding: "4px 12px", cursor: "pointer", fontFamily: FONT_FAMILY }}
        >
          View all
        </button>
      </div>

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ width: 36, height: 36, borderRadius: RADIUS.chip, background: t.barBg, flexShrink: 0 }} />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ height: 10, borderRadius: 5, background: t.barBg, width: "70%" }} />
                <div style={{ height: 8, borderRadius: 4, background: t.barBg, width: "45%" }} />
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "28px 0", gap: 10 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", border: `1.5px dashed ${t.emptyBorder}`, background: t.emptyBg }}>
            <EmptyIcon size={20} color={t.emptyIcon} />
          </div>
          <p style={{ fontSize: 11, color: t.textMuted, fontWeight: 500, fontFamily: FONT_FAMILY, margin: 0 }}>{emptyText}</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {items.map((item, i) => renderItem(item, i))}
        </div>
      )}
    </div>
  );
}

/* ─── recent item row helper ─── */
function RecentRow({ color, Icon: Ic, title, sub, badge, t }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: RADIUS.chip, background: hov ? t.recentItemBgHov : t.recentItemBg, border: `1px solid ${hov ? t.recentItemBorder : "transparent"}`, transition: "all 0.15s", cursor: "default" }}
    >
      <div style={{ width: 34, height: 34, borderRadius: RADIUS.chip, display: "flex", alignItems: "center", justifyContent: "center", background: `${color}18`, border: `1px solid ${color}30`, flexShrink: 0 }}>
        <Ic size={15} color={color} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: t.text, margin: 0, fontFamily: FONT_FAMILY, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{title}</p>
        <p style={{ fontSize: 10, color: t.textMuted, margin: "2px 0 0", fontFamily: FONT_FAMILY }}>{sub}</p>
      </div>
      {badge && (
        <span style={{ fontSize: 9, fontWeight: 700, color: t.overdueText, background: t.overdueBg, border: `1px solid ${t.overdueBorder}`, padding: "2px 7px", borderRadius: RADIUS.pill, flexShrink: 0, fontFamily: FONT_FAMILY }}>
          Overdue
        </span>
      )}
    </div>
  );
}

/* ══ MAIN ══ */
const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [, setSearchParams] = useSearchParams();

  // Jab yeh component /ilm-demo ke andar embed hokar render ho raha ho
  // (IlmOraDemoPage se), tab card click par real route pe navigate() karne
  // se poora /ilm-demo shell chhoot jaata — isliye wahan sirf ?section=
  // update karo (sidebar ka goToSection() jo karta hai wahi). Baaki har
  // jagah (real /trainer/dashboard route par) normal navigate() hi chalta hai.
  //
  // NOTE: `tab` (optional) — jab kisi stat card ko target page ke andar
  // ek specific tab par bhi khulna ho (e.g. Upload Videos page ke andar
  // "Upload Video" / "Upload Document" / "Create Assignment" tabs), tab
  // yeh ?tab= query param bhi set/forward karta hai. Target page ko is
  // param ko read karke apna initial active-tab decide karna hoga.
  const goTo = (route, tab) => {
    if (location.pathname === "/ilm-demo") {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set("section", route);
          if (tab) next.set("tab", tab);
          else next.delete("tab");
          return next;
        },
        { replace: false },
      );
    } else {
      navigate(tab ? `${route}?tab=${tab}` : route);
    }
  };

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

  // ── state (unchanged) ────────────────────────────────────────────────────
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

  // ── load (unchanged) ─────────────────────────────────────────────────────
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

  // ── stat cards — rendered through the shared design-system <StatCard>,
  // colorKey drawn from STAT_COLORS (blue/green/orange/purple/red only).
  // `change` mirrors the Golden Reference pattern of restating the count
  // in plain language under the label. Route (+ optional `tab`) is
  // preserved via the click wrapper below — StatCard itself stays a pure,
  // reusable presentational component (same as Attendance page's usage).
  //
  // ROUTING UPDATES (navigation-only, no business-logic change):
  //   - "Assignments"      -> /trainer/upload-videos  (tab: "assignment")
  //   - "Videos Uploaded"  -> /trainer/upload-videos  (tab: "video")
  //   - "Files Uploaded"   -> /trainer/upload-videos  (tab: "document")
  //   - "Courses Created"  -> /trainer/course-management
  //   - "Tests Created"    -> renamed to "Live Dashboard" -> /trainer/live
  const stats = [
    {
      label: "Active Batches",
      numericValue: counts.batches,
      change: `${counts.batches} running`,
      icon: BookOpen,
      colorKey: "blue",
      route: "/trainer/batches",
    },
    {
      label: "Total Students",
      numericValue: counts.students,
      change: `${counts.students} enrolled`,
      icon: GraduationCap,
      colorKey: "green",
      route: "/trainer/student-reports",
    },
    {
      label: "Live Dashboard",
      numericValue: counts.quizzes,
      change: `${counts.quizzes} total`,
      icon: FileCheck,
      colorKey: "purple",
      route: "/trainer/live",
    },
    {
      label: "Assignments",
      numericValue: counts.assignments,
      change: `${counts.assignments} total`,
      icon: ClipboardList,
      colorKey: "orange",
      route: "/trainer/upload-videos",
      tab: "assignment",
    },
    {
      label: "Videos Uploaded",
      numericValue: counts.videos,
      change: `${counts.videos} total`,
      icon: Video,
      colorKey: "red",
      route: "/trainer/upload-videos",
      tab: "video",
    },
    {
      label: "Files Uploaded",
      numericValue: counts.files,
      change: `${counts.files} total`,
      icon: FileText,
      colorKey: "blue",
      route: "/trainer/upload-videos",
      tab: "document",
    },
    {
      label: "Courses Created",
      numericValue: counts.courses,
      change: `${counts.courses} total`,
      icon: Users,
      colorKey: "purple",
      route: "/trainer/course-management",
    },
    {
      label: "Pending Doubts",
      numericValue: counts.doubts,
      change: doubtsLoading
        ? "Checking…"
        : counts.doubts > 0
          ? `${counts.doubts} unanswered`
          : "All clear",
      icon: MessageCircleQuestion,
      colorKey: "orange",
      route: "/trainer/doubts-management",
      live: true,
    },
  ];

  const card = {
    background: t.cardBg,
    border: `1px solid ${t.border}`,
    borderRadius: RADIUS.standardCard,
    padding: CARD_PADDING.standardCard,
    boxShadow: t.shadow,
  };
  const pill = {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    padding: "4px 10px",
    borderRadius: RADIUS.pill,
    background: t.pillBg,
    border: `1px solid ${t.pillBorder}`,
    color: t.pillText,
    fontFamily: FONT_FAMILY,
  };

  return (
    <PageContainer mode={isDark ? "dark" : "light"} pageBg={t.pageBg} textColor={t.text}>
      {/* ═══ HERO — shared <Hero> component. Eyebrow / title / subtitle now
          use FONT_SIZE / FONT_WEIGHT / LINE_HEIGHT / LETTER_SPACING tokens
          — the same set the Attendance page (Golden Reference) reads from
          — instead of hardcoded clamp()/px values, so this page's Hero
          renders at identical type sizes, weights, and tracking. ═══ */}
      <Hero borderHero={t.borderHero}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: ACCENT_PURPLE.base }} className="d1" />
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
              Trainer Portal
            </span>
          </div>
          <DashboardGreeting t={t} />
          <p
            style={{
              fontSize: FONT_SIZE.bodySmall,
              color: t.textSub,
              margin: 0,
              fontWeight: FONT_WEIGHT.medium,
              fontFamily: FONT_FAMILY,
            }}
          >
            All your content &amp; student activity at a glance
          </p>
        </div>

        <div className="hero-badges">
          {!loading && (
            <div
              style={{
                display: "flex", alignItems: "center", gap: 12,
                background: t.actBg, border: `1px solid ${t.actBorder}`,
                borderRadius: 12, padding: "8px 16px",
                fontSize: 11, fontWeight: 600, fontFamily: FONT_FAMILY, color: t.textSub,
              }}
            >
              <span>{counts.batches} batch{counts.batches !== 1 ? "es" : ""}</span>
              <span style={{ width: 1, height: 14, background: t.actBorder }} />
              <span>{counts.students} student{counts.students !== 1 ? "s" : ""}</span>
              <span style={{ width: 1, height: 14, background: t.actBorder }} />
              {doubtsLoading ? (
                <span style={{ opacity: 0.5 }}>checking doubts…</span>
              ) : counts.doubts > 0 ? (
                <span style={{ display: "flex", alignItems: "center", gap: 5, color: "#fb923c", fontWeight: 700 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fb923c", display: "inline-block" }} />
                  {counts.doubts} unanswered
                </span>
              ) : (
                <span style={{ color: t.liveText }}>No pending doubts ✓</span>
              )}
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 8, background: t.actBg, border: `1px solid ${t.actBorder}`, borderRadius: 10, padding: "8px 12px" }}>
            <Activity size={12} color={t.actIcon} />
            <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 14 }}>
              <span className="d1" style={{ width: 3, height: 10, borderRadius: 2, background: t.actBar, display: "block" }} />
              <span className="d2" style={{ width: 3, height: 14, borderRadius: 2, background: t.actBar, display: "block" }} />
              <span className="d3" style={{ width: 3, height: 7, borderRadius: 2, background: t.actBar, display: "block" }} />
            </div>
          </div>

          <div
            className="livebadge"
            style={{
              display: "flex", alignItems: "center", gap: 7,
              background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.3)",
              borderRadius: RADIUS.pill, padding: "8px 18px", color: ACCENT_PURPLE.base,
              fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", fontFamily: FONT_FAMILY,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: ACCENT_PURPLE.base, display: "inline-block" }} />
            LIVE
          </div>
        </div>
      </Hero>

      {/* ═══ 8 STAT CARDS — shared <StatCard>, laid out via the shared
          .stat-grid (fixed 4 columns, fully responsive at every breakpoint
          down to 380px — same class the Attendance page uses). Click-through
          to each management page (+ optional tab) is preserved via a thin
          wrapper; StatCard itself stays the same reusable presentational
          component. ═══ */}
      <div className="stat-grid" style={{ marginBottom: 20 }}>
        {stats.map((s, i) => (
          <div
            key={i}
            onClick={() => goTo(s.route, s.tab)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && goTo(s.route, s.tab)}
            style={{ cursor: "pointer" }}
          >
            <StatCard stat={s} index={i} loading={loading || (s.live && doubtsLoading)} />
          </div>
        ))}
      </div>

      {/* ═══ RECENT CONTENT ROW — reuses the shared auto-fit .courses-grid
          so 3 cards reflow responsively without a page-local grid
          definition. ═══ */}
      <div className="courses-grid" style={{ marginBottom: 14 }}>
        <RecentPanel
          title="Recent Videos"
          color="#f43f5e"
          items={recentVideos}
          loading={loading}
          emptyIcon={Video}
          emptyText="No videos uploaded yet"
          viewRoute="/trainer/recorded-classes"
          navigate={goTo}
          t={t}
          renderItem={(v, i) => (
            <RecentRow key={i} color="#f43f5e" Icon={Video} title={v.title || v.fileName || "Untitled"} sub={fmt(v.uploadedAt || v.createdAt)} t={t} />
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
            <RecentRow key={i} color="#2dd4bf" Icon={FileText} title={f.title || f.fileName || f.originalFileName || "Untitled"} sub={fmt(f.uploadedAt || f.createdAt)} t={t} />
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

      {/* ═══ BOTTOM ROW — shared .dash-row-grid (1fr 1fr 290px). ═══ */}
      <div className="dash-row-grid" style={{ marginBottom: 14 }}>
        {/* Student Progress */}
        <div style={card} className="dfade">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: RADIUS.chip, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.2)" }}>
                <Users size={15} color="#22d3ee" />
              </div>
              <span style={{ fontFamily: FONT_FAMILY, fontWeight: FONT_WEIGHT.bold, fontSize: 13, color: t.text }}>Student Progress</span>
            </div>
            <span style={pill}>This week</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "28px 0", gap: 12 }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", border: `1.5px dashed ${t.emptyBorder}`, background: t.emptyBg }}>
              <BarChart3 size={20} color={t.emptyIcon} />
            </div>
            <p style={{ fontSize: 12, color: t.textMuted, fontWeight: 500, fontFamily: FONT_FAMILY, margin: 0 }}>Progress tracking coming soon</p>
            <button
              onClick={() => goTo("/trainer/student-reports")}
              style={{ padding: "6px 18px", borderRadius: RADIUS.button, border: "1px solid rgba(34,211,238,0.25)", background: "rgba(34,211,238,0.08)", color: "#0891b2", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: FONT_FAMILY }}
            >
              View Reports →
            </button>
          </div>
        </div>

        {/* Today's Schedule */}
        <div style={card} className="dfade">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: RADIUS.chip, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.2)" }}>
                <Clock size={15} color="#a78bfa" />
              </div>
              <span style={{ fontFamily: FONT_FAMILY, fontWeight: FONT_WEIGHT.bold, fontSize: 13, color: t.text }}>Today's Schedule</span>
            </div>
            <span style={pill}>Today</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "28px 0", gap: 12 }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", border: `1.5px dashed ${t.emptyBorder}`, background: t.emptyBg }}>
              <Clock size={20} color={t.emptyIcon} />
            </div>
            <p style={{ fontSize: 12, color: t.textMuted, fontWeight: 500, fontFamily: FONT_FAMILY, margin: 0 }}>No upcoming sessions</p>
            <button
              onClick={() => goTo("/trainer/batches")}
              style={{ padding: "6px 18px", borderRadius: RADIUS.button, border: "1px solid rgba(167,139,250,0.25)", background: "rgba(167,139,250,0.08)", color: "#7c3aed", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: FONT_FAMILY }}
            >
              Manage Batches →
            </button>
          </div>
        </div>

        {/* Calendar */}
        <MiniCalendar t={t} />
      </div>
    </PageContainer>
  );
};

export default Dashboard;




































