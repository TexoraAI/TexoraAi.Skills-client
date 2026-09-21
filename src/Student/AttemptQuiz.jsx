import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import assessmentService from "../services/assessmentService";
import { progressService } from "../services/progressService";
import UpgradeModal from "../components/plan/UpgradeModal";
import { parsePlanError } from "../services/planErrorHandler";
import {
  Clock,
  FileText,
  CheckCircle,
  ChevronDown,
  Zap,
  Sparkles,
  Activity,
  Send,
  ChevronRight,
} from "lucide-react";

// ── Golden Reference design system — same tokens + shell used by the
// Dashboard, AssignmentDetail, StudentAssignments, and Assessments
// pages. This page previously carried a *third* local copy of the `T`
// token object (with its own slightly-drifted opacity values), a boxed
// hero variant with its own grid-pattern/glow background, and a full
// duplicate of the fadeUp/blink/pulse-ring keyframes + dfade/d1-d3/
// livebadge classes. All of that is gone — only the timer-pulse
// animation stays local, since nothing in the shared system covers it.
import {
  T,
  FONT_FAMILY,
  FONT_WEIGHT,
  FONT_SIZE,
  LINE_HEIGHT,
  LETTER_SPACING,
  PageContainer,
} from "@/design-system";

const ACCENT = "#fb923c";

/* Scoped style for the one animation with no shared-system equivalent */
const timerAnimStyles = `
  @keyframes aq-timer-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
  .aq-timer-low { animation: aq-timer-pulse 0.9s ease infinite; }
`;
if (
  typeof document !== "undefined" &&
  !document.getElementById("aq-timer-anim")
) {
  const tag = document.createElement("style");
  tag.id = "aq-timer-anim";
  tag.textContent = timerAnimStyles;
  document.head.appendChild(tag);
}

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

/* ── Field extraction utilities (unchanged) ── */
const ID_LIKE =
  /^(id|_id|key|index|idx|seq|sort|order|rank|num|number|type|kind|status|correct|isCorrect|is_correct|score|weight|createdAt|updatedAt|created_at|updated_at)$/i;
const QUESTION_TEXT_KEYS = [
  "questionText",
  "text",
  "question",
  "content",
  "title",
  "questionContent",
  "question_text",
  "name",
  "body",
  "description",
  "statement",
  "prompt",
  "questionStatement",
  "questionPrompt",
];
const OPTION_TEXT_KEYS = [
  "optionText",
  "text",
  "option",
  "content",
  "label",
  "answerText",
  "answer",
  "option_text",
  "answer_text",
  "name",
  "body",
  "title",
  "description",
  "displayText",
  "optionLabel",
  "optionValue",
  "choiceText",
  "choice",
  "value",
];

