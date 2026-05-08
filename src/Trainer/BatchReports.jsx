import { useState, useEffect } from "react";
import {
  Users,
  BookOpen,
  Video,
  FileText,
  ClipboardList,
  BarChart3,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import { progressService } from "../services/progressService";
import { getTrainerBatches } from "../services/batchService";

/* ─── Theme tokens (identical to Dashboard) ─────────────────────────────── */
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
    barBg: "rgba(255,255,255,0.05)",
    actBg: "rgba(255,255,255,0.04)",
    actBorder: "rgba(255,255,255,0.07)",
    shadow: "0 4px 20px rgba(0,0,0,0.4)",
    shadowHov: "0 20px 60px rgba(0,0,0,0.6)",
    recentItemBg: "rgba(255,255,255,0.03)",
    recentItemBorder: "rgba(255,255,255,0.05)",
    recentItemBgHov: "rgba(255,255,255,0.06)",
    emptyBorder: "rgba(255,255,255,0.07)",
    emptyBg: "rgba(255,255,255,0.02)",
    emptyIcon: "rgba(255,255,255,0.12)",
    scrollbar: "rgba(255,255,255,0.08)",
    activeRowBg: "rgba(34,211,238,0.06)",
    activeRowBorder: "rgba(34,211,238,0.2)",
    tableTh: "rgba(255,255,255,0.2)",
    tableThBg: "rgba(0,0,0,0.3)",
    gridLine: "rgba(255,255,255,0.5)",
    tableRowHov: "rgba(255,255,255,0.03)",
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
    barBg: "#f1f5f9",
    actBg: "#f8fafc",
    actBorder: "#e2e8f0",
    shadow: "0 1px 8px rgba(0,0,0,0.07)",
    shadowHov: "0 8px 32px rgba(0,0,0,0.10)",
    recentItemBg: "#f8fafc",
    recentItemBorder: "#e2e8f0",
    recentItemBgHov: "#f1f5f9",
    emptyBorder: "#e2e8f0",
    emptyBg: "#f8fafc",
    emptyIcon: "#cbd5e1",
    scrollbar: "#e2e8f0",
    activeRowBg: "rgba(8,145,178,0.05)",
    activeRowBorder: "rgba(8,145,178,0.2)",
    tableTh: "#94a3b8",
    tableThBg: "#f8fafc",
    gridLine: "rgba(0,0,0,0.12)",
    tableRowHov: "#f8fafc",
  },
};

/* ─── Constants ──────────────────────────────────────────────────────────── */
const METRIC_COLORS = {
  video: "#f43f5e",
  file: "#2dd4bf",
  quiz: "#a78bfa",
  assignment: "#f59e0b",
  course: "#22d3ee",
  overall: "#34d399",
  students: "#ffffff",
};

const AV_PALETTES = [
  { bg: "linear-gradient(135deg,#34d399,#059669)", text: "#fff" },
  { bg: "linear-gradient(135deg,#a78bfa,#7c3aed)", text: "#fff" },
  { bg: "linear-gradient(135deg,#fb923c,#dc2626)", text: "#fff" },
  { bg: "linear-gradient(135deg,#38bdf8,#0369a1)", text: "#fff" },
  { bg: "linear-gradient(135deg,#fbbf24,#d97706)", text: "#1c1917" },
];

function fmt(v) {
  return typeof v === "number" ? Math.round(v) : 0;
}
function initials(email = "") {
  const name = email.split("@")[0];
  const parts = name.split(/[._-]/);
  return parts.length > 1
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
}
function progColor(v) {
  return v >= 75 ? METRIC_COLORS.overall : v >= 50 ? METRIC_COLORS.assignment : "#ef4444";
}

