import {
  Award,
  Calendar,
  Clock,
  FileText,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Activity,
  Zap,
  CheckCircle2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import assessmentService from "../services/assessmentService";
import { progressService } from "../services/progressService";

// ── Golden Reference design system — same tokens, StatCard, and
// PageContainer shell as the Dashboard. Typography (font family, weight,
// size, line-height, letter-spacing) is now sourced from the shared
// design-system tokens instead of hardcoded 'Poppins' strings and raw
// numeric font-weights, matching AllCourses.jsx / AllUsers.jsx.
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

const getEmailFromToken = () => {
  try {
    const token = localStorage.getItem("lms_token");
    if (!token) return null;
    return JSON.parse(atob(token.split(".")[1])).sub;
  } catch {
    return null;
  }
};

/* ── Difficulty ordering ── */
const DIFFICULTY_ORDER = ["Easy", "Medium", "Hard", "Expert"];

// Color per difficulty tab (domain-specific, not part of the shared token set)
const DIFF_COLORS = {
  All: {
    color: "#fb923c",
    bg: "rgba(251,146,60,0.12)",
    border: "rgba(251,146,60,0.3)",
  },
  Easy: {
    color: "#34d399",
    bg: "rgba(52,211,153,0.12)",
    border: "rgba(52,211,153,0.3)",
  },
  Medium: {
    color: "#fbbf24",
    bg: "rgba(251,191,36,0.12)",
    border: "rgba(251,191,36,0.3)",
  },
  Hard: {
    color: "#f87171",
    bg: "rgba(248,113,113,0.12)",
    border: "rgba(248,113,113,0.3)",
  },
  Expert: {
    color: "#c084fc",
    bg: "rgba(192,132,252,0.12)",
    border: "rgba(192,132,252,0.3)",
  },
};

const getDifficultyRank = (quiz) => {
  const d = (quiz.difficulty || "").trim();
  const idx = DIFFICULTY_ORDER.findIndex(
    (x) => x.toLowerCase() === d.toLowerCase(),
  );
  return idx === -1 ? 999 : idx;
};

/* ── Quiz Row (page-specific accordion — not a Dashboard pattern, so it
   stays custom, but reads every color/spacing value from `t`) ── */
const QuizRow = ({
  item,
  index,
  t,
  navigate,
  isSubmitted,
  isLocked,
  prevDifficulty,
}) => {
  const [open, setOpen] = useState(false);
  const [hov, setHov] = useState(false);

  const accentColor = isLocked
    ? "#64748b"
    : isSubmitted
      ? "#34d399"
      : "#fb923c";
  const gradientEnd = isLocked
    ? "#475569"
    : isSubmitted
      ? "#059669"
      : "#ef4444";

  return (
    <div
      className="dfade"
      style={{
        borderRadius: 16,
        border: `1px solid ${open ? accentColor + "40" : hov ? t.borderHov : t.border}`,
        overflow: "hidden",
        boxShadow: open ? `0 0 24px ${accentColor}10` : t.shadow,
        transition: "all 0.25s ease",
        background: t.cardBg,
        opacity: isLocked ? 0.6 : 1,
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {/* Header */}
      <div
        onClick={() => !isLocked && setOpen((p) => !p)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "16px 20px",
          cursor: isLocked ? "not-allowed" : "pointer",
          background: open ? `${accentColor}08` : hov ? t.cardBgHov : t.cardBg,
          transition: "background 0.2s",
          userSelect: "none",
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: open ? `${accentColor}20` : t.iconBg,
            border: `1px solid ${open ? accentColor + "40" : t.iconBorder}`,
            fontFamily: FONT_FAMILY,
            fontWeight: FONT_WEIGHT.bold,
            fontSize: 12,
            color: open ? accentColor : t.textMuted,
            transition: "all 0.2s",
          }}
        >
          {isLocked ? "🔒" : String(index + 1).padStart(2, "0")}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              margin: 0,
              fontSize: 13,
              fontWeight: FONT_WEIGHT.bold,
              color: open ? accentColor : t.text,
              fontFamily: FONT_FAMILY,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              transition: "color 0.2s",
            }}
          >
            {item.title}
          </p>
          <p
            style={{
              margin: "2px 0 0",
              fontSize: 10,
              color: t.textMuted,
              fontFamily: FONT_FAMILY,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            Quiz ID: {item.id}
            {item.difficulty && (
              <span
                style={{
                  padding: "1px 7px",
                  borderRadius: 999,
                  background: `${accentColor}18`,
                  color: accentColor,
                  fontSize: 9,
                  fontWeight: FONT_WEIGHT.bold,
                  border: `1px solid ${accentColor}30`,
                }}
              >
                {item.difficulty}
              </span>
            )}
            {item.timeLimit && (
              <span
                style={{
                  padding: "1px 7px",
                  borderRadius: 999,
                  background: "rgba(34,211,238,0.1)",
                  color: "#22d3ee",
                  fontSize: 9,
                  fontWeight: FONT_WEIGHT.bold,
                  border: "1px solid rgba(34,211,238,0.25)",
                }}
              >
                ⏱ {item.timeLimit} min
              </span>
            )}
          </p>
        </div>
        <span
          style={{
            fontSize: 9,
            fontWeight: FONT_WEIGHT.bold,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            padding: "4px 12px",
            borderRadius: 999,
            background: isLocked
              ? "rgba(100,116,139,0.12)"
              : isSubmitted
                ? "rgba(52,211,153,0.12)"
                : "rgba(251,146,60,0.12)",
            color: accentColor,
            border: `1px solid ${accentColor}4D`,
            fontFamily: FONT_FAMILY,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}
        >
          {isLocked ? (
            "🔒 Locked"
          ) : isSubmitted ? (
            <>
              <CheckCircle2 size={9} /> Submitted
            </>
          ) : (
            "Pending"
          )}
        </span>
        {!isLocked && (
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: open ? `${accentColor}18` : t.actBg,
              border: `1px solid ${open ? accentColor + "30" : t.actBorder}`,
              transition: "all 0.2s",
            }}
          >
            <ChevronDown
              size={14}
              color={open ? accentColor : t.textMuted}
              style={{
                transition: "transform 0.3s",
                transform: open ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </div>
        )}
      </div>

      {/* Body */}
      {!isLocked && (
        <div
          style={{
            maxHeight: open ? 400 : 0,
            overflow: "hidden",
            transition: "max-height 0.35s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          <div
            style={{
              borderTop: `1px solid ${accentColor}20`,
              padding: "20px",
              background: open ? `${accentColor}04` : "transparent",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
                marginBottom: 18,
              }}
            >
              {[
                {
                  label: "Quiz ID",
                  value: item.id,
                  icon: FileText,
                  color: "#22d3ee",
                },
                {
                  label: "Status",
                  value: isSubmitted ? "Submitted" : "Pending Attempt",
                  icon: isSubmitted ? CheckCircle2 : Clock,
                  color: accentColor,
                },
                {
                  label: "Difficulty",
                  value: item.difficulty || "—",
                  icon: Award,
                  color: "#a78bfa",
                },
                {
                  label: "Time Limit",
                  value: item.timeLimit ? `${item.timeLimit} min` : "—",
                  icon: Clock,
                  color: "#34d399",
                },
                {
                  label: "Category",
                  value: item.category || "—",
                  icon: Award,
                  color: "#fb923c",
                },
                {
                  label: "Total Marks",
                  value: item.totalMarks || "—",
                  icon: Calendar,
                  color: "#22d3ee",
                },
              ].map((det, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 14px",
                    borderRadius: 12,
                    background: t.recentItemBg,
                    border: `1px solid ${t.recentItemBorder}`,
                  }}
                >
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 8,
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: `${det.color}18`,
                      border: `1px solid ${det.color}30`,
                    }}
                  >
                    <det.icon size={13} color={det.color} />
                  </div>
                  <div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 9,
                        color: t.textMuted,
                        fontFamily: FONT_FAMILY,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        fontWeight: FONT_WEIGHT.semibold,
                      }}
                    >
                      {det.label}
                    </p>
                    <p
                      style={{
                        margin: "2px 0 0",
                        fontSize: 12,
                        fontWeight: FONT_WEIGHT.bold,
                        color: t.text,
                        fontFamily: FONT_FAMILY,
                      }}
                    >
                      {det.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/student/quiz/${item.id}`);
              }}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: 12,
                background: `linear-gradient(135deg,${accentColor},${gradientEnd})`,
                border: "none",
                cursor: "pointer",
                color: "#fff",
                fontSize: 12,
                fontWeight: FONT_WEIGHT.bold,
                fontFamily: FONT_FAMILY,
                letterSpacing: "0.05em",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                boxShadow: `0 4px 20px ${accentColor}30`,
                transition: "transform 0.15s,box-shadow 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = `0 8px 28px ${accentColor}40`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = `0 4px 20px ${accentColor}30`;
              }}
            >
              {isSubmitted ? (
                <>
                  <CheckCircle2 size={14} /> View Result{" "}
                  <ChevronRight size={14} />
                </>
              ) : (
                <>
                  <Zap size={14} /> Start Assessment <ChevronRight size={14} />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Locked message */}
      {isLocked && (
        <div
          style={{
            padding: "12px 20px",
            borderTop: `1px solid ${t.border}`,
            background: t.recentItemBg,
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 11,
              color: t.textMuted,
              fontFamily: FONT_FAMILY,
              textAlign: "center",
            }}
          >
            🔒 Complete all{" "}
            <strong style={{ color: "#fb923c" }}>{prevDifficulty}</strong>{" "}
            quizzes first to unlock this
          </p>
        </div>
      )}
    </div>
  );
};

/* ════════════════════════════════════════════
   MAIN ASSESSMENTS PAGE
════════════════════════════════════════════ */
const Assessments = () => {
  const [assessments, setAssessments] = useState([]);
  const [completedQuizIds, setCompletedQuizIds] = useState([]);
  const [quizPercentage, setQuizPercentage] = useState(0);
  const [selectedDiff, setSelectedDiff] = useState("All");
  const navigate = useNavigate();
  const studentEmail = getEmailFromToken();

  // Same dark-mode detection pattern as the Dashboard golden reference
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
    const loadQuizzes = async () => {
      try {
        const res = await assessmentService.getStudentQuizzes();
        const data = res.data || [];
        setAssessments(data);
        if (data.length > 0 && studentEmail) {
          const batchId = data[0]?.batchId;
          if (batchId) {
            try {
              const prog = await progressService.getQuizProgress(
                studentEmail,
                batchId,
              );
              setCompletedQuizIds(prog.data.completedQuizIds || []);
              setQuizPercentage(prog.data.percentage || 0);
            } catch {
              setCompletedQuizIds([]);
              setQuizPercentage(0);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load quizzes", err);
      }
    };
    loadQuizzes();
  }, []);

  const submittedCount = completedQuizIds.length;
  const pendingCount = assessments.length - submittedCount;

  /* sort */
  const sorted = [...assessments].sort((a, b) => {
    const dr = getDifficultyRank(a) - getDifficultyRank(b);
    return dr !== 0 ? dr : a.id - b.id;
  });

  const existingDifficulties = [
    ...new Set(sorted.map((q) => q.difficulty || "")),
  ].filter(Boolean);

  const isQuizLocked = (quiz) => {
    const myRank = getDifficultyRank(quiz);
    const lowerRankQuizzes = sorted.filter(
      (q) => getDifficultyRank(q) < myRank,
    );
    return lowerRankQuizzes.some((q) => !completedQuizIds.includes(q.id));
  };

  const getPrevDifficulty = (quiz) => {
    const myRank = getDifficultyRank(quiz);
    const lowerDiffs = DIFFICULTY_ORDER.filter(
      (_, i) =>
        i < myRank &&
        existingDifficulties.some(
          (d) => d.toLowerCase() === DIFFICULTY_ORDER[i].toLowerCase(),
        ),
    );
    return lowerDiffs[lowerDiffs.length - 1] || "previous";
  };

  // Only show tabs for difficulties that exist in data
  const tabs = [
    "All",
    ...DIFFICULTY_ORDER.filter((d) =>
      existingDifficulties.some((e) => e.toLowerCase() === d.toLowerCase()),
    ),
  ];

  // Filter list based on selected tab
  const filtered =
    selectedDiff === "All"
      ? sorted
      : sorted.filter(
          (q) =>
            (q.difficulty || "").trim().toLowerCase() ===
            selectedDiff.toLowerCase(),
        );

  // Same `stat` shape the Dashboard/AssignmentDetail hand to <StatCard />
  const stats = [
    {
      label: "Total Assessments",
      numericValue: assessments.length,
      change: `${assessments.length} available`,
      trend: "up",
      icon: FileText,
      colorKey: "blue",
    },
    {
      label: "Pending",
      numericValue: pendingCount,
      change: pendingCount > 0 ? "awaiting attempt" : "none left",
      trend: pendingCount > 0 ? "down" : "up",
      icon: Clock,
      colorKey: "orange",
    },
    {
      label: "Submitted",
      numericValue: submittedCount,
      change: `${quizPercentage.toFixed(0)}% complete`,
      trend: "up",
      icon: CheckCircle2,
      colorKey: "green",
    },
    {
      label: "Due This Week",
      numericValue: 0,
      change: "no due dates set",
      trend: "up",
      icon: Calendar,
      colorKey: "purple",
    },
  ];

  return (
    <PageContainer
      mode={isDark ? "dark" : "light"}
      pageBg={t.pageBg}
      textColor={t.text}
    >
      {/* ═══ HERO — same markup/classes as the Dashboard hero ═══ */}
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
                gap: 7,
                marginBottom: 10,
              }}
            >
              <Sparkles size={11} color={t.textSub} />
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
                Assessment Portal
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
              Your Assessments
            </h1>
            <p
              style={{
                fontSize: FONT_SIZE.bodySmall,
                color: t.textSub,
                marginTop: 7,
                fontWeight: FONT_WEIGHT.medium,
                fontFamily: FONT_FAMILY,
              }}
            >
              Track your progress and attempt quizzes
            </p>
          </div>
          <div className="hero-badges">
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
                fontWeight: FONT_WEIGHT.semibold,
                fontFamily: FONT_FAMILY,
                color: t.textSub,
              }}
            >
              <span>{assessments.length} total</span>
              <span style={{ width: 1, height: 14, background: t.actBorder }} />
              <span style={{ color: "#34d399", fontWeight: FONT_WEIGHT.bold }}>
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#34d399",
                    display: "inline-block",
                    marginRight: 5,
                  }}
                />
                {submittedCount} submitted
              </span>
              <span style={{ width: 1, height: 14, background: t.actBorder }} />
              <span style={{ color: "#fb923c", fontWeight: FONT_WEIGHT.bold }}>
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#fb923c",
                    display: "inline-block",
                    marginRight: 5,
                  }}
                />
                {pendingCount} pending
              </span>
            </div>
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
                background: "rgba(251,146,60,0.08)",
                border: "1px solid rgba(251,146,60,0.3)",
                borderRadius: 999,
                padding: "8px 18px",
                color: "#fb923c",
                fontSize: 11,
                fontWeight: FONT_WEIGHT.bold,
                letterSpacing: "0.1em",
                fontFamily: FONT_FAMILY,
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
              LIVE
            </div>
          </div>
        </div>
      </div>

      {/* ═══ STAT CARDS — shared <StatCard/>, same stat-grid layout ═══ */}
      <div className="stat-grid" style={{ marginBottom: 20 }}>
        {stats.map((s, i) => (
          <StatCard key={i} stat={s} index={i} loading={false} />
        ))}
      </div>

      {/* ═══ QUIZ LIST ═══ */}
      <div
        className="dfade"
        style={{
          background: t.cardBg,
          border: `1px solid ${t.border}`,
          borderRadius: 24,
          overflow: "hidden",
          boxShadow: t.shadow,
        }}
      >
        {/* ── header ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 24px 0",
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
                background: "rgba(251,146,60,0.1)",
                border: "1px solid rgba(251,146,60,0.2)",
              }}
            >
              <FileText size={15} color="#fb923c" />
            </div>
            <div>
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontWeight: FONT_WEIGHT.bold,
                  fontSize: 13,
                  color: t.text,
                  display: "block",
                }}
              >
                All Assessments
              </span>
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: 10,
                  color: t.textMuted,
                }}
              >
                {existingDifficulties.length > 0
                  ? `Unlocked in order: ${existingDifficulties.join(" → ")}`
                  : "Click any row to expand details"}
              </span>
            </div>
          </div>
          <span
            style={{
              fontSize: 9,
              fontWeight: FONT_WEIGHT.bold,
              letterSpacing: "0.1em",
              padding: "4px 12px",
              borderRadius: 999,
              textTransform: "uppercase",
              background: t.pillBg,
              border: `1px solid ${t.pillBorder}`,
              color: t.pillText,
              fontFamily: FONT_FAMILY,
            }}
          >
            {filtered.length} items
          </span>
        </div>

        {/* Difficulty filter tabs */}
        <div
          style={{
            display: "flex",
            gap: 8,
            padding: "12px 24px 0",
            overflowX: "auto",
            scrollbarWidth: "none",
          }}
        >
          {tabs.map((tab) => {
            const cfg = DIFF_COLORS[tab] || DIFF_COLORS.All;
            const active = selectedDiff === tab;
            const count =
              tab === "All"
                ? sorted.length
                : sorted.filter(
                    (q) =>
                      (q.difficulty || "").trim().toLowerCase() ===
                      tab.toLowerCase(),
                  ).length;
            return (
              <button
                key={tab}
                onClick={() => setSelectedDiff(tab)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "7px 16px",
                  borderRadius: 999,
                  cursor: "pointer",
                  outline: "none",
                  flexShrink: 0,
                  border: `1px solid ${active ? cfg.border : t.border}`,
                  background: active ? cfg.bg : t.pillBg,
                  fontFamily: FONT_FAMILY,
                  fontSize: 11,
                  fontWeight: FONT_WEIGHT.bold,
                  color: active ? cfg.color : t.textMuted,
                  transition: "all 0.18s ease",
                  boxShadow: active ? `0 0 14px ${cfg.color}30` : "none",
                  marginBottom: 12,
                }}
              >
                {tab}
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: FONT_WEIGHT.bold,
                    padding: "1px 7px",
                    borderRadius: 999,
                    background: active ? `${cfg.color}22` : t.border,
                    color: active ? cfg.color : t.textMuted,
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── divider ── */}
        <div style={{ height: 1, background: t.border, margin: "0 24px" }} />

        {/* ── quiz rows ── */}
        <div
          style={{
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {filtered.map((item, idx) => {
            const submitted = completedQuizIds.includes(item.id);
            const locked = isQuizLocked(item);
            const prevDiff = getPrevDifficulty(item);
            return (
              <QuizRow
                key={item.id}
                item={item}
                index={idx}
                t={t}
                navigate={navigate}
                isSubmitted={submitted}
                isLocked={locked}
                prevDifficulty={prevDiff}
              />
            );
          })}

          {filtered.length === 0 && assessments.length > 0 && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "60px 0",
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
                <Award size={26} color={t.emptyIcon} />
              </div>
              <div style={{ textAlign: "center" }}>
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: FONT_WEIGHT.bold,
                    color: t.text,
                    margin: 0,
                    fontFamily: FONT_FAMILY,
                  }}
                >
                  No {selectedDiff} assessments
                </p>
                <p
                  style={{
                    fontSize: 11,
                    color: t.textMuted,
                    margin: "4px 0 0",
                    fontFamily: FONT_FAMILY,
                  }}
                >
                  Try a different difficulty tab
                </p>
              </div>
            </div>
          )}

          {assessments.length === 0 && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "60px 0",
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
                <Award size={26} color={t.emptyIcon} />
              </div>
              <div style={{ textAlign: "center" }}>
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: FONT_WEIGHT.bold,
                    color: t.text,
                    margin: 0,
                    fontFamily: FONT_FAMILY,
                  }}
                >
                  All caught up!
                </p>
                <p
                  style={{
                    fontSize: 11,
                    color: t.textMuted,
                    margin: "4px 0 0",
                    fontFamily: FONT_FAMILY,
                  }}
                >
                  No assessments available at the moment 🎉
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default Assessments;
