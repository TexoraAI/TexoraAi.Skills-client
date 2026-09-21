import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  CheckCircle,
  TrendingUp,
  Search,
  User,
  GraduationCap,
  PlayCircle,
  FileText,
} from "lucide-react";

import { courseService } from "@/services/courseService";
import { progressService } from "@/services/progressService";

// ── Same Global Design System the Dashboard (Golden Reference) uses.
// Nothing page-specific is redefined here — tokens, StatCard, and
// PageContainer are the single source of truth for every page.
import {
  T,
  StatCard,
  PageContainer,
  FONT_FAMILY,
  FONT_WEIGHT,
  FONT_SIZE,
  LETTER_SPACING,
  LINE_HEIGHT,
} from "@/design-system";

/* ─── JWT helper (identical to Dashboard) ─── */
const getEmailFromToken = () => {
  try {
    const token = localStorage.getItem("lms_token");
    if (!token) return null;
    return JSON.parse(atob(token.split(".")[1])).sub;
  } catch {
    return null;
  }
};

/* ─── Progress helpers (identical to Dashboard's)
   NOTE: these currently live in both Dashboard.jsx and here. Since the
   design system doc calls Dashboard the Golden Reference and says pages
   should share tokens, the next cleanup step should hoist these two
   functions into @/design-system (e.g. design-system/utils/progress.js)
   so there's truly one copy. Left duplicated-but-identical for now so
   this page matches pixel-for-pixel without touching the reference file. ─── */
const getProgressColor = (pct) => {
  if (pct >= 100) return "#34d399";
  if (pct >= 60) return "#a78bfa";
  if (pct >= 30) return "#fb923c";
  return "#94a3b8";
};

const getStatusLabel = (pct, t) => {
  if (pct >= 100)
    return {
      label: "Completed",
      bg: t.statusCompletedBg,
      color: t.statusCompletedText,
    };
  if (pct > 0)
    return {
      label: "In Progress",
      bg: t.statusProgressBg,
      color: t.statusProgressText,
    };
  return {
    label: "Not Started",
    bg: t.statusNotStartedBg,
    color: t.statusNotStartedText,
  };
};

