import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Calendar,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Lock,
  CheckCircle2,
} from "lucide-react";

import {
  getMySubmissions,
  getStudentAssignments,
} from "@/services/assessmentService";

import { progressService } from "@/services/progressService";

// ── Golden Reference design system — same tokens + shell used by the
// Student Dashboard (and now AssignmentDetail). No local CSS variables,
// no injected stylesheet of colors/radii/shadows — everything below
// reads from `T`, and the card grid reuses the same `.courses-grid`
// responsive layout the Dashboard's Courses tab already defines.
import { T, PageContainer } from "@/design-system";

/* ─── JWT email decode ───────────────────────────────────────────────────── */
const getEmailFromToken = () => {
  try {
    const token = localStorage.getItem("lms_token");
    if (!token) return null;
    return JSON.parse(atob(token.split(".")[1])).sub;
  } catch {
    return null;
  }
};

/* ─── Component ──────────────────────────────────────────────────────────── */
export default function StudentAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /* ── Progress state ── */
  const [completedAssignmentIds, setCompletedAssignmentIds] = useState([]);
  const [progressPercentage, setProgressPercentage] = useState(0);

  /* ── Locked toast ── */
  const [lockedMsg, setLockedMsg] = useState(null);

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

  /* ── Sequential unlock check ── */
  const isUnlocked = (index) => {
    if (index === 0) return true;
    const prev = assignments[index - 1];
    return completedAssignmentIds.includes(prev?.id);
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      const assignmentRes = await getStudentAssignments();
      const submissionRes = await getMySubmissions();

      const submissionMap = {};
      const submissionsRaw =
        submissionRes?.data?.data ||
        submissionRes?.data?.submissions ||
        submissionRes?.data ||
        [];
      const submissions = Array.isArray(submissionsRaw) ? submissionsRaw : [];
      submissions.forEach((s) => {
        submissionMap[s.assignmentId] = s;
      });

      const assignmentRaw =
        assignmentRes?.data?.data ||
        assignmentRes?.data?.assignments ||
        assignmentRes?.data ||
        [];
      const assignmentList = Array.isArray(assignmentRaw) ? assignmentRaw : [];

      const mergedAssignments = assignmentList.map((a) => ({
        ...a,
        submission: submissionMap[a.id] || null,
      }));

      setAssignments(mergedAssignments);

      /* ── Load assignment progress ── */
      if (assignmentList.length > 0 && studentEmail) {
        const batchId = assignmentList[0]?.batchId;
        if (batchId) {
          try {
            const prog = await progressService.getAssignmentProgress(
              studentEmail,
              batchId,
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
      console.error("Error loading assignments:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ── Navigate guard ── */
  const handleNavigate = (a, index) => {
    if (!isUnlocked(index)) {
      const prevTitle = assignments[index - 1]?.title || "previous assignment";
      setLockedMsg(`Submit "${prevTitle}" first to unlock this assignment`);
      setTimeout(() => setLockedMsg(null), 3000);
      return;
    }
    navigate(`/student/assignments/${a.id}`);
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <PageContainer
        mode={isDark ? "dark" : "light"}
        pageBg={t.pageBg}
        textColor={t.text}
      >
        <div
          style={{
            textAlign: "center",
            padding: "80px 20px",
            color: t.textMuted,
            fontSize: 14,
            fontWeight: 500,
            fontFamily: "'Poppins',sans-serif",
          }}
        >
          Loading assignments...
        </div>
      </PageContainer>
    );
  }

  /* ── Empty ── */
  if (!assignments.length) {
    return (
      <PageContainer
        mode={isDark ? "dark" : "light"}
        pageBg={t.pageBg}
        textColor={t.text}
      >
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
            <FileText size={28} color={t.emptyIcon} />
          </div>
          <p
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: t.text,
              margin: "0 0 6px",
              fontFamily: "'Poppins',sans-serif",
            }}
          >
            No Assignments Yet
          </p>
          <p
            style={{
              fontSize: 12,
              color: t.textMuted,
              margin: 0,
              fontFamily: "'Poppins',sans-serif",
            }}
          >
            No assignments available.
          </p>
        </div>
      </PageContainer>
    );
  }

  const accentColors = ["#22d3ee", "#a78bfa", "#34d399", "#fb923c", "#f87171"];

  return (
    <PageContainer
      mode={isDark ? "dark" : "light"}
      pageBg={t.pageBg}
      textColor={t.text}
    >
      {/* ── Locked toast ── */}
      {lockedMsg && (
        <div
          style={{
            position: "fixed",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
            padding: "12px 20px",
            borderRadius: 14,
            background: t.cardBg,
            border: "1px solid rgba(251,146,60,0.3)",
            color: t.text,
            fontFamily: "'Poppins',sans-serif",
            fontSize: 13,
            fontWeight: 600,
            boxShadow: t.shadowHov,
            display: "flex",
            alignItems: "center",
            gap: 8,
            whiteSpace: "nowrap",
          }}
        >
          <Lock size={14} style={{ color: "#fb923c" }} />
          {lockedMsg}
        </div>
      )}

      {/* ═══ HERO ═══ */}
      <div
        style={{
          padding: "8px 0 24px",
          borderBottom: `1px solid ${t.borderHero}`,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          <div>
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
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: t.textSub,
                  fontFamily: "'Poppins',sans-serif",
                }}
              >
                My Courses
              </span>
            </div>
            <h1
              style={{
                fontFamily: "'Poppins',sans-serif",
                fontWeight: 700,
                fontSize: "clamp(1.5rem,3vw,2.2rem)",
                color: "#3B82F6",
                margin: "0 0 6px",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
              }}
            >
              Assignments
            </h1>
            <p
              style={{
                fontSize: 12,
                color: t.textSub,
                margin: 0,
                fontWeight: 500,
                fontFamily: "'Poppins',sans-serif",
              }}
            >
              View and submit your assignments
            </p>

            {/* Sequential unlock hint */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "5px 14px",
                borderRadius: 50,
                background: "rgba(251,146,60,0.08)",
                border: "1px solid rgba(251,146,60,0.2)",
                color: "#fb923c",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.06em",
                marginTop: 12,
                fontFamily: "'Poppins',sans-serif",
              }}
            >
              📋 Submit each assignment to unlock the next one
            </div>
          </div>

          {/* Right: stat pills, same shape as Dashboard's hero-badges */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: t.actBg,
              border: `1px solid ${t.actBorder}`,
              borderRadius: 12,
              padding: "10px 18px",
              fontSize: 11,
              fontWeight: 600,
              fontFamily: "'Poppins',sans-serif",
              color: t.textSub,
            }}
          >
            <span>
              <strong style={{ color: t.text }}>{assignments.length}</strong>{" "}
              total
            </span>
            <span style={{ width: 1, height: 14, background: t.actBorder }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ color: "#34d399", fontWeight: 700 }}>
                {completedAssignmentIds.length} / {assignments.length} submitted
              </span>
              <div
                style={{
                  height: 4,
                  background: t.barBg,
                  borderRadius: 99,
                  overflow: "hidden",
                  width: 100,
                }}
              >
                <div
                  style={{
                    height: "100%",
                    background: "#34d399",
                    borderRadius: 99,
                    width: `${progressPercentage}%`,
                    transition: "width 0.7s ease",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Sequential hint banner ── */}
      <div
        style={{
          padding: "10px 18px",
          borderRadius: 14,
          background: "rgba(251,146,60,0.06)",
          border: "1px solid rgba(251,146,60,0.18)",
          color: "#fb923c",
          fontSize: 12,
          fontWeight: 600,
          marginBottom: 20,
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontFamily: "'Poppins',sans-serif",
        }}
      >
        <AlertCircle size={14} />
        Assignments are unlocked sequentially — submit each one to unlock the
        next
      </div>

      {/* ── Grid — reuses the Dashboard's course-card grid layout ── */}
      <div className="courses-grid">
        {assignments.map((a, index) => {
          const isLate = new Date(a.deadline) < new Date();
          const evaluated = a.submission && a.submission.obtainedMarks !== null;
          const isSubmitted = completedAssignmentIds.includes(a.id);
          const unlocked = isUnlocked(index);
          const accent = accentColors[index % accentColors.length];

          let badge;
          if (evaluated) {
            badge = (
              <span
                style={tagStyle(
                  "rgba(34,211,238,0.10)",
                  "#22d3ee",
                  "rgba(34,211,238,0.20)",
                )}
              >
                <CheckCircle size={11} /> {a.submission.obtainedMarks}/
                {a.maxMarks}
              </span>
            );
          } else if (isSubmitted) {
            badge = (
              <span
                style={tagStyle(
                  "rgba(52,211,153,0.10)",
                  "#34d399",
                  "rgba(52,211,153,0.25)",
                )}
              >
                <CheckCircle2 size={11} /> Submitted
              </span>
            );
          } else if (!unlocked) {
            badge = (
              <span
                style={tagStyle(
                  "rgba(251,146,60,0.10)",
                  "#fb923c",
                  "rgba(251,146,60,0.20)",
                )}
              >
                <Lock size={11} /> Locked
              </span>
            );
          } else if (isLate) {
            badge = (
              <span
                style={tagStyle(
                  "rgba(248,113,113,0.10)",
                  "#f87171",
                  "rgba(248,113,113,0.20)",
                )}
              >
                <AlertCircle size={11} /> Passed
              </span>
            );
          } else {
            badge = (
              <span
                style={tagStyle(
                  "rgba(52,211,153,0.10)",
                  "#34d399",
                  "rgba(52,211,153,0.20)",
                )}
              >
                <Clock size={11} /> Active
              </span>
            );
          }

          return (
            <div
              key={a.id}
              style={{
                background: t.courseCardBg,
                border: `1px solid ${isSubmitted ? "rgba(52,211,153,0.35)" : t.border}`,
                borderRadius: 20,
                boxShadow: t.shadow,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                transition: "all 0.2s",
                opacity: unlocked ? 1 : 0.6,
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                if (!unlocked) return;
                e.currentTarget.style.boxShadow = t.shadowHov;
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = t.shadow;
                e.currentTarget.style.transform = "none";
              }}
            >
              {/* Top accent bar */}
              <div
                style={{
                  height: 4,
                  background: unlocked
                    ? `linear-gradient(90deg, ${accent}, transparent)`
                    : t.barBg,
                }}
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
                    marginBottom: 12,
                  }}
                >
                  <h2
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: unlocked ? t.text : t.textMuted,
                      margin: 0,
                      lineHeight: 1.4,
                      fontFamily: "'Poppins',sans-serif",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 6,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {!unlocked && (
                      <Lock
                        size={13}
                        style={{
                          color: "#fb923c",
                          flexShrink: 0,
                          marginTop: 2,
                        }}
                      />
                    )}
                    {index + 1}. {a.title}
                  </h2>
                </div>

                <div style={{ marginBottom: 6 }}>{badge}</div>

                {a.description && (
                  <p
                    style={{
                      fontSize: 12,
                      color: t.textMuted,
                      lineHeight: 1.5,
                      margin: "10px 0 16px",
                      fontFamily: "'Poppins',sans-serif",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {a.description}
                  </p>
                )}

                <div
                  style={{
                    height: 1,
                    background: t.border,
                    margin: "0 0 16px",
                  }}
                />

                {/* Meta */}
                <div
                  style={{
                    display: "flex",
                    gap: 16,
                    flexWrap: "wrap",
                    marginBottom: 12,
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      fontSize: 12,
                      fontWeight: 500,
                      color: t.textMuted,
                      fontFamily: "'Poppins',sans-serif",
                    }}
                  >
                    <Calendar size={13} style={{ color: "#a78bfa" }} />
                    {new Date(a.deadline).toLocaleDateString()}
                  </span>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      fontSize: 12,
                      fontWeight: 500,
                      color: t.textMuted,
                      fontFamily: "'Poppins',sans-serif",
                    }}
                  >
                    <FileText size={13} style={{ color: "#fb923c" }} />
                    {a.maxMarks} Marks
                  </span>
                </div>

                {unlocked && !isSubmitted && (
                  <p
                    style={{
                      fontSize: 10,
                      fontStyle: "italic",
                      color: t.textMuted,
                      margin: "0 0 12px",
                      opacity: 0.8,
                      fontFamily: "'Poppins',sans-serif",
                    }}
                  >
                    Submit to unlock the next assignment
                  </p>
                )}

                {/* Button */}
                <button
                  onClick={() => handleNavigate(a, index)}
                  style={{
                    marginTop: "auto",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    padding: "12px 20px",
                    borderRadius: 12,
                    border: "none",
                    fontFamily: "'Poppins',sans-serif",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: unlocked ? "pointer" : "not-allowed",
                    background: isSubmitted
                      ? "#34d399"
                      : !unlocked
                        ? t.barBg
                        : "linear-gradient(135deg,#7c3aed,#a855f7)",
                    color: isSubmitted
                      ? "#0a0a0a"
                      : !unlocked
                        ? t.textMuted
                        : "#fff",
                  }}
                >
                  {isSubmitted ? (
                    <>
                      <CheckCircle2 size={15} /> View Submission
                    </>
                  ) : !unlocked ? (
                    <>
                      <Lock size={15} /> Locked
                    </>
                  ) : (
                    <>
                      View / Submit <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </PageContainer>
  );
}

/* Small shared helper for the status tag pills */
function tagStyle(bg, color, border) {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    padding: "4px 10px",
    borderRadius: 8,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.04em",
    background: bg,
    color,
    border: `1px solid ${border}`,
    fontFamily: "'Poppins',sans-serif",
  };
}
