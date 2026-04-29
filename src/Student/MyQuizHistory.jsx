import React, { useEffect, useRef, useState, useCallback } from "react";
import { getMyQuizHistory } from "../services/assessmentService";
import {
  Trophy,
  Calendar,
  TrendingUp,
  FileText,
  CheckCircle2,
  XCircle,
  Sparkles,
  Activity,
  ArrowUpRight,
} from "lucide-react";

/* ═══════════════════════════════════════════════
   THEME TOKEN MAP (matches Component 1 exactly)
═══════════════════════════════════════════════ */
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
    gridLine: "rgba(255,255,255,0.5)",
    barBg: "rgba(255,255,255,0.05)",
    actBar: "rgba(255,255,255,0.5)",
    actIcon: "rgba(255,255,255,0.3)",
    actBg: "rgba(255,255,255,0.04)",
    actBorder: "rgba(255,255,255,0.07)",
    shadow: "0 4px 20px rgba(0,0,0,0.4)",
    shadowHov: "0 20px 60px rgba(0,0,0,0.6)",
    emptyBorder: "rgba(255,255,255,0.07)",
    emptyBg: "rgba(255,255,255,0.02)",
    emptyIcon: "rgba(255,255,255,0.12)",
    recentItemBg: "rgba(255,255,255,0.03)",
    recentItemBorder: "rgba(255,255,255,0.05)",
    recentItemBgHov: "rgba(255,255,255,0.06)",
    overdueBg: "rgba(239,68,68,0.12)",
    overdueText: "#f87171",
    overdueBorder: "rgba(239,68,68,0.2)",
    splitBg: "#111111",
    splitBorder: "rgba(255,255,255,0.06)",
    dragBg: "rgba(255,255,255,0.04)",
    dragBorder: "rgba(255,255,255,0.08)",
    dragHov: "rgba(124,58,237,0.12)",
    tableHeaderBg: "rgba(255,255,255,0.03)",
    rowHov: "rgba(255,255,255,0.03)",
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
    gridLine: "rgba(0,0,0,0.12)",
    barBg: "#f1f5f9",
    actBar: "#94a3b8",
    actIcon: "#94a3b8",
    actBg: "#f8fafc",
    actBorder: "#e2e8f0",
    shadow: "0 1px 8px rgba(0,0,0,0.07)",
    shadowHov: "0 8px 32px rgba(0,0,0,0.10)",
    emptyBorder: "#e2e8f0",
    emptyBg: "#f8fafc",
    emptyIcon: "#cbd5e1",
    recentItemBg: "#f8fafc",
    recentItemBorder: "#e2e8f0",
    recentItemBgHov: "#f1f5f9",
    overdueBg: "#fef2f2",
    overdueText: "#ef4444",
    overdueBorder: "#fecaca",
    splitBg: "#ffffff",
    splitBorder: "#e2e8f0",
    dragBg: "#f1f5f9",
    dragBorder: "#e2e8f0",
    dragHov: "rgba(124,58,237,0.08)",
    tableHeaderBg: "#f8fafc",
    rowHov: "#f8fafc",
  },
};

/* ═══════════════════════════════════════════════
   STAT CARD (Component 1 design)
═══════════════════════════════════════════════ */
const StatCard = ({ icon: Icon, value, label, color, t }) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? t.cardBgHov : t.cardBg,
        border: `1px solid ${hov ? t.borderHov : t.border}`,
        boxShadow: hov ? `${t.shadowHov}, 0 0 40px ${color}12` : t.shadow,
        borderRadius: 20, padding: "22px 22px 20px",
        display: "flex", flexDirection: "column", gap: 14,
        transition: "all 0.25s ease", position: "relative", overflow: "hidden",
        cursor: "default",
      }}
    >
      <div style={{
        position: "absolute", top: -20, right: -20, width: 90, height: 90,
        borderRadius: "50%", background: color, filter: "blur(40px)",
        opacity: hov ? 0.15 : 0.04, transition: "opacity 0.4s", pointerEvents: "none",
      }} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{
          width: 42, height: 42, borderRadius: 12,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: `${color}18`, border: `1px solid ${color}30`,
        }}>
          <Icon size={19} color={color} strokeWidth={2} />
        </div>
        <ArrowUpRight size={13} style={{ color, opacity: hov ? 0.7 : 0, transition: "opacity 0.2s" }} />
      </div>
      <div>
        <p style={{
          fontSize: 38, fontWeight: 800, lineHeight: 1,
          fontFamily: "'Poppins',sans-serif", color: t.text, margin: 0,
        }}>{value}</p>
        <p style={{
          fontSize: 10, fontWeight: 600, letterSpacing: "0.1em",
          textTransform: "uppercase", color: t.textMuted,
          fontFamily: "'Poppins',sans-serif", margin: "6px 0 0",
        }}>{label}</p>
      </div>
      <div style={{ height: 2, background: t.barBg, borderRadius: 99, overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 99, background: color,
          width: hov ? "65%" : "20%", transition: "width 0.65s ease", opacity: 0.85,
        }} />
      </div>
      <div style={{
        position: "absolute", bottom: 0, left: 0,
        width: hov ? "60%" : "30%", height: 1,
        background: `linear-gradient(90deg,${color},transparent)`,
        transition: "width 0.5s ease", opacity: 0.5,
      }} />
    </div>
  );
};