/* ═══════════════════════════════════════════════
   MY COURSES PAGE
   Same shell as Dashboard: PageContainer + hero band + StatCard row +
   the exact course-card grid styling from Dashboard's CoursesTab.
═══════════════════════════════════════════════ */
const MyCourses = () => {
  const navigate = useNavigate();
  const studentEmail = getEmailFromToken();

  const [search, setSearch] = useState("");
  const [courses, setCourses] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [lockedCount, setLockedCount] = useState(0);
  const [planSummary, setPlanSummary] = useState(null);

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
    if (!studentEmail) {
      setLoading(false);
      return;
    }
    const load = async () => {
      try {
        const coursesRes = await courseService.getStudentCourses();
        const courseList = coursesRes?.data ?? [];
        setCourses(courseList);

        const entries = await Promise.all(
          courseList.map(async (c) => {
            try {
              const res = await progressService.getProgress(studentEmail, c.id);
              return [c.id, res.data];
            } catch {
              return [c.id, null];
            }
          }),
        );
        setProgressMap(Object.fromEntries(entries));
      } catch (err) {
        console.error("My Courses load error:", err);
      } finally {
        setLoading(false);
      }
    };
    load();

    courseService
      .getStudentCourseCount()
      .then((res) => {
        const { totalCount = 0, visibleCount = 0 } = res.data || {};
        setLockedCount(Math.max(0, totalCount - visibleCount));
      })
      .catch(() => setLockedCount(0));

    courseService
      .getStudentPlanSummary()
      .then((res) => setPlanSummary(res.data))
      .catch(() => setPlanSummary(null));
  }, [studentEmail]);

  const filtered = courses.filter((c) =>
    c.title?.toLowerCase().includes(search.toLowerCase()),
  );

  const totalCourses = courses.length;
  const completedCourses = courses.filter((c) => {
    const p = progressMap[c.id];
    return p && p.progressPercentage >= 100;
  }).length;
  const inProgressCourses = courses.filter((c) => {
    const p = progressMap[c.id];
    return p && p.progressPercentage > 0 && p.progressPercentage < 100;
  }).length;

  const stats = [
    {
      label: "Enrolled Courses",
      numericValue: totalCourses,
      change: `${totalCourses} total`,
      trend: "up",
      icon: BookOpen,
      colorKey: "blue",
    },
    {
      label: "In Progress",
      numericValue: inProgressCourses,
      change: `${inProgressCourses} active`,
      trend: "up",
      icon: TrendingUp,
      colorKey: "orange",
    },
    {
      label: "Completed",
      numericValue: completedCourses,
      change: `${completedCourses} finished`,
      trend: "up",
      icon: CheckCircle,
      colorKey: "green",
    },
  ];

  return (
    <PageContainer
      mode={isDark ? "dark" : "light"}
      pageBg={t.pageBg}
      textColor={t.text}
    >
      {/* ═══ HERO — same band styling as Dashboard ═══ */}
      <div
        className="dfade"
        style={{
          padding: "8px 0 24px",
          background: "transparent",
          border: "none",
          borderBottom: `1px solid ${t.borderHero}`,
          marginBottom: 20,
          boxShadow: "none",
        }}
      >
        <div className="hero-flex">
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
                  background: "#7c3aed",
                }}
                className="d1"
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
                Student Portal
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
              My Courses
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
              Continue your learning journey and track your progress
            </p>
          </div>

          <div className="hero-badges">
            <div
              className="livebadge"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                background: "rgba(124,58,237,0.08)",
                border: "1px solid rgba(124,58,237,0.3)",
                borderRadius: 999,
                padding: "8px 18px",
                color: "#7c3aed",
                fontSize: 11,
                fontWeight: FONT_WEIGHT.bold,
                letterSpacing: LETTER_SPACING.eyebrowWide,
                fontFamily: FONT_FAMILY,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#7c3aed",
                  display: "inline-block",
                }}
              />
              LIVE
            </div>
          </div>
        </div>
      </div>

      {/* ═══ STAT CARDS — same StatCard component as Dashboard ═══ */}
      <div className="stat-grid" style={{ marginBottom: 20 }}>
        {stats.map((s, i) => (
          <StatCard key={i} stat={s} index={i} loading={loading} />
        ))}
      </div>

      {/* ═══ SEARCH ═══ */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ position: "relative", width: 360, maxWidth: "100%" }}>
          <Search
            size={15}
            color={t.textMuted}
            style={{
              position: "absolute",
              left: 16,
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
            }}
          />
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "13px 16px 13px 46px",
              borderRadius: 14,
              border: `1px solid ${t.border}`,
              background: t.cardBg,
              color: t.text,
              fontFamily: FONT_FAMILY,
              fontSize: 13,
              fontWeight: FONT_WEIGHT.medium,
              outline: "none",
              boxShadow: t.shadow,
              boxSizing: "border-box",
              transition: "border-color 0.2s, box-shadow 0.2s",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#22d3ee";
              e.target.style.boxShadow = "0 0 0 3px rgba(34,211,238,0.12)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = t.border;
              e.target.style.boxShadow = t.shadow;
            }}
          />
        </div>
      </div>

      {/* ═══ COURSE GRID — identical card design to Dashboard's CoursesTab ═══ */}
      {loading ? (
        <div className="courses-grid">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                background: t.cardBg,
                border: `1px solid ${t.border}`,
                borderRadius: 20,
                padding: 22,
                animation: "pulse 1.5s ease-in-out infinite",
              }}
            >
              <div
                style={{
                  height: 4,
                  borderRadius: 99,
                  background: t.barBg,
                  marginBottom: 18,
                }}
              />
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: t.barBg,
                  marginBottom: 14,
                }}
              />
              <div
                style={{
                  height: 12,
                  borderRadius: 6,
                  background: t.barBg,
                  width: "75%",
                  marginBottom: 8,
                }}
              />
              <div
                style={{
                  height: 8,
                  borderRadius: 4,
                  background: t.barBg,
                  marginBottom: 16,
                }}
              />
              <div
                style={{
                  height: 6,
                  borderRadius: 99,
                  background: t.barBg,
                  marginBottom: 16,
                }}
              />
              <div
                style={{ height: 36, borderRadius: 12, background: t.barBg }}
              />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          style={{
            background: t.cardBg,
            border: `1px solid ${t.border}`,
            borderRadius: 20,
            padding: "60px 20px",
            textAlign: "center",
            boxShadow: t.shadow,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              border: `1.5px dashed ${t.emptyBorder}`,
              background: t.emptyBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <BookOpen size={28} color={t.emptyIcon} />
          </div>
          <p
            style={{
              fontSize: 15,
              fontWeight: FONT_WEIGHT.bold,
              color: t.text,
              margin: "0 0 6px",
              fontFamily: FONT_FAMILY,
            }}
          >
            {search ? "No Courses Found" : "No Courses Yet"}
          </p>
          <p
            style={{
              fontSize: FONT_SIZE.bodySmall,
              color: t.textMuted,
              margin: 0,
              fontFamily: FONT_FAMILY,
            }}
          >
            {search
              ? "Try a different search term."
              : "You haven't been enrolled in any courses."}
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <p
            style={{
              fontSize: FONT_SIZE.bodySmall,
              color: t.textMuted,
              margin: 0,
              fontFamily: FONT_FAMILY,
            }}
          >
            Showing <strong style={{ color: t.text }}>{filtered.length}</strong>{" "}
            enrolled course{filtered.length !== 1 ? "s" : ""}
          </p>
          <div className="courses-grid">
            {filtered.map((course) => {
              const prog = progressMap[course.id];
              const pct = prog ? Math.round(prog.progressPercentage) : 0;
              const completed = prog?.completedContentIds?.length ?? 0;
              const total = prog?.totalContentCount ?? 0;
              const status = getStatusLabel(pct, t);
              const color = getProgressColor(pct);

              return (
                <div
                  key={course.id}
                  style={{
                    background: t.courseCardBg,
                    border: `1px solid ${t.border}`,
                    borderRadius: 20,
                    boxShadow: t.shadow,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    transition: "all 0.2s",
                    cursor: "default",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = t.shadowHov;
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = t.shadow;
                    e.currentTarget.style.transform = "none";
                  }}
                >
                  <div
                    style={{ height: 4, background: color, opacity: 0.85 }}
                  />
                  <div
                    style={{
                      padding: "18px 20px 20px",
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: 10,
                        marginBottom: 14,
                      }}
                    >
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 12,
                          background: `${color}18`,
                          border: `1px solid ${color}30`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        {pct >= 100 ? (
                          <CheckCircle size={20} color={color} />
                        ) : (
                          <BookOpen size={20} color={color} />
                        )}
                      </div>
                      <span
                        style={{
                          fontSize: FONT_SIZE.eyebrow,
                          fontWeight: FONT_WEIGHT.bold,
                          letterSpacing: "0.08em",
                          padding: "4px 10px",
                          borderRadius: 999,
                          background: status.bg,
                          color: status.color,
                          fontFamily: FONT_FAMILY,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {status.label}
                      </span>
                    </div>
                    <h3
                      style={{
                        fontSize: 13,
                        fontWeight: FONT_WEIGHT.bold,
                        color: t.text,
                        margin: "0 0 4px",
                        fontFamily: FONT_FAMILY,
                        lineHeight: 1.4,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {course.title}
                    </h3>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        margin: "0 0 14px",
                      }}
                    >
                      <User size={11} color={t.textMuted} />
                      <span
                        style={{
                          fontSize: 11,
                          color: t.textMuted,
                          fontFamily: FONT_FAMILY,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {course.createdBy || "Instructor"}
                      </span>
                    </div>
                    <div style={{ marginTop: "auto" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 6,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 10,
                            color: t.textMuted,
                            fontFamily: FONT_FAMILY,
                          }}
                        >
                          Progress
                        </span>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: FONT_WEIGHT.bold,
                            color: t.text,
                            fontFamily: FONT_FAMILY,
                          }}
                        >
                          {pct}%
                        </span>
                      </div>
                      <div
                        style={{
                          height: 6,
                          background: t.barBg,
                          borderRadius: 99,
                          overflow: "hidden",
                          marginBottom: 10,
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            borderRadius: 99,
                            background: color,
                            width: `${pct}%`,
                            transition: "width 0.7s ease",
                          }}
                        />
                      </div>
                      {total > 0 && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                            fontSize: 10,
                            color: t.textMuted,
                            fontFamily: FONT_FAMILY,
                            marginBottom: 12,
                          }}
                        >
                          <FileText size={11} color={t.textMuted} />
                          {completed} / {total} modules completed
                        </div>
                      )}
                      <button
                        onClick={() => navigate(`/student/course/${course.id}`)}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: 12,
                          background:
                            pct >= 100
                              ? status.bg
                              : "linear-gradient(135deg,#7c3aed,#a855f7)",
                          border: pct >= 100 ? `1px solid ${color}40` : "none",
                          color: pct >= 100 ? color : "#fff",
                          fontSize: 11,
                          fontWeight: FONT_WEIGHT.bold,
                          cursor: "pointer",
                          fontFamily: FONT_FAMILY,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 6,
                          transition: "all 0.2s",
                        }}
                      >
                        {pct >= 100 ? (
                          <>
                            <CheckCircle size={13} /> Review Course
                          </>
                        ) : pct > 0 ? (
                          <>
                            <PlayCircle size={13} /> Continue Learning
                          </>
                        ) : (
                          <>
                            <PlayCircle size={13} /> Start Course
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {lockedCount > 0 && (
            <div
              style={{
                padding: "18px 20px",
                borderRadius: 16,
                background: "rgba(124,58,237,0.06)",
                border: "1px dashed rgba(124,58,237,0.4)",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontSize: 13,
                  fontWeight: FONT_WEIGHT.semibold,
                  color: t.text,
                  margin: "0 0 4px",
                  fontFamily: FONT_FAMILY,
                }}
              >
                🔒 {lockedCount} more course{lockedCount > 1 ? "s" : ""} locked
              </p>
              <p
                style={{
                  fontSize: 11.5,
                  color: t.textMuted,
                  margin: "0 0 12px",
                  fontFamily: FONT_FAMILY,
                }}
              >
                {planSummary
                  ? `Your ${planSummary.tier} plan shows up to ${planSummary.coursesVisible} enrolled courses. Upgrade to see the rest.`
                  : "Upgrade your plan to unlock your full course list."}
              </p>
              <button
                onClick={() => navigate("/profile?tab=billing")}
                style={{
                  padding: "8px 18px",
                  borderRadius: 10,
                  border: "none",
                  background: "#7c3aed",
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: FONT_WEIGHT.bold,
                  cursor: "pointer",
                  fontFamily: FONT_FAMILY,
                }}
              >
                Upgrade Plan
              </button>
            </div>
          )}
        </div>
      )}
    </PageContainer>
  );
};

export default MyCourses;