/* ─── Donut Ring (identical to Dashboard) ───────────────────────────────── */
function DonutRing({ value, color, size = 56, strokeW = 5 }) {
  const r = (size - strokeW * 2) / 2;
  const circ = 2 * Math.PI * r;
  const progress = (value / 100) * circ;
  const cx = size / 2, cy = size / 2;
  return (
    <svg width={size} height={size}
      style={{ transform: "rotate(-90deg)", filter: `drop-shadow(0 0 8px ${color}60)` }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeW} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={strokeW}
        strokeLinecap="round" strokeDasharray={`${progress} ${circ}`}
        style={{ transition: "stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1)" }} />
    </svg>
  );
}

/* ─── Radar Chart ────────────────────────────────────────────────────────── */
function RadarChart({ data, isDark }) {
  const axes = [
    { label: "Videos", val: data.videoWatchPercentage ?? 0 },
    { label: "Files", val: data.fileDownloadPercentage ?? 0 },
    { label: "Quizzes", val: data.quizCompletionPercentage ?? 0 },
    { label: "Assignments", val: data.assignmentCompletionPercentage ?? 0 },
    { label: "Course", val: data.courseProgressPercentage ?? 0 },
  ];
  const N = axes.length, cx = 130, cy = 120, r = 82;
  const ang = (i) => (Math.PI * 2 * i) / N - Math.PI / 2;
  const pt = (i, pct) => {
    const a = ang(i), d = (pct / 100) * r;
    return [cx + d * Math.cos(a), cy + d * Math.sin(a)];
  };
  const poly = axes.map((a, i) => pt(i, a.val).join(",")).join(" ");
  const radarFill = isDark ? "rgba(34,211,238,0.12)" : "rgba(8,145,178,0.1)";
  const radarStroke = isDark ? "#22d3ee" : "#0891b2";
  const ringStroke = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const labelColor = isDark ? "rgba(255,255,255,0.4)" : "#94a3b8";
  return (
    <svg viewBox="0 0 260 240" style={{ width: "100%", maxWidth: 200 }}>
      {[20, 40, 60, 80, 100].map((ring) => (
        <polygon key={ring} points={axes.map((_, i) => pt(i, ring).join(",")).join(" ")}
          fill="none" stroke={ringStroke} strokeWidth="1" />
      ))}
      {axes.map((_, i) => {
        const [x2, y2] = pt(i, 100);
        return <line key={i} x1={cx} y1={cy} x2={x2} y2={y2} stroke={ringStroke} strokeWidth="1" />;
      })}
      <polygon points={poly} fill={radarFill} stroke={radarStroke} strokeWidth="1.5" />
      {axes.map((a, i) => {
        const [x, y] = pt(i, a.val);
        return <circle key={i} cx={x} cy={y} r={3} fill={radarStroke}
          style={{ filter: `drop-shadow(0 0 4px ${radarStroke})` }} />;
      })}
      {axes.map((a, i) => {
        const [x, y] = pt(i, 115);
        return (
          <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle"
            fontSize="10" fill={labelColor} fontFamily="'Poppins',sans-serif">
            {a.label}
          </text>
        );
      })}
    </svg>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────── */
export default function BatchReports() {
  const [isDark, setIsDark] = useState(
    () => typeof document !== "undefined" &&
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

  const [batches, setBatches] = useState([]);
  const [batchesLoading, setBatchesLoading] = useState(true);
  const [selectedBatchId, setSelectedBatchId] = useState(null);
  const [report, setReport] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [tab, setTab] = useState("table");

  useEffect(() => {
    getTrainerBatches()
      .then((data) => {
        const list = data || [];
        setBatches(list);
        if (list.length > 0) setSelectedBatchId(list[0].id);
        setBatchesLoading(false);
      })
      .catch(() => setBatchesLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedBatchId) return;
    setReport(null);
    setSelectedStudent(null);
    setReportLoading(true);
    setReportError(null);
    progressService.getBatchProgressReport(selectedBatchId)
      .then((res) => {
        setReport(res.data);
        setReportLoading(false);
      })
      .catch((err) => {
        setReportError(err.response?.data?.message || err.message);
        setReportLoading(false);
      });
  }, [selectedBatchId]);

  const students = report?.studentReports || [];

  const card = {
    background: t.cardBg,
    border: `1px solid ${t.border}`,
    borderRadius: 20,
    boxShadow: t.shadow,
    overflow: "hidden",
    position: "relative",
  };

  if (batchesLoading) return (
    <>
      <style>{styles(t)}</style>
      <div style={{ minHeight: "100vh", background: t.pageBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader t={t} text="Loading..." />
      </div>
    </>
  );

  /* Stat cards config */
  const statCards = report ? [
    { label: "Total Students", val: report.totalStudents, raw: true, color: t.text },
    { label: "Avg Overall", val: report.avgOverallProgressPercentage, color: progColor(report.avgOverallProgressPercentage) },
    { label: "Avg Video", val: report.avgVideoWatchPercentage, color: METRIC_COLORS.video },
    { label: "Avg Files", val: report.avgFileDownloadPercentage, color: METRIC_COLORS.file },
    { label: "Avg Quizzes", val: report.avgQuizCompletionPercentage, color: METRIC_COLORS.quiz },
    { label: "Avg Assignments", val: report.avgAssignmentCompletionPercentage, color: METRIC_COLORS.assignment },
  ] : [];

  return (
    <>
      <style>{styles(t)}</style>
      <div style={{ minHeight: "100vh", background: t.pageBg, color: t.text, fontFamily: "'Poppins',sans-serif", padding: 24 }}>
        <div style={{ maxWidth: 1300, margin: "0 auto", paddingBottom: 52 }}>

          {/* ═══ HERO HEADER ═══ */}
          <div className="br-fade" style={{
            borderRadius: 24, padding: "28px 32px",
            background: t.heroBg, border: `1px solid ${t.borderHero}`,
            position: "relative", overflow: "hidden", marginBottom: 20, boxShadow: t.shadow,
          }}>
            <div style={{
              position: "absolute", inset: 0, pointerEvents: "none", opacity: isDark ? 0.04 : 0.025,
              backgroundImage: `linear-gradient(${t.gridLine} 1px,transparent 1px),linear-gradient(90deg,${t.gridLine} 1px,transparent 1px)`,
              backgroundSize: "40px 40px",
            }} />
            <div style={{
              position: "absolute", top: "-30%", right: "10%",
              width: 260, height: 180,
              background: "radial-gradient(ellipse,rgba(167,139,250,0.07),transparent 70%)",
              pointerEvents: "none",
            }} />
            <div style={{ position: "relative", display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
                  <BarChart3 size={11} color={t.textSub} />
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: t.textSub }}>
                    Batch Analytics
                  </span>
                </div>
                <h1 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 900, fontSize: "clamp(1.4rem,2.5vw,2rem)", color: t.text, margin: 0, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
                  Batch Progress Report
                </h1>
                <p style={{ fontSize: 12, color: t.textSub, marginTop: 7, fontWeight: 500 }}>
                  Monitor cohort performance and individual learner progress
                </p>
              </div>
              {/* Batch selector */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                {batches.map((b) => {
                  const active = selectedBatchId === b.id;
                  return (
                    <button key={b.id} onClick={() => setSelectedBatchId(b.id)}
                      style={{
                        display: "flex", alignItems: "center", gap: 6,
                        padding: "8px 18px", borderRadius: 10, fontSize: 12, fontWeight: 600,
                        cursor: "pointer", fontFamily: "'Poppins',sans-serif", transition: "all .2s",
                        border: `1px solid ${active ? "rgba(167,139,250,0.4)" : t.border}`,
                        background: active ? "rgba(167,139,250,0.1)" : t.pillBg,
                        color: active ? "#a78bfa" : t.textMuted,
                        boxShadow: active ? "0 0 16px rgba(167,139,250,0.15)" : "none",
                      }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor" }} />
                      Batch {b.id}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Loading / Error */}
          {reportLoading && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200 }}>
              <Loader t={t} text="Loading batch data…" />
            </div>
          )}
          {reportError && (
            <div style={{ padding: 20, textAlign: "center", fontSize: 13, color: "#ef4444" }}>{reportError}</div>
          )}

          {!reportLoading && !reportError && report && (
            <>
              {/* ═══ STAT CARDS ROW ═══ */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 12, marginBottom: 20 }} className="br-stats-grid">
                {statCards.map((m, i) => (
                  <StatCard key={m.label} m={m} t={t} isDark={isDark} />
                ))}
              </div>

              {/* ═══ MAIN TWO-COLUMN GRID ═══ */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "start" }} className="br-main-grid">

                {/* LEFT: student list */}
                <div style={{ ...card }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,rgba(34,211,238,0.35),transparent)" }} />

                  {/* Tabs */}
                  <div style={{ display: "flex", alignItems: "center", padding: "0 16px", borderBottom: `1px solid ${t.border}` }}>
                    {["table", "bars"].map((tabKey) => {
                      const active = tab === tabKey;
                      return (
                        <button key={tabKey} onClick={() => setTab(tabKey)}
                          style={{
                            padding: "14px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer",
                            color: active ? "#22d3ee" : t.textMuted,
                            border: "none", borderBottom: `2px solid ${active ? "#22d3ee" : "transparent"}`,
                            marginBottom: -1, background: "none",
                            fontFamily: "'Poppins',sans-serif", transition: "all .15s", letterSpacing: "0.03em",
                          }}>
                          {tabKey === "table" ? "↗ Table" : "▦ Bars"}
                        </button>
                      );
                    })}
                    <span style={{ marginLeft: "auto", fontSize: 11, color: t.textLabel }}>
                      {students.length} students
                    </span>
                  </div>

                  {/* Empty */}
                  {students.length === 0 && (
                    <div style={{ padding: "3rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 48, height: 48, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", border: `1.5px dashed ${t.emptyBorder}`, background: t.emptyBg }}>
                        <Users size={20} color={t.emptyIcon} />
                      </div>
                      <p style={{ fontSize: 11, color: t.textMuted, margin: 0, fontWeight: 500 }}>No students in this batch</p>
                    </div>
                  )}

                  {/* TABLE TAB */}
                  {tab === "table" && students.length > 0 && (
                    <div style={{ overflowX: "auto", maxHeight: 520, overflowY: "auto" }} className="br-scroll">
                      <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                          <tr>
                            {["Student", "Videos", "Files", "Quizzes", "Assign.", "Overall"].map((th) => (
                              <th key={th} style={{
                                fontSize: 10, fontWeight: 700, color: t.tableTh,
                                textTransform: "uppercase", letterSpacing: "0.08em",
                                padding: "12px 14px", textAlign: "left",
                                borderBottom: `1px solid ${t.border}`,
                                background: t.tableThBg,
                                position: "sticky", top: 0, whiteSpace: "nowrap",
                              }}>
                                {th}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {students.map((s, i) => {
                            const pal = AV_PALETTES[i % 5];
                            const isActive = selectedStudent?.studentEmail === s.studentEmail;
                            const oc = progColor(s.overallProgressPercentage);
                            return (
                              <TableRow key={s.studentEmail} s={s} pal={pal} isActive={isActive} t={t} oc={oc}
                                onClick={() => setSelectedStudent(isActive ? null : s)} />
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* BARS TAB */}
                  {tab === "bars" && students.length > 0 && (
                    <div style={{ padding: 12, maxHeight: 520, overflowY: "auto" }} className="br-scroll">
                      {students.map((s, i) => {
                        const pal = AV_PALETTES[i % 5];
                        const isActive = selectedStudent?.studentEmail === s.studentEmail;
                        const oc = progColor(s.overallProgressPercentage);
                        return (
                          <BarRow key={s.studentEmail} s={s} pal={pal} isActive={isActive} t={t} oc={oc}
                            onClick={() => setSelectedStudent(isActive ? null : s)} />
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* RIGHT: Detail panel */}
                <div style={{ ...card, minHeight: 400 }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,rgba(167,139,250,0.35),transparent)" }} />

                  {!selectedStudent && (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 400, gap: 16 }}>
                      <div style={{ position: "absolute", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle,rgba(167,139,250,0.04) 0%,transparent 70%)", pointerEvents: "none" }} />
                      <div style={{ width: 72, height: 72, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: t.emptyBg, border: `1.5px dashed ${t.emptyBorder}` }}>
                        <Users size={28} color={t.emptyIcon} />
                      </div>
                      <p style={{ fontSize: 13, color: t.textMuted, fontWeight: 500, textAlign: "center", lineHeight: 1.6 }}>
                        Click a student to see<br />their detailed report
                      </p>
                    </div>
                  )}

                  {selectedStudent && (
                    <StudentDetail student={selectedStudent} selectedBatchId={selectedBatchId} t={t} isDark={isDark} />
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

/* ─── Stat Card ──────────────────────────────────────────────────────────── */
function StatCard({ m, t, isDark }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? t.cardBgHov : t.cardBg,
        border: `1px solid ${hov ? t.borderHov : t.border}`,
        borderRadius: 20, padding: "16px 14px", textAlign: "center",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
        transition: "all .2s", transform: hov ? "translateY(-3px)" : "none",
        boxShadow: hov ? t.shadowHov : t.shadow,
        position: "relative", overflow: "hidden",
      }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: `${m.color}08`, borderRadius: 20, pointerEvents: "none" }} />
      {m.raw ? (
        <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 30, fontWeight: 800, lineHeight: 1, color: t.text, margin: "6px 0 2px" }}>
          {m.val}
        </p>
      ) : (
        <>
          <DonutRing value={m.val || 0} color={m.color} size={52} strokeW={5} />
          <p style={{ fontSize: 11, fontWeight: 700, color: m.color, margin: 0 }}>
            {fmt(m.val)}%
          </p>
        </>
      )}
      <p style={{ fontSize: 10, fontWeight: 600, color: t.textMuted, margin: 0, textTransform: "uppercase", letterSpacing: "0.08em" }}>
        {m.label}
      </p>
    </div>
  );
}

/* ─── Table Row ──────────────────────────────────────────────────────────── */
function TableRow({ s, pal, isActive, t, oc, onClick }) {
  const [hov, setHov] = useState(false);
  const tdStyle = {
    padding: "10px 14px",
    borderBottom: `1px solid ${t.border}`,
    fontSize: 12, color: t.textSub, verticalAlign: "middle", cursor: "pointer",
    background: isActive ? t.activeRowBg : hov ? t.tableRowHov : "transparent",
    transition: "background .15s",
  };
  return (
    <tr onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      <td style={tdStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, background: pal.bg, color: pal.text, flexShrink: 0 }}>
            {initials(s.studentEmail)}
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, color: t.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 120 }}>
            {s.studentEmail.split("@")[0]}
          </span>
        </div>
      </td>
      <td style={tdStyle}><span style={{ fontSize: 12, fontWeight: 600, color: METRIC_COLORS.video }}>{fmt(s.videoWatchPercentage)}%</span></td>
      <td style={tdStyle}><span style={{ fontSize: 12, fontWeight: 600, color: METRIC_COLORS.file }}>{fmt(s.fileDownloadPercentage)}%</span></td>
      <td style={tdStyle}><span style={{ fontSize: 12, fontWeight: 600, color: METRIC_COLORS.quiz }}>{fmt(s.quizCompletionPercentage)}%</span></td>
      <td style={tdStyle}><span style={{ fontSize: 12, fontWeight: 600, color: METRIC_COLORS.assignment }}>{fmt(s.assignmentCompletionPercentage)}%</span></td>
      <td style={tdStyle}>
        <span style={{
          fontSize: 11, fontWeight: 700, border: `1px solid ${oc}44`,
          borderRadius: 999, padding: "3px 9px", color: oc,
          boxShadow: isActive ? `0 0 8px ${oc}40` : "none",
          display: "inline-block",
        }}>
          {fmt(s.overallProgressPercentage)}%
        </span>
      </td>
    </tr>
  );
}

/* ─── Bar Row ────────────────────────────────────────────────────────────── */
function BarRow({ s, pal, isActive, t, oc, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "10px 10px", borderRadius: 12, cursor: "pointer",
        transition: "all .15s", marginBottom: 6,
        border: `1px solid ${isActive ? "rgba(34,211,238,0.25)" : hov ? t.borderHov : "transparent"}`,
        background: isActive ? t.activeRowBg : hov ? t.recentItemBgHov : "transparent",
      }}>
      <div style={{ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, background: pal.bg, color: pal.text, flexShrink: 0 }}>
        {initials(s.studentEmail)}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: t.text, margin: "0 0 5px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {s.studentEmail}
        </p>
        <div style={{ height: 5, background: t.barBg, borderRadius: 3, overflow: "hidden" }}>
          <div style={{ height: 5, width: `${Math.min(s.overallProgressPercentage || 0, 100)}%`, background: oc, borderRadius: 3, boxShadow: `0 0 6px ${oc}80`, transition: "width .8s cubic-bezier(0.4,0,0.2,1)" }} />
        </div>
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color: oc, flexShrink: 0, width: 38, textAlign: "right" }}>
        {fmt(s.overallProgressPercentage)}%
      </span>
    </div>
  );
}

/* ─── Student Detail Panel ───────────────────────────────────────────────── */
function StudentDetail({ student, selectedBatchId, t, isDark }) {
  const oc = progColor(student.overallProgressPercentage);
  const metrics = [
    { label: "Videos", val: student.videoWatchPercentage, color: METRIC_COLORS.video, sub: `${student.videosWatched ?? 0}/${student.totalVideos ?? 0}` },
    { label: "Files", val: student.fileDownloadPercentage, color: METRIC_COLORS.file, sub: `${student.filesDownloaded ?? 0}/${student.totalFiles ?? 0}` },
    { label: "Quizzes", val: student.quizCompletionPercentage, color: METRIC_COLORS.quiz, sub: `${student.quizzesCompleted ?? 0}/${student.totalQuizzes ?? 0}` },
    { label: "Assignments", val: student.assignmentCompletionPercentage, color: METRIC_COLORS.assignment, sub: `${student.assignmentsCompleted ?? 0}/${student.totalAssignments ?? 0}` },
    { label: "Course", val: student.courseProgressPercentage, color: METRIC_COLORS.course, sub: `${student.courseContentCompleted ?? 0}/${student.totalCourseContent ?? 0}` },
  ];
  return (
    <div style={{ padding: 22 }}>
      {/* Top banner */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18, paddingBottom: 16, borderBottom: `1px solid ${t.border}`, flexWrap: "wrap" }}>
        <div style={{ width: 44, height: 44, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, background: AV_PALETTES[0].bg, color: AV_PALETTES[0].text, flexShrink: 0 }}>
          {initials(student.studentEmail)}
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 14, fontWeight: 700, margin: "0 0 4px", color: t.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {student.studentEmail}
          </h3>
          <span style={{ fontSize: 10, background: t.pillBg, border: `1px solid ${t.pillBorder}`, padding: "2px 10px", borderRadius: 999, color: t.textMuted }}>
            Batch {student.batchId || selectedBatchId}
          </span>
        </div>
        {/* Overall donut */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, marginLeft: "auto" }}>
          <div style={{ position: "relative", width: 72, height: 72 }}>
            <DonutRing value={student.overallProgressPercentage || 0} color={oc} size={72} strokeW={6} />
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontSize: 13, fontWeight: 700, color: oc, fontFamily: "'Poppins',sans-serif" }}>
              {fmt(student.overallProgressPercentage)}%
            </div>
          </div>
          <span style={{ fontSize: 9, color: t.textMuted, letterSpacing: "0.1em", textTransform: "uppercase" }}>overall</span>
        </div>
      </div>

      {/* Metric cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8, marginBottom: 16 }} className="br-metrics-grid">
        {metrics.map((m) => (
          <MetricMini key={m.label} m={m} t={t} />
        ))}
      </div>

      {/* Lower: breakdown + radar */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 14 }} className="br-lower-grid">
        <div style={{ background: t.recentItemBg, border: `1px solid ${t.border}`, borderRadius: 14, padding: 16 }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: t.textLabel, margin: "0 0 12px" }}>
            Breakdown
          </p>
          {metrics.map((m) => (
            <ProgressRow key={m.label} label={m.label} val={m.val} color={m.color} t={t} />
          ))}
        </div>
        <div style={{ background: t.recentItemBg, border: `1px solid ${t.border}`, borderRadius: 14, padding: 16, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: t.textLabel, margin: "0 0 8px", alignSelf: "flex-start" }}>
            Skill Radar
          </p>
          <RadarChart data={student} isDark={isDark} />
        </div>
      </div>
    </div>
  );
}

/* ─── Metric Mini Card ───────────────────────────────────────────────────── */
function MetricMini({ m, t }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? t.recentItemBgHov : t.recentItemBg,
        border: `1px solid ${hov ? t.borderHov : t.border}`,
        borderRadius: 12, padding: "10px 6px 8px", textAlign: "center",
        transition: "all .2s", transform: hov ? "translateY(-2px)" : "none",
      }}>
      <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 18, fontWeight: 700, color: m.color, margin: "0 0 3px" }}>
        {fmt(m.val)}%
      </p>
      <p style={{ fontSize: 10, fontWeight: 700, color: t.textMuted, margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {m.label}
      </p>
      <p style={{ fontSize: 10, color: t.textLabel, margin: 0 }}>{m.sub}</p>
    </div>
  );
}

/* ─── Progress Row ───────────────────────────────────────────────────────── */
function ProgressRow({ label, val, color, t }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
      <span style={{ fontSize: 11, color: t.textSub, width: 95, flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, height: 5, background: t.barBg, borderRadius: 3, overflow: "hidden" }}>
        <div style={{ height: 5, width: `${Math.min(val || 0, 100)}%`, background: color, borderRadius: 3, boxShadow: `0 0 6px ${color}80`, transition: "width .8s cubic-bezier(0.4,0,0.2,1)" }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color, width: 38, textAlign: "right" }}>{fmt(val)}%</span>
    </div>
  );
}

