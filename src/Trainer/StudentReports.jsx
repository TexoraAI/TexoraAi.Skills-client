import { useState, useEffect, useRef } from "react";
import { progressService } from "../services/progressService";
import { getTrainerBatches } from "../services/batchService";

function fmt(v) {
  return typeof v === "number" ? Math.round(v) : 0;
}
function progColor(v) {
  return v >= 75 ? "#00FFB2" : v >= 50 ? "#FFB800" : "#FF4D6D";
}
function progGlow(v) {
  return v >= 75
    ? "0 0 20px rgba(0,255,178,0.5)"
    : v >= 50
      ? "0 0 20px rgba(255,184,0,0.5)"
      : "0 0 20px rgba(255,77,109,0.5)";
}
function initials(email = "") {
  const name = email.split("@")[0];
  const parts = name.split(/[._-]/);
  return parts.length > 1
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
}

const AV_COLORS = [
  { bg: "linear-gradient(135deg,#00FFB2,#00C87A)", text: "#003D24" },
  { bg: "linear-gradient(135deg,#A78BFA,#7C3AED)", text: "#EDE9FE" },
  { bg: "linear-gradient(135deg,#FB923C,#DC2626)", text: "#FFF7ED" },
  { bg: "linear-gradient(135deg,#38BDF8,#0369A1)", text: "#E0F2FE" },
  { bg: "linear-gradient(135deg,#FBBF24,#D97706)", text: "#1C1917" },
];

function RadarChart({ data }) {
  const axes = [
    { label: "Videos", val: data.videoWatchPercentage ?? 0 },
    { label: "Files", val: data.fileDownloadPercentage ?? 0 },
    { label: "Quizzes", val: data.quizCompletionPercentage ?? 0 },
    { label: "Assignments", val: data.assignmentCompletionPercentage ?? 0 },
    { label: "Course", val: data.courseProgressPercentage ?? 0 },
  ];
  const N = axes.length;
  const cx = 140,
    cy = 130,
    r = 90;
  const ang = (i) => (Math.PI * 2 * i) / N - Math.PI / 2;
  const pt = (i, pct) => {
    const a = ang(i);
    const d = (pct / 100) * r;
    return [cx + d * Math.cos(a), cy + d * Math.sin(a)];
  };
  const rings = [20, 40, 60, 80, 100];
  const poly = axes.map((a, i) => pt(i, a.val).join(",")).join(" ");
  return (
    <svg
      viewBox="0 0 280 260"
      style={{
        width: "100%",
        maxWidth: 280,
        filter: "drop-shadow(0 0 12px rgba(0,255,178,0.2))",
      }}
    >
      <defs>
        <radialGradient id="rfill" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00FFB2" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#00FFB2" stopOpacity="0.05" />
        </radialGradient>
      </defs>
      {rings.map((ring) => (
        <polygon
          key={ring}
          points={axes.map((_, i) => pt(i, ring).join(",")).join(" ")}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth="1"
        />
      ))}
      {axes.map((_, i) => {
        const [x2, y2] = pt(i, 100);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={x2}
            y2={y2}
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="1"
          />
        );
      })}
      <polygon
        points={poly}
        fill="url(#rfill)"
        stroke="#00FFB2"
        strokeWidth="2"
      />
      {axes.map((a, i) => {
        const [x, y] = pt(i, a.val);
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={4}
            fill="#00FFB2"
            style={{ filter: "drop-shadow(0 0 6px #00FFB2)" }}
          />
        );
      })}
      {axes.map((a, i) => {
        const [x, y] = pt(i, 118);
        return (
          <text
            key={i}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="10"
            fill="rgba(255,255,255,0.6)"
            fontFamily="'Space Grotesk',sans-serif"
          >
            {a.label}
          </text>
        );
      })}
    </svg>
  );
}

function ArcMeter({ value, color, size = 100 }) {
  const r = 38,
    cx = 50,
    cy = 52;
  const circ = Math.PI * r;
  const progress = (value / 100) * circ;
  return (
    <svg viewBox="0 0 100 60" style={{ width: size, height: size * 0.6 }}>
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={`${progress} ${circ}`}
        style={{
          filter: `drop-shadow(0 0 8px ${color})`,
          transition: "stroke-dasharray 1s ease",
        }}
      />
      <text
        x={cx}
        y={cy - 4}
        textAnchor="middle"
        fontSize="14"
        fontWeight="700"
        fill={color}
        fontFamily="'Space Grotesk',sans-serif"
      >
        {fmt(value)}%
      </text>
    </svg>
  );
}