const extractText = (obj, knownKeys) => {
  if (!obj || typeof obj !== "object") return "";
  for (const k of knownKeys) {
    const v = obj[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  for (const k of Object.keys(obj)) {
    if (ID_LIKE.test(k)) continue;
    const v = obj[k];
    if (typeof v === "string" && v.trim() && isNaN(Number(v))) return v.trim();
  }
  return "";
};
const getQuestionText = (q) => extractText(q, QUESTION_TEXT_KEYS);
const getOptionText = (opt) => extractText(opt, OPTION_TEXT_KEYS);
const getOptionId = (opt, fallbackIndex) => {
  if (!opt) return String(fallbackIndex);
  const id =
    opt.id ??
    opt.optionId ??
    opt.option_id ??
    opt._id ??
    opt.key ??
    opt.optionKey ??
    null;
  return id !== null && id !== undefined && String(id).trim() !== ""
    ? String(id)
    : String(fallbackIndex);
};
const getQuestionId = (q, fallbackIndex) => {
  if (!q) return String(fallbackIndex);
  const id = q.id ?? q.questionId ?? q.question_id ?? q._id ?? q.key ?? null;
  return id !== null && id !== undefined && String(id).trim() !== ""
    ? String(id)
    : String(fallbackIndex);
};

/* ── Question Panel (unchanged logic; reads only from `t`) ── */
const QuestionPanel = ({
  q,
  qIndex,
  index,
  total,
  answers,
  onAnswer,
  t,
  isDark,
}) => {
  const [open, setOpen] = useState(index === 0);
  const [hov, setHov] = useState(false);
  const qId = getQuestionId(q, qIndex);
  const questionText = getQuestionText(q);
  const selected = answers[qId];
  const answered = selected !== undefined;

  return (
    <div
      style={{
        borderRadius: 16,
        border: `1px solid ${open ? ACCENT + "40" : hov ? t.borderHov : t.border}`,
        overflow: "hidden",
        boxShadow: open ? `0 0 24px ${ACCENT}10` : t.shadow,
        transition: "all 0.25s ease",
        background: t.cardBg,
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div
        onClick={() => setOpen((p) => !p)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "16px 20px",
          cursor: "pointer",
          background: open ? `${ACCENT}08` : hov ? t.cardBgHov : t.cardBg,
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
            background: answered
              ? "rgba(52,211,153,0.15)"
              : open
                ? `${ACCENT}20`
                : t.iconBg,
            border: `1px solid ${answered ? "rgba(52,211,153,0.4)" : open ? ACCENT + "40" : t.iconBorder}`,
            fontFamily: FONT_FAMILY,
            fontWeight: FONT_WEIGHT.bold,
            fontSize: 12,
            color: answered ? "#34d399" : open ? ACCENT : t.textMuted,
            transition: "all 0.2s",
          }}
        >
          {answered ? (
            <CheckCircle size={15} />
          ) : (
            String(index + 1).padStart(2, "0")
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              margin: 0,
              fontSize: 13,
              fontWeight: FONT_WEIGHT.bold,
              color: open ? ACCENT : t.text,
              fontFamily: FONT_FAMILY,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              transition: "color 0.2s",
            }}
          >
            {questionText || (
              <span style={{ opacity: 0.35, fontStyle: "italic" }}>
                Question {index + 1}
              </span>
            )}
          </p>
          <p
            style={{
              margin: "2px 0 0",
              fontSize: 10,
              color: t.textMuted,
              fontFamily: FONT_FAMILY,
            }}
          >
            Question {index + 1} of {total} · {q.options?.length ?? 0} options
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
            background: answered
              ? "rgba(52,211,153,0.12)"
              : "rgba(251,146,60,0.12)",
            color: answered ? "#34d399" : ACCENT,
            border: `1px solid ${answered ? "rgba(52,211,153,0.3)" : "rgba(251,146,60,0.3)"}`,
            fontFamily: FONT_FAMILY,
            flexShrink: 0,
          }}
        >
          {answered ? "Answered" : "Pending"}
        </span>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: open ? `${ACCENT}18` : t.actBg,
            border: `1px solid ${open ? ACCENT + "30" : t.actBorder}`,
            transition: "all 0.2s",
          }}
        >
          <ChevronDown
            size={14}
            color={open ? ACCENT : t.textMuted}
            style={{
              transition: "transform 0.3s",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </div>
      </div>
      <div
        style={{
          maxHeight: open ? 700 : 0,
          overflow: "hidden",
          transition: "max-height 0.35s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <div
          style={{
            borderTop: `1px solid ${ACCENT}20`,
            padding: "20px",
            background: open ? `${ACCENT}04` : "transparent",
          }}
        >
          <p
            style={{
              margin: "0 0 16px",
              fontSize: 14,
              fontWeight: FONT_WEIGHT.bold,
              color: t.text,
              fontFamily: FONT_FAMILY,
              lineHeight: 1.6,
            }}
          >
            {questionText}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {(q.options || []).map((opt, oi) => {
              const optId = getOptionId(opt, `${qId}_opt_${oi}`);
              const optText = getOptionText(opt);
              const isChosen = selected === optId;
              return (
                <div
                  key={optId}
                  onClick={() => onAnswer(qId, optId)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "13px 16px",
                    borderRadius: 12,
                    cursor: "pointer",
                    background: isChosen ? `${ACCENT}14` : t.recentItemBg,
                    border: `1px solid ${isChosen ? ACCENT + "60" : t.recentItemBorder}`,
                    transition: "all 0.2s",
                    userSelect: "none",
                  }}
                >
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      flexShrink: 0,
                      border: `2px solid ${isChosen ? ACCENT : isDark ? "rgba(255,255,255,0.25)" : "#cbd5e1"}`,
                      background: isChosen ? ACCENT : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.2s",
                    }}
                  >
                    {isChosen && (
                      <div
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: "50%",
                          background: "#fff",
                        }}
                      />
                    )}
                  </div>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: isChosen
                        ? FONT_WEIGHT.bold
                        : FONT_WEIGHT.medium,
                      color: isChosen ? ACCENT : t.text,
                      fontFamily: FONT_FAMILY,
                      lineHeight: 1.5,
                      flex: 1,
                      transition: "color 0.2s",
                    }}
                  >
                    {optText || `Option ${oi + 1}`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════
   MAIN ATTEMPT QUIZ PAGE
════════════════════════════════════════════ */
const AttemptQuiz = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [alreadyAttempted, setAlreadyAttempted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [completedQuizIds, setCompletedQuizIds] = useState([]);
  const [quizPercentage, setQuizPercentage] = useState(0);
  const [usage, setUsage] = useState(null);
  const [upgradeConfig, setUpgradeConfig] = useState(null);

  const timerRef = useRef(null);
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
    assessmentService
      .getQuizAttemptUsage()
      .then((res) => setUsage(res.data))
      .catch(() => setUsage(null));
  }, []);

  /* ── Load quiz ── */
  useEffect(() => {
    const loadQuiz = async () => {
      try {
        setLoading(true);
        const attemptRes = await assessmentService.hasAttempted(quizId);
        if (attemptRes.data === true) {
          setAlreadyAttempted(true);
          setLoading(false);
          return;
        }

        const res = await assessmentService.getQuizById(quizId);
        const rawQuiz = res.data;

        const rawQuestions =
          rawQuiz.questions ||
          rawQuiz.questionList ||
          rawQuiz.questionSet ||
          rawQuiz.quizQuestions ||
          [];
        const normalizedQuestions = rawQuestions.map((q) => {
          const rawOpts =
            q.options ||
            q.optionList ||
            q.choices ||
            q.answers ||
            q.questionOptions ||
            [];
          return { ...q, options: rawOpts };
        });
        const normalizedQuiz = { ...rawQuiz, questions: normalizedQuestions };
        setQuiz(normalizedQuiz);

        const timeLimitSeconds = normalizedQuiz.timeLimit
          ? normalizedQuiz.timeLimit * 60
          : 300;
        setTimeLeft(timeLimitSeconds);

        if (studentEmail && rawQuiz.batchId) {
          try {
            const prog = await progressService.getQuizProgress(
              studentEmail,
              rawQuiz.batchId,
            );
            setCompletedQuizIds(prog.data.completedQuizIds || []);
            setQuizPercentage(prog.data.percentage || 0);
          } catch {
            setCompletedQuizIds([]);
            setQuizPercentage(0);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadQuiz();
  }, [quizId]);

  /* ── Timer — only starts after quiz + timeLeft are set ── */
  useEffect(() => {
    if (!quiz || alreadyAttempted || timeLeft === 0) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          autoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [quiz, alreadyAttempted]);

  /* ── Build payload ── */
  const buildPayload = () => {
    const answerList = [];
    (quiz.questions || []).forEach((q, qIdx) => {
      const qId = getQuestionId(q, qIdx);
      const selectedKey = answers[qId];
      if (selectedKey === undefined) return;
      const options = q.options || [];
      const selectedOpt = options.find(
        (opt, oi) => getOptionId(opt, `${qId}_opt_${oi}`) === selectedKey,
      );
      const realOptionId = selectedOpt
        ? (selectedOpt.id ??
          selectedOpt.optionId ??
          selectedOpt.option_id ??
          selectedOpt._id ??
          selectedKey)
        : selectedKey;
      const realQId = q.id ?? q.questionId ?? q.question_id ?? q._id ?? qId;
      answerList.push({ questionId: realQId, selectedOptionId: realOptionId });
    });
    return { quizId: quiz.id, answers: answerList };
  };

  /* ── Auto submit ── */
  const autoSubmit = async () => {
    if (!quiz || alreadyAttempted) return;
    try {
      const payload = buildPayload();
      const res = await assessmentService.submitQuizAttempt(payload);
      if (studentEmail && res.data?.batchId) {
        try {
          const prog = await progressService.markQuizAttempted(
            studentEmail,
            res.data.batchId,
            res.data.quizId,
            1,
          );
          setCompletedQuizIds(prog.data.completedQuizIds || []);
          setQuizPercentage(prog.data.percentage || 0);
        } catch {}
      }
      setAlreadyAttempted(true);
    } catch {}
  };

  /* ── Manual submit ── */
  const submitQuiz = async () => {
    if (submitLoading) return;
    try {
      setSubmitLoading(true);
      const payload = buildPayload();
      const res = await assessmentService.submitQuizAttempt(payload);
      if (studentEmail && res.data?.batchId) {
        try {
          const prog = await progressService.markQuizAttempted(
            studentEmail,
            res.data.batchId,
            res.data.quizId,
            1,
          );
          setCompletedQuizIds(prog.data.completedQuizIds || []);
          setQuizPercentage(prog.data.percentage || 0);
        } catch {}
      }
      clearInterval(timerRef.current);
      setAlreadyAttempted(true);
      alert(`✅ Submitted! Score: ${res.data.percentage?.toFixed(1)}%`);
    } catch (err) {
      const planError = parsePlanError(err);
      if (planError) {
        setUpgradeConfig({ featureLabel: planError.message });
      } else if (err.response?.status === 403 || err.response?.status === 409) {
        setAlreadyAttempted(true);
      } else {
        alert("Failed to submit quiz. Please try again.");
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleAnswer = (qId, optId) =>
    setAnswers((prev) => ({ ...prev, [qId]: optId }));
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const answeredCount = Object.keys(answers).length;
  const totalQuestions = quiz?.questions?.length ?? 0;
  const progress =
    totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;
  const isLowTime = timeLeft > 0 && timeLeft <= 60;

  /* ── Loading state ── */
  if (loading) {
    return (
      <PageContainer
        mode={isDark ? "dark" : "light"}
        pageBg={t.pageBg}
        textColor={t.text}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: "rgba(251,146,60,0.12)",
                border: "1px solid rgba(251,146,60,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 14px",
              }}
            >
              <FileText size={22} color={ACCENT} />
            </div>
            <p
              style={{
                color: t.textSub,
                fontSize: 13,
                margin: 0,
                fontFamily: FONT_FAMILY,
              }}
            >
              Loading quiz...
            </p>
          </div>
        </div>
      </PageContainer>
    );
  }

  /* ── Already submitted ── */
  if (alreadyAttempted) {
    return (
      <PageContainer
        mode={isDark ? "dark" : "light"}
        pageBg={t.pageBg}
        textColor={t.text}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
          }}
        >
          <div
            style={{
              background: t.cardBg,
              border: `1px solid ${t.border}`,
              borderRadius: 24,
              padding: "48px 56px",
              textAlign: "center",
              maxWidth: 420,
              boxShadow: t.shadow,
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 20,
                background: "rgba(52,211,153,0.12)",
                border: "1px solid rgba(52,211,153,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
              }}
            >
              <CheckCircle size={30} color="#34d399" />
            </div>
            <p
              style={{
                fontSize: 18,
                fontWeight: FONT_WEIGHT.bold,
                color: t.text,
                fontFamily: FONT_FAMILY,
                margin: "0 0 10px",
              }}
            >
              Quiz Submitted
            </p>
            <p
              style={{
                fontSize: 12,
                color: t.textSub,
                fontFamily: FONT_FAMILY,
                margin: "0 0 24px",
                lineHeight: 1.7,
              }}
            >
              You have already submitted this quiz.
              <br />
              Check your results in <strong>My Quiz History</strong>.
            </p>
            <button
              onClick={() => navigate("/student/assessments")}
              style={{
                padding: "11px 28px",
                borderRadius: 12,
                background: "linear-gradient(135deg,#34d399,#059669)",
                border: "none",
                cursor: "pointer",
                color: "#fff",
                fontSize: 12,
                fontWeight: FONT_WEIGHT.bold,
                fontFamily: FONT_FAMILY,
                letterSpacing: "0.05em",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                boxShadow: "0 4px 20px rgba(52,211,153,0.3)",
              }}
            >
              <ChevronRight size={14} /> Back to Assessments
            </button>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (!quiz) {
    return (
      <PageContainer
        mode={isDark ? "dark" : "light"}
        pageBg={t.pageBg}
        textColor={t.text}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
          }}
        >
          <p
            style={{ color: t.textSub, fontSize: 13, fontFamily: FONT_FAMILY }}
          >
            Quiz not found
          </p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      mode={isDark ? "dark" : "light"}
      pageBg={t.pageBg}
      textColor={t.text}
    >
      {/* ═══ HERO — same borderless pattern as Dashboard/Assessments ═══ */}
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
              {quiz.title}
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
              Answer all questions and submit before time runs out
            </p>
            <div
              style={{
                display: "flex",
                gap: 8,
                marginTop: 10,
                flexWrap: "wrap",
              }}
            >
              {quiz.difficulty && (
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: FONT_WEIGHT.bold,
                    padding: "3px 10px",
                    borderRadius: 999,
                    background: "rgba(167,139,250,0.12)",
                    color: "#a78bfa",
                    border: "1px solid rgba(167,139,250,0.3)",
                    fontFamily: FONT_FAMILY,
                  }}
                >
                  {quiz.difficulty}
                </span>
              )}
              {quiz.category && (
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: FONT_WEIGHT.bold,
                    padding: "3px 10px",
                    borderRadius: 999,
                    background: "rgba(251,146,60,0.12)",
                    color: ACCENT,
                    border: "1px solid rgba(251,146,60,0.3)",
                    fontFamily: FONT_FAMILY,
                  }}
                >
                  {quiz.category}
                </span>
              )}
              {quiz.totalMarks && (
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: FONT_WEIGHT.bold,
                    padding: "3px 10px",
                    borderRadius: 999,
                    background: "rgba(34,211,238,0.12)",
                    color: "#22d3ee",
                    border: "1px solid rgba(34,211,238,0.3)",
                    fontFamily: FONT_FAMILY,
                  }}
                >
                  {quiz.totalMarks} marks
                </span>
              )}
            </div>
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
              <span>
                {answeredCount}/{totalQuestions} answered
              </span>
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
                {Math.round(progress)}%
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
              className={isLowTime ? "aq-timer-low livebadge" : "livebadge"}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                background: isLowTime
                  ? "rgba(239,68,68,0.1)"
                  : "rgba(251,146,60,0.08)",
                border: `1px solid ${isLowTime ? "rgba(239,68,68,0.4)" : "rgba(251,146,60,0.3)"}`,
                borderRadius: 999,
                padding: "8px 18px",
                color: isLowTime ? "#ef4444" : ACCENT,
                fontSize: 13,
                fontWeight: FONT_WEIGHT.bold,
                letterSpacing: "0.06em",
                fontFamily: FONT_FAMILY,
              }}
            >
              <Clock size={13} />
              {minutes}:{seconds.toString().padStart(2, "0")}
            </div>

            {usage && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  background: t.actBg,
                  border: `1px solid ${t.actBorder}`,
                  borderRadius: 999,
                  padding: "8px 16px",
                  fontSize: 11,
                  fontWeight: FONT_WEIGHT.semibold,
                  fontFamily: FONT_FAMILY,
                  color: t.textSub,
                }}
              >
                {usage.limit === "unlimited"
                  ? "Unlimited attempts"
                  : `${usage.used}/${usage.limit} attempts this month`}
              </div>
            )}
          </div>
        </div>

        {/* Answer progress bar */}
        <div
          style={{
            marginTop: 22,
            height: 4,
            background: t.barBg,
            borderRadius: 99,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              borderRadius: 99,
              background: `linear-gradient(90deg,${ACCENT},#34d399)`,
              width: `${progress}%`,
              transition: "width 0.5s ease",
            }}
          />
        </div>

        {/* Batch quiz progress bar */}
        {quiz.batchId && (
          <div style={{ marginTop: 8 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 3,
              }}
            >
              <span
                style={{
                  fontSize: 9,
                  color: t.textMuted,
                  fontFamily: FONT_FAMILY,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Batch Quiz Progress
              </span>
              <span
                style={{
                  fontSize: 9,
                  color: "#34d399",
                  fontFamily: FONT_FAMILY,
                  fontWeight: FONT_WEIGHT.bold,
                }}
              >
                {Math.round(quizPercentage)}%
              </span>
            </div>
            <div
              style={{
                height: 3,
                background: t.barBg,
                borderRadius: 99,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  borderRadius: 99,
                  background: "rgba(52,211,153,0.7)",
                  width: `${quizPercentage}%`,
                  transition: "width 0.5s ease",
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ═══ QUESTION PANELS ═══ */}
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 24px",
            borderBottom: `1px solid ${t.border}`,
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
              <FileText size={15} color={ACCENT} />
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
                All Questions
              </span>
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: 10,
                  color: t.textMuted,
                }}
              >
                Click any question to expand and answer
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
            {totalQuestions} questions
          </span>
        </div>

        <div
          style={{
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {quiz.questions.map((q, idx) => (
            <div
              key={getQuestionId(q, idx)}
              className="dfade"
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <QuestionPanel
                q={q}
                qIndex={idx}
                index={idx}
                total={totalQuestions}
                answers={answers}
                onAnswer={handleAnswer}
                t={t}
                isDark={isDark}
              />
            </div>
          ))}
        </div>

        {/* Submit Footer */}
        <div
          style={{
            padding: "20px 24px",
            borderTop: `1px solid ${t.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 14,
            background: t.cardBg,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#34d399",
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: FONT_WEIGHT.semibold,
                  color: t.textSub,
                  fontFamily: FONT_FAMILY,
                }}
              >
                {answeredCount} answered
              </span>
            </div>
            <div style={{ width: 1, height: 14, background: t.border }} />
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: ACCENT,
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: FONT_WEIGHT.semibold,
                  color: t.textSub,
                  fontFamily: FONT_FAMILY,
                }}
              >
                {totalQuestions - answeredCount} remaining
              </span>
            </div>
          </div>

          <button
            onClick={submitQuiz}
            disabled={submitLoading}
            style={{
              padding: "12px 28px",
              borderRadius: 12,
              background: submitLoading
                ? "rgba(251,146,60,0.4)"
                : `linear-gradient(135deg,${ACCENT},#ef4444)`,
              border: "none",
              cursor: submitLoading ? "not-allowed" : "pointer",
              color: "#fff",
              fontSize: 12,
              fontWeight: FONT_WEIGHT.bold,
              fontFamily: FONT_FAMILY,
              letterSpacing: "0.05em",
              display: "flex",
              alignItems: "center",
              gap: 8,
              boxShadow: `0 4px 20px ${ACCENT}30`,
              transition: "transform 0.15s,box-shadow 0.15s,background 0.2s",
              opacity: submitLoading ? 0.7 : 1,
            }}
            onMouseEnter={(e) => {
              if (!submitLoading) {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = `0 8px 28px ${ACCENT}40`;
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = `0 4px 20px ${ACCENT}30`;
            }}
          >
            <Send size={14} />
            {submitLoading ? "Submitting..." : "Submit Quiz"}
            <Zap size={13} />
          </button>
        </div>
      </div>
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
            assessmentService
              .getQuizAttemptUsage()
              .then((res) => setUsage(res.data))
              .catch(() => {});
          }}
        />
      )}
    </PageContainer>
  );
};

export default AttemptQuiz;