/* ─── Loader ─────────────────────────────────────────────────────────────── */
function Loader({ t, text }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, color: t.textMuted, fontSize: 13 }}>
      <div style={{ width: 20, height: 20, borderRadius: "50%", border: "2px solid rgba(167,139,250,0.2)", borderTopColor: "#a78bfa", animation: "brspin .8s linear infinite" }} />
      <span>{text}</span>
    </div>
  );
}

/* ─── Styles ─────────────────────────────────────────────────────────────── */
function styles(t) {
  return `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
    @keyframes br-fade{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
    .br-fade{animation:br-fade .4s ease both}
    @keyframes brspin{to{transform:rotate(360deg)}}
    * { box-sizing: border-box; }
    .br-scroll::-webkit-scrollbar { width: 3px; height: 3px; }
    .br-scroll::-webkit-scrollbar-track { background: transparent; }
    .br-scroll::-webkit-scrollbar-thumb { background: ${t.scrollbar}; border-radius: 3px; }
    @media(max-width:1100px){ .br-stats-grid{ grid-template-columns: repeat(3,1fr) !important; } }
    @media(max-width:700px){ .br-stats-grid{ grid-template-columns: repeat(2,1fr) !important; } }
    @media(max-width:900px){ .br-main-grid{ grid-template-columns: 1fr !important; } }
    @media(max-width:600px){ .br-metrics-grid{ grid-template-columns: repeat(3,1fr) !important; } }
    @media(max-width:600px){ .br-lower-grid{ grid-template-columns: 1fr !important; } }
  `;
}