export default function MyQuizHistory() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= THEME (Component 1 logic) ================= */
  const [isDark, setIsDark] = useState(
    () =>
      typeof document !== "undefined" &&
      (document.documentElement.classList.contains("dark") ||
        document.documentElement.getAttribute("data-theme") === "dark")
  );

  useEffect(() => {
    const obs = new MutationObserver(() => {
      setIsDark(
        document.documentElement.classList.contains("dark") ||
          document.documentElement.getAttribute("data-theme") === "dark"
      );
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
    return () => obs.disconnect();
  }, []);

  const t = isDark ? T.dark : T.light;

  /* ================= RESIZABLE PANEL ================= */
  const [leftWidth, setLeftWidth] = useState(65);
  const isDragging = useRef(false);
  const containerRef = useRef(null);

  const onMouseDown = useCallback(() => {
    isDragging.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  const onMouseMove = useCallback((e) => {
    if (!isDragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const newLeft = ((e.clientX - rect.left) / rect.width) * 100;
    if (newLeft > 30 && newLeft < 80) setLeftWidth(newLeft);
  }, []);

  const onMouseUp = useCallback(() => {
    isDragging.current = false;
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  /* ================= DATA ================= */
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const res = await getMyQuizHistory();
      const list = res?.data?.data || res?.data?.attempts || res?.data || [];
      setAttempts(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Failed to load quiz history", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOGIC ================= */
  const getPercent = (a) => (a.percentage || 0).toFixed(1);
  const isPassed = (a) => (a.percentage || 0) >= 50;

  // Calculate total questions from score + percentage
  // e.g. score=2, percentage=66.7 → total = round(2 / 0.667) = 3
  // Falls back to known backend fields if available
  const getTotalQuestions = (a) => {
    // Direct field from backend (preferred)
    const direct =
      a.totalQuestions ??
      a.total_questions ??
      a.quiz?.totalQuestions ??
      a.quiz?.questions?.length ??
      null;
    if (direct != null) return direct;

    // Derive from score + percentage
    const score = a.score ?? 0;
    const pct = a.percentage ?? 0;
    if (score > 0 && pct > 0) {
      return Math.round(score / (pct / 100));
    }
    // score=0 means either 0/N (failed) — can't derive total, show just 0
    return null;
  };

  // Returns "2/3" or just "0" if total unknown
  const getScoreDisplay = (a) => {
    const score = a.score ?? 0;
    const total = getTotalQuestions(a);
    return total != null ? `${score}/${total}` : `${score}`;
  };

  /* ================= STATS ================= */
  const totalAttempts = attempts.length;
  const passedAttempts = attempts.filter((a) => isPassed(a)).length;
  const averageScore =
    attempts.length > 0
      ? attempts.reduce((sum, a) => sum + (a.percentage || 0), 0) /
        attempts.length
      : 0;

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        background: isDark ? "#0a0a0a" : "#f1f5f9",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 52, height: 52, borderRadius: "50%",
            border: "3px solid #7c3aed", borderTopColor: "transparent",
            animation: "spin 0.8s linear infinite", margin: "0 auto 16px",
          }} />
          <p style={{ color: isDark ? "rgba(255,255,255,0.3)" : "#94a3b8", fontSize: 12, fontFamily: "'Poppins',sans-serif" }}>
            Loading quiz history...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        .dfade{animation:fadeUp 0.45s ease both}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.15}}
        .d1{animation:blink 1.6s ease infinite}
        .d2{animation:blink 1.6s 0.3s ease infinite}
        .d3{animation:blink 1.6s 0.6s ease infinite}
        @keyframes pulse-ring{0%{box-shadow:0 0 0 0 rgba(124,58,237,0.5)}70%{box-shadow:0 0 0 8px rgba(124,58,237,0)}100%{box-shadow:0 0 0 0 rgba(124,58,237,0)}}
        .livebadge{animation:pulse-ring 2.2s ease-out infinite}
        .drag-handle:hover{background:rgba(124,58,237,0.12)!important}
      `}</style>

      <div style={{
        minHeight: "100vh", background: t.pageBg, color: t.text,
        fontFamily: "'Poppins',sans-serif",
        transition: "background 0.3s, color 0.3s",
      }}>
        <div style={{ padding: 24, maxWidth: 1300, margin: "0 auto", paddingBottom: 52 }}>

          {/* ═══ HERO (Component 1 design) ═══ */}
          <div className="dfade" style={{
            borderRadius: 24, padding: "30px 36px",
            background: t.heroBg, border: `1px solid ${t.borderHero}`,
            position: "relative", overflow: "hidden",
            marginBottom: 20, boxShadow: t.shadow,
          }}>
            <div style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              opacity: isDark ? 0.04 : 0.025,
              backgroundImage: `linear-gradient(${t.gridLine} 1px,transparent 1px),linear-gradient(90deg,${t.gridLine} 1px,transparent 1px)`,
              backgroundSize: "40px 40px",
            }} />
            <div style={{
              position: "absolute", top: "-30%", left: "40%",
              width: 300, height: 200,
              background: "radial-gradient(ellipse,rgba(124,58,237,0.06),transparent 70%)",
              pointerEvents: "none",
            }} />

            <div style={{
              position: "relative", display: "flex", alignItems: "center",
              justifyContent: "space-between", flexWrap: "wrap", gap: 16,
            }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
                  <Sparkles size={11} color={t.textSub} />
                  <span style={{
                    fontSize: 9, fontWeight: 700, letterSpacing: "0.22em",
                    textTransform: "uppercase", color: t.textSub,
                    fontFamily: "'Poppins',sans-serif",
                  }}>Performance Tracking</span>
                </div>
                <h1 style={{
                  fontFamily: "'Poppins',sans-serif", fontWeight: 900,
                  fontSize: "clamp(1.6rem,3vw,2.4rem)", color: t.text,
                  margin: 0, lineHeight: 1.1, letterSpacing: "-0.02em",
                }}>My Quiz History</h1>
                <p style={{
                  fontSize: 12, color: t.textSub, marginTop: 7,
                  fontWeight: 500, fontFamily: "'Poppins',sans-serif",
                }}>Track your assessment performance and review quiz attempts</p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 12,
                  background: t.actBg, border: `1px solid ${t.actBorder}`,
                  borderRadius: 12, padding: "8px 16px",
                  fontSize: 11, fontWeight: 600,
                  fontFamily: "'Poppins',sans-serif", color: t.textSub,
                }}>
                  <span>{totalAttempts} attempts</span>
                  <span style={{ width: 1, height: 14, background: t.actBorder }} />
                  <span style={{ color: "#34d399", fontWeight: 700 }}>{passedAttempts} passed</span>
                  <span style={{ width: 1, height: 14, background: t.actBorder }} />
                  <span style={{ color: "#7c3aed", fontWeight: 700 }}>{averageScore.toFixed(1)}% avg</span>
                </div>
                <div style={{
                  display: "flex", alignItems: "center", gap: 8,
                  background: t.actBg, border: `1px solid ${t.actBorder}`,
                  borderRadius: 10, padding: "8px 14px",
                }}>
                  <Activity size={12} color={t.actIcon} />
                  <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 14 }}>
                    <span className="d1" style={{ width: 3, height: 10, borderRadius: 2, background: t.actBar, display: "block" }} />
                    <span className="d2" style={{ width: 3, height: 14, borderRadius: 2, background: t.actBar, display: "block" }} />
                    <span className="d3" style={{ width: 3, height: 7, borderRadius: 2, background: t.actBar, display: "block" }} />
                  </div>
                </div>
                <div className="livebadge" style={{
                  display: "flex", alignItems: "center", gap: 7,
                  background: "rgba(124,58,237,0.08)",
                  border: "1px solid rgba(124,58,237,0.3)",
                  borderRadius: 999, padding: "8px 18px",
                  color: "#7c3aed", fontSize: 11, fontWeight: 700,
                  letterSpacing: "0.1em", fontFamily: "'Poppins',sans-serif",
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#7c3aed", display: "inline-block" }} />
                  LIVE
                </div>
              </div>
            </div>
          </div>

          {/* ═══ STAT CARDS (Component 1 design) ═══ */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(185px,1fr))",
            gap: 14, marginBottom: 20,
          }}>
            <StatCard icon={FileText}     value={totalAttempts}                  label="Total Attempts" color="#22d3ee" t={t} />
            <StatCard icon={CheckCircle2} value={passedAttempts}                 label="Passed"         color="#34d399" t={t} />
            <StatCard icon={XCircle}      value={totalAttempts - passedAttempts} label="Failed"         color="#f87171" t={t} />
            <StatCard icon={TrendingUp}   value={`${averageScore.toFixed(1)}%`}  label="Avg Score"      color="#a78bfa" t={t} />
          </div>

          {/* ===== EMPTY STATE ===== */}
          {attempts.length === 0 ? (
            <div className="dfade" style={{
              borderRadius: 24, border: `1.5px dashed ${t.emptyBorder}`,
              background: t.emptyBg, padding: "64px 0",
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", gap: 14, boxShadow: t.shadow,
            }}>
              <div style={{
                width: 64, height: 64, borderRadius: 18,
                display: "flex", alignItems: "center", justifyContent: "center",
                border: `1.5px dashed ${t.emptyBorder}`, background: t.emptyBg,
              }}>
                <FileText size={26} color={t.emptyIcon} />
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: t.text, margin: 0, fontFamily: "'Poppins',sans-serif" }}>No Quiz Attempts Yet</p>
                <p style={{ fontSize: 11, color: t.textMuted, margin: "4px 0 0", fontFamily: "'Poppins',sans-serif" }}>
                  Your quiz attempts will appear here once you start taking assessments
                </p>
              </div>
            </div>
          ) : (
            /* ===== SPLIT PANEL (Component 2 layout + Component 1 styling) ===== */
            <div
              ref={containerRef}
              className="dfade"
              style={{
                display: "flex",
                overflow: "hidden",
                borderRadius: 24,
                border: `1px solid ${t.splitBorder}`,
                background: t.splitBg,
                boxShadow: t.shadow,
                height: "calc(100vh - 340px)",
                minHeight: 400,
              }}
            >
              {/* ---- LEFT: Quiz List ---- */}
              <div
                style={{
                  display: "flex", flexDirection: "column", overflow: "hidden",
                  width: `${leftWidth}%`, minWidth: "30%",
                }}
              >
                {/* Panel Header */}
                <div style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "18px 22px",
                  borderBottom: `1px solid ${t.border}`,
                }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 10,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)",
                  }}>
                    <FileText size={15} color="#7c3aed" />
                  </div>
                  <div>
                    <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 13, color: t.text, display: "block" }}>All Attempts</span>
                    <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 10, color: t.textMuted }}>Drag the handle to resize panels</span>
                  </div>
                </div>

                {/* Table header */}
                <div style={{
                  display: "grid", gridTemplateColumns: "1fr auto auto auto",
                  gap: 8, padding: "10px 22px",
                  background: t.tableHeaderBg,
                  borderBottom: `1px solid ${t.border}`,
                  fontSize: 10, fontWeight: 700,
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  color: t.textMuted, fontFamily: "'Poppins',sans-serif",
                }}>
                  <span>Quiz</span>
                  <span style={{ minWidth: 80 }}>Score</span>
                  <span style={{ minWidth: 70 }}>Date</span>
                  <span style={{ minWidth: 60 }}>Result</span>
                </div>

                <div style={{ flex: 1, overflowY: "auto" }}>
                  {attempts.map((a, idx) => {
                    const percent = getPercent(a);
                    const passed = isPassed(a);
                    const scoreDisplay = getScoreDisplay(a);
                    const accentColor = passed ? "#34d399" : "#f87171";

                    return (
                      <div
                        key={idx}
                        style={{
                          display: "grid", gridTemplateColumns: "1fr auto auto auto",
                          gap: 8, alignItems: "center",
                          padding: "12px 22px",
                          borderBottom: `1px solid ${t.border}`,
                          transition: "background 0.15s",
                          cursor: "default",
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = t.rowHov}
                        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                      >
                        {/* Quiz name */}
                        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                          <div style={{
                            width: 32, height: 32, borderRadius: 9, flexShrink: 0,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            background: t.iconBg, border: `1px solid ${t.iconBorder}`,
                          }}>
                            <FileText size={13} color={t.textMuted} />
                          </div>
                          <span style={{
                            fontSize: 12, fontWeight: 700, color: t.text,
                            fontFamily: "'Poppins',sans-serif",
                            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                          }}>
                            {a.quizTitle || a.quiz?.title || "Quiz"}
                          </span>
                        </div>

                        {/* Score: "2/3" + percentage + mini bar */}
                        <div style={{ minWidth: 80 }}>
                          <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: t.text, fontFamily: "'Poppins',sans-serif" }}>
                            {scoreDisplay}
                            <span style={{ marginLeft: 4, fontSize: 10, fontWeight: 500, color: t.textMuted }}>correct</span>
                          </p>
                          <p style={{ margin: "1px 0 0", fontSize: 10, color: t.textMuted, fontFamily: "'Poppins',sans-serif" }}>{percent}%</p>
                          <div style={{ marginTop: 4, height: 4, borderRadius: 99, background: t.barBg, overflow: "hidden", width: 56 }}>
                            <div style={{
                              height: "100%", borderRadius: 99,
                              width: `${percent}%`,
                              background: passed
                                ? "linear-gradient(90deg,#16a34a,#22c55e)"
                                : "linear-gradient(90deg,#dc2626,#ef4444)",
                            }} />
                          </div>
                        </div>

                        {/* Date */}
                        <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 70 }}>
                          <Calendar size={11} color={t.textMuted} />
                          <span style={{ fontSize: 10, color: t.textMuted, fontFamily: "'Poppins',sans-serif" }}>
                            {a.submittedAt
                              ? new Date(a.submittedAt).toLocaleDateString()
                              : "—"}
                          </span>
                        </div>

                        {/* Result badge */}
                        <span style={{
                          fontSize: 9, fontWeight: 700, letterSpacing: "0.08em",
                          textTransform: "uppercase", padding: "4px 10px", borderRadius: 999,
                          background: passed ? "rgba(52,211,153,0.12)" : "rgba(248,113,113,0.12)",
                          color: accentColor,
                          border: `1px solid ${passed ? "rgba(52,211,153,0.3)" : "rgba(248,113,113,0.3)"}`,
                          fontFamily: "'Poppins',sans-serif",
                          display: "inline-flex", alignItems: "center", gap: 4,
                          whiteSpace: "nowrap",
                        }}>
                          {passed ? <CheckCircle2 size={9} /> : <XCircle size={9} />}
                          {passed ? "Pass" : "Fail"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ---- DRAG HANDLE (Component 1 styling) ---- */}
              <div
                className="drag-handle"
                onMouseDown={onMouseDown}
                style={{
                  position: "relative", flexShrink: 0, width: 12,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "col-resize",
                  background: t.dragBg,
                  borderLeft: `1px solid ${t.dragBorder}`,
                  borderRight: `1px solid ${t.dragBorder}`,
                  transition: "background 0.2s",
                  zIndex: 10,
                }}
              >
                <div style={{
                  display: "flex", alignItems: "center", gap: 2,
                  padding: "6px 4px", borderRadius: 8,
                  background: t.cardBg,
                  border: `1px solid ${t.border}`,
                  boxShadow: t.shadow,
                  userSelect: "none",
                }}>
                  <svg width="5" height="12" viewBox="0 0 6 12" fill="none">
                    <path d="M1 1L0 6L1 11" stroke={t.textMuted} strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <div style={{ width: 1, height: 14, background: t.border, margin: "0 1px" }} />
                  <svg width="5" height="12" viewBox="0 0 6 12" fill="none">
                    <path d="M5 1L6 6L5 11" stroke={t.textMuted} strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
              </div>

              {/* ---- RIGHT: Performance Summary (Component 1 styling) ---- */}
              <div style={{ display: "flex", flexDirection: "column", overflowY: "auto", flex: 1, minWidth: "20%" }}>
                {/* Panel Header */}
                <div style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "18px 22px",
                  borderBottom: `1px solid ${t.border}`,
                }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 10,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.2)",
                  }}>
                    <TrendingUp size={15} color="#22d3ee" />
                  </div>
                  <div>
                    <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 13, color: t.text, display: "block" }}>Performance</span>
                    <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 10, color: t.textMuted }}>Your summary</span>
                  </div>
                </div>

                <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: 20 }}>

                  {/* Avg score card */}
                  <div style={{
                    borderRadius: 16, padding: "20px 18px",
                    textAlign: "center",
                    border: `1px solid ${t.border}`,
                    background: t.recentItemBg,
                  }}>
                    <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: t.textMuted, margin: "0 0 10px", fontFamily: "'Poppins',sans-serif" }}>
                      Average Score
                    </p>
                    <p style={{ fontSize: 42, fontWeight: 800, color: "#a78bfa", margin: 0, fontFamily: "'Poppins',sans-serif", lineHeight: 1 }}>
                      {averageScore.toFixed(1)}%
                    </p>
                    <p style={{ fontSize: 10, color: t.textMuted, margin: "6px 0 12px", fontFamily: "'Poppins',sans-serif" }}>
                      across {totalAttempts} attempt{totalAttempts !== 1 ? "s" : ""}
                    </p>
                    <div style={{ height: 6, borderRadius: 99, background: t.barBg, overflow: "hidden" }}>
                      <div style={{
                        height: "100%", borderRadius: 99,
                        width: `${Math.min(averageScore, 100)}%`,
                        background: averageScore >= 50
                          ? "linear-gradient(90deg,#1d4ed8,#34d399)"
                          : "linear-gradient(90deg,#dc2626,#f97316)",
                        transition: "width 1s ease",
                      }} />
                    </div>
                  </div>

                  {/* Breakdown */}
                  <div>
                    <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: t.textMuted, margin: "0 0 10px", fontFamily: "'Poppins',sans-serif" }}>
                      Breakdown
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {[
                        { label: "Passed", value: passedAttempts, color: "#34d399" },
                        { label: "Failed", value: totalAttempts - passedAttempts, color: "#f87171" },
                        { label: "Total",  value: totalAttempts,                  color: "#22d3ee" },
                      ].map((s, i) => (
                        <div key={i} style={{
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                          padding: "10px 14px", borderRadius: 12,
                          background: t.recentItemBg, border: `1px solid ${t.recentItemBorder}`,
                        }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ width: 8, height: 8, borderRadius: "50%", background: s.color, display: "inline-block" }} />
                            <span style={{ fontSize: 12, color: t.text, fontFamily: "'Poppins',sans-serif", fontWeight: 500 }}>{s.label}</span>
                          </div>
                          <span style={{ fontSize: 13, fontWeight: 800, color: s.color, fontFamily: "'Poppins',sans-serif" }}>{s.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Best attempt */}
                  {(() => {
                    const best = attempts.reduce((prev, curr) =>
                      parseFloat(getPercent(curr)) > parseFloat(getPercent(prev))
                        ? curr
                        : prev,
                    );
                    return (
                      <div>
                        <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: t.textMuted, margin: "0 0 10px", fontFamily: "'Poppins',sans-serif" }}>
                          Best Attempt
                        </p>
                        <div style={{
                          display: "flex", alignItems: "center", gap: 12,
                          padding: "12px 14px", borderRadius: 12,
                          background: "rgba(245,158,11,0.06)",
                          border: "1px solid rgba(245,158,11,0.2)",
                        }}>
                          <div style={{
                            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)",
                          }}>
                            <Trophy size={15} color="#f59e0b" />
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: t.text, fontFamily: "'Poppins',sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {best.quizTitle || best.quiz?.title || "Quiz"}
                            </p>
                            <p style={{ margin: "2px 0 0", fontSize: 10, color: t.textMuted, fontFamily: "'Poppins',sans-serif" }}>
                              {getScoreDisplay(best)} correct · {getPercent(best)}%
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}