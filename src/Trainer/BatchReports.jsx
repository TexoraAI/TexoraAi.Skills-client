import { useState, useEffect } from "react";
import { Users, BarChart3 } from "lucide-react";
import { progressService } from "../services/progressService";
import { getTrainerBatches } from "../services/batchService";

// ── Global Design System — same tokens/components as the Trainer
// Dashboard / Attendance page (Golden Reference). Nothing here should
// diverge from what's exported below.
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
} from "@/design-system";

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

/* ─── Page-local layout helpers (token-driven, mirrors Attendance.jsx) ──── */
function IconBadge({ icon: Icon, color, size = 34, iconSize = 15 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: RADIUS.chip, display: "flex", alignItems: "center", justifyContent: "center", background: `${color}18`, border: `1px solid ${color}30`, flexShrink: 0 }}>
      <Icon size={iconSize} color={color} />
    </div>
  );
}
function SectionCard({ t, children, style }) {
  return (
    <div style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: RADIUS.standardCard, boxShadow: t.shadow, overflow: "hidden", position: "relative", ...style }}>
      {children}
    </div>
  );
}
function SectionHeader({ t, icon: Icon, color, title, sub, right }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: `1px solid ${t.border}`, flexWrap: "wrap", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <IconBadge icon={Icon} color={color} />
        <div>
          <div style={{ fontFamily: FONT_FAMILY, fontWeight: FONT_WEIGHT.bold, fontSize: 13, color: t.text }}>{title}</div>
          {sub && <div style={{ fontSize: 11, color: t.textMuted, fontFamily: FONT_FAMILY, marginTop: 2 }}>{sub}</div>}
        </div>
      </div>
      {right}
    </div>
  );
}
function EmptyBlock({ t, icon: Icon, title, sub }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "56px 20px", gap: 12, textAlign: "center" }}>
      <div style={{ width: 52, height: 52, borderRadius: 15, display: "flex", alignItems: "center", justifyContent: "center", border: `1.5px dashed ${t.emptyBorder}`, background: t.emptyBg }}>
        <Icon size={22} color={t.emptyIcon} />
      </div>
      <p style={{ fontSize: 13, fontWeight: 700, color: t.text, margin: 0, fontFamily: FONT_FAMILY }}>{title}</p>
      {sub && <p style={{ fontSize: 12, color: t.textMuted, maxWidth: 280, lineHeight: 1.6, margin: 0, fontFamily: FONT_FAMILY }}>{sub}</p>}
    </div>
  );
}
function Loader({ t, text }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, color: t.textMuted, fontSize: 13, fontFamily: FONT_FAMILY }}>
      <span style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${ACCENT_PURPLE.base}33`, borderTopColor: ACCENT_PURPLE.base, display: "inline-block", animation: "brspin .8s linear infinite" }} />
      <span>{text}</span>
    </div>
  );
}

/* ─── Donut Ring ─────────────────────────────────────────────────────────── */
function DonutRing({ value, color, size = 56, strokeW = 5 }) {
  const r = (size - strokeW * 2) / 2;
  const circ = 2 * Math.PI * r;
  const progress = (value / 100) * circ;
  const cx = size / 2, cy = size / 2;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)", filter: `drop-shadow(0 0 8px ${color}60)` }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(128,128,128,0.15)" strokeWidth={strokeW} />
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
        <polygon key={ring} points={axes.map((_, i) => pt(i, ring).join(",")).join(" ")} fill="none" stroke={ringStroke} strokeWidth="1" />
      ))}
      {axes.map((_, i) => {
        const [x2, y2] = pt(i, 100);
        return <line key={i} x1={cx} y1={cy} x2={x2} y2={y2} stroke={ringStroke} strokeWidth="1" />;
      })}
      <polygon points={poly} fill={radarFill} stroke={radarStroke} strokeWidth="1.5" />
      {axes.map((a, i) => {
        const [x, y] = pt(i, a.val);
        return <circle key={i} cx={x} cy={y} r={3} fill={radarStroke} style={{ filter: `drop-shadow(0 0 4px ${radarStroke})` }} />;
      })}
      {axes.map((a, i) => {
        const [x, y] = pt(i, 115);
        return (
          <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fontSize="10" fill={labelColor} fontFamily={FONT_FAMILY}>
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

  if (batchesLoading) return (
    <PageContainer mode={isDark ? "dark" : "light"} pageBg={t.pageBg} textColor={t.text}>
      <style>{styles()}</style>
      <div style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader t={t} text="Loading..." />
      </div>
    </PageContainer>
  );

  const statCards = report ? [
    { label: "Total Students", val: report.totalStudents, raw: true, color: t.text },
    { label: "Avg Overall", val: report.avgOverallProgressPercentage, color: progColor(report.avgOverallProgressPercentage) },
    { label: "Avg Video", val: report.avgVideoWatchPercentage, color: METRIC_COLORS.video },
    { label: "Avg Files", val: report.avgFileDownloadPercentage, color: METRIC_COLORS.file },
    { label: "Avg Quizzes", val: report.avgQuizCompletionPercentage, color: METRIC_COLORS.quiz },
    { label: "Avg Assignments", val: report.avgAssignmentCompletionPercentage, color: METRIC_COLORS.assignment },
  ] : [];

  return (
    <PageContainer mode={isDark ? "dark" : "light"} pageBg={t.pageBg} textColor={t.text}>
      <style>{styles()}</style>

      {/* ═══ HERO — shared component, matches Golden Reference exactly ═══ */}
      <Hero borderHero={t.borderHero}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: ACCENT_PURPLE.base }} />
            <span style={{ fontSize: FONT_SIZE.eyebrow, fontWeight: FONT_WEIGHT.bold, letterSpacing: LETTER_SPACING.eyebrowWide, textTransform: "uppercase", color: t.textSub, fontFamily: FONT_FAMILY }}>
              Batch Analytics
            </span>
          </div>
          <h1 style={{ fontFamily: FONT_FAMILY, fontWeight: FONT_WEIGHT.heroTitle, fontSize: FONT_SIZE.heroTitle, color: ACCENT_PURPLE.base, margin: "0 0 6px", lineHeight: LINE_HEIGHT.heroTitle, letterSpacing: LETTER_SPACING.heroTitle }}>
            Batch Progress Report
          </h1>
          <p style={{ fontSize: FONT_SIZE.bodySmall, color: t.textSub, margin: 0, fontWeight: FONT_WEIGHT.medium, fontFamily: FONT_FAMILY }}>
            Monitor cohort performance and individual learner progress
          </p>
        </div>

        <div className="hero-badges" style={{ flexWrap: "wrap" }}>
          {batches.map((b) => {
            const active = selectedBatchId === b.id;
            return (
              <button key={b.id} onClick={() => setSelectedBatchId(b.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "8px 18px", borderRadius: RADIUS.pill, fontSize: 12, fontWeight: 600,
                  cursor: "pointer", fontFamily: FONT_FAMILY, transition: "all .2s",
                  border: `1px solid ${active ? `${ACCENT_PURPLE.base}66` : t.pillBorder}`,
                  background: active ? `${ACCENT_PURPLE.base}18` : t.pillBg,
                  color: active ? ACCENT_PURPLE.base : t.textMuted,
                }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor" }} />
                Batch {b.id}
              </button>
            );
          })}
        </div>
      </Hero>

      {reportLoading && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200 }}>
          <Loader t={t} text="Loading batch data…" />
        </div>
      )}
      {reportError && (
        <SectionCard t={t} style={{ marginBottom: 20 }}>
          <div style={{ padding: 20, textAlign: "center", fontSize: 13, color: "#ef4444", fontFamily: FONT_FAMILY }}>{reportError}</div>
        </SectionCard>
      )}

      {!reportLoading && !reportError && report && (
        <>
          {/* ═══ STAT CARDS ROW ═══ */}
          <div className="stat-grid br-stats-grid" style={{ marginBottom: 20 }}>
            {statCards.map((m) => (
              <MetricCard key={m.label} m={m} t={t} />
            ))}
          </div>

          {/* ═══ MAIN TWO-COLUMN GRID ═══ */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "start" }} className="br-main-grid">

            {/* LEFT: student list */}
            <SectionCard t={t}>
              <div style={{ display: "flex", alignItems: "center", padding: "0 16px", borderBottom: `1px solid ${t.border}` }}>
                {["table", "bars"].map((tabKey) => {
                  const active = tab === tabKey;
                  return (
                    <button key={tabKey} onClick={() => setTab(tabKey)}
                      style={{
                        padding: "14px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer",
                        color: active ? ACCENT_PURPLE.base : t.textMuted,
                        border: "none", borderBottom: `2px solid ${active ? ACCENT_PURPLE.base : "transparent"}`,
                        marginBottom: -1, background: "none",
                        fontFamily: FONT_FAMILY, transition: "all .15s", letterSpacing: "0.03em",
                      }}>
                      {tabKey === "table" ? "↗ Table" : "▦ Bars"}
                    </button>
                  );
                })}
                <span style={{ marginLeft: "auto", fontSize: 11, color: t.textMuted, fontFamily: FONT_FAMILY }}>
                  {students.length} students
                </span>
              </div>

              {students.length === 0 && (
                <EmptyBlock t={t} icon={Users} title="No students in this batch" />
              )}

              {tab === "table" && students.length > 0 && (
                <div style={{ overflowX: "auto", maxHeight: 520, overflowY: "auto" }} className="br-scroll">
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        {["Student", "Videos", "Files", "Quizzes", "Assign.", "Overall"].map((th) => (
                          <th key={th} style={{
                            fontSize: 10, fontWeight: 700, color: t.textMuted, fontFamily: FONT_FAMILY,
                            textTransform: "uppercase", letterSpacing: "0.08em",
                            padding: "12px 14px", textAlign: "left",
                            borderBottom: `1px solid ${t.border}`,
                            background: t.actBg,
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
            </SectionCard>

            {/* RIGHT: Detail panel */}
            <SectionCard t={t} style={{ minHeight: 400 }}>
              {!selectedStudent && (
                <EmptyBlock t={t} icon={Users} title="No student selected" sub="Click a student to see their detailed report" />
              )}
              {selectedStudent && (
                <StudentDetail student={selectedStudent} selectedBatchId={selectedBatchId} t={t} isDark={isDark} />
              )}
            </SectionCard>
          </div>
        </>
      )}
    </PageContainer>
  );
}

/* ─── Metric Card (donut-based average stat) ─── */
function MetricCard({ m, t }) {
  return (
    <div style={{
      background: t.cardBg, border: `1px solid ${t.border}`, boxShadow: t.shadow,
      borderRadius: RADIUS.standardCard, padding: "16px 14px", textAlign: "center",
      display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
      position: "relative", overflow: "hidden",
    }}>
      {m.raw ? (
        <p style={{ fontFamily: FONT_FAMILY, fontSize: 30, fontWeight: 800, lineHeight: 1, color: t.text, margin: "6px 0 2px" }}>
          {m.val}
        </p>
      ) : (
        <>
          <DonutRing value={m.val || 0} color={m.color} size={52} strokeW={5} />
          <p style={{ fontSize: 11, fontWeight: 700, color: m.color, margin: 0, fontFamily: FONT_FAMILY }}>
            {fmt(m.val)}%
          </p>
        </>
      )}
      <p style={{ fontSize: 10, fontWeight: 600, color: t.textMuted, margin: 0, textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: FONT_FAMILY }}>
        {m.label}
      </p>
    </div>
  );
}

/* ─── Table Row ──────────────────────────────────────────────────────────── */
function TableRow({ s, pal, isActive, t, oc, onClick }) {
  const tdStyle = {
    padding: "10px 14px",
    borderBottom: `1px solid ${t.border}`,
    fontSize: 12, color: t.textSub, verticalAlign: "middle", cursor: "pointer",
    background: isActive ? `${ACCENT_PURPLE.base}0d` : "transparent",
    fontFamily: FONT_FAMILY,
  };
  return (
    <tr onClick={onClick}>
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
        <span style={{ fontSize: 11, fontWeight: 700, border: `1px solid ${oc}44`, borderRadius: RADIUS.pill, padding: "3px 9px", color: oc, display: "inline-block" }}>
          {fmt(s.overallProgressPercentage)}%
        </span>
      </td>
    </tr>
  );
}

/* ─── Bar Row ────────────────────────────────────────────────────────────── */
function BarRow({ s, pal, isActive, t, oc, onClick }) {
  return (
    <div onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: "10px 10px", borderRadius: RADIUS.chip, cursor: "pointer",
      marginBottom: 6,
      border: `1px solid ${isActive ? `${ACCENT_PURPLE.base}40` : "transparent"}`,
      background: isActive ? `${ACCENT_PURPLE.base}0d` : "transparent",
    }}>
      <div style={{ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, background: pal.bg, color: pal.text, flexShrink: 0 }}>
        {initials(s.studentEmail)}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: t.text, margin: "0 0 5px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontFamily: FONT_FAMILY }}>
          {s.studentEmail}
        </p>
        <div style={{ height: 5, background: t.barBg, borderRadius: 3, overflow: "hidden" }}>
          <div style={{ height: 5, width: `${Math.min(s.overallProgressPercentage || 0, 100)}%`, background: oc, borderRadius: 3, transition: "width .8s cubic-bezier(0.4,0,0.2,1)" }} />
        </div>
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color: oc, flexShrink: 0, width: 38, textAlign: "right", fontFamily: FONT_FAMILY }}>
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
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18, paddingBottom: 16, borderBottom: `1px solid ${t.border}`, flexWrap: "wrap" }}>
        <div style={{ width: 44, height: 44, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, background: AV_PALETTES[0].bg, color: AV_PALETTES[0].text, flexShrink: 0 }}>
          {initials(student.studentEmail)}
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontFamily: FONT_FAMILY, fontSize: 14, fontWeight: 700, margin: "0 0 4px", color: t.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {student.studentEmail}
          </h3>
          <span style={{ fontSize: 10, background: t.pillBg, border: `1px solid ${t.pillBorder}`, padding: "2px 10px", borderRadius: RADIUS.pill, color: t.textMuted, fontFamily: FONT_FAMILY }}>
            Batch {student.batchId || selectedBatchId}
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, marginLeft: "auto" }}>
          <div style={{ position: "relative", width: 72, height: 72 }}>
            <DonutRing value={student.overallProgressPercentage || 0} color={oc} size={72} strokeW={6} />
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontSize: 13, fontWeight: 700, color: oc, fontFamily: FONT_FAMILY }}>
              {fmt(student.overallProgressPercentage)}%
            </div>
          </div>
          <span style={{ fontSize: 9, color: t.textMuted, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: FONT_FAMILY }}>overall</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8, marginBottom: 16 }} className="br-metrics-grid">
        {metrics.map((m) => <MetricMini key={m.label} m={m} t={t} />)}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 14 }} className="br-lower-grid">
        <div style={{ background: t.actBg, border: `1px solid ${t.border}`, borderRadius: RADIUS.standardCard, padding: 16 }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: t.textMuted, margin: "0 0 12px", fontFamily: FONT_FAMILY }}>
            Breakdown
          </p>
          {metrics.map((m) => <ProgressRow key={m.label} label={m.label} val={m.val} color={m.color} t={t} />)}
        </div>
        <div style={{ background: t.actBg, border: `1px solid ${t.border}`, borderRadius: RADIUS.standardCard, padding: 16, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: t.textMuted, margin: "0 0 8px", alignSelf: "flex-start", fontFamily: FONT_FAMILY }}>
            Skill Radar
          </p>
          <RadarChart data={student} isDark={isDark} />
        </div>
      </div>
    </div>
  );
}

function MetricMini({ m, t }) {
  return (
    <div style={{ background: t.actBg, border: `1px solid ${t.border}`, borderRadius: RADIUS.chip, padding: "10px 6px 8px", textAlign: "center" }}>
      <p style={{ fontFamily: FONT_FAMILY, fontSize: 18, fontWeight: 700, color: m.color, margin: "0 0 3px" }}>{fmt(m.val)}%</p>
      <p style={{ fontSize: 10, fontWeight: 700, color: t.textMuted, margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: FONT_FAMILY }}>{m.label}</p>
      <p style={{ fontSize: 10, color: t.textMuted, margin: 0, fontFamily: FONT_FAMILY }}>{m.sub}</p>
    </div>
  );
}

function ProgressRow({ label, val, color, t }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
      <span style={{ fontSize: 11, color: t.textSub, width: 95, flexShrink: 0, fontFamily: FONT_FAMILY }}>{label}</span>
      <div style={{ flex: 1, height: 5, background: t.barBg, borderRadius: 3, overflow: "hidden" }}>
        <div style={{ height: 5, width: `${Math.min(val || 0, 100)}%`, background: color, borderRadius: 3, transition: "width .8s cubic-bezier(0.4,0,0.2,1)" }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color, width: 38, textAlign: "right", fontFamily: FONT_FAMILY }}>{fmt(val)}%</span>
    </div>
  );
}

/* ─── Local page styles (layout/animation only — colors come from T) ─── */
function styles() {
  return `
    @keyframes brspin{to{transform:rotate(360deg)}}
    * { box-sizing: border-box; }
    .br-scroll::-webkit-scrollbar { width: 3px; height: 3px; }
    .br-scroll::-webkit-scrollbar-track { background: transparent; }
    .br-scroll::-webkit-scrollbar-thumb { background: rgba(128,128,128,0.3); border-radius: 3px; }
    .br-stats-grid { grid-template-columns: repeat(6,1fr) !important; }
    @media(max-width:1100px){ .br-stats-grid{ grid-template-columns: repeat(3,1fr) !important; } }
    @media(max-width:700px){ .br-stats-grid{ grid-template-columns: repeat(2,1fr) !important; } }
    @media(max-width:900px){ .br-main-grid{ grid-template-columns: 1fr !important; } }
    @media(max-width:600px){ .br-metrics-grid{ grid-template-columns: repeat(3,1fr) !important; } }
    @media(max-width:600px){ .br-lower-grid{ grid-template-columns: 1fr !important; } }
  `;
}