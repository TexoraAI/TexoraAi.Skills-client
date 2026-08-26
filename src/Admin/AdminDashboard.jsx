import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  BookOpen,
  Clock,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  BarChart3,
  Calendar,
  Activity,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  GraduationCap,
  ShieldCheck,
  UserCheck,
  Layers,
} from "lucide-react";

// ─── Global Design System — single source of truth for colors, type,
// spacing, radius, StatCard, PageContainer and Hero. This page must not
// redeclare tokens or components that already live there (see
// Attendance.jsx, the Golden Reference, which this page now visually
// matches).
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
import { useTheme } from "../SuperAdmin/context/ThemeContext";

// Shared, real-time greeting + clock strip — same component used by the
// Student and Trainer dashboards, so all three stay perfectly in sync.
import DashboardGreeting from "@/components/DashboardGreeting";

/* ─────────────────────────────────────────────────────────────────────────
   Page-local layout helpers only — no color/spacing/radius values are
   invented here, everything is sourced from the theme token object (t)
   or the shared FONT_FAMILY / FONT_WEIGHT / RADIUS / CARD_PADDING tokens,
   exactly the same way Attendance.jsx's SectionCard / SectionHeader /
   ListRow / EmptyBlock are page-local but token-driven.
───────────────────────────────────────────────────────────────────────── */



function IconBadge({ icon: Icon, color, size = 34, iconSize = 15 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: RADIUS.chip,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `${color}18`,
        border: `1px solid ${color}30`,
        flexShrink: 0,
      }}
    >
      <Icon size={iconSize} color={color} />
    </div>
  );
}

function SectionCard({ t, children, style }) {
  return (
    <div
      style={{
        background: t.cardBg,
        border: `1px solid ${t.border}`,
        borderRadius: RADIUS.standardCard,
        padding: CARD_PADDING.standardCard,
        boxShadow: t.shadow,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function SectionHeader({ t, icon: Icon, color, title, sub, right }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
        flexWrap: "wrap",
        gap: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <IconBadge icon={Icon} color={color} />
        <div>
          <div
            style={{
              fontFamily: FONT_FAMILY,
              fontWeight: FONT_WEIGHT.bold,
              fontSize: 13,
              color: t.text,
            }}
          >
            {title}
          </div>
          {sub && (
            <div
              style={{
                fontSize: 11,
                color: t.textMuted,
                fontFamily: FONT_FAMILY,
                marginTop: 2,
              }}
            >
              {sub}
            </div>
          )}
        </div>
      </div>
      {right}
    </div>
  );
}

function EmptyBlock({ t, icon: Icon, title }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "28px 0",
        gap: 12,
        textAlign: "center",
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
        <Icon size={20} color={t.emptyIcon} />
      </div>
      <p
        style={{
          fontSize: 13,
          color: t.textMuted,
          fontWeight: FONT_WEIGHT.bold,
          fontFamily: FONT_FAMILY,
          margin: 0,
        }}
      >
        {title}
      </p>
    </div>
  );
}

function ViewAllButton({ t, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontSize: 11,
        fontWeight: FONT_WEIGHT.bold,
        letterSpacing: LETTER_SPACING.eyebrow,
        color: t.textMuted,
        background: t.pillBg,
        border: `1px solid ${t.pillBorder}`,
        borderRadius: RADIUS.pill,
        padding: "5px 14px",
        cursor: "pointer",
        fontFamily: FONT_FAMILY,
      }}
    >
      View all
    </button>
  );
}

function RecentRow({ t, color, Icon, title, sub, badge }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 12px",
        borderRadius: RADIUS.chip,
        background: t.recentItemBg,
        border: `1px solid ${t.recentItemBorder}`,
      }}
    >
      <IconBadge icon={Icon} color={color} size={30} iconSize={14} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize: 13,
            fontWeight: FONT_WEIGHT.semibold,
            color: t.text,
            margin: 0,
            fontFamily: FONT_FAMILY,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </p>
        <p style={{ fontSize: 11, color: t.textMuted, margin: "2px 0 0", fontFamily: FONT_FAMILY }}>{sub}</p>
      </div>
      {badge && (
        <span
          style={{
            fontSize: 11,
            fontWeight: FONT_WEIGHT.bold,
            color: t.overdueText,
            background: t.overdueBg,
            border: `1px solid ${t.overdueBorder}`,
            padding: "3px 9px",
            borderRadius: RADIUS.pill,
            flexShrink: 0,
            fontFamily: FONT_FAMILY,
          }}
        >
          Pending
        </span>
      )}
    </div>
  );
}