export default function StudentReports() {
  const [batches, setBatches] = useState([]);
  const [batchesLoading, setBatchesLoading] = useState(true);
  const [batchesError, setBatchesError] = useState(null);
  const [selectedBatchId, setSelectedBatchId] = useState(null);
  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentsError, setStudentsError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentDetail, setStudentDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getTrainerBatches()
      .then((data) => {
        const list = data || [];
        setBatches(list);
        if (list.length > 0) setSelectedBatchId(list[0].id);
        setBatchesLoading(false);
      })
      .catch((err) => {
        setBatchesError(err.message);
        setBatchesLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!selectedBatchId) return;
    setStudentsLoading(true);
    setStudentsError(null);
    setStudents([]);
    setSelectedStudent(null);
    setStudentDetail(null);
    progressService
      .getBatchProgressReport(selectedBatchId)
      .then((res) => {
        setStudents(res.data?.studentReports || []);
        setStudentsLoading(false);
      })
      .catch((err) => {
        setStudentsError(err.response?.data?.message || err.message);
        setStudentsLoading(false);
      });
  }, [selectedBatchId]);

  useEffect(() => {
    if (!selectedStudent) return;
    setDetailLoading(true);
    progressService
      .getStudentProgressInBatch(
        selectedStudent.batchId || selectedBatchId,
        selectedStudent.studentEmail,
      )
      .then((res) => {
        setStudentDetail(res.data);
        setDetailLoading(false);
      })
      .catch(() => {
        setStudentDetail(selectedStudent);
        setDetailLoading(false);
      });
  }, [selectedStudent]);

  const filtered = students.filter((s) =>
    s.studentEmail.toLowerCase().includes(search.toLowerCase()),
  );

  if (batchesLoading)
    return (
      <>
        <style>{css}</style>
        <div className="sr-wrap">
          <div className="sr-loader">
            <div className="sr-spinner" />
            <span>Loading...</span>
          </div>
        </div>
      </>
    );

  const detail = studentDetail || selectedStudent;

  return (
    <>
      <style>{css}</style>
      <div className="sr-wrap">
        {/* Header */}
        <div className="sr-header">
          <div className="sr-header-left">
            <div className="sr-title-badge">ANALYTICS</div>
            <h1 className="sr-title">Student Reports</h1>
            <p className="sr-subtitle">
              Track individual learner progress across all metrics
            </p>
          </div>
          <div className="sr-batch-row">
            {batches.map((b) => (
              <button
                key={b.id}
                className={`sr-batch-btn${selectedBatchId === b.id ? " active" : ""}`}
                onClick={() => setSelectedBatchId(b.id)}
              >
                <span className="sr-batch-dot" />
                Batch {b.id}
              </button>
            ))}
          </div>
        </div>

        {/* Main grid - two columns */}
        <div className="sr-grid">
          {/* LEFT: Student list */}
          <div className="sr-panel sr-panel-left">
            <div className="sr-panel-header">
              <span className="sr-panel-title">Students</span>
              <span className="sr-count-badge">{filtered.length}</span>
            </div>
            <div className="sr-search-wrap">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                className="sr-search"
                placeholder="Search email…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {studentsLoading && (
              <div className="sr-loading-rows">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="sr-skel" />
                ))}
              </div>
            )}
            {studentsError && <div className="sr-err">{studentsError}</div>}
            <div className="sr-student-list">
              {filtered.map((s, i) => {
                const col = AV_COLORS[i % 5];
                const isActive =
                  selectedStudent?.studentEmail === s.studentEmail;
                return (
                  <div
                    key={s.studentEmail}
                    className={`sr-student-card${isActive ? " active" : ""}`}
                    onClick={() => setSelectedStudent(s)}
                  >
                    <div
                      className="sr-av"
                      style={{ background: col.bg, color: col.text }}
                    >
                      {initials(s.studentEmail)}
                    </div>
                    <div className="sr-student-info">
                      <p className="sr-student-email">{s.studentEmail}</p>
                      <div className="sr-mini-bars">
                        {[
                          { val: s.videoWatchPercentage, color: "#00FFB2" },
                          { val: s.quizCompletionPercentage, color: "#A78BFA" },
                          {
                            val: s.assignmentCompletionPercentage,
                            color: "#FB923C",
                          },
                        ].map((m, mi) => (
                          <div key={mi} className="sr-mini-track">
                            <div
                              className="sr-mini-fill"
                              style={{
                                width: `${Math.min(m.val || 0, 100)}%`,
                                background: m.color,
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div
                      className="sr-overall-pill"
                      style={{
                        color: progColor(s.overallProgressPercentage),
                        borderColor:
                          progColor(s.overallProgressPercentage) + "44",
                        boxShadow: progGlow(s.overallProgressPercentage),
                      }}
                    >
                      {fmt(s.overallProgressPercentage)}%
                    </div>
                    {isActive && <div className="sr-active-arrow">›</div>}
                  </div>
                );
              })}
              {!studentsLoading && filtered.length === 0 && (
                <div className="sr-empty">No students found</div>
              )}
            </div>
          </div>

          {/* RIGHT: Detail */}
          <div className="sr-panel sr-panel-right">
            {!selectedStudent && (
              <div className="sr-placeholder">
                <div className="sr-placeholder-icon">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="rgba(0,255,178,0.3)"
                    strokeWidth="1.5"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <p className="sr-placeholder-text">
                  Select a student to view detailed progress
                </p>
              </div>
            )}

            {selectedStudent && detailLoading && (
              <div className="sr-loader">
                <div className="sr-spinner" />
                <span>Loading report…</span>
              </div>
            )}

            {selectedStudent && !detailLoading && detail && (
              <div className="sr-detail-content">
                {/* Student banner */}
                <div className="sr-detail-banner">
                  <div
                    className="sr-detail-avatar"
                    style={{
                      background: AV_COLORS[0].bg,
                      color: AV_COLORS[0].text,
                    }}
                  >
                    {initials(detail.studentEmail)}
                  </div>
                  <div>
                    <h2 className="sr-detail-name">{detail.studentEmail}</h2>
                    <p className="sr-detail-batch">
                      Batch <strong>{detail.batchId || selectedBatchId}</strong>
                    </p>
                  </div>
                  <div
                    className="sr-detail-overall"
                    style={{
                      color: progColor(detail.overallProgressPercentage),
                      borderColor:
                        progColor(detail.overallProgressPercentage) + "55",
                      boxShadow: progGlow(detail.overallProgressPercentage),
                    }}
                  >
                    <span className="sr-detail-overall-num">
                      {fmt(detail.overallProgressPercentage)}%
                    </span>
                    <span className="sr-detail-overall-lbl">overall</span>
                  </div>
                </div>

                {/* Arc meters */}
                <div className="sr-arcs">
                  {[
                    {
                      label: "Videos",
                      val: detail.videoWatchPercentage,
                      color: "#00FFB2",
                      sub: `${detail.videosWatched ?? 0}/${detail.totalVideos ?? 0}`,
                    },
                    {
                      label: "Files",
                      val: detail.fileDownloadPercentage,
                      color: "#38BDF8",
                      sub: `${detail.filesDownloaded ?? 0}/${detail.totalFiles ?? 0}`,
                    },
                    {
                      label: "Quizzes",
                      val: detail.quizCompletionPercentage,
                      color: "#A78BFA",
                      sub: `${detail.quizzesCompleted ?? 0}/${detail.totalQuizzes ?? 0}`,
                    },
                    {
                      label: "Assignments",
                      val: detail.assignmentCompletionPercentage,
                      color: "#FB923C",
                      sub: `${detail.assignmentsCompleted ?? 0}/${detail.totalAssignments ?? 0}`,
                    },
                    {
                      label: "Course",
                      val: detail.courseProgressPercentage,
                      color: "#FBBF24",
                      sub: `${detail.courseContentCompleted ?? 0}/${detail.totalCourseContent ?? 0}`,
                    },
                  ].map((m) => (
                    <div key={m.label} className="sr-arc-card">
                      <ArcMeter value={m.val || 0} color={m.color} size={90} />
                      <p className="sr-arc-label">{m.label}</p>
                      <p className="sr-arc-sub">{m.sub}</p>
                    </div>
                  ))}
                </div>

                {/* Breakdown + Radar */}
                <div className="sr-bottom-grid">
                  <div className="sr-breakdown-card">
                    <p className="sr-card-title">Progress Breakdown</p>
                    {[
                      {
                        label: "Video watch",
                        val: detail.videoWatchPercentage,
                        color: "#00FFB2",
                      },
                      {
                        label: "File download",
                        val: detail.fileDownloadPercentage,
                        color: "#38BDF8",
                      },
                      {
                        label: "Quiz completion",
                        val: detail.quizCompletionPercentage,
                        color: "#A78BFA",
                      },
                      {
                        label: "Assignments",
                        val: detail.assignmentCompletionPercentage,
                        color: "#FB923C",
                      },
                      {
                        label: "Course content",
                        val: detail.courseProgressPercentage,
                        color: "#FBBF24",
                      },
                    ].map((m) => (
                      <div key={m.label} className="sr-brow">
                        <span className="sr-brow-lbl">{m.label}</span>
                        <div className="sr-brow-track">
                          <div
                            className="sr-brow-fill"
                            style={{
                              width: `${Math.min(m.val || 0, 100)}%`,
                              background: m.color,
                              boxShadow: `0 0 8px ${m.color}`,
                            }}
                          />
                        </div>
                        <span
                          className="sr-brow-pct"
                          style={{ color: m.color }}
                        >
                          {fmt(m.val)}%
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="sr-radar-card">
                    <p className="sr-card-title">Skill Radar</p>
                    <RadarChart data={detail} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Outfit:wght@300;400;600;700&display=swap');

.sr-wrap {
  font-family: 'Space Grotesk', sans-serif;
  background: #080C14;
  min-height: 100vh;
  padding: 2rem 1.5rem;
  color: #fff;
  background-image: radial-gradient(ellipse at 20% 10%, rgba(0,255,178,0.06) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(124,58,237,0.06) 0%, transparent 50%);
}

.sr-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 2rem;
}
.sr-title-badge {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.2em;
  color: #00FFB2;
  background: rgba(0,255,178,0.1);
  border: 1px solid rgba(0,255,178,0.2);
  padding: 3px 10px;
  border-radius: 20px;
  display: inline-block;
  margin-bottom: 8px;
}
.sr-title {
  font-family: 'Outfit', sans-serif;
  font-size: 26px;
  font-weight: 700;
  margin: 0 0 4px;
  background: linear-gradient(135deg, #fff 40%, rgba(255,255,255,0.5));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.sr-subtitle { font-size: 13px; color: rgba(255,255,255,0.4); margin: 0; }

.sr-batch-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
}
.sr-batch-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  border-radius: 50px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.04);
  color: rgba(255,255,255,0.5);
  font-family: 'Space Grotesk', sans-serif;
  transition: all 0.2s;
}
.sr-batch-btn:hover { border-color: rgba(0,255,178,0.4); color: #00FFB2; }
.sr-batch-btn.active {
  background: rgba(0,255,178,0.12);
  border-color: #00FFB2;
  color: #00FFB2;
  box-shadow: 0 0 20px rgba(0,255,178,0.15);
}
.sr-batch-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.sr-grid {
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 16px;
  align-items: start;
}
@media(max-width:900px){ .sr-grid{ grid-template-columns:1fr; } }

.sr-panel {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 20px;
  overflow: hidden;
  backdrop-filter: blur(20px);
  position: relative;
}
.sr-panel::before {
  content:'';
  position:absolute;
  top:0;left:0;right:0;
  height:1px;
  background: linear-gradient(90deg, transparent, rgba(0,255,178,0.3), transparent);
}

.sr-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px 12px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.sr-panel-title { font-size: 13px; font-weight: 600; letter-spacing: 0.05em; color: rgba(255,255,255,0.7); text-transform: uppercase; }
.sr-count-badge { font-size: 11px; background: rgba(0,255,178,0.15); color: #00FFB2; border-radius: 20px; padding: 2px 10px; font-weight: 600; }

.sr-search-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}
.sr-search {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  font-size: 13px;
  color: #fff;
  font-family: 'Space Grotesk', sans-serif;
}
.sr-search::placeholder { color: rgba(255,255,255,0.25); }

.sr-student-list { padding: 10px; max-height: 580px; overflow-y: auto; }
.sr-student-list::-webkit-scrollbar { width: 3px; }
.sr-student-list::-webkit-scrollbar-track { background: transparent; }
.sr-student-list::-webkit-scrollbar-thumb { background: rgba(0,255,178,0.2); border-radius: 3px; }

.sr-student-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
  margin-bottom: 6px;
  position: relative;
}
.sr-student-card:hover { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.08); }
.sr-student-card.active { background: rgba(0,255,178,0.06); border-color: rgba(0,255,178,0.2); box-shadow: 0 4px 20px rgba(0,255,178,0.08); }

.sr-av {
  width: 36px; height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
}
.sr-student-info { flex: 1; min-width: 0; }
.sr-student-email { font-size: 12px; font-weight: 500; color: rgba(255,255,255,0.85); margin: 0 0 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.sr-mini-bars { display: flex; gap: 4px; }
.sr-mini-track { flex: 1; height: 3px; background: rgba(255,255,255,0.08); border-radius: 2px; overflow: hidden; }
.sr-mini-fill { height: 3px; border-radius: 2px; transition: width 0.6s ease; }

.sr-overall-pill {
  font-size: 12px;
  font-weight: 700;
  border: 1px solid;
  border-radius: 20px;
  padding: 3px 10px;
  flex-shrink: 0;
}
.sr-active-arrow { font-size: 18px; color: #00FFB2; flex-shrink: 0; }

.sr-empty { text-align: center; padding: 3rem; color: rgba(255,255,255,0.2); font-size: 13px; }

/* RIGHT PANEL */
.sr-panel-right { min-height: 500px; }

.sr-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 500px;
  gap: 16px;
}
.sr-placeholder-icon {
  width: 80px; height: 80px;
  border-radius: 50%;
  background: rgba(0,255,178,0.05);
  border: 1px solid rgba(0,255,178,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}
.sr-placeholder-text { font-size: 13px; color: rgba(255,255,255,0.25); text-align: center; }

.sr-detail-content { padding: 24px; }

.sr-detail-banner {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}
.sr-detail-avatar {
  width: 52px; height: 52px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  flex-shrink: 0;
}
.sr-detail-name {
  font-family: 'Outfit', sans-serif;
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 3px;
  color: #fff;
}
.sr-detail-batch { font-size: 12px; color: rgba(255,255,255,0.4); margin: 0; }
.sr-detail-batch strong { color: rgba(255,255,255,0.7); }
.sr-detail-overall {
  margin-left: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 2px solid;
  border-radius: 16px;
  padding: 12px 20px;
  backdrop-filter: blur(10px);
}
.sr-detail-overall-num { font-family: 'Outfit', sans-serif; font-size: 28px; font-weight: 700; line-height: 1; }
.sr-detail-overall-lbl { font-size: 10px; color: rgba(255,255,255,0.4); margin-top: 3px; letter-spacing: 0.1em; text-transform: uppercase; }

.sr-arcs {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
  margin-bottom: 20px;
}
@media(max-width:700px){ .sr-arcs{ grid-template-columns:repeat(3,1fr); } }

.sr-arc-card {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 16px;
  padding: 12px 8px 10px;
  text-align: center;
  transition: transform 0.2s, border-color 0.2s;
}
.sr-arc-card:hover { transform: translateY(-2px); border-color: rgba(255,255,255,0.15); }
.sr-arc-label { font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.6); margin: 4px 0 2px; text-transform: uppercase; letter-spacing: 0.05em; }
.sr-arc-sub { font-size: 10px; color: rgba(255,255,255,0.3); margin: 0; }

.sr-bottom-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
@media(max-width:700px){ .sr-bottom-grid{ grid-template-columns:1fr; } }

.sr-breakdown-card, .sr-radar-card {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 16px;
  padding: 18px;
}
.sr-card-title {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.4);
  margin: 0 0 16px;
}

.sr-brow { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
.sr-brow:last-child { margin-bottom: 0; }
.sr-brow-lbl { font-size: 12px; color: rgba(255,255,255,0.5); width: 105px; flex-shrink: 0; }
.sr-brow-track { flex: 1; height: 6px; background: rgba(255,255,255,0.07); border-radius: 4px; overflow: hidden; }
.sr-brow-fill { height: 6px; border-radius: 4px; transition: width 0.8s cubic-bezier(0.4,0,0.2,1); }
.sr-brow-pct { font-size: 12px; font-weight: 700; width: 40px; text-align: right; }

.sr-radar-card { display: flex; flex-direction: column; align-items: center; }

.sr-loader {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  height: 300px;
  color: rgba(255,255,255,0.3);
  font-size: 13px;
}
.sr-spinner {
  width: 20px; height: 20px;
  border: 2px solid rgba(0,255,178,0.15);
  border-top-color: #00FFB2;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.sr-loading-rows { padding: 10px; }
.sr-skel {
  height: 60px;
  background: rgba(255,255,255,0.04);
  border-radius: 12px;
  margin-bottom: 8px;
  animation: skpulse 1.4s ease-in-out infinite;
}
@keyframes skpulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
.sr-err { color: #FF4D6D; font-size: 13px; padding: 20px; text-align: center; }
`;