function RecentPanel({ t, title, color, icon, items, loading, emptyText, viewRoute, navigate, renderItem }) {
  return (
    <SectionCard t={t}>
      <SectionHeader
        t={t}
        icon={icon}
        color={color}
        title={title}
        right={<ViewAllButton t={t} onClick={() => navigate(viewRoute)} />}
      />
      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ width: 30, height: 30, borderRadius: RADIUS.chip, background: t.barBg, flexShrink: 0 }} />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ height: 10, borderRadius: 5, background: t.barBg, width: "70%" }} />
                <div style={{ height: 8, borderRadius: 4, background: t.barBg, width: "45%" }} />
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyBlock t={t} icon={icon} title={emptyText} />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {items.map((item, i) => renderItem(item, i))}
        </div>
      )}
    </SectionCard>
  );
}

/* ─── mini calendar — same behavior as before, restyled with tokens ─── */
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
    <SectionCard t={t} style={{ height: "100%", boxSizing: "border-box" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <IconBadge icon={CalendarDays} color={ACCENT_PURPLE.base} />
          <span style={{ fontFamily: FONT_FAMILY, fontWeight: FONT_WEIGHT.bold, fontSize: 13, color: t.text }}>
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
                borderRadius: RADIUS.chip,
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
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, marginBottom: 6 }}>
        {dayNames.map((d) => (
          <div
            key={d}
            style={{
              textAlign: "center",
              fontSize: 11,
              fontWeight: FONT_WEIGHT.bold,
              color: t.calDayHeader,
              letterSpacing: LETTER_SPACING.eyebrow,
              paddingBottom: 6,
              fontFamily: FONT_FAMILY,
            }}
          >
            {d}
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2 }}>
        {cells.map((d, i) => (
          <div
            key={i}
            style={{
              aspectRatio: "1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: RADIUS.chip,
              fontSize: 12,
              fontWeight: isToday(d) ? FONT_WEIGHT.bold : FONT_WEIGHT.medium,
              cursor: d ? "pointer" : "default",
              background: isToday(d) ? ACCENT_PURPLE.base : "transparent",
              color: isToday(d) ? "#ffffff" : d ? t.calDayText : "transparent",
              fontFamily: FONT_FAMILY,
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
          fontSize: 11,
          color: t.calFooter,
          textAlign: "center",
          fontFamily: FONT_FAMILY,
          fontWeight: FONT_WEIGHT.bold,
          letterSpacing: LETTER_SPACING.eyebrow,
        }}
      >
        NO EVENTS SCHEDULED
      </div>
    </SectionCard>
  );
}

/* ══ MAIN ══ */
const AdminDashboard = () => {
  const navigate = useNavigate();

  /* ─────────────────────────────────────────────────────────
     THEME DETECTION — FIXED
     App.jsx only ever toggles the "dark" class on <html>:
        classList.toggle("dark", theme === "dark")
     It NEVER adds a "light" class. So the old code, which
     fell back to `return true` (dark) whenever neither "dark"
     nor "light" was found, meant Light Mode (which just
     REMOVES the "dark" class) always fell through to the
     dark-default and the dashboard stayed dark.

     Fix: treat "dark" class as the single source of truth.
     No class => light. No confusing fallback needed.
     ───────────────────────────────────────────────────────── */
    const { dark } = useTheme();

  const t = dark ? T.dark : T.light;

  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    totalUsers: 0,
    activeCourses: 0,
    pendingApprovals: 0,
    revenue: 0,
    trainers: 0,
    students: 0,
    batches: 0,
    admins: 0,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentCourses, setRecentCourses] = useState([]);
  const [recentApprovals, setRecentApprovals] = useState([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        setCounts({
          totalUsers: 0,
          activeCourses: 0,
          pendingApprovals: 0,
          revenue: 0,
          trainers: 0,
          students: 0,
          batches: 0,
          admins: 0,
        });
        setRecentUsers([]);
        setRecentCourses([]);
        setRecentApprovals([]);
      } catch (e) {
        console.error("Admin dashboard load failed:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const fmt = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString(undefined, { day: "numeric", month: "short" });
  };

  // ── stat cards — rendered through the shared design-system <StatCard>,
  // colorKey drawn from the same blue/green/amber/red/purple set the
  // Trainer/Attendance page uses, so this page inherits identical
  // stat-card visuals instead of the page's old bespoke gradient tiles.
  const stats = [
    { label: "Total Users", numericValue: counts.totalUsers, icon: Users, colorKey: "blue", route: "/admin/users", change: "All registered accounts" },
    { label: "Active Courses", numericValue: counts.activeCourses, icon: BookOpen, colorKey: "green", route: "/admin/courses", change: "Currently running" },
    { label: "Pending Approvals", numericValue: counts.pendingApprovals, icon: Clock, colorKey: "amber", route: "/admin/approvals", change: "Awaiting review" },
    { label: "Revenue (MTD)", numericValue: counts.revenue, icon: DollarSign, colorKey: "purple", route: "/admin/revenue", change: "This month, in USD" },
    { label: "Total Trainers", numericValue: counts.trainers, icon: UserCheck, colorKey: "red", route: "/admin/trainers", change: "Active on platform" },
    { label: "Total Students", numericValue: counts.students, icon: GraduationCap, colorKey: "blue", route: "/admin/students", change: "Enrolled learners" },
    { label: "Active Batches", numericValue: counts.batches, icon: Layers, colorKey: "amber", route: "/admin/batches", change: "Running now" },
    { label: "Admins", numericValue: counts.admins, icon: ShieldCheck, colorKey: "purple", route: "/admin/admins", change: "Platform administrators" },
  ];

  const keyReports = [
    { title: "User Growth", value: "0%", icon: TrendingUp, color: "#22d3ee" },
    { title: "Revenue Trend", value: "$0K", icon: DollarSign, color: ACCENT_PURPLE.base },
    { title: "Course Performance", value: "0%", icon: BookOpen, color: "#16a34a" },
    { title: "Active Sessions", value: "0", icon: Calendar, color: "#f59e0b" },
  ];

  const pill = {
    fontSize: 11,
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: LETTER_SPACING.eyebrowWide,
    textTransform: "uppercase",
    padding: "4px 10px",
    borderRadius: RADIUS.pill,
    background: t.pillBg,
    border: `1px solid ${t.pillBorder}`,
    color: t.pillText,
    fontFamily: FONT_FAMILY,
  };

  return (
    <PageContainer mode={dark ? "dark" : "light"} pageBg={t.pageBg} textColor={t.text}>
      <style>{`
        @media (max-width:560px){
          .admin-hero-badges{width:100%;}
        }
      `}</style>

      {/* ═══ HERO — shared <Hero> component, matches Attendance/Trainer Dashboard exactly ═══ */}
      <Hero borderHero={t.borderHero}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: ACCENT_PURPLE.base }} />
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
              Platform Overview
            </span>
          </div>
          <DashboardGreeting t={t} />
          <p style={{ fontSize: FONT_SIZE.bodySmall, color: t.textSub, margin: 0, fontWeight: FONT_WEIGHT.medium, fontFamily: FONT_FAMILY }}>
            Manage users, courses &amp; platform performance at a glance
          </p>
        </div>

        <div className="hero-badges admin-hero-badges">
          {!loading && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                background: t.actBg,
                border: `1px solid ${t.actBorder}`,
                borderRadius: RADIUS.chip,
                padding: "8px 16px",
                fontSize: 11,
                fontWeight: FONT_WEIGHT.semibold,
                fontFamily: FONT_FAMILY,
                color: t.textSub,
                flexWrap: "wrap",
              }}
            >
              <span>{counts.totalUsers} users</span>
              <span style={{ width: 1, height: 14, background: t.actBorder }} />
              <span>{counts.activeCourses} courses</span>
              <span style={{ width: 1, height: 14, background: t.actBorder }} />
              {counts.pendingApprovals > 0 ? (
                <span style={{ display: "flex", alignItems: "center", gap: 5, color: "#fb923c" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fb923c", display: "inline-block" }} />
                  {counts.pendingApprovals} pending
                </span>
              ) : (
                <span style={{ color: t.liveText }}>All clear ✓</span>
              )}
            </div>
          )}

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
              letterSpacing: LETTER_SPACING.eyebrowWide,
              fontFamily: FONT_FAMILY,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: ACCENT_PURPLE.base, display: "inline-block" }} />
            LIVE
          </div>
        </div>
      </Hero>

      {/* ═══ 8 STAT CARDS — shared <StatCard>, via the shared .stat-grid class ═══ */}
      <div className="stat-grid" style={{ marginBottom: 20 }}>
        {stats.map((s, i) => (
          <div key={i} onClick={() => navigate(s.route)} style={{ cursor: "pointer" }}>
            <StatCard stat={s} index={i} loading={loading} mode={dark ? "dark" : "light"} />
          </div>
        ))}
      </div>

      {/* ═══ RECENT PANELS ROW ═══ */}
      <div className="dash-row-grid" style={{ marginBottom: 14 }}>
        <RecentPanel
          t={t}
          title="Recent Users"
          color="#3b82f6"
          icon={Users}
          items={recentUsers}
          loading={loading}
          emptyText="No users registered yet"
          viewRoute="/admin/users"
          navigate={navigate}
          renderItem={(u, i) => (
            <RecentRow
              key={i}
              t={t}
              color="#3b82f6"
              Icon={Users}
              title={u.name || u.email || "Unknown User"}
              sub={u.role || fmt(u.createdAt)}
            />
          )}
        />

        <RecentPanel
          t={t}
          title="Recent Courses"
          color="#16a34a"
          icon={BookOpen}
          items={recentCourses}
          loading={loading}
          emptyText="No courses created yet"
          viewRoute="/admin/courses"
          navigate={navigate}
          renderItem={(c, i) => (
            <RecentRow
              key={i}
              t={t}
              color="#16a34a"
              Icon={BookOpen}
              title={c.title || c.courseName || "Untitled"}
              sub={fmt(c.createdAt)}
            />
          )}
        />

        <RecentPanel
          t={t}
          title="Pending Approvals"
          color="#f59e0b"
          icon={Clock}
          items={recentApprovals}
          loading={loading}
          emptyText="No pending approvals"
          viewRoute="/admin/approvals"
          navigate={navigate}
          renderItem={(a, i) => (
            <RecentRow
              key={i}
              t={t}
              color="#f59e0b"
              Icon={Clock}
              title={a.name || a.title || "Approval Request"}
              sub={fmt(a.createdAt)}
              badge={true}
            />
          )}
        />
      </div>

      {/* ═══ BOTTOM ROW ═══ */}
      <div className="dash-row-grid">
        {/* Key Reports */}
        <SectionCard t={t}>
          <SectionHeader t={t} icon={BarChart3} color="#22d3ee" title="Key Reports" right={<span style={pill}>Platform</span>} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {keyReports.map((item) => {
              const Ic = item.icon;
              return (
                <div
                  key={item.title}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: 10,
                    borderRadius: RADIUS.chip,
                    background: t.recentItemBg,
                    border: `1px solid ${t.recentItemBorder}`,
                  }}
                >
                  <IconBadge icon={Ic} color={item.color} size={30} iconSize={14} />
                  <div>
                    <p style={{ fontSize: 11, color: t.textMuted, margin: 0, fontFamily: FONT_FAMILY }}>{item.title}</p>
                    <p style={{ fontSize: 13, fontWeight: FONT_WEIGHT.bold, color: t.text, margin: "2px 0 0", fontFamily: FONT_FAMILY }}>{item.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <button
            onClick={() => navigate("/admin/reports")}
            style={{
              marginTop: 14,
              width: "100%",
              padding: "10px",
              borderRadius: RADIUS.button,
              border: `1px solid ${t.border}`,
              background: t.pillBg,
              color: ACCENT_PURPLE.base,
              fontSize: 12,
              fontWeight: FONT_WEIGHT.bold,
              cursor: "pointer",
              fontFamily: FONT_FAMILY,
            }}
          >
            View Full Reports →
          </button>
        </SectionCard>

        {/* Recent Activity */}
        <SectionCard t={t}>
          <SectionHeader t={t} icon={Activity} color={ACCENT_PURPLE.base} title="Recent Activity" right={<span style={pill}>Today</span>} />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "28px 0", gap: 12 }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 15,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: `1.5px dashed ${t.emptyBorder}`,
                background: t.emptyBg,
              }}
            >
              <Activity size={20} color={t.emptyIcon} />
            </div>
            <p style={{ fontSize: 13, color: t.textMuted, fontWeight: FONT_WEIGHT.bold, fontFamily: FONT_FAMILY, margin: 0 }}>No recent activity</p>
            <button
              onClick={() => navigate("/admin/users")}
              style={{
                padding: "8px 18px",
                borderRadius: RADIUS.button,
                border: `1px solid ${t.border}`,
                background: t.pillBg,
                color: ACCENT_PURPLE.base,
                fontSize: 12,
                fontWeight: FONT_WEIGHT.bold,
                cursor: "pointer",
                fontFamily: FONT_FAMILY,
              }}
            >
              Manage Users →
            </button>
          </div>
        </SectionCard>

        {/* Calendar */}
        <MiniCalendar t={t} />
      </div>
    </PageContainer>
  );
};

export default AdminDashboard;